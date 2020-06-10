import { transformAttributeValueMap } from './private/utils';

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
 * Property for any key
 */
export interface DynamoAttribute {
  /**
   * The name of the attribute
   */
  readonly name: string;

  /**
   * The value of the attribute
   */
  readonly value: DynamoAttributeValue;
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
 * Map of string to AttributeValue
 */
export interface DynamoAttributeValueMap {
  [key: string]: DynamoAttributeValue;
}

/**
 * Class to generate AttributeValue
 */
export class DynamoAttributeValue {
  private attributeValue: any = {};

  /**
   * Sets an attribute of type String. For example:  "S": "Hello"
   */
  public withS(value: string) {
    this.attributeValue.S = value;
    return this;
  }

  /**
   * Sets an attribute of type Number. For example:  "N": "123.45"
   * Numbers are sent across the network to DynamoDB as strings,
   * to maximize compatibility across languages and libraries.
   * However, DynamoDB treats them as number type attributes for mathematical operations.
   */
  public withN(value: string) {
    this.attributeValue.N = value;
    return this;
  }

  /**
   * Sets an attribute of type Binary. For example:  "B": "dGhpcyB0ZXh0IGlzIGJhc2U2NC1lbmNvZGVk"
   */
  public withB(value: string) {
    this.attributeValue.B = value;
    return this;
  }

  /**
   * Sets an attribute of type String Set. For example:  "SS": ["Giraffe", "Hippo" ,"Zebra"]
   */
  public withSS(value: string[]) {
    this.attributeValue.SS = value;
    return this;
  }

  /**
   * Sets an attribute of type Number Set. For example:  "NS": ["42.2", "-19", "7.5", "3.14"]
   * Numbers are sent across the network to DynamoDB as strings,
   * to maximize compatibility across languages and libraries.
   * However, DynamoDB treats them as number type attributes for mathematical operations.
   */
  public withNS(value: string[]) {
    this.attributeValue.NS = value;
    return this;
  }

  /**
   * Sets an attribute of type Binary Set. For example:  "BS": ["U3Vubnk=", "UmFpbnk=", "U25vd3k="]
   */
  public withBS(value: string[]) {
    this.attributeValue.BS = value;
    return this;
  }

  /**
   * Sets an attribute of type Map. For example:  "M": {"Name": {"S": "Joe"}, "Age": {"N": "35"}}
   */
  public withM(value: DynamoAttributeValueMap) {
    this.attributeValue.M = transformAttributeValueMap(value);
    return this;
  }

  /**
   * Sets an attribute of type List. For example:  "L": [ {"S": "Cookies"} , {"S": "Coffee"}, {"N", "3.14159"}]
   */
  public withL(value: DynamoAttributeValue[]) {
    this.attributeValue.L = value.map((val) => val.toObject());
    return this;
  }

  /**
   * Sets an attribute of type Null. For example:  "NULL": true
   */
  public withNULL(value: boolean) {
    this.attributeValue.NULL = value;
    return this;
  }

  /**
   * Sets an attribute of type Boolean. For example:  "BOOL": true
   */
  public withBOOL(value: boolean) {
    this.attributeValue.BOOL = value;
    return this;
  }

  /**
   * Return the attributeValue object
   */
  public toObject() {
    return this.attributeValue;
  }
}
