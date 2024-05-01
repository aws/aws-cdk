import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

/*
 * Creates a state machine with a job poller sample project
 * https://docs.aws.amazon.com/step-functions/latest/dg/sample-project-job-poller.html
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Running`.
 *
 * An external process can call the state machine to send a heartbeat or response before it times out.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Running`
 *
 * CHANGEME: extend this test to create the external resources to report heartbeats
 */
class InvokeActivityStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const submitJobActivity = new sfn.Activity(this, 'SubmitJob');
    const checkJobActivity = new sfn.Activity(this, 'CheckJob');

    const submitJob = new tasks.StepFunctionsInvokeActivity(this, 'Submit Job', {
      activity: submitJobActivity,
      resultPath: '$.guid',
    });
    const waitX = new sfn.Wait(this, 'Wait X Seconds', { time: sfn.WaitTime.secondsPath('$.wait_time') });
    const getStatus = new tasks.StepFunctionsInvokeActivity(this, 'Get Job Status', {
      activity: checkJobActivity,
      inputPath: '$.guid',
      resultPath: '$.status',
    });
    const isComplete = new sfn.Choice(this, 'Job Complete?');
    const jobFailed = new sfn.Fail(this, 'Job Failed', {
      cause: 'AWS Batch Job Failed',
      error: 'DescribeJob returned FAILED',
    });
    const finalStatus = new tasks.StepFunctionsInvokeActivity(this, 'Get Final Job Status', {
      activity: checkJobActivity,
      inputPath: '$.guid',
      parameters: {
        'input.$': '$',
        'stringArgument': 'inital-task',
        'numberArgument': 123,
        'booleanArgument': true,
        'arrayArgument': ['a', 'b', 'c'],
        'jsonPath': sfn.JsonPath.stringAt('$.status'),
      },
    });

    const chain = sfn.Chain
      .start(submitJob)
      .next(waitX)
      .next(getStatus)
      .next(isComplete
        .when(sfn.Condition.stringEquals('$.status', 'FAILED'), jobFailed)
        .when(sfn.Condition.stringEquals('$.status', 'SUCCEEDED'), finalStatus)
        .otherwise(waitX));

    const sm = new sfn.StateMachine(this, 'StateMachine', {
      definition: chain,
      timeout: cdk.Duration.seconds(300),
    });

    new cdk.CfnOutput(this, 'stateMachineArn', {
      value: sm.stateMachineArn,
    });
  }
}

const app = new cdk.App();
new InvokeActivityStack(app, 'aws-stepfunctions-integ');
app.synth();
