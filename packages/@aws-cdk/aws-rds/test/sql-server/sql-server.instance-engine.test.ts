import { expect, haveResourceLike } from '@aws-cdk/assert-internal';
import * as core from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as rds from '../../lib';

nodeunitShim({
  'SQL Server instance engine': {
    "has ParameterGroup family ending in '11.0' for major version 11"(test: Test) {
      const stack = new core.Stack();
      new rds.ParameterGroup(stack, 'ParameterGroup', {
        engine: rds.DatabaseInstanceEngine.sqlServerWeb({
          version: rds.SqlServerEngineVersion.VER_11,
        }),
      }).bindToInstance({});

      expect(stack).to(haveResourceLike('AWS::RDS::DBParameterGroup', {
        Family: 'sqlserver-web-11.0',
      }));

      test.done();
    },

    "has MajorEngineVersion ending in '11.00' for major version 11"(test: Test) {
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

      expect(stack).to(haveResourceLike('AWS::RDS::OptionGroup', {
        MajorEngineVersion: '11.00',
      }));

      test.done();
    },
  },
});
