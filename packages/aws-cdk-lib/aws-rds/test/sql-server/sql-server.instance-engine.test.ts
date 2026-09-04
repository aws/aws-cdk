import { Template } from '../../../assertions';
import * as core from '../../../core';
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

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBParameterGroup', {
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

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::OptionGroup', {
        MajorEngineVersion: '11.00',
      });
    });

    test("has ParameterGroup family ending in '16.0' for major version 16", () => {
      const stack = new core.Stack();
      new rds.ParameterGroup(stack, 'ParameterGroup', {
        engine: rds.DatabaseInstanceEngine.sqlServerWeb({
          version: rds.SqlServerEngineVersion.VER_16,
        }),
      }).bindToInstance({});

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBParameterGroup', {
        Family: 'sqlserver-web-16.0',
      });
    });

    test("has MajorEngineVersion ending in '16.00' for major version 16", () => {
      const stack = new core.Stack();
      new rds.OptionGroup(stack, 'OptionGroup', {
        engine: rds.DatabaseInstanceEngine.sqlServerWeb({
          version: rds.SqlServerEngineVersion.VER_16,
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

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::OptionGroup', {
        MajorEngineVersion: '16.00',
      });
    });

    test('can create instance with SQL Server 2022 CU23 version', () => {
      const stack = new core.Stack();
      new rds.DatabaseInstance(stack, 'Instance', {
        engine: rds.DatabaseInstanceEngine.sqlServerEx({
          version: rds.SqlServerEngineVersion.VER_16_00_4236_2_V1,
        }),
        vpc: new core.Stack().node.tryGetContext('vpc'),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
        Engine: 'sqlserver-ex',
        EngineVersion: '16.00.4236.2.v1',
      });
    });
  });
});
