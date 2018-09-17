import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { TargetGroupArn } from './elasticloadbalancingv2.generated';
import { IListenerInternals } from './listener-ref';

/**
 * A target group
 */
export abstract class TargetGroupRef extends cdk.Construct {
    /**
     * Import an existing target group
     */
    public static import(parent: cdk.Construct, id: string, props: TargetGroupRefProps): TargetGroupRef {
        return new ImportedTargetGroup(parent, id, props);
    }

    /**
     * ARN of the target group
     */
    public abstract readonly targetGroupArn: TargetGroupArn;

    private readonly connectableMembers = new Array<ec2.IConnectable>();
    private readonly listeners = new Array<IListenerInternals>();

    /**
     * Export this target group
     */
    public export(): TargetGroupRefProps {
        return {
            targetGroupArn: new TargetGroupArn(new cdk.Output(this, 'TargetGroupArn', { value: this.targetGroupArn }).makeImportValue())
        };
    }

    /**
     * Register a connectable as a member of this target group
     *
     * The connections are created when the listener of a load balancer load
     * balances to this target.
     */
    public registerConnectable(connectable: ec2.IConnectable) {
        this.connectableMembers.push(connectable);
        for (const listener of this.listeners) {
            listener.registerConnectable(connectable);
        }
    }

    /**
     * Called when this TargetGroup is the target of a listener
     */
    public bindToListener(listener: IListenerInternals): any {
        for (const member of this.connectableMembers) {
            listener.registerConnectable(member);
        }
        this.listeners.push(listener);
    }
}

/**
 * Properties to reference an existing target group
 */
export interface TargetGroupRefProps {
    /**
     * ARN of the target group
     */
    targetGroupArn: TargetGroupArn;
}

/**
 * An existing load balancer
 */
class ImportedTargetGroup extends TargetGroupRef {
    public readonly targetGroupArn: TargetGroupArn;
    constructor(parent: cdk.Construct, id: string, props: TargetGroupRefProps) {
        super(parent, id);

        this.targetGroupArn = props.targetGroupArn;
    }
}
