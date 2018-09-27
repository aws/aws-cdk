#!/usr/bin/env node
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');

class %name.PascalCased%Stack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    const queue = new sqs.Queue(this, '%name.PascalCased%Queue', {
      visibilityTimeoutSec: 300
    });

    const topic = new sns.Topic(this, '%name.PascalCased%Topic');

    topic.subscribeQueue(queue);
  }
}

const app = new cdk.App(process.argv);

new %name.PascalCased%Stack(app, '%name.PascalCased%Stack');

process.stdout.write(app.run());
