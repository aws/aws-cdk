import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3files from '../../lib';

class BasicFileSystemStack extends core.Stack {
  public readonly fileSystem: s3files.FileSystem;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2 });
    const bucket = new s3.Bucket(this, 'Bucket', {
      versioned: true,
      removalPolicy: core.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    this.fileSystem = new s3files.FileSystem(this, 'FileSystem', {
      bucket,
      vpcConfiguration: {
        vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      },
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

const app = new core.App();

const stack = new BasicFileSystemStack(app, 'S3FilesBasicStack');

const integ = new IntegTest(app, 'S3FilesFileSystemIntegTest', {
  testCases: [stack],
});

// Assert the file system exists and is available
const describeFs = integ.assertions.awsApiCall('@aws-sdk/client-s3files', 'GetFileSystemCommand', {
  fileSystemId: stack.fileSystem.fileSystemId,
});

describeFs.expect(ExpectedResult.objectLike({
  status: 'available',
}));

app.synth();
