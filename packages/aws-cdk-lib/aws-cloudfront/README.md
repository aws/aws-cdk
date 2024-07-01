# Amazon CloudFront Construct Library


Amazon CloudFront is a web service that speeds up distribution of your static and dynamic web content, such as .html, .css, .js, and image files, to
your users. CloudFront delivers your content through a worldwide network of data centers called edge locations. When a user requests content that
you're serving with CloudFront, the user is routed to the edge location that provides the lowest latency, so that content is delivered with the best
possible performance.

## Distribution API

The `Distribution` API is currently being built to replace the existing `CloudFrontWebDistribution` API. The `Distribution` API is optimized for the
most common use cases of CloudFront distributions (e.g., single origin and behavior, few customizations) while still providing the ability for more
advanced use cases. The API focuses on simplicity for the common use cases, and convenience methods for creating the behaviors and origins necessary
for more complex use cases.

### Creating a distribution

CloudFront distributions deliver your content from one or more origins; an origin is the location where you store the original version of your
content. Origins can be created from S3 buckets or a custom origin (HTTP server). Constructs to define origins are in the `aws-cdk-lib/aws-cloudfront-origins` module.

Each distribution has a default behavior which applies to all requests to that distribution, and routes requests to a primary origin.
Additional behaviors may be specified for an origin with a given URL path pattern. Behaviors allow routing with multiple origins,
controlling which HTTP methods to support, whether to require users to use HTTPS, and what query strings or cookies to forward to your origin,
among other settings.

#### From an S3 Bucket

An S3 bucket can be added as an origin. If the bucket is configured as a website endpoint, the distribution can use S3 redirects and S3 custom error
documents.

```ts
// Creates a distribution from an S3 bucket.
const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.S3Origin(myBucket) },
});
```

The above will treat the bucket differently based on if `IBucket.isWebsite` is set or not. If the bucket is configured as a website, the bucket is
treated as an HTTP origin, and the built-in S3 redirects and error pages can be used. Otherwise, the bucket is handled as a bucket origin and
CloudFront's redirect and error handling will be used. In the latter case, the Origin will create an origin access identity and grant it access to the
underlying bucket. This can be used in conjunction with a bucket that is not public to require that your users access your content using CloudFront
URLs and not S3 URLs directly.

#### ELBv2 Load Balancer

An Elastic Load Balancing (ELB) v2 load balancer may be used as an origin. In order for a load balancer to serve as an origin, it must be publicly
accessible (`internetFacing` is true). Both Application and Network load balancers are supported.

```ts
// Creates a distribution from an ELBv2 load balancer
declare const vpc: ec2.Vpc;
// Create an application load balancer in a VPC. 'internetFacing' must be 'true'
// for CloudFront to access the load balancer and use it as an origin.
const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
  vpc,
  internetFacing: true,
});
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.LoadBalancerV2Origin(lb) },
});
```

#### From an HTTP endpoint

Origins can also be created from any other HTTP endpoint, given the domain name, and optionally, other origin properties.

```ts
// Creates a distribution from an HTTP endpoint
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.HttpOrigin('www.example.com') },
});
```

### Domain Names and Certificates

When you create a distribution, CloudFront assigns a domain name for the distribution, for example: `d111111abcdef8.cloudfront.net`; this value can
be retrieved from `distribution.distributionDomainName`. CloudFront distributions use a default certificate (`*.cloudfront.net`) to support HTTPS by
default. If you want to use your own domain name, such as `www.example.com`, you must associate a certificate with your distribution that contains
your domain name, and provide one (or more) domain names from the certificate for the distribution.

The certificate must be present in the AWS Certificate Manager (ACM) service in the US East (N. Virginia) region; the certificate
may either be created by ACM, or created elsewhere and imported into ACM. When a certificate is used, the distribution will support HTTPS connections
from SNI only and a minimum protocol version of TLSv1.2_2021 if the `@aws-cdk/aws-cloudfront:defaultSecurityPolicyTLSv1.2_2021` feature flag is set, and TLSv1.2_2019 otherwise.

```ts
// To use your own domain name in a Distribution, you must associate a certificate
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

declare const hostedZone: route53.HostedZone;
const myCertificate = new acm.Certificate(this, 'mySiteCert', {
  domainName: 'www.example.com',
  validation: acm.CertificateValidation.fromDns(hostedZone),
});

declare const myBucket: s3.Bucket;
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.S3Origin(myBucket) },
  domainNames: ['www.example.com'],
  certificate: myCertificate,
});
```

However, you can customize the minimum protocol version for the certificate while creating the distribution using `minimumProtocolVersion` property.

```ts
// Create a Distribution with a custom domain name and a minimum protocol version.
declare const myBucket: s3.Bucket;
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.S3Origin(myBucket) },
  domainNames: ['www.example.com'],
  minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2016,
  sslSupportMethod: cloudfront.SSLMethod.SNI,
});
```

#### Cross Region Certificates

> **This feature is currently experimental**

