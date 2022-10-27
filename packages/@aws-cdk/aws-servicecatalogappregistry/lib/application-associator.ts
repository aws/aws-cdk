import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IApplication, Application } from './application';
import { CheckedStageStackAssociator } from './aspects/stack-associator';

/**
 * Properties for Service Catalog AppRegistry Application Associator
 */
export interface ApplicationAssociatorProps {
  /**
   * Application associator properties.
   *
   * @default - Empty array.
   */
  readonly applications: IBaseApplicationAssociatorProps[];
}

/**
 * Base Properties for Service Catalog AppRegistry Application Associator
 */
export interface IBaseApplicationAssociatorProps {
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
   * Stack ID to which application will be created or imported.
   *
   * @default - ApplicationAssociatorStack
   */
  readonly stackId?: string;

  /**
   * Stack properties to which Application will be created or imported.
   *
   */
  readonly stackProps: cdk.StackProps;
}

/**
 * Class which constructs the input from provided Application ARN.
 */
class ImportApplicationProps implements IBaseApplicationAssociatorProps {
  readonly applicationArnValue: string;
  readonly stackProps: cdk.StackProps;
  readonly stackId?: string;

  constructor(appArnValue: string, props: cdk.StackProps, stackId?: string) {
    this.applicationArnValue = appArnValue;
    this.stackProps = props;
    this.stackId = stackId;
  }
}

/**
 * Class which constructs the input from provided application name and stack props.
 * With this input, the construct will create the Application.
 */
class CreateApplicationProps implements IBaseApplicationAssociatorProps {
  readonly applicationName: string;
  readonly stackProps: cdk.StackProps;
  readonly stackId?: string;
  readonly description?: string;

  constructor(appName: string, props: cdk.StackProps, appDescription?: string, stackId?: string) {
    this.applicationName = appName;
    this.stackProps = props;
    this.description = appDescription;
    this.stackId = stackId;
  }
}

/**
 * Factory class with which you can build the input needed for
 * application associator to work.
 */
export class ApplicationBuilder {
  /**
     * Factory method to build the input using the provided
     * application ARN.
     */
  public static importApplicationFromArn(
    appArnValue: string,
    props: cdk.StackProps,
    stackId?: string): IBaseApplicationAssociatorProps {
    return new ImportApplicationProps(appArnValue, props, stackId);
  }

  /**
     * Factory method to build the input using the provided
     * application name and stack props.
     */
  public static createApplication(
    name: string,
    props: cdk.StackProps,
    description?: string,
    stackId?: string): IBaseApplicationAssociatorProps {
    return new CreateApplicationProps(name, props, description, stackId);
  }
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
export class ApplicationAssociator extends Construct {
  /**
   * Created or imported application.
   */
  private readonly application: IApplication;
  private readonly associatedStages: Set<cdk.Stage> = new Set();

  constructor(scope: cdk.App, id: string, props: ApplicationAssociatorProps) {
    super(scope, id);

    if (props.applications.length != 1) {
      throw new Error('Please provide either ARN or application name.');
    }

    const associatorProps = props.applications[0];
    const stackId = associatorProps.stackId ?? 'ApplicationAssociatorStack';
    const applicationStack = new cdk.Stack(scope, stackId, associatorProps.stackProps);

    if (!!associatorProps.applicationArnValue) {
      this.application = Application.fromApplicationArn(applicationStack, 'ImportedApplication', associatorProps.applicationArnValue);
    } else {
      this.application = new Application(applicationStack, 'DefaultCdkApplication', {
        applicationName: associatorProps.applicationName as string,
        description: associatorProps.description,
      });
    }

    cdk.Aspects.of(scope).add(new CheckedStageStackAssociator(this));
  }

  /**
   * Associate this application with the given stage.
   *
   */
  public associateStage(stage: cdk.Stage): cdk.Stage {
    this.associatedStages.add(stage);
    cdk.Aspects.of(stage).add(new CheckedStageStackAssociator(this));
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
  public appRegistryApplication(): IApplication {
    return this.application;
  }
}
