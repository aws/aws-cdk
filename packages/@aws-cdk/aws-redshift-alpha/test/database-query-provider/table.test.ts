
import type { ExecuteStatementCommandInput } from '@aws-sdk/client-redshift-data';
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type * as AWSLambda from 'aws-lambda';

const mockExecuteStatement = jest.fn(async (_input: ExecuteStatementCommandInput) => ({ Id: 'statementId' }));
jest.mock('@aws-sdk/client-redshift-data', () => ({
  RedshiftData: class {
    executeStatement = mockExecuteStatement;
    describeStatement = jest.fn(async () => ({ Status: 'FINISHED' }));
  },
}));

import type { Column } from '../../lib';
import * as redshift from '../../lib';
import { ColumnEncoding, TableDistStyle, TableSortStyle } from '../../lib';
import { handler as managePrivileges } from '../../lib/private/database-query-provider/privileges';
import { handler as manageTable } from '../../lib/private/database-query-provider/table';
import type { TableAndClusterProps } from '../../lib/private/database-query-provider/types';

type ResourcePropertiesType = TableAndClusterProps & { ServiceToken: string };

const tableNamePrefix = 'tableNamePrefix';
const tableColumns = [{ name: 'col1', dataType: 'varchar(1)' }];
const clusterName = 'clusterName';
const adminUserArn = 'adminUserArn';
const databaseName = 'databaseName';
const physicalResourceId = 'clusterName:databaseName:tableNamePrefix:111111111111';
const stackId = 'arn:aws:cloudformation:us-east-1:788445345501:stack/aws-cdk-redshift-cluster-database/e782bf70-b8f4-11ed-8c6a-111111111111';
const stackIdTruncated = '111111111111';
const resourceProperties: ResourcePropertiesType = {
  useColumnIds: true,
  tableName: {
    prefix: tableNamePrefix,
    generateSuffix: 'true',
  },
  tableColumns,
  sortStyle: TableSortStyle.AUTO,
  clusterName,
  adminUserArn,
  databaseName,
  ServiceToken: '',
};
const requestId = 'requestId';
// Whichever test first synthesizes a stack pays the one-off setup of aws-cdk-lib's synthesis-time template
// validation, which can exceed Jest's default 5 s budget on a loaded machine.
const synthesisTimeout = 60_000;
const genericEvent: AWSLambda.CloudFormationCustomResourceEventCommon = {
  ResourceProperties: resourceProperties,
  ServiceToken: '',
  ResponseURL: '',
  StackId: stackId,
  RequestId: requestId,
  LogicalResourceId: '',
  ResourceType: '',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('create', () => {
  const baseEvent: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    RequestType: 'Create',
    ...genericEvent,
  };

  test('serializes properties in statement and creates physical resource ID', async () => {
    const event = baseEvent;

    await expect(manageTable(resourceProperties, event)).resolves.toEqual({
      PhysicalResourceId: 'clusterName:databaseName:tableNamePrefix111111111111:111111111111',
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE TABLE ${tableNamePrefix}${stackIdTruncated} (col1 varchar(1))`,
    }));
  });

  test('does not modify table name if no suffix generation requested', async () => {
    const event = baseEvent;
    const newResourceProperties = {
      ...resourceProperties,
      tableName: {
        ...resourceProperties.tableName,
        generateSuffix: 'false',
      },
    };

    await expect(manageTable(newResourceProperties, event)).resolves.toEqual({
      PhysicalResourceId: 'clusterName:databaseName:tableNamePrefix:111111111111',
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE TABLE ${tableNamePrefix} (col1 varchar(1))`,
    }));
  });

  test('serializes distKey and distStyle in statement', async () => {
    const event = baseEvent;
    const newResourceProperties: ResourcePropertiesType = {
      ...resourceProperties,
      tableColumns: [{ name: 'col1', dataType: 'varchar(1)', distKey: true }],
      distStyle: TableDistStyle.KEY,
    };

    await manageTable(newResourceProperties, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE TABLE ${tableNamePrefix}${stackIdTruncated} (col1 varchar(1)) DISTSTYLE KEY DISTKEY(col1)`,
    }));
  });

  test('serializes sortKeys and sortStyle in statement', async () => {
    const event = baseEvent;
    const newResourceProperties: ResourcePropertiesType = {
      ...resourceProperties,
      tableColumns: [
        { name: 'col1', dataType: 'varchar(1)', sortKey: true },
        { name: 'col2', dataType: 'varchar(1)' },
        { name: 'col3', dataType: 'varchar(1)', sortKey: true },
      ],
      sortStyle: TableSortStyle.COMPOUND,
    };

    await manageTable(newResourceProperties, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE TABLE ${tableNamePrefix}${stackIdTruncated} (col1 varchar(1),col2 varchar(1),col3 varchar(1)) COMPOUND SORTKEY(col1,col3)`,
    }));
  });

  test('serializes distKey and sortKeys as string booleans', async () => {
    const event = baseEvent;
    const newResourceProperties: ResourcePropertiesType = {
      ...resourceProperties,
      tableColumns: [
        { name: 'col1', dataType: 'varchar(4)', distKey: 'true' as unknown as boolean },
        { name: 'col2', dataType: 'float', sortKey: 'true' as unknown as boolean },
        { name: 'col3', dataType: 'float', sortKey: 'true' as unknown as boolean },
      ],
      distStyle: TableDistStyle.KEY,
      sortStyle: TableSortStyle.COMPOUND,
    };

    await manageTable(newResourceProperties, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE TABLE ${tableNamePrefix}${stackIdTruncated} (col1 varchar(4),col2 float,col3 float) DISTSTYLE KEY DISTKEY(col1) COMPOUND SORTKEY(col2,col3)`,
    }));
  });

  test('serializes table comment in statement', async () => {
    const event = baseEvent;
    const newResourceProperties: ResourcePropertiesType = {
      ...resourceProperties,
      tableComment: 'table comment',
    };

    await manageTable(newResourceProperties, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `COMMENT ON TABLE ${tableNamePrefix}${stackIdTruncated} IS 'table comment'`,
    }));
  });
});

describe('delete', () => {
  const baseEvent: AWSLambda.CloudFormationCustomResourceDeleteEvent = {
    RequestType: 'Delete',
    PhysicalResourceId: physicalResourceId,
    ...genericEvent,
  };

  test('executes statement', async () => {
    const event = baseEvent;

    await manageTable(resourceProperties, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `DROP TABLE ${tableNamePrefix}${stackIdTruncated}`,
    }));
  });
});

describe('update', () => {
  const event: AWSLambda.CloudFormationCustomResourceUpdateEvent = {
    RequestType: 'Update',
    OldResourceProperties: resourceProperties,
    PhysicalResourceId: physicalResourceId,
    ...genericEvent,
  };

  test('replaces if cluster name changes', async () => {
    const newClusterName = 'newClusterName';
    const newResourceProperties = {
      ...resourceProperties,
      clusterName: newClusterName,
    };

    await expect(manageTable(newResourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      ClusterIdentifier: newClusterName,
      Sql: expect.stringMatching(new RegExp(`CREATE TABLE ${tableNamePrefix}${stackIdTruncated}`)),
    }));
  });

  test('does not replace if admin user ARN changes', async () => {
    const newAdminUserArn = 'newAdminUserArn';
    const newResourceProperties = {
      ...resourceProperties,
      adminUserArn: newAdminUserArn,
    };

    await expect(manageTable(newResourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).not.toHaveBeenCalled();
  });

  test('replaces if database name changes', async () => {
    const newDatabaseName = 'newDatabaseName';
    const newResourceProperties = {
      ...resourceProperties,
      databaseName: newDatabaseName,
    };

    await expect(manageTable(newResourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Database: newDatabaseName,
      Sql: expect.stringMatching(new RegExp(`CREATE TABLE ${tableNamePrefix}${stackIdTruncated}`)),
    }));
  });

  describe('table name', () => {
    test('does not replace if PhysicalResourceId is old format', async () => {
      const newResourceProperties = {
        ...resourceProperties,
        PhysicalResourceId: 'newTableName',
        tableName: {
          ...resourceProperties.tableName,
          prefix: 'newTableName',
          generateSuffix: 'false',
        },
      };

      const newEvent = {
        ...event,
        PhysicalResourceId: 'newTableName',
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableName: {
            ...event.OldResourceProperties.tableName,
            generateSuffix: 'false',
          },
        },
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: 'newTableName',
      });
      expect(mockExecuteStatement).not.toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} RENAME TO newTableName`,
      }));
    });

    test('does not replace if table name changes', async () => {
      const newResourceProperties = {
        ...resourceProperties,
        tableName: {
          ...resourceProperties.tableName,
          prefix: 'newTableName',
          generateSuffix: 'false',
        },
      };

      const newEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableName: {
            ...event.OldResourceProperties.tableName,
            generateSuffix: 'false',
          },
        },
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix} RENAME TO newTableName`,
      }));
    });

    test('does not replace if table name added', async () => {
      const newResourceProperties = {
        ...resourceProperties,
        tableName: {
          prefix: 'newTable',
          generateSuffix: 'false',
        },
      };

      await expect(manageTable(newResourceProperties, event)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} RENAME TO newTable`,
      }));
    });

    test('does not replace if table name removed', async () => {
      const newResourceProperties = {
        ...resourceProperties,
        tableName: {
          prefix: 'Table',
          generateSuffix: 'true',
        },
      };

      const newEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableName: {
            ...event.OldResourceProperties.tableName,
            generateSuffix: 'false',
          },
        },
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix} RENAME TO Table${stackIdTruncated}`,
      }));
    });
  });

  test('does not replace if table columns removed', async () => {
    const newResourceProperties = {
      ...resourceProperties,
      tableColumns: [],
    };

    await expect(manageTable(newResourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringMatching(new RegExp(`ALTER TABLE ${newResourceProperties.tableName.prefix}.+ DROP COLUMN col1`)),
    }));
  });

  test('does not replace if table columns added', async () => {
    const newTableColumnName = 'col2';
    const newTableColumnDataType = 'varchar(1)';
    const newTableColumns = [{ name: 'col1', dataType: 'varchar(1)' }, { name: newTableColumnName, dataType: newTableColumnDataType }];
    const newResourceProperties = {
      ...resourceProperties,
      tableColumns: newTableColumns,
    };

    await expect(manageTable(newResourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} ADD ${newTableColumnName} ${newTableColumnDataType}`,
    }));
  });

  describe('column name', () => {
    test('does not replace if column name changed', async () => {
      const newEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableColumns: [
            { id: 'col1', name: 'col1', dataType: 'varchar(1)' },
          ],
        },
      };
      const newTableColumnName = 'col2';
      const newResourceProperties: ResourcePropertiesType = {
        ...resourceProperties,
        tableColumns: [
          { id: 'col1', name: newTableColumnName, dataType: 'varchar(1)' },
        ],
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} RENAME COLUMN col1 TO ${newTableColumnName}`,
      }));
    });

    test('does not replace if column id assigned, from undefined', async () => {
      const newEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableColumns: [
            { name: 'col1', dataType: 'varchar(1)' },
          ],
        },
      };
      const newResourceProperties: ResourcePropertiesType = {
        ...resourceProperties,
        tableColumns: [
          { id: 'col1', name: 'col1', dataType: 'varchar(1)' },
        ],
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).not.toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} RENAME COLUMN col1 TO col1`,
      }));
    });
  });

  describe('distStyle and distKey', () => {
    test('replaces if distStyle is added', async () => {
      const newResourceProperties: ResourcePropertiesType = {
        ...resourceProperties,
        distStyle: TableDistStyle.EVEN,
      };

      await expect(manageTable(newResourceProperties, event)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `CREATE TABLE ${tableNamePrefix}${stackIdTruncated} (col1 varchar(1)) DISTSTYLE EVEN`,
      }));
    });

    test('replaces if distStyle is removed', async () => {
      const newEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          distStyle: TableDistStyle.EVEN,
        },
      };
      const newResourceProperties = {
        ...resourceProperties,
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `CREATE TABLE ${tableNamePrefix}${stackIdTruncated} (col1 varchar(1))`,
      }));
    });

    test('does not replace if distStyle is changed', async () => {
      const newEvent: AWSLambda.CloudFormationCustomResourceEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          distStyle: TableDistStyle.EVEN,
        },
      };
      const newDistStyle = TableDistStyle.ALL;
      const newResourceProperties: ResourcePropertiesType = {
        ...resourceProperties,
        distStyle: newDistStyle,
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} ALTER DISTSTYLE ${newDistStyle}`,
      }));
    });

    test('adds key without creating table if distKey is added', async () => {
      const newResourceProperties: ResourcePropertiesType = {
        ...resourceProperties,
        tableColumns: [{ name: 'col1', dataType: 'varchar(1)', distKey: true }],
      };

      await expect(manageTable(newResourceProperties, event)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} ALTER DISTSTYLE KEY DISTKEY col1`,
      }));
    });

    test('removes key without replacing table if distKey is removed', async () => {
      const newEvent: AWSLambda.CloudFormationCustomResourceEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableColumns: [{ name: 'col1', dataType: 'varchar(1)', distKey: true }],
        },
      };
      const newResourceProperties: ResourcePropertiesType = {
        ...resourceProperties,
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} ALTER DISTSTYLE AUTO`,
      }));
    });

    test('does not replace if distKey is changed', async () => {
      const newEvent: AWSLambda.CloudFormationCustomResourceEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableColumns: [
            { name: 'col1', dataType: 'varchar(1)', distKey: true },
            { name: 'col2', dataType: 'varchar(1)' },
          ],
        },
      };
      const newDistKey = 'col2';
      const newResourceProperties: ResourcePropertiesType = {
        ...resourceProperties,
        tableColumns: [
          { name: 'col1', dataType: 'varchar(1)' },
          { name: 'col2', dataType: 'varchar(1)', distKey: true },
        ],
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} ALTER DISTKEY ${newDistKey}`,
      }));
    });
  });

  describe('sortStyle and sortKeys', () => {
    const oldTableColumnsWithSortKeys: Column[] = [
      { name: 'col1', dataType: 'varchar(1)', sortKey: true },
      { name: 'col2', dataType: 'varchar(1)' },
    ];
    const newTableColumnsWithSortKeys: Column[] = [
      { name: 'col1', dataType: 'varchar(1)' },
      { name: 'col2', dataType: 'varchar(1)', sortKey: true },
    ];

    test('replaces when same sortStyle, different sortKey columns: INTERLEAVED', async () => {
      const newEvent: AWSLambda.CloudFormationCustomResourceEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableColumns: oldTableColumnsWithSortKeys,
          sortStyle: TableSortStyle.INTERLEAVED,
        },
      };
      const newResourceProperties: ResourcePropertiesType = {
        ...resourceProperties,
        tableColumns: newTableColumnsWithSortKeys,
        sortStyle: TableSortStyle.INTERLEAVED,
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `CREATE TABLE ${tableNamePrefix}${stackIdTruncated} (col1 varchar(1),col2 varchar(1)) INTERLEAVED SORTKEY(col2)`,
      }));
    });

    test('replaces when different sortStyle: INTERLEAVED', async () => {
      const newEvent: AWSLambda.CloudFormationCustomResourceEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableColumns: oldTableColumnsWithSortKeys,
          sortStyle: TableSortStyle.AUTO,
        },
      };
      const newResourceProperties: ResourcePropertiesType = {
        ...resourceProperties,
        tableColumns: oldTableColumnsWithSortKeys,
        sortStyle: TableSortStyle.INTERLEAVED,
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `CREATE TABLE ${tableNamePrefix}${stackIdTruncated} (col1 varchar(1),col2 varchar(1)) INTERLEAVED SORTKEY(col1)`,
      }));
    });

    test('does not replace when same sortStyle, different sortKey columns: COMPOUND', async () => {
      const newEvent: AWSLambda.CloudFormationCustomResourceEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableColumns: oldTableColumnsWithSortKeys,
          sortStyle: TableSortStyle.COMPOUND,
        },
      };
      const newResourceProperties: ResourcePropertiesType = {
        ...resourceProperties,
        tableColumns: newTableColumnsWithSortKeys,
        sortStyle: TableSortStyle.COMPOUND,
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} ALTER COMPOUND SORTKEY(col2)`,
      }));
    });

    test('does not replace when different sortStyle: COMPOUND', async () => {
      const newEvent: AWSLambda.CloudFormationCustomResourceEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableColumns: oldTableColumnsWithSortKeys,
          sortStyle: TableSortStyle.AUTO,
        },
      };
      const newResourceProperties: ResourcePropertiesType = {
        ...resourceProperties,
        tableColumns: oldTableColumnsWithSortKeys,
        sortStyle: TableSortStyle.COMPOUND,
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} ALTER COMPOUND SORTKEY(col1)`,
      }));
    });

    test('does not replace when different sortStyle: AUTO', async () => {
      const newEvent: AWSLambda.CloudFormationCustomResourceEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableColumns: oldTableColumnsWithSortKeys,
          sortStyle: TableSortStyle.COMPOUND,
        },
      };
      const newResourceProperties: ResourcePropertiesType = {
        ...resourceProperties,
        tableColumns: oldTableColumnsWithSortKeys,
        sortStyle: TableSortStyle.AUTO,
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} ALTER SORTKEY AUTO`,
      }));
    });
  });

  describe('table comment', () => {
    test('does not replace if comment added on table', async () => {
      const newComment = 'newComment';
      const newResourceProperties = {
        ...resourceProperties,
        tableComment: newComment,
      };

      await expect(manageTable(newResourceProperties, event)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `COMMENT ON TABLE ${tableNamePrefix}${stackIdTruncated} IS '${newComment}'`,
      }));
    });

    test('does not replace if comment removed on table', async () => {
      const newEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableComment: 'oldComment',
        },
      };
      const newResourceProperties = {
        ...resourceProperties,
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `COMMENT ON TABLE ${tableNamePrefix}${stackIdTruncated} IS NULL`,
      }));
    });
  });

  describe('column comment', () => {
    test('does not replace if comment added on column', async () => {
      const newComment = 'newComment';
      const newResourceProperties = {
        ...resourceProperties,
        tableColumns: [{ name: 'col1', dataType: 'varchar(1)', comment: newComment }],
      };

      await expect(manageTable(newResourceProperties, event)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `COMMENT ON COLUMN ${tableNamePrefix}${stackIdTruncated}.col1 IS '${newComment}'`,
      }));
    });

    test('does not replace if comment removed on column', async () => {
      const newEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableColumns: [{ name: 'col1', dataType: 'varchar(1)', comment: 'oldComment' }],
        },
      };

      await expect(manageTable(resourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `COMMENT ON COLUMN ${tableNamePrefix}${stackIdTruncated}.col1 IS NULL`,
      }));
    });
  });

  describe('column encoding', () => {
    test('does not replace if encoding added on column', async () => {
      const newResourceProperties = {
        ...resourceProperties,
        tableColumns: [{ name: 'col1', dataType: 'varchar(1)', encoding: ColumnEncoding.RAW }],
      };

      await expect(manageTable(newResourceProperties, event)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} ALTER COLUMN col1 ENCODE RAW`,
      }));
    });

    test('does not replace if encoding removed on column', async () => {
      const newEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableColumns: [{ name: 'col1', dataType: 'varchar(1)', encoding: ColumnEncoding.RAW }],
        },
      };
      const newResourceProperties = {
        ...resourceProperties,
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} ALTER COLUMN col1 ENCODE AUTO`,
      }));
    });

    test('adds a comma between multiple statements', async () => {
      const newEvent = {
        ...event,
        OldResourceProperties: {
          ...event.OldResourceProperties,
          tableColumns: [{ name: 'col1', dataType: 'varchar(1)' }, { name: 'col2', dataType: 'varchar(1)' }],
        },
      };

      const newResourceProperties = {
        ...resourceProperties,
        tableColumns: [{ name: 'col1', dataType: 'varchar(1)', encoding: ColumnEncoding.RAW }, { name: 'col2', dataType: 'varchar(1)', encoding: ColumnEncoding.RAW }],
      };

      await expect(manageTable(newResourceProperties, newEvent)).resolves.toMatchObject({
        PhysicalResourceId: physicalResourceId,
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
        Sql: `ALTER TABLE ${tableNamePrefix}${stackIdTruncated} ALTER COLUMN col1 ENCODE RAW, ALTER COLUMN col2 ENCODE RAW`,
      }));
    });
  });
});

describe('special-character handling', () => {
  const createEvent: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    RequestType: 'Create',
    ...genericEvent,
  };
  const updateEvent: AWSLambda.CloudFormationCustomResourceUpdateEvent = {
    RequestType: 'Update',
    OldResourceProperties: resourceProperties,
    PhysicalResourceId: physicalResourceId,
    ...genericEvent,
  };

  test('escapes single quotes in a table comment', async () => {
    const newResourceProperties: ResourcePropertiesType = {
      ...resourceProperties,
      tableComment: "it's a table",
    };

    await manageTable(newResourceProperties, createEvent);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringContaining('IS \'it\'\'s a table\''),
    }));
  });

  test('escapes backslashes in a table comment', async () => {
    const newResourceProperties: ResourcePropertiesType = {
      ...resourceProperties,
      tableComment: 'path\\to\\table',
    };

    await manageTable(newResourceProperties, createEvent);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `COMMENT ON TABLE ${tableNamePrefix}${stackIdTruncated} IS 'path\\\\to\\\\table'`,
    }));
  });

  test('escapes backslashes in a table comment changed by an update', async () => {
    const newResourceProperties: ResourcePropertiesType = {
      ...resourceProperties,
      tableComment: 'ends in \\',
    };

    await manageTable(newResourceProperties, updateEvent);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `COMMENT ON TABLE ${tableNamePrefix}${stackIdTruncated} IS 'ends in \\\\'`,
    }));
  });

  test('escapes single quotes in a column comment', async () => {
    const newResourceProperties: ResourcePropertiesType = {
      ...resourceProperties,
      tableColumns: [{ name: 'col1', dataType: 'varchar(1)', comment: "o'brien" }],
    };

    await manageTable(newResourceProperties, createEvent);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `COMMENT ON COLUMN ${tableNamePrefix}${stackIdTruncated}.col1 IS 'o''brien'`,
    }));
  });

  test('escapes backslashes in a column comment', async () => {
    const newResourceProperties: ResourcePropertiesType = {
      ...resourceProperties,
      tableColumns: [{ name: 'col1', dataType: 'varchar(1)', comment: 'C:\\data' }],
    };

    await manageTable(newResourceProperties, createEvent);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `COMMENT ON COLUMN ${tableNamePrefix}${stackIdTruncated}.col1 IS 'C:\\\\data'`,
    }));
  });

  test('escapes backslashes in a column comment changed by an update', async () => {
    const newResourceProperties: ResourcePropertiesType = {
      ...resourceProperties,
      tableColumns: [{ name: 'col1', dataType: 'varchar(1)', comment: 'ends in \\' }],
    };

    await manageTable(newResourceProperties, updateEvent);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `COMMENT ON COLUMN ${tableNamePrefix}${stackIdTruncated}.col1 IS 'ends in \\\\'`,
    }));
  });

  test('quotes table and column identifiers and doubles embedded double quotes in CREATE TABLE', async () => {
    const newResourceProperties: ResourcePropertiesType = {
      ...resourceProperties,
      tableName: {
        prefix: 'my table',
        generateSuffix: 'true',
      },
      tableColumns: [{ name: 'we"ird', dataType: 'varchar(1)' }],
    };

    await manageTable(newResourceProperties, createEvent);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE TABLE "my table${stackIdTruncated}" ("we""ird" varchar(1))`,
    }));
  });

  test('quotes identifiers and doubles embedded double quotes in RENAME COLUMN', async () => {
    const newEvent: AWSLambda.CloudFormationCustomResourceEvent = {
      ...updateEvent,
      OldResourceProperties: {
        ...updateEvent.OldResourceProperties,
        tableColumns: [
          { id: 'colId', name: 'old"a', dataType: 'varchar(1)' },
        ],
      },
    };
    const newResourceProperties: ResourcePropertiesType = {
      ...resourceProperties,
      tableColumns: [
        { id: 'colId', name: 'new"b', dataType: 'varchar(1)' },
      ],
    };

    await manageTable(newResourceProperties, newEvent);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringContaining('RENAME COLUMN "old""a" TO "new""b"'),
    }));
  });

  test('quotes the table identifier in DROP TABLE', async () => {
    const deleteEvent: AWSLambda.CloudFormationCustomResourceDeleteEvent = {
      RequestType: 'Delete',
      PhysicalResourceId: physicalResourceId,
      ...genericEvent,
    };
    const newResourceProperties: ResourcePropertiesType = {
      ...resourceProperties,
      tableName: {
        prefix: 'my table',
        generateSuffix: 'true',
      },
    };

    await manageTable(newResourceProperties, deleteEvent);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `DROP TABLE "my table${stackIdTruncated}"`,
    }));
  });
});

