import reflect = require('jsii-reflect');
import { CfnResourceSpec, findCfnResources } from '../cfn-resources';
import { Linter } from '../linter';
import { CONSTRUCT_FQN, CONSTRUCT_INTERFACE_FQN, isConstruct } from '../util';

export const resourceLinter = new Linter<ResourceLinterContext>(assembly => {
  return findCfnResources(assembly).map(cfn => ({
    assembly,
    resource: cfn,
    ts: assembly.system,
  }));
});

const GRANT_RESULT_FQN = '@aws-cdk/aws-iam.Grant';

interface ResourceLinterContext {
  readonly ts: reflect.TypeSystem;
  readonly resource: CfnResourceSpec;
  readonly assembly: reflect.Assembly;
  resourceClass?: reflect.ClassType;
  resourcePropsInterface?: reflect.InterfaceType;
  resourceInterface?: reflect.InterfaceType;
  importPropsInterface?: reflect.InterfaceType;
  resourceAttributes?: reflect.Property[];
}

resourceLinter.add({
  code: 'resource-class',
  message: 'every resource must have a resource class (L2)',
  warning: true,
  eval: e => {
    const resourceFqn = `${e.ctx.assembly.name}.${e.ctx.resource.basename}`;
    const resourceClass = e.ctx.ts.classes.find(c => c.fqn === resourceFqn);
    if (!e.assert(resourceClass, resourceFqn)) {
      return;
    }

    e.ctx.resourceClass = resourceClass;
  }
});

resourceLinter.add({
  code: 'resource-class-is-construct',
  message: `resource classes must extend "cdk.Construct" directly or indirectly`,
  eval: e => {
    if (!e.ctx.resourceClass) { return; }
    e.assert(isConstruct(e.ctx.resourceClass), e.ctx.resourceClass.fqn);
  }
});

resourceLinter.add({
  code: 'resource-props',
  message: 'an interface for resource props must be defined',
  eval: e => {
    if (!e.ctx.resourceClass) { return; }
    const fqn = `${e.ctx.assembly.name}.${e.ctx.resource.basename}Props`;
    const resourcePropsInterface = e.ctx.ts.interfaces.find(i => i.fqn === fqn);
    if (!e.assert(resourcePropsInterface, fqn)) {
      return;
    }

    e.ctx.resourcePropsInterface = resourcePropsInterface;
  }
});

resourceLinter.add({
  code: 'resource-interface',
  message: 'every resource must have a resource interface',
  warning: true,
  eval: e => {
    if (!e.ctx.resourceClass) { return; }

    // first, let's look up the IFoo interface
    const interfaceFqn = `${e.ctx.assembly.name}.I${e.ctx.resource.basename}`;
    const resourceInterface = e.ctx.ts.interfaces.find(i => i.fqn === interfaceFqn);
    if (!e.assert(resourceInterface, interfaceFqn)) {
      return;
    }

    e.ctx.resourceInterface = resourceInterface;
  }
});

resourceLinter.add({
  code: 'import-props-interface',
  message: 'every resource must have an "FooImportProps" interface',
  eval: e => {
    if (!e.ctx.resourceInterface) {
      return;
    }

    const attrsFqn = `${e.ctx.assembly.name}.${e.ctx.resource.basename}ImportProps`;
    const importPropsInterface = e.ctx.ts.interfaces.find(c => c.fqn === attrsFqn);
    if (e.assert(importPropsInterface, attrsFqn)) {
      e.ctx.importPropsInterface = importPropsInterface;
    }
  }
});

resourceLinter.add({
  code: 'resource-interface-extends-construct',
  message: 'resource interface must extend cdk.IConstruct',
  eval: e => {
    if (!e.ctx.resourceInterface) { return; }
    e.assert(e.ctx.resourceInterface.getInterfaces(true).some(i => i.fqn === CONSTRUCT_INTERFACE_FQN), e.ctx.resourceInterface.fqn);
  }
});

resourceLinter.add({
  code: 'resource-attribute',
  message: 'resources must represent all attributes as properties',
  eval: e => {
    if (!e.ctx.resourceInterface) { return; }

    // verify that the interface has all attributes as readonly properties
    const resourceAttributes = new Array<reflect.Property>();
    for (const attr of e.ctx.resource.attributes) {
      const attribute: reflect.Property | undefined = e.ctx.resourceInterface.properties.find(p => p.name === attr);
      const scope: string = e.ctx.resourceInterface.fqn + '.' + attr;
      if (e.assert(attribute, scope)) {
        resourceAttributes.push(attribute);
      }
    }

    e.ctx.resourceAttributes = resourceAttributes;
  }
});

resourceLinter.add({
  code: 'resource-attribute-immutable',
  message: 'resource attributes must be immutable (readonly)',
  eval: e => {
    if (!e.ctx.resourceAttributes) { return; }
    for (const att of e.ctx.resourceAttributes) {
      e.assert(att.immutable, att.parentType.fqn + '.' + att.name);
    }
  }
});

resourceLinter.add({
  code: 'import',
  message: 'resource class must have a static "import" method',
  eval: e => {
    if (!e.ctx.resourceClass) { return; }
    if (!e.ctx.resourceInterface) { return; }
    if (!e.ctx.importPropsInterface) { return; }

    const importMethod = e.ctx.resourceClass.methods.find(m => m.static && m.name === 'import');
    if (!e.assert(importMethod, e.ctx.resourceClass.fqn)) {
      return;
    }

    e.assertSignature(importMethod, {
      returns: e.ctx.resourceInterface,
      parameters: [
        { name: 'scope', type: CONSTRUCT_FQN },
        { name: 'id', type: 'string' },
        { name: 'props', type: e.ctx.importPropsInterface.fqn }
      ],
    });
  }
});

resourceLinter.add({
  code: 'export',
  message: 'resource interface must have an "export" method',
  eval: e => {
    if (!e.ctx.resourceInterface) { return; }

    const exportMethod = e.ctx.resourceInterface.methods.find(m => m.name === 'export');
    if (!e.assert(exportMethod, e.ctx.resourceInterface.fqn)) {
      return;
    }

    if (!e.ctx.importPropsInterface) { return; }

    e.assertSignature(exportMethod, {
      returns: e.ctx.importPropsInterface,
      parameters: []
    });
  }
});

resourceLinter.add({
  code: 'grant-result',
  message: `"grant" method must return ${GRANT_RESULT_FQN}`,
  eval: e => {
    if (!e.ctx.resourceClass) { return; }

    const grantResultType = e.ctx.ts.findFqn(GRANT_RESULT_FQN);
    const grantMethods = e.ctx.resourceClass.getMethods(true).filter(m => m.name.startsWith('grant'));

    for (const grantMethod of grantMethods) {
      e.assertSignature(grantMethod, {
        returns: grantResultType
      });
    }
  }
});