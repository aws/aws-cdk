import { IRole, LazyRole, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Construct, IResolvable, IResolveContext, IResource, Resource, SecretValue, Tag } from '@aws-cdk/core';
import { CfnApp } from './amplify.generated';
import { Branch, BranchBaseProps } from './branch';
import { BuildSpec } from './buildspec';
import { Domain, DomainBaseProps } from './domain';
import { BasicAuth, BasicAuthResolver, EnvironmentVariable, EnvironmentVariablesResolver } from './shared';

/**
 * App resource creates Apps in the Amplify Console. An App is a collection of branches.
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

  private readonly customRulesResolver: CustomRulesResolver = new CustomRulesResolver();

  constructor(scope: Construct, id: string, props: AppProps) {
    super(scope, id, {
      physicalName: props.appName
    });

    if (props.basicAuth) {
      this.addBasicAuth(props.basicAuth.username, props.basicAuth.password);
    }

    if (props.environmentVariables && props.environmentVariables.length > 0) {
      this.environmentVariablesResolver.addEnvironmentVariables(...props.environmentVariables);
    }

    let roleArn: string | undefined;

    if (props.serviceRole) {
      roleArn = props.serviceRole.roleArn;
    }

    if (props.buildSpec && !props.serviceRole) {
      const role = new LazyRole(scope, 'lazy-role', {
        assumedBy: new ServicePrincipal('amplify.amazonaws.com')
      });

      roleArn = role.roleArn;
    }

    const resource = new CfnApp(this, 'App', {
      accessToken: props.accessToken,
      basicAuthConfig: this.basicAuthResolver,
      buildSpec: (props.buildSpec) ? props.buildSpec.toBuildSpec() : undefined,
      customRules: this.customRulesResolver,
      description: props.description,
      environmentVariables: this.environmentVariablesResolver,
      iamServiceRole: roleArn,
      name: props.appName,
      oauthToken: (props.oauthToken && props.oauthToken.toString()) ? props.oauthToken.toString() : undefined,
      repository: props.repository,
      tags: props.tags
    });

    this.appArn = resource.attrArn,
    this.appDefaultDomain = resource.attrDefaultDomain;
    this.appId = resource.attrAppId;
    this.appName = resource.attrAppName;

    this.resource = resource;
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
   * Add Basic Auth on App
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
   * Add Environment Variable to App
   *
   * @param name
   * @param value
   */
  public addEnvironmentVariable(name: string, value: string) {
    this.environmentVariablesResolver.addEnvironmentVariable(name, value);
  }

  /**
   * Add custom rule to app
   *
   * @param source
   * @param target
   * @param status
   * @param condition
   */
  public addCustomRule(source: string, target: string, status?: string, condition?: string) {
    this.customRulesResolver.addCustomRule(source, target, status, condition);
  }

  /**
   * Add domain to app
   *
   * @param id
   * @param props
   */
  public addDomain(id: string, props: DomainBaseProps): Domain {
    const domainProps = {
      app: this,
      ...props
    };

    return new Domain(this, id, domainProps);
  }

  /**
   * Add branch to app
   *
   * @param id
   * @param props
   */
  public addBranch(id: string, props: BranchBaseProps): Branch {
    const branchProps = {
      app: this,
      ...props
    };

    return new Branch(this, id, branchProps);
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
 * App Properties
 */
export interface AppProps {
  /**
   * Personal Access token for 3rd party source control system for an Amplify App, used to create webhook
   * and read-only deploy key. Token is not stored.
   *
   * @default - No access token
   */
  readonly accessToken?: string;

  /**
   * Credentials for Basic Authorization for an Amplify App.
   *
   * @default - No basic auth config
   */
  readonly basicAuth?: BasicAuth;

  /**
   * BuildSpec for an Amplify App.
   *
   * @default - No build spec
   */
  readonly buildSpec?: BuildSpec;

  /**
   * Custom rewrite / redirect rules for an Amplify App.
   *
   * @default - No custom rules
   */
  readonly customRules?: CustomRule[];

  /**
   * Description for an Amplify App.
   *
   * @default - No description
   */
  readonly description?: string;

  /**
   * Environment variables map for an Amplify App.
   *
   * @default - No environment variables
   */
  readonly environmentVariables?: EnvironmentVariable[];

  /**
   * IAM Service Role
   *
   * @default - No service role
   */
  readonly serviceRole?: IRole;

  /**
   * Name for the Amplify App.
   */
  readonly appName: string;

  /**
   * OAuth token for 3rd party source control system for an Amplify App, used to create webhook and read-only
   * deploy key. OAuth token is not stored.
   *
   * @default - No oauth token
   */
  readonly oauthToken?: SecretValue;

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
   * @default - No tags applied.
   */
  readonly tags?: Tag[];
}

/**
 * The CustomRule property type allows you to specify redirects, rewrites, and reverse proxies.
 * Redirects enable a web app to reroute navigation from one URL to another.
 *
 * @example Rewrite /foo to / and return a 200 status code
 * {
 *  source: '/foo',
 *  target: '/',
 *  status: 200
 * }
 */
export interface CustomRule {
  /**
   * The condition for a URL rewrite or redirect rule, e.g. country code.
   *
   * @default - No condition
   */
  readonly condition?: string;

  /**
   * The source pattern for a URL rewrite or redirect rule.
   */
  readonly source: string;

  /**
   * The status code for a URL rewrite or redirect rule.
   *
   * @default - No status
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

  public addCustomRule(source: string, target: string, status?: string, condition?: string) {
    this.customRules.push({
      source,
      target,
      status,
      condition
    });
  }
}