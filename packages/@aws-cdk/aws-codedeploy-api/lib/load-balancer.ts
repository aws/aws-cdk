/**
 * The generations of AWS load balancing solutions.
 */
export enum LoadBalancerGeneration {
  /**
   * The first generation (ELB Classic).
   */
  First,

  /**
   * The second generation (ALB and NLB).
   */
  Second
}

/**
 * The properties CodeDeploy requires of a load balancer.
 */
export interface ILoadBalancerProps {
  generation: LoadBalancerGeneration;
  name: string;
}

/**
 * An interface of an abstract laod balancer, as needed by CodeDeploy.
 */
export interface ILoadBalancer {
  /**
   * Specify the CodeDeploy-required properties of this load balancer.
   */
  asCodeDeployLoadBalancer(): ILoadBalancerProps;
}
