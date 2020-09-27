import { Linter } from '../linter';

export const exportsLinter = new Linter(assembly => assembly.types);

exportsLinter.add({
  code: 'no-export',
  message: 'the "export" methods are deprecated',
  eval: e => {
    if (e.ctx.isClassType() || e.ctx.isInterfaceType()) {
      e.assert(!e.ctx.allMethods.some(m => m.name === 'export'), e.ctx.fqn);
    }
  },
});