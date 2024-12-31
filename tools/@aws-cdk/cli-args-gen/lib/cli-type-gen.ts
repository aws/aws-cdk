import { code, FreeFunction, Module, SelectiveModuleImport, StructType, Type, TypeScriptRenderer } from '@cdklabs/typewriter';
import { EsLintRules } from '@cdklabs/typewriter/lib/eslint-rules';
import * as prettier from 'prettier';
import { generateDefault } from './util';
import { CliAction, CliConfig } from './yargs-types';

export async function renderCliType(config: CliConfig): Promise<string> {
  const scope = new Module('aws-cdk');

  scope.documentation.push( '-------------------------------------------------------------------------------------------');
  scope.documentation.push('GENERATED FROM packages/aws-cdk/lib/config.ts.');
  scope.documentation.push('Do not edit by hand; all changes will be overwritten at build time from the config file.');
  scope.documentation.push('-------------------------------------------------------------------------------------------');

  const cliArgType = new StructType(scope, {
    export: true,
    name: 'CliArguments',
    docs: {
      summary: 'The structure of the CLI configuration, generated from packages/aws-cdk/lib/config.ts',
    },
  });

  // add required command
  scope.addImport(new SelectiveModuleImport(scope, './settings', ['Command']));
  const commandEnum = Type.fromName(scope, 'Command');

  cliArgType.addProperty({
    name: '_',
    type: Type.ambient(`[${commandEnum}, ...string[]]`),
    docs: {
      summary: 'The CLI command name followed by any properties of the command',
    },
  });

  // add global options
  const globalOptionType = new StructType(scope, {
    export: true,
    name: 'GlobalOptions',
    docs: {
      summary: 'Global options available to all CLI commands',
    },
  });
  for (const [optionName, option] of Object.entries(config.globalOptions)) {
    globalOptionType.addProperty({
      name: optionName,
      type: convertType(option.type),
      docs: {
        default: normalizeDefault(option.default, option.type),
        summary: option.desc,
        deprecated: option.deprecated ? String(option.deprecated) : undefined,
      },
      optional: true,
    });
  }

  cliArgType.addProperty({
    name: 'globalOptions',
    type: Type.fromName(scope, globalOptionType.name),
    docs: {
      summary: 'Global options available to all CLI commands',
    },
    optional: true,
  });

  // add command-specific options
  for (const [commandName, command] of Object.entries(config.commands)) {
    const commandType = new StructType(scope, {
      export: true,
      name: `${kebabToPascal(commandName)}Options`,
      docs: {
        summary: command.description,
        remarks: command.aliases ? `aliases: ${command.aliases.join(' ')}` : undefined,
      },
    });

    for (const [optionName, option] of Object.entries(command.options ?? {})) {
      commandType.addProperty({
        name: optionName,
        type: convertType(option.type),
        docs: {
          // Notification Arns is a special property where undefined and [] mean different things
          default: optionName === 'notification-arns' ? 'undefined' : normalizeDefault(option.default, option.type),
          summary: option.desc,
          deprecated: option.deprecated ? String(option.deprecated) : undefined,
          remarks: option.alias ? `aliases: ${Array.isArray(option.alias) ? option.alias.join(' ') : option.alias}` : undefined,
        },
        optional: true,
      });
    }

    cliArgType.addProperty({
      name: commandName,
      type: Type.fromName(scope, commandType.name),
      docs: {
        summary: command.description,
        remarks: command.aliases ? `aliases: ${command.aliases.join(' ')}` : undefined,
      },
      optional: true,
    });
  }

  // const globalOptions: GlobalOptions = {
  //   'asset-metadata': args.assetMetadata,
  //   'ca-bundle-path': args.caBundlePath,
  //   'ignore-errors': args.ignoreErrors,
  //   'no-color': args.noColor,
  //   'path-metadata': args.pathMetadata,
  //   'proxy': args.proxy,
  //   'role-arn': args.roleArn,
  //   'staging': args.staging,
  //   'strict': args.strict,
  //   'verbose': args.verbose,
  //   'version-reporting': args.versionReporting,
  //   'ci': args.ci,
  //   'debug': args.debug,
  //   'ec2creds': args.ec2creds,
  //   'json': args.json,
  //   'lookups': args.lookups,
  //   'unstable': args.unstable,
  // };
  const createCliArguments = new FreeFunction(scope, {
    name: 'createCliArguments',
    export: true,
    returnType: Type.fromName(scope, cliArgType.name),
    parameters: [
      { name: 'args', type: Type.ANY },
    ],
  });
  createCliArguments.addBody(code.expr.directCode(buildCliArgsFunction(config)));

  const ts = new TypeScriptRenderer({
    disabledEsLintRules: [EsLintRules.MAX_LEN], // the default disabled rules result in 'Definition for rule 'prettier/prettier' was not found'
  }).render(scope);

  return prettier.format(ts, {
    parser: 'typescript',
    printWidth: 150,
    singleQuote: true,
    quoteProps: 'consistent',
  });
}

