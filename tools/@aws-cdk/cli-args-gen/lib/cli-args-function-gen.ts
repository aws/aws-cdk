import { code, FreeFunction, Module, SelectiveModuleImport, Type, TypeScriptRenderer } from '@cdklabs/typewriter';
import { EsLintRules } from '@cdklabs/typewriter/lib/eslint-rules';
import * as prettier from 'prettier';
import { kebabToCamelCase } from './util';
import { CliAction, CliConfig } from './yargs-types';

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
    name: 'convertToCliArgs',
    export: true,
    returnType: cliArgType,
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
    const name = kebabToCamelCase(optionName);
    globalOptionExprs.push(`'${name}': args.${name},`);
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
  const commandOptions: string[] = [];
  for (const optionName of Object.keys(options.options ?? {})) {
    const name = kebabToCamelCase(optionName);
    commandOptions.push(`'${name}': args.${name},`);
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
