# Cloud Executable API

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## V2 Feature Flags

* `@aws-cdk/aws-s3:createDefaultLoggingPolicy`

Enable this feature flag to create an S3 bucket policy by default in cases where
an AWS service would automatically create the Policy if one does not exist.

For example, in order to send VPC flow logs to an S3 bucket, there is a specific Bucket Policy
that needs to be attached to the bucket. If you create the bucket without a policy and then add the
bucket as the flow log destination, the service will automatically create the bucket policy with the
necessary permissions. If you were to then try and add your own bucket policy CloudFormation will throw
and error indicating that a bucket policy already exists.

In cases where we know what the required policy is we can go ahead and create the policy so we can
remain in control of it.

<https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html#AWS-logs-infrastructure-S3>

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-s3:createDefaultLoggingPolicy": true
  }
}
```

* `@aws-cdk/aws-sns-subscriptions:restrictSqsDescryption`

Enable this feature flag to restrict the decryption of a SQS queue, which is subscribed to a SNS topic, to
only the topic which it is subscribed to and not the whole SNS service of an account.

Previously the decryption was only restricted to the SNS service principal. To make the SQS subscription more
secure, it is a good practice to restrict the decryption further and only allow the connected SNS topic to decryption
the subscribed queue.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-sns-subscriptions:restrictSqsDescryption": true
  }
}
```

* @aws-cdk/aws-apigateway:disableCloudWatchRole

Enable this feature flag to change the default behavior for aws-apigateway.RestApi and aws-apigateway.SpecRestApi
to _not_ create a CloudWatch role and Account. There is only a single ApiGateway account per AWS
environment which means that each time you create a RestApi in your account the ApiGateway account
is overwritten. If at some point the newest RestApi is deleted, the ApiGateway Account and CloudWatch
role will also be deleted, breaking any existing ApiGateways that were depending on them.

When this flag is enabled you should either create the ApiGateway account and CloudWatch role
separately _or_ only enable the cloudWatchRole on a single RestApi.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-apigateway:disableCloudWatchRole": true
  }
}
```

* `@aws-cdk/core:enablePartitionLiterals`

Enable this feature flag to have `Stack.partition` return a literal string for a stack's partition
when the stack has a known region configured.  If the region is undefined, or set to an unknown value, the
`Stack.partition` will be the CloudFormation intrinsic value `AWS::Partition`.  Without this feature flag,
`Stack.partition` always returns the CloudFormation intrinsic value `AWS::Partition`.

This feature will often simplify ARN strings in CDK generated templates, for example:

```yaml
 Principal:
   AWS:
     Fn::Join:
       - ""
       - - "arn:"
         - Ref: AWS::Partition
         - :iam::123456789876:root
```

becomes:

```yaml
 Principal:
   AWS: "arn:aws:iam::123456789876:root"
```

* `@aws-cdk/aws-ecs:disableExplicitDeploymentControllerForCircuitBreaker`

Enable this feature flag to avoid setting the "ECS" deployment controller when adding a circuit breaker to an
ECS Service, as this will trigger a full replacement which fails to deploy when using set service names.
This does not change any behaviour as the default deployment controller when it is not defined is ECS.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-ecs:disableExplicitDeploymentControllerForCircuitBreaker": true
  }
}
```

* `@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy`

Enable this feature flag to use S3 Bucket Policy for granting permission fo Server Access Logging
rather than using the canned \`LogDeliveryWrite\` ACL. ACLs do not work when Object Ownership is
enabled on the bucket.

This flag uses a Bucket Policy statement to allow Server Access Log delivery, following best
practices for S3.

<https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html>

```json
{
  "context": {
    "@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy": true
  }
}
```

* `@aws-cdk/aws-rds:databaseProxyUniqueResourceName`

Enable this feature flag to use unique resource names for each `DatabaseProxy`.

Previously, the default behavior for `DatabaseProxy` was to use `id` of the constructor for `dbProxyName`.
In this case, users couldn't deploy `DatabaseProxy`s that have the same `id` in the same region.

This is a feature flag as the old behavior was technically incorrect, but users may have come to depend on it.

```json
{
  "context": {
    "@aws-cdk/aws-rds:databaseProxyUniqueResourceName": true
  }
}
```

* `@aws-cdk/aws-redshift:columnId`

Enable this feature flag to allow the CDK to track changes in Redshift columns through their `id` attribute. This is a breaking change, as the `name` attribute was currently being used to track changes to Redshift columns.

Enabling this feature flag comes at a risk for existing Redshift columns, as the `name` attribute of a redshift column was currently being used. Therefore, to change a Redshift columns' `name` will essentially create a new column and delete the old one. This will cause data loss. If you choose to enable this flag, ensure that upon intial deployment (the first deployment after setting this feature flag), the `name` attribute of every column is not changed. After the intial deployment, you can freely change the `name` attribute of a column.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-redshift:columnId": true
  }
}
```

