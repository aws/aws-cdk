## Amazon CloudFront Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

A CloudFront construct - for setting up the AWS CDN with ease!

Example usage:

```ts
const sourceBucket = new Bucket(this, 'Bucket');
 
const distribution = new CloudFrontWebDistribution(this, 'MyDistribution', {
    originConfigs: [
        {
            s3OriginSource: {
                s3BucketSource: sourceBucket
            },
            behaviors : [ {isDefaultBehavior: true}]
        }
    ]
 });
```
