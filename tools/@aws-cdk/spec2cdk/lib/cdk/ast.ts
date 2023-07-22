import { SpecDatabase, Resource, Service } from '@aws-cdk/service-spec-types';
import { Module } from '@cdklabs/typewriter';
import { AugmentationsModule } from './augmentation-generator';
import { CannedMetricsModule } from './canned-metrics';
import { CDK_CORE, CONSTRUCTS, ModuleImportLocations } from './cdk';
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
}

export class AstBuilder<T extends Module> {
  /**
   * Build a module for all resources in a service
   */
  public static forService(service: Service, props: AstBuilderProps): AstBuilder<ServiceModule> {
    const scope = new ServiceModule(service.name, service.shortName);
    const aug = new AugmentationsModule(props.db, service.name, props.importLocations?.cloudwatch);
    const metrics = CannedMetricsModule.forService(props.db, service);

    const ast = new AstBuilder(scope, props, aug, metrics);

    const resources = props.db.follow('hasResource', service);

    for (const link of resources) {
      ast.addResource(link.entity);
    }

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

    return ast;
  }

  public readonly db: SpecDatabase;
  /**
   * Map of CloudFormation resource name to generated class name
   */
  public readonly resources: Record<string, string> = {};
  private nameSuffix?: string;

  protected constructor(
    public readonly module: T,
    props: AstBuilderProps,
    public readonly augmentations?: AugmentationsModule,
    public readonly cannedMetrics?: CannedMetricsModule,
  ) {
    this.db = props.db;
    this.nameSuffix = props.nameSuffix;

    CDK_CORE.import(this.module, 'cdk', { fromLocation: props.importLocations?.core });
    CONSTRUCTS.import(this.module, 'constructs');
    CDK_CORE.helpers.import(this.module, 'cfn_parse', { fromLocation: props.importLocations?.coreHelpers });
  }

  public addResource(resource: Resource) {
    const resourceClass = new ResourceClass(this.module, this.db, resource, this.nameSuffix);
    this.resources[resource.cloudFormationType] = resourceClass.spec.name;

    resourceClass.build();

    this.augmentations?.augmentResource(resource, resourceClass);
  }
}
