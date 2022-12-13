import { ITypeMapping, ITypeMappingFactory } from "./mappings";
import { GenerationRoot } from "../root";
import { CfnSchema, UnresolvedType, UnmappedType } from "./schema-parser";
import { IType, STRING, NUMBER, BOOLEAN, arrayOf, mapOf } from "../type";
import { CM2 } from "../cm2";

export class TypeMapper {
  private readonly mappers = new Map<string, ITypeMapping>();
  private readonly types = new Map<string, IType>();
  private readonly generationRoot = new GenerationRoot();
  private readonly schemas: Map<string, CfnSchema>;

  constructor(schemas: CfnSchema[]) {
    this.schemas = new Map(schemas.map(schema => [schema.cfnResourceName, schema]));
  }

  public lockIn(schemaLocation: string, mapping: ITypeMapping) {
    this.mappers.set(schemaLocation, mapping);

    this.types.clear();
    for (const [schema, mapper] of this.mappers.entries()) {
      this.types.set(schema, mapper.generate(this.generationRoot, this));
    }
  }

  public hasLockIn(schemaLocation: string) {
    return this.mappers.has(schemaLocation);
  }

  public isLockedIn(factory: ITypeMappingFactory): boolean {
    return this.mappers.get(factory.schemaLocation)?.factory.mapperId === factory.mapperId;
  }

  public generateExample(typeMapping: ITypeMapping): string {
    return CM2.renderSingle('example.ts', typeMapping.generate(this.generationRoot, this).exampleValue('example', true));
  }

  public mapType(schemaType: UnresolvedType): IType {
    // Resolve in the same parser
    const resolved = this.findSchema(schemaType.schemaLocation).resolveType(schemaType);

    const lockedIn = this.types.get(resolved.schemaLocation);
    if (lockedIn) { return lockedIn; }
    const resolvedAny = resolved as any;

    switch (resolved.type) {
      case 'string':
        if (resolvedAny.enum) { break; }
        return STRING;
      case 'number':
      case 'integer':
        return NUMBER;
      case 'boolean':
        return BOOLEAN;
      case 'array':
        return arrayOf(this.mapType({
          schemaLocation: `${resolved.schemaLocation}/items`,
          ...(resolved as any).items
        }));
      case 'object':
        if (resolvedAny.additionalProperties) {
          return mapOf(this.mapType({
            schemaLocation: `${resolved.schemaLocation}/additionalProperties`,
            ...resolvedAny.additionalProperties,
          }));
        }
        if (resolvedAny.patternProperties) {
          const pat1 = Object.keys(resolvedAny.patternProperties)[0];
          return mapOf(this.mapType({
            schemaLocation: `${resolved.schemaLocation}/patternProperties/${pat1}`,
            ...resolvedAny.patternProperties[pat1],
          }));
        }
        break;
    }

    return new UnmappedType(resolved.schemaLocation);
  }

  private findSchema(loc: string): CfnSchema {
    const cfnName = CfnSchema.resourceNameFromSchemaLocation(loc);
    const ret = this.schemas.get(cfnName);
    if (!ret) {
      throw new Error(`Schema not loaded for: ${loc}`);
    }
    return ret;
  }
}