/**
 * Docs for a CloudFormation resource or property type
 */
export interface CloudFormationTypeDocs {
    /**
     * Description for this type
     */
    readonly description: string;
    /**
     * Descriptions for each of the type's properties
     */
    readonly properties: Record<string, string>;
    /**
     * Descriptions for each of the resource's attributes
     */
    readonly attributes?: Record<string, string>;
}
export interface CloudFormationDocsFile {
    readonly Types: Record<string, CloudFormationTypeDocs>;
}
