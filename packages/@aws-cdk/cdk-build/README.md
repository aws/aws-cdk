# cdk-build

A jsii library and a command-line tool which takes a CDK `build.json` file (as
defined in cx-api) and executes all the build tasks in topological order.

For example, say we have the following directory structure:

```
.
├── build.json
└── staging
    └── dir1
        └── file1.txt
```

And `build.json` looks like this:

```json
{
  "steps": {
    "zip_dir1": {
      "type": "zip",
      "parameters": {
        "src": "staging/dir1",
        "dest": "output/aaabbb.zip"
      }
    },
    "dup_zip_result": {
      "type": "copy",
      "parameters": {
        "src": "output/aaabbb.zip",
        "dest": "output/dup.zip"
      },
      "depends": [ "zip_dir1" ]
    }
  }
}
```

The, if we run `cdk-build` in this directory:

```console
$ cdk-build .
zip_dir1: start build
zip_dir1: compressing staging/dir1 to output/aaabbb.zip
zip_dir1: end build
dup_zip_result: start build
dup_zip_result: copying output/aaabbb.zip to output/dup.zip
dup_zip_result: end build
```

And it will produce the following output:

```
.
├── build.json
├── output
│   ├── aaabbb.zip
│   └── dup.zip
└── staging
    └── dir1
        └── file1.txt
```

`cdk-build` assumes that if a destination file (or docker image tag) already exists,
it can skip it. This works in tandem with how CDK identifies artifacts (based on their source fingerprint).

```console
$ cdk-build .
zip_dir1: start build
zip_dir1: output/aaabbb.zip already exists. skipping
zip_dir1: end build
dup_zip_result: start build
dup_zip_result: output/dup.zip already exists. skipping
dup_zip_result: end build
```

## Supported Tasks

 * `copy`: copies files
 * `zip`: zips a directory
 * `docker`: builds a docker image

## TODO

- [ ] Integrate into the toolkit (required "cdk-deploy").
- [ ] The docker build in the toolkit has an optimization for CI environments
      where it pulls down a cached image. This really breaks the boundary of
      this tool. Need to figure out what to do.
- [ ] Implement `cdk-deploy`, the next guy in the chain. It should pick up an
      `assembly` directory (with `manifest.json` and build outputs) and deploy
      it.