describe.each(['literal', 'lazy'])('qualified %s table creation', (kind) => {
  test.each([
    ['analytics.orders', 'analytics.orders'],
    ['dev.analytics.orders', 'dev.analytics.orders'],
    ['public.orders', 'public.orders'],
    ['sales team.order log', '"sales team"."order log"'],
    ['sales"team.order"log', '"sales""team"."order""log"'],
  ])('creates, comments and grants on the same table for %j', async (name, relation) => {
    const stack = new cdk.Stack();
    const cluster = new redshift.Cluster(stack, 'Cluster', {
      vpc: new ec2.Vpc(stack, 'Vpc'),
      masterUser: { masterUsername: 'admin' },
    });
    const table = new redshift.Table(stack, 'Table', {
      cluster,
      databaseName,
      tableName: kind === 'lazy' ? cdk.Lazy.string({ produce: () => name }) : name,
      tableColumns: [{ name: 'item.id', dataType: 'int', comment: 'item count' }],
      tableComment: 'daily orders',
    });
    const user = redshift.User.fromUserAttributes(stack, 'User', {
      cluster,
      databaseName,
      username: 'alice',
      password: cdk.SecretValue.unsafePlainText('INSECURE_NOT_FOR_PRODUCTION'),
    });
    table.grant(user, redshift.TableAction.SELECT);
    const resources = Object.values(Template.fromStack(stack).findResources('Custom::RedshiftDatabaseQuery'))
      .map(resource => resource.Properties);
    const connection = { clusterName, databaseName, adminUserArn };
    const tableProps = { ...resources.find(props => props.handler === 'table'), ...connection };
    const privilegeProps = { ...resources.find(props => props.handler === 'user-table-privileges'), ...connection };
    const event: AWSLambda.CloudFormationCustomResourceCreateEvent = { ...genericEvent, RequestType: 'Create' };

    await manageTable(tableProps, event);
    await managePrivileges(privilegeProps, event);

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([
      `CREATE TABLE ${relation} ("item.id" int)`,
      `COMMENT ON COLUMN ${relation}."item.id" IS 'item count'`,
      `COMMENT ON TABLE ${relation} IS 'daily orders'`,
      `GRANT SELECT ON ${relation} TO alice`,
    ]);
  }, synthesisTimeout);
});

