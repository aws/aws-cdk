import { IGeneratable, fileFor } from './generatable';
import { toPascalCase } from 'codemaker';
import { CM2, IRenderable } from './cm2';
import { RESOURCE, CONSTRUCT, factoryFunction, LAZY, IRESOURCE, STACK } from './well-known-types';
import { ObjectLiteral, litVal, IValue } from './value';
import { SourceFile } from './source-module';
import { l1PropertyName, genTypeForProperty, l1ResourceType, resourceProperties, genTypeForPropertyType } from './private/cfn2ts-conventions';
import { Diagnostic } from './diagnostic';
import { InterfaceTypeDefinition, InterfaceField } from './private/interfacetype';
import { Arguments } from './arguments';
import { IType, existingType, STRING } from './type';
import { analyzeArnFormat, formatArnExpression, splitArnExpression } from './private/arns';
import { splitSelect } from './well-known-values';
import { WireableProps, maybeWire } from './integrationtype';

export class L2Gen implements IGeneratable {
  /**
   * Return a reference to the L1 type for the given property
   */
  public static genTypeForProperty(typeName: string, ...propertyPath: string[]): IType {
    return genTypeForProperty(typeName, ...propertyPath);
  }

  public static genTypeForPropertyType(typeName: string, propertyTypeName: string): IType {
    return genTypeForPropertyType(typeName, propertyTypeName);
  }

  public static define(typeName: string, cb: (x: L2Gen) => void) {
    const ret = new L2Gen(typeName);
    cb(ret);
    return ret;
  }

  private readonly props: InterfaceTypeDefinition;
  private readonly baseProps: InterfaceTypeDefinition;
  private readonly interfaceType: InterfaceTypeDefinition;
  private readonly attributesType: InterfaceTypeDefinition;
  private readonly l1Props = new ObjectLiteral();
  private readonly genClassName: string;
  private readonly sourceFile: SourceFile;
  private readonly interfaceProperties = new Array<InterfacePropertyProps>();
  private readonly statics = new Array<IRenderable>();
  private readonly baseClassName: string;

  constructor(public readonly cloudFormationResourceType: string) {
    const resourceName = cloudFormationResourceType.split('::')[2];
    this.baseClassName = toPascalCase(resourceName);

    this.genClassName = `${this.baseClassName}Gen`;
    this.sourceFile = new SourceFile(fileFor(this.genClassName, 'private'));

    this.baseProps = new InterfaceTypeDefinition(`${this.genClassName}PropsBase`, this.sourceFile);
    this.props = new InterfaceTypeDefinition(`${this.genClassName}Props`, this.sourceFile, { baseInterface: this.baseProps });
    this.interfaceType = new InterfaceTypeDefinition(`I${this.baseClassName}`, new SourceFile(fileFor(`I${this.baseClassName}`, 'public')), {
      baseType: IRESOURCE,
    });
    this.attributesType = new InterfaceTypeDefinition(`${this.baseClassName}Attributes`, new SourceFile(fileFor(`I${this.baseClassName}Attributes`, 'public')));
  }

  public addProperty(prop: PropertyProps): IValue {
    const ret = this.baseProps.addInputProperty('props', prop);
    return maybeWire(this, prop, ret);
  }

  public addPrivateProperty(prop: PropertyProps): IValue {
    const ret = this.props.addInputProperty('props', prop);
    return maybeWire(this, prop, ret);
  }

  public addLazyPrivateProperty(prop: PropertyProps): { readonly factory: IRenderable, readonly lazyValue: IRenderable } {
    if (prop.type !== STRING) {
      throw new Error('Not now Iago!');
    }

    const factory = this.props.addInputProperty('props',  {
      name: `${prop.name}Producer`,
      required: prop.required,
      summary: prop.summary,
      details: prop.details,
      defaultDescription: prop.defaultDescription,
      type: factoryFunction(prop.type),
    });

    const producer = litVal([LAZY, '.string({ produce: ', factory, ' })'], prop.type);
    const lazyValue = prop.required === false ? litVal([factory, ' ? ', producer, ' : undefined'], prop.type) : producer;

    maybeWire(this, prop, lazyValue);

    return { factory, lazyValue };
  }

  public wire(props: Record<string, IRenderable>) {
    this.l1Props.set(props);
  }

  private interfaceProperty(props: InterfacePropertyProps) {
    this.interfaceProperties.push(props);
    this.interfaceType.addProperty(props);
  }

