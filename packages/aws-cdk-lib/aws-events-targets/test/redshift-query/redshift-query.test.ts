import { Template } from '../../../assertions';
import * as events from '../../../aws-events';
import { Stack } from '../../../core';
import * as targets from '../../lib';

describe('KinesisFirehoseStream event target', () => {
  let stack: Stack;
  let clusterArn: string;
  let streamArn: any;

  beforeEach(() => {
    stack = new Stack();
    clusterArn = 'arn:aws:redshift:us-west-2:123456789012:cluster:my-cluster';
    streamArn = { 'Fn::GetAtt': ['MyStream', 'Arn'] };
  });

  describe('when added to an event rule as a target', () => {
    let rule: events.Rule;

    beforeEach(() => {
      rule = new events.Rule(stack, 'rule', {
        schedule: events.Schedule.expression('rate(1 minute)'),
      });
    });

    describe('with default settings', () => {
      beforeEach(() => {
        rule.addTarget(new targets.RedshiftQuery(clusterArn));
      });

      test('adds the clusters ARN and role to the targets of the rule', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
          Targets: [
            {
              Arn: clusterArn,
              Id: 'Target0',
              RoleArn: { 'Fn::GetAtt': ['MyClusterEventsRole5B6CC6AF', 'Arn'] },
            },
          ],
        });
      });

      test('creates a policy that has ExecuteStatement permission on the clusters ARN', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              {
                Action: ['redshift:ExecuteStatement'],
                Effect: 'Allow',
                Resource: clusterArn,
              },
            ],
            Version: '2012-10-17',
          },
        });
      });

      test('assigns the `dev` database to the RedshiftQuery', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
          Targets: [
            {
              RedshiftDataParameters: {
                Database: 'dev',
              },
            },
          ],
        });
      });
    });

    describe('with explicity SQL statements', () => {
      beforeEach(() => {
        rule.addTarget(new targets.RedshiftQuery(clusterArn, {
          sql: 'SELECT * FROM foo',
          batchSQL: ['SELECT * FROM foo', 'SELECT * FROM bar'],
        }));
      });

      test('sets the SQL statements', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
          Targets: [
            {
              Arn: streamArn,
              Id: 'Target0',
              RedshiftDataParameters: {
                Database: 'dev',
                Sql: 'SELECT * FROM foo',
                Sqls: ['SELECT * FROM foo', 'SELECT * FROM bar'],
              },
            },
          ],
        });
      });
    });
  });
});

