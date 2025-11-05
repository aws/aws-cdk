/* eslint-disable @cdklabs/no-throw-default-error */
import * as path from 'path';
import { SpecDatabase, Resource, Service } from '@aws-cdk/service-spec-types';
import { Module } from '@cdklabs/typewriter';
import { AugmentationsModule } from './augmentation-generator';
import { CannedMetricsModule } from './canned-metrics';
import { CDK_CORE, CONSTRUCTS, ModuleImportLocations } from './cdk';
import { SelectiveImport } from './relationship-decider';
import { ResourceClass } from './resource-class';
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

  /**
   * Override the locations modules are imported from
   */
  readonly importLocations?: ModuleImportLocations;
}

export interface AstBuilderProps {
  readonly db: SpecDatabase;

  readonly modulesRoot?: string;

  readonly filePatterns?: Partial<GenerateFilePatterns>;
}

export interface GenerateFilePatterns {
  /**
   * The pattern used to name resource files.
   * @default "%serviceName%/%serviceShortName%.generated.ts"
   */
  readonly resources: string;

  /**
   * The pattern used to name augmentations.
   * @default "%serviceName%/%serviceShortName%-augmentations.generated.ts"
   */
  readonly augmentations: string;

  /**
   * The pattern used to name canned metrics.
   * @default "%serviceName%/%serviceShortName%-canned-metrics.generated.ts"
   */
  readonly cannedMetrics: string;
}

export function makeNames(patterns: GenerateFilePatterns, values: FilePatternValues): { [k in keyof GenerateFilePatterns]: string } {
  return Object.fromEntries(Object.entries(patterns)
    .map(([name, pattern]) => [name, substituteFilePattern(pattern, values)] as const)) as any;
}

export const DEFAULT_FILE_PATTERNS: GenerateFilePatterns = {
  resources: '%moduleName%/%serviceShortName%.generated.ts',
  augmentations: '%moduleName%/%serviceShortName%-augmentations.generated.ts',
  cannedMetrics: '%moduleName%/%serviceShortName%-canned-metrics.generated.ts',
};

export class AstBuilder {
  public readonly db: SpecDatabase;
  public readonly modules = new Map<string, Module & IShouldRenderModule>();

  public readonly selectiveImports = new Array<SelectiveImport>();

  public readonly serviceModules = new Map<string, SubmoduleInfo>();
  private readonly modulesRootLocation: string;
  private readonly filePatterns: GenerateFilePatterns;

  constructor(
    props: AstBuilderProps,
  ) {
    this.db = props.db;
    this.modulesRootLocation = props.modulesRoot ?? '../..';
    this.filePatterns = {
      ...DEFAULT_FILE_PATTERNS,
      ...noUndefined(props?.filePatterns ?? {}),
    };
  }

  /**
   * Add all resources in a service
   */
  public addService(service: Service, props?: AddServiceProps) {
    const resources = this.db.follow('hasResource', service);
    // Sometimes we emit multiple services into the same submodule
    // (aws-kinesisanalyticsv2 gets emitted into aws-kinesisanalytics with a
    // suffix. This was a failed experiment we still need to maintain.)
    const submod = this.createSubmodule(service, props?.destinationSubmodule, props?.importLocations);

    for (const { entity: resource } of resources) {
      this.addResourceToSubmodule(submod, resource, props);
    }

    this.renderImports(submod);
    return submod;
  }

  /**
   * Build an module for a single resource (only used for testing)
   */
  public addResource(resource: Resource, props?: AddServiceProps) {
    const service = this.db.incoming('hasResource', resource).only().entity;
    const submod = this.createSubmodule(service, props?.destinationSubmodule, props?.importLocations);

    this.addResourceToSubmodule(submod, resource, props);

    this.renderImports(submod);
    return submod;
  }

  public writeAll(writer: IWriter) {
    for (const [fileName, module] of this.modules.entries()) {
      if (module.shouldRender) {
        writer.write(module, fileName);
      }
    }
  }

  private addResourceToSubmodule(submodule: SubmoduleInfo, resource: Resource, props?: AddServiceProps) {
    const resourceModule = submodule.resourcesMod.module;

    const resourceClass = new ResourceClass(resourceModule, this.db, resource, {
      suffix: props?.nameSuffix,
      deprecated: props?.deprecated,
    });
    submodule.resources[resource.cloudFormationType] = resourceClass.spec.name;

    resourceClass.build();

    this.addImports(resourceClass);
    submodule.augmentations.module.augmentResource(resource, resourceClass);
  }

