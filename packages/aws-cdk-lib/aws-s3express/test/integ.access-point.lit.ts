/// !cdk-integ *
// eslint-disable-next-line import/no-extraneous-dependencies
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as lambda from '../../aws-lambda';
import * as cdk from '../../core';
import * as s3express from '../lib';

class AccessPointStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    /// !show
    // Create a directory bucket
    const bucket = new s3express.DirectoryBucket(this, 'MyDirectoryBucket', {
      location: {
        availabilityZone: 'us-east-1a',
      },
    });

    // Create an access point for the bucket
    const accessPoint = new s3express.DirectoryBucketAccessPoint(this, 'MyAccessPoint', {
      bucket,
    });

    // Create a Lambda function and grant access through the access point
    const readFn = new lambda.Function(this, 'ReadFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          console.log('Access Point:', process.env.ACCESS_POINT_ARN);
          return { statusCode: 200, body: 'OK' };
        };
      `),
      environment: {
        ACCESS_POINT_ARN: accessPoint.accessPointArn,
      },
    });

    const writeFn = new lambda.Function(this, 'WriteFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          console.log('Access Point:', process.env.ACCESS_POINT_ARN);
          return { statusCode: 200, body: 'OK' };
        };
      `),
      environment: {
        ACCESS_POINT_ARN: accessPoint.accessPointArn,
      },
    });

    // Grant permissions through the access point
    accessPoint.grantRead(readFn);
    accessPoint.grantWrite(writeFn);
    /// !hide
  }
}

const app = new cdk.App();

const stack = new AccessPointStack(app, 's3express-access-point-integ');

new IntegTest(app, 'AccessPointTest', {
  testCases: [stack],
});

app.synth();
