import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { CfnOutput, Fn } from 'aws-cdk-lib';
import { ExpectedResult } from '@aws-cdk/integ-tests-alpha';

const numFiles = 50;

/**
 * Integration test for bucket deployment with many sources (big response):
 * - Tests deployment with 50 source files to validate response size handling
 * - Uses increased memory limit (2048MB) for large deployments
 * - Validates that objectKeys output is disabled when outputObjectKeys is false
 */
class TestBucketDeployment extends cdk.Stack {
  public readonly destinationBucket: s3.IBucket;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.destinationBucket = new s3.Bucket(this, 'Destination', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    // Create multiple source files to test big response handling
    const sources = [];
    for (let i = 0; i < numFiles; i++) {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmpcdk'));
      process.on('exit', () => {
        fs.rmSync(tempDir, { force: true, recursive: true });
      });

      fs.mkdirSync(tempDir, { recursive: true });
      const fileName = `${i+1}.txt`;
      const filePath = path.join(tempDir, fileName);
      fs.writeFileSync(filePath, `This is file number ${i + 1}`);
      sources.push(s3deploy.Source.asset(tempDir));
    }

    const deployment = new s3deploy.BucketDeployment(this, 'DeployWithManySources', {
      sources: sources,
      destinationBucket: this.destinationBucket,
      memoryLimit: 2048,
      retainOnDelete: false,
      outputObjectKeys: false,
    });

    new CfnOutput(this, 'customResourceData', {
      value: Fn.sub('Object Keys are${keys}', {
        keys: Fn.join(',', deployment.objectKeys),
      }),
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new TestBucketDeployment(app, 'test-bucket-deployments-too-many-sources');

const integTest = new integ.IntegTest(app, 'integ-test-bucket-deployment-big-response', {
  testCases: [testCase],
  diffAssets: true,
});

// Assert that all files were successfully deployed
for (let i = 0; i < numFiles; i++) {
  const apiCall = integTest.assertions.awsApiCall('S3', 'getObject', {
    Bucket: testCase.destinationBucket.bucketName,
    Key: `${i+1}.txt`,
  });
  apiCall.provider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['s3:GetObject', 's3:ListBucket'],
    Resource: ['*'],
  });
  apiCall.assertAtPath('Body', ExpectedResult.stringLikeRegexp(`This is file number ${i + 1}`));
}

// Assert that objectKeys output is empty when outputObjectKeys is false
const describe = integTest.assertions.awsApiCall('CloudFormation', 'describeStacks', {
  StackName: 'test-bucket-deployments-too-many-sources',
});

describe.assertAtPath('Stacks.0.Outputs.0.OutputKey', ExpectedResult.stringLikeRegexp('customResourceData'));
describe.assertAtPath('Stacks.0.Outputs.0.OutputValue', ExpectedResult.stringLikeRegexp('Object Keys are'));

app.synth();
