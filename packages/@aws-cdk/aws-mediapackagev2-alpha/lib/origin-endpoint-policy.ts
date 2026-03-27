import { Resource } from 'aws-cdk-lib';
import type { IRole } from 'aws-cdk-lib/aws-iam';
import { PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnOriginEndpointPolicy } from 'aws-cdk-lib/aws-mediapackagev2';
import type { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { IOriginEndpoint } from './endpoint';

/**
 * Options for configuring CDN Authorization Configuration.
 *
 * @see https://docs.aws.amazon.com/mediapackage/latest/userguide/cdn-auth.html
 */
export interface CdnAuthConfiguration {
  /**
   * Secrets to use for CDN authorization.
   */
  readonly secrets: ISecret[];
  /**
   * Role to use for reading the secrets.
   * If not provided, a role will be created automatically with the required permissions
   * (secretsmanager:GetSecretValue, secretsmanager:DescribeSecret, secretsmanager:BatchGetSecretValue,
   * and kms:Decrypt if the secret uses a customer-managed KMS key).
   *
   * @default - a new role is created
   */
  readonly role?: IRole;
}

/**
 * Properties for Origin Endpoint policy
 */
export interface OriginEndpointPolicyProps {
  /**
   * `OriginEndpoint` to apply the Origin Endpoint Policy to.
   */
  readonly originEndpoint: IOriginEndpoint;

  /**
   * Initial policy document to apply.
   *
   * @default - empty policy document
   */
  readonly policyDocument?: PolicyDocument;

  /**
   * Optional CDN Authorization configuration.
   *
   * @default - No header based CDN authorization
   */
  readonly cdnAuth?: CdnAuthConfiguration;

}

/**
 * The origin endpoint policy for an AWS Elemental MediaPackage V2 Origin Endpoint
 *
 * Policies define the operations that are allowed on this resource.
 *
 * You almost never need to define this construct directly.
 *
 * All AWS resources that support resource policies have a method called
 * `addToResourcePolicy()`, which will automatically create a new resource
 * policy if one doesn't exist yet, otherwise it will add to the existing
 * policy.
 *
 * The origin endpoint policy method is implemented differently than `addToResourcePolicy()`
 * as `OriginEndpointPolicy` creates a new policy without knowing one earlier existed.
 * This will cause a resource conflict if both are invoked (or even multiple origin endpoint
 * policies are defined), so care is to be taken to ensure only 1 policy
 * is created per origin endpoint.
 *
 * Hence it's strongly recommended to use `addToResourcePolicy()`.
 */
@propertyInjectable
export class OriginEndpointPolicy extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-mediapackagev2-alpha.OriginEndpointPolicy';

  /**
   * A policy document containing permissions to add to the specified Origin Endpoint.
   */
  public readonly document: PolicyDocument;

  constructor(scope: Construct, id: string, props: OriginEndpointPolicyProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.document = props.policyDocument ?? new PolicyDocument();

    // Auto-create CDN auth role if not provided
    // @see https://docs.aws.amazon.com/mediapackage/latest/userguide/setting-up-create-trust-rel.html
    const cdnAuthRole = props.cdnAuth?.role ?? (props.cdnAuth ? new Role(this, 'CdnAuthRole', {
      assumedBy: new ServicePrincipal('mediapackagev2.amazonaws.com'),
      description: 'Role for MediaPackage V2 CDN authorization to read secrets',
    }) : undefined);

    // Auto-grant the CDN auth role read access to the secrets (before creating the CFN resource)
    // @see https://docs.aws.amazon.com/mediapackage/latest/userguide/cdn-auth.html#cdn-auth-iam
    if (props.cdnAuth && cdnAuthRole) {
      props.cdnAuth.secrets.forEach(secret => {
        secret.grantRead(cdnAuthRole);
      });
      // BatchGetSecretValue is required by MediaPackage V2 for CDN authorization
      cdnAuthRole.addToPrincipalPolicy(new PolicyStatement({
        actions: ['secretsmanager:BatchGetSecretValue'],
        resources: ['*'],
      }));
    }

    const cfnResource = new CfnOriginEndpointPolicy(this, 'Resource', {
      channelGroupName: props.originEndpoint.channelGroupName,
      channelName: props.originEndpoint.channelName,
      originEndpointName: props.originEndpoint.originEndpointName,
      policy: this.document,
      cdnAuthConfiguration: props.cdnAuth && cdnAuthRole ? {
        cdnIdentifierSecretArns: props.cdnAuth.secrets.map(secret => secret.secretArn),
        secretsRoleArn: cdnAuthRole.roleArn,
      } : undefined,
    });

    // Ensure IAM policies are created before the endpoint policy
    if (cdnAuthRole) {
      cfnResource.node.addDependency(cdnAuthRole);
    }
  }
}
