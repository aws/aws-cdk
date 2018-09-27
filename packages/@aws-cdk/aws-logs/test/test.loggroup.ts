import { expect, haveResource, matchTemplate } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { LogGroup, LogGroupRef } from '../lib';

export = {
  'fixed retention'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      retentionDays: 7
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
      RetentionInDays: 730
    }));

    test.done();
  },

  'infinite retention/dont delete log group by default'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new LogGroup(stack, 'LogGroup', {
      retentionDays: Infinity
    });

    // THEN
    expect(stack).to(matchTemplate({
      Resources: {
        LogGroupF5B46931: {
          Type: "AWS::Logs::LogGroup",
          DeletionPolicy: "Retain"
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
      retentionDays: Infinity,
      retainLogGroup: false
    });

    // THEN
    expect(stack).to(matchTemplate({
      Resources: {
        LogGroupF5B46931: { Type: "AWS::Logs::LogGroup" }
        }
    }));

    test.done();
  },

  'export/import'(test: Test) {
    // GIVEN
    const stack1 = new Stack();
    const lg = new LogGroup(stack1, 'LogGroup');
    const stack2 = new Stack();

    // WHEN
    const imported = LogGroupRef.import(stack2, 'Import', lg.export());
    imported.newStream(stack2, 'MakeMeAStream');

    // THEN
    expect(stack2).to(haveResource('AWS::Logs::LogStream', {}));

    test.done();
  },

  'extractMetric'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const lg = new LogGroup(stack, 'LogGroup');

    // WHEN
    lg.extractMetric('$.myField', 'MyService', 'Field');

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

    test.done();
  }

};
