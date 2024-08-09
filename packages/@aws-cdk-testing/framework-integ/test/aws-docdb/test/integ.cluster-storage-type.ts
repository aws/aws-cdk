import { InstanceClass, InstanceSize, InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, Stack, RemovalPolicy, SecretValue } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { DatabaseCluster, StorageType } from 'aws-cdk-lib/aws-docdb';

const app = new App();

const stack = new Stack(app, 'StorageTypeClusterTestStack');

const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2, natGateways: 0 });

const instanceType = InstanceType.of(InstanceClass.R5, InstanceSize.LARGE);

new DatabaseCluster(stack, 'DatabaseCluster', {
  masterUser: {
    username: 'docdb',
    password: SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
  },
  instanceType,
  vpc,
  removalPolicy: RemovalPolicy.DESTROY,
  engineVersion: '5.0.0',
  storageType: StorageType.IOPT1,
});

new integ.IntegTest(app, 'StorageTypeClusterTest', {
  testCases: [stack],
});
