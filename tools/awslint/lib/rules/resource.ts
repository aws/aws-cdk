import reflect = require('jsii-reflect');
import { Linter } from '../linter';
import { CORE_MODULE } from './common';
import { ConstructReflection } from './construct';

const CFN_RESOURCE_BASE_CLASS_FQN = `${CORE_MODULE}.CfnResource`;
const RESOURCE_BASE_CLASS_FQN = `${CORE_MODULE}.Resource`;
const RESOURCE_BASE_INTERFACE_FQN = `${CORE_MODULE}.IResource`;
const GRANT_RESULT_FQN = '@aws-cdk/aws-iam.Grant';

export const resourceLinter = new Linter<ResourceReflection>(assembly => findCfnResources(assembly));

export class ResourceReflection {
  public static isResourceConstruct(construct: ConstructReflection) {
    const classType = construct.classType;
    const baseResource = classType.system.findClass(RESOURCE_BASE_CLASS_FQN);
    return classType.extends(baseResource);
  }

  /**
   * @returns all resource constructs
   */
  public static findAllResources(assembly: reflect.Assembly) {
    return findCfnResources(assembly).filter(r => r.hasConstruct);
  }

  public readonly fullname: string; // AWS::S3::Bucket
  public readonly namespace: string; // AWS::S3
  public readonly basename: string; // Bucket
  public readonly doc: string; // link to CloudFormation docs
  public readonly attributeNames: string[]; // bucketArn, bucketName, queueUrl
  public readonly attributes: reflect.Property[]; // actual attribute props
  public readonly fqn: string; // expected fqn of resource class

  public readonly assembly: reflect.Assembly;
  public readonly sys: reflect.TypeSystem;

  private readonly _construct?: ConstructReflection; // the resource construct

  constructor(public readonly cfnResource: reflect.ClassType) {
    this.sys = cfnResource.system;
    this.basename = cfnResource.name.substr('Cfn'.length);
    this.doc = cfnResource.docs.docs.see || '';

    // HACK: extract full CFN name from initializer docs
    const initializerDoc = (cfnResource.initializer && cfnResource.initializer.docs.docs.summary) || '';
    const out = /a new `([^`]+)`/.exec(initializerDoc);
    const fullname = out && out[1];
    if (!fullname) {
      throw new Error(`Unable to extract CloudFormation resource name from initializer documentation of ${cfnResource}`);
    }
    this.fullname = fullname;
    this.namespace = fullname.split('::').slice(0, 2).join('::');
    this.attributeNames = parseResourceAttributes(cfnResource);

    function parseResourceAttributes(cfnResourceClass: reflect.ClassType) {
      return cfnResourceClass.ownProperties.filter(p => (p.docs.docs.custom || {}).cloudformationAttribute).map(p => p.name);
    }

    this.assembly = cfnResource.assembly;

    this.fqn = `${this.assembly.name}.${this.basename}`;
    this._construct = ConstructReflection
      .findAllConstructs(this.assembly)
      .find(c => c.fqn === this.fqn);

    this.attributes = this.findAttributeProperties();
  }

  public get construct(): ConstructReflection {
    if (!this._construct) {
      throw new Error(`Resource ${this.fullname} does not have a corresponding AWS construct`);
    }
    return this._construct;
  }

  public get hasConstruct(): boolean {
    return !!this._construct;
  }

  private findAttributeProperties() {
    if (!this.hasConstruct) {
      return [];
    }

    const resiult = new Array<reflect.Property>();
    for (const attr of this.attributeNames) {
      const attribute = this.construct.classType.allProperties.find(p => p.name === attr);
      if (attribute) {
        resiult.push(attribute);
      }
    }

    return resiult;
  }
}

resourceLinter.add({
  code: 'resource-class',
  message: 'every resource must have a resource class (L2)',
  warning: true,
  eval: e => {
    e.assert(e.ctx.hasConstruct, e.ctx.fqn);
  }
});

resourceLinter.add({
  code: 'resource-class-extends-resource',
  message: `resource classes must extend "cdk.Resource" directly or indirectly`,
  eval: e => {
    if (!e.ctx.hasConstruct) { return; }

    const resourceBase = e.ctx.sys.findClass(RESOURCE_BASE_CLASS_FQN);
    e.assert(e.ctx.construct.classType.extends(resourceBase), e.ctx.construct.fqn);
  }
});

resourceLinter.add({
  code: 'resource-interface',
  warning: true,
  message: 'every resource must have a resource interface',
  eval: e => {
    if (!e.ctx.hasConstruct) { return; }
    e.assert(e.ctx.construct.interfaceType, e.ctx.construct.fqn);
  }
});

resourceLinter.add({
  code: 'resource-interface-extends-resource',
  message: 'construct interfaces of AWS resources must extend cdk.IResource',
  eval: e => {
    const resourceInterface = e.ctx.hasConstruct && e.ctx.construct.interfaceType;
    if (!resourceInterface) { return; }

    const interfaceBase = e.ctx.sys.findInterface(RESOURCE_BASE_INTERFACE_FQN);
    e.assert(resourceInterface.extends(interfaceBase), resourceInterface.fqn);
  }
});

resourceLinter.add({
  code: 'resource-attribute',
  message: 'resources must represent all attributes as properties',
  eval: e => {
    const resourceInterface = e.ctx.hasConstruct && e.ctx.construct.interfaceType;
    if (!resourceInterface) { return; }

    for (const name of e.ctx.attributeNames) {
      const found = e.ctx.attributes.find(a => a.name === name);
      e.assert(found, `${e.ctx.fqn}.${name}`);
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
    if (!e.ctx.hasConstruct) { return; }

    const grantResultType = e.ctx.sys.findFqn(GRANT_RESULT_FQN);
    const grantMethods = e.ctx.construct.classType.allMethods.filter(m => m.name.startsWith('grant'));

    for (const grantMethod of grantMethods) {
      e.assertSignature(grantMethod, {
        returns: grantResultType
      });
    }
  }
});

/**
 * Given a jsii assembly, extracts all CloudFormation resources from CFN classes
 */
export function findCfnResources(assembly: reflect.Assembly): ResourceReflection[] {
  return assembly.classes.filter(c => isCfnResource(c)).map(layer1 => {
    return new ResourceReflection(layer1);
  });

  function isCfnResource(c: reflect.ClassType) {
    if (!c.system.includesAssembly(CORE_MODULE)) {
      return false;
    }

    // skip CfnResource itself
    if (c.fqn === CFN_RESOURCE_BASE_CLASS_FQN) {
      return false;
    }

    if (!ConstructReflection.isConstructClass(c)) {
      return false;
    }

    const cfnResourceClass = c.system.findFqn(CFN_RESOURCE_BASE_CLASS_FQN);
    if (!c.extends(cfnResourceClass)) {
      return false;
    }

    if (!c.name.startsWith('Cfn')) {
      return false;
    }

    return true;
  }
}
