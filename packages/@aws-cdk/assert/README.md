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
### Check existence of an output
`haveOutput` assertion can be used to check that a stack contains specific output. 
Parameters to check against can be:
- output name
- output value
- export name

If output value is provided, at least one of \[output name, export name\] should be proviled as well

Example
```ts
expect(synthStack).to(haveOutput({
  outputName: 'TestOutputName',
  exportName: 'TestOutputExportName',
  outputValue: {
    'Fn::GetAtt': [
      'TestResource',
      'Arn'
    ]
  }
}));

```
