import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import { ArnComponents, CustomResource, Token, Stack, Lazy } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CLUSTER_RESOURCE_TYPE } from './cluster-resource-handler/consts';
import { ClusterResourceProvider } from './cluster-resource-provider';
import { CfnCluster } from './eks.generated';

export interface ClusterResourceProps {
  readonly resourcesVpcConfig: CfnCluster.ResourcesVpcConfigProperty;
  readonly roleArn: string;
  readonly encryptionConfig?: Array<CfnCluster.EncryptionConfigProperty>;
  readonly kubernetesNetworkConfig?: CfnCluster.KubernetesNetworkConfigProperty;
  readonly name: string;
  readonly version?: string;
  readonly endpointPrivateAccess: boolean;
  readonly endpointPublicAccess: boolean;
  readonly publicAccessCidrs?: string[];
  readonly vpc: ec2.IVpc;
  readonly environment?: { [key: string]: string };
  readonly subnets?: ec2.ISubnet[];
  readonly secretsEncryptionKey?: kms.IKey;
  readonly onEventLayer?: lambda.ILayerVersion;
  readonly clusterHandlerSecurityGroup?: ec2.ISecurityGroup;
  readonly tags?: { [key: string]: string };
  readonly logging?: { [key: string]: [ { [key: string]: any }, { [key: string]: any } ] };
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

  public readonly adminRole: iam.Role;

  constructor(scope: Construct, id: string, props: ClusterResourceProps) {
    super(scope, id);

    if (!props.roleArn) {
      throw new Error('"roleArn" is required');
    }

    this.adminRole = this.createAdminRole(props);

    const provider = ClusterResourceProvider.getOrCreate(this, {
      adminRole: this.adminRole,
      subnets: props.subnets,
      vpc: props.vpc,
      environment: props.environment,
      onEventLayer: props.onEventLayer,
      securityGroup: props.clusterHandlerSecurityGroup,
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
          kubernetesNetworkConfig: props.kubernetesNetworkConfig,
          resourcesVpcConfig: {
            subnetIds: (props.resourcesVpcConfig as CfnCluster.ResourcesVpcConfigProperty).subnetIds,
            securityGroupIds: (props.resourcesVpcConfig as CfnCluster.ResourcesVpcConfigProperty).securityGroupIds,
            endpointPublicAccess: props.endpointPublicAccess,
            endpointPrivateAccess: props.endpointPrivateAccess,
            publicAccessCidrs: props.publicAccessCidrs,
          },
          tags: props.tags,
          logging: props.logging,
        },
        AssumeRoleArn: this.adminRole.roleArn,

        // IMPORTANT: increment this number when you add new attributes to the
        // resource. Otherwise, CloudFormation will error with "Vendor response
        // doesn't contain XXX key in object" (see #8276) by incrementing this
        // number, you will effectively cause a "no-op update" to the cluster
        // which will return the new set of attribute.
        AttributesRevision: 2,
      },
    });

    resource.node.addDependency(this.adminRole);

    this.ref = resource.ref;
    this.attrEndpoint = Token.asString(resource.getAtt('Endpoint'));
    this.attrArn = Token.asString(resource.getAtt('Arn'));
    this.attrCertificateAuthorityData = Token.asString(resource.getAtt('CertificateAuthorityData'));
    this.attrClusterSecurityGroupId = Token.asString(resource.getAtt('ClusterSecurityGroupId'));
    this.attrEncryptionConfigKeyArn = Token.asString(resource.getAtt('EncryptionConfigKeyArn'));
    this.attrOpenIdConnectIssuerUrl = Token.asString(resource.getAtt('OpenIdConnectIssuerUrl'));
    this.attrOpenIdConnectIssuer = Token.asString(resource.getAtt('OpenIdConnectIssuer'));
  }

  private createAdminRole(props: ClusterResourceProps) {
    const stack = Stack.of(this);

    // the role used to create the cluster. this becomes the administrator role
    // of the cluster.
    const creationRole = new iam.Role(this, 'CreationRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // the CreateCluster API will allow the cluster to assume this role, so we
    // need to allow the lambda execution role to pass it.
    creationRole.addToPolicy(new iam.PolicyStatement({
      actions: ['iam:PassRole'],
      resources: [props.roleArn],
    }));

    // if we know the cluster name, restrict the policy to only allow
    // interacting with this specific cluster otherwise, we will have to grant
    // this role to manage all clusters in the account. this must be lazy since
    // `props.name` may contain a lazy value that conditionally resolves to a
    // physical name.
    const resourceArns = Lazy.list({
      produce: () => {
        const arn = stack.formatArn(clusterArnComponents(stack.resolve(props.name)));
        return stack.resolve(props.name)
          ? [arn, `${arn}/*`] // see https://github.com/aws/aws-cdk/issues/6060
          : ['*'];
      },
    });

    const fargateProfileResourceArn = Lazy.string({
      produce: () => stack.resolve(props.name)
        ? stack.formatArn({ service: 'eks', resource: 'fargateprofile', resourceName: stack.resolve(props.name) + '/*' })
        : '*',
    });

    creationRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'eks:CreateCluster',
        'eks:DescribeCluster',
        'eks:DescribeUpdate',
        'eks:DeleteCluster',
        'eks:UpdateClusterVersion',
        'eks:UpdateClusterConfig',
        'eks:CreateFargateProfile',
        'eks:TagResource',
        'eks:UntagResource',
      ],
      resources: resourceArns,
    }));

    creationRole.addToPolicy(new iam.PolicyStatement({
      actions: ['eks:DescribeFargateProfile', 'eks:DeleteFargateProfile'],
      resources: [fargateProfileResourceArn],
    }));

    creationRole.addToPolicy(new iam.PolicyStatement({
      actions: ['iam:GetRole', 'iam:listAttachedRolePolicies'],
      resources: ['*'],
    }));

    creationRole.addToPolicy(new iam.PolicyStatement({
      actions: ['iam:CreateServiceLinkedRole'],
      resources: ['*'],
    }));

    // see https://github.com/aws/aws-cdk/issues/9027
    // these actions are the combined 'ec2:Describe*' actions taken from the EKS SLR policies.
    // (AWSServiceRoleForAmazonEKS, AWSServiceRoleForAmazonEKSForFargate, AWSServiceRoleForAmazonEKSNodegroup)
    creationRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'ec2:DescribeInstances',
        'ec2:DescribeNetworkInterfaces',
        'ec2:DescribeSecurityGroups',
        'ec2:DescribeSubnets',
        'ec2:DescribeRouteTables',
        'ec2:DescribeDhcpOptions',
        'ec2:DescribeVpcs',
      ],
      resources: ['*'],
    }));

    // grant cluster creation role sufficient permission to access the specified key
    // see https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html
    if (props.secretsEncryptionKey) {
      creationRole.addToPolicy(new iam.PolicyStatement({
        actions: [
          'kms:Encrypt',
          'kms:Decrypt',
          'kms:DescribeKey',
          'kms:CreateGrant',
        ],
        resources: [props.secretsEncryptionKey.keyArn],
      }));
    }

    return creationRole;
  }
}

export function clusterArnComponents(clusterName: string): ArnComponents {
  return {
    service: 'eks',
    resource: 'cluster',
    resourceName: clusterName,
  };
}
