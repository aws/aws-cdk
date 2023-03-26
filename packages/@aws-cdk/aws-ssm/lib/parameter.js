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
        this.parameterArn = util_1.arnForParameterName(this, this.parameterName, {
            physicalName: props.parameterName || util_1.AUTOGEN_MARKER,
            simpleName: props.simpleName,
        });
        this.parameterType = resource.attrType;
        this.stringValue = resource.attrValue;
    }
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
                this.parameterArn = util_1.arnForParameterName(this, attrs.parameterName, { simpleName: attrs.simpleName });
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
                this.parameterArn = util_1.arnForParameterName(this, attrs.parameterName, { simpleName: attrs.simpleName });
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
}
exports.StringParameter = StringParameter;
_a = JSII_RTTI_SYMBOL_1;
StringParameter[_a] = { fqn: "@aws-cdk/aws-ssm.StringParameter", version: "0.0.0" };
/**
 * Creates a new StringList SSM Parameter.
 * @resource AWS::SSM::Parameter
 */
class StringListParameter extends ParameterBase {
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
        this.parameterArn = util_1.arnForParameterName(this, this.parameterName, {
            physicalName: props.parameterName || util_1.AUTOGEN_MARKER,
            simpleName: props.simpleName,
        });
        this.parameterType = resource.attrType;
        this.stringListValue = core_1.Fn.split(',', resource.attrValue);
    }
    /**
     * Imports an external parameter of type string list.
     * Returns a token and should not be parsed.
     */
    static fromStringListParameterName(scope, id, stringListParameterName) {
        class Import extends ParameterBase {
            constructor() {
                super(...arguments);
                this.parameterName = stringListParameterName;
                this.parameterArn = util_1.arnForParameterName(this, this.parameterName);
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
                this.parameterArn = util_1.arnForParameterName(this, attrs.parameterName, { simpleName: attrs.simpleName });
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
}
exports.StringListParameter = StringListParameter;
_b = JSII_RTTI_SYMBOL_1;
StringListParameter[_b] = { fqn: "@aws-cdk/aws-ssm.StringListParameter", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW1ldGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFyYW1ldGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUV4QywyREFBMkQ7QUFDM0Qsd0NBSXVCO0FBRXZCLHVDQUF1QztBQUN2QyxpQ0FBNkQ7QUFxSjdEOztHQUVHO0FBQ0gsTUFBZSxhQUFjLFNBQVEsZUFBUTtJQVlwQyxTQUFTLENBQUMsT0FBdUI7UUFDdEMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztZQUM5QixPQUFPO1lBQ1AsT0FBTyxFQUFFO2dCQUNQLHdCQUF3QjtnQkFDeEIsbUJBQW1CO2dCQUNuQixrQkFBa0I7Z0JBQ2xCLHlCQUF5QjthQUMxQjtZQUNELFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7U0FDbEMsQ0FBQyxDQUFDO0tBQ0o7SUFFTSxVQUFVLENBQUMsT0FBdUI7UUFDdkMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztZQUM5QixPQUFPO1lBQ1AsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUM7WUFDN0IsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztTQUNsQyxDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxJQUFZLGtCQXVEWDtBQXZERCxXQUFZLGtCQUFrQjtJQUM1Qjs7T0FFRztJQUNILHVDQUFpQixDQUFBO0lBRWpCOztPQUVHO0lBQ0gsd0ZBQWtFLENBQUE7SUFFbEU7O09BRUc7SUFDSCw4REFBd0MsQ0FBQTtJQUV4Qzs7T0FFRztJQUNILG9FQUE4QyxDQUFBO0lBRTlDOztPQUVHO0lBQ0gsNEVBQXNELENBQUE7SUFFdEQ7O09BRUc7SUFDSCw0RkFBc0UsQ0FBQTtJQUV0RTs7T0FFRztJQUNILDhFQUF3RCxDQUFBO0lBRXhEOztPQUVHO0lBQ0gsZ0VBQTBDLENBQUE7SUFFMUM7O09BRUc7SUFDSCxnRUFBMEMsQ0FBQTtJQUUxQzs7T0FFRztJQUNILDBEQUFvQyxDQUFBO0lBRXBDOztPQUVHO0lBQ0gsZ0ZBQTBELENBQUE7QUFDNUQsQ0FBQyxFQXZEVyxrQkFBa0IsR0FBbEIsMEJBQWtCLEtBQWxCLDBCQUFrQixRQXVEN0I7QUFFRDs7O0dBR0c7QUFDSCxJQUFZLGFBb0JYO0FBcEJELFdBQVksYUFBYTtJQUN2Qjs7T0FFRztJQUNILGtDQUFpQixDQUFBO0lBQ2pCOzs7OztPQUtHO0lBQ0gsK0NBQThCLENBQUE7SUFDOUI7O09BRUc7SUFDSCwyQ0FBMEIsQ0FBQTtJQUMxQjs7T0FFRztJQUNILHlEQUF3QyxDQUFBO0FBQzFDLENBQUMsRUFwQlcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFvQnhCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLGlCQVNYO0FBVEQsV0FBWSxpQkFBaUI7SUFDM0I7O09BRUc7SUFDSCxrQ0FBYSxDQUFBO0lBQ2I7O09BRUc7SUFDSCxvREFBK0IsQ0FBQTtBQUNqQyxDQUFDLEVBVFcsaUJBQWlCLEdBQWpCLHlCQUFpQixLQUFqQix5QkFBaUIsUUFTNUI7QUFFRDs7R0FFRztBQUNILElBQVksYUFhWDtBQWJELFdBQVksYUFBYTtJQUN2Qjs7T0FFRztJQUNILHNDQUFxQixDQUFBO0lBQ3JCOztPQUVHO0lBQ0gsNERBQTJDLENBQUE7SUFDM0M7O09BRUc7SUFDSCxzQ0FBcUIsQ0FBQTtBQUN2QixDQUFDLEVBYlcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFheEI7QUF1SEQ7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBYSxlQUFnQixTQUFRLGFBQWE7SUFnSmhELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMkI7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLGFBQWE7U0FDbEMsQ0FBQyxDQUFDOzs7Ozs7K0NBbkpNLGVBQWU7Ozs7UUFxSnhCLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRTtZQUN4QixpQkFBaUIsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUM1RDtRQUVELHFCQUFxQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV6QyxJQUFJLEtBQUssQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxNQUFNLEdBQUcsSUFBSSxFQUFFO1lBQ3pELE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztTQUN2RTtRQUVELElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRTtZQUMvRCxNQUFNLElBQUksS0FBSyxDQUFDLG1KQUFtSixDQUFDLENBQUM7U0FDdEs7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN0RCxjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7WUFDcEMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWTtZQUN2QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLElBQUksYUFBYSxDQUFDLE1BQU07WUFDeEMsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLEtBQUssRUFBRSxLQUFLLENBQUMsV0FBVztTQUN6QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLFlBQVksR0FBRywwQkFBbUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNoRSxZQUFZLEVBQUUsS0FBSyxDQUFDLGFBQWEsSUFBSSxxQkFBYztZQUNuRCxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7U0FDN0IsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztLQUN2QztJQW5MRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxtQkFBMkI7UUFDN0YsT0FBTyxJQUFJLENBQUMsNkJBQTZCLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxDQUFDLENBQUM7S0FDOUY7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFnQzs7Ozs7Ozs7OztRQUN4RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRTtZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7U0FDNUQ7UUFDRCxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM5RixNQUFNLElBQUksS0FBSyxDQUFDLGtEQUFrRCxLQUFLLENBQUMsSUFBSSxxRUFBcUUsQ0FBQyxDQUFDO1NBQ3BKO1FBRUQsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztRQUV4RSxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsT0FBTztZQUMvQixDQUFDLENBQUMsSUFBSSwwQkFBbUIsQ0FBQyxpQ0FBMEIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUMsYUFBYSxJQUFJLG1CQUFZLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQzdJLENBQUMsQ0FBQyxJQUFJLG1CQUFZLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsOEJBQThCLElBQUksR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUM7UUFFNUksTUFBTSxNQUFPLFNBQVEsYUFBYTtZQUFsQzs7Z0JBQ2tCLGtCQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztnQkFDcEMsaUJBQVksR0FBRywwQkFBbUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLGFBQWEsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztnQkFDaEcsa0JBQWEsR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsZ0xBQWdMO2dCQUN0TixnQkFBVyxHQUFHLFdBQVcsQ0FBQztZQUM1QyxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLG1DQUFtQyxDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNDOzs7Ozs7Ozs7O1FBQ3BILE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLG1CQUFZLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2pGLE1BQU0sV0FBVyxHQUFHLElBQUksMEJBQW1CLENBQ3pDLGlDQUEwQixDQUFDLFVBQVUsRUFDckMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxhQUFhLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQ3BFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFYixNQUFNLE1BQU8sU0FBUSxhQUFhO1lBQWxDOztnQkFDa0Isa0JBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO2dCQUNwQyxpQkFBWSxHQUFHLDBCQUFtQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsYUFBYSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO2dCQUNoRyxrQkFBYSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUM7Z0JBQzVDLGdCQUFXLEdBQUcsV0FBVyxDQUFDO2dCQUMxQixrQkFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7WUFDdEQsQ0FBQztTQUFBO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7SUFFRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQWdCLEVBQUUsYUFBcUI7UUFDbkUsTUFBTSxLQUFLLEdBQUcsc0JBQWUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO1lBQzVDLFFBQVEsRUFBRSxRQUFRLENBQUMsZUFBZSxDQUFDLHNCQUFzQjtZQUN6RCxLQUFLLEVBQUUsRUFBRSxhQUFhLEVBQUU7WUFDeEIsVUFBVSxFQUFFLG1CQUFtQixhQUFhLEVBQUU7U0FDL0MsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUVULE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxLQUFnQixFQUFFLGFBQXFCLEVBQUUsT0FBZ0I7UUFDN0YsT0FBTyxlQUFlLENBQUMsOEJBQThCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDakg7SUFFRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsOEJBQThCLENBQUMsS0FBZ0IsRUFBRSxhQUFxQixFQUFFLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsT0FBZ0I7Ozs7Ozs7Ozs7UUFDdEksTUFBTSxLQUFLLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixNQUFNLEVBQUUsR0FBRyw0QkFBNEIsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN2RCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQXFCLENBQUM7UUFFL0QsSUFBSSxNQUFNLEVBQUU7WUFBRSxPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUM7U0FBRTtRQUUxQyxPQUFPLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUM7S0FDL0c7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLDRCQUE0QixDQUFDLEtBQWdCLEVBQUUsYUFBcUIsRUFBRSxJQUFJLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFnQjs7Ozs7Ozs7Ozs7UUFDL0gsSUFBSSxJQUFJLEtBQUssYUFBYSxDQUFDLFdBQVcsRUFBRTtZQUN0QyxNQUFNLElBQUksS0FBSyxDQUFDLDZEQUE2RDtrQkFDMUUsd0NBQXdDLENBQUMsQ0FBQztTQUM5QztRQUNELE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsTUFBTSxFQUFFLEdBQUcsNEJBQTRCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkQsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFxQixDQUFDO1FBRS9ELElBQUksTUFBTSxFQUFFO1lBQUUsT0FBTyxNQUFNLENBQUMsV0FBVyxDQUFDO1NBQUU7UUFFMUMsT0FBTyxJQUFJLENBQUMsNkJBQTZCLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUM7S0FDcEc7SUFFRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsNkJBQTZCLENBQUMsS0FBZ0IsRUFBRSxhQUFxQixFQUFFLE9BQWU7Ozs7Ozs7Ozs7UUFDbEcsTUFBTSxLQUFLLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixNQUFNLEVBQUUsR0FBRyw0QkFBNEIsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN2RCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQXFCLENBQUM7UUFDL0QsSUFBSSxNQUFNLEVBQUU7WUFBRSxPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUM7U0FBRTtRQUUxQyxPQUFPLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDO0tBQ3BHOztBQXpJSCwwQ0FzTEM7OztBQUVEOzs7R0FHRztBQUNILE1BQWEsbUJBQW9CLFNBQVEsYUFBYTtJQWlFcEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUErQjtRQUN2RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxLQUFLLENBQUMsYUFBYTtTQUNsQyxDQUFDLENBQUM7Ozs7OzsrQ0FwRU0sbUJBQW1COzs7O1FBc0U1QixJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMxRixNQUFNLElBQUksS0FBSyxDQUFDLDBHQUEwRyxDQUFDLENBQUM7U0FDN0g7UUFFRCxJQUFJLEtBQUssQ0FBQyxjQUFjLElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUN0RSxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsY0FBZSxDQUFDLENBQUMsQ0FBQztTQUNyRjtRQUVELHFCQUFxQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV6QyxJQUFJLEtBQUssQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxNQUFNLEdBQUcsSUFBSSxFQUFFO1lBQ3pELE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztTQUN2RTtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3RELGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztZQUNwQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDOUIsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQ3ZCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixJQUFJLEVBQUUsYUFBYSxDQUFDLFdBQVc7WUFDL0IsS0FBSyxFQUFFLFNBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxlQUFlLENBQUM7U0FDM0MsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxZQUFZLEdBQUcsMEJBQW1CLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDaEUsWUFBWSxFQUFFLEtBQUssQ0FBQyxhQUFhLElBQUkscUJBQWM7WUFDbkQsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1NBQzdCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUN2QyxJQUFJLENBQUMsZUFBZSxHQUFHLFNBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUMxRDtJQWxHRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsMkJBQTJCLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsdUJBQStCO1FBQ3JHLE1BQU0sTUFBTyxTQUFRLGFBQWE7WUFBbEM7O2dCQUNrQixrQkFBYSxHQUFHLHVCQUF1QixDQUFDO2dCQUN4QyxpQkFBWSxHQUFHLDBCQUFtQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzdELGtCQUFhLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQztnQkFDMUMsb0JBQWUsR0FBRyxTQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLDBCQUFtQixDQUFDLGlDQUEwQixDQUFDLEdBQUcsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDL0ksQ0FBQztTQUFBO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE4Qjs7Ozs7Ozs7OztRQUNwRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRTtZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7U0FDNUQ7UUFFRCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsV0FBVyxJQUFJLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztRQUM1RCxNQUFNLFNBQVMsR0FBRyxRQUFRLElBQUksR0FBRyxDQUFDO1FBRWxDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxPQUFPO1lBQy9CLENBQUMsQ0FBQyxJQUFJLDBCQUFtQixDQUFDLGlDQUEwQixDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxhQUFhLElBQUksbUJBQVksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLEVBQUU7WUFDakosQ0FBQyxDQUFDLElBQUksbUJBQVksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSw4QkFBOEIsU0FBUyxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUUvSSxNQUFNLE1BQU8sU0FBUSxhQUFhO1lBQWxDOztnQkFDa0Isa0JBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO2dCQUNwQyxpQkFBWSxHQUFHLDBCQUFtQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsYUFBYSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO2dCQUNoRyxrQkFBYSxHQUFHLFNBQVMsQ0FBQyxDQUFDLCtGQUErRjtnQkFDMUgsb0JBQWUsR0FBRyxXQUFXLENBQUM7WUFDaEQsQ0FBQztTQUFBO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7SUFFRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsMEJBQTBCLENBQUMsS0FBZ0IsRUFBRSxhQUFxQixFQUFFLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsT0FBZ0I7Ozs7Ozs7Ozs7UUFDbEksTUFBTSxLQUFLLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixNQUFNLEVBQUUsR0FBRyw0QkFBNEIsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN2RCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQXlCLENBQUM7UUFFbkUsSUFBSSxNQUFNLEVBQUU7WUFBRSxPQUFPLE1BQU0sQ0FBQyxlQUFlLENBQUM7U0FBRTtRQUU5QyxPQUFPLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUM7S0FDbkg7O0FBekRILGtEQXFHQzs7O0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFTLGlCQUFpQixDQUFDLEtBQWEsRUFBRSxjQUFzQjtJQUM5RCxJQUFJLFlBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksWUFBSyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsRUFBRTtRQUNuRSwwREFBMEQ7UUFDMUQsT0FBTztLQUNSO0lBQ0QsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUMzQyxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixLQUFLLGtEQUFrRCxjQUFjLEdBQUcsQ0FBQyxDQUFDO0tBQ2xIO0FBQ0gsQ0FBQztBQUVELFNBQVMsNEJBQTRCLENBQUMsYUFBcUI7SUFDekQsT0FBTyxxQkFBcUIsYUFBYSx1Q0FBdUMsQ0FBQztBQUNuRixDQUFDO0FBRUQsU0FBUyxxQkFBcUIsQ0FBQyxhQUFxQjtJQUNsRCxJQUFJLFlBQUssQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEVBQUU7UUFBRSxPQUFPO0tBQUU7SUFDbEQsSUFBSSxhQUFhLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRTtRQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7S0FDaEU7SUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRTtRQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLGtGQUFrRixhQUFhLEVBQUUsQ0FBQyxDQUFDO0tBQ3BIO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQge1xuICBDZm5EeW5hbWljUmVmZXJlbmNlLCBDZm5EeW5hbWljUmVmZXJlbmNlU2VydmljZSwgQ2ZuUGFyYW1ldGVyLFxuICBDb250ZXh0UHJvdmlkZXIsIEZuLCBJUmVzb3VyY2UsIFJlc291cmNlLCBTdGFjaywgVG9rZW4sXG4gIFRva2VuaXphdGlvbixcbn0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHNzbSBmcm9tICcuL3NzbS5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgYXJuRm9yUGFyYW1ldGVyTmFtZSwgQVVUT0dFTl9NQVJLRVIgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIEFuIFNTTSBQYXJhbWV0ZXIgcmVmZXJlbmNlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElQYXJhbWV0ZXIgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgU1NNIFBhcmFtZXRlciByZXNvdXJjZS5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgcGFyYW1ldGVyQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBTU00gUGFyYW1ldGVyIHJlc291cmNlLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBwYXJhbWV0ZXJOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRoZSBTU00gUGFyYW1ldGVyIHJlc291cmNlLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBwYXJhbWV0ZXJUeXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEdyYW50cyByZWFkIChEZXNjcmliZVBhcmFtZXRlciwgR2V0UGFyYW1ldGVyLCBHZXRQYXJhbWV0ZXJIaXN0b3J5KSBwZXJtaXNzaW9ucyBvbiB0aGUgU1NNIFBhcmFtZXRlci5cbiAgICpcbiAgICogQHBhcmFtIGdyYW50ZWUgdGhlIHJvbGUgdG8gYmUgZ3JhbnRlZCByZWFkLW9ubHkgYWNjZXNzIHRvIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBncmFudFJlYWQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50cyB3cml0ZSAoUHV0UGFyYW1ldGVyKSBwZXJtaXNzaW9ucyBvbiB0aGUgU1NNIFBhcmFtZXRlci5cbiAgICpcbiAgICogQHBhcmFtIGdyYW50ZWUgdGhlIHJvbGUgdG8gYmUgZ3JhbnRlZCB3cml0ZSBhY2Nlc3MgdG8gdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIGdyYW50V3JpdGUoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQ7XG59XG5cbi8qKlxuICogQSBTdHJpbmcgU1NNIFBhcmFtZXRlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU3RyaW5nUGFyYW1ldGVyIGV4dGVuZHMgSVBhcmFtZXRlciB7XG4gIC8qKlxuICAgKiBUaGUgcGFyYW1ldGVyIHZhbHVlLiBWYWx1ZSBtdXN0IG5vdCBuZXN0IGFub3RoZXIgcGFyYW1ldGVyLiBEbyBub3QgdXNlIHt7fX0gaW4gdGhlIHZhbHVlLlxuICAgKlxuICAgKiBAYXR0cmlidXRlIFZhbHVlXG4gICAqL1xuICByZWFkb25seSBzdHJpbmdWYWx1ZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgU3RyaW5nTGlzdCBTU00gUGFyYW1ldGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElTdHJpbmdMaXN0UGFyYW1ldGVyIGV4dGVuZHMgSVBhcmFtZXRlciB7XG4gIC8qKlxuICAgKiBUaGUgcGFyYW1ldGVyIHZhbHVlLiBWYWx1ZSBtdXN0IG5vdCBuZXN0IGFub3RoZXIgcGFyYW1ldGVyLiBEbyBub3QgdXNlIHt7fX0gaW4gdGhlIHZhbHVlLiBWYWx1ZXMgaW4gdGhlIGFycmF5XG4gICAqIGNhbm5vdCBjb250YWluIGNvbW1hcyAoYGAsYGApLlxuICAgKlxuICAgKiBAYXR0cmlidXRlIFZhbHVlXG4gICAqL1xuICByZWFkb25seSBzdHJpbmdMaXN0VmFsdWU6IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgbmVlZGVkIHRvIGNyZWF0ZSBhIG5ldyBTU00gUGFyYW1ldGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFBhcmFtZXRlck9wdGlvbnMge1xuICAvKipcbiAgICogQSByZWd1bGFyIGV4cHJlc3Npb24gdXNlZCB0byB2YWxpZGF0ZSB0aGUgcGFyYW1ldGVyIHZhbHVlLiBGb3IgZXhhbXBsZSwgZm9yIFN0cmluZyB0eXBlcyB3aXRoIHZhbHVlcyByZXN0cmljdGVkIHRvXG4gICAqIG51bWJlcnMsIHlvdSBjYW4gc3BlY2lmeSB0aGUgZm9sbG93aW5nOiBgYF5cXGQrJGBgXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vIHZhbGlkYXRpb24gaXMgcGVyZm9ybWVkXG4gICAqL1xuICByZWFkb25seSBhbGxvd2VkUGF0dGVybj86IHN0cmluZztcblxuICAvKipcbiAgICogSW5mb3JtYXRpb24gYWJvdXQgdGhlIHBhcmFtZXRlciB0aGF0IHlvdSB3YW50IHRvIGFkZCB0byB0aGUgc3lzdGVtLlxuICAgKlxuICAgKiBAZGVmYXVsdCBub25lXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBhIG5hbWUgd2lsbCBiZSBnZW5lcmF0ZWQgYnkgQ2xvdWRGb3JtYXRpb25cbiAgICovXG4gIHJlYWRvbmx5IHBhcmFtZXRlck5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBvZiB0aGUgcGFyYW1ldGVyIG5hbWUgaXMgYSBzaW1wbGUgbmFtZSAoaS5lLiBkb2VzIG5vdCBpbmNsdWRlIFwiL1wiXG4gICAqIHNlcGFyYXRvcnMpLlxuICAgKlxuICAgKiBUaGlzIGlzIG9ubHkgcmVxdWlyZWQgb25seSBpZiBgcGFyYW1ldGVyTmFtZWAgaXMgYSB0b2tlbiwgd2hpY2ggbWVhbnMgd2VcbiAgICogYXJlIHVuYWJsZSB0byBkZXRlY3QgaWYgdGhlIG5hbWUgaXMgc2ltcGxlIG9yIFwicGF0aC1saWtlXCIgZm9yIHRoZSBwdXJwb3NlXG4gICAqIG9mIHJlbmRlcmluZyBTU00gcGFyYW1ldGVyIEFSTnMuXG4gICAqXG4gICAqIElmIGBwYXJhbWV0ZXJOYW1lYCBpcyBub3Qgc3BlY2lmaWVkLCBgc2ltcGxlTmFtZWAgbXVzdCBiZSBgdHJ1ZWAgKG9yXG4gICAqIHVuZGVmaW5lZCkgc2luY2UgdGhlIG5hbWUgZ2VuZXJhdGVkIGJ5IEFXUyBDbG91ZEZvcm1hdGlvbiBpcyBhbHdheXMgYVxuICAgKiBzaW1wbGUgbmFtZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBhdXRvLWRldGVjdCBiYXNlZCBvbiBgcGFyYW1ldGVyTmFtZWBcbiAgICovXG4gIHJlYWRvbmx5IHNpbXBsZU5hbWU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgdGllciBvZiB0aGUgc3RyaW5nIHBhcmFtZXRlclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHVuZGVmaW5lZFxuICAgKi9cbiAgcmVhZG9ubHkgdGllcj86IFBhcmFtZXRlclRpZXI7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBuZWVkZWQgdG8gY3JlYXRlIGEgU3RyaW5nIFNTTSBwYXJhbWV0ZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RyaW5nUGFyYW1ldGVyUHJvcHMgZXh0ZW5kcyBQYXJhbWV0ZXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLiBJdCBtYXkgbm90IHJlZmVyZW5jZSBhbm90aGVyIHBhcmFtZXRlciBhbmQgYGB7e319YGAgY2Fubm90IGJlIHVzZWQgaW4gdGhlIHZhbHVlLlxuICAgKi9cbiAgcmVhZG9ubHkgc3RyaW5nVmFsdWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdGhlIHN0cmluZyBwYXJhbWV0ZXJcbiAgICpcbiAgICogQGRlZmF1bHQgUGFyYW1ldGVyVHlwZS5TVFJJTkdcbiAgICogQGRlcHJlY2F0ZWQgLSB0eXBlIHdpbGwgYWx3YXlzIGJlICdTdHJpbmcnXG4gICAqL1xuICByZWFkb25seSB0eXBlPzogUGFyYW1ldGVyVHlwZTtcblxuICAvKipcbiAgICogVGhlIGRhdGEgdHlwZSBvZiB0aGUgcGFyYW1ldGVyLCBzdWNoIGFzIGB0ZXh0YCBvciBgYXdzOmVjMjppbWFnZWAuXG4gICAqXG4gICAqIEBkZWZhdWx0IFBhcmFtZXRlckRhdGFUeXBlLlRFWFRcbiAgICovXG4gIHJlYWRvbmx5IGRhdGFUeXBlPzogUGFyYW1ldGVyRGF0YVR5cGU7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBuZWVkZWQgdG8gY3JlYXRlIGEgU3RyaW5nTGlzdCBTU00gUGFyYW1ldGVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RyaW5nTGlzdFBhcmFtZXRlclByb3BzIGV4dGVuZHMgUGFyYW1ldGVyT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgdmFsdWVzIG9mIHRoZSBwYXJhbWV0ZXIuIEl0IG1heSBub3QgcmVmZXJlbmNlIGFub3RoZXIgcGFyYW1ldGVyIGFuZCBgYHt7fX1gYCBjYW5ub3QgYmUgdXNlZCBpbiB0aGUgdmFsdWUuXG4gICAqL1xuICByZWFkb25seSBzdHJpbmdMaXN0VmFsdWU6IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIEJhc2ljIGZlYXR1cmVzIHNoYXJlZCBhY3Jvc3MgYWxsIHR5cGVzIG9mIFNTTSBQYXJhbWV0ZXJzLlxuICovXG5hYnN0cmFjdCBjbGFzcyBQYXJhbWV0ZXJCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJUGFyYW1ldGVyIHtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHBhcmFtZXRlckFybjogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgcGFyYW1ldGVyTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgcGFyYW1ldGVyVHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZW5jcnlwdGlvbiBrZXkgdGhhdCBpcyB1c2VkIHRvIGVuY3J5cHQgdGhpcyBwYXJhbWV0ZXIuXG4gICAqXG4gICAqICogQGRlZmF1bHQgLSBkZWZhdWx0IG1hc3RlciBrZXlcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBlbmNyeXB0aW9uS2V5Pzoga21zLklLZXk7XG5cbiAgcHVibGljIGdyYW50UmVhZChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgaWYgKHRoaXMuZW5jcnlwdGlvbktleSkge1xuICAgICAgdGhpcy5lbmNyeXB0aW9uS2V5LmdyYW50RGVjcnlwdChncmFudGVlKTtcbiAgICB9XG4gICAgcmV0dXJuIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnc3NtOkRlc2NyaWJlUGFyYW1ldGVycycsXG4gICAgICAgICdzc206R2V0UGFyYW1ldGVycycsXG4gICAgICAgICdzc206R2V0UGFyYW1ldGVyJyxcbiAgICAgICAgJ3NzbTpHZXRQYXJhbWV0ZXJIaXN0b3J5JyxcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLnBhcmFtZXRlckFybl0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ3JhbnRXcml0ZShncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgaWYgKHRoaXMuZW5jcnlwdGlvbktleSkge1xuICAgICAgdGhpcy5lbmNyeXB0aW9uS2V5LmdyYW50RW5jcnlwdChncmFudGVlKTtcbiAgICB9XG4gICAgcmV0dXJuIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlLFxuICAgICAgYWN0aW9uczogWydzc206UHV0UGFyYW1ldGVyJ10sXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLnBhcmFtZXRlckFybl0sXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgdHlwZSBvZiBDRk4gU1NNIFBhcmFtZXRlclxuICpcbiAqIFVzaW5nIHNwZWNpZmljIHR5cGVzIGNhbiBiZSBoZWxwZnVsIGluIGNhdGNoaW5nIGludmFsaWQgdmFsdWVzXG4gKiBhdCB0aGUgc3RhcnQgb2YgY3JlYXRpbmcgb3IgdXBkYXRpbmcgYSBzdGFjay4gQ2xvdWRGb3JtYXRpb24gdmFsaWRhdGVzXG4gKiB0aGUgdmFsdWVzIGFnYWluc3QgZXhpc3RpbmcgdmFsdWVzIGluIHRoZSBhY2NvdW50LlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvcGFyYW1ldGVycy1zZWN0aW9uLXN0cnVjdHVyZS5odG1sI2F3cy1zc20tcGFyYW1ldGVyLXR5cGVzXG4gKi9cbmV4cG9ydCBlbnVtIFBhcmFtZXRlclZhbHVlVHlwZSB7XG4gIC8qKlxuICAgKiBTdHJpbmdcbiAgICovXG4gIFNUUklORyA9ICdTdHJpbmcnLFxuXG4gIC8qKlxuICAgKiBBbiBBdmFpbGFiaWxpdHkgWm9uZSwgc3VjaCBhcyB1cy13ZXN0LTJhLlxuICAgKi9cbiAgQVdTX0VDMl9BVkFJTEFCSUxJVFlaT05FX05BTUUgPSAnQVdTOjpFQzI6OkF2YWlsYWJpbGl0eVpvbmU6Ok5hbWUnLFxuXG4gIC8qKlxuICAgKiBBbiBBbWF6b24gRUMyIGltYWdlIElELCBzdWNoIGFzIGFtaS0wZmY4YTkxNTA3Zjc3Zjg2Ny5cbiAgICovXG4gIEFXU19FQzJfSU1BR0VfSUQgPSAnQVdTOjpFQzI6OkltYWdlOjpJZCcsXG5cbiAgLyoqXG4gICAqIEFuIEFtYXpvbiBFQzIgaW5zdGFuY2UgSUQsIHN1Y2ggYXMgaS0xZTczMWEzMi5cbiAgICovXG4gIEFXU19FQzJfSU5TVEFOQ0VfSUQgPSAnQVdTOjpFQzI6Okluc3RhbmNlOjpJZCcsXG5cbiAgLyoqXG4gICAqIEFuIEFtYXpvbiBFQzIga2V5IHBhaXIgbmFtZS5cbiAgICovXG4gIEFXU19FQzJfS0VZUEFJUl9LRVlOQU1FID0gJ0FXUzo6RUMyOjpLZXlQYWlyOjpLZXlOYW1lJyxcblxuICAvKipcbiAgICogQW4gRUMyLUNsYXNzaWMgb3IgZGVmYXVsdCBWUEMgc2VjdXJpdHkgZ3JvdXAgbmFtZSwgc3VjaCBhcyBteS1zZy1hYmMuXG4gICAqL1xuICBBV1NfRUMyX1NFQ1VSSVRZR1JPVVBfR1JPVVBOQU1FID0gJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwOjpHcm91cE5hbWUnLFxuXG4gIC8qKlxuICAgKiBBIHNlY3VyaXR5IGdyb3VwIElELCBzdWNoIGFzIHNnLWExMjNmZDg1LlxuICAgKi9cbiAgQVdTX0VDMl9TRUNVUklUWUdST1VQX0lEID0gJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwOjpJZCcsXG5cbiAgLyoqXG4gICAqIEEgc3VibmV0IElELCBzdWNoIGFzIHN1Ym5ldC0xMjNhMzUxZS5cbiAgICovXG4gIEFXU19FQzJfU1VCTkVUX0lEID0gJ0FXUzo6RUMyOjpTdWJuZXQ6OklkJyxcblxuICAvKipcbiAgICogQW4gQW1hem9uIEVCUyB2b2x1bWUgSUQsIHN1Y2ggYXMgdm9sLTNjZGQzZjU2LlxuICAgKi9cbiAgQVdTX0VDMl9WT0xVTUVfSUQgPSAnQVdTOjpFQzI6OlZvbHVtZTo6SWQnLFxuXG4gIC8qKlxuICAgKiBBIFZQQyBJRCwgc3VjaCBhcyB2cGMtYTEyM2JhYTMuXG4gICAqL1xuICBBV1NfRUMyX1ZQQ19JRCA9ICdBV1M6OkVDMjo6VlBDOjpJZCcsXG5cbiAgLyoqXG4gICAqIEFuIEFtYXpvbiBSb3V0ZSA1MyBob3N0ZWQgem9uZSBJRCwgc3VjaCBhcyBaMjNZWFY0T1ZQTDA0QS5cbiAgICovXG4gIEFXU19ST1VURTUzX0hPU1RFRFpPTkVfSUQgPSAnQVdTOjpSb3V0ZTUzOjpIb3N0ZWRab25lOjpJZCcsXG59XG5cbi8qKlxuICogU1NNIHBhcmFtZXRlciB0eXBlXG4gKiBAZGVwcmVjYXRlZCB0aGVzZSB0eXBlcyBhcmUgbm8gbG9uZ2VyIHVzZWRcbiAqL1xuZXhwb3J0IGVudW0gUGFyYW1ldGVyVHlwZSB7XG4gIC8qKlxuICAgKiBTdHJpbmdcbiAgICovXG4gIFNUUklORyA9ICdTdHJpbmcnLFxuICAvKipcbiAgICogU2VjdXJlIFN0cmluZ1xuICAgKlxuICAgKiBQYXJhbWV0ZXIgU3RvcmUgdXNlcyBhbiBBV1MgS2V5IE1hbmFnZW1lbnQgU2VydmljZSAoS01TKSBjdXN0b21lciBtYXN0ZXIga2V5IChDTUspIHRvIGVuY3J5cHQgdGhlIHBhcmFtZXRlciB2YWx1ZS5cbiAgICogUGFyYW1ldGVycyBvZiB0eXBlIFNlY3VyZVN0cmluZyBjYW5ub3QgYmUgY3JlYXRlZCBkaXJlY3RseSBmcm9tIGEgQ0RLIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgU0VDVVJFX1NUUklORyA9ICdTZWN1cmVTdHJpbmcnLFxuICAvKipcbiAgICogU3RyaW5nIExpc3RcbiAgICovXG4gIFNUUklOR19MSVNUID0gJ1N0cmluZ0xpc3QnLFxuICAvKipcbiAgICogQW4gQW1hem9uIEVDMiBpbWFnZSBJRCwgc3VjaCBhcyBhbWktMGZmOGE5MTUwN2Y3N2Y4NjdcbiAgICovXG4gIEFXU19FQzJfSU1BR0VfSUQgPSAnQVdTOjpFQzI6OkltYWdlOjpJZCcsXG59XG5cbi8qKlxuICogU1NNIHBhcmFtZXRlciBkYXRhIHR5cGVcbiAqL1xuZXhwb3J0IGVudW0gUGFyYW1ldGVyRGF0YVR5cGUge1xuICAvKipcbiAgICogVGV4dFxuICAgKi9cbiAgVEVYVCA9ICd0ZXh0JyxcbiAgLyoqXG4gICAqIEF3cyBFYzIgSW1hZ2VcbiAgICovXG4gIEFXU19FQzJfSU1BR0UgPSAnYXdzOmVjMjppbWFnZScsXG59XG5cbi8qKlxuICogU1NNIHBhcmFtZXRlciB0aWVyXG4gKi9cbmV4cG9ydCBlbnVtIFBhcmFtZXRlclRpZXIge1xuICAvKipcbiAgICogU3RyaW5nXG4gICAqL1xuICBBRFZBTkNFRCA9ICdBZHZhbmNlZCcsXG4gIC8qKlxuICAgKiBTdHJpbmdcbiAgICovXG4gIElOVEVMTElHRU5UX1RJRVJJTkcgPSAnSW50ZWxsaWdlbnQtVGllcmluZycsXG4gIC8qKlxuICAgKiBTdHJpbmdcbiAgICovXG4gIFNUQU5EQVJEID0gJ1N0YW5kYXJkJyxcbn1cblxuLyoqXG4gKiBDb21tb24gYXR0cmlidXRlcyBmb3Igc3RyaW5nIHBhcmFtZXRlcnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29tbW9uU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyIHN0b3JlIHZhbHVlLlxuICAgKlxuICAgKiBUaGlzIHZhbHVlIGNhbiBiZSBhIHRva2VuIG9yIGEgY29uY3JldGUgc3RyaW5nLiBJZiBpdCBpcyBhIGNvbmNyZXRlIHN0cmluZ1xuICAgKiBhbmQgaW5jbHVkZXMgXCIvXCIgaXQgbXVzdCBhbHNvIGJlIHByZWZpeGVkIHdpdGggYSBcIi9cIiAoZnVsbHktcXVhbGlmaWVkKS5cbiAgICovXG4gIHJlYWRvbmx5IHBhcmFtZXRlck5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogSW5kaWNhdGVzIG9mIHRoZSBwYXJhbWV0ZXIgbmFtZSBpcyBhIHNpbXBsZSBuYW1lIChpLmUuIGRvZXMgbm90IGluY2x1ZGUgXCIvXCJcbiAgICogc2VwYXJhdG9ycykuXG4gICAqXG4gICAqIFRoaXMgaXMgb25seSByZXF1aXJlZCBvbmx5IGlmIGBwYXJhbWV0ZXJOYW1lYCBpcyBhIHRva2VuLCB3aGljaCBtZWFucyB3ZVxuICAgKiBhcmUgdW5hYmxlIHRvIGRldGVjdCBpZiB0aGUgbmFtZSBpcyBzaW1wbGUgb3IgXCJwYXRoLWxpa2VcIiBmb3IgdGhlIHB1cnBvc2VcbiAgICogb2YgcmVuZGVyaW5nIFNTTSBwYXJhbWV0ZXIgQVJOcy5cbiAgICpcbiAgICogSWYgYHBhcmFtZXRlck5hbWVgIGlzIG5vdCBzcGVjaWZpZWQsIGBzaW1wbGVOYW1lYCBtdXN0IGJlIGB0cnVlYCAob3JcbiAgICogdW5kZWZpbmVkKSBzaW5jZSB0aGUgbmFtZSBnZW5lcmF0ZWQgYnkgQVdTIENsb3VkRm9ybWF0aW9uIGlzIGFsd2F5cyBhXG4gICAqIHNpbXBsZSBuYW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGF1dG8tZGV0ZWN0IGJhc2VkIG9uIGBwYXJhbWV0ZXJOYW1lYFxuICAgKi9cbiAgcmVhZG9ubHkgc2ltcGxlTmFtZT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQXR0cmlidXRlcyBmb3IgcGFyYW1ldGVycyBvZiB2YXJpb3VzIHR5cGVzIG9mIHN0cmluZy5cbiAqXG4gKiBAc2VlIFBhcmFtZXRlclR5cGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzIGV4dGVuZHMgQ29tbW9uU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBUaGUgdmVyc2lvbiBudW1iZXIgb2YgdGhlIHZhbHVlIHlvdSB3aXNoIHRvIHJldHJpZXZlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBUaGUgbGF0ZXN0IHZlcnNpb24gd2lsbCBiZSByZXRyaWV2ZWQuXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0aGUgc3RyaW5nIHBhcmFtZXRlclxuICAgKlxuICAgKiBAZGVmYXVsdCBQYXJhbWV0ZXJUeXBlLlNUUklOR1xuICAgKiBAZGVwcmVjYXRlZCAtIHVzZSB2YWx1ZVR5cGUgaW5zdGVhZFxuICAgKi9cbiAgcmVhZG9ubHkgdHlwZT86IFBhcmFtZXRlclR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRoZSBzdHJpbmcgcGFyYW1ldGVyIHZhbHVlXG4gICAqXG4gICAqIFVzaW5nIHNwZWNpZmljIHR5cGVzIGNhbiBiZSBoZWxwZnVsIGluIGNhdGNoaW5nIGludmFsaWQgdmFsdWVzXG4gICAqIGF0IHRoZSBzdGFydCBvZiBjcmVhdGluZyBvciB1cGRhdGluZyBhIHN0YWNrLiBDbG91ZEZvcm1hdGlvbiB2YWxpZGF0ZXNcbiAgICogdGhlIHZhbHVlcyBhZ2FpbnN0IGV4aXN0aW5nIHZhbHVlcyBpbiB0aGUgYWNjb3VudC5cbiAgICpcbiAgICogTm90ZSAtIGlmIHlvdSB3YW50IHRvIGFsbG93IHZhbHVlcyBmcm9tIGRpZmZlcmVudCBBV1MgYWNjb3VudHMsIHVzZVxuICAgKiBQYXJhbWV0ZXJWYWx1ZVR5cGUuU1RSSU5HXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvcGFyYW1ldGVycy1zZWN0aW9uLXN0cnVjdHVyZS5odG1sI2F3cy1zc20tcGFyYW1ldGVyLXR5cGVzXG4gICAqXG4gICAqIEBkZWZhdWx0IFBhcmFtZXRlclZhbHVlVHlwZS5TVFJJTkdcbiAgICovXG4gIHJlYWRvbmx5IHZhbHVlVHlwZT86IFBhcmFtZXRlclZhbHVlVHlwZTtcbn1cblxuLyoqXG4gKiBBdHRyaWJ1dGVzIGZvciBwYXJhbWV0ZXJzIG9mIHN0cmluZyBsaXN0IHR5cGUuXG4gKlxuICogQHNlZSBQYXJhbWV0ZXJUeXBlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGlzdFBhcmFtZXRlckF0dHJpYnV0ZXMgZXh0ZW5kcyBDb21tb25TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIG51bWJlciBvZiB0aGUgdmFsdWUgeW91IHdpc2ggdG8gcmV0cmlldmUuXG4gICAqXG4gICAqIEBkZWZhdWx0IFRoZSBsYXRlc3QgdmVyc2lvbiB3aWxsIGJlIHJldHJpZXZlZC5cbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb24/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRoZSBzdHJpbmcgbGlzdCBwYXJhbWV0ZXIgdmFsdWUuXG4gICAqXG4gICAqIFVzaW5nIHNwZWNpZmljIHR5cGVzIGNhbiBiZSBoZWxwZnVsIGluIGNhdGNoaW5nIGludmFsaWQgdmFsdWVzXG4gICAqIGF0IHRoZSBzdGFydCBvZiBjcmVhdGluZyBvciB1cGRhdGluZyBhIHN0YWNrLiBDbG91ZEZvcm1hdGlvbiB2YWxpZGF0ZXNcbiAgICogdGhlIHZhbHVlcyBhZ2FpbnN0IGV4aXN0aW5nIHZhbHVlcyBpbiB0aGUgYWNjb3VudC5cbiAgICpcbiAgICogTm90ZSAtIGlmIHlvdSB3YW50IHRvIGFsbG93IHZhbHVlcyBmcm9tIGRpZmZlcmVudCBBV1MgYWNjb3VudHMsIHVzZVxuICAgKiBQYXJhbWV0ZXJWYWx1ZVR5cGUuU1RSSU5HXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvcGFyYW1ldGVycy1zZWN0aW9uLXN0cnVjdHVyZS5odG1sI2F3cy1zc20tcGFyYW1ldGVyLXR5cGVzXG4gICAqXG4gICAqIEBkZWZhdWx0IFBhcmFtZXRlclZhbHVlVHlwZS5TVFJJTkdcbiAgICovXG4gIHJlYWRvbmx5IGVsZW1lbnRUeXBlPzogUGFyYW1ldGVyVmFsdWVUeXBlO1xufVxuXG4vKipcbiAqIEF0dHJpYnV0ZXMgZm9yIHNlY3VyZSBzdHJpbmcgcGFyYW1ldGVycy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZWN1cmVTdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzIGV4dGVuZHMgQ29tbW9uU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBUaGUgdmVyc2lvbiBudW1iZXIgb2YgdGhlIHZhbHVlIHlvdSB3aXNoIHRvIHJldHJpZXZlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFXUyBDbG91ZEZvcm1hdGlvbiB1c2VzIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiB0aGUgcGFyYW1ldGVyXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgZW5jcnlwdGlvbiBrZXkgdGhhdCBpcyB1c2VkIHRvIGVuY3J5cHQgdGhpcyBwYXJhbWV0ZXJcbiAgICpcbiAgICogQGRlZmF1bHQgLSBkZWZhdWx0IG1hc3RlciBrZXlcbiAgICovXG4gIHJlYWRvbmx5IGVuY3J5cHRpb25LZXk/OiBrbXMuSUtleTtcblxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgU3RyaW5nIFNTTSBQYXJhbWV0ZXIuXG4gKiBAcmVzb3VyY2UgQVdTOjpTU006OlBhcmFtZXRlclxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBzc21QYXJhbWV0ZXIgPSBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcih0aGlzLCAnbXlTc21QYXJhbWV0ZXInLCB7XG4gKiAgICBwYXJhbWV0ZXJOYW1lOiAnbXlTc21QYXJhbWV0ZXInLFxuICogICAgc3RyaW5nVmFsdWU6ICdteVNzbVBhcmFtZXRlclZhbHVlJyxcbiAqIH0pO1xuICovXG5leHBvcnQgY2xhc3MgU3RyaW5nUGFyYW1ldGVyIGV4dGVuZHMgUGFyYW1ldGVyQmFzZSBpbXBsZW1lbnRzIElTdHJpbmdQYXJhbWV0ZXIge1xuXG4gIC8qKlxuICAgKiBJbXBvcnRzIGFuIGV4dGVybmFsIHN0cmluZyBwYXJhbWV0ZXIgYnkgbmFtZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVN0cmluZ1BhcmFtZXRlck5hbWUoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgc3RyaW5nUGFyYW1ldGVyTmFtZTogc3RyaW5nKTogSVN0cmluZ1BhcmFtZXRlciB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc2NvcGUsIGlkLCB7IHBhcmFtZXRlck5hbWU6IHN0cmluZ1BhcmFtZXRlck5hbWUgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0cyBhbiBleHRlcm5hbCBzdHJpbmcgcGFyYW1ldGVyIHdpdGggbmFtZSBhbmQgb3B0aW9uYWwgdmVyc2lvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IFN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMpOiBJU3RyaW5nUGFyYW1ldGVyIHtcbiAgICBpZiAoIWF0dHJzLnBhcmFtZXRlck5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncGFyYW1ldGVyTmFtZSBjYW5ub3QgYmUgYW4gZW1wdHkgc3RyaW5nJyk7XG4gICAgfVxuICAgIGlmIChhdHRycy50eXBlICYmICFbUGFyYW1ldGVyVHlwZS5TVFJJTkcsIFBhcmFtZXRlclR5cGUuQVdTX0VDMl9JTUFHRV9JRF0uaW5jbHVkZXMoYXR0cnMudHlwZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMgZG9lcyBub3Qgc3VwcG9ydCAke2F0dHJzLnR5cGV9LiBQbGVhc2UgdXNlIFBhcmFtZXRlclR5cGUuU1RSSU5HIG9yIFBhcmFtZXRlclR5cGUuQVdTX0VDMl9JTUFHRV9JRGApO1xuICAgIH1cblxuICAgIGNvbnN0IHR5cGUgPSBhdHRycy50eXBlID8/IGF0dHJzLnZhbHVlVHlwZSA/PyBQYXJhbWV0ZXJWYWx1ZVR5cGUuU1RSSU5HO1xuXG4gICAgY29uc3Qgc3RyaW5nVmFsdWUgPSBhdHRycy52ZXJzaW9uXG4gICAgICA/IG5ldyBDZm5EeW5hbWljUmVmZXJlbmNlKENmbkR5bmFtaWNSZWZlcmVuY2VTZXJ2aWNlLlNTTSwgYCR7YXR0cnMucGFyYW1ldGVyTmFtZX06JHtUb2tlbml6YXRpb24uc3RyaW5naWZ5TnVtYmVyKGF0dHJzLnZlcnNpb24pfWApLnRvU3RyaW5nKClcbiAgICAgIDogbmV3IENmblBhcmFtZXRlcihzY29wZSwgYCR7aWR9LlBhcmFtZXRlcmAsIHsgdHlwZTogYEFXUzo6U1NNOjpQYXJhbWV0ZXI6OlZhbHVlPCR7dHlwZX0+YCwgZGVmYXVsdDogYXR0cnMucGFyYW1ldGVyTmFtZSB9KS52YWx1ZUFzU3RyaW5nO1xuXG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUGFyYW1ldGVyQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyTmFtZSA9IGF0dHJzLnBhcmFtZXRlck5hbWU7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyQXJuID0gYXJuRm9yUGFyYW1ldGVyTmFtZSh0aGlzLCBhdHRycy5wYXJhbWV0ZXJOYW1lLCB7IHNpbXBsZU5hbWU6IGF0dHJzLnNpbXBsZU5hbWUgfSk7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyVHlwZSA9IFBhcmFtZXRlclR5cGUuU1RSSU5HOyAvLyB0aGlzIGlzIHRoZSB0eXBlIHJldHVybmVkIGJ5IENGTiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zc20tcGFyYW1ldGVyLmh0bWwjYXdzLXJlc291cmNlLXNzbS1wYXJhbWV0ZXItcmV0dXJuLXZhbHVlc1xuICAgICAgcHVibGljIHJlYWRvbmx5IHN0cmluZ1ZhbHVlID0gc3RyaW5nVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnRzIGEgc2VjdXJlIHN0cmluZyBwYXJhbWV0ZXIgZnJvbSB0aGUgU1NNIHBhcmFtZXRlciBzdG9yZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IFNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMpOiBJU3RyaW5nUGFyYW1ldGVyIHtcbiAgICBjb25zdCB2ZXJzaW9uID0gYXR0cnMudmVyc2lvbiA/IFRva2VuaXphdGlvbi5zdHJpbmdpZnlOdW1iZXIoYXR0cnMudmVyc2lvbikgOiAnJztcbiAgICBjb25zdCBzdHJpbmdWYWx1ZSA9IG5ldyBDZm5EeW5hbWljUmVmZXJlbmNlKFxuICAgICAgQ2ZuRHluYW1pY1JlZmVyZW5jZVNlcnZpY2UuU1NNX1NFQ1VSRSxcbiAgICAgIHZlcnNpb24gPyBgJHthdHRycy5wYXJhbWV0ZXJOYW1lfToke3ZlcnNpb259YCA6IGF0dHJzLnBhcmFtZXRlck5hbWUsXG4gICAgKS50b1N0cmluZygpO1xuXG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUGFyYW1ldGVyQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyTmFtZSA9IGF0dHJzLnBhcmFtZXRlck5hbWU7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyQXJuID0gYXJuRm9yUGFyYW1ldGVyTmFtZSh0aGlzLCBhdHRycy5wYXJhbWV0ZXJOYW1lLCB7IHNpbXBsZU5hbWU6IGF0dHJzLnNpbXBsZU5hbWUgfSk7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyVHlwZSA9IFBhcmFtZXRlclR5cGUuU0VDVVJFX1NUUklORztcbiAgICAgIHB1YmxpYyByZWFkb25seSBzdHJpbmdWYWx1ZSA9IHN0cmluZ1ZhbHVlO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGVuY3J5cHRpb25LZXkgPSBhdHRycy5lbmNyeXB0aW9uS2V5O1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogUmVhZHMgdGhlIHZhbHVlIG9mIGFuIFNTTSBwYXJhbWV0ZXIgZHVyaW5nIHN5bnRoZXNpcyB0aHJvdWdoIGFuXG4gICAqIGVudmlyb25tZW50YWwgY29udGV4dCBwcm92aWRlci5cbiAgICpcbiAgICogUmVxdWlyZXMgdGhhdCB0aGUgc3RhY2sgdGhpcyBzY29wZSBpcyBkZWZpbmVkIGluIHdpbGwgaGF2ZSBleHBsaWNpdFxuICAgKiBhY2NvdW50L3JlZ2lvbiBpbmZvcm1hdGlvbi4gT3RoZXJ3aXNlLCBpdCB3aWxsIGZhaWwgZHVyaW5nIHN5bnRoZXNpcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdmFsdWVGcm9tTG9va3VwKHNjb3BlOiBDb25zdHJ1Y3QsIHBhcmFtZXRlck5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdmFsdWUgPSBDb250ZXh0UHJvdmlkZXIuZ2V0VmFsdWUoc2NvcGUsIHtcbiAgICAgIHByb3ZpZGVyOiBjeHNjaGVtYS5Db250ZXh0UHJvdmlkZXIuU1NNX1BBUkFNRVRFUl9QUk9WSURFUixcbiAgICAgIHByb3BzOiB7IHBhcmFtZXRlck5hbWUgfSxcbiAgICAgIGR1bW15VmFsdWU6IGBkdW1teS12YWx1ZS1mb3ItJHtwYXJhbWV0ZXJOYW1lfWAsXG4gICAgfSkudmFsdWU7XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHRva2VuIHRoYXQgd2lsbCByZXNvbHZlIChkdXJpbmcgZGVwbG95bWVudCkgdG8gdGhlIHN0cmluZyB2YWx1ZSBvZiBhbiBTU00gc3RyaW5nIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHNjb3BlIFNvbWUgc2NvcGUgd2l0aGluIGEgc3RhY2tcbiAgICogQHBhcmFtIHBhcmFtZXRlck5hbWUgVGhlIG5hbWUgb2YgdGhlIFNTTSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB2ZXJzaW9uIFRoZSBwYXJhbWV0ZXIgdmVyc2lvbiAocmVjb21tZW5kZWQgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgdGhlIHZhbHVlIHdvbid0IGNoYW5nZSBkdXJpbmcgZGVwbG95bWVudClcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdmFsdWVGb3JTdHJpbmdQYXJhbWV0ZXIoc2NvcGU6IENvbnN0cnVjdCwgcGFyYW1ldGVyTmFtZTogc3RyaW5nLCB2ZXJzaW9uPzogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gU3RyaW5nUGFyYW1ldGVyLnZhbHVlRm9yVHlwZWRTdHJpbmdQYXJhbWV0ZXJWMihzY29wZSwgcGFyYW1ldGVyTmFtZSwgUGFyYW1ldGVyVmFsdWVUeXBlLlNUUklORywgdmVyc2lvbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHRva2VuIHRoYXQgd2lsbCByZXNvbHZlIChkdXJpbmcgZGVwbG95bWVudCkgdG8gdGhlIHN0cmluZyB2YWx1ZSBvZiBhbiBTU00gc3RyaW5nIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHNjb3BlIFNvbWUgc2NvcGUgd2l0aGluIGEgc3RhY2tcbiAgICogQHBhcmFtIHBhcmFtZXRlck5hbWUgVGhlIG5hbWUgb2YgdGhlIFNTTSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBTU00gcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0gdmVyc2lvbiBUaGUgcGFyYW1ldGVyIHZlcnNpb24gKHJlY29tbWVuZGVkIGluIG9yZGVyIHRvIGVuc3VyZSB0aGF0IHRoZSB2YWx1ZSB3b24ndCBjaGFuZ2UgZHVyaW5nIGRlcGxveW1lbnQpXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHZhbHVlRm9yVHlwZWRTdHJpbmdQYXJhbWV0ZXJWMihzY29wZTogQ29uc3RydWN0LCBwYXJhbWV0ZXJOYW1lOiBzdHJpbmcsIHR5cGUgPSBQYXJhbWV0ZXJWYWx1ZVR5cGUuU1RSSU5HLCB2ZXJzaW9uPzogbnVtYmVyKTogc3RyaW5nIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCBpZCA9IG1ha2VJZGVudGl0eUZvckltcG9ydGVkVmFsdWUocGFyYW1ldGVyTmFtZSk7XG4gICAgY29uc3QgZXhpc3RzID0gc3RhY2subm9kZS50cnlGaW5kQ2hpbGQoaWQpIGFzIElTdHJpbmdQYXJhbWV0ZXI7XG5cbiAgICBpZiAoZXhpc3RzKSB7IHJldHVybiBleGlzdHMuc3RyaW5nVmFsdWU7IH1cblxuICAgIHJldHVybiB0aGlzLmZyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCBpZCwgeyBwYXJhbWV0ZXJOYW1lLCB2ZXJzaW9uLCB2YWx1ZVR5cGU6IHR5cGUgfSkuc3RyaW5nVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHRva2VuIHRoYXQgd2lsbCByZXNvbHZlIChkdXJpbmcgZGVwbG95bWVudCkgdG8gdGhlIHN0cmluZyB2YWx1ZSBvZiBhbiBTU00gc3RyaW5nIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHNjb3BlIFNvbWUgc2NvcGUgd2l0aGluIGEgc3RhY2tcbiAgICogQHBhcmFtIHBhcmFtZXRlck5hbWUgVGhlIG5hbWUgb2YgdGhlIFNTTSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBTU00gcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0gdmVyc2lvbiBUaGUgcGFyYW1ldGVyIHZlcnNpb24gKHJlY29tbWVuZGVkIGluIG9yZGVyIHRvIGVuc3VyZSB0aGF0IHRoZSB2YWx1ZSB3b24ndCBjaGFuZ2UgZHVyaW5nIGRlcGxveW1lbnQpXG4gICAqIEBkZXByZWNhdGVkIC0gdXNlIHZhbHVlRm9yVHlwZWRTdHJpbmdQYXJhbWV0ZXJWMiBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHZhbHVlRm9yVHlwZWRTdHJpbmdQYXJhbWV0ZXIoc2NvcGU6IENvbnN0cnVjdCwgcGFyYW1ldGVyTmFtZTogc3RyaW5nLCB0eXBlID0gUGFyYW1ldGVyVHlwZS5TVFJJTkcsIHZlcnNpb24/OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGlmICh0eXBlID09PSBQYXJhbWV0ZXJUeXBlLlNUUklOR19MSVNUKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3ZhbHVlRm9yVHlwZWRTdHJpbmdQYXJhbWV0ZXIgZG9lcyBub3Qgc3VwcG9ydCBTVFJJTkdfTElTVCwgJ1xuICAgICAgICArJ3VzZSB2YWx1ZUZvclR5cGVkTGlzdFBhcmFtZXRlciBpbnN0ZWFkJyk7XG4gICAgfVxuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IGlkID0gbWFrZUlkZW50aXR5Rm9ySW1wb3J0ZWRWYWx1ZShwYXJhbWV0ZXJOYW1lKTtcbiAgICBjb25zdCBleGlzdHMgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZChpZCkgYXMgSVN0cmluZ1BhcmFtZXRlcjtcblxuICAgIGlmIChleGlzdHMpIHsgcmV0dXJuIGV4aXN0cy5zdHJpbmdWYWx1ZTsgfVxuXG4gICAgcmV0dXJuIHRoaXMuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssIGlkLCB7IHBhcmFtZXRlck5hbWUsIHZlcnNpb24sIHR5cGUgfSkuc3RyaW5nVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHRva2VuIHRoYXQgd2lsbCByZXNvbHZlIChkdXJpbmcgZGVwbG95bWVudClcbiAgICogQHBhcmFtIHNjb3BlIFNvbWUgc2NvcGUgd2l0aGluIGEgc3RhY2tcbiAgICogQHBhcmFtIHBhcmFtZXRlck5hbWUgVGhlIG5hbWUgb2YgdGhlIFNTTSBwYXJhbWV0ZXJcbiAgICogQHBhcmFtIHZlcnNpb24gVGhlIHBhcmFtZXRlciB2ZXJzaW9uIChyZXF1aXJlZCBmb3Igc2VjdXJlIHN0cmluZ3MpXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgU2VjcmV0VmFsdWUuc3NtU2VjdXJlKClgIGluc3RlYWQsIGl0IHdpbGwgY29ycmVjdGx5IHR5cGUgdGhlIGltcG9ydGVkIHZhbHVlIGFzIGEgYFNlY3JldFZhbHVlYCBhbmQgYWxsb3cgaW1wb3J0aW5nIHdpdGhvdXQgdmVyc2lvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdmFsdWVGb3JTZWN1cmVTdHJpbmdQYXJhbWV0ZXIoc2NvcGU6IENvbnN0cnVjdCwgcGFyYW1ldGVyTmFtZTogc3RyaW5nLCB2ZXJzaW9uOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IGlkID0gbWFrZUlkZW50aXR5Rm9ySW1wb3J0ZWRWYWx1ZShwYXJhbWV0ZXJOYW1lKTtcbiAgICBjb25zdCBleGlzdHMgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZChpZCkgYXMgSVN0cmluZ1BhcmFtZXRlcjtcbiAgICBpZiAoZXhpc3RzKSB7IHJldHVybiBleGlzdHMuc3RyaW5nVmFsdWU7IH1cblxuICAgIHJldHVybiB0aGlzLmZyb21TZWN1cmVTdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCBpZCwgeyBwYXJhbWV0ZXJOYW1lLCB2ZXJzaW9uIH0pLnN0cmluZ1ZhbHVlO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IHBhcmFtZXRlckFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyVHlwZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgc3RyaW5nVmFsdWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU3RyaW5nUGFyYW1ldGVyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMucGFyYW1ldGVyTmFtZSxcbiAgICB9KTtcblxuICAgIGlmIChwcm9wcy5hbGxvd2VkUGF0dGVybikge1xuICAgICAgX2Fzc2VydFZhbGlkVmFsdWUocHJvcHMuc3RyaW5nVmFsdWUsIHByb3BzLmFsbG93ZWRQYXR0ZXJuKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZVBhcmFtZXRlck5hbWUodGhpcy5waHlzaWNhbE5hbWUpO1xuXG4gICAgaWYgKHByb3BzLmRlc2NyaXB0aW9uICYmIHByb3BzLmRlc2NyaXB0aW9uPy5sZW5ndGggPiAxMDI0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Rlc2NyaXB0aW9uIGNhbm5vdCBiZSBsb25nZXIgdGhhbiAxMDI0IGNoYXJhY3RlcnMuJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnR5cGUgJiYgcHJvcHMudHlwZSA9PT0gUGFyYW1ldGVyVHlwZS5BV1NfRUMyX0lNQUdFX0lEKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSB0eXBlIG11c3QgZWl0aGVyIGJlIFBhcmFtZXRlclR5cGUuU1RSSU5HIG9yIFBhcmFtZXRlclR5cGUuU1RSSU5HX0xJU1QuIERpZCB5b3UgbWVhbiB0byBzZXQgZGF0YVR5cGU6IFBhcmFtZXRlckRhdGFUeXBlLkFXU19FQzJfSU1BR0UgaW5zdGVhZD8nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBzc20uQ2ZuUGFyYW1ldGVyKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGFsbG93ZWRQYXR0ZXJuOiBwcm9wcy5hbGxvd2VkUGF0dGVybixcbiAgICAgIGRlc2NyaXB0aW9uOiBwcm9wcy5kZXNjcmlwdGlvbixcbiAgICAgIG5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgdGllcjogcHJvcHMudGllcixcbiAgICAgIHR5cGU6IHByb3BzLnR5cGUgfHwgUGFyYW1ldGVyVHlwZS5TVFJJTkcsXG4gICAgICBkYXRhVHlwZTogcHJvcHMuZGF0YVR5cGUsXG4gICAgICB2YWx1ZTogcHJvcHMuc3RyaW5nVmFsdWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnBhcmFtZXRlck5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXNvdXJjZS5yZWYpO1xuICAgIHRoaXMucGFyYW1ldGVyQXJuID0gYXJuRm9yUGFyYW1ldGVyTmFtZSh0aGlzLCB0aGlzLnBhcmFtZXRlck5hbWUsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMucGFyYW1ldGVyTmFtZSB8fCBBVVRPR0VOX01BUktFUixcbiAgICAgIHNpbXBsZU5hbWU6IHByb3BzLnNpbXBsZU5hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnBhcmFtZXRlclR5cGUgPSByZXNvdXJjZS5hdHRyVHlwZTtcbiAgICB0aGlzLnN0cmluZ1ZhbHVlID0gcmVzb3VyY2UuYXR0clZhbHVlO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBTdHJpbmdMaXN0IFNTTSBQYXJhbWV0ZXIuXG4gKiBAcmVzb3VyY2UgQVdTOjpTU006OlBhcmFtZXRlclxuICovXG5leHBvcnQgY2xhc3MgU3RyaW5nTGlzdFBhcmFtZXRlciBleHRlbmRzIFBhcmFtZXRlckJhc2UgaW1wbGVtZW50cyBJU3RyaW5nTGlzdFBhcmFtZXRlciB7XG5cbiAgLyoqXG4gICAqIEltcG9ydHMgYW4gZXh0ZXJuYWwgcGFyYW1ldGVyIG9mIHR5cGUgc3RyaW5nIGxpc3QuXG4gICAqIFJldHVybnMgYSB0b2tlbiBhbmQgc2hvdWxkIG5vdCBiZSBwYXJzZWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TdHJpbmdMaXN0UGFyYW1ldGVyTmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzdHJpbmdMaXN0UGFyYW1ldGVyTmFtZTogc3RyaW5nKTogSVN0cmluZ0xpc3RQYXJhbWV0ZXIge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFBhcmFtZXRlckJhc2Uge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHBhcmFtZXRlck5hbWUgPSBzdHJpbmdMaXN0UGFyYW1ldGVyTmFtZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBwYXJhbWV0ZXJBcm4gPSBhcm5Gb3JQYXJhbWV0ZXJOYW1lKHRoaXMsIHRoaXMucGFyYW1ldGVyTmFtZSk7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyVHlwZSA9IFBhcmFtZXRlclR5cGUuU1RSSU5HX0xJU1Q7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc3RyaW5nTGlzdFZhbHVlID0gRm4uc3BsaXQoJywnLCBuZXcgQ2ZuRHluYW1pY1JlZmVyZW5jZShDZm5EeW5hbWljUmVmZXJlbmNlU2VydmljZS5TU00sIHN0cmluZ0xpc3RQYXJhbWV0ZXJOYW1lKS50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydHMgYW4gZXh0ZXJuYWwgc3RyaW5nIGxpc3QgcGFyYW1ldGVyIHdpdGggbmFtZSBhbmQgb3B0aW9uYWwgdmVyc2lvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUxpc3RQYXJhbWV0ZXJBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBMaXN0UGFyYW1ldGVyQXR0cmlidXRlcyk6IElTdHJpbmdMaXN0UGFyYW1ldGVyIHtcbiAgICBpZiAoIWF0dHJzLnBhcmFtZXRlck5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncGFyYW1ldGVyTmFtZSBjYW5ub3QgYmUgYW4gZW1wdHkgc3RyaW5nJyk7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZSA9IGF0dHJzLmVsZW1lbnRUeXBlID8/IFBhcmFtZXRlclZhbHVlVHlwZS5TVFJJTkc7XG4gICAgY29uc3QgdmFsdWVUeXBlID0gYExpc3Q8JHt0eXBlfT5gO1xuXG4gICAgY29uc3Qgc3RyaW5nVmFsdWUgPSBhdHRycy52ZXJzaW9uXG4gICAgICA/IG5ldyBDZm5EeW5hbWljUmVmZXJlbmNlKENmbkR5bmFtaWNSZWZlcmVuY2VTZXJ2aWNlLlNTTSwgYCR7YXR0cnMucGFyYW1ldGVyTmFtZX06JHtUb2tlbml6YXRpb24uc3RyaW5naWZ5TnVtYmVyKGF0dHJzLnZlcnNpb24pfWApLnRvU3RyaW5nTGlzdCgpXG4gICAgICA6IG5ldyBDZm5QYXJhbWV0ZXIoc2NvcGUsIGAke2lkfS5QYXJhbWV0ZXJgLCB7IHR5cGU6IGBBV1M6OlNTTTo6UGFyYW1ldGVyOjpWYWx1ZTwke3ZhbHVlVHlwZX0+YCwgZGVmYXVsdDogYXR0cnMucGFyYW1ldGVyTmFtZSB9KS52YWx1ZUFzTGlzdDtcblxuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFBhcmFtZXRlckJhc2Uge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHBhcmFtZXRlck5hbWUgPSBhdHRycy5wYXJhbWV0ZXJOYW1lO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHBhcmFtZXRlckFybiA9IGFybkZvclBhcmFtZXRlck5hbWUodGhpcywgYXR0cnMucGFyYW1ldGVyTmFtZSwgeyBzaW1wbGVOYW1lOiBhdHRycy5zaW1wbGVOYW1lIH0pO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHBhcmFtZXRlclR5cGUgPSB2YWx1ZVR5cGU7IC8vIGl0IGRvZXNuJ3QgcmVhbGx5IG1hdHRlciB3aGF0IHRoaXMgaXMgc2luY2UgYSBDZm5QYXJhbWV0ZXIgY2FuIG9ubHkgYmUgYFN0cmluZyB8IFN0cmluZ0xpc3RgXG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc3RyaW5nTGlzdFZhbHVlID0gc3RyaW5nVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgdG9rZW4gdGhhdCB3aWxsIHJlc29sdmUgKGR1cmluZyBkZXBsb3ltZW50KSB0byB0aGUgbGlzdCB2YWx1ZSBvZiBhbiBTU00gU3RyaW5nTGlzdCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSBzY29wZSBTb21lIHNjb3BlIHdpdGhpbiBhIHN0YWNrXG4gICAqIEBwYXJhbSBwYXJhbWV0ZXJOYW1lIFRoZSBuYW1lIG9mIHRoZSBTU00gcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0gdHlwZSB0aGUgdHlwZSBvZiB0aGUgU1NNIGxpc3QgcGFyYW1ldGVyXG4gICAqIEBwYXJhbSB2ZXJzaW9uIFRoZSBwYXJhbWV0ZXIgdmVyc2lvbiAocmVjb21tZW5kZWQgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgdGhlIHZhbHVlIHdvbid0IGNoYW5nZSBkdXJpbmcgZGVwbG95bWVudClcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdmFsdWVGb3JUeXBlZExpc3RQYXJhbWV0ZXIoc2NvcGU6IENvbnN0cnVjdCwgcGFyYW1ldGVyTmFtZTogc3RyaW5nLCB0eXBlID0gUGFyYW1ldGVyVmFsdWVUeXBlLlNUUklORywgdmVyc2lvbj86IG51bWJlcik6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCBpZCA9IG1ha2VJZGVudGl0eUZvckltcG9ydGVkVmFsdWUocGFyYW1ldGVyTmFtZSk7XG4gICAgY29uc3QgZXhpc3RzID0gc3RhY2subm9kZS50cnlGaW5kQ2hpbGQoaWQpIGFzIElTdHJpbmdMaXN0UGFyYW1ldGVyO1xuXG4gICAgaWYgKGV4aXN0cykgeyByZXR1cm4gZXhpc3RzLnN0cmluZ0xpc3RWYWx1ZTsgfVxuXG4gICAgcmV0dXJuIHRoaXMuZnJvbUxpc3RQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCBpZCwgeyBwYXJhbWV0ZXJOYW1lLCBlbGVtZW50VHlwZTogdHlwZSwgdmVyc2lvbiB9KS5zdHJpbmdMaXN0VmFsdWU7XG4gIH1cblxuXG4gIHB1YmxpYyByZWFkb25seSBwYXJhbWV0ZXJBcm46IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHBhcmFtZXRlck5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHBhcmFtZXRlclR5cGU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHN0cmluZ0xpc3RWYWx1ZTogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN0cmluZ0xpc3RQYXJhbWV0ZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5wYXJhbWV0ZXJOYW1lLFxuICAgIH0pO1xuXG4gICAgaWYgKHByb3BzLnN0cmluZ0xpc3RWYWx1ZS5maW5kKHN0ciA9PiAhVG9rZW4uaXNVbnJlc29sdmVkKHN0cikgJiYgc3RyLmluZGV4T2YoJywnKSAhPT0gLTEpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlcyBvZiBhIFN0cmluZ0xpc3QgU1NNIFBhcmFtZXRlciBjYW5ub3QgY29udGFpbiB0aGUgXFwnLFxcJyBjaGFyYWN0ZXIuIFVzZSBhIHN0cmluZyBwYXJhbWV0ZXIgaW5zdGVhZC4nKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuYWxsb3dlZFBhdHRlcm4gJiYgIVRva2VuLmlzVW5yZXNvbHZlZChwcm9wcy5zdHJpbmdMaXN0VmFsdWUpKSB7XG4gICAgICBwcm9wcy5zdHJpbmdMaXN0VmFsdWUuZm9yRWFjaChzdHIgPT4gX2Fzc2VydFZhbGlkVmFsdWUoc3RyLCBwcm9wcy5hbGxvd2VkUGF0dGVybiEpKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZVBhcmFtZXRlck5hbWUodGhpcy5waHlzaWNhbE5hbWUpO1xuXG4gICAgaWYgKHByb3BzLmRlc2NyaXB0aW9uICYmIHByb3BzLmRlc2NyaXB0aW9uPy5sZW5ndGggPiAxMDI0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Rlc2NyaXB0aW9uIGNhbm5vdCBiZSBsb25nZXIgdGhhbiAxMDI0IGNoYXJhY3RlcnMuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgc3NtLkNmblBhcmFtZXRlcih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBhbGxvd2VkUGF0dGVybjogcHJvcHMuYWxsb3dlZFBhdHRlcm4sXG4gICAgICBkZXNjcmlwdGlvbjogcHJvcHMuZGVzY3JpcHRpb24sXG4gICAgICBuYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHRpZXI6IHByb3BzLnRpZXIsXG4gICAgICB0eXBlOiBQYXJhbWV0ZXJUeXBlLlNUUklOR19MSVNULFxuICAgICAgdmFsdWU6IEZuLmpvaW4oJywnLCBwcm9wcy5zdHJpbmdMaXN0VmFsdWUpLFxuICAgIH0pO1xuICAgIHRoaXMucGFyYW1ldGVyTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHJlc291cmNlLnJlZik7XG4gICAgdGhpcy5wYXJhbWV0ZXJBcm4gPSBhcm5Gb3JQYXJhbWV0ZXJOYW1lKHRoaXMsIHRoaXMucGFyYW1ldGVyTmFtZSwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5wYXJhbWV0ZXJOYW1lIHx8IEFVVE9HRU5fTUFSS0VSLFxuICAgICAgc2ltcGxlTmFtZTogcHJvcHMuc2ltcGxlTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMucGFyYW1ldGVyVHlwZSA9IHJlc291cmNlLmF0dHJUeXBlO1xuICAgIHRoaXMuc3RyaW5nTGlzdFZhbHVlID0gRm4uc3BsaXQoJywnLCByZXNvdXJjZS5hdHRyVmFsdWUpO1xuICB9XG59XG5cbi8qKlxuICogVmFsaWRhdGVzIHdoZXRoZXIgYSBzdXBwbGllZCB2YWx1ZSBjb25mb3JtcyB0byB0aGUgYWxsb3dlZFBhdHRlcm4sIGdyYW50ZWQgbmVpdGhlciBpcyBhbiB1bnJlc29sdmVkIHRva2VuLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSAgICAgICAgICB0aGUgdmFsdWUgdG8gYmUgdmFsaWRhdGVkLlxuICogQHBhcmFtIGFsbG93ZWRQYXR0ZXJuIHRoZSByZWd1bGFyIGV4cHJlc3Npb24gdG8gdXNlIGZvciB2YWxpZGF0aW9uLlxuICpcbiAqIEB0aHJvd3MgaWYgdGhlIGBgdmFsdWVgYCBkb2VzIG5vdCBjb25mb3JtIHRvIHRoZSBgYGFsbG93ZWRQYXR0ZXJuYGAgYW5kIG5laXRoZXIgaXMgYW4gdW5yZXNvbHZlZCB0b2tlbiAocGVyXG4gKiAgICAgICAgIGBgY2RrLnVucmVzb2x2ZWRgYCkuXG4gKi9cbmZ1bmN0aW9uIF9hc3NlcnRWYWxpZFZhbHVlKHZhbHVlOiBzdHJpbmcsIGFsbG93ZWRQYXR0ZXJuOiBzdHJpbmcpOiB2b2lkIHtcbiAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZCh2YWx1ZSkgfHwgVG9rZW4uaXNVbnJlc29sdmVkKGFsbG93ZWRQYXR0ZXJuKSkge1xuICAgIC8vIFVuYWJsZSB0byBwZXJmb3JtIHZhbGlkYXRpb25zIGFnYWluc3QgdW5yZXNvbHZlZCB0b2tlbnNcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFuZXcgUmVnRXhwKGFsbG93ZWRQYXR0ZXJuKS50ZXN0KHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHN1cHBsaWVkIHZhbHVlICgke3ZhbHVlfSkgZG9lcyBub3QgbWF0Y2ggdGhlIHNwZWNpZmllZCBhbGxvd2VkUGF0dGVybiAoJHthbGxvd2VkUGF0dGVybn0pYCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFrZUlkZW50aXR5Rm9ySW1wb3J0ZWRWYWx1ZShwYXJhbWV0ZXJOYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGBTc21QYXJhbWV0ZXJWYWx1ZToke3BhcmFtZXRlck5hbWV9OkM5NjU4NEI2LUYwMEEtNDY0RS1BRDE5LTUzQUZGNEIwNTExOGA7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlUGFyYW1ldGVyTmFtZShwYXJhbWV0ZXJOYW1lOiBzdHJpbmcpIHtcbiAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChwYXJhbWV0ZXJOYW1lKSkgeyByZXR1cm47IH1cbiAgaWYgKHBhcmFtZXRlck5hbWUubGVuZ3RoID4gMjA0OCkge1xuICAgIHRocm93IG5ldyBFcnJvcignbmFtZSBjYW5ub3QgYmUgbG9uZ2VyIHRoYW4gMjA0OCBjaGFyYWN0ZXJzLicpO1xuICB9XG4gIGlmICghcGFyYW1ldGVyTmFtZS5tYXRjaCgvXltcXC9cXHcuLV0rJC8pKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBuYW1lIG11c3Qgb25seSBjb250YWluIGxldHRlcnMsIG51bWJlcnMsIGFuZCB0aGUgZm9sbG93aW5nIDQgc3ltYm9scyAuLV8vOyBnb3QgJHtwYXJhbWV0ZXJOYW1lfWApO1xuICB9XG59XG4iXX0=