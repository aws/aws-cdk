import * as path from 'node:path';
import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import { DatabaseBuilder } from '@aws-cdk/service-spec-importers';
import type { Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import type { GrantsProps } from './cdk/aws-cdk-lib';
import { AwsCdkLibBuilder } from './cdk/aws-cdk-lib';
import { GrantsModule } from './cdk/grants-module';
import type { LibraryBuilder } from './cdk/library-builder';
import { queryDb, log, TsFileWriter } from './util';

export type BuilderProps<T> = T extends new (first: infer P, ...args: any[]) => any ? P : never;

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

type LBC = new (...args: any[]) => LibraryBuilder;

export interface GenerateOptions<Builder extends LBC>{
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
   * Output debug messages
   * @default false
   */
  readonly debug?: boolean;

  /**
   * Additional builder options.
   */
  readonly builderProps?: Partial<BuilderProps<Builder>>;

  /**
   * A function that returns an AstBuilder instance.
   * @default - The default AstBuilder is constructed
   */
  readonly astBuilder?: Builder;

  /**
   * Provide an already loaded spec database.
   *
   * @default - load the patched spec db
   */
  readonly db?: SpecDatabase;

  /**
   * Whether the modules being generated are considered stable
   *
   * @default true
   */
  readonly isStable?: boolean;
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
export async function generate<Builder extends LBC = typeof AwsCdkLibBuilder>(modules: GenerateModuleMap, options: GenerateOptions<Builder>) {
  enableDebug(options);
  const db = options.db ?? await loadPatchedSpec();
  return generator<Builder>(db, modules, options);
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
export async function generateAll<Builder extends LBC = typeof AwsCdkLibBuilder>(options: GenerateOptions<Builder>) {
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

function enableDebug(options: { debug?: boolean }) {
  if (options.debug) {
    process.env.DEBUG = '1';
  }
}

async function generator<Builder extends LBC = typeof AwsCdkLibBuilder>(
  db: SpecDatabase,
  modules: { [name: string]: GenerateModuleOptions },
  options: GenerateOptions<Builder>,
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

  const LibBuilder = options.astBuilder ?? AwsCdkLibBuilder;
  const ast = new LibBuilder({
    db,
    ...options.builderProps,
  } as any);

  const servicesPerModule: Record<string, Service[]> = {};
  const resourcesPerModule: Record<string, Record<string, string>> = {};

  const isStable = options.isStable ?? true;

  // Go through the module map
  log.info('Generating %i modules...', Object.keys(modules).length);
  for (const [moduleName, moduleOptions] of Object.entries(modules)) {
    const services = queryDb.getServicesByGenerateServiceRequest(db, moduleOptions.services);

    for (const [req, s] of services) {
      log.debug(moduleName, s.name, 'ast');

      const grantsConfig = grantsConfigForModule(moduleName, outputPath, isStable);
      const grantsProps: GrantsProps | undefined = grantsConfig ? { config: grantsConfig, isStable } : undefined;

      const submod = ast.addService(s, {
        destinationSubmodule: moduleName,
        nameSuffix: req.suffix,
        deprecated: req.deprecated,
        grantsProps,
      });

      servicesPerModule[moduleName] ??= [];
      servicesPerModule[moduleName].push(s);

      resourcesPerModule[moduleName] ??= {};
      for (const [res, type] of submod.resources.entries()) {
        resourcesPerModule[moduleName][res] = type.name;
      }
    }
  }

  const moduleOutputFiles = ast.filesBySubmodule();

  const writer = new TsFileWriter(renderer);

  // Write all modules into their respective files
  const writtenFileNames: string[] = [];
  for (const [fileName, module] of ast.modules.entries()) {
    if (!module.isEmpty()) {
      const fullPath = path.join(outputPath, isStable ? fileName : toAlphaPackage(fileName));
      if (isStable || module instanceof GrantsModule) {
        writer.write(module, fullPath);
        writtenFileNames.push(fileName);
      }
    }
  }

  const allResources = Object.values(resourcesPerModule).flat().reduce(mergeObjects, {});
  log.info('Summary:');
  log.info('  Services:     %i', Object.values(servicesPerModule).flat().length);
  log.info('  Files:        %i', Object.values(moduleOutputFiles).flat().length);
  log.info('  Resources:    %i', Object.keys(allResources).length);
  log.timeEnd(timeLabel);

  const output: GenerateOutput = {
    modules: {},
  };

  for (let moduleName of Object.keys(moduleOutputFiles)) {
    const outputFiles = Array.from(moduleOutputFiles[moduleName])
      .filter(fileName => writtenFileNames.includes(fileName))
      .sort();
    if (outputFiles.length > 0) {
      output.modules[moduleName] = {
        outputFiles,
        resources: resourcesPerModule[moduleName],
      };
    }
  }

  return output;
}

function mergeObjects<T>(all: T, res: T) {
  return {
    ...all,
    ...res,
  };
}

function grantsConfigForModule(moduleName: string, modulePath: string, isStable: boolean): string | undefined {
  const grantsFileLocation = isStable ? path.join(modulePath, moduleName) : path.join(modulePath, '..', `${moduleName}-alpha`);
  const config = readGrantsConfig(grantsFileLocation);
  return config == null ? undefined : config;
}

function readGrantsConfig(dir: string): string | undefined {
  try {
    return fs.readFileSync(path.join(dir, 'grants.json'), 'utf-8');
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      return undefined;
    }
    throw e;
  }
}

function toAlphaPackage(s: string) {
  return s.replace(/^(aws-[^/]+)/, '$1-alpha');
}
