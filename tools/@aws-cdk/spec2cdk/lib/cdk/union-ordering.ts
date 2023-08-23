import { PropertyType, RichPropertyType, SpecDatabase, TypeDefinition } from '@aws-cdk/service-spec-types';
import { Type } from '@cdklabs/typewriter';
import { isSubsetOf } from '../util/sets';
import { topologicalSort } from '../util/toposort';

/**
 * Order types for use in a union
 * Order the types such that the types with the most strength (i.e., excluding the most values from the type) are checked first
 *
 * This is necessary because at runtime, the union checker will iterate
 * through the types one-by-one to check whether a value inhabits  a type, and
 * it will stop at the first one that matches.
 *
 * We therefore shouldn't have the weakest type up front, because we'd pick the wrong type.
 */
export class UnionOrdering {
  constructor(private readonly db: SpecDatabase) {}

  /**
   * Order typewriter Types based on the strength of the associated PropertyTypes
   */
  public orderTypewriterTypes(writerTypes: Type[], propTypes: PropertyType[]): Type[] {
    if (writerTypes.length !== propTypes.length) {
      throw new Error('Arrays need to be the same length');
    }

    const correspondence = new Map<PropertyType, Type>();
    for (let i = 0; i < writerTypes.length; i++) {
      correspondence.set(propTypes[i], writerTypes[i]);
    }

    return this.orderPropertyTypes(propTypes).map((t) => assertTruthy(correspondence.get(t)));
  }

  /**
   * Order PropertyTypes, strongest first
   */
  public orderPropertyTypes(types: PropertyType[]): PropertyType[] {
    // Map { X -> [Y] }, indicating that X is weaker than each of Y
    const afterMap = new Map<PropertyType, PropertyType[]>(types.map((type) => [
      type,
      types.filter((other) => !new RichPropertyType(type).equals(other) && this.strongerThan(other, type)),
    ]));
    return topologicalSort(types, (t) => t, (t) => afterMap.get(t) ?? []);
  }

  /**
   * Whether type A is strictly stronger than type B (and hence should be tried before B)
   *
   * Currently only specialized if both types are type declarations, otherwise we default
   * to the general kind of the type.
   */
  private strongerThan(a: PropertyType, b: PropertyType) {
    const aType = a.type === 'ref' ? this.db.get('typeDefinition', a.reference.$ref) : undefined;
    const bType = b.type === 'ref' ? this.db.get('typeDefinition', b.reference.$ref) : undefined;
    if (aType && bType) {
      const aReq = requiredPropertyNames(aType);
      const bReq = requiredPropertyNames(bType);

      // If the required properties of A are a proper supserset of B, A goes first (== B is a proper subset of A)
      const [aSubB, bSubA] = [isSubsetOf(aReq, bReq), isSubsetOf(bReq, aReq)];
      if (aSubB !== bSubA) {
        return bSubA;
      }

      // Otherwise, the one with more required properties goes first
      if (aReq.size !== bReq.size) {
        return aReq.size > bReq.size;
      }

      // Otherwise the one with the most total properties goes first
      return Object.keys(aType.properties).length > Object.keys(bType.properties).length;
    }
    return basicKindStrength(a) < basicKindStrength(b);

    /**
     * Return an order for the kind of the type, lower is stronger.
     */
    function basicKindStrength(x: PropertyType): number {
      switch (x.type) {
        case 'array':
          return 0;
        case 'date-time':
          return 1;
        case 'string':
          return 2;
        case 'number':
        case 'integer':
          return 3;
        case 'null':
          return 4;
        case 'boolean':
          return 5;
        case 'ref':
          return 6;
        case 'tag':
          return 7;
        case 'map':
          // Must be higher than type declaration, because they will look the same in JS
          return 8;
        case 'union':
          return 9;
        case 'json':
          // Must have the highest number of all
          return 100;
      }
    }
  }
}

function requiredPropertyNames(t: TypeDefinition): Set<string> {
  return new Set(Object.entries(t.properties).filter(([_, p]) => p.required).map(([n, _]) => n));
}

function assertTruthy<T>(x: T): NonNullable<T> {
  if (x == null) {
    throw new Error('Expected truthy value');
  }
  return x;
}
