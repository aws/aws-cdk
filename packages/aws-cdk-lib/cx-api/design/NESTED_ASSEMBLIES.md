# Nested Assemblies

For the CI/CD project we need to be able to a final, authoritative, immutable
rendition of part of the construct tree. This is a part of the application
that we can ask the CI/CD system to deploy as a unit, and have it get a fighting
chance of getting it right. This is because:

- The stacks will be known.
- Their interdependencies will be known, and won't change anymore.

To that end, we're introducing the concept of an "nested cloud assembly".
This is a part of the construct tree that is finalized independently of the
rest, so that other constructs can reflect on it.

Constructs of type `Stage` will produce nested cloud assemblies.

## Restrictions

### Assets

Right now, if the same asset is used in multiple cloud assemblies, it will
be staged independently in ever Cloud Assembly (making it take up more
space than necessary).

This is unfortunate. We can think about sharing the staging directories
between Stages, should be an easy optimization that can be applied later.

### Dependencies

It seems that it might be desirable to have dependencies that reach outside
a single `Stage`. Consider the case where we have shared resources that
may be shared between Stages. A typical example would be a VPC:

```
                      ┌───────────────┐
                      │               │
                      │   VpcStack    │
                      │               │
                      └───────────────┘
                              ▲
                              │
                              │
                ┌─────────────┴─────────────┐
                │                           │
┌───────────────┼──────────┐     ┌──────────┼───────────────┐
│Stage          │          │     │          │          Stage│
│               │          │     │          │               │
│       ┌───────────────┐  │     │  ┌───────────────┐       │
│       │               │  │     │  │               │       │
│       │   App1Stack   │  │     │  │   App2Stack   │       │
│       │               │  │     │  │               │       │
│       └───────────────┘  │     │  └───────────────┘       │
│                          │     │                          │
└──────────────────────────┘     └──────────────────────────┘
```

This seems like a reasonable thing to want to be able to do.


Right now, for practical reasons we're disallowing dependencies outside
nested assemblies. That is not to say that this can never be made to work,
but as it's really rather a significant chunk of work it has not been
implemented yet. Things to consider:

- Do artifact identifiers need to be globally unique? (Does that destroy
  local assumptions around naming that constructs can make?)
- How are artifacts addressed across assembly boundaries? Are they just the
  absolute name, wherever in the Cloud Assembly tree the artifact is? Do they
  represent a path from the top-level cloud assembly
  (`SubAsm/SubAsm/Artifact`)? Are they relative paths (`../SubAsm/Artifact`)?
- Can there be cyclic dependencies between nested assemblies? Is it okay to
  have both dependencies `AsmA/Stack1 -> AsmB/Stack1`, and `AsmB/Stack2 ->
  AsmA/Stack2`? Why, or why not? How will we ensure that?

Even if we can make the addressing work at the artifact level, at the
construct tree level we'd be giving up the guarantees we are getting from
having `Stage` constructs produce isolated Cloud Assemblies by having
dependencies outside them. Consider having two stages, `StageA` with `StackA`
and `StageB` with `StackB`. We must `synth()` them in some order, either A or
B first. Let's say A goes first (but the same argument obviously holds in
reverse). What if during the `synth()` of `StageB`, we discover `StackB`
introduces a dependency on `StackA`? By that point, `StageA` has already
synthesized and `StackA` has produced a (so-called "immutable") template.
Obviously we can't change that anymore, so we can't introduce that dependency
anymore.

Seems like we should be calling `synth()` on multiple stages consumer-first!

The problem is that we are generally building a Pipeline *producer*-first, since
we are modeling and building it in deployment order, which is the reverse order
the pipeline would `synth()` each of the stages in, in order to build itself.

Since this is all very tricky, let's consider it out of scope for now.