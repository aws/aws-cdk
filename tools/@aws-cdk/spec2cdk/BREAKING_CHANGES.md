# Breaking changes in the schema and spec2cdk

As a rule, we try to avoid changes that break backwards compatibility in the
CDK. What that means is that programs that used to "work" before the change ,
continue to "work" after the change. For CDK, we define a "working program" to
mean: it type checks successfully, it produces deployable infrastructure, and
that deployed infrastructure represents the author's most likely intent.

A chunk of CDK's code is not hand-written, but automatically generated
based on the CloudFormation specification in `@aws-cdk/aws-service-spec`. Changes
that come in via that specification have an impact on the backwards compatibility
of the CDK library.

This document describes the philosophy of how we deal with breaking changes
coming in from there.

## Types of brakage


Not all breakage is the same. There are 2 types of breakage:

- **Fundamental breakage in the underlying data contract**. For example,
  optional properties becoming required, or properties disappearing. These are
  equally breaking for direct CloudFormation users as for CDK users.
- **Breakage introduced by our translation of CloudFormation -> code**. These are
  changes that wouldn't be breaking to direct CloudFormation users, but end up being
  breaking for code-based users because upstream changes have ripple effects
  on generated code that end up breaking.

### Data contract breakage

Examples of this are optional properties becoming required, or properties disappearing. These are
equally breaking for direct CloudFormation users as for CDK users.

Because this breakage is severe, changes like this are only allowed to be made
for extremely good reasons. Usually that reason is: "our schema was mistaken
previously, but after this change it's actually true". We would be doing our
users a disservice if we disallowed changes like this, so we let them through.

Mechanically, we mark all generated API elements as `@stability external`, which leads to the `jsii-diff`
tool we use to check backwards compatibility skipping them.

### Code translation breakage

There are also changes that wouldn't affect users that were writing CloudFormation templates directly,
but because of choices we have had to make to represent CloudFormation types in code, the changes
do affect users. Common examples are type names and property capitalization.

Type names don't exist at the CloudFormation level, so changing them is not a
problem for data. But we do use type names as identifiers in code, and so
changing them does introduce breaking changes for users.

Same for capitalization: we recase properties from the CloudFormation
`PascalCase` to programming language `camelCase`.

We do try to avoid these types of breaking changes; they are caused by our own
choices, and we can't fault CloudFormation upstream for making changes that are
transparent to CloudFormation users (that just happen to not be transparent to us).

In practice, what that means is we capture enough data during the ingestion of specification
updates that we can maintain some sort of history of previous specifications, and we take
that history into account when generating code (I'm being deliberately vague about the actual
mechanism here since the mechanism may change, but the intent is the same).

### Case study: evolution of "Json data" type to a modeled type

Here is a perhaps non-obvious result of a transformation choice that CDK makes, which has
impact on backwards compatibility.

Let's say the authors of a hypothetical `DogHouse` resource have an "occupant" that has a name.
In the initial version of their resource, they just put in the spec that the occupant is of type
`object`, with no further details:

```json
{
  "awsCloudFormationType": "AWS::Home::DogHouse",
  "properties": {
    "Occupant": { "type": "object" }
  }
}
```

The documentation would say that a dog has a `Name`, and this is validated at deploy time by the
service during the `CreateDogHouse` call.

CDK would generate the following props interface:

```ts
// CDK generated interface
interface DogHouseProps {
  occupant: any;  // Our best translation of an untyped object
}

// Customer would write the following code
new DogHouse(this, 'DogHouse', {
  occupant: {
    Name: 'Bello',     // <-- note: PascalCase property, because CDK will just pass this
                       // entire object straight through to CloudFormation.
  }
});

// And the CloudFormation template would contain
{
  "Type": "AWS::Home::DogHouse",
  "Properties": {
    "Occupant": {        // <-- recased by CDK
      "Name": "Bello"    // <-- NOT recased by CDK
    }
  }
}
```

Now the `DogHouse` service team decides they can be more helpful to their customers, and be more
clear about the properties allowed on a dog:

```json
{
  "awsCloudFormationType": "AWS::Home::DogHouse",
  "definitions": {
    "Dog": {
      "type": "object",
      "properties": {
        "Name": { "type": "string" }
      }
    }
  }
  "properties": {
    "Occupant": { "$ref": "/definitions/Dog" }
  }
}
```

*This schema change does not affect the validity of the template data!*. The `{
Name: '...' }` object used to just be unvalidated, and now it *is* validated.
This is a perfectly legitimate change in CloudFormation, and it is helpful. But
what happens in CDK?


```ts
// New CDK generated interface after the change
interface DogHouseProps {
  occupant: Dog;   // <-- this is now typed
}

interface Dog {
  name: string;    // <-- since we recognize this property now, lowercase
}

// Here is the customer's old code from before
new DogHouse(this, 'DogHouse', {
  occupant: {
    Name: 'Bello',     // <-- ERROR! "Name" is not a recognized property!
  }
});
```

Existing code that used to work now no longer works after this change! So we
have to do something to prevent that; which in this case is: we cannot change
the type; once a property has ever been emitted as `: any`, we can never
change its type anymore.

The best we can do is perhaps emit the following:

```ts
interface DogHouseProps {
  occupant?: any;     // used to be required, is now optional
  occupantV2?: Dog;   // exactly one of these has to be specified
}
```


But we need additional information from the spec in order to do this correctly.