describe('qualified table lifecycle', () => {
  const properties: ResourcePropertiesType = {
    ...resourceProperties,
    tableName: { prefix: 'analytics.orders', generateSuffix: 'false' },
    tableColumns: [
      { id: 'id', name: 'id', dataType: 'int' },
      { id: 'region', name: 'region', dataType: 'int' },
    ],
    distStyle: TableDistStyle.AUTO,
  };
  const tableId = 'clusterName:databaseName:analytics.orders:111111111111';
  const updateEvent: AWSLambda.CloudFormationCustomResourceUpdateEvent = {
    ...genericEvent,
    RequestType: 'Update',
    OldResourceProperties: properties,
    PhysicalResourceId: tableId,
  };

  test.each<[string, Partial<TableAndClusterProps>, Partial<TableAndClusterProps>, string[]]>([
    ['columns and comments', {}, {
      tableColumns: [
        { id: 'id', name: 'id', dataType: 'int', encoding: ColumnEncoding.ZSTD, comment: "o'brien" },
        { id: 'total', name: 'order total', dataType: 'int' },
      ],
      tableComment: 'daily orders',
    }, [
      'ALTER TABLE analytics.orders DROP COLUMN region',
      'ALTER TABLE analytics.orders ADD "order total" int',
      'ALTER TABLE analytics.orders ALTER COLUMN id ENCODE ZSTD',
      "COMMENT ON COLUMN analytics.orders.id IS 'o''brien'",
      "COMMENT ON TABLE analytics.orders IS 'daily orders'",
    ]],
    ['column rename', {}, {
      tableColumns: [
        { id: 'id', name: 'item.id', dataType: 'int' },
        { id: 'region', name: 'region', dataType: 'int' },
      ],
    }, ['ALTER TABLE analytics.orders RENAME COLUMN id TO "item.id"']],
    ['distribution style', {}, { distStyle: TableDistStyle.EVEN }, [
      'ALTER TABLE analytics.orders ALTER DISTSTYLE EVEN',
    ]],
    ['distribution key', {}, {
      tableColumns: [{ id: 'id', name: 'id', dataType: 'int', distKey: true }, properties.tableColumns[1]!],
    }, ['ALTER TABLE analytics.orders ALTER DISTSTYLE KEY DISTKEY id']],
    ['compound sort key', {}, {
      sortStyle: TableSortStyle.COMPOUND,
      tableColumns: [{ id: 'id', name: 'id', dataType: 'int', sortKey: true }, properties.tableColumns[1]!],
    }, ['ALTER TABLE analytics.orders ALTER COMPOUND SORTKEY(id)']],
    ['automatic sort key', {
      sortStyle: TableSortStyle.COMPOUND,
      tableColumns: [{ id: 'id', name: 'id', dataType: 'int', sortKey: true }, properties.tableColumns[1]!],
    }, {}, ['ALTER TABLE analytics.orders ALTER SORTKEY AUTO']],
  ])('updates %s on the qualified table', async (_label, oldChanges, newChanges, statements) => {
    await expect(manageTable({ ...properties, ...newChanges }, {
      ...updateEvent,
      OldResourceProperties: { ...properties, ...oldChanges },
    })).resolves.toEqual({ PhysicalResourceId: tableId });

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual(statements);
  });

  test.each([
    ['orders', 'orders_next', 'ALTER TABLE orders RENAME TO orders_next'],
    ['analytics.orders', 'analytics.orders_next', 'ALTER TABLE analytics.orders RENAME TO orders_next'],
    ['sales team.order log', 'sales team.order "next', 'ALTER TABLE "sales team"."order log" RENAME TO "order ""next"'],
  ])('renames %j using a leaf target', async (oldName, newName, statement) => {
    await expect(manageTable({
      ...properties,
      tableName: { prefix: newName, generateSuffix: 'false' },
    }, {
      ...updateEvent,
      OldResourceProperties: { ...properties, tableName: { prefix: oldName, generateSuffix: 'false' } },
    })).resolves.toEqual({ PhysicalResourceId: tableId });

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([statement]);
  });

  test.each<[string, Partial<TableAndClusterProps>]>([
    ['comment', { tableComment: 'changed' }],
    ['column', { tableColumns: [...properties.tableColumns, { name: 'total', dataType: 'int' }] }],
    ['cluster replacement', { clusterName: 'anotherCluster' }],
    ['database replacement', { databaseName: 'anotherDatabase' }],
    ['distribution replacement', { distStyle: undefined }],
    ['sort replacement', {
      sortStyle: TableSortStyle.INTERLEAVED,
      tableColumns: [{ id: 'id', name: 'id', dataType: 'int', sortKey: true }, properties.tableColumns[1]!],
    }],
  ])('fails a qualifier change before a %s update writes SQL', async (_label, changes) => {
    await expect(manageTable({
      ...properties,
      ...changes,
      tableName: { prefix: 'archive.orders', generateSuffix: 'false' },
    }, updateEvent)).rejects.toThrow('changing the table qualifier is not supported');

    expect(mockExecuteStatement).not.toHaveBeenCalled();
  });

  test.each([
    ['orders', 'public.orders'],
    ['public.orders', 'orders'],
  ])('fails changing qualifier spelling from %j to %j before SQL', async (oldName, newName) => {
    await expect(manageTable({
      ...properties,
      tableName: { prefix: newName, generateSuffix: 'false' },
    }, {
      ...updateEvent,
      OldResourceProperties: { ...properties, tableName: { prefix: oldName, generateSuffix: 'false' } },
    })).rejects.toThrow('changing the table qualifier is not supported');

    expect(mockExecuteStatement).not.toHaveBeenCalled();
  });

  test.each([undefined, 'changed'])('fails adding an empty qualifier with comment %j before SQL', async (tableComment) => {
    await expect(manageTable({
      ...properties,
      tableName: { prefix: '.orders_next', generateSuffix: 'false' },
      tableComment,
    }, {
      ...updateEvent,
      PhysicalResourceId: 'clusterName:databaseName:orders:111111111111',
      OldResourceProperties: { ...properties, tableName: { prefix: 'orders', generateSuffix: 'false' } },
    })).rejects.toThrow('table name ".orders_next" must not contain empty components');

    expect(mockExecuteStatement).not.toHaveBeenCalled();
  });

  test.each<[string, Partial<TableAndClusterProps>, Partial<TableAndClusterProps>]>([
    ['the rollback of a rejected update from "archive.orders" as a no-op', {}, { tableName: { prefix: 'archive.orders', generateSuffix: 'false' }, tableComment: 'changed' }],
    ['the rollback of a rejected update from ".orders_next" as a no-op', {}, { tableName: { prefix: '.orders_next', generateSuffix: 'false' }, tableComment: 'changed' }],
    ['the rollback of a rejected update from "analytics." as a no-op', {}, { tableName: { prefix: 'analytics.', generateSuffix: 'false' }, tableComment: 'changed' }],
    ['the rollback of a rejected update after an earlier leaf rename as a no-op', { tableName: { prefix: 'analytics.orders_a', generateSuffix: 'false' } }, {
      tableName: { prefix: 'archive.orders_a', generateSuffix: 'false' }, tableComment: 'changed',
    }],
    ['the rollback of a rejected update that also changed the cluster name as a no-op', {}, {
      tableName: { prefix: 'archive.orders', generateSuffix: 'false' }, clusterName: 'anotherCluster',
    }],
    ['the rollback of a rejected update after an earlier cluster change as a no-op', { clusterName: 'anotherCluster' }, {
      tableName: { prefix: 'archive.orders', generateSuffix: 'false' }, clusterName: 'anotherCluster',
    }],
    // Earlier releases renamed "analytics.orders" to "archive.orders" as one identifier.
    ['an update from a name an earlier release renamed across qualifiers as a rollback', { tableComment: 'changed' }, {
      tableName: { prefix: 'archive.orders', generateSuffix: 'false' },
    }],
  ])('treats %s', async (_description, changes, oldChanges) => {
    await expect(manageTable({ ...properties, ...changes }, {
      ...updateEvent,
      OldResourceProperties: { ...properties, ...oldChanges },
    })).resolves.toEqual({ PhysicalResourceId: tableId });

    expect(mockExecuteStatement).not.toHaveBeenCalled();
  });

  test('renames back on the rollback of a leaf rename', async () => {
    await expect(manageTable(properties, {
      ...updateEvent,
      OldResourceProperties: { ...properties, tableName: { prefix: 'analytics.orders_next', generateSuffix: 'false' } },
    })).resolves.toEqual({ PhysicalResourceId: tableId });

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual(['ALTER TABLE analytics.orders_next RENAME TO orders']);
  });

  // The colon cases pick new names with the qualifier that the physical ID's created name would be misread with.
  test.each<[string, Partial<TableAndClusterProps>, string, string, string]>([
    ['when the cluster name contains a colon', { clusterName: 'cluster:a' }, 'cluster:a:databaseName:analytics.orders:111111111111', 'analytics.orders', 'databaseName:analytics.orders'],
    ['when the database name contains a colon', { databaseName: 'database:a' }, 'clusterName:database:a:analytics.orders:111111111111', 'analytics.orders', 'a:analytics.orders'],
    ['when the physical ID records a database name containing a colon', {}, 'clusterName:database:a:analytics.orders:111111111111', 'analytics.orders', 'a:analytics.orders'],
    // Earlier releases accepted empty components and renames that changed the qualifier.
    ['for a table created with an empty name component', {}, 'clusterName:databaseName:orders.:111111111111', 'archive.orders', 'orders.next'],
  ])('fails a qualifier change %s', async (_description, names, physicalId, oldName, newName) => {
    await expect(manageTable({ ...properties, ...names, tableName: { prefix: newName, generateSuffix: 'false' } }, {
      ...updateEvent,
      OldResourceProperties: { ...properties, ...names, tableName: { prefix: oldName, generateSuffix: 'false' } },
      PhysicalResourceId: physicalId,
    })).rejects.toThrow('changing the table qualifier is not supported');

    expect(mockExecuteStatement).not.toHaveBeenCalled();
  });

  test('keeps V1 rename disabled', async () => {
    await expect(manageTable({
      ...properties,
      tableName: { prefix: 'analytics.orders_next', generateSuffix: 'false' },
    }, {
      ...updateEvent,
      PhysicalResourceId: 'analytics.orders',
    })).resolves.toEqual({ PhysicalResourceId: 'analytics.orders' });

    expect(mockExecuteStatement).not.toHaveBeenCalled();
  });

  test.each([
    ['V1', 'analytics.orders', 'analytics.orders', 'false', 'analytics.orders'],
    ['V2', tableId, tableId, 'false', 'analytics.orders'],
    ['generated', 'clusterName:databaseName:analytics.orders111111111111:111111111111', 'clusterName:databaseName:analytics.orders111111111111:111111111111', 'true', 'analytics.orders111111111111'],
    ['quoted components', 'clusterName:databaseName:sales team.order log:111111111111', 'sales team.order log', 'false', '"sales team"."order log"'],
  ])('revokes and drops the same %s table', async (kind, physicalId, grantName, generateSuffix, relation) => {
    const tableName = kind === 'quoted components' ? 'sales team.order log' : 'analytics.orders';
    const event: AWSLambda.CloudFormationCustomResourceDeleteEvent = {
      ...genericEvent,
      RequestType: 'Delete',
      PhysicalResourceId: physicalId,
    };

    await managePrivileges({
      clusterName,
      databaseName,
      adminUserArn,
      username: 'alice',
      tablePrivileges: [{ tableId: 'Table', tableName: grantName, actions: ['SELECT'] }],
    }, event);
    await manageTable({ ...properties, tableName: { prefix: tableName, generateSuffix } }, event);

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([
      `REVOKE SELECT ON ${relation} FROM alice`,
      `DROP TABLE ${relation}`,
    ]);
  });
});

