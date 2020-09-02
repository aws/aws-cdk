import * as iam from '@aws-cdk/aws-iam';
import { ArnComponents, Construct, CustomResource, Token } from '@aws-cdk/core';
import { CLUSTER_RESOURCE_TYPE } from './cluster-resource-handler/consts';
import { ClusterResourceProvider } from './cluster-resource-provider';
import { CfnClusterProps, CfnCluster } from './eks.generated';

export interface ClusterResourceProps extends CfnClusterProps {

  /**
   * Enable private endpoint access to the cluster.
   */
  readonly endpointPrivateAccess: boolean;

  /**
   * Enable public endpoint access to the cluster.
   */
  readonly endpointPublicAccess: boolean;

  /**
   * Limit public address with CIDR blocks.
   */
  readonly publicAccessCidrs?: string[];

  /**
   * The role that has administrative privilages on the cluster.
   */
  readonly adminRole: iam.IRole;
}

/**
 * A low-level CFN resource Amazon EKS cluster implemented through a custom
 * resource.
 *
 * Implements EKS create/update/delete through a CloudFormation custom resource
 * in order to allow us to control the IAM role which creates the cluster. This
 * is required in order to be able to allow CloudFormation to interact with the
 * cluster via `kubectl` to enable Kubernetes management capabilities like apply
 * manifest and IAM role/user RBAC mapping.
 */
export class ClusterResource extends Construct {
  public readonly attrEndpoint: string;
  public readonly attrArn: string;
  public readonly attrCertificateAuthorityData: string;
  public readonly attrClusterSecurityGroupId: string;
  public readonly attrEncryptionConfigKeyArn: string;
  public readonly attrOpenIdConnectIssuerUrl: string;
  public readonly attrOpenIdConnectIssuer: string;
  public readonly ref: string;

  constructor(scope: Construct, id: string, props: ClusterResourceProps) {
    super(scope, id);

    if (!props.roleArn) {
      throw new Error('"roleArn" is required');
    }

    const provider = ClusterResourceProvider.getOrCreate(this, {
      adminRole: props.adminRole,
    });

    const resource = new CustomResource(this, 'Resource', {
      resourceType: CLUSTER_RESOURCE_TYPE,
      serviceToken: provider.serviceToken,
      properties: {
        // the structure of config needs to be that of 'aws.EKS.CreateClusterRequest' since its passed as is
        // to the eks.createCluster sdk invocation.
        Config: {
          name: props.name,
          version: props.version,
          roleArn: props.roleArn,
          encryptionConfig: props.encryptionConfig,
          resourcesVpcConfig: {
            subnetIds: (props.resourcesVpcConfig as CfnCluster.ResourcesVpcConfigProperty).subnetIds,
            securityGroupIds: (props.resourcesVpcConfig as CfnCluster.ResourcesVpcConfigProperty).securityGroupIds,
            endpointPublicAccess: props.endpointPublicAccess,
            endpointPrivateAccess: props.endpointPrivateAccess,
            publicAccessCidrs: props.publicAccessCidrs,
          },
        },
        AssumeRoleArn: props.adminRole.roleArn,

        // IMPORTANT: increment this number when you add new attributes to the
        // resource. Otherwise, CloudFormation will error with "Vendor response
        // doesn't contain XXX key in object" (see #8276) by incrementing this
        // number, you will effectively cause a "no-op update" to the cluster
        // which will return the new set of attribute.
        AttributesRevision: 2,
      },
    });

    resource.node.addDependency(props.adminRole);

    this.ref = resource.ref;
    this.attrEndpoint = Token.asString(resource.getAtt('Endpoint'));
    this.attrArn = Token.asString(resource.getAtt('Arn'));
    this.attrCertificateAuthorityData = Token.asString(resource.getAtt('CertificateAuthorityData'));
    this.attrClusterSecurityGroupId = Token.asString(resource.getAtt('ClusterSecurityGroupId'));
    this.attrEncryptionConfigKeyArn = Token.asString(resource.getAtt('EncryptionConfigKeyArn'));
    this.attrOpenIdConnectIssuerUrl = Token.asString(resource.getAtt('OpenIdConnectIssuerUrl'));
    this.attrOpenIdConnectIssuer = Token.asString(resource.getAtt('OpenIdConnectIssuer'));
  }
}

export function clusterArnComponents(clusterName: string): ArnComponents {
  return {
    service: 'eks',
    resource: 'cluster',
    resourceName: clusterName,
  };
}
