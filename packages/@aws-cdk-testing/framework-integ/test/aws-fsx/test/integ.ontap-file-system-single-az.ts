import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, CfnOutput, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import {
  MaintenanceTime,
  OntapDeploymentType,
  OntapFileSystem,
  OntapStorageVirtualMachine,
  OntapVolume,
  ThroughputCapacityPerHaPair,
  TieringPolicyName,
  Weekday,
} from 'aws-cdk-lib/aws-fsx';

/*
 * Integration test for FSx for NetApp ONTAP, Single-AZ deployments.
 *
 * Covers both generations of single-AZ file systems in separate stacks:
 * - SINGLE_AZ_1 (Gen1) with a basic volume and SNAPSHOT_ONLY tiering policy.
 * - SINGLE_AZ_2 (Gen2) with multiple HA pairs and ALL tiering policy.
 *
 * Each stack adds an awsApiCall assertion that validates the file system was
 * created with the expected deployment type and throughput capacity.
 */
const app = new App();

// ---------------------------------------------------------------------------
// Stack 1: SINGLE_AZ_1 (Gen1)
// ---------------------------------------------------------------------------
const gen1Stack = new Stack(app, 'AwsCdkFsxOntapSingleAz1');

const gen1Vpc = new Vpc(gen1Stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 1,
});

const gen1FileSystem = new OntapFileSystem(gen1Stack, 'OntapFileSystem', {
  vpc: gen1Vpc,
  vpcSubnets: [gen1Vpc.privateSubnets[0]],
  storageCapacityGiB: 1024,
  removalPolicy: RemovalPolicy.DESTROY,
  ontapConfiguration: {
    deploymentType: OntapDeploymentType.SINGLE_AZ_1,
    throughputCapacityPerHaPair: ThroughputCapacityPerHaPair.MB_PER_SEC_128,
    automaticBackupRetention: Duration.days(7),
    weeklyMaintenanceStartTime: new MaintenanceTime({ day: Weekday.MONDAY, hour: 1, minute: 0 }),
  },
});

const gen1Svm = new OntapStorageVirtualMachine(gen1Stack, 'Svm', {
  fileSystem: gen1FileSystem,
  name: 'gen1_svm',
  removalPolicy: RemovalPolicy.DESTROY,
});

new OntapVolume(gen1Stack, 'Volume', {
  storageVirtualMachine: gen1Svm,
  name: 'gen1_volume',
  sizeInBytes: 107374182400, // 100 GiB
  junctionPath: '/data',
  storageEfficiencyEnabled: true,
  tieringPolicy: {
    name: TieringPolicyName.SNAPSHOT_ONLY,
  },
  removalPolicy: RemovalPolicy.DESTROY,
});

new CfnOutput(gen1Stack, 'Gen1FileSystemId', { value: gen1FileSystem.fileSystemId });

// ---------------------------------------------------------------------------
// Stack 2: SINGLE_AZ_2 (Gen2 with multiple HA pairs)
// ---------------------------------------------------------------------------
const gen2Stack = new Stack(app, 'AwsCdkFsxOntapSingleAz2');

const gen2Vpc = new Vpc(gen2Stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 1,
});

const gen2FileSystem = new OntapFileSystem(gen2Stack, 'OntapFileSystem', {
  vpc: gen2Vpc,
  vpcSubnets: [gen2Vpc.privateSubnets[0]],
  storageCapacityGiB: 4096, // 2048 per HA pair * 2 HA pairs
  removalPolicy: RemovalPolicy.DESTROY,
  ontapConfiguration: {
    deploymentType: OntapDeploymentType.SINGLE_AZ_2,
    throughputCapacityPerHaPair: ThroughputCapacityPerHaPair.MB_PER_SEC_1536,
    haPairs: 2,
    automaticBackupRetention: Duration.days(0), // disable automatic backups
  },
});

const gen2Svm = new OntapStorageVirtualMachine(gen2Stack, 'Svm', {
  fileSystem: gen2FileSystem,
  name: 'gen2_svm',
  removalPolicy: RemovalPolicy.DESTROY,
});

new OntapVolume(gen2Stack, 'Volume', {
  storageVirtualMachine: gen2Svm,
  name: 'gen2_volume',
  // SINGLE_AZ_2 with haPairs > 1 spreads volume data across HA pairs as an
  // implicit multi-constituent FlexGroup. FSx defaults to 8 constituents per
  // HA pair and enforces a per-constituent minimum of 100 GiB, so the floor
  // for haPairs=2 is 8 * 2 * 100 = 1600 GiB. Empirically verified via the
  // CreateVolume API in eu-west-1: 1500 GiB is rejected, 1600 GiB is accepted.
  sizeInBytes: 1717986918400, // 1600 GiB
  junctionPath: '/data',
  storageEfficiencyEnabled: true,
  tieringPolicy: {
    name: TieringPolicyName.ALL,
  },
  removalPolicy: RemovalPolicy.DESTROY,
});

new CfnOutput(gen2Stack, 'Gen2FileSystemId', { value: gen2FileSystem.fileSystemId });

// ---------------------------------------------------------------------------
// Integration test cases and assertions
// ---------------------------------------------------------------------------
const integ = new IntegTest(app, 'FsxOntapSingleAzIntegTest', {
  testCases: [gen1Stack, gen2Stack],
});

integ.assertions
  .awsApiCall('FSx', 'describeFileSystems', {
    FileSystemIds: [gen1FileSystem.fileSystemId],
  })
  .expect(ExpectedResult.objectLike({
    FileSystems: [{
      FileSystemId: gen1FileSystem.fileSystemId,
      FileSystemType: 'ONTAP',
      Lifecycle: 'AVAILABLE',
      OntapConfiguration: {
        DeploymentType: 'SINGLE_AZ_1',
        ThroughputCapacityPerHAPair: 128,
      },
    }],
  }))
  .waitForAssertions({
    totalTimeout: Duration.minutes(60),
    interval: Duration.seconds(30),
  });

integ.assertions
  .awsApiCall('FSx', 'describeFileSystems', {
    FileSystemIds: [gen2FileSystem.fileSystemId],
  })
  .expect(ExpectedResult.objectLike({
    FileSystems: [{
      FileSystemId: gen2FileSystem.fileSystemId,
      FileSystemType: 'ONTAP',
      Lifecycle: 'AVAILABLE',
      OntapConfiguration: {
        DeploymentType: 'SINGLE_AZ_2',
        ThroughputCapacityPerHAPair: 1536,
        HAPairs: 2,
      },
    }],
  }))
  .waitForAssertions({
    totalTimeout: Duration.minutes(60),
    interval: Duration.seconds(30),
  });
