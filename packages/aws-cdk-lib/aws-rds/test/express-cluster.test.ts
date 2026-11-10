import { Annotations, Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as logs from '../../aws-logs';
import * as secretsmanager from '../../aws-secretsmanager';
import * as cdk from '../../core';
import { DatabaseInsightsMode, DBClusterStorageType, ExpressCluster, PerformanceInsightRetention } from '../lib';

describe('ExpressCluster', () => {
  test('creates a cluster with express configuration', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    const cluster = new ExpressCluster(stack, 'Cluster');

    // THEN
    const template = Template.fromStack(stack);
    template.hasResource('AWS::RDS::DBCluster', {
      Properties: Match.objectEquals({
        Engine: 'aurora-postgresql',
        WithExpressConfiguration: true,
        CopyTagsToSnapshot: true,
      }),
      DeletionPolicy: 'Snapshot',
      UpdateReplacePolicy: 'Snapshot',
    });
    template.resourceCountIs('AWS::RDS::DBInstance', 0);
    template.resourceCountIs('AWS::RDS::DBSubnetGroup', 0);
    template.resourceCountIs('AWS::EC2::SecurityGroup', 0);
    template.resourceCountIs('AWS::SecretsManager::Secret', 0);
    expect(cluster.secret).toBeUndefined();
    expect(cluster.engine?.engineType).toEqual('aurora-postgresql');
    expect(cluster.instanceIdentifiers).toEqual([]);
    expect(cluster.instanceEndpoints).toEqual([]);
    expect(cluster.connections.securityGroups).toEqual([]);
    expect(stack.resolve(cluster.clusterEndpoint.hostname)).toEqual({ 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint.Address'] });
    expect(stack.resolve(cluster.clusterReadEndpoint.hostname)).toEqual({ 'Fn::GetAtt': ['ClusterEB0386A7', 'ReadEndpoint.Address'] });
  });

  test('with cluster identifier, deletion protection and removal policy', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new ExpressCluster(stack, 'Cluster', {
      clusterIdentifier: 'my-cluster',
      deletionProtection: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::RDS::DBCluster', {
      Properties: {
        DBClusterIdentifier: 'my-cluster',
        DeletionProtection: true,
      },
      DeletionPolicy: 'Delete',
      UpdateReplacePolicy: 'Delete',
    });
  });

  test('enables deletion protection when removal policy is RETAIN', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new ExpressCluster(stack, 'Cluster', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::RDS::DBCluster', {
      Properties: {
        DeletionProtection: true,
      },
      DeletionPolicy: 'Retain',
    });
  });

  test('grantConnect grants rds-db:connect for the given user', () => {
    // GIVEN
    const stack = testStack();
    const cluster = new ExpressCluster(stack, 'Cluster');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountRootPrincipal() });

    // WHEN
    cluster.grantConnect(role, 'postgres');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 'rds-db:connect',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':rds-db:us-test-1:12345:dbuser:',
              { 'Fn::GetAtt': ['ClusterEB0386A7', 'DBClusterResourceId'] },
              '/postgres',
            ]],
          },
        }],
      },
    });
  });

  test('with all supported properties', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new ExpressCluster(stack, 'Cluster', {
      masterUsername: 'appadmin',
      backup: { retention: cdk.Duration.days(7), preferredWindow: '18:00-19:00' },
      preferredMaintenanceWindow: 'Sun:20:00-Sun:21:00',
      serverlessV2MinCapacity: 0,
      serverlessV2MaxCapacity: 4,
      serverlessV2AutoPauseDuration: cdk.Duration.minutes(10),
      storageType: DBClusterStorageType.AURORA_IOPT1,
      cloudwatchLogsExports: ['postgresql'],
      enablePerformanceInsights: true,
      databaseInsightsMode: DatabaseInsightsMode.STANDARD,
      copyTagsToSnapshot: false,
      autoMinorVersionUpgrade: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      MasterUsername: 'appadmin',
      BackupRetentionPeriod: 7,
      PreferredBackupWindow: '18:00-19:00',
      PreferredMaintenanceWindow: 'Sun:20:00-Sun:21:00',
      ServerlessV2ScalingConfiguration: {
        MinCapacity: 0,
        MaxCapacity: 4,
        SecondsUntilAutoPause: 600,
      },
      StorageType: 'aurora-iopt1',
      EnableCloudwatchLogsExports: ['postgresql'],
      PerformanceInsightsEnabled: true,
      PerformanceInsightsRetentionPeriod: 7,
      DatabaseInsightsMode: 'standard',
      CopyTagsToSnapshot: false,
      AutoMinorVersionUpgrade: false,
    });
  });

  test('fills the default capacity when only one serverless v2 capacity setting is specified', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new ExpressCluster(stack, 'Cluster', {
      serverlessV2MaxCapacity: 8,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      ServerlessV2ScalingConfiguration: {
        MinCapacity: 0,
        MaxCapacity: 8,
      },
    });
  });

  test('fills the default max capacity when only the min capacity is specified', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new ExpressCluster(stack, 'Cluster', {
      serverlessV2MinCapacity: 0,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      ServerlessV2ScalingConfiguration: {
        MinCapacity: 0,
        MaxCapacity: 16,
      },
    });
  });

  test('accepts token capacity values', () => {
    // GIVEN
    const stack = testStack();
    const minCapacity = new cdk.CfnParameter(stack, 'MinCapacity', { type: 'Number' }).valueAsNumber;
    const maxCapacity = new cdk.CfnParameter(stack, 'MaxCapacity', { type: 'Number' }).valueAsNumber;

    // WHEN
    new ExpressCluster(stack, 'Cluster', {
      serverlessV2MinCapacity: minCapacity,
      serverlessV2MaxCapacity: maxCapacity,
      serverlessV2AutoPauseDuration: cdk.Duration.minutes(10),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      ServerlessV2ScalingConfiguration: {
        MinCapacity: { Ref: 'MinCapacity' },
        MaxCapacity: { Ref: 'MaxCapacity' },
        SecondsUntilAutoPause: 600,
      },
    });
  });

  test('advanced database insights mode defaults the retention to 15 months', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new ExpressCluster(stack, 'Cluster', {
      databaseInsightsMode: DatabaseInsightsMode.ADVANCED,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      PerformanceInsightsEnabled: true,
      PerformanceInsightsRetentionPeriod: 465,
      DatabaseInsightsMode: 'advanced',
    });
  });

  test('enables performance insights with an encryption key', () => {
    // GIVEN
    const stack = testStack();
    const key = new kms.Key(stack, 'Key');

    // WHEN
    new ExpressCluster(stack, 'Cluster', {
      performanceInsightEncryptionKey: key,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      PerformanceInsightsEnabled: true,
      PerformanceInsightsRetentionPeriod: 7,
      PerformanceInsightsKmsKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
    });
  });

  test('sets the log retention for exported logs', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    const cluster = new ExpressCluster(stack, 'Cluster', {
      cloudwatchLogsExports: ['postgresql', 'iam-db-auth-error'],
      cloudwatchLogsRetention: logs.RetentionDays.ONE_WEEK,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.resourceCountIs('Custom::LogRetention', 2);
    template.hasResourceProperties('Custom::LogRetention', {
      LogGroupName: { 'Fn::Join': ['', ['/aws/rds/cluster/', { Ref: 'ClusterEB0386A7' }, '/postgresql']] },
      RetentionInDays: 7,
    });
    expect(Object.keys(cluster.cloudwatchLogGroups)).toEqual(['postgresql', 'iam-db-auth-error']);
  });

  test('warns when the cluster has no tags', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new ExpressCluster(stack, 'Cluster');

    // THEN
    Annotations.fromStack(stack).hasWarning('/Default/Cluster', Match.stringLikeRegexp('at least one tag'));
  });

  test('does not warn when the cluster has tags', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new ExpressCluster(stack, 'Cluster');
    cdk.Tags.of(stack).add('project', 'test');

    // THEN
    Annotations.fromStack(stack).hasNoWarning('/Default/Cluster', Match.stringLikeRegexp('at least one tag'));
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      Tags: [{ Key: 'project', Value: 'test' }],
    });
  });

  test('does not warn when the stack has tags', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, undefined, {
      env: { account: '12345', region: 'us-test-1' },
      tags: { project: 'test' },
    });
    cdk.Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::F3002', reason: 'WithExpressConfiguration is a newly launched property not yet in the bundled schema' });

    // WHEN
    new ExpressCluster(stack, 'Cluster');

    // THEN
    Annotations.fromStack(stack).hasNoWarning('/Default/Cluster', Match.stringLikeRegexp('at least one tag'));
  });

  test('applies tags and does not warn', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new ExpressCluster(stack, 'Cluster', {
      tags: { project: 'test', env: 'dev' },
    });

    // THEN
    Annotations.fromStack(stack).hasNoWarning('/Default/Cluster', Match.stringLikeRegexp('at least one tag'));
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      Tags: [{ Key: 'env', Value: 'dev' }, { Key: 'project', Value: 'test' }],
    });
  });

  test.each([
    ['metricServerlessDatabaseCapacity', 'ServerlessDatabaseCapacity'],
    ['metricACUUtilization', 'ACUUtilization'],
  ] as const)('%s returns the %s metric', (method, metricName) => {
    // GIVEN
    const stack = testStack();
    const cluster = new ExpressCluster(stack, 'Cluster');

    // WHEN
    const metric = cluster[method]();

    // THEN
    expect(metric.metricName).toEqual(metricName);
    expect(metric.namespace).toEqual('AWS/RDS');
    expect(metric.statistic).toEqual('Average');
    expect(stack.resolve(metric.dimensions)).toEqual({ DBClusterIdentifier: { Ref: 'ClusterEB0386A7' } });
  });

  test('fails to grant Data API access', () => {
    // GIVEN
    const stack = testStack();
    const cluster = new ExpressCluster(stack, 'Cluster');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountRootPrincipal() });

    // THEN
    expect(() => cluster.grantDataApiAccess(role)).toThrow('Cannot grant Data API access when the Data API is disabled');
  });

  test('fails with unsupported log types', () => {
    // GIVEN
    const stack = testStack();

    // THEN
    expect(() => new ExpressCluster(stack, 'Cluster', {
      cloudwatchLogsExports: ['postgresql', 'error'],
    })).toThrow('unsupported log types for a cluster with express configuration: ["error"], supported log types are ["postgresql","iam-db-auth-error","instance"]');
  });

  test.each([
    [{ serverlessV2MinCapacity: -1 }, '`serverlessV2MinCapacity` must be between 0 and 256 in 0.5 increments, got -1'],
    [{ serverlessV2MinCapacity: 0.3 }, '`serverlessV2MinCapacity` must be between 0 and 256 in 0.5 increments, got 0.3'],
    [{ serverlessV2MaxCapacity: 257 }, '`serverlessV2MaxCapacity` must be between 1 and 256 in 0.5 increments, got 257'],
    [{ serverlessV2MinCapacity: 4, serverlessV2MaxCapacity: 2 }, '`serverlessV2MaxCapacity` (2) must be greater than or equal to `serverlessV2MinCapacity` (4)'],
    [{ serverlessV2AutoPauseDuration: cdk.Duration.minutes(1) }, '`serverlessV2AutoPauseDuration` must be between 300 seconds (5 minutes) and 86,400 seconds (24 hours), got 60 seconds'],
    [{ serverlessV2MinCapacity: 0.5, serverlessV2AutoPauseDuration: cdk.Duration.minutes(10) }, '`serverlessV2AutoPauseDuration` can only be specified when `serverlessV2MinCapacity` is 0, got 0.5'],
  ])('fails with invalid serverless v2 capacity settings %j', (props, message) => {
    // GIVEN
    const stack = testStack();

    // THEN
    expect(() => new ExpressCluster(stack, 'Cluster', props)).toThrow(message);
  });

  test('fails when performance insights is disabled but required', () => {
    // GIVEN
    const stack = testStack();

    // THEN
    expect(() => new ExpressCluster(stack, 'Cluster', {
      enablePerformanceInsights: false,
      performanceInsightRetention: PerformanceInsightRetention.MONTHS_1,
    })).toThrow('`enablePerformanceInsights` cannot be false when `performanceInsightRetention` or `performanceInsightEncryptionKey` is set, or `databaseInsightsMode` is `DatabaseInsightsMode.ADVANCED`');
  });

  test('fails when advanced database insights mode is used with a short retention', () => {
    // GIVEN
    const stack = testStack();

    // THEN
    expect(() => new ExpressCluster(stack, 'Cluster', {
      databaseInsightsMode: DatabaseInsightsMode.ADVANCED,
      performanceInsightRetention: PerformanceInsightRetention.MONTHS_1,
    })).toThrow('`performanceInsightRetention` must be `PerformanceInsightRetention.MONTHS_15` when `databaseInsightsMode` is `DatabaseInsightsMode.ADVANCED`, got 31 days');
  });

  test('fails to add a proxy', () => {
    // GIVEN
    const stack = testStack();
    const cluster = new ExpressCluster(stack, 'Cluster');

    // THEN
    const secret = new secretsmanager.Secret(stack, 'Secret');
    expect(() => cluster.addProxy('Proxy', { secrets: [secret], vpc: new ec2.Vpc(stack, 'Vpc') })).toThrow('RDS Proxy is not supported for a cluster with express configuration');
  });
});

function testStack() {
  const stack = new cdk.Stack(undefined, undefined, { env: { account: '12345', region: 'us-test-1' } });
  cdk.Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::F3002', reason: 'WithExpressConfiguration is a newly launched property not yet in the bundled schema' });
  return stack;
}
