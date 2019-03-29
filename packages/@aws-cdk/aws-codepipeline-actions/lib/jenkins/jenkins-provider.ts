import codepipeline = require('@aws-cdk/aws-codepipeline');
import cdk = require('@aws-cdk/cdk');
import { CustomActionRegistration } from "../custom-action-registration";

/**
 * A Jenkins provider.
 *
 * If you want to create a new Jenkins provider managed alongside your CDK code,
 * instantiate the {@link JenkinsProvider} class directly.
 *
 * If you want to reference an already registered provider,
 * use the {@link JenkinsProvider#import} method.
 */
export interface IJenkinsProvider extends cdk.IConstruct {
  readonly providerName: string;
  readonly serverUrl: string;
  readonly version: string;

  /**
   * Registers a Jenkins Provider for the build category.
   * This method will be automatically called when creating
   * a {@link JenkinsBuildAction},
   * so you should never need to call it explicitly.
   *
   * @internal
   */
  _registerBuildProvider(): void;

  /**
   * Registers a Jenkins Provider for the test category.
   * This method will be automatically called when creating
   * a {@link JenkinsTestAction},
   * so you should never need to call it explicitly.
   *
   * @internal
   */
  _registerTestProvider(): void;
}

/**
 * Properties for importing an existing Jenkins provider.
 */
export interface JenkinsProviderImportProps {
  /**
   * The name of the Jenkins provider that you set in the AWS CodePipeline plugin configuration of your Jenkins project.
   *
   * @example 'MyJenkinsProvider'
   */
  readonly providerName: string;

  /**
   * The base URL of your Jenkins server.
   *
   * @example 'http://myjenkins.com:8080'
   */
  readonly serverUrl: string;

  /**
   * The version of your provider.
   *
   * @default '1'
   */
  readonly version?: string;
}

export interface JenkinsProviderProps {
  /**
   * The name of the Jenkins provider that you set in the AWS CodePipeline plugin configuration of your Jenkins project.
   *
   * @example 'MyJenkinsProvider'
   */
  readonly providerName: string;

  /**
   * The base URL of your Jenkins server.
   *
   * @example 'http://myjenkins.com:8080'
   */
  readonly serverUrl: string;

  /**
   * The version of your provider.
   *
   * @default '1'
   */
  readonly version?: string;

  /**
   * Whether to immediately register a Jenkins Provider for the build category.
   * The Provider will always be registered if you create a {@link JenkinsBuildAction}.
   */
  readonly forBuild?: boolean;

  /**
   * Whether to immediately register a Jenkins Provider for the test category.
   * The Provider will always be registered if you create a {@link JenkinsTestAction}.
   */
  readonly forTest?: boolean;
}

export abstract class BaseJenkinsProvider extends cdk.Construct implements IJenkinsProvider {
  public abstract readonly providerName: string;
  public abstract readonly serverUrl: string;
  public readonly version: string;

  protected constructor(scope: cdk.Construct, id: string, version?: string) {
    super(scope, id);

    this.version = version || '1';
  }

  public export(): JenkinsProviderImportProps {
    return {
      providerName: new cdk.CfnOutput(this, 'JenkinsProviderName', {
        value: this.providerName,
      }).makeImportValue().toString(),
      serverUrl: new cdk.CfnOutput(this, 'JenkinsServerUrl', {
        value: this.serverUrl,
      }).makeImportValue().toString(),
      version: new cdk.CfnOutput(this, 'JenkinsProviderVersion', {
        value: this.version,
      }).makeImportValue().toString(),
    };
  }

  /**
   * @internal
   */
  public abstract _registerBuildProvider(): void;

  /**
   * @internal
   */
  public abstract _registerTestProvider(): void;
}

/**
 * A class representing Jenkins providers.
 *
 * @see #import
 */
export class JenkinsProvider extends BaseJenkinsProvider {
  /**
   * Import a Jenkins provider registered either outside the CDK,
   * or in a different CDK Stack.
   *
   * @param scope the parent Construct for the new provider
   * @param id the identifier of the new provider Construct
   * @param props the properties used to identify the existing provider
   * @returns a new Construct representing a reference to an existing Jenkins provider
   */
  public static import(scope: cdk.Construct, id: string, props: JenkinsProviderImportProps): IJenkinsProvider {
    return new ImportedJenkinsProvider(scope, id, props);
  }

  public readonly providerName: string;
  public readonly serverUrl: string;
  private buildIncluded = false;
  private testIncluded = false;

  constructor(scope: cdk.Construct, id: string, props: JenkinsProviderProps) {
    super(scope, id, props.version);

    this.providerName = props.providerName;
    this.serverUrl = props.serverUrl;

    if (props.forBuild === true) {
      this._registerBuildProvider();
    }
    if (props.forTest === true) {
      this._registerTestProvider();
    }
  }

  /**
   * @internal
   */
  public _registerBuildProvider(): void {
    if (this.buildIncluded) {
      return;
    }
    this.buildIncluded = true;
    this.registerJenkinsCustomAction('JenkinsBuildProviderResource', codepipeline.ActionCategory.Build);
  }

  /**
   * @internal
   */
  public _registerTestProvider(): void {
    if (this.testIncluded) {
      return;
    }
    this.testIncluded = true;
    this.registerJenkinsCustomAction('JenkinsTestProviderResource', codepipeline.ActionCategory.Test);
  }

  private registerJenkinsCustomAction(id: string, category: codepipeline.ActionCategory) {
    new CustomActionRegistration(this, id, {
      category,
      artifactBounds: jenkinsArtifactsBounds,
      provider: this.providerName,
      version: this.version,
      entityUrl: appendToUrl(this.serverUrl, 'job/{Config:ProjectName}'),
      executionUrl: appendToUrl(this.serverUrl, 'job/{Config:ProjectName}/{ExternalExecutionId}'),
      actionProperties: [
        {
          name: 'ProjectName',
          required: true,
          key: true,
          queryable: true,
        },
      ],
    });
  }
}

class ImportedJenkinsProvider extends BaseJenkinsProvider {
  public readonly providerName: string;
  public readonly serverUrl: string;

  constructor(scope: cdk.Construct, id: string, props: JenkinsProviderImportProps) {
    super(scope, id, props.version);

    this.providerName = props.providerName;
    this.serverUrl = props.serverUrl;
  }

  public _registerBuildProvider(): void {
    // do nothing
  }

  public _registerTestProvider(): void {
    // do nothing
  }
}

function appendToUrl(baseUrl: string, path: string): string {
  return baseUrl.endsWith('/') ? baseUrl + path : `${baseUrl}/${path}`;
}

export const jenkinsArtifactsBounds: codepipeline.ActionArtifactBounds = {
  minInputs: 0,
  maxInputs: 5,
  minOutputs: 0,
  maxOutputs: 5
};
