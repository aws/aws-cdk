import * as fs from 'fs';
import type { GenerationRoot } from './root';
import { EnumClass } from './enumclass';
import { genTypeForPropertyType } from './private/cfn2ts-conventions';
import { toCamelCase } from 'codemaker';
import { STRING, NUMBER, BOOLEAN, IType } from './type';
import { jsVal } from './well-known-values';

export class SchemaParser {
  public static fromFile(fileName: string) {
    const x = fs.readFileSync(fileName, { encoding: 'utf-8' });
    return new SchemaParser(JSON.parse(x));
  }

  constructor(private readonly schema: any) {
  }

  public get cfnResourceName(): string {
    return this.schema.typeName;
  }

  /**
   * Turn a property bag with one enum in it into an enumclass
   */
  public deriveEnumClass(root: GenerationRoot, name: string, options: DeriveEnumClassOptions = {}) {
    // The field must be required, and must be an enum
    const objType = parseSchemaObject(this.definition(name));
    if (!objType) {
      throw new Error(`${name} is not an object type`);
    }

    const requiredEnums = Object.fromEntries(Object.entries(objType.properties).filter(([_, prop]) =>
      prop.required && parseSchemaEnum(this.resolveType(prop.type))
    ));
    const requiredEnumNames = Object.keys(requiredEnums);
    if (requiredEnumNames.length === 0) {
      throw new Error(`${name} has no discriminating union type`);
    }

    let typeDiscriminatorField: string;
    if (options.typeDiscriminatorField) {
      if (!requiredEnumNames.includes(options.typeDiscriminatorField)) {
        throw new Error(`${name}: discriminator field ${options.typeDiscriminatorField} not found among ${requiredEnumNames}`);
      }
      typeDiscriminatorField = options.typeDiscriminatorField;
    } else {
      if (requiredEnumNames.length !== 1) {
        throw new Error(`${name}: more than 1 type discriminator available, pass 'typeDiscriminatorField': ${requiredEnumNames}`);
      }
      typeDiscriminatorField = requiredEnumNames[0];
    }

    const enumProp = parseSchemaEnum(this.resolveType(objType.properties[typeDiscriminatorField].type));
    if (enumProp === undefined) {
      throw new Error(`${name}: ${typeDiscriminatorField} is not an enum after all`);
    }

    const remainingProperties = { ...objType.properties };
    delete remainingProperties[typeDiscriminatorField];

    const oopsies = (options.positionalArgs ?? []).filter(a => !remainingProperties[a]);
    if (oopsies.length > 0) {
      throw new Error(`Referencing properties that don't exist: ${oopsies}`);
    }

    const positionalNames = new Set(options.positionalArgs ?? []);

    // Let's go with that enum
    const enumClass = new EnumClass(root, name, {
      typeCheckedReturnType: genTypeForPropertyType(this.cfnResourceName, name),
    });

    const enumOptions = Object.entries(remainingProperties).filter(([name, _]) => !positionalNames.has(name));
    const enumPositionals = Object.entries(remainingProperties).filter(([name, _]) => positionalNames.has(name));

    for (const [name, prop] of enumOptions) {
      // By design these all have the same options
      enumClass.sharedOption({
        name: toCamelCase(name),
        required: prop.required ?? false,
        summary: '',
        type: this.mapType(prop.type),
        defaultDescription: prop.required ? undefined : '***',
        wire: toCamelCase(name),
      });
    }
    for (const mem of enumProp.members) {
      const enumName = toCamelCase(mem);

      enumClass.alternative(enumName, alt => {
        alt.wire({
          [toCamelCase(typeDiscriminatorField)]: jsVal(mem),
        });

        for (const [name, prop] of enumPositionals) {
          alt.positional({
            name: toCamelCase(name),
            required: prop.required ?? false,
            summary: '',
            type: this.mapType(prop.type),
            wire: toCamelCase(name),
          });
        }
      });
    }

    return enumClass;
  }

  private mapType(schemaType: UnresolvedType): IType {
    // FIXME: Needs a complex type mapping as well
    const resolved = this.resolveType(schemaType);
    switch (resolved.type) {
      case 'string': return STRING;
      case 'number':
      case 'integer':
        return NUMBER;
      case 'boolean': return BOOLEAN;
      default:
        throw new Error(`Cannot convert JSON Schema type ${resolved.type} yet`);
    }
  }

