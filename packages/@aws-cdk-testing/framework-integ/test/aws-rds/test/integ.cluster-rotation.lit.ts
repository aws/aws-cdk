import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-cluster-rotation');

const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
const endpoint = new ec2.InterfaceVpcEndpoint(stack, 'Endpoint', {
  vpc,
  service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
});

/// !show
const instanceProps = {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  isFromLegacyInstanceProps: true,
};
const cluster = new rds.DatabaseCluster(stack, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.VER_3_07_1,
  }),
  vpc,
  writer: rds.ClusterInstance.provisioned('Instance1', {
    ...instanceProps,
  }),
  readers: [
    rds.ClusterInstance.provisioned('Instance2', {
      ...instanceProps,
    }),
  ],
});

cluster.addRotationSingleUser();

const clusterWithCustomRotationOptions = new rds.DatabaseCluster(stack, 'CustomRotationOptions', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.VER_3_07_1,
  }),
  vpc,
  writer: rds.ClusterInstance.provisioned('Instance1', {
    ...instanceProps,
  }),
  readers: [
    rds.ClusterInstance.provisioned('Instance2', {
      ...instanceProps,
    }),
  ],
});
clusterWithCustomRotationOptions.addRotationSingleUser({
  automaticallyAfter: cdk.Duration.days(7),
  excludeCharacters: '!@#$%^&*',
  securityGroup,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
  endpoint: endpoint,
  rotateImmediatelyOnUpdate: false,
});
/// !hide

new IntegTest(app, 'test-rds-cluster-rotation', {
  testCases: [stack],
});

app.synth();
