import { App, Stack, StackProps } from '@aws-cdk/core';
import { QueryDefinition } from '../lib';

class LogsInsightsQueryDefinitionIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new QueryDefinition(this, 'QueryDefinition', {
      queryDefinitionName: 'MyQuery',
      queryString: 'fields @timestamp, @message | sort @timestamp desc | limit 20',
    });
  }
}

const app = new App();
new LogsInsightsQueryDefinitionIntegStack(app, 'aws-cdk-logs-querydefinition-integ');
app.synth();