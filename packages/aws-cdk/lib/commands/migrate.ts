/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from 'fs';
import * as path from 'path';
import { Environment, UNKNOWN_ACCOUNT, UNKNOWN_REGION } from '@aws-cdk/cx-api';
import * as cdk_from_cfn from 'cdk-from-cfn';
import { cliInit } from '../../lib/init';
import { Mode, SdkProvider } from '../api';
import { CloudFormationStack } from '../api/util/cloudformation';
import { zipDirectory } from '../util/archive';

const camelCase = require('camelcase');
const decamelize = require('decamelize');

/** The list of languages supported by the built-in noctilucent binary. */
export const MIGRATE_SUPPORTED_LANGUAGES: readonly string[] = cdk_from_cfn.supported_languages();

/**
 * Generates a CDK app from a yaml or json template.
 *
 * @param stackName The name to assign to the stack in the generated app
 * @param stack The yaml or json template for the stack
 * @param language The language to generate the CDK app in
 * @param outputPath The path at which to generate the CDK app
 */
export async function generateCdkApp(stackName: string, stack: string, language: string, outputPath?: string, compress?: boolean) {
  const resolvedOutputPath = path.join(outputPath ?? process.cwd(), stackName);
  const formattedStackName = decamelize(stackName);

  try {
    fs.rmSync(resolvedOutputPath, { recursive: true, force: true });
    fs.mkdirSync(resolvedOutputPath, { recursive: true });
    const generateOnly = compress;
    await cliInit({
      type: 'app',
      language,
      canUseNetwork: true,
      generateOnly,
      workDir: resolvedOutputPath,
      stackName,
    });

    let stackFileName: string;
    switch (language) {
      case 'typescript':
        stackFileName = `${resolvedOutputPath}/lib/${formattedStackName}-stack.ts`;
        break;
      case 'java':
        stackFileName = `${resolvedOutputPath}/src/main/java/com/myorg/${camelCase(formattedStackName, { pascalCase: true })}Stack.java`;
        break;
      case 'python':
        stackFileName = `${resolvedOutputPath}/${formattedStackName.replace(/-/g, '_')}/${formattedStackName.replace(/-/g, '_')}_stack.py`;
        break;
      case 'csharp':
        stackFileName = `${resolvedOutputPath}/src/${camelCase(formattedStackName, { pascalCase: true })}/${camelCase(formattedStackName, { pascalCase: true })}Stack.cs`;
        break;
      case 'go':
        stackFileName = `${resolvedOutputPath}/${formattedStackName}.go`;
        break;
      default:
        throw new Error(`${language} is not supported by CDK Migrate. Please choose from: ${MIGRATE_SUPPORTED_LANGUAGES.join(', ')}`);
    }
    fs.writeFileSync(stackFileName, stack);
    if (compress) {
      await zipDirectory(resolvedOutputPath, `${resolvedOutputPath}.zip`);
      fs.rmSync(resolvedOutputPath, { recursive: true, force: true });
    }
  } catch (error) {
    fs.rmSync(resolvedOutputPath, { recursive: true, force: true });
    throw error;
  }
}

/**
 * Generates a CDK stack file.
 * @param template The template to translate into a CDK stack
 * @param stackName The name to assign to the stack
 * @param language The language to generate the stack in
 * @returns A string representation of a CDK stack file
 */
export function generateStack(template: string, stackName: string, language: string) {
  try {
    const formattedStackName = `${camelCase(decamelize(stackName), { pascalCase: true })}Stack`;
    return cdk_from_cfn.transmute(template, language, formattedStackName);
  } catch (e) {
    throw new Error(`stack generation failed due to error '${(e as Error).message}'`);
  }
}

/**
 * Reads and returns a stack template from a local path.
 *
 * @param inputPath The location of the template
 * @returns A string representation of the template if present, otherwise undefined
 */
export function readFromPath(inputPath?: string): string | undefined {
  try {
    return inputPath ? fs.readFileSync(inputPath, 'utf8') : undefined;
  } catch (e) {
    throw new Error(`'${inputPath}' is not a valid path.`);
  }

}

/**
 * Reads and returns a stack template from a deployed CloudFormation stack.
 *
 * @param stackName The name of the stack
 * @param sdkProvider The sdk provider for making CloudFormation calls
 * @param environment The account and region where the stack is deployed
 * @returns A string representation of the template if present, otherwise undefined
 */
export async function readFromStack(stackName: string, sdkProvider: SdkProvider, environment: Environment): Promise<string | undefined> {
  const cloudFormation = (await sdkProvider.forEnvironment(environment, Mode.ForReading)).sdk.cloudFormation();

  const stack = await CloudFormationStack.lookup(cloudFormation, stackName);
  if (stack.stackStatus.isDeploySuccess || stack.stackStatus.isRollbackSuccess) {
    return JSON.stringify(await stack.template());
  } else {
    throw new Error(`Stack '${stackName}' in account ${environment.account} and region ${environment.region} has a status of '${stack.stackStatus.name}' due to '${stack.stackStatus.reason}'. The stack cannot be migrated until it is in a healthy state.`);
  }
  return;
}

/**
 * Sets the account and region for making CloudFormation calls.
 * @param account The account to use
 * @param region The region to use
 * @returns The environment object
 */
export function setEnvironment(account?: string, region?: string): Environment {
  return { account: account ?? UNKNOWN_ACCOUNT, region: region ?? UNKNOWN_REGION, name: 'cdk-migrate-env' };
}

/**
 * Validates that exactly one source option has been provided.
 * @param fromPath The content of the flag `--from-path`
 * @param fromStack the content of the flag `--from-stack`
 */
export function validateSourceOptions(fromPath?: string, fromStack?: boolean) {
  if (fromPath && fromStack) {
    throw new Error('Only one of `--from-path` or `--from-stack` may be provided.');
  }

  if (!fromPath && !fromStack) {
    throw new Error('Either `--from-path` or `--from-stack` must be used to provide the source of the CloudFormation template.');
  }
}
