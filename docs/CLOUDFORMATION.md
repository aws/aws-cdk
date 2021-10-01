# CloudFormation internals

This is documenting CloudFormation internals, that may come in useful when developing
custom resources, working on the CLI or debugging CloudFormation operations.

If you are a user of the CDK, you do not need to read this (except maybe out of interest).

## CloudFormation stack lifecycle

This shows the states a CloudFormation stack goes through in its lifetime.

For the `_IN_PROGRESS` states, the letter `[C,U,D]` indicates whether in that
state resource `Creates`, `Updates` or `Deletes` are performed.

`GetTemplate` will return:

- For `Creates`: the template that we are creating. During rollback of a `Create`, it
  will show the template that failed to create.
- For `Updates`: during the roll-forward it will return the template we are updating
  to. During rollback, it will show the template we are rolling back to.

```text
      ╔══════════════════╗
      ║                  ║
      ║  <nonexistant>   ║──────────────────┐
      ║                  ║                  ▼
      ╚══════════════════╝       ┌────────────────────┐
                │                │                    │
                │                │ REVIEW_IN_PROGRESS │
                │                │                    │
                │                └────────────────────┘
                │                           │
                ├───────────────────────────┘
                ▼
     ┌────────────────────┐      ┌─────────────────────┐       ╔════════════════════╗
     │                    │      │                     │       ║                    ║
     │ CREATE_IN_PROGRESS │─────▶│ROLLBACK_IN_PROGRESS │──┬───▶║   CREATE_FAILED    ║
     │        [C]         │      │         [D]         │  │    ║                    ║
     └────────────────────┘      └─────────────────────┘  │    ╚════════════════════╝
                │                                         ▼
                │                              ╔════════════════════╗
                │                              ║                    ║
                │                              ║  ROLLBACK_FAILED   ║
                │                              ║                    ║
                ▼                              ╚════════════════════╝
   ╔═════════════════════════╗
   ║     CREATE_COMPLETE     ║
┌──║     UPDATE_COMPLETE     ║◀─────────────────────────────────┬─────────────────┐
│  ║UPDATE_ROLLBACK_COMPLETE ║                                  │                 │
│  ╚═════════════════════════╝                                  │                 │
│               │                                               │                 │
│               │                                               │                 │
│               ▼                                               │                 │
│    ┌────────────────────┐                          ┌────────────────────┐       │
│    │                    │                          │  UPDATE_COMPLETE_  │       │
│    │ UPDATE_IN_PROGRESS │─────────────────────────▶│CLEANUP_IN_PROGRESS │       │
│    │       [C,U]        │                          │        [D]         │       │
│    └────────────────────┘◀────────────────────┐    └────────────────────┘       │
│               │                               │                                 │
│               ├──────────────────┐            │                                 │
│               │                  ▼            │                                 │
│               │       ╔════════════════════╗  │                                 │
│               │       ║   (no-rollback)    ║  │                                 │
│               │       ║   UPDATE_FAILED    ║──┘                                 │
│               │       ║                    ║                                    │
│               │       ╚════════════════════╝                                    │
│               │                  │                                              │
│               ├──────────────────┘                                              │
│               ▼                                                                 │
│    ┌────────────────────┐                     ┌──────────────────────────────┐  │
│    │  UPDATE_ROLLBACK_  │                     │  UPDATE_ROLLBACK_COMPLETE_   │  │
│    │    IN_PROGRESS     │────────────────────▶│     CLEANUP_IN_PROGRESS      │──┘
│    │        [U]         │                     │             [D]              │
│    └────────────────────┘                     └──────────────────────────────┘
│    │                    ▲
│    ▼                    │
│    ╔════════════════════╗
│    ║  UPDATE_ROLLBACK_  ║
│    ║       FAILED       ║
│    ║                    ║
│    ╚════════════════════╝
│               │
│               │
│               ▼
│    ┌─────────────────────┐        ╔════════════════════╗
│    │ DELETE_IN_PROGRESS  │        ║                    ║
└───▶│         [D]         │───────▶║   DELETE_FAILED    ║
     │                     │        ║                    ║
     └─────────────────────┘        ╚════════════════════╝
                │
                │
                ▼
     ╔════════════════════╗
     ║                    ║
     ║  DELETE_COMPLETE   ║
     ║                    ║
     ╚════════════════════╝
```

### Rollbacks

When rolling back:

* `ROLLBACK_IN_PROGRESS` will exclusively do deletes.
* `UPDATE_ROLLBACK_IN_PROGRESS` will do updates,
  `UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS` will do deletes, including for
  resources that got created in this update.