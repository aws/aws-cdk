import * as path from 'path';
import { Duration, CfnResource, AssetStaging, Stack, FileAssetPackaging, Token, Lazy, Reference } from '@aws-cdk/core';
import { Construct } from 'constructs';

let SDK_METADATA: any = undefined;

/**
 * Properties for a lambda function provider
 */
export interface LambdaFunctionProviderProps {
  /**
   * The handler to use for the lambda function
   *
   * @default index.handler
   */
  readonly handler?: string;
}

/**
 * integ-tests can only depend on '@aws-cdk/core' so
 * this construct creates a lambda function provider using
 * only CfnResource
 */
class LambdaFunctionProvider extends Construct {
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

  constructor(scope: Construct, id: string, props?: LambdaFunctionProviderProps) {
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
        Policies: Lazy.any({
          produce: () => {
            const policies = this.policies.length > 0 ? [
              {
                PolicyName: 'Inline',
                PolicyDocument: {
                  Version: '2012-10-17',
                  Statement: this.policies,
                },
              },
            ] : undefined;
            return policies;
          },
        }),
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
        Handler: props?.handler ?? 'index.handler',
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

interface SingletonFunctionProps extends LambdaFunctionProviderProps {
  /**
   * A unique identifier to identify this lambda
   *
   * The identifier should be unique across all custom resource providers.
   * We recommend generating a UUID per provider.
   */
  readonly uuid: string;
}

/**
 * Mimic the singletonfunction construct in '@aws-cdk/aws-lambda'
 */
class SingletonFunction extends Construct {
  public readonly serviceToken: string;

  public readonly lambdaFunction: LambdaFunctionProvider;
  constructor(scope: Construct, id: string, props: SingletonFunctionProps) {
    super(scope, id);
    this.lambdaFunction = this.ensureFunction(props);
    this.serviceToken = this.lambdaFunction.serviceToken;
  }

  private ensureFunction(props: SingletonFunctionProps): LambdaFunctionProvider {
    const constructName = 'SingletonFunction' + slugify(props.uuid);
    const existing = Stack.of(this).node.tryFindChild(constructName);
    if (existing) {
      return existing as LambdaFunctionProvider;
    }

    return new LambdaFunctionProvider(Stack.of(this), constructName, {
      handler: props.handler,
    });
  }

  /**
   * Add an IAM policy statement to the inline policy of the
   * lambdas function's role
   *
   * **Please note**: this is a direct IAM JSON policy blob, *not* a `iam.PolicyStatement`
   * object like you will see in the rest of the CDK.
   *
   *
   * singleton.addToRolePolicy({
   *   Effect: 'Allow',
   *   Action: 's3:GetObject',
   *   Resources: '*',
   * });
   */
  public addToRolePolicy(statement: any): void {
    this.lambdaFunction.addPolicies([statement]);
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
    this.lambdaFunction.addPolicies([{
      Action: [`${iamService}:${iamAction}`],
      Effect: 'Allow',
      Resource: resources || ['*'],
    }]);
  }
}

/**
 * Properties for defining an AssertionsProvider
 */
export interface AssertionsProviderProps extends LambdaFunctionProviderProps {
  /**
   * This determines the uniqueness of each AssertionsProvider.
   * You should only need to provide something different here if you
   * _know_ that you need a separate provider
   *
   * @default - the default uuid is used
   */
  readonly uuid?: string;
}

/**
 * Represents an assertions provider. The creates a singletone
 * Lambda Function that will create a single function per stack
 * that serves as the custom resource provider for the various
 * assertion providers
 */
export class AssertionsProvider extends Construct {
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

  private readonly handler: SingletonFunction;

  constructor(scope: Construct, id: string, props?: AssertionsProviderProps) {
    super(scope, id);

    this.handler = new SingletonFunction(this, 'AssertionsProvider', {
      handler: props?.handler,
      uuid: props?.uuid ?? '1488541a-7b23-4664-81b6-9b4408076b81',
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

  /**
   * Add an IAM policy statement to the inline policy of the
   * lambdas function's role
   *
   * **Please note**: this is a direct IAM JSON policy blob, *not* a `iam.PolicyStatement`
   * object like you will see in the rest of the CDK.
   *
   *
   * @example
   * declare const provider: AssertionsProvider;
   * provider.addToRolePolicy({
   *   Effect: 'Allow',
   *   Action: ['s3:GetObject'],
   *   Resource: ['*'],
   * });
   */
  public addToRolePolicy(statement: any): void {
    this.handler.addToRolePolicy(statement);
  }

  /**
   * Grant a principal access to invoke the assertion provider
   * lambda function
   *
   * @param principalArn the ARN of the principal that should be given
   *  permission to invoke the assertion provider
   */
  public grantInvoke(principalArn: string): void {
    new CfnResource(this, 'Invoke', {
      type: 'AWS::Lambda::Permission',
      properties: {
        Action: 'lambda:InvokeFunction',
        FunctionName: this.serviceToken,
        Principal: principalArn,
      },
    });
  }
}

function slugify(x: string): string {
  return x.replace(/[^a-zA-Z0-9]/g, '');
}
