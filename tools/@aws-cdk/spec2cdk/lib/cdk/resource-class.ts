import { PropertyType, Resource, SpecDatabase } from '@aws-cdk/service-spec-types';
import {
  $E,
  $T,
  Block,
  ClassType,
  code,
  expr,
  MemberVisibility,
  IScope,
  stmt,
  StructType,
  SuperInitializer,
  TruthyOr,
  Type,
  Initializer,
  IsNotNullish,
  AnonymousInterfaceImplementation,
  Lambda,
  Stability,
  ObjectLiteral,
  Module,
} from '@cdklabs/typewriter';
import { CDK_CORE, CONSTRUCTS } from './cdk';
import { CloudFormationMapping } from './cloudformation-mapping';
import { ResourceDecider } from './resource-decider';
import { TypeConverter } from './type-converter';
import {
  classNameFromResource,
  cloudFormationDocLink,
  cfnParserNameFromType,
  staticResourceTypeName,
  cfnProducerNameFromType,
  propStructNameFromResource,
  staticRequiredTransform,
} from '../naming';
import { splitDocumentation } from '../util';

export interface ITypeHost {
  typeFromSpecType(type: PropertyType): Type;
}

// This convenience typewriter builder is used all over the place
const $this = $E(expr.this_());

export class ResourceClass extends ClassType {
  private readonly propsType: StructType;
  private readonly decider: ResourceDecider;
  private readonly converter: TypeConverter;
  private readonly module: Module;

  constructor(
    scope: IScope,
    private readonly db: SpecDatabase,
    private readonly resource: Resource,
    private readonly suffix?: string,
  ) {
    super(scope, {
      export: true,
      name: classNameFromResource(resource, suffix),
      docs: {
        ...splitDocumentation(resource.documentation),
        stability: Stability.External,
        docTags: { cloudformationResource: resource.cloudFormationType },
        see: cloudFormationDocLink({
          resourceType: resource.cloudFormationType,
        }),
      },
      extends: CDK_CORE.CfnResource,
      implements: [CDK_CORE.IInspectable, ...ResourceDecider.taggabilityInterfaces(resource)],
    });

    this.module = Module.of(this);

    this.propsType = new StructType(this.scope, {
      export: true,
      name: propStructNameFromResource(this.resource, this.suffix),
      docs: {
        summary: `Properties for defining a \`${classNameFromResource(this.resource)}\``,
        stability: Stability.External,
        see: cloudFormationDocLink({
          resourceType: this.resource.cloudFormationType,
        }),
      },
    });

    this.converter = TypeConverter.forResource({
      db: db,
      resource: this.resource,
      resourceClass: this,
    });

    this.decider = new ResourceDecider(this.resource, this.converter);
  }

  /**
   * Build the elements of the Resource Class and the props type
   */
  public build() {
    // Build the props type
    const cfnMapping = new CloudFormationMapping(this.module, this.converter);

    for (const prop of this.decider.propsProperties) {
      this.propsType.addProperty(prop.propertySpec);
      cfnMapping.add(prop.cfnMapping);
    }

    // Build the members of this class
    this.addProperty({
      name: staticResourceTypeName(),
      immutable: true,
      static: true,
      type: Type.STRING,
      initializer: expr.lit(this.resource.cloudFormationType),
      docs: {
        summary: 'The CloudFormation resource type name for this resource class.',
      },
    });

    this.makeFromCloudFormationFactory();

    if (this.resource.cloudFormationTransform) {
      this.addProperty({
        name: staticRequiredTransform(),
        immutable: true,
        static: true,
        type: Type.STRING,
        initializer: expr.lit(this.resource.cloudFormationTransform),
        docs: {
          summary: 'The `Transform` a template must use in order to use this resource',
        },
      });
    }

    for (const prop of this.decider.classAttributeProperties) {
      this.addProperty(prop.propertySpec);
    }

    for (const prop of this.decider.classProperties) {
      this.addProperty(prop.propertySpec);
    }

    // Copy properties onto class and props type
    this.makeConstructor();
    this.makeInspectMethod();
    this.makeCfnProperties();
    this.makeRenderProperties();

    // Make converter functions for the props type
    cfnMapping.makeCfnProducer(this.module, this.propsType);
    cfnMapping.makeCfnParser(this.module, this.propsType);

    this.makeMustRenderStructs();
  }

