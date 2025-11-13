import * as path from 'path';
import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import { DatabaseBuilder } from '@aws-cdk/service-spec-importers';
import { SpecDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { AstBuilder, AstBuilderProps, DEFAULT_FILE_PATTERNS } from './cdk/ast';
import { queryDb, log, TsFileWriter } from './util';

export interface GenerateServiceRequest {
  /**
   * The namespace of the service to generate files for.
   * In CloudFormation notation.
   *
   * @example "AWS::Lambda"
   * @example "AWS::S3"
   */
  readonly namespace: string;

  /**
   * An optional suffix used for classes generated for the service.
   *
   * @example { name: "AWS::Lambda", suffix: "FooBar"} -> class CfnFunctionFooBar {}
   *
   * @default - no suffix is used
   */
  readonly suffix?: string;

  /**
   * Deprecate the complete service using the given message.
   *
   * @default - not deprecated
   */
  readonly deprecated?: string;
}

export interface GenerateModuleOptions {
  /**
   * List of services to generate files for.
   */
  readonly services: GenerateServiceRequest[];
}

export interface GenerateOptions extends Pick<AstBuilderProps, 'filePatterns' | 'inCdkLib'> {
  /**
   * Base path for generated files
   *
   * @see `options.filePatterns` to configure more complex scenarios.
   *
   * @default - current working directory
   */
  readonly outputPath: string;

  /**
   * Should the location be deleted before generating new files
   * @default false
   */
  readonly clearOutput?: boolean;

  /**
   * Generate L2 stub support files for augmentations (only for testing)
   *
   * @default false
   */
  readonly augmentationsSupport?: boolean;

  /**
   * Output debug messages
   * @default false
   */
  readonly debug?: boolean;
}

export interface GenerateModuleMap {
  [name: string]: GenerateModuleOptions;
}

/**
 * Output of the spec2cdk code generation
 */
export interface GenerateOutput {
  modules: Record<string, GeneratedServiceInfo>;
}

export interface GeneratedServiceInfo {
  readonly resources: Record<string, string>;
  readonly outputFiles: string[];
}

/**
 * Generates Constructs for modules from the Service Specs
 *
 * This is the entry point used by the build when running `yarn gen`, and is
 * called via `cfn2ts`.
 *
 * @param modules A map of arbitrary module names to GenerateModuleOptions. This allows for flexible generation of different configurations at a time.
 * @param options Configure the code generation
 */
export async function generate(modules: GenerateModuleMap, options: GenerateOptions) {
  enableDebug(options);
  const db = await loadPatchedSpec();
  return generator(db, modules, options);
}

/**
 * Load the service spec with patched schema files.
 */
export async function loadPatchedSpec(): Promise<SpecDatabase> {
  const db = await loadAwsServiceSpec();

  // Load additional schema files
  await new DatabaseBuilder(db as any, { validate: false })
    .importCloudFormationRegistryResources(path.join(__dirname, '..', 'temporary-schemas'))
    .build();

  return db;
}

/**
 * Generates Constructs for all services, with modules name like the service
 *
 * This is the entry point used by the `spec2cdk` CLI, which looks to be unused.
 *
 * @param outputPath Base path for generated files. Use `options.filePatterns` to configure more complex scenarios.
 * @param options Additional configuration
 */
export async function generateAll(options: GenerateOptions) {
  enableDebug(options);
  const db = await loadAwsServiceSpec();
  const services = queryDb.getAllServices(db);

  const modules: GenerateModuleMap = {};

  for (const service of services) {
    modules[service.name] = {
      services: [{ namespace: service.cloudFormationNamespace }],
    };
  }

  await generator(db, modules, options);
}

function enableDebug(options: GenerateOptions) {
  if (options.debug) {
    process.env.DEBUG = '1';
  }
}

async function generator(
  db: SpecDatabase,
  modules: { [name: string]: GenerateModuleOptions },
  options: GenerateOptions,
): Promise<GenerateOutput> {
  const timeLabel = '🐢  Completed in';
  log.time(timeLabel);
  log.debug('Options', options);
  const { clearOutput, outputPath = process.cwd() } = options;

  const renderer = new TypeScriptRenderer({
    disabledEsLintRules: ['@stylistic/max-len', 'eol-last'],
  });

  // Clear output if requested
  if (clearOutput) {
    fs.removeSync(outputPath);
  }

  const ast = new AstBuilder({
    db,
    filePatterns: {
      ...DEFAULT_FILE_PATTERNS,
      ...noUndefined(options.filePatterns),
    },
    inCdkLib: options.inCdkLib,
  });

  const moduleResources: Record<string, Record<string, string>> = {};

  // Go through the module map
  log.info('Generating %i modules...', Object.keys(modules).length);
  for (const [moduleName, moduleOptions] of Object.entries(modules)) {
    const services = queryDb.getServicesByGenerateServiceRequest(db, moduleOptions.services);

    for (const [req, s] of services) {
      log.debug(moduleName, s.name, 'ast');

      const submod = ast.addService(s, {
        destinationSubmodule: moduleName,
        nameSuffix: req.suffix,
        deprecated: req.deprecated,
      });

      moduleResources[moduleName] = moduleResources[moduleName] ?? {};
      Object.assign(moduleResources[moduleName], submod.resources);
    }
  }

  const moduleOutputFiles = ast.filesBySubmodule();

  const writer = new TsFileWriter(outputPath, renderer);
  ast.writeAll(writer);

  const allResources = Object.values(moduleResources).flat().reduce(mergeObjects, {});
  log.info('Summary:');
  log.info('  Service files:  %i', Object.values(moduleOutputFiles).flat().length);
  log.info('  Resources:      %i', Object.keys(allResources).length);
  log.timeEnd(timeLabel);

  return {
    modules: Object.fromEntries(
      Object.keys(moduleOutputFiles).map((moduleName) => ([
        moduleName,
        {
          outputFiles: Array.from(moduleOutputFiles[moduleName]).sort(),
          resources: moduleResources[moduleName],
        },
      ]),
      )),
  };
}

function mergeObjects<T>(all: T, res: T) {
  return {
    ...all,
    ...res,
  };
}

function noUndefined<A extends object>(x: A | undefined): A | undefined {
  if (!x) {
    return undefined;
  }
  return Object.fromEntries(Object.entries(x).filter(([, v]) => v !== undefined)) as any;
}