You can enable the Stack property `crossRegionReferences`
in order to access resources in a different stack _and_ region. With this feature flag
enabled it is possible to do something like creating a CloudFront distribution in `us-east-2` and
an ACM certificate in `us-east-1`.

```ts
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

declare const app: App;

const stack1 = new Stack(app, 'Stack1', {
  env: {
    region: 'us-east-1',
  },
  crossRegionReferences: true,
});
const cert = new acm.Certificate(stack1, 'Cert', {
  domainName: '*.example.com',
  validation: acm.CertificateValidation.fromDns(route53.PublicHostedZone.fromHostedZoneId(stack1, 'Zone', 'Z0329774B51CGXTDQV3X')),
});

const stack2 = new Stack(app, 'Stack2', {
  env: {
    region: 'us-east-2',
  },
  crossRegionReferences: true,
});
new cloudfront.Distribution(stack2, 'Distribution', {
  defaultBehavior: {
    origin: new origins.HttpOrigin('example.com'),
  },
  domainNames: ['dev.example.com'],
  certificate: cert,
});
```

### Multiple Behaviors & Origins

Each distribution has a default behavior which applies to all requests to that distribution; additional behaviors may be specified for a
given URL path pattern. Behaviors allow routing with multiple origins, controlling which HTTP methods to support, whether to require users to
use HTTPS, and what query strings or cookies to forward to your origin, among others.

The properties of the default behavior can be adjusted as part of the distribution creation. The following example shows configuring the HTTP
methods and viewer protocol policy of the cache.

```ts
// Create a Distribution with configured HTTP methods and viewer protocol policy of the cache.
declare const myBucket: s3.Bucket;
const myWebDistribution = new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: {
    origin: new origins.S3Origin(myBucket),
    allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  },
});
```

Additional behaviors can be specified at creation, or added after the initial creation. Each additional behavior is associated with an origin,
and enable customization for a specific set of resources based on a URL path pattern. For example, we can add a behavior to `myWebDistribution` to
override the default viewer protocol policy for all of the images.

```ts
// Add a behavior to a Distribution after initial creation.
declare const myBucket: s3.Bucket;
declare const myWebDistribution: cloudfront.Distribution;
myWebDistribution.addBehavior('/images/*.jpg', new origins.S3Origin(myBucket), {
  viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
});
```

These behaviors can also be specified at distribution creation time.

```ts
// Create a Distribution with additional behaviors at creation time.
declare const myBucket: s3.Bucket;
const bucketOrigin = new origins.S3Origin(myBucket);
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: {
    origin: bucketOrigin,
    allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  },
  additionalBehaviors: {
    '/images/*.jpg': {
      origin: bucketOrigin,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
  },
});
```

### Customizing Cache Keys and TTLs with Cache Policies

You can use a cache policy to improve your cache hit ratio by controlling the values (URL query strings, HTTP headers, and cookies)
that are included in the cache key, and/or adjusting how long items remain in the cache via the time-to-live (TTL) settings.
CloudFront provides some predefined cache policies, known as managed policies, for common use cases. You can use these managed policies,
or you can create your own cache policy that’s specific to your needs.
See https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html for more details.

```ts
// Using an existing cache policy for a Distribution
declare const bucketOrigin: origins.S3Origin;
new cloudfront.Distribution(this, 'myDistManagedPolicy', {
  defaultBehavior: {
    origin: bucketOrigin,
    cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
  },
});
```

```ts
// Creating a custom cache policy for a Distribution -- all parameters optional
declare const bucketOrigin: origins.S3Origin;
const myCachePolicy = new cloudfront.CachePolicy(this, 'myCachePolicy', {
  cachePolicyName: 'MyPolicy',
  comment: 'A default policy',
  defaultTtl: Duration.days(2),
  minTtl: Duration.minutes(1),
  maxTtl: Duration.days(10),
  cookieBehavior: cloudfront.CacheCookieBehavior.all(),
  headerBehavior: cloudfront.CacheHeaderBehavior.allowList('X-CustomHeader'),
  queryStringBehavior: cloudfront.CacheQueryStringBehavior.denyList('username'),
  enableAcceptEncodingGzip: true,
  enableAcceptEncodingBrotli: true,
});
new cloudfront.Distribution(this, 'myDistCustomPolicy', {
  defaultBehavior: {
    origin: bucketOrigin,
    cachePolicy: myCachePolicy,
  },
});
```

### Customizing Origin Requests with Origin Request Policies

When CloudFront makes a request to an origin, the URL path, request body (if present), and a few standard headers are included.
Other information from the viewer request, such as URL query strings, HTTP headers, and cookies, is not included in the origin request by default.
You can use an origin request policy to control the information that’s included in an origin request.
CloudFront provides some predefined origin request policies, known as managed policies, for common use cases. You can use these managed policies,
or you can create your own origin request policy that’s specific to your needs.
See https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html for more details.

