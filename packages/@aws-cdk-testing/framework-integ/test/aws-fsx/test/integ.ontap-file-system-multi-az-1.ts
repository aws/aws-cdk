import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, CfnOutput, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import {
  DailyAutomaticBackupStartTime,
  OntapDeploymentType,
  OntapFileSystem,
  OntapStorageVirtualMachine,
  OntapVolume,
  ThroughputCapacityPerHaPair,
  TieringPolicyName,
} from 'aws-cdk-lib/aws-fsx';

/*
 * Integration test for FSx for NetApp ONTAP, MULTI_AZ_1 (Gen1) deployment.
 *
 * Covers:
 * - First-generation Multi-AZ deployment with a preferred subnet
 * - Daily automatic backup window
 * - SVM with custom security style
 * - Volume with NONE tiering policy and copyTagsToBackups enabled
 * - Post-deployment assertion validating the file system configuration
 */
const app = new App();

const stack = new Stack(app, 'AwsCdkFsxOntapMultiAz1');

const vpc = new Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

const fileSystem = new OntapFileSystem(stack, 'OntapFileSystem', {
  vpc,
  vpcSubnets: [vpc.privateSubnets[0], vpc.privateSubnets[1]],
  storageCapacityGiB: 1024,
  removalPolicy: RemovalPolicy.DESTROY,
  ontapConfiguration: {
    deploymentType: OntapDeploymentType.MULTI_AZ_1,
    throughputCapacityPerHaPair: ThroughputCapacityPerHaPair.MB_PER_SEC_128,
    preferredSubnet: vpc.privateSubnets[0],
    automaticBackupRetention: Duration.days(3),
    dailyAutomaticBackupStartTime: new DailyAutomaticBackupStartTime({ hour: 1, minute: 30 }),
  },
});

const svm = new OntapStorageVirtualMachine(stack, 'Svm', {
  fileSystem,
  name: 'maz1_svm',
  removalPolicy: RemovalPolicy.DESTROY,
});

new OntapVolume(stack, 'Volume', {
  storageVirtualMachine: svm,
  name: 'maz1_volume',
  sizeInBytes: 107374182400, // 100 GiB
  junctionPath: '/data',
  storageEfficiencyEnabled: true,
  copyTagsToBackups: true,
  tieringPolicy: {
    name: TieringPolicyName.NONE,
  },
  removalPolicy: RemovalPolicy.DESTROY,
});

new CfnOutput(stack, 'FileSystemId', { value: fileSystem.fileSystemId });

const integ = new IntegTest(app, 'FsxOntapMultiAz1IntegTest', {
  testCases: [stack],
});

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
        DeploymentType: 'MULTI_AZ_1',
        ThroughputCapacityPerHAPair: 128,
        AutomaticBackupRetentionDays: 3,
        DailyAutomaticBackupStartTime: '01:30',
      },
    }],
  }))
  .waitForAssertions({
    totalTimeout: Duration.minutes(60),
    interval: Duration.seconds(30),
  });
