import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IApplication, Application } from './application';

/**
  * Properties used to define targetapplication.
  */
export interface TargetApplicationCommonOptions extends cdk.StackProps {
  /**
    * Stack ID in which application will be created or imported. The id of a stack is also the identifier that you use to
    * refer to it in the {@link https://docs.aws.amazon.com/cdk/v2/guide/cli.html | AWS CDK Toolkit (cdk command)}.
    *
    * @default - ApplicationAssociatorStack
    */
  readonly stackId?: string;
}


/**
  * Properties used to define New TargetApplication.
  */
export interface CreateTargetApplicationOptions extends TargetApplicationCommonOptions {
  /**
    * Enforces a particular physical application name.
    */
  readonly applicationName: string;

  /**
    * Application description.
    *
    * @default - Application containing stacks deployed via CDK.
    */
  readonly applicationDescription?: string;
}

/**
  * Properties used to define Existing TargetApplication.
  */
export interface ExistingTargetApplicationOptions extends TargetApplicationCommonOptions {
  /**
    * Enforces a particular application arn.
    */
  readonly applicationArnValue: string;
}

/**
  * Contains static factory methods with which you can build the input
  * needed for application associator to work
  */
export abstract class TargetApplication {
  /**
    * Factory method to build the input using the provided
    * application ARN.
    */
  public static existingApplicationFromArn(options: ExistingTargetApplicationOptions) : TargetApplication {
    return new ExistingTargetApplication(options);
  }

  /**
    * Factory method to build the input using the provided
    * application name and stack props.
    */
  public static createApplicationStack(options: CreateTargetApplicationOptions) : TargetApplication {
    return new CreateTargetApplication(options);
  }

  /**
    * Called when the ApplicationAssociator is initialized
    */
  public abstract bind(scope: Construct): BindTargetApplicationResult;
}

/**
  * Properties for Service Catalog AppRegistry Application Associator to work with
  */
export interface BindTargetApplicationResult {
  /**
   * Created or imported application.
   */
  readonly application: IApplication;
}

/**
  * Class which constructs the input from provided application name and stack props.
  * With this input, the construct will create the Application.
  */
class CreateTargetApplication extends TargetApplication {
  constructor(
    private readonly applicationOptions: CreateTargetApplicationOptions) {
    super();
  }
  public bind(scope: Construct): BindTargetApplicationResult {
    const stackId = this.applicationOptions.stackId ?? 'ApplicationAssociatorStack';
    (this.applicationOptions.description as string) =
            this.applicationOptions.description || `Stack that holds the ${this.applicationOptions.applicationName} application`;
    (this.applicationOptions.env as cdk.Environment) =
            this.applicationOptions.env || { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };
    const applicationStack = new cdk.Stack(scope, stackId, this.applicationOptions);
    const appRegApplication = new Application(applicationStack, 'DefaultCdkApplication', {
      applicationName: this.applicationOptions.applicationName,
      description: this.applicationOptions.applicationDescription || 'Application containing stacks deployed via CDK.',
    });

    return {
      application: appRegApplication,
    };
  }
}

/**
  * Class which constructs the input from provided Application ARN.
  */
class ExistingTargetApplication extends TargetApplication {
  constructor(
    private readonly applicationOptions: ExistingTargetApplicationOptions) {
    super();
  }
  public bind(scope: Construct): BindTargetApplicationResult {
    const stackId = this.applicationOptions.stackId ?? 'ApplicationAssociatorStack';
    const applicationStack = new cdk.Stack(scope, stackId, this.applicationOptions);
    const appRegApplication = Application.fromApplicationArn(applicationStack, 'ExistingApplication', this.applicationOptions.applicationArnValue);
    return {
      application: appRegApplication,
    };
  }
}