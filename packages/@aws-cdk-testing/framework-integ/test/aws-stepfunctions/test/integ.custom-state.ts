import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

/*
 * Stack verification steps:
 *
 * -- aws stepfunctions describe-state-machine --state-machine-arn <stack-output> has a status of `ACTIVE`
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-custom-state-integ');

const finalStatus = new sfn.Pass(stack, 'final step');

const stateJson = {
  Type: 'Task',
  Resource: 'arn:aws:states:::dynamodb:putItem',
  Parameters: {
    TableName: 'my-cool-table',
    Item: {
      id: {
        S: 'my-entry',
      },
    },
  },
  ResultPath: null,
};

const failure = new sfn.Fail(stack, 'failed', {
  error: 'DidNotWork',
  cause: 'We got stuck',
});

const custom = new sfn.CustomState(stack, 'my custom task', {
  stateJson,
});

custom.addCatch(failure);

const chain = sfn.Chain.start(custom).next(finalStatus);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'StateMachineARN', {
  value: sm.stateMachineArn,
});

app.synth();
