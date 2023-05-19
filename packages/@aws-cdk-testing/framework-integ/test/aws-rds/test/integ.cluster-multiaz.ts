import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
import { Credentials, MultiAZDatabaseCluster, DatabaseClusterEngine, ParameterGroup } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-multiaz-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 3, restrictDefaultSecurityGroup: false });

const params = new ParameterGroup(stack, 'Params', {
  engine: DatabaseClusterEngine.MYSQL,
  description: 'A nice parameter group',
  parameters: {
    character_set_database: 'utf8mb4',
  },
});

const kmsKey = new kms.Key(stack, 'DbSecurity');

const cluster = new MultiAZDatabaseCluster(stack, 'Database', {
  engine: DatabaseClusterEngine.MYSQL,
  credentials: Credentials.fromUsername('admin', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5D, ec2.InstanceSize.LARGE),
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  vpc,
  parameterGroup: params,
  storageEncryptionKey: kmsKey,
});

cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

new IntegTest(app, 'cluster-multiaz-test', {
  testCases: [stack],
  enableLookups: true,
});
app.synth();