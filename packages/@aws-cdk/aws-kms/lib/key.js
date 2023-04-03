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
     * Grant permissions to generating MACs to the given principal
     */
    grantGenerateMac(grantee) {
        return this.grant(grantee, ...perms.GENERATE_HMAC_ACTIONS);
    }
    /**
     * Grant permissions to verifying MACs to the given principal
     */
    grantVerifyMac(grantee) {
        return this.grant(grantee, ...perms.VERIFY_HMAC_ACTIONS);
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
    /**
     * Hash-Based Message Authentication Code as defined in RFC 2104 using the message digest function SHA224.
     *
     * Valid usage: GENERATE_VERIFY_MAC
     */
    KeySpec["HMAC_224"] = "HMAC_224";
    /**
     * Hash-Based Message Authentication Code as defined in RFC 2104 using the message digest function SHA256.
     *
     * Valid usage: GENERATE_VERIFY_MAC
     */
    KeySpec["HMAC_256"] = "HMAC_256";
    /**
     * Hash-Based Message Authentication Code as defined in RFC 2104 using the message digest function SHA384.
     *
     * Valid usage: GENERATE_VERIFY_MAC
     */
    KeySpec["HMAC_384"] = "HMAC_384";
    /**
     * Hash-Based Message Authentication Code as defined in RFC 2104 using the message digest function SHA512.
     *
     * Valid usage: GENERATE_VERIFY_MAC
     */
    KeySpec["HMAC_512"] = "HMAC_512";
    /**
     * Elliptic curve key spec available only in China Regions.
     *
     * Valid usage: ENCRYPT_DECRYPT and SIGN_VERIFY
     */
    KeySpec["SM2"] = "SM2";
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
    /**
     * Generating and verifying MACs
     */
    KeyUsage["GENERATE_VERIFY_MAC"] = "GENERATE_VERIFY_MAC";
})(KeyUsage = exports.KeyUsage || (exports.KeyUsage = {}));
/**
 * Defines a KMS key.
 *
 * @resource AWS::KMS::Key
 */
