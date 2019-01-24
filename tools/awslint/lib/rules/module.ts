import reflect = require('jsii-reflect');
import { findCfnResources } from '../cfn-resources';
import { Linter } from '../linter';

interface ModuleLinterContext  {
  readonly assembly: reflect.Assembly;
  readonly namespace: string;
}

export const moduleLinter = new Linter<ModuleLinterContext>(assembly => {
  const cfnResources = findCfnResources(assembly);
  if (cfnResources.length === 0) {
    return undefined; // no resources
  }

  return [ {
    assembly,
    namespace: cfnResources[0].namespace
  } ];
});

moduleLinter.add(  {
  code: 'module-name',
  message: 'module name must be @aws-cdk/aws-<namespace>',
  eval: e => {
    if (!e.ctx.namespace) { return; }
    if (!e.ctx.assembly) { return; }
    const namespace = e.ctx.namespace.toLocaleLowerCase().replace('::', '-');
    e.assertEquals(e.ctx.assembly.name, `@aws-cdk/${namespace}`, e.ctx.assembly.name);
  }
});
