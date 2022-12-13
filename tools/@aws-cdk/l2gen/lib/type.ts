import { ISourceModule } from './source-module';
import { IRenderable, CM2, SymbolImport, renderable, renderObjectLiteral } from './cm2';


export type ExampleProducer = (name: string) => IRenderable;

export interface IType extends IRenderable {
  readonly typeRefName: string;
  readonly definingModule: ISourceModule | undefined;
  toString(): string;
  exampleValue(name: string, multiple?: boolean): IRenderable;
}

export function existingType(typeRefName: string, definingModule: ISourceModule, ex: ExampleProducer): StandardType {
  return new StandardType(typeRefName, definingModule, ex);
}

export function builtinType(typeRefName: string, ex: ExampleProducer): StandardType {
  return new StandardType(typeRefName, undefined, ex);
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
    exampleValue(name: string) {
      return RecursionBreaker.doRenderable(this, () =>
        renderable(['[', type.exampleValue(name), ']']));
    }
  };
}

export function mapOf(type: IType): IType {
  return {
    definingModule: type.definingModule,
    typeRefName: `Record<string, ${type.typeRefName}>`,
    render(code: CM2) {
      code.add('Record<string, ', type, '>');
    },
    toString() {
      return this.typeRefName;
    },
    exampleValue(name: string) {
      return RecursionBreaker.doRenderable(this, () =>
        renderable(code => renderObjectLiteral(code, Object.entries({
          key: type.exampleValue(name),
        }))));
    }
  };
}

export class RecursionBreaker {
  public static ELLIPSIS = renderable(['(...recursion...)']);
  private static recSet = new Set<any>();

  public static doRenderable(ctx: any, block: () => IRenderable): IRenderable {
    return RecursionBreaker.do(ctx, block, RecursionBreaker.ELLIPSIS);
  }

  public static do<A>(ctx: any, block: () => A, brk: A): A {
    if (RecursionBreaker.recSet.has(ctx)) {
      return brk;
    }

    RecursionBreaker.recSet.add(ctx);
    try {
      return block();
    } finally {
      RecursionBreaker.recSet.delete(ctx);
    }
  }
}

export class StandardType implements IType {
  constructor(
    public readonly typeRefName: string,
    public readonly definingModule: ISourceModule | undefined,
    public readonly exampleValue: (name: string) => IRenderable) { }

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

export const STRING = builtinType('string', name => renderable([JSON.stringify(name)]));
export const NUMBER = builtinType('number', _ => renderable(['123']));
export const BOOLEAN = builtinType('boolean', _ => renderable(['true']));
export const ANY = builtinType('any', _ => renderable(['...']));
export const VOID = builtinType('void', _ => renderable(['undefined']));