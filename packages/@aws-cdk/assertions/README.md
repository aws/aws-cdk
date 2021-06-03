# Assert v2
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

> NOTE: This module contains *beta APIs*.
>
> Some of the symbols in the APIs are suffixed with the `Beta<n>`.
> When we have backwards incompatible change, we will create a new
> symbol with a `Beta<n+1>` suffix and deprecate the `Beta<n>` symbol.
----

This module allows asserting the contents of CloudFormation templates.

To run assertions based on a CDK `Stack`, start off with -

```ts
const stack = new cdk.Stack(...)
...
const assert = TemplateAssertionsBeta1.fromStack(stack);
```

Alternatively, assertions can be run on an existing CloudFormation template -

```ts
const file = '/path/to/template/file.json';
const template = fs.readFileSync(file);
const assert = TemplateAssertionsBeta1.fromTemplate(template);
```

## Full Template Match

The simplest assertion would be to assert that the template matches a given
template.

```ts
assert.assertTemplateMatches({
  Resources: {
    Type: 'Foo::Bar',
    Properties: {
      Baz: 'Qux',
    },
  },
});
```

## Counting Resources

This module allows asserting the number of resources of a specific type found
in a template.

```ts
assert.assertResourceCountIs('Foo::Bar', 2);
```

## Resource Matching

Beyond resource counting, the module also allows asserting that a resource with
specific properties are present.

The following code asserts that the `Properties` section of a resource of type
`Foo::Bar` contains the specified properties -

```ts
assert.assertHasResource('Foo::Bar', {
  Foo: 'Bar',
  Baz: 5,
  Qux: [ 'Waldo', 'Fred' ],
});
```

The same method allows asserting the complete definition of the 'Resource'
which can be used to verify things other sections like `DependsOn`, `Metadata`,
`DeletionProperty`, etc.

```ts
assert.assertHasResource('Foo::Bar', {
  Properties: { Foo: 'Bar' },
  DependsOn: [ 'Waldo', 'Fred' ],
}, {
  part: ResourcePartBeta1.COMPLETE,
});
```
