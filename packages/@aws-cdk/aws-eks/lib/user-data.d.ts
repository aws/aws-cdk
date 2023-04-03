import * as autoscaling from '@aws-cdk/aws-autoscaling';
import { BootstrapOptions, ICluster } from './cluster';
export declare function renderAmazonLinuxUserData(cluster: ICluster, autoScalingGroup: autoscaling.AutoScalingGroup, options?: BootstrapOptions): string[];
export declare function renderBottlerocketUserData(cluster: ICluster): string[];
/**
 * The lifecycle label for node selector
 */
export declare enum LifecycleLabel {
    /**
     * on-demand instances
     */
    ON_DEMAND = "OnDemand",
    /**
     * spot instances
     */
    SPOT = "Ec2Spot"
}
