import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StepFunctionsStartExecution } from 'aws-cdk-lib/aws-stepfunctions-tasks';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --input '{"hello": "world"}' --state-machine-arn <StateMachineARN>
 * * aws stepfunctions describe-execution --execution-arn <execution-arn>
 * * The output here should contain `status: "SUCCEEDED"` and `output`: '"Output": { "hello": "world"},'
 */

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const child = new sfn.StateMachine(this, 'Child', {
      definition: new sfn.Pass(this, 'Pass'),
    });

    const parent = new sfn.StateMachine(this, 'Parent', {
      definition: new StepFunctionsStartExecution(this, 'Task', {
        stateMachine: child,
        input: sfn.TaskInput.fromObject({
          hello: sfn.JsonPath.stringAt('$.hello'),
        }),
        integrationPattern: sfn.IntegrationPattern.RUN_JOB,
      }),
    });

    new CfnOutput(this, 'StateMachineARN', {
      value: parent.stateMachineArn,
    });
  }
}

const app = new App();

new TestStack(app, 'integ-sfn-start-execution');

app.synth();
