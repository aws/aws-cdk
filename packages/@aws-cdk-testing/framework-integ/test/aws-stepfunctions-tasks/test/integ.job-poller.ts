import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

class JobPollerStack extends cdk.Stack {
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
    });

    const chain = sfn.Chain
      .start(submitJob)
      .next(waitX)
      .next(getStatus)
      .next(isComplete
        .when(sfn.Condition.stringEquals('$.status', 'FAILED'), jobFailed)
        .when(sfn.Condition.stringEquals('$.status', 'SUCCEEDED'), finalStatus)
        .otherwise(waitX));

    new sfn.StateMachine(this, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(chain),
      timeout: cdk.Duration.seconds(30),
    });
  }
}

const app = new cdk.App();
new JobPollerStack(app, 'aws-stepfunctions-integ');
app.synth();
