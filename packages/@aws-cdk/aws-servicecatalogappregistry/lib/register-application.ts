import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IApplication, Application } from './application';
import { RegisterApplicationStageStackAssociator } from './aspects/stack-associator';

/**
 * Properties for a Service Catalog AppRegistry AutoApplication
 */
export interface RegisterApplicationProps {
  /**
   * Enforces a particular physical application name.
   *
   * @default - No name.
   */
  readonly applicationName?: string;

  /**
   * Enforces a particular application arn.
   *
   * @default - No application arn.
   */
  readonly applicationArnValue?: string;

  /**
   * Application description.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * Stack properties.
   *
   */
  readonly stackProps: cdk.StackProps;
}

/**
 * An AppRegistry construct to automatically create an application with the given name and description.
 *
 * The application name must be unique at the account level and it's immutable.
 * This construct will automatically associate all stacks in the given scope, however
 * in case of a `Pipeline` stack, stage underneath the pipeline will not automatically be associated and
 * needs to be associated separately.
 *
 * If cross account stack is detected, then this construct will automatically share the application to consumer accounts.
 * Cross account feature will only work for non environment agnostic stacks.
 */
export class RegisterApplication extends Construct {
  /**
   * Created or imported application.
   */
  private readonly application: IApplication;
  private readonly associatedStages: Set<cdk.Stage> = new Set();

  constructor(scope: cdk.App, id: string, props: RegisterApplicationProps) {
    super(scope, id);

    const applicationStack = new cdk.Stack(scope, 'RegisterApplicationStack', props.stackProps);

    if (!!props.applicationArnValue) {
      this.application = Application.fromApplicationArn(applicationStack, 'ImportedApplication', props.applicationArnValue);
    } else if (!!props.applicationName) {
      this.application = new Application(applicationStack, 'DefaultCdkApplication', {
        applicationName: props.applicationName,
        description: props.description,
      });
    } else {
      throw new Error('Please provide either ARN or application name.');
    }

    cdk.Aspects.of(scope).add(new RegisterApplicationStageStackAssociator(this));
  }

  /**
   * Associate this application with the given stage.
   *
   */
  public associateStage(stage: cdk.Stage): cdk.Stage {
    this.associatedStages.add(stage);
    cdk.Aspects.of(stage).add(new RegisterApplicationStageStackAssociator(this));
    return stage;
  }

  /**
   * Validates if a stage is already associated to the application.
   *
   */
  public isStageAssociated(stage: cdk.Stage): boolean {
    return this.associatedStages.has(stage);
  }

  /**
   * Get the AppRegistry application.
   *
   */
  get appRegistryApplication() {
    return this.application;
  }
}
