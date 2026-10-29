import type { Construct } from 'constructs';
import type { AcmeDomainValidationOptions, IAcmeDomainValidation } from './acme-domain-validation';
import { AcmeDomainValidation } from './acme-domain-validation';
import type { AcmeExternalAccountBindingOptions } from './acme-external-account-binding';
import { AcmeExternalAccountBinding } from './acme-external-account-binding';
import type { KeyAlgorithm } from './certificate';
import type { AcmeEndpointReference, IAcmeEndpointRef } from './certificatemanager.generated';
import { CfnAcmeEndpoint } from './certificatemanager.generated';
import * as cloudwatch from '../../aws-cloudwatch';
import type { IResource } from '../../core';
import { Duration, Resource, Token, UnscopedValidationError, ValidationError } from '../../core';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * An ACME endpoint in AWS Certificate Manager
 */
export interface IAcmeEndpoint extends IResource, IAcmeEndpointRef {
  /**
   * The ARN of the ACME endpoint.
   *
   * @attribute
   */
  readonly acmeEndpointArn: string;

  /**
   * The ACME directory URL of the endpoint.
   *
   * Provide this URL to ACME clients (for example Certbot or cert-manager)
   * as the ACME server.
   *
   * @attribute
   */
  readonly endpointUrl: string;

  /**
   * CloudWatch metrics for this ACME endpoint.
   */
  readonly metrics: AcmeEndpointMetrics;

  /**
   * Pre-approve a domain for certificate issuance through this endpoint.
   */
  addDomainValidation(id: string, options: AcmeDomainValidationOptions): IAcmeDomainValidation;

  /**
   * Create an external account binding (EAB) that ACME clients use to register with this endpoint.
   *
   * Returns the concrete binding so that policies can be added to its `role`.
   */
  addExternalAccountBinding(id: string, options?: AcmeExternalAccountBindingOptions): AcmeExternalAccountBinding;
}

/**
 * How an ACME endpoint authorizes certificate orders
 */
export class AcmeAuthorizationBehavior {
  /**
   * Domains are authorized by domain validations configured on the endpoint
   * in advance, instead of by live ACME challenges.
   */
  public static readonly PRE_APPROVED = new AcmeAuthorizationBehavior('PRE_APPROVED');

  /**
   * @param value the authorization behavior value as expected by ACM
   */
  constructor(public readonly value: string) {}
}

/**
 * Options for an ACME endpoint that issues publicly trusted certificates
 */
export interface PublicAcmeCertificateAuthorityOptions {
  /**
   * The key algorithms that certificates issued through the endpoint may use.
   *
   * Certificate requests whose public key uses any other algorithm are rejected.
   * Supported values are `KeyAlgorithm.RSA_2048`, `KeyAlgorithm.EC_PRIME256V1`
   * and `KeyAlgorithm.EC_SECP384R1`, other values throw an error at synthesis.
   * An empty list is the same as not setting this property.
   *
   * @default - no key algorithm enforcement
   */
  readonly allowedKeyAlgorithms?: KeyAlgorithm[];
}

/**
 * Key algorithms that ACM accepts for certificates issued through an ACME endpoint
 */
const ACME_KEY_ALGORITHMS = ['RSA_2048', 'EC_prime256v1', 'EC_secp384r1'];

/**
 * The certificate authority an ACME endpoint issues certificates from
 */
export abstract class AcmeCertificateAuthority {
  /**
   * Issue publicly trusted certificates from Amazon Trust Services.
   */
  public static public(options: PublicAcmeCertificateAuthorityOptions = {}): AcmeCertificateAuthority {
    for (const algorithm of options.allowedKeyAlgorithms ?? []) {
      if (!Token.isUnresolved(algorithm.name) && !ACME_KEY_ALGORITHMS.includes(algorithm.name)) {
        throw new UnscopedValidationError(lit`UnsupportedAcmeKeyAlgorithm`, `key algorithm ${JSON.stringify(algorithm.name)} is not supported by ACME endpoints, use one of ${ACME_KEY_ALGORITHMS.join(', ')}`);
      }
    }
    return new PublicAcmeCertificateAuthority(options);
  }

