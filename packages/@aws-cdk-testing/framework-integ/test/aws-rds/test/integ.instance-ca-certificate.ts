import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { CaCertificate, DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-instance-ca-certificate');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

new DatabaseInstance(stack, 'Instance', {
  engine: DatabaseInstanceEngine.postgres({
    version: PostgresEngineVersion.VER_17_7,
  }),
  vpc,
  caCertificate: CaCertificate.RDS_CA_RSA2048_G1,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'instance-ca-certificate-integ-test', {
  testCases: [stack],
});

app.synth();
