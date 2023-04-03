"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringListParameter = exports.StringParameter = exports.ParameterTier = exports.ParameterDataType = exports.ParameterType = exports.ParameterValueType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const core_1 = require("@aws-cdk/core");
const ssm = require("./ssm.generated");
const util_1 = require("./util");
/**
 * Basic features shared across all types of SSM Parameters.
 */
class ParameterBase extends core_1.Resource {
    grantRead(grantee) {
        if (this.encryptionKey) {
            this.encryptionKey.grantDecrypt(grantee);
        }
        return iam.Grant.addToPrincipal({
            grantee,
            actions: [
                'ssm:DescribeParameters',
                'ssm:GetParameters',
                'ssm:GetParameter',
                'ssm:GetParameterHistory',
            ],
            resourceArns: [this.parameterArn],
        });
    }
    grantWrite(grantee) {
        if (this.encryptionKey) {
            this.encryptionKey.grantEncrypt(grantee);
        }
        return iam.Grant.addToPrincipal({
            grantee,
            actions: ['ssm:PutParameter'],
            resourceArns: [this.parameterArn],
        });
    }
}
/**
 * The type of CFN SSM Parameter
 *
 * Using specific types can be helpful in catching invalid values
 * at the start of creating or updating a stack. CloudFormation validates
 * the values against existing values in the account.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html#aws-ssm-parameter-types
 */
var ParameterValueType;
(function (ParameterValueType) {
    /**
     * String
     */
    ParameterValueType["STRING"] = "String";
    /**
     * An Availability Zone, such as us-west-2a.
     */
    ParameterValueType["AWS_EC2_AVAILABILITYZONE_NAME"] = "AWS::EC2::AvailabilityZone::Name";
    /**
     * An Amazon EC2 image ID, such as ami-0ff8a91507f77f867.
     */
    ParameterValueType["AWS_EC2_IMAGE_ID"] = "AWS::EC2::Image::Id";
    /**
     * An Amazon EC2 instance ID, such as i-1e731a32.
     */
    ParameterValueType["AWS_EC2_INSTANCE_ID"] = "AWS::EC2::Instance::Id";
    /**
     * An Amazon EC2 key pair name.
     */
    ParameterValueType["AWS_EC2_KEYPAIR_KEYNAME"] = "AWS::EC2::KeyPair::KeyName";
    /**
     * An EC2-Classic or default VPC security group name, such as my-sg-abc.
     */
    ParameterValueType["AWS_EC2_SECURITYGROUP_GROUPNAME"] = "AWS::EC2::SecurityGroup::GroupName";
    /**
     * A security group ID, such as sg-a123fd85.
     */
    ParameterValueType["AWS_EC2_SECURITYGROUP_ID"] = "AWS::EC2::SecurityGroup::Id";
    /**
     * A subnet ID, such as subnet-123a351e.
     */
    ParameterValueType["AWS_EC2_SUBNET_ID"] = "AWS::EC2::Subnet::Id";
    /**
     * An Amazon EBS volume ID, such as vol-3cdd3f56.
     */
    ParameterValueType["AWS_EC2_VOLUME_ID"] = "AWS::EC2::Volume::Id";
    /**
     * A VPC ID, such as vpc-a123baa3.
     */
    ParameterValueType["AWS_EC2_VPC_ID"] = "AWS::EC2::VPC::Id";
    /**
     * An Amazon Route 53 hosted zone ID, such as Z23YXV4OVPL04A.
     */
    ParameterValueType["AWS_ROUTE53_HOSTEDZONE_ID"] = "AWS::Route53::HostedZone::Id";
})(ParameterValueType = exports.ParameterValueType || (exports.ParameterValueType = {}));
/**
 * SSM parameter type
 * @deprecated these types are no longer used
 */
var ParameterType;
(function (ParameterType) {
    /**
     * String
     */
    ParameterType["STRING"] = "String";
    /**
     * Secure String
     *
     * Parameter Store uses an AWS Key Management Service (KMS) customer master key (CMK) to encrypt the parameter value.
     * Parameters of type SecureString cannot be created directly from a CDK application.
     */
    ParameterType["SECURE_STRING"] = "SecureString";
    /**
     * String List
     */
    ParameterType["STRING_LIST"] = "StringList";
    /**
     * An Amazon EC2 image ID, such as ami-0ff8a91507f77f867
     */
    ParameterType["AWS_EC2_IMAGE_ID"] = "AWS::EC2::Image::Id";
})(ParameterType = exports.ParameterType || (exports.ParameterType = {}));
/**
 * SSM parameter data type
 */
var ParameterDataType;
(function (ParameterDataType) {
    /**
     * Text
     */
    ParameterDataType["TEXT"] = "text";
    /**
     * Aws Ec2 Image
     */
    ParameterDataType["AWS_EC2_IMAGE"] = "aws:ec2:image";
})(ParameterDataType = exports.ParameterDataType || (exports.ParameterDataType = {}));
/**
 * SSM parameter tier
 */
var ParameterTier;
(function (ParameterTier) {
    /**
     * String
     */
    ParameterTier["ADVANCED"] = "Advanced";
    /**
     * String
     */
    ParameterTier["INTELLIGENT_TIERING"] = "Intelligent-Tiering";
    /**
     * String
     */
    ParameterTier["STANDARD"] = "Standard";
})(ParameterTier = exports.ParameterTier || (exports.ParameterTier = {}));
/**
 * Creates a new String SSM Parameter.
 * @resource AWS::SSM::Parameter
 *
 * @example
 * const ssmParameter = new ssm.StringParameter(this, 'mySsmParameter', {
 *    parameterName: 'mySsmParameter',
 *    stringValue: 'mySsmParameterValue',
 * });
 */
class StringParameter extends ParameterBase {
    /**
     * Imports an external string parameter by name.
     */
    static fromStringParameterName(scope, id, stringParameterName) {
        return this.fromStringParameterAttributes(scope, id, { parameterName: stringParameterName });
    }
    /**
     * Imports an external string parameter with name and optional version.
     */
    static fromStringParameterAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ssm_StringParameterAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromStringParameterAttributes);
            }
            throw error;
        }
        if (!attrs.parameterName) {
            throw new Error('parameterName cannot be an empty string');
        }
        if (attrs.type && ![ParameterType.STRING, ParameterType.AWS_EC2_IMAGE_ID].includes(attrs.type)) {
            throw new Error(`fromStringParameterAttributes does not support ${attrs.type}. Please use ParameterType.STRING or ParameterType.AWS_EC2_IMAGE_ID`);
        }
        const type = attrs.type ?? attrs.valueType ?? ParameterValueType.STRING;
        const stringValue = attrs.version
            ? new core_1.CfnDynamicReference(core_1.CfnDynamicReferenceService.SSM, `${attrs.parameterName}:${core_1.Tokenization.stringifyNumber(attrs.version)}`).toString()
            : new core_1.CfnParameter(scope, `${id}.Parameter`, { type: `AWS::SSM::Parameter::Value<${type}>`, default: attrs.parameterName }).valueAsString;
        class Import extends ParameterBase {
            constructor() {
                super(...arguments);
                this.parameterName = attrs.parameterName;
                this.parameterArn = (0, util_1.arnForParameterName)(this, attrs.parameterName, { simpleName: attrs.simpleName });
                this.parameterType = ParameterType.STRING; // this is the type returned by CFN @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html#aws-resource-ssm-parameter-return-values
                this.stringValue = stringValue;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Imports a secure string parameter from the SSM parameter store.
     */
    static fromSecureStringParameterAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ssm_SecureStringParameterAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromSecureStringParameterAttributes);
            }
            throw error;
        }
        const version = attrs.version ? core_1.Tokenization.stringifyNumber(attrs.version) : '';
        const stringValue = new core_1.CfnDynamicReference(core_1.CfnDynamicReferenceService.SSM_SECURE, version ? `${attrs.parameterName}:${version}` : attrs.parameterName).toString();
        class Import extends ParameterBase {
            constructor() {
                super(...arguments);
                this.parameterName = attrs.parameterName;
                this.parameterArn = (0, util_1.arnForParameterName)(this, attrs.parameterName, { simpleName: attrs.simpleName });
                this.parameterType = ParameterType.SECURE_STRING;
                this.stringValue = stringValue;
                this.encryptionKey = attrs.encryptionKey;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Reads the value of an SSM parameter during synthesis through an
     * environmental context provider.
     *
     * Requires that the stack this scope is defined in will have explicit
     * account/region information. Otherwise, it will fail during synthesis.
     */
    static valueFromLookup(scope, parameterName) {
        const value = core_1.ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.SSM_PARAMETER_PROVIDER,
            props: { parameterName },
            dummyValue: `dummy-value-for-${parameterName}`,
        }).value;
        return value;
    }
    /**
     * Returns a token that will resolve (during deployment) to the string value of an SSM string parameter.
     * @param scope Some scope within a stack
     * @param parameterName The name of the SSM parameter.
     * @param version The parameter version (recommended in order to ensure that the value won't change during deployment)
     */
    static valueForStringParameter(scope, parameterName, version) {
        return StringParameter.valueForTypedStringParameterV2(scope, parameterName, ParameterValueType.STRING, version);
    }
    /**
     * Returns a token that will resolve (during deployment) to the string value of an SSM string parameter.
     * @param scope Some scope within a stack
     * @param parameterName The name of the SSM parameter.
     * @param type The type of the SSM parameter.
     * @param version The parameter version (recommended in order to ensure that the value won't change during deployment)
     */
    static valueForTypedStringParameterV2(scope, parameterName, type = ParameterValueType.STRING, version) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ssm_ParameterValueType(type);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.valueForTypedStringParameterV2);
            }
            throw error;
        }
        const stack = core_1.Stack.of(scope);
        const id = makeIdentityForImportedValue(parameterName);
        const exists = stack.node.tryFindChild(id);
        if (exists) {
            return exists.stringValue;
        }
        return this.fromStringParameterAttributes(stack, id, { parameterName, version, valueType: type }).stringValue;
    }
    /**
     * Returns a token that will resolve (during deployment) to the string value of an SSM string parameter.
     * @param scope Some scope within a stack
     * @param parameterName The name of the SSM parameter.
     * @param type The type of the SSM parameter.
     * @param version The parameter version (recommended in order to ensure that the value won't change during deployment)
     * @deprecated - use valueForTypedStringParameterV2 instead
     */
    static valueForTypedStringParameter(scope, parameterName, type = ParameterType.STRING, version) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-ssm.StringParameter#valueForTypedStringParameter", "- use valueForTypedStringParameterV2 instead");
            jsiiDeprecationWarnings._aws_cdk_aws_ssm_ParameterType(type);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.valueForTypedStringParameter);
            }
            throw error;
        }
        if (type === ParameterType.STRING_LIST) {
            throw new Error('valueForTypedStringParameter does not support STRING_LIST, '
                + 'use valueForTypedListParameter instead');
        }
        const stack = core_1.Stack.of(scope);
        const id = makeIdentityForImportedValue(parameterName);
        const exists = stack.node.tryFindChild(id);
        if (exists) {
            return exists.stringValue;
        }
        return this.fromStringParameterAttributes(stack, id, { parameterName, version, type }).stringValue;
    }
    /**
     * Returns a token that will resolve (during deployment)
     * @param scope Some scope within a stack
     * @param parameterName The name of the SSM parameter
     * @param version The parameter version (required for secure strings)
     * @deprecated Use `SecretValue.ssmSecure()` instead, it will correctly type the imported value as a `SecretValue` and allow importing without version.
     */
    static valueForSecureStringParameter(scope, parameterName, version) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-ssm.StringParameter#valueForSecureStringParameter", "Use `SecretValue.ssmSecure()` instead, it will correctly type the imported value as a `SecretValue` and allow importing without version.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.valueForSecureStringParameter);
            }
            throw error;
        }
        const stack = core_1.Stack.of(scope);
        const id = makeIdentityForImportedValue(parameterName);
        const exists = stack.node.tryFindChild(id);
        if (exists) {
            return exists.stringValue;
        }
        return this.fromSecureStringParameterAttributes(stack, id, { parameterName, version }).stringValue;
    }
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.parameterName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ssm_StringParameterProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, StringParameter);
            }
            throw error;
        }
        if (props.allowedPattern) {
            _assertValidValue(props.stringValue, props.allowedPattern);
        }
        validateParameterName(this.physicalName);
        if (props.description && props.description?.length > 1024) {
            throw new Error('Description cannot be longer than 1024 characters.');
        }
        if (props.type && props.type === ParameterType.AWS_EC2_IMAGE_ID) {
            throw new Error('The type must either be ParameterType.STRING or ParameterType.STRING_LIST. Did you mean to set dataType: ParameterDataType.AWS_EC2_IMAGE instead?');
        }
        const resource = new ssm.CfnParameter(this, 'Resource', {
            allowedPattern: props.allowedPattern,
            description: props.description,
            name: this.physicalName,
            tier: props.tier,
            type: props.type || ParameterType.STRING,
            dataType: props.dataType,
            value: props.stringValue,
        });
        this.parameterName = this.getResourceNameAttribute(resource.ref);
        this.parameterArn = (0, util_1.arnForParameterName)(this, this.parameterName, {
            physicalName: props.parameterName || util_1.AUTOGEN_MARKER,
            simpleName: props.simpleName,
        });
        this.parameterType = resource.attrType;
        this.stringValue = resource.attrValue;
    }
}
_a = JSII_RTTI_SYMBOL_1;
StringParameter[_a] = { fqn: "@aws-cdk/aws-ssm.StringParameter", version: "0.0.0" };
exports.StringParameter = StringParameter;
/**
 * Creates a new StringList SSM Parameter.
 * @resource AWS::SSM::Parameter
 */
