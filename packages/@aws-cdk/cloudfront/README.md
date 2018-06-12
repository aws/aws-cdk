## AWS CloudFront Construct Library
A CloudFront construct - for setting up the AWS CDN with ease!

Example usage:

```ts
const sourceBucket = new Bucket(this, 'Bucket');
 
const distribution = new CloudFrontDistribution(this, 'MyDistribution', {
    originConfigs: [
        {
            s3OriginSource: {
                s3BucketSource: sourceBucket
            },
            behaviors : [ {isDefaultBehavior}]
        }
    ]
 });
```
