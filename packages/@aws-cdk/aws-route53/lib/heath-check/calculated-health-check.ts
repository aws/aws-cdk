import { Construct } from '@aws-cdk/core';
import { AdvancedHealthCheckOptions, HealthCheck } from "./health-check";

/**
 * Calculated healtch check properties
 * @experimental
 */
export interface CalculatedHealthCheckProps extends AdvancedHealthCheckOptions {
    /**
     * List of health checks to be monitored
     */
    readonly childHealthChecks: HealthCheck[];
    /**
     * Minimum count of healthy  {@link CalculatedHealthCheckProps.childHealthChecks}
     * required for the parent health check to be considered healthy
     *
     * * If you specify a number greater than the number of child health checks,
     *   Route 53 always considers this health check to be unhealthy.
     * * If you specify 0, Route 53 always considers this health check to be healthy.
     */
    readonly healthThreshold: number;
}

/**
 * Calculated health check construct
 *
 * @resource AWS::Route53::HealthCheck
 * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/health-checks-creating-values.html#health-checks-creating-values-calculated
 * @experimental
 */
export class CalculatedHealthCheck extends HealthCheck {
    public constructor(
        scope: Construct,
        id: string,
        { healthThreshold, childHealthChecks, inverted }: CalculatedHealthCheckProps,
    ) {
        super(scope, id, {
            type: CalculatedHealthCheckType.CALCULATED,
            healthThreshold,
            childHealthChecks: childHealthChecks.map(({ healthCheckId }) => healthCheckId),
            inverted,
        });
    }
}

/**
 * The type of Route 53 health check
 */
export enum CalculatedHealthCheckType {
    /**
     * For health checks that monitor the status of other health checks,
     * Route 53 adds up the number of health checks that Route 53 health checkers consider to be healthy and
     *  compares that number with the value of HealthThreshold.
     */
    CALCULATED = 'CALCULATED',
}