describe('qualified table name comparison', () => {
  const propertiesFor = (name: string, changes: Partial<TableAndClusterProps> = {}): ResourcePropertiesType => ({
    ...resourceProperties,
    tableName: { prefix: name, generateSuffix: 'false' },
    ...changes,
  });
  const eventFor = (name: string, changes: Partial<TableAndClusterProps> = {}): AWSLambda.CloudFormationCustomResourceUpdateEvent => ({
    ...genericEvent,
    RequestType: 'Update',
    OldResourceProperties: propertiesFor(name, changes),
    PhysicalResourceId: `clusterName:databaseName:${name}:111111111111`,
  });

  test.each([
    ['Schema.orders', 'schema.orders_next', 'ALTER TABLE Schema.orders RENAME TO orders_next'],
    ['DEV.Schema.orders', 'dev.schema.orders_next', 'ALTER TABLE DEV.Schema.orders RENAME TO orders_next'],
    ['_Schema$.orders', '_schema$.orders_next', 'ALTER TABLE _Schema$.orders RENAME TO orders_next'],
  ])('renames %j to %j within the same qualifier', async (oldName, newName, statement) => {
    const event = eventFor(oldName);

    await expect(manageTable(propertiesFor(newName), event))
      .resolves.toEqual({ PhysicalResourceId: event.PhysicalResourceId });

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([statement]);
  });

  test.each([
    ['Schema.Orders', 'schema.orders'],
    ['public.orders', 'PUBLIC.orders'],
    ['Orders', 'orders'],
  ])('preserves %j without a redundant rename to %j', async (oldName, newName) => {
    const event = eventFor(oldName);

    await expect(manageTable(propertiesFor(newName), event))
      .resolves.toEqual({ PhysicalResourceId: event.PhysicalResourceId });

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([]);
  });

  test('updates a comment without renaming an equivalent whole name', async () => {
    const event = eventFor('Schema.Orders');

    await expect(manageTable({ ...propertiesFor('schema.orders'), tableComment: 'updated' }, event))
      .resolves.toEqual({ PhysicalResourceId: event.PhysicalResourceId });

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([
      "COMMENT ON TABLE Schema.Orders IS 'updated'",
    ]);
  });

  test.each([
    ['Ä.orders', 'ä.orders_next'],
  ])('fails changing distinct qualifiers from %j to %j before SQL', async (oldName, newName) => {
    await expect(manageTable({ ...propertiesFor(newName), tableComment: 'updated' }, eventFor(oldName)))
      .rejects.toThrow('changing the table qualifier is not supported');

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([]);
  });

  // A rollback sends the previous name as the new one, and the physical ID keeps the created name.
  test.each<[string, string, string, string[]]>([
    ['Order-Log', 'Order-Log', 'order-log', []],
    ['Sales-Team.Orders-Log', 'Sales-Team.Orders-Log', 'Sales-Team.orders-log', []],
    ['Sales-Team.Orders-Log', 'Sales-Team.orders-log', 'Sales-Team.Orders-Log', []],
    ['Sales-Team.orders', 'Sales-Team.orders', 'sales-team.orders', []],
    ['Sales-Team.orders', 'sales-team.orders', 'Sales-Team.orders', []],
    ['Sales-Team.orders', 'Sales-Team.orders', 'sales-team.orders_next', ['ALTER TABLE "Sales-Team".orders RENAME TO orders_next']],
    ['Sales-Team.orders', 'sales-team.orders_next', 'Sales-Team.orders', ['ALTER TABLE "sales-team".orders_next RENAME TO orders']],
  ])('compares quoted components ignoring letter case for a table created as %j, from %j to %j', async (created, oldName, newName, statements) => {
    const event = { ...eventFor(created), OldResourceProperties: propertiesFor(oldName) };

    await expect(manageTable(propertiesFor(newName), event))
      .resolves.toEqual({ PhysicalResourceId: event.PhysicalResourceId });

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual(statements);
  });

  test.each([
    ['Order-Log', 'order-log-next', 'ALTER TABLE "Order-Log" RENAME TO "order-log-next"'],
    ['order-log-next', 'order-log', 'ALTER TABLE "order-log-next" RENAME TO "order-log"'],
  ])('changes the letter case of a quoted table name created as "Order-Log" through another name, from %j to %j', async (oldName, newName, statement) => {
    const event = { ...eventFor('Order-Log'), OldResourceProperties: propertiesFor(oldName) };

    await expect(manageTable(propertiesFor(newName), event))
      .resolves.toEqual({ PhysicalResourceId: event.PhysicalResourceId });

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([statement]);
  });

  describe('with case-sensitive identifiers', () => {
    const caseSensitive = { caseSensitiveIdentifier: 'true' };

    test.each([
      ['Sales-Team.Orders-Log', 'Sales-Team.Orders-Log', 'Sales-Team.orders-log', 'ALTER TABLE "Sales-Team"."Orders-Log" RENAME TO "orders-log"'],
      ['Sales-Team.Orders-Log', 'Sales-Team.orders-log', 'Sales-Team.Orders-Log', 'ALTER TABLE "Sales-Team"."orders-log" RENAME TO "Orders-Log"'],
    ])('renames a quoted table name created as %j from %j to %j', async (created, oldName, newName, statement) => {
      const event = { ...eventFor(created, caseSensitive), OldResourceProperties: propertiesFor(oldName, caseSensitive) };

      await expect(manageTable(propertiesFor(newName, caseSensitive), event))
        .resolves.toEqual({ PhysicalResourceId: event.PhysicalResourceId });

      expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([statement]);
    });

    test.each([
      ['Sales-Team.orders', 'sales-team.orders'],
      ['Sales-Team.orders', 'sales-team.orders_next'],
    ])('fails changing the letter case of a quoted qualifier from %j to %j before SQL', async (oldName, newName) => {
      await expect(manageTable(propertiesFor(newName, { ...caseSensitive, tableComment: 'updated' }), eventFor(oldName, caseSensitive)))
        .rejects.toThrow('changing the table qualifier is not supported');

      expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([]);
    });

    test.each([
      ['Sales-Team.orders', 'sales-team.orders'],
      ['Sales-Team.orders', 'sales-team.orders_next'],
    ])('treats the rollback to %j of a rejected change to %j as a no-op', async (original, attempted) => {
      const event = {
        ...eventFor(original, caseSensitive),
        OldResourceProperties: propertiesFor(attempted, { ...caseSensitive, tableComment: 'updated' }),
      };

      await expect(manageTable(propertiesFor(original, caseSensitive), event))
        .resolves.toEqual({ PhysicalResourceId: event.PhysicalResourceId });

      expect(mockExecuteStatement).not.toHaveBeenCalled();
    });

    test.each([
      ['Schema.Orders', 'schema.orders'],
      ['Sales-Team.Orders', 'Sales-Team.orders'],
    ])('preserves %j without a redundant rename to %j', async (oldName, newName) => {
      const event = eventFor(oldName, caseSensitive);

      await expect(manageTable(propertiesFor(newName, caseSensitive), event))
        .resolves.toEqual({ PhysicalResourceId: event.PhysicalResourceId });

      expect(mockExecuteStatement).not.toHaveBeenCalled();
    });

    // A rollback swaps the two property sets, so an update that turns the setting on or off and its rollback
    // each see it on one side only.
    describe('when an update turns the setting on or off', () => {
      const withColumn = { tableColumns: [...tableColumns, { name: 'col2', dataType: 'int' }] };

      test.each([
        ['sales-team.orders', 'Sales-Team.orders_next'],
        ['sales-team.orders', 'Sales-Team.orders'],
      ])('fails turning the setting on and changing the letter case of a quoted qualifier from %j to %j before SQL', async (oldName, newName) => {
        await expect(manageTable(propertiesFor(newName, { ...caseSensitive, ...withColumn }), eventFor(oldName)))
          .rejects.toThrow('changing the table qualifier is not supported');

        expect(mockExecuteStatement).not.toHaveBeenCalled();
      });

      test.each([
        ['sales-team.orders', 'Sales-Team.orders_next'],
        ['sales-team.orders', 'Sales-Team.orders'],
      ])('treats the rollback to %j of a rejected change to %j that turned the setting on as a no-op', async (original, attempted) => {
        const event = { ...eventFor(original), OldResourceProperties: propertiesFor(attempted, { ...caseSensitive, ...withColumn }) };

        await expect(manageTable(propertiesFor(original), event))
          .resolves.toEqual({ PhysicalResourceId: event.PhysicalResourceId });

        expect(mockExecuteStatement).not.toHaveBeenCalled();
      });

      test.each<[string, string, string, Partial<TableAndClusterProps>, Partial<TableAndClusterProps>, string]>([
        ['an update turning the setting off', 'analytics.Order-Log', 'analytics.order-log', caseSensitive, {}, 'ALTER TABLE analytics."Order-Log" RENAME TO "order-log"'],
        ['its rollback', 'analytics.order-log', 'analytics.Order-Log', {}, caseSensitive, 'ALTER TABLE analytics."order-log" RENAME TO "Order-Log"'],
      ])('renames a quoted table name in %s, from %j to %j', async (_update, oldName, newName, oldChanges, newChanges, statement) => {
        const event = { ...eventFor('analytics.Order-Log'), OldResourceProperties: propertiesFor(oldName, oldChanges) };

        await expect(manageTable(propertiesFor(newName, newChanges), event))
          .resolves.toEqual({ PhysicalResourceId: event.PhysicalResourceId });

        expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([statement]);
      });

      test.each<[string, string, string, Partial<TableAndClusterProps>, Partial<TableAndClusterProps>]>([
        ['on', 'Sales-Team.Orders-Log', 'Sales-Team.Orders-Log', {}, caseSensitive],
        ['on', 'Sales-Team.orders', 'sales-team.orders', {}, caseSensitive],
        ['off', 'Sales-Team.Orders-Log', 'Sales-Team.Orders-Log', caseSensitive, {}],
      ])('runs no statement when an update only turns the setting %s, for a table created as %j and named %j', async (_setting, created, name, oldChanges, newChanges) => {
        const event = { ...eventFor(created), OldResourceProperties: propertiesFor(name, oldChanges) };

        await expect(manageTable(propertiesFor(name, newChanges), event))
          .resolves.toEqual({ PhysicalResourceId: event.PhysicalResourceId });

        expect(mockExecuteStatement).not.toHaveBeenCalled();
      });
    });
  });
});

