/**
 * Configuration of a location capacity
 */
export interface LocationCapacityConfig {
  /**
     * The number of Amazon EC2 instances you want to maintain in the specified fleet location.
     * This value must fall between the minimum and maximum size limits.
     */
  readonly desiredCapacity: number;
  /**
     * The maximum number of instances that are allowed in the specified fleet location.
     *
     * @default the default value is 1
     */
  readonly maxSize?: number;
  /**
     * The minimum number of instances that are allowed in the specified fleet location.
     *
     * @default the default value is 0
     */
  readonly minSize?: number;
}

/**
 * Current resource capacity settings in a specified fleet or location.
 * The location value might refer to a fleet's remote location or its home Region.
 */
export class LocationCapacity {
  constructor(private readonly props: LocationCapacityConfig) {}

  public toJson() {
    return {
      desiredEc2Instances: this.props.desiredCapacity,
      minSize: this.props.minSize ? this.props.minSize : 0,
      maxSize: this.props.maxSize ? this.props.maxSize : 1,
    };
  }
}

/**
 * Configuration of a location
 */
export interface LocationConfig {
  /**
     * An AWS Region code
     */
  readonly location: string;
  /**
   * Current resource capacity settings in a specified fleet or location.
   * The location value might refer to a fleet's remote location or its home Region.
   */
  readonly capacity?: LocationCapacity;
}

/**
 * A remote location where a multi-location fleet can deploy EC2 instances for game hosting.
 */
export class Location {

  constructor(private readonly props: LocationConfig) {}

  /**
   * Convert a location entity to its Json representation
   */
  public toJson() {
    return {
      location: this.props.location,
      locationCapacity: this.props.capacity && this.props.capacity.toJson(),
    };
  }

}