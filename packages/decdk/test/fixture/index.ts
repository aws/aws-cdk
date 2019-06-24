/**
 * Tests how an array with a bunch of primitives is represented in JSON schema.
 */
export interface InterfaceWithPrimitives {
  /**
   * A property of type number.
   */
  readonly numberProperty: number;

  /**
   * A property of type string.
   */
  readonly stringProperty: string;

  /**
   * Array of strings.
   */
  readonly arrayOfStrings: string[];

  /**
   * Optional boolean
   */
  readonly optionalBoolean?: boolean;

  //
  // intentionally left blank (to check that description is omitted)
  //
  readonly mapOfNumbers: { [key: string]: number }
}

export enum MyNormalEnum {
  ENUM_MEMBER_1,
  ENUM_MEMBER_2,
  ENUM_MEMBER_3
}
