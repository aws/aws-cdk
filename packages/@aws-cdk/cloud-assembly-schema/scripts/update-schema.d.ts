import * as tjs from 'typescript-json-schema';
export declare const SCHEMAS: string[];
export declare function update(): void;
export declare function bump(): void;
/**
 * Generates a schema from typescript types.
 * @returns JSON schema
 * @param schemaName the schema to generate
 * @param shouldBump writes a new version of the schema and bumps the major version
 */
export declare function generateSchema(schemaName: string, saveToFile?: boolean): tjs.Definition | null;