  public identification(ident: ResourceIdentification) {
    this.interfaceProperty({
      ...ident.arnProperty,
      type: STRING,
      required: true,
    });

    for (const field of Object.values(ident.fields)) {
      this.interfaceProperty({
        ...field,
        type: STRING,
        required: true,
      });

      this.attributesType.addProperty({
        ...field,
        type: STRING,
        required: true,
      });
    }

    const arnFormat = analyzeArnFormat(ident.arnFormat);

    // fromXxxAttributes
    this.statics.push({
      render: (code: CM2) => {
        code.block([`public static from${this.baseClassName}Attributes(scope: `, CONSTRUCT, ', id: ', STRING, ', attrs: ', this.attributesType, '): ', this.interfaceType], () => {
          code.line('const stack = ', STACK, '.of(scope);');
          code.line('return new class extends ', RESOURCE, ' implements ', this.interfaceType, ' {');
          code.indent('  ');

          const fmtExpr = formatArnExpression(arnFormat, litVal('stack'), Object.fromEntries(Object.entries(ident.fields)
            .map(([name, field]) => [name, litVal(['attrs.', field.name])])));

          code.line('public readonly ', ident.arnProperty.name, ': ', STRING, ' = ', fmtExpr, ';');
          for (const field of Object.values(ident.fields)) {
            code.line('public readonly ', field.name, ': ', STRING, ' = attrs.', field.name, ';');
          }

          code.unindent();
          code.line('}(scope, id);');
        });
      }
    });

    // fromXxxArn
    this.statics.push({
      render: (code: CM2) => {
        code.block([`public static from${this.baseClassName}Arn(scope: `, CONSTRUCT, ', id: ', STRING, ', arn: ', STRING, '): ', this.interfaceType], () => {
          const { splitExpression, splitFields } = splitArnExpression(arnFormat, litVal('arn'), litVal('parsedArn'));
          code.line('const parsedArn = ', splitExpression);
          code.line('return new class extends ', RESOURCE, ' implements ', this.interfaceType, ' {');
          code.indent('  ');

          code.line('public readonly ', ident.arnProperty.name, ': ', STRING, ' = arn;');
          for (const [fieldName, field] of Object.entries(ident.fields)) {
            code.line('public readonly ', field.name, ': ', STRING, ' = ', splitFields[fieldName], ';');
          }

          code.unindent();
          code.line('}(scope, id, { environmentFromArn: arn });');
        });
      }
    });
  }

  public generateFiles(): CM2[] {
    return [
      this.interfaceType.toCM2(),
      ...this.attributesType.hasProps ? [this.attributesType.toCM2()] : [],
      this.generateGenClassFile(),
    ];
  }

  private generateGenClassFile(): CM2 {
    const l1Type = l1ResourceType(this.cloudFormationResourceType);

    const code = new CM2(this.sourceFile.fileName);
    const propsType = existingType(`${this.genClassName}Props`, this.sourceFile);

    code.docBlock(['@internal']);
    code.add(this.baseProps.declaration);
    code.add(this.props.declaration);

    code.docBlock(['@internal']);
    code.block([`export class ${this.genClassName} extends `, RESOURCE, ' implements ', this.interfaceType], () => {
      for (const stat of this.statics) {
        code.line(stat);
      }

      // Declare interface properties
      for (const prop of this.interfaceProperties) {
        code.line('public readonly ', prop.name, prop.required === false ? '?' : '', ': ', prop.type, ';');
      }

      code.block([
        'constructor(',
        new Arguments()
          .arg('scope', CONSTRUCT)
          .arg('id', STRING)
          .arg('props', propsType, { defaultValue: this.props.defaultValue }),
        ')'], () => {
        code.line('super(scope, id);');

        code.line('const resource = new ', l1Type, "(this, 'Resource', ", this.l1Props, ');');

        // Fill interface properties
        for (const prop of this.interfaceProperties) {
          const value = litVal(['resource.', prop.sourceProperty]);
          code.line('this.', prop.name, ' = ', splitSelect('|', prop.splitSelect, value), ';');
        }
      });
    });

    return code;
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

export type PropertyProps = InterfaceField & WireableProps;


export interface InterfacePropertyProps extends InterfaceField  {
  readonly sourceProperty: string;
  readonly splitSelect?: number;
}

export interface ResourceIdentification {
  /**
   * ARN format in a string with placeholders, like this:
   *
   * ```
   * arn:${Partition}:wafv2:${Region}:${Account}:${Scope}/webacl/${Name}/${Id}
   * ```
   *
   * Get this from https://docs.aws.amazon.com/service-authorization/latest/reference/reference.html
   */
  readonly arnFormat: string;

  readonly fields: Record<string, IdentifierField>;

  readonly arnProperty: IdentifierField;
}

export interface IdentifierField {
  readonly name: string;
  readonly summary: string;
  readonly sourceProperty: string;
  readonly splitSelect?: number;
}