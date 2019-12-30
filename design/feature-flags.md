# Feature Flags

Sometimes we want to introduce new breaking behavior because we believe this is
the correct default behavior for the CDK. The problem, of course, is that
breaking changes are only allowed in major versions and those are rare.

This document describes a proposal for a pattern/mechanism called feature flags.
It will allow us to introduce breaking behavior which is disabled by default (so
existing projects will not be affected) but enabled automatically for new
projects created through `cdk init`.

## Approach

The basic idea is that new breaking behavior will always be disabled by default
and only enabled when a certain CDK context parameter is set. If not enabled,
the system will continue to behave exactly like it used to without breaking any
existing projects.

When we release a new major version of the AWS CDK, we will flip this behavior
or completely remove the legacy behavior.

In order for new projects to pick up this new behavior automatically, we will
modify `cdk init` to inject the set of feature flags into the generated
`cdk.json` file. This means that the new project will have the latest behavior,
but projects that were created prior to the introduction of this feature will
have the same legacy behavior based on the set of capabilities that were
available at the time of the project's creation. This list will be cleaned up
every time we release a major version of course.

Using fine-grained flags will allow users of old projects to pick up specific
new behaviors by manually adding the specific keys to their `cdk.json`
file, without risking breakage in other unexpected areas.

## Alternative Considered
 
We considered an alternative of "bundling" new capabilities under a single flag
that specifies the CDK version which created the project, but this means that
users won't have the ability to pick and choose which capabilities they
want to enable in case they need them but don't want to take the risk of
unexpected changes.
 
The downside of the fine-grained approach is that it could result in a "blowing
up" new `cdk.json` files in case there will be many new breaking capabilities
between major releases. But this is hypothetical and even if this list ends up
with 20 features before we release the next major version, I still think the
benefits outweigh the risks of the alternative approach.

## Design

Context keys for feature flags will be listed in `cx-api/lib/features.ts` and
will take the form: `<module>:<feature>`. 

For example:

- `@aws-cdk/core:enableStackNameDuplicates`
- `@aws-cdk/aws-cloudformation:doNotCapitalizeCustomResourcePropertyNames`.

Using the module name will allow easy tracing of the code that consumes this
flag.

The configuration for which feature flags should be enabled for new projects
will be under `cx-api/lib/future.ts` and will be encoded as a simple context
hash that will be injected by `cdk init` to all `cdk.json` files generated for
new projects.

We will mandate that when a feature or bug fix is introduced under a feature
flag, the CHANGELOG will include:

- The suffix `(under feature flag)` in the title.
- A `BREAKING CHANGES` paragraph will be added which describes the *new*
  behavior but disclaims that it will only apply to new projects created through
  `cdk init`. It will also indicate the context key this flag uses for users who
  wish to enable it manually in their project.

Since feature flags can have implications on framework behavior, we need to
ask users to include the list of enabled features in bug reports. At a minimum,
we can request that they paste a copy of their `cdk.json` and `cdk.context.json`,
but a better experience would be to include this information in the output of
`cdk doctor` and request users to include this output in bug reports.

## Developer Experience

Here's the developer experience:

1. Seek the approval of a core team member that a feature flag can be used.
1. Define a new const under
   [cx-api/lib/features.ts](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/cx-api/lib/features.ts)
   with the name of the context key that **enables** this new feature (for
   example, `ENABLE_STACK_NAME_DUPLICATES`). The context key should be in the
   form `module.Type:feature` (e.g. `@aws-cdk/core:enableStackNameDuplicates`).
2. Use `node.tryGetContext(cxapi.ENABLE_XXX)` to check if this feature is enabled
   in your code. If it is not defined, revert to the legacy behavior.
3. Add your feature flag to
   [cx-api/lib/future.ts](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/cx-api/lib/future.ts).
   This map is inserted to generated `cdk.json` files for new projects created
   through `cdk init`.
4. In your PR title (which goes into CHANGELOG), add a `(under feature flag)` suffix. e.g:

    ```
    fix(core): impossible to use the same physical stack name for two stacks (under feature flag)
    ```
5. Under `BREAKING CHANGES`, add a prefix `(under feature flag)` and the name of the flag in the postfix. 
   For example:

    ```
    BREAKING CHANGE: (under feature flag) template file names for new projects created 
    through "cdk init" will use the template artifact ID instead of the physical stack 
    name to enable  multiple stacks to use the same name (feature flag: @aws-cdk/core:enableStackNameDuplicates)
    ```

## Future Developments

As a general rule, using a feature flag should be last resort in the case where
it is impossible to implement backwards compatibility. A feature flag is likely
to get less usage and therefore mature slower, so it's important to make sure we
don't abuse this pattern.

Still, a valid concern is that we end up with too many feature flags between
major releases (I would say >20 is too many), in which case it might be required
to offer additional tools to manage and discover them.

Here are a few ideas that came up as we designed this. All of these can be
implemented on top of the proposed mechanism, and should be considered if needed
in the future (as well as any other idea of course):

- Introduce a CLI command to list all flags and enable/disable them in your `cdk.json`.
- Aggregate all flags in groups so it will be easier to enable many of them.
- Define a flag that will allow users to say "I want all feature up until a certain CDK version" (basically enables all features that were available when the version was releases).

## Implementation Plan

- [x] Implement the first feature flag (https://github.com/aws/aws-cdk/pull/4895)
- [x] Update CONTRIBUTING guide with instructions on how to implement feature flags.
- [ ] Add feature flags to `cdk doctor` and update bug report template accordingly to request users to run `cdk doctor`.
- [ ] Document what feature flags are in the CDK Developer Guide, reference cx-api/features.ts, and describe what "BREAKING CHANGE under feature flag" means.
