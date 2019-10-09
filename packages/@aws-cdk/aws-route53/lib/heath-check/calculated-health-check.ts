import { Construct } from '@aws-cdk/core';
import { CfnHealthCheck } from "../route53.generated";
import { AdvancedHealthCheckOptions, HealthCheck } from "./health-check";

export interface CalculatedHealthCheckProps {
    readonly childHealthChecks: HealthCheck[];
    readonly healthThreshold: number;
}

export class CalculatedHealthCheck extends HealthCheck {
    public static ipAddress(
        scope: Construct,
        id: string,
        { healthThreshold, childHealthChecks }: CalculatedHealthCheckProps,
        options: AdvancedHealthCheckOptions = {},
    ) {
        return new CalculatedHealthCheck(scope, id, {
            type: CalculatedHealthCheckType.CALCULATED,
            healthThreshold,
            childHealthChecks: childHealthChecks.map(({ healthCheckId }) => healthCheckId),
            ...options,
        });
    }

    protected constructor(scope: Construct, id: string, props: CfnHealthCheck.HealthCheckConfigProperty) {
        super(scope, id, props);
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
