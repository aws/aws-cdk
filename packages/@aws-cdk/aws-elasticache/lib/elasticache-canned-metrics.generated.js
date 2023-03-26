"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElastiCacheMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class ElastiCacheMetrics {
    static activeDefragHitsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'ActiveDefragHits',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static authenticationFailuresSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'AuthenticationFailures',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static bytesReadIntoMemcachedAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'BytesReadIntoMemcached',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static bytesUsedForCacheAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'BytesUsedForCache',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static bytesUsedForCacheItemsAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'BytesUsedForCacheItems',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static bytesUsedForHashAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'BytesUsedForHash',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static bytesWrittenOutFromMemcachedAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'BytesWrittenOutFromMemcached',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static cacheHitRateAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CacheHitRate',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static cacheHitsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CacheHits',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cacheMissesSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CacheMisses',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static casBadvalSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CasBadval',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static casHitsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CasHits',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static casMissesSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CasMisses',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cmdConfigGetSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CmdConfigGet',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cmdConfigSetSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CmdConfigSet',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cmdFlushSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CmdFlush',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cmdGetsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CmdGets',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cmdSetSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CmdSet',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cmdTouchSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CmdTouch',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static commandAuthorizationFailuresSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CommandAuthorizationFailures',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cpuCreditBalanceAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CPUCreditBalance',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static cpuCreditUsageAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CPUCreditUsage',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static cpuUtilizationAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CPUUtilization',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static currConfigSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CurrConfig',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static currConnectionsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CurrConnections',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static currItemsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'CurrItems',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static databaseMemoryUsagePercentageAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'DatabaseMemoryUsagePercentage',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static db0AverageTtlAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'DB0AverageTTL',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static decrHitsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'DecrHits',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static decrMissesSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'DecrMisses',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static deleteHitsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'DeleteHits',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static deleteMissesSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'DeleteMisses',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static engineCpuUtilizationAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'EngineCPUUtilization',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static evalBasedCmdsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'EvalBasedCmds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static evalBasedCmdsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'EvalBasedCmdsLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static evictedUnfetchedSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'EvictedUnfetched',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static evictionsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'Evictions',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static expiredUnfetchedSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'ExpiredUnfetched',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static freeableMemoryAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'FreeableMemory',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static geoSpatialBasedCmdsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'GeoSpatialBasedCmds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static geoSpatialBasedCmdsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'GeoSpatialBasedCmdsLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static getHitsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'GetHits',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static getMissesSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'GetMisses',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static getTypeCmdsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'GetTypeCmds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static getTypeCmdsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'GetTypeCmdsLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static globalDatastoreReplicationLagAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'GlobalDatastoreReplicationLag',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static hashBasedCmdsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'HashBasedCmds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static hashBasedCmdsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'HashBasedCmdsLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static hyperLogLogBasedCmdsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'HyperLogLogBasedCmds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static hyperLogLogBasedCmdsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'HyperLogLogBasedCmdsLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static incrHitsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'IncrHits',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static incrMissesSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'IncrMisses',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static isMasterAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'IsMaster',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static keyAuthorizationFailuresSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'KeyAuthorizationFailures',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static keyBasedCmdsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'KeyBasedCmds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static keyBasedCmdsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'KeyBasedCmdsLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static keysTrackedSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'KeysTracked',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static listBasedCmdsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'ListBasedCmds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static listBasedCmdsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'ListBasedCmdsLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static masterLinkHealthStatusAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'MasterLinkHealthStatus',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static memoryFragmentationRatioAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'MemoryFragmentationRatio',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static networkBytesInAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'NetworkBytesIn',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static networkBytesOutAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'NetworkBytesOut',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static networkPacketsInAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'NetworkPacketsIn',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static networkPacketsOutAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'NetworkPacketsOut',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static newConnectionsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'NewConnections',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static newItemsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'NewItems',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static pubSubBasedCmdsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'PubSubBasedCmds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static pubSubBasedCmdsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'PubSubBasedCmdsLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static reclaimedSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'Reclaimed',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static replicationBytesSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'ReplicationBytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static replicationLagAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'ReplicationLag',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static saveInProgressSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'SaveInProgress',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static setBasedCmdsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'SetBasedCmds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static setBasedCmdsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'SetBasedCmdsLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static setTypeCmdsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'SetTypeCmds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static setTypeCmdsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'SetTypeCmdsLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static slabsMovedSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'SlabsMoved',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static sortedSetBasedCmdsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'SortedSetBasedCmds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static sortedSetBasedCmdsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'SortedSetBasedCmdsLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static streamBasedCmdsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'StreamBasedCmds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static streamBasedCmdsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'StreamBasedCmdsLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static stringBasedCmdsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'StringBasedCmds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static stringBasedCmdsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'StringBasedCmdsLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static swapUsageAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'SwapUsage',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static touchHitsSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'TouchHits',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static touchMissesSum(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'TouchMisses',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static unusedMemoryAverage(dimensions) {
        return {
            namespace: 'AWS/ElastiCache',
            metricName: 'UnusedMemory',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.ElastiCacheMetrics = ElastiCacheMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpY2FjaGUtY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWxhc3RpY2FjaGUtY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrRUFBK0U7OztBQUUvRSw0QkFBNEIsQ0FBQyxpRUFBaUU7QUFFOUYsTUFBYSxrQkFBa0I7SUFJdEIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQWU7UUFDL0MsT0FBTztZQUNMLFNBQVMsRUFBRSxpQkFBaUI7WUFDNUIsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFJTSxNQUFNLENBQUMseUJBQXlCLENBQUMsVUFBZTtRQUNyRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLGlCQUFpQjtZQUM1QixVQUFVLEVBQUUsd0JBQXdCO1lBQ3BDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUlNLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxVQUFlO1FBQ3pELE9BQU87WUFDTCxTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLFVBQVUsRUFBRSx3QkFBd0I7WUFDcEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBSU0sTUFBTSxDQUFDLHdCQUF3QixDQUFDLFVBQWU7UUFDcEQsT0FBTztZQUNMLFNBQVMsRUFBRSxpQkFBaUI7WUFDNUIsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFJTSxNQUFNLENBQUMsNkJBQTZCLENBQUMsVUFBZTtRQUN6RCxPQUFPO1lBQ0wsU0FBUyxFQUFFLGlCQUFpQjtZQUM1QixVQUFVLEVBQUUsd0JBQXdCO1lBQ3BDLGFBQWEsRUFB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QUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFJTSxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQWU7UUFDMUMsT0FBTztZQUNMLFNBQVMsRUFBRSxpQkFBaUI7WUFDNUIsVUFBVSxFQUFFLGFBQWE7WUFDekIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBSU0sTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQWU7UUFDL0MsT0FBTztZQUNMLFNBQVMsRUFBRSxpQkFBaUI7WUFDNUIsVUFBVSxFQUFFLGNBQWM7WUFDMUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0NBQ0Y7QUF6OEJELGdEQXk4QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIEVsYXN0aUNhY2hlTWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgYWN0aXZlRGVmcmFnSGl0c1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBhY3RpdmVEZWZyYWdIaXRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGFjdGl2ZURlZnJhZ0hpdHNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGFjdGl2ZURlZnJhZ0hpdHNTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnQWN0aXZlRGVmcmFnSGl0cycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYXV0aGVudGljYXRpb25GYWlsdXJlc1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBhdXRoZW50aWNhdGlvbkZhaWx1cmVzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGF1dGhlbnRpY2F0aW9uRmFpbHVyZXNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGF1dGhlbnRpY2F0aW9uRmFpbHVyZXNTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnQXV0aGVudGljYXRpb25GYWlsdXJlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYnl0ZXNSZWFkSW50b01lbWNhY2hlZEF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgYnl0ZXNSZWFkSW50b01lbWNhY2hlZEF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgYnl0ZXNSZWFkSW50b01lbWNhY2hlZEF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGJ5dGVzUmVhZEludG9NZW1jYWNoZWRBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0J5dGVzUmVhZEludG9NZW1jYWNoZWQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBieXRlc1VzZWRGb3JDYWNoZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgYnl0ZXNVc2VkRm9yQ2FjaGVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGJ5dGVzVXNlZEZvckNhY2hlQXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgYnl0ZXNVc2VkRm9yQ2FjaGVBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0J5dGVzVXNlZEZvckNhY2hlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYnl0ZXNVc2VkRm9yQ2FjaGVJdGVtc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgYnl0ZXNVc2VkRm9yQ2FjaGVJdGVtc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgYnl0ZXNVc2VkRm9yQ2FjaGVJdGVtc0F2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGJ5dGVzVXNlZEZvckNhY2hlSXRlbXNBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0J5dGVzVXNlZEZvckNhY2hlSXRlbXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBieXRlc1VzZWRGb3JIYXNoQXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBieXRlc1VzZWRGb3JIYXNoQXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBieXRlc1VzZWRGb3JIYXNoQXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgYnl0ZXNVc2VkRm9ySGFzaEF2ZXJhZ2UoZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnQnl0ZXNVc2VkRm9ySGFzaCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGJ5dGVzV3JpdHRlbk91dEZyb21NZW1jYWNoZWRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGJ5dGVzV3JpdHRlbk91dEZyb21NZW1jYWNoZWRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGJ5dGVzV3JpdHRlbk91dEZyb21NZW1jYWNoZWRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBieXRlc1dyaXR0ZW5PdXRGcm9tTWVtY2FjaGVkQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdCeXRlc1dyaXR0ZW5PdXRGcm9tTWVtY2FjaGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY2FjaGVIaXRSYXRlQXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBjYWNoZUhpdFJhdGVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNhY2hlSGl0UmF0ZUF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGNhY2hlSGl0UmF0ZUF2ZXJhZ2UoZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnQ2FjaGVIaXRSYXRlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY2FjaGVIaXRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNhY2hlSGl0c1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBjYWNoZUhpdHNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGNhY2hlSGl0c1N1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDYWNoZUhpdHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNhY2hlTWlzc2VzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNhY2hlTWlzc2VzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNhY2hlTWlzc2VzU3VtKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBjYWNoZU1pc3Nlc1N1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDYWNoZU1pc3NlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY2FzQmFkdmFsU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNhc0JhZHZhbFN1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBjYXNCYWR2YWxTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGNhc0JhZHZhbFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDYXNCYWR2YWwnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNhc0hpdHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgY2FzSGl0c1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBjYXNIaXRzU3VtKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBjYXNIaXRzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0Nhc0hpdHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNhc01pc3Nlc1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBjYXNNaXNzZXNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgY2FzTWlzc2VzU3VtKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBjYXNNaXNzZXNTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnQ2FzTWlzc2VzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjbWRDb25maWdHZXRTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgY21kQ29uZmlnR2V0U3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNtZENvbmZpZ0dldFN1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgY21kQ29uZmlnR2V0U3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0NtZENvbmZpZ0dldCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY21kQ29uZmlnU2V0U3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNtZENvbmZpZ1NldFN1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBjbWRDb25maWdTZXRTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGNtZENvbmZpZ1NldFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDbWRDb25maWdTZXQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNtZEZsdXNoU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNtZEZsdXNoU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNtZEZsdXNoU3VtKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBjbWRGbHVzaFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDbWRGbHVzaCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY21kR2V0c1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBjbWRHZXRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNtZEdldHNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGNtZEdldHNTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnQ21kR2V0cycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY21kU2V0U3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNtZFNldFN1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBjbWRTZXRTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGNtZFNldFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDbWRTZXQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNtZFRvdWNoU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNtZFRvdWNoU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNtZFRvdWNoU3VtKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBjbWRUb3VjaFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDbWRUb3VjaCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY29tbWFuZEF1dGhvcml6YXRpb25GYWlsdXJlc1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBjb21tYW5kQXV0aG9yaXphdGlvbkZhaWx1cmVzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNvbW1hbmRBdXRob3JpemF0aW9uRmFpbHVyZXNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGNvbW1hbmRBdXRob3JpemF0aW9uRmFpbHVyZXNTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnQ29tbWFuZEF1dGhvcml6YXRpb25GYWlsdXJlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY3B1Q3JlZGl0QmFsYW5jZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgY3B1Q3JlZGl0QmFsYW5jZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgY3B1Q3JlZGl0QmFsYW5jZUF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGNwdUNyZWRpdEJhbGFuY2VBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0NQVUNyZWRpdEJhbGFuY2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjcHVDcmVkaXRVc2FnZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgY3B1Q3JlZGl0VXNhZ2VBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNwdUNyZWRpdFVzYWdlQXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgY3B1Q3JlZGl0VXNhZ2VBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0NQVUNyZWRpdFVzYWdlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY3B1VXRpbGl6YXRpb25BdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNwdVV0aWxpemF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBjcHVVdGlsaXphdGlvbkF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGNwdVV0aWxpemF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDUFVVdGlsaXphdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGN1cnJDb25maWdTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgY3VyckNvbmZpZ1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBjdXJyQ29uZmlnU3VtKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBjdXJyQ29uZmlnU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0N1cnJDb25maWcnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGN1cnJDb25uZWN0aW9uc1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBjdXJyQ29ubmVjdGlvbnNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgY3VyckNvbm5lY3Rpb25zU3VtKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBjdXJyQ29ubmVjdGlvbnNTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnQ3VyckNvbm5lY3Rpb25zJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjdXJySXRlbXNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgY3Vyckl0ZW1zU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGN1cnJJdGVtc1N1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgY3Vyckl0ZW1zU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0N1cnJJdGVtcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZGF0YWJhc2VNZW1vcnlVc2FnZVBlcmNlbnRhZ2VBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGRhdGFiYXNlTWVtb3J5VXNhZ2VQZXJjZW50YWdlQXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBkYXRhYmFzZU1lbW9yeVVzYWdlUGVyY2VudGFnZUF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGRhdGFiYXNlTWVtb3J5VXNhZ2VQZXJjZW50YWdlQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdEYXRhYmFzZU1lbW9yeVVzYWdlUGVyY2VudGFnZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGRiMEF2ZXJhZ2VUdGxBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGRiMEF2ZXJhZ2VUdGxBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGRiMEF2ZXJhZ2VUdGxBdmVyYWdlKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBkYjBBdmVyYWdlVHRsQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdEQjBBdmVyYWdlVFRMJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZGVjckhpdHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGVjckhpdHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGVjckhpdHNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGRlY3JIaXRzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0RlY3JIaXRzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBkZWNyTWlzc2VzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGRlY3JNaXNzZXNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGVjck1pc3Nlc1N1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGVjck1pc3Nlc1N1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdEZWNyTWlzc2VzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBkZWxldGVIaXRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGRlbGV0ZUhpdHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGVsZXRlSGl0c1N1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGVsZXRlSGl0c1N1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdEZWxldGVIaXRzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBkZWxldGVNaXNzZXNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGVsZXRlTWlzc2VzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGRlbGV0ZU1pc3Nlc1N1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGVsZXRlTWlzc2VzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0RlbGV0ZU1pc3NlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZW5naW5lQ3B1VXRpbGl6YXRpb25BdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGVuZ2luZUNwdVV0aWxpemF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBlbmdpbmVDcHVVdGlsaXphdGlvbkF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGVuZ2luZUNwdVV0aWxpemF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdFbmdpbmVDUFVVdGlsaXphdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGV2YWxCYXNlZENtZHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZXZhbEJhc2VkQ21kc1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBldmFsQmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBldmFsQmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0V2YWxCYXNlZENtZHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGV2YWxCYXNlZENtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBldmFsQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZXZhbEJhc2VkQ21kc0xhdGVuY3lBdmVyYWdlKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBldmFsQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnRXZhbEJhc2VkQ21kc0xhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBldmljdGVkVW5mZXRjaGVkU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGV2aWN0ZWRVbmZldGNoZWRTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZXZpY3RlZFVuZmV0Y2hlZFN1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgZXZpY3RlZFVuZmV0Y2hlZFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdFdmljdGVkVW5mZXRjaGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBldmljdGlvbnNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZXZpY3Rpb25zU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGV2aWN0aW9uc1N1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgZXZpY3Rpb25zU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0V2aWN0aW9ucycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZXhwaXJlZFVuZmV0Y2hlZFN1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBleHBpcmVkVW5mZXRjaGVkU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGV4cGlyZWRVbmZldGNoZWRTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGV4cGlyZWRVbmZldGNoZWRTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnRXhwaXJlZFVuZmV0Y2hlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZnJlZWFibGVNZW1vcnlBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGZyZWVhYmxlTWVtb3J5QXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBmcmVlYWJsZU1lbW9yeUF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGZyZWVhYmxlTWVtb3J5QXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdGcmVlYWJsZU1lbW9yeScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGdlb1NwYXRpYWxCYXNlZENtZHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZ2VvU3BhdGlhbEJhc2VkQ21kc1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBnZW9TcGF0aWFsQmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBnZW9TcGF0aWFsQmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0dlb1NwYXRpYWxCYXNlZENtZHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGdlb1NwYXRpYWxCYXNlZENtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBnZW9TcGF0aWFsQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZ2VvU3BhdGlhbEJhc2VkQ21kc0xhdGVuY3lBdmVyYWdlKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBnZW9TcGF0aWFsQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnR2VvU3BhdGlhbEJhc2VkQ21kc0xhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBnZXRIaXRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGdldEhpdHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZ2V0SGl0c1N1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgZ2V0SGl0c1N1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdHZXRIaXRzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBnZXRNaXNzZXNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZ2V0TWlzc2VzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGdldE1pc3Nlc1N1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgZ2V0TWlzc2VzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0dldE1pc3NlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZ2V0VHlwZUNtZHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZ2V0VHlwZUNtZHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZ2V0VHlwZUNtZHNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGdldFR5cGVDbWRzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0dldFR5cGVDbWRzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBnZXRUeXBlQ21kc0xhdGVuY3lBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGdldFR5cGVDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZ2V0VHlwZUNtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgZ2V0VHlwZUNtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdHZXRUeXBlQ21kc0xhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBnbG9iYWxEYXRhc3RvcmVSZXBsaWNhdGlvbkxhZ0F2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZ2xvYmFsRGF0YXN0b3JlUmVwbGljYXRpb25MYWdBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGdsb2JhbERhdGFzdG9yZVJlcGxpY2F0aW9uTGFnQXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgZ2xvYmFsRGF0YXN0b3JlUmVwbGljYXRpb25MYWdBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0dsb2JhbERhdGFzdG9yZVJlcGxpY2F0aW9uTGFnJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaGFzaEJhc2VkQ21kc1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBoYXNoQmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGhhc2hCYXNlZENtZHNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGhhc2hCYXNlZENtZHNTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnSGFzaEJhc2VkQ21kcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaGFzaEJhc2VkQ21kc0xhdGVuY3lBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGhhc2hCYXNlZENtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBoYXNoQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGhhc2hCYXNlZENtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdIYXNoQmFzZWRDbWRzTGF0ZW5jeScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGh5cGVyTG9nTG9nQmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGh5cGVyTG9nTG9nQmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGh5cGVyTG9nTG9nQmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBoeXBlckxvZ0xvZ0Jhc2VkQ21kc1N1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdIeXBlckxvZ0xvZ0Jhc2VkQ21kcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaHlwZXJMb2dMb2dCYXNlZENtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBoeXBlckxvZ0xvZ0Jhc2VkQ21kc0xhdGVuY3lBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGh5cGVyTG9nTG9nQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGh5cGVyTG9nTG9nQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnSHlwZXJMb2dMb2dCYXNlZENtZHNMYXRlbmN5JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaW5jckhpdHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaW5jckhpdHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaW5jckhpdHNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGluY3JIaXRzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0luY3JIaXRzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBpbmNyTWlzc2VzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGluY3JNaXNzZXNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaW5jck1pc3Nlc1N1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgaW5jck1pc3Nlc1N1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdJbmNyTWlzc2VzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBpc01hc3RlckF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaXNNYXN0ZXJBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGlzTWFzdGVyQXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgaXNNYXN0ZXJBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ0lzTWFzdGVyJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMga2V5QXV0aG9yaXphdGlvbkZhaWx1cmVzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGtleUF1dGhvcml6YXRpb25GYWlsdXJlc1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBrZXlBdXRob3JpemF0aW9uRmFpbHVyZXNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGtleUF1dGhvcml6YXRpb25GYWlsdXJlc1N1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdLZXlBdXRob3JpemF0aW9uRmFpbHVyZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGtleUJhc2VkQ21kc1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBrZXlCYXNlZENtZHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMga2V5QmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBrZXlCYXNlZENtZHNTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnS2V5QmFzZWRDbWRzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBrZXlCYXNlZENtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBrZXlCYXNlZENtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBrZXlCYXNlZENtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMga2V5QmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnS2V5QmFzZWRDbWRzTGF0ZW5jeScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGtleXNUcmFja2VkU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGtleXNUcmFja2VkU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGtleXNUcmFja2VkU3VtKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBrZXlzVHJhY2tlZFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdLZXlzVHJhY2tlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbGlzdEJhc2VkQ21kc1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBsaXN0QmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGxpc3RCYXNlZENtZHNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGxpc3RCYXNlZENtZHNTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnTGlzdEJhc2VkQ21kcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbGlzdEJhc2VkQ21kc0xhdGVuY3lBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGxpc3RCYXNlZENtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBsaXN0QmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIGxpc3RCYXNlZENtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdMaXN0QmFzZWRDbWRzTGF0ZW5jeScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG1hc3RlckxpbmtIZWFsdGhTdGF0dXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG1hc3RlckxpbmtIZWFsdGhTdGF0dXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG1hc3RlckxpbmtIZWFsdGhTdGF0dXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBtYXN0ZXJMaW5rSGVhbHRoU3RhdHVzQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdNYXN0ZXJMaW5rSGVhbHRoU3RhdHVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbWVtb3J5RnJhZ21lbnRhdGlvblJhdGlvQXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBtZW1vcnlGcmFnbWVudGF0aW9uUmF0aW9BdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG1lbW9yeUZyYWdtZW50YXRpb25SYXRpb0F2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIG1lbW9yeUZyYWdtZW50YXRpb25SYXRpb0F2ZXJhZ2UoZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnTWVtb3J5RnJhZ21lbnRhdGlvblJhdGlvJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbmV0d29ya0J5dGVzSW5BdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtCeXRlc0luQXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrQnl0ZXNJbkF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtCeXRlc0luQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdOZXR3b3JrQnl0ZXNJbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtCeXRlc091dEF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgbmV0d29ya0J5dGVzT3V0QXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrQnl0ZXNPdXRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrQnl0ZXNPdXRBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ05ldHdvcmtCeXRlc091dCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtQYWNrZXRzSW5BdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtQYWNrZXRzSW5BdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtQYWNrZXRzSW5BdmVyYWdlKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrUGFja2V0c0luQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdOZXR3b3JrUGFja2V0c0luJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbmV0d29ya1BhY2tldHNPdXRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtQYWNrZXRzT3V0QXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrUGFja2V0c091dEF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtQYWNrZXRzT3V0QXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdOZXR3b3JrUGFja2V0c091dCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG5ld0Nvbm5lY3Rpb25zU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ld0Nvbm5lY3Rpb25zU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ld0Nvbm5lY3Rpb25zU3VtKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXdDb25uZWN0aW9uc1N1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdOZXdDb25uZWN0aW9ucycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbmV3SXRlbXNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgbmV3SXRlbXNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgbmV3SXRlbXNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ld0l0ZW1zU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ05ld0l0ZW1zJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwdWJTdWJCYXNlZENtZHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgcHViU3ViQmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHB1YlN1YkJhc2VkQ21kc1N1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgcHViU3ViQmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ1B1YlN1YkJhc2VkQ21kcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHViU3ViQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgcHViU3ViQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgcHViU3ViQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIHB1YlN1YkJhc2VkQ21kc0xhdGVuY3lBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ1B1YlN1YkJhc2VkQ21kc0xhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyByZWNsYWltZWRTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgcmVjbGFpbWVkU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHJlY2xhaW1lZFN1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgcmVjbGFpbWVkU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ1JlY2xhaW1lZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcmVwbGljYXRpb25CeXRlc1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyByZXBsaWNhdGlvbkJ5dGVzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHJlcGxpY2F0aW9uQnl0ZXNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIHJlcGxpY2F0aW9uQnl0ZXNTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGlDYWNoZScsXG4gICAgICBtZXRyaWNOYW1lOiAnUmVwbGljYXRpb25CeXRlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcmVwbGljYXRpb25MYWdBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHJlcGxpY2F0aW9uTGFnQXZlcmFnZShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyByZXBsaWNhdGlvbkxhZ0F2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIHJlcGxpY2F0aW9uTGFnQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdSZXBsaWNhdGlvbkxhZycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHNhdmVJblByb2dyZXNzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHNhdmVJblByb2dyZXNzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHNhdmVJblByb2dyZXNzU3VtKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBzYXZlSW5Qcm9ncmVzc1N1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdTYXZlSW5Qcm9ncmVzcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgc2V0QmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHNldEJhc2VkQ21kc1N1bShkaW1lbnNpb25zOiB7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBzZXRCYXNlZENtZHNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIHNldEJhc2VkQ21kc1N1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdTZXRCYXNlZENtZHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHNldEJhc2VkQ21kc0xhdGVuY3lBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHNldEJhc2VkQ21kc0xhdGVuY3lBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHNldEJhc2VkQ21kc0xhdGVuY3lBdmVyYWdlKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBzZXRCYXNlZENtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdTZXRCYXNlZENtZHNMYXRlbmN5JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgc2V0VHlwZUNtZHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgc2V0VHlwZUNtZHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgc2V0VHlwZUNtZHNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIHNldFR5cGVDbWRzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ1NldFR5cGVDbWRzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBzZXRUeXBlQ21kc0xhdGVuY3lBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHNldFR5cGVDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgc2V0VHlwZUNtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgc2V0VHlwZUNtZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdTZXRUeXBlQ21kc0xhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBzbGFic01vdmVkU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHNsYWJzTW92ZWRTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgc2xhYnNNb3ZlZFN1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgc2xhYnNNb3ZlZFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdTbGFic01vdmVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBzb3J0ZWRTZXRCYXNlZENtZHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgc29ydGVkU2V0QmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHNvcnRlZFNldEJhc2VkQ21kc1N1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgc29ydGVkU2V0QmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ1NvcnRlZFNldEJhc2VkQ21kcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgc29ydGVkU2V0QmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgc29ydGVkU2V0QmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgc29ydGVkU2V0QmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIHNvcnRlZFNldEJhc2VkQ21kc0xhdGVuY3lBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ1NvcnRlZFNldEJhc2VkQ21kc0xhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBzdHJlYW1CYXNlZENtZHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgc3RyZWFtQmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHN0cmVhbUJhc2VkQ21kc1N1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgc3RyZWFtQmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ1N0cmVhbUJhc2VkQ21kcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgc3RyZWFtQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgc3RyZWFtQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgc3RyZWFtQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIHN0cmVhbUJhc2VkQ21kc0xhdGVuY3lBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ1N0cmVhbUJhc2VkQ21kc0xhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBzdHJpbmdCYXNlZENtZHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgc3RyaW5nQmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHN0cmluZ0Jhc2VkQ21kc1N1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgc3RyaW5nQmFzZWRDbWRzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ1N0cmluZ0Jhc2VkQ21kcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgc3RyaW5nQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgc3RyaW5nQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgc3RyaW5nQmFzZWRDbWRzTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIHN0cmluZ0Jhc2VkQ21kc0xhdGVuY3lBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ1N0cmluZ0Jhc2VkQ21kc0xhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBzd2FwVXNhZ2VBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHN3YXBVc2FnZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgc3dhcFVzYWdlQXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgc3dhcFVzYWdlQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdTd2FwVXNhZ2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB0b3VjaEhpdHNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgdG91Y2hIaXRzU3VtKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZywgQ2FjaGVOb2RlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHRvdWNoSGl0c1N1bShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgdG91Y2hIaXRzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ1RvdWNoSGl0cycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdG91Y2hNaXNzZXNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgdG91Y2hNaXNzZXNTdW0oZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgdG91Y2hNaXNzZXNTdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIHRvdWNoTWlzc2VzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpQ2FjaGUnLFxuICAgICAgbWV0cmljTmFtZTogJ1RvdWNoTWlzc2VzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB1bnVzZWRNZW1vcnlBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FjaGVDbHVzdGVySWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHVudXNlZE1lbW9yeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYWNoZUNsdXN0ZXJJZDogc3RyaW5nLCBDYWNoZU5vZGVJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENhY2hlQ2x1c3RlcklkOiBzdHJpbmcsIENhY2hlTm9kZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgdW51c2VkTWVtb3J5QXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgdW51c2VkTWVtb3J5QXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aUNhY2hlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdVbnVzZWRNZW1vcnknLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbn1cbnR5cGUgTWV0cmljV2l0aERpbXM8RD4gPSB7IG5hbWVzcGFjZTogc3RyaW5nLCBtZXRyaWNOYW1lOiBzdHJpbmcsIHN0YXRpc3RpYzogc3RyaW5nLCBkaW1lbnNpb25zTWFwOiBEIH07XG4iXX0=