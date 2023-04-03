"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagType = exports.CfnResource = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cxapi = require("@aws-cdk/cx-api");
const annotations_1 = require("./annotations");
// import required to be here, otherwise causes a cycle when running the generated JavaScript
/* eslint-disable import/order */
const cfn_element_1 = require("./cfn-element");
const cfn_resource_policy_1 = require("./cfn-resource-policy");
const constructs_1 = require("constructs");
const deps_1 = require("./deps");
const cfn_reference_1 = require("./private/cfn-reference");
const cloudformation_lang_1 = require("./private/cloudformation-lang");
const removal_policy_1 = require("./removal-policy");
const tag_manager_1 = require("./tag-manager");
const token_1 = require("./token");
const util_1 = require("./util");
const feature_flags_1 = require("./feature-flags");
/**
 * Represents a CloudFormation resource.
 */
class CfnResource extends cfn_element_1.CfnRefElement {
    /**
     * Creates a resource construct.
     * @param cfnResourceType The CloudFormation type of this resource (e.g. AWS::DynamoDB::Table)
     */
    constructor(scope, id, props) {
        super(scope, id);
        // MAINTAINERS NOTE: this class serves as the base class for the generated L1
        // ("CFN") resources (such as `s3.CfnBucket`). These resources will have a
        // property for each CloudFormation property of the resource. This means that
        // if at some point in the future a property is introduced with a name similar
        // to one of the properties here, it will be "masked" by the derived class. To
        // that end, we prefix all properties in this class with `cfnXxx` with the
        // hope to avoid those conflicts in the future.
        /**
         * Options for this resource, such as condition, update policy etc.
         */
        this.cfnOptions = {};
        /**
         * An object to be merged on top of the entire resource definition.
         */
        this.rawOverrides = {};
        /**
         * Logical IDs of dependencies.
         *
         * Is filled during prepare().
         */
        this.dependsOn = new Set();
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnResourceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnResource);
            }
            throw error;
        }
        if (!props.type) {
            throw new Error('The `type` property is required');
        }
        this.cfnResourceType = props.type;
        this._cfnProperties = props.properties || {};
        // if aws:cdk:enable-path-metadata is set, embed the current construct's
        // path in the CloudFormation template, so it will be possible to trace
        // back to the actual construct path.
        if (constructs_1.Node.of(this).tryGetContext(cxapi.PATH_METADATA_ENABLE_CONTEXT)) {
            this.addMetadata(cxapi.PATH_METADATA_KEY, constructs_1.Node.of(this).path);
        }
    }
    /**
     * Check whether the given construct is a CfnResource
     */
    static isCfnResource(construct) {
        return construct.cfnResourceType !== undefined;
    }
    /**
     * Sets the deletion policy of the resource based on the removal policy specified.
     *
     * The Removal Policy controls what happens to this resource when it stops
     * being managed by CloudFormation, either because you've removed it from the
     * CDK application or because you've made a change that requires the resource
     * to be replaced.
     *
     * The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
     * account for data recovery and cleanup later (`RemovalPolicy.RETAIN`). In some
     * cases, a snapshot can be taken of the resource prior to deletion
     * (`RemovalPolicy.SNAPSHOT`). A list of resources that support this policy
     * can be found in the following link:
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html#aws-attribute-deletionpolicy-options
     */
    applyRemovalPolicy(policy, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_RemovalPolicy(policy);
            jsiiDeprecationWarnings._aws_cdk_core_RemovalPolicyOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.applyRemovalPolicy);
            }
            throw error;
        }
        policy = policy || options.default || removal_policy_1.RemovalPolicy.RETAIN;
        let deletionPolicy;
        switch (policy) {
            case removal_policy_1.RemovalPolicy.DESTROY:
                deletionPolicy = cfn_resource_policy_1.CfnDeletionPolicy.DELETE;
                break;
            case removal_policy_1.RemovalPolicy.RETAIN:
                deletionPolicy = cfn_resource_policy_1.CfnDeletionPolicy.RETAIN;
                break;
            case removal_policy_1.RemovalPolicy.SNAPSHOT:
                // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html
                const snapshottableResourceTypes = [
                    'AWS::EC2::Volume',
                    'AWS::ElastiCache::CacheCluster',
                    'AWS::ElastiCache::ReplicationGroup',
                    'AWS::Neptune::DBCluster',
                    'AWS::RDS::DBCluster',
                    'AWS::RDS::DBInstance',
                    'AWS::Redshift::Cluster',
                ];
                // error if flag is set, warn if flag is not
                const problematicSnapshotPolicy = !snapshottableResourceTypes.includes(this.cfnResourceType);
                if (problematicSnapshotPolicy) {
                    if (feature_flags_1.FeatureFlags.of(this).isEnabled(cxapi.VALIDATE_SNAPSHOT_REMOVAL_POLICY)) {
                        throw new Error(`${this.cfnResourceType} does not support snapshot removal policy`);
                    }
                    else {
                        annotations_1.Annotations.of(this).addWarning(`${this.cfnResourceType} does not support snapshot removal policy. This policy will be ignored.`);
                    }
                }
                deletionPolicy = cfn_resource_policy_1.CfnDeletionPolicy.SNAPSHOT;
                break;
            default:
                throw new Error(`Invalid removal policy: ${policy}`);
        }
        this.cfnOptions.deletionPolicy = deletionPolicy;
        if (options.applyToUpdateReplacePolicy !== false) {
            this.cfnOptions.updateReplacePolicy = deletionPolicy;
        }
    }
    /**
     * Returns a token for an runtime attribute of this resource.
     * Ideally, use generated attribute accessors (e.g. `resource.arn`), but this can be used for future compatibility
     * in case there is no generated attribute.
     * @param attributeName The name of the attribute.
     */
    getAtt(attributeName, typeHint) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ResolutionTypeHint(typeHint);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getAtt);
            }
            throw error;
        }
        return cfn_reference_1.CfnReference.for(this, attributeName, undefined, typeHint);
    }
    /**
     * Adds an override to the synthesized CloudFormation resource. To add a
     * property override, either use `addPropertyOverride` or prefix `path` with
     * "Properties." (i.e. `Properties.TopicName`).
     *
     * If the override is nested, separate each nested level using a dot (.) in the path parameter.
     * If there is an array as part of the nesting, specify the index in the path.
     *
     * To include a literal `.` in the property name, prefix with a `\`. In most
     * programming languages you will need to write this as `"\\."` because the
     * `\` itself will need to be escaped.
     *
     * For example,
     * ```typescript
     * cfnResource.addOverride('Properties.GlobalSecondaryIndexes.0.Projection.NonKeyAttributes', ['myattribute']);
     * cfnResource.addOverride('Properties.GlobalSecondaryIndexes.1.ProjectionType', 'INCLUDE');
     * ```
     * would add the overrides
     * ```json
     * "Properties": {
     *   "GlobalSecondaryIndexes": [
     *     {
     *       "Projection": {
     *         "NonKeyAttributes": [ "myattribute" ]
     *         ...
     *       }
     *       ...
     *     },
     *     {
     *       "ProjectionType": "INCLUDE"
     *       ...
     *     },
     *   ]
     *   ...
     * }
     * ```
     *
     * The `value` argument to `addOverride` will not be processed or translated
     * in any way. Pass raw JSON values in here with the correct capitalization
     * for CloudFormation. If you pass CDK classes or structs, they will be
     * rendered with lowercased key names, and CloudFormation will reject the
     * template.
     *
     * @param path - The path of the property, you can use dot notation to
     *        override values in complex types. Any intermdediate keys
     *        will be created as needed.
     * @param value - The value. Could be primitive or complex.
     */
    addOverride(path, value) {
        const parts = splitOnPeriods(path);
        let curr = this.rawOverrides;
        while (parts.length > 1) {
            const key = parts.shift();
            // if we can't recurse further or the previous value is not an
            // object overwrite it with an object.
            const isObject = curr[key] != null && typeof (curr[key]) === 'object' && !Array.isArray(curr[key]);
            if (!isObject) {
                curr[key] = {};
            }
            curr = curr[key];
        }
        const lastKey = parts.shift();
        curr[lastKey] = value;
    }
    /**
     * Syntactic sugar for `addOverride(path, undefined)`.
     * @param path The path of the value to delete
     */
    addDeletionOverride(path) {
        this.addOverride(path, undefined);
    }
    /**
     * Adds an override to a resource property.
     *
     * Syntactic sugar for `addOverride("Properties.<...>", value)`.
     *
     * @param propertyPath The path of the property
     * @param value The value
     */
    addPropertyOverride(propertyPath, value) {
        this.addOverride(`Properties.${propertyPath}`, value);
    }
    /**
     * Adds an override that deletes the value of a property from the resource definition.
     * @param propertyPath The path to the property.
     */
    addPropertyDeletionOverride(propertyPath) {
        this.addPropertyOverride(propertyPath, undefined);
    }
    /**
     * Indicates that this resource depends on another resource and cannot be
     * provisioned unless the other resource has been successfully provisioned.
     *
     * @deprecated use addDependency
     */
    addDependsOn(target) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.CfnResource#addDependsOn", "use addDependency");
            jsiiDeprecationWarnings._aws_cdk_core_CfnResource(target);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addDependsOn);
            }
            throw error;
        }
        return this.addDependency(target);
    }
    /**
     * Indicates that this resource depends on another resource and cannot be
     * provisioned unless the other resource has been successfully provisioned.
     *
     * This can be used for resources across stacks (or nested stack) boundaries
     * and the dependency will automatically be transferred to the relevant scope.
     */
    addDependency(target) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnResource(target);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addDependency);
            }
            throw error;
        }
        // skip this dependency if the target is not part of the output
        if (!target.shouldSynthesize()) {
            return;
        }
        deps_1.addDependency(this, target, `{${this.node.path}}.addDependency({${target.node.path}})`);
    }
    /**
     * Indicates that this resource no longer depends on another resource.
     *
     * This can be used for resources across stacks (including nested stacks)
     * and the dependency will automatically be removed from the relevant scope.
     */
    removeDependency(target) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnResource(target);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.removeDependency);
            }
            throw error;
        }
        // skip this dependency if the target is not part of the output
        if (!target.shouldSynthesize()) {
            return;
        }
        deps_1.removeDependency(this, target);
    }
    /**
     * Retrieves an array of resources this resource depends on.
     *
     * This assembles dependencies on resources across stacks (including nested stacks)
     * automatically.
     */
    obtainDependencies() {
        return deps_1.obtainDependencies(this);
    }
    /**
     * Replaces one dependency with another.
     * @param target The dependency to replace
     * @param newTarget The new dependency to add
     */
    replaceDependency(target, newTarget) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnResource(target);
            jsiiDeprecationWarnings._aws_cdk_core_CfnResource(newTarget);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.replaceDependency);
            }
            throw error;
        }
        if (this.obtainDependencies().includes(target)) {
            this.removeDependency(target);
            this.addDependency(newTarget);
        }
        else {
            throw new Error(`"${constructs_1.Node.of(this).path}" does not depend on "${constructs_1.Node.of(target).path}"`);
        }
    }
    /**
     * Add a value to the CloudFormation Resource Metadata
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html
     *
     * Note that this is a different set of metadata from CDK node metadata; this
     * metadata ends up in the stack template under the resource, whereas CDK
     * node metadata ends up in the Cloud Assembly.
     */
    addMetadata(key, value) {
        if (!this.cfnOptions.metadata) {
            this.cfnOptions.metadata = {};
        }
        this.cfnOptions.metadata[key] = value;
    }
    /**
     * Retrieve a value value from the CloudFormation Resource Metadata
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html
     *
     * Note that this is a different set of metadata from CDK node metadata; this
     * metadata ends up in the stack template under the resource, whereas CDK
     * node metadata ends up in the Cloud Assembly.
     */
    getMetadata(key) {
        return this.cfnOptions.metadata?.[key];
    }
    /**
     * @returns a string representation of this resource
     */
    toString() {
        return `${super.toString()} [${this.cfnResourceType}]`;
    }
    /**
     * Called by the `addDependency` helper function in order to realize a direct
     * dependency between two resources that are directly defined in the same
     * stacks.
     *
     * Use `resource.addDependency` to define the dependency between two resources,
     * which also takes stack boundaries into account.
     *
     * @internal
     */
    _addResourceDependency(target) {
        this.dependsOn.add(target);
    }
    /**
     * Get a shallow copy of dependencies between this resource and other resources
     * in the same stack.
     */
    obtainResourceDependencies() {
        return Array.from(this.dependsOn.values());
    }
    /**
     * Remove a dependency between this resource and other resources in the same
     * stack.
     *
     * @internal
     */
    _removeResourceDependency(target) {
        this.dependsOn.delete(target);
    }
    /**
     * Emits CloudFormation for this resource.
     * @internal
     */
    _toCloudFormation() {
        if (!this.shouldSynthesize()) {
            return {};
        }
        try {
            const ret = {
                Resources: {
                    // Post-Resolve operation since otherwise deepMerge is going to mix values into
                    // the Token objects returned by ignoreEmpty.
                    [this.logicalId]: new util_1.PostResolveToken({
                        Type: this.cfnResourceType,
                        Properties: util_1.ignoreEmpty(this.cfnProperties),
                        DependsOn: util_1.ignoreEmpty(renderDependsOn(this.dependsOn)),
                        CreationPolicy: util_1.capitalizePropertyNames(this, renderCreationPolicy(this.cfnOptions.creationPolicy)),
                        UpdatePolicy: util_1.capitalizePropertyNames(this, this.cfnOptions.updatePolicy),
                        UpdateReplacePolicy: util_1.capitalizePropertyNames(this, this.cfnOptions.updateReplacePolicy),
                        DeletionPolicy: util_1.capitalizePropertyNames(this, this.cfnOptions.deletionPolicy),
                        Version: this.cfnOptions.version,
                        Description: this.cfnOptions.description,
                        Metadata: util_1.ignoreEmpty(this.cfnOptions.metadata),
                        Condition: this.cfnOptions.condition && this.cfnOptions.condition.logicalId,
                    }, resourceDef => {
                        const renderedProps = this.renderProperties(resourceDef.Properties || {});
                        if (renderedProps) {
                            const hasDefined = Object.values(renderedProps).find(v => v !== undefined);
                            resourceDef.Properties = hasDefined !== undefined ? renderedProps : undefined;
                        }
                        const resolvedRawOverrides = token_1.Tokenization.resolve(this.rawOverrides, {
                            scope: this,
                            resolver: cloudformation_lang_1.CLOUDFORMATION_TOKEN_RESOLVER,
                            // we need to preserve the empty elements here,
                            // as that's how removing overrides are represented as
                            removeEmpty: false,
                        });
                        return deepMerge(resourceDef, resolvedRawOverrides);
                    }),
                },
            };
            return ret;
        }
        catch (e) {
            // Change message
            e.message = `While synthesizing ${this.node.path}: ${e.message}`;
            // Adjust stack trace (make it look like node built it, too...)
            const trace = this.creationStack;
            if (trace) {
                const creationStack = ['--- resource created at ---', ...trace].join('\n  at ');
                const problemTrace = e.stack.slice(e.stack.indexOf(e.message) + e.message.length);
                e.stack = `${e.message}\n  ${creationStack}\n  --- problem discovered at ---${problemTrace}`;
            }
            // Re-throw
            throw e;
        }
        // returns the set of logical ID (tokens) this resource depends on
        // sorted by construct paths to ensure test determinism
        function renderDependsOn(dependsOn) {
            return Array
                .from(dependsOn)
                .sort((x, y) => x.node.path.localeCompare(y.node.path))
                .map(r => r.logicalId);
        }
        function renderCreationPolicy(policy) {
            if (!policy) {
                return undefined;
            }
            const result = { ...policy };
            if (policy.resourceSignal && policy.resourceSignal.timeout) {
                result.resourceSignal = policy.resourceSignal;
            }
            return result;
        }
    }
    get cfnProperties() {
        const props = this._cfnProperties || {};
        if (tag_manager_1.TagManager.isTaggable(this)) {
            const tagsProp = {};
            tagsProp[this.tags.tagPropertyName] = this.tags.renderTags();
            return deepMerge(props, tagsProp);
        }
        return props;
    }
    renderProperties(props) {
        return props;
    }
    /**
     * Deprecated
     * @deprecated use `updatedProperties`
     *
     * Return properties modified after initiation
     *
     * Resources that expose mutable properties should override this function to
     * collect and return the properties object for this resource.
     */
    get updatedProperites() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.CfnResource#updatedProperites", "use `updatedProperties`\n\nReturn properties modified after initiation\n\nResources that expose mutable properties should override this function to\ncollect and return the properties object for this resource.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "updatedProperites").get);
            }
            throw error;
        }
        return this.updatedProperties;
    }
    /**
     * Return properties modified after initiation
     *
     * Resources that expose mutable properties should override this function to
     * collect and return the properties object for this resource.
     */
    get updatedProperties() {
        return this._cfnProperties;
    }
    validateProperties(_properties) {
    }
    /**
     * Can be overridden by subclasses to determine if this resource will be rendered
     * into the cloudformation template.
     *
     * @returns `true` if the resource should be included or `false` is the resource
     * should be omitted.
     */
    shouldSynthesize() {
        return true;
    }
}
exports.CfnResource = CfnResource;
_a = JSII_RTTI_SYMBOL_1;
CfnResource[_a] = { fqn: "@aws-cdk/core.CfnResource", version: "0.0.0" };
var TagType;
(function (TagType) {
    TagType["STANDARD"] = "StandardTag";
    TagType["AUTOSCALING_GROUP"] = "AutoScalingGroupTag";
    TagType["MAP"] = "StringToStringMap";
    TagType["KEY_VALUE"] = "KeyValue";
    TagType["NOT_TAGGABLE"] = "NotTaggable";
})(TagType = exports.TagType || (exports.TagType = {}));
/**
 * Object keys that deepMerge should not consider. Currently these include
 * CloudFormation intrinsics
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html
 */
