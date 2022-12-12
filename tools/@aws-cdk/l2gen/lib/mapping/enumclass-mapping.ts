import type { GenerationRoot } from '../root';
import { EnumClass } from '../gen/enumclass';
import { genTypeForPropertyType } from '../private/cfn2ts-conventions';
import { toCamelCase } from '../private/camel';
import { IType } from '../type';
import { jsVal } from '../well-known-values';
import { CfnSchema, ResolvedType, SchemaObject, SchemaEnum } from "./schema-parser";
import { ITypeMapping, ITypeMappingFactory, SingleSelect, MultiSelect } from './mappings';
import { TypeMapper } from './type-mappings';


export interface EnumClassMappingFactoryProps {
  readonly objType: SchemaObject;
  readonly discriminators: string[];
  readonly positionals: string[];
}

export class EnumClassMappingFactory implements ITypeMappingFactory<'discriminator'|'positionals'> {
  public static try(schema: CfnSchema, type: ResolvedType): EnumClassMappingFactory[] {
    // The field must be required, and must be an enum
    const objType = schema.parseSchemaObject(type);
    if (!objType) { return []; }

    const requiredEnums = Object.fromEntries(Object.entries(objType.properties).filter(([_, prop]) =>
      prop.required && schema.parseSchemaEnum(schema.resolveType(prop.type))
    ));
    const discriminators = Object.keys(requiredEnums);
    if (discriminators.length === 0) { return []; }

    const positionals = Object.keys(objType.properties);
    return [new EnumClassMappingFactory(schema, type, { objType, discriminators, positionals })];
  }

  public readonly mapperId = `${this.type.schemaLocation}.EnumClass`;
  public readonly description: string = `Enum-like class`;
  public readonly configuration = {
    discriminator: new SingleSelect(this.props.discriminators),
    positionals: new MultiSelect(this.props.positionals),
  };

  constructor(private readonly schema: CfnSchema, private readonly type: ResolvedType, private props: EnumClassMappingFactoryProps) {
    this.validateConfiguration();
  }

  public validateConfiguration(): void {
    const positionals = [...this.props.positionals];
    const i = positionals.indexOf(this.configuration.discriminator.value);
    if (i >= 0) { positionals.splice(i, 1); }
    this.configuration.positionals.setOptions(positionals);
  }

  public lockInConfiguration(): ITypeMapping {
    return new EnumClassMapping(this.schema, this.type, {
      objType: this.props.objType,
      typeDiscriminatorField: this.configuration.discriminator.value,
      positionalArgs: this.configuration.positionals.value,
    });
  }
}

export interface EnumClassMappingProps {
  readonly objType: SchemaObject;
  readonly typeDiscriminatorField: string;
  readonly positionalArgs: string[];
}

/**
 * Turn a property bag with one enum in it into an enumclass
 */
export class EnumClassMapping implements ITypeMapping {
  public readonly description = `Enum-like class (discriminated by ${this.props.typeDiscriminatorField})`;
  public readonly id = `${this.type.schemaLocation}.EnumClass`;
  public readonly coveredSchemaLocations: string[];
  private readonly enumProp: SchemaEnum;

  constructor(private readonly schema: CfnSchema, private readonly type: ResolvedType, private readonly props: EnumClassMappingProps) {
    const enumProp = this.schema.parseSchemaEnum(this.schema.resolveType(this.props.objType.properties[this.props.typeDiscriminatorField].type));
    if (enumProp === undefined) {
      throw new Error(`${name}: ${this.props.typeDiscriminatorField} is not an enum after all`);
    }

    this.enumProp = enumProp;

    this.coveredSchemaLocations = [
      type.schemaLocation,
      this.enumProp.schemaLocation,
    ];
  }

  public generate(root: GenerationRoot, mapper: TypeMapper): IType {
    const remainingProperties = { ...this.props.objType.properties };
    delete remainingProperties[this.props.typeDiscriminatorField];

    const oopsies = (this.props.positionalArgs ?? []).filter(a => !remainingProperties[a]);
    if (oopsies.length > 0) {
      throw new Error(`Referencing properties that don't exist: ${oopsies}`);
    }

    const positionalNames = new Set(this.props.positionalArgs ?? []);

    // Let's go with that enum
    const enumClass = new EnumClass(root, name, {
      typeCheckedReturnType: genTypeForPropertyType(this.schema.cfnResourceName, name),
    });

    const enumOptions = Object.entries(remainingProperties).filter(([name, _]) => !positionalNames.has(name));
    const enumPositionals = Object.entries(remainingProperties).filter(([name, _]) => positionalNames.has(name));

    for (const [name, prop] of enumOptions) {
      // By design these all have the same options
      enumClass.sharedOption({
        name: toCamelCase(name),
        required: prop.required ?? false,
        summary: '',
        type: mapper.mapType(prop.type),
        defaultDescription: prop.required ? undefined : '***',
        wire: toCamelCase(name),
      });
    }
    for (const mem of this.enumProp.members) {
      const enumName = toCamelCase(mem);

      enumClass.alternative(enumName, alt => {
        alt.wire({
          [toCamelCase(this.props.typeDiscriminatorField)]: jsVal(mem),
        });

        for (const [name, prop] of enumPositionals) {
          alt.positional({
            name: toCamelCase(name),
            required: prop.required ?? false,
            summary: '',
            type: mapper.mapType(prop.type),
            wire: toCamelCase(name),
          });
        }
      });
    }

    return enumClass;
  }
}