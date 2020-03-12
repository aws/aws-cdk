import { CustomResource } from "@aws-cdk/aws-cloudformation";
import { FederatedPrincipal, PolicyStatement, Role } from "@aws-cdk/aws-iam";
import { Construct } from "@aws-cdk/core";
import { Cluster } from "./cluster";
import { OPENIDCONNECT_PROVIDER_RESOURCE_TYPE } from "./cluster-resource-handler/consts";
import { ClusterResourceProvider } from "./cluster-resource-provider";

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
  /**
   * The cluster to apply the patch to.
   * @default No additional policies are applied
   */
  readonly policyStatements?: PolicyStatement[];
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
   * The cluster to apply the patch to.
   */
  public readonly serviceAccountName: string;

  private readonly role: Role;

  private openIdConnectProviderArn: string | undefined;

  constructor(scope: Construct, id: string, props: ServiceAccountProps) {
    super(scope, id);

    const { cluster, name, namespace, policyStatements } = props;
    // Ensure OpenIDConnect association
    this.enableOpenIDConnectIAMProvider(cluster);
    // Create IAM Role
    this.role = new Role(this, "Role", {
      assumedBy: new FederatedPrincipal(
        this.openIdConnectProviderArn!, { }, "sts:AssumeRoleWithWebIdentity"
      )
    });
    policyStatements?.forEach(this.role.addToPolicy);
    // Add ServiceAccount Kubernetes resource
    cluster.addResource('ServiceAccount', {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      metadata: {
        name,
        namespace,
        labels: {
          "app.kubernetes.io/name": name
        },
        annotations: {
          "eks.amazonaws.com/role-arn": this.role.roleArn
        }
      }
    });

    this.serviceAccountName = name;
  }

  /**
   * The cluster to apply the patch to.
   */
  public addToPolicy(statements: PolicyStatement) {
    this.role.addToPolicy(statements);
  }

  private enableOpenIDConnectIAMProvider(cluster: Cluster) {
    let resource = cluster.node.tryFindChild(
      "OpenIDConnectProviderResource"
    ) as CustomResource;
    if (!resource) {
      const provider = ClusterResourceProvider.getOrCreate(this);
      resource = new CustomResource(cluster, "OpenIDConnectProviderResource", {
        provider: provider.provider,
        resourceType: OPENIDCONNECT_PROVIDER_RESOURCE_TYPE,
        properties: {
          AssumeRoleArn: cluster._getKubectlCreationRoleArn(),
          Config: {
            clusterName: cluster.clusterName
          }
        }
      });
    }
    // this.openIDConnectSubject = resource.getAtt("openIDConnectSubject").toString();
    this.openIdConnectProviderArn = resource.ref;
  }
}
