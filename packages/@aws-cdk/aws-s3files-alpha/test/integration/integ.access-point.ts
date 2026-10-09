import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3files from '../../lib';

class FileSystemWithAccessPointStack extends core.Stack {
  public readonly fileSystem: s3files.FileSystem;
  public readonly accessPoint: s3files.AccessPoint;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
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

    this.accessPoint = this.fileSystem.addAccessPoint('AccessPoint', {
      path: '/data',
      createAcl: {
        ownerUid: '1000',
        ownerGid: '1000',
        permissions: '755',
      },
      posixUser: {
        uid: '1000',
        gid: '1000',
      },
    });
  }
}

const app = new core.App();

const stack = new FileSystemWithAccessPointStack(app, 'S3FilesAccessPointStack');

const integ = new IntegTest(app, 'S3FilesAccessPointIntegTest', {
  testCases: [stack],
});

// Assert the access point exists with the correct root directory
const describeAp = integ.assertions.awsApiCall('@aws-sdk/client-s3files', 'GetAccessPointCommand', {
  accessPointId: stack.accessPoint.accessPointId,
});

describeAp.expect(ExpectedResult.objectLike({
  rootDirectory: {
    path: '/data',
  },
}));

app.synth();