const MERGE_EXCLUDE_KEYS = [
    'Ref',
    'Fn::Base64',
    'Fn::Cidr',
    'Fn::FindInMap',
    'Fn::GetAtt',
    'Fn::GetAZs',
    'Fn::ImportValue',
    'Fn::Join',
    'Fn::Select',
    'Fn::Split',
    'Fn::Sub',
    'Fn::Transform',
    'Fn::And',
    'Fn::Equals',
    'Fn::If',
    'Fn::Not',
    'Fn::Or',
];
/**
 * Merges `source` into `target`, overriding any existing values.
 * `null`s will cause a value to be deleted.
 */
function deepMerge(target, ...sources) {
    for (const source of sources) {
        if (typeof (source) !== 'object' || typeof (target) !== 'object') {
            throw new Error(`Invalid usage. Both source (${JSON.stringify(source)}) and target (${JSON.stringify(target)}) must be objects`);
        }
        for (const key of Object.keys(source)) {
            const value = source[key];
            if (typeof (value) === 'object' && value != null && !Array.isArray(value)) {
                // if the value at the target is not an object, override it with an
                // object so we can continue the recursion
                if (typeof (target[key]) !== 'object') {
                    target[key] = {};
                    /**
                     * If we have something that looks like:
                     *
                     *   target: { Type: 'MyResourceType', Properties: { prop1: { Ref: 'Param' } } }
                     *   sources: [ { Properties: { prop1: [ 'Fn::Join': ['-', 'hello', 'world'] ] } } ]
                     *
                     * Eventually we will get to the point where we have
                     *
                     *   target: { prop1: { Ref: 'Param' } }
                     *   sources: [ { prop1: { 'Fn::Join': ['-', 'hello', 'world'] } } ]
                     *
                     * We need to recurse 1 more time, but if we do we will end up with
                     *   { prop1: { Ref: 'Param', 'Fn::Join': ['-', 'hello', 'world'] } }
                     * which is not what we want.
                     *
                     * Instead we check to see whether the `target` value (i.e. target.prop1)
                     * is an object that contains a key that we don't want to recurse on. If it does
                     * then we essentially drop it and end up with:
                     *
                     *   { prop1: { 'Fn::Join': ['-', 'hello', 'world'] } }
                     */
                }
                else if (Object.keys(target[key]).length === 1) {
                    if (MERGE_EXCLUDE_KEYS.includes(Object.keys(target[key])[0])) {
                        target[key] = {};
                    }
                }
                /**
                 * There might also be the case where the source is an intrinsic
                 *
                 *    target: {
                 *      Type: 'MyResourceType',
                 *      Properties: {
                 *        prop1: { subprop: { name: { 'Fn::GetAtt': 'abc' } } }
                 *      }
                 *    }
                 *    sources: [ {
                 *      Properties: {
                 *        prop1: { subprop: { 'Fn::If': ['SomeCondition', {...}, {...}] }}
                 *      }
                 *    } ]
                 *
                 * We end up in a place that is the reverse of the above check, the source
                 * becomes an intrinsic before the target
                 *
                 *   target: { subprop: { name: { 'Fn::GetAtt': 'abc' } } }
                 *   sources: [{
                 *     'Fn::If': [ 'MyCondition', {...}, {...} ]
                 *   }]
                 */
                if (Object.keys(value).length === 1) {
                    if (MERGE_EXCLUDE_KEYS.includes(Object.keys(value)[0])) {
                        target[key] = {};
                    }
                }
                deepMerge(target[key], value);
                // if the result of the merge is an empty object, it's because the
                // eventual value we assigned is `undefined`, and there are no
                // sibling concrete values alongside, so we can delete this tree.
                const output = target[key];
                if (typeof (output) === 'object' && Object.keys(output).length === 0) {
                    delete target[key];
                }
            }
            else if (value === undefined) {
                delete target[key];
            }
            else {
                target[key] = value;
            }
        }
    }
    return target;
}
/**
 * Split on periods while processing escape characters \
 */
