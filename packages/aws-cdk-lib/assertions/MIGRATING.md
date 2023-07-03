# Migrating to Assertions

Most of the APIs in the old `assert` module has a corresponding API in `assertions`.
Make the following modifications to your CDK test files to migrate to the
`@aws-cdk/assertions` module.

For a migration script that handles most common use cases for you, see
[Migration Script](migration-script).

## Translation Guide

- Rewrite module imports that use `@aws-cdk/aws-assert` to `@aws-cdk/aws-assertions`.
  For example:

  ```ts
  import '@aws-cdk/assert/jest';
  import { ABSENT, SynthUtils, ResourcePart } from '@aws-cdk/assert';
  ```

  ...becomes...

  ```ts
  import { Template } from '@aws-cdk/assertions';
  import { Match, Template } from '@aws-cdk/assertions';
  ```

- Replace instances of `toHaveResource()` with `hasResourceProperties()` or `hasResource()`.
  For example:

  ```ts
  expect(stack).toHaveResource('FOO::BAR', {/*...*/});
  expect(stack).toHaveResource('FOO::BAR', {/*...*/}, ResourcePart.CompleteDefinition);
  ```

  ...becomes...

  ```ts
  Template.fromStack(stack).hasResourceProperties('FOO::BAR', {/*...*/});
  Template.fromStack(stacK).hasResource('FOO::BAR', {/*...*/});
  ```

- Replace instances of `toCountResources()` with `resourceCountIs`. For example:

  ```ts
  expect(stack).toCountResources('FOO::BAR', 1);
  ```

  ...becomes...

  ```ts
  Template.fromStack(stack).resourceCountIs('FOO::BAR', 1);
  ```
- Replace instances of `toMatchTemplate()` with `templateMatches()`. For example:

  ```ts
  expect(stack).toMatchTemplate({/*...*/});
  ```

  ...becomes...

  ```ts
  Template.fromStack(stack).templateMatches({/*...*/});
  ```

- Replace `arrayWith()` with `Match.arrayWith()`, `objectLike()` with `Match.objectLike()`, and
  `ABSENT` with `Match.absent()`.

- `not` can be replaced with `Match.not()` _or_ `resourceCountIs()` depending on the use case.

  ```ts
  // asserting that the stack does not have a particular resource.
  expect(stack).not.toHaveResource('FOO::BAR');
  ```

  ...becomes...

  ```ts
  Template.fromStack(stack).resourceCountIs('FOO::BAR', 0);
  ```

  ```ts
  // asserting that the stack does not have a resource with these properties
  expect(stack).not.toHaveResource('FOO::BAR', {
    prop: 'does not exist',
  });
  ```

  ...becomes...

  ```ts
  Template.fromStack(stack).hasResourceProperties('FOO::BAR', Match.not({
    prop: 'does not exist',
  }));
  ```

- `SynthUtils.synthesize(stack)` can be replaced as well. For example:

  ```ts
  expect(SynthUtils.synthesize(stack).template).toEqual(/*...*/);
  SynthUtils.syntesize(stack);
  ```

  ...becomes...

  ```ts
  expect(Template.fromStack(stack).toJSON()).toEqual(/*...*/);
  App.of(stack).synth();
  ```

## Migration Script

> NOTE: We have some code rewrite rules that will make it easier to migrate from one library
> to the other. This tool will not do a complete rewrite and is not guaranteed to produce 
> compilable code! It will just save you the effort of performing a lot of code substitutions 
> you would otherwise have to do by hand.

Comby is a tool used to do structured code rewriting. You can install it
[here](https://comby.dev/). Download the [rewrite.toml](rewrite.toml) file from our GitHub
repository, and run the following command in the root directory of your project:

```bash
comby -config ~/rewrite.toml -f .ts -d test -in-place -timeout 10
```