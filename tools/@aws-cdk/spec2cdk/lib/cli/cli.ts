/**
 * spec2cdk CLI entry point
 *
 * !!! Note that this CLI is never used in the course of normal repository operations !!!
 * !!! It only exists for experimentation purposes when developing new code gen. !!!
 */
import * as path from 'node:path';
import { parseArgs } from 'node:util';
import { PositionalArg, showHelp } from './help';
import { GenerateModuleMap, GenerateOptions, generate, generateAll } from '../generate';
import { log } from '../util';

const command = 'spec2cdk';
const args: PositionalArg[] = [{
  name: 'output-path',
  required: true,
  description: 'The directory the generated code will be written to',
}];
const config = {
  'help': {
    short: 'h',
    type: 'boolean',
    description: 'Show this help',
  },
  'debug': {
    type: 'boolean',
    description: 'Show additional debug output',
  },
  'pattern': {
    type: 'string',
    description: 'File and path pattern for generated files',
  },
  'augmentations': {
    type: 'string',
    description: 'File and path pattern for generated augmentations files',
  },
  'metrics': {
    type: 'string',
    description: 'File and path pattern for generated canned metrics files ',
  },
  'service': {
    short: 's',
    type: 'string',
    description: 'Generate files only for a specific service, e.g. AWS::S3',
    multiple: true,
  },
  'clear-output': {
    type: 'boolean',
    default: false,
    description: 'Completely delete the output path before generating new files',
  },
  'augmentations-support': {
    type: 'boolean',
    default: false,
    description: 'Generates additional files required for augmentation files to compile. Use for testing only',
  },
} as const;

const helpText = `Path patterns can use the following variables:

    %moduleName%          The name of the module, e.g. aws-lambda
    %serviceName%         The full name of the service, e.g. aws-lambda
    %serviceShortName%    The short name of the service, e.g. lambda

Note that %moduleName% and %serviceName% can be different if multiple services are generated into a single module.`;

const help = () => showHelp(command, args, config, helpText);
export const shortHelp = () => showHelp(command, args);

export async function main(argv: string[]) {
  const {
    positionals,
    values: options,
  } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: config,
  });

  if (options.help) {
    help();
    return;
  }

  if (options.debug) {
    process.env.DEBUG = '1';
  }
  log.debug('CLI args', positionals, options);

  const outputDir = positionals[0];
  if (!outputDir) {
    throw new EvalError('Please specify the output-path');
  }

  const outputPath = outputDir ?? path.join(__dirname, '..', 'services');
  const generatorOptions: GenerateOptions = {
    outputPath,
    filePatterns: {
      resources: options.pattern,
      augmentations: options.augmentations,
      cannedMetrics: options.metrics,
    },
    clearOutput: options['clear-output'],
    augmentationsSupport: options['augmentations-support'],
    debug: options.debug as boolean,
  };

  if (options.service?.length) {
    const moduleMap: GenerateModuleMap = {};
    for (const service of options.service) {
      if (!service.includes('::')) {
        throw new EvalError(`Each service must be in the form <Partition>::<Service>, e.g. AWS::S3. Got: ${service}`);
      }
      moduleMap[service.toLocaleLowerCase().split('::').join('-')] = { services: [{ namespace: service }] };
    }
    await generate(moduleMap, generatorOptions);
    return;
  }

  await generateAll(generatorOptions);
}
