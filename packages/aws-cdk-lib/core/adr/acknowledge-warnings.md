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
CLI argument to turn all warnings into errors. Currently this is not
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
there is no way to keep track of warnings added inside this object.

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

We want warning acknowledgement to work both before and after the warning is actually emitted.

We therefore do the following:

- When a warning is acknowledged on a construct, we iterate over the already
  added warnings and remove matching warnings. At the same time, we record
  that this warning has been acknowledged on this construct tree.
- When a warning is added, we only add it if it hasn't been acknowledged in
  that location.

## Alternatives

### Filter at synthesis time

Right now, we are filtering in every method call. We could defer the filtering
to when we translate construct tree metadata to cloud assembly metadata.

Right now, removing existing metadata entries requires accessing private APIs
of the `constructs` library, which is not an ideal situation.

At the same time, implementing it there would allow us to generate a suppression
report. We can always still do this.

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


### Acknowledge via context

There is currently no way to configure suppressed warnings via context, which
might be useful to do at the application level (using `cdk.json`). We can always
add this feature in the future if desired.
