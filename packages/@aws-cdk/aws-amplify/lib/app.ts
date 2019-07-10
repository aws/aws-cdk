import { IRole, LazyRole, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Construct, IResource, Resource, ResourceProps, Tag } from '@aws-cdk/core';
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
   * App Id
   *
   * @attribute
   */
  public readonly appId: string;

  /**
   * App Name
   *
   * @attribute
   */
  public readonly appName: string;

  /**
   * App ARN
   *
   * @attribute
   */
  public readonly appArn: string;

  /**
   * App Default Domain
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
      customRules: props.customRules,
      description: props.description,
      environmentVariables: this.environmentVariablesResolver,
      name: props.name,
      oauthToken: props.oauthToken,
      repository: props.repository,
      tags: props.tags
    });

    if (props.iamServiceRole) {
      resource.iamServiceRole = props.iamServiceRole.roleArn;
    }

    if (props.buildSpec && !props.iamServiceRole) {
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
   * Access Token
   *
   * @default
   */
  readonly accessToken?: string;

  /**
   * Basic Auth Config
   *
   * @default
   */
  readonly basicAuthConfig?: BasicAuthConfig;

  /**
   * BuildSpec
   *
   * @default
   */
  readonly buildSpec?: string;

  /**
   * Custom Rules
   *
   * @default
   */
  readonly customRules?: CustomRule[];

  /**
   * Description
   *
   * @default
   */
  readonly description?: string;

  /**
   * Environment Variables
   *
   * @default
   */
  readonly environmentVariables?: EnvironmentVariable[];

  /**
   * IAM Service Role
   *
   * @default
   */
  readonly iamServiceRole?: IRole;

  /**
   * Name
   */
  readonly name: string;

  /**
   * Name
   *
   * @default
   */
  readonly oauthToken?: string;

  /**
   * Repository
   *
   * Required to be in HTTP URL format: https://github.com/awslabs/aws-cdk
   * If you use a Git URL, it will error.
   */
  readonly repository: string;

  /**
   * Tags
   *
   * @default
   */
  readonly tags?: Tag[];
}

/**
 * Custom Rule Interface
 */
export interface CustomRule {
  /**
   * Condition
   *
   * @default Empty
   */
  readonly condition?: string;

  /**
   * Source
   */
  readonly source: string;

  /**
   * Status
   *
   * @default Empty
   */
  readonly status?: string;

  /**
   * Target
   */
  readonly target: string;
}