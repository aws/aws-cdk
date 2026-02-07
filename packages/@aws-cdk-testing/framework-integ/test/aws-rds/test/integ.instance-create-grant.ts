import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-rds-instance-create-grant');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false, natGateways: 1 });

const instance = new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({
    version: rds.PostgresEngineVersion.VER_16_11,
  }),
  vpc,
  credentials: rds.Credentials.fromUsername('postgres'),
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const role = new iam.Role(stack, 'DBRole', {
  assumedBy: new iam.AccountPrincipal(stack.account),
});

instance.grantConnect(role);

new IntegTest(app, 'instance-create-grant-integ-test', {
  testCases: [stack],
});
