import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import { Construct, IResource, Lazy, Resource } from '@aws-cdk/core';
import { CfnApp } from './amplify.generated';
import { BasicAuth } from './basic-auth';
import { Branch, BranchOptions } from './branch';
import { Domain, DomainOptions } from './domain';
import { ISourceCodeProvider } from './source-code-provider';
import { renderEnvironmentVariables } from './utils';

/**
 * An Amplify Console application
 */
export interface IApp extends IResource {
  /**
   * The application id
   *
   * @attribute
   */
  readonly appId: string;
}

/**
 * Properties for an App
 */
export interface AppProps {
  /**
   * The name for the application
   *
   * @default - a CDK generated name
   */
  readonly appName?: string;

  /**
   * The source code provider for this application
   *
   * @default - not connected to a source code provider
   */
  readonly sourceCodeProvider?: ISourceCodeProvider;

  /**
   * The auto branch creation configuration. Use this to automatically create
   * branches that match a certain pattern.
   *
   * @default - no auto branch creation
   */
  readonly autoBranchCreation?: AutoBranchCreation;

  /**
   * The Basic Auth configuration. Use this to set password protection at an
   * app level to all your branches.
   *
   * @default - no password protection
   */
  readonly basicAuth?: BasicAuth;

  /**
   * BuildSpec for the application. Alternatively, add a `amplify.yml`
   * file to the repository.
   *
   * @see https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html
   *
   * @default - no build spec
   */
  readonly buildSpec?: codebuild.BuildSpec;

  /**
   * Custom rewrite/redirect rules for the application
   *
   * @default - no custom rewrite/redirect rules
   */
  readonly customRules?: CustomRule[];

  /**
   * A description for the application
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * Environment variables for the application.
   *
   * All environment variables that you add are encrypted to prevent rogue
   * access so you can use them to store secret information.
   *
   * @default - no environment variables
   */
  readonly environmentVariables?: { [name: string]: string };

  /**
   * The IAM service role to associate with the application
   *
   * @default - a new role is created
   */
  readonly role?: iam.IRole;
}

/**
 * An Amplify Console application
 */
export class App extends Resource implements IApp, iam.IGrantable {
  /**
   * Import an existing application
   */
  public static fromAppId(scope: Construct, id: string, appId: string): IApp {
    class Import extends Resource implements IApp {
      public readonly appId = appId;
    }
    return new Import(scope, id);
  }

  public readonly appId: string;

  /**
   * The name of the application
   *
   * @attribute
   */
  public readonly appName: string;

  /**
   * The ARN of the application
   *
   * @attribute
   */
  public readonly arn: string;

  /**
   * The default domain of the application
   *
   * @attribute
   */
  public readonly defaultDomain: string;

  /**
   * The principal to grant permissions to
   */
  public readonly grantPrincipal: iam.IPrincipal;

  private readonly customRules: CustomRule[];
  private readonly environmentVariables: { [name: string]: string };
  private readonly autoBranchEnvironmentVariables: { [name: string]: string };

