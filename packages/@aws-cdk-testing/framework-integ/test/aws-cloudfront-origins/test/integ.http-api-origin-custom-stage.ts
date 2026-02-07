import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-cloudfront-http-api-origin-custom-stage');

const httpApi = new apigatewayv2.HttpApi(stack, 'HttpApi');
const prodStage = httpApi.addStage('prod', { stageName: 'prod', autoDeploy: true });

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new origins.HttpApiOrigin(httpApi, { stage: prodStage }) },
});

new IntegTest(app, 'http-api-origin-custom-stage', {
  testCases: [stack],
});
