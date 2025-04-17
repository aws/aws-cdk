import * as path from 'path';
import * as glue from 'aws-cdk-lib/aws-glue';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as assets from 'aws-cdk-lib/aws-s3-assets';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { GlueStartJobRun, WorkerTypeV2 } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

class GlueStartJobRunWorkerStack extends cdk.Stack {
  readonly stateMachine: sfn.StateMachine;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const codeAsset = new assets.Asset(this, 'Glue Job Script', {
      path: path.join(__dirname, 'my-glue-script/job.py'),
    });

    const jobRole = new iam.Role(this, 'Glue Job Role', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole'),
      ],
    });
    codeAsset.grantRead(jobRole);

    const job = new glue.CfnJob(this, 'Glue Job', {
      name: 'My Glue Job',
      glueVersion: '3.0',
      command: {
        name: 'glueetl',
        pythonVersion: '3',
        scriptLocation: `s3://${codeAsset.s3BucketName}/${codeAsset.s3ObjectKey}`,
      },
      role: jobRole.roleArn,
    });

    const jobTask = new GlueStartJobRun(this, 'Glue Job Task', {
      glueJobName: job.name!,
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
      arguments: sfn.TaskInput.fromObject({
        '--enable-metrics': 'true',
      }),
      workerConfiguration: {
        workerTypeV2: WorkerTypeV2.of(sfn.JsonPath.stringAt('$.glue_jobs_configs.executor_type')),
        numberOfWorkers: sfn.JsonPath.numberAt('$.glue_jobs_configs.max_number_workers'),
      },
    });

    const startTask = new sfn.Pass(this, 'Start Task');
    const endTask = new sfn.Pass(this, 'End Task');

    this.stateMachine = new sfn.StateMachine(this, 'State Machine', {
      definition: sfn.Chain.start(startTask).next(jobTask).next(endTask),
    });
  }
}

const stack = new GlueStartJobRunWorkerStack(app, 'aws-stepfunctions-integ-worker');

const testCase = new IntegTest(app, 'AwsSfnIntegTest', {
  testCases: [stack],
  diffAssets: true,
});

testCase.assertions
  .awsApiCall('StepFunctions', 'describeStateMachine', {
    stateMachineArn: stack.stateMachine.stateMachineArn,
  })
  .expect(ExpectedResult.objectLike({ status: 'ACTIVE' }))
  .waitForAssertions({
    interval: cdk.Duration.seconds(10),
    totalTimeout: cdk.Duration.minutes(5),
  });

// Start an execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stack.stateMachine.stateMachineArn,
  input: JSON.stringify({
    glue_jobs_configs: {
      executor_type: 'G.1X', // Dynamic value for worker type
      max_number_workers: 2, // Dynamic value for number of workers
    },
  }),
});

// describe the results of the execution
const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});
start.next(describe);

// assert the results
describe.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  interval: cdk.Duration.seconds(10),
  totalTimeout: cdk.Duration.minutes(5),
});

app.synth();
