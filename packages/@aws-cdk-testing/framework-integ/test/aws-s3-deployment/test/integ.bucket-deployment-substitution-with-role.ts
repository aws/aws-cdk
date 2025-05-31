import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { DeployTimeSubstitutedFile } from 'aws-cdk-lib/aws-s3-deployment';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'cdk-s3-deploy-substitution-with-role');

const bucket = new Bucket(stack, 'substitution-bucket');
const executionRole = new iam.Role(stack, 'execution-role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

new DeployTimeSubstitutedFile(stack, 'Deployment', {
  source: path.join(__dirname, 'sample-file.yaml'),
  destinationBucket: bucket,
  substitutions: { },
  role: executionRole,
});

new IntegTest(app, 'test-s3-deploy-substitution-with-role', {
  testCases: [stack],
});

app.synth();
