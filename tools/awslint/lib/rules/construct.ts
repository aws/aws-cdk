import reflect = require('jsii-reflect');
import { Linter, MethodSignatureParameterExpectation } from '../linter';
import { CONSTRUCT_FQN, isConstruct } from '../util';

interface ConstructLinterContext  {
  readonly construct: reflect.ClassType;
  readonly ts: reflect.TypeSystem;
  hasProps?: boolean; // indicates if the ctor accepts any "props" or just two arguments
  props?: reflect.InterfaceType;
  initializer?: reflect.Initializer;
}

export const constructLinter = new Linter<ConstructLinterContext>(assembly => assembly.classes
  .filter(t => isConstruct(t))
  .map(construct => ({
    construct,
    ts: construct.system
  })));

constructLinter.add({
  code: 'construct-ctor',
  message: 'signature of all construct constructors should be "scope, id, props"',
  eval: e => {
    // only applies to non abstract classes
    if (e.ctx.construct.abstract) {
      return;
    }

    const initializer = e.ctx.construct.initializer;
    if (!e.assert(initializer, e.ctx.construct.fqn)) {
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

      e.ctx.hasProps = true;
    }

    e.assertSignature(initializer, {
      parameters: expectedParams
    });

    e.ctx.initializer = initializer;
  }
});

constructLinter.add({
  code: 'props-struct-name',
  message: 'all constructs must have a props struct',
  eval: e => {
    if (!e.ctx.construct) {
      return;
    }

    if (!e.ctx.hasProps) {
      return;
    }

    // abstract classes are exempt
    if (e.ctx.construct.abstract) {
      return;
    }

    const fqn = `${e.ctx.construct.assembly.name}.${e.ctx.construct.name}Props`;

    if (!e.assert(e.ctx.ts.tryFindFqn(fqn), fqn)) {
      return;
    }

    const iface = e.ctx.ts.findInterface(fqn);
    if (!e.assert(iface, fqn)) {
      return;
    }

    if (!e.assert(iface.isInterfaceType(), fqn)) {
      return;
    }

    e.ctx.props = iface;
  }
});

constructLinter.add({
  code: 'construct-ctor-props-type',
  message: 'construct "props" type should use the props struct %s',
  eval: e => {
    if (!e.ctx.props) { return; }
    if (!e.ctx.construct) { return; }
    if (!e.ctx.initializer) { return; }
    if (e.ctx.initializer.parameters.length < 3) { return; }

    e.assert(e.ctx.initializer.parameters[2].type.type === e.ctx.props, e.ctx.construct.fqn, e.ctx.props.fqn);
  }
});

constructLinter.add({
  code: 'construct-ctor-props-optional',
  message: 'construct "props" must be optional since all props are optional',
  eval: e => {
    if (!e.ctx.props) { return; }
    if (!e.ctx.construct) { return; }
    if (!e.ctx.initializer) { return; }
    if (e.ctx.initializer.parameters.length < 3) { return; }

    // this rule applies only if all properties are optional
    const allOptional = e.ctx.props.allProperties.every(p => p.optional);
    if (!allOptional) {
      return;
    }

    e.assert(e.ctx.initializer.parameters[2].optional, e.ctx.construct.fqn);
  }
});