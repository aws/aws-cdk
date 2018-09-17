import cdk = require('@aws-cdk/cdk');
import { cloudformation, ListenerRuleArn } from './elasticloadbalancingv2.generated';
import { ListenerRef } from './listener-ref';
import { TargetGroupRef } from './target-group-ref';

/**
 * Properties for defining a rule on a listener
 */
export interface BaseListenerRuleProps {
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
    targets: TargetGroupRef[];

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
export interface ListenerRuleProps extends BaseListenerRuleProps {
    /**
     * The listener to attach the rule to
     */
    listener: ListenerRef;
}

/**
 * Define a new listener rule
 */
export class ListenerRule extends cdk.Construct implements cdk.IDependable {
    /**
     * The ARN of this rule
     */
    public readonly listenerRuleArn: ListenerRuleArn;

    /**
     * The elements of this rule to add ordering dependencies on
     */
    public readonly dependencyElements: cdk.IDependable[] = [];

    private readonly conditions: {[key: string]: string[] | undefined} = {};

    private readonly actions: any[] = [];

    constructor(parent: cdk.Construct, id: string, props: ListenerRuleProps) {
        super(parent, id);

        const resource = new cloudformation.ListenerRuleResource(this, 'Resource', {
            listenerArn: props.listener.listenerArn,
            priority: props.priority,
            conditions: new cdk.Token(() => this.renderConditions()),
            actions: new cdk.Token(() => this.renderActions()),
        });

        if (props.hostHeader) {
            this.setCondition('host-header', [props.hostHeader]);
        }
        if (props.pathPattern) {
            this.setCondition('path-pattern', [props.pathPattern]);
        }

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
     * Add a TargetGroup to load balance to
     */
    public addTargetGroup(targetGroup: TargetGroupRef) {
        this.actions.push({
            targetGroupArn: targetGroup.targetGroupArn,
            type: 'forward'
        });
        return targetGroup;
    }

    private renderConditions() {
        const ret = [];
        for (const [field, values] of Object.entries(this.conditions)) {
            if (values !== undefined) {
                ret.push({ field, values });
            }
        }
        return ret;
    }

    private renderActions() {
        if (this.actions.length === 0) {
            throw new Error('Listener needs at least one default action');
        }
        return this.actions;
    }
}
