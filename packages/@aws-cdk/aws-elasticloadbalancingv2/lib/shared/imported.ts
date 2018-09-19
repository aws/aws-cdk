import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { ListenerArn, LoadBalancerArn, TargetGroupArn } from "../elasticloadbalancingv2.generated";
import { ListenerRefProps } from './base-listener';
import { LoadBalancerRefProps } from "./base-load-balancer";
import { TargetGroupRefProps } from './base-target-group';

/**
 * Base class for existing load balancers
 */
export class BaseImportedLoadBalancer extends cdk.Construct {
    /**
     * ARN of the load balancer
     */
    public readonly loadBalancerArn: LoadBalancerArn;

    /**
     * VPC of the load balancer
     *
     * Always undefined.
     */
    public readonly vpc?: ec2.VpcNetworkRef;

    constructor(parent: cdk.Construct, id: string, props: LoadBalancerRefProps) {
        super(parent, id);

        this.loadBalancerArn = props.loadBalancerArn;
    }
}

/**
 * Base class for existing listeners
 */
export class BaseImportedListener extends cdk.Construct {
    /**
     * ARN of the listener
     */
    public readonly listenerArn: ListenerArn;

    constructor(parent: cdk.Construct, id: string, props: ListenerRefProps) {
        super(parent, id);

        this.listenerArn = props.listenerArn;
    }
}

/**
 * Base class for existing target groups
 */
export class BaseImportedTargetGroup extends cdk.Construct {
    /**
     * ARN of the target group
     */
    public readonly targetGroupArn: TargetGroupArn;

    constructor(parent: cdk.Construct, id: string, props: TargetGroupRefProps) {
        super(parent, id);

        this.targetGroupArn = props.targetGroupArn;
    }
}