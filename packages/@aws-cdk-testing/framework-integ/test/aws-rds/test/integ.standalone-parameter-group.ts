import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { INTEG_TEST_LATEST_POSTGRES } from './db-versions';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-standalone-parameter-group', {
  terminationProtection: false,
});

new rds.ParameterGroup.forInstance(stack, 'ParameterGroup', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: INTEG_TEST_LATEST_POSTGRES }),
  description: 'desc',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  name: 'name',
});

new rds.ParameterGroup.forCluster(stack, 'ParameterGroup', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: INTEG_TEST_LATEST_POSTGRES }),
  description: 'desc',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  name: 'name',
});

new IntegTest(app, 'rds-standalone-parameter-group-integ-test', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});
