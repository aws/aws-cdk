import { IRenderable, CM2, HelperPosition, RenderableHelper } from '../cm2';
import { IType, standardTypeRender } from '../type';
import { SourceFile } from '../source-module';
import { IValue, litVal } from '../value';

export interface InterfaceTypeDefinitionProps {
  readonly properties?: InterfaceField[];

  /**
   * Renders the type only if its used
   */
  readonly automaticallyRender?: HelperPosition;

  readonly baseInterface?: InterfaceTypeDefinition;

  readonly baseType?: IType;
}

export class InterfaceTypeDefinition implements IType {
  private readonly ifProps = new Array<InterfaceField>();
  public readonly declaration: IRenderable;

  constructor(private readonly typeName: string, public readonly sourceFile: SourceFile, private readonly props: InterfaceTypeDefinitionProps = {}) {
    this.addProperty(...props.properties ?? []);

    if (props.baseInterface && props.baseType) {
      throw new Error('Cannot supply baseInterface and baseType at the same time');
    }

    const baseType = props.baseType ?? props.baseInterface;

    this.declaration = {
      render: (code: CM2) => {
        code.openBlock('export interface ', this.typeName, ...baseType ? [' extends ', baseType] : []);
        for (const prop of this.ifProps) {
          code.docBlock([
            prop.summary,
            '',
            // FIXME: dedent
            prop.details ?? '',
            prop.defaultValue || prop.defaultDescription ?  `@default ${prop.defaultValue ?? '-' } ${prop.defaultDescription}` : '',
          ]);
          code.line(`readonly ${prop.name}${prop.required ? '' : '?'}: `, prop.type, ';');
        }
        code.closeBlock();
      }
    };
  }

  public get definingModule() {
    return this.sourceFile;
  }

  public get typeRefName() {
    return this.typeName;
  }

  public render(code: CM2) {
    if (this.props.automaticallyRender && code.currentModule.equals(this.sourceFile)) {
      code.addHelper(new RenderableHelper(this.typeName, this.props.automaticallyRender, this.declaration));
    }
    return standardTypeRender(this, code);
  }

  public toString(): string {
    return this.typeName;
  }

  public addProperty(...props: InterfaceField[]) {
    this.ifProps.push(...props);
  }

  public addInputProperty(propsVariable: string, prop: InterfaceField): IValue {
    if (!prop.required && !(prop.defaultValue || prop.defaultDescription)) {
      throw new Error('defaultValue or defaultDescription is required when required=false');
    }
    if (prop.required && (prop.defaultValue || prop.defaultDescription)) {
      throw new Error('defaultValue or defaultDescription may not be supplied when required=true');
    }

    this.addProperty(prop);

    return new PropertyValue(propsVariable, prop.name, prop.type, prop.defaultValue);
  }

  public get allPropertiesOptional(): boolean {
    return this.ifProps.every(p => !p.required) && (!this.props.baseInterface || this.props.baseInterface.allPropertiesOptional);
  }

  public get hasProps() {
    return this.ifProps.length > 0;
  }

  public get defaultValue() {
    return this.allPropertiesOptional ? litVal('{}', this) : undefined;
  }

  public toHelper(position: HelperPosition) {
    return new RenderableHelper(this.typeName, position, this.declaration);
  }

  /**
   * Return a code file just for this type
   */
  public toCM2() {
    const code = new CM2(this.sourceFile);
    code.add(this.declaration);
    return code;
  }
}

export interface InterfaceField {
  readonly name: string;
  readonly type: IType;
  readonly summary: string;
  readonly details?: string;
  readonly required: boolean;
  readonly defaultValue?: IRenderable;
  readonly defaultDescription?: string;
}

class PropertyValue implements IRenderable {
  constructor(private readonly propsVariable: string, private readonly propName: string, public readonly type: IType, private readonly defaultValue?: IRenderable) {
  }

  render(code: CM2): void {
    if (this.defaultValue) {
      code.add(`(${this.propsVariable}.${this.propName} ?? `, this.defaultValue, ')');
    } else {
      code.add(`${this.propsVariable}.${this.propName}`);
    }
  }

  toString(): string {
    return `${this.propsVariable}.${this.propName}`;
  }
}