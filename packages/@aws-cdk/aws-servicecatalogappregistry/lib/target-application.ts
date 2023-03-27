import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IApplication, Application } from './application';
import { hashValues } from './common';

/**
  * Properties used to define targetapplication.
  */
export interface TargetApplicationCommonOptions extends cdk.StackProps {
  /**
    * Stack ID in which application will be created or imported. The id of a stack is also the identifier that you use to
    * refer to it in the [AWS CDK Toolkit](https://docs.aws.amazon.com/cdk/v2/guide/cli.html).
    *
    * @default - The value of `stackName` will be used as stack id
    * @deprecated - Use `stackName` instead to control the name and id of the stack
    */
  readonly stackId?: string;

  /**
    * Determines whether any cross-account stacks defined in the CDK app definition should be associated with the
    * target application. If set to `true`, the application will first be shared with the accounts that own the stacks.
    *
    * @default - false
    */
  readonly associateCrossAccountStacks?: boolean;
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

  /**
   * Whether create cloudFormation Output for application manager URL.
   *
   * @default - true
   */
  readonly emitApplicationManagerUrlAsOutput?: boolean;
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
  /**
   * Enables cross-account associations with the target application.
   */
  readonly associateCrossAccountStacks: boolean;
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
    (this.applicationOptions.stackName as string) =
            this.applicationOptions.stackName || `ApplicationAssociator-${hashValues(scope.node.addr)}-Stack`;
    const stackId = this.applicationOptions.stackName;
    (this.applicationOptions.description as string) =
            this.applicationOptions.description || 'Stack to create AppRegistry application';
    (this.applicationOptions.env as cdk.Environment) =
            this.applicationOptions.env || { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };
    (this.applicationOptions.emitApplicationManagerUrlAsOutput as boolean) = this.applicationOptions.emitApplicationManagerUrlAsOutput ?? true;

    const applicationStack = new cdk.Stack(scope, stackId, this.applicationOptions);
    const appRegApplication = new Application(applicationStack, 'DefaultCdkApplication', {
      applicationName: this.applicationOptions.applicationName,
      description: this.applicationOptions.applicationDescription || 'Application containing stacks deployed via CDK.',
    });
    cdk.Tags.of(appRegApplication).add('managedBy', 'CDK_Application_Associator');

    if (this.applicationOptions.emitApplicationManagerUrlAsOutput) {
      new cdk.CfnOutput(appRegApplication, 'ApplicationManagerUrl', {
        value: `https://${appRegApplication.env.region}.console.aws.amazon.com/systems-manager/appmanager/application/AWS_AppRegistry_Application-${appRegApplication.applicationName}`,
        description: 'System Manager Application Manager URL for the application created.',
      });
    }

    return {
      application: appRegApplication,
      associateCrossAccountStacks: this.applicationOptions.associateCrossAccountStacks ?? false,
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
    (this.applicationOptions.stackName as string) =
            this.applicationOptions.stackName || `ApplicationAssociator-${hashValues(scope.node.addr)}-Stack`;
    const stackId = this.applicationOptions.stackName;
    const applicationStack = new cdk.Stack(scope, stackId, this.applicationOptions);
    const appRegApplication = Application.fromApplicationArn(applicationStack, 'ExistingApplication', this.applicationOptions.applicationArnValue);
    return {
      application: appRegApplication,
      associateCrossAccountStacks: this.applicationOptions.associateCrossAccountStacks ?? false,
    };
  }
}
