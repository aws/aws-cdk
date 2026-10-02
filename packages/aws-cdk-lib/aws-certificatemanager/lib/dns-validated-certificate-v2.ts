import type { Construct } from 'constructs';
import type { CertificateProps, ICertificate, KeyAlgorithm } from './certificate';
import { Certificate, CertificateValidation } from './certificate';
import { CertificateBase } from './certificate-base';
import { CfnCertificate } from './certificatemanager.generated';
import type { IHostedZone } from '../../aws-route53';
import { HostedZone } from '../../aws-route53';
import type { RemovalPolicy } from '../../core';
import { Fn, Names, ReferenceStrength, Stack, Stage, Token, ValidationError } from '../../core';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import { RegionInfo } from '../../region-info';

const DNS_VALIDATED_CERTIFICATE_V2_SYMBOL = Symbol.for('@aws-cdk/aws-certificatemanager.DnsValidatedCertificateV2');

/**
 * Properties to create a DNS validated certificate managed by AWS Certificate Manager.
 */
export interface DnsValidatedCertificateV2Props {
  /**
   * Fully-qualified domain name to request a certificate for.
   *
   * May contain wildcards, such as ``*.domain.com``.
   */
  readonly domainName: string;

  /**
   * Route 53 Hosted Zone used to perform DNS validation of the request.
   *
   * For cross-region certificates, the hosted zone ID must be concrete. Use
   * `HostedZone.fromLookup()` or `HostedZone.fromHostedZoneId()` when the hosted
   * zone is not created in the same support stack as the certificate.
   *
   * [disable-awslint:prefer-ref-interface]
   */
  readonly hostedZone: IHostedZone;

  /**
   * Alternative domain names on your certificate.
   *
   * Use this to register alternative domain names that represent the same site.
   *
   * @default - No additional FQDNs will be included as alternative domain names.
   */
  readonly subjectAlternativeNames?: string[];

  /**
   * Enable or disable export of this certificate.
   *
   * If you issue an exportable public certificate, there is a charge at certificate issuance and again when the certificate renews.
   * Ref: https://aws.amazon.com/certificate-manager/pricing
   *
   * @default false
   */
  readonly allowExport?: boolean;

  /**
   * Enable or disable transparency logging for this certificate.
   *
   * Once a certificate has been logged, it cannot be removed from the log.
   * Opting out at that point will have no effect. If you opt out of logging
   * when you request a certificate and then choose later to opt back in,
   * your certificate will not be logged until it is renewed.
   * If you want the certificate to be logged immediately, we recommend that you issue a new one.
   *
   * @see https://docs.aws.amazon.com/acm/latest/userguide/acm-bestpractices.html#best-practices-transparency
   *
   * @default true
   */
  readonly transparencyLoggingEnabled?: boolean;

  /**
   * The certificate name.
   *
   * Since the certificate resource doesn't support providing a physical name, the value provided here will be recorded in the `Name` tag.
   *
   * @default the full, absolute path of this construct
   */
  readonly certificateName?: string;

  /**
   * Specifies the algorithm of the public and private key pair that your certificate uses to encrypt data.
   *
   * @see https://docs.aws.amazon.com/acm/latest/userguide/acm-certificate.html#algorithms.title
   *
   * @default KeyAlgorithm.RSA_2048
   */
  readonly keyAlgorithm?: KeyAlgorithm;

  /**
   * Tags to apply to the certificate.
   *
   * These tags are applied to the certificate even when it is created in a
   * generated support stack.
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };

  /**
   * AWS region that will host the certificate.
   *
   * @default us-east-1
   */
  readonly region?: string;

  /**
   * The stack ID of the stack that contains the certificate.
   *
   * @default - `dns-validated-certificate-stack-${stack.node.addr}-${region}`
   */
  readonly stackId?: string;

  /**
   * Policy to apply when the certificate is removed from this stack.
   *
   * @default RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * A DNS validated certificate in a specific region.
 *
 * The certificate is created with the native `AWS::CertificateManager::Certificate`
 * resource. When the requested certificate region differs from the containing
 * stack region, this construct creates the certificate in a support stack and
 * exposes the certificate ARN through a weak cross-stack reference.
 *
 * @resource AWS::CertificateManager::Certificate
 * @stateful
 */
@propertyInjectable
export class DnsValidatedCertificateV2 extends CertificateBase implements ICertificate {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-certificatemanager.DnsValidatedCertificateV2';

  /**
   * Return whether the indicated object is a DnsValidatedCertificateV2.
   */
  public static isDnsValidatedCertificateV2(x: any): x is DnsValidatedCertificateV2 {
    return x !== null && typeof x === 'object' && DNS_VALIDATED_CERTIFICATE_V2_SYMBOL in x;
  }

