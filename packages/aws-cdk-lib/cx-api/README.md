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

https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html#AWS-logs-infrastructure-S3

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

https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html

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

https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-managed-iam-policies.html

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
- The name generation ensures it doesn't exceed 128 characters
- Without this feature flag, the prefix is prepended to the generated name, which result can exceed 128 characters

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
