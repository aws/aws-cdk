/* eslint-disable @cdklabs/no-throw-default-error */
import * as path from 'path';
import { SpecDatabase, Resource, Service } from '@aws-cdk/service-spec-types';
import { Module, stmt } from '@cdklabs/typewriter';
import { AugmentationsModule } from './augmentation-generator';
import { CannedMetricsModule } from './canned-metrics';
import { CDK_CORE, CDK_INTERFACES_ENVIRONMENT_AWARE, CONSTRUCTS } from './cdk';
import { SelectiveImport } from './relationship-decider';
import { ResourceClass } from './resource-class';
import { submoduleSymbolFromName } from '../naming/conventions';
import { FilePatternValues, IWriter, substituteFilePattern } from '../util';

export interface AddServiceProps {
  /**
   * Append a suffix at the end of generated names.
   */
  readonly nameSuffix?: string;

  /**
   * Mark everything in the service as deprecated using the provided deprecation message.
   *
   * @default - not deprecated
   */
  readonly deprecated?: string;

  /**
   * The target submodule we want to generate these resources into
   *
   * Practically, only used to render CloudFormation resources into the `core` module, and as a failed
   * experiment to emit `aws-kinesisanalyticsv2` into `aws-kinesisanalytics`.
   */
  readonly destinationSubmodule?: string;
}

export interface AstBuilderProps {
  readonly db: SpecDatabase;

  readonly filePatterns?: Partial<GenerateFilePatterns>;

  /**
   * Whether we are generating code INSIDE `aws-cdk-lib` or outside it
   *
   * This affects the generated import paths.
   */
  readonly inCdkLib?: boolean;
}

export interface GenerateFilePatterns {
  /**
   * The pattern used to name resource files.
   */
  readonly resources: string;

  /**
   * The pattern used to name augmentations.
   */
  readonly augmentations: string;

  /**
   * The pattern used to name canned metrics.
   */
  readonly cannedMetrics: string;

  /**
   * The pattern used to name the interfaces entry point file
   */
  readonly interfacesEntry: string;

  /**
   * The pattern used to name the interfaces file
   */
  readonly interfaces: string;
}

export function makePaths(patterns: GenerateFilePatterns, values: FilePatternValues): { [k in keyof GenerateFilePatterns]: string } {
  return Object.fromEntries(Object.entries(patterns)
    .map(([name, pattern]) => [name, substituteFilePattern(pattern, values)] as const)) as any;
}

export const DEFAULT_FILE_PATTERNS: GenerateFilePatterns = {
  resources: '%moduleName%/%serviceShortName%.generated.ts',
  augmentations: '%moduleName%/%serviceShortName%-augmentations.generated.ts',
  cannedMetrics: '%moduleName%/%serviceShortName%-canned-metrics.generated.ts',
  interfacesEntry: 'interfaces/index.generated.ts',
  interfaces: 'interfaces/generated/%serviceName%-interfaces.generated.ts',
};

/**
 * AST builder
 *
 * Note that the concept of "submodule" and `Module` look similar but are diferent.
 *
 * - `Module` is a `@cdklabs/typewriter` concept, which in TypeScript corresponds to a
 *   source file.
 * - "submodule" is a `spec2cdk` concept that referes to a subdirectory, which at the
 *   same time represents a jsii submodule (except for `core`, which IS a subdirectory
 *   but will NOT be treated as a jsii submodule).
 *
 * Most submodules this class keeps track of correspond to "service" submodules, which
 * means submodules that represent an AWS service.
 */
export class AstBuilder {
  public readonly db: SpecDatabase;
  public readonly modules = new Map<string, Module>();

  public readonly serviceSubmodules = new Map<string, ServiceSubmodule>();
  private readonly filePatterns: GenerateFilePatterns;
  private readonly interfacesEntry: LocatedModule<Module>;
  private readonly inCdkLib: boolean;

