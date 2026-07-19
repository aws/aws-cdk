import { InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_MYSQL } from './db-versions';
import { App } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { DatabaseInstance, DatabaseInstanceEngine, StorageType } from 'aws-cdk-lib/aws-rds';
import { IntegTestBaseStack } from './integ-test-base-stack';

const app = new App();
const stack = new IntegTestBaseStack(app, 'integRdsInstanceIo2');

const vpc = new Vpc(stack, 'Vpc', { natGateways: 0 });

new DatabaseInstance(stack, 'Instance', {
  engine: DatabaseInstanceEngine.mysql({ version: INTEG_TEST_LATEST_MYSQL }),
  instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.SMALL),
  vpc,
  vpcSubnets: {
    subnetType: SubnetType.PRIVATE_ISOLATED,
  },
  allocatedStorage: 1000,
  storageType: StorageType.IO2,
});

new integ.IntegTest(app, 'InstanceIo2Test', {
  testCases: [stack],
});

