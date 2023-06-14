# Amazon Kinesis Data Firehose Destinations Library
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

---

<!--END STABILITY BANNER-->

This library provides constructs for adding destinations to a Amazon Kinesis Data Firehose
delivery stream. Destinations can be added by specifying the `destinations` prop when
defining a delivery stream.

See [Amazon Kinesis Data Firehose module README](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-kinesisfirehose-readme.html) for usage examples.

```ts nofixture
import * as destinations from '@aws-cdk/aws-kinesisfirehose-destinations';
```
