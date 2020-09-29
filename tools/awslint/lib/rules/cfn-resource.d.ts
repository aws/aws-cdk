import * as reflect from 'jsii-reflect';
import { Linter } from '../linter';
export declare const cfnResourceLinter: Linter<CfnResourceReflection>;
export declare class CfnResourceReflection {
    /**
     * Finds a Cfn resource class by full CloudFormation resource name (e.g. `AWS::S3::Bucket`)
     * @param fullName first two components are case-insensitive (e.g. `aws::s3::Bucket` is equivalent to `Aws::S3::Bucket`)
     */
    static findByName(sys: reflect.TypeSystem, fullName: string): CfnResourceReflection | undefined;
    /**
     * Returns all CFN resource classes within an assembly.
     */
    static findAll(assembly: reflect.Assembly): CfnResourceReflection[];
    readonly classType: reflect.ClassType;
    readonly fullname: string;
    readonly namespace: string;
    readonly basename: string;
    readonly attributeNames: string[];
    readonly doc: string;
    constructor(cls: reflect.ClassType);
    private attributePropertyNameFromCfnName;
}
