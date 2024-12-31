import { Module, SelectiveModuleImport, StructType, Type, TypeScriptRenderer } from '@cdklabs/typewriter';
import { EsLintRules } from '@cdklabs/typewriter/lib/eslint-rules';
import * as prettier from 'prettier';
import { generateDefault, kebabToCamelCase, kebabToPascal } from './util';
import { CliConfig } from './yargs-types';

export async function renderCliArgsType(config: CliConfig): Promise<string> {
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
      name: kebabToCamelCase(optionName),
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
        name: kebabToCamelCase(optionName),
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
      name: kebabToCamelCase(commandName),
      type: Type.fromName(scope, commandType.name),
      docs: {
        summary: command.description,
        remarks: command.aliases ? `aliases: ${command.aliases.join(' ')}` : undefined,
      },
      optional: true,
    });
  }

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
