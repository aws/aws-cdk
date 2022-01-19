import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { LogGroup, LogStream } from '../lib';

describe('log stream', () => {
  test('simple instantiation', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'LogGroup');

    new LogStream(stack, 'Stream', {
      logGroup,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogStream', { });
  });
});
