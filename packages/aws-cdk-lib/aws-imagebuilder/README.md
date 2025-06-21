# AWS::ImageBuilder Construct Library


This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

```ts nofixture
import * as imagebuilder from 'aws-cdk-lib/aws-imagebuilder';
```

<!--BEGIN CFNONLY DISCLAIMER-->

There are no official hand-written ([L2](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) constructs for this service yet. Here are some suggestions on how to proceed:

- Search [Construct Hub for ImageBuilder construct libraries](https://constructs.dev/search?q=imagebuilder)
- Use the automatically generated [L1](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_l1_using) constructs, in the same way you would use [the CloudFormation AWS::ImageBuilder resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_ImageBuilder.html) directly.


<!--BEGIN CFNONLY DISCLAIMER-->

There are no hand-written ([L2](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) constructs for this service yet. 
However, you can still use the automatically generated [L1](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_l1_using) constructs, and use this service exactly as you would using CloudFormation directly.

For more information on the resources and properties available for this service, see the [CloudFormation documentation for AWS::ImageBuilder](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_ImageBuilder.html).

(Read the [CDK Contributing Guide](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md) and submit an RFC if you are interested in contributing to this construct library.)

<!--END CFNONLY DISCLAIMER-->

## Known Limitations

### DistributionConfiguration AmiDistributionConfiguration

Due to CloudFormation specification limitations, the `amiDistributionConfiguration` property must be provided as raw JSON with PascalCase property names to avoid CloudFormation validation warnings.

**❌ Incorrect approach (generates validation warnings):**

```python
# This approach generates camelCase properties that cause CloudFormation validation warnings
ami_dist_config = imagebuilder.CfnDistributionConfiguration.AmiDistributionConfigurationProperty(
    ami_tags={"Environment": "Production"},
    description="My AMI description", 
    name="MyAMI-{{ imagebuilder:buildDate }}",
    target_account_ids=["123456789012"]
)

distribution_config = imagebuilder.CfnDistributionConfiguration(
    self, "DistConfig",
    name="MyDistributionConfig",
    distributions=[
        imagebuilder.CfnDistributionConfiguration.DistributionProperty(
            region="us-east-1",
            ami_distribution_configuration=ami_dist_config
        )
    ]
)
```

**✅ Correct approach (avoids validation warnings):**

```python nofixture
# Use raw JSON with PascalCase property names
distribution_config = imagebuilder.CfnDistributionConfiguration(
    self, "DistConfig", 
    name="MyDistributionConfig",
    distributions=[
        imagebuilder.CfnDistributionConfiguration.DistributionProperty(
            region="us-east-1",
            ami_distribution_configuration={
                "AmiTags": {"Environment": "Production"},
                "Description": "My AMI description",
                "Name": "MyAMI-{{ imagebuilder:buildDate }}",
                "TargetAccountIds": ["123456789012"],
                "LaunchPermissionConfiguration": {
                    "OrganizationArns": ["arn:aws:organizations::123456789012:organization/o-example"],
                    "OrganizationalUnitArns": ["arn:aws:organizations::123456789012:ou/o-example/ou-example"]
                }
            }
        )
    ]
)
```

**TypeScript example:**

```typescript nofixture
// Use raw JSON with PascalCase property names
const distributionConfig = new imagebuilder.CfnDistributionConfiguration(this, 'DistConfig', {
  name: 'MyDistributionConfig',
  distributions: [{
    region: 'us-east-1',
    amiDistributionConfiguration: {
      AmiTags: { Environment: 'Production' },
      Description: 'My AMI description',
      Name: 'MyAMI-{{ imagebuilder:buildDate }}',
      TargetAccountIds: ['123456789012'],
      LaunchPermissionConfiguration: {
        OrganizationArns: ['arn:aws:organizations::123456789012:organization/o-example'],
        OrganizationalUnitArns: ['arn:aws:organizations::123456789012:ou/o-example/ou-example']
      }
    }
  }]
});
```

### Affected Properties

The following properties in `AmiDistributionConfiguration` require PascalCase when using raw JSON:

| CDK Property (camelCase) | CloudFormation Property (PascalCase) |
|--------------------------|---------------------------------------|
| `amiTags` | `AmiTags` |
| `description` | `Description` |
| `name` | `Name` |
| `targetAccountIds` | `TargetAccountIds` |
| `launchPermissionConfiguration` | `LaunchPermissionConfiguration` |

### Why This Happens

This limitation exists because:

1. CDK's Python bindings generate camelCase property names (e.g., `amiTags`, `targetAccountIds`)
2. CloudFormation expects PascalCase property names (e.g., `AmiTags`, `TargetAccountIds`)
3. The property name transformation doesn't work correctly for ImageBuilder DistributionConfiguration

While deployments succeed despite the validation warnings, using the raw JSON approach eliminates the warnings entirely and follows CloudFormation specifications correctly.
