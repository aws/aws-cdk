import * as scheduler from '@aws-cdk/aws-scheduler-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SnsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { SnsPublish } from '../lib/sns-publish';

/*
 * Stack verification steps:
 * 1. Create a parameter 'MyParameter' in SystemsManager(SSM) with value '🌧️'
 * 2. The lambda subscribed to the SNS topic updates the Parameter 'MyParameter' from value '🌧️' to '🌈':
 * 3. The SNS publish is invoked by the scheduler.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-scheduler-targets-sns-publish');

const payload = {
  Name: 'MyParameter',
  Value: '🌈',
};

const lambdaCode = `
exports.handler = async function(event) {
  const { SSMClient, PutParameterCommand } = require('@aws-sdk/client-ssm');

  const client = new SSMClient();

  const input = {
    Name: '${payload.Name}',
    Value: '${payload.Value}',
    Overwrite: true,
  };
  const command = new PutParameterCommand(input);
  await client.send(command);
}
`;
const func = new lambda.Function(stack, 'MyLambda', {
  code: lambda.Code.fromInline(lambdaCode),
  handler: 'index.handler',
  timeout: cdk.Duration.seconds(30),
  runtime: lambda.Runtime.NODEJS_LATEST,
});

const parameter = new ssm.StringParameter(stack, 'MyParameter', {
  parameterName: payload.Name,
  stringValue: '🌧️',
});
parameter.grantWrite(func);

const topic = new sns.Topic(stack, 'Topic');
func.addEventSource(new SnsEventSource(topic));

new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: new SnsPublish(topic),
});

const integrationTest = new IntegTest(app, 'integrationtest-scheduler-targets-sns-publish', {
  testCases: [stack],
  stackUpdateWorkflow: false, // this would cause the schedule to trigger with the old code
});

const getParameter = integrationTest.assertions.awsApiCall('SSM', 'getParameter', {
  Name: payload.Name,
});

// Verifies that expected parameter is created by the invoked step function
getParameter.expect(ExpectedResult.objectLike({
  Parameter: {
    Name: payload.Name,
    Value: payload.Value,
  },
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(2),
});

app.synth();