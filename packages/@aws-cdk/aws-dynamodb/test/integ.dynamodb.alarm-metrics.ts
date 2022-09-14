import { Alarm } from '@aws-cdk/aws-cloudwatch';
import { App, Duration, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AttributeType, Operation, Table } from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests';

const app = new App();

export class AlarmMetricsInteg extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const table = new Table(this, 'Table', {
      partitionKey: { name: 'metric', type: AttributeType.STRING },
    });
    const metricTableThrottled = table.metricThrottledRequestsForOperation({
      operations: [Operation.PUT_ITEM],
      period: Duration.minutes(1),
    });
    new Alarm(this, 'TableThrottleAlarm', {
      metric: metricTableThrottled,
      evaluationPeriods: 1,
      threshold: 1,
    });
  }
}

new IntegTest(app, 'alarm-metric-integ', {
  testCases: [
    new AlarmMetricsInteg(app, 'alarm-metrics'),
  ],
});

app.synth();