import camelcase = require('camelcase');
import reflect = require('jsii-reflect');
import { Linter } from '../linter';
import { CORE_MODULE } from './common';
import { ConstructReflection } from './construct';
import { ResourceReflection } from './resource';
const CFN_RESOURCE_BASE_CLASS_FQN = `${CORE_MODULE}.CfnResource`;

// this linter verifies that we have L2 coverage. it finds all "Cfn" classes and verifies
// that we have a corresponding L1 class for it that's identified as a resource.
export const cfnResourceLinter = new Linter(a => CfnResourceReflection.findAll(a));

cfnResourceLinter.add({
  code: 'resource-class',
  message: 'every resource must have a resource class (L2)',
  warning: true,
  eval: e => {
    const l2 = ResourceReflection.findAll(e.ctx.classType.assembly).find(r => r.cfn.fullname === e.ctx.fullname);
    e.assert(l2, e.ctx.fullname);
  }
});

export class CfnResourceReflection {
  /**
   * Finds a Cfn resource class by full CloudFormation resource name (e.g. `AWS::S3::Bucket`)
   * @param fullName first two components are case-insensitive (e.g. `aws::s3::Bucket` is equivalent to `Aws::S3::Bucket`)
   */
  public static findByName(sys: reflect.TypeSystem, fullName: string) {
    const [ org, ns, resource ] = fullName.split('::');
    const fqn = `@aws-cdk/${org.toLocaleLowerCase()}-${ns.toLocaleLowerCase()}.Cfn${resource}`;
    if (!sys.tryFindFqn(fqn)) {
      return undefined;
    }
    const cls = sys.findClass(fqn);
    return new CfnResourceReflection(cls);
  }

  /**
   * Returns all CFN resource classes within an assembly.
   */
  public static findAll(assembly: reflect.Assembly) {
    return assembly.classes.filter(c => {
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
    }).map(c => new CfnResourceReflection(c));
  }

  public readonly classType: reflect.ClassType;
  public readonly fullname: string; // AWS::S3::Bucket
  public readonly namespace: string; // AWS::S3
  public readonly basename: string; // Bucket
  public readonly attributeNames: string[]; // (normalized) bucketArn, bucketName, queueUrl
  public readonly attributePrefix: string;
  public readonly doc: string; // link to CloudFormation docs

  constructor(cls: reflect.ClassType) {
    this.classType = cls;

    this.basename = cls.name.substr('Cfn'.length);

    // HACK: extract full CFN name from initializer docs
    const initializerDoc = (cls.initializer && cls.initializer.docs.docs.summary) || '';
    const out = /a new `([^`]+)`/.exec(initializerDoc);
    const fullname = out && out[1];
    if (!fullname) {
      throw new Error(`Unable to extract CloudFormation resource name from initializer documentation of ${cls}`);
    }

    this.fullname = fullname;

    this.namespace = fullname.split('::').slice(0, 2).join('::');
    this.attributePrefix = this.basename[0].toLowerCase() + this.basename.slice(1);

    this.attributeNames = cls.ownProperties
      .filter(p => (p.docs.docs.custom || {}).cloudformationAttribute)
      .map(p => p.docs.customTag('cloudformationAttribute') || '<error>')
      .map(p => this.attributePropertyNameFromCfnName(p));

    this.doc = cls.docs.docs.see || '';
  }

  private attributePropertyNameFromCfnName(name: string): string {

    // special case (someone was smart), special case copied from cfn2ts
    if (this.basename === 'SecurityGroup' && name === 'GroupId') {
      return 'securityGroupId';
    }

    const cfnName = name.startsWith(this.basename) ? name.slice(this.basename.length) : name;

    // if the CFN attribute name already have the type name as a prefix (i.e. RoleId), we only take the "Id" as the "name".
    return this.attributePrefix + camelcase(cfnName, { pascalCase: true });
  }
}