import { Construct, IDependable } from 'constructs';
import { ITargetGroup, TargetGroupImportProps } from './base-target-group';
/**
 * Base internal class for existing target groups
 */
export declare abstract class ImportedTargetGroupBase extends Construct implements ITargetGroup {
    /**
     * ARN of the target group
     */
    readonly targetGroupArn: string;
    /**
     * The name of the target group
     */
    readonly targetGroupName: string;
    /**
     * A token representing a list of ARNs of the load balancers that route traffic to this target group
     */
    readonly loadBalancerArns: string;
    /**
     * Return an object to depend on the listeners added to this target group
     */
    readonly loadBalancerAttached: IDependable;
    constructor(scope: Construct, id: string, props: TargetGroupImportProps);
}
