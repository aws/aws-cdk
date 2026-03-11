import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { IntegTestBaseStack } from './integ-test-base-stack';
import { INTEG_TEST_LATEST_MYSQL, INTEG_TEST_LATEST_POSTGRES } from './db-versions';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'cdk-rds-read-replica');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
  natGateways: 0,
});

const instanceType = ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL);
const vpcSubnets = { subnetType: ec2.SubnetType.PRIVATE_ISOLATED };

const postgresSource = new rds.DatabaseInstance(stack, 'PostgresSource', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: INTEG_TEST_LATEST_POSTGRES }),
  backupRetention: cdk.Duration.days(5),
  instanceType,
  vpc,
  vpcSubnets,
});

new rds.DatabaseInstanceReadReplica(stack, 'PostgresReplica', {
  sourceDatabaseInstance: postgresSource,
  instanceType,
  vpc,
  vpcSubnets,
});

const mysqlSource = new rds.DatabaseInstance(stack, 'MysqlSource', {
  engine: rds.DatabaseInstanceEngine.mysql({ version: INTEG_TEST_LATEST_MYSQL }),
  backupRetention: cdk.Duration.days(5),
  instanceType,
  vpc,
  vpcSubnets,
});

const parameterGroup = new rds.ParameterGroup(stack, 'ReplicaParameterGroup', {
  engine: rds.DatabaseInstanceEngine.mysql({ version: INTEG_TEST_LATEST_MYSQL }),
  parameters: {
    wait_timeout: '86400',
  },
});

const mysqlReadReplicaInstance = new rds.DatabaseInstanceReadReplica(stack, 'MysqlReplica', {
  sourceDatabaseInstance: mysqlSource,
  backupRetention: cdk.Duration.days(3),
  instanceType,
  vpc,
  vpcSubnets,
  parameterGroup,
});

const role = new iam.Role(stack, 'DBRole', {
  assumedBy: new iam.AccountPrincipal(stack.account),
});

const user = new iam.User(stack, 'DBUser', {
  userName: 'dbuser',
});

mysqlReadReplicaInstance.grantConnect(role, user.userName);

new IntegTest(app, 'read-replica-integ-test', {
  testCases: [stack],
});
