import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { IBucket } from '@aws-cdk/aws-s3';
import { IResource, Resource, Token } from '@aws-cdk/core';
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
   * For a regional API and its custom domain name.
   */
  REGIONAL = 'REGIONAL'
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
   * DomainNameConfigurations for a domain name.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-domainnameconfigurations
   */
  readonly domainNameConfigurations: DomainNameConfiguration[];

  /**
    * The mutual TLS authentication configuration for a custom domain name.
    * @default - mTLS is not configured.
    */
  readonly mtls?: MTLSConfig;
}

/**
 * Specifies the configuration for a an API's domain name.
 */
export interface DomainNameConfiguration {
  /**
   * The reference to an AWS-managed certificate for use by the edge-optimized
   * endpoint for the domain name. For "EDGE" domain names, the certificate
   * needs to be in the US East (N. Virginia) region.
   */
  readonly certificate: ICertificate;

  /**
   * The user-friendly name of the certificate that will be used by the endpoint for this domain name.
   * @default null
   */
  readonly certificateName?: string;

  /**
    * The type of endpoint for this DomainName.
    * @default REGIONAL
    */
  readonly endpointType?: EndpointType;

  /**
    * The ARN of the public certificate issued by ACM to validate ownership of your
    * custom domain. Only required when configuring mutual TLS and using an ACM
    * imported or private CA certificate ARN as the RegionalCertificateArn.
    * @default null
    */
  readonly ownershipVerificationCertificate?: ICertificate;

  /**
    * The Transport Layer Security (TLS) version + cipher suite for this domain name.
    * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html
    * @default SecurityPolicy.TLS_1_0
    */
  readonly securityPolicy?: SecurityPolicy;
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
   * The key in S3 to look at for the trust store.
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
  private readonly domainNameConfigurations = new Array<CfnDomainName.DomainNameConfigurationProperty>();

  constructor(scope: Construct, id: string, props: DomainNameProps) {
    super(scope, id);

    // domain name null check
    if (props.domainName === '') {
      throw new Error('empty string for domainName not allowed');
    }

    // domain name configuration null check
    if (!props.domainNameConfigurations) {
      throw new Error('empty domain name configurations are not allowed');
    } else {
      this.setDomainNameConfigurations(...props.domainNameConfigurations);
    }

    const mtlsConfig = this.configureMTLS(props.mtls);

    const domainNameProps: CfnDomainNameProps = {
      domainName: props.domainName,
      domainNameConfigurations: this.domainNameConfigurations,
      mutualTlsAuthentication: mtlsConfig,
    };
    const resource = new CfnDomainName(this, 'Resource', domainNameProps);
    this.name = resource.ref;
    this.regionalDomainName = Token.asString(resource.getAtt('RegionalDomainName'));
    this.regionalHostedZoneId = Token.asString(resource.getAtt('RegionalHostedZoneId'));
  }

  private setDomainNameConfigurations(...domainNameConfigurations: DomainNameConfiguration[]) {
    domainNameConfigurations.forEach( (config) => {
      const ownershipCertArn = (config.ownershipVerificationCertificate) ? config.ownershipVerificationCertificate.certificateArn : undefined;
      const domainNameConfig: CfnDomainName.DomainNameConfigurationProperty = {
        certificateArn: config.certificate.certificateArn,
        certificateName: config.certificateName,
        endpointType: config.endpointType,
        ownershipVerificationCertificateArn: ownershipCertArn,
        securityPolicy: config.securityPolicy?.toString(),
      };
      this.domainNameConfigurations.push(domainNameConfig);
    });
  }

  private configureMTLS(mtlsConfig?: MTLSConfig): CfnDomainName.MutualTlsAuthenticationProperty | undefined {
    if (!mtlsConfig) return undefined;
    return {
      truststoreUri: mtlsConfig.bucket.s3UrlForObject(mtlsConfig.key),
      truststoreVersion: mtlsConfig.version,
    };
  }

}
