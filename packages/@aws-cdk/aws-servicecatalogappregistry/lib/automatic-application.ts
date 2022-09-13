import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IApplication, Application } from './application';
import { AutomaticApplicationStageStackAssociator } from './aspects/stack-associator';

/**
 * Properties for a Service Catalog AppRegistry AutoApplication
 */
export interface AutomaticApplicationProps {
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
 * Automatic application.
 */
export class AutomaticApplication extends Construct {
  /**
   * Created or imported application.
   */
  private readonly application: IApplication;
  private readonly associatedStages: Set<string> = new Set();

  constructor(scope: Construct, id: string, props: AutomaticApplicationProps) {
    super(scope, id);

    if (!cdk.App.isApp(scope)) {
      throw new Error('Scope must be a cdk App.');
    }
    const applicationStack = new cdk.Stack(scope, 'AutomaticApplicationStack', props.stackProps);

    if (!!props.applicationArnValue) {
      this.application = this.importApplication(props, applicationStack);
    } else {
      this.application = this.createAutomaticApplication(props, applicationStack);
    }

    cdk.Aspects.of(scope).add(new AutomaticApplicationStageStackAssociator(this));
  }

  /**
   * Associate this application with the given stage.
   *
   */
  public associateStage(stage: cdk.Stage, pipelineStackName: string): cdk.Stage {
    this.associatedStages.add(pipelineStackName + '/' + stage.stageName);
    cdk.Aspects.of(stage).add(new AutomaticApplicationStageStackAssociator(this));
    return stage;
  }

  /**
   * Validates if a stage is already associated to the application.
   *
   */
  public isStageAssociated(stageName: string, pipelineStackName: string): boolean {
    return this.associatedStages.has(pipelineStackName + '/' + stageName);
  }

  /**
   * Get the AppRegistry application.
   *
   */
  get appRegistryApplication() {
    return this.application;
  }

  /**
   * Import application from the given application ARN.
   */
  private importApplication(appProps: AutomaticApplicationProps, applicationStack: cdk.Stack) {
    return Application.fromApplicationArn(applicationStack, 'ImportedApplication', appProps.applicationArnValue!);
  }

  /**
   * Create a new application.
   */
  private createAutomaticApplication(appProps: AutomaticApplicationProps, applicationStack: cdk.Stack): IApplication {
    return new Application(applicationStack, 'DefaultCdkApplication', {
      applicationName: appProps.applicationName!,
      description: appProps.description,
    });
  }
}