  constructor(
    props: AstBuilderProps,
  ) {
    this.db = props.db;
    this.filePatterns = {
      ...DEFAULT_FILE_PATTERNS,
      ...noUndefined(props?.filePatterns ?? {}),
    };
    this.inCdkLib = props.inCdkLib ?? false;

    if (this.filePatterns.interfacesEntry.includes('%')) {
      throw new Error(`interfacesEntry may not contain placeholders, got: ${this.filePatterns.interfacesEntry}`);
    }

    this.interfacesEntry = this.rememberModule({
      module: new Module('interfaces/index'),
      filePath: this.filePatterns.interfacesEntry,
    });
  }

  /**
   * Add all resources in a service
   */
  public addService(service: Service, props?: AddServiceProps) {
    const resources = this.db.follow('hasResource', service);
    const submod = this.createServiceSubmodule(service, props?.destinationSubmodule);

    for (const { entity: resource } of resources) {
      this.addResourceToSubmodule(submod, resource, props);
    }

    this.postprocessSubmodule(submod);

    return submod;
  }

  /**
   * Build an module for a single resource (only used for testing)
   */
  public addResource(resource: Resource, props?: AddServiceProps) {
    const service = this.db.incoming('hasResource', resource).only().entity;
    const submod = this.createServiceSubmodule(service, props?.destinationSubmodule);

    this.addResourceToSubmodule(submod, resource, props);

    this.postprocessSubmodule(submod);

    return submod;
  }

  public writeAll(writer: IWriter) {
    for (const [fileName, module] of this.modules.entries()) {
      if (shouldRender(module)) {
        writer.write(module, fileName);
      }
    }
  }

  /**
   * Return (relative) filenames, grouped by submodule
   *
   * Submodule means subdirectory; this does not exclusively return service submodules,
   * it returns files from all `Module`s that have been registered.
   */
  public filesBySubmodule(): Record<string, string[]> {
    const ret: Record<string, string[]> = {};
    for (const [fileName, module] of this.modules.entries()) {
      if (!shouldRender(module)) {
        continue;
      }

      // Group by the first path component component
      const parts = fileName.split(path.posix.sep);
      if (parts.length === 1) {
        continue;
      }
      const submoduleName = parts[0];
      ret[submoduleName] ??= [];
      ret[submoduleName].push(fileName);
    }
    return ret;
  }

  private addResourceToSubmodule(submodule: ServiceSubmodule, resource: Resource, props?: AddServiceProps) {
    const resourceModule = submodule.resourcesMod.module;

    const resourceClass = new ResourceClass(resourceModule, this.db, resource, {
      suffix: props?.nameSuffix,
      deprecated: props?.deprecated,
      interfacesModule: {
        module: submodule.interfaces.module,
        importLocation: relativeImportPath(submodule.resourcesMod, submodule.interfaces),
      },
    });
    submodule.resources[resource.cloudFormationType] = resourceClass.spec.name;

    resourceClass.build();

    this.addSelectiveImports(submodule, resourceClass.imports);
    submodule.augmentations.module.augmentResource(resource, resourceClass);
  }

  private addSelectiveImports(submodule: ServiceSubmodule, imports: SelectiveImport[]) {
    for (const selectiveImport of imports) {
      const existingModuleImport = submodule.selectiveImports.find(
        (imp) => imp.moduleName === selectiveImport.moduleName,
      );
      if (!existingModuleImport) {
        submodule.selectiveImports.push(selectiveImport);
      } else {
        // We need to avoid importing the same reference multiple times
        for (const type of selectiveImport.types) {
          if (!existingModuleImport.types.find((t) =>
            t.originalType === type.originalType && t.aliasedType === type.aliasedType,
          )) {
            existingModuleImport.types.push(type);
          }
        }
      }
    }
  }

  /**
   * Do whatever we need to do after a service has been rendered to a submodule
   *
   * (Mostly: create additional files that import generated files)
   */
  private postprocessSubmodule(submodule: ServiceSubmodule) {
    // Selective imports from constructor
    const sortedImports = submodule.selectiveImports.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
    for (const selectiveImport of sortedImports) {
      const sourceModule = new Module(selectiveImport.moduleName);
      sourceModule.importSelective(submodule.resourcesMod.module, selectiveImport.types.map((t) => `${t.originalType} as ${t.aliasedType}`), {
        fromLocation: relativeImportPath(submodule.resourcesMod.filePath, sourceModule.name),
      });
    }

    // Add an import for the interfaces file to the entry point file (make sure not to do it twice)
    if (shouldRender(submodule.interfaces.module) && submodule.didCreateInterfaceModule) {
      const exportName = submoduleSymbolFromName(submodule.service.name);
      const importLocation = relativeImportPath(this.interfacesEntry, submodule.interfaces);

      this.interfacesEntry.module.addInitialization(stmt.directCode(
        `export * as ${exportName} from '${importLocation}'`,
      ));
    }
  }

