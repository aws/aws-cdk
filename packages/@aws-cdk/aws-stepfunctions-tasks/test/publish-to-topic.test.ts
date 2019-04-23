import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
import tasks = require('../lib');

test('publish to SNS', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topic = new sns.Topic(stack, 'Topic');

  // WHEN
  const pub = new tasks.PublishTask(stack, 'Publish', {
    topic,
    message: 'Send this message'
  });

  // THEN
  expect(stack.node.resolve(pub.toStateJson())).toEqual({
    Type: 'Task',
    Resource: 'arn:aws:states:::sns:publish',
    End: true,
    Parameters: {
      TopicArn: { Ref: 'TopicBFC7AF6E' },
      Message: 'Send this message'
    },
  });
});
