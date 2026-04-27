import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

/**
 * Integration test for bucket deployment with architecture property:
 * - Tests deployment with ARM_64 architecture
 * - Tests deployment with X86_64 architecture
 * - Validates that files are successfully deployed to S3 using each architecture
 */
class TestBucketDeploymentArchitectureStack extends cdk.Stack {
  public readonly arm64Bucket: s3.IBucket;
  public readonly x86Bucket: s3.IBucket;
  public readonly arm64FunctionName: string;
  public readonly x86FunctionName: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const commonBucketProps = {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    };

    this.arm64Bucket = new s3.Bucket(this, 'Arm64Destination', {
      ...commonBucketProps,
    });

    // Test deployment with ARM_64 architecture
    const arm64Deploy = new s3deploy.BucketDeployment(this, 'DeployWithArm64', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: this.arm64Bucket,
      architecture: lambda.Architecture.ARM_64,
      retainOnDelete: false,
    });

    this.x86Bucket = new s3.Bucket(this, 'X86Destination', {
      ...commonBucketProps,
    });

    // Test deployment with X86_64 architecture
    const x86Deploy = new s3deploy.BucketDeployment(this, 'DeployWithX86', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: this.x86Bucket,
      architecture: lambda.Architecture.X86_64,
      retainOnDelete: false,
    });

    // Export Lambda function names for architecture assertions
    const arm64Handler = arm64Deploy.node.findChild('CustomResourceHandler') as lambda.SingletonFunction;
    const x86Handler = x86Deploy.node.findChild('CustomResourceHandler') as lambda.SingletonFunction;
    this.arm64FunctionName = arm64Handler.functionName;
    this.x86FunctionName = x86Handler.functionName;
  }
}

const app = new cdk.App();
const testStack = new TestBucketDeploymentArchitectureStack(app, 'test-bucket-deployment-architecture');

const integTest = new IntegTest(app, 'integ-test-bucket-deployment-architecture', {
  testCases: [testStack],
});

// Assert that files are successfully deployed to S3 using ARM-based Lambda
const listArm64Objects = integTest.assertions.awsApiCall('S3', 'listObjects', {
  Bucket: testStack.arm64Bucket.bucketName,
});
listArm64Objects.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:GetObject', 's3:ListBucket'],
  Resource: ['*'],
});
listArm64Objects.expect(ExpectedResult.objectLike({
  Contents: Match.arrayWith(
    [
      Match.objectLike({
        Key: 'index.html',
      }),
    ],
  ),
}));

// Assert that files are successfully deployed to S3 using X86-based Lambda
const listX86Objects = integTest.assertions.awsApiCall('S3', 'listObjects', {
  Bucket: testStack.x86Bucket.bucketName,
});
listX86Objects.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:GetObject', 's3:ListBucket'],
  Resource: ['*'],
});
listX86Objects.expect(ExpectedResult.objectLike({
  Contents: Match.arrayWith(
    [
      Match.objectLike({
        Key: 'index.html',
      }),
    ],
  ),
}));

// Assert that the ARM_64 Lambda function has the correct architecture
integTest.assertions.awsApiCall('Lambda', 'getFunction', {
  FunctionName: testStack.arm64FunctionName,
}).expect(ExpectedResult.objectLike({
  Configuration: Match.objectLike({
    Architectures: ['arm64'],
  }),
}));

// Assert that the X86_64 Lambda function has the correct architecture
integTest.assertions.awsApiCall('Lambda', 'getFunction', {
  FunctionName: testStack.x86FunctionName,
}).expect(ExpectedResult.objectLike({
  Configuration: Match.objectLike({
    Architectures: ['x86_64'],
  }),
}));
