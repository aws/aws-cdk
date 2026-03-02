import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-cluster-dual-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 0, restrictDefaultSecurityGroup: false });
const ipv6 = new ec2.CfnVPCCidrBlock(stack, 'Ipv6CidrBlock', { vpcId: vpc.vpcId, amazonProvidedIpv6CidrBlock: true });
vpc.isolatedSubnets.forEach((subnet, idx) => {
  const cfnSubnet = subnet.node.defaultChild as ec2.CfnSubnet;
  cfnSubnet.ipv6CidrBlock = cdk.Fn.select(idx, cdk.Fn.cidr(cdk.Fn.select(0, vpc.vpcIpv6CidrBlocks), 256, '64'));
  cfnSubnet.addDependsOn(ipv6);
});

const instanceProps = {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  isFromLegacyInstanceProps: true,
};
new rds.DatabaseCluster(stack, 'DualstackCluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: INTEG_TEST_LATEST_AURORA_MYSQL }),
  credentials: rds.Credentials.fromUsername('admin', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
  writer: rds.ClusterInstance.provisioned('Instance1', {
    ...instanceProps,
  }),
  readers: [
    rds.ClusterInstance.provisioned('Instance2', {
      ...instanceProps,
    }),
  ],
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  vpc,
  networkType: rds.NetworkType.DUAL,
});

new rds.DatabaseCluster(stack, 'Ipv4Cluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: INTEG_TEST_LATEST_AURORA_MYSQL }),
  credentials: rds.Credentials.fromUsername('admin', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  vpc,
  writer: rds.ClusterInstance.provisioned('Instance1', {
    ...instanceProps,
  }),
  readers: [
    rds.ClusterInstance.provisioned('Instance2', {
      ...instanceProps,
    }),
  ],
  networkType: rds.NetworkType.IPV4,
});

new IntegTest(app, 'cluster-dual-test', {
  testCases: [stack],
});
