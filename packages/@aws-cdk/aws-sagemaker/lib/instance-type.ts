import * as cdk from '@aws-cdk/core';

/**
 * Supported instance types for SageMaker instance-based production variants.
 */
export class InstanceType {
  /**
   * ml.c4.2xlarge
   */
  public static readonly C4_2XLARGE = InstanceType.of('ml.c4.2xlarge');

  /**
   * ml.c4.4xlarge
   */
  public static readonly C4_4XLARGE = InstanceType.of('ml.c4.4xlarge');

  /**
   * ml.c4.8xlarge
   */
  public static readonly C4_8XLARGE = InstanceType.of('ml.c4.8xlarge');

  /**
   * ml.c4.large
   */
  public static readonly C4_LARGE = InstanceType.of('ml.c4.large');

  /**
   * ml.c4.xlarge
   */
  public static readonly C4_XLARGE = InstanceType.of('ml.c4.xlarge');

  /**
   * ml.c5.18xlarge
   */
  public static readonly C5_18XLARGE = InstanceType.of('ml.c5.18xlarge');

  /**
   * ml.c5.2xlarge
   */
  public static readonly C5_2XLARGE = InstanceType.of('ml.c5.2xlarge');

  /**
   * ml.c5.4xlarge
   */
  public static readonly C5_4XLARGE = InstanceType.of('ml.c5.4xlarge');

  /**
   * ml.c5.9xlarge
   */
  public static readonly C5_9XLARGE = InstanceType.of('ml.c5.9xlarge');

  /**
   * ml.c5.large
   */
  public static readonly C5_LARGE = InstanceType.of('ml.c5.large');

  /**
   * ml.c5.xlarge
   */
  public static readonly C5_XLARGE = InstanceType.of('ml.c5.xlarge');

  /**
   * ml.c5d.18xlarge
   */
  public static readonly C5D_18XLARGE = InstanceType.of('ml.c5d.18xlarge');

  /**
   * ml.c5d.2xlarge
   */
  public static readonly C5D_2XLARGE = InstanceType.of('ml.c5d.2xlarge');

  /**
   * ml.c5d.4xlarge
   */
  public static readonly C5D_4XLARGE = InstanceType.of('ml.c5d.4xlarge');

  /**
   * ml.c5d.9xlarge
   */
  public static readonly C5D_9XLARGE = InstanceType.of('ml.c5d.9xlarge');

  /**
   * ml.c5d.large
   */
  public static readonly C5D_LARGE = InstanceType.of('ml.c5d.large');

  /**
   * ml.c5d.xlarge
   */
  public static readonly C5D_XLARGE = InstanceType.of('ml.c5d.xlarge');

  /**
   * ml.c6i.12xlarge
   */
  public static readonly C6I_12XLARGE = InstanceType.of('ml.c6i.12xlarge');

  /**
   * ml.c6i.16xlarge
   */
  public static readonly C6I_16XLARGE = InstanceType.of('ml.c6i.16xlarge');

  /**
   * ml.c6i.24xlarge
   */
  public static readonly C6I_24XLARGE = InstanceType.of('ml.c6i.24xlarge');

  /**
   * ml.c6i.2xlarge
   */
  public static readonly C6I_2XLARGE = InstanceType.of('ml.c6i.2xlarge');

  /**
   * ml.c6i.32xlarge
   */
  public static readonly C6I_32XLARGE = InstanceType.of('ml.c6i.32xlarge');

  /**
   * ml.c6i.4xlarge
   */
  public static readonly C6I_4XLARGE = InstanceType.of('ml.c6i.4xlarge');

  /**
   * ml.c6i.8xlarge
   */
  public static readonly C6I_8XLARGE = InstanceType.of('ml.c6i.8xlarge');

  /**
   * ml.c6i.large
   */
  public static readonly C6I_LARGE = InstanceType.of('ml.c6i.large');

  /**
   * ml.c6i.xlarge
   */
  public static readonly C6I_XLARGE = InstanceType.of('ml.c6i.xlarge');

  /**
   * ml.g4dn.12xlarge
   */
  public static readonly G4DN_12XLARGE = InstanceType.of('ml.g4dn.12xlarge');

  /**
   * ml.g4dn.16xlarge
   */
  public static readonly G4DN_16XLARGE = InstanceType.of('ml.g4dn.16xlarge');

  /**
   * ml.g4dn.2xlarge
   */
  public static readonly G4DN_2XLARGE = InstanceType.of('ml.g4dn.2xlarge');

