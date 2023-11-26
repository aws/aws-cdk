/**
 * Additional resource information obtained from cfn-lint
 */
export interface CfnLintResourceAnnotations {
    /**
     * Whether or not the given resource is stateful
     */
    readonly stateful: boolean;
    /**
     * Whether or not a Delete operation requires the resource to be empty
     */
    readonly mustBeEmptyToDelete: boolean;
}
