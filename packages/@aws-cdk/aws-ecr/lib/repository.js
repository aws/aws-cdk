"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryEncryption = exports.TagMutability = exports.Repository = exports.RepositoryBase = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const os_1 = require("os");
const events = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const ecr_generated_1 = require("./ecr.generated");
const lifecycle_1 = require("./lifecycle");
/**
 * Base class for ECR repository. Reused between imported repositories and owned repositories.
 */
class RepositoryBase extends core_1.Resource {
    /**
     * The URI of this repository (represents the latest image):
     *
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY
     *
     */
    get repositoryUri() {
        return this.repositoryUriForTag();
    }
    /**
     * Returns the URL of the repository. Can be used in `docker push/pull`.
     *
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[:TAG]
     *
     * @param tag Optional image tag
     */
    repositoryUriForTag(tag) {
        const tagSuffix = tag ? `:${tag}` : '';
        return this.repositoryUriWithSuffix(tagSuffix);
    }
    /**
     * Returns the URL of the repository. Can be used in `docker push/pull`.
     *
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[@DIGEST]
     *
     * @param digest Optional image digest
     */
    repositoryUriForDigest(digest) {
        const digestSuffix = digest ? `@${digest}` : '';
        return this.repositoryUriWithSuffix(digestSuffix);
    }
    /**
     * Returns the URL of the repository. Can be used in `docker push/pull`.
     *
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[:TAG]
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[@DIGEST]
     *
     * @param tagOrDigest Optional image tag or digest (digests must start with `sha256:`)
     */
    repositoryUriForTagOrDigest(tagOrDigest) {
        if (tagOrDigest?.startsWith('sha256:')) {
            return this.repositoryUriForDigest(tagOrDigest);
        }
        else {
            return this.repositoryUriForTag(tagOrDigest);
        }
    }
    /**
     * Returns the repository URI, with an appended suffix, if provided.
     * @param suffix An image tag or an image digest.
     * @private
     */
    repositoryUriWithSuffix(suffix) {
        const parts = this.stack.splitArn(this.repositoryArn, core_1.ArnFormat.SLASH_RESOURCE_NAME);
        return `${parts.account}.dkr.ecr.${parts.region}.${this.stack.urlSuffix}/${this.repositoryName}${suffix}`;
    }
    /**
     * Define a CloudWatch event that triggers when something happens to this repository
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailEvent(id, options = {}) {
        const rule = new events.Rule(this, id, options);
        rule.addTarget(options.target);
        rule.addEventPattern({
            source: ['aws.ecr'],
            detailType: ['AWS API Call via CloudTrail'],
            detail: {
                requestParameters: {
                    repositoryName: [this.repositoryName],
                },
            },
        });
        return rule;
    }
    /**
     * Defines an AWS CloudWatch event rule that can trigger a target when an image is pushed to this
     * repository.
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailImagePushed(id, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecr_OnCloudTrailImagePushedOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.onCloudTrailImagePushed);
            }
            throw error;
        }
        const rule = this.onCloudTrailEvent(id, options);
        rule.addEventPattern({
            detail: {
                eventName: ['PutImage'],
                requestParameters: {
                    imageTag: options.imageTag ? [options.imageTag] : undefined,
                },
            },
        });
        return rule;
    }
    /**
     * Defines an AWS CloudWatch event rule that can trigger a target when an image scan is completed
     *
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onImageScanCompleted(id, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecr_OnImageScanCompletedOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.onImageScanCompleted);
            }
            throw error;
        }
        const rule = new events.Rule(this, id, options);
        rule.addTarget(options.target);
        rule.addEventPattern({
            source: ['aws.ecr'],
            detailType: ['ECR Image Scan'],
            detail: {
                'repository-name': [this.repositoryName],
                'scan-status': ['COMPLETE'],
                'image-tags': options.imageTags ?? undefined,
            },
        });
        return rule;
    }
    /**
     * Defines a CloudWatch event rule which triggers for repository events. Use
     * `rule.addEventPattern(pattern)` to specify a filter.
     */
    onEvent(id, options = {}) {
        const rule = new events.Rule(this, id, options);
        rule.addEventPattern({
            source: ['aws.ecr'],
            resources: [this.repositoryArn],
        });
        rule.addTarget(options.target);
        return rule;
    }
    /**
     * Grant the given principal identity permissions to perform the actions on this repository
     */
    grant(grantee, ...actions) {
        const crossAccountPrincipal = this.unsafeCrossAccountResourcePolicyPrincipal(grantee);
        if (crossAccountPrincipal) {
            // If the principal is from a different account,
            // that means addToPrincipalOrResource() will update the Resource Policy of this repo to trust that principal.
            // However, ECR verifies that the principal used in the Policy exists,
            // and will error out if it doesn't.
            // Because of that, if the principal is a newly created resource,
            // and there is not a dependency relationship between the Stacks of this repo and the principal,
            // trust the entire account of the principal instead
            // (otherwise, deploying this repo will fail).
            // To scope down the permissions as much as possible,
            // only trust principals from that account with a specific tag
            const crossAccountPrincipalStack = core_1.Stack.of(crossAccountPrincipal);
            const roleTag = `${crossAccountPrincipalStack.stackName}_${crossAccountPrincipal.node.addr}`;
            core_1.Tags.of(crossAccountPrincipal).add('aws-cdk:id', roleTag);
            this.addToResourcePolicy(new iam.PolicyStatement({
                actions,
                principals: [new iam.AccountPrincipal(crossAccountPrincipalStack.account)],
                conditions: {
                    StringEquals: { 'aws:PrincipalTag/aws-cdk:id': roleTag },
                },
            }));
            return iam.Grant.addToPrincipal({
                grantee,
                actions,
                resourceArns: [this.repositoryArn],
                scope: this,
            });
        }
        else {
            return iam.Grant.addToPrincipalOrResource({
                grantee,
                actions,
                resourceArns: [this.repositoryArn],
                resourceSelfArns: [],
                resource: this,
            });
        }
    }
    /**
     * Grant the given identity permissions to use the images in this repository
     */
    grantPull(grantee) {
        const ret = this.grant(grantee, 'ecr:BatchCheckLayerAvailability', 'ecr:GetDownloadUrlForLayer', 'ecr:BatchGetImage');
        iam.Grant.addToPrincipal({
            grantee,
            actions: ['ecr:GetAuthorizationToken'],
            resourceArns: ['*'],
            scope: this,
        });
        return ret;
    }
    /**
     * Grant the given identity permissions to pull and push images to this repository.
     */
    grantPullPush(grantee) {
        this.grantPull(grantee);
        return this.grant(grantee, 'ecr:PutImage', 'ecr:InitiateLayerUpload', 'ecr:UploadLayerPart', 'ecr:CompleteLayerUpload');
    }
    /**
     * Returns the resource that backs the given IAM grantee if we cannot put a direct reference
     * to the grantee in the resource policy of this ECR repository,
     * and 'undefined' in case we can.
     */
    unsafeCrossAccountResourcePolicyPrincipal(grantee) {
        // A principal cannot be safely added to the Resource Policy of this ECR repository, if:
        // 1. The principal is from a different account, and
        // 2. The principal is a new resource (meaning, not just referenced), and
        // 3. The Stack this repo belongs to doesn't depend on the Stack the principal belongs to.
        // condition #1
        const principal = grantee.grantPrincipal;
        const principalAccount = principal.principalAccount;
        if (!principalAccount) {
            return undefined;
        }
        const repoAndPrincipalAccountCompare = core_1.Token.compareStrings(this.env.account, principalAccount);
        if (repoAndPrincipalAccountCompare === core_1.TokenComparison.BOTH_UNRESOLVED ||
            repoAndPrincipalAccountCompare === core_1.TokenComparison.SAME) {
            return undefined;
        }
        // condition #2
        if (!iam.principalIsOwnedResource(principal)) {
            return undefined;
        }
        // condition #3
        const principalStack = core_1.Stack.of(principal);
        if (this.stack.dependencies.includes(principalStack)) {
            return undefined;
        }
        return principal;
    }
}
exports.RepositoryBase = RepositoryBase;
_a = JSII_RTTI_SYMBOL_1;
RepositoryBase[_a] = { fqn: "@aws-cdk/aws-ecr.RepositoryBase", version: "0.0.0" };
/**
 * Define an ECR repository
 */
