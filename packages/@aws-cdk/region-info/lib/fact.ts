/**
 * A database of regional information.
 */
export class Fact {
  /**
   * @returns the list of names of AWS regions for which there is at least one registered fact. This
   *          may not be an exhaustive list of all available AWS regions.
   */
  public static get regions(): string[] {
    return Object.keys(this.database);
  }

  /**
   * Retrieves a fact from this Fact database.
   *
   * @param region the name of the region (e.g: `us-east-1`)
   * @param name   the name of the fact being looked up (see the `FactName` class for details)
   *
   * @returns the fact value if it is known, and `undefined` otherwise.
   */
  public static find(region: string, name: string): string | undefined {
    const regionFacts = this.database[region];
    return regionFacts && regionFacts[name];
  }

  /**
   * Registers a new fact in this Fact database.
   *
   * @param fact           the new fact to be registered.
   * @param allowReplacing whether new facts can replace existing facts or not.
   */
  public static register(fact: IFact, allowReplacing = false): void {
    const regionFacts = this.database[fact.region] || (this.database[fact.region] = {});
    if (fact.name in regionFacts && regionFacts[fact.name] !== fact.value && !allowReplacing) {
      throw new Error(`Region ${fact.region} already has a fact ${fact.name}, with value ${regionFacts[fact.name]}`);
    }
    regionFacts[fact.name] = fact.value;
  }

  /**
   * Removes a fact from the database.
   * @param region the region for which the fact is to be removed.
   * @param name   the name of the fact to remove.
   * @param value  the value that should be removed (removal will fail if the value is specified, but does not match the
   *               current stored value).
   */
  public static unregister(region: string, name: string, value?: string): void {
    const regionFacts = this.database[region] || {};
    if (name in regionFacts && value && regionFacts[name] !== value) {
      throw new Error(`Attempted to remove ${name} from ${region} with value ${value}, but the fact's value is ${regionFacts[name]}`);
    }
    delete regionFacts[name];
  }

  private static readonly database: { [region: string]: { [name: string]: string } } = {};

  private constructor() {
    throw new Error('Use the static methods of Fact instead!');
  }
}

/**
 * A fact that can be registered about a particular region.
 */
export interface IFact {
  /**
   * The region for which this fact applies.
   */
  readonly region: string;

  /**
   * The name of this fact. Standardized values are provided by the `Facts` class.
   */
  readonly name: string;

  /**
   * The value of this fact.
   */
  readonly value: string;
}

/**
 * All standardized fact names.
 */
export class FactName {
  /**
   * The name of the partition for a region (e.g: 'aws', 'aws-cn', ...)
   */
  public static readonly PARTITION = 'partition';

  /**
   * The domain suffix for a region (e.g: 'amazonaws.com`)
   */
  public static readonly DOMAIN_SUFFIX = 'domainSuffix';

  /**
   * Whether the AWS::CDK::Metadata CloudFormation Resource is available in-region or not. The value is a boolean
   * modelled as `YES` or `NO`.
   */
  public static readonly CDK_METADATA_RESOURCE_AVAILABLE = 'cdk:metadata-resource:available';

  /**
   * The endpoint used for hosting S3 static websites
   */
  public static readonly S3_STATIC_WEBSITE_ENDPOINT = 's3-static-website:endpoint';

  /**
   * The endpoint used for aliasing S3 static websites in Route 53
   */
  public static readonly S3_STATIC_WEBSITE_ZONE_53_HOSTED_ZONE_ID = 's3-static-website:route-53-hosted-zone-id';

  /**
   * The name of the regional service principal for a given service.
   *
   * @param service the service name, either simple (e.g: `s3`, `codedeploy`) or qualified (e.g: `s3.amazonaws.com`).
   *                The `.amazonaws.com` and `.amazonaws.com.cn` domains are stripped from service names, so they are
   *                canonicalized in that respect.
   */
  public static servicePrincipal(service: string) {
    return `service-principal:${service.replace(/\.amazonaws\.com(\.cn)?$/, '')}`;
  }
}
