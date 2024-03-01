import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib-v3/aws-lambda';
import * as lambdaV1 from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib-v3/aws-sqs';
import * as iam from 'aws-cdk-lib-v3/aws-iam';
import * as assets from 'aws-cdk-lib/aws-s3-assets';
import * as kms from 'aws-cdk-lib/aws-kms';
import path = require('path');

export class NewCfnResourcesGenerationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let functionCode = new assets.Asset(this, 'Func1Code', {
      path: path.join(__dirname, '../src/'),
    });

    let role = new iam.CfnRole(this, 'funcRole', {
      assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: '',
            Effect: 'Allow',
            Principal: { Service: 'firehose.amazonaws.com' },
            Action: 'sts:AssumeRole',
          },
        ],
      },
    });

    let queue = new sqs.CfnQueue(this, 'MyQueue');

    let lambdaFn = new lambda.CfnFunction(this, 'MyLambda', {
      runtime: lambda.CfnFunction.RuntimeEnum.PYTHON3_11,
      code: new lambda.CfnFunction.S3Code(functionCode.s3BucketName, functionCode.s3ObjectKey, functionCode.assetHash),
      role: role,
      packageType: lambda.CfnFunction.PackageTypeEnum.IMAGE,
      architectures: [lambda.CfnFunction.ArchitecturesEnum.ARM64],
      tracingConfig: {
        mode: lambda.CfnFunction.TracingConfigMode.ACTIVE,
      },
      deadLetterConfig: {
        target: queue
      }
    });

    let lambdaFnV1 = new lambdaV1.CfnFunction(this, 'MyLambdaV1', {
      code: {
        s3Bucket: functionCode.s3BucketName,
        s3Key: functionCode.s3ObjectKey,
        s3ObjectVersion: functionCode.assetHash,
      },
      role: role.attrArn,
      packageType: "Zip",
      architectures: ['arm64'],
      tracingConfig: {
        mode: "Active",
      },
      deadLetterConfig: {
        targetArn: queue.attrArn
      }
    });
  }
}
