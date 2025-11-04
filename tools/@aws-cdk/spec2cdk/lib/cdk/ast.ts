import { SpecDatabase, Resource, Service } from '@aws-cdk/service-spec-types';
import { Module } from '@cdklabs/typewriter';
import { AugmentationsModule } from './augmentation-generator';
import { CannedMetricsModule } from './canned-metrics';
import { CDK_CORE, CONSTRUCTS, ModuleImportLocations } from './cdk';
import { GrantsModule } from './grants-module';
import { SelectiveImport } from './relationship-decider';
import { ResourceClass } from './resource-class';

/**
 * A module containing a single resource
 */
export class ResourceModule extends Module {
  public constructor(public readonly service: string, public readonly resource: string) {
    super(`@aws-cdk/${service}/${resource}-l1`);
  }
}

/**
 * A module containing a service
 */
export class ServiceModule extends Module {
  public constructor(public readonly service: string, public readonly shortName: string) {
    super(`@aws-cdk/${service}`);
  }
}

export interface AstBuilderProps {
  readonly db: SpecDatabase;
  /**
   * Override the locations modules are imported from
   */
  readonly importLocations?: ModuleImportLocations;

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

  readonly grantsConfig?: string;
}

export class AstBuilder<T extends Module> {
  /**
   * Build a module for all resources in a service
   */
  public static forService(service: Service, props: AstBuilderProps): AstBuilder<ServiceModule> {
    const scope = new ServiceModule(service.name, service.shortName);
    const aug = new AugmentationsModule(props.db, service.name, props.importLocations?.cloudwatch);
    const metrics = CannedMetricsModule.forService(props.db, service);
    const grants = GrantsModule.forServiceFromString(props.db, service, props.grantsConfig);

    const ast = new AstBuilder(scope, props, aug, metrics, grants);

    const resources = props.db.follow('hasResource', service);

    const arnContainers: Set<string> = new Set();
    for (const link of resources) {
      const resourceClass = ast.addResource(link.entity);
      if (resourceClass.methods.some(method => method.name === `arnFor${link.entity.name}`)) {
        arnContainers.add(link.entity.cloudFormationType);
      }
    }
    ast.renderImports();
    ast.buildGrants(arnContainers);
    return ast;
  }

  /**
   * Build an module for a single resource
   */
  public static forResource(resource: Resource, props: AstBuilderProps): AstBuilder<ResourceModule> {
    const parts = resource.cloudFormationType.toLowerCase().split('::');
    const scope = new ResourceModule(parts[1], parts[2]);
    const aug = new AugmentationsModule(props.db, parts[1], props.importLocations?.cloudwatch);
    const metrics = CannedMetricsModule.forResource(props.db, resource);

    const ast = new AstBuilder(scope, props, aug, metrics);
    ast.addResource(resource);
    ast.renderImports();

    return ast;
  }

  public readonly db: SpecDatabase;
  /**
   * Map of CloudFormation resource name to generated class name
   */
  public readonly resources: Record<string, string> = {};
  private nameSuffix?: string;
  private deprecated?: string;
  public readonly selectiveImports = new Array<SelectiveImport>();
  private readonly modulesRootLocation: string;

  protected constructor(
    public readonly module: T,
    props: AstBuilderProps,
    public readonly augmentations?: AugmentationsModule,
    public readonly cannedMetrics?: CannedMetricsModule,
    public readonly grants?: GrantsModule,
  ) {
    this.db = props.db;
    this.nameSuffix = props.nameSuffix;
    this.deprecated = props.deprecated;
    this.modulesRootLocation = props.importLocations?.modulesRoot ?? '../..';

    CDK_CORE.import(this.module, 'cdk', { fromLocation: props.importLocations?.core });
    CONSTRUCTS.import(this.module, 'constructs');
    CDK_CORE.helpers.import(this.module, 'cfn_parse', { fromLocation: props.importLocations?.coreHelpers });
    CDK_CORE.errors.import(this.module, 'cdk_errors', { fromLocation: props.importLocations?.coreErrors });
  }

  public addResource(resource: Resource) {
    const resourceClass = new ResourceClass(this.module, this.db, resource, {
      suffix: this.nameSuffix,
      deprecated: this.deprecated,
    });
    this.resources[resource.cloudFormationType] = resourceClass.spec.name;

    resourceClass.build();

    this.addImports(resourceClass);
    this.augmentations?.augmentResource(resource, resourceClass);

    return resourceClass;
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

  public renderImports() {
    const sortedImports = this.selectiveImports.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
    for (const selectiveImport of sortedImports) {
      const sourceModule = new Module(selectiveImport.moduleName);
      sourceModule.importSelective(this.module, selectiveImport.types.map((t) => `${t.originalType} as ${t.aliasedType}`), { fromLocation: `${this.modulesRootLocation}/${sourceModule.name}` });
    }
  }

  public buildGrants(arnContainers: Set<string>) {
    this.grants?.build(arnContainers);
  }
}
