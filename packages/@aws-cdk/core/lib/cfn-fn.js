"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fn = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudformation_lang_1 = require("./private/cloudformation-lang");
const intrinsic_1 = require("./private/intrinsic");
const reference_1 = require("./reference");
const stack_1 = require("./stack");
const stack_trace_1 = require("./stack-trace");
const token_1 = require("./token");
/* eslint-disable max-len */
/**
 * CloudFormation intrinsic functions.
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html
 */
class Fn {
    /**
     * The ``Ref`` intrinsic function returns the value of the specified parameter or resource.
     * Note that it doesn't validate the logicalName, it mainly serves paremeter/resource reference defined in a ``CfnInclude`` template.
     * @param logicalName The logical name of a parameter/resource for which you want to retrieve its value.
     */
    static ref(logicalName) {
        return new FnRef(logicalName).toString();
    }
    /**
     * The ``Fn::GetAtt`` intrinsic function returns the value of an attribute
     * from a resource in the template.
     * @param logicalNameOfResource The logical name (also called logical ID) of
     * the resource that contains the attribute that you want.
     * @param attributeName The name of the resource-specific attribute whose
     * value you want. See the resource's reference page for details about the
     * attributes available for that resource type.
     * @returns an IResolvable object
     */
    static getAtt(logicalNameOfResource, attributeName) {
        return new FnGetAtt(logicalNameOfResource, attributeName);
    }
    /**
     * The intrinsic function ``Fn::Join`` appends a set of values into a single
     * value, separated by the specified delimiter. If a delimiter is the empty
     * string, the set of values are concatenated with no delimiter.
     * @param delimiter The value you want to occur between fragments. The
     * delimiter will occur between fragments only. It will not terminate the
     * final value.
     * @param listOfValues The list of values you want combined.
     * @returns a token represented as a string
     */
    static join(delimiter, listOfValues) {
        if (listOfValues.length === 0) {
            throw new Error('FnJoin requires at least one value to be provided');
        }
        return new FnJoin(delimiter, listOfValues).toString();
    }
    /**
     * Split a string token into a token list of string values.
     *
     * Specify the location of splits with a delimiter such as ',' (a comma).
     * Renders to the `Fn::Split` intrinsic function.
     *
     * Lists with unknown lengths (default)
     * -------------------------------------
     *
     * Since this function is used to work with deploy-time values, if `assumedLength`
     * is not given the CDK cannot know the length of the resulting list at synthesis time.
     * This brings the following restrictions:
     *
     * - You must use `Fn.select(i, list)` to pick elements out of the list (you must not use
     *   `list[i]`).
     * - You cannot add elements to the list, remove elements from the list,
     *   combine two such lists together, or take a slice of the list.
     * - You cannot pass the list to constructs that do any of the above.
     *
     * The only valid operation with such a tokenized list is to pass it unmodified to a
     * CloudFormation Resource construct.
     *
     * Lists with assumed lengths
     * --------------------------
     *
     * Pass `assumedLength` if you know the length of the list that will be
     * produced by splitting. The actual list length at deploy time may be
     * *longer* than the number you pass, but not *shorter*.
     *
     * The returned list will look like:
     *
     * ```
     * [Fn.select(0, split), Fn.select(1, split), Fn.select(2, split), ...]
     * ```
     *
     * The restrictions from the section "Lists with unknown lengths" will now be lifted,
     * at the expense of having to know and fix the length of the list.
     *
     * @param delimiter A string value that determines where the source string is divided.
     * @param source The string value that you want to split.
     * @param assumedLength The length of the list that will be produced by splitting
     * @returns a token represented as a string array
     */
    static split(delimiter, source, assumedLength) {
        // short-circut if source is not a token
        if (!token_1.Token.isUnresolved(source)) {
            return source.split(delimiter);
        }
        if (token_1.Token.isUnresolved(delimiter)) {
            // Limitation of CloudFormation
            throw new Error('Fn.split: \'delimiter\' may not be a token value');
        }
        const split = token_1.Token.asList(new FnSplit(delimiter, source));
        if (assumedLength === undefined) {
            return split;
        }
        if (token_1.Token.isUnresolved(assumedLength)) {
            throw new Error('Fn.split: \'assumedLength\' may not be a token value');
        }
        return range(assumedLength).map(i => Fn.select(i, split));
    }
    /**
     * The intrinsic function ``Fn::Select`` returns a single object from a list of objects by index.
     * @param index The index of the object to retrieve. This must be a value from zero to N-1, where N represents the number of elements in the array.
     * @param array The list of objects to select from. This list must not be null, nor can it have null entries.
     * @returns a token represented as a string
     */
    static select(index, array) {
        if (!token_1.Token.isUnresolved(index) && !token_1.Token.isUnresolved(array) && !array.some(token_1.Token.isUnresolved)) {
            return array[index];
        }
        return new FnSelect(index, array).toString();
    }
    /**
     * The intrinsic function ``Fn::Sub`` substitutes variables in an input string
     * with values that you specify. In your templates, you can use this function
     * to construct commands or outputs that include values that aren't available
     * until you create or update a stack.
     * @param body A string with variables that AWS CloudFormation substitutes
     * with their associated values at runtime. Write variables as ${MyVarName}.
     * Variables can be template parameter names, resource logical IDs, resource
     * attributes, or a variable in a key-value map. If you specify only template
     * parameter names, resource logical IDs, and resource attributes, don't
     * specify a key-value map.
     * @param variables The name of a variable that you included in the String
     * parameter. The value that AWS CloudFormation substitutes for the associated
     * variable name at runtime.
     * @returns a token represented as a string
     */
    static sub(body, variables) {
        return new FnSub(body, variables).toString();
    }
    /**
     * The intrinsic function ``Fn::Base64`` returns the Base64 representation of
     * the input string. This function is typically used to pass encoded data to
     * Amazon EC2 instances by way of the UserData property.
     * @param data The string value you want to convert to Base64.
     * @returns a token represented as a string
     */
    static base64(data) {
        return new FnBase64(data).toString();
    }
    /**
     * The intrinsic function ``Fn::Cidr`` returns the specified Cidr address block.
     * @param ipBlock  The user-specified default Cidr address block.
     * @param count  The number of subnets' Cidr block wanted. Count can be 1 to 256.
     * @param sizeMask The digit covered in the subnet.
     * @returns a token represented as a string
     */
    static cidr(ipBlock, count, sizeMask) {
        return token_1.Token.asList(new FnCidr(ipBlock, count, sizeMask));
    }
    /**
     * Given an url, parse the domain name
     * @param url the url to parse
     */
    static parseDomainName(url) {
        const noHttps = Fn.select(1, Fn.split('//', url));
        return Fn.select(0, Fn.split('/', noHttps));
    }
    /**
     * The intrinsic function ``Fn::GetAZs`` returns an array that lists
     * Availability Zones for a specified region. Because customers have access to
     * different Availability Zones, the intrinsic function ``Fn::GetAZs`` enables
     * template authors to write templates that adapt to the calling user's
     * access. That way you don't have to hard-code a full list of Availability
     * Zones for a specified region.
     * @param region The name of the region for which you want to get the
     * Availability Zones. You can use the AWS::Region pseudo parameter to specify
     * the region in which the stack is created. Specifying an empty string is
     * equivalent to specifying AWS::Region.
     * @returns a token represented as a string array
     */
    static getAzs(region) {
        return token_1.Token.asList(new FnGetAZs(region));
    }
    /**
     * The intrinsic function ``Fn::ImportValue`` returns the value of an output
     * exported by another stack. You typically use this function to create
     * cross-stack references. In the following example template snippets, Stack A
     * exports VPC security group values and Stack B imports them.
     * @param sharedValueToImport The stack output value that you want to import.
     * @returns a token represented as a string
     */
    static importValue(sharedValueToImport) {
        return new FnImportValue(sharedValueToImport).toString();
    }
    /**
     * Like `Fn.importValue`, but import a list with a known length
     *
     * If you explicitly want a list with an unknown length, call `Fn.split(',',
     * Fn.importValue(exportName))`. See the documentation of `Fn.split` to read
     * more about the limitations of using lists of unknown length.
     *
     * `Fn.importListValue(exportName, assumedLength)` is the same as
     * `Fn.split(',', Fn.importValue(exportName), assumedLength)`,
     * but easier to read and impossible to forget to pass `assumedLength`.
     */
    static importListValue(sharedValueToImport, assumedLength, delimiter = ',') {
        return Fn.split(delimiter, Fn.importValue(sharedValueToImport), assumedLength);
    }
    /**
     * The intrinsic function ``Fn::FindInMap`` returns the value corresponding to
     * keys in a two-level map that is declared in the Mappings section.
     * @returns a token represented as a string
     */
    static findInMap(mapName, topLevelKey, secondLevelKey) {
        return Fn._findInMap(mapName, topLevelKey, secondLevelKey).toString();
    }
    /**
     * An additional function used in CfnParser,
     * as Fn::FindInMap does not always return a string.
     *
     * @internal
     */
    static _findInMap(mapName, topLevelKey, secondLevelKey) {
        return new FnFindInMap(mapName, topLevelKey, secondLevelKey);
    }
    /**
     * Creates a token representing the ``Fn::Transform`` expression
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-transform.html
     * @param macroName The name of the macro to perform the processing
     * @param parameters The parameters to be passed to the macro
     * @returns a token representing the transform expression
     */
    static transform(macroName, parameters) {
        return new FnTransform(macroName, parameters);
    }
    /**
     * Returns true if all the specified conditions evaluate to true, or returns
     * false if any one of the conditions evaluates to false. ``Fn::And`` acts as
     * an AND operator. The minimum number of conditions that you can include is
     * 1.
     * @param conditions conditions to AND
     * @returns an FnCondition token
     */
    static conditionAnd(...conditions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ICfnConditionExpression(conditions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.conditionAnd);
            }
            throw error;
        }
        if (conditions.length === 0) {
            throw new Error('Fn.conditionAnd() needs at least one argument');
        }
        if (conditions.length === 1) {
            return conditions[0];
        }
        return Fn.conditionAnd(..._inGroupsOf(conditions, 10).map(group => new FnAnd(...group)));
    }
    /**
     * Compares if two values are equal. Returns true if the two values are equal
     * or false if they aren't.
     * @param lhs A value of any type that you want to compare.
     * @param rhs A value of any type that you want to compare.
     * @returns an FnCondition token
     */
    static conditionEquals(lhs, rhs) {
        return new FnEquals(lhs, rhs);
    }
    /**
     * Returns one value if the specified condition evaluates to true and another
     * value if the specified condition evaluates to false. Currently, AWS
     * CloudFormation supports the ``Fn::If`` intrinsic function in the metadata
     * attribute, update policy attribute, and property values in the Resources
     * section and Outputs sections of a template. You can use the AWS::NoValue
     * pseudo parameter as a return value to remove the corresponding property.
     * @param conditionId A reference to a condition in the Conditions section. Use
     * the condition's name to reference it.
     * @param valueIfTrue A value to be returned if the specified condition
     * evaluates to true.
     * @param valueIfFalse A value to be returned if the specified condition
     * evaluates to false.
     * @returns an FnCondition token
     */
    static conditionIf(conditionId, valueIfTrue, valueIfFalse) {
        return new FnIf(conditionId, valueIfTrue, valueIfFalse);
    }
    /**
     * Returns true for a condition that evaluates to false or returns false for a
     * condition that evaluates to true. ``Fn::Not`` acts as a NOT operator.
     * @param condition A condition such as ``Fn::Equals`` that evaluates to true
     * or false.
     * @returns an FnCondition token
     */
    static conditionNot(condition) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ICfnConditionExpression(condition);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.conditionNot);
            }
            throw error;
        }
        return new FnNot(condition);
    }
    /**
     * Returns true if any one of the specified conditions evaluate to true, or
     * returns false if all of the conditions evaluates to false. ``Fn::Or`` acts
     * as an OR operator. The minimum number of conditions that you can include is
     * 1.
     * @param conditions conditions that evaluates to true or false.
     * @returns an FnCondition token
     */
    static conditionOr(...conditions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ICfnConditionExpression(conditions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.conditionOr);
            }
            throw error;
        }
        if (conditions.length === 0) {
            throw new Error('Fn.conditionOr() needs at least one argument');
        }
        if (conditions.length === 1) {
            return conditions[0];
        }
        return Fn.conditionOr(..._inGroupsOf(conditions, 10).map(group => new FnOr(...group)));
    }
    /**
     * Returns true if a specified string matches at least one value in a list of
     * strings.
     * @param listOfStrings A list of strings, such as "A", "B", "C".
     * @param value A string, such as "A", that you want to compare against a list of strings.
     * @returns an FnCondition token
     */
    static conditionContains(listOfStrings, value) {
        return new FnContains(listOfStrings, value);
    }
    /**
     * Returns true if a specified string matches all values in a list.
     * @param listOfStrings A list of strings, such as "A", "B", "C".
     * @param value A string, such as "A", that you want to compare against a list
     * of strings.
     * @returns an FnCondition token
     */
    static conditionEachMemberEquals(listOfStrings, value) {
        return new FnEachMemberEquals(listOfStrings, value);
    }
    /**
     * Returns true if each member in a list of strings matches at least one value
     * in a second list of strings.
     * @param stringsToCheck A list of strings, such as "A", "B", "C". AWS
     * CloudFormation checks whether each member in the strings_to_check parameter
     * is in the strings_to_match parameter.
     * @param stringsToMatch A list of strings, such as "A", "B", "C". Each member
     * in the strings_to_match parameter is compared against the members of the
     * strings_to_check parameter.
     * @returns an FnCondition token
     */
    static conditionEachMemberIn(stringsToCheck, stringsToMatch) {
        return new FnEachMemberIn(stringsToCheck, stringsToMatch);
    }
    /**
     * Returns all values for a specified parameter type.
     * @param parameterType An AWS-specific parameter type, such as
     * AWS::EC2::SecurityGroup::Id or AWS::EC2::VPC::Id. For more information, see
     * Parameters in the AWS CloudFormation User Guide.
     * @returns a token represented as a string array
     */
    static refAll(parameterType) {
        return token_1.Token.asList(new FnRefAll(parameterType));
    }
    /**
     * Returns an attribute value or list of values for a specific parameter and
     * attribute.
     * @param parameterOrLogicalId The name of a parameter for which you want to
     * retrieve attribute values. The parameter must be declared in the Parameters
     * section of the template.
     * @param attribute The name of an attribute from which you want to retrieve a
     * value.
     * @returns a token represented as a string
     */
    static valueOf(parameterOrLogicalId, attribute) {
        return new FnValueOf(parameterOrLogicalId, attribute).toString();
    }
    /**
     * Returns a list of all attribute values for a given parameter type and
     * attribute.
     * @param parameterType An AWS-specific parameter type, such as
     * AWS::EC2::SecurityGroup::Id or AWS::EC2::VPC::Id. For more information, see
     * Parameters in the AWS CloudFormation User Guide.
     * @param attribute The name of an attribute from which you want to retrieve a
     * value. For more information about attributes, see Supported Attributes.
     * @returns a token represented as a string array
     */
    static valueOfAll(parameterType, attribute) {
        return token_1.Token.asList(new FnValueOfAll(parameterType, attribute));
    }
    /**
     * The `Fn::ToJsonString` intrinsic function converts an object or array to its
     * corresponding JSON string.
     *
     * @param object The object or array to stringify
     */
    static toJsonString(object) {
        // short-circut if object is not a token
        if (!token_1.Token.isUnresolved(object)) {
            return JSON.stringify(object);
        }
        return new FnToJsonString(object).toString();
    }
    /**
     * The intrinsic function `Fn::Length` returns the number of elements within an array
     * or an intrinsic function that returns an array.
     *
     * @param array The array you want to return the number of elements from
     */
    static len(array) {
        // short-circut if array is not a token
        if (!token_1.Token.isUnresolved(array)) {
            if (!Array.isArray(array)) {
                throw new Error('Fn.length() needs an array');
            }
            return array.length;
        }
        return token_1.Token.asNumber(new FnLength(array));
    }
    constructor() { }
}
_a = JSII_RTTI_SYMBOL_1;
Fn[_a] = { fqn: "@aws-cdk/core.Fn", version: "0.0.0" };
exports.Fn = Fn;
/**
 * Base class for tokens that represent CloudFormation intrinsic functions.
 */
