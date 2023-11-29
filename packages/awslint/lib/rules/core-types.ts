import * as reflect from 'jsii-reflect';
import { getDocTag } from './util';

const CORE_MODULE = 'aws-cdk-lib';
enum CoreTypesFqn {
  CfnResource = 'aws-cdk-lib.CfnResource',
  Resource = 'aws-cdk-lib.Resource',
  ResourceInterface = 'aws-cdk-lib.IResource',
  ResolvableInterface = 'aws-cdk-lib.IResolvable',
  PhysicalName = 'aws-cdk-lib.PhysicalName',

  Construct = 'constructs.Construct',
  ConstructInterface = 'constructs.IConstruct',
}

export class CoreTypes {

  /**
   * @returns true if assembly has the Core module
   */
  public static hasCoreModule(assembly: reflect.Assembly) {
    return (!assembly.system.assemblies.find(a => a.name === CORE_MODULE));
  }

  /**
   * @returns true if `classType` represents an L1 Cfn Resource
   */
  public static isCfnResource(c: reflect.ClassType) {
    if (!c.system.includesAssembly(CORE_MODULE)) {
      return false;
    }

    // skip CfnResource itself
    if (c.fqn === CoreTypesFqn.CfnResource) {
      return false;
    }

    if (!this.isConstructClass(c)) {
      return false;
    }

    const cfnResourceClass = c.system.findFqn(CoreTypesFqn.CfnResource);
    if (!c.extends(cfnResourceClass)) {
      return false;
    }

    if (!c.name.startsWith('Cfn')) {
      return false;
    }

    return true;
  }

  /**
   * @returns true if `classType` represents a Construct
   */
  public static isConstructClass(c: reflect.ClassType) {
    if (!c.system.includesAssembly(CORE_MODULE)) {
      return false;
    }

    if (!c.isClassType()) {
      return false;
    }

    if (c.abstract) {
      return false;
    }

    return c.extends(c.system.findFqn(CoreTypesFqn.Construct));
  }

  /**
   * @returns true if `classType` represents an AWS resource (i.e. extends `cdk.Resource`).
   */
  public static isResourceClass(classType: reflect.ClassType) {
    const baseResource = classType.system.findClass(CoreTypesFqn.Resource);
    return classType.extends(baseResource) || getDocTag(classType, 'resource');
  }

  /**
   * Return true if the nesting parent of the given interface is a CFN class
   */
  public static isCfnNestedType(interfaceType: reflect.Type) {
    return interfaceType.nestingParent && CoreTypes.isCfnType(interfaceType.nestingParent);
  }

  /**
   * Return true if the given interface type is a CFN class or prop type
   */
  public static isCfnType(interfaceType: reflect.Type) {
    return interfaceType.name.startsWith('Cfn')
      || interfaceType.name.startsWith('ICfn')
      || (interfaceType.namespace && interfaceType.namespace.startsWith('Cfn'))
      // aws_service.CfnTheResource.SubType
      || (interfaceType.namespace && interfaceType.namespace.split('.', 2).at(1)?.startsWith('Cfn'));
  }

  /**
   * @returns `classType` for the core type Construct
   * @deprecated - use `baseConstructClass()`
   */
  public get constructClass() {
    return this.baseConstructClass;
  }

  /**
   * @returns `classType` for the core type Construct
   */
  public get baseConstructClass() {
    return this.sys.findClass(this.baseConstructClassFqn);
  }

  /**
   * @returns `classType` for the core type Construct
   */
  public get baseConstructClassFqn() {
    return CoreTypesFqn.Construct;
  }

  /**
   * @returns `interfacetype` for the core type Construct
   * @deprecated - use `baseConstructInterface()`
   */
  public get constructInterface() {
    return this.baseConstructInterface;
  }

  /**
   * @returns `interfacetype` for the core type Construct
   */
  public get baseConstructInterface() {
    return this.sys.findInterface(this.baseConstructInterfaceFqn);
  }

  /**
   * @returns fqn for for the core Construct interface
   */
  public get baseConstructInterfaceFqn() {
    return CoreTypesFqn.ConstructInterface;
  }

  /**
   * @returns `classType` for the core type Resource
   */
  public get resourceClass() {
    return this.sys.findClass(this.resourceClassFqn);
  }

  /**
   * @returns fqn for the core type Resource
   */
  public get resourceClassFqn() {
    return CoreTypesFqn.Resource;
  }

  /**
   * @returns fqn for the core Resource interface
   */
  public get resourceInterface() {
    return this.sys.findInterface(this.resourceInterfaceFqn);
  }

  /**
   * @returns `interfaceType` for the core type Resource
   */
  public get resourceInterfaceFqn() {
    return CoreTypesFqn.ResourceInterface;
  }

  /**
   * @returns `classType` for the core type Token
   */
  public get tokenInterface() {
    return this.sys.findInterface(this.tokenInterfaceFqn);
  }

  /**
   * @returns fqn for the core type Token
   */
  public get tokenInterfaceFqn() {
    return CoreTypesFqn.ResolvableInterface;
  }

  public get physicalNameClass() {
    return this.sys.findClass(CoreTypesFqn.PhysicalName);
  }

  private readonly sys: reflect.TypeSystem;

  constructor(sys: reflect.TypeSystem) {
    this.sys = sys;
    if (!sys.includesAssembly(CORE_MODULE)) {
      // disable-all-checks
      return;
    }
  }
}
