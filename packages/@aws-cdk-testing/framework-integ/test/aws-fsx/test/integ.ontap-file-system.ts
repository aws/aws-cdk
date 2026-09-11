import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, CfnOutput, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import {
  OntapDeploymentType,
  OntapFileSystem,
  OntapStorageVirtualMachine,
  OntapVolume,
  ThroughputCapacityPerHaPair,
  TieringPolicyName,
} from 'aws-cdk-lib/aws-fsx';

/*
 * Integration test for FSx for NetApp ONTAP, Multi-AZ Gen2 deployment.
 *
 * Covers:
 * - MULTI_AZ_2 deployment type with Gen2 throughput
 * - Storage Virtual Machine
 * - Volume with AUTO tiering policy
 * - Post-deployment assertions via awsApiCall
 */
const app = new App();

const stack = new Stack(app, 'AwsCdkFsxOntap');

const vpc = new Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

// File System: Multi-AZ 2 (Gen2)
const fileSystem = new OntapFileSystem(stack, 'OntapFileSystem', {
  vpc,
  vpcSubnets: [vpc.privateSubnets[0], vpc.privateSubnets[1]],
  storageCapacityGiB: 1024,
  removalPolicy: RemovalPolicy.DESTROY,
  ontapConfiguration: {
    deploymentType: OntapDeploymentType.MULTI_AZ_2,
    throughputCapacityPerHaPair: ThroughputCapacityPerHaPair.MB_PER_SEC_384,
    preferredSubnet: vpc.privateSubnets[0],
    automaticBackupRetention: Duration.days(7),
  },
});

// Storage Virtual Machine
const svm = new OntapStorageVirtualMachine(stack, 'Svm', {
  fileSystem,
  name: 'test_svm',
  removalPolicy: RemovalPolicy.DESTROY,
});

// Volume with AUTO tiering
new OntapVolume(stack, 'Volume', {
  storageVirtualMachine: svm,
  name: 'test_volume',
  sizeInBytes: 107374182400, // 100 GB
  junctionPath: '/data',
  storageEfficiencyEnabled: true,
  tieringPolicy: {
    name: TieringPolicyName.AUTO,
    coolingPeriod: Duration.days(31),
  },
  removalPolicy: RemovalPolicy.DESTROY,
});

new CfnOutput(stack, 'FileSystemId', { value: fileSystem.fileSystemId });
new CfnOutput(stack, 'SvmId', { value: svm.storageVirtualMachineId });

const integ = new IntegTest(app, 'FsxOntapIntegTest', {
  testCases: [stack],
});

// Post-deployment assertion: validate the file system was created with expected configuration.
integ.assertions
  .awsApiCall('FSx', 'describeFileSystems', {
    FileSystemIds: [fileSystem.fileSystemId],
  })
  .expect(ExpectedResult.objectLike({
    FileSystems: [{
      FileSystemId: fileSystem.fileSystemId,
      FileSystemType: 'ONTAP',
      Lifecycle: 'AVAILABLE',
      OntapConfiguration: {
        DeploymentType: 'MULTI_AZ_2',
        ThroughputCapacityPerHAPair: 384,
      },
    }],
  }))
  .waitForAssertions({
    totalTimeout: Duration.minutes(60),
    interval: Duration.seconds(30),
  });

// Post-deployment assertion: validate the SVM was created.
integ.assertions
  .awsApiCall('FSx', 'describeStorageVirtualMachines', {
    StorageVirtualMachineIds: [svm.storageVirtualMachineId],
  })
  .expect(ExpectedResult.objectLike({
    StorageVirtualMachines: [{
      StorageVirtualMachineId: svm.storageVirtualMachineId,
      Name: 'test_svm',
    }],
  }))
  .waitForAssertions({
    totalTimeout: Duration.minutes(30),
    interval: Duration.seconds(30),
  });
