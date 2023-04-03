"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretTargetAttachment = exports.AttachmentTargetType = exports.Secret = exports.SecretStringValueBeta1 = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const policy_1 = require("./policy");
const rotation_schedule_1 = require("./rotation-schedule");
const secretsmanager = require("./secretsmanager.generated");
const SECRET_SYMBOL = Symbol.for('@aws-cdk/secretsmanager.Secret');
/**
 * An experimental class used to specify an initial secret value for a Secret.
 *
 * The class wraps a simple string (or JSON representation) in order to provide some safety checks and warnings
 * about the dangers of using plaintext strings as initial secret seed values via CDK/CloudFormation.
 *
 * @deprecated Use `cdk.SecretValue` instead.
 */
class SecretStringValueBeta1 {
    constructor(_secretValue) {
        this._secretValue = _secretValue;
    }
    /**
     * Creates a `SecretStringValueBeta1` from a plaintext value.
     *
     * This approach is inherently unsafe, as the secret value may be visible in your source control repository
     * and will also appear in plaintext in the resulting CloudFormation template, including in the AWS Console or APIs.
     * Usage of this method is discouraged, especially for production workloads.
     */
    static fromUnsafePlaintext(secretValue) { try {
        jsiiDeprecationWarnings.print("@aws-cdk/aws-secretsmanager.SecretStringValueBeta1#fromUnsafePlaintext", "Use `cdk.SecretValue` instead.");
    }
    catch (error) {
        if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
            Error.captureStackTrace(error, this.fromUnsafePlaintext);
        }
        throw error;
    } return new SecretStringValueBeta1(secretValue); }
    /**
     * Creates a `SecretValueValueBeta1` from a string value coming from a Token.
     *
     * The intent is to enable creating secrets from references (e.g., `Ref`, `Fn::GetAtt`) from other resources.
     * This might be the direct output of another Construct, or the output of a Custom Resource.
     * This method throws if it determines the input is an unsafe plaintext string.
     *
     * For example:
     *
     * ```ts
     * // Creates a new IAM user, access and secret keys, and stores the secret access key in a Secret.
     * const user = new iam.User(this, 'User');
     * const accessKey = new iam.AccessKey(this, 'AccessKey', { user });
     * const secret = new secretsmanager.Secret(this, 'Secret', {
     * 	secretStringValue: accessKey.secretAccessKey,
     * });
     * ```
     *
     * The secret may also be embedded in a string representation of a JSON structure:
     *
     * ```ts
     * const user = new iam.User(this, 'User');
     * const accessKey = new iam.AccessKey(this, 'AccessKey', { user });
     * const secretValue = secretsmanager.SecretStringValueBeta1.fromToken(JSON.stringify({
     *   username: user.userName,
     *   database: 'foo',
     *   password: accessKey.secretAccessKey.unsafeUnwrap(),
     * }));
     * ```
     *
     * Note that the value being a Token does *not* guarantee safety. For example, a Lazy-evaluated string
     * (e.g., `Lazy.string({ produce: () => 'myInsecurePassword' }))`) is a Token, but as the output is
     * ultimately a plaintext string, and so insecure.
     *
     * @param secretValueFromToken a secret value coming from a Construct attribute or Custom Resource output
     */
    static fromToken(secretValueFromToken) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-secretsmanager.SecretStringValueBeta1#fromToken", "Use `cdk.SecretValue` instead.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromToken);
            }
            throw error;
        }
        if (!core_1.Token.isUnresolved(secretValueFromToken)) {
            throw new Error('SecretStringValueBeta1 appears to be plaintext (unsafe) string (or resolved Token); use fromUnsafePlaintext if this is intentional');
        }
        return new SecretStringValueBeta1(secretValueFromToken);
    }
    /** Returns the secret value */
    secretValue() { try {
        jsiiDeprecationWarnings.print("@aws-cdk/aws-secretsmanager.SecretStringValueBeta1#secretValue", "Use `cdk.SecretValue` instead.");
    }
    catch (error) {
        if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
            Error.captureStackTrace(error, this.secretValue);
        }
        throw error;
    } return this._secretValue; }
}
exports.SecretStringValueBeta1 = SecretStringValueBeta1;
_a = JSII_RTTI_SYMBOL_1;
SecretStringValueBeta1[_a] = { fqn: "@aws-cdk/aws-secretsmanager.SecretStringValueBeta1", version: "0.0.0" };
/**
 * The common behavior of Secrets. Users should not use this class directly, and instead use ``Secret``.
 */
class SecretBase extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        this.node.addValidation({ validate: () => this.policy?.document.validateForResourcePolicy() ?? [] });
    }
    get secretFullArn() { return this.secretArn; }
    grantRead(grantee, versionStages) {
        // @see https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html
        const result = iam.Grant.addToPrincipalOrResource({
            grantee,
            actions: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
            resourceArns: [this.arnForPolicies],
            resource: this,
        });
        const statement = result.principalStatement || result.resourceStatement;
        if (versionStages != null && statement) {
            statement.addCondition('ForAnyValue:StringEquals', {
                'secretsmanager:VersionStage': versionStages,
            });
        }
        if (this.encryptionKey) {
            // @see https://docs.aws.amazon.com/kms/latest/developerguide/services-secrets-manager.html
            this.encryptionKey.grantDecrypt(new kms.ViaServicePrincipal(`secretsmanager.${core_1.Stack.of(this).region}.amazonaws.com`, grantee.grantPrincipal));
        }
        const crossAccount = core_1.Token.compareStrings(core_1.Stack.of(this).account, grantee.grantPrincipal.principalAccount || '');
        // Throw if secret is not imported and it's shared cross account and no KMS key is provided
        if (this instanceof Secret && result.resourceStatement && (!this.encryptionKey && crossAccount === core_1.TokenComparison.DIFFERENT)) {
            throw new Error('KMS Key must be provided for cross account access to Secret');
        }
        return result;
    }
    grantWrite(grantee) {
        // See https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html
        const result = iam.Grant.addToPrincipalOrResource({
            grantee,
            actions: ['secretsmanager:PutSecretValue', 'secretsmanager:UpdateSecret'],
            resourceArns: [this.arnForPolicies],
            resource: this,
        });
        if (this.encryptionKey) {
            // See https://docs.aws.amazon.com/kms/latest/developerguide/services-secrets-manager.html
            this.encryptionKey.grantEncrypt(new kms.ViaServicePrincipal(`secretsmanager.${core_1.Stack.of(this).region}.amazonaws.com`, grantee.grantPrincipal));
        }
        // Throw if secret is not imported and it's shared cross account and no KMS key is provided
        if (this instanceof Secret && result.resourceStatement && !this.encryptionKey) {
            throw new Error('KMS Key must be provided for cross account access to Secret');
        }
        return result;
    }
    get secretValue() {
        return this.secretValueFromJson('');
    }
    secretValueFromJson(jsonField) {
        return core_1.SecretValue.secretsManager(this.secretArn, { jsonField });
    }
    addRotationSchedule(id, options) {
        return new rotation_schedule_1.RotationSchedule(this, id, {
            secret: this,
            ...options,
        });
    }
    addToResourcePolicy(statement) {
        if (!this.policy && this.autoCreatePolicy) {
            this.policy = new policy_1.ResourcePolicy(this, 'Policy', { secret: this });
        }
        if (this.policy) {
            this.policy.document.addStatements(statement);
            return { statementAdded: true, policyDependable: this.policy };
        }
        return { statementAdded: false };
    }
    denyAccountRootDelete() {
        this.addToResourcePolicy(new iam.PolicyStatement({
            actions: ['secretsmanager:DeleteSecret'],
            effect: iam.Effect.DENY,
            resources: ['*'],
            principals: [new iam.AccountRootPrincipal()],
        }));
    }
    /**
     * Provides an identifier for this secret for use in IAM policies.
     * If there is a full ARN, this is just the ARN;
     * if we have a partial ARN -- due to either importing by secret name or partial ARN --
     * then we need to add a suffix to capture the full ARN's format.
     */
    get arnForPolicies() {
        return this.secretFullArn ? this.secretFullArn : `${this.secretArn}-??????`;
    }
    /**
     * Attach a target to this secret
     *
     * @param target The target to attach
     * @returns An attached secret
     */
    attach(target) {
        const id = 'Attachment';
        const existing = this.node.tryFindChild(id);
        if (existing) {
            throw new Error('Secret is already attached to a target.');
        }
        return new SecretTargetAttachment(this, id, {
            secret: this,
            target,
        });
    }
}
/**
 * Creates a new secret in AWS SecretsManager.
 */
class Secret extends SecretBase {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.secretName,
        });
        this.replicaRegions = [];
        this.autoCreatePolicy = true;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_SecretProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Secret);
            }
            throw error;
        }
        if (props.generateSecretString &&
            (props.generateSecretString.secretStringTemplate || props.generateSecretString.generateStringKey) &&
            !(props.generateSecretString.secretStringTemplate && props.generateSecretString.generateStringKey)) {
            throw new Error('`secretStringTemplate` and `generateStringKey` must be specified together.');
        }
        if ((props.generateSecretString ? 1 : 0)
            + (props.secretStringBeta1 ? 1 : 0)
            + (props.secretStringValue ? 1 : 0)
            + (props.secretObjectValue ? 1 : 0)
            > 1) {
            throw new Error('Cannot specify more than one of `generateSecretString`, `secretStringValue`, `secretObjectValue`, and `secretStringBeta1`.');
        }
        const secretString = props.secretObjectValue
            ? this.resolveSecretObjectValue(props.secretObjectValue)
            : props.secretStringValue?.unsafeUnwrap() ?? props.secretStringBeta1?.secretValue();
        const resource = new secretsmanager.CfnSecret(this, 'Resource', {
            description: props.description,
            kmsKeyId: props.encryptionKey && props.encryptionKey.keyArn,
            generateSecretString: props.generateSecretString ?? (secretString ? undefined : {}),
            secretString,
            name: this.physicalName,
            replicaRegions: core_1.Lazy.any({ produce: () => this.replicaRegions }, { omitEmptyArray: true }),
        });
        resource.applyRemovalPolicy(props.removalPolicy, {
            default: core_1.RemovalPolicy.DESTROY,
        });
        this.secretArn = this.getResourceArnAttribute(resource.ref, {
            service: 'secretsmanager',
            resource: 'secret',
            resourceName: this.physicalName,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
        this.encryptionKey = props.encryptionKey;
        const parseOwnedSecretName = core_1.FeatureFlags.of(this).isEnabled(cxapi.SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME);
        this.secretName = parseOwnedSecretName
            ? parseSecretNameForOwnedSecret(this, this.secretArn, props.secretName)
            : parseSecretName(this, this.secretArn);
        // @see https://docs.aws.amazon.com/kms/latest/developerguide/services-secrets-manager.html#asm-authz
        const principal = new kms.ViaServicePrincipal(`secretsmanager.${core_1.Stack.of(this).region}.amazonaws.com`, new iam.AccountPrincipal(core_1.Stack.of(this).account));
        this.encryptionKey?.grantEncryptDecrypt(principal);
        this.encryptionKey?.grant(principal, 'kms:CreateGrant', 'kms:DescribeKey');
        for (const replica of props.replicaRegions ?? []) {
            this.addReplicaRegion(replica.region, replica.encryptionKey);
        }
        this.excludeCharacters = props.generateSecretString?.excludeCharacters;
    }
    /**
     * Return whether the given object is a Secret.
     */
    static isSecret(x) {
        return x !== null && typeof (x) === 'object' && SECRET_SYMBOL in x;
    }
    /** @deprecated use `fromSecretCompleteArn` or `fromSecretPartialArn` */
    static fromSecretArn(scope, id, secretArn) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-secretsmanager.Secret#fromSecretArn", "use `fromSecretCompleteArn` or `fromSecretPartialArn`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromSecretArn);
            }
            throw error;
        }
        const attrs = arnIsComplete(secretArn) ? { secretCompleteArn: secretArn } : { secretPartialArn: secretArn };
        return Secret.fromSecretAttributes(scope, id, attrs);
    }
    /** Imports a secret by complete ARN. The complete ARN is the ARN with the Secrets Manager-supplied suffix. */
    static fromSecretCompleteArn(scope, id, secretCompleteArn) {
        return Secret.fromSecretAttributes(scope, id, { secretCompleteArn });
    }
    /** Imports a secret by partial ARN. The partial ARN is the ARN without the Secrets Manager-supplied suffix. */
    static fromSecretPartialArn(scope, id, secretPartialArn) {
        return Secret.fromSecretAttributes(scope, id, { secretPartialArn });
    }
    /**
     * Imports a secret by secret name; the ARN of the Secret will be set to the secret name.
     * A secret with this name must exist in the same account & region.
     * @deprecated use `fromSecretNameV2`
     */
    static fromSecretName(scope, id, secretName) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-secretsmanager.Secret#fromSecretName", "use `fromSecretNameV2`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromSecretName);
            }
            throw error;
        }
        return new class extends SecretBase {
            constructor() {
                super(...arguments);
                this.encryptionKey = undefined;
                this.secretArn = secretName;
                this.secretName = secretName;
                this.autoCreatePolicy = false;
            }
            get secretFullArn() { return undefined; }
            // Overrides the secretArn for grant* methods, where the secretArn must be in ARN format.
            // Also adds a wildcard to the resource name to support the SecretsManager-provided suffix.
            get arnForPolicies() {
                return core_1.Stack.of(this).formatArn({
                    service: 'secretsmanager',
                    resource: 'secret',
                    resourceName: this.secretName + '*',
                    arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
                });
            }
        }(scope, id);
    }
    /**
     * Imports a secret by secret name.
     * A secret with this name must exist in the same account & region.
     * Replaces the deprecated `fromSecretName`.
     */
    static fromSecretNameV2(scope, id, secretName) {
        return new class extends SecretBase {
            constructor() {
                super(...arguments);
                this.encryptionKey = undefined;
                this.secretName = secretName;
                this.secretArn = this.partialArn;
                this.autoCreatePolicy = false;
            }
            get secretFullArn() { return undefined; }
            // Creates a "partial" ARN from the secret name. The "full" ARN would include the SecretsManager-provided suffix.
            get partialArn() {
                return core_1.Stack.of(this).formatArn({
                    service: 'secretsmanager',
                    resource: 'secret',
                    resourceName: secretName,
                    arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
                });
            }
        }(scope, id);
    }
    /**
     * Import an existing secret into the Stack.
     *
     * @param scope the scope of the import.
     * @param id    the ID of the imported Secret in the construct tree.
     * @param attrs the attributes of the imported secret.
     */
    static fromSecretAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_SecretAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromSecretAttributes);
            }
            throw error;
        }
        let secretArn;
        let secretArnIsPartial;
        if (attrs.secretArn) {
            if (attrs.secretCompleteArn || attrs.secretPartialArn) {
                throw new Error('cannot use `secretArn` with `secretCompleteArn` or `secretPartialArn`');
            }
            secretArn = attrs.secretArn;
            secretArnIsPartial = false;
        }
        else {
            if ((attrs.secretCompleteArn && attrs.secretPartialArn) ||
                (!attrs.secretCompleteArn && !attrs.secretPartialArn)) {
                throw new Error('must use only one of `secretCompleteArn` or `secretPartialArn`');
            }
            if (attrs.secretCompleteArn && !arnIsComplete(attrs.secretCompleteArn)) {
                throw new Error('`secretCompleteArn` does not appear to be complete; missing 6-character suffix');
            }
            [secretArn, secretArnIsPartial] = attrs.secretCompleteArn ? [attrs.secretCompleteArn, false] : [attrs.secretPartialArn, true];
        }
        return new class extends SecretBase {
            constructor() {
                super(...arguments);
                this.encryptionKey = attrs.encryptionKey;
                this.secretArn = secretArn;
                this.secretName = parseSecretName(scope, secretArn);
                this.autoCreatePolicy = false;
            }
            get secretFullArn() { return secretArnIsPartial ? undefined : secretArn; }
        }(scope, id, { environmentFromArn: secretArn });
    }
    resolveSecretObjectValue(secretObject) {
        const resolvedObject = {};
        for (const [key, value] of Object.entries(secretObject)) {
            resolvedObject[key] = value.unsafeUnwrap();
        }
        return JSON.stringify(resolvedObject);
    }
    /**
     * Adds a target attachment to the secret.
     *
     * @returns an AttachedSecret
     *
     * @deprecated use `attach()` instead
     */
    addTargetAttachment(id, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-secretsmanager.Secret#addTargetAttachment", "use `attach()` instead");
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_AttachedSecretOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addTargetAttachment);
            }
            throw error;
        }
        return new SecretTargetAttachment(this, id, {
            secret: this,
            ...options,
        });
    }
    /**
     * Adds a replica region for the secret
     *
     * @param region The name of the region
     * @param encryptionKey The customer-managed encryption key to use for encrypting the secret value.
     */
    addReplicaRegion(region, encryptionKey) {
        const stack = core_1.Stack.of(this);
        if (!core_1.Token.isUnresolved(stack.region) && !core_1.Token.isUnresolved(region) && region === stack.region) {
            throw new Error('Cannot add the region where this stack is deployed as a replica region.');
        }
        this.replicaRegions.push({
            region,
            kmsKeyId: encryptionKey?.keyArn,
        });
    }
}
exports.Secret = Secret;
_b = JSII_RTTI_SYMBOL_1;
Secret[_b] = { fqn: "@aws-cdk/aws-secretsmanager.Secret", version: "0.0.0" };
/**
 * The type of service or database that's being associated with the secret.
 */
