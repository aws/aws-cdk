import { expect, haveResource, matchTemplate } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { CfnParameter, RemovalPolicy, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { LogGroup, RetentionDays } from '../lib';

export = {
  'set kms key when provided'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const encryptionKey = new kms.Key(stack, 'Key');

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      encryptionKey,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Logs::LogGroup', {
      KmsKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },

    }));

    test.done();
  },

  'fixed retention'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      retention: RetentionDays.ONE_WEEK,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Logs::LogGroup', {
      RetentionInDays: 7,
    }));

    test.done();
  },

  'default retention'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new LogGroup(stack, 'LogGroup');

    // THEN
    expect(stack).to(haveResource('AWS::Logs::LogGroup', {
      RetentionInDays: 731,
    }));

    test.done();
  },

  'infinite retention/dont delete log group by default'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      retention: RetentionDays.INFINITE,
    });

    // THEN
    expect(stack).to(matchTemplate({
      Resources: {
        LogGroupF5B46931: {
          Type: 'AWS::Logs::LogGroup',
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
      },
    }));

    test.done();
  },

  'infinite retention via legacy method'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      // Don't know why TypeScript doesn't complain about passing Infinity to
      // something where an enum is expected, but better keep this behavior for
      // existing clients.
      retention: Infinity,
    });

    // THEN
    expect(stack).to(matchTemplate({
      Resources: {
        LogGroupF5B46931: {
          Type: 'AWS::Logs::LogGroup',
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
      },
    }));

    test.done();
  },

  'unresolved retention'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const parameter = new CfnParameter(stack, 'RetentionInDays', { default: 30, type: 'Number' });

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      retention: parameter.valueAsNumber,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Logs::LogGroup', {
      RetentionInDays: {
        Ref: 'RetentionInDays',
      },
    }));

    test.done();
  },

  'will delete log group if asked to'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      retention: Infinity,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // THEN
    expect(stack).to(matchTemplate({
      Resources: {
        LogGroupF5B46931: {
          Type: 'AWS::Logs::LogGroup',
          DeletionPolicy: 'Delete',
          UpdateReplacePolicy: 'Delete',
        },
      },
    }));

    test.done();
  },

  'import from arn'(test: Test) {
    // GIVEN
    const stack2 = new Stack();

    // WHEN
    const imported = LogGroup.fromLogGroupArn(stack2, 'lg', 'arn:aws:logs:us-east-1:123456789012:log-group:my-log-group');
    imported.addStream('MakeMeAStream');

    // THEN
    test.deepEqual(imported.logGroupName, 'my-log-group');
    test.deepEqual(imported.logGroupArn, 'arn:aws:logs:us-east-1:123456789012:log-group:my-log-group:*');
    expect(stack2).to(haveResource('AWS::Logs::LogStream', {
      LogGroupName: 'my-log-group',
    }));
    test.done();
  },

  'import from name'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const imported = LogGroup.fromLogGroupName(stack, 'lg', 'my-log-group');
    imported.addStream('MakeMeAStream');

    // THEN
    test.deepEqual(imported.logGroupName, 'my-log-group');
    test.ok(/^arn:.+:logs:.+:.+:log-group:my-log-group:\*$/.test(imported.logGroupArn),
      `LogGroup ARN ${imported.logGroupArn} does not match the expected pattern`);
    expect(stack).to(haveResource('AWS::Logs::LogStream', {
      LogGroupName: 'my-log-group',
    }));
    test.done();
  },

  'loggroups imported by name have stream wildcard appended to grant ARN': dataDrivenTests([
    // Regardless of whether the user put :* there already because of this bug, we
    // don't want to append it twice.
    [''],
    [':*'],
  ], (test: Test, suffix: string) => {
    // GIVEN
    const stack = new Stack();
    const user = new iam.User(stack, 'Role');
    const imported = LogGroup.fromLogGroupName(stack, 'lg', `my-log-group${suffix}`);

    // WHEN
    imported.grantWrite(user);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':logs:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':log-group:my-log-group:*',
              ]],
            },
          },
        ],
      },
    }));
    test.equal(imported.logGroupName, 'my-log-group');

    test.done();
  }),

  'loggroups imported by ARN have stream wildcard appended to grant ARN': dataDrivenTests([
    // Regardless of whether the user put :* there already because of this bug, we
    // don't want to append it twice.
    [''],
    [':*'],
  ], (test: Test, suffix: string) => {
    // GIVEN
    const stack = new Stack();
    const user = new iam.User(stack, 'Role');
    const imported = LogGroup.fromLogGroupArn(stack, 'lg', `arn:aws:logs:us-west-1:123456789012:log-group:my-log-group${suffix}`);

    // WHEN
    imported.grantWrite(user);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
            Effect: 'Allow',
            Resource: 'arn:aws:logs:us-west-1:123456789012:log-group:my-log-group:*',
          },
        ],
      },
    }));
    test.equal(imported.logGroupName, 'my-log-group');

    test.done();
  }),

  'extractMetric'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const lg = new LogGroup(stack, 'LogGroup');

    // WHEN
    const metric = lg.extractMetric('$.myField', 'MyService', 'Field');

    // THEN
    expect(stack).to(haveResource('AWS::Logs::MetricFilter', {
      FilterPattern: '{ $.myField = "*" }',
      LogGroupName: { Ref: 'LogGroupF5B46931' },
      MetricTransformations: [
        {
          MetricName: 'Field',
          MetricNamespace: 'MyService',
          MetricValue: '$.myField',
        },
      ],
    }));
    test.equal(metric.namespace, 'MyService');
    test.equal(metric.metricName, 'Field');

    test.done();
  },

  'extractMetric allows passing in namespaces with "/"'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const lg = new LogGroup(stack, 'LogGroup');

    // WHEN
    const metric = lg.extractMetric('$.myField', 'MyNamespace/MyService', 'Field');

    // THEN
    expect(stack).to(haveResource('AWS::Logs::MetricFilter', {
      FilterPattern: '{ $.myField = "*" }',
      MetricTransformations: [
        {
          MetricName: 'Field',
          MetricNamespace: 'MyNamespace/MyService',
          MetricValue: '$.myField',
        },
      ],
    }));
    test.equal(metric.namespace, 'MyNamespace/MyService');
    test.equal(metric.metricName, 'Field');

    test.done();
  },

  'grant'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const lg = new LogGroup(stack, 'LogGroup');
    const user = new iam.User(stack, 'User');

    // WHEN
    lg.grantWrite(user);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': ['LogGroupF5B46931', 'Arn'] },
          },
        ],
        Version: '2012-10-17',
      },
    }));

    test.done();
  },
};

function dataDrivenTests(cases: any[][], body: (test: Test, ...args: any[]) => void) {
  const ret: any = {};
  for (let i = 0; i < cases.length; i++) {
    const args = cases[i]; // Need to capture inside loop for safe use inside closure.
    ret[`case ${i + 1}`] = function(test: Test) {
      return body.apply(this, [test, ...args]);
    };
  }
  return ret;
}
