import { InstanceClass, InstanceSize, InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_MYSQL } from './db-versions';
import { App } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import { DatabaseInstance, DatabaseInstanceEngine, StorageType } from 'aws-cdk-lib/aws-rds';
import { IntegTestBaseStack } from './integ-test-base-stack';

class TestStack extends IntegTestBaseStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

    new DatabaseInstance(this, 'Instance', {
      engine: DatabaseInstanceEngine.mysql({ version: INTEG_TEST_LATEST_MYSQL }),
      instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.SMALL),
      vpc,
      allocatedStorage: 1000,
      storageType: StorageType.GP3,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'InstanceGp3Test', {
  testCases: [new TestStack(app, 'cdk-integ-rds-instance-gp3')],
});

