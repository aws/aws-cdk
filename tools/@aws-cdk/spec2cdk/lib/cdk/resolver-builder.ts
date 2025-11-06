import { DefinitionReference, Property } from '@aws-cdk/service-spec-types';
import { expr, Expression, Module, Type } from '@cdklabs/typewriter';
import { CDK_CORE } from './cdk';
import { RelationshipDecider, Relationship } from './relationship-decider';
import { NON_RESOLVABLE_PROPERTY_NAMES } from './tagging';
import { TypeConverter } from './type-converter';
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

  public buildResolver(prop: Property, cfnName: string): ResolverResult {
    const name = propertyNameFromCloudFormation(cfnName);
    const baseType = this.converter.typeFromProperty(prop);

    // Whether or not a property is made `IResolvable` originally depended on
    // the name of the property. These conditions were probably expected to coincide,
    // but didn't.
    const resolvableType = cfnName in NON_RESOLVABLE_PROPERTY_NAMES ? baseType : this.converter.makeTypeResolvable(baseType);

    const relationships = this.relationshipDecider.parseRelationship(name, prop.relationshipRefs);
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
    const newTypes = relationships.map(t => Type.fromName(this.module, t.referenceType));
    const propType = resolvableType.arrayOfType
      ? Type.arrayOf(Type.distinctUnionOf(resolvableType.arrayOfType, ...newTypes))
      : Type.distinctUnionOf(resolvableType, ...newTypes);

    const typeDisplayNames = [
      ...relationships.map(r => r.typeDisplayName),
      resolvableType.arrayOfType?.toString() ?? resolvableType.toString(),
    ].join(' | ');

    // Generates code like:
    // For single value: (props.roleArn as IRoleRef)?.roleRef?.roleArn ?? (props.roleArn as IUserRef)?.userRef?.userArn ?? props.roleArn
    // For array: props.roleArns?.map((item: any) => (item as IRoleRef)?.roleRef?.roleArn ?? (item as IUserRef)?.userRef?.userArn ?? item)
    // Ensures that arn properties always appear first in the chain as they are more general
    const arnRels = relationships.filter(r => r.propName.toLowerCase().endsWith('arn'));
    const otherRels = relationships.filter(r => !r.propName.toLowerCase().endsWith('arn'));

    const buildChain = (itemName: string) => [
      ...[...arnRels, ...otherRels]
        .map(r => `(${itemName} as ${r.referenceType})?.${r.referenceName}?.${r.propName}`),
      `cdk.ensureStringOrUndefined(${itemName}, "${name}", "${typeDisplayNames}")`,
    ].join(' ?? ');
    const resolver = (_: Expression) => {
      if (resolvableType.arrayOfType) {
        return expr.directCode(`props.${name}?.map((item: any) => ${ buildChain('item') })`);
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
      const isArray = baseType.arrayOfType !== undefined;

      const flattenCall = isArray
        ? propValue.callMethod('map', expr.ident(functionName))
        : expr.ident(functionName).call(propValue);

      const condition = optional
        ? expr.cond(propValue).then(flattenCall).else(expr.UNDEFINED)
        : flattenCall;

      return isArray
        ? expr.cond(CDK_CORE.isResolvableObject(propValue)).then(propValue).else(condition)
        : condition;
    };
    return { name, propType: resolvableType, resolvableType, baseType, resolver };
  }
}