  /**
   * ml.g4dn.4xlarge
   */
  public static readonly G4DN_4XLARGE = InstanceType.of('ml.g4dn.4xlarge');

  /**
   * ml.g4dn.8xlarge
   */
  public static readonly G4DN_8XLARGE = InstanceType.of('ml.g4dn.8xlarge');

  /**
   * ml.g4dn.xlarge
   */
  public static readonly G4DN_XLARGE = InstanceType.of('ml.g4dn.xlarge');

  /**
   * ml.g5.12xlarge
   */
  public static readonly G5_12XLARGE = InstanceType.of('ml.g5.12xlarge');

  /**
   * ml.g5.16xlarge
   */
  public static readonly G5_16XLARGE = InstanceType.of('ml.g5.16xlarge');

  /**
   * ml.g5.24xlarge
   */
  public static readonly G5_24XLARGE = InstanceType.of('ml.g5.24xlarge');

  /**
   * ml.g5.2xlarge
   */
  public static readonly G5_2XLARGE = InstanceType.of('ml.g5.2xlarge');

  /**
   * ml.g5.48xlarge
   */
  public static readonly G5_48XLARGE = InstanceType.of('ml.g5.48xlarge');

  /**
   * ml.g5.4xlarge
   */
  public static readonly G5_4XLARGE = InstanceType.of('ml.g5.4xlarge');

  /**
   * ml.g5.8xlarge
   */
  public static readonly G5_8XLARGE = InstanceType.of('ml.g5.8xlarge');

  /**
   * ml.g5.xlarge
   */
  public static readonly G5_XLARGE = InstanceType.of('ml.g5.xlarge');

  /**
   * ml.inf1.24xlarge
   */
  public static readonly INF1_24XLARGE = InstanceType.of('ml.inf1.24xlarge');

  /**
   * ml.inf1.2xlarge
   */
  public static readonly INF1_2XLARGE = InstanceType.of('ml.inf1.2xlarge');

  /**
   * ml.inf1.6xlarge
   */
  public static readonly INF1_6XLARGE = InstanceType.of('ml.inf1.6xlarge');

  /**
   * ml.inf1.xlarge
   */
  public static readonly INF1_XLARGE = InstanceType.of('ml.inf1.xlarge');

  /**
   * ml.m4.10xlarge
   */
  public static readonly M4_10XLARGE = InstanceType.of('ml.m4.10xlarge');

  /**
   * ml.m4.16xlarge
   */
  public static readonly M4_16XLARGE = InstanceType.of('ml.m4.16xlarge');

  /**
   * ml.m4.2xlarge
   */
  public static readonly M4_2XLARGE = InstanceType.of('ml.m4.2xlarge');

  /**
   * ml.m4.4xlarge
   */
  public static readonly M4_4XLARGE = InstanceType.of('ml.m4.4xlarge');

  /**
   * ml.m4.xlarge
   */
  public static readonly M4_XLARGE = InstanceType.of('ml.m4.xlarge');

  /**
   * ml.m5.12xlarge
   */
  public static readonly M5_12XLARGE = InstanceType.of('ml.m5.12xlarge');

  /**
   * ml.m5.24xlarge
   */
  public static readonly M5_24XLARGE = InstanceType.of('ml.m5.24xlarge');

  /**
   * ml.m5.2xlarge
   */
  public static readonly M5_2XLARGE = InstanceType.of('ml.m5.2xlarge');

  /**
   * ml.m5.4xlarge
   */
  public static readonly M5_4XLARGE = InstanceType.of('ml.m5.4xlarge');

  /**
   * ml.m5.large
   */
  public static readonly M5_LARGE = InstanceType.of('ml.m5.large');

  /**
   * ml.m5.xlarge
   */
  public static readonly M5_XLARGE = InstanceType.of('ml.m5.xlarge');

  /**
   * ml.m5d.12xlarge
   */
  public static readonly M5D_12XLARGE = InstanceType.of('ml.m5d.12xlarge');

  /**
   * ml.m5d.24xlarge
   */
  public static readonly M5D_24XLARGE = InstanceType.of('ml.m5d.24xlarge');

  /**
   * ml.m5d.2xlarge
   */
  public static readonly M5D_2XLARGE = InstanceType.of('ml.m5d.2xlarge');