```ts
// Using an existing origin request policy for a Distribution
declare const bucketOrigin: origins.S3Origin;
new cloudfront.Distribution(this, 'myDistManagedPolicy', {
  defaultBehavior: {
    origin: bucketOrigin,
    originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
  },
});
```

```ts
// Creating a custom origin request policy for a Distribution -- all parameters optional
declare const bucketOrigin: origins.S3Origin;
const myOriginRequestPolicy = new cloudfront.OriginRequestPolicy(this, 'OriginRequestPolicy', {
  originRequestPolicyName: 'MyPolicy',
  comment: 'A default policy',
  cookieBehavior: cloudfront.OriginRequestCookieBehavior.none(),
  headerBehavior: cloudfront.OriginRequestHeaderBehavior.all('CloudFront-Is-Android-Viewer'),
  queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.allowList('username'),
});

new cloudfront.Distribution(this, 'myDistCustomPolicy', {
  defaultBehavior: {
    origin: bucketOrigin,
    originRequestPolicy: myOriginRequestPolicy,
  },
});
```

### Customizing Response Headers with Response Headers Policies

You can configure CloudFront to add one or more HTTP headers to the responses that it sends to viewers (web browsers or other clients), without making any changes to the origin or writing any code.
To specify the headers that CloudFront adds to HTTP responses, you use a response headers policy. CloudFront adds the headers regardless of whether it serves the object from the cache or has to retrieve the object from the origin. If the origin response includes one or more of the headers that’s in a response headers policy, the policy can specify whether CloudFront uses the header it received from the origin or overwrites it with the one in the policy.
See https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/adding-response-headers.html

```ts
// Using an existing managed response headers policy
declare const bucketOrigin: origins.S3Origin;
new cloudfront.Distribution(this, 'myDistManagedPolicy', {
  defaultBehavior: {
    origin: bucketOrigin,
    responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
  },
});

// Creating a custom response headers policy -- all parameters optional
const myResponseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(this, 'ResponseHeadersPolicy', {
  responseHeadersPolicyName: 'MyPolicy',
  comment: 'A default policy',
  corsBehavior: {
    accessControlAllowCredentials: false,
    accessControlAllowHeaders: ['X-Custom-Header-1', 'X-Custom-Header-2'],
    accessControlAllowMethods: ['GET', 'POST'],
    accessControlAllowOrigins: ['*'],
    accessControlExposeHeaders: ['X-Custom-Header-1', 'X-Custom-Header-2'],
    accessControlMaxAge: Duration.seconds(600),
    originOverride: true,
  },
  customHeadersBehavior: {
    customHeaders: [
      { header: 'X-Amz-Date', value: 'some-value', override: true },
      { header: 'X-Amz-Security-Token', value: 'some-value', override: false },
    ],
  },
  securityHeadersBehavior: {
    contentSecurityPolicy: { contentSecurityPolicy: 'default-src https:;', override: true },
    contentTypeOptions: { override: true },
    frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
    referrerPolicy: { referrerPolicy: cloudfront.HeadersReferrerPolicy.NO_REFERRER, override: true },
    strictTransportSecurity: { accessControlMaxAge: Duration.seconds(600), includeSubdomains: true, override: true },
    xssProtection: { protection: true, modeBlock: true, reportUri: 'https://example.com/csp-report', override: true },
  },
  removeHeaders: ['Server'],
  serverTimingSamplingRate: 50,
});
new cloudfront.Distribution(this, 'myDistCustomPolicy', {
  defaultBehavior: {
    origin: bucketOrigin,
    responseHeadersPolicy: myResponseHeadersPolicy,
  },
});
```

### Validating signed URLs or signed cookies with Trusted Key Groups

CloudFront Distribution supports validating signed URLs or signed cookies using key groups.
When a cache behavior contains trusted key groups, CloudFront requires signed URLs or signed
cookies for all requests that match the cache behavior.

```ts
// Validating signed URLs or signed cookies with Trusted Key Groups

// public key in PEM format
declare const publicKey: string;
const pubKey = new cloudfront.PublicKey(this, 'MyPubKey', {
  encodedKey: publicKey,
});

const keyGroup = new cloudfront.KeyGroup(this, 'MyKeyGroup', {
  items: [
    pubKey,
  ],
});

new cloudfront.Distribution(this, 'Dist', {
  defaultBehavior: {
    origin: new origins.HttpOrigin('www.example.com'),
    trustedKeyGroups: [
      keyGroup,
    ],
  },
});
```

### Lambda@Edge

Lambda@Edge is an extension of AWS Lambda, a compute service that lets you execute
functions that customize the content that CloudFront delivers. You can author Node.js
or Python functions in the US East (N. Virginia) region, and then execute them in AWS
locations globally that are closer to the viewer, without provisioning or managing servers.
Lambda@Edge functions are associated with a specific behavior and event type. Lambda@Edge
can be used to rewrite URLs, alter responses based on headers or cookies, or authorize
requests based on headers or authorization tokens.

