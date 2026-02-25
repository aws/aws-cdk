import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-standalone-parameter-group', {
  terminationProtection: false,
});

const parameterGroup = new rds.ParameterGroup(stack, 'ParameterGroup', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16_3 }),
  description: 'desc',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  name: 'name',
});

parameterGroup.create(rds.ParameterGroupType.INSTANCE);
parameterGroup.create(rds.ParameterGroupType.CLUSTER);

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
