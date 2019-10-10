import { expect, haveResource } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import { Metric } from '../lib';

export = {
  'metric grant'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'SomeRole', {
      assumedBy: new iam.Anyone()
    });

    // WHEN
    Metric.grantPutMetricData(role);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "cloudwatch:PutMetricData",
            Effect: "Allow",
            Resource: "*"
          }
        ],
        },
    }));

    test.done();
  }
};
