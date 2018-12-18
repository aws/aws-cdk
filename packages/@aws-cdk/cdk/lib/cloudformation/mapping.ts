import { Construct } from '../core/construct';
import { FnFindInMap } from './fn';
import { Referenceable } from './stack';

export interface MappingProps {
  mapping?: { [k1: string]: { [k2: string]: any } };
}

/**
 * Represents a CloudFormation mapping.
 */
export class Mapping extends Referenceable {
  private mapping: { [k1: string]: { [k2: string]: any } } = { };

  constructor(parent: Construct, name: string, props: MappingProps) {
    super(parent, name);
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
  public findInMap(key1: any, key2: any) {
    if (!(key1 in this.mapping)) {
      throw new Error(`Mapping doesn't contain top-level key '${key1}'`);
    }

    if (!(key2 in this.mapping[key1])) {
      throw new Error(`Mapping doesn't contain second-level key '${key2}'`);
    }

    return new FnFindInMap(this.logicalId, key1, key2);
  }

  public toCloudFormation(): object {
    return {
      Mappings: {
        [this.logicalId]: this.mapping
      }
    };
  }
}
