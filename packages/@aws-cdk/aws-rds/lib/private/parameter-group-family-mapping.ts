import { compare } from './version';

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

/**
 * Get the latest parameter group family for this engine. Latest is determined using semver on the engine major version.
 * When `engineVersion` is specified, return the parameter group family corresponding to that engine version.
 * Return undefined if no parameter group family is defined for this engine or for the requested `engineVersion`.
 */
export function calculateParameterGroupFamily(
  parameterGroupFamilies: ParameterGroupFamilyMapping[] | undefined,
  engineVersion: string | undefined): string | undefined {
  if (parameterGroupFamilies === undefined) {
    return undefined;
  }
  if (engineVersion !== undefined) {
    const family = parameterGroupFamilies.find(x => engineVersion.startsWith(x.engineMajorVersion));
    if (family) {
      return family.parameterGroupFamily;
    }
  } else if (parameterGroupFamilies.length > 0) {
    const sorted = parameterGroupFamilies.slice().sort((a, b) => {
      return compare(a.engineMajorVersion, b.engineMajorVersion);
    }).reverse();
    return sorted[0].parameterGroupFamily;
  }
  return undefined;
}
