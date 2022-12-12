import { IGeneratable, fileFor } from '../generatable';
import { IType, standardTypeRender, STRING } from '../type';
import { CM2, SymbolImport, IRenderable, renderable } from '../cm2';
import { IValue } from '../value';
import { SourceFile } from '../source-module';
import { Diagnostic } from '../diagnostic';
import { toCamelCase } from '../private/camel';
import { jsVal } from '../well-known-values';
import { GenerationRoot } from '../root';

export class Enum implements IGeneratable, IType {
  public readonly typeRefName: string;
  public readonly definingModule: SourceFile;
  public readonly schemaRefs = new Array<string>();
  private readonly members = new Array<MemberProps>();
  private readonly mappings = new Array<EnumMapping>();
  private readonly docs = new Array<string>();
  private cloudFormationMapping?: EnumMapping;

  constructor(root: GenerationRoot, public readonly enumName: string) {
    this.typeRefName = enumName;
    this.definingModule = new SourceFile(fileFor(this.typeRefName, 'public'));
    root.add(this);
  }

  toString(): string {
    return `${this.typeRefName}`;
  }

  public exampleValue(): IRenderable {
    if (this.members.length > 0) {
      return renderable([this.typeRefName, '.', this.members[0].name]);
    }
    return renderable(['<NONE>']);
  }

  public schemaRef(x: string) {
    this.schemaRefs.push(x);
  }

  public doc(...xs: string[]) {
    this.docs.push(...xs);
  }

  public define(cb: (x: Enum) => void) {
    cb(this);
    return this;
  }

  public addMember(props: MemberProps): IValue {
    if (this.members.length && !!this.members[0].cloudFormationString !== !!props.cloudFormationString) {
      throw new Error('Either all enum members must have a cloudFormationString, or none of them should');
    }

    this.members.push(props);
    const value = {
      type: this,
      toString: () => {
        return `${this.typeRefName}.${props.name}`;
      },
      render: (code: CM2) => {
        code.add(this, '.', props.name);
      }
    };

    if (props.cloudFormationString) {
      if (!this.cloudFormationMapping) {
        this.cloudFormationMapping = new EnumMapping(toCamelCase(`${this.enumName}ToCloudFormation`));
        this.mappings.push(this.cloudFormationMapping);
      }
      this.cloudFormationMapping.addMapping(value, jsVal(props.cloudFormationString));
    }

    return value;
  }

  public toCloudFormation(value: IValue) {
    if (!this.cloudFormationMapping?.hasValues) {
      throw new Error('No CloudFormation mappings defined');
    }

    return this.cloudFormationMapping.map(value);
  }

  generateFiles(): CM2[] {
    const code = new CM2(this.definingModule.fileName);
    code.docBlock(this.docs);
    code.openBlock(`export enum ${this.enumName}`);
    for (const mem of this.members) {
      code.docBlock([
        mem.summary,
        '',
        mem.details ?? '',
      ]);
      code.line(`${mem.name} = \'${this.enumName}.${mem.name}\',`);
    }
    code.closeBlock();

    return [code, ...this.mappings.flatMap(m => m.generateFiles())];
  }

  public render(code: CM2): void {
    return standardTypeRender(this, code);
  }

  public diagnostics() {
    return [];
  }
}

export interface MemberProps {
  readonly name: string;
  readonly summary: string;
  readonly details?: string;
  readonly cloudFormationString?: string;
}


export class EnumMapping implements IGeneratable {
  private readonly sourceFile: SourceFile;
  private readonly mapping = new Array<[IValue, IValue]>();
  private fromType?: IType;
  private toType?: IType;

  constructor(private readonly functionName: string) {
    this.sourceFile = new SourceFile(fileFor(this.functionName, 'private'));
  }

  public get hasValues() {
    return this.mapping.length > 0;
  }

  public addMapping(from: IValue, to: IValue) {
    if (this.fromType && from.type !== this.fromType) { throw new Error(`Mapping: all fromTypes must be the same`); }
    if (this.toType && to.type !== this.toType) { throw new Error(`Mapping: all toTypes must be the same`); }
    this.fromType = from.type;
    this.toType = to.type;

    this.mapping.push([from, to]);
  }

  public diagnostics(): Diagnostic[] {
    return [];
  }

  public generateFiles(): CM2[] {
    if (!this.fromType || !this.toType) { return []; }

    const code = new CM2(this.sourceFile);

    code.block(['export function ', this.functionName, '(x: ', this.fromType, '): ', this.toType], () => {
      code.block('switch (x)', () => {
        for (const [enumMember, str] of this.mapping) {
          code.line('case ', enumMember, ': return ', str, ';');
        }
      });
    });

    return [code];
  }

  public map(value: IValue): IValue {
    return {
      type: STRING,
      toString: () => `${this.functionName}(${value})`,
      render: (code: CM2) => {
        code.addHelper(new SymbolImport(this.functionName, this.sourceFile));
        code.add(this.functionName, '(', value, ')');
      },
    };
  }

}
