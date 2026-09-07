/**
 * Regions where both AWS::Bedrock::Agent CFN resource type AND
 * anthropic.claude-3-5-sonnet-20241022-v2:0 model are available.
 *
 * Verified via:
 *   aws cloudformation describe-type --type RESOURCE --type-name "AWS::Bedrock::Agent" --region <region>
 *   aws bedrock get-foundation-model --model-identifier "anthropic.claude-3-5-sonnet-20241022-v2:0" --region <region>
 */
export const BEDROCK_AGENT_INTEG_TEST_REGIONS = [
  'us-east-1',
  'us-west-2',
  'us-east-2',
  'ap-northeast-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-south-1',
  'ap-northeast-2',
  'ap-northeast-3',
];
