# spec2cdk

Generates AWS CDK L1s in TypeScript from `@aws-cdk/aws-service-spec`.

## Usage

```ts
import { generateAll } from '@aws-cdk/spec2cdk';

declare const outputDir: string;

// Generate all modules
await generateAll(outputPath, { outputPath });

// Generate modules with specific instructions
await generate({
  'aws-lambda': { services: ['AWS::Lambda'] },
  'aws-s3': { services: ['AWS::S3'] },
}, { outputPath });
```

Refer to code autocompletion for all options.

### Use as @aws-cdk/cfn2ts replacement

The package provides a binary that can be used as a drop-in replacement of the legacy `@aws-cdk/cfn2ts` package.
At a code level, import `@aws-cdk/spec2cdk/lib/cfn2ts` for a drop-in replacement.

## Temporary Schemas

You can import additional, temporary CloudFormation Registry Schemas to test new functionality that is not yet published in `@aws-cdk/aws-service-spec`.
To do this, drop the schema file into `temporary-schemas/us-east-1` and it will be imported on top of the default model.

## CLI

A CLI is available for testing and ad-hoc usage.
However its API is limited and you should use the programmatic interface for implementations.

```console
Usage:
    spec2cdk <OUTPUT-PATH> [--option=value]

Arguments:
    OUTPUT-PATH                         The directory the generated code will be written to

Options:
        --augmentations                 [string] [default: %moduleName%/%serviceShortName%-augmentations.generated.ts]
          File and path pattern for generated augmentations files
        --augmentations-support         [boolean]
          Generates additional files required for augmentation files to compile. Use for testing only
        --clear-output                  [boolean]
          Completely delete the output path before generating new files
        --debug                         [boolean]
          Show additional debug output
    -h, --help                          [boolean]
          Show this help
        --metrics                       [string] [default: %moduleName%/%serviceShortName%-canned-metrics.generated.ts]
          File and path pattern for generated canned metrics files 
        --pattern                       [string] [default: %moduleName%/%serviceShortName%.generated.ts]
          File and path pattern for generated files
    -s, --service                       [array]
          Generate files only for a specific service, e.g. AWS::S3

Path patterns can use the following variables:

    %moduleName%          The name of the module, e.g. aws-lambda
    %serviceName%         The full name of the service, e.g. aws-lambda
    %serviceShortName%    The short name of the service, e.g. lambda

Note that %moduleName% and %serviceName% can be different if multiple services are generated into a single module.
```
