import * as jsiiReflect from 'jsii-reflect';
import { SchemaContext } from '../lib/jsii2schema';
export interface RenderSchemaOptions {
    warnings?: boolean;
    /**
     * Use colors when printing ouput.
     * @default true if tty is enabled
     */
    colors?: boolean;
}
export declare function renderFullSchema(typeSystem: jsiiReflect.TypeSystem, options?: RenderSchemaOptions): any;
export declare function schemaForResource(construct: ConstructAndProps, ctx: SchemaContext): {
    $ref: string;
} | undefined;
export interface ConstructAndProps {
    constructClass: jsiiReflect.ClassType;
    propsTypeRef: jsiiReflect.TypeReference;
}
