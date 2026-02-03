import { InstanceClass, InstanceSize, InstanceType, Vpc, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { App, Stack, RemovalPolicy, SecretValue } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { CaCertificate, DatabaseCluster } from 'aws-cdk-lib/aws-docdb';

const app = new App();

const stack = new Stack(app, 'cdk-integ-docdb-cluster-instance-ca-certificate');

const vpc = new Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const instanceType = InstanceType.of(InstanceClass.R5, InstanceSize.LARGE);

new DatabaseCluster(stack, 'Database', {
  masterUser: {
    username: 'docdb',
    password: SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
  },
  instanceType: instanceType,
  caCertificate: CaCertificate.RDS_CA_RSA4096_G1,
  vpcSubnets: { subnetType: SubnetType.PUBLIC },
  vpc,
  removalPolicy: RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'ClusterInstanceCACertificateTest', {
  testCases: [stack],
});

app.synth();
