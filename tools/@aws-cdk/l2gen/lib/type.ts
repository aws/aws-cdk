import { ISourceModule } from './source-module';
import { IRenderable, CM2, SymbolImport } from './cm2';

export interface IType extends IRenderable {
  readonly typeRefName: string;
  readonly definingModule: ISourceModule | undefined;
  toString(): string;
}

export function existingType(typeRefName: string, definingModule: ISourceModule): IType {
  return new Type(typeRefName, definingModule);
}

export function ambientType(typeRefName: string): IType {
  return new Type(typeRefName, undefined);
}

class Type implements IType {
  constructor(
    public readonly typeRefName: string,
    public readonly definingModule: ISourceModule | undefined) { }

  public render(code: CM2): void {
    return standardTypeRender(this, code);
  }

  public toString() {
    return this.typeRefName;
  }
}

/**
 * FIXME: Needs to be factored differently, me no likey
 */
export function standardTypeRender(type: IType, code: CM2) {
  if (type.definingModule && !type.definingModule.equals(code.currentModule)) {
    code.addHelper(new SymbolImport(type.typeRefName, type.definingModule));
  }

  code.write(type.typeRefName);
}
