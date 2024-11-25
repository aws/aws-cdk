import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { LustreDeploymentType, LustreFileSystem, DailyAutomaticBackupStartTime } from 'aws-cdk-lib/aws-fsx';

const app = new App();

const stack = new Stack(app, 'AwsCdkFsxLustreAutomaticBackup');

const vpc = new Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });

const storageCapacity = 1200;
const lustreConfiguration = {
  deploymentType: LustreDeploymentType.PERSISTENT_1,
  perUnitStorageThroughput: 100,
  automaticBackupRetention: Duration.days(3),
  copyTagsToBackups: true,
  dailyAutomaticBackupStartTime: new DailyAutomaticBackupStartTime({ hour: 11, minute: 30 }),
};

new LustreFileSystem(stack, 'FsxLustreFileSystem', {
  lustreConfiguration,
  storageCapacityGiB: storageCapacity,
  vpc,
  vpcSubnet: vpc.privateSubnets[0],
  removalPolicy: RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'FsxLustreAutomaticBackup', {
  testCases: [stack],
});
