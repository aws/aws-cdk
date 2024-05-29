import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-instance-with-rds-parameter-group', {
  terminationProtection: false,
});

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const parameterGroup = new rds.ParameterGroup(stack, 'ParameterGroup', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16_3 }),
  description: 'desc',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  name: 'name',
});

new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16_3 }),
  vpc,
  multiAz: false,
  publiclyAccessible: true,
  iamAuthentication: true,
  parameterGroup,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'rds-instance-with-parameter-group-integ-test', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});
