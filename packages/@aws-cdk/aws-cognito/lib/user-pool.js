"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPool = exports.AdvancedSecurityMode = exports.AccountRecovery = exports.Mfa = exports.VerificationEmailStyle = exports.UserPoolOperation = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const punycode_1 = require("punycode/");
const cognito_generated_1 = require("./cognito.generated");
const attr_names_1 = require("./private/attr-names");
const user_pool_client_1 = require("./user-pool-client");
const user_pool_domain_1 = require("./user-pool-domain");
const user_pool_resource_server_1 = require("./user-pool-resource-server");
/**
 * User pool operations to which lambda triggers can be attached.
 */
class UserPoolOperation {
    constructor(operationName) {
        this.operationName = operationName;
    }
    /** A custom user pool operation */
    static of(name) {
        const lowerCamelCase = name.charAt(0).toLowerCase() + name.slice(1);
        return new UserPoolOperation(lowerCamelCase);
    }
}
exports.UserPoolOperation = UserPoolOperation;
_a = JSII_RTTI_SYMBOL_1;
UserPoolOperation[_a] = { fqn: "@aws-cdk/aws-cognito.UserPoolOperation", version: "0.0.0" };
/**
 * Creates a challenge in a custom auth flow
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-create-auth-challenge.html
 */
UserPoolOperation.CREATE_AUTH_CHALLENGE = new UserPoolOperation('createAuthChallenge');
/**
 * Advanced customization and localization of messages
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-message.html
 */
UserPoolOperation.CUSTOM_MESSAGE = new UserPoolOperation('customMessage');
/**
 * Determines the next challenge in a custom auth flow
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-define-auth-challenge.html
 */
UserPoolOperation.DEFINE_AUTH_CHALLENGE = new UserPoolOperation('defineAuthChallenge');
/**
 * Event logging for custom analytics
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-authentication.html
 */
UserPoolOperation.POST_AUTHENTICATION = new UserPoolOperation('postAuthentication');
/**
 * Custom welcome messages or event logging for custom analytics
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-confirmation.html
 */
UserPoolOperation.POST_CONFIRMATION = new UserPoolOperation('postConfirmation');
/**
 * Custom validation to accept or deny the sign-in request
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-authentication.html
 */
UserPoolOperation.PRE_AUTHENTICATION = new UserPoolOperation('preAuthentication');
/**
 * Custom validation to accept or deny the sign-up request
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html
 */
UserPoolOperation.PRE_SIGN_UP = new UserPoolOperation('preSignUp');
/**
 * Add or remove attributes in Id tokens
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-token-generation.html
 */
UserPoolOperation.PRE_TOKEN_GENERATION = new UserPoolOperation('preTokenGeneration');
/**
 * Migrate a user from an existing user directory to user pools
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-migrate-user.html
 */
UserPoolOperation.USER_MIGRATION = new UserPoolOperation('userMigration');
/**
 * Determines if a response is correct in a custom auth flow
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-verify-auth-challenge-response.html
 */
UserPoolOperation.VERIFY_AUTH_CHALLENGE_RESPONSE = new UserPoolOperation('verifyAuthChallengeResponse');
/**
 * Amazon Cognito invokes this trigger to send email notifications to users.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-email-sender.html
 */
UserPoolOperation.CUSTOM_EMAIL_SENDER = new UserPoolOperation('customEmailSender');
/**
 * Amazon Cognito invokes this trigger to send email notifications to users.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-sms-sender.html
 */
UserPoolOperation.CUSTOM_SMS_SENDER = new UserPoolOperation('customSmsSender');
/**
 * The email verification style
 */
var VerificationEmailStyle;
(function (VerificationEmailStyle) {
    /** Verify email via code */
    VerificationEmailStyle["CODE"] = "CONFIRM_WITH_CODE";
    /** Verify email via link */
    VerificationEmailStyle["LINK"] = "CONFIRM_WITH_LINK";
})(VerificationEmailStyle = exports.VerificationEmailStyle || (exports.VerificationEmailStyle = {}));
/**
 * The different ways in which a user pool's MFA enforcement can be configured.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-mfa.html
 */
var Mfa;
(function (Mfa) {
    /** Users are not required to use MFA for sign in, and cannot configure one. */
    Mfa["OFF"] = "OFF";
    /** Users are not required to use MFA for sign in, but can configure one if they so choose to. */
    Mfa["OPTIONAL"] = "OPTIONAL";
    /** Users are required to configure an MFA, and have to use it to sign in. */
    Mfa["REQUIRED"] = "ON";
})(Mfa = exports.Mfa || (exports.Mfa = {}));
/**
 * How will a user be able to recover their account?
 *
 * When a user forgets their password, they can have a code sent to their verified email or verified phone to recover their account.
 * You can choose the preferred way to send codes below.
 * We recommend not allowing phone to be used for both password resets and multi-factor authentication (MFA).
 *
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/how-to-recover-a-user-account.html
 */
var AccountRecovery;
(function (AccountRecovery) {
    /**
     * Email if available, otherwise phone, but don’t allow a user to reset their password via phone if they are also using it for MFA
     */
    AccountRecovery[AccountRecovery["EMAIL_AND_PHONE_WITHOUT_MFA"] = 0] = "EMAIL_AND_PHONE_WITHOUT_MFA";
    /**
     * Phone if available, otherwise email, but don’t allow a user to reset their password via phone if they are also using it for MFA
     */
    AccountRecovery[AccountRecovery["PHONE_WITHOUT_MFA_AND_EMAIL"] = 1] = "PHONE_WITHOUT_MFA_AND_EMAIL";
    /**
     * Email only
     */
    AccountRecovery[AccountRecovery["EMAIL_ONLY"] = 2] = "EMAIL_ONLY";
    /**
     * Phone only, but don’t allow a user to reset their password via phone if they are also using it for MFA
     */
    AccountRecovery[AccountRecovery["PHONE_ONLY_WITHOUT_MFA"] = 3] = "PHONE_ONLY_WITHOUT_MFA";
    /**
     * (Not Recommended) Phone if available, otherwise email, and do allow a user to reset their password via phone if they are also using it for MFA.
     */
    AccountRecovery[AccountRecovery["PHONE_AND_EMAIL"] = 4] = "PHONE_AND_EMAIL";
    /**
     * None – users will have to contact an administrator to reset their passwords
     */
    AccountRecovery[AccountRecovery["NONE"] = 5] = "NONE";
})(AccountRecovery = exports.AccountRecovery || (exports.AccountRecovery = {}));
/**
 * The different ways in which a user pool's Advanced Security Mode can be configured.
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-userpooladdons.html#cfn-cognito-userpool-userpooladdons-advancedsecuritymode
 */
var AdvancedSecurityMode;
(function (AdvancedSecurityMode) {
    /** Enable advanced security mode */
    AdvancedSecurityMode["ENFORCED"] = "ENFORCED";
    /** gather metrics on detected risks without taking action. Metrics are published to Amazon CloudWatch */
    AdvancedSecurityMode["AUDIT"] = "AUDIT";
    /** Advanced security mode is disabled */
    AdvancedSecurityMode["OFF"] = "OFF";
})(AdvancedSecurityMode = exports.AdvancedSecurityMode || (exports.AdvancedSecurityMode = {}));
class UserPoolBase extends core_1.Resource {
    constructor() {
        super(...arguments);
        this.identityProviders = [];
    }
    addClient(id, options) {
        return new user_pool_client_1.UserPoolClient(this, id, {
            userPool: this,
            ...options,
        });
    }
    addDomain(id, options) {
        return new user_pool_domain_1.UserPoolDomain(this, id, {
            userPool: this,
            ...options,
        });
    }
    addResourceServer(id, options) {
        return new user_pool_resource_server_1.UserPoolResourceServer(this, id, {
            userPool: this,
            ...options,
        });
    }
    registerIdentityProvider(provider) {
        this.identityProviders.push(provider);
    }
    grant(grantee, ...actions) {
        return aws_iam_1.Grant.addToPrincipal({
            grantee,
            actions,
            resourceArns: [this.userPoolArn],
            scope: this,
        });
    }
}
/**
 * Define a Cognito User Pool
 */
