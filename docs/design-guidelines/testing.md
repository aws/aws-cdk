## Testing

* [Unit tests](#unit-tests)
* [Integration tests](#integration-tests)
* [Versioning](#versioning)

### Unit tests

* Unit test utility functions and object models separately from constructs. If
  you want them to be “package-private”, just put them in a separate file and
  import `../lib/my-util` from your unit test code.
* Failing tests should be prefixed with “fails”

### Integration tests

* Integration tests should be under `test/integ.xxx.ts` and should basically
  just be CDK apps that can be deployed using “cdk deploy” (in the meantime).

### Versioning

* Semantic versioning Construct ID changes or scope hierarchy