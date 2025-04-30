import * as path from 'path';
import { Template } from '../../assertions';
import { Vpc, SecurityGroup, SubnetType } from '../../aws-ec2';
import { DatabaseSecret, DatabaseClusterEngine, AuroraMysqlEngineVersion, ServerlessCluster, DatabaseCluster, ClusterInstance, AuroraPostgresEngineVersion } from '../../aws-rds';
import * as cdk from '../../core';
import * as appsync from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
let eventApi: appsync.EventApi;
beforeEach(() => {
  stack = new cdk.Stack();
  eventApi = new appsync.EventApi(stack, 'baseApi', {
    apiName: 'api',
  });
});

describe('Rds Data Source configuration', () => {
  // GIVEN
  let secret: DatabaseSecret;
  let serverlessCluster: ServerlessCluster;

  beforeEach(() => {
    const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
    const securityGroup = new SecurityGroup(stack, 'AuroraSecurityGroup', {
      vpc,
      allowAllOutbound: true,
    });
    secret = new DatabaseSecret(stack, 'AuroraSecret', {
      username: 'clusteradmin',
    });
    serverlessCluster = new ServerlessCluster(stack, 'AuroraCluster', {
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_3_07_1 }),
      credentials: { username: 'clusteradmin' },
      clusterIdentifier: 'db-endpoint-test',
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [securityGroup],
      defaultDatabaseName: 'Animals',
    });
  });

  test('appsync creates correct policy', () => {
    // WHEN
    eventApi.addRdsDataSource('ds', serverlessCluster, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: [
            'secretsmanager:GetSecretValue',
            'secretsmanager:DescribeSecret',
          ],
          Effect: 'Allow',
          Resource: { Ref: 'AuroraSecret41E6E877' },
        },
        {
          Action: [
            'rds-data:BatchExecuteStatement',
            'rds-data:BeginTransaction',
            'rds-data:CommitTransaction',
            'rds-data:ExecuteStatement',
            'rds-data:RollbackTransaction',
          ],
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: [
            'secretsmanager:GetSecretValue',
            'secretsmanager:DescribeSecret',
          ],
          Effect: 'Allow',
          Resource: { Ref: 'AuroraClusterSecretAttachmentDB8032DA' },
        },
        {
          Action: [
            'rds-data:DeleteItems',
            'rds-data:ExecuteSql',
            'rds-data:GetItems',
            'rds-data:InsertItems',
            'rds-data:UpdateItems',
          ],
          Effect: 'Allow',
          Resource: [{
            'Fn::Join': ['', ['arn:',
              { Ref: 'AWS::Partition' },
              ':rds:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':cluster:',
              { Ref: 'AuroraCluster23D869C0' }]],
          },
          {
            'Fn::Join': ['', ['arn:',
              { Ref: 'AWS::Partition' },
              ':rds:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':cluster:',
              { Ref: 'AuroraCluster23D869C0' },
              ':*']],
          }],
        }],
      },
    });
  });

  test('create new RdsDataSource with Aurora Serverless V1 cluster', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });

    new appsync.AppSyncRdsDataSource(stack, 'RdsDataSourceAuroraV1', {
      serverlessCluster: serverlessCluster,
      secretStore: secret,
      databaseName: 'Animals',
      api: importedApi,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      EnableHttpEndpoint: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      Name: 'RdsDataSourceAuroraV1',
    });
  });

  test('rds cluster arn saved to RdsHttpEndpointConfig', () => {
    // WHEN
    eventApi.addRdsDataSource('ds', serverlessCluster, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      RelationalDatabaseConfig: {
        RdsHttpEndpointConfig: {
          AwsRegion: { Ref: 'AWS::Region' },
          AwsSecretStoreArn: { Ref: 'AuroraSecret41E6E877' },
          DbClusterIdentifier: {
            'Fn::Join': ['', ['arn:',
              { Ref: 'AWS::Partition' },
              ':rds:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':cluster:',
              { Ref: 'AuroraCluster23D869C0' }]],
          },
        },
      },
    });
  });

  test('databaseName saved to RdsHttpEndpointConfig', () => {
    // WHEN
    const testDatabaseName = 'testDatabaseName';
    eventApi.addRdsDataSource('ds', serverlessCluster, secret, testDatabaseName);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      RelationalDatabaseConfig: {
        RdsHttpEndpointConfig: {
          AwsRegion: { Ref: 'AWS::Region' },
          AwsSecretStoreArn: { Ref: 'AuroraSecret41E6E877' },
          DbClusterIdentifier: {
            'Fn::Join': ['', ['arn:',
              { Ref: 'AWS::Partition' },
              ':rds:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':cluster:',
              { Ref: 'AuroraCluster23D869C0' }]],
          },
          DatabaseName: testDatabaseName,
        },
      },
    });
  });

  test('default configuration produces name identical to the id', () => {
    // WHEN
    eventApi.addRdsDataSource('ds', serverlessCluster, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      Name: 'ds',
    });
  });

  test('appsync configures name correctly', () => {
    // WHEN
    eventApi.addRdsDataSource('ds', serverlessCluster, secret, undefined, {
      name: 'custom',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      Name: 'custom',
    });
  });

  test('appsync configures name and description correctly', () => {
    // WHEN
    eventApi.addRdsDataSource('ds', serverlessCluster, secret, undefined, {
      name: 'custom',
      description: 'custom description',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      Name: 'custom',
      Description: 'custom description',
    });
  });

  test('appsync errors when creating multiple rds data sources with no configuration', () => {
    // WHEN
    const when = () => {
      eventApi.addRdsDataSource('ds', serverlessCluster, secret);
      eventApi.addRdsDataSource('ds', serverlessCluster, secret);
    };

    // THEN
    expect(when).toThrow('There is already a Construct with name \'ds\' in EventApi [baseApi]');
  });
});

