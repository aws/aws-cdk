import { App, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { FilterPattern, LogGroup, MetricFilter } from '../lib';

class TestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'LogGroup', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new MetricFilter(this, 'MetricFilter', {
      logGroup,
      metricNamespace: 'MyApp',
      metricName: 'Latency',
      filterPattern: FilterPattern.exists('$.latency'),
      metricValue: '$.latency',
      dimensions: [
        {
          key: 'ErrorCode',
          value: '$.errorCode',
        },
      ],
    });
  }
}

const app = new App();
const testCase = new TestStack(app, 'aws-cdk-metricfilter-dimensions-integ');

new IntegTest(app, 'metricfilter-dimensions', {
  testCases: [testCase],
});
app.synth();
