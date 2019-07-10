import { IRole, LazyRole, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Construct, IResolvable, IResolveContext, IResource, Resource, ResourceProps, Tag } from '@aws-cdk/core';
import { CfnApp } from './amplify.generated';
import { BasicAuthConfig, BasicAuthResolver, EnvironmentVariable, EnvironmentVariablesResolver } from './shared';

/**
 * App
 */
export class App extends Resource implements IApp {
  /**
   * Allow creating from App ID
   *
   * @param scope
   * @param id
   * @param appId
   *
   * @returns Stubbed App
   */
  public static fromAppId(scope: Construct, id: string, appId: string): IApp {
    class Import extends Resource implements IApp {
      public readonly appId = appId;
    }

    return new Import(scope, id);
  }

  /**
   * Unique Id for the Amplify App.
   *
   * @attribute
   */
  public readonly appId: string;

  /**
   * Name for the Amplify App.
   *
   * @attribute
   */
  public readonly appName: string;

  /**
   * ARN for the Amplify App.
   *
   * @attribute
   */
  public readonly appArn: string;

  /**
   * Default domain for the Amplify App.
   *
   * @attribute
   */
  public readonly appDefaultDomain: string;

  /**
   * Resource
   */
  private readonly resource: CfnApp;

  private readonly basicAuthResolver: BasicAuthResolver = new BasicAuthResolver();

  private readonly environmentVariablesResolver: EnvironmentVariablesResolver = new EnvironmentVariablesResolver();

  private readonly customRulesResolver: EnvironmentVariablesResolver = new EnvironmentVariablesResolver();

  constructor(scope: Construct, id: string, props: AppProps) {
    super(scope, id, props);

    if (props.basicAuthConfig) {
      this.setBasicAuth(props.basicAuthConfig.username, props.basicAuthConfig.password);
    }

    if (props.environmentVariables && props.environmentVariables.length > 0) {
      this.environmentVariablesResolver.addEnvironmentVariables(...props.environmentVariables);
    }

    const resource = new CfnApp(scope, 'App', {
      accessToken: props.accessToken,
      basicAuthConfig: this.basicAuthResolver,
      buildSpec: props.buildSpec,
      customRules: this.customRulesResolver,
      description: props.description,
      environmentVariables: this.environmentVariablesResolver,
      name: props.name,
      oauthToken: props.oauthToken,
      repository: props.repository,
      tags: props.tags
    });

    if (props.serviceRole) {
      resource.iamServiceRole = props.serviceRole.roleArn;
    }

    if (props.buildSpec && !props.serviceRole) {
      // create lazy role
      const role = new LazyRole(scope, 'lazy-role', {
        assumedBy: new ServicePrincipal('amplify.amazonaws.com')
      });

      resource.iamServiceRole = role.roleArn;
    }

    this.appArn = resource.attrArn,
    this.appDefaultDomain = resource.attrDefaultDomain;
    this.appId = resource.attrAppId;
    this.appName = resource.attrAppName;

    this.resource = resource;
  }

  public validate(): string[] {
    const errors: string[] = [];

    if (this.resource.buildSpec && !this.resource.iamServiceRole) {
      errors.push(`You need to specify a service role when using buildspecs`);
    }

    return errors;
  }

  /**
   * Add Service Role
   *
   * @param role
   */
  public addServiceRole(role: IRole) {
    this.resource.iamServiceRole = role.roleArn;
  }

  /**
   * Set Basic Auth on App
   *
   * @param username
   * @param password
   */
  public setBasicAuth(username: string, password: string) {
    this.basicAuthResolver.basicAuthConfig({
      enableBasicAuth: true,
      password,
      username
    });
  }

  /**
   * Add Environment Variable to App
   *
   * @param name
   * @param value
   */
  public addEnvironmentVariable(name: string, value: string) {
    this.environmentVariablesResolver.addEnvironmentVariable(name, value);
  }
}

/**
 * App Interface
 */
export interface IApp extends IResource {
  /**
   * App ID
   *
   * @attribute
   */
  readonly appId: string;
}

/**
 * App Options
 */
export interface AppOptions extends ResourceProps {
  /**
   * App Name
   *
   * @todo This might cause an error, it conflicts with the construct
   *
   * @default
   */
  readonly appName?: string;
}

/**
 * App Properties
 */
export interface AppProps extends AppOptions {
  /**
   * Personal Access token for 3rd party source control system for an Amplify App, used to create webhook
   * and read-only deploy key. Token is not stored.
   *
   * @default
   */
  readonly accessToken?: string;

  /**
   * Credentials for Basic Authorization for an Amplify App.
   *
   * @default
   */
  readonly basicAuthConfig?: BasicAuthConfig;

  /**
   * BuildSpec for an Amplify App.
   *
   * @default
   */
  readonly buildSpec?: string;

  /**
   * Custom rewrite / redirect rules for an Amplify App.
   *
   * @default
   */
  readonly customRules?: CustomRule[];

  /**
   * Description for an Amplify App.
   *
   * @default
   */
  readonly description?: string;

  /**
   * Environment variables map for an Amplify App.
   *
   * @default
   */
  readonly environmentVariables?: EnvironmentVariable[];

  /**
   * IAM Service Role
   *
   * @default
   */
  readonly serviceRole?: IRole;

  /**
   * Name for the Amplify App.
   */
  readonly name: string;

  /**
   * OAuth token for 3rd party source control system for an Amplify App, used to create webhook and read-only
   * deploy key. OAuth token is not stored.
   *
   * @default
   */
  readonly oauthToken?: string;

  /**
   * Repository for an Amplify App.
   *
   * Required to be in HTTP URL format: https://github.com/awslabs/aws-cdk
   * If you use a Git URL, it will error.
   */
  readonly repository: string;

  /**
   * Tag for an Amplify App
   *
   * @default
   */
  readonly tags?: Tag[];
}

/**
 * The CustomRule property type allows you to specify redirects, rewrites, and reverse proxies.
 * Redirects enable a web app to reroute navigation from one URL to another.
 */
export interface CustomRule {
  /**
   * The condition for a URL rewrite or redirect rule, e.g. country code.
   *
   * @default Empty
   */
  readonly condition?: string;

  /**
   * The source pattern for a URL rewrite or redirect rule.
   */
  readonly source: string;

  /**
   * The status code for a URL rewrite or redirect rule.
   *
   * @default Empty
   */
  readonly status?: string;

  /**
   * The target pattern for a URL rewrite or redirect rule.
   */
  readonly target: string;
}

/**
 * Custom Rules Resolver
 */
export class CustomRulesResolver implements IResolvable {
  public readonly creationStack: string[];

  private customRules: CustomRule[] = new Array<CustomRule>();

  public resolve(_context: IResolveContext): any {
    return this.customRules;
  }

  public isEmpty(): boolean {
    return (this.customRules.length !== 0);
  }

  public count(): number {
    return this.customRules.length;
  }
}