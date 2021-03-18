import { expect, haveResource } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Metric } from '../lib';

export = {
  'metric grant'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'SomeRole', {
      assumedBy: new iam.AnyPrincipal(),
    });

    // WHEN
    Metric.grantPutMetricData(role);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'cloudwatch:PutMetricData',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    }));

    test.done();
  },

  'can not use invalid period in Metric'(test: Test) {
    test.throws(() => {
      new Metric({ namespace: 'Test', metricName: 'ACount', period: cdk.Duration.seconds(20) });
    }, /'period' must be 1, 5, 10, 30, or a multiple of 60 seconds, received 20/);

    test.done();
  },

  'Metric optimization: "with" with the same period returns the same object'(test: Test) {
    const m = new Metric({ namespace: 'Test', metricName: 'Metric', period: cdk.Duration.minutes(10) });

    // Note: object equality, NOT deep equality on purpose
    test.equals(m.with({}), m);
    test.equals(m.with({ period: cdk.Duration.minutes(10) }), m);

    test.notEqual(m.with({ period: cdk.Duration.minutes(5) }), m);

    test.done();
  },
};
