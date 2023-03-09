import * as fs from 'fs';
import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import * as fse from 'fs-extra';
import { AssetStaging } from '../asset-staging';
import { FileAssetPackaging } from '../assets';
import { CfnResource } from '../cfn-resource';
import { Duration } from '../duration';
import { FileSystem } from '../fs';
import { PolicySynthesizer, getPrecreatedRoleConfig } from '../helpers-internal';
import { Lazy } from '../lazy';
import { Size } from '../size';
import { Stack } from '../stack';
import { Token } from '../token';

const ENTRYPOINT_FILENAME = '__entrypoint__';
const ENTRYPOINT_NODEJS_SOURCE = path.join(__dirname, 'nodejs-entrypoint.js');

/**
 * Initialization properties for `CustomResourceProvider`.
 *
 */
export interface CustomResourceProviderProps {
  /**
   * A local file system directory with the provider's code. The code will be
   * bundled into a zip asset and wired to the provider's AWS Lambda function.
   */
  readonly codeDirectory: string;

  /**
   * The AWS Lambda runtime and version to use for the provider.
   */
  readonly runtime: CustomResourceProviderRuntime;

  /**
   * A set of IAM policy statements to include in the inline policy of the
   * provider's lambda function.
   *
   * **Please note**: these are direct IAM JSON policy blobs, *not* `iam.PolicyStatement`
   * objects like you will see in the rest of the CDK.
   *
   * @default - no additional inline policy
   *
   * @example
   * const provider = CustomResourceProvider.getOrCreateProvider(this, 'Custom::MyCustomResourceType', {
   *   codeDirectory: `${__dirname}/my-handler`,
   *   runtime: CustomResourceProviderRuntime.NODEJS_14_X,
   *   policyStatements: [
   *     {
   *       Effect: 'Allow',
   *       Action: 's3:PutObject*',
   *       Resource: '*',
   *     }
   *   ],
   * });
   */
  readonly policyStatements?: any[];

  /**
   * AWS Lambda timeout for the provider.
   *
   * @default Duration.minutes(15)
   */
  readonly timeout?: Duration;

  /**
   * The amount of memory that your function has access to. Increasing the
   * function's memory also increases its CPU allocation.
   *
   * @default Size.mebibytes(128)
   */
  readonly memorySize?: Size;

  /**
   * Key-value pairs that are passed to Lambda as Environment
   *
   * @default - No environment variables.
   */
  readonly environment?: { [key: string]: string };

  /**
   * A description of the function.
   *
   * @default - No description.
   */
  readonly description?: string;
}

/**
 * The lambda runtime to use for the resource provider. This also indicates
 * which language is used for the handler.
 */
export enum CustomResourceProviderRuntime {
  /**
   * Node.js 12.x
   */
  NODEJS_12_X = 'nodejs12.x',

  /**
   * Node.js 12.x
   *
   * @deprecated Use `NODEJS_14_X`
   */
  NODEJS_12 = 'deprecated_nodejs12.x',

  /**
   * Node.js 14.x
   */
  NODEJS_14_X = 'nodejs14.x',

  /**
   * Node.js 16.x
   */
  NODEJS_16_X = 'nodejs16.x',
}

/**
 * An AWS-Lambda backed custom resource provider, for CDK Construct Library constructs
 *
 * This is a provider for `CustomResource` constructs, backed by an AWS Lambda
 * Function. It only supports NodeJS runtimes.
 *
 * > **Application builders do not need to use this provider type**. This is not
 * > a generic custom resource provider class. It is specifically
 * > intended to be used only by constructs in the AWS CDK Construct Library, and
 * > only exists here because of reverse dependency issues (for example, it cannot
 * > use `iam.PolicyStatement` objects, since the `iam` library already depends on
 * > the CDK `core` library and we cannot have cyclic dependencies).
 *
 * If you are not writing constructs for the AWS Construct Library, you should
 * use the `Provider` class in the `custom-resources` module instead, which has
 * a better API and supports all Lambda runtimes, not just Node.
 *
 * N.B.: When you are writing Custom Resource Providers, there are a number of
 * lifecycle events you have to pay attention to. These are documented in the
 * README of the `custom-resources` module. Be sure to give the documentation
 * in that module a read, regardless of whether you end up using the Provider
 * class in there or this one.
 */
