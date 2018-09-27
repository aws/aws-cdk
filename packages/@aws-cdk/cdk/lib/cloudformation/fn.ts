import { CloudFormationToken, isIntrinsic } from './cloudformation-token';
// tslint:disable:max-line-length

/**
 * CloudFormation intrinsic functions.
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html
 */
export class Fn extends CloudFormationToken {
  constructor(name: string, value: any) {
    super(() => ({ [name]: value }));
  }
}

/**
 * The intrinsic function ``Fn::FindInMap`` returns the value corresponding to keys in a two-level
 * map that is declared in the Mappings section.
 */
export class FnFindInMap extends Fn {
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
export class FnGetAtt extends Fn {
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
export class FnGetAZs extends Fn {
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
export class FnImportValue extends Fn {
  /**
   * Creates an ``Fn::ImportValue`` function.
   * @param sharedValueToImport The stack output value that you want to import.
   */
  constructor(sharedValueToImport: string) {
    super('Fn::ImportValue', sharedValueToImport);
  }
}

/**
 * The intrinsic function ``Fn::Join`` appends a set of values into a single value, separated by
 * the specified delimiter. If a delimiter is the empty string, the set of values are concatenated
 * with no delimiter.
 */
export class FnJoin extends Fn {
  /**
   * Creates an ``Fn::Join`` function.
   * @param delimiter The value you want to occur between fragments. The delimiter will occur between fragments only.
   *          It will not terminate the final value.
   * @param listOfValues The list of values you want combined.
   */
  constructor(delimiter: string, listOfValues: any[]) {
    if (listOfValues.length === 0) {
      throw new Error(`FnJoin requires at least one value to be provided`);
    }
    super('Fn::Join', [ delimiter, listOfValues ]);
  }
}

/**
 * Alias for ``FnJoin('', listOfValues)``.
 */
export class FnConcat extends FnJoin {
  private readonly listOfValues: any[];

  /**
   * Creates an ``Fn::Join`` function with an empty delimiter.
   * @param listOfValues The list of values to concatenate.
   */
  constructor(...listOfValues: any[]) {
    // Optimization: if any of the input arguments is also a FnConcat,
    // splice their list of values into the current FnConcat. 'instanceof'
    // can fail, but we do not depend depend on this for correctness.
    //
    // Do the same for resolved intrinsics, so we can detect this
    // happening both at Token as well as at CloudFormation level.

    let i = 0;
    while (i < listOfValues.length) {
      const el = listOfValues[i];
      if (el instanceof FnConcat) {
        listOfValues.splice(i, 1, ...el.listOfValues);
        i += el.listOfValues.length;
      } else if (isConcatIntrinsic(el)) {
        const values = concatIntrinsicValues(el);
        listOfValues.splice(i, 1, ...values);
        i += values;
      } else {
        i++;
      }
    }

    super('', listOfValues);
    this.listOfValues = listOfValues;
  }
}

/**
 * Return whether the given object represents a CloudFormation intrinsic that is the result of a FnConcat resolution
 */
function isConcatIntrinsic(x: any) {
  return isIntrinsic(x) && Object.keys(x)[0] === 'Fn::Join' && x['Fn::Join'][0] === '';
}

/**
 * Return the concatted values of the concat intrinsic
 */
function concatIntrinsicValues(x: any) {
  return x['Fn::Join'][1];
}

/**
 * The intrinsic function ``Fn::Select`` returns a single object from a list of objects by index.
 */
export class FnSelect extends Fn {
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
export class FnSplit extends Fn {
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
export class FnSub extends Fn {
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
export class FnBase64 extends Fn {

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
export class FnCidr extends Fn {
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

/**
 * You can use intrinsic functions, such as ``Fn::If``, ``Fn::Equals``, and ``Fn::Not``, to conditionally
 * create stack resources. These conditions are evaluated based on input parameters that you
 * declare when you create or update a stack. After you define all your conditions, you can
 * associate them with resources or resource properties in the Resources and Outputs sections
 * of a template.
 *
 * You define all conditions in the Conditions section of a template except for ``Fn::If`` conditions.
 * You can use the ``Fn::If`` condition in the metadata attribute, update policy attribute, and property
 * values in the Resources section and Outputs sections of a template.
 *
 * You might use conditions when you want to reuse a template that can create resources in different
 * contexts, such as a test environment versus a production environment. In your template, you can
 * add an EnvironmentType input parameter, which accepts either prod or test as inputs. For the
 * production environment, you might include Amazon EC2 instances with certain capabilities;
 * however, for the test environment, you want to use less capabilities to save costs. With
 * conditions, you can define which resources are created and how they're configured for each
 * environment type.
 */
export class FnCondition extends Fn {

}

/**
 * Returns true if all the specified conditions evaluate to true, or returns false if any one
 *  of the conditions evaluates to false. ``Fn::And`` acts as an AND operator. The minimum number of
 * conditions that you can include is 2, and the maximum is 10.
 */
export class FnAnd extends FnCondition {
  constructor(...condition: FnCondition[]) {
    super('Fn::And', condition);
  }
}

/**
 * Compares if two values are equal. Returns true if the two values are equal or false
 * if they aren't.
 */
export class FnEquals extends FnCondition {
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
export class FnIf extends FnCondition {
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
export class FnNot extends FnCondition {
  /**
   * Creates an ``Fn::Not`` condition function.
   * @param condition A condition such as ``Fn::Equals`` that evaluates to true or false.
   */
  constructor(condition: FnCondition) {
    super('Fn::Not', [ condition ]);
  }
}

/**
 * Returns true if any one of the specified conditions evaluate to true, or returns false if
 * all of the conditions evaluates to false. ``Fn::Or`` acts as an OR operator. The minimum number
 * of conditions that you can include is 2, and the maximum is 10.
 */
export class FnOr extends FnCondition {
  /**
   * Creates an ``Fn::Or`` condition function.
   * @param condition A condition that evaluates to true or false.
   */
  constructor(...condition: FnCondition[]) {
    super('Fn::Or', condition);
  }
}

/**
 * Returns true if a specified string matches at least one value in a list of strings.
 */
export class FnContains extends FnCondition {
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
export class FnEachMemberEquals extends FnCondition {
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
export class FnEachMemberIn extends FnCondition {
  /**
   * Creates an ``Fn::EachMemberIn`` function.
   * @param stringsToCheck A list of strings, such as "A", "B", "C". AWS CloudFormation checks whether each member in the strings_to_check parameter is in the strings_to_match parameter.
   * @param stringsToMatch A list of strings, such as "A", "B", "C". Each member in the strings_to_match parameter is compared against the members of the strings_to_check parameter.
   */
  constructor(stringsToCheck: any, stringsToMatch: any) {
    super('Fn::EachMemberIn', [ [stringsToCheck], stringsToMatch ]);
  }
}

/**
 * Returns all values for a specified parameter type.
 */
export class FnRefAll extends FnCondition {
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
export class FnValueOf extends FnCondition {
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
export class FnValueOfAll extends FnCondition {
  /**
   * Creates an ``Fn::ValueOfAll`` function.
   * @param parameterType An AWS-specific parameter type, such as AWS::EC2::SecurityGroup::Id or AWS::EC2::VPC::Id. For more information, see Parameters in the AWS CloudFormation User Guide.
   * @param attribute The name of an attribute from which you want to retrieve a value. For more information about attributes, see Supported Attributes.
   */
  constructor(parameterType: string, attribute: string) {
    super('Fn::ValueOfAll', [ parameterType, attribute ]);
  }
}
