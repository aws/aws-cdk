# Assertions
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

Functions for writing test asserting against CDK applications, with focus on CloudFormation templates.

The `Template` class includes a set of methods for writing assertions against CloudFormation templates. Use one of the `Template.fromXxx()` static methods to create an instance of this class.

To create `Template` from CDK stack, start off with:

```ts nofixture
import { Stack } from '@aws-cdk/core';
import { Template } from '@aws-cdk/assertions';

const stack = new Stack(/* ... */);
// ...
const template = Template.fromStack(stack);
```

Alternatively, assertions can be run on an existing CloudFormation template -

```ts fixture=init
const templateJson = '{ "Resources": ... }'; /* The CloudFormation template as JSON serialized string. */
const template = Template.fromString(templateJson);
```

## Full Template Match

The simplest assertion would be to assert that the template matches a given
template.

```ts
const expected = {
  Resources: {
    BarLogicalId: {
      Type: 'Foo::Bar',
      Properties: {
        Baz: 'Qux',
      },
    },
  },
};

template.templateMatches(expected);
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

## Resource Matching & Retrieval

Beyond resource counting, the module also allows asserting that a resource with
specific properties are present.

The following code asserts that the `Properties` section of a resource of type
`Foo::Bar` contains the specified properties -

```ts
const expected = {
  Foo: 'Bar',
  Baz: 5,
  Qux: [ 'Waldo', 'Fred' ],
};
template.hasResourceProperties('Foo::Bar', expected);
```

Alternatively, if you would like to assert the entire resource definition, you
can use the `hasResource()` API.

```ts
const expected = {
  Properties: { Foo: 'Bar' },
  DependsOn: [ 'Waldo', 'Fred' ],
};
template.hasResource('Foo::Bar', expected);
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
const expected = {
  Value: 'Bar',
  Export: { Name: 'ExportBaz' },
};
template.hasOutput('*', expected);
```

`findOutputs()` will return a set of outputs that match the `logicalId` and `props`,
and you can use the `'*'` special case as well.

```ts
const expected = {
  Value: 'Fred',
};
const result = template.findOutputs('*', expected);
expect(result.Foo).toEqual({ Value: 'Fred', Description: 'FooFred' });
expect(result.Bar).toEqual({ Value: 'Fred', Description: 'BarFred' });
```

The APIs `hasMapping()` and `findMappings()` provide similar functionalities.

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
const expected = {
  Fred: Match.objectLike({
    Wobble: 'Flob',
  }),
};
template.hasResourceProperties('Foo::Bar', expected);

// The following will throw an assertion error
const unexpected = {
  Fred: Match.objectLike({
    Brew: 'Coffee',
  }),
}
template.hasResourceProperties('Foo::Bar', unexpected);
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
const expected = {
  Fred: Match.objectLike({
    Bob: Match.absent(),
  }),
};
template.hasResourceProperties('Foo::Bar', expected);

// The following will throw an assertion error
const unexpected = {
  Fred: Match.objectLike({
    Wobble: Match.absent(),
  }),
};
template.hasResourceProperties('Foo::Bar', unexpected);
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
const expected = {
  Fred: {
    Wobble: [Match.anyValue(), "Flip"],
  },
};
template.hasResourceProperties('Foo::Bar', expected);

// The following will throw an assertion error
const unexpected = {
  Fred: {
    Wimble: Match.anyValue(),
  },
};
template.hasResourceProperties('Foo::Bar', unexpected);
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
const expected = {
  Fred: Match.arrayWith(['Flob']),
};
template.hasResourceProperties('Foo::Bar', expected);

// The following will throw an assertion error
const unexpected = Match.objectLike({
  Fred: Match.arrayWith(['Wobble']),
});
template.hasResourceProperties('Foo::Bar', unexpected);
```

*Note:* The list of items in the pattern array should be in order as they appear in the
target array. Out of order will be recorded as a match failure.

Alternatively, the `Match.arrayEquals()` API can be used to assert that the target is
exactly equal to the pattern array.

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
const expected = {
  Fred: Match.not(['Flob']),
};
template.hasResourceProperties('Foo::Bar', expected);

// The following will throw an assertion error
const unexpected = Match.objectLike({
  Fred: Match.not(['Flob', 'Cat']),
});
template.hasResourceProperties('Foo::Bar', unexpected);
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
const expected = {
  Baz: Match.serializedJson({
    Fred: Match.arrayWith(["Waldo"]),
  }),
};
template.hasResourceProperties('Foo::Bar', expected);

// The following will throw an assertion error
const unexpected = {
  Baz: Match.serializedJson({
    Fred: ["Waldo", "Johnny"],
  }),
};
template.hasResourceProperties('Foo::Bar', unexpected);
```

[Pipeline BuildSpec]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-source.html#cfn-codebuild-project-source-buildspec
[StateMachine Definition]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definition

## Capturing Values

This matcher APIs documented above allow capturing values in the matching entry
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
const expected = {
  Fred: fredCapture,
  Waldo: ["Qix", waldoCapture],
}
template.hasResourceProperties('Foo::Bar', expected);

fredCapture.asArray(); // returns ["Flob", "Cat"]
waldoCapture.asString(); // returns "Qux"
```