var AttachmentTargetType;
(function (AttachmentTargetType) {
    /**
     * AWS::RDS::DBInstance
     */
    AttachmentTargetType["RDS_DB_INSTANCE"] = "AWS::RDS::DBInstance";
    /**
     * A database instance
     *
     * @deprecated use RDS_DB_INSTANCE instead
     */
    AttachmentTargetType["INSTANCE"] = "deprecated_AWS::RDS::DBInstance";
    /**
     * AWS::RDS::DBCluster
     */
    AttachmentTargetType["RDS_DB_CLUSTER"] = "AWS::RDS::DBCluster";
    /**
     * A database cluster
     *
     * @deprecated use RDS_DB_CLUSTER instead
     */
    AttachmentTargetType["CLUSTER"] = "deprecated_AWS::RDS::DBCluster";
    /**
     * AWS::RDS::DBProxy
     */
    AttachmentTargetType["RDS_DB_PROXY"] = "AWS::RDS::DBProxy";
    /**
     * AWS::Redshift::Cluster
     */
    AttachmentTargetType["REDSHIFT_CLUSTER"] = "AWS::Redshift::Cluster";
    /**
     * AWS::DocDB::DBInstance
     */
    AttachmentTargetType["DOCDB_DB_INSTANCE"] = "AWS::DocDB::DBInstance";
    /**
     * AWS::DocDB::DBCluster
     */
    AttachmentTargetType["DOCDB_DB_CLUSTER"] = "AWS::DocDB::DBCluster";
})(AttachmentTargetType = exports.AttachmentTargetType || (exports.AttachmentTargetType = {}));
/**
 * An attached secret.
 */
