"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootPathTo = exports.Stack = exports.STACK_RESOURCE_LIMIT_CONTEXT = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const minimatch = require("minimatch");
const annotations_1 = require("./annotations");
const app_1 = require("./app");
const arn_1 = require("./arn");
const aspect_1 = require("./aspect");
const cfn_element_1 = require("./cfn-element");
const cfn_fn_1 = require("./cfn-fn");
const cfn_pseudo_1 = require("./cfn-pseudo");
const cfn_resource_1 = require("./cfn-resource");
const context_provider_1 = require("./context-provider");
const feature_flags_1 = require("./feature-flags");
const permissions_boundary_1 = require("./permissions-boundary");
const cloudformation_lang_1 = require("./private/cloudformation-lang");
const logical_id_1 = require("./private/logical-id");
const resolve_1 = require("./private/resolve");
const uniqueid_1 = require("./private/uniqueid");
const STACK_SYMBOL = Symbol.for('@aws-cdk/core.Stack');
const MY_STACK_CACHE = Symbol.for('@aws-cdk/core.Stack.myStack');
exports.STACK_RESOURCE_LIMIT_CONTEXT = '@aws-cdk/core:stackResourceLimit';
const VALID_STACK_NAME_REGEX = /^[A-Za-z][A-Za-z0-9-]*$/;
const MAX_RESOURCES = 500;
const STRING_LIST_REFERENCE_DELIMITER = '||';
/**
 * A root construct which represents a single CloudFormation stack.
 */
class Stack extends constructs_1.Construct {
    /**
     * Return whether the given object is a Stack.
     *
     * We do attribute detection since we can't reliably use 'instanceof'.
     */
    static isStack(x) {
        return x !== null && typeof (x) === 'object' && STACK_SYMBOL in x;
    }
    /**
     * Looks up the first stack scope in which `construct` is defined. Fails if there is no stack up the tree.
     * @param construct The construct to start the search from.
     */
    static of(construct) {
        // we want this to be as cheap as possible. cache this result by mutating
        // the object. anecdotally, at the time of this writing, @aws-cdk/core unit
        // tests hit this cache 1,112 times, @aws-cdk/aws-cloudformation unit tests
        // hit this 2,435 times).
        const cache = construct[MY_STACK_CACHE];
        if (cache) {
            return cache;
        }
        else {
            const value = _lookup(construct);
            Object.defineProperty(construct, MY_STACK_CACHE, {
                enumerable: false,
                writable: false,
                configurable: false,
                value,
            });
            return value;
        }
        function _lookup(c) {
            if (Stack.isStack(c)) {
                return c;
            }
            const _scope = constructs_1.Node.of(c).scope;
            if (stage_1.Stage.isStage(c) || !_scope) {
                throw new Error(`${construct.constructor?.name ?? 'Construct'} at '${constructs_1.Node.of(construct).path}' should be created in the scope of a Stack, but no Stack found`);
            }
            return _lookup(_scope);
        }
    }
    /**
     * Creates a new stack.
     *
     * @param scope Parent of this stack, usually an `App` or a `Stage`, but could be any construct.
     * @param id The construct ID of this stack. If `stackName` is not explicitly
     * defined, this id (and any parent IDs) will be used to determine the
     * physical ID of the stack.
     * @param props Stack properties.
     */
    constructor(scope, id, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_StackProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Stack);
            }
            throw error;
        }
        // For unit test scope and id are optional for stacks, but we still want an App
        // as the parent because apps implement much of the synthesis logic.
        scope = scope ?? new app_1.App({
            autoSynth: false,
            outdir: fs_1.FileSystem.mkdtemp('cdk-test-app-'),
        });
        // "Default" is a "hidden id" from a `node.uniqueId` perspective
        id = id ?? 'Default';
        super(scope, id);
        this._missingContext = new Array();
        this._stackDependencies = {};
        this.templateOptions = {};
        this._crossRegionReferences = !!props.crossRegionReferences;
        Object.defineProperty(this, STACK_SYMBOL, { value: true });
        this._logicalIds = new logical_id_1.LogicalIDs();
        const { account, region, environment } = this.parseEnvironment(props.env);
        this.account = account;
        this.region = region;
        this.environment = environment;
        this.terminationProtection = props.terminationProtection;
        if (props.description !== undefined) {
            // Max length 1024 bytes
            // Typically 2 bytes per character, may be more for more exotic characters
            if (props.description.length > 512) {
                throw new Error(`Stack description must be <= 1024 bytes. Received description: '${props.description}'`);
            }
            this.templateOptions.description = props.description;
        }
        this._stackName = props.stackName ?? this.generateStackName();
        if (this._stackName.length > 128) {
            throw new Error(`Stack name must be <= 128 characters. Stack name: '${this._stackName}'`);
        }
        this.tags = new tag_manager_1.TagManager(cfn_resource_1.TagType.KEY_VALUE, 'aws:cdk:stack', props.tags);
        if (!VALID_STACK_NAME_REGEX.test(this.stackName)) {
            throw new Error(`Stack name must match the regular expression: ${VALID_STACK_NAME_REGEX.toString()}, got '${this.stackName}'`);
        }
        // the preferred behavior is to generate a unique id for this stack and use
        // it as the artifact ID in the assembly. this allows multiple stacks to use
        // the same name. however, this behavior is breaking for 1.x so it's only
        // applied under a feature flag which is applied automatically for new
        // projects created using `cdk init`.
        //
        // Also use the new behavior if we are using the new CI/CD-ready synthesizer; that way
        // people only have to flip one flag.
        const featureFlags = feature_flags_1.FeatureFlags.of(this);
        const stackNameDupeContext = featureFlags.isEnabled(cxapi.ENABLE_STACK_NAME_DUPLICATES_CONTEXT);
        const newStyleSynthesisContext = featureFlags.isEnabled(cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT);
        this.artifactId = (stackNameDupeContext || newStyleSynthesisContext)
            ? this.generateStackArtifactId()
            : this.stackName;
        this.templateFile = `${this.artifactId}.template.json`;
        // Not for nested stacks
        this._versionReportingEnabled = (props.analyticsReporting ?? this.node.tryGetContext(cxapi.ANALYTICS_REPORTING_ENABLED_CONTEXT))
            && !this.nestedStackParent;
        const synthesizer = (props.synthesizer
            ?? this.node.tryGetContext(private_context_1.PRIVATE_CONTEXT_DEFAULT_STACK_SYNTHESIZER)
            ?? (newStyleSynthesisContext ? new stack_synthesizers_1.DefaultStackSynthesizer() : new stack_synthesizers_1.LegacyStackSynthesizer()));
        if ((0, stack_synthesizers_1.isReusableStackSynthesizer)(synthesizer)) {
            // Produce a fresh instance for each stack (should have been the default behavior)
            this.synthesizer = synthesizer.reusableBind(this);
        }
        else {
            // Bind the single instance in-place to the current stack (backwards compat)
            this.synthesizer = synthesizer;
            this.synthesizer.bind(this);
        }
        props.permissionsBoundary?._bind(this);
        // add the permissions boundary aspect
        this.addPermissionsBoundaryAspect();
    }
    /**
     * If a permissions boundary has been applied on this scope or any parent scope
     * then this will return the ARN of the permissions boundary.
     *
     * This will return the permissions boundary that has been applied to the most
     * specific scope.
     *
     * For example:
     *
     * const stage = new Stage(app, 'stage', {
     *   permissionsBoundary: PermissionsBoundary.fromName('stage-pb'),
     * });
     *
     * const stack = new Stack(stage, 'Stack', {
     *   permissionsBoundary: PermissionsBoundary.fromName('some-other-pb'),
     * });
     *
     *  Stack.permissionsBoundaryArn === 'arn:${AWS::Partition}:iam::${AWS::AccountId}:policy/some-other-pb';
     *
     * @param scope the construct scope to retrieve the permissions boundary name from
     * @returns the name of the permissions boundary or undefined if not set
     */
    get permissionsBoundaryArn() {
        const qualifier = this.synthesizer.bootstrapQualifier
            ?? this.node.tryGetContext(stack_synthesizers_1.BOOTSTRAP_QUALIFIER_CONTEXT)
            ?? stack_synthesizers_1.DefaultStackSynthesizer.DEFAULT_QUALIFIER;
        const spec = new _shared_1.StringSpecializer(this, qualifier);
        const context = this.node.tryGetContext(permissions_boundary_1.PERMISSIONS_BOUNDARY_CONTEXT_KEY);
        let arn;
        if (context && context.arn) {
            arn = spec.specialize(context.arn);
        }
        else if (context && context.name) {
            arn = spec.specialize(this.formatArn({
                service: 'iam',
                resource: 'policy',
                region: '',
                resourceName: context.name,
            }));
        }
        if (arn &&
            (arn.includes('${Qualifier}')
                || arn.includes('${AWS::AccountId}')
                || arn.includes('${AWS::Region}')
                || arn.includes('${AWS::Partition}'))) {
            throw new Error(`The permissions boundary ${arn} includes a pseudo parameter, ` +
                'which is not supported for environment agnostic stacks');
        }
        return arn;
    }
    /**
     * Adds an aspect to the stack that will apply the permissions boundary.
     * This will only add the aspect if the permissions boundary has been set
     */
    addPermissionsBoundaryAspect() {
        const permissionsBoundaryArn = this.permissionsBoundaryArn;
        if (permissionsBoundaryArn) {
            aspect_1.Aspects.of(this).add({
                visit(node) {
                    if (cfn_resource_1.CfnResource.isCfnResource(node) &&
                        (node.cfnResourceType == 'AWS::IAM::Role' || node.cfnResourceType == 'AWS::IAM::User')) {
                        node.addPropertyOverride('PermissionsBoundary', permissionsBoundaryArn);
                    }
                },
            });
        }
    }
    /**
     * Resolve a tokenized value in the context of the current stack.
     */
    resolve(obj) {
        return (0, resolve_1.resolve)(obj, {
            scope: this,
            prefix: [],
            resolver: cloudformation_lang_1.CLOUDFORMATION_TOKEN_RESOLVER,
            preparing: false,
        });
    }
    /**
     * Convert an object, potentially containing tokens, to a JSON string
     */
    toJsonString(obj, space) {
        return cloudformation_lang_1.CloudFormationLang.toJSON(obj, space).toString();
    }
    /**
     * DEPRECATED
     * @deprecated use `reportMissingContextKey()`
     */
    reportMissingContext(report) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Stack#reportMissingContext", "use `reportMissingContextKey()`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.reportMissingContext);
            }
            throw error;
        }
        if (!Object.values(cxschema.ContextProvider).includes(report.provider)) {
            throw new Error(`Unknown context provider requested in: ${JSON.stringify(report)}`);
        }
        this.reportMissingContextKey(report);
    }
    /**
     * Indicate that a context key was expected
     *
     * Contains instructions which will be emitted into the cloud assembly on how
     * the key should be supplied.
     *
     * @param report The set of parameters needed to obtain the context
     */
    reportMissingContextKey(report) {
        this._missingContext.push(report);
    }
    /**
     * Rename a generated logical identities
     *
     * To modify the naming scheme strategy, extend the `Stack` class and
     * override the `allocateLogicalId` method.
     */
    renameLogicalId(oldId, newId) {
        this._logicalIds.addRename(oldId, newId);
    }
    /**
     * Allocates a stack-unique CloudFormation-compatible logical identity for a
     * specific resource.
     *
     * This method is called when a `CfnElement` is created and used to render the
     * initial logical identity of resources. Logical ID renames are applied at
     * this stage.
     *
     * This method uses the protected method `allocateLogicalId` to render the
     * logical ID for an element. To modify the naming scheme, extend the `Stack`
     * class and override this method.
     *
     * @param element The CloudFormation element for which a logical identity is
     * needed.
     */
    getLogicalId(element) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnElement(element);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getLogicalId);
            }
            throw error;
        }
        const logicalId = this.allocateLogicalId(element);
        return this._logicalIds.applyRename(logicalId);
    }
    /**
     * Add a dependency between this stack and another stack.
     *
     * This can be used to define dependencies between any two stacks within an
     * app, and also supports nested stacks.
     */
    addDependency(target, reason) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Stack(target);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addDependency);
            }
            throw error;
        }
        (0, deps_1.addDependency)(this, target, reason ?? `{${this.node.path}}.addDependency({${target.node.path}})`);
    }
    /**
     * Return the stacks this stack depends on
     */
    get dependencies() {
        return Object.values(this._stackDependencies).map(x => x.stack);
    }
    /**
     * The concrete CloudFormation physical stack name.
     *
     * This is either the name defined explicitly in the `stackName` prop or
     * allocated based on the stack's location in the construct tree. Stacks that
     * are directly defined under the app use their construct `id` as their stack
     * name. Stacks that are defined deeper within the tree will use a hashed naming
     * scheme based on the construct path to ensure uniqueness.
     *
     * If you wish to obtain the deploy-time AWS::StackName intrinsic,
     * you can use `Aws.STACK_NAME` directly.
     */
    get stackName() {
        return this._stackName;
    }
    /**
     * The partition in which this stack is defined
     */
    get partition() {
        // Return a non-scoped partition intrinsic when the stack's region is
        // unresolved or unknown.  Otherwise we will return the partition name as
        // a literal string.
        if (!feature_flags_1.FeatureFlags.of(this).isEnabled(cxapi.ENABLE_PARTITION_LITERALS) || token_1.Token.isUnresolved(this.region)) {
            return cfn_pseudo_1.Aws.PARTITION;
        }
        else {
            const partition = region_info_1.RegionInfo.get(this.region).partition;
            return partition ?? cfn_pseudo_1.Aws.PARTITION;
        }
    }
    /**
     * The Amazon domain suffix for the region in which this stack is defined
     */
    get urlSuffix() {
        // Since URL Suffix always follows partition, it is unscoped like partition is.
        return cfn_pseudo_1.Aws.URL_SUFFIX;
    }
    /**
     * The ID of the stack
     *
     * @example
     * // After resolving, looks like
     * 'arn:aws:cloudformation:us-west-2:123456789012:stack/teststack/51af3dc0-da77-11e4-872e-1234567db123'
     */
    get stackId() {
        return new cfn_pseudo_1.ScopedAws(this).stackId;
    }
    /**
     * Returns the list of notification Amazon Resource Names (ARNs) for the current stack.
     */
    get notificationArns() {
        return new cfn_pseudo_1.ScopedAws(this).notificationArns;
    }
    /**
     * Indicates if this is a nested stack, in which case `parentStack` will include a reference to it's parent.
     */
    get nested() {
        return this.nestedStackResource !== undefined;
    }
    /**
     * Creates an ARN from components.
     *
     * If `partition`, `region` or `account` are not specified, the stack's
     * partition, region and account will be used.
     *
     * If any component is the empty string, an empty string will be inserted
     * into the generated ARN at the location that component corresponds to.
     *
     * The ARN will be formatted as follows:
     *
     *   arn:{partition}:{service}:{region}:{account}:{resource}{sep}{resource-name}
     *
     * The required ARN pieces that are omitted will be taken from the stack that
     * the 'scope' is attached to. If all ARN pieces are supplied, the supplied scope
     * can be 'undefined'.
     */
    formatArn(components) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ArnComponents(components);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.formatArn);
            }
            throw error;
        }
        return arn_1.Arn.format(components, this);
    }
    /**
     * Given an ARN, parses it and returns components.
     *
     * IF THE ARN IS A CONCRETE STRING...
     *
     * ...it will be parsed and validated. The separator (`sep`) will be set to '/'
     * if the 6th component includes a '/', in which case, `resource` will be set
     * to the value before the '/' and `resourceName` will be the rest. In case
     * there is no '/', `resource` will be set to the 6th components and
     * `resourceName` will be set to the rest of the string.
     *
     * IF THE ARN IS A TOKEN...
     *
     * ...it cannot be validated, since we don't have the actual value yet at the
     * time of this function call. You will have to supply `sepIfToken` and
     * whether or not ARNs of the expected format usually have resource names
     * in order to parse it properly. The resulting `ArnComponents` object will
     * contain tokens for the subexpressions of the ARN, not string literals.
     *
     * If the resource name could possibly contain the separator char, the actual
     * resource name cannot be properly parsed. This only occurs if the separator
     * char is '/', and happens for example for S3 object ARNs, IAM Role ARNs,
     * IAM OIDC Provider ARNs, etc. To properly extract the resource name from a
     * Tokenized ARN, you must know the resource type and call
     * `Arn.extractResourceName`.
     *
     * @param arn The ARN string to parse
     * @param sepIfToken The separator used to separate resource from resourceName
     * @param hasName Whether there is a name component in the ARN at all. For
     * example, SNS Topics ARNs have the 'resource' component contain the topic
     * name, and no 'resourceName' component.
     *
     * @returns an ArnComponents object which allows access to the various
     * components of the ARN.
     *
     * @returns an ArnComponents object which allows access to the various
     *      components of the ARN.
     *
     * @deprecated use splitArn instead
     */
    parseArn(arn, sepIfToken = '/', hasName = true) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Stack#parseArn", "use splitArn instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.parseArn);
            }
            throw error;
        }
        return arn_1.Arn.parse(arn, sepIfToken, hasName);
    }
    /**
     * Splits the provided ARN into its components.
     * Works both if 'arn' is a string like 'arn:aws:s3:::bucket',
     * and a Token representing a dynamic CloudFormation expression
     * (in which case the returned components will also be dynamic CloudFormation expressions,
     * encoded as Tokens).
     *
     * @param arn the ARN to split into its components
     * @param arnFormat the expected format of 'arn' - depends on what format the service 'arn' represents uses
     */
    splitArn(arn, arnFormat) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ArnFormat(arnFormat);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.splitArn);
            }
            throw error;
        }
        return arn_1.Arn.split(arn, arnFormat);
    }
    /**
     * Returns the list of AZs that are available in the AWS environment
     * (account/region) associated with this stack.
     *
     * If the stack is environment-agnostic (either account and/or region are
     * tokens), this property will return an array with 2 tokens that will resolve
     * at deploy-time to the first two availability zones returned from CloudFormation's
     * `Fn::GetAZs` intrinsic function.
     *
     * If they are not available in the context, returns a set of dummy values and
     * reports them as missing, and let the CLI resolve them by calling EC2
     * `DescribeAvailabilityZones` on the target environment.
     *
     * To specify a different strategy for selecting availability zones override this method.
     */
    get availabilityZones() {
        // if account/region are tokens, we can't obtain AZs through the context
        // provider, so we fallback to use Fn::GetAZs. the current lowest common
        // denominator is 2 AZs across all AWS regions.
        const agnostic = token_1.Token.isUnresolved(this.account) || token_1.Token.isUnresolved(this.region);
        if (agnostic) {
            return this.node.tryGetContext(cxapi.AVAILABILITY_ZONE_FALLBACK_CONTEXT_KEY) || [
                cfn_fn_1.Fn.select(0, cfn_fn_1.Fn.getAzs()),
                cfn_fn_1.Fn.select(1, cfn_fn_1.Fn.getAzs()),
            ];
        }
        const value = context_provider_1.ContextProvider.getValue(this, {
            provider: cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER,
            dummyValue: ['dummy1a', 'dummy1b', 'dummy1c'],
        }).value;
        if (!Array.isArray(value)) {
            throw new Error(`Provider ${cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER} expects a list`);
        }
        return value;
    }
    /**
     * Register a file asset on this Stack
     *
     * @deprecated Use `stack.synthesizer.addFileAsset()` if you are calling,
     * and a different IStackSynthesizer class if you are implementing.
     */
    addFileAsset(asset) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Stack#addFileAsset", "Use `stack.synthesizer.addFileAsset()` if you are calling,\nand a different IStackSynthesizer class if you are implementing.");
            jsiiDeprecationWarnings._aws_cdk_core_FileAssetSource(asset);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addFileAsset);
            }
            throw error;
        }
        return this.synthesizer.addFileAsset(asset);
    }
    /**
     * Register a docker image asset on this Stack
     *
     * @deprecated Use `stack.synthesizer.addDockerImageAsset()` if you are calling,
     * and a different `IStackSynthesizer` class if you are implementing.
     */
    addDockerImageAsset(asset) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Stack#addDockerImageAsset", "Use `stack.synthesizer.addDockerImageAsset()` if you are calling,\nand a different `IStackSynthesizer` class if you are implementing.");
            jsiiDeprecationWarnings._aws_cdk_core_DockerImageAssetSource(asset);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addDockerImageAsset);
            }
            throw error;
        }
        return this.synthesizer.addDockerImageAsset(asset);
    }
    /**
     * If this is a nested stack, returns it's parent stack.
     */
    get nestedStackParent() {
        return this.nestedStackResource && Stack.of(this.nestedStackResource);
    }
    /**
     * Returns the parent of a nested stack.
     *
     * @deprecated use `nestedStackParent`
     */
    get parentStack() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Stack#parentStack", "use `nestedStackParent`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "parentStack").get);
            }
            throw error;
        }
        return this.nestedStackParent;
    }
    /**
     * Add a Transform to this stack. A Transform is a macro that AWS
     * CloudFormation uses to process your template.
     *
     * Duplicate values are removed when stack is synthesized.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html
     * @param transform The transform to add
     *
     * @example
     * declare const stack: Stack;
     *
     * stack.addTransform('AWS::Serverless-2016-10-31')
     */
    addTransform(transform) {
        if (!this.templateOptions.transforms) {
            this.templateOptions.transforms = [];
        }
        this.templateOptions.transforms.push(transform);
    }
    /**
     * Adds an arbitary key-value pair, with information you want to record about the stack.
     * These get translated to the Metadata section of the generated template.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html
     */
    addMetadata(key, value) {
        if (!this.templateOptions.metadata) {
            this.templateOptions.metadata = {};
        }
        this.templateOptions.metadata[key] = value;
    }
    /**
     * Called implicitly by the `addDependency` helper function in order to
     * realize a dependency between two top-level stacks at the assembly level.
     *
     * Use `stack.addDependency` to define the dependency between any two stacks,
     * and take into account nested stack relationships.
     *
     * @internal
     */
    _addAssemblyDependency(target, reason = {}) {
        // defensive: we should never get here for nested stacks
        if (this.nested || target.nested) {
            throw new Error('Cannot add assembly-level dependencies for nested stacks');
        }
        // Fill in reason details if not provided
        if (!reason.source) {
            reason.source = this;
        }
        if (!reason.target) {
            reason.target = target;
        }
        if (!reason.description) {
            reason.description = 'no description provided';
        }
        const cycle = target.stackDependencyReasons(this);
        if (cycle !== undefined) {
            const cycleDescription = cycle.map((cycleReason) => {
                return cycleReason.description;
            }).join(', ');
            // eslint-disable-next-line max-len
            throw new Error(`'${target.node.path}' depends on '${this.node.path}' (${cycleDescription}). Adding this dependency (${reason.description}) would create a cyclic reference.`);
        }
        let dep = this._stackDependencies[names_1.Names.uniqueId(target)];
        if (!dep) {
            dep = this._stackDependencies[names_1.Names.uniqueId(target)] = { stack: target, reasons: [] };
        }
        // Check for a duplicate reason already existing
        let existingReasons = new Set();
        dep.reasons.forEach((existingReason) => {
            if (existingReason.source == reason.source && existingReason.target == reason.target) {
                existingReasons.add(existingReason);
            }
        });
        if (existingReasons.size > 0) {
            // Dependency already exists and for the provided reason
            return;
        }
        dep.reasons.push(reason);
        if (process.env.CDK_DEBUG_DEPS) {
            // eslint-disable-next-line no-console
            console.error(`[CDK_DEBUG_DEPS] stack "${reason.source.node.path}" depends on "${reason.target.node.path}"`);
        }
    }
    /**
     * Called implicitly by the `obtainDependencies` helper function in order to
     * collect resource dependencies across two top-level stacks at the assembly level.
     *
     * Use `stack.obtainDependencies` to see the dependencies between any two stacks.
     *
     * @internal
     */
    _obtainAssemblyDependencies(reasonFilter) {
        if (!reasonFilter.source) {
            throw new Error('reasonFilter.source must be defined!');
        }
        // Assume reasonFilter has only source defined
        let dependencies = new Set();
        Object.values(this._stackDependencies).forEach((dep) => {
            dep.reasons.forEach((reason) => {
                if (reasonFilter.source == reason.source) {
                    if (!reason.target) {
                        throw new Error(`Encountered an invalid dependency target from source '${reasonFilter.source.node.path}'`);
                    }
                    dependencies.add(reason.target);
                }
            });
        });
        return Array.from(dependencies);
    }
    /**
     * Called implicitly by the `removeDependency` helper function in order to
     * remove a dependency between two top-level stacks at the assembly level.
     *
     * Use `stack.addDependency` to define the dependency between any two stacks,
     * and take into account nested stack relationships.
     *
     * @internal
     */
    _removeAssemblyDependency(target, reasonFilter = {}) {
        // defensive: we should never get here for nested stacks
        if (this.nested || target.nested) {
            throw new Error('There cannot be assembly-level dependencies for nested stacks');
        }
        // No need to check for a dependency cycle when removing one
        // Fill in reason details if not provided
        if (!reasonFilter.source) {
            reasonFilter.source = this;
        }
        if (!reasonFilter.target) {
            reasonFilter.target = target;
        }
        let dep = this._stackDependencies[names_1.Names.uniqueId(target)];
        if (!dep) {
            // Dependency doesn't exist - return now
            return;
        }
        // Find and remove the specified reason from the dependency
        let matchedReasons = new Set();
        dep.reasons.forEach((reason) => {
            if (reasonFilter.source == reason.source && reasonFilter.target == reason.target) {
                matchedReasons.add(reason);
            }
        });
        if (matchedReasons.size > 1) {
            throw new Error(`There cannot be more than one reason for dependency removal, found: ${matchedReasons}`);
        }
        if (matchedReasons.size == 0) {
            // Reason is already not there - return now
            return;
        }
        let matchedReason = Array.from(matchedReasons)[0];
        let index = dep.reasons.indexOf(matchedReason, 0);
        dep.reasons.splice(index, 1);
        // If that was the last reason, remove the dependency
        if (dep.reasons.length == 0) {
            delete this._stackDependencies[names_1.Names.uniqueId(target)];
        }
        if (process.env.CDK_DEBUG_DEPS) {
            // eslint-disable-next-line no-console
            console.log(`[CDK_DEBUG_DEPS] stack "${this.node.path}" no longer depends on "${target.node.path}" because: ${reasonFilter}`);
        }
    }
    /**
     * Synthesizes the cloudformation template into a cloud assembly.
     * @internal
     */
    _synthesizeTemplate(session, lookupRoleArn) {
        // In principle, stack synthesis is delegated to the
        // StackSynthesis object.
        //
        // However, some parts of synthesis currently use some private
        // methods on Stack, and I don't really see the value in refactoring
        // this right now, so some parts still happen here.
        const builder = session.assembly;
        const template = this._toCloudFormation();
        // write the CloudFormation template as a JSON file
        const outPath = path.join(builder.outdir, this.templateFile);
        if (this.maxResources > 0) {
            const resources = template.Resources || {};
            const numberOfResources = Object.keys(resources).length;
            if (numberOfResources > this.maxResources) {
                const counts = Object.entries(count(Object.values(resources).map((r) => `${r?.Type}`))).map(([type, c]) => `${type} (${c})`).join(', ');
                throw new Error(`Number of resources in stack '${this.node.path}': ${numberOfResources} is greater than allowed maximum of ${this.maxResources}: ${counts}`);
            }
            else if (numberOfResources >= (this.maxResources * 0.8)) {
                annotations_1.Annotations.of(this).addInfo(`Number of resources: ${numberOfResources} is approaching allowed maximum of ${this.maxResources}`);
            }
        }
        fs.writeFileSync(outPath, JSON.stringify(template, undefined, 1));
        for (const ctx of this._missingContext) {
            if (lookupRoleArn != null) {
                builder.addMissing({ ...ctx, props: { ...ctx.props, lookupRoleArn } });
            }
            else {
                builder.addMissing(ctx);
            }
        }
    }
    /**
     * Look up a fact value for the given fact for the region of this stack
     *
     * Will return a definite value only if the region of the current stack is resolved.
     * If not, a lookup map will be added to the stack and the lookup will be done at
     * CDK deployment time.
     *
     * What regions will be included in the lookup map is controlled by the
     * `@aws-cdk/core:target-partitions` context value: it must be set to a list
     * of partitions, and only regions from the given partitions will be included.
     * If no such context key is set, all regions will be included.
     *
     * This function is intended to be used by construct library authors. Application
     * builders can rely on the abstractions offered by construct libraries and do
     * not have to worry about regional facts.
     *
     * If `defaultValue` is not given, it is an error if the fact is unknown for
     * the given region.
     */
    regionalFact(factName, defaultValue) {
        if (!token_1.Token.isUnresolved(this.region)) {
            const ret = region_info_1.Fact.find(this.region, factName) ?? defaultValue;
            if (ret === undefined) {
                throw new Error(`region-info: don't know ${factName} for region ${this.region}. Use 'Fact.register' to provide this value.`);
            }
            return ret;
        }
        const partitions = constructs_1.Node.of(this).tryGetContext(cxapi.TARGET_PARTITIONS);
        if (partitions !== undefined && partitions !== 'undefined' && !Array.isArray(partitions)) {
            throw new Error(`Context value '${cxapi.TARGET_PARTITIONS}' should be a list of strings, got: ${JSON.stringify(partitions)}`);
        }
        const lookupMap = partitions !== undefined && partitions !== 'undefined'
            ? region_info_1.RegionInfo.limitedRegionMap(factName, partitions)
            : region_info_1.RegionInfo.regionMap(factName);
        return (0, region_lookup_1.deployTimeLookup)(this, factName, lookupMap, defaultValue);
    }
    /**
     * Create a CloudFormation Export for a string value
     *
     * Returns a string representing the corresponding `Fn.importValue()`
     * expression for this Export. You can control the name for the export by
     * passing the `name` option.
     *
     * If you don't supply a value for `name`, the value you're exporting must be
     * a Resource attribute (for example: `bucket.bucketName`) and it will be
     * given the same name as the automatic cross-stack reference that would be created
     * if you used the attribute in another Stack.
     *
     * One of the uses for this method is to *remove* the relationship between
     * two Stacks established by automatic cross-stack references. It will
     * temporarily ensure that the CloudFormation Export still exists while you
     * remove the reference from the consuming stack. After that, you can remove
     * the resource and the manual export.
     *
     * ## Example
     *
     * Here is how the process works. Let's say there are two stacks,
     * `producerStack` and `consumerStack`, and `producerStack` has a bucket
     * called `bucket`, which is referenced by `consumerStack` (perhaps because
     * an AWS Lambda Function writes into it, or something like that).
     *
     * It is not safe to remove `producerStack.bucket` because as the bucket is being
     * deleted, `consumerStack` might still be using it.
     *
     * Instead, the process takes two deployments:
     *
     * ### Deployment 1: break the relationship
     *
     * - Make sure `consumerStack` no longer references `bucket.bucketName` (maybe the consumer
     *   stack now uses its own bucket, or it writes to an AWS DynamoDB table, or maybe you just
     *   remove the Lambda Function altogether).
     * - In the `ProducerStack` class, call `this.exportValue(this.bucket.bucketName)`. This
     *   will make sure the CloudFormation Export continues to exist while the relationship
     *   between the two stacks is being broken.
     * - Deploy (this will effectively only change the `consumerStack`, but it's safe to deploy both).
     *
     * ### Deployment 2: remove the bucket resource
     *
     * - You are now free to remove the `bucket` resource from `producerStack`.
     * - Don't forget to remove the `exportValue()` call as well.
     * - Deploy again (this time only the `producerStack` will be changed -- the bucket will be deleted).
     */
    exportValue(exportedValue, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ExportValueOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.exportValue);
            }
            throw error;
        }
        if (options.name) {
            new cfn_output_1.CfnOutput(this, `Export${options.name}`, {
                value: exportedValue,
                exportName: options.name,
            });
            return cfn_fn_1.Fn.importValue(options.name);
        }
        const { exportName, exportsScope, id, exportable } = this.resolveExportedValue(exportedValue);
        const output = exportsScope.node.tryFindChild(id);
        if (!output) {
            new cfn_output_1.CfnOutput(exportsScope, id, {
                value: token_1.Token.asString(exportable),
                exportName,
            });
        }
        const importValue = cfn_fn_1.Fn.importValue(exportName);
        if (Array.isArray(importValue)) {
            throw new Error('Attempted to export a list value from `exportValue()`: use `exportStringListValue()` instead');
        }
        return importValue;
    }
    /**
     * Create a CloudFormation Export for a string list value
     *
     * Returns a string list representing the corresponding `Fn.importValue()`
     * expression for this Export. The export expression is automatically wrapped with an
     * `Fn::Join` and the import value with an `Fn::Split`, since CloudFormation can only
     * export strings. You can control the name for the export by passing the `name` option.
     *
     * If you don't supply a value for `name`, the value you're exporting must be
     * a Resource attribute (for example: `bucket.bucketName`) and it will be
     * given the same name as the automatic cross-stack reference that would be created
     * if you used the attribute in another Stack.
     *
     * One of the uses for this method is to *remove* the relationship between
     * two Stacks established by automatic cross-stack references. It will
     * temporarily ensure that the CloudFormation Export still exists while you
     * remove the reference from the consuming stack. After that, you can remove
     * the resource and the manual export.
     *
     * See `exportValue` for an example of this process.
     */
    exportStringListValue(exportedValue, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ExportValueOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.exportStringListValue);
            }
            throw error;
        }
        if (options.name) {
            new cfn_output_1.CfnOutput(this, `Export${options.name}`, {
                value: cfn_fn_1.Fn.join(STRING_LIST_REFERENCE_DELIMITER, exportedValue),
                exportName: options.name,
            });
            return cfn_fn_1.Fn.split(STRING_LIST_REFERENCE_DELIMITER, cfn_fn_1.Fn.importValue(options.name));
        }
        const { exportName, exportsScope, id, exportable } = this.resolveExportedValue(exportedValue);
        const output = exportsScope.node.tryFindChild(id);
        if (!output) {
            new cfn_output_1.CfnOutput(exportsScope, id, {
                // this is a list so export an Fn::Join expression
                // and import an Fn::Split expression,
                // since CloudFormation Outputs can only be strings
                // (string lists are invalid)
                value: cfn_fn_1.Fn.join(STRING_LIST_REFERENCE_DELIMITER, token_1.Token.asList(exportable)),
                exportName,
            });
        }
        // we don't use `Fn.importListValue()` since this array is a CFN attribute, and we don't know how long this attribute is
        const importValue = cfn_fn_1.Fn.split(STRING_LIST_REFERENCE_DELIMITER, cfn_fn_1.Fn.importValue(exportName));
        if (!Array.isArray(importValue)) {
            throw new Error('Attempted to export a string value from `exportStringListValue()`: use `exportValue()` instead');
        }
        return importValue;
    }
    /**
     * Returns the naming scheme used to allocate logical IDs. By default, uses
     * the `HashedAddressingScheme` but this method can be overridden to customize
     * this behavior.
     *
     * In order to make sure logical IDs are unique and stable, we hash the resource
     * construct tree path (i.e. toplevel/secondlevel/.../myresource) and add it as
     * a suffix to the path components joined without a separator (CloudFormation
     * IDs only allow alphanumeric characters).
     *
     * The result will be:
     *
     *   <path.join('')><md5(path.join('/')>
     *     "human"      "hash"
     *
     * If the "human" part of the ID exceeds 240 characters, we simply trim it so
     * the total ID doesn't exceed CloudFormation's 255 character limit.
     *
     * We only take 8 characters from the md5 hash (0.000005 chance of collision).
     *
     * Special cases:
     *
     * - If the path only contains a single component (i.e. it's a top-level
     *   resource), we won't add the hash to it. The hash is not needed for
     *   disamiguation and also, it allows for a more straightforward migration an
     *   existing CloudFormation template to a CDK stack without logical ID changes
     *   (or renames).
     * - For aesthetic reasons, if the last components of the path are the same
     *   (i.e. `L1/L2/Pipeline/Pipeline`), they will be de-duplicated to make the
     *   resulting human portion of the ID more pleasing: `L1L2Pipeline<HASH>`
     *   instead of `L1L2PipelinePipeline<HASH>`
     * - If a component is named "Default" it will be omitted from the path. This
     *   allows refactoring higher level abstractions around constructs without affecting
     *   the IDs of already deployed resources.
     * - If a component is named "Resource" it will be omitted from the user-visible
     *   path, but included in the hash. This reduces visual noise in the human readable
     *   part of the identifier.
     *
     * @param cfnElement The element for which the logical ID is allocated.
     */
    allocateLogicalId(cfnElement) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnElement(cfnElement);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.allocateLogicalId);
            }
            throw error;
        }
        const scopes = cfnElement.node.scopes;
        const stackIndex = scopes.indexOf(cfnElement.stack);
        const pathComponents = scopes.slice(stackIndex + 1).map(x => x.node.id);
        return (0, uniqueid_1.makeUniqueId)(pathComponents);
    }
    /**
     * Validate stack name
     *
     * CloudFormation stack names can include dashes in addition to the regular identifier
     * character classes, and we don't allow one of the magic markers.
     *
     * @internal
     */
    _validateId(name) {
        if (name && !VALID_STACK_NAME_REGEX.test(name)) {
            throw new Error(`Stack name must match the regular expression: ${VALID_STACK_NAME_REGEX.toString()}, got '${name}'`);
        }
    }
    /**
     * Returns the CloudFormation template for this stack by traversing
     * the tree and invoking _toCloudFormation() on all Entity objects.
     *
     * @internal
     */
    _toCloudFormation() {
        let transform;
        if (this.templateOptions.transform) {
            // eslint-disable-next-line max-len
            annotations_1.Annotations.of(this).addWarning('This stack is using the deprecated `templateOptions.transform` property. Consider switching to `addTransform()`.');
            this.addTransform(this.templateOptions.transform);
        }
        if (this.templateOptions.transforms) {
            if (this.templateOptions.transforms.length === 1) { // Extract single value
                transform = this.templateOptions.transforms[0];
            }
            else { // Remove duplicate values
                transform = Array.from(new Set(this.templateOptions.transforms));
            }
        }
        const template = {
            Description: this.templateOptions.description,
            Transform: transform,
            AWSTemplateFormatVersion: this.templateOptions.templateFormatVersion,
            Metadata: this.templateOptions.metadata,
        };
        const elements = cfnElements(this);
        const fragments = elements.map(e => this.resolve(e._toCloudFormation()));
        // merge in all CloudFormation fragments collected from the tree
        for (const fragment of fragments) {
            merge(template, fragment);
        }
        // resolve all tokens and remove all empties
        const ret = this.resolve(template) || {};
        this._logicalIds.assertAllRenamesApplied();
        return ret;
    }
    /**
     * Deprecated.
     *
     * @see https://github.com/aws/aws-cdk/pull/7187
     * @returns reference itself without any change
     * @deprecated cross reference handling has been moved to `App.prepare()`.
     */
    prepareCrossReference(_sourceStack, reference) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Stack#prepareCrossReference", "cross reference handling has been moved to `App.prepare()`.");
            jsiiDeprecationWarnings._aws_cdk_core_Stack(_sourceStack);
            jsiiDeprecationWarnings._aws_cdk_core_Reference(reference);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.prepareCrossReference);
            }
            throw error;
        }
        return reference;
    }
    /**
     * Determine the various stack environment attributes.
     *
     */
    parseEnvironment(env = {}) {
        // if an environment property is explicitly specified when the stack is
        // created, it will be used. if not, use tokens for account and region.
        //
        // (They do not need to be anchored to any construct like resource attributes
        // are, because we'll never Export/Fn::ImportValue them -- the only situation
        // in which Export/Fn::ImportValue would work is if the value are the same
        // between producer and consumer anyway, so we can just assume that they are).
        const containingAssembly = stage_1.Stage.of(this);
        const account = env.account ?? containingAssembly?.account ?? cfn_pseudo_1.Aws.ACCOUNT_ID;
        const region = env.region ?? containingAssembly?.region ?? cfn_pseudo_1.Aws.REGION;
        // this is the "aws://" env specification that will be written to the cloud assembly
        // manifest. it will use "unknown-account" and "unknown-region" to indicate
        // environment-agnosticness.
        const envAccount = !token_1.Token.isUnresolved(account) ? account : cxapi.UNKNOWN_ACCOUNT;
        const envRegion = !token_1.Token.isUnresolved(region) ? region : cxapi.UNKNOWN_REGION;
        return {
            account,
            region,
            environment: cxapi.EnvironmentUtils.format(envAccount, envRegion),
        };
    }
    /**
     * Maximum number of resources in the stack
     *
     * Set to 0 to mean "unlimited".
     */
    get maxResources() {
        const contextLimit = this.node.tryGetContext(exports.STACK_RESOURCE_LIMIT_CONTEXT);
        return contextLimit !== undefined ? parseInt(contextLimit, 10) : MAX_RESOURCES;
    }
    /**
     * Check whether this stack has a (transitive) dependency on another stack
     *
     * Returns the list of reasons on the dependency path, or undefined
     * if there is no dependency.
     */
    stackDependencyReasons(other) {
        if (this === other) {
            return [];
        }
        for (const dep of Object.values(this._stackDependencies)) {
            const ret = dep.stack.stackDependencyReasons(other);
            if (ret !== undefined) {
                return [...dep.reasons, ...ret];
            }
        }
        return undefined;
    }
    /**
     * Calculate the stack name based on the construct path
     *
     * The stack name is the name under which we'll deploy the stack,
     * and incorporates containing Stage names by default.
     *
     * Generally this looks a lot like how logical IDs are calculated.
     * The stack name is calculated based on the construct root path,
     * as follows:
     *
     * - Path is calculated with respect to containing App or Stage (if any)
     * - If the path is one component long just use that component, otherwise
     *   combine them with a hash.
     *
     * Since the hash is quite ugly and we'd like to avoid it if possible -- but
     * we can't anymore in the general case since it has been written into legacy
     * stacks. The introduction of Stages makes it possible to make this nicer however.
     * When a Stack is nested inside a Stage, we use the path components below the
     * Stage, and prefix the path components of the Stage before it.
     */
    generateStackName() {
        const assembly = stage_1.Stage.of(this);
        const prefix = (assembly && assembly.stageName) ? `${assembly.stageName}-` : '';
        return `${prefix}${this.generateStackId(assembly)}`;
    }
    /**
     * The artifact ID for this stack
     *
     * Stack artifact ID is unique within the App's Cloud Assembly.
     */
    generateStackArtifactId() {
        return this.generateStackId(this.node.root);
    }
    /**
     * Generate an ID with respect to the given container construct.
     */
    generateStackId(container) {
        const rootPath = rootPathTo(this, container);
        const ids = rootPath.map(c => constructs_1.Node.of(c).id);
        // In unit tests our Stack (which is the only component) may not have an
        // id, so in that case just pretend it's "Stack".
        if (ids.length === 1 && !ids[0]) {
            throw new Error('unexpected: stack id must always be defined');
        }
        return makeStackName(ids);
    }
    resolveExportedValue(exportedValue) {
        const resolvable = token_1.Tokenization.reverse(exportedValue);
        if (!resolvable || !reference_1.Reference.isReference(resolvable)) {
            throw new Error('exportValue: either supply \'name\' or make sure to export a resource attribute (like \'bucket.bucketName\')');
        }
        // "teleport" the value here, in case it comes from a nested stack. This will also
        // ensure the value is from our own scope.
        const exportable = (0, refs_1.getExportable)(this, resolvable);
        // Ensure a singleton "Exports" scoping Construct
        // This mostly exists to trigger LogicalID munging, which would be
        // disabled if we parented constructs directly under Stack.
        // Also it nicely prevents likely construct name clashes
        const exportsScope = getCreateExportsScope(this);
        // Ensure a singleton CfnOutput for this value
        const resolved = this.resolve(exportable);
        const id = 'Output' + JSON.stringify(resolved);
        const exportName = generateExportName(exportsScope, id);
        if (token_1.Token.isUnresolved(exportName)) {
            throw new Error(`unresolved token in generated export name: ${JSON.stringify(this.resolve(exportName))}`);
        }
        return {
            exportable,
            exportsScope,
            id,
            exportName,
        };
    }
    /**
     * Indicates whether the stack requires bundling or not
     */
    get bundlingRequired() {
        const bundlingStacks = this.node.tryGetContext(cxapi.BUNDLING_STACKS) ?? ['**'];
        return bundlingStacks.some(pattern => minimatch(this.node.path, // use the same value for pattern matching as the aws-cdk CLI (displayName / hierarchicalId)
        pattern));
    }
}
_a = JSII_RTTI_SYMBOL_1;
Stack[_a] = { fqn: "@aws-cdk/core.Stack", version: "0.0.0" };
exports.Stack = Stack;
function merge(template, fragment) {
    for (const section of Object.keys(fragment)) {
        const src = fragment[section];
        // create top-level section if it doesn't exist
        const dest = template[section];
        if (!dest) {
            template[section] = src;
        }
        else {
            template[section] = mergeSection(section, dest, src);
        }
    }
}
function mergeSection(section, val1, val2) {
    switch (section) {
        case 'Description':
            return `${val1}\n${val2}`;
        case 'AWSTemplateFormatVersion':
            if (val1 != null && val2 != null && val1 !== val2) {
                throw new Error(`Conflicting CloudFormation template versions provided: '${val1}' and '${val2}`);
            }
            return val1 ?? val2;
        case 'Transform':
            return mergeSets(val1, val2);
        default:
            return mergeObjectsWithoutDuplicates(section, val1, val2);
    }
}
function mergeSets(val1, val2) {
    const array1 = val1 == null ? [] : (Array.isArray(val1) ? val1 : [val1]);
    const array2 = val2 == null ? [] : (Array.isArray(val2) ? val2 : [val2]);
    for (const value of array2) {
        if (!array1.includes(value)) {
            array1.push(value);
        }
    }
    return array1.length === 1 ? array1[0] : array1;
}
function mergeObjectsWithoutDuplicates(section, dest, src) {
    if (typeof dest !== 'object') {
        throw new Error(`Expecting ${JSON.stringify(dest)} to be an object`);
    }
    if (typeof src !== 'object') {
        throw new Error(`Expecting ${JSON.stringify(src)} to be an object`);
    }
    // add all entities from source section to destination section
    for (const id of Object.keys(src)) {
        if (id in dest) {
            throw new Error(`section '${section}' already contains '${id}'`);
        }
        dest[id] = src[id];
    }
    return dest;
}
/**
 * Collect all CfnElements from a Stack.
 *
 * @param node Root node to collect all CfnElements from
 * @param into Array to append CfnElements to
 * @returns The same array as is being collected into
 */
