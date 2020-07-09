/**
 * Engine major version and parameter group family pairs.
 */
export interface ParameterGroupFamilyMapping {
  /**
   * The engine major version name
   */
  readonly engineMajorVersion: string;

  /**
   * The parameter group family name
   */
  readonly parameterGroupFamily: string
}
