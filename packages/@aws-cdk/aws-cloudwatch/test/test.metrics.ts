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

  'cannot use null dimension value'(test: Test) {
    test.throws(() => {
      new Metric({
        namespace: 'Test',
        metricName: 'ACount',
        period: cdk.Duration.minutes(10),
        dimensions: {
          DimensionWithNull: null,
        },
      });
    }, /Dimension value of 'null' is invalid/);

    test.done();
  },

  'cannot use undefined dimension value'(test: Test) {
    test.throws(() => {
      new Metric({
        namespace: 'Test',
        metricName: 'ACount',
        period: cdk.Duration.minutes(10),
        dimensions: {
          DimensionWithUndefined: undefined,
        },
      });
    }, /Dimension value of 'undefined' is invalid/);

    test.done();
  },

  'cannot use long dimension values'(test: Test) {
    const arr = new Array(256);
    const invalidDimensionValue = arr.fill('A', 0).join('');

    test.throws(() => {
      new Metric({
        namespace: 'Test',
        metricName: 'ACount',
        period: cdk.Duration.minutes(10),
        dimensions: {
          DimensionWithLongValue: invalidDimensionValue,
        },
      });
    }, `Dimension value must be at least 1 and no more than 255 characters; received ${invalidDimensionValue}`);

    test.done();
  },

  'throws error when there are more than 10 dimensions'(test: Test) {
    test.throws(() => {
      new Metric({
        namespace: 'Test',
        metricName: 'ACount',
        period: cdk.Duration.minutes(10),
        dimensions: {
          dimensionA: 'value1',
          dimensionB: 'value2',
          dimensionC: 'value3',
          dimensionD: 'value4',
          dimensionE: 'value5',
          dimensionF: 'value6',
          dimensionG: 'value7',
          dimensionH: 'value8',
          dimensionI: 'value9',
          dimensionJ: 'value10',
          dimensionK: 'value11',
        },
      } );
    }, /The maximum number of dimensions is 10, received 11/);

    test.done();
  },
};
