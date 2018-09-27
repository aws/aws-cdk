import { expect, haveResource } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { Metric } from '../lib';

export = {
  'metric grant'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'SomeRole', {
      assumedBy: new cdk.Anyone()
    });

    // WHEN
    Metric.grantPutMetricData(role);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
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
