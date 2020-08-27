import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { Construct, IResource, Resource, Token } from '@aws-cdk/core';
import { CfnDomainName, CfnDomainNameProps } from '../apigatewayv2.generated';

/**
 * Represents an APIGatewayV2 DomainName
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html
 */
export interface IDomainName extends IResource {
  /**
   * The custom domain name
   *
   * @attribute
   *
   */
  readonly domainName: string;

  /**
   * The domain name associated with the regional endpoint for this custom domain name.
   *
   * @attribute
   */
  readonly regionalDomainName: string;

  /**
   * The region-specific Amazon Route 53 Hosted Zone ID of the regional endpoint.
   *
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
  readonly domainName: string;

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
}

/**
 * Custom domain resource for the API
 */
export class DomainName extends Resource implements IDomainName {
  /**
   * import from attributes
   */
  public static fromDomainNameAttributes(scope: Construct, id: string, attrs: DomainNameAttributes): IDomainName {
    class Import extends Resource implements IDomainName {
      public readonly regionalDomainName = attrs.regionalDomainName;
      public readonly regionalHostedZoneId = attrs.regionalHostedZoneId;
      public readonly domainName = attrs.domainName;
    }
    return new Import(scope, id);
  }

  /**
   * The custom domain name for your API in Amazon API Gateway.
   *
   * @attribute
   */
  public readonly domainName: string;

  /**
   * The domain name associated with the regional endpoint for this custom domain name.
   */
  public readonly regionalDomainName: string;

  /**
   * The region-specific Amazon Route 53 Hosted Zone ID of the regional endpoint.
   */
  public readonly regionalHostedZoneId: string;

  constructor(scope: Construct, id: string, props: DomainNameProps) {
    super(scope, id);

    const domainNameProps: CfnDomainNameProps = {
      domainName: props.domainName,
      domainNameConfigurations: [
        {
          certificateArn: props.certificate.certificateArn,
          endpointType: 'REGIONAL',
        },
      ],
    };
    const resource = new CfnDomainName(this, 'Resource', domainNameProps);
    this.domainName = props.domainName ?? resource.ref;
    this.regionalDomainName = Token.asString(resource.getAtt('RegionalDomainName'));
    this.regionalHostedZoneId = Token.asString(resource.getAtt('RegionalHostedZoneId'));
  }
}
