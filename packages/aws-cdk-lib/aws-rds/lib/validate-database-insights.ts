import { Construct } from 'constructs';
import { ClusterScailabilityType, DatabaseCluster, DatabaseClusterProps, DBClusterStorageType } from './cluster';
import { DatabaseInsightsMode } from './database-insights-mode';
import { DatabaseInstance, DatabaseInstanceProps } from './instance';
import { PerformanceInsightRetention } from './props';
import { validateAllProps, ValidationRule } from '../../core/lib/helpers-internal';

/**
 * Common validation rules for database insights
 */
const databaseInsightsRules: ValidationRule<any>[] = [
  {
    condition: (props) =>
      props.enablePerformanceInsights === false &&
      (props.performanceInsightRetention !== undefined ||
        props.performanceInsightEncryptionKey !== undefined ||
        props.databaseInsightsMode === DatabaseInsightsMode.ADVANCED),
    message: () => '`enablePerformanceInsights` disabled, but `performanceInsightRetention` or `performanceInsightEncryptionKey` was set, or `databaseInsightsMode` was set to \'${DatabaseInsightsMode.ADVANCED}\'',
  },
  {
    condition: (props) => props.databaseInsightsMode === DatabaseInsightsMode.ADVANCED &&
      props.performanceInsightRetention !== PerformanceInsightRetention.MONTHS_15,
    message: () => '`performanceInsightRetention` must be set to \'${PerformanceInsightRetention.MONTHS_15}\' when `databaseInsightsMode` is set to \'${DatabaseInsightsMode.ADVANCED}\'',
  },
];

/**
 * Cluster-specific validation rules
 */
const clusterSpecificRules: ValidationRule<DatabaseClusterProps>[] = [
  {
    condition: (props) => props.replicationSourceIdentifier !== undefined && props.credentials !== undefined,
    message: () => 'Cannot specify both `replicationSourceIdentifier` and `credentials`. The value is inherited from the source DB cluster',
  },
];

/**
 * Rules for Aurora Limitless database
 */
const limitlessDatabaseRules: ValidationRule<DatabaseClusterProps>[] = [
  {
    condition: (props) => !props.enablePerformanceInsights,
    message: () => 'Performance Insights must be enabled for Aurora Limitless Database',
  },
  {
    condition: (props) => !props.performanceInsightRetention
      || props.performanceInsightRetention < PerformanceInsightRetention.MONTHS_1,
    message: () => 'Performance Insights retention period must be set to at least 31 days for Aurora Limitless Database',
  },
  {
    condition: (props) => !props.monitoringInterval || !props.enableClusterLevelEnhancedMonitoring,
    message: () => 'Cluster level enhanced monitoring must be set for Aurora Limitless Database. Please set \'monitoringInterval\' and enable \'enableClusterLevelEnhancedMonitoring\'',
  },
  {
    condition: (props) => !!(props.writer || props.readers),
    message: () => 'Aurora Limitless Database does not support reader or writer instances',
  },
  {
    condition: (props) => !props.engine.engineVersion?.fullVersion?.endsWith('limitless'),
    message: (props) => `Aurora Limitless Database requires an engine version that supports it, got: ${props.engine.engineVersion?.fullVersion}`,
  },
  {
    condition: (props) => props.storageType !== DBClusterStorageType.AURORA_IOPT1,
    message: (props) => `Aurora Limitless Database requires I/O optimized storage type, got: ${props.storageType}`,
  },
  {
    condition: (props) => props.cloudwatchLogsExports === undefined || props.cloudwatchLogsExports.length === 0,
    message: () => 'Aurora Limitless Database requires CloudWatch Logs exports to be set',
  },
];

/**
 * Validates database instance properties
 */
export function validateDatabaseInstanceProps(scope: Construct, props: DatabaseInstanceProps): void {
  validateAllProps(scope, DatabaseInstance.name, props, databaseInsightsRules as ValidationRule<DatabaseInstanceProps>[]);
}

/**
 * Validates database cluster properties
 */
export function validateDatabaseClusterProps(scope: Construct, props: DatabaseClusterProps): void {
  const isLimitlessCluster = props.clusterScailabilityType === ClusterScailabilityType.LIMITLESS;
  const applicableRules = isLimitlessCluster
    ? [...databaseInsightsRules as ValidationRule<DatabaseClusterProps>[], ...clusterSpecificRules, ...limitlessDatabaseRules]
    : [...databaseInsightsRules as ValidationRule<DatabaseClusterProps>[], ...clusterSpecificRules];

  validateAllProps(scope, DatabaseCluster.name, props, applicableRules);
}
