/**
 * The OS type of a particular image
 */
export enum OperatingSystemType {
  LINUX,
  WINDOWS,
  /**
   * Used when the type of the operating system is not known
   * (for example, for imported Auto-Scaling Groups).
   */
  UNKNOWN,
}
