import type { Construct } from 'constructs';
import type { AcmeDomainValidationReference, IAcmeDomainValidationRef, IAcmeEndpointRef } from './certificatemanager.generated';
import { CfnAcmeDomainValidation } from './certificatemanager.generated';
import type { IResource } from '../../core';
import { Resource } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { IHostedZoneRef } from '../../interfaces/generated/aws-route53-interfaces.generated';

/**
 * A domain validation of an ACME endpoint
 */
export interface IAcmeDomainValidation extends IResource, IAcmeDomainValidationRef {
  /**
   * The ARN of the domain validation.
   *
   * @attribute
   */
  readonly acmeDomainValidationArn: string;
}

/**
 * Options for pre-approving a domain on an ACME endpoint
 */
export interface AcmeDomainValidationOptions {
  /**
   * The domain name to validate, for example `example.com`.
   */
  readonly domainName: string;

  /**
   * The Route 53 hosted zone in which ACM creates the DNS validation record.
   *
   * IMPORTANT: If `hostedZone` is not specified, the DNS validation record
   * must be created manually before ACM can validate the domain.
   *
   * @default - the DNS validation record must be created manually
   */
  readonly hostedZone?: IHostedZoneRef;

  /**
   * Whether certificates may be issued for the exact domain name.
   *
   * @default - ACM default
   */
  readonly allowExactDomain?: boolean;

  /**
   * Whether certificates may be issued for subdomains of the domain name,
   * for example `api.example.com` for `example.com`.
   *
   * @default - ACM default
   */
  readonly allowSubdomains?: boolean;

  /**
   * Whether wildcard certificates may be issued for the domain name,
   * for example `*.example.com` for `example.com`.
   *
   * @default - ACM default
   */
  readonly allowWildcards?: boolean;

  /**
   * Tags applied to the domain validation.
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Properties for a domain validation of an ACME endpoint
 */
export interface AcmeDomainValidationProps extends AcmeDomainValidationOptions {
  /**
   * The ACME endpoint the domain is pre-approved for.
   */
  readonly endpoint: IAcmeEndpointRef;
}

/**
 * Pre-approves a domain for certificate issuance through an ACME endpoint
 *
 * ACME clients can only request certificates for domains that are validated
 * on the endpoint. Validation uses a DNS record, which ACM creates for you
 * when a Route 53 hosted zone is provided.
 *
 * @resource AWS::CertificateManager::AcmeDomainValidation
 * @see https://docs.aws.amazon.com/acm/latest/userguide/acm-acme-domain-validation.html
 */
@propertyInjectable
export class AcmeDomainValidation extends Resource implements IAcmeDomainValidation {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-certificatemanager.AcmeDomainValidation';

  /**
   * Import an existing domain validation by its ARN.
   */
  public static fromAcmeDomainValidationArn(scope: Construct, id: string, acmeDomainValidationArn: string): IAcmeDomainValidation {
    class Import extends Resource implements IAcmeDomainValidation {
      public readonly acmeDomainValidationArn = acmeDomainValidationArn;
      public readonly acmeDomainValidationRef = { acmeDomainValidationArn };
    }

    return new Import(scope, id, { environmentFromArn: acmeDomainValidationArn });
  }

  /**
   * The ARN of the domain validation.
   *
   * @attribute
   */
  public readonly acmeDomainValidationArn: string;

  constructor(scope: Construct, id: string, props: AcmeDomainValidationProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const resource = new CfnAcmeDomainValidation(this, 'Resource', {
      acmeEndpointArn: props.endpoint.acmeEndpointRef.acmeEndpointArn,
      domainName: props.domainName,
      prevalidationOptions: {
        dnsPrevalidation: {
          hostedZoneId: props.hostedZone?.hostedZoneRef.hostedZoneId,
          domainScope: renderDomainScope(props),
        },
      },
      tags: props.tags ? Object.entries(props.tags).map(([key, value]) => ({ key, value })) : undefined,
    });

    this.acmeDomainValidationArn = resource.attrArn;
  }

  public get acmeDomainValidationRef(): AcmeDomainValidationReference {
    return { acmeDomainValidationArn: this.acmeDomainValidationArn };
  }
}

function renderDomainScope(options: AcmeDomainValidationOptions): CfnAcmeDomainValidation.DomainScopeProperty | undefined {
  if (options.allowExactDomain === undefined && options.allowSubdomains === undefined && options.allowWildcards === undefined) {
    return undefined;
  }
  return {
    exactDomain: renderEnabled(options.allowExactDomain),
    subdomains: renderEnabled(options.allowSubdomains),
    wildcards: renderEnabled(options.allowWildcards),
  };
}

function renderEnabled(value?: boolean): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return value ? 'ENABLED' : 'DISABLED';
}
