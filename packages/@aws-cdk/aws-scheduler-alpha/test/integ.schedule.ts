import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as scheduler from '../lib';
import { Schedule, targets } from '../lib/private';

/*
 * Stack verification steps:
 * The lambda MyLambda is triggered after 5 minutes which adds a Tag:
 *   Key: OutputValue
 *   Value: base64 JSON string of the input event
 * The assertion checks if it is the correct value
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-schedule');

const functionName = 'MyTestFunc';
const functionArn = stack.formatArn({
  service: 'lambda',
  resource: 'function',
  resourceName: functionName,
  arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
});
const payload = 'test';

const func = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode(`
    const { LambdaClient, TagResourceCommand } = require('@aws-sdk/client-lambda');

    const client = new LambdaClient();

    let arn = process.env.FUNC_ARN;

    exports.handler = async (event, context) => {
        const value = btoa(JSON.stringify(event, null, 2));
        const input = {
            Resource: arn,
            Tags: {
                "OutputValue": value,
            },
        };
        const command = new TagResourceCommand(input);
        const response = await client.send(command);
    };`,
  ),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_18_X,
  functionName: functionName,
});
func.addEnvironment('FUNC_ARN', stack.resolve(functionArn));

func.addToRolePolicy(new iam.PolicyStatement(
  new iam.PolicyStatement({
    actions: ['lambda:TagResource'],
    resources: ['*'],
  }),
));

// currently no autocreated role, this will be fixed in future
const role = new iam.Role(stack, 'MyRole', {
  assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
});

const now_time = new Date(Date.now());
const in_a_munite = new Date(now_time.getTime() + 5*60000);

new Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.at(in_a_munite),
  target: new targets.LambdaInvoke({
    input: scheduler.ScheduleTargetInput.fromText(payload),
    role,
  }, func),
});

const integ = new IntegTest(app, 'integtest-endpoint', {
  testCases: [stack],
  stackUpdateWorkflow: false, // this would cause the schedule to trigger with the old code
});

const invoke = integ.assertions.awsApiCall('Lambda', 'listTags', {
  Resource: stack.resolve(functionArn),
});
invoke.expect(ExpectedResult.objectLike({
  Tags: {
    OutputValue: Buffer.from(JSON.stringify(payload)).toString('base64'),
  },
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(10),
  interval: cdk.Duration.seconds(5),
});
