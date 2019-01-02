import reflect = require('jsii-reflect');
import { Linter, MethodSignatureParameterExpectation } from '../linter';
import { CONSTRUCT_FQN, isConstruct } from '../util';

interface ConstructLinterContext  {
  readonly construct: reflect.ClassType;
}

export const constructLinter = new Linter<ConstructLinterContext>(assembly => assembly.classes
  .filter(t => isConstruct(t))
  .map(construct => ({ construct })));

constructLinter.add({
  code: 'construct-ctor',
  message: 'signature of all construct constructors should be "scope, id, props"',
  eval: e => {
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
      expectedParams.push(            {
        name: 'props',
      });
    }

    e.assertSignature(initializer, {
      parameters: expectedParams
    });
  }
});
