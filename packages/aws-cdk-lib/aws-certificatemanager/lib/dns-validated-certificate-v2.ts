import type { Construct } from 'constructs';
import type { CertificateProps, ICertificate, KeyAlgorithm } from './certificate';
import { Certificate, CertificateValidation } from './certificate';
import { CertificateBase } from './certificate-base';
import * as route53 from '../../aws-route53';
import * as cdk from '../../core';
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
  readonly hostedZone: route53.IHostedZone;

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
  readonly removalPolicy?: cdk.RemovalPolicy;
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

    if (cdk.Token.isUnresolved(this.certificateRegion)) {
      throw new cdk.ValidationError(
        lit`DnsValidatedCertificateV2RegionMustBeConcrete`,
        'DnsValidatedCertificateV2 region must be a concrete region',
        this,
      );
    }

    const containingStack = cdk.Stack.of(this);
    const createInContainingStack = !cdk.Token.isUnresolved(containingStack.region) && containingStack.region === this.certificateRegion;
    if (!createInContainingStack) {
      this.validateCrossPartitionReference(containingStack);
    }

    const certificateScope = createInContainingStack
      ? this
      : this.certificateStack(props.stackId);
    const certificateHostedZone = this.hostedZoneForCertificate(certificateScope, props.hostedZone, !createInContainingStack);

    const certificateProps = certificatePropsForDnsValidation(this, props, certificateHostedZone);
    this.certificate = new Certificate(certificateScope, createInContainingStack ? 'Certificate' : cdk.Names.uniqueId(this), certificateProps);
    if (props.removalPolicy !== undefined) {
      this.certificate.applyRemovalPolicy(props.removalPolicy);
    }

    if (createInContainingStack) {
      this.certificateArn = this.certificate.certificateArn;
    } else {
      const weakCertificateArn = cdk.Stack.consumeReference(this.certificate.certificateArn, cdk.ReferenceStrength.WEAK);
      this.certificateArn = cdk.Fn.join('', [weakCertificateArn, '']);
    }

    this.node.addValidation({ validate: () => this.validateDnsValidatedCertificate() });
  }

  @MethodMetadata()
  public applyRemovalPolicy(policy: cdk.RemovalPolicy): void {
    this.certificate.applyRemovalPolicy(policy);
  }

  private certificateStack(stackId?: string): cdk.Stack {
    const stage = cdk.Stage.of(this);
    if (!stage) {
      throw new cdk.ValidationError(
        lit`DnsValidatedCertificateV2RequiresStage`,
        'DnsValidatedCertificateV2 must be defined in a CDK app or stage',
        this,
      );
    }

    const containingStack = cdk.Stack.of(this);
    const certificateStackId = stackId ?? `dns-validated-certificate-stack-${containingStack.node.addr}-${this.certificateRegion}`;
    const existing = stage.node.tryFindChild(certificateStackId);
    if (existing) {
      if (!cdk.Stack.isStack(existing)) {
        throw new cdk.ValidationError(
          lit`DnsValidatedCertificateV2StackIdConflict`,
          `a construct named ${JSON.stringify(certificateStackId)} already exists and is not a Stack`,
          this,
        );
      }
      this.validateCertificateStack(existing, certificateStackId);
      return existing;
    }

    return new cdk.Stack(stage, certificateStackId, {
      env: {
        account: containingStack.account,
        region: this.certificateRegion,
      },
      tags: containingStack.tags.tagValues(),
    });
  }

  private hostedZoneForCertificate(scope: Construct, hostedZone: route53.IHostedZone, isCrossRegion: boolean): route53.IHostedZone {
    let hostedZoneId = hostedZone.hostedZoneId;

    if (cdk.Token.isUnresolved(hostedZoneId)) {
      if (isCrossRegion) {
        throw new cdk.ValidationError(
          lit`DnsValidatedCertificateV2CrossRegionHostedZoneIdMustBeConcrete`,
          'Cross-region DnsValidatedCertificateV2 requires a concrete hostedZoneId. Use HostedZone.fromLookup() or HostedZone.fromHostedZoneId().',
          this,
        );
      }
    } else {
      hostedZoneId = hostedZoneId.replace(/^\/hostedzone\//, '');
    }

    return route53.HostedZone.fromHostedZoneId(
      scope,
      `HostedZone${cdk.Names.uniqueId(this)}`,
      hostedZoneId,
    );
  }

  private validateDnsValidatedCertificate(): string[] {
    const errors: string[] = [];
    const domainNames = [this.certificateDomainName];
    if (this.subjectAlternativeNames !== undefined && !cdk.Token.isUnresolved(this.subjectAlternativeNames)) {
      domainNames.push(...this.subjectAlternativeNames);
    }

    for (const domainName of domainNames) {
      if (this.normalizedZoneName &&
        !cdk.Token.isUnresolved(this.normalizedZoneName) &&
        !cdk.Token.isUnresolved(domainName) &&
        !isDomainNameInZone(domainName, this.normalizedZoneName)) {
        errors.push(`DNS zone ${this.normalizedZoneName} is not authoritative for certificate domain name ${domainName}`);
      }
    }
    return errors;
  }

  private validateCertificateStack(stack: cdk.Stack, stackId: string) {
    if (cdk.Token.isUnresolved(stack.region) || stack.region !== this.certificateRegion) {
      throw new cdk.ValidationError(
        lit`DnsValidatedCertificateV2StackRegionMismatch`,
        `stack ${JSON.stringify(stackId)} must be in region ${JSON.stringify(this.certificateRegion)}, got ${JSON.stringify(stack.region)}`,
        this,
      );
    }

    const containingStack = cdk.Stack.of(this);
    if (!cdk.Token.isUnresolved(containingStack.account) &&
      !cdk.Token.isUnresolved(stack.account) &&
      containingStack.account !== stack.account) {
      throw new cdk.ValidationError(
        lit`DnsValidatedCertificateV2StackAccountMismatch`,
        `stack ${JSON.stringify(stackId)} must be in account ${JSON.stringify(containingStack.account)}, got ${JSON.stringify(stack.account)}`,
        this,
      );
    }
  }

  private validateCrossPartitionReference(containingStack: cdk.Stack) {
    if (cdk.Token.isUnresolved(containingStack.region)) {
      return;
    }

    const containingPartition = RegionInfo.get(containingStack.region).partition;
    const certificatePartition = RegionInfo.get(this.certificateRegion).partition;
    if (containingPartition !== undefined &&
      certificatePartition !== undefined &&
      containingPartition !== certificatePartition) {
      throw new cdk.ValidationError(
        lit`DnsValidatedCertificateV2CrossPartitionUnsupported`,
        `DnsValidatedCertificateV2 does not support cross-partition references. The containing stack is in partition ${JSON.stringify(containingPartition)} and the certificate region ${JSON.stringify(this.certificateRegion)} is in partition ${JSON.stringify(certificatePartition)}`,
        this,
      );
    }
  }
}

function certificatePropsForDnsValidation(
  scope: Construct,
  props: DnsValidatedCertificateV2Props,
  hostedZone: route53.IHostedZone,
): CertificateProps {
  const {
    hostedZone: _hostedZone,
    region: _region,
    stackId: _stackId,
    removalPolicy: _removalPolicy,
    certificateName,
    ...certificateProps
  } = props;

  return {
    ...certificateProps,
    certificateName: certificateName ?? scope.node.path.slice(0, 255),
    validation: CertificateValidation.fromDns(hostedZone),
  };
}

function normalizeZoneName(hostedZone: route53.IHostedZone): string | undefined {
  try {
    const zoneName = hostedZone.zoneName;
    if (cdk.Token.isUnresolved(zoneName)) {
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
