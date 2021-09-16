import '@aws-cdk/assert-internal/jest';
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
    expect(stack).toHaveResource('AWS::Logs::LogStream', {
    });


  });
});
