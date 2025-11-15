import { Resource, TypeDefinition } from '@aws-cdk/service-spec-types';
import { ClassType, expr, FreeFunction, Module, PropertySpec, Stability, stmt, StructType, Type } from '@cdklabs/typewriter';
import { CloudFormationMapping } from './cloudformation-mapping';
import { RelationshipDecider } from './relationship-decider';
import { TypeConverter } from './type-converter';
import { TypeDefinitionDecider } from './typedefinition-decider';
import { cloudFormationDocLink, flattenFunctionNameFromType, structNameFromTypeDefinition } from '../naming';
import { splitDocumentation } from '../util';
import { CDK_CORE } from './cdk';

export interface TypeDefinitionStructOptions {
  readonly typeDefinition: TypeDefinition;
  readonly converter: TypeConverter;
  readonly resource: Resource;
  readonly resourceClass: ClassType;
  readonly relationshipDecider: RelationshipDecider;
  /**
   * Add the cfn producer helpers.
   * Validator + ToCloudFormation
   * @default true
   */
  readonly cfnProducer?: boolean;
  /**
   * Add the cfn parser helpers.
   * fromCloudFormation
   * @default true
   */
  readonly cfnParser?: boolean;
}

/**
 * Builds a struct type for a TypeDefinition in the database model
 *
 * Uses the TypeDefinitionDecider for the actual decisions, and carries those out.
 */
export class TypeDefinitionStruct extends StructType {
  private readonly typeDefinition: TypeDefinition;
  private readonly converter: TypeConverter;
  private readonly resource: Resource;
  private readonly module: Module;
  private readonly relationshipDecider: RelationshipDecider;
  private readonly options: TypeDefinitionStructOptions;

  constructor(options: TypeDefinitionStructOptions) {
    super(options.resourceClass, {
      export: true,
      name: structNameFromTypeDefinition(options.typeDefinition),
      docs: {
        ...splitDocumentation(options.typeDefinition.documentation),
        stability: Stability.External,
        see: cloudFormationDocLink({
          resourceType: options.resource.cloudFormationType,
          propTypeName: options.typeDefinition.name,
        }),
      },
    });

    this.typeDefinition = options.typeDefinition;
    this.converter = options.converter;
    this.resource = options.resource;
    this.relationshipDecider = options.relationshipDecider;
    this.options = options;

    this.module = Module.of(this);
  }

  public build() {
    const cfnMapping = new CloudFormationMapping(this.module, this.converter);

    const decider = new TypeDefinitionDecider(this.resource, this.typeDefinition, this.converter, this.relationshipDecider);

    for (const prop of decider.properties) {
      this.addProperty(prop.propertySpec);
      cfnMapping.add(prop.cfnMapping);
    }

    let needsResolverFunction = false;
    for (const [propName, prop] of Object.entries(this.typeDefinition.properties)) {
      needsResolverFunction = needsResolverFunction
        ? needsResolverFunction
        : this.relationshipDecider.needsFlatteningFunction(propName, prop);
    }

    if (needsResolverFunction) {
      const resolverFunction = new FreeFunction(this.module, {
        name: flattenFunctionNameFromType(this),
        returnType: Type.unionOf(this.type, CDK_CORE.IResolvable),
        parameters: [{ name: 'props', type: Type.unionOf(this.type, CDK_CORE.IResolvable) }],
      });

      const propsParam = resolverFunction.parameters[0];
      resolverFunction.addBody(
        stmt.if_(CDK_CORE.isResolvableObject(propsParam))
          .then(stmt.ret(propsParam)),

        stmt.ret(expr.object(
          Object.fromEntries(
            decider.properties.map(prop => [
              prop.propertySpec.name,
              prop.resolver(propsParam),
            ]),
          ),
        )),
      );
    }

    if (this.options.cfnProducer ?? true) {
      cfnMapping.makeCfnProducer(this.module, this);
    }
    if (this.options.cfnParser ?? true) {
      cfnMapping.makeCfnParser(this.module, this);
    }
  }
}

/**
 * Same as TypeDefinitionStruct, but all props are optional.
 */
export class PartialTypeDefinitionStruct extends TypeDefinitionStruct {
  /**
   * Change property spec to make every prop optional.
   */
  public addProperty(prop: PropertySpec) {
    return super.addProperty({
      ...prop,
      optional: true,
    });
  }
}
