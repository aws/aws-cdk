"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fn = void 0;
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
     * Note that it doesn't validate the logicalName, it mainly serves parameter/resource reference defined in a ``CfnInclude`` template.
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
        // short-circuit if source is not a token
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
        // short-circuit if object is not a token
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
        // short-circuit if array is not a token
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
            throw new Error(`Fn::Cidr's count attribute must be between 1 and 256, ${count} was provided.`);
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
     * Optimization: if a Fn::Join is nested in another one and they share the same delimiter, then flatten it up. Also,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWZuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLWZuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVFQUEwRTtBQUMxRSxtREFBZ0Q7QUFDaEQsMkNBQXdDO0FBRXhDLG1DQUFnQztBQUNoQywrQ0FBa0Q7QUFDbEQsbUNBQWdDO0FBRWhDLDRCQUE0QjtBQUU1Qjs7O0dBR0c7QUFDSCxNQUFhLEVBQUU7SUFDYjs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFtQjtRQUNuQyxPQUFPLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLHFCQUE2QixFQUFFLGFBQXFCO1FBQ3ZFLE9BQU8sSUFBSSxRQUFRLENBQUMscUJBQXFCLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBaUIsRUFBRSxZQUFzQjtRQUMxRCxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztTQUN0RTtRQUVELE9BQU8sSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3hELENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BMENHO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFpQixFQUFFLE1BQWMsRUFBRSxhQUFzQjtRQUMzRSx5Q0FBeUM7UUFDekMsSUFBSSxDQUFDLGFBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDL0IsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2hDO1FB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QUMsQ0FBUztJQUN0QixNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDZixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDYjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDZm5Db25kaXRpb25FeHByZXNzaW9uLCBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24gfSBmcm9tICcuL2Nmbi1jb25kaXRpb24nO1xuaW1wb3J0IHsgbWluaW1hbENsb3VkRm9ybWF0aW9uSm9pbiB9IGZyb20gJy4vcHJpdmF0ZS9jbG91ZGZvcm1hdGlvbi1sYW5nJztcbmltcG9ydCB7IEludHJpbnNpYyB9IGZyb20gJy4vcHJpdmF0ZS9pbnRyaW5zaWMnO1xuaW1wb3J0IHsgUmVmZXJlbmNlIH0gZnJvbSAnLi9yZWZlcmVuY2UnO1xuaW1wb3J0IHsgSVJlc29sdmFibGUsIElSZXNvbHZlQ29udGV4dCB9IGZyb20gJy4vcmVzb2x2YWJsZSc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHsgY2FwdHVyZVN0YWNrVHJhY2UgfSBmcm9tICcuL3N0YWNrLXRyYWNlJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi90b2tlbic7XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cblxuLyoqXG4gKiBDbG91ZEZvcm1hdGlvbiBpbnRyaW5zaWMgZnVuY3Rpb25zLlxuICogaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9pbnRyaW5zaWMtZnVuY3Rpb24tcmVmZXJlbmNlLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIEZuIHtcbiAgLyoqXG4gICAqIFRoZSBgYFJlZmBgIGludHJpbnNpYyBmdW5jdGlvbiByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIHBhcmFtZXRlciBvciByZXNvdXJjZS5cbiAgICogTm90ZSB0aGF0IGl0IGRvZXNuJ3QgdmFsaWRhdGUgdGhlIGxvZ2ljYWxOYW1lLCBpdCBtYWlubHkgc2VydmVzIHBhcmFtZXRlci9yZXNvdXJjZSByZWZlcmVuY2UgZGVmaW5lZCBpbiBhIGBgQ2ZuSW5jbHVkZWBgIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gbG9naWNhbE5hbWUgVGhlIGxvZ2ljYWwgbmFtZSBvZiBhIHBhcmFtZXRlci9yZXNvdXJjZSBmb3Igd2hpY2ggeW91IHdhbnQgdG8gcmV0cmlldmUgaXRzIHZhbHVlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWYobG9naWNhbE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBGblJlZihsb2dpY2FsTmFtZSkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYGBGbjo6R2V0QXR0YGAgaW50cmluc2ljIGZ1bmN0aW9uIHJldHVybnMgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZVxuICAgKiBmcm9tIGEgcmVzb3VyY2UgaW4gdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gbG9naWNhbE5hbWVPZlJlc291cmNlIFRoZSBsb2dpY2FsIG5hbWUgKGFsc28gY2FsbGVkIGxvZ2ljYWwgSUQpIG9mXG4gICAqIHRoZSByZXNvdXJjZSB0aGF0IGNvbnRhaW5zIHRoZSBhdHRyaWJ1dGUgdGhhdCB5b3Ugd2FudC5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZU5hbWUgVGhlIG5hbWUgb2YgdGhlIHJlc291cmNlLXNwZWNpZmljIGF0dHJpYnV0ZSB3aG9zZVxuICAgKiB2YWx1ZSB5b3Ugd2FudC4gU2VlIHRoZSByZXNvdXJjZSdzIHJlZmVyZW5jZSBwYWdlIGZvciBkZXRhaWxzIGFib3V0IHRoZVxuICAgKiBhdHRyaWJ1dGVzIGF2YWlsYWJsZSBmb3IgdGhhdCByZXNvdXJjZSB0eXBlLlxuICAgKiBAcmV0dXJucyBhbiBJUmVzb2x2YWJsZSBvYmplY3RcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0QXR0KGxvZ2ljYWxOYW1lT2ZSZXNvdXJjZTogc3RyaW5nLCBhdHRyaWJ1dGVOYW1lOiBzdHJpbmcpOiBJUmVzb2x2YWJsZSB7XG4gICAgcmV0dXJuIG5ldyBGbkdldEF0dChsb2dpY2FsTmFtZU9mUmVzb3VyY2UsIGF0dHJpYnV0ZU5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6Sm9pbmBgIGFwcGVuZHMgYSBzZXQgb2YgdmFsdWVzIGludG8gYSBzaW5nbGVcbiAgICogdmFsdWUsIHNlcGFyYXRlZCBieSB0aGUgc3BlY2lmaWVkIGRlbGltaXRlci4gSWYgYSBkZWxpbWl0ZXIgaXMgdGhlIGVtcHR5XG4gICAqIHN0cmluZywgdGhlIHNldCBvZiB2YWx1ZXMgYXJlIGNvbmNhdGVuYXRlZCB3aXRoIG5vIGRlbGltaXRlci5cbiAgICogQHBhcmFtIGRlbGltaXRlciBUaGUgdmFsdWUgeW91IHdhbnQgdG8gb2NjdXIgYmV0d2VlbiBmcmFnbWVudHMuIFRoZVxuICAgKiBkZWxpbWl0ZXIgd2lsbCBvY2N1ciBiZXR3ZWVuIGZyYWdtZW50cyBvbmx5LiBJdCB3aWxsIG5vdCB0ZXJtaW5hdGUgdGhlXG4gICAqIGZpbmFsIHZhbHVlLlxuICAgKiBAcGFyYW0gbGlzdE9mVmFsdWVzIFRoZSBsaXN0IG9mIHZhbHVlcyB5b3Ugd2FudCBjb21iaW5lZC5cbiAgICogQHJldHVybnMgYSB0b2tlbiByZXByZXNlbnRlZCBhcyBhIHN0cmluZ1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBqb2luKGRlbGltaXRlcjogc3RyaW5nLCBsaXN0T2ZWYWx1ZXM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICBpZiAobGlzdE9mVmFsdWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGbkpvaW4gcmVxdWlyZXMgYXQgbGVhc3Qgb25lIHZhbHVlIHRvIGJlIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBGbkpvaW4oZGVsaW1pdGVyLCBsaXN0T2ZWYWx1ZXMpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogU3BsaXQgYSBzdHJpbmcgdG9rZW4gaW50byBhIHRva2VuIGxpc3Qgb2Ygc3RyaW5nIHZhbHVlcy5cbiAgICpcbiAgICogU3BlY2lmeSB0aGUgbG9jYXRpb24gb2Ygc3BsaXRzIHdpdGggYSBkZWxpbWl0ZXIgc3VjaCBhcyAnLCcgKGEgY29tbWEpLlxuICAgKiBSZW5kZXJzIHRvIHRoZSBgRm46OlNwbGl0YCBpbnRyaW5zaWMgZnVuY3Rpb24uXG4gICAqXG4gICAqIExpc3RzIHdpdGggdW5rbm93biBsZW5ndGhzIChkZWZhdWx0KVxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqXG4gICAqIFNpbmNlIHRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byB3b3JrIHdpdGggZGVwbG95LXRpbWUgdmFsdWVzLCBpZiBgYXNzdW1lZExlbmd0aGBcbiAgICogaXMgbm90IGdpdmVuIHRoZSBDREsgY2Fubm90IGtub3cgdGhlIGxlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIGxpc3QgYXQgc3ludGhlc2lzIHRpbWUuXG4gICAqIFRoaXMgYnJpbmdzIHRoZSBmb2xsb3dpbmcgcmVzdHJpY3Rpb25zOlxuICAgKlxuICAgKiAtIFlvdSBtdXN0IHVzZSBgRm4uc2VsZWN0KGksIGxpc3QpYCB0byBwaWNrIGVsZW1lbnRzIG91dCBvZiB0aGUgbGlzdCAoeW91IG11c3Qgbm90IHVzZVxuICAgKiAgIGBsaXN0W2ldYCkuXG4gICAqIC0gWW91IGNhbm5vdCBhZGQgZWxlbWVudHMgdG8gdGhlIGxpc3QsIHJlbW92ZSBlbGVtZW50cyBmcm9tIHRoZSBsaXN0LFxuICAgKiAgIGNvbWJpbmUgdHdvIHN1Y2ggbGlzdHMgdG9nZXRoZXIsIG9yIHRha2UgYSBzbGljZSBvZiB0aGUgbGlzdC5cbiAgICogLSBZb3UgY2Fubm90IHBhc3MgdGhlIGxpc3QgdG8gY29uc3RydWN0cyB0aGF0IGRvIGFueSBvZiB0aGUgYWJvdmUuXG4gICAqXG4gICAqIFRoZSBvbmx5IHZhbGlkIG9wZXJhdGlvbiB3aXRoIHN1Y2ggYSB0b2tlbml6ZWQgbGlzdCBpcyB0byBwYXNzIGl0IHVubW9kaWZpZWQgdG8gYVxuICAgKiBDbG91ZEZvcm1hdGlvbiBSZXNvdXJjZSBjb25zdHJ1Y3QuXG4gICAqXG4gICAqIExpc3RzIHdpdGggYXNzdW1lZCBsZW5ndGhzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqXG4gICAqIFBhc3MgYGFzc3VtZWRMZW5ndGhgIGlmIHlvdSBrbm93IHRoZSBsZW5ndGggb2YgdGhlIGxpc3QgdGhhdCB3aWxsIGJlXG4gICAqIHByb2R1Y2VkIGJ5IHNwbGl0dGluZy4gVGhlIGFjdHVhbCBsaXN0IGxlbmd0aCBhdCBkZXBsb3kgdGltZSBtYXkgYmVcbiAgICogKmxvbmdlciogdGhhbiB0aGUgbnVtYmVyIHlvdSBwYXNzLCBidXQgbm90ICpzaG9ydGVyKi5cbiAgICpcbiAgICogVGhlIHJldHVybmVkIGxpc3Qgd2lsbCBsb29rIGxpa2U6XG4gICAqXG4gICAqIGBgYFxuICAgKiBbRm4uc2VsZWN0KDAsIHNwbGl0KSwgRm4uc2VsZWN0KDEsIHNwbGl0KSwgRm4uc2VsZWN0KDIsIHNwbGl0KSwgLi4uXVxuICAgKiBgYGBcbiAgICpcbiAgICogVGhlIHJlc3RyaWN0aW9ucyBmcm9tIHRoZSBzZWN0aW9uIFwiTGlzdHMgd2l0aCB1bmtub3duIGxlbmd0aHNcIiB3aWxsIG5vdyBiZSBsaWZ0ZWQsXG4gICAqIGF0IHRoZSBleHBlbnNlIG9mIGhhdmluZyB0byBrbm93IGFuZCBmaXggdGhlIGxlbmd0aCBvZiB0aGUgbGlzdC5cbiAgICpcbiAgICogQHBhcmFtIGRlbGltaXRlciBBIHN0cmluZyB2YWx1ZSB0aGF0IGRldGVybWluZXMgd2hlcmUgdGhlIHNvdXJjZSBzdHJpbmcgaXMgZGl2aWRlZC5cbiAgICogQHBhcmFtIHNvdXJjZSBUaGUgc3RyaW5nIHZhbHVlIHRoYXQgeW91IHdhbnQgdG8gc3BsaXQuXG4gICAqIEBwYXJhbSBhc3N1bWVkTGVuZ3RoIFRoZSBsZW5ndGggb2YgdGhlIGxpc3QgdGhhdCB3aWxsIGJlIHByb2R1Y2VkIGJ5IHNwbGl0dGluZ1xuICAgKiBAcmV0dXJucyBhIHRva2VuIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nIGFycmF5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNwbGl0KGRlbGltaXRlcjogc3RyaW5nLCBzb3VyY2U6IHN0cmluZywgYXNzdW1lZExlbmd0aD86IG51bWJlcik6IHN0cmluZ1tdIHtcbiAgICAvLyBzaG9ydC1jaXJjdWl0IGlmIHNvdXJjZSBpcyBub3QgYSB0b2tlblxuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBzb3VyY2Uuc3BsaXQoZGVsaW1pdGVyKTtcbiAgICB9XG5cbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGRlbGltaXRlcikpIHtcbiAgICAgIC8vIExpbWl0YXRpb24gb2YgQ2xvdWRGb3JtYXRpb25cbiAgICAgIHRocm93IG5ldyBFcnJvcignRm4uc3BsaXQ6IFxcJ2RlbGltaXRlclxcJyBtYXkgbm90IGJlIGEgdG9rZW4gdmFsdWUnKTtcbiAgICB9XG5cbiAgICBjb25zdCBzcGxpdCA9IFRva2VuLmFzTGlzdChuZXcgRm5TcGxpdChkZWxpbWl0ZXIsIHNvdXJjZSkpO1xuICAgIGlmIChhc3N1bWVkTGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBzcGxpdDtcbiAgICB9XG5cbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGFzc3VtZWRMZW5ndGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZuLnNwbGl0OiBcXCdhc3N1bWVkTGVuZ3RoXFwnIG1heSBub3QgYmUgYSB0b2tlbiB2YWx1ZScpO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZShhc3N1bWVkTGVuZ3RoKS5tYXAoaSA9PiBGbi5zZWxlY3QoaSwgc3BsaXQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OlNlbGVjdGBgIHJldHVybnMgYSBzaW5nbGUgb2JqZWN0IGZyb20gYSBsaXN0IG9mIG9iamVjdHMgYnkgaW5kZXguXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG9iamVjdCB0byByZXRyaWV2ZS4gVGhpcyBtdXN0IGJlIGEgdmFsdWUgZnJvbSB6ZXJvIHRvIE4tMSwgd2hlcmUgTiByZXByZXNlbnRzIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGFycmF5LlxuICAgKiBAcGFyYW0gYXJyYXkgVGhlIGxpc3Qgb2Ygb2JqZWN0cyB0byBzZWxlY3QgZnJvbS4gVGhpcyBsaXN0IG11c3Qgbm90IGJlIG51bGwsIG5vciBjYW4gaXQgaGF2ZSBudWxsIGVudHJpZXMuXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc2VsZWN0KGluZGV4OiBudW1iZXIsIGFycmF5OiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoaW5kZXgpICYmICFUb2tlbi5pc1VucmVzb2x2ZWQoYXJyYXkpICYmICFhcnJheS5zb21lKFRva2VuLmlzVW5yZXNvbHZlZCkpIHtcbiAgICAgIHJldHVybiBhcnJheVtpbmRleF07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBGblNlbGVjdChpbmRleCwgYXJyYXkpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpTdWJgYCBzdWJzdGl0dXRlcyB2YXJpYWJsZXMgaW4gYW4gaW5wdXQgc3RyaW5nXG4gICAqIHdpdGggdmFsdWVzIHRoYXQgeW91IHNwZWNpZnkuIEluIHlvdXIgdGVtcGxhdGVzLCB5b3UgY2FuIHVzZSB0aGlzIGZ1bmN0aW9uXG4gICAqIHRvIGNvbnN0cnVjdCBjb21tYW5kcyBvciBvdXRwdXRzIHRoYXQgaW5jbHVkZSB2YWx1ZXMgdGhhdCBhcmVuJ3QgYXZhaWxhYmxlXG4gICAqIHVudGlsIHlvdSBjcmVhdGUgb3IgdXBkYXRlIGEgc3RhY2suXG4gICAqIEBwYXJhbSBib2R5IEEgc3RyaW5nIHdpdGggdmFyaWFibGVzIHRoYXQgQVdTIENsb3VkRm9ybWF0aW9uIHN1YnN0aXR1dGVzXG4gICAqIHdpdGggdGhlaXIgYXNzb2NpYXRlZCB2YWx1ZXMgYXQgcnVudGltZS4gV3JpdGUgdmFyaWFibGVzIGFzICR7TXlWYXJOYW1lfS5cbiAgICogVmFyaWFibGVzIGNhbiBiZSB0ZW1wbGF0ZSBwYXJhbWV0ZXIgbmFtZXMsIHJlc291cmNlIGxvZ2ljYWwgSURzLCByZXNvdXJjZVxuICAgKiBhdHRyaWJ1dGVzLCBvciBhIHZhcmlhYmxlIGluIGEga2V5LXZhbHVlIG1hcC4gSWYgeW91IHNwZWNpZnkgb25seSB0ZW1wbGF0ZVxuICAgKiBwYXJhbWV0ZXIgbmFtZXMsIHJlc291cmNlIGxvZ2ljYWwgSURzLCBhbmQgcmVzb3VyY2UgYXR0cmlidXRlcywgZG9uJ3RcbiAgICogc3BlY2lmeSBhIGtleS12YWx1ZSBtYXAuXG4gICAqIEBwYXJhbSB2YXJpYWJsZXMgVGhlIG5hbWUgb2YgYSB2YXJpYWJsZSB0aGF0IHlvdSBpbmNsdWRlZCBpbiB0aGUgU3RyaW5nXG4gICAqIHBhcmFtZXRlci4gVGhlIHZhbHVlIHRoYXQgQVdTIENsb3VkRm9ybWF0aW9uIHN1YnN0aXR1dGVzIGZvciB0aGUgYXNzb2NpYXRlZFxuICAgKiB2YXJpYWJsZSBuYW1lIGF0IHJ1bnRpbWUuXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc3ViKGJvZHk6IHN0cmluZywgdmFyaWFibGVzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBGblN1Yihib2R5LCB2YXJpYWJsZXMpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpCYXNlNjRgYCByZXR1cm5zIHRoZSBCYXNlNjQgcmVwcmVzZW50YXRpb24gb2ZcbiAgICogdGhlIGlucHV0IHN0cmluZy4gVGhpcyBmdW5jdGlvbiBpcyB0eXBpY2FsbHkgdXNlZCB0byBwYXNzIGVuY29kZWQgZGF0YSB0b1xuICAgKiBBbWF6b24gRUMyIGluc3RhbmNlcyBieSB3YXkgb2YgdGhlIFVzZXJEYXRhIHByb3BlcnR5LlxuICAgKiBAcGFyYW0gZGF0YSBUaGUgc3RyaW5nIHZhbHVlIHlvdSB3YW50IHRvIGNvbnZlcnQgdG8gQmFzZTY0LlxuICAgKiBAcmV0dXJucyBhIHRva2VuIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGJhc2U2NChkYXRhOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgRm5CYXNlNjQoZGF0YSkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OkNpZHJgYCByZXR1cm5zIHRoZSBzcGVjaWZpZWQgQ2lkciBhZGRyZXNzIGJsb2NrLlxuICAgKiBAcGFyYW0gaXBCbG9jayAgVGhlIHVzZXItc3BlY2lmaWVkIGRlZmF1bHQgQ2lkciBhZGRyZXNzIGJsb2NrLlxuICAgKiBAcGFyYW0gY291bnQgIFRoZSBudW1iZXIgb2Ygc3VibmV0cycgQ2lkciBibG9jayB3YW50ZWQuIENvdW50IGNhbiBiZSAxIHRvIDI1Ni5cbiAgICogQHBhcmFtIHNpemVNYXNrIFRoZSBkaWdpdCBjb3ZlcmVkIGluIHRoZSBzdWJuZXQuXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY2lkcihpcEJsb2NrOiBzdHJpbmcsIGNvdW50OiBudW1iZXIsIHNpemVNYXNrPzogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBUb2tlbi5hc0xpc3QobmV3IEZuQ2lkcihpcEJsb2NrLCBjb3VudCwgc2l6ZU1hc2spKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhbiB1cmwsIHBhcnNlIHRoZSBkb21haW4gbmFtZVxuICAgKiBAcGFyYW0gdXJsIHRoZSB1cmwgdG8gcGFyc2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGFyc2VEb21haW5OYW1lKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBub0h0dHBzID0gRm4uc2VsZWN0KDEsIEZuLnNwbGl0KCcvLycsIHVybCkpO1xuICAgIHJldHVybiBGbi5zZWxlY3QoMCwgRm4uc3BsaXQoJy8nLCBub0h0dHBzKSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpHZXRBWnNgYCByZXR1cm5zIGFuIGFycmF5IHRoYXQgbGlzdHNcbiAgICogQXZhaWxhYmlsaXR5IFpvbmVzIGZvciBhIHNwZWNpZmllZCByZWdpb24uIEJlY2F1c2UgY3VzdG9tZXJzIGhhdmUgYWNjZXNzIHRvXG4gICAqIGRpZmZlcmVudCBBdmFpbGFiaWxpdHkgWm9uZXMsIHRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6R2V0QVpzYGAgZW5hYmxlc1xuICAgKiB0ZW1wbGF0ZSBhdXRob3JzIHRvIHdyaXRlIHRlbXBsYXRlcyB0aGF0IGFkYXB0IHRvIHRoZSBjYWxsaW5nIHVzZXInc1xuICAgKiBhY2Nlc3MuIFRoYXQgd2F5IHlvdSBkb24ndCBoYXZlIHRvIGhhcmQtY29kZSBhIGZ1bGwgbGlzdCBvZiBBdmFpbGFiaWxpdHlcbiAgICogWm9uZXMgZm9yIGEgc3BlY2lmaWVkIHJlZ2lvbi5cbiAgICogQHBhcmFtIHJlZ2lvbiBUaGUgbmFtZSBvZiB0aGUgcmVnaW9uIGZvciB3aGljaCB5b3Ugd2FudCB0byBnZXQgdGhlXG4gICAqIEF2YWlsYWJpbGl0eSBab25lcy4gWW91IGNhbiB1c2UgdGhlIEFXUzo6UmVnaW9uIHBzZXVkbyBwYXJhbWV0ZXIgdG8gc3BlY2lmeVxuICAgKiB0aGUgcmVnaW9uIGluIHdoaWNoIHRoZSBzdGFjayBpcyBjcmVhdGVkLiBTcGVjaWZ5aW5nIGFuIGVtcHR5IHN0cmluZyBpc1xuICAgKiBlcXVpdmFsZW50IHRvIHNwZWNpZnlpbmcgQVdTOjpSZWdpb24uXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmcgYXJyYXlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0QXpzKHJlZ2lvbj86IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gVG9rZW4uYXNMaXN0KG5ldyBGbkdldEFacyhyZWdpb24pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OkltcG9ydFZhbHVlYGAgcmV0dXJucyB0aGUgdmFsdWUgb2YgYW4gb3V0cHV0XG4gICAqIGV4cG9ydGVkIGJ5IGFub3RoZXIgc3RhY2suIFlvdSB0eXBpY2FsbHkgdXNlIHRoaXMgZnVuY3Rpb24gdG8gY3JlYXRlXG4gICAqIGNyb3NzLXN0YWNrIHJlZmVyZW5jZXMuIEluIHRoZSBmb2xsb3dpbmcgZXhhbXBsZSB0ZW1wbGF0ZSBzbmlwcGV0cywgU3RhY2sgQVxuICAgKiBleHBvcnRzIFZQQyBzZWN1cml0eSBncm91cCB2YWx1ZXMgYW5kIFN0YWNrIEIgaW1wb3J0cyB0aGVtLlxuICAgKiBAcGFyYW0gc2hhcmVkVmFsdWVUb0ltcG9ydCBUaGUgc3RhY2sgb3V0cHV0IHZhbHVlIHRoYXQgeW91IHdhbnQgdG8gaW1wb3J0LlxuICAgKiBAcmV0dXJucyBhIHRva2VuIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGltcG9ydFZhbHVlKHNoYXJlZFZhbHVlVG9JbXBvcnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBGbkltcG9ydFZhbHVlKHNoYXJlZFZhbHVlVG9JbXBvcnQpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogTGlrZSBgRm4uaW1wb3J0VmFsdWVgLCBidXQgaW1wb3J0IGEgbGlzdCB3aXRoIGEga25vd24gbGVuZ3RoXG4gICAqXG4gICAqIElmIHlvdSBleHBsaWNpdGx5IHdhbnQgYSBsaXN0IHdpdGggYW4gdW5rbm93biBsZW5ndGgsIGNhbGwgYEZuLnNwbGl0KCcsJyxcbiAgICogRm4uaW1wb3J0VmFsdWUoZXhwb3J0TmFtZSkpYC4gU2VlIHRoZSBkb2N1bWVudGF0aW9uIG9mIGBGbi5zcGxpdGAgdG8gcmVhZFxuICAgKiBtb3JlIGFib3V0IHRoZSBsaW1pdGF0aW9ucyBvZiB1c2luZyBsaXN0cyBvZiB1bmtub3duIGxlbmd0aC5cbiAgICpcbiAgICogYEZuLmltcG9ydExpc3RWYWx1ZShleHBvcnROYW1lLCBhc3N1bWVkTGVuZ3RoKWAgaXMgdGhlIHNhbWUgYXNcbiAgICogYEZuLnNwbGl0KCcsJywgRm4uaW1wb3J0VmFsdWUoZXhwb3J0TmFtZSksIGFzc3VtZWRMZW5ndGgpYCxcbiAgICogYnV0IGVhc2llciB0byByZWFkIGFuZCBpbXBvc3NpYmxlIHRvIGZvcmdldCB0byBwYXNzIGBhc3N1bWVkTGVuZ3RoYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaW1wb3J0TGlzdFZhbHVlKHNoYXJlZFZhbHVlVG9JbXBvcnQ6IHN0cmluZywgYXNzdW1lZExlbmd0aDogbnVtYmVyLCBkZWxpbWl0ZXIgPSAnLCcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIEZuLnNwbGl0KGRlbGltaXRlciwgRm4uaW1wb3J0VmFsdWUoc2hhcmVkVmFsdWVUb0ltcG9ydCksIGFzc3VtZWRMZW5ndGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6RmluZEluTWFwYGAgcmV0dXJucyB0aGUgdmFsdWUgY29ycmVzcG9uZGluZyB0b1xuICAgKiBrZXlzIGluIGEgdHdvLWxldmVsIG1hcCB0aGF0IGlzIGRlY2xhcmVkIGluIHRoZSBNYXBwaW5ncyBzZWN0aW9uLlxuICAgKiBAcmV0dXJucyBhIHRva2VuIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZpbmRJbk1hcChtYXBOYW1lOiBzdHJpbmcsIHRvcExldmVsS2V5OiBzdHJpbmcsIHNlY29uZExldmVsS2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBGbi5fZmluZEluTWFwKG1hcE5hbWUsIHRvcExldmVsS2V5LCBzZWNvbmRMZXZlbEtleSkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBhZGRpdGlvbmFsIGZ1bmN0aW9uIHVzZWQgaW4gQ2ZuUGFyc2VyLFxuICAgKiBhcyBGbjo6RmluZEluTWFwIGRvZXMgbm90IGFsd2F5cyByZXR1cm4gYSBzdHJpbmcuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBfZmluZEluTWFwKG1hcE5hbWU6IHN0cmluZywgdG9wTGV2ZWxLZXk6IHN0cmluZywgc2Vjb25kTGV2ZWxLZXk6IHN0cmluZyk6IElSZXNvbHZhYmxlIHtcbiAgICByZXR1cm4gbmV3IEZuRmluZEluTWFwKG1hcE5hbWUsIHRvcExldmVsS2V5LCBzZWNvbmRMZXZlbEtleSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHRva2VuIHJlcHJlc2VudGluZyB0aGUgYGBGbjo6VHJhbnNmb3JtYGAgZXhwcmVzc2lvblxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2ludHJpbnNpYy1mdW5jdGlvbi1yZWZlcmVuY2UtdHJhbnNmb3JtLmh0bWxcbiAgICogQHBhcmFtIG1hY3JvTmFtZSBUaGUgbmFtZSBvZiB0aGUgbWFjcm8gdG8gcGVyZm9ybSB0aGUgcHJvY2Vzc2luZ1xuICAgKiBAcGFyYW0gcGFyYW1ldGVycyBUaGUgcGFyYW1ldGVycyB0byBiZSBwYXNzZWQgdG8gdGhlIG1hY3JvXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50aW5nIHRoZSB0cmFuc2Zvcm0gZXhwcmVzc2lvblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB0cmFuc2Zvcm0obWFjcm9OYW1lOiBzdHJpbmcsIHBhcmFtZXRlcnM6IHsgW25hbWU6IHN0cmluZ106IGFueSB9KTogSVJlc29sdmFibGUge1xuICAgIHJldHVybiBuZXcgRm5UcmFuc2Zvcm0obWFjcm9OYW1lLCBwYXJhbWV0ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgYWxsIHRoZSBzcGVjaWZpZWQgY29uZGl0aW9ucyBldmFsdWF0ZSB0byB0cnVlLCBvciByZXR1cm5zXG4gICAqIGZhbHNlIGlmIGFueSBvbmUgb2YgdGhlIGNvbmRpdGlvbnMgZXZhbHVhdGVzIHRvIGZhbHNlLiBgYEZuOjpBbmRgYCBhY3RzIGFzXG4gICAqIGFuIEFORCBvcGVyYXRvci4gVGhlIG1pbmltdW0gbnVtYmVyIG9mIGNvbmRpdGlvbnMgdGhhdCB5b3UgY2FuIGluY2x1ZGUgaXNcbiAgICogMS5cbiAgICogQHBhcmFtIGNvbmRpdGlvbnMgY29uZGl0aW9ucyB0byBBTkRcbiAgICogQHJldHVybnMgYW4gRm5Db25kaXRpb24gdG9rZW5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29uZGl0aW9uQW5kKC4uLmNvbmRpdGlvbnM6IElDZm5Db25kaXRpb25FeHByZXNzaW9uW10pOiBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24ge1xuICAgIGlmIChjb25kaXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGbi5jb25kaXRpb25BbmQoKSBuZWVkcyBhdCBsZWFzdCBvbmUgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgaWYgKGNvbmRpdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gY29uZGl0aW9uc1swXSBhcyBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb247XG4gICAgfVxuICAgIHJldHVybiBGbi5jb25kaXRpb25BbmQoLi4uX2luR3JvdXBzT2YoY29uZGl0aW9ucywgMTApLm1hcChncm91cCA9PiBuZXcgRm5BbmQoLi4uZ3JvdXApKSk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGFyZXMgaWYgdHdvIHZhbHVlcyBhcmUgZXF1YWwuIFJldHVybnMgdHJ1ZSBpZiB0aGUgdHdvIHZhbHVlcyBhcmUgZXF1YWxcbiAgICogb3IgZmFsc2UgaWYgdGhleSBhcmVuJ3QuXG4gICAqIEBwYXJhbSBsaHMgQSB2YWx1ZSBvZiBhbnkgdHlwZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSByaHMgQSB2YWx1ZSBvZiBhbnkgdHlwZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBhcmUuXG4gICAqIEByZXR1cm5zIGFuIEZuQ29uZGl0aW9uIHRva2VuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbmRpdGlvbkVxdWFscyhsaHM6IGFueSwgcmhzOiBhbnkpOiBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24ge1xuICAgIHJldHVybiBuZXcgRm5FcXVhbHMobGhzLCByaHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgb25lIHZhbHVlIGlmIHRoZSBzcGVjaWZpZWQgY29uZGl0aW9uIGV2YWx1YXRlcyB0byB0cnVlIGFuZCBhbm90aGVyXG4gICAqIHZhbHVlIGlmIHRoZSBzcGVjaWZpZWQgY29uZGl0aW9uIGV2YWx1YXRlcyB0byBmYWxzZS4gQ3VycmVudGx5LCBBV1NcbiAgICogQ2xvdWRGb3JtYXRpb24gc3VwcG9ydHMgdGhlIGBgRm46OklmYGAgaW50cmluc2ljIGZ1bmN0aW9uIGluIHRoZSBtZXRhZGF0YVxuICAgKiBhdHRyaWJ1dGUsIHVwZGF0ZSBwb2xpY3kgYXR0cmlidXRlLCBhbmQgcHJvcGVydHkgdmFsdWVzIGluIHRoZSBSZXNvdXJjZXNcbiAgICogc2VjdGlvbiBhbmQgT3V0cHV0cyBzZWN0aW9ucyBvZiBhIHRlbXBsYXRlLiBZb3UgY2FuIHVzZSB0aGUgQVdTOjpOb1ZhbHVlXG4gICAqIHBzZXVkbyBwYXJhbWV0ZXIgYXMgYSByZXR1cm4gdmFsdWUgdG8gcmVtb3ZlIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5LlxuICAgKiBAcGFyYW0gY29uZGl0aW9uSWQgQSByZWZlcmVuY2UgdG8gYSBjb25kaXRpb24gaW4gdGhlIENvbmRpdGlvbnMgc2VjdGlvbi4gVXNlXG4gICAqIHRoZSBjb25kaXRpb24ncyBuYW1lIHRvIHJlZmVyZW5jZSBpdC5cbiAgICogQHBhcmFtIHZhbHVlSWZUcnVlIEEgdmFsdWUgdG8gYmUgcmV0dXJuZWQgaWYgdGhlIHNwZWNpZmllZCBjb25kaXRpb25cbiAgICogZXZhbHVhdGVzIHRvIHRydWUuXG4gICAqIEBwYXJhbSB2YWx1ZUlmRmFsc2UgQSB2YWx1ZSB0byBiZSByZXR1cm5lZCBpZiB0aGUgc3BlY2lmaWVkIGNvbmRpdGlvblxuICAgKiBldmFsdWF0ZXMgdG8gZmFsc2UuXG4gICAqIEByZXR1cm5zIGFuIEZuQ29uZGl0aW9uIHRva2VuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbmRpdGlvbklmKGNvbmRpdGlvbklkOiBzdHJpbmcsIHZhbHVlSWZUcnVlOiBhbnksIHZhbHVlSWZGYWxzZTogYW55KTogSUNmblJ1bGVDb25kaXRpb25FeHByZXNzaW9uIHtcbiAgICByZXR1cm4gbmV3IEZuSWYoY29uZGl0aW9uSWQsIHZhbHVlSWZUcnVlLCB2YWx1ZUlmRmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBmb3IgYSBjb25kaXRpb24gdGhhdCBldmFsdWF0ZXMgdG8gZmFsc2Ugb3IgcmV0dXJucyBmYWxzZSBmb3IgYVxuICAgKiBjb25kaXRpb24gdGhhdCBldmFsdWF0ZXMgdG8gdHJ1ZS4gYGBGbjo6Tm90YGAgYWN0cyBhcyBhIE5PVCBvcGVyYXRvci5cbiAgICogQHBhcmFtIGNvbmRpdGlvbiBBIGNvbmRpdGlvbiBzdWNoIGFzIGBgRm46OkVxdWFsc2BgIHRoYXQgZXZhbHVhdGVzIHRvIHRydWVcbiAgICogb3IgZmFsc2UuXG4gICAqIEByZXR1cm5zIGFuIEZuQ29uZGl0aW9uIHRva2VuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbmRpdGlvbk5vdChjb25kaXRpb246IElDZm5Db25kaXRpb25FeHByZXNzaW9uKTogSUNmblJ1bGVDb25kaXRpb25FeHByZXNzaW9uIHtcbiAgICByZXR1cm4gbmV3IEZuTm90KGNvbmRpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGFueSBvbmUgb2YgdGhlIHNwZWNpZmllZCBjb25kaXRpb25zIGV2YWx1YXRlIHRvIHRydWUsIG9yXG4gICAqIHJldHVybnMgZmFsc2UgaWYgYWxsIG9mIHRoZSBjb25kaXRpb25zIGV2YWx1YXRlcyB0byBmYWxzZS4gYGBGbjo6T3JgYCBhY3RzXG4gICAqIGFzIGFuIE9SIG9wZXJhdG9yLiBUaGUgbWluaW11bSBudW1iZXIgb2YgY29uZGl0aW9ucyB0aGF0IHlvdSBjYW4gaW5jbHVkZSBpc1xuICAgKiAxLlxuICAgKiBAcGFyYW0gY29uZGl0aW9ucyBjb25kaXRpb25zIHRoYXQgZXZhbHVhdGVzIHRvIHRydWUgb3IgZmFsc2UuXG4gICAqIEByZXR1cm5zIGFuIEZuQ29uZGl0aW9uIHRva2VuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbmRpdGlvbk9yKC4uLmNvbmRpdGlvbnM6IElDZm5Db25kaXRpb25FeHByZXNzaW9uW10pOiBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24ge1xuICAgIGlmIChjb25kaXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGbi5jb25kaXRpb25PcigpIG5lZWRzIGF0IGxlYXN0IG9uZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoY29uZGl0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBjb25kaXRpb25zWzBdIGFzIElDZm5SdWxlQ29uZGl0aW9uRXhwcmVzc2lvbjtcbiAgICB9XG4gICAgcmV0dXJuIEZuLmNvbmRpdGlvbk9yKC4uLl9pbkdyb3Vwc09mKGNvbmRpdGlvbnMsIDEwKS5tYXAoZ3JvdXAgPT4gbmV3IEZuT3IoLi4uZ3JvdXApKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGEgc3BlY2lmaWVkIHN0cmluZyBtYXRjaGVzIGF0IGxlYXN0IG9uZSB2YWx1ZSBpbiBhIGxpc3Qgb2ZcbiAgICogc3RyaW5ncy5cbiAgICogQHBhcmFtIGxpc3RPZlN0cmluZ3MgQSBsaXN0IG9mIHN0cmluZ3MsIHN1Y2ggYXMgXCJBXCIsIFwiQlwiLCBcIkNcIi5cbiAgICogQHBhcmFtIHZhbHVlIEEgc3RyaW5nLCBzdWNoIGFzIFwiQVwiLCB0aGF0IHlvdSB3YW50IHRvIGNvbXBhcmUgYWdhaW5zdCBhIGxpc3Qgb2Ygc3RyaW5ncy5cbiAgICogQHJldHVybnMgYW4gRm5Db25kaXRpb24gdG9rZW5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29uZGl0aW9uQ29udGFpbnMobGlzdE9mU3RyaW5nczogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpOiBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24ge1xuICAgIHJldHVybiBuZXcgRm5Db250YWlucyhsaXN0T2ZTdHJpbmdzLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGEgc3BlY2lmaWVkIHN0cmluZyBtYXRjaGVzIGFsbCB2YWx1ZXMgaW4gYSBsaXN0LlxuICAgKiBAcGFyYW0gbGlzdE9mU3RyaW5ncyBBIGxpc3Qgb2Ygc3RyaW5ncywgc3VjaCBhcyBcIkFcIiwgXCJCXCIsIFwiQ1wiLlxuICAgKiBAcGFyYW0gdmFsdWUgQSBzdHJpbmcsIHN1Y2ggYXMgXCJBXCIsIHRoYXQgeW91IHdhbnQgdG8gY29tcGFyZSBhZ2FpbnN0IGEgbGlzdFxuICAgKiBvZiBzdHJpbmdzLlxuICAgKiBAcmV0dXJucyBhbiBGbkNvbmRpdGlvbiB0b2tlblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb25kaXRpb25FYWNoTWVtYmVyRXF1YWxzKGxpc3RPZlN0cmluZ3M6IHN0cmluZ1tdLCB2YWx1ZTogc3RyaW5nKTogSUNmblJ1bGVDb25kaXRpb25FeHByZXNzaW9uIHtcbiAgICByZXR1cm4gbmV3IEZuRWFjaE1lbWJlckVxdWFscyhsaXN0T2ZTdHJpbmdzLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGVhY2ggbWVtYmVyIGluIGEgbGlzdCBvZiBzdHJpbmdzIG1hdGNoZXMgYXQgbGVhc3Qgb25lIHZhbHVlXG4gICAqIGluIGEgc2Vjb25kIGxpc3Qgb2Ygc3RyaW5ncy5cbiAgICogQHBhcmFtIHN0cmluZ3NUb0NoZWNrIEEgbGlzdCBvZiBzdHJpbmdzLCBzdWNoIGFzIFwiQVwiLCBcIkJcIiwgXCJDXCIuIEFXU1xuICAgKiBDbG91ZEZvcm1hdGlvbiBjaGVja3Mgd2hldGhlciBlYWNoIG1lbWJlciBpbiB0aGUgc3RyaW5nc190b19jaGVjayBwYXJhbWV0ZXJcbiAgICogaXMgaW4gdGhlIHN0cmluZ3NfdG9fbWF0Y2ggcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0gc3RyaW5nc1RvTWF0Y2ggQSBsaXN0IG9mIHN0cmluZ3MsIHN1Y2ggYXMgXCJBXCIsIFwiQlwiLCBcIkNcIi4gRWFjaCBtZW1iZXJcbiAgICogaW4gdGhlIHN0cmluZ3NfdG9fbWF0Y2ggcGFyYW1ldGVyIGlzIGNvbXBhcmVkIGFnYWluc3QgdGhlIG1lbWJlcnMgb2YgdGhlXG4gICAqIHN0cmluZ3NfdG9fY2hlY2sgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJucyBhbiBGbkNvbmRpdGlvbiB0b2tlblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb25kaXRpb25FYWNoTWVtYmVySW4oc3RyaW5nc1RvQ2hlY2s6IHN0cmluZ1tdLCBzdHJpbmdzVG9NYXRjaDogc3RyaW5nW10pOiBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24ge1xuICAgIHJldHVybiBuZXcgRm5FYWNoTWVtYmVySW4oc3RyaW5nc1RvQ2hlY2ssIHN0cmluZ3NUb01hdGNoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFsbCB2YWx1ZXMgZm9yIGEgc3BlY2lmaWVkIHBhcmFtZXRlciB0eXBlLlxuICAgKiBAcGFyYW0gcGFyYW1ldGVyVHlwZSBBbiBBV1Mtc3BlY2lmaWMgcGFyYW1ldGVyIHR5cGUsIHN1Y2ggYXNcbiAgICogQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXA6OklkIG9yIEFXUzo6RUMyOjpWUEM6OklkLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlXG4gICAqIFBhcmFtZXRlcnMgaW4gdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBVc2VyIEd1aWRlLlxuICAgKiBAcmV0dXJucyBhIHRva2VuIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nIGFycmF5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlZkFsbChwYXJhbWV0ZXJUeXBlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFRva2VuLmFzTGlzdChuZXcgRm5SZWZBbGwocGFyYW1ldGVyVHlwZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXR0cmlidXRlIHZhbHVlIG9yIGxpc3Qgb2YgdmFsdWVzIGZvciBhIHNwZWNpZmljIHBhcmFtZXRlciBhbmRcbiAgICogYXR0cmlidXRlLlxuICAgKiBAcGFyYW0gcGFyYW1ldGVyT3JMb2dpY2FsSWQgVGhlIG5hbWUgb2YgYSBwYXJhbWV0ZXIgZm9yIHdoaWNoIHlvdSB3YW50IHRvXG4gICAqIHJldHJpZXZlIGF0dHJpYnV0ZSB2YWx1ZXMuIFRoZSBwYXJhbWV0ZXIgbXVzdCBiZSBkZWNsYXJlZCBpbiB0aGUgUGFyYW1ldGVyc1xuICAgKiBzZWN0aW9uIG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZSBUaGUgbmFtZSBvZiBhbiBhdHRyaWJ1dGUgZnJvbSB3aGljaCB5b3Ugd2FudCB0byByZXRyaWV2ZSBhXG4gICAqIHZhbHVlLlxuICAgKiBAcmV0dXJucyBhIHRva2VuIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHZhbHVlT2YocGFyYW1ldGVyT3JMb2dpY2FsSWQ6IHN0cmluZywgYXR0cmlidXRlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgRm5WYWx1ZU9mKHBhcmFtZXRlck9yTG9naWNhbElkLCBhdHRyaWJ1dGUpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxpc3Qgb2YgYWxsIGF0dHJpYnV0ZSB2YWx1ZXMgZm9yIGEgZ2l2ZW4gcGFyYW1ldGVyIHR5cGUgYW5kXG4gICAqIGF0dHJpYnV0ZS5cbiAgICogQHBhcmFtIHBhcmFtZXRlclR5cGUgQW4gQVdTLXNwZWNpZmljIHBhcmFtZXRlciB0eXBlLCBzdWNoIGFzXG4gICAqIEFXUzo6RUMyOjpTZWN1cml0eUdyb3VwOjpJZCBvciBBV1M6OkVDMjo6VlBDOjpJZC4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZVxuICAgKiBQYXJhbWV0ZXJzIGluIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gVXNlciBHdWlkZS5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZSBUaGUgbmFtZSBvZiBhbiBhdHRyaWJ1dGUgZnJvbSB3aGljaCB5b3Ugd2FudCB0byByZXRyaWV2ZSBhXG4gICAqIHZhbHVlLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBhdHRyaWJ1dGVzLCBzZWUgU3VwcG9ydGVkIEF0dHJpYnV0ZXMuXG4gICAqIEByZXR1cm5zIGEgdG9rZW4gcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmcgYXJyYXlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdmFsdWVPZkFsbChwYXJhbWV0ZXJUeXBlOiBzdHJpbmcsIGF0dHJpYnV0ZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBUb2tlbi5hc0xpc3QobmV3IEZuVmFsdWVPZkFsbChwYXJhbWV0ZXJUeXBlLCBhdHRyaWJ1dGUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYEZuOjpUb0pzb25TdHJpbmdgIGludHJpbnNpYyBmdW5jdGlvbiBjb252ZXJ0cyBhbiBvYmplY3Qgb3IgYXJyYXkgdG8gaXRzXG4gICAqIGNvcnJlc3BvbmRpbmcgSlNPTiBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBvYmplY3QgVGhlIG9iamVjdCBvciBhcnJheSB0byBzdHJpbmdpZnlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdG9Kc29uU3RyaW5nKG9iamVjdDogYW55KTogc3RyaW5nIHtcbiAgICAvLyBzaG9ydC1jaXJjdWl0IGlmIG9iamVjdCBpcyBub3QgYSB0b2tlblxuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKG9iamVjdCkpIHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEZuVG9Kc29uU3RyaW5nKG9iamVjdCkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBGbjo6TGVuZ3RoYCByZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgd2l0aGluIGFuIGFycmF5XG4gICAqIG9yIGFuIGludHJpbnNpYyBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBhcnJheSBUaGUgYXJyYXkgeW91IHdhbnQgdG8gcmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgZnJvbVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBsZW4oYXJyYXk6IGFueSk6IG51bWJlciB7XG4gICAgLy8gc2hvcnQtY2lyY3VpdCBpZiBhcnJheSBpcyBub3QgYSB0b2tlblxuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKGFycmF5KSkge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZuLmxlbmd0aCgpIG5lZWRzIGFuIGFycmF5Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJyYXkubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gVG9rZW4uYXNOdW1iZXIobmV3IEZuTGVuZ3RoKGFycmF5KSk7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkgeyB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgdG9rZW5zIHRoYXQgcmVwcmVzZW50IENsb3VkRm9ybWF0aW9uIGludHJpbnNpYyBmdW5jdGlvbnMuXG4gKi9cbmNsYXNzIEZuQmFzZSBleHRlbmRzIEludHJpbnNpYyB7XG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHN1cGVyKHsgW25hbWVdOiB2YWx1ZSB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBSZWZgYCByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIHBhcmFtZXRlciBvciByZXNvdXJjZS5cbiAqIFdoZW4geW91IHNwZWNpZnkgYSBwYXJhbWV0ZXIncyBsb2dpY2FsIG5hbWUsIGl0IHJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gKiBXaGVuIHlvdSBzcGVjaWZ5IGEgcmVzb3VyY2UncyBsb2dpY2FsIG5hbWUsIGl0IHJldHVybnMgYSB2YWx1ZSB0aGF0IHlvdSBjYW4gdHlwaWNhbGx5IHVzZSB0byByZWZlciB0byB0aGF0IHJlc291cmNlLCBzdWNoIGFzIGEgcGh5c2ljYWwgSUQuXG4gKi9cbmNsYXNzIEZuUmVmIGV4dGVuZHMgRm5CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBSZWZgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGxvZ2ljYWxOYW1lIFRoZSBsb2dpY2FsIG5hbWUgb2YgYSBwYXJhbWV0ZXIvcmVzb3VyY2UgZm9yIHdoaWNoIHlvdSB3YW50IHRvIHJldHJpZXZlIGl0cyB2YWx1ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGxvZ2ljYWxOYW1lOiBzdHJpbmcpIHtcbiAgICBzdXBlcignUmVmJywgbG9naWNhbE5hbWUpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpGaW5kSW5NYXBgYCByZXR1cm5zIHRoZSB2YWx1ZSBjb3JyZXNwb25kaW5nIHRvIGtleXMgaW4gYSB0d28tbGV2ZWxcbiAqIG1hcCB0aGF0IGlzIGRlY2xhcmVkIGluIHRoZSBNYXBwaW5ncyBzZWN0aW9uLlxuICovXG5jbGFzcyBGbkZpbmRJbk1hcCBleHRlbmRzIEZuQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OkZpbmRJbk1hcGBgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gbWFwTmFtZSBUaGUgbG9naWNhbCBuYW1lIG9mIGEgbWFwcGluZyBkZWNsYXJlZCBpbiB0aGUgTWFwcGluZ3Mgc2VjdGlvbiB0aGF0IGNvbnRhaW5zIHRoZSBrZXlzIGFuZCB2YWx1ZXMuXG4gICAqIEBwYXJhbSB0b3BMZXZlbEtleSBUaGUgdG9wLWxldmVsIGtleSBuYW1lLiBJdHMgdmFsdWUgaXMgYSBsaXN0IG9mIGtleS12YWx1ZSBwYWlycy5cbiAgICogQHBhcmFtIHNlY29uZExldmVsS2V5IFRoZSBzZWNvbmQtbGV2ZWwga2V5IG5hbWUsIHdoaWNoIGlzIHNldCB0byBvbmUgb2YgdGhlIGtleXMgZnJvbSB0aGUgbGlzdCBhc3NpZ25lZCB0byBUb3BMZXZlbEtleS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG1hcE5hbWU6IHN0cmluZywgdG9wTGV2ZWxLZXk6IGFueSwgc2Vjb25kTGV2ZWxLZXk6IGFueSkge1xuICAgIHN1cGVyKCdGbjo6RmluZEluTWFwJywgW21hcE5hbWUsIHRvcExldmVsS2V5LCBzZWNvbmRMZXZlbEtleV0pO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpUcmFuc2Zvcm1gYCBzcGVjaWZpZXMgYSBtYWNybyB0byBwZXJmb3JtIGN1c3RvbSBwcm9jZXNzaW5nIG9uIHBhcnQgb2YgYSBzdGFjayB0ZW1wbGF0ZS5cbiAqL1xuY2xhc3MgRm5UcmFuc2Zvcm0gZXh0ZW5kcyBGbkJhc2Uge1xuICAvKipcbiAgICogY3JlYXRlcyBhbiBgYEZuOjpUcmFuc2Zvcm1gYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIG1hY3JvTmFtZSBUaGUgbmFtZSBvZiB0aGUgbWFjcm8gdG8gYmUgaW52b2tlZFxuICAgKiBAcGFyYW0gcGFyYW1ldGVycyB0aGUgcGFyYW1ldGVycyB0byBwYXNzIHRvIGl0XG4gICAqL1xuICBjb25zdHJ1Y3RvcihtYWNyb05hbWU6IHN0cmluZywgcGFyYW1ldGVyczogeyBbbmFtZTogc3RyaW5nXTogYW55IH0pIHtcbiAgICBzdXBlcignRm46OlRyYW5zZm9ybScsIHsgTmFtZTogbWFjcm9OYW1lLCBQYXJhbWV0ZXJzOiBwYXJhbWV0ZXJzIH0pO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGBgRm46OkdldEF0dGBgIGludHJpbnNpYyBmdW5jdGlvbiByZXR1cm5zIHRoZSB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUgZnJvbSBhIHJlc291cmNlIGluIHRoZSB0ZW1wbGF0ZS5cbiAqL1xuY2xhc3MgRm5HZXRBdHQgZXh0ZW5kcyBGbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIGBgRm46OkdldEF0dGBgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gbG9naWNhbE5hbWVPZlJlc291cmNlIFRoZSBsb2dpY2FsIG5hbWUgKGFsc28gY2FsbGVkIGxvZ2ljYWwgSUQpIG9mIHRoZSByZXNvdXJjZSB0aGF0IGNvbnRhaW5zIHRoZSBhdHRyaWJ1dGUgdGhhdCB5b3Ugd2FudC5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZU5hbWUgVGhlIG5hbWUgb2YgdGhlIHJlc291cmNlLXNwZWNpZmljIGF0dHJpYnV0ZSB3aG9zZSB2YWx1ZSB5b3Ugd2FudC4gU2VlIHRoZSByZXNvdXJjZSdzIHJlZmVyZW5jZSBwYWdlIGZvciBkZXRhaWxzIGFib3V0IHRoZSBhdHRyaWJ1dGVzIGF2YWlsYWJsZSBmb3IgdGhhdCByZXNvdXJjZSB0eXBlLlxuICAgKi9cbiAgY29uc3RydWN0b3IobG9naWNhbE5hbWVPZlJlc291cmNlOiBzdHJpbmcsIGF0dHJpYnV0ZU5hbWU6IHN0cmluZykge1xuICAgIHN1cGVyKCdGbjo6R2V0QXR0JywgW2xvZ2ljYWxOYW1lT2ZSZXNvdXJjZSwgYXR0cmlidXRlTmFtZV0pO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpHZXRBWnNgYCByZXR1cm5zIGFuIGFycmF5IHRoYXQgbGlzdHMgQXZhaWxhYmlsaXR5IFpvbmVzIGZvciBhXG4gKiBzcGVjaWZpZWQgcmVnaW9uLiBCZWNhdXNlIGN1c3RvbWVycyBoYXZlIGFjY2VzcyB0byBkaWZmZXJlbnQgQXZhaWxhYmlsaXR5IFpvbmVzLCB0aGUgaW50cmluc2ljXG4gKiBmdW5jdGlvbiBgYEZuOjpHZXRBWnNgYCBlbmFibGVzIHRlbXBsYXRlIGF1dGhvcnMgdG8gd3JpdGUgdGVtcGxhdGVzIHRoYXQgYWRhcHQgdG8gdGhlIGNhbGxpbmdcbiAqIHVzZXIncyBhY2Nlc3MuIFRoYXQgd2F5IHlvdSBkb24ndCBoYXZlIHRvIGhhcmQtY29kZSBhIGZ1bGwgbGlzdCBvZiBBdmFpbGFiaWxpdHkgWm9uZXMgZm9yIGFcbiAqIHNwZWNpZmllZCByZWdpb24uXG4gKi9cbmNsYXNzIEZuR2V0QVpzIGV4dGVuZHMgRm5CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBGbjo6R2V0QVpzYGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSByZWdpb24gVGhlIG5hbWUgb2YgdGhlIHJlZ2lvbiBmb3Igd2hpY2ggeW91IHdhbnQgdG8gZ2V0IHRoZSBBdmFpbGFiaWxpdHkgWm9uZXMuXG4gICAqICAgICAgICAgWW91IGNhbiB1c2UgdGhlIEFXUzo6UmVnaW9uIHBzZXVkbyBwYXJhbWV0ZXIgdG8gc3BlY2lmeSB0aGUgcmVnaW9uIGluXG4gICAqICAgICAgICAgd2hpY2ggdGhlIHN0YWNrIGlzIGNyZWF0ZWQuIFNwZWNpZnlpbmcgYW4gZW1wdHkgc3RyaW5nIGlzIGVxdWl2YWxlbnQgdG9cbiAgICogICAgICAgICBzcGVjaWZ5aW5nIEFXUzo6UmVnaW9uLlxuICAgKi9cbiAgY29uc3RydWN0b3IocmVnaW9uPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoJ0ZuOjpHZXRBWnMnLCByZWdpb24gfHwgJycpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpJbXBvcnRWYWx1ZWBgIHJldHVybnMgdGhlIHZhbHVlIG9mIGFuIG91dHB1dCBleHBvcnRlZCBieSBhbm90aGVyIHN0YWNrLlxuICogWW91IHR5cGljYWxseSB1c2UgdGhpcyBmdW5jdGlvbiB0byBjcmVhdGUgY3Jvc3Mtc3RhY2sgcmVmZXJlbmNlcy4gSW4gdGhlIGZvbGxvd2luZyBleGFtcGxlXG4gKiB0ZW1wbGF0ZSBzbmlwcGV0cywgU3RhY2sgQSBleHBvcnRzIFZQQyBzZWN1cml0eSBncm91cCB2YWx1ZXMgYW5kIFN0YWNrIEIgaW1wb3J0cyB0aGVtLlxuICovXG5jbGFzcyBGbkltcG9ydFZhbHVlIGV4dGVuZHMgRm5CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBGbjo6SW1wb3J0VmFsdWVgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIHNoYXJlZFZhbHVlVG9JbXBvcnQgVGhlIHN0YWNrIG91dHB1dCB2YWx1ZSB0aGF0IHlvdSB3YW50IHRvIGltcG9ydC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNoYXJlZFZhbHVlVG9JbXBvcnQ6IHN0cmluZykge1xuICAgIHN1cGVyKCdGbjo6SW1wb3J0VmFsdWUnLCBzaGFyZWRWYWx1ZVRvSW1wb3J0KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBpbnRyaW5zaWMgZnVuY3Rpb24gYGBGbjo6U2VsZWN0YGAgcmV0dXJucyBhIHNpbmdsZSBvYmplY3QgZnJvbSBhIGxpc3Qgb2Ygb2JqZWN0cyBieSBpbmRleC5cbiAqL1xuY2xhc3MgRm5TZWxlY3QgZXh0ZW5kcyBGbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpTZWxlY3RgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCBvZiB0aGUgb2JqZWN0IHRvIHJldHJpZXZlLiBUaGlzIG11c3QgYmUgYSB2YWx1ZSBmcm9tIHplcm8gdG8gTi0xLCB3aGVyZSBOIHJlcHJlc2VudHMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgYXJyYXkuXG4gICAqIEBwYXJhbSBhcnJheSBUaGUgbGlzdCBvZiBvYmplY3RzIHRvIHNlbGVjdCBmcm9tLiBUaGlzIGxpc3QgbXVzdCBub3QgYmUgbnVsbCwgbm9yIGNhbiBpdCBoYXZlIG51bGwgZW50cmllcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGluZGV4OiBudW1iZXIsIGFycmF5OiBhbnkpIHtcbiAgICBzdXBlcignRm46OlNlbGVjdCcsIFtpbmRleCwgYXJyYXldKTtcbiAgfVxufVxuXG4vKipcbiAqIFRvIHNwbGl0IGEgc3RyaW5nIGludG8gYSBsaXN0IG9mIHN0cmluZyB2YWx1ZXMgc28gdGhhdCB5b3UgY2FuIHNlbGVjdCBhbiBlbGVtZW50IGZyb20gdGhlXG4gKiByZXN1bHRpbmcgc3RyaW5nIGxpc3QsIHVzZSB0aGUgYGBGbjo6U3BsaXRgYCBpbnRyaW5zaWMgZnVuY3Rpb24uIFNwZWNpZnkgdGhlIGxvY2F0aW9uIG9mIHNwbGl0c1xuICogd2l0aCBhIGRlbGltaXRlciwgc3VjaCBhcyAsIChhIGNvbW1hKS4gQWZ0ZXIgeW91IHNwbGl0IGEgc3RyaW5nLCB1c2UgdGhlIGBgRm46OlNlbGVjdGBgIGZ1bmN0aW9uXG4gKiB0byBwaWNrIGEgc3BlY2lmaWMgZWxlbWVudC5cbiAqL1xuY2xhc3MgRm5TcGxpdCBleHRlbmRzIEZuQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gYGBGbjo6U3BsaXRgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGRlbGltaXRlciBBIHN0cmluZyB2YWx1ZSB0aGF0IGRldGVybWluZXMgd2hlcmUgdGhlIHNvdXJjZSBzdHJpbmcgaXMgZGl2aWRlZC5cbiAgICogQHBhcmFtIHNvdXJjZSBUaGUgc3RyaW5nIHZhbHVlIHRoYXQgeW91IHdhbnQgdG8gc3BsaXQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkZWxpbWl0ZXI6IHN0cmluZywgc291cmNlOiBhbnkpIHtcbiAgICBzdXBlcignRm46OlNwbGl0JywgW2RlbGltaXRlciwgc291cmNlXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OlN1YmBgIHN1YnN0aXR1dGVzIHZhcmlhYmxlcyBpbiBhbiBpbnB1dCBzdHJpbmcgd2l0aCB2YWx1ZXMgdGhhdFxuICogeW91IHNwZWNpZnkuIEluIHlvdXIgdGVtcGxhdGVzLCB5b3UgY2FuIHVzZSB0aGlzIGZ1bmN0aW9uIHRvIGNvbnN0cnVjdCBjb21tYW5kcyBvciBvdXRwdXRzXG4gKiB0aGF0IGluY2x1ZGUgdmFsdWVzIHRoYXQgYXJlbid0IGF2YWlsYWJsZSB1bnRpbCB5b3UgY3JlYXRlIG9yIHVwZGF0ZSBhIHN0YWNrLlxuICovXG5jbGFzcyBGblN1YiBleHRlbmRzIEZuQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OlN1YmBgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gYm9keSBBIHN0cmluZyB3aXRoIHZhcmlhYmxlcyB0aGF0IEFXUyBDbG91ZEZvcm1hdGlvbiBzdWJzdGl0dXRlcyB3aXRoIHRoZWlyXG4gICAqICAgICAgIGFzc29jaWF0ZWQgdmFsdWVzIGF0IHJ1bnRpbWUuIFdyaXRlIHZhcmlhYmxlcyBhcyAke015VmFyTmFtZX0uIFZhcmlhYmxlc1xuICAgKiAgICAgICBjYW4gYmUgdGVtcGxhdGUgcGFyYW1ldGVyIG5hbWVzLCByZXNvdXJjZSBsb2dpY2FsIElEcywgcmVzb3VyY2UgYXR0cmlidXRlcyxcbiAgICogICAgICAgb3IgYSB2YXJpYWJsZSBpbiBhIGtleS12YWx1ZSBtYXAuIElmIHlvdSBzcGVjaWZ5IG9ubHkgdGVtcGxhdGUgcGFyYW1ldGVyIG5hbWVzLFxuICAgKiAgICAgICByZXNvdXJjZSBsb2dpY2FsIElEcywgYW5kIHJlc291cmNlIGF0dHJpYnV0ZXMsIGRvbid0IHNwZWNpZnkgYSBrZXktdmFsdWUgbWFwLlxuICAgKiBAcGFyYW0gdmFyaWFibGVzIFRoZSBuYW1lIG9mIGEgdmFyaWFibGUgdGhhdCB5b3UgaW5jbHVkZWQgaW4gdGhlIFN0cmluZyBwYXJhbWV0ZXIuXG4gICAqICAgICAgICAgIFRoZSB2YWx1ZSB0aGF0IEFXUyBDbG91ZEZvcm1hdGlvbiBzdWJzdGl0dXRlcyBmb3IgdGhlIGFzc29jaWF0ZWQgdmFyaWFibGUgbmFtZSBhdCBydW50aW1lLlxuICAgKi9cbiAgY29uc3RydWN0b3IoYm9keTogc3RyaW5nLCB2YXJpYWJsZXM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KSB7XG4gICAgc3VwZXIoJ0ZuOjpTdWInLCB2YXJpYWJsZXMgPyBbYm9keSwgdmFyaWFibGVzXSA6IGJvZHkpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpCYXNlNjRgYCByZXR1cm5zIHRoZSBCYXNlNjQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGlucHV0IHN0cmluZy5cbiAqIFRoaXMgZnVuY3Rpb24gaXMgdHlwaWNhbGx5IHVzZWQgdG8gcGFzcyBlbmNvZGVkIGRhdGEgdG8gQW1hem9uIEVDMiBpbnN0YW5jZXMgYnkgd2F5IG9mXG4gKiB0aGUgVXNlckRhdGEgcHJvcGVydHkuXG4gKi9cbmNsYXNzIEZuQmFzZTY0IGV4dGVuZHMgRm5CYXNlIHtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpCYXNlNjRgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGRhdGEgVGhlIHN0cmluZyB2YWx1ZSB5b3Ugd2FudCB0byBjb252ZXJ0IHRvIEJhc2U2NC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGE6IGFueSkge1xuICAgIHN1cGVyKCdGbjo6QmFzZTY0JywgZGF0YSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBgRm46OkNpZHJgYCByZXR1cm5zIHRoZSBzcGVjaWZpZWQgQ2lkciBhZGRyZXNzIGJsb2NrLlxuICovXG5jbGFzcyBGbkNpZHIgZXh0ZW5kcyBGbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpDaWRyYGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBpcEJsb2NrICBUaGUgdXNlci1zcGVjaWZpZWQgZGVmYXVsdCBDaWRyIGFkZHJlc3MgYmxvY2suXG4gICAqIEBwYXJhbSBjb3VudCAgVGhlIG51bWJlciBvZiBzdWJuZXRzJyBDaWRyIGJsb2NrIHdhbnRlZC4gQ291bnQgY2FuIGJlIDEgdG8gMjU2LlxuICAgKiBAcGFyYW0gc2l6ZU1hc2sgVGhlIGRpZ2l0IGNvdmVyZWQgaW4gdGhlIHN1Ym5ldC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGlwQmxvY2s6IGFueSwgY291bnQ6IGFueSwgc2l6ZU1hc2s/OiBhbnkpIHtcbiAgICBpZiAoY291bnQgPCAxIHx8IGNvdW50ID4gMjU2KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEZuOjpDaWRyJ3MgY291bnQgYXR0cmlidXRlIG11c3QgYmUgYmV0d2VlbiAxIGFuZCAyNTYsICR7Y291bnR9IHdhcyBwcm92aWRlZC5gKTtcbiAgICB9XG4gICAgc3VwZXIoJ0ZuOjpDaWRyJywgW2lwQmxvY2ssIGNvdW50LCBzaXplTWFza10pO1xuICB9XG59XG5cbmNsYXNzIEZuQ29uZGl0aW9uQmFzZSBleHRlbmRzIEludHJpbnNpYyBpbXBsZW1lbnRzIElDZm5SdWxlQ29uZGl0aW9uRXhwcmVzc2lvbiB7XG4gIHJlYWRvbmx5IGRpc2FtYmlndWF0b3IgPSB0cnVlO1xuICBjb25zdHJ1Y3Rvcih0eXBlOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICBzdXBlcih7IFt0eXBlXTogdmFsdWUgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYWxsIHRoZSBzcGVjaWZpZWQgY29uZGl0aW9ucyBldmFsdWF0ZSB0byB0cnVlLCBvciByZXR1cm5zIGZhbHNlIGlmIGFueSBvbmVcbiAqICBvZiB0aGUgY29uZGl0aW9ucyBldmFsdWF0ZXMgdG8gZmFsc2UuIGBgRm46OkFuZGBgIGFjdHMgYXMgYW4gQU5EIG9wZXJhdG9yLiBUaGUgbWluaW11bSBudW1iZXIgb2ZcbiAqIGNvbmRpdGlvbnMgdGhhdCB5b3UgY2FuIGluY2x1ZGUgaXMgMiwgYW5kIHRoZSBtYXhpbXVtIGlzIDEwLlxuICovXG5jbGFzcyBGbkFuZCBleHRlbmRzIEZuQ29uZGl0aW9uQmFzZSB7XG4gIGNvbnN0cnVjdG9yKC4uLmNvbmRpdGlvbjogSUNmbkNvbmRpdGlvbkV4cHJlc3Npb25bXSkge1xuICAgIHN1cGVyKCdGbjo6QW5kJywgY29uZGl0aW9uKTtcbiAgfVxufVxuXG4vKipcbiAqIENvbXBhcmVzIGlmIHR3byB2YWx1ZXMgYXJlIGVxdWFsLiBSZXR1cm5zIHRydWUgaWYgdGhlIHR3byB2YWx1ZXMgYXJlIGVxdWFsIG9yIGZhbHNlXG4gKiBpZiB0aGV5IGFyZW4ndC5cbiAqL1xuY2xhc3MgRm5FcXVhbHMgZXh0ZW5kcyBGbkNvbmRpdGlvbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpFcXVhbHNgYCBjb25kaXRpb24gZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBsaHMgQSB2YWx1ZSBvZiBhbnkgdHlwZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSByaHMgQSB2YWx1ZSBvZiBhbnkgdHlwZSB0aGF0IHlvdSB3YW50IHRvIGNvbXBhcmUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihsaHM6IGFueSwgcmhzOiBhbnkpIHtcbiAgICBzdXBlcignRm46OkVxdWFscycsIFtsaHMsIHJoc10pO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBvbmUgdmFsdWUgaWYgdGhlIHNwZWNpZmllZCBjb25kaXRpb24gZXZhbHVhdGVzIHRvIHRydWUgYW5kIGFub3RoZXIgdmFsdWUgaWYgdGhlXG4gKiBzcGVjaWZpZWQgY29uZGl0aW9uIGV2YWx1YXRlcyB0byBmYWxzZS4gQ3VycmVudGx5LCBBV1MgQ2xvdWRGb3JtYXRpb24gc3VwcG9ydHMgdGhlIGBgRm46OklmYGBcbiAqIGludHJpbnNpYyBmdW5jdGlvbiBpbiB0aGUgbWV0YWRhdGEgYXR0cmlidXRlLCB1cGRhdGUgcG9saWN5IGF0dHJpYnV0ZSwgYW5kIHByb3BlcnR5IHZhbHVlc1xuICogaW4gdGhlIFJlc291cmNlcyBzZWN0aW9uIGFuZCBPdXRwdXRzIHNlY3Rpb25zIG9mIGEgdGVtcGxhdGUuIFlvdSBjYW4gdXNlIHRoZSBBV1M6Ok5vVmFsdWVcbiAqIHBzZXVkbyBwYXJhbWV0ZXIgYXMgYSByZXR1cm4gdmFsdWUgdG8gcmVtb3ZlIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5LlxuICovXG5jbGFzcyBGbklmIGV4dGVuZHMgRm5Db25kaXRpb25CYXNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYGBGbjo6SWZgYCBjb25kaXRpb24gZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBjb25kaXRpb24gQSByZWZlcmVuY2UgdG8gYSBjb25kaXRpb24gaW4gdGhlIENvbmRpdGlvbnMgc2VjdGlvbi4gVXNlIHRoZSBjb25kaXRpb24ncyBuYW1lIHRvIHJlZmVyZW5jZSBpdC5cbiAgICogQHBhcmFtIHZhbHVlSWZUcnVlIEEgdmFsdWUgdG8gYmUgcmV0dXJuZWQgaWYgdGhlIHNwZWNpZmllZCBjb25kaXRpb24gZXZhbHVhdGVzIHRvIHRydWUuXG4gICAqIEBwYXJhbSB2YWx1ZUlmRmFsc2UgQSB2YWx1ZSB0byBiZSByZXR1cm5lZCBpZiB0aGUgc3BlY2lmaWVkIGNvbmRpdGlvbiBldmFsdWF0ZXMgdG8gZmFsc2UuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25kaXRpb246IHN0cmluZywgdmFsdWVJZlRydWU6IGFueSwgdmFsdWVJZkZhbHNlOiBhbnkpIHtcbiAgICBzdXBlcignRm46OklmJywgW2NvbmRpdGlvbiwgdmFsdWVJZlRydWUsIHZhbHVlSWZGYWxzZV0pO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGZvciBhIGNvbmRpdGlvbiB0aGF0IGV2YWx1YXRlcyB0byBmYWxzZSBvciByZXR1cm5zIGZhbHNlIGZvciBhIGNvbmRpdGlvbiB0aGF0IGV2YWx1YXRlcyB0byB0cnVlLlxuICogYGBGbjo6Tm90YGAgYWN0cyBhcyBhIE5PVCBvcGVyYXRvci5cbiAqL1xuY2xhc3MgRm5Ob3QgZXh0ZW5kcyBGbkNvbmRpdGlvbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpOb3RgYCBjb25kaXRpb24gZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBjb25kaXRpb24gQSBjb25kaXRpb24gc3VjaCBhcyBgYEZuOjpFcXVhbHNgYCB0aGF0IGV2YWx1YXRlcyB0byB0cnVlIG9yIGZhbHNlLlxuICAgKi9cbiAgY29uc3RydWN0b3IoY29uZGl0aW9uOiBJQ2ZuQ29uZGl0aW9uRXhwcmVzc2lvbikge1xuICAgIHN1cGVyKCdGbjo6Tm90JywgW2NvbmRpdGlvbl0pO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGFueSBvbmUgb2YgdGhlIHNwZWNpZmllZCBjb25kaXRpb25zIGV2YWx1YXRlIHRvIHRydWUsIG9yIHJldHVybnMgZmFsc2UgaWZcbiAqIGFsbCBvZiB0aGUgY29uZGl0aW9ucyBldmFsdWF0ZXMgdG8gZmFsc2UuIGBgRm46Ok9yYGAgYWN0cyBhcyBhbiBPUiBvcGVyYXRvci4gVGhlIG1pbmltdW0gbnVtYmVyXG4gKiBvZiBjb25kaXRpb25zIHRoYXQgeW91IGNhbiBpbmNsdWRlIGlzIDIsIGFuZCB0aGUgbWF4aW11bSBpcyAxMC5cbiAqL1xuY2xhc3MgRm5PciBleHRlbmRzIEZuQ29uZGl0aW9uQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46Ok9yYGAgY29uZGl0aW9uIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gY29uZGl0aW9uIEEgY29uZGl0aW9uIHRoYXQgZXZhbHVhdGVzIHRvIHRydWUgb3IgZmFsc2UuXG4gICAqL1xuICBjb25zdHJ1Y3RvciguLi5jb25kaXRpb246IElDZm5Db25kaXRpb25FeHByZXNzaW9uW10pIHtcbiAgICBzdXBlcignRm46Ok9yJywgY29uZGl0aW9uKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBhIHNwZWNpZmllZCBzdHJpbmcgbWF0Y2hlcyBhdCBsZWFzdCBvbmUgdmFsdWUgaW4gYSBsaXN0IG9mIHN0cmluZ3MuXG4gKi9cbmNsYXNzIEZuQ29udGFpbnMgZXh0ZW5kcyBGbkNvbmRpdGlvbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpDb250YWluc2BgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gbGlzdE9mU3RyaW5ncyBBIGxpc3Qgb2Ygc3RyaW5ncywgc3VjaCBhcyBcIkFcIiwgXCJCXCIsIFwiQ1wiLlxuICAgKiBAcGFyYW0gdmFsdWUgQSBzdHJpbmcsIHN1Y2ggYXMgXCJBXCIsIHRoYXQgeW91IHdhbnQgdG8gY29tcGFyZSBhZ2FpbnN0IGEgbGlzdCBvZiBzdHJpbmdzLlxuICAgKi9cbiAgY29uc3RydWN0b3IobGlzdE9mU3RyaW5nczogYW55LCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoJ0ZuOjpDb250YWlucycsIFtsaXN0T2ZTdHJpbmdzLCB2YWx1ZV0pO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGEgc3BlY2lmaWVkIHN0cmluZyBtYXRjaGVzIGFsbCB2YWx1ZXMgaW4gYSBsaXN0LlxuICovXG5jbGFzcyBGbkVhY2hNZW1iZXJFcXVhbHMgZXh0ZW5kcyBGbkNvbmRpdGlvbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpFYWNoTWVtYmVyRXF1YWxzYGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBsaXN0T2ZTdHJpbmdzIEEgbGlzdCBvZiBzdHJpbmdzLCBzdWNoIGFzIFwiQVwiLCBcIkJcIiwgXCJDXCIuXG4gICAqIEBwYXJhbSB2YWx1ZSBBIHN0cmluZywgc3VjaCBhcyBcIkFcIiwgdGhhdCB5b3Ugd2FudCB0byBjb21wYXJlIGFnYWluc3QgYSBsaXN0IG9mIHN0cmluZ3MuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihsaXN0T2ZTdHJpbmdzOiBhbnksIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlcignRm46OkVhY2hNZW1iZXJFcXVhbHMnLCBbbGlzdE9mU3RyaW5ncywgdmFsdWVdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBlYWNoIG1lbWJlciBpbiBhIGxpc3Qgb2Ygc3RyaW5ncyBtYXRjaGVzIGF0IGxlYXN0IG9uZSB2YWx1ZSBpbiBhIHNlY29uZFxuICogbGlzdCBvZiBzdHJpbmdzLlxuICovXG5jbGFzcyBGbkVhY2hNZW1iZXJJbiBleHRlbmRzIEZuQ29uZGl0aW9uQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OkVhY2hNZW1iZXJJbmBgIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gc3RyaW5nc1RvQ2hlY2sgQSBsaXN0IG9mIHN0cmluZ3MsIHN1Y2ggYXMgXCJBXCIsIFwiQlwiLCBcIkNcIi4gQVdTIENsb3VkRm9ybWF0aW9uIGNoZWNrcyB3aGV0aGVyIGVhY2ggbWVtYmVyIGluIHRoZSBzdHJpbmdzX3RvX2NoZWNrIHBhcmFtZXRlciBpcyBpbiB0aGUgc3RyaW5nc190b19tYXRjaCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSBzdHJpbmdzVG9NYXRjaCBBIGxpc3Qgb2Ygc3RyaW5ncywgc3VjaCBhcyBcIkFcIiwgXCJCXCIsIFwiQ1wiLiBFYWNoIG1lbWJlciBpbiB0aGUgc3RyaW5nc190b19tYXRjaCBwYXJhbWV0ZXIgaXMgY29tcGFyZWQgYWdhaW5zdCB0aGUgbWVtYmVycyBvZiB0aGUgc3RyaW5nc190b19jaGVjayBwYXJhbWV0ZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzdHJpbmdzVG9DaGVjazogc3RyaW5nW10sIHN0cmluZ3NUb01hdGNoOiBzdHJpbmdbXSkge1xuICAgIHN1cGVyKCdGbjo6RWFjaE1lbWJlckluJywgW3N0cmluZ3NUb0NoZWNrLCBzdHJpbmdzVG9NYXRjaF0pO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhbGwgdmFsdWVzIGZvciBhIHNwZWNpZmllZCBwYXJhbWV0ZXIgdHlwZS5cbiAqL1xuY2xhc3MgRm5SZWZBbGwgZXh0ZW5kcyBGbkJhc2Uge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpSZWZBbGxgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIHBhcmFtZXRlclR5cGUgQW4gQVdTLXNwZWNpZmljIHBhcmFtZXRlciB0eXBlLCBzdWNoIGFzIEFXUzo6RUMyOjpTZWN1cml0eUdyb3VwOjpJZCBvclxuICAgKiAgICAgICAgICAgIEFXUzo6RUMyOjpWUEM6OklkLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFBhcmFtZXRlcnMgaW4gdGhlIEFXU1xuICAgKiAgICAgICAgICAgIENsb3VkRm9ybWF0aW9uIFVzZXIgR3VpZGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJUeXBlOiBzdHJpbmcpIHtcbiAgICBzdXBlcignRm46OlJlZkFsbCcsIHBhcmFtZXRlclR5cGUpO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBhdHRyaWJ1dGUgdmFsdWUgb3IgbGlzdCBvZiB2YWx1ZXMgZm9yIGEgc3BlY2lmaWMgcGFyYW1ldGVyIGFuZCBhdHRyaWJ1dGUuXG4gKi9cbmNsYXNzIEZuVmFsdWVPZiBleHRlbmRzIEZuQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OlZhbHVlT2ZgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIHBhcmFtZXRlck9yTG9naWNhbElkIFRoZSBuYW1lIG9mIGEgcGFyYW1ldGVyIGZvciB3aGljaCB5b3Ugd2FudCB0byByZXRyaWV2ZSBhdHRyaWJ1dGUgdmFsdWVzLiBUaGUgcGFyYW1ldGVyIG11c3QgYmUgZGVjbGFyZWQgaW4gdGhlIFBhcmFtZXRlcnMgc2VjdGlvbiBvZiB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSBhdHRyaWJ1dGUgVGhlIG5hbWUgb2YgYW4gYXR0cmlidXRlIGZyb20gd2hpY2ggeW91IHdhbnQgdG8gcmV0cmlldmUgYSB2YWx1ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmFtZXRlck9yTG9naWNhbElkOiBzdHJpbmcsIGF0dHJpYnV0ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoJ0ZuOjpWYWx1ZU9mJywgW3BhcmFtZXRlck9yTG9naWNhbElkLCBhdHRyaWJ1dGVdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgYSBsaXN0IG9mIGFsbCBhdHRyaWJ1dGUgdmFsdWVzIGZvciBhIGdpdmVuIHBhcmFtZXRlciB0eXBlIGFuZCBhdHRyaWJ1dGUuXG4gKi9cbmNsYXNzIEZuVmFsdWVPZkFsbCBleHRlbmRzIEZuQmFzZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBgRm46OlZhbHVlT2ZBbGxgYCBmdW5jdGlvbi5cbiAgICogQHBhcmFtIHBhcmFtZXRlclR5cGUgQW4gQVdTLXNwZWNpZmljIHBhcmFtZXRlciB0eXBlLCBzdWNoIGFzIEFXUzo6RUMyOjpTZWN1cml0eUdyb3VwOjpJZCBvciBBV1M6OkVDMjo6VlBDOjpJZC4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBQYXJhbWV0ZXJzIGluIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gVXNlciBHdWlkZS5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZSBUaGUgbmFtZSBvZiBhbiBhdHRyaWJ1dGUgZnJvbSB3aGljaCB5b3Ugd2FudCB0byByZXRyaWV2ZSBhIHZhbHVlLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBhdHRyaWJ1dGVzLCBzZWUgU3VwcG9ydGVkIEF0dHJpYnV0ZXMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJUeXBlOiBzdHJpbmcsIGF0dHJpYnV0ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoJ0ZuOjpWYWx1ZU9mQWxsJywgW3BhcmFtZXRlclR5cGUsIGF0dHJpYnV0ZV0pO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGludHJpbnNpYyBmdW5jdGlvbiBgYEZuOjpKb2luYGAgYXBwZW5kcyBhIHNldCBvZiB2YWx1ZXMgaW50byBhIHNpbmdsZSB2YWx1ZSwgc2VwYXJhdGVkIGJ5XG4gKiB0aGUgc3BlY2lmaWVkIGRlbGltaXRlci4gSWYgYSBkZWxpbWl0ZXIgaXMgdGhlIGVtcHR5IHN0cmluZywgdGhlIHNldCBvZiB2YWx1ZXMgYXJlIGNvbmNhdGVuYXRlZFxuICogd2l0aCBubyBkZWxpbWl0ZXIuXG4gKi9cbmNsYXNzIEZuSm9pbiBpbXBsZW1lbnRzIElSZXNvbHZhYmxlIHtcbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0aW9uU3RhY2s6IHN0cmluZ1tdO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZGVsaW1pdGVyOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgbGlzdE9mVmFsdWVzOiBhbnlbXTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBgYEZuOjpKb2luYGAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBkZWxpbWl0ZXIgVGhlIHZhbHVlIHlvdSB3YW50IHRvIG9jY3VyIGJldHdlZW4gZnJhZ21lbnRzLiBUaGUgZGVsaW1pdGVyIHdpbGwgb2NjdXIgYmV0d2VlbiBmcmFnbWVudHMgb25seS5cbiAgICogICAgICAgICAgSXQgd2lsbCBub3QgdGVybWluYXRlIHRoZSBmaW5hbCB2YWx1ZS5cbiAgICogQHBhcmFtIGxpc3RPZlZhbHVlcyBUaGUgbGlzdCBvZiB2YWx1ZXMgeW91IHdhbnQgY29tYmluZWQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkZWxpbWl0ZXI6IHN0cmluZywgbGlzdE9mVmFsdWVzOiBhbnlbXSkge1xuICAgIGlmIChsaXN0T2ZWYWx1ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZuSm9pbiByZXF1aXJlcyBhdCBsZWFzdCBvbmUgdmFsdWUgdG8gYmUgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLmRlbGltaXRlciA9IGRlbGltaXRlcjtcbiAgICB0aGlzLmxpc3RPZlZhbHVlcyA9IGxpc3RPZlZhbHVlcztcbiAgICB0aGlzLmNyZWF0aW9uU3RhY2sgPSBjYXB0dXJlU3RhY2tUcmFjZSgpO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoY29udGV4dDogSVJlc29sdmVDb250ZXh0KTogYW55IHtcbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHRoaXMubGlzdE9mVmFsdWVzKSkge1xuICAgICAgLy8gVGhpcyBpcyBhIGxpc3QgdG9rZW4sIGRvbid0IHRyeSB0byBkbyBzbWFydCB0aGluZ3Mgd2l0aCBpdC5cbiAgICAgIHJldHVybiB7ICdGbjo6Sm9pbic6IFt0aGlzLmRlbGltaXRlciwgdGhpcy5saXN0T2ZWYWx1ZXNdIH07XG4gICAgfVxuICAgIGNvbnN0IHJlc29sdmVkID0gdGhpcy5yZXNvbHZlVmFsdWVzKGNvbnRleHQpO1xuICAgIGlmIChyZXNvbHZlZC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiByZXNvbHZlZFswXTtcbiAgICB9XG4gICAgcmV0dXJuIHsgJ0ZuOjpKb2luJzogW3RoaXMuZGVsaW1pdGVyLCByZXNvbHZlZF0gfTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcodGhpcywgeyBkaXNwbGF5SGludDogJ0ZuOjpKb2luJyB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0b0pTT04oKSB7XG4gICAgcmV0dXJuICc8Rm46OkpvaW4+JztcbiAgfVxuXG4gIC8qKlxuICAgKiBPcHRpbWl6YXRpb246IGlmIGEgRm46OkpvaW4gaXMgbmVzdGVkIGluIGFub3RoZXIgb25lIGFuZCB0aGV5IHNoYXJlIHRoZSBzYW1lIGRlbGltaXRlciwgdGhlbiBmbGF0dGVuIGl0IHVwLiBBbHNvLFxuICAgKiBpZiB0d28gY29uY2F0ZW5hdGVkIGVsZW1lbnRzIGFyZSBsaXRlcmFsIHN0cmluZ3MgKG5vdCB0b2tlbnMpLCB0aGVuIHByZS1jb25jYXRlbmF0ZSB0aGVtIHdpdGggdGhlIGRlbGltaXRlciwgdG9cbiAgICogZ2VuZXJhdGUgc2hvcnRlciBvdXRwdXQuXG4gICAqL1xuICBwcml2YXRlIHJlc29sdmVWYWx1ZXMoY29udGV4dDogSVJlc29sdmVDb250ZXh0KSB7XG4gICAgY29uc3QgcmVzb2x2ZWRWYWx1ZXMgPSB0aGlzLmxpc3RPZlZhbHVlcy5tYXAoeCA9PiBSZWZlcmVuY2UuaXNSZWZlcmVuY2UoeCkgPyB4IDogY29udGV4dC5yZXNvbHZlKHgpKTtcbiAgICByZXR1cm4gbWluaW1hbENsb3VkRm9ybWF0aW9uSm9pbih0aGlzLmRlbGltaXRlciwgcmVzb2x2ZWRWYWx1ZXMpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGBGbjo6VG9Kc29uU3RyaW5nYCBpbnRyaW5zaWMgZnVuY3Rpb24gY29udmVydHMgYW4gb2JqZWN0IG9yIGFycmF5IHRvIGl0c1xuICogY29ycmVzcG9uZGluZyBKU09OIHN0cmluZy5cbiAqL1xuY2xhc3MgRm5Ub0pzb25TdHJpbmcgaW1wbGVtZW50cyBJUmVzb2x2YWJsZSB7XG4gIHB1YmxpYyByZWFkb25seSBjcmVhdGlvblN0YWNrOiBzdHJpbmdbXTtcblxuICBwcml2YXRlIHJlYWRvbmx5IG9iamVjdDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKG9iamVjdDogYW55KSB7XG4gICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgdGhpcy5jcmVhdGlvblN0YWNrID0gY2FwdHVyZVN0YWNrVHJhY2UoKTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCk6IGFueSB7XG4gICAgU3RhY2sub2YoY29udGV4dC5zY29wZSkuYWRkVHJhbnNmb3JtKCdBV1M6Okxhbmd1YWdlRXh0ZW5zaW9ucycpO1xuICAgIHJldHVybiB7ICdGbjo6VG9Kc29uU3RyaW5nJzogdGhpcy5vYmplY3QgfTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcodGhpcywgeyBkaXNwbGF5SGludDogJ0ZuOjpUb0pzb25TdHJpbmcnIH0pO1xuICB9XG5cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICByZXR1cm4gJzxGbjo6VG9Kc29uU3RyaW5nPic7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgaW50cmluc2ljIGZ1bmN0aW9uIGBGbjo6TGVuZ3RoYCByZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgd2l0aGluIGFuIGFycmF5XG4gKiBvciBhbiBpbnRyaW5zaWMgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGFycmF5LlxuICovXG5jbGFzcyBGbkxlbmd0aCBpbXBsZW1lbnRzIElSZXNvbHZhYmxlIHtcbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0aW9uU3RhY2s6IHN0cmluZ1tdO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgYXJyYXk6IGFueTtcblxuICBjb25zdHJ1Y3RvcihhcnJheTogYW55KSB7XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xuICAgIHRoaXMuY3JlYXRpb25TdGFjayA9IGNhcHR1cmVTdGFja1RyYWNlKCk7XG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpOiBhbnkge1xuICAgIFN0YWNrLm9mKGNvbnRleHQuc2NvcGUpLmFkZFRyYW5zZm9ybSgnQVdTOjpMYW5ndWFnZUV4dGVuc2lvbnMnKTtcbiAgICByZXR1cm4geyAnRm46Okxlbmd0aCc6IHRoaXMuYXJyYXkgfTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcodGhpcywgeyBkaXNwbGF5SGludDogJ0ZuOjpMZW5ndGgnIH0pO1xuICB9XG5cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICByZXR1cm4gJzxGbjo6TGVuZ3RoPic7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2luR3JvdXBzT2Y8VD4oYXJyYXk6IFRbXSwgbWF4R3JvdXA6IG51bWJlcik6IFRbXVtdIHtcbiAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PFRbXT4oKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkgKz0gbWF4R3JvdXApIHtcbiAgICByZXN1bHQucHVzaChhcnJheS5zbGljZShpLCBpICsgbWF4R3JvdXApKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiByYW5nZShuOiBudW1iZXIpOiBudW1iZXJbXSB7XG4gIGNvbnN0IHJldCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgIHJldC5wdXNoKGkpO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG4iXX0=