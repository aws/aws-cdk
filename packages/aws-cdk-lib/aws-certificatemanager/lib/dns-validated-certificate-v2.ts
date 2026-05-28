import type { Construct } from 'constructs';
import type { CertificateProps, ICertificate } from './certificate';
import { Certificate, CertificateValidation } from './certificate';
import { CertificateBase } from './certificate-base';
import * as route53 from '../../aws-route53';
import * as cdk from '../../core';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Properties to create a DNS validated certificate managed by AWS Certificate Manager.
 */
export interface DnsValidatedCertificateV2Props extends CertificateProps {
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
}

/**
 * A DNS validated certificate in a specific region.
 *
 * The certificate is created with the native `AWS::CertificateManager::Certificate`
 * resource. When the requested certificate region differs from the containing
 * stack region, this construct creates the certificate in a support stack and
 * exposes the certificate ARN through `Fn::GetStackOutput`.
 *
 * @resource AWS::CertificateManager::Certificate
 */
@propertyInjectable
export class DnsValidatedCertificateV2 extends CertificateBase implements ICertificate {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-certificatemanager.DnsValidatedCertificateV2';

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
  private readonly normalizedZoneName?: string;

  constructor(scope: Construct, id: string, props: DnsValidatedCertificateV2Props) {
    super(scope, id);
    addConstructMetadata(this, props);

    if (props.validation) {
      cdk.Annotations.of(this).addWarningV2(
        '@aws-cdk/aws-certificatemanager:dnsValidatedCertificateV2ValidationIgnored',
        'The validation property is ignored by DnsValidatedCertificateV2. Use the hostedZone property for DNS validation.',
      );
    }

    this.certificateDomainName = props.domainName;
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
    const certificateScope = createInContainingStack
      ? this
      : this.certificateStack(props.stackId);
    const certificateHostedZone = this.hostedZoneForCertificate(certificateScope, props.hostedZone, !createInContainingStack);

    const certificateProps = certificatePropsForDnsValidation(this, props, certificateHostedZone);
    this.certificate = new Certificate(certificateScope, createInContainingStack ? 'Certificate' : cdk.Names.uniqueId(this), certificateProps);

    if (createInContainingStack) {
      this.certificateArn = this.certificate.certificateArn;
    } else {
      const certificateStack = cdk.Stack.of(this.certificate);
      const output = new cdk.CfnOutput(certificateStack, `${this.certificate.node.id}Arn`, {
        value: this.certificate.certificateArn,
      });
      containingStack.addDependency(certificateStack, `${containingStack.node.path} -> ${this.node.path}.certificateArn`);
      this.certificateArn = cdk.Fn.getStackOutput(certificateStack.stackName, output.logicalId, this.certificateRegion);
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
          `A construct named '${certificateStackId}' already exists and is not a Stack`,
          this,
        );
      }
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
    if (this.normalizedZoneName &&
      !cdk.Token.isUnresolved(this.normalizedZoneName) &&
      !cdk.Token.isUnresolved(this.certificateDomainName) &&
      this.certificateDomainName !== this.normalizedZoneName &&
      !this.certificateDomainName.endsWith('.' + this.normalizedZoneName)) {
      errors.push(`DNS zone ${this.normalizedZoneName} is not authoritative for certificate domain name ${this.certificateDomainName}`);
    }
    return errors;
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
    validation: _validation,
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
    return undefined;
  }
}
