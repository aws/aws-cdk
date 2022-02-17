import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as redshift from '../lib';

describe('table privileges', () => {
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;
  let cluster: redshift.ICluster;
  const databaseName = 'databaseName';
  let databaseOptions: redshift.DatabaseOptions;
  const tableColumns = [{ name: 'col1', dataType: 'varchar(4)' }, { name: 'col2', dataType: 'float' }];
  let table: redshift.ITable;
  let table2: redshift.ITable;

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
      cluster,
      databaseName,
    };
    table = redshift.Table.fromTableAttributes(stack, 'Table', {
      tableName: 'tableName',
      tableColumns,
      cluster,
      databaseName,
    });
    table2 = redshift.Table.fromTableAttributes(stack, 'Table 2', {
      tableName: 'tableName2',
      tableColumns,
      cluster,
      databaseName,
    });
  });

  it('adding table privilege creates custom resource', () => {
    const user = new redshift.User(stack, 'User', databaseOptions);

    user.addTablePrivileges(table, redshift.TableAction.INSERT);
    user.addTablePrivileges(table2, redshift.TableAction.SELECT, redshift.TableAction.DROP);

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      username: {
        'Fn::GetAtt': [
          'UserFDDCDD17',
          'username',
        ],
      },
      tablePrivileges: [{ tableName: 'tableName', actions: ['INSERT'] }, { tableName: 'tableName2', actions: ['SELECT', 'DROP'] }],
    });
  });

  it('table privileges are deduplicated', () => {
    const user = new redshift.User(stack, 'User', databaseOptions);

    user.addTablePrivileges(table, redshift.TableAction.INSERT, redshift.TableAction.INSERT, redshift.TableAction.DELETE);
    user.addTablePrivileges(table, redshift.TableAction.SELECT, redshift.TableAction.DELETE);

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      username: {
        'Fn::GetAtt': [
          'UserFDDCDD17',
          'username',
        ],
      },
      tablePrivileges: [{ tableName: 'tableName', actions: ['SELECT', 'DELETE', 'INSERT'] }],
    });
  });

  it('table privileges are removed when ALL specified', () => {
    const user = new redshift.User(stack, 'User', databaseOptions);

    user.addTablePrivileges(table, redshift.TableAction.ALL, redshift.TableAction.INSERT);

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      username: {
        'Fn::GetAtt': [
          'UserFDDCDD17',
          'username',
        ],
      },
      tablePrivileges: [{ tableName: 'tableName', actions: ['ALL'] }],
    });
  });

  it('SELECT table privilege is added when UPDATE or DELETE is specified', () => {
    const user = new redshift.User(stack, 'User', databaseOptions);

    user.addTablePrivileges(table, redshift.TableAction.UPDATE);
    user.addTablePrivileges(table2, redshift.TableAction.DELETE);

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      username: {
        'Fn::GetAtt': [
          'UserFDDCDD17',
          'username',
        ],
      },
      tablePrivileges: [{ tableName: 'tableName', actions: ['UPDATE', 'SELECT'] }, { tableName: 'tableName2', actions: ['DELETE', 'SELECT'] }],
    });
  });
});
