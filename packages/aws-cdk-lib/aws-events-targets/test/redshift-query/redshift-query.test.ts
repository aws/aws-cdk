import { Template } from '../../../assertions';
import * as events from '../../../aws-events';
import * as redshiftserverless from '../../../aws-redshiftserverless';
import { Stack } from '../../../core';
import * as targets from '../../lib';

describe('RedshiftQuery event target', () => {
  let stack: Stack;
  let clusterArn: string;

  beforeEach(() => {
    stack = new Stack();
    clusterArn = 'arn:aws:redshift:us-west-2:123456789012:cluster:my-cluster';
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
        rule.addTarget(new targets.RedshiftQuery(clusterArn, {
          database: 'dev',
          sql: 'SELECT * FROM foo',
        }));
      });

      test('adds the clusters ARN and role to the targets of the rule', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
          Targets: [
            {
              Arn: clusterArn,
              Id: 'Target0',
              RoleArn: { 'Fn::GetAtt': ['ruleEventsRole7F0DD2EE', 'Arn'] },
            },
          ],
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
      test('sets the SQL statement', () => {
        // GIVEN
        rule.addTarget(new targets.RedshiftQuery(clusterArn, {
          database: 'dev',
          sql: 'SELECT * FROM foo',
        }));

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
          Targets: [
            {
              Arn: clusterArn,
              Id: 'Target0',
              RedshiftDataParameters: {
                Database: 'dev',
                Sql: 'SELECT * FROM foo',
              },
            },
          ],
        });
      });

      test('sets the batch SQL statements', () => {
        // GIVEN
        rule.addTarget(new targets.RedshiftQuery(clusterArn, {
          database: 'dev',
          batchSQL: ['SELECT * FROM foo', 'SELECT * FROM bar'],
        }));

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
          Targets: [
            {
              Arn: clusterArn,
              Id: 'Target0',
              RedshiftDataParameters: {
                Database: 'dev',
                Sqls: ['SELECT * FROM foo', 'SELECT * FROM bar'],
              },
            },
          ],
        });
      });

      test('creates a policy that has ExecuteStatement permission on the clusters ARN', () => {
        // GIVEN
        rule.addTarget(new targets.RedshiftQuery(clusterArn, {
          database: 'dev',
          sql: 'SELECT * FROM foo',
        }));

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              {
                Action: 'redshift-data:ExecuteStatement',
                Effect: 'Allow',
                Resource: clusterArn,
              },
            ],
            Version: '2012-10-17',
          },
        });
      });

      test('creates a policy that has BatchExecuteStatement permission on the clusters ARN', () => {
        // GIVEN
        rule.addTarget(new targets.RedshiftQuery(clusterArn, {
          database: 'dev',
          batchSQL: ['SELECT * FROM foo', 'SELECT * FROM bar'],
        }));

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              {
                Action: 'redshift-data:BatchExecuteStatement',
                Effect: 'Allow',
                Resource: clusterArn,
              },
            ],
            Version: '2012-10-17',
          },
        });
      });
    });

    describe('failures', () => {
      test('throws an error if neither sql nor batchSQL is specified', () => {
        expect(() => {
          rule.addTarget(new targets.RedshiftQuery(clusterArn, {
            database: 'dev',
          }));
        }).toThrow(/One of `sql` or `batchSQL` must be specified./);
      });

      test('throws an error if both sql and batchSQL are specified', () => {
        // THEN
        expect(() => {
          rule.addTarget(new targets.RedshiftQuery(clusterArn, {
            database: 'dev',
            sql: 'SELECT * FROM foo',
            batchSQL: ['SELECT * FROM foo', 'SELECT * FROM bar'],
          }));
        }).toThrow(/Only one of `sql` or `batchSQL` can be specified, not both./);
      });

      test('throws an error if a database is not specified', () => {
        expect(() => {
          rule.addTarget(new targets.RedshiftQuery(clusterArn, {
            sql: 'SELECT * FROM foo',
          }));
        }).toThrow(/A database must be specified./);
      });
    });
  });
});

