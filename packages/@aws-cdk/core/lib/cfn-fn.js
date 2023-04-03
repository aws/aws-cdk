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
    constructor() { }
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
}
exports.Fn = Fn;
_a = JSII_RTTI_SYMBOL_1;
Fn[_a] = { fqn: "@aws-cdk/core.Fn", version: "0.0.0" };
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
        this.creationStack = stack_trace_1.captureStackTrace();
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
        return cloudformation_lang_1.minimalCloudFormationJoin(this.delimiter, resolvedValues);
    }
}
/**
 * The `Fn::ToJsonString` intrinsic function converts an object or array to its
 * corresponding JSON string.
 */
class FnToJsonString {
    constructor(object) {
        this.object = object;
        this.creationStack = stack_trace_1.captureStackTrace();
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
        this.creationStack = stack_trace_1.captureStackTrace();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWZuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLWZuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHVFQUEwRTtBQUMxRSxtREFBZ0Q7QUFDaEQsMkNBQXdDO0FBRXhDLG1DQUFnQztBQUNoQywrQ0FBa0Q7QUFDbEQsbUNBQWdDO0FBRWhDLDRCQUE0QjtBQUU1Qjs7O0dBR0c7QUFDSCxNQUFhLEVBQUU7SUErYWIsaUJBQXlCO0lBOWF6Qjs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFtQjtRQUNuQyxPQUFPLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQzFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxxQkFBNkIsRUFBRSxhQUFxQjtRQUN2RSxPQUFPLElBQUksUUFBUSxDQUFDLHFCQUFxQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0tBQzNEO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFpQixFQUFFLFlBQXNCO1FBQzFELElBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO1NBQ3RFO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDdkQ7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BMENHO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFpQixFQUFFLE1BQWMsRUFBRSxhQUFzQjtRQUMzRSx3Q0FBd0M7UUFDeEMsSUFBSSxDQUFDLGFBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDL0IsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2hD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QUFDLE9BQXdCO1FBQ3JDLGFBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3JDO0lBRU0sUUFBUTtRQUNiLE9BQU8sYUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztLQUM1RDtJQUVNLE1BQU07UUFDWCxPQUFPLGNBQWMsQ0FBQztLQUN2QjtDQUNGO0FBRUQsU0FBUyxXQUFXLENBQUksS0FBVSxFQUFFLFFBQWdCO0lBQ2xELE1BQU0sTUFBTSxHQUFHLElBQUksS0FBSyxFQUFPLENBQUM7SUFDaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLFFBQVEsRUFBRTtRQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO0tBQzNDO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELFNBQVMsS0FBSyxDQUFDLENBQVM7SUFDdEIsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMxQixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2I7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQ2ZuQ29uZGl0aW9uRXhwcmVzc2lvbiwgSUNmblJ1bGVDb25kaXRpb25FeHByZXNzaW9uIH0gZnJvbSAnLi9jZm4tY29uZGl0aW9uJztcbmltcG9ydCB7IG1pbmltYWxDbG91ZEZvcm1hdGlvbkpvaW4gfSBmcm9tICcuL3ByaXZhdGUvY2xvdWRmb3JtYXRpb24tbGFuZyc7XG5pbXBvcnQgeyBJbnRyaW5zaWMgfSBmcm9tICcuL3ByaXZhdGUvaW50cmluc2ljJztcbmltcG9ydCB7IFJlZmVyZW5jZSB9IGZyb20gJy4vcmVmZXJlbmNlJztcbmltcG9ydCB7IElSZXNvbHZhYmxlLCBJUmVzb2x2ZUNvbnRleHQgfSBmcm9tICcuL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7IGNhcHR1cmVTdGFja1RyYWNlIH0gZnJvbSAnLi9zdGFjay10cmFjZSc7XG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gJy4vdG9rZW4nO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5cbi8qKlxuICogQ2xvdWRGb3JtYXRpb24gaW50cmluc2ljIGZ1bmN0aW9ucy5cbiAqIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvaW50cmluc2ljLWZ1bmN0aW9uLXJlZmVyZW5jZS5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBGbiB7XG4gIC8qKlxuICAgKiBUaGUgYGBSZWZgYCBpbnRyaW5zaWMgZnVuY3Rpb24gcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBwYXJhbWV0ZXIgb3IgcmVzb3VyY2UuXG4gICAqIE5vdGUgdGhhdCBpdCBkb2Vzbid0IHZhbGlkYXRlIHRoZSBsb2dpY2FsTmFtZSwgaXQgbWFpbmx5IHNlcnZlcyBwYXJlbWV0ZXIvcmVzb3VyY2UgcmVmZXJlbmNlIGRlZmluZWQgaW4gYSBgYENmbkluY2x1ZGVgYCB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIGxvZ2ljYWxOYW1lIFRoZSBsb2dpY2FsIG5hbWUgb2YgYSBwYXJhbWV0ZXIvcmVzb3VyY2UgZm9yIHdoaWNoIHlvdSB3YW50IHRvIHJldHJpZXZlIGl0cyB2YWx1ZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVmKGxvZ2ljYWxOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgRm5SZWYobG9naWNhbE5hbWUpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGBgRm46OkdldEF0dGBgIGludHJpbnNpYyBmdW5jdGlvbiByZXR1cm5zIHRoZSB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGVcbiAgICogZnJvbSBhIHJlc291cmNlIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIGxvZ2ljYWxOYW1lT2ZSZXNvdXJjZSBUaGUgbG9naWNhbCBuYW1lIChhbHNvIGNhbGxlZCBsb2dpY2FsIElEKSBvZlxuICAgKiB0aGUgcmVzb3VyY2UgdGhhdCBjb250YWlucyB0aGUgYXR0cmlidXRlIHRoYXQgeW91IHdhbnQuXG4gICAqIEBwYXJhbSBhdHRyaWJ1dGVOYW1lIFRoZSBuYW1lIG9mIHRoZSByZXNvdXJjZS1zcGVjaWZpYyBhdHRyaWJ1dGUgd2hvc2VcbiAgICogdmFsdWUgeW91IHdhbnQuIFNlZSB0aGUgcmVzb3VyY2UncyByZWZlcmVuY2UgcGFnZSBmb3IgZGV0YWlscyBhYm91dCB0aGVcbiAgICogYXR0cmlidXRlcyBhdmFpbGFibGUgZm9yIHRoYXQgcmVzb3VyY2UgdHlwZS5cbiAgICogQHJldHVybnMgYW4gSVJlc29sdmFibGUgb2JqZWN0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldEF0dChsb2dpY2FsTmFtZU9mUmVzb3VyY2U6IHN0cmluZywgYXR0cmlidXRlTmFtZTogc3RyaW5nKTogSVJlc29sdmFibGUge1xuICAgIHJldHVybiBuZXcgRm5HZXRBdHQobG9naWNhbE5hbWVPZlJlc291cmNlLCBhdHRyaWJ1dGVOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OkpvaW5gYCBhcHBlbmRzIGEgc2V0IG9mIHZhbHVlcyBpbnRvIGEgc2luZ2xlXG4gICAqIHZhbHVlLCBzZXBhcmF0ZWQgYnkgdGhlIHNwZWNpZmllZCBkZWxpbWl0ZXIuIElmIGEgZGVsaW1pdGVyIGlzIHRoZSBlbXB0eVxuICAgKiBzdHJpbmcsIHRoZSBzZXQgb2YgdmFsdWVzIGFyZSBjb25jYXRlbmF0ZWQgd2l0aCBubyBkZWxpbWl0ZXIuXG4gICAqIEBwYXJhbSBkZWxpbWl0ZXIgVGhlIHZhbHVlIHlvdSB3YW50IHRvIG9jY3VyIGJldHdlZW4gZnJhZ21lbnRzLiBUaGVcbiAgICogZGVsaW1pdGVyIHdpbGwgb2NjdXIgYmV0d2VlbiBmcmFnbWVudHMgb25seS4gSXQgd2lsbCBub3QgdGVybWluYXRlIHRoZVxuICAgKiBmaW5hbCB2YWx1ZS5cbiAgICogQHBhcmFtIGxpc3RPZlZhbHVlcyBUaGUgbGlzdCBvZiB2YWx1ZXMgeW91IHdhbnQgY29tYmluZWQuXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgam9pbihkZWxpbWl0ZXI6IHN0cmluZywgbGlzdE9mVmFsdWVzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgaWYgKGxpc3RPZlZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm5Kb2luIHJlcXVpcmVzIGF0IGxlYXN0IG9uZSB2YWx1ZSB0byBiZSBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRm5Kb2luKGRlbGltaXRlciwgbGlzdE9mVmFsdWVzKS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNwbGl0IGEgc3RyaW5nIHRva2VuIGludG8gYSB0b2tlbiBsaXN0IG9mIHN0cmluZyB2YWx1ZXMuXG4gICAqXG4gICAqIFNwZWNpZnkgdGhlIGxvY2F0aW9uIG9mIHNwbGl0cyB3aXRoIGEgZGVsaW1pdGVyIHN1Y2ggYXMgJywnIChhIGNvbW1hKS5cbiAgICogUmVuZGVycyB0byB0aGUgYEZuOjpTcGxpdGAgaW50cmluc2ljIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBMaXN0cyB3aXRoIHVua25vd24gbGVuZ3RocyAoZGVmYXVsdClcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKlxuICAgKiBTaW5jZSB0aGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gd29yayB3aXRoIGRlcGxveS10aW1lIHZhbHVlcywgaWYgYGFzc3VtZWRMZW5ndGhgXG4gICAqIGlzIG5vdCBnaXZlbiB0aGUgQ0RLIGNhbm5vdCBrbm93IHRoZSBsZW5ndGggb2YgdGhlIHJlc3VsdGluZyBsaXN0IGF0IHN5bnRoZXNpcyB0aW1lLlxuICAgKiBUaGlzIGJyaW5ncyB0aGUgZm9sbG93aW5nIHJlc3RyaWN0aW9uczpcbiAgICpcbiAgICogLSBZb3UgbXVzdCB1c2UgYEZuLnNlbGVjdChpLCBsaXN0KWAgdG8gcGljayBlbGVtZW50cyBvdXQgb2YgdGhlIGxpc3QgKHlvdSBtdXN0IG5vdCB1c2VcbiAgICogICBgbGlzdFtpXWApLlxuICAgKiAtIFlvdSBjYW5ub3QgYWRkIGVsZW1lbnRzIHRvIHRoZSBsaXN0LCByZW1vdmUgZWxlbWVudHMgZnJvbSB0aGUgbGlzdCxcbiAgICogICBjb21iaW5lIHR3byBzdWNoIGxpc3RzIHRvZ2V0aGVyLCBvciB0YWtlIGEgc2xpY2Ugb2YgdGhlIGxpc3QuXG4gICAqIC0gWW91IGNhbm5vdCBwYXNzIHRoZSBsaXN0IHRvIGNvbnN0cnVjdHMgdGhhdCBkbyBhbnkgb2YgdGhlIGFib3ZlLlxuICAgKlxuICAgKiBUaGUgb25seSB2YWxpZCBvcGVyYXRpb24gd2l0aCBzdWNoIGEgdG9rZW5pemVkIGxpc3QgaXMgdG8gcGFzcyBpdCB1bm1vZGlmaWVkIHRvIGFcbiAgICogQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2UgY29uc3RydWN0LlxuICAgKlxuICAgKiBMaXN0cyB3aXRoIGFzc3VtZWQgbGVuZ3Roc1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKlxuICAgKiBQYXNzIGBhc3N1bWVkTGVuZ3RoYCBpZiB5b3Uga25vdyB0aGUgbGVuZ3RoIG9mIHRoZSBsaXN0IHRoYXQgd2lsbCBiZVxuICAgKiBwcm9kdWNlZCBieSBzcGxpdHRpbmcuIFRoZSBhY3R1YWwgbGlzdCBsZW5ndGggYXQgZGVwbG95IHRpbWUgbWF5IGJlXG4gICAqICpsb25nZXIqIHRoYW4gdGhlIG51bWJlciB5b3UgcGFzcywgYnV0IG5vdCAqc2hvcnRlciouXG4gICAqXG4gICAqIFRoZSByZXR1cm5lZCBsaXN0IHdpbGwgbG9vayBsaWtlOlxuICAgKlxuICAgKiBgYGBcbiAgICogW0ZuLnNlbGVjdCgwLCBzcGxpdCksIEZuLnNlbGVjdCgxLCBzcGxpdCksIEZuLnNlbGVjdCgyLCBzcGxpdCksIC4uLl1cbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSByZXN0cmljdGlvbnMgZnJvbSB0aGUgc2VjdGlvbiBcIkxpc3RzIHdpdGggdW5rbm93biBsZW5ndGhzXCIgd2lsbCBub3cgYmUgbGlmdGVkLFxuICAgKiBhdCB0aGUgZXhwZW5zZSBvZiBoYXZpbmcgdG8ga25vdyBhbmQgZml4IHRoZSBsZW5ndGggb2YgdGhlIGxpc3QuXG4gICAqXG4gICAqIEBwYXJhbSBkZWxpbWl0ZXIgQSBzdHJpbmcgdmFsdWUgdGhhdCBkZXRlcm1pbmVzIHdoZXJlIHRoZSBzb3VyY2Ugc3RyaW5nIGlzIGRpdmlkZWQuXG4gICAqIEBwYXJhbSBzb3VyY2UgVGhlIHN0cmluZyB2YWx1ZSB0aGF0IHlvdSB3YW50IHRvIHNwbGl0LlxuICAgKiBAcGFyYW0gYXNzdW1lZExlbmd0aCBUaGUgbGVuZ3RoIG9mIHRoZSBsaXN0IHRoYXQgd2lsbCBiZSBwcm9kdWNlZCBieSBzcGxpdHRpbmdcbiAgICogQHJldHVybnMgYSB0b2tlbiByZXByZXNlbnRlZCBhcyBhIHN0cmluZyBhcnJheVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzcGxpdChkZWxpbWl0ZXI6IHN0cmluZywgc291cmNlOiBzdHJpbmcsIGFzc3VtZWRMZW5ndGg/OiBudW1iZXIpOiBzdHJpbmdbXSB7XG4gICAgLy8gc2hvcnQtY2lyY3V0IGlmIHNvdXJjZSBpcyBub3QgYSB0b2tlblxuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBzb3VyY2Uuc3BsaXQoZGVsaW1pdGVyKTtcbiAgICB9XG5cbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGRlbGltaXRlcikpIHtcbiAgICAgIC8vIExpbWl0YXRpb24gb2YgQ2xvdWRGb3JtYXRpb25cbiAgICAgIHRocm93IG5ldyBFcnJvcignRm4uc3BsaXQ6IFxcJ2RlbGltaXRlclxcJyBtYXkgbm90IGJlIGEgdG9rZW4gdmFsdWUnKTtcbiAgICB9XG5cbiAgICBjb25zdCBzcGxpdCA9IFRva2VuLmFzTGlzdChuZXcgRm5TcGxpdChkZWxpbWl0ZXIsIHNvdXJjZSkpO1xuICAgIGlmIChhc3N1bWVkTGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBzcGxpdDtcbiAgICB9XG5cbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGFzc3VtZWRMZW5ndGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZuLnNwbGl0OiBcXCdhc3N1bWVkTGVuZ3RoXFwnIG1heSBub3QgYmUgYSB0b2tlbiB2YWx1ZScpO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZShhc3N1bWVkTGVuZ3RoKS5tYXAoaSA9PiBGbi5zZWxlY3QoaSwgc3BsaXQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OlNlbGVjdGBgIHJldHVybnMgYSBzaW5nbGUgb2JqZWN0IGZyb20gYSBsaXN0IG9mIG9iamVjdHMgYnkgaW5kZXguXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG9iamVjdCB0byByZXRyaWV2ZS4gVGhpcyBtdXN0IGJlIGEgdmFsdWUgZnJvbSB6ZXJvIHRvIE4tMSwgd2hlcmUgTiByZXByZXNlbnRzIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGFycmF5LlxuICAgKiBAcGFyYW0gYXJyYXkgVGhlIGxpc3Qgb2Ygb2JqZWN0cyB0byBzZWxlY3QgZnJvbS4gVGhpcyBsaXN0IG11c3Qgbm90IGJlIG51bGwsIG5vciBjYW4gaXQgaGF2ZSBudWxsIGVudHJpZXMuXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc2VsZWN0KGluZGV4OiBudW1iZXIsIGFycmF5OiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoaW5kZXgpICYmICFUb2tlbi5pc1VucmVzb2x2ZWQoYXJyYXkpICYmICFhcnJheS5zb21lKFRva2VuLmlzVW5yZXNvbHZlZCkpIHtcbiAgICAgIHJldHVybiBhcnJheVtpbmRleF07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBGblNlbGVjdChpbmRleCwgYXJyYXkpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpTdWJgYCBzdWJzdGl0dXRlcyB2YXJpYWJsZXMgaW4gYW4gaW5wdXQgc3RyaW5nXG4gICAqIHdpdGggdmFsdWVzIHRoYXQgeW91IHNwZWNpZnkuIEluIHlvdXIgdGVtcGxhdGVzLCB5b3UgY2FuIHVzZSB0aGlzIGZ1bmN0aW9uXG4gICAqIHRvIGNvbnN0cnVjdCBjb21tYW5kcyBvciBvdXRwdXRzIHRoYXQgaW5jbHVkZSB2YWx1ZXMgdGhhdCBhcmVuJ3QgYXZhaWxhYmxlXG4gICAqIHVudGlsIHlvdSBjcmVhdGUgb3IgdXBkYXRlIGEgc3RhY2suXG4gICAqIEBwYXJhbSBib2R5IEEgc3RyaW5nIHdpdGggdmFyaWFibGVzIHRoYXQgQVdTIENsb3VkRm9ybWF0aW9uIHN1YnN0aXR1dGVzXG4gICAqIHdpdGggdGhlaXIgYXNzb2NpYXRlZCB2YWx1ZXMgYXQgcnVudGltZS4gV3JpdGUgdmFyaWFibGVzIGFzICR7TXlWYXJOYW1lfS5cbiAgICogVmFyaWFibGVzIGNhbiBiZSB0ZW1wbGF0ZSBwYXJhbWV0ZXIgbmFtZXMsIHJlc291cmNlIGxvZ2ljYWwgSURzLCByZXNvdXJjZVxuICAgKiBhdHRyaWJ1dGVzLCBvciBhIHZhcmlhYmxlIGluIGEga2V5LXZhbHVlIG1hcC4gSWYgeW91IHNwZWNpZnkgb25seSB0ZW1wbGF0ZVxuICAgKiBwYXJhbWV0ZXIgbmFtZXMsIHJlc291cmNlIGxvZ2ljYWwgSURzLCBhbmQgcmVzb3VyY2UgYXR0cmlidXRlcywgZG9uJ3RcbiAgICogc3BlY2lmeSBhIGtleS12YWx1ZSBtYXAuXG4gICAqIEBwYXJhbSB2YXJpYWJsZXMgVGhlIG5hbWUgb2YgYSB2YXJpYWJsZSB0aGF0IHlvdSBpbmNsdWRlZCBpbiB0aGUgU3RyaW5nXG4gICAqIHBhcmFtZXRlci4gVGhlIHZhbHVlIHRoYXQgQVdTIENsb3VkRm9ybWF0aW9uIHN1YnN0aXR1dGVzIGZvciB0aGUgYXNzb2NpYXRlZFxuICAgKiB2YXJpYWJsZSBuYW1lIGF0IHJ1bnRpbWUuXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc3ViKGJvZHk6IHN0cmluZywgdmFyaWFibGVzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBGblN1Yihib2R5LCB2YXJpYWJsZXMpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpCYXNlNjRgYCByZXR1cm5zIHRoZSBCYXNlNjQgcmVwcmVzZW50YXRpb24gb2ZcbiAgICogdGhlIGlucHV0IHN0cmluZy4gVGhpcyBmdW5jdGlvbiBpcyB0eXBpY2FsbHkgdXNlZCB0byBwYXNzIGVuY29kZWQgZGF0YSB0b1xuICAgKiBBbWF6b24gRUMyIGluc3RhbmNlcyBieSB3YXkgb2YgdGhlIFVzZXJEYXRhIHByb3BlcnR5LlxuICAgKiBAcGFyYW0gZGF0YSBUaGUgc3RyaW5nIHZhbHVlIHlvdSB3YW50IHRvIGNvbnZlcnQgdG8gQmFzZTY0LlxuICAgKiBAcmV0dXJucyBhIHRva2VuIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGJhc2U2NChkYXRhOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgRm5CYXNlNjQoZGF0YSkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OkNpZHJgYCByZXR1cm5zIHRoZSBzcGVjaWZpZWQgQ2lkciBhZGRyZXNzIGJsb2NrLlxuICAgKiBAcGFyYW0gaXBCbG9jayAgVGhlIHVzZXItc3BlY2lmaWVkIGRlZmF1bHQgQ2lkciBhZGRyZXNzIGJsb2NrLlxuICAgKiBAcGFyYW0gY291bnQgIFRoZSBudW1iZXIgb2Ygc3VibmV0cycgQ2lkciBibG9jayB3YW50ZWQuIENvdW50IGNhbiBiZSAxIHRvIDI1Ni5cbiAgICogQHBhcmFtIHNpemVNYXNrIFRoZSBkaWdpdCBjb3ZlcmVkIGluIHRoZSBzdWJuZXQuXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY2lkcihpcEJsb2NrOiBzdHJpbmcsIGNvdW50OiBudW1iZXIsIHNpemVNYXNrPzogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBUb2tlbi5hc0xpc3QobmV3IEZuQ2lkcihpcEJsb2NrLCBjb3VudCwgc2l6ZU1hc2spKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhbiB1cmwsIHBhcnNlIHRoZSBkb21haW4gbmFtZVxuICAgKiBAcGFyYW0gdXJsIHRoZSB1cmwgdG8gcGFyc2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGFyc2VEb21haW5OYW1lKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBub0h0dHBzID0gRm4uc2VsZWN0KDEsIEZuLnNwbGl0KCcvLycsIHVybCkpO1xuICAgIHJldHVybiBGbi5zZWxlY3QoMCwgRm4uc3BsaXQoJy8nLCBub0h0dHBzKSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpHZXRBWnNgYCByZXR1cm5zIGFuIGFycmF5IHRoYXQgbGlzdHNcbiAgICogQXZhaWxhYmlsaXR5IFpvbmVzIGZvciBhIHNwZWNpZmllZCByZWdpb24uIEJlY2F1c2UgY3VzdG9tZXJzIGhhdmUgYWNjZXNzIHRvXG4gICAqIGRpZmZlcmVudCBBdmFpbGFiaWxpdHkgWm9uZXMsIHRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6R2V0QVpzYGAgZW5hYmxlc1xuICAgKiB0ZW1wbGF0ZSBhdXRob3JzIHRvIHdyaXRlIHRlbXBsYXRlcyB0aGF0IGFkYXB0IHRvIHRoZSBjYWxsaW5nIHVzZXInc1xuICAgKiBhY2Nlc3MuIFRoYXQgd2F5IHlvdSBkb24ndCBoYXZlIHRvIGhhcmQtY29kZSBhIGZ1bGwgbGlzdCBvZiBBdmFpbGFiaWxpdHlcbiAgICogWm9uZXMgZm9yIGEgc3BlY2lmaWVkIHJlZ2lvbi5cbiAgICogQHBhcmFtIHJlZ2lvbiBUaGUgbmFtZSBvZiB0aGUgcmVnaW9uIGZvciB3aGljaCB5b3Ugd2FudCB0byBnZXQgdGhlXG4gICAqIEF2YWlsYWJpbGl0eSBab25lcy4gWW91IGNhbiB1c2UgdGhlIEFXUzo6UmVnaW9uIHBzZXVkbyBwYXJhbWV0ZXIgdG8gc3BlY2lmeVxuICAgKiB0aGUgcmVnaW9uIGluIHdoaWNoIHRoZSBzdGFjayBpcyBjcmVhdGVkLiBTcGVjaWZ5aW5nIGFuIGVtcHR5IHN0cmluZyBpc1xuICAgKiBlcXVpdmFsZW50IHRvIHNwZWNpZnlpbmcgQVdTOjpSZWdpb24uXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmcgYXJyYXlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0QXpzKHJlZ2lvbj86IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gVG9rZW4uYXNMaXN0KG5ldyBGbkdldEFacyhyZWdpb24pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OkltcG9ydFZhbHVlYGAgcmV0dXJucyB0aGUgdmFsdWUgb2YgYW4gb3V0cHV0XG4gICAqIGV4cG9ydGVkIGJ5IGFub3RoZXIgc3RhY2suIFlvdSB0eXBpY2FsbHkgdXNlIHRoaXMgZnVuY3Rpb24gdG8gY3JlYXRlXG4gICAqIGNyb3NzLXN0YWNrIHJlZmVyZW5jZXMuIEluIHRoZSBmb2xsb3dpbmcgZXhhbXBsZSB0ZW1wbGF0ZSBzbmlwcGV0cywgU3RhY2sgQVxuICAgKiBleHBvcnRzIFZQQyBzZWN1cml0eSBncm91cCB2YWx1ZXMgYW5kIFN0YWNrIEIgaW1wb3J0cyB0aGVtLlxuICAgKiBAcGFyYW0gc2hhcmVkVmFsdWVUb0ltcG9ydCBUaGUgc3RhY2sgb3V0cHV0IHZhbHVlIHRoYXQgeW91IHdhbnQgdG8gaW1wb3J0LlxuICAgKiBAcmV0dXJucyBhIHRva2VuIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGltcG9ydFZhbHVlKHNoYXJlZFZhbHVlVG9JbXBvcnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBGbkltcG9ydFZhbHVlKHNoYXJlZFZhbHVlVG9JbXBvcnQpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogTGlrZSBgRm4uaW1wb3J0VmFsdWVgLCBidXQgaW1wb3J0IGEgbGlzdCB3aXRoIGEga25vd24gbGVuZ3RoXG4gICAqXG4gICAqIElmIHlvdSBleHBsaWNpdGx5IHdhbnQgYSBsaXN0IHdpdGggYW4gdW5rbm93biBsZW5ndGgsIGNhbGwgYEZuLnNwbGl0KCcsJyxcbiAgICogRm4uaW1wb3J0VmFsdWUoZXhwb3J0TmFtZSkpYC4gU2VlIHRoZSBkb2N1bWVudGF0aW9uIG9mIGBGbi5zcGxpdGAgdG8gcmVhZFxuICAgKiBtb3JlIGFib3V0IHRoZSBsaW1pdGF0aW9ucyBvZiB1c2luZyBsaXN0cyBvZiB1bmtub3duIGxlbmd0aC5cbiAgICpcbiAgICogYEZuLmltcG9ydExpc3RWYWx1ZShleHBvcnROYW1lLCBhc3N1bWVkTGVuZ3RoKWAgaXMgdGhlIHNhbWUgYXNcbiAgICogYEZuLnNwbGl0KCcsJywgRm4uaW1wb3J0VmFsdWUoZXhwb3J0TmFtZSksIGFzc3VtZWRMZW5ndGgpYCxcbiAgICogYnV0IGVhc2llciB0byByZWFkIGFuZCBpbXBvc3NpYmxlIHRvIGZvcmdldCB0byBwYXNzIGBhc3N1bWVkTGVuZ3RoYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaW1wb3J0TGlzdFZhbHVlKHNoYXJlZFZhbHVlVG9JbXBvcnQ6IHN0cmluZywgYXNzdW1lZExlbmd0aDogbnVtYmVyLCBkZWxpbWl0ZXIgPSAnLCcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIEZuLnNwbGl0KGRlbGltaXRlciwgRm4uaW1wb3J0VmFsdWUoc2hhcmVkVmFsdWVUb0ltcG9ydCksIGFzc3VtZWRMZW5ndGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6RmluZEluTWFwYGAgcmV0dXJucyB0aGUgdmFsdWUgY29ycmVzcG9uZGluZyB0b1xuICAgKiBrZXlzIGluIGEgdHdvLWxldmVsIG1hcCB0aGF0IGlzIGRlY2xhcmVkIGluIHRoZSBNYXBwaW5ncyBzZWN0aW9uLlxuICAgKiBAcmV0dXJucyBhIHRva2VuIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZpbmRJbk1hcChtYXBOYW1lOiBzdHJpbmcsIHRvcExldmVsS2V5OiBzdHJpbmcsIHNlY29uZExldmVsS2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBGbi5fZmluZEluTWFwKG1hcE5hbWUsIHRvcExldmVsS2V5LCBzZWNvbmRMZXZlbEtleSkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBhZGRpdGlvbmFsIGZ1bmN0aW9uIHVzZWQgaW4gQ2ZuUGFyc2VyLFxuICAgKiBhcyBGbjo6RmluZEluTWFwIGRvZXMgbm90IGFsd2F5cyByZXR1cm4gYSBzdHJpbmcuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBfZmluZEluTWFwKG1hcE5hbWU6IHN0cmluZywgdG9wTGV2ZWxLZXk6IHN0cmluZywgc2Vjb25kTGV2ZWxLZXk6IHN0cmluZyk6IElSZXNvbHZhYmxlIHtcbiAgICByZXR1cm4gbmV3IEZuRmluZEluTWFwKG1hcE5hbWUsIHRvcExldmVsS2V5LCBzZWNvbmRMZXZlbEtleSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHRva2VuIHJlcHJlc2VudGluZyB0aGUgYGBGbjo6VHJhbnNmb3JtYGAgZXhwcmVzc2lvblxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2ludHJpbnNpYy1mdW5jdGlvbi1yZWZlcmVuY2UtdHJhbnNmb3JtLmh0bWxcbiAgICogQHBhcmFtIG1hY3JvTmFtZSBUaGUgbmFtZSBvZiB0aGUgbWFjcm8gdG8gcGVyZm9ybSB0aGUgcHJvY2Vzc2luZ1xuICAgKiBAcGFyYW0gcGFyYW1ldGVycyBUaGUgcGFyYW1ldGVycyB0byBiZSBwYXNzZWQgdG8gdGhlIG1hY3JvXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50aW5nIHRoZSB0cmFuc2Zvcm0gZXhwcmVzc2lvblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB0cmFuc2Zvcm0obWFjcm9OYW1lOiBzdHJpbmcsIHBhcmFtZXRlcnM6IHsgW25hbWU6IHN0cmluZ106IGFueSB9KTogSVJlc29sdmFibGUge1xuICAgIHJldHVybiBuZXcgRm5UcmFuc2Zvcm0obWFjcm9OYW1lLCBwYXJhbWV0ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgYWxsIHRoZSBzcGVjaWZpZWQgY29uZGl0aW9ucyBldmFsdWF0ZSB0byB0cnVlLCBvciByZXR1cm5zXG4gICAqIGZhbHNlIGlmIGFueSBvbmUgb2YgdGhlIGNvbmRpdGlvbnMgZXZhbHVhdGVzIHRvIGZhbHNlLiBgYEZuOjpBbmRgYCBhY3RzIGFzXG4gICAqIGFuIEFORCBvcGVyYXRvci4gVGhlIG1pbmltdW0gbnVtYmVyIG9mIGNvbmRpdGlvbnMgdGhhdCB5b3UgY2FuIGluY2x1ZGUgaXNcbiAgICogMS5cbiAgICogQHBhcmFtIGNvbmRpdGlvbnMgY29uZGl0aW9ucyB0byBBTkRcbiAgICogQHJldHVybnMgYW4gRm5Db25kaXRpb24gdG9rZW5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29uZGl0aW9uQW5kKC4uLmNvbmRpdGlvbnM6IElDZm5Db25kaXRpb25FeHByZXNzaW9uW10pOiBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24ge1xuICAgIGlmIChjb25kaXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGbi5jb25kaXRpb25BbmQoKSBuZWVkcyBhdCBsZWFzdCBvbmUgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgaWYgKGNvbmRpdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gY29uZGl0aW9uc1swXSBhcyBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb247XG4gICAgfVxuICAgIHJldHVybiBGbi5jb25kaXRpb25BbmQoLi4uX2luR3JvdXBzT2YoY29uZGl0aW9ucywgMTApLm1hcChncm91cCA9PiBuZXcgRm5BbmQoLi4uZ3JvdXApKSk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGFyZXMgaWYgdHdvIHZhbHVlcyBhcmUgZXF1YWwuIFJldHVybnMgdHJ1ZSBpZiB0aGUgdHdvIHZhbHVlcyBhcmUgZXF1YWxcbiAgICogb3IgZmFsc2UgaWYgdGhleSBhcmVuJ3QuXG4gICAqIEBwYXJhbSBsaHMgQSB2YWx1ZSBvZiBhbnkgdHlwZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSByaHMgQSB2YWx1ZSBvZiBhbnkgdHlwZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBhcmUuXG4gICAqIEByZXR1cm5zIGFuIEZuQ29uZGl0aW9uIHRva2VuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbmRpdGlvbkVxdWFscyhsaHM6IGFueSwgcmhzOiBhbnkpOiBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24ge1xuICAgIHJldHVybiBuZXcgRm5FcXVhbHMobGhzLCByaHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgb25lIHZhbHVlIGlmIHRoZSBzcGVjaWZpZWQgY29uZGl0aW9uIGV2YWx1YXRlcyB0byB0cnVlIGFuZCBhbm90aGVyXG4gICAqIHZhbHVlIGlmIHRoZSBzcGVjaWZpZWQgY29uZGl0aW9uIGV2YWx1YXRlcyB0byBmYWxzZS4gQ3VycmVudGx5LCBBV1NcbiAgICogQ2xvdWRGb3JtYXRpb24gc3VwcG9ydHMgdGhlIGBgRm46OklmYGAgaW50cmluc2ljIGZ1bmN0aW9uIGluIHRoZSBtZXRhZGF0YVxuICAgKiBhdHRyaWJ1dGUsIHVwZGF0ZSBwb2xpY3kgYXR0cmlidXRlLCBhbmQgcHJvcGVydHkgdmFsdWVzIGluIHRoZSBSZXNvdXJjZXNcbiAgICogc2VjdGlvbiBhbmQgT3V0cHV0cyBzZWN0aW9ucyBvZiBhIHRlbXBsYXRlLiBZb3UgY2FuIHVzZSB0aGUgQVdTOjpOb1ZhbHVlXG4gICAqIHBzZXVkbyBwYXJhbWV0ZXIgYXMgYSByZXR1cm4gdmFsdWUgdG8gcmVtb3ZlIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5LlxuICAgKiBAcGFyYW0gY29uZGl0aW9uSWQgQSByZWZlcmVuY2UgdG8gYSBjb25kaXRpb24gaW4gdGhlIENvbmRpdGlvbnMgc2VjdGlvbi4gVXNlXG4gICAqIHRoZSBjb25kaXRpb24ncyBuYW1lIHRvIHJlZmVyZW5jZSBpdC5cbiAgICogQHBhcmFtIHZhbHVlSWZUcnVlIEEgdmFsdWUgdG8gYmUgcmV0dXJuZWQgaWYgdGhlIHNwZWNpZmllZCBjb25kaXRpb25cbiAgICogZXZhbHVhdGVzIHRvIHRydWUuXG4gICAqIEBwYXJhbSB2YWx1ZUlmRmFsc2UgQSB2YWx1ZSB0byBiZSByZXR1cm5lZCBpZiB0aGUgc3BlY2lmaWVkIGNvbmRpdGlvblxuICAgKiBldmFsdWF0ZXMgdG8gZmFsc2UuXG4gICAqIEByZXR1cm5zIGFuIEZuQ29uZGl0aW9uIHRva2VuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbmRpdGlvbklmKGNvbmRpdGlvbklkOiBzdHJpbmcsIHZhbHVlSWZUcnVlOiBhbnksIHZhbHVlSWZGYWxzZTogYW55KTogSUNmblJ1bGVDb25kaXRpb25FeHByZXNzaW9uIHtcbiAgICByZXR1cm4gbmV3IEZuSWYoY29uZGl0aW9uSWQsIHZhbHVlSWZUcnVlLCB2YWx1ZUlmRmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBmb3IgYSBjb25kaXRpb24gdGhhdCBldmFsdWF0ZXMgdG8gZmFsc2Ugb3IgcmV0dXJucyBmYWxzZSBmb3IgYVxuICAgKiBjb25kaXRpb24gdGhhdCBldmFsdWF0ZXMgdG8gdHJ1ZS4gYGBGbjo6Tm90YGAgYWN0cyBhcyBhIE5PVCBvcGVyYXRvci5cbiAgICogQHBhcmFtIGNvbmRpdGlvbiBBIGNvbmRpdGlvbiBzdWNoIGFzIGBgRm46OkVxdWFsc2BgIHRoYXQgZXZhbHVhdGVzIHRvIHRydWVcbiAgICogb3IgZmFsc2UuXG4gICAqIEByZXR1cm5zIGFuIEZuQ29uZGl0aW9uIHRva2VuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbmRpdGlvbk5vdChjb25kaXRpb246IElDZm5Db25kaXRpb25FeHByZXNzaW9uKTogSUNmblJ1bGVDb25kaXRpb25FeHByZXNzaW9uIHtcbiAgICByZXR1cm4gbmV3IEZuTm90KGNvbmRpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGFueSBvbmUgb2YgdGhlIHNwZWNpZmllZCBjb25kaXRpb25zIGV2YWx1YXRlIHRvIHRydWUsIG9yXG4gICAqIHJldHVybnMgZmFsc2UgaWYgYWxsIG9mIHRoZSBjb25kaXRpb25zIGV2YWx1YXRlcyB0byBmYWxzZS4gYGBGbjo6T3JgYCBhY3RzXG4gICAqIGFzIGFuIE9SIG9wZXJhdG9yLiBUaGUgbWluaW11bSBudW1iZXIgb2YgY29uZGl0aW9ucyB0aGF0IHlvdSBjYW4gaW5jbHVkZSBpc1xuICAgKiAxLlxuICAgKiBAcGFyYW0gY29uZGl0aW9ucyBjb25kaXRpb25zIHRoYXQgZXZhbHVhdGVzIHRvIHRydWUgb3IgZmFsc2UuXG4gICAqIEByZXR1cm5zIGFuIEZuQ29uZGl0aW9uIHRva2VuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbmRpdGlvbk9yKC4uLmNvbmRpdGlvbnM6IElDZm5Db25kaXRpb25FeHByZXNzaW9uW10pOiBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24ge1xuICAgIGlmIChjb25kaXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGbi5jb25kaXRpb25PcigpIG5lZWRzIGF0IGxlYXN0IG9uZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoY29uZGl0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBjb25kaXRpb25zWzBdIGFzIElDZm5SdWxlQ29uZGl0aW9uRXhwcmVzc2lvbjtcbiAgICB9XG4gICAgcmV0dXJuIEZuLmNvbmRpdGlvbk9yKC4uLl9pbkdyb3Vwc09mKGNvbmRpdGlvbnMsIDEwKS5tYXAoZ3JvdXAgPT4gbmV3IEZuT3IoLi4uZ3JvdXApKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGEgc3BlY2lmaWVkIHN0cmluZyBtYXRjaGVzIGF0IGxlYXN0IG9uZSB2YWx1ZSBpbiBhIGxpc3Qgb2ZcbiAgICogc3RyaW5ncy5cbiAgICogQHBhcmFtIGxpc3RPZlN0cmluZ3MgQSBsaXN0IG9mIHN0cmluZ3MsIHN1Y2ggYXMgXCJBXCIsIFwiQlwiLCBcIkNcIi5cbiAgICogQHBhcmFtIHZhbHVlIEEgc3RyaW5nLCBzdWNoIGFzIFwiQVwiLCB0aGF0IHlvdSB3YW50IHRvIGNvbXBhcmUgYWdhaW5zdCBhIGxpc3Qgb2Ygc3RyaW5ncy5cbiAgICogQHJldHVybnMgYW4gRm5Db25kaXRpb24gdG9rZW5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29uZGl0aW9uQ29udGFpbnMobGlzdE9mU3RyaW5nczogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpOiBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24ge1xuICAgIHJldHVybiBuZXcgRm5Db250YWlucyhsaXN0T2ZTdHJpbmdzLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGEgc3BlY2lmaWVkIHN0cmluZyBtYXRjaGVzIGFsbCB2YWx1ZXMgaW4gYSBsaXN0LlxuICAgKiBAcGFyYW0gbGlzdE9mU3RyaW5ncyBBIGxpc3Qgb2Ygc3RyaW5ncywgc3VjaCBhcyBcIkFcIiwgXCJCXCIsIFwiQ1wiLlxuICAgKiBAcGFyYW0gdmFsdWUgQSBzdHJpbmcsIHN1Y2ggYXMgXCJBXCIsIHRoYXQgeW91IHdhbnQgdG8gY29tcGFyZSBhZ2FpbnN0IGEgbGlzdFxuICAgKiBvZiBzdHJpbmdzLlxuICAgKiBAcmV0dXJucyBhbiBGbkNvbmRpdGlvbiB0b2tlblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb25kaXRpb25FYWNoTWVtYmVyRXF1YWxzKGxpc3RPZlN0cmluZ3M6IHN0cmluZ1tdLCB2YWx1ZTogc3RyaW5nKTogSUNmblJ1bGVDb25kaXRpb25FeHByZXNzaW9uIHtcbiAgICByZXR1cm4gbmV3IEZuRWFjaE1lbWJlckVxdWFscyhsaXN0T2ZTdHJpbmdzLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGVhY2ggbWVtYmVyIGluIGEgbGlzdCBvZiBzdHJpbmdzIG1hdGNoZXMgYXQgbGVhc3Qgb25lIHZhbHVlXG4gICAqIGluIGEgc2Vjb25kIGxpc3Qgb2Ygc3RyaW5ncy5cbiAgICogQHBhcmFtIHN0cmluZ3NUb0NoZWNrIEEgbGlzdCBvZiBzdHJpbmdzLCBzdWNoIGFzIFwiQVwiLCBcIkJcIiwgXCJDXCIuIEFXU1xuICAgKiBDbG91ZEZvcm1hdGlvbiBjaGVja3Mgd2hldGhlciBlYWNoIG1lbWJlciBpbiB0aGUgc3RyaW5nc190b19jaGVjayBwYXJhbWV0ZXJcbiAgICogaXMgaW4gdGhlIHN0cmluZ3NfdG9fbWF0Y2ggcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0gc3RyaW5nc1RvTWF0Y2ggQSBsaXN0IG9mIHN0cmluZ3MsIHN1Y2ggYXMgXCJBXCIsIFwiQlwiLCBcIkNcIi4gRWFjaCBtZW1iZXJcbiAgICogaW4gdGhlIHN0cmluZ3NfdG9fbWF0Y2ggcGFyYW1ldGVyIGlzIGNvbXBhcmVkIGFnYWluc3QgdGhlIG1lbWJlcnMgb2YgdGhlXG4gICAqIHN0cmluZ3NfdG9fY2hlY2sgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJucyBhbiBGbkNvbmRpdGlvbiB0b2tlblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb25kaXRpb25FYWNoTWVtYmVySW4oc3RyaW5nc1RvQ2hlY2s6IHN0cmluZ1tdLCBzdHJpbmdzVG9NYXRjaDogc3RyaW5nW10pOiBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24ge1xuICAgIHJldHVybiBuZXcgRm5FYWNoTWVtYmVySW4oc3RyaW5nc1RvQ2hlY2ssIHN0cmluZ3NUb01hdGNoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFsbCB2YWx1ZXMgZm9yIGEgc3BlY2lmaWVkIHBhcmFtZXRlciB0eXBlLlxuICAgKiBAcGFyYW0gcGFyYW1ldGVyVHlwZSBBbiBBV1Mtc3BlY2lmaWMgcGFyYW1ldGVyIHR5cGUsIHN1Y2ggYXNcbiAgICogQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXA6OklkIG9yIEFXUzo6RUMyOjpWUEM6OklkLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlXG4gICAqIFBhcmFtZXRlcnMgaW4gdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBVc2VyIEd1aWRlLlxuICAgKiBAcmV0dXJucyBhIHRva2VuIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nIGFycmF5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlZkFsbChwYXJhbWV0ZXJUeXBlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFRva2VuLmFzTGlzdChuZXcgRm5SZWZBbGwocGFyYW1ldGVyVHlwZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXR0cmlidXRlIHZhbHVlIG9yIGxpc3Qgb2YgdmFsdWVzIGZvciBhIHNwZWNpZmljIHBhcmFtZXRlciBhbmRcbiAgICogYXR0cmlidXRlLlxuICAgKiBAcGFyYW0gcGFyYW1ldGVyT3JMb2dpY2FsSWQgVGhlIG5hbWUgb2YgYSBwYXJhbWV0ZXIgZm9yIHdoaWNoIHlvdSB3YW50IHRvXG4gICAqIHJldHJpZXZlIGF0dHJpYnV0ZSB2YWx1ZXMuIFRoZSBwYXJhbWV0ZXIgbXVzdCBiZSBkZWNsYXJlZCBpbiB0aGUgUGFyYW1ldGVyc1xuICAgKiBzZWN0aW9uIG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZSBUaGUgbmFtZSBvZiBhbiBhdHRyaWJ1dGUgZnJvbSB3aGljaCB5b3Ugd2FudCB0byByZXRyaWV2ZSBhXG4gICAqIHZhbHVlLlxuICAgKiBAcmV0dXJucyBhIHRva2VuIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHZhbHVlT2YocGFyYW1ldGVyT3JMb2dpY2FsSWQ6IHN0cmluZywgYXR0cmlidXRlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgRm5WYWx1ZU9mKHBhcmFtZXRlck9yTG9naWNhbElkLCBhdHRyaWJ1dGUpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxpc3Qgb2YgYWxsIGF0dHJpYnV0ZSB2YWx1ZXMgZm9yIGEgZ2l2ZW4gcGFyYW1ldGVyIHR5cGUgYW5kXG4gICAqIGF0dHJpYnV0ZS5cbiAgICogQHBhcmFtIHBhcmFtZXRlclR5cGUgQW4gQVdTLXNwZWNpZmljIHBhcmFtZXRlciB0eXBlLCBzdWNoIGFzXG4gICAqIEFXUzo6RUMyOjpTZWN1cml0eUdyb3VwOjpJZCBvciBBV1M6OkVDMjo6VlBDOjpJZC4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZVxuICAgKiBQYXJhbWV0ZXJzIGluIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gVXNlciBHdWlkZS5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZSBUaGUgbmFtZSBvZiBhbiBhdHRyaWJ1dGUgZnJvbSB3aGljaCB5b3Ugd2FudCB0byByZXRyaWV2ZSBhXG4gICAqIHZhbHVlLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBhdHRyaWJ1dGVzLCBzZWUgU3VwcG9ydGVkIEF0dHJpYnV0ZXMuXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmcgYXJyYXlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdmFsdWVPZkFsbChwYXJhbWV0ZXJUeXBlOiBzdHJpbmcsIGF0dHJpYnV0ZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBUb2tlbi5hc0xpc3QobmV3IEZuVmFsdWVPZkFsbChwYXJhbWV0ZXJUeXBlLCBhdHRyaWJ1dGUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYEZuOjpUb0pzb25TdHJpbmdgIGludHJpbnNpYyBmdW5jdGlvbiBjb252ZXJ0cyBhbiBvYmplY3Qgb3IgYXJyYXkgdG8gaXRzXG4gICAqIGNvcnJlc3BvbmRpbmcgSlNPTiBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBvYmplY3QgVGhlIG9iamVjdCBvciBhcnJheSB0byBzdHJpbmdpZnlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdG9Kc29uU3RyaW5nKG9iamVjdDogYW55KTogc3RyaW5nIHtcbiAgICAvLyBzaG9ydC1jaXJjdXQgaWYgb2JqZWN0IGlzIG5vdCBhIHRva2VuXG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQob2JqZWN0KSkge1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRm5Ub0pzb25TdHJpbmcob2JqZWN0KS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYEZuOjpMZW5ndGhgIHJldHVybnMgdGhlIG51bWJlciBvZiBlbGVtZW50cyB3aXRoaW4gYW4gYXJyYXlcbiAgICogb3IgYW4gaW50cmluc2ljIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIGFycmF5IFRoZSBhcnJheSB5b3Ugd2FudCB0byByZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBmcm9tXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGxlbihhcnJheTogYW55KTogbnVtYmVyIHtcbiAgICAvLyBzaG9ydC1jaXJjdXQgaWYgYXJyYXkgaXMgbm90IGEgdG9rZW5cbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChhcnJheSkpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGbi5sZW5ndGgoKSBuZWVkcyBhbiBhcnJheScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFycmF5Lmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIFRva2VuLmFzTnVtYmVyKG5ldyBGbkxlbmd0aChhcnJheSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHsgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHRva2VucyB0aGF0IHJlcHJlc2VudCBDbG91ZEZvcm1hdGlvbiBpbnRyaW5zaWMgZnVuY3Rpb25zLlxuICovXG5jbGFzcyBGbkJhc2UgZXh0ZW5kcyBJbnRyaW5zaWMge1xuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICBzdXBlcih7IFtuYW1lXTogdmFsdWUgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgUmVmYGAgcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBwYXJhbWV0ZXIgb3IgcmVzb3VyY2UuXG4gKiBXaGVuIHlvdSBzcGVjaWZ5IGEgcGFyYW1ldGVyJ3MgbG9naWNhbCBuYW1lLCBpdCByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICogV2hlbiB5b3Ugc3BlY2lmeSBhIHJlc291cmNlJ3MgbG9naWNhbCBuYW1lLCBpdCByZXR1cm5zIGEgdmFsdWUgdGhhdCB5b3UgY2FuIHR5cGljYWxseSB1c2UgdG8gcmVmZXIgdG8gdGhhdCByZXNvdXJjZSwgc3VjaCBhcyBhIHBoeXNpY2FsIElELlxuICovXG5jbGFzcyBGblJlZiBleHRlbmRzIEZuQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgUmVmYGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBsb2dpY2FsTmFtZSBUaGUgbG9naWNhbCBuYW1lIG9mIGEgcGFyYW1ldGVyL3Jlc291cmNlIGZvciB3aGljaCB5b3Ugd2FudCB0byByZXRyaWV2ZSBpdHMgdmFsdWUuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihsb2dpY2FsTmFtZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoJ1JlZicsIGxvZ2ljYWxOYW1lKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6RmluZEluTWFwYGAgcmV0dXJucyB0aGUgdmFsdWUgY29ycmVzcG9uZGluZyB0byBrZXlzIGluIGEgdHdvLWxldmVsXG4gKiBtYXAgdGhhdCBpcyBkZWNsYXJlZCBpbiB0aGUgTWFwcGluZ3Mgc2VjdGlvbi5cbiAqL1xuY2xhc3MgRm5GaW5kSW5NYXAgZXh0ZW5kcyBGbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpGaW5kSW5NYXBgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIG1hcE5hbWUgVGhlIGxvZ2ljYWwgbmFtZSBvZiBhIG1hcHBpbmcgZGVjbGFyZWQgaW4gdGhlIE1hcHBpbmdzIHNlY3Rpb24gdGhhdCBjb250YWlucyB0aGUga2V5cyBhbmQgdmFsdWVzLlxuICAgKiBAcGFyYW0gdG9wTGV2ZWxLZXkgVGhlIHRvcC1sZXZlbCBrZXkgbmFtZS4gSXRzIHZhbHVlIGlzIGEgbGlzdCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gICAqIEBwYXJhbSBzZWNvbmRMZXZlbEtleSBUaGUgc2Vjb25kLWxldmVsIGtleSBuYW1lLCB3aGljaCBpcyBzZXQgdG8gb25lIG9mIHRoZSBrZXlzIGZyb20gdGhlIGxpc3QgYXNzaWduZWQgdG8gVG9wTGV2ZWxLZXkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihtYXBOYW1lOiBzdHJpbmcsIHRvcExldmVsS2V5OiBhbnksIHNlY29uZExldmVsS2V5OiBhbnkpIHtcbiAgICBzdXBlcignRm46OkZpbmRJbk1hcCcsIFttYXBOYW1lLCB0b3BMZXZlbEtleSwgc2Vjb25kTGV2ZWxLZXldKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6VHJhbnNmb3JtYGAgc3BlY2lmaWVzIGEgbWFjcm8gdG8gcGVyZm9ybSBjdXN0b20gcHJvY2Vzc2luZyBvbiBwYXJ0IG9mIGEgc3RhY2sgdGVtcGxhdGUuXG4gKi9cbmNsYXNzIEZuVHJhbnNmb3JtIGV4dGVuZHMgRm5CYXNlIHtcbiAgLyoqXG4gICAqIGNyZWF0ZXMgYW4gYGBGbjo6VHJhbnNmb3JtYGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBtYWNyb05hbWUgVGhlIG5hbWUgb2YgdGhlIG1hY3JvIHRvIGJlIGludm9rZWRcbiAgICogQHBhcmFtIHBhcmFtZXRlcnMgdGhlIHBhcmFtZXRlcnMgdG8gcGFzcyB0byBpdFxuICAgKi9cbiAgY29uc3RydWN0b3IobWFjcm9OYW1lOiBzdHJpbmcsIHBhcmFtZXRlcnM6IHsgW25hbWU6IHN0cmluZ106IGFueSB9KSB7XG4gICAgc3VwZXIoJ0ZuOjpUcmFuc2Zvcm0nLCB7IE5hbWU6IG1hY3JvTmFtZSwgUGFyYW1ldGVyczogcGFyYW1ldGVycyB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBgYEZuOjpHZXRBdHRgYCBpbnRyaW5zaWMgZnVuY3Rpb24gcmV0dXJucyB0aGUgdmFsdWUgb2YgYW4gYXR0cmlidXRlIGZyb20gYSByZXNvdXJjZSBpbiB0aGUgdGVtcGxhdGUuXG4gKi9cbmNsYXNzIEZuR2V0QXR0IGV4dGVuZHMgRm5CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBgYEZuOjpHZXRBdHRgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGxvZ2ljYWxOYW1lT2ZSZXNvdXJjZSBUaGUgbG9naWNhbCBuYW1lIChhbHNvIGNhbGxlZCBsb2dpY2FsIElEKSBvZiB0aGUgcmVzb3VyY2UgdGhhdCBjb250YWlucyB0aGUgYXR0cmlidXRlIHRoYXQgeW91IHdhbnQuXG4gICAqIEBwYXJhbSBhdHRyaWJ1dGVOYW1lIFRoZSBuYW1lIG9mIHRoZSByZXNvdXJjZS1zcGVjaWZpYyBhdHRyaWJ1dGUgd2hvc2UgdmFsdWUgeW91IHdhbnQuIFNlZSB0aGUgcmVzb3VyY2UncyByZWZlcmVuY2UgcGFnZSBmb3IgZGV0YWlscyBhYm91dCB0aGUgYXR0cmlidXRlcyBhdmFpbGFibGUgZm9yIHRoYXQgcmVzb3VyY2UgdHlwZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGxvZ2ljYWxOYW1lT2ZSZXNvdXJjZTogc3RyaW5nLCBhdHRyaWJ1dGVOYW1lOiBzdHJpbmcpIHtcbiAgICBzdXBlcignRm46OkdldEF0dCcsIFtsb2dpY2FsTmFtZU9mUmVzb3VyY2UsIGF0dHJpYnV0ZU5hbWVdKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6R2V0QVpzYGAgcmV0dXJucyBhbiBhcnJheSB0aGF0IGxpc3RzIEF2YWlsYWJpbGl0eSBab25lcyBmb3IgYVxuICogc3BlY2lmaWVkIHJlZ2lvbi4gQmVjYXVzZSBjdXN0b21lcnMgaGF2ZSBhY2Nlc3MgdG8gZGlmZmVyZW50IEF2YWlsYWJpbGl0eSBab25lcywgdGhlIGludHJpbnNpY1xuICogZnVuY3Rpb24gYGBGbjo6R2V0QVpzYGAgZW5hYmxlcyB0ZW1wbGF0ZSBhdXRob3JzIHRvIHdyaXRlIHRlbXBsYXRlcyB0aGF0IGFkYXB0IHRvIHRoZSBjYWxsaW5nXG4gKiB1c2VyJ3MgYWNjZXNzLiBUaGF0IHdheSB5b3UgZG9uJ3QgaGF2ZSB0byBoYXJkLWNvZGUgYSBmdWxsIGxpc3Qgb2YgQXZhaWxhYmlsaXR5IFpvbmVzIGZvciBhXG4gKiBzcGVjaWZpZWQgcmVnaW9uLlxuICovXG5jbGFzcyBGbkdldEFacyBleHRlbmRzIEZuQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OkdldEFac2BgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gcmVnaW9uIFRoZSBuYW1lIG9mIHRoZSByZWdpb24gZm9yIHdoaWNoIHlvdSB3YW50IHRvIGdldCB0aGUgQXZhaWxhYmlsaXR5IFpvbmVzLlxuICAgKiAgICAgICAgIFlvdSBjYW4gdXNlIHRoZSBBV1M6OlJlZ2lvbiBwc2V1ZG8gcGFyYW1ldGVyIHRvIHNwZWNpZnkgdGhlIHJlZ2lvbiBpblxuICAgKiAgICAgICAgIHdoaWNoIHRoZSBzdGFjayBpcyBjcmVhdGVkLiBTcGVjaWZ5aW5nIGFuIGVtcHR5IHN0cmluZyBpcyBlcXVpdmFsZW50IHRvXG4gICAqICAgICAgICAgc3BlY2lmeWluZyBBV1M6OlJlZ2lvbi5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHJlZ2lvbj86IHN0cmluZykge1xuICAgIHN1cGVyKCdGbjo6R2V0QVpzJywgcmVnaW9uIHx8ICcnKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6SW1wb3J0VmFsdWVgYCByZXR1cm5zIHRoZSB2YWx1ZSBvZiBhbiBvdXRwdXQgZXhwb3J0ZWQgYnkgYW5vdGhlciBzdGFjay5cbiAqIFlvdSB0eXBpY2FsbHkgdXNlIHRoaXMgZnVuY3Rpb24gdG8gY3JlYXRlIGNyb3NzLXN0YWNrIHJlZmVyZW5jZXMuIEluIHRoZSBmb2xsb3dpbmcgZXhhbXBsZVxuICogdGVtcGxhdGUgc25pcHBldHMsIFN0YWNrIEEgZXhwb3J0cyBWUEMgc2VjdXJpdHkgZ3JvdXAgdmFsdWVzIGFuZCBTdGFjayBCIGltcG9ydHMgdGhlbS5cbiAqL1xuY2xhc3MgRm5JbXBvcnRWYWx1ZSBleHRlbmRzIEZuQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OkltcG9ydFZhbHVlYGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBzaGFyZWRWYWx1ZVRvSW1wb3J0IFRoZSBzdGFjayBvdXRwdXQgdmFsdWUgdGhhdCB5b3Ugd2FudCB0byBpbXBvcnQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzaGFyZWRWYWx1ZVRvSW1wb3J0OiBzdHJpbmcpIHtcbiAgICBzdXBlcignRm46OkltcG9ydFZhbHVlJywgc2hhcmVkVmFsdWVUb0ltcG9ydCk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OlNlbGVjdGBgIHJldHVybnMgYSBzaW5nbGUgb2JqZWN0IGZyb20gYSBsaXN0IG9mIG9iamVjdHMgYnkgaW5kZXguXG4gKi9cbmNsYXNzIEZuU2VsZWN0IGV4dGVuZHMgRm5CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBGbjo6U2VsZWN0YGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG9iamVjdCB0byByZXRyaWV2ZS4gVGhpcyBtdXN0IGJlIGEgdmFsdWUgZnJvbSB6ZXJvIHRvIE4tMSwgd2hlcmUgTiByZXByZXNlbnRzIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGFycmF5LlxuICAgKiBAcGFyYW0gYXJyYXkgVGhlIGxpc3Qgb2Ygb2JqZWN0cyB0byBzZWxlY3QgZnJvbS4gVGhpcyBsaXN0IG11c3Qgbm90IGJlIG51bGwsIG5vciBjYW4gaXQgaGF2ZSBudWxsIGVudHJpZXMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpbmRleDogbnVtYmVyLCBhcnJheTogYW55KSB7XG4gICAgc3VwZXIoJ0ZuOjpTZWxlY3QnLCBbaW5kZXgsIGFycmF5XSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUbyBzcGxpdCBhIHN0cmluZyBpbnRvIGEgbGlzdCBvZiBzdHJpbmcgdmFsdWVzIHNvIHRoYXQgeW91IGNhbiBzZWxlY3QgYW4gZWxlbWVudCBmcm9tIHRoZVxuICogcmVzdWx0aW5nIHN0cmluZyBsaXN0LCB1c2UgdGhlIGBgRm46OlNwbGl0YGAgaW50cmluc2ljIGZ1bmN0aW9uLiBTcGVjaWZ5IHRoZSBsb2NhdGlvbiBvZiBzcGxpdHNcbiAqIHdpdGggYSBkZWxpbWl0ZXIsIHN1Y2ggYXMgLCAoYSBjb21tYSkuIEFmdGVyIHlvdSBzcGxpdCBhIHN0cmluZywgdXNlIHRoZSBgYEZuOjpTZWxlY3RgYCBmdW5jdGlvblxuICogdG8gcGljayBhIHNwZWNpZmljIGVsZW1lbnQuXG4gKi9cbmNsYXNzIEZuU3BsaXQgZXh0ZW5kcyBGbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlIGFuIGBgRm46OlNwbGl0YGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBkZWxpbWl0ZXIgQSBzdHJpbmcgdmFsdWUgdGhhdCBkZXRlcm1pbmVzIHdoZXJlIHRoZSBzb3VyY2Ugc3RyaW5nIGlzIGRpdmlkZWQuXG4gICAqIEBwYXJhbSBzb3VyY2UgVGhlIHN0cmluZyB2YWx1ZSB0aGF0IHlvdSB3YW50IHRvIHNwbGl0LlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGVsaW1pdGVyOiBzdHJpbmcsIHNvdXJjZTogYW55KSB7XG4gICAgc3VwZXIoJ0ZuOjpTcGxpdCcsIFtkZWxpbWl0ZXIsIHNvdXJjZV0pO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpTdWJgYCBzdWJzdGl0dXRlcyB2YXJpYWJsZXMgaW4gYW4gaW5wdXQgc3RyaW5nIHdpdGggdmFsdWVzIHRoYXRcbiAqIHlvdSBzcGVjaWZ5LiBJbiB5b3VyIHRlbXBsYXRlcywgeW91IGNhbiB1c2UgdGhpcyBmdW5jdGlvbiB0byBjb25zdHJ1Y3QgY29tbWFuZHMgb3Igb3V0cHV0c1xuICogdGhhdCBpbmNsdWRlIHZhbHVlcyB0aGF0IGFyZW4ndCBhdmFpbGFibGUgdW50aWwgeW91IGNyZWF0ZSBvciB1cGRhdGUgYSBzdGFjay5cbiAqL1xuY2xhc3MgRm5TdWIgZXh0ZW5kcyBGbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpTdWJgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGJvZHkgQSBzdHJpbmcgd2l0aCB2YXJpYWJsZXMgdGhhdCBBV1MgQ2xvdWRGb3JtYXRpb24gc3Vic3RpdHV0ZXMgd2l0aCB0aGVpclxuICAgKiAgICAgICBhc3NvY2lhdGVkIHZhbHVlcyBhdCBydW50aW1lLiBXcml0ZSB2YXJpYWJsZXMgYXMgJHtNeVZhck5hbWV9LiBWYXJpYWJsZXNcbiAgICogICAgICAgY2FuIGJlIHRlbXBsYXRlIHBhcmFtZXRlciBuYW1lcywgcmVzb3VyY2UgbG9naWNhbCBJRHMsIHJlc291cmNlIGF0dHJpYnV0ZXMsXG4gICAqICAgICAgIG9yIGEgdmFyaWFibGUgaW4gYSBrZXktdmFsdWUgbWFwLiBJZiB5b3Ugc3BlY2lmeSBvbmx5IHRlbXBsYXRlIHBhcmFtZXRlciBuYW1lcyxcbiAgICogICAgICAgcmVzb3VyY2UgbG9naWNhbCBJRHMsIGFuZCByZXNvdXJjZSBhdHRyaWJ1dGVzLCBkb24ndCBzcGVjaWZ5IGEga2V5LXZhbHVlIG1hcC5cbiAgICogQHBhcmFtIHZhcmlhYmxlcyBUaGUgbmFtZSBvZiBhIHZhcmlhYmxlIHRoYXQgeW91IGluY2x1ZGVkIGluIHRoZSBTdHJpbmcgcGFyYW1ldGVyLlxuICAgKiAgICAgICAgICBUaGUgdmFsdWUgdGhhdCBBV1MgQ2xvdWRGb3JtYXRpb24gc3Vic3RpdHV0ZXMgZm9yIHRoZSBhc3NvY2lhdGVkIHZhcmlhYmxlIG5hbWUgYXQgcnVudGltZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGJvZHk6IHN0cmluZywgdmFyaWFibGVzPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkge1xuICAgIHN1cGVyKCdGbjo6U3ViJywgdmFyaWFibGVzID8gW2JvZHksIHZhcmlhYmxlc10gOiBib2R5KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6QmFzZTY0YGAgcmV0dXJucyB0aGUgQmFzZTY0IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBpbnB1dCBzdHJpbmcuXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHR5cGljYWxseSB1c2VkIHRvIHBhc3MgZW5jb2RlZCBkYXRhIHRvIEFtYXpvbiBFQzIgaW5zdGFuY2VzIGJ5IHdheSBvZlxuICogdGhlIFVzZXJEYXRhIHByb3BlcnR5LlxuICovXG5jbGFzcyBGbkJhc2U2NCBleHRlbmRzIEZuQmFzZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBGbjo6QmFzZTY0YGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBkYXRhIFRoZSBzdHJpbmcgdmFsdWUgeW91IHdhbnQgdG8gY29udmVydCB0byBCYXNlNjQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhOiBhbnkpIHtcbiAgICBzdXBlcignRm46OkJhc2U2NCcsIGRhdGEpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpDaWRyYGAgcmV0dXJucyB0aGUgc3BlY2lmaWVkIENpZHIgYWRkcmVzcyBibG9jay5cbiAqL1xuY2xhc3MgRm5DaWRyIGV4dGVuZHMgRm5CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBGbjo6Q2lkcmBgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gaXBCbG9jayAgVGhlIHVzZXItc3BlY2lmaWVkIGRlZmF1bHQgQ2lkciBhZGRyZXNzIGJsb2NrLlxuICAgKiBAcGFyYW0gY291bnQgIFRoZSBudW1iZXIgb2Ygc3VibmV0cycgQ2lkciBibG9jayB3YW50ZWQuIENvdW50IGNhbiBiZSAxIHRvIDI1Ni5cbiAgICogQHBhcmFtIHNpemVNYXNrIFRoZSBkaWdpdCBjb3ZlcmVkIGluIHRoZSBzdWJuZXQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpcEJsb2NrOiBhbnksIGNvdW50OiBhbnksIHNpemVNYXNrPzogYW55KSB7XG4gICAgaWYgKGNvdW50IDwgMSB8fCBjb3VudCA+IDI1Nikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGbjo6Q2lkcidzIGNvdW50IGF0dHJpYnV0ZSBtdXN0IGJlIGJldHdlbiAxIGFuZCAyNTYsICR7Y291bnR9IHdhcyBwcm92aWRlZC5gKTtcbiAgICB9XG4gICAgc3VwZXIoJ0ZuOjpDaWRyJywgW2lwQmxvY2ssIGNvdW50LCBzaXplTWFza10pO1xuICB9XG59XG5cbmNsYXNzIEZuQ29uZGl0aW9uQmFzZSBleHRlbmRzIEludHJpbnNpYyBpbXBsZW1lbnRzIElDZm5SdWxlQ29uZGl0aW9uRXhwcmVzc2lvbiB7XG4gIHJlYWRvbmx5IGRpc2FtYmlndWF0b3IgPSB0cnVlO1xuICBjb25zdHJ1Y3Rvcih0eXBlOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICBzdXBlcih7IFt0eXBlXTogdmFsdWUgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYWxsIHRoZSBzcGVjaWZpZWQgY29uZGl0aW9ucyBldmFsdWF0ZSB0byB0cnVlLCBvciByZXR1cm5zIGZhbHNlIGlmIGFueSBvbmVcbiAqICBvZiB0aGUgY29uZGl0aW9ucyBldmFsdWF0ZXMgdG8gZmFsc2UuIGBgRm46OkFuZGBgIGFjdHMgYXMgYW4gQU5EIG9wZXJhdG9yLiBUaGUgbWluaW11bSBudW1iZXIgb2ZcbiAqIGNvbmRpdGlvbnMgdGhhdCB5b3UgY2FuIGluY2x1ZGUgaXMgMiwgYW5kIHRoZSBtYXhpbXVtIGlzIDEwLlxuICovXG5jbGFzcyBGbkFuZCBleHRlbmRzIEZuQ29uZGl0aW9uQmFzZSB7XG4gIGNvbnN0cnVjdG9yKC4uLmNvbmRpdGlvbjogSUNmbkNvbmRpdGlvbkV4cHJlc3Npb25bXSkge1xuICAgIHN1cGVyKCdGbjo6QW5kJywgY29uZGl0aW9uKTtcbiAgfVxufVxuXG4vKipcbiAqIENvbXBhcmVzIGlmIHR3byB2YWx1ZXMgYXJlIGVxdWFsLiBSZXR1cm5zIHRydWUgaWYgdGhlIHR3byB2YWx1ZXMgYXJlIGVxdWFsIG9yIGZhbHNlXG4gKiBpZiB0aGV5IGFyZW4ndC5cbiAqL1xuY2xhc3MgRm5FcXVhbHMgZXh0ZW5kcyBGbkNvbmRpdGlvbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpFcXVhbHNgYCBjb25kaXRpb24gZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBsaHMgQSB2YWx1ZSBvZiBhbnkgdHlwZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSByaHMgQSB2YWx1ZSBvZiBhbnkgdHlwZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBhcmUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihsaHM6IGFueSwgcmhzOiBhbnkpIHtcbiAgICBzdXBlcignRm46OkVxdWFscycsIFtsaHMsIHJoc10pO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBvbmUgdmFsdWUgaWYgdGhlIHNwZWNpZmllZCBjb25kaXRpb24gZXZhbHVhdGVzIHRvIHRydWUgYW5kIGFub3RoZXIgdmFsdWUgaWYgdGhlXG4gKiBzcGVjaWZpZWQgY29uZGl0aW9uIGV2YWx1YXRlcyB0byBmYWxzZS4gQ3VycmVudGx5LCBBV1MgQ2xvdWRGb3JtYXRpb24gc3VwcG9ydHMgdGhlIGBgRm46OklmYGBcbiAqIGludHJpbnNpYyBmdW5jdGlvbiBpbiB0aGUgbWV0YWRhdGEgYXR0cmlidXRlLCB1cGRhdGUgcG9saWN5IGF0dHJpYnV0ZSwgYW5kIHByb3BlcnR5IHZhbHVlc1xuICogaW4gdGhlIFJlc291cmNlcyBzZWN0aW9uIGFuZCBPdXRwdXRzIHNlY3Rpb25zIG9mIGEgdGVtcGxhdGUuIFlvdSBjYW4gdXNlIHRoZSBBV1M6Ok5vVmFsdWVcbiAqIHBzZXVkbyBwYXJhbWV0ZXIgYXMgYSByZXR1cm4gdmFsdWUgdG8gcmVtb3ZlIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5LlxuICovXG5jbGFzcyBGbklmIGV4dGVuZHMgRm5Db25kaXRpb25CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBGbjo6SWZgYCBjb25kaXRpb24gZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBjb25kaXRpb24gQSByZWZlcmVuY2UgdG8gYSBjb25kaXRpb24gaW4gdGhlIENvbmRpdGlvbnMgc2VjdGlvbi4gVXNlIHRoZSBjb25kaXRpb24ncyBuYW1lIHRvIHJlZmVyZW5jZSBpdC5cbiAgICogQHBhcmFtIHZhbHVlSWZUcnVlIEEgdmFsdWUgdG8gYmUgcmV0dXJuZWQgaWYgdGhlIHNwZWNpZmllZCBjb25kaXRpb24gZXZhbHVhdGVzIHRvIHRydWUuXG4gICAqIEBwYXJhbSB2YWx1ZUlmRmFsc2UgQSB2YWx1ZSB0byBiZSByZXR1cm5lZCBpZiB0aGUgc3BlY2lmaWVkIGNvbmRpdGlvbiBldmFsdWF0ZXMgdG8gZmFsc2UuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25kaXRpb246IHN0cmluZywgdmFsdWVJZlRydWU6IGFueSwgdmFsdWVJZkZhbHNlOiBhbnkpIHtcbiAgICBzdXBlcignRm46OklmJywgW2NvbmRpdGlvbiwgdmFsdWVJZlRydWUsIHZhbHVlSWZGYWxzZV0pO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGZvciBhIGNvbmRpdGlvbiB0aGF0IGV2YWx1YXRlcyB0byBmYWxzZSBvciByZXR1cm5zIGZhbHNlIGZvciBhIGNvbmRpdGlvbiB0aGF0IGV2YWx1YXRlcyB0byB0cnVlLlxuICogYGBGbjo6Tm90YGAgYWN0cyBhcyBhIE5PVCBvcGVyYXRvci5cbiAqL1xuY2xhc3MgRm5Ob3QgZXh0ZW5kcyBGbkNvbmRpdGlvbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpOb3RgYCBjb25kaXRpb24gZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBjb25kaXRpb24gQSBjb25kaXRpb24gc3VjaCBhcyBgYEZuOjpFcXVhbHNgYCB0aGF0IGV2YWx1YXRlcyB0byB0cnVlIG9yIGZhbHNlLlxuICAgKi9cbiAgY29uc3RydWN0b3IoY29uZGl0aW9uOiBJQ2ZuQ29uZGl0aW9uRXhwcmVzc2lvbikge1xuICAgIHN1cGVyKCdGbjo6Tm90JywgW2NvbmRpdGlvbl0pO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGFueSBvbmUgb2YgdGhlIHNwZWNpZmllZCBjb25kaXRpb25zIGV2YWx1YXRlIHRvIHRydWUsIG9yIHJldHVybnMgZmFsc2UgaWZcbiAqIGFsbCBvZiB0aGUgY29uZGl0aW9ucyBldmFsdWF0ZXMgdG8gZmFsc2UuIGBgRm46Ok9yYGAgYWN0cyBhcyBhbiBPUiBvcGVyYXRvci4gVGhlIG1pbmltdW0gbnVtYmVyXG4gKiBvZiBjb25kaXRpb25zIHRoYXQgeW91IGNhbiBpbmNsdWRlIGlzIDIsIGFuZCB0aGUgbWF4aW11bSBpcyAxMC5cbiAqL1xuY2xhc3MgRm5PciBleHRlbmRzIEZuQ29uZGl0aW9uQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46Ok9yYGAgY29uZGl0aW9uIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gY29uZGl0aW9uIEEgY29uZGl0aW9uIHRoYXQgZXZhbHVhdGVzIHRvIHRydWUgb3IgZmFsc2UuXG4gICAqL1xuICBjb25zdHJ1Y3RvciguLi5jb25kaXRpb246IElDZm5Db25kaXRpb25FeHByZXNzaW9uW10pIHtcbiAgICBzdXBlcignRm46Ok9yJywgY29uZGl0aW9uKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBhIHNwZWNpZmllZCBzdHJpbmcgbWF0Y2hlcyBhdCBsZWFzdCBvbmUgdmFsdWUgaW4gYSBsaXN0IG9mIHN0cmluZ3MuXG4gKi9cbmNsYXNzIEZuQ29udGFpbnMgZXh0ZW5kcyBGbkNvbmRpdGlvbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpDb250YWluc2BgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gbGlzdE9mU3RyaW5ncyBBIGxpc3Qgb2Ygc3RyaW5ncywgc3VjaCBhcyBcIkFcIiwgXCJCXCIsIFwiQ1wiLlxuICAgKiBAcGFyYW0gdmFsdWUgQSBzdHJpbmcsIHN1Y2ggYXMgXCJBXCIsIHRoYXQgeW91IHdhbnQgdG8gY29tcGFyZSBhZ2FpbnN0IGEgbGlzdCBvZiBzdHJpbmdzLlxuICAgKi9cbiAgY29uc3RydWN0b3IobGlzdE9mU3RyaW5nczogYW55LCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoJ0ZuOjpDb250YWlucycsIFtsaXN0T2ZTdHJpbmdzLCB2YWx1ZV0pO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGEgc3BlY2lmaWVkIHN0cmluZyBtYXRjaGVzIGFsbCB2YWx1ZXMgaW4gYSBsaXN0LlxuICovXG5jbGFzcyBGbkVhY2hNZW1iZXJFcXVhbHMgZXh0ZW5kcyBGbkNvbmRpdGlvbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpFYWNoTWVtYmVyRXF1YWxzYGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBsaXN0T2ZTdHJpbmdzIEEgbGlzdCBvZiBzdHJpbmdzLCBzdWNoIGFzIFwiQVwiLCBcIkJcIiwgXCJDXCIuXG4gICAqIEBwYXJhbSB2YWx1ZSBBIHN0cmluZywgc3VjaCBhcyBcIkFcIiwgdGhhdCB5b3Ugd2FudCB0byBjb21wYXJlIGFnYWluc3QgYSBsaXN0IG9mIHN0cmluZ3MuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihsaXN0T2ZTdHJpbmdzOiBhbnksIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcignRm46OkVhY2hNZW1iZXJFcXVhbHMnLCBbbGlzdE9mU3RyaW5ncywgdmFsdWVdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBlYWNoIG1lbWJlciBpbiBhIGxpc3Qgb2Ygc3RyaW5ncyBtYXRjaGVzIGF0IGxlYXN0IG9uZSB2YWx1ZSBpbiBhIHNlY29uZFxuICogbGlzdCBvZiBzdHJpbmdzLlxuICovXG5jbGFzcyBGbkVhY2hNZW1iZXJJbiBleHRlbmRzIEZuQ29uZGl0aW9uQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OkVhY2hNZW1iZXJJbmBgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gc3RyaW5nc1RvQ2hlY2sgQSBsaXN0IG9mIHN0cmluZ3MsIHN1Y2ggYXMgXCJBXCIsIFwiQlwiLCBcIkNcIi4gQVdTIENsb3VkRm9ybWF0aW9uIGNoZWNrcyB3aGV0aGVyIGVhY2ggbWVtYmVyIGluIHRoZSBzdHJpbmdzX3RvX2NoZWNrIHBhcmFtZXRlciBpcyBpbiB0aGUgc3RyaW5nc190b19tYXRjaCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSBzdHJpbmdzVG9NYXRjaCBBIGxpc3Qgb2Ygc3RyaW5ncywgc3VjaCBhcyBcIkFcIiwgXCJCXCIsIFwiQ1wiLiBFYWNoIG1lbWJlciBpbiB0aGUgc3RyaW5nc190b19tYXRjaCBwYXJhbWV0ZXIgaXMgY29tcGFyZWQgYWdhaW5zdCB0aGUgbWVtYmVycyBvZiB0aGUgc3RyaW5nc190b19jaGVjayBwYXJhbWV0ZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzdHJpbmdzVG9DaGVjazogc3RyaW5nW10sIHN0cmluZ3NUb01hdGNoOiBzdHJpbmdbXSkge1xuICAgIHN1cGVyKCdGbjo6RWFjaE1lbWJlckluJywgW3N0cmluZ3NUb0NoZWNrLCBzdHJpbmdzVG9NYXRjaF0pO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhbGwgdmFsdWVzIGZvciBhIHNwZWNpZmllZCBwYXJhbWV0ZXIgdHlwZS5cbiAqL1xuY2xhc3MgRm5SZWZBbGwgZXh0ZW5kcyBGbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpSZWZBbGxgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIHBhcmFtZXRlclR5cGUgQW4gQVdTLXNwZWNpZmljIHBhcmFtZXRlciB0eXBlLCBzdWNoIGFzIEFXUzo6RUMyOjpTZWN1cml0eUdyb3VwOjpJZCBvclxuICAgKiAgICAgICAgICAgIEFXUzo6RUMyOjpWUEM6OklkLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFBhcmFtZXRlcnMgaW4gdGhlIEFXU1xuICAgKiAgICAgICAgICAgIENsb3VkRm9ybWF0aW9uIFVzZXIgR3VpZGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJUeXBlOiBzdHJpbmcpIHtcbiAgICBzdXBlcignRm46OlJlZkFsbCcsIHBhcmFtZXRlclR5cGUpO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBhdHRyaWJ1dGUgdmFsdWUgb3IgbGlzdCBvZiB2YWx1ZXMgZm9yIGEgc3BlY2lmaWMgcGFyYW1ldGVyIGFuZCBhdHRyaWJ1dGUuXG4gKi9cbmNsYXNzIEZuVmFsdWVPZiBleHRlbmRzIEZuQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OlZhbHVlT2ZgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIHBhcmFtZXRlck9yTG9naWNhbElkIFRoZSBuYW1lIG9mIGEgcGFyYW1ldGVyIGZvciB3aGljaCB5b3Ugd2FudCB0byByZXRyaWV2ZSBhdHRyaWJ1dGUgdmFsdWVzLiBUaGUgcGFyYW1ldGVyIG11c3QgYmUgZGVjbGFyZWQgaW4gdGhlIFBhcmFtZXRlcnMgc2VjdGlvbiBvZiB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSBhdHRyaWJ1dGUgVGhlIG5hbWUgb2YgYW4gYXR0cmlidXRlIGZyb20gd2hpY2ggeW91IHdhbnQgdG8gcmV0cmlldmUgYSB2YWx1ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmFtZXRlck9yTG9naWNhbElkOiBzdHJpbmcsIGF0dHJpYnV0ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoJ0ZuOjpWYWx1ZU9mJywgW3BhcmFtZXRlck9yTG9naWNhbElkLCBhdHRyaWJ1dGVdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgYSBsaXN0IG9mIGFsbCBhdHRyaWJ1dGUgdmFsdWVzIGZvciBhIGdpdmVuIHBhcmFtZXRlciB0eXBlIGFuZCBhdHRyaWJ1dGUuXG4gKi9cbmNsYXNzIEZuVmFsdWVPZkFsbCBleHRlbmRzIEZuQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OlZhbHVlT2ZBbGxgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIHBhcmFtZXRlclR5cGUgQW4gQVdTLXNwZWNpZmljIHBhcmFtZXRlciB0eXBlLCBzdWNoIGFzIEFXUzo6RUMyOjpTZWN1cml0eUdyb3VwOjpJZCBvciBBV1M6OkVDMjo6VlBDOjpJZC4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBQYXJhbWV0ZXJzIGluIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gVXNlciBHdWlkZS5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZSBUaGUgbmFtZSBvZiBhbiBhdHRyaWJ1dGUgZnJvbSB3aGljaCB5b3Ugd2FudCB0byByZXRyaWV2ZSBhIHZhbHVlLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBhdHRyaWJ1dGVzLCBzZWUgU3VwcG9ydGVkIEF0dHJpYnV0ZXMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJUeXBlOiBzdHJpbmcsIGF0dHJpYnV0ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoJ0ZuOjpWYWx1ZU9mQWxsJywgW3BhcmFtZXRlclR5cGUsIGF0dHJpYnV0ZV0pO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpKb2luYGAgYXBwZW5kcyBhIHNldCBvZiB2YWx1ZXMgaW50byBhIHNpbmdsZSB2YWx1ZSwgc2VwYXJhdGVkIGJ5XG4gKiB0aGUgc3BlY2lmaWVkIGRlbGltaXRlci4gSWYgYSBkZWxpbWl0ZXIgaXMgdGhlIGVtcHR5IHN0cmluZywgdGhlIHNldCBvZiB2YWx1ZXMgYXJlIGNvbmNhdGVuYXRlZFxuICogd2l0aCBubyBkZWxpbWl0ZXIuXG4gKi9cbmNsYXNzIEZuSm9pbiBpbXBsZW1lbnRzIElSZXNvbHZhYmxlIHtcbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0aW9uU3RhY2s6IHN0cmluZ1tdO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZGVsaW1pdGVyOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgbGlzdE9mVmFsdWVzOiBhbnlbXTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpKb2luYGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBkZWxpbWl0ZXIgVGhlIHZhbHVlIHlvdSB3YW50IHRvIG9jY3VyIGJldHdlZW4gZnJhZ21lbnRzLiBUaGUgZGVsaW1pdGVyIHdpbGwgb2NjdXIgYmV0d2VlbiBmcmFnbWVudHMgb25seS5cbiAgICogICAgICAgICAgSXQgd2lsbCBub3QgdGVybWluYXRlIHRoZSBmaW5hbCB2YWx1ZS5cbiAgICogQHBhcmFtIGxpc3RPZlZhbHVlcyBUaGUgbGlzdCBvZiB2YWx1ZXMgeW91IHdhbnQgY29tYmluZWQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkZWxpbWl0ZXI6IHN0cmluZywgbGlzdE9mVmFsdWVzOiBhbnlbXSkge1xuICAgIGlmIChsaXN0T2ZWYWx1ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZuSm9pbiByZXF1aXJlcyBhdCBsZWFzdCBvbmUgdmFsdWUgdG8gYmUgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLmRlbGltaXRlciA9IGRlbGltaXRlcjtcbiAgICB0aGlzLmxpc3RPZlZhbHVlcyA9IGxpc3RPZlZhbHVlcztcbiAgICB0aGlzLmNyZWF0aW9uU3RhY2sgPSBjYXB0dXJlU3RhY2tUcmFjZSgpO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoY29udGV4dDogSVJlc29sdmVDb250ZXh0KTogYW55IHtcbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHRoaXMubGlzdE9mVmFsdWVzKSkge1xuICAgICAgLy8gVGhpcyBpcyBhIGxpc3QgdG9rZW4sIGRvbid0IHRyeSB0byBkbyBzbWFydCB0aGluZ3Mgd2l0aCBpdC5cbiAgICAgIHJldHVybiB7ICdGbjo6Sm9pbic6IFt0aGlzLmRlbGltaXRlciwgdGhpcy5saXN0T2ZWYWx1ZXNdIH07XG4gICAgfVxuICAgIGNvbnN0IHJlc29sdmVkID0gdGhpcy5yZXNvbHZlVmFsdWVzKGNvbnRleHQpO1xuICAgIGlmIChyZXNvbHZlZC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiByZXNvbHZlZFswXTtcbiAgICB9XG4gICAgcmV0dXJuIHsgJ0ZuOjpKb2luJzogW3RoaXMuZGVsaW1pdGVyLCByZXNvbHZlZF0gfTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcodGhpcywgeyBkaXNwbGF5SGludDogJ0ZuOjpKb2luJyB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0b0pTT04oKSB7XG4gICAgcmV0dXJuICc8Rm46OkpvaW4+JztcbiAgfVxuXG4gIC8qKlxuICAgKiBPcHRpbWl6YXRpb246IGlmIGFuIEZuOjpKb2luIGlzIG5lc3RlZCBpbiBhbm90aGVyIG9uZSBhbmQgdGhleSBzaGFyZSB0aGUgc2FtZSBkZWxpbWl0ZXIsIHRoZW4gZmxhdHRlbiBpdCB1cC4gQWxzbyxcbiAgICogaWYgdHdvIGNvbmNhdGVuYXRlZCBlbGVtZW50cyBhcmUgbGl0ZXJhbCBzdHJpbmdzIChub3QgdG9rZW5zKSwgdGhlbiBwcmUtY29uY2F0ZW5hdGUgdGhlbSB3aXRoIHRoZSBkZWxpbWl0ZXIsIHRvXG4gICAqIGdlbmVyYXRlIHNob3J0ZXIgb3V0cHV0LlxuICAgKi9cbiAgcHJpdmF0ZSByZXNvbHZlVmFsdWVzKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCkge1xuICAgIGNvbnN0IHJlc29sdmVkVmFsdWVzID0gdGhpcy5saXN0T2ZWYWx1ZXMubWFwKHggPT4gUmVmZXJlbmNlLmlzUmVmZXJlbmNlKHgpID8geCA6IGNvbnRleHQucmVzb2x2ZSh4KSk7XG4gICAgcmV0dXJuIG1pbmltYWxDbG91ZEZvcm1hdGlvbkpvaW4odGhpcy5kZWxpbWl0ZXIsIHJlc29sdmVkVmFsdWVzKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBgRm46OlRvSnNvblN0cmluZ2AgaW50cmluc2ljIGZ1bmN0aW9uIGNvbnZlcnRzIGFuIG9iamVjdCBvciBhcnJheSB0byBpdHNcbiAqIGNvcnJlc3BvbmRpbmcgSlNPTiBzdHJpbmcuXG4gKi9cbmNsYXNzIEZuVG9Kc29uU3RyaW5nIGltcGxlbWVudHMgSVJlc29sdmFibGUge1xuICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRpb25TdGFjazogc3RyaW5nW107XG5cbiAgcHJpdmF0ZSByZWFkb25seSBvYmplY3Q6IGFueTtcblxuICBjb25zdHJ1Y3RvcihvYmplY3Q6IGFueSkge1xuICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xuICAgIHRoaXMuY3JlYXRpb25TdGFjayA9IGNhcHR1cmVTdGFja1RyYWNlKCk7XG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpOiBhbnkge1xuICAgIFN0YWNrLm9mKGNvbnRleHQuc2NvcGUpLmFkZFRyYW5zZm9ybSgnQVdTOjpMYW5ndWFnZUV4dGVuc2lvbnMnKTtcbiAgICByZXR1cm4geyAnRm46OlRvSnNvblN0cmluZyc6IHRoaXMub2JqZWN0IH07XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHRoaXMsIHsgZGlzcGxheUhpbnQ6ICdGbjo6VG9Kc29uU3RyaW5nJyB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0b0pTT04oKSB7XG4gICAgcmV0dXJuICc8Rm46OlRvSnNvblN0cmluZz4nO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgRm46Okxlbmd0aGAgcmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHdpdGhpbiBhbiBhcnJheVxuICogb3IgYW4gaW50cmluc2ljIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBhcnJheS5cbiAqL1xuY2xhc3MgRm5MZW5ndGggaW1wbGVtZW50cyBJUmVzb2x2YWJsZSB7XG4gIHB1YmxpYyByZWFkb25seSBjcmVhdGlvblN0YWNrOiBzdHJpbmdbXTtcblxuICBwcml2YXRlIHJlYWRvbmx5IGFycmF5OiBhbnk7XG5cbiAgY29uc3RydWN0b3IoYXJyYXk6IGFueSkge1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbiAgICB0aGlzLmNyZWF0aW9uU3RhY2sgPSBjYXB0dXJlU3RhY2tUcmFjZSgpO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoY29udGV4dDogSVJlc29sdmVDb250ZXh0KTogYW55IHtcbiAgICBTdGFjay5vZihjb250ZXh0LnNjb3BlKS5hZGRUcmFuc2Zvcm0oJ0FXUzo6TGFuZ3VhZ2VFeHRlbnNpb25zJyk7XG4gICAgcmV0dXJuIHsgJ0ZuOjpMZW5ndGgnOiB0aGlzLmFycmF5IH07XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHRoaXMsIHsgZGlzcGxheUhpbnQ6ICdGbjo6TGVuZ3RoJyB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0b0pTT04oKSB7XG4gICAgcmV0dXJuICc8Rm46Okxlbmd0aD4nO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9pbkdyb3Vwc09mPFQ+KGFycmF5OiBUW10sIG1heEdyb3VwOiBudW1iZXIpOiBUW11bXSB7XG4gIGNvbnN0IHJlc3VsdCA9IG5ldyBBcnJheTxUW10+KCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpICs9IG1heEdyb3VwKSB7XG4gICAgcmVzdWx0LnB1c2goYXJyYXkuc2xpY2UoaSwgaSArIG1heEdyb3VwKSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcmFuZ2UobjogbnVtYmVyKTogbnVtYmVyW10ge1xuICBjb25zdCByZXQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICByZXQucHVzaChpKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuIl19