# prlint (beta)

A linter that can run various checks to validate a PR adheres to our standards.

### Disclaimer

This is a very naive implementation that we currently consider as a PoC/Prototype to see how valuable it is. There are no API or functionality guarantees whatsoever.

# Checks

### Mandatory Changes

This check validates that the modified files in the PR follow these rules:

1. `feat` requires a change to a `README.md`.
2. `feat` requires a change to a test file.
3. `fix` requires a change to a test file.

> These rules are currently hard coded, in the future, we should consider using [danger.js](https://danger.systems/js/).

# Installation

```console
cd tools/prlint
npm install
```

# Usage

```console
node tools/prlint/index.js mandatoryChanges

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
