import type { Resource, SpecDatabase } from '@aws-cdk/service-spec-types';
import { naming, util } from '@aws-cdk/spec2cdk';
import type { AddServiceProps, AstBuilderProps, ImportPaths, ServiceSubmodule } from '@aws-cdk/spec2cdk/lib/cdk/ast';
import { AstBuilder } from '@aws-cdk/spec2cdk/lib/cdk/ast';
import { CDK_CORE, CONSTRUCTS } from '@aws-cdk/spec2cdk/lib/cdk/cdk';
import { ResourceDecider } from '@aws-cdk/spec2cdk/lib/cdk/resource-decider';
import { TypeConverter } from '@aws-cdk/spec2cdk/lib/cdk/type-converter';
import type { SelectiveImport } from '@aws-cdk/spec2cdk/lib/cdk/relationship-decider';
import { RelationshipDecider } from '@aws-cdk/spec2cdk/lib/cdk/relationship-decider';
import type { IScope, Method, Module } from '@cdklabs/typewriter';
import { ClassType, Stability, StructType, Type, expr, stmt, $E, $T, ThingSymbol } from '@cdklabs/typewriter';
import { MIXINS_COMMON, MIXINS_CORE, MIXINS_UTILS } from './helpers';

export class MixinAstBuilder extends AstBuilder {
  public constructor(props: AstBuilderProps) {
    super({
      ...props,
      extensions: {
        augmentations: false,
        cannedMetrics: false,
      },
    });
  }

  protected addImports(targetModule: Module, imports: ImportPaths) {
    CDK_CORE.import(targetModule, 'cdk', { fromLocation: imports.core });
    CONSTRUCTS.import(targetModule, 'constructs');
    MIXINS_CORE.import(targetModule, 'core', { fromLocation: '../../core' });
    MIXINS_COMMON.import(targetModule, 'mixins', { fromLocation: '../../mixins' });
    MIXINS_UTILS.import(targetModule, 'helpers', { fromLocation: '../../util/property-mixins' });
  }

  protected addResourceToSubmodule(submodule: ServiceSubmodule, resource: Resource, _props?: AddServiceProps) {
    const resourceModule = submodule.resourcesMod.module;

    const l1PropsMixin = new L1PropsMixin(resourceModule, this.db, resource);
    submodule.resources[resource.cloudFormationType] = l1PropsMixin.spec.name;

    l1PropsMixin.build();

    this.addSelectiveImports(submodule, l1PropsMixin.imports);
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
      // @todo can we make this a type guard?
      // returnType: Type.ambient(`construct is a ${this.cfnResourceName}`),
      returnType: Type.BOOLEAN,
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
