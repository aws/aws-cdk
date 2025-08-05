import * as integ from '@aws-cdk/integ-tests-alpha';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as glue from '../lib';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * Integration test to verify that Glue jobs deploy successfully with metrics disabled.
 *
 * This test validates:
 * 1. CloudFormation template with disabled metrics is accepted by AWS
 * 2. Glue jobs can be created without --enable-metrics and --enable-observability-metrics
 * 3. Cost optimization scenario works in real AWS environment
 *
 * To verify the job functionality:
 * Run: `aws glue start-job-run --region us-east-1 --job-name <job name>`
 * Status: `aws glue get-job-run --region us-east-1 --job-name <job name> --run-id <runId>`
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-glue-job-metrics-disabled');

const script = glue.Code.fromAsset(path.join(__dirname, 'job-script', 'hello_world.py'));

const role = new iam.Role(stack, 'IAMServiceRole', {
  assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole')],
});

// Test PySpark ETL Job with both metrics disabled (cost optimization scenario)
new glue.PySparkEtlJob(stack, 'PySparkETLJobNoMetrics', {
  script: script,
  role: role,
  jobName: 'PySparkETLJobNoMetrics',
  enableMetrics: false,
  enableObservabilityMetrics: false,
});

// Test Ray Job with both metrics disabled
new glue.RayJob(stack, 'RayJobNoMetrics', {
  script: script,
  role: role,
  jobName: 'RayJobNoMetrics',
  enableMetrics: false,
  enableObservabilityMetrics: false,
});

// Test selective metrics control (keep observability, disable profiling)
new glue.PySparkEtlJob(stack, 'PySparkETLJobSelectiveMetrics', {
  script: script,
  role: role,
  jobName: 'PySparkETLJobSelectiveMetrics',
  enableMetrics: false,
  enableObservabilityMetrics: true,
});

new integ.IntegTest(app, 'aws-glue-job-metrics-disabled-integ-test', {
  testCases: [stack],
});

app.synth();
