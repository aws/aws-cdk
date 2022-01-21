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
    readonly mapOfNumbers: {
        [key: string]: number;
    };
}
export declare enum MyNormalEnum {
    ENUM_MEMBER_1 = 0,
    ENUM_MEMBER_2 = 1,
    ENUM_MEMBER_3 = 2
}
