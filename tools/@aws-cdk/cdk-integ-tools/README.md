# Integration Test Tools

A testing tool for CDK constructs integration testing.

Integration tests are modeled as CDK apps that are deployed by the developers.
If deployment succeeds, the synthesized template is saved in a local file and
"locked". During build, the test app is only synthesized and compared against
the checked-in file to protect against regressions.

## Setup

Create any number of files called `integ.*.ts` in your `test` directory. These
should be CDK apps containing a single stack.

Add the following to your `package.json`':

```json
{
    scripts: {
        "test": ".... && cdk-integ-assert",
        "integ": "cdk-integ"
    },
    ...
    devDependencies: {
        "cdk-integ-tools": "*",
        "aws-cdk": "*"
    }
}
```

This installs two tools into your scripts:

 * When `npm test` is executed (during build), the `cdk-integ-assert` tool is
   invoked. This tool will only synthesize the integration test stacks and
   compare them to the .expected files. If the files differ (or do not exist),
   the test will fail.
 * When `npm run integ` is executed (manually by the developer), the `cdk-integ`
   tool is invoked. This tool will actually attempt to deploy the integration
   test stacks into the default environment. If it succeeds, the .expected file
   will be updated to include the latest synthesized stack.

## cdk-integ

Usage:

```console
cdk-integ [TEST...] [--no-clean] [--verbose]
```

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
