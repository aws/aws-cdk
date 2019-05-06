import reflect = require('jsii-reflect');
import { Linter } from '../linter';
import { CfnResourceReflection } from './cfn-resource';
import { CORE_MODULE } from './common';
import { ConstructReflection } from './construct';
import { getDocTag } from './util';

const RESOURCE_BASE_CLASS_FQN = `${CORE_MODULE}.Resource`;
const RESOURCE_BASE_INTERFACE_FQN = `${CORE_MODULE}.IResource`;
const GRANT_RESULT_FQN = '@aws-cdk/aws-iam.Grant';

export const resourceLinter = new Linter(a => ResourceReflection.findAll(a));

export interface Attribute {
  site: AttributeSite;
  property: reflect.Property;
  name: string; // bucketArn
}

export enum AttributeSite {
  Interface = 'interface',
  Class = 'class'
}

export class ResourceReflection {
  /**
   * @returns all resource constructs (everything that extends `cdk.Resource`)
   */
  public static findAll(assembly: reflect.Assembly) {
    if (!assembly.system.assemblies.find(a => a.name === CORE_MODULE)) {
      return []; // not part of the dep stack
    }

    const baseResource = assembly.system.findClass(RESOURCE_BASE_CLASS_FQN);

    return ConstructReflection
      .findAllConstructs(assembly)
      .filter(c => c.classType.extends(baseResource) || getDocTag(c.classType, 'resource'))
      .map(c => new ResourceReflection(c));
  }

  public readonly attributes: Attribute[]; // actual attribute props
  public readonly fqn: string; // expected fqn of resource class

  public readonly assembly: reflect.Assembly;
  public readonly sys: reflect.TypeSystem;
  public readonly cfn: CfnResourceReflection;
  public readonly basename: string; // i.e. Bucket

  constructor(public readonly construct: ConstructReflection) {
    this.assembly = construct.classType.assembly;
    this.sys = this.assembly.system;

    const cfn = tryResolveCfnResource(construct.classType);
    if (!cfn) {
      throw new Error(`Cannot find L1 class for L2 ${construct.fqn}. ` +
        `Is "${guessResourceName(construct.fqn)}" an actual CloudFormation resource. ` +
        `If not, use the "@resource" doc tag to indicate the full resource name (e.g. "@resource AWS::Route53::HostedZone")`);
    }

    this.cfn = cfn;
    this.basename = construct.classType.name;
    this.fqn = construct.fqn;
    this.attributes = this.findAttributeProperties();
  }

  /**
   * Attribute properties are all the properties that begin with the type name (e.g. bucketXxx).
   */
  private findAttributeProperties(): Attribute[] {
    const result = new Array<Attribute>();

    for (const p of this.construct.classType.allProperties) {
      // an attribute property is a property which starts with the type name
      // (e.g. "bucketXxx") and/or has an @attribute doc tag.
      const tag = getDocTag(p, 'attribute');
      if (!p.name.startsWith(this.cfn.attributePrefix) && !tag) {
        continue;
      }

      // if there's an `@attribute` doc tag with a value other than "true"
      // it should be used as the attribute name instead of the property name
      const propertyName = (tag && tag !== 'true') ? tag : p.name;

      // check if this attribute is defined on an interface or on a class
      const property = findDeclarationSite(p);
      const site = property.parentType.isInterfaceType() ? AttributeSite.Interface : AttributeSite.Class;

      result.push({
        site,
        name: propertyName,
        property
      });
    }

    return result;
  }
}

function findDeclarationSite(prop: reflect.Property): reflect.Property {
  if (!prop.overrides || (!prop.overrides.isClassType() && !prop.overrides.isInterfaceType())) {
    if (!prop.parentType.isClassType() && !prop.parentType.isInterfaceType()) {
      throw new Error('invalid parent type');
    }
    return prop;
  }

  const overridesProp = prop.overrides.allProperties.find(p => p.name === prop.name);
  if (!overridesProp) {
    throw new Error(`Cannot find property ${prop.name} in override site ${prop.overrides.fqn}`);
  }
  return findDeclarationSite(overridesProp);
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
  message: 'resources must represent all cloudformation attributes as attribute properties. missing property: ',
  eval: e => {
    for (const name of e.ctx.cfn.attributeNames) {
      const found = e.ctx.attributes.find(a => a.name === name);
      e.assert(found, `${e.ctx.fqn}.${name}`, name);
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

function tryResolveCfnResource(resourceClass: reflect.ClassType): CfnResourceReflection | undefined {
  const sys = resourceClass.system;

  // if there is a @resource doc tag, it takes precedece
  const tag = resourceClass.docs.customTag('resource');
  if (tag) {
    return CfnResourceReflection.findByName(sys, tag);
  }

  // parse the FQN of the class name and see if we can find a matching CFN resource
  const guess = guessResourceName(resourceClass.fqn);
  if (guess) {
    const cfn = CfnResourceReflection.findByName(sys, guess);
    if (cfn) {
      return cfn;
    }
  }

  // try to resolve through ancestors
  for (const base of resourceClass.getAncestors()) {
    const ret = tryResolveCfnResource(base);
    if (ret) {
      return ret;
    }
  }

  // failed misrably
  return undefined;
}

function guessResourceName(fqn: string) {
  const match = /@aws-cdk\/([a-z]+)-([a-z0-9]+)\.([A-Z][a-zA-Z0-9]+)/.exec(fqn);
  if (!match) { return undefined; }

  const [ , org, ns, rs ] = match;
  if (!org || !ns || !rs) { return undefined; }

  return `${org}::${ns}::${rs}`;
}
