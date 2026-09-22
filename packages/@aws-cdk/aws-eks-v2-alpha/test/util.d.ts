import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib/core';
import { Cluster, ClusterProps } from '../lib';
export declare function testFixture(region?: string): {
    stack: Stack;
    vpc: ec2.Vpc;
    app: App;
};
export declare function testFixtureNoVpc(region?: string): {
    stack: Stack;
    app: App;
};
export interface testFixtureClusterOptions {
    /**
     * Indicates whether the cluster should be a Fargate cluster or not.
     * If true, a FargateCluster will be created, otherwise a regular Cluster.
     */
    isFargate?: boolean;
}
/**
 * Creates a test fixture for an EKS cluster.
 *
 * @param props - Optional properties to pass to the Cluster or FargateCluster constructor.
 * @param region - The AWS region to create the cluster in. Defaults to the DEFAULT_REGION.
 * @param options - Additional options for the test fixture cluster.
 * @returns An object containing the stack, app, and the created cluster.
 */
export declare function testFixtureCluster(props?: Omit<ClusterProps, 'version'>, region?: string, options?: testFixtureClusterOptions): {
    stack: Stack;
    app: App;
    cluster: Cluster;
};
