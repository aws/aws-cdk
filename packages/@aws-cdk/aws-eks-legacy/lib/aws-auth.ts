import * as iam from '@aws-cdk/aws-iam';
import { Construct, Lazy, Stack } from '@aws-cdk/core';
import { Mapping } from './aws-auth-mapping';
import { Cluster } from './cluster';
import { KubernetesResource } from './k8s-resource';

export interface AwsAuthProps {
  /**
   * The EKS cluster to apply this configuration to.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: Cluster;
}

/**
 * Manages mapping between IAM users and roles to Kubernetes RBAC configuration.
 *
 * @see https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html
 */
export class AwsAuth extends Construct {
  private readonly stack: Stack;
  private readonly roleMappings = new Array<{ role: iam.IRole, mapping: Mapping }>();
  private readonly userMappings = new Array<{ user: iam.IUser, mapping: Mapping }>();
  private readonly accounts = new Array<string>();

  constructor(scope: Construct, id: string, props: AwsAuthProps) {
    super(scope, id);

    this.stack = Stack.of(this);

    new KubernetesResource(this, 'manifest', {
      cluster: props.cluster,
      manifest: [
        {
          apiVersion: 'v1',
          kind: 'ConfigMap',
          metadata: {
            name: 'aws-auth',
            namespace: 'kube-system',
          },
          data: {
            mapRoles: this.synthesizeMapRoles(),
            mapUsers: this.synthesizeMapUsers(),
            mapAccounts: this.synthesizeMapAccounts(),
          },
        },
      ],
    });
  }

  /**
   * Adds the specified IAM role to the `system:masters` RBAC group, which means
   * that anyone that can assume it will be able to administer this Kubernetes system.
   *
   * @param role The IAM role to add
   * @param username Optional user (defaults to the role ARN)
   */
  public addMastersRole(role: iam.IRole, username?: string) {
    this.addRoleMapping(role, {
      username,
      groups: ['system:masters'],
    });
  }

  /**
   * Adds a mapping between an IAM role to a Kubernetes user and groups.
   *
   * @param role The IAM role to map
   * @param mapping Mapping to k8s user name and groups
   */
  public addRoleMapping(role: iam.IRole, mapping: Mapping) {
    this.roleMappings.push({ role, mapping });
  }

  /**
   * Adds a mapping between an IAM user to a Kubernetes user and groups.
   *
   * @param user The IAM user to map
   * @param mapping Mapping to k8s user name and groups
   */
  public addUserMapping(user: iam.IUser, mapping: Mapping) {
    this.userMappings.push({ user, mapping });
  }

  /**
   * Additional AWS account to add to the aws-auth configmap.
   * @param accountId account number
   */
  public addAccount(accountId: string) {
    this.accounts.push(accountId);
  }

  private synthesizeMapRoles() {
    return Lazy.any({
      produce: () => this.stack.toJsonString(this.roleMappings.map(m => ({
        rolearn: m.role.roleArn,
        username: m.mapping.username,
        groups: m.mapping.groups,
      }))),
    });
  }

  private synthesizeMapUsers() {
    return Lazy.any({
      produce: () => this.stack.toJsonString(this.userMappings.map(m => ({
        userarn: m.user.userArn,
        username: m.mapping.username,
        groups: m.mapping.groups,
      }))),
    });
  }

  private synthesizeMapAccounts() {
    return Lazy.any({
      produce: () => this.stack.toJsonString(this.accounts),
    });
  }
}
