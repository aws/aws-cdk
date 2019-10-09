import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import { Aws, Construct } from '@aws-cdk/core';
import { AdvancedHealthCheckOptions, HealthCheck } from "./health-check";

/**
 * Alarm health check properties
 * @experimental
 */
export interface AlarmHealthCheckProps extends AdvancedHealthCheckOptions {
    /**
     * The CloudWatch alarm to be monitored
     *
     * Supported alarms:
     * * Standard-resolution metrics (High-resolution metrics aren't supported)
     * * Statistics: Average, Minimum, Maximum, Sum, and SampleCount
     *
     * Route 53 does not support alarms that use metric math to query multiple CloudWatch metrics.
     */
    readonly alarm: cloudwatch.Alarm;
    /**
     * Status of the health check when CloudWatch has insufficient data to determine
     * the state of the alarm that you chose for CloudWatch alarm
     *
     * @default InsufficientDataHealthStatus.LAST_KNOWN_STATUS
     */
    readonly insufficientDataHealthStatus?: InsufficientDataHealthStatusType;
}

/**
 * Alarm health check construct
 *
 * @resource AWS::Route53::HealthCheck
 * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/health-checks-creating-values.html#health-checks-creating-values-cloudwatch
 * @experimental
 */
export class AlarmHealthCheck extends HealthCheck {
    public constructor(scope: Construct, id: string, props: AlarmHealthCheckProps) {
        const { alarm, ...baseProps } = props;
        super(scope, id, {
            type: AlarmHealthCheckType.CALCULATED,
            ...baseProps,
            alarmIdentifier: {
                name: props.alarm.alarmName,
                // FIXME not always true?
                region: Aws.REGION,
            },
        });
    }
}

/**
 * The type of Route 53 health check
 */
export enum AlarmHealthCheckType {
    /**
     * For health checks that monitor the status of other health checks,
     * Route 53 adds up the number of health checks that Route 53 health checkers consider to be healthy and
     *  compares that number with the value of HealthThreshold.
     */
    CALCULATED = 'CALCULATED',
}

/**
 * Type of InsufficientDataHealthStatus
 */
export enum InsufficientDataHealthStatusType {
    /**
     *  Route 53 considers the health check to be healthy.
     */
    HEALTHY = 'Healthy',
    /**
     *  Route 53 considers the health check to be unhealthy.
     */
    UNHEALTHY = 'Unhealthy',
    /**
     * Route 53 uses the status of the health check from the last time that CloudWatch had sufficient data to determine the alarm state.
     * For new health checks that have no last known status, the default status for the health check is healthy.
     */
    LAST_KNOWN_STATUS = 'LastKnownStatus',
}