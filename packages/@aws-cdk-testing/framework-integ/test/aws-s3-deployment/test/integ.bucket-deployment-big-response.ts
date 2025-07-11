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

class TestBucketDeployment extends cdk.Stack {
  public readonly destinationBucket: s3.IBucket;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.destinationBucket = new s3.Bucket(this, 'Destination', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    const sources = [];
    for (let i = 0; i < numFiles; i++) {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmpcdk'));
      fs.mkdirSync(tempDir, { recursive: true });
      const fileName = `${i+1}.txt`;
      const filePath = path.join(tempDir, fileName);
      fs.writeFileSync(filePath, `This is file number ${i + 1}`);
      sources.push(s3deploy.Source.asset(tempDir));
    }

    const deploymentBucket = new s3deploy.BucketDeployment(this, 'DeployMe', {
      sources: sources,
      destinationBucket: this.destinationBucket,
      memoryLimit: 2048,
      retainOnDelete: false, // default is true, which will block the integration test cleanup
      outputObjectKeys: false,
    });

    new CfnOutput(this, 'customResourceData', {
      value: Fn.sub('Object Keys are${keys}', {
        keys: Fn.join(',', deploymentBucket.objectKeys),
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

const integTest = new integ.IntegTest(app, 'integ-test-bucket-deployments', {
  testCases: [testCase],
  diffAssets: true,
});

// Assert that DeployMeWithoutExtractingFilesOnDestination deploys a zip file to bucket4
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

// Assert that there is no object keys returned from the custom resource
const describe = integTest.assertions.awsApiCall('CloudFormation', 'describeStacks', {
  StackName: 'test-bucket-deployments-too-many-sources',
});

describe.assertAtPath('Stacks.0.Outputs.0.OutputKey', ExpectedResult.stringLikeRegexp('customResourceData'));
describe.assertAtPath('Stacks.0.Outputs.0.OutputValue', ExpectedResult.stringLikeRegexp('Object Keys are'));

app.synth();
