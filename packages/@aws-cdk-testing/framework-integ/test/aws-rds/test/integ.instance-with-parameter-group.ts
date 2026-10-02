import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_POSTGRES } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-instance-with-rds-parameter-group', {
  terminationProtection: false,
});

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const parameterGroup = new rds.ParameterGroup(stack, 'ParameterGroup', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: INTEG_TEST_LATEST_POSTGRES }),
  description: 'desc',
  name: 'name',
});

new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: INTEG_TEST_LATEST_POSTGRES }),
  vpc,
  multiAz: false,
  publiclyAccessible: true,
  iamAuthentication: true,
  parameterGroup,
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
