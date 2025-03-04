import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { FilterPattern, LogGroup, MetricFilter } from 'aws-cdk-lib/aws-logs';

class MetricFilterIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'LogGroup', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    /// !show
    new MetricFilter(this, 'MetricFilter', {
      logGroup,
      metricNamespace: 'MyApp',
      metricName: 'Latency',
      filterName: 'MyFilterName',
      filterPattern: FilterPattern.all(
        FilterPattern.exists('$.latency'),
        FilterPattern.regexValue('$.message', '=', 'bind: address already in use'),
      ),
      metricValue: '$.latency',
    });
    /// !hide
  }
}

const app = new App();
new MetricFilterIntegStack(app, 'aws-cdk-metricfilter-integ');
app.synth();
