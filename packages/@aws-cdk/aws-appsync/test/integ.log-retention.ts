import { join } from 'path';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { GraphqlApi, LogConfig, Schema } from '../lib';

const app = new App();
const stack = new Stack(app, 'AppSyncIntegLogRetention');

const logConfig: LogConfig = {
  retention: RetentionDays.ONE_WEEK,
};

new GraphqlApi(stack, 'GraphqlApi', {
  authorizationConfig: {},
  name: 'IntegLogRetention',
  schema: Schema.fromAsset(join(__dirname, 'appsync.test.graphql')),
  logConfig,
});

new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();