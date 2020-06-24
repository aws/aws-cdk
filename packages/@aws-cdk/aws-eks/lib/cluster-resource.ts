import * as iam from '@aws-cdk/aws-iam';
import { ArnComponents, Construct, CustomResource, Lazy, Stack, Token } from '@aws-cdk/core';
import { CLUSTER_RESOURCE_TYPE } from './cluster-resource-handler/consts';
import { ClusterResourceProvider } from './cluster-resource-provider';
import { CfnClusterProps } from './eks.generated';
import { ControlPlaneLogging } from './logging';

/**
 * Configuration props for EKS Cluster custom resource.
 */
export interface ClusterResourceProps extends CfnClusterProps {
  /**
   * Enable or disable exporting the Kubernetes control plane logs for your cluster to CloudWatch Logs.
   *
   * @see https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html
   *
   * @default - Fully disabled, meaning that cluster control plane logs are not exported to CloudWatch Logs.
   */
  readonly logging?: ControlPlaneLogging;
}

/**
 * The available cluster control plane log types.
 */
export type LogKind = keyof ControlPlaneLogging;

/**
 * An object representing the enabled or disabled Kubernetes control plane logs for your cluster.
 */
export interface LogSetup {
  /**
   * If a log type is enabled, that log type exports its control plane logs to CloudWatch Logs.
   * If a log type is not enabled, that log type does not export its control plane logs.
   * Each individual log type can be enabled or disabled independently.
   */
  readonly enabled: boolean;

  /**
   * The available cluster control plane log types.
   */
  readonly types: LogKind[];
}

/**
 * An object representing the logging configuration for resources in your cluster.
 */
export interface Logging {

  /**
   * The cluster control plane logging configuration for your cluster.
   */
  clusterLogging: LogSetup[];
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
  /**
   * The IAM role which created the cluster. Initially this is the only IAM role
   * that gets administrator privilages on the cluster (`system:masters`), and
   * will be able to issue `kubectl` commands against it.
   */
  public readonly creationRole: iam.Role;

  private readonly trustedPrincipals: string[] = [];

