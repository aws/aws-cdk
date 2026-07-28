// aws ssm get-parameters-by-path --path /aws/service/global-infrastructure/services/apprunner/regions --query 'Parameters[*].Value' --output text | tr '\t' '\n' | sort
export const APPRUNNER_SUPPORTED_REGIONS = [
  'ap-northeast-1', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2',
  'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3',
  'us-east-1', 'us-east-2', 'us-west-2',
];
