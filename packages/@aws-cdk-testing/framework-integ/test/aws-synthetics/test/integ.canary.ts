/// !cdk-integ canary-one

import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { Canary, Cleanup, Code, Runtime, Schedule, Test } from 'aws-cdk-lib/aws-synthetics';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { RemovalPolicy } from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'canary-one');

const bucket = new s3.Bucket(stack, 'MyTestBucket', {
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const prefix = 'integ';

const api = new apigateway.RestApi(stack, 'ApiGateway');
api.root.addMethod('GET', new apigateway.MockIntegration({
  integrationResponses: [{
    statusCode: '200',
  }],
  passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
  requestTemplates: {
    'application/json': '{ "statusCode": 200 }',
  },
}), {
  methodResponses: [{ statusCode: '200' }],
});

const inlineAsset = new Canary(stack, 'InlineAsset', {
  test: Test.custom({
    handler: 'index.handler',
    code: Code.fromInline(`
      exports.handler = async () => {
        console.log(\'hello world\');
      };`),
  }),
  schedule: Schedule.rate(cdk.Duration.minutes(1)),
  artifactsBucketLocation: { bucket, prefix },
  runtime: Runtime.SYNTHETICS_NODEJS_PUPPETEER_4_0,
  cleanup: Cleanup.LAMBDA,
});

const directoryAsset = new Canary(stack, 'DirectoryAsset', {
  test: Test.custom({
    handler: 'canary.handler',
    code: Code.fromAsset(path.join(__dirname, 'canaries')),
  }),
  runtime: Runtime.SYNTHETICS_NODEJS_PUPPETEER_4_0,
  environmentVariables: {
    URL: api.url,
  },
  cleanup: Cleanup.LAMBDA,
});

const folderAsset = new Canary(stack, 'FolderAsset', {
  test: Test.custom({
    handler: 'folder/canary.functionName',
    code: Code.fromAsset(path.join(__dirname, 'canaries')),
  }),
  runtime: Runtime.SYNTHETICS_NODEJS_PUPPETEER_4_0,
  environmentVariables: {
    URL: api.url,
  },
  cleanup: Cleanup.LAMBDA,
});

const zipAsset = new Canary(stack, 'ZipAsset', {
  test: Test.custom({
    handler: 'canary.handler',
    code: Code.fromAsset(path.join(__dirname, 'canary.zip')),
  }),
  artifactsBucketLifecycleRules: [
    {
      expiration: cdk.Duration.days(30),
    },
  ],
  runtime: Runtime.SYNTHETICS_NODEJS_PUPPETEER_4_0,
  cleanup: Cleanup.LAMBDA,
});

const kebabToPascal = (text:string) => text.replace(/(^\w|-\w)/g, (v) => v.replace(/-/, '').toUpperCase());
const createCanaryByRuntimes = (runtime: Runtime) =>
  new Canary(stack, kebabToPascal(runtime.name).replace('.', ''), {
    test: Test.custom({
      handler: 'canary.handler',
      code: Code.fromAsset(path.join(__dirname, 'canaries')),
    }),
    environmentVariables: {
      URL: api.url,
    },
    runtime,
    cleanup: Cleanup.LAMBDA,
  });

const puppeteer39 = createCanaryByRuntimes(Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_9);
const puppeteer40 = createCanaryByRuntimes(Runtime.SYNTHETICS_NODEJS_PUPPETEER_4_0);
const selenium13 = createCanaryByRuntimes(Runtime.SYNTHETICS_PYTHON_SELENIUM_1_3);
const selenium20 = createCanaryByRuntimes(Runtime.SYNTHETICS_PYTHON_SELENIUM_2_0);

const test = new IntegTest(app, 'IntegCanaryTest', {
  testCases: [stack],
});

// Assertion that all Canary's are Passed
[
  inlineAsset,
  directoryAsset,
  folderAsset,
  zipAsset,
  puppeteer39,
  puppeteer40,
  selenium13,
  selenium20,
].forEach((canary) => test.assertions
  .awsApiCall('Synthetics', 'getCanaryRuns', {
    Name: canary.canaryName,
  })
  .assertAtPath('CanaryRuns.0.Status.State', ExpectedResult.stringLikeRegexp('PASSED'))
  .waitForAssertions({ totalTimeout: cdk.Duration.minutes(5) }));

app.synth();
