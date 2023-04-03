"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootPathTo = exports.Stack = exports.STACK_RESOURCE_LIMIT_CONTEXT = void 0;
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
     * Convert an object, potentially containing tokens, to a YAML string
     */
    toYamlString(obj) {
        return cloudformation_lang_1.CloudFormationLang.toYAML(obj).toString();
    }
    /**
     * DEPRECATED
     * @deprecated use `reportMissingContextKey()`
     */
    reportMissingContext(report) {
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
        return this.synthesizer.addFileAsset(asset);
    }
    /**
     * Register a docker image asset on this Stack
     *
     * @deprecated Use `stack.synthesizer.addDockerImageAsset()` if you are calling,
     * and a different `IStackSynthesizer` class if you are implementing.
     */
    addDockerImageAsset(asset) {
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
     *   disambiguation and also, it allows for a more straightforward migration an
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
/* eslint-enable import/order */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDJEQUEyRDtBQUMzRCx5Q0FBeUM7QUFDekMsMkNBQXlEO0FBQ3pELHVDQUF1QztBQUN2QywrQ0FBNEM7QUFDNUMsK0JBQTRCO0FBQzVCLCtCQUFzRDtBQUN0RCxxQ0FBbUM7QUFFbkMsK0NBQTJDO0FBQzNDLHFDQUE4QjtBQUM5Qiw2Q0FBOEM7QUFDOUMsaURBQXNEO0FBQ3RELHlEQUFxRDtBQUVyRCxtREFBK0M7QUFDL0MsaUVBQStGO0FBQy9GLHVFQUFrRztBQUNsRyxxREFBa0Q7QUFDbEQsK0NBQTRDO0FBQzVDLGlEQUFrRDtBQUVsRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDdkQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBRXBELFFBQUEsNEJBQTRCLEdBQUcsa0NBQWtDLENBQUM7QUFFL0UsTUFBTSxzQkFBc0IsR0FBRyx5QkFBeUIsQ0FBQztBQUV6RCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUM7QUFFMUIsTUFBTSwrQkFBK0IsR0FBRyxJQUFJLENBQUM7QUE4STdDOztHQUVHO0FBQ0gsTUFBYSxLQUFNLFNBQVEsc0JBQVM7SUFDbEM7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBTTtRQUMxQixPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksT0FBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsSUFBSSxZQUFZLElBQUksQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQXFCO1FBQ3BDLHlFQUF5RTtRQUN6RSwyRUFBMkU7UUFDM0UsMkVBQTJFO1FBQzNFLHlCQUF5QjtRQUN6QixN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TCwwREFBaUU7QUFDakUsbUNBQWdDO0FBQ2hDLCtDQUFzRDtBQUN0RCxtQ0FBOEM7QUFDOUMseUNBQStDO0FBQy9DLHNEQUF3RDtBQUN4RCwyREFBMkQ7QUFDM0QseUVBQXdFO0FBQUEsK0RBQXNGO0FBQzlKLGdDQUFnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IElDb25zdHJ1Y3QsIENvbnN0cnVjdCwgTm9kZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgbWluaW1hdGNoIGZyb20gJ21pbmltYXRjaCc7XG5pbXBvcnQgeyBBbm5vdGF0aW9ucyB9IGZyb20gJy4vYW5ub3RhdGlvbnMnO1xuaW1wb3J0IHsgQXBwIH0gZnJvbSAnLi9hcHAnO1xuaW1wb3J0IHsgQXJuLCBBcm5Db21wb25lbnRzLCBBcm5Gb3JtYXQgfSBmcm9tICcuL2Fybic7XG5pbXBvcnQgeyBBc3BlY3RzIH0gZnJvbSAnLi9hc3BlY3QnO1xuaW1wb3J0IHsgRG9ja2VySW1hZ2VBc3NldExvY2F0aW9uLCBEb2NrZXJJbWFnZUFzc2V0U291cmNlLCBGaWxlQXNzZXRMb2NhdGlvbiwgRmlsZUFzc2V0U291cmNlIH0gZnJvbSAnLi9hc3NldHMnO1xuaW1wb3J0IHsgQ2ZuRWxlbWVudCB9IGZyb20gJy4vY2ZuLWVsZW1lbnQnO1xuaW1wb3J0IHsgRm4gfSBmcm9tICcuL2Nmbi1mbic7XG5pbXBvcnQgeyBBd3MsIFNjb3BlZEF3cyB9IGZyb20gJy4vY2ZuLXBzZXVkbyc7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZSwgVGFnVHlwZSB9IGZyb20gJy4vY2ZuLXJlc291cmNlJztcbmltcG9ydCB7IENvbnRleHRQcm92aWRlciB9IGZyb20gJy4vY29udGV4dC1wcm92aWRlcic7XG5pbXBvcnQgeyBFbnZpcm9ubWVudCB9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgRmVhdHVyZUZsYWdzIH0gZnJvbSAnLi9mZWF0dXJlLWZsYWdzJztcbmltcG9ydCB7IFBlcm1pc3Npb25zQm91bmRhcnksIFBFUk1JU1NJT05TX0JPVU5EQVJZX0NPTlRFWFRfS0VZIH0gZnJvbSAnLi9wZXJtaXNzaW9ucy1ib3VuZGFyeSc7XG5pbXBvcnQgeyBDTE9VREZPUk1BVElPTl9UT0tFTl9SRVNPTFZFUiwgQ2xvdWRGb3JtYXRpb25MYW5nIH0gZnJvbSAnLi9wcml2YXRlL2Nsb3VkZm9ybWF0aW9uLWxhbmcnO1xuaW1wb3J0IHsgTG9naWNhbElEcyB9IGZyb20gJy4vcHJpdmF0ZS9sb2dpY2FsLWlkJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICcuL3ByaXZhdGUvcmVzb2x2ZSc7XG5pbXBvcnQgeyBtYWtlVW5pcXVlSWQgfSBmcm9tICcuL3ByaXZhdGUvdW5pcXVlaWQnO1xuXG5jb25zdCBTVEFDS19TWU1CT0wgPSBTeW1ib2wuZm9yKCdAYXdzLWNkay9jb3JlLlN0YWNrJyk7XG5jb25zdCBNWV9TVEFDS19DQUNIRSA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2NvcmUuU3RhY2subXlTdGFjaycpO1xuXG5leHBvcnQgY29uc3QgU1RBQ0tfUkVTT1VSQ0VfTElNSVRfQ09OVEVYVCA9ICdAYXdzLWNkay9jb3JlOnN0YWNrUmVzb3VyY2VMaW1pdCc7XG5cbmNvbnN0IFZBTElEX1NUQUNLX05BTUVfUkVHRVggPSAvXltBLVphLXpdW0EtWmEtejAtOS1dKiQvO1xuXG5jb25zdCBNQVhfUkVTT1VSQ0VTID0gNTAwO1xuXG5jb25zdCBTVFJJTkdfTElTVF9SRUZFUkVOQ0VfREVMSU1JVEVSID0gJ3x8JztcbmV4cG9ydCBpbnRlcmZhY2UgU3RhY2tQcm9wcyB7XG4gIC8qKlxuICAgKiBBIGRlc2NyaXB0aW9uIG9mIHRoZSBzdGFjay5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVdTIGVudmlyb25tZW50IChhY2NvdW50L3JlZ2lvbikgd2hlcmUgdGhpcyBzdGFjayB3aWxsIGJlIGRlcGxveWVkLlxuICAgKlxuICAgKiBTZXQgdGhlIGByZWdpb25gL2BhY2NvdW50YCBmaWVsZHMgb2YgYGVudmAgdG8gZWl0aGVyIGEgY29uY3JldGUgdmFsdWUgdG9cbiAgICogc2VsZWN0IHRoZSBpbmRpY2F0ZWQgZW52aXJvbm1lbnQgKHJlY29tbWVuZGVkIGZvciBwcm9kdWN0aW9uIHN0YWNrcyksIG9yIHRvXG4gICAqIHRoZSB2YWx1ZXMgb2YgZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gICAqIGBDREtfREVGQVVMVF9SRUdJT05gL2BDREtfREVGQVVMVF9BQ0NPVU5UYCB0byBsZXQgdGhlIHRhcmdldCBlbnZpcm9ubWVudFxuICAgKiBkZXBlbmQgb24gdGhlIEFXUyBjcmVkZW50aWFscy9jb25maWd1cmF0aW9uIHRoYXQgdGhlIENESyBDTEkgaXMgZXhlY3V0ZWRcbiAgICogdW5kZXIgKHJlY29tbWVuZGVkIGZvciBkZXZlbG9wbWVudCBzdGFja3MpLlxuICAgKlxuICAgKiBJZiB0aGUgYFN0YWNrYCBpcyBpbnN0YW50aWF0ZWQgaW5zaWRlIGEgYFN0YWdlYCwgYW55IHVuZGVmaW5lZFxuICAgKiBgcmVnaW9uYC9gYWNjb3VudGAgZmllbGRzIGZyb20gYGVudmAgd2lsbCBkZWZhdWx0IHRvIHRoZSBzYW1lIGZpZWxkIG9uIHRoZVxuICAgKiBlbmNvbXBhc3NpbmcgYFN0YWdlYCwgaWYgY29uZmlndXJlZCB0aGVyZS5cbiAgICpcbiAgICogSWYgZWl0aGVyIGByZWdpb25gIG9yIGBhY2NvdW50YCBhcmUgbm90IHNldCBub3IgaW5oZXJpdGVkIGZyb20gYFN0YWdlYCwgdGhlXG4gICAqIFN0YWNrIHdpbGwgYmUgY29uc2lkZXJlZCBcIiplbnZpcm9ubWVudC1hZ25vc3RpYypcIlwiLiBFbnZpcm9ubWVudC1hZ25vc3RpY1xuICAgKiBzdGFja3MgY2FuIGJlIGRlcGxveWVkIHRvIGFueSBlbnZpcm9ubWVudCBidXQgbWF5IG5vdCBiZSBhYmxlIHRvIHRha2VcbiAgICogYWR2YW50YWdlIG9mIGFsbCBmZWF0dXJlcyBvZiB0aGUgQ0RLLiBGb3IgZXhhbXBsZSwgdGhleSB3aWxsIG5vdCBiZSBhYmxlIHRvXG4gICAqIHVzZSBlbnZpcm9ubWVudGFsIGNvbnRleHQgbG9va3VwcyBzdWNoIGFzIGBlYzIuVnBjLmZyb21Mb29rdXBgIGFuZCB3aWxsIG5vdFxuICAgKiBhdXRvbWF0aWNhbGx5IHRyYW5zbGF0ZSBTZXJ2aWNlIFByaW5jaXBhbHMgdG8gdGhlIHJpZ2h0IGZvcm1hdCBiYXNlZCBvbiB0aGVcbiAgICogZW52aXJvbm1lbnQncyBBV1MgcGFydGl0aW9uLCBhbmQgb3RoZXIgc3VjaCBlbmhhbmNlbWVudHMuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIC8vIFVzZSBhIGNvbmNyZXRlIGFjY291bnQgYW5kIHJlZ2lvbiB0byBkZXBsb3kgdGhpcyBzdGFjayB0bzpcbiAgICogLy8gYC5hY2NvdW50YCBhbmQgYC5yZWdpb25gIHdpbGwgc2ltcGx5IHJldHVybiB0aGVzZSB2YWx1ZXMuXG4gICAqIG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7XG4gICAqICAgZW52OiB7XG4gICAqICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICogICAgIHJlZ2lvbjogJ3VzLWVhc3QtMSdcbiAgICogICB9LFxuICAgKiB9KTtcbiAgICpcbiAgICogLy8gVXNlIHRoZSBDTEkncyBjdXJyZW50IGNyZWRlbnRpYWxzIHRvIGRldGVybWluZSB0aGUgdGFyZ2V0IGVudmlyb25tZW50OlxuICAgKiAvLyBgLmFjY291bnRgIGFuZCBgLnJlZ2lvbmAgd2lsbCByZWZsZWN0IHRoZSBhY2NvdW50K3JlZ2lvbiB0aGUgQ0xJXG4gICAqIC8vIGlzIGNvbmZpZ3VyZWQgdG8gdXNlIChiYXNlZCBvbiB0aGUgdXNlciBDTEkgY3JlZGVudGlhbHMpXG4gICAqIG5ldyBTdGFjayhhcHAsICdTdGFjazInLCB7XG4gICAqICAgZW52OiB7XG4gICAqICAgICBhY2NvdW50OiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5ULFxuICAgKiAgICAgcmVnaW9uOiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT05cbiAgICogICB9LFxuICAgKiB9KTtcbiAgICpcbiAgICogLy8gRGVmaW5lIG11bHRpcGxlIHN0YWNrcyBzdGFnZSBhc3NvY2lhdGVkIHdpdGggYW4gZW52aXJvbm1lbnRcbiAgICogY29uc3QgbXlTdGFnZSA9IG5ldyBTdGFnZShhcHAsICdNeVN0YWdlJywge1xuICAgKiAgIGVudjoge1xuICAgKiAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAqICAgICByZWdpb246ICd1cy1lYXN0LTEnXG4gICAqICAgfVxuICAgKiB9KTtcbiAgICpcbiAgICogLy8gYm90aCBvZiB0aGVzZSBzdGFja3Mgd2lsbCB1c2UgdGhlIHN0YWdlJ3MgYWNjb3VudC9yZWdpb246XG4gICAqIC8vIGAuYWNjb3VudGAgYW5kIGAucmVnaW9uYCB3aWxsIHJlc29sdmUgdG8gdGhlIGNvbmNyZXRlIHZhbHVlcyBhcyBhYm92ZVxuICAgKiBuZXcgTXlTdGFjayhteVN0YWdlLCAnU3RhY2sxJyk7XG4gICAqIG5ldyBZb3VyU3RhY2sobXlTdGFnZSwgJ1N0YWNrMicpO1xuICAgKlxuICAgKiAvLyBEZWZpbmUgYW4gZW52aXJvbm1lbnQtYWdub3N0aWMgc3RhY2s6XG4gICAqIC8vIGAuYWNjb3VudGAgYW5kIGAucmVnaW9uYCB3aWxsIHJlc29sdmUgdG8gYHsgXCJSZWZcIjogXCJBV1M6OkFjY291bnRJZFwiIH1gIGFuZCBgeyBcIlJlZlwiOiBcIkFXUzo6UmVnaW9uXCIgfWAgcmVzcGVjdGl2ZWx5LlxuICAgKiAvLyB3aGljaCB3aWxsIG9ubHkgcmVzb2x2ZSB0byBhY3R1YWwgdmFsdWVzIGJ5IENsb3VkRm9ybWF0aW9uIGR1cmluZyBkZXBsb3ltZW50LlxuICAgKiBuZXcgTXlTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgZW52aXJvbm1lbnQgb2YgdGhlIGNvbnRhaW5pbmcgYFN0YWdlYCBpZiBhdmFpbGFibGUsXG4gICAqIG90aGVyd2lzZSBjcmVhdGUgdGhlIHN0YWNrIHdpbGwgYmUgZW52aXJvbm1lbnQtYWdub3N0aWMuXG4gICAqL1xuICByZWFkb25seSBlbnY/OiBFbnZpcm9ubWVudDtcblxuICAvKipcbiAgICogTmFtZSB0byBkZXBsb3kgdGhlIHN0YWNrIHdpdGhcbiAgICpcbiAgICogQGRlZmF1bHQgLSBEZXJpdmVkIGZyb20gY29uc3RydWN0IHBhdGguXG4gICAqL1xuICByZWFkb25seSBzdGFja05hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFN0YWNrIHRhZ3MgdGhhdCB3aWxsIGJlIGFwcGxpZWQgdG8gYWxsIHRoZSB0YWdnYWJsZSByZXNvdXJjZXMgYW5kIHRoZSBzdGFjayBpdHNlbGYuXG4gICAqXG4gICAqIEBkZWZhdWx0IHt9XG4gICAqL1xuICByZWFkb25seSB0YWdzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogU3ludGhlc2lzIG1ldGhvZCB0byB1c2Ugd2hpbGUgZGVwbG95aW5nIHRoaXMgc3RhY2tcbiAgICpcbiAgICogVGhlIFN0YWNrIFN5bnRoZXNpemVyIGNvbnRyb2xzIGFzcGVjdHMgb2Ygc3ludGhlc2lzIGFuZCBkZXBsb3ltZW50LFxuICAgKiBsaWtlIGhvdyBhc3NldHMgYXJlIHJlZmVyZW5jZWQgYW5kIHdoYXQgSUFNIHJvbGVzIHRvIHVzZS4gRm9yIG1vcmVcbiAgICogaW5mb3JtYXRpb24sIHNlZSB0aGUgUkVBRE1FIG9mIHRoZSBtYWluIENESyBwYWNrYWdlLlxuICAgKlxuICAgKiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgYGRlZmF1bHRTdGFja1N5bnRoZXNpemVyYCBmcm9tIGBBcHBgIHdpbGwgYmUgdXNlZC5cbiAgICogSWYgdGhhdCBpcyBub3Qgc3BlY2lmaWVkLCBgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXJgIGlzIHVzZWQgaWZcbiAgICogYEBhd3MtY2RrL2NvcmU6bmV3U3R5bGVTdGFja1N5bnRoZXNpc2AgaXMgc2V0IHRvIGB0cnVlYCBvciB0aGUgQ0RLIG1ham9yXG4gICAqIHZlcnNpb24gaXMgdjIuIEluIENESyB2MSBgTGVnYWN5U3RhY2tTeW50aGVzaXplcmAgaXMgdGhlIGRlZmF1bHQgaWYgbm9cbiAgICogb3RoZXIgc3ludGhlc2l6ZXIgaXMgc3BlY2lmaWVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBzeW50aGVzaXplciBzcGVjaWZpZWQgb24gYEFwcGAsIG9yIGBEZWZhdWx0U3RhY2tTeW50aGVzaXplcmAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgcmVhZG9ubHkgc3ludGhlc2l6ZXI/OiBJU3RhY2tTeW50aGVzaXplcjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBlbmFibGUgdGVybWluYXRpb24gcHJvdGVjdGlvbiBmb3IgdGhpcyBzdGFjay5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHRlcm1pbmF0aW9uUHJvdGVjdGlvbj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEluY2x1ZGUgcnVudGltZSB2ZXJzaW9uaW5nIGluZm9ybWF0aW9uIGluIHRoaXMgU3RhY2tcbiAgICpcbiAgICogQGRlZmF1bHQgYGFuYWx5dGljc1JlcG9ydGluZ2Agc2V0dGluZyBvZiBjb250YWluaW5nIGBBcHBgLCBvciB2YWx1ZSBvZlxuICAgKiAnYXdzOmNkazp2ZXJzaW9uLXJlcG9ydGluZycgY29udGV4dCBrZXlcbiAgICovXG4gIHJlYWRvbmx5IGFuYWx5dGljc1JlcG9ydGluZz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEVuYWJsZSB0aGlzIGZsYWcgdG8gYWxsb3cgbmF0aXZlIGNyb3NzIHJlZ2lvbiBzdGFjayByZWZlcmVuY2VzLlxuICAgKlxuICAgKiBFbmFibGluZyB0aGlzIHdpbGwgY3JlYXRlIGEgQ2xvdWRGb3JtYXRpb24gY3VzdG9tIHJlc291cmNlXG4gICAqIGluIGJvdGggdGhlIHByb2R1Y2luZyBzdGFjayBhbmQgY29uc3VtaW5nIHN0YWNrIGluIG9yZGVyIHRvIHBlcmZvcm0gdGhlIGV4cG9ydC9pbXBvcnRcbiAgICpcbiAgICogVGhpcyBmZWF0dXJlIGlzIGN1cnJlbnRseSBleHBlcmltZW50YWxcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGNyb3NzUmVnaW9uUmVmZXJlbmNlcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgZm9yIGFwcGx5aW5nIGEgcGVybWlzc2lvbnMgYm91bmRhcnkgdG8gYWxsIElBTSBSb2xlc1xuICAgKiBhbmQgVXNlcnMgY3JlYXRlZCB3aXRoaW4gdGhpcyBTdGFnZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHBlcm1pc3Npb25zIGJvdW5kYXJ5IGlzIGFwcGxpZWRcbiAgICovXG4gIHJlYWRvbmx5IHBlcm1pc3Npb25zQm91bmRhcnk/OiBQZXJtaXNzaW9uc0JvdW5kYXJ5O1xufVxuXG4vKipcbiAqIEEgcm9vdCBjb25zdHJ1Y3Qgd2hpY2ggcmVwcmVzZW50cyBhIHNpbmdsZSBDbG91ZEZvcm1hdGlvbiBzdGFjay5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0YWNrIGV4dGVuZHMgQ29uc3RydWN0IGltcGxlbWVudHMgSVRhZ2dhYmxlIHtcbiAgLyoqXG4gICAqIFJldHVybiB3aGV0aGVyIHRoZSBnaXZlbiBvYmplY3QgaXMgYSBTdGFjay5cbiAgICpcbiAgICogV2UgZG8gYXR0cmlidXRlIGRldGVjdGlvbiBzaW5jZSB3ZSBjYW4ndCByZWxpYWJseSB1c2UgJ2luc3RhbmNlb2YnLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc1N0YWNrKHg6IGFueSk6IHggaXMgU3RhY2sge1xuICAgIHJldHVybiB4ICE9PSBudWxsICYmIHR5cGVvZih4KSA9PT0gJ29iamVjdCcgJiYgU1RBQ0tfU1lNQk9MIGluIHg7XG4gIH1cblxuICAvKipcbiAgICogTG9va3MgdXAgdGhlIGZpcnN0IHN0YWNrIHNjb3BlIGluIHdoaWNoIGBjb25zdHJ1Y3RgIGlzIGRlZmluZWQuIEZhaWxzIGlmIHRoZXJlIGlzIG5vIHN0YWNrIHVwIHRoZSB0cmVlLlxuICAgKiBAcGFyYW0gY29uc3RydWN0IFRoZSBjb25zdHJ1Y3QgdG8gc3RhcnQgdGhlIHNlYXJjaCBmcm9tLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBvZihjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QpOiBTdGFjayB7XG4gICAgLy8gd2Ugd2FudCB0aGlzIHRvIGJlIGFzIGNoZWFwIGFzIHBvc3NpYmxlLiBjYWNoZSB0aGlzIHJlc3VsdCBieSBtdXRhdGluZ1xuICAgIC8vIHRoZSBvYmplY3QuIGFuZWNkb3RhbGx5LCBhdCB0aGUgdGltZSBvZiB0aGlzIHdyaXRpbmcsIEBhd3MtY2RrL2NvcmUgdW5pdFxuICAgIC8vIHRlc3RzIGhpdCB0aGlzIGNhY2hlIDEsMTEyIHRpbWVzLCBAYXdzLWNkay9hd3MtY2xvdWRmb3JtYXRpb24gdW5pdCB0ZXN0c1xuICAgIC8vIGhpdCB0aGlzIDIsNDM1IHRpbWVzKS5cbiAgICBjb25zdCBjYWNoZSA9IChjb25zdHJ1Y3QgYXMgYW55KVtNWV9TVEFDS19DQUNIRV0gYXMgU3RhY2sgfCB1bmRlZmluZWQ7XG4gICAgaWYgKGNhY2hlKSB7XG4gICAgICByZXR1cm4gY2FjaGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gX2xvb2t1cChjb25zdHJ1Y3QpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdCwgTVlfU1RBQ0tfQ0FDSEUsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWUsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfbG9va3VwKGM6IElDb25zdHJ1Y3QpOiBTdGFjayB7XG4gICAgICBpZiAoU3RhY2suaXNTdGFjayhjKSkge1xuICAgICAgICByZXR1cm4gYztcbiAgICAgIH1cblxuICAgICAgY29uc3QgX3Njb3BlID0gTm9kZS5vZihjKS5zY29wZTtcbiAgICAgIGlmIChTdGFnZS5pc1N0YWdlKGMpIHx8ICFfc2NvcGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2NvbnN0cnVjdC5jb25zdHJ1Y3Rvcj8ubmFtZSA/PyAnQ29uc3RydWN0J30gYXQgJyR7Tm9kZS5vZihjb25zdHJ1Y3QpLnBhdGh9JyBzaG91bGQgYmUgY3JlYXRlZCBpbiB0aGUgc2NvcGUgb2YgYSBTdGFjaywgYnV0IG5vIFN0YWNrIGZvdW5kYCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfbG9va3VwKF9zY29wZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRhZ3MgdG8gYmUgYXBwbGllZCB0byB0aGUgc3RhY2suXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdGFnczogVGFnTWFuYWdlcjtcblxuICAvKipcbiAgICogT3B0aW9ucyBmb3IgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgKGxpa2UgdmVyc2lvbiwgdHJhbnNmb3JtLCBkZXNjcmlwdGlvbikuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdGVtcGxhdGVPcHRpb25zOiBJVGVtcGxhdGVPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBUaGUgQVdTIHJlZ2lvbiBpbnRvIHdoaWNoIHRoaXMgc3RhY2sgd2lsbCBiZSBkZXBsb3llZCAoZS5nLiBgdXMtd2VzdC0yYCkuXG4gICAqXG4gICAqIFRoaXMgdmFsdWUgaXMgcmVzb2x2ZWQgYWNjb3JkaW5nIHRvIHRoZSBmb2xsb3dpbmcgcnVsZXM6XG4gICAqXG4gICAqIDEuIFRoZSB2YWx1ZSBwcm92aWRlZCB0byBgZW52LnJlZ2lvbmAgd2hlbiB0aGUgc3RhY2sgaXMgZGVmaW5lZC4gVGhpcyBjYW5cbiAgICogICAgZWl0aGVyIGJlIGEgY29uY3JldGUgcmVnaW9uIChlLmcuIGB1cy13ZXN0LTJgKSBvciB0aGUgYEF3cy5SRUdJT05gXG4gICAqICAgIHRva2VuLlxuICAgKiAzLiBgQXdzLlJFR0lPTmAsIHdoaWNoIGlzIHJlcHJlc2VudHMgdGhlIENsb3VkRm9ybWF0aW9uIGludHJpbnNpYyByZWZlcmVuY2VcbiAgICogICAgYHsgXCJSZWZcIjogXCJBV1M6OlJlZ2lvblwiIH1gIGVuY29kZWQgYXMgYSBzdHJpbmcgdG9rZW4uXG4gICAqXG4gICAqIFByZWZlcmFibHksIHlvdSBzaG91bGQgdXNlIHRoZSByZXR1cm4gdmFsdWUgYXMgYW4gb3BhcXVlIHN0cmluZyBhbmQgbm90XG4gICAqIGF0dGVtcHQgdG8gcGFyc2UgaXQgdG8gaW1wbGVtZW50IHlvdXIgbG9naWMuIElmIHlvdSBkbywgeW91IG11c3QgZmlyc3RcbiAgICogY2hlY2sgdGhhdCBpdCBpcyBhIGNvbmNyZXRlIHZhbHVlIGFuIG5vdCBhbiB1bnJlc29sdmVkIHRva2VuLiBJZiB0aGlzXG4gICAqIHZhbHVlIGlzIGFuIHVucmVzb2x2ZWQgdG9rZW4gKGBUb2tlbi5pc1VucmVzb2x2ZWQoc3RhY2sucmVnaW9uKWAgcmV0dXJuc1xuICAgKiBgdHJ1ZWApLCB0aGlzIGltcGxpZXMgdGhhdCB0aGUgdXNlciB3aXNoZXMgdGhhdCB0aGlzIHN0YWNrIHdpbGwgc3ludGhlc2l6ZVxuICAgKiBpbnRvIGEgKipyZWdpb24tYWdub3N0aWMgdGVtcGxhdGUqKi4gSW4gdGhpcyBjYXNlLCB5b3VyIGNvZGUgc2hvdWxkIGVpdGhlclxuICAgKiBmYWlsICh0aHJvdyBhbiBlcnJvciwgZW1pdCBhIHN5bnRoIGVycm9yIHVzaW5nIGBBbm5vdGF0aW9ucy5vZihjb25zdHJ1Y3QpLmFkZEVycm9yKClgKSBvclxuICAgKiBpbXBsZW1lbnQgc29tZSBvdGhlciByZWdpb24tYWdub3N0aWMgYmVoYXZpb3IuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcmVnaW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBV1MgYWNjb3VudCBpbnRvIHdoaWNoIHRoaXMgc3RhY2sgd2lsbCBiZSBkZXBsb3llZC5cbiAgICpcbiAgICogVGhpcyB2YWx1ZSBpcyByZXNvbHZlZCBhY2NvcmRpbmcgdG8gdGhlIGZvbGxvd2luZyBydWxlczpcbiAgICpcbiAgICogMS4gVGhlIHZhbHVlIHByb3ZpZGVkIHRvIGBlbnYuYWNjb3VudGAgd2hlbiB0aGUgc3RhY2sgaXMgZGVmaW5lZC4gVGhpcyBjYW5cbiAgICogICAgZWl0aGVyIGJlIGEgY29uY3JldGUgYWNjb3VudCAoZS5nLiBgNTg1Njk1MDMxMTExYCkgb3IgdGhlXG4gICAqICAgIGBBd3MuQUNDT1VOVF9JRGAgdG9rZW4uXG4gICAqIDMuIGBBd3MuQUNDT1VOVF9JRGAsIHdoaWNoIHJlcHJlc2VudHMgdGhlIENsb3VkRm9ybWF0aW9uIGludHJpbnNpYyByZWZlcmVuY2VcbiAgICogICAgYHsgXCJSZWZcIjogXCJBV1M6OkFjY291bnRJZFwiIH1gIGVuY29kZWQgYXMgYSBzdHJpbmcgdG9rZW4uXG4gICAqXG4gICAqIFByZWZlcmFibHksIHlvdSBzaG91bGQgdXNlIHRoZSByZXR1cm4gdmFsdWUgYXMgYW4gb3BhcXVlIHN0cmluZyBhbmQgbm90XG4gICAqIGF0dGVtcHQgdG8gcGFyc2UgaXQgdG8gaW1wbGVtZW50IHlvdXIgbG9naWMuIElmIHlvdSBkbywgeW91IG11c3QgZmlyc3RcbiAgICogY2hlY2sgdGhhdCBpdCBpcyBhIGNvbmNyZXRlIHZhbHVlIGFuIG5vdCBhbiB1bnJlc29sdmVkIHRva2VuLiBJZiB0aGlzXG4gICAqIHZhbHVlIGlzIGFuIHVucmVzb2x2ZWQgdG9rZW4gKGBUb2tlbi5pc1VucmVzb2x2ZWQoc3RhY2suYWNjb3VudClgIHJldHVybnNcbiAgICogYHRydWVgKSwgdGhpcyBpbXBsaWVzIHRoYXQgdGhlIHVzZXIgd2lzaGVzIHRoYXQgdGhpcyBzdGFjayB3aWxsIHN5bnRoZXNpemVcbiAgICogaW50byBhICoqYWNjb3VudC1hZ25vc3RpYyB0ZW1wbGF0ZSoqLiBJbiB0aGlzIGNhc2UsIHlvdXIgY29kZSBzaG91bGQgZWl0aGVyXG4gICAqIGZhaWwgKHRocm93IGFuIGVycm9yLCBlbWl0IGEgc3ludGggZXJyb3IgdXNpbmcgYEFubm90YXRpb25zLm9mKGNvbnN0cnVjdCkuYWRkRXJyb3IoKWApIG9yXG4gICAqIGltcGxlbWVudCBzb21lIG90aGVyIHJlZ2lvbi1hZ25vc3RpYyBiZWhhdmlvci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhY2NvdW50OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBlbnZpcm9ubWVudCBjb29yZGluYXRlcyBpbiB3aGljaCB0aGlzIHN0YWNrIGlzIGRlcGxveWVkLiBJbiB0aGUgZm9ybVxuICAgKiBgYXdzOi8vYWNjb3VudC9yZWdpb25gLiBVc2UgYHN0YWNrLmFjY291bnRgIGFuZCBgc3RhY2sucmVnaW9uYCB0byBvYnRhaW5cbiAgICogdGhlIHNwZWNpZmljIHZhbHVlcywgbm8gbmVlZCB0byBwYXJzZS5cbiAgICpcbiAgICogWW91IGNhbiB1c2UgdGhpcyB2YWx1ZSB0byBkZXRlcm1pbmUgaWYgdHdvIHN0YWNrcyBhcmUgdGFyZ2V0aW5nIHRoZSBzYW1lXG4gICAqIGVudmlyb25tZW50LlxuICAgKlxuICAgKiBJZiBlaXRoZXIgYHN0YWNrLmFjY291bnRgIG9yIGBzdGFjay5yZWdpb25gIGFyZSBub3QgY29uY3JldGUgdmFsdWVzIChlLmcuXG4gICAqIGBBd3MuQUNDT1VOVF9JRGAgb3IgYEF3cy5SRUdJT05gKSB0aGUgc3BlY2lhbCBzdHJpbmdzIGB1bmtub3duLWFjY291bnRgIGFuZC9vclxuICAgKiBgdW5rbm93bi1yZWdpb25gIHdpbGwgYmUgdXNlZCByZXNwZWN0aXZlbHkgdG8gaW5kaWNhdGUgdGhpcyBzdGFjayBpc1xuICAgKiByZWdpb24vYWNjb3VudC1hZ25vc3RpYy5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBlbnZpcm9ubWVudDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRlcm1pbmF0aW9uIHByb3RlY3Rpb24gaXMgZW5hYmxlZCBmb3IgdGhpcyBzdGFjay5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0ZXJtaW5hdGlvblByb3RlY3Rpb24/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiB0aGlzIGlzIGEgbmVzdGVkIHN0YWNrLCB0aGlzIHJlcHJlc2VudHMgaXRzIGBBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFja2BcbiAgICogcmVzb3VyY2UuIGB1bmRlZmluZWRgIGZvciB0b3AtbGV2ZWwgKG5vbi1uZXN0ZWQpIHN0YWNrcy5cbiAgICpcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBuZXN0ZWRTdGFja1Jlc291cmNlPzogQ2ZuUmVzb3VyY2U7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBmaWxlIGVtaXR0ZWQgdG8gdGhlIG91dHB1dFxuICAgKiBkaXJlY3RvcnkgZHVyaW5nIHN5bnRoZXNpcy5cbiAgICpcbiAgICogRXhhbXBsZSB2YWx1ZTogYE15U3RhY2sudGVtcGxhdGUuanNvbmBcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0ZW1wbGF0ZUZpbGU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBjbG91ZCBhc3NlbWJseSBhcnRpZmFjdCBmb3IgdGhpcyBzdGFjay5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhcnRpZmFjdElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFN5bnRoZXNpcyBtZXRob2QgZm9yIHRoaXMgc3RhY2tcbiAgICpcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzeW50aGVzaXplcjogSVN0YWNrU3ludGhlc2l6ZXI7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdmVyc2lvbiByZXBvcnRpbmcgaXMgZW5hYmxlZCBmb3IgdGhpcyBzdGFja1xuICAgKlxuICAgKiBDb250cm9scyB3aGV0aGVyIHRoZSBDREsgTWV0YWRhdGEgcmVzb3VyY2UgaXMgaW5qZWN0ZWRcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgX3ZlcnNpb25SZXBvcnRpbmdFbmFibGVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGNyb3NzIHJlZ2lvbiByZWZlcmVuY2VzIGFyZSBlbmFibGVkIGZvciB0aGlzIHN0YWNrXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IF9jcm9zc1JlZ2lvblJlZmVyZW5jZXM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIExvZ2ljYWwgSUQgZ2VuZXJhdGlvbiBzdHJhdGVneVxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfbG9naWNhbElkczogTG9naWNhbElEcztcblxuICAvKipcbiAgICogT3RoZXIgc3RhY2tzIHRoaXMgc3RhY2sgZGVwZW5kcyBvblxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfc3RhY2tEZXBlbmRlbmNpZXM6IHsgW3VuaXF1ZUlkOiBzdHJpbmddOiBTdGFja0RlcGVuZGVuY3kgfTtcblxuICAvKipcbiAgICogTGlzdHMgYWxsIG1pc3NpbmcgY29udGV4dHVhbCBpbmZvcm1hdGlvbi5cbiAgICogVGhpcyBpcyByZXR1cm5lZCB3aGVuIHRoZSBzdGFjayBpcyBzeW50aGVzaXplZCB1bmRlciB0aGUgJ21pc3NpbmcnIGF0dHJpYnV0ZVxuICAgKiBhbmQgYWxsb3dzIHRvb2xpbmcgdG8gb2J0YWluIHRoZSBjb250ZXh0IGFuZCByZS1zeW50aGVzaXplLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfbWlzc2luZ0NvbnRleHQ6IGN4c2NoZW1hLk1pc3NpbmdDb250ZXh0W107XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfc3RhY2tOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgc3RhY2suXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBQYXJlbnQgb2YgdGhpcyBzdGFjaywgdXN1YWxseSBhbiBgQXBwYCBvciBhIGBTdGFnZWAsIGJ1dCBjb3VsZCBiZSBhbnkgY29uc3RydWN0LlxuICAgKiBAcGFyYW0gaWQgVGhlIGNvbnN0cnVjdCBJRCBvZiB0aGlzIHN0YWNrLiBJZiBgc3RhY2tOYW1lYCBpcyBub3QgZXhwbGljaXRseVxuICAgKiBkZWZpbmVkLCB0aGlzIGlkIChhbmQgYW55IHBhcmVudCBJRHMpIHdpbGwgYmUgdXNlZCB0byBkZXRlcm1pbmUgdGhlXG4gICAqIHBoeXNpY2FsIElEIG9mIHRoZSBzdGFjay5cbiAgICogQHBhcmFtIHByb3BzIFN0YWNrIHByb3BlcnRpZXMuXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3Ioc2NvcGU/OiBDb25zdHJ1Y3QsIGlkPzogc3RyaW5nLCBwcm9wczogU3RhY2tQcm9wcyA9IHt9KSB7XG4gICAgLy8gRm9yIHVuaXQgdGVzdCBzY29wZSBhbmQgaWQgYXJlIG9wdGlvbmFsIGZvciBzdGFja3MsIGJ1dCB3ZSBzdGlsbCB3YW50IGFuIEFwcFxuICAgIC8vIGFzIHRoZSBwYXJlbnQgYmVjYXVzZSBhcHBzIGltcGxlbWVudCBtdWNoIG9mIHRoZSBzeW50aGVzaXMgbG9naWMuXG4gICAgc2NvcGUgPSBzY29wZSA/PyBuZXcgQXBwKHtcbiAgICAgIGF1dG9TeW50aDogZmFsc2UsXG4gICAgICBvdXRkaXI6IEZpbGVTeXN0ZW0ubWtkdGVtcCgnY2RrLXRlc3QtYXBwLScpLFxuICAgIH0pO1xuXG4gICAgLy8gXCJEZWZhdWx0XCIgaXMgYSBcImhpZGRlbiBpZFwiIGZyb20gYSBgbm9kZS51bmlxdWVJZGAgcGVyc3BlY3RpdmVcbiAgICBpZCA9IGlkID8/ICdEZWZhdWx0JztcblxuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLl9taXNzaW5nQ29udGV4dCA9IG5ldyBBcnJheTxjeHNjaGVtYS5NaXNzaW5nQ29udGV4dD4oKTtcbiAgICB0aGlzLl9zdGFja0RlcGVuZGVuY2llcyA9IHsgfTtcbiAgICB0aGlzLnRlbXBsYXRlT3B0aW9ucyA9IHsgfTtcbiAgICB0aGlzLl9jcm9zc1JlZ2lvblJlZmVyZW5jZXMgPSAhIXByb3BzLmNyb3NzUmVnaW9uUmVmZXJlbmNlcztcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBTVEFDS19TWU1CT0wsIHsgdmFsdWU6IHRydWUgfSk7XG5cbiAgICB0aGlzLl9sb2dpY2FsSWRzID0gbmV3IExvZ2ljYWxJRHMoKTtcblxuICAgIGNvbnN0IHsgYWNjb3VudCwgcmVnaW9uLCBlbnZpcm9ubWVudCB9ID0gdGhpcy5wYXJzZUVudmlyb25tZW50KHByb3BzLmVudik7XG5cbiAgICB0aGlzLmFjY291bnQgPSBhY2NvdW50O1xuICAgIHRoaXMucmVnaW9uID0gcmVnaW9uO1xuICAgIHRoaXMuZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudDtcbiAgICB0aGlzLnRlcm1pbmF0aW9uUHJvdGVjdGlvbiA9IHByb3BzLnRlcm1pbmF0aW9uUHJvdGVjdGlvbjtcblxuICAgIGlmIChwcm9wcy5kZXNjcmlwdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBNYXggbGVuZ3RoIDEwMjQgYnl0ZXNcbiAgICAgIC8vIFR5cGljYWxseSAyIGJ5dGVzIHBlciBjaGFyYWN0ZXIsIG1heSBiZSBtb3JlIGZvciBtb3JlIGV4b3RpYyBjaGFyYWN0ZXJzXG4gICAgICBpZiAocHJvcHMuZGVzY3JpcHRpb24ubGVuZ3RoID4gNTEyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgU3RhY2sgZGVzY3JpcHRpb24gbXVzdCBiZSA8PSAxMDI0IGJ5dGVzLiBSZWNlaXZlZCBkZXNjcmlwdGlvbjogJyR7cHJvcHMuZGVzY3JpcHRpb259J2ApO1xuICAgICAgfVxuICAgICAgdGhpcy50ZW1wbGF0ZU9wdGlvbnMuZGVzY3JpcHRpb24gPSBwcm9wcy5kZXNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICB0aGlzLl9zdGFja05hbWUgPSBwcm9wcy5zdGFja05hbWUgPz8gdGhpcy5nZW5lcmF0ZVN0YWNrTmFtZSgpO1xuICAgIGlmICh0aGlzLl9zdGFja05hbWUubGVuZ3RoID4gMTI4KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFN0YWNrIG5hbWUgbXVzdCBiZSA8PSAxMjggY2hhcmFjdGVycy4gU3RhY2sgbmFtZTogJyR7dGhpcy5fc3RhY2tOYW1lfSdgKTtcbiAgICB9XG4gICAgdGhpcy50YWdzID0gbmV3IFRhZ01hbmFnZXIoVGFnVHlwZS5LRVlfVkFMVUUsICdhd3M6Y2RrOnN0YWNrJywgcHJvcHMudGFncyk7XG5cbiAgICBpZiAoIVZBTElEX1NUQUNLX05BTUVfUkVHRVgudGVzdCh0aGlzLnN0YWNrTmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU3RhY2sgbmFtZSBtdXN0IG1hdGNoIHRoZSByZWd1bGFyIGV4cHJlc3Npb246ICR7VkFMSURfU1RBQ0tfTkFNRV9SRUdFWC50b1N0cmluZygpfSwgZ290ICcke3RoaXMuc3RhY2tOYW1lfSdgKTtcbiAgICB9XG5cbiAgICAvLyB0aGUgcHJlZmVycmVkIGJlaGF2aW9yIGlzIHRvIGdlbmVyYXRlIGEgdW5pcXVlIGlkIGZvciB0aGlzIHN0YWNrIGFuZCB1c2VcbiAgICAvLyBpdCBhcyB0aGUgYXJ0aWZhY3QgSUQgaW4gdGhlIGFzc2VtYmx5LiB0aGlzIGFsbG93cyBtdWx0aXBsZSBzdGFja3MgdG8gdXNlXG4gICAgLy8gdGhlIHNhbWUgbmFtZS4gaG93ZXZlciwgdGhpcyBiZWhhdmlvciBpcyBicmVha2luZyBmb3IgMS54IHNvIGl0J3Mgb25seVxuICAgIC8vIGFwcGxpZWQgdW5kZXIgYSBmZWF0dXJlIGZsYWcgd2hpY2ggaXMgYXBwbGllZCBhdXRvbWF0aWNhbGx5IGZvciBuZXdcbiAgICAvLyBwcm9qZWN0cyBjcmVhdGVkIHVzaW5nIGBjZGsgaW5pdGAuXG4gICAgLy9cbiAgICAvLyBBbHNvIHVzZSB0aGUgbmV3IGJlaGF2aW9yIGlmIHdlIGFyZSB1c2luZyB0aGUgbmV3IENJL0NELXJlYWR5IHN5bnRoZXNpemVyOyB0aGF0IHdheVxuICAgIC8vIHBlb3BsZSBvbmx5IGhhdmUgdG8gZmxpcCBvbmUgZmxhZy5cbiAgICBjb25zdCBmZWF0dXJlRmxhZ3MgPSBGZWF0dXJlRmxhZ3Mub2YodGhpcyk7XG4gICAgY29uc3Qgc3RhY2tOYW1lRHVwZUNvbnRleHQgPSBmZWF0dXJlRmxhZ3MuaXNFbmFibGVkKGN4YXBpLkVOQUJMRV9TVEFDS19OQU1FX0RVUExJQ0FURVNfQ09OVEVYVCk7XG4gICAgY29uc3QgbmV3U3R5bGVTeW50aGVzaXNDb250ZXh0ID0gZmVhdHVyZUZsYWdzLmlzRW5hYmxlZChjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFQpO1xuICAgIHRoaXMuYXJ0aWZhY3RJZCA9IChzdGFja05hbWVEdXBlQ29udGV4dCB8fCBuZXdTdHlsZVN5bnRoZXNpc0NvbnRleHQpXG4gICAgICA/IHRoaXMuZ2VuZXJhdGVTdGFja0FydGlmYWN0SWQoKVxuICAgICAgOiB0aGlzLnN0YWNrTmFtZTtcblxuICAgIHRoaXMudGVtcGxhdGVGaWxlID0gYCR7dGhpcy5hcnRpZmFjdElkfS50ZW1wbGF0ZS5qc29uYDtcblxuICAgIC8vIE5vdCBmb3IgbmVzdGVkIHN0YWNrc1xuICAgIHRoaXMuX3ZlcnNpb25SZXBvcnRpbmdFbmFibGVkID0gKHByb3BzLmFuYWx5dGljc1JlcG9ydGluZyA/PyB0aGlzLm5vZGUudHJ5R2V0Q29udGV4dChjeGFwaS5BTkFMWVRJQ1NfUkVQT1JUSU5HX0VOQUJMRURfQ09OVEVYVCkpXG4gICAgICAmJiAhdGhpcy5uZXN0ZWRTdGFja1BhcmVudDtcblxuICAgIGNvbnN0IHN5bnRoZXNpemVyID0gKHByb3BzLnN5bnRoZXNpemVyXG4gICAgICA/PyB0aGlzLm5vZGUudHJ5R2V0Q29udGV4dChQUklWQVRFX0NPTlRFWFRfREVGQVVMVF9TVEFDS19TWU5USEVTSVpFUilcbiAgICAgID8/IChuZXdTdHlsZVN5bnRoZXNpc0NvbnRleHQgPyBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoKSA6IG5ldyBMZWdhY3lTdGFja1N5bnRoZXNpemVyKCkpKTtcblxuICAgIGlmIChpc1JldXNhYmxlU3RhY2tTeW50aGVzaXplcihzeW50aGVzaXplcikpIHtcbiAgICAgIC8vIFByb2R1Y2UgYSBmcmVzaCBpbnN0YW5jZSBmb3IgZWFjaCBzdGFjayAoc2hvdWxkIGhhdmUgYmVlbiB0aGUgZGVmYXVsdCBiZWhhdmlvcilcbiAgICAgIHRoaXMuc3ludGhlc2l6ZXIgPSBzeW50aGVzaXplci5yZXVzYWJsZUJpbmQodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJpbmQgdGhlIHNpbmdsZSBpbnN0YW5jZSBpbi1wbGFjZSB0byB0aGUgY3VycmVudCBzdGFjayAoYmFja3dhcmRzIGNvbXBhdClcbiAgICAgIHRoaXMuc3ludGhlc2l6ZXIgPSBzeW50aGVzaXplcjtcbiAgICAgIHRoaXMuc3ludGhlc2l6ZXIuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBwcm9wcy5wZXJtaXNzaW9uc0JvdW5kYXJ5Py5fYmluZCh0aGlzKTtcblxuICAgIC8vIGFkZCB0aGUgcGVybWlzc2lvbnMgYm91bmRhcnkgYXNwZWN0XG4gICAgdGhpcy5hZGRQZXJtaXNzaW9uc0JvdW5kYXJ5QXNwZWN0KCk7XG4gIH1cblxuICAvKipcbiAgICogSWYgYSBwZXJtaXNzaW9ucyBib3VuZGFyeSBoYXMgYmVlbiBhcHBsaWVkIG9uIHRoaXMgc2NvcGUgb3IgYW55IHBhcmVudCBzY29wZVxuICAgKiB0aGVuIHRoaXMgd2lsbCByZXR1cm4gdGhlIEFSTiBvZiB0aGUgcGVybWlzc2lvbnMgYm91bmRhcnkuXG4gICAqXG4gICAqIFRoaXMgd2lsbCByZXR1cm4gdGhlIHBlcm1pc3Npb25zIGJvdW5kYXJ5IHRoYXQgaGFzIGJlZW4gYXBwbGllZCB0byB0aGUgbW9zdFxuICAgKiBzcGVjaWZpYyBzY29wZS5cbiAgICpcbiAgICogRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIGNvbnN0IHN0YWdlID0gbmV3IFN0YWdlKGFwcCwgJ3N0YWdlJywge1xuICAgKiAgIHBlcm1pc3Npb25zQm91bmRhcnk6IFBlcm1pc3Npb25zQm91bmRhcnkuZnJvbU5hbWUoJ3N0YWdlLXBiJyksXG4gICAqIH0pO1xuICAgKlxuICAgKiBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhzdGFnZSwgJ1N0YWNrJywge1xuICAgKiAgIHBlcm1pc3Npb25zQm91bmRhcnk6IFBlcm1pc3Npb25zQm91bmRhcnkuZnJvbU5hbWUoJ3NvbWUtb3RoZXItcGInKSxcbiAgICogfSk7XG4gICAqXG4gICAqICBTdGFjay5wZXJtaXNzaW9uc0JvdW5kYXJ5QXJuID09PSAnYXJuOiR7QVdTOjpQYXJ0aXRpb259OmlhbTo6JHtBV1M6OkFjY291bnRJZH06cG9saWN5L3NvbWUtb3RoZXItcGInO1xuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgdGhlIGNvbnN0cnVjdCBzY29wZSB0byByZXRyaWV2ZSB0aGUgcGVybWlzc2lvbnMgYm91bmRhcnkgbmFtZSBmcm9tXG4gICAqIEByZXR1cm5zIHRoZSBuYW1lIG9mIHRoZSBwZXJtaXNzaW9ucyBib3VuZGFyeSBvciB1bmRlZmluZWQgaWYgbm90IHNldFxuICAgKi9cbiAgcHJpdmF0ZSBnZXQgcGVybWlzc2lvbnNCb3VuZGFyeUFybigpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHF1YWxpZmllciA9IHRoaXMuc3ludGhlc2l6ZXIuYm9vdHN0cmFwUXVhbGlmaWVyXG4gICAgICA/PyB0aGlzLm5vZGUudHJ5R2V0Q29udGV4dChCT09UU1RSQVBfUVVBTElGSUVSX0NPTlRFWFQpXG4gICAgICA/PyBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX1FVQUxJRklFUjtcbiAgICBjb25zdCBzcGVjID0gbmV3IFN0cmluZ1NwZWNpYWxpemVyKHRoaXMsIHF1YWxpZmllcik7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KFBFUk1JU1NJT05TX0JPVU5EQVJZX0NPTlRFWFRfS0VZKTtcbiAgICBsZXQgYXJuOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgaWYgKGNvbnRleHQgJiYgY29udGV4dC5hcm4pIHtcbiAgICAgIGFybiA9IHNwZWMuc3BlY2lhbGl6ZShjb250ZXh0LmFybik7XG4gICAgfSBlbHNlIGlmIChjb250ZXh0ICYmIGNvbnRleHQubmFtZSkge1xuICAgICAgYXJuID0gc3BlYy5zcGVjaWFsaXplKHRoaXMuZm9ybWF0QXJuKHtcbiAgICAgICAgc2VydmljZTogJ2lhbScsXG4gICAgICAgIHJlc291cmNlOiAncG9saWN5JyxcbiAgICAgICAgcmVnaW9uOiAnJyxcbiAgICAgICAgcmVzb3VyY2VOYW1lOiBjb250ZXh0Lm5hbWUsXG4gICAgICB9KSk7XG4gICAgfVxuICAgIGlmIChhcm4gJiZcbiAgICAgIChhcm4uaW5jbHVkZXMoJyR7UXVhbGlmaWVyfScpXG4gICAgICB8fCBhcm4uaW5jbHVkZXMoJyR7QVdTOjpBY2NvdW50SWR9JylcbiAgICAgIHx8IGFybi5pbmNsdWRlcygnJHtBV1M6OlJlZ2lvbn0nKVxuICAgICAgfHwgYXJuLmluY2x1ZGVzKCcke0FXUzo6UGFydGl0aW9ufScpKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgcGVybWlzc2lvbnMgYm91bmRhcnkgJHthcm59IGluY2x1ZGVzIGEgcHNldWRvIHBhcmFtZXRlciwgYCArXG4gICAgICAnd2hpY2ggaXMgbm90IHN1cHBvcnRlZCBmb3IgZW52aXJvbm1lbnQgYWdub3N0aWMgc3RhY2tzJyk7XG4gICAgfVxuICAgIHJldHVybiBhcm47XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBhc3BlY3QgdG8gdGhlIHN0YWNrIHRoYXQgd2lsbCBhcHBseSB0aGUgcGVybWlzc2lvbnMgYm91bmRhcnkuXG4gICAqIFRoaXMgd2lsbCBvbmx5IGFkZCB0aGUgYXNwZWN0IGlmIHRoZSBwZXJtaXNzaW9ucyBib3VuZGFyeSBoYXMgYmVlbiBzZXRcbiAgICovXG4gIHByaXZhdGUgYWRkUGVybWlzc2lvbnNCb3VuZGFyeUFzcGVjdCgpOiB2b2lkIHtcbiAgICBjb25zdCBwZXJtaXNzaW9uc0JvdW5kYXJ5QXJuID0gdGhpcy5wZXJtaXNzaW9uc0JvdW5kYXJ5QXJuO1xuICAgIGlmIChwZXJtaXNzaW9uc0JvdW5kYXJ5QXJuKSB7XG4gICAgICBBc3BlY3RzLm9mKHRoaXMpLmFkZCh7XG4gICAgICAgIHZpc2l0KG5vZGU6IElDb25zdHJ1Y3QpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBDZm5SZXNvdXJjZS5pc0NmblJlc291cmNlKG5vZGUpICYmXG4gICAgICAgICAgICAgIChub2RlLmNmblJlc291cmNlVHlwZSA9PSAnQVdTOjpJQU06OlJvbGUnIHx8IG5vZGUuY2ZuUmVzb3VyY2VUeXBlID09ICdBV1M6OklBTTo6VXNlcicpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBub2RlLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ1Blcm1pc3Npb25zQm91bmRhcnknLCBwZXJtaXNzaW9uc0JvdW5kYXJ5QXJuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlIGEgdG9rZW5pemVkIHZhbHVlIGluIHRoZSBjb250ZXh0IG9mIHRoZSBjdXJyZW50IHN0YWNrLlxuICAgKi9cbiAgcHVibGljIHJlc29sdmUob2JqOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiByZXNvbHZlKG9iaiwge1xuICAgICAgc2NvcGU6IHRoaXMsXG4gICAgICBwcmVmaXg6IFtdLFxuICAgICAgcmVzb2x2ZXI6IENMT1VERk9STUFUSU9OX1RPS0VOX1JFU09MVkVSLFxuICAgICAgcHJlcGFyaW5nOiBmYWxzZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIG9iamVjdCwgcG90ZW50aWFsbHkgY29udGFpbmluZyB0b2tlbnMsIHRvIGEgSlNPTiBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyB0b0pzb25TdHJpbmcob2JqOiBhbnksIHNwYWNlPzogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gQ2xvdWRGb3JtYXRpb25MYW5nLnRvSlNPTihvYmosIHNwYWNlKS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYW4gb2JqZWN0LCBwb3RlbnRpYWxseSBjb250YWluaW5nIHRva2VucywgdG8gYSBZQU1MIHN0cmluZ1xuICAgKi9cbiAgcHVibGljIHRvWWFtbFN0cmluZyhvYmo6IGFueSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIENsb3VkRm9ybWF0aW9uTGFuZy50b1lBTUwob2JqKS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIERFUFJFQ0FURURcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGByZXBvcnRNaXNzaW5nQ29udGV4dEtleSgpYFxuICAgKi9cbiAgcHVibGljIHJlcG9ydE1pc3NpbmdDb250ZXh0KHJlcG9ydDogY3hhcGkuTWlzc2luZ0NvbnRleHQpIHtcbiAgICBpZiAoIU9iamVjdC52YWx1ZXMoY3hzY2hlbWEuQ29udGV4dFByb3ZpZGVyKS5pbmNsdWRlcyhyZXBvcnQucHJvdmlkZXIgYXMgY3hzY2hlbWEuQ29udGV4dFByb3ZpZGVyKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGNvbnRleHQgcHJvdmlkZXIgcmVxdWVzdGVkIGluOiAke0pTT04uc3RyaW5naWZ5KHJlcG9ydCl9YCk7XG4gICAgfVxuICAgIHRoaXMucmVwb3J0TWlzc2luZ0NvbnRleHRLZXkocmVwb3J0IGFzIGN4c2NoZW1hLk1pc3NpbmdDb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZSB0aGF0IGEgY29udGV4dCBrZXkgd2FzIGV4cGVjdGVkXG4gICAqXG4gICAqIENvbnRhaW5zIGluc3RydWN0aW9ucyB3aGljaCB3aWxsIGJlIGVtaXR0ZWQgaW50byB0aGUgY2xvdWQgYXNzZW1ibHkgb24gaG93XG4gICAqIHRoZSBrZXkgc2hvdWxkIGJlIHN1cHBsaWVkLlxuICAgKlxuICAgKiBAcGFyYW0gcmVwb3J0IFRoZSBzZXQgb2YgcGFyYW1ldGVycyBuZWVkZWQgdG8gb2J0YWluIHRoZSBjb250ZXh0XG4gICAqL1xuICBwdWJsaWMgcmVwb3J0TWlzc2luZ0NvbnRleHRLZXkocmVwb3J0OiBjeHNjaGVtYS5NaXNzaW5nQ29udGV4dCkge1xuICAgIHRoaXMuX21pc3NpbmdDb250ZXh0LnB1c2gocmVwb3J0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5hbWUgYSBnZW5lcmF0ZWQgbG9naWNhbCBpZGVudGl0aWVzXG4gICAqXG4gICAqIFRvIG1vZGlmeSB0aGUgbmFtaW5nIHNjaGVtZSBzdHJhdGVneSwgZXh0ZW5kIHRoZSBgU3RhY2tgIGNsYXNzIGFuZFxuICAgKiBvdmVycmlkZSB0aGUgYGFsbG9jYXRlTG9naWNhbElkYCBtZXRob2QuXG4gICAqL1xuICBwdWJsaWMgcmVuYW1lTG9naWNhbElkKG9sZElkOiBzdHJpbmcsIG5ld0lkOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9sb2dpY2FsSWRzLmFkZFJlbmFtZShvbGRJZCwgbmV3SWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG9jYXRlcyBhIHN0YWNrLXVuaXF1ZSBDbG91ZEZvcm1hdGlvbi1jb21wYXRpYmxlIGxvZ2ljYWwgaWRlbnRpdHkgZm9yIGFcbiAgICogc3BlY2lmaWMgcmVzb3VyY2UuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCB3aGVuIGEgYENmbkVsZW1lbnRgIGlzIGNyZWF0ZWQgYW5kIHVzZWQgdG8gcmVuZGVyIHRoZVxuICAgKiBpbml0aWFsIGxvZ2ljYWwgaWRlbnRpdHkgb2YgcmVzb3VyY2VzLiBMb2dpY2FsIElEIHJlbmFtZXMgYXJlIGFwcGxpZWQgYXRcbiAgICogdGhpcyBzdGFnZS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgdXNlcyB0aGUgcHJvdGVjdGVkIG1ldGhvZCBgYWxsb2NhdGVMb2dpY2FsSWRgIHRvIHJlbmRlciB0aGVcbiAgICogbG9naWNhbCBJRCBmb3IgYW4gZWxlbWVudC4gVG8gbW9kaWZ5IHRoZSBuYW1pbmcgc2NoZW1lLCBleHRlbmQgdGhlIGBTdGFja2BcbiAgICogY2xhc3MgYW5kIG92ZXJyaWRlIHRoaXMgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0gZWxlbWVudCBUaGUgQ2xvdWRGb3JtYXRpb24gZWxlbWVudCBmb3Igd2hpY2ggYSBsb2dpY2FsIGlkZW50aXR5IGlzXG4gICAqIG5lZWRlZC5cbiAgICovXG4gIHB1YmxpYyBnZXRMb2dpY2FsSWQoZWxlbWVudDogQ2ZuRWxlbWVudCk6IHN0cmluZyB7XG4gICAgY29uc3QgbG9naWNhbElkID0gdGhpcy5hbGxvY2F0ZUxvZ2ljYWxJZChlbGVtZW50KTtcbiAgICByZXR1cm4gdGhpcy5fbG9naWNhbElkcy5hcHBseVJlbmFtZShsb2dpY2FsSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGRlcGVuZGVuY3kgYmV0d2VlbiB0aGlzIHN0YWNrIGFuZCBhbm90aGVyIHN0YWNrLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGRlZmluZSBkZXBlbmRlbmNpZXMgYmV0d2VlbiBhbnkgdHdvIHN0YWNrcyB3aXRoaW4gYW5cbiAgICogYXBwLCBhbmQgYWxzbyBzdXBwb3J0cyBuZXN0ZWQgc3RhY2tzLlxuICAgKi9cbiAgcHVibGljIGFkZERlcGVuZGVuY3kodGFyZ2V0OiBTdGFjaywgcmVhc29uPzogc3RyaW5nKSB7XG4gICAgYWRkRGVwZW5kZW5jeSh0aGlzLCB0YXJnZXQsIHJlYXNvbiA/PyBgeyR7dGhpcy5ub2RlLnBhdGh9fS5hZGREZXBlbmRlbmN5KHske3RhcmdldC5ub2RlLnBhdGh9fSlgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHN0YWNrcyB0aGlzIHN0YWNrIGRlcGVuZHMgb25cbiAgICovXG4gIHB1YmxpYyBnZXQgZGVwZW5kZW5jaWVzKCk6IFN0YWNrW10ge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuX3N0YWNrRGVwZW5kZW5jaWVzKS5tYXAoeCA9PiB4LnN0YWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY29uY3JldGUgQ2xvdWRGb3JtYXRpb24gcGh5c2ljYWwgc3RhY2sgbmFtZS5cbiAgICpcbiAgICogVGhpcyBpcyBlaXRoZXIgdGhlIG5hbWUgZGVmaW5lZCBleHBsaWNpdGx5IGluIHRoZSBgc3RhY2tOYW1lYCBwcm9wIG9yXG4gICAqIGFsbG9jYXRlZCBiYXNlZCBvbiB0aGUgc3RhY2sncyBsb2NhdGlvbiBpbiB0aGUgY29uc3RydWN0IHRyZWUuIFN0YWNrcyB0aGF0XG4gICAqIGFyZSBkaXJlY3RseSBkZWZpbmVkIHVuZGVyIHRoZSBhcHAgdXNlIHRoZWlyIGNvbnN0cnVjdCBgaWRgIGFzIHRoZWlyIHN0YWNrXG4gICAqIG5hbWUuIFN0YWNrcyB0aGF0IGFyZSBkZWZpbmVkIGRlZXBlciB3aXRoaW4gdGhlIHRyZWUgd2lsbCB1c2UgYSBoYXNoZWQgbmFtaW5nXG4gICAqIHNjaGVtZSBiYXNlZCBvbiB0aGUgY29uc3RydWN0IHBhdGggdG8gZW5zdXJlIHVuaXF1ZW5lc3MuXG4gICAqXG4gICAqIElmIHlvdSB3aXNoIHRvIG9idGFpbiB0aGUgZGVwbG95LXRpbWUgQVdTOjpTdGFja05hbWUgaW50cmluc2ljLFxuICAgKiB5b3UgY2FuIHVzZSBgQXdzLlNUQUNLX05BTUVgIGRpcmVjdGx5LlxuICAgKi9cbiAgcHVibGljIGdldCBzdGFja05hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhY2tOYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwYXJ0aXRpb24gaW4gd2hpY2ggdGhpcyBzdGFjayBpcyBkZWZpbmVkXG4gICAqL1xuICBwdWJsaWMgZ2V0IHBhcnRpdGlvbigpOiBzdHJpbmcge1xuICAgIC8vIFJldHVybiBhIG5vbi1zY29wZWQgcGFydGl0aW9uIGludHJpbnNpYyB3aGVuIHRoZSBzdGFjaydzIHJlZ2lvbiBpc1xuICAgIC8vIHVucmVzb2x2ZWQgb3IgdW5rbm93bi4gIE90aGVyd2lzZSB3ZSB3aWxsIHJldHVybiB0aGUgcGFydGl0aW9uIG5hbWUgYXNcbiAgICAvLyBhIGxpdGVyYWwgc3RyaW5nLlxuICAgIGlmICghRmVhdHVyZUZsYWdzLm9mKHRoaXMpLmlzRW5hYmxlZChjeGFwaS5FTkFCTEVfUEFSVElUSU9OX0xJVEVSQUxTKSB8fCBUb2tlbi5pc1VucmVzb2x2ZWQodGhpcy5yZWdpb24pKSB7XG4gICAgICByZXR1cm4gQXdzLlBBUlRJVElPTjtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcGFydGl0aW9uID0gUmVnaW9uSW5mby5nZXQodGhpcy5yZWdpb24pLnBhcnRpdGlvbjtcbiAgICAgIHJldHVybiBwYXJ0aXRpb24gPz8gQXdzLlBBUlRJVElPTjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBkb21haW4gc3VmZml4IGZvciB0aGUgcmVnaW9uIGluIHdoaWNoIHRoaXMgc3RhY2sgaXMgZGVmaW5lZFxuICAgKi9cbiAgcHVibGljIGdldCB1cmxTdWZmaXgoKTogc3RyaW5nIHtcbiAgICAvLyBTaW5jZSBVUkwgU3VmZml4IGFsd2F5cyBmb2xsb3dzIHBhcnRpdGlvbiwgaXQgaXMgdW5zY29wZWQgbGlrZSBwYXJ0aXRpb24gaXMuXG4gICAgcmV0dXJuIEF3cy5VUkxfU1VGRklYO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgc3RhY2tcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gQWZ0ZXIgcmVzb2x2aW5nLCBsb29rcyBsaWtlXG4gICAqICdhcm46YXdzOmNsb3VkZm9ybWF0aW9uOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6c3RhY2svdGVzdHN0YWNrLzUxYWYzZGMwLWRhNzctMTFlNC04NzJlLTEyMzQ1NjdkYjEyMydcbiAgICovXG4gIHB1YmxpYyBnZXQgc3RhY2tJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgU2NvcGVkQXdzKHRoaXMpLnN0YWNrSWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbGlzdCBvZiBub3RpZmljYXRpb24gQW1hem9uIFJlc291cmNlIE5hbWVzIChBUk5zKSBmb3IgdGhlIGN1cnJlbnQgc3RhY2suXG4gICAqL1xuICBwdWJsaWMgZ2V0IG5vdGlmaWNhdGlvbkFybnMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBuZXcgU2NvcGVkQXdzKHRoaXMpLm5vdGlmaWNhdGlvbkFybnM7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoaXMgaXMgYSBuZXN0ZWQgc3RhY2ssIGluIHdoaWNoIGNhc2UgYHBhcmVudFN0YWNrYCB3aWxsIGluY2x1ZGUgYSByZWZlcmVuY2UgdG8gaXQncyBwYXJlbnQuXG4gICAqL1xuICBwdWJsaWMgZ2V0IG5lc3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uZXN0ZWRTdGFja1Jlc291cmNlICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBBUk4gZnJvbSBjb21wb25lbnRzLlxuICAgKlxuICAgKiBJZiBgcGFydGl0aW9uYCwgYHJlZ2lvbmAgb3IgYGFjY291bnRgIGFyZSBub3Qgc3BlY2lmaWVkLCB0aGUgc3RhY2snc1xuICAgKiBwYXJ0aXRpb24sIHJlZ2lvbiBhbmQgYWNjb3VudCB3aWxsIGJlIHVzZWQuXG4gICAqXG4gICAqIElmIGFueSBjb21wb25lbnQgaXMgdGhlIGVtcHR5IHN0cmluZywgYW4gZW1wdHkgc3RyaW5nIHdpbGwgYmUgaW5zZXJ0ZWRcbiAgICogaW50byB0aGUgZ2VuZXJhdGVkIEFSTiBhdCB0aGUgbG9jYXRpb24gdGhhdCBjb21wb25lbnQgY29ycmVzcG9uZHMgdG8uXG4gICAqXG4gICAqIFRoZSBBUk4gd2lsbCBiZSBmb3JtYXR0ZWQgYXMgZm9sbG93czpcbiAgICpcbiAgICogICBhcm46e3BhcnRpdGlvbn06e3NlcnZpY2V9OntyZWdpb259OnthY2NvdW50fTp7cmVzb3VyY2V9e3NlcH17cmVzb3VyY2UtbmFtZX1cbiAgICpcbiAgICogVGhlIHJlcXVpcmVkIEFSTiBwaWVjZXMgdGhhdCBhcmUgb21pdHRlZCB3aWxsIGJlIHRha2VuIGZyb20gdGhlIHN0YWNrIHRoYXRcbiAgICogdGhlICdzY29wZScgaXMgYXR0YWNoZWQgdG8uIElmIGFsbCBBUk4gcGllY2VzIGFyZSBzdXBwbGllZCwgdGhlIHN1cHBsaWVkIHNjb3BlXG4gICAqIGNhbiBiZSAndW5kZWZpbmVkJy5cbiAgICovXG4gIHB1YmxpYyBmb3JtYXRBcm4oY29tcG9uZW50czogQXJuQ29tcG9uZW50cyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEFybi5mb3JtYXQoY29tcG9uZW50cywgdGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gYW4gQVJOLCBwYXJzZXMgaXQgYW5kIHJldHVybnMgY29tcG9uZW50cy5cbiAgICpcbiAgICogSUYgVEhFIEFSTiBJUyBBIENPTkNSRVRFIFNUUklORy4uLlxuICAgKlxuICAgKiAuLi5pdCB3aWxsIGJlIHBhcnNlZCBhbmQgdmFsaWRhdGVkLiBUaGUgc2VwYXJhdG9yIChgc2VwYCkgd2lsbCBiZSBzZXQgdG8gJy8nXG4gICAqIGlmIHRoZSA2dGggY29tcG9uZW50IGluY2x1ZGVzIGEgJy8nLCBpbiB3aGljaCBjYXNlLCBgcmVzb3VyY2VgIHdpbGwgYmUgc2V0XG4gICAqIHRvIHRoZSB2YWx1ZSBiZWZvcmUgdGhlICcvJyBhbmQgYHJlc291cmNlTmFtZWAgd2lsbCBiZSB0aGUgcmVzdC4gSW4gY2FzZVxuICAgKiB0aGVyZSBpcyBubyAnLycsIGByZXNvdXJjZWAgd2lsbCBiZSBzZXQgdG8gdGhlIDZ0aCBjb21wb25lbnRzIGFuZFxuICAgKiBgcmVzb3VyY2VOYW1lYCB3aWxsIGJlIHNldCB0byB0aGUgcmVzdCBvZiB0aGUgc3RyaW5nLlxuICAgKlxuICAgKiBJRiBUSEUgQVJOIElTIEEgVE9LRU4uLi5cbiAgICpcbiAgICogLi4uaXQgY2Fubm90IGJlIHZhbGlkYXRlZCwgc2luY2Ugd2UgZG9uJ3QgaGF2ZSB0aGUgYWN0dWFsIHZhbHVlIHlldCBhdCB0aGVcbiAgICogdGltZSBvZiB0aGlzIGZ1bmN0aW9uIGNhbGwuIFlvdSB3aWxsIGhhdmUgdG8gc3VwcGx5IGBzZXBJZlRva2VuYCBhbmRcbiAgICogd2hldGhlciBvciBub3QgQVJOcyBvZiB0aGUgZXhwZWN0ZWQgZm9ybWF0IHVzdWFsbHkgaGF2ZSByZXNvdXJjZSBuYW1lc1xuICAgKiBpbiBvcmRlciB0byBwYXJzZSBpdCBwcm9wZXJseS4gVGhlIHJlc3VsdGluZyBgQXJuQ29tcG9uZW50c2Agb2JqZWN0IHdpbGxcbiAgICogY29udGFpbiB0b2tlbnMgZm9yIHRoZSBzdWJleHByZXNzaW9ucyBvZiB0aGUgQVJOLCBub3Qgc3RyaW5nIGxpdGVyYWxzLlxuICAgKlxuICAgKiBJZiB0aGUgcmVzb3VyY2UgbmFtZSBjb3VsZCBwb3NzaWJseSBjb250YWluIHRoZSBzZXBhcmF0b3IgY2hhciwgdGhlIGFjdHVhbFxuICAgKiByZXNvdXJjZSBuYW1lIGNhbm5vdCBiZSBwcm9wZXJseSBwYXJzZWQuIFRoaXMgb25seSBvY2N1cnMgaWYgdGhlIHNlcGFyYXRvclxuICAgKiBjaGFyIGlzICcvJywgYW5kIGhhcHBlbnMgZm9yIGV4YW1wbGUgZm9yIFMzIG9iamVjdCBBUk5zLCBJQU0gUm9sZSBBUk5zLFxuICAgKiBJQU0gT0lEQyBQcm92aWRlciBBUk5zLCBldGMuIFRvIHByb3Blcmx5IGV4dHJhY3QgdGhlIHJlc291cmNlIG5hbWUgZnJvbSBhXG4gICAqIFRva2VuaXplZCBBUk4sIHlvdSBtdXN0IGtub3cgdGhlIHJlc291cmNlIHR5cGUgYW5kIGNhbGxcbiAgICogYEFybi5leHRyYWN0UmVzb3VyY2VOYW1lYC5cbiAgICpcbiAgICogQHBhcmFtIGFybiBUaGUgQVJOIHN0cmluZyB0byBwYXJzZVxuICAgKiBAcGFyYW0gc2VwSWZUb2tlbiBUaGUgc2VwYXJhdG9yIHVzZWQgdG8gc2VwYXJhdGUgcmVzb3VyY2UgZnJvbSByZXNvdXJjZU5hbWVcbiAgICogQHBhcmFtIGhhc05hbWUgV2hldGhlciB0aGVyZSBpcyBhIG5hbWUgY29tcG9uZW50IGluIHRoZSBBUk4gYXQgYWxsLiBGb3JcbiAgICogZXhhbXBsZSwgU05TIFRvcGljcyBBUk5zIGhhdmUgdGhlICdyZXNvdXJjZScgY29tcG9uZW50IGNvbnRhaW4gdGhlIHRvcGljXG4gICAqIG5hbWUsIGFuZCBubyAncmVzb3VyY2VOYW1lJyBjb21wb25lbnQuXG4gICAqXG4gICAqIEByZXR1cm5zIGFuIEFybkNvbXBvbmVudHMgb2JqZWN0IHdoaWNoIGFsbG93cyBhY2Nlc3MgdG8gdGhlIHZhcmlvdXNcbiAgICogY29tcG9uZW50cyBvZiB0aGUgQVJOLlxuICAgKlxuICAgKiBAcmV0dXJucyBhbiBBcm5Db21wb25lbnRzIG9iamVjdCB3aGljaCBhbGxvd3MgYWNjZXNzIHRvIHRoZSB2YXJpb3VzXG4gICAqICAgICAgY29tcG9uZW50cyBvZiB0aGUgQVJOLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCB1c2Ugc3BsaXRBcm4gaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIHBhcnNlQXJuKGFybjogc3RyaW5nLCBzZXBJZlRva2VuOiBzdHJpbmcgPSAnLycsIGhhc05hbWU6IGJvb2xlYW4gPSB0cnVlKTogQXJuQ29tcG9uZW50cyB7XG4gICAgcmV0dXJuIEFybi5wYXJzZShhcm4sIHNlcElmVG9rZW4sIGhhc05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNwbGl0cyB0aGUgcHJvdmlkZWQgQVJOIGludG8gaXRzIGNvbXBvbmVudHMuXG4gICAqIFdvcmtzIGJvdGggaWYgJ2FybicgaXMgYSBzdHJpbmcgbGlrZSAnYXJuOmF3czpzMzo6OmJ1Y2tldCcsXG4gICAqIGFuZCBhIFRva2VuIHJlcHJlc2VudGluZyBhIGR5bmFtaWMgQ2xvdWRGb3JtYXRpb24gZXhwcmVzc2lvblxuICAgKiAoaW4gd2hpY2ggY2FzZSB0aGUgcmV0dXJuZWQgY29tcG9uZW50cyB3aWxsIGFsc28gYmUgZHluYW1pYyBDbG91ZEZvcm1hdGlvbiBleHByZXNzaW9ucyxcbiAgICogZW5jb2RlZCBhcyBUb2tlbnMpLlxuICAgKlxuICAgKiBAcGFyYW0gYXJuIHRoZSBBUk4gdG8gc3BsaXQgaW50byBpdHMgY29tcG9uZW50c1xuICAgKiBAcGFyYW0gYXJuRm9ybWF0IHRoZSBleHBlY3RlZCBmb3JtYXQgb2YgJ2FybicgLSBkZXBlbmRzIG9uIHdoYXQgZm9ybWF0IHRoZSBzZXJ2aWNlICdhcm4nIHJlcHJlc2VudHMgdXNlc1xuICAgKi9cbiAgcHVibGljIHNwbGl0QXJuKGFybjogc3RyaW5nLCBhcm5Gb3JtYXQ6IEFybkZvcm1hdCk6IEFybkNvbXBvbmVudHMge1xuICAgIHJldHVybiBBcm4uc3BsaXQoYXJuLCBhcm5Gb3JtYXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxpc3Qgb2YgQVpzIHRoYXQgYXJlIGF2YWlsYWJsZSBpbiB0aGUgQVdTIGVudmlyb25tZW50XG4gICAqIChhY2NvdW50L3JlZ2lvbikgYXNzb2NpYXRlZCB3aXRoIHRoaXMgc3RhY2suXG4gICAqXG4gICAqIElmIHRoZSBzdGFjayBpcyBlbnZpcm9ubWVudC1hZ25vc3RpYyAoZWl0aGVyIGFjY291bnQgYW5kL29yIHJlZ2lvbiBhcmVcbiAgICogdG9rZW5zKSwgdGhpcyBwcm9wZXJ0eSB3aWxsIHJldHVybiBhbiBhcnJheSB3aXRoIDIgdG9rZW5zIHRoYXQgd2lsbCByZXNvbHZlXG4gICAqIGF0IGRlcGxveS10aW1lIHRvIHRoZSBmaXJzdCB0d28gYXZhaWxhYmlsaXR5IHpvbmVzIHJldHVybmVkIGZyb20gQ2xvdWRGb3JtYXRpb24nc1xuICAgKiBgRm46OkdldEFac2AgaW50cmluc2ljIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBJZiB0aGV5IGFyZSBub3QgYXZhaWxhYmxlIGluIHRoZSBjb250ZXh0LCByZXR1cm5zIGEgc2V0IG9mIGR1bW15IHZhbHVlcyBhbmRcbiAgICogcmVwb3J0cyB0aGVtIGFzIG1pc3NpbmcsIGFuZCBsZXQgdGhlIENMSSByZXNvbHZlIHRoZW0gYnkgY2FsbGluZyBFQzJcbiAgICogYERlc2NyaWJlQXZhaWxhYmlsaXR5Wm9uZXNgIG9uIHRoZSB0YXJnZXQgZW52aXJvbm1lbnQuXG4gICAqXG4gICAqIFRvIHNwZWNpZnkgYSBkaWZmZXJlbnQgc3RyYXRlZ3kgZm9yIHNlbGVjdGluZyBhdmFpbGFiaWxpdHkgem9uZXMgb3ZlcnJpZGUgdGhpcyBtZXRob2QuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGF2YWlsYWJpbGl0eVpvbmVzKCk6IHN0cmluZ1tdIHtcbiAgICAvLyBpZiBhY2NvdW50L3JlZ2lvbiBhcmUgdG9rZW5zLCB3ZSBjYW4ndCBvYnRhaW4gQVpzIHRocm91Z2ggdGhlIGNvbnRleHRcbiAgICAvLyBwcm92aWRlciwgc28gd2UgZmFsbGJhY2sgdG8gdXNlIEZuOjpHZXRBWnMuIHRoZSBjdXJyZW50IGxvd2VzdCBjb21tb25cbiAgICAvLyBkZW5vbWluYXRvciBpcyAyIEFacyBhY3Jvc3MgYWxsIEFXUyByZWdpb25zLlxuICAgIGNvbnN0IGFnbm9zdGljID0gVG9rZW4uaXNVbnJlc29sdmVkKHRoaXMuYWNjb3VudCkgfHwgVG9rZW4uaXNVbnJlc29sdmVkKHRoaXMucmVnaW9uKTtcbiAgICBpZiAoYWdub3N0aWMpIHtcbiAgICAgIHJldHVybiB0aGlzLm5vZGUudHJ5R2V0Q29udGV4dChjeGFwaS5BVkFJTEFCSUxJVFlfWk9ORV9GQUxMQkFDS19DT05URVhUX0tFWSkgfHwgW1xuICAgICAgICBGbi5zZWxlY3QoMCwgRm4uZ2V0QXpzKCkpLFxuICAgICAgICBGbi5zZWxlY3QoMSwgRm4uZ2V0QXpzKCkpLFxuICAgICAgXTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IENvbnRleHRQcm92aWRlci5nZXRWYWx1ZSh0aGlzLCB7XG4gICAgICBwcm92aWRlcjogY3hzY2hlbWEuQ29udGV4dFByb3ZpZGVyLkFWQUlMQUJJTElUWV9aT05FX1BST1ZJREVSLFxuICAgICAgZHVtbXlWYWx1ZTogWydkdW1teTFhJywgJ2R1bW15MWInLCAnZHVtbXkxYyddLFxuICAgIH0pLnZhbHVlO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQcm92aWRlciAke2N4c2NoZW1hLkNvbnRleHRQcm92aWRlci5BVkFJTEFCSUxJVFlfWk9ORV9QUk9WSURFUn0gZXhwZWN0cyBhIGxpc3RgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBmaWxlIGFzc2V0IG9uIHRoaXMgU3RhY2tcbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBzdGFjay5zeW50aGVzaXplci5hZGRGaWxlQXNzZXQoKWAgaWYgeW91IGFyZSBjYWxsaW5nLFxuICAgKiBhbmQgYSBkaWZmZXJlbnQgSVN0YWNrU3ludGhlc2l6ZXIgY2xhc3MgaWYgeW91IGFyZSBpbXBsZW1lbnRpbmcuXG4gICAqL1xuICBwdWJsaWMgYWRkRmlsZUFzc2V0KGFzc2V0OiBGaWxlQXNzZXRTb3VyY2UpOiBGaWxlQXNzZXRMb2NhdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuc3ludGhlc2l6ZXIuYWRkRmlsZUFzc2V0KGFzc2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGRvY2tlciBpbWFnZSBhc3NldCBvbiB0aGlzIFN0YWNrXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgc3RhY2suc3ludGhlc2l6ZXIuYWRkRG9ja2VySW1hZ2VBc3NldCgpYCBpZiB5b3UgYXJlIGNhbGxpbmcsXG4gICAqIGFuZCBhIGRpZmZlcmVudCBgSVN0YWNrU3ludGhlc2l6ZXJgIGNsYXNzIGlmIHlvdSBhcmUgaW1wbGVtZW50aW5nLlxuICAgKi9cbiAgcHVibGljIGFkZERvY2tlckltYWdlQXNzZXQoYXNzZXQ6IERvY2tlckltYWdlQXNzZXRTb3VyY2UpOiBEb2NrZXJJbWFnZUFzc2V0TG9jYXRpb24ge1xuICAgIHJldHVybiB0aGlzLnN5bnRoZXNpemVyLmFkZERvY2tlckltYWdlQXNzZXQoYXNzZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoaXMgaXMgYSBuZXN0ZWQgc3RhY2ssIHJldHVybnMgaXQncyBwYXJlbnQgc3RhY2suXG4gICAqL1xuICBwdWJsaWMgZ2V0IG5lc3RlZFN0YWNrUGFyZW50KCkge1xuICAgIHJldHVybiB0aGlzLm5lc3RlZFN0YWNrUmVzb3VyY2UgJiYgU3RhY2sub2YodGhpcy5uZXN0ZWRTdGFja1Jlc291cmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBwYXJlbnQgb2YgYSBuZXN0ZWQgc3RhY2suXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgbmVzdGVkU3RhY2tQYXJlbnRgXG4gICAqL1xuICBwdWJsaWMgZ2V0IHBhcmVudFN0YWNrKCkge1xuICAgIHJldHVybiB0aGlzLm5lc3RlZFN0YWNrUGFyZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIFRyYW5zZm9ybSB0byB0aGlzIHN0YWNrLiBBIFRyYW5zZm9ybSBpcyBhIG1hY3JvIHRoYXQgQVdTXG4gICAqIENsb3VkRm9ybWF0aW9uIHVzZXMgdG8gcHJvY2VzcyB5b3VyIHRlbXBsYXRlLlxuICAgKlxuICAgKiBEdXBsaWNhdGUgdmFsdWVzIGFyZSByZW1vdmVkIHdoZW4gc3RhY2sgaXMgc3ludGhlc2l6ZWQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvdHJhbnNmb3JtLXNlY3Rpb24tc3RydWN0dXJlLmh0bWxcbiAgICogQHBhcmFtIHRyYW5zZm9ybSBUaGUgdHJhbnNmb3JtIHRvIGFkZFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBkZWNsYXJlIGNvbnN0IHN0YWNrOiBTdGFjaztcbiAgICpcbiAgICogc3RhY2suYWRkVHJhbnNmb3JtKCdBV1M6OlNlcnZlcmxlc3MtMjAxNi0xMC0zMScpXG4gICAqL1xuICBwdWJsaWMgYWRkVHJhbnNmb3JtKHRyYW5zZm9ybTogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm1zKSB7XG4gICAgICB0aGlzLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm1zID0gW107XG4gICAgfVxuICAgIHRoaXMudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybXMucHVzaCh0cmFuc2Zvcm0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gYXJiaXRhcnkga2V5LXZhbHVlIHBhaXIsIHdpdGggaW5mb3JtYXRpb24geW91IHdhbnQgdG8gcmVjb3JkIGFib3V0IHRoZSBzdGFjay5cbiAgICogVGhlc2UgZ2V0IHRyYW5zbGF0ZWQgdG8gdGhlIE1ldGFkYXRhIHNlY3Rpb24gb2YgdGhlIGdlbmVyYXRlZCB0ZW1wbGF0ZS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9tZXRhZGF0YS1zZWN0aW9uLXN0cnVjdHVyZS5odG1sXG4gICAqL1xuICBwdWJsaWMgYWRkTWV0YWRhdGEoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICBpZiAoIXRoaXMudGVtcGxhdGVPcHRpb25zLm1ldGFkYXRhKSB7XG4gICAgICB0aGlzLnRlbXBsYXRlT3B0aW9ucy5tZXRhZGF0YSA9IHt9O1xuICAgIH1cbiAgICB0aGlzLnRlbXBsYXRlT3B0aW9ucy5tZXRhZGF0YVtrZXldID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIGltcGxpY2l0bHkgYnkgdGhlIGBhZGREZXBlbmRlbmN5YCBoZWxwZXIgZnVuY3Rpb24gaW4gb3JkZXIgdG9cbiAgICogcmVhbGl6ZSBhIGRlcGVuZGVuY3kgYmV0d2VlbiB0d28gdG9wLWxldmVsIHN0YWNrcyBhdCB0aGUgYXNzZW1ibHkgbGV2ZWwuXG4gICAqXG4gICAqIFVzZSBgc3RhY2suYWRkRGVwZW5kZW5jeWAgdG8gZGVmaW5lIHRoZSBkZXBlbmRlbmN5IGJldHdlZW4gYW55IHR3byBzdGFja3MsXG4gICAqIGFuZCB0YWtlIGludG8gYWNjb3VudCBuZXN0ZWQgc3RhY2sgcmVsYXRpb25zaGlwcy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX2FkZEFzc2VtYmx5RGVwZW5kZW5jeSh0YXJnZXQ6IFN0YWNrLCByZWFzb246IFN0YWNrRGVwZW5kZW5jeVJlYXNvbiA9IHt9KSB7XG4gICAgLy8gZGVmZW5zaXZlOiB3ZSBzaG91bGQgbmV2ZXIgZ2V0IGhlcmUgZm9yIG5lc3RlZCBzdGFja3NcbiAgICBpZiAodGhpcy5uZXN0ZWQgfHwgdGFyZ2V0Lm5lc3RlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWRkIGFzc2VtYmx5LWxldmVsIGRlcGVuZGVuY2llcyBmb3IgbmVzdGVkIHN0YWNrcycpO1xuICAgIH1cbiAgICAvLyBGaWxsIGluIHJlYXNvbiBkZXRhaWxzIGlmIG5vdCBwcm92aWRlZFxuICAgIGlmICghcmVhc29uLnNvdXJjZSkge1xuICAgICAgcmVhc29uLnNvdXJjZSA9IHRoaXM7XG4gICAgfVxuICAgIGlmICghcmVhc29uLnRhcmdldCkge1xuICAgICAgcmVhc29uLnRhcmdldCA9IHRhcmdldDtcbiAgICB9XG4gICAgaWYgKCFyZWFzb24uZGVzY3JpcHRpb24pIHtcbiAgICAgIHJlYXNvbi5kZXNjcmlwdGlvbiA9ICdubyBkZXNjcmlwdGlvbiBwcm92aWRlZCc7XG4gICAgfVxuXG4gICAgY29uc3QgY3ljbGUgPSB0YXJnZXQuc3RhY2tEZXBlbmRlbmN5UmVhc29ucyh0aGlzKTtcbiAgICBpZiAoY3ljbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgY3ljbGVEZXNjcmlwdGlvbiA9IGN5Y2xlLm1hcCgoY3ljbGVSZWFzb24pID0+IHtcbiAgICAgICAgcmV0dXJuIGN5Y2xlUmVhc29uLmRlc2NyaXB0aW9uO1xuICAgICAgfSkuam9pbignLCAnKTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCcke3RhcmdldC5ub2RlLnBhdGh9JyBkZXBlbmRzIG9uICcke3RoaXMubm9kZS5wYXRofScgKCR7Y3ljbGVEZXNjcmlwdGlvbn0pLiBBZGRpbmcgdGhpcyBkZXBlbmRlbmN5ICgke3JlYXNvbi5kZXNjcmlwdGlvbn0pIHdvdWxkIGNyZWF0ZSBhIGN5Y2xpYyByZWZlcmVuY2UuYCk7XG4gICAgfVxuXG4gICAgbGV0IGRlcCA9IHRoaXMuX3N0YWNrRGVwZW5kZW5jaWVzW05hbWVzLnVuaXF1ZUlkKHRhcmdldCldO1xuICAgIGlmICghZGVwKSB7XG4gICAgICBkZXAgPSB0aGlzLl9zdGFja0RlcGVuZGVuY2llc1tOYW1lcy51bmlxdWVJZCh0YXJnZXQpXSA9IHsgc3RhY2s6IHRhcmdldCwgcmVhc29uczogW10gfTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgZm9yIGEgZHVwbGljYXRlIHJlYXNvbiBhbHJlYWR5IGV4aXN0aW5nXG4gICAgbGV0IGV4aXN0aW5nUmVhc29uczogU2V0PFN0YWNrRGVwZW5kZW5jeVJlYXNvbj4gPSBuZXcgU2V0KCk7XG4gICAgZGVwLnJlYXNvbnMuZm9yRWFjaCgoZXhpc3RpbmdSZWFzb24pID0+IHtcbiAgICAgIGlmIChleGlzdGluZ1JlYXNvbi5zb3VyY2UgPT0gcmVhc29uLnNvdXJjZSAmJiBleGlzdGluZ1JlYXNvbi50YXJnZXQgPT0gcmVhc29uLnRhcmdldCkge1xuICAgICAgICBleGlzdGluZ1JlYXNvbnMuYWRkKGV4aXN0aW5nUmVhc29uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoZXhpc3RpbmdSZWFzb25zLnNpemUgPiAwKSB7XG4gICAgICAvLyBEZXBlbmRlbmN5IGFscmVhZHkgZXhpc3RzIGFuZCBmb3IgdGhlIHByb3ZpZGVkIHJlYXNvblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkZXAucmVhc29ucy5wdXNoKHJlYXNvbik7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuQ0RLX0RFQlVHX0RFUFMpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmVycm9yKGBbQ0RLX0RFQlVHX0RFUFNdIHN0YWNrIFwiJHtyZWFzb24uc291cmNlLm5vZGUucGF0aH1cIiBkZXBlbmRzIG9uIFwiJHtyZWFzb24udGFyZ2V0Lm5vZGUucGF0aH1cImApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgaW1wbGljaXRseSBieSB0aGUgYG9idGFpbkRlcGVuZGVuY2llc2AgaGVscGVyIGZ1bmN0aW9uIGluIG9yZGVyIHRvXG4gICAqIGNvbGxlY3QgcmVzb3VyY2UgZGVwZW5kZW5jaWVzIGFjcm9zcyB0d28gdG9wLWxldmVsIHN0YWNrcyBhdCB0aGUgYXNzZW1ibHkgbGV2ZWwuXG4gICAqXG4gICAqIFVzZSBgc3RhY2sub2J0YWluRGVwZW5kZW5jaWVzYCB0byBzZWUgdGhlIGRlcGVuZGVuY2llcyBiZXR3ZWVuIGFueSB0d28gc3RhY2tzLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfb2J0YWluQXNzZW1ibHlEZXBlbmRlbmNpZXMocmVhc29uRmlsdGVyOiBTdGFja0RlcGVuZGVuY3lSZWFzb24pOiBFbGVtZW50W10ge1xuICAgIGlmICghcmVhc29uRmlsdGVyLnNvdXJjZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZWFzb25GaWx0ZXIuc291cmNlIG11c3QgYmUgZGVmaW5lZCEnKTtcbiAgICB9XG4gICAgLy8gQXNzdW1lIHJlYXNvbkZpbHRlciBoYXMgb25seSBzb3VyY2UgZGVmaW5lZFxuICAgIGxldCBkZXBlbmRlbmNpZXM6IFNldDxFbGVtZW50PiA9IG5ldyBTZXQoKTtcbiAgICBPYmplY3QudmFsdWVzKHRoaXMuX3N0YWNrRGVwZW5kZW5jaWVzKS5mb3JFYWNoKChkZXApID0+IHtcbiAgICAgIGRlcC5yZWFzb25zLmZvckVhY2goKHJlYXNvbikgPT4ge1xuICAgICAgICBpZiAocmVhc29uRmlsdGVyLnNvdXJjZSA9PSByZWFzb24uc291cmNlKSB7XG4gICAgICAgICAgaWYgKCFyZWFzb24udGFyZ2V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGFuIGludmFsaWQgZGVwZW5kZW5jeSB0YXJnZXQgZnJvbSBzb3VyY2UgJyR7cmVhc29uRmlsdGVyLnNvdXJjZSEubm9kZS5wYXRofSdgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVwZW5kZW5jaWVzLmFkZChyZWFzb24udGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oZGVwZW5kZW5jaWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgaW1wbGljaXRseSBieSB0aGUgYHJlbW92ZURlcGVuZGVuY3lgIGhlbHBlciBmdW5jdGlvbiBpbiBvcmRlciB0b1xuICAgKiByZW1vdmUgYSBkZXBlbmRlbmN5IGJldHdlZW4gdHdvIHRvcC1sZXZlbCBzdGFja3MgYXQgdGhlIGFzc2VtYmx5IGxldmVsLlxuICAgKlxuICAgKiBVc2UgYHN0YWNrLmFkZERlcGVuZGVuY3lgIHRvIGRlZmluZSB0aGUgZGVwZW5kZW5jeSBiZXR3ZWVuIGFueSB0d28gc3RhY2tzLFxuICAgKiBhbmQgdGFrZSBpbnRvIGFjY291bnQgbmVzdGVkIHN0YWNrIHJlbGF0aW9uc2hpcHMuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9yZW1vdmVBc3NlbWJseURlcGVuZGVuY3kodGFyZ2V0OiBTdGFjaywgcmVhc29uRmlsdGVyOiBTdGFja0RlcGVuZGVuY3lSZWFzb249e30pIHtcbiAgICAvLyBkZWZlbnNpdmU6IHdlIHNob3VsZCBuZXZlciBnZXQgaGVyZSBmb3IgbmVzdGVkIHN0YWNrc1xuICAgIGlmICh0aGlzLm5lc3RlZCB8fCB0YXJnZXQubmVzdGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGNhbm5vdCBiZSBhc3NlbWJseS1sZXZlbCBkZXBlbmRlbmNpZXMgZm9yIG5lc3RlZCBzdGFja3MnKTtcbiAgICB9XG4gICAgLy8gTm8gbmVlZCB0byBjaGVjayBmb3IgYSBkZXBlbmRlbmN5IGN5Y2xlIHdoZW4gcmVtb3Zpbmcgb25lXG5cbiAgICAvLyBGaWxsIGluIHJlYXNvbiBkZXRhaWxzIGlmIG5vdCBwcm92aWRlZFxuICAgIGlmICghcmVhc29uRmlsdGVyLnNvdXJjZSkge1xuICAgICAgcmVhc29uRmlsdGVyLnNvdXJjZSA9IHRoaXM7XG4gICAgfVxuICAgIGlmICghcmVhc29uRmlsdGVyLnRhcmdldCkge1xuICAgICAgcmVhc29uRmlsdGVyLnRhcmdldCA9IHRhcmdldDtcbiAgICB9XG5cbiAgICBsZXQgZGVwID0gdGhpcy5fc3RhY2tEZXBlbmRlbmNpZXNbTmFtZXMudW5pcXVlSWQodGFyZ2V0KV07XG4gICAgaWYgKCFkZXApIHtcbiAgICAgIC8vIERlcGVuZGVuY3kgZG9lc24ndCBleGlzdCAtIHJldHVybiBub3dcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGaW5kIGFuZCByZW1vdmUgdGhlIHNwZWNpZmllZCByZWFzb24gZnJvbSB0aGUgZGVwZW5kZW5jeVxuICAgIGxldCBtYXRjaGVkUmVhc29uczogU2V0PFN0YWNrRGVwZW5kZW5jeVJlYXNvbj4gPSBuZXcgU2V0KCk7XG4gICAgZGVwLnJlYXNvbnMuZm9yRWFjaCgocmVhc29uKSA9PiB7XG4gICAgICBpZiAocmVhc29uRmlsdGVyLnNvdXJjZSA9PSByZWFzb24uc291cmNlICYmIHJlYXNvbkZpbHRlci50YXJnZXQgPT0gcmVhc29uLnRhcmdldCkge1xuICAgICAgICBtYXRjaGVkUmVhc29ucy5hZGQocmVhc29uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAobWF0Y2hlZFJlYXNvbnMuc2l6ZSA+IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgY2Fubm90IGJlIG1vcmUgdGhhbiBvbmUgcmVhc29uIGZvciBkZXBlbmRlbmN5IHJlbW92YWwsIGZvdW5kOiAke21hdGNoZWRSZWFzb25zfWApO1xuICAgIH1cbiAgICBpZiAobWF0Y2hlZFJlYXNvbnMuc2l6ZSA9PSAwKSB7XG4gICAgICAvLyBSZWFzb24gaXMgYWxyZWFkeSBub3QgdGhlcmUgLSByZXR1cm4gbm93XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBtYXRjaGVkUmVhc29uID0gQXJyYXkuZnJvbShtYXRjaGVkUmVhc29ucylbMF07XG5cbiAgICBsZXQgaW5kZXggPSBkZXAucmVhc29ucy5pbmRleE9mKG1hdGNoZWRSZWFzb24sIDApO1xuICAgIGRlcC5yZWFzb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgLy8gSWYgdGhhdCB3YXMgdGhlIGxhc3QgcmVhc29uLCByZW1vdmUgdGhlIGRlcGVuZGVuY3lcbiAgICBpZiAoZGVwLnJlYXNvbnMubGVuZ3RoID09IDApIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9zdGFja0RlcGVuZGVuY2llc1tOYW1lcy51bmlxdWVJZCh0YXJnZXQpXTtcbiAgICB9XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuQ0RLX0RFQlVHX0RFUFMpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmxvZyhgW0NES19ERUJVR19ERVBTXSBzdGFjayBcIiR7dGhpcy5ub2RlLnBhdGh9XCIgbm8gbG9uZ2VyIGRlcGVuZHMgb24gXCIke3RhcmdldC5ub2RlLnBhdGh9XCIgYmVjYXVzZTogJHtyZWFzb25GaWx0ZXJ9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN5bnRoZXNpemVzIHRoZSBjbG91ZGZvcm1hdGlvbiB0ZW1wbGF0ZSBpbnRvIGEgY2xvdWQgYXNzZW1ibHkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9zeW50aGVzaXplVGVtcGxhdGUoc2Vzc2lvbjogSVN5bnRoZXNpc1Nlc3Npb24sIGxvb2t1cFJvbGVBcm4/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBJbiBwcmluY2lwbGUsIHN0YWNrIHN5bnRoZXNpcyBpcyBkZWxlZ2F0ZWQgdG8gdGhlXG4gICAgLy8gU3RhY2tTeW50aGVzaXMgb2JqZWN0LlxuICAgIC8vXG4gICAgLy8gSG93ZXZlciwgc29tZSBwYXJ0cyBvZiBzeW50aGVzaXMgY3VycmVudGx5IHVzZSBzb21lIHByaXZhdGVcbiAgICAvLyBtZXRob2RzIG9uIFN0YWNrLCBhbmQgSSBkb24ndCByZWFsbHkgc2VlIHRoZSB2YWx1ZSBpbiByZWZhY3RvcmluZ1xuICAgIC8vIHRoaXMgcmlnaHQgbm93LCBzbyBzb21lIHBhcnRzIHN0aWxsIGhhcHBlbiBoZXJlLlxuICAgIGNvbnN0IGJ1aWxkZXIgPSBzZXNzaW9uLmFzc2VtYmx5O1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLl90b0Nsb3VkRm9ybWF0aW9uKCk7XG5cbiAgICAvLyB3cml0ZSB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgYXMgYSBKU09OIGZpbGVcbiAgICBjb25zdCBvdXRQYXRoID0gcGF0aC5qb2luKGJ1aWxkZXIub3V0ZGlyLCB0aGlzLnRlbXBsYXRlRmlsZSk7XG5cbiAgICBpZiAodGhpcy5tYXhSZXNvdXJjZXMgPiAwKSB7XG4gICAgICBjb25zdCByZXNvdXJjZXMgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMgfHwge307XG4gICAgICBjb25zdCBudW1iZXJPZlJlc291cmNlcyA9IE9iamVjdC5rZXlzKHJlc291cmNlcykubGVuZ3RoO1xuXG4gICAgICBpZiAobnVtYmVyT2ZSZXNvdXJjZXMgPiB0aGlzLm1heFJlc291cmNlcykge1xuICAgICAgICBjb25zdCBjb3VudHMgPSBPYmplY3QuZW50cmllcyhjb3VudChPYmplY3QudmFsdWVzKHJlc291cmNlcykubWFwKChyOiBhbnkpID0+IGAke3I/LlR5cGV9YCkpKS5tYXAoKFt0eXBlLCBjXSkgPT4gYCR7dHlwZX0gKCR7Y30pYCkuam9pbignLCAnKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBOdW1iZXIgb2YgcmVzb3VyY2VzIGluIHN0YWNrICcke3RoaXMubm9kZS5wYXRofSc6ICR7bnVtYmVyT2ZSZXNvdXJjZXN9IGlzIGdyZWF0ZXIgdGhhbiBhbGxvd2VkIG1heGltdW0gb2YgJHt0aGlzLm1heFJlc291cmNlc306ICR7Y291bnRzfWApO1xuICAgICAgfSBlbHNlIGlmIChudW1iZXJPZlJlc291cmNlcyA+PSAodGhpcy5tYXhSZXNvdXJjZXMgKiAwLjgpKSB7XG4gICAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZEluZm8oYE51bWJlciBvZiByZXNvdXJjZXM6ICR7bnVtYmVyT2ZSZXNvdXJjZXN9IGlzIGFwcHJvYWNoaW5nIGFsbG93ZWQgbWF4aW11bSBvZiAke3RoaXMubWF4UmVzb3VyY2VzfWApO1xuICAgICAgfVxuICAgIH1cbiAgICBmcy53cml0ZUZpbGVTeW5jKG91dFBhdGgsIEpTT04uc3RyaW5naWZ5KHRlbXBsYXRlLCB1bmRlZmluZWQsIDEpKTtcblxuICAgIGZvciAoY29uc3QgY3R4IG9mIHRoaXMuX21pc3NpbmdDb250ZXh0KSB7XG4gICAgICBpZiAobG9va3VwUm9sZUFybiAhPSBudWxsKSB7XG4gICAgICAgIGJ1aWxkZXIuYWRkTWlzc2luZyh7IC4uLmN0eCwgcHJvcHM6IHsgLi4uY3R4LnByb3BzLCBsb29rdXBSb2xlQXJuIH0gfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWlsZGVyLmFkZE1pc3NpbmcoY3R4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9vayB1cCBhIGZhY3QgdmFsdWUgZm9yIHRoZSBnaXZlbiBmYWN0IGZvciB0aGUgcmVnaW9uIG9mIHRoaXMgc3RhY2tcbiAgICpcbiAgICogV2lsbCByZXR1cm4gYSBkZWZpbml0ZSB2YWx1ZSBvbmx5IGlmIHRoZSByZWdpb24gb2YgdGhlIGN1cnJlbnQgc3RhY2sgaXMgcmVzb2x2ZWQuXG4gICAqIElmIG5vdCwgYSBsb29rdXAgbWFwIHdpbGwgYmUgYWRkZWQgdG8gdGhlIHN0YWNrIGFuZCB0aGUgbG9va3VwIHdpbGwgYmUgZG9uZSBhdFxuICAgKiBDREsgZGVwbG95bWVudCB0aW1lLlxuICAgKlxuICAgKiBXaGF0IHJlZ2lvbnMgd2lsbCBiZSBpbmNsdWRlZCBpbiB0aGUgbG9va3VwIG1hcCBpcyBjb250cm9sbGVkIGJ5IHRoZVxuICAgKiBgQGF3cy1jZGsvY29yZTp0YXJnZXQtcGFydGl0aW9uc2AgY29udGV4dCB2YWx1ZTogaXQgbXVzdCBiZSBzZXQgdG8gYSBsaXN0XG4gICAqIG9mIHBhcnRpdGlvbnMsIGFuZCBvbmx5IHJlZ2lvbnMgZnJvbSB0aGUgZ2l2ZW4gcGFydGl0aW9ucyB3aWxsIGJlIGluY2x1ZGVkLlxuICAgKiBJZiBubyBzdWNoIGNvbnRleHQga2V5IGlzIHNldCwgYWxsIHJlZ2lvbnMgd2lsbCBiZSBpbmNsdWRlZC5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBpbnRlbmRlZCB0byBiZSB1c2VkIGJ5IGNvbnN0cnVjdCBsaWJyYXJ5IGF1dGhvcnMuIEFwcGxpY2F0aW9uXG4gICAqIGJ1aWxkZXJzIGNhbiByZWx5IG9uIHRoZSBhYnN0cmFjdGlvbnMgb2ZmZXJlZCBieSBjb25zdHJ1Y3QgbGlicmFyaWVzIGFuZCBkb1xuICAgKiBub3QgaGF2ZSB0byB3b3JyeSBhYm91dCByZWdpb25hbCBmYWN0cy5cbiAgICpcbiAgICogSWYgYGRlZmF1bHRWYWx1ZWAgaXMgbm90IGdpdmVuLCBpdCBpcyBhbiBlcnJvciBpZiB0aGUgZmFjdCBpcyB1bmtub3duIGZvclxuICAgKiB0aGUgZ2l2ZW4gcmVnaW9uLlxuICAgKi9cbiAgcHVibGljIHJlZ2lvbmFsRmFjdChmYWN0TmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsdWU/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKHRoaXMucmVnaW9uKSkge1xuICAgICAgY29uc3QgcmV0ID0gRmFjdC5maW5kKHRoaXMucmVnaW9uLCBmYWN0TmFtZSkgPz8gZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKHJldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgcmVnaW9uLWluZm86IGRvbid0IGtub3cgJHtmYWN0TmFtZX0gZm9yIHJlZ2lvbiAke3RoaXMucmVnaW9ufS4gVXNlICdGYWN0LnJlZ2lzdGVyJyB0byBwcm92aWRlIHRoaXMgdmFsdWUuYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGNvbnN0IHBhcnRpdGlvbnMgPSBOb2RlLm9mKHRoaXMpLnRyeUdldENvbnRleHQoY3hhcGkuVEFSR0VUX1BBUlRJVElPTlMpO1xuICAgIGlmIChwYXJ0aXRpb25zICE9PSB1bmRlZmluZWQgJiYgcGFydGl0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgJiYgIUFycmF5LmlzQXJyYXkocGFydGl0aW9ucykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ29udGV4dCB2YWx1ZSAnJHtjeGFwaS5UQVJHRVRfUEFSVElUSU9OU30nIHNob3VsZCBiZSBhIGxpc3Qgb2Ygc3RyaW5ncywgZ290OiAke0pTT04uc3RyaW5naWZ5KHBhcnRpdGlvbnMpfWApO1xuICAgIH1cblxuICAgIGNvbnN0IGxvb2t1cE1hcCA9XG4gICAgICBwYXJ0aXRpb25zICE9PSB1bmRlZmluZWQgJiYgcGFydGl0aW9ucyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyBSZWdpb25JbmZvLmxpbWl0ZWRSZWdpb25NYXAoZmFjdE5hbWUsIHBhcnRpdGlvbnMpXG4gICAgICAgIDogUmVnaW9uSW5mby5yZWdpb25NYXAoZmFjdE5hbWUpO1xuXG4gICAgcmV0dXJuIGRlcGxveVRpbWVMb29rdXAodGhpcywgZmFjdE5hbWUsIGxvb2t1cE1hcCwgZGVmYXVsdFZhbHVlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIENsb3VkRm9ybWF0aW9uIEV4cG9ydCBmb3IgYSBzdHJpbmcgdmFsdWVcbiAgICpcbiAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGNvcnJlc3BvbmRpbmcgYEZuLmltcG9ydFZhbHVlKClgXG4gICAqIGV4cHJlc3Npb24gZm9yIHRoaXMgRXhwb3J0LiBZb3UgY2FuIGNvbnRyb2wgdGhlIG5hbWUgZm9yIHRoZSBleHBvcnQgYnlcbiAgICogcGFzc2luZyB0aGUgYG5hbWVgIG9wdGlvbi5cbiAgICpcbiAgICogSWYgeW91IGRvbid0IHN1cHBseSBhIHZhbHVlIGZvciBgbmFtZWAsIHRoZSB2YWx1ZSB5b3UncmUgZXhwb3J0aW5nIG11c3QgYmVcbiAgICogYSBSZXNvdXJjZSBhdHRyaWJ1dGUgKGZvciBleGFtcGxlOiBgYnVja2V0LmJ1Y2tldE5hbWVgKSBhbmQgaXQgd2lsbCBiZVxuICAgKiBnaXZlbiB0aGUgc2FtZSBuYW1lIGFzIHRoZSBhdXRvbWF0aWMgY3Jvc3Mtc3RhY2sgcmVmZXJlbmNlIHRoYXQgd291bGQgYmUgY3JlYXRlZFxuICAgKiBpZiB5b3UgdXNlZCB0aGUgYXR0cmlidXRlIGluIGFub3RoZXIgU3RhY2suXG4gICAqXG4gICAqIE9uZSBvZiB0aGUgdXNlcyBmb3IgdGhpcyBtZXRob2QgaXMgdG8gKnJlbW92ZSogdGhlIHJlbGF0aW9uc2hpcCBiZXR3ZWVuXG4gICAqIHR3byBTdGFja3MgZXN0YWJsaXNoZWQgYnkgYXV0b21hdGljIGNyb3NzLXN0YWNrIHJlZmVyZW5jZXMuIEl0IHdpbGxcbiAgICogdGVtcG9yYXJpbHkgZW5zdXJlIHRoYXQgdGhlIENsb3VkRm9ybWF0aW9uIEV4cG9ydCBzdGlsbCBleGlzdHMgd2hpbGUgeW91XG4gICAqIHJlbW92ZSB0aGUgcmVmZXJlbmNlIGZyb20gdGhlIGNvbnN1bWluZyBzdGFjay4gQWZ0ZXIgdGhhdCwgeW91IGNhbiByZW1vdmVcbiAgICogdGhlIHJlc291cmNlIGFuZCB0aGUgbWFudWFsIGV4cG9ydC5cbiAgICpcbiAgICogIyMgRXhhbXBsZVxuICAgKlxuICAgKiBIZXJlIGlzIGhvdyB0aGUgcHJvY2VzcyB3b3Jrcy4gTGV0J3Mgc2F5IHRoZXJlIGFyZSB0d28gc3RhY2tzLFxuICAgKiBgcHJvZHVjZXJTdGFja2AgYW5kIGBjb25zdW1lclN0YWNrYCwgYW5kIGBwcm9kdWNlclN0YWNrYCBoYXMgYSBidWNrZXRcbiAgICogY2FsbGVkIGBidWNrZXRgLCB3aGljaCBpcyByZWZlcmVuY2VkIGJ5IGBjb25zdW1lclN0YWNrYCAocGVyaGFwcyBiZWNhdXNlXG4gICAqIGFuIEFXUyBMYW1iZGEgRnVuY3Rpb24gd3JpdGVzIGludG8gaXQsIG9yIHNvbWV0aGluZyBsaWtlIHRoYXQpLlxuICAgKlxuICAgKiBJdCBpcyBub3Qgc2FmZSB0byByZW1vdmUgYHByb2R1Y2VyU3RhY2suYnVja2V0YCBiZWNhdXNlIGFzIHRoZSBidWNrZXQgaXMgYmVpbmdcbiAgICogZGVsZXRlZCwgYGNvbnN1bWVyU3RhY2tgIG1pZ2h0IHN0aWxsIGJlIHVzaW5nIGl0LlxuICAgKlxuICAgKiBJbnN0ZWFkLCB0aGUgcHJvY2VzcyB0YWtlcyB0d28gZGVwbG95bWVudHM6XG4gICAqXG4gICAqICMjIyBEZXBsb3ltZW50IDE6IGJyZWFrIHRoZSByZWxhdGlvbnNoaXBcbiAgICpcbiAgICogLSBNYWtlIHN1cmUgYGNvbnN1bWVyU3RhY2tgIG5vIGxvbmdlciByZWZlcmVuY2VzIGBidWNrZXQuYnVja2V0TmFtZWAgKG1heWJlIHRoZSBjb25zdW1lclxuICAgKiAgIHN0YWNrIG5vdyB1c2VzIGl0cyBvd24gYnVja2V0LCBvciBpdCB3cml0ZXMgdG8gYW4gQVdTIER5bmFtb0RCIHRhYmxlLCBvciBtYXliZSB5b3UganVzdFxuICAgKiAgIHJlbW92ZSB0aGUgTGFtYmRhIEZ1bmN0aW9uIGFsdG9nZXRoZXIpLlxuICAgKiAtIEluIHRoZSBgUHJvZHVjZXJTdGFja2AgY2xhc3MsIGNhbGwgYHRoaXMuZXhwb3J0VmFsdWUodGhpcy5idWNrZXQuYnVja2V0TmFtZSlgLiBUaGlzXG4gICAqICAgd2lsbCBtYWtlIHN1cmUgdGhlIENsb3VkRm9ybWF0aW9uIEV4cG9ydCBjb250aW51ZXMgdG8gZXhpc3Qgd2hpbGUgdGhlIHJlbGF0aW9uc2hpcFxuICAgKiAgIGJldHdlZW4gdGhlIHR3byBzdGFja3MgaXMgYmVpbmcgYnJva2VuLlxuICAgKiAtIERlcGxveSAodGhpcyB3aWxsIGVmZmVjdGl2ZWx5IG9ubHkgY2hhbmdlIHRoZSBgY29uc3VtZXJTdGFja2AsIGJ1dCBpdCdzIHNhZmUgdG8gZGVwbG95IGJvdGgpLlxuICAgKlxuICAgKiAjIyMgRGVwbG95bWVudCAyOiByZW1vdmUgdGhlIGJ1Y2tldCByZXNvdXJjZVxuICAgKlxuICAgKiAtIFlvdSBhcmUgbm93IGZyZWUgdG8gcmVtb3ZlIHRoZSBgYnVja2V0YCByZXNvdXJjZSBmcm9tIGBwcm9kdWNlclN0YWNrYC5cbiAgICogLSBEb24ndCBmb3JnZXQgdG8gcmVtb3ZlIHRoZSBgZXhwb3J0VmFsdWUoKWAgY2FsbCBhcyB3ZWxsLlxuICAgKiAtIERlcGxveSBhZ2FpbiAodGhpcyB0aW1lIG9ubHkgdGhlIGBwcm9kdWNlclN0YWNrYCB3aWxsIGJlIGNoYW5nZWQgLS0gdGhlIGJ1Y2tldCB3aWxsIGJlIGRlbGV0ZWQpLlxuICAgKi9cbiAgcHVibGljIGV4cG9ydFZhbHVlKGV4cG9ydGVkVmFsdWU6IGFueSwgb3B0aW9uczogRXhwb3J0VmFsdWVPcHRpb25zID0ge30pOiBzdHJpbmcge1xuICAgIGlmIChvcHRpb25zLm5hbWUpIHtcbiAgICAgIG5ldyBDZm5PdXRwdXQodGhpcywgYEV4cG9ydCR7b3B0aW9ucy5uYW1lfWAsIHtcbiAgICAgICAgdmFsdWU6IGV4cG9ydGVkVmFsdWUsXG4gICAgICAgIGV4cG9ydE5hbWU6IG9wdGlvbnMubmFtZSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIEZuLmltcG9ydFZhbHVlKG9wdGlvbnMubmFtZSk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBleHBvcnROYW1lLCBleHBvcnRzU2NvcGUsIGlkLCBleHBvcnRhYmxlIH0gPSB0aGlzLnJlc29sdmVFeHBvcnRlZFZhbHVlKGV4cG9ydGVkVmFsdWUpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gZXhwb3J0c1Njb3BlLm5vZGUudHJ5RmluZENoaWxkKGlkKSBhcyBDZm5PdXRwdXQ7XG4gICAgaWYgKCFvdXRwdXQpIHtcbiAgICAgIG5ldyBDZm5PdXRwdXQoZXhwb3J0c1Njb3BlLCBpZCwge1xuICAgICAgICB2YWx1ZTogVG9rZW4uYXNTdHJpbmcoZXhwb3J0YWJsZSksXG4gICAgICAgIGV4cG9ydE5hbWUsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBpbXBvcnRWYWx1ZSA9IEZuLmltcG9ydFZhbHVlKGV4cG9ydE5hbWUpO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaW1wb3J0VmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dGVtcHRlZCB0byBleHBvcnQgYSBsaXN0IHZhbHVlIGZyb20gYGV4cG9ydFZhbHVlKClgOiB1c2UgYGV4cG9ydFN0cmluZ0xpc3RWYWx1ZSgpYCBpbnN0ZWFkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGltcG9ydFZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIENsb3VkRm9ybWF0aW9uIEV4cG9ydCBmb3IgYSBzdHJpbmcgbGlzdCB2YWx1ZVxuICAgKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIGxpc3QgcmVwcmVzZW50aW5nIHRoZSBjb3JyZXNwb25kaW5nIGBGbi5pbXBvcnRWYWx1ZSgpYFxuICAgKiBleHByZXNzaW9uIGZvciB0aGlzIEV4cG9ydC4gVGhlIGV4cG9ydCBleHByZXNzaW9uIGlzIGF1dG9tYXRpY2FsbHkgd3JhcHBlZCB3aXRoIGFuXG4gICAqIGBGbjo6Sm9pbmAgYW5kIHRoZSBpbXBvcnQgdmFsdWUgd2l0aCBhbiBgRm46OlNwbGl0YCwgc2luY2UgQ2xvdWRGb3JtYXRpb24gY2FuIG9ubHlcbiAgICogZXhwb3J0IHN0cmluZ3MuIFlvdSBjYW4gY29udHJvbCB0aGUgbmFtZSBmb3IgdGhlIGV4cG9ydCBieSBwYXNzaW5nIHRoZSBgbmFtZWAgb3B0aW9uLlxuICAgKlxuICAgKiBJZiB5b3UgZG9uJ3Qgc3VwcGx5IGEgdmFsdWUgZm9yIGBuYW1lYCwgdGhlIHZhbHVlIHlvdSdyZSBleHBvcnRpbmcgbXVzdCBiZVxuICAgKiBhIFJlc291cmNlIGF0dHJpYnV0ZSAoZm9yIGV4YW1wbGU6IGBidWNrZXQuYnVja2V0TmFtZWApIGFuZCBpdCB3aWxsIGJlXG4gICAqIGdpdmVuIHRoZSBzYW1lIG5hbWUgYXMgdGhlIGF1dG9tYXRpYyBjcm9zcy1zdGFjayByZWZlcmVuY2UgdGhhdCB3b3VsZCBiZSBjcmVhdGVkXG4gICAqIGlmIHlvdSB1c2VkIHRoZSBhdHRyaWJ1dGUgaW4gYW5vdGhlciBTdGFjay5cbiAgICpcbiAgICogT25lIG9mIHRoZSB1c2VzIGZvciB0aGlzIG1ldGhvZCBpcyB0byAqcmVtb3ZlKiB0aGUgcmVsYXRpb25zaGlwIGJldHdlZW5cbiAgICogdHdvIFN0YWNrcyBlc3RhYmxpc2hlZCBieSBhdXRvbWF0aWMgY3Jvc3Mtc3RhY2sgcmVmZXJlbmNlcy4gSXQgd2lsbFxuICAgKiB0ZW1wb3JhcmlseSBlbnN1cmUgdGhhdCB0aGUgQ2xvdWRGb3JtYXRpb24gRXhwb3J0IHN0aWxsIGV4aXN0cyB3aGlsZSB5b3VcbiAgICogcmVtb3ZlIHRoZSByZWZlcmVuY2UgZnJvbSB0aGUgY29uc3VtaW5nIHN0YWNrLiBBZnRlciB0aGF0LCB5b3UgY2FuIHJlbW92ZVxuICAgKiB0aGUgcmVzb3VyY2UgYW5kIHRoZSBtYW51YWwgZXhwb3J0LlxuICAgKlxuICAgKiBTZWUgYGV4cG9ydFZhbHVlYCBmb3IgYW4gZXhhbXBsZSBvZiB0aGlzIHByb2Nlc3MuXG4gICAqL1xuICBwdWJsaWMgZXhwb3J0U3RyaW5nTGlzdFZhbHVlKGV4cG9ydGVkVmFsdWU6IGFueSwgb3B0aW9uczogRXhwb3J0VmFsdWVPcHRpb25zID0ge30pOiBzdHJpbmdbXSB7XG4gICAgaWYgKG9wdGlvbnMubmFtZSkge1xuICAgICAgbmV3IENmbk91dHB1dCh0aGlzLCBgRXhwb3J0JHtvcHRpb25zLm5hbWV9YCwge1xuICAgICAgICB2YWx1ZTogRm4uam9pbihTVFJJTkdfTElTVF9SRUZFUkVOQ0VfREVMSU1JVEVSLCBleHBvcnRlZFZhbHVlKSxcbiAgICAgICAgZXhwb3J0TmFtZTogb3B0aW9ucy5uYW1lLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gRm4uc3BsaXQoU1RSSU5HX0xJU1RfUkVGRVJFTkNFX0RFTElNSVRFUiwgRm4uaW1wb3J0VmFsdWUob3B0aW9ucy5uYW1lKSk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBleHBvcnROYW1lLCBleHBvcnRzU2NvcGUsIGlkLCBleHBvcnRhYmxlIH0gPSB0aGlzLnJlc29sdmVFeHBvcnRlZFZhbHVlKGV4cG9ydGVkVmFsdWUpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gZXhwb3J0c1Njb3BlLm5vZGUudHJ5RmluZENoaWxkKGlkKSBhcyBDZm5PdXRwdXQ7XG4gICAgaWYgKCFvdXRwdXQpIHtcbiAgICAgIG5ldyBDZm5PdXRwdXQoZXhwb3J0c1Njb3BlLCBpZCwge1xuICAgICAgICAvLyB0aGlzIGlzIGEgbGlzdCBzbyBleHBvcnQgYW4gRm46OkpvaW4gZXhwcmVzc2lvblxuICAgICAgICAvLyBhbmQgaW1wb3J0IGFuIEZuOjpTcGxpdCBleHByZXNzaW9uLFxuICAgICAgICAvLyBzaW5jZSBDbG91ZEZvcm1hdGlvbiBPdXRwdXRzIGNhbiBvbmx5IGJlIHN0cmluZ3NcbiAgICAgICAgLy8gKHN0cmluZyBsaXN0cyBhcmUgaW52YWxpZClcbiAgICAgICAgdmFsdWU6IEZuLmpvaW4oU1RSSU5HX0xJU1RfUkVGRVJFTkNFX0RFTElNSVRFUiwgVG9rZW4uYXNMaXN0KGV4cG9ydGFibGUpKSxcbiAgICAgICAgZXhwb3J0TmFtZSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHdlIGRvbid0IHVzZSBgRm4uaW1wb3J0TGlzdFZhbHVlKClgIHNpbmNlIHRoaXMgYXJyYXkgaXMgYSBDRk4gYXR0cmlidXRlLCBhbmQgd2UgZG9uJ3Qga25vdyBob3cgbG9uZyB0aGlzIGF0dHJpYnV0ZSBpc1xuICAgIGNvbnN0IGltcG9ydFZhbHVlID0gRm4uc3BsaXQoU1RSSU5HX0xJU1RfUkVGRVJFTkNFX0RFTElNSVRFUiwgRm4uaW1wb3J0VmFsdWUoZXhwb3J0TmFtZSkpO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGltcG9ydFZhbHVlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0ZWQgdG8gZXhwb3J0IGEgc3RyaW5nIHZhbHVlIGZyb20gYGV4cG9ydFN0cmluZ0xpc3RWYWx1ZSgpYDogdXNlIGBleHBvcnRWYWx1ZSgpYCBpbnN0ZWFkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGltcG9ydFZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG5hbWluZyBzY2hlbWUgdXNlZCB0byBhbGxvY2F0ZSBsb2dpY2FsIElEcy4gQnkgZGVmYXVsdCwgdXNlc1xuICAgKiB0aGUgYEhhc2hlZEFkZHJlc3NpbmdTY2hlbWVgIGJ1dCB0aGlzIG1ldGhvZCBjYW4gYmUgb3ZlcnJpZGRlbiB0byBjdXN0b21pemVcbiAgICogdGhpcyBiZWhhdmlvci5cbiAgICpcbiAgICogSW4gb3JkZXIgdG8gbWFrZSBzdXJlIGxvZ2ljYWwgSURzIGFyZSB1bmlxdWUgYW5kIHN0YWJsZSwgd2UgaGFzaCB0aGUgcmVzb3VyY2VcbiAgICogY29uc3RydWN0IHRyZWUgcGF0aCAoaS5lLiB0b3BsZXZlbC9zZWNvbmRsZXZlbC8uLi4vbXlyZXNvdXJjZSkgYW5kIGFkZCBpdCBhc1xuICAgKiBhIHN1ZmZpeCB0byB0aGUgcGF0aCBjb21wb25lbnRzIGpvaW5lZCB3aXRob3V0IGEgc2VwYXJhdG9yIChDbG91ZEZvcm1hdGlvblxuICAgKiBJRHMgb25seSBhbGxvdyBhbHBoYW51bWVyaWMgY2hhcmFjdGVycykuXG4gICAqXG4gICAqIFRoZSByZXN1bHQgd2lsbCBiZTpcbiAgICpcbiAgICogICA8cGF0aC5qb2luKCcnKT48bWQ1KHBhdGguam9pbignLycpPlxuICAgKiAgICAgXCJodW1hblwiICAgICAgXCJoYXNoXCJcbiAgICpcbiAgICogSWYgdGhlIFwiaHVtYW5cIiBwYXJ0IG9mIHRoZSBJRCBleGNlZWRzIDI0MCBjaGFyYWN0ZXJzLCB3ZSBzaW1wbHkgdHJpbSBpdCBzb1xuICAgKiB0aGUgdG90YWwgSUQgZG9lc24ndCBleGNlZWQgQ2xvdWRGb3JtYXRpb24ncyAyNTUgY2hhcmFjdGVyIGxpbWl0LlxuICAgKlxuICAgKiBXZSBvbmx5IHRha2UgOCBjaGFyYWN0ZXJzIGZyb20gdGhlIG1kNSBoYXNoICgwLjAwMDAwNSBjaGFuY2Ugb2YgY29sbGlzaW9uKS5cbiAgICpcbiAgICogU3BlY2lhbCBjYXNlczpcbiAgICpcbiAgICogLSBJZiB0aGUgcGF0aCBvbmx5IGNvbnRhaW5zIGEgc2luZ2xlIGNvbXBvbmVudCAoaS5lLiBpdCdzIGEgdG9wLWxldmVsXG4gICAqICAgcmVzb3VyY2UpLCB3ZSB3b24ndCBhZGQgdGhlIGhhc2ggdG8gaXQuIFRoZSBoYXNoIGlzIG5vdCBuZWVkZWQgZm9yXG4gICAqICAgZGlzYW1iaWd1YXRpb24gYW5kIGFsc28sIGl0IGFsbG93cyBmb3IgYSBtb3JlIHN0cmFpZ2h0Zm9yd2FyZCBtaWdyYXRpb24gYW5cbiAgICogICBleGlzdGluZyBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSB0byBhIENESyBzdGFjayB3aXRob3V0IGxvZ2ljYWwgSUQgY2hhbmdlc1xuICAgKiAgIChvciByZW5hbWVzKS5cbiAgICogLSBGb3IgYWVzdGhldGljIHJlYXNvbnMsIGlmIHRoZSBsYXN0IGNvbXBvbmVudHMgb2YgdGhlIHBhdGggYXJlIHRoZSBzYW1lXG4gICAqICAgKGkuZS4gYEwxL0wyL1BpcGVsaW5lL1BpcGVsaW5lYCksIHRoZXkgd2lsbCBiZSBkZS1kdXBsaWNhdGVkIHRvIG1ha2UgdGhlXG4gICAqICAgcmVzdWx0aW5nIGh1bWFuIHBvcnRpb24gb2YgdGhlIElEIG1vcmUgcGxlYXNpbmc6IGBMMUwyUGlwZWxpbmU8SEFTSD5gXG4gICAqICAgaW5zdGVhZCBvZiBgTDFMMlBpcGVsaW5lUGlwZWxpbmU8SEFTSD5gXG4gICAqIC0gSWYgYSBjb21wb25lbnQgaXMgbmFtZWQgXCJEZWZhdWx0XCIgaXQgd2lsbCBiZSBvbWl0dGVkIGZyb20gdGhlIHBhdGguIFRoaXNcbiAgICogICBhbGxvd3MgcmVmYWN0b3JpbmcgaGlnaGVyIGxldmVsIGFic3RyYWN0aW9ucyBhcm91bmQgY29uc3RydWN0cyB3aXRob3V0IGFmZmVjdGluZ1xuICAgKiAgIHRoZSBJRHMgb2YgYWxyZWFkeSBkZXBsb3llZCByZXNvdXJjZXMuXG4gICAqIC0gSWYgYSBjb21wb25lbnQgaXMgbmFtZWQgXCJSZXNvdXJjZVwiIGl0IHdpbGwgYmUgb21pdHRlZCBmcm9tIHRoZSB1c2VyLXZpc2libGVcbiAgICogICBwYXRoLCBidXQgaW5jbHVkZWQgaW4gdGhlIGhhc2guIFRoaXMgcmVkdWNlcyB2aXN1YWwgbm9pc2UgaW4gdGhlIGh1bWFuIHJlYWRhYmxlXG4gICAqICAgcGFydCBvZiB0aGUgaWRlbnRpZmllci5cbiAgICpcbiAgICogQHBhcmFtIGNmbkVsZW1lbnQgVGhlIGVsZW1lbnQgZm9yIHdoaWNoIHRoZSBsb2dpY2FsIElEIGlzIGFsbG9jYXRlZC5cbiAgICovXG4gIHByb3RlY3RlZCBhbGxvY2F0ZUxvZ2ljYWxJZChjZm5FbGVtZW50OiBDZm5FbGVtZW50KTogc3RyaW5nIHtcbiAgICBjb25zdCBzY29wZXMgPSBjZm5FbGVtZW50Lm5vZGUuc2NvcGVzO1xuICAgIGNvbnN0IHN0YWNrSW5kZXggPSBzY29wZXMuaW5kZXhPZihjZm5FbGVtZW50LnN0YWNrKTtcbiAgICBjb25zdCBwYXRoQ29tcG9uZW50cyA9IHNjb3Blcy5zbGljZShzdGFja0luZGV4ICsgMSkubWFwKHggPT4geC5ub2RlLmlkKTtcbiAgICByZXR1cm4gbWFrZVVuaXF1ZUlkKHBhdGhDb21wb25lbnRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBzdGFjayBuYW1lXG4gICAqXG4gICAqIENsb3VkRm9ybWF0aW9uIHN0YWNrIG5hbWVzIGNhbiBpbmNsdWRlIGRhc2hlcyBpbiBhZGRpdGlvbiB0byB0aGUgcmVndWxhciBpZGVudGlmaWVyXG4gICAqIGNoYXJhY3RlciBjbGFzc2VzLCBhbmQgd2UgZG9uJ3QgYWxsb3cgb25lIG9mIHRoZSBtYWdpYyBtYXJrZXJzLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCBfdmFsaWRhdGVJZChuYW1lOiBzdHJpbmcpIHtcbiAgICBpZiAobmFtZSAmJiAhVkFMSURfU1RBQ0tfTkFNRV9SRUdFWC50ZXN0KG5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFN0YWNrIG5hbWUgbXVzdCBtYXRjaCB0aGUgcmVndWxhciBleHByZXNzaW9uOiAke1ZBTElEX1NUQUNLX05BTUVfUkVHRVgudG9TdHJpbmcoKX0sIGdvdCAnJHtuYW1lfSdgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgZm9yIHRoaXMgc3RhY2sgYnkgdHJhdmVyc2luZ1xuICAgKiB0aGUgdHJlZSBhbmQgaW52b2tpbmcgX3RvQ2xvdWRGb3JtYXRpb24oKSBvbiBhbGwgRW50aXR5IG9iamVjdHMuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIF90b0Nsb3VkRm9ybWF0aW9uKCkge1xuICAgIGxldCB0cmFuc2Zvcm06IHN0cmluZyB8IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xuXG4gICAgaWYgKHRoaXMudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmcoJ1RoaXMgc3RhY2sgaXMgdXNpbmcgdGhlIGRlcHJlY2F0ZWQgYHRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm1gIHByb3BlcnR5LiBDb25zaWRlciBzd2l0Y2hpbmcgdG8gYGFkZFRyYW5zZm9ybSgpYC4nKTtcbiAgICAgIHRoaXMuYWRkVHJhbnNmb3JtKHRoaXMudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybXMpIHtcbiAgICAgIGlmICh0aGlzLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm1zLmxlbmd0aCA9PT0gMSkgeyAvLyBFeHRyYWN0IHNpbmdsZSB2YWx1ZVxuICAgICAgICB0cmFuc2Zvcm0gPSB0aGlzLnRlbXBsYXRlT3B0aW9ucy50cmFuc2Zvcm1zWzBdO1xuICAgICAgfSBlbHNlIHsgLy8gUmVtb3ZlIGR1cGxpY2F0ZSB2YWx1ZXNcbiAgICAgICAgdHJhbnNmb3JtID0gQXJyYXkuZnJvbShuZXcgU2V0KHRoaXMudGVtcGxhdGVPcHRpb25zLnRyYW5zZm9ybXMpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0ZW1wbGF0ZTogYW55ID0ge1xuICAgICAgRGVzY3JpcHRpb246IHRoaXMudGVtcGxhdGVPcHRpb25zLmRlc2NyaXB0aW9uLFxuICAgICAgVHJhbnNmb3JtOiB0cmFuc2Zvcm0sXG4gICAgICBBV1NUZW1wbGF0ZUZvcm1hdFZlcnNpb246IHRoaXMudGVtcGxhdGVPcHRpb25zLnRlbXBsYXRlRm9ybWF0VmVyc2lvbixcbiAgICAgIE1ldGFkYXRhOiB0aGlzLnRlbXBsYXRlT3B0aW9ucy5tZXRhZGF0YSxcbiAgICB9O1xuXG4gICAgY29uc3QgZWxlbWVudHMgPSBjZm5FbGVtZW50cyh0aGlzKTtcbiAgICBjb25zdCBmcmFnbWVudHMgPSBlbGVtZW50cy5tYXAoZSA9PiB0aGlzLnJlc29sdmUoZS5fdG9DbG91ZEZvcm1hdGlvbigpKSk7XG5cbiAgICAvLyBtZXJnZSBpbiBhbGwgQ2xvdWRGb3JtYXRpb24gZnJhZ21lbnRzIGNvbGxlY3RlZCBmcm9tIHRoZSB0cmVlXG4gICAgZm9yIChjb25zdCBmcmFnbWVudCBvZiBmcmFnbWVudHMpIHtcbiAgICAgIG1lcmdlKHRlbXBsYXRlLCBmcmFnbWVudCk7XG4gICAgfVxuXG4gICAgLy8gcmVzb2x2ZSBhbGwgdG9rZW5zIGFuZCByZW1vdmUgYWxsIGVtcHRpZXNcbiAgICBjb25zdCByZXQgPSB0aGlzLnJlc29sdmUodGVtcGxhdGUpIHx8IHt9O1xuXG4gICAgdGhpcy5fbG9naWNhbElkcy5hc3NlcnRBbGxSZW5hbWVzQXBwbGllZCgpO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXByZWNhdGVkLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9wdWxsLzcxODdcbiAgICogQHJldHVybnMgcmVmZXJlbmNlIGl0c2VsZiB3aXRob3V0IGFueSBjaGFuZ2VcbiAgICogQGRlcHJlY2F0ZWQgY3Jvc3MgcmVmZXJlbmNlIGhhbmRsaW5nIGhhcyBiZWVuIG1vdmVkIHRvIGBBcHAucHJlcGFyZSgpYC5cbiAgICovXG4gIHByb3RlY3RlZCBwcmVwYXJlQ3Jvc3NSZWZlcmVuY2UoX3NvdXJjZVN0YWNrOiBTdGFjaywgcmVmZXJlbmNlOiBSZWZlcmVuY2UpOiBJUmVzb2x2YWJsZSB7XG4gICAgcmV0dXJuIHJlZmVyZW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIHZhcmlvdXMgc3RhY2sgZW52aXJvbm1lbnQgYXR0cmlidXRlcy5cbiAgICpcbiAgICovXG4gIHByaXZhdGUgcGFyc2VFbnZpcm9ubWVudChlbnY6IEVudmlyb25tZW50ID0ge30pIHtcbiAgICAvLyBpZiBhbiBlbnZpcm9ubWVudCBwcm9wZXJ0eSBpcyBleHBsaWNpdGx5IHNwZWNpZmllZCB3aGVuIHRoZSBzdGFjayBpc1xuICAgIC8vIGNyZWF0ZWQsIGl0IHdpbGwgYmUgdXNlZC4gaWYgbm90LCB1c2UgdG9rZW5zIGZvciBhY2NvdW50IGFuZCByZWdpb24uXG4gICAgLy9cbiAgICAvLyAoVGhleSBkbyBub3QgbmVlZCB0byBiZSBhbmNob3JlZCB0byBhbnkgY29uc3RydWN0IGxpa2UgcmVzb3VyY2UgYXR0cmlidXRlc1xuICAgIC8vIGFyZSwgYmVjYXVzZSB3ZSdsbCBuZXZlciBFeHBvcnQvRm46OkltcG9ydFZhbHVlIHRoZW0gLS0gdGhlIG9ubHkgc2l0dWF0aW9uXG4gICAgLy8gaW4gd2hpY2ggRXhwb3J0L0ZuOjpJbXBvcnRWYWx1ZSB3b3VsZCB3b3JrIGlzIGlmIHRoZSB2YWx1ZSBhcmUgdGhlIHNhbWVcbiAgICAvLyBiZXR3ZWVuIHByb2R1Y2VyIGFuZCBjb25zdW1lciBhbnl3YXksIHNvIHdlIGNhbiBqdXN0IGFzc3VtZSB0aGF0IHRoZXkgYXJlKS5cbiAgICBjb25zdCBjb250YWluaW5nQXNzZW1ibHkgPSBTdGFnZS5vZih0aGlzKTtcbiAgICBjb25zdCBhY2NvdW50ID0gZW52LmFjY291bnQgPz8gY29udGFpbmluZ0Fzc2VtYmx5Py5hY2NvdW50ID8/IEF3cy5BQ0NPVU5UX0lEO1xuICAgIGNvbnN0IHJlZ2lvbiA9IGVudi5yZWdpb24gPz8gY29udGFpbmluZ0Fzc2VtYmx5Py5yZWdpb24gPz8gQXdzLlJFR0lPTjtcblxuICAgIC8vIHRoaXMgaXMgdGhlIFwiYXdzOi8vXCIgZW52IHNwZWNpZmljYXRpb24gdGhhdCB3aWxsIGJlIHdyaXR0ZW4gdG8gdGhlIGNsb3VkIGFzc2VtYmx5XG4gICAgLy8gbWFuaWZlc3QuIGl0IHdpbGwgdXNlIFwidW5rbm93bi1hY2NvdW50XCIgYW5kIFwidW5rbm93bi1yZWdpb25cIiB0byBpbmRpY2F0ZVxuICAgIC8vIGVudmlyb25tZW50LWFnbm9zdGljbmVzcy5cbiAgICBjb25zdCBlbnZBY2NvdW50ID0gIVRva2VuLmlzVW5yZXNvbHZlZChhY2NvdW50KSA/IGFjY291bnQgOiBjeGFwaS5VTktOT1dOX0FDQ09VTlQ7XG4gICAgY29uc3QgZW52UmVnaW9uID0gIVRva2VuLmlzVW5yZXNvbHZlZChyZWdpb24pID8gcmVnaW9uIDogY3hhcGkuVU5LTk9XTl9SRUdJT047XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWNjb3VudCxcbiAgICAgIHJlZ2lvbixcbiAgICAgIGVudmlyb25tZW50OiBjeGFwaS5FbnZpcm9ubWVudFV0aWxzLmZvcm1hdChlbnZBY2NvdW50LCBlbnZSZWdpb24pLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTWF4aW11bSBudW1iZXIgb2YgcmVzb3VyY2VzIGluIHRoZSBzdGFja1xuICAgKlxuICAgKiBTZXQgdG8gMCB0byBtZWFuIFwidW5saW1pdGVkXCIuXG4gICAqL1xuICBwcml2YXRlIGdldCBtYXhSZXNvdXJjZXMoKTogbnVtYmVyIHtcbiAgICBjb25zdCBjb250ZXh0TGltaXQgPSB0aGlzLm5vZGUudHJ5R2V0Q29udGV4dChTVEFDS19SRVNPVVJDRV9MSU1JVF9DT05URVhUKTtcbiAgICByZXR1cm4gY29udGV4dExpbWl0ICE9PSB1bmRlZmluZWQgPyBwYXJzZUludChjb250ZXh0TGltaXQsIDEwKSA6IE1BWF9SRVNPVVJDRVM7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGlzIHN0YWNrIGhhcyBhICh0cmFuc2l0aXZlKSBkZXBlbmRlbmN5IG9uIGFub3RoZXIgc3RhY2tcbiAgICpcbiAgICogUmV0dXJucyB0aGUgbGlzdCBvZiByZWFzb25zIG9uIHRoZSBkZXBlbmRlbmN5IHBhdGgsIG9yIHVuZGVmaW5lZFxuICAgKiBpZiB0aGVyZSBpcyBubyBkZXBlbmRlbmN5LlxuICAgKi9cbiAgcHJpdmF0ZSBzdGFja0RlcGVuZGVuY3lSZWFzb25zKG90aGVyOiBTdGFjayk6IFN0YWNrRGVwZW5kZW5jeVJlYXNvbltdIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcyA9PT0gb3RoZXIpIHsgcmV0dXJuIFtdOyB9XG4gICAgZm9yIChjb25zdCBkZXAgb2YgT2JqZWN0LnZhbHVlcyh0aGlzLl9zdGFja0RlcGVuZGVuY2llcykpIHtcbiAgICAgIGNvbnN0IHJldCA9IGRlcC5zdGFjay5zdGFja0RlcGVuZGVuY3lSZWFzb25zKG90aGVyKTtcbiAgICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gWy4uLmRlcC5yZWFzb25zLCAuLi5yZXRdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSB0aGUgc3RhY2sgbmFtZSBiYXNlZCBvbiB0aGUgY29uc3RydWN0IHBhdGhcbiAgICpcbiAgICogVGhlIHN0YWNrIG5hbWUgaXMgdGhlIG5hbWUgdW5kZXIgd2hpY2ggd2UnbGwgZGVwbG95IHRoZSBzdGFjayxcbiAgICogYW5kIGluY29ycG9yYXRlcyBjb250YWluaW5nIFN0YWdlIG5hbWVzIGJ5IGRlZmF1bHQuXG4gICAqXG4gICAqIEdlbmVyYWxseSB0aGlzIGxvb2tzIGEgbG90IGxpa2UgaG93IGxvZ2ljYWwgSURzIGFyZSBjYWxjdWxhdGVkLlxuICAgKiBUaGUgc3RhY2sgbmFtZSBpcyBjYWxjdWxhdGVkIGJhc2VkIG9uIHRoZSBjb25zdHJ1Y3Qgcm9vdCBwYXRoLFxuICAgKiBhcyBmb2xsb3dzOlxuICAgKlxuICAgKiAtIFBhdGggaXMgY2FsY3VsYXRlZCB3aXRoIHJlc3BlY3QgdG8gY29udGFpbmluZyBBcHAgb3IgU3RhZ2UgKGlmIGFueSlcbiAgICogLSBJZiB0aGUgcGF0aCBpcyBvbmUgY29tcG9uZW50IGxvbmcganVzdCB1c2UgdGhhdCBjb21wb25lbnQsIG90aGVyd2lzZVxuICAgKiAgIGNvbWJpbmUgdGhlbSB3aXRoIGEgaGFzaC5cbiAgICpcbiAgICogU2luY2UgdGhlIGhhc2ggaXMgcXVpdGUgdWdseSBhbmQgd2UnZCBsaWtlIHRvIGF2b2lkIGl0IGlmIHBvc3NpYmxlIC0tIGJ1dFxuICAgKiB3ZSBjYW4ndCBhbnltb3JlIGluIHRoZSBnZW5lcmFsIGNhc2Ugc2luY2UgaXQgaGFzIGJlZW4gd3JpdHRlbiBpbnRvIGxlZ2FjeVxuICAgKiBzdGFja3MuIFRoZSBpbnRyb2R1Y3Rpb24gb2YgU3RhZ2VzIG1ha2VzIGl0IHBvc3NpYmxlIHRvIG1ha2UgdGhpcyBuaWNlciBob3dldmVyLlxuICAgKiBXaGVuIGEgU3RhY2sgaXMgbmVzdGVkIGluc2lkZSBhIFN0YWdlLCB3ZSB1c2UgdGhlIHBhdGggY29tcG9uZW50cyBiZWxvdyB0aGVcbiAgICogU3RhZ2UsIGFuZCBwcmVmaXggdGhlIHBhdGggY29tcG9uZW50cyBvZiB0aGUgU3RhZ2UgYmVmb3JlIGl0LlxuICAgKi9cbiAgcHJpdmF0ZSBnZW5lcmF0ZVN0YWNrTmFtZSgpIHtcbiAgICBjb25zdCBhc3NlbWJseSA9IFN0YWdlLm9mKHRoaXMpO1xuICAgIGNvbnN0IHByZWZpeCA9IChhc3NlbWJseSAmJiBhc3NlbWJseS5zdGFnZU5hbWUpID8gYCR7YXNzZW1ibHkuc3RhZ2VOYW1lfS1gIDogJyc7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0ke3RoaXMuZ2VuZXJhdGVTdGFja0lkKGFzc2VtYmx5KX1gO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhcnRpZmFjdCBJRCBmb3IgdGhpcyBzdGFja1xuICAgKlxuICAgKiBTdGFjayBhcnRpZmFjdCBJRCBpcyB1bmlxdWUgd2l0aGluIHRoZSBBcHAncyBDbG91ZCBBc3NlbWJseS5cbiAgICovXG4gIHByaXZhdGUgZ2VuZXJhdGVTdGFja0FydGlmYWN0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVTdGFja0lkKHRoaXMubm9kZS5yb290KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhbiBJRCB3aXRoIHJlc3BlY3QgdG8gdGhlIGdpdmVuIGNvbnRhaW5lciBjb25zdHJ1Y3QuXG4gICAqL1xuICBwcml2YXRlIGdlbmVyYXRlU3RhY2tJZChjb250YWluZXI6IElDb25zdHJ1Y3QgfCB1bmRlZmluZWQpIHtcbiAgICBjb25zdCByb290UGF0aCA9IHJvb3RQYXRoVG8odGhpcywgY29udGFpbmVyKTtcbiAgICBjb25zdCBpZHMgPSByb290UGF0aC5tYXAoYyA9PiBOb2RlLm9mKGMpLmlkKTtcblxuICAgIC8vIEluIHVuaXQgdGVzdHMgb3VyIFN0YWNrICh3aGljaCBpcyB0aGUgb25seSBjb21wb25lbnQpIG1heSBub3QgaGF2ZSBhblxuICAgIC8vIGlkLCBzbyBpbiB0aGF0IGNhc2UganVzdCBwcmV0ZW5kIGl0J3MgXCJTdGFja1wiLlxuICAgIGlmIChpZHMubGVuZ3RoID09PSAxICYmICFpZHNbMF0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndW5leHBlY3RlZDogc3RhY2sgaWQgbXVzdCBhbHdheXMgYmUgZGVmaW5lZCcpO1xuICAgIH1cblxuICAgIHJldHVybiBtYWtlU3RhY2tOYW1lKGlkcyk7XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVFeHBvcnRlZFZhbHVlKGV4cG9ydGVkVmFsdWU6IGFueSk6IFJlc29sdmVkRXhwb3J0IHtcbiAgICBjb25zdCByZXNvbHZhYmxlID0gVG9rZW5pemF0aW9uLnJldmVyc2UoZXhwb3J0ZWRWYWx1ZSk7XG4gICAgaWYgKCFyZXNvbHZhYmxlIHx8ICFSZWZlcmVuY2UuaXNSZWZlcmVuY2UocmVzb2x2YWJsZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZXhwb3J0VmFsdWU6IGVpdGhlciBzdXBwbHkgXFwnbmFtZVxcJyBvciBtYWtlIHN1cmUgdG8gZXhwb3J0IGEgcmVzb3VyY2UgYXR0cmlidXRlIChsaWtlIFxcJ2J1Y2tldC5idWNrZXROYW1lXFwnKScpO1xuICAgIH1cblxuICAgIC8vIFwidGVsZXBvcnRcIiB0aGUgdmFsdWUgaGVyZSwgaW4gY2FzZSBpdCBjb21lcyBmcm9tIGEgbmVzdGVkIHN0YWNrLiBUaGlzIHdpbGwgYWxzb1xuICAgIC8vIGVuc3VyZSB0aGUgdmFsdWUgaXMgZnJvbSBvdXIgb3duIHNjb3BlLlxuICAgIGNvbnN0IGV4cG9ydGFibGUgPSBnZXRFeHBvcnRhYmxlKHRoaXMsIHJlc29sdmFibGUpO1xuXG4gICAgLy8gRW5zdXJlIGEgc2luZ2xldG9uIFwiRXhwb3J0c1wiIHNjb3BpbmcgQ29uc3RydWN0XG4gICAgLy8gVGhpcyBtb3N0bHkgZXhpc3RzIHRvIHRyaWdnZXIgTG9naWNhbElEIG11bmdpbmcsIHdoaWNoIHdvdWxkIGJlXG4gICAgLy8gZGlzYWJsZWQgaWYgd2UgcGFyZW50ZWQgY29uc3RydWN0cyBkaXJlY3RseSB1bmRlciBTdGFjay5cbiAgICAvLyBBbHNvIGl0IG5pY2VseSBwcmV2ZW50cyBsaWtlbHkgY29uc3RydWN0IG5hbWUgY2xhc2hlc1xuICAgIGNvbnN0IGV4cG9ydHNTY29wZSA9IGdldENyZWF0ZUV4cG9ydHNTY29wZSh0aGlzKTtcblxuICAgIC8vIEVuc3VyZSBhIHNpbmdsZXRvbiBDZm5PdXRwdXQgZm9yIHRoaXMgdmFsdWVcbiAgICBjb25zdCByZXNvbHZlZCA9IHRoaXMucmVzb2x2ZShleHBvcnRhYmxlKTtcbiAgICBjb25zdCBpZCA9ICdPdXRwdXQnICsgSlNPTi5zdHJpbmdpZnkocmVzb2x2ZWQpO1xuICAgIGNvbnN0IGV4cG9ydE5hbWUgPSBnZW5lcmF0ZUV4cG9ydE5hbWUoZXhwb3J0c1Njb3BlLCBpZCk7XG5cbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGV4cG9ydE5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHVucmVzb2x2ZWQgdG9rZW4gaW4gZ2VuZXJhdGVkIGV4cG9ydCBuYW1lOiAke0pTT04uc3RyaW5naWZ5KHRoaXMucmVzb2x2ZShleHBvcnROYW1lKSl9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGV4cG9ydGFibGUsXG4gICAgICBleHBvcnRzU2NvcGUsXG4gICAgICBpZCxcbiAgICAgIGV4cG9ydE5hbWUsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc3RhY2sgcmVxdWlyZXMgYnVuZGxpbmcgb3Igbm90XG4gICAqL1xuICBwdWJsaWMgZ2V0IGJ1bmRsaW5nUmVxdWlyZWQoKSB7XG4gICAgY29uc3QgYnVuZGxpbmdTdGFja3M6IHN0cmluZ1tdID0gdGhpcy5ub2RlLnRyeUdldENvbnRleHQoY3hhcGkuQlVORExJTkdfU1RBQ0tTKSA/PyBbJyoqJ107XG5cbiAgICByZXR1cm4gYnVuZGxpbmdTdGFja3Muc29tZShwYXR0ZXJuID0+IG1pbmltYXRjaChcbiAgICAgIHRoaXMubm9kZS5wYXRoLCAvLyB1c2UgdGhlIHNhbWUgdmFsdWUgZm9yIHBhdHRlcm4gbWF0Y2hpbmcgYXMgdGhlIGF3cy1jZGsgQ0xJIChkaXNwbGF5TmFtZSAvIGhpZXJhcmNoaWNhbElkKVxuICAgICAgcGF0dGVybixcbiAgICApKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtZXJnZSh0ZW1wbGF0ZTogYW55LCBmcmFnbWVudDogYW55KTogdm9pZCB7XG4gIGZvciAoY29uc3Qgc2VjdGlvbiBvZiBPYmplY3Qua2V5cyhmcmFnbWVudCkpIHtcbiAgICBjb25zdCBzcmMgPSBmcmFnbWVudFtzZWN0aW9uXTtcblxuICAgIC8vIGNyZWF0ZSB0b3AtbGV2ZWwgc2VjdGlvbiBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAgY29uc3QgZGVzdCA9IHRlbXBsYXRlW3NlY3Rpb25dO1xuICAgIGlmICghZGVzdCkge1xuICAgICAgdGVtcGxhdGVbc2VjdGlvbl0gPSBzcmM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlbXBsYXRlW3NlY3Rpb25dID0gbWVyZ2VTZWN0aW9uKHNlY3Rpb24sIGRlc3QsIHNyYyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlU2VjdGlvbihzZWN0aW9uOiBzdHJpbmcsIHZhbDE6IGFueSwgdmFsMjogYW55KTogYW55IHtcbiAgc3dpdGNoIChzZWN0aW9uKSB7XG4gICAgY2FzZSAnRGVzY3JpcHRpb24nOlxuICAgICAgcmV0dXJuIGAke3ZhbDF9XFxuJHt2YWwyfWA7XG4gICAgY2FzZSAnQVdTVGVtcGxhdGVGb3JtYXRWZXJzaW9uJzpcbiAgICAgIGlmICh2YWwxICE9IG51bGwgJiYgdmFsMiAhPSBudWxsICYmIHZhbDEgIT09IHZhbDIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb25mbGljdGluZyBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSB2ZXJzaW9ucyBwcm92aWRlZDogJyR7dmFsMX0nIGFuZCAnJHt2YWwyfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbDEgPz8gdmFsMjtcbiAgICBjYXNlICdUcmFuc2Zvcm0nOlxuICAgICAgcmV0dXJuIG1lcmdlU2V0cyh2YWwxLCB2YWwyKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG1lcmdlT2JqZWN0c1dpdGhvdXREdXBsaWNhdGVzKHNlY3Rpb24sIHZhbDEsIHZhbDIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlU2V0cyh2YWwxOiBhbnksIHZhbDI6IGFueSk6IGFueSB7XG4gIGNvbnN0IGFycmF5MSA9IHZhbDEgPT0gbnVsbCA/IFtdIDogKEFycmF5LmlzQXJyYXkodmFsMSkgPyB2YWwxIDogW3ZhbDFdKTtcbiAgY29uc3QgYXJyYXkyID0gdmFsMiA9PSBudWxsID8gW10gOiAoQXJyYXkuaXNBcnJheSh2YWwyKSA/IHZhbDIgOiBbdmFsMl0pO1xuICBmb3IgKGNvbnN0IHZhbHVlIG9mIGFycmF5Mikge1xuICAgIGlmICghYXJyYXkxLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgYXJyYXkxLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXkxLmxlbmd0aCA9PT0gMSA/IGFycmF5MVswXSA6IGFycmF5MTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VPYmplY3RzV2l0aG91dER1cGxpY2F0ZXMoc2VjdGlvbjogc3RyaW5nLCBkZXN0OiBhbnksIHNyYzogYW55KTogYW55IHtcbiAgaWYgKHR5cGVvZiBkZXN0ICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0aW5nICR7SlNPTi5zdHJpbmdpZnkoZGVzdCl9IHRvIGJlIGFuIG9iamVjdGApO1xuICB9XG4gIGlmICh0eXBlb2Ygc3JjICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0aW5nICR7SlNPTi5zdHJpbmdpZnkoc3JjKX0gdG8gYmUgYW4gb2JqZWN0YCk7XG4gIH1cblxuICAvLyBhZGQgYWxsIGVudGl0aWVzIGZyb20gc291cmNlIHNlY3Rpb24gdG8gZGVzdGluYXRpb24gc2VjdGlvblxuICBmb3IgKGNvbnN0IGlkIG9mIE9iamVjdC5rZXlzKHNyYykpIHtcbiAgICBpZiAoaWQgaW4gZGVzdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBzZWN0aW9uICcke3NlY3Rpb259JyBhbHJlYWR5IGNvbnRhaW5zICcke2lkfSdgKTtcbiAgICB9XG4gICAgZGVzdFtpZF0gPSBzcmNbaWRdO1xuICB9XG5cbiAgcmV0dXJuIGRlc3Q7XG59XG5cbi8qKlxuICogQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgb3B0aW9ucyBmb3IgYSBzdGFjay5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJVGVtcGxhdGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIEdldHMgb3Igc2V0cyB0aGUgZGVzY3JpcHRpb24gb2YgdGhpcyBzdGFjay5cbiAgICogSWYgcHJvdmlkZWQsIGl0IHdpbGwgYmUgaW5jbHVkZWQgaW4gdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlJ3MgXCJEZXNjcmlwdGlvblwiIGF0dHJpYnV0ZS5cbiAgICovXG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBHZXRzIG9yIHNldHMgdGhlIEFXU1RlbXBsYXRlRm9ybWF0VmVyc2lvbiBmaWVsZCBvZiB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuXG4gICAqL1xuICB0ZW1wbGF0ZUZvcm1hdFZlcnNpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEdldHMgb3Igc2V0cyB0aGUgdG9wLWxldmVsIHRlbXBsYXRlIHRyYW5zZm9ybSBmb3IgdGhpcyBzdGFjayAoZS5nLiBcIkFXUzo6U2VydmVybGVzcy0yMDE2LTEwLTMxXCIpLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYHRyYW5zZm9ybXNgIGluc3RlYWQuXG4gICAqL1xuICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEdldHMgb3Igc2V0cyB0aGUgdG9wLWxldmVsIHRlbXBsYXRlIHRyYW5zZm9ybShzKSBmb3IgdGhpcyBzdGFjayAoZS5nLiBgW1wiQVdTOjpTZXJ2ZXJsZXNzLTIwMTYtMTAtMzFcIl1gKS5cbiAgICovXG4gIHRyYW5zZm9ybXM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogTWV0YWRhdGEgYXNzb2NpYXRlZCB3aXRoIHRoZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZS5cbiAgICovXG4gIG1ldGFkYXRhPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcbn1cblxuLyoqXG4gKiBDb2xsZWN0IGFsbCBDZm5FbGVtZW50cyBmcm9tIGEgU3RhY2suXG4gKlxuICogQHBhcmFtIG5vZGUgUm9vdCBub2RlIHRvIGNvbGxlY3QgYWxsIENmbkVsZW1lbnRzIGZyb21cbiAqIEBwYXJhbSBpbnRvIEFycmF5IHRvIGFwcGVuZCBDZm5FbGVtZW50cyB0b1xuICogQHJldHVybnMgVGhlIHNhbWUgYXJyYXkgYXMgaXMgYmVpbmcgY29sbGVjdGVkIGludG9cbiAqL1xuZnVuY3Rpb24gY2ZuRWxlbWVudHMobm9kZTogSUNvbnN0cnVjdCwgaW50bzogQ2ZuRWxlbWVudFtdID0gW10pOiBDZm5FbGVtZW50W10ge1xuICBpZiAoQ2ZuRWxlbWVudC5pc0NmbkVsZW1lbnQobm9kZSkpIHtcbiAgICBpbnRvLnB1c2gobm9kZSk7XG4gIH1cblxuICBmb3IgKGNvbnN0IGNoaWxkIG9mIE5vZGUub2Yobm9kZSkuY2hpbGRyZW4pIHtcbiAgICAvLyBEb24ndCByZWN1cnNlIGludG8gYSBzdWJzdGFja1xuICAgIGlmIChTdGFjay5pc1N0YWNrKGNoaWxkKSkgeyBjb250aW51ZTsgfVxuXG4gICAgY2ZuRWxlbWVudHMoY2hpbGQsIGludG8pO1xuICB9XG5cbiAgcmV0dXJuIGludG87XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBjb25zdHJ1Y3Qgcm9vdCBwYXRoIG9mIHRoZSBnaXZlbiBjb25zdHJ1Y3QgcmVsYXRpdmUgdG8gdGhlIGdpdmVuIGFuY2VzdG9yXG4gKlxuICogSWYgbm8gYW5jZXN0b3IgaXMgZ2l2ZW4gb3IgdGhlIGFuY2VzdG9yIGlzIG5vdCBmb3VuZCwgcmV0dXJuIHRoZSBlbnRpcmUgcm9vdCBwYXRoLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcm9vdFBhdGhUbyhjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QsIGFuY2VzdG9yPzogSUNvbnN0cnVjdCk6IElDb25zdHJ1Y3RbXSB7XG4gIGNvbnN0IHNjb3BlcyA9IE5vZGUub2YoY29uc3RydWN0KS5zY29wZXM7XG4gIGZvciAobGV0IGkgPSBzY29wZXMubGVuZ3RoIC0gMjsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoc2NvcGVzW2ldID09PSBhbmNlc3Rvcikge1xuICAgICAgcmV0dXJuIHNjb3Blcy5zbGljZShpICsgMSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzY29wZXM7XG59XG5cbi8qKlxuICogbWFrZVVuaXF1ZUlkLCBzcGVjaWFsaXplZCBmb3IgU3RhY2sgbmFtZXNcbiAqXG4gKiBTdGFjayBuYW1lcyBtYXkgY29udGFpbiAnLScsIHNvIHdlIGFsbG93IHRoYXQgY2hhcmFjdGVyIGlmIHRoZSBzdGFjayBuYW1lXG4gKiBoYXMgb25seSBvbmUgY29tcG9uZW50LiBPdGhlcndpc2Ugd2UgZmFsbCBiYWNrIHRvIHRoZSByZWd1bGFyIFwibWFrZVVuaXF1ZUlkXCJcbiAqIGJlaGF2aW9yLlxuICovXG5mdW5jdGlvbiBtYWtlU3RhY2tOYW1lKGNvbXBvbmVudHM6IHN0cmluZ1tdKSB7XG4gIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMSkgeyByZXR1cm4gY29tcG9uZW50c1swXTsgfVxuICByZXR1cm4gbWFrZVVuaXF1ZVJlc291cmNlTmFtZShjb21wb25lbnRzLCB7IG1heExlbmd0aDogMTI4IH0pO1xufVxuXG5mdW5jdGlvbiBnZXRDcmVhdGVFeHBvcnRzU2NvcGUoc3RhY2s6IFN0YWNrKSB7XG4gIGNvbnN0IGV4cG9ydHNOYW1lID0gJ0V4cG9ydHMnO1xuICBsZXQgc3RhY2tFeHBvcnRzID0gc3RhY2subm9kZS50cnlGaW5kQ2hpbGQoZXhwb3J0c05hbWUpIGFzIENvbnN0cnVjdDtcbiAgaWYgKHN0YWNrRXhwb3J0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhY2tFeHBvcnRzID0gbmV3IENvbnN0cnVjdChzdGFjaywgZXhwb3J0c05hbWUpO1xuICB9XG5cbiAgcmV0dXJuIHN0YWNrRXhwb3J0cztcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVFeHBvcnROYW1lKHN0YWNrRXhwb3J0czogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gIGNvbnN0IHN0YWNrUmVsYXRpdmVFeHBvcnRzID0gRmVhdHVyZUZsYWdzLm9mKHN0YWNrRXhwb3J0cykuaXNFbmFibGVkKGN4YXBpLlNUQUNLX1JFTEFUSVZFX0VYUE9SVFNfQ09OVEVYVCk7XG4gIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc3RhY2tFeHBvcnRzKTtcblxuICBjb25zdCBjb21wb25lbnRzID0gW1xuICAgIC4uLnN0YWNrRXhwb3J0cy5ub2RlLnNjb3Blc1xuICAgICAgLnNsaWNlKHN0YWNrUmVsYXRpdmVFeHBvcnRzID8gc3RhY2subm9kZS5zY29wZXMubGVuZ3RoIDogMilcbiAgICAgIC5tYXAoYyA9PiBjLm5vZGUuaWQpLFxuICAgIGlkLFxuICBdO1xuICBjb25zdCBwcmVmaXggPSBzdGFjay5zdGFja05hbWUgPyBzdGFjay5zdGFja05hbWUgKyAnOicgOiAnJztcbiAgY29uc3QgbG9jYWxQYXJ0ID0gbWFrZVVuaXF1ZUlkKGNvbXBvbmVudHMpO1xuICBjb25zdCBtYXhMZW5ndGggPSAyNTU7XG4gIHJldHVybiBwcmVmaXggKyBsb2NhbFBhcnQuc2xpY2UoTWF0aC5tYXgoMCwgbG9jYWxQYXJ0Lmxlbmd0aCAtIG1heExlbmd0aCArIHByZWZpeC5sZW5ndGgpKTtcbn1cblxuaW50ZXJmYWNlIFN0YWNrRGVwZW5kZW5jeVJlYXNvbiB7XG4gIHNvdXJjZT86IEVsZW1lbnQ7XG4gIHRhcmdldD86IEVsZW1lbnQ7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgU3RhY2tEZXBlbmRlbmN5IHtcbiAgc3RhY2s6IFN0YWNrO1xuICByZWFzb25zOiBTdGFja0RlcGVuZGVuY3lSZWFzb25bXTtcbn1cblxuaW50ZXJmYWNlIFJlc29sdmVkRXhwb3J0IHtcbiAgZXhwb3J0YWJsZTogUmVmZXJlbmNlO1xuICBleHBvcnRzU2NvcGU6IENvbnN0cnVjdDtcbiAgaWQ6IHN0cmluZztcbiAgZXhwb3J0TmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHRoZSBgc3RhY2suZXhwb3J0VmFsdWUoKWAgbWV0aG9kXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0VmFsdWVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBleHBvcnQgdG8gY3JlYXRlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBuYW1lIGlzIGF1dG9tYXRpY2FsbHkgY2hvc2VuXG4gICAqL1xuICByZWFkb25seSBuYW1lPzogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBjb3VudCh4czogc3RyaW5nW10pOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+IHtcbiAgY29uc3QgcmV0OiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XG4gIGZvciAoY29uc3QgeCBvZiB4cykge1xuICAgIGlmICh4IGluIHJldCkge1xuICAgICAgcmV0W3hdICs9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldFt4XSA9IDE7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbi8vIFRoZXNlIGltcG9ydHMgaGF2ZSB0byBiZSBhdCB0aGUgZW5kIHRvIHByZXZlbnQgY2lyY3VsYXIgaW1wb3J0c1xuLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L29yZGVyICovXG5pbXBvcnQgeyBDZm5PdXRwdXQgfSBmcm9tICcuL2Nmbi1vdXRwdXQnO1xuaW1wb3J0IHsgYWRkRGVwZW5kZW5jeSwgRWxlbWVudCB9IGZyb20gJy4vZGVwcyc7XG5pbXBvcnQgeyBGaWxlU3lzdGVtIH0gZnJvbSAnLi9mcyc7XG5pbXBvcnQgeyBOYW1lcyB9IGZyb20gJy4vbmFtZXMnO1xuaW1wb3J0IHsgUmVmZXJlbmNlIH0gZnJvbSAnLi9yZWZlcmVuY2UnO1xuaW1wb3J0IHsgSVJlc29sdmFibGUgfSBmcm9tICcuL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIsIElTdGFja1N5bnRoZXNpemVyLCBJU3ludGhlc2lzU2Vzc2lvbiwgTGVnYWN5U3RhY2tTeW50aGVzaXplciwgQk9PVFNUUkFQX1FVQUxJRklFUl9DT05URVhULCBpc1JldXNhYmxlU3RhY2tTeW50aGVzaXplciB9IGZyb20gJy4vc3RhY2stc3ludGhlc2l6ZXJzJztcbmltcG9ydCB7IFN0cmluZ1NwZWNpYWxpemVyIH0gZnJvbSAnLi9zdGFjay1zeW50aGVzaXplcnMvX3NoYXJlZCc7XG5pbXBvcnQgeyBTdGFnZSB9IGZyb20gJy4vc3RhZ2UnO1xuaW1wb3J0IHsgSVRhZ2dhYmxlLCBUYWdNYW5hZ2VyIH0gZnJvbSAnLi90YWctbWFuYWdlcic7XG5pbXBvcnQgeyBUb2tlbiwgVG9rZW5pemF0aW9uIH0gZnJvbSAnLi90b2tlbic7XG5pbXBvcnQgeyBnZXRFeHBvcnRhYmxlIH0gZnJvbSAnLi9wcml2YXRlL3JlZnMnO1xuaW1wb3J0IHsgRmFjdCwgUmVnaW9uSW5mbyB9IGZyb20gJ0Bhd3MtY2RrL3JlZ2lvbi1pbmZvJztcbmltcG9ydCB7IGRlcGxveVRpbWVMb29rdXAgfSBmcm9tICcuL3ByaXZhdGUvcmVnaW9uLWxvb2t1cCc7XG5pbXBvcnQgeyBtYWtlVW5pcXVlUmVzb3VyY2VOYW1lIH0gZnJvbSAnLi9wcml2YXRlL3VuaXF1ZS1yZXNvdXJjZS1uYW1lJztpbXBvcnQgeyBQUklWQVRFX0NPTlRFWFRfREVGQVVMVF9TVEFDS19TWU5USEVTSVpFUiB9IGZyb20gJy4vcHJpdmF0ZS9wcml2YXRlLWNvbnRleHQnO1xuLyogZXNsaW50LWVuYWJsZSBpbXBvcnQvb3JkZXIgKi9cbiJdfQ==