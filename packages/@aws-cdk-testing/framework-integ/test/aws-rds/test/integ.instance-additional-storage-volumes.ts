import { InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, RemovalPolicies, RemovalPolicy, Size, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import {
  AdditionalStorageVolumeType,
  DatabaseInstance,
  DatabaseInstanceEngine,
  LicenseModel,
  OracleEngineVersion,
  StorageType,
} from 'aws-cdk-lib/aws-rds';

const app = new App();
const stack = new Stack(app, 'integ-rds-instance-additional-storage-volumes');

const vpc = new Vpc(stack, 'Vpc', { natGateways: 0 });

// Additional storage volumes require instance types with at least 64 GiB memory
// r5.2xlarge has 64 GiB memory
new DatabaseInstance(stack, 'Instance', {
  engine: DatabaseInstanceEngine.oracleSe2({ version: OracleEngineVersion.VER_19 }),
  licenseModel: LicenseModel.LICENSE_INCLUDED,
  instanceType: InstanceType.of(InstanceClass.R5, InstanceSize.XLARGE2),
  vpc,
  vpcSubnets: {
    subnetType: SubnetType.PRIVATE_ISOLATED,
  },
  allocatedStorage: 200,
  storageType: StorageType.GP3,
  additionalStorageVolumes: [
    {
      allocatedStorage: Size.gibibytes(200),
      storageType: AdditionalStorageVolumeType.GP3,
      iops: 12000,
      storageThroughput: Size.mebibytes(500),
    },
  ],
});

RemovalPolicies.of(stack).apply(RemovalPolicy.DESTROY);

new integ.IntegTest(app, 'InstanceAdditionalStorageVolumesTest', {
  testCases: [stack],
});

app.synth();
