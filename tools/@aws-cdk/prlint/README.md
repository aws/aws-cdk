# prlint

This package includes a GitHub Action that does the following:
- Checks pull requests around PR titles, description and other metadata.
- Assesses whether or not the PR is ready for review and attaches the correct label to the PR.

# Rules

The first part of the GitHub Action validates whether or not the pull request adheres
(or has been exempted from) to the following rules:

1. `feat` requires a change to a `README.md` (exemption is the label `pr-linter/exempt-readme`).
2. Both `feat` and `fix` PRs require a change to a unit test file and integration test files (exemption is the label `pr-linter/exempt-unit-test` or `pr-linter/exempt-integ-test`).
4. `BREAKING CHANGE` section is formatted correctly, per the [conventional commits] spec.
5. No breaking changes announced for stable modules.
6. Title prefix and scope is formatted correctly.
7. The PR is not opened from the main branch of the author's fork.
8. Changes to the cli have been run through the test pipeline where cli integ tests are run (indicated by the label `pr-linter/cli-integ-tested`).
9. No manual changes to `packages/aws-cdk-lib/region-info/build-tools/metadata.ts` file.

> These rules are currently hard coded, in the future, we should consider using [danger.js](https://danger.systems/js/).

[conventional commits]: https://www.conventionalcommits.org

# Evaluation and Assigning Labels

The GitHub Action also handles whether or not the PR is ready for review, and by whom.
A PR is ready for review when:

1. It is not a draft
2. It does not have any merge conflicts
3. The PR linter is not failing OR the user has requested an exemption (`pr-linter/exemption-requested`)
4. A maintainer has not requested changes
5. A maintainer has not approved

If the PR is ready for review, we also differentiate whether or not it is ready for a
maintainer review (`pr/needs-maintainer-review`) or if we are soliciting help from our
pool of trusted reviewers (`pr/needs-community-review`).

A PR is prioritized for core team review when:

1. It links to a p1 issue
2. It links to a p2 issue and has an approved community review

Based on the above rules, prlint will apply the correct label `pr/needs-maintainer-review` or `pr/needs-community-review`
to the PR.

# Installation

```console
cd tools/prlint
yarn install
```

# Usage

The steps for your Github action would look something like this -

```yaml
steps:
  - name: Checkout # checkout the package that contains prlint
    uses: actions/checkout@v2

  - name: Install & Build # install & build prlint
    run: cd path/to/prlint && yarn install --frozen-lockfile && yarn build

  - name: Lint
    uses: ./path/to/prlint
    env:
      REPO_ROOT: ${{ github.workspace }}
```