  constructor(scope: Construct, id: string, props: ClusterResourceProps) {
    super(scope, id);

    const stack = Stack.of(this);
    const provider = ClusterResourceProvider.getOrCreate(this);

    if (!props.roleArn) {
      throw new Error('"roleArn" is required');
    }

    // the role used to create the cluster. this becomes the administrator role
    // of the cluster.
    this.creationRole = new iam.Role(this, 'CreationRole', {
      assumedBy: new iam.CompositePrincipal(...provider.roles.map(x => new iam.ArnPrincipal(x.roleArn))),
    });

    // the CreateCluster API will allow the cluster to assume this role, so we
    // need to allow the lambda execution role to pass it.
    this.creationRole.addToPolicy(new iam.PolicyStatement({
      actions: [ 'iam:PassRole' ],
      resources: [ props.roleArn ],
    }));

    // if we know the cluster name, restrict the policy to only allow
    // interacting with this specific cluster otherwise, we will have to grant
    // this role to manage all clusters in the account. this must be lazy since
    // `props.name` may contain a lazy value that conditionally resolves to a
    // physical name.
    const resourceArns = Lazy.listValue({
      produce: () => {
        const arn = stack.formatArn(clusterArnComponents(stack.resolve(props.name)));
        return stack.resolve(props.name)
          ? [ arn, `${arn}/*` ] // see https://github.com/aws/aws-cdk/issues/6060
          : [ '*' ];
      },
    });

    const fargateProfileResourceArn = Lazy.stringValue({
      produce: () => stack.resolve(props.name)
        ? stack.formatArn({ service: 'eks', resource: 'fargateprofile', resourceName: stack.resolve(props.name) + '/*' })
        : '*',
    });

    this.creationRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'ec2:DescribeSubnets',
        'ec2:DescribeRouteTables',
      ],
      resources: [ '*' ],
    }));

    this.creationRole.addToPolicy(new iam.PolicyStatement({
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

    this.creationRole.addToPolicy(new iam.PolicyStatement({
      actions: [ 'eks:DescribeFargateProfile', 'eks:DeleteFargateProfile' ],
      resources: [ fargateProfileResourceArn ],
    }));

    this.creationRole.addToPolicy(new iam.PolicyStatement({
      actions: [ 'iam:GetRole' ],
      resources: [ '*' ],
    }));

    this.creationRole.addToPolicy(new iam.PolicyStatement({
      actions: [ 'iam:CreateServiceLinkedRole' ],
      resources: [ '*' ],
    }));

    const enabledLogTypes: LogKind[] = [];
    const disabledLogTypes: LogKind[] = [];
    for (const [key, value] of Object.entries(props.logging || {})) {
      if (value === true) {
        enabledLogTypes.push(key as LogKind);
      } else {
        disabledLogTypes.push(key as LogKind);
      }
    }
    let logging: undefined | Logging;
    if (enabledLogTypes.length > 0) {
      logging = {
        clusterLogging: [
          {
            enabled: true,
            types: enabledLogTypes,
          },
          {
            enabled: false,
            types: disabledLogTypes,
          },
        ],
      };
    }

    const resource = new CustomResource(this, 'Resource', {
      resourceType: CLUSTER_RESOURCE_TYPE,
      serviceToken: provider.serviceToken,
      properties: {
        Config: encodeValues({
          ...props,
          logging,
        }),
        AssumeRoleArn: this.creationRole.roleArn,

        // IMPORTANT: increment this number when you add new attributes to the
        // resource. Otherwise, CloudFormation will error with "Vendor response
        // doesn't contain XXX key in object" (see #8276) by incrementing this
        // number, you will effectively cause a "no-op update" to the cluster
        // which will return the new set of attribute.
        AttributesRevision: 2,
      },
    });

    resource.node.addDependency(this.creationRole);

    this.ref = resource.ref;
    this.attrEndpoint = Token.asString(resource.getAtt('Endpoint'));
    this.attrArn = Token.asString(resource.getAtt('Arn'));
    this.attrCertificateAuthorityData = Token.asString(resource.getAtt('CertificateAuthorityData'));
    this.attrClusterSecurityGroupId = Token.asString(resource.getAtt('ClusterSecurityGroupId'));
    this.attrEncryptionConfigKeyArn = Token.asString(resource.getAtt('EncryptionConfigKeyArn'));
    this.attrOpenIdConnectIssuerUrl = Token.asString(resource.getAtt('OpenIdConnectIssuerUrl'));
    this.attrOpenIdConnectIssuer = Token.asString(resource.getAtt('OpenIdConnectIssuer'));
  }

  /**
   * Grants `trustedRole` permissions to assume the creation role.
   */
  public addTrustedRole(trustedRole: iam.IRole): void {
    if (this.trustedPrincipals.includes(trustedRole.roleArn)) {
      return;
    }

    if (!this.creationRole.assumeRolePolicy) {
      throw new Error('unexpected: cluster creation role must have trust policy');
    }

    this.creationRole.assumeRolePolicy.addStatements(new iam.PolicyStatement({
      actions: [ 'sts:AssumeRole' ],
      principals: [ new iam.ArnPrincipal(trustedRole.roleArn) ],
    }));

    this.trustedPrincipals.push(trustedRole.roleArn);
  }
}

export function clusterArnComponents(clusterName: string): ArnComponents {
  return {
    service: 'eks',
    resource: 'cluster',
    resourceName: clusterName,
  };
}

/**
 * Encodes values (specially boolean) as special strings
 *
 * Because CloudFormation converts every input as string for custom resources,
 * we will use these encoded values to cast them into proper types.
 */
function encodeValues(object: object) {
  return JSON.parse(JSON.stringify(object), (_k, v) => {
    switch (v) {
      case true:
        return 'TRUE:BOOLEAN';
      case false:
        return 'FALSE:BOOLEAN';
      default:
        return v;
    }
  });
}
