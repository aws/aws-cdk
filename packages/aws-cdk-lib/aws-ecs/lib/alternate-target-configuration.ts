import { IConstruct } from 'constructs';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import * as iam from '../../aws-iam';

/**
 * Represents a listener configuration for advanced load balancer settings
 */
export abstract class ListenerRuleConfiguration {
  /**
   * Use an Application Load Balancer listener rule
   */
  public static applicationListenerRule(rule: elbv2.ApplicationListenerRule): ListenerRuleConfiguration {
    return new ApplicationListenerRuleConfiguration(rule);
  }

  /**
   * Use a Network Load Balancer listener
   */
  public static networkListener(listener: elbv2.NetworkListener): ListenerRuleConfiguration {
    return new NetworkListenerConfiguration(listener);
  }

  /**
   * @internal
   */
  public abstract readonly _listenerArn: string;
}

class ApplicationListenerRuleConfiguration extends ListenerRuleConfiguration {
  constructor(private readonly rule: elbv2.ApplicationListenerRule) {
    super();
  }

  public get _listenerArn(): string {
    return this.rule.listenerRuleArn;
  }
}

class NetworkListenerConfiguration extends ListenerRuleConfiguration {
  constructor(private readonly listener: elbv2.NetworkListener) {
    super();
  }

  public get _listenerArn(): string {
    return this.listener.listenerArn;
  }
}

/**
 * Configuration returned by AlternateTargetConfiguration.bind()
 */
export interface AlternateTargetConfig {
  /**
   * The ARN of the alternate target group
   */
  readonly alternateTargetGroupArn: string;

  /**
   * The IAM role ARN for the configuration
   * @default - a new role will be created
   */
  readonly roleArn: string;

  /**
   * The production listener rule ARN (ALB) or listener ARN (NLB)
   * @default - none
   */
  readonly productionListenerRule?: string;

  /**
   * The test listener rule ARN (ALB) or listener ARN (NLB)
   * @default - none
   */
  readonly testListenerRule?: string;
}

/**
 * Interface for configuring alternate target groups for blue/green deployments
 */
export interface IAlternateTarget {
  /**
   * Bind this configuration to a service
   *
   * @param scope The construct scope
   * @returns The configuration to apply to the service
   */
  bind(scope: IConstruct): AlternateTargetConfig;
}

/**
 * Options for AlternateTarget configuration
 */
export interface AlternateTargetOptions {
  /**
   * The IAM role for the configuration
   * @default - a new role will be created
   */
  readonly role?: iam.IRole;

  /**
   * The test listener configuration
   * @default - none
   */
  readonly testListener?: ListenerRuleConfiguration;
}

/**
 * Properties for AlternateTarget configuration
 */
export interface AlternateTargetProps extends AlternateTargetOptions {
  /**
   * The alternate target group
   */
  readonly alternateTargetGroup: elbv2.ITargetGroup;

  /**
   * The production listener rule ARN (ALB) or listener ARN (NLB)
   */
  readonly productionListener: ListenerRuleConfiguration;
}

/**
 * Configuration for alternate target groups used in blue/green deployments with load balancers
 */
export class AlternateTarget implements IAlternateTarget {
  constructor(private readonly id: string, private readonly props: AlternateTargetProps) { }

  /**
   * Bind this configuration to a service
   */
  public bind(scope: IConstruct): AlternateTargetConfig {
    const roleId = `${this.id}Role`;
    const role = this.props.role ?? new iam.Role(scope, roleId, {
      assumedBy: new iam.ServicePrincipal('ecs.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonECSInfrastructureRolePolicyForLoadBalancers'),
      ],
    });

    const config: AlternateTargetConfig = {
      alternateTargetGroupArn: this.props.alternateTargetGroup.targetGroupArn,
      roleArn: role.roleArn,
      productionListenerRule: this.props.productionListener._listenerArn,
      testListenerRule: this.props.testListener?._listenerArn,
    };

    return config;
  }
}
