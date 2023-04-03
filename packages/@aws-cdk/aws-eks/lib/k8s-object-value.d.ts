import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ICluster } from './cluster';
/**
 * Properties for KubernetesObjectValue.
 */
export interface KubernetesObjectValueProps {
    /**
     * The EKS cluster to fetch attributes from.
     *
     * [disable-awslint:ref-via-interface]
     */
    readonly cluster: ICluster;
    /**
     * The object type to query. (e.g 'service', 'pod'...)
     */
    readonly objectType: string;
    /**
     * The name of the object to query.
     */
    readonly objectName: string;
    /**
     * The namespace the object belongs to.
     *
     * @default 'default'
     */
    readonly objectNamespace?: string;
    /**
     * JSONPath to the specific value.
     *
     * @see https://kubernetes.io/docs/reference/kubectl/jsonpath/
     */
    readonly jsonPath: string;
    /**
     * Timeout for waiting on a value.
     *
     * @default Duration.minutes(5)
     */
    readonly timeout?: Duration;
}
/**
 * Represents a value of a specific object deployed in the cluster.
 * Use this to fetch any information available by the `kubectl get` command.
 */
export declare class KubernetesObjectValue extends Construct {
    /**
     * The CloudFormation reosurce type.
     */
    static readonly RESOURCE_TYPE = "Custom::AWSCDK-EKS-KubernetesObjectValue";
    private _resource;
    constructor(scope: Construct, id: string, props: KubernetesObjectValueProps);
    /**
     * The value as a string token.
     */
    get value(): string;
}
