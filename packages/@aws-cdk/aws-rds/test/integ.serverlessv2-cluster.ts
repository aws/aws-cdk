import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as rds from '../lib';

const app = new cdk.App();

// const env = {
//   region: process.env.CDK_DEFAULT_REGION,
//   account: process.env.CDK_DEFAULT_ACCOUNT,
// };

const stack = new cdk.Stack(app, 'aws-cdk-rds-integ2');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 1 });

// const vpc = ec2.Vpc.fromLookup(stack, 'MyVpc', { isDefault: true });

const subnetGroup = new rds.SubnetGroup(stack, 'SubnetGroup', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  description: 'My Subnet Group',
  subnetGroupName: 'MyNotLowerCaseSubnetGroupName2',
});

/**
 * Scenario 1: Aurora serverless v1 cluster for MySQL.
 */
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

/**
 * Scenario 2: Aurora serverless v2 cluster for MySQL. We mix serverless v2 instances
 * and provision instances in this case.
 */
// Aurora Serverless v2 cluster for MySQL
const cluster2 = new rds.DatabaseCluster(stack, 'cluster2', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_02_1 }),
  serverlessV2Scaling: {
    maxCapacity: 4,
    minCapacity: 0.5,
  },
  instances: 0,
  instanceProps: {
    vpc,
    vpcSubnets: {
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// adding a serverless writer
cluster2.addServerlessInstance('cluster2instance1', {
  engine: rds.DatabaseInstanceEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_02_1 }),
});

// adding a serverless reader
cluster2.addServerlessInstance('cluster2instance2', {
  engine: rds.DatabaseInstanceEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_02_1 }),
});

// adding a provisioned reader
cluster2.addInstance('cluster2instance3', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
  engine: rds.DatabaseInstanceEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_02_1 }),
});

/**
 * Scenario 3: Aurora serverless v2 cluster for PostgreSQL. We mix serverless v2 instances
 * and provision instances in this case.
 */
// Aurora Serverless v2 cluster for PostgreSQL
const cluster3 = new rds.DatabaseCluster(stack, 'cluster3', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({
    version: rds.AuroraPostgresEngineVersion.VER_14_4,
  }),
  serverlessV2Scaling: {
    maxCapacity: 4,
    minCapacity: 0.5,
  },
  instances: 0,
  instanceProps: {
    vpc,
    vpcSubnets: {
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// adding a serverless writer
cluster3.addServerlessInstance('cluster3instance1', {
  engine: rds.DatabaseInstanceEngine.auroraPostgres({ version: rds.PostgresEngineVersion.VER_14_4 }),
});

// adding a serverless reader
cluster3.addServerlessInstance('cluster3instance2', {
  engine: rds.DatabaseInstanceEngine.auroraPostgres({ version: rds.PostgresEngineVersion.VER_14_4 }),
});

// adding a provisioned reader
cluster3.addInstance('cluster3instance3', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
  engine: rds.DatabaseInstanceEngine.auroraPostgres({ version: rds.PostgresEngineVersion.VER_14_4 }),
});

/**
 * Scenario 4: Aurora cluster for MySQL with 1 writer and 1 reader provisioned instance.
 * Add an additional serverless v2 instance into this cluster as the additional reader.
 */
const cluster4 = new rds.DatabaseCluster(stack, 'Cluster4', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_02_1 }),
  serverlessV2Scaling: {
    maxCapacity: 4,
    minCapacity: 0.5,
  },
  instanceProps: {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
    vpc,
    vpcSubnets: {
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
  },
});

// adding a serverless reader
cluster4.addServerlessInstance('cluster4instance3', {
  engine: rds.DatabaseInstanceEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_02_1 }),
});

/**
 * Scenario 5: Aurora cluster for MySQL with 0 instance.
 * Add serverless v2 instances into this cluster as the writer and reader.
 */
const cluster5 = new rds.DatabaseCluster(stack, 'Cluster5', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_02_1 }),
  serverlessV2Scaling: {
    maxCapacity: 4,
    minCapacity: 0.5,
  },
  instances: 0,
  instanceProps: {
    vpc,
    vpcSubnets: {
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
  },
});

// adding a serverless v2 writer
cluster5.addServerlessInstance('cluster5instance1', {
  engine: rds.DatabaseInstanceEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_02_1 }),
});

// adding a serverless v2 reader
cluster5.addServerlessInstance('cluster5instance2', {
  engine: rds.DatabaseInstanceEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_02_1 }),
});

new integ.IntegTest(app, 'ServerlessV2Test', {
  testCases: [stack],
});

app.synth();
