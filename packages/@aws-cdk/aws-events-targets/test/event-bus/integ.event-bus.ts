import * as events from '@aws-cdk/aws-events';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';

const app = new cdk.App();

class EventSourceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const rule = new events.Rule(this, 'Rule', {
      schedule: events.Schedule.expression('rate(1 minute)'),
    });

    const queue = new sqs.Queue(this, 'Queue');

    rule.addTarget(new targets.EventBus(
      events.EventBus.fromEventBusArn(
        this,
        'External',
        `arn:aws:events:${this.region}:999999999999:event-bus/test-bus`,
      ),
      {
        deadLetterQueue: queue,
      },
    ));
  }
}

new EventSourceStack(app, 'event-source-stack');
app.synth();
