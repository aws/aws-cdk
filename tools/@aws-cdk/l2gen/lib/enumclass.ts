import { IType, standardTypeRender } from './type';
import { IGeneratable, fileFor } from './generatable';
import { CM2, IRenderable } from './cm2';
import { Diagnostic } from './diagnostic';
import { SourceFile } from './source-module';
import { InterfaceProperty, InterfaceTypeDefinition } from './private/interfacetype';
import { ANY } from './well-known-types';
import { ArgumentOptions, Arguments } from './arguments';
import { IValue, ObjectLiteral } from './value';
import { literalValue } from './well-known-values';
import { toPascalCase } from 'codemaker';

export interface EnumClassProps {
  readonly declaredReturnType?: IType;
  readonly typeCheckedReturnType?: IType;
}

export class EnumClass implements IGeneratable, IType {
  public readonly typeRefName: string;
  public readonly definingModule: SourceFile;
  private readonly alternatives = new Array<Alternative>();

  constructor(public readonly className: string, private readonly props: EnumClassProps = {}) {
    this.typeRefName = className;
    this.definingModule = new SourceFile(fileFor(className));
  }

  public alternative(name: string, build: AlternativeBuilder) {
    const alt = new Alternative(this, name);
    build(alt);
    this.alternatives.push(alt);
    return this;
  }

  generateFiles(): CM2[] {
    const code = new CM2(this.definingModule.fileName);

    // FIXME: DocBlock
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

  public unfold(v: IValue): IValue {
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

  constructor(private readonly parent: EnumClass, public readonly name: string) {
    this.optionsType = new InterfaceTypeDefinition({
      typeName: `${toPascalCase(this.name)}Options`,
      sourceFile: parent.definingModule,
    });
  }

  public positional(name: string, type: IType, options: ArgumentOptions = {}): IValue {
    this.positionalArgs.arg(name, type, options);
    return literalValue(name);
  }

  public option(opt: InterfaceProperty): IValue {
    return this.optionsType.addInputProperty('options', opt);
  }

  public wire(props: Record<string, IValue>) {
    this.retVal.set(props);
  }

  public factoryMethod(typeCheckedReturnType?: IType): IRenderable {
    return {
      render: (code: CM2) => {
        const args = this.positionalArgs.copy();

        if (this.optionsType.hasProps) {
          code.addHelper(this.optionsType.toHelper('bottom'));
          args.arg('options', this.optionsType.typeReference, { defaultValue: this.optionsType.defaultValue });
        }

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

}
