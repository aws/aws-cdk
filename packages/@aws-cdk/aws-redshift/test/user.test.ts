import { Match, Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import * as redshift from '../lib';

describe('cluster user', () => {
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

  it('creates using custom resource', () => {
    new redshift.User(stack, 'User', databaseOptions);

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      passwordSecretArn: { Ref: 'UserSecretAttachment02022609' },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([{
          Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
          Effect: 'Allow',
          Resource: { Ref: 'UserSecretAttachment02022609' },
        }]),
      },
      Roles: [{ Ref: 'QueryRedshiftDatabase3de5bea727da479686625efb56431b5fServiceRole0A90D717' }],
    });
  });

  it('creates database secret', () => {
    const user = new redshift.User(stack, 'User', databaseOptions);

    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        SecretStringTemplate: `{"username":"${cdk.Names.uniqueId(user).toLowerCase()}"}`,
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::SecretTargetAttachment', {
      SecretId: { Ref: 'UserSecretE2C04A69' },
    });
  });

  it('username property is pulled from custom resource', () => {
    const user = new redshift.User(stack, 'User', databaseOptions);

    expect(stack.resolve(user.username)).toStrictEqual({
      'Fn::GetAtt': [
        'UserFDDCDD17',
        'username',
      ],
    });
  });

  it('password property is pulled from attached secret', () => {
    const user = new redshift.User(stack, 'User', databaseOptions);

    expect(stack.resolve(user.password)).toStrictEqual({
      'Fn::Join': [
        '',
        [
          '{{resolve:secretsmanager:',
          {
            Ref: 'UserSecretAttachment02022609',
          },
          ':SecretString:password::}}',
        ],
      ],
    });
  });

  it('secret property is exposed', () => {
    const user = new redshift.User(stack, 'User', databaseOptions);

    expect(stack.resolve(user.secret.secretArn)).toStrictEqual({
      Ref: 'UserSecretE2C04A69',
    });
  });

  it('uses username when provided', () => {
    const username = 'username';

    new redshift.User(stack, 'User', {
      ...databaseOptions,
      username,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        SecretStringTemplate: `{"username":"${username}"}`,
      },
    });
  });

  it('can import from username and password', () => {
    const userSecret = secretsmanager.Secret.fromSecretNameV2(stack, 'User Secret', 'redshift-user-secret');

    const user = redshift.User.fromUserAttributes(stack, 'User', {
      ...databaseOptions,
      username: userSecret.secretValueFromJson('username').toString(),
      password: userSecret.secretValueFromJson('password'),
    });

    expect(stack.resolve(user.username)).toStrictEqual({
      'Fn::Join': [
        '',
        [
          '{{resolve:secretsmanager:arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':secretsmanager:',
          {
            Ref: 'AWS::Region',
          },
          ':',
          {
            Ref: 'AWS::AccountId',
          },
          ':secret:redshift-user-secret:SecretString:username::}}',
        ],
      ],
    });
    expect(stack.resolve(user.password)).toStrictEqual({
      'Fn::Join': [
        '',
        [
          '{{resolve:secretsmanager:arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':secretsmanager:',
          {
            Ref: 'AWS::Region',
          },
          ':',
          {
            Ref: 'AWS::AccountId',
          },
          ':secret:redshift-user-secret:SecretString:password::}}',
        ],
      ],
    });
  });

  it('destroys user on deletion by default', () => {
    new redshift.User(stack, 'User', databaseOptions);

    Template.fromStack(stack).hasResource('Custom::RedshiftDatabaseQuery', {
      Properties: {
        passwordSecretArn: { Ref: 'UserSecretAttachment02022609' },
      },
      DeletionPolicy: 'Delete',
    });
  });

  it('retains user on deletion if requested', () => {
    const user = new redshift.User(stack, 'User', databaseOptions);

    user.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

    Template.fromStack(stack).hasResource('Custom::RedshiftDatabaseQuery', {
      Properties: {
        passwordSecretArn: { Ref: 'UserSecretAttachment02022609' },
      },
      DeletionPolicy: 'Retain',
    });
  });

  it('uses encryption key if one is provided', () => {
    const encryptionKey = new kms.Key(stack, 'Key');

    new redshift.User(stack, 'User', {
      ...databaseOptions,
      encryptionKey,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      KmsKeyId: stack.resolve(encryptionKey.keyArn),
    });
  });

  it('addTablePrivileges grants access to table', () => {
    const user = redshift.User.fromUserAttributes(stack, 'User', {
      ...databaseOptions,
      username: 'username',
      password: cdk.SecretValue.unsafePlainText('INSECURE_NOT_FOR_PRODUCTION'),
    });
    const table = redshift.Table.fromTableAttributes(stack, 'Table', {
      tableName: 'tableName',
      tableColumns: [{ name: 'col1', dataType: 'varchar(4)' }, { name: 'col2', dataType: 'float' }],
      cluster,
      databaseName: 'databaseName',
    });

    user.addTablePrivileges(table, redshift.TableAction.INSERT);

    Template.fromStack(stack).hasResourceProperties('Custom::RedshiftDatabaseQuery', {
      handler: 'user-table-privileges',
    });
  });
});
