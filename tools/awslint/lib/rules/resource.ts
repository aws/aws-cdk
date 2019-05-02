import reflect = require('jsii-reflect');
import { Linter } from '../linter';
import { CfnResourceReflection } from './cfn-resource';
import { CORE_MODULE } from './common';
import { ConstructReflection } from './construct';

const RESOURCE_BASE_CLASS_FQN = `${CORE_MODULE}.Resource`;
const RESOURCE_BASE_INTERFACE_FQN = `${CORE_MODULE}.IResource`;
const GRANT_RESULT_FQN = '@aws-cdk/aws-iam.Grant';

export const resourceLinter = new Linter(a => ResourceReflection.findAll(a));

export class ResourceReflection {
  /**
   * @returns all resource constructs (everything that extends `cdk.Resource`)
   */
  public static findAll(assembly: reflect.Assembly) {
    const baseResource = assembly.system.findClass(RESOURCE_BASE_CLASS_FQN);

    return ConstructReflection
      .findAllConstructs(assembly)
      .filter(c => c.classType.extends(baseResource))
      .map(c => new ResourceReflection(c));
  }

  public readonly attributes: reflect.Property[]; // actual attribute props
  public readonly fqn: string; // expected fqn of resource class

  public readonly assembly: reflect.Assembly;
  public readonly sys: reflect.TypeSystem;
  public readonly cfn: CfnResourceReflection;
  public readonly basename: string; // i.e. Bucket

  constructor(public readonly construct: ConstructReflection) {
    this.assembly = construct.classType.assembly;
    this.sys = this.assembly.system;

    const resourceFullName = determineCloudFormationResourceName(construct.classType);
    const cfn = CfnResourceReflection.findByName(this.sys, resourceFullName);
    if (!cfn) {
      throw new Error(`Cannot find L1 class for L2 ${construct.fqn}. Is "${resourceFullName}" an actual CloudFormation resource. If not, ` +
        `use the "@resource" in the class's jsdoc tag to indicate the full resource name (e.g. "AWS::Route53::HostedZone")`);
    }
    this.cfn = cfn;
    this.basename = construct.classType.name;
    this.fqn = construct.fqn;
    this.attributes = this.findAttributeProperties();
  }

  private findAttributeProperties() {
    const result = new Array<reflect.Property>();

    for (const attr of this.cfn.attributeNames) {
      const attribute = this.construct.classType.allProperties.find(p => p.name === attr);
      if (attribute) {
        result.push(attribute);
      }
    }

    return result;
  }
}

resourceLinter.add({
  code: 'resource-class-extends-resource',
  message: `resource classes must extend "cdk.Resource" directly or indirectly`,
  eval: e => {
    const resourceBase = e.ctx.sys.findClass(RESOURCE_BASE_CLASS_FQN);
    e.assert(e.ctx.construct.classType.extends(resourceBase), e.ctx.construct.fqn);
  }
});

resourceLinter.add({
  code: 'resource-interface',
  warning: true,
  message: 'every resource must have a resource interface',
  eval: e => {
    e.assert(e.ctx.construct.interfaceType, e.ctx.construct.fqn);
  }
});

resourceLinter.add({
  code: 'resource-interface-extends-resource',
  message: 'construct interfaces of AWS resources must extend cdk.IResource',
  eval: e => {
    const resourceInterface = e.ctx.construct.interfaceType;
    if (!resourceInterface) { return; }

    const interfaceBase = e.ctx.sys.findInterface(RESOURCE_BASE_INTERFACE_FQN);
    e.assert(resourceInterface.extends(interfaceBase), resourceInterface.fqn);
  }
});

resourceLinter.add({
  code: 'resource-attribute',
  message: 'resources must represent all attributes as properties. missing: ',
  eval: e => {
    const resourceInterface = e.ctx.construct.interfaceType;
    if (!resourceInterface) { return; }

    for (const name of e.ctx.cfn.attributeNames) {
      const found = e.ctx.attributes.find(a => a.name === name);
      e.assert(found, `${e.ctx.fqn}.${name}`, name);
    }
  }
});

resourceLinter.add({
  code: 'resource-attribute-immutable',
  message: 'resource attributes must be immutable (readonly)',
  eval: e => {
    for (const att of e.ctx.attributes) {
      e.assert(att.immutable, att.parentType.fqn + '.' + att.name);
    }
  }
});

resourceLinter.add({
  code: 'grant-result',
  message: `"grant" method must return ${GRANT_RESULT_FQN}`,
  eval: e => {
    const grantResultType = e.ctx.sys.findFqn(GRANT_RESULT_FQN);
    const grantMethods = e.ctx.construct.classType.allMethods.filter(m => m.name.startsWith('grant'));

    for (const grantMethod of grantMethods) {
      e.assertSignature(grantMethod, {
        returns: grantResultType
      });
    }
  }
});

function determineCloudFormationResourceName(cls: reflect.ClassType) {
  const tag = cls.docs.customTag('resource');
  if (tag) {
    return tag;
  }

  const match = /@aws-cdk\/([a-z]+)-([a-z0-9]+)\.([A-Z][a-zA-Z0-9]+)/.exec(cls.fqn);
  if (!match) {
    throw new Error(`Unable to parse resource construct FQN: ${cls.fqn}`);
  }

  const [ , org, ns, rs ] = match;

  if (!org || !ns || !rs) {
    throw new Error(`Unable to parse resource construct FQN: ${cls.fqn}`);
  }

  return `${org}::${ns}::${rs}`;
}