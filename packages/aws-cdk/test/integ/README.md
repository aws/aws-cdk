Test Runners for the CLI integ tests
====================================

There is a lot of variety of running tests, which is why this directory might
seems complicated at first blush.

To make the tests themselves as simple as possible to write and reusable,
they expect to be run in an environment where the "right" version of the CDK
CLI is already on `$PATH`, and where `npm install`, `pip install`, `mvn` and
`nuget` all automatically install the packages "under test".

## Package Sources

The packages under test can come from 3 different sets of packages:

* The local source repository (obviously, it needs to have been built first).
  This is appropriate to use while developing.
* A set of candidate packages to be released to package managers (but
  haven't been released yet!). The packages are available as a set of binaries.
  This is used to validate an upcoming release.
* The latest packages that are actually released to package managers. This is
  used to validate the things we released can be properly downloaded and
  installed (double-checks we didn't make any mistakes in our fakey installs).

In the first two cases, the packages that a package manager would normally
want to download from `npmjs.com`, `pypi.org`, etc actually need to come from
a local build itself. We override/hijack/do whatever is necessary for every
package manager to make sure that an `npm install`, `pip install`, etc.
installs the binary packages from the candidate release, instead of the
packages. Sometimes, this looks like installing a shell script on `$PATH`
which overrides the `npm` command, which creates a symlink instead of running
the actual `npm install` command. Sometimes this looks like pre-installing
the `.jar`s into Maven's local repository to make sure the next Maven build
uses them. The details are different for every package manager.

There are 3 scripts which build an environment appropriate for the tests:

* `run-against-repo`: expects to be run from the source repo, makes sure the packages
  in the current source tree are used.
  * NPM: does not require `npm pack`, it will symlink to the package directories.
  * Maven: ...
  * PIP: ...
  * NuGet: ...
* `run-against-dist`: expects to be run from a dist bundle, makes sure the built
  packages (tarballs, Maven packages, ...) are used.
  * NPM: will use Verdaccio to serve the NPM tarballs from a fake NPM registry,
    to be picked up by a regular `npm install`.
  * Maven: ...
  * PIP: ...
  * NuGet: ...
* `run-against-release`: doesn't really need to do anything special, because this
  is the normal situation where the packages from the packages manager registries
  are actually what we need!

## Regression Tests

There is a fly in the ointment! To make sure we're not breaking framework/CLI compatibility,
or CLI features, we actually want to vary the combinations of the version of:

```
Framework x CLI x Tests
```

For example, upon releasing a new version, we want to run:

* The OLD tests against the NEW framework and NEW CLI to check that we didn't break
  any functionality.
* The OLD tests against the OLD framework and the NEW CLI to check that the new CLI and
  the old framework still interoperate.

This is most relevant in the pipeline, where we are evaluating a new candidate release and
we want to make sure these properties hold before releasing, so we don't break anyone.

Because of a peculiarity of our release process, we don't change the version of our artifacts
until we are ready to release. So that means that if the latest released version is `1.20.0`,
in our pipeline all of our packages are also built with the version `1.20.0`.

We therefore cannot use the version number to distinguish between the latest/old/published
release, and the current/new/candidate release.

It's not even always true that `candidate version >= published version`.
There is a period *after* a release has happened but before the *merge-back*
where our `master` pipeline might be testing packages which think they are at
`1.20.0`, whereas the latest/old/published version is already `1.21.0`.

## Test Contract

Tests should hold themselvse to the following contract:

* Run the `cdk` command that's already on `$PATH`.
* When installing framework packages, install packages at version
  `$FRAMEWORK_VERSION` if that variable is set, and "latest" otherwise.
* Use the variable `$VERSION_UNDER_TEST`...

*argh this is hard*
