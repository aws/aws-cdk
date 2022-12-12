import type { GenerationRoot } from '../root';
import { ITypeMapping, ITypeMappingFactory } from './mappings';
import { SchemaEnum, CfnSchema, ResolvedType } from './schema-parser';
import { Enum } from '../gen';
import { IType } from '../type';

export class EnumMappingFactory implements ITypeMappingFactory<never> {
  public static try(schema: CfnSchema, type: ResolvedType): EnumMappingFactory[] {
    const enumType = schema.parseSchemaEnum(type);
    if (!enumType) { return []; }

    return [new EnumMappingFactory(type, enumType)];
  }

  public readonly mapperId = `${this.type.schemaLocation}.EnumType`;
  public readonly description: string = `Enum type`;
  public readonly configuration = {};

  constructor(private readonly type: ResolvedType, private readonly enumType: SchemaEnum) {
  }

  public validateConfiguration() {
  }

  public lockInConfiguration(): ITypeMapping {
    return new EnumMapping(this.type, this.enumType);
  }
}

/**
 * Turn a property bag with one enum in it into an enumclass
 */
export class EnumMapping implements ITypeMapping {
  public readonly description: string = `Enum type`;
  public readonly id: string = `${this.type.schemaLocation}.Enum`;
  public readonly coveredSchemaLocations: string[] = [this.type.schemaLocation];

  constructor(private readonly type: ResolvedType, private readonly enumType: SchemaEnum) {
  }

  public generate(root: GenerationRoot): IType {
    const enm = new Enum(root, this.enumType.name);

    for (const mem of this.enumType.members) {
      enm.addMember({
        name: mem,
        summary: '',
        cloudFormationString: mem,
      });
    }

    return enm;
  }
}