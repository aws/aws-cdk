/**
 * The type of the compute environment.
 * @internal
 */
export enum ComputeEnvironmentType {
  /**
   * Batch manages the compute environment.
   */
  MANAGED = 'MANAGED',

  /**
   * You manage the compute environment.
   */
  UNMANAGED = 'UNMANAGED',
}
