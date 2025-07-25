import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

import { LogGroup, QueryDefinition, QueryString } from 'aws-cdk-lib/aws-logs';

class LogsInsightsQueryDefinitionIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'LogGroup', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Test query creation with single parse, filter, and sort statements
    new QueryDefinition(this, 'QueryDefinition', {
      queryDefinitionName: 'QueryDefinition',
      queryString: new QueryString({
        fields: ['@timestamp', '@message'],
        parse: '@message "[*] *" as loggingType, loggingMessage',
        filter: 'loggingType = "ERROR"',
        stats: 'count(loggingMessage) as loggingErrors',
        sort: '@timestamp desc',
        limit: 20,
        display: 'loggingMessage',
      }),
      logGroups: [logGroup],
    });

    // Test query creation with multiple parse, filter, and stats statements
    new QueryDefinition(this, 'QueryDefinitionWithMultipleStatements', {
      queryDefinitionName: 'QueryDefinitionWithMultipleStatements',
      queryString: new QueryString({
        fields: ['@timestamp', '@message'],
        parseStatements: [
          '@message "[*] *" as loggingType, loggingMessage',
          '@message "<*>: *" as differentLoggingType, differentLoggingMessage',
        ],
        filterStatements: [
          'loggingType = "ERROR"',
          'loggingMessage = "A very strange error occurred!"',
        ],
        statsStatements: [
          'count(loggingMessage) as loggingErrors',
          'count(differentLoggingMessage) as differentLoggingErrors',
        ],
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
