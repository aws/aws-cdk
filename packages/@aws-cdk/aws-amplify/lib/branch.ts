import { BuildSpec } from '@aws-cdk/aws-codebuild';
import { Construct, IResource, Resource, Tag } from '@aws-cdk/core';
import { CfnBranch } from './amplify.generated';
import { IApp } from './app';
import { BasicAuth, BasicAuthResolver, EnvironmentVariable, EnvironmentVariablesResolver } from './shared';

/**
 * Branch resource creates a new branch within an app
 */
export class Branch extends Resource implements IBranch {
  /**
   * ARN for a branch, part of an Amplify App.
   *
   * @attribute
   */
  public readonly branchArn: string;

  /**
   * Name for a branch, part of an Amplify App.
   *
   * @attribute
   */
  public readonly branchName: string;

  private readonly basicAuthResolver: BasicAuthResolver = new BasicAuthResolver();

  private readonly environmentVariablesResolver: EnvironmentVariablesResolver = new EnvironmentVariablesResolver();

  constructor(scope: Construct, id: string, props: BranchProps) {
    super(scope, id, {
      physicalName: props.branchName
    });

    if (props.basicAuth) {
      this.basicAuthResolver.basicAuth({
        enableBasicAuth: true,
        password: props.basicAuth.password,
        username: props.basicAuth.username
      });
    }

    if (props.environmentVariables && props.environmentVariables.length > 0) {
      this.environmentVariablesResolver.addEnvironmentVariables(...props.environmentVariables);
    }

    const resource = new CfnBranch(this, 'Branch', {
      appId: props.app.appId,
      basicAuthConfig: this.basicAuthResolver,
      branchName: this.physicalName,
      buildSpec: (props.buildSpec) ? props.buildSpec.toBuildSpec() : undefined,
      description: props.description,
      environmentVariables: this.environmentVariablesResolver,
      stage: props.stage,
      tags: props.tags
    });

    this.branchArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'amplify',
      resource: 'apps',
      resourceName: `${props.app.appId}/branches/${props.branchName}`
    });

    this.branchName = resource.attrBranchName;
  }

  /**
   * Add Basic Auth on Branch
   *
   * @param username
   * @param password
   */
  public addBasicAuth(username: string, password: string) {
    this.basicAuthResolver.basicAuth({
      enableBasicAuth: true,
      password,
      username
    });
  }

  /**
   * Add Environment Variable to Branch
   *
   * @param name
   * @param value
   */
  public addEnvironmentVariable(name: string, value: string) {
    this.environmentVariablesResolver.addEnvironmentVariable(name, value);
  }
}

/**
 * Branch Interface
 */
export interface IBranch extends IResource {
  /**
   * ARN for a branch, part of an Amplify App.
   *
   * @attribute
   */
  readonly branchArn: string;
}

/**
 * Branch Properties
 */
export interface BranchProps extends BranchBaseProps {
  /**
   * Amplify App
   */
  readonly app: IApp;
}

/**
 * Branch Base Properties
 */
export interface BranchBaseProps {
  /**
   * Name for the branch.
   */
  readonly branchName: string;

  /**
   * Basic Authorization credentials for a branch, part of an Amplify App.
   *
   * @default - No basic auth
   */
  readonly basicAuth?: BasicAuth;

  /**
   * BuildSpec for the branch.
   *
   * @default - No build spec
   */
  readonly buildSpec?: BuildSpec;

  /**
   * Description for the branch.
   *
   * @default - No description
   */
  readonly description?: string;

  /**
   * Environment Variables for the branch.
   *
   * @default - No environment variables
   */
  readonly environmentVariables?: EnvironmentVariable[];

  /**
   * Stage for the branch.
   *
   * @default - No stage for the branch
   */
  readonly stage?: string;

  /**
   * Tag for the branch.
   *
   * @default - No tags applied.
   */
  readonly tags?: Tag[];
}