describe('Rds Data Source Serverless V2 configuration', () => {
  // GIVEN
  let secret: DatabaseSecret;
  let serverlessClusterV2: DatabaseCluster;

  beforeEach(() => {
    const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
    const securityGroup = new SecurityGroup(stack, 'AuroraSecurityGroup', {
      vpc,
      allowAllOutbound: true,
    });
    secret = new DatabaseSecret(stack, 'AuroraSecret', {
      username: 'clusteradmin',
    });
    serverlessClusterV2 = new DatabaseCluster(stack, 'AuroraClusterV2', {
      engine: DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_15_5 }),
      credentials: { username: 'clusteradmin' },
      clusterIdentifier: 'db-endpoint-test',
      writer: ClusterInstance.serverlessV2('writer'),
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 1,
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [securityGroup],
      defaultDatabaseName: 'Animals',
      enableDataApi: true,
    });
  });

  test('appsync creates correct policy ServerlessV2', () => {
    // WHEN
    eventApi.addRdsDataSource('dsV2', serverlessClusterV2, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: [
            'secretsmanager:GetSecretValue',
            'secretsmanager:DescribeSecret',
          ],
          Effect: 'Allow',
          Resource: { Ref: 'AuroraSecret41E6E877' },
        },
        {
          Action: [
            'rds-data:BatchExecuteStatement',
            'rds-data:BeginTransaction',
            'rds-data:CommitTransaction',
            'rds-data:ExecuteStatement',
            'rds-data:RollbackTransaction',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', ['arn:',
              { Ref: 'AWS::Partition' },
              ':rds:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':cluster:',
              { Ref: 'AuroraClusterV2A232B19B' }]],
          },
        },
        {
          Action: [
            'secretsmanager:GetSecretValue',
            'secretsmanager:DescribeSecret',
          ],
          Effect: 'Allow',
          Resource: { Ref: 'AuroraClusterV2SecretAttachmentA83795D8' },
        },
        {
          Action: [
            'rds-data:DeleteItems',
            'rds-data:ExecuteSql',
            'rds-data:GetItems',
            'rds-data:InsertItems',
            'rds-data:UpdateItems',
          ],
          Effect: 'Allow',
          Resource: [{
            'Fn::Join': ['', ['arn:',
              { Ref: 'AWS::Partition' },
              ':rds:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':cluster:',
              { Ref: 'AuroraClusterV2A232B19B' }]],
          },
          {
            'Fn::Join': ['', ['arn:',
              { Ref: 'AWS::Partition' },
              ':rds:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':cluster:',
              { Ref: 'AuroraClusterV2A232B19B' },
              ':*']],
          }],
        }],
      },
    });
  });

  test('create new RdsDataSource with Aurora Serverless V2 cluster', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });

    new appsync.AppSyncRdsDataSource(stack, 'RdsDataSourceAuroraV2', {
      serverlessCluster: serverlessClusterV2,
      secretStore: secret,
      databaseName: 'Animals',
      api: importedApi,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      EnableHttpEndpoint: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      Name: 'RdsDataSourceAuroraV2',
    });
  });

  test('rds cluster arn saved to RdsHttpEndpointConfig serverlessV2', () => {
    // WHEN
    eventApi.addRdsDataSource('dsV2', serverlessClusterV2, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      RelationalDatabaseConfig: {
        RdsHttpEndpointConfig: {
          AwsRegion: { Ref: 'AWS::Region' },
          AwsSecretStoreArn: { Ref: 'AuroraSecret41E6E877' },
          DbClusterIdentifier: {
            'Fn::Join': ['', ['arn:',
              { Ref: 'AWS::Partition' },
              ':rds:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':cluster:',
              { Ref: 'AuroraClusterV2A232B19B' }]],
          },
        },
      },
    });
  });

  test('databaseName saved to RdsHttpEndpointConfig serverlessV2', () => {
    // WHEN
    const testDatabaseName = 'testDatabaseName';
    eventApi.addRdsDataSource('dsV2', serverlessClusterV2, secret, testDatabaseName);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      RelationalDatabaseConfig: {
        RdsHttpEndpointConfig: {
          AwsRegion: { Ref: 'AWS::Region' },
          AwsSecretStoreArn: { Ref: 'AuroraSecret41E6E877' },
          DbClusterIdentifier: {
            'Fn::Join': ['', ['arn:',
              { Ref: 'AWS::Partition' },
              ':rds:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':cluster:',
              { Ref: 'AuroraClusterV2A232B19B' }]],
          },
          DatabaseName: testDatabaseName,
        },
      },
    });
  });

  test('default configuration produces name identical to the id serverlessV2', () => {
    // WHEN
    eventApi.addRdsDataSource('dsV2', serverlessClusterV2, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      Name: 'dsV2',
    });
  });

  test('appsync configures name correctly serverlessV2', () => {
    // WHEN
    eventApi.addRdsDataSource('dsV2', serverlessClusterV2, secret, undefined, {
      name: 'custom',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      Name: 'custom',
    });
  });

  test('appsync configures name and description correctly ServerlessV2', () => {
    // WHEN
    eventApi.addRdsDataSource('dsV2', serverlessClusterV2, secret, undefined, {
      name: 'custom',
      description: 'custom description',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      Name: 'custom',
      Description: 'custom description',
    });
  });

  test('appsync errors when creating multiple rds data sources with no configuration ServerlessV2', () => {
    // WHEN
    const when = () => {
      eventApi.addRdsDataSource('dsV2', serverlessClusterV2, secret);
      eventApi.addRdsDataSource('dsV2', serverlessClusterV2, secret);
    };

    // THEN
    expect(when).toThrow('There is already a Construct with name \'dsV2\' in EventApi [baseApi]');
  });
});

