import * as path from 'path';
import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import { DatabaseBuilder } from '@aws-cdk/service-spec-importers';
import { SpecDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { AstBuilder, ServiceModule } from './cdk/ast';
import { ModuleImportLocations } from './cdk/cdk';
import { queryDb, log, PatternedString, TsFileWriter } from './util';

export type PatternKeys = 'moduleName' | 'serviceName' | 'serviceShortName';

export interface GenerateModuleOptions {
  /**
   * List of services to generate files for.
   *
   * In CloudFormation notation.
   *
   * @example ["AWS::Lambda", "AWS::S3"]
   */
  readonly services: string[];

  /**
   * Map of optional suffixes used for classes generated for a service.
   *
   * @example { "AWS::Lambda": "FooBar"} -> class CfnFunctionFooBar {}
   */
  readonly serviceSuffixes?: { [service: string]: string };

  /**
   * Override the default locations where modules are imported from on the module level
   */
  readonly moduleImportLocations?: ModuleImportLocations;
}

export interface GenerateFilePatterns {
  /**
   * The pattern used to name resource files.
   * @default "%module.name%/%service.short%.generated.ts"
   */
  readonly resources?: PatternedString<PatternKeys>;

  /**
   * The pattern used to name augmentations.
   * @default "%module.name%/%service.short%-augmentations.generated.ts"
   */
  readonly augmentations?: PatternedString<PatternKeys>;

  /**
   * The pattern used to name canned metrics.
   * @default "%module.name%/%service.short%-canned-metrics.generated.ts"
   */
  readonly cannedMetrics?: PatternedString<PatternKeys>;
}

export interface GenerateOptions {
  /**
   * Default location for module imports
   */
  readonly importLocations?: ModuleImportLocations;

  /**
   * Configure where files are created exactly
   */
  readonly filePatterns?: GenerateFilePatterns;

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
      module: AstBuilder<ServiceModule>;
      options: GenerateModuleOptions;
      resources: AstBuilder<ServiceModule>['resources'];
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
      services: [service.cloudFormationNamespace],
    };
  }

  return generator(db, modules, options);
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
  const { augmentationsSupport, clearOutput, outputPath = process.cwd() } = options;
  const filePatterns = ensureFilePatterns(options.filePatterns);

  const renderer = new TypeScriptRenderer();

  // store results in a map of modules
  const moduleMap: GenerateOutput['modules'] = {};

  // Clear output if requested
  if (clearOutput) {
    fs.removeSync(outputPath);
  }

  // Go through the module map
  log.info('Generating %i modules...', Object.keys(modules).length);
  for (const [moduleName, moduleOptions] of Object.entries(modules)) {
    const { moduleImportLocations: importLocations = options.importLocations, serviceSuffixes } = moduleOptions;
    moduleMap[moduleName] = queryDb.getServicesByCloudFormationNamespace(db, moduleOptions.services).map((s) => {
      log.debug(moduleName, s.name, 'ast');
      const ast = AstBuilder.forService(s, {
        db,
        importLocations,
        nameSuffix: serviceSuffixes?.[s.cloudFormationNamespace],
      });

      log.debug(moduleName, s.name, 'render');
      const writer = new TsFileWriter(outputPath, renderer, {
        ['moduleName']: moduleName,
        ['serviceName']: ast.module.service.toLowerCase(),
        ['serviceShortName']: ast.module.shortName.toLowerCase(),
      });

      // Resources
      writer.write(ast.module, filePatterns.resources);

      if (ast.augmentations?.hasAugmentations) {
        const augFile = writer.write(ast.augmentations, filePatterns.augmentations);

        if (augmentationsSupport) {
          const augDir = path.dirname(augFile);
          for (const supportMod of ast.augmentations.supportModules) {
            writer.write(supportMod, path.resolve(augDir, `${supportMod.importName}.ts`));
          }
        }
      }

      if (ast.cannedMetrics?.hasCannedMetrics) {
        writer.write(ast.cannedMetrics, filePatterns.cannedMetrics);
      }

      return {
        module: ast,
        options: moduleOptions,
        resources: ast.resources,
        outputFiles: writer.outputFiles,
      };
    });
  }

  const result = {
    modules: moduleMap,
    resources: Object.values(moduleMap).flat().map(pick('resources')).reduce(mergeObjects, {}),
    outputFiles: Object.values(moduleMap).flat().flatMap(pick('outputFiles')),
  };

  log.info('Summary:');
  log.info('  Service files:  %i', Object.values(moduleMap).flat().flatMap(pick('module')).length);
  log.info('  Resources:      %i', Object.keys(result.resources).length);
  log.timeEnd(timeLabel);

  return result;
}

function ensureFilePatterns(patterns: GenerateFilePatterns = {}): Required<GenerateFilePatterns> {
  return {
    resources: ({ serviceShortName }) => `${serviceShortName}.generated.ts`,
    augmentations: ({ serviceShortName }) => `${serviceShortName}-augmentations.generated.ts`,
    cannedMetrics: ({ serviceShortName }) => `${serviceShortName}-canned-metrics.generated.ts`,
    ...patterns,
  };
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
