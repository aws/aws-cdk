import { ISourceModule } from './source-module';
import { IRenderable, CM2, SymbolImport } from './cm2';

export interface IType extends IRenderable {
  readonly typeRefName: string;
  readonly definingModule: ISourceModule | undefined;
  toString(): string;
}

export function existingType(typeRefName: string, definingModule: ISourceModule): StandardType {
  return new StandardType(typeRefName, definingModule);
}

export function builtinType(typeRefName: string): StandardType {
  return new StandardType(typeRefName, undefined);
}

export function arrayOf(type: IType): IType {
  return {
    definingModule: type.definingModule,
    typeRefName: `Array<${type.typeRefName}>`,
    render(code: CM2) {
      code.add('Array<', type, '>');
    },
    toString() {
      return this.typeRefName;
    },
  };
}

export class StandardType implements IType {
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

export const STRING = builtinType('string');
export const NUMBER = builtinType('number');
export const BOOLEAN = builtinType('boolean');
export const ANY = builtinType('any');
export const VOID = builtinType('void');