import type { Resource, Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { naming, util } from '@aws-cdk/spec2cdk';
import { CDK_CORE, CONSTRUCTS } from '@aws-cdk/spec2cdk/lib/cdk/cdk';
import { ResourceDecider } from '@aws-cdk/spec2cdk/lib/cdk/resource-decider';
import { TypeConverter } from '@aws-cdk/spec2cdk/lib/cdk/type-converter';
import { RelationshipDecider } from '@aws-cdk/spec2cdk/lib/cdk/relationship-decider';
import type { IScope, Method } from '@cdklabs/typewriter';
import { Module, ClassType, Stability, StructType, Type, expr, stmt, $E, $T, ThingSymbol } from '@cdklabs/typewriter';
import { MIXINS_COMMON, MIXINS_CORE, MIXINS_UTILS } from './helpers';
import type { AddServiceProps, LibraryBuilderProps } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import { LibraryBuilder } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import type { LocatedModule, SelectiveImport } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';
import { BaseServiceSubmodule, relativeImportPath } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';

export interface MixinsBuilderProps extends LibraryBuilderProps {
  filePattern?: string;
}

export class MixinsBuilder extends LibraryBuilder<BaseServiceSubmodule> {
  private readonly filePattern: string;

  public constructor(props: MixinsBuilderProps) {
    super(props);
    this.filePattern = props.filePattern ?? '%moduleName%/%serviceShortName%.generated.ts';
  }

  protected createServiceSubmodule(service: Service, submoduleName: string): BaseServiceSubmodule {
    return new BaseServiceSubmodule({
      submoduleName,
      service,
    });
  }

  protected addResourceToSubmodule(submodule: BaseServiceSubmodule, resource: Resource, _props?: AddServiceProps): void {
    const service = this.db.incoming('hasResource', resource).only().entity;
    const mixins = this.obtainMixinsModule(submodule.submoduleName, service);

    const l1PropsMixin = new L1PropsMixin(mixins.module, this.db, resource);
    submodule.registerResource(resource.cloudFormationType, l1PropsMixin);

    l1PropsMixin.build();

    submodule.registerSelectiveImports(...l1PropsMixin.imports);
  }

  private createMixinsModule(moduleName: string, service: Service): LocatedModule<Module> {
    const module = new Module(`@aws-cdk/mixins-preview/${moduleName}/mixins`);
    const filePath = this.pathFor(this.filePattern, moduleName, service);

    CDK_CORE.import(module, 'cdk');
    CONSTRUCTS.import(module, 'constructs');
    MIXINS_CORE.import(module, 'core', { fromLocation: relativeImportPath(filePath, '../core') });
    MIXINS_COMMON.import(module, 'mixins', { fromLocation: '../../mixins' });
    MIXINS_UTILS.import(module, 'helpers', { fromLocation: '../../util/property-mixins' });

    return { module, filePath };
  }

  private obtainMixinsModule(moduleName: string, service: Service): LocatedModule<Module> {
    const mod = this.createMixinsModule(moduleName, service);
    if (this.modules.has(mod.filePath)) {
      return {
        module: this.modules.get(mod.filePath)!,
        filePath: mod.filePath,
      };
    }

    return this.rememberModule(mod);
  }
}

interface L1PropsMixinProps {
  readonly deprecated?: string;
}

class L1PropsMixin extends ClassType {
  private readonly propsType: StructType;
  private readonly decider: ResourceDecider;
  private readonly relationshipDecider: RelationshipDecider;
  private readonly converter: TypeConverter;
  public readonly imports = new Array<SelectiveImport>();

  constructor(
    scope: IScope,
    public readonly db: SpecDatabase,
    private readonly resource: Resource,
    public readonly props: L1PropsMixinProps = {},
  ) {
    super(scope, {
      export: true,
      name: `${naming.classNameFromResource(resource)}Mixin`,
      implements: [MIXINS_CORE.IMixin],
      extends: MIXINS_CORE.Mixin,
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
        ...util.maybeDeprecated(props.deprecated),
      },
    });

    this.propsType = new StructType(this.scope, {
      export: true,
      name: `${naming.classNameFromResource(resource)}MixinProps`,
      docs: {
        summary: `Properties for ${this.name}`,
        stability: Stability.External,
        see: naming.cloudFormationDocLink({
          resourceType: this.resource.cloudFormationType,
        }),
        ...util.maybeDeprecated(props.deprecated),
      },
    });

    this.relationshipDecider = new RelationshipDecider(this.resource, db);
    this.converter = TypeConverter.forMixin({
      db: db,
      resource: this.resource,
      resourceClass: this,
      relationshipDecider: this.relationshipDecider,
    });
    this.imports = this.relationshipDecider.imports;
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

    const $this = $E(expr.this_());
    init.addBody(
      expr.sym(new ThingSymbol('super', this.scope)).call(),
      stmt.assign($this.props, props),
      stmt.assign($this.strategy, expr.binOp(options?.prop('strategy'), '??', MIXINS_COMMON.PropertyMergeStrategy.MERGE)),
    );
  }

  private makeSupportsMethod(): Method {
    const method = this.addMethod({
      name: 'supports',
      returnType: Type.ambient(`construct is ${naming.classNameFromResource(this.resource)}`),
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
          $E(expr.sym(CDK_CORE.CfnResource.symbol!)).isCfnResource(construct),
          '&&',
          expr.eq($E(construct).cfnResourceType, expr.lit(this.resource.cloudFormationType)),
        ),
      ),
    );

    return method;
  }

  private makeApplyToMethod(supports: Method) {
    const method = this.addMethod({
      name: 'applyTo',
      returnType: CONSTRUCTS.IConstruct,
      docs: {
        summary: 'Apply the mixin properties to the construct',
      },
    });

    const construct = method.addParameter({
      name: 'construct',
      type: CONSTRUCTS.IConstruct,
    });

    const $this = $E(expr.this_());
    const CFN_PROPERTY_KEYS = $T(this.type).CFN_PROPERTY_KEYS;

    method.addBody(
      stmt
        .if_($this[supports.name](construct))
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
      stmt.ret(construct),
    );
  }
}