  private createServiceSubmodule(service: Service, targetSubmodule?: string): ServiceSubmodule {
    const submoduleName = targetSubmodule ?? service.name;
    const key = `${submoduleName}/${service.name}`;

    const submod = this.serviceSubmodules.get(key);
    if (submod) {
      return submod;
    }

    // ResourceModule and AugmentationsModule starts out empty and needs to be filled on a resource-by-resource basis
    const resourcesMod = this.rememberModule(this.createResourceModule(submoduleName, service));
    const augmentations = this.rememberModule(this.createAugmentationsModule(submoduleName, service));
    const cannedMetrics = this.rememberModule(this.createCannedMetricsModule(submoduleName, service));
    const [interfaces, didCreateInterfaceModule] = this.obtainInterfaceModule(service);

    const ret: ServiceSubmodule = {
      service,
      submoduleName: submoduleName,
      resourcesMod,
      augmentations,
      cannedMetrics,
      interfaces,
      didCreateInterfaceModule,
      selectiveImports: [],
      resources: {},
    };

    this.serviceSubmodules.set(key, ret);
    return ret;
  }

  /**
   * Create or find the module where we should add the interfaces for these resources
   *
   * Complicated by the fact that we generate classes for some services in multiple places, but we should only generate the interfaces once.
   */
  private obtainInterfaceModule(service: Service): [LocatedModule<Module>, boolean] {
    const filePath = this.pathsFor('$UNUSED$', service).interfaces;

    return this.modules.has(filePath)
      ? [{ module: this.modules.get(filePath)!, filePath }, false]
      : [this.rememberModule(this.createInterfaceModule(service)), true];
  }

  private createInterfaceModule(service: Service): LocatedModule<Module> {
    const filePath = this.pathsFor('$UNUSED$', service).interfaces;
    const imports = this.resolveImportPaths(filePath);

    const module = new Module(`@aws-cdk/interfaces/${service.name}`);
    CDK_INTERFACES_ENVIRONMENT_AWARE.importSelective(module, ['IEnvironmentAware'], {
      fromLocation: imports.interfacesEnvironmentAware,
    });
    CONSTRUCTS.import(module, 'constructs');

    return { module, filePath };
  }

  private createResourceModule(moduleName: string, service: Service): LocatedModule<Module> {
    const filePath = this.pathsFor(moduleName, service).resources;
    const imports = this.resolveImportPaths(filePath);

    const module = new Module(`@aws-cdk/${moduleName}/${service.name}`);

    this.addImports(module, imports);

    return { module, filePath };
  }

  protected addImports(targetModule: Module, imports: ImportPaths) {
    CDK_CORE.import(targetModule, 'cdk', { fromLocation: imports.core });
    CONSTRUCTS.import(targetModule, 'constructs');
    CDK_CORE.helpers.import(targetModule, 'cfn_parse', { fromLocation: imports.coreHelpers });
    CDK_CORE.errors.import(targetModule, 'cdk_errors', { fromLocation: imports.coreErrors });
  }

  private createAugmentationsModule(moduleName: string, service: Service): LocatedModule<AugmentationsModule> {
    const filePath = this.pathsFor(moduleName, service).augmentations;
    return {
      module: new AugmentationsModule(this.db, service.shortName),
      filePath,
    };
  }

  private createCannedMetricsModule(moduleName: string, service: Service): LocatedModule<CannedMetricsModule> {
    const filePath = this.pathsFor(moduleName, service).cannedMetrics;
    return {
      module: CannedMetricsModule.forService(this.db, service),
      filePath,
    };
  }

  public module(key: string) {
    const ret = this.modules.get(key);
    if (!ret) {
      throw new Error(`No such module: ${key}`);
    }
    return ret;
  }

