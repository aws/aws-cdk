import * as reflect from 'jsii-reflect';
import { AttributeSite, ResourceReflection } from './resource';
import { Linter } from '../linter';

export const importsLinter = new Linter<ImportsReflection>(assembly => ResourceReflection
  .findAll(assembly)
  .filter(r => r.construct && r.construct.interfaceType) // only resources that have an interface can have "fromXxx" methods
  .map(construct => new ImportsReflection(construct)));

class ImportsReflection {
  public readonly fromMethods: reflect.Method[];
  public readonly prefix: string;
  public readonly fromAttributesMethodName: string;
  public readonly fromAttributesMethod?: reflect.Method;
  public readonly attributesStructName: string;
  public readonly attributesStruct?: reflect.InterfaceType;

  constructor(public readonly resource: ResourceReflection) {
    const sys = resource.sys;
    this.prefix = `from${resource.basename}`;
    const classType = resource.construct.classType;
    this.fromAttributesMethodName = `${this.prefix}Attributes`;
    this.fromAttributesMethod = classType.allMethods.find(x => x.name === this.fromAttributesMethodName);

    this.fromMethods = classType.allMethods.filter(x =>
      x.static
        && x.name.match(`^${this.prefix}[A-Z]`)
        && x.name !== this.fromAttributesMethodName);

    const attributesStructFqn = `${classType.fqn}Attributes`;
    const attributesStruct = sys.tryFindFqn(attributesStructFqn);
    if (attributesStruct) {
      if (!attributesStruct.isInterfaceType() || !attributesStruct.isDataType()) {
        throw new Error(`Attributes type ${attributesStructFqn} must be an interface struct`);
      }
    }
    this.attributesStructName = attributesStructFqn;
    this.attributesStruct = attributesStruct;
  }
}

importsLinter.add({
  code: 'no-static-import',
  message: 'static "import" methods are deprecated in favor of "fromAttributes" (see guidelines)',
  eval: e => {
    const hasImport = e.ctx.resource.construct.classType.allMethods.find(x => x.static && x.name === 'import');
    e.assert(!hasImport, e.ctx.resource.fqn + '.import');
  },
});

importsLinter.add({
  code: 'from-method',
  message: 'resource should have at least one "fromXxx" static method or "fromXxxAttributes"',
  eval: e => {
    // no attributes are defined on the interface, so we don't expect any "from" methods.
    if (!e.ctx.resource.attributes.some(a => a.site === AttributeSite.Interface)) {
      return;
    }

    e.assert(e.ctx.fromMethods.length > 0 || e.ctx.fromAttributesMethod, e.ctx.resource.fqn);
  },
});

importsLinter.add({
  code: 'from-signature',
  message: 'invalid method signature for fromXxx method. ' + baseConstructAddendum(),
  eval: e => {
    for (const method of e.ctx.fromMethods) {

      // "fromRoleArn" => "roleArn"
      const argName = e.ctx.resource.basename[0].toLocaleLowerCase() + method.name.slice('from'.length + 1);

      const baseType = process.env.AWSLINT_BASE_CONSTRUCT ? e.ctx.resource.core.baseConstructClass :
        e.ctx.resource.core.constructClass;
      e.assertSignature(method, {
        parameters: [
          { name: 'scope', type: baseType },
          { name: 'id', type: 'string' },
          { name: argName, type: 'string' },
        ],
        returns: e.ctx.resource.construct.interfaceType,
      });
    }
  },
});

importsLinter.add({
  code: 'from-attributes',
  message: 'static fromXxxAttributes is a factory of IXxx from its primitive attributes. ' + baseConstructAddendum(),
  eval: e => {
    if (!e.ctx.fromAttributesMethod) {
      return;
    }

    const baseType = process.env.AWSLINT_BASE_CONSTRUCT ? e.ctx.resource.core.baseConstructClass
      : e.ctx.resource.core.constructClass;
    e.assertSignature(e.ctx.fromAttributesMethod, {
      parameters: [
        { name: 'scope', type: baseType },
        { name: 'id', type: 'string' },
        { name: 'attrs', type: e.ctx.attributesStruct },
      ],
    });
  },
});

importsLinter.add({
  code: 'from-attributes-struct',
  message: 'resource should have an XxxAttributes struct',
  eval: e => {
    if (!e.ctx.fromAttributesMethod) {
      return; // no "fromAttributes" method
    }

    e.assert(e.ctx.attributesStruct, e.ctx.attributesStructName);
  },
});

function baseConstructAddendum(): string {
  if (!process.env.AWSLINT_BASE_CONSTRUCT) {
    return 'If the construct is using the "constructs" module, set the environment variable "AWSLINT_BASE_CONSTRUCT" and re-run';
  }
  return '';
}
