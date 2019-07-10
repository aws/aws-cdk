import { Construct, IResource, Resource, ResourceProps, Tag } from '@aws-cdk/core';
import { CfnBranch } from './amplify.generated';
import { IApp } from './app';
import { BasicAuthConfig, BasicAuthResolver, EnvironmentVariable, EnvironmentVariablesResolver } from './shared';

/**
 * Branch
 */
export class Branch extends Resource implements IBranch {
  /**
   * ARN
   *
   * @attribute
   */
  public readonly arn: string;

  /**
   * Branch Name
   *
   * @attribute
   */
  public readonly branchName: string;

  private readonly basicAuthResolver: BasicAuthResolver = new BasicAuthResolver();

  private readonly environmentVariablesResolver: EnvironmentVariablesResolver = new EnvironmentVariablesResolver();

  constructor(scope: Construct, id: string, props: BranchProps) {
    super(scope, id, props);

    if (props.basicAuthConfig) {
      this.basicAuthResolver.basicAuthConfig({
        enableBasicAuth: true,
        password: props.basicAuthConfig.password,
        username: props.basicAuthConfig.username
      });
    }

    if (props.environmentVariables && props.environmentVariables.length > 0) {
      this.environmentVariablesResolver.addEnvironmentVariables(...props.environmentVariables);
    }

    const resource = new CfnBranch(scope, 'Branch', {
      appId: props.app.appId,
      basicAuthConfig: this.basicAuthResolver,
      branchName: props.branchName,
      buildSpec: props.buildSpec,
      description: props.description,
      environmentVariables: this.environmentVariablesResolver,
      stage: props.stage,
      tags: props.tags
    });

    this.arn = resource.attrArn;
    this.branchName = resource.attrBranchName;
  }

  public setBasicAuth(username: string, password: string) {
    this.basicAuthResolver.basicAuthConfig({
      enableBasicAuth: true,
      password,
      username
    });
  }

  public addEnvironmentVariable(name: string, value: string) {
    this.environmentVariablesResolver.addEnvironmentVariable(name, value);
  }
}

/**
 * Branch Interface
 */
export interface IBranch extends IResource {
  /**
   * ARN
   *
   * @attribute
   */
  readonly arn: string;
}

/**
 * Branch Properties
 */
export interface BranchProps extends ResourceProps {
  /**
   * App
   */
  readonly app: IApp;

  /**
   * Branch Name
   */
  readonly branchName: string;

  /**
   * Basic Auth Config
   *
   * @default Empty
   */
  readonly basicAuthConfig?: BasicAuthConfig;

  /**
   * Build Spec
   *
   * @default Empty
   */
  readonly buildSpec?: string;

  /**
   * Description
   *
   * @default Empty
   */
  readonly description?: string;

  /**
   * Environment Variables
   *
   * @default Empty
   */
  readonly environmentVariables?: EnvironmentVariable[];

  /**
   * Stage
   *
   * @default Empty
   */
  readonly stage?: string;

  /**
   * Tags
   *
   * @default Empty
   */
  readonly tags?: Tag[];
}