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

## jsii-rosetta+1.28.0.patch

jsii-rosetta uses multiple worker threads by default to speed up sample extraction.
It defaults to spawning workers equal to half the number of cores. On extremely
powerful build machines (e.g., CodeBuild X2_LARGE compute with 72 vCPUs),
the high number of workers (36) results in thrash and high memory usage due to
duplicate loads of source files. This was causing the v2 builds to fail with:
"FATAL ERROR: NewSpace::Rebalance Allocation failed - JavaScript heap out of memory"

The patch simply limits the top number of worker threads to an arbitrarily-chosen
maximum limit of 16. We could simply disable the worker threads, but this takes much
longer to process. With single-threading, rosetta takes ~35 minutes to extract samples
from the CDK; with 16 workers, it takes ~3.5 minutes.
