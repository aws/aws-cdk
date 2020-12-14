Patch notes:

- Replace `test.sh` since we removed the old test exclusion
  mechanism, and the `cli.exclusions.js` file that the old `test.sh`
  depended upon.

- We removed the old asset-publishing role from the new bootstrap
  stack, and split it into separate file- and docker-publishing roles.
  Since 1.44.0 would still expect the old asset-publishing role,
  its test would fail, so we disable it:

```
test.skip('deploy new style synthesis to new style bootstrap', async () => {
```

There is a better mechanism for skipping certain tests by using `skip-tests.txt`,
but that one is only available AFTER this release, so for this version we just replace
source files.
