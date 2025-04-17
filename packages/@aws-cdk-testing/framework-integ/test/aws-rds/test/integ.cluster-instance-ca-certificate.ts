import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { AuroraMysqlEngineVersion, CaCertificate, ClusterInstance, Credentials, DatabaseCluster, DatabaseClusterEngine } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cdk-rds-cluster-instance-ca-certificate-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const instanceProps = {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  isFromLegacyInstanceProps: true,
  caCertificate: CaCertificate.RDS_CA_RSA4096_G1,
};

new DatabaseCluster(stack, 'Database', {
  engine: DatabaseClusterEngine.auroraMysql({
    version: AuroraMysqlEngineVersion.VER_3_07_1,
  }),
  credentials: Credentials.fromUsername('admin', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  vpc,
  writer: ClusterInstance.provisioned('Instance1', {
    ...instanceProps,
  }),
  readers: [
    ClusterInstance.provisioned('Instance2', {
      ...instanceProps,
    }),
  ],
});

new IntegTest(app, 'cdk-rds-cluster-instance-ca-certificate-test', {
  testCases: [stack],
});

app.synth();
