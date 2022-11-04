import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as rds from '../lib';

describe('instance engine', () => {
  test('default parameterGroupFamily for versionless MariaDB instance engine is not defined', () => {
    const engine = rds.DatabaseInstanceEngine.MARIADB;

    const family = engine.parameterGroupFamily;

    expect(family).toEqual(undefined);
  });

  test('default parameterGroupFamily for versionless MySQL instance engine is not defined', () => {
    const engine = rds.DatabaseInstanceEngine.MYSQL;

    const family = engine.parameterGroupFamily;

    expect(family).toEqual(undefined);
  });

  test('default parameterGroupFamily for versionless PostgreSQL instance engine is not defined', () => {
    const engine = rds.DatabaseInstanceEngine.POSTGRES;

    const family = engine.parameterGroupFamily;

    expect(family).toEqual(undefined);
  });

  test("default parameterGroupFamily for versionless Oracle SE instance engine is 'oracle-se-11.2'", () => {
    const engine = rds.DatabaseInstanceEngine.ORACLE_SE;

    const family = engine.parameterGroupFamily;

    expect(family).toEqual('oracle-se-11.2');
  });

  test("default parameterGroupFamily for versionless Oracle SE 1 instance engine is 'oracle-se1-11.2'", () => {
    const engine = rds.DatabaseInstanceEngine.ORACLE_SE1;

    const family = engine.parameterGroupFamily;

    expect(family).toEqual('oracle-se1-11.2');
  });

  test('default parameterGroupFamily for versionless Oracle SE 2 instance engine is not defined', () => {
    const engine = rds.DatabaseInstanceEngine.ORACLE_SE2;

    const family = engine.parameterGroupFamily;

    expect(family).toEqual(undefined);
  });

  test('default parameterGroupFamily for versionless Oracle SE 2 (CDB) instance engine is not defined', () => {
    const engine = rds.DatabaseInstanceEngine.ORACLE_SE2_CDB;

    const family = engine.parameterGroupFamily;

    expect(family).toEqual(undefined);
  });

  test('default parameterGroupFamily for versionless Oracle EE instance engine is not defined', () => {
    const engine = rds.DatabaseInstanceEngine.ORACLE_EE;

    const family = engine.parameterGroupFamily;

    expect(family).toEqual(undefined);
  });

  test('default parameterGroupFamily for versionless Oracle EE (CDB) instance engine is not defined', () => {
    const engine = rds.DatabaseInstanceEngine.ORACLE_EE_CDB;

    const family = engine.parameterGroupFamily;

    expect(family).toEqual(undefined);
  });

  test('default parameterGroupFamily for versionless SQL Server SE instance engine is not defined', () => {
    const engine = rds.DatabaseInstanceEngine.SQL_SERVER_SE;

    const family = engine.parameterGroupFamily;

    expect(family).toEqual(undefined);
  });

  test('default parameterGroupFamily for versionless SQL Server EX instance engine is not defined', () => {
    const engine = rds.DatabaseInstanceEngine.SQL_SERVER_EX;

    const family = engine.parameterGroupFamily;

    expect(family).toEqual(undefined);
  });

  test('default parameterGroupFamily for versionless SQL Server Web instance engine is not defined', () => {
    const engine = rds.DatabaseInstanceEngine.SQL_SERVER_WEB;

    const family = engine.parameterGroupFamily;

    expect(family).toEqual(undefined);
  });

  test('default parameterGroupFamily for versionless SQL Server EE instance engine is not defined', () => {
    const engine = rds.DatabaseInstanceEngine.SQL_SERVER_EE;

    const family = engine.parameterGroupFamily;

    expect(family).toEqual(undefined);
  });

  describe('Oracle engine bindToInstance', () => {

    test('returns s3 integration feature', () => {
      const engine = rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 });

      const engineConfig = engine.bindToInstance(new cdk.Stack(), {});
      expect(engineConfig.features?.s3Import).toEqual('S3_INTEGRATION');
      expect(engineConfig.features?.s3Export).toEqual('S3_INTEGRATION');
    });

    test('s3 import/export - creates an option group if needed', () => {
      const stack = new cdk.Stack();
      const engine = rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 });

      const engineConfig = engine.bindToInstance(stack, {
        optionGroup: undefined,
        s3ImportRole: new iam.Role(stack, 'ImportRole', { assumedBy: new iam.AccountRootPrincipal() }),
      });

      expect(engineConfig.optionGroup).toBeDefined();
      Template.fromStack(stack).hasResourceProperties('AWS::RDS::OptionGroup', {
        EngineName: 'oracle-se2',
        OptionConfigurations: [{
          OptionName: 'S3_INTEGRATION',
          OptionVersion: '1.0',
        }],
      });
    });

    test('s3 import/export - appends to an existing option group if it exists', () => {
      const stack = new cdk.Stack();
      const engine = rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 });
      const optionGroup = new rds.OptionGroup(stack, 'OptionGroup', {
        engine,
        configurations: [{
          name: 'MY_OPTION_CONFIG',
        }],
      });

      const engineConfig = engine.bindToInstance(stack, {
        optionGroup,
        s3ImportRole: new iam.Role(stack, 'ImportRole', { assumedBy: new iam.AccountRootPrincipal() }),
      });

      expect(engineConfig.optionGroup).toEqual(optionGroup);
      Template.fromStack(stack).hasResourceProperties('AWS::RDS::OptionGroup', {
        EngineName: 'oracle-se2',
        OptionConfigurations: [{
          OptionName: 'MY_OPTION_CONFIG',
        },
        {
          OptionName: 'S3_INTEGRATION',
          OptionVersion: '1.0',
        }],
      });
    });
  });

  describe('SQL Server engine bindToInstance', () => {
    test('returns s3 integration feature', () => {
      const engine = rds.DatabaseInstanceEngine.sqlServerSe({ version: rds.SqlServerEngineVersion.VER_14_00_3192_2_V1 });

      const engineConfig = engine.bindToInstance(new cdk.Stack(), {});
      expect(engineConfig.features?.s3Import).toEqual('S3_INTEGRATION');
      expect(engineConfig.features?.s3Export).toEqual('S3_INTEGRATION');
    });

    test('s3 import/export - throws if roles are not equal', () => {
      const stack = new cdk.Stack();
      const engine = rds.DatabaseInstanceEngine.sqlServerSe({ version: rds.SqlServerEngineVersion.VER_14_00_3192_2_V1 });

      const s3ImportRole = new iam.Role(stack, 'ImportRole', { assumedBy: new iam.AccountRootPrincipal() });
      const s3ExportRole = new iam.Role(stack, 'ExportRole', { assumedBy: new iam.AccountRootPrincipal() });

      expect(() => engine.bindToInstance(new cdk.Stack(), { s3ImportRole, s3ExportRole })).toThrow(/S3 import and export roles must be the same/);
      expect(() => engine.bindToInstance(new cdk.Stack(), { s3ImportRole })).not.toThrow();
      expect(() => engine.bindToInstance(new cdk.Stack(), { s3ExportRole })).not.toThrow();
      expect(() => engine.bindToInstance(new cdk.Stack(), { s3ImportRole, s3ExportRole: s3ImportRole })).not.toThrow();
    });

    test('s3 import/export - creates an option group if needed', () => {
      const stack = new cdk.Stack();
      const engine = rds.DatabaseInstanceEngine.sqlServerSe({ version: rds.SqlServerEngineVersion.VER_14_00_3192_2_V1 });

      const engineConfig = engine.bindToInstance(stack, {
        optionGroup: undefined,
        s3ImportRole: new iam.Role(stack, 'ImportRole', { assumedBy: new iam.AccountRootPrincipal() }),
      });

      expect(engineConfig.optionGroup).toBeDefined();
      Template.fromStack(stack).hasResourceProperties('AWS::RDS::OptionGroup', {
        EngineName: 'sqlserver-se',
        OptionConfigurations: [{
          OptionName: 'SQLSERVER_BACKUP_RESTORE',
          OptionSettings: [{
            Name: 'IAM_ROLE_ARN',
            Value: { 'Fn::GetAtt': ['ImportRole0C9E6F9A', 'Arn'] },
          }],
        }],
      });
    });

    test('s3 import/export - appends to an existing option group if it exists', () => {
      const stack = new cdk.Stack();
      const engine = rds.DatabaseInstanceEngine.sqlServerSe({ version: rds.SqlServerEngineVersion.VER_14_00_3192_2_V1 });
      const optionGroup = new rds.OptionGroup(stack, 'OptionGroup', {
        engine,
        configurations: [{
          name: 'MY_OPTION_CONFIG',
        }],
      });

      const engineConfig = engine.bindToInstance(stack, {
        optionGroup,
        s3ImportRole: new iam.Role(stack, 'ImportRole', { assumedBy: new iam.AccountRootPrincipal() }),
      });

      expect(engineConfig.optionGroup).toEqual(optionGroup);
      Template.fromStack(stack).hasResourceProperties('AWS::RDS::OptionGroup', {
        EngineName: 'sqlserver-se',
        OptionConfigurations: [{
          OptionName: 'MY_OPTION_CONFIG',
        },
        {
          OptionName: 'SQLSERVER_BACKUP_RESTORE',
          OptionSettings: [{
            Name: 'IAM_ROLE_ARN',
            Value: { 'Fn::GetAtt': ['ImportRole0C9E6F9A', 'Arn'] },
          }],
        }],
      });
    });
  });

  describe('PostgreSQL engine bindToInstance', () => {
    test('returns no features for older versions', () => {
      const engineNewerVersion = rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_10_6 });

      const engineConfig = engineNewerVersion.bindToInstance(new cdk.Stack(), {});
      expect(engineConfig.features?.s3Import).toEqual(undefined);
      expect(engineConfig.features?.s3Export).toEqual(undefined);
    });

    test('returns s3 import/export feature if the version supports it', () => {
      const engineNewerVersion = rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_13_3 });

      const engineConfig = engineNewerVersion.bindToInstance(new cdk.Stack(), {});
      expect(engineConfig.features?.s3Import).toEqual('s3Import');
      expect(engineConfig.features?.s3Export).toEqual('s3Export');
    });
  });
});
