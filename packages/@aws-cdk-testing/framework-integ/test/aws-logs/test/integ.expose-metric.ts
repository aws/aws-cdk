import { Alarm } from 'aws-cdk-lib/aws-cloudwatch';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { FilterPattern, LogGroup, MetricFilter } from 'aws-cdk-lib/aws-logs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Stack verification steps:
 *
 * -- aws cloudwatch describe-alarms --alarm-name-prefix aws-cdk-expose-metric-integ
 * has Namespace of `MyApp` and Statistic of `Average`
 */

class ExposeMetricIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'LogGroup', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    /// !show
    const mf = new MetricFilter(this, 'MetricFilter', {
      logGroup,
      metricNamespace: 'MyApp',
      metricName: 'Latency',
      filterPattern: FilterPattern.exists('$.latency'),
      metricValue: '$.latency',
    });

    new Alarm(this, 'alarm from metric filter', {
      metric: mf.metric(),
      threshold: 100,
      evaluationPeriods: 2,
    });

    /// !hide
  }
}

const app = new App();
const stack = new ExposeMetricIntegStack(app, 'aws-cdk-expose-metric-integ');

new IntegTest(app, 'LambdaTest', {
  testCases: [stack],
});

app.synth();
