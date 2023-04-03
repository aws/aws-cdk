/**
 * Includes special markers for automatic generation of physical names.
 */
export declare class PhysicalName {
    /**
     * Use this to automatically generate a physical name for an AWS resource only
     * if the resource is referenced across environments (account/region).
     * Otherwise, the name will be allocated during deployment by CloudFormation.
     *
     * If you are certain that a resource will be referenced across environments,
     * you may also specify an explicit physical name for it. This option is
     * mostly designed for reusable constructs which may or may not be referenced
     * across environments.
     */
    static readonly GENERATE_IF_NEEDED: string;
    private constructor();
}
