import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnHealthCheck } from '../route53.generated';

/**
 * A health check
 */
export interface IHealthCheck extends IResource {
    /**
     * The ID of the health check
     */
    readonly healthCheckId: string;
}

/**
 * A health check
 */
export class HealthCheck extends Resource implements IHealthCheck {
    public readonly healthCheckId: string;

    protected constructor(scope: Construct, id: string, healthCheckConfig: CfnHealthCheck.HealthCheckConfigProperty) {
        super(scope, id);

        // TODO tags?
        const healthCheck = new CfnHealthCheck(this, 'Resource', { healthCheckConfig });
        this.healthCheckId = healthCheck.ref;
    }
}

export interface AdvancedHealthCheckOptions {
    /**
     * @default false
     */
    readonly inverted?: boolean;

    // TODO https://github.com/aws-cloudformation/aws-cloudformation-coverage-roadmap/issues/209
    // readonly disabled?: boolean;
}