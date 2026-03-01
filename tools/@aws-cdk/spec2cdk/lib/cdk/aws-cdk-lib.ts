import type { Resource, Service } from '@aws-cdk/service-spec-types';
import { Module, stmt } from '@cdklabs/typewriter';
import { AugmentationsModule } from './augmentation-generator';
import { CannedMetricsModule } from './canned-metrics';
import { CDK_CORE, CDK_INTERFACES_ENVIRONMENT_AWARE, CONSTRUCTS } from './cdk';
import type { AddServiceProps, LibraryBuilderProps } from './library-builder';
import { LibraryBuilder } from './library-builder';
import { ResourceClass } from './resource-class';
import type { LocatedModule } from './service-submodule';
import { BaseServiceSubmodule, relativeImportPath } from './service-submodule';
import { submoduleSymbolFromName } from '../naming';
import { GrantsModule } from './grants-module';

class AwsCdkLibServiceSubmodule extends BaseServiceSubmodule {
  public readonly resourcesMod: LocatedModule<Module>;
  public readonly augmentations: LocatedModule<AugmentationsModule>;
  public readonly cannedMetrics: LocatedModule<CannedMetricsModule>;
  public readonly interfaces: LocatedModule<Module>;
  public readonly grants?: LocatedModule<GrantsModule>;
  public readonly didCreateInterfaceModule: boolean;
  public readonly resources: Map<string, ResourceClass> = new Map();

  public constructor(props: {
    readonly submoduleName: string;
    readonly service: Service;
    readonly resourcesMod: LocatedModule<Module>;
    readonly augmentations: LocatedModule<AugmentationsModule>;
    readonly cannedMetrics: LocatedModule<CannedMetricsModule>;
    readonly interfaces: LocatedModule<Module>;
    readonly grants?: LocatedModule<GrantsModule>;
    readonly didCreateInterfaceModule: boolean;
  }) {
    super(props);
    this.resourcesMod = props.resourcesMod;
    this.augmentations = props.augmentations;
    this.cannedMetrics = props.cannedMetrics;
    this.interfaces = props.interfaces;
    this.didCreateInterfaceModule = props.didCreateInterfaceModule;
    this.grants = props.grants;

    this.registerModule(this.resourcesMod);
    this.registerModule(this.cannedMetrics);
    this.registerModule(this.augmentations);
    this.registerModule(this.interfaces);

    if (this.grants) {
      this.registerModule(this.grants);
    }
  }
}

export interface GrantsProps {
  /**
   * The JSON string to configure the grants for the service
   */
  config: string;

  /**
   * Whether the generated grants should be considered as stable or experimental.
   * This has implications on where the generated file is placed.
   */
  isStable: boolean;
}

export interface AwsCdkLibFilePatterns {
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

  /**
   * The pattern used to name the grants module
   */
  readonly grants: string;
}

export interface AwsCdkLibBuilderProps extends LibraryBuilderProps{
  /**
   * The file patterns used to generate the files.
   *
   * @default - default patterns
   */
  readonly filePatterns?: Partial<AwsCdkLibFilePatterns>;

  /**
   * Whether we are generating code INSIDE `aws-cdk-lib` or outside it
   *
   * This affects the generated import paths.
   */
  readonly inCdkLib?: boolean;
}

export const DEFAULT_FILE_PATTERNS: AwsCdkLibFilePatterns = {
  resources: '%moduleName%/%serviceShortName%.generated.ts',
  augmentations: '%moduleName%/%serviceShortName%-augmentations.generated.ts',
  cannedMetrics: '%moduleName%/%serviceShortName%-canned-metrics.generated.ts',
  interfacesEntry: 'interfaces/index.generated.ts',
  interfaces: 'interfaces/generated/%serviceName%-interfaces.generated.ts',
  grants: '%moduleName%/%serviceShortName%-grants.generated.ts',
};

/**
 * The library builder for `aws-cdk-lib`.
 *
 * Contains the spec
 */
export class AwsCdkLibBuilder extends LibraryBuilder<AwsCdkLibServiceSubmodule> {
  private readonly inCdkLib: boolean;
  private readonly filePatterns: AwsCdkLibFilePatterns;
  private readonly interfacesEntry: LocatedModule<Module>;

