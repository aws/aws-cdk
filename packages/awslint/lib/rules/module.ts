import * as reflect from 'jsii-reflect';
import { CfnResourceReflection } from './cfn-resource';
import { Linter } from '../linter';

interface ModuleLinterContext {
  readonly assembly: reflect.Assembly;
  readonly namespaces: Set<string>;
}

export const moduleLinter = new Linter<ModuleLinterContext>(assembly => {
  const cfnResources = CfnResourceReflection.findAll(assembly);
  if (cfnResources.length === 0) {
    return undefined; // no resources
  }

  const namespaces = new Set<string>();
  for (const cfnResource of cfnResources) {
    namespaces.add(cfnResource.namespace);
  }
  return {
    assembly,
    namespaces,
  };
});

moduleLinter.add( {
  code: 'module-name',
  message: 'module name must be @aws-cdk/aws-<namespace>',
  eval: e => {
    if (!e.ctx.namespaces) { return; }
    if (!e.ctx.assembly) { return; }

    const cdkNamespaces = Array
      .from(e.ctx.namespaces)
      .map(ns => `@aws-cdk/${overrideNamespace(ns.toLocaleLowerCase().replace('::', '-'))}`);
    for (const cdkNamespace of cdkNamespaces) {
      if (e.ctx.assembly.name === cdkNamespace) {
        return;
      }
    }

    e.assert(false, e.ctx.assembly.name, ` expected '${e.ctx.assembly.name}' to be ` +
      (cdkNamespaces.length === 1
        ? `'${cdkNamespaces[0]}'`
        : `one of: ${cdkNamespaces.join(', ')}`));
  },
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
