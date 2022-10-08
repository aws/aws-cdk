import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as rds from '../lib';
import { DatabaseInstanceEngine } from '../lib';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new cdk.Stack(app, 'aws-cdk-rds-integ4', { env });

// const vpc = new ec2.Vpc(stack, 'VPC', {
//   maxAzs: 2,
//   natGateways: 1,
// });
const vpc = ec2.Vpc.fromLookup(stack, 'MyVpc', { isDefault: true });

const subnetGroup = new rds.SubnetGroup(stack, 'SubnetGroup2', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  description: 'My Subnet Group',
  subnetGroupName: 'MyNotLowerCaseSubnetGroupName',
});

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
    maxCapacity: 1,
    minCapacity: 0.5,
  },
  parameterGroup: rds.ParameterGroup.fromParameterGroupName(stack, 'PG', 'default.aurora-mysql8.0'),
});
cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

// adding a writer
const writer = new rds.DatabaseInstance(stack, 'writer', {
  vpc,
  serverlessInstance: true,
  clusterIdentifier: cluster.clusterIdentifier,
  engine: DatabaseInstanceEngine.auroraMySql({
    version: rds.MysqlEngineVersion.of(
      '8.0.mysql_aurora.3.02.0',
      '8.0',
    ),
  }),
});

Array.isArray(writer);

// // adding a reader
// const reader = new rds.DatabaseInstance(stack, 'reader', {
//   vpc,
//   serverlessInstance: true,
//   clusterIdentifier: cluster.clusterIdentifier,
//   engine: DatabaseInstanceEngine.auroraMySql({
//     version: rds.MysqlEngineVersion.of(
//       '8.0.mysql_aurora.3.02.0',
//       '8.0',
//     ),
//   }),
// });

// reader.node.addDependency(writer);


// const noCopyTagsCluster = new rds.ServerlessCluster(stack, 'Serverless Database Without Copy Tags', {
//   engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
//   credentials: {
//     username: 'admin',
//     password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
//   },
//   vpc,
//   vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
//   subnetGroup,
//   removalPolicy: cdk.RemovalPolicy.DESTROY,
//   copyTagsToSnapshot: false,
// });
// noCopyTagsCluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

app.synth();
