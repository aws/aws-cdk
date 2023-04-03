/**
 * Specifies the termination criteria to apply before Amazon EC2 Auto Scaling
 * chooses an instance for termination.
 */
export declare enum TerminationPolicy {
    /**
     * Terminate instances in the Auto Scaling group to align the remaining
     * instances to the allocation strategy for the type of instance that is
     * terminating (either a Spot Instance or an On-Demand Instance).
     */
    ALLOCATION_STRATEGY = "AllocationStrategy",
    /**
     * Terminate instances that are closest to the next billing hour.
     */
    CLOSEST_TO_NEXT_INSTANCE_HOUR = "ClosestToNextInstanceHour",
    /**
     * Terminate instances according to the default termination policy.
     */
    DEFAULT = "Default",
    /**
     * Terminate the newest instance in the group.
     */
    NEWEST_INSTANCE = "NewestInstance",
    /**
     * Terminate the oldest instance in the group.
     */
    OLDEST_INSTANCE = "OldestInstance",
    /**
     * Terminate instances that have the oldest launch configuration.
     */
    OLDEST_LAUNCH_CONFIGURATION = "OldestLaunchConfiguration",
    /**
     * Terminate instances that have the oldest launch template.
     */
    OLDEST_LAUNCH_TEMPLATE = "OldestLaunchTemplate"
}
