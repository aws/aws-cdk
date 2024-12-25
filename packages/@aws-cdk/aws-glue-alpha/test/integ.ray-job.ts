import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as glue from '../lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as integ from '@aws-cdk/integ-tests-alpha';

/**
 * To verify the ability to run jobs created in this test
 *
 * Run the job using
 *   `aws glue start-job-run --region us-east-1 --job-name <job name>`
 * This will return a runId
 *
 * Get the status of the job run using
 *   `aws glue get-job-run --region us-east-1 --job-name <job name> --run-id <runId>`
 *
 * For example, to test the ShellJob
 * - Run: `aws glue start-job-run --region us-east-1 --job-name ShellJob`
 * - Get Status: `aws glue get-job-run --region us-east-1 --job-name ShellJob --run-id <runId output by the above command>`
 * - Check output: `aws logs get-log-events --region us-east-1 --log-group-name "/aws-glue/python-jobs/output" --log-stream-name "<runId>>` which should show "hello world"
 */
const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-glue-ray-job');

const script = glue.Code.fromAsset(path.join(__dirname, 'job-script', 'hello_world.py'));

const iam_role = new iam.Role(stack, 'IAMServiceRole', {
  assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole')],
});

new glue.RayJob(stack, 'BasicRayJob', {
  script: script,
  role: iam_role,
});

new glue.RayJob(stack, 'RayJob5Workers', {
  script: script,
  role: iam_role,
  numberOfWorkers: 5,
  jobName: 'RayJobWith5Workers',
  defaultArguments: {
    arg1: 'value1',
    arg2: 'value2',
  },
  tags: {
    key: 'value',
  },
});

new integ.IntegTest(app, 'aws-glue-ray-job-integ-test', {
  testCases: [stack],
});

app.synth();
