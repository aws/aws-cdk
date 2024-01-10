import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-instance-with-parameter-group');

const parameterGroup = new rds.ParameterGroup(stack, 'ParameterGroup', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15_2 }),
  description: 'desc',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15_2 }),
  vpc: new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false }),
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