  private rememberModule<M extends Module>(
    module: LocatedModule<M>,
  ): LocatedModule<M> {
    if (this.modules.has(module.filePath)) {
      throw new Error(`Duplicate module key: ${module.filePath}`);
    }
    this.modules.set(module.filePath, module.module);

    return module;
  }

  private resolveImportPaths(sourceModule: string): ImportPaths {
    if (!this.inCdkLib) {
      return {
        core: 'aws-cdk-lib/core',
        interfacesEnvironmentAware: 'aws-cdk-lib/interfaces',
        coreHelpers: 'aws-cdk-lib/core/lib/helpers-internal',
        coreErrors: 'aws-cdk-lib/core/lib/errors',
        cloudwatch: 'aws-cdk-lib/aws-cloudwatch',
      };
    }

    return {
      core: relativeImportPath(sourceModule, 'core/lib'),
      interfacesEnvironmentAware: relativeImportPath(sourceModule, 'interfaces/environment-aware'),
      coreHelpers: relativeImportPath(sourceModule, 'core/lib/helpers-internal'),
      coreErrors: relativeImportPath(sourceModule, 'core/lib/errors'),
      cloudwatch: relativeImportPath(sourceModule, 'aws-cloudwatch'),
    };
  }

  private pathsFor(submoduleName: string, service: Service) {
    return makePaths(this.filePatterns, { moduleName: submoduleName, serviceName: service.name, serviceShortName: service.shortName });
  }
}

/**
 * A service that got generated into a submodule.
 *
 * (This will be used by cfn2ts later to generate all kinds of codegen metadata)
 */
export interface ServiceSubmodule {
  /**
   * The name of the submodule of aws-cdk-lib where these service resources got written
   */
  readonly submoduleName: string;

  readonly service: Service;

  readonly resourcesMod: LocatedModule<Module>;
  readonly augmentations: LocatedModule<AugmentationsModule>;
  readonly cannedMetrics: LocatedModule<CannedMetricsModule>;
  readonly interfaces: LocatedModule<Module>;

  readonly didCreateInterfaceModule: boolean;
  readonly selectiveImports: Array<SelectiveImport>;

  /**
   * Map of CloudFormation resource name to generated class name
   */
  readonly resources: Record<string, string>;
}

interface LocatedModule<T extends Module> {
  readonly module: T;
  readonly filePath: string;
}

function noUndefined<A extends object>(x: A | undefined): A | undefined {
  if (!x) {
    return undefined;
  }
  return Object.fromEntries(Object.entries(x).filter(([, v]) => v !== undefined)) as any;
}

export function submoduleFiles(x: ServiceSubmodule): string[] {
  const ret = [];
  for (const mod of [x.resourcesMod, x.augmentations, x.cannedMetrics]) {
    if (shouldRender(mod.module)) {
      ret.push(mod.filePath);
    }
  }
  return ret;
}

function shouldRender(m: Module) {
  return m.types.length > 0 || m.initialization.length > 0;
}

function relativeImportPath(source: LocatedModule<any> | string, target: LocatedModule<any> | string) {
  const src = typeof source === 'string' ? source : source.filePath;
  const dst = typeof target === 'string' ? target : target.filePath;

  const ret = path.posix.relative(path.dirname(src), dst.replace(/\.ts$/, ''));
  // Apparently something we have to worry about for directories
  if (!ret) {
    return '.';
  }

  // Make sure we always start with `./` or `../` or it's accidentally a package name instead of a file name.
  return ret.startsWith('.') ? ret : './' + ret;
}

interface ImportPaths {
  /**
   * The import name used import the core module
   */
  readonly core: string;

  /**
   * The import name used import a specific interface from the `interfaces` module
   *
   * Not the entire module but a specific file, so that if we're codegenning inside `aws-cdk-lib`
   * we can pinpoint the exact file we need to load.
   */
  readonly interfacesEnvironmentAware: string;

  /**
   * The import name used to import core helpers module
   */
  readonly coreHelpers: string;

  /**
   * The import name used to import core errors module
   */
  readonly coreErrors: string;

  /**
   * The import name used to import the CloudWatch module
   */
  readonly cloudwatch: string;
}
