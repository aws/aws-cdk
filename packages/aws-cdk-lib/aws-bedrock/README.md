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

This library also provides constructs to support [cross-region inference](https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html), which enables you to seamlessly manage unplanned traffic bursts by utilizing compute across different AWS Regions. With cross-region inference, you can distribute traffic across multiple AWS Regions, enabling higher throughput and enhanced resilience during periods of peak demands.

To use cross-region inference, you include an __inference profile__ when running model inference by specifying the ID of the inference profile as the `modelId` when sending an [InvokeModel](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InvokeModel.html), [InvokeModelWithResponseStream](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InvokeModelWithResponseStream.html), [Converse](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html), or [ConverseStream](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html) request. An inference profile is an abstraction over an on-demand pool of resources from configured AWS Regions. An inference profile can route your inference request originating from your source region to another region configured in the pool. Use of cross-region inference increases throughput and improves resiliency by dynamically routing model invocation requests across the regions defined in inference profile. Routing factors in user traffic, demand and utilization of resources. The request is fulfilled in the region that it originated from.

To grant permission to invoke a Bedrock cross region inference profile:

```ts
import * as bedrock from 'aws-cdk-lib/aws-bedrock';

declare const myJobRole: iam.Role;
bedrock.CrossRegionInferenceProfile.US_ANTHROPIC_CLAUDE_3_HAIKU_20240307_V1_0.grantInvoke(
  'us-west-2',
  myJobRole
);
```

There are no official hand-written ([L2](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) constructs for provisioning Bedrock resources yet. Here are some suggestions on how to proceed:

- Search [Construct Hub for Bedrock construct libraries](https://constructs.dev/search?q=bedrock)
- Use the automatically generated [L1](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_l1_using) constructs, in the same way you would use [the CloudFormation AWS::Bedrock resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_Bedrock.html) directly.
