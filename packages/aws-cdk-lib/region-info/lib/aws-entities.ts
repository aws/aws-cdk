/**
 * After this point, S3 website domains look like `s3-website.REGION.s3.amazonaws.com`
 *
 * Before this point, S3 website domains look like `s3-website-REGION.s3.amazonaws.com`.
 */
export const RULE_S3_WEBSITE_REGIONAL_SUBDOMAIN = Symbol('S3_WEBSITE_REGIONAL_SUBDOMAIN');

/**
 * After this point, all regions in the 'aws' partition are opt-in.
 */
export const RULE_CLASSIC_PARTITION_BECOMES_OPT_IN = Symbol('CLASSIC_PARTITION_BECOMES_OPT_IN');

/**
 * List of AWS region, ordered by launch date (oldest to newest)
 *
 * The significance of this is that standards and conventions change over time.
 * Generally, as rules are changed they only apply to new regions, and old
 * regions are left as-is.
 *
 * We mix the list of regions with a list of rules that were introduced over
 * time (rules are symbols).
 *
 * Therefore, if we want to know if a rule applies to a certain region, we
 * only need to check its position in the list and compare it to when a
 * rule was introduced.
 */
export const AWS_REGIONS_AND_RULES: readonly (string | symbol)[] = [
  'us-east-1', // US East (N. Virginia)
  'eu-west-1', // Europe (Ireland)
  'us-west-1', // US West (N. California)
  'ap-southeast-1', // Asia Pacific (Singapore)
  'ap-northeast-1', // Asia Pacific (Tokyo)
  'us-gov-west-1', // AWS GovCloud (US-West)
  'us-west-2', // US West (Oregon)
  'sa-east-1', // South America (São Paulo)
  'ap-southeast-2', // Asia Pacific (Sydney)
  RULE_S3_WEBSITE_REGIONAL_SUBDOMAIN,
  'cn-north-1', // China (Beijing)
  'us-iso-east-1', // AWS ISO
  'eu-central-1', // Europe (Frankfurt)
  'ap-northeast-2', // Asia Pacific (Seoul)
  'ap-south-1', // Asia Pacific (Mumbai)
  'us-east-2', // US East (Ohio)
  'ca-central-1', // Canada (Central)
  'eu-west-2', // Europe (London)
  'us-isob-east-1', // AWS ISO-B
  'cn-northwest-1', // China (Ningxia)
  'eu-west-3', // Europe (Paris)
  'ap-northeast-3', // Asia Pacific (Osaka)
  'us-gov-east-1', // AWS GovCloud (US-East)
  'eu-north-1', // Europe (Stockholm)
  RULE_CLASSIC_PARTITION_BECOMES_OPT_IN,
  'ap-east-1', // Asia Pacific (Hong Kong)
  'me-south-1', // Middle East (Bahrain)
  'eu-south-1', // Europe (Milan)
  'af-south-1', // Africa (Cape Town)
  'us-iso-west-1', // US ISO West
  'eu-south-2', // Europe (Spain)
  'ap-southeast-3', // Asia Pacific (Jakarta)
  'me-central-1', // Middle East (UAE)
  'ap-south-2', // Asia Pacific (Hyderabad)
  'eu-central-2', // Europe (Zurich)
];

/**
 * The names of all (known) AWS regions
 *
 * Not in the list ==> no built-in data for that region.
 */
export const AWS_REGIONS = AWS_REGIONS_AND_RULES
  .filter((x) => typeof x === 'string')
  .sort() as readonly string[];

/**
 * Possibly non-exhaustive list of all service names, used to locate service principals.
 *
 * Not in the list ==> default service principal mappings.
 */
export const AWS_SERVICES: readonly string[] = [
  'application-autoscaling',
  'autoscaling',
  'codedeploy',
  'ec2',
  'events',
  'lambda',
  'logs',
  's3',
  'ssm',
  'sns',
  'sqs',
  'states',
].sort();

/**
 * Whether or not a region predates a given rule (or region).
 *
 * Unknown region => we have to assume no.
 */
export function before(region: string, ruleOrRegion: string | symbol) {
  const ruleIx = AWS_REGIONS_AND_RULES.indexOf(ruleOrRegion);
  if (ruleIx === -1) {
    throw new Error(`Unknown rule: ${String(ruleOrRegion)}`);
  }
  const regionIx = AWS_REGIONS_AND_RULES.indexOf(region);
  return regionIx === -1 ? false : regionIx < ruleIx;
}

/**
 * Return all regions before a given rule was introduced (or region)
 */
export function regionsBefore(ruleOrRegion: string | symbol): string[] {
  const ruleIx = AWS_REGIONS_AND_RULES.indexOf(ruleOrRegion);
  if (ruleIx === -1) {
    throw new Error(`Unknown rule: ${String(ruleOrRegion)}`);
  }
  return AWS_REGIONS_AND_RULES.slice(0, ruleIx)
    .filter((entry) => typeof entry === 'string')
    .sort() as string[];
}

export interface Region { readonly partition: string, readonly domainSuffix: string }

const PARTITION_MAP: {readonly [region: string]: Region } = {
  'default': { partition: 'aws', domainSuffix: 'amazonaws.com' },
  'cn-': { partition: 'aws-cn', domainSuffix: 'amazonaws.com.cn' },
  'us-gov-': { partition: 'aws-us-gov', domainSuffix: 'amazonaws.com' },
  'us-iso-': { partition: 'aws-iso', domainSuffix: 'c2s.ic.gov' },
  'us-isob-': { partition: 'aws-iso-b', domainSuffix: 'sc2s.sgov.gov' },
};

export function partitionInformation(region: string): Region {
  for (const [prefix, info] of Object.entries(PARTITION_MAP)) {
    if (region.startsWith(prefix)) {
      return info;
    }
  }
  return PARTITION_MAP.default;
}
