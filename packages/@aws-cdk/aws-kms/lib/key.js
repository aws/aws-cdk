"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Key = exports.KeyUsage = exports.KeySpec = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const alias_1 = require("./alias");
const kms_generated_1 = require("./kms.generated");
const perms = require("./private/perms");
class KeyBase extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        /**
         * Collection of aliases added to the key
         *
         * Tracked to determine whether or not the aliasName should be added to the end of its ID
         */
        this.aliases = [];
        this.node.addValidation({ validate: () => this.policy?.validateForResourcePolicy() ?? [] });
    }
    /**
     * Defines a new alias for the key.
     */
    addAlias(aliasName) {
        const aliasId = this.aliases.length > 0 ? `Alias${aliasName}` : 'Alias';
        const alias = new alias_1.Alias(this, aliasId, { aliasName, targetKey: this });
        this.aliases.push(alias);
        return alias;
    }
    /**
     * Adds a statement to the KMS key resource policy.
     * @param statement The policy statement to add
     * @param allowNoOp If this is set to `false` and there is no policy
     * defined (i.e. external key), the operation will fail. Otherwise, it will
     * no-op.
     */
    addToResourcePolicy(statement, allowNoOp = true) {
        const stack = core_1.Stack.of(this);
        if (!this.policy) {
            if (allowNoOp) {
                return { statementAdded: false };
            }
            throw new Error(`Unable to add statement to IAM resource policy for KMS key: ${JSON.stringify(stack.resolve(this.keyArn))}`);
        }
        this.policy.addStatements(statement);
        return { statementAdded: true, policyDependable: this.policy };
    }
    /**
     * Grant the indicated permissions on this key to the given principal
     *
     * This modifies both the principal's policy as well as the resource policy,
     * since the default CloudFormation setup for KMS keys is that the policy
     * must not be empty and so default grants won't work.
     */
    grant(grantee, ...actions) {
        // KMS verifies whether the principals included in its key policy actually exist.
        // This is a problem if the stack the grantee is part of depends on the key stack
        // (as it won't exist before the key policy is attempted to be created).
        // In that case, make the account the resource policy principal
        const granteeStackDependsOnKeyStack = this.granteeStackDependsOnKeyStack(grantee);
        const principal = granteeStackDependsOnKeyStack
            ? new iam.AccountPrincipal(granteeStackDependsOnKeyStack)
            : grantee.grantPrincipal;
        const crossAccountAccess = this.isGranteeFromAnotherAccount(grantee);
        const crossRegionAccess = this.isGranteeFromAnotherRegion(grantee);
        const crossEnvironment = crossAccountAccess || crossRegionAccess;
        const grantOptions = {
            grantee,
            actions,
            resource: this,
            resourceArns: [this.keyArn],
            resourceSelfArns: crossEnvironment ? undefined : ['*'],
        };
        if (this.trustAccountIdentities && !crossEnvironment) {
            return iam.Grant.addToPrincipalOrResource(grantOptions);
        }
        else {
            return iam.Grant.addToPrincipalAndResource({
                ...grantOptions,
                // if the key is used in a cross-environment matter,
                // we can't access the Key ARN (they don't have physical names),
                // so fall back to using '*'. ToDo we need to make this better... somehow
                resourceArns: crossEnvironment ? ['*'] : [this.keyArn],
                resourcePolicyPrincipal: principal,
            });
        }
    }
    /**
     * Grant decryption permissions using this key to the given principal
     */
    grantDecrypt(grantee) {
        return this.grant(grantee, ...perms.DECRYPT_ACTIONS);
    }
    /**
     * Grant encryption permissions using this key to the given principal
     */
    grantEncrypt(grantee) {
        return this.grant(grantee, ...perms.ENCRYPT_ACTIONS);
    }
    /**
     * Grant encryption and decryption permissions using this key to the given principal
     */
    grantEncryptDecrypt(grantee) {
        return this.grant(grantee, ...[...perms.DECRYPT_ACTIONS, ...perms.ENCRYPT_ACTIONS]);
    }
    /**
     * Checks whether the grantee belongs to a stack that will be deployed
     * after the stack containing this key.
     *
     * @param grantee the grantee to give permissions to
     * @returns the account ID of the grantee stack if its stack does depend on this stack,
     *   undefined otherwise
     */
    granteeStackDependsOnKeyStack(grantee) {
        const grantPrincipal = grantee.grantPrincipal;
        // this logic should only apply to newly created
        // (= not imported) resources
        if (!iam.principalIsOwnedResource(grantPrincipal)) {
            return undefined;
        }
        const keyStack = core_1.Stack.of(this);
        const granteeStack = core_1.Stack.of(grantPrincipal);
        if (keyStack === granteeStack) {
            return undefined;
        }
        return granteeStack.dependencies.includes(keyStack)
            ? granteeStack.account
            : undefined;
    }
    isGranteeFromAnotherRegion(grantee) {
        if (!iam.principalIsOwnedResource(grantee.grantPrincipal)) {
            return false;
        }
        const bucketStack = core_1.Stack.of(this);
        const identityStack = core_1.Stack.of(grantee.grantPrincipal);
        return bucketStack.region !== identityStack.region;
    }
    isGranteeFromAnotherAccount(grantee) {
        if (!iam.principalIsOwnedResource(grantee.grantPrincipal)) {
            return false;
        }
        const bucketStack = core_1.Stack.of(this);
        const identityStack = core_1.Stack.of(grantee.grantPrincipal);
        return bucketStack.account !== identityStack.account;
    }
}
/**
 * The key spec, represents the cryptographic configuration of keys.
 */
var KeySpec;
(function (KeySpec) {
    /**
     * The default key spec.
     *
     * Valid usage: ENCRYPT_DECRYPT
     */
    KeySpec["SYMMETRIC_DEFAULT"] = "SYMMETRIC_DEFAULT";
    /**
     * RSA with 2048 bits of key.
     *
     * Valid usage: ENCRYPT_DECRYPT and SIGN_VERIFY
     */
    KeySpec["RSA_2048"] = "RSA_2048";
    /**
     * RSA with 3072 bits of key.
     *
     * Valid usage: ENCRYPT_DECRYPT and SIGN_VERIFY
     */
    KeySpec["RSA_3072"] = "RSA_3072";
    /**
     * RSA with 4096 bits of key.
     *
     * Valid usage: ENCRYPT_DECRYPT and SIGN_VERIFY
     */
    KeySpec["RSA_4096"] = "RSA_4096";
    /**
     * NIST FIPS 186-4, Section 6.4, ECDSA signature using the curve specified by the key and
     * SHA-256 for the message digest.
     *
     * Valid usage: SIGN_VERIFY
     */
    KeySpec["ECC_NIST_P256"] = "ECC_NIST_P256";
    /**
     * NIST FIPS 186-4, Section 6.4, ECDSA signature using the curve specified by the key and
     * SHA-384 for the message digest.
     *
     * Valid usage: SIGN_VERIFY
     */
    KeySpec["ECC_NIST_P384"] = "ECC_NIST_P384";
    /**
     * NIST FIPS 186-4, Section 6.4, ECDSA signature using the curve specified by the key and
     * SHA-512 for the message digest.
     *
     * Valid usage: SIGN_VERIFY
     */
    KeySpec["ECC_NIST_P521"] = "ECC_NIST_P521";
    /**
     * Standards for Efficient Cryptography 2, Section 2.4.1, ECDSA signature on the Koblitz curve.
     *
     * Valid usage: SIGN_VERIFY
     */
    KeySpec["ECC_SECG_P256K1"] = "ECC_SECG_P256K1";
})(KeySpec = exports.KeySpec || (exports.KeySpec = {}));
/**
 * The key usage, represents the cryptographic operations of keys.
 */
var KeyUsage;
(function (KeyUsage) {
    /**
     * Encryption and decryption.
     */
    KeyUsage["ENCRYPT_DECRYPT"] = "ENCRYPT_DECRYPT";
    /**
     * Signing and verification
     */
    KeyUsage["SIGN_VERIFY"] = "SIGN_VERIFY";
})(KeyUsage = exports.KeyUsage || (exports.KeyUsage = {}));
/**
 * Defines a KMS key.
 *
 * @resource AWS::KMS::Key
 */
