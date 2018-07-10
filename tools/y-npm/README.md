# `Y-NPM`
`y-npm` (pronounce *"Why, npm?"*) is a drop-in replacement for `npm` that uses local files instead of the standard `npm`
registry for the packages it has been set up with. If you're wondering why you would want to do such things, refer to
the [use-cases](#Use-cases) section of this document.

# Usage
## Adding a package to the `y-npm` overlay
Simply publish your packages using the `y-npm` command instead of the `npm` command (this cannot work for packages that
have `publishConfig` or `private: true` in their `package.json` file). No authentication is required.
* For a package you're developing:
  ```shell
  y-npm publish path/to/package
  ```
* For a package from your `npm` registry of choice:
  ```shell
  TGZ=$(npm pack package[@version]) # Download the package locally
  y-npm publish ${TGZ}              # Publish the downloaded package
  rm ${TGZ}                         # Clean-up after yourself
  ```

## Determine which packages you have in the `y-npm` overlay
The `y-ls` subcommand will list all packages present in the local overlay and output their name and (latest)
version number to `STDOUT`.
```shell
y-npm y-ls
```

## Install packages using the `y-npm` overlay
Simply replace invokations of `npm` with `y-npm`, using the exact same arguments:
```shell
y-npm install
y-npm install --save-dev @types/node
y-npm run build
```

## Overlay location
The overlay location is determined using the following procedure:
1. The environment variable `$Y_NPM_REPOSITORY`
2. Walk up the tree from `$PWD` (the process' working directory) until:
    1. A `y/npm` directory is found
    2. The root of the filesystem is reached
3. Walk up the tree from where `y-npm` is installed in until:
    1. A `y/npm` directory is found
    2. The root of the filesystem is reached
4. Bail out in error.

## Debugging
Verbose logging can be enabled by setting the `Y_NPM_VERBOSE` environment variable to a truthy value:
```shell
Y_NPM_VERBOSE=1 y-npm install
```

# Use-cases
* Distributing private packages without having to set-up a full-fledged `npm` registry for private use.
  > Simply prepare an overlay locally, then distribute that overlay (for example, in a ZIP file) to interested users.
* Enable full offline usage of `npm`
  > Prepare an overlay with all the package versions that need to be available offline. No internet connectivity will
  > be required for using those.
* Replacing a dependency with customized code (for quick experimentations, ...)
  > Publish your custom version under the exact same name as the package you want to replace to your overlay, and
  > `y-npm` will use that instead of the version found in the public `npm` registry.
