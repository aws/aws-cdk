import { expect } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { TopicRule } from '../lib';

nodeunitShim({
  'can create topic rules'(test: Test) {
    // GIVEN
    const stack = new Stack();
    // WHEN
    new TopicRule(stack, 'IotTopicRule', {
      sql: 'SELECT * FROM \'topic/subtopc\'',
    });

    // THEN
    expect(stack).toMatch({});
    test.done();
  },
});