The following shows a Lambda@Edge function added to the default behavior and triggered
on every request:

```ts
// A Lambda@Edge function added to default behavior of a Distribution
// and triggered on every request
const myFunc = new cloudfront.experimental.EdgeFunction(this, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
});

declare const myBucket: s3.Bucket;
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: {
    origin: new origins.S3Origin(myBucket),
    edgeLambdas: [
      {
        functionVersion: myFunc.currentVersion,
        eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
      }
    ],
  },
});
```

> **Note:** Lambda@Edge functions must be created in the `us-east-1` region, regardless of the region of the CloudFront distribution and stack.
> To make it easier to request functions for Lambda@Edge, the `EdgeFunction` construct can be used.
> The `EdgeFunction` construct will automatically request a function in `us-east-1`, regardless of the region of the current stack.
> `EdgeFunction` has the same interface as `Function` and can be created and used interchangeably.
> Please note that using `EdgeFunction` requires that the `us-east-1` region has been bootstrapped.
> See https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html for more about bootstrapping regions.

If the stack is in `us-east-1`, a "normal" `lambda.Function` can be used instead of an `EdgeFunction`.

```ts
// Using a lambda Function instead of an EdgeFunction for stacks in `us-east-`.
const myFunc = new lambda.Function(this, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
});
```

If the stack is not in `us-east-1`, and you need references from different applications on the same account,
you can also set a specific stack ID for each Lambda@Edge.

```ts
// Setting stackIds for EdgeFunctions that can be referenced from different applications
// on the same account.
const myFunc1 = new cloudfront.experimental.EdgeFunction(this, 'MyFunction1', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler1')),
  stackId: 'edge-lambda-stack-id-1',
});

const myFunc2 = new cloudfront.experimental.EdgeFunction(this, 'MyFunction2', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler2')),
  stackId: 'edge-lambda-stack-id-2',
});
```

Lambda@Edge functions can also be associated with additional behaviors,
either at or after Distribution creation time.

```ts
// Associating a Lambda@Edge function with additional behaviors.

declare const myFunc: cloudfront.experimental.EdgeFunction;
// assigning at Distribution creation
declare const myBucket: s3.Bucket;
const myOrigin = new origins.S3Origin(myBucket);
const myDistribution = new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: myOrigin },
  additionalBehaviors: {
    'images/*': {
      origin: myOrigin,
      edgeLambdas: [
        {
          functionVersion: myFunc.currentVersion,
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          includeBody: true, // Optional - defaults to false
        },
      ],
    },
  },
});

// assigning after creation
myDistribution.addBehavior('images/*', myOrigin, {
  edgeLambdas: [
    {
      functionVersion: myFunc.currentVersion,
      eventType: cloudfront.LambdaEdgeEventType.VIEWER_RESPONSE,
    },
  ],
});
```

Adding an existing Lambda@Edge function created in a different stack to a CloudFront distribution.

```ts
// Adding an existing Lambda@Edge function created in a different stack
// to a CloudFront distribution.
declare const s3Bucket: s3.Bucket;
const functionVersion = lambda.Version.fromVersionArn(this, 'Version', 'arn:aws:lambda:us-east-1:123456789012:function:functionName:1');

new cloudfront.Distribution(this, 'distro', {
  defaultBehavior: {
    origin: new origins.S3Origin(s3Bucket),
    edgeLambdas: [
      {
        functionVersion,
        eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
      },
    ],
  },
});
```

### CloudFront Function

You can also deploy CloudFront functions and add them to a CloudFront distribution.

```ts
// Add a cloudfront Function to a Distribution
const cfFunction = new cloudfront.Function(this, 'Function', {
  code: cloudfront.FunctionCode.fromInline('function handler(event) { return event.request }'),
  runtime: cloudfront.FunctionRuntime.JS_2_0,
});

declare const s3Bucket: s3.Bucket;
new cloudfront.Distribution(this, 'distro', {
  defaultBehavior: {
    origin: new origins.S3Origin(s3Bucket),
    functionAssociations: [{
      function: cfFunction,
      eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
    }],
  },
});
```

It will auto-generate the name of the function and deploy it to the `live` stage.

Additionally, you can load the function's code from a file using the `FunctionCode.fromFile()` method.

If you set `autoPublish` to false, the function will not be automatically published to the LIVE stage when it’s created.

```ts
new cloudfront.Function(this, 'Function', {
  code: cloudfront.FunctionCode.fromInline('function handler(event) { return event.request }'),
  runtime: cloudfront.FunctionRuntime.JS_2_0,
  autoPublish: false
});
```

### Key Value Store

A CloudFront Key Value Store can be created and optionally have data imported from a JSON file
by default.

To create an empty Key Value Store:

```ts
const store = new cloudfront.KeyValueStore(this, 'KeyValueStore');
```

To also include an initial set of values, the `source` property can be specified, either from a 
local file or an inline string. For the structure of this file, see [Creating a file of key value pairs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/kvs-with-functions-create-s3-kvp.html).

