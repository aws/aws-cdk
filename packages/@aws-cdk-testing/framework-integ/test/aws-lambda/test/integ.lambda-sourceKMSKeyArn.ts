import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

class TestStack extends Stack {
  public readonly functionName1: string;
  public readonly functionName2: string;
  public readonly functionName3: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaExecutionRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
      ],
    });
    const key = new kms.Key(this, 'myImportedKey', {
      enableKeyRotation: true,
    });
    key.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
      actions: [
        'kms:GenerateDataKey',
        'kms:Decrypt',
      ],
      resources: ['*'],
    }));
    key.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [lambdaExecutionRole],
        actions: ['kms:GenerateDataKey', 'kms:Decrypt'],
        resources: ['*'],
      }),
    );
    lambdaExecutionRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['kms:Decrypt', 'kms:GenerateDataKey'],
        resources: [key.keyArn],
      }),
    );
    const option = {
      sourceKMSKey: key,
    };

    // Using Asset
    const assetPath = path.join(__dirname, 'python-lambda-handler');
    const fnAsset = new lambda.Function(this, 'myFunction1', {
      code: lambda.Code.fromAsset(assetPath, option),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      role: lambdaExecutionRole,
    });
    key.grantEncryptDecrypt(lambdaExecutionRole),

    this.functionName1 = fnAsset.functionName;

    // Using Bucket
    const bucket = new s3.Bucket(this, 'S3', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      bucketName: 's3sourcekmskeyarnbucket',
    });
    const deployment = new s3deploy.BucketDeployment(this, 'DeployLambdaCode', {
      sources: [s3deploy.Source.asset('lambda-zip')],
      destinationBucket: bucket,
    });
    const fnBucket = new lambda.Function(this, 'myFunction2', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      role: lambdaExecutionRole,
      code: lambda.Code.fromBucketV2(bucket, 'python-lambda-handler.zip', option),
      environment: {
        SOURCE_KMS_KEY_ARN: key.keyArn,
      },
    });
    fnBucket.node.addDependency(deployment);
    this.functionName2 = fnBucket.functionName;

    // Using Custom Command
    const command = 'lambda-zip/python-lambda-handler.zip';
    const fnCustom = new lambda.Function(this, 'myFunction3', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'index.handler',
      role: lambdaExecutionRole,
      code: lambda.Code.fromCustomCommand(command, ['node'], option),
      environment: {
        SOURCE_KMS_KEY_ARN: key.keyArn,
      },
    });
    this.functionName3 = fnCustom.functionName;
  }
}

new IntegTest(app, 'SourceKMSKeyArn', {
  testCases: [new TestStack(app, 'CMCMK-Stack')],
});
