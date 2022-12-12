import { ITypeMappingFactory, ITypeMapping } from "./mappings";
import { CfnSchema, ResolvedType, SchemaObject } from "./schema-parser";
import { L2Gen } from "../gen";
import { GenerationRoot } from "../root";
import { IType } from "../type";
import { toCamelCase } from "../private/camel";
import { TypeMapper } from "./type-mappings";

export class L2GenMappingFactory implements ITypeMappingFactory<never> {
  public static try(schema: CfnSchema, type: ResolvedType): L2GenMappingFactory[] {
    const objType = schema.parseSchemaObject(type);
    if (!objType) { return []; }
    if (!(objType as any).typeName) { return []; } // Root type

    return [new L2GenMappingFactory(type, objType)];
  }

  public readonly mapperId = `${this.type.schemaLocation}.L2Gen`;
  public readonly description: string = `Generated L2`;
  public readonly configuration = {};

  constructor(private readonly type: ResolvedType, private readonly enumType: SchemaObject) {
  }

  public validateConfiguration() {
  }

  public lockInConfiguration(): ITypeMapping {
    return new L2GenMapping(this.type, this.enumType);
  }
}

export class L2GenMapping implements ITypeMapping {
  public readonly description: string = `Generated L2`;
  public readonly id: string = `${this.type.schemaLocation}.L2Gen`;
  public readonly coveredSchemaLocations: string[] = [this.type.schemaLocation];

  constructor(private readonly type: ResolvedType, private readonly objType: SchemaObject) {
  }

  public generate(root: GenerationRoot, mapper: TypeMapper): IType {
    const l2 = new L2Gen(root, this.objType.schemaLocation);

    for (const [name, prop] of Object.entries(this.objType.properties)) {
      l2.addProperty({
        name: toCamelCase(name),
        wire: name,
        required: prop.required ?? false,
        summary: '',
        type: mapper.mapType(prop.type),
        defaultDescription: !prop.required ? 'Some default' : undefined,
      });
    }

    return l2;
  }
}