```ts
const storeAsset = new cloudfront.KeyValueStore(this, 'KeyValueStoreAsset', {
  keyValueStoreName: 'KeyValueStoreAsset',
  source: cloudfront.ImportSource.fromAsset('path-to-data.json'),
});

const storeInline = new cloudfront.KeyValueStore(this, 'KeyValueStoreInline', {
  keyValueStoreName: 'KeyValueStoreInline',
  source: cloudfront.ImportSource.fromInline(JSON.stringify({
    data: [
      {
        key: "key1",
        value: "value1",
      },
      {
        key: "key2",
        value: "value2",
      },
    ],
  })),
});
```

The Key Value Store can then be associated to a function using the `cloudfront-js-2.0` runtime
or newer:

```ts
const store = new cloudfront.KeyValueStore(this, 'KeyValueStore');
new cloudfront.Function(this, 'Function', {
  code: cloudfront.FunctionCode.fromInline('function handler(event) { return event.request }'),
  // Note that JS_2_0 must be used for Key Value Store support
  runtime: cloudfront.FunctionRuntime.JS_2_0,
  keyValueStore: store,
});
```

### Logging

You can configure CloudFront to create log files that contain detailed information about every user request that CloudFront receives.
The logs can go to either an existing bucket, or a bucket will be created for you.

```ts
// Configure logging for Distributions

// Simplest form - creates a new bucket and logs to it.
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.HttpOrigin('www.example.com') },
  enableLogging: true,
});

// You can optionally log to a specific bucket, configure whether cookies are logged, and give the log files a prefix.
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.HttpOrigin('www.example.com') },
  enableLogging: true, // Optional, this is implied if logBucket is specified
  logBucket: new s3.Bucket(this, 'LogBucket', {
    objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
  }),
  logFilePrefix: 'distribution-access-logs/',
  logIncludesCookies: true,
});
```

### CloudFront Distribution Metrics

You can view operational metrics about your CloudFront distributions.

#### Default CloudFront Distribution Metrics