function convertType(type: 'string' | 'array' | 'number' | 'boolean' | 'count'): Type {
  switch (type) {
    case 'boolean':
      return Type.BOOLEAN;
    case 'string':
      return Type.STRING;
    case 'number':
      return Type.NUMBER;
    case 'array':
      return Type.arrayOf(Type.STRING);
    case 'count':
      return Type.NUMBER;
  }
}

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function normalizeDefault(defaultValue: any, type: string): string {
  switch (typeof defaultValue) {
    case 'boolean':
    case 'string':
    case 'number':
    case 'object':
      return JSON.stringify(defaultValue);

    // In these cases we cannot use the given defaultValue, so we then check the type
    // of the option to determine the default value
    case 'undefined':
    case 'function':
    default:
      const generatedDefault = generateDefault(type);
      return generatedDefault ? JSON.stringify(generatedDefault) : 'undefined';
  }
}

function buildCliArgsFunction(config: CliConfig): string {
  const globalOptions = buildGlobalOptions(config);
  const commandSwitch = buildCommandSwitch(config);
  const cliArgs = buildCliArgs();
  return [
    globalOptions,
    commandSwitch,
    cliArgs,
  ].join('\n');
}

function buildGlobalOptions(config: CliConfig): string {
  const globalOptionExprs = ['const globalOptions: GlobalOptions = {'];
  for (const optionName of Object.keys(config.globalOptions)) {
    globalOptionExprs.push(`'${optionName}': args.${hyphenToCamelCase(optionName)},`);
  }
  globalOptionExprs.push('}');
  return globalOptionExprs.join('\n');
}

function buildCommandSwitch(config: CliConfig): string {
  const commandSwitchExprs = ['let commandOptions;', 'switch (args._[0] as Command) {'];
  for (const commandName of Object.keys(config.commands)) {
    commandSwitchExprs.push(
      `case '${commandName}':`,
      'commandOptions = {',
      ...buildCommandOptions(config.commands[commandName]),
      '};',
      `break;
    `);
  }
  commandSwitchExprs.push('}');
  return commandSwitchExprs.join('\n');
}

function buildCommandOptions(options: CliAction): string[] {
  const commandOptions = [];
  for (const optionName of Object.keys(options.options ?? {})) {
    commandOptions.push(`'${optionName}': args.${hyphenToCamelCase(optionName)},`);
  }
  return commandOptions;
}

function buildCliArgs(): string {
  return [
    'const cliArguments: CliArguments = {',
    '_: args._,',
    'globalOptions,',
    '[args._[0]]: commandOptions',
    '}',
    '',
    'return cliArguments',
  ].join('\n');
}

function hyphenToCamelCase(str: string): string {
  return str
    .split('-')
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('');
}

