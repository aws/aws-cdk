import * as integ from '@aws-cdk/integ-tests-alpha';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as glue from '../lib';
import * as iam from 'aws-cdk-lib/aws-iam';

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
 * For example, to test the ETLJob
 * - Run: `aws glue start-job-run --region us-east-1 --job-name ETLJob`
 * - Get Status: `aws glue get-job-run --region us-east-1 --job-name ETLJob --run-id <runId output by the above command>`
 * - Check output: `aws logs get-log-events --region us-east-1 --log-group-name "/aws-glue/python-jobs/output" --log-stream-name "<runId>>` which should show "hello world"
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-glue-job-pyspark-streaming');

const script = glue.Code.fromAsset(path.join(__dirname, 'job-script', 'hello_world.py'));

const iam_role = new iam.Role(stack, 'IAMServiceRole', {
  assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole')],
});

new glue.PySparkStreamingJob(stack, 'BasicPySparkStreamingJob', {
  script: script,
  role: iam_role,
});

new glue.PySparkStreamingJob(stack, 'OverridePySparkStreamingJob', {
  script: script,
  role: iam_role,
  description: 'Optional Override PySpark Streaming Job',
  glueVersion: glue.GlueVersion.V3_0,
  numberOfWorkers: 20,
  workerType: glue.WorkerType.G_1X,
  timeout: cdk.Duration.minutes(15),
  jobName: 'Optional Override PySpark Streaming Job',
  defaultArguments: {
    arg1: 'value1',
    arg2: 'value2',
  },
  tags: {
    key: 'value',
  },
  jobRunQueuingEnabled: true,
});

new integ.IntegTest(app, 'aws-glue-job-pyspark-streaming-integ-test', {
  testCases: [stack],
});

app.synth();
