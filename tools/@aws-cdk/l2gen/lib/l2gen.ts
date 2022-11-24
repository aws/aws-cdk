import { IGeneratable, fileFor } from './generatable';
import { toPascalCase } from 'codemaker';
import { CM2 } from './cm2';
import { RESOURCE, CONSTRUCT, STRING } from './well-known-types';
import { IValue, ObjectLiteral } from './value';
import { SourceFile } from './source-module';
import { l1PropertyName, genTypeForProperty, l1ResourceType, resourceProperties } from './private/cfn2ts-conventions';
import { Diagnostic } from './diagnostic';
import { InterfaceTypeDefinition, InterfaceProperty } from './private/interfacetype';
import { Arguments } from './arguments';
import { IType } from './type';

export class L2Gen implements IGeneratable {
  /**
   * Return a reference to the L1 type for the given property
   */
  public static genTypeForProperty(typeName: string, ...propertyPath: string[]): IType {
    return genTypeForProperty(typeName, ...propertyPath);
  }

  public static define(typeName: string, cb: (x: L2Gen) => void) {
    const ret = new L2Gen(typeName);
    cb(ret);
    return ret;
  }

  private readonly props: InterfaceTypeDefinition;
  private readonly l1Props = new ObjectLiteral();
  private readonly genClassName: string;
  private readonly sourceFile: SourceFile;

  constructor(public readonly cloudFormationResourceType: string) {
    const resourceName = cloudFormationResourceType.split('::')[2];
    const className = toPascalCase(resourceName);

    this.genClassName = `${className}Gen`;
    this.sourceFile = new SourceFile(fileFor(this.genClassName));

    this.props = new InterfaceTypeDefinition({
      typeName: `${this.genClassName}Props`,
      sourceFile: this.sourceFile,
    });
  }

  public addProperty(prop: PropertyProps): IValue {
    const ret = this.props.addInputProperty('props', prop);
    if (prop.wire) {
      this.wire({ [prop.wire]: ret });
    }
    return ret;
  }

  public wire(props: Record<string, IValue>) {
    this.l1Props.set(props);
  }

  public generateFiles(): CM2[] {
    const l1Type = l1ResourceType(this.cloudFormationResourceType);

    const code = new CM2(this.sourceFile.fileName);
    const propsType = code.typeInThisFile(`${this.genClassName}Props`);

    code.add(this.props);

    code.openBlock(`export class ${this.genClassName} extends `, RESOURCE);

    code.openBlock(
      'constructor(',
      new Arguments()
        .arg('scope', CONSTRUCT)
        .arg('id', STRING)
        .arg('props', propsType, { defaultValue: this.props.defaultValue }),
      ')');

    code.line('super(scope, id);');

    code.line('const resource = new ', l1Type, "(this, 'Resource', ", this.l1Props, ');');

    code.closeBlock(); //ctor

    code.closeBlock(); // class

    return [code];
  }

  public diagnostics() {
    return [
      ...this.uncoveredPropDiagnostics(),
    ];
  }

  private* uncoveredPropDiagnostics() {
    for (const [name, definition] of resourceProperties(this.cloudFormationResourceType)) {
      const l1Name = l1PropertyName(name);
      if (!this.l1Props.has(l1Name)) {
        yield {
          type: 'uncovered-property',
          cat: definition.Required ? 'error' : 'warning',
          message: `Property ${l1Name}: not wired`,
          property: l1Name,
        } as Diagnostic;
      }
    }
  }
}

export interface PropertyProps extends InterfaceProperty {
  readonly wire?: string;
}
