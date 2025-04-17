import { Alarm } from 'aws-cdk-lib/aws-cloudwatch';
import { App, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { AttributeType, Operation, Table } from 'aws-cdk-lib/aws-dynamodb';

export class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'Table', {
      partitionKey: { name: 'metric', type: AttributeType.STRING },
    });
    const metricTableThrottled = table.metricThrottledRequestsForOperations({
      operations: [Operation.PUT_ITEM, Operation.SCAN],
      period: Duration.minutes(1),
    });
    new Alarm(this, 'TableThrottleAlarm', {
      metric: metricTableThrottled,
      evaluationPeriods: 1,
      threshold: 1,
    });
    const metricTableError = table.metricSystemErrorsForOperations({
      operations: [Operation.PUT_ITEM, Operation.SCAN],
      period: Duration.minutes(1),
    });
    new Alarm(this, 'TableErrorAlarm', {
      metric: metricTableError,
      evaluationPeriods: 1,
      threshold: 1,
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'alarm-metrics');

new IntegTest(app, 'alarm-metrics-integ', {
  testCases: [stack],
});

app.synth();
