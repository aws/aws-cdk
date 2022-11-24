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
    // If the referenced type is a compound type, only import the top level
    const parts = type.typeRefName.split('.');

    code.addHelper(new SymbolImport(parts[0], type.definingModule));
  }

  code.write(type.typeRefName);
}
