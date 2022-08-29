import * as autoscaling from '@aws-cdk/aws-autoscaling';
import { BootstrapOptions } from './cluster';
export declare function renderUserData(clusterName: string, autoScalingGroup: autoscaling.AutoScalingGroup, options?: BootstrapOptions): string[];
