import { Directive } from './schema-base';
import { InterfaceType } from './schema-intermediate';

/**
 * Utility enum for Schema class
 */
export enum SchemaMode {
  FILE = 'FILE',
  CODE = 'CODE',
};

/**
 * Generates an addition to the schema
 *
 * ```
 * prefix name interfaces directives {
 *   field
 *   field
 *   ...
 * }
 * ```
 */
export interface SchemaAdditionOptions {
  /**
   * the prefix for this additon (type, interface, enum, input, schema)
   */
  readonly prefix: string;
  /**
   * the name for this addition (some additions dont need this [i.e. schema])
   *
   * @default - no name
   */
  readonly name?: string;
  /**
   * the interface types if this is creating an object type
   *
   * @default - no interfaces
   */
  readonly interfaceTypes?: InterfaceType[];
  /**
   * the directives for this type
   *
   * @default - no directives
   */
  readonly directives?: Directive[];
  /**
   * the fields to reduce onto the addition
   */
  readonly fields: string[];
}

/**
 * Generates an addition to the schema
 *
 * @param options the options to produced a stringfied addition
 *
 * @returns the following shape:
 *
 * ```
 * prefix name interfaces directives {
 *   field
 *   field
 *   ...
 * }
 * ```
 */
export function shapeAddition(options: SchemaAdditionOptions): string {
  const typeName = (): string => { return options.name ? ` ${options.name}` : ''; };
  const interfaces = generateInterfaces(options.interfaceTypes);
  const directives = generateDirectives(options.directives);
  return options.fields.reduce((acc, field) =>
    `${acc}  ${field}\n`, `${options.prefix}${typeName()}${interfaces}${directives} {\n`) + '}';
}

/**
 * Utility class to represent DynamoDB key conditions.
 */
export abstract class BaseKeyCondition {
  public and(cond: BaseKeyCondition): BaseKeyCondition {
    return new (class extends BaseKeyCondition {
      constructor(private readonly left: BaseKeyCondition, private readonly right: BaseKeyCondition) {
        super();
      }

      public renderCondition(): string {
        return `${this.left.renderCondition()} AND ${this.right.renderCondition()}`;
      }

      public keyNames(): string[] {
        return concatAndDedup(this.left.keyNames(), this.right.keyNames());
      }

      public args(): string[] {
        return concatAndDedup(this.left.args(), this.right.args());
      }
    })(this, cond);
  }

  public renderExpressionNames(): string {
    return this.keyNames()
      .map((keyName: string) => {
        return `"#${keyName}" : "${keyName}"`;
      })
      .join(', ');
  }

  public renderExpressionValues(): string {
    return this.args()
      .map((arg: string) => {
        return `":${arg}" : $util.dynamodb.toDynamoDBJson($ctx.args.${arg})`;
      })
      .join(', ');
  }

  public abstract renderCondition(): string;
  public abstract keyNames(): string[];
  public abstract args(): string[];
}

/**
 * Utility class to represent DynamoDB "begins_with" key conditions.
 */
export class BeginsWith extends BaseKeyCondition {
  constructor(private readonly keyName: string, private readonly arg: string) {
    super();
  }

  public renderCondition(): string {
    return `begins_with(#${this.keyName}, :${this.arg})`;
  }

  public keyNames(): string[] {
    return [this.keyName];
  }

  public args(): string[] {
    return [this.arg];
  }
}

/**
 * Utility class to represent DynamoDB binary key conditions.
 */
export class BinaryCondition extends BaseKeyCondition {
  constructor(private readonly keyName: string, private readonly op: string, private readonly arg: string) {
    super();
  }

  public renderCondition(): string {
    return `#${this.keyName} ${this.op} :${this.arg}`;
  }

  public keyNames(): string[] {
    return [this.keyName];
  }

  public args(): string[] {
    return [this.arg];
  }
}

/**
 * Utility class to represent DynamoDB "between" key conditions.
 */
export class Between extends BaseKeyCondition {
  constructor(private readonly keyName: string, private readonly arg1: string, private readonly arg2: string) {
    super();
  }

  public renderCondition(): string {
    return `#${this.keyName} BETWEEN :${this.arg1} AND :${this.arg2}`;
  }

  public keyNames(): string[] {
    return [this.keyName];
  }

  public args(): string[] {
    return [this.arg1, this.arg2];
  }
}

function concatAndDedup<T>(left: T[], right: T[]): T[] {
  return left.concat(right).filter((elem, index, self) => {
    return index === self.indexOf(elem);
  });
}

/**
 * Utility function to generate interfaces for object types
 *
 * @param interfaceTypes the interfaces this object type implements
 */
function generateInterfaces(interfaceTypes?: InterfaceType[]): string {
  if (!interfaceTypes || interfaceTypes.length === 0) return '';
  return interfaceTypes.reduce((acc, interfaceType) =>
    `${acc} ${interfaceType.name},`, ' implements').slice(0, -1);
}

/**
 * Utility function to generate directives
 *
 * @param directives the directives of a given type
 * @param delimiter the separator betweeen directives (by default we will add a space)
 */
function generateDirectives(directives?: Directive[], delimiter?: string): string {
  if (!directives || directives.length === 0) return '';
  return directives.reduce((acc, directive) =>
    `${acc}${directive.statement}${delimiter ?? ' '}`, ' ').slice(0, -1);
}