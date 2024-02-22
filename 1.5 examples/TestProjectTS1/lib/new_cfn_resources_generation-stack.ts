import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib-v3/aws-lambda';
import * as iam from 'aws-cdk-lib-v3/aws-iam';
import * as assets from 'aws-cdk-lib/aws-s3-assets';
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

    new lambda.CfnFunction(this, 'MyLambda', {
      runtime: lambda.CfnFunction.RuntimeEnum.PYTHON3_11,
      code: new lambda.CfnFunction.S3Code(functionCode.s3BucketName, functionCode.s3ObjectKey, functionCode.assetHash),
      role: role,
    });
  }
}
