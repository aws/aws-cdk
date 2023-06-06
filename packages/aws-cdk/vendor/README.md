## Vendored-in dependencies

The dependencies in this directory are tracked as git submodules. The `gen`
script should run `git submodule udpate --init --recursive` if that has not been
done already, ensuring the dependencies are adequately checked out.

In order to update these dependencies, `cd` into the dependency directory, and
checkout the git commit that you wish to update the dependency to, then stage
and commit the change in commit on the `aws/aws-cdk` repository.

The `THIRD_PARTY_LICENSES` file might need updating accordingly, which can be
automatically done by running `yarn pkglint`.
