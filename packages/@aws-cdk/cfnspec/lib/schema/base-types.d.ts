export interface Documented {
    /** A link to the AWS CloudFormation User Guide that provides informations about the entity. */
    Documentation?: string;
}
export declare enum PrimitiveType {
    String = "String",
    Long = "Long",
    Integer = "Integer",
    Double = "Double",
    Boolean = "Boolean",
    Timestamp = "Timestamp",
    Json = "Json"
}
export declare function isPrimitiveType(str: string): str is PrimitiveType;