* `@aws-cdk/aws-stepfunctions-tasks:enableEmrServicePolicyV2`

Enable this feature flag to use the \`AmazonEMRServicePolicy_v2\` managed policies for the EMR service role.

This is a feature flag as the old behavior will be deprecated, but some resources may require manual
intervention since they might not have the appropriate tags propagated automatically.

<https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-managed-iam-policies.html>

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-stepfunctions-tasks:enableEmrServicePolicyV2": true
  }
}
```

* `@aws-cdk/core:includePrefixInUniqueNameGeneration`

Enable this feature flag to include the stack's prefixes to the name generation process.

Not doing so can cause the name of stack to exceed 128 characters:

* The name generation ensures it doesn't exceed 128 characters
* Without this feature flag, the prefix is prepended to the generated name, which result can exceed 128 characters

This is a feature flag as it changes the name generated for stacks. Any CDK application deployed prior this fix will
most likely be generated with a new name, causing the stack to be recreated with the new name, and then deleting the old one.
For applications running on production environments this can be unmanageable.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/core:includePrefixInUniqueNameGeneration": true
  }
}
```

* `@aws-cdk/aws-lambda-nodejs:useLatestRuntimeVersion`

Enable this feature flag to automatically use the latest available NodeJS version in the aws-lambda-nodejse.Function construct.

This allows creation of new functions using a version that will automatically stay up to date without breaking bundling of existing functions that externalize packages included in their environemnt such as `aws-sdk`.

Functions defined previously will continue to function correctly as long as they pass an explicit runtime version, or do not exclude packages during bundling.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-lambda-nodejs:useLatestRuntimeVersion": true
  }
}
```

* `@aws-cdk/aws-codepipeline-actions:useNewDefaultBranchForCodeCommitSource`

Enable this feature flag to update the default branch for CodeCommit source actions to `main`.

Previously, the default branch for CodeCommit source actions was set to `master`.
However, this convention is no longer supported, and repositories created after March 2021 now have `main` as
their default branch.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-codepipeline-actions:useNewDefaultBranchForCodeCommitSource": true
  }
}
```

* `@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction`

Enable this feature flag to change the logical ID of the `LambdaPermission` for the `LambdaAction` to include an alarm ID.

Previously, only one alarm with the `LambdaAction` could be created per Lambda.
This flag allows multiple alarms with the `LambdaAction` for the same Lambda to be created.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction": true
  }
}
```

* `@aws-cdk/aws-codepipeline:crossAccountKeysDefaultValueToFalse`

Enables Pipeline to set the default value for `crossAccountKeys` to false.

When this feature flag is enabled, and the `crossAccountKeys` property is not provided in a `Pipeline`
construct, the construct automatically defaults the value of this property to false.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-codepipeline:crossAccountKeysDefaultValueToFalse": true
  }
}
```

* `@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2`

Enables Pipeline to set the default pipeline type to V2.

When this feature flag is enabled, and the `pipelineType` property is not provided in a `Pipeline`
construct, the construct automatically defaults the value of this property to `PipelineType.V2`.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2": true
  }
}
```

* `@aws-cdk/aws-kms:reduceCrossAccountRegionPolicyScope`

Reduce resource scope of the IAM Policy created from KMS key grant to granting key only.

When this feature flag is enabled and calling KMS key grant method, the created IAM policy will reduce the resource scope from
'*' to this specific granting KMS key.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-kms:reduceCrossAccountRegionPolicyScope": true
  }
}
```

* `@aws-cdk/aws-kms:applyImportedAliasPermissionsToPrincipal`

Enable grant methods on imported KMS Aliases to apply permissions scoped by the alias using the `kms:ResourceAliases` condition key. When this flag is disabled, grant* methods on `Alias.fromAliasName` remain no-ops to preserve existing behavior.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-kms:applyImportedAliasPermissionsToPrincipal": true
  }
}
```

* `@aws-cdk/aws-eks:nodegroupNameAttribute`

