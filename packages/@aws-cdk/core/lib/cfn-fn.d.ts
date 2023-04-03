import { ICfnConditionExpression, ICfnRuleConditionExpression } from './cfn-condition';
import { IResolvable } from './resolvable';
/**
 * CloudFormation intrinsic functions.
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html
 */
export declare class Fn {
    /**
     * The ``Ref`` intrinsic function returns the value of the specified parameter or resource.
     * Note that it doesn't validate the logicalName, it mainly serves paremeter/resource reference defined in a ``CfnInclude`` template.
     * @param logicalName The logical name of a parameter/resource for which you want to retrieve its value.
     */
    static ref(logicalName: string): string;
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
    static getAtt(logicalNameOfResource: string, attributeName: string): IResolvable;
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
    static join(delimiter: string, listOfValues: string[]): string;
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
    static split(delimiter: string, source: string, assumedLength?: number): string[];
    /**
     * The intrinsic function ``Fn::Select`` returns a single object from a list of objects by index.
     * @param index The index of the object to retrieve. This must be a value from zero to N-1, where N represents the number of elements in the array.
     * @param array The list of objects to select from. This list must not be null, nor can it have null entries.
     * @returns a token represented as a string
     */
    static select(index: number, array: string[]): string;
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
    static sub(body: string, variables?: {
        [key: string]: string;
    }): string;
    /**
     * The intrinsic function ``Fn::Base64`` returns the Base64 representation of
     * the input string. This function is typically used to pass encoded data to
     * Amazon EC2 instances by way of the UserData property.
     * @param data The string value you want to convert to Base64.
     * @returns a token represented as a string
     */
    static base64(data: string): string;
    /**
     * The intrinsic function ``Fn::Cidr`` returns the specified Cidr address block.
     * @param ipBlock  The user-specified default Cidr address block.
     * @param count  The number of subnets' Cidr block wanted. Count can be 1 to 256.
     * @param sizeMask The digit covered in the subnet.
     * @returns a token represented as a string
     */
    static cidr(ipBlock: string, count: number, sizeMask?: string): string[];
    /**
     * Given an url, parse the domain name
     * @param url the url to parse
     */
    static parseDomainName(url: string): string;
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
    static getAzs(region?: string): string[];
    /**
     * The intrinsic function ``Fn::ImportValue`` returns the value of an output
     * exported by another stack. You typically use this function to create
     * cross-stack references. In the following example template snippets, Stack A
     * exports VPC security group values and Stack B imports them.
     * @param sharedValueToImport The stack output value that you want to import.
     * @returns a token represented as a string
     */
    static importValue(sharedValueToImport: string): string;
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
    static importListValue(sharedValueToImport: string, assumedLength: number, delimiter?: string): string[];
    /**
     * The intrinsic function ``Fn::FindInMap`` returns the value corresponding to
     * keys in a two-level map that is declared in the Mappings section.
     * @returns a token represented as a string
     */
    static findInMap(mapName: string, topLevelKey: string, secondLevelKey: string): string;
    /**
     * An additional function used in CfnParser,
     * as Fn::FindInMap does not always return a string.
     *
     * @internal
     */
    static _findInMap(mapName: string, topLevelKey: string, secondLevelKey: string): IResolvable;
    /**
     * Creates a token representing the ``Fn::Transform`` expression
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-transform.html
     * @param macroName The name of the macro to perform the processing
     * @param parameters The parameters to be passed to the macro
     * @returns a token representing the transform expression
     */
    static transform(macroName: string, parameters: {
        [name: string]: any;
    }): IResolvable;
    /**
     * Returns true if all the specified conditions evaluate to true, or returns
     * false if any one of the conditions evaluates to false. ``Fn::And`` acts as
     * an AND operator. The minimum number of conditions that you can include is
     * 1.
     * @param conditions conditions to AND
     * @returns an FnCondition token
     */
    static conditionAnd(...conditions: ICfnConditionExpression[]): ICfnRuleConditionExpression;
    /**
     * Compares if two values are equal. Returns true if the two values are equal
     * or false if they aren't.
     * @param lhs A value of any type that you want to compare.
     * @param rhs A value of any type that you want to compare.
     * @returns an FnCondition token
     */
    static conditionEquals(lhs: any, rhs: any): ICfnRuleConditionExpression;
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
    static conditionIf(conditionId: string, valueIfTrue: any, valueIfFalse: any): ICfnRuleConditionExpression;
    /**
     * Returns true for a condition that evaluates to false or returns false for a
     * condition that evaluates to true. ``Fn::Not`` acts as a NOT operator.
     * @param condition A condition such as ``Fn::Equals`` that evaluates to true
     * or false.
     * @returns an FnCondition token
     */
    static conditionNot(condition: ICfnConditionExpression): ICfnRuleConditionExpression;
    /**
     * Returns true if any one of the specified conditions evaluate to true, or
     * returns false if all of the conditions evaluates to false. ``Fn::Or`` acts
     * as an OR operator. The minimum number of conditions that you can include is
     * 1.
     * @param conditions conditions that evaluates to true or false.
     * @returns an FnCondition token
     */
    static conditionOr(...conditions: ICfnConditionExpression[]): ICfnRuleConditionExpression;
    /**
     * Returns true if a specified string matches at least one value in a list of
     * strings.
     * @param listOfStrings A list of strings, such as "A", "B", "C".
     * @param value A string, such as "A", that you want to compare against a list of strings.
     * @returns an FnCondition token
     */
    static conditionContains(listOfStrings: string[], value: string): ICfnRuleConditionExpression;
    /**
     * Returns true if a specified string matches all values in a list.
     * @param listOfStrings A list of strings, such as "A", "B", "C".
     * @param value A string, such as "A", that you want to compare against a list
     * of strings.
     * @returns an FnCondition token
     */
    static conditionEachMemberEquals(listOfStrings: string[], value: string): ICfnRuleConditionExpression;
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
    static conditionEachMemberIn(stringsToCheck: string[], stringsToMatch: string[]): ICfnRuleConditionExpression;
    /**
     * Returns all values for a specified parameter type.
     * @param parameterType An AWS-specific parameter type, such as
     * AWS::EC2::SecurityGroup::Id or AWS::EC2::VPC::Id. For more information, see
     * Parameters in the AWS CloudFormation User Guide.
     * @returns a token represented as a string array
     */
    static refAll(parameterType: string): string[];
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
    static valueOf(parameterOrLogicalId: string, attribute: string): string;
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
    static valueOfAll(parameterType: string, attribute: string): string[];
    /**
     * The `Fn::ToJsonString` intrinsic function converts an object or array to its
     * corresponding JSON string.
     *
     * @param object The object or array to stringify
     */
    static toJsonString(object: any): string;
    /**
     * The intrinsic function `Fn::Length` returns the number of elements within an array
     * or an intrinsic function that returns an array.
     *
     * @param array The array you want to return the number of elements from
     */
    static len(array: any): number;
    private constructor();
}
