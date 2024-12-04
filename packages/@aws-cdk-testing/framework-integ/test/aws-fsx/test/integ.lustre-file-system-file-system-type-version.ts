import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { LustreDeploymentType, LustreFileSystem, LustreDataCompressionType, FileSystemTypeVersion } from 'aws-cdk-lib/aws-fsx';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();

const stack = new Stack(app, 'FsxLustreFileSystemTypeVersionStack');

const vpc = new Vpc(stack, 'Vpc');

const storageCapacity = 1200;
const lustreConfiguration = {
  deploymentType: LustreDeploymentType.SCRATCH_2,
  dataCompressionType: LustreDataCompressionType.LZ4,
};
new LustreFileSystem(stack, 'FsxLustreFileSystem', {
  lustreConfiguration,
  storageCapacityGiB: storageCapacity,
  vpc,
  vpcSubnet: vpc.privateSubnets[0],
  removalPolicy: RemovalPolicy.DESTROY,
  fileSystemTypeVersion: FileSystemTypeVersion.V_2_15,
});

new integ.IntegTest(app, 'FsxLustreFileSystemTypeVersionTest', {
  testCases: [stack],
});
