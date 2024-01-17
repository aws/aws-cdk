# Custom Resource Handlers

This package contains the following custom resource handlers:

### Stable:

- aws-s3/auto-delete-objects-handler
- aws-ecr/auto-delete-images-handler
- aws-events-targets/aws-api-handler
- aws-synthetics/auto-delete-underlying-resources-handler
- custom-resources/aws-custom-resource-handler

These handlers are copied into `aws-cdk-lib/custom-resource-handlers` at build time
and included as part of the `aws-cdk-lib` package.

### Experimental:

- aws-amplify-alpha/asset-deployment-handler

These handlers are excluded from `aws-cdk-lib/custom-resource-handlers` and are individually
copied into their respective `-alpha` packages at build time. When an `-alpha` package is
stabilized, part of the stabilization process **must** be to remove `-alpha` from the folder
name, so that it is included in `aws-cdk-lib`.

## Nodejs Entrypoint

This package also includes `nodejs-entrypoint.ts`, which is a wrapper that talks to
CloudFormation for you. At build time, `nodejs-entrypoint.js` is bundled into the
`.js` file of the custom resource handler, creating one `index.js` file. This file
is then either copied into a CDK asset or copied as inline code directly in the
CloudFormation template.

## Future Work

In the future this package will contain all custom resources and their tests.
