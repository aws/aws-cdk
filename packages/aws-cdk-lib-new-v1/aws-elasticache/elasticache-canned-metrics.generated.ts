/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class ElastiCacheMetrics {
  public static activeDefragHitsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static activeDefragHitsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static activeDefragHitsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static activeDefragHitsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "ActiveDefragHits",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static authenticationFailuresSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static authenticationFailuresSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static authenticationFailuresSum(dimensions: {  }): MetricWithDims<{  }>;

  public static authenticationFailuresSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "AuthenticationFailures",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static bytesReadIntoMemcachedAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static bytesReadIntoMemcachedAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static bytesReadIntoMemcachedAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static bytesReadIntoMemcachedAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "BytesReadIntoMemcached",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static bytesUsedForCacheAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static bytesUsedForCacheAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static bytesUsedForCacheAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static bytesUsedForCacheAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "BytesUsedForCache",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static bytesUsedForCacheItemsAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static bytesUsedForCacheItemsAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static bytesUsedForCacheItemsAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static bytesUsedForCacheItemsAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "BytesUsedForCacheItems",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static bytesUsedForHashAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static bytesUsedForHashAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static bytesUsedForHashAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static bytesUsedForHashAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "BytesUsedForHash",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static bytesWrittenOutFromMemcachedAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static bytesWrittenOutFromMemcachedAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static bytesWrittenOutFromMemcachedAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static bytesWrittenOutFromMemcachedAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "BytesWrittenOutFromMemcached",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static cacheHitRateAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static cacheHitRateAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static cacheHitRateAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static cacheHitRateAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CacheHitRate",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static cacheHitsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static cacheHitsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static cacheHitsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static cacheHitsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CacheHits",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static cacheMissesSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static cacheMissesSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static cacheMissesSum(dimensions: {  }): MetricWithDims<{  }>;

  public static cacheMissesSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CacheMisses",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static casBadvalSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static casBadvalSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static casBadvalSum(dimensions: {  }): MetricWithDims<{  }>;

  public static casBadvalSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CasBadval",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static casHitsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static casHitsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static casHitsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static casHitsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CasHits",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static casMissesSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static casMissesSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static casMissesSum(dimensions: {  }): MetricWithDims<{  }>;

  public static casMissesSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CasMisses",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static cmdConfigGetSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static cmdConfigGetSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static cmdConfigGetSum(dimensions: {  }): MetricWithDims<{  }>;

  public static cmdConfigGetSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CmdConfigGet",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static cmdConfigSetSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static cmdConfigSetSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static cmdConfigSetSum(dimensions: {  }): MetricWithDims<{  }>;

  public static cmdConfigSetSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CmdConfigSet",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static cmdFlushSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static cmdFlushSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static cmdFlushSum(dimensions: {  }): MetricWithDims<{  }>;

  public static cmdFlushSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CmdFlush",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static cmdGetsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static cmdGetsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static cmdGetsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static cmdGetsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CmdGets",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static cmdSetSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static cmdSetSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static cmdSetSum(dimensions: {  }): MetricWithDims<{  }>;

  public static cmdSetSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CmdSet",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static cmdTouchSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static cmdTouchSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static cmdTouchSum(dimensions: {  }): MetricWithDims<{  }>;

  public static cmdTouchSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CmdTouch",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static commandAuthorizationFailuresSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static commandAuthorizationFailuresSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static commandAuthorizationFailuresSum(dimensions: {  }): MetricWithDims<{  }>;

  public static commandAuthorizationFailuresSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CommandAuthorizationFailures",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static cpuCreditBalanceAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static cpuCreditBalanceAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static cpuCreditBalanceAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static cpuCreditBalanceAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CPUCreditBalance",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static cpuCreditUsageAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static cpuCreditUsageAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static cpuCreditUsageAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static cpuCreditUsageAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CPUCreditUsage",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static cpuUtilizationAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static cpuUtilizationAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static cpuUtilizationAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static cpuUtilizationAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CPUUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static currConfigSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static currConfigSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static currConfigSum(dimensions: {  }): MetricWithDims<{  }>;

  public static currConfigSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CurrConfig",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static currConnectionsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static currConnectionsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static currConnectionsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static currConnectionsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CurrConnections",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static currItemsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static currItemsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static currItemsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static currItemsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "CurrItems",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static databaseMemoryUsagePercentageAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static databaseMemoryUsagePercentageAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static databaseMemoryUsagePercentageAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static databaseMemoryUsagePercentageAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "DatabaseMemoryUsagePercentage",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static db0AverageTtlAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static db0AverageTtlAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static db0AverageTtlAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static db0AverageTtlAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "DB0AverageTTL",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static decrHitsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static decrHitsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static decrHitsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static decrHitsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "DecrHits",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static decrMissesSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static decrMissesSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static decrMissesSum(dimensions: {  }): MetricWithDims<{  }>;

  public static decrMissesSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "DecrMisses",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static deleteHitsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static deleteHitsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static deleteHitsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static deleteHitsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "DeleteHits",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static deleteMissesSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static deleteMissesSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static deleteMissesSum(dimensions: {  }): MetricWithDims<{  }>;

  public static deleteMissesSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "DeleteMisses",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static engineCpuUtilizationAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static engineCpuUtilizationAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static engineCpuUtilizationAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static engineCpuUtilizationAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "EngineCPUUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static evalBasedCmdsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static evalBasedCmdsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static evalBasedCmdsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static evalBasedCmdsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "EvalBasedCmds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static evalBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static evalBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static evalBasedCmdsLatencyAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static evalBasedCmdsLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "EvalBasedCmdsLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static evictedUnfetchedSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static evictedUnfetchedSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static evictedUnfetchedSum(dimensions: {  }): MetricWithDims<{  }>;

  public static evictedUnfetchedSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "EvictedUnfetched",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static evictionsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static evictionsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static evictionsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static evictionsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "Evictions",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static expiredUnfetchedSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static expiredUnfetchedSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static expiredUnfetchedSum(dimensions: {  }): MetricWithDims<{  }>;

  public static expiredUnfetchedSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "ExpiredUnfetched",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static freeableMemoryAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static freeableMemoryAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static freeableMemoryAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static freeableMemoryAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "FreeableMemory",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static geoSpatialBasedCmdsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static geoSpatialBasedCmdsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static geoSpatialBasedCmdsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static geoSpatialBasedCmdsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "GeoSpatialBasedCmds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static geoSpatialBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static geoSpatialBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static geoSpatialBasedCmdsLatencyAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static geoSpatialBasedCmdsLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "GeoSpatialBasedCmdsLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static getHitsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static getHitsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static getHitsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static getHitsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "GetHits",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static getMissesSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static getMissesSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static getMissesSum(dimensions: {  }): MetricWithDims<{  }>;

  public static getMissesSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "GetMisses",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static getTypeCmdsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static getTypeCmdsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static getTypeCmdsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static getTypeCmdsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "GetTypeCmds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static getTypeCmdsLatencyAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static getTypeCmdsLatencyAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static getTypeCmdsLatencyAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static getTypeCmdsLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "GetTypeCmdsLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static globalDatastoreReplicationLagAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static globalDatastoreReplicationLagAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static globalDatastoreReplicationLagAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static globalDatastoreReplicationLagAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "GlobalDatastoreReplicationLag",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static hashBasedCmdsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static hashBasedCmdsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static hashBasedCmdsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static hashBasedCmdsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "HashBasedCmds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static hashBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static hashBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static hashBasedCmdsLatencyAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static hashBasedCmdsLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "HashBasedCmdsLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static hyperLogLogBasedCmdsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static hyperLogLogBasedCmdsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static hyperLogLogBasedCmdsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static hyperLogLogBasedCmdsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "HyperLogLogBasedCmds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static hyperLogLogBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static hyperLogLogBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static hyperLogLogBasedCmdsLatencyAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static hyperLogLogBasedCmdsLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "HyperLogLogBasedCmdsLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static incrHitsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static incrHitsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static incrHitsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static incrHitsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "IncrHits",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static incrMissesSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static incrMissesSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static incrMissesSum(dimensions: {  }): MetricWithDims<{  }>;

  public static incrMissesSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "IncrMisses",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static isMasterAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static isMasterAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static isMasterAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static isMasterAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "IsMaster",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static keyAuthorizationFailuresSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static keyAuthorizationFailuresSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static keyAuthorizationFailuresSum(dimensions: {  }): MetricWithDims<{  }>;

  public static keyAuthorizationFailuresSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "KeyAuthorizationFailures",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static keyBasedCmdsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static keyBasedCmdsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static keyBasedCmdsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static keyBasedCmdsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "KeyBasedCmds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static keyBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static keyBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static keyBasedCmdsLatencyAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static keyBasedCmdsLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "KeyBasedCmdsLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static keysTrackedSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static keysTrackedSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static keysTrackedSum(dimensions: {  }): MetricWithDims<{  }>;

  public static keysTrackedSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "KeysTracked",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static listBasedCmdsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static listBasedCmdsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static listBasedCmdsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static listBasedCmdsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "ListBasedCmds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static listBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static listBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static listBasedCmdsLatencyAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static listBasedCmdsLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "ListBasedCmdsLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static masterLinkHealthStatusAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static masterLinkHealthStatusAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static masterLinkHealthStatusAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static masterLinkHealthStatusAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "MasterLinkHealthStatus",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static memoryFragmentationRatioAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static memoryFragmentationRatioAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static memoryFragmentationRatioAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static memoryFragmentationRatioAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "MemoryFragmentationRatio",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static networkBytesInAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static networkBytesInAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static networkBytesInAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static networkBytesInAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "NetworkBytesIn",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static networkBytesOutAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static networkBytesOutAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static networkBytesOutAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static networkBytesOutAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "NetworkBytesOut",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static networkPacketsInAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static networkPacketsInAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static networkPacketsInAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static networkPacketsInAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "NetworkPacketsIn",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static networkPacketsOutAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static networkPacketsOutAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static networkPacketsOutAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static networkPacketsOutAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "NetworkPacketsOut",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static newConnectionsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static newConnectionsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static newConnectionsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static newConnectionsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "NewConnections",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static newItemsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static newItemsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static newItemsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static newItemsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "NewItems",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static pubSubBasedCmdsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static pubSubBasedCmdsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static pubSubBasedCmdsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static pubSubBasedCmdsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "PubSubBasedCmds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static pubSubBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static pubSubBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static pubSubBasedCmdsLatencyAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static pubSubBasedCmdsLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "PubSubBasedCmdsLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static reclaimedSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static reclaimedSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static reclaimedSum(dimensions: {  }): MetricWithDims<{  }>;

  public static reclaimedSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "Reclaimed",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static replicationBytesSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static replicationBytesSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static replicationBytesSum(dimensions: {  }): MetricWithDims<{  }>;

  public static replicationBytesSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "ReplicationBytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static replicationLagAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static replicationLagAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static replicationLagAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static replicationLagAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "ReplicationLag",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static saveInProgressSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static saveInProgressSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static saveInProgressSum(dimensions: {  }): MetricWithDims<{  }>;

  public static saveInProgressSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "SaveInProgress",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static setBasedCmdsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static setBasedCmdsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static setBasedCmdsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static setBasedCmdsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "SetBasedCmds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static setBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static setBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static setBasedCmdsLatencyAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static setBasedCmdsLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "SetBasedCmdsLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static setTypeCmdsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static setTypeCmdsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static setTypeCmdsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static setTypeCmdsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "SetTypeCmds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static setTypeCmdsLatencyAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static setTypeCmdsLatencyAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static setTypeCmdsLatencyAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static setTypeCmdsLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "SetTypeCmdsLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static slabsMovedSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static slabsMovedSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static slabsMovedSum(dimensions: {  }): MetricWithDims<{  }>;

  public static slabsMovedSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "SlabsMoved",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static sortedSetBasedCmdsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static sortedSetBasedCmdsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static sortedSetBasedCmdsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static sortedSetBasedCmdsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "SortedSetBasedCmds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static sortedSetBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static sortedSetBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static sortedSetBasedCmdsLatencyAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static sortedSetBasedCmdsLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "SortedSetBasedCmdsLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static streamBasedCmdsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static streamBasedCmdsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static streamBasedCmdsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static streamBasedCmdsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "StreamBasedCmds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static streamBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static streamBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static streamBasedCmdsLatencyAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static streamBasedCmdsLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "StreamBasedCmdsLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static stringBasedCmdsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static stringBasedCmdsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static stringBasedCmdsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static stringBasedCmdsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "StringBasedCmds",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static stringBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static stringBasedCmdsLatencyAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static stringBasedCmdsLatencyAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static stringBasedCmdsLatencyAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "StringBasedCmdsLatency",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static swapUsageAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static swapUsageAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static swapUsageAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static swapUsageAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "SwapUsage",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static touchHitsSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static touchHitsSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static touchHitsSum(dimensions: {  }): MetricWithDims<{  }>;

  public static touchHitsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "TouchHits",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static touchMissesSum(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static touchMissesSum(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static touchMissesSum(dimensions: {  }): MetricWithDims<{  }>;

  public static touchMissesSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "TouchMisses",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static unusedMemoryAverage(dimensions: { CacheClusterId: string; }): MetricWithDims<{ CacheClusterId: string; }>;

  public static unusedMemoryAverage(dimensions: { CacheClusterId: string; CacheNodeId: string; }): MetricWithDims<{ CacheClusterId: string; CacheNodeId: string; }>;

  public static unusedMemoryAverage(dimensions: {  }): MetricWithDims<{  }>;

  public static unusedMemoryAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ElastiCache",
      "metricName": "UnusedMemory",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}