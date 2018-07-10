import { App, Stack, StackProps } from '@aws-cdk/core';
import { LogGroup, LogPattern, MetricFilter } from '../lib';

class MetricFilterIntegStack extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        const logGroup = new LogGroup(this, 'LogGroup');

        /// !show
        new MetricFilter(this, 'MetricFilter', {
            logGroup,
            metricNamespace: 'MyApp',
            metricName: 'Latency',
            logPattern: LogPattern.exists('$.latency'),
            metricValue: '$.latency'
        });
        /// !hide
    }
}

const app = new App(process.argv);
new MetricFilterIntegStack(app, 'aws-cdk-metricfilter-integ');
process.stdout.write(app.run());