import * as path from 'path';
import * as glue from 'aws-cdk-lib/aws-glue';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as assets from 'aws-cdk-lib/aws-s3-assets';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { GlueStartJobRun } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn>
 * * aws stepfunctions describe-execution --execution-arn <execution arn created above>
 * The "describe-execution" call should eventually return status "SUCCEEDED".
 * NOTE: It will take up to 15 minutes for the step function to complete due to the cold start time
 * for AWS Glue, which as of 02/2020, is around 10-15 minutes.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-integ');

const codeAsset = new assets.Asset(stack, 'Glue Job Script', {
  path: path.join(__dirname, 'my-glue-script/job.py'),
});

const jobRole = new iam.Role(stack, 'Glue Job Role', {
  assumedBy: new iam.ServicePrincipal('glue'),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole'),
  ],
});
codeAsset.grantRead(jobRole);

const job = new glue.CfnJob(stack, 'Glue Job', {
  name: 'My Glue Job',
  glueVersion: '1.0',
  command: {
    name: 'glueetl',
    pythonVersion: '3',
    scriptLocation: `s3://${codeAsset.s3BucketName}/${codeAsset.s3ObjectKey}`,
  },
  role: jobRole.roleArn,
});

const jobTask = new GlueStartJobRun(stack, 'Glue Job Task', {
  glueJobName: job.name!,
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  arguments: sfn.TaskInput.fromObject({
    '--enable-metrics': 'true',
  }),
});

const startTask = new sfn.Pass(stack, 'Start Task');
const endTask = new sfn.Pass(stack, 'End Task');

const stateMachine = new sfn.StateMachine(stack, 'State Machine', {
  definition: sfn.Chain.start(startTask).next(jobTask).next(endTask),
});

new cdk.CfnOutput(stack, 'State Machine ARN Output', {
  value: stateMachine.stateMachineArn,
});

new IntegTest(app, 'AwsSfnIntegTest', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
