## Amazon CloudWatch Synthetics Construct Library

<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

Amazon CloudWatch Synthetics allow you to monitor your application by generating **synthetic** traffic. The traffic is produced by a **canary**. A canary is a configurable script that runs on a schedule. You configure the canary script to follow the same routes and perform the same actions as a customer, which allows you to continually verify your customer experience even when you don't have any customer traffic on your applications.

## Canary

To illustrate how to use a canary, assume your application defines the following endpoint:

```bash
curl https://api.awsomesite.com/user/books/topbook/
The Hitchhikers Guide to the Galaxy

```

The below code defines a canary that will hit the `books/topbook` endpoint every 5 minutes:

> **Not Implemented:** the `test` property will be a part of Milestone 2.

```ts
const canary = new Canary(this, 'MyCanary', {
  name: 'mycanary'
  frequency: Duration.minutes(5),
  test: synth.Test.custom({
    code: synth.Code.fromInline(`const https = require('https');
      var synthetics = require('Synthetics');
      const log = require('SyntheticsLogger');
  
      exports.handler = async function () {
        const requestOptions = {"hostname":"api.awsomesite.com","method":"","path":"/user/books/topbook/","port":443}
        let req = https.request(requestOptions);
        req.on('response', (res) => {
          log.info()
        });
      }`),
    handler: 'index.handler',
  }),
});
```

The canary will automatically produce a CloudWatch Dashboard:

![UI Screenshot](images/ui-screenshot.png)

### Canary Test Property

The `test` property represents the test that the canary executes. It accepts a type `Test`, which has as parameters the properties required to generate the test script.

> **Not Implemented:** `Test.heartBeat()` is a part of Milestone 3

Testing URL heartbeat:

```ts
const canary = new Canary(this, 'MyCanary', {
  test: Test.heartBeat('https://myawsomesite.com'),
  // ...
});
```

> **Not Implemented:** `Test.apiEndpoint()` is a part of Milestone 4

Testing a specific API:

```ts
const canary = new Canary(this, 'MyCanary', {
  test: Test.apiEndpoint('https://myawsomesite.com/endpoint', {
    method: 'GET'|'POST',
    headers: Map<headerName, headerValue>,
    data: string,
  }),
  // ...
});
```

> **Not Implemented:** `Test.brokenLink()` is a part of Milestone 4

Testing broken links:

```ts
const canary = new Canary(this, 'MyCanary', {
  test: Test.brokenLink('https://myawsomesite.com', {
    maxLinks: number,
  }),
  // ...
});
```

> **Not Implemented:** `Test.custom` is a part of Milestone 2

Users will be able to supply their own code by using `Test.custom()`, which exposes the `code` property similarly to the lambda construct.

```ts
const canary = new Canary(this, 'MyCanary', {
  test: Test.custom({
    code: Code.fromAsset()|Code.fromBucket()|Code.fromInline(),
    handler: 'index.handler' // required by the resource 
  }),
  // ...
});
```

### Alarms

> **Not Implemented:** metric APIs will be a part of Milestone 3

You can configure a CloudWatch Alarm on canary metrics. Metrics are emitted by CloudWatch automatically and can be accessed by the following APIs:
- `canary.metricSuccessPercent()`
- `canary.metricDuration()`
- `canary.metricFailed()`

```ts

new cloudwatch.Alarm(this, 'CanaryAlarm', {
  metric: canary.metricSuccessPercent(),
  evaluationPeriods: 2,
  threshold: 90,
  comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
});
```

### Appendix: Canary CFN Property Implementation 

> **Implemented:** Milestone 1

Below is a full list of the Canary CFN resource properties and their implementation in the L2 construct.

`artifactS3Location`:

  - **Description:** An s3 bucket url.

  - **Proposed L2 property:** Optional. Accept `IBucket` ; Default, create a bucket.  

`executionRoleArn`: 

  - **Description:** The role the canary assumes to make a run.

  - **Proposed L2 property:** Optional. Rebranded into `role?: iam.IRole` ; Default, create a role.

`failureRetentionPeriod`:

  - **Description:** How long the canary stores failed runs in the s3 bucket, defaults to 31 days.

  - **Proposed L2 property:** Optional. Accept `Duration.Days()`

`successRetentionPeriod`: 

  - **Description:** How long the canary stores successful runs in the s3 bucket, defaults to 31 days.

  - **Proposed L2 property:** Optional. Accept `Duration.Days()`

`name`: 

  - **Description:** The name of the canary. The canary resource physical name,  Cloudformation does not generate a name for the canary.

  - **Proposed L2 property:** Optional. Default, generate a name.

`runtimeVersion`: 

  - **Description:** The runtime version, of which there is only one: syn-1.0.

  - **Proposed L2 property:** Do not expose property, the L2 will always use syn-1.0.

`runConfig`:

  - **Description:** Contains information for each canary run.

  - **Proposed L2 property:** Optional. Renamed as `timeout` and `memorySize`; Default, same as `frequency`.

`startCanaryAfterCreation`:

  - **Description:** Whether or not the canary should start running after creation.

  - **Proposed L2 property:** Optional. Renamed enableCanary; Default, `true`.

`vpcConfig`: 

  - **Description:** If the canary tests an endpoint inside a VPC, the VPC configuration.

  - **Proposed L2 property:** Optional. Accept: `IVpc`

`schedule`:

  - **Description** Contains timing information for the canary as a whole.

  - **Proposed L2 property:** Optional. Renamed as `frequency` and `timeToLive`; Default, `frequency` is every 5 minutes, `timeToLive` is forever.

`code`: discussed above in `Test`


### Future Work + Notes

- Deleting a canary does not actually delete the underlying resources, i.e. the lambda function/layers, s3 buckets where canary results are stored, etc.

