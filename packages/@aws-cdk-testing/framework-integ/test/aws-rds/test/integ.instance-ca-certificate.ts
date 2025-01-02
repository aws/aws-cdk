import { InstanceClass, InstanceSize, InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { CaCertificate, DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';

const app = new App();

const stack = new Stack(app, 'cdk-integ-rds-instance-ca-certificate');

const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

new DatabaseInstance(stack, 'Instance', {
  engine: DatabaseInstanceEngine.postgres({
    version: PostgresEngineVersion.VER_14,
  }),
  instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
  vpc,
  caCertificate: CaCertificate.RDS_CA_RSA2048_G1,
});

new integ.IntegTest(app, 'InstanceCACertificateTest', {
  testCases: [stack],
});

app.synth();
