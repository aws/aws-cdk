import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Stream } from 'aws-cdk-lib/aws-kinesis';
import { FilterPattern, LogGroup, MetricFilter, SubscriptionFilter, SystemField } from 'aws-cdk-lib/aws-logs';
import { KinesisDestination } from 'aws-cdk-lib/aws-logs-destinations';

class FiltersSystemFieldsStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'LogGroup', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new MetricFilter(this, 'MetricFilter', {
      logGroup,
      metricNamespace: 'MyApp',
      metricName: 'Errors',
      filterPattern: FilterPattern.exists('$.errorCode'),
      dimensions: {
        ErrorCode: '$.errorCode',
      },
      fieldSelectionCriteria: `@aws.region = "${this.region}"`,
      emitSystemFieldDimensions: [SystemField.AWS_ACCOUNT, SystemField.AWS_REGION],
    });

    const stream = new Stream(this, 'Stream', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new SubscriptionFilter(this, 'SubscriptionFilter', {
      logGroup,
      destination: new KinesisDestination(stream),
      filterPattern: FilterPattern.allEvents(),
      fieldSelectionCriteria: `@aws.region = "${this.region}"`,
      emitSystemFields: [SystemField.AWS_ACCOUNT, SystemField.AWS_REGION, SystemField.SOURCE_LOG],
    });
  }
}

const app = new App();
const testCase = new FiltersSystemFieldsStack(app, 'aws-cdk-logs-filters-system-fields-integ');

new IntegTest(app, 'logs-filters-system-fields', {
  testCases: [testCase],
});
