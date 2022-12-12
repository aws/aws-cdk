import { ITypeMapping } from "./mappings";
import { GenerationRoot } from "../root";
import { CfnSchema, UnresolvedType, UnmappedType } from "./schema-parser";
import { IType, STRING, NUMBER, BOOLEAN } from "../type";
import { CM2 } from "../cm2";

export class TypeMapper {
  private readonly mappers = new Map<string, ITypeMapping>();
  private readonly generationRoot = new GenerationRoot();
  private readonly schemas: Map<string, CfnSchema>;

  constructor(schemas: CfnSchema[]) {
    this.schemas = new Map(schemas.map(schema => [schema.cfnResourceName, schema]));
  }

  public generateExample(typeMapping: ITypeMapping): string {
    return CM2.renderSingle('example.ts', typeMapping.generate(this.generationRoot, this).exampleValue('example'));
  }

  public mapType(schemaType: UnresolvedType): IType {
    const lockedIn = this.mappers.get(schemaType.schemaLocation)?.generate(this.generationRoot, this);
    if (lockedIn) { return lockedIn; }

    // Resolve in the same parser
    const resolved = this.findSchema(schemaType.schemaLocation).resolveType(schemaType);

    switch (resolved.type) {
      case 'string': return STRING;
      case 'number':
      case 'integer':
        return NUMBER;
      case 'boolean': return BOOLEAN;
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