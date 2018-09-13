import cdk = require('@aws-cdk/cdk');
import { LoadBalancerArn } from './elasticloadbalancingv2.generated';

/**
 * A load balancer
 */
export abstract class LoadBalancerRef extends cdk.Construct {
    /**
     * Import an existing Load Balancer
     */
    public static import(parent: cdk.Construct, id: string, props: LoadBalancerRefProps) {
        return new ImportedLoadBalancer(parent, id, props);
    }

    /**
     * ARN of the load balancer
     */
    public abstract readonly loadBalancerArn: LoadBalancerArn;

    /**
     * Export this load balancer
     */
    public export(): LoadBalancerRefProps {
        return {
            loadBalancerArn: new LoadBalancerArn(new cdk.Output(this, 'LoadBalancerArn', { value: this.loadBalancerArn }).makeImportValue())
        };
    }
}

/**
 * Properties to reference an existing load balancer
 */
export interface LoadBalancerRefProps {
    /**
     * ARN of the load balancer
     */
    loadBalancerArn: LoadBalancerArn;
}

/**
 * An existing load balancer
 */
class ImportedLoadBalancer extends LoadBalancerRef {
    public readonly loadBalancerArn: LoadBalancerArn;
    constructor(parent: cdk.Construct, id: string, props: LoadBalancerRefProps) {
        super(parent, id);

        this.loadBalancerArn = props.loadBalancerArn;
    }
}