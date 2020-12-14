import * as reflect from 'jsii-reflect';
import { getDocTag } from './util';

const CORE_MODULE = '@aws-cdk/core';
enum CoreTypesFqn {
  CfnResource = '@aws-cdk/core.CfnResource',
  Resource = '@aws-cdk/core.Resource',
  ResourceInterface = '@aws-cdk/core.IResource',
  ResolvableInterface = '@aws-cdk/core.IResolvable',
  PhysicalName = '@aws-cdk/core.PhysicalName',

  BaseConstruct = 'constructs.Construct',
  BaseConstructInterface = 'constructs.Construct',

  /** @deprecated - use BaseConstruct */
  Construct = '@aws-cdk/core.Construct',
  /** @deprecated - use BaseConstructInterface */
  ConstructInterface = '@aws-cdk/core.IConstruct',
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
   * Return true if the given interface type is a CFN class or prop type
   */
  public static isCfnType(interfaceType: reflect.Type) {
    return interfaceType.name.startsWith('Cfn') || (interfaceType.namespace && interfaceType.namespace.startsWith('Cfn'));
  }

  /**
   * @returns `classType` for the core type Construct
   * @deprecated - use `baseConstructClass()`
   */
  public get constructClass() {
    return this.sys.findClass(CoreTypesFqn.Construct);
  }

  /**
   * @returns `classType` for the core type Construct
   */
  public get baseConstructClass() {
    return this.sys.findClass(CoreTypesFqn.BaseConstruct);
  }

  /**
   * @returns `interfacetype` for the core type Construct
   * @deprecated - use `baseConstructInterface()`
   */
  public get constructInterface() {
    return this.sys.findInterface(CoreTypesFqn.ConstructInterface);
  }

  /**
   * @returns `interfacetype` for the core type Construct
   */
  public get baseConstructInterface() {
    return this.sys.findInterface(CoreTypesFqn.BaseConstructInterface);
  }

  /**
   * @returns `classType` for the core type Construct
   */
  public get resourceClass() {
    return this.sys.findClass(CoreTypesFqn.Resource);
  }

  /**
   * @returns `interfaceType` for the core type Resource
   */
  public get resourceInterface() {
    return this.sys.findInterface(CoreTypesFqn.ResourceInterface);
  }

  /**
   * @returns `classType` for the core type Token
   */
  public get tokenInterface() {
    return this.sys.findInterface(CoreTypesFqn.ResolvableInterface);
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

    for (const fqn of Object.values(CoreTypesFqn)) {
      if (!this.sys.tryFindFqn(fqn)) {
        throw new Error(`core FQN type not found: ${fqn}`);
      }
    }
  }
}
