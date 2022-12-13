import { IType } from "../type";
import { GenerationRoot } from "../root";
import { TypeMapper } from "./type-mappings";

export interface ITypeMappingFactory {
  readonly schemaLocation: string;
  readonly mapperId: string;
  readonly description: string;
  readonly configuration: Record<string, MappingParameter>;

  validateConfiguration(): void;
  lockInConfiguration(): ITypeMapping;
}

export interface ITypeMapping {
  readonly factory: ITypeMappingFactory;
  readonly description: string;
  readonly coveredSchemaLocations: string[];

  generate(root: GenerationRoot, mapper: TypeMapper): IType;
}

export type MappingParameter =
  | { readonly type: 'select'; readonly options: string[]; set(x: string): void; readonly value: string }
  | { readonly type: 'multiselect'; readonly options: string[]; set(x: string[]): void; readonly value: string[]  }
  ;

export class SingleSelect implements Extract<MappingParameter, { type: 'select' }> {
  public readonly type = 'select';
  public readonly options: string[];
  public value: string;

  constructor(options: string[]) {
    this.value = options[0];
    this.options = [...options];
  }

  public set(x: string): void {
    if (this.options.includes(x)) {
      this.value = x;
    } else {
      this.value = this.options[0];
    }
  }

  public setOptions(options: string[]) {
    this.options.splice(0, this.options.length, ...options);
    this.set(this.value);
  }
}

export class MultiSelect implements Extract<MappingParameter, { type: 'multiselect' }> {
  public readonly type = 'multiselect';
  public readonly options: string[];

  public value: string[];

  constructor(options: string[]) {
    this.value = [];
    this.options = [...options];
  }

  public set(xs: string[]): void {
    this.value = xs.filter(x => this.options.includes(x));
  }

  public setOptions(options: string[]) {
    this.options.splice(0, this.options.length, ...options);
    this.set(this.value);
  }
}