import { PropertyType, Resource, SpecDatabase } from '@aws-cdk/service-spec-types';
import {
  $E,
  $T,
  AnonymousInterfaceImplementation,
  Block,
  ClassType,
  code,
  DummyScope,
  expr, Expression,
  Initializer,
  InterfaceType,
  IScope,
  IsNotNullish,
  Lambda,
  MemberVisibility,
  Module,
  ObjectLiteral,
  Stability, Statement,
  stmt,
  StructType,
  SuperInitializer,
  ThingSymbol,
  TruthyOr,
  Type,
  TypeDeclarationStatement,
  DocsSpec,
} from '@cdklabs/typewriter';
import { CDK_CORE, CONSTRUCTS } from './cdk';
import { CloudFormationMapping } from './cloudformation-mapping';
import { ResourceDecider, shouldBuildReferenceInterface } from './resource-decider';
import { TypeConverter } from './type-converter';
import {
  cfnParserNameFromType,
  cfnProducerNameFromType,
  classNameFromResource,
  cloudFormationDocLink, propertyNameFromCloudFormation,
  propStructNameFromResource, referencePropertyName,
  staticRequiredTransform,
  staticResourceTypeName,
} from '../naming';
import { splitDocumentation } from '../util';

export interface ITypeHost {
  typeFromSpecType(type: PropertyType): Type;
}

// This convenience typewriter builder is used all over the place
const $this = $E(expr.this_());

export interface ResourceClassProps {
  readonly suffix?: string;
  readonly deprecated?: string;
}

export class ResourceClass extends ClassType {
  private readonly propsType: StructType;
  private readonly refInterface?: InterfaceType;
  private readonly decider: ResourceDecider;
  private readonly converter: TypeConverter;
  private readonly module: Module;
  private referenceStruct?: StructType;

