import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

class TestStack extends Stack {
  public readonly fn: lambda.Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const encryptionKey = new kms.Key(this, 'CodeKey', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const bucket = new s3.Bucket(this, 'CodeBucket', {
      versioned: true,
      encryption: s3.BucketEncryption.KMS,
      encryptionKey,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const deployment = new s3deploy.BucketDeployment(this, 'DeployLambdaCode', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'handler.zip'))],
      destinationBucket: bucket,
      extract: false,
    });
    const objectKey = cdk.Fn.select(0, deployment.objectKeys);

    const versionLookup = new cr.AwsCustomResource(this, 'CodeObjectVersion', {
      onUpdate: {
        service: 'S3',
        action: 'headObject',
        parameters: {
          Bucket: bucket.bucketName,
          Key: objectKey,
        },
        physicalResourceId: cr.PhysicalResourceId.of('CodeObjectVersion'),
      },
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: ['s3:GetObject'],
          resources: [bucket.arnForObjects(objectKey)],
        }),
        new iam.PolicyStatement({
          actions: ['kms:Decrypt'],
          resources: [encryptionKey.keyArn],
        }),
      ]),
    });
    versionLookup.node.addDependency(deployment);

    const code = lambda.Code.fromBucketV2(bucket, objectKey, {
      objectVersion: versionLookup.getResponseField('VersionId'),
      s3ObjectStorageMode: lambda.S3ObjectStorageMode.REFERENCE,
    });

    this.fn = new lambda.Function(this, 'Function', {
      functionName: 'lambda-s3-reference-function',
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.main',
      code,
    });

    new lambda.LayerVersion(this, 'LayerVersion', {
      layerVersionName: 'lambda-s3-reference-layer',
      code,
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
    });
  }
}

const stack = new TestStack(app, 'LambdaS3ObjectStorageModeStack');
const test = new IntegTest(app, 'LambdaS3ObjectStorageMode', {
  testCases: [stack],
});

test.assertions.invokeFunction({
  functionName: stack.fn.functionName,
}).expect(ExpectedResult.objectLike({
  StatusCode: 200,
}));
