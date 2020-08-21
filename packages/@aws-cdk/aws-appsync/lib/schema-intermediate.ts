import { BaseGraphqlTypeOptions, GraphqlType } from './schema-field';

/**
 * Directives for types
 *
 * i.e. @aws_iam or @aws_subscribe
 *
 * @experimental
 */
export class Directive {
  /**
   * Add the @aws_iam directive
   */
  public static iam(): Directive {
    return new Directive('@aws_iam');
  }

  /**
   * Add a custom directive
   *
   * @param statement - the directive statement to append
   * Note: doesn't guarantee functionality
   */
  public static custom(statement: string): Directive {
    return new Directive(statement);
  }

  /**
   * the directive statement
   */
  public readonly statement: string;

  private constructor(statement: string) { this.statement = statement; }
}

/**
 * Properties for configuring an Intermediate Type
 *
 * @param definition - the variables and types that define this type
 * i.e. { string: GraphqlType, string: GraphqlType }
 *
 * @experimental
 */
export interface IntermediateTypeProps {
  /**
   * the attributes of this type
   */
  readonly definition: { [key: string]: GraphqlType };
}

/**
 * Interface Types are abstract types that includes a certain set of fields
 * that other types must include if they implement the interface.
 *
 * @experimental
 */
export class InterfaceType {
  /**
   * the name of this type
   */
  public readonly name: string;
  /**
   * the attributes of this type
   */
  public readonly definition: { [key: string]: GraphqlType };

  public constructor(name: string, props: IntermediateTypeProps) {
    this.name = name;
    this.definition = props.definition;
  }

  /**
   * Create an GraphQL Type representing this Intermediate Type
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public attribute(options?: BaseGraphqlTypeOptions): GraphqlType {
    return GraphqlType.intermediate({
      isList: options?.isList,
      isRequired: options?.isRequired,
      isRequiredList: options?.isRequiredList,
      intermediateType: this,
    });
  }

  /**
   * Generate the string of this object type
   */
  public toString(): string {
    let schemaAddition = `interface ${this.name} {\n`;
    Object.keys(this.definition).forEach( (key) => {
      const attribute = this.definition[key];
      schemaAddition = `${schemaAddition}  ${key}: ${attribute.toString()}\n`;
    });
    return `${schemaAddition}}`;
  }
}

/**
 * Properties for configuring an Object Type
 *
 * @param definition - the variables and types that define this type
 * i.e. { string: GraphqlType, string: GraphqlType }
 * @param interfaceTypes - the interfaces that this object type implements
 * @param directives - the directives for this object type
 *
 * @experimental
 */
export interface ObjectTypeProps extends IntermediateTypeProps {
  /**
   * The Interface Types this Object Type implements
   *
   * @default - no interface types
   */
  readonly interfaceTypes?: InterfaceType[];
  /**
   * the directives for this object type
   *
   * @default - no directives
   */
  readonly directives?: Directive[];
}

/**
 * Object Types are types declared by you.
 *
 * @experimental
 */
export class ObjectType extends InterfaceType {
  /**
   * A method to define Object Types from an interface
   */
  public static implementInterface(name: string, props: ObjectTypeProps): ObjectType {
    if (!props.interfaceTypes || !props.interfaceTypes.length) {
      throw new Error('Static function `implementInterface` requires an interfaceType to implement');
    }
    return new ObjectType(name, {
      interfaceTypes: props.interfaceTypes,
      definition: props.interfaceTypes.reduce((def, interfaceType) => {
        return Object.assign({}, def, interfaceType.definition);
      }, props.definition),
      directives: props.directives,
    });
  }
  /**
   * The Interface Types this Object Type implements
   *
   * @default - no interface types
   */
  public readonly interfaceTypes?: InterfaceType[];
  /**
   * the directives for this object type
   *
   * @default - no directives
   */
  public readonly directives?: Directive[];

  public constructor(name: string, props: ObjectTypeProps) {
    super(name, props);
    this.interfaceTypes = props.interfaceTypes;
    this.directives = props.directives;
  }

  /**
   * Generate the string of this object type
   */
  public toString(): string {
    let title = this.name;
    if (this.interfaceTypes && this.interfaceTypes.length) {
      title = `${title} implements`;
      this.interfaceTypes.map((interfaceType) => {
        title = `${title} ${interfaceType.name},`;
      });
      title = title.slice(0, -1);
    }
    const directives = this.generateDirectives(this.directives);
    let schemaAddition = `type ${title} ${directives}{\n`;
    Object.keys(this.definition).forEach( (key) => {
      const attribute = this.definition[key];
      schemaAddition = `${schemaAddition}  ${key}: ${attribute.toString()}\n`;
    });
    return `${schemaAddition}}`;
  }

  /**
   * Utility function to generate directives
   *
   * @param directives the directives of a given type
   * @param delimiter the separator betweeen directives
   * @default - ' '
   */
  private generateDirectives(directives?: Directive[], delimiter?: string): string {
    let schemaAddition = '';
    if (!directives) { return schemaAddition; }
    directives.map((directive) => {
      schemaAddition = `${schemaAddition}${directive.statement}${delimiter ?? ' '}`;
    });
    return schemaAddition;
  }
}