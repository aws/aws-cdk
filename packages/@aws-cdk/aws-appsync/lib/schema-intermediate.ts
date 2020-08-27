import { shapeAddition } from './private';
import { Resolver } from './resolver';
import { Directive, IField, IIntermediateType } from './schema-base';
import { BaseTypeOptions, GraphqlType, ResolvableFieldOptions } from './schema-field';

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
   * Add a field to this Object Type
   *
   * @param fieldName - The name of the field
   * @param field - the field to add
   */
  public addField(fieldName: string, field: IField): void {
    this.definition[fieldName] = field;
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

  public constructor(name: string, props: ObjectTypeProps) {
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