  public constructor(props: AwsCdkLibBuilderProps) {
    super(props);
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

  protected createServiceSubmodule(service: Service, submoduleName: string, grantsProps?: GrantsProps): AwsCdkLibServiceSubmodule {
    const resourcesMod = this.rememberModule(this.createResourceModule(submoduleName, service));
    const augmentations = this.rememberModule(this.createAugmentationsModule(submoduleName, service));
    const cannedMetrics = this.rememberModule(this.createCannedMetricsModule(submoduleName, service));
    const [interfaces, didCreateInterfaceModule] = this.obtainInterfaceModule(service);

    const grants = grantsProps != null
      ? this.rememberModule(this.createGrantsModule(submoduleName, service, grantsProps))
      : undefined;

    const createdSubmod: AwsCdkLibServiceSubmodule = new AwsCdkLibServiceSubmodule({
      submoduleName,
      service,
      resourcesMod,
      augmentations,
      cannedMetrics,
      interfaces,
      didCreateInterfaceModule,
      grants,
    });

    return createdSubmod;
  }

  private createGrantsModule(moduleName: string, service: Service, grantsProps: GrantsProps): LocatedModule<GrantsModule> {
    const filePath = this.pathsFor(moduleName, service).grants;
    const imports = this.resolveImportPaths(filePath);
    return {
      module: new GrantsModule(service, this.db, JSON.parse(grantsProps.config), imports.iam, grantsProps.isStable),
      filePath,
    };
  }

  protected addResourceToSubmodule(submodule: AwsCdkLibServiceSubmodule, resource: Resource, props?: AddServiceProps): void {
    const resourceModule = submodule.resourcesMod.module;

    const resourceClass = new ResourceClass(resourceModule, this.db, resource, {
      suffix: props?.nameSuffix,
      deprecated: props?.deprecated,
      importPaths: this.resolveImportPaths(submodule.resourcesMod.filePath),
      interfacesModule: {
        module: submodule.interfaces.module,
        importLocation: relativeImportPath(submodule.resourcesMod, submodule.interfaces),
      },
    });

    resourceClass.build();

    submodule.registerResource(resource.cloudFormationType, resourceClass);
    submodule.augmentations?.module.augmentResource(resource, resourceClass);
  }

  private createResourceModule(moduleName: string, service: Service): LocatedModule<Module> {
    const filePath = this.pathsFor(moduleName, service).resources;
    const imports = this.resolveImportPaths(filePath);

    const module = new Module(`@aws-cdk/${moduleName}/${service.name}`);

    CDK_CORE.import(module, 'cdk', { fromLocation: imports.core });
    CONSTRUCTS.import(module, 'constructs');
    CDK_CORE.helpers.import(module, 'cfn_parse', { fromLocation: imports.coreHelpers });
    CDK_CORE.errors.import(module, 'cdk_errors', { fromLocation: imports.coreErrors });

    return { module, filePath };
  }

  private createAugmentationsModule(moduleName: string, service: Service): LocatedModule<AugmentationsModule> {
    const filePath = this.pathsFor(moduleName, service).augmentations;
    const imports = this.resolveImportPaths(filePath);
    return {
      module: new AugmentationsModule(this.db, service.shortName, imports.cloudwatch),
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

  /**
   * Do whatever we need to do after a service has been rendered to a submodule
   *
   * (Mostly: create additional files that import generated files)
   */
  protected postprocessSubmodule(submodule: AwsCdkLibServiceSubmodule, props?: AddServiceProps) {
    const grantModule = submodule.locatedModules
      .map(lm => lm.module)
      .find(m => m instanceof GrantsModule);

    if (grantModule != null) {
      grantModule.build(Object.fromEntries(submodule.resources), props?.nameSuffix);
    }

    // Add an import for the interfaces file to the entry point file (make sure not to do it twice)
    if (!submodule.interfaces.module.isEmpty() && this.interfacesEntry && submodule.didCreateInterfaceModule) {
      const exportName = submoduleSymbolFromName(submodule.service.name);
      const importLocation = relativeImportPath(this.interfacesEntry, submodule.interfaces);

      this.interfacesEntry.module.addInitialization(stmt.directCode(
        `export * as ${exportName} from '${importLocation}'`,
      ));
    }
  }

  private resolveImportPaths(sourceModule: string): ImportPaths {
    if (!this.inCdkLib) {
      return {
        core: 'aws-cdk-lib/core',
        interfaces: 'aws-cdk-lib/interfaces',
        interfacesEnvironmentAware: 'aws-cdk-lib/interfaces/environment-aware',
        coreHelpers: 'aws-cdk-lib/core/lib/helpers-internal',
        coreErrors: 'aws-cdk-lib/core/lib/errors',
        cloudwatch: 'aws-cdk-lib/aws-cloudwatch',
        iam: 'aws-cdk-lib/aws-iam',
      };
    }

    return {
      core: relativeImportPath(sourceModule, 'core/lib'),
      interfaces: relativeImportPath(sourceModule, 'interfaces'),
      interfacesEnvironmentAware: relativeImportPath(sourceModule, 'interfaces/environment-aware'),
      coreHelpers: relativeImportPath(sourceModule, 'core/lib/helpers-internal'),
      coreErrors: relativeImportPath(sourceModule, 'core/lib/errors'),
      cloudwatch: relativeImportPath(sourceModule, 'aws-cloudwatch'),
      iam: relativeImportPath(sourceModule, 'aws-iam'),
    };
  }

  private pathsFor(submoduleName: string, service: Service): Record<keyof AwsCdkLibFilePatterns, string> {
    return Object.fromEntries(Object.entries(this.filePatterns)
      .map(([name, pattern]) => [name, this.pathFor(pattern, submoduleName, service)] as const)) as any;
  }
}

function noUndefined<A extends object>(x: A | undefined): A | undefined {
  if (!x) {
    return undefined;
  }
  return Object.fromEntries(Object.entries(x).filter(([, v]) => v !== undefined)) as any;
}

export interface ImportPaths {
  /**
   * The import name used import the core module
   */
  readonly core: string;

  /**
   * The import name used import the `interfaces` module
   */
  readonly interfaces: string;

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

  /**
   * The import name used to import the IAM module
   */
  readonly iam: string;
}
