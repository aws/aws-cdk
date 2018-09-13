import cdk = require('@aws-cdk/cdk');
import { cloudformation, ListenerRuleArn } from './elasticloadbalancingv2.generated';
import { ListenerRef } from './listener-ref';
import { TargetGroupRef } from './target-group-ref';

/**
 * Properties for defining a listener rule
 */
export interface ListenerRuleProps {
    /**
     * The listener to attach the rule to
     */
    listener: ListenerRef;

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

    constructor(parent: cdk.Construct, id: string, props: ListenerRuleProps) {
        super(parent, id);

        const resource = new cloudformation.ListenerRuleResource(this, 'Resource', {
            listenerArn: props.listener.listenerArn,
            priority: props.priority,
            conditions: new cdk.Token(() => this.renderConditions()),
            actions: props.targets.map(target => ({
                targetGroupArn: target.targetGroupArn,
                // The full spectrum of Actions is not supported via CloudFormation;
                // only 'forward's currently.
                type: 'forward'
            }))
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