class Key extends KeyBase {
    constructor(scope, id, props = {}) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_kms_KeyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Key);
            }
            throw error;
        }
        const denyLists = {
            [KeyUsage.ENCRYPT_DECRYPT]: [
                KeySpec.ECC_NIST_P256,
                KeySpec.ECC_NIST_P384,
                KeySpec.ECC_NIST_P521,
                KeySpec.ECC_SECG_P256K1,
            ],
            [KeyUsage.SIGN_VERIFY]: [
                KeySpec.SYMMETRIC_DEFAULT,
            ],
        };
        const keySpec = props.keySpec ?? KeySpec.SYMMETRIC_DEFAULT;
        const keyUsage = props.keyUsage ?? KeyUsage.ENCRYPT_DECRYPT;
        if (denyLists[keyUsage].includes(keySpec)) {
            throw new Error(`key spec '${keySpec}' is not valid with usage '${keyUsage}'`);
        }
        if (keySpec !== KeySpec.SYMMETRIC_DEFAULT && props.enableKeyRotation) {
            throw new Error('key rotation cannot be enabled on asymmetric keys');
        }
        const defaultKeyPoliciesFeatureEnabled = core_1.FeatureFlags.of(this).isEnabled(cxapi.KMS_DEFAULT_KEY_POLICIES);
        this.policy = props.policy ?? new iam.PolicyDocument();
        if (defaultKeyPoliciesFeatureEnabled) {
            if (props.trustAccountIdentities === false) {
                throw new Error('`trustAccountIdentities` cannot be false if the @aws-cdk/aws-kms:defaultKeyPolicies feature flag is set');
            }
            this.trustAccountIdentities = true;
            // Set the default key policy if one hasn't been provided by the user.
            if (!props.policy) {
                this.addDefaultAdminPolicy();
            }
        }
        else {
            this.trustAccountIdentities = props.trustAccountIdentities ?? false;
            if (this.trustAccountIdentities) {
                this.addDefaultAdminPolicy();
            }
            else {
                this.addLegacyAdminPolicy();
            }
        }
        let pendingWindowInDays;
        if (props.pendingWindow) {
            pendingWindowInDays = props.pendingWindow.toDays();
            if (pendingWindowInDays < 7 || pendingWindowInDays > 30) {
                throw new Error(`'pendingWindow' value must between 7 and 30 days. Received: ${pendingWindowInDays}`);
            }
        }
        const resource = new kms_generated_1.CfnKey(this, 'Resource', {
            description: props.description,
            enableKeyRotation: props.enableKeyRotation,
            enabled: props.enabled,
            keySpec: props.keySpec,
            keyUsage: props.keyUsage,
            keyPolicy: this.policy,
            pendingWindowInDays: pendingWindowInDays,
        });
        this.keyArn = resource.attrArn;
        this.keyId = resource.ref;
        resource.applyRemovalPolicy(props.removalPolicy);
        (props.admins ?? []).forEach((p) => this.grantAdmin(p));
        if (props.alias !== undefined) {
            this.addAlias(props.alias);
        }
    }
    /**
     * Import an externally defined KMS Key using its ARN.
     *
     * @param scope  the construct that will "own" the imported key.
     * @param id     the id of the imported key in the construct tree.
     * @param keyArn the ARN of an existing KMS key.
     */
    static fromKeyArn(scope, id, keyArn) {
        class Import extends KeyBase {
            constructor(keyId, props = {}) {
                super(scope, id, props);
                this.keyArn = keyArn;
                this.policy = undefined;
                // defaulting true: if we are importing the key the key policy is
                // undefined and impossible to change here; this means updating identity
                // policies is really the only option
                this.trustAccountIdentities = true;
                this.keyId = keyId;
            }
        }
        const keyResourceName = core_1.Stack.of(scope).splitArn(keyArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).resourceName;
        if (!keyResourceName) {
            throw new Error(`KMS key ARN must be in the format 'arn:aws:kms:<region>:<account>:key/<keyId>', got: '${keyArn}'`);
        }
        return new Import(keyResourceName, {
            environmentFromArn: keyArn,
        });
    }
    /**
     * Create a mutable `IKey` based on a low-level `CfnKey`.
     * This is most useful when combined with the cloudformation-include module.
     * This method is different than `fromKeyArn()` because the `IKey`
     * returned from this method is mutable;
     * meaning, calling any mutating methods on it,
     * like `IKey.addToResourcePolicy()`,
     * will actually be reflected in the resulting template,
     * as opposed to the object returned from `fromKeyArn()`,
     * on which calling those methods would have no effect.
     */
    static fromCfnKey(cfnKey) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_kms_CfnKey(cfnKey);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromCfnKey);
            }
            throw error;
        }
        // use a "weird" id that has a higher chance of being unique
        const id = '@FromCfnKey';
        // if fromCfnKey() was already called on this cfnKey,
        // return the same L2
        // (as different L2s would conflict, because of the mutation of the keyPolicy property of the L1 below)
        const existing = cfnKey.node.tryFindChild(id);
        if (existing) {
            return existing;
        }
        let keyPolicy;
        try {
            keyPolicy = iam.PolicyDocument.fromJson(cfnKey.keyPolicy);
        }
        catch (e) {
            // If the KeyPolicy contains any CloudFormation functions,
            // PolicyDocument.fromJson() throws an exception.
            // In that case, because we would have to effectively make the returned IKey immutable,
            // throw an exception suggesting to use the other importing methods instead.
            // We might make this parsing logic smarter later,
            // but let's start by erroring out.
            throw new Error('Could not parse the PolicyDocument of the passed AWS::KMS::Key resource because it contains CloudFormation functions. ' +
                'This makes it impossible to create a mutable IKey from that Policy. ' +
                'You have to use fromKeyArn instead, passing it the ARN attribute property of the low-level CfnKey');
        }
        // change the key policy of the L1, so that all changes done in the L2 are reflected in the resulting template
        cfnKey.keyPolicy = core_1.Lazy.any({ produce: () => keyPolicy.toJSON() });
        return new class extends KeyBase {
            constructor() {
                super(...arguments);
                this.keyArn = cfnKey.attrArn;
                this.keyId = cfnKey.ref;
                this.policy = keyPolicy;
                this.trustAccountIdentities = false;
            }
        }(cfnKey, id);
    }
    /**
     * Import an existing Key by querying the AWS environment this stack is deployed to.
     *
     * This function only needs to be used to use Keys not defined in your CDK
     * application. If you are looking to share a Key between stacks, you can
     * pass the `Key` object between stacks and use it as normal. In addition,
     * it's not necessary to use this method if an interface accepts an `IKey`.
     * In this case, `Alias.fromAliasName()` can be used which returns an alias
     * that extends `IKey`.
     *
     * Calling this method will lead to a lookup when the CDK CLI is executed.
     * You can therefore not use any values that will only be available at
     * CloudFormation execution time (i.e., Tokens).
     *
     * The Key information will be cached in `cdk.context.json` and the same Key
     * will be used on future runs. To refresh the lookup, you will have to
     * evict the value from the cache using the `cdk context` command. See
     * https://docs.aws.amazon.com/cdk/latest/guide/context.html for more information.
     */
    static fromLookup(scope, id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_kms_KeyLookupOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromLookup);
            }
            throw error;
        }
        class Import extends KeyBase {
            constructor(keyId, keyArn) {
                super(scope, id);
                this.policy = undefined;
                // defaulting true: if we are importing the key the key policy is
                // undefined and impossible to change here; this means updating identity
                // policies is really the only option
                this.trustAccountIdentities = true;
                this.keyId = keyId;
                this.keyArn = keyArn;
            }
        }
        if (core_1.Token.isUnresolved(options.aliasName)) {
            throw new Error('All arguments to Key.fromLookup() must be concrete (no Tokens)');
        }
        const attributes = core_1.ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.KEY_PROVIDER,
            props: {
                aliasName: options.aliasName,
            },
            dummyValue: {
                keyId: '1234abcd-12ab-34cd-56ef-1234567890ab',
            },
        }).value;
        return new Import(attributes.keyId, core_1.Arn.format({ resource: 'key', service: 'kms', resourceName: attributes.keyId }, core_1.Stack.of(scope)));
    }
    /**
     * Grant admins permissions using this key to the given principal
     *
     * Key administrators have permissions to manage the key (e.g., change permissions, revoke), but do not have permissions
     * to use the key in cryptographic operations (e.g., encrypt, decrypt).
     */
    grantAdmin(grantee) {
        return this.grant(grantee, ...perms.ADMIN_ACTIONS);
    }
    /**
     * Adds the default key policy to the key. This policy gives the AWS account (root user) full access to the CMK,
     * which reduces the risk of the CMK becoming unmanageable and enables IAM policies to allow access to the CMK.
     * This is the same policy that is default when creating a Key via the KMS API or Console.
     * @see https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html#key-policy-default
     */
    addDefaultAdminPolicy() {
        this.addToResourcePolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['kms:*'],
            principals: [new iam.AccountRootPrincipal()],
        }));
    }
    /**
     * Grants the account admin privileges -- not full account access -- plus the GenerateDataKey action.
     * The GenerateDataKey action was added for interop with S3 in https://github.com/aws/aws-cdk/issues/3458.
     *
     * This policy is discouraged and deprecated by the `@aws-cdk/aws-kms:defaultKeyPolicies` feature flag.
     *
     * @link https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html#key-policy-default
     * @deprecated
     */
    addLegacyAdminPolicy() {
        // This is equivalent to `[...perms.ADMIN_ACTIONS, 'kms:GenerateDataKey']`,
        // but keeping this explicit ordering for backwards-compatibility (changing the ordering causes resource updates)
        const actions = [
            'kms:Create*',
            'kms:Describe*',
            'kms:Enable*',
            'kms:List*',
            'kms:Put*',
            'kms:Update*',
            'kms:Revoke*',
            'kms:Disable*',
            'kms:Get*',
            'kms:Delete*',
            'kms:ScheduleKeyDeletion',
            'kms:CancelKeyDeletion',
            'kms:GenerateDataKey',
            'kms:TagResource',
            'kms:UntagResource',
        ];
        this.addToResourcePolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions,
            principals: [new iam.AccountRootPrincipal()],
        }));
    }
}
exports.Key = Key;
_a = JSII_RTTI_SYMBOL_1;
Key[_a] = { fqn: "@aws-cdk/aws-kms.Key", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsia2V5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4QywyREFBMkQ7QUFDM0Qsd0NBQStKO0FBQy9KLHlDQUF5QztBQUV6QyxtQ0FBZ0M7QUFFaEMsbURBQXlDO0FBQ3pDLHlDQUF5QztBQXdEekMsTUFBZSxPQUFRLFNBQVEsZUFBUTtJQWdDckMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUF1QixFQUFFO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBUjFCOzs7O1dBSUc7UUFDYyxZQUFPLEdBQVksRUFBRSxDQUFDO1FBS3JDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUseUJBQXlCLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzdGO0lBRUQ7O09BRUc7SUFDSSxRQUFRLENBQUMsU0FBaUI7UUFDL0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFeEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxhQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV6QixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksbUJBQW1CLENBQUMsU0FBOEIsRUFBRSxTQUFTLEdBQUcsSUFBSTtRQUN6RSxNQUFNLEtBQUssR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLElBQUks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LENBQUMsR0FBRyxDQUFDO1lBQ2hCLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQztZQUNsQixVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQzdDLENBQUMsQ0FBQyxDQUFDO0tBQ0w7SUFFRDs7Ozs7Ozs7T0FRRztJQUNLLG9CQUFvQjtRQUMxQiwyRUFBMkU7UUFDM0UsaUhBQWlIO1FBQ2pILE1BQU0sT0FBTyxHQUFHO1lBQ2QsYUFBYTtZQUNiLGVBQWU7WUFDZixhQUFhO1lBQ2IsV0FBVztZQUNYLFVBQVU7WUFDVixhQUFhO1lBQ2IsYUFBYTtZQUNiLGNBQWM7WUFDZCxVQUFVO1lBQ1YsYUFBYTtZQUNiLHlCQUF5QjtZQUN6Qix1QkFBdUI7WUFDdkIscUJBQXFCO1lBQ3JCLGlCQUFpQjtZQUNqQixtQkFBbUI7U0FDcEIsQ0FBQztRQUVGLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDL0MsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1lBQ2hCLE9BQU87WUFDUCxVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQzdDLENBQUMsQ0FBQyxDQUFDO0tBQ0w7O0FBclJILGtCQXNSQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyBGZWF0dXJlRmxhZ3MsIElSZXNvdXJjZSwgTGF6eSwgUmVtb3ZhbFBvbGljeSwgUmVzb3VyY2UsIFJlc291cmNlUHJvcHMsIFN0YWNrLCBEdXJhdGlvbiwgVG9rZW4sIENvbnRleHRQcm92aWRlciwgQXJuLCBBcm5Gb3JtYXQgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFsaWFzIH0gZnJvbSAnLi9hbGlhcyc7XG5pbXBvcnQgeyBLZXlMb29rdXBPcHRpb25zIH0gZnJvbSAnLi9rZXktbG9va3VwJztcbmltcG9ydCB7IENmbktleSB9IGZyb20gJy4va21zLmdlbmVyYXRlZCc7XG5pbXBvcnQgKiBhcyBwZXJtcyBmcm9tICcuL3ByaXZhdGUvcGVybXMnO1xuXG4vKipcbiAqIEEgS01TIEtleSwgZWl0aGVyIG1hbmFnZWQgYnkgdGhpcyBDREsgYXBwLCBvciBpbXBvcnRlZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJS2V5IGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIGtleS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkga2V5QXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUga2V5XG4gICAqICh0aGUgcGFydCB0aGF0IGxvb2tzIHNvbWV0aGluZyBsaWtlOiAxMjM0YWJjZC0xMmFiLTM0Y2QtNTZlZi0xMjM0NTY3ODkwYWIpLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBrZXlJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgbmV3IGFsaWFzIGZvciB0aGUga2V5LlxuICAgKi9cbiAgYWRkQWxpYXMoYWxpYXM6IHN0cmluZyk6IEFsaWFzO1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgc3RhdGVtZW50IHRvIHRoZSBLTVMga2V5IHJlc291cmNlIHBvbGljeS5cbiAgICogQHBhcmFtIHN0YXRlbWVudCBUaGUgcG9saWN5IHN0YXRlbWVudCB0byBhZGRcbiAgICogQHBhcmFtIGFsbG93Tm9PcCBJZiB0aGlzIGlzIHNldCB0byBgZmFsc2VgIGFuZCB0aGVyZSBpcyBubyBwb2xpY3lcbiAgICogZGVmaW5lZCAoaS5lLiBleHRlcm5hbCBrZXkpLCB0aGUgb3BlcmF0aW9uIHdpbGwgZmFpbC4gT3RoZXJ3aXNlLCBpdCB3aWxsXG4gICAqIG5vLW9wLlxuICAgKi9cbiAgYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQsIGFsbG93Tm9PcD86IGJvb2xlYW4pOiBpYW0uQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdDtcblxuICAvKipcbiAgICogR3JhbnQgdGhlIGluZGljYXRlZCBwZXJtaXNzaW9ucyBvbiB0aGlzIGtleSB0byB0aGUgZ2l2ZW4gcHJpbmNpcGFsXG4gICAqL1xuICBncmFudChncmFudGVlOiBpYW0uSUdyYW50YWJsZSwgLi4uYWN0aW9uczogc3RyaW5nW10pOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50IGRlY3J5cHRpb24gcGVybWlzc2lvbnMgdXNpbmcgdGhpcyBrZXkgdG8gdGhlIGdpdmVuIHByaW5jaXBhbFxuICAgKi9cbiAgZ3JhbnREZWNyeXB0KGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBHcmFudCBlbmNyeXB0aW9uIHBlcm1pc3Npb25zIHVzaW5nIHRoaXMga2V5IHRvIHRoZSBnaXZlbiBwcmluY2lwYWxcbiAgICovXG4gIGdyYW50RW5jcnlwdChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnQgZW5jcnlwdGlvbiBhbmQgZGVjcnlwdGlvbiBwZXJtaXNzaW9ucyB1c2luZyB0aGlzIGtleSB0byB0aGUgZ2l2ZW4gcHJpbmNpcGFsXG4gICAqL1xuICBncmFudEVuY3J5cHREZWNyeXB0KGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50O1xufVxuXG5hYnN0cmFjdCBjbGFzcyBLZXlCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJS2V5IHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIGtleS5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBrZXlBcm46IHN0cmluZztcblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkga2V5SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogT3B0aW9uYWwgcG9saWN5IGRvY3VtZW50IHRoYXQgcmVwcmVzZW50cyB0aGUgcmVzb3VyY2UgcG9saWN5IG9mIHRoaXMga2V5LlxuICAgKlxuICAgKiBJZiBzcGVjaWZpZWQsIGFkZFRvUmVzb3VyY2VQb2xpY3kgY2FuIGJlIHVzZWQgdG8gZWRpdCB0aGlzIHBvbGljeS5cbiAgICogT3RoZXJ3aXNlIHRoaXMgbWV0aG9kIHdpbGwgbm8tb3AuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgcG9saWN5PzogaWFtLlBvbGljeURvY3VtZW50O1xuXG4gIC8qKlxuICAgKiBPcHRpb25hbCBwcm9wZXJ0eSB0byBjb250cm9sIHRydXN0aW5nIGFjY291bnQgaWRlbnRpdGllcy5cbiAgICpcbiAgICogSWYgc3BlY2lmaWVkLCBncmFudHMgd2lsbCBkZWZhdWx0IGlkZW50aXR5IHBvbGljaWVzIGluc3RlYWQgb2YgdG8gYm90aFxuICAgKiByZXNvdXJjZSBhbmQgaWRlbnRpdHkgcG9saWNpZXMuIFRoaXMgbWF0Y2hlcyB0aGUgZGVmYXVsdCBiZWhhdmlvciB3aGVuIGNyZWF0aW5nXG4gICAqIEtNUyBrZXlzIHZpYSB0aGUgQVBJIG9yIGNvbnNvbGUuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgdHJ1c3RBY2NvdW50SWRlbnRpdGllczogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ29sbGVjdGlvbiBvZiBhbGlhc2VzIGFkZGVkIHRvIHRoZSBrZXlcbiAgICpcbiAgICogVHJhY2tlZCB0byBkZXRlcm1pbmUgd2hldGhlciBvciBub3QgdGhlIGFsaWFzTmFtZSBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIGVuZCBvZiBpdHMgSURcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgYWxpYXNlczogQWxpYXNbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBSZXNvdXJjZVByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMucG9saWN5Py52YWxpZGF0ZUZvclJlc291cmNlUG9saWN5KCkgPz8gW10gfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhIG5ldyBhbGlhcyBmb3IgdGhlIGtleS5cbiAgICovXG4gIHB1YmxpYyBhZGRBbGlhcyhhbGlhc05hbWU6IHN0cmluZyk6IEFsaWFzIHtcbiAgICBjb25zdCBhbGlhc0lkID0gdGhpcy5hbGlhc2VzLmxlbmd0aCA+IDAgPyBgQWxpYXMke2FsaWFzTmFtZX1gIDogJ0FsaWFzJztcblxuICAgIGNvbnN0IGFsaWFzID0gbmV3IEFsaWFzKHRoaXMsIGFsaWFzSWQsIHsgYWxpYXNOYW1lLCB0YXJnZXRLZXk6IHRoaXMgfSk7XG4gICAgdGhpcy5hbGlhc2VzLnB1c2goYWxpYXMpO1xuXG4gICAgcmV0dXJuIGFsaWFzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzdGF0ZW1lbnQgdG8gdGhlIEtNUyBrZXkgcmVzb3VyY2UgcG9saWN5LlxuICAgKiBAcGFyYW0gc3RhdGVtZW50IFRoZSBwb2xpY3kgc3RhdGVtZW50IHRvIGFkZFxuICAgKiBAcGFyYW0gYWxsb3dOb09wIElmIHRoaXMgaXMgc2V0IHRvIGBmYWxzZWAgYW5kIHRoZXJlIGlzIG5vIHBvbGljeVxuICAgKiBkZWZpbmVkIChpLmUuIGV4dGVybmFsIGtleSksIHRoZSBvcGVyYXRpb24gd2lsbCBmYWlsLiBPdGhlcndpc2UsIGl0IHdpbGxcbiAgICogbm8tb3AuXG4gICAqL1xuICBwdWJsaWMgYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQsIGFsbG93Tm9PcCA9IHRydWUpOiBpYW0uQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdCB7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZih0aGlzKTtcblxuICAgIGlmICghdGhpcy5wb2xpY3kpIHtcbiAgICAgIGlmIChhbGxvd05vT3ApIHsgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IGZhbHNlIH07IH1cbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGFkZCBzdGF0ZW1lbnQgdG8gSUFNIHJlc291cmNlIHBvbGljeSBmb3IgS01TIGtleTogJHtKU09OLnN0cmluZ2lmeShzdGFjay5yZXNvbHZlKHRoaXMua2V5QXJuKSl9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5wb2xpY3kuYWRkU3RhdGVtZW50cyhzdGF0ZW1lbnQpO1xuICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiB0cnVlLCBwb2xpY3lEZXBlbmRhYmxlOiB0aGlzLnBvbGljeSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBpbmRpY2F0ZWQgcGVybWlzc2lvbnMgb24gdGhpcyBrZXkgdG8gdGhlIGdpdmVuIHByaW5jaXBhbFxuICAgKlxuICAgKiBUaGlzIG1vZGlmaWVzIGJvdGggdGhlIHByaW5jaXBhbCdzIHBvbGljeSBhcyB3ZWxsIGFzIHRoZSByZXNvdXJjZSBwb2xpY3ksXG4gICAqIHNpbmNlIHRoZSBkZWZhdWx0IENsb3VkRm9ybWF0aW9uIHNldHVwIGZvciBLTVMga2V5cyBpcyB0aGF0IHRoZSBwb2xpY3lcbiAgICogbXVzdCBub3QgYmUgZW1wdHkgYW5kIHNvIGRlZmF1bHQgZ3JhbnRzIHdvbid0IHdvcmsuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKTogaWFtLkdyYW50IHtcbiAgICAvLyBLTVMgdmVyaWZpZXMgd2hldGhlciB0aGUgcHJpbmNpcGFscyBpbmNsdWRlZCBpbiBpdHMga2V5IHBvbGljeSBhY3R1YWxseSBleGlzdC5cbiAgICAvLyBUaGlzIGlzIGEgcHJvYmxlbSBpZiB0aGUgc3RhY2sgdGhlIGdyYW50ZWUgaXMgcGFydCBvZiBkZXBlbmRzIG9uIHRoZSBrZXkgc3RhY2tcbiAgICAvLyAoYXMgaXQgd29uJ3QgZXhpc3QgYmVmb3JlIHRoZSBrZXkgcG9saWN5IGlzIGF0dGVtcHRlZCB0byBiZSBjcmVhdGVkKS5cbiAgICAvLyBJbiB0aGF0IGNhc2UsIG1ha2UgdGhlIGFjY291bnQgdGhlIHJlc291cmNlIHBvbGljeSBwcmluY2lwYWxcbiAgICBjb25zdCBncmFudGVlU3RhY2tEZXBlbmRzT25LZXlTdGFjayA9IHRoaXMuZ3JhbnRlZVN0YWNrRGVwZW5kc09uS2V5U3RhY2soZ3JhbnRlZSk7XG4gICAgY29uc3QgcHJpbmNpcGFsID0gZ3JhbnRlZVN0YWNrRGVwZW5kc09uS2V5U3RhY2tcbiAgICAgID8gbmV3IGlhbS5BY2NvdW50UHJpbmNpcGFsKGdyYW50ZWVTdGFja0RlcGVuZHNPbktleVN0YWNrKVxuICAgICAgOiBncmFudGVlLmdyYW50UHJpbmNpcGFsO1xuXG4gICAgY29uc3QgY3Jvc3NBY2NvdW50QWNjZXNzID0gdGhpcy5pc0dyYW50ZWVGcm9tQW5vdGhlckFjY291bnQoZ3JhbnRlZSk7XG4gICAgY29uc3QgY3Jvc3NSZWdpb25BY2Nlc3MgPSB0aGlzLmlzR3JhbnRlZUZyb21Bbm90aGVyUmVnaW9uKGdyYW50ZWUpO1xuICAgIGNvbnN0IGNyb3NzRW52aXJvbm1lbnQgPSBjcm9zc0FjY291bnRBY2Nlc3MgfHwgY3Jvc3NSZWdpb25BY2Nlc3M7XG4gICAgY29uc3QgZ3JhbnRPcHRpb25zOiBpYW0uR3JhbnRXaXRoUmVzb3VyY2VPcHRpb25zID0ge1xuICAgICAgZ3JhbnRlZSxcbiAgICAgIGFjdGlvbnMsXG4gICAgICByZXNvdXJjZTogdGhpcyxcbiAgICAgIHJlc291cmNlQXJuczogW3RoaXMua2V5QXJuXSxcbiAgICAgIHJlc291cmNlU2VsZkFybnM6IGNyb3NzRW52aXJvbm1lbnQgPyB1bmRlZmluZWQgOiBbJyonXSxcbiAgICB9O1xuICAgIGlmICh0aGlzLnRydXN0QWNjb3VudElkZW50aXRpZXMgJiYgIWNyb3NzRW52aXJvbm1lbnQpIHtcbiAgICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWxPclJlc291cmNlKGdyYW50T3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWxBbmRSZXNvdXJjZSh7XG4gICAgICAgIC4uLmdyYW50T3B0aW9ucyxcbiAgICAgICAgLy8gaWYgdGhlIGtleSBpcyB1c2VkIGluIGEgY3Jvc3MtZW52aXJvbm1lbnQgbWF0dGVyLFxuICAgICAgICAvLyB3ZSBjYW4ndCBhY2Nlc3MgdGhlIEtleSBBUk4gKHRoZXkgZG9uJ3QgaGF2ZSBwaHlzaWNhbCBuYW1lcyksXG4gICAgICAgIC8vIHNvIGZhbGwgYmFjayB0byB1c2luZyAnKicuIFRvRG8gd2UgbmVlZCB0byBtYWtlIHRoaXMgYmV0dGVyLi4uIHNvbWVob3dcbiAgICAgICAgcmVzb3VyY2VBcm5zOiBjcm9zc0Vudmlyb25tZW50ID8gWycqJ10gOiBbdGhpcy5rZXlBcm5dLFxuICAgICAgICByZXNvdXJjZVBvbGljeVByaW5jaXBhbDogcHJpbmNpcGFsLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IGRlY3J5cHRpb24gcGVybWlzc2lvbnMgdXNpbmcgdGhpcyBrZXkgdG8gdGhlIGdpdmVuIHByaW5jaXBhbFxuICAgKi9cbiAgcHVibGljIGdyYW50RGVjcnlwdChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbnQoZ3JhbnRlZSwgLi4ucGVybXMuREVDUllQVF9BQ1RJT05TKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCBlbmNyeXB0aW9uIHBlcm1pc3Npb25zIHVzaW5nIHRoaXMga2V5IHRvIHRoZSBnaXZlbiBwcmluY2lwYWxcbiAgICovXG4gIHB1YmxpYyBncmFudEVuY3J5cHQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiB0aGlzLmdyYW50KGdyYW50ZWUsIC4uLnBlcm1zLkVOQ1JZUFRfQUNUSU9OUyk7XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgZW5jcnlwdGlvbiBhbmQgZGVjcnlwdGlvbiBwZXJtaXNzaW9ucyB1c2luZyB0aGlzIGtleSB0byB0aGUgZ2l2ZW4gcHJpbmNpcGFsXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRFbmNyeXB0RGVjcnlwdChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbnQoZ3JhbnRlZSwgLi4uWy4uLnBlcm1zLkRFQ1JZUFRfQUNUSU9OUywgLi4ucGVybXMuRU5DUllQVF9BQ1RJT05TXSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGdyYW50ZWUgYmVsb25ncyB0byBhIHN0YWNrIHRoYXQgd2lsbCBiZSBkZXBsb3llZFxuICAgKiBhZnRlciB0aGUgc3RhY2sgY29udGFpbmluZyB0aGlzIGtleS5cbiAgICpcbiAgICogQHBhcmFtIGdyYW50ZWUgdGhlIGdyYW50ZWUgdG8gZ2l2ZSBwZXJtaXNzaW9ucyB0b1xuICAgKiBAcmV0dXJucyB0aGUgYWNjb3VudCBJRCBvZiB0aGUgZ3JhbnRlZSBzdGFjayBpZiBpdHMgc3RhY2sgZG9lcyBkZXBlbmQgb24gdGhpcyBzdGFjayxcbiAgICogICB1bmRlZmluZWQgb3RoZXJ3aXNlXG4gICAqL1xuICBwcml2YXRlIGdyYW50ZWVTdGFja0RlcGVuZHNPbktleVN0YWNrKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBncmFudFByaW5jaXBhbCA9IGdyYW50ZWUuZ3JhbnRQcmluY2lwYWw7XG4gICAgLy8gdGhpcyBsb2dpYyBzaG91bGQgb25seSBhcHBseSB0byBuZXdseSBjcmVhdGVkXG4gICAgLy8gKD0gbm90IGltcG9ydGVkKSByZXNvdXJjZXNcbiAgICBpZiAoIWlhbS5wcmluY2lwYWxJc093bmVkUmVzb3VyY2UoZ3JhbnRQcmluY2lwYWwpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBrZXlTdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuICAgIGNvbnN0IGdyYW50ZWVTdGFjayA9IFN0YWNrLm9mKGdyYW50UHJpbmNpcGFsKTtcbiAgICBpZiAoa2V5U3RhY2sgPT09IGdyYW50ZWVTdGFjaykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gZ3JhbnRlZVN0YWNrLmRlcGVuZGVuY2llcy5pbmNsdWRlcyhrZXlTdGFjaylcbiAgICAgID8gZ3JhbnRlZVN0YWNrLmFjY291bnRcbiAgICAgIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0dyYW50ZWVGcm9tQW5vdGhlclJlZ2lvbihncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGJvb2xlYW4ge1xuICAgIGlmICghaWFtLnByaW5jaXBhbElzT3duZWRSZXNvdXJjZShncmFudGVlLmdyYW50UHJpbmNpcGFsKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBidWNrZXRTdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuICAgIGNvbnN0IGlkZW50aXR5U3RhY2sgPSBTdGFjay5vZihncmFudGVlLmdyYW50UHJpbmNpcGFsKTtcbiAgICByZXR1cm4gYnVja2V0U3RhY2sucmVnaW9uICE9PSBpZGVudGl0eVN0YWNrLnJlZ2lvbjtcbiAgfVxuXG4gIHByaXZhdGUgaXNHcmFudGVlRnJvbUFub3RoZXJBY2NvdW50KGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogYm9vbGVhbiB7XG4gICAgaWYgKCFpYW0ucHJpbmNpcGFsSXNPd25lZFJlc291cmNlKGdyYW50ZWUuZ3JhbnRQcmluY2lwYWwpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGJ1Y2tldFN0YWNrID0gU3RhY2sub2YodGhpcyk7XG4gICAgY29uc3QgaWRlbnRpdHlTdGFjayA9IFN0YWNrLm9mKGdyYW50ZWUuZ3JhbnRQcmluY2lwYWwpO1xuICAgIHJldHVybiBidWNrZXRTdGFjay5hY2NvdW50ICE9PSBpZGVudGl0eVN0YWNrLmFjY291bnQ7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUga2V5IHNwZWMsIHJlcHJlc2VudHMgdGhlIGNyeXB0b2dyYXBoaWMgY29uZmlndXJhdGlvbiBvZiBrZXlzLlxuICovXG5leHBvcnQgZW51bSBLZXlTcGVjIHtcbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IGtleSBzcGVjLlxuICAgKlxuICAgKiBWYWxpZCB1c2FnZTogRU5DUllQVF9ERUNSWVBUXG4gICAqL1xuICBTWU1NRVRSSUNfREVGQVVMVCA9ICdTWU1NRVRSSUNfREVGQVVMVCcsXG5cbiAgLyoqXG4gICAqIFJTQSB3aXRoIDIwNDggYml0cyBvZiBrZXkuXG4gICAqXG4gICAqIFZhbGlkIHVzYWdlOiBFTkNSWVBUX0RFQ1JZUFQgYW5kIFNJR05fVkVSSUZZXG4gICAqL1xuICBSU0FfMjA0OCA9ICdSU0FfMjA0OCcsXG5cbiAgLyoqXG4gICAqIFJTQSB3aXRoIDMwNzIgYml0cyBvZiBrZXkuXG4gICAqXG4gICAqIFZhbGlkIHVzYWdlOiBFTkNSWVBUX0RFQ1JZUFQgYW5kIFNJR05fVkVSSUZZXG4gICAqL1xuICBSU0FfMzA3MiA9ICdSU0FfMzA3MicsXG5cbiAgLyoqXG4gICAqIFJTQSB3aXRoIDQwOTYgYml0cyBvZiBrZXkuXG4gICAqXG4gICAqIFZhbGlkIHVzYWdlOiBFTkNSWVBUX0RFQ1JZUFQgYW5kIFNJR05fVkVSSUZZXG4gICAqL1xuICBSU0FfNDA5NiA9ICdSU0FfNDA5NicsXG5cbiAgLyoqXG4gICAqIE5JU1QgRklQUyAxODYtNCwgU2VjdGlvbiA2LjQsIEVDRFNBIHNpZ25hdHVyZSB1c2luZyB0aGUgY3VydmUgc3BlY2lmaWVkIGJ5IHRoZSBrZXkgYW5kXG4gICAqIFNIQS0yNTYgZm9yIHRoZSBtZXNzYWdlIGRpZ2VzdC5cbiAgICpcbiAgICogVmFsaWQgdXNhZ2U6IFNJR05fVkVSSUZZXG4gICAqL1xuICBFQ0NfTklTVF9QMjU2ID0gJ0VDQ19OSVNUX1AyNTYnLFxuXG4gIC8qKlxuICAgKiBOSVNUIEZJUFMgMTg2LTQsIFNlY3Rpb24gNi40LCBFQ0RTQSBzaWduYXR1cmUgdXNpbmcgdGhlIGN1cnZlIHNwZWNpZmllZCBieSB0aGUga2V5IGFuZFxuICAgKiBTSEEtMzg0IGZvciB0aGUgbWVzc2FnZSBkaWdlc3QuXG4gICAqXG4gICAqIFZhbGlkIHVzYWdlOiBTSUdOX1ZFUklGWVxuICAgKi9cbiAgRUNDX05JU1RfUDM4NCA9ICdFQ0NfTklTVF9QMzg0JyxcblxuICAvKipcbiAgICogTklTVCBGSVBTIDE4Ni00LCBTZWN0aW9uIDYuNCwgRUNEU0Egc2lnbmF0dXJlIHVzaW5nIHRoZSBjdXJ2ZSBzcGVjaWZpZWQgYnkgdGhlIGtleSBhbmRcbiAgICogU0hBLTUxMiBmb3IgdGhlIG1lc3NhZ2UgZGlnZXN0LlxuICAgKlxuICAgKiBWYWxpZCB1c2FnZTogU0lHTl9WRVJJRllcbiAgICovXG4gIEVDQ19OSVNUX1A1MjEgPSAnRUNDX05JU1RfUDUyMScsXG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkcyBmb3IgRWZmaWNpZW50IENyeXB0b2dyYXBoeSAyLCBTZWN0aW9uIDIuNC4xLCBFQ0RTQSBzaWduYXR1cmUgb24gdGhlIEtvYmxpdHogY3VydmUuXG4gICAqXG4gICAqIFZhbGlkIHVzYWdlOiBTSUdOX1ZFUklGWVxuICAgKi9cbiAgRUNDX1NFQ0dfUDI1NksxID0gJ0VDQ19TRUNHX1AyNTZLMScsXG59XG5cbi8qKlxuICogVGhlIGtleSB1c2FnZSwgcmVwcmVzZW50cyB0aGUgY3J5cHRvZ3JhcGhpYyBvcGVyYXRpb25zIG9mIGtleXMuXG4gKi9cbmV4cG9ydCBlbnVtIEtleVVzYWdlIHtcbiAgLyoqXG4gICAqIEVuY3J5cHRpb24gYW5kIGRlY3J5cHRpb24uXG4gICAqL1xuICBFTkNSWVBUX0RFQ1JZUFQgPSAnRU5DUllQVF9ERUNSWVBUJyxcblxuICAvKipcbiAgICogU2lnbmluZyBhbmQgdmVyaWZpY2F0aW9uXG4gICAqL1xuICBTSUdOX1ZFUklGWSA9ICdTSUdOX1ZFUklGWScsXG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGEgS01TIEtleSBvYmplY3RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBLZXlQcm9wcyB7XG4gIC8qKlxuICAgKiBBIGRlc2NyaXB0aW9uIG9mIHRoZSBrZXkuIFVzZSBhIGRlc2NyaXB0aW9uIHRoYXQgaGVscHMgeW91ciB1c2VycyBkZWNpZGVcbiAgICogd2hldGhlciB0aGUga2V5IGlzIGFwcHJvcHJpYXRlIGZvciBhIHBhcnRpY3VsYXIgdGFzay5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsIGFsaWFzIHRvIGFkZCB0byB0aGUga2V5XG4gICAqXG4gICAqIE1vcmUgYWxpYXNlcyBjYW4gYmUgYWRkZWQgbGF0ZXIgYnkgY2FsbGluZyBgYWRkQWxpYXNgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGFsaWFzIGlzIGFkZGVkIGZvciB0aGUga2V5LlxuICAgKi9cbiAgcmVhZG9ubHkgYWxpYXM/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIEFXUyBLTVMgcm90YXRlcyB0aGUga2V5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlS2V5Um90YXRpb24/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUga2V5IGlzIGF2YWlsYWJsZSBmb3IgdXNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEtleSBpcyBlbmFibGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBjcnlwdG9ncmFwaGljIGNvbmZpZ3VyYXRpb24gb2YgdGhlIGtleS4gVGhlIHZhbGlkIHZhbHVlIGRlcGVuZHMgb24gdXNhZ2Ugb2YgdGhlIGtleS5cbiAgICpcbiAgICogSU1QT1JUQU5UOiBJZiB5b3UgY2hhbmdlIHRoaXMgcHJvcGVydHkgb2YgYW4gZXhpc3Rpbmcga2V5LCB0aGUgZXhpc3Rpbmcga2V5IGlzIHNjaGVkdWxlZCBmb3IgZGVsZXRpb25cbiAgICogYW5kIGEgbmV3IGtleSBpcyBjcmVhdGVkIHdpdGggdGhlIHNwZWNpZmllZCB2YWx1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgS2V5U3BlYy5TWU1NRVRSSUNfREVGQVVMVFxuICAgKi9cbiAgcmVhZG9ubHkga2V5U3BlYz86IEtleVNwZWM7XG5cbiAgLyoqXG4gICAqIFRoZSBjcnlwdG9ncmFwaGljIG9wZXJhdGlvbnMgZm9yIHdoaWNoIHRoZSBrZXkgY2FuIGJlIHVzZWQuXG4gICAqXG4gICAqIElNUE9SVEFOVDogSWYgeW91IGNoYW5nZSB0aGlzIHByb3BlcnR5IG9mIGFuIGV4aXN0aW5nIGtleSwgdGhlIGV4aXN0aW5nIGtleSBpcyBzY2hlZHVsZWQgZm9yIGRlbGV0aW9uXG4gICAqIGFuZCBhIG5ldyBrZXkgaXMgY3JlYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQgdmFsdWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IEtleVVzYWdlLkVOQ1JZUFRfREVDUllQVFxuICAgKi9cbiAgcmVhZG9ubHkga2V5VXNhZ2U/OiBLZXlVc2FnZTtcblxuICAvKipcbiAgICogQ3VzdG9tIHBvbGljeSBkb2N1bWVudCB0byBhdHRhY2ggdG8gdGhlIEtNUyBrZXkuXG4gICAqXG4gICAqIE5PVEUgLSBJZiB0aGUgYEBhd3MtY2RrL2F3cy1rbXM6ZGVmYXVsdEtleVBvbGljaWVzYCBmZWF0dXJlIGZsYWcgaXMgc2V0ICh0aGUgZGVmYXVsdCBmb3IgbmV3IHByb2plY3RzKSxcbiAgICogdGhpcyBwb2xpY3kgd2lsbCAqb3ZlcnJpZGUqIHRoZSBkZWZhdWx0IGtleSBwb2xpY3kgYW5kIGJlY29tZSB0aGUgb25seSBrZXkgcG9saWN5IGZvciB0aGUga2V5LiBJZiB0aGVcbiAgICogZmVhdHVyZSBmbGFnIGlzIG5vdCBzZXQsIHRoaXMgcG9saWN5IHdpbGwgYmUgYXBwZW5kZWQgdG8gdGhlIGRlZmF1bHQga2V5IHBvbGljeS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIHBvbGljeSBkb2N1bWVudCB3aXRoIHBlcm1pc3Npb25zIGZvciB0aGUgYWNjb3VudCByb290IHRvXG4gICAqIGFkbWluaXN0ZXIgdGhlIGtleSB3aWxsIGJlIGNyZWF0ZWQuXG4gICAqL1xuICByZWFkb25seSBwb2xpY3k/OiBpYW0uUG9saWN5RG9jdW1lbnQ7XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBwcmluY2lwYWxzIHRvIGFkZCBhcyBrZXkgYWRtaW5pc3RyYXRvcnMgdG8gdGhlIGtleSBwb2xpY3kuXG4gICAqXG4gICAqIEtleSBhZG1pbmlzdHJhdG9ycyBoYXZlIHBlcm1pc3Npb25zIHRvIG1hbmFnZSB0aGUga2V5IChlLmcuLCBjaGFuZ2UgcGVybWlzc2lvbnMsIHJldm9rZSksIGJ1dCBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uc1xuICAgKiB0byB1c2UgdGhlIGtleSBpbiBjcnlwdG9ncmFwaGljIG9wZXJhdGlvbnMgKGUuZy4sIGVuY3J5cHQsIGRlY3J5cHQpLlxuICAgKlxuICAgKiBUaGVzZSBwcmluY2lwYWxzIHdpbGwgYmUgYWRkZWQgdG8gdGhlIGRlZmF1bHQga2V5IHBvbGljeSAoaWYgbm9uZSBzcGVjaWZpZWQpLCBvciB0byB0aGUgc3BlY2lmaWVkIHBvbGljeSAoaWYgcHJvdmlkZWQpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBbXVxuICAgKi9cbiAgcmVhZG9ubHkgYWRtaW5zPzogaWFtLklQcmluY2lwYWxbXTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZW5jcnlwdGlvbiBrZXkgc2hvdWxkIGJlIHJldGFpbmVkIHdoZW4gaXQgaXMgcmVtb3ZlZCBmcm9tIHRoZSBTdGFjay4gVGhpcyBpcyB1c2VmdWwgd2hlbiBvbmUgd2FudHMgdG9cbiAgICogcmV0YWluIGFjY2VzcyB0byBkYXRhIHRoYXQgd2FzIGVuY3J5cHRlZCB3aXRoIGEga2V5IHRoYXQgaXMgYmVpbmcgcmV0aXJlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgUmVtb3ZhbFBvbGljeS5SZXRhaW5cbiAgICovXG4gIHJlYWRvbmx5IHJlbW92YWxQb2xpY3k/OiBSZW1vdmFsUG9saWN5O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBrZXkgdXNhZ2UgY2FuIGJlIGdyYW50ZWQgYnkgSUFNIHBvbGljaWVzXG4gICAqXG4gICAqIFNldHRpbmcgdGhpcyB0byB0cnVlIGFkZHMgYSBkZWZhdWx0IHN0YXRlbWVudCB3aGljaCBkZWxlZ2F0ZXMga2V5XG4gICAqIGFjY2VzcyBjb250cm9sIGNvbXBsZXRlbHkgdG8gdGhlIGlkZW50aXR5J3MgSUFNIHBvbGljeSAoc2ltaWxhclxuICAgKiB0byBob3cgaXQgd29ya3MgZm9yIG90aGVyIEFXUyByZXNvdXJjZXMpLiBUaGlzIG1hdGNoZXMgdGhlIGRlZmF1bHQgYmVoYXZpb3JcbiAgICogd2hlbiBjcmVhdGluZyBLTVMga2V5cyB2aWEgdGhlIEFQSSBvciBjb25zb2xlLlxuICAgKlxuICAgKiBJZiB0aGUgYEBhd3MtY2RrL2F3cy1rbXM6ZGVmYXVsdEtleVBvbGljaWVzYCBmZWF0dXJlIGZsYWcgaXMgc2V0ICh0aGUgZGVmYXVsdCBmb3IgbmV3IHByb2plY3RzKSxcbiAgICogdGhpcyBmbGFnIHdpbGwgYWx3YXlzIGJlIHRyZWF0ZWQgYXMgJ3RydWUnIGFuZCBkb2VzIG5vdCBuZWVkIHRvIGJlIGV4cGxpY2l0bHkgc2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZhbHNlLCB1bmxlc3MgdGhlIGBAYXdzLWNkay9hd3Mta21zOmRlZmF1bHRLZXlQb2xpY2llc2AgZmVhdHVyZSBmbGFnIGlzIHNldC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20va21zL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9rZXktcG9saWNpZXMuaHRtbCNrZXktcG9saWN5LWRlZmF1bHQtYWxsb3ctcm9vdC1lbmFibGUtaWFtXG4gICAqIEBkZXByZWNhdGVkIHJlZHVuZGFudCB3aXRoIHRoZSBgQGF3cy1jZGsvYXdzLWttczpkZWZhdWx0S2V5UG9saWNpZXNgIGZlYXR1cmUgZmxhZ1xuICAgKi9cbiAgcmVhZG9ubHkgdHJ1c3RBY2NvdW50SWRlbnRpdGllcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgbnVtYmVyIG9mIGRheXMgaW4gdGhlIHdhaXRpbmcgcGVyaW9kIGJlZm9yZVxuICAgKiBBV1MgS01TIGRlbGV0ZXMgYSBDTUsgdGhhdCBoYXMgYmVlbiByZW1vdmVkIGZyb20gYSBDbG91ZEZvcm1hdGlvbiBzdGFjay5cbiAgICpcbiAgICogV2hlbiB5b3UgcmVtb3ZlIGEgY3VzdG9tZXIgbWFzdGVyIGtleSAoQ01LKSBmcm9tIGEgQ2xvdWRGb3JtYXRpb24gc3RhY2ssIEFXUyBLTVMgc2NoZWR1bGVzIHRoZSBDTUsgZm9yIGRlbGV0aW9uXG4gICAqIGFuZCBzdGFydHMgdGhlIG1hbmRhdG9yeSB3YWl0aW5nIHBlcmlvZC4gVGhlIFBlbmRpbmdXaW5kb3dJbkRheXMgcHJvcGVydHkgZGV0ZXJtaW5lcyB0aGUgbGVuZ3RoIG9mIHdhaXRpbmcgcGVyaW9kLlxuICAgKiBEdXJpbmcgdGhlIHdhaXRpbmcgcGVyaW9kLCB0aGUga2V5IHN0YXRlIG9mIENNSyBpcyBQZW5kaW5nIERlbGV0aW9uLCB3aGljaCBwcmV2ZW50cyB0aGUgQ01LIGZyb20gYmVpbmcgdXNlZCBpblxuICAgKiBjcnlwdG9ncmFwaGljIG9wZXJhdGlvbnMuIFdoZW4gdGhlIHdhaXRpbmcgcGVyaW9kIGV4cGlyZXMsIEFXUyBLTVMgcGVybWFuZW50bHkgZGVsZXRlcyB0aGUgQ01LLlxuICAgKlxuICAgKiBFbnRlciBhIHZhbHVlIGJldHdlZW4gNyBhbmQgMzAgZGF5cy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Uta21zLWtleS5odG1sI2Nmbi1rbXMta2V5LXBlbmRpbmd3aW5kb3dpbmRheXNcbiAgICogQGRlZmF1bHQgLSAzMCBkYXlzXG4gICAqL1xuICByZWFkb25seSBwZW5kaW5nV2luZG93PzogRHVyYXRpb247XG59XG5cbi8qKlxuICogRGVmaW5lcyBhIEtNUyBrZXkuXG4gKlxuICogQHJlc291cmNlIEFXUzo6S01TOjpLZXlcbiAqL1xuZXhwb3J0IGNsYXNzIEtleSBleHRlbmRzIEtleUJhc2Uge1xuICAvKipcbiAgICogSW1wb3J0IGFuIGV4dGVybmFsbHkgZGVmaW5lZCBLTVMgS2V5IHVzaW5nIGl0cyBBUk4uXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSAgdGhlIGNvbnN0cnVjdCB0aGF0IHdpbGwgXCJvd25cIiB0aGUgaW1wb3J0ZWQga2V5LlxuICAgKiBAcGFyYW0gaWQgICAgIHRoZSBpZCBvZiB0aGUgaW1wb3J0ZWQga2V5IGluIHRoZSBjb25zdHJ1Y3QgdHJlZS5cbiAgICogQHBhcmFtIGtleUFybiB0aGUgQVJOIG9mIGFuIGV4aXN0aW5nIEtNUyBrZXkuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21LZXlBcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywga2V5QXJuOiBzdHJpbmcpOiBJS2V5IHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBLZXlCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBrZXlBcm4gPSBrZXlBcm47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkga2V5SWQ6IHN0cmluZztcbiAgICAgIHByb3RlY3RlZCByZWFkb25seSBwb2xpY3k/OiBpYW0uUG9saWN5RG9jdW1lbnQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICAvLyBkZWZhdWx0aW5nIHRydWU6IGlmIHdlIGFyZSBpbXBvcnRpbmcgdGhlIGtleSB0aGUga2V5IHBvbGljeSBpc1xuICAgICAgLy8gdW5kZWZpbmVkIGFuZCBpbXBvc3NpYmxlIHRvIGNoYW5nZSBoZXJlOyB0aGlzIG1lYW5zIHVwZGF0aW5nIGlkZW50aXR5XG4gICAgICAvLyBwb2xpY2llcyBpcyByZWFsbHkgdGhlIG9ubHkgb3B0aW9uXG4gICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdHJ1c3RBY2NvdW50SWRlbnRpdGllczogYm9vbGVhbiA9IHRydWU7XG5cbiAgICAgIGNvbnN0cnVjdG9yKGtleUlkOiBzdHJpbmcsIHByb3BzOiBSZXNvdXJjZVByb3BzID0ge30pIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAgICAgdGhpcy5rZXlJZCA9IGtleUlkO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGtleVJlc291cmNlTmFtZSA9IFN0YWNrLm9mKHNjb3BlKS5zcGxpdEFybihrZXlBcm4sIEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FKS5yZXNvdXJjZU5hbWU7XG4gICAgaWYgKCFrZXlSZXNvdXJjZU5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgS01TIGtleSBBUk4gbXVzdCBiZSBpbiB0aGUgZm9ybWF0ICdhcm46YXdzOmttczo8cmVnaW9uPjo8YWNjb3VudD46a2V5LzxrZXlJZD4nLCBnb3Q6ICcke2tleUFybn0nYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoa2V5UmVzb3VyY2VOYW1lLCB7XG4gICAgICBlbnZpcm9ubWVudEZyb21Bcm46IGtleUFybixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBtdXRhYmxlIGBJS2V5YCBiYXNlZCBvbiBhIGxvdy1sZXZlbCBgQ2ZuS2V5YC5cbiAgICogVGhpcyBpcyBtb3N0IHVzZWZ1bCB3aGVuIGNvbWJpbmVkIHdpdGggdGhlIGNsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgKiBUaGlzIG1ldGhvZCBpcyBkaWZmZXJlbnQgdGhhbiBgZnJvbUtleUFybigpYCBiZWNhdXNlIHRoZSBgSUtleWBcbiAgICogcmV0dXJuZWQgZnJvbSB0aGlzIG1ldGhvZCBpcyBtdXRhYmxlO1xuICAgKiBtZWFuaW5nLCBjYWxsaW5nIGFueSBtdXRhdGluZyBtZXRob2RzIG9uIGl0LFxuICAgKiBsaWtlIGBJS2V5LmFkZFRvUmVzb3VyY2VQb2xpY3koKWAsXG4gICAqIHdpbGwgYWN0dWFsbHkgYmUgcmVmbGVjdGVkIGluIHRoZSByZXN1bHRpbmcgdGVtcGxhdGUsXG4gICAqIGFzIG9wcG9zZWQgdG8gdGhlIG9iamVjdCByZXR1cm5lZCBmcm9tIGBmcm9tS2V5QXJuKClgLFxuICAgKiBvbiB3aGljaCBjYWxsaW5nIHRob3NlIG1ldGhvZHMgd291bGQgaGF2ZSBubyBlZmZlY3QuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21DZm5LZXkoY2ZuS2V5OiBDZm5LZXkpOiBJS2V5IHtcbiAgICAvLyB1c2UgYSBcIndlaXJkXCIgaWQgdGhhdCBoYXMgYSBoaWdoZXIgY2hhbmNlIG9mIGJlaW5nIHVuaXF1ZVxuICAgIGNvbnN0IGlkID0gJ0BGcm9tQ2ZuS2V5JztcblxuICAgIC8vIGlmIGZyb21DZm5LZXkoKSB3YXMgYWxyZWFkeSBjYWxsZWQgb24gdGhpcyBjZm5LZXksXG4gICAgLy8gcmV0dXJuIHRoZSBzYW1lIEwyXG4gICAgLy8gKGFzIGRpZmZlcmVudCBMMnMgd291bGQgY29uZmxpY3QsIGJlY2F1c2Ugb2YgdGhlIG11dGF0aW9uIG9mIHRoZSBrZXlQb2xpY3kgcHJvcGVydHkgb2YgdGhlIEwxIGJlbG93KVxuICAgIGNvbnN0IGV4aXN0aW5nID0gY2ZuS2V5Lm5vZGUudHJ5RmluZENoaWxkKGlkKTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIHJldHVybiA8SUtleT5leGlzdGluZztcbiAgICB9XG5cbiAgICBsZXQga2V5UG9saWN5OiBpYW0uUG9saWN5RG9jdW1lbnQ7XG4gICAgdHJ5IHtcbiAgICAgIGtleVBvbGljeSA9IGlhbS5Qb2xpY3lEb2N1bWVudC5mcm9tSnNvbihjZm5LZXkua2V5UG9saWN5KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBJZiB0aGUgS2V5UG9saWN5IGNvbnRhaW5zIGFueSBDbG91ZEZvcm1hdGlvbiBmdW5jdGlvbnMsXG4gICAgICAvLyBQb2xpY3lEb2N1bWVudC5mcm9tSnNvbigpIHRocm93cyBhbiBleGNlcHRpb24uXG4gICAgICAvLyBJbiB0aGF0IGNhc2UsIGJlY2F1c2Ugd2Ugd291bGQgaGF2ZSB0byBlZmZlY3RpdmVseSBtYWtlIHRoZSByZXR1cm5lZCBJS2V5IGltbXV0YWJsZSxcbiAgICAgIC8vIHRocm93IGFuIGV4Y2VwdGlvbiBzdWdnZXN0aW5nIHRvIHVzZSB0aGUgb3RoZXIgaW1wb3J0aW5nIG1ldGhvZHMgaW5zdGVhZC5cbiAgICAgIC8vIFdlIG1pZ2h0IG1ha2UgdGhpcyBwYXJzaW5nIGxvZ2ljIHNtYXJ0ZXIgbGF0ZXIsXG4gICAgICAvLyBidXQgbGV0J3Mgc3RhcnQgYnkgZXJyb3Jpbmcgb3V0LlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgcGFyc2UgdGhlIFBvbGljeURvY3VtZW50IG9mIHRoZSBwYXNzZWQgQVdTOjpLTVM6OktleSByZXNvdXJjZSBiZWNhdXNlIGl0IGNvbnRhaW5zIENsb3VkRm9ybWF0aW9uIGZ1bmN0aW9ucy4gJyArXG4gICAgICAgICdUaGlzIG1ha2VzIGl0IGltcG9zc2libGUgdG8gY3JlYXRlIGEgbXV0YWJsZSBJS2V5IGZyb20gdGhhdCBQb2xpY3kuICcgK1xuICAgICAgICAnWW91IGhhdmUgdG8gdXNlIGZyb21LZXlBcm4gaW5zdGVhZCwgcGFzc2luZyBpdCB0aGUgQVJOIGF0dHJpYnV0ZSBwcm9wZXJ0eSBvZiB0aGUgbG93LWxldmVsIENmbktleScpO1xuICAgIH1cblxuICAgIC8vIGNoYW5nZSB0aGUga2V5IHBvbGljeSBvZiB0aGUgTDEsIHNvIHRoYXQgYWxsIGNoYW5nZXMgZG9uZSBpbiB0aGUgTDIgYXJlIHJlZmxlY3RlZCBpbiB0aGUgcmVzdWx0aW5nIHRlbXBsYXRlXG4gICAgY2ZuS2V5LmtleVBvbGljeSA9IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4ga2V5UG9saWN5LnRvSlNPTigpIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEtleUJhc2Uge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGtleUFybiA9IGNmbktleS5hdHRyQXJuO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGtleUlkID0gY2ZuS2V5LnJlZjtcbiAgICAgIHByb3RlY3RlZCByZWFkb25seSBwb2xpY3kgPSBrZXlQb2xpY3k7XG4gICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdHJ1c3RBY2NvdW50SWRlbnRpdGllcyA9IGZhbHNlO1xuICAgIH0oY2ZuS2V5LCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIEtleSBieSBxdWVyeWluZyB0aGUgQVdTIGVudmlyb25tZW50IHRoaXMgc3RhY2sgaXMgZGVwbG95ZWQgdG8uXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gb25seSBuZWVkcyB0byBiZSB1c2VkIHRvIHVzZSBLZXlzIG5vdCBkZWZpbmVkIGluIHlvdXIgQ0RLXG4gICAqIGFwcGxpY2F0aW9uLiBJZiB5b3UgYXJlIGxvb2tpbmcgdG8gc2hhcmUgYSBLZXkgYmV0d2VlbiBzdGFja3MsIHlvdSBjYW5cbiAgICogcGFzcyB0aGUgYEtleWAgb2JqZWN0IGJldHdlZW4gc3RhY2tzIGFuZCB1c2UgaXQgYXMgbm9ybWFsLiBJbiBhZGRpdGlvbixcbiAgICogaXQncyBub3QgbmVjZXNzYXJ5IHRvIHVzZSB0aGlzIG1ldGhvZCBpZiBhbiBpbnRlcmZhY2UgYWNjZXB0cyBhbiBgSUtleWAuXG4gICAqIEluIHRoaXMgY2FzZSwgYEFsaWFzLmZyb21BbGlhc05hbWUoKWAgY2FuIGJlIHVzZWQgd2hpY2ggcmV0dXJucyBhbiBhbGlhc1xuICAgKiB0aGF0IGV4dGVuZHMgYElLZXlgLlxuICAgKlxuICAgKiBDYWxsaW5nIHRoaXMgbWV0aG9kIHdpbGwgbGVhZCB0byBhIGxvb2t1cCB3aGVuIHRoZSBDREsgQ0xJIGlzIGV4ZWN1dGVkLlxuICAgKiBZb3UgY2FuIHRoZXJlZm9yZSBub3QgdXNlIGFueSB2YWx1ZXMgdGhhdCB3aWxsIG9ubHkgYmUgYXZhaWxhYmxlIGF0XG4gICAqIENsb3VkRm9ybWF0aW9uIGV4ZWN1dGlvbiB0aW1lIChpLmUuLCBUb2tlbnMpLlxuICAgKlxuICAgKiBUaGUgS2V5IGluZm9ybWF0aW9uIHdpbGwgYmUgY2FjaGVkIGluIGBjZGsuY29udGV4dC5qc29uYCBhbmQgdGhlIHNhbWUgS2V5XG4gICAqIHdpbGwgYmUgdXNlZCBvbiBmdXR1cmUgcnVucy4gVG8gcmVmcmVzaCB0aGUgbG9va3VwLCB5b3Ugd2lsbCBoYXZlIHRvXG4gICAqIGV2aWN0IHRoZSB2YWx1ZSBmcm9tIHRoZSBjYWNoZSB1c2luZyB0aGUgYGNkayBjb250ZXh0YCBjb21tYW5kLiBTZWVcbiAgICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9sYXRlc3QvZ3VpZGUvY29udGV4dC5odG1sIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTG9va3VwKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG9wdGlvbnM6IEtleUxvb2t1cE9wdGlvbnMpOiBJS2V5IHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBLZXlCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBrZXlBcm46IHN0cmluZztcbiAgICAgIHB1YmxpYyByZWFkb25seSBrZXlJZDogc3RyaW5nO1xuICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHBvbGljeT86IGlhbS5Qb2xpY3lEb2N1bWVudCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICAgIC8vIGRlZmF1bHRpbmcgdHJ1ZTogaWYgd2UgYXJlIGltcG9ydGluZyB0aGUga2V5IHRoZSBrZXkgcG9saWN5IGlzXG4gICAgICAvLyB1bmRlZmluZWQgYW5kIGltcG9zc2libGUgdG8gY2hhbmdlIGhlcmU7IHRoaXMgbWVhbnMgdXBkYXRpbmcgaWRlbnRpdHlcbiAgICAgIC8vIHBvbGljaWVzIGlzIHJlYWxseSB0aGUgb25seSBvcHRpb25cbiAgICAgIHByb3RlY3RlZCByZWFkb25seSB0cnVzdEFjY291bnRJZGVudGl0aWVzOiBib29sZWFuID0gdHJ1ZTtcblxuICAgICAgY29uc3RydWN0b3Ioa2V5SWQ6IHN0cmluZywga2V5QXJuOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICB0aGlzLmtleUlkID0ga2V5SWQ7XG4gICAgICAgIHRoaXMua2V5QXJuID0ga2V5QXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKG9wdGlvbnMuYWxpYXNOYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbGwgYXJndW1lbnRzIHRvIEtleS5mcm9tTG9va3VwKCkgbXVzdCBiZSBjb25jcmV0ZSAobm8gVG9rZW5zKScpO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYnV0ZXM6IGN4YXBpLktleUNvbnRleHRSZXNwb25zZSA9IENvbnRleHRQcm92aWRlci5nZXRWYWx1ZShzY29wZSwge1xuICAgICAgcHJvdmlkZXI6IGN4c2NoZW1hLkNvbnRleHRQcm92aWRlci5LRVlfUFJPVklERVIsXG4gICAgICBwcm9wczoge1xuICAgICAgICBhbGlhc05hbWU6IG9wdGlvbnMuYWxpYXNOYW1lLFxuICAgICAgfSBhcyBjeHNjaGVtYS5LZXlDb250ZXh0UXVlcnksXG4gICAgICBkdW1teVZhbHVlOiB7XG4gICAgICAgIGtleUlkOiAnMTIzNGFiY2QtMTJhYi0zNGNkLTU2ZWYtMTIzNDU2Nzg5MGFiJyxcbiAgICAgIH0sXG4gICAgfSkudmFsdWU7XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChhdHRyaWJ1dGVzLmtleUlkLFxuICAgICAgQXJuLmZvcm1hdCh7IHJlc291cmNlOiAna2V5Jywgc2VydmljZTogJ2ttcycsIHJlc291cmNlTmFtZTogYXR0cmlidXRlcy5rZXlJZCB9LCBTdGFjay5vZihzY29wZSkpKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBrZXlBcm46IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGtleUlkOiBzdHJpbmc7XG4gIHByb3RlY3RlZCByZWFkb25seSBwb2xpY3k/OiBpYW0uUG9saWN5RG9jdW1lbnQ7XG4gIHByb3RlY3RlZCByZWFkb25seSB0cnVzdEFjY291bnRJZGVudGl0aWVzOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBLZXlQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGRlbnlMaXN0cyA9IHtcbiAgICAgIFtLZXlVc2FnZS5FTkNSWVBUX0RFQ1JZUFRdOiBbXG4gICAgICAgIEtleVNwZWMuRUNDX05JU1RfUDI1NixcbiAgICAgICAgS2V5U3BlYy5FQ0NfTklTVF9QMzg0LFxuICAgICAgICBLZXlTcGVjLkVDQ19OSVNUX1A1MjEsXG4gICAgICAgIEtleVNwZWMuRUNDX1NFQ0dfUDI1NksxLFxuICAgICAgXSxcbiAgICAgIFtLZXlVc2FnZS5TSUdOX1ZFUklGWV06IFtcbiAgICAgICAgS2V5U3BlYy5TWU1NRVRSSUNfREVGQVVMVCxcbiAgICAgIF0sXG4gICAgfTtcbiAgICBjb25zdCBrZXlTcGVjID0gcHJvcHMua2V5U3BlYyA/PyBLZXlTcGVjLlNZTU1FVFJJQ19ERUZBVUxUO1xuICAgIGNvbnN0IGtleVVzYWdlID0gcHJvcHMua2V5VXNhZ2UgPz8gS2V5VXNhZ2UuRU5DUllQVF9ERUNSWVBUO1xuICAgIGlmIChkZW55TGlzdHNba2V5VXNhZ2VdLmluY2x1ZGVzKGtleVNwZWMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGtleSBzcGVjICcke2tleVNwZWN9JyBpcyBub3QgdmFsaWQgd2l0aCB1c2FnZSAnJHtrZXlVc2FnZX0nYCk7XG4gICAgfVxuXG4gICAgaWYgKGtleVNwZWMgIT09IEtleVNwZWMuU1lNTUVUUklDX0RFRkFVTFQgJiYgcHJvcHMuZW5hYmxlS2V5Um90YXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigna2V5IHJvdGF0aW9uIGNhbm5vdCBiZSBlbmFibGVkIG9uIGFzeW1tZXRyaWMga2V5cycpO1xuICAgIH1cblxuICAgIGNvbnN0IGRlZmF1bHRLZXlQb2xpY2llc0ZlYXR1cmVFbmFibGVkID0gRmVhdHVyZUZsYWdzLm9mKHRoaXMpLmlzRW5hYmxlZChjeGFwaS5LTVNfREVGQVVMVF9LRVlfUE9MSUNJRVMpO1xuXG4gICAgdGhpcy5wb2xpY3kgPSBwcm9wcy5wb2xpY3kgPz8gbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCgpO1xuICAgIGlmIChkZWZhdWx0S2V5UG9saWNpZXNGZWF0dXJlRW5hYmxlZCkge1xuICAgICAgaWYgKHByb3BzLnRydXN0QWNjb3VudElkZW50aXRpZXMgPT09IGZhbHNlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYHRydXN0QWNjb3VudElkZW50aXRpZXNgIGNhbm5vdCBiZSBmYWxzZSBpZiB0aGUgQGF3cy1jZGsvYXdzLWttczpkZWZhdWx0S2V5UG9saWNpZXMgZmVhdHVyZSBmbGFnIGlzIHNldCcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRydXN0QWNjb3VudElkZW50aXRpZXMgPSB0cnVlO1xuICAgICAgLy8gU2V0IHRoZSBkZWZhdWx0IGtleSBwb2xpY3kgaWYgb25lIGhhc24ndCBiZWVuIHByb3ZpZGVkIGJ5IHRoZSB1c2VyLlxuICAgICAgaWYgKCFwcm9wcy5wb2xpY3kpIHtcbiAgICAgICAgdGhpcy5hZGREZWZhdWx0QWRtaW5Qb2xpY3koKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50cnVzdEFjY291bnRJZGVudGl0aWVzID0gcHJvcHMudHJ1c3RBY2NvdW50SWRlbnRpdGllcyA/PyBmYWxzZTtcbiAgICAgIGlmICh0aGlzLnRydXN0QWNjb3VudElkZW50aXRpZXMpIHtcbiAgICAgICAgdGhpcy5hZGREZWZhdWx0QWRtaW5Qb2xpY3koKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWRkTGVnYWN5QWRtaW5Qb2xpY3koKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcGVuZGluZ1dpbmRvd0luRGF5cztcbiAgICBpZiAocHJvcHMucGVuZGluZ1dpbmRvdykge1xuICAgICAgcGVuZGluZ1dpbmRvd0luRGF5cyA9IHByb3BzLnBlbmRpbmdXaW5kb3cudG9EYXlzKCk7XG4gICAgICBpZiAocGVuZGluZ1dpbmRvd0luRGF5cyA8IDcgfHwgcGVuZGluZ1dpbmRvd0luRGF5cyA+IDMwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJ3BlbmRpbmdXaW5kb3cnIHZhbHVlIG11c3QgYmV0d2VlbiA3IGFuZCAzMCBkYXlzLiBSZWNlaXZlZDogJHtwZW5kaW5nV2luZG93SW5EYXlzfWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbktleSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBkZXNjcmlwdGlvbjogcHJvcHMuZGVzY3JpcHRpb24sXG4gICAgICBlbmFibGVLZXlSb3RhdGlvbjogcHJvcHMuZW5hYmxlS2V5Um90YXRpb24sXG4gICAgICBlbmFibGVkOiBwcm9wcy5lbmFibGVkLFxuICAgICAga2V5U3BlYzogcHJvcHMua2V5U3BlYyxcbiAgICAgIGtleVVzYWdlOiBwcm9wcy5rZXlVc2FnZSxcbiAgICAgIGtleVBvbGljeTogdGhpcy5wb2xpY3ksXG4gICAgICBwZW5kaW5nV2luZG93SW5EYXlzOiBwZW5kaW5nV2luZG93SW5EYXlzLFxuICAgIH0pO1xuXG4gICAgdGhpcy5rZXlBcm4gPSByZXNvdXJjZS5hdHRyQXJuO1xuICAgIHRoaXMua2V5SWQgPSByZXNvdXJjZS5yZWY7XG4gICAgcmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KHByb3BzLnJlbW92YWxQb2xpY3kpO1xuXG4gICAgKHByb3BzLmFkbWlucyA/PyBbXSkuZm9yRWFjaCgocCkgPT4gdGhpcy5ncmFudEFkbWluKHApKTtcblxuICAgIGlmIChwcm9wcy5hbGlhcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmFkZEFsaWFzKHByb3BzLmFsaWFzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgYWRtaW5zIHBlcm1pc3Npb25zIHVzaW5nIHRoaXMga2V5IHRvIHRoZSBnaXZlbiBwcmluY2lwYWxcbiAgICpcbiAgICogS2V5IGFkbWluaXN0cmF0b3JzIGhhdmUgcGVybWlzc2lvbnMgdG8gbWFuYWdlIHRoZSBrZXkgKGUuZy4sIGNoYW5nZSBwZXJtaXNzaW9ucywgcmV2b2tlKSwgYnV0IGRvIG5vdCBoYXZlIHBlcm1pc3Npb25zXG4gICAqIHRvIHVzZSB0aGUga2V5IGluIGNyeXB0b2dyYXBoaWMgb3BlcmF0aW9ucyAoZS5nLiwgZW5jcnlwdCwgZGVjcnlwdCkuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRBZG1pbihncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbnQoZ3JhbnRlZSwgLi4ucGVybXMuQURNSU5fQUNUSU9OUyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgZGVmYXVsdCBrZXkgcG9saWN5IHRvIHRoZSBrZXkuIFRoaXMgcG9saWN5IGdpdmVzIHRoZSBBV1MgYWNjb3VudCAocm9vdCB1c2VyKSBmdWxsIGFjY2VzcyB0byB0aGUgQ01LLFxuICAgKiB3aGljaCByZWR1Y2VzIHRoZSByaXNrIG9mIHRoZSBDTUsgYmVjb21pbmcgdW5tYW5hZ2VhYmxlIGFuZCBlbmFibGVzIElBTSBwb2xpY2llcyB0byBhbGxvdyBhY2Nlc3MgdG8gdGhlIENNSy5cbiAgICogVGhpcyBpcyB0aGUgc2FtZSBwb2xpY3kgdGhhdCBpcyBkZWZhdWx0IHdoZW4gY3JlYXRpbmcgYSBLZXkgdmlhIHRoZSBLTVMgQVBJIG9yIENvbnNvbGUuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2ttcy9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUva2V5LXBvbGljaWVzLmh0bWwja2V5LXBvbGljeS1kZWZhdWx0XG4gICAqL1xuICBwcml2YXRlIGFkZERlZmF1bHRBZG1pblBvbGljeSgpIHtcbiAgICB0aGlzLmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIGFjdGlvbnM6IFsna21zOionXSxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCldLFxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudHMgdGhlIGFjY291bnQgYWRtaW4gcHJpdmlsZWdlcyAtLSBub3QgZnVsbCBhY2NvdW50IGFjY2VzcyAtLSBwbHVzIHRoZSBHZW5lcmF0ZURhdGFLZXkgYWN0aW9uLlxuICAgKiBUaGUgR2VuZXJhdGVEYXRhS2V5IGFjdGlvbiB3YXMgYWRkZWQgZm9yIGludGVyb3Agd2l0aCBTMyBpbiBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvaXNzdWVzLzM0NTguXG4gICAqXG4gICAqIFRoaXMgcG9saWN5IGlzIGRpc2NvdXJhZ2VkIGFuZCBkZXByZWNhdGVkIGJ5IHRoZSBgQGF3cy1jZGsvYXdzLWttczpkZWZhdWx0S2V5UG9saWNpZXNgIGZlYXR1cmUgZmxhZy5cbiAgICpcbiAgICogQGxpbmsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2ttcy9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUva2V5LXBvbGljaWVzLmh0bWwja2V5LXBvbGljeS1kZWZhdWx0XG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBwcml2YXRlIGFkZExlZ2FjeUFkbWluUG9saWN5KCkge1xuICAgIC8vIFRoaXMgaXMgZXF1aXZhbGVudCB0byBgWy4uLnBlcm1zLkFETUlOX0FDVElPTlMsICdrbXM6R2VuZXJhdGVEYXRhS2V5J11gLFxuICAgIC8vIGJ1dCBrZWVwaW5nIHRoaXMgZXhwbGljaXQgb3JkZXJpbmcgZm9yIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IChjaGFuZ2luZyB0aGUgb3JkZXJpbmcgY2F1c2VzIHJlc291cmNlIHVwZGF0ZXMpXG4gICAgY29uc3QgYWN0aW9ucyA9IFtcbiAgICAgICdrbXM6Q3JlYXRlKicsXG4gICAgICAna21zOkRlc2NyaWJlKicsXG4gICAgICAna21zOkVuYWJsZSonLFxuICAgICAgJ2ttczpMaXN0KicsXG4gICAgICAna21zOlB1dConLFxuICAgICAgJ2ttczpVcGRhdGUqJyxcbiAgICAgICdrbXM6UmV2b2tlKicsXG4gICAgICAna21zOkRpc2FibGUqJyxcbiAgICAgICdrbXM6R2V0KicsXG4gICAgICAna21zOkRlbGV0ZSonLFxuICAgICAgJ2ttczpTY2hlZHVsZUtleURlbGV0aW9uJyxcbiAgICAgICdrbXM6Q2FuY2VsS2V5RGVsZXRpb24nLFxuICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXknLFxuICAgICAgJ2ttczpUYWdSZXNvdXJjZScsXG4gICAgICAna21zOlVudGFnUmVzb3VyY2UnLFxuICAgIF07XG5cbiAgICB0aGlzLmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIGFjdGlvbnMsXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpXSxcbiAgICB9KSk7XG4gIH1cbn1cbiJdfQ==