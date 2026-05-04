import * as cdk from 'aws-cdk-lib';
import { RemovalPolicies } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { FileSystem } from 'aws-cdk-lib/aws-s3files';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-s3files-filesystem-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const bucket = new s3.Bucket(stack, 'Bucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const fileSystem = new FileSystem(stack, 'FileSystem', {
  bucket,
  vpc,
});

fileSystem.addAccessPoint('AccessPoint', {
  path: '/data',
  createAcl: { ownerUid: '1000', ownerGid: '1000', permissions: '0755' },
  posixUser: { uid: '1000', gid: '1000' },
});

RemovalPolicies.of(app).destroy();

new integ.IntegTest(app, 'test-s3files-filesystem-integ-test', {
  testCases: [stack],
});
