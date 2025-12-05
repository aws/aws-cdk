import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Match } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

/**
 * Integration test for core bucket deployment features:
 * - Basic deployment functionality
 * - Prune behavior (deleting files not in source)
 * - Exclude filters
 * - Extract behavior (extracting vs keeping zip files)
 * - addSource() method for dynamically adding sources
 * - objectKeys output property and outputObjectKeys flag
 */
class TestBucketDeployment extends cdk.Stack {
  public readonly bucketWithAddSource: s3.IBucket;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const commonBucketProps = {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    };

    const destinationBucket = new s3.Bucket(this, 'Destination', {
      ...commonBucketProps,
    });

    // Test basic deployment functionality
    new s3deploy.BucketDeployment(this, 'DeployWithBasic', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      retainOnDelete: false,
    });

    // Test that files not in source are preserved when prune is disabled
    new s3deploy.BucketDeployment(this, 'DeployWithPruneDisabled', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      prune: false,
      retainOnDelete: false,
    });

    // Test exclude filters to skip certain files from deployment
    new s3deploy.BucketDeployment(this, 'DeployWithExclude', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      exclude: ['*.gif'],
      retainOnDelete: false,
    });

    const bucketWithoutExtract = new s3.Bucket(this, 'BucketWithoutExtract', {
      ...commonBucketProps,
    });

    // Test that zip files are uploaded as-is when extract is disabled
    new s3deploy.BucketDeployment(this, 'DeployWithoutExtract', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucketWithoutExtract,
      extract: false,
      retainOnDelete: false,
    });

    this.bucketWithAddSource = new s3.Bucket(this, 'BucketWithAddSource', {
      ...commonBucketProps,
    });

    // Test addSource() method for dynamically adding sources after construction
    // and validate objectKeys output property returns both asset files and added sources
    const deployWithAddSource = new s3deploy.BucketDeployment(this, 'DeployWithAddSource', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website-second'))],
      destinationBucket: this.bucketWithAddSource,
      retainOnDelete: false,
    });
    deployWithAddSource.addSource(s3deploy.Source.data('some-key', 'helloworld'));

    // Output objectKeys to validate they are returned in CloudFormation outputs
    new cdk.CfnOutput(this, 'customResourceData', {
      value: cdk.Fn.sub('Object Keys are ${keys}', {
        keys: cdk.Fn.join(',', deployWithAddSource.objectKeys),
      }),
    });

    const bucketWithoutObjectKeys = new s3.Bucket(this, 'BucketWithoutObjectKeys', {
      ...commonBucketProps,
    });

    // Test that objectKeys are not returned when outputObjectKeys is disabled
    new s3deploy.BucketDeployment(this, 'DeployWithoutObjectKeys', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website-second'))],
      destinationBucket: bucketWithoutObjectKeys,
      retainOnDelete: false,
      outputObjectKeys: false,
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new TestBucketDeployment(app, 'test-bucket-deployments');

const integTest = new integ.IntegTest(app, 'integ-test-bucket-deployments', {
  testCases: [testCase],
  diffAssets: true,
});

// Assert that addSource() successfully adds the data source alongside the asset source
const listObjectsCall = integTest.assertions.awsApiCall('S3', 'listObjects', {
  Bucket: testCase.bucketWithAddSource.bucketName,
});
listObjectsCall.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:GetObject', 's3:ListBucket'],
  Resource: ['*'],
});
listObjectsCall.expect(integ.ExpectedResult.objectLike({
  Contents: Match.arrayWith(
    [
      Match.objectLike({
        Key: '403.html',
      }),
      Match.objectLike({
        Key: 'some-key',
      }),
    ],
  ),
}));

// Assert that objectKeys output contains the deployed object keys when outputObjectKeys is enabled (default)
const describe = integTest.assertions.awsApiCall('CloudFormation', 'describeStacks', {
  StackName: 'test-bucket-deployments',
});

describe.assertAtPath('Stacks.0.Outputs.0.OutputKey', integ.ExpectedResult.stringLikeRegexp('customResourceData'));
describe.assertAtPath('Stacks.0.Outputs.0.OutputValue', integ.ExpectedResult.stringLikeRegexp('Object Keys are ([0-9a-f])+\\.zip(,([0-9a-f])+\\.zip)*'));

app.synth();
