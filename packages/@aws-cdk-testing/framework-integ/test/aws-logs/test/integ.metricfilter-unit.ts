import { Unit } from 'aws-cdk-lib/aws-cloudwatch';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { FilterPattern, LogGroup, MetricFilter } from 'aws-cdk-lib/aws-logs';

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
      dimensions: {
        ErrorCode: '$.errorCode',
      },
      unit: Unit.MILLISECONDS,
    });
  }
}

const app = new App();
const testCase = new TestStack(app, 'aws-cdk-metricfilter-unit-integ');

new IntegTest(app, 'metricfilter-unit', {
  testCases: [testCase],
});
app.synth();
