/**
 * Tests how an array with a bunch of primitives is represented in JSON schema.
 */
export interface InterfaceWithPrimitives {
  /**
   * A property of type number.
   */
  numberProperty: number;

  /**
   * A property of type string.
   */
  stringProperty: string;

  /**
   * Array of strings.
   */
  arrayOfStrings: string[];

  /**
   * Optional boolean
   */
  optionalBoolean?: boolean;

  //
  // intentionally left blank (to check that description is omitted)
  //
  mapOfNumbers: { [key: string]: number }
}

export enum MyNormalEnum {
  EnumMember1,
  EnumMember2,
  EnumMember3
}