import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as rds from '../lib';
import { DatabaseInstanceEngine } from '../lib';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new cdk.Stack(app, 'aws-cdk-rds-integ', { env });

// const vpc = new ec2.Vpc(stack, 'VPC', {
//   maxAzs: 2,
//   natGateways: 1,
// });
const vpc = ec2.Vpc.fromLookup(stack, 'MyVpc', { isDefault: true });

const subnetGroup = new rds.SubnetGroup(stack, 'SubnetGroup', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  description: 'My Subnet Group',
  subnetGroupName: 'MyNotLowerCaseSubnetGroupName2',
});

// Aurora Serverless v2 cluster for MySQL
const cluster = new rds.ServerlessCluster(stack, 'Serverless V2 Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.of(
      '8.0.mysql_aurora.3.02.0',
    ),
  }),
  credentials: {
    username: 'admin',
    password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
  },
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  subnetGroup,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  scalingV2: {
    maxCapacity: 4,
    minCapacity: 2,
  },
  parameterGroup: rds.ParameterGroup.fromParameterGroupName(stack, 'PG', 'default.aurora-mysql8.0'),
});

// adding a writer
new rds.DatabaseInstance(stack, 'instance1', {
  vpc,
  serverless: true,
  clusterIdentifier: cluster.clusterIdentifier,
  engine: DatabaseInstanceEngine.auroraMySql({
    version: rds.MysqlEngineVersion.of(
      '8.0.mysql_aurora.3.02.0',
      '8.0',
    ),
  }),
});

// adding a reader
new rds.DatabaseInstance(stack, 'instance2', {
  vpc,
  serverless: true,
  clusterIdentifier: cluster.clusterIdentifier,
  engine: DatabaseInstanceEngine.auroraMySql({
    version: rds.MysqlEngineVersion.of(
      '8.0.mysql_aurora.3.02.0',
      '8.0',
    ),
  }),
});

// Aurora Serverless v2 cluster for PostgreSQL
const pgcluster = new rds.ServerlessCluster(stack, 'Serverless V2 Database PostgreSQL', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({
    version: rds.AuroraPostgresEngineVersion.VER_14_4,
  }),
  credentials: {
    username: 'myadmin',
    password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
  },
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  subnetGroup,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  scalingV2: {
    maxCapacity: 4,
    minCapacity: 2,
  },
  parameterGroup: rds.ParameterGroup.fromParameterGroupName(stack, 'pg-aurora-postgresql14', 'default.aurora-postgresql14'),
});

// adding a writer
new rds.DatabaseInstance(stack, 'pginstance1', {
  vpc,
  serverless: true,
  clusterIdentifier: pgcluster.clusterIdentifier,
  engine: DatabaseInstanceEngine.auroraPostgres({
    version: rds.PostgresEngineVersion.VER_14_4,
  }),
});

// adding a reader
new rds.DatabaseInstance(stack, 'pginstance2', {
  vpc,
  serverless: true,
  clusterIdentifier: pgcluster.clusterIdentifier,
  engine: DatabaseInstanceEngine.auroraPostgres({
    version: rds.PostgresEngineVersion.VER_14_4,
  }),
});

app.synth();
