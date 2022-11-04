import { Template } from '@aws-cdk/assertions';
import * as core from '@aws-cdk/core';
import * as rds from '../../lib';

describe('MariaDB server instance engine', () => {
  describe('MariaDB instance engine versions', () => {
    test("has MajorEngineVersion ending in '10.3' for major version 10.3", () => {
      const stack = new core.Stack();
      new rds.OptionGroup(stack, 'OptionGroup', {
        engine: rds.DatabaseInstanceEngine.mariaDb({
          version: rds.MariaDbEngineVersion.VER_10_3,
        }),
        configurations: [
          {
            name: 'MARIADB_BACKUP_RESTORE',
            settings: {
              IAM_ROLE_ARN: 'some-role-arn',
            },
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::OptionGroup', {
        MajorEngineVersion: '10.3',
      });
    });

    test("has MajorEngineVersion ending in '10.4' for major version 10.4", () => {
      const stack = new core.Stack();
      new rds.OptionGroup(stack, 'OptionGroup', {
        engine: rds.DatabaseInstanceEngine.mariaDb({
          version: rds.MariaDbEngineVersion.VER_10_4,
        }),
        configurations: [
          {
            name: 'MARIADB_BACKUP_RESTORE',
            settings: {
              IAM_ROLE_ARN: 'some-role-arn',
            },
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::OptionGroup', {
        MajorEngineVersion: '10.4',
      });
    });

    test("has MajorEngineVersion ending in '10.5' for major version 10.5", () => {
      const stack = new core.Stack();
      new rds.OptionGroup(stack, 'OptionGroup', {
        engine: rds.DatabaseInstanceEngine.mariaDb({
          version: rds.MariaDbEngineVersion.VER_10_5,
        }),
        configurations: [
          {
            name: 'MARIADB_BACKUP_RESTORE',
            settings: {
              IAM_ROLE_ARN: 'some-role-arn',
            },
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::OptionGroup', {
        MajorEngineVersion: '10.5',
      });
    });

    test("has MajorEngineVersion ending in '10.6' for major version 10.6", () => {
      const stack = new core.Stack();
      new rds.OptionGroup(stack, 'OptionGroup', {
        engine: rds.DatabaseInstanceEngine.mariaDb({
          version: rds.MariaDbEngineVersion.VER_10_6,
        }),
        configurations: [
          {
            name: 'MARIADB_BACKUP_RESTORE',
            settings: {
              IAM_ROLE_ARN: 'some-role-arn',
            },
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::OptionGroup', {
        MajorEngineVersion: '10.6',
      });
    });
  });
});