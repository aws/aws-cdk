# eslint-plugin-cdk

Eslint plugin for the CDK repository. Contains rules that need to be applied specific to the CDK repository.

## Rules

* `no-core-construct`: Forbid the use of `Construct` and `IConstruct` from the "@aws-cdk/core" module.
  Instead use `Construct` and `IConstruct` from the "constructs" module.
  Rule only applies to typescript files under the `test/` folder.

## How to add new rules

* Make a new file in `lib/rules`. It should export one function called `create`. The
  `create` function should return a visitor object.
* According to the docs, typing doesn't currently work. I didn't investigate.
* Add the new file to `lib/index.ts`.
* Add a fixture directory under `test/fixtures/<rule name>`. Copy and adjust an `eslintrc.js` file
  from another test.
* Add a testing `.ts` file, and be sure to add either an `expected.ts` or an `.error.txt` variant
  as well!
* You can now run the test in debugging mode (make sure to have `npx tsc -w` running, then from a debugging terminal, `npx jest --no-coverage -it 'your rule name'`), set a breakpoint, and inspect the typeless objects.

To activate it for real on the repo, also add it to `cdk-build-tools/config/eslintrc.js`.