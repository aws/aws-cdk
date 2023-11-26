/**
 * All annotations imported from cfn-lint
 */
export interface CfnLintFileSchema {
    /**
     * Resource types that are in this map are stateful
     *
     * There is more information in the structure this maps to.
     */
    readonly StatefulResources: {
        readonly ResourceTypes: Record<string, CfnLintStatefulSchema>;
    };
}
/**
 * Extra information on stateful resource types
 */
export interface CfnLintStatefulSchema {
    /**
     * Whether or not a Delete operation requires the resource to be empty
     *
     * @default false
     */
    readonly DeleteRequiresEmptyResource?: boolean;
}
