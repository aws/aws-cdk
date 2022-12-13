import { ITypeMappingFactory, ITypeMapping } from "./mappings";
import { CfnSchema, ResolvedType, SchemaObject } from "./schema-parser";
import { GenerationRoot } from "../root";
import { IType } from "../type";
import { toCamelCase } from "../private/camel";
import { TypeMapper } from "./type-mappings";
import { StructType } from "../gen/struct-type";

export class StructMappingFactory implements ITypeMappingFactory {
  public static try(schema: CfnSchema, type: ResolvedType): StructMappingFactory[] {
    const objType = schema.parseSchemaObject(type);
    if (!objType) { return []; }
    if ((type as any).typeName) { return []; } // Root type

    return [new StructMappingFactory(type, objType)];
  }

  public readonly mapperId = `${this.type.schemaLocation}.Struct`;
  public readonly schemaLocation = this.type.schemaLocation;
  public readonly description: string = `Struct`;
  public readonly configuration = {};

  constructor(private readonly type: ResolvedType, private readonly enumType: SchemaObject) {
  }

  public validateConfiguration() {
  }

  public lockInConfiguration(): ITypeMapping {
    return new StructMapping(this, this.type, this.enumType);
  }
}

export class StructMapping implements ITypeMapping {
  public readonly description: string = `Struct`;
  public readonly id: string = `${this.type.schemaLocation}.Struct`;
  public readonly coveredSchemaLocations: string[] = [this.type.schemaLocation];

  constructor(public readonly factory: StructMappingFactory, private readonly type: ResolvedType, private readonly objType: SchemaObject) {
  }

  public generate(root: GenerationRoot, mapper: TypeMapper): IType {
    const l2 = new StructType(root, CfnSchema.nameFromType(this.objType));

    for (const [name, prop] of Object.entries(this.objType.properties)) {
      l2.addInputProperty({
        name: toCamelCase(name),
        required: prop.required ?? false,
        summary: '',
        type: mapper.mapType(prop.type),
        defaultDescription: !prop.required ? 'Some default' : undefined,
      });
    }

    return l2;
  }
}
