import { Fact, FactName } from './fact';

/**
 * Information pertaining to an AWS region.
 */
export class RegionInfo {
  /**
   * @returns the list of names of AWS regions for which there is at least one registered fact. This
   *          may not be an exaustive list of all available AWS regions.
   */
  public static get regions(): RegionInfo[] {
    return Fact.regions.map(RegionInfo.get);
  }

  /**
   * Obtain region info for a given region name.
   *
   * @param name the name of the region (e.g: us-east-1)
   */
  public static get(name: string): RegionInfo {
    return new RegionInfo(name);
  }

  private constructor(public readonly name: string) { }

  /**
   * Whether the `AWS::CDK::Metadata` CloudFormation Resource is available in this region or not.
   */
  public get cdkMetadataResourceAvailable(): boolean {
    return Fact.find(this.name, FactName.CDK_METADATA_RESOURCE_AVAILABLE) === 'YES';
  }

  /**
   * The domain name suffix (e.g: amazonaws.com) for this region.
   */
  public get domainSuffix(): string | undefined {
    return Fact.find(this.name, FactName.DOMAIN_SUFFIX);
  }

  /**
   * The name of the ARN partition for this region (e.g: aws).
   */
  public get partition(): string | undefined {
    return Fact.find(this.name, FactName.PARTITION);
  }

  /**
   * The endpoint used by S3 static website hosting in this region (e.g: s3-static-website-us-east-1.amazonaws.com)
   */
  public get s3StaticWebsiteEndpoint(): string | undefined {
    return Fact.find(this.name, FactName.S3_STATIC_WEBSITE_ENDPOINT);
  }

  /**
   * The hosted zone ID used by Route 53 to alias a S3 static website in this region (e.g: Z2O1EMRO9K5GLX)
   */
  public get s3StaticWebsiteHostedZoneId(): string | undefined {
    return Fact.find(this.name, FactName.S3_STATIC_WEBSITE_ZONE_53_HOSTED_ZONE_ID);
  }

  /**
   * The name of the service principal for a given service in this region.
   * @param service the service name (e.g: s3.amazonaws.com)
   */
  public servicePrincipal(service: string): string | undefined {
    return Fact.find(this.name, FactName.servicePrincipal(service));
  }
}
