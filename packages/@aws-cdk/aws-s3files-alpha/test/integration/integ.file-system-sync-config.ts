import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3files from '../../lib';

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
        dataExpiration: core.Duration.days(7),
      },
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

const app = new core.App();

const stack = new FileSystemWithSyncConfigStack(app, 'S3FilesSyncConfigStack');

const integ = new IntegTest(app, 'S3FilesSyncConfigIntegTest', {
  testCases: [stack],
});

// Assert the synchronization configuration was applied
const describeFs = integ.assertions.awsApiCall('@aws-sdk/client-s3files', 'GetFileSystemCommand', {
  fileSystemId: stack.fileSystem.fileSystemId,
});

describeFs.expect(ExpectedResult.objectLike({
  status: 'available',
  synchronizationConfiguration: {
    expirationDataRules: [{ daysAfterLastAccess: 7 }],
  },
}));

app.synth();
