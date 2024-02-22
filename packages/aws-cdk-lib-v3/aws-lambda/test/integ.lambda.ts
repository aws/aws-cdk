import * as path from 'path';
import * as assets from '../../../aws-cdk-lib/aws-s3-assets';
import * as cdk from '../../../aws-cdk-lib/core';
import * as iam from '../../aws-iam';
import * as lambda from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    let functionCode = new assets.Asset(this, 'Func1Code', {
      path: path.join(__dirname, 'handler.zip'),
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

const app = new cdk.App();

new TestStack(app, 'lambda-test');

app.synth();
