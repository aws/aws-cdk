const cfn = require('@aws-cdk/aws-cloudformation');
const sns = require('@aws-cdk/aws-sns');
const { Stack } = require('@aws-cdk/core');

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

exports.StackWithNestedStack = StackWithNestedStack;