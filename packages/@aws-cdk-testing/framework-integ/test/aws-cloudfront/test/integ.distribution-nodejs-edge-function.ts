/// !cdk-integ *
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App();

const region = 'eu-west-1';
const stack = new cdk.Stack(app, 'integ-nodejs-edge-function', {
  env: { region: region },
});

// Test: NodejsEdgeFunction with cross-region deployment
const edgeFunction = new cloudfront.experimental.NodejsEdgeFunction(stack, 'NodejsEdge', {
  entry: path.join(__dirname, 'nodejs-edge-handler', 'index.ts'),
  runtime: STANDARD_NODEJS_RUNTIME,
});

// Attach to CloudFront to verify integration
const distribution = new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    edgeLambdas: [{
      functionVersion: edgeFunction.currentVersion,
      eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
    }],
  },
});

const integTest = new integ.IntegTest(app, 'cdk-integ-nodejs-edge-function', {
  testCases: [stack],
  diffAssets: true,
});

// Assertion 1: Verify Lambda exists in us-east-1
integTest.assertions.awsApiCall('Lambda', 'getFunction', {
  FunctionName: edgeFunction.functionName,
}).expect(ExpectedResult.objectLike({
  Configuration: {
    FunctionName: edgeFunction.functionName,
  },
})).provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['lambda:GetFunction'],
  Resource: '*',
});

// Assertion 2: Verify CloudFront distribution has the edge lambda attached
integTest.assertions.awsApiCall('CloudFront', 'getDistributionConfig', {
  Id: distribution.distributionId,
}).expect(ExpectedResult.objectLike({
  DistributionConfig: {
    DefaultCacheBehavior: {
      LambdaFunctionAssociations: {
        Quantity: 1,
      },
    },
  },
})).provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['cloudfront:GetDistributionConfig'],
  Resource: '*',
});
