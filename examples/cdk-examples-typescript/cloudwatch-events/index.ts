import events = require('@aws-cdk/aws-events');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');

const app = new cdk.App();

class CloudWatchEventsExample extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const topic = new sns.Topic(this, 'TestTopic');

    const event = new events.EventRule(this, 'Rule', {
      scheduleExpression: 'rate(1 minute)'
    });

    event.addTarget(topic, {
      textTemplate: 'one line\nsecond line'
    });
  }
}

new CloudWatchEventsExample(app, 'CWE-Example');

app.run();
