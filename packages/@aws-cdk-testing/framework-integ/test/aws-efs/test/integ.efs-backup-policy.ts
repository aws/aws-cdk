import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({ context: { '@aws-cdk/aws-efs:explicitBackupPolicy': true } });
const stack = new cdk.Stack(app, 'EfsBackupPolicy');
const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 1,
  natGateways: 0,
  restrictDefaultSecurityGroup: false,
  subnetConfiguration: [{ name: 'Isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED }],
});
const filesystems = [
  { id: 'Enabled', enabled: true, status: 'ENABLED' },
  { id: 'Disabled', enabled: false, status: 'DISABLED' },
  { id: 'Default', enabled: undefined, status: 'DISABLED' },
].map(({ id, enabled, status }) => ({
  status,
  fileSystem: new efs.FileSystem(stack, id, {
    vpc,
    enableAutomaticBackups: enabled,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  }),
}));

const test = new integ.IntegTest(app, 'BackupPolicyTest', { testCases: [stack] });
for (const { fileSystem, status } of filesystems) {
  test.assertions.awsApiCall('EFS', 'describeBackupPolicy', {
    FileSystemId: fileSystem.fileSystemId,
  }).expect(integ.ExpectedResult.objectLike({
    BackupPolicy: { Status: status },
  })).waitForAssertions({ totalTimeout: cdk.Duration.minutes(5) });
}
