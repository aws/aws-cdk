import reflect = require('jsii-reflect');
import { Linter } from '../linter';
import { ResourceReflection } from './resource';

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
  code: 'from-method',
  message: 'resource should have at least one "fromXxx" static method or "fromXxxAttributes"',
  eval: e => {
    e.assert(e.ctx.fromMethods.length > 0 || e.ctx.fromAttributesMethod, e.ctx.resource.fqn);
  }
});

importsLinter.add({
  code: 'from-signature',
  message: 'invalid method signature for fromXxx method',
  eval: e => {
    for (const method of e.ctx.fromMethods) {

      // "fromRoleArn" => "roleArn"
      const argName = e.ctx.resource.basename[0].toLocaleLowerCase() + method.name.slice('from'.length + 1);

      e.assertSignature(method, {
        parameters: [
          { name: 'scope', type: e.ctx.resource.construct.rootClass },
          { name: 'id', type: 'string' },
          { name: argName, type: 'string' }
        ],
        returns: e.ctx.resource.construct.interfaceType
      });
    }
  }
});

importsLinter.add({
  code: 'from-attributes',
  message: 'resources with more than one attribute (arn + name are considered a single attribute) must implement the fromAttributes:',
  eval: e => {
    const prefix = e.ctx.prefix;
    const uniques = Array.from(new Set(e.ctx.resource.cfn.attributeNames.map(x => {
      if (x === `${prefix}Name` || x === `${prefix}Arn`) {
        return `${prefix}ArnOrName`;
      } else {
        return x;
      }
    })));

    if (uniques.length <= 1) {
      return;
    }

    if (!e.assert(e.ctx.fromAttributesMethod, e.ctx.fromAttributesMethodName, uniques.join(','))) {
      return;
    }

    e.assertSignature(e.ctx.fromAttributesMethod, {
      parameters: [
        { name: 'scope', type: e.ctx.resource.construct.rootClass },
        { name: 'id', type: 'string' },
        { name: 'attrs', type: e.ctx.attributesStruct }
      ]
    });
  }
});

importsLinter.add({
  code: 'from-attributes-struct',
  message: 'resource should have an XxxAttributes struct',
  eval: e => {
    if (!e.ctx.fromAttributesMethod) {
      return; // no "fromAttributes" method
    }

    e.assert(e.ctx.attributesStruct, e.ctx.attributesStructName);
  }
});
