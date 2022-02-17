import { Match, Template } from '@aws-cdk/assertions';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import { Stack } from '@aws-cdk/core';
import * as triggers from '../lib';

test('minimal usage', () => {
  // GIVEN
  const stack = new Stack();
  const triggeringResource = new sns.Topic(stack, 'MyTopic');
  const trigger = new lambda.Function(stack, 'MyTriggerHandler', {
    runtime: lambda.Runtime.NODEJS_12_X,
    code: lambda.Code.fromInline('zoo'),
    handler: 'index.handler',
  });

  // WHEN
  new triggers.Trigger(stack, 'MyTrigger', {
    handler: trigger,
    dependencies: [triggeringResource],
  });

  // THEN
  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  expect(template.hasResourceProperties('Custom::Trigger',
    Match.objectLike({
      HandlerArn: {
        Ref: 'MyTriggerHandlerCurrentVersionC0B6BBD40f3abd954eb77fda7e548d681c7fa667',
      },
    })));

  expect(template.hasResource('Custom::Trigger',
    Match.objectLike({
      DependsOn: ['MyTopic86869434'],
    })));
});
