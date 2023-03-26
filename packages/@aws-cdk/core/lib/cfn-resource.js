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
     * Check whether the given construct is a CfnResource
     */
    static isCfnResource(construct) {
        return construct.cfnResourceType !== undefined;
    }
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
        (0, deps_1.addDependency)(this, target, `{${this.node.path}}.addDependency({${target.node.path}})`);
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
        (0, deps_1.removeDependency)(this, target);
    }
    /**
     * Retrieves an array of resources this resource depends on.
     *
     * This assembles dependencies on resources across stacks (including nested stacks)
     * automatically.
     */
    obtainDependencies() {
        return (0, deps_1.obtainDependencies)(this);
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
                        Properties: (0, util_1.ignoreEmpty)(this.cfnProperties),
                        DependsOn: (0, util_1.ignoreEmpty)(renderDependsOn(this.dependsOn)),
                        CreationPolicy: (0, util_1.capitalizePropertyNames)(this, renderCreationPolicy(this.cfnOptions.creationPolicy)),
                        UpdatePolicy: (0, util_1.capitalizePropertyNames)(this, this.cfnOptions.updatePolicy),
                        UpdateReplacePolicy: (0, util_1.capitalizePropertyNames)(this, this.cfnOptions.updateReplacePolicy),
                        DeletionPolicy: (0, util_1.capitalizePropertyNames)(this, this.cfnOptions.deletionPolicy),
                        Version: this.cfnOptions.version,
                        Description: this.cfnOptions.description,
                        Metadata: (0, util_1.ignoreEmpty)(this.cfnOptions.metadata),
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
_a = JSII_RTTI_SYMBOL_1;
CfnResource[_a] = { fqn: "@aws-cdk/core.CfnResource", version: "0.0.0" };
exports.CfnResource = CfnResource;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXJlc291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLXJlc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHlDQUF5QztBQUN6QywrQ0FBNEM7QUFFNUMsNkZBQTZGO0FBQzdGLGlDQUFpQztBQUNqQywrQ0FBOEM7QUFDOUMsK0RBQThGO0FBQzlGLDJDQUF5RDtBQUN6RCxpQ0FBNkU7QUFDN0UsMkRBQXVEO0FBQ3ZELHVFQUE4RTtBQUU5RSxxREFBdUU7QUFDdkUsK0NBQTJDO0FBQzNDLG1DQUF1QztBQUN2QyxpQ0FBZ0Y7QUFDaEYsbURBQStDO0FBaUIvQzs7R0FFRztBQUNILE1BQWEsV0FBWSxTQUFRLDJCQUFhO0lBQzVDOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFxQjtRQUMvQyxPQUFRLFNBQWlCLENBQUMsZUFBZSxLQUFLLFNBQVMsQ0FBQztLQUN6RDtJQXdDRDs7O09BR0c7SUFDSCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXVCO1FBQy9ELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUEzQ25CLDZFQUE2RTtRQUM3RSwwRUFBMEU7UUFDMUUsNkVBQTZFO1FBQzdFLDhFQUE4RTtRQUM5RSw4RUFBOEU7UUFDOUUsMEVBQTBFO1FBQzFFLCtDQUErQztRQUUvQzs7V0FFRztRQUNhLGVBQVUsR0FBd0IsRUFBRSxDQUFDO1FBZXJEOztXQUVHO1FBQ2MsaUJBQVksR0FBUSxFQUFFLENBQUM7UUFFeEM7Ozs7V0FJRztRQUNjLGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFDOzs7Ozs7K0NBNUN6QyxXQUFXOzs7O1FBcURwQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztTQUNwRDtRQUVELElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUNsQyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO1FBRTdDLHdFQUF3RTtRQUN4RSx1RUFBdUU7UUFDdkUscUNBQXFDO1FBQ3JDLElBQUksaUJBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxFQUFFO1lBQ25FLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLGlCQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQy9EO0tBQ0Y7SUFFRDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSSxrQkFBa0IsQ0FBQyxNQUFpQyxFQUFFLFVBQWdDLEVBQUU7Ozs7Ozs7Ozs7O1FBQzdGLE1BQU0sR0FBRyxNQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSw4QkFBYSxDQUFDLE1BQU0sQ0FBQztRQUUzRCxJQUFJLGNBQWMsQ0FBQztRQUVuQixRQUFRLE1BQU0sRUFBRTtZQUNkLEtBQUssOEJBQWEsQ0FBQyxPQUFPO2dCQUN4QixjQUFjLEdBQUcsdUNBQWlCLENBQUMsTUFBTSxDQUFDO2dCQUMxQyxNQUFNO1lBRVIsS0FBSyw4QkFBYSxDQUFDLE1BQU07Z0JBQ3ZCLGNBQWMsR0FBRyx1Q0FBaUIsQ0FBQyxNQUFNLENBQUM7Z0JBQzFDLE1BQU07WUFFUixLQUFLLDhCQUFhLENBQUMsUUFBUTtnQkFDekIsbUdBQW1HO2dCQUNuRyxNQUFNLDBCQUEwQixHQUFHO29CQUNqQyxrQkFBa0I7b0JBQ2xCLGdDQUFnQztvQkFDaEMsb0NBQW9DO29CQUNwQyx5QkFBeUI7b0JBQ3pCLHFCQUFxQjtvQkFDckIsc0JBQXNCO29CQUN0Qix3QkFBd0I7aUJBQ3pCLENBQUM7Z0JBRUYsNENBQTRDO2dCQUM1QyxNQUFNLHlCQUF5QixHQUFHLENBQUMsMEJBQTBCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDN0YsSUFBSSx5QkFBeUIsRUFBRTtvQkFDN0IsSUFBSSw0QkFBWSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLEVBQUc7d0JBQzVFLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSwyQ0FBMkMsQ0FBQyxDQUFDO3FCQUNyRjt5QkFBTTt3QkFDTCx5QkFBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSx5RUFBeUUsQ0FBQyxDQUFDO3FCQUNuSTtpQkFDRjtnQkFFRCxjQUFjLEdBQUcsdUNBQWlCLENBQUMsUUFBUSxDQUFDO2dCQUM1QyxNQUFNO1lBRVI7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUN4RDtRQUVELElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztRQUNoRCxJQUFJLE9BQU8sQ0FBQywwQkFBMEIsS0FBSyxLQUFLLEVBQUU7WUFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsR0FBRyxjQUFjLENBQUM7U0FDdEQ7S0FDRjtJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLGFBQXFCLEVBQUUsUUFBNkI7Ozs7Ozs7Ozs7UUFDaEUsT0FBTyw0QkFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNuRTtJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQStDRztJQUNJLFdBQVcsQ0FBQyxJQUFZLEVBQUUsS0FBVTtRQUN6QyxNQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxJQUFJLEdBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUVsQyxPQUFPLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUcsQ0FBQztZQUUzQiw4REFBOEQ7WUFDOUQsc0NBQXNDO1lBQ3RDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksT0FBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbEcsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDYixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQ2hCO1lBRUQsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQjtRQUVELE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUcsQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ3ZCO0lBRUQ7OztPQUdHO0lBQ0ksbUJBQW1CLENBQUMsSUFBWTtRQUNyQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztLQUNuQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxtQkFBbUIsQ0FBQyxZQUFvQixFQUFFLEtBQVU7UUFDekQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLFlBQVksRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3ZEO0lBRUQ7OztPQUdHO0lBQ0ksMkJBQTJCLENBQUMsWUFBb0I7UUFDckQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztLQUNuRDtJQUVEOzs7OztPQUtHO0lBQ0ksWUFBWSxDQUFDLE1BQW1COzs7Ozs7Ozs7OztRQUNyQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDbkM7SUFFRDs7Ozs7O09BTUc7SUFDSSxhQUFhLENBQUMsTUFBbUI7Ozs7Ozs7Ozs7UUFDdEMsK0RBQStEO1FBQy9ELElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTtZQUM5QixPQUFPO1NBQ1I7UUFFRCxJQUFBLG9CQUFhLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxvQkFBb0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO0tBQ3pGO0lBRUQ7Ozs7O09BS0c7SUFDSSxnQkFBZ0IsQ0FBQyxNQUFtQjs7Ozs7Ozs7OztRQUN6QywrREFBK0Q7UUFDL0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFO1lBQzlCLE9BQU87U0FDUjtRQUVELElBQUEsdUJBQWdCLEVBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ2hDO0lBRUQ7Ozs7O09BS0c7SUFDSSxrQkFBa0I7UUFDdkIsT0FBTyxJQUFBLHlCQUFrQixFQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2pDO0lBRUQ7Ozs7T0FJRztJQUNJLGlCQUFpQixDQUFDLE1BQW1CLEVBQUUsU0FBc0I7Ozs7Ozs7Ozs7O1FBQ2xFLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzlDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQy9CO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLElBQUksaUJBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSx5QkFBeUIsaUJBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUN6RjtLQUNGO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLFdBQVcsQ0FBQyxHQUFXLEVBQUUsS0FBVTtRQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1NBQy9CO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ3ZDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLFdBQVcsQ0FBQyxHQUFXO1FBQzVCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN4QztJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNiLE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDO0tBQ3hEO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksc0JBQXNCLENBQUMsTUFBbUI7UUFDL0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDNUI7SUFFRDs7O09BR0c7SUFDSSwwQkFBMEI7UUFDL0IsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztLQUM1QztJQUVEOzs7OztPQUtHO0lBQ0kseUJBQXlCLENBQUMsTUFBbUI7UUFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDL0I7SUFFRDs7O09BR0c7SUFDSSxpQkFBaUI7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFO1lBQzVCLE9BQU8sRUFBRyxDQUFDO1NBQ1o7UUFFRCxJQUFJO1lBQ0YsTUFBTSxHQUFHLEdBQUc7Z0JBQ1YsU0FBUyxFQUFFO29CQUNULCtFQUErRTtvQkFDL0UsNkNBQTZDO29CQUM3QyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLHVCQUFnQixDQUFDO3dCQUNyQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWU7d0JBQzFCLFVBQVUsRUFBRSxJQUFBLGtCQUFXLEVBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQzt3QkFDM0MsU0FBUyxFQUFFLElBQUEsa0JBQVcsRUFBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUN2RCxjQUFjLEVBQUUsSUFBQSw4QkFBdUIsRUFBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQzt3QkFDbkcsWUFBWSxFQUFFLElBQUEsOEJBQXVCLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO3dCQUN6RSxtQkFBbUIsRUFBRSxJQUFBLDhCQUF1QixFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDO3dCQUN2RixjQUFjLEVBQUUsSUFBQSw4QkFBdUIsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7d0JBQzdFLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU87d0JBQ2hDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVc7d0JBQ3hDLFFBQVEsRUFBRSxJQUFBLGtCQUFXLEVBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7d0JBQy9DLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTO3FCQUM1RSxFQUFFLFdBQVcsQ0FBQyxFQUFFO3dCQUNmLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDO3dCQUMxRSxJQUFJLGFBQWEsRUFBRTs0QkFDakIsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUM7NEJBQzNFLFdBQVcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7eUJBQy9FO3dCQUNELE1BQU0sb0JBQW9CLEdBQUcsb0JBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTs0QkFDbkUsS0FBSyxFQUFFLElBQUk7NEJBQ1gsUUFBUSxFQUFFLG1EQUE2Qjs0QkFDdkMsK0NBQStDOzRCQUMvQyxzREFBc0Q7NEJBQ3RELFdBQVcsRUFBRSxLQUFLO3lCQUNuQixDQUFDLENBQUM7d0JBQ0gsT0FBTyxTQUFTLENBQUMsV0FBVyxFQUFFLG9CQUFvQixDQUFDLENBQUM7b0JBQ3RELENBQUMsQ0FBQztpQkFDSDthQUNGLENBQUM7WUFDRixPQUFPLEdBQUcsQ0FBQztTQUNaO1FBQUMsT0FBTyxDQUFNLEVBQUU7WUFDZixpQkFBaUI7WUFDakIsQ0FBQyxDQUFDLE9BQU8sR0FBRyxzQkFBc0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pFLCtEQUErRDtZQUMvRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1lBQ2pDLElBQUksS0FBSyxFQUFFO2dCQUNULE1BQU0sYUFBYSxHQUFHLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2hGLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNsRixDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE9BQU8sT0FBTyxhQUFhLG9DQUFvQyxZQUFZLEVBQUUsQ0FBQzthQUM5RjtZQUVELFdBQVc7WUFDWCxNQUFNLENBQUMsQ0FBQztTQUNUO1FBRUQsa0VBQWtFO1FBQ2xFLHVEQUF1RDtRQUN2RCxTQUFTLGVBQWUsQ0FBQyxTQUEyQjtZQUNsRCxPQUFPLEtBQUs7aUJBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQztpQkFDZixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDdEQsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFFRCxTQUFTLG9CQUFvQixDQUFDLE1BQXFDO1lBQ2pFLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQUUsT0FBTyxTQUFTLENBQUM7YUFBRTtZQUNsQyxNQUFNLE1BQU0sR0FBUSxFQUFFLEdBQUcsTUFBTSxFQUFFLENBQUM7WUFDbEMsSUFBSSxNQUFNLENBQUMsY0FBYyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFO2dCQUMxRCxNQUFNLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7YUFDL0M7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO0tBQ0Y7SUFFRCxJQUFjLGFBQWE7UUFDekIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUM7UUFDeEMsSUFBSSx3QkFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMvQixNQUFNLFFBQVEsR0FBMkIsRUFBRSxDQUFDO1lBQzVDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDN0QsT0FBTyxTQUFTLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVTLGdCQUFnQixDQUFDLEtBQTJCO1FBQ3BELE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRDs7Ozs7Ozs7T0FRRztJQUNILElBQWMsaUJBQWlCOzs7Ozs7Ozs7O1FBQzdCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0tBQy9CO0lBRUQ7Ozs7O09BS0c7SUFDSCxJQUFjLGlCQUFpQjtRQUM3QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7S0FDNUI7SUFFUyxrQkFBa0IsQ0FBQyxXQUFnQjtLQUU1QztJQUVEOzs7Ozs7T0FNRztJQUNPLGdCQUFnQjtRQUN4QixPQUFPLElBQUksQ0FBQztLQUNiOzs7O0FBcGZVLGtDQUFXO0FBdWZ4QixJQUFZLE9BTVg7QUFORCxXQUFZLE9BQU87SUFDakIsbUNBQXdCLENBQUE7SUFDeEIsb0RBQXlDLENBQUE7SUFDekMsb0NBQXlCLENBQUE7SUFDekIsaUNBQXNCLENBQUE7SUFDdEIsdUNBQTRCLENBQUE7QUFDOUIsQ0FBQyxFQU5XLE9BQU8sR0FBUCxlQUFPLEtBQVAsZUFBTyxRQU1sQjtBQThERDs7Ozs7R0FLRztBQUVILE1BQU0sa0JBQWtCLEdBQWE7SUFDbkMsS0FBSztJQUNMLFlBQVk7SUFDWixVQUFVO0lBQ1YsZUFBZTtJQUNmLFlBQVk7SUFDWixZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLFVBQVU7SUFDVixZQUFZO0lBQ1osV0FBVztJQUNYLFNBQVM7SUFDVCxlQUFlO0lBQ2YsU0FBUztJQUNULFlBQVk7SUFDWixRQUFRO0lBQ1IsU0FBUztJQUNULFFBQVE7Q0FDVCxDQUFDO0FBRUY7OztHQUdHO0FBQ0gsU0FBUyxTQUFTLENBQUMsTUFBVyxFQUFFLEdBQUcsT0FBYztJQUMvQyxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUM1QixJQUFJLE9BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUM5RCxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUNsSTtRQUVELEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNyQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUIsSUFBSSxPQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUSxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN4RSxtRUFBbUU7Z0JBQ25FLDBDQUEwQztnQkFDMUMsSUFBSSxPQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO29CQUNwQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUVqQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBb0JHO2lCQUNKO3FCQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO29CQUNoRCxJQUFJLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQzVELE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7cUJBQ2xCO2lCQUNGO2dCQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O21CQXNCRztnQkFDSCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtvQkFDbkMsSUFBSSxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUN0RCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO3FCQUNsQjtpQkFDRjtnQkFFRCxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUU5QixrRUFBa0U7Z0JBQ2xFLDhEQUE4RDtnQkFDOUQsaUVBQWlFO2dCQUNqRSxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzNCLElBQUksT0FBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7b0JBQ25FLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNwQjthQUNGO2lCQUFNLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtnQkFDOUIsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDcEI7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQzthQUNyQjtTQUNGO0tBQ0Y7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGNBQWMsQ0FBQyxDQUFTO0lBQy9CLCtFQUErRTtJQUMvRSxvREFBb0Q7SUFDcEQsTUFBTSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ3JDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25CLENBQUMsRUFBRSxDQUFDO1NBQ0w7YUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDdkIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNqQjthQUFNO1lBQ0wsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQjtLQUNGO0lBRUQsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IEFubm90YXRpb25zIH0gZnJvbSAnLi9hbm5vdGF0aW9ucyc7XG5pbXBvcnQgeyBDZm5Db25kaXRpb24gfSBmcm9tICcuL2Nmbi1jb25kaXRpb24nO1xuLy8gaW1wb3J0IHJlcXVpcmVkIHRvIGJlIGhlcmUsIG90aGVyd2lzZSBjYXVzZXMgYSBjeWNsZSB3aGVuIHJ1bm5pbmcgdGhlIGdlbmVyYXRlZCBKYXZhU2NyaXB0XG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvb3JkZXIgKi9cbmltcG9ydCB7IENmblJlZkVsZW1lbnQgfSBmcm9tICcuL2Nmbi1lbGVtZW50JztcbmltcG9ydCB7IENmbkNyZWF0aW9uUG9saWN5LCBDZm5EZWxldGlvblBvbGljeSwgQ2ZuVXBkYXRlUG9saWN5IH0gZnJvbSAnLi9jZm4tcmVzb3VyY2UtcG9saWN5JztcbmltcG9ydCB7IENvbnN0cnVjdCwgSUNvbnN0cnVjdCwgTm9kZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgYWRkRGVwZW5kZW5jeSwgb2J0YWluRGVwZW5kZW5jaWVzLCByZW1vdmVEZXBlbmRlbmN5IH0gZnJvbSAnLi9kZXBzJztcbmltcG9ydCB7IENmblJlZmVyZW5jZSB9IGZyb20gJy4vcHJpdmF0ZS9jZm4tcmVmZXJlbmNlJztcbmltcG9ydCB7IENMT1VERk9STUFUSU9OX1RPS0VOX1JFU09MVkVSIH0gZnJvbSAnLi9wcml2YXRlL2Nsb3VkZm9ybWF0aW9uLWxhbmcnO1xuaW1wb3J0IHsgUmVmZXJlbmNlIH0gZnJvbSAnLi9yZWZlcmVuY2UnO1xuaW1wb3J0IHsgUmVtb3ZhbFBvbGljeSwgUmVtb3ZhbFBvbGljeU9wdGlvbnMgfSBmcm9tICcuL3JlbW92YWwtcG9saWN5JztcbmltcG9ydCB7IFRhZ01hbmFnZXIgfSBmcm9tICcuL3RhZy1tYW5hZ2VyJztcbmltcG9ydCB7IFRva2VuaXphdGlvbiB9IGZyb20gJy4vdG9rZW4nO1xuaW1wb3J0IHsgY2FwaXRhbGl6ZVByb3BlcnR5TmFtZXMsIGlnbm9yZUVtcHR5LCBQb3N0UmVzb2x2ZVRva2VuIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IEZlYXR1cmVGbGFncyB9IGZyb20gJy4vZmVhdHVyZS1mbGFncyc7XG5pbXBvcnQgeyBSZXNvbHV0aW9uVHlwZUhpbnQgfSBmcm9tICcuL3R5cGUtaGludHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENmblJlc291cmNlUHJvcHMge1xuICAvKipcbiAgICogQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSAoZS5nLiBgQVdTOjpTMzo6QnVja2V0YCkuXG4gICAqL1xuICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJlc291cmNlIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gcmVzb3VyY2UgcHJvcGVydGllcy5cbiAgICovXG4gIHJlYWRvbmx5IHByb3BlcnRpZXM/OiB7IFtuYW1lOiBzdHJpbmddOiBhbnkgfTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5SZXNvdXJjZSBleHRlbmRzIENmblJlZkVsZW1lbnQge1xuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgZ2l2ZW4gY29uc3RydWN0IGlzIGEgQ2ZuUmVzb3VyY2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNDZm5SZXNvdXJjZShjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QpOiBjb25zdHJ1Y3QgaXMgQ2ZuUmVzb3VyY2Uge1xuICAgIHJldHVybiAoY29uc3RydWN0IGFzIGFueSkuY2ZuUmVzb3VyY2VUeXBlICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICAvLyBNQUlOVEFJTkVSUyBOT1RFOiB0aGlzIGNsYXNzIHNlcnZlcyBhcyB0aGUgYmFzZSBjbGFzcyBmb3IgdGhlIGdlbmVyYXRlZCBMMVxuICAvLyAoXCJDRk5cIikgcmVzb3VyY2VzIChzdWNoIGFzIGBzMy5DZm5CdWNrZXRgKS4gVGhlc2UgcmVzb3VyY2VzIHdpbGwgaGF2ZSBhXG4gIC8vIHByb3BlcnR5IGZvciBlYWNoIENsb3VkRm9ybWF0aW9uIHByb3BlcnR5IG9mIHRoZSByZXNvdXJjZS4gVGhpcyBtZWFucyB0aGF0XG4gIC8vIGlmIGF0IHNvbWUgcG9pbnQgaW4gdGhlIGZ1dHVyZSBhIHByb3BlcnR5IGlzIGludHJvZHVjZWQgd2l0aCBhIG5hbWUgc2ltaWxhclxuICAvLyB0byBvbmUgb2YgdGhlIHByb3BlcnRpZXMgaGVyZSwgaXQgd2lsbCBiZSBcIm1hc2tlZFwiIGJ5IHRoZSBkZXJpdmVkIGNsYXNzLiBUb1xuICAvLyB0aGF0IGVuZCwgd2UgcHJlZml4IGFsbCBwcm9wZXJ0aWVzIGluIHRoaXMgY2xhc3Mgd2l0aCBgY2ZuWHh4YCB3aXRoIHRoZVxuICAvLyBob3BlIHRvIGF2b2lkIHRob3NlIGNvbmZsaWN0cyBpbiB0aGUgZnV0dXJlLlxuXG4gIC8qKlxuICAgKiBPcHRpb25zIGZvciB0aGlzIHJlc291cmNlLCBzdWNoIGFzIGNvbmRpdGlvbiwgdXBkYXRlIHBvbGljeSBldGMuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY2ZuT3B0aW9uczogSUNmblJlc291cmNlT3B0aW9ucyA9IHt9O1xuXG4gIC8qKlxuICAgKiBBV1MgcmVzb3VyY2UgdHlwZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjZm5SZXNvdXJjZVR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogQVdTIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIFRoaXMgb2JqZWN0IGlzIHJldHVybmVkIHZpYSBjZm5Qcm9wZXJ0aWVzXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IF9jZm5Qcm9wZXJ0aWVzOiBhbnk7XG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCB0byBiZSBtZXJnZWQgb24gdG9wIG9mIHRoZSBlbnRpcmUgcmVzb3VyY2UgZGVmaW5pdGlvbi5cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgcmF3T3ZlcnJpZGVzOiBhbnkgPSB7fTtcblxuICAvKipcbiAgICogTG9naWNhbCBJRHMgb2YgZGVwZW5kZW5jaWVzLlxuICAgKlxuICAgKiBJcyBmaWxsZWQgZHVyaW5nIHByZXBhcmUoKS5cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgZGVwZW5kc09uID0gbmV3IFNldDxDZm5SZXNvdXJjZT4oKTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHJlc291cmNlIGNvbnN0cnVjdC5cbiAgICogQHBhcmFtIGNmblJlc291cmNlVHlwZSBUaGUgQ2xvdWRGb3JtYXRpb24gdHlwZSBvZiB0aGlzIHJlc291cmNlIChlLmcuIEFXUzo6RHluYW1vREI6OlRhYmxlKVxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmblJlc291cmNlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgaWYgKCFwcm9wcy50eXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBgdHlwZWAgcHJvcGVydHkgaXMgcmVxdWlyZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLmNmblJlc291cmNlVHlwZSA9IHByb3BzLnR5cGU7XG4gICAgdGhpcy5fY2ZuUHJvcGVydGllcyA9IHByb3BzLnByb3BlcnRpZXMgfHwge307XG5cbiAgICAvLyBpZiBhd3M6Y2RrOmVuYWJsZS1wYXRoLW1ldGFkYXRhIGlzIHNldCwgZW1iZWQgdGhlIGN1cnJlbnQgY29uc3RydWN0J3NcbiAgICAvLyBwYXRoIGluIHRoZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSwgc28gaXQgd2lsbCBiZSBwb3NzaWJsZSB0byB0cmFjZVxuICAgIC8vIGJhY2sgdG8gdGhlIGFjdHVhbCBjb25zdHJ1Y3QgcGF0aC5cbiAgICBpZiAoTm9kZS5vZih0aGlzKS50cnlHZXRDb250ZXh0KGN4YXBpLlBBVEhfTUVUQURBVEFfRU5BQkxFX0NPTlRFWFQpKSB7XG4gICAgICB0aGlzLmFkZE1ldGFkYXRhKGN4YXBpLlBBVEhfTUVUQURBVEFfS0VZLCBOb2RlLm9mKHRoaXMpLnBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkZWxldGlvbiBwb2xpY3kgb2YgdGhlIHJlc291cmNlIGJhc2VkIG9uIHRoZSByZW1vdmFsIHBvbGljeSBzcGVjaWZpZWQuXG4gICAqXG4gICAqIFRoZSBSZW1vdmFsIFBvbGljeSBjb250cm9scyB3aGF0IGhhcHBlbnMgdG8gdGhpcyByZXNvdXJjZSB3aGVuIGl0IHN0b3BzXG4gICAqIGJlaW5nIG1hbmFnZWQgYnkgQ2xvdWRGb3JtYXRpb24sIGVpdGhlciBiZWNhdXNlIHlvdSd2ZSByZW1vdmVkIGl0IGZyb20gdGhlXG4gICAqIENESyBhcHBsaWNhdGlvbiBvciBiZWNhdXNlIHlvdSd2ZSBtYWRlIGEgY2hhbmdlIHRoYXQgcmVxdWlyZXMgdGhlIHJlc291cmNlXG4gICAqIHRvIGJlIHJlcGxhY2VkLlxuICAgKlxuICAgKiBUaGUgcmVzb3VyY2UgY2FuIGJlIGRlbGV0ZWQgKGBSZW1vdmFsUG9saWN5LkRFU1RST1lgKSwgb3IgbGVmdCBpbiB5b3VyIEFXU1xuICAgKiBhY2NvdW50IGZvciBkYXRhIHJlY292ZXJ5IGFuZCBjbGVhbnVwIGxhdGVyIChgUmVtb3ZhbFBvbGljeS5SRVRBSU5gKS4gSW4gc29tZVxuICAgKiBjYXNlcywgYSBzbmFwc2hvdCBjYW4gYmUgdGFrZW4gb2YgdGhlIHJlc291cmNlIHByaW9yIHRvIGRlbGV0aW9uXG4gICAqIChgUmVtb3ZhbFBvbGljeS5TTkFQU0hPVGApLiBBIGxpc3Qgb2YgcmVzb3VyY2VzIHRoYXQgc3VwcG9ydCB0aGlzIHBvbGljeVxuICAgKiBjYW4gYmUgZm91bmQgaW4gdGhlIGZvbGxvd2luZyBsaW5rOlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1hdHRyaWJ1dGUtZGVsZXRpb25wb2xpY3kuaHRtbCNhd3MtYXR0cmlidXRlLWRlbGV0aW9ucG9saWN5LW9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBhcHBseVJlbW92YWxQb2xpY3kocG9saWN5OiBSZW1vdmFsUG9saWN5IHwgdW5kZWZpbmVkLCBvcHRpb25zOiBSZW1vdmFsUG9saWN5T3B0aW9ucyA9IHt9KSB7XG4gICAgcG9saWN5ID0gcG9saWN5IHx8IG9wdGlvbnMuZGVmYXVsdCB8fCBSZW1vdmFsUG9saWN5LlJFVEFJTjtcblxuICAgIGxldCBkZWxldGlvblBvbGljeTtcblxuICAgIHN3aXRjaCAocG9saWN5KSB7XG4gICAgICBjYXNlIFJlbW92YWxQb2xpY3kuREVTVFJPWTpcbiAgICAgICAgZGVsZXRpb25Qb2xpY3kgPSBDZm5EZWxldGlvblBvbGljeS5ERUxFVEU7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFJlbW92YWxQb2xpY3kuUkVUQUlOOlxuICAgICAgICBkZWxldGlvblBvbGljeSA9IENmbkRlbGV0aW9uUG9saWN5LlJFVEFJTjtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVtb3ZhbFBvbGljeS5TTkFQU0hPVDpcbiAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLWF0dHJpYnV0ZS1kZWxldGlvbnBvbGljeS5odG1sXG4gICAgICAgIGNvbnN0IHNuYXBzaG90dGFibGVSZXNvdXJjZVR5cGVzID0gW1xuICAgICAgICAgICdBV1M6OkVDMjo6Vm9sdW1lJyxcbiAgICAgICAgICAnQVdTOjpFbGFzdGlDYWNoZTo6Q2FjaGVDbHVzdGVyJyxcbiAgICAgICAgICAnQVdTOjpFbGFzdGlDYWNoZTo6UmVwbGljYXRpb25Hcm91cCcsXG4gICAgICAgICAgJ0FXUzo6TmVwdHVuZTo6REJDbHVzdGVyJyxcbiAgICAgICAgICAnQVdTOjpSRFM6OkRCQ2x1c3RlcicsXG4gICAgICAgICAgJ0FXUzo6UkRTOjpEQkluc3RhbmNlJyxcbiAgICAgICAgICAnQVdTOjpSZWRzaGlmdDo6Q2x1c3RlcicsXG4gICAgICAgIF07XG5cbiAgICAgICAgLy8gZXJyb3IgaWYgZmxhZyBpcyBzZXQsIHdhcm4gaWYgZmxhZyBpcyBub3RcbiAgICAgICAgY29uc3QgcHJvYmxlbWF0aWNTbmFwc2hvdFBvbGljeSA9ICFzbmFwc2hvdHRhYmxlUmVzb3VyY2VUeXBlcy5pbmNsdWRlcyh0aGlzLmNmblJlc291cmNlVHlwZSk7XG4gICAgICAgIGlmIChwcm9ibGVtYXRpY1NuYXBzaG90UG9saWN5KSB7XG4gICAgICAgICAgaWYgKEZlYXR1cmVGbGFncy5vZih0aGlzKS5pc0VuYWJsZWQoY3hhcGkuVkFMSURBVEVfU05BUFNIT1RfUkVNT1ZBTF9QT0xJQ1kpICkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuY2ZuUmVzb3VyY2VUeXBlfSBkb2VzIG5vdCBzdXBwb3J0IHNuYXBzaG90IHJlbW92YWwgcG9saWN5YCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmcoYCR7dGhpcy5jZm5SZXNvdXJjZVR5cGV9IGRvZXMgbm90IHN1cHBvcnQgc25hcHNob3QgcmVtb3ZhbCBwb2xpY3kuIFRoaXMgcG9saWN5IHdpbGwgYmUgaWdub3JlZC5gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGlvblBvbGljeSA9IENmbkRlbGV0aW9uUG9saWN5LlNOQVBTSE9UO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHJlbW92YWwgcG9saWN5OiAke3BvbGljeX1gKTtcbiAgICB9XG5cbiAgICB0aGlzLmNmbk9wdGlvbnMuZGVsZXRpb25Qb2xpY3kgPSBkZWxldGlvblBvbGljeTtcbiAgICBpZiAob3B0aW9ucy5hcHBseVRvVXBkYXRlUmVwbGFjZVBvbGljeSAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuY2ZuT3B0aW9ucy51cGRhdGVSZXBsYWNlUG9saWN5ID0gZGVsZXRpb25Qb2xpY3k7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSB0b2tlbiBmb3IgYW4gcnVudGltZSBhdHRyaWJ1dGUgb2YgdGhpcyByZXNvdXJjZS5cbiAgICogSWRlYWxseSwgdXNlIGdlbmVyYXRlZCBhdHRyaWJ1dGUgYWNjZXNzb3JzIChlLmcuIGByZXNvdXJjZS5hcm5gKSwgYnV0IHRoaXMgY2FuIGJlIHVzZWQgZm9yIGZ1dHVyZSBjb21wYXRpYmlsaXR5XG4gICAqIGluIGNhc2UgdGhlcmUgaXMgbm8gZ2VuZXJhdGVkIGF0dHJpYnV0ZS5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZU5hbWUgVGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZS5cbiAgICovXG4gIHB1YmxpYyBnZXRBdHQoYXR0cmlidXRlTmFtZTogc3RyaW5nLCB0eXBlSGludD86IFJlc29sdXRpb25UeXBlSGludCk6IFJlZmVyZW5jZSB7XG4gICAgcmV0dXJuIENmblJlZmVyZW5jZS5mb3IodGhpcywgYXR0cmlidXRlTmFtZSwgdW5kZWZpbmVkLCB0eXBlSGludCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBvdmVycmlkZSB0byB0aGUgc3ludGhlc2l6ZWQgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UuIFRvIGFkZCBhXG4gICAqIHByb3BlcnR5IG92ZXJyaWRlLCBlaXRoZXIgdXNlIGBhZGRQcm9wZXJ0eU92ZXJyaWRlYCBvciBwcmVmaXggYHBhdGhgIHdpdGhcbiAgICogXCJQcm9wZXJ0aWVzLlwiIChpLmUuIGBQcm9wZXJ0aWVzLlRvcGljTmFtZWApLlxuICAgKlxuICAgKiBJZiB0aGUgb3ZlcnJpZGUgaXMgbmVzdGVkLCBzZXBhcmF0ZSBlYWNoIG5lc3RlZCBsZXZlbCB1c2luZyBhIGRvdCAoLikgaW4gdGhlIHBhdGggcGFyYW1ldGVyLlxuICAgKiBJZiB0aGVyZSBpcyBhbiBhcnJheSBhcyBwYXJ0IG9mIHRoZSBuZXN0aW5nLCBzcGVjaWZ5IHRoZSBpbmRleCBpbiB0aGUgcGF0aC5cbiAgICpcbiAgICogVG8gaW5jbHVkZSBhIGxpdGVyYWwgYC5gIGluIHRoZSBwcm9wZXJ0eSBuYW1lLCBwcmVmaXggd2l0aCBhIGBcXGAuIEluIG1vc3RcbiAgICogcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzIHlvdSB3aWxsIG5lZWQgdG8gd3JpdGUgdGhpcyBhcyBgXCJcXFxcLlwiYCBiZWNhdXNlIHRoZVxuICAgKiBgXFxgIGl0c2VsZiB3aWxsIG5lZWQgdG8gYmUgZXNjYXBlZC5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogY2ZuUmVzb3VyY2UuYWRkT3ZlcnJpZGUoJ1Byb3BlcnRpZXMuR2xvYmFsU2Vjb25kYXJ5SW5kZXhlcy4wLlByb2plY3Rpb24uTm9uS2V5QXR0cmlidXRlcycsIFsnbXlhdHRyaWJ1dGUnXSk7XG4gICAqIGNmblJlc291cmNlLmFkZE92ZXJyaWRlKCdQcm9wZXJ0aWVzLkdsb2JhbFNlY29uZGFyeUluZGV4ZXMuMS5Qcm9qZWN0aW9uVHlwZScsICdJTkNMVURFJyk7XG4gICAqIGBgYFxuICAgKiB3b3VsZCBhZGQgdGhlIG92ZXJyaWRlc1xuICAgKiBgYGBqc29uXG4gICAqIFwiUHJvcGVydGllc1wiOiB7XG4gICAqICAgXCJHbG9iYWxTZWNvbmRhcnlJbmRleGVzXCI6IFtcbiAgICogICAgIHtcbiAgICogICAgICAgXCJQcm9qZWN0aW9uXCI6IHtcbiAgICogICAgICAgICBcIk5vbktleUF0dHJpYnV0ZXNcIjogWyBcIm15YXR0cmlidXRlXCIgXVxuICAgKiAgICAgICAgIC4uLlxuICAgKiAgICAgICB9XG4gICAqICAgICAgIC4uLlxuICAgKiAgICAgfSxcbiAgICogICAgIHtcbiAgICogICAgICAgXCJQcm9qZWN0aW9uVHlwZVwiOiBcIklOQ0xVREVcIlxuICAgKiAgICAgICAuLi5cbiAgICogICAgIH0sXG4gICAqICAgXVxuICAgKiAgIC4uLlxuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGUgYHZhbHVlYCBhcmd1bWVudCB0byBgYWRkT3ZlcnJpZGVgIHdpbGwgbm90IGJlIHByb2Nlc3NlZCBvciB0cmFuc2xhdGVkXG4gICAqIGluIGFueSB3YXkuIFBhc3MgcmF3IEpTT04gdmFsdWVzIGluIGhlcmUgd2l0aCB0aGUgY29ycmVjdCBjYXBpdGFsaXphdGlvblxuICAgKiBmb3IgQ2xvdWRGb3JtYXRpb24uIElmIHlvdSBwYXNzIENESyBjbGFzc2VzIG9yIHN0cnVjdHMsIHRoZXkgd2lsbCBiZVxuICAgKiByZW5kZXJlZCB3aXRoIGxvd2VyY2FzZWQga2V5IG5hbWVzLCBhbmQgQ2xvdWRGb3JtYXRpb24gd2lsbCByZWplY3QgdGhlXG4gICAqIHRlbXBsYXRlLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCAtIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSwgeW91IGNhbiB1c2UgZG90IG5vdGF0aW9uIHRvXG4gICAqICAgICAgICBvdmVycmlkZSB2YWx1ZXMgaW4gY29tcGxleCB0eXBlcy4gQW55IGludGVybWRlZGlhdGUga2V5c1xuICAgKiAgICAgICAgd2lsbCBiZSBjcmVhdGVkIGFzIG5lZWRlZC5cbiAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlLiBDb3VsZCBiZSBwcmltaXRpdmUgb3IgY29tcGxleC5cbiAgICovXG4gIHB1YmxpYyBhZGRPdmVycmlkZShwYXRoOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHNwbGl0T25QZXJpb2RzKHBhdGgpO1xuICAgIGxldCBjdXJyOiBhbnkgPSB0aGlzLnJhd092ZXJyaWRlcztcblxuICAgIHdoaWxlIChwYXJ0cy5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBrZXkgPSBwYXJ0cy5zaGlmdCgpITtcblxuICAgICAgLy8gaWYgd2UgY2FuJ3QgcmVjdXJzZSBmdXJ0aGVyIG9yIHRoZSBwcmV2aW91cyB2YWx1ZSBpcyBub3QgYW5cbiAgICAgIC8vIG9iamVjdCBvdmVyd3JpdGUgaXQgd2l0aCBhbiBvYmplY3QuXG4gICAgICBjb25zdCBpc09iamVjdCA9IGN1cnJba2V5XSAhPSBudWxsICYmIHR5cGVvZihjdXJyW2tleV0pID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShjdXJyW2tleV0pO1xuICAgICAgaWYgKCFpc09iamVjdCkge1xuICAgICAgICBjdXJyW2tleV0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgY3VyciA9IGN1cnJba2V5XTtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0S2V5ID0gcGFydHMuc2hpZnQoKSE7XG4gICAgY3VycltsYXN0S2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFN5bnRhY3RpYyBzdWdhciBmb3IgYGFkZE92ZXJyaWRlKHBhdGgsIHVuZGVmaW5lZClgLlxuICAgKiBAcGFyYW0gcGF0aCBUaGUgcGF0aCBvZiB0aGUgdmFsdWUgdG8gZGVsZXRlXG4gICAqL1xuICBwdWJsaWMgYWRkRGVsZXRpb25PdmVycmlkZShwYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLmFkZE92ZXJyaWRlKHBhdGgsIHVuZGVmaW5lZCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBvdmVycmlkZSB0byBhIHJlc291cmNlIHByb3BlcnR5LlxuICAgKlxuICAgKiBTeW50YWN0aWMgc3VnYXIgZm9yIGBhZGRPdmVycmlkZShcIlByb3BlcnRpZXMuPC4uLj5cIiwgdmFsdWUpYC5cbiAgICpcbiAgICogQHBhcmFtIHByb3BlcnR5UGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHlcbiAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZVxuICAgKi9cbiAgcHVibGljIGFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcGVydHlQYXRoOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLmFkZE92ZXJyaWRlKGBQcm9wZXJ0aWVzLiR7cHJvcGVydHlQYXRofWAsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIG92ZXJyaWRlIHRoYXQgZGVsZXRlcyB0aGUgdmFsdWUgb2YgYSBwcm9wZXJ0eSBmcm9tIHRoZSByZXNvdXJjZSBkZWZpbml0aW9uLlxuICAgKiBAcGFyYW0gcHJvcGVydHlQYXRoIFRoZSBwYXRoIHRvIHRoZSBwcm9wZXJ0eS5cbiAgICovXG4gIHB1YmxpYyBhZGRQcm9wZXJ0eURlbGV0aW9uT3ZlcnJpZGUocHJvcGVydHlQYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcGVydHlQYXRoLCB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB0aGF0IHRoaXMgcmVzb3VyY2UgZGVwZW5kcyBvbiBhbm90aGVyIHJlc291cmNlIGFuZCBjYW5ub3QgYmVcbiAgICogcHJvdmlzaW9uZWQgdW5sZXNzIHRoZSBvdGhlciByZXNvdXJjZSBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgcHJvdmlzaW9uZWQuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBhZGREZXBlbmRlbmN5XG4gICAqL1xuICBwdWJsaWMgYWRkRGVwZW5kc09uKHRhcmdldDogQ2ZuUmVzb3VyY2UpIHtcbiAgICByZXR1cm4gdGhpcy5hZGREZXBlbmRlbmN5KHRhcmdldCk7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIHRoYXQgdGhpcyByZXNvdXJjZSBkZXBlbmRzIG9uIGFub3RoZXIgcmVzb3VyY2UgYW5kIGNhbm5vdCBiZVxuICAgKiBwcm92aXNpb25lZCB1bmxlc3MgdGhlIG90aGVyIHJlc291cmNlIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBwcm92aXNpb25lZC5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZCBmb3IgcmVzb3VyY2VzIGFjcm9zcyBzdGFja3MgKG9yIG5lc3RlZCBzdGFjaykgYm91bmRhcmllc1xuICAgKiBhbmQgdGhlIGRlcGVuZGVuY3kgd2lsbCBhdXRvbWF0aWNhbGx5IGJlIHRyYW5zZmVycmVkIHRvIHRoZSByZWxldmFudCBzY29wZS5cbiAgICovXG4gIHB1YmxpYyBhZGREZXBlbmRlbmN5KHRhcmdldDogQ2ZuUmVzb3VyY2UpIHtcbiAgICAvLyBza2lwIHRoaXMgZGVwZW5kZW5jeSBpZiB0aGUgdGFyZ2V0IGlzIG5vdCBwYXJ0IG9mIHRoZSBvdXRwdXRcbiAgICBpZiAoIXRhcmdldC5zaG91bGRTeW50aGVzaXplKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhZGREZXBlbmRlbmN5KHRoaXMsIHRhcmdldCwgYHske3RoaXMubm9kZS5wYXRofX0uYWRkRGVwZW5kZW5jeSh7JHt0YXJnZXQubm9kZS5wYXRofX0pYCk7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIHRoYXQgdGhpcyByZXNvdXJjZSBubyBsb25nZXIgZGVwZW5kcyBvbiBhbm90aGVyIHJlc291cmNlLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIGZvciByZXNvdXJjZXMgYWNyb3NzIHN0YWNrcyAoaW5jbHVkaW5nIG5lc3RlZCBzdGFja3MpXG4gICAqIGFuZCB0aGUgZGVwZW5kZW5jeSB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgcmVtb3ZlZCBmcm9tIHRoZSByZWxldmFudCBzY29wZS5cbiAgICovXG4gIHB1YmxpYyByZW1vdmVEZXBlbmRlbmN5KHRhcmdldDogQ2ZuUmVzb3VyY2UpIDogdm9pZCB7XG4gICAgLy8gc2tpcCB0aGlzIGRlcGVuZGVuY3kgaWYgdGhlIHRhcmdldCBpcyBub3QgcGFydCBvZiB0aGUgb3V0cHV0XG4gICAgaWYgKCF0YXJnZXQuc2hvdWxkU3ludGhlc2l6ZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmVtb3ZlRGVwZW5kZW5jeSh0aGlzLCB0YXJnZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyBhbiBhcnJheSBvZiByZXNvdXJjZXMgdGhpcyByZXNvdXJjZSBkZXBlbmRzIG9uLlxuICAgKlxuICAgKiBUaGlzIGFzc2VtYmxlcyBkZXBlbmRlbmNpZXMgb24gcmVzb3VyY2VzIGFjcm9zcyBzdGFja3MgKGluY2x1ZGluZyBuZXN0ZWQgc3RhY2tzKVxuICAgKiBhdXRvbWF0aWNhbGx5LlxuICAgKi9cbiAgcHVibGljIG9idGFpbkRlcGVuZGVuY2llcygpIHtcbiAgICByZXR1cm4gb2J0YWluRGVwZW5kZW5jaWVzKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIG9uZSBkZXBlbmRlbmN5IHdpdGggYW5vdGhlci5cbiAgICogQHBhcmFtIHRhcmdldCBUaGUgZGVwZW5kZW5jeSB0byByZXBsYWNlXG4gICAqIEBwYXJhbSBuZXdUYXJnZXQgVGhlIG5ldyBkZXBlbmRlbmN5IHRvIGFkZFxuICAgKi9cbiAgcHVibGljIHJlcGxhY2VEZXBlbmRlbmN5KHRhcmdldDogQ2ZuUmVzb3VyY2UsIG5ld1RhcmdldDogQ2ZuUmVzb3VyY2UpIDogdm9pZCB7XG4gICAgaWYgKHRoaXMub2J0YWluRGVwZW5kZW5jaWVzKCkuaW5jbHVkZXModGFyZ2V0KSkge1xuICAgICAgdGhpcy5yZW1vdmVEZXBlbmRlbmN5KHRhcmdldCk7XG4gICAgICB0aGlzLmFkZERlcGVuZGVuY3kobmV3VGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcIiR7Tm9kZS5vZih0aGlzKS5wYXRofVwiIGRvZXMgbm90IGRlcGVuZCBvbiBcIiR7Tm9kZS5vZih0YXJnZXQpLnBhdGh9XCJgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgdmFsdWUgdG8gdGhlIENsb3VkRm9ybWF0aW9uIFJlc291cmNlIE1ldGFkYXRhXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvbWV0YWRhdGEtc2VjdGlvbi1zdHJ1Y3R1cmUuaHRtbFxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhpcyBpcyBhIGRpZmZlcmVudCBzZXQgb2YgbWV0YWRhdGEgZnJvbSBDREsgbm9kZSBtZXRhZGF0YTsgdGhpc1xuICAgKiBtZXRhZGF0YSBlbmRzIHVwIGluIHRoZSBzdGFjayB0ZW1wbGF0ZSB1bmRlciB0aGUgcmVzb3VyY2UsIHdoZXJlYXMgQ0RLXG4gICAqIG5vZGUgbWV0YWRhdGEgZW5kcyB1cCBpbiB0aGUgQ2xvdWQgQXNzZW1ibHkuXG4gICAqL1xuICBwdWJsaWMgYWRkTWV0YWRhdGEoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICBpZiAoIXRoaXMuY2ZuT3B0aW9ucy5tZXRhZGF0YSkge1xuICAgICAgdGhpcy5jZm5PcHRpb25zLm1ldGFkYXRhID0ge307XG4gICAgfVxuXG4gICAgdGhpcy5jZm5PcHRpb25zLm1ldGFkYXRhW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhIHZhbHVlIHZhbHVlIGZyb20gdGhlIENsb3VkRm9ybWF0aW9uIFJlc291cmNlIE1ldGFkYXRhXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvbWV0YWRhdGEtc2VjdGlvbi1zdHJ1Y3R1cmUuaHRtbFxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhpcyBpcyBhIGRpZmZlcmVudCBzZXQgb2YgbWV0YWRhdGEgZnJvbSBDREsgbm9kZSBtZXRhZGF0YTsgdGhpc1xuICAgKiBtZXRhZGF0YSBlbmRzIHVwIGluIHRoZSBzdGFjayB0ZW1wbGF0ZSB1bmRlciB0aGUgcmVzb3VyY2UsIHdoZXJlYXMgQ0RLXG4gICAqIG5vZGUgbWV0YWRhdGEgZW5kcyB1cCBpbiB0aGUgQ2xvdWQgQXNzZW1ibHkuXG4gICAqL1xuICBwdWJsaWMgZ2V0TWV0YWRhdGEoa2V5OiBzdHJpbmcpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmNmbk9wdGlvbnMubWV0YWRhdGE/LltrZXldO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgcmVzb3VyY2VcbiAgICovXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYCR7c3VwZXIudG9TdHJpbmcoKX0gWyR7dGhpcy5jZm5SZXNvdXJjZVR5cGV9XWA7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIGJ5IHRoZSBgYWRkRGVwZW5kZW5jeWAgaGVscGVyIGZ1bmN0aW9uIGluIG9yZGVyIHRvIHJlYWxpemUgYSBkaXJlY3RcbiAgICogZGVwZW5kZW5jeSBiZXR3ZWVuIHR3byByZXNvdXJjZXMgdGhhdCBhcmUgZGlyZWN0bHkgZGVmaW5lZCBpbiB0aGUgc2FtZVxuICAgKiBzdGFja3MuXG4gICAqXG4gICAqIFVzZSBgcmVzb3VyY2UuYWRkRGVwZW5kZW5jeWAgdG8gZGVmaW5lIHRoZSBkZXBlbmRlbmN5IGJldHdlZW4gdHdvIHJlc291cmNlcyxcbiAgICogd2hpY2ggYWxzbyB0YWtlcyBzdGFjayBib3VuZGFyaWVzIGludG8gYWNjb3VudC5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX2FkZFJlc291cmNlRGVwZW5kZW5jeSh0YXJnZXQ6IENmblJlc291cmNlKSB7XG4gICAgdGhpcy5kZXBlbmRzT24uYWRkKHRhcmdldCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgc2hhbGxvdyBjb3B5IG9mIGRlcGVuZGVuY2llcyBiZXR3ZWVuIHRoaXMgcmVzb3VyY2UgYW5kIG90aGVyIHJlc291cmNlc1xuICAgKiBpbiB0aGUgc2FtZSBzdGFjay5cbiAgICovXG4gIHB1YmxpYyBvYnRhaW5SZXNvdXJjZURlcGVuZGVuY2llcygpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmRlcGVuZHNPbi52YWx1ZXMoKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgZGVwZW5kZW5jeSBiZXR3ZWVuIHRoaXMgcmVzb3VyY2UgYW5kIG90aGVyIHJlc291cmNlcyBpbiB0aGUgc2FtZVxuICAgKiBzdGFjay5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3JlbW92ZVJlc291cmNlRGVwZW5kZW5jeSh0YXJnZXQ6IENmblJlc291cmNlKSB7XG4gICAgdGhpcy5kZXBlbmRzT24uZGVsZXRlKHRhcmdldCk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgQ2xvdWRGb3JtYXRpb24gZm9yIHRoaXMgcmVzb3VyY2UuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF90b0Nsb3VkRm9ybWF0aW9uKCk6IG9iamVjdCB7XG4gICAgaWYgKCF0aGlzLnNob3VsZFN5bnRoZXNpemUoKSkge1xuICAgICAgcmV0dXJuIHsgfTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmV0ID0ge1xuICAgICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgICAvLyBQb3N0LVJlc29sdmUgb3BlcmF0aW9uIHNpbmNlIG90aGVyd2lzZSBkZWVwTWVyZ2UgaXMgZ29pbmcgdG8gbWl4IHZhbHVlcyBpbnRvXG4gICAgICAgICAgLy8gdGhlIFRva2VuIG9iamVjdHMgcmV0dXJuZWQgYnkgaWdub3JlRW1wdHkuXG4gICAgICAgICAgW3RoaXMubG9naWNhbElkXTogbmV3IFBvc3RSZXNvbHZlVG9rZW4oe1xuICAgICAgICAgICAgVHlwZTogdGhpcy5jZm5SZXNvdXJjZVR5cGUsXG4gICAgICAgICAgICBQcm9wZXJ0aWVzOiBpZ25vcmVFbXB0eSh0aGlzLmNmblByb3BlcnRpZXMpLFxuICAgICAgICAgICAgRGVwZW5kc09uOiBpZ25vcmVFbXB0eShyZW5kZXJEZXBlbmRzT24odGhpcy5kZXBlbmRzT24pKSxcbiAgICAgICAgICAgIENyZWF0aW9uUG9saWN5OiBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyh0aGlzLCByZW5kZXJDcmVhdGlvblBvbGljeSh0aGlzLmNmbk9wdGlvbnMuY3JlYXRpb25Qb2xpY3kpKSxcbiAgICAgICAgICAgIFVwZGF0ZVBvbGljeTogY2FwaXRhbGl6ZVByb3BlcnR5TmFtZXModGhpcywgdGhpcy5jZm5PcHRpb25zLnVwZGF0ZVBvbGljeSksXG4gICAgICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyh0aGlzLCB0aGlzLmNmbk9wdGlvbnMudXBkYXRlUmVwbGFjZVBvbGljeSksXG4gICAgICAgICAgICBEZWxldGlvblBvbGljeTogY2FwaXRhbGl6ZVByb3BlcnR5TmFtZXModGhpcywgdGhpcy5jZm5PcHRpb25zLmRlbGV0aW9uUG9saWN5KSxcbiAgICAgICAgICAgIFZlcnNpb246IHRoaXMuY2ZuT3B0aW9ucy52ZXJzaW9uLFxuICAgICAgICAgICAgRGVzY3JpcHRpb246IHRoaXMuY2ZuT3B0aW9ucy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIE1ldGFkYXRhOiBpZ25vcmVFbXB0eSh0aGlzLmNmbk9wdGlvbnMubWV0YWRhdGEpLFxuICAgICAgICAgICAgQ29uZGl0aW9uOiB0aGlzLmNmbk9wdGlvbnMuY29uZGl0aW9uICYmIHRoaXMuY2ZuT3B0aW9ucy5jb25kaXRpb24ubG9naWNhbElkLFxuICAgICAgICAgIH0sIHJlc291cmNlRGVmID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlcmVkUHJvcHMgPSB0aGlzLnJlbmRlclByb3BlcnRpZXMocmVzb3VyY2VEZWYuUHJvcGVydGllcyB8fCB7fSk7XG4gICAgICAgICAgICBpZiAocmVuZGVyZWRQcm9wcykge1xuICAgICAgICAgICAgICBjb25zdCBoYXNEZWZpbmVkID0gT2JqZWN0LnZhbHVlcyhyZW5kZXJlZFByb3BzKS5maW5kKHYgPT4gdiAhPT0gdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgcmVzb3VyY2VEZWYuUHJvcGVydGllcyA9IGhhc0RlZmluZWQgIT09IHVuZGVmaW5lZCA/IHJlbmRlcmVkUHJvcHMgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZXNvbHZlZFJhd092ZXJyaWRlcyA9IFRva2VuaXphdGlvbi5yZXNvbHZlKHRoaXMucmF3T3ZlcnJpZGVzLCB7XG4gICAgICAgICAgICAgIHNjb3BlOiB0aGlzLFxuICAgICAgICAgICAgICByZXNvbHZlcjogQ0xPVURGT1JNQVRJT05fVE9LRU5fUkVTT0xWRVIsXG4gICAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gcHJlc2VydmUgdGhlIGVtcHR5IGVsZW1lbnRzIGhlcmUsXG4gICAgICAgICAgICAgIC8vIGFzIHRoYXQncyBob3cgcmVtb3Zpbmcgb3ZlcnJpZGVzIGFyZSByZXByZXNlbnRlZCBhc1xuICAgICAgICAgICAgICByZW1vdmVFbXB0eTogZmFsc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkZWVwTWVyZ2UocmVzb3VyY2VEZWYsIHJlc29sdmVkUmF3T3ZlcnJpZGVzKTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgLy8gQ2hhbmdlIG1lc3NhZ2VcbiAgICAgIGUubWVzc2FnZSA9IGBXaGlsZSBzeW50aGVzaXppbmcgJHt0aGlzLm5vZGUucGF0aH06ICR7ZS5tZXNzYWdlfWA7XG4gICAgICAvLyBBZGp1c3Qgc3RhY2sgdHJhY2UgKG1ha2UgaXQgbG9vayBsaWtlIG5vZGUgYnVpbHQgaXQsIHRvby4uLilcbiAgICAgIGNvbnN0IHRyYWNlID0gdGhpcy5jcmVhdGlvblN0YWNrO1xuICAgICAgaWYgKHRyYWNlKSB7XG4gICAgICAgIGNvbnN0IGNyZWF0aW9uU3RhY2sgPSBbJy0tLSByZXNvdXJjZSBjcmVhdGVkIGF0IC0tLScsIC4uLnRyYWNlXS5qb2luKCdcXG4gIGF0ICcpO1xuICAgICAgICBjb25zdCBwcm9ibGVtVHJhY2UgPSBlLnN0YWNrLnNsaWNlKGUuc3RhY2suaW5kZXhPZihlLm1lc3NhZ2UpICsgZS5tZXNzYWdlLmxlbmd0aCk7XG4gICAgICAgIGUuc3RhY2sgPSBgJHtlLm1lc3NhZ2V9XFxuICAke2NyZWF0aW9uU3RhY2t9XFxuICAtLS0gcHJvYmxlbSBkaXNjb3ZlcmVkIGF0IC0tLSR7cHJvYmxlbVRyYWNlfWA7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlLXRocm93XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIC8vIHJldHVybnMgdGhlIHNldCBvZiBsb2dpY2FsIElEICh0b2tlbnMpIHRoaXMgcmVzb3VyY2UgZGVwZW5kcyBvblxuICAgIC8vIHNvcnRlZCBieSBjb25zdHJ1Y3QgcGF0aHMgdG8gZW5zdXJlIHRlc3QgZGV0ZXJtaW5pc21cbiAgICBmdW5jdGlvbiByZW5kZXJEZXBlbmRzT24oZGVwZW5kc09uOiBTZXQ8Q2ZuUmVzb3VyY2U+KSB7XG4gICAgICByZXR1cm4gQXJyYXlcbiAgICAgICAgLmZyb20oZGVwZW5kc09uKVxuICAgICAgICAuc29ydCgoeCwgeSkgPT4geC5ub2RlLnBhdGgubG9jYWxlQ29tcGFyZSh5Lm5vZGUucGF0aCkpXG4gICAgICAgIC5tYXAociA9PiByLmxvZ2ljYWxJZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyQ3JlYXRpb25Qb2xpY3kocG9saWN5OiBDZm5DcmVhdGlvblBvbGljeSB8IHVuZGVmaW5lZCk6IGFueSB7XG4gICAgICBpZiAoIXBvbGljeSkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gICAgICBjb25zdCByZXN1bHQ6IGFueSA9IHsgLi4ucG9saWN5IH07XG4gICAgICBpZiAocG9saWN5LnJlc291cmNlU2lnbmFsICYmIHBvbGljeS5yZXNvdXJjZVNpZ25hbC50aW1lb3V0KSB7XG4gICAgICAgIHJlc3VsdC5yZXNvdXJjZVNpZ25hbCA9IHBvbGljeS5yZXNvdXJjZVNpZ25hbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIGNvbnN0IHByb3BzID0gdGhpcy5fY2ZuUHJvcGVydGllcyB8fCB7fTtcbiAgICBpZiAoVGFnTWFuYWdlci5pc1RhZ2dhYmxlKHRoaXMpKSB7XG4gICAgICBjb25zdCB0YWdzUHJvcDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuICAgICAgdGFnc1Byb3BbdGhpcy50YWdzLnRhZ1Byb3BlcnR5TmFtZV0gPSB0aGlzLnRhZ3MucmVuZGVyVGFncygpO1xuICAgICAgcmV0dXJuIGRlZXBNZXJnZShwcm9wcywgdGFnc1Byb3ApO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cblxuICAvKipcbiAgICogRGVwcmVjYXRlZFxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYHVwZGF0ZWRQcm9wZXJ0aWVzYFxuICAgKlxuICAgKiBSZXR1cm4gcHJvcGVydGllcyBtb2RpZmllZCBhZnRlciBpbml0aWF0aW9uXG4gICAqXG4gICAqIFJlc291cmNlcyB0aGF0IGV4cG9zZSBtdXRhYmxlIHByb3BlcnRpZXMgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb24gdG9cbiAgICogY29sbGVjdCBhbmQgcmV0dXJuIHRoZSBwcm9wZXJ0aWVzIG9iamVjdCBmb3IgdGhpcyByZXNvdXJjZS5cbiAgICovXG4gIHByb3RlY3RlZCBnZXQgdXBkYXRlZFByb3Blcml0ZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZFByb3BlcnRpZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHByb3BlcnRpZXMgbW9kaWZpZWQgYWZ0ZXIgaW5pdGlhdGlvblxuICAgKlxuICAgKiBSZXNvdXJjZXMgdGhhdCBleHBvc2UgbXV0YWJsZSBwcm9wZXJ0aWVzIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uIHRvXG4gICAqIGNvbGxlY3QgYW5kIHJldHVybiB0aGUgcHJvcGVydGllcyBvYmplY3QgZm9yIHRoaXMgcmVzb3VyY2UuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0IHVwZGF0ZWRQcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIHJldHVybiB0aGlzLl9jZm5Qcm9wZXJ0aWVzO1xuICB9XG5cbiAgcHJvdGVjdGVkIHZhbGlkYXRlUHJvcGVydGllcyhfcHJvcGVydGllczogYW55KSB7XG4gICAgLy8gTm90aGluZ1xuICB9XG5cbiAgLyoqXG4gICAqIENhbiBiZSBvdmVycmlkZGVuIGJ5IHN1YmNsYXNzZXMgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgcmVzb3VyY2Ugd2lsbCBiZSByZW5kZXJlZFxuICAgKiBpbnRvIHRoZSBjbG91ZGZvcm1hdGlvbiB0ZW1wbGF0ZS5cbiAgICpcbiAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSByZXNvdXJjZSBzaG91bGQgYmUgaW5jbHVkZWQgb3IgYGZhbHNlYCBpcyB0aGUgcmVzb3VyY2VcbiAgICogc2hvdWxkIGJlIG9taXR0ZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2hvdWxkU3ludGhlc2l6ZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZW51bSBUYWdUeXBlIHtcbiAgU1RBTkRBUkQgPSAnU3RhbmRhcmRUYWcnLFxuICBBVVRPU0NBTElOR19HUk9VUCA9ICdBdXRvU2NhbGluZ0dyb3VwVGFnJyxcbiAgTUFQID0gJ1N0cmluZ1RvU3RyaW5nTWFwJyxcbiAgS0VZX1ZBTFVFID0gJ0tleVZhbHVlJyxcbiAgTk9UX1RBR0dBQkxFID0gJ05vdFRhZ2dhYmxlJyxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQ2ZuUmVzb3VyY2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIEEgY29uZGl0aW9uIHRvIGFzc29jaWF0ZSB3aXRoIHRoaXMgcmVzb3VyY2UuIFRoaXMgbWVhbnMgdGhhdCBvbmx5IGlmIHRoZSBjb25kaXRpb24gZXZhbHVhdGVzIHRvICd0cnVlJyB3aGVuIHRoZSBzdGFja1xuICAgKiBpcyBkZXBsb3llZCwgdGhlIHJlc291cmNlIHdpbGwgYmUgaW5jbHVkZWQuIFRoaXMgaXMgcHJvdmlkZWQgdG8gYWxsb3cgQ0RLIHByb2plY3RzIHRvIHByb2R1Y2UgbGVnYWN5IHRlbXBsYXRlcywgYnV0IG5vcm1hbGx5XG4gICAqIHRoZXJlIGlzIG5vIG5lZWQgdG8gdXNlIGl0IGluIENESyBwcm9qZWN0cy5cbiAgICovXG4gIGNvbmRpdGlvbj86IENmbkNvbmRpdGlvbjtcblxuICAvKipcbiAgICogQXNzb2NpYXRlIHRoZSBDcmVhdGlvblBvbGljeSBhdHRyaWJ1dGUgd2l0aCBhIHJlc291cmNlIHRvIHByZXZlbnQgaXRzIHN0YXR1cyBmcm9tIHJlYWNoaW5nIGNyZWF0ZSBjb21wbGV0ZSB1bnRpbFxuICAgKiBBV1MgQ2xvdWRGb3JtYXRpb24gcmVjZWl2ZXMgYSBzcGVjaWZpZWQgbnVtYmVyIG9mIHN1Y2Nlc3Mgc2lnbmFscyBvciB0aGUgdGltZW91dCBwZXJpb2QgaXMgZXhjZWVkZWQuIFRvIHNpZ25hbCBhXG4gICAqIHJlc291cmNlLCB5b3UgY2FuIHVzZSB0aGUgY2ZuLXNpZ25hbCBoZWxwZXIgc2NyaXB0IG9yIFNpZ25hbFJlc291cmNlIEFQSS4gQVdTIENsb3VkRm9ybWF0aW9uIHB1Ymxpc2hlcyB2YWxpZCBzaWduYWxzXG4gICAqIHRvIHRoZSBzdGFjayBldmVudHMgc28gdGhhdCB5b3UgdHJhY2sgdGhlIG51bWJlciBvZiBzaWduYWxzIHNlbnQuXG4gICAqL1xuICBjcmVhdGlvblBvbGljeT86IENmbkNyZWF0aW9uUG9saWN5O1xuXG4gIC8qKlxuICAgKiBXaXRoIHRoZSBEZWxldGlvblBvbGljeSBhdHRyaWJ1dGUgeW91IGNhbiBwcmVzZXJ2ZSBvciAoaW4gc29tZSBjYXNlcykgYmFja3VwIGEgcmVzb3VyY2Ugd2hlbiBpdHMgc3RhY2sgaXMgZGVsZXRlZC5cbiAgICogWW91IHNwZWNpZnkgYSBEZWxldGlvblBvbGljeSBhdHRyaWJ1dGUgZm9yIGVhY2ggcmVzb3VyY2UgdGhhdCB5b3Ugd2FudCB0byBjb250cm9sLiBJZiBhIHJlc291cmNlIGhhcyBubyBEZWxldGlvblBvbGljeVxuICAgKiBhdHRyaWJ1dGUsIEFXUyBDbG91ZEZvcm1hdGlvbiBkZWxldGVzIHRoZSByZXNvdXJjZSBieSBkZWZhdWx0LiBOb3RlIHRoYXQgdGhpcyBjYXBhYmlsaXR5IGFsc28gYXBwbGllcyB0byB1cGRhdGUgb3BlcmF0aW9uc1xuICAgKiB0aGF0IGxlYWQgdG8gcmVzb3VyY2VzIGJlaW5nIHJlbW92ZWQuXG4gICAqL1xuICBkZWxldGlvblBvbGljeT86IENmbkRlbGV0aW9uUG9saWN5O1xuXG4gIC8qKlxuICAgKiBVc2UgdGhlIFVwZGF0ZVBvbGljeSBhdHRyaWJ1dGUgdG8gc3BlY2lmeSBob3cgQVdTIENsb3VkRm9ybWF0aW9uIGhhbmRsZXMgdXBkYXRlcyB0byB0aGUgQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cFxuICAgKiByZXNvdXJjZS4gQVdTIENsb3VkRm9ybWF0aW9uIGludm9rZXMgb25lIG9mIHRocmVlIHVwZGF0ZSBwb2xpY2llcyBkZXBlbmRpbmcgb24gdGhlIHR5cGUgb2YgY2hhbmdlIHlvdSBtYWtlIG9yIHdoZXRoZXIgYVxuICAgKiBzY2hlZHVsZWQgYWN0aW9uIGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgQXV0byBTY2FsaW5nIGdyb3VwLlxuICAgKi9cbiAgdXBkYXRlUG9saWN5PzogQ2ZuVXBkYXRlUG9saWN5O1xuXG4gIC8qKlxuICAgKiBVc2UgdGhlIFVwZGF0ZVJlcGxhY2VQb2xpY3kgYXR0cmlidXRlIHRvIHJldGFpbiBvciAoaW4gc29tZSBjYXNlcykgYmFja3VwIHRoZSBleGlzdGluZyBwaHlzaWNhbCBpbnN0YW5jZSBvZiBhIHJlc291cmNlXG4gICAqIHdoZW4gaXQgaXMgcmVwbGFjZWQgZHVyaW5nIGEgc3RhY2sgdXBkYXRlIG9wZXJhdGlvbi5cbiAgICovXG4gIHVwZGF0ZVJlcGxhY2VQb2xpY3k/OiBDZm5EZWxldGlvblBvbGljeTtcblxuICAvKipcbiAgICogVGhlIHZlcnNpb24gb2YgdGhpcyByZXNvdXJjZS5cbiAgICogVXNlZCBvbmx5IGZvciBjdXN0b20gQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2VzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1jZm4tY3VzdG9tcmVzb3VyY2UuaHRtbFxuICAgKi9cbiAgdmVyc2lvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRlc2NyaXB0aW9uIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAqIFVzZWQgZm9yIGluZm9ybWF0aW9uYWwgcHVycG9zZXMgb25seSwgaXMgbm90IHByb2Nlc3NlZCBpbiBhbnkgd2F5XG4gICAqIChhbmQgc3RheXMgd2l0aCB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUsIGlzIG5vdCBwYXNzZWQgdG8gdGhlIHVuZGVybHlpbmcgcmVzb3VyY2UsXG4gICAqIGV2ZW4gaWYgaXQgZG9lcyBoYXZlIGEgJ2Rlc2NyaXB0aW9uJyBwcm9wZXJ0eSkuXG4gICAqL1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogTWV0YWRhdGEgYXNzb2NpYXRlZCB3aXRoIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZS4gVGhpcyBpcyBub3QgdGhlIHNhbWUgYXMgdGhlIGNvbnN0cnVjdCBtZXRhZGF0YSB3aGljaCBjYW4gYmUgYWRkZWRcbiAgICogdXNpbmcgY29uc3RydWN0LmFkZE1ldGFkYXRhKCksIGJ1dCB3b3VsZCBub3QgYXBwZWFyIGluIHRoZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBhdXRvbWF0aWNhbGx5LlxuICAgKi9cbiAgbWV0YWRhdGE/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9O1xufVxuXG4vKipcbiAqIE9iamVjdCBrZXlzIHRoYXQgZGVlcE1lcmdlIHNob3VsZCBub3QgY29uc2lkZXIuIEN1cnJlbnRseSB0aGVzZSBpbmNsdWRlXG4gKiBDbG91ZEZvcm1hdGlvbiBpbnRyaW5zaWNzXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9pbnRyaW5zaWMtZnVuY3Rpb24tcmVmZXJlbmNlLmh0bWxcbiAqL1xuXG5jb25zdCBNRVJHRV9FWENMVURFX0tFWVM6IHN0cmluZ1tdID0gW1xuICAnUmVmJyxcbiAgJ0ZuOjpCYXNlNjQnLFxuICAnRm46OkNpZHInLFxuICAnRm46OkZpbmRJbk1hcCcsXG4gICdGbjo6R2V0QXR0JyxcbiAgJ0ZuOjpHZXRBWnMnLFxuICAnRm46OkltcG9ydFZhbHVlJyxcbiAgJ0ZuOjpKb2luJyxcbiAgJ0ZuOjpTZWxlY3QnLFxuICAnRm46OlNwbGl0JyxcbiAgJ0ZuOjpTdWInLFxuICAnRm46OlRyYW5zZm9ybScsXG4gICdGbjo6QW5kJyxcbiAgJ0ZuOjpFcXVhbHMnLFxuICAnRm46OklmJyxcbiAgJ0ZuOjpOb3QnLFxuICAnRm46Ok9yJyxcbl07XG5cbi8qKlxuICogTWVyZ2VzIGBzb3VyY2VgIGludG8gYHRhcmdldGAsIG92ZXJyaWRpbmcgYW55IGV4aXN0aW5nIHZhbHVlcy5cbiAqIGBudWxsYHMgd2lsbCBjYXVzZSBhIHZhbHVlIHRvIGJlIGRlbGV0ZWQuXG4gKi9cbmZ1bmN0aW9uIGRlZXBNZXJnZSh0YXJnZXQ6IGFueSwgLi4uc291cmNlczogYW55W10pIHtcbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgIGlmICh0eXBlb2Yoc291cmNlKSAhPT0gJ29iamVjdCcgfHwgdHlwZW9mKHRhcmdldCkgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdXNhZ2UuIEJvdGggc291cmNlICgke0pTT04uc3RyaW5naWZ5KHNvdXJjZSl9KSBhbmQgdGFyZ2V0ICgke0pTT04uc3RyaW5naWZ5KHRhcmdldCl9KSBtdXN0IGJlIG9iamVjdHNgKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzb3VyY2UpKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgICAgaWYgKHR5cGVvZih2YWx1ZSkgPT09ICdvYmplY3QnICYmIHZhbHVlICE9IG51bGwgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIC8vIGlmIHRoZSB2YWx1ZSBhdCB0aGUgdGFyZ2V0IGlzIG5vdCBhbiBvYmplY3QsIG92ZXJyaWRlIGl0IHdpdGggYW5cbiAgICAgICAgLy8gb2JqZWN0IHNvIHdlIGNhbiBjb250aW51ZSB0aGUgcmVjdXJzaW9uXG4gICAgICAgIGlmICh0eXBlb2YodGFyZ2V0W2tleV0pICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHRhcmdldFtrZXldID0ge307XG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBJZiB3ZSBoYXZlIHNvbWV0aGluZyB0aGF0IGxvb2tzIGxpa2U6XG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiAgIHRhcmdldDogeyBUeXBlOiAnTXlSZXNvdXJjZVR5cGUnLCBQcm9wZXJ0aWVzOiB7IHByb3AxOiB7IFJlZjogJ1BhcmFtJyB9IH0gfVxuICAgICAgICAgICAqICAgc291cmNlczogWyB7IFByb3BlcnRpZXM6IHsgcHJvcDE6IFsgJ0ZuOjpKb2luJzogWyctJywgJ2hlbGxvJywgJ3dvcmxkJ10gXSB9IH0gXVxuICAgICAgICAgICAqXG4gICAgICAgICAgICogRXZlbnR1YWxseSB3ZSB3aWxsIGdldCB0byB0aGUgcG9pbnQgd2hlcmUgd2UgaGF2ZVxuICAgICAgICAgICAqXG4gICAgICAgICAgICogICB0YXJnZXQ6IHsgcHJvcDE6IHsgUmVmOiAnUGFyYW0nIH0gfVxuICAgICAgICAgICAqICAgc291cmNlczogWyB7IHByb3AxOiB7ICdGbjo6Sm9pbic6IFsnLScsICdoZWxsbycsICd3b3JsZCddIH0gfSBdXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBXZSBuZWVkIHRvIHJlY3Vyc2UgMSBtb3JlIHRpbWUsIGJ1dCBpZiB3ZSBkbyB3ZSB3aWxsIGVuZCB1cCB3aXRoXG4gICAgICAgICAgICogICB7IHByb3AxOiB7IFJlZjogJ1BhcmFtJywgJ0ZuOjpKb2luJzogWyctJywgJ2hlbGxvJywgJ3dvcmxkJ10gfSB9XG4gICAgICAgICAgICogd2hpY2ggaXMgbm90IHdoYXQgd2Ugd2FudC5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEluc3RlYWQgd2UgY2hlY2sgdG8gc2VlIHdoZXRoZXIgdGhlIGB0YXJnZXRgIHZhbHVlIChpLmUuIHRhcmdldC5wcm9wMSlcbiAgICAgICAgICAgKiBpcyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIGtleSB0aGF0IHdlIGRvbid0IHdhbnQgdG8gcmVjdXJzZSBvbi4gSWYgaXQgZG9lc1xuICAgICAgICAgICAqIHRoZW4gd2UgZXNzZW50aWFsbHkgZHJvcCBpdCBhbmQgZW5kIHVwIHdpdGg6XG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiAgIHsgcHJvcDE6IHsgJ0ZuOjpKb2luJzogWyctJywgJ2hlbGxvJywgJ3dvcmxkJ10gfSB9XG4gICAgICAgICAgICovXG4gICAgICAgIH0gZWxzZSBpZiAoT2JqZWN0LmtleXModGFyZ2V0W2tleV0pLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIGlmIChNRVJHRV9FWENMVURFX0tFWVMuaW5jbHVkZXMoT2JqZWN0LmtleXModGFyZ2V0W2tleV0pWzBdKSkge1xuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlcmUgbWlnaHQgYWxzbyBiZSB0aGUgY2FzZSB3aGVyZSB0aGUgc291cmNlIGlzIGFuIGludHJpbnNpY1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICB0YXJnZXQ6IHtcbiAgICAgICAgICogICAgICBUeXBlOiAnTXlSZXNvdXJjZVR5cGUnLFxuICAgICAgICAgKiAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICogICAgICAgIHByb3AxOiB7IHN1YnByb3A6IHsgbmFtZTogeyAnRm46OkdldEF0dCc6ICdhYmMnIH0gfSB9XG4gICAgICAgICAqICAgICAgfVxuICAgICAgICAgKiAgICB9XG4gICAgICAgICAqICAgIHNvdXJjZXM6IFsge1xuICAgICAgICAgKiAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICogICAgICAgIHByb3AxOiB7IHN1YnByb3A6IHsgJ0ZuOjpJZic6IFsnU29tZUNvbmRpdGlvbicsIHsuLi59LCB7Li4ufV0gfX1cbiAgICAgICAgICogICAgICB9XG4gICAgICAgICAqICAgIH0gXVxuICAgICAgICAgKlxuICAgICAgICAgKiBXZSBlbmQgdXAgaW4gYSBwbGFjZSB0aGF0IGlzIHRoZSByZXZlcnNlIG9mIHRoZSBhYm92ZSBjaGVjaywgdGhlIHNvdXJjZVxuICAgICAgICAgKiBiZWNvbWVzIGFuIGludHJpbnNpYyBiZWZvcmUgdGhlIHRhcmdldFxuICAgICAgICAgKlxuICAgICAgICAgKiAgIHRhcmdldDogeyBzdWJwcm9wOiB7IG5hbWU6IHsgJ0ZuOjpHZXRBdHQnOiAnYWJjJyB9IH0gfVxuICAgICAgICAgKiAgIHNvdXJjZXM6IFt7XG4gICAgICAgICAqICAgICAnRm46OklmJzogWyAnTXlDb25kaXRpb24nLCB7Li4ufSwgey4uLn0gXVxuICAgICAgICAgKiAgIH1dXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIGlmIChNRVJHRV9FWENMVURFX0tFWVMuaW5jbHVkZXMoT2JqZWN0LmtleXModmFsdWUpWzBdKSkge1xuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkZWVwTWVyZ2UodGFyZ2V0W2tleV0sIHZhbHVlKTtcblxuICAgICAgICAvLyBpZiB0aGUgcmVzdWx0IG9mIHRoZSBtZXJnZSBpcyBhbiBlbXB0eSBvYmplY3QsIGl0J3MgYmVjYXVzZSB0aGVcbiAgICAgICAgLy8gZXZlbnR1YWwgdmFsdWUgd2UgYXNzaWduZWQgaXMgYHVuZGVmaW5lZGAsIGFuZCB0aGVyZSBhcmUgbm9cbiAgICAgICAgLy8gc2libGluZyBjb25jcmV0ZSB2YWx1ZXMgYWxvbmdzaWRlLCBzbyB3ZSBjYW4gZGVsZXRlIHRoaXMgdHJlZS5cbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gdGFyZ2V0W2tleV07XG4gICAgICAgIGlmICh0eXBlb2Yob3V0cHV0KSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMob3V0cHV0KS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBkZWxldGUgdGFyZ2V0W2tleV07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBkZWxldGUgdGFyZ2V0W2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qKlxuICogU3BsaXQgb24gcGVyaW9kcyB3aGlsZSBwcm9jZXNzaW5nIGVzY2FwZSBjaGFyYWN0ZXJzIFxcXG4gKi9cbmZ1bmN0aW9uIHNwbGl0T25QZXJpb2RzKHg6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgLy8gQnVpbGQgdGhpcyBsaXN0IGluIHJldmVyc2UgYmVjYXVzZSBpdCdzIG1vcmUgY29udmVuaWVudCB0byBnZXQgdGhlIFwiY3VycmVudFwiXG4gIC8vIGl0ZW0gYnkgZG9pbmcgcmV0WzBdIHRoYW4gYnkgcmV0W3JldC5sZW5ndGggLSAxXS5cbiAgY29uc3QgcmV0ID0gWycnXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHhbaV0gPT09ICdcXFxcJyAmJiBpICsgMSA8IHgubGVuZ3RoKSB7XG4gICAgICByZXRbMF0gKz0geFtpICsgMV07XG4gICAgICBpKys7XG4gICAgfSBlbHNlIGlmICh4W2ldID09PSAnLicpIHtcbiAgICAgIHJldC51bnNoaWZ0KCcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0WzBdICs9IHhbaV07XG4gICAgfVxuICB9XG5cbiAgcmV0LnJldmVyc2UoKTtcbiAgcmV0dXJuIHJldDtcbn1cbiJdfQ==