The [following metrics are available by default](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/viewing-cloudfront-metrics.html#monitoring-console.distributions) for all CloudFront distributions:

- Total requests: The total number of viewer requests received by CloudFront for all HTTP methods and for both HTTP and HTTPS requests.
- Total bytes uploaded: The total number of bytes that viewers uploaded to your origin with CloudFront, using POST and PUT requests.
- Total bytes downloaded: The total number of bytes downloaded by viewers for GET, HEAD, and OPTIONS requests.
- Total error rate: The percentage of all viewer requests for which the response's HTTP status code was 4xx or 5xx.
- 4xx error rate: The percentage of all viewer requests for which the response's HTTP status code was 4xx.
- 5xx error rate: The percentage of all viewer requests for which the response's HTTP status code was 5xx.

```ts
const dist = new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.HttpOrigin('www.example.com') },
});

// Retrieving default distribution metrics
const requestsMetric = dist.metricRequests();
const bytesUploadedMetric = dist.metricBytesUploaded();
const bytesDownloadedMetric = dist.metricBytesDownloaded();
const totalErrorRateMetric = dist.metricTotalErrorRate();
const http4xxErrorRateMetric = dist.metric4xxErrorRate();
const http5xxErrorRateMetric = dist.metric5xxErrorRate();
```

#### Additional CloudFront Distribution Metrics

You can enable [additional CloudFront distribution metrics](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/viewing-cloudfront-metrics.html#monitoring-console.distributions-additional), which include the following metrics:

- 4xx and 5xx error rates: View 4xx and 5xx error rates by the specific HTTP status code, as a percentage of total requests.
- Origin latency: See the total time spent from when CloudFront receives a request to when it provides a response to the network (not the viewer), for responses that are served from the origin, not the CloudFront cache.
- Cache hit rate: View cache hits as a percentage of total cacheable requests, excluding errors.

```ts
const dist = new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.HttpOrigin('www.example.com') },
  publishAdditionalMetrics: true,
});

// Retrieving additional distribution metrics
const latencyMetric = dist.metricOriginLatency();
const cacheHitRateMetric = dist.metricCacheHitRate();
const http401ErrorRateMetric = dist.metric401ErrorRate();
const http403ErrorRateMetric = dist.metric403ErrorRate();
const http404ErrorRateMetric = dist.metric404ErrorRate();
const http502ErrorRateMetric = dist.metric502ErrorRate();
const http503ErrorRateMetric = dist.metric503ErrorRate();
const http504ErrorRateMetric = dist.metric504ErrorRate();
```

### HTTP Versions

You can configure CloudFront to use a particular version of the HTTP protocol. By default,
newly created distributions use HTTP/2 but can be configured to use both HTTP/2 and HTTP/3 or
just HTTP/3. For all supported HTTP versions, see the `HttpVerson` enum.

```ts
// Configure a distribution to use HTTP/2 and HTTP/3
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.HttpOrigin('www.example.com') },
  httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
});
```

### Importing Distributions

Existing distributions can be imported as well; note that like most imported constructs, an imported distribution cannot be modified.
However, it can be used as a reference for other higher-level constructs.

```ts
// Using a reference to an imported Distribution
const distribution = cloudfront.Distribution.fromDistributionAttributes(this, 'ImportedDist', {
  domainName: 'd111111abcdef8.cloudfront.net',
  distributionId: '012345ABCDEF',
});
```

### Permissions

Use the `grant()` method to allow actions on the distribution.
`grantCreateInvalidation()` is a shorthand to allow `CreateInvalidation`.

```ts
declare const distribution: cloudfront.Distribution;
declare const lambdaFn: lambda.Function;
distribution.grant(lambdaFn, 'cloudfront:ListInvalidations', 'cloudfront:GetInvalidation');
distribution.grantCreateInvalidation(lambdaFn);
```

### Realtime Log Config

CloudFront supports realtime log delivery from your distribution to a Kinesis stream.

See [Real-time logs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html) in the CloudFront User Guide.

Example:

```ts
// Adding realtime logs config to a Cloudfront Distribution on default behavior.
import * as kinesis from 'aws-cdk-lib/aws-kinesis';

declare const stream: kinesis.Stream;

const realTimeConfig = new cloudfront.RealtimeLogConfig(this, 'realtimeLog', {
  endPoints: [
    cloudfront.Endpoint.fromKinesisStream(stream),
  ],
  fields: [
    'timestamp',
    'c-ip',
    'time-to-first-byte',
    'sc-status',
  ],
  realtimeLogConfigName: 'my-delivery-stream',
  samplingRate: 100,
});

new cloudfront.Distribution(this, 'myCdn', {
  defaultBehavior: {
    origin: new origins.HttpOrigin('www.example.com'),
    realtimeLogConfig: realTimeConfig,
  },
});
```

## Migrating from the original CloudFrontWebDistribution to the newer Distribution construct

It's possible to migrate a distribution from the original to the modern API.
The changes necessary are the following:

### The Distribution

Replace `new CloudFrontWebDistribution` with `new Distribution`. Some
configuration properties have been changed:

| Old API                | New API                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `originConfigs`        | `defaultBehavior`; use `additionalBehaviors` if necessary                                      |
| `viewerCertificate`    | `certificate`; use `domainNames` for aliases                                                   |
| `errorConfigurations`  | `errorResponses`                                                                               |
| `loggingConfig`        | `enableLogging`; configure with `logBucket` `logFilePrefix` and `logIncludesCookies`           |
| `viewerProtocolPolicy` | removed; set on each behavior instead. default changed from `REDIRECT_TO_HTTPS` to `ALLOW_ALL` |

After switching constructs, you need to maintain the same logical ID for the underlying [CfnDistribution](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-cloudfront.CfnDistribution.html) if you wish to avoid the deletion and recreation of your distribution.
To do this, use [escape hatches](https://docs.aws.amazon.com/cdk/v2/guide/cfn_layer.html) to override the logical ID created by the new Distribution construct with the logical ID created by the old construct.

Example:

```ts
declare const sourceBucket: s3.Bucket;

const myDistribution = new cloudfront.Distribution(this, 'MyCfWebDistribution', {
  defaultBehavior: {
    origin: new origins.S3Origin(sourceBucket),
  },
});
const cfnDistribution = myDistribution.node.defaultChild as cloudfront.CfnDistribution;
cfnDistribution.overrideLogicalId('MyDistributionCFDistribution3H55TI9Q');
```

### Behaviors

The modern API makes use of the [CloudFront Origins](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront_origins-readme.html) module to easily configure your origin. Replace your origin configuration with the relevant CloudFront Origins class. For example, here's a behavior with an S3 origin:

```ts
declare const sourceBucket: s3.Bucket;
declare const oai: cloudfront.OriginAccessIdentity;

new cloudfront.CloudFrontWebDistribution(this, 'MyCfWebDistribution', {
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: sourceBucket,
        originAccessIdentity: oai,
      },
      behaviors : [ {isDefaultBehavior: true}],
    },
  ],
});
```

Becomes:

```ts
declare const sourceBucket: s3.Bucket;

const distribution = new cloudfront.Distribution(this, 'MyCfWebDistribution', {
  defaultBehavior: {
    origin: new origins.S3Origin(sourceBucket) // This class automatically creates an Origin Access Identity
  },
});
```

In the original API all behaviors are defined in the `originConfigs` property. The new API is optimized for a single origin and behavior, so the default behavior and additional behaviors will be defined separately.

```ts
declare const sourceBucket: s3.Bucket;
declare const oai: cloudfront.OriginAccessIdentity;

new cloudfront.CloudFrontWebDistribution(this, 'MyCfWebDistribution', {
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: sourceBucket,
        originAccessIdentity: oai,
      },
      behaviors: [ {isDefaultBehavior: true}],
    },
    {
      customOriginSource: {
        domainName: 'MYALIAS',
      },
      behaviors: [{ pathPattern: '/somewhere' }]
    }
  ],
});
```

Becomes:

```ts
declare const sourceBucket: s3.Bucket;

const distribution = new cloudfront.Distribution(this, 'MyCfWebDistribution', {
  defaultBehavior: {
    origin: new origins.S3Origin(sourceBucket) // This class automatically creates an Origin Access Identity
  },
  additionalBehaviors: {
    '/somewhere': {
      origin: new origins.HttpOrigin('MYALIAS'),
    }
  }
});
```

### Certificates

If you are using an ACM certificate, you can pass the certificate directly to the `certificate` prop.
Any aliases used before in the `ViewerCertificate` class should be passed in to the `domainNames` prop in the modern API.

```ts
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
declare const certificate: acm.Certificate;
declare const sourceBucket: s3.Bucket;

const viewerCertificate = cloudfront.ViewerCertificate.fromAcmCertificate(certificate, {
  aliases: ['MYALIAS'],
});

new cloudfront.CloudFrontWebDistribution(this, 'MyCfWebDistribution', {
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: sourceBucket,
      },
      behaviors : [ {isDefaultBehavior: true} ],
    },
  ],
  viewerCertificate: viewerCertificate,
});
```

Becomes:

```ts
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
declare const certificate: acm.Certificate;
declare const sourceBucket: s3.Bucket;

const distribution = new cloudfront.Distribution(this, 'MyCfWebDistribution', {
  defaultBehavior: {
    origin: new origins.S3Origin(sourceBucket),
  },
  domainNames: ['MYALIAS'],
  certificate: certificate,
});
```

IAM certificates aren't directly supported by the new API, but can be easily configured through [escape hatches](https://docs.aws.amazon.com/cdk/v2/guide/cfn_layer.html)

```ts
declare const sourceBucket: s3.Bucket;
const viewerCertificate = cloudfront.ViewerCertificate.fromIamCertificate('MYIAMROLEIDENTIFIER', {
  aliases: ['MYALIAS'],
});

new cloudfront.CloudFrontWebDistribution(this, 'MyCfWebDistribution', {
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: sourceBucket,
      },
      behaviors : [ {isDefaultBehavior: true} ],
    },
  ],
  viewerCertificate: viewerCertificate,
});
```

Becomes:

```ts
declare const sourceBucket: s3.Bucket;
const distribution = new cloudfront.Distribution(this, 'MyCfWebDistribution', {
  defaultBehavior: {
    origin: new origins.S3Origin(sourceBucket),
  },
  domainNames: ['MYALIAS'],
});

const cfnDistribution = distribution.node.defaultChild as cloudfront.CfnDistribution;

cfnDistribution.addPropertyOverride('ViewerCertificate.IamCertificateId', 'MYIAMROLEIDENTIFIER');
cfnDistribution.addPropertyOverride('ViewerCertificate.SslSupportMethod', 'sni-only');
```

### Other changes

A number of default settings have changed on the new API when creating a new distribution, behavior, and origin.
After making the major changes needed for the migration, run `cdk diff` to see what settings have changed.
If no changes are desired during migration, you will at the least be able to use [escape hatches](https://docs.aws.amazon.com/cdk/v2/guide/cfn_layer.html) to override what the CDK synthesizes, if you can't change the properties directly.

## CloudFrontWebDistribution API

> The `CloudFrontWebDistribution` construct is the original construct written for working with CloudFront distributions.
> Users are encouraged to use the newer `Distribution` instead, as it has a simpler interface and receives new features faster.

Example usage:

```ts
// Using a CloudFrontWebDistribution construct.

declare const sourceBucket: s3.Bucket;
const distribution = new cloudfront.CloudFrontWebDistribution(this, 'MyDistribution', {
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: sourceBucket,
      },
      behaviors : [ {isDefaultBehavior: true}],
    },
  ],
});
```

### Viewer certificate

By default, CloudFront Web Distributions will answer HTTPS requests with CloudFront's default certificate,
only containing the distribution `domainName` (e.g. d111111abcdef8.cloudfront.net).
You can customize the viewer certificate property to provide a custom certificate and/or list of domain name aliases to fit your needs.

See [Using Alternate Domain Names and HTTPS](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-alternate-domain-names.html) in the CloudFront User Guide.

#### Default certificate

You can customize the default certificate aliases. This is intended to be used in combination with CNAME records in your DNS zone.

Example:

[create a distribution with an default certificate example](test/example.default-cert-alias.lit.ts)

#### ACM certificate

You can change the default certificate by one stored AWS Certificate Manager, or ACM.
Those certificate can either be generated by AWS, or purchased by another CA imported into ACM.

For more information, see
[the aws-certificatemanager module documentation](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-certificatemanager-readme.html)
or [Importing Certificates into AWS Certificate Manager](https://docs.aws.amazon.com/acm/latest/userguide/import-certificate.html)
in the AWS Certificate Manager User Guide.

Example:

[create a distribution with an acm certificate example](test/example.acm-cert-alias.lit.ts)

#### IAM certificate

You can also import a certificate into the IAM certificate store.

See [Importing an SSL/TLS Certificate](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-procedures.html#cnames-and-https-uploading-certificates) in the CloudFront User Guide.

Example:

[create a distribution with an iam certificate example](test/example.iam-cert-alias.lit.ts)

### Trusted Key Groups

CloudFront Web Distributions supports validating signed URLs or signed cookies using key groups.
When a cache behavior contains trusted key groups, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior.

Example:

```ts
// Using trusted key groups for Cloudfront Web Distributions.
declare const sourceBucket: s3.Bucket;
declare const publicKey: string;
const pubKey = new cloudfront.PublicKey(this, 'MyPubKey', {
  encodedKey: publicKey,
});

const keyGroup = new cloudfront.KeyGroup(this, 'MyKeyGroup', {
  items: [
    pubKey,
  ],
});

new cloudfront.CloudFrontWebDistribution(this, 'AnAmazingWebsiteProbably', {
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: sourceBucket,
      },
      behaviors: [
        {
          isDefaultBehavior: true,
          trustedKeyGroups: [
            keyGroup,
          ],
        },
      ],
    },
  ],
});
```

### Restrictions

CloudFront supports adding restrictions to your distribution.

See [Restricting the Geographic Distribution of Your Content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/georestrictions.html) in the CloudFront User Guide.

Example:

```ts
// Adding restrictions to a Cloudfront Web Distribution.
declare const sourceBucket: s3.Bucket;
new cloudfront.CloudFrontWebDistribution(this, 'MyDistribution', {
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: sourceBucket,
      },
      behaviors : [ {isDefaultBehavior: true}],
    },
  ],
  geoRestriction: cloudfront.GeoRestriction.allowlist('US', 'GB'),
});
```

### Connection behaviors between CloudFront and your origin

CloudFront provides you even more control over the connection behaviors between CloudFront and your origin.
You can now configure the number of connection attempts CloudFront will make to your origin and the origin connection timeout for each attempt.

See [Origin Connection Attempts](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#origin-connection-attempts)

See [Origin Connection Timeout](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#origin-connection-timeout)

Example usage:

```ts
// Configuring connection behaviors between Cloudfront and your origin
const distribution = new cloudfront.CloudFrontWebDistribution(this, 'MyDistribution', {
  originConfigs: [
    {
      connectionAttempts: 3,
      connectionTimeout: Duration.seconds(10),
      behaviors: [
        {
          isDefaultBehavior: true,
        },
      ],
    },
  ],
});
```

#### Origin Fallback

In case the origin source is not available and answers with one of the
specified status codes the failover origin source will be used.

```ts
// Configuring origin fallback options for the CloudFrontWebDistribution
new cloudfront.CloudFrontWebDistribution(this, 'ADistribution', {
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: s3.Bucket.fromBucketName(this, 'aBucket', 'myoriginbucket'),
        originPath: '/',
        originHeaders: {
          'myHeader': '42',
        },
        originShieldRegion: 'us-west-2',
      },
      failoverS3OriginSource: {
        s3BucketSource: s3.Bucket.fromBucketName(this, 'aBucketFallback', 'myoriginbucketfallback'),
        originPath: '/somewhere',
        originHeaders: {
          'myHeader2': '21',
        },
        originShieldRegion: 'us-east-1',
      },
      failoverCriteriaStatusCodes: [cloudfront.FailoverStatusCode.INTERNAL_SERVER_ERROR],
      behaviors: [
        {
          isDefaultBehavior: true,
        },
      ],
    },
  ],
});
```

## KeyGroup & PublicKey API

You can create a key group to use with CloudFront signed URLs and signed cookies
You can add public keys to use with CloudFront features such as signed URLs, signed cookies, and field-level encryption.

The following example command uses OpenSSL to generate an RSA key pair with a length of 2048 bits and save to the file named `private_key.pem`.

```bash
openssl genrsa -out private_key.pem 2048
```

The resulting file contains both the public and the private key. The following example command extracts the public key from the file named `private_key.pem` and stores it in `public_key.pem`.

```bash
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

Note: Don't forget to copy/paste the contents of `public_key.pem` file including `-----BEGIN PUBLIC KEY-----` and `-----END PUBLIC KEY-----` lines into `encodedKey` parameter when creating a `PublicKey`.

Example:

```ts
// Create a key group to use with CloudFront signed URLs and signed cookies.
new cloudfront.KeyGroup(this, 'MyKeyGroup', {
  items: [
    new cloudfront.PublicKey(this, 'MyPublicKey', {
      encodedKey: '...', // contents of public_key.pem file
      // comment: 'Key is expiring on ...',
    }),
  ],
  // comment: 'Key group containing public keys ...',
});
```

See:

* https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html
* https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html
