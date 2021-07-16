import { Construct, Node } from 'constructs';
import { CfnRefElement } from './cfn-element';
import { Fn } from './cfn-fn';
import { Stack } from './stack';
import { Token } from './token';

type Mapping = { [k1: string]: { [k2: string]: any } };

export interface CfnMappingProps {
  /**
   * Mapping of key to a set of corresponding set of named values.
   * The key identifies a map of name-value pairs and must be unique within the mapping.
   *
   * For example, if you want to set values based on a region, you can create a mapping
   * that uses the region name as a key and contains the values you want to specify for
   * each specific region.
   *
   * @default - No mapping.
   */
  readonly mapping?: Mapping;
}

/**
 * Represents a CloudFormation mapping.
 */
export class CfnMapping extends CfnRefElement {
  /**
   * Register a lazy map so it can be used in future `findInLazyMap` operations.
   *
   * Lazy maps will only synthesize a mapping if a `findInLazyMap` operation is unable to
   * immediately return a value because one or both of the requested keys are unresolved
   * tokens. In this case, `findInLazyMap` will return a `Fn::FindInMap` CloudFormation
   * intrinsic.
   */
  static registerLazyMap(mappingId: string, mapping: Mapping) {
    if (mappingId in this.lazyMaps) {
      if (mapping !== this.lazyMaps[mappingId]) {
        throw new Error(`Attempted to register mapping ${mappingId} but a different mapping has already been registered with this ID`);
      }
    } else {
      this.lazyMaps[mappingId] = mapping;
    }
  }

  /**
   * Locate a value in a registered lazy map using the provided keys.
   *
   * Lazy maps will only synthesize a mapping if a `findInLazyMap` operation is unable to
   * immediately return a value because one or both of the requested keys are unresolved
   * tokens. In this case, `findInLazyMap` will return a `Fn::FindInMap` CloudFormation
   * intrinsic.
   */
  static findInLazyMap(scope: Construct, mappingId: string, key1: string, key2: string): any {
    if (!(mappingId in this.lazyMaps)) {
      throw new Error(`Mapping ${mappingId} is not registered as a lazy map`);
    }
    const mapping = this.lazyMaps[mappingId];
    if (!Token.isUnresolved(key1) && !Token.isUnresolved(key2)) {
      if (!(key1 in mapping)) {
        throw new Error(`Mapping ${mappingId} does not contain top-level key '${key1}'`);
      }
      if (!(key2 in mapping[key1])) {
        throw new Error(`Mapping ${mappingId} does not contain second-level key '${key2}'`);
      }
      return mapping[key1][key2];
    } else {
      const stack = Stack.of(scope);
      const cfnMapping = Node.of(stack).tryFindChild(mappingId) as CfnMapping ?? new CfnMapping(stack, mappingId, {
        mapping: mapping,
      });
      return cfnMapping.findInMap(key1, key2);
    }
  }

  /**
   * Internal registry of lazy maps
   */
  private static lazyMaps: { [mappingId: string]: Mapping } = {};

  private mapping: Mapping;

  constructor(scope: Construct, id: string, props: CfnMappingProps = {}) {
    super(scope, id);
    this.mapping = props.mapping || { };
  }

  /**
   * Sets a value in the map based on the two keys.
   */
  public setValue(key1: string, key2: string, value: any) {
    if (!(key1 in this.mapping)) {
      this.mapping[key1] = { };
    }

    this.mapping[key1][key2] = value;
  }

  /**
   * @returns A reference to a value in the map based on the two keys.
   */
  public findInMap(key1: string, key2: string): string {
    // opportunistically check that the key exists (if the key does not contain tokens)
    if (!Token.isUnresolved(key1) && !(key1 in this.mapping)) {
      throw new Error(`Mapping doesn't contain top-level key '${key1}'`);
    }

    // opportunistically check that the second key exists (if the key does not contain tokens)
    if (!Token.isUnresolved(key1) && !Token.isUnresolved(key2) && !(key2 in this.mapping[key1])) {
      throw new Error(`Mapping doesn't contain second-level key '${key2}'`);
    }

    return Fn.findInMap(this.logicalId, key1, key2);
  }

  /**
   * @internal
   */
  public _toCloudFormation(): object {
    return {
      Mappings: {
        [this.logicalId]: this.mapping,
      },
    };
  }
}
