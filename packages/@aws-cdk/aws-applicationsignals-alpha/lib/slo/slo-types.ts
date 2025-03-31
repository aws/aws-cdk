import { ISlo, PeriodBasedSloProps, RequestBasedSloProps } from './slo';
import { ComparisonOperator, MetricType } from './constants';
import { Goal } from './interval';
import { PeriodBasedAppSignalsMetricProps, PeriodBasedCloudWatchMetricProps, RequestBasedAppSignalsMetricProps, RequestBasedCloudWatchMetricProps, SliMetricBaseProps } from './metric';


/**
 * Base class for all SLO implementations
 */
export abstract class ServiceLevelObjective extends Resource implements ISlo {
    public readonly arn: string;
    public readonly name: string;
    public readonly goal: Goal;

    protected constructor(
        scope: Construct,
        id: string,
        protected readonly props: PeriodBasedSloProps | RequestBasedSloProps
    ) {
        super(scope, id);
        this.name = props.name;
        this.goal = props.goal;
    }

    public static periodBased(
        scope: Construct,
        id: string,
        props: PeriodBasedSloProps
    ): ServiceLevelObjective {
        return new PeriodBasedSlo(scope, id, props);
    }

    public static requestBased(
        scope: Construct,
        id: string,
        props: RequestBasedSloProps
    ): ServiceLevelObjective {
        return new RequestBasedSlo(scope, id, props);
    }

    protected createBurnRateConfigurations(): applicationsignals.CfnServiceLevelObjective.BurnRateConfigurationProperty[] | undefined {
        return this.props.burnRateWindows?.map(minutes => ({
            lookBackWindowMinutes: minutes,
        }));
    }

    protected getMetricComparisonOperator(metric: PeriodBasedAppSignalsMetricProps | PeriodBasedCloudWatchMetricProps | RequestBasedAppSignalsMetricProps | RequestBasedCloudWatchMetricProps): ComparisonOperator {
        return metric.comparisonOperator ?? getDefaultComparisonOperator(metric.metricType);
    }

    protected isAppSignalsMetric(metric: PeriodBasedAppSignalsMetricProps | PeriodBasedCloudWatchMetricProps | RequestBasedAppSignalsMetricProps | RequestBasedCloudWatchMetricProps): boolean {
        return 'metricType' in metric && 'keyAttributes' in metric;
    }

    abstract _bind(): applicationsignals.CfnServiceLevelObjectiveProps;
}

/**
 * Period-based slo
 */
export class PeriodBasedSlo extends ServiceLevelObjective {
    constructor(scope: Construct, id: string, props: PeriodBasedSloProps) {
        super(scope, id, props);
    }

    _bind(): applicationsignals.CfnServiceLevelObjectiveProps {
        const metric = this.props.metric;
        return {
            name: this.name,
            description: this.props.description,
            goal: this.goal._bind(),
            burnRateConfigurations: this.createBurnRateConfigurations(),
            sli: {
                sliMetric: this.isAppSignalsMetric(metric) ? {
                    metricType: metric.metricType,
                    keyAttributes: metric.keyAttributes,
                    operationName: metric.operationName,
                    periodSeconds: metric.periodSeconds,
                    statistic: metric.statistic,
                } : {
                    metricDataQueries: metric.metricDataQueries,
                    periodSeconds: metric.periodSeconds,
                    statistic: metric.statistic,
                },
                comparisonOperator: this.getMetricComparisonOperator(metric),
                metricThreshold: metric.metricThreshold,
            },
        };
    }
}

/**
 * Request-based slo
 */
export class RequestBasedSlo extends ServiceLevelObjective {
    constructor(scope: Construct, id: string, props: RequestBasedSloProps) {
        super(scope, id, props);
    }

    _bind(): applicationsignals.CfnServiceLevelObjectiveProps {
        const metric = this.props.metric;
        return {
            name: this.name,
            description: this.props.description,
            goal: this.goal._bind(),
            burnRateConfigurations: this.createBurnRateConfigurations(),
            requestBasedSli: {
                requestBasedSliMetric: this.isAppSignalsMetric(metric) ? {
                    metricType: metric.metricType,
                    keyAttributes: metric.keyAttributes,
                    operationName: metric.operationName,
                } : {
                    goodCountMetric: (metric as RequestBasedCloudWatchMetricProps).goodCountMetrics,
                    totalRequestCountMetric: (metric as RequestBasedCloudWatchMetricProps).totalCountMetrics,
                    badCountMetric: (metric as RequestBasedCloudWatchMetricProps).badCountMetrics,
                },
                comparisonOperator: this.getMetricComparisonOperator(metric),
                metricThreshold: metric.metricThreshold,
            },
        };
    }
}

/**
 * Helper function to get default comparison operator
 */
function getDefaultComparisonOperator(metricType?: MetricType): ComparisonOperator {
    switch (metricType) {
        case MetricType.LATENCY:
            return ComparisonOperator.LESS_THAN_OR_EQUAL;
        case MetricType.AVAILABILITY:
            return ComparisonOperator.GREATER_THAN_OR_EQUAL;
        default:
            throw new Error('ComparisonOperator must be specified when metricType is not provided');
    }
}
