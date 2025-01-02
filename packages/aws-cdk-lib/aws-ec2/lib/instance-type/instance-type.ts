import { InstanceClass, _instanceClassMap } from './instance-class';
import { InstanceArchitecture } from './instance-properties';
import { InstanceSize } from './instance-size';
import { NamedInstanceType } from './named-instance-type';

/**
 * Instance type for EC2 instances
 *
 * This class takes a literal string, good if you already
 * know the identifier of the type you want.
 */
export class InstanceType {
  /**
   * Instance type for EC2 instances
   *
   * This class takes a combination of a class and size.
   *
   * Be aware that not all combinations of class and size are available, and not all
   * classes are available in all regions.
   */
  public static of(instanceClass: InstanceClass, instanceSize: InstanceSize) {
    // JSII does not allow enum types to have same value. So to support the enum, the enum with same value has to be mapped later.
    return new InstanceType(`${_instanceClassMap[instanceClass] ?? instanceClass}.${instanceSize}`);
  }

  constructor(
    /**
     * The instance type, as returned by the EC2 API
     *
     * @example "t3.small"
     */
    private readonly instanceTypeIdentifier: string,

    /**
     * Instance properties for the instance type, obtained from cached SDK data
     *
     * @default - Cached SDK data properties for the corresponding instance type
     */
    public readonly instanceProperties = NamedInstanceType.mapInstanceProperties(instanceTypeIdentifier)) {
  }

  /**
   * Return the instance type as a dotted string
   */
  public toString(): string {
    return this.instanceTypeIdentifier;
  }

  /**
   * The instance's CPU architecture
   *
   * @deprecated - use {@link instanceProperties}
   */
  public get architecture(): InstanceArchitecture {
    // TODO use data first
    // capture the family, generation, capabilities, and size portions of the instance type id
    const instanceTypeComponents = this.instanceTypeIdentifier.match(/^([a-z]+)(\d{1,2})([a-z\-]*)\.([a-z0-9\-]+)$/);
    if (instanceTypeComponents == null) {
      throw new Error('Malformed instance type identifier');
    }

    const family = instanceTypeComponents[1];
    const capabilities = instanceTypeComponents[3];

    // Instance family `a` are first-gen Graviton instances
    // Capability `g` indicates the instance is Graviton2 powered
    if (family === 'a' || capabilities.includes('g')) {
      return InstanceArchitecture.ARM_64;
    }

    return InstanceArchitecture.X86_64;
  }

  public sameInstanceClassAs(other: InstanceType): boolean {
    const instanceClass: RegExp = /^([a-z]+\d{1,2}[a-z\-]*)\.([a-z0-9\-]+)$/;
    const instanceClassId = this.instanceTypeIdentifier.match(instanceClass);
    const otherInstanceClassId = other.instanceTypeIdentifier.match(instanceClass);
    if (instanceClassId == null || otherInstanceClassId == null) {
      throw new Error('Malformed instance type identifier');
    }
    return instanceClassId[1] === otherInstanceClassId[1];
  }

  /**
   * Return whether this instance type is a burstable instance type
   *
   * @deprecated - use {@link instanceProperties}
   */
  public isBurstable(): boolean {
    // TODO use data first
    return this.instanceTypeIdentifier.startsWith('t3') || this.instanceTypeIdentifier.startsWith('t4g') || this.instanceTypeIdentifier.startsWith('t2');
  }

}
