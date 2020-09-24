import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import { DatabaseClusterEngine, ParameterGroup, ServerlessDatabaseCluster } from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

const params = new ParameterGroup(stack, 'Params', {
  engine: DatabaseClusterEngine.AURORA_MYSQL,
  description: 'A nice parameter group',
  parameters: {
    character_set_database: 'utf8mb4',
  },
});

const kmsKey = new kms.Key(stack, 'DbSecurity');

const cluster = new ServerlessDatabaseCluster(stack, 'Database', {
  engine: DatabaseClusterEngine.AURORA_MYSQL,
  masterUser: {
    username: 'admin',
    password: cdk.SecretValue.plainText('7959866cacc02c2d243ecfe177464fe6'),
  },
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  vpc,
  parameterGroup: params,
  storageEncryptionKey: kmsKey,
});

cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

app.synth();
