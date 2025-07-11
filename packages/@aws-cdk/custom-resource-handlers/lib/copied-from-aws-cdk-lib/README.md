# Type definitions copied from 'aws-cdk-lib'

`aws-cdk-lib` depends on this package; but this package depends on some
types defined in `aws-cdk-lib`.

This cyclic dependency leads to a non-executable build graph. In order to
break the cycle, we're just copying some types over from `aws-cdk-lib`.

I readily admit this is not a great long-term solution, but those types have
been stable for years and are unlikely to change. The correct solution would
probably be to externalize them into a separate package, but even the most
simple solution of that accord would require bundling the types into
`aws-cdk-lib` with `bundledDependencies` and that requires us writing a
replacement for `npm pack`, because by default NPM will refuse to bundle
`bundledDependencies` that have been symlinked into a local workspace (in fact,
it will silently ignore them).

We can build our own replacement for `npm pack`, or we can do a little
copy/paste.  I'm opting for the latter.

