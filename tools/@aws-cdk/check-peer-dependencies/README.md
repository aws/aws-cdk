# check-peer-dependencies

> **NOTE:** This tool should only be used on packages in this repository,
> and is not intended for external usage.

Validates that a package's bundled dependencies have their peer dependencies
satisfied by the package's own dependencies. This prevents peer dependency
warnings when users install packages that bundle dependencies.

## Usage

```sh
check-peer-dependencies [package-directory]
```

`package-directory` defaults to the current working directory. Exits non-zero
and prints the offending peer dependencies if any are unsatisfied.