export class CustomResourceProvider extends Construct {
  /**
   * Returns a stack-level singleton ARN (service token) for the custom resource
   * provider.
   *
   * @param scope Construct scope
   * @param uniqueid A globally unique id that will be used for the stack-level
   * construct.
   * @param props Provider properties which will only be applied when the
   * provider is first created.
   * @returns the service token of the custom resource provider, which should be
   * used when defining a `CustomResource`.
   */
  public static getOrCreate(scope: Construct, uniqueid: string, props: CustomResourceProviderProps) {
    return this.getOrCreateProvider(scope, uniqueid, props).serviceToken;
  }

  /**
   * Returns a stack-level singleton for the custom resource provider.
   *
   * @param scope Construct scope
   * @param uniqueid A globally unique id that will be used for the stack-level
   * construct.
   * @param props Provider properties which will only be applied when the
   * provider is first created.
   * @returns the service token of the custom resource provider, which should be
   * used when defining a `CustomResource`.
   */
  public static getOrCreateProvider(scope: Construct, uniqueid: string, props: CustomResourceProviderProps) {
    const id = `${uniqueid}CustomResourceProvider`;
    const stack = Stack.of(scope);
    const provider = stack.node.tryFindChild(id) as CustomResourceProvider
      ?? new CustomResourceProvider(stack, id, props);

    return provider;
  }

  /**
   * The ARN of the provider's AWS Lambda function which should be used as the
   * `serviceToken` when defining a custom resource.
   *
   * @example
   * declare const myProvider: CustomResourceProvider;
   *
   * new CustomResource(this, 'MyCustomResource', {
   *   serviceToken: myProvider.serviceToken,
   *   properties: {
   *     myPropertyOne: 'one',
   *     myPropertyTwo: 'two',
   *   },
   * });
   */
  public readonly serviceToken: string;

  /**
   * The ARN of the provider's AWS Lambda function role.
   */
  public readonly roleArn: string;

  /**
   * The hash of the lambda code backing this provider. Can be used to trigger updates
   * on code changes, even when the properties of a custom resource remain unchanged.
   */
  public readonly codeHash: string;

  private policyStatements?: any[];
  private _role?: CfnResource;

  protected constructor(scope: Construct, id: string, props: CustomResourceProviderProps) {
    super(scope, id);

    const stack = Stack.of(scope);

    // verify we have an index file there
    if (!fs.existsSync(path.join(props.codeDirectory, 'index.js'))) {
      throw new Error(`cannot find ${props.codeDirectory}/index.js`);
    }

    const stagingDirectory = FileSystem.mkdtemp('cdk-custom-resource');
    fse.copySync(props.codeDirectory, stagingDirectory, { filter: (src, _dest) => !src.endsWith('.ts') });
    fs.copyFileSync(ENTRYPOINT_NODEJS_SOURCE, path.join(stagingDirectory, `${ENTRYPOINT_FILENAME}.js`));

    const staging = new AssetStaging(this, 'Staging', {
      sourcePath: stagingDirectory,
    });

    const assetFileName = staging.relativeStagedPath(stack);

    const asset = stack.synthesizer.addFileAsset({
      fileName: assetFileName,
      sourceHash: staging.assetHash,
      packaging: FileAssetPackaging.ZIP_DIRECTORY,
    });

    if (props.policyStatements) {
      for (const statement of props.policyStatements) {
        this.addToRolePolicy(statement);
      }
    }

    const config = getPrecreatedRoleConfig(this, `${this.node.path}/Role`);
    const assumeRolePolicyDoc = [{ Action: 'sts:AssumeRole', Effect: 'Allow', Principal: { Service: 'lambda.amazonaws.com' } }];
    const managedPolicyArn = 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole';

    // need to initialize this attribute, but there should never be an instance
    // where config.enabled=true && config.preventSynthesis=true
    this.roleArn = '';
    if (config.enabled) {
      // gives policyStatements a chance to resolve
      this.node.addValidation({
        validate: () => {
          PolicySynthesizer.getOrCreate(this).addRole(`${this.node.path}/Role`, {
            missing: !config.precreatedRoleName,
            roleName: config.precreatedRoleName ?? id+'Role',
            managedPolicies: [{ managedPolicyArn: managedPolicyArn }],
            policyStatements: this.policyStatements ?? [],
            assumeRolePolicy: assumeRolePolicyDoc as any,
          });
          return [];
        },
      });
      this.roleArn = Stack.of(this).formatArn({
        region: '',
        service: 'iam',
        resource: 'role',
        resourceName: config.precreatedRoleName,
      });
    }
    if (!config.preventSynthesis) {
      this._role = new CfnResource(this, 'Role', {
        type: 'AWS::IAM::Role',
        properties: {
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: assumeRolePolicyDoc,
          },
          ManagedPolicyArns: [
            { 'Fn::Sub': managedPolicyArn },
          ],
          Policies: Lazy.any({ produce: () => this.renderPolicies() }),
        },
      });
      this.roleArn = Token.asString(this._role.getAtt('Arn'));
    }


