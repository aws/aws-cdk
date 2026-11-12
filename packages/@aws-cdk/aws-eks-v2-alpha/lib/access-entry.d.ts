import { Resource, IResource } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { ICluster } from './cluster';
/**
 * Represents an access entry in an Amazon EKS cluster.
 *
 * An access entry defines the permissions and scope for a user or role to access an Amazon EKS cluster.
 *
 * @interface IAccessEntry
 * @extends {IResource}
 * @property {string} accessEntryName - The name of the access entry.
 * @property {string} accessEntryArn - The Amazon Resource Name (ARN) of the access entry.
 */
export interface IAccessEntry extends IResource {
    /**
     * The name of the access entry.
     * @attribute
     */
    readonly accessEntryName: string;
    /**
     * The Amazon Resource Name (ARN) of the access entry.
     * @attribute
     */
    readonly accessEntryArn: string;
}
/**
 * Represents the attributes of an access entry.
 */
export interface AccessEntryAttributes {
    /**
     * The name of the access entry.
     */
    readonly accessEntryName: string;
    /**
     * The Amazon Resource Name (ARN) of the access entry.
     */
    readonly accessEntryArn: string;
}
/**
 * Represents the scope type of an access policy.
 *
 * The scope type determines the level of access granted by the policy.
 *
 * @export
 * @enum {string}
 */
export declare enum AccessScopeType {
    /**
     * The policy applies to a specific namespace within the cluster.
     */
    NAMESPACE = "namespace",
    /**
     * The policy applies to the entire cluster.
     */
    CLUSTER = "cluster"
}
/**
 * Represents the scope of an access policy.
 *
 * The scope defines the namespaces or cluster-level access granted by the policy.
 *
 * @interface AccessScope
 * @property {string[]} [namespaces] - The namespaces to which the policy applies, if the scope type is 'namespace'.
 * @property {AccessScopeType} type - The scope type of the policy, either 'namespace' or 'cluster'.
 */
export interface AccessScope {
    /**
     * A Kubernetes namespace that an access policy is scoped to. A value is required if you specified
     * namespace for Type.
     *
     * @default - no specific namespaces for this scope.
     */
    readonly namespaces?: string[];
    /**
     * The scope type of the policy, either 'namespace' or 'cluster'.
     */
    readonly type: AccessScopeType;
}
/**
 * Represents an Amazon EKS Access Policy ARN.
 *
 * Amazon EKS Access Policies are used to control access to Amazon EKS clusters.
 *
 * @see https://docs.aws.amazon.com/eks/latest/userguide/access-policies.html
 */
export declare class AccessPolicyArn {
    readonly policyName: string;
    /**
     * The Amazon EKS Admin Policy. This access policy includes permissions that grant an IAM principal
     * most permissions to resources. When associated to an access entry, its access scope is typically
     * one or more Kubernetes namespaces.
     */
    static readonly AMAZON_EKS_ADMIN_POLICY: AccessPolicyArn;
    /**
     * The Amazon EKS Cluster Admin Policy. This access policy includes permissions that grant an IAM
     * principal administrator access to a cluster. When associated to an access entry, its access scope
     * is typically the cluster, rather than a Kubernetes namespace.
     */
    static readonly AMAZON_EKS_CLUSTER_ADMIN_POLICY: AccessPolicyArn;
    /**
     * The Amazon EKS Admin View Policy. This access policy includes permissions that grant an IAM principal
     * access to list/view all resources in a cluster.
     */
    static readonly AMAZON_EKS_ADMIN_VIEW_POLICY: AccessPolicyArn;
    /**
     * The Amazon EKS Edit Policy. This access policy includes permissions that allow an IAM principal
     * to edit most Kubernetes resources.
     */
    static readonly AMAZON_EKS_EDIT_POLICY: AccessPolicyArn;
    /**
     * The Amazon EKS View Policy. This access policy includes permissions that grant an IAM principal
     * access to list/view all resources in a cluster.
     */
    static readonly AMAZON_EKS_VIEW_POLICY: AccessPolicyArn;
    /**
     * Creates a new instance of the AccessPolicy class with the specified policy name.
     * @param policyName The name of the access policy.
     * @returns A new instance of the AccessPolicy class.
     */
    static of(policyName: string): AccessPolicyArn;
    /**
     * The Amazon Resource Name (ARN) of the access policy.
     */
    readonly policyArn: string;
    /**
     * Constructs a new instance of the `AccessEntry` class.
     *
     * @param policyName - The name of the Amazon EKS access policy. This is used to construct the policy ARN.
     */
    constructor(policyName: string);
}
/**
 * Represents an access policy that defines the permissions and scope for a user or role to access an Amazon EKS cluster.
 *
 * @interface IAccessPolicy
 */
