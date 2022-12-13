import type { GenerationRoot } from '../root';
import { EnumClass } from '../gen/enumclass';
import { genTypeForPropertyType } from '../private/cfn2ts-conventions';
import { toCamelCase } from '../private/camel';
import { IType } from '../type';
import { CfnSchema, ResolvedType, SchemaObject } from "./schema-parser";
import { ITypeMapping, ITypeMappingFactory } from './mappings';
import { TypeMapper } from './type-mappings';
import { IValue, objLit } from '../value';


export interface EnumClassImplicitUnionMappingFactoryProps {
  readonly objType: SchemaObject;
  readonly alternatives: Record<string, SchemaObject>;
}

export class EnumClassImplicitUnionMappingFactory implements ITypeMappingFactory {
  public static try(schema: CfnSchema, type: ResolvedType): EnumClassImplicitUnionMappingFactory[] {
    // The field must be required, and must be an enum
    const objType = schema.parseSchemaObject(type);
    if (!objType) { return []; }

    const requiredEnums = Object.fromEntries(Object.entries(objType.properties).filter(([_, prop]) =>
      prop.required && schema.parseSchemaEnum(schema.resolveType(prop.type))
    ));
    const discriminators = Object.keys(requiredEnums);

    // For now we expect 0 discriminators. We might have at most one at some point.
    if (discriminators.length > 0) { return []; }

    const alternatives = Object.fromEntries(Object.entries(objType.properties).flatMap(([name, prop]) => {
      const asObject = schema.parseSchemaObject(schema.resolveType(prop.type));
      return !prop.required && !!asObject ? [[name, asObject] as const] : [];
    }));
    if (Object.keys(alternatives).length !== Object.keys(objType.properties).length) { return []; }

    return [new EnumClassImplicitUnionMappingFactory(schema, type, { objType, alternatives })];
  }

  public readonly mapperId = `${this.type.schemaLocation}.ImplicitEnumClass`;
  public readonly schemaLocation = this.type.schemaLocation;

  public readonly description: string = `Implicit enum class`;
  public readonly configuration = {};

  constructor(private readonly schema: CfnSchema, private readonly type: ResolvedType, private props: EnumClassImplicitUnionMappingFactoryProps) {
  }

  public validateConfiguration(): void {
  }

  public lockInConfiguration(): ITypeMapping {
    return new EnumClassImplicitUnionMapping(this, this.schema, this.type, {
      objType: this.props.objType,
      alternatives: this.props.alternatives,
    });
  }
}

export interface EnumClassImplicitUnionMappingProps {
  readonly objType: SchemaObject;
  readonly alternatives: Record<string, SchemaObject>;
}

/**
 * Turn a property bag with one enum in it into an enumclass
 */
export class EnumClassImplicitUnionMapping implements ITypeMapping {
  public readonly description = `Implicit enum class`;
  public readonly coveredSchemaLocations: string[] = [];

  constructor(public readonly factory: EnumClassImplicitUnionMappingFactory, private readonly schema: CfnSchema, private readonly type: ResolvedType, private readonly props: EnumClassImplicitUnionMappingProps) {
    this.coveredSchemaLocations.push(props.objType.schemaLocation);

    for (const [, propType] of Object.entries(props.objType.properties)) {
      const resolved = schema.resolveType(propType.type);
      this.coveredSchemaLocations.push(resolved.schemaLocation);
    }
  }

  public generate(root: GenerationRoot, mapper: TypeMapper): IType {
    // Let's go with that enum
    const enumClass = new EnumClass(root, CfnSchema.nameFromType(this.type), {
      typeCheckedReturnType: genTypeForPropertyType(this.schema.cfnResourceName, name),
    });

    for (const [name, altObj] of Object.entries(this.props.alternatives)) {
      const enumName = toCamelCase(name);

      enumClass.alternative(enumName, alt => {
        // Options
        const wireResult: Record<string, IValue> = {};

        for (const [optName, opt] of Object.entries(altObj.properties)) {
          wireResult[toCamelCase(optName)] = alt.option({
            name: toCamelCase(optName),
            required: !!opt.required,
            type: mapper.mapType(opt.type),
            summary: '',
            defaultDescription: !opt.required ? 'Some default' : undefined,
          });
        }

        alt.wire({
          [enumName]: objLit(wireResult),
        });
      });
    }

    return enumClass;
  }
}