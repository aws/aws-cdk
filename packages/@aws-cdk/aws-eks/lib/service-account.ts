import { AddToPrincipalPolicyResult, IPrincipal, IRole, OpenIdConnectPrincipal, PolicyStatement, PrincipalPolicyFragment, Role  } from '@aws-cdk/aws-iam';
import { Construct } from '@aws-cdk/core';
import { Cluster } from './cluster';

/**
 * Options for `ServiceAccount`
 */
export interface ServiceAccountOptions {
  /**
   * The name of the service account.
   * @default - If no name is given, it will use the id of the resource.
   */
  readonly name?: string;

  /**
   * The namespace of the service account.
   * @default "default"
   */
  readonly namespace?: string;
}

/**
 * Properties for defining service accounts
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
export class ServiceAccount extends Construct implements IPrincipal {

  /**
   * The role which is linked to the service account.
   */
  public readonly role: IRole;

  public readonly assumeRoleAction: string;
  public readonly grantPrincipal: IPrincipal;
  public readonly policyFragment: PrincipalPolicyFragment;

  /**
   * The name of the service account.
   */
  public readonly serviceAccountName: string;

  /**
   * The namespace where the service account is located in.
   */
  public readonly serviceAccountNamespace: string;

  constructor(scope: Construct, id: string, props: ServiceAccountProps) {
    super(scope, id);

    const { cluster } = props;
    this.serviceAccountName = props.name ?? this.node.uniqueId.toLowerCase();
    this.serviceAccountNamespace = props.namespace ?? 'default';

    this.role = new Role(this, 'Role', {
      assumedBy: new OpenIdConnectPrincipal(cluster.openIdConnectProvider),
    });

    this.assumeRoleAction = this.role.assumeRoleAction;
    this.grantPrincipal = this.role.grantPrincipal;
    this.policyFragment = this.role.policyFragment;

    cluster.addResource('ServiceAccount', {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      metadata: {
        name: this.serviceAccountName,
        namespace: this.serviceAccountNamespace,
        labels: {
          'app.kubernetes.io/name': this.serviceAccountName,
        },
        annotations: {
          'eks.amazonaws.com/role-arn': this.role.roleArn,
        },
      },
    });
  }

  public addToPolicy(statement: PolicyStatement): boolean {
    return this.role.addToPolicy(statement);
  }

  public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult {
    return this.role.addToPrincipalPolicy(statement);
  }
}