  private makeFromCloudFormationFactory() {
    const factory = this.addMethod({
      name: '_fromCloudFormation',
      static: true,
      returnType: this.type,
      docs: {
        summary: `Build a ${this.name} from CloudFormation properties`,
        remarks: [
          'A factory method that creates a new instance of this class from an object',
          'containing the CloudFormation properties of this resource.',
          'Used in the @aws-cdk/cloudformation-include module.',
          '',
          '@internal',
        ].join('\n'),
      },
    });

    const scope = factory.addParameter({ name: 'scope', type: CONSTRUCTS.Construct });
    const id = factory.addParameter({ name: 'id', type: Type.STRING });
    const resourceAttributes = $E(factory.addParameter({ name: 'resourceAttributes', type: Type.ANY }));
    const options = $E(
      factory.addParameter({
        name: 'options',
        type: CDK_CORE.helpers.FromCloudFormationOptions,
      }),
    );

    const resourceProperties = expr.ident('resourceProperties');
    const propsResult = $E(expr.ident('propsResult'));
    const ret = $E(expr.ident('ret'));

    const reverseMapper = expr.ident(cfnParserNameFromType(this.propsType));

    factory.addBody(
      stmt.assign(resourceAttributes, new TruthyOr(resourceAttributes, expr.lit({}))),
      stmt.constVar(resourceProperties, options.parser.parseValue(resourceAttributes.Properties)),
      stmt.constVar(propsResult, reverseMapper.call(resourceProperties)),
      stmt
        .if_(CDK_CORE.isResolvableObject(propsResult.value))
        .then(stmt.block(stmt.throw_(Type.ambient('Error').newInstance(expr.lit('Unexpected IResolvable'))))),
      stmt.constVar(ret, this.newInstance(scope, id, propsResult.value)),
    );

    const propKey = expr.ident('propKey');
    const propVal = expr.ident('propVal');
    factory.addBody(
      stmt
        .forConst(expr.destructuringArray(propKey, propVal))
        .in(expr.builtInFn('Object.entries', propsResult.extraProperties))
        .do(Block.with(stmt.expr(ret.addPropertyOverride(propKey, propVal)))),

      options.parser.handleAttributes(ret, resourceAttributes, id),
      stmt.ret(ret),
    );
  }

  private makeConstructor() {
    // Ctor
    const init = this.addInitializer({
      docs: {
        summary: `Create a new \`${this.resource.cloudFormationType}\`.`,
      },
    });
    const _scope = init.addParameter({
      name: 'scope',
      type: CONSTRUCTS.Construct,
      documentation: 'Scope in which this resource is defined',
    });
    const id = init.addParameter({
      name: 'id',
      type: Type.STRING,
      documentation: 'Construct identifier for this resource (unique in its scope)',
    });

    const hasRequiredProps = this.propsType.properties.some((p) => !p.optional);
    const props = init.addParameter({
      name: 'props',
      type: this.propsType.type,
      documentation: 'Resource properties',
      default: hasRequiredProps ? undefined : new ObjectLiteral([]),
    });

    init.addBody(
      new SuperInitializer(
        _scope,
        id,
        expr.object({
          type: $T(this.type)[staticResourceTypeName()],
          properties: props,
        }),
      ),

      stmt.sep(),

      // Validate required properties
      ...this.decider.propsProperties
        .filter(({ validateRequiredInConstructor }) => validateRequiredInConstructor)
        .map(({ propertySpec: { name } }) => CDK_CORE.requireProperty(props, expr.lit(name), $this)),

      stmt.sep(),
    );

    if (this.resource.cloudFormationTransform) {
      init.addBody(
        code.comment('Automatically add the required transform'),
        $this.stack.addTransform($T(this.type)[staticRequiredTransform()]),
        stmt.sep(),
      );
    }

    init.addBody(
      // Attributes
      ...this.decider.classAttributeProperties.map(({ propertySpec: { name }, initializer }) =>
        stmt.assign($this[name], initializer),
      ),

      // Props
      ...this.decider.classProperties.map(({ propertySpec: { name }, initializer }) =>
        stmt.assign($this[name], initializer(props)),
      ),
    );

    if (this.resource.isStateful) {
      this.addDeletionPolicyCheck(init);
    }
  }

