import { join } from 'path';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { GraphqlApi, LogConfig, SchemaFile } from 'aws-cdk-lib/aws-appsync';

const app = new App();
const stack = new Stack(app, 'AppSyncIntegLogRetention');

const retentionTime = RetentionDays.ONE_WEEK;
const logConfig: LogConfig = {
  retention: retentionTime,
};

const api = new GraphqlApi(stack, 'GraphqlApi', {
  authorizationConfig: {},
  name: 'IntegLogRetention',
  schema: SchemaFile.fromAsset(join(__dirname, 'appsync.test.graphql')),
  logConfig,
});

const integ = new IntegTest(app, 'Integ', { testCases: [stack] });

const describe = integ.assertions.awsApiCall('CloudWatchLogs',
  'describeLogGroups',
  {
    logGroupNamePrefix: api.logGroup.logGroupName,
  });

describe.expect(ExpectedResult.objectLike({
  logGroups: [
    {
      logGroupName: api.logGroup.logGroupName,
      retentionInDays: retentionTime,
    },
  ],
}));

app.synth();