  private addImports(resourceClass: ResourceClass) {
    for (const selectiveImport of resourceClass.imports) {
      const existingModuleImport = this.selectiveImports.find(
        (imp) => imp.moduleName === selectiveImport.moduleName,
      );
      if (!existingModuleImport) {
        this.selectiveImports.push(selectiveImport);
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

  private renderImports(serviceModules: SubmoduleInfo) {
    const sortedImports = this.selectiveImports.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
    for (const selectiveImport of sortedImports) {
      const sourceModule = new Module(selectiveImport.moduleName);
      sourceModule.importSelective(serviceModules.resourcesMod.module, selectiveImport.types.map((t) => `${t.originalType} as ${t.aliasedType}`), {
        fromLocation: `${this.modulesRootLocation}/${sourceModule.name}`,
      });
    }
  }

  private createSubmodule(service: Service, targetSubmodule?: string, importLocations?: ModuleImportLocations): SubmoduleInfo {
    const submoduleName = targetSubmodule ?? service.name;
    const key = `${submoduleName}/${service.name}`;

    const submod = this.serviceModules.get(key);
    if (submod) {
      return submod;
    }

    // ResourceModule and AugmentationsModule starts out empty and needs to be filled on a resource-by-resource basis
    const names = makeNames(this.filePatterns, { moduleName: submoduleName, serviceShortName: service.shortName });
    const resourcesMod = this.rememberModule(this.createResourceModule(submoduleName, service.name, importLocations), names.resources);
    const augmentations = this.rememberModule(
      new AugmentationsModule(this.db, service.shortName, importLocations?.cloudwatch),
      names.augmentations,
    );

    // CannedMetricsModule fill themselves upon construction
    const cannedMetrics = this.rememberModule(CannedMetricsModule.forService(this.db, service), names.cannedMetrics);

    const ret: SubmoduleInfo = {
      service,
      submoduleName: submoduleName,
      resourcesMod,
      augmentations,
      cannedMetrics,
      resources: {},
    };

    this.serviceModules.set(key, ret);
    return ret;
  }

  private createResourceModule(moduleName: string, serviceName: string, importLocations?: ModuleImportLocations) {
    const resourceModule = new AlwaysRenderModule(`@aws-cdk/${moduleName}/${serviceName}`);
    CDK_CORE.import(resourceModule, 'cdk', { fromLocation: importLocations?.core });
    CONSTRUCTS.import(resourceModule, 'constructs');
    CDK_CORE.helpers.import(resourceModule, 'cfn_parse', { fromLocation: importLocations?.coreHelpers });
    CDK_CORE.errors.import(resourceModule, 'cdk_errors', { fromLocation: importLocations?.coreErrors });
    return resourceModule;
  }

  public module(key: string) {
    const ret = this.modules.get(key);
    if (!ret) {
      throw new Error(`No such module: ${key}`);
    }
    return ret;
  }

  private rememberModule<M extends Module & IShouldRenderModule>(
    module: M,
    fullPath: string,
  ): LocatedModule<M> {
    const filePath = path.relative(this.modulesRootLocation, fullPath);
    if (this.modules.has(filePath)) {
      throw new Error(`Duplicate module key: ${filePath}`);
    }
    this.modules.set(filePath, module);

    return { module, filePath };
  }
}

/**
 * Bookkeeping around submodules, mostly used to report on what the generator did
 *
 * (This will be used by cfn2ts later to generate all kinds of codegen metadata)
 */
export interface SubmoduleInfo {
  /**
   * The name of the submodule of aws-cdk-lib where these service resources got written
   */
  readonly submoduleName: string;

  readonly service: Service;

  readonly resourcesMod: LocatedModule<AlwaysRenderModule>;
  readonly augmentations: LocatedModule<AugmentationsModule>;
  readonly cannedMetrics: LocatedModule<CannedMetricsModule>;

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

export function submoduleFiles(x: SubmoduleInfo): string[] {
  const ret = [];
  for (const mod of [x.resourcesMod, x.augmentations, x.cannedMetrics]) {
    if (mod.module.shouldRender) {
      ret.push(mod.filePath);
    }
  }
  return ret;
}

export interface IShouldRenderModule {
  readonly shouldRender: boolean;
}

export class AlwaysRenderModule extends Module implements IShouldRenderModule {
  public readonly shouldRender: boolean = true;
}
