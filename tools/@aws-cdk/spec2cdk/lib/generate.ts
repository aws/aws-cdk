import * as path from 'path';
import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import { DatabaseBuilder } from '@aws-cdk/service-spec-importers';
import { SpecDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { AstBuilder, ServiceModule } from './cdk/ast';
import { ModuleImportLocations } from './cdk/cdk';
import { GrantsModule } from './cdk/grants-module';
import { queryDb, log, PatternedString, TsFileWriter, PatternValues, PatternKeys } from './util';

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

export interface GenerateFilePatterns {
  /**
   * The pattern used to name resource files.
   */
  resources: PatternedString<PatternKeys>;

  /**
   * The pattern used to name augmentations.
   */
  augmentations: PatternedString<PatternKeys>;

  /**
   * The pattern used to name canned metrics.
   */
  cannedMetrics: PatternedString<PatternKeys>;

  /**
   * The file that holds the generated grants class
   */
  grantsClass: PatternedString<PatternKeys>;

  /**
   * The file that holds the source grants JSON file
   */
  grantsJson: PatternedString<PatternKeys>;
}

export interface GenerateOptions {
  /**
   * Default location for module imports
   */
  readonly importLocations?: ModuleImportLocations;

  /**
   * Configure where files are created exactly
   */
  readonly filePatterns: GenerateFilePatterns;

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
export async function generateSome(modules: GenerateModuleMap, options: GenerateOptions) {
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
  const { augmentationsSupport, clearOutput, outputPath = process.cwd(), filePatterns } = options;

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
    const { moduleImportLocations: importLocations = options.importLocations, services } = moduleOptions;

    moduleMap[moduleName] = [];
    for (const [req, s] of queryDb.getServicesByGenerateServiceRequest(db, services)) {
      log.debug(moduleName, s.name, 'ast');
      const ast = AstBuilder.forService(s, {
        db,
        importLocations,
        nameSuffix: req.suffix,
        deprecated: req.deprecated,
      });

      log.debug(moduleName, s.name, 'render');
      const filenamePlaceHolders: PatternValues<PatternKeys> = {
        moduleName: moduleName,
        serviceName: ast.module.service.toLowerCase(),
        serviceShortName: ast.module.shortName.toLowerCase(),
      };
      const writer = new TsFileWriter(outputPath, renderer, filenamePlaceHolders);

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

      // Grants from a separate file
      const grantsModule = await GrantsModule.forService(db, s, filePatterns.grantsJson(filenamePlaceHolders));
      if (grantsModule) {
        writer.write(grantsModule, filePatterns.grantsClass);
      }

      moduleMap[moduleName].push({
        module: ast,
        options: moduleOptions,
        resources: ast.resources,
        outputFiles: writer.outputFiles,
      });
    }
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

export function defaultFilePatterns(): GenerateFilePatterns {
  return {
    resources: ({ moduleName: m, serviceShortName: s }) => `${m}/lib/${s}.generated.ts`,
    augmentations: ({ moduleName: m, serviceShortName: s }) => `${m}/lib/${s}-augmentations.generated.ts`,
    cannedMetrics: ({ moduleName: m, serviceShortName: s }) => `${m}/lib/${s}-canned-metrics.generated.ts`,
    grantsClass: ({ moduleName, serviceShortName }) => `${moduleName}/lib/${serviceShortName}-grants.generated.ts`,
    grantsJson: ({ moduleName }) => `${moduleName}/grants.json`,
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
export { PatternKeys };