class Key extends KeyBase {
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
        catch {
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
                KeySpec.HMAC_224,
                KeySpec.HMAC_256,
                KeySpec.HMAC_384,
                KeySpec.HMAC_512,
            ],
            [KeyUsage.SIGN_VERIFY]: [
                KeySpec.SYMMETRIC_DEFAULT,
                KeySpec.HMAC_224,
                KeySpec.HMAC_256,
                KeySpec.HMAC_384,
                KeySpec.HMAC_512,
            ],
            [KeyUsage.GENERATE_VERIFY_MAC]: [
                KeySpec.RSA_2048,
                KeySpec.RSA_3072,
                KeySpec.RSA_4096,
                KeySpec.ECC_NIST_P256,
                KeySpec.ECC_NIST_P384,
                KeySpec.ECC_NIST_P521,
                KeySpec.ECC_SECG_P256K1,
                KeySpec.SYMMETRIC_DEFAULT,
                KeySpec.SM2,
            ],
        };
        const keySpec = props.keySpec ?? KeySpec.SYMMETRIC_DEFAULT;
        const keyUsage = props.keyUsage ?? KeyUsage.ENCRYPT_DECRYPT;
        if (denyLists[keyUsage].includes(keySpec)) {
            throw new Error(`key spec '${keySpec}' is not valid with usage '${keyUsage}'`);
        }
        if (keySpec.startsWith('HMAC') && props.enableKeyRotation) {
            throw new Error('key rotation cannot be enabled on HMAC keys');
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
_a = JSII_RTTI_SYMBOL_1;
Key[_a] = { fqn: "@aws-cdk/aws-kms.Key", version: "0.0.0" };
exports.Key = Key;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsia2V5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4QywyREFBMkQ7QUFDM0Qsd0NBYXVCO0FBQ3ZCLHlDQUF5QztBQUV6QyxtQ0FBZ0M7QUFFaEMsbURBQXlDO0FBQ3pDLHlDQUF5QztBQWtFekMsTUFBZSxPQUFRLFNBQVEsZUFBUTtJQWdDckMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUF1QixFQUFFO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBUjFCOzs7O1dBSUc7UUFDYyxZQUFPLEdBQVksRUFBRSxDQUFDO1FBS3JDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUseUJBQXlCLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzdGO0lBRUQ7O09BRUc7SUFDSSxRQUFRLENBQUMsU0FBaUI7UUFDL0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFeEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxhQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV6QixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksbUJBQW1CLENBQUMsU0FBOEIsRUFBRSxTQUFTLEdBQUcsSUFBSTtRQUN6RSxNQUFNLEtBQUssR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLElBQUks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QyxlQUFlLENBQUM7WUFDL0MsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1lBQ2hCLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQztZQUNsQixVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQzdDLENBQUMsQ0FBQyxDQUFDO0tBQ0w7SUFFRDs7Ozs7Ozs7T0FRRztJQUNLLG9CQUFvQjtRQUMxQiwyRUFBMkU7UUFDM0UsaUhBQWlIO1FBQ2pILE1BQU0sT0FBTyxHQUFHO1lBQ2QsYUFBYTtZQUNiLGVBQWU7WUFDZixhQUFhO1lBQ2IsV0FBVztZQUNYLFVBQVU7WUFDVixhQUFhO1lBQ2IsYUFBYTtZQUNiLGNBQWM7WUFDZCxVQUFVO1lBQ1YsYUFBYTtZQUNiLHlCQUF5QjtZQUN6Qix1QkFBdUI7WUFDdkIscUJBQXFCO1lBQ3JCLGlCQUFpQjtZQUNqQixtQkFBbUI7U0FDcEIsQ0FBQztRQUVGLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDL0MsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1lBQ2hCLE9BQU87WUFDUCxVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQzdDLENBQUMsQ0FBQyxDQUFDO0tBQ0w7Ozs7QUE1U1Usa0JBQUciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0IHtcbiAgQXJuLFxuICBBcm5Gb3JtYXQsXG4gIENvbnRleHRQcm92aWRlcixcbiAgRHVyYXRpb24sXG4gIEZlYXR1cmVGbGFncyxcbiAgSVJlc291cmNlLFxuICBMYXp5LFxuICBSZW1vdmFsUG9saWN5LFxuICBSZXNvdXJjZSxcbiAgUmVzb3VyY2VQcm9wcyxcbiAgU3RhY2ssXG4gIFRva2VuLFxufSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFsaWFzIH0gZnJvbSAnLi9hbGlhcyc7XG5pbXBvcnQgeyBLZXlMb29rdXBPcHRpb25zIH0gZnJvbSAnLi9rZXktbG9va3VwJztcbmltcG9ydCB7IENmbktleSB9IGZyb20gJy4va21zLmdlbmVyYXRlZCc7XG5pbXBvcnQgKiBhcyBwZXJtcyBmcm9tICcuL3ByaXZhdGUvcGVybXMnO1xuXG4vKipcbiAqIEEgS01TIEtleSwgZWl0aGVyIG1hbmFnZWQgYnkgdGhpcyBDREsgYXBwLCBvciBpbXBvcnRlZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJS2V5IGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIGtleS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkga2V5QXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUga2V5XG4gICAqICh0aGUgcGFydCB0aGF0IGxvb2tzIHNvbWV0aGluZyBsaWtlOiAxMjM0YWJjZC0xMmFiLTM0Y2QtNTZlZi0xMjM0NTY3ODkwYWIpLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBrZXlJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgbmV3IGFsaWFzIGZvciB0aGUga2V5LlxuICAgKi9cbiAgYWRkQWxpYXMoYWxpYXM6IHN0cmluZyk6IEFsaWFzO1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgc3RhdGVtZW50IHRvIHRoZSBLTVMga2V5IHJlc291cmNlIHBvbGljeS5cbiAgICogQHBhcmFtIHN0YXRlbWVudCBUaGUgcG9saWN5IHN0YXRlbWVudCB0byBhZGRcbiAgICogQHBhcmFtIGFsbG93Tm9PcCBJZiB0aGlzIGlzIHNldCB0byBgZmFsc2VgIGFuZCB0aGVyZSBpcyBubyBwb2xpY3lcbiAgICogZGVmaW5lZCAoaS5lLiBleHRlcm5hbCBrZXkpLCB0aGUgb3BlcmF0aW9uIHdpbGwgZmFpbC4gT3RoZXJ3aXNlLCBpdCB3aWxsXG4gICAqIG5vLW9wLlxuICAgKi9cbiAgYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQsIGFsbG93Tm9PcD86IGJvb2xlYW4pOiBpYW0uQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdDtcblxuICAvKipcbiAgICogR3JhbnQgdGhlIGluZGljYXRlZCBwZXJtaXNzaW9ucyBvbiB0aGlzIGtleSB0byB0aGUgZ2l2ZW4gcHJpbmNpcGFsXG4gICAqL1xuICBncmFudChncmFudGVlOiBpYW0uSUdyYW50YWJsZSwgLi4uYWN0aW9uczogc3RyaW5nW10pOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50IGRlY3J5cHRpb24gcGVybWlzc2lvbnMgdXNpbmcgdGhpcyBrZXkgdG8gdGhlIGdpdmVuIHByaW5jaXBhbFxuICAgKi9cbiAgZ3JhbnREZWNyeXB0KGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBHcmFudCBlbmNyeXB0aW9uIHBlcm1pc3Npb25zIHVzaW5nIHRoaXMga2V5IHRvIHRoZSBnaXZlbiBwcmluY2lwYWxcbiAgICovXG4gIGdyYW50RW5jcnlwdChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnQgZW5jcnlwdGlvbiBhbmQgZGVjcnlwdGlvbiBwZXJtaXNzaW9ucyB1c2luZyB0aGlzIGtleSB0byB0aGUgZ2l2ZW4gcHJpbmNpcGFsXG4gICAqL1xuICBncmFudEVuY3J5cHREZWNyeXB0KGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBHcmFudCBwZXJtaXNzaW9ucyB0byBnZW5lcmF0aW5nIE1BQ3MgdG8gdGhlIGdpdmVuIHByaW5jaXBhbFxuICAgKi9cbiAgZ3JhbnRHZW5lcmF0ZU1hYyhncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudFxuXG4gIC8qKlxuICAgKiBHcmFudCBwZXJtaXNzaW9ucyB0byB2ZXJpZnlpbmcgTUFDcyB0byB0aGUgZ2l2ZW4gcHJpbmNpcGFsXG4gICAqL1xuICBncmFudFZlcmlmeU1hYyhncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudFxufVxuXG5hYnN0cmFjdCBjbGFzcyBLZXlCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJS2V5IHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIGtleS5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBrZXlBcm46IHN0cmluZztcblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkga2V5SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogT3B0aW9uYWwgcG9saWN5IGRvY3VtZW50IHRoYXQgcmVwcmVzZW50cyB0aGUgcmVzb3VyY2UgcG9saWN5IG9mIHRoaXMga2V5LlxuICAgKlxuICAgKiBJZiBzcGVjaWZpZWQsIGFkZFRvUmVzb3VyY2VQb2xpY3kgY2FuIGJlIHVzZWQgdG8gZWRpdCB0aGlzIHBvbGljeS5cbiAgICogT3RoZXJ3aXNlIHRoaXMgbWV0aG9kIHdpbGwgbm8tb3AuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgcG9saWN5PzogaWFtLlBvbGljeURvY3VtZW50O1xuXG4gIC8qKlxuICAgKiBPcHRpb25hbCBwcm9wZXJ0eSB0byBjb250cm9sIHRydXN0aW5nIGFjY291bnQgaWRlbnRpdGllcy5cbiAgICpcbiAgICogSWYgc3BlY2lmaWVkLCBncmFudHMgd2lsbCBkZWZhdWx0IGlkZW50aXR5IHBvbGljaWVzIGluc3RlYWQgb2YgdG8gYm90aFxuICAgKiByZXNvdXJjZSBhbmQgaWRlbnRpdHkgcG9saWNpZXMuIFRoaXMgbWF0Y2hlcyB0aGUgZGVmYXVsdCBiZWhhdmlvciB3aGVuIGNyZWF0aW5nXG4gICAqIEtNUyBrZXlzIHZpYSB0aGUgQVBJIG9yIGNvbnNvbGUuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgdHJ1c3RBY2NvdW50SWRlbnRpdGllczogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ29sbGVjdGlvbiBvZiBhbGlhc2VzIGFkZGVkIHRvIHRoZSBrZXlcbiAgICpcbiAgICogVHJhY2tlZCB0byBkZXRlcm1pbmUgd2hldGhlciBvciBub3QgdGhlIGFsaWFzTmFtZSBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIGVuZCBvZiBpdHMgSURcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgYWxpYXNlczogQWxpYXNbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBSZXNvdXJjZVByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMucG9saWN5Py52YWxpZGF0ZUZvclJlc291cmNlUG9saWN5KCkgPz8gW10gfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhIG5ldyBhbGlhcyBmb3IgdGhlIGtleS5cbiAgICovXG4gIHB1YmxpYyBhZGRBbGlhcyhhbGlhc05hbWU6IHN0cmluZyk6IEFsaWFzIHtcbiAgICBjb25zdCBhbGlhc0lkID0gdGhpcy5hbGlhc2VzLmxlbmd0aCA+IDAgPyBgQWxpYXMke2FsaWFzTmFtZX1gIDogJ0FsaWFzJztcblxuICAgIGNvbnN0IGFsaWFzID0gbmV3IEFsaWFzKHRoaXMsIGFsaWFzSWQsIHsgYWxpYXNOYW1lLCB0YXJnZXRLZXk6IHRoaXMgfSk7XG4gICAgdGhpcy5hbGlhc2VzLnB1c2goYWxpYXMpO1xuXG4gICAgcmV0dXJuIGFsaWFzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzdGF0ZW1lbnQgdG8gdGhlIEtNUyBrZXkgcmVzb3VyY2UgcG9saWN5LlxuICAgKiBAcGFyYW0gc3RhdGVtZW50IFRoZSBwb2xpY3kgc3RhdGVtZW50IHRvIGFkZFxuICAgKiBAcGFyYW0gYWxsb3dOb09wIElmIHRoaXMgaXMgc2V0IHRvIGBmYWxzZWAgYW5kIHRoZXJlIGlzIG5vIHBvbGljeVxuICAgKiBkZWZpbmVkIChpLmUuIGV4dGVybmFsIGtleSksIHRoZSBvcGVyYXRpb24gd2lsbCBmYWlsLiBPdGhlcndpc2UsIGl0IHdpbGxcbiAgICogbm8tb3AuXG4gICAqL1xuICBwdWJsaWMgYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQsIGFsbG93Tm9PcCA9IHRydWUpOiBpYW0uQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdCB7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZih0aGlzKTtcblxuICAgIGlmICghdGhpcy5wb2xpY3kpIHtcbiAgICAgIGlmIChhbGxvd05vT3ApIHsgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IGZhbHNlIH07IH1cbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGFkZCBzdGF0ZW1lbnQgdG8gSUFNIHJlc291cmNlIHBvbGljeSBmb3IgS01TIGtleTogJHtKU09OLnN0cmluZ2lmeShzdGFjay5yZXNvbHZlKHRoaXMua2V5QXJuKSl9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5wb2xpY3kuYWRkU3RhdGVtZW50cyhzdGF0ZW1lbnQpO1xuICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiB0cnVlLCBwb2xpY3lEZXBlbmRhYmxlOiB0aGlzLnBvbGljeSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBpbmRpY2F0ZWQgcGVybWlzc2lvbnMgb24gdGhpcyBrZXkgdG8gdGhlIGdpdmVuIHByaW5jaXBhbFxuICAgKlxuICAgKiBUaGlzIG1vZGlmaWVzIGJvdGggdGhlIHByaW5jaXBhbCdzIHBvbGljeSBhcyB3ZWxsIGFzIHRoZSByZXNvdXJjZSBwb2xpY3ksXG4gICAqIHNpbmNlIHRoZSBkZWZhdWx0IENsb3VkRm9ybWF0aW9uIHNldHVwIGZvciBLTVMga2V5cyBpcyB0aGF0IHRoZSBwb2xpY3lcbiAgICogbXVzdCBub3QgYmUgZW1wdHkgYW5kIHNvIGRlZmF1bHQgZ3JhbnRzIHdvbid0IHdvcmsuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKTogaWFtLkdyYW50IHtcbiAgICAvLyBLTVMgdmVyaWZpZXMgd2hldGhlciB0aGUgcHJpbmNpcGFscyBpbmNsdWRlZCBpbiBpdHMga2V5IHBvbGljeSBhY3R1YWxseSBleGlzdC5cbiAgICAvLyBUaGlzIGlzIGEgcHJvYmxlbSBpZiB0aGUgc3RhY2sgdGhlIGdyYW50ZWUgaXMgcGFydCBvZiBkZXBlbmRzIG9uIHRoZSBrZXkgc3RhY2tcbiAgICAvLyAoYXMgaXQgd29uJ3QgZXhpc3QgYmVmb3JlIHRoZSBrZXkgcG9saWN5IGlzIGF0dGVtcHRlZCB0byBiZSBjcmVhdGVkKS5cbiAgICAvLyBJbiB0aGF0IGNhc2UsIG1ha2UgdGhlIGFjY291bnQgdGhlIHJlc291cmNlIHBvbGljeSBwcmluY2lwYWxcbiAgICBjb25zdCBncmFudGVlU3RhY2tEZXBlbmRzT25LZXlTdGFjayA9IHRoaXMuZ3JhbnRlZVN0YWNrRGVwZW5kc09uS2V5U3RhY2soZ3JhbnRlZSk7XG4gICAgY29uc3QgcHJpbmNpcGFsID0gZ3JhbnRlZVN0YWNrRGVwZW5kc09uS2V5U3RhY2tcbiAgICAgID8gbmV3IGlhbS5BY2NvdW50UHJpbmNpcGFsKGdyYW50ZWVTdGFja0RlcGVuZHNPbktleVN0YWNrKVxuICAgICAgOiBncmFudGVlLmdyYW50UHJpbmNpcGFsO1xuXG4gICAgY29uc3QgY3Jvc3NBY2NvdW50QWNjZXNzID0gdGhpcy5pc0dyYW50ZWVGcm9tQW5vdGhlckFjY291bnQoZ3JhbnRlZSk7XG4gICAgY29uc3QgY3Jvc3NSZWdpb25BY2Nlc3MgPSB0aGlzLmlzR3JhbnRlZUZyb21Bbm90aGVyUmVnaW9uKGdyYW50ZWUpO1xuICAgIGNvbnN0IGNyb3NzRW52aXJvbm1lbnQgPSBjcm9zc0FjY291bnRBY2Nlc3MgfHwgY3Jvc3NSZWdpb25BY2Nlc3M7XG4gICAgY29uc3QgZ3JhbnRPcHRpb25zOiBpYW0uR3JhbnRXaXRoUmVzb3VyY2VPcHRpb25zID0ge1xuICAgICAgZ3JhbnRlZSxcbiAgICAgIGFjdGlvbnMsXG4gICAgICByZXNvdXJjZTogdGhpcyxcbiAgICAgIHJlc291cmNlQXJuczogW3RoaXMua2V5QXJuXSxcbiAgICAgIHJlc291cmNlU2VsZkFybnM6IGNyb3NzRW52aXJvbm1lbnQgPyB1bmRlZmluZWQgOiBbJyonXSxcbiAgICB9O1xuICAgIGlmICh0aGlzLnRydXN0QWNjb3VudElkZW50aXRpZXMgJiYgIWNyb3NzRW52aXJvbm1lbnQpIHtcbiAgICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWxPclJlc291cmNlKGdyYW50T3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWxBbmRSZXNvdXJjZSh7XG4gICAgICAgIC4uLmdyYW50T3B0aW9ucyxcbiAgICAgICAgLy8gaWYgdGhlIGtleSBpcyB1c2VkIGluIGEgY3Jvc3MtZW52aXJvbm1lbnQgbWF0dGVyLFxuICAgICAgICAvLyB3ZSBjYW4ndCBhY2Nlc3MgdGhlIEtleSBBUk4gKHRoZXkgZG9uJ3QgaGF2ZSBwaHlzaWNhbCBuYW1lcyksXG4gICAgICAgIC8vIHNvIGZhbGwgYmFjayB0byB1c2luZyAnKicuIFRvRG8gd2UgbmVlZCB0byBtYWtlIHRoaXMgYmV0dGVyLi4uIHNvbWVob3dcbiAgICAgICAgcmVzb3VyY2VBcm5zOiBjcm9zc0Vudmlyb25tZW50ID8gWycqJ10gOiBbdGhpcy5rZXlBcm5dLFxuICAgICAgICByZXNvdXJjZVBvbGljeVByaW5jaXBhbDogcHJpbmNpcGFsLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IGRlY3J5cHRpb24gcGVybWlzc2lvbnMgdXNpbmcgdGhpcyBrZXkgdG8gdGhlIGdpdmVuIHByaW5jaXBhbFxuICAgKi9cbiAgcHVibGljIGdyYW50RGVjcnlwdChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbnQoZ3JhbnRlZSwgLi4ucGVybXMuREVDUllQVF9BQ1RJT05TKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCBlbmNyeXB0aW9uIHBlcm1pc3Npb25zIHVzaW5nIHRoaXMga2V5IHRvIHRoZSBnaXZlbiBwcmluY2lwYWxcbiAgICovXG4gIHB1YmxpYyBncmFudEVuY3J5cHQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiB0aGlzLmdyYW50KGdyYW50ZWUsIC4uLnBlcm1zLkVOQ1JZUFRfQUNUSU9OUyk7XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgZW5jcnlwdGlvbiBhbmQgZGVjcnlwdGlvbiBwZXJtaXNzaW9ucyB1c2luZyB0aGlzIGtleSB0byB0aGUgZ2l2ZW4gcHJpbmNpcGFsXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRFbmNyeXB0RGVjcnlwdChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbnQoZ3JhbnRlZSwgLi4uWy4uLnBlcm1zLkRFQ1JZUFRfQUNUSU9OUywgLi4ucGVybXMuRU5DUllQVF9BQ1RJT05TXSk7XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgcGVybWlzc2lvbnMgdG8gZ2VuZXJhdGluZyBNQUNzIHRvIHRoZSBnaXZlbiBwcmluY2lwYWxcbiAgICovXG4gIHB1YmxpYyBncmFudEdlbmVyYXRlTWFjKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHtcbiAgICByZXR1cm4gdGhpcy5ncmFudChncmFudGVlLCAuLi5wZXJtcy5HRU5FUkFURV9ITUFDX0FDVElPTlMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHBlcm1pc3Npb25zIHRvIHZlcmlmeWluZyBNQUNzIHRvIHRoZSBnaXZlbiBwcmluY2lwYWxcbiAgICovXG4gIHB1YmxpYyBncmFudFZlcmlmeU1hYyhncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbnQoZ3JhbnRlZSwgLi4ucGVybXMuVkVSSUZZX0hNQUNfQUNUSU9OUyk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGdyYW50ZWUgYmVsb25ncyB0byBhIHN0YWNrIHRoYXQgd2lsbCBiZSBkZXBsb3llZFxuICAgKiBhZnRlciB0aGUgc3RhY2sgY29udGFpbmluZyB0aGlzIGtleS5cbiAgICpcbiAgICogQHBhcmFtIGdyYW50ZWUgdGhlIGdyYW50ZWUgdG8gZ2l2ZSBwZXJtaXNzaW9ucyB0b1xuICAgKiBAcmV0dXJucyB0aGUgYWNjb3VudCBJRCBvZiB0aGUgZ3JhbnRlZSBzdGFjayBpZiBpdHMgc3RhY2sgZG9lcyBkZXBlbmQgb24gdGhpcyBzdGFjayxcbiAgICogICB1bmRlZmluZWQgb3RoZXJ3aXNlXG4gICAqL1xuICBwcml2YXRlIGdyYW50ZWVTdGFja0RlcGVuZHNPbktleVN0YWNrKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBncmFudFByaW5jaXBhbCA9IGdyYW50ZWUuZ3JhbnRQcmluY2lwYWw7XG4gICAgLy8gdGhpcyBsb2dpYyBzaG91bGQgb25seSBhcHBseSB0byBuZXdseSBjcmVhdGVkXG4gICAgLy8gKD0gbm90IGltcG9ydGVkKSByZXNvdXJjZXNcbiAgICBpZiAoIWlhbS5wcmluY2lwYWxJc093bmVkUmVzb3VyY2UoZ3JhbnRQcmluY2lwYWwpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBrZXlTdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuICAgIGNvbnN0IGdyYW50ZWVTdGFjayA9IFN0YWNrLm9mKGdyYW50UHJpbmNpcGFsKTtcbiAgICBpZiAoa2V5U3RhY2sgPT09IGdyYW50ZWVTdGFjaykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gZ3JhbnRlZVN0YWNrLmRlcGVuZGVuY2llcy5pbmNsdWRlcyhrZXlTdGFjaylcbiAgICAgID8gZ3JhbnRlZVN0YWNrLmFjY291bnRcbiAgICAgIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0dyYW50ZWVGcm9tQW5vdGhlclJlZ2lvbihncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGJvb2xlYW4ge1xuICAgIGlmICghaWFtLnByaW5jaXBhbElzT3duZWRSZXNvdXJjZShncmFudGVlLmdyYW50UHJpbmNpcGFsKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBidWNrZXRTdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuICAgIGNvbnN0IGlkZW50aXR5U3RhY2sgPSBTdGFjay5vZihncmFudGVlLmdyYW50UHJpbmNpcGFsKTtcbiAgICByZXR1cm4gYnVja2V0U3RhY2sucmVnaW9uICE9PSBpZGVudGl0eVN0YWNrLnJlZ2lvbjtcbiAgfVxuXG4gIHByaXZhdGUgaXNHcmFudGVlRnJvbUFub3RoZXJBY2NvdW50KGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogYm9vbGVhbiB7XG4gICAgaWYgKCFpYW0ucHJpbmNpcGFsSXNPd25lZFJlc291cmNlKGdyYW50ZWUuZ3JhbnRQcmluY2lwYWwpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGJ1Y2tldFN0YWNrID0gU3RhY2sub2YodGhpcyk7XG4gICAgY29uc3QgaWRlbnRpdHlTdGFjayA9IFN0YWNrLm9mKGdyYW50ZWUuZ3JhbnRQcmluY2lwYWwpO1xuICAgIHJldHVybiBidWNrZXRTdGFjay5hY2NvdW50ICE9PSBpZGVudGl0eVN0YWNrLmFjY291bnQ7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUga2V5IHNwZWMsIHJlcHJlc2VudHMgdGhlIGNyeXB0b2dyYXBoaWMgY29uZmlndXJhdGlvbiBvZiBrZXlzLlxuICovXG5leHBvcnQgZW51bSBLZXlTcGVjIHtcbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IGtleSBzcGVjLlxuICAgKlxuICAgKiBWYWxpZCB1c2FnZTogRU5DUllQVF9ERUNSWVBUXG4gICAqL1xuICBTWU1NRVRSSUNfREVGQVVMVCA9ICdTWU1NRVRSSUNfREVGQVVMVCcsXG5cbiAgLyoqXG4gICAqIFJTQSB3aXRoIDIwNDggYml0cyBvZiBrZXkuXG4gICAqXG4gICAqIFZhbGlkIHVzYWdlOiBFTkNSWVBUX0RFQ1JZUFQgYW5kIFNJR05fVkVSSUZZXG4gICAqL1xuICBSU0FfMjA0OCA9ICdSU0FfMjA0OCcsXG5cbiAgLyoqXG4gICAqIFJTQSB3aXRoIDMwNzIgYml0cyBvZiBrZXkuXG4gICAqXG4gICAqIFZhbGlkIHVzYWdlOiBFTkNSWVBUX0RFQ1JZUFQgYW5kIFNJR05fVkVSSUZZXG4gICAqL1xuICBSU0FfMzA3MiA9ICdSU0FfMzA3MicsXG5cbiAgLyoqXG4gICAqIFJTQSB3aXRoIDQwOTYgYml0cyBvZiBrZXkuXG4gICAqXG4gICAqIFZhbGlkIHVzYWdlOiBFTkNSWVBUX0RFQ1JZUFQgYW5kIFNJR05fVkVSSUZZXG4gICAqL1xuICBSU0FfNDA5NiA9ICdSU0FfNDA5NicsXG5cbiAgLyoqXG4gICAqIE5JU1QgRklQUyAxODYtNCwgU2VjdGlvbiA2LjQsIEVDRFNBIHNpZ25hdHVyZSB1c2luZyB0aGUgY3VydmUgc3BlY2lmaWVkIGJ5IHRoZSBrZXkgYW5kXG4gICAqIFNIQS0yNTYgZm9yIHRoZSBtZXNzYWdlIGRpZ2VzdC5cbiAgICpcbiAgICogVmFsaWQgdXNhZ2U6IFNJR05fVkVSSUZZXG4gICAqL1xuICBFQ0NfTklTVF9QMjU2ID0gJ0VDQ19OSVNUX1AyNTYnLFxuXG4gIC8qKlxuICAgKiBOSVNUIEZJUFMgMTg2LTQsIFNlY3Rpb24gNi40LCBFQ0RTQSBzaWduYXR1cmUgdXNpbmcgdGhlIGN1cnZlIHNwZWNpZmllZCBieSB0aGUga2V5IGFuZFxuICAgKiBTSEEtMzg0IGZvciB0aGUgbWVzc2FnZSBkaWdlc3QuXG4gICAqXG4gICAqIFZhbGlkIHVzYWdlOiBTSUdOX1ZFUklGWVxuICAgKi9cbiAgRUNDX05JU1RfUDM4NCA9ICdFQ0NfTklTVF9QMzg0JyxcblxuICAvKipcbiAgICogTklTVCBGSVBTIDE4Ni00LCBTZWN0aW9uIDYuNCwgRUNEU0Egc2lnbmF0dXJlIHVzaW5nIHRoZSBjdXJ2ZSBzcGVjaWZpZWQgYnkgdGhlIGtleSBhbmRcbiAgICogU0hBLTUxMiBmb3IgdGhlIG1lc3NhZ2UgZGlnZXN0LlxuICAgKlxuICAgKiBWYWxpZCB1c2FnZTogU0lHTl9WRVJJRllcbiAgICovXG4gIEVDQ19OSVNUX1A1MjEgPSAnRUNDX05JU1RfUDUyMScsXG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkcyBmb3IgRWZmaWNpZW50IENyeXB0b2dyYXBoeSAyLCBTZWN0aW9uIDIuNC4xLCBFQ0RTQSBzaWduYXR1cmUgb24gdGhlIEtvYmxpdHogY3VydmUuXG4gICAqXG4gICAqIFZhbGlkIHVzYWdlOiBTSUdOX1ZFUklGWVxuICAgKi9cbiAgRUNDX1NFQ0dfUDI1NksxID0gJ0VDQ19TRUNHX1AyNTZLMScsXG5cbiAgLyoqXG4gICAqIEhhc2gtQmFzZWQgTWVzc2FnZSBBdXRoZW50aWNhdGlvbiBDb2RlIGFzIGRlZmluZWQgaW4gUkZDIDIxMDQgdXNpbmcgdGhlIG1lc3NhZ2UgZGlnZXN0IGZ1bmN0aW9uIFNIQTIyNC5cbiAgICpcbiAgICogVmFsaWQgdXNhZ2U6IEdFTkVSQVRFX1ZFUklGWV9NQUNcbiAgICovXG4gIEhNQUNfMjI0ID0gJ0hNQUNfMjI0JyxcblxuICAvKipcbiAgICogSGFzaC1CYXNlZCBNZXNzYWdlIEF1dGhlbnRpY2F0aW9uIENvZGUgYXMgZGVmaW5lZCBpbiBSRkMgMjEwNCB1c2luZyB0aGUgbWVzc2FnZSBkaWdlc3QgZnVuY3Rpb24gU0hBMjU2LlxuICAgKlxuICAgKiBWYWxpZCB1c2FnZTogR0VORVJBVEVfVkVSSUZZX01BQ1xuICAgKi9cbiAgSE1BQ18yNTYgPSAnSE1BQ18yNTYnLFxuXG4gIC8qKlxuICAgKiBIYXNoLUJhc2VkIE1lc3NhZ2UgQXV0aGVudGljYXRpb24gQ29kZSBhcyBkZWZpbmVkIGluIFJGQyAyMTA0IHVzaW5nIHRoZSBtZXNzYWdlIGRpZ2VzdCBmdW5jdGlvbiBTSEEzODQuXG4gICAqXG4gICAqIFZhbGlkIHVzYWdlOiBHRU5FUkFURV9WRVJJRllfTUFDXG4gICAqL1xuICBITUFDXzM4NCA9ICdITUFDXzM4NCcsXG5cbiAgLyoqXG4gICAqIEhhc2gtQmFzZWQgTWVzc2FnZSBBdXRoZW50aWNhdGlvbiBDb2RlIGFzIGRlZmluZWQgaW4gUkZDIDIxMDQgdXNpbmcgdGhlIG1lc3NhZ2UgZGlnZXN0IGZ1bmN0aW9uIFNIQTUxMi5cbiAgICpcbiAgICogVmFsaWQgdXNhZ2U6IEdFTkVSQVRFX1ZFUklGWV9NQUNcbiAgICovXG4gIEhNQUNfNTEyID0gJ0hNQUNfNTEyJyxcblxuICAvKipcbiAgICogRWxsaXB0aWMgY3VydmUga2V5IHNwZWMgYXZhaWxhYmxlIG9ubHkgaW4gQ2hpbmEgUmVnaW9ucy5cbiAgICpcbiAgICogVmFsaWQgdXNhZ2U6IEVOQ1JZUFRfREVDUllQVCBhbmQgU0lHTl9WRVJJRllcbiAgICovXG4gIFNNMiA9ICdTTTInLFxufVxuXG4vKipcbiAqIFRoZSBrZXkgdXNhZ2UsIHJlcHJlc2VudHMgdGhlIGNyeXB0b2dyYXBoaWMgb3BlcmF0aW9ucyBvZiBrZXlzLlxuICovXG5leHBvcnQgZW51bSBLZXlVc2FnZSB7XG4gIC8qKlxuICAgKiBFbmNyeXB0aW9uIGFuZCBkZWNyeXB0aW9uLlxuICAgKi9cbiAgRU5DUllQVF9ERUNSWVBUID0gJ0VOQ1JZUFRfREVDUllQVCcsXG5cbiAgLyoqXG4gICAqIFNpZ25pbmcgYW5kIHZlcmlmaWNhdGlvblxuICAgKi9cbiAgU0lHTl9WRVJJRlkgPSAnU0lHTl9WRVJJRlknLFxuXG4gIC8qKlxuICAgKiBHZW5lcmF0aW5nIGFuZCB2ZXJpZnlpbmcgTUFDc1xuICAgKi9cbiAgR0VORVJBVEVfVkVSSUZZX01BQyA9ICdHRU5FUkFURV9WRVJJRllfTUFDJyxcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYSBLTVMgS2V5IG9iamVjdFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEtleVByb3BzIHtcbiAgLyoqXG4gICAqIEEgZGVzY3JpcHRpb24gb2YgdGhlIGtleS4gVXNlIGEgZGVzY3JpcHRpb24gdGhhdCBoZWxwcyB5b3VyIHVzZXJzIGRlY2lkZVxuICAgKiB3aGV0aGVyIHRoZSBrZXkgaXMgYXBwcm9wcmlhdGUgZm9yIGEgcGFydGljdWxhciB0YXNrLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEluaXRpYWwgYWxpYXMgdG8gYWRkIHRvIHRoZSBrZXlcbiAgICpcbiAgICogTW9yZSBhbGlhc2VzIGNhbiBiZSBhZGRlZCBsYXRlciBieSBjYWxsaW5nIGBhZGRBbGlhc2AuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYWxpYXMgaXMgYWRkZWQgZm9yIHRoZSBrZXkuXG4gICAqL1xuICByZWFkb25seSBhbGlhcz86IHN0cmluZztcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgQVdTIEtNUyByb3RhdGVzIHRoZSBrZXkuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBlbmFibGVLZXlSb3RhdGlvbj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBrZXkgaXMgYXZhaWxhYmxlIGZvciB1c2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gS2V5IGlzIGVuYWJsZWQuXG4gICAqL1xuICByZWFkb25seSBlbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGNyeXB0b2dyYXBoaWMgY29uZmlndXJhdGlvbiBvZiB0aGUga2V5LiBUaGUgdmFsaWQgdmFsdWUgZGVwZW5kcyBvbiB1c2FnZSBvZiB0aGUga2V5LlxuICAgKlxuICAgKiBJTVBPUlRBTlQ6IElmIHlvdSBjaGFuZ2UgdGhpcyBwcm9wZXJ0eSBvZiBhbiBleGlzdGluZyBrZXksIHRoZSBleGlzdGluZyBrZXkgaXMgc2NoZWR1bGVkIGZvciBkZWxldGlvblxuICAgKiBhbmQgYSBuZXcga2V5IGlzIGNyZWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIHZhbHVlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBLZXlTcGVjLlNZTU1FVFJJQ19ERUZBVUxUXG4gICAqL1xuICByZWFkb25seSBrZXlTcGVjPzogS2V5U3BlYztcblxuICAvKipcbiAgICogVGhlIGNyeXB0b2dyYXBoaWMgb3BlcmF0aW9ucyBmb3Igd2hpY2ggdGhlIGtleSBjYW4gYmUgdXNlZC5cbiAgICpcbiAgICogSU1QT1JUQU5UOiBJZiB5b3UgY2hhbmdlIHRoaXMgcHJvcGVydHkgb2YgYW4gZXhpc3Rpbmcga2V5LCB0aGUgZXhpc3Rpbmcga2V5IGlzIHNjaGVkdWxlZCBmb3IgZGVsZXRpb25cbiAgICogYW5kIGEgbmV3IGtleSBpcyBjcmVhdGVkIHdpdGggdGhlIHNwZWNpZmllZCB2YWx1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgS2V5VXNhZ2UuRU5DUllQVF9ERUNSWVBUXG4gICAqL1xuICByZWFkb25seSBrZXlVc2FnZT86IEtleVVzYWdlO1xuXG4gIC8qKlxuICAgKiBDdXN0b20gcG9saWN5IGRvY3VtZW50IHRvIGF0dGFjaCB0byB0aGUgS01TIGtleS5cbiAgICpcbiAgICogTk9URSAtIElmIHRoZSBgQGF3cy1jZGsvYXdzLWttczpkZWZhdWx0S2V5UG9saWNpZXNgIGZlYXR1cmUgZmxhZyBpcyBzZXQgKHRoZSBkZWZhdWx0IGZvciBuZXcgcHJvamVjdHMpLFxuICAgKiB0aGlzIHBvbGljeSB3aWxsICpvdmVycmlkZSogdGhlIGRlZmF1bHQga2V5IHBvbGljeSBhbmQgYmVjb21lIHRoZSBvbmx5IGtleSBwb2xpY3kgZm9yIHRoZSBrZXkuIElmIHRoZVxuICAgKiBmZWF0dXJlIGZsYWcgaXMgbm90IHNldCwgdGhpcyBwb2xpY3kgd2lsbCBiZSBhcHBlbmRlZCB0byB0aGUgZGVmYXVsdCBrZXkgcG9saWN5LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgcG9saWN5IGRvY3VtZW50IHdpdGggcGVybWlzc2lvbnMgZm9yIHRoZSBhY2NvdW50IHJvb3QgdG9cbiAgICogYWRtaW5pc3RlciB0aGUga2V5IHdpbGwgYmUgY3JlYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IHBvbGljeT86IGlhbS5Qb2xpY3lEb2N1bWVudDtcblxuICAvKipcbiAgICogQSBsaXN0IG9mIHByaW5jaXBhbHMgdG8gYWRkIGFzIGtleSBhZG1pbmlzdHJhdG9ycyB0byB0aGUga2V5IHBvbGljeS5cbiAgICpcbiAgICogS2V5IGFkbWluaXN0cmF0b3JzIGhhdmUgcGVybWlzc2lvbnMgdG8gbWFuYWdlIHRoZSBrZXkgKGUuZy4sIGNoYW5nZSBwZXJtaXNzaW9ucywgcmV2b2tlKSwgYnV0IGRvIG5vdCBoYXZlIHBlcm1pc3Npb25zXG4gICAqIHRvIHVzZSB0aGUga2V5IGluIGNyeXB0b2dyYXBoaWMgb3BlcmF0aW9ucyAoZS5nLiwgZW5jcnlwdCwgZGVjcnlwdCkuXG4gICAqXG4gICAqIFRoZXNlIHByaW5jaXBhbHMgd2lsbCBiZSBhZGRlZCB0byB0aGUgZGVmYXVsdCBrZXkgcG9saWN5IChpZiBub25lIHNwZWNpZmllZCksIG9yIHRvIHRoZSBzcGVjaWZpZWQgcG9saWN5IChpZiBwcm92aWRlZCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IFtdXG4gICAqL1xuICByZWFkb25seSBhZG1pbnM/OiBpYW0uSVByaW5jaXBhbFtdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBlbmNyeXB0aW9uIGtleSBzaG91bGQgYmUgcmV0YWluZWQgd2hlbiBpdCBpcyByZW1vdmVkIGZyb20gdGhlIFN0YWNrLiBUaGlzIGlzIHVzZWZ1bCB3aGVuIG9uZSB3YW50cyB0b1xuICAgKiByZXRhaW4gYWNjZXNzIHRvIGRhdGEgdGhhdCB3YXMgZW5jcnlwdGVkIHdpdGggYSBrZXkgdGhhdCBpcyBiZWluZyByZXRpcmVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBSZW1vdmFsUG9saWN5LlJldGFpblxuICAgKi9cbiAgcmVhZG9ubHkgcmVtb3ZhbFBvbGljeT86IFJlbW92YWxQb2xpY3k7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGtleSB1c2FnZSBjYW4gYmUgZ3JhbnRlZCBieSBJQU0gcG9saWNpZXNcbiAgICpcbiAgICogU2V0dGluZyB0aGlzIHRvIHRydWUgYWRkcyBhIGRlZmF1bHQgc3RhdGVtZW50IHdoaWNoIGRlbGVnYXRlcyBrZXlcbiAgICogYWNjZXNzIGNvbnRyb2wgY29tcGxldGVseSB0byB0aGUgaWRlbnRpdHkncyBJQU0gcG9saWN5IChzaW1pbGFyXG4gICAqIHRvIGhvdyBpdCB3b3JrcyBmb3Igb3RoZXIgQVdTIHJlc291cmNlcykuIFRoaXMgbWF0Y2hlcyB0aGUgZGVmYXVsdCBiZWhhdmlvclxuICAgKiB3aGVuIGNyZWF0aW5nIEtNUyBrZXlzIHZpYSB0aGUgQVBJIG9yIGNvbnNvbGUuXG4gICAqXG4gICAqIElmIHRoZSBgQGF3cy1jZGsvYXdzLWttczpkZWZhdWx0S2V5UG9saWNpZXNgIGZlYXR1cmUgZmxhZyBpcyBzZXQgKHRoZSBkZWZhdWx0IGZvciBuZXcgcHJvamVjdHMpLFxuICAgKiB0aGlzIGZsYWcgd2lsbCBhbHdheXMgYmUgdHJlYXRlZCBhcyAndHJ1ZScgYW5kIGRvZXMgbm90IG5lZWQgdG8gYmUgZXhwbGljaXRseSBzZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2UsIHVubGVzcyB0aGUgYEBhd3MtY2RrL2F3cy1rbXM6ZGVmYXVsdEtleVBvbGljaWVzYCBmZWF0dXJlIGZsYWcgaXMgc2V0LlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9rbXMvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2tleS1wb2xpY2llcy5odG1sI2tleS1wb2xpY3ktZGVmYXVsdC1hbGxvdy1yb290LWVuYWJsZS1pYW1cbiAgICogQGRlcHJlY2F0ZWQgcmVkdW5kYW50IHdpdGggdGhlIGBAYXdzLWNkay9hd3Mta21zOmRlZmF1bHRLZXlQb2xpY2llc2AgZmVhdHVyZSBmbGFnXG4gICAqL1xuICByZWFkb25seSB0cnVzdEFjY291bnRJZGVudGl0aWVzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSBudW1iZXIgb2YgZGF5cyBpbiB0aGUgd2FpdGluZyBwZXJpb2QgYmVmb3JlXG4gICAqIEFXUyBLTVMgZGVsZXRlcyBhIENNSyB0aGF0IGhhcyBiZWVuIHJlbW92ZWQgZnJvbSBhIENsb3VkRm9ybWF0aW9uIHN0YWNrLlxuICAgKlxuICAgKiBXaGVuIHlvdSByZW1vdmUgYSBjdXN0b21lciBtYXN0ZXIga2V5IChDTUspIGZyb20gYSBDbG91ZEZvcm1hdGlvbiBzdGFjaywgQVdTIEtNUyBzY2hlZHVsZXMgdGhlIENNSyBmb3IgZGVsZXRpb25cbiAgICogYW5kIHN0YXJ0cyB0aGUgbWFuZGF0b3J5IHdhaXRpbmcgcGVyaW9kLiBUaGUgUGVuZGluZ1dpbmRvd0luRGF5cyBwcm9wZXJ0eSBkZXRlcm1pbmVzIHRoZSBsZW5ndGggb2Ygd2FpdGluZyBwZXJpb2QuXG4gICAqIER1cmluZyB0aGUgd2FpdGluZyBwZXJpb2QsIHRoZSBrZXkgc3RhdGUgb2YgQ01LIGlzIFBlbmRpbmcgRGVsZXRpb24sIHdoaWNoIHByZXZlbnRzIHRoZSBDTUsgZnJvbSBiZWluZyB1c2VkIGluXG4gICAqIGNyeXB0b2dyYXBoaWMgb3BlcmF0aW9ucy4gV2hlbiB0aGUgd2FpdGluZyBwZXJpb2QgZXhwaXJlcywgQVdTIEtNUyBwZXJtYW5lbnRseSBkZWxldGVzIHRoZSBDTUsuXG4gICAqXG4gICAqIEVudGVyIGEgdmFsdWUgYmV0d2VlbiA3IGFuZCAzMCBkYXlzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1rbXMta2V5Lmh0bWwjY2ZuLWttcy1rZXktcGVuZGluZ3dpbmRvd2luZGF5c1xuICAgKiBAZGVmYXVsdCAtIDMwIGRheXNcbiAgICovXG4gIHJlYWRvbmx5IHBlbmRpbmdXaW5kb3c/OiBEdXJhdGlvbjtcbn1cblxuLyoqXG4gKiBEZWZpbmVzIGEgS01TIGtleS5cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpLTVM6OktleVxuICovXG5leHBvcnQgY2xhc3MgS2V5IGV4dGVuZHMgS2V5QmFzZSB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXh0ZXJuYWxseSBkZWZpbmVkIEtNUyBLZXkgdXNpbmcgaXRzIEFSTi5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlICB0aGUgY29uc3RydWN0IHRoYXQgd2lsbCBcIm93blwiIHRoZSBpbXBvcnRlZCBrZXkuXG4gICAqIEBwYXJhbSBpZCAgICAgdGhlIGlkIG9mIHRoZSBpbXBvcnRlZCBrZXkgaW4gdGhlIGNvbnN0cnVjdCB0cmVlLlxuICAgKiBAcGFyYW0ga2V5QXJuIHRoZSBBUk4gb2YgYW4gZXhpc3RpbmcgS01TIGtleS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUtleUFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBrZXlBcm46IHN0cmluZyk6IElLZXkge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIEtleUJhc2Uge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGtleUFybiA9IGtleUFybjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBrZXlJZDogc3RyaW5nO1xuICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHBvbGljeT86IGlhbS5Qb2xpY3lEb2N1bWVudCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICAgIC8vIGRlZmF1bHRpbmcgdHJ1ZTogaWYgd2UgYXJlIGltcG9ydGluZyB0aGUga2V5IHRoZSBrZXkgcG9saWN5IGlzXG4gICAgICAvLyB1bmRlZmluZWQgYW5kIGltcG9zc2libGUgdG8gY2hhbmdlIGhlcmU7IHRoaXMgbWVhbnMgdXBkYXRpbmcgaWRlbnRpdHlcbiAgICAgIC8vIHBvbGljaWVzIGlzIHJlYWxseSB0aGUgb25seSBvcHRpb25cbiAgICAgIHByb3RlY3RlZCByZWFkb25seSB0cnVzdEFjY291bnRJZGVudGl0aWVzOiBib29sZWFuID0gdHJ1ZTtcblxuICAgICAgY29uc3RydWN0b3Ioa2V5SWQ6IHN0cmluZywgcHJvcHM6IFJlc291cmNlUHJvcHMgPSB7fSkge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgICAgICB0aGlzLmtleUlkID0ga2V5SWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qga2V5UmVzb3VyY2VOYW1lID0gU3RhY2sub2Yoc2NvcGUpLnNwbGl0QXJuKGtleUFybiwgQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpLnJlc291cmNlTmFtZTtcbiAgICBpZiAoIWtleVJlc291cmNlTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBLTVMga2V5IEFSTiBtdXN0IGJlIGluIHRoZSBmb3JtYXQgJ2Fybjphd3M6a21zOjxyZWdpb24+OjxhY2NvdW50PjprZXkvPGtleUlkPicsIGdvdDogJyR7a2V5QXJufSdgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChrZXlSZXNvdXJjZU5hbWUsIHtcbiAgICAgIGVudmlyb25tZW50RnJvbUFybjoga2V5QXJuLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG11dGFibGUgYElLZXlgIGJhc2VkIG9uIGEgbG93LWxldmVsIGBDZm5LZXlgLlxuICAgKiBUaGlzIGlzIG1vc3QgdXNlZnVsIHdoZW4gY29tYmluZWQgd2l0aCB0aGUgY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAqIFRoaXMgbWV0aG9kIGlzIGRpZmZlcmVudCB0aGFuIGBmcm9tS2V5QXJuKClgIGJlY2F1c2UgdGhlIGBJS2V5YFxuICAgKiByZXR1cm5lZCBmcm9tIHRoaXMgbWV0aG9kIGlzIG11dGFibGU7XG4gICAqIG1lYW5pbmcsIGNhbGxpbmcgYW55IG11dGF0aW5nIG1ldGhvZHMgb24gaXQsXG4gICAqIGxpa2UgYElLZXkuYWRkVG9SZXNvdXJjZVBvbGljeSgpYCxcbiAgICogd2lsbCBhY3R1YWxseSBiZSByZWZsZWN0ZWQgaW4gdGhlIHJlc3VsdGluZyB0ZW1wbGF0ZSxcbiAgICogYXMgb3Bwb3NlZCB0byB0aGUgb2JqZWN0IHJldHVybmVkIGZyb20gYGZyb21LZXlBcm4oKWAsXG4gICAqIG9uIHdoaWNoIGNhbGxpbmcgdGhvc2UgbWV0aG9kcyB3b3VsZCBoYXZlIG5vIGVmZmVjdC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUNmbktleShjZm5LZXk6IENmbktleSk6IElLZXkge1xuICAgIC8vIHVzZSBhIFwid2VpcmRcIiBpZCB0aGF0IGhhcyBhIGhpZ2hlciBjaGFuY2Ugb2YgYmVpbmcgdW5pcXVlXG4gICAgY29uc3QgaWQgPSAnQEZyb21DZm5LZXknO1xuXG4gICAgLy8gaWYgZnJvbUNmbktleSgpIHdhcyBhbHJlYWR5IGNhbGxlZCBvbiB0aGlzIGNmbktleSxcbiAgICAvLyByZXR1cm4gdGhlIHNhbWUgTDJcbiAgICAvLyAoYXMgZGlmZmVyZW50IEwycyB3b3VsZCBjb25mbGljdCwgYmVjYXVzZSBvZiB0aGUgbXV0YXRpb24gb2YgdGhlIGtleVBvbGljeSBwcm9wZXJ0eSBvZiB0aGUgTDEgYmVsb3cpXG4gICAgY29uc3QgZXhpc3RpbmcgPSBjZm5LZXkubm9kZS50cnlGaW5kQ2hpbGQoaWQpO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgcmV0dXJuIDxJS2V5PmV4aXN0aW5nO1xuICAgIH1cblxuICAgIGxldCBrZXlQb2xpY3k6IGlhbS5Qb2xpY3lEb2N1bWVudDtcbiAgICB0cnkge1xuICAgICAga2V5UG9saWN5ID0gaWFtLlBvbGljeURvY3VtZW50LmZyb21Kc29uKGNmbktleS5rZXlQb2xpY3kpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gSWYgdGhlIEtleVBvbGljeSBjb250YWlucyBhbnkgQ2xvdWRGb3JtYXRpb24gZnVuY3Rpb25zLFxuICAgICAgLy8gUG9saWN5RG9jdW1lbnQuZnJvbUpzb24oKSB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICAgICAgLy8gSW4gdGhhdCBjYXNlLCBiZWNhdXNlIHdlIHdvdWxkIGhhdmUgdG8gZWZmZWN0aXZlbHkgbWFrZSB0aGUgcmV0dXJuZWQgSUtleSBpbW11dGFibGUsXG4gICAgICAvLyB0aHJvdyBhbiBleGNlcHRpb24gc3VnZ2VzdGluZyB0byB1c2UgdGhlIG90aGVyIGltcG9ydGluZyBtZXRob2RzIGluc3RlYWQuXG4gICAgICAvLyBXZSBtaWdodCBtYWtlIHRoaXMgcGFyc2luZyBsb2dpYyBzbWFydGVyIGxhdGVyLFxuICAgICAgLy8gYnV0IGxldCdzIHN0YXJ0IGJ5IGVycm9yaW5nIG91dC5cbiAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IHBhcnNlIHRoZSBQb2xpY3lEb2N1bWVudCBvZiB0aGUgcGFzc2VkIEFXUzo6S01TOjpLZXkgcmVzb3VyY2UgYmVjYXVzZSBpdCBjb250YWlucyBDbG91ZEZvcm1hdGlvbiBmdW5jdGlvbnMuICcgK1xuICAgICAgICAnVGhpcyBtYWtlcyBpdCBpbXBvc3NpYmxlIHRvIGNyZWF0ZSBhIG11dGFibGUgSUtleSBmcm9tIHRoYXQgUG9saWN5LiAnICtcbiAgICAgICAgJ1lvdSBoYXZlIHRvIHVzZSBmcm9tS2V5QXJuIGluc3RlYWQsIHBhc3NpbmcgaXQgdGhlIEFSTiBhdHRyaWJ1dGUgcHJvcGVydHkgb2YgdGhlIGxvdy1sZXZlbCBDZm5LZXknKTtcbiAgICB9XG5cbiAgICAvLyBjaGFuZ2UgdGhlIGtleSBwb2xpY3kgb2YgdGhlIEwxLCBzbyB0aGF0IGFsbCBjaGFuZ2VzIGRvbmUgaW4gdGhlIEwyIGFyZSByZWZsZWN0ZWQgaW4gdGhlIHJlc3VsdGluZyB0ZW1wbGF0ZVxuICAgIGNmbktleS5rZXlQb2xpY3kgPSBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IGtleVBvbGljeS50b0pTT04oKSB9KTtcblxuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBLZXlCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBrZXlBcm4gPSBjZm5LZXkuYXR0ckFybjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBrZXlJZCA9IGNmbktleS5yZWY7XG4gICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgcG9saWN5ID0ga2V5UG9saWN5O1xuICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRydXN0QWNjb3VudElkZW50aXRpZXMgPSBmYWxzZTtcbiAgICB9KGNmbktleSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBLZXkgYnkgcXVlcnlpbmcgdGhlIEFXUyBlbnZpcm9ubWVudCB0aGlzIHN0YWNrIGlzIGRlcGxveWVkIHRvLlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIG9ubHkgbmVlZHMgdG8gYmUgdXNlZCB0byB1c2UgS2V5cyBub3QgZGVmaW5lZCBpbiB5b3VyIENES1xuICAgKiBhcHBsaWNhdGlvbi4gSWYgeW91IGFyZSBsb29raW5nIHRvIHNoYXJlIGEgS2V5IGJldHdlZW4gc3RhY2tzLCB5b3UgY2FuXG4gICAqIHBhc3MgdGhlIGBLZXlgIG9iamVjdCBiZXR3ZWVuIHN0YWNrcyBhbmQgdXNlIGl0IGFzIG5vcm1hbC4gSW4gYWRkaXRpb24sXG4gICAqIGl0J3Mgbm90IG5lY2Vzc2FyeSB0byB1c2UgdGhpcyBtZXRob2QgaWYgYW4gaW50ZXJmYWNlIGFjY2VwdHMgYW4gYElLZXlgLlxuICAgKiBJbiB0aGlzIGNhc2UsIGBBbGlhcy5mcm9tQWxpYXNOYW1lKClgIGNhbiBiZSB1c2VkIHdoaWNoIHJldHVybnMgYW4gYWxpYXNcbiAgICogdGhhdCBleHRlbmRzIGBJS2V5YC5cbiAgICpcbiAgICogQ2FsbGluZyB0aGlzIG1ldGhvZCB3aWxsIGxlYWQgdG8gYSBsb29rdXAgd2hlbiB0aGUgQ0RLIENMSSBpcyBleGVjdXRlZC5cbiAgICogWW91IGNhbiB0aGVyZWZvcmUgbm90IHVzZSBhbnkgdmFsdWVzIHRoYXQgd2lsbCBvbmx5IGJlIGF2YWlsYWJsZSBhdFxuICAgKiBDbG91ZEZvcm1hdGlvbiBleGVjdXRpb24gdGltZSAoaS5lLiwgVG9rZW5zKS5cbiAgICpcbiAgICogVGhlIEtleSBpbmZvcm1hdGlvbiB3aWxsIGJlIGNhY2hlZCBpbiBgY2RrLmNvbnRleHQuanNvbmAgYW5kIHRoZSBzYW1lIEtleVxuICAgKiB3aWxsIGJlIHVzZWQgb24gZnV0dXJlIHJ1bnMuIFRvIHJlZnJlc2ggdGhlIGxvb2t1cCwgeW91IHdpbGwgaGF2ZSB0b1xuICAgKiBldmljdCB0aGUgdmFsdWUgZnJvbSB0aGUgY2FjaGUgdXNpbmcgdGhlIGBjZGsgY29udGV4dGAgY29tbWFuZC4gU2VlXG4gICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvbGF0ZXN0L2d1aWRlL2NvbnRleHQuaHRtbCBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUxvb2t1cChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBvcHRpb25zOiBLZXlMb29rdXBPcHRpb25zKTogSUtleSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgS2V5QmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkga2V5QXJuOiBzdHJpbmc7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkga2V5SWQ6IHN0cmluZztcbiAgICAgIHByb3RlY3RlZCByZWFkb25seSBwb2xpY3k/OiBpYW0uUG9saWN5RG9jdW1lbnQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICAvLyBkZWZhdWx0aW5nIHRydWU6IGlmIHdlIGFyZSBpbXBvcnRpbmcgdGhlIGtleSB0aGUga2V5IHBvbGljeSBpc1xuICAgICAgLy8gdW5kZWZpbmVkIGFuZCBpbXBvc3NpYmxlIHRvIGNoYW5nZSBoZXJlOyB0aGlzIG1lYW5zIHVwZGF0aW5nIGlkZW50aXR5XG4gICAgICAvLyBwb2xpY2llcyBpcyByZWFsbHkgdGhlIG9ubHkgb3B0aW9uXG4gICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdHJ1c3RBY2NvdW50SWRlbnRpdGllczogYm9vbGVhbiA9IHRydWU7XG5cbiAgICAgIGNvbnN0cnVjdG9yKGtleUlkOiBzdHJpbmcsIGtleUFybjogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAgICAgdGhpcy5rZXlJZCA9IGtleUlkO1xuICAgICAgICB0aGlzLmtleUFybiA9IGtleUFybjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChvcHRpb25zLmFsaWFzTmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQWxsIGFyZ3VtZW50cyB0byBLZXkuZnJvbUxvb2t1cCgpIG11c3QgYmUgY29uY3JldGUgKG5vIFRva2VucyknKTtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBjeGFwaS5LZXlDb250ZXh0UmVzcG9uc2UgPSBDb250ZXh0UHJvdmlkZXIuZ2V0VmFsdWUoc2NvcGUsIHtcbiAgICAgIHByb3ZpZGVyOiBjeHNjaGVtYS5Db250ZXh0UHJvdmlkZXIuS0VZX1BST1ZJREVSLFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgYWxpYXNOYW1lOiBvcHRpb25zLmFsaWFzTmFtZSxcbiAgICAgIH0gYXMgY3hzY2hlbWEuS2V5Q29udGV4dFF1ZXJ5LFxuICAgICAgZHVtbXlWYWx1ZToge1xuICAgICAgICBrZXlJZDogJzEyMzRhYmNkLTEyYWItMzRjZC01NmVmLTEyMzQ1Njc4OTBhYicsXG4gICAgICB9LFxuICAgIH0pLnZhbHVlO1xuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoYXR0cmlidXRlcy5rZXlJZCxcbiAgICAgIEFybi5mb3JtYXQoeyByZXNvdXJjZTogJ2tleScsIHNlcnZpY2U6ICdrbXMnLCByZXNvdXJjZU5hbWU6IGF0dHJpYnV0ZXMua2V5SWQgfSwgU3RhY2sub2Yoc2NvcGUpKSk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkga2V5QXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBrZXlJZDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgcG9saWN5PzogaWFtLlBvbGljeURvY3VtZW50O1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgdHJ1c3RBY2NvdW50SWRlbnRpdGllczogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogS2V5UHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBkZW55TGlzdHMgPSB7XG4gICAgICBbS2V5VXNhZ2UuRU5DUllQVF9ERUNSWVBUXTogW1xuICAgICAgICBLZXlTcGVjLkVDQ19OSVNUX1AyNTYsXG4gICAgICAgIEtleVNwZWMuRUNDX05JU1RfUDM4NCxcbiAgICAgICAgS2V5U3BlYy5FQ0NfTklTVF9QNTIxLFxuICAgICAgICBLZXlTcGVjLkVDQ19TRUNHX1AyNTZLMSxcbiAgICAgICAgS2V5U3BlYy5ITUFDXzIyNCxcbiAgICAgICAgS2V5U3BlYy5ITUFDXzI1NixcbiAgICAgICAgS2V5U3BlYy5ITUFDXzM4NCxcbiAgICAgICAgS2V5U3BlYy5ITUFDXzUxMixcbiAgICAgIF0sXG4gICAgICBbS2V5VXNhZ2UuU0lHTl9WRVJJRlldOiBbXG4gICAgICAgIEtleVNwZWMuU1lNTUVUUklDX0RFRkFVTFQsXG4gICAgICAgIEtleVNwZWMuSE1BQ18yMjQsXG4gICAgICAgIEtleVNwZWMuSE1BQ18yNTYsXG4gICAgICAgIEtleVNwZWMuSE1BQ18zODQsXG4gICAgICAgIEtleVNwZWMuSE1BQ181MTIsXG4gICAgICBdLFxuICAgICAgW0tleVVzYWdlLkdFTkVSQVRFX1ZFUklGWV9NQUNdOiBbXG4gICAgICAgIEtleVNwZWMuUlNBXzIwNDgsXG4gICAgICAgIEtleVNwZWMuUlNBXzMwNzIsXG4gICAgICAgIEtleVNwZWMuUlNBXzQwOTYsXG4gICAgICAgIEtleVNwZWMuRUNDX05JU1RfUDI1NixcbiAgICAgICAgS2V5U3BlYy5FQ0NfTklTVF9QMzg0LFxuICAgICAgICBLZXlTcGVjLkVDQ19OSVNUX1A1MjEsXG4gICAgICAgIEtleVNwZWMuRUNDX1NFQ0dfUDI1NksxLFxuICAgICAgICBLZXlTcGVjLlNZTU1FVFJJQ19ERUZBVUxULFxuICAgICAgICBLZXlTcGVjLlNNMixcbiAgICAgIF0sXG4gICAgfTtcbiAgICBjb25zdCBrZXlTcGVjID0gcHJvcHMua2V5U3BlYyA/PyBLZXlTcGVjLlNZTU1FVFJJQ19ERUZBVUxUO1xuICAgIGNvbnN0IGtleVVzYWdlID0gcHJvcHMua2V5VXNhZ2UgPz8gS2V5VXNhZ2UuRU5DUllQVF9ERUNSWVBUO1xuICAgIGlmIChkZW55TGlzdHNba2V5VXNhZ2VdLmluY2x1ZGVzKGtleVNwZWMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGtleSBzcGVjICcke2tleVNwZWN9JyBpcyBub3QgdmFsaWQgd2l0aCB1c2FnZSAnJHtrZXlVc2FnZX0nYCk7XG4gICAgfVxuXG4gICAgaWYgKGtleVNwZWMuc3RhcnRzV2l0aCgnSE1BQycpICYmIHByb3BzLmVuYWJsZUtleVJvdGF0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2tleSByb3RhdGlvbiBjYW5ub3QgYmUgZW5hYmxlZCBvbiBITUFDIGtleXMnKTtcbiAgICB9XG5cbiAgICBpZiAoa2V5U3BlYyAhPT0gS2V5U3BlYy5TWU1NRVRSSUNfREVGQVVMVCAmJiBwcm9wcy5lbmFibGVLZXlSb3RhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdrZXkgcm90YXRpb24gY2Fubm90IGJlIGVuYWJsZWQgb24gYXN5bW1ldHJpYyBrZXlzJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVmYXVsdEtleVBvbGljaWVzRmVhdHVyZUVuYWJsZWQgPSBGZWF0dXJlRmxhZ3Mub2YodGhpcykuaXNFbmFibGVkKGN4YXBpLktNU19ERUZBVUxUX0tFWV9QT0xJQ0lFUyk7XG5cbiAgICB0aGlzLnBvbGljeSA9IHByb3BzLnBvbGljeSA/PyBuZXcgaWFtLlBvbGljeURvY3VtZW50KCk7XG4gICAgaWYgKGRlZmF1bHRLZXlQb2xpY2llc0ZlYXR1cmVFbmFibGVkKSB7XG4gICAgICBpZiAocHJvcHMudHJ1c3RBY2NvdW50SWRlbnRpdGllcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgdHJ1c3RBY2NvdW50SWRlbnRpdGllc2AgY2Fubm90IGJlIGZhbHNlIGlmIHRoZSBAYXdzLWNkay9hd3Mta21zOmRlZmF1bHRLZXlQb2xpY2llcyBmZWF0dXJlIGZsYWcgaXMgc2V0Jyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJ1c3RBY2NvdW50SWRlbnRpdGllcyA9IHRydWU7XG4gICAgICAvLyBTZXQgdGhlIGRlZmF1bHQga2V5IHBvbGljeSBpZiBvbmUgaGFzbid0IGJlZW4gcHJvdmlkZWQgYnkgdGhlIHVzZXIuXG4gICAgICBpZiAoIXByb3BzLnBvbGljeSkge1xuICAgICAgICB0aGlzLmFkZERlZmF1bHRBZG1pblBvbGljeSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRydXN0QWNjb3VudElkZW50aXRpZXMgPSBwcm9wcy50cnVzdEFjY291bnRJZGVudGl0aWVzID8/IGZhbHNlO1xuICAgICAgaWYgKHRoaXMudHJ1c3RBY2NvdW50SWRlbnRpdGllcykge1xuICAgICAgICB0aGlzLmFkZERlZmF1bHRBZG1pblBvbGljeSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hZGRMZWdhY3lBZG1pblBvbGljeSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBwZW5kaW5nV2luZG93SW5EYXlzO1xuICAgIGlmIChwcm9wcy5wZW5kaW5nV2luZG93KSB7XG4gICAgICBwZW5kaW5nV2luZG93SW5EYXlzID0gcHJvcHMucGVuZGluZ1dpbmRvdy50b0RheXMoKTtcbiAgICAgIGlmIChwZW5kaW5nV2luZG93SW5EYXlzIDwgNyB8fCBwZW5kaW5nV2luZG93SW5EYXlzID4gMzApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAncGVuZGluZ1dpbmRvdycgdmFsdWUgbXVzdCBiZXR3ZWVuIDcgYW5kIDMwIGRheXMuIFJlY2VpdmVkOiAke3BlbmRpbmdXaW5kb3dJbkRheXN9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuS2V5KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBwcm9wcy5kZXNjcmlwdGlvbixcbiAgICAgIGVuYWJsZUtleVJvdGF0aW9uOiBwcm9wcy5lbmFibGVLZXlSb3RhdGlvbixcbiAgICAgIGVuYWJsZWQ6IHByb3BzLmVuYWJsZWQsXG4gICAgICBrZXlTcGVjOiBwcm9wcy5rZXlTcGVjLFxuICAgICAga2V5VXNhZ2U6IHByb3BzLmtleVVzYWdlLFxuICAgICAga2V5UG9saWN5OiB0aGlzLnBvbGljeSxcbiAgICAgIHBlbmRpbmdXaW5kb3dJbkRheXM6IHBlbmRpbmdXaW5kb3dJbkRheXMsXG4gICAgfSk7XG5cbiAgICB0aGlzLmtleUFybiA9IHJlc291cmNlLmF0dHJBcm47XG4gICAgdGhpcy5rZXlJZCA9IHJlc291cmNlLnJlZjtcbiAgICByZXNvdXJjZS5hcHBseVJlbW92YWxQb2xpY3kocHJvcHMucmVtb3ZhbFBvbGljeSk7XG5cbiAgICAocHJvcHMuYWRtaW5zID8/IFtdKS5mb3JFYWNoKChwKSA9PiB0aGlzLmdyYW50QWRtaW4ocCkpO1xuXG4gICAgaWYgKHByb3BzLmFsaWFzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuYWRkQWxpYXMocHJvcHMuYWxpYXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCBhZG1pbnMgcGVybWlzc2lvbnMgdXNpbmcgdGhpcyBrZXkgdG8gdGhlIGdpdmVuIHByaW5jaXBhbFxuICAgKlxuICAgKiBLZXkgYWRtaW5pc3RyYXRvcnMgaGF2ZSBwZXJtaXNzaW9ucyB0byBtYW5hZ2UgdGhlIGtleSAoZS5nLiwgY2hhbmdlIHBlcm1pc3Npb25zLCByZXZva2UpLCBidXQgZG8gbm90IGhhdmUgcGVybWlzc2lvbnNcbiAgICogdG8gdXNlIHRoZSBrZXkgaW4gY3J5cHRvZ3JhcGhpYyBvcGVyYXRpb25zIChlLmcuLCBlbmNyeXB0LCBkZWNyeXB0KS5cbiAgICovXG4gIHB1YmxpYyBncmFudEFkbWluKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHtcbiAgICByZXR1cm4gdGhpcy5ncmFudChncmFudGVlLCAuLi5wZXJtcy5BRE1JTl9BQ1RJT05TKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBkZWZhdWx0IGtleSBwb2xpY3kgdG8gdGhlIGtleS4gVGhpcyBwb2xpY3kgZ2l2ZXMgdGhlIEFXUyBhY2NvdW50IChyb290IHVzZXIpIGZ1bGwgYWNjZXNzIHRvIHRoZSBDTUssXG4gICAqIHdoaWNoIHJlZHVjZXMgdGhlIHJpc2sgb2YgdGhlIENNSyBiZWNvbWluZyB1bm1hbmFnZWFibGUgYW5kIGVuYWJsZXMgSUFNIHBvbGljaWVzIHRvIGFsbG93IGFjY2VzcyB0byB0aGUgQ01LLlxuICAgKiBUaGlzIGlzIHRoZSBzYW1lIHBvbGljeSB0aGF0IGlzIGRlZmF1bHQgd2hlbiBjcmVhdGluZyBhIEtleSB2aWEgdGhlIEtNUyBBUEkgb3IgQ29uc29sZS5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20va21zL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9rZXktcG9saWNpZXMuaHRtbCNrZXktcG9saWN5LWRlZmF1bHRcbiAgICovXG4gIHByaXZhdGUgYWRkRGVmYXVsdEFkbWluUG9saWN5KCkge1xuICAgIHRoaXMuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgYWN0aW9uczogWydrbXM6KiddLFxuICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKV0sXG4gICAgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50cyB0aGUgYWNjb3VudCBhZG1pbiBwcml2aWxlZ2VzIC0tIG5vdCBmdWxsIGFjY291bnQgYWNjZXNzIC0tIHBsdXMgdGhlIEdlbmVyYXRlRGF0YUtleSBhY3Rpb24uXG4gICAqIFRoZSBHZW5lcmF0ZURhdGFLZXkgYWN0aW9uIHdhcyBhZGRlZCBmb3IgaW50ZXJvcCB3aXRoIFMzIGluIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9pc3N1ZXMvMzQ1OC5cbiAgICpcbiAgICogVGhpcyBwb2xpY3kgaXMgZGlzY291cmFnZWQgYW5kIGRlcHJlY2F0ZWQgYnkgdGhlIGBAYXdzLWNkay9hd3Mta21zOmRlZmF1bHRLZXlQb2xpY2llc2AgZmVhdHVyZSBmbGFnLlxuICAgKlxuICAgKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20va21zL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9rZXktcG9saWNpZXMuaHRtbCNrZXktcG9saWN5LWRlZmF1bHRcbiAgICogQGRlcHJlY2F0ZWRcbiAgICovXG4gIHByaXZhdGUgYWRkTGVnYWN5QWRtaW5Qb2xpY3koKSB7XG4gICAgLy8gVGhpcyBpcyBlcXVpdmFsZW50IHRvIGBbLi4ucGVybXMuQURNSU5fQUNUSU9OUywgJ2ttczpHZW5lcmF0ZURhdGFLZXknXWAsXG4gICAgLy8gYnV0IGtlZXBpbmcgdGhpcyBleHBsaWNpdCBvcmRlcmluZyBmb3IgYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgKGNoYW5naW5nIHRoZSBvcmRlcmluZyBjYXVzZXMgcmVzb3VyY2UgdXBkYXRlcylcbiAgICBjb25zdCBhY3Rpb25zID0gW1xuICAgICAgJ2ttczpDcmVhdGUqJyxcbiAgICAgICdrbXM6RGVzY3JpYmUqJyxcbiAgICAgICdrbXM6RW5hYmxlKicsXG4gICAgICAna21zOkxpc3QqJyxcbiAgICAgICdrbXM6UHV0KicsXG4gICAgICAna21zOlVwZGF0ZSonLFxuICAgICAgJ2ttczpSZXZva2UqJyxcbiAgICAgICdrbXM6RGlzYWJsZSonLFxuICAgICAgJ2ttczpHZXQqJyxcbiAgICAgICdrbXM6RGVsZXRlKicsXG4gICAgICAna21zOlNjaGVkdWxlS2V5RGVsZXRpb24nLFxuICAgICAgJ2ttczpDYW5jZWxLZXlEZWxldGlvbicsXG4gICAgICAna21zOkdlbmVyYXRlRGF0YUtleScsXG4gICAgICAna21zOlRhZ1Jlc291cmNlJyxcbiAgICAgICdrbXM6VW50YWdSZXNvdXJjZScsXG4gICAgXTtcblxuICAgIHRoaXMuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgYWN0aW9ucyxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCldLFxuICAgIH0pKTtcbiAgfVxufVxuIl19