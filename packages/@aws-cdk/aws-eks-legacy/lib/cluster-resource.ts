import * as path from 'path';
import * as cfn from '@aws-cdk/aws-cloudformation';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration, Token } from '@aws-cdk/core';
import { CfnClusterProps } from './eks.generated';
import { KubectlLayer } from './kubectl-layer';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

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
  public readonly creationRole: iam.IRole;

  constructor(scope: Construct, id: string, props: CfnClusterProps) {
    super(scope, id);

    // each cluster resource will have it's own lambda handler since permissions
    // are scoped to this cluster and related resources like it's role
    const handler = new lambda.Function(this, 'ResourceHandler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'cluster-resource')),
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'index.handler',
      timeout: Duration.minutes(15),
      memorySize: 512,
      layers: [KubectlLayer.getOrCreate(this)],
    });

    if (!props.roleArn) {
      throw new Error('"roleArn" is required');
    }

    // since we don't know the cluster name at this point, we must give this role star resource permissions
    handler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['eks:CreateCluster', 'eks:DescribeCluster', 'eks:DeleteCluster', 'eks:UpdateClusterVersion'],
      resources: ['*'],
    }));

    // the CreateCluster API will allow the cluster to assume this role, so we
    // need to allow the lambda execution role to pass it.
    handler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['iam:PassRole'],
      resources: [props.roleArn],
    }));

    const resource = new cfn.CustomResource(this, 'Resource', {
      resourceType: ClusterResource.RESOURCE_TYPE,
      provider: cfn.CustomResourceProvider.lambda(handler),
      properties: {
        Config: props,
      },
    });

    this.ref = resource.ref;
    this.attrEndpoint = Token.asString(resource.getAtt('Endpoint'));
    this.attrArn = Token.asString(resource.getAtt('Arn'));
    this.attrCertificateAuthorityData = Token.asString(resource.getAtt('CertificateAuthorityData'));
    this.creationRole = handler.role!;
  }
}
