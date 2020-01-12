import * as cfn from '@aws-cdk/aws-cloudformation';
import * as iam from '@aws-cdk/aws-iam';
import { ArnComponents, Construct, Lazy, Stack, Token } from '@aws-cdk/core';
import { ClusterResourceProvider } from './cluster-resource-provider';
import { CfnClusterProps } from './eks.generated';

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
  /**
   * The AWS CloudFormation resource type used for this resource.
   */
  public static readonly RESOURCE_TYPE = 'Custom::AWSCDK-EKS-Cluster';

  public readonly attrEndpoint: string;
  public readonly attrArn: string;
  public readonly attrCertificateAuthorityData: string;
  public readonly ref: string;

  /**
   * The IAM role which created the cluster. Initially this is the only IAM role
   * that gets administrator privilages on the cluster (`system:masters`), and
   * will be able to issue `kubectl` commands against it.
   */
  private readonly creationRole: iam.Role;
  private readonly trustedPrincipals: string[] = [];

  constructor(scope: Construct, id: string, props: CfnClusterProps) {
    super(scope, id);

    const stack = Stack.of(this);
    const provider = ClusterResourceProvider.getOrCreate(this);

    if (!props.roleArn) {
      throw new Error(`"roleArn" is required`);
    }

    // the role used to create the cluster. this becomes the administrator role
    // of the cluster.
    this.creationRole = new iam.Role(this, 'CreationRole', {
      assumedBy: new iam.CompositePrincipal(...provider.roles.map(x => new iam.ArnPrincipal(x.roleArn)))
    });

    // the CreateCluster API will allow the cluster to assume this role, so we
    // need to allow the lambda execution role to pass it.
    this.creationRole.addToPolicy(new iam.PolicyStatement({
      actions: [ 'iam:PassRole' ],
      resources: [ props.roleArn ]
    }));

    // if we know the cluster name, restrict the policy to only allow
    // interacting with this specific cluster otherwise, we will have to grant
    // this role to manage all clusters in the account. this must be lazy since
    // `props.name` may contain a lazy value that conditionally resolves to a
    // physical name.
    const resourceArn = Lazy.stringValue({
      produce: () => stack.resolve(props.name)
        ? stack.formatArn(clusterArnComponents(stack.resolve(props.name)))
        : '*'
    });

    this.creationRole.addToPolicy(new iam.PolicyStatement({
      actions: [ 'eks:CreateCluster', 'eks:DescribeCluster', 'eks:DeleteCluster', 'eks:UpdateClusterVersion', 'eks:UpdateClusterConfig' ],
      resources: [ resourceArn ]
    }));

    const resource = new cfn.CustomResource(this, 'Resource', {
      resourceType: ClusterResource.RESOURCE_TYPE,
      provider: provider.provider,
      properties: {
        Config: props,
        AssumeRoleArn: this.creationRole.roleArn
      }
    });

    resource.node.addDependency(this.creationRole);

    this.ref = resource.ref;
    this.attrEndpoint = Token.asString(resource.getAtt('Endpoint'));
    this.attrArn = Token.asString(resource.getAtt('Arn'));
    this.attrCertificateAuthorityData = Token.asString(resource.getAtt('CertificateAuthorityData'));
  }

  /**
   * Returns the ARN of the cluster creation role and grants `trustedRole`
   * permissions to assume this role.
   */
  public getCreationRoleArn(trustedRole: iam.IRole): string {
    if (!this.trustedPrincipals.includes(trustedRole.roleArn)) {
      if (!this.creationRole.assumeRolePolicy) {
        throw new Error(`unexpected: cluster creation role must have trust policy`);
      }

      this.creationRole.assumeRolePolicy.addStatements(new iam.PolicyStatement({
        actions: [ 'sts:AssumeRole' ],
        principals: [ new iam.ArnPrincipal(trustedRole.roleArn) ]
      }));

      this.trustedPrincipals.push(trustedRole.roleArn);
    }
    return this.creationRole.roleArn;
  }
}

export function clusterArnComponents(clusterName: string): ArnComponents {
  return {
    service: 'eks',
    resource: 'cluster',
    resourceName: clusterName,
  };
}