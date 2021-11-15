import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { IBucket } from '@aws-cdk/aws-s3';
import { IResource, Lazy, Resource, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDomainName, CfnDomainNameProps } from '../apigatewayv2.generated';

/**
 * The minimum version of the SSL protocol that you want API Gateway to use for HTTPS connections.
 */
export enum SecurityPolicy {
  /** Cipher suite TLS 1.0 */
  TLS_1_0 = 'TLS_1_0',

  /** Cipher suite TLS 1.2 */
  TLS_1_2 = 'TLS_1_2',
}

/**
 * Endpoint type for a domain name.
 */
export enum EndpointType {
  /**
   * For an edge-optimized custom domain name.
   */
  EDGE = 'EDGE',
  /**
   * For a regional custom domain name.
   */
  REGIONAL = 'REGIONAL',
}

/**
 * Represents an APIGatewayV2 DomainName
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html
 */
export interface IDomainName extends IResource {
  /**
   * The custom domain name
   * @attribute
   */
  readonly name: string;

  /**
   * The domain name associated with the regional endpoint for this custom domain name.
   * @attribute
   */
  readonly regionalDomainName: string;

  /**
   * The region-specific Amazon Route 53 Hosted Zone ID of the regional endpoint.
   * @attribute
   */
  readonly regionalHostedZoneId: string;
}

/**
 * custom domain name attributes
 */
export interface DomainNameAttributes {
  /**
   * domain name string
   */
  readonly name: string;

  /**
   * The domain name associated with the regional endpoint for this custom domain name.
   */
  readonly regionalDomainName: string;

  /**
   * The region-specific Amazon Route 53 Hosted Zone ID of the regional endpoint.
   */
  readonly regionalHostedZoneId: string;
}

/**
 * properties used for creating the DomainName
 */
export interface DomainNameProps {
  /**
   * The custom domain name
   */
  readonly domainName: string;
  /**
   * The ACM certificate for this domain name.
   * Certificate can be both ACM issued or imported.
   */
  readonly certificate: ICertificate;
  /**
   * The mutual TLS authentication configuration for a custom domain name.
   * @default - mTLS is not configured.
   */
  readonly mtls?: MTLSConfig;
  /**
   * The user-friendly name of the certificate that will be used by the endpoint for this domain name.
   * This property is optional and is helpful if you have too many certificates and it is easier to remember
   * certificates by some name rather that the domain they are valid for.
   * @default - No friendly certificate name
   */
  readonly certificateName?: string;

  /**
   * The type of endpoint for this DomainName.
   * @default EndpointType.REGIONAL
   */
  readonly endpointType?: EndpointType;

  /**
   * The Transport Layer Security (TLS) version + cipher suite for this domain name.
   * @default SecurityPolicy.TLS_1_2
   */
  readonly securityPolicy?: SecurityPolicy;

  /**
   * A public certificate issued by ACM to validate that you own a custom domain. This parameter is required
   * only when you configure mutual TLS authentication and you specify an ACM imported or private CA certificate
   * for `certificate`. The ownership verification certificate validates that you have permissions to use the domain name.
   * @default - only required when configuring mTLS
   */
  readonly ownershipVerificationCertificate?: ICertificate;
}

/**
 * The mTLS authentication configuration for a custom domain name.
 */
export interface MTLSConfig {
  /**
   * The bucket that the trust store is hosted in.
   */
  readonly bucket: IBucket;
  /**
   * The key in S3 to look at for the trust store
   */
  readonly key: string;

  /**
   *  The version of the S3 object that contains your truststore.
   *  To specify a version, you must have versioning enabled for the S3 bucket.
   *  @default - latest version
   */
  readonly version?: string;
}

/**
 * Custom domain resource for the API
 */
export class DomainName extends Resource implements IDomainName {
  /**
   * Import from attributes
   */
  public static fromDomainNameAttributes(scope: Construct, id: string, attrs: DomainNameAttributes): IDomainName {
    class Import extends Resource implements IDomainName {
      public readonly regionalDomainName = attrs.regionalDomainName;
      public readonly regionalHostedZoneId = attrs.regionalHostedZoneId;
      public readonly name = attrs.name;
    }
    return new Import(scope, id);
  }

  public readonly name: string;
  public readonly regionalDomainName: string;
  public readonly regionalHostedZoneId: string;
  private readonly domainNameConfigurations: CfnDomainName.DomainNameConfigurationProperty[] = [];

  constructor(scope: Construct, id: string, props: DomainNameProps) {
    super(scope, id);

    if (props.domainName === '') {
      throw new Error('empty string for domainName not allowed');
    }

    const mtlsConfig = this.configureMTLS(props.mtls);
    const domainNameProps: CfnDomainNameProps = {
      domainName: props.domainName,
      domainNameConfigurations: Lazy.any({ produce: () => this.domainNameConfigurations }),
      mutualTlsAuthentication: mtlsConfig,
    };
    const resource = new CfnDomainName(this, 'Resource', domainNameProps);
    this.name = resource.ref;
    this.regionalDomainName = Token.asString(resource.getAtt('RegionalDomainName'));
    this.regionalHostedZoneId = Token.asString(resource.getAtt('RegionalHostedZoneId'));

    if (props.certificate) {
      this.addDomainNameConfiguration(props);
    }
  }

  private configureMTLS(mtlsConfig?: MTLSConfig): CfnDomainName.MutualTlsAuthenticationProperty | undefined {
    if (!mtlsConfig) return undefined;
    return {
      truststoreUri: mtlsConfig.bucket.s3UrlForObject(mtlsConfig.key),
      truststoreVersion: mtlsConfig.version,
    };
  }

  /**
   * Adds a configuration to a domain name. Properties like certificate, endpoint type and security policy can be set using this method.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html
   * @param props - domain name properties to be set
   */
  public addDomainNameConfiguration(props: DomainNameProps) : void {
    const domainNameConfig: CfnDomainName.DomainNameConfigurationProperty = {
      certificateArn: props.certificate.certificateArn,
      certificateName: props.certificateName,
      endpointType: props.endpointType?.toString(),
      ownershipVerificationCertificateArn: props.ownershipVerificationCertificate?.certificateArn,
      securityPolicy: props.securityPolicy?.toString(),
    };

    this.domainNameConfigurations.push(domainNameConfig);
  }
}
