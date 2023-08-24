import {
  SpecDatabase,
  PropertyType,
  Resource,
  TypeDefinition,
  Property,
  RichProperty,
} from '@aws-cdk/service-spec-types';
import { ClassType, Module, PrimitiveType, RichScope, StructType, Type, TypeDeclaration } from '@cdklabs/typewriter';
import { CDK_CORE } from './cdk';
import { TypeDefinitionStruct } from './typedefinition-struct';
import { structNameFromTypeDefinition } from '../naming/conventions';

export interface TypeConverterOptions {
  readonly db: SpecDatabase;
  readonly resource: Resource;
  readonly resourceClass: ClassType;
  readonly typeDefinitionConverter: TypeDefinitionConverter;
}

/**
 * Build a type for a TypeDefinition
 *
 * Building happens in two stages to deal with potential recursive type references.
 */
export type TypeDefinitionConverter = (
  typeDef: TypeDefinition,
  converter: TypeConverter,
) => { structType: StructType; build: () => void };

export interface TypeConverterForResourceOptions extends Omit<TypeConverterOptions, 'typeDefinitionConverter'> {
  readonly resource: Resource;
  readonly resourceClass: ClassType;
}

/**
 * Converts types from the spec model to typewriter
 *
 * Converts types in the scope of a single resource.
 */
export class TypeConverter {
  /**
   * Make a type converter for a resource that uses a default TypeDefinition builder for this resource scope
   */
  public static forResource(opts: TypeConverterForResourceOptions) {
    return new TypeConverter({
      ...opts,
      typeDefinitionConverter: (typeDefinition, converter) => {
        // Defensive programming: we have some current issues in the database
        // that would lead to duplicate definitions. Short-circuit that by checking if the
        // type already exists and return that instead.
        const existing = new RichScope(opts.resourceClass).tryFindTypeByName(
          structNameFromTypeDefinition(typeDefinition),
        );
        if (existing) {
          return {
            structType: existing as StructType,
            build: () => {},
          };
        }

        const structType = new TypeDefinitionStruct({
          resource: opts.resource,
          resourceClass: opts.resourceClass,
          converter,
          typeDefinition,
        });

        return {
          structType: structType,
          build: () => structType.build(),
        };
      },
    });
  }

  public readonly db: SpecDatabase;
  public readonly module: Module;
  private readonly typeDefinitionConverter: TypeDefinitionConverter;
  private readonly typeDefCache = new Map<TypeDefinition, StructType>();

  /** Reverse mapping so we can find the original type back for every generated Type */
  private readonly originalTypes = new WeakMap<Type, PropertyType>();

  constructor(options: TypeConverterOptions) {
    this.db = options.db;
    this.typeDefinitionConverter = options.typeDefinitionConverter;
    this.module = Module.of(options.resourceClass);
  }

  /**
   * Return the appropriate typewriter type for a servicespec type
   */
  public typeFromProperty(property: Property): Type {
    // For backwards compatibility reasons we always have to use the original type
    return this.typeFromSpecType(this.typeHistoryFromProperty(property)[0]);
  }

  /**
   * Return the full type history for a servicespec property
   */
  public typeHistoryFromProperty(property: Property): PropertyType[] {
    // For backwards compatibility reasons we always have to use the original type
    return new RichProperty(property).types();
  }

  /**
   * Convert a spec Type to a typewriter Type
   */
  public typeFromSpecType(type: PropertyType): Type {
    const converted = ((): Type => {
      switch (type?.type) {
        case 'string':
          return Type.STRING;
        case 'number':
        case 'integer':
          return Type.NUMBER;
        case 'boolean':
          return Type.BOOLEAN;
        case 'date-time':
          return Type.DATE_TIME;
        case 'array':
          return Type.arrayOf(this.typeFromSpecType(type.element));
        case 'map':
          return Type.mapOf(this.typeFromSpecType(type.element));
        case 'ref':
          const ref = this.db.get('typeDefinition', type.reference.$ref);
          return this.convertTypeDefinitionType(ref).type;
        case 'tag':
          return CDK_CORE.CfnTag;
        case 'union':
          return Type.unionOf(...type.types.map((t) => this.typeFromSpecType(t)));
        case 'null':
          return Type.UNDEFINED;
        case 'tag':
          return CDK_CORE.CfnTag;
        case 'json':
          return Type.ANY;
      }
    })();
    this.originalTypes.set(converted, type);
    return converted;
  }

  public originalType(type: Type): PropertyType {
    const ret = this.originalTypes.get(type);
    if (!ret) {
      throw new Error(`Don't know original type for ${type}`);
    }
    return ret;
  }

  public convertTypeDefinitionType(ref: TypeDefinition): TypeDeclaration {
    const existing = this.typeDefCache.get(ref);
    if (existing) {
      return existing;
    }

    const ret = this.typeDefinitionConverter(ref, this);
    // First stage: hold on to this type so we can resolve recursive references eagerly
    this.typeDefCache.set(ref, ret.structType);
    // Finish building it
    ret.build();
    return ret.structType;
  }

  /**
   * For a given type, returned a resolvable version of the type
   *
   * We do this by checking if the type can be represented directly by a Token (e.g. `Token.asList(value))`).
   * If not we recursively apply a type union with `cdk.IResolvable` to the type.
   */
  public makeTypeResolvable(type: Type): Type {
    if (isTokenizableType(type)) {
      return type;
    }

    if (type.primitive) {
      return Type.unionOf(type, CDK_CORE.IResolvable);
    }

    if (type.arrayOfType) {
      return Type.unionOf(Type.arrayOf(this.makeTypeResolvable(type.arrayOfType)), CDK_CORE.IResolvable);
    }

    if (type.mapOfType) {
      return Type.unionOf(Type.mapOf(this.makeTypeResolvable(type.mapOfType)), CDK_CORE.IResolvable);
    }

    if (type.unionOfTypes) {
      return Type.distinctUnionOf(...type.unionOfTypes.map((t) => this.makeTypeResolvable(t)), CDK_CORE.IResolvable);
    }

    return Type.unionOf(type, CDK_CORE.IResolvable);
  }
}

/**
 * Only string, string[] and number can be represented by a token
 */
function isTokenizableType(type: Type): boolean {
  return (
    type.primitive === PrimitiveType.String ||
    type.arrayOfType?.primitive === PrimitiveType.String ||
    type.primitive === PrimitiveType.Number
  );
}
