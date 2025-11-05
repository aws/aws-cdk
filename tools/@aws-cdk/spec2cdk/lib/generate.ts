import * as path from 'path';
import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import { DatabaseBuilder } from '@aws-cdk/service-spec-importers';
import { SpecDatabase } from '@aws-cdk/service-spec-types';
import { Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { AstBuilder, DEFAULT_FILE_PATTERNS, GenerateFilePatterns, submoduleFiles } from './cdk/ast';
import { ModuleImportLocations } from './cdk/cdk';
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

  /**
   * Override the default locations where modules are imported from on the module level
   */
  readonly moduleImportLocations?: ModuleImportLocations;
}

export interface GenerateOptions {
  /**
   * Default location for module imports
   */
  readonly importLocations?: ModuleImportLocations;

  /**
   * Configure where files are created exactly
   */
  readonly filePatterns?: Partial<GenerateFilePatterns>;

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

export interface GenerateOutput {
  outputFiles: string[];
  resources: Record<string, string>;
  modules: {
    [name: string]: Array<{
      module: Module;
      options: GenerateModuleOptions;
      resources: Record<string, string>;
      outputFiles: string[];
    }>;
  };
}

/**
 * Generates Constructs for modules from the Service Specs
 *
 * @param modules A map of arbitrary module names to GenerateModuleOptions. This allows for flexible generation of different configurations at a time.
 * @param options Configure the code generation
 */
export async function generate(modules: GenerateModuleMap, options: GenerateOptions) {
  enableDebug(options);
  const db = await loadAwsServiceSpec();

  // Load additional schema files
  await new DatabaseBuilder(db as any, { validate: false })
    .importCloudFormationRegistryResources(path.join(__dirname, '..', 'temporary-schemas'))
    .build();

  return generator(db, modules, options);
}

/**
 * Generates Constructs for all services, with modules name like the service
 *
 * @param outputPath Base path for generated files. Use `options.filePatterns` to configure more complex scenarios.
 * @param options Additional configuration
 */
export async function generateAll(options: GenerateOptions) {
  enableDebug(options);
  const db = await loadAwsServiceSpec();
  const services = await queryDb.getAllServices(db);

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

  const renderer = new TypeScriptRenderer();

  // store results in a map of modules
  const moduleMap: GenerateOutput['modules'] = {};

  // Clear output if requested
  if (clearOutput) {
    fs.removeSync(outputPath);
  }

  const ast = new AstBuilder({
    db,
    modulesRoot: options.importLocations?.modulesRoot,
    filePatterns: {
      ...DEFAULT_FILE_PATTERNS,
      ...noUndefined(options.filePatterns),
    },
  });

  // Go through the module map
  log.info('Generating %i modules...', Object.keys(modules).length);
  for (const [moduleName, moduleOptions] of Object.entries(modules)) {
    const services = queryDb.getServicesByGenerateServiceRequest(db, moduleOptions.services);

    moduleMap[moduleName] = services.map(([req, s]) => {
      log.debug(moduleName, s.name, 'ast');

      const submod = ast.addService(s, {
        destinationSubmodule: moduleName,
        nameSuffix: req.suffix,
        deprecated: req.deprecated,
        importLocations: moduleOptions.moduleImportLocations,
      });

      return {
        module: submod.resourcesMod.module,
        options: moduleOptions,
        resources: submod.resources,
        outputFiles: submoduleFiles(submod).map((x) => path.resolve(x)),
      } satisfies GenerateOutput['modules'][string][number];
    });
  }

  const writer = new TsFileWriter(outputPath, renderer);
  ast.writeAll(writer);

  const result: GenerateOutput = {
    modules: moduleMap,
    resources: Object.values(moduleMap).flat().map(pick('resources')).reduce(mergeObjects, {}),
    outputFiles: writer.outputFiles,
  };

  log.info('Summary:');
  log.info('  Service files:  %i', Object.values(moduleMap).flat().flatMap(pick('module')).length);
  log.info('  Resources:      %i', Object.keys(result.resources).length);
  log.timeEnd(timeLabel);

  return result;
}

function pick<T>(property: keyof T) {
  type x = typeof property;
  return (obj: Record<x, any>): any => {
    return obj[property];
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