  /**
   * Render the certificate authority configuration.
   *
   * @internal
   */
  public abstract _render(): CfnAcmeEndpoint.CertificateAuthorityProperty;
}

class PublicAcmeCertificateAuthority extends AcmeCertificateAuthority {
  constructor(private readonly options: PublicAcmeCertificateAuthorityOptions) {
    super();
  }

  public _render(): CfnAcmeEndpoint.CertificateAuthorityProperty {
    const algorithms = this.options.allowedKeyAlgorithms ?? [];
    return {
      publicCertificateAuthority: {
        allowedKeyAlgorithms: algorithms.length > 0 ? algorithms.map((algorithm) => algorithm.name) : undefined,
      },
    };
  }
}

/**
 * Properties for an ACME endpoint
 */
export interface AcmeEndpointProps {
  /**
   * The certificate authority that certificates are issued from.
   *
   * @default AcmeCertificateAuthority.public()
   */
  readonly certificateAuthority?: AcmeCertificateAuthority;

  /**
   * How the endpoint authorizes certificate orders.
   *
   * @default AcmeAuthorizationBehavior.PRE_APPROVED
   */
  readonly authorizationBehavior?: AcmeAuthorizationBehavior;

  /**
   * Whether ACME clients must provide contact information when they register an account.
   *
   * @default - ACM default, contact information is not required
   */
  readonly contactRequired?: boolean;

  /**
   * Tags that ACM applies to every certificate issued through this endpoint.
   *
   * Issuance through an endpoint with certificate tags requires the
   * `acm:AddTagsToCertificate` permission on the external account binding role.
   *
   * @default - no certificate tags
   */
  readonly certificateTags?: { [key: string]: string };

  /**
   * Tags applied to the ACME endpoint.
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Attributes for importing an ACME endpoint
 */
export interface AcmeEndpointAttributes {
  /**
   * The ARN of the ACME endpoint.
   */
  readonly acmeEndpointArn: string;

  /**
   * The ACME directory URL of the endpoint.
   *
   * @default - the endpoint URL is not available on the imported endpoint
   */
  readonly endpointUrl?: string;
}

abstract class AcmeEndpointBase extends Resource implements IAcmeEndpoint {
  public abstract readonly acmeEndpointArn: string;
  public abstract readonly endpointUrl: string;

  public get acmeEndpointRef(): AcmeEndpointReference {
    return { acmeEndpointArn: this.acmeEndpointArn };
  }

  public get metrics(): AcmeEndpointMetrics {
    return AcmeEndpointMetrics.fromAcmeEndpoint(this);
  }

  @MethodMetadata()
  public addDomainValidation(id: string, options: AcmeDomainValidationOptions): IAcmeDomainValidation {
    return new AcmeDomainValidation(this, id, { ...options, endpoint: this });
  }

  @MethodMetadata()
  public addExternalAccountBinding(id: string, options: AcmeExternalAccountBindingOptions = {}): AcmeExternalAccountBinding {
    return new AcmeExternalAccountBinding(this, id, { ...options, endpoint: this });
  }
}

/**
 * An ACME endpoint in AWS Certificate Manager
 *
 * ACME clients such as Certbot or cert-manager use the endpoint URL to request
 * certificates through the ACME protocol (RFC 8555). The private key is generated
 * and kept by the ACME client, so certificates issued through an ACME endpoint
 * cannot be used with services integrated with ACM such as Elastic Load Balancing,
 * CloudFront or API Gateway.
 *
 * @resource AWS::CertificateManager::AcmeEndpoint
 * @see https://docs.aws.amazon.com/acm/latest/userguide/acm-acme.html
 */
@propertyInjectable
export class AcmeEndpoint extends AcmeEndpointBase {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-certificatemanager.AcmeEndpoint';

