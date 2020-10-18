import * as ecs from '@aws-cdk/aws-ecs';
import * as alb from '@aws-cdk/aws-elasticloadbalancingv2';
import { ServiceExtension } from './extension-interfaces';

/**
 * Props for `HttpLoadBalancerListenerRules`
 */
export interface HttpLoadBalancerListenerRulesProps {
  /**
   * A name for this target group extension
   * @default 'http-load-balancer-listener-rules'
   */
  name?: string;

  /**
   * Application listener to add rules to.
   */
  listener: alb.IApplicationListener;

  /**
   * A set of rules
   */
  rules?: HttpLoadBalancerListenerRule[];

  /**
   * Starting priority number for automatic priorities.
   * @default 1
   */
  priorityStart?: number;

  /**
   * Step size for automatic priority numbers.
   * @default 5
   */
  priorityStep?: number;

  /**
   * Name of the container in the task to forward to.
   * @default 'app'
   */
  containerName?: string;

  /**
   * Traffic port of the container to forward to.
   * @default 80
   */
  trafficPort?: number;
}

/**
 * A load balancer listener rule.
 */
export interface HttpLoadBalancerListenerRule {
  /**
   * Listener conditions to match.
   */
  conditions: alb.ListenerCondition[];

  /**
   * Action.
   * @default forward to the service
   */
  action?: alb.ListenerAction;

  /**
   * Rule priority.
   * @default automatically generated
   */
  priority?: number;
}

/**
 * Exposes the service from a load balancer listener via the listener rules
 * that you provide.
 */
export class HttpLoadBalancerListenerRules extends ServiceExtension {
  /**
   * Create a load balancer rule matching on a host header that forwards to the
   * service.
   */
  static hostHeader(hostHeader: string, priority?: number): HttpLoadBalancerListenerRule {
    return {
      conditions: [
        alb.ListenerCondition.hostHeaders([hostHeader]),
      ],
      priority,
    };
  }

  /**
   * Create a load balancer rule matching on a path pattern that forwards to
   * the service.
   */
  static pathPattern(pathPattern: string, priority?: number): HttpLoadBalancerListenerRule {
    return {
      conditions: [
        alb.ListenerCondition.pathPatterns([pathPattern]),
      ],
      priority,
    };
  }

  /**
   * Create a load balancer rule matching on a host header that redirects via
   * HTTP to another URL.
   */
  static hostHeaderRedirect(hostHeader: string, redirect: alb.RedirectOptions, priority?: number): HttpLoadBalancerListenerRule {
    return {
      ...HttpLoadBalancerListenerRules.hostHeader(hostHeader, priority),
      action: alb.ListenerAction.redirect(redirect),
    };
  }

  /**
   * Create a load balancer rule matching on a path pattern that redirects via
   * HTTP to another URL.
   */
  static pathPatternRedirect(pathPattern: string, redirect: alb.RedirectOptions, priority?: number): HttpLoadBalancerListenerRule {
    return {
      ...HttpLoadBalancerListenerRules.pathPattern(pathPattern, priority),
      action: alb.ListenerAction.redirect(redirect),
    };
  }

  private readonly props: HttpLoadBalancerListenerRulesProps;
  private priority: number;
  private readonly priorityStep: number;
  private readonly rules: HttpLoadBalancerListenerRule[] = [];

  constructor(props: HttpLoadBalancerListenerRulesProps) {
    super(props.name ?? 'http-load-balancer-listener-rules');
    this.props = props;
    this.priority = props.priorityStart ?? 1;
    this.priorityStep = props.priorityStep ?? 5;

    // Add the rules given by the constructor.
    if (props.rules) {
      for (const rule of props.rules) {
        this.addRule(rule);
      }
    }
  }

  /**
   * Add a load balancer listener rule to this http endpoint.
   */
  addRule(rule: HttpLoadBalancerListenerRule) {
    this.rules.push(rule);
  }

  private nextPriority() {
    const priority = this.priority;
    this.priority += this.priorityStep;
    return priority;
  }

  useService(service: ecs.Ec2Service | ecs.FargateService) {
    super.useService(service);

    if (this.rules.length === 0) {
      // When there are no rules, we don't create the target group.
      return;
    }

    const targetGroup = new alb.ApplicationTargetGroup(this.scope, `load-balancer-listener-rules-${this.name}`, {
      vpc: this.parentService.ecsService.cluster.vpc,
      protocol: alb.ApplicationProtocol.HTTP,
      targets: [
        this.parentService.ecsService.loadBalancerTarget({
          containerName: this.props.containerName ?? 'app',
          containerPort: this.props.trafficPort ?? 80,
        }),
      ],
    });

    for (const rule of this.rules) {
      const priority = rule.priority ?? this.nextPriority();
      const action = rule.action ?? alb.ListenerAction.forward([targetGroup]);

      new alb.ApplicationListenerRule(this.scope, `listener-rule-${priority}`, {
        ...rule,
        listener: this.props.listener,
        action: action,
        priority: priority,
      });
    }
  }
}
