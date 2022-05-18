import * as path from 'path';
import { Duration, CfnResource, AssetStaging, Stack, FileAssetPackaging, Token, Lazy, Reference } from '@aws-cdk/core';
import { Construct } from 'constructs';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';
let SDK_METADATA: any = undefined;


/**
 * integ-tests can only depend on '@aws-cdk/core' so
 * this construct creates a lambda function provider using
 * only CfnResource
 */
class LambdaFunctionProvider extends CoreConstruct {
  /**
   * The ARN of the lambda function which can be used
   * as a serviceToken to a CustomResource
   */
  public readonly serviceToken: string;

  /**
   * A Reference to the provider lambda exeuction role ARN
   */
  public readonly roleArn: Reference;

  private readonly policies: any[] = [];

  constructor(scope: Construct, id: string/*, props?: LambdaFunctionProviderProps*/) {
    super(scope, id);

    const staging = new AssetStaging(this, 'Staging', {
      sourcePath: path.join(__dirname, 'lambda-handler.bundle'),
    });

    const stack = Stack.of(this);
    const asset = stack.synthesizer.addFileAsset({
      fileName: staging.relativeStagedPath(stack),
      sourceHash: staging.assetHash,
      packaging: FileAssetPackaging.ZIP_DIRECTORY,
    });

    const role = new CfnResource(this, 'Role', {
      type: 'AWS::IAM::Role',
      properties: {
        AssumeRolePolicyDocument: {
          Version: '2012-10-17',
          Statement: [{ Action: 'sts:AssumeRole', Effect: 'Allow', Principal: { Service: 'lambda.amazonaws.com' } }],
        },
        ManagedPolicyArns: [
          { 'Fn::Sub': 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole' },
        ],
        Policies: [
          {
            PolicyName: 'Inline',
            PolicyDocument: {
              Version: '2012-10-17',
              Statement: Lazy.list({ produce: () => this.policies }),
            },
          },
        ],
      },
    });

    const handler = new CfnResource(this, 'Handler', {
      type: 'AWS::Lambda::Function',
      properties: {
        Runtime: 'nodejs14.x',
        Code: {
          S3Bucket: asset.bucketName,
          S3Key: asset.objectKey,
        },
        Timeout: Duration.minutes(2).toSeconds(),
        Handler: 'index.handler',
        Role: role.getAtt('Arn'),
      },
    });

    this.serviceToken = Token.asString(handler.getAtt('Arn'));
    this.roleArn = role.getAtt('Arn');
  }

  public addPolicies(policies: any[]): void {
    this.policies.push(...policies);
  }

}

interface SingletonFunctionProps {
  /**
   * A unique identifier to identify this lambda
   *
   * The identifier should be unique across all custom resource providers.
   * We recommend generating a UUID per provider.
   */
  readonly uuid: string;

  /**
   * A list of IAM policies to add to the lambdaFunction
   * execution role
   */
  readonly policies: any[];
}

/**
 * Mimic the singletonfunction construct in '@aws-cdk/aws-lambda'
 */
class SingletonFunction extends CoreConstruct {
  public readonly serviceToken: string;

  public readonly lambdaFunction: LambdaFunctionProvider;
  private readonly policies: any[] = [];
  constructor(scope: Construct, id: string, props: SingletonFunctionProps) {
    super(scope, id);
    this.lambdaFunction = this.ensureFunction(props);
    this.serviceToken = this.lambdaFunction.serviceToken;
  }

  /**
   * The policies can be added by different constructs
   */
  onPrepare(): void {
    this.lambdaFunction.addPolicies(this.policies);
  }

  private ensureFunction(props: SingletonFunctionProps): LambdaFunctionProvider {
    const constructName = 'SingletonFunction' + slugify(props.uuid);
    const existing = Stack.of(this).node.tryFindChild(constructName);
    if (existing) {
      return existing as LambdaFunctionProvider;
    }

    return new LambdaFunctionProvider(Stack.of(this), constructName);
  }

  /**
   * Create a policy statement from a specific api call
   */
  public addPolicyStatementFromSdkCall(service: string, api: string, resources?: string[]): void {
    if (SDK_METADATA === undefined) {
      // eslint-disable-next-line
      SDK_METADATA = require('./sdk-api-metadata.json');
    }
    const srv = service.toLowerCase();
    const iamService = (SDK_METADATA[srv] && SDK_METADATA[srv].prefix) || srv;
    const iamAction = api.charAt(0).toUpperCase() + api.slice(1);
    this.policies.push({
      Action: [`${iamService}:${iamAction}`],
      Effect: 'Allow',
      Resource: resources || ['*'],
    });
  }

}

/**
 * Represents an assertions provider. The creates a singletone
 * Lambda Function that will create a single function per stack
 * that serves as the custom resource provider for the various
 * assertion providers
 */
export class AssertionsProvider extends CoreConstruct {
  /**
   * The ARN of the lambda function which can be used
   * as a serviceToken to a CustomResource
   */
  public readonly serviceToken: string;
  /**
   * A reference to the provider Lambda Function
   * execution Role ARN
   */
  public readonly handlerRoleArn: Reference;

  private readonly policies: any[] = [];
  private readonly handler: SingletonFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.handler = new SingletonFunction(this, 'AssertionsProvider', {
      uuid: '1488541a-7b23-4664-81b6-9b4408076b81',
      policies: Lazy.list({ produce: () => this.policies }),
    });

    this.handlerRoleArn = this.handler.lambdaFunction.roleArn;

    this.serviceToken = this.handler.serviceToken;
  }

  /**
   * Encode an object so it can be passed
   * as custom resource parameters. Custom resources will convert
   * all input parameters to strings so we encode non-strings here
   * so we can then decode them correctly in the provider function
   */
  public encode(obj: any): any {
    if (!obj) {
      return obj;
    }
    return JSON.parse(JSON.stringify(obj), (_k, v) => {
      switch (v) {
        case true:
          return 'TRUE:BOOLEAN';
        case false:
          return 'FALSE:BOOLEAN';
        default:
          return v;
      }
    });
  }

  /**
   * Create a policy statement from a specific api call
   */
  public addPolicyStatementFromSdkCall(service: string, api: string, resources?: string[]): void {
    this.handler.addPolicyStatementFromSdkCall(service, api, resources);
  }
}

function slugify(x: string): string {
  return x.replace(/[^a-zA-Z0-9]/g, '');
}