class Repository extends RepositoryBase {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.repositoryName,
        });
        this.lifecycleRules = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecr_RepositoryProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Repository);
            }
            throw error;
        }
        Repository.validateRepositoryName(this.physicalName);
        const resource = new ecr_generated_1.CfnRepository(this, 'Resource', {
            repositoryName: this.physicalName,
            // It says "Text", but they actually mean "Object".
            repositoryPolicyText: core_1.Lazy.any({ produce: () => this.policyDocument }),
            lifecyclePolicy: core_1.Lazy.any({ produce: () => this.renderLifecyclePolicy() }),
            imageScanningConfiguration: props.imageScanOnPush !== undefined ? { scanOnPush: props.imageScanOnPush } : undefined,
            imageTagMutability: props.imageTagMutability || undefined,
            encryptionConfiguration: this.parseEncryption(props),
        });
        resource.applyRemovalPolicy(props.removalPolicy);
        this.registryId = props.lifecycleRegistryId;
        if (props.lifecycleRules) {
            props.lifecycleRules.forEach(this.addLifecycleRule.bind(this));
        }
        this.repositoryName = this.getResourceNameAttribute(resource.ref);
        this.repositoryArn = this.getResourceArnAttribute(resource.attrArn, {
            service: 'ecr',
            resource: 'repository',
            resourceName: this.physicalName,
        });
        this.node.addValidation({ validate: () => this.policyDocument?.validateForResourcePolicy() ?? [] });
    }
    /**
     * Import a repository
     */
    static fromRepositoryAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecr_RepositoryAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromRepositoryAttributes);
            }
            throw error;
        }
        class Import extends RepositoryBase {
            constructor() {
                super(...arguments);
                this.repositoryName = attrs.repositoryName;
                this.repositoryArn = attrs.repositoryArn;
            }
            addToResourcePolicy(_statement) {
                // dropped
                return { statementAdded: false };
            }
        }
        return new Import(scope, id);
    }
    static fromRepositoryArn(scope, id, repositoryArn) {
        // if repositoryArn is a token, the repository name is also required. this is because
        // repository names can include "/" (e.g. foo/bar/myrepo) and it is impossible to
        // parse the name from an ARN using CloudFormation's split/select.
        if (core_1.Token.isUnresolved(repositoryArn)) {
            throw new Error('"repositoryArn" is a late-bound value, and therefore "repositoryName" is required. Use `fromRepositoryAttributes` instead');
        }
        const repositoryName = repositoryArn.split('/').slice(1).join('/');
        class Import extends RepositoryBase {
            constructor() {
                super(...arguments);
                this.repositoryName = repositoryName;
                this.repositoryArn = repositoryArn;
            }
            addToResourcePolicy(_statement) {
                // dropped
                return { statementAdded: false };
            }
        }
        return new Import(scope, id, {
            environmentFromArn: repositoryArn,
        });
    }
    static fromRepositoryName(scope, id, repositoryName) {
        class Import extends RepositoryBase {
            constructor() {
                super(...arguments);
                this.repositoryName = repositoryName;
                this.repositoryArn = Repository.arnForLocalRepository(repositoryName, scope);
            }
            addToResourcePolicy(_statement) {
                // dropped
                return { statementAdded: false };
            }
        }
        return new Import(scope, id);
    }
    /**
     * Returns an ECR ARN for a repository that resides in the same account/region
     * as the current stack.
     */
    static arnForLocalRepository(repositoryName, scope, account) {
        return core_1.Stack.of(scope).formatArn({
            account,
            service: 'ecr',
            resource: 'repository',
            resourceName: repositoryName,
        });
    }
    static validateRepositoryName(physicalName) {
        const repositoryName = physicalName;
        if (!repositoryName || core_1.Token.isUnresolved(repositoryName)) {
            // the name is a late-bound value, not a defined string,
            // so skip validation
            return;
        }
        const errors = [];
        // Rules codified from https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html
        if (repositoryName.length < 2 || repositoryName.length > 256) {
            errors.push('Repository name must be at least 2 and no more than 256 characters');
        }
        const isPatternMatch = /^(?:[a-z0-9]+(?:[._-][a-z0-9]+)*\/)*[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(repositoryName);
        if (!isPatternMatch) {
            errors.push('Repository name must follow the specified pattern: (?:[a-z0-9]+(?:[._-][a-z0-9]+)*/)*[a-z0-9]+(?:[._-][a-z0-9]+)*');
        }
        if (errors.length > 0) {
            throw new Error(`Invalid ECR repository name (value: ${repositoryName})${os_1.EOL}${errors.join(os_1.EOL)}`);
        }
    }
    addToResourcePolicy(statement) {
        if (this.policyDocument === undefined) {
            this.policyDocument = new iam.PolicyDocument();
        }
        this.policyDocument.addStatements(statement);
        return { statementAdded: true, policyDependable: this.policyDocument };
    }
    /**
     * Add a life cycle rule to the repository
     *
     * Life cycle rules automatically expire images from the repository that match
     * certain conditions.
     */
    addLifecycleRule(rule) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecr_LifecycleRule(rule);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addLifecycleRule);
            }
            throw error;
        }
        // Validate rule here so users get errors at the expected location
        if (rule.tagStatus === undefined) {
            rule = { ...rule, tagStatus: rule.tagPrefixList === undefined ? lifecycle_1.TagStatus.ANY : lifecycle_1.TagStatus.TAGGED };
        }
        if (rule.tagStatus === lifecycle_1.TagStatus.TAGGED && (rule.tagPrefixList === undefined || rule.tagPrefixList.length === 0)) {
            throw new Error('TagStatus.Tagged requires the specification of a tagPrefixList');
        }
        if (rule.tagStatus !== lifecycle_1.TagStatus.TAGGED && rule.tagPrefixList !== undefined) {
            throw new Error('tagPrefixList can only be specified when tagStatus is set to Tagged');
        }
        if ((rule.maxImageAge !== undefined) === (rule.maxImageCount !== undefined)) {
            throw new Error(`Life cycle rule must contain exactly one of 'maxImageAge' and 'maxImageCount', got: ${JSON.stringify(rule)}`);
        }
        if (rule.tagStatus === lifecycle_1.TagStatus.ANY && this.lifecycleRules.filter(r => r.tagStatus === lifecycle_1.TagStatus.ANY).length > 0) {
            throw new Error('Life cycle can only have one TagStatus.Any rule');
        }
        this.lifecycleRules.push({ ...rule });
    }
    /**
     * Render the life cycle policy object
     */
    renderLifecyclePolicy() {
        const stack = core_1.Stack.of(this);
        let lifecyclePolicyText;
        if (this.lifecycleRules.length === 0 && !this.registryId) {
            return undefined;
        }
        if (this.lifecycleRules.length > 0) {
            lifecyclePolicyText = JSON.stringify(stack.resolve({
                rules: this.orderedLifecycleRules().map(renderLifecycleRule),
            }));
        }
        return {
            lifecyclePolicyText,
            registryId: this.registryId,
        };
    }
    /**
     * Return life cycle rules with automatic ordering applied.
     *
     * Also applies validation of the 'any' rule.
     */
    orderedLifecycleRules() {
        if (this.lifecycleRules.length === 0) {
            return [];
        }
        const prioritizedRules = this.lifecycleRules.filter(r => r.rulePriority !== undefined && r.tagStatus !== lifecycle_1.TagStatus.ANY);
        const autoPrioritizedRules = this.lifecycleRules.filter(r => r.rulePriority === undefined && r.tagStatus !== lifecycle_1.TagStatus.ANY);
        const anyRules = this.lifecycleRules.filter(r => r.tagStatus === lifecycle_1.TagStatus.ANY);
        if (anyRules.length > 0 && anyRules[0].rulePriority !== undefined && autoPrioritizedRules.length > 0) {
            // Supporting this is too complex for very little value. We just prohibit it.
            throw new Error("Cannot combine prioritized TagStatus.Any rule with unprioritized rules. Remove rulePriority from the 'Any' rule.");
        }
        const prios = prioritizedRules.map(r => r.rulePriority);
        let autoPrio = (prios.length > 0 ? Math.max(...prios) : 0) + 1;
        const ret = new Array();
        for (const rule of prioritizedRules.concat(autoPrioritizedRules).concat(anyRules)) {
            ret.push({
                ...rule,
                rulePriority: rule.rulePriority ?? autoPrio++,
            });
        }
        // Do validation on the final array--might still be wrong because the user supplied all prios, but incorrectly.
        validateAnyRuleLast(ret);
        return ret;
    }
    /**
     * Set up key properties and return the Repository encryption property from the
     * user's configuration.
     */
    parseEncryption(props) {
        // default based on whether encryptionKey is specified
        const encryptionType = props.encryption ?? (props.encryptionKey ? RepositoryEncryption.KMS : RepositoryEncryption.AES_256);
        // if encryption key is set, encryption must be set to KMS.
        if (encryptionType !== RepositoryEncryption.KMS && props.encryptionKey) {
            throw new Error(`encryptionKey is specified, so 'encryption' must be set to KMS (value: ${encryptionType.value})`);
        }
        if (encryptionType === RepositoryEncryption.AES_256) {
            return undefined;
        }
        if (encryptionType === RepositoryEncryption.KMS) {
            return {
                encryptionType: 'KMS',
                kmsKey: props.encryptionKey?.keyArn,
            };
        }
        throw new Error(`Unexpected 'encryptionType': ${encryptionType}`);
    }
}
exports.Repository = Repository;
_b = JSII_RTTI_SYMBOL_1;
Repository[_b] = { fqn: "@aws-cdk/aws-ecr.Repository", version: "0.0.0" };
function validateAnyRuleLast(rules) {
    const anyRules = rules.filter(r => r.tagStatus === lifecycle_1.TagStatus.ANY);
    if (anyRules.length === 1) {
        const maxPrio = Math.max(...rules.map(r => r.rulePriority));
        if (anyRules[0].rulePriority !== maxPrio) {
            throw new Error(`TagStatus.Any rule must have highest priority, has ${anyRules[0].rulePriority} which is smaller than ${maxPrio}`);
        }
    }
}
/**
 * Render the lifecycle rule to JSON
 */
function renderLifecycleRule(rule) {
    return {
        rulePriority: rule.rulePriority,
        description: rule.description,
        selection: {
            tagStatus: rule.tagStatus || lifecycle_1.TagStatus.ANY,
            tagPrefixList: rule.tagPrefixList,
            countType: rule.maxImageAge !== undefined ? "sinceImagePushed" /* SINCE_IMAGE_PUSHED */ : "imageCountMoreThan" /* IMAGE_COUNT_MORE_THAN */,
            countNumber: rule.maxImageAge?.toDays() ?? rule.maxImageCount,
            countUnit: rule.maxImageAge !== undefined ? 'days' : undefined,
        },
        action: {
            type: 'expire',
        },
    };
}
/**
 * The tag mutability setting for your repository.
 */
var TagMutability;
(function (TagMutability) {
    /**
     * allow image tags to be overwritten.
     */
    TagMutability["MUTABLE"] = "MUTABLE";
    /**
     * all image tags within the repository will be immutable which will prevent them from being overwritten.
     */
    TagMutability["IMMUTABLE"] = "IMMUTABLE";
})(TagMutability = exports.TagMutability || (exports.TagMutability = {}));
/**
 * Indicates whether server-side encryption is enabled for the object, and whether that encryption is
 * from the AWS Key Management Service (AWS KMS) or from Amazon S3 managed encryption (SSE-S3).
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
 */
class RepositoryEncryption {
    /**
     * @param value the string value of the encryption
     */
    constructor(value) {
        this.value = value;
    }
}
exports.RepositoryEncryption = RepositoryEncryption;
_c = JSII_RTTI_SYMBOL_1;
RepositoryEncryption[_c] = { fqn: "@aws-cdk/aws-ecr.RepositoryEncryption", version: "0.0.0" };
/**
 * 'AES256'
 */
RepositoryEncryption.AES_256 = new RepositoryEncryption('AES256');
/**
 * 'KMS'
 */
