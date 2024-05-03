import { Construct } from 'constructs';
import { ICluster } from './cluster';
import { CfnAccessEntry } from './eks.generated';
import {
  Resource, IResource, Aws,
} from '../../core';

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
export enum AccessScopeType {
  /**
   * The policy applies to a specific namespace within the cluster.
   */
  NAMESPACE = 'namespace',
  /**
   * The policy applies to the entire cluster.
   */
  CLUSTER = 'cluster',
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
   * @default - no namespaces required(cluster-level access).
   */
  readonly namespaces?: string[];
  /**
   * The scope type of the policy, either 'namespace' or 'cluster'.
   */
  readonly type: AccessScopeType;
}

/**
 * Represents an Amazon EKS Access Policy.
 *
 * Amazon EKS Access Policies are used to control access to Amazon EKS clusters.
 *
 * @see https://docs.aws.amazon.com/eks/latest/userguide/access-policies.html
 */
export class AccessPolicy {
  /**
   * The Amazon EKS Admin Policy. This access policy includes permissions that grant an IAM principal
   * most permissions to resources. When associated to an access entry, its access scope is typically
   * one or more Kubernetes namespaces.
   */
  public static readonly AMAZON_EKS_ADMIN_POLICY = AccessPolicy.of('AmazonEKSAdminPolicy');

  /**
   * The Amazon EKS Cluster Admin Policy. This access policy includes permissions that grant an IAM
   * principal administrator access to a cluster. When associated to an access entry, its access scope
   * is typically the cluster, rather than a Kubernetes namespace.
   */
  public static readonly AMAZON_EKS_CLUSTER_ADMIN_POLICY = AccessPolicy.of('AmazonEKSClusterAdminPolicy');

  /**
   * The Amazon EKS Admin View Policy. This access policy includes permissions that grant an IAM principal
   * access to list/view all resources in a cluster.
   */
  public static readonly AMAZON_EKS_ADMIN_VIEW_POLICY = AccessPolicy.of('AmazonEKSAdminViewPolicy');

  /**
   * The Amazon EKS Edit Policy. This access policy includes permissions that allow an IAM principal
   * to edit most Kubernetes resources.
   */
  public static readonly AMAZON_EKS_EDIT_POLICY = AccessPolicy.of('AmazonEKSEditPolicy');

  /**
   * The Amazon EKS View Policy. This access policy includes permissions that grant an IAM principal
   * access to list/view all resources in a cluster.
   */
  public static readonly AMAZON_EKS_VIEW_POLICY = AccessPolicy.of('AmazonEKSViewPolicy');

  /**
   * Creates a new instance of the AccessPolicy class with the specified policy name.
   * @param policyName The name of the access policy.
   * @returns A new instance of the AccessPolicy class.
   */
  public static of(policyName: string) { return new AccessPolicy(policyName); }

  /**
   * The Amazon Resource Name (ARN) of the access policy.
   */
  public readonly policyArn: string;
  constructor(public readonly policyName: string) {
    this.policyArn = `arn:${Aws.PARTITION}:eks::aws:cluster-access-policy/${policyName}`;
  }
}

/**
 * Represents an access policy that defines the permissions and scope for a user or role to access an Amazon EKS cluster.
 *
 * @interface IAccessPolicy
 * @property {AccessScope} accessScope - The scope of the access policy, which determines the level of access granted.
 * @property {AccessPolicy} policy - The access policy itself, which defines the specific permissions.
 */
export interface IAccessPolicy {
  /**
   * The scope of the access policy, which determines the level of access granted.
   */
  readonly accessScope: AccessScope;
  /**
   * The access policy itself, which defines the specific permissions.
   */
  readonly policy: AccessPolicy;
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
 */
export class AccessEntry extends Resource implements IAccessEntry {
  /**
   * Imports an `AccessEntry` from its attributes.
   *
   * @param scope - The parent construct.
   * @param id - The ID of the imported construct.
   * @param attrs - The attributes of the access entry to import.
   * @returns The imported access entry.
   */
  public static fromAccessEntryAttributes(scope: Construct, id: string, attrs: AccessEntryAttributes): IAccessEntry {
    class Import extends Resource implements IAccessEntry {
      public readonly accessEntryName = attrs.accessEntryName;
      public readonly accessEntryArn = attrs.accessEntryArn;
    }
    return new Import(scope, id);
  }
  /**
   * The name of the access entry.
   */
  public readonly accessEntryName: string;
  /**
   * The Amazon Resource Name (ARN) of the access entry.
   */
  public readonly accessEntryArn: string;

  constructor(scope: Construct, id: string, props: AccessEntryProps ) {
    super(scope, id);

    const resource = new CfnAccessEntry(this, 'Resource', {
      clusterName: props.cluster.clusterName,
      principalArn: props.principal,
      accessPolicies: this.mapAccessPolicies(props.accessPolicies),
    });
    this.accessEntryName = this.getResourceNameAttribute(resource.ref);
    this.accessEntryArn = this.getResourceArnAttribute(resource.attrAccessEntryArn, {
      service: 'eks',
      resource: 'accessentry',
      resourceName: this.physicalName,
    });
  }
  /**
   * Maps the provided access policies to the format required by the CfnAccessEntry construct.
   * @param accessPolicies - The access policies to map.
   * @returns The mapped access policies.
   */
  private mapAccessPolicies(accessPolicies: IAccessPolicy[]): { accessScope: AccessScope; policyArn: string }[] {
    return accessPolicies.map(p => ({
      accessScope: {
        type: p.accessScope.type,
        namespaces: p.accessScope.namespaces,
      },
      policyArn: p.policy.policyArn,
    }));
  }
}
