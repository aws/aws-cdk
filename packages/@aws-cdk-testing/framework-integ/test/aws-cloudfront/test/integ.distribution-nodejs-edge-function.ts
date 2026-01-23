/// !cdk-integ *
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as integ from '@aws-cdk/integ-tests-alpha';
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

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    edgeLambdas: [{
      functionVersion: edgeFunction.currentVersion,
      eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
    }],
  },
});

// Lambda@Edge functions cannot be immediately deleted due to CloudFront replication.
// They must be disassociated from distributions and replicas cleared (takes hours).
// See: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-delete-replicas.html
new integ.IntegTest(app, 'cdk-integ-nodejs-edge-function', {
  testCases: [stack],
  diffAssets: true,
  stackUpdateWorkflow: false,
});
