import { IRole } from '@aws-cdk/aws-iam';
import { Construct, IResource, Resource, ResourceProps, Tag } from '@aws-cdk/core';
import { CfnApp } from './amplify.generated';

export class App extends Resource implements IApp {
  public static fromAppId(scope: Construct, id: string, appId: string): IApp {
    class Import extends Resource implements IApp {
      public readonly appId = appId;
    }

    return new Import(scope, id);
  }

  /**
   * @attribute
   */
  public readonly appId: string;

  /**
   * @attribute
   */
  public readonly appName: string;

  /**
   * @attribute
   */
  public readonly appArn: string;

  /**
   * @attribute
   */
  public readonly appDefaultDomain: string;

  constructor(scope: Construct, id: string, props: AppProps) {
    super(scope, id, props);

    const resource = new CfnApp(scope, id, {
      name: props.name,
      repository: props.repository
    });

    this.appArn = resource.attrArn,
    this.appDefaultDomain = resource.attrDefaultDomain;
    this.appId = resource.attrAppId;
    this.appName = resource.attrAppName;
  }
}

export interface IApp extends IResource {
  /**
   * @attribute
   */
  readonly appId: string;
}

export interface AppOptions extends ResourceProps {
  /**
   * @default
   */
  readonly appName?: string;
}

export interface AppProps extends AppOptions {
  /**
   * @default
   */
  readonly accessToken?: string;

  /**
   * @default
   */
  readonly basicAuthConfig?: BasicAuthConfig;

  /**
   * @default
   */
  readonly buildSpec?: string;

  /**
   * @default
   */
  readonly customRules?: CustomRule[];

  /**
   * @default
   */
  readonly description?: string;

  /**
   * @default
   */
  readonly environmentVariables?: EnvironmentVariable[];

  /**
   * @default
   */
  readonly iamServiceRole?: IRole;

  readonly name: string;
  /**
   * @default
   */
  readonly oauthToken?: string;

  readonly repository: string;

  /**
   * @default
   */
  readonly tags?: Tag[];
}

export interface BasicAuthConfig {
  readonly enableBasicAuth?: boolean;
  readonly password: string;
  readonly username: string;
}

export interface CustomRule {

  readonly condition?: string;

  readonly source: string;

  readonly status?: string;

  readonly target: string;
}

export interface EnvironmentVariable {
  readonly name: string;
  readonly value: string;
}