import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as fsx from 'aws-cdk-lib/aws-fsx';

const app = new App();

const stack = new Stack(app, 'FsxForOntapTestStack');

const vpc = new ec2.Vpc(stack, 'Vpc');

new fsx.OntapFileSystem(stack, 'OntapMultiAzFileSystem', {
  vpc,
  vpcSubnets: vpc.privateSubnets,
  storageCapacityGiB: 5120,
  ontapConfiguration: {
    automaticBackupRetention: Duration.days(7),
    dailyAutomaticBackupStartTime: new fsx.DailyAutomaticBackupStartTime({
      hour: 1,
      minute: 0,
    }),
    deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
    diskIops: 15360,
    endpointIpAddressRange: '192.168.39.0/24',
    fsxAdminPassword: 'fsxPassword1',
    haPairs: 1,
    preferredSubnet: vpc.privateSubnets[0],
    routeTables: [vpc.privateSubnets[0].routeTable, vpc.privateSubnets[1].routeTable],
    throughputCapacity: 384,
    weeklyMaintenanceStartTime: new fsx.MaintenanceTime({
      day: fsx.Weekday.SUNDAY,
      hour: 1,
      minute: 0,
    }),
  },
  removalPolicy: RemovalPolicy.DESTROY,
});

new fsx.OntapFileSystem(stack, 'OntapSingleAzFileSystem', {
  vpc,
  vpcSubnets: [vpc.privateSubnets[0]],
  storageCapacityGiB: 5120,
  ontapConfiguration: {
    automaticBackupRetention: Duration.days(7),
    dailyAutomaticBackupStartTime: new fsx.DailyAutomaticBackupStartTime({
      hour: 1,
      minute: 0,
    }),
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
    diskIops: 76800,
    fsxAdminPassword: 'fsxPassword1',
    haPairs: 5,
    throughputCapacityPerHaPair: 1536,
    weeklyMaintenanceStartTime: new fsx.MaintenanceTime({
      day: fsx.Weekday.SUNDAY,
      hour: 1,
      minute: 0,
    }),
  },
  removalPolicy: RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'FsxForOntapTest', {
  testCases: [stack],
});
