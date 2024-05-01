import * as events from 'aws-cdk-lib/aws-events';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';

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
