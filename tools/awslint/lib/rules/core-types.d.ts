import * as reflect from 'jsii-reflect';
export declare class CoreTypes {
    /**
     * @returns true if assembly has the Core module
     */
    static hasCoreModule(assembly: reflect.Assembly): boolean;
    /**
     * @returns true if `classType` represents an L1 Cfn Resource
     */
    static isCfnResource(c: reflect.ClassType): boolean;
    /**
     * @returns true if `classType` represents a Construct
     */
    static isConstructClass(c: reflect.ClassType): boolean;
    /**
     * @returns true if `classType` represents an AWS resource (i.e. extends `cdk.Resource`).
     */
    static isResourceClass(classType: reflect.ClassType): string | true | undefined;
    /**
     * Return true if the given interface type is a CFN class or prop type
     */
    static isCfnType(interfaceType: reflect.Type): boolean | "" | undefined;
    /**
     * @returns `classType` for the core type Construct
     */
    get constructClass(): reflect.ClassType;
    /**
     * @returns `interfacetype` for the core type Construct
     */
    get constructInterface(): reflect.InterfaceType;
    /**
     * @returns `classType` for the core type Construct
     */
    get resourceClass(): reflect.ClassType;
    /**
     * @returns `interfaceType` for the core type Resource
     */
    get resourceInterface(): reflect.InterfaceType;
    /**
     * @returns `classType` for the core type Token
     */
    get tokenInterface(): reflect.InterfaceType;
    get physicalNameClass(): reflect.ClassType;
    private readonly sys;
    constructor(sys: reflect.TypeSystem);
}
