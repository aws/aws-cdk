import type { Resource, Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { naming, util } from '@aws-cdk/spec2cdk';
import { CDK_CORE, CONSTRUCTS } from '@aws-cdk/spec2cdk/lib/cdk/cdk';
import { ResourceDecider } from '@aws-cdk/spec2cdk/lib/cdk/resource-decider';
import { TypeConverter } from '@aws-cdk/spec2cdk/lib/cdk/type-converter';
import { RelationshipDecider } from '@aws-cdk/spec2cdk/lib/cdk/relationship-decider';
import type { Method } from '@cdklabs/typewriter';
import { ExternalModule, Module, ClassType, Stability, StructType, Type, expr, stmt, $T, ThingSymbol, $this, CallableProxy } from '@cdklabs/typewriter';
import { MIXINS_COMMON, MIXINS_UTILS } from './helpers';
import type { AddServiceProps, LibraryBuilderProps } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import { LibraryBuilder } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import type { LocatedModule, ServiceSubmoduleProps } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';
import { BaseServiceSubmodule } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';

class MixinsServiceModule extends BaseServiceSubmodule {
  public readonly constructLibModule: ExternalModule;

  public constructor(props: ServiceSubmoduleProps) {
    super(props);
    this.constructLibModule = new ExternalModule(`aws-cdk-lib/${props.submoduleName}`);
  }
}

export interface MixinsBuilderProps extends LibraryBuilderProps {
}

export class MixinsBuilder extends LibraryBuilder<MixinsServiceModule> {
  private readonly filePattern: string;

  public constructor(props: MixinsBuilderProps) {
    super(props);
    this.filePattern = '%moduleName%/cfn-props-mixins.generated.ts';
  }

  protected createServiceSubmodule(service: Service, submoduleName: string): MixinsServiceModule {
    return new MixinsServiceModule({
      submoduleName,
      service,
    });
  }

  protected addResourceToSubmodule(submodule: MixinsServiceModule, resource: Resource, _props?: AddServiceProps): void {
    const service = this.db.incoming('hasResource', resource).only().entity;
    const mixins = this.obtainMixinsModule(submodule, service);

    const l1PropsMixin = new L1PropsMixin(mixins.module, this.db, resource, submodule.constructLibModule);
    submodule.registerResource(resource.cloudFormationType, l1PropsMixin);

    l1PropsMixin.build();
  }

  private createMixinsModule(submodule: MixinsServiceModule, service: Service): LocatedModule<Module> {
    const module = new Module(`@aws-cdk/mixins-preview/${submodule.submoduleName}/mixins`);
    const filePath = this.pathFor(this.filePattern, submodule.submoduleName, service);

    submodule.registerModule({ module, filePath });

    CDK_CORE.import(module, 'cdk');
    CONSTRUCTS.import(module, 'constructs');
    MIXINS_COMMON.import(module, 'mixins', { fromLocation: '../../mixins' });
    MIXINS_UTILS.import(module, 'helpers', { fromLocation: '../../util/property-mixins' });
    submodule.constructLibModule.import(module, 'service');

    return { module, filePath };
  }

  private obtainMixinsModule(submodule: MixinsServiceModule, service: Service): LocatedModule<Module> {
    const mod = this.createMixinsModule(submodule, service);
    if (this.modules.has(mod.filePath)) {
      return {
        module: this.modules.get(mod.filePath)!,
        filePath: mod.filePath,
      };
    }

    return this.rememberModule(mod);
  }
}

class L1PropsMixin extends ClassType {
  public scope: Module;
  private readonly propsType: StructType;
  private readonly decider: ResourceDecider;
  private readonly relationshipDecider: RelationshipDecider;
  private readonly converter: TypeConverter;

  constructor(
    scope: Module,
    public readonly db: SpecDatabase,
    private readonly resource: Resource,
    private readonly constructLibModule: ExternalModule,
  ) {
    super(scope, {
      export: true,
      name: `${naming.classNameFromResource(resource)}PropsMixin`,
      implements: [CONSTRUCTS.IMixin],
      extends: CDK_CORE.Mixin,
      docs: {
        summary: `L1 property mixin for ${resource.cloudFormationType}`,
        ...util.splitDocumentation(resource.documentation),
        stability: Stability.External,
        docTags: {
          cloudformationResource: resource.cloudFormationType,
          mixin: 'true',
        },
        see: naming.cloudFormationDocLink({
          resourceType: resource.cloudFormationType,
        }),
      },
    });

    this.scope = scope;
    this.propsType = new StructType(this.scope, {
      export: true,
      name: `${naming.classNameFromResource(resource)}MixinProps`,
      docs: {
        summary: `Properties for ${this.name}`,
        stability: Stability.External,
        see: naming.cloudFormationDocLink({
          resourceType: this.resource.cloudFormationType,
        }),
      },
    });

    this.relationshipDecider = new RelationshipDecider(this.resource, db, {
      enableRelationships: false,
      enableNestedRelationships: false,
      refsImportLocation: 'aws-cdk-lib/interfaces',
    });
    this.converter = TypeConverter.forMixin({
      db: db,
      resource: this.resource,
      resourceClass: this,
      relationshipDecider: this.relationshipDecider,
    });
    this.decider = new ResourceDecider(this.resource, this.converter, this.relationshipDecider);
  }

  /**
   * Build the elements of the L1PropsMixin Class and types
   */
  public build() {
    // Build the props type with all properties optional
    for (const prop of this.decider.propsProperties) {
      if (prop.propertySpec.type.fqn) {
        continue;
      }
      this.propsType.addProperty({
        ...prop.propertySpec,
        optional: true,
      });
    }

    this.makeConstructor();
    const supports = this.makeSupportsMethod();
    this.makeApplyToMethod(supports);
  }

  private makeConstructor() {
    const optionsType = MIXINS_COMMON.CfnPropertyMixinOptions;

    this.addProperty({
      name: 'CFN_PROPERTY_KEYS',
      type: Type.arrayOf(Type.STRING),
      protected: true,
      immutable: true,
      static: true,
      initializer: expr.list(this.propsType.properties.map(p => expr.lit(p.name))),
    });

    this.addProperty({
      name: 'props',
      type: this.propsType.type,
      protected: true,
      immutable: true,
    });

    this.addProperty({
      name: 'strategy',
      type: MIXINS_COMMON.PropertyMergeStrategy,
      protected: true,
      immutable: true,
    });

    const init = this.addInitializer({
      docs: {
        summary: `Create a mixin to apply properties to \`${this.resource.cloudFormationType}\`.`,
      },
    });

    const props = init.addParameter({
      name: 'props',
      type: this.propsType.type,
      documentation: 'L1 properties to apply',
    });

    const options = init.addParameter({
      name: 'options',
      type: optionsType,
      optional: true,
      default: expr.object(),
      documentation: 'Mixin options',
    });

    init.addBody(
      expr.sym(new ThingSymbol('super', this.scope)).call(),
      stmt.assign($this.props, props),
      stmt.assign($this.strategy, expr.binOp(options?.prop('strategy'), '??', MIXINS_COMMON.PropertyMergeStrategy.MERGE)),
    );
  }

  private makeSupportsMethod(): Method {
    const resourceClassName = naming.classNameFromResource(this.resource);
    const resourceClass = Type.fromName(this.constructLibModule, resourceClassName);

    const method = this.addMethod({
      name: 'supports',
      returnType: Type.ambient(`construct is service.${resourceClass.symbol}`),
      docs: {
        summary: 'Check if this mixin supports the given construct',
      },
    });

    const construct = method.addParameter({
      name: 'construct',
      type: CONSTRUCTS.IConstruct,
    });

    method.addBody(
      stmt.ret(
        expr.binOp(
          CallableProxy.fromName('CfnResource.isCfnResource', CDK_CORE).invoke(construct),
          '&&',
          $T(resourceClass)[`is${resourceClassName}`](construct),
        ),
      ),
    );

    return method;
  }

  private makeApplyToMethod(supports: Method) {
    const method = this.addMethod({
      name: 'applyTo',
      returnType: Type.VOID,
      docs: {
        summary: 'Apply the mixin properties to the construct',
      },
    });

    const construct = method.addParameter({
      name: 'construct',
      type: CONSTRUCTS.IConstruct,
    });

    const CFN_PROPERTY_KEYS = $T(this.type).CFN_PROPERTY_KEYS;

    method.addBody(
      stmt
        .if_(CallableProxy.fromMethod(supports).invoke(construct))
        .then(
          stmt.block(
            stmt
              .if_(expr.eq($this.strategy, MIXINS_COMMON.PropertyMergeStrategy.MERGE))
              .then(
                stmt.block(
                  MIXINS_UTILS.deepMerge(construct, $this.props, CFN_PROPERTY_KEYS),
                ),
              )
              .else(
                stmt.block(
                  MIXINS_UTILS.shallowAssign(construct, $this.props, CFN_PROPERTY_KEYS),
                ),
              ),
          ),
        ),
    );
  }
}