export interface IAccessPolicy {
    /**
     * The scope of the access policy, which determines the level of access granted.
     */
    readonly accessScope: AccessScope;
    /**
     * The access policy itself, which defines the specific permissions.
     */
    readonly policy: string;
}
/**
 * Properties for configuring an Amazon EKS Access Policy.
 */
export interface AccessPolicyProps {
    /**
     * The scope of the access policy, which determines the level of access granted.
     */
    readonly accessScope: AccessScope;
    /**
     * The access policy itself, which defines the specific permissions.
     */
    readonly policy: AccessPolicyArn;
}
/**
 * Represents the options required to create an Amazon EKS Access Policy using the `fromAccessPolicyName()` method.
 */
export interface AccessPolicyNameOptions {
    /**
     * The scope of the access policy. This determines the level of access granted by the policy.
     */
    readonly accessScopeType: AccessScopeType;
    /**
     * An optional array of Kubernetes namespaces to which the access policy applies.
     * @default - no specific namespaces for this scope
     */
    readonly namespaces?: string[];
}
/**
 * Represents an Amazon EKS Access Policy that implements the IAccessPolicy interface.
 *
 * @implements {IAccessPolicy}
 */
export declare class AccessPolicy implements IAccessPolicy {
    /**
     * Import AccessPolicy by name.
     */
    static fromAccessPolicyName(policyName: string, options: AccessPolicyNameOptions): IAccessPolicy;
    /**
     * The scope of the access policy, which determines the level of access granted.
     */
    readonly accessScope: AccessScope;
    /**
     * The access policy itself, which defines the specific permissions.
     */
    readonly policy: string;
    /**
     * Constructs a new instance of the AccessPolicy class.
     *
     * @param {AccessPolicyProps} props - The properties for configuring the access policy.
     */
    constructor(props: AccessPolicyProps);
}
/**
 * Represents the different types of access entries that can be used in an Amazon EKS cluster.
 *
 * @enum {string}
 */
export declare enum AccessEntryType {
    /**
     * Represents a standard access entry.
     */
    STANDARD = "STANDARD",
    /**
     * Represents a Fargate Linux access entry.
     */
    FARGATE_LINUX = "FARGATE_LINUX",
    /**
     * Represents an EC2 Linux access entry.
     */
    EC2_LINUX = "EC2_LINUX",
    /**
     * Represents an EC2 Windows access entry.
     */
    EC2_WINDOWS = "EC2_WINDOWS"
}
/**
 * Represents the properties required to create an Amazon EKS access entry.
 */
export interface AccessEntryProps {
    /**
     * The name of the AccessEntry.
     *
     * @default - No access entry name is provided
     */
    readonly accessEntryName?: string;
    /**
     * The type of the AccessEntry.
     *
     * @default STANDARD
     */
    readonly accessEntryType?: AccessEntryType;
    /**
     * The Amazon EKS cluster to which the access entry applies.
     */
    readonly cluster: ICluster;
    /**
     * The access policies that define the permissions and scope for the access entry.
     */
    readonly accessPolicies: IAccessPolicy[];
    /**
     * The Amazon Resource Name (ARN) of the principal (user or role) to associate the access entry with.
     */
    readonly principal: string;
}
/**
 * Represents an access entry in an Amazon EKS cluster.
 *
 * An access entry defines the permissions and scope for a user or role to access an Amazon EKS cluster.
 *
 * @implements {IAccessEntry}
 * @resource AWS::EKS::AccessEntry
 */
export declare class AccessEntry extends Resource implements IAccessEntry {
    /** Uniquely identifies this class. */
    static readonly PROPERTY_INJECTION_ID: string;
    /**
     * Imports an `AccessEntry` from its attributes.
     *
     * @param scope - The parent construct.
     * @param id - The ID of the imported construct.
     * @param attrs - The attributes of the access entry to import.
     * @returns The imported access entry.
     */
    static fromAccessEntryAttributes(scope: Construct, id: string, attrs: AccessEntryAttributes): IAccessEntry;
    /**
     * The name of the access entry.
     */
    readonly accessEntryName: string;
    /**
     * The Amazon Resource Name (ARN) of the access entry.
     */
    readonly accessEntryArn: string;
    private cluster;
    private principal;
    private accessPolicies;
    constructor(scope: Construct, id: string, props: AccessEntryProps);
    /**
     * Add the access policies for this entry.
     * @param newAccessPolicies - The new access policies to add.
     */
    addAccessPolicies(newAccessPolicies: IAccessPolicy[]): void;
}
