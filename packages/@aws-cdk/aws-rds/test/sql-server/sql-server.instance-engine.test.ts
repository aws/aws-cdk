import '@aws-cdk/assert-internal/jest';
import * as core from '@aws-cdk/core';
import * as rds from '../../lib';

describe('sql server instance engine', () => {
  describe('SQL Server instance engine', () => {
    test("has ParameterGroup family ending in '11.0' for major version 11", () => {
      const stack = new core.Stack();
      new rds.ParameterGroup(stack, 'ParameterGroup', {
        engine: rds.DatabaseInstanceEngine.sqlServerWeb({
          version: rds.SqlServerEngineVersion.VER_11,
        }),
      }).bindToInstance({});

      expect(stack).toHaveResourceLike('AWS::RDS::DBParameterGroup', {
        Family: 'sqlserver-web-11.0',
      });


    });

    test("has MajorEngineVersion ending in '11.00' for major version 11", () => {
      const stack = new core.Stack();
      new rds.OptionGroup(stack, 'OptionGroup', {
        engine: rds.DatabaseInstanceEngine.sqlServerWeb({
          version: rds.SqlServerEngineVersion.VER_11,
        }),
        configurations: [
          {
            name: 'SQLSERVER_BACKUP_RESTORE',
            settings: {
              IAM_ROLE_ARN: 'some-role-arn',
            },
          },
        ],
      });

      expect(stack).toHaveResourceLike('AWS::RDS::OptionGroup', {
        MajorEngineVersion: '11.00',
      });


    });
  });
});
