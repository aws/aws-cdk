/**
 * The names of all (known) AWS regions
 *
 * Not in the list ==> no built-in data for that region.
 */
export const AWS_REGIONS = [
  /** Africa (Cape Town) */
  'af-south-1',
  /** Asia Pacific (Hong Kong) */
  'ap-east-1',
  /** Asia Pacific (Tokyo) */
  'ap-northeast-1',
  /** Asia Pacific (Seoul) */
  'ap-northeast-2',
  /** Asia Pacific (Osaka) */
  'ap-northeast-3',
  /** Asia Pacific (Mumbai) */
  'ap-south-1',
  /** Asia Pacific (Singapore) */
  'ap-southeast-1',
  /** Asia Pacific (Sydney) */
  'ap-southeast-2',
  /** Canada (Central) */
  'ca-central-1',
  /** China (Beijing) */
  'cn-north-1',
  /** China (Ningxia) */
  'cn-northwest-1',
  /** Europe (Frankfurt) */
  'eu-central-1',
  /** Europe (Stockholm) */
  'eu-north-1',
  /** Europe (Milan) */
  'eu-south-1',
  /** Europe (Ireland) */
  'eu-west-1',
  /** Europe (London) */
  'eu-west-2',
  /** Europe (Paris) */
  'eu-west-3',
  /** Middle East (Bahrain) */
  'me-south-1',
  /** South America (São Paulo) */
  'sa-east-1',
  /** US East (N. Virginia) */
  'us-east-1',
  /** US East (Ohio) */
  'us-east-2',
  /** AWS GovCloud (US-East) */
  'us-gov-east-1',
  /** AWS GovCloud (US-West) */
  'us-gov-west-1',
  'us-iso-east-1',
  'us-isob-east-1',
  /** US West (N. California) */
  'us-west-1',
  /** US West (Oregon) */
  'us-west-2',
].sort();

/**
 * Possibly non-exhaustive list of all service names, used to locate service principals.
 *
 * Not in the list ==> default service principal mappings.
 */
export const AWS_SERVICES = [
  'application-autoscaling',
  'autoscaling',
  'codedeploy',
  'ec2',
  'events',
  'lambda',
  'logs',
  's3',
  'sns',
  'sqs',
  'states',
].sort();
