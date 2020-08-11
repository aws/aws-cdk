## Amazon CloudWatch Synthetics Construct Library

<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

Amazon CloudWatch Synthetics allow you to monitor your application by generating **synthetic** traffic. The traffic is produced by a **canary**: a configurable script that runs on a schedule. You configure the canary script to follow the same routes and perform the same actions as a user, which allows you to continually verify your user experience even when you don't have any traffic on your applications.

## Canary

To illustrate how to use a canary, assume your application defines the following endpoint:

```bash
% curl "https://api.example.com/user/books/topbook/"
The Hitchhikers Guide to the Galaxy

```

The below code defines a canary that will hit the `books/topbook` endpoint every 5 minutes: 

```ts
import * as synthetics from '@aws-cdk/aws-synthetics';

const canary = new synthetics.Canary(this, 'MyCanary', {
  schedule: synthetics.Schedule.rate(Duration.minutes(5)),
  test: Test.custom({
    code: Code.fromAsset(path.join(__dirname, 'canary'))),
    handler: 'index.handler',
  }),
});
```

The following is an example of a `canary/index.js` which exports the `handler` function:

```
const https = require('https');
var synthetics = require('Synthetics');
const log = require('SyntheticsLogger');

exports.handler = async function () {
  const requestOptions = {"hostname":"api.example.com","method":"","path":"/user/books/topbook/","port":443}
  let req = https.request(requestOptions);
  req.on('response', (res) => {
    log.info()
  });
}
```


The canary will automatically produce a CloudWatch Dashboard:

![UI Screenshot](images/ui-screenshot.png)

### Configuring the Canary Script 

To configure the script the canary executes, use the `test` property. The `test` property exposes `code` and `handler` properties -- both are required by Synthetics to create a lambda function on your behalf. 

The `synthetics.Code` class exposes static methods to bundle your code artifacts: 

  - `code.fromInline(code)` - specify an inline script.
  - `code.fromAsset(path)` - specify a .zip file or a directory in the local filesystem which will be zipped and uploaded to S3 on deployment. See note for directory structure.
  - `code.fromBucket(bucket, key[, objectVersion])` - specify an S3 object that contains the .zip file of your runtime code. See note for directory structure.

> **Note:** For `code.fromAsset()` and `code.fromBucket()`, the canary resource requires the following folder structure: `nodejs/node_modules/<handlerFile>`. 

To supply the code from your local filesystem:

```ts
const canary = new Canary(this, 'MyCanary', {
  test: Test.custom({
    code: Code.fromAsset(path.join(__dirname, 'canary'))),
    handler: 'index.handler', // must end with '.handler'
  }),
});
```

### Alarms

You can configure a CloudWatch Alarm on canary metrics. Metrics are emitted by CloudWatch automatically and can be accessed by the following APIs:
- `canary.metricSuccessPercent()` - percentage of successful canary runs over a given time
- `canary.metricDuration()` - how much time each canary run takes, in seconds.
- `canary.metricFailed()` - number of failed canary runs over a given time

Create an alarm that tracks the canary metric:

```ts
new cloudwatch.Alarm(this, 'CanaryAlarm', {
  metric: canary.metricSuccessPercent(),
  evaluationPeriods: 2,
  threshold: 90,
  comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
});
```
### Future Work

- Add blueprints to the `Test` class.
- Automatically add `nodejs/node_modules` prefix to the asset file before zipping to S3.
- Add support for the `runConfig` property.
