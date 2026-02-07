import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'cdk-rds-read-replica-with-allocated-storage');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
  subnetConfiguration: [
    {
      cidrMask: 24,
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      cidrMask: 24,
      name: 'Isolated',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    },
  ],
});

const sourceInstance = new rds.DatabaseInstance(stack, 'SourceInstance', {
  engine: rds.DatabaseInstanceEngine.mysql({
    version: rds.MysqlEngineVersion.VER_8_0_42,
  }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new rds.DatabaseInstanceReadReplica(stack, 'ReadReplica', {
  sourceDatabaseInstance: sourceInstance,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
  },
  allocatedStorage: 500,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'ReadReplicaWithAllocatedStorageTest', {
  testCases: [stack],
});
