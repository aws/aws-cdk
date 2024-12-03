import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { LustreDeploymentType, LustreFileSystem, LustreDataCompressionType, LustreMaintenanceTime, Weekday } from 'aws-cdk-lib/aws-fsx';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();

const stack = new Stack(app, 'AwsCdkFsxLustreMaintenanceTime');

const vpc = new Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });

const storageCapacity = 1200;
const lustreConfiguration = {
  deploymentType: LustreDeploymentType.SCRATCH_2,
  dataCompressionType: LustreDataCompressionType.LZ4,
  weeklyMaintenanceStartTime: new LustreMaintenanceTime({ day: Weekday.TUESDAY, hour: 23, minute: 59 }),
};
new LustreFileSystem(stack, 'FsxLustreFileSystem', {
  lustreConfiguration,
  storageCapacityGiB: storageCapacity,
  vpc,
  vpcSubnet: vpc.privateSubnets[0],
  removalPolicy: RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'FsxLustreMaintenanceTime', {
  testCases: [stack],
});

app.synth();
