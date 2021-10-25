if (process.env.PACKAGE_LAYOUT_VERSION === '1') {
  var cfn = require('@aws-cdk/aws-cloudformation');
  var sns = require('@aws-cdk/aws-sns');
  var { Stack, CfnParameter } = require('@aws-cdk/core');
} else {
  var {
    aws_cloudformation: cfn,
    aws_sns: sns,
  } = require('aws-cdk-lib');
  var { Stack, CfnParameter } = require('aws-cdk-lib');
}

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
