import { transformAttributeValueMap, validateJsonPath } from './private/utils';

/**
 * Determines the level of detail about provisioned throughput consumption that is returned.
 */
export enum DynamoConsumedCapacity {
  /**
   * The response includes the aggregate ConsumedCapacity for the operation,
   * together with ConsumedCapacity for each table and secondary index that was accessed
   */
  INDEXES = 'INDEXES',

  /**
   * The response includes only the aggregate ConsumedCapacity for the operation.
   */
  TOTAL = 'TOTAL',

  /**
   * No ConsumedCapacity details are included in the response.
   */
  NONE = 'NONE',
}

/**
 * Determines whether item collection metrics are returned.
 */
export enum DynamoItemCollectionMetrics {
  /**
   * If set to SIZE, the response includes statistics about item collections,
   * if any, that were modified during the operation.
   */
  SIZE = 'SIZE',

  /**
   * If set to NONE, no statistics are returned.
   */
  NONE = 'NONE',
}

/**
 * Use ReturnValues if you want to get the item attributes as they appear before or after they are changed
 */
export enum DynamoReturnValues {
  /**
   * Nothing is returned
   */
  NONE = 'NONE',

  /**
   * Returns all of the attributes of the item
   */
  ALL_OLD = 'ALL_OLD',

  /**
   * Returns only the updated attributes
   */
  UPDATED_OLD = 'UPDATED_OLD',

  /**
   * Returns all of the attributes of the item
   */
  ALL_NEW = 'ALL_NEW',

  /**
   * Returns only the updated attributes
   */
  UPDATED_NEW = 'UPDATED_NEW',
}

/**
 * Class to generate projection expression
 */
export class DynamoProjectionExpression {
  private expression: string[] = [];

  /**
   * Adds the passed attribute to the chain
   *
   * @param attr Attribute name
   */
  public withAttribute(attr: string): DynamoProjectionExpression {
    if (this.expression.length) {
      this.expression.push(`.${attr}`);
    } else {
      this.expression.push(attr);
    }
    return this;
  }

  /**
   * Adds the array literal access for passed index
   *
   * @param index array index
   */
  public atIndex(index: number): DynamoProjectionExpression {
    if (!this.expression.length) {
      throw new Error('Expression must start with an attribute');
    }

    this.expression.push(`[${index}]`);
    return this;
  }

  /**
   * converts and return the string expression
   */
  public toString(): string {
    return this.expression.join('');
  }
}

/**
 * Represents the data for an attribute.
 * Each attribute value is described as a name-value pair.
 * The name is the data type, and the value is the data itself.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html
 */
export class DynamoAttributeValue {
  /**
   * Sets an attribute of type String. For example:  "S": "Hello"
   * Strings may be literal values or as JsonPath. Example values:
   *
   * - `DynamoAttributeValue.fromString('someValue')`
   * - `DynamoAttributeValue.fromString(JsonPath.stringAt('$.bar'))`
   */
  public static fromString(value: string) {
    return new DynamoAttributeValue({ S: value });
  }

  /**
   * Sets a literal number. For example: 1234
   * Numbers are sent across the network to DynamoDB as strings,
   * to maximize compatibility across languages and libraries.
   * However, DynamoDB treats them as number type attributes for mathematical operations.
   */
  public static fromNumber(value: number) {
    return new DynamoAttributeValue({ N: value.toString() });
  }

  /**
   * Sets an attribute of type Number. For example:  "N": "123.45"
   * Numbers are sent across the network to DynamoDB as strings,
   * to maximize compatibility across languages and libraries.
   * However, DynamoDB treats them as number type attributes for mathematical operations.
   *
   * Numbers may be expressed as literal strings or as JsonPath
   */
  public static numberFromString(value: string) {
    return new DynamoAttributeValue({ N: value.toString() });
  }

