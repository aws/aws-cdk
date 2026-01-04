import * as lambda from '../../aws-lambda';
import * as cdk from '../../core';
import * as s3express from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 's3express-access-point-lit');

/// !show
// Create a directory bucket
// Note: Use Availability Zone ID (e.g., 'use1-az1'), not name (e.g., 'us-east-1a')
const bucket = new s3express.DirectoryBucket(stack, 'MyDirectoryBucket', {
  location: {
    availabilityZone: 'use1-az4',
  },
});

// Create an access point for the bucket
const accessPoint = new s3express.DirectoryBucketAccessPoint(stack, 'MyAccessPoint', {
  bucket,
});

// Create a Lambda function and grant access through the access point
const readFn = new lambda.Function(stack, 'ReadFunction', {
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

const writeFn = new lambda.Function(stack, 'WriteFunction', {
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
