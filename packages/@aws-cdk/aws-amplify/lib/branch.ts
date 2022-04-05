import * as path from 'path';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Asset } from '@aws-cdk/aws-s3-assets';
import {
  CustomResource,
  IResource,
  Lazy,
  Resource,
  Duration,
  NestedStack,
  Stack,
} from '@aws-cdk/core';
import { Provider } from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';
import { CfnBranch } from './amplify.generated';
import { IApp } from './app';
import { BasicAuth } from './basic-auth';
import { renderEnvironmentVariables } from './utils';

/**
 * A branch
 */
export interface IBranch extends IResource {
  /**
   * The name of the branch
   *
   * @attribute
   */
  readonly branchName: string;
}

/**
 * Options to add a branch to an application
 */
export interface BranchOptions {
  /**
   * The Basic Auth configuration. Use this to set password protection for
   * the branch
   *
   * @default - no password protection
   */
  readonly basicAuth?: BasicAuth;

  /**
   * The name of the branch
   *
   * @default - the construct's id
   */
  readonly branchName?: string;

  /**
   * BuildSpec for the branch
   *
   * @see https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html
   *
   * @default - no build spec
   */
  readonly buildSpec?: codebuild.BuildSpec;

  /**
   * A description for the branch
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * Whether to enable auto building for the branch
   *
   * @default true
   */
  readonly autoBuild?: boolean;

  /**
   * Whether to enable pull request preview for the branch.
   *
   * @default true
   */
  readonly pullRequestPreview?: boolean;

  /**
   * Environment variables for the branch.
   *
   * All environment variables that you add are encrypted to prevent rogue
   * access so you can use them to store secret information.
   *
   * @default - application environment variables
   */
  readonly environmentVariables?: { [name: string]: string };

  /**
   * The dedicated backend environment for the pull request previews
   *
   * @default - automatically provision a temporary backend
   */
  readonly pullRequestEnvironmentName?: string;

  /**
   * Stage for the branch
   *
   * @default - no stage
   */
  readonly stage?: string;

  /**
   * Asset for deployment.
   *
   * The Amplify app must not have a sourceCodeProvider configured as this resource uses Amplify's
   * startDeployment API to initiate and deploy a S3 asset onto the App.
   *
   * @default - no asset
   */
  readonly asset?: Asset

  /**
   * Enables performance mode for the branch.
   *
   * Performance mode optimizes for faster hosting performance by keeping content cached at the edge
   * for a longer interval. When performance mode is enabled, hosting configuration or code changes
   * can take up to 10 minutes to roll out.
   *
   * @default false
   */
  readonly performanceMode?: boolean;
}

/**
 * Properties for a Branch
 */
export interface BranchProps extends BranchOptions {
  /**
   * The application within which the branch must be created
   */
  readonly app: IApp;
}

/**
 * An Amplify Console branch
 */
export class Branch extends Resource implements IBranch {
  /**
   * Import an existing branch
   */
  public static fromBranchName(scope: Construct, id: string, branchName: string): IBranch {
    class Import extends Resource implements IBranch {
      public readonly branchName = branchName;
    }
    return new Import(scope, id);
  }

  /**
   * The ARN of the branch
   *
   * @attribute
   */
  public readonly arn: string;

  public readonly branchName: string;

  private readonly environmentVariables: { [name: string]: string };

  constructor(scope: Construct, id: string, props: BranchProps) {
    super(scope, id);

    this.environmentVariables = props.environmentVariables || {};

    const branchName = props.branchName || id;
    const branch = new CfnBranch(this, 'Resource', {
      appId: props.app.appId,
      basicAuthConfig: props.basicAuth && props.basicAuth.bind(this, `${branchName}BasicAuth`),
      branchName,
      buildSpec: props.buildSpec && props.buildSpec.toBuildSpec(),
      description: props.description,
      enableAutoBuild: props.autoBuild ?? true,
      enablePullRequestPreview: props.pullRequestPreview ?? true,
      environmentVariables: Lazy.any({ produce: () => renderEnvironmentVariables(this.environmentVariables) }, { omitEmptyArray: true }),
      pullRequestEnvironmentName: props.pullRequestEnvironmentName,
      stage: props.stage,
      enablePerformanceMode: props.performanceMode,
    });

    this.arn = branch.attrArn;
    this.branchName = branch.attrBranchName;

    if (props.asset) {
      new CustomResource(this, 'DeploymentResource', {
        serviceToken: AmplifyAssetDeploymentProvider.getOrCreate(this),
        resourceType: 'Custom::AmplifyAssetDeployment',
        properties: {
          AppId: props.app.appId,
          BranchName: branchName,
          S3ObjectKey: props.asset.s3ObjectKey,
          S3BucketName: props.asset.s3BucketName,
        },
      });
    }
  }

  /**
   * Adds an environment variable to this branch.
   *
   * All environment variables that you add are encrypted to prevent rogue
   * access so you can use them to store secret information.
   */
  public addEnvironment(name: string, value: string) {
    this.environmentVariables[name] = value;
    return this;
  }
}

class AmplifyAssetDeploymentProvider extends NestedStack {
  /**
   * Returns the singleton provider.
   */
  public static getOrCreate(scope: Construct) {
    const providerId =
      'com.amazonaws.cdk.custom-resources.amplify-asset-deployment-provider';
    const stack = Stack.of(scope);
    const group =
      (stack.node.tryFindChild(providerId) as AmplifyAssetDeploymentProvider) ?? new AmplifyAssetDeploymentProvider(stack, providerId);
    return group.provider.serviceToken;
  }

  private readonly provider: Provider;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const onEvent = new NodejsFunction(
      this,
      'amplify-asset-deployment-on-event',
      {
        entry: path.join(
          __dirname,
          'asset-deployment-handler/index.js',
        ),
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'onEvent',
        initialPolicy: [
          new iam.PolicyStatement({
            resources: ['*'],
            actions: [
              's3:GetObject',
              's3:GetSignedUrl',
              'amplify:ListJobs',
              'amplify:StartDeployment',
            ],
          }),
        ],
      },
    );

    const isComplete = new NodejsFunction(
      this,
      'amplify-asset-deployment-is-complete',
      {
        entry: path.join(
          __dirname,
          'asset-deployment-handler/index.js',
        ),
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'isComplete',
        initialPolicy: [
          new iam.PolicyStatement({
            resources: ['*'],
            actions: ['amplify:GetJob*'],
          }),
        ],
      },
    );

    this.provider = new Provider(
      this,
      'amplify-asset-deployment-handler-provider',
      {
        onEventHandler: onEvent,
        isCompleteHandler: isComplete,
        totalTimeout: Duration.minutes(5),
      },
    );
  }
}
