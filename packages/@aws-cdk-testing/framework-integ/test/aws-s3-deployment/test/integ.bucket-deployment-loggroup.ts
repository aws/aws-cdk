import * as path from 'path';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

/**
 * Integration test for bucket deployment with custom log group:
 * - Lambda function writes logs to a custom CloudWatch Log Group
 * - Tests that custom log groups work correctly with bucket deployments
 */
class TestBucketDeployment extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const destinationBucket = new s3.Bucket(this, 'Destination', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    new s3deploy.BucketDeployment(this, 'DeployWithCustomLogGroup', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      logGroup: new logs.LogGroup(this, 'LogGroup', {
        retention: logs.RetentionDays.ONE_DAY,
        removalPolicy: cdk.RemovalPolicy.DESTROY, // cleanup integ test
      }),
      retainOnDelete: false,
    });
  }
}

const app = new cdk.App();
const testCase = new TestBucketDeployment(app, 'test-bucket-deployment-loggroup');

new integ.IntegTest(app, 'integ-test-bucket-deployment-loggroup', {
  testCases: [testCase],
  diffAssets: false,
});

app.synth();
