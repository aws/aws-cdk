import { Module, StructType, Type, TypeScriptRenderer } from '@cdklabs/typewriter';
import { EsLintRules } from '@cdklabs/typewriter/lib/eslint-rules';
import * as prettier from 'prettier';
import { CliConfig } from './yargs-types';

export async function renderCliType(config: CliConfig): Promise<string> {
  const scope = new Module('aws-cdk');

  scope.documentation.push( '-------------------------------------------------------------------------------------------');
  scope.documentation.push('GENERATED FROM packages/aws-cdk/lib/config.ts.');
  scope.documentation.push('Do not edit by hand; all changes will be overwritten at build time from the config file.');
  scope.documentation.push('-------------------------------------------------------------------------------------------');

  const cliType = new StructType(scope, {
    export: true,
    name: 'cliConfigType',
  });

  // add required command
  cliType.addProperty({
    name: '_',
    type: Type.STRING,
  });

  // add global options
  for (const [optionName, option] of Object.entries(config.globalOptions)) {
    cliType.addProperty({
      name: optionName,
      type: convertType(option.type),
      optional: true,
    });
  }

  // add command-specific options
  for (const [commandName, command] of Object.entries(config.commands)) {
    const commandType = new StructType(scope, {
      export: true,
      name: `${commandName.replace(/:/g, '_')}Options`,
    });

    for (const [optionName, option] of Object.entries(command.options ?? {})) {
      commandType.addProperty({
        name: optionName,
        type: convertType(option.type),
        optional: true,
      });
    }

    cliType.addProperty({
      name: commandName,
      type: Type.fromName(scope, commandType.name),
      optional: true,
    });
  }

  const ts = new TypeScriptRenderer({
    disabledEsLintRules: [
      EsLintRules.COMMA_DANGLE,
      EsLintRules.COMMA_SPACING,
      EsLintRules.MAX_LEN,
      EsLintRules.QUOTES,
      EsLintRules.QUOTE_PROPS,
    ],
  }).render(scope);

  return prettier.format(ts, {
    parser: 'typescript',
    printWidth: 150,
    singleQuote: true,
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
