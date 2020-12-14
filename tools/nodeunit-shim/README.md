nodeunit-shim
==============

Tiny helper library to move from nodeunit tests to Jest.

Why?
----

Jest tests have a better runner, better error reporting, better matchers,
and nicer syntax. They're just all around nicer. Plus, nodeunit has long
since been deprecated.

Rewriting our existing codebase of nodeunit tests is kind of a hassle though.
Therefore, a tiny adapter layer between the 2 APIs.

How to use
----------

### Update package.json

```json
"devDependencies": {
  // Remove these:
  "@types/nodeunit": "...",
  "nodeunit": "...",

  // Add this
  "nodeunit-shim": "0.0.0",
},
"cdk-build": {
  // Add this
  "jest": true
}
```

### Get jest.config.js

Copy a `jest.config.js` from another package.

### Update .gitignore/.npmignore

Run `yarn pkglint --fix`.

### Rename tests

Rename all test files `test.*.ts` -> `*.test.ts` (be sure to rename
the `.js` as well, or remove them).

### Rewrite tests

Inside every test file:

Replace

```ts
import { Test } from 'nodeunit';
```

with

```ts
import { nodeunitShim, Test } from 'nodeunit-shim';
```

and replace:

```ts
export = {
  // ...
};
```

with:

```ts
nodeunitShim({
  // ...
});
```

