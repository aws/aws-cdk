## Documentation

Documentation style (copy from official AWS docs) No need to Capitalize Resource
Names Like Buckets after they've been defined Stability (@stable, @experimental)
Use the word “define” to describe resources/constructs in your stack (instead of
“~~create~~”, “configure”, “provision”).  Use a summary line and separate the
doc body from the summary line using an empty line.

* [Inline Documentation](#inline-documentation)
* [Readme](#readme)

### Inline Documentation

All public APIs must be documented when first introduced
[_awslint:docs-public-apis_].

Do not add documentation on overrides/implementations. The public reference
documentation will automatically copy the base documentation to the derived
APIs, so it's better to avoid the confusion [_awslint:docs-no-duplicates_].

Use the following JSDoc tags: **@param**, **@returns**, **@default**, **@see**,
**@example.**

### Readme

* Header should include maturity level.
* Example for the simple use case should be almost the first thing.
* If there are multiple common use cases, provide an example for each one and
  describe what happens under the hood at a high level
  (e.g. which resources are created).
* Reference docs are not needed.
* Use literate (`.lit.ts`) integration tests into README file.
