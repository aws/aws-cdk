import * as path from 'path';
import { Construct } from 'constructs';
import * as fs from 'fs-extra';
import { CustomResourceProviderOptions, INLINE_CUSTOM_RESOURCE_CONTEXT } from './shared';
import * as cxapi from '../../../cx-api';
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
const ENTRYPOINT_NODEJS_SOURCE = path.join(__dirname, '..', '..', '..', 'custom-resource-handlers', 'dist', 'core', 'nodejs-entrypoint-handler', 'index.js');

/**
 * Initialization properties for `CustomResourceProviderBase`
 */
export interface CustomResourceProviderBaseProps extends CustomResourceProviderOptions {
  /**
   * A local file system directory with the provider's code. The code will be
   * bundled into a zip asset and wired to the provider's AWS Lambda function.
   */
  readonly codeDirectory: string;

  /**
   * The AWS Lambda runtime and version name to use for the provider.
   */
  readonly runtimeName: string;
}

/**
 * Base class for creating a custom resource provider
 */
export abstract class CustomResourceProviderBase extends Construct {
  /**
   * The hash of the lambda code backing this provider. Can be used to trigger updates
   * on code changes, even when the properties of a custom resource remain unchanged.
   */
  public get codeHash(): string {
    if (!this._codeHash) {
      throw new Error('This custom resource uses inlineCode: true and does not have a codeHash');
    }
    return this._codeHash;
  }

  private _codeHash?: string;
  private policyStatements?: any[];
  private role?: CfnResource;

  /**
   * The ARN of the provider's AWS Lambda function which should be used as the `serviceToken` when defining a custom
   * resource.
   */
  public readonly serviceToken: string;

  /**
   * The ARN of the provider's AWS Lambda function role.
   */
  public readonly roleArn: string;

  protected constructor(scope: Construct, id: string, props: CustomResourceProviderBaseProps) {
    super(scope, id);

    const stack = Stack.of(scope);

    // verify we have an index file there
    if (!fs.existsSync(path.join(props.codeDirectory, 'index.js'))) {
      throw new Error(`cannot find ${props.codeDirectory}/index.js`);
    }

    if (props.policyStatements) {
      for (const statement of props.policyStatements) {
        this.addToRolePolicy(statement);
      }
    }

    const { code, codeHandler, metadata } = this.createCodePropAndMetadata(props, stack);

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
      this.role = new CfnResource(this, 'Role', {
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
      this.roleArn = Token.asString(this.role.getAtt('Arn'));
    }

    const timeout = props.timeout ?? Duration.minutes(15);
    const memory = props.memorySize ?? Size.mebibytes(128);

    const handler = new CfnResource(this, 'Handler', {
      type: 'AWS::Lambda::Function',
      properties: {
        Code: code,
        Timeout: timeout.toSeconds(),
        MemorySize: memory.toMebibytes(),
        Handler: codeHandler,
        Role: this.roleArn,
        Runtime: props.runtimeName,
        Environment: this.renderEnvironmentVariables(props.environment),
        Description: props.description ?? undefined,
      },
    });

    if (this.role) {
      handler.addDependency(this.role);
    }

    if (metadata) {
      Object.entries(metadata).forEach(([k, v]) => handler.addMetadata(k, v));
    }

    this.serviceToken = Token.asString(handler.getAtt('Arn'));
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

  /**
   * Returns the code property for the custom resource as well as any metadata.
   * If the code is to be uploaded as an asset, the asset gets created in this function.
   */
  private createCodePropAndMetadata(props: CustomResourceProviderBaseProps, stack: Stack): {
    code: Code,
    codeHandler: string,
    metadata?: {[key: string]: string},
  } {
    let codeHandler = 'index.handler';
    const inlineCode = this.node.tryGetContext(INLINE_CUSTOM_RESOURCE_CONTEXT);
    if (!inlineCode) {
      const stagingDirectory = FileSystem.mkdtemp('cdk-custom-resource');
      fs.copySync(props.codeDirectory, stagingDirectory, { filter: (src, _dest) => !src.endsWith('.ts') });

      if (props.useCfnResponseWrapper ?? true) {
        fs.copyFileSync(ENTRYPOINT_NODEJS_SOURCE, path.join(stagingDirectory, `${ENTRYPOINT_FILENAME}.js`));
        codeHandler = `${ENTRYPOINT_FILENAME}.handler`;
      }

      const staging = new AssetStaging(this, 'Staging', {
        sourcePath: stagingDirectory,
      });

      const assetFileName = staging.relativeStagedPath(stack);

      const asset = stack.synthesizer.addFileAsset({
        fileName: assetFileName,
        sourceHash: staging.assetHash,
        packaging: FileAssetPackaging.ZIP_DIRECTORY,
      });

      this._codeHash = staging.assetHash;

      return {
        code: {
          S3Bucket: asset.bucketName,
          S3Key: asset.objectKey,
        },
        codeHandler,
        metadata: this.node.tryGetContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT) ? {
          [cxapi.ASSET_RESOURCE_METADATA_PATH_KEY]: assetFileName,
          [cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY]: 'Code',
        } : undefined,
      };
    }

    return {
      code: {
        ZipFile: fs.readFileSync(path.join(props.codeDirectory, 'index.js'), 'utf-8'),
      },
      codeHandler,
    };
  }
}

export type Code = {
  ZipFile: string,
} | {
  S3Bucket: string,
  S3Key: string,
};
