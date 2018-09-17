import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { LoadBalancerArn } from './elasticloadbalancingv2.generated';
import { BaseListenerProps, Listener } from './listener';

/**
 * A load balancer
 */
export abstract class LoadBalancerRef extends cdk.Construct implements ec2.IConnectable {
    /**
     * Import an existing Load Balancer
     */
    public static import(parent: cdk.Construct, id: string, props: LoadBalancerRefProps): LoadBalancerRef {
        return new ImportedLoadBalancer(parent, id, props);
    }

    /**
     * ARN of the load balancer
     */
    public abstract readonly loadBalancerArn: LoadBalancerArn;

    /**
     * Connections for this load balancer
     */
    public abstract readonly connections: ec2.Connections;

    /**
     * Export this load balancer
     */
    public export(): LoadBalancerRefProps {
        return {
            loadBalancerArn: new LoadBalancerArn(new cdk.Output(this, 'LoadBalancerArn', { value: this.loadBalancerArn }).makeImportValue())
        };
    }

    /**
     * Add a listener to this load balancer
     */
    public addListener(id: string, props: BaseListenerProps) {
        return new Listener(this, id, {
            loadBalancer: this,
            ...props
        });
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
    public readonly connections: ec2.Connections = new ec2.ImportedConnections();

    constructor(parent: cdk.Construct, id: string, props: LoadBalancerRefProps) {
        super(parent, id);

        this.loadBalancerArn = props.loadBalancerArn;
    }
}