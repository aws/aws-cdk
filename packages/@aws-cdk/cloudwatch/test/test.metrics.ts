import { Anyone, Stack } from '@aws-cdk/cdk';
import { expect, haveResource } from '@aws-cdk/cdk-assert';
import { Role } from '@aws-cdk/iam';
import { Test } from 'nodeunit';
import { Metric } from '../lib';

export = {
    'metric grant'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const role = new Role(stack, 'SomeRole', {
            assumedBy: new Anyone()
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
