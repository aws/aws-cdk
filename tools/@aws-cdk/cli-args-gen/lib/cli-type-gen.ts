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

  const cliArgType = new StructType(scope, {
    export: true,
    name: 'CliArguments',
    docs: {
      summary: 'The structure of the CLI configuration, generated from packages/aws-cdk/lib/config.ts',
    },
  });

  // add required command
  cliArgType.addProperty({
    name: '_',
    type: Type.arrayOf(Type.STRING),
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
        default: normalizeDefault(option.default),
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
          default: normalizeDefault(option.default),
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

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function normalizeDefault(defaultValue: any): string {
  if (typeof defaultValue === 'boolean' || typeof defaultValue === 'string') {
    return String(defaultValue);
  }
  return 'undefined';
}
