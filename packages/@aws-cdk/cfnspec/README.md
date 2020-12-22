# AWS CDK CloudFormation Tools

To update the CloudFormation spec, you can run `bump-cfnspec.sh` from a clean repo, as so -

```console
./scripts/bump-cfnspec.sh
```

If you wish to only update the CFN spec, make sure to install all dependencies and build the `cfnspec` module,
and then you can just run:

```console
yarn update
```
