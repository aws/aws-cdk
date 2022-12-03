import * as cdk from '@aws-cdk/core';

/**
 * Supported Elastic Inference (EI) instance types for SageMaker instance-based production variants.
 * EI instances provide on-demand GPU computing for inference.
 */
export class AcceleratorType {
  /**
   * ml.eia1.large
   */
  public static readonly EIA1_LARGE = AcceleratorType.of('ml.eia1.large');

  /**
   * ml.eia1.medium
   */
  public static readonly EIA1_MEDIUM = AcceleratorType.of('ml.eia1.medium');

  /**
   * ml.eia1.xlarge
   */
  public static readonly EIA1_XLARGE = AcceleratorType.of('ml.eia1.xlarge');

  /**
   * ml.eia2.large
   */
  public static readonly EIA2_LARGE = AcceleratorType.of('ml.eia2.large');

  /**
   * ml.eia2.medium
   */
  public static readonly EIA2_MEDIUM = AcceleratorType.of('ml.eia2.medium');

  /**
   * ml.eia2.xlarge
   */
  public static readonly EIA2_XLARGE = AcceleratorType.of('ml.eia2.xlarge');

  /**
   * Builds an AcceleratorType from a given string or token (such as a CfnParameter).
   * @param acceleratorType An accelerator type as string
   * @returns A strongly typed AcceleratorType
   */
  public static of(acceleratorType: string): AcceleratorType {
    return new AcceleratorType(acceleratorType);
  }

  private readonly acceleratorTypeIdentifier: string;

  constructor(acceleratorType: string) {
    if (cdk.Token.isUnresolved(acceleratorType) || acceleratorType.startsWith('ml.')) {
      this.acceleratorTypeIdentifier = acceleratorType;
    } else {
      throw new Error(`instance type must start with 'ml.'; (got ${acceleratorType})`);
    }
  }

  /**
   * Return the accelerator type as a string
   * @returns The accelerator type as a string
   */
  public toString(): string {
    return this.acceleratorTypeIdentifier;
  }
}
