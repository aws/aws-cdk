import { FederatedPrincipal, IRole, OpenIdConnectProvider, Role } from '@aws-cdk/aws-iam';
import { Construct } from '@aws-cdk/core';
import { Cluster } from './cluster';

/**
 * Service Account
 */
export interface ServiceAccountOptions {
  /**
   * The cluster to apply the patch to.
   */
  readonly name: string;
  /**
   * The cluster to apply the patch to.
   */
  readonly namespace: string;
}

/**
 * Service Account
 */
export interface ServiceAccountProps extends ServiceAccountOptions {
  /**
   * The cluster to apply the patch to.
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: Cluster;
}

/**
 * Service Account
 */
export class ServiceAccount extends Construct {

  /**
   * The role the service account is linked to.
   */
  public readonly role: IRole;

  constructor(scope: Construct, id: string, props: ServiceAccountProps) {
    super(scope, id);

    const { cluster, name, namespace } = props;

    let provider = cluster.node.tryFindChild('OpenIdConnectProvider') as OpenIdConnectProvider;
    if (!provider) {
      if (!cluster.kubectlEnabled) {
        throw new Error('Cannot specify a OpenID Connect Provider if kubectl is disabled');
      }
      provider = new OpenIdConnectProvider(cluster, 'OpenIdConnectProvider', {
        url: props.cluster.clusterOpenIdConnectIssuerUrl!,
      });
    }

    this.role = new Role(this, 'Role', {
      assumedBy: new FederatedPrincipal(provider.openIdConnectProviderArn, {}, 'sts:AssumeRoleWithWebIdentity'),
    });
    cluster.addResource('ServiceAccount', {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      metadata: {
        name,
        namespace,
        labels: {
          'app.kubernetes.io/name': name,
        },
        annotations: {
          'eks.amazonaws.com/role-arn': this.role.roleArn,
        },
      },
    });
  }

}
