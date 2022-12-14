import { ITypeMapping, ITypeMappingFactory } from "./mappings";
import { GenerationRoot } from "../root";
import { CfnSchema, UnresolvedType, UnmappedType } from "./schema-parser";
import { IType, STRING, NUMBER, BOOLEAN, arrayOf, mapOf } from "../type";
import { CM2, IRenderable } from "../cm2";
import { ISourceModule } from "../source-module";

export class TypeMapper {
  private readonly mappers = new Map<string, ITypeMapping>();
  private readonly typeCache = new Map<string, IType>();
  private readonly generationRoot = new GenerationRoot();
  private readonly schemas: Map<string, CfnSchema>;

  constructor(schemas: CfnSchema[]) {
    this.schemas = new Map(schemas.map(schema => [schema.cfnResourceName, schema]));
  }

  public lockIn(schemaLocation: string, mapping: ITypeMapping) {
    this.mappers.set(schemaLocation, mapping);
    // Clear the type cache so that all type lookups happen again
    this.typeCache.clear();
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

    const lockedIn = this.typeFromMapper(resolved.schemaLocation);
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

  private typeFromMapper(schemaLocation: string): IType | undefined {
    // - Use a cache so the object identities are stable for the recursion breaker
    //   (during example generation)
    const existing = this.typeCache.get(schemaLocation);
    if (existing) { return existing; }

    const factory = this.mappers.get(schemaLocation);
    if (!factory) { return undefined; }

    const proxy = new ProxyType();
    // Temporarily set a proxy type for when and if the generator needs to look up its own type
    this.typeCache.set(schemaLocation, proxy);
    const generatedType = factory.generate(this.generationRoot, this);
    proxy.setUnderlying(generatedType);
    this.typeCache.set(schemaLocation, generatedType);
    return generatedType;
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

class ProxyType implements IType {
  private _underlying?: IType;

  public setUnderlying(underlying: IType) {
    this._underlying = underlying;
  }

  public get typeRefName(): string {
    return this.real('typeRefName').typeRefName;
  }

  public get definingModule(): ISourceModule | undefined {
    return this.real('definingModule').definingModule;
  }

  public toString(): string {
    return this.real('toString').toString();
  }
  public exampleValue(name: string, multiple?: boolean | undefined): IRenderable {
    return this.real('exampleValue').exampleValue(name, multiple);
  }

  public render(code: CM2): void {
    return this.real('render').render(code);
  }

  private real(action: string): IType {
    if (!this._underlying) {
      throw new Error('Real type not set yet while reading: ' + action);
    }
    return this._underlying;
  }
}
