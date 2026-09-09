import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import type * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import type * as kms from 'aws-cdk-lib/aws-kms';
import type { IResource } from 'aws-cdk-lib/core';
import { Resource, Duration } from 'aws-cdk-lib/core';
import type { aws_elasticache } from 'aws-cdk-lib/interfaces';
type IServerlessCacheRef = aws_elasticache.IServerlessCacheRef;
type ServerlessCacheReference = aws_elasticache.ServerlessCacheReference;
import { ServerlessCacheGrants } from './elasticache-grants.generated';
import type { IUserGroup } from './user-group';

/**
 * Supported cache engines together with available versions.
 *
 * Named instances cover the versions currently available on ElastiCache Serverless.
 * To target a version that is not yet represented by a named instance, use
 * `CacheEngine.of(engineType, majorEngineVersion)`.
 *
 * @see https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html
 */
export class CacheEngine {
  /**
   * Valkey engine, latest major version available, minor version is selected automatically.
   */
  public static readonly VALKEY_LATEST = CacheEngine.of('valkey');

  /**
   * Valkey engine, major version 7, minor version is selected automatically.
   */
  public static readonly VALKEY_7 = CacheEngine.of('valkey', '7');

  /**
   * Valkey engine, major version 8, minor version is selected automatically.
   */
  public static readonly VALKEY_8 = CacheEngine.of('valkey', '8');

  /**
   * Valkey engine, major version 9, minor version is selected automatically.
   */
  public static readonly VALKEY_9 = CacheEngine.of('valkey', '9');

  /**
   * Redis engine, latest major version available, minor version is selected automatically.
   */
  public static readonly REDIS_LATEST = CacheEngine.of('redis');

  /**
   * Redis engine, major version 7, minor version is selected automatically.
   */
  public static readonly REDIS_7 = CacheEngine.of('redis', '7');

  /**
   * Memcached engine, latest major version available, minor version is selected automatically.
   */
  public static readonly MEMCACHED_LATEST = CacheEngine.of('memcached');

  /**
   * Memcached engine, minor version 1.6, patch version is selected automatically.
   */
  public static readonly MEMCACHED_1_6 = CacheEngine.of('memcached', '1.6');

  /**
   * Create a new `CacheEngine` with an arbitrary engine type and major version.
   *
   * Use this for engine/version combinations that are not yet represented by a
   * named static member.
   *
   * @param engineType the engine type (for example, `'valkey'`, `'redis'`, or `'memcached'`)
   * @param majorEngineVersion the major engine version (for example, `'9'`). When omitted,
   *   the latest major version available is selected by the service.
   */
  public static of(engineType: string, majorEngineVersion?: string): CacheEngine {
    return new CacheEngine(engineType, majorEngineVersion);
  }

  /**
   * The engine type, for example `'valkey'`, `'redis'`, or `'memcached'`.
   * Maps directly to the `Engine` property of `AWS::ElastiCache::ServerlessCache`.
   */
  public readonly engineType: string;

  /**
   * The major engine version, for example `'9'` or `'1.6'`.
   * Maps directly to the `MajorEngineVersion` property of
   * `AWS::ElastiCache::ServerlessCache`. When `undefined`, the service selects
   * the latest major version automatically.
   */
  public readonly majorEngineVersion?: string;

  private constructor(engineType: string, majorEngineVersion?: string) {
    this.engineType = engineType;
    this.majorEngineVersion = majorEngineVersion;
  }

  /**
   * Returns a string representation of this cache engine, for logging and
   * error messages. The format is `engineType_majorEngineVersion` when a
   * major version is set, or just `engineType` otherwise (for example,
   * `'valkey_8'`, `'memcached_1.6'`, `'redis'`).
   */
  public toString(): string {
    return this.majorEngineVersion ? `${this.engineType}_${this.majorEngineVersion}` : this.engineType;
  }
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