  constructor(scope: Construct, id: string, props: AppProps) {
    super(scope, id);

    this.customRules = props.customRules || [];
    this.environmentVariables = props.environmentVariables || {};
    this.autoBranchEnvironmentVariables = props.autoBranchCreation && props.autoBranchCreation.environmentVariables || {};

    const role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com')
    });
    this.grantPrincipal = role;

    const sourceCodeProviderOptions = props.sourceCodeProvider?.bind(role);

    const app = new CfnApp(this, 'Resource', {
      accessToken: sourceCodeProviderOptions?.accessToken?.toString(),
      autoBranchCreationConfig: props.autoBranchCreation && {
        autoBranchCreationPatterns: props.autoBranchCreation.patterns,
        basicAuthConfig: props.autoBranchCreation.basicAuth && props.autoBranchCreation.basicAuth.bind(this, 'BranchBasicAuth'),
        buildSpec: props.autoBranchCreation.buildSpec && props.autoBranchCreation.buildSpec.toBuildSpec(),
        enableAutoBranchCreation: true,
        enableAutoBuild: props.autoBranchCreation.autoBuild === undefined ? true : props.autoBranchCreation.autoBuild,
        environmentVariables: Lazy.anyValue({ produce: () => renderEnvironmentVariables(this.autoBranchEnvironmentVariables )}, { omitEmptyArray: true }), // tslint:disable-line max-line-length
        enablePullRequestPreview: props.autoBranchCreation.pullRequestPreview === undefined ? true : props.autoBranchCreation.pullRequestPreview,
        pullRequestEnvironmentName: props.autoBranchCreation.pullRequestEnvironmentName,
        stage: props.autoBranchCreation.stage,
      },
      basicAuthConfig: props.basicAuth && props.basicAuth.bind(this, 'AppBasicAuth'),
      buildSpec: props.buildSpec && props.buildSpec.toBuildSpec(),
      customRules: Lazy.anyValue({ produce: () => this.customRules }, { omitEmptyArray: true }),
      description: props.description,
      environmentVariables: Lazy.anyValue({ produce: () => renderEnvironmentVariables(this.environmentVariables) }, { omitEmptyArray: true }),
      iamServiceRole: role.roleArn,
      name: props.appName || this.node.id,
      oauthToken: sourceCodeProviderOptions?.oauthToken?.toString(),
      repository: sourceCodeProviderOptions?.repository,
    });

    this.appId = app.attrAppId;
    this.appName = app.attrAppName;
    this.arn = app.attrArn;
    this.defaultDomain = app.attrDefaultDomain;
  }

  /**
   * Adds a custom rewrite/redirect rule to this application
   */
  public addCustomRule(rule: CustomRule) {
    this.customRules.push(rule);
    return this;
  }

  /**
   * Adds an environment variable to this application.
   *
   * All environment variables that you add are encrypted to prevent rogue
   * access so you can use them to store secret information.
   */
  public addEnvironment(name: string, value: string) {
    this.environmentVariables[name] = value;
    return this;
  }

  /**
   * Adds an environment variable to the auto created branch.
   *
   * All environment variables that you add are encrypted to prevent rogue
   * access so you can use them to store secret information.
   */
  public addAutoBranchEnvironment(name: string, value: string) {
    this.autoBranchEnvironmentVariables[name] = value;
    return this;
  }

  /**
   * Adds a branch to this application
   */
  public addBranch(id: string, options: BranchOptions = {}): Branch {
    return new Branch(this, id, {
      ...options,
      app: this,
    });
  }

  /**
   * Adds a domain to this application
   */
  public addDomain(id: string, options: DomainOptions = {}): Domain {
    return new Domain(this, id, {
      ...options,
      app: this,
    });
  }
}

/**
 * Auto branch creation configuration
 */
export interface AutoBranchCreation {
  /**
   * Automated branch creation glob patterns
   *
   * @default - all repository branches
   */
  readonly patterns?: string[];

  /**
   * The Basic Auth configuration. Use this to set password protection for
   * the auto created branch.
   *
   * @default - no password protection
   */
  readonly basicAuth?: BasicAuth;

  /**
   * Build spec for the auto created branch.
   *
   * @default - application build spec
   */
  readonly buildSpec?: codebuild.BuildSpec

  /**
   * Whether to enable auto building for the auto created branch
   *
   * @default true
   */
  readonly autoBuild?: boolean;

  /**
   * Whether to enable pull request preview for the auto created branch.
   *
   * @default true
   */
  readonly pullRequestPreview?: boolean;

  /**
   * Environment variables for the auto created branch.
   *
   * All environment variables that you add are encrypted to prevent rogue
   * access so you can use them to store secret information.
   *
   * @default - application environment variables
   */
  readonly environmentVariables?: { [name: string]: string };

  /**
   * The dedicated backend environment for the pull request previews of
   * the auto created branch.
   *
   * @default - automatically provision a temporary backend
   */
  readonly pullRequestEnvironmentName?: string;

  /**
   * Stage for the auto created branch
   *
   * @default - no stage
   */
  readonly stage?: string;
}

/**
 * The status code for a URL rewrite or redirect rule.
 */
export enum RedirectStatus {
  /**
   * Rewrite (200)
   */
  REWRITE = '200',

  /**
   * Permanent redirect (301)
   */
  PERMANENT_REDIRECT = '301',

  /**
   * Temporary redirect (302)
   */
  TEMPORARY_REDIRECT = '302',

  /**
   * Not found (404)
   */
  NOT_FOUND = '404',
}

/**
 * Custom rewrite/redirect rule for an Amplify App.
 */
export interface CustomRule {
  /**
   * The source pattern for a URL rewrite or redirect rule.
   */
  readonly source: string;

  /**
   * The target pattern for a URL rewrite or redirect rule.
   */
  readonly target: string

  /**
   * The status code for a URL rewrite or redirect rule.
   *
   * @default PERMANENT_REDIRECT
   */
  readonly status?: RedirectStatus;

  /**
   * The condition for a URL rewrite or redirect rule, e.g. country code.
   *
   * @default - no condition
   */
  readonly condition?: string;
}
