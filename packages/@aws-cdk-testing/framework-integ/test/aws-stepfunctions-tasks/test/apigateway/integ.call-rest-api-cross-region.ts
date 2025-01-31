import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AuthType, HttpMethod, CallApiGatewayRestApiEndpoint } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { STANDARD_NODEJS_RUNTIME } from '../../../config';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 *
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'status': should return status as SUCCEEDED
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'output': should return the string \"hello, world!\"
 */

const app = new cdk.App();
const apiStack = new cdk.Stack(app, 'CallRestApiInteg-ApiStack', {
  env: {
    region: 'us-west-2',
  },
});
const sfnStack = new cdk.Stack(app, 'CallRestApiInteg-SfnStack', {
  env: {
    region: 'us-east-1',
  },
});
const restApi = new apigateway.RestApi(apiStack, 'MyRestApi', { cloudWatchRole: true });

const hello = new apigateway.LambdaIntegration(new lambda.Function(apiStack, 'Hello', {
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: "hello, world!" }; };'),
}));
restApi.root.addMethod('ANY', hello);

const callEndpointJob = new CallApiGatewayRestApiEndpoint(sfnStack, 'Call APIGW', {
  api: restApi,
  stageName: 'prod',
  method: HttpMethod.GET,
  authType: AuthType.IAM_ROLE,
  outputPath: sfn.JsonPath.stringAt('$.ResponseBody'),
});

const chain = sfn.Chain.start(callEndpointJob);

const sm = new sfn.StateMachine(apiStack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(apiStack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

new IntegTest(app, 'call-rest-api-cross-region', {
  testCases: [apiStack, sfnStack],
});