  private static readonly DEFAULT_REGION = 'us-east-1';

  /**
   * The certificate's ARN.
   */
  public readonly certificateArn: string;

  /**
   * The region where the certificate is provisioned.
   *
   * @attribute
   */
  public readonly certificateRegion: string;

  protected readonly region?: string;
  private readonly certificate: Certificate;
  private readonly certificateDomainName: string;
  private readonly subjectAlternativeNames?: string[];
  private readonly normalizedZoneName?: string;

  constructor(scope: Construct, id: string, props: DnsValidatedCertificateV2Props) {
    super(scope, id);
    Object.defineProperty(this, DNS_VALIDATED_CERTIFICATE_V2_SYMBOL, { value: true });
    addConstructMetadata(this, props);

    this.certificateDomainName = props.domainName;
    this.subjectAlternativeNames = props.subjectAlternativeNames;
    this.normalizedZoneName = normalizeZoneName(props.hostedZone);
    this.certificateRegion = props.region ?? DnsValidatedCertificateV2.DEFAULT_REGION;
    this.region = this.certificateRegion;

    if (Token.isUnresolved(this.certificateRegion)) {
      throw new ValidationError(
        lit`DnsValidatedCertificateV2RegionMustBeConcrete`,
        'region must be concrete, got an unresolved token',
        this,
      );
    }

    const containingStack = Stack.of(this);
    const createInContainingStack = !Token.isUnresolved(containingStack.region) && containingStack.region === this.certificateRegion;
    if (!createInContainingStack) {
      this.validateCrossPartitionReference(containingStack);
    }

    const certificateScope = createInContainingStack
      ? this
      : this.certificateStack(props.stackId);
    const certificateHostedZone = this.hostedZoneForCertificate(certificateScope, props.hostedZone, !createInContainingStack);

    const certificateProps = certificatePropsForDnsValidation(this, props, certificateHostedZone);
    this.certificate = new Certificate(certificateScope, createInContainingStack ? 'Certificate' : Names.uniqueId(this), certificateProps);
    this.applyTags(props);
    if (props.removalPolicy !== undefined) {
      this.certificate.applyRemovalPolicy(props.removalPolicy);
    }

    if (createInContainingStack) {
      this.certificateArn = this.certificate.certificateArn;
    } else {
      const weakCertificateArn = Stack.consumeReference(this.certificate.certificateArn, ReferenceStrength.WEAK);
      this.certificateArn = Fn.join('', [weakCertificateArn, '']);
    }

    this.node.addValidation({ validate: () => this.validateDnsValidatedCertificate() });
  }

  @MethodMetadata()
  public applyRemovalPolicy(policy: RemovalPolicy): void {
    this.certificate.applyRemovalPolicy(policy);
  }

  private applyTags(props: DnsValidatedCertificateV2Props): void {
    const tags = Object.entries(props.tags ?? {});
    if (tags.length === 0) {
      return;
    }

    const certificateResource = this.certificate.node.defaultChild;
    if (!CfnCertificate.isCfnCertificate(certificateResource)) {
      throw new ValidationError(
        lit`DnsValidatedCertificateV2MissingCertificateResource`,
        'certificate construct does not have an AWS::CertificateManager::Certificate default child resource',
        this,
      );
    }

    for (const [key, value] of tags) {
      if (key === 'Name' && props.certificateName !== undefined) {
        continue;
      }
      certificateResource.tags.setTag(key, value, 101);
    }
  }

  private certificateStack(stackId?: string): Stack {
    const stage = Stage.of(this);
    if (!stage) {
      throw new ValidationError(
        lit`DnsValidatedCertificateV2RequiresStage`,
        'dns validated certificate v2 must be defined in a CDK app or stage',
        this,
      );
    }

    const containingStack = Stack.of(this);
    const certificateStackId = stackId ?? `dns-validated-certificate-stack-${containingStack.node.addr}-${this.certificateRegion}`;
    const existing = stage.node.tryFindChild(certificateStackId);
    if (existing) {
      if (!Stack.isStack(existing)) {
        throw new ValidationError(
          lit`DnsValidatedCertificateV2StackIdConflict`,
          `a construct named ${JSON.stringify(certificateStackId)} already exists and is not a stack`,
          this,
        );
      }
      this.validateCertificateStack(existing, certificateStackId);
      return existing;
    }

    return new Stack(stage, certificateStackId, {
      env: {
        account: containingStack.account,
        region: this.certificateRegion,
      },
      tags: containingStack.tags.tagValues(),
    });
  }

