import { sortKeyComparator } from '../private/sorting';
import { CfnSchema } from './schema-parser';
import { ITypeMappingFactory } from './mappings';
import { EnumClassMappingFactory } from './enumclass-mapping';
import { EnumMappingFactory } from './enum-mapping';
import { L2GenMappingFactory } from './l2gen-mapping';

export class Suggestions {
  private readonly schemas: CfnSchema[];

  constructor(...schemas: CfnSchema[]) {
    this.schemas = schemas;
  }

  public findTypeMappings() {
    return this.schemas.flatMap(schema => schema.definitions().map(type => ({
      id: type.schemaLocation,
      possibleMappings: [
        ...L2GenMappingFactory.try(schema, type),
        ...EnumClassMappingFactory.try(schema, type),
        ...EnumMappingFactory.try(schema, type),
      ],
    } as MappableType))).sort(sortKeyComparator(sortMappableTypes));
  }
}

export interface MappableType {
  readonly id: string;
  readonly possibleMappings: ITypeMappingFactory<any>[];
}

function sortMappableTypes(x: MappableType) {
  return [
    -x.possibleMappings.length,
    x.id.includes('#') ? 1 : 0, // Resources types to the front
    x.id,
  ];
}
