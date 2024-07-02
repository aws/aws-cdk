import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as iam from 'aws-cdk-lib/aws-iam';
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

  readonly statemachine: sfn.StateMachine;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const customRole = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    customRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    );

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
      role: customRole,
    });

    this.statemachine = new sfn.StateMachine(this, 'StateMachine', {
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
      value: this.statemachine.stateMachineArn,
    });
  }
}

const app = new App();

const testStack = new TestStack(app, 'cdk-sfn-evaluate-expression-integ');

const testCase = new integ.IntegTest(app, 'EvaluateExpressionInteg', {
  testCases: [testStack],
  diffAssets: true,
});

const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: testStack.statemachine.stateMachineArn,
  name: '309d2593-a5a2-4ea5-b401-f778ef06467c',
  input: '{ "a": 3, "b": 4 }',
});

// describe the results of the execution
testCase.assertions
  .awsApiCall(
    'StepFunctions',
    'describeExecution',
    {
      executionArn: start.getAttString('executionArn'),
    })
  .expect(integ.ExpectedResult.objectLike({
    status: 'SUCCEEDED',
  }))
  .waitForAssertions({
    totalTimeout: cdk.Duration.minutes(3),
  });

app.synth();
