import { Construct } from 'constructs';
import { CfnRefElement } from './cfn-element';
import { Fn } from './cfn-fn';
import { Token } from './token';

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
  readonly mapping?: { [k1: string]: { [k2: string]: any } };
}

/**
 * Represents a CloudFormation mapping.
 */
export class CfnMapping extends CfnRefElement {
  private mapping: { [k1: string]: { [k2: string]: any } } = { };

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
