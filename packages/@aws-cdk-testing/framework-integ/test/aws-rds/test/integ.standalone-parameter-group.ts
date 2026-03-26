import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { INTEG_TEST_LATEST_POSTGRES } from './db-versions';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({ context: { '@aws-cdk/core:disableGitSource': true } });
const stack = new cdk.Stack(app, 'aws-cdk-rds-standalone-parameter-group', {
  terminationProtection: false,
});

rds.ParameterGroup.forInstance(stack, 'InstanceParameterGroup', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: INTEG_TEST_LATEST_POSTGRES }),
  description: 'desc',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  name: 'instance',
});

rds.ParameterGroup.forCluster(stack, 'ClusterParameterGroup', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: INTEG_TEST_LATEST_POSTGRES }),
  description: 'desc',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  name: 'cluster',
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
