import cdk = require('@aws-cdk/cdk');
import { cloudformation } from '../elasticloadbalancingv2.generated';
import { IApplicationListener } from './application-listener';
import { IApplicationTargetGroup } from './application-target-group';

/**
 * Basic properties for defining a rule on a listener
 */
export interface BaseApplicationListenerRuleProps {
  /**
   * Priority of the rule
   *
   * The rule with the lowest priority will be used for every request.
   *
   * Priorities must be unique.
   */
  priority: number;

  /**
   * Target groups to forward requests to
   */
  targetGroups?: IApplicationTargetGroup[];

  /**
   * Rule applies if the requested host matches the indicated host
   *
   * May contain up to three '*' wildcards.
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#host-conditions
   *
   * @default No host condition
   */
  hostHeader?: string;

  /**
   * Rule applies if the requested path matches the given path pattern
   *
   * May contain up to three '*' wildcards.
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#path-conditions
   *
   * @default No path condition
   */
  pathPattern?: string;
}

/**
 * Properties for defining a listener rule
 */
export interface ApplicationListenerRuleProps extends BaseApplicationListenerRuleProps {
  /**
   * The listener to attach the rule to
   */
  listener: IApplicationListener;
}

/**
 * Define a new listener rule
 */
export class ApplicationListenerRule extends cdk.Construct implements cdk.IDependable {
  /**
   * The ARN of this rule
   */
  public readonly listenerRuleArn: string;

  /**
   * The elements of this rule to add ordering dependencies on
   */
  public readonly dependencyElements: cdk.IDependable[] = [];

  private readonly conditions: {[key: string]: string[] | undefined} = {};

  private readonly actions: any[] = [];
  private readonly listener: IApplicationListener;

  constructor(parent: cdk.Construct, id: string, props: ApplicationListenerRuleProps) {
    super(parent, id);

    if (!props.hostHeader && !props.pathPattern) {
      throw new Error(`At least one of 'hostHeader' or 'pathPattern' is required when defining a load balancing rule.`);
    }

    this.listener = props.listener;

    const resource = new cloudformation.ListenerRuleResource(this, 'Resource', {
      listenerArn: props.listener.listenerArn,
      priority: props.priority,
      conditions: new cdk.Token(() => this.renderConditions()),
      actions: new cdk.Token(() => this.actions),
    });

    if (props.hostHeader) {
      this.setCondition('host-header', [props.hostHeader]);
    }
    if (props.pathPattern) {
      this.setCondition('path-pattern', [props.pathPattern]);
    }

    (props.targetGroups || []).forEach(this.addTargetGroup.bind(this));

    this.dependencyElements.push(resource);
    this.listenerRuleArn = resource.ref;
  }

  /**
   * Add a non-standard condition to this rule
   */
  public setCondition(field: string, values: string[] | undefined) {
    this.conditions[field] = values;
  }

  /**
   * Validate the rule
   */
  public validate() {
    if (this.actions.length === 0) {
      return ['Listener rule needs at least one action'];
    }
    return [];
  }

  /**
   * Add a TargetGroup to load balance to
   */
  public addTargetGroup(targetGroup: IApplicationTargetGroup) {
    this.actions.push({
      targetGroupArn: targetGroup.targetGroupArn,
      type: 'forward'
    });
    targetGroup.registerListener(this.listener);
  }

  /**
   * Render the conditions for this rule
   */
  private renderConditions() {
    const ret = [];
    for (const [field, values] of Object.entries(this.conditions)) {
      if (values !== undefined) {
        ret.push({ field, values });
      }
    }
    return ret;
  }
}
