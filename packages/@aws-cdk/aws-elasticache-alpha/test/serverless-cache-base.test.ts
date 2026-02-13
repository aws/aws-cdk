import { Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { Alarm, ComparisonOperator } from 'aws-cdk-lib/aws-cloudwatch';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { ServerlessCache, ServerlessCacheGrants } from '../lib';
import { CfnServerlessCache } from "aws-cdk-lib/aws-elasticache";

describe('serverless cache base', () => {
  describe('metrics', () => {
    let stack: Stack, vpc: Vpc, cache: ServerlessCache;
    beforeEach(() => {
      stack = new Stack();
      vpc = new Vpc(stack, 'VPC');
      cache = new ServerlessCache(stack, 'Cache', {
        vpc,
      });
    });

    test('creating an alarm based on metric', () => {
      const metric = cache.metric('Metric', {});
      new Alarm(stack, 'Alarm', {
        evaluationPeriods: 1,
        threshold: 1,
        comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
        metric: metric,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
        Namespace: 'AWS/ElastiCache',
        MetricName: 'Metric',
        Dimensions: [
          {
            Name: 'ServerlessCacheName',
            Value: stack.resolve(cache.serverlessCacheName),
          },
        ],
        ComparisonOperator: 'LessThanThreshold',
        EvaluationPeriods: 1,
        Threshold: 1,
      });
    });

    test.each([
      {
        testDescription: 'creating an alarm based on cache hit metric',
        methodName: 'metricCacheHitCount',
        metricName: 'CacheHits',
      },
      {
        testDescription: 'creating an alarm based on cache miss count metric',
        methodName: 'metricCacheMissCount',
        metricName: 'CacheMisses',
      },
      {
        testDescription: 'creating an alarm based on cache hit rate metric',
        methodName: 'metricCacheHitRate',
        metricName: 'CacheHitRate',
      },
      {
        testDescription: 'creating an alarm based on cache data stored metric',
        methodName: 'metricDataStored',
        metricName: 'BytesUsedForCache',
      },
      {
        testDescription: 'creating an alarm based on cache ECPUs consumed metric',
        methodName: 'metricProcessingUnitsConsumed',
        metricName: 'ElastiCacheProcessingUnits',
      },
      {
        testDescription: 'creating an alarm based on cache newtork bytes in metric',
        methodName: 'metricNetworkBytesIn',
        metricName: 'NetworkBytesIn',
      },
      {
        testDescription: 'creating an alarm based on cache network bytes out metric',
        methodName: 'metricNetworkBytesOut',
        metricName: 'NetworkBytesOut',
      },
      {
        testDescription: 'creating an alarm based on cache active connections metric',
        methodName: 'metricActiveConnections',
        metricName: 'CurrConnections',
      },
      {
        testDescription: 'creating an alarm based on cache write request latency metric',
        methodName: 'metricWriteRequestLatency',
        metricName: 'SuccessfulWriteRequestLatency',
      },
      {
        testDescription: 'creating an alarm based on cache read request latency metric',
        methodName: 'metricReadRequestLatency',
        metricName: 'SuccessfulReadRequestLatency',
      },
    ] as const)('$testDescription', ({ methodName, metricName }) => {
      const metric = cache[methodName]({});
      new Alarm(stack, 'Alarm', {
        evaluationPeriods: 1,
        threshold: 1,
        comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
        metric: metric,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
        Namespace: 'AWS/ElastiCache',
        MetricName: metricName,
        Dimensions: [
          {
            Name: 'ServerlessCacheName',
            Value: stack.resolve(cache.serverlessCacheName),
          },
        ],
        ComparisonOperator: 'LessThanThreshold',
        EvaluationPeriods: 1,
        Threshold: 1,
      });
    });
  });

  describe('IAM permissions', () => {
    let role: Role, stack: Stack, vpc: Vpc, cache: ServerlessCache;

    beforeEach(() => {
      stack = new Stack();
      vpc = new Vpc(stack, 'VPC');
      cache = new ServerlessCache(stack, 'Cache', {
        vpc,
      });
      role = new Role(stack, 'TestRole', {
        assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      });
    });

    test('grantConnect adds correct  permissions', () => {
      cache.grantConnect(role);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Effect: 'Allow',
              Action: [
                'elasticache:Connect',
                'elasticache:DescribeServerlessCaches',
              ],
              Resource: {
                'Fn::GetAtt': [
                  'Cache18F6EE16',
                  'ARN',
                ],
              },
            },
          ]),
        },
      });
    });

    test('grant adds custom IAM permissions', () => {
      cache.grant(role, 'elasticache:Connect');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Effect: 'Allow',
              Action: 'elasticache:Connect',
              Resource: { 'Fn::GetAtt': ['Cache18F6EE16', 'ARN'] },
            },
          ]),
        },
      });
    });

    test('grant adds custom IAM permissions to L1', () => {
      const cfnCache = new CfnServerlessCache(stack, 'CfnCache', {
        serverlessCacheName: 'MyCache',
        engine: 'redis',
      });
      ServerlessCacheGrants.fromServerlessCache(cfnCache).actions(role, ['elasticache:Connect']);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Effect: 'Allow',
              Action: 'elasticache:Connect',
              Resource: { 'Fn::GetAtt': ['CfnCache', 'ARN'] },
            },
          ]),
        },
      });
    });
  });
});
