import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import { DatabaseCluster, DatabaseClusterEngine } from '../lib';
import { ClusterParameterGroup } from '../lib/parameter-group';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

const params = new ClusterParameterGroup(stack, 'Params', {
  family: 'aurora5.6',
  description: 'A nice parameter group',
  parameters: {
    character_set_database: 'utf8mb4'
  }
});

const kmsKey = new kms.Key(stack, 'DbSecurity');
const cluster = new DatabaseCluster(stack, 'Database', {
  engine: DatabaseClusterEngine.AURORA,
  masterUser: {
    username: 'admin',
    password: cdk.SecretValue.plainText('7959866cacc02c2d243ecfe177464fe6'),
  },
  instanceProps: {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
    vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    vpc
  },
  parameterGroup: params,
  kmsKey,
});

cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

app.synth();
