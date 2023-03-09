import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { REDSHIFT_COLUMN_ID } from '@aws-cdk/cx-api';
import * as redshift from '../lib';

describe('cluster table', () => {
  const tableName = 'tableName';
  const tableColumns: redshift.Column[] = [
    { name: 'col1', dataType: 'varchar(4)' },
    { name: 'col2', dataType: 'float' },
  ];

  let stack: cdk.Stack;
  let vpc: ec2.Vpc;
  let cluster: redshift.ICluster;
  let databaseOptions: redshift.DatabaseOptions;

  beforeEach(() => {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'VPC');
    cluster = new redshift.Cluster(stack, 'Cluster', {
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      masterUser: {
        masterUsername: 'admin',
      },
      publiclyAccessible: true,
    });
    databaseOptions = {
      cluster: cluster,
      databaseName: 'databaseName',
    };
  });

  it('creates using custom resource', () => {
    new redshift.Table(stack, 'Table', {
      ...databaseOptions,
      tableColumns,
    });

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      tableName: {
        prefix: 'Table',
        generateSuffix: 'true',
      },
      tableColumns,
    });
  });

  it('tableName property is pulled from custom resource', () => {
    const table = new redshift.Table(stack, 'Table', {
      ...databaseOptions,
      tableColumns,
    });

    expect(stack.resolve(table.tableName)).toStrictEqual({
      Ref: 'Table7ABB320E',
    });
  });

  it('uses table name when provided', () => {
    new redshift.Table(stack, 'Table', {
      ...databaseOptions,
      tableName,
      tableColumns,
    });

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      tableName: {
        prefix: tableName,
        generateSuffix: 'false',
      },
    });
  });

  it('can import from name and columns', () => {
    const table = redshift.Table.fromTableAttributes(stack, 'Table', {
      tableName,
      tableColumns,
      cluster,
      databaseName: 'databaseName',
    });

    expect(table.tableName).toBe(tableName);
    expect(table.tableColumns).toStrictEqual(tableColumns);
    expect(table.cluster).toBe(cluster);
    expect(table.databaseName).toBe('databaseName');
  });

  it('grant adds privileges to user', () => {
    const user = redshift.User.fromUserAttributes(stack, 'User', {
      ...databaseOptions,
      username: 'username',
      password: cdk.SecretValue.unsafePlainText('INSECURE_NOT_FOR_PRODUCTION'),
    });
    const table = redshift.Table.fromTableAttributes(stack, 'Table', {
      tableName,
      tableColumns,
      cluster,
      databaseName: 'databaseName',
    });

    table.grant(user, redshift.TableAction.INSERT);

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      handler: 'user-table-privileges',
    });
  });

  it('retains table on deletion by default', () => {
    new redshift.Table(stack, 'Table', {
      ...databaseOptions,
      tableColumns,
    });

    Template.fromStack(stack).hasResource('Custom::RedshiftDatabaseQuery', {
      Properties: {
        handler: 'table',
      },
      DeletionPolicy: 'Retain',
    });
  });

  it('destroys table on deletion if requested', () => {
    const table = new redshift.Table(stack, 'Table', {
      ...databaseOptions,
      tableColumns,
    });

    table.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    Template.fromStack(stack).hasResource('Custom::RedshiftDatabaseQuery', {
      Properties: {
        handler: 'table',
      },
      DeletionPolicy: 'Delete',
    });
  });

  it('throws if column ids are similar', async () => {
    const updatedTableColumns: redshift.Column[] = [
      { id: 'col1', name: 'col1', dataType: 'varchar(4)' },
      { id: 'col1', name: 'col2', dataType: 'float' },
    ];

    expect(
      () => new redshift.Table(stack, 'Table', {
        ...databaseOptions,
        tableColumns: updatedTableColumns,
      }),
    ).toThrow("Column id 'col1' is not unique.");
  });

  describe('@aws-cdk/aws-redshift:columnId', () => {
    it('uses column ids if feature flag provided', () => {
      const app = new cdk.App({ context: { [REDSHIFT_COLUMN_ID]: true } });
      const newStack = new cdk.Stack(app, 'NewStack');
      vpc = new ec2.Vpc(newStack, 'VPC');
      cluster = new redshift.Cluster(newStack, 'Cluster', {
        vpc: vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
        masterUser: {
          masterUsername: 'admin',
        },
        publiclyAccessible: true,
      });
      databaseOptions = {
        cluster: cluster,
        databaseName: 'databaseName',
      };

      new redshift.Table(newStack, 'Table', {
        ...databaseOptions,
        tableColumns,
      });

      Template.fromStack(newStack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
        useColumnIds: true,
      });
    });

    it('does not use column ids if feature flag not provided', () => {
      new redshift.Table(stack, 'Table', {
        ...databaseOptions,
        tableColumns,
      });

      Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
        useColumnIds: false,
      });
    });
  });

  describe('distKey and distStyle', () => {
    it('throws if more than one distKeys are configured', () => {
      const updatedTableColumns: redshift.Column[] = [
        ...tableColumns,
        { name: 'col3', dataType: 'varchar(4)', distKey: true },
        { name: 'col4', dataType: 'float', distKey: true },
      ];

      expect(
        () => new redshift.Table(stack, 'Table', {
          ...databaseOptions,
          tableColumns: updatedTableColumns,
        }),
      ).toThrow(/Only one column can be configured as distKey./);
    });

    it('throws if distStyle other than KEY is configured with configured distKey column', () => {
      const updatedTableColumns: redshift.Column[] = [
        ...tableColumns,
        { name: 'col3', dataType: 'varchar(4)', distKey: true },
      ];

      expect(
        () => new redshift.Table(stack, 'Table', {
          ...databaseOptions,
          tableColumns: updatedTableColumns,
          distStyle: redshift.TableDistStyle.EVEN,
        }),
      ).toThrow(`Only 'TableDistStyle.KEY' can be configured when distKey is also configured. Found ${redshift.TableDistStyle.EVEN}`);
    });

    it('throws if KEY distStyle is configired with no distKey column', () => {
      expect(
        () => new redshift.Table(stack, 'Table', {
          ...databaseOptions,
          tableColumns,
          distStyle: redshift.TableDistStyle.KEY,
        }),
      ).toThrow('distStyle of "TableDistStyle.KEY" can only be configured when distKey is also configured.');
    });
  });

  describe('sortKeys and sortStyle', () => {
    it('configures default sortStyle based on sortKeys if no sortStyle is passed: AUTO', () => {
      // GIVEN
      const tableColumnsWithoutSortKey = tableColumns;

      // WHEN
      new redshift.Table(stack, 'Table', {
        ...databaseOptions,
        tableColumns: tableColumnsWithoutSortKey,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
        sortStyle: redshift.TableSortStyle.AUTO,
      });
    });

    it('configures default sortStyle based on sortKeys if no sortStyle is passed: COMPOUND', () => {
      // GIVEN
      const tableColumnsWithSortKey: redshift.Column[] = [
        ...tableColumns,
        { name: 'col3', dataType: 'varchar(4)', sortKey: true },
      ];

      // WHEN
      new redshift.Table(stack, 'Table', {
        ...databaseOptions,
        tableColumns: tableColumnsWithSortKey,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
        sortStyle: redshift.TableSortStyle.COMPOUND,
      });
    });

    it('throws if sortStlye other than AUTO is passed with no configured sortKeys', () => {
      expect(
        () => new redshift.Table(stack, 'Table', {
          ...databaseOptions,
          tableColumns,
          sortStyle: redshift.TableSortStyle.COMPOUND,
        }),
      ).toThrow(`sortStyle of '${redshift.TableSortStyle.COMPOUND}' can only be configured when sortKey is also configured.`);
    });

    it('throws if sortStlye of AUTO is passed with some configured sortKeys', () => {
      // GIVEN
      const tableColumnsWithSortKey: redshift.Column[] = [
        ...tableColumns,
        { name: 'col3', dataType: 'varchar(4)', sortKey: true },
      ];

      // THEN
      expect(
        () => new redshift.Table(stack, 'Table', {
          ...databaseOptions,
          tableColumns: tableColumnsWithSortKey,
          sortStyle: redshift.TableSortStyle.AUTO,
        }),
      ).toThrow(`sortStyle of '${redshift.TableSortStyle.AUTO}' cannot be configured when sortKey is also configured.`);
    });
  });
});
