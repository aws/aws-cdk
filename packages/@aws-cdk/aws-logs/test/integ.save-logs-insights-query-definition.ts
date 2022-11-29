import { App, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';

import { LogGroup, QueryDefinition, QueryString } from '../lib';

class LogsInsightsQueryDefinitionIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'LogGroup', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new QueryDefinition(this, 'QueryDefinition', {
      queryDefinitionName: 'QueryDefinition',
      queryString: new QueryString({
        fields: ['@timestamp', '@message'],
        parse: '@message "[*] *" as loggingType, loggingMessage',
        filter: 'loggingType = "ERROR"',
        sort: '@timestamp desc',
        limit: 20,
        display: 'loggingMessage',
      }),
      logGroups: [logGroup],
    });
  }
}

const app = new App();
const stack = new LogsInsightsQueryDefinitionIntegStack(app, 'aws-cdk-logs-insights-querydefinition-integ');
new IntegTest(app, 'LogsInsightsQueryDefinitionIntegTest', {
  testCases: [stack],
});
app.synth();
