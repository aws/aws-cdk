import { Template } from '../../../assertions';
import * as events from '../../../aws-events';
import * as secretsmanager from '../../../aws-secretsmanager';
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

      test('assigns the database to the RedshiftQuery', () => {
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

    describe('with explicity set SQL statements', () => {
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

    describe('with secrets manager', () => {
      test('adding a secrets manager secret to the target', () => {
        // GIVEN
        const secret = new secretsmanager.Secret(stack, 'Secret');

        // WHEN
        rule.addTarget(new targets.RedshiftQuery(clusterArn, {
          database: 'dev',
          sql: 'SELECT * FROM foo',
          secret,
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
                SecretManagerArn: { Ref: 'SecretA720EF05' },
              },
            },
          ],
        });
      });

      test('adding an imported secrets manager secret to the target, that does not have `secretFullArn` set', () => {
        // GIVEN
        const secret = secretsmanager.Secret.fromSecretNameV2(stack, 'Secret', 'my-secret');

        // WHEN
        rule.addTarget(new targets.RedshiftQuery(clusterArn, {
          database: 'dev',
          sql: 'SELECT * FROM foo',
          secret,
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
                SecretManagerArn: 'my-secret',
              },
            },
          ],
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
    });
  });
});

