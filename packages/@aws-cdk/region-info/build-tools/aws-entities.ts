/**
 * The names of all (known) AWS regions
 *
 * Not in the list ==> no built-in data for that region.
 */
export const AWS_REGIONS = [
  'us-east-2',
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'ap-east-1',
  'ap-south-1',
  'ap-northeast-2',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ca-central-1',
  'cn-north-1',
  'cn-northwest-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-north-1',
  'me-south-1',
  'sa-east-1',
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
