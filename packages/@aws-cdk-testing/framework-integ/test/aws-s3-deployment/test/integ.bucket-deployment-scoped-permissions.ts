import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Match } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

/**
 * Integration test to verify that BucketDeployment IAM policies are scoped
 * to the destination key prefix, following the principle of least privilege.
 */
class TestBucketDeploymentScopedPermissions extends cdk.Stack {
  public readonly sharedBucket: s3.IBucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a single bucket that will be shared by multiple deployments
    this.sharedBucket = new s3.Bucket(this, 'SharedBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Deployment 1: Deploy to 'app/frontend/' prefix
    const deployment1 = new s3deploy.BucketDeployment(this, 'DeployFrontend', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: this.sharedBucket,
      destinationKeyPrefix: 'app/frontend/',
      retainOnDelete: false,
    });

    // Deployment 2: Deploy to 'app/backend/' prefix
    const deployment2 = new s3deploy.BucketDeployment(this, 'DeployBackend', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website-second'))],
      destinationBucket: this.sharedBucket,
      destinationKeyPrefix: 'app/backend/',
      retainOnDelete: false,
    });

    // Deployment 3: Deploy to 'assets/' prefix with leading/trailing slashes
    const deployment3 = new s3deploy.BucketDeployment(this, 'DeployAssets', {
      sources: [s3deploy.Source.data('test.txt', 'test content')],
      destinationBucket: this.sharedBucket,
      destinationKeyPrefix: '/assets/', // Test normalization of leading slash
      retainOnDelete: false,
    });

    // Deployment 4: Deploy without prefix (should have /* access)
    const deployment4 = new s3deploy.BucketDeployment(this, 'DeployRoot', {
      sources: [s3deploy.Source.data('root.txt', 'root content')],
      destinationBucket: this.sharedBucket,
      retainOnDelete: false,
    });

    // Output the IAM role ARNs for verification
    new cdk.CfnOutput(this, 'FrontendRoleArn', {
      value: deployment1.handlerRole.roleArn,
      description: 'IAM role for frontend deployment (should have app/frontend/* access)',
    });

    new cdk.CfnOutput(this, 'BackendRoleArn', {
      value: deployment2.handlerRole.roleArn,
      description: 'IAM role for backend deployment (should have app/backend/* access)',
    });

    new cdk.CfnOutput(this, 'AssetsRoleArn', {
      value: deployment3.handlerRole.roleArn,
      description: 'IAM role for assets deployment (should have assets/* access)',
    });

    new cdk.CfnOutput(this, 'RootRoleArn', {
      value: deployment4.handlerRole.roleArn,
      description: 'IAM role for root deployment (should have /* access)',
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: this.sharedBucket.bucketName,
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const testCase = new TestBucketDeploymentScopedPermissions(
  app,
  'test-bucket-deployment-scoped-permissions',
);

const integTest = new integ.IntegTest(app, 'integ-test-scoped-permissions', {
  testCases: [testCase],
  diffAssets: true,
});

// Assert that all deployments succeeded and objects are in correct prefixes
const listFrontendObjects = integTest.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: testCase.sharedBucket.bucketName,
  Prefix: 'app/frontend/',
});

listFrontendObjects.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:ListBucket'],
  Resource: ['*'],
});

listFrontendObjects.expect(integ.ExpectedResult.objectLike({
  Contents: Match.arrayWith([
    Match.objectLike({
      Key: Match.stringLikeRegexp('^app/frontend/'),
    }),
  ]),
}));

const listBackendObjects = integTest.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: testCase.sharedBucket.bucketName,
  Prefix: 'app/backend/',
});

listBackendObjects.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:ListBucket'],
  Resource: ['*'],
});

listBackendObjects.expect(integ.ExpectedResult.objectLike({
  Contents: Match.arrayWith([
    Match.objectLike({
      Key: Match.stringLikeRegexp('^app/backend/'),
    }),
  ]),
}));

const listAssetsObjects = integTest.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: testCase.sharedBucket.bucketName,
  Prefix: 'assets/',
});

listAssetsObjects.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:ListBucket'],
  Resource: ['*'],
});

listAssetsObjects.expect(integ.ExpectedResult.objectLike({
  Contents: Match.arrayWith([
    Match.objectLike({
      Key: 'assets/test.txt',
    }),
  ]),
}));

app.synth();
