import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as rds from '../lib';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new cdk.Stack(app, 'aws-cdk-rds-integ2', { env });

// const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 1 });

const vpc = ec2.Vpc.fromLookup(stack, 'MyVpc', { isDefault: true });

const subnetGroup = new rds.SubnetGroup(stack, 'SubnetGroup', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  description: 'My Subnet Group',
  subnetGroupName: 'MyNotLowerCaseSubnetGroupName2',
});

// Aurora Serverless v1 cluster for MySQL
new rds.ServerlessCluster(stack, 'aurora-serverlessv1-mysql-cluster', {
  engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  subnetGroup,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  scaling: {
    autoPause: cdk.Duration.minutes(10), // default is to pause after 5 minutes of idle time
    minCapacity: rds.AuroraCapacityUnit.ACU_8, // default is 2 Aurora capacity units (ACUs)
    maxCapacity: rds.AuroraCapacityUnit.ACU_32, // default is 16 Aurora capacity units (ACUs)
  },
});

// Aurora Serverless v2 cluster for MySQL
const cluster = new rds.ServerlessCluster(stack, 'aurora-serverlessv2-mysql-cluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.VER_3_02_1,
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

// adding a serverless writer
new rds.DatabaseInstance(stack, 'instance1', {
  vpc,
  serverlessV2InstanceType: rds.ServerlessV2InstanceType.SERVERLESS,
  clusterIdentifier: cluster.clusterIdentifier,
  engine: rds.DatabaseInstanceEngine.auroraMySql({
    version: rds.MysqlEngineVersion.of(
      '8.0.mysql_aurora.3.02.1',
      '8.0',
    ),
  }),
});

// adding a serverless reader
new rds.DatabaseInstance(stack, 'instance2', {
  vpc,
  serverlessV2InstanceType: rds.ServerlessV2InstanceType.SERVERLESS,
  clusterIdentifier: cluster.clusterIdentifier,
  engine: rds.DatabaseInstanceEngine.auroraMySql({
    version: rds.MysqlEngineVersion.of(
      '8.0.mysql_aurora.3.02.1',
      '8.0',
    ),
  }),
});

// adding a provisioned reader
new rds.DatabaseInstance(stack, 'instance3', {
  vpc,
  serverlessV2InstanceType: rds.ServerlessV2InstanceType.PROVISIONED,
  clusterIdentifier: cluster.clusterIdentifier,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
  engine: rds.DatabaseInstanceEngine.auroraMySql({
    version: rds.MysqlEngineVersion.of(
      '8.0.mysql_aurora.3.02.1',
      '8.0',
    ),
  }),
});

// Aurora Serverless v2 cluster for PostgreSQL
const pgcluster = new rds.ServerlessCluster(stack, 'aurora-serverlessv2-postgres-cluster', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({
    version: rds.AuroraPostgresEngineVersion.VER_14_4,
  }),
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

// adding a serverless writer
new rds.DatabaseInstance(stack, 'pginstance1', {
  vpc,
  serverlessV2InstanceType: rds.ServerlessV2InstanceType.SERVERLESS,
  clusterIdentifier: pgcluster.clusterIdentifier,
  engine: rds.DatabaseInstanceEngine.auroraPostgres({
    version: rds.PostgresEngineVersion.VER_14_4,
  }),
});

// adding a serverless reader
new rds.DatabaseInstance(stack, 'pginstance2', {
  vpc,
  serverlessV2InstanceType: rds.ServerlessV2InstanceType.SERVERLESS,
  clusterIdentifier: pgcluster.clusterIdentifier,
  engine: rds.DatabaseInstanceEngine.auroraPostgres({
    version: rds.PostgresEngineVersion.VER_14_4,
  }),
});

// adding a provisioned reader
new rds.DatabaseInstance(stack, 'pginstance3', {
  vpc,
  serverlessV2InstanceType: rds.ServerlessV2InstanceType.PROVISIONED,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
  clusterIdentifier: pgcluster.clusterIdentifier,
  engine: rds.DatabaseInstanceEngine.auroraPostgres({
    version: rds.PostgresEngineVersion.VER_14_4,
  }),
});

app.synth();
