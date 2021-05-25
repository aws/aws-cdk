# prlint

A Github action that checks pull requests around PR titles, description and other metadata.

# Checks

### Mandatory Changes

This check validates that the modified files in the PR follow these rules:

1. `feat` requires a change to a `README.md`.
2. `feat` requires a change to a test file.
3. `fix` requires a change to a test file.
4. `BREAKING CHANGE` section is formatted correctly, per the [conventional commits] spec.
5. No breaking changes announced for stable modules.

> These rules are currently hard coded, in the future, we should consider using [danger.js](https://danger.systems/js/).

[conventional commits]: https://www.conventionalcommits.org

# Installation

```console
cd tools/prlint
npm install
```

# Usage

The steps for your Github action would look something like this -

```yaml
steps:
  - name: Checkout # checkout the package that contains prlint
    uses: actions/checkout@v2

  - name: Install & Build # install & build prlint
    run: cd path/to/prlint && npm ci && npm build

  - name: Lint
    uses: ./path/to/prlint
```

# Testing locally

To test the linter against an actual PR locally, run

```console
node lint.js validatePr 5857

Creating un-authenticated GitHub Client
⌛  Fetching PR number 5857
⌛  Fetching files for PR number 5857
⌛  Validating...
Error: Features must contain a change to a README file
    at featureContainsReadme (/Users/epolon/dev/src/github.com/aws/aws-cdk/tools/prlint/index.js:43:15)
    at Object.mandatoryChanges (/Users/epolon/dev/src/github.com/aws/aws-cdk/tools/prlint/index.js:74:5)
    at process._tickCallback (internal/process/next_tick.js:68:7)
```

Note that an **un-authenticated** GitHub client is created, unless you set the `GITHUB_TOKEN` env variable.
