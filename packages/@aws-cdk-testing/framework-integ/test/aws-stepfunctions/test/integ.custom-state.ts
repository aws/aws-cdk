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
custom.addRetry({
  errors: [sfn.Errors.TIMEOUT],
  interval: cdk.Duration.seconds(10),
  maxAttempts: 5,
});

const customWithInlineRetry = new sfn.CustomState(stack, 'my custom task with inline Retriers', {
  stateJson: {
    ...stateJson,
    Retry: [{
      ErrorEquals: [sfn.Errors.PERMISSIONS],
      IntervalSeconds: 20,
      MaxAttempts: 2,
    }],
  },
});

const customWithInlineCatch = new sfn.CustomState(stack, 'my custom task with inline Catchers', {
  stateJson: {
    ...stateJson,
    Catch: [{
      ErrorEquals: [sfn.Errors.PERMISSIONS],
      Next: 'failed',
    }],
  },
});

const chain = sfn.Chain.start(custom).next(customWithInlineRetry).next(customWithInlineCatch).next(finalStatus);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'StateMachineARN', {
  value: sm.stateMachineArn,
});

app.synth();
