import reflect = require('jsii-reflect');
import { Linter } from '../linter';
import { ResourceReflection } from './resource';

export const importsLinter = new Linter<FromReflection>(assembly => ResourceReflection
  .findAllResources(assembly)
  .filter(r => r.construct && r.construct.interfaceType) // only resources that have an interface can have "fromXxx" methods
  .map(construct => new FromReflection(construct)));

class FromReflection {
  public readonly fromMethods: reflect.Method[];
  public readonly prefix: string;
  public readonly fromAttributesMethod?: reflect.Method;
  public readonly attributesStruct?: reflect.InterfaceType;

  constructor(public readonly resource: ResourceReflection) {
    const sys = resource.sys;
    this.prefix = `from${resource.basename}`;
    const classType = resource.construct.classType;
    this.fromAttributesMethod = classType.allMethods.find(x => x.name === `${this.prefix}Attributes`);
    this.fromMethods = classType.allMethods.filter(x => x.static && x.name.match(`^${this.prefix}[A-Z]`));

    const attributesStructFqn = `${classType.fqn}Attributes`;
    const attributesStruct = sys.tryFindFqn(attributesStructFqn);
    if (attributesStruct) {
      if (!attributesStruct.isInterfaceType() || !attributesStruct.isDataType()) {
        throw new Error(`Attributes type ${attributesStructFqn} must be an interface struct`);
      }
    }
    this.attributesStruct = attributesStruct;
  }
}

importsLinter.add({
  code: 'from-attributes',
  message: 'resource should have at least one "from%sXxx" static method',
  eval: e => {
    e.assert(e.ctx.fromMethods.length > 0, e.ctx.resource.fqn, e.ctx.resource.basename);
  }
});

importsLinter.add({
  code: 'from-signature',
  message: 'invalid method signature for fromXxx method',
  eval: e => {

    for (const method of e.ctx.fromMethods) {
      if (e.ctx.fromAttributesMethod && method.name === e.ctx.fromAttributesMethod.name) {
        e.assertSignature(method, {
          parameters: [
            { name: 'scope', type: e.ctx.resource.construct.rootClass },
            { name: 'id', type: 'string' },
            { name: 'attrs', type: e.ctx.attributesStruct }
          ]
        });
      } else {
        e.assertSignature(method, {
          parameters: [
            { name: 'scope', type: e.ctx.resource.construct.rootClass },
            { type: 'string' }
          ],
          returns: e.ctx.resource.construct.interfaceType
        });
      }
    }
  }
});