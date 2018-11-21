
----

### Pull Request Checklist

Please check all boxes (including N/A items)

#### Testing

- [ ] Unit test and/or integration test added
- [ ] __Toolkit change?:__ [integration
tests](https://github.com/awslabs/aws-cdk/blob/master/packages/aws-cdk/integ-tests/test.sh)
manually executed (paste output to the PR description)
- [ ] __Init template change?:__ coordinated update of integration tests
(currently maintained a private repo).

#### Documentation

- [ ] __README__: README and/or documentation topic updated
- [ ] __jsdocs__: All public APIs documented

### Title and description

- [ ] __Change type__: Title is prefixed with change type:
 * `fix(module): <title>` bug fix (_patch_)
 * `feat(module): <title>` feature/capability (_minor_)
 * `chore(module): <title> ` won't appear in changelog
 * `build(module): <title>` won't appear in changelog
- [ ] __Title format__: Title uses lower case and doesn't end with a period
- [ ] __Breaking change?__: Description ends with: `BREAKING CHANGE: <one
line which describes exactly what changed and how to achieve similar
behavior after the change>`
- [ ] __References__: Indicate issues fixed via: `Fixes #xxx` or `Closes #xxx`

----

By submitting this pull request, I confirm that my contribution is made under the terms of the Apache-2.0 license.
