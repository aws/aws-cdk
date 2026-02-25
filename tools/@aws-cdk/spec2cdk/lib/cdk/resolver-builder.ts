import type { DefinitionReference, Property } from '@aws-cdk/service-spec-types';
import type { CallableDeclaration, Expression, Module } from '@cdklabs/typewriter';
import { expr, Lambda, Parameter, Type } from '@cdklabs/typewriter';
import { CDK_CORE } from './cdk';
import type { RelationshipDecider, Relationship } from './relationship-decider';
import { NON_RESOLVABLE_PROPERTY_NAMES } from './tagging';
import type { TypeConverter } from './type-converter';
import { flattenFunctionNameFromType, propertyNameFromCloudFormation } from '../naming';

export interface ResolverResult {
  /** Property name */
  name: string;
  /** Property type augmented with the relationships type information */
  propType: Type;
  /** Property type without relationship type information */
  resolvableType: Type;
  /** Same as propType without IResolvable */
  baseType: Type;
  resolver: (props: Expression) => Expression;
}

/**
 * Builds property resolvers that handle relationships and nested property flattening
 */
export class ResolverBuilder {
  constructor(
    private readonly converter: TypeConverter,
    private readonly relationshipDecider: RelationshipDecider,
    private readonly module: Module,
  ) {}

  public buildResolver(prop: Property, cfnName: string, isTypeProp = false): ResolverResult {
    const shouldGenerateRelationships = isTypeProp ? this.relationshipDecider.enableNestedRelationships : true;
    const name = propertyNameFromCloudFormation(cfnName);
    const baseType = this.converter.typeFromProperty(prop);

    // Whether or not a property is made `IResolvable` originally depended on
    // the name of the property. These conditions were probably expected to coincide,
    // but didn't.
    const resolvableType = cfnName in NON_RESOLVABLE_PROPERTY_NAMES ? baseType : this.converter.makeTypeResolvable(baseType);

    if (shouldGenerateRelationships) {
      const relationships = this.relationshipDecider.parseRelationship(this.module, name, prop.relationshipRefs);
      if (relationships.length > 0) {
        return this.buildRelationshipResolver({ relationships, baseType, name, resolvableType });
      }

      const originalType = this.converter.originalType(baseType);
      if (this.relationshipDecider.needsFlatteningFunction(name, prop)) {
        const optional = !prop.required;
        const typeRef = originalType.type === 'array' ? originalType.element : originalType;
        if (typeRef.type === 'ref') {
          return this.buildNestedResolver({ name, baseType, typeRef: typeRef, resolvableType, optional });
        }
      }
    }

    return {
      name,
      propType: resolvableType,
      resolvableType,
      baseType,
      resolver: (props: Expression) => expr.get(props, name),
    };
  }

  private buildRelationshipResolver({ relationships, baseType, name, resolvableType }: {
    relationships: Relationship[];
    baseType: Type;
    name: string;
    resolvableType: Type;
  }): ResolverResult {
    if (!(baseType === Type.STRING || baseType.arrayOfType === Type.STRING)) {
      throw Error('Trying to map to a non string property');
    }
    const newTypes = relationships.map(t => t.refType);
    const propType = resolvableType.arrayOfType
      ? Type.arrayOf(Type.distinctUnionOf(resolvableType.arrayOfType, ...newTypes))
      : Type.distinctUnionOf(resolvableType, ...newTypes);

    const typeDisplayNames = [
      ...[...new Set(relationships.map(r => r.refTypeDisplayName))],
      resolvableType.arrayOfType?.toString() ?? resolvableType.toString(),
    ].join(' | ');

    // Generates code like:
    // For single value T | string : (props.xx as IxxxRef)?.xxxRef?.xxxArn ?? cdk.ensureStringOrUndefined(props.xxx, "xxx", "iam.IxxxRef | string");
    // For array <T | string>[]: cdk.mapArrayInPlace(props.layers, (item: IxxxRef | string) => (item as IxxxRef)?.xxxRef?.xxxArn ?? cdk.ensureStringOrUndefined(item, "xxx", "lambda.IxxxRef | string"))
    // Ensures that arn properties always appear first in the chain as they are more general
    const arnRels = relationships.filter(r => r.refPropName.toLowerCase().endsWith('arn'));
    const otherRels = relationships.filter(r => !r.refPropName.toLowerCase().endsWith('arn'));

    const buildChain = (itemName: string) => [
      ...[...arnRels, ...otherRels]
        .map(r => `(${itemName} as ${r.refType})?.${r.refPropStructName}?.${r.refPropName}`),
      `cdk.ensureStringOrUndefined(${itemName}, "${name}", "${typeDisplayNames}")`,
    ].join(' ?? ');
    const resolver = (props: Expression) => {
      if (propType.arrayOfType) {
        const mapper = this.createMapperLambda(propType.arrayOfType, expr.directCode(buildChain('item')));
        return CDK_CORE.mapArrayInPlace.call(expr.get(props, name), mapper);
      } else {
        return expr.directCode(buildChain(`props.${name}`));
      }
    };

    return { name, propType, resolvableType, baseType, resolver };
  }

  private buildNestedResolver({ name, baseType, typeRef, resolvableType, optional }: {
    name: string;
    baseType: Type;
    typeRef: DefinitionReference;
    resolvableType: Type;
    optional: boolean;
  }): ResolverResult {
    const referencedTypeDef = this.converter.db.get('typeDefinition', typeRef.reference.$ref);
    const referencedStruct = this.converter.convertTypeDefinitionType(referencedTypeDef);
    const functionName = flattenFunctionNameFromType(referencedStruct);

    const resolver = (props: Expression) => {
      const propValue = expr.get(props, name);
      // Prop can be of type IResolvable | Array<IResolvable | CfnProperty>
      const arrayType = resolvableType.unionOfTypes?.find(t => t.arrayOfType)?.arrayOfType;

      let flattenCall;
      if (arrayType) {
        const mapper = this.createMapperLambda(arrayType, expr.ident(functionName).call(expr.ident('item')));
        flattenCall = CDK_CORE.mapArrayInPlace.call(propValue, mapper);
      } else {
        flattenCall = expr.ident(functionName).call(propValue);
      }

      const condition = optional
        ? expr.cond(expr.not(propValue)).then(expr.UNDEFINED).else(flattenCall)
        : flattenCall;

      return arrayType
        ? expr.cond(CDK_CORE.isResolvableObject(propValue)).then(propValue).else(condition)
        : condition;
    };
    return { name, propType: resolvableType, resolvableType, baseType, resolver };
  }

  /**
   * Creates an arrow function `(item: T) => body` for use with array mapping.
   * Parameter requires a CallableDeclaration scope, but Lambda is an anonymous
   * expression so we provide a placeholder.
   */
  private createMapperLambda(itemType: Type, body: Expression): Lambda {
    const lambdaScope: CallableDeclaration = { parameters: [], returnType: Type.VOID, name: 'LambdaScope' };
    return new Lambda([new Parameter(lambdaScope, { name: 'item', type: itemType })], body);
  }
}
