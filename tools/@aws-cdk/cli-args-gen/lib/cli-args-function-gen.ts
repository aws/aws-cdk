import { code, FreeFunction, Module, SelectiveModuleImport, Type, TypeScriptRenderer } from '@cdklabs/typewriter';
import { EsLintRules } from '@cdklabs/typewriter/lib/eslint-rules';
import * as prettier from 'prettier';
import { kebabToCamelCase } from './util';
import { CliAction, CliConfig } from './yargs-types';

const CLI_ARG_NAME = 'args';
const CONFIG_ARG_NAME = 'config';

export async function renderCliArgsFunc(config: CliConfig): Promise<string> {
  const scope = new Module('aws-cdk');

  scope.documentation.push( '-------------------------------------------------------------------------------------------');
  scope.documentation.push('GENERATED FROM packages/aws-cdk/lib/config.ts.');
  scope.documentation.push('Do not edit by hand; all changes will be overwritten at build time from the config file.');
  scope.documentation.push('-------------------------------------------------------------------------------------------');

  scope.addImport(new SelectiveModuleImport(scope, './cli-arguments', ['CliArguments', 'GlobalOptions']));
  const cliArgType = Type.fromName(scope, 'CliArguments');

  scope.addImport(new SelectiveModuleImport(scope, './settings', ['Command']));

  const createCliArguments = new FreeFunction(scope, {
    name: 'convertYargsToCliArgs',
    export: true,
    returnType: cliArgType,
    parameters: [
      { name: 'args', type: Type.ANY },
    ],
  });
  createCliArguments.addBody(code.expr.directCode(buildCliArgsFunction(config)));

  const createConfigArguments = new FreeFunction(scope, {
    name: 'convertConfigToCliArgs',
    export: true,
    returnType: cliArgType,
    parameters: [
      { name: 'config', type: Type.ANY },
    ],
  });
  createConfigArguments.addBody(code.expr.directCode(buildConfigArgsFunction(config)));

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

function buildCliArgsFunction(config: CliConfig): string {
  const globalOptions = buildGlobalOptions(config, CLI_ARG_NAME);
  const commandSwitch = buildCommandSwitch(config, CLI_ARG_NAME);
  const cliArgs = buildCliArgs(CLI_ARG_NAME);
  return [
    globalOptions,
    commandSwitch,
    cliArgs,
  ].join('\n');
}

function buildConfigArgsFunction(config: CliConfig): string {
  const globalOptions = buildGlobalOptions(config, CONFIG_ARG_NAME);
  const commandList = buildCommandsList(config, CONFIG_ARG_NAME);
  const configArgs = buildConfigArgs(config);
  return [
    globalOptions,
    commandList,
    configArgs,
  ].join('\n');
}

function buildGlobalOptions(config: CliConfig, argName: string): string {
  const globalOptionExprs = ['const globalOptions: GlobalOptions = {'];
  for (const optionName of Object.keys(config.globalOptions)) {
    const name = kebabToCamelCase(optionName);
    globalOptionExprs.push(`'${name}': ${argName}.${name},`);
  }
  globalOptionExprs.push('}');
  return globalOptionExprs.join('\n');
}

function buildCommandsList(config: CliConfig, argName: string): string {
  const commandOptions = [];
  for (const commandName of Object.keys(config.commands)) {
    commandOptions.push(`const ${kebabToCamelCase(commandName)}Options = {`);
    commandOptions.push(...buildCommandOptions(config.commands[commandName], argName, kebabToCamelCase(commandName)));
    commandOptions.push('}');
  }
  return commandOptions.join('\n');
}

function buildCommandSwitch(config: CliConfig, argName: string): string {
  const commandSwitchExprs = ['let commandOptions;', `switch (${argName}._[0] as Command) {`];
  for (const commandName of Object.keys(config.commands)) {
    commandSwitchExprs.push(
      `case '${commandName}':`,
      'commandOptions = {',
      ...buildCommandOptions(config.commands[commandName], argName),
      ...(config.commands[commandName].arg ? [buildPositionalArguments(config.commands[commandName].arg, argName)] : []),
      '};',
      `break;
    `);
  }
  commandSwitchExprs.push('}');
  return commandSwitchExprs.join('\n');
}

function buildCommandOptions(options: CliAction, argName: string, prefix?: string): string[] {
  const commandOptions: string[] = [];
  for (const optionName of Object.keys(options.options ?? {})) {
    const name = kebabToCamelCase(optionName);
    if (prefix) {
      commandOptions.push(`'${name}': ${argName}.${prefix}?.${name},`);
    } else {
      commandOptions.push(`'${name}': ${argName}.${name},`);
    }
  }
  return commandOptions;
}

function buildPositionalArguments(arg: { name: string; variadic: boolean }, argName: string): string {
  if (arg.variadic) {
    return `${arg.name}: ${argName}.${arg.name}`;
  }
  return `${arg.name}: ${argName}.${arg.name}`;
}

function buildCliArgs(argName: string): string {
  return [
    'const cliArguments: CliArguments = {',
    `_: ${argName}._[0],`,
    'globalOptions,',
    `[${argName}._[0]]: commandOptions`,
    '}',
    '',
    'return cliArguments',
  ].join('\n');
}

function buildConfigArgs(config: CliConfig): string {
  return [
    'const cliArguments: CliArguments = {',
    'globalOptions,',
    ...(Object.keys(config.commands).map((commandName) => {
      return `'${commandName}': ${kebabToCamelCase(commandName)}Options,`;
    })),
    '}',
    '',
    'return cliArguments',
  ].join('\n');
}
