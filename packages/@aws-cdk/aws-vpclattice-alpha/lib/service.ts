import { CfnService } from 'aws-cdk-lib/aws-vpclattice/lib/vpclattice.generated';
import { Resource, IResource, ValidationError, ArnFormat, Stack } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { PolicyDocument } from 'aws-cdk-lib/aws-iam';

/**
 * Authentication types for VPC Lattice services
 */
export enum ServiceAuthType {
  /**
   * No authentication
   */
  NONE = 'NONE',

  /**
   * AWS IAM authentication
   */
  AWS_IAM = 'AWS_IAM',
}

/**
 * DNS entry information for a VPC Lattice service
 */
export interface DnsEntry {
  /**
   * The domain name of the DNS entry
   *
   * @default - No domain name
   */
  readonly domainName?: string;

  /**
   * The hosted zone ID of the DNS entry
   *
   * @default - No hosted zone ID
   */
  readonly hostedZoneId?: string;
}

/**
 * Properties for creating a VPC Lattice service
 */
export interface ServiceProps {
  /**
   * The name of the VPC Lattice service
   */
  readonly serviceName: string;

  /**
   * The authentication type for the service
   *
   * @default ServiceAuthType.NONE
   */
  readonly authType: ServiceAuthType;

  /**
   * The authentication policy for the service
   * Required when authType is AWS_IAM
   *
   * @default - No policy
   */
  readonly authPolicy: PolicyDocument;

  /**
   * The certificate to use for the service
   * Required for HTTPS listeners
   *
   * @default - No certificate
   */
  readonly certificate?: ICertificate;

  /**
   * The custom domain name for the service
   * Required for TLS listeners
   *
   * @default - No custom domain name
   */
  readonly customDomainName?: string;

  /**
   * The DNS entry for the service
   *
   * @default - No DNS entry
   */
  readonly dnsEntry?: DnsEntry;
}

/**
 * Interface representing a VPC Lattice service
 */
export interface IService extends IResource {
  /**
   * The VPC lattice service ARN
   *
   * @attribute
   * @returns a token representing the service ARN
   */
  readonly serviceArn: string;

  /**
   * The VPC lattice service ID
   *
   * @attribute
   * @returns a token representing the service ID
   */
  readonly serviceId: string;

  /**
   * The DNS entry for the VPC lattice service
   */
  readonly dnsEntry?: DnsEntry;
}

/**
 * Base class for VPC Lattice services
 */
abstract class ServiceBase extends Resource implements IService {
  /**
   * The VPC lattice service ARN
   */
  public abstract readonly serviceArn: string;

  /**
   * The VPC lattice service ID
   */
  public abstract readonly serviceId: string;

  /**
   * The DNS entry for the VPC lattice service
   */
  public readonly dnsEntry?: DnsEntry;
}

/**
 * Attributes for importing an existing VPC Lattice service
 */
export interface ServiceAttributes {
  /**
   * The VPC lattice service ARN
   */
  readonly serviceArn: string;

  /**
   * The VPC lattice service ID
   */
  // TODO: restore ID? Constructing the ARN from the ID will need accountId, region, etc
  // readonly serviceId: string;
}

/**
 * A VPC Lattice service
 */
export class Service extends ServiceBase {
  /**
   * Import an existing VPC Lattice service into this CDK application.
   *
   * @param scope the parent creating construct (usually `this`)
   * @param id the construct's name // TODO
   * @param attrs attributes of the service
   * @returns An object representing the imported VPC Lattice service.
   */
  public static fromServiceAttributes(scope: Construct, id: string, attrs: ServiceAttributes): IService {
    class UnownedServiceReference extends ServiceBase {
      public readonly serviceArn: string = attrs.serviceArn;
      // Extract the serviceId from the ARN, which has the format `arn:aws:vpc-lattice:<region>:<account>:service/<service-id>`
      public readonly serviceId: string = Stack.of(scope).splitArn(attrs.serviceArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
    }
    return new UnownedServiceReference(scope, id);
  }

  /**
   * The ARN of the VPC Lattice service
   * @attribute
   * @returns a token representing the service ARN
   */
  public readonly serviceArn: string;

  /**
   * The ID of the VPC Lattice service
   * @attribute
   * @returns a token representing the service ID
   */
  public readonly serviceId: string;

  /**
   * The DNS entry for the VPC Lattice service
   */
  public readonly dnsEntry?: DnsEntry;

  /**
   * Creates a new VPC Lattice service
   *
   * @param scope The parent construct
   * @param id The construct ID
   * @param props The service properties
   */
  constructor(scope: Construct, id: string, props: ServiceProps) {
    super(scope, id);

    if (props.authType === ServiceAuthType.AWS_IAM && props.authPolicy === undefined) {
      throw new ValidationError('An auth policy must be provided when the authType is `AWS_IAM`', this);
    }
    // TODO: Do something with the auth policy

    // TODO Validation: Cert must be provided for HTTPS listeners
    // TODO Validation: A custom domain name must be provided for TLS listeners

    const resource = new CfnService(this, id, {
      name: props.serviceName,
      authType: props.authType,
      certificateArn: props.certificate?.certificateArn,
      customDomainName: props.customDomainName,
      dnsEntry: props.dnsEntry,
    });

    this.serviceArn = resource.attrArn;
    this.serviceId = resource.attrId;
  }
}
