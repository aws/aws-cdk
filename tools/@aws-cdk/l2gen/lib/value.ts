import { IType } from './type';
import { CM2, IRenderable } from './cm2';
import { ANY } from './well-known-types';

export interface IValue extends IRenderable {
  readonly type: IType;
  toString(): string;
}

export class ObjectLiteral implements IValue {
  private readonly fields = new Map<string, IValue>();

  constructor(public readonly type: IType = ANY) {
  }

  public set1(key: string, value: IValue) {
    if (this.fields.has(key)) {
      throw new Error(`Already has a value: ${key}`);
    }

    this.fields.set(key, value);
  }

  public set(fields: Record<string, IValue>) {
    for (const [key, value] of Object.entries(fields)) {
      this.set1(key as any, value as any);
    }
  }

  public has(field: string) {
    return this.fields.has(field);
  }

  public toString(): string {
    return '{...object...}';
  }

  public render(code: CM2): void {
    code.indent('  ');
    code.write('{\n');
    for (const [k, v] of this.fields.entries()) {
      code.add(k as string, `: `, v, ',\n');
    }
    code.unindent();
    code.write('}');
  }
}

export function objLit(xs: Record<string, IValue>): ObjectLiteral {
  const x = new ObjectLiteral();
  x.set(xs);
  return x;
}