import * as fs from 'fs';
import { EnumClass } from '../gen/enumclass';
import { IType } from '../type';
import { IRenderable, renderable } from '../cm2';

export class CfnSchema {
  public static resourceNameFromSchemaLocation(x: string) {
    const [cfnName] = x.split('#');
    return cfnName;
  }

  public static fromFile(fileName: string) {
    const x = fs.readFileSync(fileName, { encoding: 'utf-8' });
    return new CfnSchema(JSON.parse(x));
  }

  constructor(private readonly schema: any) {
  }

  public get cfnResourceName(): string {
    return this.schema.typeName;
  }

  public definitions(): ResolvedType[] {
    return [
      this.root(),
      ...Object.keys(this.schema.definitions ?? {}).map(name => {
        return this.definition(name);
      })
    ];
  }

  public root(): ResolvedType {
    return {
      schemaLocation: `${this.cfnResourceName}`,
      ...this.schema,
    };
  }

  public definition(name: string): ResolvedType {
    if (!this.schema.definitions?.[name]) {
      throw new Error(`No such definition: ${name}`);
    }

    return {
      schemaLocation: `${this.schema.typeName}#/definitions/${name}`,
      ...this.schema.definitions?.[name]
    };
  }

  public parseSchemaEnum(x: ResolvedType): SchemaEnum | undefined {
    if (x.enum && x.type === 'string') {
      return {
        schemaLocation: x.schemaLocation,
        name: this.nameFromType(x),
        description: x.description ?? '',
        members: x.enum as string[],
      };
    }

    return undefined;
  }

  public parseSchemaObject(x: ResolvedType): SchemaObject | undefined {
    if (x.type !== 'object') { return undefined; }
    if (!x.properties || x.additionalProperties) { return undefined; } // That's a map, not an object
    const required = new Set(x.required as string[] ?? []);

    const properties = Object.fromEntries(Object.entries(x.properties as Record<string, SchemaType>)
      .map(([name, type]): [string, SchemaObjectProperty] =>
        [name, {
          schemaLocation: `${x.schemaLocation}/properties/${name}`,
          required: required.has(name),
          type: {
            schemaLocation: `${x.schemaLocation}/properties/${name}`,
            ...type,
          },
      }]));

    return {
      schemaLocation: x.schemaLocation,
      description: x.description,
      properties,
    };
  }

  public nameFromType(x: ResolvedType) {
    return x.schemaLocation.split('/').slice(-1)[0];
  }

  public propertyTypesAt(parent: ResolvedType | UnresolvedType) {
    return typesAt(`${parent.schemaLocation}/properties`, (parent as any).properties ?? {});
  }

  public resolveType(type: UnresolvedType): ResolvedType {
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

export class UnmappedType implements IType {
  public readonly typeRefName = `<UNMAPPED:${this.schemaLocation}>`;
  public readonly definingModule = undefined;

  constructor(private readonly schemaLocation: string) {
  }

  public exampleValue(): IRenderable {
    return renderable([this.typeRefName]);
  }

  public render(): void {
  }

  public toString(): string {
    return this.typeRefName;
  }
}

export type SchemaType =
  | { readonly '$ref': string }
  | { readonly type: string }
  ;

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

function typesAt(schemaLocation: string, typeBag: Record<string, any>): UnresolvedType[] {
  return Object.entries(typeBag).map(([key, type]) => ({
    schemaLocation: `${schemaLocation}/${key}`,
    ...type
  }));
}

export interface EnumClassDerivation {
  readonly discriminatorField: string;
  readonly enumClass: EnumClass;
}