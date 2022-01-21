import * as jsiiReflect from 'jsii-reflect';
export declare class SchemaContext {
    static root(definitions?: {
        [fqn: string]: any;
    }): SchemaContext;
    readonly definitions: {
        [fqn: string]: any;
    };
    readonly path: string;
    readonly children: SchemaContext[];
    readonly name: string;
    readonly root: boolean;
    readonly warnings: string[];
    readonly errors: string[];
    private readonly definitionStack;
    private constructor();
    child(type: string, name: string): SchemaContext;
    get hasWarningsOrErrors(): boolean;
    warning(format: any, ...args: any[]): void;
    error(format: any, ...args: any[]): void;
    findDefinition(ref: string): any;
    define(fqn: string, schema: () => any): {
        $ref: string;
    } | undefined;
}
export declare function schemaForTypeReference(type: jsiiReflect.TypeReference, ctx: SchemaContext): any;
export declare function schemaForPolymorphic(type: jsiiReflect.Type | undefined, ctx: SchemaContext): {
    $ref: string;
} | undefined;
export declare function schemaForInterface(type: jsiiReflect.Type | undefined, ctx: SchemaContext): {
    $ref: string;
} | undefined;
export declare function isDataType(t: jsiiReflect.Type | undefined): t is jsiiReflect.InterfaceType;
export declare function isSerializableTypeReference(type: jsiiReflect.TypeReference, errorPrefix?: string): boolean;
export declare function isSerializableInterface(type: jsiiReflect.Type | undefined, errorPrefix?: string): type is jsiiReflect.InterfaceType;
export declare function isEnumLikeClass(cls: jsiiReflect.Type | undefined): cls is jsiiReflect.ClassType;
export declare function enumLikeClassMethods(cls: jsiiReflect.ClassType): jsiiReflect.Method[];
export declare function enumLikeClassProperties(cls: jsiiReflect.ClassType): jsiiReflect.Property[];
export declare function isConstruct(typeOrTypeRef: jsiiReflect.TypeReference | jsiiReflect.Type): boolean;