  private hostedZoneForCertificate(scope: Construct, hostedZone: IHostedZone, isCrossRegion: boolean): IHostedZone {
    let hostedZoneId = hostedZone.hostedZoneId;

    if (Token.isUnresolved(hostedZoneId)) {
      if (isCrossRegion) {
        throw new ValidationError(
          lit`DnsValidatedCertificateV2CrossRegionHostedZoneIdMustBeConcrete`,
          'cross-region certificates require a concrete hostedZoneId; use HostedZone.fromLookup() or HostedZone.fromHostedZoneId()',
          this,
        );
      }
    } else {
      hostedZoneId = hostedZoneId.replace(/^\/hostedzone\//, '');
    }

    return HostedZone.fromHostedZoneId(
      scope,
      `HostedZone${Names.uniqueId(this)}`,
      hostedZoneId,
    );
  }

  private validateDnsValidatedCertificate(): string[] {
    const errors: string[] = [];
    const domainNames = [this.certificateDomainName];
    if (this.subjectAlternativeNames !== undefined && !Token.isUnresolved(this.subjectAlternativeNames)) {
      domainNames.push(...this.subjectAlternativeNames);
    }

    for (const domainName of domainNames) {
      if (this.normalizedZoneName &&
        !Token.isUnresolved(this.normalizedZoneName) &&
        !Token.isUnresolved(domainName) &&
        !isDomainNameInZone(domainName, this.normalizedZoneName)) {
        errors.push(`DNS zone ${this.normalizedZoneName} is not authoritative for certificate domain name ${domainName}`);
      }
    }
    return errors;
  }

  private validateCertificateStack(stack: Stack, stackId: string) {
    if (Token.isUnresolved(stack.region) || stack.region !== this.certificateRegion) {
      throw new ValidationError(
        lit`DnsValidatedCertificateV2StackRegionMismatch`,
        `stack ${JSON.stringify(stackId)} must be in region ${JSON.stringify(this.certificateRegion)}, got ${JSON.stringify(stack.region)}`,
        this,
      );
    }

    const containingStack = Stack.of(this);
    if (!Token.isUnresolved(containingStack.account) &&
      !Token.isUnresolved(stack.account) &&
      containingStack.account !== stack.account) {
      throw new ValidationError(
        lit`DnsValidatedCertificateV2StackAccountMismatch`,
        `stack ${JSON.stringify(stackId)} must be in account ${JSON.stringify(containingStack.account)}, got ${JSON.stringify(stack.account)}`,
        this,
      );
    }
  }

  private validateCrossPartitionReference(containingStack: Stack) {
    if (Token.isUnresolved(containingStack.region)) {
      return;
    }

    const containingPartition = RegionInfo.get(containingStack.region).partition;
    const certificatePartition = RegionInfo.get(this.certificateRegion).partition;
    if (containingPartition !== undefined &&
      certificatePartition !== undefined &&
      containingPartition !== certificatePartition) {
      throw new ValidationError(
        lit`DnsValidatedCertificateV2CrossPartitionUnsupported`,
        `cross-partition references are not supported; the containing stack is in partition ${JSON.stringify(containingPartition)} and the certificate region ${JSON.stringify(this.certificateRegion)} is in partition ${JSON.stringify(certificatePartition)}`,
        this,
      );
    }
  }
}

function certificatePropsForDnsValidation(
  scope: Construct,
  props: DnsValidatedCertificateV2Props,
  hostedZone: IHostedZone,
): CertificateProps {
  const {
    hostedZone: _hostedZone,
    region: _region,
    stackId: _stackId,
    removalPolicy: _removalPolicy,
    tags: _tags,
    certificateName,
    ...certificateProps
  } = props;

  return {
    ...certificateProps,
    certificateName: certificateName ?? scope.node.path.slice(0, 255),
    validation: CertificateValidation.fromDns(hostedZone),
  };
}

function normalizeZoneName(hostedZone: IHostedZone): string | undefined {
  try {
    const zoneName = hostedZone.zoneName;
    if (Token.isUnresolved(zoneName)) {
      return zoneName;
    }
    return zoneName.endsWith('.') ? zoneName.substring(0, zoneName.length - 1) : zoneName;
  } catch {
    // ID-only hosted zone imports intentionally do not expose zoneName.
    return undefined;
  }
}

function isDomainNameInZone(domainName: string, zoneName: string): boolean {
  const normalizedDomainName = normalizeDnsNameForComparison(domainName);
  const normalizedZoneName = normalizeDnsNameForComparison(zoneName);
  return normalizedDomainName === normalizedZoneName || normalizedDomainName.endsWith('.' + normalizedZoneName);
}

function normalizeDnsNameForComparison(name: string): string {
  const lowerCaseName = name.toLowerCase();
  return lowerCaseName.endsWith('.') ? lowerCaseName.substring(0, lowerCaseName.length - 1) : lowerCaseName;
}
