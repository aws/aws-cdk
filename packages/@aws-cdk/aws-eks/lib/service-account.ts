import { CustomResource } from "@aws-cdk/aws-cloudformation";
import { FederatedPrincipal, PolicyStatement, Role } from "@aws-cdk/aws-iam";
import { Construct } from "@aws-cdk/core";
import { Cluster } from "./cluster";
import { OPENIDCONNECT_PROVIDER_RESOURCE_TYPE } from "./cluster-resource-handler/consts";
import { ClusterResourceProvider } from "./cluster-resource-provider";

export interface ServiceAccountOptions {
  readonly name: string;
  readonly namespace: string;
  readonly policyStatements?: PolicyStatement[];
}

export interface ServiceAccountProps extends ServiceAccountOptions {
  readonly cluster: Cluster;
}

export class ServiceAccount extends Construct {

  public readonly serviceAccountName: string;

  private readonly role: Role;

  private openIDConnectSubject: string | undefined;
  private openIdConnectProviderArn: string | undefined;

  constructor(scope: Construct, id: string, props: ServiceAccountProps) {
    super(scope, id);

    const { cluster, name, namespace, policyStatements } = props;
    // Ensure OpenIDConnect association
    this.enableOpenIDConnectIAMProvider(cluster);
    // Create IAM Role
    const condition: { [id: string]: any; } = {};
    condition[this.openIDConnectSubject!] = `system:serviceaccount:${namespace}:${name}`;
    this.role = new Role(this, "Role", {
      assumedBy: new FederatedPrincipal(
        this.openIdConnectProviderArn!, { StringEquals: condition }, "sts:AssumeRoleWithWebIdentity"
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
    this.openIDConnectSubject = resource.getAtt("openIDConnectSubject").toString();
    this.openIdConnectProviderArn = resource.ref;
  }
}
