import * as fs from 'fs';
import * as path from 'path';
import * as cdk_from_cfn from 'cdk-from-cfn';
import { cliInit } from '../../lib/init';
import { warning } from '../logging';

/* eslint-disable @typescript-eslint/no-var-requires */ // Packages don't have @types module
// eslint-disable-next-line @typescript-eslint/no-require-imports
const camelCase = require('camelcase');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const decamelize = require('decamelize');

/** The list of languages supported by the built-in noctilucent binary. */
export const MIGRATE_SUPPORTED_LANGUAGES: readonly string[] = cdk_from_cfn.supported_languages();

export interface CliMigrateOptions {
  readonly stackName: string;
  readonly language?: string;
  readonly fromPath?: string;
  readonly outputPath?: string;
}

export async function cliMigrate(options: CliMigrateOptions) {
  warning('This is an experimental feature. We make no guarantees about the outcome or stability of the functionality.');

  // TODO: Validate stack name

  const language = options.language ?? 'typescript';
  const outputPath = path.join(options.outputPath ?? process.cwd(), options.stackName);

  const generatedStack = generateStack(options, language);
  const stackName = decamelize(options.stackName);

  try {
    fs.rmSync(outputPath, { recursive: true, force: true });
    fs.mkdirSync(outputPath, { recursive: true });
    await cliInit('app', language, true, false, outputPath, options.stackName);

    let stackFileName: string;
    switch (language) {
      case 'typescript':
        stackFileName = `${outputPath}/lib/${stackName}-stack.ts`;
        break;
      case 'java':
        stackFileName = `${outputPath}/src/main/java/com/myorg/${camelCase(stackName, { pascalCase: true })}Stack.java`;
        break;
      case 'python':
        stackFileName = `${outputPath}/${stackName.replace(/-/g, '_')}/${stackName.replace(/-/g, '_')}_stack.py`;
        break;
      case 'csharp':
        stackFileName = `${outputPath}/src/${camelCase(stackName, { pascalCase: true })}/${camelCase(stackName, { pascalCase: true })}Stack.cs`;
        break;
      // TODO: Add Go support
      default:
        throw new Error(`${language} is not supported by CDK Migrate. Please choose from: ${MIGRATE_SUPPORTED_LANGUAGES.join(', ')}`);
    }
    fs.writeFileSync(stackFileName!, generatedStack);
  } catch (error) {
    fs.rmSync(outputPath, { recursive: true, force: true });
    throw error;
  }

}

function generateStack(options: CliMigrateOptions, language: string) {
  const stackName = `${camelCase(decamelize(options.stackName), { pascalCase: true })}Stack`;
  // We will add other options here in a future change.
  if (options.fromPath) {
    return fromPath(stackName, options.fromPath, language);
  }
  // TODO: replace with actual output for other options.
  return '';
}

function fromPath(stackName: string, inputPath: string, language: string): string {
  const templateFile = fs.readFileSync(inputPath, 'utf8');
  return cdk_from_cfn.transmute(templateFile, language, stackName);
}
