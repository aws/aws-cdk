import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3files from '../../lib';

class FileSystemWithKmsStack extends core.Stack {
  public readonly fileSystem: s3files.FileSystem;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
    const key = new kms.Key(this, 'Key', {
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
    const bucket = new s3.Bucket(this, 'Bucket', {
      versioned: true,
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: key,
      removalPolicy: core.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    this.fileSystem = new s3files.FileSystem(this, 'FileSystem', {
      bucket,
      kmsKey: key,
      vpcConfiguration: {
        vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      },
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

const app = new core.App();

const stack = new FileSystemWithKmsStack(app, 'S3FilesKmsStack');

const integ = new IntegTest(app, 'S3FilesKmsIntegTest', {
  testCases: [stack],
});

// Assert the KMS-encrypted file system is available
const describeFs = integ.assertions.awsApiCall('@aws-sdk/client-s3files', 'GetFileSystemCommand', {
  fileSystemId: stack.fileSystem.fileSystemId,
});

describeFs.expect(ExpectedResult.objectLike({
  status: 'available',
}));

app.synth();
