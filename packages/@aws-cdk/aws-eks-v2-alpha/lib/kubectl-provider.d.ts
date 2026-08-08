import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Size } from 'aws-cdk-lib/core';
import { Construct, IConstruct } from 'constructs';
import { ICluster } from './cluster';
export interface KubectlProviderOptions {
    /**
     * An IAM role that can perform kubectl operations against this cluster.
     *
     * The role should be mapped to the `system:masters` Kubernetes RBAC role.
     *
     * This role is directly passed to the lambda handler that sends Kube Ctl commands to the cluster.
     * @default - if not specified, the default role created by a lambda function will
     * be used.
     */
    readonly role?: iam.IRole;
    /**
     * An AWS Lambda layer that contains the `aws` CLI.
     *
     * If not defined, a default layer will be used containing the AWS CLI 2.x.
     */
    readonly awscliLayer?: lambda.ILayerVersion;
    /**
     *
     * Custom environment variables when running `kubectl` against this cluster.
     */
    readonly environment?: {
        [key: string]: string;
    };
    /**
     * A security group to use for `kubectl` execution.
     *
     * @default - If not specified, the k8s endpoint is expected to be accessible
     * publicly.
     */
    readonly securityGroup?: ec2.ISecurityGroup;
    /**
     * The amount of memory allocated to the kubectl provider's lambda function.
     */
    readonly memory?: Size;
    /**
     * An AWS Lambda layer that includes `kubectl` and `helm`
     */
    readonly kubectlLayer: lambda.ILayerVersion;
    /**
     * Subnets to host the `kubectl` compute resources. If not specified, the k8s
     * endpoint is expected to be accessible publicly.
     */
    readonly privateSubnets?: ec2.ISubnet[];
}
/**
 * Properties for a KubectlProvider
 */
export interface KubectlProviderProps extends KubectlProviderOptions {
    /**
     * The cluster to control.
     */
    readonly cluster: ICluster;
}
/**
 * Kubectl Provider Attributes
 */
export interface KubectlProviderAttributes {
    /**
     * The kubectl provider lambda arn
     */
    readonly serviceToken: string;
    /**
     * The role of the provider lambda function.
     * Only required if you deploy helm charts using this imported provider.
     *
     * @default - no role.
     */
    readonly role?: iam.IRole;
}
/**
 * Imported KubectlProvider that can be used in place of the default one created by CDK
 */
export interface IKubectlProvider extends IConstruct {
    /**
     * The custom resource provider's service token.
     */
    readonly serviceToken: string;
    /**
     * The role of the provider lambda function. If undefined,
     * you cannot use this provider to deploy helm charts.
     */
    readonly role?: iam.IRole;
}
/**
 * Implementation of Kubectl Lambda
 */
export declare class KubectlProvider extends Construct implements IKubectlProvider {
    /**
     * Take existing provider on cluster
     *
     * @param scope Construct
     * @param cluster k8s cluster
     */
    static getKubectlProvider(scope: Construct, cluster: ICluster): IKubectlProvider | undefined;
    /**
     * Import an existing provider
     *
     * @param scope Construct
     * @param id an id of resource
     * @param attrs attributes for the provider
     */
    static fromKubectlProviderAttributes(scope: Construct, id: string, attrs: KubectlProviderAttributes): IKubectlProvider;
    /**
     * The custom resource provider's service token.
     */
    readonly serviceToken: string;
    /**
     * The IAM execution role of the handler.
     */
    readonly role?: iam.IRole;
    constructor(scope: Construct, id: string, props: KubectlProviderProps);
}