When enabled, nodegroupName attribute of the provisioned EKS NodeGroup will not have the cluster name prefix.

When this feature flag is enabled, the nodegroupName attribute will be exactly the name of the nodegroup
without any prefix.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-eks:nodegroupNameAttribute": true
  }
}
```

* `@aws-cdk/aws-ec2:ebsDefaultGp3Volume`

When enabled, the default volume type of the EBS volume will be GP3.

When this featuer flag is enabled, the default volume type of the EBS volume will be `EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3`

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-ec2:ebsDefaultGp3Volume": true
  }
}
```

* `@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm`

When enabled, remove default deployment alarm settings.

When this featuer flag is enabled, remove the default deployment alarm settings when creating a AWS ECS service.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-ec2:ebsDefaultGp3Volume": true
  }
}
```

* `@aws-cdk/aws-stepfunctions-tasks:ecsReduceRunTaskPermissions`

When enabled, IAM Policy created to run tasks won't include the task definition ARN, only the revision ARN.

When this feature flag is enabled, the IAM Policy created to run tasks won't include the task definition ARN, only the revision ARN.
The revision ARN is more specific than the task definition ARN. See <https://docs.aws.amazon.com/step-functions/latest/dg/ecs-iam.html>
for more details.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-stepfunctions-tasks:ecsReduceRunTaskPermissions": true
  }
}
```

* `@aws-cdk/aws-stepfunctions-taks:useNewS3UriParametersForBedrockInvokeModelTask`

When enabled, use new props for S3 URI under `input` and `output` fields in task definition of state machine for bedrock invoke model.

When this feature flag is enabled, use newly introduced props `s3InputUri` and `s3OutputUri` to populate S3 uri under input and output fields in state machine task definition for Bedrock invoke model.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-stepfunctions-tasks:useNewS3UriParametersForBedrockInvokeModelTask": true
  }
}
```

* `@aws-cdk/aws-ecs:reduceEc2FargateCloudWatchPermissions`

Currently, we will automatically add a number of cloudwatch permissions to the task role when no cloudwatch log group is
specified as logConfiguration and it will grant 'Resources': ['*'] to the task role.

When this feature flag is enabled, we will only grant the necessary permissions when users specify cloudwatch log group.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-ecs:reduceEc2FargateCloudWatchPermissions": true
  }
}
```

* `@aws-cdk/aws-ec2:ec2SumTImeoutEnabled`

Currently is both initOptions.timeout and resourceSignalTimeout are both specified in the options for creating an EC2 Instance, only the value from 'resourceSignalTimeout' will be used.

When this feature flag is enabled, if both initOptions.timeout and resourceSignalTimeout are specified, the values will to be summed together.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-ec2:ec2SumTImeoutEnabled": true
  }
}
```

* `@aws-cdk/aws-appsync:appSyncGraphQLAPIScopeLambdaPermission`

Currently, when using a Lambda authorizer with an AppSync GraphQL API, the AWS CDK automatically generates the necessary AWS::Lambda::Permission to allow the AppSync API to invoke the Lambda authorizer. This permission is overly permissive because it lacks a SourceArn, meaning it allows invocations from any source.

When this feature flag is enabled, the AWS::Lambda::Permission will be properly scoped with the SourceArn corresponding to the specific AppSync GraphQL API.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-ec2:appSyncGraphQLAPIScopeLambdaPermission": true
  }
}
```

* `@aws-cdk/aws-rds:setCorrectValueForDatabaseInstanceReadReplicaInstanceResourceId`

When enabled, the value of property `instanceResourceId` in construct `DatabaseInstanceReadReplica` will be set to the correct value which is `DbiResourceId` instead of currently `DbInstanceArn`* (fix)

