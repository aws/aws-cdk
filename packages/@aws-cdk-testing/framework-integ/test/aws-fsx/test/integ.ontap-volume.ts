import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, CfnOutput, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import {
  OntapDeploymentType,
  OntapFileSystem,
  OntapStorageVirtualMachine,
  OntapVolume,
  OntapVolumeType,
  TieringPolicyName,
} from 'aws-cdk-lib/aws-fsx';

/*
 * Integration test for FSx for NetApp ONTAP volume features.
 *
 * Covers OntapVolume features that are not exercised by the other integ tests:
 * - Multiple volumes on the same SVM
 * - Custom snapshotPolicy
 * - SNAPSHOT_ONLY tiering with explicit cooling period
 * - Volume with no junction path (volume-only, no NAS export)
 * - Post-deployment assertions on each volume via awsApiCall.
 */
const app = new App();

const stack = new Stack(app, 'AwsCdkFsxOntapVolume');

const vpc = new Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

// Single-AZ Gen1 file system (cheapest deployment for fast iteration on
// volume-level tests).
const fileSystem = new OntapFileSystem(stack, 'OntapFileSystem', {
  vpc,
  vpcSubnets: [vpc.privateSubnets[0]],
  storageCapacityGiB: 1024,
  removalPolicy: RemovalPolicy.DESTROY,
  ontapConfiguration: {
    deploymentType: OntapDeploymentType.SINGLE_AZ_1,
  },
});

const svm = new OntapStorageVirtualMachine(stack, 'Svm', {
  fileSystem,
  name: 'volume_svm',
  removalPolicy: RemovalPolicy.DESTROY,
});

// Volume 1: minimal volume (NAS-mounted at /vol1) with SNAPSHOT_ONLY tiering and
// an explicit cooling period.
const vol1 = new OntapVolume(stack, 'Volume1', {
  storageVirtualMachine: svm,
  name: 'vol_1',
  sizeInBytes: 53687091200, // 50 GiB
  junctionPath: '/vol1',
  storageEfficiencyEnabled: true,
  tieringPolicy: {
    name: TieringPolicyName.SNAPSHOT_ONLY,
    coolingPeriod: Duration.days(2),
  },
  removalPolicy: RemovalPolicy.DESTROY,
});

// Volume 2: second volume on the same SVM with a different snapshot policy and
// no junction path (data-only, not NAS-exported).
const vol2 = new OntapVolume(stack, 'Volume2', {
  storageVirtualMachine: svm,
  name: 'vol_2',
  sizeInBytes: 53687091200, // 50 GiB
  snapshotPolicy: 'default-1weekly',
  storageEfficiencyEnabled: false,
  copyTagsToBackups: true,
  removalPolicy: RemovalPolicy.DESTROY,
});

// Volume 3: data-protection (DP) volume. DP volumes do not accept
// `storageEfficiencyEnabled` and are typically used as SnapMirror destinations.
const vol3 = new OntapVolume(stack, 'Volume3', {
  storageVirtualMachine: svm,
  name: 'vol_3_dp',
  sizeInBytes: 53687091200, // 50 GiB
  ontapVolumeType: OntapVolumeType.DP,
  removalPolicy: RemovalPolicy.DESTROY,
});

new CfnOutput(stack, 'FileSystemId', { value: fileSystem.fileSystemId });
new CfnOutput(stack, 'SvmId', { value: svm.storageVirtualMachineId });
new CfnOutput(stack, 'Volume1Id', { value: vol1.volumeId });
new CfnOutput(stack, 'Volume2Id', { value: vol2.volumeId });
new CfnOutput(stack, 'Volume3Id', { value: vol3.volumeId });

const integ = new IntegTest(app, 'FsxOntapVolumeIntegTest', {
  testCases: [stack],
});

// Post-deployment assertion: file system is up.
integ.assertions
  .awsApiCall('FSx', 'describeFileSystems', {
    FileSystemIds: [fileSystem.fileSystemId],
  })
  .expect(ExpectedResult.objectLike({
    FileSystems: [{
      FileSystemId: fileSystem.fileSystemId,
      Lifecycle: 'AVAILABLE',
      OntapConfiguration: {
        DeploymentType: 'SINGLE_AZ_1',
      },
    }],
  }))
  .waitForAssertions({
    totalTimeout: Duration.minutes(60),
    interval: Duration.seconds(30),
  });

// Post-deployment assertion: each volume reports its expected configuration.
integ.assertions
  .awsApiCall('FSx', 'describeVolumes', {
    VolumeIds: [vol1.volumeId],
  })
  .expect(ExpectedResult.objectLike({
    Volumes: [{
      VolumeId: vol1.volumeId,
      Name: 'vol_1',
      OntapConfiguration: {
        JunctionPath: '/vol1',
        OntapVolumeType: 'RW',
        TieringPolicy: {
          Name: 'SNAPSHOT_ONLY',
          CoolingPeriod: 2,
        },
      },
    }],
  }))
  .waitForAssertions({
    totalTimeout: Duration.minutes(30),
    interval: Duration.seconds(30),
  });

integ.assertions
  .awsApiCall('FSx', 'describeVolumes', {
    VolumeIds: [vol2.volumeId],
  })
  .expect(ExpectedResult.objectLike({
    Volumes: [{
      VolumeId: vol2.volumeId,
      Name: 'vol_2',
      OntapConfiguration: {
        SnapshotPolicy: 'default-1weekly',
        OntapVolumeType: 'RW',
      },
    }],
  }))
  .waitForAssertions({
    totalTimeout: Duration.minutes(30),
    interval: Duration.seconds(30),
  });

integ.assertions
  .awsApiCall('FSx', 'describeVolumes', {
    VolumeIds: [vol3.volumeId],
  })
  .expect(ExpectedResult.objectLike({
    Volumes: [{
      VolumeId: vol3.volumeId,
      Name: 'vol_3_dp',
      OntapConfiguration: {
        OntapVolumeType: 'DP',
      },
    }],
  }))
  .waitForAssertions({
    totalTimeout: Duration.minutes(30),
    interval: Duration.seconds(30),
  });
