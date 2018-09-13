import cdk = require('@aws-cdk/cdk');
import { TargetGroupArn } from './elasticloadbalancingv2.generated';

/**
 * A target group
 */
export abstract class TargetGroupRef extends cdk.Construct {
    /**
     * Import an existing target group
     */
    public static import(parent: cdk.Construct, id: string, props: TargetGroupRefProps) {
        return new ImportedTargetGroup(parent, id, props);
    }

    /**
     * ARN of the target group
     */
    public abstract readonly targetGroupArn: TargetGroupArn;

    /**
     * Export this target group
     */
    public export(): TargetGroupRefProps {
        return {
            targetGroupArn: new TargetGroupArn(new cdk.Output(this, 'TargetGroupArn', { value: this.targetGroupArn }).makeImportValue())
        };
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
