import { expect, haveResource, matchTemplate } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import { RemovalPolicy, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { LogGroup, RetentionDays } from '../lib';

export = {
  'fixed retention'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      retention: RetentionDays.ONE_WEEK
    });

    // THEN
    expect(stack).to(haveResource('AWS::Logs::LogGroup', {
      RetentionInDays: 7
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
      RetentionInDays: 731
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
          Type: "AWS::Logs::LogGroup",
          DeletionPolicy: "Retain",
          UpdateReplacePolicy: "Retain"
        }
      }
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
      retention: Infinity
    });

    // THEN
    expect(stack).to(matchTemplate({
      Resources: {
        LogGroupF5B46931: {
          Type: "AWS::Logs::LogGroup",
          DeletionPolicy: "Retain",
          UpdateReplacePolicy: "Retain"
        }
      }
    }));

    test.done();
  },

  'will delete log group if asked to'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      retention: Infinity,
      removalPolicy: RemovalPolicy.DESTROY
    });

    // THEN
    expect(stack).to(matchTemplate({
      Resources: {
        LogGroupF5B46931: {
          Type: "AWS::Logs::LogGroup",
          DeletionPolicy: "Delete",
          UpdateReplacePolicy: "Delete"
        }
      }
    }));

    test.done();
  },

  'export/import'(test: Test) {
    // GIVEN
    const stack2 = new Stack();

    // WHEN
    const imported = LogGroup.fromLogGroupArn(stack2, 'lg', 'arn:aws:logs:us-east-1:123456789012:log-group:my-log-group:*');
    imported.addStream('MakeMeAStream');

    // THEN
    expect(stack2).to(haveResource('AWS::Logs::LogStream', {
      LogGroupName: "my-log-group"
    }));
    test.done();
  },

  'extractMetric'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const lg = new LogGroup(stack, 'LogGroup');

    // WHEN
    const metric = lg.extractMetric('$.myField', 'MyService', 'Field');

    // THEN
    expect(stack).to(haveResource('AWS::Logs::MetricFilter', {
      FilterPattern: "{ $.myField = \"*\" }",
      LogGroupName: { Ref: "LogGroupF5B46931" },
      MetricTransformations: [
        {
        MetricName: "Field",
        MetricNamespace: "MyService",
        MetricValue: "$.myField"
        }
      ]
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
      FilterPattern: "{ $.myField = \"*\" }",
      MetricTransformations: [
        {
          MetricName: "Field",
          MetricNamespace: "MyNamespace/MyService",
          MetricValue: "$.myField"
        }
      ]
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
            Action: [ "logs:CreateLogStream", "logs:PutLogEvents" ],
            Effect: "Allow",
            Resource: { "Fn::GetAtt": [ "LogGroupF5B46931", "Arn" ] }
          }
        ],
        Version: "2012-10-17"
      }
    }));

    test.done();
  },
};
