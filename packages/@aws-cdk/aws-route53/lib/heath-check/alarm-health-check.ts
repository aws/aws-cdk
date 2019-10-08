import { HealthCheck, AdvancedHealthCheckOptions } from "./health-check";
import { Construct } from '@aws-cdk/core';
import { CfnHealthCheck } from "../route53.generated";

export interface AlarmHealthCheckProps {
    readonly alarm: CfnHealthCheck.AlarmIdentifierProperty;
    /**
     * @default InsufficientDataHealthStatus.LAST_KNOWN_STATUS
     */
    readonly insufficientDataHealthStatus?: InsufficientDataHealthStatusType;
}

export class AlarmHealthCheck extends HealthCheck {
    public static ipAddress(scope: Construct, id: string, props: AlarmHealthCheckProps, options: AdvancedHealthCheckOptions = {}) {
        return new AlarmHealthCheck(scope, id, { type: AlarmHealthCheckType.CALCULATED, ...props, ...options });
    }

    protected constructor(scope: Construct, id: string, props: CfnHealthCheck.HealthCheckConfigProperty) {
        super(scope, id, props);
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