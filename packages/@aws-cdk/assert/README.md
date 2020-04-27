## Testing utilities and assertions for CDK libraries
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

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
    DomainName: 'test.example.com',
    // Note: some properties omitted here

    ShouldNotExist: ABSENT
}));
```

`ABSENT` is a magic value to assert that a particular key in an object is *not* set (or set to `undefined`).

### Check number of resources

If you want to assert that `n` number of resources of a particular type exist, with or without specific properties:

```ts
countResources(type, count)
countResourcesLike(type, count, props)
```

Example:

```ts
expect(stack).to(countResources('AWS::ApiGateway::Method', 3));
expect(stack).to(countResourcesLike('AWS::ApiGateway::Method', 1, {
  HttpMethod: 'GET',
  ResourceId: {
    "Ref": "MyResource01234"
  }
}));
```

### Check existence of an output
`haveOutput` assertion can be used to check that a stack contains specific output.
Parameters to check against can be:
- `outputName`
- `outputValue`
- `exportName`

If `outputValue` is provided, at least one of `outputName`, `exportName` should be provided as well

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
