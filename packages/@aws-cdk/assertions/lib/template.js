"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const path = require("path");
const core_1 = require("@aws-cdk/core");
const fs = require("fs-extra");
const match_1 = require("./match");
const matcher_1 = require("./matcher");
const conditions_1 = require("./private/conditions");
const cyclic_1 = require("./private/cyclic");
const mappings_1 = require("./private/mappings");
const outputs_1 = require("./private/outputs");
const parameters_1 = require("./private/parameters");
const resources_1 = require("./private/resources");
/**
 * Suite of assertions that can be run on a CDK stack.
 * Typically used, as part of unit tests, to validate that the rendered
 * CloudFormation template has expected resources and properties.
 */
class Template {
    /**
     * Base your assertions on the CloudFormation template synthesized by a CDK `Stack`.
     * @param stack the CDK Stack to run assertions on
     * @param templateParsingOptions Optional param to configure template parsing behavior, such as disregarding circular
     * dependencies.
     */
    static fromStack(stack, templateParsingOptions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_assertions_TemplateParsingOptions(templateParsingOptions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromStack);
            }
            throw error;
        }
        return new Template(toTemplate(stack), templateParsingOptions);
    }
    /**
     * Base your assertions from an existing CloudFormation template formatted as an in-memory
     * JSON object.
     * @param template the CloudFormation template formatted as a nested set of records
     * @param templateParsingOptions Optional param to configure template parsing behavior, such as disregarding circular
     * dependencies.
     */
    static fromJSON(template, templateParsingOptions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_assertions_TemplateParsingOptions(templateParsingOptions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromJSON);
            }
            throw error;
        }
        return new Template(template, templateParsingOptions);
    }
    /**
     * Base your assertions from an existing CloudFormation template formatted as a
     * JSON string.
     * @param template the CloudFormation template in
     * @param templateParsingOptions Optional param to configure template parsing behavior, such as disregarding circular
     * dependencies.
     */
    static fromString(template, templateParsingOptions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_assertions_TemplateParsingOptions(templateParsingOptions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromString);
            }
            throw error;
        }
        return new Template(JSON.parse(template), templateParsingOptions);
    }
    constructor(template, templateParsingOptions = {}) {
        this.template = template;
        if (!templateParsingOptions?.skipCyclicalDependenciesCheck ?? true) {
            (0, cyclic_1.checkTemplateForCyclicDependencies)(this.template);
        }
    }
    /**
     * The CloudFormation template deserialized into an object.
     */
    toJSON() {
        return this.template;
    }
    /**
     * Assert that the given number of resources of the given type exist in the
     * template.
     * @param type the resource type; ex: `AWS::S3::Bucket`
     * @param count number of expected instances
     */
    resourceCountIs(type, count) {
        const counted = (0, resources_1.countResources)(this.template, type);
        if (counted !== count) {
            throw new Error(`Expected ${count} resources of type ${type} but found ${counted}`);
        }
    }
    /**
     * Assert that the given number of resources of the given type and properties exists in the
     * CloudFormation template.
     * @param type the resource type; ex: `AWS::S3::Bucket`
     * @param props the 'Properties' section of the resource as should be expected in the template.
     * @param count number of expected instances
     */
    resourcePropertiesCountIs(type, props, count) {
        const counted = (0, resources_1.countResourcesProperties)(this.template, type, props);
        if (counted !== count) {
            throw new Error(`Expected ${count} resources of type ${type} but found ${counted}`);
        }
    }
    /**
     * Assert that a resource of the given type and properties exists in the
     * CloudFormation template.
     * By default, performs partial matching on the `Properties` key of the resource, via the
     * `Match.objectLike()`. To configure different behavior, use other matchers in the `Match` class.
     * @param type the resource type; ex: `AWS::S3::Bucket`
     * @param props the 'Properties' section of the resource as should be expected in the template.
     */
    hasResourceProperties(type, props) {
        const matchError = (0, resources_1.hasResourceProperties)(this.template, type, props);
        if (matchError) {
            throw new Error(matchError);
        }
    }
    /**
     * Assert that a resource of the given type and given definition exists in the
     * CloudFormation template.
     * By default, performs partial matching on the resource, via the `Match.objectLike()`.
     * To configure different behavior, use other matchers in the `Match` class.
     * @param type the resource type; ex: `AWS::S3::Bucket`
     * @param props the entire definition of the resource as should be expected in the template.
     */
    hasResource(type, props) {
        const matchError = (0, resources_1.hasResource)(this.template, type, props);
        if (matchError) {
            throw new Error(matchError);
        }
    }
    /**
     * Get the set of matching resources of a given type and properties in the CloudFormation template.
     * @param type the type to match in the CloudFormation template
     * @param props by default, matches all resources with the given type.
     * When a literal is provided, performs a partial match via `Match.objectLike()`.
     * Use the `Match` APIs to configure a different behaviour.
     */
    findResources(type, props = {}) {
        return (0, resources_1.findResources)(this.template, type, props);
    }
    /**
     * Assert that all resources of the given type contain the given definition in the
     * CloudFormation template.
     * By default, performs partial matching on the resource, via the `Match.objectLike()`.
     * To configure different behavior, use other matchers in the `Match` class.
     * @param type the resource type; ex: `AWS::S3::Bucket`
     * @param props the entire definition of the resources as they should be expected in the template.
     */
    allResources(type, props) {
        const matchError = (0, resources_1.allResources)(this.template, type, props);
        if (matchError) {
            throw new Error(matchError);
        }
    }
    /**
     * Assert that all resources of the given type contain the given properties
     * CloudFormation template.
     * By default, performs partial matching on the `Properties` key of the resource, via the
     * `Match.objectLike()`. To configure different behavior, use other matchers in the `Match` class.
     * @param type the resource type; ex: `AWS::S3::Bucket`
     * @param props the 'Properties' section of the resource as should be expected in the template.
     */
    allResourcesProperties(type, props) {
        const matchError = (0, resources_1.allResourcesProperties)(this.template, type, props);
        if (matchError) {
            throw new Error(matchError);
        }
    }
    /**
     * Assert that a Parameter with the given properties exists in the CloudFormation template.
     * By default, performs partial matching on the parameter, via the `Match.objectLike()`.
     * To configure different behavior, use other matchers in the `Match` class.
     * @param logicalId the name of the parameter. Provide `'*'` to match all parameters in the template.
     * @param props the parameter as should be expected in the template.
     */
    hasParameter(logicalId, props) {
        const matchError = (0, parameters_1.hasParameter)(this.template, logicalId, props);
        if (matchError) {
            throw new Error(matchError);
        }
    }
    /**
     * Get the set of matching Parameters that match the given properties in the CloudFormation template.
     * @param logicalId the name of the parameter. Provide `'*'` to match all parameters in the template.
     * @param props by default, matches all Parameters in the template.
     * When a literal object is provided, performs a partial match via `Match.objectLike()`.
     * Use the `Match` APIs to configure a different behaviour.
     */
    findParameters(logicalId, props = {}) {
        return (0, parameters_1.findParameters)(this.template, logicalId, props);
    }
    /**
     * Assert that an Output with the given properties exists in the CloudFormation template.
     * By default, performs partial matching on the resource, via the `Match.objectLike()`.
     * To configure different behavior, use other matchers in the `Match` class.
     * @param logicalId the name of the output. Provide `'*'` to match all outputs in the template.
     * @param props the output as should be expected in the template.
     */
    hasOutput(logicalId, props) {
        const matchError = (0, outputs_1.hasOutput)(this.template, logicalId, props);
        if (matchError) {
            throw new Error(matchError);
        }
    }
    /**
     * Get the set of matching Outputs that match the given properties in the CloudFormation template.
     * @param logicalId the name of the output. Provide `'*'` to match all outputs in the template.
     * @param props by default, matches all Outputs in the template.
     * When a literal object is provided, performs a partial match via `Match.objectLike()`.
     * Use the `Match` APIs to configure a different behaviour.
     */
    findOutputs(logicalId, props = {}) {
        return (0, outputs_1.findOutputs)(this.template, logicalId, props);
    }
    /**
     * Assert that a Mapping with the given properties exists in the CloudFormation template.
     * By default, performs partial matching on the resource, via the `Match.objectLike()`.
     * To configure different behavior, use other matchers in the `Match` class.
     * @param logicalId the name of the mapping. Provide `'*'` to match all mappings in the template.
     * @param props the output as should be expected in the template.
     */
    hasMapping(logicalId, props) {
        const matchError = (0, mappings_1.hasMapping)(this.template, logicalId, props);
        if (matchError) {
            throw new Error(matchError);
        }
    }
    /**
     * Get the set of matching Mappings that match the given properties in the CloudFormation template.
     * @param logicalId the name of the mapping. Provide `'*'` to match all mappings in the template.
     * @param props by default, matches all Mappings in the template.
     * When a literal object is provided, performs a partial match via `Match.objectLike()`.
     * Use the `Match` APIs to configure a different behaviour.
     */
    findMappings(logicalId, props = {}) {
        return (0, mappings_1.findMappings)(this.template, logicalId, props);
    }
    /**
     * Assert that a Condition with the given properties exists in the CloudFormation template.
     * By default, performs partial matching on the resource, via the `Match.objectLike()`.
     * To configure different behavior, use other matchers in the `Match` class.
     * @param logicalId the name of the mapping. Provide `'*'` to match all conditions in the template.
     * @param props the output as should be expected in the template.
     */
    hasCondition(logicalId, props) {
        const matchError = (0, conditions_1.hasCondition)(this.template, logicalId, props);
        if (matchError) {
            throw new Error(matchError);
        }
    }
    /**
     * Get the set of matching Conditions that match the given properties in the CloudFormation template.
     * @param logicalId the name of the condition. Provide `'*'` to match all conditions in the template.
     * @param props by default, matches all Conditions in the template.
     * When a literal object is provided, performs a partial match via `Match.objectLike()`.
     * Use the `Match` APIs to configure a different behaviour.
     */
    findConditions(logicalId, props = {}) {
        return (0, conditions_1.findConditions)(this.template, logicalId, props);
    }
    /**
     * Assert that the CloudFormation template matches the given value
     * @param expected the expected CloudFormation template as key-value pairs.
     */
    templateMatches(expected) {
        const matcher = matcher_1.Matcher.isMatcher(expected) ? expected : match_1.Match.objectLike(expected);
        const result = matcher.test(this.template);
        if (result.hasFailed()) {
            throw new Error([
                'Template did not match as expected. The following mismatches were found:',
                ...result.toHumanStrings().map(s => `\t${s}`),
            ].join('\n'));
        }
    }
}
_a = JSII_RTTI_SYMBOL_1;
Template[_a] = { fqn: "@aws-cdk/assertions.Template", version: "0.0.0" };
exports.Template = Template;
function toTemplate(stack) {
    const root = stack.node.root;
    if (!core_1.Stage.isStage(root)) {
        throw new Error('unexpected: all stacks must be part of a Stage or an App');
    }
    const assembly = root.synth();
    if (stack.nestedStackParent) {
        // if this is a nested stack (it has a parent), then just read the template as a string
        return JSON.parse(fs.readFileSync(path.join(assembly.directory, stack.templateFile)).toString('utf-8'));
    }
    return assembly.getStackArtifact(stack.artifactId).template;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw2QkFBNkI7QUFDN0Isd0NBQTZDO0FBQzdDLCtCQUErQjtBQUMvQixtQ0FBZ0M7QUFDaEMsdUNBQW9DO0FBQ3BDLHFEQUFvRTtBQUNwRSw2Q0FBc0U7QUFDdEUsaURBQThEO0FBQzlELCtDQUEyRDtBQUMzRCxxREFBb0U7QUFDcEUsbURBQXdLO0FBR3hLOzs7O0dBSUc7QUFDSCxNQUFhLFFBQVE7SUFFbkI7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQVksRUFBRSxzQkFBK0M7Ozs7Ozs7Ozs7UUFDbkYsT0FBTyxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztLQUNoRTtJQUVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBaUMsRUFBRSxzQkFBK0M7Ozs7Ozs7Ozs7UUFDdkcsT0FBTyxJQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztLQUN2RDtJQUVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBZ0IsRUFBRSxzQkFBK0M7Ozs7Ozs7Ozs7UUFDeEYsT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLHNCQUFzQixDQUFDLENBQUM7S0FDbkU7SUFJRCxZQUFvQixRQUFnQyxFQUFFLHlCQUFpRCxFQUFFO1FBQ3ZHLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBd0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsNkJBQTZCLElBQUksSUFBSSxFQUFFO1lBQ2xFLElBQUEsMkNBQWtDLEVBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ25EO0tBQ0Y7SUFFRDs7T0FFRztJQUNJLE1BQU07UUFDWCxP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QUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ3pHO0lBQ0QsT0FBTyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUM5RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IFN0YWNrLCBTdGFnZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgTWF0Y2ggfSBmcm9tICcuL21hdGNoJztcbmltcG9ydCB7IE1hdGNoZXIgfSBmcm9tICcuL21hdGNoZXInO1xuaW1wb3J0IHsgZmluZENvbmRpdGlvbnMsIGhhc0NvbmRpdGlvbiB9IGZyb20gJy4vcHJpdmF0ZS9jb25kaXRpb25zJztcbmltcG9ydCB7IGNoZWNrVGVtcGxhdGVGb3JDeWNsaWNEZXBlbmRlbmNpZXMgfSBmcm9tICcuL3ByaXZhdGUvY3ljbGljJztcbmltcG9ydCB7IGZpbmRNYXBwaW5ncywgaGFzTWFwcGluZyB9IGZyb20gJy4vcHJpdmF0ZS9tYXBwaW5ncyc7XG5pbXBvcnQgeyBmaW5kT3V0cHV0cywgaGFzT3V0cHV0IH0gZnJvbSAnLi9wcml2YXRlL291dHB1dHMnO1xuaW1wb3J0IHsgZmluZFBhcmFtZXRlcnMsIGhhc1BhcmFtZXRlciB9IGZyb20gJy4vcHJpdmF0ZS9wYXJhbWV0ZXJzJztcbmltcG9ydCB7IGFsbFJlc291cmNlcywgYWxsUmVzb3VyY2VzUHJvcGVydGllcywgY291bnRSZXNvdXJjZXMsIGNvdW50UmVzb3VyY2VzUHJvcGVydGllcywgZmluZFJlc291cmNlcywgaGFzUmVzb3VyY2UsIGhhc1Jlc291cmNlUHJvcGVydGllcyB9IGZyb20gJy4vcHJpdmF0ZS9yZXNvdXJjZXMnO1xuaW1wb3J0IHsgVGVtcGxhdGUgYXMgVGVtcGxhdGVUeXBlIH0gZnJvbSAnLi9wcml2YXRlL3RlbXBsYXRlJztcblxuLyoqXG4gKiBTdWl0ZSBvZiBhc3NlcnRpb25zIHRoYXQgY2FuIGJlIHJ1biBvbiBhIENESyBzdGFjay5cbiAqIFR5cGljYWxseSB1c2VkLCBhcyBwYXJ0IG9mIHVuaXQgdGVzdHMsIHRvIHZhbGlkYXRlIHRoYXQgdGhlIHJlbmRlcmVkXG4gKiBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBoYXMgZXhwZWN0ZWQgcmVzb3VyY2VzIGFuZCBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgY2xhc3MgVGVtcGxhdGUge1xuXG4gIC8qKlxuICAgKiBCYXNlIHlvdXIgYXNzZXJ0aW9ucyBvbiB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgc3ludGhlc2l6ZWQgYnkgYSBDREsgYFN0YWNrYC5cbiAgICogQHBhcmFtIHN0YWNrIHRoZSBDREsgU3RhY2sgdG8gcnVuIGFzc2VydGlvbnMgb25cbiAgICogQHBhcmFtIHRlbXBsYXRlUGFyc2luZ09wdGlvbnMgT3B0aW9uYWwgcGFyYW0gdG8gY29uZmlndXJlIHRlbXBsYXRlIHBhcnNpbmcgYmVoYXZpb3IsIHN1Y2ggYXMgZGlzcmVnYXJkaW5nIGNpcmN1bGFyXG4gICAqIGRlcGVuZGVuY2llcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVN0YWNrKHN0YWNrOiBTdGFjaywgdGVtcGxhdGVQYXJzaW5nT3B0aW9ucz86IFRlbXBsYXRlUGFyc2luZ09wdGlvbnMpOiBUZW1wbGF0ZSB7XG4gICAgcmV0dXJuIG5ldyBUZW1wbGF0ZSh0b1RlbXBsYXRlKHN0YWNrKSwgdGVtcGxhdGVQYXJzaW5nT3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQmFzZSB5b3VyIGFzc2VydGlvbnMgZnJvbSBhbiBleGlzdGluZyBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBmb3JtYXR0ZWQgYXMgYW4gaW4tbWVtb3J5XG4gICAqIEpTT04gb2JqZWN0LlxuICAgKiBAcGFyYW0gdGVtcGxhdGUgdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIGZvcm1hdHRlZCBhcyBhIG5lc3RlZCBzZXQgb2YgcmVjb3Jkc1xuICAgKiBAcGFyYW0gdGVtcGxhdGVQYXJzaW5nT3B0aW9ucyBPcHRpb25hbCBwYXJhbSB0byBjb25maWd1cmUgdGVtcGxhdGUgcGFyc2luZyBiZWhhdmlvciwgc3VjaCBhcyBkaXNyZWdhcmRpbmcgY2lyY3VsYXJcbiAgICogZGVwZW5kZW5jaWVzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tSlNPTih0ZW1wbGF0ZTogeyBba2V5OiBzdHJpbmddIDogYW55IH0sIHRlbXBsYXRlUGFyc2luZ09wdGlvbnM/OiBUZW1wbGF0ZVBhcnNpbmdPcHRpb25zKTogVGVtcGxhdGUge1xuICAgIHJldHVybiBuZXcgVGVtcGxhdGUodGVtcGxhdGUsIHRlbXBsYXRlUGFyc2luZ09wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJhc2UgeW91ciBhc3NlcnRpb25zIGZyb20gYW4gZXhpc3RpbmcgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgZm9ybWF0dGVkIGFzIGFcbiAgICogSlNPTiBzdHJpbmcuXG4gICAqIEBwYXJhbSB0ZW1wbGF0ZSB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgaW5cbiAgICogQHBhcmFtIHRlbXBsYXRlUGFyc2luZ09wdGlvbnMgT3B0aW9uYWwgcGFyYW0gdG8gY29uZmlndXJlIHRlbXBsYXRlIHBhcnNpbmcgYmVoYXZpb3IsIHN1Y2ggYXMgZGlzcmVnYXJkaW5nIGNpcmN1bGFyXG4gICAqIGRlcGVuZGVuY2llcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVN0cmluZyh0ZW1wbGF0ZTogc3RyaW5nLCB0ZW1wbGF0ZVBhcnNpbmdPcHRpb25zPzogVGVtcGxhdGVQYXJzaW5nT3B0aW9ucyk6IFRlbXBsYXRlIHtcbiAgICByZXR1cm4gbmV3IFRlbXBsYXRlKEpTT04ucGFyc2UodGVtcGxhdGUpLCB0ZW1wbGF0ZVBhcnNpbmdPcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgdGVtcGxhdGU6IFRlbXBsYXRlVHlwZTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHRlbXBsYXRlOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCB0ZW1wbGF0ZVBhcnNpbmdPcHRpb25zOiBUZW1wbGF0ZVBhcnNpbmdPcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGUgYXMgVGVtcGxhdGVUeXBlO1xuICAgIGlmICghdGVtcGxhdGVQYXJzaW5nT3B0aW9ucz8uc2tpcEN5Y2xpY2FsRGVwZW5kZW5jaWVzQ2hlY2sgPz8gdHJ1ZSkge1xuICAgICAgY2hlY2tUZW1wbGF0ZUZvckN5Y2xpY0RlcGVuZGVuY2llcyh0aGlzLnRlbXBsYXRlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIGRlc2VyaWFsaXplZCBpbnRvIGFuIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyB0b0pTT04oKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGU7XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgdGhlIGdpdmVuIG51bWJlciBvZiByZXNvdXJjZXMgb2YgdGhlIGdpdmVuIHR5cGUgZXhpc3QgaW4gdGhlXG4gICAqIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gdHlwZSB0aGUgcmVzb3VyY2UgdHlwZTsgZXg6IGBBV1M6OlMzOjpCdWNrZXRgXG4gICAqIEBwYXJhbSBjb3VudCBudW1iZXIgb2YgZXhwZWN0ZWQgaW5zdGFuY2VzXG4gICAqL1xuICBwdWJsaWMgcmVzb3VyY2VDb3VudElzKHR5cGU6IHN0cmluZywgY291bnQ6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGNvdW50ZWQgPSBjb3VudFJlc291cmNlcyh0aGlzLnRlbXBsYXRlLCB0eXBlKTtcbiAgICBpZiAoY291bnRlZCAhPT0gY291bnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgJHtjb3VudH0gcmVzb3VyY2VzIG9mIHR5cGUgJHt0eXBlfSBidXQgZm91bmQgJHtjb3VudGVkfWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnQgdGhhdCB0aGUgZ2l2ZW4gbnVtYmVyIG9mIHJlc291cmNlcyBvZiB0aGUgZ2l2ZW4gdHlwZSBhbmQgcHJvcGVydGllcyBleGlzdHMgaW4gdGhlXG4gICAqIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gdHlwZSB0aGUgcmVzb3VyY2UgdHlwZTsgZXg6IGBBV1M6OlMzOjpCdWNrZXRgXG4gICAqIEBwYXJhbSBwcm9wcyB0aGUgJ1Byb3BlcnRpZXMnIHNlY3Rpb24gb2YgdGhlIHJlc291cmNlIGFzIHNob3VsZCBiZSBleHBlY3RlZCBpbiB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSBjb3VudCBudW1iZXIgb2YgZXhwZWN0ZWQgaW5zdGFuY2VzXG4gICAqL1xuICBwdWJsaWMgcmVzb3VyY2VQcm9wZXJ0aWVzQ291bnRJcyh0eXBlOiBzdHJpbmcsIHByb3BzOiBhbnksIGNvdW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBjb3VudGVkID0gY291bnRSZXNvdXJjZXNQcm9wZXJ0aWVzKHRoaXMudGVtcGxhdGUsIHR5cGUsIHByb3BzKTtcbiAgICBpZiAoY291bnRlZCAhPT0gY291bnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgJHtjb3VudH0gcmVzb3VyY2VzIG9mIHR5cGUgJHt0eXBlfSBidXQgZm91bmQgJHtjb3VudGVkfWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnQgdGhhdCBhIHJlc291cmNlIG9mIHRoZSBnaXZlbiB0eXBlIGFuZCBwcm9wZXJ0aWVzIGV4aXN0cyBpbiB0aGVcbiAgICogQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuXG4gICAqIEJ5IGRlZmF1bHQsIHBlcmZvcm1zIHBhcnRpYWwgbWF0Y2hpbmcgb24gdGhlIGBQcm9wZXJ0aWVzYCBrZXkgb2YgdGhlIHJlc291cmNlLCB2aWEgdGhlXG4gICAqIGBNYXRjaC5vYmplY3RMaWtlKClgLiBUbyBjb25maWd1cmUgZGlmZmVyZW50IGJlaGF2aW9yLCB1c2Ugb3RoZXIgbWF0Y2hlcnMgaW4gdGhlIGBNYXRjaGAgY2xhc3MuXG4gICAqIEBwYXJhbSB0eXBlIHRoZSByZXNvdXJjZSB0eXBlOyBleDogYEFXUzo6UzM6OkJ1Y2tldGBcbiAgICogQHBhcmFtIHByb3BzIHRoZSAnUHJvcGVydGllcycgc2VjdGlvbiBvZiB0aGUgcmVzb3VyY2UgYXMgc2hvdWxkIGJlIGV4cGVjdGVkIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICovXG4gIHB1YmxpYyBoYXNSZXNvdXJjZVByb3BlcnRpZXModHlwZTogc3RyaW5nLCBwcm9wczogYW55KTogdm9pZCB7XG4gICAgY29uc3QgbWF0Y2hFcnJvciA9IGhhc1Jlc291cmNlUHJvcGVydGllcyh0aGlzLnRlbXBsYXRlLCB0eXBlLCBwcm9wcyk7XG4gICAgaWYgKG1hdGNoRXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtYXRjaEVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgYSByZXNvdXJjZSBvZiB0aGUgZ2l2ZW4gdHlwZSBhbmQgZ2l2ZW4gZGVmaW5pdGlvbiBleGlzdHMgaW4gdGhlXG4gICAqIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlLlxuICAgKiBCeSBkZWZhdWx0LCBwZXJmb3JtcyBwYXJ0aWFsIG1hdGNoaW5nIG9uIHRoZSByZXNvdXJjZSwgdmlhIHRoZSBgTWF0Y2gub2JqZWN0TGlrZSgpYC5cbiAgICogVG8gY29uZmlndXJlIGRpZmZlcmVudCBiZWhhdmlvciwgdXNlIG90aGVyIG1hdGNoZXJzIGluIHRoZSBgTWF0Y2hgIGNsYXNzLlxuICAgKiBAcGFyYW0gdHlwZSB0aGUgcmVzb3VyY2UgdHlwZTsgZXg6IGBBV1M6OlMzOjpCdWNrZXRgXG4gICAqIEBwYXJhbSBwcm9wcyB0aGUgZW50aXJlIGRlZmluaXRpb24gb2YgdGhlIHJlc291cmNlIGFzIHNob3VsZCBiZSBleHBlY3RlZCBpbiB0aGUgdGVtcGxhdGUuXG4gICAqL1xuICBwdWJsaWMgaGFzUmVzb3VyY2UodHlwZTogc3RyaW5nLCBwcm9wczogYW55KTogdm9pZCB7XG4gICAgY29uc3QgbWF0Y2hFcnJvciA9IGhhc1Jlc291cmNlKHRoaXMudGVtcGxhdGUsIHR5cGUsIHByb3BzKTtcbiAgICBpZiAobWF0Y2hFcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1hdGNoRXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHNldCBvZiBtYXRjaGluZyByZXNvdXJjZXMgb2YgYSBnaXZlbiB0eXBlIGFuZCBwcm9wZXJ0aWVzIGluIHRoZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHR5cGUgdGhlIHR5cGUgdG8gbWF0Y2ggaW4gdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlXG4gICAqIEBwYXJhbSBwcm9wcyBieSBkZWZhdWx0LCBtYXRjaGVzIGFsbCByZXNvdXJjZXMgd2l0aCB0aGUgZ2l2ZW4gdHlwZS5cbiAgICogV2hlbiBhIGxpdGVyYWwgaXMgcHJvdmlkZWQsIHBlcmZvcm1zIGEgcGFydGlhbCBtYXRjaCB2aWEgYE1hdGNoLm9iamVjdExpa2UoKWAuXG4gICAqIFVzZSB0aGUgYE1hdGNoYCBBUElzIHRvIGNvbmZpZ3VyZSBhIGRpZmZlcmVudCBiZWhhdmlvdXIuXG4gICAqL1xuICBwdWJsaWMgZmluZFJlc291cmNlcyh0eXBlOiBzdHJpbmcsIHByb3BzOiBhbnkgPSB7fSk6IHsgW2tleTogc3RyaW5nXTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB9IHtcbiAgICByZXR1cm4gZmluZFJlc291cmNlcyh0aGlzLnRlbXBsYXRlLCB0eXBlLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgYWxsIHJlc291cmNlcyBvZiB0aGUgZ2l2ZW4gdHlwZSBjb250YWluIHRoZSBnaXZlbiBkZWZpbml0aW9uIGluIHRoZVxuICAgKiBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZS5cbiAgICogQnkgZGVmYXVsdCwgcGVyZm9ybXMgcGFydGlhbCBtYXRjaGluZyBvbiB0aGUgcmVzb3VyY2UsIHZpYSB0aGUgYE1hdGNoLm9iamVjdExpa2UoKWAuXG4gICAqIFRvIGNvbmZpZ3VyZSBkaWZmZXJlbnQgYmVoYXZpb3IsIHVzZSBvdGhlciBtYXRjaGVycyBpbiB0aGUgYE1hdGNoYCBjbGFzcy5cbiAgICogQHBhcmFtIHR5cGUgdGhlIHJlc291cmNlIHR5cGU7IGV4OiBgQVdTOjpTMzo6QnVja2V0YFxuICAgKiBAcGFyYW0gcHJvcHMgdGhlIGVudGlyZSBkZWZpbml0aW9uIG9mIHRoZSByZXNvdXJjZXMgYXMgdGhleSBzaG91bGQgYmUgZXhwZWN0ZWQgaW4gdGhlIHRlbXBsYXRlLlxuICAgKi9cbiAgcHVibGljIGFsbFJlc291cmNlcyh0eXBlOiBzdHJpbmcsIHByb3BzOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBtYXRjaEVycm9yID0gYWxsUmVzb3VyY2VzKHRoaXMudGVtcGxhdGUsIHR5cGUsIHByb3BzKTtcbiAgICBpZiAobWF0Y2hFcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1hdGNoRXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnQgdGhhdCBhbGwgcmVzb3VyY2VzIG9mIHRoZSBnaXZlbiB0eXBlIGNvbnRhaW4gdGhlIGdpdmVuIHByb3BlcnRpZXNcbiAgICogQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuXG4gICAqIEJ5IGRlZmF1bHQsIHBlcmZvcm1zIHBhcnRpYWwgbWF0Y2hpbmcgb24gdGhlIGBQcm9wZXJ0aWVzYCBrZXkgb2YgdGhlIHJlc291cmNlLCB2aWEgdGhlXG4gICAqIGBNYXRjaC5vYmplY3RMaWtlKClgLiBUbyBjb25maWd1cmUgZGlmZmVyZW50IGJlaGF2aW9yLCB1c2Ugb3RoZXIgbWF0Y2hlcnMgaW4gdGhlIGBNYXRjaGAgY2xhc3MuXG4gICAqIEBwYXJhbSB0eXBlIHRoZSByZXNvdXJjZSB0eXBlOyBleDogYEFXUzo6UzM6OkJ1Y2tldGBcbiAgICogQHBhcmFtIHByb3BzIHRoZSAnUHJvcGVydGllcycgc2VjdGlvbiBvZiB0aGUgcmVzb3VyY2UgYXMgc2hvdWxkIGJlIGV4cGVjdGVkIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICovXG4gIHB1YmxpYyBhbGxSZXNvdXJjZXNQcm9wZXJ0aWVzKHR5cGU6IHN0cmluZywgcHJvcHM6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IG1hdGNoRXJyb3IgPSBhbGxSZXNvdXJjZXNQcm9wZXJ0aWVzKHRoaXMudGVtcGxhdGUsIHR5cGUsIHByb3BzKTtcbiAgICBpZiAobWF0Y2hFcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1hdGNoRXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnQgdGhhdCBhIFBhcmFtZXRlciB3aXRoIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIGV4aXN0cyBpbiB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuXG4gICAqIEJ5IGRlZmF1bHQsIHBlcmZvcm1zIHBhcnRpYWwgbWF0Y2hpbmcgb24gdGhlIHBhcmFtZXRlciwgdmlhIHRoZSBgTWF0Y2gub2JqZWN0TGlrZSgpYC5cbiAgICogVG8gY29uZmlndXJlIGRpZmZlcmVudCBiZWhhdmlvciwgdXNlIG90aGVyIG1hdGNoZXJzIGluIHRoZSBgTWF0Y2hgIGNsYXNzLlxuICAgKiBAcGFyYW0gbG9naWNhbElkIHRoZSBuYW1lIG9mIHRoZSBwYXJhbWV0ZXIuIFByb3ZpZGUgYCcqJ2AgdG8gbWF0Y2ggYWxsIHBhcmFtZXRlcnMgaW4gdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gcHJvcHMgdGhlIHBhcmFtZXRlciBhcyBzaG91bGQgYmUgZXhwZWN0ZWQgaW4gdGhlIHRlbXBsYXRlLlxuICAgKi9cbiAgcHVibGljIGhhc1BhcmFtZXRlcihsb2dpY2FsSWQ6IHN0cmluZywgcHJvcHM6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IG1hdGNoRXJyb3IgPSBoYXNQYXJhbWV0ZXIodGhpcy50ZW1wbGF0ZSwgbG9naWNhbElkLCBwcm9wcyk7XG4gICAgaWYgKG1hdGNoRXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtYXRjaEVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBzZXQgb2YgbWF0Y2hpbmcgUGFyYW1ldGVycyB0aGF0IG1hdGNoIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIGluIHRoZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIGxvZ2ljYWxJZCB0aGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyLiBQcm92aWRlIGAnKidgIHRvIG1hdGNoIGFsbCBwYXJhbWV0ZXJzIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHByb3BzIGJ5IGRlZmF1bHQsIG1hdGNoZXMgYWxsIFBhcmFtZXRlcnMgaW4gdGhlIHRlbXBsYXRlLlxuICAgKiBXaGVuIGEgbGl0ZXJhbCBvYmplY3QgaXMgcHJvdmlkZWQsIHBlcmZvcm1zIGEgcGFydGlhbCBtYXRjaCB2aWEgYE1hdGNoLm9iamVjdExpa2UoKWAuXG4gICAqIFVzZSB0aGUgYE1hdGNoYCBBUElzIHRvIGNvbmZpZ3VyZSBhIGRpZmZlcmVudCBiZWhhdmlvdXIuXG4gICAqL1xuICBwdWJsaWMgZmluZFBhcmFtZXRlcnMobG9naWNhbElkOiBzdHJpbmcsIHByb3BzOiBhbnkgPSB7fSk6IHsgW2tleTogc3RyaW5nXTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB9IHtcbiAgICByZXR1cm4gZmluZFBhcmFtZXRlcnModGhpcy50ZW1wbGF0ZSwgbG9naWNhbElkLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgYW4gT3V0cHV0IHdpdGggdGhlIGdpdmVuIHByb3BlcnRpZXMgZXhpc3RzIGluIHRoZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZS5cbiAgICogQnkgZGVmYXVsdCwgcGVyZm9ybXMgcGFydGlhbCBtYXRjaGluZyBvbiB0aGUgcmVzb3VyY2UsIHZpYSB0aGUgYE1hdGNoLm9iamVjdExpa2UoKWAuXG4gICAqIFRvIGNvbmZpZ3VyZSBkaWZmZXJlbnQgYmVoYXZpb3IsIHVzZSBvdGhlciBtYXRjaGVycyBpbiB0aGUgYE1hdGNoYCBjbGFzcy5cbiAgICogQHBhcmFtIGxvZ2ljYWxJZCB0aGUgbmFtZSBvZiB0aGUgb3V0cHV0LiBQcm92aWRlIGAnKidgIHRvIG1hdGNoIGFsbCBvdXRwdXRzIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHByb3BzIHRoZSBvdXRwdXQgYXMgc2hvdWxkIGJlIGV4cGVjdGVkIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICovXG4gIHB1YmxpYyBoYXNPdXRwdXQobG9naWNhbElkOiBzdHJpbmcsIHByb3BzOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBtYXRjaEVycm9yID0gaGFzT3V0cHV0KHRoaXMudGVtcGxhdGUsIGxvZ2ljYWxJZCwgcHJvcHMpO1xuICAgIGlmIChtYXRjaEVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWF0Y2hFcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgc2V0IG9mIG1hdGNoaW5nIE91dHB1dHMgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gcHJvcGVydGllcyBpbiB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuXG4gICAqIEBwYXJhbSBsb2dpY2FsSWQgdGhlIG5hbWUgb2YgdGhlIG91dHB1dC4gUHJvdmlkZSBgJyonYCB0byBtYXRjaCBhbGwgb3V0cHV0cyBpbiB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSBwcm9wcyBieSBkZWZhdWx0LCBtYXRjaGVzIGFsbCBPdXRwdXRzIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICogV2hlbiBhIGxpdGVyYWwgb2JqZWN0IGlzIHByb3ZpZGVkLCBwZXJmb3JtcyBhIHBhcnRpYWwgbWF0Y2ggdmlhIGBNYXRjaC5vYmplY3RMaWtlKClgLlxuICAgKiBVc2UgdGhlIGBNYXRjaGAgQVBJcyB0byBjb25maWd1cmUgYSBkaWZmZXJlbnQgYmVoYXZpb3VyLlxuICAgKi9cbiAgcHVibGljIGZpbmRPdXRwdXRzKGxvZ2ljYWxJZDogc3RyaW5nLCBwcm9wczogYW55ID0ge30pOiB7IFtrZXk6IHN0cmluZ106IHsgW2tleTogc3RyaW5nXTogYW55IH0gfSB7XG4gICAgcmV0dXJuIGZpbmRPdXRwdXRzKHRoaXMudGVtcGxhdGUsIGxvZ2ljYWxJZCwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydCB0aGF0IGEgTWFwcGluZyB3aXRoIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIGV4aXN0cyBpbiB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuXG4gICAqIEJ5IGRlZmF1bHQsIHBlcmZvcm1zIHBhcnRpYWwgbWF0Y2hpbmcgb24gdGhlIHJlc291cmNlLCB2aWEgdGhlIGBNYXRjaC5vYmplY3RMaWtlKClgLlxuICAgKiBUbyBjb25maWd1cmUgZGlmZmVyZW50IGJlaGF2aW9yLCB1c2Ugb3RoZXIgbWF0Y2hlcnMgaW4gdGhlIGBNYXRjaGAgY2xhc3MuXG4gICAqIEBwYXJhbSBsb2dpY2FsSWQgdGhlIG5hbWUgb2YgdGhlIG1hcHBpbmcuIFByb3ZpZGUgYCcqJ2AgdG8gbWF0Y2ggYWxsIG1hcHBpbmdzIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHByb3BzIHRoZSBvdXRwdXQgYXMgc2hvdWxkIGJlIGV4cGVjdGVkIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICovXG4gIHB1YmxpYyBoYXNNYXBwaW5nKGxvZ2ljYWxJZDogc3RyaW5nLCBwcm9wczogYW55KTogdm9pZCB7XG4gICAgY29uc3QgbWF0Y2hFcnJvciA9IGhhc01hcHBpbmcodGhpcy50ZW1wbGF0ZSwgbG9naWNhbElkLCBwcm9wcyk7XG4gICAgaWYgKG1hdGNoRXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtYXRjaEVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBzZXQgb2YgbWF0Y2hpbmcgTWFwcGluZ3MgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gcHJvcGVydGllcyBpbiB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuXG4gICAqIEBwYXJhbSBsb2dpY2FsSWQgdGhlIG5hbWUgb2YgdGhlIG1hcHBpbmcuIFByb3ZpZGUgYCcqJ2AgdG8gbWF0Y2ggYWxsIG1hcHBpbmdzIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHByb3BzIGJ5IGRlZmF1bHQsIG1hdGNoZXMgYWxsIE1hcHBpbmdzIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICogV2hlbiBhIGxpdGVyYWwgb2JqZWN0IGlzIHByb3ZpZGVkLCBwZXJmb3JtcyBhIHBhcnRpYWwgbWF0Y2ggdmlhIGBNYXRjaC5vYmplY3RMaWtlKClgLlxuICAgKiBVc2UgdGhlIGBNYXRjaGAgQVBJcyB0byBjb25maWd1cmUgYSBkaWZmZXJlbnQgYmVoYXZpb3VyLlxuICAgKi9cbiAgcHVibGljIGZpbmRNYXBwaW5ncyhsb2dpY2FsSWQ6IHN0cmluZywgcHJvcHM6IGFueSA9IHt9KTogeyBba2V5OiBzdHJpbmddOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IH0ge1xuICAgIHJldHVybiBmaW5kTWFwcGluZ3ModGhpcy50ZW1wbGF0ZSwgbG9naWNhbElkLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgYSBDb25kaXRpb24gd2l0aCB0aGUgZ2l2ZW4gcHJvcGVydGllcyBleGlzdHMgaW4gdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlLlxuICAgKiBCeSBkZWZhdWx0LCBwZXJmb3JtcyBwYXJ0aWFsIG1hdGNoaW5nIG9uIHRoZSByZXNvdXJjZSwgdmlhIHRoZSBgTWF0Y2gub2JqZWN0TGlrZSgpYC5cbiAgICogVG8gY29uZmlndXJlIGRpZmZlcmVudCBiZWhhdmlvciwgdXNlIG90aGVyIG1hdGNoZXJzIGluIHRoZSBgTWF0Y2hgIGNsYXNzLlxuICAgKiBAcGFyYW0gbG9naWNhbElkIHRoZSBuYW1lIG9mIHRoZSBtYXBwaW5nLiBQcm92aWRlIGAnKidgIHRvIG1hdGNoIGFsbCBjb25kaXRpb25zIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHByb3BzIHRoZSBvdXRwdXQgYXMgc2hvdWxkIGJlIGV4cGVjdGVkIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICovXG4gIHB1YmxpYyBoYXNDb25kaXRpb24obG9naWNhbElkOiBzdHJpbmcsIHByb3BzOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBtYXRjaEVycm9yID0gaGFzQ29uZGl0aW9uKHRoaXMudGVtcGxhdGUsIGxvZ2ljYWxJZCwgcHJvcHMpO1xuICAgIGlmIChtYXRjaEVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWF0Y2hFcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgc2V0IG9mIG1hdGNoaW5nIENvbmRpdGlvbnMgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gcHJvcGVydGllcyBpbiB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuXG4gICAqIEBwYXJhbSBsb2dpY2FsSWQgdGhlIG5hbWUgb2YgdGhlIGNvbmRpdGlvbi4gUHJvdmlkZSBgJyonYCB0byBtYXRjaCBhbGwgY29uZGl0aW9ucyBpbiB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSBwcm9wcyBieSBkZWZhdWx0LCBtYXRjaGVzIGFsbCBDb25kaXRpb25zIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICogV2hlbiBhIGxpdGVyYWwgb2JqZWN0IGlzIHByb3ZpZGVkLCBwZXJmb3JtcyBhIHBhcnRpYWwgbWF0Y2ggdmlhIGBNYXRjaC5vYmplY3RMaWtlKClgLlxuICAgKiBVc2UgdGhlIGBNYXRjaGAgQVBJcyB0byBjb25maWd1cmUgYSBkaWZmZXJlbnQgYmVoYXZpb3VyLlxuICAgKi9cbiAgcHVibGljIGZpbmRDb25kaXRpb25zKGxvZ2ljYWxJZDogc3RyaW5nLCBwcm9wczogYW55ID0ge30pOiB7IFtrZXk6IHN0cmluZ106IHsgW2tleTogc3RyaW5nXTogYW55IH0gfSB7XG4gICAgcmV0dXJuIGZpbmRDb25kaXRpb25zKHRoaXMudGVtcGxhdGUsIGxvZ2ljYWxJZCwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydCB0aGF0IHRoZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBtYXRjaGVzIHRoZSBnaXZlbiB2YWx1ZVxuICAgKiBAcGFyYW0gZXhwZWN0ZWQgdGhlIGV4cGVjdGVkIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIGFzIGtleS12YWx1ZSBwYWlycy5cbiAgICovXG4gIHB1YmxpYyB0ZW1wbGF0ZU1hdGNoZXMoZXhwZWN0ZWQ6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IG1hdGNoZXIgPSBNYXRjaGVyLmlzTWF0Y2hlcihleHBlY3RlZCkgPyBleHBlY3RlZCA6IE1hdGNoLm9iamVjdExpa2UoZXhwZWN0ZWQpO1xuICAgIGNvbnN0IHJlc3VsdCA9IG1hdGNoZXIudGVzdCh0aGlzLnRlbXBsYXRlKTtcblxuICAgIGlmIChyZXN1bHQuaGFzRmFpbGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihbXG4gICAgICAgICdUZW1wbGF0ZSBkaWQgbm90IG1hdGNoIGFzIGV4cGVjdGVkLiBUaGUgZm9sbG93aW5nIG1pc21hdGNoZXMgd2VyZSBmb3VuZDonLFxuICAgICAgICAuLi5yZXN1bHQudG9IdW1hblN0cmluZ3MoKS5tYXAocyA9PiBgXFx0JHtzfWApLFxuICAgICAgXS5qb2luKCdcXG4nKSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyB0byBjb25maWd1cmUgdGVtcGxhdGUgcGFyc2luZyBiZWhhdmlvciwgc3VjaCBhcyBkaXNyZWdhcmRpbmcgY2lyY3VsYXJcbiAqIGRlcGVuZGVuY2llcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZVBhcnNpbmdPcHRpb25zIHtcbiAgLyoqXG4gICAqIElmIHNldCB0byB0cnVlLCB3aWxsIHNraXAgY2hlY2tpbmcgZm9yIGN5Y2xpY2FsIC8gY2lyY3VsYXIgZGVwZW5kZW5jaWVzLiBTaG91bGQgYmUgc2V0IHRvIGZhbHNlIG90aGVyIHRoYW4gZm9yXG4gICAqIHRlbXBsYXRlcyB0aGF0IGFyZSB2YWxpZCBkZXNwaXRlIGNvbnRhaW5pbmcgY3ljbGVzLCBzdWNoIGFzIHVucHJvY2Vzc2VkIHRyYW5zZm9ybSBzdGFja3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBza2lwQ3ljbGljYWxEZXBlbmRlbmNpZXNDaGVjaz86IGJvb2xlYW47XG59XG5cbmZ1bmN0aW9uIHRvVGVtcGxhdGUoc3RhY2s6IFN0YWNrKTogYW55IHtcbiAgY29uc3Qgcm9vdCA9IHN0YWNrLm5vZGUucm9vdDtcbiAgaWYgKCFTdGFnZS5pc1N0YWdlKHJvb3QpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1bmV4cGVjdGVkOiBhbGwgc3RhY2tzIG11c3QgYmUgcGFydCBvZiBhIFN0YWdlIG9yIGFuIEFwcCcpO1xuICB9XG5cbiAgY29uc3QgYXNzZW1ibHkgPSByb290LnN5bnRoKCk7XG4gIGlmIChzdGFjay5uZXN0ZWRTdGFja1BhcmVudCkge1xuICAgIC8vIGlmIHRoaXMgaXMgYSBuZXN0ZWQgc3RhY2sgKGl0IGhhcyBhIHBhcmVudCksIHRoZW4ganVzdCByZWFkIHRoZSB0ZW1wbGF0ZSBhcyBhIHN0cmluZ1xuICAgIHJldHVybiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oYXNzZW1ibHkuZGlyZWN0b3J5LCBzdGFjay50ZW1wbGF0ZUZpbGUpKS50b1N0cmluZygndXRmLTgnKSk7XG4gIH1cbiAgcmV0dXJuIGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3Qoc3RhY2suYXJ0aWZhY3RJZCkudGVtcGxhdGU7XG59XG4iXX0=