describe('resolved table name components', () => {
  test.each([
    ['', 'false'],
    ['.orders', 'false'],
    ['dev..orders', 'true'],
    ['analytics.', 'false'],
  ])('fails Create for empty components in %j with suffix %s before SQL', async (name, generateSuffix) => {
    await expect(manageTable({
      ...resourceProperties,
      tableName: { prefix: name, generateSuffix },
      tableComment: 'daily orders',
    }, { ...genericEvent, RequestType: 'Create' })).rejects.toThrow('must not contain empty components');

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([]);
  });

  test.each([
    ['orders', ''],
    ['dev.analytics.orders', 'dev..orders'],
    ['analytics.orders', 'analytics.'],
  ])('fails Update from %j to %j before a comment writes SQL', async (oldName, newName) => {
    await expect(manageTable({
      ...resourceProperties,
      tableName: { prefix: newName, generateSuffix: 'false' },
      tableComment: 'updated',
    }, {
      ...genericEvent,
      RequestType: 'Update',
      PhysicalResourceId: `clusterName:databaseName:${oldName}:111111111111`,
      OldResourceProperties: {
        ...resourceProperties,
        tableName: { prefix: oldName, generateSuffix: 'false' },
      },
    })).rejects.toThrow(`table name ${JSON.stringify(newName)} must not contain empty components`);

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([]);
  });

  test('fails a resolved empty component at runtime after accepting the token at construction', async () => {
    const stack = new cdk.Stack();
    const cluster = new redshift.Cluster(stack, 'Cluster', {
      vpc: new ec2.Vpc(stack, 'Vpc'),
      masterUser: { masterUsername: 'admin' },
    });
    new redshift.Table(stack, 'Table', {
      cluster,
      databaseName,
      tableName: cdk.Lazy.string({ produce: () => 'analytics.' }),
      tableColumns,
    });
    const [resource] = Object.values(Template.fromStack(stack).findResources('Custom::RedshiftDatabaseQuery'));
    const props = { ...resource.Properties, clusterName, databaseName, adminUserArn };

    await expect(manageTable(props, { ...genericEvent, RequestType: 'Create' }))
      .rejects.toThrow('table name "analytics." must not contain empty components');

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([]);
  }, synthesisTimeout);

  test.each([
    ['', 'CREATE TABLE "111111111111" (col1 varchar(1))', 'clusterName:databaseName:111111111111:111111111111'],
    ['analytics.', 'CREATE TABLE analytics."111111111111" (col1 varchar(1))', 'clusterName:databaseName:analytics.111111111111:111111111111'],
  ])('creates a nonempty resolved name from prefix %j and a generated suffix', async (prefix, statement, physicalId) => {
    await expect(manageTable({
      ...resourceProperties,
      tableName: { prefix, generateSuffix: 'true' },
    }, { ...genericEvent, RequestType: 'Create' })).resolves.toEqual({ PhysicalResourceId: physicalId });

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([statement]);
  });

  test('renames to a nonempty leaf supplied by the generated suffix', async () => {
    await expect(manageTable({
      ...resourceProperties,
      tableName: { prefix: 'analytics.', generateSuffix: 'true' },
    }, {
      ...genericEvent,
      RequestType: 'Update',
      PhysicalResourceId: 'clusterName:databaseName:analytics.orders:111111111111',
      OldResourceProperties: {
        ...resourceProperties,
        tableName: { prefix: 'analytics.orders', generateSuffix: 'false' },
      },
    })).resolves.toEqual({ PhysicalResourceId: 'clusterName:databaseName:analytics.orders:111111111111' });

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([
      'ALTER TABLE analytics.orders RENAME TO "111111111111"',
    ]);
  });

  test('preserves an equivalent whole name resolved from different suffix settings', async () => {
    await expect(manageTable({
      ...resourceProperties,
      tableName: { prefix: 'schema.orders111111111111', generateSuffix: 'false' },
    }, {
      ...genericEvent,
      RequestType: 'Update',
      PhysicalResourceId: 'clusterName:databaseName:Schema.Orders111111111111:111111111111',
      OldResourceProperties: {
        ...resourceProperties,
        tableName: { prefix: 'Schema.Orders', generateSuffix: 'true' },
      },
    })).resolves.toEqual({ PhysicalResourceId: 'clusterName:databaseName:Schema.Orders111111111111:111111111111' });

    expect(mockExecuteStatement.mock.calls.map(([input]) => input.Sql)).toEqual([]);
  });
});
