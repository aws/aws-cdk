import { InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion, StorageType } from 'aws-cdk-lib/aws-rds';

const app = new App();
const stack = new Stack(app, 'integRdsInstanceIo2');

const vpc = new Vpc(stack, 'Vpc', { natGateways: 0 });

new DatabaseInstance(stack, 'Instance', {
  engine: DatabaseInstanceEngine.mysql({ version: MysqlEngineVersion.VER_8_0_35 }),
  instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.SMALL),
  vpc,
  vpcSubnets: {
    subnetType: SubnetType.PRIVATE_ISOLATED,
  },
  allocatedStorage: 1000,
  storageType: StorageType.IO2,
  removalPolicy: RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'InstanceIo2Test', {
  testCases: [stack],
});

app.synth();
