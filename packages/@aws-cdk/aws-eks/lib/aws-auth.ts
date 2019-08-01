import iam = require('@aws-cdk/aws-iam');
import { Construct, Lazy, Stack } from '@aws-cdk/core';
import { Mapping } from './aws-auth-mapping';
import { Cluster } from './cluster';
import { KubernetesManifest } from './manifest-resource';

export interface AwsAuthProps {
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

  constructor(scope: Construct, id: string, props: AwsAuthProps) {
    super(scope, id);

    this.stack = Stack.of(this);

    new KubernetesManifest(this, 'manifest', {
      cluster: props.cluster,
      resources: [ {
        apiVersion: "v1",
        kind: "ConfigMap",
        metadata: {
          name: "aws-auth",
          namespace: "kube-system"
        },
        data: {
          mapRoles: Lazy.anyValue({ produce: () => this.synthesizeMapRoles() }),
          mapUsers: Lazy.anyValue({ produce: () => this.synthesizeMapUsers() }),
        }
      } ]
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

  private synthesizeMapRoles() {
    return this.stack.toJsonString(this.roleMappings.map(m => ({
      rolearn: m.role.roleArn,
      username: m.mapping.username,
      groups: m.mapping.groups
    })));
  }

  private synthesizeMapUsers() {
    return this.stack.toJsonString(this.userMappings.map(m => ({
      userarn: this.stack.formatArn({ service: 'iam', resource: 'user', resourceName: m.user.userName }),
      username: m.mapping.username,
      groups: m.mapping.groups
    })));
  }
}
