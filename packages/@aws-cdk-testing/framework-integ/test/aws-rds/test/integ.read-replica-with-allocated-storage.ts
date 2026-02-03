import { InstanceClass, InstanceSize, InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, Duration, Stack } from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();

const stack = new Stack(app, 'aws-cdk-rds-read-replica-with-allocated-storage');

const vpc = new Vpc(stack, 'Vpc');

const mysqlSource = new rds.DatabaseInstance(stack, 'MysqlSource', {
  engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0 }),
  backupRetention: Duration.days(5),
  instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL),
  vpc,
});

new rds.DatabaseInstanceReadReplica(stack, 'MysqlReplica', {
  sourceDatabaseInstance: mysqlSource,
  backupRetention: Duration.days(3),
  instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL),
  vpc,
  allocatedStorage: 500,
});

new integ.IntegTest(app, 'aws-cdk-rds-read-replica-with-allocated-storage-test', {
  testCases: [stack],
});

app.synth();
