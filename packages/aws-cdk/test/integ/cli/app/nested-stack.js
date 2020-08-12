const cfn = require('@aws-cdk/aws-cloudformation');
const sns = require('@aws-cdk/aws-sns');
const { Stack, CfnParameter } = require('@aws-cdk/core');

class StackWithNestedStack extends Stack {
  constructor(scope, id) {
    super(scope, id);
    new MyNestedStack(this, 'MyNested');
  }
}

class MyNestedStack extends cfn.NestedStack {
  constructor(scope, id) {
    super(scope, id);

    new sns.Topic(this, 'MyTopic');
  }
}

class StackWithNestedStackUsingParameters extends Stack {
  constructor(scope, id) {
    super(scope, id);
    const topicNameParam = new CfnParameter(this, 'MyTopicParam');
    new MyNestedStackUsingParameters(this, 'MyNested', {
      parameters: {'MyTopicParam': topicNameParam.valueAsString}
    });
  }
}

class MyNestedStackUsingParameters extends cfn.NestedStack {
  constructor(scope, id, props) {
    super(scope, id, props);

    new sns.Topic(this, 'MyTopic', {
      topicName: new CfnParameter(this, 'MyTopicParam')
    });
  }
}

exports.StackWithNestedStack = StackWithNestedStack;
exports.StackWithNestedStackUsingParameters = StackWithNestedStackUsingParameters;
