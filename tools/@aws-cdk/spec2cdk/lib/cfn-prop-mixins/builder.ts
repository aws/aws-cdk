import type { Resource, Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import type { Expression, Method } from '@cdklabs/typewriter';
import { ExternalModule, FreeFunction, Module, ClassType, Stability, StructType, Type, expr, stmt, $T, ThingSymbol, $this, CallableProxy } from '@cdklabs/typewriter';
import { CDK_CORE, CONSTRUCTS } from '../cdk/cdk';
import type { AddServiceProps, LibraryBuilderProps } from '../cdk/library-builder';
import { LibraryBuilder } from '../cdk/library-builder';
import { RelationshipDecider } from '../cdk/relationship-decider';
import { ResolverBuilder } from '../cdk/resolver-builder';
import { ResourceDecider } from '../cdk/resource-decider';
import type { LocatedModule, ServiceSubmoduleProps } from '../cdk/service-submodule';
import { BaseServiceSubmodule } from '../cdk/service-submodule';
import { TypeConverter } from '../cdk/type-converter';
import { naming, util } from '../index';
import { MIXINS_COMMON } from './helpers';

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
      enableRelationships: true,
      enableNestedRelationships: true,
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
    const resolverBuilder = new ResolverBuilder(this.converter, this.relationshipDecider, this.scope);

    // Build the props type with all properties optional
    let needsFlatten = false;
    const flattenResolvers: Array<{ name: string; resolver: (props: Expression) => Expression }> = [];
    for (const prop of this.decider.propsProperties) {
      this.propsType.addProperty({
        ...prop.propertySpec,
        optional: true,
      });

      const specProp = this.resource.properties[prop.cfnMapping.cfnName];
      // Mark as required so buildResolver skips the inline undefined guard;
      // the top-level flatten function already has an if-guard for each property.
      const result = resolverBuilder.buildResolver({ ...specProp, required: true }, prop.cfnMapping.cfnName);
      const hasRelationships = specProp.relationshipRefs && specProp.relationshipRefs.length > 0;
      const hasNestedFlatten = this.relationshipDecider.needsFlatteningFunction(prop.cfnMapping.cfnName, specProp);
      if (hasRelationships || hasNestedFlatten) {
        needsFlatten = true;
        flattenResolvers.push({
          name: result.name,
          // The outer if-guard in the flatten function body already ensures the value is defined,
          // so no additional undefined check is needed here.
          resolver: result.resolver,
        });
      }
    }

    // Generate a top-level flatten function if any props need resolving
    let flattenFunction: FreeFunction | undefined;
    if (needsFlatten) {
      flattenFunction = new FreeFunction(this.scope, {
        name: naming.flattenFunctionNameFromType(this.propsType),
        returnType: this.propsType.type,
        parameters: [{ name: 'props', type: this.propsType.type }],
      });
      const fnProps = flattenFunction.parameters[0];
      const ret = expr.ident('ret');
      flattenFunction.addBody(
        stmt.constVar(expr.directCode('ret: any'), expr.object()),
        ...flattenResolvers.map(r =>
          stmt.if_(expr.binOp(expr.get(fnProps, r.name), '!==', expr.UNDEFINED))
            .then(stmt.assign(expr.get(ret, r.name), r.resolver(fnProps))),
        ),
        stmt.ret(ret),
      );
    }

    this.makeConstructor(flattenFunction);
    const supports = this.makeSupportsMethod();
    this.makeApplyToMethod(supports);
  }

  private makeConstructor(flattenFunction?: FreeFunction) {
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
      type: CDK_CORE.IMergeStrategy,
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
      stmt.assign($this.props, flattenFunction
        ? expr.object(expr.splat(props), expr.splat(CallableProxy.fromName(flattenFunction.name, this.scope).invoke(props)))
        : props),
      stmt.assign($this.strategy, expr.binOp(options?.prop('strategy'), '??', CDK_CORE.PropertyMergeStrategy.combine())),
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
            $this.strategy.callMethod('apply', construct, $this.props, CFN_PROPERTY_KEYS),
          ),
        ),
    );
  }
}
