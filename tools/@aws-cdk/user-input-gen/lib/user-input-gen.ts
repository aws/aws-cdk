import { Module, SelectiveModuleImport, StructType, Type, TypeScriptRenderer } from '@cdklabs/typewriter';
import { EsLintRules } from '@cdklabs/typewriter/lib/eslint-rules';
import * as prettier from 'prettier';
import { kebabToCamelCase, kebabToPascal, SOURCE_OF_TRUTH } from './util';
import { CliConfig } from './yargs-types';

export async function renderUserInputType(config: CliConfig): Promise<string> {
  const scope = new Module('aws-cdk');

  scope.documentation.push( '-------------------------------------------------------------------------------------------');
  scope.documentation.push(`GENERATED FROM ${SOURCE_OF_TRUTH}.`);
  scope.documentation.push('Do not edit by hand; all changes will be overwritten at build time from the config file.');
  scope.documentation.push('-------------------------------------------------------------------------------------------');

  const userInputType = new StructType(scope, {
    export: true,
    name: 'UserInput',
    docs: {
      summary: 'The structure of the user input -- either CLI options or cdk.json -- generated from packages/aws-cdk/lib/config.ts',
    },
  });

  // add required command
  scope.addImport(new SelectiveModuleImport(scope, './user-configuration', ['Command']));
  const commandEnum = Type.fromName(scope, 'Command');

  userInputType.addProperty({
    name: 'command',
    type: commandEnum,
    docs: {
      summary: 'The CLI command name',
    },
    optional: true,
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
      type: convertType(option.type, option.count),
      docs: {
        default: normalizeDefault(option.default),
        summary: option.desc,
        deprecated: option.deprecated ? String(option.deprecated) : undefined,
      },
      optional: true,
    });
  }

  userInputType.addProperty({
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

    // add command level options
    for (const [optionName, option] of Object.entries(command.options ?? {})) {
      commandType.addProperty({
        name: kebabToCamelCase(optionName),
        type: convertType(option.type, option.count),
        docs: {
          // Notification Arns is a special property where undefined and [] mean different things
          default: optionName === 'notification-arns' ? 'undefined' : normalizeDefault(option.default),
          summary: option.desc,
          deprecated: option.deprecated ? String(option.deprecated) : undefined,
          remarks: option.alias ? `aliases: ${Array.isArray(option.alias) ? option.alias.join(' ') : option.alias}` : undefined,
        },
        optional: true,
      });
    }

    // add positional argument associated with the command
    if (command.arg) {
      commandType.addProperty({
        name: command.arg.name,
        type: command.arg.variadic ? Type.arrayOf(Type.STRING) : Type.STRING,
        docs: {
          summary: `Positional argument for ${commandName}`,
        },
        optional: true,
      });
    }

    userInputType.addProperty({
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

function convertType(type: 'string' | 'array' | 'number' | 'boolean' | 'count', count?: boolean): Type {
  switch (type) {
    case 'boolean':
      return count ? Type.NUMBER : Type.BOOLEAN;
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

function normalizeDefault(defaultValue: any): string {
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
      return 'undefined';
  }
}
