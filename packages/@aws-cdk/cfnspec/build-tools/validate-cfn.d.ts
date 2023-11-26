export interface CfnSpec {
    PropertyTypes: Record<string, any>;
    ResourceTypes: Record<string, any>;
    ResourceSpecificationVersion: string;
}
export interface ValidationError {
    readonly value: JsonValue<any>;
    readonly message: string;
}
export declare class CfnSpecValidator {
    static validate(spec: CfnSpec): ValidationError[];
    readonly errors: ValidationError[];
    private readonly root;
    constructor(spec: CfnSpec);
    validateSpec(): void;
    /**
     * Property types are extremely weird
     *
     * Nominally, they define "records" that have a `Properties` field with the defined
     * properties.
     *
     * However, they are also commonly used as aliases for other types, meaning they have
     * the same type-indicating fields as individual property *fields* would have.
     *
     * Also also, it seems to be quite common to have them empty--have no fields at all.
     * This seems to be taken as an alias for an unstructured `Json` type. It's probably
     * just a mistake, but unfortunately a mistake that S3 is participating in, so if we
     * fail on that we won't be able to consume updates to S3's schema. Our codegen is
     * ready to deal with this and just renders it to an empty struct.
     */
    private validatePropertyType;
    private validateResourceType;
    private validateProperties;
    /**
     * Validate the type
     *
     * There must be:
     * - Either Type or PrimitiveType
     * - Only if Type is List or Map, there will be either an ItemType or a PrimitiveItemType
     * - Non-primitive Types must correspond to a property type
     */
    private validateType;
    private assertValidPropertyTypeReference;
    private assertOptional;
    private assert;
    private validateMap;
    private report;
}
interface JsonValue<A> {
    readonly path: string[];
    readonly pathValue: any;
    readonly hasValue: boolean;
    readonly value: A;
    readonly valueOrUndefined: A | undefined;
    get<K extends keyof A>(k: K): JsonValue<A[K]>;
}
declare class JsonValue<A> implements JsonValue<A> {
    readonly value: A;
    readonly path: string[];
    static of<B>(x: B): JsonValue<B>;
    readonly hasValue: boolean;
    readonly valueOrUndefined: A | undefined;
    readonly pathValue: any;
    constructor(value: A, path: string[]);
}
export declare function formatErrorInContext(error: ValidationError): string;
export {};
