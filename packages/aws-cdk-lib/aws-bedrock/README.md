# Amazon Bedrock Construct Library

Amazon Bedrock is a fully managed service that offers a choice of foundation models (FMs)
along with a broad set of capabilities for building generative AI applications.

This construct library provides a collection of constructs that can look up existing Bedrock models
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

L2 constructs for this service are available in the [`@aws-cdk/aws-bedrock-alpha`](https://www.npmjs.com/package/@aws-cdk/aws-bedrock-alpha) package.

You can also use the automatically generated [L1](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_l1_using) constructs, in the same way you would use [the CloudFormation AWS::Bedrock resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_Bedrock.html) directly.
