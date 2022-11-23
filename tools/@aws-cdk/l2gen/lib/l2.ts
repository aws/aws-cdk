import { IGeneratable, fileFor } from './generatable';
import { CM2 } from './cm2';
import { IType, existingType } from './type';
import { RESOURCE, CONSTRUCT, STRING } from './well-known-types';
import { IValue, ObjectLiteral } from './value';
import { SourceFile } from './source-module';

export class L2 implements IGeneratable {
  public static define(className: string, cb: (x: L2) => void) {
    const ret = new L2(className);
    cb(ret);
    return ret;
  }

  private readonly props = new Array<PropertyProps>();
  private readonly l1Props = new ObjectLiteral();

  constructor(public readonly className: string) {
  }

  public addProperty(prop: PropertyProps): IValue {
    this.props.push(prop);
    const ret = new PropertyValue(prop.name, prop.type);
    if (prop.wire) {
      this.wire({ [prop.wire]: ret });
    }
    return ret;
  }

  public wire(props: Record<string, IValue>) {
    this.l1Props.set(props);
  }

  public generateFiles(): CM2[] {
    const genClass = `${this.className}Gen`;
    const l1Type = existingType(`Cfn${this.className}`, new SourceFile('./lib/wafv2.generated'));

    const code = new CM2(fileFor(genClass));
    const propsType = code.typeInThisFile(`${genClass}Props`);

    code.openBlock('export interface ', propsType);
    for (const prop of this.props) {
      code.docBlock([
        prop.summary,
        '',
        prop.details ?? '',
        prop.defaultValue || prop.defaultDescription ?  `@default ${prop.defaultDescription}` : '',
      ]);
      code.line(`readonly ${prop.name}${prop.required ? '' : '?'}: `, prop.type, ';');
    }
    code.closeBlock();

    const allOptional = this.props.every(p => !p.required);

    code.openBlock(`export class ${genClass} extends `, RESOURCE);

    code.openBlock(`constructor(scope: `, CONSTRUCT, ', id: ', STRING, ', props: ', propsType, allOptional ? ' = {}' : '', ')');
    code.line('super(scope, id);');

    code.line('const resource = new ', l1Type, "(this, 'Resource', ", this.l1Props, ');');

    code.closeBlock(); //ctor

    code.closeBlock(); // class

    return [code];
  }
}

export interface PropertyProps {
  readonly name: string;
  readonly type: IType;
  readonly summary: string;
  readonly details?: string;
  readonly required: boolean;
  readonly defaultValue?: string;
  readonly defaultDescription?: string;
  readonly wire?: string;
}

class PropertyValue implements IValue {
  constructor(private readonly propName: string, public readonly type: IType) {
  }

  render(code: CM2): void {
    code.write(`props.${this.propName}`);
  }

  toString(): string {
    return `props.${this.propName}`;
  }
}