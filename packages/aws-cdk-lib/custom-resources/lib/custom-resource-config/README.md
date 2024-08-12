# Custom Resource Config

You can set the log retention of every CDK-vended custom resource in a given scope with `CustomResourceConfig`. The following example configures every custom resource in this CDK app to retain its logs for ten years:

```ts
    import { CustomResourceConfig } from 'aws-cdk-lib/custom-resources';

    CustomResourceConfig.of(app).addLogRetentionLifetime(logs.RetentionDays.TEN_YEARS);

    const stack = new cdk.Stack(app);

    let websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});
    new s3deploy.BucketDeployment(stack, 's3deployNone', {
      sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
      destinationBucket: websiteBucket,
    });
```