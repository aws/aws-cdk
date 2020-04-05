import { ICfnConditionExpression } from './cfn-condition';
import { minimalCloudFormationJoin } from './private/cloudformation-lang';
import { Intrinsic } from './private/intrinsic';
import { Reference } from './reference';
import { IResolvable, IResolveContext } from './resolvable';
import { captureStackTrace } from './stack-trace';
import { Token } from './token';

// tslint:disable:max-line-length

/**
 * CloudFormation intrinsic functions.
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html
 */
export class Fn {
  /**
   * The ``Ref`` intrinsic function returns the value of the specified parameter or resource.
   * Note that it doesn't validate the logicalName, it mainly serves paremeter/resource reference defined in a ``CfnInclude`` template.
   * @param logicalName The logical name of a parameter/resource for which you want to retrieve its value.
   */
  public static ref(logicalName: string): string {
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
  public static getAtt(logicalNameOfResource: string, attributeName: string): IResolvable {
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
  public static join(delimiter: string, listOfValues: string[]): string {
    if (listOfValues.length === 0) {
      throw new Error('FnJoin requires at least one value to be provided');
    }

    return new FnJoin(delimiter, listOfValues).toString();
  }

  /**
   * To split a string into a list of string values so that you can select an element from the
   * resulting string list, use the ``Fn::Split`` intrinsic function. Specify the location of splits
   * with a delimiter, such as , (a comma). After you split a string, use the ``Fn::Select`` function
   * to pick a specific element.
   * @param delimiter A string value that determines where the source string is divided.
   * @param source The string value that you want to split.
   * @returns a token represented as a string array
   */
  public static split(delimiter: string, source: string): string[] {

    // short-circut if source is not a token
    if (!Token.isUnresolved(source)) {
      return source.split(delimiter);
    }

    return Token.asList(new FnSplit(delimiter, source));
  }

  /**
   * The intrinsic function ``Fn::Select`` returns a single object from a list of objects by index.
   * @param index The index of the object to retrieve. This must be a value from zero to N-1, where N represents the number of elements in the array.
   * @param array The list of objects to select from. This list must not be null, nor can it have null entries.
   * @returns a token represented as a string
   */
  public static select(index: number, array: string[]): string {
    if (!Token.isUnresolved(array)) {
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
  public static sub(body: string, variables?: { [key: string]: string }): string {
    return new FnSub(body, variables).toString();
  }

  /**
   * The intrinsic function ``Fn::Base64`` returns the Base64 representation of
   * the input string. This function is typically used to pass encoded data to
   * Amazon EC2 instances by way of the UserData property.
   * @param data The string value you want to convert to Base64.
   * @returns a token represented as a string
   */
  public static base64(data: string): string {
    return new FnBase64(data).toString();
  }

  /**
   * The intrinsic function ``Fn::Cidr`` returns the specified Cidr address block.
   * @param ipBlock  The user-specified default Cidr address block.
   * @param count  The number of subnets' Cidr block wanted. Count can be 1 to 256.
   * @param sizeMask The digit covered in the subnet.
   * @returns a token represented as a string
   */
  public static cidr(ipBlock: string, count: number, sizeMask?: string): string[] {
    return Token.asList(new FnCidr(ipBlock, count, sizeMask));
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
  public static getAzs(region?: string): string[] {
    return Token.asList(new FnGetAZs(region));
  }

  /**
   * The intrinsic function ``Fn::ImportValue`` returns the value of an output
   * exported by another stack. You typically use this function to create
   * cross-stack references. In the following example template snippets, Stack A
   * exports VPC security group values and Stack B imports them.
   * @param sharedValueToImport The stack output value that you want to import.
   * @returns a token represented as a string
   */
  public static importValue(sharedValueToImport: string): string {
    return new FnImportValue(sharedValueToImport).toString();
  }

  /**
   * The intrinsic function ``Fn::FindInMap`` returns the value corresponding to
   * keys in a two-level map that is declared in the Mappings section.
   * @returns a token represented as a string
   */
  public static findInMap(mapName: string, topLevelKey: string, secondLevelKey: string): string {
    return new FnFindInMap(mapName, topLevelKey, secondLevelKey).toString();
  }

  /**
   * Returns true if all the specified conditions evaluate to true, or returns
   * false if any one of the conditions evaluates to false. ``Fn::And`` acts as
   * an AND operator. The minimum number of conditions that you can include is
   * 2, and the maximum is 10.
   * @param conditions conditions to AND
   * @returns an FnCondition token
   */
  public static conditionAnd(...conditions: ICfnConditionExpression[]): ICfnConditionExpression {
    return new FnAnd(...conditions);
  }

  /**
   * Compares if two values are equal. Returns true if the two values are equal
   * or false if they aren't.
   * @param lhs A value of any type that you want to compare.
   * @param rhs A value of any type that you want to compare.
   * @returns an FnCondition token
   */
  public static conditionEquals(lhs: any, rhs: any): ICfnConditionExpression {
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
  public static conditionIf(conditionId: string, valueIfTrue: any, valueIfFalse: any): ICfnConditionExpression {
    return new FnIf(conditionId, valueIfTrue, valueIfFalse);
  }

  /**
   * Returns true for a condition that evaluates to false or returns false for a
   * condition that evaluates to true. ``Fn::Not`` acts as a NOT operator.
   * @param condition A condition such as ``Fn::Equals`` that evaluates to true
   * or false.
   * @returns an FnCondition token
   */
  public static conditionNot(condition: ICfnConditionExpression): ICfnConditionExpression {
    return new FnNot(condition);
  }

  /**
   * Returns true if any one of the specified conditions evaluate to true, or
   * returns false if all of the conditions evaluates to false. ``Fn::Or`` acts
   * as an OR operator. The minimum number of conditions that you can include is
   * 2, and the maximum is 10.
   * @param conditions conditions that evaluates to true or false.
   * @returns an FnCondition token
   */
  public static conditionOr(...conditions: ICfnConditionExpression[]): ICfnConditionExpression {
    return new FnOr(...conditions);
  }

  /**
   * Returns true if a specified string matches at least one value in a list of
   * strings.
   * @param listOfStrings A list of strings, such as "A", "B", "C".
   * @param value A string, such as "A", that you want to compare against a list of strings.
   * @returns an FnCondition token
   */
  public static conditionContains(listOfStrings: string[], value: string): ICfnConditionExpression {
    return new FnContains(listOfStrings, value);
  }

  /**
   * Returns true if a specified string matches all values in a list.
   * @param listOfStrings A list of strings, such as "A", "B", "C".
   * @param value A string, such as "A", that you want to compare against a list
   * of strings.
   * @returns an FnCondition token
   */
  public static conditionEachMemberEquals(listOfStrings: string[], value: string): ICfnConditionExpression {
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
  public static conditionEachMemberIn(stringsToCheck: string[], stringsToMatch: string[]): ICfnConditionExpression {
    return new FnEachMemberIn(stringsToCheck, stringsToMatch);
  }

  /**
   * Returns all values for a specified parameter type.
   * @param parameterType An AWS-specific parameter type, such as
   * AWS::EC2::SecurityGroup::Id or AWS::EC2::VPC::Id. For more information, see
   * Parameters in the AWS CloudFormation User Guide.
   * @returns a token represented as a string array
   */
  public static refAll(parameterType: string): string[] {
    return Token.asList(new FnRefAll(parameterType));
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
  public static valueOf(parameterOrLogicalId: string, attribute: string): string {
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
  public static valueOfAll(parameterType: string, attribute: string): string[] {
    return Token.asList(new FnValueOfAll(parameterType, attribute));
  }

  private constructor() { }
}

/**
 * Base class for tokens that represent CloudFormation intrinsic functions.
 */
class FnBase extends Intrinsic {
  constructor(name: string, value: any) {
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
  constructor(logicalName: string) {
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
  constructor(mapName: string, topLevelKey: any, secondLevelKey: any) {
    super('Fn::FindInMap', [ mapName, topLevelKey, secondLevelKey ]);
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
  constructor(logicalNameOfResource: string, attributeName: string) {
    super('Fn::GetAtt', [ logicalNameOfResource, attributeName ]);
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
  constructor(region?: string) {
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
  constructor(sharedValueToImport: string) {
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
  constructor(index: number, array: any) {
    super('Fn::Select', [ index, array ]);
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
  constructor(delimiter: string, source: any) {
    super('Fn::Split', [ delimiter, source ]);
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
  constructor(body: string, variables?: { [key: string]: any }) {
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
  constructor(data: any) {
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
  constructor(ipBlock: any, count: any, sizeMask?: any) {
    if (count < 1 || count > 256) {
      throw new Error(`Fn::Cidr's count attribute must be betwen 1 and 256, ${count} was provided.`);
    }
    super('Fn::Cidr', [ipBlock, count, sizeMask]);
  }
}

class FnConditionBase extends Intrinsic implements ICfnConditionExpression {
  constructor(type: string, value: any) {
    super({ [type]: value });
  }
}

/**
 * Returns true if all the specified conditions evaluate to true, or returns false if any one
 *  of the conditions evaluates to false. ``Fn::And`` acts as an AND operator. The minimum number of
 * conditions that you can include is 2, and the maximum is 10.
 */
class FnAnd extends FnConditionBase {
  constructor(...condition: ICfnConditionExpression[]) {
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
  constructor(lhs: any, rhs: any) {
    super('Fn::Equals', [ lhs, rhs ]);
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
  constructor(condition: string, valueIfTrue: any, valueIfFalse: any) {
    super('Fn::If', [ condition, valueIfTrue, valueIfFalse ]);
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
  constructor(condition: ICfnConditionExpression) {
    super('Fn::Not', [ condition ]);
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
  constructor(...condition: ICfnConditionExpression[]) {
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
  constructor(listOfStrings: any, value: string) {
    super('Fn::Contains', [ listOfStrings, value ]);
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
  constructor(listOfStrings: any, value: string) {
    super('Fn::EachMemberEquals', [ listOfStrings, value ]);
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
  constructor(stringsToCheck: string[], stringsToMatch: string[]) {
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
  constructor(parameterType: string) {
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
  constructor(parameterOrLogicalId: string, attribute: string) {
    super('Fn::ValueOf', [ parameterOrLogicalId, attribute ]);
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
  constructor(parameterType: string, attribute: string) {
    super('Fn::ValueOfAll', [ parameterType, attribute ]);
  }
}

/**
 * The intrinsic function ``Fn::Join`` appends a set of values into a single value, separated by
 * the specified delimiter. If a delimiter is the empty string, the set of values are concatenated
 * with no delimiter.
 */
class FnJoin implements IResolvable {
  public readonly creationStack: string[];

  private readonly delimiter: string;
  private readonly listOfValues: any[];

  /**
   * Creates an ``Fn::Join`` function.
   * @param delimiter The value you want to occur between fragments. The delimiter will occur between fragments only.
   *          It will not terminate the final value.
   * @param listOfValues The list of values you want combined.
   */
  constructor(delimiter: string, listOfValues: any[]) {
    if (listOfValues.length === 0) {
      throw new Error('FnJoin requires at least one value to be provided');
    }

    this.delimiter = delimiter;
    this.listOfValues = listOfValues;
    this.creationStack = captureStackTrace();
  }

  public resolve(context: IResolveContext): any {
    if (Token.isUnresolved(this.listOfValues)) {
      // This is a list token, don't try to do smart things with it.
      return { 'Fn::Join': [ this.delimiter, this.listOfValues ] };
    }
    const resolved = this.resolveValues(context);
    if (resolved.length === 1) {
      return resolved[0];
    }
    return { 'Fn::Join': [ this.delimiter, resolved ] };
  }

  public toString() {
    return Token.asString(this, { displayHint: 'Fn::Join' });
  }

  public toJSON() {
    return '<Fn::Join>';
  }

  /**
   * Optimization: if an Fn::Join is nested in another one and they share the same delimiter, then flatten it up. Also,
   * if two concatenated elements are literal strings (not tokens), then pre-concatenate them with the delimiter, to
   * generate shorter output.
   */
  private resolveValues(context: IResolveContext) {
    const resolvedValues = this.listOfValues.map(x => Reference.isReference(x) ? x : context.resolve(x));
    return  minimalCloudFormationJoin(this.delimiter, resolvedValues);
  }
}
