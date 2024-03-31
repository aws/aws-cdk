import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'efsReplication');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  natGateways: 0,
});

const kmsKey = new kms.Key(stack, 'Key', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new efs.FileSystem(stack, 'oneZoneReplicationFileSystem', {
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  replicationConfiguration: efs.ReplicationConfiguration.oneZoneFileSystem('us-east-1', 'us-east-1a', kmsKey),
});

const destination = new efs.FileSystem(stack, 'destinationFileSystem', {
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  replicationOverwriteProtection: efs.ReplicationOverwriteProtection.DISABLED,
});

new efs.FileSystem(stack, 'existFileSystemReplication', {
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  replicationConfiguration: efs.ReplicationConfiguration.existingFileSystem(destination),
});

new integ.IntegTest(app, 'efsReplicationIntegTest', {
  testCases: [stack],
});
