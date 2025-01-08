# cli-args-gen

Generates CDK CLI configurations from the source of truth in `packages/aws-cdk/lib/config.ts`.
Currently generates the following files:

- `packages/aws-cdk/lib/parse-command-line-arguments.ts`: `yargs` config.
- `packages/aws-cdk-lib/cli-arguments.ts`: strongly typed `CliArguments` interface.
- `packages/aws-cdk-lib/convert-to-cli-args.ts`: converts the `any` returned by `yargs` to `CliArguments`.

## Usage

```ts
import { renderYargs } from '@aws-cdk/cli-args-gen';

declare const config: CliConfig;

fs.writeFileSync('./lib/parse-command-line-arguments.ts', await renderYargs(config));
```

This package exports `renderYargs()`, which accepts the CLI command config as input and returns the yargs definition for it as a string.

### Dynamic Values

Some values must be computed at runtime, when a command is run. This is achieved with dynamic values;
if the framework sees a CLI option with a `dynamicValue`, then the framework will reference the corresponding parameter.
We should automatically generate the parameter definitions, instead of manually adding them, in the future.