When this feature flag is enabled, the value of that property will be as expected set to `DbiResourceId` attribute, and that will fix the grantConnect method.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-rds:setCorrectValueForDatabaseInstanceReadReplicaInstanceResourceId": true
  }
}
```

* `@aws-cdk/aws-lambda-nodejs:sdkV3ExcludeSmithyPackages`

Currently, when bundling Lambda functions with the non-latest runtime that supports AWS SDK JavaScript (v3), only the `@aws-sdk/*` packages are excluded by default.
However, this can cause version mismatches between the `@aws-sdk/*` and `@smithy/*` packages, as they are tightly coupled dependencies in AWS SDK v3.

When this feature flag is enabled, both `@aws-sdk/*` and `@smithy/*` packages will be excluded during the bundling process. This ensures that no mismatches
occur between these tightly coupled dependencies when using the AWS SDK v3 in Lambda functions.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-lambda-nodejs:sdkV3ExcludeSmithyPackages": true
  }
}
```

* `@aws-cdk/aws-dynamodb:resourcePolicyPerReplica`

If this flag is not set, the default behavior for \`TableV2\` is to use a different \`resourcePolicy\` for each replica.

If this flag is set to false, the behavior is that each replica shares the same \`resourcePolicy\` as the source table.
This will prevent you from creating a new table which has an additional replica and a resource policy.

This is a feature flag as the old behavior was technically incorrect but users may have come to depend on it.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-dynamodb:resourcePolicyPerReplica": false,
  },
}
```

* `@aws-cdk/aws-route53-targets:userPoolDomainNameMethodWithoutCustomResource`

When enabled, use a new method for DNS Name of user pool domain target without creating a custom resource.

When this feature flag is enabled, a new method will be used to get the DNS Name of the user pool domain target. The old method
creates a custom resource internally, but the new method doesn't need a custom resource.

If the flag is set to false then a custom resource will be created when using `UserPoolDomainTarget`.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-route53-targets:userPoolDomainNameMethodWithoutCustomResource": true
  }
}
```

* `@aws-cdk/aws-ecs:disableEcsImdsBlocking`

When set to true, CDK synth will throw exception if canContainersAccessInstanceRole is false.

In an ECS Cluster with `MachineImageType.AMAZON_LINUX_2`, the canContainersAccessInstanceRole=false option attempts to add commands to block containers from
accessing IMDS. CDK cannot guarantee the correct execution of the feature in all platforms. Setting this feature flag
to true will ensure CDK does not attempt to implement IMDS blocking. By <ins>**end of 2025**</ins>, CDK will remove the
IMDS blocking feature. See [Github discussion](https://github.com/aws/aws-cdk/discussions/32609) for more information.

**It is recommended to follow ECS documentation to block IMDS for your specific platform and cluster configuration.**

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-ecs:disableEcsImdsBlocking": true
  }
}
```

* `@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature`

When set to true along with canContainersAccessInstanceRole=false in ECS cluster, new updated commands will be added to UserData to block container accessing IMDS. **Applicable to Linux only.**

In an ECS Cluster with `MachineImageType.AMAZON_LINUX_2`, the canContainersAccessInstanceRole=false option attempts to add commands to block containers from
accessing IMDS. Set this flag to true in order to use new and updated commands. Please note that this
feature alone with this feature flag will be deprecated by <ins>end of 2025</ins> as CDK cannot
guarantee the correct execution of the feature in all platforms. See [Github discussion](https://github.com/aws/aws-cdk/discussions/32609) for more information.

**It is recommended to follow ECS documentation to block IMDS for your specific platform and cluster configuration.**

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature": false,
  },
}
```

* `@aws-cdk/aws-elasticloadbalancingV2:albDualstackWithoutPublicIpv4SecurityGroupRulesDefault`

When enabled, the default security group ingress rules will allow IPv6 ingress from anywhere,
For internet facing ALBs with `dualstack-without-public-ipv4` IP address type, the default security group rules
will allow IPv6 ingress from anywhere (::/0). Previously, the default security group rules would only allow IPv4 ingress.

Using a feature flag to make sure existing customers who might be relying
on the overly restrictive permissions are not broken.,

If the flag is set to false then the default security group rules will only allow IPv4 ingress.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-elasticloadbalancingV2:albDualstackWithoutPublicIpv4SecurityGroupRulesDefault": true
  }
}
```

* `@aws-cdk/aws-iam:oidcRejectUnauthorizedConnections`

When this feature flag is enabled, the default behaviour of OIDC Provider's custom resource handler will
default to reject unauthorized connections when downloading CA Certificates.

When this feature flag is disabled, the behaviour will be the same as current and will allow downloading
thumbprints from unsecure connnections.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-iam:oidcRejectUnauthorizedConnections": true
  }
}
```

* `@aws-cdk/core:enableAdditionalMetadataCollection`

When this feature flag is enabled, CDK expands the scope of usage data collection to include the:

* L2 construct property keys - Collect which property keys you use from the L2 constructs in your app. This includes property keys nested in dictionary objects.
* L2 construct property values of BOOL and ENUM types - Collect property key values of only BOOL and ENUM types. All other types, such as string values or construct references will be redacted.
* L2 construct method usage - Collection method name, parameter keys and parameter values of BOOL and ENUM type.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/core:enableAdditionalMetadataCollection": true
  }
}
```

* `@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy`

[Deprecated default feature] When this feature flag is enabled, Lambda will create new inline policies with AddToRolePolicy. 
The purpose of this is to prevent lambda from creating a dependency on the Default Policy Statement.
This solves an issue where a circular dependency could occur if adding lambda to something like a Cognito Trigger, then adding the User Pool to the lambda execution role permissions.
However in the current implementation, we have removed a dependency of the lambda function on the policy. In addition to this, a Role will be attached to the Policy instead of an inline policy being attached to the role. 
This will create a data race condition in the CloudFormation template because the creation of the Lambda function no longer waits for the policy to be created. Having said that, we are not deprecating the feature (we are defaulting the feature flag to false for new stacks) since this feature can still be used to get around the circular dependency issue (issue-7016) particularly in cases where the lambda resource creation doesnt need to depend on the policy resource creation. 
We recommend to unset the feature flag if already set which will restore the original behavior.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy": false
  }
}
```

* `@aws-cdk/aws-s3:setUniqueReplicationRoleName`

When this feature flag is enabled, a unique role name is specified only when performing cross-account replication.
When disabled, 'CDKReplicationRole' is always specified.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-s3:setUniqueReplicationRoleName": true
  }
}
```

* `@aws-cdk/pipelines:reduceStageRoleTrustScope`

When this feature flag is enabled, the root account principal will not be added to the trust policy of stage role.
When this feature flag is disabled, it will keep the root account principal in the trust policy.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/pipelines:reduceStageRoleTrustScope": true
  }
}
```

* `@aws-cdk/aws-events:requireEventBusPolicySid`

When this flag is enabled:
- Resource policies will be created with Statement IDs for service principals
- The operation will succeed as expected

When this flag is disabled:
- A warning will be emitted
- The grant operation will be dropped
- No permissions will be added

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-events:requireEventBusPolicySid": true
  }
}
```

* `@aws-cdk/aws-dynamodb:retainTableReplica`

Currently, table replica will always be deleted when stack deletes regardless of source table's deletion policy.
When enabled, table replica will be default to the removal policy of source table unless specified otherwise.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-dynamodb:retainTableReplica": true
  }
}
```

* `@aws-cdk/cognito:logUserPoolClientSecretValue`

When this feature flag is enabled, the SDK API call response to desribe user pool client values will be logged in the custom 
resource lambda function logs.

When this feature flag is disabled, the SDK API call response to describe user pool client values will not be logged in the custom 
resource lambda function logs. 

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/cognito:logUserPoolClientSecretValue": true
  }
}
```

* `@aws-cdk/aws-s3:publicAccessBlockedByDefault`

When BlockPublicAccess is not set at all, s3's default behavior will be to set all options to true in aws console.
The previous behavior in cdk before this feature was; if only some of the BlockPublicAccessOptions were set (not all 4), then the ones undefined would default to false.
This is counter intuitive to the console behavior where the options would start in true state and a user would uncheck the boxes as needed.
The new behavior from this feature will allow a user, for example, to set 1 of the 4 BlockPublicAccessOpsions to false, and on deployment the other 3 will remain true.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-s3:publicAccessBlockedByDefault": true
  }
}
```

* `@aws-cdk/aws-ec2:requirePrivateSubnetsForEgressOnlyInternetGateway`

When this feature flag is enabled, EgressOnlyGateway is created only for dual-stack VPC with private subnets

When this feature flag is disabled, EgressOnlyGateway resource is created for all dual-stack VPC regardless of subnet type

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-ec2:requirePrivateSubnetsForEgressOnlyInternetGateway": true
  }
}
```

* `@aws-cdk/aws-signer:signingProfileNamePassedToCfn`

When this feature flag is enabled, the `signingProfileName` property is passed to the L1 `CfnSigningProfile` construct,
which ensures that the AWS Signer profile is created with the specified name.

When this feature flag is disabled, the `signingProfileName` is not passed to CloudFormation, maintaining backward
compatibility with existing deployments where CloudFormation auto-generated profile names.

This feature flag is needed because enabling it can cause existing signing profiles to be
replaced during deployment if a `signingProfileName` was specified but not previously used
in the CloudFormation template.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-signer:signingProfileNamePassedToCfn": true
  }
}
```