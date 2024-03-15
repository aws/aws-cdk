import * as path from 'path';
import { Template } from '../../assertions';
import { Vpc, SecurityGroup, SubnetType } from '../../aws-ec2';
import { DatabaseSecret, DatabaseClusterEngine, AuroraMysqlEngineVersion, ServerlessCluster, DatabaseCluster, ClusterInstance } from '../../aws-rds';
import * as cdk from '../../core';
import * as appsync from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
let api: appsync.GraphqlApi;
beforeEach(() => {
  stack = new cdk.Stack();
  api = new appsync.GraphqlApi(stack, 'baseApi', {
    name: 'api',
    schema: new appsync.SchemaFile({
      filePath: path.join(__dirname, 'appsync.test.graphql'),
    }),
  });
});

describe('Rds Data Source configuration', () => {
  // GIVEN
  let secret: DatabaseSecret;
  let serverlessCluster: ServerlessCluster;
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
    serverlessCluster = new ServerlessCluster(stack, 'AuroraCluster', {
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_2_07_1 }),
      credentials: { username: 'clusteradmin' },
      clusterIdentifier: 'db-endpoint-test',
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [securityGroup],
      defaultDatabaseName: 'Animals',
    });

    serverlessClusterV2 = new DatabaseCluster(stack, 'AuroraClusterV2', {
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_3_06_0 }),
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

  test('appsync creates correct policy', () => {
    // WHEN
    api.addRdsDataSource('ds', serverlessCluster, secret);

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

  test('appsync creates correct policy ServerlessV2', () => {
    // WHEN
    api.addRdsDataSource('dsV2', serverlessClusterV2, secret);

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

  test('rds cluster arn saved to RdsHttpEndpointConfig', () => {
    // WHEN
    api.addRdsDataSource('ds', serverlessCluster, secret);

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

  test('rds cluster arn saved to RdsHttpEndpointConfig serverlessV2', () => {
    // WHEN
    api.addRdsDataSource('dsV2', serverlessClusterV2, secret);

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

  test('databaseName saved to RdsHttpEndpointConfig', () => {
    // WHEN
    const testDatabaseName = 'testDatabaseName';
    api.addRdsDataSource('ds', serverlessCluster, secret, testDatabaseName);

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

  test('databaseName saved to RdsHttpEndpointConfig serverlessV2', () => {
    // WHEN
    const testDatabaseName = 'testDatabaseName';
    api.addRdsDataSource('dsV2', serverlessClusterV2, secret, testDatabaseName);

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

  test('default configuration produces name identical to the id', () => {
    // WHEN
    api.addRdsDataSource('ds', serverlessCluster, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      Name: 'ds',
    });
  });

  test('default configuration produces name identical to the id serverlessV2', () => {
    // WHEN
    api.addRdsDataSource('dsV2', serverlessClusterV2, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      Name: 'dsV2',
    });
  });

  test('appsync configures name correctly', () => {
    // WHEN
    api.addRdsDataSource('ds', serverlessCluster, secret, undefined, {
      name: 'custom',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      Name: 'custom',
    });
  });

  test('appsync configures name correctly serverlessV2', () => {
    // WHEN
    api.addRdsDataSource('dsV2', serverlessClusterV2, secret, undefined, {
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
    api.addRdsDataSource('ds', serverlessCluster, secret, undefined, {
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

  test('appsync configures name and description correctly ServerlessV2', () => {
    // WHEN
    api.addRdsDataSource('dsV2', serverlessClusterV2, secret, undefined, {
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
      api.addRdsDataSource('ds', serverlessCluster, secret);
      api.addRdsDataSource('ds', serverlessCluster, secret);
    };

    // THEN
    expect(when).toThrow('There is already a Construct with name \'ds\' in GraphqlApi [baseApi]');
  });

  test('appsync errors when creating multiple rds data sources with no configuration ServerlessV2', () => {
    // WHEN
    const when = () => {
      api.addRdsDataSource('dsV2', serverlessClusterV2, secret);
      api.addRdsDataSource('dsV2', serverlessClusterV2, secret);
    };

    // THEN
    expect(when).toThrow('There is already a Construct with name \'dsV2\' in GraphqlApi [baseApi]');
  });
});

describe('adding rds data source from imported api', () => {
  // GIVEN
  let secret: DatabaseSecret;
  let serverlessCluster: ServerlessCluster;
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
    serverlessCluster = new ServerlessCluster(stack, 'AuroraCluster', {
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_2_07_1 }),
      credentials: { username: 'clusteradmin' },
      clusterIdentifier: 'db-endpoint-test',
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [securityGroup],
      defaultDatabaseName: 'Animals',
    });

    serverlessClusterV2 = new DatabaseCluster(stack, 'AuroraClusterV2', {
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_3_06_0 }),
      credentials: { username: 'clusteradmin' },
      clusterIdentifier: 'db-endpoint-test',
      writer: ClusterInstance.serverlessV2('writer'),
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 1,
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [securityGroup],
      defaultDatabaseName: 'Animals',
    });
  });

  test('imported api can add RdsDbDataSource from id', () => {
    // WHEN
    const importedApi = appsync.GraphqlApi.fromGraphqlApiAttributes(stack, 'importedApi', {
      graphqlApiId: api.apiId,
    });
    importedApi.addRdsDataSource('ds', serverlessCluster, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });

  test('imported api can add RdsDbDataSource V2 from id', () => {
    // WHEN
    const importedApi = appsync.GraphqlApi.fromGraphqlApiAttributes(stack, 'importedApi', {
      graphqlApiId: api.apiId,
    });
    importedApi.addRdsDataSource('dsV2', serverlessClusterV2, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });

  test('imported api can add RdsDataSource from attributes', () => {
    // WHEN
    const importedApi = appsync.GraphqlApi.fromGraphqlApiAttributes(stack, 'importedApi', {
      graphqlApiId: api.apiId,
      graphqlApiArn: api.arn,
    });
    importedApi.addRdsDataSource('ds', serverlessCluster, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });

  test('imported api can add RdsDataSource V2 from attributes', () => {
    // WHEN
    const importedApi = appsync.GraphqlApi.fromGraphqlApiAttributes(stack, 'importedApi', {
      graphqlApiId: api.apiId,
      graphqlApiArn: api.arn,
    });
    importedApi.addRdsDataSource('dsV2', serverlessClusterV2, secret);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'RELATIONAL_DATABASE',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });
});
