import { ABSENT, countResources, expect, haveResource } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { LogRetention } from '../lib/log-retention';

// tslint:disable:object-literal-key-quotes

export = {
  'log retention construct'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new LogRetention(stack, 'MyLambda', {
      logGroupName: 'group',
      retention: logs.RetentionDays.ONE_MONTH,
    });

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': [
          {
            'Action': [
              'logs:PutRetentionPolicy',
              'logs:DeleteRetentionPolicy',
            ],
            'Effect': 'Allow',
            'Resource': '*',
          },
        ],
        'Version': '2012-10-17',
      },
      'PolicyName': 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
      'Roles': [
        {
          'Ref': 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
        },
      ],
    }));

    expect(stack).to(haveResource('Custom::LogRetention', {
      'ServiceToken': {
        'Fn::GetAtt': [
          'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
          'Arn',
        ],
      },
      'LogGroupName': 'group',
      'RetentionInDays': 30,
    }));

    test.done();

  },

  'with imported role'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/CoolRole');

    // WHEN
    new LogRetention(stack, 'MyLambda', {
      logGroupName: 'group',
      retention: logs.RetentionDays.ONE_MONTH,
      role,
    });

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': [
          {
            'Action': [
              'logs:PutRetentionPolicy',
              'logs:DeleteRetentionPolicy',
            ],
            'Effect': 'Allow',
            'Resource': '*',
          },
        ],
        'Version': '2012-10-17',
      },
      'PolicyName': 'RolePolicy72E7D967',
      'Roles': [
        'CoolRole',
      ],
    }));

    expect(stack).to(countResources('AWS::IAM::Role', 0));

    test.done();

  },

  'with RetentionPeriod set to Infinity'(test: Test) {
    const stack = new cdk.Stack();

    new LogRetention(stack, 'MyLambda', {
      logGroupName: 'group',
      retention: logs.RetentionDays.INFINITE,
    });

    expect(stack).to(haveResource('Custom::LogRetention', {
      RetentionInDays: ABSENT,
    }));

    test.done();
  },

  'log group ARN is well formed and conforms'(test: Test) {
    const stack = new cdk.Stack();
    const group = new LogRetention(stack, 'MyLambda', {
      logGroupName: 'group',
      retention: logs.RetentionDays.ONE_MONTH,
    });

    const logGroupArn = group.logGroupArn;
    test.ok(logGroupArn.indexOf('logs') > -1, 'log group ARN is not as expected');
    test.ok(logGroupArn.indexOf('log-group') > -1, 'log group ARN is not as expected');
    test.ok(logGroupArn.endsWith(':*'), 'log group ARN is not as expected');
    test.done();
  },
};
