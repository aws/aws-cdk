import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
/**
 * This stack is used to test the EKS cluster with auto mode enabled.
 */
export declare class EksAutoModeBaseStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps);
}
/**
 * This stack is used to test the EKS cluster with auto mode enabled with empty node pools.
 */
export declare class EksAutoModeNodePoolsStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps);
}