  /**
   * Sets an attribute of type Binary. For example:  "B": "dGhpcyB0ZXh0IGlzIGJhc2U2NC1lbmNvZGVk"
   *
   * @param value base-64 encoded string
   */
  public static fromBinary(value: string) {
    return new DynamoAttributeValue({ B: value });
  }

  /**
   * Sets an attribute of type String Set. For example:  "SS": ["Giraffe", "Hippo" ,"Zebra"]
   */
  public static fromStringSet(value: string[]) {
    return new DynamoAttributeValue({ SS: value });
  }

  /**
   * Sets an attribute of type Number Set. For example:  "NS": ["42.2", "-19", "7.5", "3.14"]
   * Numbers are sent across the network to DynamoDB as strings,
   * to maximize compatibility across languages and libraries.
   * However, DynamoDB treats them as number type attributes for mathematical operations.
   */
  public static fromNumberSet(value: number[]) {
    return new DynamoAttributeValue({ NS: value.map(String) });
  }

  /**
   * Sets an attribute of type Number Set. For example:  "NS": ["42.2", "-19", "7.5", "3.14"]
   * Numbers are sent across the network to DynamoDB as strings,
   * to maximize compatibility across languages and libraries.
   * However, DynamoDB treats them as number type attributes for mathematical operations.
   *
   * Numbers may be expressed as literal strings or as JsonPath
   */
  public static numberSetFromStrings(value: string[]) {
    return new DynamoAttributeValue({ NS: value });
  }

  /**
   * Sets an attribute of type Binary Set. For example:  "BS": ["U3Vubnk=", "UmFpbnk=", "U25vd3k="]
   */
  public static fromBinarySet(value: string[]) {
    return new DynamoAttributeValue({ BS: value });
  }

  /**
   * Sets an attribute of type Map. For example:  "M": {"Name": {"S": "Joe"}, "Age": {"N": "35"}}
   */
  public static fromMap(value: { [key: string]: DynamoAttributeValue }) {
    return new DynamoAttributeValue({ M: transformAttributeValueMap(value) });
  }

  /**
   * Sets an attribute of type Map. For example:  "M": {"Name": {"S": "Joe"}, "Age": {"N": "35"}}
   *
   * @param value Json path that specifies state input to be used
   */
  public static mapFromJsonPath(value: string) {
    validateJsonPath(value);
    return new DynamoAttributeValue({ 'M.$': value });
  }

  /**
   * Sets an attribute of type List. For example:  "L": [ {"S": "Cookies"} , {"S": "Coffee"}, {"N", "3.14159"}]
   */
  public static fromList(value: DynamoAttributeValue[]) {
    return new DynamoAttributeValue({ L: value.map((val) => val.toObject()) });
  }

  /**
   * Sets an attribute of type List. For example:  "L": [ {"S": "Cookies"} , {"S": "Coffee"}, {"S", "Veggies"}]
   *
   * @param value Json path that specifies state input to be used
   */
  public static listFromJsonPath(value: string) {
    validateJsonPath(value);
    return new DynamoAttributeValue({ L: value });
  }

  /**
   * Sets an attribute of type Null. For example:  "NULL": true
   */
  public static fromNull(value: boolean) {
    return new DynamoAttributeValue({ NULL: value });
  }

  /**
   * Sets an attribute of type Boolean. For example:  "BOOL": true
   */
  public static fromBoolean(value: boolean) {
    return new DynamoAttributeValue({ BOOL: value });
  }

  /**
   * Sets an attribute of type Boolean from state input through Json path.
   * For example:  "BOOL": true
   *
   * @param value Json path that specifies state input to be used
   */
  public static booleanFromJsonPath(value: string) {
    validateJsonPath(value);
    return new DynamoAttributeValue({ BOOL: value.toString() });
  }

  /**
   * Represents the data for the attribute. Data can be
   * i.e. "S": "Hello"
   */
  public readonly attributeValue: any;

  private constructor(value: any) {
    this.attributeValue = value;
  }

  /**
   * Returns the DynamoDB attribute value
   */
  public toObject() {
    return this.attributeValue;
  }
}
