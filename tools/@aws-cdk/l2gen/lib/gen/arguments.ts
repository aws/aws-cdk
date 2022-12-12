import { IRenderable, CM2, CodePart, interleave } from '../cm2';
import { IType } from '../type';

export class Arguments implements IRenderable {
  public readonly args = new Array<Argument>();

  public arg(name: string, type: IType, options: ArgumentOptions = {}) {
    if (options.defaultValue && options.required === true) {
      throw new Error('Cannot pass defaultValue when required=true');
    }

    this.args.push({
      name,
      type,
      required: options.required || options.defaultValue === undefined,
      defaultValue: options.defaultValue,
      summary: options.summary,
     });
    return this;
  }

  public render(code: CM2): void {
    code.add(...interleave(', ', this.args.map(arg => {
      const ret: CodePart[] = [arg.name, !arg.required && !arg.defaultValue ? '?' : '', ': ', arg.type];
      if (arg.defaultValue) {
        ret.push(' = ', arg.defaultValue);
      }
      return ret;
    })));
  }

  public docBlockLines(): string[] {
    return this.args.filter(a => a.summary).map(a => `@param {${a.type}} ${a.name} ${a.summary}`);
  }

  public copy() {
    const ret = new Arguments();
    ret.args.push(...this.args);
    return ret;
  }

  public exampleValues() {
    return this.args.map(arg => arg.type.exampleValue(arg.name));
  }

  public exampleValuesCommaSeparated() {
    return interleave(', ', this.exampleValues());
  }
}

export interface ArgumentOptions {
  readonly required?: boolean;
  readonly defaultValue?: IRenderable;
  readonly summary?: string;
}

export interface Argument {
  readonly name: string;
  readonly type: IType;
  readonly required: boolean;
  readonly defaultValue?: IRenderable;
  readonly summary?: string;
}
