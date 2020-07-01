## AWS Synthetics Construct Library

<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

## Canaries

AWS Cloudwatch Synthetics are used to create *canaries*, scripts that run on a schedule and monitor websites and API endpoints. You can read more about them [here](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html).

A canary manages a lambda function for you and runs that function at intervals specified in a schedule.

This construct library allows you to define AWS Synthetics Canaries:

```ts
import * as synth from '@aws/aws-synthetics';

const canary = new synth.Canary(this, 'MyCanary', {
	canaryName: 'mycanary',
	handler: 'index.handler',
	code: Code.fromInline('your code here'),
});
```

### A Note about Canaries

This canary construct is a representation of AWS Cloudwatch Synthetic Canaries. There is such a thing as **canary deployment** available in AWS Lambda, AWS CodeDeploy, etc. AWS Cloudwatch Synthetic Canaries are not that and a different resource entirely.

### Canary Properties

Here is how the Canary Cloudformation properties match onto the CDK Canary construct.

#### Cloudformation Required Properties: 

`artifactS3Location`: Specify the s3 bucket location that the canary will store its data in. Optional for the Canary construct which defaults to creating a new s3 bucket for you.
 
`code` : Specify the canary script, either as an object with `handler` and `script` properties or `handler`, `s3bucket`, `s3key`, and `s3version?`. The Canary construct splits this property into two required properties: `handler` and `code`. As such, it closely resembles [properties](https://github.com/aws/aws-cdk/tree/3256a41787c365a67b01bee193bd75e48645f7a0/packages/@aws-cdk/aws-lambda) in the Lambda constructor. 
	
 - It is important to point out that, unlike Lambda, the canary `handler` must be a string that ends in `.handler`.

`executionRoleArn`: Specify the arn of the role that the canary will use to run its script. The Canary construct replaces this property in favor of an optional `role: iam.IRole`. This is convention amongst other constructs like Lambda. If left unspecified, the construct will create a IAM role with the necessary permissions to perform the canary. If specified, it must have a principal of `lambda.amazonaws.com` and have these permissions attached:
-   `s3:PutObject`
-   `s3:GetBucketLocation`
-   `s3:ListAllMyBuckets`
-   `cloudwatch:PutMetricData`
-   `logs:CreateLogGroup`
-   `logs:CreateLogStream`
-   `logs:PutLogEvents` 

`name` : The name of the canary. Must be lowercase and have no spaces. Redefined as `canaryName` in the Canary construct.

`runConfig` : The construct that contains imput about each canary run. The only property is `timeoutInSeconds`. The Canary construct replaces `runConfig` with the optional`timeout` property that defaults to the `rate` of the canary.

`runtimeVersion`: Specify the runtime version of the canary. The only valid runtime is `syn-1.0`. The Canary construct avoids future proofing and does not expose this property at all -- `syn-1.0` is hardcoded as the `runtimeVersion`. If more runtime versions are possible in the future, this can be changed to an enum-like property.

`schedule` : Specify how often the canary is to run and when the runs should stop. Type is a schedule object with two properties, `durationInSeconds` and `expression`. The Canary construct just exposes both as optional properties:
-  `lifetime` replaces `durationInSeconds` and defaults to `0` (canary runs forever until you stop it).
- `rate` replaces `expression` and defaults to `rate(5 minutes)`. 

`startCanaryAfterCreation`: Specify whether the canary should start running immediately after creation or if there must be user intervention through the AWS CLI or console to start the canary. The Canary construct has a `enableCanary` property that defaults to `true`, in an effort to avoid user intervention.

#### Cloudformation Optional Properties

`successRetentionPeriod`: Specify how many days the canary should store data on successful runs in s3. It is a property in the Canary construct as well. Defaults to 31 days.

`failureRetentionPeriod`: Specify how many days the canary should store data on failed runs in s3. It is a property in the Canary construct as well. Defaults to 31 days.

`tags`: Specify a list of key value pairs that are associated with the canary. As is CDK convention, the Canary construct ignores this property in favor of the `Tag` class.

`vpcConfig`: If the canary tests endpoints inside of a VPC, then this structure contains information on where to find that VPC. The properties of `vpcConfig` are `securityGroupIds`, `subnetIds`, and `vpcId`. The Canary construct has a property `vpc` that allows for this information to be specified similar to the Lambda construct.

### Canary Code

You can use three different static `Code` methods to specify the script that the canary should run. 

#### From Inline 

```ts
import * as synth from '@aws-cdk/aws-synthetics';

const canary = new synth.Canary(this,'my_test',{
	handler: 'index.handler',
	canaryName: 'mycanary',
	code: synth.Code.fromInline('your code here'),
});
```

#### From Asset

```ts
import * as synth from '@aws-cdk/aws-synthetics';

// 'index.js' is in the directory 'canary-handler'
const canary = new synth.Canary(this,'my_test',{
	handler: 'index.handler',
	canaryName: 'mycanary',
	code: synth.Code.fromAsset('./canary-handler'),
});
```

#### From S3 Bucket

```ts
import * as synth from '@aws-cdk/aws-synthetics';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';

// Create bucket
const bucket = new s3.Bucket(this, 'canarybucket');

// Upload assets from the canary directory to the bucket
new s3Deployment.BucketDeployment(this, 'Deployment', {
	sources: [s3Deployment.Source.asset('./canary')],
	destinationBucket: bucket,
});

// 'index.js' is the file name and key in s3
const canary = new synth.Canary(this,'my_test',{
	handler: 'index.handler',
	canaryName: 'mycanary',
	code: synth.Code.fromBucket(bucket,'index.js'),
});
```

### Canary Metrics

You can add metrics to your canary through the suite of `canary.metric()` APIs. They are: 

- `canary.metric(metricName, props?)`
- `canary.metricDuration(metricName, props?)`
- `canary.metricSucessPercent(metricName, props?)`
- `canary.metricFailed(metricName, props?)`

```ts
import * as synth from '@aws-cdk/aws-synthetics';

// 'index.js' is in the directory 'canary-handler'
const canary = new synth.Canary(this,'my_test',{
	handler: 'index.handler',
	canaryName: 'mycanary',
	code: synth.Code.fromAsset('./canary-handler'),
});

// define a metric on a canary
canary.metricSuccessPercent();
```

In addition, you can add metrics to all canaries at once through static `metricAll()` APIs: They are:

- `Canary.metricAllSuccessPercent(props?):`
- `Canary.metricAllDuration(props?)`

```ts
import * as synth from '@aws-cdk/aws-synthetics';

synth.Canary.metricAllSuccessPercent();
```

### Adding Alarms to the Canary

You can add an alarm to your canary by using the `canary.createAlarm()` API:

```ts
import * as synth from '@aws-cdk/aws-synthetics';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';

const canary = new synth.Canary(this,'my_test',{
	handler: 'index.handler',
	canaryName: 'mycanary',
	code: synth.Code.fromInline('your code here'),
});

canary.createAlarm('CanaryAlarm', {
	metric: canary.metricSuccess(),
	evaluationPeriods: 2,
	threshold: 90,
	comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
});
```