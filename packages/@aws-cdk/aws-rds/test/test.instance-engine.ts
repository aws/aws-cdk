import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as rds from '../lib';

export = {
  'default parameterGroupFamily for versionless MariaDB instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.MARIADB;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'default parameterGroupFamily for versionless MySQL instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.MYSQL;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'default parameterGroupFamily for versionless PostgreSQL instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.POSTGRES;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  "default parameterGroupFamily for versionless Oracle SE instance engine is 'oracle-se-11.2'"(test: Test) {
    const engine = rds.DatabaseInstanceEngine.ORACLE_SE;

    const family = engine.parameterGroupFamily;

    test.equals(family, 'oracle-se-11.2');

    test.done();
  },

  "default parameterGroupFamily for versionless Oracle SE 1 instance engine is 'oracle-se1-11.2'"(test: Test) {
    const engine = rds.DatabaseInstanceEngine.ORACLE_SE1;

    const family = engine.parameterGroupFamily;

    test.equals(family, 'oracle-se1-11.2');

    test.done();
  },

  'default parameterGroupFamily for versionless Oracle SE 2 instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.ORACLE_SE2;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'default parameterGroupFamily for versionless Oracle EE instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.ORACLE_EE;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'default parameterGroupFamily for versionless SQL Server SE instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.SQL_SERVER_SE;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'default parameterGroupFamily for versionless SQL Server EX instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.SQL_SERVER_EX;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'default parameterGroupFamily for versionless SQL Server Web instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.SQL_SERVER_WEB;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'default parameterGroupFamily for versionless SQL Server EE instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.SQL_SERVER_EE;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'Oracle engine bindToInstance': {

    'returns s3 integration feature'(test: Test) {
      const engine = rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 });

      const engineConfig = engine.bindToInstance(new cdk.Stack(), {});
      test.equals(engineConfig.features?.s3Import, 'S3_INTEGRATION');
      test.equals(engineConfig.features?.s3Export, 'S3_INTEGRATION');

      test.done();
    },

    's3 import/export - creates an option group if needed'(test: Test) {
      const stack = new cdk.Stack();
      const engine = rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 });

      const engineConfig = engine.bindToInstance(stack, {
        optionGroup: undefined,
        s3ImportRole: new iam.Role(stack, 'ImportRole', { assumedBy: new iam.AccountRootPrincipal() }),
      });

      test.ok(engineConfig.optionGroup);
      expect(stack).to(haveResourceLike('AWS::RDS::OptionGroup', {
        EngineName: 'oracle-se2',
        OptionConfigurations: [{
          OptionName: 'S3_INTEGRATION',
          OptionVersion: '1.0',
        }],
      }));

      test.done();
    },

    's3 import/export - appends to an existing option group if it exists'(test: Test) {
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

      test.equals(engineConfig.optionGroup, optionGroup);
      expect(stack).to(haveResourceLike('AWS::RDS::OptionGroup', {
        EngineName: 'oracle-se2',
        OptionConfigurations: [{
          OptionName: 'MY_OPTION_CONFIG',
        },
        {
          OptionName: 'S3_INTEGRATION',
          OptionVersion: '1.0',
        }],
      }));

      test.done();
    },
  },

  'SQL Server engine bindToInstance': {
    'returns s3 integration feature'(test: Test) {
      const engine = rds.DatabaseInstanceEngine.sqlServerSe({ version: rds.SqlServerEngineVersion.VER_14_00_3192_2_V1 });

      const engineConfig = engine.bindToInstance(new cdk.Stack(), {});
      test.equals(engineConfig.features?.s3Import, 'S3_INTEGRATION');
      test.equals(engineConfig.features?.s3Export, 'S3_INTEGRATION');

      test.done();
    },

    's3 import/export - throws if roles are not equal'(test: Test) {
      const stack = new cdk.Stack();
      const engine = rds.DatabaseInstanceEngine.sqlServerSe({ version: rds.SqlServerEngineVersion.VER_14_00_3192_2_V1 });

      const s3ImportRole = new iam.Role(stack, 'ImportRole', { assumedBy: new iam.AccountRootPrincipal() });
      const s3ExportRole = new iam.Role(stack, 'ExportRole', { assumedBy: new iam.AccountRootPrincipal() });

      test.throws(() => engine.bindToInstance(new cdk.Stack(), { s3ImportRole, s3ExportRole }), /S3 import and export roles must be the same/);
      test.doesNotThrow(() => engine.bindToInstance(new cdk.Stack(), { s3ImportRole }));
      test.doesNotThrow(() => engine.bindToInstance(new cdk.Stack(), { s3ExportRole }));
      test.doesNotThrow(() => engine.bindToInstance(new cdk.Stack(), { s3ImportRole, s3ExportRole: s3ImportRole }));

      test.done();
    },

    's3 import/export - creates an option group if needed'(test: Test) {
      const stack = new cdk.Stack();
      const engine = rds.DatabaseInstanceEngine.sqlServerSe({ version: rds.SqlServerEngineVersion.VER_14_00_3192_2_V1 });

      const engineConfig = engine.bindToInstance(stack, {
        optionGroup: undefined,
        s3ImportRole: new iam.Role(stack, 'ImportRole', { assumedBy: new iam.AccountRootPrincipal() }),
      });

      test.ok(engineConfig.optionGroup);
      expect(stack).to(haveResourceLike('AWS::RDS::OptionGroup', {
        EngineName: 'sqlserver-se',
        OptionConfigurations: [{
          OptionName: 'SQLSERVER_BACKUP_RESTORE',
          OptionSettings: [{
            Name: 'IAM_ROLE_ARN',
            Value: { 'Fn::GetAtt': ['ImportRole0C9E6F9A', 'Arn'] },
          }],
        }],
      }));

      test.done();
    },

    's3 import/export - appends to an existing option group if it exists'(test: Test) {
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

      test.equals(engineConfig.optionGroup, optionGroup);
      expect(stack).to(haveResourceLike('AWS::RDS::OptionGroup', {
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
      }));

      test.done();
    },
  },

  'PostgreSQL engine bindToInstance': {
    'returns no features for older versions'(test: Test) {
      const engineNewerVersion = rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_10_6 });

      const engineConfig = engineNewerVersion.bindToInstance(new cdk.Stack(), {});
      test.equals(engineConfig.features?.s3Import, undefined);
      test.equals(engineConfig.features?.s3Export, undefined);

      test.done();
    },

    'returns s3 import feature if the version supports it'(test: Test) {
      const engineNewerVersion = rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_12_3 });

      const engineConfig = engineNewerVersion.bindToInstance(new cdk.Stack(), {});
      test.equals(engineConfig.features?.s3Import, 's3Import');
      test.equals(engineConfig.features?.s3Export, undefined);

      test.done();
    },
  },
};
