import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as redshift from '../lib';

describe('cluster table', () => {
  const tableName = 'tableName';
  const tableColumns = [{ name: 'col1', dataType: 'varchar(4)' }, { name: 'col2', dataType: 'float' }];

  let stack: cdk.Stack;
  let vpc: ec2.Vpc;
  let cluster: redshift.ICluster;
  let databaseProps: redshift.DatabaseProps;

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
    databaseProps = {
      cluster: cluster,
      databaseName: 'databaseName',
    };
  });

  it('creates using custom resource', () => {
    new redshift.Table(stack, 'Table', {
      ...databaseProps,
      tableColumns,
    });

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      tableName: 'Table',
      tableColumns: JSON.stringify(tableColumns),
    });
  });

  it('tableName property is pulled from custom resource', () => {
    const table = new redshift.Table(stack, 'Table', {
      ...databaseProps,
      tableColumns,
    });

    expect(stack.resolve(table.tableName)).toStrictEqual({
      'Fn::GetAtt': [
        'Table7ABB320E',
        'tableName',
      ],
    });
  });

  it('uses table name when provided', () => {
    new redshift.Table(stack, 'Table', {
      ...databaseProps,
      tableName,
      tableColumns,
    });

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      tableName: tableName,
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
    expect(table.tableColumns).toBe(tableColumns);
    expect(table.cluster).toBe(cluster);
    expect(table.databaseName).toBe('databaseName');
  });

  it('grant adds privileges to user', () => {
    const user = redshift.User.fromUserAttributes(stack, 'User', {
      ...databaseProps,
      username: 'username',
      password: cdk.SecretValue.plainText('INSECURE_NOT_FOR_PRODUCTION'),
    });
    const privileges = [redshift.Privilege.INSERT, redshift.Privilege.DROP];
    const table = redshift.Table.fromTableAttributes(stack, 'Table', {
      tableName,
      tableColumns,
      cluster,
      databaseName: 'databaseName',
    });

    privileges.forEach(privilege => table.grant(user, privilege));

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      username: 'username',
      tablePrivileges: JSON.stringify([
        { tableName, privileges: [redshift.Privilege[redshift.Privilege.INSERT]] },
        { tableName, privileges: [redshift.Privilege[redshift.Privilege.DROP]] },
      ]),
    });
  });

  it('retains table on deletion by default', () => {
    new redshift.Table(stack, 'Table', {
      ...databaseProps,
      tableColumns,
    });

    Template.fromStack(stack).hasResource('Custom::RedshiftDatabaseQuery', {
      Properties: {
        tableName: 'Table',
      },
      DeletionPolicy: 'Retain',
    });
  });

  it('destroys table on deletion if requested', () => {
    const table = new redshift.Table(stack, 'Table', {
      ...databaseProps,
      tableColumns,
    });

    table.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    Template.fromStack(stack).hasResource('Custom::RedshiftDatabaseQuery', {
      Properties: {
        tableName: 'Table',
      },
      DeletionPolicy: 'Delete',
    });
  });
});
