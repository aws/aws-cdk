import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { AttributeType, Table } from '../lib';

const app = new App();
const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};
const stack = new Stack(app, 'demo-stack', { env });

const table = new Table(stack, 'Table', {
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING,
  },
});

const target = new appscaling.ScalableTarget(stack, 'Target', {
  serviceNamespace: appscaling.ServiceNamespace.DYNAMODB,
  scalableDimension: 'dynamodb:table:ReadCapacityUnits',
  resourceId: `table/${table.tableName}`,
  minCapacity: 1,
  maxCapacity: 20,
});

target.scaleOnSchedule('scheduledScaling', {
  timezone: 'America/New_York',
  schedule: appscaling.Schedule.cron({
    hour: '0',
    minute: '10',
  }),
  minCapacity: 20,
  maxCapacity: 100,
});

new integ.IntegTest(app, 'IntegTest', {
  testCases: [stack],
});

app.synth();