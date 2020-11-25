import * as codebuild from '@aws-cdk/aws-codebuild';
import { IResource, Lazy, Resource } from '@aws-cdk/core';
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
      enableAutoBuild: props.autoBuild === undefined ? true : props.autoBuild,
      enablePullRequestPreview: props.pullRequestPreview === undefined ? true : props.pullRequestPreview,
      environmentVariables: Lazy.any({ produce: () => renderEnvironmentVariables(this.environmentVariables) }, { omitEmptyArray: true }),
      pullRequestEnvironmentName: props.pullRequestEnvironmentName,
      stage: props.stage,
    });

    this.arn = branch.attrArn;
    this.branchName = branch.attrBranchName;
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
