import { Construct } from 'constructs';
import { Annotations } from './annotations';
import { CfnRefElement } from './cfn-element';
import { Fn } from './cfn-fn';
import { IResolvable, IResolveContext } from './resolvable';
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

  /*
   * Synthesize this map in a lazy fashion.
   *
   * Lazy maps will only synthesize a mapping if a `findInMap` operation is unable to
   * immediately return a value because one or both of the requested keys are unresolved
   * tokens. In this case, `findInMap` will return a `Fn::FindInMap` CloudFormation
   * intrinsic.
   *
   * @default false
   */
  readonly lazy?: boolean;
}

/**
 * Represents a CloudFormation mapping.
 */
export class CfnMapping extends CfnRefElement {
  private mapping: Mapping;
  private readonly lazy?: boolean;
  private lazyRender = false; // prescribes `_toCloudFormation()` to pass nothing if value from map is returned lazily.
  private lazyInformed = false; // keeps track if user has been sent a message informing them of the possibility to use lazy synthesis.

  constructor(scope: Construct, id: string, props: CfnMappingProps = {}) {
    super(scope, id);
    this.mapping = props.mapping ? this.validateMapping(props.mapping) : {};
    this.lazy = props.lazy;
  }

  /**
   * Sets a value in the map based on the two keys.
   */
  public setValue(key1: string, key2: string, value: any) {
    if ([key1, key2].some(k => ['__proto__', 'constructor'].includes(k))) {
      throw new Error('Cannot use \'__proto__\' or \'constructor\' as keys');
    }

    this.validateAlphanumeric(key2);

    if (!(key1 in this.mapping)) {
      this.mapping[key1] = { };
    }

    this.mapping[key1][key2] = value;
  }

  /**
   * @returns A reference to a value in the map based on the two keys.
   *          If mapping is lazy, the value from the map or default value is returned instead of the reference and the mapping is not rendered in the template.
   */
  public findInMap(key1: string, key2: string, defaultValue?: string): string {
    let fullyResolved = false;
    let notInMap = false;
    if (!Token.isUnresolved(key1)) {
      if (!(key1 in this.mapping)) {
        if (defaultValue === undefined) {
          throw new Error(`Mapping doesn't contain top-level key '${key1}'`);
        } else {
          notInMap = true;
        }
      } else if (!Token.isUnresolved(key2)) {
        if (!(key2 in this.mapping[key1])) {
          if (defaultValue === undefined) {
            throw new Error(`Mapping doesn't contain second-level key '${key2}'`);
          } else {
            notInMap = true;
          }
        }
        fullyResolved = true;
      }
    }

    if (this.lazy) {
      if (notInMap && defaultValue !== undefined) {
        return defaultValue;
      } else if (fullyResolved) {
        return this.mapping[key1][key2];
      }
    }

    this.lazyRender = !fullyResolved;

    return new CfnMappingEmbedder(this, this.mapping, key1, key2, defaultValue).toString();
  }

  /**
   * @internal
   */
  public _toCloudFormation(): object {
    if (this.lazy === undefined && !this.lazyRender) {
      this.informLazyUse();
    }
    if (!this.lazy || (this.lazy && this.lazyRender)) {
      return {
        Mappings: {
          [this.logicalId]: this.mapping,
        },
      };
    } else {
      return {};
    }
  }

  private informLazyUse() {
    if (!this.lazyInformed) {
      Annotations.of(this).addInfo('Consider making this CfnMapping a lazy mapping by providing `lazy: true`: either no findInMap was called or every findInMap could be immediately resolved without using Fn::FindInMap');
    }
    this.lazyInformed = true;
  }

  private validateMapping(mapping: Mapping): Mapping {
    Object.keys(mapping).forEach((m) => Object.keys(mapping[m]).forEach(this.validateAlphanumeric));
    return mapping;
  }

  private validateAlphanumeric(value: any) {
    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/mappings-section-structure.html
    if (value.match(/[^a-zA-Z0-9]/g)) {
      throw new Error(`Attribute name '${value}' must contain only alphanumeric characters.`);
    }
  }
}

class CfnMappingEmbedder implements IResolvable {
  readonly creationStack: string[] = [];

  constructor(private readonly cfnMapping: CfnMapping,
    readonly mapping: Mapping,
    private readonly key1: string,
    private readonly key2: string,
    private readonly defaultValue?: string) { }

  public resolve(context: IResolveContext): string {
    const consumingStack = Stack.of(context.scope);
    if (consumingStack === Stack.of(this.cfnMapping)) {
      return Fn.findInMap(this.cfnMapping.logicalId, this.key1, this.key2, this.defaultValue);
    }

    const constructScope = consumingStack;
    const constructId = `MappingCopy-${this.cfnMapping.node.id}-${this.cfnMapping.node.addr}`;

    let mappingCopy = constructScope.node.tryFindChild(constructId) as CfnMapping | undefined;
    if (!mappingCopy) {
      mappingCopy = new CfnMapping(constructScope, constructId, {
        mapping: this.mapping,
      });
    }

    return Fn.findInMap(mappingCopy.logicalId, this.key1, this.key2, this.defaultValue);
  }

  public toString() {
    return Token.asString(this);
  }
}
