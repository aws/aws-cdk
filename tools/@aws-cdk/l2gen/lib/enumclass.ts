import { IType, standardTypeRender, ANY } from './type';
import { IGeneratable, fileFor } from './generatable';
import { CM2, IRenderable } from './cm2';
import { Diagnostic } from './diagnostic';
import { SourceFile } from './source-module';
import { InterfaceField, InterfaceTypeDefinition } from './private/interfacetype';
import { ArgumentOptions, Arguments } from './arguments';
import { IValue, ObjectLiteral, litVal } from './value';
import { toPascalCase } from 'codemaker';
import { WireableProps, maybeWire } from './integrationtype';

export interface EnumClassProps {
  readonly declaredReturnType?: IType;
  readonly typeCheckedReturnType?: IType;
  readonly private?: boolean;
}

export class EnumClass implements IGeneratable, IType {
  public readonly typeRefName: string;
  public readonly definingModule: SourceFile;
  private readonly alternatives = new Array<Alternative>();
  private readonly _summary = new Array<string>();
  private readonly _details = new Array<string>();

  constructor(public readonly className: string, private readonly props: EnumClassProps = {}) {
    this.typeRefName = className;
    this.definingModule = new SourceFile(fileFor(className, props.private ? 'private' : 'public'));
  }

  public summary(summary: string) {
    this._summary.push(summary, '');
  }

  public details(...lines: string[]) {
    this._details.push(...lines);
  }

  public alternative(name: string, build: AlternativeBuilder) {
    const alt = new Alternative(this, name);
    build(alt);
    this.alternatives.push(alt);
    return this;
  }

  generateFiles(): CM2[] {
    const code = new CM2(this.definingModule.fileName);

    code.docBlock([
      ...this._summary,
      ...this._details,
    ]);
    code.openBlock('export abstract class ', this.typeRefName);

    for (const alt of this.alternatives) {
      code.add(alt.factoryMethod(this.props.typeCheckedReturnType));
    }

    code.line('public abstract render(): ', this.props.declaredReturnType ?? ANY, ';');

    code.closeBlock();

    return [code];
  }

  diagnostics(): Diagnostic[] {
    return [];
  }

  render(code: CM2): void {
    return standardTypeRender(this, code);
  }

  public unfold(v: IRenderable): IValue {
    return {
      type: this.props.declaredReturnType ?? ANY,
      render: (code) => {
        code.add(v, '.render()');
      },
      toString: () => v.toString(),
    };

  }

  toString(): string {
    return this.className;
  }
}

export type AlternativeBuilder = (x: Alternative) => void;

export class Alternative {
  private readonly positionalArgs = new Arguments();
  private readonly optionsType: InterfaceTypeDefinition;
  private readonly retVal = new ObjectLiteral();
  private readonly _summary = new Array<string>();
  private readonly _details = new Array<string>();

  constructor(private readonly parent: EnumClass, public readonly name: string) {
    this.optionsType = new InterfaceTypeDefinition(`${toPascalCase(this.name)}Options`, parent.definingModule, {
      automaticallyRender: 'bottom',
    });
  }

  public summary(summary: string) {
    this._summary.push(summary, '');
  }

  public details(...lines: string[]) {
    this._details.push(...lines);
  }


  public positional(arg: PositionalArg): IRenderable {
    this.positionalArgs.arg(arg.name, arg.type, arg);
    return maybeWire(this, arg, litVal(arg.name));
  }

  public option(opt: InterfaceField & WireableProps): IValue {
    const ret = this.optionsType.addInputProperty('options', opt);
    return maybeWire(this, opt, ret);
  }

  public wire(props: Record<string, IRenderable>) {
    this.retVal.set(props);
  }

  public factoryMethod(typeCheckedReturnType?: IType): IRenderable {
    return {
      render: (code: CM2) => {
        const args = this.factoryArguments();
        code.docBlock([
          ...this._summary,
          ...this._details,
          '',
          ...args.docBlockLines()
        ]);
        code.block(['public static ', this.name, '(', args, '): ', this.parent], () => {
          code.block(['return new class extends ', this.parent], () => {
            code.block(['public render(): ', typeCheckedReturnType ?? ANY], () => {
              code.line('return ', this.retVal, ';');
            });
          });
        });
      },
    }
  }

  private factoryArguments() {
    const args = this.positionalArgs.copy();
    if (this.optionsType.hasProps) {
      args.arg('options', this.optionsType, {
        defaultValue: this.optionsType.defaultValue,
        summary: `Options for the ${this.name} method`,
      });
    }
    return args;
  }
}

export interface PositionalArg extends ArgumentOptions, WireableProps {
  readonly name: string;
  readonly type: IType;
}