import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const task = new tasks.EvaluateExpression(this, 'Task', {
      expression: '$.a + $.b',
      runtime: lambda.Runtime.NODEJS_22_X,
    });

    new sfn.StateMachine(this, 'StateMachine', {
      definition: task,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'EvaluateExpressionNodejs22', {
  testCases: [new TestStack(app, 'evaluate-expression-nodejs22')],
});
