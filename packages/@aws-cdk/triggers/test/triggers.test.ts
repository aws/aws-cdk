import { Template } from '@aws-cdk/assertions';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import { Stack } from '@aws-cdk/core';
import * as triggers from '../lib';

test('minimal', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new triggers.TriggerFunction(stack, 'MyTrigger', {
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromInline('foo'),
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Lambda::Function', {});
  template.hasResourceProperties('Custom::Trigger', {
    HandlerArn: { Ref: 'MyTriggerCurrentVersion8802742Bdcececde9999741035cd76cd19cf79ac' },
  });
});

test('before/after', () => {
  // GIVEN
  const stack = new Stack();
  const topic1 = new sns.Topic(stack, 'Topic1');
  const topic2 = new sns.Topic(stack, 'Topic2');
  const topic3 = new sns.Topic(stack, 'Topic3');
  const topic4 = new sns.Topic(stack, 'Topic4');

  // WHEN
  const myTrigger = new triggers.TriggerFunction(stack, 'MyTrigger', {
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromInline('zoo'),
    handler: 'index.handler',

    // through props
    executeAfter: [topic1],
    executeBefore: [topic3],
  });

  // through methods
  myTrigger.executeBefore(topic4);
  myTrigger.executeAfter(topic2);

  // THEN
  const triggerId = 'MyTrigger5A0C728D';
  const topic1Id = 'Topic198E71B3E';
  const topic2Id = 'Topic269377B75';
  const topic3Id = 'Topic3DEAE47A7';
  const topic4Id = 'Topic4F5C0CEE2';

  const template = Template.fromStack(stack);
  const resources = template.toJSON().Resources;

  const dependsOn = (sourceId: string, targetId: string) => {
    expect(resources[sourceId].DependsOn).toContain(targetId);
  };

  dependsOn(triggerId, topic1Id);
  dependsOn(triggerId, topic2Id);
  dependsOn(topic3Id, triggerId);
  dependsOn(topic4Id, triggerId);
});
