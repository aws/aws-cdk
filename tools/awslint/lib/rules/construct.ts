import reflect = require('jsii-reflect');
import { Linter, MethodSignatureParameterExpectation } from '../linter';
import { CORE_MODULE } from './common';

const CONSTRUCT_FQN = `${CORE_MODULE}.Construct`;
const CONSTRUCT_INTERFACE_FQN = `${CORE_MODULE}.IConstruct`;

export const constructLinter = new Linter<ConstructReflection>(assembly => assembly.classes
  .filter(t => ConstructReflection.isConstructClass(t))
  .map(construct => new ConstructReflection(construct)));

export class ConstructReflection {
  /**
   * Determines if a class is a construct.
   */
  public static isConstructClass(c: reflect.ClassType) {
    if (!c.system.includesAssembly(CORE_MODULE)) {
      return false;
    }

    if (!c.isClassType()) {
      return false;
    }

    if (c.abstract) {
      return false;
    }

    return c.extends(c.system.findFqn(CONSTRUCT_FQN));
  }

  public static findAllConstructs(assembly: reflect.Assembly) {
    return assembly.classes
      .filter(c => ConstructReflection.isConstructClass(c))
      .map(c => new ConstructReflection(c));
  }

  public readonly ROOT_CLASS: reflect.ClassType; // cdk.Construct

  public readonly fqn: string;
  public readonly interfaceFqn: string;
  public readonly propsFqn: string;
  public readonly interfaceType?: reflect.InterfaceType;
  public readonly propsType?: reflect.InterfaceType;
  public readonly initializer?: reflect.Initializer;
  public readonly hasPropsArgument: boolean;
  public readonly sys: reflect.TypeSystem;

  constructor(public readonly classType: reflect.ClassType) {
    this.fqn = classType.fqn;
    this.sys = classType.system;
    this.ROOT_CLASS = this.sys.findClass(CONSTRUCT_FQN);
    this.interfaceFqn = `${classType.assembly.name}.I${classType.name}`;
    this.propsFqn = `${classType.assembly.name}.${classType.name}Props`;
    this.interfaceType = this.tryFindInterface();
    this.propsType = this.tryFindProps();
    this.initializer = classType.initializer;
    this.hasPropsArgument = this.initializer != null && this.initializer.parameters.length >= 3;
  }

  private tryFindInterface() {
    const sys = this.classType.system;
    const found = sys.tryFindFqn(this.interfaceFqn);
    if (!found) {
      return undefined;
    }

    if (!found.isInterfaceType()) {
      throw new Error(`Expecting type ${this.interfaceFqn} to be an interface`);
    }

    return found;
  }

  private tryFindProps() {
    const found = this.sys.tryFindFqn(this.propsFqn);
    if (!found) {
      return undefined;
    }

    if (!found.isInterfaceType()) {
      throw new Error(`Expecrting props struct ${this.propsFqn} to be an interface`);
    }

    return found;
  }
}

constructLinter.add({
  code: 'construct-ctor',
  message: 'signature of all construct constructors should be "scope, id, props"',
  eval: e => {
    // only applies to non abstract classes
    if (e.ctx.classType.abstract) {
      return;
    }

    const initializer = e.ctx.initializer;
    if (!e.assert(initializer, e.ctx.fqn)) {
      return;
    }

    const expectedParams = new Array<MethodSignatureParameterExpectation>();

    expectedParams.push({
      name: 'scope',
      type: CONSTRUCT_FQN
    });

    expectedParams.push({
      name: 'id',
      type: 'string'
    });

    // it's okay for a construct not to have a "props" argument so we only
    // assert the "props" argument if there are more than two parameters
    if (initializer.parameters.length > 2) {
      expectedParams.push({
        name: 'props',
      });
    }

    e.assertSignature(initializer, {
      parameters: expectedParams
    });
  }
});

constructLinter.add({
  code: 'props-struct-name',
  message: 'all constructs must have a props struct',
  eval: e => {
    if (!e.ctx.hasPropsArgument) {
      return;
    }

    // abstract classes are exempt
    if (e.ctx.classType.abstract) {
      return;
    }

    e.assert(e.ctx.propsType, e.ctx.interfaceFqn);
  }
});

constructLinter.add({
  code: 'construct-ctor-props-type',
  message: 'construct "props" type should use the props struct %s',
  eval: e => {
    if (!e.ctx.initializer) { return; }
    if (e.ctx.initializer.parameters.length < 3) { return; }

    e.assert(
      e.ctx.initializer.parameters[2].type.type === e.ctx.propsType,
      e.ctx.fqn,
      e.ctx.propsFqn);
  }
});

constructLinter.add({
  code: 'construct-ctor-props-optional',
  message: 'construct "props" must be optional since all props are optional',
  eval: e => {
    if (!e.ctx.propsType) { return; }
    if (!e.ctx.initializer) { return; }
    if (!e.ctx.hasPropsArgument) { return; }

    // this rule applies only if all properties are optional
    const allOptional = e.ctx.propsType.allProperties.every(p => p.optional);
    if (!allOptional) {
      return;
    }

    e.assert(e.ctx.initializer.parameters[2].optional, e.ctx.fqn);
  }
});

constructLinter.add({
  code: 'construct-interface-extends-iconstruct',
  message: 'construct interface must extend core.IConstruct',
  eval: e => {
    if (!e.ctx.interfaceType) { return; }
    const interfaceBase = e.ctx.sys.findInterface(CONSTRUCT_INTERFACE_FQN);
    e.assert(e.ctx.interfaceType.extends(interfaceBase), e.ctx.interfaceType.fqn);
  }
});

constructLinter.add({
  code: 'construct-base-is-private',
  message: 'prefer that the construct base class is private',
  eval: e => {
    if (!e.ctx.interfaceType) { return; }
    const baseFqn = `${e.ctx.classType.fqn}Base`;
    e.assert(!e.ctx.sys.tryFindFqn(baseFqn), baseFqn);
  }
});