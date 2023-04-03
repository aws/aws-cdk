import { Stack } from '@aws-cdk/core';
/**
 * Suite of assertions that can be run on a CDK stack.
 * Typically used, as part of unit tests, to validate that the rendered
 * CloudFormation template has expected resources and properties.
 */
export declare class Template {
    /**
     * Base your assertions on the CloudFormation template synthesized by a CDK `Stack`.
     * @param stack the CDK Stack to run assertions on
     * @param templateParsingOptions Optional param to configure template parsing behavior, such as disregarding circular
     * dependencies.
     */
    static fromStack(stack: Stack, templateParsingOptions?: TemplateParsingOptions): Template;
    /**
     * Base your assertions from an existing CloudFormation template formatted as an in-memory
     * JSON object.
     * @param template the CloudFormation template formatted as a nested set of records
     * @param templateParsingOptions Optional param to configure template parsing behavior, such as disregarding circular
     * dependencies.
     */
    static fromJSON(template: {
        [key: string]: any;
    }, templateParsingOptions?: TemplateParsingOptions): Template;
    /**
     * Base your assertions from an existing CloudFormation template formatted as a
     * JSON string.
     * @param template the CloudFormation template in
     * @param templateParsingOptions Optional param to configure template parsing behavior, such as disregarding circular
     * dependencies.
     */
    static fromString(template: string, templateParsingOptions?: TemplateParsingOptions): Template;
    private readonly template;
    private constructor();
    /**
     * The CloudFormation template deserialized into an object.
     */
    toJSON(): {
        [key: string]: any;
    };
    /**
     * Assert that the given number of resources of the given type exist in the
     * template.
     * @param type the resource type; ex: `AWS::S3::Bucket`
     * @param count number of expected instances
     */
    resourceCountIs(type: string, count: number): void;
    /**
     * Assert that the given number of resources of the given type and properties exists in the
     * CloudFormation template.
     * @param type the resource type; ex: `AWS::S3::Bucket`
     * @param props the 'Properties' section of the resource as should be expected in the template.
     * @param count number of expected instances
     */
    resourcePropertiesCountIs(type: string, props: any, count: number): void;
    /**
     * Assert that a resource of the given type and properties exists in the
     * CloudFormation template.
     * By default, performs partial matching on the `Properties` key of the resource, via the
     * `Match.objectLike()`. To configure different behavior, use other matchers in the `Match` class.
     * @param type the resource type; ex: `AWS::S3::Bucket`
     * @param props the 'Properties' section of the resource as should be expected in the template.
     */
    hasResourceProperties(type: string, props: any): void;
    /**
     * Assert that a resource of the given type and given definition exists in the
     * CloudFormation template.
     * By default, performs partial matching on the resource, via the `Match.objectLike()`.
     * To configure different behavior, use other matchers in the `Match` class.
     * @param type the resource type; ex: `AWS::S3::Bucket`
     * @param props the entire definition of the resource as should be expected in the template.
     */
    hasResource(type: string, props: any): void;
    /**
     * Get the set of matching resources of a given type and properties in the CloudFormation template.
     * @param type the type to match in the CloudFormation template
     * @param props by default, matches all resources with the given type.
     * When a literal is provided, performs a partial match via `Match.objectLike()`.
     * Use the `Match` APIs to configure a different behaviour.
     */
    findResources(type: string, props?: any): {
        [key: string]: {
            [key: string]: any;
        };
    };
    /**
     * Assert that all resources of the given type contain the given definition in the
     * CloudFormation template.
     * By default, performs partial matching on the resource, via the `Match.objectLike()`.
     * To configure different behavior, use other matchers in the `Match` class.
     * @param type the resource type; ex: `AWS::S3::Bucket`
     * @param props the entire definition of the resources as they should be expected in the template.
     */
    allResources(type: string, props: any): void;
    /**
     * Assert that all resources of the given type contain the given properties
     * CloudFormation template.
     * By default, performs partial matching on the `Properties` key of the resource, via the
     * `Match.objectLike()`. To configure different behavior, use other matchers in the `Match` class.
     * @param type the resource type; ex: `AWS::S3::Bucket`
     * @param props the 'Properties' section of the resource as should be expected in the template.
     */
    allResourcesProperties(type: string, props: any): void;
    /**
     * Assert that a Parameter with the given properties exists in the CloudFormation template.
     * By default, performs partial matching on the parameter, via the `Match.objectLike()`.
     * To configure different behavior, use other matchers in the `Match` class.
     * @param logicalId the name of the parameter. Provide `'*'` to match all parameters in the template.
     * @param props the parameter as should be expected in the template.
     */
    hasParameter(logicalId: string, props: any): void;
    /**
     * Get the set of matching Parameters that match the given properties in the CloudFormation template.
     * @param logicalId the name of the parameter. Provide `'*'` to match all parameters in the template.
     * @param props by default, matches all Parameters in the template.
     * When a literal object is provided, performs a partial match via `Match.objectLike()`.
     * Use the `Match` APIs to configure a different behaviour.
     */
    findParameters(logicalId: string, props?: any): {
        [key: string]: {
            [key: string]: any;
        };
    };
    /**
     * Assert that an Output with the given properties exists in the CloudFormation template.
     * By default, performs partial matching on the resource, via the `Match.objectLike()`.
     * To configure different behavior, use other matchers in the `Match` class.
     * @param logicalId the name of the output. Provide `'*'` to match all outputs in the template.
     * @param props the output as should be expected in the template.
     */
    hasOutput(logicalId: string, props: any): void;
    /**
     * Get the set of matching Outputs that match the given properties in the CloudFormation template.
     * @param logicalId the name of the output. Provide `'*'` to match all outputs in the template.
     * @param props by default, matches all Outputs in the template.
     * When a literal object is provided, performs a partial match via `Match.objectLike()`.
     * Use the `Match` APIs to configure a different behaviour.
     */
    findOutputs(logicalId: string, props?: any): {
        [key: string]: {
            [key: string]: any;
        };
    };
    /**
     * Assert that a Mapping with the given properties exists in the CloudFormation template.
     * By default, performs partial matching on the resource, via the `Match.objectLike()`.
     * To configure different behavior, use other matchers in the `Match` class.
     * @param logicalId the name of the mapping. Provide `'*'` to match all mappings in the template.
     * @param props the output as should be expected in the template.
     */
    hasMapping(logicalId: string, props: any): void;
    /**
     * Get the set of matching Mappings that match the given properties in the CloudFormation template.
     * @param logicalId the name of the mapping. Provide `'*'` to match all mappings in the template.
     * @param props by default, matches all Mappings in the template.
     * When a literal object is provided, performs a partial match via `Match.objectLike()`.
     * Use the `Match` APIs to configure a different behaviour.
     */
    findMappings(logicalId: string, props?: any): {
        [key: string]: {
            [key: string]: any;
        };
    };
    /**
     * Assert that a Condition with the given properties exists in the CloudFormation template.
     * By default, performs partial matching on the resource, via the `Match.objectLike()`.
     * To configure different behavior, use other matchers in the `Match` class.
     * @param logicalId the name of the mapping. Provide `'*'` to match all conditions in the template.
     * @param props the output as should be expected in the template.
     */
    hasCondition(logicalId: string, props: any): void;
    /**
     * Get the set of matching Conditions that match the given properties in the CloudFormation template.
     * @param logicalId the name of the condition. Provide `'*'` to match all conditions in the template.
     * @param props by default, matches all Conditions in the template.
     * When a literal object is provided, performs a partial match via `Match.objectLike()`.
     * Use the `Match` APIs to configure a different behaviour.
     */
    findConditions(logicalId: string, props?: any): {
        [key: string]: {
            [key: string]: any;
        };
    };
    /**
     * Assert that the CloudFormation template matches the given value
     * @param expected the expected CloudFormation template as key-value pairs.
     */
    templateMatches(expected: any): void;
}
/**
 * Options to configure template parsing behavior, such as disregarding circular
 * dependencies.
 */
export interface TemplateParsingOptions {
    /**
     * If set to true, will skip checking for cyclical / circular dependencies. Should be set to false other than for
     * templates that are valid despite containing cycles, such as unprocessed transform stacks.
     *
     * @default false
     */
    readonly skipCyclicalDependenciesCheck?: boolean;
}