  constructor(
    scope: IScope,
    private readonly db: SpecDatabase,
    private readonly resource: Resource,
    private readonly props: ResourceClassProps = {},
  ) {
    let refInterface: InterfaceType | undefined;
    if (shouldBuildReferenceInterface(resource)) {
      // IBucketRef { bucketRef: BucketRef }
      refInterface = new InterfaceType(scope, {
        export: true,
        name: `I${resource.name}${props.suffix ?? ''}Ref`,
        extends: [CONSTRUCTS.IConstruct],
        docs: {
          summary: `Indicates that this resource can be referenced as a ${resource.name}.`,
          stability: Stability.Experimental,
          ...maybeDeprecated(props.deprecated),
        },
      });
    }

    super(scope, {
      export: true,
      name: classNameFromResource(resource, props.suffix),
      docs: {
        ...splitDocumentation(resource.documentation),
        stability: Stability.External,
        docTags: { cloudformationResource: resource.cloudFormationType },
        see: cloudFormationDocLink({
          resourceType: resource.cloudFormationType,
        }),
        ...maybeDeprecated(props.deprecated),
      },
      extends: CDK_CORE.CfnResource,
      implements: [CDK_CORE.IInspectable, refInterface?.type, ...ResourceDecider.taggabilityInterfaces(resource)].filter(isDefined),
    });

    this.refInterface = refInterface;
    this.module = Module.of(this);

    this.propsType = new StructType(this.scope, {
      export: true,
      name: propStructNameFromResource(this.resource, this.props.suffix),
      docs: {
        summary: `Properties for defining a \`${classNameFromResource(this.resource)}\``,
        stability: Stability.External,
        see: cloudFormationDocLink({
          resourceType: this.resource.cloudFormationType,
        }),
        ...maybeDeprecated(props.deprecated),
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

    this.buildReferenceInterface();

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
    this.makeFromArnFactory();
    this.makeFromNameFactory();

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

  /**
   * Build the reference interface for this resource
   */
  private buildReferenceInterface() {
    if (!shouldBuildReferenceInterface(this.resource)) {
      return;
    }

    // BucketRef { bucketName, bucketArn }
    this.referenceStruct = new StructType(this.scope, {
      export: true,
      name: `${this.resource.name}${this.props.suffix ?? ''}Reference`,
      docs: {
        summary: `A reference to a ${this.resource.name} resource.`,
        stability: Stability.External,
        ...maybeDeprecated(this.props.deprecated),
      },
    });

    // Build the shared interface
    for (const { declaration } of this.decider.referenceProps ?? []) {
      this.referenceStruct.addProperty(declaration);
    }

    const refProperty = this.refInterface!.addProperty({
      name: `${this.decider.camelResourceName}Ref`,
      type: this.referenceStruct.type,
      immutable: true,
      docs: {
        summary: `A reference to a ${this.resource.name} resource.`,
      },
    });

    this.addProperty({
      name: refProperty.name,
      type: refProperty.type,
      getterBody: Block.with(
        stmt.ret(expr.object(Object.fromEntries(this.decider.referenceProps.map(({ declaration, cfnValue }) => [declaration.name, cfnValue])))),
      ),
      immutable: true,
    });
  }

  private makeFromArnFactory() {
    const arnTemplate = this.resource.arnTemplate;
    if (!(arnTemplate && this.refInterface && this.referenceStruct)) {
      // We don't have enough information to build this factory
      return;
    }

    const cfnArnProperty = this.decider.findArnProperty();
    if (cfnArnProperty == null) {
      return;
    }

    const arnPropertyName = referencePropertyName(cfnArnProperty, this.resource.name);

    // Build the reference object
    const variables = expr.ident('variables');
    const props = this.decider.referenceProps.map(p => p.declaration.name);

    const referenceObject: Record<string, Expression> = Object.fromEntries(
      Object.entries(propsToVars(arnTemplate, props))
        .map(([prop, variable]) => [prop, $E(variables).prop(variable)]),
    );
    const hasNonArnProps = Object.keys(referenceObject).length > 0;

    if (!setEqual(Object.keys(referenceObject), props.filter(p => p !== arnPropertyName))) {
      // Not all properties could be derived from the ARN. We can't continue.
      return;
    }

    const innerClass = mkImportClass(this.scope);
    const refAttributeName = `${this.decider.camelResourceName}Ref`;

    innerClass.addProperty({
      name: refAttributeName,
      type: this.referenceStruct!.type,
    });

    const init = innerClass.addInitializer({
      docs: {
        summary: `Create a new \`${this.resource.cloudFormationType}\`.`,
      },
    });
    const _scope = mkScope(init);
    const id = mkId(init);
    const arn = init.addParameter({
      name: 'arn',
      type: Type.STRING,
    });

    if (arnPropertyName != null) {
      referenceObject[arnPropertyName] = arn;
    }

    // Add the factory method to the outer class
    const factory = this.addMethod({
      name: `from${this.resource.name}Arn`,
      static: true,
      returnType: this.refInterface?.type,
      docs: {
        summary: `Creates a new ${this.refInterface?.name} from an ARN`,
      },
    });
    factory.addParameter({ name: 'scope', type: CONSTRUCTS.Construct });
    factory.addParameter({ name: 'id', type: Type.STRING });
    factory.addParameter({ name: 'arn', type: Type.STRING });

    const initBodyStatements: Statement[] = [
      new SuperInitializer(_scope, id, expr.object({
        environmentFromArn: arn,
      })),
      stmt.sep(),
    ];

    if (hasNonArnProps) {
      initBodyStatements.push(
        stmt.constVar(variables, CDK_CORE.helpers.TemplateString.newInstance(expr.lit(arnTemplate)).prop('parse').call(arn)),
      );
    }
    initBodyStatements.push(stmt.assign($this[refAttributeName], expr.object(referenceObject)));

    init.addBody(...initBodyStatements);

    factory.addBody(
      new TypeDeclarationStatement(innerClass),
      stmt.ret(innerClass.newInstance(expr.ident('scope'), expr.ident('id'), expr.ident('arn'))),
    );
  }

  private makeFromNameFactory() {
    const arnTemplate = this.resource.arnTemplate;
    if (!(arnTemplate && this.refInterface && this.referenceStruct)) {
      // We don't have enough information to build this factory
      return;
    }

    const propsWithoutArn = this.decider.referenceProps.filter(prop => !prop.declaration.name.endsWith('Arn'));
    const allVariables = extractVariables(arnTemplate);
    const onlyProperties = allVariables.filter(v => !['Partition', 'Region', 'Account'].includes(v));

    if (propsWithoutArn.length !== 1 || onlyProperties.length !== 1) {
      // Only generate the method if there is exactly one non-ARN prop in the Reference interface
      // and only one variable in the ARN template that is not Partition, Region or Account
      return;
    }

    const propName = propsWithoutArn[0].declaration.name;
    const variableName = allVariables.find(v => propertyNameFromCloudFormation(v) === propName);
    if (variableName == null) {
      // The template doesn't contain a variable that matches the property name. We can't continue.
      return;
    }

    const innerClass = mkImportClass(this.scope);

    const refAttributeName = `${this.decider.camelResourceName}Ref`;
    innerClass.addProperty({
      name: refAttributeName,
      type: this.referenceStruct!.type,
    });

    const init = innerClass.addInitializer({
      docs: {
        summary: `Create a new \`${this.resource.cloudFormationType}\`.`,
      },
    });
    const _scope = mkScope(init);
    const id = mkId(init);
    const name = init.addParameter({
      name: propName,
      type: Type.STRING,
    });

    const stackOfScope = $T(CDK_CORE.Stack).of(_scope);
    const interpolateArn = CDK_CORE.helpers.TemplateString.newInstance(expr.lit(arnTemplate)).prop('interpolate').call(expr.object({
      Partition: stackOfScope.prop('partition'),
      Region: stackOfScope.prop('region'),
      Account: stackOfScope.prop('account'),
      [variableName]: name,
    }));

    const refenceObject: Record<string, Expression> = {
      [propName]: name,
    };

    const initBodyStatements: Statement[] = [];

    const arnPropName = this.referenceStruct.properties.map(p => p.name).find(n => n.endsWith('Arn'));
    const arn = expr.ident('arn');
    if (arnPropName != null) {
      refenceObject[arnPropName] = arn;
      initBodyStatements.push(stmt.constVar(arn, interpolateArn));
      initBodyStatements.push(new SuperInitializer(_scope, id, expr.object({
        environmentFromArn: arn,
      })));
    } else {
      initBodyStatements.push(new SuperInitializer(_scope, id));
    }
    initBodyStatements.push(stmt.sep());
    initBodyStatements.push(stmt.assign($this[refAttributeName], expr.object(refenceObject)));

    init.addBody(...initBodyStatements);

    // Add the factory method to the outer class
    const factory = this.addMethod({
      name: `from${variableName}`,
      static: true,
      returnType: this.refInterface!.type,
      docs: {
        summary: `Creates a new ${this.refInterface!.name} from a ${propName}`,
      },
    });
    factory.addParameter({ name: 'scope', type: CONSTRUCTS.Construct });
    factory.addParameter({ name: 'id', type: Type.STRING });
    factory.addParameter({ name: propName, type: Type.STRING });

    factory.addBody(
      new TypeDeclarationStatement(innerClass),
      stmt.ret(innerClass.newInstance(expr.ident('scope'), expr.ident('id'), expr.ident(propName))),
    );
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
        .then(stmt.block(stmt.throw_(CDK_CORE.errors.ValidationError.newInstance(expr.lit('Unexpected IResolvable'), scope)))),
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
    const _scope = mkScope(init);
    const id = mkId(init);

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

/**
 * Type guard to filter out undefined values.
 */
function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

/**
 * Compute stability taking into account deprecation status.
 */
function stability(isDeprecated: boolean = false, defaultStability: Stability = Stability.External): Stability {
  if (isDeprecated) {
    return Stability.Deprecated;
  }
  return defaultStability;
}

/**
 * Returns deprecation props if deprecated.
 */
function maybeDeprecated(deprecationNotice?: string, defaultStability: Stability = Stability.External): Pick<DocsSpec, 'deprecated' | 'stability'> {
  if (deprecationNotice) {
    return {
      deprecated: deprecationNotice,
      stability: stability(Boolean(deprecationNotice), defaultStability),
    };
  }

  return {};
}

/**
 * Given a template like "arn:${Partition}:ec2:${Region}:${Account}:fleet/${FleetId}",
 * and a list of property names, like ["partition", "region", "account", "fleetId"],
 * return a mapping from property name to variable name, like:
 * {
 *   partition: "Partition",
 *   region: "Region",
 *   account: "Account",
 *   fleetId: "FleetId"
 * }
 */
function propsToVars(template: string, props: string[]): Record<string, string> {
  const variables = extractVariables(template);
  const result: Record<string, string> = {};

  for (let prop of props) {
    for (let variable of variables) {
      const cfnProperty = propertyNameFromCloudFormation(variable);
      if (prop === cfnProperty) {
        result[prop] = variable;
        break;
      }
    }
  }

  return result;
}

function extractVariables(template: string): string[] {
  return (template.match(/\${([^{}]+)}/g) || []).map(match => match.slice(2, -1));
}

function mkScope(init: Initializer) {
  return init.addParameter({
    name: 'scope',
    type: CONSTRUCTS.Construct,
    documentation: 'Scope in which this resource is defined',
  });
}

function mkId(init: Initializer) {
  return init.addParameter({
    name: 'id',
    type: Type.STRING,
    documentation: 'Construct identifier for this resource (unique in its scope)',
  });
}

/**
 * Whether the given sets are equal
 */
function setEqual<A>(a: A[], b: A[]) {
  const bSet = new Set(b);
  return a.length === b.length && a.every(k => bSet.has(k));
}

function mkImportClass(largerScope: IScope): ClassType {
  const scope = new DummyScope();
  const className = 'Import';
  const innerClass = new ClassType(scope, {
    name: className,
    extends: CDK_CORE.Resource,
  });
  largerScope.linkSymbol(new ThingSymbol(className, scope), expr.ident(className));
  return innerClass;
}
