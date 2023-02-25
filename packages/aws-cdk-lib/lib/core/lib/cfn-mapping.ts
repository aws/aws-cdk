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
  private lazyRender = false;
  private lazyInformed = false;

  constructor(scope: Construct, id: string, props: CfnMappingProps = {}) {
    super(scope, id);
    this.mapping = props.mapping ? this.validateMapping(props.mapping) : {};
    this.lazy = props.lazy;
  }

  /**
   * Sets a value in the map based on the two keys.
   */
  public setValue(key1: string, key2: string, value: any) {
    this.validateAlphanumeric(key2);

    if (!(key1 in this.mapping)) {
      this.mapping[key1] = { };
    }

    this.mapping[key1][key2] = value;
  }

  /**
   * @returns A reference to a value in the map based on the two keys.
   */
  public findInMap(key1: string, key2: string): string {
    let fullyResolved = false;
    if (!Token.isUnresolved(key1)) {
      if (!(key1 in this.mapping)) {
        throw new Error(`Mapping doesn't contain top-level key '${key1}'`);
      }
      if (!Token.isUnresolved(key2)) {
        if (!(key2 in this.mapping[key1])) {
          throw new Error(`Mapping doesn't contain second-level key '${key2}'`);
        }
        fullyResolved = true;
      }
    }
    if (fullyResolved) {
      if (this.lazy) {
        return this.mapping[key1][key2];
      }
    } else {
      this.lazyRender = true;
    }

    return new CfnMappingEmbedder(this, this.mapping, key1, key2).toString();
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

  constructor(private readonly cfnMapping: CfnMapping, readonly mapping: Mapping, private readonly key1: string, private readonly key2: string) { }

  public resolve(context: IResolveContext): string {
    const consumingStack = Stack.of(context.scope);
    if (consumingStack === Stack.of(this.cfnMapping)) {
      return Fn.findInMap(this.cfnMapping.logicalId, this.key1, this.key2);
    }

    const constructScope = consumingStack;
    const constructId = `MappingCopy-${this.cfnMapping.node.id}-${this.cfnMapping.node.addr}`;

    let mappingCopy = constructScope.node.tryFindChild(constructId) as CfnMapping | undefined;
    if (!mappingCopy) {
      mappingCopy = new CfnMapping(constructScope, constructId, {
        mapping: this.mapping,
      });
    }

    return Fn.findInMap(mappingCopy.logicalId, this.key1, this.key2);
  }

  public toString() {
    return Token.asString(this);
  }
}
