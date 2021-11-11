import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { IBucket } from '@aws-cdk/aws-s3';
import { IResource, Resource, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDomainName, CfnDomainNameProps } from '../apigatewayv2.generated';

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
   * The ACM certificate for this domain name
   */
  readonly certificate: ICertificate;
  /**
   * The mutual TLS authentication configuration for a custom domain name.
   * @default - mTLS is not configured.
   */
  readonly mtls?: MTLSConfig
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

  constructor(scope: Construct, id: string, props: DomainNameProps) {
    super(scope, id);

    if (props.domainName === '') {
      throw new Error('empty string for domainName not allowed');
    }

    const mtlsConfig = this.configureMTLS(props.mtls);
    const domainNameProps: CfnDomainNameProps = {
      domainName: props.domainName,
      domainNameConfigurations: [
        {
          certificateArn: props.certificate.certificateArn,
          endpointType: 'REGIONAL',
        },
      ],
      mutualTlsAuthentication: mtlsConfig,
    };
    const resource = new CfnDomainName(this, 'Resource', domainNameProps);
    this.name = resource.ref;
    this.regionalDomainName = Token.asString(resource.getAtt('RegionalDomainName'));
    this.regionalHostedZoneId = Token.asString(resource.getAtt('RegionalHostedZoneId'));
  }

  private configureMTLS(mtlsConfig?: MTLSConfig): CfnDomainName.MutualTlsAuthenticationProperty | undefined {
    if (!mtlsConfig) return undefined;
    return {
      truststoreUri: mtlsConfig.bucket.s3UrlForObject(mtlsConfig.key),
      truststoreVersion: mtlsConfig.version,
    };
  }
}
