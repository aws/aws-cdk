import { App, Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();

const producerStack = new Stack(app, 'Producer', {});

const bucket = new Bucket(producerStack, 'MyBucket');

const consumerStack = new Stack(app, 'Consumer', {
  softDependency: true,
});

const bucketName = bucket.bucketName;
new Function(consumerStack, 'MyFunction', {
  runtime: Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: Code.fromInline(`
    exports.handler = async (event) => {
      console.log('Bucket name:', process.env.BUCKET_NAME);
      return { statusCode: 200, body: 'Hello World' };
    };
  `),
  environment: {
    BUCKET_NAME: bucketName,
  },
});

new integ.IntegTest(app, 'CrossStackSSMReferences', {
  testCases: [producerStack, consumerStack],
});
