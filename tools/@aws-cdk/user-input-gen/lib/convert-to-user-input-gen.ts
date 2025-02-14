import { code, FreeFunction, Module, SelectiveModuleImport, Type, TypeScriptRenderer } from '@cdklabs/typewriter';
import { EsLintRules } from '@cdklabs/typewriter/lib/eslint-rules';
import * as prettier from 'prettier';
import { kebabToCamelCase, SOURCE_OF_TRUTH } from './util';
import { CliAction, CliConfig } from './yargs-types';

const CLI_ARG_NAME = 'args';
const CONFIG_ARG_NAME = 'config';

export async function renderUserInputFuncs(config: CliConfig): Promise<string> {
  const scope = new Module('aws-cdk');

  scope.documentation.push( '-------------------------------------------------------------------------------------------');
  scope.documentation.push(`GENERATED FROM ${SOURCE_OF_TRUTH}.`);
  scope.documentation.push('Do not edit by hand; all changes will be overwritten at build time from the config file.');
  scope.documentation.push('-------------------------------------------------------------------------------------------');

  scope.addImport(new SelectiveModuleImport(scope, './user-configuration', ['Command']));
  scope.addImport(new SelectiveModuleImport(scope, './user-input', ['UserInput', 'GlobalOptions']));
  const userInputType = Type.fromName(scope, 'UserInput');

  const convertYargsToUserInput = new FreeFunction(scope, {
    name: 'convertYargsToUserInput',
    export: true,
    returnType: userInputType,
    parameters: [
      { name: 'args', type: Type.ANY },
    ],
  });
  convertYargsToUserInput.addBody(code.expr.directCode(buildYargsToUserInputFunction(config)));

  const createConfigArguments = new FreeFunction(scope, {
    name: 'convertConfigToUserInput',
    export: true,
    returnType: userInputType,
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

function buildYargsToUserInputFunction(config: CliConfig): string {
  const globalOptions = buildGlobalOptions(config, CLI_ARG_NAME);
  const commandSwitch = buildCommandSwitch(config, CLI_ARG_NAME);
  const userInput = buildUserInput(CLI_ARG_NAME);
  return [
    globalOptions,
    commandSwitch,
    userInput,
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
  const commandOptions: string[] = [];
  // Note: we are intentionally not including aliases for the default options that can be
  // specified via `cdk.json`. These options must be specified by the command name
  // i.e. acknowledge rather than ack.
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
      // All aliases of the command should map to the same switch branch
      // This ensures that we store options of the command regardless of what alias is specified
      ...buildAliases(commandName, config.commands[commandName].aliases),
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

function buildAliases(commandName: string, aliases: string[] = []): string[] {
  const cases = [commandName, ...aliases];
  return cases.map((c) => `case '${c}':`);
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

function buildUserInput(argName: string): string {
  return [
    'const userInput: UserInput = {',
    `command: ${argName}._[0],`,
    'globalOptions,',
    `[${argName}._[0]]: commandOptions`,
    '}',
    '',
    'return userInput',
  ].join('\n');
}

function buildConfigArgs(config: CliConfig): string {
  return [
    'const userInput: UserInput = {',
    'globalOptions,',
    ...(Object.keys(config.commands).map((commandName) => {
      return `'${commandName}': ${kebabToCamelCase(commandName)}Options,`;
    })),
    '}',
    '',
    'return userInput',
  ].join('\n');
}
