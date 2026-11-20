import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup, QueryDefinition, QueryLanguage, QueryString } from 'aws-cdk-lib/aws-logs';

class QueryDefinitionLanguageParametersStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'LogGroup', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Logs Insights QL with parameters
    new QueryDefinition(this, 'ParametersQuery', {
      queryDefinitionName: 'ErrorsByStatus',
      queryString: new QueryString({
        fields: ['@timestamp', '@message'],
        filterStatements: ['status = {{status}}'],
        sort: '@timestamp desc',
        limit: 50,
      }),
      logGroups: [logGroup],
      queryLanguage: QueryLanguage.CWLI,
      parameters: [
        { name: 'status', defaultValue: '500', description: 'HTTP status code to filter on' },
      ],
    });

    // OpenSearch PPL
    new QueryDefinition(this, 'PplQuery', {
      queryDefinitionName: 'TopPaths',
      queryLanguage: QueryLanguage.PPL,
      queryString: QueryString.fromString('fields `path` | stats count() as hits by `path` | sort - hits | head 10'),
      logGroups: [logGroup],
    });

    // OpenSearch SQL, with the log group in the query string
    new QueryDefinition(this, 'SqlQuery', {
      queryDefinitionName: 'RecentErrors',
      queryLanguage: QueryLanguage.SQL,
      queryString: QueryString.fromString(
        `SELECT \`@timestamp\`, \`@message\` FROM \`logGroups(logGroupIdentifier: ['${logGroup.logGroupName}'])\` WHERE \`@message\` LIKE '%ERROR%' LIMIT 50`,
      ),
    });
  }
}

const app = new App();
const testCase = new QueryDefinitionLanguageParametersStack(app, 'aws-cdk-logs-query-definition-language-parameters-integ');

new IntegTest(app, 'logs-query-definition-language-parameters', {
  testCases: [testCase],
});
