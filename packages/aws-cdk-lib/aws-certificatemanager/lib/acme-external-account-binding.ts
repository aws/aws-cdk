import type { Construct } from 'constructs';
import type { AcmeExternalAccountBindingReference, IAcmeEndpointRef, IAcmeExternalAccountBindingRef } from './certificatemanager.generated';
import { CfnAcmeExternalAccountBinding } from './certificatemanager.generated';
import * as iam from '../../aws-iam';
import type { Duration, IResource } from '../../core';
import { Resource, Stack, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

const ACME_SERVICE_PRINCIPAL = 'acm-acme.amazonaws.com';

/**
 * An external account binding (EAB) of an ACME endpoint
 */
export interface IAcmeExternalAccountBinding extends IResource, IAcmeExternalAccountBindingRef {
  /**
   * The ARN of the external account binding.
   *
   * @attribute
   */
  readonly acmeExternalAccountBindingArn: string;
}

/**
 * Options for creating an external account binding on an ACME endpoint
 */
export interface AcmeExternalAccountBindingOptions {
  /**
   * The IAM role that authorizes certificate issuance and revocation for ACME
   * clients registered with this binding.
   *
   * The role must trust the `acm-acme.amazonaws.com` service principal for
   * `sts:AssumeRole`, `sts:TagSession` and `sts:SetSourceIdentity`. No
   * permissions are added to a role that you provide.
   *
   * An `IRole` is accepted, rather than an `IRoleRef`, because it is exposed as
   * `role` so that policies can be added to it. [disable-awslint:prefer-ref-interface]
   *
   * @see https://docs.aws.amazon.com/acm/latest/userguide/security-iam-acme.html
   * @default - a role is created that may issue and revoke ACME certificates
   * for any domain validated on the endpoint, only in sessions that ACM
   * establishes for the endpoint on behalf of this account
   */
  readonly role?: iam.IRole;

  /**
   * How long the binding credentials can be used to register new ACME accounts.
   *
   * Must be a whole number of minutes. It is rendered in the largest unit
   * (days, hours or minutes) that represents it exactly.
   *
   * @default - the binding does not expire
   */
  readonly expiration?: Duration;

  /**
   * Tags applied to the external account binding.
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Properties for an external account binding
 */
export interface AcmeExternalAccountBindingProps extends AcmeExternalAccountBindingOptions {
  /**
   * The ACME endpoint the binding is created for.
   */
  readonly endpoint: IAcmeEndpointRef;
}

/**
 * An external account binding (EAB) of an ACME endpoint
 *
 * ACME clients register an account with the endpoint using the key ID and MAC
 * key of the binding. The credentials are not available through CloudFormation;
 * retrieve them with the `GetAcmeExternalAccountBindingCredentials` API, for
 * example `aws acm get-acme-external-account-binding-credentials`.
 *
 * @resource AWS::CertificateManager::AcmeExternalAccountBinding
 * @see https://docs.aws.amazon.com/acm/latest/userguide/acm-acme-eab.html
 */
@propertyInjectable
export class AcmeExternalAccountBinding extends Resource implements IAcmeExternalAccountBinding {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-certificatemanager.AcmeExternalAccountBinding';

  /**
   * Import an existing external account binding by its ARN.
   */
  public static fromAcmeExternalAccountBindingArn(scope: Construct, id: string, acmeExternalAccountBindingArn: string): IAcmeExternalAccountBinding {
    class Import extends Resource implements IAcmeExternalAccountBinding {
      public readonly acmeExternalAccountBindingArn = acmeExternalAccountBindingArn;
      public readonly acmeExternalAccountBindingRef = { acmeExternalAccountBindingArn };
    }

    return new Import(scope, id, { environmentFromArn: acmeExternalAccountBindingArn });
  }

  /**
   * The ARN of the external account binding.
   *
   * @attribute
   */
  public readonly acmeExternalAccountBindingArn: string;

  /**
   * The IAM role that authorizes certificate operations for ACME clients registered with this binding.
   */
  public readonly role: iam.IRole;

  constructor(scope: Construct, id: string, props: AcmeExternalAccountBindingProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.role = props.role ?? this.createDefaultRole(props.endpoint.acmeEndpointRef.acmeEndpointArn);

    const resource = new CfnAcmeExternalAccountBinding(this, 'Resource', {
      acmeEndpointArn: props.endpoint.acmeEndpointRef.acmeEndpointArn,
      roleArn: this.role.roleArn,
      expiration: props.expiration ? this.renderExpiration(props.expiration) : undefined,
      tags: props.tags ? Object.entries(props.tags).map(([key, value]) => ({ key, value })) : undefined,
    });
    // The role's policies must exist before ACM uses the role to issue certificates through this binding
    resource.node.addDependency(this.role);

    this.acmeExternalAccountBindingArn = resource.attrAcmeExternalAccountBindingArn;
  }

  public get acmeExternalAccountBindingRef(): AcmeExternalAccountBindingReference {
    return { acmeExternalAccountBindingArn: this.acmeExternalAccountBindingArn };
  }

  private createDefaultRole(acmeEndpointArn: string): iam.IRole {
    // Only allow sessions that ACM establishes for ACME, whose source identities begin with `acm-acme-`,
    // on behalf of this account (confused deputy prevention)
    const conditions = {
      StringLikeIfExists: { 'sts:SourceIdentity': 'acm-acme-*' },
      StringEquals: { 'aws:SourceAccount': Stack.of(this).account },
    };
    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal(ACME_SERVICE_PRINCIPAL).withConditions(conditions).withSessionTags(),
    });
    role.assumeRolePolicy?.addStatements(new iam.PolicyStatement({
      actions: ['sts:SetSourceIdentity'],
      principals: [new iam.ServicePrincipal(ACME_SERVICE_PRINCIPAL)],
      conditions,
    }));

    // ACM tags the assumed-role session with the ARN of the endpoint it acts for,
    // so the permissions only apply to sessions of this binding's endpoint
    const acmeOrigin = {
      StringEquals: {
        'acm:CertificateKeyPairOrigin': 'ACME',
        'aws:PrincipalTag/acme-endpoint-arn': acmeEndpointArn,
      },
    };
    // The certificate does not exist yet when it is requested, so issuance cannot be scoped to a certificate ARN
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['acm:RequestCertificate'],
      resources: ['*'],
      conditions: acmeOrigin,
    }));
    // Revocation does not carry acm:DomainNames or acm:KeyAlgorithm, so it must stay in its own statement.
    // Tagging is needed when the endpoint applies certificate tags.
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['acm:AddTagsToCertificate', 'acm:RevokeCertificate'],
      resources: [Stack.of(this).formatArn({ service: 'acm', resource: 'certificate', resourceName: '*' })],
      conditions: acmeOrigin,
    }));
    return role;
  }

  private renderExpiration(expiration: Duration): CfnAcmeExternalAccountBinding.ExpirationProperty {
    if (expiration.isUnresolved()) {
      return { type: 'MINUTES', value: expiration.toMinutes() };
    }
    const minutes = expiration.toMinutes({ integral: false });
    if (!Number.isInteger(minutes) || minutes < 1) {
      throw new ValidationError(lit`InvalidAcmeEabExpiration`, `expiration must be a whole number of minutes and at least 1 minute, got ${expiration.toHumanString()}`, this);
    }
    if (minutes % (24 * 60) === 0) {
      return { type: 'DAYS', value: minutes / (24 * 60) };
    }
    if (minutes % 60 === 0) {
      return { type: 'HOURS', value: minutes / 60 };
    }
    return { type: 'MINUTES', value: minutes };
  }
}
