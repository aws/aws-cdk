import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_MYSQL } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();

class DatabaseInstanceStack extends IntegTestBaseStack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { restrictDefaultSecurityGroup: false });

    new rds.DatabaseInstance(this, 'Instance', {
      engine: rds.DatabaseInstanceEngine.mysql({ version: INTEG_TEST_LATEST_MYSQL }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
      credentials: rds.Credentials.fromGeneratedSecret('admin', { excludeCharacters: '!&*^#@()' }),
      vpc,
      databaseName: 'CDKDB',
      storageEncrypted: true,
      backupRetention: cdk.Duration.days(0),
      deleteAutomatedBackups: true,
    });
  }
}

new DatabaseInstanceStack(app, 'aws-cdk-rds-fixed-username');
