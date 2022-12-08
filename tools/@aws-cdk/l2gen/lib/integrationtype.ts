import { IType, standardTypeRender, VOID } from './type';
import { IGeneratable, fileFor } from './generatable';
import { CM2, IRenderable, renderable } from './cm2';
import { Diagnostic } from './diagnostic';
import { SourceFile } from './source-module';
import { InterfaceField, InterfaceTypeDefinition } from './private/interfacetype';
import { CONSTRUCT } from './well-known-types';
import { ArgumentOptions, Arguments } from './arguments';
import { IValue, ObjectLiteral, litVal } from './value';
import { toPascalCase } from './private/camel';
import { GenerationRoot } from './root';

export class IntegrationType implements IGeneratable, IType {
  public readonly typeRefName: string;
  public readonly definingModule: SourceFile;
  public readonly bindOptionsType: InterfaceTypeDefinition;
  public readonly bindResultType: InterfaceTypeDefinition;
  private readonly integrations = new Array<Integration>();

  constructor(root: GenerationRoot, public readonly className: string) {
    root.add(this);
    this.typeRefName = className;
    this.definingModule = new SourceFile(fileFor(className, 'public'));
    this.bindOptionsType = new InterfaceTypeDefinition(`${className}BindOptions`, this.definingModule, {
      automaticallyRender: 'bottom',
    });

    this.bindResultType = new InterfaceTypeDefinition(`${className}BindResult`, this.definingModule, {
      automaticallyRender: 'bottom',
    });
  }

  public integration(name: string, build: IntegrationBuilder) {
    const alt = new Integration(this, name);
    build(alt);
    this.integrations.push(alt);
    return this;
  }

  public bindOption(opt: InterfaceField): IValue {
    return this.bindOptionsType.addInputProperty('options', opt);
  }

  public bindResult(opt: InterfaceField) {
    this.bindResultType.addProperty(opt);
  }

  generateFiles(): CM2[] {
    return [
      ...this.generateThis(),
      ...this.integrations.flatMap(i => i.generateFiles()),
    ];
  }

  private generateThis(): CM2[] {
    const code = new CM2(this.definingModule.fileName);

    // FIXME: DocBlock
    code.openBlock('export abstract class ', this.typeRefName);

    code.line('public abstract bind(', this.bindArguments(), '): ', this.bindReturnType(), ';');

    code.closeBlock();

    return [code];
  }

  public bindArguments() {
    const args = new Arguments().arg('scope', CONSTRUCT);
    if (this.bindOptionsType.hasProps) {
      args.arg('options', this.bindOptionsType, { defaultValue: this.bindOptionsType.defaultValue });
    }
    return args;
  }

  public bindReturnType() {
    return this.bindResultType.hasProps ? this.bindResultType : VOID;
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
    if (this.integrations.length > 0) {
      return this.integrations[0].exampleUsage();
    }
    return renderable(['<NONE>']);
  }
}

export type IntegrationBuilder = (x: Integration) => void;

export class Integration implements IGeneratable {
  private readonly positionalArgs = new Arguments();
  private readonly optionsType: InterfaceTypeDefinition;
  private readonly sourceFile: SourceFile;
  private readonly bindResult = new ObjectLiteral();

  constructor(private readonly parent: IntegrationType, public readonly name: string) {
    // FIXME: These should go into an integration package
    this.sourceFile = new SourceFile(fileFor(name, 'public')); // FIXME: Or private?
    this.optionsType = new InterfaceTypeDefinition(`${toPascalCase(this.name)}Options`, parent.definingModule, {
      automaticallyRender: 'top',
    });
  }

  private constructorArguments() {
    const args = this.positionalArgs.copy();
    if (this.optionsType.hasProps) {
      args.arg('options', this.optionsType, { defaultValue: this.optionsType.defaultValue });
    }
    return args;
  }

  public wireBindResult(props: Record<string, IValue>) {
    this.bindResult.set(props);
  }

  public generateFiles(): CM2[] {
    const code = new CM2(this.sourceFile.fileName);

    // FIXME: DocBlock
    code.block(['export class ', this.name, ' extends ', this.parent], () => {
      const ctorArgs = this.constructorArguments();
      for (const arg of ctorArgs.args) {
        code.line('private readonly ', arg.name, !arg.required ? '?' : '', ': ', arg.type, ';');
      }

      code.block(['constructor(', ctorArgs, ')'], () => {
        code.line('super();');

        // FIXME: Validation
        for (const arg of ctorArgs.args) {
          code.line('this.', arg.name, ' = ', arg.name, ';');
        }
      });

      code.block(['public bind(', this.parent.bindArguments(), '): ', this.parent.bindReturnType()], () => {
        code.line('void(scope);');
        // FIXME: Uhm.
        code.line('return ', this.bindResult, ';');
      });
    });

    return [code];
  }

  public exampleUsage() {
    return renderable((code: CM2) => {
      code.add('new ', this.name, '(', ...this.constructorArguments().exampleValuesCommaSeparated(), ')');
    });
  }

  public diagnostics(): Diagnostic[] {
    return [];
  }

  public positional(name: string, type: IType, options: ArgumentOptions = {}): IValue {
    this.positionalArgs.arg(name, type, options);
    return litVal(`this.${name}`);
  }

  public option(opt: InterfaceField): IValue {
    return this.optionsType.addInputProperty('this.options', opt);
  }

}
