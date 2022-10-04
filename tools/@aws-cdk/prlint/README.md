# prlint

A Github action that checks pull requests around PR titles, description and other metadata.

# Checks

### Mandatory Changes

This check validates that the modified files in the PR follow these rules:

1. `feat` requires a change to a `README.md`.
2. `feat` requires a change to a unit test file and integration test files.
3. `fix` requires a change to a unit test file and integration test files.
4. `BREAKING CHANGE` section is formatted correctly, per the [conventional commits] spec.
5. No breaking changes announced for stable modules.

> These rules are currently hard coded, in the future, we should consider using [danger.js](https://danger.systems/js/).

[conventional commits]: https://www.conventionalcommits.org

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
