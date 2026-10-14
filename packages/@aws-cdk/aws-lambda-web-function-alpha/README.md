# AWS Lambda Web Functions

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

Lambda Web Functions run a standard HTTP server on Lambda. Your application listens on the
host and port that Lambda provides in the `AWS_LAMBDA_HTTP_ENDPOINT` environment variable, so it
does not need to be rewritten as an event handler.

This module provides:

* `WebFunction`: the function, its revision (code and configuration) and its execution role.
* `WebFunctionEndpoint`: an HTTPS endpoint that routes traffic to the revision of a web function.
* `WebFunctionCode`: the source of the application, from a local directory or an S3 object.

## Web Function

```ts
import * as path from 'path';
import { Duration } from 'aws-cdk-lib';
import { WebFunction, WebFunctionCode, WebFunctionEndpoint } from '@aws-cdk/aws-lambda-web-function-alpha';

const fn = new WebFunction(this, 'WebFunction', {
  code: WebFunctionCode.fromAsset(path.join(__dirname, 'app')),
  timeout: Duration.seconds(30),
  environment: { NODE_ENV: 'production' },
});

new WebFunctionEndpoint(this, 'Endpoint', {
  webFunction: fn,
});
```

The runtime defaults to `nodejs24.x`. The application must bind to the host and port in
`AWS_LAMBDA_HTTP_ENDPOINT`:

```js
const [host, port] = process.env.AWS_LAMBDA_HTTP_ENDPOINT.split(':');
app.listen(Number(port), host);
```

### Code

* `WebFunctionCode.fromAsset(path)` uploads a local directory and deploys it as the code.
* `WebFunctionCode.fromBucket(bucket, key, versionId?)` uses an existing S3 object. The bucket must have
  versioning enabled, and `lambda.amazonaws.com` must be able to read the object
  (`s3:GetObject` and `s3:GetObjectVersion`).

#### Workaround: asset code is copied to a bucket the service can read

The Web Functions service cannot read assets in the CDK bootstrap bucket. Deploying an asset
with the default bootstrap fails with `lambda service principal lambda.amazonaws.com does not have
s3:GetObject ... on s3://cdk-hnb659fds-assets-...`. Rerunning bootstrap does not fix this, because
the current bootstrap template does not grant that access.

Until bootstrap grants the access, `fromAsset` works around it. It:

1. Stages the directory as a CDK asset, as usual.
2. Creates a versioned, private S3 bucket in the web function's scope. The bucket policy lets
   `lambda.amazonaws.com` read objects, only for requests from the same account.
3. Copies the asset into that bucket with a custom resource, and uses the version ID of the copy.

The bucket is destroyed with the stack, and its objects are removed with it. Each web function
gets its own bucket.

**To fix this:** update the CDK bootstrap template so the bootstrap bucket grants read access to
`lambda.amazonaws.com`, then move the code to the bootstrap bucket and remove the workaround.
Until then, `fromAsset` creates one extra bucket, a copy function and a custom resource per web
function.

### Execution role

If you don't pass `role`, the construct creates a role that Lambda can assume, with the
`AWSLambdaBasicExecutionRole` managed policy so the function can write to CloudWatch Logs.

## Endpoint

By default an endpoint is `HomeRegion`, uses `IamAuth`, and sends 100% of traffic to the
revision of its web function:

```ts
import * as s3 from 'aws-cdk-lib/aws-s3';
import { WebFunction, WebFunctionAuthType, WebFunctionCode, WebFunctionEndpoint, WebFunctionEndpointType } from '@aws-cdk/aws-lambda-web-function-alpha';

const bucket = s3.Bucket.fromBucketName(this, 'Bucket', 'my-code-bucket');
const fn = new WebFunction(this, 'WebFunction', {
  code: WebFunctionCode.fromBucket(bucket, 'app.zip'),
});

new WebFunctionEndpoint(this, 'Endpoint', {
  webFunction: fn,
  endpointType: WebFunctionEndpointType.MULTI_REGION,
  authType: WebFunctionAuthType.APPLICATION_MANAGED,
  regions: ['us-east-1', 'eu-west-1'],
  maxEnvironments: 20,
  rateLimit: 500,
});
```

To split traffic between two revisions, pass `revisionWeights`. Use either one entry with a
weight of 100, or two entries whose weights sum to 100:

```ts
import * as s3 from 'aws-cdk-lib/aws-s3';
import { WebFunction, WebFunctionCode, WebFunctionEndpoint } from '@aws-cdk/aws-lambda-web-function-alpha';

const bucket = s3.Bucket.fromBucketName(this, 'Bucket', 'my-code-bucket');
const fn = new WebFunction(this, 'WebFunction', {
  code: WebFunctionCode.fromBucket(bucket, 'app.zip'),
});

new WebFunctionEndpoint(this, 'Canary', {
  webFunction: fn,
  revisionWeights: [
    { revisionId: 'previous-revision-id', weight: 90 },
    { revisionId: fn.revisionId, weight: 10 },
  ],
});
```

## Invoke permissions

An `IamAuth` endpoint is invoked with the `lambda:InvokeWebFunctionEndpoint` permission. Use
`grants.invoke()` to grant it to a principal in the same account. The grant goes into the
principal's identity policy:

```ts
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { WebFunction, WebFunctionCode, WebFunctionEndpoint } from '@aws-cdk/aws-lambda-web-function-alpha';

const bucket = s3.Bucket.fromBucketName(this, 'Bucket', 'my-code-bucket');
const fn = new WebFunction(this, 'WebFunction', {
  code: WebFunctionCode.fromBucket(bucket, 'app.zip'),
});
const endpoint = new WebFunctionEndpoint(this, 'Endpoint', { webFunction: fn });

const callerRole = new iam.Role(this, 'Caller', {
  assumedBy: new iam.AccountRootPrincipal(),
});
endpoint.grants.invoke(callerRole);
```

A callerRole in another account also needs a resource-based policy on the web function. This module
does not manage resource-based policies yet.

## Importing existing resources

A web function or endpoint created elsewhere can be referenced by its attributes:

```ts
import * as iam from 'aws-cdk-lib/aws-iam';
import { WebFunction, WebFunctionEndpoint } from '@aws-cdk/aws-lambda-web-function-alpha';

const callerRole = new iam.Role(this, 'Caller', {
  assumedBy: new iam.AccountRootPrincipal(),
});

const fn = WebFunction.fromWebFunctionAttributes(this, 'ImportedFunction', {
  functionArn: 'arn:aws:lambda:us-east-1:123456789012:web-function/existing-fn',
  functionName: 'existing-fn',
  revisionId: 'revision-id',
});

const endpoint = WebFunctionEndpoint.fromWebFunctionEndpointAttributes(this, 'ImportedEndpoint', {
  endpointArn: 'arn:aws:lambda:us-east-1:123456789012:web-function/existing-fn/endpoint/prod',
  endpointName: 'prod',
});
endpoint.grants.invoke(callerRole);
```

## Escape hatches

The underlying L1 resources are available as `cfnWebFunction`, `cfnRevision` and `cfnEndpoint`.

## Not yet supported

* Resource-based policies on web functions, which cross-account invoke and CloudFront origin
  access control require.
* CloudFront origin and origin access control configuration. This is documented in the Lambda
  Developer Guide and can be configured through the escape hatches.
