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
   * The target resource module we want to generate these resources into
   *
   * (Practically, only used to render CloudFormation resources into the `core` module.)
   */
  readonly destinationModule?: string;

  /**
   * Override the locations modules are imported from
   */
  readonly importLocations?: ModuleImportLocations;
}

export interface AstBuilderProps {
  readonly db: SpecDatabase;

  readonly modulesRoot?: string;
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

export const DEFAULT_FILE_PATTERNS: GenerateFilePatterns = {
  resources: '%serviceName%/%serviceShortName%.generated.ts',
  augmentations: '%serviceName%/%serviceShortName%-augmentations.generated.ts',
  cannedMetrics: '%serviceName%/%serviceShortName%-canned-metrics.generated.ts',
};

export class AstBuilder {
  public readonly db: SpecDatabase;

  public readonly selectiveImports = new Array<SelectiveImport>();

  public readonly serviceModules = new Map<string, SubmoduleInfo>();
  private readonly modulesRootLocation: string;

  constructor(
    props: AstBuilderProps,
  ) {
    this.db = props.db;
    this.modulesRootLocation = props.modulesRoot ?? '../..';
  }

  /**
   * Add all resources in a service
   */
  public addService(service: Service, props?: AddServiceProps) {
    const resources = this.db.follow('hasResource', service);
    const submod = this.createSubmodule(service, props?.destinationModule, props?.importLocations);

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
    const submod = this.createSubmodule(service, props?.destinationModule, props?.importLocations);

    this.addResourceToSubmodule(submod, resource, props);

    this.renderImports(submod);
    return submod;
  }

  public writeAll(writer: IWriter, filePatterns: GenerateFilePatterns) {
    for (const submodule of this.serviceModules.values()) {
      writeSubmodule(writer, submodule, filePatterns);
    }
  }

  private addResourceToSubmodule(submodule: SubmoduleInfo, resource: Resource, props?: AddServiceProps) {
    const resourceClass = new ResourceClass(submodule.resourceModule, this.db, resource, {
      suffix: props?.nameSuffix,
      deprecated: props?.deprecated,
    });
    submodule.resources[resource.cloudFormationType] = resourceClass.spec.name;

    resourceClass.build();

    this.addImports(resourceClass);
    submodule.augmentationsModule.augmentResource(resource, resourceClass);
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
      sourceModule.importSelective(serviceModules.resourceModule, selectiveImport.types.map((t) => `${t.originalType} as ${t.aliasedType}`), {
        fromLocation: `${this.modulesRootLocation}/${sourceModule.name}`,
      });
    }
  }

  private createSubmodule(service: Service, targetServiceModule?: string, importLocations?: ModuleImportLocations): SubmoduleInfo {
    const moduleName = targetServiceModule ?? service.name;

    const mods = this.serviceModules.get(moduleName);
    if (mods) {
      // eslint-disable-next-line @cdklabs/no-throw-default-error
      throw new Error(`A submodule named ${moduleName} was already created`);
    }

    const resourceModule = new Module(`@aws-cdk/${moduleName}`);
    CDK_CORE.import(resourceModule, 'cdk', { fromLocation: importLocations?.core });
    CONSTRUCTS.import(resourceModule, 'constructs');
    CDK_CORE.helpers.import(resourceModule, 'cfn_parse', { fromLocation: importLocations?.coreHelpers });
    CDK_CORE.errors.import(resourceModule, 'cdk_errors', { fromLocation: importLocations?.coreErrors });

    const augmentationsModule = new AugmentationsModule(this.db, service.shortName, importLocations?.cloudwatch);
    const cannedMetricsModule = CannedMetricsModule.forService(this.db, service);

    const ret: SubmoduleInfo = {
      service,
      moduleName,
      resourceModule,
      augmentationsModule,
      cannedMetricsModule,
      resources: {},
    };
    this.serviceModules.set(moduleName, ret);
    return ret;
  }
}

export interface SubmoduleInfo {
  readonly service: Service;

  /**
   * The name of the submodule of aws-cdk-lib
   */
  readonly moduleName: string;

  readonly resourceModule: Module;
  readonly augmentationsModule: AugmentationsModule;
  readonly cannedMetricsModule: CannedMetricsModule;

  /**
   * Map of CloudFormation resource name to generated class name
   */
  readonly resources: Record<string, string>;
}

export function writeSubmodule(writer: IWriter, mods: SubmoduleInfo, filePatterns: GenerateFilePatterns) {
  const pattern: FilePatternValues = {
    serviceName: mods.service.name,
    serviceShortName: mods.service.shortName,
    moduleName: mods.moduleName,
  };

  writer.write(mods.resourceModule, substituteFilePattern(filePatterns.resources, pattern));

  if (mods.augmentationsModule.hasAugmentations) {
    writer.write(mods.augmentationsModule, substituteFilePattern(filePatterns.augmentations, pattern));
  }

  if (mods.cannedMetricsModule.hasCannedMetrics) {
    writer.write(mods.cannedMetricsModule, substituteFilePattern(filePatterns.cannedMetrics, pattern));
  }
}
