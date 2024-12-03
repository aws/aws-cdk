import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as appsync from 'aws-cdk-lib/aws-appsync';

const app = new cdk.App({
  postCliContext: {
    [cdk.cx_api.APPSYNC_ENABLE_USE_ARN_IDENTIFIER_SOURCE_API_ASSOCIATION]: true,
  },
});

const stack = new cdk.Stack(app, 'stack');

const firstApi = new appsync.GraphqlApi(stack, 'FirstSourceAPI', {
  name: 'FirstSourceAPI',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.merged-api-1.graphql')),
});

firstApi.addNoneDataSource('FirstSourceDS', {
  name: cdk.Lazy.string({ produce(): string { return 'FirstSourceDS'; } }),
});

const secondApi = new appsync.GraphqlApi(stack, 'SecondSourceAPI', {
  name: 'SecondSourceAPI',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.merged-api-2.graphql')),
});

secondApi.addNoneDataSource('SecondSourceDS', {
  name: cdk.Lazy.string({ produce(): string { return 'SecondSourceDS'; } }),
});

new appsync.GraphqlApi(stack, 'MergedAPI', {
  name: 'MergedAPI',
  definition: appsync.Definition.fromSourceApis({
    sourceApis: [
      {
        sourceApi: firstApi,
        mergeType: appsync.MergeType.MANUAL_MERGE,
      },
      {
        sourceApi: secondApi,
        mergeType: appsync.MergeType.AUTO_MERGE,
      },
    ],
  }),
});

new IntegTest(app, 'api', {
  testCases: [stack],
});

app.synth();