class FnBase extends intrinsic_1.Intrinsic {
    constructor(name, value) {
        super({ [name]: value });
    }
}
/**
 * The intrinsic function ``Ref`` returns the value of the specified parameter or resource.
 * When you specify a parameter's logical name, it returns the value of the parameter.
 * When you specify a resource's logical name, it returns a value that you can typically use to refer to that resource, such as a physical ID.
 */
class FnRef extends FnBase {
    /**
     * Creates an ``Ref`` function.
     * @param logicalName The logical name of a parameter/resource for which you want to retrieve its value.
     */
    constructor(logicalName) {
        super('Ref', logicalName);
    }
}
/**
 * The intrinsic function ``Fn::FindInMap`` returns the value corresponding to keys in a two-level
 * map that is declared in the Mappings section.
 */
class FnFindInMap extends FnBase {
    /**
     * Creates an ``Fn::FindInMap`` function.
     * @param mapName The logical name of a mapping declared in the Mappings section that contains the keys and values.
     * @param topLevelKey The top-level key name. Its value is a list of key-value pairs.
     * @param secondLevelKey The second-level key name, which is set to one of the keys from the list assigned to TopLevelKey.
     */
    constructor(mapName, topLevelKey, secondLevelKey) {
        super('Fn::FindInMap', [mapName, topLevelKey, secondLevelKey]);
    }
}
/**
 * The intrinsic function ``Fn::Transform`` specifies a macro to perform custom processing on part of a stack template.
 */
class FnTransform extends FnBase {
    /**
     * creates an ``Fn::Transform`` function.
     * @param macroName The name of the macro to be invoked
     * @param parameters the parameters to pass to it
     */
    constructor(macroName, parameters) {
        super('Fn::Transform', { Name: macroName, Parameters: parameters });
    }
}
/**
 * The ``Fn::GetAtt`` intrinsic function returns the value of an attribute from a resource in the template.
 */
class FnGetAtt extends FnBase {
    /**
     * Creates a ``Fn::GetAtt`` function.
     * @param logicalNameOfResource The logical name (also called logical ID) of the resource that contains the attribute that you want.
     * @param attributeName The name of the resource-specific attribute whose value you want. See the resource's reference page for details about the attributes available for that resource type.
     */
    constructor(logicalNameOfResource, attributeName) {
        super('Fn::GetAtt', [logicalNameOfResource, attributeName]);
    }
}
/**
 * The intrinsic function ``Fn::GetAZs`` returns an array that lists Availability Zones for a
 * specified region. Because customers have access to different Availability Zones, the intrinsic
 * function ``Fn::GetAZs`` enables template authors to write templates that adapt to the calling
 * user's access. That way you don't have to hard-code a full list of Availability Zones for a
 * specified region.
 */
class FnGetAZs extends FnBase {
    /**
     * Creates an ``Fn::GetAZs`` function.
     * @param region The name of the region for which you want to get the Availability Zones.
     *         You can use the AWS::Region pseudo parameter to specify the region in
     *         which the stack is created. Specifying an empty string is equivalent to
     *         specifying AWS::Region.
     */
    constructor(region) {
        super('Fn::GetAZs', region || '');
    }
}
/**
 * The intrinsic function ``Fn::ImportValue`` returns the value of an output exported by another stack.
 * You typically use this function to create cross-stack references. In the following example
 * template snippets, Stack A exports VPC security group values and Stack B imports them.
 */
class FnImportValue extends FnBase {
    /**
     * Creates an ``Fn::ImportValue`` function.
     * @param sharedValueToImport The stack output value that you want to import.
     */
    constructor(sharedValueToImport) {
        super('Fn::ImportValue', sharedValueToImport);
    }
}
/**
 * The intrinsic function ``Fn::Select`` returns a single object from a list of objects by index.
 */
class FnSelect extends FnBase {
    /**
     * Creates an ``Fn::Select`` function.
     * @param index The index of the object to retrieve. This must be a value from zero to N-1, where N represents the number of elements in the array.
     * @param array The list of objects to select from. This list must not be null, nor can it have null entries.
     */
    constructor(index, array) {
        super('Fn::Select', [index, array]);
    }
}
/**
 * To split a string into a list of string values so that you can select an element from the
 * resulting string list, use the ``Fn::Split`` intrinsic function. Specify the location of splits
 * with a delimiter, such as , (a comma). After you split a string, use the ``Fn::Select`` function
 * to pick a specific element.
 */
class FnSplit extends FnBase {
    /**
     * Create an ``Fn::Split`` function.
     * @param delimiter A string value that determines where the source string is divided.
     * @param source The string value that you want to split.
     */
    constructor(delimiter, source) {
        super('Fn::Split', [delimiter, source]);
    }
}
/**
 * The intrinsic function ``Fn::Sub`` substitutes variables in an input string with values that
 * you specify. In your templates, you can use this function to construct commands or outputs
 * that include values that aren't available until you create or update a stack.
 */
class FnSub extends FnBase {
    /**
     * Creates an ``Fn::Sub`` function.
     * @param body A string with variables that AWS CloudFormation substitutes with their
     *       associated values at runtime. Write variables as ${MyVarName}. Variables
     *       can be template parameter names, resource logical IDs, resource attributes,
     *       or a variable in a key-value map. If you specify only template parameter names,
     *       resource logical IDs, and resource attributes, don't specify a key-value map.
     * @param variables The name of a variable that you included in the String parameter.
     *          The value that AWS CloudFormation substitutes for the associated variable name at runtime.
     */
    constructor(body, variables) {
        super('Fn::Sub', variables ? [body, variables] : body);
    }
}
/**
 * The intrinsic function ``Fn::Base64`` returns the Base64 representation of the input string.
 * This function is typically used to pass encoded data to Amazon EC2 instances by way of
 * the UserData property.
 */
class FnBase64 extends FnBase {
    /**
     * Creates an ``Fn::Base64`` function.
     * @param data The string value you want to convert to Base64.
     */
    constructor(data) {
        super('Fn::Base64', data);
    }
}
/**
 * The intrinsic function ``Fn::Cidr`` returns the specified Cidr address block.
 */
class FnCidr extends FnBase {
    /**
     * Creates an ``Fn::Cidr`` function.
     * @param ipBlock  The user-specified default Cidr address block.
     * @param count  The number of subnets' Cidr block wanted. Count can be 1 to 256.
     * @param sizeMask The digit covered in the subnet.
     */
    constructor(ipBlock, count, sizeMask) {
        if (count < 1 || count > 256) {
            throw new Error(`Fn::Cidr's count attribute must be betwen 1 and 256, ${count} was provided.`);
        }
        super('Fn::Cidr', [ipBlock, count, sizeMask]);
    }
}
class FnConditionBase extends intrinsic_1.Intrinsic {
    constructor(type, value) {
        super({ [type]: value });
        this.disambiguator = true;
    }
}
/**
 * Returns true if all the specified conditions evaluate to true, or returns false if any one
 *  of the conditions evaluates to false. ``Fn::And`` acts as an AND operator. The minimum number of
 * conditions that you can include is 2, and the maximum is 10.
 */
class FnAnd extends FnConditionBase {
    constructor(...condition) {
        super('Fn::And', condition);
    }
}
/**
 * Compares if two values are equal. Returns true if the two values are equal or false
 * if they aren't.
 */
class FnEquals extends FnConditionBase {
    /**
     * Creates an ``Fn::Equals`` condition function.
     * @param lhs A value of any type that you want to compare.
     * @param rhs A value of any type that you want to compare.
     */
    constructor(lhs, rhs) {
        super('Fn::Equals', [lhs, rhs]);
    }
}
/**
 * Returns one value if the specified condition evaluates to true and another value if the
 * specified condition evaluates to false. Currently, AWS CloudFormation supports the ``Fn::If``
 * intrinsic function in the metadata attribute, update policy attribute, and property values
 * in the Resources section and Outputs sections of a template. You can use the AWS::NoValue
 * pseudo parameter as a return value to remove the corresponding property.
 */
class FnIf extends FnConditionBase {
    /**
     * Creates an ``Fn::If`` condition function.
     * @param condition A reference to a condition in the Conditions section. Use the condition's name to reference it.
     * @param valueIfTrue A value to be returned if the specified condition evaluates to true.
     * @param valueIfFalse A value to be returned if the specified condition evaluates to false.
     */
    constructor(condition, valueIfTrue, valueIfFalse) {
        super('Fn::If', [condition, valueIfTrue, valueIfFalse]);
    }
}
/**
 * Returns true for a condition that evaluates to false or returns false for a condition that evaluates to true.
 * ``Fn::Not`` acts as a NOT operator.
 */
class FnNot extends FnConditionBase {
    /**
     * Creates an ``Fn::Not`` condition function.
     * @param condition A condition such as ``Fn::Equals`` that evaluates to true or false.
     */
    constructor(condition) {
        super('Fn::Not', [condition]);
    }
}
/**
 * Returns true if any one of the specified conditions evaluate to true, or returns false if
 * all of the conditions evaluates to false. ``Fn::Or`` acts as an OR operator. The minimum number
 * of conditions that you can include is 2, and the maximum is 10.
 */
class FnOr extends FnConditionBase {
    /**
     * Creates an ``Fn::Or`` condition function.
     * @param condition A condition that evaluates to true or false.
     */
    constructor(...condition) {
        super('Fn::Or', condition);
    }
}
/**
 * Returns true if a specified string matches at least one value in a list of strings.
 */
class FnContains extends FnConditionBase {
    /**
     * Creates an ``Fn::Contains`` function.
     * @param listOfStrings A list of strings, such as "A", "B", "C".
     * @param value A string, such as "A", that you want to compare against a list of strings.
     */
    constructor(listOfStrings, value) {
        super('Fn::Contains', [listOfStrings, value]);
    }
}
/**
 * Returns true if a specified string matches all values in a list.
 */
class FnEachMemberEquals extends FnConditionBase {
    /**
     * Creates an ``Fn::EachMemberEquals`` function.
     * @param listOfStrings A list of strings, such as "A", "B", "C".
     * @param value A string, such as "A", that you want to compare against a list of strings.
     */
    constructor(listOfStrings, value) {
        super('Fn::EachMemberEquals', [listOfStrings, value]);
    }
}
/**
 * Returns true if each member in a list of strings matches at least one value in a second
 * list of strings.
 */
class FnEachMemberIn extends FnConditionBase {
    /**
     * Creates an ``Fn::EachMemberIn`` function.
     * @param stringsToCheck A list of strings, such as "A", "B", "C". AWS CloudFormation checks whether each member in the strings_to_check parameter is in the strings_to_match parameter.
     * @param stringsToMatch A list of strings, such as "A", "B", "C". Each member in the strings_to_match parameter is compared against the members of the strings_to_check parameter.
     */
    constructor(stringsToCheck, stringsToMatch) {
        super('Fn::EachMemberIn', [stringsToCheck, stringsToMatch]);
    }
}
/**
 * Returns all values for a specified parameter type.
 */
class FnRefAll extends FnBase {
    /**
     * Creates an ``Fn::RefAll`` function.
     * @param parameterType An AWS-specific parameter type, such as AWS::EC2::SecurityGroup::Id or
     *            AWS::EC2::VPC::Id. For more information, see Parameters in the AWS
     *            CloudFormation User Guide.
     */
    constructor(parameterType) {
        super('Fn::RefAll', parameterType);
    }
}
/**
 * Returns an attribute value or list of values for a specific parameter and attribute.
 */
class FnValueOf extends FnBase {
    /**
     * Creates an ``Fn::ValueOf`` function.
     * @param parameterOrLogicalId The name of a parameter for which you want to retrieve attribute values. The parameter must be declared in the Parameters section of the template.
     * @param attribute The name of an attribute from which you want to retrieve a value.
     */
    constructor(parameterOrLogicalId, attribute) {
        super('Fn::ValueOf', [parameterOrLogicalId, attribute]);
    }
}
/**
 * Returns a list of all attribute values for a given parameter type and attribute.
 */
class FnValueOfAll extends FnBase {
    /**
     * Creates an ``Fn::ValueOfAll`` function.
     * @param parameterType An AWS-specific parameter type, such as AWS::EC2::SecurityGroup::Id or AWS::EC2::VPC::Id. For more information, see Parameters in the AWS CloudFormation User Guide.
     * @param attribute The name of an attribute from which you want to retrieve a value. For more information about attributes, see Supported Attributes.
     */
    constructor(parameterType, attribute) {
        super('Fn::ValueOfAll', [parameterType, attribute]);
    }
}
/**
 * The intrinsic function ``Fn::Join`` appends a set of values into a single value, separated by
 * the specified delimiter. If a delimiter is the empty string, the set of values are concatenated
 * with no delimiter.
 */
class FnJoin {
    /**
     * Creates an ``Fn::Join`` function.
     * @param delimiter The value you want to occur between fragments. The delimiter will occur between fragments only.
     *          It will not terminate the final value.
     * @param listOfValues The list of values you want combined.
     */
    constructor(delimiter, listOfValues) {
        if (listOfValues.length === 0) {
            throw new Error('FnJoin requires at least one value to be provided');
        }
        this.delimiter = delimiter;
        this.listOfValues = listOfValues;
        this.creationStack = (0, stack_trace_1.captureStackTrace)();
    }
    resolve(context) {
        if (token_1.Token.isUnresolved(this.listOfValues)) {
            // This is a list token, don't try to do smart things with it.
            return { 'Fn::Join': [this.delimiter, this.listOfValues] };
        }
        const resolved = this.resolveValues(context);
        if (resolved.length === 1) {
            return resolved[0];
        }
        return { 'Fn::Join': [this.delimiter, resolved] };
    }
    toString() {
        return token_1.Token.asString(this, { displayHint: 'Fn::Join' });
    }
    toJSON() {
        return '<Fn::Join>';
    }
    /**
     * Optimization: if an Fn::Join is nested in another one and they share the same delimiter, then flatten it up. Also,
     * if two concatenated elements are literal strings (not tokens), then pre-concatenate them with the delimiter, to
     * generate shorter output.
     */
    resolveValues(context) {
        const resolvedValues = this.listOfValues.map(x => reference_1.Reference.isReference(x) ? x : context.resolve(x));
        return (0, cloudformation_lang_1.minimalCloudFormationJoin)(this.delimiter, resolvedValues);
    }
}
/**
 * The `Fn::ToJsonString` intrinsic function converts an object or array to its
 * corresponding JSON string.
 */
class FnToJsonString {
    constructor(object) {
        this.object = object;
        this.creationStack = (0, stack_trace_1.captureStackTrace)();
    }
    resolve(context) {
        stack_1.Stack.of(context.scope).addTransform('AWS::LanguageExtensions');
        return { 'Fn::ToJsonString': this.object };
    }
    toString() {
        return token_1.Token.asString(this, { displayHint: 'Fn::ToJsonString' });
    }
    toJSON() {
        return '<Fn::ToJsonString>';
    }
}
/**
 * The intrinsic function `Fn::Length` returns the number of elements within an array
 * or an intrinsic function that returns an array.
 */
