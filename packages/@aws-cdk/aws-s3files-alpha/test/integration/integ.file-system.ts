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

class FileSystemWithSyncConfigStack extends core.Stack {
  public readonly fileSystem: s3files.FileSystem;

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
      synchronizationConfiguration: {
        importDataRules: [
          {
            prefix: '',
            sizeLessThan: core.Size.gibibytes(1),
            trigger: s3files.ImportDataRuleTrigger.ON_FILE_ACCESS,
          },
        ],
        daysAfterLastAccess: core.Duration.days(7),
      },
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

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

const basicStack = new BasicFileSystemStack(app, 'S3FilesBasicStack');
const syncConfigStack = new FileSystemWithSyncConfigStack(app, 'S3FilesSyncConfigStack');
const accessPointStack = new FileSystemWithAccessPointStack(app, 'S3FilesAccessPointStack');

const integ = new IntegTest(app, 'S3FilesIntegTest', {
  testCases: [basicStack, syncConfigStack, accessPointStack],
});

// Assert the basic file system exists and is available
const describeFs = integ.assertions.awsApiCall('@aws-sdk/client-s3files', 'GetFileSystemCommand', {
  fileSystemId: basicStack.fileSystem.fileSystemId,
});

describeFs.expect(ExpectedResult.objectLike({
  status: 'available',
}));

// Assert the access point exists with the correct root directory
const describeAp = integ.assertions.awsApiCall('@aws-sdk/client-s3files', 'GetAccessPointCommand', {
  accessPointId: accessPointStack.accessPoint.accessPointId,
});

describeAp.expect(ExpectedResult.objectLike({
  rootDirectory: {
    path: '/data',
  },
}));

app.synth();
