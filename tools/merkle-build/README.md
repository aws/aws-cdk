merkle-build
============

Simple routines to speed up build by only rebuilding packages whose source
(or in-tree dependencies) have changed.

Optimization
-------------

Since our build involves a lot of separate invocations of build tools on the
same (symlinked) directories over and over, it's a bit wasteful to keep on
calculating the same checksums.

Speed up the build by setting the environment variable:

    MERKLE_BUILD_CACHE

To point to a temporary directory. If set, that directory will be used
as an out-of-process cache for the `merkle-build` library.

Since cache invalidation is one of the hard problems of computer science,
you should be careful to not introduce inconsistencies by (accidentally)
sharing the cache between build runs.