function splitOnPeriods(x) {
    // Build this list in reverse because it's more convenient to get the "current"
    // item by doing ret[0] than by ret[ret.length - 1].
    const ret = [''];
    for (let i = 0; i < x.length; i++) {
        if (x[i] === '\\' && i + 1 < x.length) {
            ret[0] += x[i + 1];
            i++;
        }
        else if (x[i] === '.') {
            ret.unshift('');
        }
        else {
            ret[0] += x[i];
        }
    }
    ret.reverse();
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXJlc291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLXJlc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHlDQUF5QztBQUN6QywrQ0FBNEM7QUFFNUMsNkZBQTZGO0FBQzdGLGlDQUFpQztBQUNqQywrQ0FBOEM7QUFDOUMsK0RBQThGO0FBQzlGLDJDQUF5RDtBQUN6RCxpQ0FBNkU7QUFDN0UsMkRBQXVEO0FBQ3ZELHVFQUE4RTtBQUU5RSxxREFBdUU7QUFDdkUsK0NBQTJDO0FBQzNDLG1DQUF1QztBQUN2QyxpQ0FBZ0Y7QUFDaEYsbURBQStDO0FBaUIvQzs7R0FFRztBQUNILE1BQWEsV0FBWSxTQUFRLDJCQUFhO0lBOEM1Qzs7O09BR0c7SUFDSCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXVCO1FBQy9ELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUEzQ25CLDZFQUE2RTtRQUM3RSwwRUFBMEU7UUFDMUUsNkVBQTZFO1FBQzdFLDhFQUE4RTtRQUM5RSw4RUFBOEU7UUFDOUUsMEVBQTBFO1FBQzFFLCtDQUErQztRQUUvQzs7V0FFRztRQUNhLGVBQVUsR0FBd0IsRUFBRSxDQUFDO1FBZXJEOztXQUVHO1FBQ2MsaUJBQVksR0FBUSxFQUFFLENBQUM7UUFFeEM7Ozs7V0FJRztRQUNjLGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFDOzs7Ozs7K0NBNUN6QyxXQUFXOzs7O1FBcURwQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztTQUNwRDtRQUVELElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUNsQyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO1FBRTdDLHdFQUF3RTtRQUN4RSx1RUFBdUU7UUFDdkUscUNBQXFD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Q2hCO0tBQ0Y7SUFFRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDZCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMgfSBmcm9tICcuL2Fubm90YXRpb25zJztcbmltcG9ydCB7IENmbkNvbmRpdGlvbiB9IGZyb20gJy4vY2ZuLWNvbmRpdGlvbic7XG4vLyBpbXBvcnQgcmVxdWlyZWQgdG8gYmUgaGVyZSwgb3RoZXJ3aXNlIGNhdXNlcyBhIGN5Y2xlIHdoZW4gcnVubmluZyB0aGUgZ2VuZXJhdGVkIEphdmFTY3JpcHRcbi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9vcmRlciAqL1xuaW1wb3J0IHsgQ2ZuUmVmRWxlbWVudCB9IGZyb20gJy4vY2ZuLWVsZW1lbnQnO1xuaW1wb3J0IHsgQ2ZuQ3JlYXRpb25Qb2xpY3ksIENmbkRlbGV0aW9uUG9saWN5LCBDZm5VcGRhdGVQb2xpY3kgfSBmcm9tICcuL2Nmbi1yZXNvdXJjZS1wb2xpY3knO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBJQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBhZGREZXBlbmRlbmN5LCBvYnRhaW5EZXBlbmRlbmNpZXMsIHJlbW92ZURlcGVuZGVuY3kgfSBmcm9tICcuL2RlcHMnO1xuaW1wb3J0IHsgQ2ZuUmVmZXJlbmNlIH0gZnJvbSAnLi9wcml2YXRlL2Nmbi1yZWZlcmVuY2UnO1xuaW1wb3J0IHsgQ0xPVURGT1JNQVRJT05fVE9LRU5fUkVTT0xWRVIgfSBmcm9tICcuL3ByaXZhdGUvY2xvdWRmb3JtYXRpb24tbGFuZyc7XG5pbXBvcnQgeyBSZWZlcmVuY2UgfSBmcm9tICcuL3JlZmVyZW5jZSc7XG5pbXBvcnQgeyBSZW1vdmFsUG9saWN5LCBSZW1vdmFsUG9saWN5T3B0aW9ucyB9IGZyb20gJy4vcmVtb3ZhbC1wb2xpY3knO1xuaW1wb3J0IHsgVGFnTWFuYWdlciB9IGZyb20gJy4vdGFnLW1hbmFnZXInO1xuaW1wb3J0IHsgVG9rZW5pemF0aW9uIH0gZnJvbSAnLi90b2tlbic7XG5pbXBvcnQgeyBjYXBpdGFsaXplUHJvcGVydHlOYW1lcywgaWdub3JlRW1wdHksIFBvc3RSZXNvbHZlVG9rZW4gfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgRmVhdHVyZUZsYWdzIH0gZnJvbSAnLi9mZWF0dXJlLWZsYWdzJztcbmltcG9ydCB7IFJlc29sdXRpb25UeXBlSGludCB9IGZyb20gJy4vdHlwZS1oaW50cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuUmVzb3VyY2VQcm9wcyB7XG4gIC8qKlxuICAgKiBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIChlLmcuIGBBV1M6OlMzOjpCdWNrZXRgKS5cbiAgICovXG4gIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogUmVzb3VyY2UgcHJvcGVydGllcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyByZXNvdXJjZSBwcm9wZXJ0aWVzLlxuICAgKi9cbiAgcmVhZG9ubHkgcHJvcGVydGllcz86IHsgW25hbWU6IHN0cmluZ106IGFueSB9O1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZS5cbiAqL1xuZXhwb3J0IGNsYXNzIENmblJlc291cmNlIGV4dGVuZHMgQ2ZuUmVmRWxlbWVudCB7XG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiBjb25zdHJ1Y3QgaXMgYSBDZm5SZXNvdXJjZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc0NmblJlc291cmNlKGNvbnN0cnVjdDogSUNvbnN0cnVjdCk6IGNvbnN0cnVjdCBpcyBDZm5SZXNvdXJjZSB7XG4gICAgcmV0dXJuIChjb25zdHJ1Y3QgYXMgYW55KS5jZm5SZXNvdXJjZVR5cGUgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIE1BSU5UQUlORVJTIE5PVEU6IHRoaXMgY2xhc3Mgc2VydmVzIGFzIHRoZSBiYXNlIGNsYXNzIGZvciB0aGUgZ2VuZXJhdGVkIEwxXG4gIC8vIChcIkNGTlwiKSByZXNvdXJjZXMgKHN1Y2ggYXMgYHMzLkNmbkJ1Y2tldGApLiBUaGVzZSByZXNvdXJjZXMgd2lsbCBoYXZlIGFcbiAgLy8gcHJvcGVydHkgZm9yIGVhY2ggQ2xvdWRGb3JtYXRpb24gcHJvcGVydHkgb2YgdGhlIHJlc291cmNlLiBUaGlzIG1lYW5zIHRoYXRcbiAgLy8gaWYgYXQgc29tZSBwb2ludCBpbiB0aGUgZnV0dXJlIGEgcHJvcGVydHkgaXMgaW50cm9kdWNlZCB3aXRoIGEgbmFtZSBzaW1pbGFyXG4gIC8vIHRvIG9uZSBvZiB0aGUgcHJvcGVydGllcyBoZXJlLCBpdCB3aWxsIGJlIFwibWFza2VkXCIgYnkgdGhlIGRlcml2ZWQgY2xhc3MuIFRvXG4gIC8vIHRoYXQgZW5kLCB3ZSBwcmVmaXggYWxsIHByb3BlcnRpZXMgaW4gdGhpcyBjbGFzcyB3aXRoIGBjZm5YeHhgIHdpdGggdGhlXG4gIC8vIGhvcGUgdG8gYXZvaWQgdGhvc2UgY29uZmxpY3RzIGluIHRoZSBmdXR1cmUuXG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgZm9yIHRoaXMgcmVzb3VyY2UsIHN1Y2ggYXMgY29uZGl0aW9uLCB1cGRhdGUgcG9saWN5IGV0Yy5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjZm5PcHRpb25zOiBJQ2ZuUmVzb3VyY2VPcHRpb25zID0ge307XG5cbiAgLyoqXG4gICAqIEFXUyByZXNvdXJjZSB0eXBlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNmblJlc291cmNlVHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBV1MgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgcHJvcGVydGllcy5cbiAgICpcbiAgICogVGhpcyBvYmplY3QgaXMgcmV0dXJuZWQgdmlhIGNmblByb3BlcnRpZXNcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgX2NmblByb3BlcnRpZXM6IGFueTtcblxuICAvKipcbiAgICogQW4gb2JqZWN0IHRvIGJlIG1lcmdlZCBvbiB0b3Agb2YgdGhlIGVudGlyZSByZXNvdXJjZSBkZWZpbml0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSByYXdPdmVycmlkZXM6IGFueSA9IHt9O1xuXG4gIC8qKlxuICAgKiBMb2dpY2FsIElEcyBvZiBkZXBlbmRlbmNpZXMuXG4gICAqXG4gICAqIElzIGZpbGxlZCBkdXJpbmcgcHJlcGFyZSgpLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBkZXBlbmRzT24gPSBuZXcgU2V0PENmblJlc291cmNlPigpO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcmVzb3VyY2UgY29uc3RydWN0LlxuICAgKiBAcGFyYW0gY2ZuUmVzb3VyY2VUeXBlIFRoZSBDbG91ZEZvcm1hdGlvbiB0eXBlIG9mIHRoaXMgcmVzb3VyY2UgKGUuZy4gQVdTOjpEeW5hbW9EQjo6VGFibGUpXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuUmVzb3VyY2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAoIXByb3BzLnR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGB0eXBlYCBwcm9wZXJ0eSBpcyByZXF1aXJlZCcpO1xuICAgIH1cblxuICAgIHRoaXMuY2ZuUmVzb3VyY2VUeXBlID0gcHJvcHMudHlwZTtcbiAgICB0aGlzLl9jZm5Qcm9wZXJ0aWVzID0gcHJvcHMucHJvcGVydGllcyB8fCB7fTtcblxuICAgIC8vIGlmIGF3czpjZGs6ZW5hYmxlLXBhdGgtbWV0YWRhdGEgaXMgc2V0LCBlbWJlZCB0aGUgY3VycmVudCBjb25zdHJ1Y3Qnc1xuICAgIC8vIHBhdGggaW4gdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlLCBzbyBpdCB3aWxsIGJlIHBvc3NpYmxlIHRvIHRyYWNlXG4gICAgLy8gYmFjayB0byB0aGUgYWN0dWFsIGNvbnN0cnVjdCBwYXRoLlxuICAgIGlmIChOb2RlLm9mKHRoaXMpLnRyeUdldENvbnRleHQoY3hhcGkuUEFUSF9NRVRBREFUQV9FTkFCTEVfQ09OVEVYVCkpIHtcbiAgICAgIHRoaXMuYWRkTWV0YWRhdGEoY3hhcGkuUEFUSF9NRVRBREFUQV9LRVksIE5vZGUub2YodGhpcykucGF0aCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRlbGV0aW9uIHBvbGljeSBvZiB0aGUgcmVzb3VyY2UgYmFzZWQgb24gdGhlIHJlbW92YWwgcG9saWN5IHNwZWNpZmllZC5cbiAgICpcbiAgICogVGhlIFJlbW92YWwgUG9saWN5IGNvbnRyb2xzIHdoYXQgaGFwcGVucyB0byB0aGlzIHJlc291cmNlIHdoZW4gaXQgc3RvcHNcbiAgICogYmVpbmcgbWFuYWdlZCBieSBDbG91ZEZvcm1hdGlvbiwgZWl0aGVyIGJlY2F1c2UgeW91J3ZlIHJlbW92ZWQgaXQgZnJvbSB0aGVcbiAgICogQ0RLIGFwcGxpY2F0aW9uIG9yIGJlY2F1c2UgeW91J3ZlIG1hZGUgYSBjaGFuZ2UgdGhhdCByZXF1aXJlcyB0aGUgcmVzb3VyY2VcbiAgICogdG8gYmUgcmVwbGFjZWQuXG4gICAqXG4gICAqIFRoZSByZXNvdXJjZSBjYW4gYmUgZGVsZXRlZCAoYFJlbW92YWxQb2xpY3kuREVTVFJPWWApLCBvciBsZWZ0IGluIHlvdXIgQVdTXG4gICAqIGFjY291bnQgZm9yIGRhdGEgcmVjb3ZlcnkgYW5kIGNsZWFudXAgbGF0ZXIgKGBSZW1vdmFsUG9saWN5LlJFVEFJTmApLiBJbiBzb21lXG4gICAqIGNhc2VzLCBhIHNuYXBzaG90IGNhbiBiZSB0YWtlbiBvZiB0aGUgcmVzb3VyY2UgcHJpb3IgdG8gZGVsZXRpb25cbiAgICogKGBSZW1vdmFsUG9saWN5LlNOQVBTSE9UYCkuIEEgbGlzdCBvZiByZXNvdXJjZXMgdGhhdCBzdXBwb3J0IHRoaXMgcG9saWN5XG4gICAqIGNhbiBiZSBmb3VuZCBpbiB0aGUgZm9sbG93aW5nIGxpbms6XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLWF0dHJpYnV0ZS1kZWxldGlvbnBvbGljeS5odG1sI2F3cy1hdHRyaWJ1dGUtZGVsZXRpb25wb2xpY3ktb3B0aW9uc1xuICAgKi9cbiAgcHVibGljIGFwcGx5UmVtb3ZhbFBvbGljeShwb2xpY3k6IFJlbW92YWxQb2xpY3kgfCB1bmRlZmluZWQsIG9wdGlvbnM6IFJlbW92YWxQb2xpY3lPcHRpb25zID0ge30pIHtcbiAgICBwb2xpY3kgPSBwb2xpY3kgfHwgb3B0aW9ucy5kZWZhdWx0IHx8IFJlbW92YWxQb2xpY3kuUkVUQUlOO1xuXG4gICAgbGV0IGRlbGV0aW9uUG9saWN5O1xuXG4gICAgc3dpdGNoIChwb2xpY3kpIHtcbiAgICAgIGNhc2UgUmVtb3ZhbFBvbGljeS5ERVNUUk9ZOlxuICAgICAgICBkZWxldGlvblBvbGljeSA9IENmbkRlbGV0aW9uUG9saWN5LkRFTEVURTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVtb3ZhbFBvbGljeS5SRVRBSU46XG4gICAgICAgIGRlbGV0aW9uUG9saWN5ID0gQ2ZuRGVsZXRpb25Qb2xpY3kuUkVUQUlOO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZW1vdmFsUG9saWN5LlNOQVBTSE9UOlxuICAgICAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtYXR0cmlidXRlLWRlbGV0aW9ucG9saWN5Lmh0bWxcbiAgICAgICAgY29uc3Qgc25hcHNob3R0YWJsZVJlc291cmNlVHlwZXMgPSBbXG4gICAgICAgICAgJ0FXUzo6RUMyOjpWb2x1bWUnLFxuICAgICAgICAgICdBV1M6OkVsYXN0aUNhY2hlOjpDYWNoZUNsdXN0ZXInLFxuICAgICAgICAgICdBV1M6OkVsYXN0aUNhY2hlOjpSZXBsaWNhdGlvbkdyb3VwJyxcbiAgICAgICAgICAnQVdTOjpOZXB0dW5lOjpEQkNsdXN0ZXInLFxuICAgICAgICAgICdBV1M6OlJEUzo6REJDbHVzdGVyJyxcbiAgICAgICAgICAnQVdTOjpSRFM6OkRCSW5zdGFuY2UnLFxuICAgICAgICAgICdBV1M6OlJlZHNoaWZ0OjpDbHVzdGVyJyxcbiAgICAgICAgXTtcblxuICAgICAgICAvLyBlcnJvciBpZiBmbGFnIGlzIHNldCwgd2FybiBpZiBmbGFnIGlzIG5vdFxuICAgICAgICBjb25zdCBwcm9ibGVtYXRpY1NuYXBzaG90UG9saWN5ID0gIXNuYXBzaG90dGFibGVSZXNvdXJjZVR5cGVzLmluY2x1ZGVzKHRoaXMuY2ZuUmVzb3VyY2VUeXBlKTtcbiAgICAgICAgaWYgKHByb2JsZW1hdGljU25hcHNob3RQb2xpY3kpIHtcbiAgICAgICAgICBpZiAoRmVhdHVyZUZsYWdzLm9mKHRoaXMpLmlzRW5hYmxlZChjeGFwaS5WQUxJREFURV9TTkFQU0hPVF9SRU1PVkFMX1BPTElDWSkgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5jZm5SZXNvdXJjZVR5cGV9IGRvZXMgbm90IHN1cHBvcnQgc25hcHNob3QgcmVtb3ZhbCBwb2xpY3lgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZyhgJHt0aGlzLmNmblJlc291cmNlVHlwZX0gZG9lcyBub3Qgc3VwcG9ydCBzbmFwc2hvdCByZW1vdmFsIHBvbGljeS4gVGhpcyBwb2xpY3kgd2lsbCBiZSBpZ25vcmVkLmApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0aW9uUG9saWN5ID0gQ2ZuRGVsZXRpb25Qb2xpY3kuU05BUFNIT1Q7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcmVtb3ZhbCBwb2xpY3k6ICR7cG9saWN5fWApO1xuICAgIH1cblxuICAgIHRoaXMuY2ZuT3B0aW9ucy5kZWxldGlvblBvbGljeSA9IGRlbGV0aW9uUG9saWN5O1xuICAgIGlmIChvcHRpb25zLmFwcGx5VG9VcGRhdGVSZXBsYWNlUG9saWN5ICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5jZm5PcHRpb25zLnVwZGF0ZVJlcGxhY2VQb2xpY3kgPSBkZWxldGlvblBvbGljeTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHRva2VuIGZvciBhbiBydW50aW1lIGF0dHJpYnV0ZSBvZiB0aGlzIHJlc291cmNlLlxuICAgKiBJZGVhbGx5LCB1c2UgZ2VuZXJhdGVkIGF0dHJpYnV0ZSBhY2Nlc3NvcnMgKGUuZy4gYHJlc291cmNlLmFybmApLCBidXQgdGhpcyBjYW4gYmUgdXNlZCBmb3IgZnV0dXJlIGNvbXBhdGliaWxpdHlcbiAgICogaW4gY2FzZSB0aGVyZSBpcyBubyBnZW5lcmF0ZWQgYXR0cmlidXRlLlxuICAgKiBAcGFyYW0gYXR0cmlidXRlTmFtZSBUaGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlLlxuICAgKi9cbiAgcHVibGljIGdldEF0dChhdHRyaWJ1dGVOYW1lOiBzdHJpbmcsIHR5cGVIaW50PzogUmVzb2x1dGlvblR5cGVIaW50KTogUmVmZXJlbmNlIHtcbiAgICByZXR1cm4gQ2ZuUmVmZXJlbmNlLmZvcih0aGlzLCBhdHRyaWJ1dGVOYW1lLCB1bmRlZmluZWQsIHR5cGVIaW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIG92ZXJyaWRlIHRvIHRoZSBzeW50aGVzaXplZCBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZS4gVG8gYWRkIGFcbiAgICogcHJvcGVydHkgb3ZlcnJpZGUsIGVpdGhlciB1c2UgYGFkZFByb3BlcnR5T3ZlcnJpZGVgIG9yIHByZWZpeCBgcGF0aGAgd2l0aFxuICAgKiBcIlByb3BlcnRpZXMuXCIgKGkuZS4gYFByb3BlcnRpZXMuVG9waWNOYW1lYCkuXG4gICAqXG4gICAqIElmIHRoZSBvdmVycmlkZSBpcyBuZXN0ZWQsIHNlcGFyYXRlIGVhY2ggbmVzdGVkIGxldmVsIHVzaW5nIGEgZG90ICguKSBpbiB0aGUgcGF0aCBwYXJhbWV0ZXIuXG4gICAqIElmIHRoZXJlIGlzIGFuIGFycmF5IGFzIHBhcnQgb2YgdGhlIG5lc3RpbmcsIHNwZWNpZnkgdGhlIGluZGV4IGluIHRoZSBwYXRoLlxuICAgKlxuICAgKiBUbyBpbmNsdWRlIGEgbGl0ZXJhbCBgLmAgaW4gdGhlIHByb3BlcnR5IG5hbWUsIHByZWZpeCB3aXRoIGEgYFxcYC4gSW4gbW9zdFxuICAgKiBwcm9ncmFtbWluZyBsYW5ndWFnZXMgeW91IHdpbGwgbmVlZCB0byB3cml0ZSB0aGlzIGFzIGBcIlxcXFwuXCJgIGJlY2F1c2UgdGhlXG4gICAqIGBcXGAgaXRzZWxmIHdpbGwgbmVlZCB0byBiZSBlc2NhcGVkLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSxcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBjZm5SZXNvdXJjZS5hZGRPdmVycmlkZSgnUHJvcGVydGllcy5HbG9iYWxTZWNvbmRhcnlJbmRleGVzLjAuUHJvamVjdGlvbi5Ob25LZXlBdHRyaWJ1dGVzJywgWydteWF0dHJpYnV0ZSddKTtcbiAgICogY2ZuUmVzb3VyY2UuYWRkT3ZlcnJpZGUoJ1Byb3BlcnRpZXMuR2xvYmFsU2Vjb25kYXJ5SW5kZXhlcy4xLlByb2plY3Rpb25UeXBlJywgJ0lOQ0xVREUnKTtcbiAgICogYGBgXG4gICAqIHdvdWxkIGFkZCB0aGUgb3ZlcnJpZGVzXG4gICAqIGBgYGpzb25cbiAgICogXCJQcm9wZXJ0aWVzXCI6IHtcbiAgICogICBcIkdsb2JhbFNlY29uZGFyeUluZGV4ZXNcIjogW1xuICAgKiAgICAge1xuICAgKiAgICAgICBcIlByb2plY3Rpb25cIjoge1xuICAgKiAgICAgICAgIFwiTm9uS2V5QXR0cmlidXRlc1wiOiBbIFwibXlhdHRyaWJ1dGVcIiBdXG4gICAqICAgICAgICAgLi4uXG4gICAqICAgICAgIH1cbiAgICogICAgICAgLi4uXG4gICAqICAgICB9LFxuICAgKiAgICAge1xuICAgKiAgICAgICBcIlByb2plY3Rpb25UeXBlXCI6IFwiSU5DTFVERVwiXG4gICAqICAgICAgIC4uLlxuICAgKiAgICAgfSxcbiAgICogICBdXG4gICAqICAgLi4uXG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBgdmFsdWVgIGFyZ3VtZW50IHRvIGBhZGRPdmVycmlkZWAgd2lsbCBub3QgYmUgcHJvY2Vzc2VkIG9yIHRyYW5zbGF0ZWRcbiAgICogaW4gYW55IHdheS4gUGFzcyByYXcgSlNPTiB2YWx1ZXMgaW4gaGVyZSB3aXRoIHRoZSBjb3JyZWN0IGNhcGl0YWxpemF0aW9uXG4gICAqIGZvciBDbG91ZEZvcm1hdGlvbi4gSWYgeW91IHBhc3MgQ0RLIGNsYXNzZXMgb3Igc3RydWN0cywgdGhleSB3aWxsIGJlXG4gICAqIHJlbmRlcmVkIHdpdGggbG93ZXJjYXNlZCBrZXkgbmFtZXMsIGFuZCBDbG91ZEZvcm1hdGlvbiB3aWxsIHJlamVjdCB0aGVcbiAgICogdGVtcGxhdGUuXG4gICAqXG4gICAqIEBwYXJhbSBwYXRoIC0gVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5LCB5b3UgY2FuIHVzZSBkb3Qgbm90YXRpb24gdG9cbiAgICogICAgICAgIG92ZXJyaWRlIHZhbHVlcyBpbiBjb21wbGV4IHR5cGVzLiBBbnkgaW50ZXJtZGVkaWF0ZSBrZXlzXG4gICAqICAgICAgICB3aWxsIGJlIGNyZWF0ZWQgYXMgbmVlZGVkLlxuICAgKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUuIENvdWxkIGJlIHByaW1pdGl2ZSBvciBjb21wbGV4LlxuICAgKi9cbiAgcHVibGljIGFkZE92ZXJyaWRlKHBhdGg6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIGNvbnN0IHBhcnRzID0gc3BsaXRPblBlcmlvZHMocGF0aCk7XG4gICAgbGV0IGN1cnI6IGFueSA9IHRoaXMucmF3T3ZlcnJpZGVzO1xuXG4gICAgd2hpbGUgKHBhcnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IGtleSA9IHBhcnRzLnNoaWZ0KCkhO1xuXG4gICAgICAvLyBpZiB3ZSBjYW4ndCByZWN1cnNlIGZ1cnRoZXIgb3IgdGhlIHByZXZpb3VzIHZhbHVlIGlzIG5vdCBhblxuICAgICAgLy8gb2JqZWN0IG92ZXJ3cml0ZSBpdCB3aXRoIGFuIG9iamVjdC5cbiAgICAgIGNvbnN0IGlzT2JqZWN0ID0gY3VycltrZXldICE9IG51bGwgJiYgdHlwZW9mKGN1cnJba2V5XSkgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGN1cnJba2V5XSk7XG4gICAgICBpZiAoIWlzT2JqZWN0KSB7XG4gICAgICAgIGN1cnJba2V5XSA9IHt9O1xuICAgICAgfVxuXG4gICAgICBjdXJyID0gY3VycltrZXldO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3RLZXkgPSBwYXJ0cy5zaGlmdCgpITtcbiAgICBjdXJyW2xhc3RLZXldID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogU3ludGFjdGljIHN1Z2FyIGZvciBgYWRkT3ZlcnJpZGUocGF0aCwgdW5kZWZpbmVkKWAuXG4gICAqIEBwYXJhbSBwYXRoIFRoZSBwYXRoIG9mIHRoZSB2YWx1ZSB0byBkZWxldGVcbiAgICovXG4gIHB1YmxpYyBhZGREZWxldGlvbk92ZXJyaWRlKHBhdGg6IHN0cmluZykge1xuICAgIHRoaXMuYWRkT3ZlcnJpZGUocGF0aCwgdW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIG92ZXJyaWRlIHRvIGEgcmVzb3VyY2UgcHJvcGVydHkuXG4gICAqXG4gICAqIFN5bnRhY3RpYyBzdWdhciBmb3IgYGFkZE92ZXJyaWRlKFwiUHJvcGVydGllcy48Li4uPlwiLCB2YWx1ZSlgLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcGVydHlQYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eVxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlXG4gICAqL1xuICBwdWJsaWMgYWRkUHJvcGVydHlPdmVycmlkZShwcm9wZXJ0eVBhdGg6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMuYWRkT3ZlcnJpZGUoYFByb3BlcnRpZXMuJHtwcm9wZXJ0eVBhdGh9YCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gb3ZlcnJpZGUgdGhhdCBkZWxldGVzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IGZyb20gdGhlIHJlc291cmNlIGRlZmluaXRpb24uXG4gICAqIEBwYXJhbSBwcm9wZXJ0eVBhdGggVGhlIHBhdGggdG8gdGhlIHByb3BlcnR5LlxuICAgKi9cbiAgcHVibGljIGFkZFByb3BlcnR5RGVsZXRpb25PdmVycmlkZShwcm9wZXJ0eVBhdGg6IHN0cmluZykge1xuICAgIHRoaXMuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wZXJ0eVBhdGgsIHVuZGVmaW5lZCk7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIHRoYXQgdGhpcyByZXNvdXJjZSBkZXBlbmRzIG9uIGFub3RoZXIgcmVzb3VyY2UgYW5kIGNhbm5vdCBiZVxuICAgKiBwcm92aXNpb25lZCB1bmxlc3MgdGhlIG90aGVyIHJlc291cmNlIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBwcm92aXNpb25lZC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGFkZERlcGVuZGVuY3lcbiAgICovXG4gIHB1YmxpYyBhZGREZXBlbmRzT24odGFyZ2V0OiBDZm5SZXNvdXJjZSkge1xuICAgIHJldHVybiB0aGlzLmFkZERlcGVuZGVuY3kodGFyZ2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhhdCB0aGlzIHJlc291cmNlIGRlcGVuZHMgb24gYW5vdGhlciByZXNvdXJjZSBhbmQgY2Fubm90IGJlXG4gICAqIHByb3Zpc2lvbmVkIHVubGVzcyB0aGUgb3RoZXIgcmVzb3VyY2UgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHByb3Zpc2lvbmVkLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIGZvciByZXNvdXJjZXMgYWNyb3NzIHN0YWNrcyAob3IgbmVzdGVkIHN0YWNrKSBib3VuZGFyaWVzXG4gICAqIGFuZCB0aGUgZGVwZW5kZW5jeSB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgdHJhbnNmZXJyZWQgdG8gdGhlIHJlbGV2YW50IHNjb3BlLlxuICAgKi9cbiAgcHVibGljIGFkZERlcGVuZGVuY3kodGFyZ2V0OiBDZm5SZXNvdXJjZSkge1xuICAgIC8vIHNraXAgdGhpcyBkZXBlbmRlbmN5IGlmIHRoZSB0YXJnZXQgaXMgbm90IHBhcnQgb2YgdGhlIG91dHB1dFxuICAgIGlmICghdGFyZ2V0LnNob3VsZFN5bnRoZXNpemUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGFkZERlcGVuZGVuY3kodGhpcywgdGFyZ2V0LCBgeyR7dGhpcy5ub2RlLnBhdGh9fS5hZGREZXBlbmRlbmN5KHske3RhcmdldC5ub2RlLnBhdGh9fSlgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhhdCB0aGlzIHJlc291cmNlIG5vIGxvbmdlciBkZXBlbmRzIG9uIGFub3RoZXIgcmVzb3VyY2UuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgZm9yIHJlc291cmNlcyBhY3Jvc3Mgc3RhY2tzIChpbmNsdWRpbmcgbmVzdGVkIHN0YWNrcylcbiAgICogYW5kIHRoZSBkZXBlbmRlbmN5IHdpbGwgYXV0b21hdGljYWxseSBiZSByZW1vdmVkIGZyb20gdGhlIHJlbGV2YW50IHNjb3BlLlxuICAgKi9cbiAgcHVibGljIHJlbW92ZURlcGVuZGVuY3kodGFyZ2V0OiBDZm5SZXNvdXJjZSkgOiB2b2lkIHtcbiAgICAvLyBza2lwIHRoaXMgZGVwZW5kZW5jeSBpZiB0aGUgdGFyZ2V0IGlzIG5vdCBwYXJ0IG9mIHRoZSBvdXRwdXRcbiAgICBpZiAoIXRhcmdldC5zaG91bGRTeW50aGVzaXplKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZW1vdmVEZXBlbmRlbmN5KHRoaXMsIHRhcmdldCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIGFuIGFycmF5IG9mIHJlc291cmNlcyB0aGlzIHJlc291cmNlIGRlcGVuZHMgb24uXG4gICAqXG4gICAqIFRoaXMgYXNzZW1ibGVzIGRlcGVuZGVuY2llcyBvbiByZXNvdXJjZXMgYWNyb3NzIHN0YWNrcyAoaW5jbHVkaW5nIG5lc3RlZCBzdGFja3MpXG4gICAqIGF1dG9tYXRpY2FsbHkuXG4gICAqL1xuICBwdWJsaWMgb2J0YWluRGVwZW5kZW5jaWVzKCkge1xuICAgIHJldHVybiBvYnRhaW5EZXBlbmRlbmNpZXModGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZXMgb25lIGRlcGVuZGVuY3kgd2l0aCBhbm90aGVyLlxuICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSBkZXBlbmRlbmN5IHRvIHJlcGxhY2VcbiAgICogQHBhcmFtIG5ld1RhcmdldCBUaGUgbmV3IGRlcGVuZGVuY3kgdG8gYWRkXG4gICAqL1xuICBwdWJsaWMgcmVwbGFjZURlcGVuZGVuY3kodGFyZ2V0OiBDZm5SZXNvdXJjZSwgbmV3VGFyZ2V0OiBDZm5SZXNvdXJjZSkgOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vYnRhaW5EZXBlbmRlbmNpZXMoKS5pbmNsdWRlcyh0YXJnZXQpKSB7XG4gICAgICB0aGlzLnJlbW92ZURlcGVuZGVuY3kodGFyZ2V0KTtcbiAgICAgIHRoaXMuYWRkRGVwZW5kZW5jeShuZXdUYXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFwiJHtOb2RlLm9mKHRoaXMpLnBhdGh9XCIgZG9lcyBub3QgZGVwZW5kIG9uIFwiJHtOb2RlLm9mKHRhcmdldCkucGF0aH1cImApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSB2YWx1ZSB0byB0aGUgQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2UgTWV0YWRhdGFcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9tZXRhZGF0YS1zZWN0aW9uLXN0cnVjdHVyZS5odG1sXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGlzIGlzIGEgZGlmZmVyZW50IHNldCBvZiBtZXRhZGF0YSBmcm9tIENESyBub2RlIG1ldGFkYXRhOyB0aGlzXG4gICAqIG1ldGFkYXRhIGVuZHMgdXAgaW4gdGhlIHN0YWNrIHRlbXBsYXRlIHVuZGVyIHRoZSByZXNvdXJjZSwgd2hlcmVhcyBDREtcbiAgICogbm9kZSBtZXRhZGF0YSBlbmRzIHVwIGluIHRoZSBDbG91ZCBBc3NlbWJseS5cbiAgICovXG4gIHB1YmxpYyBhZGRNZXRhZGF0YShrZXk6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIGlmICghdGhpcy5jZm5PcHRpb25zLm1ldGFkYXRhKSB7XG4gICAgICB0aGlzLmNmbk9wdGlvbnMubWV0YWRhdGEgPSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLmNmbk9wdGlvbnMubWV0YWRhdGFba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGEgdmFsdWUgdmFsdWUgZnJvbSB0aGUgQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2UgTWV0YWRhdGFcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9tZXRhZGF0YS1zZWN0aW9uLXN0cnVjdHVyZS5odG1sXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGlzIGlzIGEgZGlmZmVyZW50IHNldCBvZiBtZXRhZGF0YSBmcm9tIENESyBub2RlIG1ldGFkYXRhOyB0aGlzXG4gICAqIG1ldGFkYXRhIGVuZHMgdXAgaW4gdGhlIHN0YWNrIHRlbXBsYXRlIHVuZGVyIHRoZSByZXNvdXJjZSwgd2hlcmVhcyBDREtcbiAgICogbm9kZSBtZXRhZGF0YSBlbmRzIHVwIGluIHRoZSBDbG91ZCBBc3NlbWJseS5cbiAgICovXG4gIHB1YmxpYyBnZXRNZXRhZGF0YShrZXk6IHN0cmluZyk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuY2ZuT3B0aW9ucy5tZXRhZGF0YT8uW2tleV07XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyByZXNvdXJjZVxuICAgKi9cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgJHtzdXBlci50b1N0cmluZygpfSBbJHt0aGlzLmNmblJlc291cmNlVHlwZX1dYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgYnkgdGhlIGBhZGREZXBlbmRlbmN5YCBoZWxwZXIgZnVuY3Rpb24gaW4gb3JkZXIgdG8gcmVhbGl6ZSBhIGRpcmVjdFxuICAgKiBkZXBlbmRlbmN5IGJldHdlZW4gdHdvIHJlc291cmNlcyB0aGF0IGFyZSBkaXJlY3RseSBkZWZpbmVkIGluIHRoZSBzYW1lXG4gICAqIHN0YWNrcy5cbiAgICpcbiAgICogVXNlIGByZXNvdXJjZS5hZGREZXBlbmRlbmN5YCB0byBkZWZpbmUgdGhlIGRlcGVuZGVuY3kgYmV0d2VlbiB0d28gcmVzb3VyY2VzLFxuICAgKiB3aGljaCBhbHNvIHRha2VzIHN0YWNrIGJvdW5kYXJpZXMgaW50byBhY2NvdW50LlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfYWRkUmVzb3VyY2VEZXBlbmRlbmN5KHRhcmdldDogQ2ZuUmVzb3VyY2UpIHtcbiAgICB0aGlzLmRlcGVuZHNPbi5hZGQodGFyZ2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBzaGFsbG93IGNvcHkgb2YgZGVwZW5kZW5jaWVzIGJldHdlZW4gdGhpcyByZXNvdXJjZSBhbmQgb3RoZXIgcmVzb3VyY2VzXG4gICAqIGluIHRoZSBzYW1lIHN0YWNrLlxuICAgKi9cbiAgcHVibGljIG9idGFpblJlc291cmNlRGVwZW5kZW5jaWVzKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuZGVwZW5kc09uLnZhbHVlcygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBkZXBlbmRlbmN5IGJldHdlZW4gdGhpcyByZXNvdXJjZSBhbmQgb3RoZXIgcmVzb3VyY2VzIGluIHRoZSBzYW1lXG4gICAqIHN0YWNrLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfcmVtb3ZlUmVzb3VyY2VEZXBlbmRlbmN5KHRhcmdldDogQ2ZuUmVzb3VyY2UpIHtcbiAgICB0aGlzLmRlcGVuZHNPbi5kZWxldGUodGFyZ2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyBDbG91ZEZvcm1hdGlvbiBmb3IgdGhpcyByZXNvdXJjZS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3RvQ2xvdWRGb3JtYXRpb24oKTogb2JqZWN0IHtcbiAgICBpZiAoIXRoaXMuc2hvdWxkU3ludGhlc2l6ZSgpKSB7XG4gICAgICByZXR1cm4geyB9O1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXQgPSB7XG4gICAgICAgIFJlc291cmNlczoge1xuICAgICAgICAgIC8vIFBvc3QtUmVzb2x2ZSBvcGVyYXRpb24gc2luY2Ugb3RoZXJ3aXNlIGRlZXBNZXJnZSBpcyBnb2luZyB0byBtaXggdmFsdWVzIGludG9cbiAgICAgICAgICAvLyB0aGUgVG9rZW4gb2JqZWN0cyByZXR1cm5lZCBieSBpZ25vcmVFbXB0eS5cbiAgICAgICAgICBbdGhpcy5sb2dpY2FsSWRdOiBuZXcgUG9zdFJlc29sdmVUb2tlbih7XG4gICAgICAgICAgICBUeXBlOiB0aGlzLmNmblJlc291cmNlVHlwZSxcbiAgICAgICAgICAgIFByb3BlcnRpZXM6IGlnbm9yZUVtcHR5KHRoaXMuY2ZuUHJvcGVydGllcyksXG4gICAgICAgICAgICBEZXBlbmRzT246IGlnbm9yZUVtcHR5KHJlbmRlckRlcGVuZHNPbih0aGlzLmRlcGVuZHNPbikpLFxuICAgICAgICAgICAgQ3JlYXRpb25Qb2xpY3k6IGNhcGl0YWxpemVQcm9wZXJ0eU5hbWVzKHRoaXMsIHJlbmRlckNyZWF0aW9uUG9saWN5KHRoaXMuY2ZuT3B0aW9ucy5jcmVhdGlvblBvbGljeSkpLFxuICAgICAgICAgICAgVXBkYXRlUG9saWN5OiBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyh0aGlzLCB0aGlzLmNmbk9wdGlvbnMudXBkYXRlUG9saWN5KSxcbiAgICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6IGNhcGl0YWxpemVQcm9wZXJ0eU5hbWVzKHRoaXMsIHRoaXMuY2ZuT3B0aW9ucy51cGRhdGVSZXBsYWNlUG9saWN5KSxcbiAgICAgICAgICAgIERlbGV0aW9uUG9saWN5OiBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyh0aGlzLCB0aGlzLmNmbk9wdGlvbnMuZGVsZXRpb25Qb2xpY3kpLFxuICAgICAgICAgICAgVmVyc2lvbjogdGhpcy5jZm5PcHRpb25zLnZlcnNpb24sXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogdGhpcy5jZm5PcHRpb25zLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgTWV0YWRhdGE6IGlnbm9yZUVtcHR5KHRoaXMuY2ZuT3B0aW9ucy5tZXRhZGF0YSksXG4gICAgICAgICAgICBDb25kaXRpb246IHRoaXMuY2ZuT3B0aW9ucy5jb25kaXRpb24gJiYgdGhpcy5jZm5PcHRpb25zLmNvbmRpdGlvbi5sb2dpY2FsSWQsXG4gICAgICAgICAgfSwgcmVzb3VyY2VEZWYgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVuZGVyZWRQcm9wcyA9IHRoaXMucmVuZGVyUHJvcGVydGllcyhyZXNvdXJjZURlZi5Qcm9wZXJ0aWVzIHx8IHt9KTtcbiAgICAgICAgICAgIGlmIChyZW5kZXJlZFByb3BzKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGhhc0RlZmluZWQgPSBPYmplY3QudmFsdWVzKHJlbmRlcmVkUHJvcHMpLmZpbmQodiA9PiB2ICE9PSB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICByZXNvdXJjZURlZi5Qcm9wZXJ0aWVzID0gaGFzRGVmaW5lZCAhPT0gdW5kZWZpbmVkID8gcmVuZGVyZWRQcm9wcyA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlc29sdmVkUmF3T3ZlcnJpZGVzID0gVG9rZW5pemF0aW9uLnJlc29sdmUodGhpcy5yYXdPdmVycmlkZXMsIHtcbiAgICAgICAgICAgICAgc2NvcGU6IHRoaXMsXG4gICAgICAgICAgICAgIHJlc29sdmVyOiBDTE9VREZPUk1BVElPTl9UT0tFTl9SRVNPTFZFUixcbiAgICAgICAgICAgICAgLy8gd2UgbmVlZCB0byBwcmVzZXJ2ZSB0aGUgZW1wdHkgZWxlbWVudHMgaGVyZSxcbiAgICAgICAgICAgICAgLy8gYXMgdGhhdCdzIGhvdyByZW1vdmluZyBvdmVycmlkZXMgYXJlIHJlcHJlc2VudGVkIGFzXG4gICAgICAgICAgICAgIHJlbW92ZUVtcHR5OiBmYWxzZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZXBNZXJnZShyZXNvdXJjZURlZiwgcmVzb2x2ZWRSYXdPdmVycmlkZXMpO1xuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gQ2hhbmdlIG1lc3NhZ2VcbiAgICAgIGUubWVzc2FnZSA9IGBXaGlsZSBzeW50aGVzaXppbmcgJHt0aGlzLm5vZGUucGF0aH06ICR7ZS5tZXNzYWdlfWA7XG4gICAgICAvLyBBZGp1c3Qgc3RhY2sgdHJhY2UgKG1ha2UgaXQgbG9vayBsaWtlIG5vZGUgYnVpbHQgaXQsIHRvby4uLilcbiAgICAgIGNvbnN0IHRyYWNlID0gdGhpcy5jcmVhdGlvblN0YWNrO1xuICAgICAgaWYgKHRyYWNlKSB7XG4gICAgICAgIGNvbnN0IGNyZWF0aW9uU3RhY2sgPSBbJy0tLSByZXNvdXJjZSBjcmVhdGVkIGF0IC0tLScsIC4uLnRyYWNlXS5qb2luKCdcXG4gIGF0ICcpO1xuICAgICAgICBjb25zdCBwcm9ibGVtVHJhY2UgPSBlLnN0YWNrLnNsaWNlKGUuc3RhY2suaW5kZXhPZihlLm1lc3NhZ2UpICsgZS5tZXNzYWdlLmxlbmd0aCk7XG4gICAgICAgIGUuc3RhY2sgPSBgJHtlLm1lc3NhZ2V9XFxuICAke2NyZWF0aW9uU3RhY2t9XFxuICAtLS0gcHJvYmxlbSBkaXNjb3ZlcmVkIGF0IC0tLSR7cHJvYmxlbVRyYWNlfWA7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlLXRocm93XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIC8vIHJldHVybnMgdGhlIHNldCBvZiBsb2dpY2FsIElEICh0b2tlbnMpIHRoaXMgcmVzb3VyY2UgZGVwZW5kcyBvblxuICAgIC8vIHNvcnRlZCBieSBjb25zdHJ1Y3QgcGF0aHMgdG8gZW5zdXJlIHRlc3QgZGV0ZXJtaW5pc21cbiAgICBmdW5jdGlvbiByZW5kZXJEZXBlbmRzT24oZGVwZW5kc09uOiBTZXQ8Q2ZuUmVzb3VyY2U+KSB7XG4gICAgICByZXR1cm4gQXJyYXlcbiAgICAgICAgLmZyb20oZGVwZW5kc09uKVxuICAgICAgICAuc29ydCgoeCwgeSkgPT4geC5ub2RlLnBhdGgubG9jYWxlQ29tcGFyZSh5Lm5vZGUucGF0aCkpXG4gICAgICAgIC5tYXAociA9PiByLmxvZ2ljYWxJZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyQ3JlYXRpb25Qb2xpY3kocG9saWN5OiBDZm5DcmVhdGlvblBvbGljeSB8IHVuZGVmaW5lZCk6IGFueSB7XG4gICAgICBpZiAoIXBvbGljeSkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gICAgICBjb25zdCByZXN1bHQ6IGFueSA9IHsgLi4ucG9saWN5IH07XG4gICAgICBpZiAocG9saWN5LnJlc291cmNlU2lnbmFsICYmIHBvbGljeS5yZXNvdXJjZVNpZ25hbC50aW1lb3V0KSB7XG4gICAgICAgIHJlc3VsdC5yZXNvdXJjZVNpZ25hbCA9IHBvbGljeS5yZXNvdXJjZVNpZ25hbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIGNvbnN0IHByb3BzID0gdGhpcy5fY2ZuUHJvcGVydGllcyB8fCB7fTtcbiAgICBpZiAoVGFnTWFuYWdlci5pc1RhZ2dhYmxlKHRoaXMpKSB7XG4gICAgICBjb25zdCB0YWdzUHJvcDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuICAgICAgdGFnc1Byb3BbdGhpcy50YWdzLnRhZ1Byb3BlcnR5TmFtZV0gPSB0aGlzLnRhZ3MucmVuZGVyVGFncygpO1xuICAgICAgcmV0dXJuIGRlZXBNZXJnZShwcm9wcywgdGFnc1Byb3ApO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cblxuICAvKipcbiAgICogRGVwcmVjYXRlZFxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYHVwZGF0ZWRQcm9wZXJ0aWVzYFxuICAgKlxuICAgKiBSZXR1cm4gcHJvcGVydGllcyBtb2RpZmllZCBhZnRlciBpbml0aWF0aW9uXG4gICAqXG4gICAqIFJlc291cmNlcyB0aGF0IGV4cG9zZSBtdXRhYmxlIHByb3BlcnRpZXMgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb24gdG9cbiAgICogY29sbGVjdCBhbmQgcmV0dXJuIHRoZSBwcm9wZXJ0aWVzIG9iamVjdCBmb3IgdGhpcyByZXNvdXJjZS5cbiAgICovXG4gIHByb3RlY3RlZCBnZXQgdXBkYXRlZFByb3Blcml0ZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZFByb3BlcnRpZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHByb3BlcnRpZXMgbW9kaWZpZWQgYWZ0ZXIgaW5pdGlhdGlvblxuICAgKlxuICAgKiBSZXNvdXJjZXMgdGhhdCBleHBvc2UgbXV0YWJsZSBwcm9wZXJ0aWVzIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uIHRvXG4gICAqIGNvbGxlY3QgYW5kIHJldHVybiB0aGUgcHJvcGVydGllcyBvYmplY3QgZm9yIHRoaXMgcmVzb3VyY2UuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0IHVwZGF0ZWRQcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIHJldHVybiB0aGlzLl9jZm5Qcm9wZXJ0aWVzO1xuICB9XG5cbiAgcHJvdGVjdGVkIHZhbGlkYXRlUHJvcGVydGllcyhfcHJvcGVydGllczogYW55KSB7XG4gICAgLy8gTm90aGluZ1xuICB9XG5cbiAgLyoqXG4gICAqIENhbiBiZSBvdmVycmlkZGVuIGJ5IHN1YmNsYXNzZXMgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgcmVzb3VyY2Ugd2lsbCBiZSByZW5kZXJlZFxuICAgKiBpbnRvIHRoZSBjbG91ZGZvcm1hdGlvbiB0ZW1wbGF0ZS5cbiAgICpcbiAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSByZXNvdXJjZSBzaG91bGQgYmUgaW5jbHVkZWQgb3IgYGZhbHNlYCBpcyB0aGUgcmVzb3VyY2VcbiAgICogc2hvdWxkIGJlIG9taXR0ZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2hvdWxkU3ludGhlc2l6ZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZW51bSBUYWdUeXBlIHtcbiAgU1RBTkRBUkQgPSAnU3RhbmRhcmRUYWcnLFxuICBBVVRPU0NBTElOR19HUk9VUCA9ICdBdXRvU2NhbGluZ0dyb3VwVGFnJyxcbiAgTUFQID0gJ1N0cmluZ1RvU3RyaW5nTWFwJyxcbiAgS0VZX1ZBTFVFID0gJ0tleVZhbHVlJyxcbiAgTk9UX1RBR0dBQkxFID0gJ05vdFRhZ2dhYmxlJyxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQ2ZuUmVzb3VyY2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIEEgY29uZGl0aW9uIHRvIGFzc29jaWF0ZSB3aXRoIHRoaXMgcmVzb3VyY2UuIFRoaXMgbWVhbnMgdGhhdCBvbmx5IGlmIHRoZSBjb25kaXRpb24gZXZhbHVhdGVzIHRvICd0cnVlJyB3aGVuIHRoZSBzdGFja1xuICAgKiBpcyBkZXBsb3llZCwgdGhlIHJlc291cmNlIHdpbGwgYmUgaW5jbHVkZWQuIFRoaXMgaXMgcHJvdmlkZWQgdG8gYWxsb3cgQ0RLIHByb2plY3RzIHRvIHByb2R1Y2UgbGVnYWN5IHRlbXBsYXRlcywgYnV0IG5vcm1hbGx5XG4gICAqIHRoZXJlIGlzIG5vIG5lZWQgdG8gdXNlIGl0IGluIENESyBwcm9qZWN0cy5cbiAgICovXG4gIGNvbmRpdGlvbj86IENmbkNvbmRpdGlvbjtcblxuICAvKipcbiAgICogQXNzb2NpYXRlIHRoZSBDcmVhdGlvblBvbGljeSBhdHRyaWJ1dGUgd2l0aCBhIHJlc291cmNlIHRvIHByZXZlbnQgaXRzIHN0YXR1cyBmcm9tIHJlYWNoaW5nIGNyZWF0ZSBjb21wbGV0ZSB1bnRpbFxuICAgKiBBV1MgQ2xvdWRGb3JtYXRpb24gcmVjZWl2ZXMgYSBzcGVjaWZpZWQgbnVtYmVyIG9mIHN1Y2Nlc3Mgc2lnbmFscyBvciB0aGUgdGltZW91dCBwZXJpb2QgaXMgZXhjZWVkZWQuIFRvIHNpZ25hbCBhXG4gICAqIHJlc291cmNlLCB5b3UgY2FuIHVzZSB0aGUgY2ZuLXNpZ25hbCBoZWxwZXIgc2NyaXB0IG9yIFNpZ25hbFJlc291cmNlIEFQSS4gQVdTIENsb3VkRm9ybWF0aW9uIHB1Ymxpc2hlcyB2YWxpZCBzaWduYWxzXG4gICAqIHRvIHRoZSBzdGFjayBldmVudHMgc28gdGhhdCB5b3UgdHJhY2sgdGhlIG51bWJlciBvZiBzaWduYWxzIHNlbnQuXG4gICAqL1xuICBjcmVhdGlvblBvbGljeT86IENmbkNyZWF0aW9uUG9saWN5O1xuXG4gIC8qKlxuICAgKiBXaXRoIHRoZSBEZWxldGlvblBvbGljeSBhdHRyaWJ1dGUgeW91IGNhbiBwcmVzZXJ2ZSBvciAoaW4gc29tZSBjYXNlcykgYmFja3VwIGEgcmVzb3VyY2Ugd2hlbiBpdHMgc3RhY2sgaXMgZGVsZXRlZC5cbiAgICogWW91IHNwZWNpZnkgYSBEZWxldGlvblBvbGljeSBhdHRyaWJ1dGUgZm9yIGVhY2ggcmVzb3VyY2UgdGhhdCB5b3Ugd2FudCB0byBjb250cm9sLiBJZiBhIHJlc291cmNlIGhhcyBubyBEZWxldGlvblBvbGljeVxuICAgKiBhdHRyaWJ1dGUsIEFXUyBDbG91ZEZvcm1hdGlvbiBkZWxldGVzIHRoZSByZXNvdXJjZSBieSBkZWZhdWx0LiBOb3RlIHRoYXQgdGhpcyBjYXBhYmlsaXR5IGFsc28gYXBwbGllcyB0byB1cGRhdGUgb3BlcmF0aW9uc1xuICAgKiB0aGF0IGxlYWQgdG8gcmVzb3VyY2VzIGJlaW5nIHJlbW92ZWQuXG4gICAqL1xuICBkZWxldGlvblBvbGljeT86IENmbkRlbGV0aW9uUG9saWN5O1xuXG4gIC8qKlxuICAgKiBVc2UgdGhlIFVwZGF0ZVBvbGljeSBhdHRyaWJ1dGUgdG8gc3BlY2lmeSBob3cgQVdTIENsb3VkRm9ybWF0aW9uIGhhbmRsZXMgdXBkYXRlcyB0byB0aGUgQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cFxuICAgKiByZXNvdXJjZS4gQVdTIENsb3VkRm9ybWF0aW9uIGludm9rZXMgb25lIG9mIHRocmVlIHVwZGF0ZSBwb2xpY2llcyBkZXBlbmRpbmcgb24gdGhlIHR5cGUgb2YgY2hhbmdlIHlvdSBtYWtlIG9yIHdoZXRoZXIgYVxuICAgKiBzY2hlZHVsZWQgYWN0aW9uIGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgQXV0byBTY2FsaW5nIGdyb3VwLlxuICAgKi9cbiAgdXBkYXRlUG9saWN5PzogQ2ZuVXBkYXRlUG9saWN5O1xuXG4gIC8qKlxuICAgKiBVc2UgdGhlIFVwZGF0ZVJlcGxhY2VQb2xpY3kgYXR0cmlidXRlIHRvIHJldGFpbiBvciAoaW4gc29tZSBjYXNlcykgYmFja3VwIHRoZSBleGlzdGluZyBwaHlzaWNhbCBpbnN0YW5jZSBvZiBhIHJlc291cmNlXG4gICAqIHdoZW4gaXQgaXMgcmVwbGFjZWQgZHVyaW5nIGEgc3RhY2sgdXBkYXRlIG9wZXJhdGlvbi5cbiAgICovXG4gIHVwZGF0ZVJlcGxhY2VQb2xpY3k/OiBDZm5EZWxldGlvblBvbGljeTtcblxuICAvKipcbiAgICogVGhlIHZlcnNpb24gb2YgdGhpcyByZXNvdXJjZS5cbiAgICogVXNlZCBvbmx5IGZvciBjdXN0b20gQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2VzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1jZm4tY3VzdG9tcmVzb3VyY2UuaHRtbFxuICAgKi9cbiAgdmVyc2lvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRlc2NyaXB0aW9uIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAqIFVzZWQgZm9yIGluZm9ybWF0aW9uYWwgcHVycG9zZXMgb25seSwgaXMgbm90IHByb2Nlc3NlZCBpbiBhbnkgd2F5XG4gICAqIChhbmQgc3RheXMgd2l0aCB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUsIGlzIG5vdCBwYXNzZWQgdG8gdGhlIHVuZGVybHlpbmcgcmVzb3VyY2UsXG4gICAqIGV2ZW4gaWYgaXQgZG9lcyBoYXZlIGEgJ2Rlc2NyaXB0aW9uJyBwcm9wZXJ0eSkuXG4gICAqL1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogTWV0YWRhdGEgYXNzb2NpYXRlZCB3aXRoIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZS4gVGhpcyBpcyBub3QgdGhlIHNhbWUgYXMgdGhlIGNvbnN0cnVjdCBtZXRhZGF0YSB3aGljaCBjYW4gYmUgYWRkZWRcbiAgICogdXNpbmcgY29uc3RydWN0LmFkZE1ldGFkYXRhKCksIGJ1dCB3b3VsZCBub3QgYXBwZWFyIGluIHRoZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBhdXRvbWF0aWNhbGx5LlxuICAgKi9cbiAgbWV0YWRhdGE/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9O1xufVxuXG4vKipcbiAqIE9iamVjdCBrZXlzIHRoYXQgZGVlcE1lcmdlIHNob3VsZCBub3QgY29uc2lkZXIuIEN1cnJlbnRseSB0aGVzZSBpbmNsdWRlXG4gKiBDbG91ZEZvcm1hdGlvbiBpbnRyaW5zaWNzXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9pbnRyaW5zaWMtZnVuY3Rpb24tcmVmZXJlbmNlLmh0bWxcbiAqL1xuXG5jb25zdCBNRVJHRV9FWENMVURFX0tFWVM6IHN0cmluZ1tdID0gW1xuICAnUmVmJyxcbiAgJ0ZuOjpCYXNlNjQnLFxuICAnRm46OkNpZHInLFxuICAnRm46OkZpbmRJbk1hcCcsXG4gICdGbjo6R2V0QXR0JyxcbiAgJ0ZuOjpHZXRBWnMnLFxuICAnRm46OkltcG9ydFZhbHVlJyxcbiAgJ0ZuOjpKb2luJyxcbiAgJ0ZuOjpTZWxlY3QnLFxuICAnRm46OlNwbGl0JyxcbiAgJ0ZuOjpTdWInLFxuICAnRm46OlRyYW5zZm9ybScsXG4gICdGbjo6QW5kJyxcbiAgJ0ZuOjpFcXVhbHMnLFxuICAnRm46OklmJyxcbiAgJ0ZuOjpOb3QnLFxuICAnRm46Ok9yJyxcbl07XG5cbi8qKlxuICogTWVyZ2VzIGBzb3VyY2VgIGludG8gYHRhcmdldGAsIG92ZXJyaWRpbmcgYW55IGV4aXN0aW5nIHZhbHVlcy5cbiAqIGBudWxsYHMgd2lsbCBjYXVzZSBhIHZhbHVlIHRvIGJlIGRlbGV0ZWQuXG4gKi9cbmZ1bmN0aW9uIGRlZXBNZXJnZSh0YXJnZXQ6IGFueSwgLi4uc291cmNlczogYW55W10pIHtcbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgIGlmICh0eXBlb2Yoc291cmNlKSAhPT0gJ29iamVjdCcgfHwgdHlwZW9mKHRhcmdldCkgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdXNhZ2UuIEJvdGggc291cmNlICgke0pTT04uc3RyaW5naWZ5KHNvdXJjZSl9KSBhbmQgdGFyZ2V0ICgke0pTT04uc3RyaW5naWZ5KHRhcmdldCl9KSBtdXN0IGJlIG9iamVjdHNgKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzb3VyY2UpKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgICAgaWYgKHR5cGVvZih2YWx1ZSkgPT09ICdvYmplY3QnICYmIHZhbHVlICE9IG51bGwgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIC8vIGlmIHRoZSB2YWx1ZSBhdCB0aGUgdGFyZ2V0IGlzIG5vdCBhbiBvYmplY3QsIG92ZXJyaWRlIGl0IHdpdGggYW5cbiAgICAgICAgLy8gb2JqZWN0IHNvIHdlIGNhbiBjb250aW51ZSB0aGUgcmVjdXJzaW9uXG4gICAgICAgIGlmICh0eXBlb2YodGFyZ2V0W2tleV0pICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHRhcmdldFtrZXldID0ge307XG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBJZiB3ZSBoYXZlIHNvbWV0aGluZyB0aGF0IGxvb2tzIGxpa2U6XG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiAgIHRhcmdldDogeyBUeXBlOiAnTXlSZXNvdXJjZVR5cGUnLCBQcm9wZXJ0aWVzOiB7IHByb3AxOiB7IFJlZjogJ1BhcmFtJyB9IH0gfVxuICAgICAgICAgICAqICAgc291cmNlczogWyB7IFByb3BlcnRpZXM6IHsgcHJvcDE6IFsgJ0ZuOjpKb2luJzogWyctJywgJ2hlbGxvJywgJ3dvcmxkJ10gXSB9IH0gXVxuICAgICAgICAgICAqXG4gICAgICAgICAgICogRXZlbnR1YWxseSB3ZSB3aWxsIGdldCB0byB0aGUgcG9pbnQgd2hlcmUgd2UgaGF2ZVxuICAgICAgICAgICAqXG4gICAgICAgICAgICogICB0YXJnZXQ6IHsgcHJvcDE6IHsgUmVmOiAnUGFyYW0nIH0gfVxuICAgICAgICAgICAqICAgc291cmNlczogWyB7IHByb3AxOiB7ICdGbjo6Sm9pbic6IFsnLScsICdoZWxsbycsICd3b3JsZCddIH0gfSBdXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBXZSBuZWVkIHRvIHJlY3Vyc2UgMSBtb3JlIHRpbWUsIGJ1dCBpZiB3ZSBkbyB3ZSB3aWxsIGVuZCB1cCB3aXRoXG4gICAgICAgICAgICogICB7IHByb3AxOiB7IFJlZjogJ1BhcmFtJywgJ0ZuOjpKb2luJzogWyctJywgJ2hlbGxvJywgJ3dvcmxkJ10gfSB9XG4gICAgICAgICAgICogd2hpY2ggaXMgbm90IHdoYXQgd2Ugd2FudC5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEluc3RlYWQgd2UgY2hlY2sgdG8gc2VlIHdoZXRoZXIgdGhlIGB0YXJnZXRgIHZhbHVlIChpLmUuIHRhcmdldC5wcm9wMSlcbiAgICAgICAgICAgKiBpcyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIGtleSB0aGF0IHdlIGRvbid0IHdhbnQgdG8gcmVjdXJzZSBvbi4gSWYgaXQgZG9lc1xuICAgICAgICAgICAqIHRoZW4gd2UgZXNzZW50aWFsbHkgZHJvcCBpdCBhbmQgZW5kIHVwIHdpdGg6XG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiAgIHsgcHJvcDE6IHsgJ0ZuOjpKb2luJzogWyctJywgJ2hlbGxvJywgJ3dvcmxkJ10gfSB9XG4gICAgICAgICAgICovXG4gICAgICAgIH0gZWxzZSBpZiAoT2JqZWN0LmtleXModGFyZ2V0W2tleV0pLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIGlmIChNRVJHRV9FWENMVURFX0tFWVMuaW5jbHVkZXMoT2JqZWN0LmtleXModGFyZ2V0W2tleV0pWzBdKSkge1xuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlcmUgbWlnaHQgYWxzbyBiZSB0aGUgY2FzZSB3aGVyZSB0aGUgc291cmNlIGlzIGFuIGludHJpbnNpY1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICB0YXJnZXQ6IHtcbiAgICAgICAgICogICAgICBUeXBlOiAnTXlSZXNvdXJjZVR5cGUnLFxuICAgICAgICAgKiAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICogICAgICAgIHByb3AxOiB7IHN1YnByb3A6IHsgbmFtZTogeyAnRm46OkdldEF0dCc6ICdhYmMnIH0gfSB9XG4gICAgICAgICAqICAgICAgfVxuICAgICAgICAgKiAgICB9XG4gICAgICAgICAqICAgIHNvdXJjZXM6IFsge1xuICAgICAgICAgKiAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICogICAgICAgIHByb3AxOiB7IHN1YnByb3A6IHsgJ0ZuOjpJZic6IFsnU29tZUNvbmRpdGlvbicsIHsuLi59LCB7Li4ufV0gfX1cbiAgICAgICAgICogICAgICB9XG4gICAgICAgICAqICAgIH0gXVxuICAgICAgICAgKlxuICAgICAgICAgKiBXZSBlbmQgdXAgaW4gYSBwbGFjZSB0aGF0IGlzIHRoZSByZXZlcnNlIG9mIHRoZSBhYm92ZSBjaGVjaywgdGhlIHNvdXJjZVxuICAgICAgICAgKiBiZWNvbWVzIGFuIGludHJpbnNpYyBiZWZvcmUgdGhlIHRhcmdldFxuICAgICAgICAgKlxuICAgICAgICAgKiAgIHRhcmdldDogeyBzdWJwcm9wOiB7IG5hbWU6IHsgJ0ZuOjpHZXRBdHQnOiAnYWJjJyB9IH0gfVxuICAgICAgICAgKiAgIHNvdXJjZXM6IFt7XG4gICAgICAgICAqICAgICAnRm46OklmJzogWyAnTXlDb25kaXRpb24nLCB7Li4ufSwgey4uLn0gXVxuICAgICAgICAgKiAgIH1dXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIGlmIChNRVJHRV9FWENMVURFX0tFWVMuaW5jbHVkZXMoT2JqZWN0LmtleXModmFsdWUpWzBdKSkge1xuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkZWVwTWVyZ2UodGFyZ2V0W2tleV0sIHZhbHVlKTtcblxuICAgICAgICAvLyBpZiB0aGUgcmVzdWx0IG9mIHRoZSBtZXJnZSBpcyBhbiBlbXB0eSBvYmplY3QsIGl0J3MgYmVjYXVzZSB0aGVcbiAgICAgICAgLy8gZXZlbnR1YWwgdmFsdWUgd2UgYXNzaWduZWQgaXMgYHVuZGVmaW5lZGAsIGFuZCB0aGVyZSBhcmUgbm9cbiAgICAgICAgLy8gc2libGluZyBjb25jcmV0ZSB2YWx1ZXMgYWxvbmdzaWRlLCBzbyB3ZSBjYW4gZGVsZXRlIHRoaXMgdHJlZS5cbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gdGFyZ2V0W2tleV07XG4gICAgICAgIGlmICh0eXBlb2Yob3V0cHV0KSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMob3V0cHV0KS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBkZWxldGUgdGFyZ2V0W2tleV07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBkZWxldGUgdGFyZ2V0W2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qKlxuICogU3BsaXQgb24gcGVyaW9kcyB3aGlsZSBwcm9jZXNzaW5nIGVzY2FwZSBjaGFyYWN0ZXJzIFxcXG4gKi9cbmZ1bmN0aW9uIHNwbGl0T25QZXJpb2RzKHg6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgLy8gQnVpbGQgdGhpcyBsaXN0IGluIHJldmVyc2UgYmVjYXVzZSBpdCdzIG1vcmUgY29udmVuaWVudCB0byBnZXQgdGhlIFwiY3VycmVudFwiXG4gIC8vIGl0ZW0gYnkgZG9pbmcgcmV0WzBdIHRoYW4gYnkgcmV0W3JldC5sZW5ndGggLSAxXS5cbiAgY29uc3QgcmV0ID0gWycnXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHhbaV0gPT09ICdcXFxcJyAmJiBpICsgMSA8IHgubGVuZ3RoKSB7XG4gICAgICByZXRbMF0gKz0geFtpICsgMV07XG4gICAgICBpKys7XG4gICAgfSBlbHNlIGlmICh4W2ldID09PSAnLicpIHtcbiAgICAgIHJldC51bnNoaWZ0KCcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0WzBdICs9IHhbaV07XG4gICAgfVxuICB9XG5cbiAgcmV0LnJldmVyc2UoKTtcbiAgcmV0dXJuIHJldDtcbn1cbiJdfQ==