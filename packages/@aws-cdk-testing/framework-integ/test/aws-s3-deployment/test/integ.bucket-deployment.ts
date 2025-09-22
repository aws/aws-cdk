import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Match } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

class TestBucketDeployment extends cdk.Stack {
  public readonly bucket5: s3.IBucket;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const destinationBucket = new s3.Bucket(this, 'Destination', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    new s3deploy.BucketDeployment(this, 'DeployMe', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });

    new s3deploy.BucketDeployment(this, 'DeployMeWithEfsStorage', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      destinationKeyPrefix: 'efs/',
      useEfs: true,
      vpc: new ec2.Vpc(this, 'InlineVpc', { restrictDefaultSecurityGroup: false }),
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });

    const bucket2 = new s3.Bucket(this, 'Destination2', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    new s3deploy.BucketDeployment(this, 'DeployWithPrefix', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket2,
      destinationKeyPrefix: 'deploy/here/',
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });

    const bucket3 = new s3.Bucket(this, 'Destination3', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    new s3deploy.BucketDeployment(this, 'DeployWithMetadata', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket3,
      retainOnDelete: false, // default is true, which will block the integration test cleanup
      cacheControl: [s3deploy.CacheControl.setPublic(), s3deploy.CacheControl.maxAge(cdk.Duration.minutes(1))],
      contentType: 'text/html',
      metadata: { A: 'aaa', B: 'bbb', C: 'ccc' },
    });

    new s3deploy.BucketDeployment(this, 'DeployMeWithoutDeletingFilesOnDestination', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      prune: false,
      retainOnDelete: false,
    });

    new s3deploy.BucketDeployment(this, 'DeployMeWithExcludedFilesOnDestination', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      exclude: ['*.gif'],
      retainOnDelete: false,
    });

    const bucket4 = new s3.Bucket(this, 'Destination4', {
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    new s3deploy.BucketDeployment(this, 'DeployMeWithoutExtractingFilesOnDestination', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket4,
      extract: false,
      retainOnDelete: false,
    });

    this.bucket5 = new s3.Bucket(this, 'Destination5', {
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    const deploy5 = new s3deploy.BucketDeployment(this, 'DeployMe5', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website-second'))],
      destinationBucket: this.bucket5,
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });
    deploy5.addSource(s3deploy.Source.data('some-key', 'helloworld'));

    new cdk.CfnOutput(this, 'customResourceData', {
      value: cdk.Fn.sub('Object Keys are ${keys}', {
        keys: cdk.Fn.join(',', deploy5.objectKeys),
      }),
    });

    const bucket6 = new s3.Bucket(this, 'Destination6', {
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    new s3deploy.BucketDeployment(this, 'DeployMe6', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website-second'))],
      destinationBucket: bucket6,
      retainOnDelete: false, // default is true, which will block the integration test cleanup
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

// Assert that DeployMeWithoutExtractingFilesOnDestination deploys a zip file to bucket4
const integTest = new integ.IntegTest(app, 'integ-test-bucket-deployments', {
  testCases: [testCase],
  diffAssets: true,
});
const listObjectsCall = integTest.assertions.awsApiCall('S3', 'listObjects', {
  Bucket: testCase.bucket5.bucketName,
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

// Assert that there is one object key returned from the custom resource
const describe = integTest.assertions.awsApiCall('CloudFormation', 'describeStacks', {
  StackName: 'test-bucket-deployments',
});

describe.assertAtPath('Stacks.0.Outputs.0.OutputKey', integ.ExpectedResult.stringLikeRegexp('customResourceData'));
describe.assertAtPath('Stacks.0.Outputs.0.OutputValue', integ.ExpectedResult.stringLikeRegexp('Object Keys are ([0-9a-f])+\.zip'));

app.synth();
