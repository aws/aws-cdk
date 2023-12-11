# Amazon Bedrock Construct Library

Amazon Bedrock is a fully managed service that offers a choice of foundation models (FMs)
along with a broad set of capabilities for building generative AI applications.

CloudFormation does not currently support any Bedrock resource types.
This construct library is a collection of constructs that can look up existing Bedrock models
for use with other services' CDK constructs, such as AWS Step Functions.

To look up a Bedrock base foundation model:

```ts
import * as bedrock from 'aws-cdk-lib/aws-bedrock';

bedrock.FoundationModel.fromFoundationModelId(
  this,
  'Model',
  bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_V2,
);
```

To look up a Bedrock provisioned throughput model:

```ts
import * as bedrock from 'aws-cdk-lib/aws-bedrock';

bedrock.ProvisionedModel.fromProvisionedModelArn(
  this,
  'Model',
  'arn:aws:bedrock:us-east-2:123456789012:provisioned-model/abc-123',
);
```
