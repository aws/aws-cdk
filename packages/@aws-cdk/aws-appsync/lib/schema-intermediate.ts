import { Resolver } from './resolver';
import { Directive, IField, IIntermediateType } from './schema-base';
import { BaseTypeOptions, GraphqlType, ResolvableFieldOptions } from './schema-field';

/**
 * Properties for configuring an Intermediate Type
 *
 * @param definition - the variables and types that define this type
 * i.e. { string: GraphqlType, string: GraphqlType }
 * @param directives - the directives for this object type
 *
 * @experimental
 */
export interface IntermediateTypeProps {
  /**
   * the attributes of this type
   */
  readonly definition: { [key: string]: IField };
  /**
   * the directives for this object type
   *
   * @default - no directives
   */
  readonly directives?: Directive[];
}

/**
 * Interface Types are abstract types that includes a certain set of fields
 * that other types must include if they implement the interface.
 *
 * @experimental
 */
export class InterfaceType implements IIntermediateType {
  /**
   * the name of this type
   */
  public readonly name: string;
  /**
   * the attributes of this type
   */
  public readonly definition: { [key: string]: IField };
  /**
   * the directives for this object type
   *
   * @default - no directives
   */
  public readonly directives?: Directive[];

  public constructor(name: string, props: IntermediateTypeProps) {
    this.name = name;
    this.definition = props.definition;
    this.directives = props.directives;
  }

  /**
   * Create an GraphQL Type representing this Intermediate Type
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public attribute(options?: BaseTypeOptions): GraphqlType {
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
    return Object.keys(this.definition).reduce((acc, key) => {
      return `${acc}${this.fieldToString(key, this.definition[key])}`;
    }, `interface ${this.name} ${this.generateDirectives()}{\n`) + '}';
  }

  /**
   * Generate the field from its attributes
   *
   * @param key the key for this field
   * @param field the attributes of this field
   */
  protected fieldToString(key: string, field: IField): string {
    return `  ${key}${field.argsToString()}: ${field.toString()}${field.directivesToString()}\n`;
  }

  /**
   * Add a field to this Object Type
   *
   * @param fieldName - The name of the field
   * @param field - the field to add
   */
  public addField(fieldName: string, field: IField): void {
    this.definition[fieldName] = field;
  }

  /**
   * Utility function to generate directives
   *
   * @param delimiter the separator betweeen directives
   * @default - ' '
   */
  protected generateDirectives(delimiter?: string): string {
    if (!this.directives) { return ''; }
    return this.directives.reduce((acc, directive) =>
      `${acc}${directive.statement}${delimiter ?? ' '}`, '');
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
}

/**
 * Object Types are types declared by you.
 *
 * @experimental
 */
export class ObjectType extends InterfaceType implements IIntermediateType {
  /**
   * The Interface Types this Object Type implements
   *
   * @default - no interface types
   */
  public readonly interfaceTypes?: InterfaceType[];
  /**
   * The resolvers linked to this data source
   */
  public resolvers?: Resolver[];

  public constructor(name: string, props: ObjectTypeProps) {
    const options = {
      definition: props.interfaceTypes?.reduce((def, interfaceType) => {
        return Object.assign({}, def, interfaceType.definition);
      }, props.definition) ?? props.definition,
      directives: props.directives,
    };
    super(name, options);
    this.interfaceTypes = props.interfaceTypes;
    this.resolvers = [];

    Object.keys(this.definition).forEach((fieldName) => {
      const field = this.definition[fieldName];
      this.generateResolver(fieldName, field.fieldOptions);
    });
  }

  /**
   * Add a field to this Object Type
   *
   * @param fieldName - The name of the field
   * @param field - the resolvable field to add
   */
  public addField(fieldName: string, field: IField): void {
    this.generateResolver(fieldName, field.fieldOptions);
    this.definition[fieldName] = field;
  }

  /**
   * Generate the string of this object type
   */
  public toString(): string {
    let title = this.name;
    if (this.interfaceTypes && this.interfaceTypes.length) {
      title = this.interfaceTypes.reduce((acc, interfaceType) =>
        `${acc} ${interfaceType.name},`, `${title} implements`).slice(0, -1);
    }
    return Object.keys(this.definition).reduce((acc, key) => {
      return `${acc}${this.fieldToString(key, this.definition[key])}`;
    }, `type ${title} ${this.generateDirectives()}{\n`) + '}';
  }

  /**
   * Generate the resolvers linked to this Object Type
   */
  protected generateResolver(fieldName: string, options?: ResolvableFieldOptions): void {
    if (options?.dataSource) {
      if (!this.resolvers) { this.resolvers = []; }
      this.resolvers.push(options.dataSource.createResolver({
        typeName: this.name,
        fieldName: fieldName,
        pipelineConfig: options.pipelineConfig,
        requestMappingTemplate: options.requestMappingTemplate,
        responseMappingTemplate: options.responseMappingTemplate,
      }));
    }
  }
}