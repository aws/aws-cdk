# Cloud Executable API
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

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

* `@aws-cdk/aws-ec2:amazonLinux2022DefaultToDefaultKernel`

Enable this feature flag to change the default kernel of EC2 instances deployed with an AMAZON_LINUX_2022 image to use the dynamic default kernel version. This version automatically changes with each major kernel version update.

Previously AMAZON_LINUX_2022 EC2 instances were configured to default to a kernel specification that is now unavailable.

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/aws-ec2:amazonLinux2022DefaultToDefaultKernel": true
  }
}
```