  private makeInspectMethod() {
    const inspect = this.addMethod({
      name: 'inspect',
      docs: {
        summary: 'Examines the CloudFormation resource and discloses attributes',
      },
    });
    const $inspector = $E(
      inspect.addParameter({
        name: 'inspector',
        type: CDK_CORE.TreeInspector,
        documentation: 'tree inspector to collect and process attributes',
      }),
    );
    inspect.addBody(
      $inspector.addAttribute(
        expr.lit('aws:cdk:cloudformation:type'),
        $E(expr.sym(this.symbol))[staticResourceTypeName()],
      ),
      $inspector.addAttribute(expr.lit('aws:cdk:cloudformation:props'), $E(expr.this_()).cfnProperties),
    );
  }

  /**
   * Make the cfnProperties getter
   *
   * This produces a set of properties that are going to be passed into renderProperties().
   */
  private makeCfnProperties() {
    this.addProperty({
      name: 'cfnProperties',
      type: Type.mapOf(Type.ANY),
      protected: true,
      getterBody: Block.with(
        stmt.ret(
          expr.object(
            Object.fromEntries(
              this.decider.classProperties.flatMap(({ cfnValueToRender }) => Object.entries(cfnValueToRender)),
            ),
          ),
        ),
      ),
    });
  }

  /**
   * Make the renderProperties() method
   *
   * This forwards straight to the props type mapper
   */
  private makeRenderProperties() {
    const m = this.addMethod({
      name: 'renderProperties',
      returnType: Type.mapOf(Type.ANY),
      visibility: MemberVisibility.Protected,
    });
    const props = m.addParameter({
      name: 'props',
      type: Type.mapOf(Type.ANY),
    });
    m.addBody(stmt.ret($E(expr.ident(cfnProducerNameFromType(this.propsType)))(props)));
  }

  /**
   * Add a validation to ensure that this resource has a deletionPolicy
   *
   * A deletionPolicy is required (and in normal operation an UpdateReplacePolicy
   * would also be set if a user doesn't do complicated shenanigans, in which case they probably know what
   * they're doing.
   *
   * Only do this for L1s embedded in L2s (to force L2 authors to add a way to set this policy). If we did it for all L1s:
   *
   * - users working at the L1 level would start getting synthesis failures when we add this feature
   * - the `cloudformation-include` library that loads CFN templates to L1s would start failing when it loads
   *   templates that don't have DeletionPolicy set.
   */
  private addDeletionPolicyCheck(init: Initializer) {
    const validator = new AnonymousInterfaceImplementation({
      validate: new Lambda(
        [],
        expr.cond(
          expr.eq($this.cfnOptions.deletionPolicy, expr.UNDEFINED),
          expr.lit([
            `'${this.resource.cloudFormationType}' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'.`,
          ]),
          expr.lit([]),
        ),
      ),
    });

    init.addBody(
      stmt
        .if_(expr.binOp(new IsNotNullish($this.node.scope), '&&', CDK_CORE.Resource.isResource($this.node.scope)))
        .then(Block.with($this.node.addValidation(validator))),
    );
  }

  /**
   * Render the structs that are unused, but have to exist for backwards compatibility reasons
   */
  private makeMustRenderStructs() {
    for (const typeDef of this.db
      .follow('usesType', this.resource)
      .map((t) => t.entity)
      .filter((t) => t.mustRenderForBwCompat)) {
      this.converter.convertTypeDefinitionType(typeDef);
    }
  }
}
