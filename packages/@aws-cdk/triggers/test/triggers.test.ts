import { Template } from '@aws-cdk/assertions';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import { Duration, Stack } from '@aws-cdk/core';
import * as triggers from '../lib';

test('minimal trigger function', () => {
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
    HandlerArn: { Ref: 'MyTriggerCurrentVersion8802742B555ea1a8a066d494bd9b85921db605fb' },
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

test('multiple functions', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new triggers.TriggerFunction(stack, 'MyTrigger', {
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromInline('foo'),
  });

  new triggers.TriggerFunction(stack, 'MySecondTrigger', {
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromInline('bar'),
  });

  // THEN
  const template = Template.fromStack(stack);
  const roles = template.findResources('AWS::IAM::Role');
  const triggerIamRole = roles.AWSCDKTriggerCustomResourceProviderCustomResourceProviderRoleE18FAF0A;
  expect(triggerIamRole.Properties.Policies[0].PolicyDocument.Statement.length).toBe(2);
});

test('minimal trigger', () => {
  // GIVEN
  const stack = new Stack();
  const func = new lambda.Function(stack, 'MyFunction', {
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromInline('foo'),
  });

  // WHEN
  new triggers.Trigger(stack, 'MyTrigger', {
    handler: func,
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Lambda::Function', {});
  template.hasResourceProperties('Custom::Trigger', {
    HandlerArn: { Ref: 'MyFunctionCurrentVersion197490AF2e4e06d52af2bb609d8c23243d665966' },
  });
});

test('trigger with optional properties', () => {
  // GIVEN
  const stack = new Stack();
  const func = new lambda.Function(stack, 'MyFunction', {
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromInline('foo'),
  });

  // WHEN
  new triggers.Trigger(stack, 'MyTrigger', {
    handler: func,
    timeout: Duration.minutes(10),
    invocationType: 'Event',
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Lambda::Function', {});
  template.hasResourceProperties('Custom::Trigger', {
    HandlerArn: { Ref: 'MyFunctionCurrentVersion197490AF2e4e06d52af2bb609d8c23243d665966' },
    Timeout: 600000,
    InvocationType: 'Event',
  });
});
