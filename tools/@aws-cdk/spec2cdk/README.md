# spec2cdk

Generates AWS CDK L1s in TypeScript from `@aws-cdk/aws-service-spec`.

```console
Usage:

  spec2cdk OUTPUT-PATH [--option=value]


Options:

  Note: Passing values to non-boolean options MUST use the = sign: --option=value

  --augmentations             [string]  [default: "%moduleName%/%serviceShortName%-augmentations.generated.ts"]
    File and path pattern for generated augmentations files 
  --augmentations-support     [boolean] [default: false] 
    Generates additional files required for augmentation files to compile. Use for testing only.
  --clear-output              [boolean] [default: false] 
    Completely delete the output path before generating new files
  --debug                     [boolean] [default: false] 
    Show additional debug output
  --metrics                   [string] [default: "%moduleName%/%serviceShortName%-canned-metrics.generated.ts"]
    File and path pattern for generated canned metrics files 
  --pattern                   [string]  [default: "%moduleName%/%serviceShortName%.generated.ts"]
    File and path pattern for generated files
  --service                   [string]  [default: all services]
    Generate files only for a specific service, e.g. aws-lambda

Path patterns can use the following variables:

  %moduleName%          The name of the module, e.g. aws-lambda
  %serviceName%         The full name of the service, e.g. aws-lambda
  %serviceShortName%    The short name of the service, e.g. lambda

  Note that %moduleName% and %serviceName% can be different if multiple services are generated into a single module.

```

## Use as @aws-cdk/cfn2ts replacement

You can use the `cfn2ts` binary as a drop-in replacement for the existing `@aws-cdk/cfn2ts` command.

At a code level, import `@aws-cdk/spec2cdk/lib/cfn2ts` for a drop-in replacement.
