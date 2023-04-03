import * as elb from '@aws-cdk/aws-elasticloadbalancing';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
/**
 * The generations of AWS load balancing solutions.
 */
export declare enum LoadBalancerGeneration {
    /**
     * The first generation (ELB Classic).
     */
    FIRST = 0,
    /**
     * The second generation (ALB and NLB).
     */
    SECOND = 1
}
/**
 * An interface of an abstract load balancer, as needed by CodeDeploy.
 * Create instances using the static factory methods:
 * `#classic`, `#application` and `#network`.
 */
export declare abstract class LoadBalancer {
    /**
     * Creates a new CodeDeploy load balancer from a Classic ELB Load Balancer.
     *
     * @param loadBalancer a classic ELB Load Balancer
     */
    static classic(loadBalancer: elb.LoadBalancer): LoadBalancer;
    /**
     * Creates a new CodeDeploy load balancer from an Application Load Balancer Target Group.
     *
     * @param albTargetGroup an ALB Target Group
     */
    static application(albTargetGroup: elbv2.IApplicationTargetGroup): LoadBalancer;
    /**
     * Creates a new CodeDeploy load balancer from a Network Load Balancer Target Group.
     *
     * @param nlbTargetGroup an NLB Target Group
     */
    static network(nlbTargetGroup: elbv2.INetworkTargetGroup): LoadBalancer;
    abstract readonly generation: LoadBalancerGeneration;
    abstract readonly name: string;
}