  /**
   * ml.m5d.4xlarge
   */
  public static readonly M5D_4XLARGE = InstanceType.of('ml.m5d.4xlarge');

  /**
   * ml.m5d.large
   */
  public static readonly M5D_LARGE = InstanceType.of('ml.m5d.large');

  /**
   * ml.m5d.xlarge
   */
  public static readonly M5D_XLARGE = InstanceType.of('ml.m5d.xlarge');

  /**
   * ml.p2.16xlarge
   */
  public static readonly P2_16XLARGE = InstanceType.of('ml.p2.16xlarge');

  /**
   * ml.p2.8xlarge
   */
  public static readonly P2_8XLARGE = InstanceType.of('ml.p2.8xlarge');

  /**
   * ml.p2.xlarge
   */
  public static readonly P2_XLARGE = InstanceType.of('ml.p2.xlarge');

  /**
   * ml.p3.16xlarge
   */
  public static readonly P3_16XLARGE = InstanceType.of('ml.p3.16xlarge');

  /**
   * ml.p3.2xlarge
   */
  public static readonly P3_2XLARGE = InstanceType.of('ml.p3.2xlarge');

  /**
   * ml.p3.8xlarge
   */
  public static readonly P3_8XLARGE = InstanceType.of('ml.p3.8xlarge');

  /**
   * ml.p4d.24xlarge
   */
  public static readonly P4D_24XLARGE = InstanceType.of('ml.p4d.24xlarge');

  /**
   * ml.r5.12xlarge
   */
  public static readonly R5_12XLARGE = InstanceType.of('ml.r5.12xlarge');

  /**
   * ml.r5.24xlarge
   */
  public static readonly R5_24XLARGE = InstanceType.of('ml.r5.24xlarge');

  /**
   * ml.r5.2xlarge
   */
  public static readonly R5_2XLARGE = InstanceType.of('ml.r5.2xlarge');

  /**
   * ml.r5.4xlarge
   */
  public static readonly R5_4XLARGE = InstanceType.of('ml.r5.4xlarge');

  /**
   * ml.r5.large
   */
  public static readonly R5_LARGE = InstanceType.of('ml.r5.large');

  /**
   * ml.r5.xlarge
   */
  public static readonly R5_XLARGE = InstanceType.of('ml.r5.xlarge');

  /**
   * ml.r5d.12xlarge
   */
  public static readonly R5D_12XLARGE = InstanceType.of('ml.r5d.12xlarge');

  /**
   * ml.r5d.24xlarge
   */
  public static readonly R5D_24XLARGE = InstanceType.of('ml.r5d.24xlarge');

  /**
   * ml.r5d.2xlarge
   */
  public static readonly R5D_2XLARGE = InstanceType.of('ml.r5d.2xlarge');

  /**
   * ml.r5d.4xlarge
   */
  public static readonly R5D_4XLARGE = InstanceType.of('ml.r5d.4xlarge');

  /**
   * ml.r5d.large
   */
  public static readonly R5D_LARGE = InstanceType.of('ml.r5d.large');

  /**
   * ml.r5d.xlarge
   */
  public static readonly R5D_XLARGE = InstanceType.of('ml.r5d.xlarge');

  /**
   * ml.t2.2xlarge
   */
  public static readonly T2_2XLARGE = InstanceType.of('ml.t2.2xlarge');

  /**
   * ml.t2.large
   */
  public static readonly T2_LARGE = InstanceType.of('ml.t2.large');

  /**
   * ml.t2.medium
   */
  public static readonly T2_MEDIUM = InstanceType.of('ml.t2.medium');

  /**
   * ml.t2.xlarge
   */
  public static readonly T2_XLARGE = InstanceType.of('ml.t2.xlarge');

  /**
   * Builds an InstanceType from a given string or token (such as a CfnParameter).
   * @param instanceType An instance type as string
   * @returns A strongly typed InstanceType
   */
  public static of(instanceType: string) {
    return new InstanceType(instanceType);
  }

  private readonly instanceTypeIdentifier: string;

  constructor(instanceType: string) {
    if (cdk.Token.isUnresolved(instanceType) || instanceType.startsWith('ml.')) {
      this.instanceTypeIdentifier = instanceType;
    } else {
      throw new Error(`instance type must start with 'ml.'; (got ${instanceType})`);
    }
  }

  /**
   * Return the instance type as a string
   * @returns The instance type as a string
   */
  public toString(): string {
    return this.instanceTypeIdentifier;
  }
}
