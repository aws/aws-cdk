import {
  AmazonLinuxGeneration,
  AmazonLinuxImage,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  SubnetType,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { LustreDeploymentType, LustreFileSystem, LustreDataCompressionType, StorageType, DriveCacheType } from 'aws-cdk-lib/aws-fsx';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();

const stack = new Stack(app, 'FsxLustreStorageTypeStack');

const vpc = new Vpc(stack, 'Vpc', { restrictDefaultSecurityGroup: false });

const ssdFileSystem = new LustreFileSystem(stack, 'FsxLustreFileSystemSsdStorage', {
  lustreConfiguration: {
    deploymentType: LustreDeploymentType.SCRATCH_2,
    dataCompressionType: LustreDataCompressionType.LZ4,
  },
  storageCapacityGiB: 1200,
  vpc,
  vpcSubnet: vpc.privateSubnets[0],
  removalPolicy: RemovalPolicy.DESTROY,
  storageType: StorageType.SSD,
});

const ssdFsxInstance = new Instance(stack, 'SsdFsxInstance', {
  instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.LARGE),
  machineImage: new AmazonLinuxImage({
    generation: AmazonLinuxGeneration.AMAZON_LINUX_2023,
  }),
  vpc,
  vpcSubnets: {
    subnetType: SubnetType.PUBLIC,
  },
});
ssdFileSystem.connections.allowDefaultPortFrom(ssdFsxInstance);

const hddFileSystem = new LustreFileSystem(stack, 'FsxLustreFileSystemHddStorage', {
  lustreConfiguration: {
    deploymentType: LustreDeploymentType.PERSISTENT_1,
    dataCompressionType: LustreDataCompressionType.LZ4,
    perUnitStorageThroughput: 12,
    driveCacheType: DriveCacheType.READ,
  },
  storageCapacityGiB: 6000,
  vpc,
  vpcSubnet: vpc.privateSubnets[1],
  removalPolicy: RemovalPolicy.DESTROY,
  storageType: StorageType.HDD,
});

const hddFsxInstance = new Instance(stack, 'HddFsxInstance', {
  instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.LARGE),
  machineImage: new AmazonLinuxImage({
    generation: AmazonLinuxGeneration.AMAZON_LINUX_2023,
  }),
  vpc,
  vpcSubnets: {
    subnetType: SubnetType.PUBLIC,
  },
});
hddFileSystem.connections.allowDefaultPortFrom(hddFsxInstance);

new integ.IntegTest(app, 'FsxLustreStorageTypeTest', {
  testCases: [stack],
});