class StringListParameter extends ParameterBase {
    /**
     * Imports an external parameter of type string list.
     * Returns a token and should not be parsed.
     */
    static fromStringListParameterName(scope, id, stringListParameterName) {
        class Import extends ParameterBase {
            constructor() {
                super(...arguments);
                this.parameterName = stringListParameterName;
                this.parameterArn = (0, util_1.arnForParameterName)(this, this.parameterName);
                this.parameterType = ParameterType.STRING_LIST;
                this.stringListValue = core_1.Fn.split(',', new core_1.CfnDynamicReference(core_1.CfnDynamicReferenceService.SSM, stringListParameterName).toString());
            }
        }
        return new Import(scope, id);
    }
    /**
     * Imports an external string list parameter with name and optional version.
     */
    static fromListParameterAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ssm_ListParameterAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromListParameterAttributes);
            }
            throw error;
        }
        if (!attrs.parameterName) {
            throw new Error('parameterName cannot be an empty string');
        }
        const type = attrs.elementType ?? ParameterValueType.STRING;
        const valueType = `List<${type}>`;
        const stringValue = attrs.version
            ? new core_1.CfnDynamicReference(core_1.CfnDynamicReferenceService.SSM, `${attrs.parameterName}:${core_1.Tokenization.stringifyNumber(attrs.version)}`).toStringList()
            : new core_1.CfnParameter(scope, `${id}.Parameter`, { type: `AWS::SSM::Parameter::Value<${valueType}>`, default: attrs.parameterName }).valueAsList;
        class Import extends ParameterBase {
            constructor() {
                super(...arguments);
                this.parameterName = attrs.parameterName;
                this.parameterArn = (0, util_1.arnForParameterName)(this, attrs.parameterName, { simpleName: attrs.simpleName });
                this.parameterType = valueType; // it doesn't really matter what this is since a CfnParameter can only be `String | StringList`
                this.stringListValue = stringValue;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Returns a token that will resolve (during deployment) to the list value of an SSM StringList parameter.
     * @param scope Some scope within a stack
     * @param parameterName The name of the SSM parameter.
     * @param type the type of the SSM list parameter
     * @param version The parameter version (recommended in order to ensure that the value won't change during deployment)
     */
    static valueForTypedListParameter(scope, parameterName, type = ParameterValueType.STRING, version) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ssm_ParameterValueType(type);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.valueForTypedListParameter);
            }
            throw error;
        }
        const stack = core_1.Stack.of(scope);
        const id = makeIdentityForImportedValue(parameterName);
        const exists = stack.node.tryFindChild(id);
        if (exists) {
            return exists.stringListValue;
        }
        return this.fromListParameterAttributes(stack, id, { parameterName, elementType: type, version }).stringListValue;
    }
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.parameterName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ssm_StringListParameterProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, StringListParameter);
            }
            throw error;
        }
        if (props.stringListValue.find(str => !core_1.Token.isUnresolved(str) && str.indexOf(',') !== -1)) {
            throw new Error('Values of a StringList SSM Parameter cannot contain the \',\' character. Use a string parameter instead.');
        }
        if (props.allowedPattern && !core_1.Token.isUnresolved(props.stringListValue)) {
            props.stringListValue.forEach(str => _assertValidValue(str, props.allowedPattern));
        }
        validateParameterName(this.physicalName);
        if (props.description && props.description?.length > 1024) {
            throw new Error('Description cannot be longer than 1024 characters.');
        }
        const resource = new ssm.CfnParameter(this, 'Resource', {
            allowedPattern: props.allowedPattern,
            description: props.description,
            name: this.physicalName,
            tier: props.tier,
            type: ParameterType.STRING_LIST,
            value: core_1.Fn.join(',', props.stringListValue),
        });
        this.parameterName = this.getResourceNameAttribute(resource.ref);
        this.parameterArn = (0, util_1.arnForParameterName)(this, this.parameterName, {
            physicalName: props.parameterName || util_1.AUTOGEN_MARKER,
            simpleName: props.simpleName,
        });
        this.parameterType = resource.attrType;
        this.stringListValue = core_1.Fn.split(',', resource.attrValue);
    }
}
_b = JSII_RTTI_SYMBOL_1;
StringListParameter[_b] = { fqn: "@aws-cdk/aws-ssm.StringListParameter", version: "0.0.0" };
exports.StringListParameter = StringListParameter;
/**
 * Validates whether a supplied value conforms to the allowedPattern, granted neither is an unresolved token.
 *
 * @param value          the value to be validated.
 * @param allowedPattern the regular expression to use for validation.
 *
 * @throws if the ``value`` does not conform to the ``allowedPattern`` and neither is an unresolved token (per
 *         ``cdk.unresolved``).
 */