class FnLength {
    constructor(array) {
        this.array = array;
        this.creationStack = (0, stack_trace_1.captureStackTrace)();
    }
    resolve(context) {
        stack_1.Stack.of(context.scope).addTransform('AWS::LanguageExtensions');
        return { 'Fn::Length': this.array };
    }
    toString() {
        return token_1.Token.asString(this, { displayHint: 'Fn::Length' });
    }
    toJSON() {
        return '<Fn::Length>';
    }
}
function _inGroupsOf(array, maxGroup) {
    const result = new Array();
    for (let i = 0; i < array.length; i += maxGroup) {
        result.push(array.slice(i, i + maxGroup));
    }
    return result;
}
function range(n) {
    const ret = [];
    for (let i = 0; i < n; i++) {
        ret.push(i);
    }
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWZuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLWZuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHVFQUEwRTtBQUMxRSxtREFBZ0Q7QUFDaEQsMkNBQXdDO0FBRXhDLG1DQUFnQztBQUNoQywrQ0FBa0Q7QUFDbEQsbUNBQWdDO0FBRWhDLDRCQUE0QjtBQUU1Qjs7O0dBR0c7QUFDSCxNQUFhLEVBQUU7SUFDYjs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFtQjtRQUNuQyxPQUFPLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQzFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxxQkFBNkIsRUFBRSxhQUFxQjtRQUN2RSxPQUFPLElBQUksUUFBUSxDQUFDLHFCQUFxQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0tBQzNEO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFpQixFQUFFLFlBQXNCO1FBQzFELElBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO1NBQ3RFO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDdkQ7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BMENHO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFpQixFQUFFLE1BQWMsRUFBRSxhQUFzQjtRQUMzRSx3Q0FBd0M7UUFDeEMsSUFBSSxDQUFDLGFBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDL0IsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2hDO1FBRUQsSUFBSSxhQUFL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S0FDMUM7SUFFTSxPQUFPLENBQUMsT0FBd0I7UUFDckMsYUFBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsWUFBWSxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDaEUsT0FBTyxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDckM7SUFFTSxRQUFRO1FBQ2IsT0FBTyxhQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0tBQzVEO0lBRU0sTUFBTTtRQUNYLE9BQU8sY0FBYyxDQUFDO0tBQ3ZCO0NBQ0Y7QUFFRCxTQUFTLFdBQVcsQ0FBSSxLQUFVLEVBQUUsUUFBZ0I7SUFDbEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQU8sQ0FBQztJQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksUUFBUSxFQUFFO1FBQy9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7S0FDM0M7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUMsQ0FBUztJQUN0QixNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDZixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDYjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDZm5Db25kaXRpb25FeHByZXNzaW9uLCBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24gfSBmcm9tICcuL2Nmbi1jb25kaXRpb24nO1xuaW1wb3J0IHsgbWluaW1hbENsb3VkRm9ybWF0aW9uSm9pbiB9IGZyb20gJy4vcHJpdmF0ZS9jbG91ZGZvcm1hdGlvbi1sYW5nJztcbmltcG9ydCB7IEludHJpbnNpYyB9IGZyb20gJy4vcHJpdmF0ZS9pbnRyaW5zaWMnO1xuaW1wb3J0IHsgUmVmZXJlbmNlIH0gZnJvbSAnLi9yZWZlcmVuY2UnO1xuaW1wb3J0IHsgSVJlc29sdmFibGUsIElSZXNvbHZlQ29udGV4dCB9IGZyb20gJy4vcmVzb2x2YWJsZSc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHsgY2FwdHVyZVN0YWNrVHJhY2UgfSBmcm9tICcuL3N0YWNrLXRyYWNlJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi90b2tlbic7XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cblxuLyoqXG4gKiBDbG91ZEZvcm1hdGlvbiBpbnRyaW5zaWMgZnVuY3Rpb25zLlxuICogaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9pbnRyaW5zaWMtZnVuY3Rpb24tcmVmZXJlbmNlLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIEZuIHtcbiAgLyoqXG4gICAqIFRoZSBgYFJlZmBgIGludHJpbnNpYyBmdW5jdGlvbiByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIHBhcmFtZXRlciBvciByZXNvdXJjZS5cbiAgICogTm90ZSB0aGF0IGl0IGRvZXNuJ3QgdmFsaWRhdGUgdGhlIGxvZ2ljYWxOYW1lLCBpdCBtYWlubHkgc2VydmVzIHBhcmVtZXRlci9yZXNvdXJjZSByZWZlcmVuY2UgZGVmaW5lZCBpbiBhIGBgQ2ZuSW5jbHVkZWBgIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gbG9naWNhbE5hbWUgVGhlIGxvZ2ljYWwgbmFtZSBvZiBhIHBhcmFtZXRlci9yZXNvdXJjZSBmb3Igd2hpY2ggeW91IHdhbnQgdG8gcmV0cmlldmUgaXRzIHZhbHVlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWYobG9naWNhbE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBGblJlZihsb2dpY2FsTmFtZSkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYGBGbjo6R2V0QXR0YGAgaW50cmluc2ljIGZ1bmN0aW9uIHJldHVybnMgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZVxuICAgKiBmcm9tIGEgcmVzb3VyY2UgaW4gdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gbG9naWNhbE5hbWVPZlJlc291cmNlIFRoZSBsb2dpY2FsIG5hbWUgKGFsc28gY2FsbGVkIGxvZ2ljYWwgSUQpIG9mXG4gICAqIHRoZSByZXNvdXJjZSB0aGF0IGNvbnRhaW5zIHRoZSBhdHRyaWJ1dGUgdGhhdCB5b3Ugd2FudC5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZU5hbWUgVGhlIG5hbWUgb2YgdGhlIHJlc291cmNlLXNwZWNpZmljIGF0dHJpYnV0ZSB3aG9zZVxuICAgKiB2YWx1ZSB5b3Ugd2FudC4gU2VlIHRoZSByZXNvdXJjZSdzIHJlZmVyZW5jZSBwYWdlIGZvciBkZXRhaWxzIGFib3V0IHRoZVxuICAgKiBhdHRyaWJ1dGVzIGF2YWlsYWJsZSBmb3IgdGhhdCByZXNvdXJjZSB0eXBlLlxuICAgKiBAcmV0dXJucyBhbiBJUmVzb2x2YWJsZSBvYmplY3RcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0QXR0KGxvZ2ljYWxOYW1lT2ZSZXNvdXJjZTogc3RyaW5nLCBhdHRyaWJ1dGVOYW1lOiBzdHJpbmcpOiBJUmVzb2x2YWJsZSB7XG4gICAgcmV0dXJuIG5ldyBGbkdldEF0dChsb2dpY2FsTmFtZU9mUmVzb3VyY2UsIGF0dHJpYnV0ZU5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6Sm9pbmBgIGFwcGVuZHMgYSBzZXQgb2YgdmFsdWVzIGludG8gYSBzaW5nbGVcbiAgICogdmFsdWUsIHNlcGFyYXRlZCBieSB0aGUgc3BlY2lmaWVkIGRlbGltaXRlci4gSWYgYSBkZWxpbWl0ZXIgaXMgdGhlIGVtcHR5XG4gICAqIHN0cmluZywgdGhlIHNldCBvZiB2YWx1ZXMgYXJlIGNvbmNhdGVuYXRlZCB3aXRoIG5vIGRlbGltaXRlci5cbiAgICogQHBhcmFtIGRlbGltaXRlciBUaGUgdmFsdWUgeW91IHdhbnQgdG8gb2NjdXIgYmV0d2VlbiBmcmFnbWVudHMuIFRoZVxuICAgKiBkZWxpbWl0ZXIgd2lsbCBvY2N1ciBiZXR3ZWVuIGZyYWdtZW50cyBvbmx5LiBJdCB3aWxsIG5vdCB0ZXJtaW5hdGUgdGhlXG4gICAqIGZpbmFsIHZhbHVlLlxuICAgKiBAcGFyYW0gbGlzdE9mVmFsdWVzIFRoZSBsaXN0IG9mIHZhbHVlcyB5b3Ugd2FudCBjb21iaW5lZC5cbiAgICogQHJldHVybnMgYSB0b2tlbiByZXByZXNlbnRlZCBhcyBhIHN0cmluZ1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBqb2luKGRlbGltaXRlcjogc3RyaW5nLCBsaXN0T2ZWYWx1ZXM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICBpZiAobGlzdE9mVmFsdWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGbkpvaW4gcmVxdWlyZXMgYXQgbGVhc3Qgb25lIHZhbHVlIHRvIGJlIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBGbkpvaW4oZGVsaW1pdGVyLCBsaXN0T2ZWYWx1ZXMpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogU3BsaXQgYSBzdHJpbmcgdG9rZW4gaW50byBhIHRva2VuIGxpc3Qgb2Ygc3RyaW5nIHZhbHVlcy5cbiAgICpcbiAgICogU3BlY2lmeSB0aGUgbG9jYXRpb24gb2Ygc3BsaXRzIHdpdGggYSBkZWxpbWl0ZXIgc3VjaCBhcyAnLCcgKGEgY29tbWEpLlxuICAgKiBSZW5kZXJzIHRvIHRoZSBgRm46OlNwbGl0YCBpbnRyaW5zaWMgZnVuY3Rpb24uXG4gICAqXG4gICAqIExpc3RzIHdpdGggdW5rbm93biBsZW5ndGhzIChkZWZhdWx0KVxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqXG4gICAqIFNpbmNlIHRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byB3b3JrIHdpdGggZGVwbG95LXRpbWUgdmFsdWVzLCBpZiBgYXNzdW1lZExlbmd0aGBcbiAgICogaXMgbm90IGdpdmVuIHRoZSBDREsgY2Fubm90IGtub3cgdGhlIGxlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIGxpc3QgYXQgc3ludGhlc2lzIHRpbWUuXG4gICAqIFRoaXMgYnJpbmdzIHRoZSBmb2xsb3dpbmcgcmVzdHJpY3Rpb25zOlxuICAgKlxuICAgKiAtIFlvdSBtdXN0IHVzZSBgRm4uc2VsZWN0KGksIGxpc3QpYCB0byBwaWNrIGVsZW1lbnRzIG91dCBvZiB0aGUgbGlzdCAoeW91IG11c3Qgbm90IHVzZVxuICAgKiAgIGBsaXN0W2ldYCkuXG4gICAqIC0gWW91IGNhbm5vdCBhZGQgZWxlbWVudHMgdG8gdGhlIGxpc3QsIHJlbW92ZSBlbGVtZW50cyBmcm9tIHRoZSBsaXN0LFxuICAgKiAgIGNvbWJpbmUgdHdvIHN1Y2ggbGlzdHMgdG9nZXRoZXIsIG9yIHRha2UgYSBzbGljZSBvZiB0aGUgbGlzdC5cbiAgICogLSBZb3UgY2Fubm90IHBhc3MgdGhlIGxpc3QgdG8gY29uc3RydWN0cyB0aGF0IGRvIGFueSBvZiB0aGUgYWJvdmUuXG4gICAqXG4gICAqIFRoZSBvbmx5IHZhbGlkIG9wZXJhdGlvbiB3aXRoIHN1Y2ggYSB0b2tlbml6ZWQgbGlzdCBpcyB0byBwYXNzIGl0IHVubW9kaWZpZWQgdG8gYVxuICAgKiBDbG91ZEZvcm1hdGlvbiBSZXNvdXJjZSBjb25zdHJ1Y3QuXG4gICAqXG4gICAqIExpc3RzIHdpdGggYXNzdW1lZCBsZW5ndGhzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqXG4gICAqIFBhc3MgYGFzc3VtZWRMZW5ndGhgIGlmIHlvdSBrbm93IHRoZSBsZW5ndGggb2YgdGhlIGxpc3QgdGhhdCB3aWxsIGJlXG4gICAqIHByb2R1Y2VkIGJ5IHNwbGl0dGluZy4gVGhlIGFjdHVhbCBsaXN0IGxlbmd0aCBhdCBkZXBsb3kgdGltZSBtYXkgYmVcbiAgICogKmxvbmdlciogdGhhbiB0aGUgbnVtYmVyIHlvdSBwYXNzLCBidXQgbm90ICpzaG9ydGVyKi5cbiAgICpcbiAgICogVGhlIHJldHVybmVkIGxpc3Qgd2lsbCBsb29rIGxpa2U6XG4gICAqXG4gICAqIGBgYFxuICAgKiBbRm4uc2VsZWN0KDAsIHNwbGl0KSwgRm4uc2VsZWN0KDEsIHNwbGl0KSwgRm4uc2VsZWN0KDIsIHNwbGl0KSwgLi4uXVxuICAgKiBgYGBcbiAgICpcbiAgICogVGhlIHJlc3RyaWN0aW9ucyBmcm9tIHRoZSBzZWN0aW9uIFwiTGlzdHMgd2l0aCB1bmtub3duIGxlbmd0aHNcIiB3aWxsIG5vdyBiZSBsaWZ0ZWQsXG4gICAqIGF0IHRoZSBleHBlbnNlIG9mIGhhdmluZyB0byBrbm93IGFuZCBmaXggdGhlIGxlbmd0aCBvZiB0aGUgbGlzdC5cbiAgICpcbiAgICogQHBhcmFtIGRlbGltaXRlciBBIHN0cmluZyB2YWx1ZSB0aGF0IGRldGVybWluZXMgd2hlcmUgdGhlIHNvdXJjZSBzdHJpbmcgaXMgZGl2aWRlZC5cbiAgICogQHBhcmFtIHNvdXJjZSBUaGUgc3RyaW5nIHZhbHVlIHRoYXQgeW91IHdhbnQgdG8gc3BsaXQuXG4gICAqIEBwYXJhbSBhc3N1bWVkTGVuZ3RoIFRoZSBsZW5ndGggb2YgdGhlIGxpc3QgdGhhdCB3aWxsIGJlIHByb2R1Y2VkIGJ5IHNwbGl0dGluZ1xuICAgKiBAcmV0dXJucyBhIHRva2VuIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nIGFycmF5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNwbGl0KGRlbGltaXRlcjogc3RyaW5nLCBzb3VyY2U6IHN0cmluZywgYXNzdW1lZExlbmd0aD86IG51bWJlcik6IHN0cmluZ1tdIHtcbiAgICAvLyBzaG9ydC1jaXJjdXQgaWYgc291cmNlIGlzIG5vdCBhIHRva2VuXG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zcGxpdChkZWxpbWl0ZXIpO1xuICAgIH1cblxuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQoZGVsaW1pdGVyKSkge1xuICAgICAgLy8gTGltaXRhdGlvbiBvZiBDbG91ZEZvcm1hdGlvblxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGbi5zcGxpdDogXFwnZGVsaW1pdGVyXFwnIG1heSBub3QgYmUgYSB0b2tlbiB2YWx1ZScpO1xuICAgIH1cblxuICAgIGNvbnN0IHNwbGl0ID0gVG9rZW4uYXNMaXN0KG5ldyBGblNwbGl0KGRlbGltaXRlciwgc291cmNlKSk7XG4gICAgaWYgKGFzc3VtZWRMZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHNwbGl0O1xuICAgIH1cblxuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQoYXNzdW1lZExlbmd0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm4uc3BsaXQ6IFxcJ2Fzc3VtZWRMZW5ndGhcXCcgbWF5IG5vdCBiZSBhIHRva2VuIHZhbHVlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmdlKGFzc3VtZWRMZW5ndGgpLm1hcChpID0+IEZuLnNlbGVjdChpLCBzcGxpdCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6U2VsZWN0YGAgcmV0dXJucyBhIHNpbmdsZSBvYmplY3QgZnJvbSBhIGxpc3Qgb2Ygb2JqZWN0cyBieSBpbmRleC5cbiAgICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCBvZiB0aGUgb2JqZWN0IHRvIHJldHJpZXZlLiBUaGlzIG11c3QgYmUgYSB2YWx1ZSBmcm9tIHplcm8gdG8gTi0xLCB3aGVyZSBOIHJlcHJlc2VudHMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgYXJyYXkuXG4gICAqIEBwYXJhbSBhcnJheSBUaGUgbGlzdCBvZiBvYmplY3RzIHRvIHNlbGVjdCBmcm9tLiBUaGlzIGxpc3QgbXVzdCBub3QgYmUgbnVsbCwgbm9yIGNhbiBpdCBoYXZlIG51bGwgZW50cmllcy5cbiAgICogQHJldHVybnMgYSB0b2tlbiByZXByZXNlbnRlZCBhcyBhIHN0cmluZ1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzZWxlY3QoaW5kZXg6IG51bWJlciwgYXJyYXk6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChpbmRleCkgJiYgIVRva2VuLmlzVW5yZXNvbHZlZChhcnJheSkgJiYgIWFycmF5LnNvbWUoVG9rZW4uaXNVbnJlc29sdmVkKSkge1xuICAgICAgcmV0dXJuIGFycmF5W2luZGV4XTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEZuU2VsZWN0KGluZGV4LCBhcnJheSkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OlN1YmBgIHN1YnN0aXR1dGVzIHZhcmlhYmxlcyBpbiBhbiBpbnB1dCBzdHJpbmdcbiAgICogd2l0aCB2YWx1ZXMgdGhhdCB5b3Ugc3BlY2lmeS4gSW4geW91ciB0ZW1wbGF0ZXMsIHlvdSBjYW4gdXNlIHRoaXMgZnVuY3Rpb25cbiAgICogdG8gY29uc3RydWN0IGNvbW1hbmRzIG9yIG91dHB1dHMgdGhhdCBpbmNsdWRlIHZhbHVlcyB0aGF0IGFyZW4ndCBhdmFpbGFibGVcbiAgICogdW50aWwgeW91IGNyZWF0ZSBvciB1cGRhdGUgYSBzdGFjay5cbiAgICogQHBhcmFtIGJvZHkgQSBzdHJpbmcgd2l0aCB2YXJpYWJsZXMgdGhhdCBBV1MgQ2xvdWRGb3JtYXRpb24gc3Vic3RpdHV0ZXNcbiAgICogd2l0aCB0aGVpciBhc3NvY2lhdGVkIHZhbHVlcyBhdCBydW50aW1lLiBXcml0ZSB2YXJpYWJsZXMgYXMgJHtNeVZhck5hbWV9LlxuICAgKiBWYXJpYWJsZXMgY2FuIGJlIHRlbXBsYXRlIHBhcmFtZXRlciBuYW1lcywgcmVzb3VyY2UgbG9naWNhbCBJRHMsIHJlc291cmNlXG4gICAqIGF0dHJpYnV0ZXMsIG9yIGEgdmFyaWFibGUgaW4gYSBrZXktdmFsdWUgbWFwLiBJZiB5b3Ugc3BlY2lmeSBvbmx5IHRlbXBsYXRlXG4gICAqIHBhcmFtZXRlciBuYW1lcywgcmVzb3VyY2UgbG9naWNhbCBJRHMsIGFuZCByZXNvdXJjZSBhdHRyaWJ1dGVzLCBkb24ndFxuICAgKiBzcGVjaWZ5IGEga2V5LXZhbHVlIG1hcC5cbiAgICogQHBhcmFtIHZhcmlhYmxlcyBUaGUgbmFtZSBvZiBhIHZhcmlhYmxlIHRoYXQgeW91IGluY2x1ZGVkIGluIHRoZSBTdHJpbmdcbiAgICogcGFyYW1ldGVyLiBUaGUgdmFsdWUgdGhhdCBBV1MgQ2xvdWRGb3JtYXRpb24gc3Vic3RpdHV0ZXMgZm9yIHRoZSBhc3NvY2lhdGVkXG4gICAqIHZhcmlhYmxlIG5hbWUgYXQgcnVudGltZS5cbiAgICogQHJldHVybnMgYSB0b2tlbiByZXByZXNlbnRlZCBhcyBhIHN0cmluZ1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdWIoYm9keTogc3RyaW5nLCB2YXJpYWJsZXM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KTogc3RyaW5nIHtcbiAgICByZXR1cm4gbmV3IEZuU3ViKGJvZHksIHZhcmlhYmxlcykudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OkJhc2U2NGBgIHJldHVybnMgdGhlIEJhc2U2NCByZXByZXNlbnRhdGlvbiBvZlxuICAgKiB0aGUgaW5wdXQgc3RyaW5nLiBUaGlzIGZ1bmN0aW9uIGlzIHR5cGljYWxseSB1c2VkIHRvIHBhc3MgZW5jb2RlZCBkYXRhIHRvXG4gICAqIEFtYXpvbiBFQzIgaW5zdGFuY2VzIGJ5IHdheSBvZiB0aGUgVXNlckRhdGEgcHJvcGVydHkuXG4gICAqIEBwYXJhbSBkYXRhIFRoZSBzdHJpbmcgdmFsdWUgeW91IHdhbnQgdG8gY29udmVydCB0byBCYXNlNjQuXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYmFzZTY0KGRhdGE6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBGbkJhc2U2NChkYXRhKS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6Q2lkcmBgIHJldHVybnMgdGhlIHNwZWNpZmllZCBDaWRyIGFkZHJlc3MgYmxvY2suXG4gICAqIEBwYXJhbSBpcEJsb2NrICBUaGUgdXNlci1zcGVjaWZpZWQgZGVmYXVsdCBDaWRyIGFkZHJlc3MgYmxvY2suXG4gICAqIEBwYXJhbSBjb3VudCAgVGhlIG51bWJlciBvZiBzdWJuZXRzJyBDaWRyIGJsb2NrIHdhbnRlZC4gQ291bnQgY2FuIGJlIDEgdG8gMjU2LlxuICAgKiBAcGFyYW0gc2l6ZU1hc2sgVGhlIGRpZ2l0IGNvdmVyZWQgaW4gdGhlIHN1Ym5ldC5cbiAgICogQHJldHVybnMgYSB0b2tlbiByZXByZXNlbnRlZCBhcyBhIHN0cmluZ1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjaWRyKGlwQmxvY2s6IHN0cmluZywgY291bnQ6IG51bWJlciwgc2l6ZU1hc2s/OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFRva2VuLmFzTGlzdChuZXcgRm5DaWRyKGlwQmxvY2ssIGNvdW50LCBzaXplTWFzaykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIGFuIHVybCwgcGFyc2UgdGhlIGRvbWFpbiBuYW1lXG4gICAqIEBwYXJhbSB1cmwgdGhlIHVybCB0byBwYXJzZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwYXJzZURvbWFpbk5hbWUodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IG5vSHR0cHMgPSBGbi5zZWxlY3QoMSwgRm4uc3BsaXQoJy8vJywgdXJsKSk7XG4gICAgcmV0dXJuIEZuLnNlbGVjdCgwLCBGbi5zcGxpdCgnLycsIG5vSHR0cHMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OkdldEFac2BgIHJldHVybnMgYW4gYXJyYXkgdGhhdCBsaXN0c1xuICAgKiBBdmFpbGFiaWxpdHkgWm9uZXMgZm9yIGEgc3BlY2lmaWVkIHJlZ2lvbi4gQmVjYXVzZSBjdXN0b21lcnMgaGF2ZSBhY2Nlc3MgdG9cbiAgICogZGlmZmVyZW50IEF2YWlsYWJpbGl0eSBab25lcywgdGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpHZXRBWnNgYCBlbmFibGVzXG4gICAqIHRlbXBsYXRlIGF1dGhvcnMgdG8gd3JpdGUgdGVtcGxhdGVzIHRoYXQgYWRhcHQgdG8gdGhlIGNhbGxpbmcgdXNlcidzXG4gICAqIGFjY2Vzcy4gVGhhdCB3YXkgeW91IGRvbid0IGhhdmUgdG8gaGFyZC1jb2RlIGEgZnVsbCBsaXN0IG9mIEF2YWlsYWJpbGl0eVxuICAgKiBab25lcyBmb3IgYSBzcGVjaWZpZWQgcmVnaW9uLlxuICAgKiBAcGFyYW0gcmVnaW9uIFRoZSBuYW1lIG9mIHRoZSByZWdpb24gZm9yIHdoaWNoIHlvdSB3YW50IHRvIGdldCB0aGVcbiAgICogQXZhaWxhYmlsaXR5IFpvbmVzLiBZb3UgY2FuIHVzZSB0aGUgQVdTOjpSZWdpb24gcHNldWRvIHBhcmFtZXRlciB0byBzcGVjaWZ5XG4gICAqIHRoZSByZWdpb24gaW4gd2hpY2ggdGhlIHN0YWNrIGlzIGNyZWF0ZWQuIFNwZWNpZnlpbmcgYW4gZW1wdHkgc3RyaW5nIGlzXG4gICAqIGVxdWl2YWxlbnQgdG8gc3BlY2lmeWluZyBBV1M6OlJlZ2lvbi5cbiAgICogQHJldHVybnMgYSB0b2tlbiByZXByZXNlbnRlZCBhcyBhIHN0cmluZyBhcnJheVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXRBenMocmVnaW9uPzogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBUb2tlbi5hc0xpc3QobmV3IEZuR2V0QVpzKHJlZ2lvbikpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6SW1wb3J0VmFsdWVgYCByZXR1cm5zIHRoZSB2YWx1ZSBvZiBhbiBvdXRwdXRcbiAgICogZXhwb3J0ZWQgYnkgYW5vdGhlciBzdGFjay4gWW91IHR5cGljYWxseSB1c2UgdGhpcyBmdW5jdGlvbiB0byBjcmVhdGVcbiAgICogY3Jvc3Mtc3RhY2sgcmVmZXJlbmNlcy4gSW4gdGhlIGZvbGxvd2luZyBleGFtcGxlIHRlbXBsYXRlIHNuaXBwZXRzLCBTdGFjayBBXG4gICAqIGV4cG9ydHMgVlBDIHNlY3VyaXR5IGdyb3VwIHZhbHVlcyBhbmQgU3RhY2sgQiBpbXBvcnRzIHRoZW0uXG4gICAqIEBwYXJhbSBzaGFyZWRWYWx1ZVRvSW1wb3J0IFRoZSBzdGFjayBvdXRwdXQgdmFsdWUgdGhhdCB5b3Ugd2FudCB0byBpbXBvcnQuXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaW1wb3J0VmFsdWUoc2hhcmVkVmFsdWVUb0ltcG9ydDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbmV3IEZuSW1wb3J0VmFsdWUoc2hhcmVkVmFsdWVUb0ltcG9ydCkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaWtlIGBGbi5pbXBvcnRWYWx1ZWAsIGJ1dCBpbXBvcnQgYSBsaXN0IHdpdGggYSBrbm93biBsZW5ndGhcbiAgICpcbiAgICogSWYgeW91IGV4cGxpY2l0bHkgd2FudCBhIGxpc3Qgd2l0aCBhbiB1bmtub3duIGxlbmd0aCwgY2FsbCBgRm4uc3BsaXQoJywnLFxuICAgKiBGbi5pbXBvcnRWYWx1ZShleHBvcnROYW1lKSlgLiBTZWUgdGhlIGRvY3VtZW50YXRpb24gb2YgYEZuLnNwbGl0YCB0byByZWFkXG4gICAqIG1vcmUgYWJvdXQgdGhlIGxpbWl0YXRpb25zIG9mIHVzaW5nIGxpc3RzIG9mIHVua25vd24gbGVuZ3RoLlxuICAgKlxuICAgKiBgRm4uaW1wb3J0TGlzdFZhbHVlKGV4cG9ydE5hbWUsIGFzc3VtZWRMZW5ndGgpYCBpcyB0aGUgc2FtZSBhc1xuICAgKiBgRm4uc3BsaXQoJywnLCBGbi5pbXBvcnRWYWx1ZShleHBvcnROYW1lKSwgYXNzdW1lZExlbmd0aClgLFxuICAgKiBidXQgZWFzaWVyIHRvIHJlYWQgYW5kIGltcG9zc2libGUgdG8gZm9yZ2V0IHRvIHBhc3MgYGFzc3VtZWRMZW5ndGhgLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpbXBvcnRMaXN0VmFsdWUoc2hhcmVkVmFsdWVUb0ltcG9ydDogc3RyaW5nLCBhc3N1bWVkTGVuZ3RoOiBudW1iZXIsIGRlbGltaXRlciA9ICcsJyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gRm4uc3BsaXQoZGVsaW1pdGVyLCBGbi5pbXBvcnRWYWx1ZShzaGFyZWRWYWx1ZVRvSW1wb3J0KSwgYXNzdW1lZExlbmd0aCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpGaW5kSW5NYXBgYCByZXR1cm5zIHRoZSB2YWx1ZSBjb3JyZXNwb25kaW5nIHRvXG4gICAqIGtleXMgaW4gYSB0d28tbGV2ZWwgbWFwIHRoYXQgaXMgZGVjbGFyZWQgaW4gdGhlIE1hcHBpbmdzIHNlY3Rpb24uXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZmluZEluTWFwKG1hcE5hbWU6IHN0cmluZywgdG9wTGV2ZWxLZXk6IHN0cmluZywgc2Vjb25kTGV2ZWxLZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEZuLl9maW5kSW5NYXAobWFwTmFtZSwgdG9wTGV2ZWxLZXksIHNlY29uZExldmVsS2V5KS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGFkZGl0aW9uYWwgZnVuY3Rpb24gdXNlZCBpbiBDZm5QYXJzZXIsXG4gICAqIGFzIEZuOjpGaW5kSW5NYXAgZG9lcyBub3QgYWx3YXlzIHJldHVybiBhIHN0cmluZy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIF9maW5kSW5NYXAobWFwTmFtZTogc3RyaW5nLCB0b3BMZXZlbEtleTogc3RyaW5nLCBzZWNvbmRMZXZlbEtleTogc3RyaW5nKTogSVJlc29sdmFibGUge1xuICAgIHJldHVybiBuZXcgRm5GaW5kSW5NYXAobWFwTmFtZSwgdG9wTGV2ZWxLZXksIHNlY29uZExldmVsS2V5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgdG9rZW4gcmVwcmVzZW50aW5nIHRoZSBgYEZuOjpUcmFuc2Zvcm1gYCBleHByZXNzaW9uXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvaW50cmluc2ljLWZ1bmN0aW9uLXJlZmVyZW5jZS10cmFuc2Zvcm0uaHRtbFxuICAgKiBAcGFyYW0gbWFjcm9OYW1lIFRoZSBuYW1lIG9mIHRoZSBtYWNybyB0byBwZXJmb3JtIHRoZSBwcm9jZXNzaW5nXG4gICAqIEBwYXJhbSBwYXJhbWV0ZXJzIFRoZSBwYXJhbWV0ZXJzIHRvIGJlIHBhc3NlZCB0byB0aGUgbWFjcm9cbiAgICogQHJldHVybnMgYSB0b2tlbiByZXByZXNlbnRpbmcgdGhlIHRyYW5zZm9ybSBleHByZXNzaW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRyYW5zZm9ybShtYWNyb05hbWU6IHN0cmluZywgcGFyYW1ldGVyczogeyBbbmFtZTogc3RyaW5nXTogYW55IH0pOiBJUmVzb2x2YWJsZSB7XG4gICAgcmV0dXJuIG5ldyBGblRyYW5zZm9ybShtYWNyb05hbWUsIHBhcmFtZXRlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBhbGwgdGhlIHNwZWNpZmllZCBjb25kaXRpb25zIGV2YWx1YXRlIHRvIHRydWUsIG9yIHJldHVybnNcbiAgICogZmFsc2UgaWYgYW55IG9uZSBvZiB0aGUgY29uZGl0aW9ucyBldmFsdWF0ZXMgdG8gZmFsc2UuIGBgRm46OkFuZGBgIGFjdHMgYXNcbiAgICogYW4gQU5EIG9wZXJhdG9yLiBUaGUgbWluaW11bSBudW1iZXIgb2YgY29uZGl0aW9ucyB0aGF0IHlvdSBjYW4gaW5jbHVkZSBpc1xuICAgKiAxLlxuICAgKiBAcGFyYW0gY29uZGl0aW9ucyBjb25kaXRpb25zIHRvIEFORFxuICAgKiBAcmV0dXJucyBhbiBGbkNvbmRpdGlvbiB0b2tlblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb25kaXRpb25BbmQoLi4uY29uZGl0aW9uczogSUNmbkNvbmRpdGlvbkV4cHJlc3Npb25bXSk6IElDZm5SdWxlQ29uZGl0aW9uRXhwcmVzc2lvbiB7XG4gICAgaWYgKGNvbmRpdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZuLmNvbmRpdGlvbkFuZCgpIG5lZWRzIGF0IGxlYXN0IG9uZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoY29uZGl0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBjb25kaXRpb25zWzBdIGFzIElDZm5SdWxlQ29uZGl0aW9uRXhwcmVzc2lvbjtcbiAgICB9XG4gICAgcmV0dXJuIEZuLmNvbmRpdGlvbkFuZCguLi5faW5Hcm91cHNPZihjb25kaXRpb25zLCAxMCkubWFwKGdyb3VwID0+IG5ldyBGbkFuZCguLi5ncm91cCkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wYXJlcyBpZiB0d28gdmFsdWVzIGFyZSBlcXVhbC4gUmV0dXJucyB0cnVlIGlmIHRoZSB0d28gdmFsdWVzIGFyZSBlcXVhbFxuICAgKiBvciBmYWxzZSBpZiB0aGV5IGFyZW4ndC5cbiAgICogQHBhcmFtIGxocyBBIHZhbHVlIG9mIGFueSB0eXBlIHRoYXQgeW91IHdhbnQgdG8gY29tcGFyZS5cbiAgICogQHBhcmFtIHJocyBBIHZhbHVlIG9mIGFueSB0eXBlIHRoYXQgeW91IHdhbnQgdG8gY29tcGFyZS5cbiAgICogQHJldHVybnMgYW4gRm5Db25kaXRpb24gdG9rZW5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29uZGl0aW9uRXF1YWxzKGxoczogYW55LCByaHM6IGFueSk6IElDZm5SdWxlQ29uZGl0aW9uRXhwcmVzc2lvbiB7XG4gICAgcmV0dXJuIG5ldyBGbkVxdWFscyhsaHMsIHJocyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBvbmUgdmFsdWUgaWYgdGhlIHNwZWNpZmllZCBjb25kaXRpb24gZXZhbHVhdGVzIHRvIHRydWUgYW5kIGFub3RoZXJcbiAgICogdmFsdWUgaWYgdGhlIHNwZWNpZmllZCBjb25kaXRpb24gZXZhbHVhdGVzIHRvIGZhbHNlLiBDdXJyZW50bHksIEFXU1xuICAgKiBDbG91ZEZvcm1hdGlvbiBzdXBwb3J0cyB0aGUgYGBGbjo6SWZgYCBpbnRyaW5zaWMgZnVuY3Rpb24gaW4gdGhlIG1ldGFkYXRhXG4gICAqIGF0dHJpYnV0ZSwgdXBkYXRlIHBvbGljeSBhdHRyaWJ1dGUsIGFuZCBwcm9wZXJ0eSB2YWx1ZXMgaW4gdGhlIFJlc291cmNlc1xuICAgKiBzZWN0aW9uIGFuZCBPdXRwdXRzIHNlY3Rpb25zIG9mIGEgdGVtcGxhdGUuIFlvdSBjYW4gdXNlIHRoZSBBV1M6Ok5vVmFsdWVcbiAgICogcHNldWRvIHBhcmFtZXRlciBhcyBhIHJldHVybiB2YWx1ZSB0byByZW1vdmUgdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkuXG4gICAqIEBwYXJhbSBjb25kaXRpb25JZCBBIHJlZmVyZW5jZSB0byBhIGNvbmRpdGlvbiBpbiB0aGUgQ29uZGl0aW9ucyBzZWN0aW9uLiBVc2VcbiAgICogdGhlIGNvbmRpdGlvbidzIG5hbWUgdG8gcmVmZXJlbmNlIGl0LlxuICAgKiBAcGFyYW0gdmFsdWVJZlRydWUgQSB2YWx1ZSB0byBiZSByZXR1cm5lZCBpZiB0aGUgc3BlY2lmaWVkIGNvbmRpdGlvblxuICAgKiBldmFsdWF0ZXMgdG8gdHJ1ZS5cbiAgICogQHBhcmFtIHZhbHVlSWZGYWxzZSBBIHZhbHVlIHRvIGJlIHJldHVybmVkIGlmIHRoZSBzcGVjaWZpZWQgY29uZGl0aW9uXG4gICAqIGV2YWx1YXRlcyB0byBmYWxzZS5cbiAgICogQHJldHVybnMgYW4gRm5Db25kaXRpb24gdG9rZW5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29uZGl0aW9uSWYoY29uZGl0aW9uSWQ6IHN0cmluZywgdmFsdWVJZlRydWU6IGFueSwgdmFsdWVJZkZhbHNlOiBhbnkpOiBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24ge1xuICAgIHJldHVybiBuZXcgRm5JZihjb25kaXRpb25JZCwgdmFsdWVJZlRydWUsIHZhbHVlSWZGYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGZvciBhIGNvbmRpdGlvbiB0aGF0IGV2YWx1YXRlcyB0byBmYWxzZSBvciByZXR1cm5zIGZhbHNlIGZvciBhXG4gICAqIGNvbmRpdGlvbiB0aGF0IGV2YWx1YXRlcyB0byB0cnVlLiBgYEZuOjpOb3RgYCBhY3RzIGFzIGEgTk9UIG9wZXJhdG9yLlxuICAgKiBAcGFyYW0gY29uZGl0aW9uIEEgY29uZGl0aW9uIHN1Y2ggYXMgYGBGbjo6RXF1YWxzYGAgdGhhdCBldmFsdWF0ZXMgdG8gdHJ1ZVxuICAgKiBvciBmYWxzZS5cbiAgICogQHJldHVybnMgYW4gRm5Db25kaXRpb24gdG9rZW5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29uZGl0aW9uTm90KGNvbmRpdGlvbjogSUNmbkNvbmRpdGlvbkV4cHJlc3Npb24pOiBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24ge1xuICAgIHJldHVybiBuZXcgRm5Ob3QoY29uZGl0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgYW55IG9uZSBvZiB0aGUgc3BlY2lmaWVkIGNvbmRpdGlvbnMgZXZhbHVhdGUgdG8gdHJ1ZSwgb3JcbiAgICogcmV0dXJucyBmYWxzZSBpZiBhbGwgb2YgdGhlIGNvbmRpdGlvbnMgZXZhbHVhdGVzIHRvIGZhbHNlLiBgYEZuOjpPcmBgIGFjdHNcbiAgICogYXMgYW4gT1Igb3BlcmF0b3IuIFRoZSBtaW5pbXVtIG51bWJlciBvZiBjb25kaXRpb25zIHRoYXQgeW91IGNhbiBpbmNsdWRlIGlzXG4gICAqIDEuXG4gICAqIEBwYXJhbSBjb25kaXRpb25zIGNvbmRpdGlvbnMgdGhhdCBldmFsdWF0ZXMgdG8gdHJ1ZSBvciBmYWxzZS5cbiAgICogQHJldHVybnMgYW4gRm5Db25kaXRpb24gdG9rZW5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29uZGl0aW9uT3IoLi4uY29uZGl0aW9uczogSUNmbkNvbmRpdGlvbkV4cHJlc3Npb25bXSk6IElDZm5SdWxlQ29uZGl0aW9uRXhwcmVzc2lvbiB7XG4gICAgaWYgKGNvbmRpdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZuLmNvbmRpdGlvbk9yKCkgbmVlZHMgYXQgbGVhc3Qgb25lIGFyZ3VtZW50Jyk7XG4gICAgfVxuICAgIGlmIChjb25kaXRpb25zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIGNvbmRpdGlvbnNbMF0gYXMgSUNmblJ1bGVDb25kaXRpb25FeHByZXNzaW9uO1xuICAgIH1cbiAgICByZXR1cm4gRm4uY29uZGl0aW9uT3IoLi4uX2luR3JvdXBzT2YoY29uZGl0aW9ucywgMTApLm1hcChncm91cCA9PiBuZXcgRm5PciguLi5ncm91cCkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgYSBzcGVjaWZpZWQgc3RyaW5nIG1hdGNoZXMgYXQgbGVhc3Qgb25lIHZhbHVlIGluIGEgbGlzdCBvZlxuICAgKiBzdHJpbmdzLlxuICAgKiBAcGFyYW0gbGlzdE9mU3RyaW5ncyBBIGxpc3Qgb2Ygc3RyaW5ncywgc3VjaCBhcyBcIkFcIiwgXCJCXCIsIFwiQ1wiLlxuICAgKiBAcGFyYW0gdmFsdWUgQSBzdHJpbmcsIHN1Y2ggYXMgXCJBXCIsIHRoYXQgeW91IHdhbnQgdG8gY29tcGFyZSBhZ2FpbnN0IGEgbGlzdCBvZiBzdHJpbmdzLlxuICAgKiBAcmV0dXJucyBhbiBGbkNvbmRpdGlvbiB0b2tlblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb25kaXRpb25Db250YWlucyhsaXN0T2ZTdHJpbmdzOiBzdHJpbmdbXSwgdmFsdWU6IHN0cmluZyk6IElDZm5SdWxlQ29uZGl0aW9uRXhwcmVzc2lvbiB7XG4gICAgcmV0dXJuIG5ldyBGbkNvbnRhaW5zKGxpc3RPZlN0cmluZ3MsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgYSBzcGVjaWZpZWQgc3RyaW5nIG1hdGNoZXMgYWxsIHZhbHVlcyBpbiBhIGxpc3QuXG4gICAqIEBwYXJhbSBsaXN0T2ZTdHJpbmdzIEEgbGlzdCBvZiBzdHJpbmdzLCBzdWNoIGFzIFwiQVwiLCBcIkJcIiwgXCJDXCIuXG4gICAqIEBwYXJhbSB2YWx1ZSBBIHN0cmluZywgc3VjaCBhcyBcIkFcIiwgdGhhdCB5b3Ugd2FudCB0byBjb21wYXJlIGFnYWluc3QgYSBsaXN0XG4gICAqIG9mIHN0cmluZ3MuXG4gICAqIEByZXR1cm5zIGFuIEZuQ29uZGl0aW9uIHRva2VuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbmRpdGlvbkVhY2hNZW1iZXJFcXVhbHMobGlzdE9mU3RyaW5nczogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpOiBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24ge1xuICAgIHJldHVybiBuZXcgRm5FYWNoTWVtYmVyRXF1YWxzKGxpc3RPZlN0cmluZ3MsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgZWFjaCBtZW1iZXIgaW4gYSBsaXN0IG9mIHN0cmluZ3MgbWF0Y2hlcyBhdCBsZWFzdCBvbmUgdmFsdWVcbiAgICogaW4gYSBzZWNvbmQgbGlzdCBvZiBzdHJpbmdzLlxuICAgKiBAcGFyYW0gc3RyaW5nc1RvQ2hlY2sgQSBsaXN0IG9mIHN0cmluZ3MsIHN1Y2ggYXMgXCJBXCIsIFwiQlwiLCBcIkNcIi4gQVdTXG4gICAqIENsb3VkRm9ybWF0aW9uIGNoZWNrcyB3aGV0aGVyIGVhY2ggbWVtYmVyIGluIHRoZSBzdHJpbmdzX3RvX2NoZWNrIHBhcmFtZXRlclxuICAgKiBpcyBpbiB0aGUgc3RyaW5nc190b19tYXRjaCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSBzdHJpbmdzVG9NYXRjaCBBIGxpc3Qgb2Ygc3RyaW5ncywgc3VjaCBhcyBcIkFcIiwgXCJCXCIsIFwiQ1wiLiBFYWNoIG1lbWJlclxuICAgKiBpbiB0aGUgc3RyaW5nc190b19tYXRjaCBwYXJhbWV0ZXIgaXMgY29tcGFyZWQgYWdhaW5zdCB0aGUgbWVtYmVycyBvZiB0aGVcbiAgICogc3RyaW5nc190b19jaGVjayBwYXJhbWV0ZXIuXG4gICAqIEByZXR1cm5zIGFuIEZuQ29uZGl0aW9uIHRva2VuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbmRpdGlvbkVhY2hNZW1iZXJJbihzdHJpbmdzVG9DaGVjazogc3RyaW5nW10sIHN0cmluZ3NUb01hdGNoOiBzdHJpbmdbXSk6IElDZm5SdWxlQ29uZGl0aW9uRXhwcmVzc2lvbiB7XG4gICAgcmV0dXJuIG5ldyBGbkVhY2hNZW1iZXJJbihzdHJpbmdzVG9DaGVjaywgc3RyaW5nc1RvTWF0Y2gpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYWxsIHZhbHVlcyBmb3IgYSBzcGVjaWZpZWQgcGFyYW1ldGVyIHR5cGUuXG4gICAqIEBwYXJhbSBwYXJhbWV0ZXJUeXBlIEFuIEFXUy1zcGVjaWZpYyBwYXJhbWV0ZXIgdHlwZSwgc3VjaCBhc1xuICAgKiBBV1M6OkVDMjo6U2VjdXJpdHlHcm91cDo6SWQgb3IgQVdTOjpFQzI6OlZQQzo6SWQuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWVcbiAgICogUGFyYW1ldGVycyBpbiB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIFVzZXIgR3VpZGUuXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmcgYXJyYXlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVmQWxsKHBhcmFtZXRlclR5cGU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gVG9rZW4uYXNMaXN0KG5ldyBGblJlZkFsbChwYXJhbWV0ZXJUeXBlKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhdHRyaWJ1dGUgdmFsdWUgb3IgbGlzdCBvZiB2YWx1ZXMgZm9yIGEgc3BlY2lmaWMgcGFyYW1ldGVyIGFuZFxuICAgKiBhdHRyaWJ1dGUuXG4gICAqIEBwYXJhbSBwYXJhbWV0ZXJPckxvZ2ljYWxJZCBUaGUgbmFtZSBvZiBhIHBhcmFtZXRlciBmb3Igd2hpY2ggeW91IHdhbnQgdG9cbiAgICogcmV0cmlldmUgYXR0cmlidXRlIHZhbHVlcy4gVGhlIHBhcmFtZXRlciBtdXN0IGJlIGRlY2xhcmVkIGluIHRoZSBQYXJhbWV0ZXJzXG4gICAqIHNlY3Rpb24gb2YgdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gYXR0cmlidXRlIFRoZSBuYW1lIG9mIGFuIGF0dHJpYnV0ZSBmcm9tIHdoaWNoIHlvdSB3YW50IHRvIHJldHJpZXZlIGFcbiAgICogdmFsdWUuXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdmFsdWVPZihwYXJhbWV0ZXJPckxvZ2ljYWxJZDogc3RyaW5nLCBhdHRyaWJ1dGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBGblZhbHVlT2YocGFyYW1ldGVyT3JMb2dpY2FsSWQsIGF0dHJpYnV0ZSkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbGlzdCBvZiBhbGwgYXR0cmlidXRlIHZhbHVlcyBmb3IgYSBnaXZlbiBwYXJhbWV0ZXIgdHlwZSBhbmRcbiAgICogYXR0cmlidXRlLlxuICAgKiBAcGFyYW0gcGFyYW1ldGVyVHlwZSBBbiBBV1Mtc3BlY2lmaWMgcGFyYW1ldGVyIHR5cGUsIHN1Y2ggYXNcbiAgICogQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXA6OklkIG9yIEFXUzo6RUMyOjpWUEM6OklkLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlXG4gICAqIFBhcmFtZXRlcnMgaW4gdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBVc2VyIEd1aWRlLlxuICAgKiBAcGFyYW0gYXR0cmlidXRlIFRoZSBuYW1lIG9mIGFuIGF0dHJpYnV0ZSBmcm9tIHdoaWNoIHlvdSB3YW50IHRvIHJldHJpZXZlIGFcbiAgICogdmFsdWUuIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IGF0dHJpYnV0ZXMsIHNlZSBTdXBwb3J0ZWQgQXR0cmlidXRlcy5cbiAgICogQHJldHVybnMgYSB0b2tlbiByZXByZXNlbnRlZCBhcyBhIHN0cmluZyBhcnJheVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB2YWx1ZU9mQWxsKHBhcmFtZXRlclR5cGU6IHN0cmluZywgYXR0cmlidXRlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFRva2VuLmFzTGlzdChuZXcgRm5WYWx1ZU9mQWxsKHBhcmFtZXRlclR5cGUsIGF0dHJpYnV0ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBgRm46OlRvSnNvblN0cmluZ2AgaW50cmluc2ljIGZ1bmN0aW9uIGNvbnZlcnRzIGFuIG9iamVjdCBvciBhcnJheSB0byBpdHNcbiAgICogY29ycmVzcG9uZGluZyBKU09OIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIG9iamVjdCBUaGUgb2JqZWN0IG9yIGFycmF5IHRvIHN0cmluZ2lmeVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB0b0pzb25TdHJpbmcob2JqZWN0OiBhbnkpOiBzdHJpbmcge1xuICAgIC8vIHNob3J0LWNpcmN1dCBpZiBvYmplY3QgaXMgbm90IGEgdG9rZW5cbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChvYmplY3QpKSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBGblRvSnNvblN0cmluZyhvYmplY3QpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgRm46Okxlbmd0aGAgcmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHdpdGhpbiBhbiBhcnJheVxuICAgKiBvciBhbiBpbnRyaW5zaWMgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gYXJyYXkgVGhlIGFycmF5IHlvdSB3YW50IHRvIHJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGZyb21cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbGVuKGFycmF5OiBhbnkpOiBudW1iZXIge1xuICAgIC8vIHNob3J0LWNpcmN1dCBpZiBhcnJheSBpcyBub3QgYSB0b2tlblxuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKGFycmF5KSkge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZuLmxlbmd0aCgpIG5lZWRzIGFuIGFycmF5Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJyYXkubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gVG9rZW4uYXNOdW1iZXIobmV3IEZuTGVuZ3RoKGFycmF5KSk7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkgeyB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgdG9rZW5zIHRoYXQgcmVwcmVzZW50IENsb3VkRm9ybWF0aW9uIGludHJpbnNpYyBmdW5jdGlvbnMuXG4gKi9cbmNsYXNzIEZuQmFzZSBleHRlbmRzIEludHJpbnNpYyB7XG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHN1cGVyKHsgW25hbWVdOiB2YWx1ZSB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBSZWZgYCByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIHBhcmFtZXRlciBvciByZXNvdXJjZS5cbiAqIFdoZW4geW91IHNwZWNpZnkgYSBwYXJhbWV0ZXIncyBsb2dpY2FsIG5hbWUsIGl0IHJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gKiBXaGVuIHlvdSBzcGVjaWZ5IGEgcmVzb3VyY2UncyBsb2dpY2FsIG5hbWUsIGl0IHJldHVybnMgYSB2YWx1ZSB0aGF0IHlvdSBjYW4gdHlwaWNhbGx5IHVzZSB0byByZWZlciB0byB0aGF0IHJlc291cmNlLCBzdWNoIGFzIGEgcGh5c2ljYWwgSUQuXG4gKi9cbmNsYXNzIEZuUmVmIGV4dGVuZHMgRm5CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBSZWZgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGxvZ2ljYWxOYW1lIFRoZSBsb2dpY2FsIG5hbWUgb2YgYSBwYXJhbWV0ZXIvcmVzb3VyY2UgZm9yIHdoaWNoIHlvdSB3YW50IHRvIHJldHJpZXZlIGl0cyB2YWx1ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGxvZ2ljYWxOYW1lOiBzdHJpbmcpIHtcbiAgICBzdXBlcignUmVmJywgbG9naWNhbE5hbWUpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpGaW5kSW5NYXBgYCByZXR1cm5zIHRoZSB2YWx1ZSBjb3JyZXNwb25kaW5nIHRvIGtleXMgaW4gYSB0d28tbGV2ZWxcbiAqIG1hcCB0aGF0IGlzIGRlY2xhcmVkIGluIHRoZSBNYXBwaW5ncyBzZWN0aW9uLlxuICovXG5jbGFzcyBGbkZpbmRJbk1hcCBleHRlbmRzIEZuQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OkZpbmRJbk1hcGBgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gbWFwTmFtZSBUaGUgbG9naWNhbCBuYW1lIG9mIGEgbWFwcGluZyBkZWNsYXJlZCBpbiB0aGUgTWFwcGluZ3Mgc2VjdGlvbiB0aGF0IGNvbnRhaW5zIHRoZSBrZXlzIGFuZCB2YWx1ZXMuXG4gICAqIEBwYXJhbSB0b3BMZXZlbEtleSBUaGUgdG9wLWxldmVsIGtleSBuYW1lLiBJdHMgdmFsdWUgaXMgYSBsaXN0IG9mIGtleS12YWx1ZSBwYWlycy5cbiAgICogQHBhcmFtIHNlY29uZExldmVsS2V5IFRoZSBzZWNvbmQtbGV2ZWwga2V5IG5hbWUsIHdoaWNoIGlzIHNldCB0byBvbmUgb2YgdGhlIGtleXMgZnJvbSB0aGUgbGlzdCBhc3NpZ25lZCB0byBUb3BMZXZlbEtleS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG1hcE5hbWU6IHN0cmluZywgdG9wTGV2ZWxLZXk6IGFueSwgc2Vjb25kTGV2ZWxLZXk6IGFueSkge1xuICAgIHN1cGVyKCdGbjo6RmluZEluTWFwJywgW21hcE5hbWUsIHRvcExldmVsS2V5LCBzZWNvbmRMZXZlbEtleV0pO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpUcmFuc2Zvcm1gYCBzcGVjaWZpZXMgYSBtYWNybyB0byBwZXJmb3JtIGN1c3RvbSBwcm9jZXNzaW5nIG9uIHBhcnQgb2YgYSBzdGFjayB0ZW1wbGF0ZS5cbiAqL1xuY2xhc3MgRm5UcmFuc2Zvcm0gZXh0ZW5kcyBGbkJhc2Uge1xuICAvKipcbiAgICogY3JlYXRlcyBhbiBgYEZuOjpUcmFuc2Zvcm1gYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIG1hY3JvTmFtZSBUaGUgbmFtZSBvZiB0aGUgbWFjcm8gdG8gYmUgaW52b2tlZFxuICAgKiBAcGFyYW0gcGFyYW1ldGVycyB0aGUgcGFyYW1ldGVycyB0byBwYXNzIHRvIGl0XG4gICAqL1xuICBjb25zdHJ1Y3RvcihtYWNyb05hbWU6IHN0cmluZywgcGFyYW1ldGVyczogeyBbbmFtZTogc3RyaW5nXTogYW55IH0pIHtcbiAgICBzdXBlcignRm46OlRyYW5zZm9ybScsIHsgTmFtZTogbWFjcm9OYW1lLCBQYXJhbWV0ZXJzOiBwYXJhbWV0ZXJzIH0pO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGBgRm46OkdldEF0dGBgIGludHJpbnNpYyBmdW5jdGlvbiByZXR1cm5zIHRoZSB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUgZnJvbSBhIHJlc291cmNlIGluIHRoZSB0ZW1wbGF0ZS5cbiAqL1xuY2xhc3MgRm5HZXRBdHQgZXh0ZW5kcyBGbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIGBgRm46OkdldEF0dGBgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gbG9naWNhbE5hbWVPZlJlc291cmNlIFRoZSBsb2dpY2FsIG5hbWUgKGFsc28gY2FsbGVkIGxvZ2ljYWwgSUQpIG9mIHRoZSByZXNvdXJjZSB0aGF0IGNvbnRhaW5zIHRoZSBhdHRyaWJ1dGUgdGhhdCB5b3Ugd2FudC5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZU5hbWUgVGhlIG5hbWUgb2YgdGhlIHJlc291cmNlLXNwZWNpZmljIGF0dHJpYnV0ZSB3aG9zZSB2YWx1ZSB5b3Ugd2FudC4gU2VlIHRoZSByZXNvdXJjZSdzIHJlZmVyZW5jZSBwYWdlIGZvciBkZXRhaWxzIGFib3V0IHRoZSBhdHRyaWJ1dGVzIGF2YWlsYWJsZSBmb3IgdGhhdCByZXNvdXJjZSB0eXBlLlxuICAgKi9cbiAgY29uc3RydWN0b3IobG9naWNhbE5hbWVPZlJlc291cmNlOiBzdHJpbmcsIGF0dHJpYnV0ZU5hbWU6IHN0cmluZykge1xuICAgIHN1cGVyKCdGbjo6R2V0QXR0JywgW2xvZ2ljYWxOYW1lT2ZSZXNvdXJjZSwgYXR0cmlidXRlTmFtZV0pO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpHZXRBWnNgYCByZXR1cm5zIGFuIGFycmF5IHRoYXQgbGlzdHMgQXZhaWxhYmlsaXR5IFpvbmVzIGZvciBhXG4gKiBzcGVjaWZpZWQgcmVnaW9uLiBCZWNhdXNlIGN1c3RvbWVycyBoYXZlIGFjY2VzcyB0byBkaWZmZXJlbnQgQXZhaWxhYmlsaXR5IFpvbmVzLCB0aGUgaW50cmluc2ljXG4gKiBmdW5jdGlvbiBgYEZuOjpHZXRBWnNgYCBlbmFibGVzIHRlbXBsYXRlIGF1dGhvcnMgdG8gd3JpdGUgdGVtcGxhdGVzIHRoYXQgYWRhcHQgdG8gdGhlIGNhbGxpbmdcbiAqIHVzZXIncyBhY2Nlc3MuIFRoYXQgd2F5IHlvdSBkb24ndCBoYXZlIHRvIGhhcmQtY29kZSBhIGZ1bGwgbGlzdCBvZiBBdmFpbGFiaWxpdHkgWm9uZXMgZm9yIGFcbiAqIHNwZWNpZmllZCByZWdpb24uXG4gKi9cbmNsYXNzIEZuR2V0QVpzIGV4dGVuZHMgRm5CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBGbjo6R2V0QVpzYGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSByZWdpb24gVGhlIG5hbWUgb2YgdGhlIHJlZ2lvbiBmb3Igd2hpY2ggeW91IHdhbnQgdG8gZ2V0IHRoZSBBdmFpbGFiaWxpdHkgWm9uZXMuXG4gICAqICAgICAgICAgWW91IGNhbiB1c2UgdGhlIEFXUzo6UmVnaW9uIHBzZXVkbyBwYXJhbWV0ZXIgdG8gc3BlY2lmeSB0aGUgcmVnaW9uIGluXG4gICAqICAgICAgICAgd2hpY2ggdGhlIHN0YWNrIGlzIGNyZWF0ZWQuIFNwZWNpZnlpbmcgYW4gZW1wdHkgc3RyaW5nIGlzIGVxdWl2YWxlbnQgdG9cbiAgICogICAgICAgICBzcGVjaWZ5aW5nIEFXUzo6UmVnaW9uLlxuICAgKi9cbiAgY29uc3RydWN0b3IocmVnaW9uPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoJ0ZuOjpHZXRBWnMnLCByZWdpb24gfHwgJycpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpJbXBvcnRWYWx1ZWBgIHJldHVybnMgdGhlIHZhbHVlIG9mIGFuIG91dHB1dCBleHBvcnRlZCBieSBhbm90aGVyIHN0YWNrLlxuICogWW91IHR5cGljYWxseSB1c2UgdGhpcyBmdW5jdGlvbiB0byBjcmVhdGUgY3Jvc3Mtc3RhY2sgcmVmZXJlbmNlcy4gSW4gdGhlIGZvbGxvd2luZyBleGFtcGxlXG4gKiB0ZW1wbGF0ZSBzbmlwcGV0cywgU3RhY2sgQSBleHBvcnRzIFZQQyBzZWN1cml0eSBncm91cCB2YWx1ZXMgYW5kIFN0YWNrIEIgaW1wb3J0cyB0aGVtLlxuICovXG5jbGFzcyBGbkltcG9ydFZhbHVlIGV4dGVuZHMgRm5CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBGbjo6SW1wb3J0VmFsdWVgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIHNoYXJlZFZhbHVlVG9JbXBvcnQgVGhlIHN0YWNrIG91dHB1dCB2YWx1ZSB0aGF0IHlvdSB3YW50IHRvIGltcG9ydC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNoYXJlZFZhbHVlVG9JbXBvcnQ6IHN0cmluZykge1xuICAgIHN1cGVyKCdGbjo6SW1wb3J0VmFsdWUnLCBzaGFyZWRWYWx1ZVRvSW1wb3J0KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6U2VsZWN0YGAgcmV0dXJucyBhIHNpbmdsZSBvYmplY3QgZnJvbSBhIGxpc3Qgb2Ygb2JqZWN0cyBieSBpbmRleC5cbiAqL1xuY2xhc3MgRm5TZWxlY3QgZXh0ZW5kcyBGbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpTZWxlY3RgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCBvZiB0aGUgb2JqZWN0IHRvIHJldHJpZXZlLiBUaGlzIG11c3QgYmUgYSB2YWx1ZSBmcm9tIHplcm8gdG8gTi0xLCB3aGVyZSBOIHJlcHJlc2VudHMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgYXJyYXkuXG4gICAqIEBwYXJhbSBhcnJheSBUaGUgbGlzdCBvZiBvYmplY3RzIHRvIHNlbGVjdCBmcm9tLiBUaGlzIGxpc3QgbXVzdCBub3QgYmUgbnVsbCwgbm9yIGNhbiBpdCBoYXZlIG51bGwgZW50cmllcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGluZGV4OiBudW1iZXIsIGFycmF5OiBhbnkpIHtcbiAgICBzdXBlcignRm46OlNlbGVjdCcsIFtpbmRleCwgYXJyYXldKTtcbiAgfVxufVxuXG4vKipcbiAqIFRvIHNwbGl0IGEgc3RyaW5nIGludG8gYSBsaXN0IG9mIHN0cmluZyB2YWx1ZXMgc28gdGhhdCB5b3UgY2FuIHNlbGVjdCBhbiBlbGVtZW50IGZyb20gdGhlXG4gKiByZXN1bHRpbmcgc3RyaW5nIGxpc3QsIHVzZSB0aGUgYGBGbjo6U3BsaXRgYCBpbnRyaW5zaWMgZnVuY3Rpb24uIFNwZWNpZnkgdGhlIGxvY2F0aW9uIG9mIHNwbGl0c1xuICogd2l0aCBhIGRlbGltaXRlciwgc3VjaCBhcyAsIChhIGNvbW1hKS4gQWZ0ZXIgeW91IHNwbGl0IGEgc3RyaW5nLCB1c2UgdGhlIGBgRm46OlNlbGVjdGBgIGZ1bmN0aW9uXG4gKiB0byBwaWNrIGEgc3BlY2lmaWMgZWxlbWVudC5cbiAqL1xuY2xhc3MgRm5TcGxpdCBleHRlbmRzIEZuQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gYGBGbjo6U3BsaXRgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGRlbGltaXRlciBBIHN0cmluZyB2YWx1ZSB0aGF0IGRldGVybWluZXMgd2hlcmUgdGhlIHNvdXJjZSBzdHJpbmcgaXMgZGl2aWRlZC5cbiAgICogQHBhcmFtIHNvdXJjZSBUaGUgc3RyaW5nIHZhbHVlIHRoYXQgeW91IHdhbnQgdG8gc3BsaXQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkZWxpbWl0ZXI6IHN0cmluZywgc291cmNlOiBhbnkpIHtcbiAgICBzdXBlcignRm46OlNwbGl0JywgW2RlbGltaXRlciwgc291cmNlXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OlN1YmBgIHN1YnN0aXR1dGVzIHZhcmlhYmxlcyBpbiBhbiBpbnB1dCBzdHJpbmcgd2l0aCB2YWx1ZXMgdGhhdFxuICogeW91IHNwZWNpZnkuIEluIHlvdXIgdGVtcGxhdGVzLCB5b3UgY2FuIHVzZSB0aGlzIGZ1bmN0aW9uIHRvIGNvbnN0cnVjdCBjb21tYW5kcyBvciBvdXRwdXRzXG4gKiB0aGF0IGluY2x1ZGUgdmFsdWVzIHRoYXQgYXJlbid0IGF2YWlsYWJsZSB1bnRpbCB5b3UgY3JlYXRlIG9yIHVwZGF0ZSBhIHN0YWNrLlxuICovXG5jbGFzcyBGblN1YiBleHRlbmRzIEZuQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OlN1YmBgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gYm9keSBBIHN0cmluZyB3aXRoIHZhcmlhYmxlcyB0aGF0IEFXUyBDbG91ZEZvcm1hdGlvbiBzdWJzdGl0dXRlcyB3aXRoIHRoZWlyXG4gICAqICAgICAgIGFzc29jaWF0ZWQgdmFsdWVzIGF0IHJ1bnRpbWUuIFdyaXRlIHZhcmlhYmxlcyBhcyAke015VmFyTmFtZX0uIFZhcmlhYmxlc1xuICAgKiAgICAgICBjYW4gYmUgdGVtcGxhdGUgcGFyYW1ldGVyIG5hbWVzLCByZXNvdXJjZSBsb2dpY2FsIElEcywgcmVzb3VyY2UgYXR0cmlidXRlcyxcbiAgICogICAgICAgb3IgYSB2YXJpYWJsZSBpbiBhIGtleS12YWx1ZSBtYXAuIElmIHlvdSBzcGVjaWZ5IG9ubHkgdGVtcGxhdGUgcGFyYW1ldGVyIG5hbWVzLFxuICAgKiAgICAgICByZXNvdXJjZSBsb2dpY2FsIElEcywgYW5kIHJlc291cmNlIGF0dHJpYnV0ZXMsIGRvbid0IHNwZWNpZnkgYSBrZXktdmFsdWUgbWFwLlxuICAgKiBAcGFyYW0gdmFyaWFibGVzIFRoZSBuYW1lIG9mIGEgdmFyaWFibGUgdGhhdCB5b3UgaW5jbHVkZWQgaW4gdGhlIFN0cmluZyBwYXJhbWV0ZXIuXG4gICAqICAgICAgICAgIFRoZSB2YWx1ZSB0aGF0IEFXUyBDbG91ZEZvcm1hdGlvbiBzdWJzdGl0dXRlcyBmb3IgdGhlIGFzc29jaWF0ZWQgdmFyaWFibGUgbmFtZSBhdCBydW50aW1lLlxuICAgKi9cbiAgY29uc3RydWN0b3IoYm9keTogc3RyaW5nLCB2YXJpYWJsZXM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KSB7XG4gICAgc3VwZXIoJ0ZuOjpTdWInLCB2YXJpYWJsZXMgPyBbYm9keSwgdmFyaWFibGVzXSA6IGJvZHkpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpCYXNlNjRgYCByZXR1cm5zIHRoZSBCYXNlNjQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGlucHV0IHN0cmluZy5cbiAqIFRoaXMgZnVuY3Rpb24gaXMgdHlwaWNhbGx5IHVzZWQgdG8gcGFzcyBlbmNvZGVkIGRhdGEgdG8gQW1hem9uIEVDMiBpbnN0YW5jZXMgYnkgd2F5IG9mXG4gKiB0aGUgVXNlckRhdGEgcHJvcGVydHkuXG4gKi9cbmNsYXNzIEZuQmFzZTY0IGV4dGVuZHMgRm5CYXNlIHtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpCYXNlNjRgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGRhdGEgVGhlIHN0cmluZyB2YWx1ZSB5b3Ugd2FudCB0byBjb252ZXJ0IHRvIEJhc2U2NC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGE6IGFueSkge1xuICAgIHN1cGVyKCdGbjo6QmFzZTY0JywgZGF0YSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OkNpZHJgYCByZXR1cm5zIHRoZSBzcGVjaWZpZWQgQ2lkciBhZGRyZXNzIGJsb2NrLlxuICovXG5jbGFzcyBGbkNpZHIgZXh0ZW5kcyBGbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpDaWRyYGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBpcEJsb2NrICBUaGUgdXNlci1zcGVjaWZpZWQgZGVmYXVsdCBDaWRyIGFkZHJlc3MgYmxvY2suXG4gICAqIEBwYXJhbSBjb3VudCAgVGhlIG51bWJlciBvZiBzdWJuZXRzJyBDaWRyIGJsb2NrIHdhbnRlZC4gQ291bnQgY2FuIGJlIDEgdG8gMjU2LlxuICAgKiBAcGFyYW0gc2l6ZU1hc2sgVGhlIGRpZ2l0IGNvdmVyZWQgaW4gdGhlIHN1Ym5ldC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGlwQmxvY2s6IGFueSwgY291bnQ6IGFueSwgc2l6ZU1hc2s/OiBhbnkpIHtcbiAgICBpZiAoY291bnQgPCAxIHx8IGNvdW50ID4gMjU2KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEZuOjpDaWRyJ3MgY291bnQgYXR0cmlidXRlIG11c3QgYmUgYmV0d2VuIDEgYW5kIDI1NiwgJHtjb3VudH0gd2FzIHByb3ZpZGVkLmApO1xuICAgIH1cbiAgICBzdXBlcignRm46OkNpZHInLCBbaXBCbG9jaywgY291bnQsIHNpemVNYXNrXSk7XG4gIH1cbn1cblxuY2xhc3MgRm5Db25kaXRpb25CYXNlIGV4dGVuZHMgSW50cmluc2ljIGltcGxlbWVudHMgSUNmblJ1bGVDb25kaXRpb25FeHByZXNzaW9uIHtcbiAgcmVhZG9ubHkgZGlzYW1iaWd1YXRvciA9IHRydWU7XG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHN1cGVyKHsgW3R5cGVdOiB2YWx1ZSB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBhbGwgdGhlIHNwZWNpZmllZCBjb25kaXRpb25zIGV2YWx1YXRlIHRvIHRydWUsIG9yIHJldHVybnMgZmFsc2UgaWYgYW55IG9uZVxuICogIG9mIHRoZSBjb25kaXRpb25zIGV2YWx1YXRlcyB0byBmYWxzZS4gYGBGbjo6QW5kYGAgYWN0cyBhcyBhbiBBTkQgb3BlcmF0b3IuIFRoZSBtaW5pbXVtIG51bWJlciBvZlxuICogY29uZGl0aW9ucyB0aGF0IHlvdSBjYW4gaW5jbHVkZSBpcyAyLCBhbmQgdGhlIG1heGltdW0gaXMgMTAuXG4gKi9cbmNsYXNzIEZuQW5kIGV4dGVuZHMgRm5Db25kaXRpb25CYXNlIHtcbiAgY29uc3RydWN0b3IoLi4uY29uZGl0aW9uOiBJQ2ZuQ29uZGl0aW9uRXhwcmVzc2lvbltdKSB7XG4gICAgc3VwZXIoJ0ZuOjpBbmQnLCBjb25kaXRpb24pO1xuICB9XG59XG5cbi8qKlxuICogQ29tcGFyZXMgaWYgdHdvIHZhbHVlcyBhcmUgZXF1YWwuIFJldHVybnMgdHJ1ZSBpZiB0aGUgdHdvIHZhbHVlcyBhcmUgZXF1YWwgb3IgZmFsc2VcbiAqIGlmIHRoZXkgYXJlbid0LlxuICovXG5jbGFzcyBGbkVxdWFscyBleHRlbmRzIEZuQ29uZGl0aW9uQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OkVxdWFsc2BgIGNvbmRpdGlvbiBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGxocyBBIHZhbHVlIG9mIGFueSB0eXBlIHRoYXQgeW91IHdhbnQgdG8gY29tcGFyZS5cbiAgICogQHBhcmFtIHJocyBBIHZhbHVlIG9mIGFueSB0eXBlIHRoYXQgeW91IHdhbnQgdG8gY29tcGFyZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGxoczogYW55LCByaHM6IGFueSkge1xuICAgIHN1cGVyKCdGbjo6RXF1YWxzJywgW2xocywgcmhzXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIG9uZSB2YWx1ZSBpZiB0aGUgc3BlY2lmaWVkIGNvbmRpdGlvbiBldmFsdWF0ZXMgdG8gdHJ1ZSBhbmQgYW5vdGhlciB2YWx1ZSBpZiB0aGVcbiAqIHNwZWNpZmllZCBjb25kaXRpb24gZXZhbHVhdGVzIHRvIGZhbHNlLiBDdXJyZW50bHksIEFXUyBDbG91ZEZvcm1hdGlvbiBzdXBwb3J0cyB0aGUgYGBGbjo6SWZgYFxuICogaW50cmluc2ljIGZ1bmN0aW9uIGluIHRoZSBtZXRhZGF0YSBhdHRyaWJ1dGUsIHVwZGF0ZSBwb2xpY3kgYXR0cmlidXRlLCBhbmQgcHJvcGVydHkgdmFsdWVzXG4gKiBpbiB0aGUgUmVzb3VyY2VzIHNlY3Rpb24gYW5kIE91dHB1dHMgc2VjdGlvbnMgb2YgYSB0ZW1wbGF0ZS4gWW91IGNhbiB1c2UgdGhlIEFXUzo6Tm9WYWx1ZVxuICogcHNldWRvIHBhcmFtZXRlciBhcyBhIHJldHVybiB2YWx1ZSB0byByZW1vdmUgdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkuXG4gKi9cbmNsYXNzIEZuSWYgZXh0ZW5kcyBGbkNvbmRpdGlvbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpJZmBgIGNvbmRpdGlvbiBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGNvbmRpdGlvbiBBIHJlZmVyZW5jZSB0byBhIGNvbmRpdGlvbiBpbiB0aGUgQ29uZGl0aW9ucyBzZWN0aW9uLiBVc2UgdGhlIGNvbmRpdGlvbidzIG5hbWUgdG8gcmVmZXJlbmNlIGl0LlxuICAgKiBAcGFyYW0gdmFsdWVJZlRydWUgQSB2YWx1ZSB0byBiZSByZXR1cm5lZCBpZiB0aGUgc3BlY2lmaWVkIGNvbmRpdGlvbiBldmFsdWF0ZXMgdG8gdHJ1ZS5cbiAgICogQHBhcmFtIHZhbHVlSWZGYWxzZSBBIHZhbHVlIHRvIGJlIHJldHVybmVkIGlmIHRoZSBzcGVjaWZpZWQgY29uZGl0aW9uIGV2YWx1YXRlcyB0byBmYWxzZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmRpdGlvbjogc3RyaW5nLCB2YWx1ZUlmVHJ1ZTogYW55LCB2YWx1ZUlmRmFsc2U6IGFueSkge1xuICAgIHN1cGVyKCdGbjo6SWYnLCBbY29uZGl0aW9uLCB2YWx1ZUlmVHJ1ZSwgdmFsdWVJZkZhbHNlXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgZm9yIGEgY29uZGl0aW9uIHRoYXQgZXZhbHVhdGVzIHRvIGZhbHNlIG9yIHJldHVybnMgZmFsc2UgZm9yIGEgY29uZGl0aW9uIHRoYXQgZXZhbHVhdGVzIHRvIHRydWUuXG4gKiBgYEZuOjpOb3RgYCBhY3RzIGFzIGEgTk9UIG9wZXJhdG9yLlxuICovXG5jbGFzcyBGbk5vdCBleHRlbmRzIEZuQ29uZGl0aW9uQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46Ok5vdGBgIGNvbmRpdGlvbiBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGNvbmRpdGlvbiBBIGNvbmRpdGlvbiBzdWNoIGFzIGBgRm46OkVxdWFsc2BgIHRoYXQgZXZhbHVhdGVzIHRvIHRydWUgb3IgZmFsc2UuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25kaXRpb246IElDZm5Db25kaXRpb25FeHByZXNzaW9uKSB7XG4gICAgc3VwZXIoJ0ZuOjpOb3QnLCBbY29uZGl0aW9uXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYW55IG9uZSBvZiB0aGUgc3BlY2lmaWVkIGNvbmRpdGlvbnMgZXZhbHVhdGUgdG8gdHJ1ZSwgb3IgcmV0dXJucyBmYWxzZSBpZlxuICogYWxsIG9mIHRoZSBjb25kaXRpb25zIGV2YWx1YXRlcyB0byBmYWxzZS4gYGBGbjo6T3JgYCBhY3RzIGFzIGFuIE9SIG9wZXJhdG9yLiBUaGUgbWluaW11bSBudW1iZXJcbiAqIG9mIGNvbmRpdGlvbnMgdGhhdCB5b3UgY2FuIGluY2x1ZGUgaXMgMiwgYW5kIHRoZSBtYXhpbXVtIGlzIDEwLlxuICovXG5jbGFzcyBGbk9yIGV4dGVuZHMgRm5Db25kaXRpb25CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBGbjo6T3JgYCBjb25kaXRpb24gZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBjb25kaXRpb24gQSBjb25kaXRpb24gdGhhdCBldmFsdWF0ZXMgdG8gdHJ1ZSBvciBmYWxzZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKC4uLmNvbmRpdGlvbjogSUNmbkNvbmRpdGlvbkV4cHJlc3Npb25bXSkge1xuICAgIHN1cGVyKCdGbjo6T3InLCBjb25kaXRpb24pO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGEgc3BlY2lmaWVkIHN0cmluZyBtYXRjaGVzIGF0IGxlYXN0IG9uZSB2YWx1ZSBpbiBhIGxpc3Qgb2Ygc3RyaW5ncy5cbiAqL1xuY2xhc3MgRm5Db250YWlucyBleHRlbmRzIEZuQ29uZGl0aW9uQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OkNvbnRhaW5zYGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBsaXN0T2ZTdHJpbmdzIEEgbGlzdCBvZiBzdHJpbmdzLCBzdWNoIGFzIFwiQVwiLCBcIkJcIiwgXCJDXCIuXG4gICAqIEBwYXJhbSB2YWx1ZSBBIHN0cmluZywgc3VjaCBhcyBcIkFcIiwgdGhhdCB5b3Ugd2FudCB0byBjb21wYXJlIGFnYWluc3QgYSBsaXN0IG9mIHN0cmluZ3MuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihsaXN0T2ZTdHJpbmdzOiBhbnksIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcignRm46OkNvbnRhaW5zJywgW2xpc3RPZlN0cmluZ3MsIHZhbHVlXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSBzcGVjaWZpZWQgc3RyaW5nIG1hdGNoZXMgYWxsIHZhbHVlcyBpbiBhIGxpc3QuXG4gKi9cbmNsYXNzIEZuRWFjaE1lbWJlckVxdWFscyBleHRlbmRzIEZuQ29uZGl0aW9uQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OkVhY2hNZW1iZXJFcXVhbHNgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGxpc3RPZlN0cmluZ3MgQSBsaXN0IG9mIHN0cmluZ3MsIHN1Y2ggYXMgXCJBXCIsIFwiQlwiLCBcIkNcIi5cbiAgICogQHBhcmFtIHZhbHVlIEEgc3RyaW5nLCBzdWNoIGFzIFwiQVwiLCB0aGF0IHlvdSB3YW50IHRvIGNvbXBhcmUgYWdhaW5zdCBhIGxpc3Qgb2Ygc3RyaW5ncy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGxpc3RPZlN0cmluZ3M6IGFueSwgdmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyKCdGbjo6RWFjaE1lbWJlckVxdWFscycsIFtsaXN0T2ZTdHJpbmdzLCB2YWx1ZV0pO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGVhY2ggbWVtYmVyIGluIGEgbGlzdCBvZiBzdHJpbmdzIG1hdGNoZXMgYXQgbGVhc3Qgb25lIHZhbHVlIGluIGEgc2Vjb25kXG4gKiBsaXN0IG9mIHN0cmluZ3MuXG4gKi9cbmNsYXNzIEZuRWFjaE1lbWJlckluIGV4dGVuZHMgRm5Db25kaXRpb25CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBGbjo6RWFjaE1lbWJlckluYGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBzdHJpbmdzVG9DaGVjayBBIGxpc3Qgb2Ygc3RyaW5ncywgc3VjaCBhcyBcIkFcIiwgXCJCXCIsIFwiQ1wiLiBBV1MgQ2xvdWRGb3JtYXRpb24gY2hlY2tzIHdoZXRoZXIgZWFjaCBtZW1iZXIgaW4gdGhlIHN0cmluZ3NfdG9fY2hlY2sgcGFyYW1ldGVyIGlzIGluIHRoZSBzdHJpbmdzX3RvX21hdGNoIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHN0cmluZ3NUb01hdGNoIEEgbGlzdCBvZiBzdHJpbmdzLCBzdWNoIGFzIFwiQVwiLCBcIkJcIiwgXCJDXCIuIEVhY2ggbWVtYmVyIGluIHRoZSBzdHJpbmdzX3RvX21hdGNoIHBhcmFtZXRlciBpcyBjb21wYXJlZCBhZ2FpbnN0IHRoZSBtZW1iZXJzIG9mIHRoZSBzdHJpbmdzX3RvX2NoZWNrIHBhcmFtZXRlci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHN0cmluZ3NUb0NoZWNrOiBzdHJpbmdbXSwgc3RyaW5nc1RvTWF0Y2g6IHN0cmluZ1tdKSB7XG4gICAgc3VwZXIoJ0ZuOjpFYWNoTWVtYmVySW4nLCBbc3RyaW5nc1RvQ2hlY2ssIHN0cmluZ3NUb01hdGNoXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFsbCB2YWx1ZXMgZm9yIGEgc3BlY2lmaWVkIHBhcmFtZXRlciB0eXBlLlxuICovXG5jbGFzcyBGblJlZkFsbCBleHRlbmRzIEZuQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OlJlZkFsbGBgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gcGFyYW1ldGVyVHlwZSBBbiBBV1Mtc3BlY2lmaWMgcGFyYW1ldGVyIHR5cGUsIHN1Y2ggYXMgQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXA6OklkIG9yXG4gICAqICAgICAgICAgICAgQVdTOjpFQzI6OlZQQzo6SWQuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgUGFyYW1ldGVycyBpbiB0aGUgQVdTXG4gICAqICAgICAgICAgICAgQ2xvdWRGb3JtYXRpb24gVXNlciBHdWlkZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmFtZXRlclR5cGU6IHN0cmluZykge1xuICAgIHN1cGVyKCdGbjo6UmVmQWxsJywgcGFyYW1ldGVyVHlwZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGF0dHJpYnV0ZSB2YWx1ZSBvciBsaXN0IG9mIHZhbHVlcyBmb3IgYSBzcGVjaWZpYyBwYXJhbWV0ZXIgYW5kIGF0dHJpYnV0ZS5cbiAqL1xuY2xhc3MgRm5WYWx1ZU9mIGV4dGVuZHMgRm5CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBGbjo6VmFsdWVPZmBgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gcGFyYW1ldGVyT3JMb2dpY2FsSWQgVGhlIG5hbWUgb2YgYSBwYXJhbWV0ZXIgZm9yIHdoaWNoIHlvdSB3YW50IHRvIHJldHJpZXZlIGF0dHJpYnV0ZSB2YWx1ZXMuIFRoZSBwYXJhbWV0ZXIgbXVzdCBiZSBkZWNsYXJlZCBpbiB0aGUgUGFyYW1ldGVycyBzZWN0aW9uIG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZSBUaGUgbmFtZSBvZiBhbiBhdHRyaWJ1dGUgZnJvbSB3aGljaCB5b3Ugd2FudCB0byByZXRyaWV2ZSBhIHZhbHVlLlxuICAgKi9cbiAgY29uc3RydWN0b3IocGFyYW1ldGVyT3JMb2dpY2FsSWQ6IHN0cmluZywgYXR0cmlidXRlOiBzdHJpbmcpIHtcbiAgICBzdXBlcignRm46OlZhbHVlT2YnLCBbcGFyYW1ldGVyT3JMb2dpY2FsSWQsIGF0dHJpYnV0ZV0pO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGxpc3Qgb2YgYWxsIGF0dHJpYnV0ZSB2YWx1ZXMgZm9yIGEgZ2l2ZW4gcGFyYW1ldGVyIHR5cGUgYW5kIGF0dHJpYnV0ZS5cbiAqL1xuY2xhc3MgRm5WYWx1ZU9mQWxsIGV4dGVuZHMgRm5CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBGbjo6VmFsdWVPZkFsbGBgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gcGFyYW1ldGVyVHlwZSBBbiBBV1Mtc3BlY2lmaWMgcGFyYW1ldGVyIHR5cGUsIHN1Y2ggYXMgQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXA6OklkIG9yIEFXUzo6RUMyOjpWUEM6OklkLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFBhcmFtZXRlcnMgaW4gdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBVc2VyIEd1aWRlLlxuICAgKiBAcGFyYW0gYXR0cmlidXRlIFRoZSBuYW1lIG9mIGFuIGF0dHJpYnV0ZSBmcm9tIHdoaWNoIHlvdSB3YW50IHRvIHJldHJpZXZlIGEgdmFsdWUuIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IGF0dHJpYnV0ZXMsIHNlZSBTdXBwb3J0ZWQgQXR0cmlidXRlcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmFtZXRlclR5cGU6IHN0cmluZywgYXR0cmlidXRlOiBzdHJpbmcpIHtcbiAgICBzdXBlcignRm46OlZhbHVlT2ZBbGwnLCBbcGFyYW1ldGVyVHlwZSwgYXR0cmlidXRlXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OkpvaW5gYCBhcHBlbmRzIGEgc2V0IG9mIHZhbHVlcyBpbnRvIGEgc2luZ2xlIHZhbHVlLCBzZXBhcmF0ZWQgYnlcbiAqIHRoZSBzcGVjaWZpZWQgZGVsaW1pdGVyLiBJZiBhIGRlbGltaXRlciBpcyB0aGUgZW1wdHkgc3RyaW5nLCB0aGUgc2V0IG9mIHZhbHVlcyBhcmUgY29uY2F0ZW5hdGVkXG4gKiB3aXRoIG5vIGRlbGltaXRlci5cbiAqL1xuY2xhc3MgRm5Kb2luIGltcGxlbWVudHMgSVJlc29sdmFibGUge1xuICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRpb25TdGFjazogc3RyaW5nW107XG5cbiAgcHJpdmF0ZSByZWFkb25seSBkZWxpbWl0ZXI6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBsaXN0T2ZWYWx1ZXM6IGFueVtdO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OkpvaW5gYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGRlbGltaXRlciBUaGUgdmFsdWUgeW91IHdhbnQgdG8gb2NjdXIgYmV0d2VlbiBmcmFnbWVudHMuIFRoZSBkZWxpbWl0ZXIgd2lsbCBvY2N1ciBiZXR3ZWVuIGZyYWdtZW50cyBvbmx5LlxuICAgKiAgICAgICAgICBJdCB3aWxsIG5vdCB0ZXJtaW5hdGUgdGhlIGZpbmFsIHZhbHVlLlxuICAgKiBAcGFyYW0gbGlzdE9mVmFsdWVzIFRoZSBsaXN0IG9mIHZhbHVlcyB5b3Ugd2FudCBjb21iaW5lZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRlbGltaXRlcjogc3RyaW5nLCBsaXN0T2ZWYWx1ZXM6IGFueVtdKSB7XG4gICAgaWYgKGxpc3RPZlZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm5Kb2luIHJlcXVpcmVzIGF0IGxlYXN0IG9uZSB2YWx1ZSB0byBiZSBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIHRoaXMuZGVsaW1pdGVyID0gZGVsaW1pdGVyO1xuICAgIHRoaXMubGlzdE9mVmFsdWVzID0gbGlzdE9mVmFsdWVzO1xuICAgIHRoaXMuY3JlYXRpb25TdGFjayA9IGNhcHR1cmVTdGFja1RyYWNlKCk7XG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpOiBhbnkge1xuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQodGhpcy5saXN0T2ZWYWx1ZXMpKSB7XG4gICAgICAvLyBUaGlzIGlzIGEgbGlzdCB0b2tlbiwgZG9uJ3QgdHJ5IHRvIGRvIHNtYXJ0IHRoaW5ncyB3aXRoIGl0LlxuICAgICAgcmV0dXJuIHsgJ0ZuOjpKb2luJzogW3RoaXMuZGVsaW1pdGVyLCB0aGlzLmxpc3RPZlZhbHVlc10gfTtcbiAgICB9XG4gICAgY29uc3QgcmVzb2x2ZWQgPSB0aGlzLnJlc29sdmVWYWx1ZXMoY29udGV4dCk7XG4gICAgaWYgKHJlc29sdmVkLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHJlc29sdmVkWzBdO1xuICAgIH1cbiAgICByZXR1cm4geyAnRm46OkpvaW4nOiBbdGhpcy5kZWxpbWl0ZXIsIHJlc29sdmVkXSB9O1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBUb2tlbi5hc1N0cmluZyh0aGlzLCB7IGRpc3BsYXlIaW50OiAnRm46OkpvaW4nIH0pO1xuICB9XG5cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICByZXR1cm4gJzxGbjo6Sm9pbj4nO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wdGltaXphdGlvbjogaWYgYW4gRm46OkpvaW4gaXMgbmVzdGVkIGluIGFub3RoZXIgb25lIGFuZCB0aGV5IHNoYXJlIHRoZSBzYW1lIGRlbGltaXRlciwgdGhlbiBmbGF0dGVuIGl0IHVwLiBBbHNvLFxuICAgKiBpZiB0d28gY29uY2F0ZW5hdGVkIGVsZW1lbnRzIGFyZSBsaXRlcmFsIHN0cmluZ3MgKG5vdCB0b2tlbnMpLCB0aGVuIHByZS1jb25jYXRlbmF0ZSB0aGVtIHdpdGggdGhlIGRlbGltaXRlciwgdG9cbiAgICogZ2VuZXJhdGUgc2hvcnRlciBvdXRwdXQuXG4gICAqL1xuICBwcml2YXRlIHJlc29sdmVWYWx1ZXMoY29udGV4dDogSVJlc29sdmVDb250ZXh0KSB7XG4gICAgY29uc3QgcmVzb2x2ZWRWYWx1ZXMgPSB0aGlzLmxpc3RPZlZhbHVlcy5tYXAoeCA9PiBSZWZlcmVuY2UuaXNSZWZlcmVuY2UoeCkgPyB4IDogY29udGV4dC5yZXNvbHZlKHgpKTtcbiAgICByZXR1cm4gbWluaW1hbENsb3VkRm9ybWF0aW9uSm9pbih0aGlzLmRlbGltaXRlciwgcmVzb2x2ZWRWYWx1ZXMpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGBGbjo6VG9Kc29uU3RyaW5nYCBpbnRyaW5zaWMgZnVuY3Rpb24gY29udmVydHMgYW4gb2JqZWN0IG9yIGFycmF5IHRvIGl0c1xuICogY29ycmVzcG9uZGluZyBKU09OIHN0cmluZy5cbiAqL1xuY2xhc3MgRm5Ub0pzb25TdHJpbmcgaW1wbGVtZW50cyBJUmVzb2x2YWJsZSB7XG4gIHB1YmxpYyByZWFkb25seSBjcmVhdGlvblN0YWNrOiBzdHJpbmdbXTtcblxuICBwcml2YXRlIHJlYWRvbmx5IG9iamVjdDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKG9iamVjdDogYW55KSB7XG4gICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgdGhpcy5jcmVhdGlvblN0YWNrID0gY2FwdHVyZVN0YWNrVHJhY2UoKTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCk6IGFueSB7XG4gICAgU3RhY2sub2YoY29udGV4dC5zY29wZSkuYWRkVHJhbnNmb3JtKCdBV1M6Okxhbmd1YWdlRXh0ZW5zaW9ucycpO1xuICAgIHJldHVybiB7ICdGbjo6VG9Kc29uU3RyaW5nJzogdGhpcy5vYmplY3QgfTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcodGhpcywgeyBkaXNwbGF5SGludDogJ0ZuOjpUb0pzb25TdHJpbmcnIH0pO1xuICB9XG5cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICByZXR1cm4gJzxGbjo6VG9Kc29uU3RyaW5nPic7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBGbjo6TGVuZ3RoYCByZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgd2l0aGluIGFuIGFycmF5XG4gKiBvciBhbiBpbnRyaW5zaWMgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGFycmF5LlxuICovXG5jbGFzcyBGbkxlbmd0aCBpbXBsZW1lbnRzIElSZXNvbHZhYmxlIHtcbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0aW9uU3RhY2s6IHN0cmluZ1tdO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgYXJyYXk6IGFueTtcblxuICBjb25zdHJ1Y3RvcihhcnJheTogYW55KSB7XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xuICAgIHRoaXMuY3JlYXRpb25TdGFjayA9IGNhcHR1cmVTdGFja1RyYWNlKCk7XG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpOiBhbnkge1xuICAgIFN0YWNrLm9mKGNvbnRleHQuc2NvcGUpLmFkZFRyYW5zZm9ybSgnQVdTOjpMYW5ndWFnZUV4dGVuc2lvbnMnKTtcbiAgICByZXR1cm4geyAnRm46Okxlbmd0aCc6IHRoaXMuYXJyYXkgfTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcodGhpcywgeyBkaXNwbGF5SGludDogJ0ZuOjpMZW5ndGgnIH0pO1xuICB9XG5cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICByZXR1cm4gJzxGbjo6TGVuZ3RoPic7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2luR3JvdXBzT2Y8VD4oYXJyYXk6IFRbXSwgbWF4R3JvdXA6IG51bWJlcik6IFRbXVtdIHtcbiAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PFRbXT4oKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkgKz0gbWF4R3JvdXApIHtcbiAgICByZXN1bHQucHVzaChhcnJheS5zbGljZShpLCBpICsgbWF4R3JvdXApKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiByYW5nZShuOiBudW1iZXIpOiBudW1iZXJbXSB7XG4gIGNvbnN0IHJldCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgIHJldC5wdXNoKGkpO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG4iXX0=