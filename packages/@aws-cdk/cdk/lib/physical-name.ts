import { Lazy } from "./lazy";

/**
 * Includes special markers for automatic generation of physical names.
 */
export class PhysicalName {
  /**
   * Use this markers to indicate that the physical name of the resource should be
   * automatically generate either during deployment-time by CloudFormation or,
   * if the resource is referenced across environments, a name will be generated
   * automatically during synthesis.
   */
  public static readonly GENERATE_IF_NEEDED = Lazy.stringValue({
    produce: () => {
      throw new Error(`Do not use the value passed as physical name directly`);
    }
  });

  private constructor() { }
}
