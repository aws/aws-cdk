import { IGeneratable, fileFor } from './generatable';
import { IType, standardTypeRender } from './type';
import { CM2 } from './cm2';
import { IValue } from './value';
import { ISourceModule, SourceFile } from './source-module';

export class Enum implements IGeneratable, IType {
  public readonly typeRefName: string;
  public readonly definingModule: ISourceModule;
  private readonly members = new Array<MemberProps>();

  constructor(public readonly enumName: string) {
    this.typeRefName = enumName;
    this.definingModule = new SourceFile(fileFor(this.typeRefName));
  }

  public addMember(props: MemberProps): IValue {
    this.members.push(props);
    return {
      type: this,
      toString: () => {
        return `${this.typeRefName}.${props.name}`;
      },
      render: (code: CM2) => {
        code.add(this, '.', props.name);
      }
    };
  }

  generateFiles(): CM2[] {
    const code = new CM2(fileFor(this.enumName));
    code.openBlock(`export enum ${this.enumName}`);
    for (const mem of this.members) {
      code.docBlock([
        mem.summary,
        '',
        mem.details ?? '',
      ]);
      code.line(`${mem.name},`);
    }
    code.closeBlock();

    return [code];
  }

  public render(code: CM2): void {
    return standardTypeRender(this, code);
  }
}

export interface MemberProps {
  readonly name: string;
  readonly summary: string;
  readonly details?: string;
}