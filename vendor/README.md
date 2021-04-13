# Vendored modules

Only for build tools.

## @lerna/package-graph

A vendored version of the module that drastically improves the time it takes to
check for cycles in the package dependency graph (5 minutes down to 1 second).

Uses a cache to avoid checking the same node twice.

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

Code changes are recorded in the `.diff` file.
