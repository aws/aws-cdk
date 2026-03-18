import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import type * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import type * as kms from 'aws-cdk-lib/aws-kms';
import type { IResource } from 'aws-cdk-lib/core';
import { Resource, Duration } from 'aws-cdk-lib/core';
import type {
  IServerlessCacheRef,
  ServerlessCacheReference,
} from 'aws-cdk-lib/interfaces/generated/aws-elasticache-interfaces.generated';
import { ServerlessCacheGrants } from './elasticache-grants.generated';
import type { IUserGroup } from './user-group';

/**
 * Supported cache engines together with available versions.
 */
export enum CacheEngine {
  /**
   * Valkey engine, latest major version available, minor version is selected automatically
   * For more information about the features related to this version check: https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html
   */
  VALKEY_LATEST = 'valkey',
  /**
   * Valkey engine, major version 7, minor version is selected automatically
   * For more information about the features related to this version check: https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html
   */
  VALKEY_7 = 'valkey_7',
  /**
   * Valkey engine, major version 8, minor version is selected automatically
   * For more information about the features related to this version check: https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html
   */
  VALKEY_8 = 'valkey_8',
  /**
   * Redis engine, latest major version available, minor version is selected automatically
   * For more information about the features related to this version check: https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html
   */
  REDIS_LATEST = 'redis',
  /**
   * Redis engine, major version 7, minor version is selected automatically
   * For more information about the features related to this version check: https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html
   */
  REDIS_7 = 'redis_7',
  /**
   * Memcached engine, latest major version available, minor version is selected automatically
   * For more information about the features related to this version check: https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html
   */
  MEMCACHED_LATEST = 'memcached',
  /**
   * Memcached engine, minor version 1.6, patch version is selected automatically
   * For more information about the features related to this version check: https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html
   */
  MEMCACHED_1_6 = 'memcached_1.6',
}

/**
 * Represents a Serverless ElastiCache cache
 */
export interface IServerlessCache extends IResource, ec2.IConnectable, IServerlessCacheRef {
  /**
   * The cache engine used by this cache
   */
  readonly engine?: CacheEngine;
  /**
   * The name of the serverless cache
   *
   * @attribute
   */
  readonly serverlessCacheName: string;
  /**
   * The ARNs of backups restored in the cache
   */
  readonly backupArnsToRestore?: string[];
  /**
   * The KMS key used for encryption
   */
  readonly kmsKey?: kms.IKey;
  /**
   * The VPC this cache is deployed in
   */
  readonly vpc?: ec2.IVpc;
  /**
   * The subnets this cache is deployed in
   */
  readonly subnets?: ec2.ISubnet[];
  /**
   * The security groups associated with this cache
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
  /**
   * The user group associated with this cache
   */
  readonly userGroup?: IUserGroup;
  /**
   * The ARN of the serverless cache
   *
   * @attribute
   */
  readonly serverlessCacheArn: string;

