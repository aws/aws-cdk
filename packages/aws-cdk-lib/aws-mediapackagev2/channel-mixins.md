# MediaPackageV2 Channel Mixins Analysis

## Analysis Mode

**Mode A — No existing L2**: The MediaPackageV2 service only has L1 (CfnResource) constructs. No L2 construct exists in `packages/aws-cdk-lib/aws-mediapackagev2/` or any alpha package. All mixin interface designs are derived from L1 properties and AWS documentation.

## What is a Mixin?

A mixin is a self-contained, reusable module that encapsulates a specific set of functionality which can be composed into a class. In CDK, mixins allow adding discrete capabilities to resources without deep inheritance hierarchies.

Based on analysis of the `CfnChannel` class and [AWS Elemental MediaPackage v2 documentation](https://docs.aws.amazon.com/mediapackage/latest/userguide/channels.html), the following mixins could be extracted:

## CfnChannelProps Summary

| Property | Type | Required | Description |
|---|---|---|---|
| `channelGroupName` | `string` | Yes | Channel group association |
| `channelName` | `string` | Yes | Channel identifier |
| `description` | `string` | No | Channel description |
| `inputType` | `string` | No | `HLS` or `CMAF` (default: `HLS`) |
| `inputSwitchConfiguration` | `InputSwitchConfigurationProperty` | No | MQCS-based input switching (CMAF only) |
| `outputHeaderConfiguration` | `OutputHeaderConfigurationProperty` | No | CMSD header settings (CMAF only) |
| `tags` | `CfnTag[]` | No | Resource tags |

## 1. Input Switching Mixin

**AWS Documentation Reference:** [Leveraging media quality scores with AWS Elemental MediaPackage](https://docs.aws.amazon.com/mediapackage/latest/userguide/mqcs.html)

Configures automatic input switching based on the Media Quality Confidence Score (MQCS) provided by AWS Elemental MediaLive. This feature is only available for channels using CMAF ingest.

- Enable/disable MQCS-based input switching
- Configure preferred input endpoint when MQCS scores are equal
- Publish MQCS data in CMSD response headers for downstream CDN consumption

**Relevant CfnChannelProps:**
- `inputSwitchConfiguration`: `InputSwitchConfigurationProperty | IResolvable` — MQCS input switching settings
  - `mqcsInputSwitching`: `boolean` — Enable input switching based on MQCS
  - `preferredInput`: `number` — Preferred input (1 or 2) when MQCS scores are equal
- `outputHeaderConfiguration`: `OutputHeaderConfigurationProperty | IResolvable` — CMSD header settings
  - `publishMqcs`: `boolean` — Include MQCS in CMSD response headers

**Rationale:** These three properties (`mqcsInputSwitching`, `preferredInput`, `publishMqcs`) are all part of the same MQCS feature workflow. AWS groups them together in the console under "Media quality confidence score (MQCS) settings" when creating a channel. They all require CMAF input type and work together to provide quality-aware input redundancy. Combining input switching and MQCS publishing into a single mixin reflects how operators actually configure this feature.

**Suggested Interface:**

```typescript
/**
 * The preferred ingest endpoint when both inputs have equal MQCS scores.
 */
export enum PreferredInput {
  /** Prefer the first ingest endpoint */
  INPUT_1 = 1,
  /** Prefer the second ingest endpoint */
  INPUT_2 = 2,
}

/**
 * Properties for configuring MQCS-based input switching on a MediaPackageV2 channel.
 *
 * Input switching uses the Media Quality Confidence Score (MQCS) from
 * AWS Elemental MediaLive to automatically switch between redundant inputs
 * based on media quality. This feature requires CMAF input type.
 */
export interface ChannelInputSwitchingProps {
  /**
   * The preferred ingest endpoint when both inputs have equal MQCS scores.
   *
   * When not specified, MediaPackage uses its default switching behavior.
   *
   * @default - MediaPackage default switching behavior
   */
  readonly preferredInput?: PreferredInput;

  /**
   * Whether to include the MQCS in CMSD response headers sent to the CDN.
   *
   * When enabled, downstream systems can use the MQCS data for their own
   * quality-aware decisions (e.g., logging, analytics, or further switching).
   *
   * @default false
   */
  readonly publishMqcs?: boolean;
}
```

## 2. Channel Policy Mixin

**AWS Documentation Reference:** [Resource-based policy examples](https://docs.aws.amazon.com/mediapackage/latest/userguide/using-iam-policies.html)

Attaches an IAM resource-based policy to a MediaPackageV2 channel, controlling which principals can ingest content. This is implemented as a separate `AWS::MediaPackageV2::ChannelPolicy` CloudFormation resource.

- Attach a custom IAM resource policy to the channel
- Control cross-account access for content ingest
- Restrict access to specific IAM principals

**Relevant CloudFormation Resources:**
- `AWS::MediaPackageV2::ChannelPolicy`
  - `channelGroupName`: `string` — Channel group name (derived from channel)
  - `channelName`: `string` — Channel name (derived from channel)
  - `policy`: `any` — IAM policy document

**Rationale:** Channel policies are a discrete, optional capability that creates a child `CfnChannelPolicy` resource. This is analogous to the S3 `BucketPolicyStatementsMixin` pattern — the mixin orchestrates a separate CloudFormation resource on behalf of the target channel. It provides a meaningful abstraction over the raw policy JSON by accepting CDK `PolicyDocument` or `PolicyStatement` objects.

**Suggested Interface:**

```typescript
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * Properties for attaching a resource-based policy to a MediaPackageV2 channel.
 */
export interface ChannelPolicyProps {
  /**
   * The IAM policy document to attach to the channel.
   *
   * This policy controls which principals can perform actions on the channel,
   * such as ingesting content from cross-account encoders.
   */
  readonly policy: iam.PolicyDocument;
}
```

## Features Not Suited as Mixins

- **`channelGroupName`** (required, identity): Core identity property that every channel must have. It associates the channel with its channel group and is required at creation time. Not a discrete, optional capability.

- **`channelName`** (required, identity): Core identity property. The primary identifier for the channel, immutable after creation. Not a discrete, optional capability.

- **`description`** (simple property): A single string property that doesn't benefit from abstraction. The L1 Property mixin (`CfnChannelPropsMixin`) already covers this adequately.

- **`inputType`** (simple property, immutable): A single enum-like string (`HLS` or `CMAF`) that is immutable after creation. It's a fundamental channel characteristic, not an optional feature that can be composed. The L1 Property mixin covers this adequately.

- **`tags`** (cross-cutting concern): Tags are handled by CDK's built-in `TagManager` and `Tags.of()` API. The channel already implements `ITaggableV2`. Creating a separate mixin would duplicate existing CDK infrastructure.

## CfnChannelProps Not Covered by Mixins

These properties are intentionally not covered by hand-written mixins because they are either identity properties, simple values, or already handled by existing CDK mechanisms:

- `channelGroupName`: `string` (required) — Channel group association (identity)
- `channelName`: `string` (required) — Channel name (identity)
- `description`: `string` — Channel description (simple property, covered by L1 Property mixin)
- `inputType`: `string` — HLS or CMAF (simple property, covered by L1 Property mixin)
- `tags`: `CfnTag[]` — Resource tags (handled by CDK TagManager)