RepositoryEncryption.KMS = new RepositoryEncryption('KMS');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3NpdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMkJBQXlCO0FBQ3pCLDhDQUE4QztBQUM5Qyx3Q0FBd0M7QUFFeEMsd0NBQXlIO0FBRXpILG1EQUFnRDtBQUNoRCwyQ0FBdUQ7QUFrSHZEOztHQUVHO0FBQ0gsTUFBc0IsY0FBZSxTQUFRLGVBQVE7SUFnQm5EOzs7OztPQUtHO0lBQ0gsSUFBVyxhQUFhO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7S0FDbkM7SUFFRDs7Ozs7O09BTUc7SUFDSSxtQkFBbUIsQ0FBQyxHQUFZO1FBQ3JDLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ2hEO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksc0JBQXNCLENBQUMsTUFBZTtRQUMzQyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNoRCxPQUFPLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUNuRDtJQUVEOzs7Ozs7O09BT0c7SUFDSSwyQkFBMkIsQ0FBQyxXQUFvQjtRQUNyRCxJQUFJLFdBQVcsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDdEMsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDakQ7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQzlDO0tBQ0Y7SUFFRDs7OztPQUlHO0lBQ0ssdUJBQXVCLENBQUMsTUFBZTtRQUM3QyxNQUFNLEtBQUssR0FB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Q2pDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxLQUFLLFNBQVMsQ0FBQyxDQUFDLDZDQUE4QixDQUFDLGlEQUFnQztZQUMxRyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxJQUFJLENBQUMsYUFBYTtZQUM3RCxTQUFTLEVBQUUsSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUztTQUMvRDtRQUNELE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxRQUFRO1NBQ2Y7S0FDRixDQUFDO0FBQ0osQ0FBQztBQWlCRDs7R0FFRztBQUNILElBQVksYUFXWDtBQVhELFdBQVksYUFBYTtJQUN2Qjs7T0FFRztJQUNILG9DQUFtQixDQUFBO0lBRW5COztPQUVHO0lBQ0gsd0NBQXVCLENBQUE7QUFFekIsQ0FBQyxFQVhXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBV3hCO0FBRUQ7Ozs7R0FJRztBQUNILE1BQWEsb0JBQW9CO0lBVS9COztPQUVHO0lBQ0gsWUFBc0MsS0FBYTtRQUFiLFVBQUssR0FBTCxLQUFLLENBQVE7S0FBSzs7QUFiMUQsb0RBY0M7OztBQWJDOztHQUVHO0FBQ29CLDRCQUFPLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwRTs7R0FFRztBQUNvQix3QkFBRyxHQUFHLElBQUksb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFT0wgfSBmcm9tICdvcyc7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSAnQGF3cy1jZGsvYXdzLWV2ZW50cyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgeyBBcm5Gb3JtYXQsIElSZXNvdXJjZSwgTGF6eSwgUmVtb3ZhbFBvbGljeSwgUmVzb3VyY2UsIFN0YWNrLCBUYWdzLCBUb2tlbiwgVG9rZW5Db21wYXJpc29uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJQ29uc3RydWN0LCBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmblJlcG9zaXRvcnkgfSBmcm9tICcuL2Vjci5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlUnVsZSwgVGFnU3RhdHVzIH0gZnJvbSAnLi9saWZlY3ljbGUnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gRUNSIHJlcG9zaXRvcnkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVJlcG9zaXRvcnkgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHJlcG9zaXRvcnlcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVwb3NpdG9yeU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgcmVwb3NpdG9yeVxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSByZXBvc2l0b3J5QXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBVUkkgb2YgdGhpcyByZXBvc2l0b3J5IChyZXByZXNlbnRzIHRoZSBsYXRlc3QgaW1hZ2UpOlxuICAgKlxuICAgKiAgICBBQ0NPVU5ULmRrci5lY3IuUkVHSU9OLmFtYXpvbmF3cy5jb20vUkVQT1NJVE9SWVxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSByZXBvc2l0b3J5VXJpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIFVSSSBvZiB0aGUgcmVwb3NpdG9yeSBmb3IgYSBjZXJ0YWluIHRhZy4gQ2FuIGJlIHVzZWQgaW4gYGRvY2tlciBwdXNoL3B1bGxgLlxuICAgKlxuICAgKiAgICBBQ0NPVU5ULmRrci5lY3IuUkVHSU9OLmFtYXpvbmF3cy5jb20vUkVQT1NJVE9SWVs6VEFHXVxuICAgKlxuICAgKiBAcGFyYW0gdGFnIEltYWdlIHRhZyB0byB1c2UgKHRvb2xzIHVzdWFsbHkgZGVmYXVsdCB0byBcImxhdGVzdFwiIGlmIG9taXR0ZWQpXG4gICAqL1xuICByZXBvc2l0b3J5VXJpRm9yVGFnKHRhZz86IHN0cmluZyk6IHN0cmluZztcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgVVJJIG9mIHRoZSByZXBvc2l0b3J5IGZvciBhIGNlcnRhaW4gZGlnZXN0LiBDYW4gYmUgdXNlZCBpbiBgZG9ja2VyIHB1c2gvcHVsbGAuXG4gICAqXG4gICAqICAgIEFDQ09VTlQuZGtyLmVjci5SRUdJT04uYW1hem9uYXdzLmNvbS9SRVBPU0lUT1JZW0BESUdFU1RdXG4gICAqXG4gICAqIEBwYXJhbSBkaWdlc3QgSW1hZ2UgZGlnZXN0IHRvIHVzZSAodG9vbHMgdXN1YWxseSBkZWZhdWx0IHRvIHRoZSBpbWFnZSB3aXRoIHRoZSBcImxhdGVzdFwiIHRhZyBpZiBvbWl0dGVkKVxuICAgKi9cbiAgcmVwb3NpdG9yeVVyaUZvckRpZ2VzdChkaWdlc3Q/OiBzdHJpbmcpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIFVSSSBvZiB0aGUgcmVwb3NpdG9yeSBmb3IgYSBjZXJ0YWluIHRhZyBvciBkaWdlc3QsIGluZmVycmluZyBiYXNlZCBvbiB0aGUgc3ludGF4IG9mIHRoZSB0YWcuIENhbiBiZSB1c2VkIGluIGBkb2NrZXIgcHVzaC9wdWxsYC5cbiAgICpcbiAgICogICAgQUNDT1VOVC5ka3IuZWNyLlJFR0lPTi5hbWF6b25hd3MuY29tL1JFUE9TSVRPUllbOlRBR11cbiAgICogICAgQUNDT1VOVC5ka3IuZWNyLlJFR0lPTi5hbWF6b25hd3MuY29tL1JFUE9TSVRPUllbQERJR0VTVF1cbiAgICpcbiAgICogQHBhcmFtIHRhZ09yRGlnZXN0IEltYWdlIHRhZyBvciBkaWdlc3QgdG8gdXNlICh0b29scyB1c3VhbGx5IGRlZmF1bHQgdG8gdGhlIGltYWdlIHdpdGggdGhlIFwibGF0ZXN0XCIgdGFnIGlmIG9taXR0ZWQpXG4gICAqL1xuICByZXBvc2l0b3J5VXJpRm9yVGFnT3JEaWdlc3QodGFnT3JEaWdlc3Q/OiBzdHJpbmcpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFkZCBhIHBvbGljeSBzdGF0ZW1lbnQgdG8gdGhlIHJlcG9zaXRvcnkncyByZXNvdXJjZSBwb2xpY3lcbiAgICovXG4gIGFkZFRvUmVzb3VyY2VQb2xpY3koc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KTogaWFtLkFkZFRvUmVzb3VyY2VQb2xpY3lSZXN1bHQ7XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBwcmluY2lwYWwgaWRlbnRpdHkgcGVybWlzc2lvbnMgdG8gcGVyZm9ybSB0aGUgYWN0aW9ucyBvbiB0aGlzIHJlcG9zaXRvcnlcbiAgICovXG4gIGdyYW50KGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlLCAuLi5hY3Rpb25zOiBzdHJpbmdbXSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IHBlcm1pc3Npb25zIHRvIHB1bGwgaW1hZ2VzIGluIHRoaXMgcmVwb3NpdG9yeS5cbiAgICovXG4gIGdyYW50UHVsbChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IHBlcm1pc3Npb25zIHRvIHB1bGwgYW5kIHB1c2ggaW1hZ2VzIHRvIHRoaXMgcmVwb3NpdG9yeS5cbiAgICovXG4gIGdyYW50UHVsbFB1c2goZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIERlZmluZSBhIENsb3VkV2F0Y2ggZXZlbnQgdGhhdCB0cmlnZ2VycyB3aGVuIHNvbWV0aGluZyBoYXBwZW5zIHRvIHRoaXMgcmVwb3NpdG9yeVxuICAgKlxuICAgKiBSZXF1aXJlcyB0aGF0IHRoZXJlIGV4aXN0cyBhdCBsZWFzdCBvbmUgQ2xvdWRUcmFpbCBUcmFpbCBpbiB5b3VyIGFjY291bnRcbiAgICogdGhhdCBjYXB0dXJlcyB0aGUgZXZlbnQuIFRoaXMgbWV0aG9kIHdpbGwgbm90IGNyZWF0ZSB0aGUgVHJhaWwuXG4gICAqXG4gICAqIEBwYXJhbSBpZCBUaGUgaWQgb2YgdGhlIHJ1bGVcbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgYWRkaW5nIHRoZSBydWxlXG4gICAqL1xuICBvbkNsb3VkVHJhaWxFdmVudChpZDogc3RyaW5nLCBvcHRpb25zPzogZXZlbnRzLk9uRXZlbnRPcHRpb25zKTogZXZlbnRzLlJ1bGU7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYW4gQVdTIENsb3VkV2F0Y2ggZXZlbnQgcnVsZSB0aGF0IGNhbiB0cmlnZ2VyIGEgdGFyZ2V0IHdoZW4gYW4gaW1hZ2UgaXMgcHVzaGVkIHRvIHRoaXNcbiAgICogcmVwb3NpdG9yeS5cbiAgICpcbiAgICogUmVxdWlyZXMgdGhhdCB0aGVyZSBleGlzdHMgYXQgbGVhc3Qgb25lIENsb3VkVHJhaWwgVHJhaWwgaW4geW91ciBhY2NvdW50XG4gICAqIHRoYXQgY2FwdHVyZXMgdGhlIGV2ZW50LiBUaGlzIG1ldGhvZCB3aWxsIG5vdCBjcmVhdGUgdGhlIFRyYWlsLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIGlkIG9mIHRoZSBydWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGFkZGluZyB0aGUgcnVsZVxuICAgKi9cbiAgb25DbG91ZFRyYWlsSW1hZ2VQdXNoZWQoaWQ6IHN0cmluZywgb3B0aW9ucz86IE9uQ2xvdWRUcmFpbEltYWdlUHVzaGVkT3B0aW9ucyk6IGV2ZW50cy5SdWxlO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGFuIEFXUyBDbG91ZFdhdGNoIGV2ZW50IHJ1bGUgdGhhdCBjYW4gdHJpZ2dlciBhIHRhcmdldCB3aGVuIHRoZSBpbWFnZSBzY2FuIGlzIGNvbXBsZXRlZFxuICAgKlxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIGlkIG9mIHRoZSBydWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGFkZGluZyB0aGUgcnVsZVxuICAgKi9cbiAgb25JbWFnZVNjYW5Db21wbGV0ZWQoaWQ6IHN0cmluZywgb3B0aW9ucz86IE9uSW1hZ2VTY2FuQ29tcGxldGVkT3B0aW9ucyk6IGV2ZW50cy5SdWxlO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ2xvdWRXYXRjaCBldmVudCBydWxlIHdoaWNoIHRyaWdnZXJzIGZvciByZXBvc2l0b3J5IGV2ZW50cy4gVXNlXG4gICAqIGBydWxlLmFkZEV2ZW50UGF0dGVybihwYXR0ZXJuKWAgdG8gc3BlY2lmeSBhIGZpbHRlci5cbiAgICovXG4gIG9uRXZlbnQoaWQ6IHN0cmluZywgb3B0aW9ucz86IGV2ZW50cy5PbkV2ZW50T3B0aW9ucyk6IGV2ZW50cy5SdWxlO1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIEVDUiByZXBvc2l0b3J5LiBSZXVzZWQgYmV0d2VlbiBpbXBvcnRlZCByZXBvc2l0b3JpZXMgYW5kIG93bmVkIHJlcG9zaXRvcmllcy5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlcG9zaXRvcnlCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJUmVwb3NpdG9yeSB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgcmVwb3NpdG9yeVxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIHJlcG9zaXRvcnlcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSByZXBvc2l0b3J5QXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFkZCBhIHBvbGljeSBzdGF0ZW1lbnQgdG8gdGhlIHJlcG9zaXRvcnkncyByZXNvdXJjZSBwb2xpY3lcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBhZGRUb1Jlc291cmNlUG9saWN5KHN0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudCk6IGlhbS5BZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0O1xuXG4gIC8qKlxuICAgKiBUaGUgVVJJIG9mIHRoaXMgcmVwb3NpdG9yeSAocmVwcmVzZW50cyB0aGUgbGF0ZXN0IGltYWdlKTpcbiAgICpcbiAgICogICAgQUNDT1VOVC5ka3IuZWNyLlJFR0lPTi5hbWF6b25hd3MuY29tL1JFUE9TSVRPUllcbiAgICpcbiAgICovXG4gIHB1YmxpYyBnZXQgcmVwb3NpdG9yeVVyaSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXBvc2l0b3J5VXJpRm9yVGFnKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgVVJMIG9mIHRoZSByZXBvc2l0b3J5LiBDYW4gYmUgdXNlZCBpbiBgZG9ja2VyIHB1c2gvcHVsbGAuXG4gICAqXG4gICAqICAgIEFDQ09VTlQuZGtyLmVjci5SRUdJT04uYW1hem9uYXdzLmNvbS9SRVBPU0lUT1JZWzpUQUddXG4gICAqXG4gICAqIEBwYXJhbSB0YWcgT3B0aW9uYWwgaW1hZ2UgdGFnXG4gICAqL1xuICBwdWJsaWMgcmVwb3NpdG9yeVVyaUZvclRhZyh0YWc/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHRhZ1N1ZmZpeCA9IHRhZyA/IGA6JHt0YWd9YCA6ICcnO1xuICAgIHJldHVybiB0aGlzLnJlcG9zaXRvcnlVcmlXaXRoU3VmZml4KHRhZ1N1ZmZpeCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgVVJMIG9mIHRoZSByZXBvc2l0b3J5LiBDYW4gYmUgdXNlZCBpbiBgZG9ja2VyIHB1c2gvcHVsbGAuXG4gICAqXG4gICAqICAgIEFDQ09VTlQuZGtyLmVjci5SRUdJT04uYW1hem9uYXdzLmNvbS9SRVBPU0lUT1JZW0BESUdFU1RdXG4gICAqXG4gICAqIEBwYXJhbSBkaWdlc3QgT3B0aW9uYWwgaW1hZ2UgZGlnZXN0XG4gICAqL1xuICBwdWJsaWMgcmVwb3NpdG9yeVVyaUZvckRpZ2VzdChkaWdlc3Q/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGRpZ2VzdFN1ZmZpeCA9IGRpZ2VzdCA/IGBAJHtkaWdlc3R9YCA6ICcnO1xuICAgIHJldHVybiB0aGlzLnJlcG9zaXRvcnlVcmlXaXRoU3VmZml4KGRpZ2VzdFN1ZmZpeCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgVVJMIG9mIHRoZSByZXBvc2l0b3J5LiBDYW4gYmUgdXNlZCBpbiBgZG9ja2VyIHB1c2gvcHVsbGAuXG4gICAqXG4gICAqICAgIEFDQ09VTlQuZGtyLmVjci5SRUdJT04uYW1hem9uYXdzLmNvbS9SRVBPU0lUT1JZWzpUQUddXG4gICAqICAgIEFDQ09VTlQuZGtyLmVjci5SRUdJT04uYW1hem9uYXdzLmNvbS9SRVBPU0lUT1JZW0BESUdFU1RdXG4gICAqXG4gICAqIEBwYXJhbSB0YWdPckRpZ2VzdCBPcHRpb25hbCBpbWFnZSB0YWcgb3IgZGlnZXN0IChkaWdlc3RzIG11c3Qgc3RhcnQgd2l0aCBgc2hhMjU2OmApXG4gICAqL1xuICBwdWJsaWMgcmVwb3NpdG9yeVVyaUZvclRhZ09yRGlnZXN0KHRhZ09yRGlnZXN0Pzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodGFnT3JEaWdlc3Q/LnN0YXJ0c1dpdGgoJ3NoYTI1NjonKSkge1xuICAgICAgcmV0dXJuIHRoaXMucmVwb3NpdG9yeVVyaUZvckRpZ2VzdCh0YWdPckRpZ2VzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlcG9zaXRvcnlVcmlGb3JUYWcodGFnT3JEaWdlc3QpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByZXBvc2l0b3J5IFVSSSwgd2l0aCBhbiBhcHBlbmRlZCBzdWZmaXgsIGlmIHByb3ZpZGVkLlxuICAgKiBAcGFyYW0gc3VmZml4IEFuIGltYWdlIHRhZyBvciBhbiBpbWFnZSBkaWdlc3QuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIHJlcG9zaXRvcnlVcmlXaXRoU3VmZml4KHN1ZmZpeD86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcGFydHMgPSB0aGlzLnN0YWNrLnNwbGl0QXJuKHRoaXMucmVwb3NpdG9yeUFybiwgQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpO1xuICAgIHJldHVybiBgJHtwYXJ0cy5hY2NvdW50fS5ka3IuZWNyLiR7cGFydHMucmVnaW9ufS4ke3RoaXMuc3RhY2sudXJsU3VmZml4fS8ke3RoaXMucmVwb3NpdG9yeU5hbWV9JHtzdWZmaXh9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgYSBDbG91ZFdhdGNoIGV2ZW50IHRoYXQgdHJpZ2dlcnMgd2hlbiBzb21ldGhpbmcgaGFwcGVucyB0byB0aGlzIHJlcG9zaXRvcnlcbiAgICpcbiAgICogUmVxdWlyZXMgdGhhdCB0aGVyZSBleGlzdHMgYXQgbGVhc3Qgb25lIENsb3VkVHJhaWwgVHJhaWwgaW4geW91ciBhY2NvdW50XG4gICAqIHRoYXQgY2FwdHVyZXMgdGhlIGV2ZW50LiBUaGlzIG1ldGhvZCB3aWxsIG5vdCBjcmVhdGUgdGhlIFRyYWlsLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIGlkIG9mIHRoZSBydWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGFkZGluZyB0aGUgcnVsZVxuICAgKi9cbiAgcHVibGljIG9uQ2xvdWRUcmFpbEV2ZW50KGlkOiBzdHJpbmcsIG9wdGlvbnM6IGV2ZW50cy5PbkV2ZW50T3B0aW9ucyA9IHt9KTogZXZlbnRzLlJ1bGUge1xuICAgIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUodGhpcywgaWQsIG9wdGlvbnMpO1xuICAgIHJ1bGUuYWRkVGFyZ2V0KG9wdGlvbnMudGFyZ2V0KTtcbiAgICBydWxlLmFkZEV2ZW50UGF0dGVybih7XG4gICAgICBzb3VyY2U6IFsnYXdzLmVjciddLFxuICAgICAgZGV0YWlsVHlwZTogWydBV1MgQVBJIENhbGwgdmlhIENsb3VkVHJhaWwnXSxcbiAgICAgIGRldGFpbDoge1xuICAgICAgICByZXF1ZXN0UGFyYW1ldGVyczoge1xuICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiBbdGhpcy5yZXBvc2l0b3J5TmFtZV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiBydWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYW4gQVdTIENsb3VkV2F0Y2ggZXZlbnQgcnVsZSB0aGF0IGNhbiB0cmlnZ2VyIGEgdGFyZ2V0IHdoZW4gYW4gaW1hZ2UgaXMgcHVzaGVkIHRvIHRoaXNcbiAgICogcmVwb3NpdG9yeS5cbiAgICpcbiAgICogUmVxdWlyZXMgdGhhdCB0aGVyZSBleGlzdHMgYXQgbGVhc3Qgb25lIENsb3VkVHJhaWwgVHJhaWwgaW4geW91ciBhY2NvdW50XG4gICAqIHRoYXQgY2FwdHVyZXMgdGhlIGV2ZW50LiBUaGlzIG1ldGhvZCB3aWxsIG5vdCBjcmVhdGUgdGhlIFRyYWlsLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIGlkIG9mIHRoZSBydWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGFkZGluZyB0aGUgcnVsZVxuICAgKi9cbiAgcHVibGljIG9uQ2xvdWRUcmFpbEltYWdlUHVzaGVkKGlkOiBzdHJpbmcsIG9wdGlvbnM6IE9uQ2xvdWRUcmFpbEltYWdlUHVzaGVkT3B0aW9ucyA9IHt9KTogZXZlbnRzLlJ1bGUge1xuICAgIGNvbnN0IHJ1bGUgPSB0aGlzLm9uQ2xvdWRUcmFpbEV2ZW50KGlkLCBvcHRpb25zKTtcbiAgICBydWxlLmFkZEV2ZW50UGF0dGVybih7XG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgZXZlbnROYW1lOiBbJ1B1dEltYWdlJ10sXG4gICAgICAgIHJlcXVlc3RQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgaW1hZ2VUYWc6IG9wdGlvbnMuaW1hZ2VUYWcgPyBbb3B0aW9ucy5pbWFnZVRhZ10gOiB1bmRlZmluZWQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiBydWxlO1xuICB9XG4gIC8qKlxuICAgKiBEZWZpbmVzIGFuIEFXUyBDbG91ZFdhdGNoIGV2ZW50IHJ1bGUgdGhhdCBjYW4gdHJpZ2dlciBhIHRhcmdldCB3aGVuIGFuIGltYWdlIHNjYW4gaXMgY29tcGxldGVkXG4gICAqXG4gICAqXG4gICAqIEBwYXJhbSBpZCBUaGUgaWQgb2YgdGhlIHJ1bGVcbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgYWRkaW5nIHRoZSBydWxlXG4gICAqL1xuICBwdWJsaWMgb25JbWFnZVNjYW5Db21wbGV0ZWQoaWQ6IHN0cmluZywgb3B0aW9uczogT25JbWFnZVNjYW5Db21wbGV0ZWRPcHRpb25zID0ge30pOiBldmVudHMuUnVsZSB7XG4gICAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZSh0aGlzLCBpZCwgb3B0aW9ucyk7XG4gICAgcnVsZS5hZGRUYXJnZXQob3B0aW9ucy50YXJnZXQpO1xuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHtcbiAgICAgIHNvdXJjZTogWydhd3MuZWNyJ10sXG4gICAgICBkZXRhaWxUeXBlOiBbJ0VDUiBJbWFnZSBTY2FuJ10sXG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgJ3JlcG9zaXRvcnktbmFtZSc6IFt0aGlzLnJlcG9zaXRvcnlOYW1lXSxcbiAgICAgICAgJ3NjYW4tc3RhdHVzJzogWydDT01QTEVURSddLFxuICAgICAgICAnaW1hZ2UtdGFncyc6IG9wdGlvbnMuaW1hZ2VUYWdzID8/IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhIENsb3VkV2F0Y2ggZXZlbnQgcnVsZSB3aGljaCB0cmlnZ2VycyBmb3IgcmVwb3NpdG9yeSBldmVudHMuIFVzZVxuICAgKiBgcnVsZS5hZGRFdmVudFBhdHRlcm4ocGF0dGVybilgIHRvIHNwZWNpZnkgYSBmaWx0ZXIuXG4gICAqL1xuICBwdWJsaWMgb25FdmVudChpZDogc3RyaW5nLCBvcHRpb25zOiBldmVudHMuT25FdmVudE9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUodGhpcywgaWQsIG9wdGlvbnMpO1xuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHtcbiAgICAgIHNvdXJjZTogWydhd3MuZWNyJ10sXG4gICAgICByZXNvdXJjZXM6IFt0aGlzLnJlcG9zaXRvcnlBcm5dLFxuICAgIH0pO1xuICAgIHJ1bGUuYWRkVGFyZ2V0KG9wdGlvbnMudGFyZ2V0KTtcbiAgICByZXR1cm4gcnVsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCB0aGUgZ2l2ZW4gcHJpbmNpcGFsIGlkZW50aXR5IHBlcm1pc3Npb25zIHRvIHBlcmZvcm0gdGhlIGFjdGlvbnMgb24gdGhpcyByZXBvc2l0b3J5XG4gICAqL1xuICBwdWJsaWMgZ3JhbnQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKSB7XG4gICAgY29uc3QgY3Jvc3NBY2NvdW50UHJpbmNpcGFsID0gdGhpcy51bnNhZmVDcm9zc0FjY291bnRSZXNvdXJjZVBvbGljeVByaW5jaXBhbChncmFudGVlKTtcbiAgICBpZiAoY3Jvc3NBY2NvdW50UHJpbmNpcGFsKSB7XG4gICAgICAvLyBJZiB0aGUgcHJpbmNpcGFsIGlzIGZyb20gYSBkaWZmZXJlbnQgYWNjb3VudCxcbiAgICAgIC8vIHRoYXQgbWVhbnMgYWRkVG9QcmluY2lwYWxPclJlc291cmNlKCkgd2lsbCB1cGRhdGUgdGhlIFJlc291cmNlIFBvbGljeSBvZiB0aGlzIHJlcG8gdG8gdHJ1c3QgdGhhdCBwcmluY2lwYWwuXG4gICAgICAvLyBIb3dldmVyLCBFQ1IgdmVyaWZpZXMgdGhhdCB0aGUgcHJpbmNpcGFsIHVzZWQgaW4gdGhlIFBvbGljeSBleGlzdHMsXG4gICAgICAvLyBhbmQgd2lsbCBlcnJvciBvdXQgaWYgaXQgZG9lc24ndC5cbiAgICAgIC8vIEJlY2F1c2Ugb2YgdGhhdCwgaWYgdGhlIHByaW5jaXBhbCBpcyBhIG5ld2x5IGNyZWF0ZWQgcmVzb3VyY2UsXG4gICAgICAvLyBhbmQgdGhlcmUgaXMgbm90IGEgZGVwZW5kZW5jeSByZWxhdGlvbnNoaXAgYmV0d2VlbiB0aGUgU3RhY2tzIG9mIHRoaXMgcmVwbyBhbmQgdGhlIHByaW5jaXBhbCxcbiAgICAgIC8vIHRydXN0IHRoZSBlbnRpcmUgYWNjb3VudCBvZiB0aGUgcHJpbmNpcGFsIGluc3RlYWRcbiAgICAgIC8vIChvdGhlcndpc2UsIGRlcGxveWluZyB0aGlzIHJlcG8gd2lsbCBmYWlsKS5cbiAgICAgIC8vIFRvIHNjb3BlIGRvd24gdGhlIHBlcm1pc3Npb25zIGFzIG11Y2ggYXMgcG9zc2libGUsXG4gICAgICAvLyBvbmx5IHRydXN0IHByaW5jaXBhbHMgZnJvbSB0aGF0IGFjY291bnQgd2l0aCBhIHNwZWNpZmljIHRhZ1xuICAgICAgY29uc3QgY3Jvc3NBY2NvdW50UHJpbmNpcGFsU3RhY2sgPSBTdGFjay5vZihjcm9zc0FjY291bnRQcmluY2lwYWwpO1xuICAgICAgY29uc3Qgcm9sZVRhZyA9IGAke2Nyb3NzQWNjb3VudFByaW5jaXBhbFN0YWNrLnN0YWNrTmFtZX1fJHtjcm9zc0FjY291bnRQcmluY2lwYWwubm9kZS5hZGRyfWA7XG4gICAgICBUYWdzLm9mKGNyb3NzQWNjb3VudFByaW5jaXBhbCkuYWRkKCdhd3MtY2RrOmlkJywgcm9sZVRhZyk7XG4gICAgICB0aGlzLmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zLFxuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BY2NvdW50UHJpbmNpcGFsKGNyb3NzQWNjb3VudFByaW5jaXBhbFN0YWNrLmFjY291bnQpXSxcbiAgICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICAgIFN0cmluZ0VxdWFsczogeyAnYXdzOlByaW5jaXBhbFRhZy9hd3MtY2RrOmlkJzogcm9sZVRhZyB9LFxuICAgICAgICB9LFxuICAgICAgfSkpO1xuXG4gICAgICByZXR1cm4gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgICAgZ3JhbnRlZSxcbiAgICAgICAgYWN0aW9ucyxcbiAgICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy5yZXBvc2l0b3J5QXJuXSxcbiAgICAgICAgc2NvcGU6IHRoaXMsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbE9yUmVzb3VyY2Uoe1xuICAgICAgICBncmFudGVlLFxuICAgICAgICBhY3Rpb25zLFxuICAgICAgICByZXNvdXJjZUFybnM6IFt0aGlzLnJlcG9zaXRvcnlBcm5dLFxuICAgICAgICByZXNvdXJjZVNlbGZBcm5zOiBbXSxcbiAgICAgICAgcmVzb3VyY2U6IHRoaXMsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IHBlcm1pc3Npb25zIHRvIHVzZSB0aGUgaW1hZ2VzIGluIHRoaXMgcmVwb3NpdG9yeVxuICAgKi9cbiAgcHVibGljIGdyYW50UHVsbChncmFudGVlOiBpYW0uSUdyYW50YWJsZSkge1xuICAgIGNvbnN0IHJldCA9IHRoaXMuZ3JhbnQoZ3JhbnRlZSwgJ2VjcjpCYXRjaENoZWNrTGF5ZXJBdmFpbGFiaWxpdHknLCAnZWNyOkdldERvd25sb2FkVXJsRm9yTGF5ZXInLCAnZWNyOkJhdGNoR2V0SW1hZ2UnKTtcblxuICAgIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlLFxuICAgICAgYWN0aW9uczogWydlY3I6R2V0QXV0aG9yaXphdGlvblRva2VuJ10sXG4gICAgICByZXNvdXJjZUFybnM6IFsnKiddLFxuICAgICAgc2NvcGU6IHRoaXMsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBpZGVudGl0eSBwZXJtaXNzaW9ucyB0byBwdWxsIGFuZCBwdXNoIGltYWdlcyB0byB0aGlzIHJlcG9zaXRvcnkuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRQdWxsUHVzaChncmFudGVlOiBpYW0uSUdyYW50YWJsZSkge1xuICAgIHRoaXMuZ3JhbnRQdWxsKGdyYW50ZWUpO1xuICAgIHJldHVybiB0aGlzLmdyYW50KGdyYW50ZWUsXG4gICAgICAnZWNyOlB1dEltYWdlJyxcbiAgICAgICdlY3I6SW5pdGlhdGVMYXllclVwbG9hZCcsXG4gICAgICAnZWNyOlVwbG9hZExheWVyUGFydCcsXG4gICAgICAnZWNyOkNvbXBsZXRlTGF5ZXJVcGxvYWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByZXNvdXJjZSB0aGF0IGJhY2tzIHRoZSBnaXZlbiBJQU0gZ3JhbnRlZSBpZiB3ZSBjYW5ub3QgcHV0IGEgZGlyZWN0IHJlZmVyZW5jZVxuICAgKiB0byB0aGUgZ3JhbnRlZSBpbiB0aGUgcmVzb3VyY2UgcG9saWN5IG9mIHRoaXMgRUNSIHJlcG9zaXRvcnksXG4gICAqIGFuZCAndW5kZWZpbmVkJyBpbiBjYXNlIHdlIGNhbi5cbiAgICovXG4gIHByaXZhdGUgdW5zYWZlQ3Jvc3NBY2NvdW50UmVzb3VyY2VQb2xpY3lQcmluY2lwYWwoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBJQ29uc3RydWN0IHwgdW5kZWZpbmVkIHtcbiAgICAvLyBBIHByaW5jaXBhbCBjYW5ub3QgYmUgc2FmZWx5IGFkZGVkIHRvIHRoZSBSZXNvdXJjZSBQb2xpY3kgb2YgdGhpcyBFQ1IgcmVwb3NpdG9yeSwgaWY6XG4gICAgLy8gMS4gVGhlIHByaW5jaXBhbCBpcyBmcm9tIGEgZGlmZmVyZW50IGFjY291bnQsIGFuZFxuICAgIC8vIDIuIFRoZSBwcmluY2lwYWwgaXMgYSBuZXcgcmVzb3VyY2UgKG1lYW5pbmcsIG5vdCBqdXN0IHJlZmVyZW5jZWQpLCBhbmRcbiAgICAvLyAzLiBUaGUgU3RhY2sgdGhpcyByZXBvIGJlbG9uZ3MgdG8gZG9lc24ndCBkZXBlbmQgb24gdGhlIFN0YWNrIHRoZSBwcmluY2lwYWwgYmVsb25ncyB0by5cblxuICAgIC8vIGNvbmRpdGlvbiAjMVxuICAgIGNvbnN0IHByaW5jaXBhbCA9IGdyYW50ZWUuZ3JhbnRQcmluY2lwYWw7XG4gICAgY29uc3QgcHJpbmNpcGFsQWNjb3VudCA9IHByaW5jaXBhbC5wcmluY2lwYWxBY2NvdW50O1xuICAgIGlmICghcHJpbmNpcGFsQWNjb3VudCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgcmVwb0FuZFByaW5jaXBhbEFjY291bnRDb21wYXJlID0gVG9rZW4uY29tcGFyZVN0cmluZ3ModGhpcy5lbnYuYWNjb3VudCwgcHJpbmNpcGFsQWNjb3VudCk7XG4gICAgaWYgKHJlcG9BbmRQcmluY2lwYWxBY2NvdW50Q29tcGFyZSA9PT0gVG9rZW5Db21wYXJpc29uLkJPVEhfVU5SRVNPTFZFRCB8fFxuICAgICAgICByZXBvQW5kUHJpbmNpcGFsQWNjb3VudENvbXBhcmUgPT09IFRva2VuQ29tcGFyaXNvbi5TQU1FKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIGNvbmRpdGlvbiAjMlxuICAgIGlmICghaWFtLnByaW5jaXBhbElzT3duZWRSZXNvdXJjZShwcmluY2lwYWwpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIGNvbmRpdGlvbiAjM1xuICAgIGNvbnN0IHByaW5jaXBhbFN0YWNrID0gU3RhY2sub2YocHJpbmNpcGFsKTtcbiAgICBpZiAodGhpcy5zdGFjay5kZXBlbmRlbmNpZXMuaW5jbHVkZXMocHJpbmNpcGFsU3RhY2spKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBwcmluY2lwYWw7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciB0aGUgb25DbG91ZFRyYWlsSW1hZ2VQdXNoZWQgbWV0aG9kXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgT25DbG91ZFRyYWlsSW1hZ2VQdXNoZWRPcHRpb25zIGV4dGVuZHMgZXZlbnRzLk9uRXZlbnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIE9ubHkgd2F0Y2ggY2hhbmdlcyB0byB0aGlzIGltYWdlIHRhZ1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIFdhdGNoIGNoYW5nZXMgdG8gYWxsIHRhZ3NcbiAgICovXG4gIHJlYWRvbmx5IGltYWdlVGFnPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHRoZSBPbkltYWdlU2NhbkNvbXBsZXRlZCBtZXRob2RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPbkltYWdlU2NhbkNvbXBsZXRlZE9wdGlvbnMgZXh0ZW5kcyBldmVudHMuT25FdmVudE9wdGlvbnMge1xuICAvKipcbiAgICogT25seSB3YXRjaCBjaGFuZ2VzIHRvIHRoZSBpbWFnZSB0YWdzIHNwZWRpZmllZC5cbiAgICogTGVhdmUgaXQgdW5kZWZpbmVkIHRvIHdhdGNoIHRoZSBmdWxsIHJlcG9zaXRvcnkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gV2F0Y2ggdGhlIGNoYW5nZXMgdG8gdGhlIHJlcG9zaXRvcnkgd2l0aCBhbGwgaW1hZ2UgdGFnc1xuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2VUYWdzPzogc3RyaW5nW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwb3NpdG9yeVByb3BzIHtcbiAgLyoqXG4gICAqIE5hbWUgZm9yIHRoaXMgcmVwb3NpdG9yeVxuICAgKlxuICAgKiBAZGVmYXVsdCBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBuYW1lLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVwb3NpdG9yeU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBraW5kIG9mIHNlcnZlci1zaWRlIGVuY3J5cHRpb24gdG8gYXBwbHkgdG8gdGhpcyByZXBvc2l0b3J5LlxuICAgKlxuICAgKiBJZiB5b3UgY2hvb3NlIEtNUywgeW91IGNhbiBzcGVjaWZ5IGEgS01TIGtleSB2aWEgYGVuY3J5cHRpb25LZXlgLiBJZlxuICAgKiBlbmNyeXB0aW9uS2V5IGlzIG5vdCBzcGVjaWZpZWQsIGFuIEFXUyBtYW5hZ2VkIEtNUyBrZXkgaXMgdXNlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBgS01TYCBpZiBgZW5jcnlwdGlvbktleWAgaXMgc3BlY2lmaWVkLCBvciBgQUVTMjU2YCBvdGhlcndpc2UuXG4gICAqL1xuICByZWFkb25seSBlbmNyeXB0aW9uPzogUmVwb3NpdG9yeUVuY3J5cHRpb247XG5cbiAgLyoqXG4gICAqIEV4dGVybmFsIEtNUyBrZXkgdG8gdXNlIGZvciByZXBvc2l0b3J5IGVuY3J5cHRpb24uXG4gICAqXG4gICAqIFRoZSAnZW5jcnlwdGlvbicgcHJvcGVydHkgbXVzdCBiZSBlaXRoZXIgbm90IHNwZWNpZmllZCBvciBzZXQgdG8gXCJLTVNcIi5cbiAgICogQW4gZXJyb3Igd2lsbCBiZSBlbWl0dGVkIGlmIGVuY3J5cHRpb24gaXMgc2V0IHRvIFwiQUVTMjU2XCIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSWYgZW5jcnlwdGlvbiBpcyBzZXQgdG8gYEtNU2AgYW5kIHRoaXMgcHJvcGVydHkgaXMgdW5kZWZpbmVkLFxuICAgKiBhbiBBV1MgbWFuYWdlZCBLTVMga2V5IGlzIHVzZWQuXG4gICAqL1xuICByZWFkb25seSBlbmNyeXB0aW9uS2V5Pzoga21zLklLZXk7XG5cbiAgLyoqXG4gICAqIExpZmUgY3ljbGUgcnVsZXMgdG8gYXBwbHkgdG8gdGhpcyByZWdpc3RyeVxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBsaWZlIGN5Y2xlIHJ1bGVzXG4gICAqL1xuICByZWFkb25seSBsaWZlY3ljbGVSdWxlcz86IExpZmVjeWNsZVJ1bGVbXTtcblxuICAvKipcbiAgICogVGhlIEFXUyBhY2NvdW50IElEIGFzc29jaWF0ZWQgd2l0aCB0aGUgcmVnaXN0cnkgdGhhdCBjb250YWlucyB0aGUgcmVwb3NpdG9yeS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNSL2xhdGVzdC9BUElSZWZlcmVuY2UvQVBJX1B1dExpZmVjeWNsZVBvbGljeS5odG1sXG4gICAqIEBkZWZhdWx0IFRoZSBkZWZhdWx0IHJlZ2lzdHJ5IGlzIGFzc3VtZWQuXG4gICAqL1xuICByZWFkb25seSBsaWZlY3ljbGVSZWdpc3RyeUlkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgd2hhdCBoYXBwZW5zIHRvIHRoZSByZXBvc2l0b3J5IHdoZW4gdGhlIHJlc291cmNlL3N0YWNrIGlzIGRlbGV0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IFJlbW92YWxQb2xpY3kuUmV0YWluXG4gICAqL1xuICByZWFkb25seSByZW1vdmFsUG9saWN5PzogUmVtb3ZhbFBvbGljeTtcblxuICAvKipcbiAgICogRW5hYmxlIHRoZSBzY2FuIG9uIHB1c2ggd2hlbiBjcmVhdGluZyB0aGUgcmVwb3NpdG9yeVxuICAgKlxuICAgKiAgQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGltYWdlU2Nhbk9uUHVzaD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSB0YWcgbXV0YWJpbGl0eSBzZXR0aW5nIGZvciB0aGUgcmVwb3NpdG9yeS4gSWYgdGhpcyBwYXJhbWV0ZXIgaXMgb21pdHRlZCwgdGhlIGRlZmF1bHQgc2V0dGluZyBvZiBNVVRBQkxFIHdpbGwgYmUgdXNlZCB3aGljaCB3aWxsIGFsbG93IGltYWdlIHRhZ3MgdG8gYmUgb3ZlcndyaXR0ZW4uXG4gICAqXG4gICAqICBAZGVmYXVsdCBUYWdNdXRhYmlsaXR5Lk1VVEFCTEVcbiAgICovXG4gIHJlYWRvbmx5IGltYWdlVGFnTXV0YWJpbGl0eT86IFRhZ011dGFiaWxpdHk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwb3NpdG9yeUF0dHJpYnV0ZXMge1xuICByZWFkb25seSByZXBvc2l0b3J5TmFtZTogc3RyaW5nO1xuICByZWFkb25seSByZXBvc2l0b3J5QXJuOiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGVmaW5lIGFuIEVDUiByZXBvc2l0b3J5XG4gKi9cbmV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2Uge1xuICAvKipcbiAgICogSW1wb3J0IGEgcmVwb3NpdG9yeVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUmVwb3NpdG9yeUF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IFJlcG9zaXRvcnlBdHRyaWJ1dGVzKTogSVJlcG9zaXRvcnkge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlcG9zaXRvcnlCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSByZXBvc2l0b3J5TmFtZSA9IGF0dHJzLnJlcG9zaXRvcnlOYW1lO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHJlcG9zaXRvcnlBcm4gPSBhdHRycy5yZXBvc2l0b3J5QXJuO1xuXG4gICAgICBwdWJsaWMgYWRkVG9SZXNvdXJjZVBvbGljeShfc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KTogaWFtLkFkZFRvUmVzb3VyY2VQb2xpY3lSZXN1bHQge1xuICAgICAgICAvLyBkcm9wcGVkXG4gICAgICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiBmYWxzZSB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZyb21SZXBvc2l0b3J5QXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlcG9zaXRvcnlBcm46IHN0cmluZyk6IElSZXBvc2l0b3J5IHtcblxuICAgIC8vIGlmIHJlcG9zaXRvcnlBcm4gaXMgYSB0b2tlbiwgdGhlIHJlcG9zaXRvcnkgbmFtZSBpcyBhbHNvIHJlcXVpcmVkLiB0aGlzIGlzIGJlY2F1c2VcbiAgICAvLyByZXBvc2l0b3J5IG5hbWVzIGNhbiBpbmNsdWRlIFwiL1wiIChlLmcuIGZvby9iYXIvbXlyZXBvKSBhbmQgaXQgaXMgaW1wb3NzaWJsZSB0b1xuICAgIC8vIHBhcnNlIHRoZSBuYW1lIGZyb20gYW4gQVJOIHVzaW5nIENsb3VkRm9ybWF0aW9uJ3Mgc3BsaXQvc2VsZWN0LlxuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQocmVwb3NpdG9yeUFybikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJyZXBvc2l0b3J5QXJuXCIgaXMgYSBsYXRlLWJvdW5kIHZhbHVlLCBhbmQgdGhlcmVmb3JlIFwicmVwb3NpdG9yeU5hbWVcIiBpcyByZXF1aXJlZC4gVXNlIGBmcm9tUmVwb3NpdG9yeUF0dHJpYnV0ZXNgIGluc3RlYWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXBvc2l0b3J5TmFtZSA9IHJlcG9zaXRvcnlBcm4uc3BsaXQoJy8nKS5zbGljZSgxKS5qb2luKCcvJyk7XG5cbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXBvc2l0b3J5QmFzZSB7XG4gICAgICBwdWJsaWMgcmVwb3NpdG9yeU5hbWUgPSByZXBvc2l0b3J5TmFtZTtcbiAgICAgIHB1YmxpYyByZXBvc2l0b3J5QXJuID0gcmVwb3NpdG9yeUFybjtcblxuICAgICAgcHVibGljIGFkZFRvUmVzb3VyY2VQb2xpY3koX3N0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudCk6IGlhbS5BZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0IHtcbiAgICAgICAgLy8gZHJvcHBlZFxuICAgICAgICByZXR1cm4geyBzdGF0ZW1lbnRBZGRlZDogZmFsc2UgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQsIHtcbiAgICAgIGVudmlyb25tZW50RnJvbUFybjogcmVwb3NpdG9yeUFybixcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVJlcG9zaXRvcnlOYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlcG9zaXRvcnlOYW1lOiBzdHJpbmcpOiBJUmVwb3NpdG9yeSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2Uge1xuICAgICAgcHVibGljIHJlcG9zaXRvcnlOYW1lID0gcmVwb3NpdG9yeU5hbWU7XG4gICAgICBwdWJsaWMgcmVwb3NpdG9yeUFybiA9IFJlcG9zaXRvcnkuYXJuRm9yTG9jYWxSZXBvc2l0b3J5KHJlcG9zaXRvcnlOYW1lLCBzY29wZSk7XG5cbiAgICAgIHB1YmxpYyBhZGRUb1Jlc291cmNlUG9saWN5KF9zdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpOiBpYW0uQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdCB7XG4gICAgICAgIC8vIGRyb3BwZWRcbiAgICAgICAgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IGZhbHNlIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIEVDUiBBUk4gZm9yIGEgcmVwb3NpdG9yeSB0aGF0IHJlc2lkZXMgaW4gdGhlIHNhbWUgYWNjb3VudC9yZWdpb25cbiAgICogYXMgdGhlIGN1cnJlbnQgc3RhY2suXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFybkZvckxvY2FsUmVwb3NpdG9yeShyZXBvc2l0b3J5TmFtZTogc3RyaW5nLCBzY29wZTogSUNvbnN0cnVjdCwgYWNjb3VudD86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFN0YWNrLm9mKHNjb3BlKS5mb3JtYXRBcm4oe1xuICAgICAgYWNjb3VudCxcbiAgICAgIHNlcnZpY2U6ICdlY3InLFxuICAgICAgcmVzb3VyY2U6ICdyZXBvc2l0b3J5JyxcbiAgICAgIHJlc291cmNlTmFtZTogcmVwb3NpdG9yeU5hbWUsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyB2YWxpZGF0ZVJlcG9zaXRvcnlOYW1lKHBoeXNpY2FsTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVwb3NpdG9yeU5hbWUgPSBwaHlzaWNhbE5hbWU7XG4gICAgaWYgKCFyZXBvc2l0b3J5TmFtZSB8fCBUb2tlbi5pc1VucmVzb2x2ZWQocmVwb3NpdG9yeU5hbWUpKSB7XG4gICAgICAvLyB0aGUgbmFtZSBpcyBhIGxhdGUtYm91bmQgdmFsdWUsIG5vdCBhIGRlZmluZWQgc3RyaW5nLFxuICAgICAgLy8gc28gc2tpcCB2YWxpZGF0aW9uXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgLy8gUnVsZXMgY29kaWZpZWQgZnJvbSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWNyLXJlcG9zaXRvcnkuaHRtbFxuICAgIGlmIChyZXBvc2l0b3J5TmFtZS5sZW5ndGggPCAyIHx8IHJlcG9zaXRvcnlOYW1lLmxlbmd0aCA+IDI1Nikge1xuICAgICAgZXJyb3JzLnB1c2goJ1JlcG9zaXRvcnkgbmFtZSBtdXN0IGJlIGF0IGxlYXN0IDIgYW5kIG5vIG1vcmUgdGhhbiAyNTYgY2hhcmFjdGVycycpO1xuICAgIH1cbiAgICBjb25zdCBpc1BhdHRlcm5NYXRjaCA9IC9eKD86W2EtejAtOV0rKD86Wy5fLV1bYS16MC05XSspKlxcLykqW2EtejAtOV0rKD86Wy5fLV1bYS16MC05XSspKiQvLnRlc3QocmVwb3NpdG9yeU5hbWUpO1xuICAgIGlmICghaXNQYXR0ZXJuTWF0Y2gpIHtcbiAgICAgIGVycm9ycy5wdXNoKCdSZXBvc2l0b3J5IG5hbWUgbXVzdCBmb2xsb3cgdGhlIHNwZWNpZmllZCBwYXR0ZXJuOiAoPzpbYS16MC05XSsoPzpbLl8tXVthLXowLTldKykqLykqW2EtejAtOV0rKD86Wy5fLV1bYS16MC05XSspKicpO1xuICAgIH1cblxuICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEVDUiByZXBvc2l0b3J5IG5hbWUgKHZhbHVlOiAke3JlcG9zaXRvcnlOYW1lfSkke0VPTH0ke2Vycm9ycy5qb2luKEVPTCl9YCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IHJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSByZXBvc2l0b3J5QXJuOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgbGlmZWN5Y2xlUnVsZXMgPSBuZXcgQXJyYXk8TGlmZWN5Y2xlUnVsZT4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSByZWdpc3RyeUlkPzogc3RyaW5nO1xuICBwcml2YXRlIHBvbGljeURvY3VtZW50PzogaWFtLlBvbGljeURvY3VtZW50O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBSZXBvc2l0b3J5UHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5yZXBvc2l0b3J5TmFtZSxcbiAgICB9KTtcblxuICAgIFJlcG9zaXRvcnkudmFsaWRhdGVSZXBvc2l0b3J5TmFtZSh0aGlzLnBoeXNpY2FsTmFtZSk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5SZXBvc2l0b3J5KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHJlcG9zaXRvcnlOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIC8vIEl0IHNheXMgXCJUZXh0XCIsIGJ1dCB0aGV5IGFjdHVhbGx5IG1lYW4gXCJPYmplY3RcIi5cbiAgICAgIHJlcG9zaXRvcnlQb2xpY3lUZXh0OiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucG9saWN5RG9jdW1lbnQgfSksXG4gICAgICBsaWZlY3ljbGVQb2xpY3k6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZW5kZXJMaWZlY3ljbGVQb2xpY3koKSB9KSxcbiAgICAgIGltYWdlU2Nhbm5pbmdDb25maWd1cmF0aW9uOiBwcm9wcy5pbWFnZVNjYW5PblB1c2ggIT09IHVuZGVmaW5lZCA/IHsgc2Nhbk9uUHVzaDogcHJvcHMuaW1hZ2VTY2FuT25QdXNoIH0gOiB1bmRlZmluZWQsXG4gICAgICBpbWFnZVRhZ011dGFiaWxpdHk6IHByb3BzLmltYWdlVGFnTXV0YWJpbGl0eSB8fCB1bmRlZmluZWQsXG4gICAgICBlbmNyeXB0aW9uQ29uZmlndXJhdGlvbjogdGhpcy5wYXJzZUVuY3J5cHRpb24ocHJvcHMpLFxuICAgIH0pO1xuXG4gICAgcmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KHByb3BzLnJlbW92YWxQb2xpY3kpO1xuXG4gICAgdGhpcy5yZWdpc3RyeUlkID0gcHJvcHMubGlmZWN5Y2xlUmVnaXN0cnlJZDtcbiAgICBpZiAocHJvcHMubGlmZWN5Y2xlUnVsZXMpIHtcbiAgICAgIHByb3BzLmxpZmVjeWNsZVJ1bGVzLmZvckVhY2godGhpcy5hZGRMaWZlY3ljbGVSdWxlLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHRoaXMucmVwb3NpdG9yeU5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXNvdXJjZS5yZWYpO1xuICAgIHRoaXMucmVwb3NpdG9yeUFybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUocmVzb3VyY2UuYXR0ckFybiwge1xuICAgICAgc2VydmljZTogJ2VjcicsXG4gICAgICByZXNvdXJjZTogJ3JlcG9zaXRvcnknLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMucG9saWN5RG9jdW1lbnQ/LnZhbGlkYXRlRm9yUmVzb3VyY2VQb2xpY3koKSA/PyBbXSB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1Jlc291cmNlUG9saWN5KHN0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudCk6IGlhbS5BZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0IHtcbiAgICBpZiAodGhpcy5wb2xpY3lEb2N1bWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnBvbGljeURvY3VtZW50ID0gbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCgpO1xuICAgIH1cbiAgICB0aGlzLnBvbGljeURvY3VtZW50LmFkZFN0YXRlbWVudHMoc3RhdGVtZW50KTtcbiAgICByZXR1cm4geyBzdGF0ZW1lbnRBZGRlZDogdHJ1ZSwgcG9saWN5RGVwZW5kYWJsZTogdGhpcy5wb2xpY3lEb2N1bWVudCB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGxpZmUgY3ljbGUgcnVsZSB0byB0aGUgcmVwb3NpdG9yeVxuICAgKlxuICAgKiBMaWZlIGN5Y2xlIHJ1bGVzIGF1dG9tYXRpY2FsbHkgZXhwaXJlIGltYWdlcyBmcm9tIHRoZSByZXBvc2l0b3J5IHRoYXQgbWF0Y2hcbiAgICogY2VydGFpbiBjb25kaXRpb25zLlxuICAgKi9cbiAgcHVibGljIGFkZExpZmVjeWNsZVJ1bGUocnVsZTogTGlmZWN5Y2xlUnVsZSkge1xuICAgIC8vIFZhbGlkYXRlIHJ1bGUgaGVyZSBzbyB1c2VycyBnZXQgZXJyb3JzIGF0IHRoZSBleHBlY3RlZCBsb2NhdGlvblxuICAgIGlmIChydWxlLnRhZ1N0YXR1cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBydWxlID0geyAuLi5ydWxlLCB0YWdTdGF0dXM6IHJ1bGUudGFnUHJlZml4TGlzdCA9PT0gdW5kZWZpbmVkID8gVGFnU3RhdHVzLkFOWSA6IFRhZ1N0YXR1cy5UQUdHRUQgfTtcbiAgICB9XG5cbiAgICBpZiAocnVsZS50YWdTdGF0dXMgPT09IFRhZ1N0YXR1cy5UQUdHRUQgJiYgKHJ1bGUudGFnUHJlZml4TGlzdCA9PT0gdW5kZWZpbmVkIHx8IHJ1bGUudGFnUHJlZml4TGlzdC5sZW5ndGggPT09IDApKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhZ1N0YXR1cy5UYWdnZWQgcmVxdWlyZXMgdGhlIHNwZWNpZmljYXRpb24gb2YgYSB0YWdQcmVmaXhMaXN0Jyk7XG4gICAgfVxuICAgIGlmIChydWxlLnRhZ1N0YXR1cyAhPT0gVGFnU3RhdHVzLlRBR0dFRCAmJiBydWxlLnRhZ1ByZWZpeExpc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0YWdQcmVmaXhMaXN0IGNhbiBvbmx5IGJlIHNwZWNpZmllZCB3aGVuIHRhZ1N0YXR1cyBpcyBzZXQgdG8gVGFnZ2VkJyk7XG4gICAgfVxuICAgIGlmICgocnVsZS5tYXhJbWFnZUFnZSAhPT0gdW5kZWZpbmVkKSA9PT0gKHJ1bGUubWF4SW1hZ2VDb3VudCAhPT0gdW5kZWZpbmVkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBMaWZlIGN5Y2xlIHJ1bGUgbXVzdCBjb250YWluIGV4YWN0bHkgb25lIG9mICdtYXhJbWFnZUFnZScgYW5kICdtYXhJbWFnZUNvdW50JywgZ290OiAke0pTT04uc3RyaW5naWZ5KHJ1bGUpfWApO1xuICAgIH1cblxuICAgIGlmIChydWxlLnRhZ1N0YXR1cyA9PT0gVGFnU3RhdHVzLkFOWSAmJiB0aGlzLmxpZmVjeWNsZVJ1bGVzLmZpbHRlcihyID0+IHIudGFnU3RhdHVzID09PSBUYWdTdGF0dXMuQU5ZKS5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xpZmUgY3ljbGUgY2FuIG9ubHkgaGF2ZSBvbmUgVGFnU3RhdHVzLkFueSBydWxlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5saWZlY3ljbGVSdWxlcy5wdXNoKHsgLi4ucnVsZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGxpZmUgY3ljbGUgcG9saWN5IG9iamVjdFxuICAgKi9cbiAgcHJpdmF0ZSByZW5kZXJMaWZlY3ljbGVQb2xpY3koKTogQ2ZuUmVwb3NpdG9yeS5MaWZlY3ljbGVQb2xpY3lQcm9wZXJ0eSB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZih0aGlzKTtcbiAgICBsZXQgbGlmZWN5Y2xlUG9saWN5VGV4dDogYW55O1xuXG4gICAgaWYgKHRoaXMubGlmZWN5Y2xlUnVsZXMubGVuZ3RoID09PSAwICYmICF0aGlzLnJlZ2lzdHJ5SWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgaWYgKHRoaXMubGlmZWN5Y2xlUnVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgbGlmZWN5Y2xlUG9saWN5VGV4dCA9IEpTT04uc3RyaW5naWZ5KHN0YWNrLnJlc29sdmUoe1xuICAgICAgICBydWxlczogdGhpcy5vcmRlcmVkTGlmZWN5Y2xlUnVsZXMoKS5tYXAocmVuZGVyTGlmZWN5Y2xlUnVsZSksXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpZmVjeWNsZVBvbGljeVRleHQsXG4gICAgICByZWdpc3RyeUlkOiB0aGlzLnJlZ2lzdHJ5SWQsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gbGlmZSBjeWNsZSBydWxlcyB3aXRoIGF1dG9tYXRpYyBvcmRlcmluZyBhcHBsaWVkLlxuICAgKlxuICAgKiBBbHNvIGFwcGxpZXMgdmFsaWRhdGlvbiBvZiB0aGUgJ2FueScgcnVsZS5cbiAgICovXG4gIHByaXZhdGUgb3JkZXJlZExpZmVjeWNsZVJ1bGVzKCk6IExpZmVjeWNsZVJ1bGVbXSB7XG4gICAgaWYgKHRoaXMubGlmZWN5Y2xlUnVsZXMubGVuZ3RoID09PSAwKSB7IHJldHVybiBbXTsgfVxuXG4gICAgY29uc3QgcHJpb3JpdGl6ZWRSdWxlcyA9IHRoaXMubGlmZWN5Y2xlUnVsZXMuZmlsdGVyKHIgPT4gci5ydWxlUHJpb3JpdHkgIT09IHVuZGVmaW5lZCAmJiByLnRhZ1N0YXR1cyAhPT0gVGFnU3RhdHVzLkFOWSk7XG4gICAgY29uc3QgYXV0b1ByaW9yaXRpemVkUnVsZXMgPSB0aGlzLmxpZmVjeWNsZVJ1bGVzLmZpbHRlcihyID0+IHIucnVsZVByaW9yaXR5ID09PSB1bmRlZmluZWQgJiYgci50YWdTdGF0dXMgIT09IFRhZ1N0YXR1cy5BTlkpO1xuICAgIGNvbnN0IGFueVJ1bGVzID0gdGhpcy5saWZlY3ljbGVSdWxlcy5maWx0ZXIociA9PiByLnRhZ1N0YXR1cyA9PT0gVGFnU3RhdHVzLkFOWSk7XG4gICAgaWYgKGFueVJ1bGVzLmxlbmd0aCA+IDAgJiYgYW55UnVsZXNbMF0ucnVsZVByaW9yaXR5ICE9PSB1bmRlZmluZWQgJiYgYXV0b1ByaW9yaXRpemVkUnVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gU3VwcG9ydGluZyB0aGlzIGlzIHRvbyBjb21wbGV4IGZvciB2ZXJ5IGxpdHRsZSB2YWx1ZS4gV2UganVzdCBwcm9oaWJpdCBpdC5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBjb21iaW5lIHByaW9yaXRpemVkIFRhZ1N0YXR1cy5BbnkgcnVsZSB3aXRoIHVucHJpb3JpdGl6ZWQgcnVsZXMuIFJlbW92ZSBydWxlUHJpb3JpdHkgZnJvbSB0aGUgJ0FueScgcnVsZS5cIik7XG4gICAgfVxuXG4gICAgY29uc3QgcHJpb3MgPSBwcmlvcml0aXplZFJ1bGVzLm1hcChyID0+IHIucnVsZVByaW9yaXR5ISk7XG4gICAgbGV0IGF1dG9QcmlvID0gKHByaW9zLmxlbmd0aCA+IDAgPyBNYXRoLm1heCguLi5wcmlvcykgOiAwKSArIDE7XG5cbiAgICBjb25zdCByZXQgPSBuZXcgQXJyYXk8TGlmZWN5Y2xlUnVsZT4oKTtcbiAgICBmb3IgKGNvbnN0IHJ1bGUgb2YgcHJpb3JpdGl6ZWRSdWxlcy5jb25jYXQoYXV0b1ByaW9yaXRpemVkUnVsZXMpLmNvbmNhdChhbnlSdWxlcykpIHtcbiAgICAgIHJldC5wdXNoKHtcbiAgICAgICAgLi4ucnVsZSxcbiAgICAgICAgcnVsZVByaW9yaXR5OiBydWxlLnJ1bGVQcmlvcml0eSA/PyBhdXRvUHJpbysrLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRG8gdmFsaWRhdGlvbiBvbiB0aGUgZmluYWwgYXJyYXktLW1pZ2h0IHN0aWxsIGJlIHdyb25nIGJlY2F1c2UgdGhlIHVzZXIgc3VwcGxpZWQgYWxsIHByaW9zLCBidXQgaW5jb3JyZWN0bHkuXG4gICAgdmFsaWRhdGVBbnlSdWxlTGFzdChyZXQpO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHVwIGtleSBwcm9wZXJ0aWVzIGFuZCByZXR1cm4gdGhlIFJlcG9zaXRvcnkgZW5jcnlwdGlvbiBwcm9wZXJ0eSBmcm9tIHRoZVxuICAgKiB1c2VyJ3MgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHByaXZhdGUgcGFyc2VFbmNyeXB0aW9uKHByb3BzOiBSZXBvc2l0b3J5UHJvcHMpOiBDZm5SZXBvc2l0b3J5LkVuY3J5cHRpb25Db25maWd1cmF0aW9uUHJvcGVydHkgfCB1bmRlZmluZWQge1xuXG4gICAgLy8gZGVmYXVsdCBiYXNlZCBvbiB3aGV0aGVyIGVuY3J5cHRpb25LZXkgaXMgc3BlY2lmaWVkXG4gICAgY29uc3QgZW5jcnlwdGlvblR5cGUgPSBwcm9wcy5lbmNyeXB0aW9uID8/IChwcm9wcy5lbmNyeXB0aW9uS2V5ID8gUmVwb3NpdG9yeUVuY3J5cHRpb24uS01TIDogUmVwb3NpdG9yeUVuY3J5cHRpb24uQUVTXzI1Nik7XG5cbiAgICAvLyBpZiBlbmNyeXB0aW9uIGtleSBpcyBzZXQsIGVuY3J5cHRpb24gbXVzdCBiZSBzZXQgdG8gS01TLlxuICAgIGlmIChlbmNyeXB0aW9uVHlwZSAhPT0gUmVwb3NpdG9yeUVuY3J5cHRpb24uS01TICYmIHByb3BzLmVuY3J5cHRpb25LZXkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgZW5jcnlwdGlvbktleSBpcyBzcGVjaWZpZWQsIHNvICdlbmNyeXB0aW9uJyBtdXN0IGJlIHNldCB0byBLTVMgKHZhbHVlOiAke2VuY3J5cHRpb25UeXBlLnZhbHVlfSlgKTtcbiAgICB9XG5cbiAgICBpZiAoZW5jcnlwdGlvblR5cGUgPT09IFJlcG9zaXRvcnlFbmNyeXB0aW9uLkFFU18yNTYpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKGVuY3J5cHRpb25UeXBlID09PSBSZXBvc2l0b3J5RW5jcnlwdGlvbi5LTVMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVuY3J5cHRpb25UeXBlOiAnS01TJyxcbiAgICAgICAga21zS2V5OiBwcm9wcy5lbmNyeXB0aW9uS2V5Py5rZXlBcm4sXG4gICAgICB9O1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCAnZW5jcnlwdGlvblR5cGUnOiAke2VuY3J5cHRpb25UeXBlfWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQW55UnVsZUxhc3QocnVsZXM6IExpZmVjeWNsZVJ1bGVbXSkge1xuICBjb25zdCBhbnlSdWxlcyA9IHJ1bGVzLmZpbHRlcihyID0+IHIudGFnU3RhdHVzID09PSBUYWdTdGF0dXMuQU5ZKTtcbiAgaWYgKGFueVJ1bGVzLmxlbmd0aCA9PT0gMSkge1xuICAgIGNvbnN0IG1heFByaW8gPSBNYXRoLm1heCguLi5ydWxlcy5tYXAociA9PiByLnJ1bGVQcmlvcml0eSEpKTtcbiAgICBpZiAoYW55UnVsZXNbMF0ucnVsZVByaW9yaXR5ICE9PSBtYXhQcmlvKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRhZ1N0YXR1cy5BbnkgcnVsZSBtdXN0IGhhdmUgaGlnaGVzdCBwcmlvcml0eSwgaGFzICR7YW55UnVsZXNbMF0ucnVsZVByaW9yaXR5fSB3aGljaCBpcyBzbWFsbGVyIHRoYW4gJHttYXhQcmlvfWApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlbmRlciB0aGUgbGlmZWN5Y2xlIHJ1bGUgdG8gSlNPTlxuICovXG5mdW5jdGlvbiByZW5kZXJMaWZlY3ljbGVSdWxlKHJ1bGU6IExpZmVjeWNsZVJ1bGUpIHtcbiAgcmV0dXJuIHtcbiAgICBydWxlUHJpb3JpdHk6IHJ1bGUucnVsZVByaW9yaXR5LFxuICAgIGRlc2NyaXB0aW9uOiBydWxlLmRlc2NyaXB0aW9uLFxuICAgIHNlbGVjdGlvbjoge1xuICAgICAgdGFnU3RhdHVzOiBydWxlLnRhZ1N0YXR1cyB8fCBUYWdTdGF0dXMuQU5ZLFxuICAgICAgdGFnUHJlZml4TGlzdDogcnVsZS50YWdQcmVmaXhMaXN0LFxuICAgICAgY291bnRUeXBlOiBydWxlLm1heEltYWdlQWdlICE9PSB1bmRlZmluZWQgPyBDb3VudFR5cGUuU0lOQ0VfSU1BR0VfUFVTSEVEIDogQ291bnRUeXBlLklNQUdFX0NPVU5UX01PUkVfVEhBTixcbiAgICAgIGNvdW50TnVtYmVyOiBydWxlLm1heEltYWdlQWdlPy50b0RheXMoKSA/PyBydWxlLm1heEltYWdlQ291bnQsXG4gICAgICBjb3VudFVuaXQ6IHJ1bGUubWF4SW1hZ2VBZ2UgIT09IHVuZGVmaW5lZCA/ICdkYXlzJyA6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIGFjdGlvbjoge1xuICAgICAgdHlwZTogJ2V4cGlyZScsXG4gICAgfSxcbiAgfTtcbn1cblxuLyoqXG4gKiBTZWxlY3QgaW1hZ2VzIGJhc2VkIG9uIGNvdW50c1xuICovXG5jb25zdCBlbnVtIENvdW50VHlwZSB7XG4gIC8qKlxuICAgKiBTZXQgYSBsaW1pdCBvbiB0aGUgbnVtYmVyIG9mIGltYWdlcyBpbiB5b3VyIHJlcG9zaXRvcnlcbiAgICovXG4gIElNQUdFX0NPVU5UX01PUkVfVEhBTiA9ICdpbWFnZUNvdW50TW9yZVRoYW4nLFxuXG4gIC8qKlxuICAgKiBTZXQgYW4gYWdlIGxpbWl0IG9uIHRoZSBpbWFnZXMgaW4geW91ciByZXBvc2l0b3J5XG4gICAqL1xuICBTSU5DRV9JTUFHRV9QVVNIRUQgPSAnc2luY2VJbWFnZVB1c2hlZCcsXG59XG5cbi8qKlxuICogVGhlIHRhZyBtdXRhYmlsaXR5IHNldHRpbmcgZm9yIHlvdXIgcmVwb3NpdG9yeS5cbiAqL1xuZXhwb3J0IGVudW0gVGFnTXV0YWJpbGl0eSB7XG4gIC8qKlxuICAgKiBhbGxvdyBpbWFnZSB0YWdzIHRvIGJlIG92ZXJ3cml0dGVuLlxuICAgKi9cbiAgTVVUQUJMRSA9ICdNVVRBQkxFJyxcblxuICAvKipcbiAgICogYWxsIGltYWdlIHRhZ3Mgd2l0aGluIHRoZSByZXBvc2l0b3J5IHdpbGwgYmUgaW1tdXRhYmxlIHdoaWNoIHdpbGwgcHJldmVudCB0aGVtIGZyb20gYmVpbmcgb3ZlcndyaXR0ZW4uXG4gICAqL1xuICBJTU1VVEFCTEUgPSAnSU1NVVRBQkxFJyxcblxufVxuXG4vKipcbiAqIEluZGljYXRlcyB3aGV0aGVyIHNlcnZlci1zaWRlIGVuY3J5cHRpb24gaXMgZW5hYmxlZCBmb3IgdGhlIG9iamVjdCwgYW5kIHdoZXRoZXIgdGhhdCBlbmNyeXB0aW9uIGlzXG4gKiBmcm9tIHRoZSBBV1MgS2V5IE1hbmFnZW1lbnQgU2VydmljZSAoQVdTIEtNUykgb3IgZnJvbSBBbWF6b24gUzMgbWFuYWdlZCBlbmNyeXB0aW9uIChTU0UtUzMpLlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9Vc2luZ01ldGFkYXRhLmh0bWwjU3lzTWV0YWRhdGFcbiAqL1xuZXhwb3J0IGNsYXNzIFJlcG9zaXRvcnlFbmNyeXB0aW9uIHtcbiAgLyoqXG4gICAqICdBRVMyNTYnXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEFFU18yNTYgPSBuZXcgUmVwb3NpdG9yeUVuY3J5cHRpb24oJ0FFUzI1NicpO1xuICAvKipcbiAgICogJ0tNUydcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgS01TID0gbmV3IFJlcG9zaXRvcnlFbmNyeXB0aW9uKCdLTVMnKTtcblxuICAvKipcbiAgICogQHBhcmFtIHZhbHVlIHRoZSBzdHJpbmcgdmFsdWUgb2YgdGhlIGVuY3J5cHRpb25cbiAgICovXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdmFsdWU6IHN0cmluZykgeyB9XG59XG4iXX0=