  /**
   * Grant connect permissions to the cache
   */
  grantConnect(grantee: iam.IGrantable): iam.Grant;
  /**
   * Grant the given identity custom permissions
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Return the given named metric for this cache
   */
  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
  /**
   * Metric for cache hit count
   */
  metricCacheHitCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
  /**
   * Metric for cache miss count
   */
  metricCacheMissCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
  /**
   * Metric for cache hit rate
   */
  metricCacheHitRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
  /**
   * Metric for data stored in the cache
   */
  metricDataStored(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
  /**
   * Metric for ECPUs consumed
   */
  metricProcessingUnitsConsumed(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
  /**
   * Metric for network bytes in
   */
  metricNetworkBytesIn(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
  /**
   * Metric for network bytes out
   */
  metricNetworkBytesOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
  /**
   * Metric for active connections
   */
  metricActiveConnections(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
  /**
   * Metric for write request latency
   */
  metricWriteRequestLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
  /**
   * Metric for read request latency
   */
  metricReadRequestLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}

/**
 * Base class for ServerlessCache constructs
 */
export abstract class ServerlessCacheBase extends Resource implements IServerlessCache {
  public abstract readonly engine?: CacheEngine;
  public abstract readonly serverlessCacheName: string;
  public abstract readonly backupArnsToRestore?: string[];
  public abstract readonly kmsKey?: kms.IKey;
  public abstract readonly vpc?: ec2.IVpc;
  public abstract readonly subnets?: ec2.ISubnet[];
  public abstract readonly securityGroups?: ec2.ISecurityGroup[];
  public abstract readonly userGroup?: IUserGroup;

  public abstract readonly serverlessCacheArn: string;

  /**
   * Access to network connections.
   */
  public abstract readonly connections: ec2.Connections;

  /**
   * Collection of grant methods for this cache
   */
  public readonly grants = ServerlessCacheGrants.fromServerlessCache(this);

  public get serverlessCacheRef(): ServerlessCacheReference {
    return {
      serverlessCacheName: this.serverlessCacheName,
      serverlessCacheArn: this.serverlessCacheArn,
    };
  }

  /**
   * Grant connect permissions to the cache
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal to grant permissions to
   */
  public grantConnect(grantee: iam.IGrantable): iam.Grant {
    return this.grants.connect(grantee);
  }
  /**
   * Grant the given identity custom permissions
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal to grant permissions to
   * @param actions The actions to grant
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.serverlessCacheArn],
    });
  }

  /**
   * Return the given named metric for this cache
   *
   * @param metricName The name of the metric
   * @param props Additional properties which will be merged with the default metric
   * @default Average over 5 minutes
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/ElastiCache',
      metricName,
      dimensionsMap: {
        ServerlessCacheName: this.serverlessCacheName,
      },
      period: Duration.minutes(5),
      statistic: 'Average',
      ...props,
    }).attachTo(this);
  }
  /**
   * Metric for cache hit count
   *
   * @param props Additional properties which will be merged with the default metric
   * @default Sum over 5 minutes
   */
  public metricCacheHitCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('CacheHits', { statistic: 'Sum', ...props });
  }
  /**
   * Metric for cache miss count
   *
   * @param props Additional properties which will be merged with the default metric
   * @default Sum over 5 minutes
   */
  public metricCacheMissCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('CacheMisses', { statistic: 'Sum', ...props });
  }
  /**
   * Metric for cache hit rate
   *
   * @param props Additional properties which will be merged with the default metric
   * @default Average over 5 minutes
   */
  public metricCacheHitRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('CacheHitRate', props);
  }
  /**
   * Metric for data stored in the cache
   *
   * @param props Additional properties which will be merged with the default metric
   * @default Maximum over 5 minutes
   */
  public metricDataStored(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('BytesUsedForCache', { statistic: 'Maximum', ...props });
  }
  /**
   * Metric for ECPUs consumed
   *
   * @param props Additional properties which will be merged with the default metric
   * @default Average over 5 minutes
   */
  public metricProcessingUnitsConsumed(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('ElastiCacheProcessingUnits', props);
  }
  /**
   * Metric for network bytes in
   *
   * @param props Additional properties which will be merged with the default metric
   * @default Sum over 5 minutes
   */
  public metricNetworkBytesIn(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('NetworkBytesIn', { statistic: 'Sum', ...props });
  }
  /**
   * Metric for network bytes out
   *
   * @param props Additional properties which will be merged with the default metric
   * @default Sum over 5 minutes
   */
  public metricNetworkBytesOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('NetworkBytesOut', { statistic: 'Sum', ...props });
  }
  /**
   * Metric for active connections
   *
   * @param props Additional properties which will be merged with the default metric
   * @default Maximum over 5 minutes
   */
  public metricActiveConnections(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('CurrConnections', { statistic: 'Maximum', ...props });
  }
  /**
   * Metric for write request latency
   *
   * @param props Additional properties which will be merged with the default metric
   * @default Average over 5 minutes
   */
  public metricWriteRequestLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('SuccessfulWriteRequestLatency', props);
  }
  /**
   * Metric for read request latency
   *
   * @param props Additional properties which will be merged with the default metric
   * @default Average over 5 minutes
   */
  public metricReadRequestLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('SuccessfulReadRequestLatency', props);
  }
}
