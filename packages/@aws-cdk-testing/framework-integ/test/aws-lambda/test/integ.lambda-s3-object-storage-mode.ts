import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';

const OBJECT_KEY = 'python-lambda-handler.zip';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'CodeBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const deployment = new s3deploy.BucketDeployment(this, 'DeployLambdaCode', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'lambda-zip'))],
      destinationBucket: bucket,
    });

    bucket.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'LambdaSelfManagedCodeAccess',
      principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
      actions: [
        's3:GetObject',
        's3:GetObjectVersion',
      ],
      resources: [bucket.arnForObjects(OBJECT_KEY)],
      conditions: {
        StringEquals: {
          'aws:SourceAccount': this.account,
        },
        ArnLike: {
          'aws:SourceArn': [
            this.formatArn({
              service: 'lambda',
              resource: 'function',
              resourceName: '*',
              arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
            }),
            this.formatArn({
              service: 'lambda',
              resource: 'layer',
              resourceName: '*',
              arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
            }),
          ],
        },
      },
    }));

    const versionLookup = new cr.AwsCustomResource(this, 'CodeObjectVersion', {
      onUpdate: {
        service: 'S3',
        action: 'headObject',
        parameters: {
          Bucket: bucket.bucketName,
          Key: OBJECT_KEY,
        },
        physicalResourceId: cr.PhysicalResourceId.of('CodeObjectVersion'),
      },
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: ['s3:GetObject'],
          resources: [bucket.arnForObjects(OBJECT_KEY)],
        }),
      ]),
    });
    versionLookup.node.addDependency(deployment);

    const code = lambda.Code.fromBucketV2(bucket, OBJECT_KEY, {
      objectVersion: versionLookup.getResponseField('VersionId'),
      s3ObjectStorageMode: lambda.S3ObjectStorageMode.REFERENCE,
    });

    new lambda.Function(this, 'Function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code,
    });

    new lambda.LayerVersion(this, 'LayerVersion', {
      code,
      compatibleRuntimes: [lambda.Runtime.NODEJS_LATEST],
    });
  }
}

new IntegTest(app, 'LambdaS3ObjectStorageMode', {
  testCases: [new TestStack(app, 'LambdaS3ObjectStorageModeStack')],
});