class SecretTargetAttachment extends SecretBase {
    constructor(scope, id, props) {
        super(scope, id);
        this.autoCreatePolicy = true;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_SecretTargetAttachmentProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SecretTargetAttachment);
            }
            throw error;
        }
        this.attachedSecret = props.secret;
        const attachment = new secretsmanager.CfnSecretTargetAttachment(this, 'Resource', {
            secretId: this.attachedSecret.secretArn,
            targetId: props.target.asSecretAttachmentTarget().targetId,
            targetType: attachmentTargetTypeToString(props.target.asSecretAttachmentTarget().targetType),
        });
        this.encryptionKey = this.attachedSecret.encryptionKey;
        this.secretName = this.attachedSecret.secretName;
        // This allows to reference the secret after attachment (dependency).
        this.secretArn = attachment.ref;
        this.secretTargetAttachmentSecretArn = attachment.ref;
    }
    static fromSecretTargetAttachmentSecretArn(scope, id, secretTargetAttachmentSecretArn) {
        class Import extends SecretBase {
            constructor() {
                super(...arguments);
                this.secretArn = secretTargetAttachmentSecretArn;
                this.secretTargetAttachmentSecretArn = secretTargetAttachmentSecretArn;
                this.secretName = parseSecretName(scope, secretTargetAttachmentSecretArn);
                this.autoCreatePolicy = false;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Forward any additions to the resource policy to the original secret.
     * This is required because a secret can only have a single resource policy.
     * If we do not forward policy additions, a new policy resource is created using the secret attachment ARN.
     * This ends up being rejected by CloudFormation.
     */
    addToResourcePolicy(statement) {
        if (core_1.FeatureFlags.of(this).isEnabled(cxapi.SECRETS_MANAGER_TARGET_ATTACHMENT_RESOURCE_POLICY)) {
            return this.attachedSecret.addToResourcePolicy(statement);
        }
        return super.addToResourcePolicy(statement);
    }
}
exports.SecretTargetAttachment = SecretTargetAttachment;
_c = JSII_RTTI_SYMBOL_1;
SecretTargetAttachment[_c] = { fqn: "@aws-cdk/aws-secretsmanager.SecretTargetAttachment", version: "0.0.0" };
/** Parses the secret name from the ARN. */
function parseSecretName(construct, secretArn) {
    const resourceName = core_1.Stack.of(construct).splitArn(secretArn, core_1.ArnFormat.COLON_RESOURCE_NAME).resourceName;
    if (resourceName) {
        // Can't operate on the token to remove the SecretsManager suffix, so just return the full secret name
        if (core_1.Token.isUnresolved(resourceName)) {
            return resourceName;
        }
        // Secret resource names are in the format `${secretName}-${6-character SecretsManager suffix}`
        // If there is no hyphen (or 6-character suffix) assume no suffix was provided, and return the whole name.
        const lastHyphenIndex = resourceName.lastIndexOf('-');
        const hasSecretsSuffix = lastHyphenIndex !== -1 && resourceName.slice(lastHyphenIndex + 1).length === 6;
        return hasSecretsSuffix ? resourceName.slice(0, lastHyphenIndex) : resourceName;
    }
    throw new Error('invalid ARN format; no secret name provided');
}
/**
 * Parses the secret name from the ARN of an owned secret. With owned secrets we know a few things we don't with imported secrets:
 * - The ARN is guaranteed to be a full ARN, with suffix.
 * - The name -- if provided -- will tell us how many hyphens to expect in the final secret name.
 * - If the name is not provided, we know the format used by CloudFormation for auto-generated names.
 *
 * Note: This is done rather than just returning the secret name passed in by the user to keep the relationship
 * explicit between the Secret and wherever the secretName might be used (i.e., using Tokens).
 */
function parseSecretNameForOwnedSecret(construct, secretArn, secretName) {
    const resourceName = core_1.Stack.of(construct).splitArn(secretArn, core_1.ArnFormat.COLON_RESOURCE_NAME).resourceName;
    if (!resourceName) {
        throw new Error('invalid ARN format; no secret name provided');
    }
    // Secret name was explicitly provided, but is unresolved; best option is to use it directly.
    // If it came from another Secret, it should (hopefully) already be properly formatted.
    if (secretName && core_1.Token.isUnresolved(secretName)) {
        return secretName;
    }
    // If no secretName was provided, the name will be automatically generated by CloudFormation.
    // The autogenerated names have the form of `${logicalID}-${random}`.
    // Otherwise, we can use the existing secretName to determine how to parse the resulting resourceName.
    const secretNameHyphenatedSegments = secretName ? secretName.split('-').length : 2;
    // 2 => [0, 1]
    const segmentIndexes = [...new Array(secretNameHyphenatedSegments)].map((_, i) => i);
    // Create the secret name from the resource name by joining all the known segments together.
    // This should have the effect of stripping the final hyphen and SecretManager suffix.
    return core_1.Fn.join('-', segmentIndexes.map(i => core_1.Fn.select(i, core_1.Fn.split('-', resourceName))));
}
/** Performs a best guess if an ARN is complete, based on if it ends with a 6-character suffix. */
function arnIsComplete(secretArn) {
    return core_1.Token.isUnresolved(secretArn) || /-[a-z0-9]{6}$/i.test(secretArn);
}
/**
 * Mark all instances of 'Secret'.
 */
Object.defineProperty(Secret.prototype, SECRET_SYMBOL, {
    value: true,
    enumerable: false,
    writable: false,
});
function attachmentTargetTypeToString(x) {
    switch (x) {
        case AttachmentTargetType.RDS_DB_INSTANCE:
        case AttachmentTargetType.INSTANCE:
            return 'AWS::RDS::DBInstance';
        case AttachmentTargetType.RDS_DB_CLUSTER:
        case AttachmentTargetType.CLUSTER:
            return 'AWS::RDS::DBCluster';
        case AttachmentTargetType.RDS_DB_PROXY:
            return 'AWS::RDS::DBProxy';
        case AttachmentTargetType.REDSHIFT_CLUSTER:
            return 'AWS::Redshift::Cluster';
        case AttachmentTargetType.DOCDB_DB_INSTANCE:
            return 'AWS::DocDB::DBInstance';
        case AttachmentTargetType.DOCDB_DB_CLUSTER:
            return 'AWS::DocDB::DBCluster';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcmV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VjcmV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsd0NBQWlLO0FBQ2pLLHlDQUF5QztBQUV6QyxxQ0FBMEM7QUFDMUMsMkRBQWdGO0FBQ2hGLDZEQUE2RDtBQUU3RCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFnT25FOzs7Ozs7O0dBT0c7QUFDSCxNQUFhLHNCQUFzQjtJQXNEakMsWUFBcUMsWUFBb0I7UUFBcEIsaUJBQVksR0FBWixZQUFZLENBQVE7S0FBSztJQXBEOUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLG1CQUFtQixDQUFDLFdBQW1COzs7Ozs7OztNQUFJLE9BQU8sSUFBSSxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFO0lBRTFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW1DRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQTRCOzs7Ozs7Ozs7O1FBQ2xELElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLEVBQUU7WUFDN0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxvSUFBb0ksQ0FBQyxDQUFDO1NBQ3ZKO1FBQ0QsT0FBTyxJQUFJLHNCQUFzQixDQUFDLG9CQUFvQixDQUFDLENBQUM7S0FDekQ7SUFJRCwrQkFBK0I7SUFDeEIsV0FBVzs7Ozs7Ozs7TUFBYSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRTs7QUF6RDVELHdEQTBEQzs7O0FBZ0NEOztHQUVHO0FBQ0gsTUFBZSxVQUFXLFNBQVEsZUFBUTtJQVN4QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQXVCLEVBQUU7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFB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RyxTQUFTLGFBQWEsQ0FBQyxTQUFpQjtJQUN0QyxPQUFPLFlBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzNFLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUU7SUFDckQsS0FBSyxFQUFFLElBQUk7SUFDWCxVQUFVLEVBQUUsS0FBSztJQUNqQixRQUFRLEVBQUUsS0FBSztDQUNoQixDQUFDLENBQUM7QUFFSCxTQUFTLDRCQUE0QixDQUFDLENBQXVCO0lBQzNELFFBQVEsQ0FBQyxFQUFFO1FBQ1QsS0FBSyxvQkFBb0IsQ0FBQyxlQUFlLENBQUM7UUFDMUMsS0FBSyxvQkFBb0IsQ0FBQyxRQUFRO1lBQ2hDLE9BQU8sc0JBQXNCLENBQUM7UUFDaEMsS0FBSyxvQkFBb0IsQ0FBQyxjQUFjLENBQUM7UUFDekMsS0FBSyxvQkFBb0IsQ0FBQyxPQUFPO1lBQy9CLE9BQU8scUJBQXFCLENBQUM7UUFDL0IsS0FBSyxvQkFBb0IsQ0FBQyxZQUFZO1lBQ3BDLE9BQU8sbUJBQW1CLENBQUM7UUFDN0IsS0FBSyxvQkFBb0IsQ0FBQyxnQkFBZ0I7WUFDeEMsT0FBTyx3QkFBd0IsQ0FBQztRQUNsQyxLQUFLLG9CQUFvQixDQUFDLGlCQUFpQjtZQUN6QyxPQUFPLHdCQUF3QixDQUFDO1FBQ2xDLEtBQUssb0JBQW9CLENBQUMsZ0JBQWdCO1lBQ3hDLE9BQU8sdUJBQXVCLENBQUM7S0FDbEM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0IHsgQXJuRm9ybWF0LCBGZWF0dXJlRmxhZ3MsIEZuLCBJUmVzb3VyY2UsIExhenksIFJlbW92YWxQb2xpY3ksIFJlc291cmNlLCBSZXNvdXJjZVByb3BzLCBTZWNyZXRWYWx1ZSwgU3RhY2ssIFRva2VuLCBUb2tlbkNvbXBhcmlzb24gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBJQ29uc3RydWN0LCBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFJlc291cmNlUG9saWN5IH0gZnJvbSAnLi9wb2xpY3knO1xuaW1wb3J0IHsgUm90YXRpb25TY2hlZHVsZSwgUm90YXRpb25TY2hlZHVsZU9wdGlvbnMgfSBmcm9tICcuL3JvdGF0aW9uLXNjaGVkdWxlJztcbmltcG9ydCAqIGFzIHNlY3JldHNtYW5hZ2VyIGZyb20gJy4vc2VjcmV0c21hbmFnZXIuZ2VuZXJhdGVkJztcblxuY29uc3QgU0VDUkVUX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL3NlY3JldHNtYW5hZ2VyLlNlY3JldCcpO1xuXG4vKipcbiAqIEEgc2VjcmV0IGluIEFXUyBTZWNyZXRzIE1hbmFnZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVNlY3JldCBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgY3VzdG9tZXItbWFuYWdlZCBlbmNyeXB0aW9uIGtleSB0aGF0IGlzIHVzZWQgdG8gZW5jcnlwdCB0aGlzIHNlY3JldCwgaWYgYW55LiBXaGVuIG5vdCBzcGVjaWZpZWQsIHRoZSBkZWZhdWx0XG4gICAqIEtNUyBrZXkgZm9yIHRoZSBhY2NvdW50IGFuZCByZWdpb24gaXMgYmVpbmcgdXNlZC5cbiAgICovXG4gIHJlYWRvbmx5IGVuY3J5cHRpb25LZXk/OiBrbXMuSUtleTtcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgc2VjcmV0IGluIEFXUyBTZWNyZXRzIE1hbmFnZXIuIFdpbGwgcmV0dXJuIHRoZSBmdWxsIEFSTiBpZiBhdmFpbGFibGUsIG90aGVyd2lzZSBhIHBhcnRpYWwgYXJuLlxuICAgKiBGb3Igc2VjcmV0cyBpbXBvcnRlZCBieSB0aGUgZGVwcmVjYXRlZCBgZnJvbVNlY3JldE5hbWVgLCBpdCB3aWxsIHJldHVybiB0aGUgYHNlY3JldE5hbWVgLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBzZWNyZXRBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGZ1bGwgQVJOIG9mIHRoZSBzZWNyZXQgaW4gQVdTIFNlY3JldHMgTWFuYWdlciwgd2hpY2ggaXMgdGhlIEFSTiBpbmNsdWRpbmcgdGhlIFNlY3JldHMgTWFuYWdlci1zdXBwbGllZCA2LWNoYXJhY3RlciBzdWZmaXguXG4gICAqIFRoaXMgaXMgZXF1YWwgdG8gYHNlY3JldEFybmAgaW4gbW9zdCBjYXNlcywgYnV0IGlzIHVuZGVmaW5lZCB3aGVuIGEgZnVsbCBBUk4gaXMgbm90IGF2YWlsYWJsZSAoZS5nLiwgc2VjcmV0cyBpbXBvcnRlZCBieSBuYW1lKS5cbiAgICovXG4gIHJlYWRvbmx5IHNlY3JldEZ1bGxBcm4/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzZWNyZXQuXG4gICAqXG4gICAqIEZvciBcIm93bmVkXCIgc2VjcmV0cywgdGhpcyB3aWxsIGJlIHRoZSBmdWxsIHJlc291cmNlIG5hbWUgKHNlY3JldCBuYW1lICsgc3VmZml4KSwgdW5sZXNzIHRoZVxuICAgKiAnQGF3cy1jZGsvYXdzLXNlY3JldHNtYW5hZ2VyOnBhcnNlT3duZWRTZWNyZXROYW1lJyBmZWF0dXJlIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjcmV0TmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgdmFsdWUgb2YgdGhlIHN0b3JlZCBzZWNyZXQgYXMgYSBgU2VjcmV0VmFsdWVgLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBzZWNyZXRWYWx1ZTogU2VjcmV0VmFsdWU7XG5cbiAgLyoqXG4gICAqIEludGVycHJldCB0aGUgc2VjcmV0IGFzIGEgSlNPTiBvYmplY3QgYW5kIHJldHVybiBhIGZpZWxkJ3MgdmFsdWUgZnJvbSBpdCBhcyBhIGBTZWNyZXRWYWx1ZWAuXG4gICAqL1xuICBzZWNyZXRWYWx1ZUZyb21Kc29uKGtleTogc3RyaW5nKTogU2VjcmV0VmFsdWU7XG5cbiAgLyoqXG4gICAqIEdyYW50cyByZWFkaW5nIHRoZSBzZWNyZXQgdmFsdWUgdG8gc29tZSByb2xlLlxuICAgKlxuICAgKiBAcGFyYW0gZ3JhbnRlZSAgICAgICB0aGUgcHJpbmNpcGFsIGJlaW5nIGdyYW50ZWQgcGVybWlzc2lvbi5cbiAgICogQHBhcmFtIHZlcnNpb25TdGFnZXMgdGhlIHZlcnNpb24gc3RhZ2VzIHRoZSBncmFudCBpcyBsaW1pdGVkIHRvLiBJZiBub3Qgc3BlY2lmaWVkLCBubyByZXN0cmljdGlvbiBvbiB0aGUgdmVyc2lvblxuICAgKiAgICAgICAgICAgICAgICAgICAgICBzdGFnZXMgaXMgYXBwbGllZC5cbiAgICovXG4gIGdyYW50UmVhZChncmFudGVlOiBpYW0uSUdyYW50YWJsZSwgdmVyc2lvblN0YWdlcz86IHN0cmluZ1tdKTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBHcmFudHMgd3JpdGluZyBhbmQgdXBkYXRpbmcgdGhlIHNlY3JldCB2YWx1ZSB0byBzb21lIHJvbGUuXG4gICAqXG4gICAqIEBwYXJhbSBncmFudGVlICAgICAgIHRoZSBwcmluY2lwYWwgYmVpbmcgZ3JhbnRlZCBwZXJtaXNzaW9uLlxuICAgKi9cbiAgZ3JhbnRXcml0ZShncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogQWRkcyBhIHJvdGF0aW9uIHNjaGVkdWxlIHRvIHRoZSBzZWNyZXQuXG4gICAqL1xuICBhZGRSb3RhdGlvblNjaGVkdWxlKGlkOiBzdHJpbmcsIG9wdGlvbnM6IFJvdGF0aW9uU2NoZWR1bGVPcHRpb25zKTogUm90YXRpb25TY2hlZHVsZTtcblxuICAvKipcbiAgICogQWRkcyBhIHN0YXRlbWVudCB0byB0aGUgSUFNIHJlc291cmNlIHBvbGljeSBhc3NvY2lhdGVkIHdpdGggdGhpcyBzZWNyZXQuXG4gICAqXG4gICAqIElmIHRoaXMgc2VjcmV0IHdhcyBjcmVhdGVkIGluIHRoaXMgc3RhY2ssIGEgcmVzb3VyY2UgcG9saWN5IHdpbGwgYmVcbiAgICogYXV0b21hdGljYWxseSBjcmVhdGVkIHVwb24gdGhlIGZpcnN0IGNhbGwgdG8gYGFkZFRvUmVzb3VyY2VQb2xpY3lgLiBJZlxuICAgKiB0aGUgc2VjcmV0IGlzIGltcG9ydGVkLCB0aGVuIHRoaXMgaXMgYSBuby1vcC5cbiAgICovXG4gIGFkZFRvUmVzb3VyY2VQb2xpY3koc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KTogaWFtLkFkZFRvUmVzb3VyY2VQb2xpY3lSZXN1bHQ7XG5cbiAgLyoqXG4gICAqIERlbmllcyB0aGUgYERlbGV0ZVNlY3JldGAgYWN0aW9uIHRvIGFsbCBwcmluY2lwYWxzIHdpdGhpbiB0aGUgY3VycmVudFxuICAgKiBhY2NvdW50LlxuICAgKi9cbiAgZGVueUFjY291bnRSb290RGVsZXRlKCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEF0dGFjaCBhIHRhcmdldCB0byB0aGlzIHNlY3JldC5cbiAgICpcbiAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHRvIGF0dGFjaC5cbiAgICogQHJldHVybnMgQW4gYXR0YWNoZWQgc2VjcmV0XG4gICAqL1xuICBhdHRhY2godGFyZ2V0OiBJU2VjcmV0QXR0YWNobWVudFRhcmdldCk6IElTZWNyZXQ7XG59XG5cbi8qKlxuICogVGhlIHByb3BlcnRpZXMgcmVxdWlyZWQgdG8gY3JlYXRlIGEgbmV3IHNlY3JldCBpbiBBV1MgU2VjcmV0cyBNYW5hZ2VyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlY3JldFByb3BzIHtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsLCBodW1hbi1mcmllbmRseSBkZXNjcmlwdGlvbiBvZiB0aGUgc2VjcmV0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXN0b21lci1tYW5hZ2VkIGVuY3J5cHRpb24ga2V5IHRvIHVzZSBmb3IgZW5jcnlwdGluZyB0aGUgc2VjcmV0IHZhbHVlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgZGVmYXVsdCBLTVMga2V5IGZvciB0aGUgYWNjb3VudCBhbmQgcmVnaW9uIGlzIHVzZWQuXG4gICAqL1xuICByZWFkb25seSBlbmNyeXB0aW9uS2V5Pzoga21zLklLZXk7XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gZm9yIGhvdyB0byBnZW5lcmF0ZSBhIHNlY3JldCB2YWx1ZS5cbiAgICpcbiAgICogT25seSBvbmUgb2YgYHNlY3JldFN0cmluZ2AgYW5kIGBnZW5lcmF0ZVNlY3JldFN0cmluZ2AgY2FuIGJlIHByb3ZpZGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIDMyIGNoYXJhY3RlcnMgd2l0aCB1cHBlci1jYXNlIGxldHRlcnMsIGxvd2VyLWNhc2UgbGV0dGVycywgcHVuY3R1YXRpb24gYW5kIG51bWJlcnMgKGF0IGxlYXN0IG9uZSBmcm9tIGVhY2hcbiAgICogY2F0ZWdvcnkpLCBwZXIgdGhlIGRlZmF1bHQgdmFsdWVzIG9mIGBgU2VjcmV0U3RyaW5nR2VuZXJhdG9yYGAuXG4gICAqL1xuICByZWFkb25seSBnZW5lcmF0ZVNlY3JldFN0cmluZz86IFNlY3JldFN0cmluZ0dlbmVyYXRvcjtcblxuICAvKipcbiAgICogQSBuYW1lIGZvciB0aGUgc2VjcmV0LiBOb3RlIHRoYXQgZGVsZXRpbmcgc2VjcmV0cyBmcm9tIFNlY3JldHNNYW5hZ2VyIGRvZXMgbm90IGhhcHBlbiBpbW1lZGlhdGVseSwgYnV0IGFmdGVyIGEgNyB0b1xuICAgKiAzMCBkYXlzIGJsYWNrb3V0IHBlcmlvZC4gRHVyaW5nIHRoYXQgcGVyaW9kLCBpdCBpcyBub3QgcG9zc2libGUgdG8gY3JlYXRlIGFub3RoZXIgc2VjcmV0IHRoYXQgc2hhcmVzIHRoZSBzYW1lIG5hbWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBuYW1lIGlzIGdlbmVyYXRlZCBieSBDbG91ZEZvcm1hdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHNlY3JldE5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEluaXRpYWwgdmFsdWUgZm9yIHRoZSBzZWNyZXRcbiAgICpcbiAgICogKipOT1RFOioqICpJdCBpcyAqKmhpZ2hseSoqIGVuY291cmFnZWQgdG8gbGVhdmUgdGhpcyBmaWVsZCB1bmRlZmluZWQgYW5kIGFsbG93IFNlY3JldHNNYW5hZ2VyIHRvIGNyZWF0ZSB0aGUgc2VjcmV0IHZhbHVlLlxuICAgKiBUaGUgc2VjcmV0IHN0cmluZyAtLSBpZiBwcm92aWRlZCAtLSB3aWxsIGJlIGluY2x1ZGVkIGluIHRoZSBvdXRwdXQgb2YgdGhlIGNkayBhcyBwYXJ0IG9mIHN5bnRoZXNpcyxcbiAgICogYW5kIHdpbGwgYXBwZWFyIGluIHRoZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBpbiB0aGUgY29uc29sZS4gVGhpcyBjYW4gYmUgc2VjdXJlKC1pc2gpIGlmIHRoYXQgdmFsdWUgaXMgbWVyZWx5IHJlZmVyZW5jZSB0b1xuICAgKiBhbm90aGVyIHJlc291cmNlIChvciBvbmUgb2YgaXRzIGF0dHJpYnV0ZXMpLCBidXQgaWYgdGhlIHZhbHVlIGlzIGEgcGxhaW50ZXh0IHN0cmluZywgaXQgd2lsbCBiZSB2aXNpYmxlIHRvIGFueW9uZSB3aXRoIGFjY2Vzc1xuICAgKiB0byB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgKHZpYSB0aGUgQVdTIENvbnNvbGUsIFNES3MsIG9yIENMSSkuXG4gICAqXG4gICAqIFNwZWNpZmllcyB0ZXh0IGRhdGEgdGhhdCB5b3Ugd2FudCB0byBlbmNyeXB0IGFuZCBzdG9yZSBpbiB0aGlzIG5ldyB2ZXJzaW9uIG9mIHRoZSBzZWNyZXQuXG4gICAqIE1heSBiZSBhIHNpbXBsZSBzdHJpbmcgdmFsdWUsIG9yIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgSlNPTiBzdHJ1Y3R1cmUuXG4gICAqXG4gICAqIE9ubHkgb25lIG9mIGBzZWNyZXRTdHJpbmdCZXRhMWAsIGBzZWNyZXRTdHJpbmdWYWx1ZWAsIGFuZCBgZ2VuZXJhdGVTZWNyZXRTdHJpbmdgIGNhbiBiZSBwcm92aWRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBTZWNyZXRzTWFuYWdlciBnZW5lcmF0ZXMgYSBuZXcgc2VjcmV0IHZhbHVlLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHNlY3JldFN0cmluZ1ZhbHVlYCBpbnN0ZWFkLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjcmV0U3RyaW5nQmV0YTE/OiBTZWNyZXRTdHJpbmdWYWx1ZUJldGExO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsIHZhbHVlIGZvciB0aGUgc2VjcmV0XG4gICAqXG4gICAqICoqTk9URToqKiAqSXQgaXMgKipoaWdobHkqKiBlbmNvdXJhZ2VkIHRvIGxlYXZlIHRoaXMgZmllbGQgdW5kZWZpbmVkIGFuZCBhbGxvdyBTZWNyZXRzTWFuYWdlciB0byBjcmVhdGUgdGhlIHNlY3JldCB2YWx1ZS5cbiAgICogVGhlIHNlY3JldCBzdHJpbmcgLS0gaWYgcHJvdmlkZWQgLS0gd2lsbCBiZSBpbmNsdWRlZCBpbiB0aGUgb3V0cHV0IG9mIHRoZSBjZGsgYXMgcGFydCBvZiBzeW50aGVzaXMsXG4gICAqIGFuZCB3aWxsIGFwcGVhciBpbiB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgaW4gdGhlIGNvbnNvbGUuIFRoaXMgY2FuIGJlIHNlY3VyZSgtaXNoKSBpZiB0aGF0IHZhbHVlIGlzIG1lcmVseSByZWZlcmVuY2UgdG9cbiAgICogYW5vdGhlciByZXNvdXJjZSAob3Igb25lIG9mIGl0cyBhdHRyaWJ1dGVzKSwgYnV0IGlmIHRoZSB2YWx1ZSBpcyBhIHBsYWludGV4dCBzdHJpbmcsIGl0IHdpbGwgYmUgdmlzaWJsZSB0byBhbnlvbmUgd2l0aCBhY2Nlc3NcbiAgICogdG8gdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlICh2aWEgdGhlIEFXUyBDb25zb2xlLCBTREtzLCBvciBDTEkpLlxuICAgKlxuICAgKiBTcGVjaWZpZXMgdGV4dCBkYXRhIHRoYXQgeW91IHdhbnQgdG8gZW5jcnlwdCBhbmQgc3RvcmUgaW4gdGhpcyBuZXcgdmVyc2lvbiBvZiB0aGUgc2VjcmV0LlxuICAgKiBNYXkgYmUgYSBzaW1wbGUgc3RyaW5nIHZhbHVlLiBUbyBwcm92aWRlIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIEpTT04gc3RydWN0dXJlLCB1c2UgYFNlY3JldFByb3BzLnNlY3JldE9iamVjdFZhbHVlYCBpbnN0ZWFkLlxuICAgKlxuICAgKiBPbmx5IG9uZSBvZiBgc2VjcmV0U3RyaW5nQmV0YTFgLCBgc2VjcmV0U3RyaW5nVmFsdWVgLCAnc2VjcmV0T2JqZWN0VmFsdWUnLCBhbmQgYGdlbmVyYXRlU2VjcmV0U3RyaW5nYCBjYW4gYmUgcHJvdmlkZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gU2VjcmV0c01hbmFnZXIgZ2VuZXJhdGVzIGEgbmV3IHNlY3JldCB2YWx1ZS5cbiAgICovXG4gIHJlYWRvbmx5IHNlY3JldFN0cmluZ1ZhbHVlPzogU2VjcmV0VmFsdWU7XG5cbiAgLyoqXG4gICAqIEluaXRpYWwgdmFsdWUgZm9yIGEgSlNPTiBzZWNyZXRcbiAgICpcbiAgICogKipOT1RFOioqICpJdCBpcyAqKmhpZ2hseSoqIGVuY291cmFnZWQgdG8gbGVhdmUgdGhpcyBmaWVsZCB1bmRlZmluZWQgYW5kIGFsbG93IFNlY3JldHNNYW5hZ2VyIHRvIGNyZWF0ZSB0aGUgc2VjcmV0IHZhbHVlLlxuICAgKiBUaGUgc2VjcmV0IG9iamVjdCAtLSBpZiBwcm92aWRlZCAtLSB3aWxsIGJlIGluY2x1ZGVkIGluIHRoZSBvdXRwdXQgb2YgdGhlIGNkayBhcyBwYXJ0IG9mIHN5bnRoZXNpcyxcbiAgICogYW5kIHdpbGwgYXBwZWFyIGluIHRoZSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBpbiB0aGUgY29uc29sZS4gVGhpcyBjYW4gYmUgc2VjdXJlKC1pc2gpIGlmIHRoYXQgdmFsdWUgaXMgbWVyZWx5IHJlZmVyZW5jZSB0b1xuICAgKiBhbm90aGVyIHJlc291cmNlIChvciBvbmUgb2YgaXRzIGF0dHJpYnV0ZXMpLCBidXQgaWYgdGhlIHZhbHVlIGlzIGEgcGxhaW50ZXh0IHN0cmluZywgaXQgd2lsbCBiZSB2aXNpYmxlIHRvIGFueW9uZSB3aXRoIGFjY2Vzc1xuICAgKiB0byB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgKHZpYSB0aGUgQVdTIENvbnNvbGUsIFNES3MsIG9yIENMSSkuXG4gICAqXG4gICAqIFNwZWNpZmllcyBhIEpTT04gb2JqZWN0IHRoYXQgeW91IHdhbnQgdG8gZW5jcnlwdCBhbmQgc3RvcmUgaW4gdGhpcyBuZXcgdmVyc2lvbiBvZiB0aGUgc2VjcmV0LlxuICAgKiBUbyBzcGVjaWZ5IGEgc2ltcGxlIHN0cmluZyB2YWx1ZSBpbnN0ZWFkLCB1c2UgYFNlY3JldFByb3BzLnNlY3JldFN0cmluZ1ZhbHVlYFxuICAgKlxuICAgKiBPbmx5IG9uZSBvZiBgc2VjcmV0U3RyaW5nQmV0YTFgLCBgc2VjcmV0U3RyaW5nVmFsdWVgLCAnc2VjcmV0T2JqZWN0VmFsdWUnLCBhbmQgYGdlbmVyYXRlU2VjcmV0U3RyaW5nYCBjYW4gYmUgcHJvdmlkZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGRlY2xhcmUgY29uc3QgdXNlcjogaWFtLlVzZXI7XG4gICAqIGRlY2xhcmUgY29uc3QgYWNjZXNzS2V5OiBpYW0uQWNjZXNzS2V5O1xuICAgKiBkZWNsYXJlIGNvbnN0IHN0YWNrOiBTdGFjaztcbiAgICogbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ0pTT05TZWNyZXQnLCB7XG4gICAqICAgc2VjcmV0T2JqZWN0VmFsdWU6IHtcbiAgICogICAgIHVzZXJuYW1lOiBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQodXNlci51c2VyTmFtZSksIC8vIGludHJpbnNpYyByZWZlcmVuY2UsIG5vdCBleHBvc2VkIGFzIHBsYWludGV4dFxuICAgKiAgICAgZGF0YWJhc2U6IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnZm9vJyksIC8vIHJlbmRlcmVkIGFzIHBsYWluIHRleHQsIGJ1dCBub3QgYSBzZWNyZXRcbiAgICogICAgIHBhc3N3b3JkOiBhY2Nlc3NLZXkuc2VjcmV0QWNjZXNzS2V5LCAvLyBTZWNyZXRWYWx1ZVxuICAgKiAgIH0sXG4gICAqIH0pO1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIFNlY3JldHNNYW5hZ2VyIGdlbmVyYXRlcyBhIG5ldyBzZWNyZXQgdmFsdWUuXG4gICAqL1xuICByZWFkb25seSBzZWNyZXRPYmplY3RWYWx1ZT86IHsgW2tleTogc3RyaW5nXTogU2VjcmV0VmFsdWUgfTtcblxuICAvKipcbiAgICogUG9saWN5IHRvIGFwcGx5IHdoZW4gdGhlIHNlY3JldCBpcyByZW1vdmVkIGZyb20gdGhpcyBzdGFjay5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb3Qgc2V0LlxuICAgKi9cbiAgcmVhZG9ubHkgcmVtb3ZhbFBvbGljeT86IFJlbW92YWxQb2xpY3k7XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiByZWdpb25zIHdoZXJlIHRvIHJlcGxpY2F0ZSB0aGlzIHNlY3JldC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBTZWNyZXQgaXMgbm90IHJlcGxpY2F0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHJlcGxpY2FSZWdpb25zPzogUmVwbGljYVJlZ2lvbltdO1xufVxuXG4vKipcbiAqIFNlY3JldCByZXBsaWNhIHJlZ2lvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlcGxpY2FSZWdpb24ge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHJlZ2lvblxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXN0b21lci1tYW5hZ2VkIGVuY3J5cHRpb24ga2V5IHRvIHVzZSBmb3IgZW5jcnlwdGluZyB0aGUgc2VjcmV0IHZhbHVlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgZGVmYXVsdCBLTVMga2V5IGZvciB0aGUgYWNjb3VudCBhbmQgcmVnaW9uIGlzIHVzZWQuXG4gICAqL1xuICByZWFkb25seSBlbmNyeXB0aW9uS2V5Pzoga21zLklLZXk7XG59XG5cbi8qKlxuICogQW4gZXhwZXJpbWVudGFsIGNsYXNzIHVzZWQgdG8gc3BlY2lmeSBhbiBpbml0aWFsIHNlY3JldCB2YWx1ZSBmb3IgYSBTZWNyZXQuXG4gKlxuICogVGhlIGNsYXNzIHdyYXBzIGEgc2ltcGxlIHN0cmluZyAob3IgSlNPTiByZXByZXNlbnRhdGlvbikgaW4gb3JkZXIgdG8gcHJvdmlkZSBzb21lIHNhZmV0eSBjaGVja3MgYW5kIHdhcm5pbmdzXG4gKiBhYm91dCB0aGUgZGFuZ2VycyBvZiB1c2luZyBwbGFpbnRleHQgc3RyaW5ncyBhcyBpbml0aWFsIHNlY3JldCBzZWVkIHZhbHVlcyB2aWEgQ0RLL0Nsb3VkRm9ybWF0aW9uLlxuICpcbiAqIEBkZXByZWNhdGVkIFVzZSBgY2RrLlNlY3JldFZhbHVlYCBpbnN0ZWFkLlxuICovXG5leHBvcnQgY2xhc3MgU2VjcmV0U3RyaW5nVmFsdWVCZXRhMSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBgU2VjcmV0U3RyaW5nVmFsdWVCZXRhMWAgZnJvbSBhIHBsYWludGV4dCB2YWx1ZS5cbiAgICpcbiAgICogVGhpcyBhcHByb2FjaCBpcyBpbmhlcmVudGx5IHVuc2FmZSwgYXMgdGhlIHNlY3JldCB2YWx1ZSBtYXkgYmUgdmlzaWJsZSBpbiB5b3VyIHNvdXJjZSBjb250cm9sIHJlcG9zaXRvcnlcbiAgICogYW5kIHdpbGwgYWxzbyBhcHBlYXIgaW4gcGxhaW50ZXh0IGluIHRoZSByZXN1bHRpbmcgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUsIGluY2x1ZGluZyBpbiB0aGUgQVdTIENvbnNvbGUgb3IgQVBJcy5cbiAgICogVXNhZ2Ugb2YgdGhpcyBtZXRob2QgaXMgZGlzY291cmFnZWQsIGVzcGVjaWFsbHkgZm9yIHByb2R1Y3Rpb24gd29ya2xvYWRzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tVW5zYWZlUGxhaW50ZXh0KHNlY3JldFZhbHVlOiBzdHJpbmcpIHsgcmV0dXJuIG5ldyBTZWNyZXRTdHJpbmdWYWx1ZUJldGExKHNlY3JldFZhbHVlKTsgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgYFNlY3JldFZhbHVlVmFsdWVCZXRhMWAgZnJvbSBhIHN0cmluZyB2YWx1ZSBjb21pbmcgZnJvbSBhIFRva2VuLlxuICAgKlxuICAgKiBUaGUgaW50ZW50IGlzIHRvIGVuYWJsZSBjcmVhdGluZyBzZWNyZXRzIGZyb20gcmVmZXJlbmNlcyAoZS5nLiwgYFJlZmAsIGBGbjo6R2V0QXR0YCkgZnJvbSBvdGhlciByZXNvdXJjZXMuXG4gICAqIFRoaXMgbWlnaHQgYmUgdGhlIGRpcmVjdCBvdXRwdXQgb2YgYW5vdGhlciBDb25zdHJ1Y3QsIG9yIHRoZSBvdXRwdXQgb2YgYSBDdXN0b20gUmVzb3VyY2UuXG4gICAqIFRoaXMgbWV0aG9kIHRocm93cyBpZiBpdCBkZXRlcm1pbmVzIHRoZSBpbnB1dCBpcyBhbiB1bnNhZmUgcGxhaW50ZXh0IHN0cmluZy5cbiAgICpcbiAgICogRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIC8vIENyZWF0ZXMgYSBuZXcgSUFNIHVzZXIsIGFjY2VzcyBhbmQgc2VjcmV0IGtleXMsIGFuZCBzdG9yZXMgdGhlIHNlY3JldCBhY2Nlc3Mga2V5IGluIGEgU2VjcmV0LlxuICAgKiBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHRoaXMsICdVc2VyJyk7XG4gICAqIGNvbnN0IGFjY2Vzc0tleSA9IG5ldyBpYW0uQWNjZXNzS2V5KHRoaXMsICdBY2Nlc3NLZXknLCB7IHVzZXIgfSk7XG4gICAqIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQodGhpcywgJ1NlY3JldCcsIHtcbiAgICogXHRzZWNyZXRTdHJpbmdWYWx1ZTogYWNjZXNzS2V5LnNlY3JldEFjY2Vzc0tleSxcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGUgc2VjcmV0IG1heSBhbHNvIGJlIGVtYmVkZGVkIGluIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgSlNPTiBzdHJ1Y3R1cmU6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIodGhpcywgJ1VzZXInKTtcbiAgICogY29uc3QgYWNjZXNzS2V5ID0gbmV3IGlhbS5BY2Nlc3NLZXkodGhpcywgJ0FjY2Vzc0tleScsIHsgdXNlciB9KTtcbiAgICogY29uc3Qgc2VjcmV0VmFsdWUgPSBzZWNyZXRzbWFuYWdlci5TZWNyZXRTdHJpbmdWYWx1ZUJldGExLmZyb21Ub2tlbihKU09OLnN0cmluZ2lmeSh7XG4gICAqICAgdXNlcm5hbWU6IHVzZXIudXNlck5hbWUsXG4gICAqICAgZGF0YWJhc2U6ICdmb28nLFxuICAgKiAgIHBhc3N3b3JkOiBhY2Nlc3NLZXkuc2VjcmV0QWNjZXNzS2V5LnVuc2FmZVVud3JhcCgpLFxuICAgKiB9KSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhlIHZhbHVlIGJlaW5nIGEgVG9rZW4gZG9lcyAqbm90KiBndWFyYW50ZWUgc2FmZXR5LiBGb3IgZXhhbXBsZSwgYSBMYXp5LWV2YWx1YXRlZCBzdHJpbmdcbiAgICogKGUuZy4sIGBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdteUluc2VjdXJlUGFzc3dvcmQnIH0pKWApIGlzIGEgVG9rZW4sIGJ1dCBhcyB0aGUgb3V0cHV0IGlzXG4gICAqIHVsdGltYXRlbHkgYSBwbGFpbnRleHQgc3RyaW5nLCBhbmQgc28gaW5zZWN1cmUuXG4gICAqXG4gICAqIEBwYXJhbSBzZWNyZXRWYWx1ZUZyb21Ub2tlbiBhIHNlY3JldCB2YWx1ZSBjb21pbmcgZnJvbSBhIENvbnN0cnVjdCBhdHRyaWJ1dGUgb3IgQ3VzdG9tIFJlc291cmNlIG91dHB1dFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tVG9rZW4oc2VjcmV0VmFsdWVGcm9tVG9rZW46IHN0cmluZykge1xuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKHNlY3JldFZhbHVlRnJvbVRva2VuKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZWNyZXRTdHJpbmdWYWx1ZUJldGExIGFwcGVhcnMgdG8gYmUgcGxhaW50ZXh0ICh1bnNhZmUpIHN0cmluZyAob3IgcmVzb2x2ZWQgVG9rZW4pOyB1c2UgZnJvbVVuc2FmZVBsYWludGV4dCBpZiB0aGlzIGlzIGludGVudGlvbmFsJyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgU2VjcmV0U3RyaW5nVmFsdWVCZXRhMShzZWNyZXRWYWx1ZUZyb21Ub2tlbik7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX3NlY3JldFZhbHVlOiBzdHJpbmcpIHsgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBzZWNyZXQgdmFsdWUgKi9cbiAgcHVibGljIHNlY3JldFZhbHVlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9zZWNyZXRWYWx1ZTsgfVxufVxuXG4vKipcbiAqIEF0dHJpYnV0ZXMgcmVxdWlyZWQgdG8gaW1wb3J0IGFuIGV4aXN0aW5nIHNlY3JldCBpbnRvIHRoZSBTdGFjay5cbiAqIE9uZSBBUk4gZm9ybWF0IChgc2VjcmV0QXJuYCwgYHNlY3JldENvbXBsZXRlQXJuYCwgYHNlY3JldFBhcnRpYWxBcm5gKSBtdXN0IGJlIHByb3ZpZGVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlY3JldEF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIGVuY3J5cHRpb24ga2V5IHRoYXQgaXMgdXNlZCB0byBlbmNyeXB0IHRoZSBzZWNyZXQsIHVubGVzcyB0aGUgZGVmYXVsdCBTZWNyZXRzTWFuYWdlciBrZXkgaXMgdXNlZC5cbiAgICovXG4gIHJlYWRvbmx5IGVuY3J5cHRpb25LZXk/OiBrbXMuSUtleTtcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgc2VjcmV0IGluIFNlY3JldHNNYW5hZ2VyLlxuICAgKiBDYW5ub3QgYmUgdXNlZCB3aXRoIGBzZWNyZXRDb21wbGV0ZUFybmAgb3IgYHNlY3JldFBhcnRpYWxBcm5gLlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYHNlY3JldENvbXBsZXRlQXJuYCBvciBgc2VjcmV0UGFydGlhbEFybmAgaW5zdGVhZC5cbiAgICovXG4gIHJlYWRvbmx5IHNlY3JldEFybj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNvbXBsZXRlIEFSTiBvZiB0aGUgc2VjcmV0IGluIFNlY3JldHNNYW5hZ2VyLiBUaGlzIGlzIHRoZSBBUk4gaW5jbHVkaW5nIHRoZSBTZWNyZXRzIE1hbmFnZXIgNi1jaGFyYWN0ZXIgc3VmZml4LlxuICAgKiBDYW5ub3QgYmUgdXNlZCB3aXRoIGBzZWNyZXRBcm5gIG9yIGBzZWNyZXRQYXJ0aWFsQXJuYC5cbiAgICovXG4gIHJlYWRvbmx5IHNlY3JldENvbXBsZXRlQXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGFydGlhbCBBUk4gb2YgdGhlIHNlY3JldCBpbiBTZWNyZXRzTWFuYWdlci4gVGhpcyBpcyB0aGUgQVJOIHdpdGhvdXQgdGhlIFNlY3JldHMgTWFuYWdlciA2LWNoYXJhY3RlciBzdWZmaXguXG4gICAqIENhbm5vdCBiZSB1c2VkIHdpdGggYHNlY3JldEFybmAgb3IgYHNlY3JldENvbXBsZXRlQXJuYC5cbiAgICovXG4gIHJlYWRvbmx5IHNlY3JldFBhcnRpYWxBcm4/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIGNvbW1vbiBiZWhhdmlvciBvZiBTZWNyZXRzLiBVc2VycyBzaG91bGQgbm90IHVzZSB0aGlzIGNsYXNzIGRpcmVjdGx5LCBhbmQgaW5zdGVhZCB1c2UgYGBTZWNyZXRgYC5cbiAqL1xuYWJzdHJhY3QgY2xhc3MgU2VjcmV0QmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVNlY3JldCB7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBlbmNyeXB0aW9uS2V5Pzoga21zLklLZXk7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBzZWNyZXRBcm46IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHNlY3JldE5hbWU6IHN0cmluZztcblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgYXV0b0NyZWF0ZVBvbGljeTogYm9vbGVhbjtcblxuICBwcml2YXRlIHBvbGljeT86IFJlc291cmNlUG9saWN5O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBSZXNvdXJjZVByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMucG9saWN5Py5kb2N1bWVudC52YWxpZGF0ZUZvclJlc291cmNlUG9saWN5KCkgPz8gW10gfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHNlY3JldEZ1bGxBcm4oKTogc3RyaW5nIHwgdW5kZWZpbmVkIHsgcmV0dXJuIHRoaXMuc2VjcmV0QXJuOyB9XG5cbiAgcHVibGljIGdyYW50UmVhZChncmFudGVlOiBpYW0uSUdyYW50YWJsZSwgdmVyc2lvblN0YWdlcz86IHN0cmluZ1tdKTogaWFtLkdyYW50IHtcbiAgICAvLyBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zZWNyZXRzbWFuYWdlci9sYXRlc3QvdXNlcmd1aWRlL2F1dGgtYW5kLWFjY2Vzc19pZGVudGl0eS1iYXNlZC1wb2xpY2llcy5odG1sXG5cbiAgICBjb25zdCByZXN1bHQgPSBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWxPclJlc291cmNlKHtcbiAgICAgIGdyYW50ZWUsXG4gICAgICBhY3Rpb25zOiBbJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJywgJ3NlY3JldHNtYW5hZ2VyOkRlc2NyaWJlU2VjcmV0J10sXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLmFybkZvclBvbGljaWVzXSxcbiAgICAgIHJlc291cmNlOiB0aGlzLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc3RhdGVtZW50ID0gcmVzdWx0LnByaW5jaXBhbFN0YXRlbWVudCB8fCByZXN1bHQucmVzb3VyY2VTdGF0ZW1lbnQ7XG4gICAgaWYgKHZlcnNpb25TdGFnZXMgIT0gbnVsbCAmJiBzdGF0ZW1lbnQpIHtcbiAgICAgIHN0YXRlbWVudC5hZGRDb25kaXRpb24oJ0ZvckFueVZhbHVlOlN0cmluZ0VxdWFscycsIHtcbiAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOlZlcnNpb25TdGFnZSc6IHZlcnNpb25TdGFnZXMsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbmNyeXB0aW9uS2V5KSB7XG4gICAgICAvLyBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9rbXMvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3NlcnZpY2VzLXNlY3JldHMtbWFuYWdlci5odG1sXG4gICAgICB0aGlzLmVuY3J5cHRpb25LZXkuZ3JhbnREZWNyeXB0KFxuICAgICAgICBuZXcga21zLlZpYVNlcnZpY2VQcmluY2lwYWwoYHNlY3JldHNtYW5hZ2VyLiR7U3RhY2sub2YodGhpcykucmVnaW9ufS5hbWF6b25hd3MuY29tYCwgZ3JhbnRlZS5ncmFudFByaW5jaXBhbCksXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGNyb3NzQWNjb3VudCA9IFRva2VuLmNvbXBhcmVTdHJpbmdzKFN0YWNrLm9mKHRoaXMpLmFjY291bnQsIGdyYW50ZWUuZ3JhbnRQcmluY2lwYWwucHJpbmNpcGFsQWNjb3VudCB8fCAnJyk7XG5cbiAgICAvLyBUaHJvdyBpZiBzZWNyZXQgaXMgbm90IGltcG9ydGVkIGFuZCBpdCdzIHNoYXJlZCBjcm9zcyBhY2NvdW50IGFuZCBubyBLTVMga2V5IGlzIHByb3ZpZGVkXG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBTZWNyZXQgJiYgcmVzdWx0LnJlc291cmNlU3RhdGVtZW50ICYmICghdGhpcy5lbmNyeXB0aW9uS2V5ICYmIGNyb3NzQWNjb3VudCA9PT0gVG9rZW5Db21wYXJpc29uLkRJRkZFUkVOVCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignS01TIEtleSBtdXN0IGJlIHByb3ZpZGVkIGZvciBjcm9zcyBhY2NvdW50IGFjY2VzcyB0byBTZWNyZXQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIGdyYW50V3JpdGUoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIC8vIFNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc2VjcmV0c21hbmFnZXIvbGF0ZXN0L3VzZXJndWlkZS9hdXRoLWFuZC1hY2Nlc3NfaWRlbnRpdHktYmFzZWQtcG9saWNpZXMuaHRtbFxuICAgIGNvbnN0IHJlc3VsdCA9IGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbE9yUmVzb3VyY2Uoe1xuICAgICAgZ3JhbnRlZSxcbiAgICAgIGFjdGlvbnM6IFsnc2VjcmV0c21hbmFnZXI6UHV0U2VjcmV0VmFsdWUnLCAnc2VjcmV0c21hbmFnZXI6VXBkYXRlU2VjcmV0J10sXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLmFybkZvclBvbGljaWVzXSxcbiAgICAgIHJlc291cmNlOiB0aGlzLFxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuZW5jcnlwdGlvbktleSkge1xuICAgICAgLy8gU2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9rbXMvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3NlcnZpY2VzLXNlY3JldHMtbWFuYWdlci5odG1sXG4gICAgICB0aGlzLmVuY3J5cHRpb25LZXkuZ3JhbnRFbmNyeXB0KFxuICAgICAgICBuZXcga21zLlZpYVNlcnZpY2VQcmluY2lwYWwoYHNlY3JldHNtYW5hZ2VyLiR7U3RhY2sub2YodGhpcykucmVnaW9ufS5hbWF6b25hd3MuY29tYCwgZ3JhbnRlZS5ncmFudFByaW5jaXBhbCksXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFRocm93IGlmIHNlY3JldCBpcyBub3QgaW1wb3J0ZWQgYW5kIGl0J3Mgc2hhcmVkIGNyb3NzIGFjY291bnQgYW5kIG5vIEtNUyBrZXkgaXMgcHJvdmlkZWRcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFNlY3JldCAmJiByZXN1bHQucmVzb3VyY2VTdGF0ZW1lbnQgJiYgIXRoaXMuZW5jcnlwdGlvbktleSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdLTVMgS2V5IG11c3QgYmUgcHJvdmlkZWQgZm9yIGNyb3NzIGFjY291bnQgYWNjZXNzIHRvIFNlY3JldCcpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHNlY3JldFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLnNlY3JldFZhbHVlRnJvbUpzb24oJycpO1xuICB9XG5cbiAgcHVibGljIHNlY3JldFZhbHVlRnJvbUpzb24oanNvbkZpZWxkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIodGhpcy5zZWNyZXRBcm4sIHsganNvbkZpZWxkIH0pO1xuICB9XG5cbiAgcHVibGljIGFkZFJvdGF0aW9uU2NoZWR1bGUoaWQ6IHN0cmluZywgb3B0aW9uczogUm90YXRpb25TY2hlZHVsZU9wdGlvbnMpOiBSb3RhdGlvblNjaGVkdWxlIHtcbiAgICByZXR1cm4gbmV3IFJvdGF0aW9uU2NoZWR1bGUodGhpcywgaWQsIHtcbiAgICAgIHNlY3JldDogdGhpcyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpOiBpYW0uQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdCB7XG4gICAgaWYgKCF0aGlzLnBvbGljeSAmJiB0aGlzLmF1dG9DcmVhdGVQb2xpY3kpIHtcbiAgICAgIHRoaXMucG9saWN5ID0gbmV3IFJlc291cmNlUG9saWN5KHRoaXMsICdQb2xpY3knLCB7IHNlY3JldDogdGhpcyB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wb2xpY3kpIHtcbiAgICAgIHRoaXMucG9saWN5LmRvY3VtZW50LmFkZFN0YXRlbWVudHMoc3RhdGVtZW50KTtcbiAgICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiB0cnVlLCBwb2xpY3lEZXBlbmRhYmxlOiB0aGlzLnBvbGljeSB9O1xuICAgIH1cbiAgICByZXR1cm4geyBzdGF0ZW1lbnRBZGRlZDogZmFsc2UgfTtcbiAgfVxuXG4gIHB1YmxpYyBkZW55QWNjb3VudFJvb3REZWxldGUoKSB7XG4gICAgdGhpcy5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnc2VjcmV0c21hbmFnZXI6RGVsZXRlU2VjcmV0J10sXG4gICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuREVOWSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpXSxcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgYW4gaWRlbnRpZmllciBmb3IgdGhpcyBzZWNyZXQgZm9yIHVzZSBpbiBJQU0gcG9saWNpZXMuXG4gICAqIElmIHRoZXJlIGlzIGEgZnVsbCBBUk4sIHRoaXMgaXMganVzdCB0aGUgQVJOO1xuICAgKiBpZiB3ZSBoYXZlIGEgcGFydGlhbCBBUk4gLS0gZHVlIHRvIGVpdGhlciBpbXBvcnRpbmcgYnkgc2VjcmV0IG5hbWUgb3IgcGFydGlhbCBBUk4gLS1cbiAgICogdGhlbiB3ZSBuZWVkIHRvIGFkZCBhIHN1ZmZpeCB0byBjYXB0dXJlIHRoZSBmdWxsIEFSTidzIGZvcm1hdC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXQgYXJuRm9yUG9saWNpZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VjcmV0RnVsbEFybiA/IHRoaXMuc2VjcmV0RnVsbEFybiA6IGAke3RoaXMuc2VjcmV0QXJufS0/Pz8/Pz9gO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaCBhIHRhcmdldCB0byB0aGlzIHNlY3JldFxuICAgKlxuICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgdG8gYXR0YWNoXG4gICAqIEByZXR1cm5zIEFuIGF0dGFjaGVkIHNlY3JldFxuICAgKi9cbiAgcHVibGljIGF0dGFjaCh0YXJnZXQ6IElTZWNyZXRBdHRhY2htZW50VGFyZ2V0KTogSVNlY3JldCB7XG4gICAgY29uc3QgaWQgPSAnQXR0YWNobWVudCc7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLm5vZGUudHJ5RmluZENoaWxkKGlkKTtcblxuICAgIGlmIChleGlzdGluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZWNyZXQgaXMgYWxyZWFkeSBhdHRhY2hlZCB0byBhIHRhcmdldC4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFNlY3JldFRhcmdldEF0dGFjaG1lbnQodGhpcywgaWQsIHtcbiAgICAgIHNlY3JldDogdGhpcyxcbiAgICAgIHRhcmdldCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgc2VjcmV0IGluIEFXUyBTZWNyZXRzTWFuYWdlci5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlY3JldCBleHRlbmRzIFNlY3JldEJhc2Uge1xuICAvKipcbiAgICogUmV0dXJuIHdoZXRoZXIgdGhlIGdpdmVuIG9iamVjdCBpcyBhIFNlY3JldC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNTZWNyZXQoeDogYW55KTogeCBpcyBTZWNyZXQge1xuICAgIHJldHVybiB4ICE9PSBudWxsICYmIHR5cGVvZih4KSA9PT0gJ29iamVjdCcgJiYgU0VDUkVUX1NZTUJPTCBpbiB4O1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIHVzZSBgZnJvbVNlY3JldENvbXBsZXRlQXJuYCBvciBgZnJvbVNlY3JldFBhcnRpYWxBcm5gICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNlY3JldEFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzZWNyZXRBcm46IHN0cmluZyk6IElTZWNyZXQge1xuICAgIGNvbnN0IGF0dHJzID0gYXJuSXNDb21wbGV0ZShzZWNyZXRBcm4pID8geyBzZWNyZXRDb21wbGV0ZUFybjogc2VjcmV0QXJuIH0gOiB7IHNlY3JldFBhcnRpYWxBcm46IHNlY3JldEFybiB9O1xuICAgIHJldHVybiBTZWNyZXQuZnJvbVNlY3JldEF0dHJpYnV0ZXMoc2NvcGUsIGlkLCBhdHRycyk7XG4gIH1cblxuICAvKiogSW1wb3J0cyBhIHNlY3JldCBieSBjb21wbGV0ZSBBUk4uIFRoZSBjb21wbGV0ZSBBUk4gaXMgdGhlIEFSTiB3aXRoIHRoZSBTZWNyZXRzIE1hbmFnZXItc3VwcGxpZWQgc3VmZml4LiAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TZWNyZXRDb21wbGV0ZUFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzZWNyZXRDb21wbGV0ZUFybjogc3RyaW5nKTogSVNlY3JldCB7XG4gICAgcmV0dXJuIFNlY3JldC5mcm9tU2VjcmV0QXR0cmlidXRlcyhzY29wZSwgaWQsIHsgc2VjcmV0Q29tcGxldGVBcm4gfSk7XG4gIH1cblxuICAvKiogSW1wb3J0cyBhIHNlY3JldCBieSBwYXJ0aWFsIEFSTi4gVGhlIHBhcnRpYWwgQVJOIGlzIHRoZSBBUk4gd2l0aG91dCB0aGUgU2VjcmV0cyBNYW5hZ2VyLXN1cHBsaWVkIHN1ZmZpeC4gKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU2VjcmV0UGFydGlhbEFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzZWNyZXRQYXJ0aWFsQXJuOiBzdHJpbmcpOiBJU2VjcmV0IHtcbiAgICByZXR1cm4gU2VjcmV0LmZyb21TZWNyZXRBdHRyaWJ1dGVzKHNjb3BlLCBpZCwgeyBzZWNyZXRQYXJ0aWFsQXJuIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydHMgYSBzZWNyZXQgYnkgc2VjcmV0IG5hbWU7IHRoZSBBUk4gb2YgdGhlIFNlY3JldCB3aWxsIGJlIHNldCB0byB0aGUgc2VjcmV0IG5hbWUuXG4gICAqIEEgc2VjcmV0IHdpdGggdGhpcyBuYW1lIG11c3QgZXhpc3QgaW4gdGhlIHNhbWUgYWNjb3VudCAmIHJlZ2lvbi5cbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBmcm9tU2VjcmV0TmFtZVYyYFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU2VjcmV0TmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzZWNyZXROYW1lOiBzdHJpbmcpOiBJU2VjcmV0IHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgU2VjcmV0QmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZW5jcnlwdGlvbktleSA9IHVuZGVmaW5lZDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBzZWNyZXRBcm4gPSBzZWNyZXROYW1lO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHNlY3JldE5hbWUgPSBzZWNyZXROYW1lO1xuICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGF1dG9DcmVhdGVQb2xpY3kgPSBmYWxzZTtcbiAgICAgIHB1YmxpYyBnZXQgc2VjcmV0RnVsbEFybigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgICAgLy8gT3ZlcnJpZGVzIHRoZSBzZWNyZXRBcm4gZm9yIGdyYW50KiBtZXRob2RzLCB3aGVyZSB0aGUgc2VjcmV0QXJuIG11c3QgYmUgaW4gQVJOIGZvcm1hdC5cbiAgICAgIC8vIEFsc28gYWRkcyBhIHdpbGRjYXJkIHRvIHRoZSByZXNvdXJjZSBuYW1lIHRvIHN1cHBvcnQgdGhlIFNlY3JldHNNYW5hZ2VyLXByb3ZpZGVkIHN1ZmZpeC5cbiAgICAgIHByb3RlY3RlZCBnZXQgYXJuRm9yUG9saWNpZXMoKSB7XG4gICAgICAgIHJldHVybiBTdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgICAgIHNlcnZpY2U6ICdzZWNyZXRzbWFuYWdlcicsXG4gICAgICAgICAgcmVzb3VyY2U6ICdzZWNyZXQnLFxuICAgICAgICAgIHJlc291cmNlTmFtZTogdGhpcy5zZWNyZXROYW1lICsgJyonLFxuICAgICAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0oc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnRzIGEgc2VjcmV0IGJ5IHNlY3JldCBuYW1lLlxuICAgKiBBIHNlY3JldCB3aXRoIHRoaXMgbmFtZSBtdXN0IGV4aXN0IGluIHRoZSBzYW1lIGFjY291bnQgJiByZWdpb24uXG4gICAqIFJlcGxhY2VzIHRoZSBkZXByZWNhdGVkIGBmcm9tU2VjcmV0TmFtZWAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TZWNyZXROYW1lVjIoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgc2VjcmV0TmFtZTogc3RyaW5nKTogSVNlY3JldCB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIFNlY3JldEJhc2Uge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGVuY3J5cHRpb25LZXkgPSB1bmRlZmluZWQ7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc2VjcmV0TmFtZSA9IHNlY3JldE5hbWU7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc2VjcmV0QXJuID0gdGhpcy5wYXJ0aWFsQXJuO1xuICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGF1dG9DcmVhdGVQb2xpY3kgPSBmYWxzZTtcbiAgICAgIHB1YmxpYyBnZXQgc2VjcmV0RnVsbEFybigpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgICAgLy8gQ3JlYXRlcyBhIFwicGFydGlhbFwiIEFSTiBmcm9tIHRoZSBzZWNyZXQgbmFtZS4gVGhlIFwiZnVsbFwiIEFSTiB3b3VsZCBpbmNsdWRlIHRoZSBTZWNyZXRzTWFuYWdlci1wcm92aWRlZCBzdWZmaXguXG4gICAgICBwcml2YXRlIGdldCBwYXJ0aWFsQXJuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBTdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgICAgIHNlcnZpY2U6ICdzZWNyZXRzbWFuYWdlcicsXG4gICAgICAgICAgcmVzb3VyY2U6ICdzZWNyZXQnLFxuICAgICAgICAgIHJlc291cmNlTmFtZTogc2VjcmV0TmFtZSxcbiAgICAgICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIHNlY3JldCBpbnRvIHRoZSBTdGFjay5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIHRoZSBzY29wZSBvZiB0aGUgaW1wb3J0LlxuICAgKiBAcGFyYW0gaWQgICAgdGhlIElEIG9mIHRoZSBpbXBvcnRlZCBTZWNyZXQgaW4gdGhlIGNvbnN0cnVjdCB0cmVlLlxuICAgKiBAcGFyYW0gYXR0cnMgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGltcG9ydGVkIHNlY3JldC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNlY3JldEF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IFNlY3JldEF0dHJpYnV0ZXMpOiBJU2VjcmV0IHtcbiAgICBsZXQgc2VjcmV0QXJuOiBzdHJpbmc7XG4gICAgbGV0IHNlY3JldEFybklzUGFydGlhbDogYm9vbGVhbjtcblxuICAgIGlmIChhdHRycy5zZWNyZXRBcm4pIHtcbiAgICAgIGlmIChhdHRycy5zZWNyZXRDb21wbGV0ZUFybiB8fCBhdHRycy5zZWNyZXRQYXJ0aWFsQXJuKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IHVzZSBgc2VjcmV0QXJuYCB3aXRoIGBzZWNyZXRDb21wbGV0ZUFybmAgb3IgYHNlY3JldFBhcnRpYWxBcm5gJyk7XG4gICAgICB9XG4gICAgICBzZWNyZXRBcm4gPSBhdHRycy5zZWNyZXRBcm47XG4gICAgICBzZWNyZXRBcm5Jc1BhcnRpYWwgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKChhdHRycy5zZWNyZXRDb21wbGV0ZUFybiAmJiBhdHRycy5zZWNyZXRQYXJ0aWFsQXJuKSB8fFxuICAgICAgICAgICghYXR0cnMuc2VjcmV0Q29tcGxldGVBcm4gJiYgIWF0dHJzLnNlY3JldFBhcnRpYWxBcm4pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbXVzdCB1c2Ugb25seSBvbmUgb2YgYHNlY3JldENvbXBsZXRlQXJuYCBvciBgc2VjcmV0UGFydGlhbEFybmAnKTtcbiAgICAgIH1cbiAgICAgIGlmIChhdHRycy5zZWNyZXRDb21wbGV0ZUFybiAmJiAhYXJuSXNDb21wbGV0ZShhdHRycy5zZWNyZXRDb21wbGV0ZUFybikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgc2VjcmV0Q29tcGxldGVBcm5gIGRvZXMgbm90IGFwcGVhciB0byBiZSBjb21wbGV0ZTsgbWlzc2luZyA2LWNoYXJhY3RlciBzdWZmaXgnKTtcbiAgICAgIH1cbiAgICAgIFtzZWNyZXRBcm4sIHNlY3JldEFybklzUGFydGlhbF0gPSBhdHRycy5zZWNyZXRDb21wbGV0ZUFybiA/IFthdHRycy5zZWNyZXRDb21wbGV0ZUFybiwgZmFsc2VdIDogW2F0dHJzLnNlY3JldFBhcnRpYWxBcm4hLCB0cnVlXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgU2VjcmV0QmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZW5jcnlwdGlvbktleSA9IGF0dHJzLmVuY3J5cHRpb25LZXk7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc2VjcmV0QXJuID0gc2VjcmV0QXJuO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHNlY3JldE5hbWUgPSBwYXJzZVNlY3JldE5hbWUoc2NvcGUsIHNlY3JldEFybik7XG4gICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgYXV0b0NyZWF0ZVBvbGljeSA9IGZhbHNlO1xuICAgICAgcHVibGljIGdldCBzZWNyZXRGdWxsQXJuKCkgeyByZXR1cm4gc2VjcmV0QXJuSXNQYXJ0aWFsID8gdW5kZWZpbmVkIDogc2VjcmV0QXJuOyB9XG4gICAgfShzY29wZSwgaWQsIHsgZW52aXJvbm1lbnRGcm9tQXJuOiBzZWNyZXRBcm4gfSk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IGttcy5JS2V5O1xuICBwdWJsaWMgcmVhZG9ubHkgc2VjcmV0QXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBzZWNyZXROYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBzdHJpbmcgb2YgdGhlIGNoYXJhY3RlcnMgdGhhdCBhcmUgZXhjbHVkZWQgaW4gdGhpcyBzZWNyZXRcbiAgICogd2hlbiBpdCBpcyBnZW5lcmF0ZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZXhjbHVkZUNoYXJhY3RlcnM/OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZXBsaWNhUmVnaW9uczogc2VjcmV0c21hbmFnZXIuQ2ZuU2VjcmV0LlJlcGxpY2FSZWdpb25Qcm9wZXJ0eVtdID0gW107XG5cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGF1dG9DcmVhdGVQb2xpY3kgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTZWNyZXRQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnNlY3JldE5hbWUsXG4gICAgfSk7XG5cbiAgICBpZiAocHJvcHMuZ2VuZXJhdGVTZWNyZXRTdHJpbmcgJiZcbiAgICAgICAgKHByb3BzLmdlbmVyYXRlU2VjcmV0U3RyaW5nLnNlY3JldFN0cmluZ1RlbXBsYXRlIHx8IHByb3BzLmdlbmVyYXRlU2VjcmV0U3RyaW5nLmdlbmVyYXRlU3RyaW5nS2V5KSAmJlxuICAgICAgICAhKHByb3BzLmdlbmVyYXRlU2VjcmV0U3RyaW5nLnNlY3JldFN0cmluZ1RlbXBsYXRlICYmIHByb3BzLmdlbmVyYXRlU2VjcmV0U3RyaW5nLmdlbmVyYXRlU3RyaW5nS2V5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgc2VjcmV0U3RyaW5nVGVtcGxhdGVgIGFuZCBgZ2VuZXJhdGVTdHJpbmdLZXlgIG11c3QgYmUgc3BlY2lmaWVkIHRvZ2V0aGVyLicpO1xuICAgIH1cblxuICAgIGlmICgocHJvcHMuZ2VuZXJhdGVTZWNyZXRTdHJpbmcgPyAxIDogMClcbiAgICAgICsgKHByb3BzLnNlY3JldFN0cmluZ0JldGExID8gMSA6IDApXG4gICAgICArIChwcm9wcy5zZWNyZXRTdHJpbmdWYWx1ZSA/IDEgOiAwKVxuICAgICAgKyAocHJvcHMuc2VjcmV0T2JqZWN0VmFsdWUgPyAxIDogMClcbiAgICAgID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc3BlY2lmeSBtb3JlIHRoYW4gb25lIG9mIGBnZW5lcmF0ZVNlY3JldFN0cmluZ2AsIGBzZWNyZXRTdHJpbmdWYWx1ZWAsIGBzZWNyZXRPYmplY3RWYWx1ZWAsIGFuZCBgc2VjcmV0U3RyaW5nQmV0YTFgLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHNlY3JldFN0cmluZyA9IHByb3BzLnNlY3JldE9iamVjdFZhbHVlXG4gICAgICA/IHRoaXMucmVzb2x2ZVNlY3JldE9iamVjdFZhbHVlKHByb3BzLnNlY3JldE9iamVjdFZhbHVlKVxuICAgICAgOiBwcm9wcy5zZWNyZXRTdHJpbmdWYWx1ZT8udW5zYWZlVW53cmFwKCkgPz8gcHJvcHMuc2VjcmV0U3RyaW5nQmV0YTE/LnNlY3JldFZhbHVlKCk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBzZWNyZXRzbWFuYWdlci5DZm5TZWNyZXQodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgICAga21zS2V5SWQ6IHByb3BzLmVuY3J5cHRpb25LZXkgJiYgcHJvcHMuZW5jcnlwdGlvbktleS5rZXlBcm4sXG4gICAgICBnZW5lcmF0ZVNlY3JldFN0cmluZzogcHJvcHMuZ2VuZXJhdGVTZWNyZXRTdHJpbmcgPz8gKHNlY3JldFN0cmluZyA/IHVuZGVmaW5lZCA6IHt9KSxcbiAgICAgIHNlY3JldFN0cmluZyxcbiAgICAgIG5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgcmVwbGljYVJlZ2lvbnM6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZXBsaWNhUmVnaW9ucyB9LCB7IG9taXRFbXB0eUFycmF5OiB0cnVlIH0pLFxuICAgIH0pO1xuXG4gICAgcmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KHByb3BzLnJlbW92YWxQb2xpY3ksIHtcbiAgICAgIGRlZmF1bHQ6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2VjcmV0QXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShyZXNvdXJjZS5yZWYsIHtcbiAgICAgIHNlcnZpY2U6ICdzZWNyZXRzbWFuYWdlcicsXG4gICAgICByZXNvdXJjZTogJ3NlY3JldCcsXG4gICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICB9KTtcblxuICAgIHRoaXMuZW5jcnlwdGlvbktleSA9IHByb3BzLmVuY3J5cHRpb25LZXk7XG4gICAgY29uc3QgcGFyc2VPd25lZFNlY3JldE5hbWUgPSBGZWF0dXJlRmxhZ3Mub2YodGhpcykuaXNFbmFibGVkKGN4YXBpLlNFQ1JFVFNfTUFOQUdFUl9QQVJTRV9PV05FRF9TRUNSRVRfTkFNRSk7XG4gICAgdGhpcy5zZWNyZXROYW1lID0gcGFyc2VPd25lZFNlY3JldE5hbWVcbiAgICAgID8gcGFyc2VTZWNyZXROYW1lRm9yT3duZWRTZWNyZXQodGhpcywgdGhpcy5zZWNyZXRBcm4sIHByb3BzLnNlY3JldE5hbWUpXG4gICAgICA6IHBhcnNlU2VjcmV0TmFtZSh0aGlzLCB0aGlzLnNlY3JldEFybik7XG5cbiAgICAvLyBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9rbXMvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3NlcnZpY2VzLXNlY3JldHMtbWFuYWdlci5odG1sI2FzbS1hdXRoelxuICAgIGNvbnN0IHByaW5jaXBhbCA9XG4gICAgICBuZXcga21zLlZpYVNlcnZpY2VQcmluY2lwYWwoYHNlY3JldHNtYW5hZ2VyLiR7U3RhY2sub2YodGhpcykucmVnaW9ufS5hbWF6b25hd3MuY29tYCwgbmV3IGlhbS5BY2NvdW50UHJpbmNpcGFsKFN0YWNrLm9mKHRoaXMpLmFjY291bnQpKTtcbiAgICB0aGlzLmVuY3J5cHRpb25LZXk/LmdyYW50RW5jcnlwdERlY3J5cHQocHJpbmNpcGFsKTtcbiAgICB0aGlzLmVuY3J5cHRpb25LZXk/LmdyYW50KHByaW5jaXBhbCwgJ2ttczpDcmVhdGVHcmFudCcsICdrbXM6RGVzY3JpYmVLZXknKTtcblxuICAgIGZvciAoY29uc3QgcmVwbGljYSBvZiBwcm9wcy5yZXBsaWNhUmVnaW9ucyA/PyBbXSkge1xuICAgICAgdGhpcy5hZGRSZXBsaWNhUmVnaW9uKHJlcGxpY2EucmVnaW9uLCByZXBsaWNhLmVuY3J5cHRpb25LZXkpO1xuICAgIH1cblxuICAgIHRoaXMuZXhjbHVkZUNoYXJhY3RlcnMgPSBwcm9wcy5nZW5lcmF0ZVNlY3JldFN0cmluZz8uZXhjbHVkZUNoYXJhY3RlcnM7XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVTZWNyZXRPYmplY3RWYWx1ZShzZWNyZXRPYmplY3Q6IHsgW2tleTogc3RyaW5nXTogU2VjcmV0VmFsdWUgfSk6IHN0cmluZyB7XG4gICAgY29uc3QgcmVzb2x2ZWRPYmplY3Q6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhzZWNyZXRPYmplY3QpKSB7XG4gICAgICByZXNvbHZlZE9iamVjdFtrZXldID0gdmFsdWUudW5zYWZlVW53cmFwKCk7XG4gICAgfVxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShyZXNvbHZlZE9iamVjdCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHRhcmdldCBhdHRhY2htZW50IHRvIHRoZSBzZWNyZXQuXG4gICAqXG4gICAqIEByZXR1cm5zIGFuIEF0dGFjaGVkU2VjcmV0XG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgYXR0YWNoKClgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBhZGRUYXJnZXRBdHRhY2htZW50KGlkOiBzdHJpbmcsIG9wdGlvbnM6IEF0dGFjaGVkU2VjcmV0T3B0aW9ucyk6IFNlY3JldFRhcmdldEF0dGFjaG1lbnQge1xuICAgIHJldHVybiBuZXcgU2VjcmV0VGFyZ2V0QXR0YWNobWVudCh0aGlzLCBpZCwge1xuICAgICAgc2VjcmV0OiB0aGlzLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgcmVwbGljYSByZWdpb24gZm9yIHRoZSBzZWNyZXRcbiAgICpcbiAgICogQHBhcmFtIHJlZ2lvbiBUaGUgbmFtZSBvZiB0aGUgcmVnaW9uXG4gICAqIEBwYXJhbSBlbmNyeXB0aW9uS2V5IFRoZSBjdXN0b21lci1tYW5hZ2VkIGVuY3J5cHRpb24ga2V5IHRvIHVzZSBmb3IgZW5jcnlwdGluZyB0aGUgc2VjcmV0IHZhbHVlLlxuICAgKi9cbiAgcHVibGljIGFkZFJlcGxpY2FSZWdpb24ocmVnaW9uOiBzdHJpbmcsIGVuY3J5cHRpb25LZXk/OiBrbXMuSUtleSk6IHZvaWQge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YodGhpcyk7XG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoc3RhY2sucmVnaW9uKSAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKHJlZ2lvbikgJiYgcmVnaW9uID09PSBzdGFjay5yZWdpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFkZCB0aGUgcmVnaW9uIHdoZXJlIHRoaXMgc3RhY2sgaXMgZGVwbG95ZWQgYXMgYSByZXBsaWNhIHJlZ2lvbi4nKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlcGxpY2FSZWdpb25zLnB1c2goe1xuICAgICAgcmVnaW9uLFxuICAgICAga21zS2V5SWQ6IGVuY3J5cHRpb25LZXk/LmtleUFybixcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEEgc2VjcmV0IGF0dGFjaG1lbnQgdGFyZ2V0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElTZWNyZXRBdHRhY2htZW50VGFyZ2V0IHtcbiAgLyoqXG4gICAqIFJlbmRlcnMgdGhlIHRhcmdldCBzcGVjaWZpY2F0aW9ucy5cbiAgICovXG4gIGFzU2VjcmV0QXR0YWNobWVudFRhcmdldCgpOiBTZWNyZXRBdHRhY2htZW50VGFyZ2V0UHJvcHM7XG59XG5cbi8qKlxuICogVGhlIHR5cGUgb2Ygc2VydmljZSBvciBkYXRhYmFzZSB0aGF0J3MgYmVpbmcgYXNzb2NpYXRlZCB3aXRoIHRoZSBzZWNyZXQuXG4gKi9cbmV4cG9ydCBlbnVtIEF0dGFjaG1lbnRUYXJnZXRUeXBlIHtcbiAgLyoqXG4gICAqIEFXUzo6UkRTOjpEQkluc3RhbmNlXG4gICAqL1xuICBSRFNfREJfSU5TVEFOQ0UgPSAnQVdTOjpSRFM6OkRCSW5zdGFuY2UnLFxuXG4gIC8qKlxuICAgKiBBIGRhdGFiYXNlIGluc3RhbmNlXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBSRFNfREJfSU5TVEFOQ0UgaW5zdGVhZFxuICAgKi9cbiAgSU5TVEFOQ0UgPSAnZGVwcmVjYXRlZF9BV1M6OlJEUzo6REJJbnN0YW5jZScsXG5cbiAgLyoqXG4gICAqIEFXUzo6UkRTOjpEQkNsdXN0ZXJcbiAgICovXG4gIFJEU19EQl9DTFVTVEVSID0gJ0FXUzo6UkRTOjpEQkNsdXN0ZXInLFxuXG4gIC8qKlxuICAgKiBBIGRhdGFiYXNlIGNsdXN0ZXJcbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdXNlIFJEU19EQl9DTFVTVEVSIGluc3RlYWRcbiAgICovXG4gIENMVVNURVIgPSAnZGVwcmVjYXRlZF9BV1M6OlJEUzo6REJDbHVzdGVyJyxcblxuICAvKipcbiAgICogQVdTOjpSRFM6OkRCUHJveHlcbiAgICovXG4gIFJEU19EQl9QUk9YWSA9ICdBV1M6OlJEUzo6REJQcm94eScsXG5cbiAgLyoqXG4gICAqIEFXUzo6UmVkc2hpZnQ6OkNsdXN0ZXJcbiAgICovXG4gIFJFRFNISUZUX0NMVVNURVIgPSAnQVdTOjpSZWRzaGlmdDo6Q2x1c3RlcicsXG5cbiAgLyoqXG4gICAqIEFXUzo6RG9jREI6OkRCSW5zdGFuY2VcbiAgICovXG4gIERPQ0RCX0RCX0lOU1RBTkNFID0gJ0FXUzo6RG9jREI6OkRCSW5zdGFuY2UnLFxuXG4gIC8qKlxuICAgKiBBV1M6OkRvY0RCOjpEQkNsdXN0ZXJcbiAgICovXG4gIERPQ0RCX0RCX0NMVVNURVIgPSAnQVdTOjpEb2NEQjo6REJDbHVzdGVyJ1xufVxuXG4vKipcbiAqIEF0dGFjaG1lbnQgdGFyZ2V0IHNwZWNpZmljYXRpb25zLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlY3JldEF0dGFjaG1lbnRUYXJnZXRQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgaWQgb2YgdGhlIHRhcmdldCB0byBhdHRhY2ggdGhlIHNlY3JldCB0by5cbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRoZSB0YXJnZXQgdG8gYXR0YWNoIHRoZSBzZWNyZXQgdG8uXG4gICAqL1xuICByZWFkb25seSB0YXJnZXRUeXBlOiBBdHRhY2htZW50VGFyZ2V0VHlwZTtcbn1cblxuLyoqXG4gKiBPcHRpb25zIHRvIGFkZCBhIHNlY3JldCBhdHRhY2htZW50IHRvIGEgc2VjcmV0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEF0dGFjaGVkU2VjcmV0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgdGFyZ2V0IHRvIGF0dGFjaCB0aGUgc2VjcmV0IHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0OiBJU2VjcmV0QXR0YWNobWVudFRhcmdldDtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYW4gQXR0YWNoZWRTZWNyZXQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2VjcmV0VGFyZ2V0QXR0YWNobWVudFByb3BzIGV4dGVuZHMgQXR0YWNoZWRTZWNyZXRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBzZWNyZXQgdG8gYXR0YWNoIHRvIHRoZSB0YXJnZXQuXG4gICAqL1xuICByZWFkb25seSBzZWNyZXQ6IElTZWNyZXQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVNlY3JldFRhcmdldEF0dGFjaG1lbnQgZXh0ZW5kcyBJU2VjcmV0IHtcbiAgLyoqXG4gICAqIFNhbWUgYXMgYHNlY3JldEFybmBcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc2VjcmV0VGFyZ2V0QXR0YWNobWVudFNlY3JldEFybjogc3RyaW5nO1xufVxuXG4vKipcbiAqIEFuIGF0dGFjaGVkIHNlY3JldC5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlY3JldFRhcmdldEF0dGFjaG1lbnQgZXh0ZW5kcyBTZWNyZXRCYXNlIGltcGxlbWVudHMgSVNlY3JldFRhcmdldEF0dGFjaG1lbnQge1xuXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNlY3JldFRhcmdldEF0dGFjaG1lbnRTZWNyZXRBcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgc2VjcmV0VGFyZ2V0QXR0YWNobWVudFNlY3JldEFybjogc3RyaW5nKTogSVNlY3JldFRhcmdldEF0dGFjaG1lbnQge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFNlY3JldEJhc2UgaW1wbGVtZW50cyBJU2VjcmV0VGFyZ2V0QXR0YWNobWVudCB7XG4gICAgICBwdWJsaWMgZW5jcnlwdGlvbktleT86IGttcy5JS2V5IHwgdW5kZWZpbmVkO1xuICAgICAgcHVibGljIHNlY3JldEFybiA9IHNlY3JldFRhcmdldEF0dGFjaG1lbnRTZWNyZXRBcm47XG4gICAgICBwdWJsaWMgc2VjcmV0VGFyZ2V0QXR0YWNobWVudFNlY3JldEFybiA9IHNlY3JldFRhcmdldEF0dGFjaG1lbnRTZWNyZXRBcm47XG4gICAgICBwdWJsaWMgc2VjcmV0TmFtZSA9IHBhcnNlU2VjcmV0TmFtZShzY29wZSwgc2VjcmV0VGFyZ2V0QXR0YWNobWVudFNlY3JldEFybik7XG4gICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgYXV0b0NyZWF0ZVBvbGljeSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IGttcy5JS2V5O1xuICBwdWJsaWMgcmVhZG9ubHkgc2VjcmV0QXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBzZWNyZXROYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzZWNyZXRUYXJnZXRBdHRhY2htZW50U2VjcmV0QXJuOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGF1dG9DcmVhdGVQb2xpY3kgPSB0cnVlO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgYXR0YWNoZWRTZWNyZXQ6IElTZWNyZXQ7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFNlY3JldFRhcmdldEF0dGFjaG1lbnRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgdGhpcy5hdHRhY2hlZFNlY3JldCA9IHByb3BzLnNlY3JldDtcblxuICAgIGNvbnN0IGF0dGFjaG1lbnQgPSBuZXcgc2VjcmV0c21hbmFnZXIuQ2ZuU2VjcmV0VGFyZ2V0QXR0YWNobWVudCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBzZWNyZXRJZDogdGhpcy5hdHRhY2hlZFNlY3JldC5zZWNyZXRBcm4sXG4gICAgICB0YXJnZXRJZDogcHJvcHMudGFyZ2V0LmFzU2VjcmV0QXR0YWNobWVudFRhcmdldCgpLnRhcmdldElkLFxuICAgICAgdGFyZ2V0VHlwZTogYXR0YWNobWVudFRhcmdldFR5cGVUb1N0cmluZyhwcm9wcy50YXJnZXQuYXNTZWNyZXRBdHRhY2htZW50VGFyZ2V0KCkudGFyZ2V0VHlwZSksXG4gICAgfSk7XG5cbiAgICB0aGlzLmVuY3J5cHRpb25LZXkgPSB0aGlzLmF0dGFjaGVkU2VjcmV0LmVuY3J5cHRpb25LZXk7XG4gICAgdGhpcy5zZWNyZXROYW1lID0gdGhpcy5hdHRhY2hlZFNlY3JldC5zZWNyZXROYW1lO1xuXG4gICAgLy8gVGhpcyBhbGxvd3MgdG8gcmVmZXJlbmNlIHRoZSBzZWNyZXQgYWZ0ZXIgYXR0YWNobWVudCAoZGVwZW5kZW5jeSkuXG4gICAgdGhpcy5zZWNyZXRBcm4gPSBhdHRhY2htZW50LnJlZjtcbiAgICB0aGlzLnNlY3JldFRhcmdldEF0dGFjaG1lbnRTZWNyZXRBcm4gPSBhdHRhY2htZW50LnJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3J3YXJkIGFueSBhZGRpdGlvbnMgdG8gdGhlIHJlc291cmNlIHBvbGljeSB0byB0aGUgb3JpZ2luYWwgc2VjcmV0LlxuICAgKiBUaGlzIGlzIHJlcXVpcmVkIGJlY2F1c2UgYSBzZWNyZXQgY2FuIG9ubHkgaGF2ZSBhIHNpbmdsZSByZXNvdXJjZSBwb2xpY3kuXG4gICAqIElmIHdlIGRvIG5vdCBmb3J3YXJkIHBvbGljeSBhZGRpdGlvbnMsIGEgbmV3IHBvbGljeSByZXNvdXJjZSBpcyBjcmVhdGVkIHVzaW5nIHRoZSBzZWNyZXQgYXR0YWNobWVudCBBUk4uXG4gICAqIFRoaXMgZW5kcyB1cCBiZWluZyByZWplY3RlZCBieSBDbG91ZEZvcm1hdGlvbi5cbiAgICovXG4gIHB1YmxpYyBhZGRUb1Jlc291cmNlUG9saWN5KHN0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudCk6IGlhbS5BZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0IHtcbiAgICBpZiAoRmVhdHVyZUZsYWdzLm9mKHRoaXMpLmlzRW5hYmxlZChjeGFwaS5TRUNSRVRTX01BTkFHRVJfVEFSR0VUX0FUVEFDSE1FTlRfUkVTT1VSQ0VfUE9MSUNZKSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0YWNoZWRTZWNyZXQuYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIuYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQpO1xuICB9XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiB0byBnZW5lcmF0ZSBzZWNyZXRzIHN1Y2ggYXMgcGFzc3dvcmRzIGF1dG9tYXRpY2FsbHkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2VjcmV0U3RyaW5nR2VuZXJhdG9yIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGF0IHRoZSBnZW5lcmF0ZWQgcGFzc3dvcmQgc2hvdWxkbid0IGluY2x1ZGUgdXBwZXJjYXNlIGxldHRlcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBleGNsdWRlVXBwZXJjYXNlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdGhlIGdlbmVyYXRlZCBwYXNzd29yZCBtdXN0IGluY2x1ZGUgYXQgbGVhc3Qgb25lIG9mIGV2ZXJ5IGFsbG93ZWQgY2hhcmFjdGVyIHR5cGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHJlcXVpcmVFYWNoSW5jbHVkZWRUeXBlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoYXQgdGhlIGdlbmVyYXRlZCBwYXNzd29yZCBjYW4gaW5jbHVkZSB0aGUgc3BhY2UgY2hhcmFjdGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5jbHVkZVNwYWNlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBzdHJpbmcgdGhhdCBpbmNsdWRlcyBjaGFyYWN0ZXJzIHRoYXQgc2hvdWxkbid0IGJlIGluY2x1ZGVkIGluIHRoZSBnZW5lcmF0ZWQgcGFzc3dvcmQuIFRoZSBzdHJpbmcgY2FuIGJlIGEgbWluaW11bVxuICAgKiBvZiBgYDBgYCBhbmQgYSBtYXhpbXVtIG9mIGBgNDA5NmBgIGNoYXJhY3RlcnMgbG9uZy5cbiAgICpcbiAgICogQGRlZmF1bHQgbm8gZXhjbHVzaW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgZXhjbHVkZUNoYXJhY3RlcnM/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkZXNpcmVkIGxlbmd0aCBvZiB0aGUgZ2VuZXJhdGVkIHBhc3N3b3JkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAzMlxuICAgKi9cbiAgcmVhZG9ubHkgcGFzc3dvcmRMZW5ndGg/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGF0IHRoZSBnZW5lcmF0ZWQgcGFzc3dvcmQgc2hvdWxkbid0IGluY2x1ZGUgcHVuY3R1YXRpb24gY2hhcmFjdGVycy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGV4Y2x1ZGVQdW5jdHVhdGlvbj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGF0IHRoZSBnZW5lcmF0ZWQgcGFzc3dvcmQgc2hvdWxkbid0IGluY2x1ZGUgbG93ZXJjYXNlIGxldHRlcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBleGNsdWRlTG93ZXJjYXNlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoYXQgdGhlIGdlbmVyYXRlZCBwYXNzd29yZCBzaG91bGRuJ3QgaW5jbHVkZSBkaWdpdHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBleGNsdWRlTnVtYmVycz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgcHJvcGVybHkgc3RydWN0dXJlZCBKU09OIHN0cmluZyB0aGF0IHRoZSBnZW5lcmF0ZWQgcGFzc3dvcmQgY2FuIGJlIGFkZGVkIHRvLiBUaGUgYGBnZW5lcmF0ZVN0cmluZ0tleWBgIGlzXG4gICAqIGNvbWJpbmVkIHdpdGggdGhlIGdlbmVyYXRlZCByYW5kb20gc3RyaW5nIGFuZCBpbnNlcnRlZCBpbnRvIHRoZSBKU09OIHN0cnVjdHVyZSB0aGF0J3Mgc3BlY2lmaWVkIGJ5IHRoaXMgcGFyYW1ldGVyLlxuICAgKiBUaGUgbWVyZ2VkIEpTT04gc3RyaW5nIGlzIHJldHVybmVkIGFzIHRoZSBjb21wbGV0ZWQgU2VjcmV0U3RyaW5nIG9mIHRoZSBzZWNyZXQuIElmIHlvdSBzcGVjaWZ5IGBgc2VjcmV0U3RyaW5nVGVtcGxhdGVgYFxuICAgKiB0aGVuIGBgZ2VuZXJhdGVTdHJpbmdLZXlgYCBtdXN0IGJlIGFsc28gYmUgc3BlY2lmaWVkLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjcmV0U3RyaW5nVGVtcGxhdGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBKU09OIGtleSBuYW1lIHRoYXQncyB1c2VkIHRvIGFkZCB0aGUgZ2VuZXJhdGVkIHBhc3N3b3JkIHRvIHRoZSBKU09OIHN0cnVjdHVyZSBzcGVjaWZpZWQgYnkgdGhlXG4gICAqIGBgc2VjcmV0U3RyaW5nVGVtcGxhdGVgYCBwYXJhbWV0ZXIuIElmIHlvdSBzcGVjaWZ5IGBgZ2VuZXJhdGVTdHJpbmdLZXlgYCB0aGVuIGBgc2VjcmV0U3RyaW5nVGVtcGxhdGVgYFxuICAgKiBtdXN0IGJlIGFsc28gYmUgc3BlY2lmaWVkLlxuICAgKi9cbiAgcmVhZG9ubHkgZ2VuZXJhdGVTdHJpbmdLZXk/OiBzdHJpbmc7XG59XG5cbi8qKiBQYXJzZXMgdGhlIHNlY3JldCBuYW1lIGZyb20gdGhlIEFSTi4gKi9cbmZ1bmN0aW9uIHBhcnNlU2VjcmV0TmFtZShjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QsIHNlY3JldEFybjogc3RyaW5nKSB7XG4gIGNvbnN0IHJlc291cmNlTmFtZSA9IFN0YWNrLm9mKGNvbnN0cnVjdCkuc3BsaXRBcm4oc2VjcmV0QXJuLCBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSkucmVzb3VyY2VOYW1lO1xuICBpZiAocmVzb3VyY2VOYW1lKSB7XG4gICAgLy8gQ2FuJ3Qgb3BlcmF0ZSBvbiB0aGUgdG9rZW4gdG8gcmVtb3ZlIHRoZSBTZWNyZXRzTWFuYWdlciBzdWZmaXgsIHNvIGp1c3QgcmV0dXJuIHRoZSBmdWxsIHNlY3JldCBuYW1lXG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChyZXNvdXJjZU5hbWUpKSB7XG4gICAgICByZXR1cm4gcmVzb3VyY2VOYW1lO1xuICAgIH1cblxuICAgIC8vIFNlY3JldCByZXNvdXJjZSBuYW1lcyBhcmUgaW4gdGhlIGZvcm1hdCBgJHtzZWNyZXROYW1lfS0kezYtY2hhcmFjdGVyIFNlY3JldHNNYW5hZ2VyIHN1ZmZpeH1gXG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gaHlwaGVuIChvciA2LWNoYXJhY3RlciBzdWZmaXgpIGFzc3VtZSBubyBzdWZmaXggd2FzIHByb3ZpZGVkLCBhbmQgcmV0dXJuIHRoZSB3aG9sZSBuYW1lLlxuICAgIGNvbnN0IGxhc3RIeXBoZW5JbmRleCA9IHJlc291cmNlTmFtZS5sYXN0SW5kZXhPZignLScpO1xuICAgIGNvbnN0IGhhc1NlY3JldHNTdWZmaXggPSBsYXN0SHlwaGVuSW5kZXggIT09IC0xICYmIHJlc291cmNlTmFtZS5zbGljZShsYXN0SHlwaGVuSW5kZXggKyAxKS5sZW5ndGggPT09IDY7XG4gICAgcmV0dXJuIGhhc1NlY3JldHNTdWZmaXggPyByZXNvdXJjZU5hbWUuc2xpY2UoMCwgbGFzdEh5cGhlbkluZGV4KSA6IHJlc291cmNlTmFtZTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgQVJOIGZvcm1hdDsgbm8gc2VjcmV0IG5hbWUgcHJvdmlkZWQnKTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIHNlY3JldCBuYW1lIGZyb20gdGhlIEFSTiBvZiBhbiBvd25lZCBzZWNyZXQuIFdpdGggb3duZWQgc2VjcmV0cyB3ZSBrbm93IGEgZmV3IHRoaW5ncyB3ZSBkb24ndCB3aXRoIGltcG9ydGVkIHNlY3JldHM6XG4gKiAtIFRoZSBBUk4gaXMgZ3VhcmFudGVlZCB0byBiZSBhIGZ1bGwgQVJOLCB3aXRoIHN1ZmZpeC5cbiAqIC0gVGhlIG5hbWUgLS0gaWYgcHJvdmlkZWQgLS0gd2lsbCB0ZWxsIHVzIGhvdyBtYW55IGh5cGhlbnMgdG8gZXhwZWN0IGluIHRoZSBmaW5hbCBzZWNyZXQgbmFtZS5cbiAqIC0gSWYgdGhlIG5hbWUgaXMgbm90IHByb3ZpZGVkLCB3ZSBrbm93IHRoZSBmb3JtYXQgdXNlZCBieSBDbG91ZEZvcm1hdGlvbiBmb3IgYXV0by1nZW5lcmF0ZWQgbmFtZXMuXG4gKlxuICogTm90ZTogVGhpcyBpcyBkb25lIHJhdGhlciB0aGFuIGp1c3QgcmV0dXJuaW5nIHRoZSBzZWNyZXQgbmFtZSBwYXNzZWQgaW4gYnkgdGhlIHVzZXIgdG8ga2VlcCB0aGUgcmVsYXRpb25zaGlwXG4gKiBleHBsaWNpdCBiZXR3ZWVuIHRoZSBTZWNyZXQgYW5kIHdoZXJldmVyIHRoZSBzZWNyZXROYW1lIG1pZ2h0IGJlIHVzZWQgKGkuZS4sIHVzaW5nIFRva2VucykuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlU2VjcmV0TmFtZUZvck93bmVkU2VjcmV0KGNvbnN0cnVjdDogQ29uc3RydWN0LCBzZWNyZXRBcm46IHN0cmluZywgc2VjcmV0TmFtZT86IHN0cmluZykge1xuICBjb25zdCByZXNvdXJjZU5hbWUgPSBTdGFjay5vZihjb25zdHJ1Y3QpLnNwbGl0QXJuKHNlY3JldEFybiwgQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUpLnJlc291cmNlTmFtZTtcbiAgaWYgKCFyZXNvdXJjZU5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgQVJOIGZvcm1hdDsgbm8gc2VjcmV0IG5hbWUgcHJvdmlkZWQnKTtcbiAgfVxuXG4gIC8vIFNlY3JldCBuYW1lIHdhcyBleHBsaWNpdGx5IHByb3ZpZGVkLCBidXQgaXMgdW5yZXNvbHZlZDsgYmVzdCBvcHRpb24gaXMgdG8gdXNlIGl0IGRpcmVjdGx5LlxuICAvLyBJZiBpdCBjYW1lIGZyb20gYW5vdGhlciBTZWNyZXQsIGl0IHNob3VsZCAoaG9wZWZ1bGx5KSBhbHJlYWR5IGJlIHByb3Blcmx5IGZvcm1hdHRlZC5cbiAgaWYgKHNlY3JldE5hbWUgJiYgVG9rZW4uaXNVbnJlc29sdmVkKHNlY3JldE5hbWUpKSB7XG4gICAgcmV0dXJuIHNlY3JldE5hbWU7XG4gIH1cblxuICAvLyBJZiBubyBzZWNyZXROYW1lIHdhcyBwcm92aWRlZCwgdGhlIG5hbWUgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBDbG91ZEZvcm1hdGlvbi5cbiAgLy8gVGhlIGF1dG9nZW5lcmF0ZWQgbmFtZXMgaGF2ZSB0aGUgZm9ybSBvZiBgJHtsb2dpY2FsSUR9LSR7cmFuZG9tfWAuXG4gIC8vIE90aGVyd2lzZSwgd2UgY2FuIHVzZSB0aGUgZXhpc3Rpbmcgc2VjcmV0TmFtZSB0byBkZXRlcm1pbmUgaG93IHRvIHBhcnNlIHRoZSByZXN1bHRpbmcgcmVzb3VyY2VOYW1lLlxuICBjb25zdCBzZWNyZXROYW1lSHlwaGVuYXRlZFNlZ21lbnRzID0gc2VjcmV0TmFtZSA/IHNlY3JldE5hbWUuc3BsaXQoJy0nKS5sZW5ndGggOiAyO1xuICAvLyAyID0+IFswLCAxXVxuICBjb25zdCBzZWdtZW50SW5kZXhlcyA9IFsuLi5uZXcgQXJyYXkoc2VjcmV0TmFtZUh5cGhlbmF0ZWRTZWdtZW50cyldLm1hcCgoXywgaSkgPT4gaSk7XG5cbiAgLy8gQ3JlYXRlIHRoZSBzZWNyZXQgbmFtZSBmcm9tIHRoZSByZXNvdXJjZSBuYW1lIGJ5IGpvaW5pbmcgYWxsIHRoZSBrbm93biBzZWdtZW50cyB0b2dldGhlci5cbiAgLy8gVGhpcyBzaG91bGQgaGF2ZSB0aGUgZWZmZWN0IG9mIHN0cmlwcGluZyB0aGUgZmluYWwgaHlwaGVuIGFuZCBTZWNyZXRNYW5hZ2VyIHN1ZmZpeC5cbiAgcmV0dXJuIEZuLmpvaW4oJy0nLCBzZWdtZW50SW5kZXhlcy5tYXAoaSA9PiBGbi5zZWxlY3QoaSwgRm4uc3BsaXQoJy0nLCByZXNvdXJjZU5hbWUpKSkpO1xufVxuXG4vKiogUGVyZm9ybXMgYSBiZXN0IGd1ZXNzIGlmIGFuIEFSTiBpcyBjb21wbGV0ZSwgYmFzZWQgb24gaWYgaXQgZW5kcyB3aXRoIGEgNi1jaGFyYWN0ZXIgc3VmZml4LiAqL1xuZnVuY3Rpb24gYXJuSXNDb21wbGV0ZShzZWNyZXRBcm46IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gVG9rZW4uaXNVbnJlc29sdmVkKHNlY3JldEFybikgfHwgLy1bYS16MC05XXs2fSQvaS50ZXN0KHNlY3JldEFybik7XG59XG5cbi8qKlxuICogTWFyayBhbGwgaW5zdGFuY2VzIG9mICdTZWNyZXQnLlxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU2VjcmV0LnByb3RvdHlwZSwgU0VDUkVUX1NZTUJPTCwge1xuICB2YWx1ZTogdHJ1ZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiBmYWxzZSxcbn0pO1xuXG5mdW5jdGlvbiBhdHRhY2htZW50VGFyZ2V0VHlwZVRvU3RyaW5nKHg6IEF0dGFjaG1lbnRUYXJnZXRUeXBlKTogc3RyaW5nIHtcbiAgc3dpdGNoICh4KSB7XG4gICAgY2FzZSBBdHRhY2htZW50VGFyZ2V0VHlwZS5SRFNfREJfSU5TVEFOQ0U6XG4gICAgY2FzZSBBdHRhY2htZW50VGFyZ2V0VHlwZS5JTlNUQU5DRTpcbiAgICAgIHJldHVybiAnQVdTOjpSRFM6OkRCSW5zdGFuY2UnO1xuICAgIGNhc2UgQXR0YWNobWVudFRhcmdldFR5cGUuUkRTX0RCX0NMVVNURVI6XG4gICAgY2FzZSBBdHRhY2htZW50VGFyZ2V0VHlwZS5DTFVTVEVSOlxuICAgICAgcmV0dXJuICdBV1M6OlJEUzo6REJDbHVzdGVyJztcbiAgICBjYXNlIEF0dGFjaG1lbnRUYXJnZXRUeXBlLlJEU19EQl9QUk9YWTpcbiAgICAgIHJldHVybiAnQVdTOjpSRFM6OkRCUHJveHknO1xuICAgIGNhc2UgQXR0YWNobWVudFRhcmdldFR5cGUuUkVEU0hJRlRfQ0xVU1RFUjpcbiAgICAgIHJldHVybiAnQVdTOjpSZWRzaGlmdDo6Q2x1c3Rlcic7XG4gICAgY2FzZSBBdHRhY2htZW50VGFyZ2V0VHlwZS5ET0NEQl9EQl9JTlNUQU5DRTpcbiAgICAgIHJldHVybiAnQVdTOjpEb2NEQjo6REJJbnN0YW5jZSc7XG4gICAgY2FzZSBBdHRhY2htZW50VGFyZ2V0VHlwZS5ET0NEQl9EQl9DTFVTVEVSOlxuICAgICAgcmV0dXJuICdBV1M6OkRvY0RCOjpEQkNsdXN0ZXInO1xuICB9XG59XG4iXX0=