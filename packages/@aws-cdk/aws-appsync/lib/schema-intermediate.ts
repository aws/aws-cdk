import { shapeAddition } from './private';
import { Resolver } from './resolver';
import { Directive, IField, IIntermediateType, AddFieldOptions } from './schema-base';
import { BaseTypeOptions, GraphqlType, ResolvableFieldOptions } from './schema-field';

/**
 * Properties for configuring an Intermediate Type
 *
 * @param definition - the variables and types that define this type
 * i.e. { string: GraphqlType, string: GraphqlType }
 *
 * @experimental
 */
export interface IntermediateTypeOptions {
  /**
   * the attributes of this type
   */
  readonly definition: { [key: string]: IField };
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

  public constructor(name: string, props: IntermediateTypeOptions) {
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
    return shapeAddition({
      prefix: 'interface',
      name: this.name,
      fields: Object.keys(this.definition).map((key) =>
        `${key}${this.definition[key].argsToString()}: ${this.definition[key].toString()}`),
    });
  }

  /**
   * Add a field to this Interface Type.
   *
   * Interface Types must have both fieldName and field options.
   *
   * @param options the options to add a field
   */
  public addField(options: AddFieldOptions): void {
    if (!options.fieldName || !options.field) {
      throw new Error('Interface Types must have both fieldName and field options.');
    }
    this.definition[options.fieldName] = options.field;
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
export interface ObjectTypeOptions extends IntermediateTypeOptions {
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
export class ObjectType extends InterfaceType implements IIntermediateType {
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
  /**
   * The resolvers linked to this data source
   */
  public resolvers?: Resolver[];

  public constructor(name: string, props: ObjectTypeOptions) {
    const options = {
      definition: props.interfaceTypes?.reduce((def, interfaceType) => {
        return Object.assign({}, def, interfaceType.definition);
      }, props.definition) ?? props.definition,
    };
    super(name, options);
    this.interfaceTypes = props.interfaceTypes;
    this.directives = props.directives;
    this.resolvers = [];

    Object.keys(this.definition).forEach((fieldName) => {
      const field = this.definition[fieldName];
      this.generateResolver(fieldName, field.fieldOptions);
    });
  }

  /**
   * Add a field to this Object Type.
   *
   * Object Types must have both fieldName and field options.
   *
   * @param options the options to add a field
   */
  public addField(options: AddFieldOptions): void {
    if (!options.fieldName || !options.field) {
      throw new Error('Object Types must have both fieldName and field options.');
    }
    this.generateResolver(options.fieldName, options.field.fieldOptions);
    this.definition[options.fieldName] = options.field;
  }

  /**
   * Generate the string of this object type
   */
  public toString(): string {
    return shapeAddition({
      prefix: 'type',
      name: this.name,
      interfaceTypes: this.interfaceTypes,
      directives: this.directives,
      fields: Object.keys(this.definition).map((key) =>
        `${key}${this.definition[key].argsToString()}: ${this.definition[key].toString()}`),
    });
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

/**
 * Input Types are abstract types that define complex objects.
 * They are used in arguments to represent
 *
 * @experimental
 */
export class InputType implements IIntermediateType {
  /**
   * the name of this type
   */
  public readonly name: string;
  /**
   * the attributes of this type
   */
  public readonly definition: { [key: string]: IField };

  public constructor(name: string, props: IntermediateTypeOptions) {
    this.name = name;
    this.definition = props.definition;
  }

  /**
   * Create an GraphQL Type representing this Input Type
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
   * Generate the string of this input type
   */
  public toString(): string {
    return shapeAddition({
      prefix: 'input',
      name: this.name,
      fields: Object.keys(this.definition).map((key) =>
        `${key}${this.definition[key].argsToString()}: ${this.definition[key].toString()}`),
    });
  }

  /**
   * Add a field to this Input Type.
   *
   * Input Types must have both fieldName and field options.
   *
   * @param options the options to add a field
   */
  public addField(options: AddFieldOptions): void {
    if (!options.fieldName || !options.field) {
      throw new Error('Input Types must have both fieldName and field options.');
    }
    this.definition[options.fieldName] = options.field;
  }
}

/**
 * Properties for configuring an Enum Type
 *
 * @param definition - the strings that define this enum type
 *
 * @experimental
 */
export interface EnumTypeOptions {
  /**
   * the attributes of this type
   */
  readonly definition: string[];
}

/**
 * Enum Types are abstract types that includes a set of fields
 * that represent the strings this type can create.
 *
 * @experimental
 */
export class EnumType implements IIntermediateType {
  /**
   * the name of this type
   */
  public readonly name: string;
  /**
   * the attributes of this type
   */
  public readonly definition: { [key: string]: IField };

  public constructor(name: string, props: EnumTypeOptions) {
    this.name = name;
    this.definition = {};
    props.definition.map((fieldName: string) => this.addField({ fieldName }));
  }

  /**
   * Create an GraphQL Type representing this Enum Type
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
   * Generate the string of this enum type
   */
  public toString(): string {
    return shapeAddition({
      prefix: 'enum',
      name: this.name,
      fields: Object.keys(this.definition),
    });
  }

  /**
   * Add a field to this Enum Type
   *
   * To add a field to this Enum Type, you must only configure
   * addField with the fieldName options.
   *
   * @param options the options to add a field
   */
  public addField(options: AddFieldOptions): void {
    if (options.field) {
      throw new Error('Enum Types do not support IField properties. Use the fieldName option.');
    }
    if (!options.fieldName) {
      throw new Error('When adding a field to an Enum Type, you must configure the fieldName option.');
    }
    if (options.fieldName.indexOf(' ') > -1) {
      throw new Error(`The allowed values of an Enum Type must not have white space. Remove the spaces in "${options.fieldName}"`);
    }
    this.definition[options.fieldName] = GraphqlType.string();
  }
}