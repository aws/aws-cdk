import * as elb from '@aws-cdk/aws-elasticloadbalancing';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

/**
 * The generations of AWS load balancing solutions.
 */
export enum LoadBalancerGeneration {
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
export abstract class LoadBalancer {
  /**
   * Creates a new CodeDeploy load balancer from a Classic ELB Load Balancer.
   *
   * @param loadBalancer a classic ELB Load Balancer
   */
  public static classic(loadBalancer: elb.LoadBalancer): LoadBalancer {
    class ClassicLoadBalancer extends LoadBalancer {
      public readonly generation = LoadBalancerGeneration.FIRST;
      public readonly name = loadBalancer.loadBalancerName;
    }

    return new ClassicLoadBalancer();
  }

  /**
   * Creates a new CodeDeploy load balancer from an Application Load Balancer Target Group.
   *
   * @param albTargetGroup an ALB Target Group
   */
  public static application(albTargetGroup: elbv2.IApplicationTargetGroup): LoadBalancer {
    class AlbLoadBalancer extends LoadBalancer {
      public readonly generation = LoadBalancerGeneration.SECOND;
      public readonly name = albTargetGroup.targetGroupName;
    }

    return new AlbLoadBalancer();
  }

  /**
   * Creates a new CodeDeploy load balancer from a Network Load Balancer Target Group.
   *
   * @param nlbTargetGroup an NLB Target Group
   */
  public static network(nlbTargetGroup: elbv2.INetworkTargetGroup): LoadBalancer {
    class NlbLoadBalancer extends LoadBalancer {
      public readonly generation = LoadBalancerGeneration.SECOND;
      public readonly name = nlbTargetGroup.targetGroupName;
    }

    return new NlbLoadBalancer();
  }

  public abstract readonly generation: LoadBalancerGeneration;
  public abstract readonly name: string;
}