    const timeout = props.timeout ?? Duration.minutes(15);
    const memory = props.memorySize ?? Size.mebibytes(128);

    const handler = new CfnResource(this, 'Handler', {
      type: 'AWS::Lambda::Function',
      properties: {
        Code: {
          S3Bucket: asset.bucketName,
          S3Key: asset.objectKey,
        },
        Timeout: timeout.toSeconds(),
        MemorySize: memory.toMebibytes(),
        Handler: `${ENTRYPOINT_FILENAME}.handler`,
        Role: this.roleArn,
        Runtime: customResourceProviderRuntimeToString(props.runtime),
        Environment: this.renderEnvironmentVariables(props.environment),
        Description: props.description ?? undefined,
      },
    });

    if (this._role) {
      handler.addDependency(this._role);
    }

    if (this.node.tryGetContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT)) {
      handler.addMetadata(cxapi.ASSET_RESOURCE_METADATA_PATH_KEY, assetFileName);
      handler.addMetadata(cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY, 'Code');
    }

    this.serviceToken = Token.asString(handler.getAtt('Arn'));
    this.codeHash = staging.assetHash;
  }

  /**
   * Add an IAM policy statement to the inline policy of the
   * provider's lambda function's role.
   *
   * **Please note**: this is a direct IAM JSON policy blob, *not* a `iam.PolicyStatement`
   * object like you will see in the rest of the CDK.
   *
   *
   * @example
   * declare const myProvider: CustomResourceProvider;
   *
   * myProvider.addToRolePolicy({
   *   Effect: 'Allow',
   *   Action: 's3:GetObject',
   *   Resource: '*',
   * });
   */
  public addToRolePolicy(statement: any): void {
    if (!this.policyStatements) {
      this.policyStatements = [];
    }
    this.policyStatements.push(statement);
  }

  private renderPolicies() {
    if (!this.policyStatements) {
      return undefined;
    }

    const policies = [{
      PolicyName: 'Inline',
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: this.policyStatements,
      },
    }];

    return policies;
  }

  private renderEnvironmentVariables(env?: { [key: string]: string }) {
    if (!env || Object.keys(env).length === 0) {
      return undefined;
    }

    env = { ...env }; // Copy

    // Always use regional endpoints
    env.AWS_STS_REGIONAL_ENDPOINTS = 'regional';

    // Sort environment so the hash of the function used to create
    // `currentVersion` is not affected by key order (this is how lambda does
    // it)
    const variables: { [key: string]: string } = {};
    const keys = Object.keys(env).sort();

    for (const key of keys) {
      variables[key] = env[key];
    }

    return { Variables: variables };
  }
}

function customResourceProviderRuntimeToString(x: CustomResourceProviderRuntime): string {
  switch (x) {
    case CustomResourceProviderRuntime.NODEJS_12:
    case CustomResourceProviderRuntime.NODEJS_12_X:
      return 'nodejs12.x';
    case CustomResourceProviderRuntime.NODEJS_14_X:
      return 'nodejs14.x';
    case CustomResourceProviderRuntime.NODEJS_16_X:
      return 'nodejs16.x';
  }
}
