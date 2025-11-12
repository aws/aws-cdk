import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { DeployTimeSubstitutedFile } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

/**
 * Integration test for DeployTimeSubstitutedFile with custom execution role:
 * - Tests that custom IAM roles can be used for the Lambda execution function
 * - Validates that role configuration works correctly with file substitution
 */
const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

class TestBucketDeploymentSubstitutionWithRole extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    const executionRole = new iam.Role(this, 'ExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    new DeployTimeSubstitutedFile(this, 'DeployWithCustomRole', {
      source: path.join(__dirname, 'sample-file.yaml'),
      destinationBucket: bucket,
      substitutions: { },
      role: executionRole,
    });
  }
}

const testCase = new TestBucketDeploymentSubstitutionWithRole(app, 'test-bucket-deployment-substitution-with-role');

new integ.IntegTest(app, 'integ-test-bucket-deployment-substitution-with-role', {
  testCases: [testCase],
});

app.synth();
