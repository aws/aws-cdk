/**
 * A range of metric values in which to apply a certain scaling operation
 */
export interface ScalingInterval {
    /**
     * The lower bound of the interval.
     *
     * The scaling adjustment will be applied if the metric is higher than this value.
     *
     * @default Threshold automatically derived from neighbouring intervals
     */
    readonly lower?: number;
    /**
     * The upper bound of the interval.
     *
     * The scaling adjustment will be applied if the metric is lower than this value.
     *
     * @default Threshold automatically derived from neighbouring intervals
     */
    readonly upper?: number;
    /**
     * The capacity adjustment to apply in this interval
     *
     * The number is interpreted differently based on AdjustmentType:
     *
     * - ChangeInCapacity: add the adjustment to the current capacity.
     *  The number can be positive or negative.
     * - PercentChangeInCapacity: add or remove the given percentage of the current
     *   capacity to itself. The number can be in the range [-100..100].
     * - ExactCapacity: set the capacity to this number. The number must
     *   be positive.
     */
    readonly change: number;
}
