import { InstanceClass, InstanceSize, InstanceType, Vpc } from '@aws-cdk/aws-ec2';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import { DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion, StorageType } from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1 });

    new DatabaseInstance(this, 'Instance', {
      engine: DatabaseInstanceEngine.mysql({ version: MysqlEngineVersion.VER_8_0_30 }),
      instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.SMALL),
      vpc,
      allocatedStorage: 1000,
      storageType: StorageType.GP3,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'InstanceGp3Test', {
  testCases: [new TestStack(app, 'cdk-integ-rds-instance-gp3')],
});

app.synth();
