import { schema } from '@aws-cdk/cfnspec';
export interface CodeGeneratorOptions {
    /**
     * How to import the core library.
     *
     * @default '@aws-cdk/core'
     */
    readonly coreImport?: string;
}
/**
 * Emits classes for all resource types
 */
export default class CodeGenerator {
    private readonly spec;
    private readonly affix;
    readonly outputFile: string;
    readonly resources: Record<string, string>;
    private code;
    /**
     * Creates the code generator.
     * @param moduleName the name of the module (used to determine the file name).
     * @param spec     CloudFormation resource specification
     */
    constructor(moduleName: string, spec: schema.Specification, affix: string, options?: CodeGeneratorOptions);
    emitCode(): void;
    /**
     * Saves the generated file.
     */
    save(dir: string): Promise<string[]>;
    /**
     * Emits classes for all property types
     */
    private emitPropertyTypes;
    private openClass;
    private closeClass;
    private emitPropsType;
    /**
     * Emit TypeScript for each of the CloudFormation properties, while renaming
     *
     * Return a mapping of { originalName -> newName }.
     */
    private emitPropsTypeProperties;
    private emitResourceType;
    /**
     * We resolve here.
     *
     * Since resolve() deep-resolves, we only need to do this once.
     */
    private emitCloudFormationProperties;
    /**
     * Add validations for the given construct
     *
     * The generated code looks like this:
     *
     * ```
     * this.node.addValidation({ validate: () => /* validation code * / });
     * }
     * ```
     */
    private emitConstructValidator;
    /**
     * Emit the function that is going to implement the IInspectable interface.
     *
     * The generated code looks like this:
     * public inspect(inspector: cdk.TreeInspector) {
     *     inspector.addAttribute("aws:cdk:cloudformation:type", CfnManagedPolicy.CFN_RESOURCE_TYPE_NAME);
     *     inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
     * }
     *
     */
    private emitTreeAttributes;
    /**
     * Emit the function that is going to map the generated TypeScript object back into the schema that CloudFormation expects
     *
     * The generated code looks like this:
     *
     *  function bucketPropsToCloudFormation(properties: any): any {
     *    if (!cdk.canInspect(properties)) return properties;
     *    BucketPropsValidator(properties).assertSuccess();
     *    return {
     *      AccelerateConfiguration: bucketAccelerateConfigurationPropertyToCloudFormation(properties.accelerateConfiguration),
     *      AccessControl: cdk.stringToCloudFormation(properties.accessControl),
     *      AnalyticsConfigurations: cdk.listMapper(bucketAnalyticsConfigurationPropertyToCloudFormation)
     *                                          (properties.analyticsConfigurations),
     *      // ...
     *    };
     *  }
     *
     * Generated as a top-level function outside any namespace so we can hide it from library consumers.
     */
    private emitCloudFormationMapper;
    /**
     * Generates a function that converts from a pure CloudFormation value taken from a template
     * to an instance of the given CDK struct.
     * This involves changing the casing of the properties,
     * from UpperCamelCase used by CloudFormation,
     * to lowerCamelCase used by the CDK,
     * and also translating things like IResolvable into strings, numbers or string arrays,
     * depending on the type of the L1 property.
     */
    private emitFromCfnFactoryFunction;
    /**
     * Emit a function that will validate whether the given property bag matches the schema of this complex type
     *
     * Generated as a top-level function outside any namespace so we can hide it from library consumers.
     */
    private emitPropertiesValidator;
    private emitInterfaceProperty;
    private emitClassProperty;
    private emitProperty;
    private beginNamespace;
    private endNamespace;
    private emitPropertyType;
    /**
     * Return the native type expression for the given propSpec
     */
    private findNativeType;
    /**
     * Render a CodeName to a string representation of it in TypeScript
     */
    private renderCodeName;
    private renderTypeUnion;
    private docLink;
}
