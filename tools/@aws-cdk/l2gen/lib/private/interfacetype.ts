import { IRenderable, CM2, HelperPosition, RenderableHelper } from '../cm2';
import { IType, existingType } from '../type';
import { SourceFile } from '../source-module';
import { IValue } from '../value';
import { literalValue } from '../well-known-values';

export interface InterfaceTypeDefinitionProps {
  readonly typeName: string;
  readonly sourceFile: SourceFile;
  readonly properties?: InterfaceProperty[];
}

export class InterfaceTypeDefinition implements IRenderable {
  public readonly typeReference: IType;
  private readonly ifProps = new Array<InterfaceProperty>();

  constructor(private readonly props: InterfaceTypeDefinitionProps) {
    this.addProperty(...props.properties ?? []);

    this.typeReference = existingType(props.typeName, props.sourceFile);
  }

  public render(code: CM2): void {
    code.openBlock('export interface ', this.props.typeName);
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

  public toString(): string {
    return this.props.typeName;
  }

  public addProperty(...props: InterfaceProperty[]) {
    this.ifProps.push(...props);
  }

  public addInputProperty(propsVariable: string, prop: InterfaceProperty): IValue {
    if (!prop.required && !(prop.defaultValue || prop.defaultDescription)) {
      throw new Error('defaultValue or defaultDescription is required when required=false');
    }
    if (prop.required && (prop.defaultValue || prop.defaultDescription)) {
      throw new Error('defaultValue or defaultDescription may not be supplied when required=true');
    }

    this.addProperty(prop);

    return new PropertyValue(propsVariable, prop.name, prop.type, prop.defaultValue);
  }

  public get allPropertiesOptional() {
    return this.ifProps.every(p => !p.required);
  }

  public get hasProps() {
    return this.ifProps.length > 0;
  }

  public get defaultValue() {
    return this.allPropertiesOptional ? literalValue('{}', this.typeReference) : undefined;
  }

  public toHelper(position: HelperPosition) {
    return new RenderableHelper(this.props.typeName, position, this);
  }
}

export interface InterfaceProperty {
  readonly name: string;
  readonly type: IType;
  readonly summary: string;
  readonly details?: string;
  readonly required: boolean;
  readonly defaultValue?: IValue;
  readonly defaultDescription?: string;
}

class PropertyValue implements IValue {
  constructor(private readonly propsVariable: string, private readonly propName: string, public readonly type: IType, private readonly defaultValue?: IValue) {
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