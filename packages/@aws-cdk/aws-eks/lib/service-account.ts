import { CustomResource } from "@aws-cdk/aws-cloudformation";
import { FederatedPrincipal, PolicyStatement, Role } from "@aws-cdk/aws-iam";
import { Construct } from "@aws-cdk/core";
import { Provider } from "@aws-cdk/custom-resources";
import { Cluster } from "./cluster";
import { OPENIDCONNECT_PROVIDER_RESOURCE_TYPE, OPENIDCONNECT_ROLE_RESOURCE_TYPE } from "./cluster-resource-handler/consts";
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
  private openIdConnectProviderIssuerUrl: string | undefined;

  constructor(scope: Construct, id: string, props: ServiceAccountProps) {
    super(scope, id);

    const { cluster, name, namespace, policyStatements } = props;
    // Ensure OpenIDConnect association
    const provider = ClusterResourceProvider.getOrCreate(this).provider;
    this.enableOpenIDConnectIAMProvider(provider, cluster);
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
    this.linkIAMRoleToOpenIDConnect(provider, cluster, this.role.roleName, this.openIdConnectProviderIssuerUrl!, name, namespace);

    this.serviceAccountName = name;
  }

  /**
   * The cluster to apply the patch to.
   */
  public addToPolicy(statements: PolicyStatement) {
    this.role.addToPolicy(statements);
  }

  private enableOpenIDConnectIAMProvider(provider: Provider, cluster: Cluster) {
    let resource = cluster.node.tryFindChild(
      "OpenIDConnectProviderResource"
    ) as CustomResource;
    if (!resource) {
      resource = new CustomResource(cluster, "OpenIDConnectProviderResource", {
        provider,
        resourceType: OPENIDCONNECT_PROVIDER_RESOURCE_TYPE,
        properties: {
          AssumeRoleArn: cluster._getKubectlCreationRoleArn(),
          Config: {
            clusterName: cluster.clusterName
          }
        }
      });
    }
    this.openIdConnectProviderIssuerUrl = resource.getAtt("openIDConnectIssuerUrl").toString();
    this.openIdConnectProviderArn = resource.ref;
  }

  private linkIAMRoleToOpenIDConnect(provider: Provider, cluster: Cluster,
                                     roleName: string, issuerUrl: string,
                                     serviceAccountName: string, serviceAccountNamespace: string) {
    new CustomResource(this, "OpenIDConnectRoleResource", {
      provider,
      resourceType: OPENIDCONNECT_ROLE_RESOURCE_TYPE,
      properties: {
        AssumeRoleArn: cluster._getKubectlCreationRoleArn(),
        Config: {
          roleName, issuerUrl, serviceAccountName, serviceAccountNamespace
        }
      }
    });
  }
}
