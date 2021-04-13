# Testing utilities and assertions for CDK libraries
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This library contains helpers for writing unit tests and integration tests for CDK libraries

## Unit tests

Write your unit tests like this:

```ts
const stack = new Stack();

new MyConstruct(stack, 'MyConstruct', {
    ...
});

expect(stack).to(someExpectation(...));
```

Here are the expectations you can use:

## Verify (parts of) a template

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


## Check existence of a resource

If you only care that a resource of a particular type exists (regardless of its logical identifier), and that *some* of its properties are set to specific values:

```ts
haveResource(type, subsetOfProperties)
haveResourceLike(type, subsetOfProperties)
```

Example:

```ts
expect(stack).to(haveResource('AWS::CertificateManager::Certificate', {
    DomainName: 'test.example.com',
    // Note: some properties omitted here

    ShouldNotExist: ABSENT
}));
```

The object you give to `haveResource`/`haveResourceLike` like can contain the
following values:

- **Literal values**: the given property in the resource must match the given value *exactly*.
- `ABSENT`: a magic value to assert that a particular key in an object is *not* set (or set to `undefined`).
- special matchers for inexact matching. You can use these to match values based on more lenient conditions
  than the default (such as an array containing at least one element, ignoring the rest, or an inexact string
  match).

The following matchers exist:

- `objectLike(O)` - the value has to be an object matching at least the keys in `O` (but may contain
  more). The nested values must match exactly.
- `deepObjectLike(O)` - as `objectLike`, but nested objects are also treated as partial specifications.
- `exactValue(X)` - must match exactly the given value. Use this to escape from `deepObjectLike`'s leniency
  back to exact value matching.
- `arrayWith(E, [F, ...])` - value must be an array containing the given elements (or matchers) in any order.
- `stringLike(S)` - value must be a string matching `S`. `S` may contain `*` as wildcard to match any number
  of characters.
- `anything()` - matches any value.
- `notMatching(M)` - any value that does NOT match the given matcher (or exact value) given.
- `encodedJson(M)` - value must be a string which, when decoded as JSON, matches the given matcher or
  exact value.

Slightly more complex example with array matchers:

```ts
expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
  PolicyDocument: {
    Statement: arrayWith(objectLike({
      Action: ['s3:GetObject'],
      Resource: ['arn:my:arn'],
    }})
  }
}));
```

## Capturing values from a match

Special `Capture` matchers exist to capture values encountered during a match. These can be
used for two typical purposes:

- Apply additional assertions to the values found during a matching operation.
- Use the value found during a matching operation in a new matching operation.

`Capture` matchers take an inner matcher as an argument, and will only capture the value
if the inner matcher succeeds in matching the given value.

Here's an example which asserts that a policy for `RoleA` contains two statements
with *different* ARNs (without caring what those ARNs might be), and that
a policy for `RoleB` *also* has a statement for one of those ARNs (again, without
caring what the ARN might be):

```ts
const arn1 = Capture.aString();
const arn2 = Capture.aString();

expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
  Roles: ['RoleA'],
  PolicyDocument: {
    Statement: [
      objectLike({
        Resource: [arn1.capture()],
      }),
      objectLike({
        Resource: [arn2.capture()],
      }),
    ],
  },
}));

// Don't care about the values as long as they are not the same
expect(arn1.capturedValue).not.toEqual(arn2.capturedValue);

expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
  Roles: ['RoleB'],
  PolicyDocument: {
    Statement: [
      objectLike({
        // This ARN must be the same as ARN1 above.
        Resource: [arn1.capturedValue]
      }),
    ],
  },
}));
```

NOTE: `Capture` look somewhat like *bindings* in other pattern matching
libraries you might be used to, but they are far simpler and very
deterministic. In particular, they don't do unification: if the same Capture
is either used multiple times in the same structure expression or matches
multiple times, no restarting of the match is done to make them all match the
same value: the last value encountered by the `Capture` (as determined by the
behavior of the matchers around it) is stored into it and will be the one
available after the match has completed.

## Check number of resources

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

## Check existence of an output

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
