import { Duration } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { calculateRetryPolicy } from '../lib/util';

export = {
  'retry policy': {
    'default is 30 minutes timeout in 5 second intervals'(test: Test) {
      const policy = calculateRetryPolicy();
      test.deepEqual(policy.backoffRate, 1);
      test.deepEqual(policy.interval && policy.interval.toSeconds(), 5);
      test.deepEqual(policy.maxAttempts, 360);
      test.done();
    },

    'if total timeout and query interval are the same we will have one attempt'(test: Test) {
      const policy = calculateRetryPolicy({
        totalTimeout: Duration.minutes(5),
        queryInterval: Duration.minutes(5)
      });

      test.deepEqual(policy.maxAttempts, 1);
      test.done();
    },

    'fails if total timeout cannot be integrally divided'(test: Test) {
      test.throws(() => calculateRetryPolicy({
        totalTimeout: Duration.seconds(100),
        queryInterval: Duration.seconds(75)
      }), /Cannot determine retry count since totalTimeout=100s is not integrally dividable by queryInterval=75s/);
      test.done();
    },

    'fails if interval > timeout'(test: Test) {
      test.throws(() => calculateRetryPolicy({
        totalTimeout: Duration.seconds(5),
        queryInterval: Duration.seconds(10)
      }), /Cannot determine retry count since totalTimeout=5s is not integrally dividable by queryInterval=10s/);
      test.done();
    }
  }
};