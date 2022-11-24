import { IRenderable, CM2 } from './cm2';
import { IType } from './type';
import { IValue } from './value';

export class Arguments implements IRenderable {
  private readonly args = new Array<Argument>();

  public arg(name: string, type: IType, options: ArgumentOptions = {}) {
    if (options.defaultValue && options.required === true) {
      throw new Error('Cannot pass defaultValue when required=true');
    }

    this.args.push({
      name,
      type,
      required: options.required || options.defaultValue === undefined,
      defaultValue: options.defaultValue,
     });
    return this;
  }

  public render(code: CM2): void {
    let first = true;
    for (const arg of this.args) {
      if (!first) { code.add(', '); }
      first = false;

      code.add(arg.name, !arg.required && !arg.defaultValue ? '?' : '', ': ', arg.type);
      if (arg.defaultValue) {
        code.add(' = ', arg.defaultValue);
      }
    }
  }

  public copy() {
    const ret = new Arguments();
    ret.args.push(...this.args);
    return ret;
  }
}

export interface ArgumentOptions {
  readonly required?: boolean;
  readonly defaultValue?: IValue;
}

interface Argument {
  readonly name: string;
  readonly type: IType;
  readonly required: boolean;
  readonly defaultValue?: IValue;
}
