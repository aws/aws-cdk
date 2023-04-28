import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as redshift from '../lib';

describe('cluster user group', () => {
  const groupName = 'groupName';

  let stack: cdk.Stack;
  let vpc: ec2.Vpc;
  let cluster: redshift.ICluster;
  const databaseName = 'databaseName';
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
      cluster,
      databaseName,
    };
  });

  it('pulls the groupName from the custom resource', () => {
    const userGroup = new redshift.UserGroup(stack, 'UserGroup', databaseOptions);

    expect(stack.resolve(userGroup.groupName)).toStrictEqual({
      'Fn::GetAtt': [
        'UserGroup18C57AC1',
        'groupName',
      ],
    });
  });

  it('uses groupName when provided', () => {
    new redshift.UserGroup(stack, 'UserGroup', {
      ...databaseOptions,
      groupName,
    });

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', { groupName });
  });

  it('adds users when provided', () => {
    const users = [
      new redshift.User(stack, 'User1', databaseOptions),
      new redshift.User(stack, 'User2', databaseOptions),
    ];
    new redshift.UserGroup(stack, 'UserGroup', {
      ...databaseOptions,
      users,
    });

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      users: [
        { 'Fn::GetAtt': ['User1A2F34FC8', 'username'] },
        { 'Fn::GetAtt': ['User2AD6D675B', 'username'] },
      ],
    });
  });

  it('destroys user group on deletion by default', () => {
    new redshift.UserGroup(stack, 'UserGroup', databaseOptions);

    Template.fromStack(stack).hasResource('Custom::RedshiftDatabaseQuery', {
      DeletionPolicy: 'Delete',
    });
  });

  it('retains user group on deletion if requested', () => {
    const userGroup = new redshift.UserGroup(stack, 'UserGroup', databaseOptions);

    userGroup.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    Template.fromStack(stack).hasResource('Custom::RedshiftDatabaseQuery', {
      DeletionPolicy: 'Retain',
    });
  });

  it('addTablePrivileges grants access to table', () => {
    const userGroup = new redshift.UserGroup(stack, 'UserGroup', databaseOptions);
    const table = redshift.Table.fromTableAttributes(stack, 'Table', {
      tableName: 'tableName',
      tableColumns: [{ name: 'col1', dataType: 'varchar(4)' }, { name: 'col2', dataType: 'float' }],
      cluster,
      databaseName: 'databaseName',
    });

    userGroup.addTablePrivileges(table, redshift.TableAction.INSERT);

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      handler: 'user-table-privileges',
    });
  });
});
