import sns = require('@aws-cdk/aws-sns');
import { App, CfnParameter, Construct, Stack } from '@aws-cdk/core';
import cfn = require('../lib');

interface MyNestedStackProps {
  readonly topicCount: number;
  readonly topicNamePrefix: string;
}

class MyNestedStack extends cfn.NestedStack {
  constructor(scope: Construct, id: string, props: MyNestedStackProps) {
    const topicNamePrefixLogicalId = 'TopicNamePrefix';

    super(scope, id, {
      parameters: {
        [topicNamePrefixLogicalId]: props.topicNamePrefix
      }
    });

    const topicNamePrefixParameter = new CfnParameter(this, 'TopicNamePrefix', { type: 'String' });

    for (let i = 0; i < props.topicCount; ++i) {
      new sns.Topic(this, `topic-${i}`, { displayName: `${topicNamePrefixParameter.valueAsString}-${i}`});
    }
  }
}

class MyTestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new MyNestedStack(this, 'NestedStack1', { topicCount: 3, topicNamePrefix: 'Prefix1'});
    new MyNestedStack(this, 'NestedStack2', { topicCount: 2, topicNamePrefix: 'Prefix2' });
  }
}

const app = new App();
new MyTestStack(app, 'nested-stacks-test');
app.synth();