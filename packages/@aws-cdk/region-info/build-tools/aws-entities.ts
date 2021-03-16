/**
 * The names of all (known) AWS regions
 *
 * Not in the list ==> no built-in data for that region.
 */
export const AWS_REGIONS = [
  'af-south-1', // Africa (Cape Town)
  'ap-east-1', // Asia Pacific (Hong Kong)
  'ap-northeast-1', // Asia Pacific (Tokyo)
  'ap-northeast-2', // Asia Pacific (Seoul)
  'ap-northeast-3', // Asia Pacific (Osaka)
  'ap-south-1', // Asia Pacific (Mumbai)
  'ap-southeast-1', // Asia Pacific (Singapore)
  'ap-southeast-2', // Asia Pacific (Sydney)
  'ca-central-1', // Canada (Central)
  'cn-north-1', // China (Beijing)
  'cn-northwest-1', // China (Ningxia)
  'eu-central-1', // Europe (Frankfurt)
  'eu-north-1', // Europe (Stockholm)
  'eu-south-1', // Europe (Milan)
  'eu-west-1', // Europe (Ireland)
  'eu-west-2', // Europe (London)
  'eu-west-3', // Europe (Paris)
  'me-south-1', // Middle East (Bahrain)
  'sa-east-1', // South America (São Paulo)
  'us-east-1', // US East (N. Virginia)
  'us-east-2', // US East (Ohio)
  'us-gov-east-1', // AWS GovCloud (US-East)
  'us-gov-west-1', // AWS GovCloud (US-West)
  'us-iso-east-1', // AWS ISO
  'us-isob-east-1', // AWS ISO-B
  'us-west-1', // US West (N. California)
  'us-west-2', // US West (Oregon)
].sort();

/**
 * Possibly non-exaustive list of all service names, used to locate service principals.
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
