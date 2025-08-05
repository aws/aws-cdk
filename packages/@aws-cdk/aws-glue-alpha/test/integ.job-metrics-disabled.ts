import * as integ from '@aws-cdk/integ-tests-alpha';
import { Match } from 'aws-cdk-lib/assertions';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as glue from '../lib';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * Integration test to verify that Glue jobs deploy successfully with metrics disabled.
 *
 * This test validates CloudFormation template generation and AWS deployment, not runtime metrics behavior.
 * CDK integration tests focus on infrastructure deployment rather than application-level validation.
 *
 * This test validates:
 * 1. CloudFormation template with disabled metrics is accepted by AWS
 * 2. Glue jobs can be created without --enable-metrics and --enable-observability-metrics arguments
 * 3. Cost optimization scenario works in real AWS environment
 * 4. Template generation correctly excludes metrics arguments when disabled
 *
 * Note: Actual metrics emission validation would require running jobs and monitoring CloudWatch,
 * which is beyond the scope of CDK integration tests that focus on infrastructure deployment.
 *
 * To manually verify job functionality:
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

const integTest = new integ.IntegTest(app, 'aws-glue-job-metrics-disabled-integ-test', {
  testCases: [stack],
});

// Validate that PySpark job with disabled metrics doesn't have metrics arguments
const pySparkJobNoMetrics = integTest.assertions.awsApiCall('Glue', 'getJob', {
  JobName: 'PySparkETLJobNoMetrics',
});

// Validate the entire DefaultArguments object to ensure metrics arguments are not present
pySparkJobNoMetrics.expect(integ.ExpectedResult.objectLike({
  Job: {
    // DefaultArguments should not contain metrics arguments
    DefaultArguments: Match.not(Match.objectLike({
      '--enable-metrics': Match.anyValue(),
    })),
  },
}));

pySparkJobNoMetrics.expect(integ.ExpectedResult.objectLike({
  Job: {
    // DefaultArguments should not contain observability metrics arguments
    DefaultArguments: Match.not(Match.objectLike({
      '--enable-observability-metrics': Match.anyValue(),
    })),
  },
}));

// Validate that Ray job with disabled metrics doesn't have metrics arguments
const rayJobNoMetrics = integTest.assertions.awsApiCall('Glue', 'getJob', {
  JobName: 'RayJobNoMetrics',
});

rayJobNoMetrics.expect(integ.ExpectedResult.objectLike({
  Job: {
    DefaultArguments: Match.not(Match.objectLike({
      '--enable-metrics': Match.anyValue(),
      '--enable-observability-metrics': Match.anyValue(),
    })),
  },
}));

// Validate that job with selective metrics control has correct arguments
const pySparkJobSelective = integTest.assertions.awsApiCall('Glue', 'getJob', {
  JobName: 'PySparkETLJobSelectiveMetrics',
});

// Should NOT have --enable-metrics (disabled)
pySparkJobSelective.expect(integ.ExpectedResult.objectLike({
  Job: {
    DefaultArguments: Match.not(Match.objectLike({
      '--enable-metrics': Match.anyValue(),
    })),
  },
}));

// Should HAVE --enable-observability-metrics (enabled by default)
pySparkJobSelective.expect(integ.ExpectedResult.objectLike({
  Job: {
    DefaultArguments: Match.objectLike({
      '--enable-observability-metrics': 'true',
    }),
  },
}));

app.synth();
