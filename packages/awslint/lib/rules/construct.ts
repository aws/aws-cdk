import * as reflect from 'jsii-reflect';
import { CoreTypes } from './core-types';
import { Linter, MethodSignatureParameterExpectation } from '../linter';

export const constructLinter = new Linter<ConstructReflection>(assembly => assembly.classes
  .filter(t => CoreTypes.isConstructClass(t))
  .map(construct => new ConstructReflection(construct)));

export class ConstructReflection {

  public static findAllConstructs(assembly: reflect.Assembly) {
    return assembly.classes
      .filter(c => CoreTypes.isConstructClass(c))
      .map(c => new ConstructReflection(c));
  }

  public static getFqnFromTypeRef(typeRef: reflect.TypeReference) {
    if (typeRef.arrayOfType) {
      return typeRef.arrayOfType.fqn;
    } else if (typeRef.mapOfType) {
      return typeRef.mapOfType.fqn;
    }

    return typeRef.fqn;
  }

  /**
   * @deprecated - use `CoreTypes.constructClass()` or `CoreTypes.baseConstructClass()` as appropriate
   */
  public readonly ROOT_CLASS: reflect.ClassType; // constructs.Construct

  public readonly fqn: string;
  public readonly interfaceFqn: string;
  public readonly propsFqn: string;
  public readonly interfaceType?: reflect.InterfaceType;
  public readonly propsType?: reflect.InterfaceType;
  public readonly initializer?: reflect.Initializer;
  public readonly hasPropsArgument: boolean;
  public readonly sys: reflect.TypeSystem;
  public readonly core: CoreTypes;

  constructor(public readonly classType: reflect.ClassType) {
    this.fqn = classType.fqn;
    this.sys = classType.system;
    this.core = new CoreTypes(this.sys);
    this.ROOT_CLASS = this.sys.findClass(this.core.constructClass.fqn);
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
      throw new Error(`Expecting props struct ${this.propsFqn} to be an interface`);
    }

    return found;
  }
}

constructLinter.add({
  code: 'construct-ctor',
  message: 'signature of all construct constructors should be "scope, id, props". ' + baseConstructAddendum(),
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

    let baseType;
    if (process.env.AWSLINT_BASE_CONSTRUCT && !CoreTypes.isCfnResource(e.ctx.classType)) {
      baseType = e.ctx.core.baseConstructClass;
    } else {
      baseType = e.ctx.core.constructClass;
    }
    expectedParams.push({
      name: 'scope',
      type: baseType.fqn,
    });

    expectedParams.push({
      name: 'id',
      type: 'string',
    });

    // it's okay for a construct not to have a "props" argument so we only
    // assert the "props" argument if there are more than two parameters
    if (initializer.parameters.length > 2) {
      expectedParams.push({
        name: 'props',
      });
    }

    e.assertSignature(initializer, {
      parameters: expectedParams,
    });
  },
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
  },
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
  },
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
  },
});

constructLinter.add({
  code: 'construct-interface-extends-iconstruct',
  message: 'construct interface must extend core.IConstruct',
  eval: e => {
    if (!e.ctx.interfaceType) { return; }
    const interfaceBase = e.ctx.sys.findInterface(e.ctx.core.constructInterface.fqn);
    e.assert(e.ctx.interfaceType.extends(interfaceBase), e.ctx.interfaceType.fqn);
  },
});

constructLinter.add({
  code: 'construct-base-is-private',
  message: 'prefer that the construct base class is private',
  warning: true,
  eval: e => {
    if (!e.ctx.interfaceType) { return; }
    const baseFqn = `${e.ctx.classType.fqn}Base`;
    e.assert(!e.ctx.sys.tryFindFqn(baseFqn), baseFqn);
  },
});

constructLinter.add({
  code: 'props-no-unions',
  message: 'props must not use TypeScript unions',
  eval: e => {
    if (!e.ctx.propsType) { return; }
    if (!e.ctx.hasPropsArgument) { return; }

    // this rule does not apply to L1 constructs
    if (CoreTypes.isCfnResource(e.ctx.classType)) { return; }

    for (const property of e.ctx.propsType.ownProperties) {
      e.assert(!property.type.unionOfTypes, `${e.ctx.propsFqn}.${property.name}`);
    }
  },
});

constructLinter.add({
  code: 'props-no-arn-refs',
  message: 'props must use strong types instead of attributes. props should not have "arn" suffix',
  eval: e => {
    if (!e.ctx.propsType) { return; }
    if (!e.ctx.hasPropsArgument) { return; }

    // this rule does not apply to L1 constructs
    if (CoreTypes.isCfnResource(e.ctx.classType)) { return; }

    for (const property of e.ctx.propsType.ownProperties) {
      e.assert(!property.name.toLowerCase().endsWith('arn'), `${e.ctx.propsFqn}.${property.name}`);
    }
  },
});

constructLinter.add({
  code: 'props-no-tokens',
  message: 'props must not use the "Token" type',
  eval: e => {
    if (!e.ctx.propsType) { return; }
    if (!e.ctx.hasPropsArgument) { return; }

    // this rule does not apply to L1 constructs
    if (CoreTypes.isCfnResource(e.ctx.classType)) { return; }

    for (const property of e.ctx.propsType.allProperties) {
      const fqn = ConstructReflection.getFqnFromTypeRef(property.type);

      const found = (fqn && e.ctx.sys.tryFindFqn(fqn));
      if (found) {
        e.assert(!(fqn === e.ctx.core.tokenInterface.fqn), `${e.ctx.propsFqn}.${property.name}`);
      }
    }
  },
});

constructLinter.add({
  code: 'props-no-cfn-types',
  message: 'props must not expose L1 types (types which start with "Cfn")',
  eval: e => {
    if (!e.ctx.propsType) { return; }
    if (!e.ctx.hasPropsArgument) { return; }

    // this rule does not apply to L1 constructs
    if (CoreTypes.isCfnResource(e.ctx.classType)) { return; }

    for (const property of e.ctx.propsType.ownProperties) {
      const fqn = ConstructReflection.getFqnFromTypeRef(property.type);

      const found = (fqn && e.ctx.sys.tryFindFqn(fqn));
      if (found) {
        e.assert(!found.name.toLowerCase().startsWith('cfn'), `${e.ctx.propsFqn}.${property.name}`);
      }
    }
  },
});

constructLinter.add({
  code: 'props-no-any',
  message: 'props must not use Typescript "any" type',
  eval: e => {
    if (!e.ctx.propsType) { return; }
    if (!e.ctx.hasPropsArgument) { return; }

    // this rule does not apply to L1 constructs
    if (CoreTypes.isCfnResource(e.ctx.classType)) { return; }

    for (const property of e.ctx.propsType.ownProperties) {
      e.assert(!property.type.isAny, `${e.ctx.propsFqn}.${property.name}`);
    }
  },
});

function baseConstructAddendum(): string {
  if (!process.env.AWSLINT_BASE_CONSTRUCT) {
    return 'If the construct is using the "constructs" module, set the environment variable "AWSLINT_BASE_CONSTRUCT" and re-run';
  }
  return '';
}