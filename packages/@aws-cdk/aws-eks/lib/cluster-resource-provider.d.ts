import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { NestedStack } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';
export interface ClusterResourceProviderProps {
    /**
     * The IAM role to assume in order to interact with the cluster.
     */
    readonly adminRole: iam.IRole;
    /**
     * The VPC to provision the functions in.
     */
    readonly vpc?: ec2.IVpc;
    /**
     * The subnets to place the functions in.
     */
    readonly subnets?: ec2.ISubnet[];
    /**
     * Environment to add to the handler.
     */
    readonly environment?: {
        [key: string]: string;
    };
    /**
     * An AWS Lambda layer that includes the NPM dependency `proxy-agent`.
     *
     * If not defined, a default layer will be used.
     */
    readonly onEventLayer?: lambda.ILayerVersion;
    /**
     * The security group to associate with the functions.
     *
     * @default - No security group.
     */
    readonly securityGroup?: ec2.ISecurityGroup;
}
/**
 * A custom resource provider that handles cluster operations. It serves
 * multiple custom resources such as the cluster resource and the fargate
 * resource.
 *
 * @internal
 */
export declare class ClusterResourceProvider extends NestedStack {
    static getOrCreate(scope: Construct, props: ClusterResourceProviderProps): ClusterResourceProvider;
    /**
     * The custom resource provider to use for custom resources.
     */
    readonly provider: cr.Provider;
    private constructor();
    /**
     * The custom resource service token for this provider.
     */
    get serviceToken(): string;
}
