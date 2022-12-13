import * as fs from 'fs';
import { EnumClass } from '../gen/enumclass';
import { IType } from '../type';
import { IRenderable, renderable } from '../cm2';

export class CfnSchema {
  public static resourceNameFromSchemaLocation(x: string) {
    if (x.includes('#')) {
      return x.split('#')[0];
    } else {
      return x.split('/')[0];
    }
  }

  public static nameFromType(x: { readonly schemaLocation: string }) {
    return x.schemaLocation.split('/').slice(-1)[0];
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

  public allTypes(): ResolvedType[] {
    const ret: Record<string, ResolvedType> = {};
    const recurse = (x: UnresolvedType) => {
      const resolved = this.resolveType(x);
      if (ret[resolved.schemaLocation]) { return; }

      ret[resolved.schemaLocation] = resolved;

      const resolvedAny = resolved as any;

      for (const [key, type] of Object.entries((resolvedAny.properties ?? {}) as Record<string, SchemaType>)) {
        recurse({ schemaLocation: `${x.schemaLocation}/properties/${key}`, ...type });
      }
      if (typeof resolvedAny.additionalProperties === 'object') {
        recurse({ schemaLocation: `${x.schemaLocation}/additionalProperties`, ...resolvedAny.additionalProperties });
      }
      if (typeof resolvedAny.patternProperties === 'object') {
        for (const [patK, patType] of Object.entries(resolvedAny.patternProperties as Record<string, any>)) {
          recurse({ schemaLocation: `${x.schemaLocation}/patternProperties/${patK}`, ...patType });
        }
      }
      if (typeof resolvedAny.items === 'object') {
        recurse({ schemaLocation: `${x.schemaLocation}/items`, ...resolvedAny.items });
      }
    }

    recurse({ schemaLocation: `${this.cfnResourceName}#`, ...this.schema });
    return Object.values(ret);
  }

  public parseSchemaEnum(x: ResolvedType): SchemaEnum | undefined {
    if (x.enum && x.type === 'string') {
      return {
        schemaLocation: x.schemaLocation,
        name: CfnSchema.nameFromType(x),
        description: x.description ?? '',
        members: x.enum as string[],
      };
    }

    return undefined;
  }

  public parseSchemaObject(x: ResolvedType): SchemaObject | undefined {
    // Top-level objects have a 'typeName' field iso 'type == "object"'
    if (x.type !== 'object' && !(x as any).typeName) { return undefined; }
    if (!x.properties || x.additionalProperties) { return undefined; } // That's a map, not an object
    const required = new Set(x.required as string[] ?? []);

    const readonlyProps = new Set(((x as any).readOnlyProperties ?? []).map((x: string) => x.split('/')[2]));

    const properties = Object.fromEntries(Object.entries(x.properties as Record<string, SchemaType>)
      .filter(([name, _]) => !readonlyProps.has(name))
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