  /**
   * Import an existing ACME endpoint by its ARN.
   *
   * The endpoint URL is not available on the returned object.
   * Use `fromAcmeEndpointAttributes()` if you need it.
   */
  public static fromAcmeEndpointArn(scope: Construct, id: string, acmeEndpointArn: string): IAcmeEndpoint {
    return AcmeEndpoint.fromAcmeEndpointAttributes(scope, id, { acmeEndpointArn });
  }

  /**
   * Import an existing ACME endpoint from its attributes.
   */
  public static fromAcmeEndpointAttributes(scope: Construct, id: string, attrs: AcmeEndpointAttributes): IAcmeEndpoint {
    class Import extends AcmeEndpointBase {
      public readonly acmeEndpointArn = attrs.acmeEndpointArn;

      public get endpointUrl(): string {
        if (attrs.endpointUrl === undefined) {
          throw new ValidationError(lit`AcmeEndpointUrlNotImported`, 'the endpoint URL is not available on an ACME endpoint imported by ARN, use AcmeEndpoint.fromAcmeEndpointAttributes() and pass \'endpointUrl\'', this);
        }
        return attrs.endpointUrl;
      }
    }

    return new Import(scope, id, { environmentFromArn: attrs.acmeEndpointArn });
  }

  /**
   * The ARN of the ACME endpoint.
   *
   * @attribute
   */
  public readonly acmeEndpointArn: string;

  /**
   * The ACME directory URL of the endpoint.
   *
   * @attribute
   */
  public readonly endpointUrl: string;

  constructor(scope: Construct, id: string, props: AcmeEndpointProps = {}) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const certificateAuthority = props.certificateAuthority ?? AcmeCertificateAuthority.public();
    const authorizationBehavior = props.authorizationBehavior ?? AcmeAuthorizationBehavior.PRE_APPROVED;

    let contact: string | undefined;
    if (props.contactRequired !== undefined) {
      contact = props.contactRequired ? 'REQUIRED' : 'NOT_REQUIRED';
    }

    const resource = new CfnAcmeEndpoint(this, 'Resource', {
      authorizationBehavior: authorizationBehavior.value,
      certificateAuthority: certificateAuthority._render(),
      contact,
      certificateTags: renderTags(props.certificateTags),
      tags: renderTags(props.tags),
    });

    this.acmeEndpointArn = resource.attrAcmeEndpointArn;
    this.endpointUrl = resource.attrEndpointUrl;
  }
}

/**
 * CloudWatch metrics for an ACME endpoint
 */
export class AcmeEndpointMetrics {
  /**
   * Create metrics for the given ACME endpoint.
   */
  public static fromAcmeEndpoint(endpoint: IAcmeEndpointRef): AcmeEndpointMetrics {
    return new AcmeEndpointMetrics(endpoint);
  }

  private constructor(private readonly endpoint: IAcmeEndpointRef) {}

  /**
   * Return the given named metric for this ACME endpoint.
   *
   * The metric always uses the `AcmeEndpointArn` dimension of this endpoint,
   * a `dimensionsMap` in `props` is ignored.
   *
   * @default - sum over 5 minutes
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/CertificateManager',
      metricName,
      statistic: cloudwatch.Stats.SUM,
      period: Duration.minutes(5),
      ...props,
      dimensionsMap: { AcmeEndpointArn: this.endpoint.acmeEndpointRef.acmeEndpointArn },
    });
  }

  /**
   * The number of certificates successfully issued through this endpoint.
   *
   * @default - sum over 5 minutes
   */
  public metricCertificateIssuanceSuccess(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('CertificateIssuanceSuccess', props);
  }

  /**
   * The number of failed certificate issuance attempts through this endpoint.
   *
   * @default - sum over 5 minutes
   */
  public metricCertificateIssuanceFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('CertificateIssuanceFailed', props);
  }
}

function renderTags(tags?: { [key: string]: string }): Array<{ key: string; value: string }> | undefined {
  const entries = Object.entries(tags ?? {});
  return entries.length > 0 ? entries.map(([key, value]) => ({ key, value })) : undefined;
}
