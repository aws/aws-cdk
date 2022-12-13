import { IType, standardTypeRender } from '../type';
import { IGeneratable, fileFor } from '../generatable';
import { CM2, IRenderable } from '../cm2';
import { Diagnostic } from '../diagnostic';
import { SourceFile } from '../source-module';
import { InterfaceField, InterfaceTypeDefinition } from '../private/interfacetype';
import { IValue } from '../value';
import { GenerationRoot } from '../root';

export class StructType implements IGeneratable, IType {
  public readonly typeRefName: string;
  public readonly definingModule: SourceFile;
  public readonly theType: InterfaceTypeDefinition;

  constructor(root: GenerationRoot, public readonly className: string) {
    root.add(this);
    this.typeRefName = className;
    this.definingModule = new SourceFile(fileFor(className, 'public'));
    this.theType = new InterfaceTypeDefinition(className, this.definingModule);
  }

  public addInputProperty(opt: InterfaceField): IValue {
    return this.theType.addInputProperty('options', opt);
  }

  generateFiles(): CM2[] {
    return [
      ...this.generateThis(),
    ];
  }

  private generateThis(): CM2[] {
    const code = new CM2(this.definingModule.fileName);
    code.add(this.theType.declaration);
    return [code];
  }

  diagnostics(): Diagnostic[] {
    return [];
  }

  render(code: CM2): void {
    return standardTypeRender(this, code);
  }

  toString(): string {
    return this.className;
  }

  public exampleValue(): IRenderable {
    return this.theType.exampleValue();
  }
}