class UserPool extends UserPoolBase {
    constructor(scope, id, props = {}) {
        super(scope, id);
        this.triggers = {};
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_UserPoolProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, UserPool);
            }
            throw error;
        }
        const signIn = this.signInConfiguration(props);
        if (props.customSenderKmsKey) {
            const kmsKey = props.customSenderKmsKey;
            this.triggers.kmsKeyId = kmsKey.keyArn;
        }
        if (props.lambdaTriggers) {
            for (const t of Object.keys(props.lambdaTriggers)) {
                let trigger;
                switch (t) {
                    case 'customSmsSender':
                    case 'customEmailSender':
                        if (!this.triggers.kmsKeyId) {
                            throw new Error('you must specify a KMS key if you are using customSmsSender or customEmailSender.');
                        }
                        trigger = props.lambdaTriggers[t];
                        const version = 'V1_0';
                        if (trigger !== undefined) {
                            this.addLambdaPermission(trigger, t);
                            this.triggers[t] = {
                                lambdaArn: trigger.functionArn,
                                lambdaVersion: version,
                            };
                        }
                        break;
                    default:
                        trigger = props.lambdaTriggers[t];
                        if (trigger !== undefined) {
                            this.addLambdaPermission(trigger, t);
                            this.triggers[t] = trigger.functionArn;
                        }
                        break;
                }
            }
        }
        const verificationMessageTemplate = this.verificationMessageConfiguration(props);
        let emailVerificationMessage;
        let emailVerificationSubject;
        if (verificationMessageTemplate.defaultEmailOption === VerificationEmailStyle.CODE) {
            emailVerificationMessage = verificationMessageTemplate.emailMessage;
            emailVerificationSubject = verificationMessageTemplate.emailSubject;
        }
        const smsVerificationMessage = verificationMessageTemplate.smsMessage;
        const inviteMessageTemplate = {
            emailMessage: props.userInvitation?.emailBody,
            emailSubject: props.userInvitation?.emailSubject,
            smsMessage: props.userInvitation?.smsMessage,
        };
        const selfSignUpEnabled = props.selfSignUpEnabled ?? false;
        const adminCreateUserConfig = {
            allowAdminCreateUserOnly: !selfSignUpEnabled,
            inviteMessageTemplate: props.userInvitation !== undefined ? inviteMessageTemplate : undefined,
        };
        const passwordPolicy = this.configurePasswordPolicy(props);
        if (props.email && props.emailSettings) {
            throw new Error('you must either provide "email" or "emailSettings", but not both');
        }
        const emailConfiguration = props.email ? props.email._bind(this) : undefinedIfNoKeys({
            from: encodePuny(props.emailSettings?.from),
            replyToEmailAddress: encodePuny(props.emailSettings?.replyTo),
        });
        const userPool = new cognito_generated_1.CfnUserPool(this, 'Resource', {
            userPoolName: props.userPoolName,
            usernameAttributes: signIn.usernameAttrs,
            aliasAttributes: signIn.aliasAttrs,
            autoVerifiedAttributes: signIn.autoVerifyAttrs,
            lambdaConfig: core_1.Lazy.any({ produce: () => undefinedIfNoKeys(this.triggers) }),
            smsAuthenticationMessage: this.mfaMessage(props),
            smsConfiguration: this.smsConfiguration(props),
            adminCreateUserConfig,
            emailVerificationMessage,
            emailVerificationSubject,
            smsVerificationMessage,
            verificationMessageTemplate,
            userPoolAddOns: undefinedIfNoKeys({
                advancedSecurityMode: props.advancedSecurityMode,
            }),
            schema: this.schemaConfiguration(props),
            mfaConfiguration: props.mfa,
            enabledMfas: this.mfaConfiguration(props),
            policies: passwordPolicy !== undefined ? { passwordPolicy } : undefined,
            emailConfiguration,
            usernameConfiguration: undefinedIfNoKeys({
                caseSensitive: props.signInCaseSensitive,
            }),
            accountRecoverySetting: this.accountRecovery(props),
            deviceConfiguration: props.deviceTracking,
            userAttributeUpdateSettings: this.configureUserAttributeChanges(props),
            deletionProtection: defaultDeletionProtection(props.deletionProtection),
        });
        userPool.applyRemovalPolicy(props.removalPolicy);
        this.userPoolId = userPool.ref;
        this.userPoolArn = userPool.attrArn;
        this.userPoolProviderName = userPool.attrProviderName;
        this.userPoolProviderUrl = userPool.attrProviderUrl;
    }
    /**
     * Import an existing user pool based on its id.
     */
    static fromUserPoolId(scope, id, userPoolId) {
        let userPoolArn = core_1.Stack.of(scope).formatArn({
            service: 'cognito-idp',
            resource: 'userpool',
            resourceName: userPoolId,
        });
        return UserPool.fromUserPoolArn(scope, id, userPoolArn);
    }
    /**
     * Import an existing user pool based on its ARN.
     */
    static fromUserPoolArn(scope, id, userPoolArn) {
        const arnParts = core_1.Stack.of(scope).splitArn(userPoolArn, core_1.ArnFormat.SLASH_RESOURCE_NAME);
        if (!arnParts.resourceName) {
            throw new Error('invalid user pool ARN');
        }
        const userPoolId = arnParts.resourceName;
        class ImportedUserPool extends UserPoolBase {
            constructor() {
                super(scope, id, {
                    account: arnParts.account,
                    region: arnParts.region,
                });
                this.userPoolArn = userPoolArn;
                this.userPoolId = userPoolId;
            }
        }
        return new ImportedUserPool();
    }
    /**
     * Add a lambda trigger to a user pool operation
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html
     */
    addTrigger(operation, fn) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_UserPoolOperation(operation);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addTrigger);
            }
            throw error;
        }
        if (operation.operationName in this.triggers) {
            throw new Error(`A trigger for the operation ${operation.operationName} already exists.`);
        }
        this.addLambdaPermission(fn, operation.operationName);
        switch (operation.operationName) {
            case 'customEmailSender':
            case 'customSmsSender':
                if (!this.triggers.kmsKeyId) {
                    throw new Error('you must specify a KMS key if you are using customSmsSender or customEmailSender.');
                }
                this.triggers[operation.operationName] = {
                    lambdaArn: fn.functionArn,
                    lambdaVersion: 'V1_0',
                };
                break;
            default:
                this.triggers[operation.operationName] = fn.functionArn;
        }
    }
    addLambdaPermission(fn, name) {
        const capitalize = name.charAt(0).toUpperCase() + name.slice(1);
        fn.addPermission(`${capitalize}Cognito`, {
            principal: new aws_iam_1.ServicePrincipal('cognito-idp.amazonaws.com'),
            sourceArn: core_1.Lazy.string({ produce: () => this.userPoolArn }),
            scope: this,
        });
    }
    mfaMessage(props) {
        const CODE_TEMPLATE = '{####}';
        const MAX_LENGTH = 140;
        const message = props.mfaMessage;
        if (message && !core_1.Token.isUnresolved(message)) {
            if (!message.includes(CODE_TEMPLATE)) {
                throw new Error(`MFA message must contain the template string '${CODE_TEMPLATE}'`);
            }
            if (message.length > MAX_LENGTH) {
                throw new Error(`MFA message must be between ${CODE_TEMPLATE.length} and ${MAX_LENGTH} characters`);
            }
        }
        return message;
    }
    verificationMessageConfiguration(props) {
        const CODE_TEMPLATE = '{####}';
        const VERIFY_EMAIL_TEMPLATE = '{##Verify Email##}';
        const emailStyle = props.userVerification?.emailStyle ?? VerificationEmailStyle.CODE;
        const emailSubject = props.userVerification?.emailSubject ?? 'Verify your new account';
        const smsMessage = props.userVerification?.smsMessage ?? `The verification code to your new account is ${CODE_TEMPLATE}`;
        if (emailStyle === VerificationEmailStyle.CODE) {
            const emailMessage = props.userVerification?.emailBody ?? `The verification code to your new account is ${CODE_TEMPLATE}`;
            if (!core_1.Token.isUnresolved(emailMessage) && emailMessage.indexOf(CODE_TEMPLATE) < 0) {
                throw new Error(`Verification email body must contain the template string '${CODE_TEMPLATE}'`);
            }
            if (!core_1.Token.isUnresolved(smsMessage) && smsMessage.indexOf(CODE_TEMPLATE) < 0) {
                throw new Error(`SMS message must contain the template string '${CODE_TEMPLATE}'`);
            }
            return {
                defaultEmailOption: VerificationEmailStyle.CODE,
                emailMessage,
                emailSubject,
                smsMessage,
            };
        }
        else {
            const emailMessage = props.userVerification?.emailBody ??
                `Verify your account by clicking on ${VERIFY_EMAIL_TEMPLATE}`;
            if (!core_1.Token.isUnresolved(emailMessage) && emailMessage.indexOf(VERIFY_EMAIL_TEMPLATE) < 0) {
                throw new Error(`Verification email body must contain the template string '${VERIFY_EMAIL_TEMPLATE}'`);
            }
            return {
                defaultEmailOption: VerificationEmailStyle.LINK,
                emailMessageByLink: emailMessage,
                emailSubjectByLink: emailSubject,
                smsMessage,
            };
        }
    }
    signInConfiguration(props) {
        let aliasAttrs;
        let usernameAttrs;
        let autoVerifyAttrs;
        const signIn = props.signInAliases ?? { username: true };
        if (signIn.preferredUsername && !signIn.username) {
            throw new Error('username signIn must be enabled if preferredUsername is enabled');
        }
        if (signIn.username) {
            aliasAttrs = [];
            if (signIn.email) {
                aliasAttrs.push(attr_names_1.StandardAttributeNames.email);
            }
            if (signIn.phone) {
                aliasAttrs.push(attr_names_1.StandardAttributeNames.phoneNumber);
            }
            if (signIn.preferredUsername) {
                aliasAttrs.push(attr_names_1.StandardAttributeNames.preferredUsername);
            }
            if (aliasAttrs.length === 0) {
                aliasAttrs = undefined;
            }
        }
        else {
            usernameAttrs = [];
            if (signIn.email) {
                usernameAttrs.push(attr_names_1.StandardAttributeNames.email);
            }
            if (signIn.phone) {
                usernameAttrs.push(attr_names_1.StandardAttributeNames.phoneNumber);
            }
        }
        if (props.autoVerify) {
            autoVerifyAttrs = [];
            if (props.autoVerify.email) {
                autoVerifyAttrs.push(attr_names_1.StandardAttributeNames.email);
            }
            if (props.autoVerify.phone) {
                autoVerifyAttrs.push(attr_names_1.StandardAttributeNames.phoneNumber);
            }
        }
        else if (signIn.email || signIn.phone) {
            autoVerifyAttrs = [];
            if (signIn.email) {
                autoVerifyAttrs.push(attr_names_1.StandardAttributeNames.email);
            }
            if (signIn.phone) {
                autoVerifyAttrs.push(attr_names_1.StandardAttributeNames.phoneNumber);
            }
        }
        return { usernameAttrs, aliasAttrs, autoVerifyAttrs };
    }
    smsConfiguration(props) {
        if (props.enableSmsRole === false && props.smsRole) {
            throw new Error('enableSmsRole cannot be disabled when smsRole is specified');
        }
        if (props.smsRole) {
            return {
                snsCallerArn: props.smsRole.roleArn,
                externalId: props.smsRoleExternalId,
                snsRegion: props.snsRegion,
            };
        }
        if (props.enableSmsRole === false) {
            return undefined;
        }
        const mfaConfiguration = this.mfaConfiguration(props);
        const phoneVerification = props.signInAliases?.phone === true || props.autoVerify?.phone === true;
        const roleRequired = mfaConfiguration?.includes('SMS_MFA') || phoneVerification;
        if (!roleRequired && props.enableSmsRole === undefined) {
            return undefined;
        }
        const smsRoleExternalId = core_1.Names.uniqueId(this).slice(0, 1223); // sts:ExternalId max length of 1224
        const smsRole = props.smsRole ?? new aws_iam_1.Role(this, 'smsRole', {
            assumedBy: new aws_iam_1.ServicePrincipal('cognito-idp.amazonaws.com', {
                conditions: {
                    StringEquals: { 'sts:ExternalId': smsRoleExternalId },
                },
            }),
            inlinePolicies: {
                /*
                  * The UserPool is very particular that it must contain an 'sns:Publish' action as an inline policy.
                  * Ideally, a conditional that restricts this action to 'sms' protocol needs to be attached, but the UserPool deployment fails validation.
                  * Seems like a case of being excessively strict.
                  */
                'sns-publish': new aws_iam_1.PolicyDocument({
                    statements: [
                        new aws_iam_1.PolicyStatement({
                            actions: ['sns:Publish'],
                            resources: ['*'],
                        }),
                    ],
                }),
            },
        });
        return {
            externalId: smsRoleExternalId,
            snsCallerArn: smsRole.roleArn,
            snsRegion: props.snsRegion,
        };
    }
    mfaConfiguration(props) {
        if (props.mfa === undefined || props.mfa === Mfa.OFF) {
            // since default is OFF, treat undefined and OFF the same way
            return undefined;
        }
        else if (props.mfaSecondFactor === undefined &&
            (props.mfa === Mfa.OPTIONAL || props.mfa === Mfa.REQUIRED)) {
            return ['SMS_MFA'];
        }
        else {
            const enabledMfas = [];
            if (props.mfaSecondFactor.sms) {
                enabledMfas.push('SMS_MFA');
            }
            if (props.mfaSecondFactor.otp) {
                enabledMfas.push('SOFTWARE_TOKEN_MFA');
            }
            return enabledMfas;
        }
    }
    configurePasswordPolicy(props) {
        const tempPasswordValidity = props.passwordPolicy?.tempPasswordValidity;
        if (tempPasswordValidity !== undefined && tempPasswordValidity.toDays() > core_1.Duration.days(365).toDays()) {
            throw new Error(`tempPasswordValidity cannot be greater than 365 days (received: ${tempPasswordValidity.toDays()})`);
        }
        const minLength = props.passwordPolicy ? props.passwordPolicy.minLength ?? 8 : undefined;
        if (minLength !== undefined && (minLength < 6 || minLength > 99)) {
            throw new Error(`minLength for password must be between 6 and 99 (received: ${minLength})`);
        }
        return undefinedIfNoKeys({
            temporaryPasswordValidityDays: tempPasswordValidity?.toDays({ integral: true }),
            minimumLength: minLength,
            requireLowercase: props.passwordPolicy?.requireLowercase,
            requireUppercase: props.passwordPolicy?.requireUppercase,
            requireNumbers: props.passwordPolicy?.requireDigits,
            requireSymbols: props.passwordPolicy?.requireSymbols,
        });
    }
    schemaConfiguration(props) {
        const schema = [];
        if (props.standardAttributes) {
            const stdAttributes = Object.entries(props.standardAttributes)
                .filter(([, attr]) => !!attr)
                .map(([attrName, attr]) => ({
                name: attr_names_1.StandardAttributeNames[attrName],
                mutable: attr.mutable ?? true,
                required: attr.required ?? false,
            }));
            schema.push(...stdAttributes);
        }
        if (props.customAttributes) {
            const customAttrs = Object.keys(props.customAttributes).map((attrName) => {
                const attrConfig = props.customAttributes[attrName].bind();
                const numberConstraints = {
                    minValue: attrConfig.numberConstraints?.min?.toString(),
                    maxValue: attrConfig.numberConstraints?.max?.toString(),
                };
                const stringConstraints = {
                    minLength: attrConfig.stringConstraints?.minLen?.toString(),
                    maxLength: attrConfig.stringConstraints?.maxLen?.toString(),
                };
                return {
                    name: attrName,
                    attributeDataType: attrConfig.dataType,
                    numberAttributeConstraints: attrConfig.numberConstraints
                        ? numberConstraints
                        : undefined,
                    stringAttributeConstraints: attrConfig.stringConstraints
                        ? stringConstraints
                        : undefined,
                    mutable: attrConfig.mutable,
                };
            });
            schema.push(...customAttrs);
        }
        if (schema.length === 0) {
            return undefined;
        }
        return schema;
    }
    accountRecovery(props) {
        const accountRecovery = props.accountRecovery ?? AccountRecovery.PHONE_WITHOUT_MFA_AND_EMAIL;
        switch (accountRecovery) {
            case AccountRecovery.EMAIL_AND_PHONE_WITHOUT_MFA:
                return {
                    recoveryMechanisms: [
                        { name: 'verified_email', priority: 1 },
                        { name: 'verified_phone_number', priority: 2 },
                    ],
                };
            case AccountRecovery.PHONE_WITHOUT_MFA_AND_EMAIL:
                return {
                    recoveryMechanisms: [
                        { name: 'verified_phone_number', priority: 1 },
                        { name: 'verified_email', priority: 2 },
                    ],
                };
            case AccountRecovery.EMAIL_ONLY:
                return {
                    recoveryMechanisms: [{ name: 'verified_email', priority: 1 }],
                };
            case AccountRecovery.PHONE_ONLY_WITHOUT_MFA:
                return {
                    recoveryMechanisms: [{ name: 'verified_phone_number', priority: 1 }],
                };
            case AccountRecovery.NONE:
                return {
                    recoveryMechanisms: [{ name: 'admin_only', priority: 1 }],
                };
            case AccountRecovery.PHONE_AND_EMAIL:
                return undefined;
            default:
                throw new Error(`Unsupported AccountRecovery type - ${accountRecovery}`);
        }
    }
    configureUserAttributeChanges(props) {
        if (!props.keepOriginal) {
            return undefined;
        }
        const attributesRequireVerificationBeforeUpdate = [];
        if (props.keepOriginal.email) {
            attributesRequireVerificationBeforeUpdate.push(attr_names_1.StandardAttributeNames.email);
        }
        if (props.keepOriginal.phone) {
            attributesRequireVerificationBeforeUpdate.push(attr_names_1.StandardAttributeNames.phoneNumber);
        }
        return {
            attributesRequireVerificationBeforeUpdate,
        };
    }
}
exports.UserPool = UserPool;
_b = JSII_RTTI_SYMBOL_1;
UserPool[_b] = { fqn: "@aws-cdk/aws-cognito.UserPool", version: "0.0.0" };
function undefinedIfNoKeys(struct) {
    const allUndefined = Object.values(struct).every(val => val === undefined);
    return allUndefined ? undefined : struct;
}
function encodePuny(input) {
    return input !== undefined ? punycode_1.toASCII(input) : input;
}
function defaultDeletionProtection(deletionProtection) {
    if (deletionProtection === true) {
        return 'ACTIVE';
    }
    if (deletionProtection === false) {
        return 'INACTIVE';
    }
    return undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci1wb29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhDQUFxSDtBQUdySCx3Q0FBbUg7QUFFbkgsd0NBQXNEO0FBQ3RELDJEQUFrRDtBQUNsRCxxREFBOEQ7QUFFOUQseURBQTJFO0FBQzNFLHlEQUEyRTtBQUczRSwyRUFBb0c7QUF1S3BHOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFrRjVCLFlBQW9CLGFBQXFCO1FBQ3ZDLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO0tBQ3BDO0lBWEQsbUNBQW1DO0lBQzVCLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBWTtRQUMzQixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEUsT0FBTyxJQUFJLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQzlDOztBQTdFSCw4Q0FxRkM7OztBQXBGQzs7O0dBR0c7QUFDb0IsdUNBQXFCLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRTVGOzs7R0FHRztBQUNvQixnQ0FBYyxHQUFHLElBQUksaUJBQWlCLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFL0U7OztHQUdHO0FBQ29CLHVDQUFxQixHQUFHLElBQUksaUJBQWlCLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUU1Rjs7O0dBR0c7QUFDb0IscUNBQW1CLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBRXpGOzs7R0FHRztBQUNvQixtQ0FBaUIsR0FBRyxJQUFJLGlCQUFpQixDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFckY7OztHQUdHO0FBQ29CLG9DQUFrQixHQUFHLElBQUksaUJBQWlCLENBQUMsbUJBQW1CLENBQUMsQ0FB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QUksa0JBQWtCLEtBQUssSUFBSSxFQUFFO1FBQy9CLE9BQU8sUUFBUSxDQUFDO0tBQ2pCO0lBRUQsSUFBSSxrQkFBa0IsS0FBSyxLQUFLLEVBQUU7UUFDaEMsT0FBTyxVQUFVLENBQUM7S0FDbkI7SUFFRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR3JhbnQsIElHcmFudGFibGUsIElSb2xlLCBQb2xpY3lEb2N1bWVudCwgUG9saWN5U3RhdGVtZW50LCBSb2xlLCBTZXJ2aWNlUHJpbmNpcGFsIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBJS2V5IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBBcm5Gb3JtYXQsIER1cmF0aW9uLCBJUmVzb3VyY2UsIExhenksIE5hbWVzLCBSZW1vdmFsUG9saWN5LCBSZXNvdXJjZSwgU3RhY2ssIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IHRvQVNDSUkgYXMgcHVueWNvZGVFbmNvZGUgfSBmcm9tICdwdW55Y29kZS8nO1xuaW1wb3J0IHsgQ2ZuVXNlclBvb2wgfSBmcm9tICcuL2NvZ25pdG8uZ2VuZXJhdGVkJztcbmltcG9ydCB7IFN0YW5kYXJkQXR0cmlidXRlTmFtZXMgfSBmcm9tICcuL3ByaXZhdGUvYXR0ci1uYW1lcyc7XG5pbXBvcnQgeyBJQ3VzdG9tQXR0cmlidXRlLCBTdGFuZGFyZEF0dHJpYnV0ZSwgU3RhbmRhcmRBdHRyaWJ1dGVzIH0gZnJvbSAnLi91c2VyLXBvb2wtYXR0cic7XG5pbXBvcnQgeyBVc2VyUG9vbENsaWVudCwgVXNlclBvb2xDbGllbnRPcHRpb25zIH0gZnJvbSAnLi91c2VyLXBvb2wtY2xpZW50JztcbmltcG9ydCB7IFVzZXJQb29sRG9tYWluLCBVc2VyUG9vbERvbWFpbk9wdGlvbnMgfSBmcm9tICcuL3VzZXItcG9vbC1kb21haW4nO1xuaW1wb3J0IHsgVXNlclBvb2xFbWFpbCB9IGZyb20gJy4vdXNlci1wb29sLWVtYWlsJztcbmltcG9ydCB7IElVc2VyUG9vbElkZW50aXR5UHJvdmlkZXIgfSBmcm9tICcuL3VzZXItcG9vbC1pZHAnO1xuaW1wb3J0IHsgVXNlclBvb2xSZXNvdXJjZVNlcnZlciwgVXNlclBvb2xSZXNvdXJjZVNlcnZlck9wdGlvbnMgfSBmcm9tICcuL3VzZXItcG9vbC1yZXNvdXJjZS1zZXJ2ZXInO1xuXG4vKipcbiAqIFRoZSBkaWZmZXJlbnQgd2F5cyBpbiB3aGljaCB1c2VycyBvZiB0aGlzIHBvb2wgY2FuIHNpZ24gdXAgb3Igc2lnbiBpbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTaWduSW5BbGlhc2VzIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdXNlciBpcyBhbGxvd2VkIHRvIHNpZ24gdXAgb3Igc2lnbiBpbiB3aXRoIGEgdXNlcm5hbWVcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgdXNlcm5hbWU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGEgdXNlciBpcyBhbGxvd2VkIHRvIHNpZ24gdXAgb3Igc2lnbiBpbiB3aXRoIGFuIGVtYWlsIGFkZHJlc3NcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGVtYWlsPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciBhIHVzZXIgaXMgYWxsb3dlZCB0byBzaWduIHVwIG9yIHNpZ24gaW4gd2l0aCBhIHBob25lIG51bWJlclxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcGhvbmU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGEgdXNlciBpcyBhbGxvd2VkIHRvIHNpZ24gaW4gd2l0aCBhIHNlY29uZGFyeSB1c2VybmFtZSwgdGhhdCBjYW4gYmUgc2V0IGFuZCBtb2RpZmllZCBhZnRlciBzaWduIHVwLlxuICAgKiBDYW4gb25seSBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggYFVTRVJOQU1FYC5cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHByZWZlcnJlZFVzZXJuYW1lPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBdHRyaWJ1dGVzIHRoYXQgY2FuIGJlIGF1dG9tYXRpY2FsbHkgdmVyaWZpZWQgZm9yIHVzZXJzIGluIGEgdXNlciBwb29sLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEF1dG9WZXJpZmllZEF0dHJzIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGVtYWlsIGFkZHJlc3Mgb2YgdGhlIHVzZXIgc2hvdWxkIGJlIGF1dG8gdmVyaWZpZWQgYXQgc2lnbiB1cC5cbiAgICpcbiAgICogTm90ZTogSWYgYm90aCBgZW1haWxgIGFuZCBgcGhvbmVgIGlzIHNldCwgQ29nbml0byBvbmx5IHZlcmlmaWVzIHRoZSBwaG9uZSBudW1iZXIuIFRvIGFsc28gdmVyaWZ5IGVtYWlsLCBzZWUgaGVyZSAtXG4gICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS91c2VyLXBvb2wtc2V0dGluZ3MtZW1haWwtcGhvbmUtdmVyaWZpY2F0aW9uLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSB0cnVlLCBpZiBlbWFpbCBpcyB0dXJuZWQgb24gZm9yIGBzaWduSW5gLiBmYWxzZSwgb3RoZXJ3aXNlLlxuICAgKi9cbiAgcmVhZG9ubHkgZW1haWw/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBwaG9uZSBudW1iZXIgb2YgdGhlIHVzZXIgc2hvdWxkIGJlIGF1dG8gdmVyaWZpZWQgYXQgc2lnbiB1cC5cbiAgICogQGRlZmF1bHQgLSB0cnVlLCBpZiBwaG9uZSBpcyB0dXJuZWQgb24gZm9yIGBzaWduSW5gLiBmYWxzZSwgb3RoZXJ3aXNlLlxuICAgKi9cbiAgcmVhZG9ubHkgcGhvbmU/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEF0dHJpYnV0ZXMgdGhhdCB3aWxsIGJlIGtlcHQgdW50aWwgdGhlIHVzZXIgdmVyaWZpZXMgdGhlIGNoYW5nZWQgYXR0cmlidXRlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEtlZXBPcmlnaW5hbEF0dHJzIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGVtYWlsIGFkZHJlc3Mgb2YgdGhlIHVzZXIgc2hvdWxkIHJlbWFpbiB0aGUgb3JpZ2luYWwgdmFsdWUgdW50aWwgdGhlIG5ldyBlbWFpbCBhZGRyZXNzIGlzIHZlcmlmaWVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAqL1xuICByZWFkb25seSBlbWFpbD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHBob25lIG51bWJlciBvZiB0aGUgdXNlciBzaG91bGQgcmVtYWluIHRoZSBvcmlnaW5hbCB2YWx1ZSB1bnRpbCB0aGUgbmV3IHBob25lIG51bWJlciBpcyB2ZXJpZmllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcGhvbmU/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFRyaWdnZXJzIGZvciBhIHVzZXIgcG9vbFxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvY29nbml0by11c2VyLWlkZW50aXR5LXBvb2xzLXdvcmtpbmctd2l0aC1hd3MtbGFtYmRhLXRyaWdnZXJzLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVc2VyUG9vbFRyaWdnZXJzIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYXV0aGVudGljYXRpb24gY2hhbGxlbmdlLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS91c2VyLXBvb2wtbGFtYmRhLWNyZWF0ZS1hdXRoLWNoYWxsZW5nZS5odG1sXG4gICAqIEBkZWZhdWx0IC0gbm8gdHJpZ2dlciBjb25maWd1cmVkXG4gICAqL1xuICByZWFkb25seSBjcmVhdGVBdXRoQ2hhbGxlbmdlPzogbGFtYmRhLklGdW5jdGlvbjtcblxuICAvKipcbiAgICogQSBjdXN0b20gTWVzc2FnZSBBV1MgTGFtYmRhIHRyaWdnZXIuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzZXItcG9vbC1sYW1iZGEtY3VzdG9tLW1lc3NhZ2UuaHRtbFxuICAgKiBAZGVmYXVsdCAtIG5vIHRyaWdnZXIgY29uZmlndXJlZFxuICAgKi9cbiAgcmVhZG9ubHkgY3VzdG9tTWVzc2FnZT86IGxhbWJkYS5JRnVuY3Rpb247XG5cbiAgLyoqXG4gICAqIERlZmluZXMgdGhlIGF1dGhlbnRpY2F0aW9uIGNoYWxsZW5nZS5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLWxhbWJkYS1kZWZpbmUtYXV0aC1jaGFsbGVuZ2UuaHRtbFxuICAgKiBAZGVmYXVsdCAtIG5vIHRyaWdnZXIgY29uZmlndXJlZFxuICAgKi9cbiAgcmVhZG9ubHkgZGVmaW5lQXV0aENoYWxsZW5nZT86IGxhbWJkYS5JRnVuY3Rpb247XG5cbiAgLyoqXG4gICAqIEEgcG9zdC1hdXRoZW50aWNhdGlvbiBBV1MgTGFtYmRhIHRyaWdnZXIuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzZXItcG9vbC1sYW1iZGEtcG9zdC1hdXRoZW50aWNhdGlvbi5odG1sXG4gICAqIEBkZWZhdWx0IC0gbm8gdHJpZ2dlciBjb25maWd1cmVkXG4gICAqL1xuICByZWFkb25seSBwb3N0QXV0aGVudGljYXRpb24/OiBsYW1iZGEuSUZ1bmN0aW9uO1xuXG4gIC8qKlxuICAgKiBBIHBvc3QtY29uZmlybWF0aW9uIEFXUyBMYW1iZGEgdHJpZ2dlci5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLWxhbWJkYS1wb3N0LWNvbmZpcm1hdGlvbi5odG1sXG4gICAqIEBkZWZhdWx0IC0gbm8gdHJpZ2dlciBjb25maWd1cmVkXG4gICAqL1xuICByZWFkb25seSBwb3N0Q29uZmlybWF0aW9uPzogbGFtYmRhLklGdW5jdGlvbjtcblxuICAvKipcbiAgICogQSBwcmUtYXV0aGVudGljYXRpb24gQVdTIExhbWJkYSB0cmlnZ2VyLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS91c2VyLXBvb2wtbGFtYmRhLXByZS1hdXRoZW50aWNhdGlvbi5odG1sXG4gICAqIEBkZWZhdWx0IC0gbm8gdHJpZ2dlciBjb25maWd1cmVkXG4gICAqL1xuICByZWFkb25seSBwcmVBdXRoZW50aWNhdGlvbj86IGxhbWJkYS5JRnVuY3Rpb247XG5cbiAgLyoqXG4gICAqIEEgcHJlLXJlZ2lzdHJhdGlvbiBBV1MgTGFtYmRhIHRyaWdnZXIuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzZXItcG9vbC1sYW1iZGEtcHJlLXNpZ24tdXAuaHRtbFxuICAgKiBAZGVmYXVsdCAtIG5vIHRyaWdnZXIgY29uZmlndXJlZFxuICAgKi9cbiAgcmVhZG9ubHkgcHJlU2lnblVwPzogbGFtYmRhLklGdW5jdGlvbjtcblxuICAvKipcbiAgICogQSBwcmUtdG9rZW4tZ2VuZXJhdGlvbiBBV1MgTGFtYmRhIHRyaWdnZXIuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzZXItcG9vbC1sYW1iZGEtcHJlLXRva2VuLWdlbmVyYXRpb24uaHRtbFxuICAgKiBAZGVmYXVsdCAtIG5vIHRyaWdnZXIgY29uZmlndXJlZFxuICAgKi9cbiAgcmVhZG9ubHkgcHJlVG9rZW5HZW5lcmF0aW9uPzogbGFtYmRhLklGdW5jdGlvbjtcblxuICAvKipcbiAgICogQSB1c2VyLW1pZ3JhdGlvbiBBV1MgTGFtYmRhIHRyaWdnZXIuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzZXItcG9vbC1sYW1iZGEtbWlncmF0ZS11c2VyLmh0bWxcbiAgICogQGRlZmF1bHQgLSBubyB0cmlnZ2VyIGNvbmZpZ3VyZWRcbiAgICovXG4gIHJlYWRvbmx5IHVzZXJNaWdyYXRpb24/OiBsYW1iZGEuSUZ1bmN0aW9uO1xuXG4gIC8qKlxuICAgKiBWZXJpZmllcyB0aGUgYXV0aGVudGljYXRpb24gY2hhbGxlbmdlIHJlc3BvbnNlLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS91c2VyLXBvb2wtbGFtYmRhLXZlcmlmeS1hdXRoLWNoYWxsZW5nZS1yZXNwb25zZS5odG1sXG4gICAqIEBkZWZhdWx0IC0gbm8gdHJpZ2dlciBjb25maWd1cmVkXG4gICAqL1xuICByZWFkb25seSB2ZXJpZnlBdXRoQ2hhbGxlbmdlUmVzcG9uc2U/OiBsYW1iZGEuSUZ1bmN0aW9uO1xuXG4gIC8qKlxuICAgKiBBbWF6b24gQ29nbml0byBpbnZva2VzIHRoaXMgdHJpZ2dlciB0byBzZW5kIGVtYWlsIG5vdGlmaWNhdGlvbnMgdG8gdXNlcnMuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzZXItcG9vbC1sYW1iZGEtY3VzdG9tLWVtYWlsLXNlbmRlci5odG1sXG4gICAqIEBkZWZhdWx0IC0gbm8gdHJpZ2dlciBjb25maWd1cmVkXG4gICAqL1xuICByZWFkb25seSBjdXN0b21FbWFpbFNlbmRlcj86IGxhbWJkYS5JRnVuY3Rpb25cblxuICAvKipcbiAgICogQW1hem9uIENvZ25pdG8gaW52b2tlcyB0aGlzIHRyaWdnZXIgdG8gc2VuZCBTTVMgbm90aWZpY2F0aW9ucyB0byB1c2Vycy5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLWxhbWJkYS1jdXN0b20tc21zLXNlbmRlci5odG1sXG4gICAqIEBkZWZhdWx0IC0gbm8gdHJpZ2dlciBjb25maWd1cmVkXG4gICAqL1xuICByZWFkb25seSBjdXN0b21TbXNTZW5kZXI/OiBsYW1iZGEuSUZ1bmN0aW9uXG5cbiAgLyoqXG4gICAqIEluZGV4IHNpZ25hdHVyZVxuICAgKi9cbiAgW3RyaWdnZXI6IHN0cmluZ106IGxhbWJkYS5JRnVuY3Rpb24gfCB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogVXNlciBwb29sIG9wZXJhdGlvbnMgdG8gd2hpY2ggbGFtYmRhIHRyaWdnZXJzIGNhbiBiZSBhdHRhY2hlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFVzZXJQb29sT3BlcmF0aW9uIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjaGFsbGVuZ2UgaW4gYSBjdXN0b20gYXV0aCBmbG93XG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzZXItcG9vbC1sYW1iZGEtY3JlYXRlLWF1dGgtY2hhbGxlbmdlLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ1JFQVRFX0FVVEhfQ0hBTExFTkdFID0gbmV3IFVzZXJQb29sT3BlcmF0aW9uKCdjcmVhdGVBdXRoQ2hhbGxlbmdlJyk7XG5cbiAgLyoqXG4gICAqIEFkdmFuY2VkIGN1c3RvbWl6YXRpb24gYW5kIGxvY2FsaXphdGlvbiBvZiBtZXNzYWdlc1xuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS91c2VyLXBvb2wtbGFtYmRhLWN1c3RvbS1tZXNzYWdlLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ1VTVE9NX01FU1NBR0UgPSBuZXcgVXNlclBvb2xPcGVyYXRpb24oJ2N1c3RvbU1lc3NhZ2UnKTtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB0aGUgbmV4dCBjaGFsbGVuZ2UgaW4gYSBjdXN0b20gYXV0aCBmbG93XG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzZXItcG9vbC1sYW1iZGEtZGVmaW5lLWF1dGgtY2hhbGxlbmdlLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGSU5FX0FVVEhfQ0hBTExFTkdFID0gbmV3IFVzZXJQb29sT3BlcmF0aW9uKCdkZWZpbmVBdXRoQ2hhbGxlbmdlJyk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGxvZ2dpbmcgZm9yIGN1c3RvbSBhbmFseXRpY3NcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLWxhbWJkYS1wb3N0LWF1dGhlbnRpY2F0aW9uLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUE9TVF9BVVRIRU5USUNBVElPTiA9IG5ldyBVc2VyUG9vbE9wZXJhdGlvbigncG9zdEF1dGhlbnRpY2F0aW9uJyk7XG5cbiAgLyoqXG4gICAqIEN1c3RvbSB3ZWxjb21lIG1lc3NhZ2VzIG9yIGV2ZW50IGxvZ2dpbmcgZm9yIGN1c3RvbSBhbmFseXRpY3NcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLWxhbWJkYS1wb3N0LWNvbmZpcm1hdGlvbi5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBPU1RfQ09ORklSTUFUSU9OID0gbmV3IFVzZXJQb29sT3BlcmF0aW9uKCdwb3N0Q29uZmlybWF0aW9uJyk7XG5cbiAgLyoqXG4gICAqIEN1c3RvbSB2YWxpZGF0aW9uIHRvIGFjY2VwdCBvciBkZW55IHRoZSBzaWduLWluIHJlcXVlc3RcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLWxhbWJkYS1wcmUtYXV0aGVudGljYXRpb24uaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBQUkVfQVVUSEVOVElDQVRJT04gPSBuZXcgVXNlclBvb2xPcGVyYXRpb24oJ3ByZUF1dGhlbnRpY2F0aW9uJyk7XG5cbiAgLyoqXG4gICAqIEN1c3RvbSB2YWxpZGF0aW9uIHRvIGFjY2VwdCBvciBkZW55IHRoZSBzaWduLXVwIHJlcXVlc3RcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLWxhbWJkYS1wcmUtc2lnbi11cC5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBSRV9TSUdOX1VQID0gbmV3IFVzZXJQb29sT3BlcmF0aW9uKCdwcmVTaWduVXAnKTtcblxuICAvKipcbiAgICogQWRkIG9yIHJlbW92ZSBhdHRyaWJ1dGVzIGluIElkIHRva2Vuc1xuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS91c2VyLXBvb2wtbGFtYmRhLXByZS10b2tlbi1nZW5lcmF0aW9uLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFJFX1RPS0VOX0dFTkVSQVRJT04gPSBuZXcgVXNlclBvb2xPcGVyYXRpb24oJ3ByZVRva2VuR2VuZXJhdGlvbicpO1xuXG4gIC8qKlxuICAgKiBNaWdyYXRlIGEgdXNlciBmcm9tIGFuIGV4aXN0aW5nIHVzZXIgZGlyZWN0b3J5IHRvIHVzZXIgcG9vbHNcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLWxhbWJkYS1taWdyYXRlLXVzZXIuaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBVU0VSX01JR1JBVElPTiA9IG5ldyBVc2VyUG9vbE9wZXJhdGlvbigndXNlck1pZ3JhdGlvbicpO1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIGEgcmVzcG9uc2UgaXMgY29ycmVjdCBpbiBhIGN1c3RvbSBhdXRoIGZsb3dcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLWxhbWJkYS12ZXJpZnktYXV0aC1jaGFsbGVuZ2UtcmVzcG9uc2UuaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWRVJJRllfQVVUSF9DSEFMTEVOR0VfUkVTUE9OU0UgPSBuZXcgVXNlclBvb2xPcGVyYXRpb24oJ3ZlcmlmeUF1dGhDaGFsbGVuZ2VSZXNwb25zZScpO1xuXG4gIC8qKlxuICAgKiBBbWF6b24gQ29nbml0byBpbnZva2VzIHRoaXMgdHJpZ2dlciB0byBzZW5kIGVtYWlsIG5vdGlmaWNhdGlvbnMgdG8gdXNlcnMuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzZXItcG9vbC1sYW1iZGEtY3VzdG9tLWVtYWlsLXNlbmRlci5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENVU1RPTV9FTUFJTF9TRU5ERVIgPSBuZXcgVXNlclBvb2xPcGVyYXRpb24oJ2N1c3RvbUVtYWlsU2VuZGVyJyk7XG5cbiAgLyoqXG4gICAqIEFtYXpvbiBDb2duaXRvIGludm9rZXMgdGhpcyB0cmlnZ2VyIHRvIHNlbmQgZW1haWwgbm90aWZpY2F0aW9ucyB0byB1c2Vycy5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLWxhbWJkYS1jdXN0b20tc21zLXNlbmRlci5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENVU1RPTV9TTVNfU0VOREVSID0gbmV3IFVzZXJQb29sT3BlcmF0aW9uKCdjdXN0b21TbXNTZW5kZXInKTtcblxuICAvKiogQSBjdXN0b20gdXNlciBwb29sIG9wZXJhdGlvbiAqL1xuICBwdWJsaWMgc3RhdGljIG9mKG5hbWU6IHN0cmluZyk6IFVzZXJQb29sT3BlcmF0aW9uIHtcbiAgICBjb25zdCBsb3dlckNhbWVsQ2FzZSA9IG5hbWUuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpO1xuICAgIHJldHVybiBuZXcgVXNlclBvb2xPcGVyYXRpb24obG93ZXJDYW1lbENhc2UpO1xuICB9XG5cbiAgLyoqIFRoZSBrZXkgdG8gdXNlIGluIGBDZm5Vc2VyUG9vbC5MYW1iZGFDb25maWdQcm9wZXJ0eWAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG9wZXJhdGlvbk5hbWU6IHN0cmluZztcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKG9wZXJhdGlvbk5hbWU6IHN0cmluZykge1xuICAgIHRoaXMub3BlcmF0aW9uTmFtZSA9IG9wZXJhdGlvbk5hbWU7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgZW1haWwgdmVyaWZpY2F0aW9uIHN0eWxlXG4gKi9cbmV4cG9ydCBlbnVtIFZlcmlmaWNhdGlvbkVtYWlsU3R5bGUge1xuICAvKiogVmVyaWZ5IGVtYWlsIHZpYSBjb2RlICovXG4gIENPREUgPSAnQ09ORklSTV9XSVRIX0NPREUnLFxuICAvKiogVmVyaWZ5IGVtYWlsIHZpYSBsaW5rICovXG4gIExJTksgPSAnQ09ORklSTV9XSVRIX0xJTksnLFxufVxuXG4vKipcbiAqIFVzZXIgcG9vbCBjb25maWd1cmF0aW9uIGZvciB1c2VyIHNlbGYgc2lnbiB1cC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVc2VyVmVyaWZpY2F0aW9uQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBlbWFpbCBzdWJqZWN0IHRlbXBsYXRlIGZvciB0aGUgdmVyaWZpY2F0aW9uIGVtYWlsIHNlbnQgdG8gdGhlIHVzZXIgdXBvbiBzaWduIHVwLlxuICAgKiBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NvZ25pdG8tdXNlci1wb29sLXNldHRpbmdzLW1lc3NhZ2UtdGVtcGxhdGVzLmh0bWwgdG9cbiAgICogbGVhcm4gbW9yZSBhYm91dCBtZXNzYWdlIHRlbXBsYXRlcy5cbiAgICogQGRlZmF1bHQgJ1ZlcmlmeSB5b3VyIG5ldyBhY2NvdW50J1xuICAgKi9cbiAgcmVhZG9ubHkgZW1haWxTdWJqZWN0Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZW1haWwgYm9keSB0ZW1wbGF0ZSBmb3IgdGhlIHZlcmlmaWNhdGlvbiBlbWFpbCBzZW50IHRvIHRoZSB1c2VyIHVwb24gc2lnbiB1cC5cbiAgICogU2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jb2duaXRvLXVzZXItcG9vbC1zZXR0aW5ncy1tZXNzYWdlLXRlbXBsYXRlcy5odG1sIHRvXG4gICAqIGxlYXJuIG1vcmUgYWJvdXQgbWVzc2FnZSB0ZW1wbGF0ZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gJ1RoZSB2ZXJpZmljYXRpb24gY29kZSB0byB5b3VyIG5ldyBhY2NvdW50IGlzIHsjIyMjfScgaWYgVmVyaWZpY2F0aW9uRW1haWxTdHlsZS5DT0RFIGlzIGNob3NlbixcbiAgICogJ1ZlcmlmeSB5b3VyIGFjY291bnQgYnkgY2xpY2tpbmcgb24geyMjVmVyaWZ5IEVtYWlsIyN9JyBpZiBWZXJpZmljYXRpb25FbWFpbFN0eWxlLkxJTksgaXMgY2hvc2VuLlxuICAgKi9cbiAgcmVhZG9ubHkgZW1haWxCb2R5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBFbWFpbHMgY2FuIGJlIHZlcmlmaWVkIGVpdGhlciB1c2luZyBhIGNvZGUgb3IgYSBsaW5rLlxuICAgKiBMZWFybiBtb3JlIGF0IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jb2duaXRvLXVzZXItcG9vbC1zZXR0aW5ncy1lbWFpbC12ZXJpZmljYXRpb24tbWVzc2FnZS1jdXN0b21pemF0aW9uLmh0bWxcbiAgICogQGRlZmF1bHQgVmVyaWZpY2F0aW9uRW1haWxTdHlsZS5DT0RFXG4gICAqL1xuICByZWFkb25seSBlbWFpbFN0eWxlPzogVmVyaWZpY2F0aW9uRW1haWxTdHlsZTtcblxuICAvKipcbiAgICogVGhlIG1lc3NhZ2UgdGVtcGxhdGUgZm9yIHRoZSB2ZXJpZmljYXRpb24gU01TIHNlbnQgdG8gdGhlIHVzZXIgdXBvbiBzaWduIHVwLlxuICAgKiBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NvZ25pdG8tdXNlci1wb29sLXNldHRpbmdzLW1lc3NhZ2UtdGVtcGxhdGVzLmh0bWwgdG9cbiAgICogbGVhcm4gbW9yZSBhYm91dCBtZXNzYWdlIHRlbXBsYXRlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSAnVGhlIHZlcmlmaWNhdGlvbiBjb2RlIHRvIHlvdXIgbmV3IGFjY291bnQgaXMgeyMjIyN9JyBpZiBWZXJpZmljYXRpb25FbWFpbFN0eWxlLkNPREUgaXMgY2hvc2VuLFxuICAgKiBub3QgY29uZmlndXJlZCBpZiBWZXJpZmljYXRpb25FbWFpbFN0eWxlLkxJTksgaXMgY2hvc2VuXG4gICAqL1xuICByZWFkb25seSBzbXNNZXNzYWdlPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFVzZXIgcG9vbCBjb25maWd1cmF0aW9uIHdoZW4gYWRtaW5pc3RyYXRvcnMgc2lnbiB1c2VycyB1cC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVc2VySW52aXRhdGlvbkNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgdGVtcGxhdGUgdG8gdGhlIGVtYWlsIHN1YmplY3QgdGhhdCBpcyBzZW50IHRvIHRoZSB1c2VyIHdoZW4gYW4gYWRtaW5pc3RyYXRvciBzaWducyB0aGVtIHVwIHRvIHRoZSB1c2VyIHBvb2wuXG4gICAqIEBkZWZhdWx0ICdZb3VyIHRlbXBvcmFyeSBwYXNzd29yZCdcbiAgICovXG4gIHJlYWRvbmx5IGVtYWlsU3ViamVjdD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHRlbXBsYXRlIHRvIHRoZSBlbWFpbCBib2R5IHRoYXQgaXMgc2VudCB0byB0aGUgdXNlciB3aGVuIGFuIGFkbWluaXN0cmF0b3Igc2lnbnMgdGhlbSB1cCB0byB0aGUgdXNlciBwb29sLlxuICAgKiBAZGVmYXVsdCAnWW91ciB1c2VybmFtZSBpcyB7dXNlcm5hbWV9IGFuZCB0ZW1wb3JhcnkgcGFzc3dvcmQgaXMgeyMjIyN9LidcbiAgICovXG4gIHJlYWRvbmx5IGVtYWlsQm9keT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHRlbXBsYXRlIHRvIHRoZSBTTVMgbWVzc2FnZSB0aGF0IGlzIHNlbnQgdG8gdGhlIHVzZXIgd2hlbiBhbiBhZG1pbmlzdHJhdG9yIHNpZ25zIHRoZW0gdXAgdG8gdGhlIHVzZXIgcG9vbC5cbiAgICogQGRlZmF1bHQgJ1lvdXIgdXNlcm5hbWUgaXMge3VzZXJuYW1lfSBhbmQgdGVtcG9yYXJ5IHBhc3N3b3JkIGlzIHsjIyMjfSdcbiAgICovXG4gIHJlYWRvbmx5IHNtc01lc3NhZ2U/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIGRpZmZlcmVudCB3YXlzIGluIHdoaWNoIGEgdXNlciBwb29sJ3MgTUZBIGVuZm9yY2VtZW50IGNhbiBiZSBjb25maWd1cmVkLlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLXNldHRpbmdzLW1mYS5odG1sXG4gKi9cbmV4cG9ydCBlbnVtIE1mYSB7XG4gIC8qKiBVc2VycyBhcmUgbm90IHJlcXVpcmVkIHRvIHVzZSBNRkEgZm9yIHNpZ24gaW4sIGFuZCBjYW5ub3QgY29uZmlndXJlIG9uZS4gKi9cbiAgT0ZGID0gJ09GRicsXG4gIC8qKiBVc2VycyBhcmUgbm90IHJlcXVpcmVkIHRvIHVzZSBNRkEgZm9yIHNpZ24gaW4sIGJ1dCBjYW4gY29uZmlndXJlIG9uZSBpZiB0aGV5IHNvIGNob29zZSB0by4gKi9cbiAgT1BUSU9OQUwgPSAnT1BUSU9OQUwnLFxuICAvKiogVXNlcnMgYXJlIHJlcXVpcmVkIHRvIGNvbmZpZ3VyZSBhbiBNRkEsIGFuZCBoYXZlIHRvIHVzZSBpdCB0byBzaWduIGluLiAqL1xuICBSRVFVSVJFRCA9ICdPTicsXG59XG5cbi8qKlxuICogVGhlIGRpZmZlcmVudCB3YXlzIGluIHdoaWNoIGEgdXNlciBwb29sIGNhbiBvYnRhaW4gdGhlaXIgTUZBIHRva2VuIGZvciBzaWduIGluLlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLXNldHRpbmdzLW1mYS5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWZhU2Vjb25kRmFjdG9yIHtcbiAgLyoqXG4gICAqIFRoZSBNRkEgdG9rZW4gaXMgc2VudCB0byB0aGUgdXNlciB2aWEgU01TIHRvIHRoZWlyIHZlcmlmaWVkIHBob25lIG51bWJlcnNcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLXNldHRpbmdzLW1mYS1zbXMtdGV4dC1tZXNzYWdlLmh0bWxcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgc21zOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgTUZBIHRva2VuIGlzIGEgdGltZS1iYXNlZCBvbmUgdGltZSBwYXNzd29yZCB0aGF0IGlzIGdlbmVyYXRlZCBieSBhIGhhcmR3YXJlIG9yIHNvZnR3YXJlIHRva2VuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzZXItcG9vbC1zZXR0aW5ncy1tZmEtdG90cC5odG1sXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBvdHA6IGJvb2xlYW47XG59XG5cbi8qKlxuICogUGFzc3dvcmQgcG9saWN5IGZvciBVc2VyIFBvb2xzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFBhc3N3b3JkUG9saWN5IHtcbiAgLyoqXG4gICAqIFRoZSBsZW5ndGggb2YgdGltZSB0aGUgdGVtcG9yYXJ5IHBhc3N3b3JkIGdlbmVyYXRlZCBieSBhbiBhZG1pbiBpcyB2YWxpZC5cbiAgICogVGhpcyBtdXN0IGJlIHByb3ZpZGVkIGFzIHdob2xlIGRheXMsIGxpa2UgRHVyYXRpb24uZGF5cygzKSBvciBEdXJhdGlvbi5ob3Vycyg0OCkuXG4gICAqIEZyYWN0aW9uYWwgZGF5cywgc3VjaCBhcyBEdXJhdGlvbi5ob3VycygyMCksIHdpbGwgZ2VuZXJhdGUgYW4gZXJyb3IuXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLmRheXMoNylcbiAgICovXG4gIHJlYWRvbmx5IHRlbXBQYXNzd29yZFZhbGlkaXR5PzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIE1pbmltdW0gbGVuZ3RoIHJlcXVpcmVkIGZvciBhIHVzZXIncyBwYXNzd29yZC5cbiAgICogQGRlZmF1bHQgOFxuICAgKi9cbiAgcmVhZG9ubHkgbWluTGVuZ3RoPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSB1c2VyIGlzIHJlcXVpcmVkIHRvIGhhdmUgbG93ZXJjYXNlIGNoYXJhY3RlcnMgaW4gdGhlaXIgcGFzc3dvcmQuXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHJlcXVpcmVMb3dlcmNhc2U/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSB1c2VyIGlzIHJlcXVpcmVkIHRvIGhhdmUgdXBwZXJjYXNlIGNoYXJhY3RlcnMgaW4gdGhlaXIgcGFzc3dvcmQuXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHJlcXVpcmVVcHBlcmNhc2U/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSB1c2VyIGlzIHJlcXVpcmVkIHRvIGhhdmUgZGlnaXRzIGluIHRoZWlyIHBhc3N3b3JkLlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSByZXF1aXJlRGlnaXRzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgdXNlciBpcyByZXF1aXJlZCB0byBoYXZlIHN5bWJvbHMgaW4gdGhlaXIgcGFzc3dvcmQuXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHJlcXVpcmVTeW1ib2xzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBFbWFpbCBzZXR0aW5ncyBmb3IgdGhlIHVzZXIgcG9vbC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbWFpbFNldHRpbmdzIHtcbiAgLyoqXG4gICAqIFRoZSAnZnJvbScgYWRkcmVzcyBvbiB0aGUgZW1haWxzIHJlY2VpdmVkIGJ5IHRoZSB1c2VyLlxuICAgKiBAZGVmYXVsdCBub3JlcGx5QHZlcmlmaWNhdGlvbmVtYWlsLmNvbVxuICAgKi9cbiAgcmVhZG9ubHkgZnJvbT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlICdyZXBseVRvJyBhZGRyZXNzIG9uIHRoZSBlbWFpbHMgcmVjZWl2ZWQgYnkgdGhlIHVzZXIgYXMgZGVmaW5lZCBieSBJRVRGIFJGQy01MzIyLlxuICAgKiBXaGVuIHNldCwgbW9zdCBlbWFpbCBjbGllbnRzIHJlY29nbml6ZSB0byBjaGFuZ2UgJ3RvJyBsaW5lIHRvIHRoaXMgYWRkcmVzcyB3aGVuIGEgcmVwbHkgaXMgZHJhZnRlZC5cbiAgICogQGRlZmF1bHQgLSBOb3Qgc2V0LlxuICAgKi9cbiAgcmVhZG9ubHkgcmVwbHlUbz86IHN0cmluZztcbn1cblxuLyoqXG4gKiBIb3cgd2lsbCBhIHVzZXIgYmUgYWJsZSB0byByZWNvdmVyIHRoZWlyIGFjY291bnQ/XG4gKlxuICogV2hlbiBhIHVzZXIgZm9yZ2V0cyB0aGVpciBwYXNzd29yZCwgdGhleSBjYW4gaGF2ZSBhIGNvZGUgc2VudCB0byB0aGVpciB2ZXJpZmllZCBlbWFpbCBvciB2ZXJpZmllZCBwaG9uZSB0byByZWNvdmVyIHRoZWlyIGFjY291bnQuXG4gKiBZb3UgY2FuIGNob29zZSB0aGUgcHJlZmVycmVkIHdheSB0byBzZW5kIGNvZGVzIGJlbG93LlxuICogV2UgcmVjb21tZW5kIG5vdCBhbGxvd2luZyBwaG9uZSB0byBiZSB1c2VkIGZvciBib3RoIHBhc3N3b3JkIHJlc2V0cyBhbmQgbXVsdGktZmFjdG9yIGF1dGhlbnRpY2F0aW9uIChNRkEpLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2hvdy10by1yZWNvdmVyLWEtdXNlci1hY2NvdW50Lmh0bWxcbiAqL1xuZXhwb3J0IGVudW0gQWNjb3VudFJlY292ZXJ5IHtcbiAgLyoqXG4gICAqIEVtYWlsIGlmIGF2YWlsYWJsZSwgb3RoZXJ3aXNlIHBob25lLCBidXQgZG9u4oCZdCBhbGxvdyBhIHVzZXIgdG8gcmVzZXQgdGhlaXIgcGFzc3dvcmQgdmlhIHBob25lIGlmIHRoZXkgYXJlIGFsc28gdXNpbmcgaXQgZm9yIE1GQVxuICAgKi9cbiAgRU1BSUxfQU5EX1BIT05FX1dJVEhPVVRfTUZBLFxuXG4gIC8qKlxuICAgKiBQaG9uZSBpZiBhdmFpbGFibGUsIG90aGVyd2lzZSBlbWFpbCwgYnV0IGRvbuKAmXQgYWxsb3cgYSB1c2VyIHRvIHJlc2V0IHRoZWlyIHBhc3N3b3JkIHZpYSBwaG9uZSBpZiB0aGV5IGFyZSBhbHNvIHVzaW5nIGl0IGZvciBNRkFcbiAgICovXG4gIFBIT05FX1dJVEhPVVRfTUZBX0FORF9FTUFJTCxcblxuICAvKipcbiAgICogRW1haWwgb25seVxuICAgKi9cbiAgRU1BSUxfT05MWSxcblxuICAvKipcbiAgICogUGhvbmUgb25seSwgYnV0IGRvbuKAmXQgYWxsb3cgYSB1c2VyIHRvIHJlc2V0IHRoZWlyIHBhc3N3b3JkIHZpYSBwaG9uZSBpZiB0aGV5IGFyZSBhbHNvIHVzaW5nIGl0IGZvciBNRkFcbiAgICovXG4gIFBIT05FX09OTFlfV0lUSE9VVF9NRkEsXG5cbiAgLyoqXG4gICAqIChOb3QgUmVjb21tZW5kZWQpIFBob25lIGlmIGF2YWlsYWJsZSwgb3RoZXJ3aXNlIGVtYWlsLCBhbmQgZG8gYWxsb3cgYSB1c2VyIHRvIHJlc2V0IHRoZWlyIHBhc3N3b3JkIHZpYSBwaG9uZSBpZiB0aGV5IGFyZSBhbHNvIHVzaW5nIGl0IGZvciBNRkEuXG4gICAqL1xuICBQSE9ORV9BTkRfRU1BSUwsXG5cbiAgLyoqXG4gICAqIE5vbmUg4oCTIHVzZXJzIHdpbGwgaGF2ZSB0byBjb250YWN0IGFuIGFkbWluaXN0cmF0b3IgdG8gcmVzZXQgdGhlaXIgcGFzc3dvcmRzXG4gICAqL1xuICBOT05FLFxufVxuXG4vKipcbiAqIERldmljZSB0cmFja2luZyBzZXR0aW5nc1xuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvYW1hem9uLWNvZ25pdG8tdXNlci1wb29scy1kZXZpY2UtdHJhY2tpbmcuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIERldmljZVRyYWNraW5nIHtcbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIGEgY2hhbGxlbmdlIGlzIHJlcXVpcmVkIG9uIGEgbmV3IGRldmljZS4gT25seSBhcHBsaWNhYmxlIHRvIGEgbmV3IGRldmljZS5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvYW1hem9uLWNvZ25pdG8tdXNlci1wb29scy1kZXZpY2UtdHJhY2tpbmcuaHRtbFxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgY2hhbGxlbmdlUmVxdWlyZWRPbk5ld0RldmljZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgdHJ1ZSwgYSBkZXZpY2UgaXMgb25seSByZW1lbWJlcmVkIG9uIHVzZXIgcHJvbXB0LlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9hbWF6b24tY29nbml0by11c2VyLXBvb2xzLWRldmljZS10cmFja2luZy5odG1sXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBkZXZpY2VPbmx5UmVtZW1iZXJlZE9uVXNlclByb21wdDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUaGUgZGlmZmVyZW50IHdheXMgaW4gd2hpY2ggYSB1c2VyIHBvb2wncyBBZHZhbmNlZCBTZWN1cml0eSBNb2RlIGNhbiBiZSBjb25maWd1cmVkLlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1jb2duaXRvLXVzZXJwb29sLXVzZXJwb29sYWRkb25zLmh0bWwjY2ZuLWNvZ25pdG8tdXNlcnBvb2wtdXNlcnBvb2xhZGRvbnMtYWR2YW5jZWRzZWN1cml0eW1vZGVcbiAqL1xuZXhwb3J0IGVudW0gQWR2YW5jZWRTZWN1cml0eU1vZGUge1xuICAvKiogRW5hYmxlIGFkdmFuY2VkIHNlY3VyaXR5IG1vZGUgKi9cbiAgRU5GT1JDRUQgPSAnRU5GT1JDRUQnLFxuICAvKiogZ2F0aGVyIG1ldHJpY3Mgb24gZGV0ZWN0ZWQgcmlza3Mgd2l0aG91dCB0YWtpbmcgYWN0aW9uLiBNZXRyaWNzIGFyZSBwdWJsaXNoZWQgdG8gQW1hem9uIENsb3VkV2F0Y2ggKi9cbiAgQVVESVQgPSAnQVVESVQnLFxuICAvKiogQWR2YW5jZWQgc2VjdXJpdHkgbW9kZSBpcyBkaXNhYmxlZCAqL1xuICBPRkYgPSAnT0ZGJ1xufVxuXG4vKipcbiAqIFByb3BzIGZvciB0aGUgVXNlclBvb2wgY29uc3RydWN0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXNlclBvb2xQcm9wcyB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSB1c2VyIHBvb2xcbiAgICpcbiAgICogQGRlZmF1bHQgLSBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBuYW1lIGJ5IENsb3VkRm9ybWF0aW9uIGF0IGRlcGxveSB0aW1lXG4gICAqL1xuICByZWFkb25seSB1c2VyUG9vbE5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgc2VsZiBzaWduIHVwIHNob3VsZCBiZSBlbmFibGVkLiBUaGlzIGNhbiBiZSBmdXJ0aGVyIGNvbmZpZ3VyZWQgdmlhIHRoZSBgc2VsZlNpZ25VcGAgcHJvcGVydHkuXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBzZWxmU2lnblVwRW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gYXJvdW5kIHVzZXJzIHNpZ25pbmcgdGhlbXNlbHZlcyB1cCB0byB0aGUgdXNlciBwb29sLlxuICAgKiBFbmFibGUgb3IgZGlzYWJsZSBzZWxmIHNpZ24tdXAgdmlhIHRoZSBgc2VsZlNpZ25VcEVuYWJsZWRgIHByb3BlcnR5LlxuICAgKiBAZGVmYXVsdCAtIHNlZSBkZWZhdWx0cyBpbiBVc2VyVmVyaWZpY2F0aW9uQ29uZmlnXG4gICAqL1xuICByZWFkb25seSB1c2VyVmVyaWZpY2F0aW9uPzogVXNlclZlcmlmaWNhdGlvbkNvbmZpZztcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBhcm91bmQgYWRtaW5zIHNpZ25pbmcgdXAgdXNlcnMgaW50byBhIHVzZXIgcG9vbC5cbiAgICogQGRlZmF1bHQgLSBzZWUgZGVmYXVsdHMgaW4gVXNlckludml0YXRpb25Db25maWdcbiAgICovXG4gIHJlYWRvbmx5IHVzZXJJbnZpdGF0aW9uPzogVXNlckludml0YXRpb25Db25maWc7XG5cbiAgLyoqXG4gICAqIFRoZSBJQU0gcm9sZSB0aGF0IENvZ25pdG8gd2lsbCBhc3N1bWUgd2hpbGUgc2VuZGluZyBTTVMgbWVzc2FnZXMuXG4gICAqIEBkZWZhdWx0IC0gYSBuZXcgSUFNIHJvbGUgaXMgY3JlYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgc21zUm9sZT86IElSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgJ0V4dGVybmFsSWQnIHRoYXQgQ29nbml0byBzZXJ2aWNlIG11c3QgdXNpbmcgd2hlbiBhc3N1bWluZyB0aGUgYHNtc1JvbGVgLCBpZiB0aGUgcm9sZSBpcyByZXN0cmljdGVkIHdpdGggYW4gJ3N0czpFeHRlcm5hbElkJyBjb25kaXRpb25hbC5cbiAgICogTGVhcm4gbW9yZSBhYm91dCBFeHRlcm5hbElkIGhlcmUgLSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvaWRfcm9sZXNfY3JlYXRlX2Zvci11c2VyX2V4dGVybmFsaWQuaHRtbFxuICAgKlxuICAgKiBUaGlzIHByb3BlcnR5IHdpbGwgYmUgaWdub3JlZCBpZiBgc21zUm9sZWAgaXMgbm90IHNwZWNpZmllZC5cbiAgICogQGRlZmF1bHQgLSBObyBleHRlcm5hbCBpZCB3aWxsIGJlIGNvbmZpZ3VyZWRcbiAgICovXG4gIHJlYWRvbmx5IHNtc1JvbGVFeHRlcm5hbElkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVnaW9uIHRvIGludGVncmF0ZSB3aXRoIFNOUyB0byBzZW5kIFNNUyBtZXNzYWdlc1xuICAgKlxuICAgKiBUaGlzIHByb3BlcnR5IHdpbGwgZG8gbm90aGluZyBpZiBTTVMgY29uZmlndXJhdGlvbiBpcyBub3QgY29uZmlndXJlZFxuICAgKiBAZGVmYXVsdCAtIFRoZSBzYW1lIHJlZ2lvbiBhcyB0aGUgdXNlciBwb29sLCB3aXRoIGEgZmV3IGV4Y2VwdGlvbnMgLSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLXNtcy1zZXR0aW5ncy5odG1sI3VzZXItcG9vbC1zbXMtc2V0dGluZ3MtZmlyc3QtdGltZVxuICAgKi9cbiAgcmVhZG9ubHkgc25zUmVnaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTZXR0aW5nIHRoaXMgd291bGQgZXhwbGljaXRseSBlbmFibGUgb3IgZGlzYWJsZSBTTVMgcm9sZSBjcmVhdGlvbi5cbiAgICogV2hlbiBsZWZ0IHVuc3BlY2lmaWVkLCBDREsgd2lsbCBkZXRlcm1pbmUgYmFzZWQgb24gb3RoZXIgcHJvcGVydGllcyBpZiBhIHJvbGUgaXMgbmVlZGVkIG9yIG5vdC5cbiAgICogQGRlZmF1bHQgLSBDREsgd2lsbCBkZXRlcm1pbmUgYmFzZWQgb24gb3RoZXIgcHJvcGVydGllcyBvZiB0aGUgdXNlciBwb29sIGlmIGFuIFNNUyByb2xlIHNob3VsZCBiZSBjcmVhdGVkIG9yIG5vdC5cbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZVNtc1JvbGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBNZXRob2RzIGluIHdoaWNoIGEgdXNlciByZWdpc3RlcnMgb3Igc2lnbnMgaW4gdG8gYSB1c2VyIHBvb2wuXG4gICAqIEFsbG93cyBlaXRoZXIgdXNlcm5hbWUgd2l0aCBhbGlhc2VzIE9SIHNpZ24gaW4gd2l0aCBlbWFpbCwgcGhvbmUsIG9yIGJvdGguXG4gICAqXG4gICAqIFJlYWQgdGhlIHNlY3Rpb25zIG9uIHVzZXJuYW1lcyBhbmQgYWxpYXNlcyB0byBsZWFybiBtb3JlIC1cbiAgICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzZXItcG9vbC1zZXR0aW5ncy1hdHRyaWJ1dGVzLmh0bWxcbiAgICpcbiAgICogVG8gbWF0Y2ggd2l0aCAnT3B0aW9uIDEnIGluIHRoZSBhYm92ZSBsaW5rLCB3aXRoIGEgdmVyaWZpZWQgZW1haWwsIHRoaXMgcHJvcGVydHkgc2hvdWxkIGJlIHNldCB0b1xuICAgKiBgeyB1c2VybmFtZTogdHJ1ZSwgZW1haWw6IHRydWUgfWAuIFRvIG1hdGNoIHdpdGggJ09wdGlvbiAyJyBpbiB0aGUgYWJvdmUgbGluayB3aXRoIGJvdGggYSB2ZXJpZmllZCBlbWFpbCBhbmQgcGhvbmVcbiAgICogbnVtYmVyLCB0aGlzIHByb3BlcnR5IHNob3VsZCBiZSBzZXQgdG8gYHsgZW1haWw6IHRydWUsIHBob25lOiB0cnVlIH1gLlxuICAgKlxuICAgKiBAZGVmYXVsdCB7IHVzZXJuYW1lOiB0cnVlIH1cbiAgICovXG4gIHJlYWRvbmx5IHNpZ25JbkFsaWFzZXM/OiBTaWduSW5BbGlhc2VzO1xuXG4gIC8qKlxuICAgKiBBdHRyaWJ1dGVzIHdoaWNoIENvZ25pdG8gd2lsbCBsb29rIHRvIHZlcmlmeSBhdXRvbWF0aWNhbGx5IHVwb24gdXNlciBzaWduIHVwLlxuICAgKiBFTUFJTCBhbmQgUEhPTkUgYXJlIHRoZSBvbmx5IGF2YWlsYWJsZSBvcHRpb25zLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIElmIGBzaWduSW5BbGlhc2AgaW5jbHVkZXMgZW1haWwgYW5kL29yIHBob25lLCB0aGV5IHdpbGwgYmUgaW5jbHVkZWQgaW4gYGF1dG9WZXJpZmllZEF0dHJpYnV0ZXNgIGJ5IGRlZmF1bHQuXG4gICAqIElmIGFic2VudCwgbm8gYXR0cmlidXRlcyB3aWxsIGJlIGF1dG8tdmVyaWZpZWQuXG4gICAqL1xuICByZWFkb25seSBhdXRvVmVyaWZ5PzogQXV0b1ZlcmlmaWVkQXR0cnM7XG5cbiAgLyoqXG4gICAqIEF0dHJpYnV0ZXMgd2hpY2ggQ29nbml0byB3aWxsIGxvb2sgdG8gaGFuZGxlIGNoYW5nZXMgdG8gdGhlIHZhbHVlIG9mIHlvdXIgdXNlcnMnIGVtYWlsIGFkZHJlc3MgYW5kIHBob25lIG51bWJlciBhdHRyaWJ1dGVzLlxuICAgKiBFTUFJTCBhbmQgUEhPTkUgYXJlIHRoZSBvbmx5IGF2YWlsYWJsZSBvcHRpb25zLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vdGhpbmcgaXMga2VwdC5cbiAgICovXG4gIHJlYWRvbmx5IGtlZXBPcmlnaW5hbD86IEtlZXBPcmlnaW5hbEF0dHJzO1xuXG4gIC8qKlxuICAgKiBUaGUgc2V0IG9mIGF0dHJpYnV0ZXMgdGhhdCBhcmUgcmVxdWlyZWQgZm9yIGV2ZXJ5IHVzZXIgaW4gdGhlIHVzZXIgcG9vbC5cbiAgICogUmVhZCBtb3JlIG9uIGF0dHJpYnV0ZXMgaGVyZSAtIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS91c2VyLXBvb2wtc2V0dGluZ3MtYXR0cmlidXRlcy5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQWxsIHN0YW5kYXJkIGF0dHJpYnV0ZXMgYXJlIG9wdGlvbmFsIGFuZCBtdXRhYmxlLlxuICAgKi9cbiAgcmVhZG9ubHkgc3RhbmRhcmRBdHRyaWJ1dGVzPzogU3RhbmRhcmRBdHRyaWJ1dGVzO1xuXG4gIC8qKlxuICAgKiBEZWZpbmUgYSBzZXQgb2YgY3VzdG9tIGF0dHJpYnV0ZXMgdGhhdCBjYW4gYmUgY29uZmlndXJlZCBmb3IgZWFjaCB1c2VyIGluIHRoZSB1c2VyIHBvb2wuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gY3VzdG9tIGF0dHJpYnV0ZXMuXG4gICAqL1xuICByZWFkb25seSBjdXN0b21BdHRyaWJ1dGVzPzogeyBba2V5OiBzdHJpbmddOiBJQ3VzdG9tQXR0cmlidXRlIH07XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB3aGV0aGVyIHVzZXJzIG9mIHRoaXMgdXNlciBwb29sIGNhbiBvciBhcmUgcmVxdWlyZWQgdXNlIE1GQSB0byBzaWduIGluLlxuICAgKlxuICAgKiBAZGVmYXVsdCBNZmEuT0ZGXG4gICAqL1xuICByZWFkb25seSBtZmE/OiBNZmE7XG5cbiAgLyoqXG4gICAqIFRoZSBTTVMgbWVzc2FnZSB0ZW1wbGF0ZSBzZW50IGR1cmluZyBNRkEgdmVyaWZpY2F0aW9uLlxuICAgKiBVc2UgJ3sjIyMjfScgaW4gdGhlIHRlbXBsYXRlIHdoZXJlIENvZ25pdG8gc2hvdWxkIGluc2VydCB0aGUgdmVyaWZpY2F0aW9uIGNvZGUuXG4gICAqIEBkZWZhdWx0ICdZb3VyIGF1dGhlbnRpY2F0aW9uIGNvZGUgaXMgeyMjIyN9LidcbiAgICovXG4gIHJlYWRvbmx5IG1mYU1lc3NhZ2U/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgTUZBIHR5cGVzIHRoYXQgdXNlcnMgY2FuIHVzZSBpbiB0aGlzIHVzZXIgcG9vbC4gSWdub3JlZCBpZiBgbWZhYCBpcyBzZXQgdG8gYE9GRmAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0geyBzbXM6IHRydWUsIG90cDogZmFsc2UgfSwgaWYgYG1mYWAgaXMgc2V0IHRvIGBPUFRJT05BTGAgb3IgYFJFUVVJUkVEYC5cbiAgICogeyBzbXM6IGZhbHNlLCBvdHA6IGZhbHNlIH0sIG90aGVyd2lzZVxuICAgKi9cbiAgcmVhZG9ubHkgbWZhU2Vjb25kRmFjdG9yPzogTWZhU2Vjb25kRmFjdG9yO1xuXG4gIC8qKlxuICAgKiBQYXNzd29yZCBwb2xpY3kgZm9yIHRoaXMgdXNlciBwb29sLlxuICAgKiBAZGVmYXVsdCAtIHNlZSBkZWZhdWx0cyBvbiBlYWNoIHByb3BlcnR5IG9mIFBhc3N3b3JkUG9saWN5LlxuICAgKi9cbiAgcmVhZG9ubHkgcGFzc3dvcmRQb2xpY3k/OiBQYXNzd29yZFBvbGljeTtcblxuICAvKipcbiAgICogRW1haWwgc2V0dGluZ3MgZm9yIGEgdXNlciBwb29sLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHNlZSBkZWZhdWx0cyBvbiBlYWNoIHByb3BlcnR5IG9mIEVtYWlsU2V0dGluZ3MuXG4gICAqIEBkZXByZWNhdGVkIFVzZSAnZW1haWwnIGluc3RlYWQuXG4gICAqL1xuICByZWFkb25seSBlbWFpbFNldHRpbmdzPzogRW1haWxTZXR0aW5ncztcblxuICAvKipcbiAgICogRW1haWwgc2V0dGluZ3MgZm9yIGEgdXNlciBwb29sLlxuICAgKiBAZGVmYXVsdCAtIGNvZ25pdG8gd2lsbCB1c2UgdGhlIGRlZmF1bHQgZW1haWwgY29uZmlndXJhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgZW1haWw/OiBVc2VyUG9vbEVtYWlsO1xuXG4gIC8qKlxuICAgKiBMYW1iZGEgZnVuY3Rpb25zIHRvIHVzZSBmb3Igc3VwcG9ydGVkIENvZ25pdG8gdHJpZ2dlcnMuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NvZ25pdG8tdXNlci1pZGVudGl0eS1wb29scy13b3JraW5nLXdpdGgtYXdzLWxhbWJkYS10cmlnZ2Vycy5odG1sXG4gICAqIEBkZWZhdWx0IC0gTm8gTGFtYmRhIHRyaWdnZXJzLlxuICAgKi9cbiAgcmVhZG9ubHkgbGFtYmRhVHJpZ2dlcnM/OiBVc2VyUG9vbFRyaWdnZXJzO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHNpZ24taW4gYWxpYXNlcyBzaG91bGQgYmUgZXZhbHVhdGVkIHdpdGggY2FzZSBzZW5zaXRpdml0eS5cbiAgICogRm9yIGV4YW1wbGUsIHdoZW4gdGhpcyBvcHRpb24gaXMgc2V0IHRvIGZhbHNlLCB1c2VycyB3aWxsIGJlIGFibGUgdG8gc2lnbiBpbiB1c2luZyBlaXRoZXIgYE15VXNlcm5hbWVgIG9yIGBteXVzZXJuYW1lYC5cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgc2lnbkluQ2FzZVNlbnNpdGl2ZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEhvdyB3aWxsIGEgdXNlciBiZSBhYmxlIHRvIHJlY292ZXIgdGhlaXIgYWNjb3VudD9cbiAgICpcbiAgICogQGRlZmF1bHQgQWNjb3VudFJlY292ZXJ5LlBIT05FX1dJVEhPVVRfTUZBX0FORF9FTUFJTFxuICAgKi9cbiAgcmVhZG9ubHkgYWNjb3VudFJlY292ZXJ5PzogQWNjb3VudFJlY292ZXJ5O1xuXG4gIC8qKlxuICAgKiBQb2xpY3kgdG8gYXBwbHkgd2hlbiB0aGUgdXNlciBwb29sIGlzIHJlbW92ZWQgZnJvbSB0aGUgc3RhY2tcbiAgICpcbiAgICogQGRlZmF1bHQgUmVtb3ZhbFBvbGljeS5SRVRBSU5cbiAgICovXG4gIHJlYWRvbmx5IHJlbW92YWxQb2xpY3k/OiBSZW1vdmFsUG9saWN5O1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdXNlciBwb29sIHNob3VsZCBoYXZlIGRlbGV0aW9uIHByb3RlY3Rpb24gZW5hYmxlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGRlbGV0aW9uUHJvdGVjdGlvbj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIERldmljZSB0cmFja2luZyBzZXR0aW5nc1xuICAgKiBAZGVmYXVsdCAtIHNlZSBkZWZhdWx0cyBvbiBlYWNoIHByb3BlcnR5IG9mIERldmljZVRyYWNraW5nLlxuICAgKi9cbiAgcmVhZG9ubHkgZGV2aWNlVHJhY2tpbmc/OiBEZXZpY2VUcmFja2luZztcblxuICAvKipcbiAgICogVGhpcyBrZXkgd2lsbCBiZSB1c2VkIHRvIGVuY3J5cHQgdGVtcG9yYXJ5IHBhc3N3b3JkcyBhbmQgYXV0aG9yaXphdGlvbiBjb2RlcyB0aGF0IEFtYXpvbiBDb2duaXRvIGdlbmVyYXRlcy5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLWxhbWJkYS1jdXN0b20tc2VuZGVyLXRyaWdnZXJzLmh0bWxcbiAgICogQGRlZmF1bHQgLSBubyBrZXkgSUQgY29uZmlndXJlZFxuICAgKi9cbiAgcmVhZG9ubHkgY3VzdG9tU2VuZGVyS21zS2V5PzogSUtleTtcblxuICAvKipcbiAgICogVGhlIHVzZXIgcG9vbCdzIEFkdmFuY2VkIFNlY3VyaXR5IE1vZGVcbiAgICogQGRlZmF1bHQgLSBubyB2YWx1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWR2YW5jZWRTZWN1cml0eU1vZGU/OiBBZHZhbmNlZFNlY3VyaXR5TW9kZTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQ29nbml0byBVc2VyUG9vbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyUG9vbCBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgcGh5c2ljYWwgSUQgb2YgdGhpcyB1c2VyIHBvb2wgcmVzb3VyY2VcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgdXNlclBvb2xJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoaXMgdXNlciBwb29sIHJlc291cmNlXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHVzZXJQb29sQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgaWRlbnRpdHkgcHJvdmlkZXJzIHJlZ2lzdGVyZWQgd2l0aCB0aGlzIHVzZXIgcG9vbC5cbiAgICovXG4gIHJlYWRvbmx5IGlkZW50aXR5UHJvdmlkZXJzOiBJVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyW107XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBhcHAgY2xpZW50IHRvIHRoaXMgdXNlciBwb29sLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS91c2VyLXBvb2wtc2V0dGluZ3MtY2xpZW50LWFwcHMuaHRtbFxuICAgKi9cbiAgYWRkQ2xpZW50KGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBVc2VyUG9vbENsaWVudE9wdGlvbnMpOiBVc2VyUG9vbENsaWVudDtcblxuICAvKipcbiAgICogQXNzb2NpYXRlIGEgZG9tYWluIHRvIHRoaXMgdXNlciBwb29sLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jb2duaXRvLXVzZXItcG9vbHMtYXNzaWduLWRvbWFpbi5odG1sXG4gICAqL1xuICBhZGREb21haW4oaWQ6IHN0cmluZywgb3B0aW9uczogVXNlclBvb2xEb21haW5PcHRpb25zKTogVXNlclBvb2xEb21haW47XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyByZXNvdXJjZSBzZXJ2ZXIgdG8gdGhpcyB1c2VyIHBvb2wuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NvZ25pdG8tdXNlci1wb29scy1yZXNvdXJjZS1zZXJ2ZXJzLmh0bWxcbiAgICovXG4gIGFkZFJlc291cmNlU2VydmVyKGlkOiBzdHJpbmcsIG9wdGlvbnM6IFVzZXJQb29sUmVzb3VyY2VTZXJ2ZXJPcHRpb25zKTogVXNlclBvb2xSZXNvdXJjZVNlcnZlcjtcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4gaWRlbnRpdHkgcHJvdmlkZXIgd2l0aCB0aGlzIHVzZXIgcG9vbC5cbiAgICovXG4gIHJlZ2lzdGVySWRlbnRpdHlQcm92aWRlcihwcm92aWRlcjogSVVzZXJQb29sSWRlbnRpdHlQcm92aWRlcik6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gSUFNIHBvbGljeSBzdGF0ZW1lbnQgYXNzb2NpYXRlZCB3aXRoIHRoaXMgdXNlciBwb29sIHRvIGFuXG4gICAqIElBTSBwcmluY2lwYWwncyBwb2xpY3kuXG4gICAqL1xuICBncmFudChncmFudGVlOiBJR3JhbnRhYmxlLCAuLi5hY3Rpb25zOiBzdHJpbmdbXSk6IEdyYW50O1xufVxuXG5hYnN0cmFjdCBjbGFzcyBVc2VyUG9vbEJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElVc2VyUG9vbCB7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSB1c2VyUG9vbElkOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSB1c2VyUG9vbEFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgaWRlbnRpdHlQcm92aWRlcnM6IElVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJbXSA9IFtdO1xuXG4gIHB1YmxpYyBhZGRDbGllbnQoaWQ6IHN0cmluZywgb3B0aW9ucz86IFVzZXJQb29sQ2xpZW50T3B0aW9ucyk6IFVzZXJQb29sQ2xpZW50IHtcbiAgICByZXR1cm4gbmV3IFVzZXJQb29sQ2xpZW50KHRoaXMsIGlkLCB7XG4gICAgICB1c2VyUG9vbDogdGhpcyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkRG9tYWluKGlkOiBzdHJpbmcsIG9wdGlvbnM6IFVzZXJQb29sRG9tYWluT3B0aW9ucyk6IFVzZXJQb29sRG9tYWluIHtcbiAgICByZXR1cm4gbmV3IFVzZXJQb29sRG9tYWluKHRoaXMsIGlkLCB7XG4gICAgICB1c2VyUG9vbDogdGhpcyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkUmVzb3VyY2VTZXJ2ZXIoaWQ6IHN0cmluZywgb3B0aW9uczogVXNlclBvb2xSZXNvdXJjZVNlcnZlck9wdGlvbnMpOiBVc2VyUG9vbFJlc291cmNlU2VydmVyIHtcbiAgICByZXR1cm4gbmV3IFVzZXJQb29sUmVzb3VyY2VTZXJ2ZXIodGhpcywgaWQsIHtcbiAgICAgIHVzZXJQb29sOiB0aGlzLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlcklkZW50aXR5UHJvdmlkZXIocHJvdmlkZXI6IElVc2VyUG9vbElkZW50aXR5UHJvdmlkZXIpIHtcbiAgICB0aGlzLmlkZW50aXR5UHJvdmlkZXJzLnB1c2gocHJvdmlkZXIpO1xuICB9XG5cbiAgcHVibGljIGdyYW50KGdyYW50ZWU6IElHcmFudGFibGUsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKTogR3JhbnQge1xuICAgIHJldHVybiBHcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlLFxuICAgICAgYWN0aW9ucyxcbiAgICAgIHJlc291cmNlQXJuczogW3RoaXMudXNlclBvb2xBcm5dLFxuICAgICAgc2NvcGU6IHRoaXMsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBDb2duaXRvIFVzZXIgUG9vbFxuICovXG5leHBvcnQgY2xhc3MgVXNlclBvb2wgZXh0ZW5kcyBVc2VyUG9vbEJhc2Uge1xuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIHVzZXIgcG9vbCBiYXNlZCBvbiBpdHMgaWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Vc2VyUG9vbElkKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHVzZXJQb29sSWQ6IHN0cmluZyk6IElVc2VyUG9vbCB7XG4gICAgbGV0IHVzZXJQb29sQXJuID0gU3RhY2sub2Yoc2NvcGUpLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnY29nbml0by1pZHAnLFxuICAgICAgcmVzb3VyY2U6ICd1c2VycG9vbCcsXG4gICAgICByZXNvdXJjZU5hbWU6IHVzZXJQb29sSWQsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gVXNlclBvb2wuZnJvbVVzZXJQb29sQXJuKHNjb3BlLCBpZCwgdXNlclBvb2xBcm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyB1c2VyIHBvb2wgYmFzZWQgb24gaXRzIEFSTi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVVzZXJQb29sQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHVzZXJQb29sQXJuOiBzdHJpbmcpOiBJVXNlclBvb2wge1xuICAgIGNvbnN0IGFyblBhcnRzID0gU3RhY2sub2Yoc2NvcGUpLnNwbGl0QXJuKHVzZXJQb29sQXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSk7XG5cbiAgICBpZiAoIWFyblBhcnRzLnJlc291cmNlTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHVzZXIgcG9vbCBBUk4nKTtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VyUG9vbElkID0gYXJuUGFydHMucmVzb3VyY2VOYW1lO1xuXG4gICAgY2xhc3MgSW1wb3J0ZWRVc2VyUG9vbCBleHRlbmRzIFVzZXJQb29sQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgdXNlclBvb2xBcm4gPSB1c2VyUG9vbEFybjtcbiAgICAgIHB1YmxpYyByZWFkb25seSB1c2VyUG9vbElkID0gdXNlclBvb2xJZDtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgICAgICBhY2NvdW50OiBhcm5QYXJ0cy5hY2NvdW50LFxuICAgICAgICAgIHJlZ2lvbjogYXJuUGFydHMucmVnaW9uLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydGVkVXNlclBvb2woKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcGh5c2ljYWwgSUQgb2YgdGhpcyB1c2VyIHBvb2wgcmVzb3VyY2VcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB1c2VyUG9vbElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIHVzZXIgcG9vbFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHVzZXJQb29sQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFVzZXIgcG9vbCBwcm92aWRlciBuYW1lXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB1c2VyUG9vbFByb3ZpZGVyTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBVc2VyIHBvb2wgcHJvdmlkZXIgVVJMXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB1c2VyUG9vbFByb3ZpZGVyVXJsOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSB0cmlnZ2VyczogQ2ZuVXNlclBvb2wuTGFtYmRhQ29uZmlnUHJvcGVydHkgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogVXNlclBvb2xQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHNpZ25JbiA9IHRoaXMuc2lnbkluQ29uZmlndXJhdGlvbihwcm9wcyk7XG5cbiAgICBpZiAocHJvcHMuY3VzdG9tU2VuZGVyS21zS2V5KSB7XG4gICAgICBjb25zdCBrbXNLZXkgPSBwcm9wcy5jdXN0b21TZW5kZXJLbXNLZXk7XG4gICAgICAodGhpcy50cmlnZ2VycyBhcyBhbnkpLmttc0tleUlkID0ga21zS2V5LmtleUFybjtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMubGFtYmRhVHJpZ2dlcnMpIHtcbiAgICAgIGZvciAoY29uc3QgdCBvZiBPYmplY3Qua2V5cyhwcm9wcy5sYW1iZGFUcmlnZ2VycykpIHtcbiAgICAgICAgbGV0IHRyaWdnZXI6IGxhbWJkYS5JRnVuY3Rpb24gfCB1bmRlZmluZWQ7XG4gICAgICAgIHN3aXRjaCAodCkge1xuICAgICAgICAgIGNhc2UgJ2N1c3RvbVNtc1NlbmRlcic6XG4gICAgICAgICAgY2FzZSAnY3VzdG9tRW1haWxTZW5kZXInOlxuICAgICAgICAgICAgaWYgKCF0aGlzLnRyaWdnZXJzLmttc0tleUlkKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigneW91IG11c3Qgc3BlY2lmeSBhIEtNUyBrZXkgaWYgeW91IGFyZSB1c2luZyBjdXN0b21TbXNTZW5kZXIgb3IgY3VzdG9tRW1haWxTZW5kZXIuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cmlnZ2VyID0gcHJvcHMubGFtYmRhVHJpZ2dlcnNbdF07XG4gICAgICAgICAgICBjb25zdCB2ZXJzaW9uID0gJ1YxXzAnO1xuICAgICAgICAgICAgaWYgKHRyaWdnZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB0aGlzLmFkZExhbWJkYVBlcm1pc3Npb24odHJpZ2dlciBhcyBsYW1iZGEuSUZ1bmN0aW9uLCB0KTtcbiAgICAgICAgICAgICAgKHRoaXMudHJpZ2dlcnMgYXMgYW55KVt0XSA9IHtcbiAgICAgICAgICAgICAgICBsYW1iZGFBcm46IHRyaWdnZXIuZnVuY3Rpb25Bcm4sXG4gICAgICAgICAgICAgICAgbGFtYmRhVmVyc2lvbjogdmVyc2lvbixcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0cmlnZ2VyID0gcHJvcHMubGFtYmRhVHJpZ2dlcnNbdF0gYXMgbGFtYmRhLklGdW5jdGlvbiB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICh0cmlnZ2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5hZGRMYW1iZGFQZXJtaXNzaW9uKHRyaWdnZXIgYXMgbGFtYmRhLklGdW5jdGlvbiwgdCk7XG4gICAgICAgICAgICAgICh0aGlzLnRyaWdnZXJzIGFzIGFueSlbdF0gPSAodHJpZ2dlciBhcyBsYW1iZGEuSUZ1bmN0aW9uKS5mdW5jdGlvbkFybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdmVyaWZpY2F0aW9uTWVzc2FnZVRlbXBsYXRlID0gdGhpcy52ZXJpZmljYXRpb25NZXNzYWdlQ29uZmlndXJhdGlvbihwcm9wcyk7XG4gICAgbGV0IGVtYWlsVmVyaWZpY2F0aW9uTWVzc2FnZTtcbiAgICBsZXQgZW1haWxWZXJpZmljYXRpb25TdWJqZWN0O1xuICAgIGlmICh2ZXJpZmljYXRpb25NZXNzYWdlVGVtcGxhdGUuZGVmYXVsdEVtYWlsT3B0aW9uID09PSBWZXJpZmljYXRpb25FbWFpbFN0eWxlLkNPREUpIHtcbiAgICAgIGVtYWlsVmVyaWZpY2F0aW9uTWVzc2FnZSA9IHZlcmlmaWNhdGlvbk1lc3NhZ2VUZW1wbGF0ZS5lbWFpbE1lc3NhZ2U7XG4gICAgICBlbWFpbFZlcmlmaWNhdGlvblN1YmplY3QgPSB2ZXJpZmljYXRpb25NZXNzYWdlVGVtcGxhdGUuZW1haWxTdWJqZWN0O1xuICAgIH1cbiAgICBjb25zdCBzbXNWZXJpZmljYXRpb25NZXNzYWdlID0gdmVyaWZpY2F0aW9uTWVzc2FnZVRlbXBsYXRlLnNtc01lc3NhZ2U7XG4gICAgY29uc3QgaW52aXRlTWVzc2FnZVRlbXBsYXRlOiBDZm5Vc2VyUG9vbC5JbnZpdGVNZXNzYWdlVGVtcGxhdGVQcm9wZXJ0eSA9IHtcbiAgICAgIGVtYWlsTWVzc2FnZTogcHJvcHMudXNlckludml0YXRpb24/LmVtYWlsQm9keSxcbiAgICAgIGVtYWlsU3ViamVjdDogcHJvcHMudXNlckludml0YXRpb24/LmVtYWlsU3ViamVjdCxcbiAgICAgIHNtc01lc3NhZ2U6IHByb3BzLnVzZXJJbnZpdGF0aW9uPy5zbXNNZXNzYWdlLFxuICAgIH07XG4gICAgY29uc3Qgc2VsZlNpZ25VcEVuYWJsZWQgPSBwcm9wcy5zZWxmU2lnblVwRW5hYmxlZCA/PyBmYWxzZTtcbiAgICBjb25zdCBhZG1pbkNyZWF0ZVVzZXJDb25maWc6IENmblVzZXJQb29sLkFkbWluQ3JlYXRlVXNlckNvbmZpZ1Byb3BlcnR5ID0ge1xuICAgICAgYWxsb3dBZG1pbkNyZWF0ZVVzZXJPbmx5OiAhc2VsZlNpZ25VcEVuYWJsZWQsXG4gICAgICBpbnZpdGVNZXNzYWdlVGVtcGxhdGU6IHByb3BzLnVzZXJJbnZpdGF0aW9uICE9PSB1bmRlZmluZWQgPyBpbnZpdGVNZXNzYWdlVGVtcGxhdGUgOiB1bmRlZmluZWQsXG4gICAgfTtcblxuICAgIGNvbnN0IHBhc3N3b3JkUG9saWN5ID0gdGhpcy5jb25maWd1cmVQYXNzd29yZFBvbGljeShwcm9wcyk7XG5cbiAgICBpZiAocHJvcHMuZW1haWwgJiYgcHJvcHMuZW1haWxTZXR0aW5ncykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd5b3UgbXVzdCBlaXRoZXIgcHJvdmlkZSBcImVtYWlsXCIgb3IgXCJlbWFpbFNldHRpbmdzXCIsIGJ1dCBub3QgYm90aCcpO1xuICAgIH1cbiAgICBjb25zdCBlbWFpbENvbmZpZ3VyYXRpb24gPSBwcm9wcy5lbWFpbCA/IHByb3BzLmVtYWlsLl9iaW5kKHRoaXMpIDogdW5kZWZpbmVkSWZOb0tleXMoe1xuICAgICAgZnJvbTogZW5jb2RlUHVueShwcm9wcy5lbWFpbFNldHRpbmdzPy5mcm9tKSxcbiAgICAgIHJlcGx5VG9FbWFpbEFkZHJlc3M6IGVuY29kZVB1bnkocHJvcHMuZW1haWxTZXR0aW5ncz8ucmVwbHlUbyksXG4gICAgfSk7XG5cbiAgICBjb25zdCB1c2VyUG9vbCA9IG5ldyBDZm5Vc2VyUG9vbCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICB1c2VyUG9vbE5hbWU6IHByb3BzLnVzZXJQb29sTmFtZSxcbiAgICAgIHVzZXJuYW1lQXR0cmlidXRlczogc2lnbkluLnVzZXJuYW1lQXR0cnMsXG4gICAgICBhbGlhc0F0dHJpYnV0ZXM6IHNpZ25Jbi5hbGlhc0F0dHJzLFxuICAgICAgYXV0b1ZlcmlmaWVkQXR0cmlidXRlczogc2lnbkluLmF1dG9WZXJpZnlBdHRycyxcbiAgICAgIGxhbWJkYUNvbmZpZzogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB1bmRlZmluZWRJZk5vS2V5cyh0aGlzLnRyaWdnZXJzKSB9KSxcbiAgICAgIHNtc0F1dGhlbnRpY2F0aW9uTWVzc2FnZTogdGhpcy5tZmFNZXNzYWdlKHByb3BzKSxcbiAgICAgIHNtc0NvbmZpZ3VyYXRpb246IHRoaXMuc21zQ29uZmlndXJhdGlvbihwcm9wcyksXG4gICAgICBhZG1pbkNyZWF0ZVVzZXJDb25maWcsXG4gICAgICBlbWFpbFZlcmlmaWNhdGlvbk1lc3NhZ2UsXG4gICAgICBlbWFpbFZlcmlmaWNhdGlvblN1YmplY3QsXG4gICAgICBzbXNWZXJpZmljYXRpb25NZXNzYWdlLFxuICAgICAgdmVyaWZpY2F0aW9uTWVzc2FnZVRlbXBsYXRlLFxuICAgICAgdXNlclBvb2xBZGRPbnM6IHVuZGVmaW5lZElmTm9LZXlzKHtcbiAgICAgICAgYWR2YW5jZWRTZWN1cml0eU1vZGU6IHByb3BzLmFkdmFuY2VkU2VjdXJpdHlNb2RlLFxuICAgICAgfSksXG4gICAgICBzY2hlbWE6IHRoaXMuc2NoZW1hQ29uZmlndXJhdGlvbihwcm9wcyksXG4gICAgICBtZmFDb25maWd1cmF0aW9uOiBwcm9wcy5tZmEsXG4gICAgICBlbmFibGVkTWZhczogdGhpcy5tZmFDb25maWd1cmF0aW9uKHByb3BzKSxcbiAgICAgIHBvbGljaWVzOiBwYXNzd29yZFBvbGljeSAhPT0gdW5kZWZpbmVkID8geyBwYXNzd29yZFBvbGljeSB9IDogdW5kZWZpbmVkLFxuICAgICAgZW1haWxDb25maWd1cmF0aW9uLFxuICAgICAgdXNlcm5hbWVDb25maWd1cmF0aW9uOiB1bmRlZmluZWRJZk5vS2V5cyh7XG4gICAgICAgIGNhc2VTZW5zaXRpdmU6IHByb3BzLnNpZ25JbkNhc2VTZW5zaXRpdmUsXG4gICAgICB9KSxcbiAgICAgIGFjY291bnRSZWNvdmVyeVNldHRpbmc6IHRoaXMuYWNjb3VudFJlY292ZXJ5KHByb3BzKSxcbiAgICAgIGRldmljZUNvbmZpZ3VyYXRpb246IHByb3BzLmRldmljZVRyYWNraW5nLFxuICAgICAgdXNlckF0dHJpYnV0ZVVwZGF0ZVNldHRpbmdzOiB0aGlzLmNvbmZpZ3VyZVVzZXJBdHRyaWJ1dGVDaGFuZ2VzKHByb3BzKSxcbiAgICAgIGRlbGV0aW9uUHJvdGVjdGlvbjogZGVmYXVsdERlbGV0aW9uUHJvdGVjdGlvbihwcm9wcy5kZWxldGlvblByb3RlY3Rpb24pLFxuICAgIH0pO1xuICAgIHVzZXJQb29sLmFwcGx5UmVtb3ZhbFBvbGljeShwcm9wcy5yZW1vdmFsUG9saWN5KTtcblxuICAgIHRoaXMudXNlclBvb2xJZCA9IHVzZXJQb29sLnJlZjtcbiAgICB0aGlzLnVzZXJQb29sQXJuID0gdXNlclBvb2wuYXR0ckFybjtcblxuICAgIHRoaXMudXNlclBvb2xQcm92aWRlck5hbWUgPSB1c2VyUG9vbC5hdHRyUHJvdmlkZXJOYW1lO1xuICAgIHRoaXMudXNlclBvb2xQcm92aWRlclVybCA9IHVzZXJQb29sLmF0dHJQcm92aWRlclVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBsYW1iZGEgdHJpZ2dlciB0byBhIHVzZXIgcG9vbCBvcGVyYXRpb25cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvY29nbml0by11c2VyLWlkZW50aXR5LXBvb2xzLXdvcmtpbmctd2l0aC1hd3MtbGFtYmRhLXRyaWdnZXJzLmh0bWxcbiAgICovXG4gIHB1YmxpYyBhZGRUcmlnZ2VyKG9wZXJhdGlvbjogVXNlclBvb2xPcGVyYXRpb24sIGZuOiBsYW1iZGEuSUZ1bmN0aW9uKTogdm9pZCB7XG4gICAgaWYgKG9wZXJhdGlvbi5vcGVyYXRpb25OYW1lIGluIHRoaXMudHJpZ2dlcnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQSB0cmlnZ2VyIGZvciB0aGUgb3BlcmF0aW9uICR7b3BlcmF0aW9uLm9wZXJhdGlvbk5hbWV9IGFscmVhZHkgZXhpc3RzLmApO1xuICAgIH1cblxuICAgIHRoaXMuYWRkTGFtYmRhUGVybWlzc2lvbihmbiwgb3BlcmF0aW9uLm9wZXJhdGlvbk5hbWUpO1xuICAgIHN3aXRjaCAob3BlcmF0aW9uLm9wZXJhdGlvbk5hbWUpIHtcbiAgICAgIGNhc2UgJ2N1c3RvbUVtYWlsU2VuZGVyJzpcbiAgICAgIGNhc2UgJ2N1c3RvbVNtc1NlbmRlcic6XG4gICAgICAgIGlmICghdGhpcy50cmlnZ2Vycy5rbXNLZXlJZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigneW91IG11c3Qgc3BlY2lmeSBhIEtNUyBrZXkgaWYgeW91IGFyZSB1c2luZyBjdXN0b21TbXNTZW5kZXIgb3IgY3VzdG9tRW1haWxTZW5kZXIuJyk7XG4gICAgICAgIH1cbiAgICAgICAgKHRoaXMudHJpZ2dlcnMgYXMgYW55KVtvcGVyYXRpb24ub3BlcmF0aW9uTmFtZV0gPSB7XG4gICAgICAgICAgbGFtYmRhQXJuOiBmbi5mdW5jdGlvbkFybixcbiAgICAgICAgICBsYW1iZGFWZXJzaW9uOiAnVjFfMCcsXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgKHRoaXMudHJpZ2dlcnMgYXMgYW55KVtvcGVyYXRpb24ub3BlcmF0aW9uTmFtZV0gPSBmbi5mdW5jdGlvbkFybjtcbiAgICB9XG5cbiAgfVxuXG4gIHByaXZhdGUgYWRkTGFtYmRhUGVybWlzc2lvbihmbjogbGFtYmRhLklGdW5jdGlvbiwgbmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgY2FwaXRhbGl6ZSA9IG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpO1xuICAgIGZuLmFkZFBlcm1pc3Npb24oYCR7Y2FwaXRhbGl6ZX1Db2duaXRvYCwge1xuICAgICAgcHJpbmNpcGFsOiBuZXcgU2VydmljZVByaW5jaXBhbCgnY29nbml0by1pZHAuYW1hem9uYXdzLmNvbScpLFxuICAgICAgc291cmNlQXJuOiBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IHRoaXMudXNlclBvb2xBcm4gfSksXG4gICAgICBzY29wZTogdGhpcyxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbWZhTWVzc2FnZShwcm9wczogVXNlclBvb2xQcm9wcyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgQ09ERV9URU1QTEFURSA9ICd7IyMjI30nO1xuICAgIGNvbnN0IE1BWF9MRU5HVEggPSAxNDA7XG4gICAgY29uc3QgbWVzc2FnZSA9IHByb3BzLm1mYU1lc3NhZ2U7XG5cbiAgICBpZiAobWVzc2FnZSAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKG1lc3NhZ2UpKSB7XG4gICAgICBpZiAoIW1lc3NhZ2UuaW5jbHVkZXMoQ09ERV9URU1QTEFURSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNRkEgbWVzc2FnZSBtdXN0IGNvbnRhaW4gdGhlIHRlbXBsYXRlIHN0cmluZyAnJHtDT0RFX1RFTVBMQVRFfSdgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1lc3NhZ2UubGVuZ3RoID4gTUFYX0xFTkdUSCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1GQSBtZXNzYWdlIG11c3QgYmUgYmV0d2VlbiAke0NPREVfVEVNUExBVEUubGVuZ3RofSBhbmQgJHtNQVhfTEVOR1RIfSBjaGFyYWN0ZXJzYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lc3NhZ2U7XG4gIH1cblxuICBwcml2YXRlIHZlcmlmaWNhdGlvbk1lc3NhZ2VDb25maWd1cmF0aW9uKHByb3BzOiBVc2VyUG9vbFByb3BzKTogQ2ZuVXNlclBvb2wuVmVyaWZpY2F0aW9uTWVzc2FnZVRlbXBsYXRlUHJvcGVydHkge1xuICAgIGNvbnN0IENPREVfVEVNUExBVEUgPSAneyMjIyN9JztcbiAgICBjb25zdCBWRVJJRllfRU1BSUxfVEVNUExBVEUgPSAneyMjVmVyaWZ5IEVtYWlsIyN9JztcblxuICAgIGNvbnN0IGVtYWlsU3R5bGUgPSBwcm9wcy51c2VyVmVyaWZpY2F0aW9uPy5lbWFpbFN0eWxlID8/IFZlcmlmaWNhdGlvbkVtYWlsU3R5bGUuQ09ERTtcbiAgICBjb25zdCBlbWFpbFN1YmplY3QgPSBwcm9wcy51c2VyVmVyaWZpY2F0aW9uPy5lbWFpbFN1YmplY3QgPz8gJ1ZlcmlmeSB5b3VyIG5ldyBhY2NvdW50JztcbiAgICBjb25zdCBzbXNNZXNzYWdlID0gcHJvcHMudXNlclZlcmlmaWNhdGlvbj8uc21zTWVzc2FnZSA/PyBgVGhlIHZlcmlmaWNhdGlvbiBjb2RlIHRvIHlvdXIgbmV3IGFjY291bnQgaXMgJHtDT0RFX1RFTVBMQVRFfWA7XG5cbiAgICBpZiAoZW1haWxTdHlsZSA9PT0gVmVyaWZpY2F0aW9uRW1haWxTdHlsZS5DT0RFKSB7XG4gICAgICBjb25zdCBlbWFpbE1lc3NhZ2UgPSBwcm9wcy51c2VyVmVyaWZpY2F0aW9uPy5lbWFpbEJvZHkgPz8gYFRoZSB2ZXJpZmljYXRpb24gY29kZSB0byB5b3VyIG5ldyBhY2NvdW50IGlzICR7Q09ERV9URU1QTEFURX1gO1xuICAgICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoZW1haWxNZXNzYWdlKSAmJiBlbWFpbE1lc3NhZ2UuaW5kZXhPZihDT0RFX1RFTVBMQVRFKSA8IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBWZXJpZmljYXRpb24gZW1haWwgYm9keSBtdXN0IGNvbnRhaW4gdGhlIHRlbXBsYXRlIHN0cmluZyAnJHtDT0RFX1RFTVBMQVRFfSdgKTtcbiAgICAgIH1cbiAgICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKHNtc01lc3NhZ2UpICYmIHNtc01lc3NhZ2UuaW5kZXhPZihDT0RFX1RFTVBMQVRFKSA8IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTTVMgbWVzc2FnZSBtdXN0IGNvbnRhaW4gdGhlIHRlbXBsYXRlIHN0cmluZyAnJHtDT0RFX1RFTVBMQVRFfSdgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRlZmF1bHRFbWFpbE9wdGlvbjogVmVyaWZpY2F0aW9uRW1haWxTdHlsZS5DT0RFLFxuICAgICAgICBlbWFpbE1lc3NhZ2UsXG4gICAgICAgIGVtYWlsU3ViamVjdCxcbiAgICAgICAgc21zTWVzc2FnZSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGVtYWlsTWVzc2FnZSA9IHByb3BzLnVzZXJWZXJpZmljYXRpb24/LmVtYWlsQm9keSA/P1xuICAgICAgICBgVmVyaWZ5IHlvdXIgYWNjb3VudCBieSBjbGlja2luZyBvbiAke1ZFUklGWV9FTUFJTF9URU1QTEFURX1gO1xuICAgICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoZW1haWxNZXNzYWdlKSAmJiBlbWFpbE1lc3NhZ2UuaW5kZXhPZihWRVJJRllfRU1BSUxfVEVNUExBVEUpIDwgMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFZlcmlmaWNhdGlvbiBlbWFpbCBib2R5IG11c3QgY29udGFpbiB0aGUgdGVtcGxhdGUgc3RyaW5nICcke1ZFUklGWV9FTUFJTF9URU1QTEFURX0nYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkZWZhdWx0RW1haWxPcHRpb246IFZlcmlmaWNhdGlvbkVtYWlsU3R5bGUuTElOSyxcbiAgICAgICAgZW1haWxNZXNzYWdlQnlMaW5rOiBlbWFpbE1lc3NhZ2UsXG4gICAgICAgIGVtYWlsU3ViamVjdEJ5TGluazogZW1haWxTdWJqZWN0LFxuICAgICAgICBzbXNNZXNzYWdlLFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNpZ25JbkNvbmZpZ3VyYXRpb24ocHJvcHM6IFVzZXJQb29sUHJvcHMpIHtcbiAgICBsZXQgYWxpYXNBdHRyczogc3RyaW5nW10gfCB1bmRlZmluZWQ7XG4gICAgbGV0IHVzZXJuYW1lQXR0cnM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xuICAgIGxldCBhdXRvVmVyaWZ5QXR0cnM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xuXG4gICAgY29uc3Qgc2lnbkluOiBTaWduSW5BbGlhc2VzID0gcHJvcHMuc2lnbkluQWxpYXNlcyA/PyB7IHVzZXJuYW1lOiB0cnVlIH07XG5cbiAgICBpZiAoc2lnbkluLnByZWZlcnJlZFVzZXJuYW1lICYmICFzaWduSW4udXNlcm5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndXNlcm5hbWUgc2lnbkluIG11c3QgYmUgZW5hYmxlZCBpZiBwcmVmZXJyZWRVc2VybmFtZSBpcyBlbmFibGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKHNpZ25Jbi51c2VybmFtZSkge1xuICAgICAgYWxpYXNBdHRycyA9IFtdO1xuICAgICAgaWYgKHNpZ25Jbi5lbWFpbCkgeyBhbGlhc0F0dHJzLnB1c2goU3RhbmRhcmRBdHRyaWJ1dGVOYW1lcy5lbWFpbCk7IH1cbiAgICAgIGlmIChzaWduSW4ucGhvbmUpIHsgYWxpYXNBdHRycy5wdXNoKFN0YW5kYXJkQXR0cmlidXRlTmFtZXMucGhvbmVOdW1iZXIpOyB9XG4gICAgICBpZiAoc2lnbkluLnByZWZlcnJlZFVzZXJuYW1lKSB7IGFsaWFzQXR0cnMucHVzaChTdGFuZGFyZEF0dHJpYnV0ZU5hbWVzLnByZWZlcnJlZFVzZXJuYW1lKTsgfVxuICAgICAgaWYgKGFsaWFzQXR0cnMubGVuZ3RoID09PSAwKSB7IGFsaWFzQXR0cnMgPSB1bmRlZmluZWQ7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgdXNlcm5hbWVBdHRycyA9IFtdO1xuICAgICAgaWYgKHNpZ25Jbi5lbWFpbCkgeyB1c2VybmFtZUF0dHJzLnB1c2goU3RhbmRhcmRBdHRyaWJ1dGVOYW1lcy5lbWFpbCk7IH1cbiAgICAgIGlmIChzaWduSW4ucGhvbmUpIHsgdXNlcm5hbWVBdHRycy5wdXNoKFN0YW5kYXJkQXR0cmlidXRlTmFtZXMucGhvbmVOdW1iZXIpOyB9XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmF1dG9WZXJpZnkpIHtcbiAgICAgIGF1dG9WZXJpZnlBdHRycyA9IFtdO1xuICAgICAgaWYgKHByb3BzLmF1dG9WZXJpZnkuZW1haWwpIHsgYXV0b1ZlcmlmeUF0dHJzLnB1c2goU3RhbmRhcmRBdHRyaWJ1dGVOYW1lcy5lbWFpbCk7IH1cbiAgICAgIGlmIChwcm9wcy5hdXRvVmVyaWZ5LnBob25lKSB7IGF1dG9WZXJpZnlBdHRycy5wdXNoKFN0YW5kYXJkQXR0cmlidXRlTmFtZXMucGhvbmVOdW1iZXIpOyB9XG4gICAgfSBlbHNlIGlmIChzaWduSW4uZW1haWwgfHwgc2lnbkluLnBob25lKSB7XG4gICAgICBhdXRvVmVyaWZ5QXR0cnMgPSBbXTtcbiAgICAgIGlmIChzaWduSW4uZW1haWwpIHsgYXV0b1ZlcmlmeUF0dHJzLnB1c2goU3RhbmRhcmRBdHRyaWJ1dGVOYW1lcy5lbWFpbCk7IH1cbiAgICAgIGlmIChzaWduSW4ucGhvbmUpIHsgYXV0b1ZlcmlmeUF0dHJzLnB1c2goU3RhbmRhcmRBdHRyaWJ1dGVOYW1lcy5waG9uZU51bWJlcik7IH1cbiAgICB9XG5cbiAgICByZXR1cm4geyB1c2VybmFtZUF0dHJzLCBhbGlhc0F0dHJzLCBhdXRvVmVyaWZ5QXR0cnMgfTtcbiAgfVxuXG4gIHByaXZhdGUgc21zQ29uZmlndXJhdGlvbihwcm9wczogVXNlclBvb2xQcm9wcyk6IENmblVzZXJQb29sLlNtc0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHByb3BzLmVuYWJsZVNtc1JvbGUgPT09IGZhbHNlICYmIHByb3BzLnNtc1JvbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZW5hYmxlU21zUm9sZSBjYW5ub3QgYmUgZGlzYWJsZWQgd2hlbiBzbXNSb2xlIGlzIHNwZWNpZmllZCcpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5zbXNSb2xlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzbnNDYWxsZXJBcm46IHByb3BzLnNtc1JvbGUucm9sZUFybixcbiAgICAgICAgZXh0ZXJuYWxJZDogcHJvcHMuc21zUm9sZUV4dGVybmFsSWQsXG4gICAgICAgIHNuc1JlZ2lvbjogcHJvcHMuc25zUmVnaW9uLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuZW5hYmxlU21zUm9sZSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgbWZhQ29uZmlndXJhdGlvbiA9IHRoaXMubWZhQ29uZmlndXJhdGlvbihwcm9wcyk7XG4gICAgY29uc3QgcGhvbmVWZXJpZmljYXRpb24gPSBwcm9wcy5zaWduSW5BbGlhc2VzPy5waG9uZSA9PT0gdHJ1ZSB8fCBwcm9wcy5hdXRvVmVyaWZ5Py5waG9uZSA9PT0gdHJ1ZTtcbiAgICBjb25zdCByb2xlUmVxdWlyZWQgPSBtZmFDb25maWd1cmF0aW9uPy5pbmNsdWRlcygnU01TX01GQScpIHx8IHBob25lVmVyaWZpY2F0aW9uO1xuICAgIGlmICghcm9sZVJlcXVpcmVkICYmIHByb3BzLmVuYWJsZVNtc1JvbGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBzbXNSb2xlRXh0ZXJuYWxJZCA9IE5hbWVzLnVuaXF1ZUlkKHRoaXMpLnNsaWNlKDAsIDEyMjMpOyAvLyBzdHM6RXh0ZXJuYWxJZCBtYXggbGVuZ3RoIG9mIDEyMjRcbiAgICBjb25zdCBzbXNSb2xlID0gcHJvcHMuc21zUm9sZSA/PyBuZXcgUm9sZSh0aGlzLCAnc21zUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2NvZ25pdG8taWRwLmFtYXpvbmF3cy5jb20nLCB7XG4gICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICBTdHJpbmdFcXVhbHM6IHsgJ3N0czpFeHRlcm5hbElkJzogc21zUm9sZUV4dGVybmFsSWQgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgaW5saW5lUG9saWNpZXM6IHtcbiAgICAgICAgLypcbiAgICAgICAgICAqIFRoZSBVc2VyUG9vbCBpcyB2ZXJ5IHBhcnRpY3VsYXIgdGhhdCBpdCBtdXN0IGNvbnRhaW4gYW4gJ3NuczpQdWJsaXNoJyBhY3Rpb24gYXMgYW4gaW5saW5lIHBvbGljeS5cbiAgICAgICAgICAqIElkZWFsbHksIGEgY29uZGl0aW9uYWwgdGhhdCByZXN0cmljdHMgdGhpcyBhY3Rpb24gdG8gJ3NtcycgcHJvdG9jb2wgbmVlZHMgdG8gYmUgYXR0YWNoZWQsIGJ1dCB0aGUgVXNlclBvb2wgZGVwbG95bWVudCBmYWlscyB2YWxpZGF0aW9uLlxuICAgICAgICAgICogU2VlbXMgbGlrZSBhIGNhc2Ugb2YgYmVpbmcgZXhjZXNzaXZlbHkgc3RyaWN0LlxuICAgICAgICAgICovXG4gICAgICAgICdzbnMtcHVibGlzaCc6IG5ldyBQb2xpY3lEb2N1bWVudCh7XG4gICAgICAgICAgc3RhdGVtZW50czogW1xuICAgICAgICAgICAgbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICAgIGFjdGlvbnM6IFsnc25zOlB1Ymxpc2gnXSxcbiAgICAgICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgZXh0ZXJuYWxJZDogc21zUm9sZUV4dGVybmFsSWQsXG4gICAgICBzbnNDYWxsZXJBcm46IHNtc1JvbGUucm9sZUFybixcbiAgICAgIHNuc1JlZ2lvbjogcHJvcHMuc25zUmVnaW9uLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIG1mYUNvbmZpZ3VyYXRpb24ocHJvcHM6IFVzZXJQb29sUHJvcHMpOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHByb3BzLm1mYSA9PT0gdW5kZWZpbmVkIHx8IHByb3BzLm1mYSA9PT0gTWZhLk9GRikge1xuICAgICAgLy8gc2luY2UgZGVmYXVsdCBpcyBPRkYsIHRyZWF0IHVuZGVmaW5lZCBhbmQgT0ZGIHRoZSBzYW1lIHdheVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2UgaWYgKHByb3BzLm1mYVNlY29uZEZhY3RvciA9PT0gdW5kZWZpbmVkICYmXG4gICAgICAocHJvcHMubWZhID09PSBNZmEuT1BUSU9OQUwgfHwgcHJvcHMubWZhID09PSBNZmEuUkVRVUlSRUQpKSB7XG4gICAgICByZXR1cm4gWydTTVNfTUZBJ107XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGVuYWJsZWRNZmFzID0gW107XG4gICAgICBpZiAocHJvcHMubWZhU2Vjb25kRmFjdG9yIS5zbXMpIHtcbiAgICAgICAgZW5hYmxlZE1mYXMucHVzaCgnU01TX01GQScpO1xuICAgICAgfVxuICAgICAgaWYgKHByb3BzLm1mYVNlY29uZEZhY3RvciEub3RwKSB7XG4gICAgICAgIGVuYWJsZWRNZmFzLnB1c2goJ1NPRlRXQVJFX1RPS0VOX01GQScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVuYWJsZWRNZmFzO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY29uZmlndXJlUGFzc3dvcmRQb2xpY3kocHJvcHM6IFVzZXJQb29sUHJvcHMpOiBDZm5Vc2VyUG9vbC5QYXNzd29yZFBvbGljeVByb3BlcnR5IHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCB0ZW1wUGFzc3dvcmRWYWxpZGl0eSA9IHByb3BzLnBhc3N3b3JkUG9saWN5Py50ZW1wUGFzc3dvcmRWYWxpZGl0eTtcbiAgICBpZiAodGVtcFBhc3N3b3JkVmFsaWRpdHkgIT09IHVuZGVmaW5lZCAmJiB0ZW1wUGFzc3dvcmRWYWxpZGl0eS50b0RheXMoKSA+IER1cmF0aW9uLmRheXMoMzY1KS50b0RheXMoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB0ZW1wUGFzc3dvcmRWYWxpZGl0eSBjYW5ub3QgYmUgZ3JlYXRlciB0aGFuIDM2NSBkYXlzIChyZWNlaXZlZDogJHt0ZW1wUGFzc3dvcmRWYWxpZGl0eS50b0RheXMoKX0pYCk7XG4gICAgfVxuICAgIGNvbnN0IG1pbkxlbmd0aCA9IHByb3BzLnBhc3N3b3JkUG9saWN5ID8gcHJvcHMucGFzc3dvcmRQb2xpY3kubWluTGVuZ3RoID8/IDggOiB1bmRlZmluZWQ7XG4gICAgaWYgKG1pbkxlbmd0aCAhPT0gdW5kZWZpbmVkICYmIChtaW5MZW5ndGggPCA2IHx8IG1pbkxlbmd0aCA+IDk5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBtaW5MZW5ndGggZm9yIHBhc3N3b3JkIG11c3QgYmUgYmV0d2VlbiA2IGFuZCA5OSAocmVjZWl2ZWQ6ICR7bWluTGVuZ3RofSlgKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZElmTm9LZXlzKHtcbiAgICAgIHRlbXBvcmFyeVBhc3N3b3JkVmFsaWRpdHlEYXlzOiB0ZW1wUGFzc3dvcmRWYWxpZGl0eT8udG9EYXlzKHsgaW50ZWdyYWw6IHRydWUgfSksXG4gICAgICBtaW5pbXVtTGVuZ3RoOiBtaW5MZW5ndGgsXG4gICAgICByZXF1aXJlTG93ZXJjYXNlOiBwcm9wcy5wYXNzd29yZFBvbGljeT8ucmVxdWlyZUxvd2VyY2FzZSxcbiAgICAgIHJlcXVpcmVVcHBlcmNhc2U6IHByb3BzLnBhc3N3b3JkUG9saWN5Py5yZXF1aXJlVXBwZXJjYXNlLFxuICAgICAgcmVxdWlyZU51bWJlcnM6IHByb3BzLnBhc3N3b3JkUG9saWN5Py5yZXF1aXJlRGlnaXRzLFxuICAgICAgcmVxdWlyZVN5bWJvbHM6IHByb3BzLnBhc3N3b3JkUG9saWN5Py5yZXF1aXJlU3ltYm9scyxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2NoZW1hQ29uZmlndXJhdGlvbihwcm9wczogVXNlclBvb2xQcm9wcyk6IENmblVzZXJQb29sLlNjaGVtYUF0dHJpYnV0ZVByb3BlcnR5W10gfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHNjaGVtYTogQ2ZuVXNlclBvb2wuU2NoZW1hQXR0cmlidXRlUHJvcGVydHlbXSA9IFtdO1xuXG4gICAgaWYgKHByb3BzLnN0YW5kYXJkQXR0cmlidXRlcykge1xuICAgICAgY29uc3Qgc3RkQXR0cmlidXRlcyA9IChPYmplY3QuZW50cmllcyhwcm9wcy5zdGFuZGFyZEF0dHJpYnV0ZXMpIGFzIEFycmF5PFtrZXlvZiBTdGFuZGFyZEF0dHJpYnV0ZXMsIFN0YW5kYXJkQXR0cmlidXRlXT4pXG4gICAgICAgIC5maWx0ZXIoKFssIGF0dHJdKSA9PiAhIWF0dHIpXG4gICAgICAgIC5tYXAoKFthdHRyTmFtZSwgYXR0cl0pID0+ICh7XG4gICAgICAgICAgbmFtZTogU3RhbmRhcmRBdHRyaWJ1dGVOYW1lc1thdHRyTmFtZV0sXG4gICAgICAgICAgbXV0YWJsZTogYXR0ci5tdXRhYmxlID8/IHRydWUsXG4gICAgICAgICAgcmVxdWlyZWQ6IGF0dHIucmVxdWlyZWQgPz8gZmFsc2UsXG4gICAgICAgIH0pKTtcblxuICAgICAgc2NoZW1hLnB1c2goLi4uc3RkQXR0cmlidXRlcyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmN1c3RvbUF0dHJpYnV0ZXMpIHtcbiAgICAgIGNvbnN0IGN1c3RvbUF0dHJzID0gT2JqZWN0LmtleXMocHJvcHMuY3VzdG9tQXR0cmlidXRlcykubWFwKChhdHRyTmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBhdHRyQ29uZmlnID0gcHJvcHMuY3VzdG9tQXR0cmlidXRlcyFbYXR0ck5hbWVdLmJpbmQoKTtcbiAgICAgICAgY29uc3QgbnVtYmVyQ29uc3RyYWludHM6IENmblVzZXJQb29sLk51bWJlckF0dHJpYnV0ZUNvbnN0cmFpbnRzUHJvcGVydHkgPSB7XG4gICAgICAgICAgbWluVmFsdWU6IGF0dHJDb25maWcubnVtYmVyQ29uc3RyYWludHM/Lm1pbj8udG9TdHJpbmcoKSxcbiAgICAgICAgICBtYXhWYWx1ZTogYXR0ckNvbmZpZy5udW1iZXJDb25zdHJhaW50cz8ubWF4Py50b1N0cmluZygpLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzdHJpbmdDb25zdHJhaW50czogQ2ZuVXNlclBvb2wuU3RyaW5nQXR0cmlidXRlQ29uc3RyYWludHNQcm9wZXJ0eSA9IHtcbiAgICAgICAgICBtaW5MZW5ndGg6IGF0dHJDb25maWcuc3RyaW5nQ29uc3RyYWludHM/Lm1pbkxlbj8udG9TdHJpbmcoKSxcbiAgICAgICAgICBtYXhMZW5ndGg6IGF0dHJDb25maWcuc3RyaW5nQ29uc3RyYWludHM/Lm1heExlbj8udG9TdHJpbmcoKSxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGF0dHJOYW1lLFxuICAgICAgICAgIGF0dHJpYnV0ZURhdGFUeXBlOiBhdHRyQ29uZmlnLmRhdGFUeXBlLFxuICAgICAgICAgIG51bWJlckF0dHJpYnV0ZUNvbnN0cmFpbnRzOiBhdHRyQ29uZmlnLm51bWJlckNvbnN0cmFpbnRzXG4gICAgICAgICAgICA/IG51bWJlckNvbnN0cmFpbnRzXG4gICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBzdHJpbmdBdHRyaWJ1dGVDb25zdHJhaW50czogYXR0ckNvbmZpZy5zdHJpbmdDb25zdHJhaW50c1xuICAgICAgICAgICAgPyBzdHJpbmdDb25zdHJhaW50c1xuICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgbXV0YWJsZTogYXR0ckNvbmZpZy5tdXRhYmxlLFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICBzY2hlbWEucHVzaCguLi5jdXN0b21BdHRycyk7XG4gICAgfVxuXG4gICAgaWYgKHNjaGVtYS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBzY2hlbWE7XG4gIH1cblxuICBwcml2YXRlIGFjY291bnRSZWNvdmVyeShwcm9wczogVXNlclBvb2xQcm9wcyk6IHVuZGVmaW5lZCB8IENmblVzZXJQb29sLkFjY291bnRSZWNvdmVyeVNldHRpbmdQcm9wZXJ0eSB7XG4gICAgY29uc3QgYWNjb3VudFJlY292ZXJ5ID0gcHJvcHMuYWNjb3VudFJlY292ZXJ5ID8/IEFjY291bnRSZWNvdmVyeS5QSE9ORV9XSVRIT1VUX01GQV9BTkRfRU1BSUw7XG4gICAgc3dpdGNoIChhY2NvdW50UmVjb3ZlcnkpIHtcbiAgICAgIGNhc2UgQWNjb3VudFJlY292ZXJ5LkVNQUlMX0FORF9QSE9ORV9XSVRIT1VUX01GQTpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByZWNvdmVyeU1lY2hhbmlzbXM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ3ZlcmlmaWVkX2VtYWlsJywgcHJpb3JpdHk6IDEgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3ZlcmlmaWVkX3Bob25lX251bWJlcicsIHByaW9yaXR5OiAyIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfTtcbiAgICAgIGNhc2UgQWNjb3VudFJlY292ZXJ5LlBIT05FX1dJVEhPVVRfTUZBX0FORF9FTUFJTDpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByZWNvdmVyeU1lY2hhbmlzbXM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ3ZlcmlmaWVkX3Bob25lX251bWJlcicsIHByaW9yaXR5OiAxIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICd2ZXJpZmllZF9lbWFpbCcsIHByaW9yaXR5OiAyIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfTtcbiAgICAgIGNhc2UgQWNjb3VudFJlY292ZXJ5LkVNQUlMX09OTFk6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmVjb3ZlcnlNZWNoYW5pc21zOiBbeyBuYW1lOiAndmVyaWZpZWRfZW1haWwnLCBwcmlvcml0eTogMSB9XSxcbiAgICAgICAgfTtcbiAgICAgIGNhc2UgQWNjb3VudFJlY292ZXJ5LlBIT05FX09OTFlfV0lUSE9VVF9NRkE6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmVjb3ZlcnlNZWNoYW5pc21zOiBbeyBuYW1lOiAndmVyaWZpZWRfcGhvbmVfbnVtYmVyJywgcHJpb3JpdHk6IDEgfV0sXG4gICAgICAgIH07XG4gICAgICBjYXNlIEFjY291bnRSZWNvdmVyeS5OT05FOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlY292ZXJ5TWVjaGFuaXNtczogW3sgbmFtZTogJ2FkbWluX29ubHknLCBwcmlvcml0eTogMSB9XSxcbiAgICAgICAgfTtcbiAgICAgIGNhc2UgQWNjb3VudFJlY292ZXJ5LlBIT05FX0FORF9FTUFJTDpcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgQWNjb3VudFJlY292ZXJ5IHR5cGUgLSAke2FjY291bnRSZWNvdmVyeX1gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvbmZpZ3VyZVVzZXJBdHRyaWJ1dGVDaGFuZ2VzKHByb3BzOiBVc2VyUG9vbFByb3BzKTogQ2ZuVXNlclBvb2wuVXNlckF0dHJpYnV0ZVVwZGF0ZVNldHRpbmdzUHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIGlmICghcHJvcHMua2VlcE9yaWdpbmFsKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYnV0ZXNSZXF1aXJlVmVyaWZpY2F0aW9uQmVmb3JlVXBkYXRlOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgaWYgKHByb3BzLmtlZXBPcmlnaW5hbC5lbWFpbCkge1xuICAgICAgYXR0cmlidXRlc1JlcXVpcmVWZXJpZmljYXRpb25CZWZvcmVVcGRhdGUucHVzaChTdGFuZGFyZEF0dHJpYnV0ZU5hbWVzLmVtYWlsKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMua2VlcE9yaWdpbmFsLnBob25lKSB7XG4gICAgICBhdHRyaWJ1dGVzUmVxdWlyZVZlcmlmaWNhdGlvbkJlZm9yZVVwZGF0ZS5wdXNoKFN0YW5kYXJkQXR0cmlidXRlTmFtZXMucGhvbmVOdW1iZXIpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBhdHRyaWJ1dGVzUmVxdWlyZVZlcmlmaWNhdGlvbkJlZm9yZVVwZGF0ZSxcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuZGVmaW5lZElmTm9LZXlzKHN0cnVjdDogb2JqZWN0KTogb2JqZWN0IHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgYWxsVW5kZWZpbmVkID0gT2JqZWN0LnZhbHVlcyhzdHJ1Y3QpLmV2ZXJ5KHZhbCA9PiB2YWwgPT09IHVuZGVmaW5lZCk7XG4gIHJldHVybiBhbGxVbmRlZmluZWQgPyB1bmRlZmluZWQgOiBzdHJ1Y3Q7XG59XG5mdW5jdGlvbiBlbmNvZGVQdW55KGlucHV0OiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICByZXR1cm4gaW5wdXQgIT09IHVuZGVmaW5lZCA/IHB1bnljb2RlRW5jb2RlKGlucHV0KSA6IGlucHV0O1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0RGVsZXRpb25Qcm90ZWN0aW9uKGRlbGV0aW9uUHJvdGVjdGlvbj86IGJvb2xlYW4pOiAnQUNUSVZFJyB8ICdJTkFDVElWRScgfCB1bmRlZmluZWQge1xuICBpZiAoZGVsZXRpb25Qcm90ZWN0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuICdBQ1RJVkUnO1xuICB9XG5cbiAgaWYgKGRlbGV0aW9uUHJvdGVjdGlvbiA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gJ0lOQUNUSVZFJztcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG4iXX0=