function _assertValidValue(value, allowedPattern) {
    if (core_1.Token.isUnresolved(value) || core_1.Token.isUnresolved(allowedPattern)) {
        // Unable to perform validations against unresolved tokens
        return;
    }
    if (!new RegExp(allowedPattern).test(value)) {
        throw new Error(`The supplied value (${value}) does not match the specified allowedPattern (${allowedPattern})`);
    }
}
function makeIdentityForImportedValue(parameterName) {
    return `SsmParameterValue:${parameterName}:C96584B6-F00A-464E-AD19-53AFF4B05118`;
}
function validateParameterName(parameterName) {
    if (core_1.Token.isUnresolved(parameterName)) {
        return;
    }
    if (parameterName.length > 2048) {
        throw new Error('name cannot be longer than 2048 characters.');
    }
    if (!parameterName.match(/^[\/\w.-]+$/)) {
        throw new Error(`name must only contain letters, numbers, and the following 4 symbols .-_/; got ${parameterName}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW1ldGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFyYW1ldGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUV4QywyREFBMkQ7QUFDM0Qsd0NBSXVCO0FBRXZCLHVDQUF1QztBQUN2QyxpQ0FBNkQ7QUFxSjdEOztHQUVHO0FBQ0gsTUFBZSxhQUFjLFNBQVEsZUFBUTtJQVlwQyxTQUFTLENBQUMsT0FBdUI7UUFDdEMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztZQUM5QixPQUFPO1lBQ1AsT0FBTyxFQUFFO2dCQUNQLHdCQUF3QjtnQkFDeEIsbUJBQW1CO2dCQUNuQixrQkFBa0I7Z0JBQ2xCLHlCQUF5QjthQUMxQjtZQUNELFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7U0FDbEMsQ0FBQyxDQUFDO0tBQ0o7SUFFTSxVQUFVLENBQUMsT0FBdUI7UUFDdkMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztZQUM5QixPQUFPO1lBQ1AsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUM7WUFDN0IsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztTQUNsQyxDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxJQUFZLGtCQXVEWDtBQXZERCxXQUFZLGtCQUFrQjtJQUM1Qjs7T0FFRztJQUNILHVDQUFpQixDQUFBO0lBRWpCOztPQUVHO0lBQ0gsd0ZBQWtFLENBQUE7SUFFbEU7O09BRUc7SUFDSCw4REFBd0Ms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aW1wb3J0ICogYXMga21zIGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCB7XG4gIENmbkR5bmFtaWNSZWZlcmVuY2UsIENmbkR5bmFtaWNSZWZlcmVuY2VTZXJ2aWNlLCBDZm5QYXJhbWV0ZXIsXG4gIENvbnRleHRQcm92aWRlciwgRm4sIElSZXNvdXJjZSwgUmVzb3VyY2UsIFN0YWNrLCBUb2tlbixcbiAgVG9rZW5pemF0aW9uLFxufSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgc3NtIGZyb20gJy4vc3NtLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBhcm5Gb3JQYXJhbWV0ZXJOYW1lLCBBVVRPR0VOX01BUktFUiB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogQW4gU1NNIFBhcmFtZXRlciByZWZlcmVuY2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVBhcmFtZXRlciBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBTU00gUGFyYW1ldGVyIHJlc291cmNlLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBwYXJhbWV0ZXJBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIFNTTSBQYXJhbWV0ZXIgcmVzb3VyY2UuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHBhcmFtZXRlck5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdGhlIFNTTSBQYXJhbWV0ZXIgcmVzb3VyY2UuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHBhcmFtZXRlclR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogR3JhbnRzIHJlYWQgKERlc2NyaWJlUGFyYW1ldGVyLCBHZXRQYXJhbWV0ZXIsIEdldFBhcmFtZXRlckhpc3RvcnkpIHBlcm1pc3Npb25zIG9uIHRoZSBTU00gUGFyYW1ldGVyLlxuICAgKlxuICAgKiBAcGFyYW0gZ3JhbnRlZSB0aGUgcm9sZSB0byBiZSBncmFudGVkIHJlYWQtb25seSBhY2Nlc3MgdG8gdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIGdyYW50UmVhZChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnRzIHdyaXRlIChQdXRQYXJhbWV0ZXIpIHBlcm1pc3Npb25zIG9uIHRoZSBTU00gUGFyYW1ldGVyLlxuICAgKlxuICAgKiBAcGFyYW0gZ3JhbnRlZSB0aGUgcm9sZSB0byBiZSBncmFudGVkIHdyaXRlIGFjY2VzcyB0byB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgZ3JhbnRXcml0ZShncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudDtcbn1cblxuLyoqXG4gKiBBIFN0cmluZyBTU00gUGFyYW1ldGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElTdHJpbmdQYXJhbWV0ZXIgZXh0ZW5kcyBJUGFyYW1ldGVyIHtcbiAgLyoqXG4gICAqIFRoZSBwYXJhbWV0ZXIgdmFsdWUuIFZhbHVlIG11c3Qgbm90IG5lc3QgYW5vdGhlciBwYXJhbWV0ZXIuIERvIG5vdCB1c2Uge3t9fSBpbiB0aGUgdmFsdWUuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGUgVmFsdWVcbiAgICovXG4gIHJlYWRvbmx5IHN0cmluZ1ZhbHVlOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBTdHJpbmdMaXN0IFNTTSBQYXJhbWV0ZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVN0cmluZ0xpc3RQYXJhbWV0ZXIgZXh0ZW5kcyBJUGFyYW1ldGVyIHtcbiAgLyoqXG4gICAqIFRoZSBwYXJhbWV0ZXIgdmFsdWUuIFZhbHVlIG11c3Qgbm90IG5lc3QgYW5vdGhlciBwYXJhbWV0ZXIuIERvIG5vdCB1c2Uge3t9fSBpbiB0aGUgdmFsdWUuIFZhbHVlcyBpbiB0aGUgYXJyYXlcbiAgICogY2Fubm90IGNvbnRhaW4gY29tbWFzIChgYCxgYCkuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGUgVmFsdWVcbiAgICovXG4gIHJlYWRvbmx5IHN0cmluZ0xpc3RWYWx1ZTogc3RyaW5nW107XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBuZWVkZWQgdG8gY3JlYXRlIGEgbmV3IFNTTSBQYXJhbWV0ZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUGFyYW1ldGVyT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBIHJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkIHRvIHZhbGlkYXRlIHRoZSBwYXJhbWV0ZXIgdmFsdWUuIEZvciBleGFtcGxlLCBmb3IgU3RyaW5nIHR5cGVzIHdpdGggdmFsdWVzIHJlc3RyaWN0ZWQgdG9cbiAgICogbnVtYmVycywgeW91IGNhbiBzcGVjaWZ5IHRoZSBmb2xsb3dpbmc6IGBgXlxcZCskYGBcbiAgICpcbiAgICogQGRlZmF1bHQgbm8gdmFsaWRhdGlvbiBpcyBwZXJmb3JtZWRcbiAgICovXG4gIHJlYWRvbmx5IGFsbG93ZWRQYXR0ZXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgcGFyYW1ldGVyIHRoYXQgeW91IHdhbnQgdG8gYWRkIHRvIHRoZSBzeXN0ZW0uXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGEgbmFtZSB3aWxsIGJlIGdlbmVyYXRlZCBieSBDbG91ZEZvcm1hdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgcGFyYW1ldGVyTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogSW5kaWNhdGVzIG9mIHRoZSBwYXJhbWV0ZXIgbmFtZSBpcyBhIHNpbXBsZSBuYW1lIChpLmUuIGRvZXMgbm90IGluY2x1ZGUgXCIvXCJcbiAgICogc2VwYXJhdG9ycykuXG4gICAqXG4gICAqIFRoaXMgaXMgb25seSByZXF1aXJlZCBvbmx5IGlmIGBwYXJhbWV0ZXJOYW1lYCBpcyBhIHRva2VuLCB3aGljaCBtZWFucyB3ZVxuICAgKiBhcmUgdW5hYmxlIHRvIGRldGVjdCBpZiB0aGUgbmFtZSBpcyBzaW1wbGUgb3IgXCJwYXRoLWxpa2VcIiBmb3IgdGhlIHB1cnBvc2VcbiAgICogb2YgcmVuZGVyaW5nIFNTTSBwYXJhbWV0ZXIgQVJOcy5cbiAgICpcbiAgICogSWYgYHBhcmFtZXRlck5hbWVgIGlzIG5vdCBzcGVjaWZpZWQsIGBzaW1wbGVOYW1lYCBtdXN0IGJlIGB0cnVlYCAob3JcbiAgICogdW5kZWZpbmVkKSBzaW5jZSB0aGUgbmFtZSBnZW5lcmF0ZWQgYnkgQVdTIENsb3VkRm9ybWF0aW9uIGlzIGFsd2F5cyBhXG4gICAqIHNpbXBsZSBuYW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGF1dG8tZGV0ZWN0IGJhc2VkIG9uIGBwYXJhbWV0ZXJOYW1lYFxuICAgKi9cbiAgcmVhZG9ubHkgc2ltcGxlTmFtZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSB0aWVyIG9mIHRoZSBzdHJpbmcgcGFyYW1ldGVyXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdW5kZWZpbmVkXG4gICAqL1xuICByZWFkb25seSB0aWVyPzogUGFyYW1ldGVyVGllcjtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIG5lZWRlZCB0byBjcmVhdGUgYSBTdHJpbmcgU1NNIHBhcmFtZXRlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdQYXJhbWV0ZXJQcm9wcyBleHRlbmRzIFBhcmFtZXRlck9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuIEl0IG1heSBub3QgcmVmZXJlbmNlIGFub3RoZXIgcGFyYW1ldGVyIGFuZCBgYHt7fX1gYCBjYW5ub3QgYmUgdXNlZCBpbiB0aGUgdmFsdWUuXG4gICAqL1xuICByZWFkb25seSBzdHJpbmdWYWx1ZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0aGUgc3RyaW5nIHBhcmFtZXRlclxuICAgKlxuICAgKiBAZGVmYXVsdCBQYXJhbWV0ZXJUeXBlLlNUUklOR1xuICAgKiBAZGVwcmVjYXRlZCAtIHR5cGUgd2lsbCBhbHdheXMgYmUgJ1N0cmluZydcbiAgICovXG4gIHJlYWRvbmx5IHR5cGU/OiBQYXJhbWV0ZXJUeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF0YSB0eXBlIG9mIHRoZSBwYXJhbWV0ZXIsIHN1Y2ggYXMgYHRleHRgIG9yIGBhd3M6ZWMyOmltYWdlYC5cbiAgICpcbiAgICogQGRlZmF1bHQgUGFyYW1ldGVyRGF0YVR5cGUuVEVYVFxuICAgKi9cbiAgcmVhZG9ubHkgZGF0YVR5cGU/OiBQYXJhbWV0ZXJEYXRhVHlwZTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIG5lZWRlZCB0byBjcmVhdGUgYSBTdHJpbmdMaXN0IFNTTSBQYXJhbWV0ZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdMaXN0UGFyYW1ldGVyUHJvcHMgZXh0ZW5kcyBQYXJhbWV0ZXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSB2YWx1ZXMgb2YgdGhlIHBhcmFtZXRlci4gSXQgbWF5IG5vdCByZWZlcmVuY2UgYW5vdGhlciBwYXJhbWV0ZXIgYW5kIGBge3t9fWBgIGNhbm5vdCBiZSB1c2VkIGluIHRoZSB2YWx1ZS5cbiAgICovXG4gIHJlYWRvbmx5IHN0cmluZ0xpc3RWYWx1ZTogc3RyaW5nW107XG59XG5cbi8qKlxuICogQmFzaWMgZmVhdHVyZXMgc2hhcmVkIGFjcm9zcyBhbGwgdHlwZXMgb2YgU1NNIFBhcmFtZXRlcnMuXG4gKi9cbmFic3RyYWN0IGNsYXNzIFBhcmFtZXRlckJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElQYXJhbWV0ZXIge1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgcGFyYW1ldGVyQXJuOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBwYXJhbWV0ZXJOYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBwYXJhbWV0ZXJUeXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBlbmNyeXB0aW9uIGtleSB0aGF0IGlzIHVzZWQgdG8gZW5jcnlwdCB0aGlzIHBhcmFtZXRlci5cbiAgICpcbiAgICogKiBAZGVmYXVsdCAtIGRlZmF1bHQgbWFzdGVyIGtleVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGVuY3J5cHRpb25LZXk/OiBrbXMuSUtleTtcblxuICBwdWJsaWMgZ3JhbnRSZWFkKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHtcbiAgICBpZiAodGhpcy5lbmNyeXB0aW9uS2V5KSB7XG4gICAgICB0aGlzLmVuY3J5cHRpb25LZXkuZ3JhbnREZWNyeXB0KGdyYW50ZWUpO1xuICAgIH1cbiAgICByZXR1cm4gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWUsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICdzc206RGVzY3JpYmVQYXJhbWV0ZXJzJyxcbiAgICAgICAgJ3NzbTpHZXRQYXJhbWV0ZXJzJyxcbiAgICAgICAgJ3NzbTpHZXRQYXJhbWV0ZXInLFxuICAgICAgICAnc3NtOkdldFBhcmFtZXRlckhpc3RvcnknLFxuICAgICAgXSxcbiAgICAgIHJlc291cmNlQXJuczogW3RoaXMucGFyYW1ldGVyQXJuXSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudFdyaXRlKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHtcbiAgICBpZiAodGhpcy5lbmNyeXB0aW9uS2V5KSB7XG4gICAgICB0aGlzLmVuY3J5cHRpb25LZXkuZ3JhbnRFbmNyeXB0KGdyYW50ZWUpO1xuICAgIH1cbiAgICByZXR1cm4gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWUsXG4gICAgICBhY3Rpb25zOiBbJ3NzbTpQdXRQYXJhbWV0ZXInXSxcbiAgICAgIHJlc291cmNlQXJuczogW3RoaXMucGFyYW1ldGVyQXJuXSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSB0eXBlIG9mIENGTiBTU00gUGFyYW1ldGVyXG4gKlxuICogVXNpbmcgc3BlY2lmaWMgdHlwZXMgY2FuIGJlIGhlbHBmdWwgaW4gY2F0Y2hpbmcgaW52YWxpZCB2YWx1ZXNcbiAqIGF0IHRoZSBzdGFydCBvZiBjcmVhdGluZyBvciB1cGRhdGluZyBhIHN0YWNrLiBDbG91ZEZvcm1hdGlvbiB2YWxpZGF0ZXNcbiAqIHRoZSB2YWx1ZXMgYWdhaW5zdCBleGlzdGluZyB2YWx1ZXMgaW4gdGhlIGFjY291bnQuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9wYXJhbWV0ZXJzLXNlY3Rpb24tc3RydWN0dXJlLmh0bWwjYXdzLXNzbS1wYXJhbWV0ZXItdHlwZXNcbiAqL1xuZXhwb3J0IGVudW0gUGFyYW1ldGVyVmFsdWVUeXBlIHtcbiAgLyoqXG4gICAqIFN0cmluZ1xuICAgKi9cbiAgU1RSSU5HID0gJ1N0cmluZycsXG5cbiAgLyoqXG4gICAqIEFuIEF2YWlsYWJpbGl0eSBab25lLCBzdWNoIGFzIHVzLXdlc3QtMmEuXG4gICAqL1xuICBBV1NfRUMyX0FWQUlMQUJJTElUWVpPTkVfTkFNRSA9ICdBV1M6OkVDMjo6QXZhaWxhYmlsaXR5Wm9uZTo6TmFtZScsXG5cbiAgLyoqXG4gICAqIEFuIEFtYXpvbiBFQzIgaW1hZ2UgSUQsIHN1Y2ggYXMgYW1pLTBmZjhhOTE1MDdmNzdmODY3LlxuICAgKi9cbiAgQVdTX0VDMl9JTUFHRV9JRCA9ICdBV1M6OkVDMjo6SW1hZ2U6OklkJyxcblxuICAvKipcbiAgICogQW4gQW1hem9uIEVDMiBpbnN0YW5jZSBJRCwgc3VjaCBhcyBpLTFlNzMxYTMyLlxuICAgKi9cbiAgQVdTX0VDMl9JTlNUQU5DRV9JRCA9ICdBV1M6OkVDMjo6SW5zdGFuY2U6OklkJyxcblxuICAvKipcbiAgICogQW4gQW1hem9uIEVDMiBrZXkgcGFpciBuYW1lLlxuICAgKi9cbiAgQVdTX0VDMl9LRVlQQUlSX0tFWU5BTUUgPSAnQVdTOjpFQzI6OktleVBhaXI6OktleU5hbWUnLFxuXG4gIC8qKlxuICAgKiBBbiBFQzItQ2xhc3NpYyBvciBkZWZhdWx0IFZQQyBzZWN1cml0eSBncm91cCBuYW1lLCBzdWNoIGFzIG15LXNnLWFiYy5cbiAgICovXG4gIEFXU19FQzJfU0VDVVJJVFlHUk9VUF9HUk9VUE5BTUUgPSAnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXA6Okdyb3VwTmFtZScsXG5cbiAgLyoqXG4gICAqIEEgc2VjdXJpdHkgZ3JvdXAgSUQsIHN1Y2ggYXMgc2ctYTEyM2ZkODUuXG4gICAqL1xuICBBV1NfRUMyX1NFQ1VSSVRZR1JPVVBfSUQgPSAnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXA6OklkJyxcblxuICAvKipcbiAgICogQSBzdWJuZXQgSUQsIHN1Y2ggYXMgc3VibmV0LTEyM2EzNTFlLlxuICAgKi9cbiAgQVdTX0VDMl9TVUJORVRfSUQgPSAnQVdTOjpFQzI6OlN1Ym5ldDo6SWQnLFxuXG4gIC8qKlxuICAgKiBBbiBBbWF6b24gRUJTIHZvbHVtZSBJRCwgc3VjaCBhcyB2b2wtM2NkZDNmNTYuXG4gICAqL1xuICBBV1NfRUMyX1ZPTFVNRV9JRCA9ICdBV1M6OkVDMjo6Vm9sdW1lOjpJZCcsXG5cbiAgLyoqXG4gICAqIEEgVlBDIElELCBzdWNoIGFzIHZwYy1hMTIzYmFhMy5cbiAgICovXG4gIEFXU19FQzJfVlBDX0lEID0gJ0FXUzo6RUMyOjpWUEM6OklkJyxcblxuICAvKipcbiAgICogQW4gQW1hem9uIFJvdXRlIDUzIGhvc3RlZCB6b25lIElELCBzdWNoIGFzIFoyM1lYVjRPVlBMMDRBLlxuICAgKi9cbiAgQVdTX1JPVVRFNTNfSE9TVEVEWk9ORV9JRCA9ICdBV1M6OlJvdXRlNTM6Okhvc3RlZFpvbmU6OklkJyxcbn1cblxuLyoqXG4gKiBTU00gcGFyYW1ldGVyIHR5cGVcbiAqIEBkZXByZWNhdGVkIHRoZXNlIHR5cGVzIGFyZSBubyBsb25nZXIgdXNlZFxuICovXG5leHBvcnQgZW51bSBQYXJhbWV0ZXJUeXBlIHtcbiAgLyoqXG4gICAqIFN0cmluZ1xuICAgKi9cbiAgU1RSSU5HID0gJ1N0cmluZycsXG4gIC8qKlxuICAgKiBTZWN1cmUgU3RyaW5nXG4gICAqXG4gICAqIFBhcmFtZXRlciBTdG9yZSB1c2VzIGFuIEFXUyBLZXkgTWFuYWdlbWVudCBTZXJ2aWNlIChLTVMpIGN1c3RvbWVyIG1hc3RlciBrZXkgKENNSykgdG8gZW5jcnlwdCB0aGUgcGFyYW1ldGVyIHZhbHVlLlxuICAgKiBQYXJhbWV0ZXJzIG9mIHR5cGUgU2VjdXJlU3RyaW5nIGNhbm5vdCBiZSBjcmVhdGVkIGRpcmVjdGx5IGZyb20gYSBDREsgYXBwbGljYXRpb24uXG4gICAqL1xuICBTRUNVUkVfU1RSSU5HID0gJ1NlY3VyZVN0cmluZycsXG4gIC8qKlxuICAgKiBTdHJpbmcgTGlzdFxuICAgKi9cbiAgU1RSSU5HX0xJU1QgPSAnU3RyaW5nTGlzdCcsXG4gIC8qKlxuICAgKiBBbiBBbWF6b24gRUMyIGltYWdlIElELCBzdWNoIGFzIGFtaS0wZmY4YTkxNTA3Zjc3Zjg2N1xuICAgKi9cbiAgQVdTX0VDMl9JTUFHRV9JRCA9ICdBV1M6OkVDMjo6SW1hZ2U6OklkJyxcbn1cblxuLyoqXG4gKiBTU00gcGFyYW1ldGVyIGRhdGEgdHlwZVxuICovXG5leHBvcnQgZW51bSBQYXJhbWV0ZXJEYXRhVHlwZSB7XG4gIC8qKlxuICAgKiBUZXh0XG4gICAqL1xuICBURVhUID0gJ3RleHQnLFxuICAvKipcbiAgICogQXdzIEVjMiBJbWFnZVxuICAgKi9cbiAgQVdTX0VDMl9JTUFHRSA9ICdhd3M6ZWMyOmltYWdlJyxcbn1cblxuLyoqXG4gKiBTU00gcGFyYW1ldGVyIHRpZXJcbiAqL1xuZXhwb3J0IGVudW0gUGFyYW1ldGVyVGllciB7XG4gIC8qKlxuICAgKiBTdHJpbmdcbiAgICovXG4gIEFEVkFOQ0VEID0gJ0FkdmFuY2VkJyxcbiAgLyoqXG4gICAqIFN0cmluZ1xuICAgKi9cbiAgSU5URUxMSUdFTlRfVElFUklORyA9ICdJbnRlbGxpZ2VudC1UaWVyaW5nJyxcbiAgLyoqXG4gICAqIFN0cmluZ1xuICAgKi9cbiAgU1RBTkRBUkQgPSAnU3RhbmRhcmQnLFxufVxuXG4vKipcbiAqIENvbW1vbiBhdHRyaWJ1dGVzIGZvciBzdHJpbmcgcGFyYW1ldGVycy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb21tb25TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBwYXJhbWV0ZXIgc3RvcmUgdmFsdWUuXG4gICAqXG4gICAqIFRoaXMgdmFsdWUgY2FuIGJlIGEgdG9rZW4gb3IgYSBjb25jcmV0ZSBzdHJpbmcuIElmIGl0IGlzIGEgY29uY3JldGUgc3RyaW5nXG4gICAqIGFuZCBpbmNsdWRlcyBcIi9cIiBpdCBtdXN0IGFsc28gYmUgcHJlZml4ZWQgd2l0aCBhIFwiL1wiIChmdWxseS1xdWFsaWZpZWQpLlxuICAgKi9cbiAgcmVhZG9ubHkgcGFyYW1ldGVyTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgb2YgdGhlIHBhcmFtZXRlciBuYW1lIGlzIGEgc2ltcGxlIG5hbWUgKGkuZS4gZG9lcyBub3QgaW5jbHVkZSBcIi9cIlxuICAgKiBzZXBhcmF0b3JzKS5cbiAgICpcbiAgICogVGhpcyBpcyBvbmx5IHJlcXVpcmVkIG9ubHkgaWYgYHBhcmFtZXRlck5hbWVgIGlzIGEgdG9rZW4sIHdoaWNoIG1lYW5zIHdlXG4gICAqIGFyZSB1bmFibGUgdG8gZGV0ZWN0IGlmIHRoZSBuYW1lIGlzIHNpbXBsZSBvciBcInBhdGgtbGlrZVwiIGZvciB0aGUgcHVycG9zZVxuICAgKiBvZiByZW5kZXJpbmcgU1NNIHBhcmFtZXRlciBBUk5zLlxuICAgKlxuICAgKiBJZiBgcGFyYW1ldGVyTmFtZWAgaXMgbm90IHNwZWNpZmllZCwgYHNpbXBsZU5hbWVgIG11c3QgYmUgYHRydWVgIChvclxuICAgKiB1bmRlZmluZWQpIHNpbmNlIHRoZSBuYW1lIGdlbmVyYXRlZCBieSBBV1MgQ2xvdWRGb3JtYXRpb24gaXMgYWx3YXlzIGFcbiAgICogc2ltcGxlIG5hbWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYXV0by1kZXRlY3QgYmFzZWQgb24gYHBhcmFtZXRlck5hbWVgXG4gICAqL1xuICByZWFkb25seSBzaW1wbGVOYW1lPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBdHRyaWJ1dGVzIGZvciBwYXJhbWV0ZXJzIG9mIHZhcmlvdXMgdHlwZXMgb2Ygc3RyaW5nLlxuICpcbiAqIEBzZWUgUGFyYW1ldGVyVHlwZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMgZXh0ZW5kcyBDb21tb25TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIG51bWJlciBvZiB0aGUgdmFsdWUgeW91IHdpc2ggdG8gcmV0cmlldmUuXG4gICAqXG4gICAqIEBkZWZhdWx0IFRoZSBsYXRlc3QgdmVyc2lvbiB3aWxsIGJlIHJldHJpZXZlZC5cbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb24/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRoZSBzdHJpbmcgcGFyYW1ldGVyXG4gICAqXG4gICAqIEBkZWZhdWx0IFBhcmFtZXRlclR5cGUuU1RSSU5HXG4gICAqIEBkZXByZWNhdGVkIC0gdXNlIHZhbHVlVHlwZSBpbnN0ZWFkXG4gICAqL1xuICByZWFkb25seSB0eXBlPzogUGFyYW1ldGVyVHlwZTtcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdGhlIHN0cmluZyBwYXJhbWV0ZXIgdmFsdWVcbiAgICpcbiAgICogVXNpbmcgc3BlY2lmaWMgdHlwZXMgY2FuIGJlIGhlbHBmdWwgaW4gY2F0Y2hpbmcgaW52YWxpZCB2YWx1ZXNcbiAgICogYXQgdGhlIHN0YXJ0IG9mIGNyZWF0aW5nIG9yIHVwZGF0aW5nIGEgc3RhY2suIENsb3VkRm9ybWF0aW9uIHZhbGlkYXRlc1xuICAgKiB0aGUgdmFsdWVzIGFnYWluc3QgZXhpc3RpbmcgdmFsdWVzIGluIHRoZSBhY2NvdW50LlxuICAgKlxuICAgKiBOb3RlIC0gaWYgeW91IHdhbnQgdG8gYWxsb3cgdmFsdWVzIGZyb20gZGlmZmVyZW50IEFXUyBhY2NvdW50cywgdXNlXG4gICAqIFBhcmFtZXRlclZhbHVlVHlwZS5TVFJJTkdcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9wYXJhbWV0ZXJzLXNlY3Rpb24tc3RydWN0dXJlLmh0bWwjYXdzLXNzbS1wYXJhbWV0ZXItdHlwZXNcbiAgICpcbiAgICogQGRlZmF1bHQgUGFyYW1ldGVyVmFsdWVUeXBlLlNUUklOR1xuICAgKi9cbiAgcmVhZG9ubHkgdmFsdWVUeXBlPzogUGFyYW1ldGVyVmFsdWVUeXBlO1xufVxuXG4vKipcbiAqIEF0dHJpYnV0ZXMgZm9yIHBhcmFtZXRlcnMgb2Ygc3RyaW5nIGxpc3QgdHlwZS5cbiAqXG4gKiBAc2VlIFBhcmFtZXRlclR5cGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMaXN0UGFyYW1ldGVyQXR0cmlidXRlcyBleHRlbmRzIENvbW1vblN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIHZlcnNpb24gbnVtYmVyIG9mIHRoZSB2YWx1ZSB5b3Ugd2lzaCB0byByZXRyaWV2ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgVGhlIGxhdGVzdCB2ZXJzaW9uIHdpbGwgYmUgcmV0cmlldmVkLlxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbj86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdGhlIHN0cmluZyBsaXN0IHBhcmFtZXRlciB2YWx1ZS5cbiAgICpcbiAgICogVXNpbmcgc3BlY2lmaWMgdHlwZXMgY2FuIGJlIGhlbHBmdWwgaW4gY2F0Y2hpbmcgaW52YWxpZCB2YWx1ZXNcbiAgICogYXQgdGhlIHN0YXJ0IG9mIGNyZWF0aW5nIG9yIHVwZGF0aW5nIGEgc3RhY2suIENsb3VkRm9ybWF0aW9uIHZhbGlkYXRlc1xuICAgKiB0aGUgdmFsdWVzIGFnYWluc3QgZXhpc3RpbmcgdmFsdWVzIGluIHRoZSBhY2NvdW50LlxuICAgKlxuICAgKiBOb3RlIC0gaWYgeW91IHdhbnQgdG8gYWxsb3cgdmFsdWVzIGZyb20gZGlmZmVyZW50IEFXUyBhY2NvdW50cywgdXNlXG4gICAqIFBhcmFtZXRlclZhbHVlVHlwZS5TVFJJTkdcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9wYXJhbWV0ZXJzLXNlY3Rpb24tc3RydWN0dXJlLmh0bWwjYXdzLXNzbS1wYXJhbWV0ZXItdHlwZXNcbiAgICpcbiAgICogQGRlZmF1bHQgUGFyYW1ldGVyVmFsdWVUeXBlLlNUUklOR1xuICAgKi9cbiAgcmVhZG9ubHkgZWxlbWVudFR5cGU/OiBQYXJhbWV0ZXJWYWx1ZVR5cGU7XG59XG5cbi8qKlxuICogQXR0cmlidXRlcyBmb3Igc2VjdXJlIHN0cmluZyBwYXJhbWV0ZXJzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMgZXh0ZW5kcyBDb21tb25TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIG51bWJlciBvZiB0aGUgdmFsdWUgeW91IHdpc2ggdG8gcmV0cmlldmUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQVdTIENsb3VkRm9ybWF0aW9uIHVzZXMgdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIHRoZSBwYXJhbWV0ZXJcbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb24/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBlbmNyeXB0aW9uIGtleSB0aGF0IGlzIHVzZWQgdG8gZW5jcnlwdCB0aGlzIHBhcmFtZXRlclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGRlZmF1bHQgbWFzdGVyIGtleVxuICAgKi9cbiAgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IGttcy5JS2V5O1xuXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBTdHJpbmcgU1NNIFBhcmFtZXRlci5cbiAqIEByZXNvdXJjZSBBV1M6OlNTTTo6UGFyYW1ldGVyXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHNzbVBhcmFtZXRlciA9IG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHRoaXMsICdteVNzbVBhcmFtZXRlcicsIHtcbiAqICAgIHBhcmFtZXRlck5hbWU6ICdteVNzbVBhcmFtZXRlcicsXG4gKiAgICBzdHJpbmdWYWx1ZTogJ215U3NtUGFyYW1ldGVyVmFsdWUnLFxuICogfSk7XG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJpbmdQYXJhbWV0ZXIgZXh0ZW5kcyBQYXJhbWV0ZXJCYXNlIGltcGxlbWVudHMgSVN0cmluZ1BhcmFtZXRlciB7XG5cbiAgLyoqXG4gICAqIEltcG9ydHMgYW4gZXh0ZXJuYWwgc3RyaW5nIHBhcmFtZXRlciBieSBuYW1lLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU3RyaW5nUGFyYW1ldGVyTmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzdHJpbmdQYXJhbWV0ZXJOYW1lOiBzdHJpbmcpOiBJU3RyaW5nUGFyYW1ldGVyIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzY29wZSwgaWQsIHsgcGFyYW1ldGVyTmFtZTogc3RyaW5nUGFyYW1ldGVyTmFtZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnRzIGFuIGV4dGVybmFsIHN0cmluZyBwYXJhbWV0ZXIgd2l0aCBuYW1lIGFuZCBvcHRpb25hbCB2ZXJzaW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyk6IElTdHJpbmdQYXJhbWV0ZXIge1xuICAgIGlmICghYXR0cnMucGFyYW1ldGVyTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwYXJhbWV0ZXJOYW1lIGNhbm5vdCBiZSBhbiBlbXB0eSBzdHJpbmcnKTtcbiAgICB9XG4gICAgaWYgKGF0dHJzLnR5cGUgJiYgIVtQYXJhbWV0ZXJUeXBlLlNUUklORywgUGFyYW1ldGVyVHlwZS5BV1NfRUMyX0lNQUdFX0lEXS5pbmNsdWRlcyhhdHRycy50eXBlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBmcm9tU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyBkb2VzIG5vdCBzdXBwb3J0ICR7YXR0cnMudHlwZX0uIFBsZWFzZSB1c2UgUGFyYW1ldGVyVHlwZS5TVFJJTkcgb3IgUGFyYW1ldGVyVHlwZS5BV1NfRUMyX0lNQUdFX0lEYCk7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZSA9IGF0dHJzLnR5cGUgPz8gYXR0cnMudmFsdWVUeXBlID8/IFBhcmFtZXRlclZhbHVlVHlwZS5TVFJJTkc7XG5cbiAgICBjb25zdCBzdHJpbmdWYWx1ZSA9IGF0dHJzLnZlcnNpb25cbiAgICAgID8gbmV3IENmbkR5bmFtaWNSZWZlcmVuY2UoQ2ZuRHluYW1pY1JlZmVyZW5jZVNlcnZpY2UuU1NNLCBgJHthdHRycy5wYXJhbWV0ZXJOYW1lfToke1Rva2VuaXphdGlvbi5zdHJpbmdpZnlOdW1iZXIoYXR0cnMudmVyc2lvbil9YCkudG9TdHJpbmcoKVxuICAgICAgOiBuZXcgQ2ZuUGFyYW1ldGVyKHNjb3BlLCBgJHtpZH0uUGFyYW1ldGVyYCwgeyB0eXBlOiBgQVdTOjpTU006OlBhcmFtZXRlcjo6VmFsdWU8JHt0eXBlfT5gLCBkZWZhdWx0OiBhdHRycy5wYXJhbWV0ZXJOYW1lIH0pLnZhbHVlQXNTdHJpbmc7XG5cbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBQYXJhbWV0ZXJCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBwYXJhbWV0ZXJOYW1lID0gYXR0cnMucGFyYW1ldGVyTmFtZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBwYXJhbWV0ZXJBcm4gPSBhcm5Gb3JQYXJhbWV0ZXJOYW1lKHRoaXMsIGF0dHJzLnBhcmFtZXRlck5hbWUsIHsgc2ltcGxlTmFtZTogYXR0cnMuc2ltcGxlTmFtZSB9KTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBwYXJhbWV0ZXJUeXBlID0gUGFyYW1ldGVyVHlwZS5TVFJJTkc7IC8vIHRoaXMgaXMgdGhlIHR5cGUgcmV0dXJuZWQgYnkgQ0ZOIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXNzbS1wYXJhbWV0ZXIuaHRtbCNhd3MtcmVzb3VyY2Utc3NtLXBhcmFtZXRlci1yZXR1cm4tdmFsdWVzXG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc3RyaW5nVmFsdWUgPSBzdHJpbmdWYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydHMgYSBzZWN1cmUgc3RyaW5nIHBhcmFtZXRlciBmcm9tIHRoZSBTU00gcGFyYW1ldGVyIHN0b3JlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyk6IElTdHJpbmdQYXJhbWV0ZXIge1xuICAgIGNvbnN0IHZlcnNpb24gPSBhdHRycy52ZXJzaW9uID8gVG9rZW5pemF0aW9uLnN0cmluZ2lmeU51bWJlcihhdHRycy52ZXJzaW9uKSA6ICcnO1xuICAgIGNvbnN0IHN0cmluZ1ZhbHVlID0gbmV3IENmbkR5bmFtaWNSZWZlcmVuY2UoXG4gICAgICBDZm5EeW5hbWljUmVmZXJlbmNlU2VydmljZS5TU01fU0VDVVJFLFxuICAgICAgdmVyc2lvbiA/IGAke2F0dHJzLnBhcmFtZXRlck5hbWV9OiR7dmVyc2lvbn1gIDogYXR0cnMucGFyYW1ldGVyTmFtZSxcbiAgICApLnRvU3RyaW5nKCk7XG5cbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBQYXJhbWV0ZXJCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBwYXJhbWV0ZXJOYW1lID0gYXR0cnMucGFyYW1ldGVyTmFtZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBwYXJhbWV0ZXJBcm4gPSBhcm5Gb3JQYXJhbWV0ZXJOYW1lKHRoaXMsIGF0dHJzLnBhcmFtZXRlck5hbWUsIHsgc2ltcGxlTmFtZTogYXR0cnMuc2ltcGxlTmFtZSB9KTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBwYXJhbWV0ZXJUeXBlID0gUGFyYW1ldGVyVHlwZS5TRUNVUkVfU1RSSU5HO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHN0cmluZ1ZhbHVlID0gc3RyaW5nVmFsdWU7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZW5jcnlwdGlvbktleSA9IGF0dHJzLmVuY3J5cHRpb25LZXk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkcyB0aGUgdmFsdWUgb2YgYW4gU1NNIHBhcmFtZXRlciBkdXJpbmcgc3ludGhlc2lzIHRocm91Z2ggYW5cbiAgICogZW52aXJvbm1lbnRhbCBjb250ZXh0IHByb3ZpZGVyLlxuICAgKlxuICAgKiBSZXF1aXJlcyB0aGF0IHRoZSBzdGFjayB0aGlzIHNjb3BlIGlzIGRlZmluZWQgaW4gd2lsbCBoYXZlIGV4cGxpY2l0XG4gICAqIGFjY291bnQvcmVnaW9uIGluZm9ybWF0aW9uLiBPdGhlcndpc2UsIGl0IHdpbGwgZmFpbCBkdXJpbmcgc3ludGhlc2lzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB2YWx1ZUZyb21Mb29rdXAoc2NvcGU6IENvbnN0cnVjdCwgcGFyYW1ldGVyTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB2YWx1ZSA9IENvbnRleHRQcm92aWRlci5nZXRWYWx1ZShzY29wZSwge1xuICAgICAgcHJvdmlkZXI6IGN4c2NoZW1hLkNvbnRleHRQcm92aWRlci5TU01fUEFSQU1FVEVSX1BST1ZJREVSLFxuICAgICAgcHJvcHM6IHsgcGFyYW1ldGVyTmFtZSB9LFxuICAgICAgZHVtbXlWYWx1ZTogYGR1bW15LXZhbHVlLWZvci0ke3BhcmFtZXRlck5hbWV9YCxcbiAgICB9KS52YWx1ZTtcblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgdG9rZW4gdGhhdCB3aWxsIHJlc29sdmUgKGR1cmluZyBkZXBsb3ltZW50KSB0byB0aGUgc3RyaW5nIHZhbHVlIG9mIGFuIFNTTSBzdHJpbmcgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0gc2NvcGUgU29tZSBzY29wZSB3aXRoaW4gYSBzdGFja1xuICAgKiBAcGFyYW0gcGFyYW1ldGVyTmFtZSBUaGUgbmFtZSBvZiB0aGUgU1NNIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHZlcnNpb24gVGhlIHBhcmFtZXRlciB2ZXJzaW9uIChyZWNvbW1lbmRlZCBpbiBvcmRlciB0byBlbnN1cmUgdGhhdCB0aGUgdmFsdWUgd29uJ3QgY2hhbmdlIGR1cmluZyBkZXBsb3ltZW50KVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB2YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihzY29wZTogQ29uc3RydWN0LCBwYXJhbWV0ZXJOYW1lOiBzdHJpbmcsIHZlcnNpb24/OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBTdHJpbmdQYXJhbWV0ZXIudmFsdWVGb3JUeXBlZFN0cmluZ1BhcmFtZXRlclYyKHNjb3BlLCBwYXJhbWV0ZXJOYW1lLCBQYXJhbWV0ZXJWYWx1ZVR5cGUuU1RSSU5HLCB2ZXJzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgdG9rZW4gdGhhdCB3aWxsIHJlc29sdmUgKGR1cmluZyBkZXBsb3ltZW50KSB0byB0aGUgc3RyaW5nIHZhbHVlIG9mIGFuIFNTTSBzdHJpbmcgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0gc2NvcGUgU29tZSBzY29wZSB3aXRoaW4gYSBzdGFja1xuICAgKiBAcGFyYW0gcGFyYW1ldGVyTmFtZSBUaGUgbmFtZSBvZiB0aGUgU1NNIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIFNTTSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB2ZXJzaW9uIFRoZSBwYXJhbWV0ZXIgdmVyc2lvbiAocmVjb21tZW5kZWQgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgdGhlIHZhbHVlIHdvbid0IGNoYW5nZSBkdXJpbmcgZGVwbG95bWVudClcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdmFsdWVGb3JUeXBlZFN0cmluZ1BhcmFtZXRlclYyKHNjb3BlOiBDb25zdHJ1Y3QsIHBhcmFtZXRlck5hbWU6IHN0cmluZywgdHlwZSA9IFBhcmFtZXRlclZhbHVlVHlwZS5TVFJJTkcsIHZlcnNpb24/OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IGlkID0gbWFrZUlkZW50aXR5Rm9ySW1wb3J0ZWRWYWx1ZShwYXJhbWV0ZXJOYW1lKTtcbiAgICBjb25zdCBleGlzdHMgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZChpZCkgYXMgSVN0cmluZ1BhcmFtZXRlcjtcblxuICAgIGlmIChleGlzdHMpIHsgcmV0dXJuIGV4aXN0cy5zdHJpbmdWYWx1ZTsgfVxuXG4gICAgcmV0dXJuIHRoaXMuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssIGlkLCB7IHBhcmFtZXRlck5hbWUsIHZlcnNpb24sIHZhbHVlVHlwZTogdHlwZSB9KS5zdHJpbmdWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgdG9rZW4gdGhhdCB3aWxsIHJlc29sdmUgKGR1cmluZyBkZXBsb3ltZW50KSB0byB0aGUgc3RyaW5nIHZhbHVlIG9mIGFuIFNTTSBzdHJpbmcgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0gc2NvcGUgU29tZSBzY29wZSB3aXRoaW4gYSBzdGFja1xuICAgKiBAcGFyYW0gcGFyYW1ldGVyTmFtZSBUaGUgbmFtZSBvZiB0aGUgU1NNIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIFNTTSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB2ZXJzaW9uIFRoZSBwYXJhbWV0ZXIgdmVyc2lvbiAocmVjb21tZW5kZWQgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgdGhlIHZhbHVlIHdvbid0IGNoYW5nZSBkdXJpbmcgZGVwbG95bWVudClcbiAgICogQGRlcHJlY2F0ZWQgLSB1c2UgdmFsdWVGb3JUeXBlZFN0cmluZ1BhcmFtZXRlclYyIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdmFsdWVGb3JUeXBlZFN0cmluZ1BhcmFtZXRlcihzY29wZTogQ29uc3RydWN0LCBwYXJhbWV0ZXJOYW1lOiBzdHJpbmcsIHR5cGUgPSBQYXJhbWV0ZXJUeXBlLlNUUklORywgdmVyc2lvbj86IG51bWJlcik6IHN0cmluZyB7XG4gICAgaWYgKHR5cGUgPT09IFBhcmFtZXRlclR5cGUuU1RSSU5HX0xJU1QpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndmFsdWVGb3JUeXBlZFN0cmluZ1BhcmFtZXRlciBkb2VzIG5vdCBzdXBwb3J0IFNUUklOR19MSVNULCAnXG4gICAgICAgICsndXNlIHZhbHVlRm9yVHlwZWRMaXN0UGFyYW1ldGVyIGluc3RlYWQnKTtcbiAgICB9XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihzY29wZSk7XG4gICAgY29uc3QgaWQgPSBtYWtlSWRlbnRpdHlGb3JJbXBvcnRlZFZhbHVlKHBhcmFtZXRlck5hbWUpO1xuICAgIGNvbnN0IGV4aXN0cyA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKGlkKSBhcyBJU3RyaW5nUGFyYW1ldGVyO1xuXG4gICAgaWYgKGV4aXN0cykgeyByZXR1cm4gZXhpc3RzLnN0cmluZ1ZhbHVlOyB9XG5cbiAgICByZXR1cm4gdGhpcy5mcm9tU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgaWQsIHsgcGFyYW1ldGVyTmFtZSwgdmVyc2lvbiwgdHlwZSB9KS5zdHJpbmdWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgdG9rZW4gdGhhdCB3aWxsIHJlc29sdmUgKGR1cmluZyBkZXBsb3ltZW50KVxuICAgKiBAcGFyYW0gc2NvcGUgU29tZSBzY29wZSB3aXRoaW4gYSBzdGFja1xuICAgKiBAcGFyYW0gcGFyYW1ldGVyTmFtZSBUaGUgbmFtZSBvZiB0aGUgU1NNIHBhcmFtZXRlclxuICAgKiBAcGFyYW0gdmVyc2lvbiBUaGUgcGFyYW1ldGVyIHZlcnNpb24gKHJlcXVpcmVkIGZvciBzZWN1cmUgc3RyaW5ncylcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBTZWNyZXRWYWx1ZS5zc21TZWN1cmUoKWAgaW5zdGVhZCwgaXQgd2lsbCBjb3JyZWN0bHkgdHlwZSB0aGUgaW1wb3J0ZWQgdmFsdWUgYXMgYSBgU2VjcmV0VmFsdWVgIGFuZCBhbGxvdyBpbXBvcnRpbmcgd2l0aG91dCB2ZXJzaW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB2YWx1ZUZvclNlY3VyZVN0cmluZ1BhcmFtZXRlcihzY29wZTogQ29uc3RydWN0LCBwYXJhbWV0ZXJOYW1lOiBzdHJpbmcsIHZlcnNpb246IG51bWJlcik6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihzY29wZSk7XG4gICAgY29uc3QgaWQgPSBtYWtlSWRlbnRpdHlGb3JJbXBvcnRlZFZhbHVlKHBhcmFtZXRlck5hbWUpO1xuICAgIGNvbnN0IGV4aXN0cyA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKGlkKSBhcyBJU3RyaW5nUGFyYW1ldGVyO1xuICAgIGlmIChleGlzdHMpIHsgcmV0dXJuIGV4aXN0cy5zdHJpbmdWYWx1ZTsgfVxuXG4gICAgcmV0dXJuIHRoaXMuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssIGlkLCB7IHBhcmFtZXRlck5hbWUsIHZlcnNpb24gfSkuc3RyaW5nVmFsdWU7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyQXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBwYXJhbWV0ZXJOYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBwYXJhbWV0ZXJUeXBlOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBzdHJpbmdWYWx1ZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTdHJpbmdQYXJhbWV0ZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5wYXJhbWV0ZXJOYW1lLFxuICAgIH0pO1xuXG4gICAgaWYgKHByb3BzLmFsbG93ZWRQYXR0ZXJuKSB7XG4gICAgICBfYXNzZXJ0VmFsaWRWYWx1ZShwcm9wcy5zdHJpbmdWYWx1ZSwgcHJvcHMuYWxsb3dlZFBhdHRlcm4pO1xuICAgIH1cblxuICAgIHZhbGlkYXRlUGFyYW1ldGVyTmFtZSh0aGlzLnBoeXNpY2FsTmFtZSk7XG5cbiAgICBpZiAocHJvcHMuZGVzY3JpcHRpb24gJiYgcHJvcHMuZGVzY3JpcHRpb24/Lmxlbmd0aCA+IDEwMjQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRGVzY3JpcHRpb24gY2Fubm90IGJlIGxvbmdlciB0aGFuIDEwMjQgY2hhcmFjdGVycy4nKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMudHlwZSAmJiBwcm9wcy50eXBlID09PSBQYXJhbWV0ZXJUeXBlLkFXU19FQzJfSU1BR0VfSUQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHR5cGUgbXVzdCBlaXRoZXIgYmUgUGFyYW1ldGVyVHlwZS5TVFJJTkcgb3IgUGFyYW1ldGVyVHlwZS5TVFJJTkdfTElTVC4gRGlkIHlvdSBtZWFuIHRvIHNldCBkYXRhVHlwZTogUGFyYW1ldGVyRGF0YVR5cGUuQVdTX0VDMl9JTUFHRSBpbnN0ZWFkPycpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IHNzbS5DZm5QYXJhbWV0ZXIodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgYWxsb3dlZFBhdHRlcm46IHByb3BzLmFsbG93ZWRQYXR0ZXJuLFxuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgICAgbmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICB0aWVyOiBwcm9wcy50aWVyLFxuICAgICAgdHlwZTogcHJvcHMudHlwZSB8fCBQYXJhbWV0ZXJUeXBlLlNUUklORyxcbiAgICAgIGRhdGFUeXBlOiBwcm9wcy5kYXRhVHlwZSxcbiAgICAgIHZhbHVlOiBwcm9wcy5zdHJpbmdWYWx1ZSxcbiAgICB9KTtcblxuICAgIHRoaXMucGFyYW1ldGVyTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHJlc291cmNlLnJlZik7XG4gICAgdGhpcy5wYXJhbWV0ZXJBcm4gPSBhcm5Gb3JQYXJhbWV0ZXJOYW1lKHRoaXMsIHRoaXMucGFyYW1ldGVyTmFtZSwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5wYXJhbWV0ZXJOYW1lIHx8IEFVVE9HRU5fTUFSS0VSLFxuICAgICAgc2ltcGxlTmFtZTogcHJvcHMuc2ltcGxlTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMucGFyYW1ldGVyVHlwZSA9IHJlc291cmNlLmF0dHJUeXBlO1xuICAgIHRoaXMuc3RyaW5nVmFsdWUgPSByZXNvdXJjZS5hdHRyVmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFN0cmluZ0xpc3QgU1NNIFBhcmFtZXRlci5cbiAqIEByZXNvdXJjZSBBV1M6OlNTTTo6UGFyYW1ldGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJpbmdMaXN0UGFyYW1ldGVyIGV4dGVuZHMgUGFyYW1ldGVyQmFzZSBpbXBsZW1lbnRzIElTdHJpbmdMaXN0UGFyYW1ldGVyIHtcblxuICAvKipcbiAgICogSW1wb3J0cyBhbiBleHRlcm5hbCBwYXJhbWV0ZXIgb2YgdHlwZSBzdHJpbmcgbGlzdC5cbiAgICogUmV0dXJucyBhIHRva2VuIGFuZCBzaG91bGQgbm90IGJlIHBhcnNlZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVN0cmluZ0xpc3RQYXJhbWV0ZXJOYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHN0cmluZ0xpc3RQYXJhbWV0ZXJOYW1lOiBzdHJpbmcpOiBJU3RyaW5nTGlzdFBhcmFtZXRlciB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUGFyYW1ldGVyQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyTmFtZSA9IHN0cmluZ0xpc3RQYXJhbWV0ZXJOYW1lO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHBhcmFtZXRlckFybiA9IGFybkZvclBhcmFtZXRlck5hbWUodGhpcywgdGhpcy5wYXJhbWV0ZXJOYW1lKTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBwYXJhbWV0ZXJUeXBlID0gUGFyYW1ldGVyVHlwZS5TVFJJTkdfTElTVDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBzdHJpbmdMaXN0VmFsdWUgPSBGbi5zcGxpdCgnLCcsIG5ldyBDZm5EeW5hbWljUmVmZXJlbmNlKENmbkR5bmFtaWNSZWZlcmVuY2VTZXJ2aWNlLlNTTSwgc3RyaW5nTGlzdFBhcmFtZXRlck5hbWUpLnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0cyBhbiBleHRlcm5hbCBzdHJpbmcgbGlzdCBwYXJhbWV0ZXIgd2l0aCBuYW1lIGFuZCBvcHRpb25hbCB2ZXJzaW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTGlzdFBhcmFtZXRlckF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IExpc3RQYXJhbWV0ZXJBdHRyaWJ1dGVzKTogSVN0cmluZ0xpc3RQYXJhbWV0ZXIge1xuICAgIGlmICghYXR0cnMucGFyYW1ldGVyTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwYXJhbWV0ZXJOYW1lIGNhbm5vdCBiZSBhbiBlbXB0eSBzdHJpbmcnKTtcbiAgICB9XG5cbiAgICBjb25zdCB0eXBlID0gYXR0cnMuZWxlbWVudFR5cGUgPz8gUGFyYW1ldGVyVmFsdWVUeXBlLlNUUklORztcbiAgICBjb25zdCB2YWx1ZVR5cGUgPSBgTGlzdDwke3R5cGV9PmA7XG5cbiAgICBjb25zdCBzdHJpbmdWYWx1ZSA9IGF0dHJzLnZlcnNpb25cbiAgICAgID8gbmV3IENmbkR5bmFtaWNSZWZlcmVuY2UoQ2ZuRHluYW1pY1JlZmVyZW5jZVNlcnZpY2UuU1NNLCBgJHthdHRycy5wYXJhbWV0ZXJOYW1lfToke1Rva2VuaXphdGlvbi5zdHJpbmdpZnlOdW1iZXIoYXR0cnMudmVyc2lvbil9YCkudG9TdHJpbmdMaXN0KClcbiAgICAgIDogbmV3IENmblBhcmFtZXRlcihzY29wZSwgYCR7aWR9LlBhcmFtZXRlcmAsIHsgdHlwZTogYEFXUzo6U1NNOjpQYXJhbWV0ZXI6OlZhbHVlPCR7dmFsdWVUeXBlfT5gLCBkZWZhdWx0OiBhdHRycy5wYXJhbWV0ZXJOYW1lIH0pLnZhbHVlQXNMaXN0O1xuXG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUGFyYW1ldGVyQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyTmFtZSA9IGF0dHJzLnBhcmFtZXRlck5hbWU7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyQXJuID0gYXJuRm9yUGFyYW1ldGVyTmFtZSh0aGlzLCBhdHRycy5wYXJhbWV0ZXJOYW1lLCB7IHNpbXBsZU5hbWU6IGF0dHJzLnNpbXBsZU5hbWUgfSk7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyVHlwZSA9IHZhbHVlVHlwZTsgLy8gaXQgZG9lc24ndCByZWFsbHkgbWF0dGVyIHdoYXQgdGhpcyBpcyBzaW5jZSBhIENmblBhcmFtZXRlciBjYW4gb25seSBiZSBgU3RyaW5nIHwgU3RyaW5nTGlzdGBcbiAgICAgIHB1YmxpYyByZWFkb25seSBzdHJpbmdMaXN0VmFsdWUgPSBzdHJpbmdWYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSB0b2tlbiB0aGF0IHdpbGwgcmVzb2x2ZSAoZHVyaW5nIGRlcGxveW1lbnQpIHRvIHRoZSBsaXN0IHZhbHVlIG9mIGFuIFNTTSBTdHJpbmdMaXN0IHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHNjb3BlIFNvbWUgc2NvcGUgd2l0aGluIGEgc3RhY2tcbiAgICogQHBhcmFtIHBhcmFtZXRlck5hbWUgVGhlIG5hbWUgb2YgdGhlIFNTTSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB0eXBlIHRoZSB0eXBlIG9mIHRoZSBTU00gbGlzdCBwYXJhbWV0ZXJcbiAgICogQHBhcmFtIHZlcnNpb24gVGhlIHBhcmFtZXRlciB2ZXJzaW9uIChyZWNvbW1lbmRlZCBpbiBvcmRlciB0byBlbnN1cmUgdGhhdCB0aGUgdmFsdWUgd29uJ3QgY2hhbmdlIGR1cmluZyBkZXBsb3ltZW50KVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB2YWx1ZUZvclR5cGVkTGlzdFBhcmFtZXRlcihzY29wZTogQ29uc3RydWN0LCBwYXJhbWV0ZXJOYW1lOiBzdHJpbmcsIHR5cGUgPSBQYXJhbWV0ZXJWYWx1ZVR5cGUuU1RSSU5HLCB2ZXJzaW9uPzogbnVtYmVyKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IGlkID0gbWFrZUlkZW50aXR5Rm9ySW1wb3J0ZWRWYWx1ZShwYXJhbWV0ZXJOYW1lKTtcbiAgICBjb25zdCBleGlzdHMgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZChpZCkgYXMgSVN0cmluZ0xpc3RQYXJhbWV0ZXI7XG5cbiAgICBpZiAoZXhpc3RzKSB7IHJldHVybiBleGlzdHMuc3RyaW5nTGlzdFZhbHVlOyB9XG5cbiAgICByZXR1cm4gdGhpcy5mcm9tTGlzdFBhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssIGlkLCB7IHBhcmFtZXRlck5hbWUsIGVsZW1lbnRUeXBlOiB0eXBlLCB2ZXJzaW9uIH0pLnN0cmluZ0xpc3RWYWx1ZTtcbiAgfVxuXG5cbiAgcHVibGljIHJlYWRvbmx5IHBhcmFtZXRlckFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyVHlwZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgc3RyaW5nTGlzdFZhbHVlOiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU3RyaW5nTGlzdFBhcmFtZXRlclByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnBhcmFtZXRlck5hbWUsXG4gICAgfSk7XG5cbiAgICBpZiAocHJvcHMuc3RyaW5nTGlzdFZhbHVlLmZpbmQoc3RyID0+ICFUb2tlbi5pc1VucmVzb2x2ZWQoc3RyKSAmJiBzdHIuaW5kZXhPZignLCcpICE9PSAtMSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVmFsdWVzIG9mIGEgU3RyaW5nTGlzdCBTU00gUGFyYW1ldGVyIGNhbm5vdCBjb250YWluIHRoZSBcXCcsXFwnIGNoYXJhY3Rlci4gVXNlIGEgc3RyaW5nIHBhcmFtZXRlciBpbnN0ZWFkLicpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5hbGxvd2VkUGF0dGVybiAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKHByb3BzLnN0cmluZ0xpc3RWYWx1ZSkpIHtcbiAgICAgIHByb3BzLnN0cmluZ0xpc3RWYWx1ZS5mb3JFYWNoKHN0ciA9PiBfYXNzZXJ0VmFsaWRWYWx1ZShzdHIsIHByb3BzLmFsbG93ZWRQYXR0ZXJuISkpO1xuICAgIH1cblxuICAgIHZhbGlkYXRlUGFyYW1ldGVyTmFtZSh0aGlzLnBoeXNpY2FsTmFtZSk7XG5cbiAgICBpZiAocHJvcHMuZGVzY3JpcHRpb24gJiYgcHJvcHMuZGVzY3JpcHRpb24/Lmxlbmd0aCA+IDEwMjQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRGVzY3JpcHRpb24gY2Fubm90IGJlIGxvbmdlciB0aGFuIDEwMjQgY2hhcmFjdGVycy4nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBzc20uQ2ZuUGFyYW1ldGVyKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGFsbG93ZWRQYXR0ZXJuOiBwcm9wcy5hbGxvd2VkUGF0dGVybixcbiAgICAgIGRlc2NyaXB0aW9uOiBwcm9wcy5kZXNjcmlwdGlvbixcbiAgICAgIG5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgdGllcjogcHJvcHMudGllcixcbiAgICAgIHR5cGU6IFBhcmFtZXRlclR5cGUuU1RSSU5HX0xJU1QsXG4gICAgICB2YWx1ZTogRm4uam9pbignLCcsIHByb3BzLnN0cmluZ0xpc3RWYWx1ZSksXG4gICAgfSk7XG4gICAgdGhpcy5wYXJhbWV0ZXJOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UucmVmKTtcbiAgICB0aGlzLnBhcmFtZXRlckFybiA9IGFybkZvclBhcmFtZXRlck5hbWUodGhpcywgdGhpcy5wYXJhbWV0ZXJOYW1lLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnBhcmFtZXRlck5hbWUgfHwgQVVUT0dFTl9NQVJLRVIsXG4gICAgICBzaW1wbGVOYW1lOiBwcm9wcy5zaW1wbGVOYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wYXJhbWV0ZXJUeXBlID0gcmVzb3VyY2UuYXR0clR5cGU7XG4gICAgdGhpcy5zdHJpbmdMaXN0VmFsdWUgPSBGbi5zcGxpdCgnLCcsIHJlc291cmNlLmF0dHJWYWx1ZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBWYWxpZGF0ZXMgd2hldGhlciBhIHN1cHBsaWVkIHZhbHVlIGNvbmZvcm1zIHRvIHRoZSBhbGxvd2VkUGF0dGVybiwgZ3JhbnRlZCBuZWl0aGVyIGlzIGFuIHVucmVzb2x2ZWQgdG9rZW4uXG4gKlxuICogQHBhcmFtIHZhbHVlICAgICAgICAgIHRoZSB2YWx1ZSB0byBiZSB2YWxpZGF0ZWQuXG4gKiBAcGFyYW0gYWxsb3dlZFBhdHRlcm4gdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byB1c2UgZm9yIHZhbGlkYXRpb24uXG4gKlxuICogQHRocm93cyBpZiB0aGUgYGB2YWx1ZWBgIGRvZXMgbm90IGNvbmZvcm0gdG8gdGhlIGBgYWxsb3dlZFBhdHRlcm5gYCBhbmQgbmVpdGhlciBpcyBhbiB1bnJlc29sdmVkIHRva2VuIChwZXJcbiAqICAgICAgICAgYGBjZGsudW5yZXNvbHZlZGBgKS5cbiAqL1xuZnVuY3Rpb24gX2Fzc2VydFZhbGlkVmFsdWUodmFsdWU6IHN0cmluZywgYWxsb3dlZFBhdHRlcm46IHN0cmluZyk6IHZvaWQge1xuICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHZhbHVlKSB8fCBUb2tlbi5pc1VucmVzb2x2ZWQoYWxsb3dlZFBhdHRlcm4pKSB7XG4gICAgLy8gVW5hYmxlIHRvIHBlcmZvcm0gdmFsaWRhdGlvbnMgYWdhaW5zdCB1bnJlc29sdmVkIHRva2Vuc1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIW5ldyBSZWdFeHAoYWxsb3dlZFBhdHRlcm4pLnRlc3QodmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgc3VwcGxpZWQgdmFsdWUgKCR7dmFsdWV9KSBkb2VzIG5vdCBtYXRjaCB0aGUgc3BlY2lmaWVkIGFsbG93ZWRQYXR0ZXJuICgke2FsbG93ZWRQYXR0ZXJufSlgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYWtlSWRlbnRpdHlGb3JJbXBvcnRlZFZhbHVlKHBhcmFtZXRlck5hbWU6IHN0cmluZykge1xuICByZXR1cm4gYFNzbVBhcmFtZXRlclZhbHVlOiR7cGFyYW1ldGVyTmFtZX06Qzk2NTg0QjYtRjAwQS00NjRFLUFEMTktNTNBRkY0QjA1MTE4YDtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVQYXJhbWV0ZXJOYW1lKHBhcmFtZXRlck5hbWU6IHN0cmluZykge1xuICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHBhcmFtZXRlck5hbWUpKSB7IHJldHVybjsgfVxuICBpZiAocGFyYW1ldGVyTmFtZS5sZW5ndGggPiAyMDQ4KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCduYW1lIGNhbm5vdCBiZSBsb25nZXIgdGhhbiAyMDQ4IGNoYXJhY3RlcnMuJyk7XG4gIH1cbiAgaWYgKCFwYXJhbWV0ZXJOYW1lLm1hdGNoKC9eW1xcL1xcdy4tXSskLykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYG5hbWUgbXVzdCBvbmx5IGNvbnRhaW4gbGV0dGVycywgbnVtYmVycywgYW5kIHRoZSBmb2xsb3dpbmcgNCBzeW1ib2xzIC4tXy87IGdvdCAke3BhcmFtZXRlck5hbWV9YCk7XG4gIH1cbn1cbiJdfQ==