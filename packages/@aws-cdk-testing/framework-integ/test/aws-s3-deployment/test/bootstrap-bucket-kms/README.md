# Customer-managed bootstrap key integration test

This fixture requires a bootstrap bucket encrypted with a customer-managed KMS key.
The scoped `integ.context.json` records the bootstrap qualifier and actual key ARN
used for the successful live run. It also makes offline snapshot checks reproducible.

For a live run in another test environment, bootstrap it with
`--bootstrap-customer-key` and update `bootstrapQualifier`,
`@aws-cdk/core:bootstrapQualifier`, and `bootstrapBucketKmsKeyArn` in this context
file. The key must be real; the test rejects the old placeholder ARN and verifies
that the source bucket is encrypted with the supplied key.

From the framework integration package, run:

```sh
integ-runner integ.bootstrap-bucket-kms.js \
  --directory test/aws-s3-deployment/test/bootstrap-bucket-kms \
  --force --update-on-failed --no-update-workflow
```

The test checks both the deployed object and the source bucket encryption.
Supply `--profiles` and `--parallel-regions` for the test environment. Remove the
test stacks after validation.
