# Integration Test Tools
<div class="stability_label"
     style="background-color: #EC5315; color: white !important; margin: 0 0 1rem 0; padding: 1rem; line-height: 1.5;">
  Stability: 1 - Experimental. This API is still under active development and subject to non-backward
  compatible changes or removal in any future version. Use of the API is not recommended in production
  environments. Experimental APIs are not subject to the Semantic Versioning model.
</div>


A testing tool for CDK constructs integration testing.

Integration tests are simple CDK apps under `test/integ.*.js`. Each one defines
a single stack.

There are two modes of operation:

1. `cdk-integ`: Executed by developers against their developer account. This
   command actually deploys the stack and stores a local copy of the synthesized
   CloudFormation template under `<test>.expected.json`.
2. `cdk-integ-assert`: Executed during build (CI/CD). It will only synthesize
   the template and then compare the result to the stored copy. If they differ,
   the test will fail the build.

This approach pragmatically ensures that unexpected changes are not introduced
without a developer actually deploying a stack and verifying them.

## cdk-integ

Usage:

    cdk-integ [TEST...] [--no-clean] [--verbose]

Will deploy test stacks from `test/integ.*.js` and store the synthesized output
under `test/integ.*.expected.json`.

* Optionally, you can specify a list of test `integ.*.js` files (they must be
  under `test/`) to execute only a subset of the tests.
* Use `--no-clean` to skip the clean up of the stack. This is useful in case you
  wish to manually examine the stack to ensure that the result is what you
  expected.
* Use `--verbose` to print verbose output from `cdk` executions.

## cdk-integ-assert

No arguments - will synthesize all `test/integ.*.js` apps and compare them to
their `.expected.json` counterparts.
