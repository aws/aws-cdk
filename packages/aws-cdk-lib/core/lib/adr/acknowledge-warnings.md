# Acknowledge Warnings

## Status

accepted

## Context

Construct authors can add messages that will be printed at synthesis. It
possible to add three types of warnings:

- `INFO`: Prints the info on synthesis
- `WARN`: Prints the warning on synthesis. Can also throw an error if the `--strict`
  argument is used
- `ERROR`: Throws an error with the message

Warning messages are typically used for two types of messages:

1. Things that are errors (and will error on deployment) in some cases, but not all. For example, a warning is
   used when > 10 managed policies are added to an IAM Role because that is the
   initial limit for AWS accounts. An error is not used because it is possible
   to increase the limit.
2. Things that are not errors (and will deploy successfully), but might be
   sub-optimal configuration. For example, a warning is used when an Serverless
   V2 Aurora cluster is created and no reader instances are created in tiers
   0-1. This is a valid configuration, but could cause availability issues in
   certain scenarios.

Users who are developing CDK applications may want to always use the `--strict`
CLI argument to turn all warnings into errors. Currently this is probably not
possible since as soon as one warning is not applicable they can no longer use
`--strict`. Ideally they should be able to `acknowledge` warnings (similar to
what they can do with notices) indicating that the warning is not applicable to
them/they acknowledge the risk.

```ts
Annotations.of(this).acknowledgeWarning(
  '@aws-cdk/aws-iam:maxPoliciesExceeded',
  'A limit increase has been submitted',
);
```

This would allow acknowledgements to live alongside the code so all developers
on the code base would have the information readily available. This also allows
the acknowledgement to be added at a certain `scope` and apply to all child
constructs. Users would be able to acknowledge certain warnings for the entire
app, or for a specific scope.

## Constraints

Warnings are currently added with the `Annotations` API.

```ts
Annotations.of(scope).addWarning('This is a warning');
```

`Annotations.of(scope)` creates a new instance of `Annotations` every time so
there is no way to keep track of warnings added. For example, doing something
like this would not work because the `Annotations` instance created with
`acknowledgeWarning` would be different than the one created with `addWarning`.

```ts
Annotations.of(scope).addWarning('This is a warning');
Annotations.of(scope).acknowledgeWarning('This is a warning');
```

Currently the storage mechanism for `Annotations` is the `Node` metadata. The
warning is added to the node as node metadata which is read by the CLI after
synthesis to print out the messages. This means that Annotations can be added
during `synthesis`.

Another constraint is that currently you add a warning with only the message.
There is no unique identifier. This means that to add an acknowledgement the
user would need to copy the entire message.

## Decision

We will deprecate the `addWarning` method and add a new method `addWarningV2`

```ts
  /**
   * @param id the unique identifier for the warning. This can be used to acknowledge the warning
   * @param message The warning message.
   */
  public addWarningV2(id: string, message: string): void
```

We will add a new method `acknowledgeWarning` that will allow users to
acknowledge a specific warning by `id`.

```ts
  /**
   * @param id - the id of the warning message to acknowledge
   * @param message optional message to explain the reason for acknowledgement
   */
  public acknowledgeWarning(id: string, message?: string): void
```

We will continue to use the node metadata as the storage mechanism and will add
a new metadata type `aws:cdk:acknowledge` to store information on
acknowledgements.

At synthesis when we collect all of the annotation messages, we will filter out
any messages that have an acknowledgement.

Storing the acknowledgements in the metadata will also allow us to report on
warnings that were acknowledged by the user (info will be stored in the
assembly).

## Alternatives

### Alternative storage mechanism

One alternative that was considered was to implement some alternative
intermediary storage mechanism. This storage mechanism would allow storing all
warnings and acknowledgements in a special construct that was created once per
app. It would look something like this (pseudo code)

```ts
class AnnotationManager extends Construct {
  private constructor(scope: Construct) {
    attachCustomSynthesis(this, {
      onSynthesize: () => {
        this.warnings.forEach(warning => node.addMetadata(...))
      }
    }
  }
 
  public addWarning() {
     if (!this.acks.has()) {
       this.warnings.set();
    }
  }
  public ack() {
    if (this.warnings.has()) {
      this.warnings.delete();
    }
    this.acks.add();
  }
}
```

The problem with this method is represented by the `attachCustomSynthesis` in
the example. This same applies for if we used `addValidation` or `Aspects`.
Annotations can be added _after_ that which means they would not be added or
acknowledged.

### Use context and remove metadata

Another alternative that was considered was to use context to set
acknowledgements. This would look something like this:

```ts
public acknowledgeWarning(id: string, message?: string) {
  this.scope.node.setContext(id, message ?? true); // can't do this today
  this.scope.node.removeMetadata(id); // this method does not exist
}
public addWarningV2(id: string, message: string) {
  if (this.scope.node.tryGetContext(id) === undefined) {
    this.addMessage(...);
  }
}
```

There are two issues with this alternative.

1. It is currently not possible to `node.setContext` once children are added. We
   would have to first remove that limitation. I think this could lead to a lot
   of issues where users have to keep track of _when_ context is added.
2. We would have to implement the ability to `removeMetadata` from a node. This
   functionality doesn't make much sense outside of this context (can't find
   where anybody has asked for it). It also may require updating the metadata
   types since currently there is no unique identifier for a given metadata
   entry (other than the message).

## Consequences

With the recommended solution the only major consequence is that it requires
updating the `metadata-schema`, but we can do this in a non-breaking way
(addition of new types). The alternatives may also require changes to the schema
as well.