describe('Rds Data Source association with Channel Namespace', () => {
  // GIVEN
  let secret: DatabaseSecret;
  let serverlessCluster: ServerlessCluster;

  beforeEach(() => {
    const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
    const securityGroup = new SecurityGroup(stack, 'AuroraSecurityGroup', {
      vpc,
      allowAllOutbound: true,
    });
    secret = new DatabaseSecret(stack, 'AuroraSecret', {
      username: 'clusteradmin',
    });
    serverlessCluster = new ServerlessCluster(stack, 'AuroraCluster', {
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_3_07_1 }),
      credentials: { username: 'clusteradmin' },
      clusterIdentifier: 'db-endpoint-test',
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [securityGroup],
      defaultDatabaseName: 'Animals',
    });
  });

  test('Adding a channel namespace with API data source that exists - publish and subscribe handler', () => {
    // WHEN
    const datasource = eventApi.addRdsDataSource('ds', serverlessCluster, secret);
    eventApi.addChannelNamespace('newChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      publishHandlerConfig: {
        dataSource: datasource,
      },
      subscribeHandlerConfig: {
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
        OnSubscribe: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source that exists - publish handler', () => {
    // WHEN
    const datasource = eventApi.addRdsDataSource('ds', serverlessCluster, secret);
    eventApi.addChannelNamespace('newChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      publishHandlerConfig: {
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source that exists - subscribe handler', () => {
    // WHEN
    const datasource = eventApi.addRdsDataSource('ds', serverlessCluster, secret);
    eventApi.addChannelNamespace('newChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      subscribeHandlerConfig: {
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnSubscribe: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source that doesn\'t support DIRECT behavior', () => {
    // WHEN
    const when = () => {
      const datasource = eventApi.addRdsDataSource('ds', serverlessCluster, secret);
      eventApi.addChannelNamespace('newChannel', {
        code: appsync.Code.fromInline('/* handler code goes here */'),
        subscribeHandlerConfig: {
          direct: true,
          dataSource: datasource,
        },
      });
    };

    // THEN
    expect(when).toThrow('Direct integration is only supported for AWS_LAMBDA data sources.');
  });
});

describe('Rds Data Source Serverless V2 association with Channel Namespace', () => {
  // GIVEN
  let secret: DatabaseSecret;
  let serverlessClusterV2: DatabaseCluster;

  beforeEach(() => {
    const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
    const securityGroup = new SecurityGroup(stack, 'AuroraSecurityGroup', {
      vpc,
      allowAllOutbound: true,
    });
    secret = new DatabaseSecret(stack, 'AuroraSecret', {
      username: 'clusteradmin',
    });
    serverlessClusterV2 = new DatabaseCluster(stack, 'AuroraClusterV2', {
      engine: DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_15_5 }),
      credentials: { username: 'clusteradmin' },
      clusterIdentifier: 'db-endpoint-test',
      writer: ClusterInstance.serverlessV2('writer'),
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 1,
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [securityGroup],
      defaultDatabaseName: 'Animals',
      enableDataApi: true,
    });
  });

  test('Adding a channel namespace with API data source that exists - publish and subscribe handler', () => {
    // WHEN
    const datasource = eventApi.addRdsDataSource('ds', serverlessClusterV2, secret);
    eventApi.addChannelNamespace('newChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      publishHandlerConfig: {
        dataSource: datasource,
      },
      subscribeHandlerConfig: {
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
        OnSubscribe: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source that exists - publish handler', () => {
    // WHEN
    const datasource = eventApi.addRdsDataSource('ds', serverlessClusterV2, secret);
    eventApi.addChannelNamespace('newChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      publishHandlerConfig: {
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source that exists - subscribe handler', () => {
    // WHEN
    const datasource = eventApi.addRdsDataSource('ds', serverlessClusterV2, secret);
    eventApi.addChannelNamespace('newChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      subscribeHandlerConfig: {
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnSubscribe: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source that doesn\'t support DIRECT behavior', () => {
    // WHEN
    const when = () => {
      const datasource = eventApi.addRdsDataSource('ds', serverlessClusterV2, secret);
      eventApi.addChannelNamespace('newChannel', {
        code: appsync.Code.fromInline('/* handler code goes here */'),
        subscribeHandlerConfig: {
          direct: true,
          dataSource: datasource,
        },
      });
    };

    // THEN
    expect(when).toThrow('Direct integration is only supported for AWS_LAMBDA data sources.');
  });
});

describe('adding rds data source from imported api', () => {
  // GIVEN
  let secret: DatabaseSecret;
  let serverlessCluster: ServerlessCluster;

  beforeEach(() => {
    const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
    const securityGroup = new SecurityGroup(stack, 'AuroraSecurityGroup', {
      vpc,
      allowAllOutbound: true,
    });
    secret = new DatabaseSecret(stack, 'AuroraSecret', {
      username: 'clusteradmin',
    });
    serverlessCluster = new ServerlessCluster(stack, 'AuroraCluster', {
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_3_07_1 }),
      credentials: { username: 'clusteradmin' },
      clusterIdentifier: 'db-endpoint-test',
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [securityGroup],
      defaultDatabaseName: 'Animals',
    });
  });

  test('imported api can add RdsDbDataSource from id', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });
    importedApi.addRdsDataSource('ds', serverlessCluster, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });

  test('imported api can add RdsDataSource from attributes', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });
    importedApi.addRdsDataSource('ds', serverlessCluster, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });
});

describe('adding rds data source Serverless V2 from imported api', () => {
  // GIVEN
  let secret: DatabaseSecret;
  let serverlessClusterV2: DatabaseCluster;

  beforeEach(() => {
    const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
    const securityGroup = new SecurityGroup(stack, 'AuroraSecurityGroup', {
      vpc,
      allowAllOutbound: true,
    });
    secret = new DatabaseSecret(stack, 'AuroraSecret', {
      username: 'clusteradmin',
    });

    serverlessClusterV2 = new DatabaseCluster(stack, 'AuroraClusterV2', {
      engine: DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_15_5 }),
      credentials: { username: 'clusteradmin' },
      clusterIdentifier: 'db-endpoint-test',
      writer: ClusterInstance.serverlessV2('writer'),
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 1,
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [securityGroup],
      defaultDatabaseName: 'Animals',
      enableDataApi: true,
    });
  });

  test('imported api can add RdsDbDataSource V2 from id', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });
    importedApi.addRdsDataSource('dsV2', serverlessClusterV2, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });

  test('imported api can add RdsDataSource V2 from attributes', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });
    importedApi.addRdsDataSource('dsV2', serverlessClusterV2, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });
});
