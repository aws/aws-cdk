## Testing utilities and assertions for CDK libraries
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

This library contains helpers for writing unit tests and integration tests for CDK libraries

### Unit tests

Write your unit tests like this:

```ts
const stack = new Stack();

new MyConstruct(stack, 'MyConstruct', {
    ...
});

expect(stack).to(someExpectation(...));
```

Here are the expectations you can use:

### Verify (parts of) a template

Check that the synthesized stack template looks like the given template, or is a superset of it. These functions match logical IDs and all properties of a resource.

```ts
matchTemplate(template, matchStyle)
exactlyMatchTemplate(template)
beASupersetOfTemplate(template)
```

Example:

```ts
expect(stack).to(beASupersetOfTemplate({
    Resources: {
        HostedZone674DD2B7: {
            Type: "AWS::Route53::HostedZone",
            Properties: {
                Name: "test.private.",
                VPCs: [{
                    VPCId: { Ref: 'VPC06C5F037' },
                    VPCRegion: { Ref: 'AWS::Region' }
                }]
            }
        }
    }
}));
```


### Check existence of a resource

If you only care that a resource of a particular type exists (regardless of its logical identifier), and that *some* of its properties are set to specific values:

```ts
haveResource(type, subsetOfProperties)
```

Example:

```ts
expect(stack).to(haveResource('AWS::CertificateManager::Certificate', {
    DomainName: 'test.example.com'
    // Note: some properties omitted here
}));
```


## Integration tests

Integration tests are modeled as CDK apps that are deployed by the developers.
If deployment succeeds, the synthesized template is saved in a local file and
"locked". During build, the test app is only synthesized and compared against
the checked-in file to protect against regressions.

### Setup

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
        "@aws-cdk/assert": "*",
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

The usage of `cdk-integ` is:

```bash
cdk-integ [--no-clean] [filters...]

# or

npm run integ -- [--no-clean] [filters...]
```

 * If `--no-clean` is specified, the integration test stacks will not be cleaned
   up. This can be used to perform manual validation on the stacks.
 * If filters are specified, each test name is evaluated against each filter. If
   the name matches any of the filters, the test is included. Otherwise it is
   skipped.

