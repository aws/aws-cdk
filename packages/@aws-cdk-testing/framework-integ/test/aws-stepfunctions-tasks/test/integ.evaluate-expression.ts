import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --input '{"a": 3, "b": 4}' --state-machine-arn <StateMachineARN>
 * * aws stepfunctions describe-execution --execution-arn <execution-arn>
 * * The output here should contain `status: "SUCCEEDED"` and `output: "{ a: 3, b: 4, c: 7, d: 14, now: <current date> }"
 */

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sum = new tasks.EvaluateExpression(this, 'Sum', {
      expression: '$.a + $.b',
      resultPath: '$.c',
    });

    const multiply = new tasks.EvaluateExpression(this, 'Multiply', {
      expression: '$.c * 2',
      resultPath: '$.d',
      runtime: STANDARD_NODEJS_RUNTIME,
    });

    const now = new tasks.EvaluateExpression(this, 'Now', {
      expression: '(new Date()).toUTCString()',
      resultPath: '$.now',
      runtime: STANDARD_NODEJS_RUNTIME,
    });

    const statemachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: sum
        .next(multiply)
        .next(
          new sfn.Wait(this, 'Wait', {
            time: sfn.WaitTime.secondsPath('$.d'),
          }),
        )
        .next(now),
    });

    new cdk.CfnOutput(this, 'StateMachineARN', {
      value: statemachine.stateMachineArn,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

new integ.IntegTest(app, 'EvaluateExpressionInteg', {
  testCases: [new TestStack(app, 'cdk-sfn-evaluate-expression-integ')],
  diffAssets: true,
});

app.synth();
