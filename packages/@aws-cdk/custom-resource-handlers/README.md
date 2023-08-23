# Custom Resource Handlers

This package contains the following custom resource handlers:

- aws-s3/auto-delete-objects-handler
- aws-ecr/auto-delete-images-handler
- aws-synthetics-alpha/auto-delete-underlying-resources-handler

In addition, it includes `nodejs-entrypoint.ts`, which is a wrapper that talks to
CloudFormation for you. At build time, `nodejs-entrypoint.js` is bundled into the
`.js` file of the custom resource handler, creating one `index.js` file. This file
is then either copied into a CDK asset or copied as inline code directly in the
CloudFormation template.

In the future this package will contain all custom resources and their tests.