function cfnElements(node, into = []) {
    if (cfn_element_1.CfnElement.isCfnElement(node)) {
        into.push(node);
    }
    for (const child of constructs_1.Node.of(node).children) {
        // Don't recurse into a substack
        if (Stack.isStack(child)) {
            continue;
        }
        cfnElements(child, into);
    }
    return into;
}
/**
 * Return the construct root path of the given construct relative to the given ancestor
 *
 * If no ancestor is given or the ancestor is not found, return the entire root path.
 */
function rootPathTo(construct, ancestor) {
    const scopes = constructs_1.Node.of(construct).scopes;
    for (let i = scopes.length - 2; i >= 0; i--) {
        if (scopes[i] === ancestor) {
            return scopes.slice(i + 1);
        }
    }
    return scopes;
}
exports.rootPathTo = rootPathTo;
/**
 * makeUniqueId, specialized for Stack names
 *
 * Stack names may contain '-', so we allow that character if the stack name
 * has only one component. Otherwise we fall back to the regular "makeUniqueId"
 * behavior.
 */
function makeStackName(components) {
    if (components.length === 1) {
        return components[0];
    }
    return (0, unique_resource_name_1.makeUniqueResourceName)(components, { maxLength: 128 });
}
function getCreateExportsScope(stack) {
    const exportsName = 'Exports';
    let stackExports = stack.node.tryFindChild(exportsName);
    if (stackExports === undefined) {
        stackExports = new constructs_1.Construct(stack, exportsName);
    }
    return stackExports;
}
function generateExportName(stackExports, id) {
    const stackRelativeExports = feature_flags_1.FeatureFlags.of(stackExports).isEnabled(cxapi.STACK_RELATIVE_EXPORTS_CONTEXT);
    const stack = Stack.of(stackExports);
    const components = [
        ...stackExports.node.scopes
            .slice(stackRelativeExports ? stack.node.scopes.length : 2)
            .map(c => c.node.id),
        id,
    ];
    const prefix = stack.stackName ? stack.stackName + ':' : '';
    const localPart = (0, uniqueid_1.makeUniqueId)(components);
    const maxLength = 255;
    return prefix + localPart.slice(Math.max(0, localPart.length - maxLength + prefix.length));
}
function count(xs) {
    const ret = {};
    for (const x of xs) {
        if (x in ret) {
            ret[x] += 1;
        }
        else {
            ret[x] = 1;
        }
    }
    return ret;
}
// These imports have to be at the end to prevent circular imports
/* eslint-disable import/order */
const cfn_output_1 = require("./cfn-output");
const deps_1 = require("./deps");
const fs_1 = require("./fs");
const names_1 = require("./names");
const reference_1 = require("./reference");
const stack_synthesizers_1 = require("./stack-synthesizers");
const _shared_1 = require("./stack-synthesizers/_shared");
const stage_1 = require("./stage");
const tag_manager_1 = require("./tag-manager");
const token_1 = require("./token");
const refs_1 = require("./private/refs");
const region_info_1 = require("@aws-cdk/region-info");
const region_lookup_1 = require("./private/region-lookup");
const unique_resource_name_1 = require("./private/unique-resource-name");
const private_context_1 = require("./private/private-context");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDJEQUEyRDtBQUMzRCx5Q0FBeUM7QUFDekMsMkNBQXlEO0FBQ3pELHVDQUF1QztBQUN2QywrQ0FBNEM7QUFDNUMsK0JBQTRCO0FBQzVCLCtCQUFzRDtBQUN0RCxxQ0FBbUM7QUFFbkMsK0NBQTJDO0FBQzNDLHFDQUE4QjtBQUM5Qiw2Q0FBOEM7QUFDOUMsaURBQXNEO0FBQ3RELHlEQUFxRDtBQUVyRCxtREFBK0M7QUFDL0MsaUVBQStGO0FBQy9GLHVFQUFrRztBQUNsRyxxREFBa0Q7QUFDbEQsK0NBQTRDO0FBQzVDLGlEQUFrRDtBQUVsRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDdkQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBRXBELFFBQUEsNEJBQTRCLEdBQUcsa0NBQWtDLENBQUM7QUFFL0UsTUFBTSxzQkFBc0IsR0FBRyx5QkFBeUIsQ0FBQztBQUV6RCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUM7QUFFMUIsTUFBTSwrQkFBK0IsR0FBRyxJQUFJLENBQUM7QUE4STdDOztHQUVHO0FBQ0gsTUFBYSxLQUFNLFNBQVEsc0JBQVM7SUFDbEM7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBTTtRQUMxQixPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksT0FBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsSUFBSSxZQUFZLElBQUksQ0FBQyxDQUFDO0tBQ2xFO0lBRUQ7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFxQjtRQUNwQyx5RUFBeUU7UUFDekUsMkVBQTJFO1FBQzNFLDJFQUEyRTtRQUMzRSx5QkFBeUI7UUFDekIsTUFB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RTtLQUNILENBQUM7SUFDRixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzVELE1BQU0sU0FBUyxHQUFHLElBQUEsdUJBQVksRUFBQyxVQUFVLENBQUMsQ0FBQztJQUMzQyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUM7SUFDdEIsT0FBTyxNQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM3RixDQUFDO0FBZ0NELFNBQVMsS0FBSyxDQUFDLEVBQVk7SUFDekIsTUFBTSxHQUFHLEdBQTJCLEVBQUUsQ0FBQztJQUN2QyxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUU7WUFDWixHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2I7YUFBTTtZQUNMLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDWjtLQUNGO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsa0VBQWtFO0FBQ2xFLGlDQUFpQztBQUNqQyw2Q0FBeUM7QUFDekMsaUNBQWdEO0FBQ2hELDZCQUFrQztBQUNsQyxtQ0FBZ0M7QUFDaEMsMkNBQXdDO0FBRXhDLDZEQUFzTDtBQUN0TCwwREFBaUU7QUFDakUsbUNBQWdDO0FBQ2hDLCtDQUFzRDtBQUN0RCxtQ0FBOEM7QUFDOUMseUNBQStDO0FBQy9DLHNEQUF3RDtBQUN4RCwyREFBMkQ7QUFDM0QseUVBQXdFO0FBQUEsK0RBQXNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgSUNvbnN0cnVjdCwgQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcbmltcG9ydCB7IEFubm90YXRpb25zIH0gZnJvbSAnLi9hbm5vdGF0aW9ucyc7XG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuL2FwcCc7XG5pbXBvcnQgeyBBcm4sIEFybkNvbXBvbmVudHMsIEFybkZvcm1hdCB9IGZyb20gJy4vYXJuJztcbmltcG9ydCB7IEFzcGVjdHMgfSBmcm9tICcuL2FzcGVjdCc7XG5pbXBvcnQgeyBEb2NrZXJJbWFnZUFzc2V0TG9jYXRpb24sIERvY2tlckltYWdlQXNzZXRTb3VyY2UsIEZpbGVBc3NldExvY2F0aW9uLCBGaWxlQXNzZXRTb3VyY2UgfSBmcm9tICcuL2Fzc2V0cyc7XG5pbXBvcnQgeyBDZm5FbGVtZW50IH0gZnJvbSAnLi9jZm4tZWxlbWVudCc7XG5pbXBvcnQgeyBGbiB9IGZyb20gJy4vY2ZuLWZuJztcbmltcG9ydCB7IEF3cywgU2NvcGVkQXdzIH0gZnJvbSAnLi9jZm4tcHNldWRvJztcbmltcG9ydCB7IENmblJlc291cmNlLCBUYWdUeXBlIH0gZnJvbSAnLi9jZm4tcmVzb3VyY2UnO1xuaW1wb3J0IHsgQ29udGV4dFByb3ZpZGVyIH0gZnJvbSAnLi9jb250ZXh0LXByb3ZpZGVyJztcbmltcG9ydCB7IEVudmlyb25tZW50IH0gZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBGZWF0dXJlRmxhZ3MgfSBmcm9tICcuL2ZlYXR1cmUtZmxhZ3MnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNCb3VuZGFyeSwgUEVSTUlTU0lPTlNfQk9VTkRBUllfQ09OVEVYVF9LRVkgfSBmcm9tICcuL3Blcm1pc3Npb25zLWJvdW5kYXJ5JztcbmltcG9ydCB7IENMT1VERk9STUFUSU9OX1RPS0VOX1JFU09MVkVSLCBDbG91ZEZvcm1hdGlvbkxhbmcgfSBmcm9tICcuL3ByaXZhdGUvY2xvdWRmb3JtYXRpb24tbGFuZyc7XG5pbXBvcnQgeyBMb2dpY2FsSURzIH0gZnJvbSAnLi9wcml2YXRlL2xvZ2ljYWwtaWQnO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJy4vcHJpdmF0ZS9yZXNvbHZlJztcbmltcG9ydCB7IG1ha2VVbmlxdWVJZCB9IGZyb20gJy4vcHJpdmF0ZS91bmlxdWVpZCc7XG5cbmNvbnN0IFNUQUNLX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2NvcmUuU3RhY2snKTtcbmNvbnN0IE1ZX1NUQUNLX0NBQ0hFID0gU3ltYm9sLmZvcignQGF3cy1jZGsvY29yZS5TdGFjay5teVN0YWNrJyk7XG5cbmV4cG9ydCBjb25zdCBTVEFDS19SRVNPVVJDRV9MSU1JVF9DT05URVhUID0gJ0Bhd3MtY2RrL2NvcmU6c3RhY2tSZXNvdXJjZUxpbWl0JztcblxuY29uc3QgVkFMSURfU1RBQ0tfTkFNRV9SRUdFWCA9IC9eW0EtWmEtel1bQS1aYS16MC05LV0qJC87XG5cbmNvbnN0IE1BWF9SRVNPVVJDRVMgPSA1MDA7XG5cbmNvbnN0IFNUUklOR19MSVNUX1JFRkVSRU5DRV9ERUxJTUlURVIgPSAnfHwnO1xuZXhwb3J0IGludGVyZmFjZSBTdGFja1Byb3BzIHtcbiAgLyoqXG4gICAqIEEgZGVzY3JpcHRpb24gb2YgdGhlIHN0YWNrLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBV1MgZW52aXJvbm1lbnQgKGFjY291bnQvcmVnaW9uKSB3aGVyZSB0aGlzIHN0YWNrIHdpbGwgYmUgZGVwbG95ZWQuXG4gICAqXG4gICAqIFNldCB0aGUgYHJlZ2lvbmAvYGFjY291bnRgIGZpZWxkcyBvZiBgZW52YCB0byBlaXRoZXIgYSBjb25jcmV0ZSB2YWx1ZSB0b1xuICAgKiBzZWxlY3QgdGhlIGluZGljYXRlZCBlbnZpcm9ubWVudCAocmVjb21tZW5kZWQgZm9yIHByb2R1Y3Rpb24gc3RhY2tzKSwgb3IgdG9cbiAgICogdGhlIHZhbHVlcyBvZiBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbiAgICogYENES19ERUZBVUxUX1JFR0lPTmAvYENES19ERUZBVUxUX0FDQ09VTlRgIHRvIGxldCB0aGUgdGFyZ2V0IGVudmlyb25tZW50XG4gICAqIGRlcGVuZCBvbiB0aGUgQVdTIGNyZWRlbnRpYWxzL2NvbmZpZ3VyYXRpb24gdGhhdCB0aGUgQ0RLIENMSSBpcyBleGVjdXRlZFxuICAgKiB1bmRlciAocmVjb21tZW5kZWQgZm9yIGRldmVsb3BtZW50IHN0YWNrcykuXG4gICAqXG4gICAqIElmIHRoZSBgU3RhY2tgIGlzIGluc3RhbnRpYXRlZCBpbnNpZGUgYSBgU3RhZ2VgLCBhbnkgdW5kZWZpbmVkXG4gICAqIGByZWdpb25gL2BhY2NvdW50YCBmaWVsZHMgZnJvbSBgZW52YCB3aWxsIGRlZmF1bHQgdG8gdGhlIHNhbWUgZmllbGQgb24gdGhlXG4gICAqIGVuY29tcGFzc2luZyBgU3RhZ2VgLCBpZiBjb25maWd1cmVkIHRoZXJlLlxuICAgKlxuICAgKiBJZiBlaXRoZXIgYHJlZ2lvbmAgb3IgYGFjY291bnRgIGFyZSBub3Qgc2V0IG5vciBpbmhlcml0ZWQgZnJvbSBgU3RhZ2VgLCB0aGVcbiAgICogU3RhY2sgd2lsbCBiZSBjb25zaWRlcmVkIFwiKmVudmlyb25tZW50LWFnbm9zdGljKlwiXCIuIEVudmlyb25tZW50LWFnbm9zdGljXG4gICAqIHN0YWNrcyBjYW4gYmUgZGVwbG95ZWQgdG8gYW55IGVudmlyb25tZW50IGJ1dCBtYXkgbm90IGJlIGFibGUgdG8gdGFrZVxuICAgKiBhZHZhbnRhZ2Ugb2YgYWxsIGZlYXR1cmVzIG9mIHRoZSBDREsuIEZvciBleGFtcGxlLCB0aGV5IHdpbGwgbm90IGJlIGFibGUgdG9cbiAgICogdXNlIGVudmlyb25tZW50YWwgY29udGV4dCBsb29rdXBzIHN1Y2ggYXMgYGVjMi5WcGMuZnJvbUxvb2t1cGAgYW5kIHdpbGwgbm90XG4gICAqIGF1dG9tYXRpY2FsbHkgdHJhbnNsYXRlIFNlcnZpY2UgUHJpbmNpcGFscyB0byB0aGUgcmlnaHQgZm9ybWF0IGJhc2VkIG9uIHRoZVxuICAgKiBlbnZpcm9ubWVudCdzIEFXUyBwYXJ0aXRpb24sIGFuZCBvdGhlciBzdWNoIGVuaGFuY2VtZW50cy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogLy8gVXNlIGEgY29uY3JldGUgYWNjb3VudCBhbmQgcmVnaW9uIHRvIGRlcGxveSB0aGlzIHN0YWNrIHRvOlxuICAgKiAvLyBgLmFjY291bnRgIGFuZCBgLnJlZ2lvbmAgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZXNlIHZhbHVlcy5cbiAgICogbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScsIHtcbiAgICogICBlbnY6IHtcbiAgICogICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgKiAgICAgcmVnaW9uOiAndXMtZWFzdC0xJ1xuICAgKiAgIH0sXG4gICAqIH0pO1xuICAgKlxuICAgKiAvLyBVc2UgdGhlIENMSSdzIGN1cnJlbnQgY3JlZGVudGlhbHMgdG8gZGV0ZXJtaW5lIHRoZSB0YXJnZXQgZW52aXJvbm1lbnQ6XG4gICAqIC8vIGAuYWNjb3VudGAgYW5kIGAucmVnaW9uYCB3aWxsIHJlZmxlY3QgdGhlIGFjY291bnQrcmVnaW9uIHRoZSBDTElcbiAgICogLy8gaXMgY29uZmlndXJlZCB0byB1c2UgKGJhc2VkIG9uIHRoZSB1c2VyIENMSSBjcmVkZW50aWFscylcbiAgICogbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHtcbiAgICogICBlbnY6IHtcbiAgICogICAgIGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsXG4gICAqICAgICByZWdpb246IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX1JFR0lPTlxuICAgKiAgIH0sXG4gICAqIH0pO1xuICAgKlxuICAgKiAvLyBEZWZpbmUgbXVsdGlwbGUgc3RhY2tzIHN0YWdlIGFzc29jaWF0ZWQgd2l0aCBhbiBlbnZpcm9ubWVudFxuICAgKiBjb25zdCBteVN0YWdlID0gbmV3IFN0YWdlKGFwcCwgJ015U3RhZ2UnLCB7XG4gICAqICAgZW52OiB7XG4gICAqICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICogICAgIHJlZ2lvbjogJ3VzLWVhc3QtMSdcbiAgICogICB9XG4gICAqIH0pO1xuICAgKlxuICAgKiAvLyBib3RoIG9mIHRoZXNlIHN0YWNrcyB3aWxsIHVzZSB0aGUgc3RhZ2UncyBhY2NvdW50L3JlZ2lvbjpcbiAgICogLy8gYC5hY2NvdW50YCBhbmQgYC5yZWdpb25gIHdpbGwgcmVzb2x2ZSB0byB0aGUgY29uY3JldGUgdmFsdWVzIGFzIGFib3ZlXG4gICAqIG5ldyBNeVN0YWNrKG15U3RhZ2UsICdTdGFjazEnKTtcbiAgICogbmV3IFlvdXJTdGFjayhteVN0YWdlLCAnU3RhY2syJyk7XG4gICAqXG4gICAqIC8vIERlZmluZSBhbiBlbnZpcm9ubWVudC1hZ25vc3RpYyBzdGFjazpcbiAgICogLy8gYC5hY2NvdW50YCBhbmQgYC5yZWdpb25gIHdpbGwgcmVzb2x2ZSB0byBgeyBcIlJlZlwiOiBcIkFXUzo6QWNjb3VudElkXCIgfWAgYW5kIGB7IFwiUmVmXCI6IFwiQVdTOjpSZWdpb25cIiB9YCByZXNwZWN0aXZlbHkuXG4gICAqIC8vIHdoaWNoIHdpbGwgb25seSByZXNvbHZlIHRvIGFjdHVhbCB2YWx1ZXMgYnkgQ2xvdWRGb3JtYXRpb24gZHVyaW5nIGRlcGxveW1lbnQuXG4gICAqIG5ldyBNeVN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBlbnZpcm9ubWVudCBvZiB0aGUgY29udGFpbmluZyBgU3RhZ2VgIGlmIGF2YWlsYWJsZSxcbiAgICogb3RoZXJ3aXNlIGNyZWF0ZSB0aGUgc3RhY2sgd2lsbCBiZSBlbnZpcm9ubWVudC1hZ25vc3RpYy5cbiAgICovXG4gIHJlYWRvbmx5IGVudj86IEVudmlyb25tZW50O1xuXG4gIC8qKlxuICAgKiBOYW1lIHRvIGRlcGxveSB0aGUgc3RhY2sgd2l0aFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERlcml2ZWQgZnJvbSBjb25zdHJ1Y3QgcGF0aC5cbiAgICovXG4gIHJlYWRvbmx5IHN0YWNrTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogU3RhY2sgdGFncyB0aGF0IHdpbGwgYmUgYXBwbGllZCB0byBhbGwgdGhlIHRhZ2dhYmxlIHJlc291cmNlcyBhbmQgdGhlIHN0YWNrIGl0c2VsZi5cbiAgICpcbiAgICogQGRlZmF1bHQge31cbiAgICovXG4gIHJlYWRvbmx5IHRhZ3M/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIC8qKlxuICAgKiBTeW50aGVzaXMgbWV0aG9kIHRvIHVzZSB3aGlsZSBkZXBsb3lpbmcgdGhpcyBzdGFja1xuICAgKlxuICAgKiBUaGUgU3RhY2sgU3ludGhlc2l6ZXIgY29udHJvbHMgYXNwZWN0cyBvZiBzeW50aGVzaXMgYW5kIGRlcGxveW1lbnQsXG4gICAqIGxpa2UgaG93IGFzc2V0cyBhcmUgcmVmZXJlbmNlZCBhbmQgd2hhdCBJQU0gcm9sZXMgdG8gdXNlLiBGb3IgbW9yZVxuICAgKiBpbmZvcm1hdGlvbiwgc2VlIHRoZSBSRUFETUUgb2YgdGhlIG1haW4gQ0RLIHBhY2thZ2UuXG4gICAqXG4gICAqIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBgZGVmYXVsdFN0YWNrU3ludGhlc2l6ZXJgIGZyb20gYEFwcGAgd2lsbCBiZSB1c2VkLlxuICAgKiBJZiB0aGF0IGlzIG5vdCBzcGVjaWZpZWQsIGBEZWZhdWx0U3RhY2tTeW50aGVzaXplcmAgaXMgdXNlZCBpZlxuICAgKiBgQGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzYCBpcyBzZXQgdG8gYHRydWVgIG9yIHRoZSBDREsgbWFqb3JcbiAgICogdmVyc2lvbiBpcyB2Mi4gSW4gQ0RLIHYxIGBMZWdhY3lTdGFja1N5bnRoZXNpemVyYCBpcyB0aGUgZGVmYXVsdCBpZiBub1xuICAgKiBvdGhlciBzeW50aGVzaXplciBpcyBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIHN5bnRoZXNpemVyIHNwZWNpZmllZCBvbiBgQXBwYCwgb3IgYERlZmF1bHRTdGFja1N5bnRoZXNpemVyYCBvdGhlcndpc2UuXG4gICAqL1xuICByZWFkb25seSBzeW50aGVzaXplcj86IElTdGFja1N5bnRoZXNpemVyO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGVuYWJsZSB0ZXJtaW5hdGlvbiBwcm90ZWN0aW9uIGZvciB0aGlzIHN0YWNrLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgdGVybWluYXRpb25Qcm90ZWN0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW5jbHVkZSBydW50aW1lIHZlcnNpb25pbmcgaW5mb3JtYXRpb24gaW4gdGhpcyBTdGFja1xuICAgKlxuICAgKiBAZGVmYXVsdCBgYW5hbHl0aWNzUmVwb3J0aW5nYCBzZXR0aW5nIG9mIGNvbnRhaW5pbmcgYEFwcGAsIG9yIHZhbHVlIG9mXG4gICAqICdhd3M6Y2RrOnZlcnNpb24tcmVwb3J0aW5nJyBjb250ZXh0IGtleVxuICAgKi9cbiAgcmVhZG9ubHkgYW5hbHl0aWNzUmVwb3J0aW5nPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRW5hYmxlIHRoaXMgZmxhZyB0byBhbGxvdyBuYXRpdmUgY3Jvc3MgcmVnaW9uIHN0YWNrIHJlZmVyZW5jZXMuXG4gICAqXG4gICAqIEVuYWJsaW5nIHRoaXMgd2lsbCBjcmVhdGUgYSBDbG91ZEZvcm1hdGlvbiBjdXN0b20gcmVzb3VyY2VcbiAgICogaW4gYm90aCB0aGUgcHJvZHVjaW5nIHN0YWNrIGFuZCBjb25zdW1pbmcgc3RhY2sgaW4gb3JkZXIgdG8gcGVyZm9ybSB0aGUgZXhwb3J0L2ltcG9ydFxuICAgKlxuICAgKiBUaGlzIGZlYXR1cmUgaXMgY3VycmVudGx5IGV4cGVyaW1lbnRhbFxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgY3Jvc3NSZWdpb25SZWZlcmVuY2VzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogT3B0aW9ucyBmb3IgYXBwbHlpbmcgYSBwZXJtaXNzaW9ucyBib3VuZGFyeSB0byBhbGwgSUFNIFJvbGVzXG4gICAqIGFuZCBVc2VycyBjcmVhdGVkIHdpdGhpbiB0aGlzIFN0YWdlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gcGVybWlzc2lvbnMgYm91bmRhcnkgaXMgYXBwbGllZFxuICAgKi9cbiAgcmVhZG9ubHkgcGVybWlzc2lvbnNCb3VuZGFyeT86IFBlcm1pc3Npb25zQm91bmRhcnk7XG59XG5cbi8qKlxuICogQSByb290IGNvbnN0cnVjdCB3aGljaCByZXByZXNlbnRzIGEgc2luZ2xlIENsb3VkRm9ybWF0aW9uIHN0YWNrLlxuICovXG5leHBvcnQgY2xhc3MgU3RhY2sgZXh0ZW5kcyBDb25zdHJ1Y3QgaW1wbGVtZW50cyBJVGFnZ2FibGUge1xuICAvKipcbiAgICogUmV0dXJuIHdoZXRoZXIgdGhlIGdpdmVuIG9iamVjdCBpcyBhIFN0YWNrLlxuICAgKlxuICAgKiBXZSBkbyBhdHRyaWJ1dGUgZGV0ZWN0aW9uIHNpbmNlIHdlIGNhbid0IHJlbGlhYmx5IHVzZSAnaW5zdGFuY2VvZicuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzU3RhY2soeDogYW55KTogeCBpcyBTdGFjayB7XG4gICAgcmV0dXJuIHggIT09IG51bGwgJiYgdHlwZW9mKHgpID09PSAnb2JqZWN0JyAmJiBTVEFDS19TWU1CT0wgaW4geDtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rcyB1cCB0aGUgZmlyc3Qgc3RhY2sgc2NvcGUgaW4gd2hpY2ggYGNvbnN0cnVjdGAgaXMgZGVmaW5lZC4gRmFpbHMgaWYgdGhlcmUgaXMgbm8gc3RhY2sgdXAgdGhlIHRyZWUuXG4gICAqIEBwYXJhbSBjb25zdHJ1Y3QgVGhlIGNvbnN0cnVjdCB0byBzdGFydCB0aGUgc2VhcmNoIGZyb20uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG9mKGNvbnN0cnVjdDogSUNvbnN0cnVjdCk6IFN0YWNrIHtcbiAgICAvLyB3ZSB3YW50IHRoaXMgdG8gYmUgYXMgY2hlYXAgYXMgcG9zc2libGUuIGNhY2hlIHRoaXMgcmVzdWx0IGJ5IG11dGF0aW5nXG4gICAgLy8gdGhlIG9iamVjdC4gYW5lY2RvdGFsbHksIGF0IHRoZSB0aW1lIG9mIHRoaXMgd3JpdGluZywgQGF3cy1jZGsvY29yZSB1bml0XG4gICAgLy8gdGVzdHMgaGl0IHRoaXMgY2FjaGUgMSwxMTIgdGltZXMsIEBhd3MtY2RrL2F3cy1jbG91ZGZvcm1hdGlvbiB1bml0IHRlc3RzXG4gICAgLy8gaGl0IHRoaXMgMiw0MzUgdGltZXMpLlxuICAgIGNvbnN0IGNhY2hlID0gKGNvbnN0cnVjdCBhcyBhbnkpW01ZX1NUQUNLX0NBQ0hFXSBhcyBTdGFjayB8IHVuZGVmaW5lZDtcbiAgICBpZiAoY2FjaGUpIHtcbiAgICAgIHJldHVybiBjYWNoZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdmFsdWUgPSBfbG9va3VwKGNvbnN0cnVjdCk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29uc3RydWN0LCBNWV9TVEFDS19DQUNIRSwge1xuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9sb29rdXAoYzogSUNvbnN0cnVjdCk6IFN0YWNrIHtcbiAgICAgIGlmIChTdGFjay5pc1N0YWNrKGMpKSB7XG4gICAgICAgIHJldHVybiBjO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBfc2NvcGUgPSBOb2RlLm9mKGMpLnNjb3BlO1xuICAgICAgaWYgKFN0YWdlLmlzU3RhZ2UoYykgfHwgIV9zY29wZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7Y29uc3RydWN0LmNvbnN0cnVjdG9yPy5uYW1lID8/ICdDb25zdHJ1Y3QnfSBhdCAnJHtOb2RlLm9mKGNvbnN0cnVjdCkucGF0aH0nIHNob3VsZCBiZSBjcmVhdGVkIGluIHRoZSBzY29wZSBvZiBhIFN0YWNrLCBidXQgbm8gU3RhY2sgZm91bmRgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9sb29rdXAoX3Njb3BlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGFncyB0byBiZSBhcHBsaWVkIHRvIHRoZSBzdGFjay5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0YWdzOiBUYWdNYW5hZ2VyO1xuXG4gIC8qKlxuICAgKiBPcHRpb25zIGZvciBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSAobGlrZSB2ZXJzaW9uLCB0cmFuc2Zvcm0sIGRlc2NyaXB0aW9uKS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0ZW1wbGF0ZU9wdGlvbnM6IElUZW1wbGF0ZU9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFRoZSBBV1MgcmVnaW9uIGludG8gd2hpY2ggdGhpcyBzdGFjayB3aWxsIGJlIGRlcGxveWVkIChlLmcuIGB1cy13ZXN0LTJgKS5cbiAgICpcbiAgICogVGhpcyB2YWx1ZSBpcyByZXNvbHZlZCBhY2NvcmRpbmcgdG8gdGhlIGZvbGxvd2luZyBydWxlczpcbiAgICpcbiAgICogMS4gVGhlIHZhbHVlIHByb3ZpZGVkIHRvIGBlbnYucmVnaW9uYCB3aGVuIHRoZSBzdGFjayBpcyBkZWZpbmVkLiBUaGlzIGNhblxuICAgKiAgICBlaXRoZXIgYmUgYSBjb25jcmV0ZSByZWdpb24gKGUuZy4gYHVzLXdlc3QtMmApIG9yIHRoZSBgQXdzLlJFR0lPTmBcbiAgICogICAgdG9rZW4uXG4gICAqIDMuIGBBd3MuUkVHSU9OYCwgd2hpY2ggaXMgcmVwcmVzZW50cyB0aGUgQ2xvdWRGb3JtYXRpb24gaW50cmluc2ljIHJlZmVyZW5jZVxuICAgKiAgICBgeyBcIlJlZlwiOiBcIkFXUzo6UmVnaW9uXCIgfWAgZW5jb2RlZCBhcyBhIHN0cmluZyB0b2tlbi5cbiAgICpcbiAgICogUHJlZmVyYWJseSwgeW91IHNob3VsZCB1c2UgdGhlIHJldHVybiB2YWx1ZSBhcyBhbiBvcGFxdWUgc3RyaW5nIGFuZCBub3RcbiAgICogYXR0ZW1wdCB0byBwYXJzZSBpdCB0byBpbXBsZW1lbnQgeW91ciBsb2dpYy4gSWYgeW91IGRvLCB5b3UgbXVzdCBmaXJzdFxuICAgKiBjaGVjayB0aGF0IGl0IGlzIGEgY29uY3JldGUgdmFsdWUgYW4gbm90IGFuIHVucmVzb2x2ZWQgdG9rZW4uIElmIHRoaXNcbiAgICogdmFsdWUgaXMgYW4gdW5yZXNvbHZlZCB0b2tlbiAoYFRva2VuLmlzVW5yZXNvbHZlZChzdGFjay5yZWdpb24pYCByZXR1cm5zXG4gICAqIGB0cnVlYCksIHRoaXMgaW1wbGllcyB0aGF0IHRoZSB1c2VyIHdpc2hlcyB0aGF0IHRoaXMgc3RhY2sgd2lsbCBzeW50aGVzaXplXG4gICAqIGludG8gYSAqKnJlZ2lvbi1hZ25vc3RpYyB0ZW1wbGF0ZSoqLiBJbiB0aGlzIGNhc2UsIHlvdXIgY29kZSBzaG91bGQgZWl0aGVyXG4gICAqIGZhaWwgKHRocm93IGFuIGVycm9yLCBlbWl0IGEgc3ludGggZXJyb3IgdXNpbmcgYEFubm90YXRpb25zLm9mKGNvbnN0cnVjdCkuYWRkRXJyb3IoKWApIG9yXG4gICAqIGltcGxlbWVudCBzb21lIG90aGVyIHJlZ2lvbi1hZ25vc3RpYyBiZWhhdmlvci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSByZWdpb246IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFXUyBhY2NvdW50IGludG8gd2hpY2ggdGhpcyBzdGFjayB3aWxsIGJlIGRlcGxveWVkLlxuICAgKlxuICAgKiBUaGlzIHZhbHVlIGlzIHJlc29sdmVkIGFjY29yZGluZyB0byB0aGUgZm9sbG93aW5nIHJ1bGVzOlxuICAgKlxuICAgKiAxLiBUaGUgdmFsdWUgcHJvdmlkZWQgdG8gYGVudi5hY2NvdW50YCB3aGVuIHRoZSBzdGFjayBpcyBkZWZpbmVkLiBUaGlzIGNhblxuICAgKiAgICBlaXRoZXIgYmUgYSBjb25jcmV0ZSBhY2NvdW50IChlLmcuIGA1ODU2OTUwMzExMTFgKSBvciB0aGVcbiAgICogICAgYEF3cy5BQ0NPVU5UX0lEYCB0b2tlbi5cbiAgICogMy4gYEF3cy5BQ0NPVU5UX0lEYCwgd2hpY2ggcmVwcmVzZW50cyB0aGUgQ2xvdWRGb3JtYXRpb24gaW50cmluc2ljIHJlZmVyZW5jZVxuICAgKiAgICBgeyBcIlJlZlwiOiBcIkFXUzo6QWNjb3VudElkXCIgfWAgZW5jb2RlZCBhcyBhIHN0cmluZyB0b2tlbi5cbiAgICpcbiAgICogUHJlZmVyYWJseSwgeW91IHNob3VsZCB1c2UgdGhlIHJldHVybiB2YWx1ZSBhcyBhbiBvcGFxdWUgc3RyaW5nIGFuZCBub3RcbiAgICogYXR0ZW1wdCB0byBwYXJzZSBpdCB0byBpbXBsZW1lbnQgeW91ciBsb2dpYy4gSWYgeW91IGRvLCB5b3UgbXVzdCBmaXJzdFxuICAgKiBjaGVjayB0aGF0IGl0IGlzIGEgY29uY3JldGUgdmFsdWUgYW4gbm90IGFuIHVucmVzb2x2ZWQgdG9rZW4uIElmIHRoaXNcbiAgICogdmFsdWUgaXMgYW4gdW5yZXNvbHZlZCB0b2tlbiAoYFRva2VuLmlzVW5yZXNvbHZlZChzdGFjay5hY2NvdW50KWAgcmV0dXJuc1xuICAgKiBgdHJ1ZWApLCB0aGlzIGltcGxpZXMgdGhhdCB0aGUgdXNlciB3aXNoZXMgdGhhdCB0aGlzIHN0YWNrIHdpbGwgc3ludGhlc2l6ZVxuICAgKiBpbnRvIGEgKiphY2NvdW50LWFnbm9zdGljIHRlbXBsYXRlKiouIEluIHRoaXMgY2FzZSwgeW91ciBjb2RlIHNob3VsZCBlaXRoZXJcbiAgICogZmFpbCAodGhyb3cgYW4gZXJyb3IsIGVtaXQgYSBzeW50aCBlcnJvciB1c2luZyBgQW5ub3RhdGlvbnMub2YoY29uc3RydWN0KS5hZGRFcnJvcigpYCkgb3JcbiAgICogaW1wbGVtZW50IHNvbWUgb3RoZXIgcmVnaW9uLWFnbm9zdGljIGJlaGF2aW9yLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFjY291bnQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGVudmlyb25tZW50IGNvb3JkaW5hdGVzIGluIHdoaWNoIHRoaXMgc3RhY2sgaXMgZGVwbG95ZWQuIEluIHRoZSBmb3JtXG4gICAqIGBhd3M6Ly9hY2NvdW50L3JlZ2lvbmAuIFVzZSBgc3RhY2suYWNjb3VudGAgYW5kIGBzdGFjay5yZWdpb25gIHRvIG9idGFpblxuICAgKiB0aGUgc3BlY2lmaWMgdmFsdWVzLCBubyBuZWVkIHRvIHBhcnNlLlxuICAgKlxuICAgKiBZb3UgY2FuIHVzZSB0aGlzIHZhbHVlIHRvIGRldGVybWluZSBpZiB0d28gc3RhY2tzIGFyZSB0YXJnZXRpbmcgdGhlIHNhbWVcbiAgICogZW52aXJvbm1lbnQuXG4gICAqXG4gICAqIElmIGVpdGhlciBgc3RhY2suYWNjb3VudGAgb3IgYHN0YWNrLnJlZ2lvbmAgYXJlIG5vdCBjb25jcmV0ZSB2YWx1ZXMgKGUuZy5cbiAgICogYEF3cy5BQ0NPVU5UX0lEYCBvciBgQXdzLlJFR0lPTmApIHRoZSBzcGVjaWFsIHN0cmluZ3MgYHVua25vd24tYWNjb3VudGAgYW5kL29yXG4gICAqIGB1bmtub3duLXJlZ2lvbmAgd2lsbCBiZSB1c2VkIHJlc3BlY3RpdmVseSB0byBpbmRpY2F0ZSB0aGlzIHN0YWNrIGlzXG4gICAqIHJlZ2lvbi9hY2NvdW50LWFnbm9zdGljLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGVudmlyb25tZW50OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGVybWluYXRpb24gcHJvdGVjdGlvbiBpcyBlbmFibGVkIGZvciB0aGlzIHN0YWNrLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHRlcm1pbmF0aW9uUHJvdGVjdGlvbj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIHRoaXMgaXMgYSBuZXN0ZWQgc3RhY2ssIHRoaXMgcmVwcmVzZW50cyBpdHMgYEFXUzo6Q2xvdWRGb3JtYXRpb246OlN0YWNrYFxuICAgKiByZXNvdXJjZS4gYHVuZGVmaW5lZGAgZm9yIHRvcC1sZXZlbCAobm9uLW5lc3RlZCkgc3RhY2tzLlxuICAgKlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG5lc3RlZFN0YWNrUmVzb3VyY2U/OiBDZm5SZXNvdXJjZTtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIGZpbGUgZW1pdHRlZCB0byB0aGUgb3V0cHV0XG4gICAqIGRpcmVjdG9yeSBkdXJpbmcgc3ludGhlc2lzLlxuICAgKlxuICAgKiBFeGFtcGxlIHZhbHVlOiBgTXlTdGFjay50ZW1wbGF0ZS5qc29uYFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHRlbXBsYXRlRmlsZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIGNsb3VkIGFzc2VtYmx5IGFydGlmYWN0IGZvciB0aGlzIHN0YWNrLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFydGlmYWN0SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogU3ludGhlc2lzIG1ldGhvZCBmb3IgdGhpcyBzdGFja1xuICAgKlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN5bnRoZXNpemVyOiBJU3RhY2tTeW50aGVzaXplcjtcblxuICAvKipcbiAgICogV2hldGhlciB2ZXJzaW9uIHJlcG9ydGluZyBpcyBlbmFibGVkIGZvciB0aGlzIHN0YWNrXG4gICAqXG4gICAqIENvbnRyb2xzIHdoZXRoZXIgdGhlIENESyBNZXRhZGF0YSByZXNvdXJjZSBpcyBpbmplY3RlZFxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBfdmVyc2lvblJlcG9ydGluZ0VuYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgY3Jvc3MgcmVnaW9uIHJlZmVyZW5jZXMgYXJlIGVuYWJsZWQgZm9yIHRoaXMgc3RhY2tcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgX2Nyb3NzUmVnaW9uUmVmZXJlbmNlczogYm9vbGVhbjtcblxuICAvKipcbiAgICogTG9naWNhbCBJRCBnZW5lcmF0aW9uIHN0cmF0ZWd5XG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9sb2dpY2FsSWRzOiBMb2dpY2FsSURzO1xuXG4gIC8qKlxuICAgKiBPdGhlciBzdGFja3MgdGhpcyBzdGFjayBkZXBlbmRzIG9uXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9zdGFja0RlcGVuZGVuY2llczogeyBbdW5pcXVlSWQ6IHN0cmluZ106IFN0YWNrRGVwZW5kZW5jeSB9O1xuXG4gIC8qKlxuICAgKiBMaXN0cyBhbGwgbWlzc2luZyBjb250ZXh0dWFsIGluZm9ybWF0aW9uLlxuICAgKiBUaGlzIGlzIHJldHVybmVkIHdoZW4gdGhlIHN0YWNrIGlzIHN5bnRoZXNpemVkIHVuZGVyIHRoZSAnbWlzc2luZycgYXR0cmlidXRlXG4gICAqIGFuZCBhbGxvd3MgdG9vbGluZyB0byBvYnRhaW4gdGhlIGNvbnRleHQgYW5kIHJlLXN5bnRoZXNpemUuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9taXNzaW5nQ29udGV4dDogY3hzY2hlbWEuTWlzc2luZ0NvbnRleHRbXTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9zdGFja05hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBzdGFjay5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFBhcmVudCBvZiB0aGlzIHN0YWNrLCB1c3VhbGx5IGFuIGBBcHBgIG9yIGEgYFN0YWdlYCwgYnV0IGNvdWxkIGJlIGFueSBjb25zdHJ1Y3QuXG4gICAqIEBwYXJhbSBpZCBUaGUgY29uc3RydWN0IElEIG9mIHRoaXMgc3RhY2suIElmIGBzdGFja05hbWVgIGlzIG5vdCBleHBsaWNpdGx5XG4gICAqIGRlZmluZWQsIHRoaXMgaWQgKGFuZCBhbnkgcGFyZW50IElEcykgd2lsbCBiZSB1c2VkIHRvIGRldGVybWluZSB0aGVcbiAgICogcGh5c2ljYWwgSUQgb2YgdGhlIHN0YWNrLlxuICAgKiBAcGFyYW0gcHJvcHMgU3RhY2sgcHJvcGVydGllcy5cbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihzY29wZT86IENvbnN0cnVjdCwgaWQ/OiBzdHJpbmcsIHByb3BzOiBTdGFja1Byb3BzID0ge30pIHtcbiAgICAvLyBGb3IgdW5pdCB0ZXN0IHNjb3BlIGFuZCBpZCBhcmUgb3B0aW9uYWwgZm9yIHN0YWNrcywgYnV0IHdlIHN0aWxsIHdhbnQgYW4gQXBwXG4gICAgLy8gYXMgdGhlIHBhcmVudCBiZWNhdXNlIGFwcHMgaW1wbGVtZW50IG11Y2ggb2YgdGhlIHN5bnRoZXNpcyBsb2dpYy5cbiAgICBzY29wZSA9IHNjb3BlID8/IG5ldyBBcHAoe1xuICAgICAgYXV0b1N5bnRoOiBmYWxzZSxcbiAgICAgIG91dGRpcjogRmlsZVN5c3RlbS5ta2R0ZW1wKCdjZGstdGVzdC1hcHAtJyksXG4gICAgfSk7XG5cbiAgICAvLyBcIkRlZmF1bHRcIiBpcyBhIFwiaGlkZGVuIGlkXCIgZnJvbSBhIGBub2RlLnVuaXF1ZUlkYCBwZXJzcGVjdGl2ZVxuICAgIGlkID0gaWQgPz8gJ0RlZmF1bHQnO1xuXG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMuX21pc3NpbmdDb250ZXh0ID0gbmV3IEFycmF5PGN4c2NoZW1hLk1pc3NpbmdDb250ZXh0PigpO1xuICAgIHRoaXMuX3N0YWNrRGVwZW5kZW5jaWVzID0geyB9O1xuICAgIHRoaXMudGVtcGxhdGVPcHRpb25zID0geyB9O1xuICAgIHRoaXMuX2Nyb3NzUmVnaW9uUmVmZXJlbmNlcyA9ICEhcHJvcHMuY3Jvc3NSZWdpb25SZWZlcmVuY2VzO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFNUQUNLX1NZTUJPTCwgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuICAgIHRoaXMuX2xvZ2ljYWxJZHMgPSBuZXcgTG9naWNhbElEcygpO1xuXG4gICAgY29uc3QgeyBhY2NvdW50LCByZWdpb24sIGVudmlyb25tZW50IH0gPSB0aGlzLnBhcnNlRW52aXJvbm1lbnQocHJvcHMuZW52KTtcblxuICAgIHRoaXMuYWNjb3VudCA9IGFjY291bnQ7XG4gICAgdGhpcy5yZWdpb24gPSByZWdpb247XG4gICAgdGhpcy5lbnZpcm9ubWVudCA9IGVudmlyb25tZW50O1xuICAgIHRoaXMudGVybWluYXRpb25Qcm90ZWN0aW9uID0gcHJvcHMudGVybWluYXRpb25Qcm90ZWN0aW9uO1xuXG4gICAgaWYgKHByb3BzLmRlc2NyaXB0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE1heCBsZW5ndGggMTAyNCBieXRlc1xuICAgICAgLy8gVHlwaWNhbGx5IDIgYnl0ZXMgcGVyIGNoYXJhY3RlciwgbWF5IGJlIG1vcmUgZm9yIG1vcmUgZXhvdGljIGNoYXJhY3RlcnNcbiAgICAgIGlmIChwcm9wcy5kZXNjcmlwdGlvbi5sZW5ndGggPiA1MTIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTdGFjayBkZXNjcmlwdGlvbiBtdXN0IGJlIDw9IDEwMjQgYnl0ZXMuIFJlY2VpdmVkIGRlc2NyaXB0aW9uOiAnJHtwcm9wcy5kZXNjcmlwdGlvbn0nYCk7XG4gICAgICB9XG4gICAgICB0aGlzLnRlbXBsYXRlT3B0aW9ucy5kZXNjcmlwdGlvbiA9IHByb3BzLmRlc2NyaXB0aW9uO1xuICAgIH1cblxuICAgIHRoaXMuX3N0YWNrTmFtZSA9IHByb3BzLnN0YWNrTmFtZSA/PyB0aGlzLmdlbmVyYXRlU3RhY2tOYW1lKCk7XG4gICAgaWYgKHRoaXMuX3N0YWNrTmFtZS5sZW5ndGggPiAxMjgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU3RhY2sgbmFtZSBtdXN0IGJlIDw9IDEyOCBjaGFyYWN0ZXJzLiBTdGFjayBuYW1lOiAnJHt0aGlzLl9zdGFja05hbWV9J2ApO1xuICAgIH1cbiAgICB0aGlzLnRhZ3MgPSBuZXcgVGFnTWFuYWdlcihUYWdUeXBlLktFWV9WQUxVRSwgJ2F3czpjZGs6c3RhY2snLCBwcm9wcy50YWdzKTtcblxuICAgIGlmICghVkFMSURfU1RBQ0tfTkFNRV9SRUdFWC50ZXN0KHRoaXMuc3RhY2tOYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTdGFjayBuYW1lIG11c3QgbWF0Y2ggdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbjogJHtWQUxJRF9TVEFDS19OQU1FX1JFR0VYLnRvU3RyaW5nKCl9LCBnb3QgJyR7dGhpcy5zdGFja05hbWV9J2ApO1xuICAgIH1cblxuICAgIC8vIHRoZSBwcmVmZXJyZWQgYmVoYXZpb3IgaXMgdG8gZ2VuZXJhdGUgYSB1bmlxdWUgaWQgZm9yIHRoaXMgc3RhY2sgYW5kIHVzZVxuICAgIC8vIGl0IGFzIHRoZSBhcnRpZmFjdCBJRCBpbiB0aGUgYXNzZW1ibHkuIHRoaXMgYWxsb3dzIG11bHRpcGxlIHN0YWNrcyB0byB1c2VcbiAgICAvLyB0aGUgc2FtZSBuYW1lLiBob3dldmVyLCB0aGlzIGJlaGF2aW9yIGlzIGJyZWFraW5nIGZvciAxLnggc28gaXQncyBvbmx5XG4gICAgLy8gYXBwbGllZCB1bmRlciBhIGZlYXR1cmUgZmxhZyB3aGljaCBpcyBhcHBsaWVkIGF1dG9tYXRpY2FsbHkgZm9yIG5ld1xuICAgIC8vIHByb2plY3RzIGNyZWF0ZWQgdXNpbmcgYGNkayBpbml0YC5cbiAgICAvL1xuICAgIC8vIEFsc28gdXNlIHRoZSBuZXcgYmVoYXZpb3IgaWYgd2UgYXJlIHVzaW5nIHRoZSBuZXcgQ0kvQ0QtcmVhZHkgc3ludGhlc2l6ZXI7IHRoYXQgd2F5XG4gICAgLy8gcGVvcGxlIG9ubHkgaGF2ZSB0byBmbGlwIG9uZSBmbGFnLlxuICAgIGNvbnN0IGZlYXR1cmVGbGFncyA9IEZlYXR1cmVGbGFncy5vZih0aGlzKTtcbiAgICBjb25zdCBzdGFja05hbWVEdXBlQ29udGV4dCA9IGZlYXR1cmVGbGFncy5pc0VuYWJsZWQoY3hhcGkuRU5BQkxFX1NUQUNLX05BTUVfRFVQTElDQVRFU19DT05URVhUKTtcbiAgICBjb25zdCBuZXdTdHlsZVN5bnRoZXNpc0NvbnRleHQgPSBmZWF0dXJlRmxhZ3MuaXNFbmFibGVkKGN4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVCk7XG4gICAgdGhpcy5hcnRpZmFjdElkID0gKHN0YWNrTmFtZUR1cGVDb250ZXh0IHx8IG5ld1N0eWxlU3ludGhlc2lzQ29udGV4dClcbiAgICAgID8gdGhpcy5nZW5lcmF0ZVN0YWNrQXJ0aWZhY3RJZCgpXG4gICAgICA6IHRoaXMuc3RhY2tOYW1lO1xuXG4gICAgdGhpcy50ZW1wbGF0ZUZpbGUgPSBgJHt0aGlzLmFydGlmYWN0SWR9LnRlbXBsYXRlLmpzb25gO1xuXG4gICAgLy8gTm90IGZvciBuZXN0ZWQgc3RhY2tzXG4gICAgdGhpcy5fdmVyc2lvblJlcG9ydGluZ0VuYWJsZWQgPSAocHJvcHMuYW5hbHl0aWNzUmVwb3J0aW5nID8/IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KGN4YXBpLkFOQUxZVElDU19SRVBPUlRJTkdfRU5BQkxFRF9DT05URVhUKSlcbiAgICAgICYmICF0aGlzLm5lc3RlZFN0YWNrUGFyZW50O1xuXG4gICAgY29uc3Qgc3ludGhlc2l6ZXIgPSAocHJvcHMuc3ludGhlc2l6ZXJcbiAgICAgID8/IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KFBSSVZBVEVfQ09OVEVYVF9ERUZBVUxUX1NUQUNLX1NZTlRIRVNJWkVSKVxuICAgICAgPz8gKG5ld1N0eWxlU3ludGhlc2lzQ29udGV4dCA/IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcigpIDogbmV3IExlZ2FjeVN0YWNrU3ludGhlc2l6ZXIoKSkpO1xuXG4gICAgaWYgKGlzUmV1c2FibGVTdGFja1N5bnRoZXNpemVyKHN5bnRoZXNpemVyKSkge1xuICAgICAgLy8gUHJvZHVjZSBhIGZyZXNoIGluc3RhbmNlIGZvciBlYWNoIHN0YWNrIChzaG91bGQgaGF2ZSBiZWVuIHRoZSBkZWZhdWx0IGJlaGF2aW9yKVxuICAgICAgdGhpcy5zeW50aGVzaXplciA9IHN5bnRoZXNpemVyLnJldXNhYmxlQmluZCh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQmluZCB0aGUgc2luZ2xlIGluc3RhbmNlIGluLXBsYWNlIHRvIHRoZSBjdXJyZW50IHN0YWNrIChiYWNrd2FyZHMgY29tcGF0KVxuICAgICAgdGhpcy5zeW50aGVzaXplciA9IHN5bnRoZXNpemVyO1xuICAgICAgdGhpcy5zeW50aGVzaXplci5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHByb3BzLnBlcm1pc3Npb25zQm91bmRhcnk/Ll9iaW5kKHRoaXMpO1xuXG4gICAgLy8gYWRkIHRoZSBwZXJtaXNzaW9ucyBib3VuZGFyeSBhc3BlY3RcbiAgICB0aGlzLmFkZFBlcm1pc3Npb25zQm91bmRhcnlBc3BlY3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiBhIHBlcm1pc3Npb25zIGJvdW5kYXJ5IGhhcyBiZWVuIGFwcGxpZWQgb24gdGhpcyBzY29wZSBvciBhbnkgcGFyZW50IHNjb3BlXG4gICAqIHRoZW4gdGhpcyB3aWxsIHJldHVybiB0aGUgQVJOIG9mIHRoZSBwZXJtaXNzaW9ucyBib3VuZGFyeS5cbiAgICpcbiAgICogVGhpcyB3aWxsIHJldHVybiB0aGUgcGVybWlzc2lvbnMgYm91bmRhcnkgdGhhdCBoYXMgYmVlbiBhcHBsaWVkIHRvIHRoZSBtb3N0XG4gICAqIHNwZWNpZmljIHNjb3BlLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogY29uc3Qgc3RhZ2UgPSBuZXcgU3RhZ2UoYXBwLCAnc3RhZ2UnLCB7XG4gICAqICAgcGVybWlzc2lvbnNCb3VuZGFyeTogUGVybWlzc2lvbnNCb3VuZGFyeS5mcm9tTmFtZSgnc3RhZ2UtcGInKSxcbiAgICogfSk7XG4gICAqXG4gICAqIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHN0YWdlLCAnU3RhY2snLCB7XG4gICAqICAgcGVybWlzc2lvbnNCb3VuZGFyeTogUGVybWlzc2lvbnNCb3VuZGFyeS5mcm9tTmFtZSgnc29tZS1vdGhlci1wYicpLFxuICAgKiB9KTtcbiAgICpcbiAgICogIFN0YWNrLnBlcm1pc3Npb25zQm91bmRhcnlBcm4gPT09ICdhcm46JHtBV1M6OlBhcnRpdGlvbn06aWFtOjoke0FXUzo6QWNjb3VudElkfTpwb2xpY3kvc29tZS1vdGhlci1wYic7XG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSB0aGUgY29uc3RydWN0IHNjb3BlIHRvIHJldHJpZXZlIHRoZSBwZXJtaXNzaW9ucyBib3VuZGFyeSBuYW1lIGZyb21cbiAgICogQHJldHVybnMgdGhlIG5hbWUgb2YgdGhlIHBlcm1pc3Npb25zIGJvdW5kYXJ5IG9yIHVuZGVmaW5lZCBpZiBub3Qgc2V0XG4gICAqL1xuICBwcml2YXRlIGdldCBwZXJtaXNzaW9uc0JvdW5kYXJ5QXJuKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgcXVhbGlmaWVyID0gdGhpcy5zeW50aGVzaXplci5ib290c3RyYXBRdWFsaWZpZXJcbiAgICAgID8/IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KEJPT1RTVFJBUF9RVUFMSUZJRVJfQ09OVEVYVClcbiAgICAgID8/IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfUVVBTElGSUVSO1xuICAgIGNvbnN0IHNwZWMgPSBuZXcgU3RyaW5nU3BlY2lhbGl6ZXIodGhpcywgcXVhbGlmaWVyKTtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5ub2RlLnRyeUdldENvbnRleHQoUEVSTUlTU0lPTlNfQk9VTkRBUllfQ09OVEVYVF9LRVkpO1xuICAgIGxldCBhcm46IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBpZiAoY29udGV4dCAmJiBjb250ZXh0LmFybikge1xuICAgICAgYXJuID0gc3BlYy5zcGVjaWFsaXplKGNvbnRleHQuYXJuKTtcbiAgICB9IGVsc2UgaWYgKGNvbnRleHQgJiYgY29udGV4dC5uYW1lKSB7XG4gICAgICBhcm4gPSBzcGVjLnNwZWNpYWxpemUodGhpcy5mb3JtYXRBcm4oe1xuICAgICAgICBzZXJ2aWNlOiAnaWFtJyxcbiAgICAgICAgcmVzb3VyY2U6ICdwb2xpY3knLFxuICAgICAgICByZWdpb246ICcnLFxuICAgICAgICByZXNvdXJjZU5hbWU6IGNvbnRleHQubmFtZSxcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgaWYgKGFybiAmJlxuICAgICAgKGFybi5pbmNsdWRlcygnJHtRdWFsaWZpZXJ9JylcbiAgICAgIHx8IGFybi5pbmNsdWRlcygnJHtBV1M6OkFjY291bnRJZH0nKVxuICAgICAgfHwgYXJuLmluY2x1ZGVzKCcke0FXUzo6UmVnaW9ufScpXG4gICAgICB8fCBhcm4uaW5jbHVkZXMoJyR7QVdTOjpQYXJ0aXRpb259JykpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBwZXJtaXNzaW9ucyBib3VuZGFyeSAke2Fybn0gaW5jbHVkZXMgYSBwc2V1ZG8gcGFyYW1ldGVyLCBgICtcbiAgICAgICd3aGljaCBpcyBub3Qgc3VwcG9ydGVkIGZvciBlbnZpcm9ubWVudCBhZ25vc3RpYyBzdGFja3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIGFybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGFzcGVjdCB0byB0aGUgc3RhY2sgdGhhdCB3aWxsIGFwcGx5IHRoZSBwZXJtaXNzaW9ucyBib3VuZGFyeS5cbiAgICogVGhpcyB3aWxsIG9ubHkgYWRkIHRoZSBhc3BlY3QgaWYgdGhlIHBlcm1pc3Npb25zIGJvdW5kYXJ5IGhhcyBiZWVuIHNldFxuICAgKi9cbiAgcHJpdmF0ZSBhZGRQZXJtaXNzaW9uc0JvdW5kYXJ5QXNwZWN0KCk6IHZvaWQge1xuICAgIGNvbnN0IHBlcm1pc3Npb25zQm91bmRhcnlBcm4gPSB0aGlzLnBlcm1pc3Npb25zQm91bmRhcnlBcm47XG4gICAgaWYgKHBlcm1pc3Npb25zQm91bmRhcnlBcm4pIHtcbiAgICAgIEFzcGVjdHMub2YodGhpcykuYWRkKHtcbiAgICAgICAgdmlzaXQobm9kZTogSUNvbnN0cnVjdCkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIENmblJlc291cmNlLmlzQ2ZuUmVzb3VyY2Uobm9kZSkgJiZcbiAgICAgICAgICAgICAgKG5vZGUuY2ZuUmVzb3VyY2VUeXBlID09ICdBV1M6OklBTTo6Um9sZScgfHwgbm9kZS5jZm5SZXNvdXJjZVR5cGUgPT0gJ0FXUzo6SUFNOjpVc2VyJylcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIG5vZGUuYWRkUHJvcGVydHlPdmVycmlkZSgnUGVybWlzc2lvbnNCb3VuZGFyeScsIHBlcm1pc3Npb25zQm91bmRhcnlBcm4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc29sdmUgYSB0b2tlbml6ZWQgdmFsdWUgaW4gdGhlIGNvbnRleHQgb2YgdGhlIGN1cnJlbnQgc3RhY2suXG4gICAqL1xuICBwdWJsaWMgcmVzb2x2ZShvYmo6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHJlc29sdmUob2JqLCB7XG4gICAgICBzY29wZTogdGhpcyxcbiAgICAgIHByZWZpeDogW10sXG4gICAgICByZXNvbHZlcjogQ0xPVURGT1JNQVRJT05fVE9LRU5fUkVTT0xWRVIsXG4gICAgICBwcmVwYXJpbmc6IGZhbHNlLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYW4gb2JqZWN0LCBwb3RlbnRpYWxseSBjb250YWluaW5nIHRva2VucywgdG8gYSBKU09OIHN0cmluZ1xuICAgKi9cbiAgcHVibGljIHRvSnNvblN0cmluZyhvYmo6IGFueSwgc3BhY2U/OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBDbG91ZEZvcm1hdGlvbkxhbmcudG9KU09OKG9iaiwgc3BhY2UpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogREVQUkVDQVRFRFxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYHJlcG9ydE1pc3NpbmdDb250ZXh0S2V5KClgXG4gICAqL1xuICBwdWJsaWMgcmVwb3J0TWlzc2luZ0NvbnRleHQocmVwb3J0OiBjeGFwaS5NaXNzaW5nQ29udGV4dCkge1xuICAgIGlmICghT2JqZWN0LnZhbHVlcyhjeHNjaGVtYS5Db250ZXh0UHJvdmlkZXIpLmluY2x1ZGVzKHJlcG9ydC5wcm92aWRlciBhcyBjeHNjaGVtYS5Db250ZXh0UHJvdmlkZXIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gY29udGV4dCBwcm92aWRlciByZXF1ZXN0ZWQgaW46ICR7SlNPTi5zdHJpbmdpZnkocmVwb3J0KX1gKTtcbiAgICB9XG4gICAgdGhpcy5yZXBvcnRNaXNzaW5nQ29udGV4dEtleShyZXBvcnQgYXMgY3hzY2hlbWEuTWlzc2luZ0NvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlIHRoYXQgYSBjb250ZXh0IGtleSB3YXMgZXhwZWN0ZWRcbiAgICpcbiAgICogQ29udGFpbnMgaW5zdHJ1Y3Rpb25zIHdoaWNoIHdpbGwgYmUgZW1pdHRlZCBpbnRvIHRoZSBjbG91ZCBhc3NlbWJseSBvbiBob3dcbiAgICogdGhlIGtleSBzaG91bGQgYmUgc3VwcGxpZWQuXG4gICAqXG4gICAqIEBwYXJhbSByZXBvcnQgVGhlIHNldCBvZiBwYXJhbWV0ZXJzIG5lZWRlZCB0byBvYnRhaW4gdGhlIGNvbnRleHRcbiAgICovXG4gIHB1YmxpYyByZXBvcnRNaXNzaW5nQ29udGV4dEtleShyZXBvcnQ6IGN4c2NoZW1hLk1pc3NpbmdDb250ZXh0KSB7XG4gICAgdGhpcy5fbWlzc2luZ0NvbnRleHQucHVzaChyZXBvcnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmFtZSBhIGdlbmVyYXRlZCBsb2dpY2FsIGlkZW50aXRpZXNcbiAgICpcbiAgICogVG8gbW9kaWZ5IHRoZSBuYW1pbmcgc2NoZW1lIHN0cmF0ZWd5LCBleHRlbmQgdGhlIGBTdGFja2AgY2xhc3MgYW5kXG4gICAqIG92ZXJyaWRlIHRoZSBgYWxsb2NhdGVMb2dpY2FsSWRgIG1ldGhvZC5cbiAgICovXG4gIHB1YmxpYyByZW5hbWVMb2dpY2FsSWQob2xkSWQ6IHN0cmluZywgbmV3SWQ6IHN0cmluZykge1xuICAgIHRoaXMuX2xvZ2ljYWxJZHMuYWRkUmVuYW1lKG9sZElkLCBuZXdJZCk7XG4gIH1cblxuICAvKipcbiAgICogQWxsb2NhdGVzIGEgc3RhY2stdW5pcXVlIENsb3VkRm9ybWF0aW9uLWNvbXBhdGlibGUgbG9naWNhbCBpZGVudGl0eSBmb3IgYVxuICAgKiBzcGVjaWZpYyByZXNvdXJjZS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHdoZW4gYSBgQ2ZuRWxlbWVudGAgaXMgY3JlYXRlZCBhbmQgdXNlZCB0byByZW5kZXIgdGhlXG4gICAqIGluaXRpYWwgbG9naWNhbCBpZGVudGl0eSBvZiByZXNvdXJjZXMuIExvZ2ljYWwgSUQgcmVuYW1lcyBhcmUgYXBwbGllZCBhdFxuICAgKiB0aGlzIHN0YWdlLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCB1c2VzIHRoZSBwcm90ZWN0ZWQgbWV0aG9kIGBhbGxvY2F0ZUxvZ2ljYWxJZGAgdG8gcmVuZGVyIHRoZVxuICAgKiBsb2dpY2FsIElEIGZvciBhbiBlbGVtZW50LiBUbyBtb2RpZnkgdGhlIG5hbWluZyBzY2hlbWUsIGV4dGVuZCB0aGUgYFN0YWNrYFxuICAgKiBjbGFzcyBhbmQgb3ZlcnJpZGUgdGhpcyBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSBDbG91ZEZvcm1hdGlvbiBlbGVtZW50IGZvciB3aGljaCBhIGxvZ2ljYWwgaWRlbnRpdHkgaXNcbiAgICogbmVlZGVkLlxuICAgKi9cbiAgcHVibGljIGdldExvZ2ljYWxJZChlbGVtZW50OiBDZm5FbGVtZW50KTogc3RyaW5nIHtcbiAgICBjb25zdCBsb2dpY2FsSWQgPSB0aGlzLmFsbG9jYXRlTG9naWNhbElkKGVsZW1lbnQpO1xuICAgIHJldHVybiB0aGlzLl9sb2dpY2FsSWRzLmFwcGx5UmVuYW1lKGxvZ2ljYWxJZCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgZGVwZW5kZW5jeSBiZXR3ZWVuIHRoaXMgc3RhY2sgYW5kIGFub3RoZXIgc3RhY2suXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gZGVmaW5lIGRlcGVuZGVuY2llcyBiZXR3ZWVuIGFueSB0d28gc3RhY2tzIHdpdGhpbiBhblxuICAgKiBhcHAsIGFuZCBhbHNvIHN1cHBvcnRzIG5lc3RlZCBzdGFja3MuXG4gICAqL1xuICBwdWJsaWMgYWRkRGVwZW5kZW5jeSh0YXJnZXQ6IFN0YWNrLCByZWFzb24/OiBzdHJpbmcpIHtcbiAgICBhZGREZXBlbmRlbmN5KHRoaXMsIHRhcmdldCwgcmVhc29uID8/IGB7JHt0aGlzLm5vZGUucGF0aH19LmFkZERlcGVuZGVuY3koeyR7dGFyZ2V0Lm5vZGUucGF0aH19KWApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgc3RhY2tzIHRoaXMgc3RhY2sgZGVwZW5kcyBvblxuICAgKi9cbiAgcHVibGljIGdldCBkZXBlbmRlbmNpZXMoKTogU3RhY2tbXSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5fc3RhY2tEZXBlbmRlbmNpZXMpLm1hcCh4ID0+IHguc3RhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjb25jcmV0ZSBDbG91ZEZvcm1hdGlvbiBwaHlzaWNhbCBzdGFjayBuYW1lLlxuICAgKlxuICAgKiBUaGlzIGlzIGVpdGhlciB0aGUgbmFtZSBkZWZpbmVkIGV4cGxpY2l0bHkgaW4gdGhlIGBzdGFja05hbWVgIHByb3Agb3JcbiAgICogYWxsb2NhdGVkIGJhc2VkIG9uIHRoZSBzdGFjaydzIGxvY2F0aW9uIGluIHRoZSBjb25zdHJ1Y3QgdHJlZS4gU3RhY2tzIHRoYXRcbiAgICogYXJlIGRpcmVjdGx5IGRlZmluZWQgdW5kZXIgdGhlIGFwcCB1c2UgdGhlaXIgY29uc3RydWN0IGBpZGAgYXMgdGhlaXIgc3RhY2tcbiAgICogbmFtZS4gU3RhY2tzIHRoYXQgYXJlIGRlZmluZWQgZGVlcGVyIHdpdGhpbiB0aGUgdHJlZSB3aWxsIHVzZSBhIGhhc2hlZCBuYW1pbmdcbiAgICogc2NoZW1lIGJhc2VkIG9uIHRoZSBjb25zdHJ1Y3QgcGF0aCB0byBlbnN1cmUgdW5pcXVlbmVzcy5cbiAgICpcbiAgICogSWYgeW91IHdpc2ggdG8gb2J0YWluIHRoZSBkZXBsb3ktdGltZSBBV1M6OlN0YWNrTmFtZSBpbnRyaW5zaWMsXG4gICAqIHlvdSBjYW4gdXNlIGBBd3MuU1RBQ0tfTkFNRWAgZGlyZWN0bHkuXG4gICAqL1xuICBwdWJsaWMgZ2V0IHN0YWNrTmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9zdGFja05hbWU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHBhcnRpdGlvbiBpbiB3aGljaCB0aGlzIHN0YWNrIGlzIGRlZmluZWRcbiAgICovXG4gIHB1YmxpYyBnZXQgcGFydGl0aW9uKCk6IHN0cmluZyB7XG4gICAgLy8gUmV0dXJuIGEgbm9uLXNjb3BlZCBwYXJ0aXRpb24gaW50cmluc2ljIHdoZW4gdGhlIHN0YWNrJ3MgcmVnaW9uIGlzXG4gICAgLy8gdW5yZXNvbHZlZCBvciB1bmtub3duLiAgT3RoZXJ3aXNlIHdlIHdpbGwgcmV0dXJuIHRoZSBwYXJ0aXRpb24gbmFtZSBhc1xuICAgIC8vIGEgbGl0ZXJhbCBzdHJpbmcuXG4gICAgaWYgKCFGZWF0dXJlRmxhZ3Mub2YodGhpcykuaXNFbmFibGVkKGN4YXBpLkVOQUJMRV9QQVJUSVRJT05fTElURVJBTFMpIHx8IFRva2VuLmlzVW5yZXNvbHZlZCh0aGlzLnJlZ2lvbikpIHtcbiAgICAgIHJldHVybiBBd3MuUEFSVElUSU9OO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwYXJ0aXRpb24gPSBSZWdpb25JbmZvLmdldCh0aGlzLnJlZ2lvbikucGFydGl0aW9uO1xuICAgICAgcmV0dXJuIHBhcnRpdGlvbiA/PyBBd3MuUEFSVElUSU9OO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQW1hem9uIGRvbWFpbiBzdWZmaXggZm9yIHRoZSByZWdpb24gaW4gd2hpY2ggdGhpcyBzdGFjayBpcyBkZWZpbmVkXG4gICAqL1xuICBwdWJsaWMgZ2V0IHVybFN1ZmZpeCgpOiBzdHJpbmcge1xuICAgIC8vIFNpbmNlIFVSTCBTdWZmaXggYWx3YXlzIGZvbGxvd3MgcGFydGl0aW9uLCBpdCBpcyB1bnNjb3BlZCBsaWtlIHBhcnRpdGlvbiBpcy5cbiAgICByZXR1cm4gQXdzLlVSTF9TVUZGSVg7XG4gIH1cblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBzdGFja1xuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBBZnRlciByZXNvbHZpbmcsIGxvb2tzIGxpa2VcbiAgICogJ2Fybjphd3M6Y2xvdWRmb3JtYXRpb246dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpzdGFjay90ZXN0c3RhY2svNTFhZjNkYzAtZGE3Ny0xMWU0LTg3MmUtMTIzNDU2N2RiMTIzJ1xuICAgKi9cbiAgcHVibGljIGdldCBzdGFja0lkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBTY29wZWRBd3ModGhpcykuc3RhY2tJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBsaXN0IG9mIG5vdGlmaWNhdGlvbiBBbWF6b24gUmVzb3VyY2UgTmFtZXMgKEFSTnMpIGZvciB0aGUgY3VycmVudCBzdGFjay5cbiAgICovXG4gIHB1YmxpYyBnZXQgbm90aWZpY2F0aW9uQXJucygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIG5ldyBTY29wZWRBd3ModGhpcykubm90aWZpY2F0aW9uQXJucztcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgdGhpcyBpcyBhIG5lc3RlZCBzdGFjaywgaW4gd2hpY2ggY2FzZSBgcGFyZW50U3RhY2tgIHdpbGwgaW5jbHVkZSBhIHJlZmVyZW5jZSB0byBpdCdzIHBhcmVudC5cbiAgICovXG4gIHB1YmxpYyBnZXQgbmVzdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm5lc3RlZFN0YWNrUmVzb3VyY2UgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIEFSTiBmcm9tIGNvbXBvbmVudHMuXG4gICAqXG4gICAqIElmIGBwYXJ0aXRpb25gLCBgcmVnaW9uYCBvciBgYWNjb3VudGAgYXJlIG5vdCBzcGVjaWZpZWQsIHRoZSBzdGFjaydzXG4gICAqIHBhcnRpdGlvbiwgcmVnaW9uIGFuZCBhY2NvdW50IHdpbGwgYmUgdXNlZC5cbiAgICpcbiAgICogSWYgYW55IGNvbXBvbmVudCBpcyB0aGUgZW1wdHkgc3RyaW5nLCBhbiBlbXB0eSBzdHJpbmcgd2lsbCBiZSBpbnNlcnRlZFxuICAgKiBpbnRvIHRoZSBnZW5lcmF0ZWQgQVJOIGF0IHRoZSBsb2NhdGlvbiB0aGF0IGNvbXBvbmVudCBjb3JyZXNwb25kcyB0by5cbiAgICpcbiAgICogVGhlIEFSTiB3aWxsIGJlIGZvcm1hdHRlZCBhcyBmb2xsb3dzOlxuICAgKlxuICAgKiAgIGFybjp7cGFydGl0aW9ufTp7c2VydmljZX06e3JlZ2lvbn06e2FjY291bnR9OntyZXNvdXJjZX17c2VwfXtyZXNvdXJjZS1uYW1lfVxuICAgKlxuICAgKiBUaGUgcmVxdWlyZWQgQVJOIHBpZWNlcyB0aGF0IGFyZSBvbWl0dGVkIHdpbGwgYmUgdGFrZW4gZnJvbSB0aGUgc3RhY2sgdGhhdFxuICAgKiB0aGUgJ3Njb3BlJyBpcyBhdHRhY2hlZCB0by4gSWYgYWxsIEFSTiBwaWVjZXMgYXJlIHN1cHBsaWVkLCB0aGUgc3VwcGxpZWQgc2NvcGVcbiAgICogY2FuIGJlICd1bmRlZmluZWQnLlxuICAgKi9cbiAgcHVibGljIGZvcm1hdEFybihjb21wb25lbnRzOiBBcm5Db21wb25lbnRzKTogc3RyaW5nIHtcbiAgICByZXR1cm4gQXJuLmZvcm1hdChjb21wb25lbnRzLCB0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhbiBBUk4sIHBhcnNlcyBpdCBhbmQgcmV0dXJucyBjb21wb25lbnRzLlxuICAgKlxuICAgKiBJRiBUSEUgQVJOIElTIEEgQ09OQ1JFVEUgU1RSSU5HLi4uXG4gICAqXG4gICAqIC4uLml0IHdpbGwgYmUgcGFyc2VkIGFuZCB2YWxpZGF0ZWQuIFRoZSBzZXBhcmF0b3IgKGBzZXBgKSB3aWxsIGJlIHNldCB0byAnLydcbiAgICogaWYgdGhlIDZ0aCBjb21wb25lbnQgaW5jbHVkZXMgYSAnLycsIGluIHdoaWNoIGNhc2UsIGByZXNvdXJjZWAgd2lsbCBiZSBzZXRcbiAgICogdG8gdGhlIHZhbHVlIGJlZm9yZSB0aGUgJy8nIGFuZCBgcmVzb3VyY2VOYW1lYCB3aWxsIGJlIHRoZSByZXN0LiBJbiBjYXNlXG4gICAqIHRoZXJlIGlzIG5vICcvJywgYHJlc291cmNlYCB3aWxsIGJlIHNldCB0byB0aGUgNnRoIGNvbXBvbmVudHMgYW5kXG4gICAqIGByZXNvdXJjZU5hbWVgIHdpbGwgYmUgc2V0IHRvIHRoZSByZXN0IG9mIHRoZSBzdHJpbmcuXG4gICAqXG4gICAqIElGIFRIRSBBUk4gSVMgQSBUT0tFTi4uLlxuICAgKlxuICAgKiAuLi5pdCBjYW5ub3QgYmUgdmFsaWRhdGVkLCBzaW5jZSB3ZSBkb24ndCBoYXZlIHRoZSBhY3R1YWwgdmFsdWUgeWV0IGF0IHRoZVxuICAgKiB0aW1lIG9mIHRoaXMgZnVuY3Rpb24gY2FsbC4gWW91IHdpbGwgaGF2ZSB0byBzdXBwbHkgYHNlcElmVG9rZW5gIGFuZFxuICAgKiB3aGV0aGVyIG9yIG5vdCBBUk5zIG9mIHRoZSBleHBlY3RlZCBmb3JtYXQgdXN1YWxseSBoYXZlIHJlc291cmNlIG5hbWVzXG4gICAqIGluIG9yZGVyIHRvIHBhcnNlIGl0IHByb3Blcmx5LiBUaGUgcmVzdWx0aW5nIGBBcm5Db21wb25lbnRzYCBvYmplY3Qgd2lsbFxuICAgKiBjb250YWluIHRva2VucyBmb3IgdGhlIHN1YmV4cHJlc3Npb25zIG9mIHRoZSBBUk4sIG5vdCBzdHJpbmcgbGl0ZXJhbHMuXG4gICAqXG4gICAqIElmIHRoZSByZXNvdXJjZSBuYW1lIGNvdWxkIHBvc3NpYmx5IGNvbnRhaW4gdGhlIHNlcGFyYXRvciBjaGFyLCB0aGUgYWN0dWFsXG4gICAqIHJlc291cmNlIG5hbWUgY2Fubm90IGJlIHByb3Blcmx5IHBhcnNlZC4gVGhpcyBvbmx5IG9jY3VycyBpZiB0aGUgc2VwYXJhdG9yXG4gICAqIGNoYXIgaXMgJy8nLCBhbmQgaGFwcGVucyBmb3IgZXhhbXBsZSBmb3IgUzMgb2JqZWN0IEFSTnMsIElBTSBSb2xlIEFSTnMsXG4gICAqIElBTSBPSURDIFByb3ZpZGVyIEFSTnMsIGV0Yy4gVG8gcHJvcGVybHkgZXh0cmFjdCB0aGUgcmVzb3VyY2UgbmFtZSBmcm9tIGFcbiAgICogVG9rZW5pemVkIEFSTiwgeW91IG11c3Qga25vdyB0aGUgcmVzb3VyY2UgdHlwZSBhbmQgY2FsbFxuICAgKiBgQXJuLmV4dHJhY3RSZXNvdXJjZU5hbWVgLlxuICAgKlxuICAgKiBAcGFyYW0gYXJuIFRoZSBBUk4gc3RyaW5nIHRvIHBhcnNlXG4gICAqIEBwYXJhbSBzZXBJZlRva2VuIFRoZSBzZXBhcmF0b3IgdXNlZCB0byBzZXBhcmF0ZSByZXNvdXJjZSBmcm9tIHJlc291cmNlTmFtZVxuICAgKiBAcGFyYW0gaGFzTmFtZSBXaGV0aGVyIHRoZXJlIGlzIGEgbmFtZSBjb21wb25lbnQgaW4gdGhlIEFSTiBhdCBhbGwuIEZvclxuICAgKiBleGFtcGxlLCBTTlMgVG9waWNzIEFSTnMgaGF2ZSB0aGUgJ3Jlc291cmNlJyBjb21wb25lbnQgY29udGFpbiB0aGUgdG9waWNcbiAgICogbmFtZSwgYW5kIG5vICdyZXNvdXJjZU5hbWUnIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHJldHVybnMgYW4gQXJuQ29tcG9uZW50cyBvYmplY3Qgd2hpY2ggYWxsb3dzIGFjY2VzcyB0byB0aGUgdmFyaW91c1xuICAgKiBjb21wb25lbnRzIG9mIHRoZSBBUk4uXG4gICAqXG4gICAqIEByZXR1cm5zIGFuIEFybkNvbXBvbmVudHMgb2JqZWN0IHdoaWNoIGFsbG93cyBhY2Nlc3MgdG8gdGhlIHZhcmlvdXNcbiAgICogICAgICBjb21wb25lbnRzIG9mIHRoZSBBUk4uXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBzcGxpdEFybiBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgcGFyc2VBcm4oYXJuOiBzdHJpbmcsIHNlcElmVG9rZW46IHN0cmluZyA9ICcvJywgaGFzTmFtZTogYm9vbGVhbiA9IHRydWUpOiBBcm5Db21wb25lbnRzIHtcbiAgICByZXR1cm4gQXJuLnBhcnNlKGFybiwgc2VwSWZUb2tlbiwgaGFzTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogU3BsaXRzIHRoZSBwcm92aWRlZCBBUk4gaW50byBpdHMgY29tcG9uZW50cy5cbiAgICogV29ya3MgYm90aCBpZiAnYXJuJyBpcyBhIHN0cmluZyBsaWtlICdhcm46YXdzOnMzOjo6YnVja2V0JyxcbiAgICogYW5kIGEgVG9rZW4gcmVwcmVzZW50aW5nIGEgZHluYW1pYyBDbG91ZEZvcm1hdGlvbiBleHByZXNzaW9uXG4gICAqIChpbiB3aGljaCBjYXNlIHRoZSByZXR1cm5lZCBjb21wb25lbnRzIHdpbGwgYWxzbyBiZSBkeW5hbWljIENsb3VkRm9ybWF0aW9uIGV4cHJlc3Npb25zLFxuICAgKiBlbmNvZGVkIGFzIFRva2VucykuXG4gICAqXG4gICAqIEBwYXJhbSBhcm4gdGhlIEFSTiB0byBzcGxpdCBpbnRvIGl0cyBjb21wb25lbnRzXG4gICAqIEBwYXJhbSBhcm5Gb3JtYXQgdGhlIGV4cGVjdGVkIGZvcm1hdCBvZiAnYXJuJyAtIGRlcGVuZHMgb24gd2hhdCBmb3JtYXQgdGhlIHNlcnZpY2UgJ2FybicgcmVwcmVzZW50cyB1c2VzXG4gICAqL1xuICBwdWJsaWMgc3BsaXRBcm4oYXJuOiBzdHJpbmcsIGFybkZvcm1hdDogQXJuRm9ybWF0KTogQXJuQ29tcG9uZW50cyB7XG4gICAgcmV0dXJuIEFybi5zcGxpdChhcm4sIGFybkZvcm1hdCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbGlzdCBvZiBBWnMgdGhhdCBhcmUgYXZhaWxhYmxlIGluIHRoZSBBV1MgZW52aXJvbm1lbnRcbiAgICogKGFjY291bnQvcmVnaW9uKSBhc3NvY2lhdGVkIHdpdGggdGhpcyBzdGFjay5cbiAgICpcbiAgICogSWYgdGhlIHN0YWNrIGlzIGVudmlyb25tZW50LWFnbm9zdGljIChlaXRoZXIgYWNjb3VudCBhbmQvb3IgcmVnaW9uIGFyZVxuICAgKiB0b2tlbnMpLCB0aGlzIHByb3BlcnR5IHdpbGwgcmV0dXJuIGFuIGFycmF5IHdpdGggMiB0b2tlbnMgdGhhdCB3aWxsIHJlc29sdmVcbiAgICogYXQgZGVwbG95LXRpbWUgdG8gdGhlIGZpcnN0IHR3byBhdmFpbGFiaWxpdHkgem9uZXMgcmV0dXJuZWQgZnJvbSBDbG91ZEZvcm1hdGlvbidzXG4gICAqIGBGbjo6R2V0QVpzYCBpbnRyaW5zaWMgZnVuY3Rpb24uXG4gICAqXG4gICAqIElmIHRoZXkgYXJlIG5vdCBhdmFpbGFibGUgaW4gdGhlIGNvbnRleHQsIHJldHVybnMgYSBzZXQgb2YgZHVtbXkgdmFsdWVzIGFuZFxuICAgKiByZXBvcnRzIHRoZW0gYXMgbWlzc2luZywgYW5kIGxldCB0aGUgQ0xJIHJlc29sdmUgdGhlbSBieSBjYWxsaW5nIEVDMlxuICAgKiBgRGVzY3JpYmVBdmFpbGFiaWxpdHlab25lc2Agb24gdGhlIHRhcmdldCBlbnZpcm9ubWVudC5cbiAgICpcbiAgICogVG8gc3BlY2lmeSBhIGRpZmZlcmVudCBzdHJhdGVneSBmb3Igc2VsZWN0aW5nIGF2YWlsYWJpbGl0eSB6b25lcyBvdmVycmlkZSB0aGlzIG1ldGhvZC5cbiAgICovXG4gIHB1YmxpYyBnZXQgYXZhaWxhYmlsaXR5Wm9uZXMoKTogc3RyaW5nW10ge1xuICAgIC8vIGlmIGFjY291bnQvcmVnaW9uIGFyZSB0b2tlbnMsIHdlIGNhbid0IG9idGFpbiBBWnMgdGhyb3VnaCB0aGUgY29udGV4dFxuICAgIC8vIHByb3ZpZGVyLCBzbyB3ZSBmYWxsYmFjayB0byB1c2UgRm46OkdldEFacy4gdGhlIGN1cnJlbnQgbG93ZXN0IGNvbW1vblxuICAgIC8vIGRlbm9taW5hdG9yIGlzIDIgQVpzIGFjcm9zcyBhbGwgQVdTIHJlZ2lvbnMuXG4gICAgY29uc3QgYWdub3N0aWMgPSBUb2tlbi5pc1VucmVzb2x2ZWQodGhpcy5hY2NvdW50KSB8fCBUb2tlbi5pc1VucmVzb2x2ZWQodGhpcy5yZWdpb24pO1xuICAgIGlmIChhZ25vc3RpYykge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZS50cnlHZXRDb250ZXh0KGN4YXBpLkFWQUlMQUJJTElUWV9aT05FX0ZBTExCQUNLX0NPTlRFWFRfS0VZKSB8fCBbXG4gICAgICAgIEZuLnNlbGVjdCgwLCBGbi5nZXRBenMoKSksXG4gICAgICAgIEZuLnNlbGVjdCgxLCBGbi5nZXRBenMoKSksXG4gICAgICBdO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gQ29udGV4dFByb3ZpZGVyLmdldFZhbHVlKHRoaXMsIHtcbiAgICAgIHByb3ZpZGVyOiBjeHNjaGVtYS5Db250ZXh0UHJvdmlkZXIuQVZBSUxBQklMSVRZX1pPTkVfUFJPVklERVIsXG4gICAgICBkdW1teVZhbHVlOiBbJ2R1bW15MWEnLCAnZHVtbXkxYicsICdkdW1teTFjJ10sXG4gICAgfSkudmFsdWU7XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFByb3ZpZGVyICR7Y3hzY2hlbWEuQ29udGV4dFByb3ZpZGVyLkFWQUlMQUJJTElUWV9aT05FX1BST1ZJREVSfSBleHBlY3RzIGEgbGlzdGApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGZpbGUgYXNzZXQgb24gdGhpcyBTdGFja1xuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHN0YWNrLnN5bnRoZXNpemVyLmFkZEZpbGVBc3NldCgpYCBpZiB5b3UgYXJlIGNhbGxpbmcsXG4gICAqIGFuZCBhIGRpZmZlcmVudCBJU3RhY2tTeW50aGVzaXplciBjbGFzcyBpZiB5b3UgYXJlIGltcGxlbWVudGluZy5cbiAgICovXG4gIHB1YmxpYyBhZGRGaWxlQXNzZXQoYXNzZXQ6IEZpbGVBc3NldFNvdXJjZSk6IEZpbGVBc3NldExvY2F0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5zeW50aGVzaXplci5hZGRGaWxlQXNzZXQoYXNzZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgZG9ja2VyIGltYWdlIGFzc2V0IG9uIHRoaXMgU3RhY2tcbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBzdGFjay5zeW50aGVzaXplci5hZGREb2NrZXJJbWFnZUFzc2V0KClgIGlmIHlvdSBhcmUgY2FsbGluZyxcbiAgICogYW5kIGEgZGlmZmVyZW50IGBJU3RhY2tTeW50aGVzaXplcmAgY2xhc3MgaWYgeW91IGFyZSBpbXBsZW1lbnRpbmcuXG4gICAqL1xuICBwdWJsaWMgYWRkRG9ja2VySW1hZ2VBc3NldChhc3NldDogRG9ja2VySW1hZ2VBc3NldFNvdXJjZSk6IERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuc3ludGhlc2l6ZXIuYWRkRG9ja2VySW1hZ2VBc3NldChhc3NldCk7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhpcyBpcyBhIG5lc3RlZCBzdGFjaywgcmV0dXJucyBpdCdzIHBhcmVudCBzdGFjay5cbiAgICovXG4gIHB1YmxpYyBnZXQgbmVzdGVkU3RhY2tQYXJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMubmVzdGVkU3RhY2tSZXNvdXJjZSAmJiBTdGFjay5vZih0aGlzLm5lc3RlZFN0YWNrUmVzb3VyY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHBhcmVudCBvZiBhIG5lc3RlZCBzdGFjay5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBuZXN0ZWRTdGFja1BhcmVudGBcbiAgICovXG4gIHB1YmxpYyBnZXQgcGFyZW50U3RhY2soKSB7XG4gICAgcmV0dXJuIHRoaXMubmVzdGVkU3RhY2tQYXJlbnQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgVHJhbnNmb3JtIHRvIHRoaXMgc3RhY2suIEEgVHJhbnNmb3JtIGlzIGEgbWFjcm8gdGhhdCBBV1NcbiAgICogQ2xvdWRGb3JtYXRpb24gdXNlcyB0byBwcm9jZXNzIHlvdXIgdGVtcGxhdGUuXG4gICAqXG4gICAqIER1cGxpY2F0ZSB2YWx1ZXMgYXJlIHJlbW92ZWQgd2hlbiBzdGFjayBpcyBzeW50aGVzaXplZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS90cmFuc2Zvcm0tc2VjdGlvbi1zdHJ1Y3R1cmUuaHRtbFxuICAgKiBAcGFyYW0gdHJhbnNmb3JtIFRoZSB0cmFuc2Zvcm0gdG8gYWRkXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGRlY2xhcmUgY29uc3Qgc3RhY2s6IFN0YWNrO1xuICAgKlxuICAgKiBzdGFjay5hZGRUcmFuc2Zvcm0oJ0FXUzo6U2VydmVybGVzcy0yMDE2LTEwLTMxJylcbiAgICovXG4gIHB1YmxpYyBhZGRUcmFuc2Zvcm0odHJhbnNmb3JtOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybXMpIHtcbiAgICAgIHRoaXMudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybXMgPSBbXTtcbiAgICB9XG4gICAgdGhpcy50ZW1wbGF0ZU9wdGlvbnMudHJhbnNmb3Jtcy5wdXNoKHRyYW5zZm9ybSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBhcmJpdGFyeSBrZXktdmFsdWUgcGFpciwgd2l0aCBpbmZvcm1hdGlvbiB5b3Ugd2FudCB0byByZWNvcmQgYWJvdXQgdGhlIHN0YWNrLlxuICAgKiBUaGVzZSBnZXQgdHJhbnNsYXRlZCB0byB0aGUgTWV0YWRhdGEgc2VjdGlvbiBvZiB0aGUgZ2VuZXJhdGVkIHRlbXBsYXRlLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL21ldGFkYXRhLXNlY3Rpb24tc3RydWN0dXJlLmh0bWxcbiAgICovXG4gIHB1YmxpYyBhZGRNZXRhZGF0YShrZXk6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIGlmICghdGhpcy50ZW1wbGF0ZU9wdGlvbnMubWV0YWRhdGEpIHtcbiAgICAgIHRoaXMudGVtcGxhdGVPcHRpb25zLm1ldGFkYXRhID0ge307XG4gICAgfVxuICAgIHRoaXMudGVtcGxhdGVPcHRpb25zLm1ldGFkYXRhW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgaW1wbGljaXRseSBieSB0aGUgYGFkZERlcGVuZGVuY3lgIGhlbHBlciBmdW5jdGlvbiBpbiBvcmRlciB0b1xuICAgKiByZWFsaXplIGEgZGVwZW5kZW5jeSBiZXR3ZWVuIHR3byB0b3AtbGV2ZWwgc3RhY2tzIGF0IHRoZSBhc3NlbWJseSBsZXZlbC5cbiAgICpcbiAgICogVXNlIGBzdGFjay5hZGREZXBlbmRlbmN5YCB0byBkZWZpbmUgdGhlIGRlcGVuZGVuY3kgYmV0d2VlbiBhbnkgdHdvIHN0YWNrcyxcbiAgICogYW5kIHRha2UgaW50byBhY2NvdW50IG5lc3RlZCBzdGFjayByZWxhdGlvbnNoaXBzLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfYWRkQXNzZW1ibHlEZXBlbmRlbmN5KHRhcmdldDogU3RhY2ssIHJlYXNvbjogU3RhY2tEZXBlbmRlbmN5UmVhc29uID0ge30pIHtcbiAgICAvLyBkZWZlbnNpdmU6IHdlIHNob3VsZCBuZXZlciBnZXQgaGVyZSBmb3IgbmVzdGVkIHN0YWNrc1xuICAgIGlmICh0aGlzLm5lc3RlZCB8fCB0YXJnZXQubmVzdGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhZGQgYXNzZW1ibHktbGV2ZWwgZGVwZW5kZW5jaWVzIGZvciBuZXN0ZWQgc3RhY2tzJyk7XG4gICAgfVxuICAgIC8vIEZpbGwgaW4gcmVhc29uIGRldGFpbHMgaWYgbm90IHByb3ZpZGVkXG4gICAgaWYgKCFyZWFzb24uc291cmNlKSB7XG4gICAgICByZWFzb24uc291cmNlID0gdGhpcztcbiAgICB9XG4gICAgaWYgKCFyZWFzb24udGFyZ2V0KSB7XG4gICAgICByZWFzb24udGFyZ2V0ID0gdGFyZ2V0O1xuICAgIH1cbiAgICBpZiAoIXJlYXNvbi5kZXNjcmlwdGlvbikge1xuICAgICAgcmVhc29uLmRlc2NyaXB0aW9uID0gJ25vIGRlc2NyaXB0aW9uIHByb3ZpZGVkJztcbiAgICB9XG5cbiAgICBjb25zdCBjeWNsZSA9IHRhcmdldC5zdGFja0RlcGVuZGVuY3lSZWFzb25zKHRoaXMpO1xuICAgIGlmIChjeWNsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBjeWNsZURlc2NyaXB0aW9uID0gY3ljbGUubWFwKChjeWNsZVJlYXNvbikgPT4ge1xuICAgICAgICByZXR1cm4gY3ljbGVSZWFzb24uZGVzY3JpcHRpb247XG4gICAgICB9KS5qb2luKCcsICcpO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgIHRocm93IG5ldyBFcnJvcihgJyR7dGFyZ2V0Lm5vZGUucGF0aH0nIGRlcGVuZHMgb24gJyR7dGhpcy5ub2RlLnBhdGh9JyAoJHtjeWNsZURlc2NyaXB0aW9ufSkuIEFkZGluZyB0aGlzIGRlcGVuZGVuY3kgKCR7cmVhc29uLmRlc2NyaXB0aW9ufSkgd291bGQgY3JlYXRlIGEgY3ljbGljIHJlZmVyZW5jZS5gKTtcbiAgICB9XG5cbiAgICBsZXQgZGVwID0gdGhpcy5fc3RhY2tEZXBlbmRlbmNpZXNbTmFtZXMudW5pcXVlSWQodGFyZ2V0KV07XG4gICAgaWYgKCFkZXApIHtcbiAgICAgIGRlcCA9IHRoaXMuX3N0YWNrRGVwZW5kZW5jaWVzW05hbWVzLnVuaXF1ZUlkKHRhcmdldCldID0geyBzdGFjazogdGFyZ2V0LCByZWFzb25zOiBbXSB9O1xuICAgIH1cbiAgICAvLyBDaGVjayBmb3IgYSBkdXBsaWNhdGUgcmVhc29uIGFscmVhZHkgZXhpc3RpbmdcbiAgICBsZXQgZXhpc3RpbmdSZWFzb25zOiBTZXQ8U3RhY2tEZXBlbmRlbmN5UmVhc29uPiA9IG5ldyBTZXQoKTtcbiAgICBkZXAucmVhc29ucy5mb3JFYWNoKChleGlzdGluZ1JlYXNvbikgPT4ge1xuICAgICAgaWYgKGV4aXN0aW5nUmVhc29uLnNvdXJjZSA9PSByZWFzb24uc291cmNlICYmIGV4aXN0aW5nUmVhc29uLnRhcmdldCA9PSByZWFzb24udGFyZ2V0KSB7XG4gICAgICAgIGV4aXN0aW5nUmVhc29ucy5hZGQoZXhpc3RpbmdSZWFzb24pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChleGlzdGluZ1JlYXNvbnMuc2l6ZSA+IDApIHtcbiAgICAgIC8vIERlcGVuZGVuY3kgYWxyZWFkeSBleGlzdHMgYW5kIGZvciB0aGUgcHJvdmlkZWQgcmVhc29uXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRlcC5yZWFzb25zLnB1c2gocmVhc29uKTtcblxuICAgIGlmIChwcm9jZXNzLmVudi5DREtfREVCVUdfREVQUykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFtDREtfREVCVUdfREVQU10gc3RhY2sgXCIke3JlYXNvbi5zb3VyY2Uubm9kZS5wYXRofVwiIGRlcGVuZHMgb24gXCIke3JlYXNvbi50YXJnZXQubm9kZS5wYXRofVwiYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBpbXBsaWNpdGx5IGJ5IHRoZSBgb2J0YWluRGVwZW5kZW5jaWVzYCBoZWxwZXIgZnVuY3Rpb24gaW4gb3JkZXIgdG9cbiAgICogY29sbGVjdCByZXNvdXJjZSBkZXBlbmRlbmNpZXMgYWNyb3NzIHR3byB0b3AtbGV2ZWwgc3RhY2tzIGF0IHRoZSBhc3NlbWJseSBsZXZlbC5cbiAgICpcbiAgICogVXNlIGBzdGFjay5vYnRhaW5EZXBlbmRlbmNpZXNgIHRvIHNlZSB0aGUgZGVwZW5kZW5jaWVzIGJldHdlZW4gYW55IHR3byBzdGFja3MuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9vYnRhaW5Bc3NlbWJseURlcGVuZGVuY2llcyhyZWFzb25GaWx0ZXI6IFN0YWNrRGVwZW5kZW5jeVJlYXNvbik6IEVsZW1lbnRbXSB7XG4gICAgaWYgKCFyZWFzb25GaWx0ZXIuc291cmNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlYXNvbkZpbHRlci5zb3VyY2UgbXVzdCBiZSBkZWZpbmVkIScpO1xuICAgIH1cbiAgICAvLyBBc3N1bWUgcmVhc29uRmlsdGVyIGhhcyBvbmx5IHNvdXJjZSBkZWZpbmVkXG4gICAgbGV0IGRlcGVuZGVuY2llczogU2V0PEVsZW1lbnQ+ID0gbmV3IFNldCgpO1xuICAgIE9iamVjdC52YWx1ZXModGhpcy5fc3RhY2tEZXBlbmRlbmNpZXMpLmZvckVhY2goKGRlcCkgPT4ge1xuICAgICAgZGVwLnJlYXNvbnMuZm9yRWFjaCgocmVhc29uKSA9PiB7XG4gICAgICAgIGlmIChyZWFzb25GaWx0ZXIuc291cmNlID09IHJlYXNvbi5zb3VyY2UpIHtcbiAgICAgICAgICBpZiAoIXJlYXNvbi50YXJnZXQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRW5jb3VudGVyZWQgYW4gaW52YWxpZCBkZXBlbmRlbmN5IHRhcmdldCBmcm9tIHNvdXJjZSAnJHtyZWFzb25GaWx0ZXIuc291cmNlIS5ub2RlLnBhdGh9J2ApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZXBlbmRlbmNpZXMuYWRkKHJlYXNvbi50YXJnZXQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShkZXBlbmRlbmNpZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBpbXBsaWNpdGx5IGJ5IHRoZSBgcmVtb3ZlRGVwZW5kZW5jeWAgaGVscGVyIGZ1bmN0aW9uIGluIG9yZGVyIHRvXG4gICAqIHJlbW92ZSBhIGRlcGVuZGVuY3kgYmV0d2VlbiB0d28gdG9wLWxldmVsIHN0YWNrcyBhdCB0aGUgYXNzZW1ibHkgbGV2ZWwuXG4gICAqXG4gICAqIFVzZSBgc3RhY2suYWRkRGVwZW5kZW5jeWAgdG8gZGVmaW5lIHRoZSBkZXBlbmRlbmN5IGJldHdlZW4gYW55IHR3byBzdGFja3MsXG4gICAqIGFuZCB0YWtlIGludG8gYWNjb3VudCBuZXN0ZWQgc3RhY2sgcmVsYXRpb25zaGlwcy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3JlbW92ZUFzc2VtYmx5RGVwZW5kZW5jeSh0YXJnZXQ6IFN0YWNrLCByZWFzb25GaWx0ZXI6IFN0YWNrRGVwZW5kZW5jeVJlYXNvbj17fSkge1xuICAgIC8vIGRlZmVuc2l2ZTogd2Ugc2hvdWxkIG5ldmVyIGdldCBoZXJlIGZvciBuZXN0ZWQgc3RhY2tzXG4gICAgaWYgKHRoaXMubmVzdGVkIHx8IHRhcmdldC5uZXN0ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgY2Fubm90IGJlIGFzc2VtYmx5LWxldmVsIGRlcGVuZGVuY2llcyBmb3IgbmVzdGVkIHN0YWNrcycpO1xuICAgIH1cbiAgICAvLyBObyBuZWVkIHRvIGNoZWNrIGZvciBhIGRlcGVuZGVuY3kgY3ljbGUgd2hlbiByZW1vdmluZyBvbmVcblxuICAgIC8vIEZpbGwgaW4gcmVhc29uIGRldGFpbHMgaWYgbm90IHByb3ZpZGVkXG4gICAgaWYgKCFyZWFzb25GaWx0ZXIuc291cmNlKSB7XG4gICAgICByZWFzb25GaWx0ZXIuc291cmNlID0gdGhpcztcbiAgICB9XG4gICAgaWYgKCFyZWFzb25GaWx0ZXIudGFyZ2V0KSB7XG4gICAgICByZWFzb25GaWx0ZXIudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIH1cblxuICAgIGxldCBkZXAgPSB0aGlzLl9zdGFja0RlcGVuZGVuY2llc1tOYW1lcy51bmlxdWVJZCh0YXJnZXQpXTtcbiAgICBpZiAoIWRlcCkge1xuICAgICAgLy8gRGVwZW5kZW5jeSBkb2Vzbid0IGV4aXN0IC0gcmV0dXJuIG5vd1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEZpbmQgYW5kIHJlbW92ZSB0aGUgc3BlY2lmaWVkIHJlYXNvbiBmcm9tIHRoZSBkZXBlbmRlbmN5XG4gICAgbGV0IG1hdGNoZWRSZWFzb25zOiBTZXQ8U3RhY2tEZXBlbmRlbmN5UmVhc29uPiA9IG5ldyBTZXQoKTtcbiAgICBkZXAucmVhc29ucy5mb3JFYWNoKChyZWFzb24pID0+IHtcbiAgICAgIGlmIChyZWFzb25GaWx0ZXIuc291cmNlID09IHJlYXNvbi5zb3VyY2UgJiYgcmVhc29uRmlsdGVyLnRhcmdldCA9PSByZWFzb24udGFyZ2V0KSB7XG4gICAgICAgIG1hdGNoZWRSZWFzb25zLmFkZChyZWFzb24pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChtYXRjaGVkUmVhc29ucy5zaXplID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBjYW5ub3QgYmUgbW9yZSB0aGFuIG9uZSByZWFzb24gZm9yIGRlcGVuZGVuY3kgcmVtb3ZhbCwgZm91bmQ6ICR7bWF0Y2hlZFJlYXNvbnN9YCk7XG4gICAgfVxuICAgIGlmIChtYXRjaGVkUmVhc29ucy5zaXplID09IDApIHtcbiAgICAgIC8vIFJlYXNvbiBpcyBhbHJlYWR5IG5vdCB0aGVyZSAtIHJldHVybiBub3dcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IG1hdGNoZWRSZWFzb24gPSBBcnJheS5mcm9tKG1hdGNoZWRSZWFzb25zKVswXTtcblxuICAgIGxldCBpbmRleCA9IGRlcC5yZWFzb25zLmluZGV4T2YobWF0Y2hlZFJlYXNvbiwgMCk7XG4gICAgZGVwLnJlYXNvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAvLyBJZiB0aGF0IHdhcyB0aGUgbGFzdCByZWFzb24sIHJlbW92ZSB0aGUgZGVwZW5kZW5jeVxuICAgIGlmIChkZXAucmVhc29ucy5sZW5ndGggPT0gMCkge1xuICAgICAgZGVsZXRlIHRoaXMuX3N0YWNrRGVwZW5kZW5jaWVzW05hbWVzLnVuaXF1ZUlkKHRhcmdldCldO1xuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLmVudi5DREtfREVCVUdfREVQUykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUubG9nKGBbQ0RLX0RFQlVHX0RFUFNdIHN0YWNrIFwiJHt0aGlzLm5vZGUucGF0aH1cIiBubyBsb25nZXIgZGVwZW5kcyBvbiBcIiR7dGFyZ2V0Lm5vZGUucGF0aH1cIiBiZWNhdXNlOiAke3JlYXNvbkZpbHRlcn1gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3ludGhlc2l6ZXMgdGhlIGNsb3VkZm9ybWF0aW9uIHRlbXBsYXRlIGludG8gYSBjbG91ZCBhc3NlbWJseS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3N5bnRoZXNpemVUZW1wbGF0ZShzZXNzaW9uOiBJU3ludGhlc2lzU2Vzc2lvbiwgbG9va3VwUm9sZUFybj86IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIEluIHByaW5jaXBsZSwgc3RhY2sgc3ludGhlc2lzIGlzIGRlbGVnYXRlZCB0byB0aGVcbiAgICAvLyBTdGFja1N5bnRoZXNpcyBvYmplY3QuXG4gICAgLy9cbiAgICAvLyBIb3dldmVyLCBzb21lIHBhcnRzIG9mIHN5bnRoZXNpcyBjdXJyZW50bHkgdXNlIHNvbWUgcHJpdmF0ZVxuICAgIC8vIG1ldGhvZHMgb24gU3RhY2ssIGFuZCBJIGRvbid0IHJlYWxseSBzZWUgdGhlIHZhbHVlIGluIHJlZmFjdG9yaW5nXG4gICAgLy8gdGhpcyByaWdodCBub3csIHNvIHNvbWUgcGFydHMgc3RpbGwgaGFwcGVuIGhlcmUuXG4gICAgY29uc3QgYnVpbGRlciA9IHNlc3Npb24uYXNzZW1ibHk7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuX3RvQ2xvdWRGb3JtYXRpb24oKTtcblxuICAgIC8vIHdyaXRlIHRoZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBhcyBhIEpTT04gZmlsZVxuICAgIGNvbnN0IG91dFBhdGggPSBwYXRoLmpvaW4oYnVpbGRlci5vdXRkaXIsIHRoaXMudGVtcGxhdGVGaWxlKTtcblxuICAgIGlmICh0aGlzLm1heFJlc291cmNlcyA+IDApIHtcbiAgICAgIGNvbnN0IHJlc291cmNlcyA9IHRlbXBsYXRlLlJlc291cmNlcyB8fCB7fTtcbiAgICAgIGNvbnN0IG51bWJlck9mUmVzb3VyY2VzID0gT2JqZWN0LmtleXMocmVzb3VyY2VzKS5sZW5ndGg7XG5cbiAgICAgIGlmIChudW1iZXJPZlJlc291cmNlcyA+IHRoaXMubWF4UmVzb3VyY2VzKSB7XG4gICAgICAgIGNvbnN0IGNvdW50cyA9IE9iamVjdC5lbnRyaWVzKGNvdW50KE9iamVjdC52YWx1ZXMocmVzb3VyY2VzKS5tYXAoKHI6IGFueSkgPT4gYCR7cj8uVHlwZX1gKSkpLm1hcCgoW3R5cGUsIGNdKSA9PiBgJHt0eXBlfSAoJHtjfSlgKS5qb2luKCcsICcpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE51bWJlciBvZiByZXNvdXJjZXMgaW4gc3RhY2sgJyR7dGhpcy5ub2RlLnBhdGh9JzogJHtudW1iZXJPZlJlc291cmNlc30gaXMgZ3JlYXRlciB0aGFuIGFsbG93ZWQgbWF4aW11bSBvZiAke3RoaXMubWF4UmVzb3VyY2VzfTogJHtjb3VudHN9YCk7XG4gICAgICB9IGVsc2UgaWYgKG51bWJlck9mUmVzb3VyY2VzID49ICh0aGlzLm1heFJlc291cmNlcyAqIDAuOCkpIHtcbiAgICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkSW5mbyhgTnVtYmVyIG9mIHJlc291cmNlczogJHtudW1iZXJPZlJlc291cmNlc30gaXMgYXBwcm9hY2hpbmcgYWxsb3dlZCBtYXhpbXVtIG9mICR7dGhpcy5tYXhSZXNvdXJjZXN9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIGZzLndyaXRlRmlsZVN5bmMob3V0UGF0aCwgSlNPTi5zdHJpbmdpZnkodGVtcGxhdGUsIHVuZGVmaW5lZCwgMSkpO1xuXG4gICAgZm9yIChjb25zdCBjdHggb2YgdGhpcy5fbWlzc2luZ0NvbnRleHQpIHtcbiAgICAgIGlmIChsb29rdXBSb2xlQXJuICE9IG51bGwpIHtcbiAgICAgICAgYnVpbGRlci5hZGRNaXNzaW5nKHsgLi4uY3R4LCBwcm9wczogeyAuLi5jdHgucHJvcHMsIGxvb2t1cFJvbGVBcm4gfSB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1aWxkZXIuYWRkTWlzc2luZyhjdHgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rIHVwIGEgZmFjdCB2YWx1ZSBmb3IgdGhlIGdpdmVuIGZhY3QgZm9yIHRoZSByZWdpb24gb2YgdGhpcyBzdGFja1xuICAgKlxuICAgKiBXaWxsIHJldHVybiBhIGRlZmluaXRlIHZhbHVlIG9ubHkgaWYgdGhlIHJlZ2lvbiBvZiB0aGUgY3VycmVudCBzdGFjayBpcyByZXNvbHZlZC5cbiAgICogSWYgbm90LCBhIGxvb2t1cCBtYXAgd2lsbCBiZSBhZGRlZCB0byB0aGUgc3RhY2sgYW5kIHRoZSBsb29rdXAgd2lsbCBiZSBkb25lIGF0XG4gICAqIENESyBkZXBsb3ltZW50IHRpbWUuXG4gICAqXG4gICAqIFdoYXQgcmVnaW9ucyB3aWxsIGJlIGluY2x1ZGVkIGluIHRoZSBsb29rdXAgbWFwIGlzIGNvbnRyb2xsZWQgYnkgdGhlXG4gICAqIGBAYXdzLWNkay9jb3JlOnRhcmdldC1wYXJ0aXRpb25zYCBjb250ZXh0IHZhbHVlOiBpdCBtdXN0IGJlIHNldCB0byBhIGxpc3RcbiAgICogb2YgcGFydGl0aW9ucywgYW5kIG9ubHkgcmVnaW9ucyBmcm9tIHRoZSBnaXZlbiBwYXJ0aXRpb25zIHdpbGwgYmUgaW5jbHVkZWQuXG4gICAqIElmIG5vIHN1Y2ggY29udGV4dCBrZXkgaXMgc2V0LCBhbGwgcmVnaW9ucyB3aWxsIGJlIGluY2x1ZGVkLlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGludGVuZGVkIHRvIGJlIHVzZWQgYnkgY29uc3RydWN0IGxpYnJhcnkgYXV0aG9ycy4gQXBwbGljYXRpb25cbiAgICogYnVpbGRlcnMgY2FuIHJlbHkgb24gdGhlIGFic3RyYWN0aW9ucyBvZmZlcmVkIGJ5IGNvbnN0cnVjdCBsaWJyYXJpZXMgYW5kIGRvXG4gICAqIG5vdCBoYXZlIHRvIHdvcnJ5IGFib3V0IHJlZ2lvbmFsIGZhY3RzLlxuICAgKlxuICAgKiBJZiBgZGVmYXVsdFZhbHVlYCBpcyBub3QgZ2l2ZW4sIGl0IGlzIGFuIGVycm9yIGlmIHRoZSBmYWN0IGlzIHVua25vd24gZm9yXG4gICAqIHRoZSBnaXZlbiByZWdpb24uXG4gICAqL1xuICBwdWJsaWMgcmVnaW9uYWxGYWN0KGZhY3ROYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWx1ZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQodGhpcy5yZWdpb24pKSB7XG4gICAgICBjb25zdCByZXQgPSBGYWN0LmZpbmQodGhpcy5yZWdpb24sIGZhY3ROYW1lKSA/PyBkZWZhdWx0VmFsdWU7XG4gICAgICBpZiAocmV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGByZWdpb24taW5mbzogZG9uJ3Qga25vdyAke2ZhY3ROYW1lfSBmb3IgcmVnaW9uICR7dGhpcy5yZWdpb259LiBVc2UgJ0ZhY3QucmVnaXN0ZXInIHRvIHByb3ZpZGUgdGhpcyB2YWx1ZS5gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgY29uc3QgcGFydGl0aW9ucyA9IE5vZGUub2YodGhpcykudHJ5R2V0Q29udGV4dChjeGFwaS5UQVJHRVRfUEFSVElUSU9OUyk7XG4gICAgaWYgKHBhcnRpdGlvbnMgIT09IHVuZGVmaW5lZCAmJiBwYXJ0aXRpb25zICE9PSAndW5kZWZpbmVkJyAmJiAhQXJyYXkuaXNBcnJheShwYXJ0aXRpb25zKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb250ZXh0IHZhbHVlICcke2N4YXBpLlRBUkdFVF9QQVJUSVRJT05TfScgc2hvdWxkIGJlIGEgbGlzdCBvZiBzdHJpbmdzLCBnb3Q6ICR7SlNPTi5zdHJpbmdpZnkocGFydGl0aW9ucyl9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgbG9va3VwTWFwID1cbiAgICAgIHBhcnRpdGlvbnMgIT09IHVuZGVmaW5lZCAmJiBwYXJ0aXRpb25zICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IFJlZ2lvbkluZm8ubGltaXRlZFJlZ2lvbk1hcChmYWN0TmFtZSwgcGFydGl0aW9ucylcbiAgICAgICAgOiBSZWdpb25JbmZvLnJlZ2lvbk1hcChmYWN0TmFtZSk7XG5cbiAgICByZXR1cm4gZGVwbG95VGltZUxvb2t1cCh0aGlzLCBmYWN0TmFtZSwgbG9va3VwTWFwLCBkZWZhdWx0VmFsdWUpO1xuICB9XG5cblxuICAvKipcbiAgICogQ3JlYXRlIGEgQ2xvdWRGb3JtYXRpb24gRXhwb3J0IGZvciBhIHN0cmluZyB2YWx1ZVxuICAgKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29ycmVzcG9uZGluZyBgRm4uaW1wb3J0VmFsdWUoKWBcbiAgICogZXhwcmVzc2lvbiBmb3IgdGhpcyBFeHBvcnQuIFlvdSBjYW4gY29udHJvbCB0aGUgbmFtZSBmb3IgdGhlIGV4cG9ydCBieVxuICAgKiBwYXNzaW5nIHRoZSBgbmFtZWAgb3B0aW9uLlxuICAgKlxuICAgKiBJZiB5b3UgZG9uJ3Qgc3VwcGx5IGEgdmFsdWUgZm9yIGBuYW1lYCwgdGhlIHZhbHVlIHlvdSdyZSBleHBvcnRpbmcgbXVzdCBiZVxuICAgKiBhIFJlc291cmNlIGF0dHJpYnV0ZSAoZm9yIGV4YW1wbGU6IGBidWNrZXQuYnVja2V0TmFtZWApIGFuZCBpdCB3aWxsIGJlXG4gICAqIGdpdmVuIHRoZSBzYW1lIG5hbWUgYXMgdGhlIGF1dG9tYXRpYyBjcm9zcy1zdGFjayByZWZlcmVuY2UgdGhhdCB3b3VsZCBiZSBjcmVhdGVkXG4gICAqIGlmIHlvdSB1c2VkIHRoZSBhdHRyaWJ1dGUgaW4gYW5vdGhlciBTdGFjay5cbiAgICpcbiAgICogT25lIG9mIHRoZSB1c2VzIGZvciB0aGlzIG1ldGhvZCBpcyB0byAqcmVtb3ZlKiB0aGUgcmVsYXRpb25zaGlwIGJldHdlZW5cbiAgICogdHdvIFN0YWNrcyBlc3RhYmxpc2hlZCBieSBhdXRvbWF0aWMgY3Jvc3Mtc3RhY2sgcmVmZXJlbmNlcy4gSXQgd2lsbFxuICAgKiB0ZW1wb3JhcmlseSBlbnN1cmUgdGhhdCB0aGUgQ2xvdWRGb3JtYXRpb24gRXhwb3J0IHN0aWxsIGV4aXN0cyB3aGlsZSB5b3VcbiAgICogcmVtb3ZlIHRoZSByZWZlcmVuY2UgZnJvbSB0aGUgY29uc3VtaW5nIHN0YWNrLiBBZnRlciB0aGF0LCB5b3UgY2FuIHJlbW92ZVxuICAgKiB0aGUgcmVzb3VyY2UgYW5kIHRoZSBtYW51YWwgZXhwb3J0LlxuICAgKlxuICAgKiAjIyBFeGFtcGxlXG4gICAqXG4gICAqIEhlcmUgaXMgaG93IHRoZSBwcm9jZXNzIHdvcmtzLiBMZXQncyBzYXkgdGhlcmUgYXJlIHR3byBzdGFja3MsXG4gICAqIGBwcm9kdWNlclN0YWNrYCBhbmQgYGNvbnN1bWVyU3RhY2tgLCBhbmQgYHByb2R1Y2VyU3RhY2tgIGhhcyBhIGJ1Y2tldFxuICAgKiBjYWxsZWQgYGJ1Y2tldGAsIHdoaWNoIGlzIHJlZmVyZW5jZWQgYnkgYGNvbnN1bWVyU3RhY2tgIChwZXJoYXBzIGJlY2F1c2VcbiAgICogYW4gQVdTIExhbWJkYSBGdW5jdGlvbiB3cml0ZXMgaW50byBpdCwgb3Igc29tZXRoaW5nIGxpa2UgdGhhdCkuXG4gICAqXG4gICAqIEl0IGlzIG5vdCBzYWZlIHRvIHJlbW92ZSBgcHJvZHVjZXJTdGFjay5idWNrZXRgIGJlY2F1c2UgYXMgdGhlIGJ1Y2tldCBpcyBiZWluZ1xuICAgKiBkZWxldGVkLCBgY29uc3VtZXJTdGFja2AgbWlnaHQgc3RpbGwgYmUgdXNpbmcgaXQuXG4gICAqXG4gICAqIEluc3RlYWQsIHRoZSBwcm9jZXNzIHRha2VzIHR3byBkZXBsb3ltZW50czpcbiAgICpcbiAgICogIyMjIERlcGxveW1lbnQgMTogYnJlYWsgdGhlIHJlbGF0aW9uc2hpcFxuICAgKlxuICAgKiAtIE1ha2Ugc3VyZSBgY29uc3VtZXJTdGFja2Agbm8gbG9uZ2VyIHJlZmVyZW5jZXMgYGJ1Y2tldC5idWNrZXROYW1lYCAobWF5YmUgdGhlIGNvbnN1bWVyXG4gICAqICAgc3RhY2sgbm93IHVzZXMgaXRzIG93biBidWNrZXQsIG9yIGl0IHdyaXRlcyB0byBhbiBBV1MgRHluYW1vREIgdGFibGUsIG9yIG1heWJlIHlvdSBqdXN0XG4gICAqICAgcmVtb3ZlIHRoZSBMYW1iZGEgRnVuY3Rpb24gYWx0b2dldGhlcikuXG4gICAqIC0gSW4gdGhlIGBQcm9kdWNlclN0YWNrYCBjbGFzcywgY2FsbCBgdGhpcy5leHBvcnRWYWx1ZSh0aGlzLmJ1Y2tldC5idWNrZXROYW1lKWAuIFRoaXNcbiAgICogICB3aWxsIG1ha2Ugc3VyZSB0aGUgQ2xvdWRGb3JtYXRpb24gRXhwb3J0IGNvbnRpbnVlcyB0byBleGlzdCB3aGlsZSB0aGUgcmVsYXRpb25zaGlwXG4gICAqICAgYmV0d2VlbiB0aGUgdHdvIHN0YWNrcyBpcyBiZWluZyBicm9rZW4uXG4gICAqIC0gRGVwbG95ICh0aGlzIHdpbGwgZWZmZWN0aXZlbHkgb25seSBjaGFuZ2UgdGhlIGBjb25zdW1lclN0YWNrYCwgYnV0IGl0J3Mgc2FmZSB0byBkZXBsb3kgYm90aCkuXG4gICAqXG4gICAqICMjIyBEZXBsb3ltZW50IDI6IHJlbW92ZSB0aGUgYnVja2V0IHJlc291cmNlXG4gICAqXG4gICAqIC0gWW91IGFyZSBub3cgZnJlZSB0byByZW1vdmUgdGhlIGBidWNrZXRgIHJlc291cmNlIGZyb20gYHByb2R1Y2VyU3RhY2tgLlxuICAgKiAtIERvbid0IGZvcmdldCB0byByZW1vdmUgdGhlIGBleHBvcnRWYWx1ZSgpYCBjYWxsIGFzIHdlbGwuXG4gICAqIC0gRGVwbG95IGFnYWluICh0aGlzIHRpbWUgb25seSB0aGUgYHByb2R1Y2VyU3RhY2tgIHdpbGwgYmUgY2hhbmdlZCAtLSB0aGUgYnVja2V0IHdpbGwgYmUgZGVsZXRlZCkuXG4gICAqL1xuICBwdWJsaWMgZXhwb3J0VmFsdWUoZXhwb3J0ZWRWYWx1ZTogYW55LCBvcHRpb25zOiBFeHBvcnRWYWx1ZU9wdGlvbnMgPSB7fSk6IHN0cmluZyB7XG4gICAgaWYgKG9wdGlvbnMubmFtZSkge1xuICAgICAgbmV3IENmbk91dHB1dCh0aGlzLCBgRXhwb3J0JHtvcHRpb25zLm5hbWV9YCwge1xuICAgICAgICB2YWx1ZTogZXhwb3J0ZWRWYWx1ZSxcbiAgICAgICAgZXhwb3J0TmFtZTogb3B0aW9ucy5uYW1lLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gRm4uaW1wb3J0VmFsdWUob3B0aW9ucy5uYW1lKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IGV4cG9ydE5hbWUsIGV4cG9ydHNTY29wZSwgaWQsIGV4cG9ydGFibGUgfSA9IHRoaXMucmVzb2x2ZUV4cG9ydGVkVmFsdWUoZXhwb3J0ZWRWYWx1ZSk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBleHBvcnRzU2NvcGUubm9kZS50cnlGaW5kQ2hpbGQoaWQpIGFzIENmbk91dHB1dDtcbiAgICBpZiAoIW91dHB1dCkge1xuICAgICAgbmV3IENmbk91dHB1dChleHBvcnRzU2NvcGUsIGlkLCB7XG4gICAgICAgIHZhbHVlOiBUb2tlbi5hc1N0cmluZyhleHBvcnRhYmxlKSxcbiAgICAgICAgZXhwb3J0TmFtZSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGltcG9ydFZhbHVlID0gRm4uaW1wb3J0VmFsdWUoZXhwb3J0TmFtZSk7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShpbXBvcnRWYWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXR0ZW1wdGVkIHRvIGV4cG9ydCBhIGxpc3QgdmFsdWUgZnJvbSBgZXhwb3J0VmFsdWUoKWA6IHVzZSBgZXhwb3J0U3RyaW5nTGlzdFZhbHVlKClgIGluc3RlYWQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW1wb3J0VmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgQ2xvdWRGb3JtYXRpb24gRXhwb3J0IGZvciBhIHN0cmluZyBsaXN0IHZhbHVlXG4gICAqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgbGlzdCByZXByZXNlbnRpbmcgdGhlIGNvcnJlc3BvbmRpbmcgYEZuLmltcG9ydFZhbHVlKClgXG4gICAqIGV4cHJlc3Npb24gZm9yIHRoaXMgRXhwb3J0LiBUaGUgZXhwb3J0IGV4cHJlc3Npb24gaXMgYXV0b21hdGljYWxseSB3cmFwcGVkIHdpdGggYW5cbiAgICogYEZuOjpKb2luYCBhbmQgdGhlIGltcG9ydCB2YWx1ZSB3aXRoIGFuIGBGbjo6U3BsaXRgLCBzaW5jZSBDbG91ZEZvcm1hdGlvbiBjYW4gb25seVxuICAgKiBleHBvcnQgc3RyaW5ncy4gWW91IGNhbiBjb250cm9sIHRoZSBuYW1lIGZvciB0aGUgZXhwb3J0IGJ5IHBhc3NpbmcgdGhlIGBuYW1lYCBvcHRpb24uXG4gICAqXG4gICAqIElmIHlvdSBkb24ndCBzdXBwbHkgYSB2YWx1ZSBmb3IgYG5hbWVgLCB0aGUgdmFsdWUgeW91J3JlIGV4cG9ydGluZyBtdXN0IGJlXG4gICAqIGEgUmVzb3VyY2UgYXR0cmlidXRlIChmb3IgZXhhbXBsZTogYGJ1Y2tldC5idWNrZXROYW1lYCkgYW5kIGl0IHdpbGwgYmVcbiAgICogZ2l2ZW4gdGhlIHNhbWUgbmFtZSBhcyB0aGUgYXV0b21hdGljIGNyb3NzLXN0YWNrIHJlZmVyZW5jZSB0aGF0IHdvdWxkIGJlIGNyZWF0ZWRcbiAgICogaWYgeW91IHVzZWQgdGhlIGF0dHJpYnV0ZSBpbiBhbm90aGVyIFN0YWNrLlxuICAgKlxuICAgKiBPbmUgb2YgdGhlIHVzZXMgZm9yIHRoaXMgbWV0aG9kIGlzIHRvICpyZW1vdmUqIHRoZSByZWxhdGlvbnNoaXAgYmV0d2VlblxuICAgKiB0d28gU3RhY2tzIGVzdGFibGlzaGVkIGJ5IGF1dG9tYXRpYyBjcm9zcy1zdGFjayByZWZlcmVuY2VzLiBJdCB3aWxsXG4gICAqIHRlbXBvcmFyaWx5IGVuc3VyZSB0aGF0IHRoZSBDbG91ZEZvcm1hdGlvbiBFeHBvcnQgc3RpbGwgZXhpc3RzIHdoaWxlIHlvdVxuICAgKiByZW1vdmUgdGhlIHJlZmVyZW5jZSBmcm9tIHRoZSBjb25zdW1pbmcgc3RhY2suIEFmdGVyIHRoYXQsIHlvdSBjYW4gcmVtb3ZlXG4gICAqIHRoZSByZXNvdXJjZSBhbmQgdGhlIG1hbnVhbCBleHBvcnQuXG4gICAqXG4gICAqIFNlZSBgZXhwb3J0VmFsdWVgIGZvciBhbiBleGFtcGxlIG9mIHRoaXMgcHJvY2Vzcy5cbiAgICovXG4gIHB1YmxpYyBleHBvcnRTdHJpbmdMaXN0VmFsdWUoZXhwb3J0ZWRWYWx1ZTogYW55LCBvcHRpb25zOiBFeHBvcnRWYWx1ZU9wdGlvbnMgPSB7fSk6IHN0cmluZ1tdIHtcbiAgICBpZiAob3B0aW9ucy5uYW1lKSB7XG4gICAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsIGBFeHBvcnQke29wdGlvbnMubmFtZX1gLCB7XG4gICAgICAgIHZhbHVlOiBGbi5qb2luKFNUUklOR19MSVNUX1JFRkVSRU5DRV9ERUxJTUlURVIsIGV4cG9ydGVkVmFsdWUpLFxuICAgICAgICBleHBvcnROYW1lOiBvcHRpb25zLm5hbWUsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBGbi5zcGxpdChTVFJJTkdfTElTVF9SRUZFUkVOQ0VfREVMSU1JVEVSLCBGbi5pbXBvcnRWYWx1ZShvcHRpb25zLm5hbWUpKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IGV4cG9ydE5hbWUsIGV4cG9ydHNTY29wZSwgaWQsIGV4cG9ydGFibGUgfSA9IHRoaXMucmVzb2x2ZUV4cG9ydGVkVmFsdWUoZXhwb3J0ZWRWYWx1ZSk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBleHBvcnRzU2NvcGUubm9kZS50cnlGaW5kQ2hpbGQoaWQpIGFzIENmbk91dHB1dDtcbiAgICBpZiAoIW91dHB1dCkge1xuICAgICAgbmV3IENmbk91dHB1dChleHBvcnRzU2NvcGUsIGlkLCB7XG4gICAgICAgIC8vIHRoaXMgaXMgYSBsaXN0IHNvIGV4cG9ydCBhbiBGbjo6Sm9pbiBleHByZXNzaW9uXG4gICAgICAgIC8vIGFuZCBpbXBvcnQgYW4gRm46OlNwbGl0IGV4cHJlc3Npb24sXG4gICAgICAgIC8vIHNpbmNlIENsb3VkRm9ybWF0aW9uIE91dHB1dHMgY2FuIG9ubHkgYmUgc3RyaW5nc1xuICAgICAgICAvLyAoc3RyaW5nIGxpc3RzIGFyZSBpbnZhbGlkKVxuICAgICAgICB2YWx1ZTogRm4uam9pbihTVFJJTkdfTElTVF9SRUZFUkVOQ0VfREVMSU1JVEVSLCBUb2tlbi5hc0xpc3QoZXhwb3J0YWJsZSkpLFxuICAgICAgICBleHBvcnROYW1lLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gd2UgZG9uJ3QgdXNlIGBGbi5pbXBvcnRMaXN0VmFsdWUoKWAgc2luY2UgdGhpcyBhcnJheSBpcyBhIENGTiBhdHRyaWJ1dGUsIGFuZCB3ZSBkb24ndCBrbm93IGhvdyBsb25nIHRoaXMgYXR0cmlidXRlIGlzXG4gICAgY29uc3QgaW1wb3J0VmFsdWUgPSBGbi5zcGxpdChTVFJJTkdfTElTVF9SRUZFUkVOQ0VfREVMSU1JVEVSLCBGbi5pbXBvcnRWYWx1ZShleHBvcnROYW1lKSk7XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoaW1wb3J0VmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dGVtcHRlZCB0byBleHBvcnQgYSBzdHJpbmcgdmFsdWUgZnJvbSBgZXhwb3J0U3RyaW5nTGlzdFZhbHVlKClgOiB1c2UgYGV4cG9ydFZhbHVlKClgIGluc3RlYWQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW1wb3J0VmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbmFtaW5nIHNjaGVtZSB1c2VkIHRvIGFsbG9jYXRlIGxvZ2ljYWwgSURzLiBCeSBkZWZhdWx0LCB1c2VzXG4gICAqIHRoZSBgSGFzaGVkQWRkcmVzc2luZ1NjaGVtZWAgYnV0IHRoaXMgbWV0aG9kIGNhbiBiZSBvdmVycmlkZGVuIHRvIGN1c3RvbWl6ZVxuICAgKiB0aGlzIGJlaGF2aW9yLlxuICAgKlxuICAgKiBJbiBvcmRlciB0byBtYWtlIHN1cmUgbG9naWNhbCBJRHMgYXJlIHVuaXF1ZSBhbmQgc3RhYmxlLCB3ZSBoYXNoIHRoZSByZXNvdXJjZVxuICAgKiBjb25zdHJ1Y3QgdHJlZSBwYXRoIChpLmUuIHRvcGxldmVsL3NlY29uZGxldmVsLy4uLi9teXJlc291cmNlKSBhbmQgYWRkIGl0IGFzXG4gICAqIGEgc3VmZml4IHRvIHRoZSBwYXRoIGNvbXBvbmVudHMgam9pbmVkIHdpdGhvdXQgYSBzZXBhcmF0b3IgKENsb3VkRm9ybWF0aW9uXG4gICAqIElEcyBvbmx5IGFsbG93IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzKS5cbiAgICpcbiAgICogVGhlIHJlc3VsdCB3aWxsIGJlOlxuICAgKlxuICAgKiAgIDxwYXRoLmpvaW4oJycpPjxtZDUocGF0aC5qb2luKCcvJyk+XG4gICAqICAgICBcImh1bWFuXCIgICAgICBcImhhc2hcIlxuICAgKlxuICAgKiBJZiB0aGUgXCJodW1hblwiIHBhcnQgb2YgdGhlIElEIGV4Y2VlZHMgMjQwIGNoYXJhY3RlcnMsIHdlIHNpbXBseSB0cmltIGl0IHNvXG4gICAqIHRoZSB0b3RhbCBJRCBkb2Vzbid0IGV4Y2VlZCBDbG91ZEZvcm1hdGlvbidzIDI1NSBjaGFyYWN0ZXIgbGltaXQuXG4gICAqXG4gICAqIFdlIG9ubHkgdGFrZSA4IGNoYXJhY3RlcnMgZnJvbSB0aGUgbWQ1IGhhc2ggKDAuMDAwMDA1IGNoYW5jZSBvZiBjb2xsaXNpb24pLlxuICAgKlxuICAgKiBTcGVjaWFsIGNhc2VzOlxuICAgKlxuICAgKiAtIElmIHRoZSBwYXRoIG9ubHkgY29udGFpbnMgYSBzaW5nbGUgY29tcG9uZW50IChpLmUuIGl0J3MgYSB0b3AtbGV2ZWxcbiAgICogICByZXNvdXJjZSksIHdlIHdvbid0IGFkZCB0aGUgaGFzaCB0byBpdC4gVGhlIGhhc2ggaXMgbm90IG5lZWRlZCBmb3JcbiAgICogICBkaXNhbWlndWF0aW9uIGFuZCBhbHNvLCBpdCBhbGxvd3MgZm9yIGEgbW9yZSBzdHJhaWdodGZvcndhcmQgbWlncmF0aW9uIGFuXG4gICAqICAgZXhpc3RpbmcgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgdG8gYSBDREsgc3RhY2sgd2l0aG91dCBsb2dpY2FsIElEIGNoYW5nZXNcbiAgICogICAob3IgcmVuYW1lcykuXG4gICAqIC0gRm9yIGFlc3RoZXRpYyByZWFzb25zLCBpZiB0aGUgbGFzdCBjb21wb25lbnRzIG9mIHRoZSBwYXRoIGFyZSB0aGUgc2FtZVxuICAgKiAgIChpLmUuIGBMMS9MMi9QaXBlbGluZS9QaXBlbGluZWApLCB0aGV5IHdpbGwgYmUgZGUtZHVwbGljYXRlZCB0byBtYWtlIHRoZVxuICAgKiAgIHJlc3VsdGluZyBodW1hbiBwb3J0aW9uIG9mIHRoZSBJRCBtb3JlIHBsZWFzaW5nOiBgTDFMMlBpcGVsaW5lPEhBU0g+YFxuICAgKiAgIGluc3RlYWQgb2YgYEwxTDJQaXBlbGluZVBpcGVsaW5lPEhBU0g+YFxuICAgKiAtIElmIGEgY29tcG9uZW50IGlzIG5hbWVkIFwiRGVmYXVsdFwiIGl0IHdpbGwgYmUgb21pdHRlZCBmcm9tIHRoZSBwYXRoLiBUaGlzXG4gICAqICAgYWxsb3dzIHJlZmFjdG9yaW5nIGhpZ2hlciBsZXZlbCBhYnN0cmFjdGlvbnMgYXJvdW5kIGNvbnN0cnVjdHMgd2l0aG91dCBhZmZlY3RpbmdcbiAgICogICB0aGUgSURzIG9mIGFscmVhZHkgZGVwbG95ZWQgcmVzb3VyY2VzLlxuICAgKiAtIElmIGEgY29tcG9uZW50IGlzIG5hbWVkIFwiUmVzb3VyY2VcIiBpdCB3aWxsIGJlIG9taXR0ZWQgZnJvbSB0aGUgdXNlci12aXNpYmxlXG4gICAqICAgcGF0aCwgYnV0IGluY2x1ZGVkIGluIHRoZSBoYXNoLiBUaGlzIHJlZHVjZXMgdmlzdWFsIG5vaXNlIGluIHRoZSBodW1hbiByZWFkYWJsZVxuICAgKiAgIHBhcnQgb2YgdGhlIGlkZW50aWZpZXIuXG4gICAqXG4gICAqIEBwYXJhbSBjZm5FbGVtZW50IFRoZSBlbGVtZW50IGZvciB3aGljaCB0aGUgbG9naWNhbCBJRCBpcyBhbGxvY2F0ZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWxsb2NhdGVMb2dpY2FsSWQoY2ZuRWxlbWVudDogQ2ZuRWxlbWVudCk6IHN0cmluZyB7XG4gICAgY29uc3Qgc2NvcGVzID0gY2ZuRWxlbWVudC5ub2RlLnNjb3BlcztcbiAgICBjb25zdCBzdGFja0luZGV4ID0gc2NvcGVzLmluZGV4T2YoY2ZuRWxlbWVudC5zdGFjayk7XG4gICAgY29uc3QgcGF0aENvbXBvbmVudHMgPSBzY29wZXMuc2xpY2Uoc3RhY2tJbmRleCArIDEpLm1hcCh4ID0+IHgubm9kZS5pZCk7XG4gICAgcmV0dXJuIG1ha2VVbmlxdWVJZChwYXRoQ29tcG9uZW50cyk7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgc3RhY2sgbmFtZVxuICAgKlxuICAgKiBDbG91ZEZvcm1hdGlvbiBzdGFjayBuYW1lcyBjYW4gaW5jbHVkZSBkYXNoZXMgaW4gYWRkaXRpb24gdG8gdGhlIHJlZ3VsYXIgaWRlbnRpZmllclxuICAgKiBjaGFyYWN0ZXIgY2xhc3NlcywgYW5kIHdlIGRvbid0IGFsbG93IG9uZSBvZiB0aGUgbWFnaWMgbWFya2Vycy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm90ZWN0ZWQgX3ZhbGlkYXRlSWQobmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKG5hbWUgJiYgIVZBTElEX1NUQUNLX05BTUVfUkVHRVgudGVzdChuYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTdGFjayBuYW1lIG11c3QgbWF0Y2ggdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbjogJHtWQUxJRF9TVEFDS19OQU1FX1JFR0VYLnRvU3RyaW5nKCl9LCBnb3QgJyR7bmFtZX0nYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIGZvciB0aGlzIHN0YWNrIGJ5IHRyYXZlcnNpbmdcbiAgICogdGhlIHRyZWUgYW5kIGludm9raW5nIF90b0Nsb3VkRm9ybWF0aW9uKCkgb24gYWxsIEVudGl0eSBvYmplY3RzLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCBfdG9DbG91ZEZvcm1hdGlvbigpIHtcbiAgICBsZXQgdHJhbnNmb3JtOiBzdHJpbmcgfCBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcblxuICAgIGlmICh0aGlzLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm0pIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICBBbm5vdGF0aW9ucy5vZih0aGlzKS5hZGRXYXJuaW5nKCdUaGlzIHN0YWNrIGlzIHVzaW5nIHRoZSBkZXByZWNhdGVkIGB0ZW1wbGF0ZU9wdGlvbnMudHJhbnNmb3JtYCBwcm9wZXJ0eS4gQ29uc2lkZXIgc3dpdGNoaW5nIHRvIGBhZGRUcmFuc2Zvcm0oKWAuJyk7XG4gICAgICB0aGlzLmFkZFRyYW5zZm9ybSh0aGlzLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm1zKSB7XG4gICAgICBpZiAodGhpcy50ZW1wbGF0ZU9wdGlvbnMudHJhbnNmb3Jtcy5sZW5ndGggPT09IDEpIHsgLy8gRXh0cmFjdCBzaW5nbGUgdmFsdWVcbiAgICAgICAgdHJhbnNmb3JtID0gdGhpcy50ZW1wbGF0ZU9wdGlvbnMudHJhbnNmb3Jtc1swXTtcbiAgICAgIH0gZWxzZSB7IC8vIFJlbW92ZSBkdXBsaWNhdGUgdmFsdWVzXG4gICAgICAgIHRyYW5zZm9ybSA9IEFycmF5LmZyb20obmV3IFNldCh0aGlzLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm1zKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdGVtcGxhdGU6IGFueSA9IHtcbiAgICAgIERlc2NyaXB0aW9uOiB0aGlzLnRlbXBsYXRlT3B0aW9ucy5kZXNjcmlwdGlvbixcbiAgICAgIFRyYW5zZm9ybTogdHJhbnNmb3JtLFxuICAgICAgQVdTVGVtcGxhdGVGb3JtYXRWZXJzaW9uOiB0aGlzLnRlbXBsYXRlT3B0aW9ucy50ZW1wbGF0ZUZvcm1hdFZlcnNpb24sXG4gICAgICBNZXRhZGF0YTogdGhpcy50ZW1wbGF0ZU9wdGlvbnMubWV0YWRhdGEsXG4gICAgfTtcblxuICAgIGNvbnN0IGVsZW1lbnRzID0gY2ZuRWxlbWVudHModGhpcyk7XG4gICAgY29uc3QgZnJhZ21lbnRzID0gZWxlbWVudHMubWFwKGUgPT4gdGhpcy5yZXNvbHZlKGUuX3RvQ2xvdWRGb3JtYXRpb24oKSkpO1xuXG4gICAgLy8gbWVyZ2UgaW4gYWxsIENsb3VkRm9ybWF0aW9uIGZyYWdtZW50cyBjb2xsZWN0ZWQgZnJvbSB0aGUgdHJlZVxuICAgIGZvciAoY29uc3QgZnJhZ21lbnQgb2YgZnJhZ21lbnRzKSB7XG4gICAgICBtZXJnZSh0ZW1wbGF0ZSwgZnJhZ21lbnQpO1xuICAgIH1cblxuICAgIC8vIHJlc29sdmUgYWxsIHRva2VucyBhbmQgcmVtb3ZlIGFsbCBlbXB0aWVzXG4gICAgY29uc3QgcmV0ID0gdGhpcy5yZXNvbHZlKHRlbXBsYXRlKSB8fCB7fTtcblxuICAgIHRoaXMuX2xvZ2ljYWxJZHMuYXNzZXJ0QWxsUmVuYW1lc0FwcGxpZWQoKTtcblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogRGVwcmVjYXRlZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvcHVsbC83MTg3XG4gICAqIEByZXR1cm5zIHJlZmVyZW5jZSBpdHNlbGYgd2l0aG91dCBhbnkgY2hhbmdlXG4gICAqIEBkZXByZWNhdGVkIGNyb3NzIHJlZmVyZW5jZSBoYW5kbGluZyBoYXMgYmVlbiBtb3ZlZCB0byBgQXBwLnByZXBhcmUoKWAuXG4gICAqL1xuICBwcm90ZWN0ZWQgcHJlcGFyZUNyb3NzUmVmZXJlbmNlKF9zb3VyY2VTdGFjazogU3RhY2ssIHJlZmVyZW5jZTogUmVmZXJlbmNlKTogSVJlc29sdmFibGUge1xuICAgIHJldHVybiByZWZlcmVuY2U7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRoZSB2YXJpb3VzIHN0YWNrIGVudmlyb25tZW50IGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqL1xuICBwcml2YXRlIHBhcnNlRW52aXJvbm1lbnQoZW52OiBFbnZpcm9ubWVudCA9IHt9KSB7XG4gICAgLy8gaWYgYW4gZW52aXJvbm1lbnQgcHJvcGVydHkgaXMgZXhwbGljaXRseSBzcGVjaWZpZWQgd2hlbiB0aGUgc3RhY2sgaXNcbiAgICAvLyBjcmVhdGVkLCBpdCB3aWxsIGJlIHVzZWQuIGlmIG5vdCwgdXNlIHRva2VucyBmb3IgYWNjb3VudCBhbmQgcmVnaW9uLlxuICAgIC8vXG4gICAgLy8gKFRoZXkgZG8gbm90IG5lZWQgdG8gYmUgYW5jaG9yZWQgdG8gYW55IGNvbnN0cnVjdCBsaWtlIHJlc291cmNlIGF0dHJpYnV0ZXNcbiAgICAvLyBhcmUsIGJlY2F1c2Ugd2UnbGwgbmV2ZXIgRXhwb3J0L0ZuOjpJbXBvcnRWYWx1ZSB0aGVtIC0tIHRoZSBvbmx5IHNpdHVhdGlvblxuICAgIC8vIGluIHdoaWNoIEV4cG9ydC9Gbjo6SW1wb3J0VmFsdWUgd291bGQgd29yayBpcyBpZiB0aGUgdmFsdWUgYXJlIHRoZSBzYW1lXG4gICAgLy8gYmV0d2VlbiBwcm9kdWNlciBhbmQgY29uc3VtZXIgYW55d2F5LCBzbyB3ZSBjYW4ganVzdCBhc3N1bWUgdGhhdCB0aGV5IGFyZSkuXG4gICAgY29uc3QgY29udGFpbmluZ0Fzc2VtYmx5ID0gU3RhZ2Uub2YodGhpcyk7XG4gICAgY29uc3QgYWNjb3VudCA9IGVudi5hY2NvdW50ID8/IGNvbnRhaW5pbmdBc3NlbWJseT8uYWNjb3VudCA/PyBBd3MuQUNDT1VOVF9JRDtcbiAgICBjb25zdCByZWdpb24gPSBlbnYucmVnaW9uID8/IGNvbnRhaW5pbmdBc3NlbWJseT8ucmVnaW9uID8/IEF3cy5SRUdJT047XG5cbiAgICAvLyB0aGlzIGlzIHRoZSBcImF3czovL1wiIGVudiBzcGVjaWZpY2F0aW9uIHRoYXQgd2lsbCBiZSB3cml0dGVuIHRvIHRoZSBjbG91ZCBhc3NlbWJseVxuICAgIC8vIG1hbmlmZXN0LiBpdCB3aWxsIHVzZSBcInVua25vd24tYWNjb3VudFwiIGFuZCBcInVua25vd24tcmVnaW9uXCIgdG8gaW5kaWNhdGVcbiAgICAvLyBlbnZpcm9ubWVudC1hZ25vc3RpY25lc3MuXG4gICAgY29uc3QgZW52QWNjb3VudCA9ICFUb2tlbi5pc1VucmVzb2x2ZWQoYWNjb3VudCkgPyBhY2NvdW50IDogY3hhcGkuVU5LTk9XTl9BQ0NPVU5UO1xuICAgIGNvbnN0IGVudlJlZ2lvbiA9ICFUb2tlbi5pc1VucmVzb2x2ZWQocmVnaW9uKSA/IHJlZ2lvbiA6IGN4YXBpLlVOS05PV05fUkVHSU9OO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjY291bnQsXG4gICAgICByZWdpb24sXG4gICAgICBlbnZpcm9ubWVudDogY3hhcGkuRW52aXJvbm1lbnRVdGlscy5mb3JtYXQoZW52QWNjb3VudCwgZW52UmVnaW9uKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIE1heGltdW0gbnVtYmVyIG9mIHJlc291cmNlcyBpbiB0aGUgc3RhY2tcbiAgICpcbiAgICogU2V0IHRvIDAgdG8gbWVhbiBcInVubGltaXRlZFwiLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXQgbWF4UmVzb3VyY2VzKCk6IG51bWJlciB7XG4gICAgY29uc3QgY29udGV4dExpbWl0ID0gdGhpcy5ub2RlLnRyeUdldENvbnRleHQoU1RBQ0tfUkVTT1VSQ0VfTElNSVRfQ09OVEVYVCk7XG4gICAgcmV0dXJuIGNvbnRleHRMaW1pdCAhPT0gdW5kZWZpbmVkID8gcGFyc2VJbnQoY29udGV4dExpbWl0LCAxMCkgOiBNQVhfUkVTT1VSQ0VTO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhpcyBzdGFjayBoYXMgYSAodHJhbnNpdGl2ZSkgZGVwZW5kZW5jeSBvbiBhbm90aGVyIHN0YWNrXG4gICAqXG4gICAqIFJldHVybnMgdGhlIGxpc3Qgb2YgcmVhc29ucyBvbiB0aGUgZGVwZW5kZW5jeSBwYXRoLCBvciB1bmRlZmluZWRcbiAgICogaWYgdGhlcmUgaXMgbm8gZGVwZW5kZW5jeS5cbiAgICovXG4gIHByaXZhdGUgc3RhY2tEZXBlbmRlbmN5UmVhc29ucyhvdGhlcjogU3RhY2spOiBTdGFja0RlcGVuZGVuY3lSZWFzb25bXSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMgPT09IG90aGVyKSB7IHJldHVybiBbXTsgfVxuICAgIGZvciAoY29uc3QgZGVwIG9mIE9iamVjdC52YWx1ZXModGhpcy5fc3RhY2tEZXBlbmRlbmNpZXMpKSB7XG4gICAgICBjb25zdCByZXQgPSBkZXAuc3RhY2suc3RhY2tEZXBlbmRlbmN5UmVhc29ucyhvdGhlcik7XG4gICAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIFsuLi5kZXAucmVhc29ucywgLi4ucmV0XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgdGhlIHN0YWNrIG5hbWUgYmFzZWQgb24gdGhlIGNvbnN0cnVjdCBwYXRoXG4gICAqXG4gICAqIFRoZSBzdGFjayBuYW1lIGlzIHRoZSBuYW1lIHVuZGVyIHdoaWNoIHdlJ2xsIGRlcGxveSB0aGUgc3RhY2ssXG4gICAqIGFuZCBpbmNvcnBvcmF0ZXMgY29udGFpbmluZyBTdGFnZSBuYW1lcyBieSBkZWZhdWx0LlxuICAgKlxuICAgKiBHZW5lcmFsbHkgdGhpcyBsb29rcyBhIGxvdCBsaWtlIGhvdyBsb2dpY2FsIElEcyBhcmUgY2FsY3VsYXRlZC5cbiAgICogVGhlIHN0YWNrIG5hbWUgaXMgY2FsY3VsYXRlZCBiYXNlZCBvbiB0aGUgY29uc3RydWN0IHJvb3QgcGF0aCxcbiAgICogYXMgZm9sbG93czpcbiAgICpcbiAgICogLSBQYXRoIGlzIGNhbGN1bGF0ZWQgd2l0aCByZXNwZWN0IHRvIGNvbnRhaW5pbmcgQXBwIG9yIFN0YWdlIChpZiBhbnkpXG4gICAqIC0gSWYgdGhlIHBhdGggaXMgb25lIGNvbXBvbmVudCBsb25nIGp1c3QgdXNlIHRoYXQgY29tcG9uZW50LCBvdGhlcndpc2VcbiAgICogICBjb21iaW5lIHRoZW0gd2l0aCBhIGhhc2guXG4gICAqXG4gICAqIFNpbmNlIHRoZSBoYXNoIGlzIHF1aXRlIHVnbHkgYW5kIHdlJ2QgbGlrZSB0byBhdm9pZCBpdCBpZiBwb3NzaWJsZSAtLSBidXRcbiAgICogd2UgY2FuJ3QgYW55bW9yZSBpbiB0aGUgZ2VuZXJhbCBjYXNlIHNpbmNlIGl0IGhhcyBiZWVuIHdyaXR0ZW4gaW50byBsZWdhY3lcbiAgICogc3RhY2tzLiBUaGUgaW50cm9kdWN0aW9uIG9mIFN0YWdlcyBtYWtlcyBpdCBwb3NzaWJsZSB0byBtYWtlIHRoaXMgbmljZXIgaG93ZXZlci5cbiAgICogV2hlbiBhIFN0YWNrIGlzIG5lc3RlZCBpbnNpZGUgYSBTdGFnZSwgd2UgdXNlIHRoZSBwYXRoIGNvbXBvbmVudHMgYmVsb3cgdGhlXG4gICAqIFN0YWdlLCBhbmQgcHJlZml4IHRoZSBwYXRoIGNvbXBvbmVudHMgb2YgdGhlIFN0YWdlIGJlZm9yZSBpdC5cbiAgICovXG4gIHByaXZhdGUgZ2VuZXJhdGVTdGFja05hbWUoKSB7XG4gICAgY29uc3QgYXNzZW1ibHkgPSBTdGFnZS5vZih0aGlzKTtcbiAgICBjb25zdCBwcmVmaXggPSAoYXNzZW1ibHkgJiYgYXNzZW1ibHkuc3RhZ2VOYW1lKSA/IGAke2Fzc2VtYmx5LnN0YWdlTmFtZX0tYCA6ICcnO1xuICAgIHJldHVybiBgJHtwcmVmaXh9JHt0aGlzLmdlbmVyYXRlU3RhY2tJZChhc3NlbWJseSl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYXJ0aWZhY3QgSUQgZm9yIHRoaXMgc3RhY2tcbiAgICpcbiAgICogU3RhY2sgYXJ0aWZhY3QgSUQgaXMgdW5pcXVlIHdpdGhpbiB0aGUgQXBwJ3MgQ2xvdWQgQXNzZW1ibHkuXG4gICAqL1xuICBwcml2YXRlIGdlbmVyYXRlU3RhY2tBcnRpZmFjdElkKCkge1xuICAgIHJldHVybiB0aGlzLmdlbmVyYXRlU3RhY2tJZCh0aGlzLm5vZGUucm9vdCk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgYW4gSUQgd2l0aCByZXNwZWN0IHRvIHRoZSBnaXZlbiBjb250YWluZXIgY29uc3RydWN0LlxuICAgKi9cbiAgcHJpdmF0ZSBnZW5lcmF0ZVN0YWNrSWQoY29udGFpbmVyOiBJQ29uc3RydWN0IHwgdW5kZWZpbmVkKSB7XG4gICAgY29uc3Qgcm9vdFBhdGggPSByb290UGF0aFRvKHRoaXMsIGNvbnRhaW5lcik7XG4gICAgY29uc3QgaWRzID0gcm9vdFBhdGgubWFwKGMgPT4gTm9kZS5vZihjKS5pZCk7XG5cbiAgICAvLyBJbiB1bml0IHRlc3RzIG91ciBTdGFjayAod2hpY2ggaXMgdGhlIG9ubHkgY29tcG9uZW50KSBtYXkgbm90IGhhdmUgYW5cbiAgICAvLyBpZCwgc28gaW4gdGhhdCBjYXNlIGp1c3QgcHJldGVuZCBpdCdzIFwiU3RhY2tcIi5cbiAgICBpZiAoaWRzLmxlbmd0aCA9PT0gMSAmJiAhaWRzWzBdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuZXhwZWN0ZWQ6IHN0YWNrIGlkIG11c3QgYWx3YXlzIGJlIGRlZmluZWQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFrZVN0YWNrTmFtZShpZHMpO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNvbHZlRXhwb3J0ZWRWYWx1ZShleHBvcnRlZFZhbHVlOiBhbnkpOiBSZXNvbHZlZEV4cG9ydCB7XG4gICAgY29uc3QgcmVzb2x2YWJsZSA9IFRva2VuaXphdGlvbi5yZXZlcnNlKGV4cG9ydGVkVmFsdWUpO1xuICAgIGlmICghcmVzb2x2YWJsZSB8fCAhUmVmZXJlbmNlLmlzUmVmZXJlbmNlKHJlc29sdmFibGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2V4cG9ydFZhbHVlOiBlaXRoZXIgc3VwcGx5IFxcJ25hbWVcXCcgb3IgbWFrZSBzdXJlIHRvIGV4cG9ydCBhIHJlc291cmNlIGF0dHJpYnV0ZSAobGlrZSBcXCdidWNrZXQuYnVja2V0TmFtZVxcJyknKTtcbiAgICB9XG5cbiAgICAvLyBcInRlbGVwb3J0XCIgdGhlIHZhbHVlIGhlcmUsIGluIGNhc2UgaXQgY29tZXMgZnJvbSBhIG5lc3RlZCBzdGFjay4gVGhpcyB3aWxsIGFsc29cbiAgICAvLyBlbnN1cmUgdGhlIHZhbHVlIGlzIGZyb20gb3VyIG93biBzY29wZS5cbiAgICBjb25zdCBleHBvcnRhYmxlID0gZ2V0RXhwb3J0YWJsZSh0aGlzLCByZXNvbHZhYmxlKTtcblxuICAgIC8vIEVuc3VyZSBhIHNpbmdsZXRvbiBcIkV4cG9ydHNcIiBzY29waW5nIENvbnN0cnVjdFxuICAgIC8vIFRoaXMgbW9zdGx5IGV4aXN0cyB0byB0cmlnZ2VyIExvZ2ljYWxJRCBtdW5naW5nLCB3aGljaCB3b3VsZCBiZVxuICAgIC8vIGRpc2FibGVkIGlmIHdlIHBhcmVudGVkIGNvbnN0cnVjdHMgZGlyZWN0bHkgdW5kZXIgU3RhY2suXG4gICAgLy8gQWxzbyBpdCBuaWNlbHkgcHJldmVudHMgbGlrZWx5IGNvbnN0cnVjdCBuYW1lIGNsYXNoZXNcbiAgICBjb25zdCBleHBvcnRzU2NvcGUgPSBnZXRDcmVhdGVFeHBvcnRzU2NvcGUodGhpcyk7XG5cbiAgICAvLyBFbnN1cmUgYSBzaW5nbGV0b24gQ2ZuT3V0cHV0IGZvciB0aGlzIHZhbHVlXG4gICAgY29uc3QgcmVzb2x2ZWQgPSB0aGlzLnJlc29sdmUoZXhwb3J0YWJsZSk7XG4gICAgY29uc3QgaWQgPSAnT3V0cHV0JyArIEpTT04uc3RyaW5naWZ5KHJlc29sdmVkKTtcbiAgICBjb25zdCBleHBvcnROYW1lID0gZ2VuZXJhdGVFeHBvcnROYW1lKGV4cG9ydHNTY29wZSwgaWQpO1xuXG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChleHBvcnROYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bnJlc29sdmVkIHRva2VuIGluIGdlbmVyYXRlZCBleHBvcnQgbmFtZTogJHtKU09OLnN0cmluZ2lmeSh0aGlzLnJlc29sdmUoZXhwb3J0TmFtZSkpfWApO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBleHBvcnRhYmxlLFxuICAgICAgZXhwb3J0c1Njb3BlLFxuICAgICAgaWQsXG4gICAgICBleHBvcnROYW1lLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHN0YWNrIHJlcXVpcmVzIGJ1bmRsaW5nIG9yIG5vdFxuICAgKi9cbiAgcHVibGljIGdldCBidW5kbGluZ1JlcXVpcmVkKCkge1xuICAgIGNvbnN0IGJ1bmRsaW5nU3RhY2tzOiBzdHJpbmdbXSA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KGN4YXBpLkJVTkRMSU5HX1NUQUNLUykgPz8gWycqKiddO1xuXG4gICAgcmV0dXJuIGJ1bmRsaW5nU3RhY2tzLnNvbWUocGF0dGVybiA9PiBtaW5pbWF0Y2goXG4gICAgICB0aGlzLm5vZGUucGF0aCwgLy8gdXNlIHRoZSBzYW1lIHZhbHVlIGZvciBwYXR0ZXJuIG1hdGNoaW5nIGFzIHRoZSBhd3MtY2RrIENMSSAoZGlzcGxheU5hbWUgLyBoaWVyYXJjaGljYWxJZClcbiAgICAgIHBhdHRlcm4sXG4gICAgKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWVyZ2UodGVtcGxhdGU6IGFueSwgZnJhZ21lbnQ6IGFueSk6IHZvaWQge1xuICBmb3IgKGNvbnN0IHNlY3Rpb24gb2YgT2JqZWN0LmtleXMoZnJhZ21lbnQpKSB7XG4gICAgY29uc3Qgc3JjID0gZnJhZ21lbnRbc2VjdGlvbl07XG5cbiAgICAvLyBjcmVhdGUgdG9wLWxldmVsIHNlY3Rpb24gaWYgaXQgZG9lc24ndCBleGlzdFxuICAgIGNvbnN0IGRlc3QgPSB0ZW1wbGF0ZVtzZWN0aW9uXTtcbiAgICBpZiAoIWRlc3QpIHtcbiAgICAgIHRlbXBsYXRlW3NlY3Rpb25dID0gc3JjO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZW1wbGF0ZVtzZWN0aW9uXSA9IG1lcmdlU2VjdGlvbihzZWN0aW9uLCBkZXN0LCBzcmMpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtZXJnZVNlY3Rpb24oc2VjdGlvbjogc3RyaW5nLCB2YWwxOiBhbnksIHZhbDI6IGFueSk6IGFueSB7XG4gIHN3aXRjaCAoc2VjdGlvbikge1xuICAgIGNhc2UgJ0Rlc2NyaXB0aW9uJzpcbiAgICAgIHJldHVybiBgJHt2YWwxfVxcbiR7dmFsMn1gO1xuICAgIGNhc2UgJ0FXU1RlbXBsYXRlRm9ybWF0VmVyc2lvbic6XG4gICAgICBpZiAodmFsMSAhPSBudWxsICYmIHZhbDIgIT0gbnVsbCAmJiB2YWwxICE9PSB2YWwyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ29uZmxpY3RpbmcgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgdmVyc2lvbnMgcHJvdmlkZWQ6ICcke3ZhbDF9JyBhbmQgJyR7dmFsMn1gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWwxID8/IHZhbDI7XG4gICAgY2FzZSAnVHJhbnNmb3JtJzpcbiAgICAgIHJldHVybiBtZXJnZVNldHModmFsMSwgdmFsMik7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBtZXJnZU9iamVjdHNXaXRob3V0RHVwbGljYXRlcyhzZWN0aW9uLCB2YWwxLCB2YWwyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtZXJnZVNldHModmFsMTogYW55LCB2YWwyOiBhbnkpOiBhbnkge1xuICBjb25zdCBhcnJheTEgPSB2YWwxID09IG51bGwgPyBbXSA6IChBcnJheS5pc0FycmF5KHZhbDEpID8gdmFsMSA6IFt2YWwxXSk7XG4gIGNvbnN0IGFycmF5MiA9IHZhbDIgPT0gbnVsbCA/IFtdIDogKEFycmF5LmlzQXJyYXkodmFsMikgPyB2YWwyIDogW3ZhbDJdKTtcbiAgZm9yIChjb25zdCB2YWx1ZSBvZiBhcnJheTIpIHtcbiAgICBpZiAoIWFycmF5MS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIGFycmF5MS5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5MS5sZW5ndGggPT09IDEgPyBhcnJheTFbMF0gOiBhcnJheTE7XG59XG5cbmZ1bmN0aW9uIG1lcmdlT2JqZWN0c1dpdGhvdXREdXBsaWNhdGVzKHNlY3Rpb246IHN0cmluZywgZGVzdDogYW55LCBzcmM6IGFueSk6IGFueSB7XG4gIGlmICh0eXBlb2YgZGVzdCAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGluZyAke0pTT04uc3RyaW5naWZ5KGRlc3QpfSB0byBiZSBhbiBvYmplY3RgKTtcbiAgfVxuICBpZiAodHlwZW9mIHNyYyAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGluZyAke0pTT04uc3RyaW5naWZ5KHNyYyl9IHRvIGJlIGFuIG9iamVjdGApO1xuICB9XG5cbiAgLy8gYWRkIGFsbCBlbnRpdGllcyBmcm9tIHNvdXJjZSBzZWN0aW9uIHRvIGRlc3RpbmF0aW9uIHNlY3Rpb25cbiAgZm9yIChjb25zdCBpZCBvZiBPYmplY3Qua2V5cyhzcmMpKSB7XG4gICAgaWYgKGlkIGluIGRlc3QpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc2VjdGlvbiAnJHtzZWN0aW9ufScgYWxyZWFkeSBjb250YWlucyAnJHtpZH0nYCk7XG4gICAgfVxuICAgIGRlc3RbaWRdID0gc3JjW2lkXTtcbiAgfVxuXG4gIHJldHVybiBkZXN0O1xufVxuXG4vKipcbiAqIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIG9wdGlvbnMgZm9yIGEgc3RhY2suXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVRlbXBsYXRlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBHZXRzIG9yIHNldHMgdGhlIGRlc2NyaXB0aW9uIG9mIHRoaXMgc3RhY2suXG4gICAqIElmIHByb3ZpZGVkLCBpdCB3aWxsIGJlIGluY2x1ZGVkIGluIHRoZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSdzIFwiRGVzY3JpcHRpb25cIiBhdHRyaWJ1dGUuXG4gICAqL1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogR2V0cyBvciBzZXRzIHRoZSBBV1NUZW1wbGF0ZUZvcm1hdFZlcnNpb24gZmllbGQgb2YgdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlLlxuICAgKi9cbiAgdGVtcGxhdGVGb3JtYXRWZXJzaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBHZXRzIG9yIHNldHMgdGhlIHRvcC1sZXZlbCB0ZW1wbGF0ZSB0cmFuc2Zvcm0gZm9yIHRoaXMgc3RhY2sgKGUuZy4gXCJBV1M6OlNlcnZlcmxlc3MtMjAxNi0xMC0zMVwiKS5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGB0cmFuc2Zvcm1zYCBpbnN0ZWFkLlxuICAgKi9cbiAgdHJhbnNmb3JtPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBHZXRzIG9yIHNldHMgdGhlIHRvcC1sZXZlbCB0ZW1wbGF0ZSB0cmFuc2Zvcm0ocykgZm9yIHRoaXMgc3RhY2sgKGUuZy4gYFtcIkFXUzo6U2VydmVybGVzcy0yMDE2LTEwLTMxXCJdYCkuXG4gICAqL1xuICB0cmFuc2Zvcm1zPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIE1ldGFkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuXG4gICAqL1xuICBtZXRhZGF0YT86IHsgW2tleTogc3RyaW5nXTogYW55IH07XG59XG5cbi8qKlxuICogQ29sbGVjdCBhbGwgQ2ZuRWxlbWVudHMgZnJvbSBhIFN0YWNrLlxuICpcbiAqIEBwYXJhbSBub2RlIFJvb3Qgbm9kZSB0byBjb2xsZWN0IGFsbCBDZm5FbGVtZW50cyBmcm9tXG4gKiBAcGFyYW0gaW50byBBcnJheSB0byBhcHBlbmQgQ2ZuRWxlbWVudHMgdG9cbiAqIEByZXR1cm5zIFRoZSBzYW1lIGFycmF5IGFzIGlzIGJlaW5nIGNvbGxlY3RlZCBpbnRvXG4gKi9cbmZ1bmN0aW9uIGNmbkVsZW1lbnRzKG5vZGU6IElDb25zdHJ1Y3QsIGludG86IENmbkVsZW1lbnRbXSA9IFtdKTogQ2ZuRWxlbWVudFtdIHtcbiAgaWYgKENmbkVsZW1lbnQuaXNDZm5FbGVtZW50KG5vZGUpKSB7XG4gICAgaW50by5wdXNoKG5vZGUpO1xuICB9XG5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiBOb2RlLm9mKG5vZGUpLmNoaWxkcmVuKSB7XG4gICAgLy8gRG9uJ3QgcmVjdXJzZSBpbnRvIGEgc3Vic3RhY2tcbiAgICBpZiAoU3RhY2suaXNTdGFjayhjaGlsZCkpIHsgY29udGludWU7IH1cblxuICAgIGNmbkVsZW1lbnRzKGNoaWxkLCBpbnRvKTtcbiAgfVxuXG4gIHJldHVybiBpbnRvO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgY29uc3RydWN0IHJvb3QgcGF0aCBvZiB0aGUgZ2l2ZW4gY29uc3RydWN0IHJlbGF0aXZlIHRvIHRoZSBnaXZlbiBhbmNlc3RvclxuICpcbiAqIElmIG5vIGFuY2VzdG9yIGlzIGdpdmVuIG9yIHRoZSBhbmNlc3RvciBpcyBub3QgZm91bmQsIHJldHVybiB0aGUgZW50aXJlIHJvb3QgcGF0aC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJvb3RQYXRoVG8oY29uc3RydWN0OiBJQ29uc3RydWN0LCBhbmNlc3Rvcj86IElDb25zdHJ1Y3QpOiBJQ29uc3RydWN0W10ge1xuICBjb25zdCBzY29wZXMgPSBOb2RlLm9mKGNvbnN0cnVjdCkuc2NvcGVzO1xuICBmb3IgKGxldCBpID0gc2NvcGVzLmxlbmd0aCAtIDI7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKHNjb3Blc1tpXSA9PT0gYW5jZXN0b3IpIHtcbiAgICAgIHJldHVybiBzY29wZXMuc2xpY2UoaSArIDEpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc2NvcGVzO1xufVxuXG4vKipcbiAqIG1ha2VVbmlxdWVJZCwgc3BlY2lhbGl6ZWQgZm9yIFN0YWNrIG5hbWVzXG4gKlxuICogU3RhY2sgbmFtZXMgbWF5IGNvbnRhaW4gJy0nLCBzbyB3ZSBhbGxvdyB0aGF0IGNoYXJhY3RlciBpZiB0aGUgc3RhY2sgbmFtZVxuICogaGFzIG9ubHkgb25lIGNvbXBvbmVudC4gT3RoZXJ3aXNlIHdlIGZhbGwgYmFjayB0byB0aGUgcmVndWxhciBcIm1ha2VVbmlxdWVJZFwiXG4gKiBiZWhhdmlvci5cbiAqL1xuZnVuY3Rpb24gbWFrZVN0YWNrTmFtZShjb21wb25lbnRzOiBzdHJpbmdbXSkge1xuICBpZiAoY29tcG9uZW50cy5sZW5ndGggPT09IDEpIHsgcmV0dXJuIGNvbXBvbmVudHNbMF07IH1cbiAgcmV0dXJuIG1ha2VVbmlxdWVSZXNvdXJjZU5hbWUoY29tcG9uZW50cywgeyBtYXhMZW5ndGg6IDEyOCB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q3JlYXRlRXhwb3J0c1Njb3BlKHN0YWNrOiBTdGFjaykge1xuICBjb25zdCBleHBvcnRzTmFtZSA9ICdFeHBvcnRzJztcbiAgbGV0IHN0YWNrRXhwb3J0cyA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKGV4cG9ydHNOYW1lKSBhcyBDb25zdHJ1Y3Q7XG4gIGlmIChzdGFja0V4cG9ydHMgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0YWNrRXhwb3J0cyA9IG5ldyBDb25zdHJ1Y3Qoc3RhY2ssIGV4cG9ydHNOYW1lKTtcbiAgfVxuXG4gIHJldHVybiBzdGFja0V4cG9ydHM7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlRXhwb3J0TmFtZShzdGFja0V4cG9ydHM6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICBjb25zdCBzdGFja1JlbGF0aXZlRXhwb3J0cyA9IEZlYXR1cmVGbGFncy5vZihzdGFja0V4cG9ydHMpLmlzRW5hYmxlZChjeGFwaS5TVEFDS19SRUxBVElWRV9FWFBPUlRTX0NPTlRFWFQpO1xuICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHN0YWNrRXhwb3J0cyk7XG5cbiAgY29uc3QgY29tcG9uZW50cyA9IFtcbiAgICAuLi5zdGFja0V4cG9ydHMubm9kZS5zY29wZXNcbiAgICAgIC5zbGljZShzdGFja1JlbGF0aXZlRXhwb3J0cyA/IHN0YWNrLm5vZGUuc2NvcGVzLmxlbmd0aCA6IDIpXG4gICAgICAubWFwKGMgPT4gYy5ub2RlLmlkKSxcbiAgICBpZCxcbiAgXTtcbiAgY29uc3QgcHJlZml4ID0gc3RhY2suc3RhY2tOYW1lID8gc3RhY2suc3RhY2tOYW1lICsgJzonIDogJyc7XG4gIGNvbnN0IGxvY2FsUGFydCA9IG1ha2VVbmlxdWVJZChjb21wb25lbnRzKTtcbiAgY29uc3QgbWF4TGVuZ3RoID0gMjU1O1xuICByZXR1cm4gcHJlZml4ICsgbG9jYWxQYXJ0LnNsaWNlKE1hdGgubWF4KDAsIGxvY2FsUGFydC5sZW5ndGggLSBtYXhMZW5ndGggKyBwcmVmaXgubGVuZ3RoKSk7XG59XG5cbmludGVyZmFjZSBTdGFja0RlcGVuZGVuY3lSZWFzb24ge1xuICBzb3VyY2U/OiBFbGVtZW50O1xuICB0YXJnZXQ/OiBFbGVtZW50O1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFN0YWNrRGVwZW5kZW5jeSB7XG4gIHN0YWNrOiBTdGFjaztcbiAgcmVhc29uczogU3RhY2tEZXBlbmRlbmN5UmVhc29uW107XG59XG5cbmludGVyZmFjZSBSZXNvbHZlZEV4cG9ydCB7XG4gIGV4cG9ydGFibGU6IFJlZmVyZW5jZTtcbiAgZXhwb3J0c1Njb3BlOiBDb25zdHJ1Y3Q7XG4gIGlkOiBzdHJpbmc7XG4gIGV4cG9ydE5hbWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciB0aGUgYHN0YWNrLmV4cG9ydFZhbHVlKClgIG1ldGhvZFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV4cG9ydFZhbHVlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgZXhwb3J0IHRvIGNyZWF0ZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgbmFtZSBpcyBhdXRvbWF0aWNhbGx5IGNob3NlblxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcbn1cblxuZnVuY3Rpb24gY291bnQoeHM6IHN0cmluZ1tdKTogUmVjb3JkPHN0cmluZywgbnVtYmVyPiB7XG4gIGNvbnN0IHJldDogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xuICBmb3IgKGNvbnN0IHggb2YgeHMpIHtcbiAgICBpZiAoeCBpbiByZXQpIHtcbiAgICAgIHJldFt4XSArPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXRbeF0gPSAxO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG4vLyBUaGVzZSBpbXBvcnRzIGhhdmUgdG8gYmUgYXQgdGhlIGVuZCB0byBwcmV2ZW50IGNpcmN1bGFyIGltcG9ydHNcbi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9vcmRlciAqL1xuaW1wb3J0IHsgQ2ZuT3V0cHV0IH0gZnJvbSAnLi9jZm4tb3V0cHV0JztcbmltcG9ydCB7IGFkZERlcGVuZGVuY3ksIEVsZW1lbnQgfSBmcm9tICcuL2RlcHMnO1xuaW1wb3J0IHsgRmlsZVN5c3RlbSB9IGZyb20gJy4vZnMnO1xuaW1wb3J0IHsgTmFtZXMgfSBmcm9tICcuL25hbWVzJztcbmltcG9ydCB7IFJlZmVyZW5jZSB9IGZyb20gJy4vcmVmZXJlbmNlJztcbmltcG9ydCB7IElSZXNvbHZhYmxlIH0gZnJvbSAnLi9yZXNvbHZhYmxlJztcbmltcG9ydCB7IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLCBJU3RhY2tTeW50aGVzaXplciwgSVN5bnRoZXNpc1Nlc3Npb24sIExlZ2FjeVN0YWNrU3ludGhlc2l6ZXIsIEJPT1RTVFJBUF9RVUFMSUZJRVJfQ09OVEVYVCwgaXNSZXVzYWJsZVN0YWNrU3ludGhlc2l6ZXIgfSBmcm9tICcuL3N0YWNrLXN5bnRoZXNpemVycyc7XG5pbXBvcnQgeyBTdHJpbmdTcGVjaWFsaXplciB9IGZyb20gJy4vc3RhY2stc3ludGhlc2l6ZXJzL19zaGFyZWQnO1xuaW1wb3J0IHsgU3RhZ2UgfSBmcm9tICcuL3N0YWdlJztcbmltcG9ydCB7IElUYWdnYWJsZSwgVGFnTWFuYWdlciB9IGZyb20gJy4vdGFnLW1hbmFnZXInO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuaXphdGlvbiB9IGZyb20gJy4vdG9rZW4nO1xuaW1wb3J0IHsgZ2V0RXhwb3J0YWJsZSB9IGZyb20gJy4vcHJpdmF0ZS9yZWZzJztcbmltcG9ydCB7IEZhY3QsIFJlZ2lvbkluZm8gfSBmcm9tICdAYXdzLWNkay9yZWdpb24taW5mbyc7XG5pbXBvcnQgeyBkZXBsb3lUaW1lTG9va3VwIH0gZnJvbSAnLi9wcml2YXRlL3JlZ2lvbi1sb29rdXAnO1xuaW1wb3J0IHsgbWFrZVVuaXF1ZVJlc291cmNlTmFtZSB9IGZyb20gJy4vcHJpdmF0ZS91bmlxdWUtcmVzb3VyY2UtbmFtZSc7aW1wb3J0IHsgUFJJVkFURV9DT05URVhUX0RFRkFVTFRfU1RBQ0tfU1lOVEhFU0laRVIgfSBmcm9tICcuL3ByaXZhdGUvcHJpdmF0ZS1jb250ZXh0Jztcbi8qIGVzbGludC1lbmFibGUgaW1wb3J0L29yZGVyICovXG4iXX0=