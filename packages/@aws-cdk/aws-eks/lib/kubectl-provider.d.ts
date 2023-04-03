import * as iam from '@aws-cdk/aws-iam';
import { NestedStack } from '@aws-cdk/core';
import { Construct, IConstruct } from 'constructs';
import { ICluster } from './cluster';
/**
 * Properties for a KubectlProvider
 */
export interface KubectlProviderProps {
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
    readonly functionArn: string;
    /**
     * The IAM role to assume in order to perform kubectl operations against this cluster.
     */
    readonly kubectlRoleArn: string;
    /**
     * The IAM execution role of the handler. This role must be able to assume kubectlRoleArn
     */
    readonly handlerRole: iam.IRole;
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
     * The IAM role to assume in order to perform kubectl operations against this cluster.
     */
    readonly roleArn: string;
    /**
     * The IAM execution role of the handler.
     */
    readonly handlerRole: iam.IRole;
}
/**
 * Implementation of Kubectl Lambda
 */
export declare class KubectlProvider extends NestedStack implements IKubectlProvider {
    /**
     * Take existing provider or create new based on cluster
     *
     * @param scope Construct
     * @param cluster k8s cluster
     */
    static getOrCreate(scope: Construct, cluster: ICluster): IKubectlProvider;
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
     * The IAM role to assume in order to perform kubectl operations against this cluster.
     */
    readonly roleArn: string;
    /**
     * The IAM execution role of the handler.
     */
    readonly handlerRole: iam.IRole;
    constructor(scope: Construct, id: string, props: KubectlProviderProps);
}
