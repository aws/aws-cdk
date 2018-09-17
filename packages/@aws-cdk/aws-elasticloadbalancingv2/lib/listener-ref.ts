import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { ListenerArn } from './elasticloadbalancingv2.generated';
import { BaseListenerRuleProps, ListenerRule } from './listener-rule';
import { TargetGroupRef } from './target-group-ref';

/**
 * A listener
 */
export abstract class ListenerRef extends cdk.Construct implements ec2.IConnectable {
    /**
     * Import an existing listener
     */
    public static import(parent: cdk.Construct, id: string, props: ListenerRefProps): ListenerRef {
        return new ImportedListener(parent, id, props);
    }

    /**
     * Class to give to target group so it can access private functions
     */
    private static Internals = class implements IListenerInternals {
        constructor(private readonly listener: ListenerRef) {
        }

        public registerConnectable(connectable: ec2.IConnectable): void {
            this.listener.connections.allowDefaultPortTo(connectable, 'Load balancer to target');
        }
    };

    /**
     * ARN of the listener
     */
    public abstract readonly listenerArn: ListenerArn;

    /**
     * Connections for this listener
     */
    public readonly abstract connections: ec2.Connections;

    /**
     * Export this listener
     */
    public export(): ListenerRefProps {
        return {
            listenerArn: new ListenerArn(new cdk.Output(this, 'ListenerArn', { value: this.listenerArn }).makeImportValue())
        };
    }

    /**
     * Add a rule to this listener
     */
    public addRule(id: string, props: BaseListenerRuleProps) {
        return new ListenerRule(this, id, {
            listener: this,
            ...props
        });
    }

    /**
     * Register a target group with this listener
     */
    protected registerTargetGroup(targetGroup: TargetGroupRef) {
        targetGroup.bindToListener(new ListenerRef.Internals(this));
    }
}

/**
 * Properties to reference an existing listener
 */
export interface ListenerRefProps {
    /**
     * ARN of the listener
     */
    listenerArn: ListenerArn;
}

/**
 * An existing listener
 */
class ImportedListener extends ListenerRef {
    public readonly listenerArn: ListenerArn;
    public readonly connections: ec2.Connections = new ec2.ImportedConnections();

    constructor(parent: cdk.Construct, id: string, props: ListenerRefProps) {
        super(parent, id);

        this.listenerArn = props.listenerArn;
    }
}

/**
 * Parts of the listener that only Target Groups should have access to
 */
export interface IListenerInternals {
    registerConnectable(connectable: ec2.IConnectable): void;
}