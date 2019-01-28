import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import sns = require('../lib');

export = {
  'publish to SNS'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');

    // WHEN
    const pub = new sns.PublishTask(stack, 'Publish', {
      topic,
      message: 'Send this message'
    });

    // THEN
    test.deepEqual(stack.node.resolve(pub.toStateJson()), {
      Type: 'Task',
      Resource: 'arn:aws:states:::sns:publish',
      End: true,
      Parameters: {
        TopicArn: { Ref: 'TopicBFC7AF6E' },
        Message: 'Send this message'
      },
    });

    test.done();
  }
};
