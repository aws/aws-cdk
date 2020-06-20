import * as reflect from 'jsii-reflect';
import { Linter } from '../linter';
import { CfnResourceReflection } from './cfn-resource';

interface ModuleLinterContext  {
  readonly assembly: reflect.Assembly;
  readonly namespace: string;
}

export const moduleLinter = new Linter<ModuleLinterContext>(assembly => {
  const cfnResources = CfnResourceReflection.findAll(assembly);
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
    const namespace = overrideNamespace(e.ctx.namespace.toLocaleLowerCase().replace('::', '-'));
    e.assertEquals(e.ctx.assembly.name, `@aws-cdk/${namespace}`, e.ctx.assembly.name);
  }
});

/**
 * Overrides special-case namespaces like aws-serverless=>aws-sam
 */
function overrideNamespace(namespace: string) {
  if (namespace === 'aws-serverless') {
    return 'aws-sam';
  }
  return namespace;
}
