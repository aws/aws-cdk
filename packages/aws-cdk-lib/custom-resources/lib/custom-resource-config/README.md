# Custom Resource Config

The CustomResourceConfig Aspect will modified CDK-vended custom resources.

```ts
    // The code below shows an example of how to instantiate this type.
    // The singleton lambda will be configured with a logGroup with a defined logRetention.
    import { CustomResourceConfig } from 'aws-cdk-lib/custom-resources';

    CustomResourceConfig.of(app).addLogRetentionLifetime(logs.RetentionDays.TEN_YEARS);

    const stack = new cdk.Stack(app);

    let websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});
    new s3deploy.BucketDeployment(stack, 's3deployNone', {
      sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
      destinationBucket: websiteBucket,
    });
```