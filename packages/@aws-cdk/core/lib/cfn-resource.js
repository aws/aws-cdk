"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagType = exports.CfnResource = void 0;
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
     *        override values in complex types. Any intermediate keys
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
        // Nothing
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXJlc291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLXJlc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlDQUF5QztBQUN6QywrQ0FBNEM7QUFFNUMsNkZBQTZGO0FBQzdGLGlDQUFpQztBQUNqQywrQ0FBOEM7QUFDOUMsK0RBQThGO0FBQzlGLDJDQUF5RDtBQUN6RCxpQ0FBNkU7QUFDN0UsMkRBQXVEO0FBQ3ZELHVFQUE4RTtBQUU5RSxxREFBdUU7QUFDdkUsK0NBQTJDO0FBQzNDLG1DQUF1QztBQUN2QyxpQ0FBZ0Y7QUFDaEYsbURBQStDO0FBaUIvQzs7R0FFRztBQUNILE1BQWEsV0FBWSxTQUFRLDJCQUFhO0lBQzVDOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFxQjtRQUMvQyxPQUFRLFNBQWlCLENBQUMsZUFBZSxLQUFLLFNBQVMsQ0FBQztJQUMxRCxDQUFDO0lBd0NEOzs7T0FHRztJQUNILFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBdUI7UUFDL0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQTNDbkIsNkVBQTZFO1FBQzdFLDBFQUEwRTtRQUMxRSw2RUFBNkU7UUFDN0UsOEVBQThFO1FBQzlFLDhFQUE4RTtRQUM5RSwwRUFBMEU7UUFDMUUsK0NBQStDO1FBRS9DOztXQUVHO1FBQ2EsZUFBVSxHQUF3QixFQUFFLENBQUM7UUFlckQ7O1dBRUc7UUFDYyxpQkFBWSxHQUFRLEVBQUUsQ0FBQztRQUV4Qzs7OztXQUlHO1FBQ2MsY0FBUyxHQUFHLElBQUksR0FBRyxFQUFlLENBQUM7UUFTbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7WUFDZixNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7U0FDcEQ7UUFFRCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDbEMsSUFBSSxDQUFDLGNBQWMsR0FB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LENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2pCO2FBQU07WUFDTCxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hCO0tBQ0Y7SUFFRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDZCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMgfSBmcm9tICcuL2Fubm90YXRpb25zJztcbmltcG9ydCB7IENmbkNvbmRpdGlvbiB9IGZyb20gJy4vY2ZuLWNvbmRpdGlvbic7XG4vLyBpbXBvcnQgcmVxdWlyZWQgdG8gYmUgaGVyZSwgb3RoZXJ3aXNlIGNhdXNlcyBhIGN5Y2xlIHdoZW4gcnVubmluZyB0aGUgZ2VuZXJhdGVkIEphdmFTY3JpcHRcbi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9vcmRlciAqL1xuaW1wb3J0IHsgQ2ZuUmVmRWxlbWVudCB9IGZyb20gJy4vY2ZuLWVsZW1lbnQnO1xuaW1wb3J0IHsgQ2ZuQ3JlYXRpb25Qb2xpY3ksIENmbkRlbGV0aW9uUG9saWN5LCBDZm5VcGRhdGVQb2xpY3kgfSBmcm9tICcuL2Nmbi1yZXNvdXJjZS1wb2xpY3knO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBJQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBhZGREZXBlbmRlbmN5LCBvYnRhaW5EZXBlbmRlbmNpZXMsIHJlbW92ZURlcGVuZGVuY3kgfSBmcm9tICcuL2RlcHMnO1xuaW1wb3J0IHsgQ2ZuUmVmZXJlbmNlIH0gZnJvbSAnLi9wcml2YXRlL2Nmbi1yZWZlcmVuY2UnO1xuaW1wb3J0IHsgQ0xPVURGT1JNQVRJT05fVE9LRU5fUkVTT0xWRVIgfSBmcm9tICcuL3ByaXZhdGUvY2xvdWRmb3JtYXRpb24tbGFuZyc7XG5pbXBvcnQgeyBSZWZlcmVuY2UgfSBmcm9tICcuL3JlZmVyZW5jZSc7XG5pbXBvcnQgeyBSZW1vdmFsUG9saWN5LCBSZW1vdmFsUG9saWN5T3B0aW9ucyB9IGZyb20gJy4vcmVtb3ZhbC1wb2xpY3knO1xuaW1wb3J0IHsgVGFnTWFuYWdlciB9IGZyb20gJy4vdGFnLW1hbmFnZXInO1xuaW1wb3J0IHsgVG9rZW5pemF0aW9uIH0gZnJvbSAnLi90b2tlbic7XG5pbXBvcnQgeyBjYXBpdGFsaXplUHJvcGVydHlOYW1lcywgaWdub3JlRW1wdHksIFBvc3RSZXNvbHZlVG9rZW4gfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgRmVhdHVyZUZsYWdzIH0gZnJvbSAnLi9mZWF0dXJlLWZsYWdzJztcbmltcG9ydCB7IFJlc29sdXRpb25UeXBlSGludCB9IGZyb20gJy4vdHlwZS1oaW50cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuUmVzb3VyY2VQcm9wcyB7XG4gIC8qKlxuICAgKiBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIChlLmcuIGBBV1M6OlMzOjpCdWNrZXRgKS5cbiAgICovXG4gIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogUmVzb3VyY2UgcHJvcGVydGllcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyByZXNvdXJjZSBwcm9wZXJ0aWVzLlxuICAgKi9cbiAgcmVhZG9ubHkgcHJvcGVydGllcz86IHsgW25hbWU6IHN0cmluZ106IGFueSB9O1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZS5cbiAqL1xuZXhwb3J0IGNsYXNzIENmblJlc291cmNlIGV4dGVuZHMgQ2ZuUmVmRWxlbWVudCB7XG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiBjb25zdHJ1Y3QgaXMgYSBDZm5SZXNvdXJjZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc0NmblJlc291cmNlKGNvbnN0cnVjdDogSUNvbnN0cnVjdCk6IGNvbnN0cnVjdCBpcyBDZm5SZXNvdXJjZSB7XG4gICAgcmV0dXJuIChjb25zdHJ1Y3QgYXMgYW55KS5jZm5SZXNvdXJjZVR5cGUgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIE1BSU5UQUlORVJTIE5PVEU6IHRoaXMgY2xhc3Mgc2VydmVzIGFzIHRoZSBiYXNlIGNsYXNzIGZvciB0aGUgZ2VuZXJhdGVkIEwxXG4gIC8vIChcIkNGTlwiKSByZXNvdXJjZXMgKHN1Y2ggYXMgYHMzLkNmbkJ1Y2tldGApLiBUaGVzZSByZXNvdXJjZXMgd2lsbCBoYXZlIGFcbiAgLy8gcHJvcGVydHkgZm9yIGVhY2ggQ2xvdWRGb3JtYXRpb24gcHJvcGVydHkgb2YgdGhlIHJlc291cmNlLiBUaGlzIG1lYW5zIHRoYXRcbiAgLy8gaWYgYXQgc29tZSBwb2ludCBpbiB0aGUgZnV0dXJlIGEgcHJvcGVydHkgaXMgaW50cm9kdWNlZCB3aXRoIGEgbmFtZSBzaW1pbGFyXG4gIC8vIHRvIG9uZSBvZiB0aGUgcHJvcGVydGllcyBoZXJlLCBpdCB3aWxsIGJlIFwibWFza2VkXCIgYnkgdGhlIGRlcml2ZWQgY2xhc3MuIFRvXG4gIC8vIHRoYXQgZW5kLCB3ZSBwcmVmaXggYWxsIHByb3BlcnRpZXMgaW4gdGhpcyBjbGFzcyB3aXRoIGBjZm5YeHhgIHdpdGggdGhlXG4gIC8vIGhvcGUgdG8gYXZvaWQgdGhvc2UgY29uZmxpY3RzIGluIHRoZSBmdXR1cmUuXG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgZm9yIHRoaXMgcmVzb3VyY2UsIHN1Y2ggYXMgY29uZGl0aW9uLCB1cGRhdGUgcG9saWN5IGV0Yy5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjZm5PcHRpb25zOiBJQ2ZuUmVzb3VyY2VPcHRpb25zID0ge307XG5cbiAgLyoqXG4gICAqIEFXUyByZXNvdXJjZSB0eXBlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNmblJlc291cmNlVHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBV1MgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgcHJvcGVydGllcy5cbiAgICpcbiAgICogVGhpcyBvYmplY3QgaXMgcmV0dXJuZWQgdmlhIGNmblByb3BlcnRpZXNcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgX2NmblByb3BlcnRpZXM6IGFueTtcblxuICAvKipcbiAgICogQW4gb2JqZWN0IHRvIGJlIG1lcmdlZCBvbiB0b3Agb2YgdGhlIGVudGlyZSByZXNvdXJjZSBkZWZpbml0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSByYXdPdmVycmlkZXM6IGFueSA9IHt9O1xuXG4gIC8qKlxuICAgKiBMb2dpY2FsIElEcyBvZiBkZXBlbmRlbmNpZXMuXG4gICAqXG4gICAqIElzIGZpbGxlZCBkdXJpbmcgcHJlcGFyZSgpLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBkZXBlbmRzT24gPSBuZXcgU2V0PENmblJlc291cmNlPigpO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcmVzb3VyY2UgY29uc3RydWN0LlxuICAgKiBAcGFyYW0gY2ZuUmVzb3VyY2VUeXBlIFRoZSBDbG91ZEZvcm1hdGlvbiB0eXBlIG9mIHRoaXMgcmVzb3VyY2UgKGUuZy4gQVdTOjpEeW5hbW9EQjo6VGFibGUpXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuUmVzb3VyY2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAoIXByb3BzLnR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGB0eXBlYCBwcm9wZXJ0eSBpcyByZXF1aXJlZCcpO1xuICAgIH1cblxuICAgIHRoaXMuY2ZuUmVzb3VyY2VUeXBlID0gcHJvcHMudHlwZTtcbiAgICB0aGlzLl9jZm5Qcm9wZXJ0aWVzID0gcHJvcHMucHJvcGVydGllcyB8fCB7fTtcblxuICAgIC8vIGlmIGF3czpjZGs6ZW5hYmxlLXBhdGgtbWV0YWRhdGEgaXMgc2V0LCBlbWJlZCB0aGUgY3VycmVudCBjb25zdHJ1Y3Qnc1xuICAgIC8vIHBhdGggaW4gdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlLCBzbyBpdCB3aWxsIGJlIHBvc3NpYmxlIHRvIHRyYWNlXG4gICAgLy8gYmFjayB0byB0aGUgYWN0dWFsIGNvbnN0cnVjdCBwYXRoLlxuICAgIGlmIChOb2RlLm9mKHRoaXMpLnRyeUdldENvbnRleHQoY3hhcGkuUEFUSF9NRVRBREFUQV9FTkFCTEVfQ09OVEVYVCkpIHtcbiAgICAgIHRoaXMuYWRkTWV0YWRhdGEoY3hhcGkuUEFUSF9NRVRBREFUQV9LRVksIE5vZGUub2YodGhpcykucGF0aCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRlbGV0aW9uIHBvbGljeSBvZiB0aGUgcmVzb3VyY2UgYmFzZWQgb24gdGhlIHJlbW92YWwgcG9saWN5IHNwZWNpZmllZC5cbiAgICpcbiAgICogVGhlIFJlbW92YWwgUG9saWN5IGNvbnRyb2xzIHdoYXQgaGFwcGVucyB0byB0aGlzIHJlc291cmNlIHdoZW4gaXQgc3RvcHNcbiAgICogYmVpbmcgbWFuYWdlZCBieSBDbG91ZEZvcm1hdGlvbiwgZWl0aGVyIGJlY2F1c2UgeW91J3ZlIHJlbW92ZWQgaXQgZnJvbSB0aGVcbiAgICogQ0RLIGFwcGxpY2F0aW9uIG9yIGJlY2F1c2UgeW91J3ZlIG1hZGUgYSBjaGFuZ2UgdGhhdCByZXF1aXJlcyB0aGUgcmVzb3VyY2VcbiAgICogdG8gYmUgcmVwbGFjZWQuXG4gICAqXG4gICAqIFRoZSByZXNvdXJjZSBjYW4gYmUgZGVsZXRlZCAoYFJlbW92YWxQb2xpY3kuREVTVFJPWWApLCBvciBsZWZ0IGluIHlvdXIgQVdTXG4gICAqIGFjY291bnQgZm9yIGRhdGEgcmVjb3ZlcnkgYW5kIGNsZWFudXAgbGF0ZXIgKGBSZW1vdmFsUG9saWN5LlJFVEFJTmApLiBJbiBzb21lXG4gICAqIGNhc2VzLCBhIHNuYXBzaG90IGNhbiBiZSB0YWtlbiBvZiB0aGUgcmVzb3VyY2UgcHJpb3IgdG8gZGVsZXRpb25cbiAgICogKGBSZW1vdmFsUG9saWN5LlNOQVBTSE9UYCkuIEEgbGlzdCBvZiByZXNvdXJjZXMgdGhhdCBzdXBwb3J0IHRoaXMgcG9saWN5XG4gICAqIGNhbiBiZSBmb3VuZCBpbiB0aGUgZm9sbG93aW5nIGxpbms6XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLWF0dHJpYnV0ZS1kZWxldGlvbnBvbGljeS5odG1sI2F3cy1hdHRyaWJ1dGUtZGVsZXRpb25wb2xpY3ktb3B0aW9uc1xuICAgKi9cbiAgcHVibGljIGFwcGx5UmVtb3ZhbFBvbGljeShwb2xpY3k6IFJlbW92YWxQb2xpY3kgfCB1bmRlZmluZWQsIG9wdGlvbnM6IFJlbW92YWxQb2xpY3lPcHRpb25zID0ge30pIHtcbiAgICBwb2xpY3kgPSBwb2xpY3kgfHwgb3B0aW9ucy5kZWZhdWx0IHx8IFJlbW92YWxQb2xpY3kuUkVUQUlOO1xuXG4gICAgbGV0IGRlbGV0aW9uUG9saWN5O1xuXG4gICAgc3dpdGNoIChwb2xpY3kpIHtcbiAgICAgIGNhc2UgUmVtb3ZhbFBvbGljeS5ERVNUUk9ZOlxuICAgICAgICBkZWxldGlvblBvbGljeSA9IENmbkRlbGV0aW9uUG9saWN5LkRFTEVURTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVtb3ZhbFBvbGljeS5SRVRBSU46XG4gICAgICAgIGRlbGV0aW9uUG9saWN5ID0gQ2ZuRGVsZXRpb25Qb2xpY3kuUkVUQUlOO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZW1vdmFsUG9saWN5LlNOQVBTSE9UOlxuICAgICAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtYXR0cmlidXRlLWRlbGV0aW9ucG9saWN5Lmh0bWxcbiAgICAgICAgY29uc3Qgc25hcHNob3R0YWJsZVJlc291cmNlVHlwZXMgPSBbXG4gICAgICAgICAgJ0FXUzo6RUMyOjpWb2x1bWUnLFxuICAgICAgICAgICdBV1M6OkVsYXN0aUNhY2hlOjpDYWNoZUNsdXN0ZXInLFxuICAgICAgICAgICdBV1M6OkVsYXN0aUNhY2hlOjpSZXBsaWNhdGlvbkdyb3VwJyxcbiAgICAgICAgICAnQVdTOjpOZXB0dW5lOjpEQkNsdXN0ZXInLFxuICAgICAgICAgICdBV1M6OlJEUzo6REJDbHVzdGVyJyxcbiAgICAgICAgICAnQVdTOjpSRFM6OkRCSW5zdGFuY2UnLFxuICAgICAgICAgICdBV1M6OlJlZHNoaWZ0OjpDbHVzdGVyJyxcbiAgICAgICAgXTtcblxuICAgICAgICAvLyBlcnJvciBpZiBmbGFnIGlzIHNldCwgd2FybiBpZiBmbGFnIGlzIG5vdFxuICAgICAgICBjb25zdCBwcm9ibGVtYXRpY1NuYXBzaG90UG9saWN5ID0gIXNuYXBzaG90dGFibGVSZXNvdXJjZVR5cGVzLmluY2x1ZGVzKHRoaXMuY2ZuUmVzb3VyY2VUeXBlKTtcbiAgICAgICAgaWYgKHByb2JsZW1hdGljU25hcHNob3RQb2xpY3kpIHtcbiAgICAgICAgICBpZiAoRmVhdHVyZUZsYWdzLm9mKHRoaXMpLmlzRW5hYmxlZChjeGFwaS5WQUxJREFURV9TTkFQU0hPVF9SRU1PVkFMX1BPTElDWSkgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5jZm5SZXNvdXJjZVR5cGV9IGRvZXMgbm90IHN1cHBvcnQgc25hcHNob3QgcmVtb3ZhbCBwb2xpY3lgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZyhgJHt0aGlzLmNmblJlc291cmNlVHlwZX0gZG9lcyBub3Qgc3VwcG9ydCBzbmFwc2hvdCByZW1vdmFsIHBvbGljeS4gVGhpcyBwb2xpY3kgd2lsbCBiZSBpZ25vcmVkLmApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0aW9uUG9saWN5ID0gQ2ZuRGVsZXRpb25Qb2xpY3kuU05BUFNIT1Q7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcmVtb3ZhbCBwb2xpY3k6ICR7cG9saWN5fWApO1xuICAgIH1cblxuICAgIHRoaXMuY2ZuT3B0aW9ucy5kZWxldGlvblBvbGljeSA9IGRlbGV0aW9uUG9saWN5O1xuICAgIGlmIChvcHRpb25zLmFwcGx5VG9VcGRhdGVSZXBsYWNlUG9saWN5ICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5jZm5PcHRpb25zLnVwZGF0ZVJlcGxhY2VQb2xpY3kgPSBkZWxldGlvblBvbGljeTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHRva2VuIGZvciBhbiBydW50aW1lIGF0dHJpYnV0ZSBvZiB0aGlzIHJlc291cmNlLlxuICAgKiBJZGVhbGx5LCB1c2UgZ2VuZXJhdGVkIGF0dHJpYnV0ZSBhY2Nlc3NvcnMgKGUuZy4gYHJlc291cmNlLmFybmApLCBidXQgdGhpcyBjYW4gYmUgdXNlZCBmb3IgZnV0dXJlIGNvbXBhdGliaWxpdHlcbiAgICogaW4gY2FzZSB0aGVyZSBpcyBubyBnZW5lcmF0ZWQgYXR0cmlidXRlLlxuICAgKiBAcGFyYW0gYXR0cmlidXRlTmFtZSBUaGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlLlxuICAgKi9cbiAgcHVibGljIGdldEF0dChhdHRyaWJ1dGVOYW1lOiBzdHJpbmcsIHR5cGVIaW50PzogUmVzb2x1dGlvblR5cGVIaW50KTogUmVmZXJlbmNlIHtcbiAgICByZXR1cm4gQ2ZuUmVmZXJlbmNlLmZvcih0aGlzLCBhdHRyaWJ1dGVOYW1lLCB1bmRlZmluZWQsIHR5cGVIaW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIG92ZXJyaWRlIHRvIHRoZSBzeW50aGVzaXplZCBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZS4gVG8gYWRkIGFcbiAgICogcHJvcGVydHkgb3ZlcnJpZGUsIGVpdGhlciB1c2UgYGFkZFByb3BlcnR5T3ZlcnJpZGVgIG9yIHByZWZpeCBgcGF0aGAgd2l0aFxuICAgKiBcIlByb3BlcnRpZXMuXCIgKGkuZS4gYFByb3BlcnRpZXMuVG9waWNOYW1lYCkuXG4gICAqXG4gICAqIElmIHRoZSBvdmVycmlkZSBpcyBuZXN0ZWQsIHNlcGFyYXRlIGVhY2ggbmVzdGVkIGxldmVsIHVzaW5nIGEgZG90ICguKSBpbiB0aGUgcGF0aCBwYXJhbWV0ZXIuXG4gICAqIElmIHRoZXJlIGlzIGFuIGFycmF5IGFzIHBhcnQgb2YgdGhlIG5lc3RpbmcsIHNwZWNpZnkgdGhlIGluZGV4IGluIHRoZSBwYXRoLlxuICAgKlxuICAgKiBUbyBpbmNsdWRlIGEgbGl0ZXJhbCBgLmAgaW4gdGhlIHByb3BlcnR5IG5hbWUsIHByZWZpeCB3aXRoIGEgYFxcYC4gSW4gbW9zdFxuICAgKiBwcm9ncmFtbWluZyBsYW5ndWFnZXMgeW91IHdpbGwgbmVlZCB0byB3cml0ZSB0aGlzIGFzIGBcIlxcXFwuXCJgIGJlY2F1c2UgdGhlXG4gICAqIGBcXGAgaXRzZWxmIHdpbGwgbmVlZCB0byBiZSBlc2NhcGVkLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSxcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBjZm5SZXNvdXJjZS5hZGRPdmVycmlkZSgnUHJvcGVydGllcy5HbG9iYWxTZWNvbmRhcnlJbmRleGVzLjAuUHJvamVjdGlvbi5Ob25LZXlBdHRyaWJ1dGVzJywgWydteWF0dHJpYnV0ZSddKTtcbiAgICogY2ZuUmVzb3VyY2UuYWRkT3ZlcnJpZGUoJ1Byb3BlcnRpZXMuR2xvYmFsU2Vjb25kYXJ5SW5kZXhlcy4xLlByb2plY3Rpb25UeXBlJywgJ0lOQ0xVREUnKTtcbiAgICogYGBgXG4gICAqIHdvdWxkIGFkZCB0aGUgb3ZlcnJpZGVzXG4gICAqIGBgYGpzb25cbiAgICogXCJQcm9wZXJ0aWVzXCI6IHtcbiAgICogICBcIkdsb2JhbFNlY29uZGFyeUluZGV4ZXNcIjogW1xuICAgKiAgICAge1xuICAgKiAgICAgICBcIlByb2plY3Rpb25cIjoge1xuICAgKiAgICAgICAgIFwiTm9uS2V5QXR0cmlidXRlc1wiOiBbIFwibXlhdHRyaWJ1dGVcIiBdXG4gICAqICAgICAgICAgLi4uXG4gICAqICAgICAgIH1cbiAgICogICAgICAgLi4uXG4gICAqICAgICB9LFxuICAgKiAgICAge1xuICAgKiAgICAgICBcIlByb2plY3Rpb25UeXBlXCI6IFwiSU5DTFVERVwiXG4gICAqICAgICAgIC4uLlxuICAgKiAgICAgfSxcbiAgICogICBdXG4gICAqICAgLi4uXG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBgdmFsdWVgIGFyZ3VtZW50IHRvIGBhZGRPdmVycmlkZWAgd2lsbCBub3QgYmUgcHJvY2Vzc2VkIG9yIHRyYW5zbGF0ZWRcbiAgICogaW4gYW55IHdheS4gUGFzcyByYXcgSlNPTiB2YWx1ZXMgaW4gaGVyZSB3aXRoIHRoZSBjb3JyZWN0IGNhcGl0YWxpemF0aW9uXG4gICAqIGZvciBDbG91ZEZvcm1hdGlvbi4gSWYgeW91IHBhc3MgQ0RLIGNsYXNzZXMgb3Igc3RydWN0cywgdGhleSB3aWxsIGJlXG4gICAqIHJlbmRlcmVkIHdpdGggbG93ZXJjYXNlZCBrZXkgbmFtZXMsIGFuZCBDbG91ZEZvcm1hdGlvbiB3aWxsIHJlamVjdCB0aGVcbiAgICogdGVtcGxhdGUuXG4gICAqXG4gICAqIEBwYXJhbSBwYXRoIC0gVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5LCB5b3UgY2FuIHVzZSBkb3Qgbm90YXRpb24gdG9cbiAgICogICAgICAgIG92ZXJyaWRlIHZhbHVlcyBpbiBjb21wbGV4IHR5cGVzLiBBbnkgaW50ZXJtZWRpYXRlIGtleXNcbiAgICogICAgICAgIHdpbGwgYmUgY3JlYXRlZCBhcyBuZWVkZWQuXG4gICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZS4gQ291bGQgYmUgcHJpbWl0aXZlIG9yIGNvbXBsZXguXG4gICAqL1xuICBwdWJsaWMgYWRkT3ZlcnJpZGUocGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgY29uc3QgcGFydHMgPSBzcGxpdE9uUGVyaW9kcyhwYXRoKTtcbiAgICBsZXQgY3VycjogYW55ID0gdGhpcy5yYXdPdmVycmlkZXM7XG5cbiAgICB3aGlsZSAocGFydHMubGVuZ3RoID4gMSkge1xuICAgICAgY29uc3Qga2V5ID0gcGFydHMuc2hpZnQoKSE7XG5cbiAgICAgIC8vIGlmIHdlIGNhbid0IHJlY3Vyc2UgZnVydGhlciBvciB0aGUgcHJldmlvdXMgdmFsdWUgaXMgbm90IGFuXG4gICAgICAvLyBvYmplY3Qgb3ZlcndyaXRlIGl0IHdpdGggYW4gb2JqZWN0LlxuICAgICAgY29uc3QgaXNPYmplY3QgPSBjdXJyW2tleV0gIT0gbnVsbCAmJiB0eXBlb2YoY3VycltrZXldKSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoY3VycltrZXldKTtcbiAgICAgIGlmICghaXNPYmplY3QpIHtcbiAgICAgICAgY3VycltrZXldID0ge307XG4gICAgICB9XG5cbiAgICAgIGN1cnIgPSBjdXJyW2tleV07XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdEtleSA9IHBhcnRzLnNoaWZ0KCkhO1xuICAgIGN1cnJbbGFzdEtleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW50YWN0aWMgc3VnYXIgZm9yIGBhZGRPdmVycmlkZShwYXRoLCB1bmRlZmluZWQpYC5cbiAgICogQHBhcmFtIHBhdGggVGhlIHBhdGggb2YgdGhlIHZhbHVlIHRvIGRlbGV0ZVxuICAgKi9cbiAgcHVibGljIGFkZERlbGV0aW9uT3ZlcnJpZGUocGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5hZGRPdmVycmlkZShwYXRoLCB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gb3ZlcnJpZGUgdG8gYSByZXNvdXJjZSBwcm9wZXJ0eS5cbiAgICpcbiAgICogU3ludGFjdGljIHN1Z2FyIGZvciBgYWRkT3ZlcnJpZGUoXCJQcm9wZXJ0aWVzLjwuLi4+XCIsIHZhbHVlKWAuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wZXJ0eVBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5XG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWVcbiAgICovXG4gIHB1YmxpYyBhZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BlcnR5UGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5hZGRPdmVycmlkZShgUHJvcGVydGllcy4ke3Byb3BlcnR5UGF0aH1gLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBvdmVycmlkZSB0aGF0IGRlbGV0ZXMgdGhlIHZhbHVlIG9mIGEgcHJvcGVydHkgZnJvbSB0aGUgcmVzb3VyY2UgZGVmaW5pdGlvbi5cbiAgICogQHBhcmFtIHByb3BlcnR5UGF0aCBUaGUgcGF0aCB0byB0aGUgcHJvcGVydHkuXG4gICAqL1xuICBwdWJsaWMgYWRkUHJvcGVydHlEZWxldGlvbk92ZXJyaWRlKHByb3BlcnR5UGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BlcnR5UGF0aCwgdW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhhdCB0aGlzIHJlc291cmNlIGRlcGVuZHMgb24gYW5vdGhlciByZXNvdXJjZSBhbmQgY2Fubm90IGJlXG4gICAqIHByb3Zpc2lvbmVkIHVubGVzcyB0aGUgb3RoZXIgcmVzb3VyY2UgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHByb3Zpc2lvbmVkLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYWRkRGVwZW5kZW5jeVxuICAgKi9cbiAgcHVibGljIGFkZERlcGVuZHNPbih0YXJnZXQ6IENmblJlc291cmNlKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkRGVwZW5kZW5jeSh0YXJnZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB0aGF0IHRoaXMgcmVzb3VyY2UgZGVwZW5kcyBvbiBhbm90aGVyIHJlc291cmNlIGFuZCBjYW5ub3QgYmVcbiAgICogcHJvdmlzaW9uZWQgdW5sZXNzIHRoZSBvdGhlciByZXNvdXJjZSBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgcHJvdmlzaW9uZWQuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgZm9yIHJlc291cmNlcyBhY3Jvc3Mgc3RhY2tzIChvciBuZXN0ZWQgc3RhY2spIGJvdW5kYXJpZXNcbiAgICogYW5kIHRoZSBkZXBlbmRlbmN5IHdpbGwgYXV0b21hdGljYWxseSBiZSB0cmFuc2ZlcnJlZCB0byB0aGUgcmVsZXZhbnQgc2NvcGUuXG4gICAqL1xuICBwdWJsaWMgYWRkRGVwZW5kZW5jeSh0YXJnZXQ6IENmblJlc291cmNlKSB7XG4gICAgLy8gc2tpcCB0aGlzIGRlcGVuZGVuY3kgaWYgdGhlIHRhcmdldCBpcyBub3QgcGFydCBvZiB0aGUgb3V0cHV0XG4gICAgaWYgKCF0YXJnZXQuc2hvdWxkU3ludGhlc2l6ZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYWRkRGVwZW5kZW5jeSh0aGlzLCB0YXJnZXQsIGB7JHt0aGlzLm5vZGUucGF0aH19LmFkZERlcGVuZGVuY3koeyR7dGFyZ2V0Lm5vZGUucGF0aH19KWApO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB0aGF0IHRoaXMgcmVzb3VyY2Ugbm8gbG9uZ2VyIGRlcGVuZHMgb24gYW5vdGhlciByZXNvdXJjZS5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZCBmb3IgcmVzb3VyY2VzIGFjcm9zcyBzdGFja3MgKGluY2x1ZGluZyBuZXN0ZWQgc3RhY2tzKVxuICAgKiBhbmQgdGhlIGRlcGVuZGVuY3kgd2lsbCBhdXRvbWF0aWNhbGx5IGJlIHJlbW92ZWQgZnJvbSB0aGUgcmVsZXZhbnQgc2NvcGUuXG4gICAqL1xuICBwdWJsaWMgcmVtb3ZlRGVwZW5kZW5jeSh0YXJnZXQ6IENmblJlc291cmNlKSA6IHZvaWQge1xuICAgIC8vIHNraXAgdGhpcyBkZXBlbmRlbmN5IGlmIHRoZSB0YXJnZXQgaXMgbm90IHBhcnQgb2YgdGhlIG91dHB1dFxuICAgIGlmICghdGFyZ2V0LnNob3VsZFN5bnRoZXNpemUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJlbW92ZURlcGVuZGVuY3kodGhpcywgdGFyZ2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYW4gYXJyYXkgb2YgcmVzb3VyY2VzIHRoaXMgcmVzb3VyY2UgZGVwZW5kcyBvbi5cbiAgICpcbiAgICogVGhpcyBhc3NlbWJsZXMgZGVwZW5kZW5jaWVzIG9uIHJlc291cmNlcyBhY3Jvc3Mgc3RhY2tzIChpbmNsdWRpbmcgbmVzdGVkIHN0YWNrcylcbiAgICogYXV0b21hdGljYWxseS5cbiAgICovXG4gIHB1YmxpYyBvYnRhaW5EZXBlbmRlbmNpZXMoKSB7XG4gICAgcmV0dXJuIG9idGFpbkRlcGVuZGVuY2llcyh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlcyBvbmUgZGVwZW5kZW5jeSB3aXRoIGFub3RoZXIuXG4gICAqIEBwYXJhbSB0YXJnZXQgVGhlIGRlcGVuZGVuY3kgdG8gcmVwbGFjZVxuICAgKiBAcGFyYW0gbmV3VGFyZ2V0IFRoZSBuZXcgZGVwZW5kZW5jeSB0byBhZGRcbiAgICovXG4gIHB1YmxpYyByZXBsYWNlRGVwZW5kZW5jeSh0YXJnZXQ6IENmblJlc291cmNlLCBuZXdUYXJnZXQ6IENmblJlc291cmNlKSA6IHZvaWQge1xuICAgIGlmICh0aGlzLm9idGFpbkRlcGVuZGVuY2llcygpLmluY2x1ZGVzKHRhcmdldCkpIHtcbiAgICAgIHRoaXMucmVtb3ZlRGVwZW5kZW5jeSh0YXJnZXQpO1xuICAgICAgdGhpcy5hZGREZXBlbmRlbmN5KG5ld1RhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXCIke05vZGUub2YodGhpcykucGF0aH1cIiBkb2VzIG5vdCBkZXBlbmQgb24gXCIke05vZGUub2YodGFyZ2V0KS5wYXRofVwiYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHZhbHVlIHRvIHRoZSBDbG91ZEZvcm1hdGlvbiBSZXNvdXJjZSBNZXRhZGF0YVxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL21ldGFkYXRhLXNlY3Rpb24tc3RydWN0dXJlLmh0bWxcbiAgICpcbiAgICogTm90ZSB0aGF0IHRoaXMgaXMgYSBkaWZmZXJlbnQgc2V0IG9mIG1ldGFkYXRhIGZyb20gQ0RLIG5vZGUgbWV0YWRhdGE7IHRoaXNcbiAgICogbWV0YWRhdGEgZW5kcyB1cCBpbiB0aGUgc3RhY2sgdGVtcGxhdGUgdW5kZXIgdGhlIHJlc291cmNlLCB3aGVyZWFzIENES1xuICAgKiBub2RlIG1ldGFkYXRhIGVuZHMgdXAgaW4gdGhlIENsb3VkIEFzc2VtYmx5LlxuICAgKi9cbiAgcHVibGljIGFkZE1ldGFkYXRhKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgaWYgKCF0aGlzLmNmbk9wdGlvbnMubWV0YWRhdGEpIHtcbiAgICAgIHRoaXMuY2ZuT3B0aW9ucy5tZXRhZGF0YSA9IHt9O1xuICAgIH1cblxuICAgIHRoaXMuY2ZuT3B0aW9ucy5tZXRhZGF0YVtrZXldID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYSB2YWx1ZSB2YWx1ZSBmcm9tIHRoZSBDbG91ZEZvcm1hdGlvbiBSZXNvdXJjZSBNZXRhZGF0YVxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL21ldGFkYXRhLXNlY3Rpb24tc3RydWN0dXJlLmh0bWxcbiAgICpcbiAgICogTm90ZSB0aGF0IHRoaXMgaXMgYSBkaWZmZXJlbnQgc2V0IG9mIG1ldGFkYXRhIGZyb20gQ0RLIG5vZGUgbWV0YWRhdGE7IHRoaXNcbiAgICogbWV0YWRhdGEgZW5kcyB1cCBpbiB0aGUgc3RhY2sgdGVtcGxhdGUgdW5kZXIgdGhlIHJlc291cmNlLCB3aGVyZWFzIENES1xuICAgKiBub2RlIG1ldGFkYXRhIGVuZHMgdXAgaW4gdGhlIENsb3VkIEFzc2VtYmx5LlxuICAgKi9cbiAgcHVibGljIGdldE1ldGFkYXRhKGtleTogc3RyaW5nKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5jZm5PcHRpb25zLm1ldGFkYXRhPy5ba2V5XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHJlc291cmNlXG4gICAqL1xuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGAke3N1cGVyLnRvU3RyaW5nKCl9IFske3RoaXMuY2ZuUmVzb3VyY2VUeXBlfV1gO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBieSB0aGUgYGFkZERlcGVuZGVuY3lgIGhlbHBlciBmdW5jdGlvbiBpbiBvcmRlciB0byByZWFsaXplIGEgZGlyZWN0XG4gICAqIGRlcGVuZGVuY3kgYmV0d2VlbiB0d28gcmVzb3VyY2VzIHRoYXQgYXJlIGRpcmVjdGx5IGRlZmluZWQgaW4gdGhlIHNhbWVcbiAgICogc3RhY2tzLlxuICAgKlxuICAgKiBVc2UgYHJlc291cmNlLmFkZERlcGVuZGVuY3lgIHRvIGRlZmluZSB0aGUgZGVwZW5kZW5jeSBiZXR3ZWVuIHR3byByZXNvdXJjZXMsXG4gICAqIHdoaWNoIGFsc28gdGFrZXMgc3RhY2sgYm91bmRhcmllcyBpbnRvIGFjY291bnQuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9hZGRSZXNvdXJjZURlcGVuZGVuY3kodGFyZ2V0OiBDZm5SZXNvdXJjZSkge1xuICAgIHRoaXMuZGVwZW5kc09uLmFkZCh0YXJnZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIHNoYWxsb3cgY29weSBvZiBkZXBlbmRlbmNpZXMgYmV0d2VlbiB0aGlzIHJlc291cmNlIGFuZCBvdGhlciByZXNvdXJjZXNcbiAgICogaW4gdGhlIHNhbWUgc3RhY2suXG4gICAqL1xuICBwdWJsaWMgb2J0YWluUmVzb3VyY2VEZXBlbmRlbmNpZXMoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5kZXBlbmRzT24udmFsdWVzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGRlcGVuZGVuY3kgYmV0d2VlbiB0aGlzIHJlc291cmNlIGFuZCBvdGhlciByZXNvdXJjZXMgaW4gdGhlIHNhbWVcbiAgICogc3RhY2suXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9yZW1vdmVSZXNvdXJjZURlcGVuZGVuY3kodGFyZ2V0OiBDZm5SZXNvdXJjZSkge1xuICAgIHRoaXMuZGVwZW5kc09uLmRlbGV0ZSh0YXJnZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIENsb3VkRm9ybWF0aW9uIGZvciB0aGlzIHJlc291cmNlLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfdG9DbG91ZEZvcm1hdGlvbigpOiBvYmplY3Qge1xuICAgIGlmICghdGhpcy5zaG91bGRTeW50aGVzaXplKCkpIHtcbiAgICAgIHJldHVybiB7IH07XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJldCA9IHtcbiAgICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgICAgLy8gUG9zdC1SZXNvbHZlIG9wZXJhdGlvbiBzaW5jZSBvdGhlcndpc2UgZGVlcE1lcmdlIGlzIGdvaW5nIHRvIG1peCB2YWx1ZXMgaW50b1xuICAgICAgICAgIC8vIHRoZSBUb2tlbiBvYmplY3RzIHJldHVybmVkIGJ5IGlnbm9yZUVtcHR5LlxuICAgICAgICAgIFt0aGlzLmxvZ2ljYWxJZF06IG5ldyBQb3N0UmVzb2x2ZVRva2VuKHtcbiAgICAgICAgICAgIFR5cGU6IHRoaXMuY2ZuUmVzb3VyY2VUeXBlLFxuICAgICAgICAgICAgUHJvcGVydGllczogaWdub3JlRW1wdHkodGhpcy5jZm5Qcm9wZXJ0aWVzKSxcbiAgICAgICAgICAgIERlcGVuZHNPbjogaWdub3JlRW1wdHkocmVuZGVyRGVwZW5kc09uKHRoaXMuZGVwZW5kc09uKSksXG4gICAgICAgICAgICBDcmVhdGlvblBvbGljeTogY2FwaXRhbGl6ZVByb3BlcnR5TmFtZXModGhpcywgcmVuZGVyQ3JlYXRpb25Qb2xpY3kodGhpcy5jZm5PcHRpb25zLmNyZWF0aW9uUG9saWN5KSksXG4gICAgICAgICAgICBVcGRhdGVQb2xpY3k6IGNhcGl0YWxpemVQcm9wZXJ0eU5hbWVzKHRoaXMsIHRoaXMuY2ZuT3B0aW9ucy51cGRhdGVQb2xpY3kpLFxuICAgICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogY2FwaXRhbGl6ZVByb3BlcnR5TmFtZXModGhpcywgdGhpcy5jZm5PcHRpb25zLnVwZGF0ZVJlcGxhY2VQb2xpY3kpLFxuICAgICAgICAgICAgRGVsZXRpb25Qb2xpY3k6IGNhcGl0YWxpemVQcm9wZXJ0eU5hbWVzKHRoaXMsIHRoaXMuY2ZuT3B0aW9ucy5kZWxldGlvblBvbGljeSksXG4gICAgICAgICAgICBWZXJzaW9uOiB0aGlzLmNmbk9wdGlvbnMudmVyc2lvbixcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiB0aGlzLmNmbk9wdGlvbnMuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBNZXRhZGF0YTogaWdub3JlRW1wdHkodGhpcy5jZm5PcHRpb25zLm1ldGFkYXRhKSxcbiAgICAgICAgICAgIENvbmRpdGlvbjogdGhpcy5jZm5PcHRpb25zLmNvbmRpdGlvbiAmJiB0aGlzLmNmbk9wdGlvbnMuY29uZGl0aW9uLmxvZ2ljYWxJZCxcbiAgICAgICAgICB9LCByZXNvdXJjZURlZiA9PiB7XG4gICAgICAgICAgICBjb25zdCByZW5kZXJlZFByb3BzID0gdGhpcy5yZW5kZXJQcm9wZXJ0aWVzKHJlc291cmNlRGVmLlByb3BlcnRpZXMgfHwge30pO1xuICAgICAgICAgICAgaWYgKHJlbmRlcmVkUHJvcHMpIHtcbiAgICAgICAgICAgICAgY29uc3QgaGFzRGVmaW5lZCA9IE9iamVjdC52YWx1ZXMocmVuZGVyZWRQcm9wcykuZmluZCh2ID0+IHYgIT09IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgIHJlc291cmNlRGVmLlByb3BlcnRpZXMgPSBoYXNEZWZpbmVkICE9PSB1bmRlZmluZWQgPyByZW5kZXJlZFByb3BzIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVzb2x2ZWRSYXdPdmVycmlkZXMgPSBUb2tlbml6YXRpb24ucmVzb2x2ZSh0aGlzLnJhd092ZXJyaWRlcywge1xuICAgICAgICAgICAgICBzY29wZTogdGhpcyxcbiAgICAgICAgICAgICAgcmVzb2x2ZXI6IENMT1VERk9STUFUSU9OX1RPS0VOX1JFU09MVkVSLFxuICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRvIHByZXNlcnZlIHRoZSBlbXB0eSBlbGVtZW50cyBoZXJlLFxuICAgICAgICAgICAgICAvLyBhcyB0aGF0J3MgaG93IHJlbW92aW5nIG92ZXJyaWRlcyBhcmUgcmVwcmVzZW50ZWQgYXNcbiAgICAgICAgICAgICAgcmVtb3ZlRW1wdHk6IGZhbHNlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVlcE1lcmdlKHJlc291cmNlRGVmLCByZXNvbHZlZFJhd092ZXJyaWRlcyk7XG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIC8vIENoYW5nZSBtZXNzYWdlXG4gICAgICBlLm1lc3NhZ2UgPSBgV2hpbGUgc3ludGhlc2l6aW5nICR7dGhpcy5ub2RlLnBhdGh9OiAke2UubWVzc2FnZX1gO1xuICAgICAgLy8gQWRqdXN0IHN0YWNrIHRyYWNlIChtYWtlIGl0IGxvb2sgbGlrZSBub2RlIGJ1aWx0IGl0LCB0b28uLi4pXG4gICAgICBjb25zdCB0cmFjZSA9IHRoaXMuY3JlYXRpb25TdGFjaztcbiAgICAgIGlmICh0cmFjZSkge1xuICAgICAgICBjb25zdCBjcmVhdGlvblN0YWNrID0gWyctLS0gcmVzb3VyY2UgY3JlYXRlZCBhdCAtLS0nLCAuLi50cmFjZV0uam9pbignXFxuICBhdCAnKTtcbiAgICAgICAgY29uc3QgcHJvYmxlbVRyYWNlID0gZS5zdGFjay5zbGljZShlLnN0YWNrLmluZGV4T2YoZS5tZXNzYWdlKSArIGUubWVzc2FnZS5sZW5ndGgpO1xuICAgICAgICBlLnN0YWNrID0gYCR7ZS5tZXNzYWdlfVxcbiAgJHtjcmVhdGlvblN0YWNrfVxcbiAgLS0tIHByb2JsZW0gZGlzY292ZXJlZCBhdCAtLS0ke3Byb2JsZW1UcmFjZX1gO1xuICAgICAgfVxuXG4gICAgICAvLyBSZS10aHJvd1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIHRoZSBzZXQgb2YgbG9naWNhbCBJRCAodG9rZW5zKSB0aGlzIHJlc291cmNlIGRlcGVuZHMgb25cbiAgICAvLyBzb3J0ZWQgYnkgY29uc3RydWN0IHBhdGhzIHRvIGVuc3VyZSB0ZXN0IGRldGVybWluaXNtXG4gICAgZnVuY3Rpb24gcmVuZGVyRGVwZW5kc09uKGRlcGVuZHNPbjogU2V0PENmblJlc291cmNlPikge1xuICAgICAgcmV0dXJuIEFycmF5XG4gICAgICAgIC5mcm9tKGRlcGVuZHNPbilcbiAgICAgICAgLnNvcnQoKHgsIHkpID0+IHgubm9kZS5wYXRoLmxvY2FsZUNvbXBhcmUoeS5ub2RlLnBhdGgpKVxuICAgICAgICAubWFwKHIgPT4gci5sb2dpY2FsSWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlckNyZWF0aW9uUG9saWN5KHBvbGljeTogQ2ZuQ3JlYXRpb25Qb2xpY3kgfCB1bmRlZmluZWQpOiBhbnkge1xuICAgICAgaWYgKCFwb2xpY3kpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgICAgY29uc3QgcmVzdWx0OiBhbnkgPSB7IC4uLnBvbGljeSB9O1xuICAgICAgaWYgKHBvbGljeS5yZXNvdXJjZVNpZ25hbCAmJiBwb2xpY3kucmVzb3VyY2VTaWduYWwudGltZW91dCkge1xuICAgICAgICByZXN1bHQucmVzb3VyY2VTaWduYWwgPSBwb2xpY3kucmVzb3VyY2VTaWduYWw7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgICBjb25zdCBwcm9wcyA9IHRoaXMuX2NmblByb3BlcnRpZXMgfHwge307XG4gICAgaWYgKFRhZ01hbmFnZXIuaXNUYWdnYWJsZSh0aGlzKSkge1xuICAgICAgY29uc3QgdGFnc1Byb3A6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcbiAgICAgIHRhZ3NQcm9wW3RoaXMudGFncy50YWdQcm9wZXJ0eU5hbWVdID0gdGhpcy50YWdzLnJlbmRlclRhZ3MoKTtcbiAgICAgIHJldHVybiBkZWVwTWVyZ2UocHJvcHMsIHRhZ3NQcm9wKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgLyoqXG4gICAqIERlcHJlY2F0ZWRcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGB1cGRhdGVkUHJvcGVydGllc2BcbiAgICpcbiAgICogUmV0dXJuIHByb3BlcnRpZXMgbW9kaWZpZWQgYWZ0ZXIgaW5pdGlhdGlvblxuICAgKlxuICAgKiBSZXNvdXJjZXMgdGhhdCBleHBvc2UgbXV0YWJsZSBwcm9wZXJ0aWVzIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uIHRvXG4gICAqIGNvbGxlY3QgYW5kIHJldHVybiB0aGUgcHJvcGVydGllcyBvYmplY3QgZm9yIHRoaXMgcmVzb3VyY2UuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0IHVwZGF0ZWRQcm9wZXJpdGVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWRQcm9wZXJ0aWVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBwcm9wZXJ0aWVzIG1vZGlmaWVkIGFmdGVyIGluaXRpYXRpb25cbiAgICpcbiAgICogUmVzb3VyY2VzIHRoYXQgZXhwb3NlIG11dGFibGUgcHJvcGVydGllcyBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvbiB0b1xuICAgKiBjb2xsZWN0IGFuZCByZXR1cm4gdGhlIHByb3BlcnRpZXMgb2JqZWN0IGZvciB0aGlzIHJlc291cmNlLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldCB1cGRhdGVkUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgICByZXR1cm4gdGhpcy5fY2ZuUHJvcGVydGllcztcbiAgfVxuXG4gIHByb3RlY3RlZCB2YWxpZGF0ZVByb3BlcnRpZXMoX3Byb3BlcnRpZXM6IGFueSkge1xuICAgIC8vIE5vdGhpbmdcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW4gYmUgb3ZlcnJpZGRlbiBieSBzdWJjbGFzc2VzIHRvIGRldGVybWluZSBpZiB0aGlzIHJlc291cmNlIHdpbGwgYmUgcmVuZGVyZWRcbiAgICogaW50byB0aGUgY2xvdWRmb3JtYXRpb24gdGVtcGxhdGUuXG4gICAqXG4gICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgcmVzb3VyY2Ugc2hvdWxkIGJlIGluY2x1ZGVkIG9yIGBmYWxzZWAgaXMgdGhlIHJlc291cmNlXG4gICAqIHNob3VsZCBiZSBvbWl0dGVkLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNob3VsZFN5bnRoZXNpemUoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGVudW0gVGFnVHlwZSB7XG4gIFNUQU5EQVJEID0gJ1N0YW5kYXJkVGFnJyxcbiAgQVVUT1NDQUxJTkdfR1JPVVAgPSAnQXV0b1NjYWxpbmdHcm91cFRhZycsXG4gIE1BUCA9ICdTdHJpbmdUb1N0cmluZ01hcCcsXG4gIEtFWV9WQUxVRSA9ICdLZXlWYWx1ZScsXG4gIE5PVF9UQUdHQUJMRSA9ICdOb3RUYWdnYWJsZScsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNmblJlc291cmNlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBIGNvbmRpdGlvbiB0byBhc3NvY2lhdGUgd2l0aCB0aGlzIHJlc291cmNlLiBUaGlzIG1lYW5zIHRoYXQgb25seSBpZiB0aGUgY29uZGl0aW9uIGV2YWx1YXRlcyB0byAndHJ1ZScgd2hlbiB0aGUgc3RhY2tcbiAgICogaXMgZGVwbG95ZWQsIHRoZSByZXNvdXJjZSB3aWxsIGJlIGluY2x1ZGVkLiBUaGlzIGlzIHByb3ZpZGVkIHRvIGFsbG93IENESyBwcm9qZWN0cyB0byBwcm9kdWNlIGxlZ2FjeSB0ZW1wbGF0ZXMsIGJ1dCBub3JtYWxseVxuICAgKiB0aGVyZSBpcyBubyBuZWVkIHRvIHVzZSBpdCBpbiBDREsgcHJvamVjdHMuXG4gICAqL1xuICBjb25kaXRpb24/OiBDZm5Db25kaXRpb247XG5cbiAgLyoqXG4gICAqIEFzc29jaWF0ZSB0aGUgQ3JlYXRpb25Qb2xpY3kgYXR0cmlidXRlIHdpdGggYSByZXNvdXJjZSB0byBwcmV2ZW50IGl0cyBzdGF0dXMgZnJvbSByZWFjaGluZyBjcmVhdGUgY29tcGxldGUgdW50aWxcbiAgICogQVdTIENsb3VkRm9ybWF0aW9uIHJlY2VpdmVzIGEgc3BlY2lmaWVkIG51bWJlciBvZiBzdWNjZXNzIHNpZ25hbHMgb3IgdGhlIHRpbWVvdXQgcGVyaW9kIGlzIGV4Y2VlZGVkLiBUbyBzaWduYWwgYVxuICAgKiByZXNvdXJjZSwgeW91IGNhbiB1c2UgdGhlIGNmbi1zaWduYWwgaGVscGVyIHNjcmlwdCBvciBTaWduYWxSZXNvdXJjZSBBUEkuIEFXUyBDbG91ZEZvcm1hdGlvbiBwdWJsaXNoZXMgdmFsaWQgc2lnbmFsc1xuICAgKiB0byB0aGUgc3RhY2sgZXZlbnRzIHNvIHRoYXQgeW91IHRyYWNrIHRoZSBudW1iZXIgb2Ygc2lnbmFscyBzZW50LlxuICAgKi9cbiAgY3JlYXRpb25Qb2xpY3k/OiBDZm5DcmVhdGlvblBvbGljeTtcblxuICAvKipcbiAgICogV2l0aCB0aGUgRGVsZXRpb25Qb2xpY3kgYXR0cmlidXRlIHlvdSBjYW4gcHJlc2VydmUgb3IgKGluIHNvbWUgY2FzZXMpIGJhY2t1cCBhIHJlc291cmNlIHdoZW4gaXRzIHN0YWNrIGlzIGRlbGV0ZWQuXG4gICAqIFlvdSBzcGVjaWZ5IGEgRGVsZXRpb25Qb2xpY3kgYXR0cmlidXRlIGZvciBlYWNoIHJlc291cmNlIHRoYXQgeW91IHdhbnQgdG8gY29udHJvbC4gSWYgYSByZXNvdXJjZSBoYXMgbm8gRGVsZXRpb25Qb2xpY3lcbiAgICogYXR0cmlidXRlLCBBV1MgQ2xvdWRGb3JtYXRpb24gZGVsZXRlcyB0aGUgcmVzb3VyY2UgYnkgZGVmYXVsdC4gTm90ZSB0aGF0IHRoaXMgY2FwYWJpbGl0eSBhbHNvIGFwcGxpZXMgdG8gdXBkYXRlIG9wZXJhdGlvbnNcbiAgICogdGhhdCBsZWFkIHRvIHJlc291cmNlcyBiZWluZyByZW1vdmVkLlxuICAgKi9cbiAgZGVsZXRpb25Qb2xpY3k/OiBDZm5EZWxldGlvblBvbGljeTtcblxuICAvKipcbiAgICogVXNlIHRoZSBVcGRhdGVQb2xpY3kgYXR0cmlidXRlIHRvIHNwZWNpZnkgaG93IEFXUyBDbG91ZEZvcm1hdGlvbiBoYW5kbGVzIHVwZGF0ZXMgdG8gdGhlIEFXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXBcbiAgICogcmVzb3VyY2UuIEFXUyBDbG91ZEZvcm1hdGlvbiBpbnZva2VzIG9uZSBvZiB0aHJlZSB1cGRhdGUgcG9saWNpZXMgZGVwZW5kaW5nIG9uIHRoZSB0eXBlIG9mIGNoYW5nZSB5b3UgbWFrZSBvciB3aGV0aGVyIGFcbiAgICogc2NoZWR1bGVkIGFjdGlvbiBpcyBhc3NvY2lhdGVkIHdpdGggdGhlIEF1dG8gU2NhbGluZyBncm91cC5cbiAgICovXG4gIHVwZGF0ZVBvbGljeT86IENmblVwZGF0ZVBvbGljeTtcblxuICAvKipcbiAgICogVXNlIHRoZSBVcGRhdGVSZXBsYWNlUG9saWN5IGF0dHJpYnV0ZSB0byByZXRhaW4gb3IgKGluIHNvbWUgY2FzZXMpIGJhY2t1cCB0aGUgZXhpc3RpbmcgcGh5c2ljYWwgaW5zdGFuY2Ugb2YgYSByZXNvdXJjZVxuICAgKiB3aGVuIGl0IGlzIHJlcGxhY2VkIGR1cmluZyBhIHN0YWNrIHVwZGF0ZSBvcGVyYXRpb24uXG4gICAqL1xuICB1cGRhdGVSZXBsYWNlUG9saWN5PzogQ2ZuRGVsZXRpb25Qb2xpY3k7XG5cbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAqIFVzZWQgb25seSBmb3IgY3VzdG9tIENsb3VkRm9ybWF0aW9uIHJlc291cmNlcy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtY2ZuLWN1c3RvbXJlc291cmNlLmh0bWxcbiAgICovXG4gIHZlcnNpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGlzIHJlc291cmNlLlxuICAgKiBVc2VkIGZvciBpbmZvcm1hdGlvbmFsIHB1cnBvc2VzIG9ubHksIGlzIG5vdCBwcm9jZXNzZWQgaW4gYW55IHdheVxuICAgKiAoYW5kIHN0YXlzIHdpdGggdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlLCBpcyBub3QgcGFzc2VkIHRvIHRoZSB1bmRlcmx5aW5nIHJlc291cmNlLFxuICAgKiBldmVuIGlmIGl0IGRvZXMgaGF2ZSBhICdkZXNjcmlwdGlvbicgcHJvcGVydHkpLlxuICAgKi9cbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE1ldGFkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UuIFRoaXMgaXMgbm90IHRoZSBzYW1lIGFzIHRoZSBjb25zdHJ1Y3QgbWV0YWRhdGEgd2hpY2ggY2FuIGJlIGFkZGVkXG4gICAqIHVzaW5nIGNvbnN0cnVjdC5hZGRNZXRhZGF0YSgpLCBidXQgd291bGQgbm90IGFwcGVhciBpbiB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgYXV0b21hdGljYWxseS5cbiAgICovXG4gIG1ldGFkYXRhPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcbn1cblxuLyoqXG4gKiBPYmplY3Qga2V5cyB0aGF0IGRlZXBNZXJnZSBzaG91bGQgbm90IGNvbnNpZGVyLiBDdXJyZW50bHkgdGhlc2UgaW5jbHVkZVxuICogQ2xvdWRGb3JtYXRpb24gaW50cmluc2ljc1xuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvaW50cmluc2ljLWZ1bmN0aW9uLXJlZmVyZW5jZS5odG1sXG4gKi9cblxuY29uc3QgTUVSR0VfRVhDTFVERV9LRVlTOiBzdHJpbmdbXSA9IFtcbiAgJ1JlZicsXG4gICdGbjo6QmFzZTY0JyxcbiAgJ0ZuOjpDaWRyJyxcbiAgJ0ZuOjpGaW5kSW5NYXAnLFxuICAnRm46OkdldEF0dCcsXG4gICdGbjo6R2V0QVpzJyxcbiAgJ0ZuOjpJbXBvcnRWYWx1ZScsXG4gICdGbjo6Sm9pbicsXG4gICdGbjo6U2VsZWN0JyxcbiAgJ0ZuOjpTcGxpdCcsXG4gICdGbjo6U3ViJyxcbiAgJ0ZuOjpUcmFuc2Zvcm0nLFxuICAnRm46OkFuZCcsXG4gICdGbjo6RXF1YWxzJyxcbiAgJ0ZuOjpJZicsXG4gICdGbjo6Tm90JyxcbiAgJ0ZuOjpPcicsXG5dO1xuXG4vKipcbiAqIE1lcmdlcyBgc291cmNlYCBpbnRvIGB0YXJnZXRgLCBvdmVycmlkaW5nIGFueSBleGlzdGluZyB2YWx1ZXMuXG4gKiBgbnVsbGBzIHdpbGwgY2F1c2UgYSB2YWx1ZSB0byBiZSBkZWxldGVkLlxuICovXG5mdW5jdGlvbiBkZWVwTWVyZ2UodGFyZ2V0OiBhbnksIC4uLnNvdXJjZXM6IGFueVtdKSB7XG4gIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICBpZiAodHlwZW9mKHNvdXJjZSkgIT09ICdvYmplY3QnIHx8IHR5cGVvZih0YXJnZXQpICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHVzYWdlLiBCb3RoIHNvdXJjZSAoJHtKU09OLnN0cmluZ2lmeShzb3VyY2UpfSkgYW5kIHRhcmdldCAoJHtKU09OLnN0cmluZ2lmeSh0YXJnZXQpfSkgbXVzdCBiZSBvYmplY3RzYCk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc291cmNlKSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBzb3VyY2Vba2V5XTtcbiAgICAgIGlmICh0eXBlb2YodmFsdWUpID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPSBudWxsICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAvLyBpZiB0aGUgdmFsdWUgYXQgdGhlIHRhcmdldCBpcyBub3QgYW4gb2JqZWN0LCBvdmVycmlkZSBpdCB3aXRoIGFuXG4gICAgICAgIC8vIG9iamVjdCBzbyB3ZSBjYW4gY29udGludWUgdGhlIHJlY3Vyc2lvblxuICAgICAgICBpZiAodHlwZW9mKHRhcmdldFtrZXldKSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHt9O1xuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogSWYgd2UgaGF2ZSBzb21ldGhpbmcgdGhhdCBsb29rcyBsaWtlOlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogICB0YXJnZXQ6IHsgVHlwZTogJ015UmVzb3VyY2VUeXBlJywgUHJvcGVydGllczogeyBwcm9wMTogeyBSZWY6ICdQYXJhbScgfSB9IH1cbiAgICAgICAgICAgKiAgIHNvdXJjZXM6IFsgeyBQcm9wZXJ0aWVzOiB7IHByb3AxOiBbICdGbjo6Sm9pbic6IFsnLScsICdoZWxsbycsICd3b3JsZCddIF0gfSB9IF1cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEV2ZW50dWFsbHkgd2Ugd2lsbCBnZXQgdG8gdGhlIHBvaW50IHdoZXJlIHdlIGhhdmVcbiAgICAgICAgICAgKlxuICAgICAgICAgICAqICAgdGFyZ2V0OiB7IHByb3AxOiB7IFJlZjogJ1BhcmFtJyB9IH1cbiAgICAgICAgICAgKiAgIHNvdXJjZXM6IFsgeyBwcm9wMTogeyAnRm46OkpvaW4nOiBbJy0nLCAnaGVsbG8nLCAnd29ybGQnXSB9IH0gXVxuICAgICAgICAgICAqXG4gICAgICAgICAgICogV2UgbmVlZCB0byByZWN1cnNlIDEgbW9yZSB0aW1lLCBidXQgaWYgd2UgZG8gd2Ugd2lsbCBlbmQgdXAgd2l0aFxuICAgICAgICAgICAqICAgeyBwcm9wMTogeyBSZWY6ICdQYXJhbScsICdGbjo6Sm9pbic6IFsnLScsICdoZWxsbycsICd3b3JsZCddIH0gfVxuICAgICAgICAgICAqIHdoaWNoIGlzIG5vdCB3aGF0IHdlIHdhbnQuXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBJbnN0ZWFkIHdlIGNoZWNrIHRvIHNlZSB3aGV0aGVyIHRoZSBgdGFyZ2V0YCB2YWx1ZSAoaS5lLiB0YXJnZXQucHJvcDEpXG4gICAgICAgICAgICogaXMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBrZXkgdGhhdCB3ZSBkb24ndCB3YW50IHRvIHJlY3Vyc2Ugb24uIElmIGl0IGRvZXNcbiAgICAgICAgICAgKiB0aGVuIHdlIGVzc2VudGlhbGx5IGRyb3AgaXQgYW5kIGVuZCB1cCB3aXRoOlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogICB7IHByb3AxOiB7ICdGbjo6Sm9pbic6IFsnLScsICdoZWxsbycsICd3b3JsZCddIH0gfVxuICAgICAgICAgICAqL1xuICAgICAgICB9IGVsc2UgaWYgKE9iamVjdC5rZXlzKHRhcmdldFtrZXldKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBpZiAoTUVSR0VfRVhDTFVERV9LRVlTLmluY2x1ZGVzKE9iamVjdC5rZXlzKHRhcmdldFtrZXldKVswXSkpIHtcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0ge307XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZXJlIG1pZ2h0IGFsc28gYmUgdGhlIGNhc2Ugd2hlcmUgdGhlIHNvdXJjZSBpcyBhbiBpbnRyaW5zaWNcbiAgICAgICAgICpcbiAgICAgICAgICogICAgdGFyZ2V0OiB7XG4gICAgICAgICAqICAgICAgVHlwZTogJ015UmVzb3VyY2VUeXBlJyxcbiAgICAgICAgICogICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAqICAgICAgICBwcm9wMTogeyBzdWJwcm9wOiB7IG5hbWU6IHsgJ0ZuOjpHZXRBdHQnOiAnYWJjJyB9IH0gfVxuICAgICAgICAgKiAgICAgIH1cbiAgICAgICAgICogICAgfVxuICAgICAgICAgKiAgICBzb3VyY2VzOiBbIHtcbiAgICAgICAgICogICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAqICAgICAgICBwcm9wMTogeyBzdWJwcm9wOiB7ICdGbjo6SWYnOiBbJ1NvbWVDb25kaXRpb24nLCB7Li4ufSwgey4uLn1dIH19XG4gICAgICAgICAqICAgICAgfVxuICAgICAgICAgKiAgICB9IF1cbiAgICAgICAgICpcbiAgICAgICAgICogV2UgZW5kIHVwIGluIGEgcGxhY2UgdGhhdCBpcyB0aGUgcmV2ZXJzZSBvZiB0aGUgYWJvdmUgY2hlY2ssIHRoZSBzb3VyY2VcbiAgICAgICAgICogYmVjb21lcyBhbiBpbnRyaW5zaWMgYmVmb3JlIHRoZSB0YXJnZXRcbiAgICAgICAgICpcbiAgICAgICAgICogICB0YXJnZXQ6IHsgc3VicHJvcDogeyBuYW1lOiB7ICdGbjo6R2V0QXR0JzogJ2FiYycgfSB9IH1cbiAgICAgICAgICogICBzb3VyY2VzOiBbe1xuICAgICAgICAgKiAgICAgJ0ZuOjpJZic6IFsgJ015Q29uZGl0aW9uJywgey4uLn0sIHsuLi59IF1cbiAgICAgICAgICogICB9XVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBpZiAoTUVSR0VfRVhDTFVERV9LRVlTLmluY2x1ZGVzKE9iamVjdC5rZXlzKHZhbHVlKVswXSkpIHtcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0ge307XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZGVlcE1lcmdlKHRhcmdldFtrZXldLCB2YWx1ZSk7XG5cbiAgICAgICAgLy8gaWYgdGhlIHJlc3VsdCBvZiB0aGUgbWVyZ2UgaXMgYW4gZW1wdHkgb2JqZWN0LCBpdCdzIGJlY2F1c2UgdGhlXG4gICAgICAgIC8vIGV2ZW50dWFsIHZhbHVlIHdlIGFzc2lnbmVkIGlzIGB1bmRlZmluZWRgLCBhbmQgdGhlcmUgYXJlIG5vXG4gICAgICAgIC8vIHNpYmxpbmcgY29uY3JldGUgdmFsdWVzIGFsb25nc2lkZSwgc28gd2UgY2FuIGRlbGV0ZSB0aGlzIHRyZWUuXG4gICAgICAgIGNvbnN0IG91dHB1dCA9IHRhcmdldFtrZXldO1xuICAgICAgICBpZiAodHlwZW9mKG91dHB1dCkgPT09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKG91dHB1dCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgZGVsZXRlIHRhcmdldFtrZXldO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGVsZXRlIHRhcmdldFtrZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG4vKipcbiAqIFNwbGl0IG9uIHBlcmlvZHMgd2hpbGUgcHJvY2Vzc2luZyBlc2NhcGUgY2hhcmFjdGVycyBcXFxuICovXG5mdW5jdGlvbiBzcGxpdE9uUGVyaW9kcyh4OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIC8vIEJ1aWxkIHRoaXMgbGlzdCBpbiByZXZlcnNlIGJlY2F1c2UgaXQncyBtb3JlIGNvbnZlbmllbnQgdG8gZ2V0IHRoZSBcImN1cnJlbnRcIlxuICAvLyBpdGVtIGJ5IGRvaW5nIHJldFswXSB0aGFuIGJ5IHJldFtyZXQubGVuZ3RoIC0gMV0uXG4gIGNvbnN0IHJldCA9IFsnJ107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgIGlmICh4W2ldID09PSAnXFxcXCcgJiYgaSArIDEgPCB4Lmxlbmd0aCkge1xuICAgICAgcmV0WzBdICs9IHhbaSArIDFdO1xuICAgICAgaSsrO1xuICAgIH0gZWxzZSBpZiAoeFtpXSA9PT0gJy4nKSB7XG4gICAgICByZXQudW5zaGlmdCgnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldFswXSArPSB4W2ldO1xuICAgIH1cbiAgfVxuXG4gIHJldC5yZXZlcnNlKCk7XG4gIHJldHVybiByZXQ7XG59XG4iXX0=