  public findEnums(): EnumDefinition[] {
    const self = this;
    const seen = new Set<string>();
    const ret = new Array<EnumDefinition>();
    recurse(typesAt(`${this.schema.typeName}#/definitions`, this.schema.definitions ?? {}));
    return ret;

    function recurse(types: UnresolvedType[]) {
      for (const def of types) {
        if (seen.has(def.schemaLocation)) { continue; }
        seen.add(def.schemaLocation);

        const resolvedType = self.resolveType(def);
        const enm = parseSchemaEnum(resolvedType);

        if (enm) {
          ret.push(enm);
        }
        if (resolvedType.properties) {
          recurse(propertyTypesAt(resolvedType));
        }
      }
    }
  }

  private definition(name: string): ResolvedType {
    if (!this.schema.definitions?.[name]) {
      throw new Error(`No such definition: ${name}`);
    }

    return {
      schemaLocation: `${this.schema.typeName}#/definitions`,
      ...this.schema.definitions?.[name]
    };
  }

  public findDiscriminativeEnums() {
  }

  private resolveType(type: UnresolvedType): ResolvedType {
    if (type['$ref']) {
      const m = type['$ref'].match(/^#\/definitions\/([a-zA-Z0-9]+)$/);
      if (!m) {
        throw new Error(`Cannot parse this yet: ${type['$ref']}`);
      }
      return {
        schemaLocation: `${this.cfnResourceName}${type['$ref']}`,
        ...this.schema.definitions[m[1]],
      };
    }
    return type as any;
  }

}

export interface UnresolvedType {
  readonly schemaLocation: string;
  readonly '$ref'?: string;
  readonly type?: string;
}

export interface ResolvedType {
  readonly schemaLocation: string;
  readonly '$ref': never;
  readonly type: string;
  readonly description?: string;
  [key: string]: unknown;
}

export type AdditionalFields = Record<string, unknown>;
export type AtLeast<A> = A & AdditionalFields;

export interface EnumDefinition extends SchemaEnum {
  readonly name: string;
}

export interface DeriveEnumClassOptions {
  readonly typeDiscriminatorField?: string;
  readonly positionalArgs?: string[];
}

export interface SchemaEnum {
  readonly schemaLocation: string;
  readonly name: string;
  readonly description?: string;
  readonly members: string[];
}

export interface SchemaObject {
  readonly schemaLocation: string;
  readonly description?: string;
  readonly properties: Record<string, SchemaObjectProperty>;
}

export interface SchemaObjectProperty {
  readonly schemaLocation: string;
  readonly required?: boolean;
  readonly type: UnresolvedType;
}

function parseSchemaEnum(x: ResolvedType): SchemaEnum | undefined {
  if (x.enum && x.type === 'string') {
    return {
      schemaLocation: x.schemaLocation,
      name: nameFromType(x),
      description: x.description ?? '',
      members: x.enum as string[],
    };
  }

  return undefined;
}

function parseSchemaObject(x: ResolvedType): SchemaObject | undefined {
  if (x.type !== 'object') { return undefined; }
  if (x.additionalProperties) { return undefined; } // That's a map, not an object
  const required = new Set(x.required as string[] ?? []);

  const properties = Object.fromEntries(Object.entries(x.properties as Record<string, UnresolvedType>)
    .map(([name, type]) => [name, { schemaLocation: `${x.schemaLocation}/properties/${name}`, required: required.has(name), type, } as SchemaObjectProperty] as const));

  return {
    schemaLocation: x.schemaLocation,
    description: x.description,
    properties,
  };
}

function nameFromType(x: ResolvedType) {
  return x.schemaLocation.split('/').slice(-1)[0];
}

function typesAt(schemaLocation: string, typeBag: Record<string, any>): UnresolvedType[] {
  return Object.entries(typeBag).map(([key, type]) => ({
    schemaLocation: `${schemaLocation}/${key}`,
    ...type
  }));
}

function propertyTypesAt(parent: ResolvedType | UnresolvedType) {
  return typesAt(`${parent.schemaLocation}/properties`, (parent as any).properties ?? {});
}