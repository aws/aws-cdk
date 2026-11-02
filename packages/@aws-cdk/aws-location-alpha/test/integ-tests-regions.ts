// Regions where AWS::Location::* CloudFormation resources are available.
// Verified with: aws cloudformation describe-type --type RESOURCE --type-name AWS::Location::Map --region <region>
// Source: aws ssm get-parameters-by-path --path /aws/service/global-infrastructure/services/amazonlocationservice/regions
// Note: ap-southeast-5 and eu-south-2 are in SSM but do not have CFN support. us-gov-west-1 excluded.
export const LOCATION_SUPPORTED_REGIONS = [
  'ap-northeast-1',
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ca-central-1',
  'eu-central-1',
  'eu-north-1',
  'eu-west-1',
  'eu-west-2',
  'sa-east-1',
  'us-east-1',
  'us-east-2',
  'us-west-2',
];
