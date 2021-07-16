## Implementation

The following guidelines and recommendations apply are related to the
implementation of AWS constructs.

* [General Principles](#general-principles)
* [Construct IDs](#construct-ids)
* [Errors](#errors)
  * [Avoid Errors If Possible](#avoid-errors-if-possible)
  * [Error reporting mechanism](#error-reporting-mechanism)
  * [Throwing exceptions](#throwing-exceptions)
  * [Never Catch Exceptions](#never-catch-exceptions)
  * [Attaching (lazy) Validators](#attaching--lazy--validators)
  * [Attaching Errors/Warnings](#attaching-errors-warnings)
  * [Error messages](#error-messages)
* [Tokens](#tokens)

### General Principles

* Do not future proof.
* No fluent APIs.
* Good APIs “speak” in the language of the user. The terminology your API uses
  should be intuitive and represent the mental model your user brings over,
  not one that you made up and you force them to learn.
* Multiple ways of achieving the same thing is legitimate.
* Constantly maintain the invariants.
* The fewer “if statements” the better.

### Construct IDs

Construct IDs (the second argument passed to all constructs when they are
defined) are used to formulate resource logical IDs which must be **stable**
across updates. The logical ID of a resource is calculated based on the **full
path** of its construct in the construct scope hierarchy. This means that any
change to a logical ID in this path will invalidate all the logical IDs within
this scope. This will result in **replacements of all underlying resources**
within the next update, which is extremely undesirable.

As described above, use the ID “**Resource**” for the primary resource of an AWS
construct.

Therefore, when implementing constructs, you should treat the construct
hierarchy and all construct IDs as part of the **external contract** of the
construct. Any change to either should be considered and called out as a
breaking change.

There is no need to concatenate logical IDs. If you find yourself needing to
that to ensure uniqueness, it's an indication that you may be able to create
another abstraction, or even just a **Construct** instance to serve as a
namespace:

```ts
const privateSubnets = new Construct(this, 'PrivateSubnets');
const publicSubnets = new Construct(this, 'PublishSubnets');

for (const az of availabilityZones) {
  new Subnet(privateSubnets, az);
  new Subnet(publicSubnets, az, { public: true });
}
```

### Errors

#### Avoid Errors If Possible

Always prefer to do the right thing for the user instead of raising an
error. Only fail if the user has explicitly specified bad configuration. For
example, VPC has **enableDnsHostnames** and **enableDnsSupport**. DNS hostnames
*require* DNS support, so only fail if the user enabled DNS hostnames but
explicitly disabled DNS support. Otherwise, auto-enable DNS support for them.

#### Error reporting mechanism

There are three mechanism you can use to report errors:

* Eagerly throw an exception (fails synthesis)
* Attach a (lazy) validator to a construct (fails synthesis)
* Attach errors to a construct (succeeds synthesis, fails deployment)

Between these, the first two fail synthesis, while the latter doesn't. Failing synthesis
means that no Cloud Assembly will be produced.

The distinction becomes apparent when you consider multiple stacks in the same Cloud
Assembly:

* If synthesis fails due to an error in *one* stack (either by throwing an exception
  or by failing validation), the other stack can also not be deployed.
* In contrast, if you attach an error to a construct in one stack, that stack cannot
  be deployed but the other one still can.

Choose one of the first two methods if the failure is caused by a misuse of the API,
which the user should be alerted to and fix as quickly as possible. Choose attaching
an error to a construct if the failure is due to environmental factors outside the
direct use of the API surface (for example, lack of context provider lookup values).

#### Throwing exceptions

This should be the preferred error reporting method.

Validate input as early as it is passed into your code (ctor, methods,
etc) and bail out by throwing an `Error`. No need to create subclasses of
Error since all errors in the CDK are unrecoverable.

When validating inputs, don't forget to account for the fact that these
values may be `Token`s and not available for inspection at synthesis time.

Example:

```ts
if (!Token.isUnresolved(props.minCapacity) && props.minCapacity < 1) {
  throw new Error(`'minCapacity' should be at least 1, got '${props.minCapacity}'`);
}
```

#### Never Catch Exceptions

All CDK errors are unrecoverable. If a method wishes to signal a recoverable
error, this should be modeled in a return value and not through exceptions.

#### Attaching (lazy) Validators

In the rare case where the integrity of your construct can only be checked
after the app has completed its initialization, call the
**this.node.addValidation()** method to add a validation object. This will
generally only be necessary if you want to produce an error when a certain
interaction with your construct did *not* happen (for example, a property
that should have been configured over the lifetime of the construct, wasn't):

Always prefer early input validation over post-validation, as the necessity
of these should be rare.

Example:

```ts
this.node.addValidation({
  // 'validate' should return a string[] list of errors
  validate: () => this.rules.length === 0
    ? ['At least one Rule must be added. Call \'addRule()\' to add Rules.']
    : []
  }
});
```

#### Attaching Errors/Warnings

You can also “attach” an error or a warning to a construct via
the **Annotations** class. These methods (e.g., `Annotations.of(construct).addWarning`)
will attach CDK metadata to your construct, which will be displayed to the user
by the toolchain when the stack is deployed.

Errors will not allow deployment and warnings will only be displayed in
highlight (unless `--strict` mode is used).

```ts
if (!Token.isUnresolved(subnetIds) && subnetIds.length < 2) {
  Annotations.of(this).addError(`Need at least 2 subnet ids, got: ${JSON.stringify(subnetIds)}`);
}
```

#### Error messages

Think about error messages from the point of view of the end user of the CDK.
This is not necessarily someone who knows about the internals of your
construct library, so try to phrase the message in a way that would make
sense to them.

For example, if a value the user supplied gets handed off between a number of
functions before finally being validated, phrase the message in terms of the
API the user interacted with, not in terms of the internal APIs.

A good error message should include the following components:

* What went wrong, in a way that makes sense to a top-level user
* An example of the incorrect value provided (if applicable)
* An example of the expected/allowed values (if applicable)
* The message should explain the (most likely) cause and change the user can
  make to rectify the situation

The message should be all lowercase and not end in a period, or contain
information that can be obtained from the stack trace.

```ts
// ✅ DO - show the value you got and be specific about what the user should do
`supply at least one of minCapacity or maxCapacity, got ${JSON.stringify(action)}`

// ❌ DO NOT - this tells the user nothing about what's wrong or what they should do
`required values are missing`

// ❌ DO NOT - this error only makes sense if you know the implementation
`'undefined' is not a number`
```

### Tokens

* Do not use FnSub