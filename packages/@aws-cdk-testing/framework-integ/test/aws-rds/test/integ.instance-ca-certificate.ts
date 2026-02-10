import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_POSTGRES } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import { CaCertificate, DatabaseInstance, DatabaseInstanceEngine } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-instance-ca-certificate');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

new DatabaseInstance(stack, 'Instance', {
  engine: DatabaseInstanceEngine.postgres({
    version: INTEG_TEST_LATEST_POSTGRES,
  }),
  vpc,
  caCertificate: CaCertificate.RDS_CA_RSA2048_G1,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'instance-ca-certificate-integ-test', {
  testCases: [stack],
});

app.synth();
