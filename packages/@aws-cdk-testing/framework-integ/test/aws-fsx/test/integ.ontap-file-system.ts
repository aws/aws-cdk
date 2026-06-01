import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import {
  OntapDeploymentType,
  OntapFileSystem,
  OntapStorageVirtualMachine,
  OntapVolume,
  MultiAz2ThroughputCapacity,
  TieringPolicyName,
} from 'aws-cdk-lib/aws-fsx';

const app = new App();

const stack = new Stack(app, 'AwsCdkFsxOntap');

const vpc = new Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

// File System
const fileSystem = new OntapFileSystem(stack, 'OntapFileSystem', {
  vpc,
  vpcSubnets: [vpc.privateSubnets[0], vpc.privateSubnets[1]],
  storageCapacityGiB: 1024,
  removalPolicy: RemovalPolicy.DESTROY,
  ontapConfiguration: {
    deploymentType: OntapDeploymentType.MULTI_AZ_2,
    throughputCapacityPerHaPair: MultiAz2ThroughputCapacity.MB_PER_SEC_384,
    preferredSubnet: vpc.privateSubnets[0],
    automaticBackupRetention: Duration.days(7),
  },
});

// Storage Virtual Machine
const svm = new OntapStorageVirtualMachine(stack, 'Svm', {
  fileSystem,
  name: 'test-svm',
});

// Volume
new OntapVolume(stack, 'Volume', {
  storageVirtualMachine: svm,
  name: 'test-volume',
  sizeInBytes: 107374182400, // 100 GB
  junctionPath: '/data',
  storageEfficiencyEnabled: true,
  tieringPolicy: {
    name: TieringPolicyName.AUTO,
    coolingPeriod: Duration.days(31),
  },
});

new IntegTest(app, 'FsxOntapIntegTest', {
  testCases: [stack],
});
