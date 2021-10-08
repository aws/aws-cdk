# Vendored modules

Only for build tools.

## @lerna/package-graph

A patched version of the module that drastically improves the time it takes to
check for cycles in the package dependency graph (5 minutes down to 1 second).

Uses a cache to avoid checking the same node twice. Submitted upstream
as: https://github.com/lerna/lerna/pull/2874

Before:

```
$ time node_modules/.bin/lerna exec pwd
...
lerna success exec Executed command in 217 packages: "pwd"
      273.24 real       272.27 user         2.04 sys
```

After:

```
$ time node_modules/.bin/lerna exec pwd
...
lerna success exec Executed command in 219 packages: "pwd"
        1.11 real         0.99 user         0.82 sys
```

## jsii-pacmak+1.38.0.patch

jsii-pacmak@1.38.0 has a bug that means all packages are packed in parallel for
several languages. This can cause issues on the v2 build, where the alpha modules
rely on aws-cdk-lib, but may be packed first. A fix will go out in 1.39.0, but in
the meantime, this patch allows us to more quickly verify the fix and get our
pipeline green again.
