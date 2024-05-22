# Assertions


If you're migrating from the old `@aws-cdk/assert` library, first use this migration guide to migrate from `@aws-cdk/assert` to `@aws-cdk/assertions` found in
[our GitHub repository](https://github.com/aws/aws-cdk/blob/v1-main/packages/@aws-cdk/assertions/MIGRATING.md). Then, you can migrate your application to AWS CDK v2 in order to use this library using [this guide](https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html).

Functions for writing test asserting against CDK applications, with focus on CloudFormation templates.

The `Template` class includes a set of methods for writing assertions against CloudFormation templates. Use one of the `Template.fromXxx()` static methods to create an instance of this class.

To create `Template` from CDK stack, start off with:

```ts nofixture
import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

const stack = new Stack(/* ... */);
// ...
const template = Template.fromStack(stack);
```

Alternatively, assertions can be run on an existing CloudFormation template -

```ts fixture=init
const templateJson = '{ "Resources": ... }'; /* The CloudFormation template as JSON serialized string. */
const template = Template.fromString(templateJson);
```

**Cyclical Resources Note**

If allowing cyclical references is desired, for example in the case of unprocessed Transform templates, supply TemplateParsingOptions and
set skipCyclicalDependenciesCheck to true. In all other cases, will fail on detecting cyclical dependencies.

## Full Template Match

The simplest assertion would be to assert that the template matches a given
template.

```ts
template.templateMatches({
  Resources: {
    BarLogicalId: {
      Type: 'Foo::Bar',
      Properties: {
        Baz: 'Qux',
      },
    },
  },
});
```

By default, the `templateMatches()` API will use the an 'object-like' comparison,
which means that it will allow for the actual template to be a superset of the
given expectation. See [Special Matchers](#special-matchers) for details on how
to change this.

Snapshot testing is a common technique to store a snapshot of the output and
compare it during future changes. Since CloudFormation templates are human readable,
they are a good target for snapshot testing.

The `toJSON()` method on the `Template` can be used to produce a well formatted JSON
of the CloudFormation template that can be used as a snapshot.

See [Snapshot Testing in Jest](https://jestjs.io/docs/snapshot-testing) and [Snapshot
Testing in Java](https://json-snapshot.github.io/).

## Counting Resources

This module allows asserting the number of resources of a specific type found
in a template.

```ts
template.resourceCountIs('Foo::Bar', 2);
```

You can also count the number of resources of a specific type whose `Properties`
section contains the specified properties:

```ts
template.resourcePropertiesCountIs('Foo::Bar', {
  Foo: 'Bar',
  Baz: 5,
  Qux: [ 'Waldo', 'Fred' ],
}, 1);
```

## Resource Matching & Retrieval

Beyond resource counting, the module also allows asserting that a resource with
specific properties are present.

The following code asserts that the `Properties` section of a resource of type
`Foo::Bar` contains the specified properties -

```ts
template.hasResourceProperties('Foo::Bar', {
  Lorem: 'Ipsum',
  Baz: 5,
  Qux: [ 'Waldo', 'Fred' ],
});
```

You can also assert that the `Properties` section of all resources of type
`Foo::Bar` contains the specified properties -

```ts
template.allResourcesProperties('Foo::Bar', {
  Lorem: 'Ipsum',
  Baz: 5,
  Qux: [ 'Waldo', 'Fred' ],
});
```

Alternatively, if you would like to assert the entire resource definition, you
can use the `hasResource()` API.

```ts
template.hasResource('Foo::Bar', {
  Properties: { Lorem: 'Ipsum' },
  DependsOn: [ 'Waldo', 'Fred' ],
});
```

You can also assert the definitions of all resources of a type using the
`allResources()` API.

```ts
template.allResources('Foo::Bar', {
  Properties: { Lorem: 'Ipsum' },
  DependsOn: [ 'Waldo', 'Fred' ],
});
```

Beyond assertions, the module provides APIs to retrieve matching resources.
The `findResources()` API is complementary to the `hasResource()` API, except,
instead of asserting its presence, it returns the set of matching resources.

By default, the `hasResource()` and `hasResourceProperties()` APIs perform deep
partial object matching. This behavior can be configured using matchers.
See subsequent section on [special matchers](#special-matchers).

## Output and Mapping sections

The module allows you to assert that the CloudFormation template contains an Output
that matches specific properties. The following code asserts that a template contains
an Output with a `logicalId` of `Foo` and the specified properties -

```ts
const expected = {
  Value: 'Bar',
  Export: { Name: 'ExportBaz' },
};
template.hasOutput('Foo', expected);
```

If you want to match against all Outputs in the template, use `*` as the `logicalId`.

```ts
template.hasOutput('*', {
  Value: 'Bar',
  Export: { Name: 'ExportBaz' },
});
```

`findOutputs()` will return a set of outputs that match the `logicalId` and `props`,
and you can use the `'*'` special case as well.

```ts
const result = template.findOutputs('*', { Value: 'Fred' });
expect(result.Foo).toEqual({ Value: 'Fred', Description: 'FooFred' });
expect(result.Bar).toEqual({ Value: 'Fred', Description: 'BarFred' });
```

The APIs `hasMapping()`, `findMappings()`, `hasCondition()`, and `hasCondtions()` provide similar functionalities.

## Special Matchers

The expectation provided to the `hasXxx()`, `findXxx()` and `templateMatches()`
APIs, besides carrying literal values, as seen in the above examples, also accept
special matchers.

They are available as part of the `Match` class.

### Object Matchers

The `Match.objectLike()` API can be used to assert that the target is a superset
object of the provided pattern.
This API will perform a deep partial match on the target.
Deep partial matching is where objects are matched partially recursively. At each
level, the list of keys in the target is a subset of the provided pattern.

```ts
// Given a template -
// {
//   "Resources": {
//     "MyBar": {
//       "Type": "Foo::Bar",
//       "Properties": {
//         "Fred": {
//           "Wobble": "Flob",
//           "Bob": "Cat"
//         }
//       }
//     }
//   }
// }

// The following will NOT throw an assertion error
template.hasResourceProperties('Foo::Bar', {
  Fred: Match.objectLike({
    Wobble: 'Flob',
  }),
});

// The following will throw an assertion error
template.hasResourceProperties('Foo::Bar', {
  Fred: Match.objectLike({
    Brew: 'Coffee',
  }),
});
```

The `Match.objectEquals()` API can be used to assert a target as a deep exact
match.

### Presence and Absence

The `Match.absent()` matcher can be used to specify that a specific
value should not exist on the target. This can be used within `Match.objectLike()`
or outside of any matchers.

```ts
// Given a template -
// {
//   "Resources": {
//     "MyBar": {
//       "Type": "Foo::Bar",
//       "Properties": {
//         "Fred": {
//           "Wobble": "Flob",
//         }
//       }
//     }
//   }
// }

// The following will NOT throw an assertion error
template.hasResourceProperties('Foo::Bar', {
  Fred: Match.objectLike({
    Bob: Match.absent(),
  }),
});

// The following will throw an assertion error
template.hasResourceProperties('Foo::Bar', {
  Fred: Match.objectLike({
    Wobble: Match.absent(),
  }),
});
```

The `Match.anyValue()` matcher can be used to specify that a specific value should be found
at the location. This matcher will fail if when the target location has null-ish values
(i.e., `null` or `undefined`).

This matcher can be combined with any of the other matchers.

```ts
// Given a template -
// {
//   "Resources": {
//     "MyBar": {
//       "Type": "Foo::Bar",
//       "Properties": {
//         "Fred": {
//           "Wobble": ["Flob", "Flib"],
//         }
//       }
//     }
//   }
// }

// The following will NOT throw an assertion error
template.hasResourceProperties('Foo::Bar', {
  Fred: {
    Wobble: [ Match.anyValue(), Match.anyValue() ],
  },
});

// The following will throw an assertion error
template.hasResourceProperties('Foo::Bar', {
  Fred: {
    Wimble: Match.anyValue(),
  },
});
```

### Array Matchers

The `Match.arrayWith()` API can be used to assert that the target is equal to or a subset
of the provided pattern array.
This API will perform subset match on the target.

```ts
// Given a template -
// {
//   "Resources": {
//     "MyBar": {
//       "Type": "Foo::Bar",
//       "Properties": {
//         "Fred": ["Flob", "Cat"]
//       }
//     }
//   }
// }

// The following will NOT throw an assertion error
template.hasResourceProperties('Foo::Bar', {
  Fred: Match.arrayWith(['Flob']),
});

// The following will throw an assertion error
template.hasResourceProperties('Foo::Bar', Match.objectLike({
  Fred: Match.arrayWith(['Wobble']),
}));
```

*Note:* The list of items in the pattern array should be in order as they appear in the
target array. Out of order will be recorded as a match failure.

Alternatively, the `Match.arrayEquals()` API can be used to assert that the target is
exactly equal to the pattern array.

### String Matchers

The `Match.stringLikeRegexp()` API can be used to assert that the target matches the
provided regular expression.

```ts
// Given a template -
// {
//   "Resources": {
//     "MyBar": {
//       "Type": "Foo::Bar",
//       "Properties": {
//         "Template": "const includeHeaders = true;"
//       }
//     }
//   }
// }

// The following will NOT throw an assertion error
template.hasResourceProperties('Foo::Bar', {
  Template: Match.stringLikeRegexp('includeHeaders = (true|false)'),
});

// The following will throw an assertion error
template.hasResourceProperties('Foo::Bar', {
  Template: Match.stringLikeRegexp('includeHeaders = null'),
});
```

### Not Matcher

The not matcher inverts the search pattern and matches all patterns in the path that does
not match the pattern specified.

```ts
// Given a template -
// {
//   "Resources": {
//     "MyBar": {
//       "Type": "Foo::Bar",
//       "Properties": {
//         "Fred": ["Flob", "Cat"]
//       }
//     }
//   }
// }

// The following will NOT throw an assertion error
template.hasResourceProperties('Foo::Bar', {
  Fred: Match.not(['Flob']),
});

// The following will throw an assertion error
template.hasResourceProperties('Foo::Bar', Match.objectLike({
  Fred: Match.not(['Flob', 'Cat']),
}));
```

### Serialized JSON

Often, we find that some CloudFormation Resource types declare properties as a string,
but actually expect JSON serialized as a string.
For example, the [`BuildSpec` property of `AWS::CodeBuild::Project`][Pipeline BuildSpec],
the [`Definition` property of `AWS::StepFunctions::StateMachine`][StateMachine Definition],
to name a couple.

The `Match.serializedJson()` matcher allows deep matching within a stringified JSON.

```ts
// Given a template -
// {
//   "Resources": {
//     "MyBar": {
//       "Type": "Foo::Bar",
//       "Properties": {
//         "Baz": "{ \"Fred\": [\"Waldo\", \"Willow\"] }"
//       }
//     }
//   }
// }

// The following will NOT throw an assertion error
template.hasResourceProperties('Foo::Bar', {
  Baz: Match.serializedJson({
    Fred: Match.arrayWith(["Waldo"]),
  }),
});

// The following will throw an assertion error
template.hasResourceProperties('Foo::Bar', {
  Baz: Match.serializedJson({
    Fred: ["Waldo", "Johnny"],
  }),
});
```

[Pipeline BuildSpec]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-source.html#cfn-codebuild-project-source-buildspec
[StateMachine Definition]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definition

## Capturing Values

The matcher APIs documented above allow capturing values in the matching entry
(Resource, Output, Mapping, etc.). The following code captures a string from a
matching resource.

```ts
// Given a template -
// {
//   "Resources": {
//     "MyBar": {
//       "Type": "Foo::Bar",
//       "Properties": {
//         "Fred": ["Flob", "Cat"],
//         "Waldo": ["Qix", "Qux"],
//       }
//     }
//   }
// }

const fredCapture = new Capture();
const waldoCapture = new Capture();
template.hasResourceProperties('Foo::Bar', {
  Fred: fredCapture,
  Waldo: ["Qix", waldoCapture] as any[],
});

fredCapture.asArray(); // returns ["Flob", "Cat"]
waldoCapture.asString(); // returns "Qux"
```

With captures, a nested pattern can also be specified, so that only targets
that match the nested pattern will be captured. This pattern can be literals or
further Matchers.

```ts
// Given a template -
// {
//   "Resources": {
//     "MyBar1": {
//       "Type": "Foo::Bar",
//       "Properties": {
//         "Fred": ["Flob", "Cat"],
//       }
//     }
//     "MyBar2": {
//       "Type": "Foo::Bar",
//       "Properties": {
//         "Fred": ["Qix", "Qux"],
//       }
//     }
//   }
// }

const capture = new Capture(Match.arrayWith(['Cat']));
template.hasResourceProperties('Foo::Bar', {
  Fred: capture,
});

capture.asArray(); // returns ['Flob', 'Cat']
```

When multiple resources match the given condition, each `Capture` defined in
the condition will capture all matching values. They can be paged through using
the `next()` API. The following example illustrates this -

```ts
// Given a template -
// {
//   "Resources": {
//     "MyBar": {
//       "Type": "Foo::Bar",
//       "Properties": {
//         "Fred": "Flob",
//       }
//     },
//     "MyBaz": {
//       "Type": "Foo::Bar",
//       "Properties": {
//         "Fred": "Quib",
//       }
//     }
//   }
// }

const fredCapture = new Capture();
template.hasResourceProperties('Foo::Bar', {
  Fred: fredCapture,
});

fredCapture.asString(); // returns "Flob"
fredCapture.next();     // returns true
fredCapture.asString(); // returns "Quib"
```

## Asserting Annotations

In addition to template matching, we provide an API for annotation matching.
[Annotations](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Annotations.html)
can be added via the [Aspects](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Aspects.html)
API. You can learn more about Aspects [here](https://docs.aws.amazon.com/cdk/v2/guide/aspects.html).

Say you have a `MyAspect` and a `MyStack` that uses `MyAspect`:

```ts nofixture
import * as cdk from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';

class MyAspect implements cdk.IAspect {
  public visit(node: IConstruct): void {
    if (node instanceof cdk.CfnResource && node.cfnResourceType === 'Foo::Bar') {
      this.error(node, 'we do not want a Foo::Bar resource');
    }
  }

  protected error(node: IConstruct, message: string): void {
    cdk.Annotations.of(node).addError(message);
  }
}

class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stack = new cdk.Stack();
    new cdk.CfnResource(stack, 'Foo', {
      type: 'Foo::Bar',
      properties: {
        Fred: 'Thud',
      },
    });
    cdk.Aspects.of(stack).add(new MyAspect());
  }
}
```

We can then assert that the stack contains the expected Error:

```ts
// import { Annotations } from '@aws-cdk/assertions';

Annotations.fromStack(stack).hasError(
  '/Default/Foo',
  'we do not want a Foo::Bar resource',
);
```

Here are the available APIs for `Annotations`:

- `hasError()`, `hasNoError()`, and `findError()`
- `hasWarning()`, `hasNoWarning()`, and `findWarning()`
- `hasInfo()`, `hasNoInfo()`, and `findInfo()`

The corresponding `findXxx()` API is complementary to the `hasXxx()` API, except instead
of asserting its presence, it returns the set of matching messages.

In addition, this suite of APIs is compatible with `Matchers` for more fine-grained control.
For example, the following assertion works as well:

```ts
Annotations.fromStack(stack).hasError(
  '/Default/Foo',
  Match.stringLikeRegexp('.*Foo::Bar.*'),
);
```

## Asserting Stack tags

Tags applied to a `Stack` are not part of the rendered template: instead, they
are included as properties in the Cloud Assembly Manifest. To test that stacks
are tagged as expected, simple assertions can be written.

Given the following setup:

```ts nofixture
import { App, Stack } from 'aws-cdk-lib';
import { Tags } from 'aws-cdk-lib/assertions';

const app = new App();
const stack = new Stack(app, 'MyStack', {
  tags: {
    'tag-name': 'tag-value',
  },
});
```

It is possible to test against these values:

```ts
const tags = Tags.fromStack(stack);

// using a default 'objectLike' Matcher
tags.hasValues({
  'tag-name': 'tag-value',
});

// ... with Matchers embedded
tags.hasValues({
  'tag-name': Match.stringLikeRegexp('value'),
});

// or another object Matcher at the top level
tags.hasValues(Match.objectEquals({
  'tag-name': Match.anyValue(),
}));
```

When tags are not defined on the stack, it is represented as an empty object
rather than `undefined`. To make this more obvious, there is a `hasNone()`
method that can be used in place of `Match.exactly({})`. If `Match.absent()` is
passed, an error will result.

```ts
// no tags present
Tags.fromStack(stack).hasNone();

// don't use absent() at the top level, it won't work
expect(() => { Tags.fromStack(stack).hasValues(Match.absent()); }).toThrow(/will never match/i);
```
