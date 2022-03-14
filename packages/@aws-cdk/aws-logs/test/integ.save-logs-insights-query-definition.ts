import { App, Stack, StackProps } from '@aws-cdk/core';
import { QueryDefinition, QueryString } from '../lib';

class LogsInsightsQueryDefinitionIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new QueryDefinition(this, 'QueryDefinitionUsingProps', {
      queryDefinitionName: 'QueryDefinitionUsingProps',
      queryString: new QueryString({
        fields: '@timestamp, @message',
        sort: '@timestamp desc',
        limit: 20,
      }),
    });

    let queryString = new QueryString();
    queryString.addFields('@timestamp, @message');
    queryString.addParse('@message "[*] *" as loggingType, loggingMessage');
    queryString.addFilter('loggingType = "ERROR"');
    queryString.addSort('@timestamp desc');
    queryString.addLimit(20);
    queryString.addDisplay('loggingMessage');

    new QueryDefinition(this, 'QueryDefinitionUsingQueryStringAddCommandMethods', {
      queryDefinitionName: 'QueryDefinitionUsingQueryStringAddCommandMethods',
      queryString: queryString,
    });
  }
}

const app = new App();
new LogsInsightsQueryDefinitionIntegStack(app, 'aws-cdk-logs-querydefinition-integ');
app.synth();
