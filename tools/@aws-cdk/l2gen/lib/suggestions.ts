import { SchemaParser, nameFromType, ResolvedType } from "./schema-parser";
import { GenerationRoot } from "./root";
import { CM2 } from "./cm2";

export class Suggestions {
  constructor(private readonly parser: SchemaParser) {
  }

  public findTypeMappings() {
    return this.parser.definitions().flatMap(def => [
      ...this.tryEnumClass(def),
    ]);
  }

  private tryEnumClass(def: ResolvedType): MappableType[] {
    try {
      const root = new GenerationRoot();
      const enumClass = this.parser.deriveEnumClass(root, nameFromType(def));

      return [
        {
          schemaLocation: def.schemaLocation,
          suggestions: [
            {
              description: 'Enum-like class (from enum discriminator)',
              example: CM2.renderSingle('example.ts', enumClass.allExampleValues()),
            }
          ],
        }
      ];
    } catch(e) {
      // Okay then
      console.error(e);
    }
    return [];
  }
}

export interface MappableType {
  readonly schemaLocation: string;
  readonly suggestions: MappingSuggestion[];
}

export interface MappingSuggestion {
  readonly description: string;
  readonly example: string;
}