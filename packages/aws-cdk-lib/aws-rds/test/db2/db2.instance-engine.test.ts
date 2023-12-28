import { Template } from '../../../assertions';
import * as core from '../../../core';
import * as rds from '../../lib';

describe('DB2 server instance engine', () => {
  describe('DB2 instance engine versions', () => {
    test("has MajorEngineVersion ending in '11.5' for major version 11.5", () => {
      const stack = new core.Stack();
      new rds.OptionGroup(stack, 'OptionGroup', {
        engine: rds.DatabaseInstanceEngine.db2Se({
          version: rds.Db2EngineVersion.VER_11_5,
        }),
        configurations: [
          {
            name: 'DB2_BACKUP_RESTORE',
            settings: {
              IAM_ROLE_ARN: 'some-role-arn',
            },
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::OptionGroup', {
        MajorEngineVersion: '11.5',
      });
    });
  });
});