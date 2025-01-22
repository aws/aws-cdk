/* eslint-disable max-len */

import { InstanceClass } from './instance-class';
import { InstanceSize } from './instance-size';
import { InstanceType } from './instance-type';

/**
 * Known instance type for EC2 instances, retrieved from the AWS API.
 *
 * Not all instance types are available in all regions, and some are available only to
 * specific accounts. This class may not be exhaustive.
 */
export class NamedInstanceType {
  /**
 * **Instance type**: `a1.2xlarge`:
 *
 * * **Instance class**: {@link InstanceClass.A1} Arm processor based instances, 1st generation
 * * **Instance size**: {@link InstanceSize.XLARGE2}
 *
 * @alias NamedInstanceType.ARM1_XLARGE2
 */
  public static readonly A1_XLARGE2 = InstanceType.of(InstanceClass.A1, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `a1.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.A1} Arm processor based instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.A1_XLARGE2
   */
  public static readonly ARM1_XLARGE2 = InstanceType.of(InstanceClass.ARM1, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `a1.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.A1} Arm processor based instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.ARM1_XLARGE4
   */
  public static readonly A1_XLARGE4 = InstanceType.of(InstanceClass.A1, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `a1.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.A1} Arm processor based instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.A1_XLARGE4
   */
  public static readonly ARM1_XLARGE4 = InstanceType.of(InstanceClass.ARM1, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `a1.large`:
   *
   * * **Instance class**: {@link InstanceClass.A1} Arm processor based instances, 1st generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.ARM1_LARGE
   */
  public static readonly A1_LARGE = InstanceType.of(InstanceClass.A1, InstanceSize.LARGE);

  /**
   * **Instance type**: `a1.large`:
   *
   * * **Instance class**: {@link InstanceClass.A1} Arm processor based instances, 1st generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.A1_LARGE
   */
  public static readonly ARM1_LARGE = InstanceType.of(InstanceClass.ARM1, InstanceSize.LARGE);

  /**
   * **Instance type**: `a1.medium`:
   *
   * * **Instance class**: {@link InstanceClass.A1} Arm processor based instances, 1st generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.ARM1_MEDIUM
   */
  public static readonly A1_MEDIUM = InstanceType.of(InstanceClass.A1, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `a1.medium`:
   *
   * * **Instance class**: {@link InstanceClass.A1} Arm processor based instances, 1st generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.A1_MEDIUM
   */
  public static readonly ARM1_MEDIUM = InstanceType.of(InstanceClass.ARM1, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `a1.metal`:
   *
   * * **Instance class**: {@link InstanceClass.A1} Arm processor based instances, 1st generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.ARM1_METAL
   */
  public static readonly A1_METAL = InstanceType.of(InstanceClass.A1, InstanceSize.METAL);

  /**
   * **Instance type**: `a1.metal`:
   *
   * * **Instance class**: {@link InstanceClass.A1} Arm processor based instances, 1st generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.A1_METAL
   */
  public static readonly ARM1_METAL = InstanceType.of(InstanceClass.ARM1, InstanceSize.METAL);

  /**
   * **Instance type**: `a1.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.A1} Arm processor based instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.ARM1_XLARGE
   */
  public static readonly A1_XLARGE = InstanceType.of(InstanceClass.A1, InstanceSize.XLARGE);

  /**
   * **Instance type**: `a1.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.A1} Arm processor based instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.A1_XLARGE
   */
  public static readonly ARM1_XLARGE = InstanceType.of(InstanceClass.ARM1, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c3.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C3} Compute optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE3_XLARGE2
   */
  public static readonly C3_XLARGE2 = InstanceType.of(InstanceClass.C3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c3.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C3} Compute optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C3_XLARGE2
   */
  public static readonly COMPUTE3_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c3.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C3} Compute optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE3_XLARGE4
   */
  public static readonly C3_XLARGE4 = InstanceType.of(InstanceClass.C3, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c3.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C3} Compute optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C3_XLARGE4
   */
  public static readonly COMPUTE3_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE3, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c3.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C3} Compute optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE3_XLARGE8
   */
  public static readonly C3_XLARGE8 = InstanceType.of(InstanceClass.C3, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c3.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C3} Compute optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C3_XLARGE8
   */
  public static readonly COMPUTE3_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE3, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c3.large`:
   *
   * * **Instance class**: {@link InstanceClass.C3} Compute optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE3_LARGE
   */
  public static readonly C3_LARGE = InstanceType.of(InstanceClass.C3, InstanceSize.LARGE);

  /**
   * **Instance type**: `c3.large`:
   *
   * * **Instance class**: {@link InstanceClass.C3} Compute optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C3_LARGE
   */
  public static readonly COMPUTE3_LARGE = InstanceType.of(InstanceClass.COMPUTE3, InstanceSize.LARGE);

  /**
   * **Instance type**: `c3.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C3} Compute optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE3_XLARGE
   */
  public static readonly C3_XLARGE = InstanceType.of(InstanceClass.C3, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c3.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C3} Compute optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C3_XLARGE
   */
  public static readonly COMPUTE3_XLARGE = InstanceType.of(InstanceClass.COMPUTE3, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c4.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C4} Compute optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE4_XLARGE2
   */
  public static readonly C4_XLARGE2 = InstanceType.of(InstanceClass.C4, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c4.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C4} Compute optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C4_XLARGE2
   */
  public static readonly COMPUTE4_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE4, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c4.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C4} Compute optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE4_XLARGE4
   */
  public static readonly C4_XLARGE4 = InstanceType.of(InstanceClass.C4, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c4.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C4} Compute optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C4_XLARGE4
   */
  public static readonly COMPUTE4_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE4, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c4.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C4} Compute optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE4_XLARGE8
   */
  public static readonly C4_XLARGE8 = InstanceType.of(InstanceClass.C4, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c4.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C4} Compute optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C4_XLARGE8
   */
  public static readonly COMPUTE4_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE4, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c4.large`:
   *
   * * **Instance class**: {@link InstanceClass.C4} Compute optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE4_LARGE
   */
  public static readonly C4_LARGE = InstanceType.of(InstanceClass.C4, InstanceSize.LARGE);

  /**
   * **Instance type**: `c4.large`:
   *
   * * **Instance class**: {@link InstanceClass.C4} Compute optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C4_LARGE
   */
  public static readonly COMPUTE4_LARGE = InstanceType.of(InstanceClass.COMPUTE4, InstanceSize.LARGE);

  /**
   * **Instance type**: `c4.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C4} Compute optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE4_XLARGE
   */
  public static readonly C4_XLARGE = InstanceType.of(InstanceClass.C4, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c4.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C4} Compute optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C4_XLARGE
   */
  public static readonly COMPUTE4_XLARGE = InstanceType.of(InstanceClass.COMPUTE4, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c5.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE5_XLARGE12
   */
  public static readonly C5_XLARGE12 = InstanceType.of(InstanceClass.C5, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c5.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C5_XLARGE12
   */
  public static readonly COMPUTE5_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE5, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c5.18xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE18}
   *
   * @alias NamedInstanceType.COMPUTE5_XLARGE18
   */
  public static readonly C5_XLARGE18 = InstanceType.of(InstanceClass.C5, InstanceSize.XLARGE18);

  /**
   * **Instance type**: `c5.18xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE18}
   *
   * @alias NamedInstanceType.C5_XLARGE18
   */
  public static readonly COMPUTE5_XLARGE18 = InstanceType.of(InstanceClass.COMPUTE5, InstanceSize.XLARGE18);

  /**
   * **Instance type**: `c5.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.COMPUTE5_XLARGE24
   */
  public static readonly C5_XLARGE24 = InstanceType.of(InstanceClass.C5, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c5.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.C5_XLARGE24
   */
  public static readonly COMPUTE5_XLARGE24 = InstanceType.of(InstanceClass.COMPUTE5, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c5.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE5_XLARGE2
   */
  public static readonly C5_XLARGE2 = InstanceType.of(InstanceClass.C5, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c5.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C5_XLARGE2
   */
  public static readonly COMPUTE5_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE5, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c5.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE5_XLARGE4
   */
  public static readonly C5_XLARGE4 = InstanceType.of(InstanceClass.C5, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c5.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C5_XLARGE4
   */
  public static readonly COMPUTE5_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE5, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c5.9xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE9}
   *
   * @alias NamedInstanceType.COMPUTE5_XLARGE9
   */
  public static readonly C5_XLARGE9 = InstanceType.of(InstanceClass.C5, InstanceSize.XLARGE9);

  /**
   * **Instance type**: `c5.9xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE9}
   *
   * @alias NamedInstanceType.C5_XLARGE9
   */
  public static readonly COMPUTE5_XLARGE9 = InstanceType.of(InstanceClass.COMPUTE5, InstanceSize.XLARGE9);

  /**
   * **Instance type**: `c5.large`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE5_LARGE
   */
  public static readonly C5_LARGE = InstanceType.of(InstanceClass.C5, InstanceSize.LARGE);

  /**
   * **Instance type**: `c5.large`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C5_LARGE
   */
  public static readonly COMPUTE5_LARGE = InstanceType.of(InstanceClass.COMPUTE5, InstanceSize.LARGE);

  /**
   * **Instance type**: `c5.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.COMPUTE5_METAL
   */
  public static readonly C5_METAL = InstanceType.of(InstanceClass.C5, InstanceSize.METAL);

  /**
   * **Instance type**: `c5.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.C5_METAL
   */
  public static readonly COMPUTE5_METAL = InstanceType.of(InstanceClass.COMPUTE5, InstanceSize.METAL);

  /**
   * **Instance type**: `c5.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE5_XLARGE
   */
  public static readonly C5_XLARGE = InstanceType.of(InstanceClass.C5, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c5.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5} Compute optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C5_XLARGE
   */
  public static readonly COMPUTE5_XLARGE = InstanceType.of(InstanceClass.COMPUTE5, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c5a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_XLARGE12
   */
  public static readonly C5A_XLARGE12 = InstanceType.of(InstanceClass.C5A, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c5a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C5A_XLARGE12
   */
  public static readonly COMPUTE5_AMD_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE5_AMD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c5a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_XLARGE16
   */
  public static readonly C5A_XLARGE16 = InstanceType.of(InstanceClass.C5A, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c5a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C5A_XLARGE16
   */
  public static readonly COMPUTE5_AMD_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE5_AMD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c5a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_XLARGE24
   */
  public static readonly C5A_XLARGE24 = InstanceType.of(InstanceClass.C5A, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c5a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.C5A_XLARGE24
   */
  public static readonly COMPUTE5_AMD_XLARGE24 = InstanceType.of(InstanceClass.COMPUTE5_AMD, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c5a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_XLARGE2
   */
  public static readonly C5A_XLARGE2 = InstanceType.of(InstanceClass.C5A, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c5a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C5A_XLARGE2
   */
  public static readonly COMPUTE5_AMD_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE5_AMD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c5a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_XLARGE4
   */
  public static readonly C5A_XLARGE4 = InstanceType.of(InstanceClass.C5A, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c5a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C5A_XLARGE4
   */
  public static readonly COMPUTE5_AMD_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE5_AMD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c5a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_XLARGE8
   */
  public static readonly C5A_XLARGE8 = InstanceType.of(InstanceClass.C5A, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c5a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C5A_XLARGE8
   */
  public static readonly COMPUTE5_AMD_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE5_AMD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c5a.large`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_LARGE
   */
  public static readonly C5A_LARGE = InstanceType.of(InstanceClass.C5A, InstanceSize.LARGE);

  /**
   * **Instance type**: `c5a.large`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C5A_LARGE
   */
  public static readonly COMPUTE5_AMD_LARGE = InstanceType.of(InstanceClass.COMPUTE5_AMD, InstanceSize.LARGE);

  /**
   * **Instance type**: `c5a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_XLARGE
   */
  public static readonly C5A_XLARGE = InstanceType.of(InstanceClass.C5A, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c5a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5A} Compute optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C5A_XLARGE
   */
  public static readonly COMPUTE5_AMD_XLARGE = InstanceType.of(InstanceClass.COMPUTE5_AMD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c5ad.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_NVME_DRIVE_XLARGE12
   */
  public static readonly C5AD_XLARGE12 = InstanceType.of(InstanceClass.C5AD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c5ad.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C5AD_XLARGE12
   */
  public static readonly COMPUTE5_AMD_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE5_AMD_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c5ad.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_NVME_DRIVE_XLARGE16
   */
  public static readonly C5AD_XLARGE16 = InstanceType.of(InstanceClass.C5AD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c5ad.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C5AD_XLARGE16
   */
  public static readonly COMPUTE5_AMD_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE5_AMD_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c5ad.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_NVME_DRIVE_XLARGE24
   */
  public static readonly C5AD_XLARGE24 = InstanceType.of(InstanceClass.C5AD, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c5ad.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.C5AD_XLARGE24
   */
  public static readonly COMPUTE5_AMD_NVME_DRIVE_XLARGE24 = InstanceType.of(InstanceClass.COMPUTE5_AMD_NVME_DRIVE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c5ad.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_NVME_DRIVE_XLARGE2
   */
  public static readonly C5AD_XLARGE2 = InstanceType.of(InstanceClass.C5AD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c5ad.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C5AD_XLARGE2
   */
  public static readonly COMPUTE5_AMD_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE5_AMD_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c5ad.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_NVME_DRIVE_XLARGE4
   */
  public static readonly C5AD_XLARGE4 = InstanceType.of(InstanceClass.C5AD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c5ad.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C5AD_XLARGE4
   */
  public static readonly COMPUTE5_AMD_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE5_AMD_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c5ad.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_NVME_DRIVE_XLARGE8
   */
  public static readonly C5AD_XLARGE8 = InstanceType.of(InstanceClass.C5AD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c5ad.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C5AD_XLARGE8
   */
  public static readonly COMPUTE5_AMD_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE5_AMD_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c5ad.large`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_NVME_DRIVE_LARGE
   */
  public static readonly C5AD_LARGE = InstanceType.of(InstanceClass.C5AD, InstanceSize.LARGE);

  /**
   * **Instance type**: `c5ad.large`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C5AD_LARGE
   */
  public static readonly COMPUTE5_AMD_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.COMPUTE5_AMD_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `c5ad.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE5_AMD_NVME_DRIVE_XLARGE
   */
  public static readonly C5AD_XLARGE = InstanceType.of(InstanceClass.C5AD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c5ad.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5AD} Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C5AD_XLARGE
   */
  public static readonly COMPUTE5_AMD_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.COMPUTE5_AMD_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c5d.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE5_NVME_DRIVE_XLARGE12
   */
  public static readonly C5D_XLARGE12 = InstanceType.of(InstanceClass.C5D, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c5d.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C5D_XLARGE12
   */
  public static readonly COMPUTE5_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE5_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c5d.18xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE18}
   *
   * @alias NamedInstanceType.COMPUTE5_NVME_DRIVE_XLARGE18
   */
  public static readonly C5D_XLARGE18 = InstanceType.of(InstanceClass.C5D, InstanceSize.XLARGE18);

  /**
   * **Instance type**: `c5d.18xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE18}
   *
   * @alias NamedInstanceType.C5D_XLARGE18
   */
  public static readonly COMPUTE5_NVME_DRIVE_XLARGE18 = InstanceType.of(InstanceClass.COMPUTE5_NVME_DRIVE, InstanceSize.XLARGE18);

  /**
   * **Instance type**: `c5d.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.COMPUTE5_NVME_DRIVE_XLARGE24
   */
  public static readonly C5D_XLARGE24 = InstanceType.of(InstanceClass.C5D, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c5d.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.C5D_XLARGE24
   */
  public static readonly COMPUTE5_NVME_DRIVE_XLARGE24 = InstanceType.of(InstanceClass.COMPUTE5_NVME_DRIVE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c5d.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE5_NVME_DRIVE_XLARGE2
   */
  public static readonly C5D_XLARGE2 = InstanceType.of(InstanceClass.C5D, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c5d.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C5D_XLARGE2
   */
  public static readonly COMPUTE5_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE5_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c5d.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE5_NVME_DRIVE_XLARGE4
   */
  public static readonly C5D_XLARGE4 = InstanceType.of(InstanceClass.C5D, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c5d.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C5D_XLARGE4
   */
  public static readonly COMPUTE5_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE5_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c5d.9xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE9}
   *
   * @alias NamedInstanceType.COMPUTE5_NVME_DRIVE_XLARGE9
   */
  public static readonly C5D_XLARGE9 = InstanceType.of(InstanceClass.C5D, InstanceSize.XLARGE9);

  /**
   * **Instance type**: `c5d.9xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE9}
   *
   * @alias NamedInstanceType.C5D_XLARGE9
   */
  public static readonly COMPUTE5_NVME_DRIVE_XLARGE9 = InstanceType.of(InstanceClass.COMPUTE5_NVME_DRIVE, InstanceSize.XLARGE9);

  /**
   * **Instance type**: `c5d.large`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE5_NVME_DRIVE_LARGE
   */
  public static readonly C5D_LARGE = InstanceType.of(InstanceClass.C5D, InstanceSize.LARGE);

  /**
   * **Instance type**: `c5d.large`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C5D_LARGE
   */
  public static readonly COMPUTE5_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.COMPUTE5_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `c5d.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.COMPUTE5_NVME_DRIVE_METAL
   */
  public static readonly C5D_METAL = InstanceType.of(InstanceClass.C5D, InstanceSize.METAL);

  /**
   * **Instance type**: `c5d.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.C5D_METAL
   */
  public static readonly COMPUTE5_NVME_DRIVE_METAL = InstanceType.of(InstanceClass.COMPUTE5_NVME_DRIVE, InstanceSize.METAL);

  /**
   * **Instance type**: `c5d.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE5_NVME_DRIVE_XLARGE
   */
  public static readonly C5D_XLARGE = InstanceType.of(InstanceClass.C5D, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c5d.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5D} Compute optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C5D_XLARGE
   */
  public static readonly COMPUTE5_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.COMPUTE5_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c5n.18xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5N} Compute optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE18}
   *
   * @alias NamedInstanceType.COMPUTE5_HIGH_PERFORMANCE_XLARGE18
   */
  public static readonly C5N_XLARGE18 = InstanceType.of(InstanceClass.C5N, InstanceSize.XLARGE18);

  /**
   * **Instance type**: `c5n.18xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5N} Compute optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE18}
   *
   * @alias NamedInstanceType.C5N_XLARGE18
   */
  public static readonly COMPUTE5_HIGH_PERFORMANCE_XLARGE18 = InstanceType.of(InstanceClass.COMPUTE5_HIGH_PERFORMANCE, InstanceSize.XLARGE18);

  /**
   * **Instance type**: `c5n.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5N} Compute optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE5_HIGH_PERFORMANCE_XLARGE2
   */
  public static readonly C5N_XLARGE2 = InstanceType.of(InstanceClass.C5N, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c5n.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5N} Compute optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C5N_XLARGE2
   */
  public static readonly COMPUTE5_HIGH_PERFORMANCE_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE5_HIGH_PERFORMANCE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c5n.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5N} Compute optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE5_HIGH_PERFORMANCE_XLARGE4
   */
  public static readonly C5N_XLARGE4 = InstanceType.of(InstanceClass.C5N, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c5n.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5N} Compute optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C5N_XLARGE4
   */
  public static readonly COMPUTE5_HIGH_PERFORMANCE_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE5_HIGH_PERFORMANCE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c5n.9xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5N} Compute optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE9}
   *
   * @alias NamedInstanceType.COMPUTE5_HIGH_PERFORMANCE_XLARGE9
   */
  public static readonly C5N_XLARGE9 = InstanceType.of(InstanceClass.C5N, InstanceSize.XLARGE9);

  /**
   * **Instance type**: `c5n.9xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5N} Compute optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE9}
   *
   * @alias NamedInstanceType.C5N_XLARGE9
   */
  public static readonly COMPUTE5_HIGH_PERFORMANCE_XLARGE9 = InstanceType.of(InstanceClass.COMPUTE5_HIGH_PERFORMANCE, InstanceSize.XLARGE9);

  /**
   * **Instance type**: `c5n.large`:
   *
   * * **Instance class**: {@link InstanceClass.C5N} Compute optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE5_HIGH_PERFORMANCE_LARGE
   */
  public static readonly C5N_LARGE = InstanceType.of(InstanceClass.C5N, InstanceSize.LARGE);

  /**
   * **Instance type**: `c5n.large`:
   *
   * * **Instance class**: {@link InstanceClass.C5N} Compute optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C5N_LARGE
   */
  public static readonly COMPUTE5_HIGH_PERFORMANCE_LARGE = InstanceType.of(InstanceClass.COMPUTE5_HIGH_PERFORMANCE, InstanceSize.LARGE);

  /**
   * **Instance type**: `c5n.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C5N} Compute optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.COMPUTE5_HIGH_PERFORMANCE_METAL
   */
  public static readonly C5N_METAL = InstanceType.of(InstanceClass.C5N, InstanceSize.METAL);

  /**
   * **Instance type**: `c5n.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C5N} Compute optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.C5N_METAL
   */
  public static readonly COMPUTE5_HIGH_PERFORMANCE_METAL = InstanceType.of(InstanceClass.COMPUTE5_HIGH_PERFORMANCE, InstanceSize.METAL);

  /**
   * **Instance type**: `c5n.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5N} Compute optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE5_HIGH_PERFORMANCE_XLARGE
   */
  public static readonly C5N_XLARGE = InstanceType.of(InstanceClass.C5N, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c5n.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C5N} Compute optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C5N_XLARGE
   */
  public static readonly COMPUTE5_HIGH_PERFORMANCE_XLARGE = InstanceType.of(InstanceClass.COMPUTE5_HIGH_PERFORMANCE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c6a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE6_AMD_XLARGE12
   */
  public static readonly C6A_XLARGE12 = InstanceType.of(InstanceClass.C6A, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c6a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C6A_XLARGE12
   */
  public static readonly COMPUTE6_AMD_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE6_AMD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c6a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE6_AMD_XLARGE16
   */
  public static readonly C6A_XLARGE16 = InstanceType.of(InstanceClass.C6A, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c6a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C6A_XLARGE16
   */
  public static readonly COMPUTE6_AMD_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE6_AMD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c6a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.COMPUTE6_AMD_XLARGE24
   */
  public static readonly C6A_XLARGE24 = InstanceType.of(InstanceClass.C6A, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c6a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.C6A_XLARGE24
   */
  public static readonly COMPUTE6_AMD_XLARGE24 = InstanceType.of(InstanceClass.COMPUTE6_AMD, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c6a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE6_AMD_XLARGE2
   */
  public static readonly C6A_XLARGE2 = InstanceType.of(InstanceClass.C6A, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c6a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C6A_XLARGE2
   */
  public static readonly COMPUTE6_AMD_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE6_AMD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c6a.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.COMPUTE6_AMD_XLARGE32
   */
  public static readonly C6A_XLARGE32 = InstanceType.of(InstanceClass.C6A, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `c6a.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.C6A_XLARGE32
   */
  public static readonly COMPUTE6_AMD_XLARGE32 = InstanceType.of(InstanceClass.COMPUTE6_AMD, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `c6a.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.COMPUTE6_AMD_XLARGE48
   */
  public static readonly C6A_XLARGE48 = InstanceType.of(InstanceClass.C6A, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `c6a.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.C6A_XLARGE48
   */
  public static readonly COMPUTE6_AMD_XLARGE48 = InstanceType.of(InstanceClass.COMPUTE6_AMD, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `c6a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE6_AMD_XLARGE4
   */
  public static readonly C6A_XLARGE4 = InstanceType.of(InstanceClass.C6A, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c6a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C6A_XLARGE4
   */
  public static readonly COMPUTE6_AMD_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE6_AMD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c6a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE6_AMD_XLARGE8
   */
  public static readonly C6A_XLARGE8 = InstanceType.of(InstanceClass.C6A, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c6a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C6A_XLARGE8
   */
  public static readonly COMPUTE6_AMD_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE6_AMD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c6a.large`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE6_AMD_LARGE
   */
  public static readonly C6A_LARGE = InstanceType.of(InstanceClass.C6A, InstanceSize.LARGE);

  /**
   * **Instance type**: `c6a.large`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C6A_LARGE
   */
  public static readonly COMPUTE6_AMD_LARGE = InstanceType.of(InstanceClass.COMPUTE6_AMD, InstanceSize.LARGE);

  /**
   * **Instance type**: `c6a.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.COMPUTE6_AMD_METAL
   */
  public static readonly C6A_METAL = InstanceType.of(InstanceClass.C6A, InstanceSize.METAL);

  /**
   * **Instance type**: `c6a.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.C6A_METAL
   */
  public static readonly COMPUTE6_AMD_METAL = InstanceType.of(InstanceClass.COMPUTE6_AMD, InstanceSize.METAL);

  /**
   * **Instance type**: `c6a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE6_AMD_XLARGE
   */
  public static readonly C6A_XLARGE = InstanceType.of(InstanceClass.C6A, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c6a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6A} Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C6A_XLARGE
   */
  public static readonly COMPUTE6_AMD_XLARGE = InstanceType.of(InstanceClass.COMPUTE6_AMD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c6g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_XLARGE12
   */
  public static readonly C6G_XLARGE12 = InstanceType.of(InstanceClass.C6G, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c6g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C6G_XLARGE12
   */
  public static readonly COMPUTE6_GRAVITON2_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c6g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_XLARGE16
   */
  public static readonly C6G_XLARGE16 = InstanceType.of(InstanceClass.C6G, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c6g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C6G_XLARGE16
   */
  public static readonly COMPUTE6_GRAVITON2_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c6g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_XLARGE2
   */
  public static readonly C6G_XLARGE2 = InstanceType.of(InstanceClass.C6G, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c6g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C6G_XLARGE2
   */
  public static readonly COMPUTE6_GRAVITON2_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c6g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_XLARGE4
   */
  public static readonly C6G_XLARGE4 = InstanceType.of(InstanceClass.C6G, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c6g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C6G_XLARGE4
   */
  public static readonly COMPUTE6_GRAVITON2_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c6g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_XLARGE8
   */
  public static readonly C6G_XLARGE8 = InstanceType.of(InstanceClass.C6G, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c6g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C6G_XLARGE8
   */
  public static readonly COMPUTE6_GRAVITON2_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c6g.large`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_LARGE
   */
  public static readonly C6G_LARGE = InstanceType.of(InstanceClass.C6G, InstanceSize.LARGE);

  /**
   * **Instance type**: `c6g.large`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C6G_LARGE
   */
  public static readonly COMPUTE6_GRAVITON2_LARGE = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2, InstanceSize.LARGE);

  /**
   * **Instance type**: `c6g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_MEDIUM
   */
  public static readonly C6G_MEDIUM = InstanceType.of(InstanceClass.C6G, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c6g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.C6G_MEDIUM
   */
  public static readonly COMPUTE6_GRAVITON2_MEDIUM = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c6g.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_METAL
   */
  public static readonly C6G_METAL = InstanceType.of(InstanceClass.C6G, InstanceSize.METAL);

  /**
   * **Instance type**: `c6g.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.C6G_METAL
   */
  public static readonly COMPUTE6_GRAVITON2_METAL = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2, InstanceSize.METAL);

  /**
   * **Instance type**: `c6g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_XLARGE
   */
  public static readonly C6G_XLARGE = InstanceType.of(InstanceClass.C6G, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c6g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6G} Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C6G_XLARGE
   */
  public static readonly COMPUTE6_GRAVITON2_XLARGE = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c6gd.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_NVME_DRIVE_XLARGE12
   */
  public static readonly C6GD_XLARGE12 = InstanceType.of(InstanceClass.C6GD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c6gd.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C6GD_XLARGE12
   */
  public static readonly COMPUTE6_GRAVITON2_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c6gd.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_NVME_DRIVE_XLARGE16
   */
  public static readonly C6GD_XLARGE16 = InstanceType.of(InstanceClass.C6GD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c6gd.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C6GD_XLARGE16
   */
  public static readonly COMPUTE6_GRAVITON2_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c6gd.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_NVME_DRIVE_XLARGE2
   */
  public static readonly C6GD_XLARGE2 = InstanceType.of(InstanceClass.C6GD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c6gd.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C6GD_XLARGE2
   */
  public static readonly COMPUTE6_GRAVITON2_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c6gd.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_NVME_DRIVE_XLARGE4
   */
  public static readonly C6GD_XLARGE4 = InstanceType.of(InstanceClass.C6GD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c6gd.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C6GD_XLARGE4
   */
  public static readonly COMPUTE6_GRAVITON2_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c6gd.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_NVME_DRIVE_XLARGE8
   */
  public static readonly C6GD_XLARGE8 = InstanceType.of(InstanceClass.C6GD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c6gd.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C6GD_XLARGE8
   */
  public static readonly COMPUTE6_GRAVITON2_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c6gd.large`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_NVME_DRIVE_LARGE
   */
  public static readonly C6GD_LARGE = InstanceType.of(InstanceClass.C6GD, InstanceSize.LARGE);

  /**
   * **Instance type**: `c6gd.large`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C6GD_LARGE
   */
  public static readonly COMPUTE6_GRAVITON2_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `c6gd.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_NVME_DRIVE_MEDIUM
   */
  public static readonly C6GD_MEDIUM = InstanceType.of(InstanceClass.C6GD, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c6gd.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.C6GD_MEDIUM
   */
  public static readonly COMPUTE6_GRAVITON2_NVME_DRIVE_MEDIUM = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_NVME_DRIVE, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c6gd.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_NVME_DRIVE_METAL
   */
  public static readonly C6GD_METAL = InstanceType.of(InstanceClass.C6GD, InstanceSize.METAL);

  /**
   * **Instance type**: `c6gd.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.C6GD_METAL
   */
  public static readonly COMPUTE6_GRAVITON2_NVME_DRIVE_METAL = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_NVME_DRIVE, InstanceSize.METAL);

  /**
   * **Instance type**: `c6gd.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_NVME_DRIVE_XLARGE
   */
  public static readonly C6GD_XLARGE = InstanceType.of(InstanceClass.C6GD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c6gd.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GD} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C6GD_XLARGE
   */
  public static readonly COMPUTE6_GRAVITON2_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c6gn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_XLARGE12
   */
  public static readonly C6GN_XLARGE12 = InstanceType.of(InstanceClass.C6GN, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c6gn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C6GN_XLARGE12
   */
  public static readonly COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c6gn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_XLARGE16
   */
  public static readonly C6GN_XLARGE16 = InstanceType.of(InstanceClass.C6GN, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c6gn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C6GN_XLARGE16
   */
  public static readonly COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c6gn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_XLARGE2
   */
  public static readonly C6GN_XLARGE2 = InstanceType.of(InstanceClass.C6GN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c6gn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C6GN_XLARGE2
   */
  public static readonly COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c6gn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_XLARGE4
   */
  public static readonly C6GN_XLARGE4 = InstanceType.of(InstanceClass.C6GN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c6gn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C6GN_XLARGE4
   */
  public static readonly COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c6gn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_XLARGE8
   */
  public static readonly C6GN_XLARGE8 = InstanceType.of(InstanceClass.C6GN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c6gn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C6GN_XLARGE8
   */
  public static readonly COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c6gn.large`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_LARGE
   */
  public static readonly C6GN_LARGE = InstanceType.of(InstanceClass.C6GN, InstanceSize.LARGE);

  /**
   * **Instance type**: `c6gn.large`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C6GN_LARGE
   */
  public static readonly COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_LARGE = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH, InstanceSize.LARGE);

  /**
   * **Instance type**: `c6gn.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_MEDIUM
   */
  public static readonly C6GN_MEDIUM = InstanceType.of(InstanceClass.C6GN, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c6gn.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.C6GN_MEDIUM
   */
  public static readonly COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_MEDIUM = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c6gn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_XLARGE
   */
  public static readonly C6GN_XLARGE = InstanceType.of(InstanceClass.C6GN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c6gn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6GN} Compute optimized instances for high performance computing, 6th generation with Graviton2 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C6GN_XLARGE
   */
  public static readonly COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH_XLARGE = InstanceType.of(InstanceClass.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c6i.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_XLARGE12
   */
  public static readonly C6I_XLARGE12 = InstanceType.of(InstanceClass.C6I, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c6i.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C6I_XLARGE12
   */
  public static readonly COMPUTE6_INTEL_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE6_INTEL, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c6i.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_XLARGE16
   */
  public static readonly C6I_XLARGE16 = InstanceType.of(InstanceClass.C6I, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c6i.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C6I_XLARGE16
   */
  public static readonly COMPUTE6_INTEL_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE6_INTEL, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c6i.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_XLARGE24
   */
  public static readonly C6I_XLARGE24 = InstanceType.of(InstanceClass.C6I, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c6i.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.C6I_XLARGE24
   */
  public static readonly COMPUTE6_INTEL_XLARGE24 = InstanceType.of(InstanceClass.COMPUTE6_INTEL, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c6i.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_XLARGE2
   */
  public static readonly C6I_XLARGE2 = InstanceType.of(InstanceClass.C6I, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c6i.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C6I_XLARGE2
   */
  public static readonly COMPUTE6_INTEL_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE6_INTEL, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c6i.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_XLARGE32
   */
  public static readonly C6I_XLARGE32 = InstanceType.of(InstanceClass.C6I, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `c6i.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.C6I_XLARGE32
   */
  public static readonly COMPUTE6_INTEL_XLARGE32 = InstanceType.of(InstanceClass.COMPUTE6_INTEL, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `c6i.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_XLARGE4
   */
  public static readonly C6I_XLARGE4 = InstanceType.of(InstanceClass.C6I, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c6i.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C6I_XLARGE4
   */
  public static readonly COMPUTE6_INTEL_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE6_INTEL, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c6i.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_XLARGE8
   */
  public static readonly C6I_XLARGE8 = InstanceType.of(InstanceClass.C6I, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c6i.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C6I_XLARGE8
   */
  public static readonly COMPUTE6_INTEL_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE6_INTEL, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c6i.large`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_LARGE
   */
  public static readonly C6I_LARGE = InstanceType.of(InstanceClass.C6I, InstanceSize.LARGE);

  /**
   * **Instance type**: `c6i.large`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C6I_LARGE
   */
  public static readonly COMPUTE6_INTEL_LARGE = InstanceType.of(InstanceClass.COMPUTE6_INTEL, InstanceSize.LARGE);

  /**
   * **Instance type**: `c6i.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_METAL
   */
  public static readonly C6I_METAL = InstanceType.of(InstanceClass.C6I, InstanceSize.METAL);

  /**
   * **Instance type**: `c6i.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.C6I_METAL
   */
  public static readonly COMPUTE6_INTEL_METAL = InstanceType.of(InstanceClass.COMPUTE6_INTEL, InstanceSize.METAL);

  /**
   * **Instance type**: `c6i.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_XLARGE
   */
  public static readonly C6I_XLARGE = InstanceType.of(InstanceClass.C6I, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c6i.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6I} Compute optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C6I_XLARGE
   */
  public static readonly COMPUTE6_INTEL_XLARGE = InstanceType.of(InstanceClass.COMPUTE6_INTEL, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c6id.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_NVME_DRIVE_XLARGE12
   */
  public static readonly C6ID_XLARGE12 = InstanceType.of(InstanceClass.C6ID, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c6id.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C6ID_XLARGE12
   */
  public static readonly COMPUTE6_INTEL_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE6_INTEL_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c6id.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_NVME_DRIVE_XLARGE16
   */
  public static readonly C6ID_XLARGE16 = InstanceType.of(InstanceClass.C6ID, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c6id.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C6ID_XLARGE16
   */
  public static readonly COMPUTE6_INTEL_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE6_INTEL_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c6id.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_NVME_DRIVE_XLARGE24
   */
  public static readonly C6ID_XLARGE24 = InstanceType.of(InstanceClass.C6ID, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c6id.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.C6ID_XLARGE24
   */
  public static readonly COMPUTE6_INTEL_NVME_DRIVE_XLARGE24 = InstanceType.of(InstanceClass.COMPUTE6_INTEL_NVME_DRIVE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c6id.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_NVME_DRIVE_XLARGE2
   */
  public static readonly C6ID_XLARGE2 = InstanceType.of(InstanceClass.C6ID, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c6id.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C6ID_XLARGE2
   */
  public static readonly COMPUTE6_INTEL_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE6_INTEL_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c6id.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_NVME_DRIVE_XLARGE32
   */
  public static readonly C6ID_XLARGE32 = InstanceType.of(InstanceClass.C6ID, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `c6id.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.C6ID_XLARGE32
   */
  public static readonly COMPUTE6_INTEL_NVME_DRIVE_XLARGE32 = InstanceType.of(InstanceClass.COMPUTE6_INTEL_NVME_DRIVE, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `c6id.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_NVME_DRIVE_XLARGE4
   */
  public static readonly C6ID_XLARGE4 = InstanceType.of(InstanceClass.C6ID, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c6id.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C6ID_XLARGE4
   */
  public static readonly COMPUTE6_INTEL_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE6_INTEL_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c6id.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_NVME_DRIVE_XLARGE8
   */
  public static readonly C6ID_XLARGE8 = InstanceType.of(InstanceClass.C6ID, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c6id.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C6ID_XLARGE8
   */
  public static readonly COMPUTE6_INTEL_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE6_INTEL_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c6id.large`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_NVME_DRIVE_LARGE
   */
  public static readonly C6ID_LARGE = InstanceType.of(InstanceClass.C6ID, InstanceSize.LARGE);

  /**
   * **Instance type**: `c6id.large`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C6ID_LARGE
   */
  public static readonly COMPUTE6_INTEL_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.COMPUTE6_INTEL_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `c6id.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_NVME_DRIVE_METAL
   */
  public static readonly C6ID_METAL = InstanceType.of(InstanceClass.C6ID, InstanceSize.METAL);

  /**
   * **Instance type**: `c6id.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.C6ID_METAL
   */
  public static readonly COMPUTE6_INTEL_NVME_DRIVE_METAL = InstanceType.of(InstanceClass.COMPUTE6_INTEL_NVME_DRIVE, InstanceSize.METAL);

  /**
   * **Instance type**: `c6id.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_NVME_DRIVE_XLARGE
   */
  public static readonly C6ID_XLARGE = InstanceType.of(InstanceClass.C6ID, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c6id.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6ID} Compute optimized instances with local NVME drive, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C6ID_XLARGE
   */
  public static readonly COMPUTE6_INTEL_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.COMPUTE6_INTEL_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c6in.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE12
   */
  public static readonly C6IN_XLARGE12 = InstanceType.of(InstanceClass.C6IN, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c6in.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C6IN_XLARGE12
   */
  public static readonly COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c6in.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE16
   */
  public static readonly C6IN_XLARGE16 = InstanceType.of(InstanceClass.C6IN, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c6in.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C6IN_XLARGE16
   */
  public static readonly COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c6in.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE24
   */
  public static readonly C6IN_XLARGE24 = InstanceType.of(InstanceClass.C6IN, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c6in.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.C6IN_XLARGE24
   */
  public static readonly COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE24 = InstanceType.of(InstanceClass.COMPUTE6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c6in.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE2
   */
  public static readonly C6IN_XLARGE2 = InstanceType.of(InstanceClass.C6IN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c6in.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C6IN_XLARGE2
   */
  public static readonly COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c6in.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE32
   */
  public static readonly C6IN_XLARGE32 = InstanceType.of(InstanceClass.C6IN, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `c6in.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.C6IN_XLARGE32
   */
  public static readonly COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE32 = InstanceType.of(InstanceClass.COMPUTE6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `c6in.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE4
   */
  public static readonly C6IN_XLARGE4 = InstanceType.of(InstanceClass.C6IN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c6in.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C6IN_XLARGE4
   */
  public static readonly COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c6in.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE8
   */
  public static readonly C6IN_XLARGE8 = InstanceType.of(InstanceClass.C6IN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c6in.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C6IN_XLARGE8
   */
  public static readonly COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c6in.large`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_HIGH_PERFORMANCE_LARGE
   */
  public static readonly C6IN_LARGE = InstanceType.of(InstanceClass.C6IN, InstanceSize.LARGE);

  /**
   * **Instance type**: `c6in.large`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C6IN_LARGE
   */
  public static readonly COMPUTE6_INTEL_HIGH_PERFORMANCE_LARGE = InstanceType.of(InstanceClass.COMPUTE6_INTEL_HIGH_PERFORMANCE, InstanceSize.LARGE);

  /**
   * **Instance type**: `c6in.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_HIGH_PERFORMANCE_METAL
   */
  public static readonly C6IN_METAL = InstanceType.of(InstanceClass.C6IN, InstanceSize.METAL);

  /**
   * **Instance type**: `c6in.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.C6IN_METAL
   */
  public static readonly COMPUTE6_INTEL_HIGH_PERFORMANCE_METAL = InstanceType.of(InstanceClass.COMPUTE6_INTEL_HIGH_PERFORMANCE, InstanceSize.METAL);

  /**
   * **Instance type**: `c6in.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE
   */
  public static readonly C6IN_XLARGE = InstanceType.of(InstanceClass.C6IN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c6in.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C6IN} Compute optimized instances for high performance computing, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C6IN_XLARGE
   */
  public static readonly COMPUTE6_INTEL_HIGH_PERFORMANCE_XLARGE = InstanceType.of(InstanceClass.COMPUTE6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c7a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE7_AMD_XLARGE12
   */
  public static readonly C7A_XLARGE12 = InstanceType.of(InstanceClass.C7A, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c7a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C7A_XLARGE12
   */
  public static readonly COMPUTE7_AMD_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE7_AMD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c7a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE7_AMD_XLARGE16
   */
  public static readonly C7A_XLARGE16 = InstanceType.of(InstanceClass.C7A, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c7a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C7A_XLARGE16
   */
  public static readonly COMPUTE7_AMD_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE7_AMD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c7a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.COMPUTE7_AMD_XLARGE24
   */
  public static readonly C7A_XLARGE24 = InstanceType.of(InstanceClass.C7A, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c7a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.C7A_XLARGE24
   */
  public static readonly COMPUTE7_AMD_XLARGE24 = InstanceType.of(InstanceClass.COMPUTE7_AMD, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c7a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE7_AMD_XLARGE2
   */
  public static readonly C7A_XLARGE2 = InstanceType.of(InstanceClass.C7A, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c7a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C7A_XLARGE2
   */
  public static readonly COMPUTE7_AMD_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE7_AMD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c7a.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.COMPUTE7_AMD_XLARGE32
   */
  public static readonly C7A_XLARGE32 = InstanceType.of(InstanceClass.C7A, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `c7a.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.C7A_XLARGE32
   */
  public static readonly COMPUTE7_AMD_XLARGE32 = InstanceType.of(InstanceClass.COMPUTE7_AMD, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `c7a.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.COMPUTE7_AMD_XLARGE48
   */
  public static readonly C7A_XLARGE48 = InstanceType.of(InstanceClass.C7A, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `c7a.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.C7A_XLARGE48
   */
  public static readonly COMPUTE7_AMD_XLARGE48 = InstanceType.of(InstanceClass.COMPUTE7_AMD, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `c7a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE7_AMD_XLARGE4
   */
  public static readonly C7A_XLARGE4 = InstanceType.of(InstanceClass.C7A, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c7a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C7A_XLARGE4
   */
  public static readonly COMPUTE7_AMD_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE7_AMD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c7a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE7_AMD_XLARGE8
   */
  public static readonly C7A_XLARGE8 = InstanceType.of(InstanceClass.C7A, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c7a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C7A_XLARGE8
   */
  public static readonly COMPUTE7_AMD_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE7_AMD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c7a.large`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE7_AMD_LARGE
   */
  public static readonly C7A_LARGE = InstanceType.of(InstanceClass.C7A, InstanceSize.LARGE);

  /**
   * **Instance type**: `c7a.large`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C7A_LARGE
   */
  public static readonly COMPUTE7_AMD_LARGE = InstanceType.of(InstanceClass.COMPUTE7_AMD, InstanceSize.LARGE);

  /**
   * **Instance type**: `c7a.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.COMPUTE7_AMD_MEDIUM
   */
  public static readonly C7A_MEDIUM = InstanceType.of(InstanceClass.C7A, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c7a.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.C7A_MEDIUM
   */
  public static readonly COMPUTE7_AMD_MEDIUM = InstanceType.of(InstanceClass.COMPUTE7_AMD, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c7a.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.COMPUTE7_AMD_XLARGE48METAL
   */
  public static readonly C7A_XLARGE48METAL = InstanceType.of(InstanceClass.C7A, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `c7a.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.C7A_XLARGE48METAL
   */
  public static readonly COMPUTE7_AMD_XLARGE48METAL = InstanceType.of(InstanceClass.COMPUTE7_AMD, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `c7a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE7_AMD_XLARGE
   */
  public static readonly C7A_XLARGE = InstanceType.of(InstanceClass.C7A, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c7a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7A} Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C7A_XLARGE
   */
  public static readonly COMPUTE7_AMD_XLARGE = InstanceType.of(InstanceClass.COMPUTE7_AMD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c7g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_XLARGE12
   */
  public static readonly C7G_XLARGE12 = InstanceType.of(InstanceClass.C7G, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c7g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C7G_XLARGE12
   */
  public static readonly COMPUTE7_GRAVITON3_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c7g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_XLARGE16
   */
  public static readonly C7G_XLARGE16 = InstanceType.of(InstanceClass.C7G, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c7g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C7G_XLARGE16
   */
  public static readonly COMPUTE7_GRAVITON3_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c7g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_XLARGE2
   */
  public static readonly C7G_XLARGE2 = InstanceType.of(InstanceClass.C7G, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c7g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C7G_XLARGE2
   */
  public static readonly COMPUTE7_GRAVITON3_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c7g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_XLARGE4
   */
  public static readonly C7G_XLARGE4 = InstanceType.of(InstanceClass.C7G, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c7g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C7G_XLARGE4
   */
  public static readonly COMPUTE7_GRAVITON3_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c7g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_XLARGE8
   */
  public static readonly C7G_XLARGE8 = InstanceType.of(InstanceClass.C7G, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c7g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C7G_XLARGE8
   */
  public static readonly COMPUTE7_GRAVITON3_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c7g.large`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_LARGE
   */
  public static readonly C7G_LARGE = InstanceType.of(InstanceClass.C7G, InstanceSize.LARGE);

  /**
   * **Instance type**: `c7g.large`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C7G_LARGE
   */
  public static readonly COMPUTE7_GRAVITON3_LARGE = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3, InstanceSize.LARGE);

  /**
   * **Instance type**: `c7g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_MEDIUM
   */
  public static readonly C7G_MEDIUM = InstanceType.of(InstanceClass.C7G, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c7g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.C7G_MEDIUM
   */
  public static readonly COMPUTE7_GRAVITON3_MEDIUM = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c7g.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_METAL
   */
  public static readonly C7G_METAL = InstanceType.of(InstanceClass.C7G, InstanceSize.METAL);

  /**
   * **Instance type**: `c7g.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.C7G_METAL
   */
  public static readonly COMPUTE7_GRAVITON3_METAL = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3, InstanceSize.METAL);

  /**
   * **Instance type**: `c7g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_XLARGE
   */
  public static readonly C7G_XLARGE = InstanceType.of(InstanceClass.C7G, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c7g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7G} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C7G_XLARGE
   */
  public static readonly COMPUTE7_GRAVITON3_XLARGE = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c7gd.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_NVME_DRIVE_XLARGE12
   */
  public static readonly C7GD_XLARGE12 = InstanceType.of(InstanceClass.C7GD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c7gd.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C7GD_XLARGE12
   */
  public static readonly COMPUTE7_GRAVITON3_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c7gd.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_NVME_DRIVE_XLARGE16
   */
  public static readonly C7GD_XLARGE16 = InstanceType.of(InstanceClass.C7GD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c7gd.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C7GD_XLARGE16
   */
  public static readonly COMPUTE7_GRAVITON3_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c7gd.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_NVME_DRIVE_XLARGE2
   */
  public static readonly C7GD_XLARGE2 = InstanceType.of(InstanceClass.C7GD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c7gd.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C7GD_XLARGE2
   */
  public static readonly COMPUTE7_GRAVITON3_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c7gd.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_NVME_DRIVE_XLARGE4
   */
  public static readonly C7GD_XLARGE4 = InstanceType.of(InstanceClass.C7GD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c7gd.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C7GD_XLARGE4
   */
  public static readonly COMPUTE7_GRAVITON3_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c7gd.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_NVME_DRIVE_XLARGE8
   */
  public static readonly C7GD_XLARGE8 = InstanceType.of(InstanceClass.C7GD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c7gd.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C7GD_XLARGE8
   */
  public static readonly COMPUTE7_GRAVITON3_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c7gd.large`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_NVME_DRIVE_LARGE
   */
  public static readonly C7GD_LARGE = InstanceType.of(InstanceClass.C7GD, InstanceSize.LARGE);

  /**
   * **Instance type**: `c7gd.large`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C7GD_LARGE
   */
  public static readonly COMPUTE7_GRAVITON3_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `c7gd.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_NVME_DRIVE_MEDIUM
   */
  public static readonly C7GD_MEDIUM = InstanceType.of(InstanceClass.C7GD, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c7gd.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.C7GD_MEDIUM
   */
  public static readonly COMPUTE7_GRAVITON3_NVME_DRIVE_MEDIUM = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_NVME_DRIVE, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c7gd.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_NVME_DRIVE_METAL
   */
  public static readonly C7GD_METAL = InstanceType.of(InstanceClass.C7GD, InstanceSize.METAL);

  /**
   * **Instance type**: `c7gd.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.C7GD_METAL
   */
  public static readonly COMPUTE7_GRAVITON3_NVME_DRIVE_METAL = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_NVME_DRIVE, InstanceSize.METAL);

  /**
   * **Instance type**: `c7gd.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_NVME_DRIVE_XLARGE
   */
  public static readonly C7GD_XLARGE = InstanceType.of(InstanceClass.C7GD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c7gd.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GD} Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C7GD_XLARGE
   */
  public static readonly COMPUTE7_GRAVITON3_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c7gn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_XLARGE12
   */
  public static readonly C7GN_XLARGE12 = InstanceType.of(InstanceClass.C7GN, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c7gn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C7GN_XLARGE12
   */
  public static readonly COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c7gn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_XLARGE16
   */
  public static readonly C7GN_XLARGE16 = InstanceType.of(InstanceClass.C7GN, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c7gn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C7GN_XLARGE16
   */
  public static readonly COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c7gn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_XLARGE2
   */
  public static readonly C7GN_XLARGE2 = InstanceType.of(InstanceClass.C7GN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c7gn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C7GN_XLARGE2
   */
  public static readonly COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c7gn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_XLARGE4
   */
  public static readonly C7GN_XLARGE4 = InstanceType.of(InstanceClass.C7GN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c7gn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C7GN_XLARGE4
   */
  public static readonly COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c7gn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_XLARGE8
   */
  public static readonly C7GN_XLARGE8 = InstanceType.of(InstanceClass.C7GN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c7gn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C7GN_XLARGE8
   */
  public static readonly COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c7gn.large`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_LARGE
   */
  public static readonly C7GN_LARGE = InstanceType.of(InstanceClass.C7GN, InstanceSize.LARGE);

  /**
   * **Instance type**: `c7gn.large`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C7GN_LARGE
   */
  public static readonly COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_LARGE = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH, InstanceSize.LARGE);

  /**
   * **Instance type**: `c7gn.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_MEDIUM
   */
  public static readonly C7GN_MEDIUM = InstanceType.of(InstanceClass.C7GN, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c7gn.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.C7GN_MEDIUM
   */
  public static readonly COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_MEDIUM = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c7gn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_METAL
   */
  public static readonly C7GN_METAL = InstanceType.of(InstanceClass.C7GN, InstanceSize.METAL);

  /**
   * **Instance type**: `c7gn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.C7GN_METAL
   */
  public static readonly COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_METAL = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH, InstanceSize.METAL);

  /**
   * **Instance type**: `c7gn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_XLARGE
   */
  public static readonly C7GN_XLARGE = InstanceType.of(InstanceClass.C7GN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c7gn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7GN} Compute optimized instances for high performance computing, 7th generation with Graviton3 processorsand high network bandwidth capabilities
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C7GN_XLARGE
   */
  public static readonly COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH_XLARGE = InstanceType.of(InstanceClass.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c7i-flex.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I_FLEX} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationC7i-flex instances efficiently use compute resources to deliver a baseline level of performance with the ability to scale up to the full compute performance a majority of the time.
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_FLEX_XLARGE2
   */
  public static readonly C7I_FLEX_XLARGE2 = InstanceType.of(InstanceClass.C7I_FLEX, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c7i-flex.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I_FLEX} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationC7i-flex instances efficiently use compute resources to deliver a baseline level of performance with the ability to scale up to the full compute performance a majority of the time.
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C7I_FLEX_XLARGE2
   */
  public static readonly COMPUTE7_INTEL_FLEX_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE7_INTEL_FLEX, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c7i-flex.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I_FLEX} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationC7i-flex instances efficiently use compute resources to deliver a baseline level of performance with the ability to scale up to the full compute performance a majority of the time.
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_FLEX_XLARGE4
   */
  public static readonly C7I_FLEX_XLARGE4 = InstanceType.of(InstanceClass.C7I_FLEX, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c7i-flex.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I_FLEX} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationC7i-flex instances efficiently use compute resources to deliver a baseline level of performance with the ability to scale up to the full compute performance a majority of the time.
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C7I_FLEX_XLARGE4
   */
  public static readonly COMPUTE7_INTEL_FLEX_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE7_INTEL_FLEX, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c7i-flex.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I_FLEX} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationC7i-flex instances efficiently use compute resources to deliver a baseline level of performance with the ability to scale up to the full compute performance a majority of the time.
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_FLEX_XLARGE8
   */
  public static readonly C7I_FLEX_XLARGE8 = InstanceType.of(InstanceClass.C7I_FLEX, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c7i-flex.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I_FLEX} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationC7i-flex instances efficiently use compute resources to deliver a baseline level of performance with the ability to scale up to the full compute performance a majority of the time.
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C7I_FLEX_XLARGE8
   */
  public static readonly COMPUTE7_INTEL_FLEX_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE7_INTEL_FLEX, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c7i-flex.large`:
   *
   * * **Instance class**: {@link InstanceClass.C7I_FLEX} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationC7i-flex instances efficiently use compute resources to deliver a baseline level of performance with the ability to scale up to the full compute performance a majority of the time.
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_FLEX_LARGE
   */
  public static readonly C7I_FLEX_LARGE = InstanceType.of(InstanceClass.C7I_FLEX, InstanceSize.LARGE);

  /**
   * **Instance type**: `c7i-flex.large`:
   *
   * * **Instance class**: {@link InstanceClass.C7I_FLEX} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationC7i-flex instances efficiently use compute resources to deliver a baseline level of performance with the ability to scale up to the full compute performance a majority of the time.
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C7I_FLEX_LARGE
   */
  public static readonly COMPUTE7_INTEL_FLEX_LARGE = InstanceType.of(InstanceClass.COMPUTE7_INTEL_FLEX, InstanceSize.LARGE);

  /**
   * **Instance type**: `c7i-flex.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I_FLEX} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationC7i-flex instances efficiently use compute resources to deliver a baseline level of performance with the ability to scale up to the full compute performance a majority of the time.
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_FLEX_XLARGE
   */
  public static readonly C7I_FLEX_XLARGE = InstanceType.of(InstanceClass.C7I_FLEX, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c7i-flex.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I_FLEX} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationC7i-flex instances efficiently use compute resources to deliver a baseline level of performance with the ability to scale up to the full compute performance a majority of the time.
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C7I_FLEX_XLARGE
   */
  public static readonly COMPUTE7_INTEL_FLEX_XLARGE = InstanceType.of(InstanceClass.COMPUTE7_INTEL_FLEX, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c7i.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_XLARGE12
   */
  public static readonly C7I_XLARGE12 = InstanceType.of(InstanceClass.C7I, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c7i.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C7I_XLARGE12
   */
  public static readonly COMPUTE7_INTEL_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE7_INTEL, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c7i.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_XLARGE16
   */
  public static readonly C7I_XLARGE16 = InstanceType.of(InstanceClass.C7I, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c7i.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C7I_XLARGE16
   */
  public static readonly COMPUTE7_INTEL_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE7_INTEL, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c7i.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_XLARGE24
   */
  public static readonly C7I_XLARGE24 = InstanceType.of(InstanceClass.C7I, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c7i.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.C7I_XLARGE24
   */
  public static readonly COMPUTE7_INTEL_XLARGE24 = InstanceType.of(InstanceClass.COMPUTE7_INTEL, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c7i.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_XLARGE2
   */
  public static readonly C7I_XLARGE2 = InstanceType.of(InstanceClass.C7I, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c7i.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C7I_XLARGE2
   */
  public static readonly COMPUTE7_INTEL_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE7_INTEL, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c7i.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_XLARGE48
   */
  public static readonly C7I_XLARGE48 = InstanceType.of(InstanceClass.C7I, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `c7i.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.C7I_XLARGE48
   */
  public static readonly COMPUTE7_INTEL_XLARGE48 = InstanceType.of(InstanceClass.COMPUTE7_INTEL, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `c7i.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_XLARGE4
   */
  public static readonly C7I_XLARGE4 = InstanceType.of(InstanceClass.C7I, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c7i.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C7I_XLARGE4
   */
  public static readonly COMPUTE7_INTEL_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE7_INTEL, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c7i.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_XLARGE8
   */
  public static readonly C7I_XLARGE8 = InstanceType.of(InstanceClass.C7I, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c7i.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C7I_XLARGE8
   */
  public static readonly COMPUTE7_INTEL_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE7_INTEL, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c7i.large`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_LARGE
   */
  public static readonly C7I_LARGE = InstanceType.of(InstanceClass.C7I, InstanceSize.LARGE);

  /**
   * **Instance type**: `c7i.large`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C7I_LARGE
   */
  public static readonly COMPUTE7_INTEL_LARGE = InstanceType.of(InstanceClass.COMPUTE7_INTEL, InstanceSize.LARGE);

  /**
   * **Instance type**: `c7i.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_XLARGE24METAL
   */
  public static readonly C7I_XLARGE24METAL = InstanceType.of(InstanceClass.C7I, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `c7i.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.C7I_XLARGE24METAL
   */
  public static readonly COMPUTE7_INTEL_XLARGE24METAL = InstanceType.of(InstanceClass.COMPUTE7_INTEL, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `c7i.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_XLARGE48METAL
   */
  public static readonly C7I_XLARGE48METAL = InstanceType.of(InstanceClass.C7I, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `c7i.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.C7I_XLARGE48METAL
   */
  public static readonly COMPUTE7_INTEL_XLARGE48METAL = InstanceType.of(InstanceClass.COMPUTE7_INTEL, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `c7i.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE7_INTEL_XLARGE
   */
  public static readonly C7I_XLARGE = InstanceType.of(InstanceClass.C7I, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c7i.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C7I} Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C7I_XLARGE
   */
  public static readonly COMPUTE7_INTEL_XLARGE = InstanceType.of(InstanceClass.COMPUTE7_INTEL, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c8g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.COMPUTE8_GRAVITON4_XLARGE12
   */
  public static readonly C8G_XLARGE12 = InstanceType.of(InstanceClass.C8G, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c8g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.C8G_XLARGE12
   */
  public static readonly COMPUTE8_GRAVITON4_XLARGE12 = InstanceType.of(InstanceClass.COMPUTE8_GRAVITON4, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `c8g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.COMPUTE8_GRAVITON4_XLARGE16
   */
  public static readonly C8G_XLARGE16 = InstanceType.of(InstanceClass.C8G, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c8g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.C8G_XLARGE16
   */
  public static readonly COMPUTE8_GRAVITON4_XLARGE16 = InstanceType.of(InstanceClass.COMPUTE8_GRAVITON4, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `c8g.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.COMPUTE8_GRAVITON4_XLARGE24
   */
  public static readonly C8G_XLARGE24 = InstanceType.of(InstanceClass.C8G, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c8g.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.C8G_XLARGE24
   */
  public static readonly COMPUTE8_GRAVITON4_XLARGE24 = InstanceType.of(InstanceClass.COMPUTE8_GRAVITON4, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `c8g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.COMPUTE8_GRAVITON4_XLARGE2
   */
  public static readonly C8G_XLARGE2 = InstanceType.of(InstanceClass.C8G, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c8g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.C8G_XLARGE2
   */
  public static readonly COMPUTE8_GRAVITON4_XLARGE2 = InstanceType.of(InstanceClass.COMPUTE8_GRAVITON4, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `c8g.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.COMPUTE8_GRAVITON4_XLARGE48
   */
  public static readonly C8G_XLARGE48 = InstanceType.of(InstanceClass.C8G, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `c8g.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.C8G_XLARGE48
   */
  public static readonly COMPUTE8_GRAVITON4_XLARGE48 = InstanceType.of(InstanceClass.COMPUTE8_GRAVITON4, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `c8g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.COMPUTE8_GRAVITON4_XLARGE4
   */
  public static readonly C8G_XLARGE4 = InstanceType.of(InstanceClass.C8G, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c8g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.C8G_XLARGE4
   */
  public static readonly COMPUTE8_GRAVITON4_XLARGE4 = InstanceType.of(InstanceClass.COMPUTE8_GRAVITON4, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `c8g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.COMPUTE8_GRAVITON4_XLARGE8
   */
  public static readonly C8G_XLARGE8 = InstanceType.of(InstanceClass.C8G, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c8g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.C8G_XLARGE8
   */
  public static readonly COMPUTE8_GRAVITON4_XLARGE8 = InstanceType.of(InstanceClass.COMPUTE8_GRAVITON4, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `c8g.large`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.COMPUTE8_GRAVITON4_LARGE
   */
  public static readonly C8G_LARGE = InstanceType.of(InstanceClass.C8G, InstanceSize.LARGE);

  /**
   * **Instance type**: `c8g.large`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.C8G_LARGE
   */
  public static readonly COMPUTE8_GRAVITON4_LARGE = InstanceType.of(InstanceClass.COMPUTE8_GRAVITON4, InstanceSize.LARGE);

  /**
   * **Instance type**: `c8g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.COMPUTE8_GRAVITON4_MEDIUM
   */
  public static readonly C8G_MEDIUM = InstanceType.of(InstanceClass.C8G, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c8g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.C8G_MEDIUM
   */
  public static readonly COMPUTE8_GRAVITON4_MEDIUM = InstanceType.of(InstanceClass.COMPUTE8_GRAVITON4, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `c8g.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.COMPUTE8_GRAVITON4_XLARGE24METAL
   */
  public static readonly C8G_XLARGE24METAL = InstanceType.of(InstanceClass.C8G, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `c8g.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.C8G_XLARGE24METAL
   */
  public static readonly COMPUTE8_GRAVITON4_XLARGE24METAL = InstanceType.of(InstanceClass.COMPUTE8_GRAVITON4, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `c8g.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.COMPUTE8_GRAVITON4_XLARGE48METAL
   */
  public static readonly C8G_XLARGE48METAL = InstanceType.of(InstanceClass.C8G, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `c8g.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.C8G_XLARGE48METAL
   */
  public static readonly COMPUTE8_GRAVITON4_XLARGE48METAL = InstanceType.of(InstanceClass.COMPUTE8_GRAVITON4, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `c8g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.COMPUTE8_GRAVITON4_XLARGE
   */
  public static readonly C8G_XLARGE = InstanceType.of(InstanceClass.C8G, InstanceSize.XLARGE);

  /**
   * **Instance type**: `c8g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.C8G} Compute optimized instances for high performance computing, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.C8G_XLARGE
   */
  public static readonly COMPUTE8_GRAVITON4_XLARGE = InstanceType.of(InstanceClass.COMPUTE8_GRAVITON4, InstanceSize.XLARGE);

  /**
   * **Instance type**: `d2.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D2} Storage-optimized instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STORAGE2_XLARGE2
   */
  public static readonly D2_XLARGE2 = InstanceType.of(InstanceClass.D2, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `d2.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D2} Storage-optimized instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.D2_XLARGE2
   */
  public static readonly STORAGE2_XLARGE2 = InstanceType.of(InstanceClass.STORAGE2, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `d2.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D2} Storage-optimized instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STORAGE2_XLARGE4
   */
  public static readonly D2_XLARGE4 = InstanceType.of(InstanceClass.D2, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `d2.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D2} Storage-optimized instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.D2_XLARGE4
   */
  public static readonly STORAGE2_XLARGE4 = InstanceType.of(InstanceClass.STORAGE2, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `d2.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D2} Storage-optimized instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STORAGE2_XLARGE8
   */
  public static readonly D2_XLARGE8 = InstanceType.of(InstanceClass.D2, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `d2.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D2} Storage-optimized instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.D2_XLARGE8
   */
  public static readonly STORAGE2_XLARGE8 = InstanceType.of(InstanceClass.STORAGE2, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `d2.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D2} Storage-optimized instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STORAGE2_XLARGE
   */
  public static readonly D2_XLARGE = InstanceType.of(InstanceClass.D2, InstanceSize.XLARGE);

  /**
   * **Instance type**: `d2.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D2} Storage-optimized instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.D2_XLARGE
   */
  public static readonly STORAGE2_XLARGE = InstanceType.of(InstanceClass.STORAGE2, InstanceSize.XLARGE);

  /**
   * **Instance type**: `d3.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STORAGE3_XLARGE2
   */
  public static readonly D3_XLARGE2 = InstanceType.of(InstanceClass.D3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `d3.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.D3_XLARGE2
   */
  public static readonly STORAGE3_XLARGE2 = InstanceType.of(InstanceClass.STORAGE3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `d3.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STORAGE3_XLARGE4
   */
  public static readonly D3_XLARGE4 = InstanceType.of(InstanceClass.D3, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `d3.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.D3_XLARGE4
   */
  public static readonly STORAGE3_XLARGE4 = InstanceType.of(InstanceClass.STORAGE3, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `d3.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STORAGE3_XLARGE8
   */
  public static readonly D3_XLARGE8 = InstanceType.of(InstanceClass.D3, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `d3.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.D3_XLARGE8
   */
  public static readonly STORAGE3_XLARGE8 = InstanceType.of(InstanceClass.STORAGE3, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `d3.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STORAGE3_XLARGE
   */
  public static readonly D3_XLARGE = InstanceType.of(InstanceClass.D3, InstanceSize.XLARGE);

  /**
   * **Instance type**: `d3.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.D3_XLARGE
   */
  public static readonly STORAGE3_XLARGE = InstanceType.of(InstanceClass.STORAGE3, InstanceSize.XLARGE);

  /**
   * **Instance type**: `d3en.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3EN} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STORAGE3_ENHANCED_NETWORK_XLARGE12
   */
  public static readonly D3EN_XLARGE12 = InstanceType.of(InstanceClass.D3EN, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `d3en.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3EN} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.D3EN_XLARGE12
   */
  public static readonly STORAGE3_ENHANCED_NETWORK_XLARGE12 = InstanceType.of(InstanceClass.STORAGE3_ENHANCED_NETWORK, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `d3en.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3EN} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STORAGE3_ENHANCED_NETWORK_XLARGE2
   */
  public static readonly D3EN_XLARGE2 = InstanceType.of(InstanceClass.D3EN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `d3en.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3EN} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.D3EN_XLARGE2
   */
  public static readonly STORAGE3_ENHANCED_NETWORK_XLARGE2 = InstanceType.of(InstanceClass.STORAGE3_ENHANCED_NETWORK, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `d3en.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3EN} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STORAGE3_ENHANCED_NETWORK_XLARGE4
   */
  public static readonly D3EN_XLARGE4 = InstanceType.of(InstanceClass.D3EN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `d3en.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3EN} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.D3EN_XLARGE4
   */
  public static readonly STORAGE3_ENHANCED_NETWORK_XLARGE4 = InstanceType.of(InstanceClass.STORAGE3_ENHANCED_NETWORK, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `d3en.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3EN} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.STORAGE3_ENHANCED_NETWORK_XLARGE6
   */
  public static readonly D3EN_XLARGE6 = InstanceType.of(InstanceClass.D3EN, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `d3en.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3EN} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.D3EN_XLARGE6
   */
  public static readonly STORAGE3_ENHANCED_NETWORK_XLARGE6 = InstanceType.of(InstanceClass.STORAGE3_ENHANCED_NETWORK, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `d3en.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3EN} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STORAGE3_ENHANCED_NETWORK_XLARGE8
   */
  public static readonly D3EN_XLARGE8 = InstanceType.of(InstanceClass.D3EN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `d3en.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3EN} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.D3EN_XLARGE8
   */
  public static readonly STORAGE3_ENHANCED_NETWORK_XLARGE8 = InstanceType.of(InstanceClass.STORAGE3_ENHANCED_NETWORK, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `d3en.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3EN} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STORAGE3_ENHANCED_NETWORK_XLARGE
   */
  public static readonly D3EN_XLARGE = InstanceType.of(InstanceClass.D3EN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `d3en.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.D3EN} Storage-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.D3EN_XLARGE
   */
  public static readonly STORAGE3_ENHANCED_NETWORK_XLARGE = InstanceType.of(InstanceClass.STORAGE3_ENHANCED_NETWORK, InstanceSize.XLARGE);

  /**
   * **Instance type**: `dl1.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.DL1} Deep learning instances powered by Gaudi accelerators from Habana Labs (an Intel company), 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.DEEP_LEARNING1_XLARGE24
   */
  public static readonly DL1_XLARGE24 = InstanceType.of(InstanceClass.DL1, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `dl1.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.DL1} Deep learning instances powered by Gaudi accelerators from Habana Labs (an Intel company), 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.DL1_XLARGE24
   */
  public static readonly DEEP_LEARNING1_XLARGE24 = InstanceType.of(InstanceClass.DEEP_LEARNING1, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `f1.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.F1} Instances with customizable hardware acceleration, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.FPGA1_XLARGE16
   */
  public static readonly F1_XLARGE16 = InstanceType.of(InstanceClass.F1, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `f1.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.F1} Instances with customizable hardware acceleration, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.F1_XLARGE16
   */
  public static readonly FPGA1_XLARGE16 = InstanceType.of(InstanceClass.FPGA1, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `f1.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.F1} Instances with customizable hardware acceleration, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.FPGA1_XLARGE2
   */
  public static readonly F1_XLARGE2 = InstanceType.of(InstanceClass.F1, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `f1.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.F1} Instances with customizable hardware acceleration, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.F1_XLARGE2
   */
  public static readonly FPGA1_XLARGE2 = InstanceType.of(InstanceClass.FPGA1, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `f1.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.F1} Instances with customizable hardware acceleration, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.FPGA1_XLARGE4
   */
  public static readonly F1_XLARGE4 = InstanceType.of(InstanceClass.F1, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `f1.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.F1} Instances with customizable hardware acceleration, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.F1_XLARGE4
   */
  public static readonly FPGA1_XLARGE4 = InstanceType.of(InstanceClass.FPGA1, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `f2.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.F2} Instances with customizable hardware acceleration, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.FPGA2_XLARGE12
   */
  public static readonly F2_XLARGE12 = InstanceType.of(InstanceClass.F2, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `f2.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.F2} Instances with customizable hardware acceleration, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.F2_XLARGE12
   */
  public static readonly FPGA2_XLARGE12 = InstanceType.of(InstanceClass.FPGA2, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `f2.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.F2} Instances with customizable hardware acceleration, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.FPGA2_XLARGE48
   */
  public static readonly F2_XLARGE48 = InstanceType.of(InstanceClass.F2, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `f2.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.F2} Instances with customizable hardware acceleration, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.F2_XLARGE48
   */
  public static readonly FPGA2_XLARGE48 = InstanceType.of(InstanceClass.FPGA2, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `g4ad.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4AD} Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.GRAPHICS4_AMD_NVME_DRIVE_XLARGE16
   */
  public static readonly G4AD_XLARGE16 = InstanceType.of(InstanceClass.G4AD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `g4ad.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4AD} Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.G4AD_XLARGE16
   */
  public static readonly GRAPHICS4_AMD_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.GRAPHICS4_AMD_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `g4ad.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4AD} Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.GRAPHICS4_AMD_NVME_DRIVE_XLARGE2
   */
  public static readonly G4AD_XLARGE2 = InstanceType.of(InstanceClass.G4AD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `g4ad.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4AD} Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.G4AD_XLARGE2
   */
  public static readonly GRAPHICS4_AMD_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.GRAPHICS4_AMD_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `g4ad.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4AD} Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.GRAPHICS4_AMD_NVME_DRIVE_XLARGE4
   */
  public static readonly G4AD_XLARGE4 = InstanceType.of(InstanceClass.G4AD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `g4ad.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4AD} Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.G4AD_XLARGE4
   */
  public static readonly GRAPHICS4_AMD_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.GRAPHICS4_AMD_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `g4ad.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4AD} Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.GRAPHICS4_AMD_NVME_DRIVE_XLARGE8
   */
  public static readonly G4AD_XLARGE8 = InstanceType.of(InstanceClass.G4AD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `g4ad.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4AD} Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.G4AD_XLARGE8
   */
  public static readonly GRAPHICS4_AMD_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.GRAPHICS4_AMD_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `g4ad.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4AD} Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.GRAPHICS4_AMD_NVME_DRIVE_XLARGE
   */
  public static readonly G4AD_XLARGE = InstanceType.of(InstanceClass.G4AD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `g4ad.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4AD} Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.G4AD_XLARGE
   */
  public static readonly GRAPHICS4_AMD_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.GRAPHICS4_AMD_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `g4dn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4DN} Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE12
   */
  public static readonly G4DN_XLARGE12 = InstanceType.of(InstanceClass.G4DN, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `g4dn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4DN} Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.G4DN_XLARGE12
   */
  public static readonly GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE12 = InstanceType.of(InstanceClass.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `g4dn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4DN} Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE16
   */
  public static readonly G4DN_XLARGE16 = InstanceType.of(InstanceClass.G4DN, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `g4dn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4DN} Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.G4DN_XLARGE16
   */
  public static readonly GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE16 = InstanceType.of(InstanceClass.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `g4dn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4DN} Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE2
   */
  public static readonly G4DN_XLARGE2 = InstanceType.of(InstanceClass.G4DN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `g4dn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4DN} Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.G4DN_XLARGE2
   */
  public static readonly GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE2 = InstanceType.of(InstanceClass.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `g4dn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4DN} Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE4
   */
  public static readonly G4DN_XLARGE4 = InstanceType.of(InstanceClass.G4DN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `g4dn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4DN} Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.G4DN_XLARGE4
   */
  public static readonly GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE4 = InstanceType.of(InstanceClass.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `g4dn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4DN} Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE8
   */
  public static readonly G4DN_XLARGE8 = InstanceType.of(InstanceClass.G4DN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `g4dn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4DN} Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.G4DN_XLARGE8
   */
  public static readonly GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE8 = InstanceType.of(InstanceClass.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `g4dn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.G4DN} Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE_METAL
   */
  public static readonly G4DN_METAL = InstanceType.of(InstanceClass.G4DN, InstanceSize.METAL);

  /**
   * **Instance type**: `g4dn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.G4DN} Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.G4DN_METAL
   */
  public static readonly GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE_METAL = InstanceType.of(InstanceClass.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.METAL);

  /**
   * **Instance type**: `g4dn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4DN} Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE
   */
  public static readonly G4DN_XLARGE = InstanceType.of(InstanceClass.G4DN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `g4dn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G4DN} Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.G4DN_XLARGE
   */
  public static readonly GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE = InstanceType.of(InstanceClass.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `g5.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.GRAPHICS5_XLARGE12
   */
  public static readonly G5_XLARGE12 = InstanceType.of(InstanceClass.G5, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `g5.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.G5_XLARGE12
   */
  public static readonly GRAPHICS5_XLARGE12 = InstanceType.of(InstanceClass.GRAPHICS5, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `g5.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.GRAPHICS5_XLARGE16
   */
  public static readonly G5_XLARGE16 = InstanceType.of(InstanceClass.G5, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `g5.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.G5_XLARGE16
   */
  public static readonly GRAPHICS5_XLARGE16 = InstanceType.of(InstanceClass.GRAPHICS5, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `g5.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.GRAPHICS5_XLARGE24
   */
  public static readonly G5_XLARGE24 = InstanceType.of(InstanceClass.G5, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `g5.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.G5_XLARGE24
   */
  public static readonly GRAPHICS5_XLARGE24 = InstanceType.of(InstanceClass.GRAPHICS5, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `g5.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.GRAPHICS5_XLARGE2
   */
  public static readonly G5_XLARGE2 = InstanceType.of(InstanceClass.G5, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `g5.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.G5_XLARGE2
   */
  public static readonly GRAPHICS5_XLARGE2 = InstanceType.of(InstanceClass.GRAPHICS5, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `g5.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.GRAPHICS5_XLARGE48
   */
  public static readonly G5_XLARGE48 = InstanceType.of(InstanceClass.G5, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `g5.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.G5_XLARGE48
   */
  public static readonly GRAPHICS5_XLARGE48 = InstanceType.of(InstanceClass.GRAPHICS5, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `g5.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.GRAPHICS5_XLARGE4
   */
  public static readonly G5_XLARGE4 = InstanceType.of(InstanceClass.G5, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `g5.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.G5_XLARGE4
   */
  public static readonly GRAPHICS5_XLARGE4 = InstanceType.of(InstanceClass.GRAPHICS5, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `g5.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.GRAPHICS5_XLARGE8
   */
  public static readonly G5_XLARGE8 = InstanceType.of(InstanceClass.G5, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `g5.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.G5_XLARGE8
   */
  public static readonly GRAPHICS5_XLARGE8 = InstanceType.of(InstanceClass.GRAPHICS5, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `g5.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.GRAPHICS5_XLARGE
   */
  public static readonly G5_XLARGE = InstanceType.of(InstanceClass.G5, InstanceSize.XLARGE);

  /**
   * **Instance type**: `g5.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5} Graphics-optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.G5_XLARGE
   */
  public static readonly GRAPHICS5_XLARGE = InstanceType.of(InstanceClass.GRAPHICS5, InstanceSize.XLARGE);

  /**
   * **Instance type**: `g5g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5G} Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.GRAPHICS5_GRAVITON2_XLARGE16
   */
  public static readonly G5G_XLARGE16 = InstanceType.of(InstanceClass.G5G, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `g5g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5G} Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.G5G_XLARGE16
   */
  public static readonly GRAPHICS5_GRAVITON2_XLARGE16 = InstanceType.of(InstanceClass.GRAPHICS5_GRAVITON2, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `g5g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5G} Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.GRAPHICS5_GRAVITON2_XLARGE2
   */
  public static readonly G5G_XLARGE2 = InstanceType.of(InstanceClass.G5G, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `g5g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5G} Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.G5G_XLARGE2
   */
  public static readonly GRAPHICS5_GRAVITON2_XLARGE2 = InstanceType.of(InstanceClass.GRAPHICS5_GRAVITON2, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `g5g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5G} Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.GRAPHICS5_GRAVITON2_XLARGE4
   */
  public static readonly G5G_XLARGE4 = InstanceType.of(InstanceClass.G5G, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `g5g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5G} Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.G5G_XLARGE4
   */
  public static readonly GRAPHICS5_GRAVITON2_XLARGE4 = InstanceType.of(InstanceClass.GRAPHICS5_GRAVITON2, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `g5g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5G} Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.GRAPHICS5_GRAVITON2_XLARGE8
   */
  public static readonly G5G_XLARGE8 = InstanceType.of(InstanceClass.G5G, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `g5g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5G} Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.G5G_XLARGE8
   */
  public static readonly GRAPHICS5_GRAVITON2_XLARGE8 = InstanceType.of(InstanceClass.GRAPHICS5_GRAVITON2, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `g5g.metal`:
   *
   * * **Instance class**: {@link InstanceClass.G5G} Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.GRAPHICS5_GRAVITON2_METAL
   */
  public static readonly G5G_METAL = InstanceType.of(InstanceClass.G5G, InstanceSize.METAL);

  /**
   * **Instance type**: `g5g.metal`:
   *
   * * **Instance class**: {@link InstanceClass.G5G} Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.G5G_METAL
   */
  public static readonly GRAPHICS5_GRAVITON2_METAL = InstanceType.of(InstanceClass.GRAPHICS5_GRAVITON2, InstanceSize.METAL);

  /**
   * **Instance type**: `g5g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5G} Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.GRAPHICS5_GRAVITON2_XLARGE
   */
  public static readonly G5G_XLARGE = InstanceType.of(InstanceClass.G5G, InstanceSize.XLARGE);

  /**
   * **Instance type**: `g5g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G5G} Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.G5G_XLARGE
   */
  public static readonly GRAPHICS5_GRAVITON2_XLARGE = InstanceType.of(InstanceClass.GRAPHICS5_GRAVITON2, InstanceSize.XLARGE);

  /**
   * **Instance type**: `g6.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.GRAPHICS6_XLARGE12
   */
  public static readonly G6_XLARGE12 = InstanceType.of(InstanceClass.G6, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `g6.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.G6_XLARGE12
   */
  public static readonly GRAPHICS6_XLARGE12 = InstanceType.of(InstanceClass.GRAPHICS6, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `g6.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.GRAPHICS6_XLARGE16
   */
  public static readonly G6_XLARGE16 = InstanceType.of(InstanceClass.G6, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `g6.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.G6_XLARGE16
   */
  public static readonly GRAPHICS6_XLARGE16 = InstanceType.of(InstanceClass.GRAPHICS6, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `g6.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.GRAPHICS6_XLARGE24
   */
  public static readonly G6_XLARGE24 = InstanceType.of(InstanceClass.G6, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `g6.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.G6_XLARGE24
   */
  public static readonly GRAPHICS6_XLARGE24 = InstanceType.of(InstanceClass.GRAPHICS6, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `g6.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.GRAPHICS6_XLARGE2
   */
  public static readonly G6_XLARGE2 = InstanceType.of(InstanceClass.G6, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `g6.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.G6_XLARGE2
   */
  public static readonly GRAPHICS6_XLARGE2 = InstanceType.of(InstanceClass.GRAPHICS6, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `g6.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.GRAPHICS6_XLARGE48
   */
  public static readonly G6_XLARGE48 = InstanceType.of(InstanceClass.G6, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `g6.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.G6_XLARGE48
   */
  public static readonly GRAPHICS6_XLARGE48 = InstanceType.of(InstanceClass.GRAPHICS6, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `g6.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.GRAPHICS6_XLARGE4
   */
  public static readonly G6_XLARGE4 = InstanceType.of(InstanceClass.G6, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `g6.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.G6_XLARGE4
   */
  public static readonly GRAPHICS6_XLARGE4 = InstanceType.of(InstanceClass.GRAPHICS6, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `g6.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.GRAPHICS6_XLARGE8
   */
  public static readonly G6_XLARGE8 = InstanceType.of(InstanceClass.G6, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `g6.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.G6_XLARGE8
   */
  public static readonly GRAPHICS6_XLARGE8 = InstanceType.of(InstanceClass.GRAPHICS6, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `g6.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.GRAPHICS6_XLARGE
   */
  public static readonly G6_XLARGE = InstanceType.of(InstanceClass.G6, InstanceSize.XLARGE);

  /**
   * **Instance type**: `g6.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6} Graphics-optimized instances, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.G6_XLARGE
   */
  public static readonly GRAPHICS6_XLARGE = InstanceType.of(InstanceClass.GRAPHICS6, InstanceSize.XLARGE);

  /**
   * **Instance type**: `g6e.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.GRAPHICS6_EFFICIENT_XLARGE12
   */
  public static readonly G6E_XLARGE12 = InstanceType.of(InstanceClass.G6E, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `g6e.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.G6E_XLARGE12
   */
  public static readonly GRAPHICS6_EFFICIENT_XLARGE12 = InstanceType.of(InstanceClass.GRAPHICS6_EFFICIENT, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `g6e.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.GRAPHICS6_EFFICIENT_XLARGE16
   */
  public static readonly G6E_XLARGE16 = InstanceType.of(InstanceClass.G6E, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `g6e.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.G6E_XLARGE16
   */
  public static readonly GRAPHICS6_EFFICIENT_XLARGE16 = InstanceType.of(InstanceClass.GRAPHICS6_EFFICIENT, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `g6e.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.GRAPHICS6_EFFICIENT_XLARGE24
   */
  public static readonly G6E_XLARGE24 = InstanceType.of(InstanceClass.G6E, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `g6e.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.G6E_XLARGE24
   */
  public static readonly GRAPHICS6_EFFICIENT_XLARGE24 = InstanceType.of(InstanceClass.GRAPHICS6_EFFICIENT, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `g6e.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.GRAPHICS6_EFFICIENT_XLARGE2
   */
  public static readonly G6E_XLARGE2 = InstanceType.of(InstanceClass.G6E, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `g6e.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.G6E_XLARGE2
   */
  public static readonly GRAPHICS6_EFFICIENT_XLARGE2 = InstanceType.of(InstanceClass.GRAPHICS6_EFFICIENT, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `g6e.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.GRAPHICS6_EFFICIENT_XLARGE48
   */
  public static readonly G6E_XLARGE48 = InstanceType.of(InstanceClass.G6E, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `g6e.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.G6E_XLARGE48
   */
  public static readonly GRAPHICS6_EFFICIENT_XLARGE48 = InstanceType.of(InstanceClass.GRAPHICS6_EFFICIENT, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `g6e.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.GRAPHICS6_EFFICIENT_XLARGE4
   */
  public static readonly G6E_XLARGE4 = InstanceType.of(InstanceClass.G6E, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `g6e.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.G6E_XLARGE4
   */
  public static readonly GRAPHICS6_EFFICIENT_XLARGE4 = InstanceType.of(InstanceClass.GRAPHICS6_EFFICIENT, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `g6e.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.GRAPHICS6_EFFICIENT_XLARGE8
   */
  public static readonly G6E_XLARGE8 = InstanceType.of(InstanceClass.G6E, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `g6e.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.G6E_XLARGE8
   */
  public static readonly GRAPHICS6_EFFICIENT_XLARGE8 = InstanceType.of(InstanceClass.GRAPHICS6_EFFICIENT, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `g6e.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.GRAPHICS6_EFFICIENT_XLARGE
   */
  public static readonly G6E_XLARGE = InstanceType.of(InstanceClass.G6E, InstanceSize.XLARGE);

  /**
   * **Instance type**: `g6e.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.G6E} Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.G6E_XLARGE
   */
  public static readonly GRAPHICS6_EFFICIENT_XLARGE = InstanceType.of(InstanceClass.GRAPHICS6_EFFICIENT, InstanceSize.XLARGE);

  /**
   * **Instance type**: `gr6.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.GR6} Graphics-optimized instances, 6th generationGr6 instances offer a 1:8 vCPU to RAM ratio, making them better suited for graphics workloads with higher memory requirements.
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.GRAPHICS_RAM_6_XLARGE4
   */
  public static readonly GR6_XLARGE4 = InstanceType.of(InstanceClass.GR6, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `gr6.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.GR6} Graphics-optimized instances, 6th generationGr6 instances offer a 1:8 vCPU to RAM ratio, making them better suited for graphics workloads with higher memory requirements.
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.GR6_XLARGE4
   */
  public static readonly GRAPHICS_RAM_6_XLARGE4 = InstanceType.of(InstanceClass.GRAPHICS_RAM_6, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `gr6.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.GR6} Graphics-optimized instances, 6th generationGr6 instances offer a 1:8 vCPU to RAM ratio, making them better suited for graphics workloads with higher memory requirements.
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.GRAPHICS_RAM_6_XLARGE8
   */
  public static readonly GR6_XLARGE8 = InstanceType.of(InstanceClass.GR6, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `gr6.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.GR6} Graphics-optimized instances, 6th generationGr6 instances offer a 1:8 vCPU to RAM ratio, making them better suited for graphics workloads with higher memory requirements.
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.GR6_XLARGE8
   */
  public static readonly GRAPHICS_RAM_6_XLARGE8 = InstanceType.of(InstanceClass.GRAPHICS_RAM_6, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `h1.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.H1} Storage/compute balanced instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STORAGE_COMPUTE_1_XLARGE16
   */
  public static readonly H1_XLARGE16 = InstanceType.of(InstanceClass.H1, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `h1.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.H1} Storage/compute balanced instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.H1_XLARGE16
   */
  public static readonly STORAGE_COMPUTE_1_XLARGE16 = InstanceType.of(InstanceClass.STORAGE_COMPUTE_1, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `h1.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.H1} Storage/compute balanced instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STORAGE_COMPUTE_1_XLARGE2
   */
  public static readonly H1_XLARGE2 = InstanceType.of(InstanceClass.H1, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `h1.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.H1} Storage/compute balanced instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.H1_XLARGE2
   */
  public static readonly STORAGE_COMPUTE_1_XLARGE2 = InstanceType.of(InstanceClass.STORAGE_COMPUTE_1, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `h1.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.H1} Storage/compute balanced instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STORAGE_COMPUTE_1_XLARGE4
   */
  public static readonly H1_XLARGE4 = InstanceType.of(InstanceClass.H1, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `h1.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.H1} Storage/compute balanced instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.H1_XLARGE4
   */
  public static readonly STORAGE_COMPUTE_1_XLARGE4 = InstanceType.of(InstanceClass.STORAGE_COMPUTE_1, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `h1.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.H1} Storage/compute balanced instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STORAGE_COMPUTE_1_XLARGE8
   */
  public static readonly H1_XLARGE8 = InstanceType.of(InstanceClass.H1, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `h1.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.H1} Storage/compute balanced instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.H1_XLARGE8
   */
  public static readonly STORAGE_COMPUTE_1_XLARGE8 = InstanceType.of(InstanceClass.STORAGE_COMPUTE_1, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `hpc7g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.HPC7G} High performance computing based on Graviton, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.HIGH_PERFORMANCE_COMPUTING7_GRAVITON_XLARGE16
   */
  public static readonly HPC7G_XLARGE16 = InstanceType.of(InstanceClass.HPC7G, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `hpc7g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.HPC7G} High performance computing based on Graviton, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.HPC7G_XLARGE16
   */
  public static readonly HIGH_PERFORMANCE_COMPUTING7_GRAVITON_XLARGE16 = InstanceType.of(InstanceClass.HIGH_PERFORMANCE_COMPUTING7_GRAVITON, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `hpc7g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.HPC7G} High performance computing based on Graviton, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.HIGH_PERFORMANCE_COMPUTING7_GRAVITON_XLARGE4
   */
  public static readonly HPC7G_XLARGE4 = InstanceType.of(InstanceClass.HPC7G, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `hpc7g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.HPC7G} High performance computing based on Graviton, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.HPC7G_XLARGE4
   */
  public static readonly HIGH_PERFORMANCE_COMPUTING7_GRAVITON_XLARGE4 = InstanceType.of(InstanceClass.HIGH_PERFORMANCE_COMPUTING7_GRAVITON, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `hpc7g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.HPC7G} High performance computing based on Graviton, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.HIGH_PERFORMANCE_COMPUTING7_GRAVITON_XLARGE8
   */
  public static readonly HPC7G_XLARGE8 = InstanceType.of(InstanceClass.HPC7G, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `hpc7g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.HPC7G} High performance computing based on Graviton, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.HPC7G_XLARGE8
   */
  public static readonly HIGH_PERFORMANCE_COMPUTING7_GRAVITON_XLARGE8 = InstanceType.of(InstanceClass.HIGH_PERFORMANCE_COMPUTING7_GRAVITON, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `i3.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3} I/O-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.IO3_XLARGE16
   */
  public static readonly I3_XLARGE16 = InstanceType.of(InstanceClass.I3, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `i3.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3} I/O-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.I3_XLARGE16
   */
  public static readonly IO3_XLARGE16 = InstanceType.of(InstanceClass.IO3, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `i3.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3} I/O-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.IO3_XLARGE2
   */
  public static readonly I3_XLARGE2 = InstanceType.of(InstanceClass.I3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `i3.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3} I/O-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.I3_XLARGE2
   */
  public static readonly IO3_XLARGE2 = InstanceType.of(InstanceClass.IO3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `i3.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3} I/O-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.IO3_XLARGE4
   */
  public static readonly I3_XLARGE4 = InstanceType.of(InstanceClass.I3, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `i3.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3} I/O-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.I3_XLARGE4
   */
  public static readonly IO3_XLARGE4 = InstanceType.of(InstanceClass.IO3, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `i3.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3} I/O-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.IO3_XLARGE8
   */
  public static readonly I3_XLARGE8 = InstanceType.of(InstanceClass.I3, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `i3.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3} I/O-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.I3_XLARGE8
   */
  public static readonly IO3_XLARGE8 = InstanceType.of(InstanceClass.IO3, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `i3.large`:
   *
   * * **Instance class**: {@link InstanceClass.I3} I/O-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.IO3_LARGE
   */
  public static readonly I3_LARGE = InstanceType.of(InstanceClass.I3, InstanceSize.LARGE);

  /**
   * **Instance type**: `i3.large`:
   *
   * * **Instance class**: {@link InstanceClass.I3} I/O-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.I3_LARGE
   */
  public static readonly IO3_LARGE = InstanceType.of(InstanceClass.IO3, InstanceSize.LARGE);

  /**
   * **Instance type**: `i3.metal`:
   *
   * * **Instance class**: {@link InstanceClass.I3} I/O-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.IO3_METAL
   */
  public static readonly I3_METAL = InstanceType.of(InstanceClass.I3, InstanceSize.METAL);

  /**
   * **Instance type**: `i3.metal`:
   *
   * * **Instance class**: {@link InstanceClass.I3} I/O-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.I3_METAL
   */
  public static readonly IO3_METAL = InstanceType.of(InstanceClass.IO3, InstanceSize.METAL);

  /**
   * **Instance type**: `i3.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3} I/O-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.IO3_XLARGE
   */
  public static readonly I3_XLARGE = InstanceType.of(InstanceClass.I3, InstanceSize.XLARGE);

  /**
   * **Instance type**: `i3.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3} I/O-optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.I3_XLARGE
   */
  public static readonly IO3_XLARGE = InstanceType.of(InstanceClass.IO3, InstanceSize.XLARGE);

  /**
   * **Instance type**: `i3en.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.IO3_DENSE_NVME_DRIVE_XLARGE12
   */
  public static readonly I3EN_XLARGE12 = InstanceType.of(InstanceClass.I3EN, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `i3en.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.I3EN_XLARGE12
   */
  public static readonly IO3_DENSE_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.IO3_DENSE_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `i3en.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.IO3_DENSE_NVME_DRIVE_XLARGE24
   */
  public static readonly I3EN_XLARGE24 = InstanceType.of(InstanceClass.I3EN, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `i3en.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.I3EN_XLARGE24
   */
  public static readonly IO3_DENSE_NVME_DRIVE_XLARGE24 = InstanceType.of(InstanceClass.IO3_DENSE_NVME_DRIVE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `i3en.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.IO3_DENSE_NVME_DRIVE_XLARGE2
   */
  public static readonly I3EN_XLARGE2 = InstanceType.of(InstanceClass.I3EN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `i3en.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.I3EN_XLARGE2
   */
  public static readonly IO3_DENSE_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.IO3_DENSE_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `i3en.3xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE3}
   *
   * @alias NamedInstanceType.IO3_DENSE_NVME_DRIVE_XLARGE3
   */
  public static readonly I3EN_XLARGE3 = InstanceType.of(InstanceClass.I3EN, InstanceSize.XLARGE3);

  /**
   * **Instance type**: `i3en.3xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE3}
   *
   * @alias NamedInstanceType.I3EN_XLARGE3
   */
  public static readonly IO3_DENSE_NVME_DRIVE_XLARGE3 = InstanceType.of(InstanceClass.IO3_DENSE_NVME_DRIVE, InstanceSize.XLARGE3);

  /**
   * **Instance type**: `i3en.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.IO3_DENSE_NVME_DRIVE_XLARGE6
   */
  public static readonly I3EN_XLARGE6 = InstanceType.of(InstanceClass.I3EN, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `i3en.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.I3EN_XLARGE6
   */
  public static readonly IO3_DENSE_NVME_DRIVE_XLARGE6 = InstanceType.of(InstanceClass.IO3_DENSE_NVME_DRIVE, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `i3en.large`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.IO3_DENSE_NVME_DRIVE_LARGE
   */
  public static readonly I3EN_LARGE = InstanceType.of(InstanceClass.I3EN, InstanceSize.LARGE);

  /**
   * **Instance type**: `i3en.large`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.I3EN_LARGE
   */
  public static readonly IO3_DENSE_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.IO3_DENSE_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `i3en.metal`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.IO3_DENSE_NVME_DRIVE_METAL
   */
  public static readonly I3EN_METAL = InstanceType.of(InstanceClass.I3EN, InstanceSize.METAL);

  /**
   * **Instance type**: `i3en.metal`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.I3EN_METAL
   */
  public static readonly IO3_DENSE_NVME_DRIVE_METAL = InstanceType.of(InstanceClass.IO3_DENSE_NVME_DRIVE, InstanceSize.METAL);

  /**
   * **Instance type**: `i3en.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.IO3_DENSE_NVME_DRIVE_XLARGE
   */
  public static readonly I3EN_XLARGE = InstanceType.of(InstanceClass.I3EN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `i3en.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I3EN} I/O-optimized instances with local NVME drive, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.I3EN_XLARGE
   */
  public static readonly IO3_DENSE_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.IO3_DENSE_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `i4g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4G} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_XLARGE16
   */
  public static readonly I4G_XLARGE16 = InstanceType.of(InstanceClass.I4G, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `i4g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4G} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.I4G_XLARGE16
   */
  public static readonly STORAGE4_GRAVITON_XLARGE16 = InstanceType.of(InstanceClass.STORAGE4_GRAVITON, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `i4g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4G} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_XLARGE2
   */
  public static readonly I4G_XLARGE2 = InstanceType.of(InstanceClass.I4G, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `i4g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4G} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.I4G_XLARGE2
   */
  public static readonly STORAGE4_GRAVITON_XLARGE2 = InstanceType.of(InstanceClass.STORAGE4_GRAVITON, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `i4g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4G} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_XLARGE4
   */
  public static readonly I4G_XLARGE4 = InstanceType.of(InstanceClass.I4G, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `i4g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4G} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.I4G_XLARGE4
   */
  public static readonly STORAGE4_GRAVITON_XLARGE4 = InstanceType.of(InstanceClass.STORAGE4_GRAVITON, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `i4g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4G} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_XLARGE8
   */
  public static readonly I4G_XLARGE8 = InstanceType.of(InstanceClass.I4G, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `i4g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4G} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.I4G_XLARGE8
   */
  public static readonly STORAGE4_GRAVITON_XLARGE8 = InstanceType.of(InstanceClass.STORAGE4_GRAVITON, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `i4g.large`:
   *
   * * **Instance class**: {@link InstanceClass.I4G} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_LARGE
   */
  public static readonly I4G_LARGE = InstanceType.of(InstanceClass.I4G, InstanceSize.LARGE);

  /**
   * **Instance type**: `i4g.large`:
   *
   * * **Instance class**: {@link InstanceClass.I4G} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.I4G_LARGE
   */
  public static readonly STORAGE4_GRAVITON_LARGE = InstanceType.of(InstanceClass.STORAGE4_GRAVITON, InstanceSize.LARGE);

  /**
   * **Instance type**: `i4g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4G} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_XLARGE
   */
  public static readonly I4G_XLARGE = InstanceType.of(InstanceClass.I4G, InstanceSize.XLARGE);

  /**
   * **Instance type**: `i4g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4G} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.I4G_XLARGE
   */
  public static readonly STORAGE4_GRAVITON_XLARGE = InstanceType.of(InstanceClass.STORAGE4_GRAVITON, InstanceSize.XLARGE);

  /**
   * **Instance type**: `i4i.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.IO4_INTEL_XLARGE12
   */
  public static readonly I4I_XLARGE12 = InstanceType.of(InstanceClass.I4I, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `i4i.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.I4I_XLARGE12
   */
  public static readonly IO4_INTEL_XLARGE12 = InstanceType.of(InstanceClass.IO4_INTEL, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `i4i.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.IO4_INTEL_XLARGE16
   */
  public static readonly I4I_XLARGE16 = InstanceType.of(InstanceClass.I4I, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `i4i.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.I4I_XLARGE16
   */
  public static readonly IO4_INTEL_XLARGE16 = InstanceType.of(InstanceClass.IO4_INTEL, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `i4i.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.IO4_INTEL_XLARGE24
   */
  public static readonly I4I_XLARGE24 = InstanceType.of(InstanceClass.I4I, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `i4i.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.I4I_XLARGE24
   */
  public static readonly IO4_INTEL_XLARGE24 = InstanceType.of(InstanceClass.IO4_INTEL, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `i4i.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.IO4_INTEL_XLARGE2
   */
  public static readonly I4I_XLARGE2 = InstanceType.of(InstanceClass.I4I, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `i4i.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.I4I_XLARGE2
   */
  public static readonly IO4_INTEL_XLARGE2 = InstanceType.of(InstanceClass.IO4_INTEL, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `i4i.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.IO4_INTEL_XLARGE32
   */
  public static readonly I4I_XLARGE32 = InstanceType.of(InstanceClass.I4I, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `i4i.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.I4I_XLARGE32
   */
  public static readonly IO4_INTEL_XLARGE32 = InstanceType.of(InstanceClass.IO4_INTEL, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `i4i.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.IO4_INTEL_XLARGE4
   */
  public static readonly I4I_XLARGE4 = InstanceType.of(InstanceClass.I4I, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `i4i.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.I4I_XLARGE4
   */
  public static readonly IO4_INTEL_XLARGE4 = InstanceType.of(InstanceClass.IO4_INTEL, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `i4i.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.IO4_INTEL_XLARGE8
   */
  public static readonly I4I_XLARGE8 = InstanceType.of(InstanceClass.I4I, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `i4i.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.I4I_XLARGE8
   */
  public static readonly IO4_INTEL_XLARGE8 = InstanceType.of(InstanceClass.IO4_INTEL, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `i4i.large`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.IO4_INTEL_LARGE
   */
  public static readonly I4I_LARGE = InstanceType.of(InstanceClass.I4I, InstanceSize.LARGE);

  /**
   * **Instance type**: `i4i.large`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.I4I_LARGE
   */
  public static readonly IO4_INTEL_LARGE = InstanceType.of(InstanceClass.IO4_INTEL, InstanceSize.LARGE);

  /**
   * **Instance type**: `i4i.metal`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.IO4_INTEL_METAL
   */
  public static readonly I4I_METAL = InstanceType.of(InstanceClass.I4I, InstanceSize.METAL);

  /**
   * **Instance type**: `i4i.metal`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.I4I_METAL
   */
  public static readonly IO4_INTEL_METAL = InstanceType.of(InstanceClass.IO4_INTEL, InstanceSize.METAL);

  /**
   * **Instance type**: `i4i.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.IO4_INTEL_XLARGE
   */
  public static readonly I4I_XLARGE = InstanceType.of(InstanceClass.I4I, InstanceSize.XLARGE);

  /**
   * **Instance type**: `i4i.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I4I} I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.I4I_XLARGE
   */
  public static readonly IO4_INTEL_XLARGE = InstanceType.of(InstanceClass.IO4_INTEL, InstanceSize.XLARGE);

  /**
   * **Instance type**: `i7ie.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE12
   */
  public static readonly I7IE_XLARGE12 = InstanceType.of(InstanceClass.I7IE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `i7ie.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.I7IE_XLARGE12
   */
  public static readonly STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE12 = InstanceType.of(InstanceClass.STORAGE7_INTEL_STORAGE_OPTIMIZED, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `i7ie.18xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE18}
   *
   * @alias NamedInstanceType.STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE18
   */
  public static readonly I7IE_XLARGE18 = InstanceType.of(InstanceClass.I7IE, InstanceSize.XLARGE18);

  /**
   * **Instance type**: `i7ie.18xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE18}
   *
   * @alias NamedInstanceType.I7IE_XLARGE18
   */
  public static readonly STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE18 = InstanceType.of(InstanceClass.STORAGE7_INTEL_STORAGE_OPTIMIZED, InstanceSize.XLARGE18);

  /**
   * **Instance type**: `i7ie.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE24
   */
  public static readonly I7IE_XLARGE24 = InstanceType.of(InstanceClass.I7IE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `i7ie.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.I7IE_XLARGE24
   */
  public static readonly STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE24 = InstanceType.of(InstanceClass.STORAGE7_INTEL_STORAGE_OPTIMIZED, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `i7ie.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE2
   */
  public static readonly I7IE_XLARGE2 = InstanceType.of(InstanceClass.I7IE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `i7ie.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.I7IE_XLARGE2
   */
  public static readonly STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE2 = InstanceType.of(InstanceClass.STORAGE7_INTEL_STORAGE_OPTIMIZED, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `i7ie.3xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE3}
   *
   * @alias NamedInstanceType.STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE3
   */
  public static readonly I7IE_XLARGE3 = InstanceType.of(InstanceClass.I7IE, InstanceSize.XLARGE3);

  /**
   * **Instance type**: `i7ie.3xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE3}
   *
   * @alias NamedInstanceType.I7IE_XLARGE3
   */
  public static readonly STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE3 = InstanceType.of(InstanceClass.STORAGE7_INTEL_STORAGE_OPTIMIZED, InstanceSize.XLARGE3);

  /**
   * **Instance type**: `i7ie.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE48
   */
  public static readonly I7IE_XLARGE48 = InstanceType.of(InstanceClass.I7IE, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `i7ie.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.I7IE_XLARGE48
   */
  public static readonly STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE48 = InstanceType.of(InstanceClass.STORAGE7_INTEL_STORAGE_OPTIMIZED, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `i7ie.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE6
   */
  public static readonly I7IE_XLARGE6 = InstanceType.of(InstanceClass.I7IE, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `i7ie.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.I7IE_XLARGE6
   */
  public static readonly STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE6 = InstanceType.of(InstanceClass.STORAGE7_INTEL_STORAGE_OPTIMIZED, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `i7ie.large`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STORAGE7_INTEL_STORAGE_OPTIMIZED_LARGE
   */
  public static readonly I7IE_LARGE = InstanceType.of(InstanceClass.I7IE, InstanceSize.LARGE);

  /**
   * **Instance type**: `i7ie.large`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.I7IE_LARGE
   */
  public static readonly STORAGE7_INTEL_STORAGE_OPTIMIZED_LARGE = InstanceType.of(InstanceClass.STORAGE7_INTEL_STORAGE_OPTIMIZED, InstanceSize.LARGE);

  /**
   * **Instance type**: `i7ie.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE
   */
  public static readonly I7IE_XLARGE = InstanceType.of(InstanceClass.I7IE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `i7ie.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I7IE} Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.I7IE_XLARGE
   */
  public static readonly STORAGE7_INTEL_STORAGE_OPTIMIZED_XLARGE = InstanceType.of(InstanceClass.STORAGE7_INTEL_STORAGE_OPTIMIZED, InstanceSize.XLARGE);

  /**
   * **Instance type**: `i8g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STORAGE8_GRAVITON_XLARGE12
   */
  public static readonly I8G_XLARGE12 = InstanceType.of(InstanceClass.I8G, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `i8g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.I8G_XLARGE12
   */
  public static readonly STORAGE8_GRAVITON_XLARGE12 = InstanceType.of(InstanceClass.STORAGE8_GRAVITON, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `i8g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STORAGE8_GRAVITON_XLARGE16
   */
  public static readonly I8G_XLARGE16 = InstanceType.of(InstanceClass.I8G, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `i8g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.I8G_XLARGE16
   */
  public static readonly STORAGE8_GRAVITON_XLARGE16 = InstanceType.of(InstanceClass.STORAGE8_GRAVITON, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `i8g.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STORAGE8_GRAVITON_XLARGE24
   */
  public static readonly I8G_XLARGE24 = InstanceType.of(InstanceClass.I8G, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `i8g.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.I8G_XLARGE24
   */
  public static readonly STORAGE8_GRAVITON_XLARGE24 = InstanceType.of(InstanceClass.STORAGE8_GRAVITON, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `i8g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STORAGE8_GRAVITON_XLARGE2
   */
  public static readonly I8G_XLARGE2 = InstanceType.of(InstanceClass.I8G, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `i8g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.I8G_XLARGE2
   */
  public static readonly STORAGE8_GRAVITON_XLARGE2 = InstanceType.of(InstanceClass.STORAGE8_GRAVITON, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `i8g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STORAGE8_GRAVITON_XLARGE4
   */
  public static readonly I8G_XLARGE4 = InstanceType.of(InstanceClass.I8G, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `i8g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.I8G_XLARGE4
   */
  public static readonly STORAGE8_GRAVITON_XLARGE4 = InstanceType.of(InstanceClass.STORAGE8_GRAVITON, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `i8g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STORAGE8_GRAVITON_XLARGE8
   */
  public static readonly I8G_XLARGE8 = InstanceType.of(InstanceClass.I8G, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `i8g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.I8G_XLARGE8
   */
  public static readonly STORAGE8_GRAVITON_XLARGE8 = InstanceType.of(InstanceClass.STORAGE8_GRAVITON, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `i8g.large`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STORAGE8_GRAVITON_LARGE
   */
  public static readonly I8G_LARGE = InstanceType.of(InstanceClass.I8G, InstanceSize.LARGE);

  /**
   * **Instance type**: `i8g.large`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.I8G_LARGE
   */
  public static readonly STORAGE8_GRAVITON_LARGE = InstanceType.of(InstanceClass.STORAGE8_GRAVITON, InstanceSize.LARGE);

  /**
   * **Instance type**: `i8g.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.STORAGE8_GRAVITON_XLARGE24METAL
   */
  public static readonly I8G_XLARGE24METAL = InstanceType.of(InstanceClass.I8G, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `i8g.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.I8G_XLARGE24METAL
   */
  public static readonly STORAGE8_GRAVITON_XLARGE24METAL = InstanceType.of(InstanceClass.STORAGE8_GRAVITON, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `i8g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STORAGE8_GRAVITON_XLARGE
   */
  public static readonly I8G_XLARGE = InstanceType.of(InstanceClass.I8G, InstanceSize.XLARGE);

  /**
   * **Instance type**: `i8g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.I8G} Storage optimized instances powered by Graviton4 processor, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.I8G_XLARGE
   */
  public static readonly STORAGE8_GRAVITON_XLARGE = InstanceType.of(InstanceClass.STORAGE8_GRAVITON, InstanceSize.XLARGE);

  /**
   * **Instance type**: `im4gn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IM4GN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_NETWORK_OPTIMIZED_XLARGE16
   */
  public static readonly IM4GN_XLARGE16 = InstanceType.of(InstanceClass.IM4GN, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `im4gn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IM4GN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.IM4GN_XLARGE16
   */
  public static readonly STORAGE4_GRAVITON_NETWORK_OPTIMIZED_XLARGE16 = InstanceType.of(InstanceClass.STORAGE4_GRAVITON_NETWORK_OPTIMIZED, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `im4gn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IM4GN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_NETWORK_OPTIMIZED_XLARGE2
   */
  public static readonly IM4GN_XLARGE2 = InstanceType.of(InstanceClass.IM4GN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `im4gn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IM4GN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.IM4GN_XLARGE2
   */
  public static readonly STORAGE4_GRAVITON_NETWORK_OPTIMIZED_XLARGE2 = InstanceType.of(InstanceClass.STORAGE4_GRAVITON_NETWORK_OPTIMIZED, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `im4gn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IM4GN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_NETWORK_OPTIMIZED_XLARGE4
   */
  public static readonly IM4GN_XLARGE4 = InstanceType.of(InstanceClass.IM4GN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `im4gn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IM4GN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.IM4GN_XLARGE4
   */
  public static readonly STORAGE4_GRAVITON_NETWORK_OPTIMIZED_XLARGE4 = InstanceType.of(InstanceClass.STORAGE4_GRAVITON_NETWORK_OPTIMIZED, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `im4gn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IM4GN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_NETWORK_OPTIMIZED_XLARGE8
   */
  public static readonly IM4GN_XLARGE8 = InstanceType.of(InstanceClass.IM4GN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `im4gn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IM4GN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.IM4GN_XLARGE8
   */
  public static readonly STORAGE4_GRAVITON_NETWORK_OPTIMIZED_XLARGE8 = InstanceType.of(InstanceClass.STORAGE4_GRAVITON_NETWORK_OPTIMIZED, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `im4gn.large`:
   *
   * * **Instance class**: {@link InstanceClass.IM4GN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_NETWORK_OPTIMIZED_LARGE
   */
  public static readonly IM4GN_LARGE = InstanceType.of(InstanceClass.IM4GN, InstanceSize.LARGE);

  /**
   * **Instance type**: `im4gn.large`:
   *
   * * **Instance class**: {@link InstanceClass.IM4GN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.IM4GN_LARGE
   */
  public static readonly STORAGE4_GRAVITON_NETWORK_OPTIMIZED_LARGE = InstanceType.of(InstanceClass.STORAGE4_GRAVITON_NETWORK_OPTIMIZED, InstanceSize.LARGE);

  /**
   * **Instance type**: `im4gn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IM4GN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_NETWORK_OPTIMIZED_XLARGE
   */
  public static readonly IM4GN_XLARGE = InstanceType.of(InstanceClass.IM4GN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `im4gn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IM4GN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.IM4GN_XLARGE
   */
  public static readonly STORAGE4_GRAVITON_NETWORK_OPTIMIZED_XLARGE = InstanceType.of(InstanceClass.STORAGE4_GRAVITON_NETWORK_OPTIMIZED, InstanceSize.XLARGE);

  /**
   * **Instance type**: `inf1.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF1} Inferentia Chips based instances for machine learning inference applications, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.INFERENCE1_XLARGE24
   */
  public static readonly INF1_XLARGE24 = InstanceType.of(InstanceClass.INF1, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `inf1.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF1} Inferentia Chips based instances for machine learning inference applications, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.INF1_XLARGE24
   */
  public static readonly INFERENCE1_XLARGE24 = InstanceType.of(InstanceClass.INFERENCE1, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `inf1.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF1} Inferentia Chips based instances for machine learning inference applications, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.INFERENCE1_XLARGE2
   */
  public static readonly INF1_XLARGE2 = InstanceType.of(InstanceClass.INF1, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `inf1.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF1} Inferentia Chips based instances for machine learning inference applications, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.INF1_XLARGE2
   */
  public static readonly INFERENCE1_XLARGE2 = InstanceType.of(InstanceClass.INFERENCE1, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `inf1.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF1} Inferentia Chips based instances for machine learning inference applications, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.INFERENCE1_XLARGE6
   */
  public static readonly INF1_XLARGE6 = InstanceType.of(InstanceClass.INF1, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `inf1.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF1} Inferentia Chips based instances for machine learning inference applications, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.INF1_XLARGE6
   */
  public static readonly INFERENCE1_XLARGE6 = InstanceType.of(InstanceClass.INFERENCE1, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `inf1.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF1} Inferentia Chips based instances for machine learning inference applications, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.INFERENCE1_XLARGE
   */
  public static readonly INF1_XLARGE = InstanceType.of(InstanceClass.INF1, InstanceSize.XLARGE);

  /**
   * **Instance type**: `inf1.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF1} Inferentia Chips based instances for machine learning inference applications, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.INF1_XLARGE
   */
  public static readonly INFERENCE1_XLARGE = InstanceType.of(InstanceClass.INFERENCE1, InstanceSize.XLARGE);

  /**
   * **Instance type**: `inf2.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF2} Inferentia Chips based instances for machine learning inference applications, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.INFERENCE2_XLARGE24
   */
  public static readonly INF2_XLARGE24 = InstanceType.of(InstanceClass.INF2, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `inf2.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF2} Inferentia Chips based instances for machine learning inference applications, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.INF2_XLARGE24
   */
  public static readonly INFERENCE2_XLARGE24 = InstanceType.of(InstanceClass.INFERENCE2, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `inf2.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF2} Inferentia Chips based instances for machine learning inference applications, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.INFERENCE2_XLARGE48
   */
  public static readonly INF2_XLARGE48 = InstanceType.of(InstanceClass.INF2, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `inf2.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF2} Inferentia Chips based instances for machine learning inference applications, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.INF2_XLARGE48
   */
  public static readonly INFERENCE2_XLARGE48 = InstanceType.of(InstanceClass.INFERENCE2, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `inf2.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF2} Inferentia Chips based instances for machine learning inference applications, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.INFERENCE2_XLARGE8
   */
  public static readonly INF2_XLARGE8 = InstanceType.of(InstanceClass.INF2, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `inf2.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF2} Inferentia Chips based instances for machine learning inference applications, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.INF2_XLARGE8
   */
  public static readonly INFERENCE2_XLARGE8 = InstanceType.of(InstanceClass.INFERENCE2, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `inf2.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF2} Inferentia Chips based instances for machine learning inference applications, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.INFERENCE2_XLARGE
   */
  public static readonly INF2_XLARGE = InstanceType.of(InstanceClass.INF2, InstanceSize.XLARGE);

  /**
   * **Instance type**: `inf2.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.INF2} Inferentia Chips based instances for machine learning inference applications, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.INF2_XLARGE
   */
  public static readonly INFERENCE2_XLARGE = InstanceType.of(InstanceClass.INFERENCE2, InstanceSize.XLARGE);

  /**
   * **Instance type**: `is4gen.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IS4GEN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED_XLARGE2
   */
  public static readonly IS4GEN_XLARGE2 = InstanceType.of(InstanceClass.IS4GEN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `is4gen.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IS4GEN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.IS4GEN_XLARGE2
   */
  public static readonly STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED_XLARGE2 = InstanceType.of(InstanceClass.STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `is4gen.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IS4GEN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED_XLARGE4
   */
  public static readonly IS4GEN_XLARGE4 = InstanceType.of(InstanceClass.IS4GEN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `is4gen.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IS4GEN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.IS4GEN_XLARGE4
   */
  public static readonly STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED_XLARGE4 = InstanceType.of(InstanceClass.STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `is4gen.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IS4GEN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED_XLARGE8
   */
  public static readonly IS4GEN_XLARGE8 = InstanceType.of(InstanceClass.IS4GEN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `is4gen.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IS4GEN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.IS4GEN_XLARGE8
   */
  public static readonly STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED_XLARGE8 = InstanceType.of(InstanceClass.STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `is4gen.large`:
   *
   * * **Instance class**: {@link InstanceClass.IS4GEN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED_LARGE
   */
  public static readonly IS4GEN_LARGE = InstanceType.of(InstanceClass.IS4GEN, InstanceSize.LARGE);

  /**
   * **Instance type**: `is4gen.large`:
   *
   * * **Instance class**: {@link InstanceClass.IS4GEN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.IS4GEN_LARGE
   */
  public static readonly STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED_LARGE = InstanceType.of(InstanceClass.STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED, InstanceSize.LARGE);

  /**
   * **Instance type**: `is4gen.medium`:
   *
   * * **Instance class**: {@link InstanceClass.IS4GEN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED_MEDIUM
   */
  public static readonly IS4GEN_MEDIUM = InstanceType.of(InstanceClass.IS4GEN, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `is4gen.medium`:
   *
   * * **Instance class**: {@link InstanceClass.IS4GEN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.IS4GEN_MEDIUM
   */
  public static readonly STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED_MEDIUM = InstanceType.of(InstanceClass.STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `is4gen.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IS4GEN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED_XLARGE
   */
  public static readonly IS4GEN_XLARGE = InstanceType.of(InstanceClass.IS4GEN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `is4gen.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.IS4GEN} Storage optimized instances powered by Graviton2 processor, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.IS4GEN_XLARGE
   */
  public static readonly STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED_XLARGE = InstanceType.of(InstanceClass.STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m3.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M3} Standard instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD3_XLARGE2
   */
  public static readonly M3_XLARGE2 = InstanceType.of(InstanceClass.M3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m3.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M3} Standard instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M3_XLARGE2
   */
  public static readonly STANDARD3_XLARGE2 = InstanceType.of(InstanceClass.STANDARD3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m3.large`:
   *
   * * **Instance class**: {@link InstanceClass.M3} Standard instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD3_LARGE
   */
  public static readonly M3_LARGE = InstanceType.of(InstanceClass.M3, InstanceSize.LARGE);

  /**
   * **Instance type**: `m3.large`:
   *
   * * **Instance class**: {@link InstanceClass.M3} Standard instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M3_LARGE
   */
  public static readonly STANDARD3_LARGE = InstanceType.of(InstanceClass.STANDARD3, InstanceSize.LARGE);

  /**
   * **Instance type**: `m3.medium`:
   *
   * * **Instance class**: {@link InstanceClass.M3} Standard instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.STANDARD3_MEDIUM
   */
  public static readonly M3_MEDIUM = InstanceType.of(InstanceClass.M3, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `m3.medium`:
   *
   * * **Instance class**: {@link InstanceClass.M3} Standard instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.M3_MEDIUM
   */
  public static readonly STANDARD3_MEDIUM = InstanceType.of(InstanceClass.STANDARD3, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `m3.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M3} Standard instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD3_XLARGE
   */
  public static readonly M3_XLARGE = InstanceType.of(InstanceClass.M3, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m3.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M3} Standard instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M3_XLARGE
   */
  public static readonly STANDARD3_XLARGE = InstanceType.of(InstanceClass.STANDARD3, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m4.10xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M4} Standard instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE10}
   *
   * @alias NamedInstanceType.STANDARD4_XLARGE10
   */
  public static readonly M4_XLARGE10 = InstanceType.of(InstanceClass.M4, InstanceSize.XLARGE10);

  /**
   * **Instance type**: `m4.10xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M4} Standard instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE10}
   *
   * @alias NamedInstanceType.M4_XLARGE10
   */
  public static readonly STANDARD4_XLARGE10 = InstanceType.of(InstanceClass.STANDARD4, InstanceSize.XLARGE10);

  /**
   * **Instance type**: `m4.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M4} Standard instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD4_XLARGE16
   */
  public static readonly M4_XLARGE16 = InstanceType.of(InstanceClass.M4, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m4.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M4} Standard instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M4_XLARGE16
   */
  public static readonly STANDARD4_XLARGE16 = InstanceType.of(InstanceClass.STANDARD4, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m4.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M4} Standard instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD4_XLARGE2
   */
  public static readonly M4_XLARGE2 = InstanceType.of(InstanceClass.M4, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m4.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M4} Standard instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M4_XLARGE2
   */
  public static readonly STANDARD4_XLARGE2 = InstanceType.of(InstanceClass.STANDARD4, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m4.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M4} Standard instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD4_XLARGE4
   */
  public static readonly M4_XLARGE4 = InstanceType.of(InstanceClass.M4, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m4.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M4} Standard instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M4_XLARGE4
   */
  public static readonly STANDARD4_XLARGE4 = InstanceType.of(InstanceClass.STANDARD4, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m4.large`:
   *
   * * **Instance class**: {@link InstanceClass.M4} Standard instances, 4th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD4_LARGE
   */
  public static readonly M4_LARGE = InstanceType.of(InstanceClass.M4, InstanceSize.LARGE);

  /**
   * **Instance type**: `m4.large`:
   *
   * * **Instance class**: {@link InstanceClass.M4} Standard instances, 4th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M4_LARGE
   */
  public static readonly STANDARD4_LARGE = InstanceType.of(InstanceClass.STANDARD4, InstanceSize.LARGE);

  /**
   * **Instance type**: `m4.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M4} Standard instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD4_XLARGE
   */
  public static readonly M4_XLARGE = InstanceType.of(InstanceClass.M4, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m4.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M4} Standard instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M4_XLARGE
   */
  public static readonly STANDARD4_XLARGE = InstanceType.of(InstanceClass.STANDARD4, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m5.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD5_XLARGE12
   */
  public static readonly M5_XLARGE12 = InstanceType.of(InstanceClass.M5, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m5.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M5_XLARGE12
   */
  public static readonly STANDARD5_XLARGE12 = InstanceType.of(InstanceClass.STANDARD5, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m5.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD5_XLARGE16
   */
  public static readonly M5_XLARGE16 = InstanceType.of(InstanceClass.M5, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m5.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M5_XLARGE16
   */
  public static readonly STANDARD5_XLARGE16 = InstanceType.of(InstanceClass.STANDARD5, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m5.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STANDARD5_XLARGE24
   */
  public static readonly M5_XLARGE24 = InstanceType.of(InstanceClass.M5, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m5.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.M5_XLARGE24
   */
  public static readonly STANDARD5_XLARGE24 = InstanceType.of(InstanceClass.STANDARD5, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m5.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD5_XLARGE2
   */
  public static readonly M5_XLARGE2 = InstanceType.of(InstanceClass.M5, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m5.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M5_XLARGE2
   */
  public static readonly STANDARD5_XLARGE2 = InstanceType.of(InstanceClass.STANDARD5, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m5.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD5_XLARGE4
   */
  public static readonly M5_XLARGE4 = InstanceType.of(InstanceClass.M5, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m5.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M5_XLARGE4
   */
  public static readonly STANDARD5_XLARGE4 = InstanceType.of(InstanceClass.STANDARD5, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m5.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD5_XLARGE8
   */
  public static readonly M5_XLARGE8 = InstanceType.of(InstanceClass.M5, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m5.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M5_XLARGE8
   */
  public static readonly STANDARD5_XLARGE8 = InstanceType.of(InstanceClass.STANDARD5, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m5.large`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD5_LARGE
   */
  public static readonly M5_LARGE = InstanceType.of(InstanceClass.M5, InstanceSize.LARGE);

  /**
   * **Instance type**: `m5.large`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M5_LARGE
   */
  public static readonly STANDARD5_LARGE = InstanceType.of(InstanceClass.STANDARD5, InstanceSize.LARGE);

  /**
   * **Instance type**: `m5.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.STANDARD5_METAL
   */
  public static readonly M5_METAL = InstanceType.of(InstanceClass.M5, InstanceSize.METAL);

  /**
   * **Instance type**: `m5.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.M5_METAL
   */
  public static readonly STANDARD5_METAL = InstanceType.of(InstanceClass.STANDARD5, InstanceSize.METAL);

  /**
   * **Instance type**: `m5.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD5_XLARGE
   */
  public static readonly M5_XLARGE = InstanceType.of(InstanceClass.M5, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m5.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5} Standard instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M5_XLARGE
   */
  public static readonly STANDARD5_XLARGE = InstanceType.of(InstanceClass.STANDARD5, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m5a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_XLARGE12
   */
  public static readonly M5A_XLARGE12 = InstanceType.of(InstanceClass.M5A, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m5a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M5A_XLARGE12
   */
  public static readonly STANDARD5_AMD_XLARGE12 = InstanceType.of(InstanceClass.STANDARD5_AMD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m5a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_XLARGE16
   */
  public static readonly M5A_XLARGE16 = InstanceType.of(InstanceClass.M5A, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m5a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M5A_XLARGE16
   */
  public static readonly STANDARD5_AMD_XLARGE16 = InstanceType.of(InstanceClass.STANDARD5_AMD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m5a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_XLARGE24
   */
  public static readonly M5A_XLARGE24 = InstanceType.of(InstanceClass.M5A, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m5a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.M5A_XLARGE24
   */
  public static readonly STANDARD5_AMD_XLARGE24 = InstanceType.of(InstanceClass.STANDARD5_AMD, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m5a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_XLARGE2
   */
  public static readonly M5A_XLARGE2 = InstanceType.of(InstanceClass.M5A, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m5a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M5A_XLARGE2
   */
  public static readonly STANDARD5_AMD_XLARGE2 = InstanceType.of(InstanceClass.STANDARD5_AMD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m5a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_XLARGE4
   */
  public static readonly M5A_XLARGE4 = InstanceType.of(InstanceClass.M5A, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m5a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M5A_XLARGE4
   */
  public static readonly STANDARD5_AMD_XLARGE4 = InstanceType.of(InstanceClass.STANDARD5_AMD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m5a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_XLARGE8
   */
  public static readonly M5A_XLARGE8 = InstanceType.of(InstanceClass.M5A, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m5a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M5A_XLARGE8
   */
  public static readonly STANDARD5_AMD_XLARGE8 = InstanceType.of(InstanceClass.STANDARD5_AMD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m5a.large`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_LARGE
   */
  public static readonly M5A_LARGE = InstanceType.of(InstanceClass.M5A, InstanceSize.LARGE);

  /**
   * **Instance type**: `m5a.large`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M5A_LARGE
   */
  public static readonly STANDARD5_AMD_LARGE = InstanceType.of(InstanceClass.STANDARD5_AMD, InstanceSize.LARGE);

  /**
   * **Instance type**: `m5a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_XLARGE
   */
  public static readonly M5A_XLARGE = InstanceType.of(InstanceClass.M5A, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m5a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5A} Standard instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M5A_XLARGE
   */
  public static readonly STANDARD5_AMD_XLARGE = InstanceType.of(InstanceClass.STANDARD5_AMD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m5ad.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_NVME_DRIVE_XLARGE12
   */
  public static readonly M5AD_XLARGE12 = InstanceType.of(InstanceClass.M5AD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m5ad.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M5AD_XLARGE12
   */
  public static readonly STANDARD5_AMD_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.STANDARD5_AMD_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m5ad.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_NVME_DRIVE_XLARGE16
   */
  public static readonly M5AD_XLARGE16 = InstanceType.of(InstanceClass.M5AD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m5ad.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M5AD_XLARGE16
   */
  public static readonly STANDARD5_AMD_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.STANDARD5_AMD_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m5ad.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_NVME_DRIVE_XLARGE24
   */
  public static readonly M5AD_XLARGE24 = InstanceType.of(InstanceClass.M5AD, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m5ad.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.M5AD_XLARGE24
   */
  public static readonly STANDARD5_AMD_NVME_DRIVE_XLARGE24 = InstanceType.of(InstanceClass.STANDARD5_AMD_NVME_DRIVE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m5ad.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_NVME_DRIVE_XLARGE2
   */
  public static readonly M5AD_XLARGE2 = InstanceType.of(InstanceClass.M5AD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m5ad.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M5AD_XLARGE2
   */
  public static readonly STANDARD5_AMD_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.STANDARD5_AMD_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m5ad.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_NVME_DRIVE_XLARGE4
   */
  public static readonly M5AD_XLARGE4 = InstanceType.of(InstanceClass.M5AD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m5ad.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M5AD_XLARGE4
   */
  public static readonly STANDARD5_AMD_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.STANDARD5_AMD_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m5ad.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_NVME_DRIVE_XLARGE8
   */
  public static readonly M5AD_XLARGE8 = InstanceType.of(InstanceClass.M5AD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m5ad.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M5AD_XLARGE8
   */
  public static readonly STANDARD5_AMD_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.STANDARD5_AMD_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m5ad.large`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_NVME_DRIVE_LARGE
   */
  public static readonly M5AD_LARGE = InstanceType.of(InstanceClass.M5AD, InstanceSize.LARGE);

  /**
   * **Instance type**: `m5ad.large`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M5AD_LARGE
   */
  public static readonly STANDARD5_AMD_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.STANDARD5_AMD_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `m5ad.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD5_AMD_NVME_DRIVE_XLARGE
   */
  public static readonly M5AD_XLARGE = InstanceType.of(InstanceClass.M5AD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m5ad.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5AD} Standard instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M5AD_XLARGE
   */
  public static readonly STANDARD5_AMD_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.STANDARD5_AMD_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m5d.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_XLARGE12
   */
  public static readonly M5D_XLARGE12 = InstanceType.of(InstanceClass.M5D, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m5d.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M5D_XLARGE12
   */
  public static readonly STANDARD5_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m5d.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_XLARGE16
   */
  public static readonly M5D_XLARGE16 = InstanceType.of(InstanceClass.M5D, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m5d.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M5D_XLARGE16
   */
  public static readonly STANDARD5_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m5d.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_XLARGE24
   */
  public static readonly M5D_XLARGE24 = InstanceType.of(InstanceClass.M5D, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m5d.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.M5D_XLARGE24
   */
  public static readonly STANDARD5_NVME_DRIVE_XLARGE24 = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m5d.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_XLARGE2
   */
  public static readonly M5D_XLARGE2 = InstanceType.of(InstanceClass.M5D, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m5d.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M5D_XLARGE2
   */
  public static readonly STANDARD5_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m5d.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_XLARGE4
   */
  public static readonly M5D_XLARGE4 = InstanceType.of(InstanceClass.M5D, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m5d.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M5D_XLARGE4
   */
  public static readonly STANDARD5_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m5d.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_XLARGE8
   */
  public static readonly M5D_XLARGE8 = InstanceType.of(InstanceClass.M5D, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m5d.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M5D_XLARGE8
   */
  public static readonly STANDARD5_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m5d.large`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_LARGE
   */
  public static readonly M5D_LARGE = InstanceType.of(InstanceClass.M5D, InstanceSize.LARGE);

  /**
   * **Instance type**: `m5d.large`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M5D_LARGE
   */
  public static readonly STANDARD5_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `m5d.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_METAL
   */
  public static readonly M5D_METAL = InstanceType.of(InstanceClass.M5D, InstanceSize.METAL);

  /**
   * **Instance type**: `m5d.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.M5D_METAL
   */
  public static readonly STANDARD5_NVME_DRIVE_METAL = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE, InstanceSize.METAL);

  /**
   * **Instance type**: `m5d.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_XLARGE
   */
  public static readonly M5D_XLARGE = InstanceType.of(InstanceClass.M5D, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m5d.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5D} Standard instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M5D_XLARGE
   */
  public static readonly STANDARD5_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m5dn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE12
   */
  public static readonly M5DN_XLARGE12 = InstanceType.of(InstanceClass.M5DN, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m5dn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M5DN_XLARGE12
   */
  public static readonly STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE12 = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m5dn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE16
   */
  public static readonly M5DN_XLARGE16 = InstanceType.of(InstanceClass.M5DN, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m5dn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M5DN_XLARGE16
   */
  public static readonly STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE16 = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m5dn.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE24
   */
  public static readonly M5DN_XLARGE24 = InstanceType.of(InstanceClass.M5DN, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m5dn.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.M5DN_XLARGE24
   */
  public static readonly STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE24 = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m5dn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE2
   */
  public static readonly M5DN_XLARGE2 = InstanceType.of(InstanceClass.M5DN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m5dn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M5DN_XLARGE2
   */
  public static readonly STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE2 = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m5dn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE4
   */
  public static readonly M5DN_XLARGE4 = InstanceType.of(InstanceClass.M5DN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m5dn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M5DN_XLARGE4
   */
  public static readonly STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE4 = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m5dn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE8
   */
  public static readonly M5DN_XLARGE8 = InstanceType.of(InstanceClass.M5DN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m5dn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M5DN_XLARGE8
   */
  public static readonly STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE8 = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m5dn.large`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_LARGE
   */
  public static readonly M5DN_LARGE = InstanceType.of(InstanceClass.M5DN, InstanceSize.LARGE);

  /**
   * **Instance type**: `m5dn.large`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M5DN_LARGE
   */
  public static readonly STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_LARGE = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.LARGE);

  /**
   * **Instance type**: `m5dn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_METAL
   */
  public static readonly M5DN_METAL = InstanceType.of(InstanceClass.M5DN, InstanceSize.METAL);

  /**
   * **Instance type**: `m5dn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.M5DN_METAL
   */
  public static readonly STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_METAL = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.METAL);

  /**
   * **Instance type**: `m5dn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE
   */
  public static readonly M5DN_XLARGE = InstanceType.of(InstanceClass.M5DN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m5dn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5DN} Standard instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M5DN_XLARGE
   */
  public static readonly STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE = InstanceType.of(InstanceClass.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m5n.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_PERFORMANCE_XLARGE12
   */
  public static readonly M5N_XLARGE12 = InstanceType.of(InstanceClass.M5N, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m5n.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M5N_XLARGE12
   */
  public static readonly STANDARD5_HIGH_PERFORMANCE_XLARGE12 = InstanceType.of(InstanceClass.STANDARD5_HIGH_PERFORMANCE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m5n.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_PERFORMANCE_XLARGE16
   */
  public static readonly M5N_XLARGE16 = InstanceType.of(InstanceClass.M5N, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m5n.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M5N_XLARGE16
   */
  public static readonly STANDARD5_HIGH_PERFORMANCE_XLARGE16 = InstanceType.of(InstanceClass.STANDARD5_HIGH_PERFORMANCE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m5n.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_PERFORMANCE_XLARGE24
   */
  public static readonly M5N_XLARGE24 = InstanceType.of(InstanceClass.M5N, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m5n.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.M5N_XLARGE24
   */
  public static readonly STANDARD5_HIGH_PERFORMANCE_XLARGE24 = InstanceType.of(InstanceClass.STANDARD5_HIGH_PERFORMANCE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m5n.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_PERFORMANCE_XLARGE2
   */
  public static readonly M5N_XLARGE2 = InstanceType.of(InstanceClass.M5N, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m5n.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M5N_XLARGE2
   */
  public static readonly STANDARD5_HIGH_PERFORMANCE_XLARGE2 = InstanceType.of(InstanceClass.STANDARD5_HIGH_PERFORMANCE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m5n.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_PERFORMANCE_XLARGE4
   */
  public static readonly M5N_XLARGE4 = InstanceType.of(InstanceClass.M5N, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m5n.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M5N_XLARGE4
   */
  public static readonly STANDARD5_HIGH_PERFORMANCE_XLARGE4 = InstanceType.of(InstanceClass.STANDARD5_HIGH_PERFORMANCE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m5n.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_PERFORMANCE_XLARGE8
   */
  public static readonly M5N_XLARGE8 = InstanceType.of(InstanceClass.M5N, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m5n.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M5N_XLARGE8
   */
  public static readonly STANDARD5_HIGH_PERFORMANCE_XLARGE8 = InstanceType.of(InstanceClass.STANDARD5_HIGH_PERFORMANCE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m5n.large`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_PERFORMANCE_LARGE
   */
  public static readonly M5N_LARGE = InstanceType.of(InstanceClass.M5N, InstanceSize.LARGE);

  /**
   * **Instance type**: `m5n.large`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M5N_LARGE
   */
  public static readonly STANDARD5_HIGH_PERFORMANCE_LARGE = InstanceType.of(InstanceClass.STANDARD5_HIGH_PERFORMANCE, InstanceSize.LARGE);

  /**
   * **Instance type**: `m5n.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_PERFORMANCE_METAL
   */
  public static readonly M5N_METAL = InstanceType.of(InstanceClass.M5N, InstanceSize.METAL);

  /**
   * **Instance type**: `m5n.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.M5N_METAL
   */
  public static readonly STANDARD5_HIGH_PERFORMANCE_METAL = InstanceType.of(InstanceClass.STANDARD5_HIGH_PERFORMANCE, InstanceSize.METAL);

  /**
   * **Instance type**: `m5n.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_PERFORMANCE_XLARGE
   */
  public static readonly M5N_XLARGE = InstanceType.of(InstanceClass.M5N, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m5n.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5N} Standard instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M5N_XLARGE
   */
  public static readonly STANDARD5_HIGH_PERFORMANCE_XLARGE = InstanceType.of(InstanceClass.STANDARD5_HIGH_PERFORMANCE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m5zn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5ZN} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_COMPUTE_XLARGE12
   */
  public static readonly M5ZN_XLARGE12 = InstanceType.of(InstanceClass.M5ZN, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m5zn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5ZN} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M5ZN_XLARGE12
   */
  public static readonly STANDARD5_HIGH_COMPUTE_XLARGE12 = InstanceType.of(InstanceClass.STANDARD5_HIGH_COMPUTE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m5zn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5ZN} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_COMPUTE_XLARGE2
   */
  public static readonly M5ZN_XLARGE2 = InstanceType.of(InstanceClass.M5ZN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m5zn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5ZN} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M5ZN_XLARGE2
   */
  public static readonly STANDARD5_HIGH_COMPUTE_XLARGE2 = InstanceType.of(InstanceClass.STANDARD5_HIGH_COMPUTE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m5zn.3xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5ZN} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE3}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_COMPUTE_XLARGE3
   */
  public static readonly M5ZN_XLARGE3 = InstanceType.of(InstanceClass.M5ZN, InstanceSize.XLARGE3);

  /**
   * **Instance type**: `m5zn.3xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5ZN} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE3}
   *
   * @alias NamedInstanceType.M5ZN_XLARGE3
   */
  public static readonly STANDARD5_HIGH_COMPUTE_XLARGE3 = InstanceType.of(InstanceClass.STANDARD5_HIGH_COMPUTE, InstanceSize.XLARGE3);

  /**
   * **Instance type**: `m5zn.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5ZN} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_COMPUTE_XLARGE6
   */
  public static readonly M5ZN_XLARGE6 = InstanceType.of(InstanceClass.M5ZN, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `m5zn.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5ZN} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.M5ZN_XLARGE6
   */
  public static readonly STANDARD5_HIGH_COMPUTE_XLARGE6 = InstanceType.of(InstanceClass.STANDARD5_HIGH_COMPUTE, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `m5zn.large`:
   *
   * * **Instance class**: {@link InstanceClass.M5ZN} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_COMPUTE_LARGE
   */
  public static readonly M5ZN_LARGE = InstanceType.of(InstanceClass.M5ZN, InstanceSize.LARGE);

  /**
   * **Instance type**: `m5zn.large`:
   *
   * * **Instance class**: {@link InstanceClass.M5ZN} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M5ZN_LARGE
   */
  public static readonly STANDARD5_HIGH_COMPUTE_LARGE = InstanceType.of(InstanceClass.STANDARD5_HIGH_COMPUTE, InstanceSize.LARGE);

  /**
   * **Instance type**: `m5zn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M5ZN} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_COMPUTE_METAL
   */
  public static readonly M5ZN_METAL = InstanceType.of(InstanceClass.M5ZN, InstanceSize.METAL);

  /**
   * **Instance type**: `m5zn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M5ZN} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.M5ZN_METAL
   */
  public static readonly STANDARD5_HIGH_COMPUTE_METAL = InstanceType.of(InstanceClass.STANDARD5_HIGH_COMPUTE, InstanceSize.METAL);

  /**
   * **Instance type**: `m5zn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5ZN} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD5_HIGH_COMPUTE_XLARGE
   */
  public static readonly M5ZN_XLARGE = InstanceType.of(InstanceClass.M5ZN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m5zn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M5ZN} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M5ZN_XLARGE
   */
  public static readonly STANDARD5_HIGH_COMPUTE_XLARGE = InstanceType.of(InstanceClass.STANDARD5_HIGH_COMPUTE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m6a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD6_AMD_XLARGE12
   */
  public static readonly M6A_XLARGE12 = InstanceType.of(InstanceClass.M6A, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m6a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M6A_XLARGE12
   */
  public static readonly STANDARD6_AMD_XLARGE12 = InstanceType.of(InstanceClass.STANDARD6_AMD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m6a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD6_AMD_XLARGE16
   */
  public static readonly M6A_XLARGE16 = InstanceType.of(InstanceClass.M6A, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m6a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M6A_XLARGE16
   */
  public static readonly STANDARD6_AMD_XLARGE16 = InstanceType.of(InstanceClass.STANDARD6_AMD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m6a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STANDARD6_AMD_XLARGE24
   */
  public static readonly M6A_XLARGE24 = InstanceType.of(InstanceClass.M6A, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m6a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.M6A_XLARGE24
   */
  public static readonly STANDARD6_AMD_XLARGE24 = InstanceType.of(InstanceClass.STANDARD6_AMD, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m6a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD6_AMD_XLARGE2
   */
  public static readonly M6A_XLARGE2 = InstanceType.of(InstanceClass.M6A, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m6a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M6A_XLARGE2
   */
  public static readonly STANDARD6_AMD_XLARGE2 = InstanceType.of(InstanceClass.STANDARD6_AMD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m6a.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.STANDARD6_AMD_XLARGE32
   */
  public static readonly M6A_XLARGE32 = InstanceType.of(InstanceClass.M6A, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `m6a.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.M6A_XLARGE32
   */
  public static readonly STANDARD6_AMD_XLARGE32 = InstanceType.of(InstanceClass.STANDARD6_AMD, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `m6a.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.STANDARD6_AMD_XLARGE48
   */
  public static readonly M6A_XLARGE48 = InstanceType.of(InstanceClass.M6A, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `m6a.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.M6A_XLARGE48
   */
  public static readonly STANDARD6_AMD_XLARGE48 = InstanceType.of(InstanceClass.STANDARD6_AMD, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `m6a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD6_AMD_XLARGE4
   */
  public static readonly M6A_XLARGE4 = InstanceType.of(InstanceClass.M6A, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m6a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M6A_XLARGE4
   */
  public static readonly STANDARD6_AMD_XLARGE4 = InstanceType.of(InstanceClass.STANDARD6_AMD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m6a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD6_AMD_XLARGE8
   */
  public static readonly M6A_XLARGE8 = InstanceType.of(InstanceClass.M6A, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m6a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M6A_XLARGE8
   */
  public static readonly STANDARD6_AMD_XLARGE8 = InstanceType.of(InstanceClass.STANDARD6_AMD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m6a.large`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD6_AMD_LARGE
   */
  public static readonly M6A_LARGE = InstanceType.of(InstanceClass.M6A, InstanceSize.LARGE);

  /**
   * **Instance type**: `m6a.large`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M6A_LARGE
   */
  public static readonly STANDARD6_AMD_LARGE = InstanceType.of(InstanceClass.STANDARD6_AMD, InstanceSize.LARGE);

  /**
   * **Instance type**: `m6a.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.STANDARD6_AMD_METAL
   */
  public static readonly M6A_METAL = InstanceType.of(InstanceClass.M6A, InstanceSize.METAL);

  /**
   * **Instance type**: `m6a.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.M6A_METAL
   */
  public static readonly STANDARD6_AMD_METAL = InstanceType.of(InstanceClass.STANDARD6_AMD, InstanceSize.METAL);

  /**
   * **Instance type**: `m6a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD6_AMD_XLARGE
   */
  public static readonly M6A_XLARGE = InstanceType.of(InstanceClass.M6A, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m6a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6A} Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M6A_XLARGE
   */
  public static readonly STANDARD6_AMD_XLARGE = InstanceType.of(InstanceClass.STANDARD6_AMD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m6g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON_XLARGE12
   */
  public static readonly M6G_XLARGE12 = InstanceType.of(InstanceClass.M6G, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m6g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M6G_XLARGE12
   */
  public static readonly STANDARD6_GRAVITON_XLARGE12 = InstanceType.of(InstanceClass.STANDARD6_GRAVITON, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m6g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON_XLARGE16
   */
  public static readonly M6G_XLARGE16 = InstanceType.of(InstanceClass.M6G, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m6g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M6G_XLARGE16
   */
  public static readonly STANDARD6_GRAVITON_XLARGE16 = InstanceType.of(InstanceClass.STANDARD6_GRAVITON, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m6g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON_XLARGE2
   */
  public static readonly M6G_XLARGE2 = InstanceType.of(InstanceClass.M6G, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m6g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M6G_XLARGE2
   */
  public static readonly STANDARD6_GRAVITON_XLARGE2 = InstanceType.of(InstanceClass.STANDARD6_GRAVITON, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m6g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON_XLARGE4
   */
  public static readonly M6G_XLARGE4 = InstanceType.of(InstanceClass.M6G, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m6g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M6G_XLARGE4
   */
  public static readonly STANDARD6_GRAVITON_XLARGE4 = InstanceType.of(InstanceClass.STANDARD6_GRAVITON, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m6g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON_XLARGE8
   */
  public static readonly M6G_XLARGE8 = InstanceType.of(InstanceClass.M6G, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m6g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M6G_XLARGE8
   */
  public static readonly STANDARD6_GRAVITON_XLARGE8 = InstanceType.of(InstanceClass.STANDARD6_GRAVITON, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m6g.large`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON_LARGE
   */
  public static readonly M6G_LARGE = InstanceType.of(InstanceClass.M6G, InstanceSize.LARGE);

  /**
   * **Instance type**: `m6g.large`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M6G_LARGE
   */
  public static readonly STANDARD6_GRAVITON_LARGE = InstanceType.of(InstanceClass.STANDARD6_GRAVITON, InstanceSize.LARGE);

  /**
   * **Instance type**: `m6g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON_MEDIUM
   */
  public static readonly M6G_MEDIUM = InstanceType.of(InstanceClass.M6G, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `m6g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.M6G_MEDIUM
   */
  public static readonly STANDARD6_GRAVITON_MEDIUM = InstanceType.of(InstanceClass.STANDARD6_GRAVITON, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `m6g.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON_METAL
   */
  public static readonly M6G_METAL = InstanceType.of(InstanceClass.M6G, InstanceSize.METAL);

  /**
   * **Instance type**: `m6g.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.M6G_METAL
   */
  public static readonly STANDARD6_GRAVITON_METAL = InstanceType.of(InstanceClass.STANDARD6_GRAVITON, InstanceSize.METAL);

  /**
   * **Instance type**: `m6g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON_XLARGE
   */
  public static readonly M6G_XLARGE = InstanceType.of(InstanceClass.M6G, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m6g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6G} Arm processor based instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M6G_XLARGE
   */
  public static readonly STANDARD6_GRAVITON_XLARGE = InstanceType.of(InstanceClass.STANDARD6_GRAVITON, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m6gd.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON2_NVME_DRIVE_XLARGE12
   */
  public static readonly M6GD_XLARGE12 = InstanceType.of(InstanceClass.M6GD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m6gd.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M6GD_XLARGE12
   */
  public static readonly STANDARD6_GRAVITON2_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.STANDARD6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m6gd.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON2_NVME_DRIVE_XLARGE16
   */
  public static readonly M6GD_XLARGE16 = InstanceType.of(InstanceClass.M6GD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m6gd.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M6GD_XLARGE16
   */
  public static readonly STANDARD6_GRAVITON2_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.STANDARD6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m6gd.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON2_NVME_DRIVE_XLARGE2
   */
  public static readonly M6GD_XLARGE2 = InstanceType.of(InstanceClass.M6GD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m6gd.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M6GD_XLARGE2
   */
  public static readonly STANDARD6_GRAVITON2_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.STANDARD6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m6gd.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON2_NVME_DRIVE_XLARGE4
   */
  public static readonly M6GD_XLARGE4 = InstanceType.of(InstanceClass.M6GD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m6gd.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M6GD_XLARGE4
   */
  public static readonly STANDARD6_GRAVITON2_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.STANDARD6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m6gd.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON2_NVME_DRIVE_XLARGE8
   */
  public static readonly M6GD_XLARGE8 = InstanceType.of(InstanceClass.M6GD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m6gd.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M6GD_XLARGE8
   */
  public static readonly STANDARD6_GRAVITON2_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.STANDARD6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m6gd.large`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON2_NVME_DRIVE_LARGE
   */
  public static readonly M6GD_LARGE = InstanceType.of(InstanceClass.M6GD, InstanceSize.LARGE);

  /**
   * **Instance type**: `m6gd.large`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M6GD_LARGE
   */
  public static readonly STANDARD6_GRAVITON2_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.STANDARD6_GRAVITON2_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `m6gd.medium`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON2_NVME_DRIVE_MEDIUM
   */
  public static readonly M6GD_MEDIUM = InstanceType.of(InstanceClass.M6GD, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `m6gd.medium`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.M6GD_MEDIUM
   */
  public static readonly STANDARD6_GRAVITON2_NVME_DRIVE_MEDIUM = InstanceType.of(InstanceClass.STANDARD6_GRAVITON2_NVME_DRIVE, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `m6gd.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON2_NVME_DRIVE_METAL
   */
  public static readonly M6GD_METAL = InstanceType.of(InstanceClass.M6GD, InstanceSize.METAL);

  /**
   * **Instance type**: `m6gd.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.M6GD_METAL
   */
  public static readonly STANDARD6_GRAVITON2_NVME_DRIVE_METAL = InstanceType.of(InstanceClass.STANDARD6_GRAVITON2_NVME_DRIVE, InstanceSize.METAL);

  /**
   * **Instance type**: `m6gd.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD6_GRAVITON2_NVME_DRIVE_XLARGE
   */
  public static readonly M6GD_XLARGE = InstanceType.of(InstanceClass.M6GD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m6gd.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6GD} Standard instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M6GD_XLARGE
   */
  public static readonly STANDARD6_GRAVITON2_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.STANDARD6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m6i.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_XLARGE12
   */
  public static readonly M6I_XLARGE12 = InstanceType.of(InstanceClass.M6I, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m6i.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M6I_XLARGE12
   */
  public static readonly STANDARD6_INTEL_XLARGE12 = InstanceType.of(InstanceClass.STANDARD6_INTEL, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m6i.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_XLARGE16
   */
  public static readonly M6I_XLARGE16 = InstanceType.of(InstanceClass.M6I, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m6i.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M6I_XLARGE16
   */
  public static readonly STANDARD6_INTEL_XLARGE16 = InstanceType.of(InstanceClass.STANDARD6_INTEL, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m6i.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_XLARGE24
   */
  public static readonly M6I_XLARGE24 = InstanceType.of(InstanceClass.M6I, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m6i.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.M6I_XLARGE24
   */
  public static readonly STANDARD6_INTEL_XLARGE24 = InstanceType.of(InstanceClass.STANDARD6_INTEL, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m6i.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_XLARGE2
   */
  public static readonly M6I_XLARGE2 = InstanceType.of(InstanceClass.M6I, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m6i.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M6I_XLARGE2
   */
  public static readonly STANDARD6_INTEL_XLARGE2 = InstanceType.of(InstanceClass.STANDARD6_INTEL, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m6i.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_XLARGE32
   */
  public static readonly M6I_XLARGE32 = InstanceType.of(InstanceClass.M6I, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `m6i.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.M6I_XLARGE32
   */
  public static readonly STANDARD6_INTEL_XLARGE32 = InstanceType.of(InstanceClass.STANDARD6_INTEL, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `m6i.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_XLARGE4
   */
  public static readonly M6I_XLARGE4 = InstanceType.of(InstanceClass.M6I, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m6i.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M6I_XLARGE4
   */
  public static readonly STANDARD6_INTEL_XLARGE4 = InstanceType.of(InstanceClass.STANDARD6_INTEL, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m6i.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_XLARGE8
   */
  public static readonly M6I_XLARGE8 = InstanceType.of(InstanceClass.M6I, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m6i.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M6I_XLARGE8
   */
  public static readonly STANDARD6_INTEL_XLARGE8 = InstanceType.of(InstanceClass.STANDARD6_INTEL, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m6i.large`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_LARGE
   */
  public static readonly M6I_LARGE = InstanceType.of(InstanceClass.M6I, InstanceSize.LARGE);

  /**
   * **Instance type**: `m6i.large`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M6I_LARGE
   */
  public static readonly STANDARD6_INTEL_LARGE = InstanceType.of(InstanceClass.STANDARD6_INTEL, InstanceSize.LARGE);

  /**
   * **Instance type**: `m6i.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_METAL
   */
  public static readonly M6I_METAL = InstanceType.of(InstanceClass.M6I, InstanceSize.METAL);

  /**
   * **Instance type**: `m6i.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.M6I_METAL
   */
  public static readonly STANDARD6_INTEL_METAL = InstanceType.of(InstanceClass.STANDARD6_INTEL, InstanceSize.METAL);

  /**
   * **Instance type**: `m6i.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_XLARGE
   */
  public static readonly M6I_XLARGE = InstanceType.of(InstanceClass.M6I, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m6i.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6I} Standard instances based on Intel (Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M6I_XLARGE
   */
  public static readonly STANDARD6_INTEL_XLARGE = InstanceType.of(InstanceClass.STANDARD6_INTEL, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m6id.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_XLARGE12
   */
  public static readonly M6ID_XLARGE12 = InstanceType.of(InstanceClass.M6ID, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m6id.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M6ID_XLARGE12
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m6id.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_XLARGE16
   */
  public static readonly M6ID_XLARGE16 = InstanceType.of(InstanceClass.M6ID, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m6id.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M6ID_XLARGE16
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m6id.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_XLARGE24
   */
  public static readonly M6ID_XLARGE24 = InstanceType.of(InstanceClass.M6ID, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m6id.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.M6ID_XLARGE24
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_XLARGE24 = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m6id.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_XLARGE2
   */
  public static readonly M6ID_XLARGE2 = InstanceType.of(InstanceClass.M6ID, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m6id.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M6ID_XLARGE2
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m6id.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_XLARGE32
   */
  public static readonly M6ID_XLARGE32 = InstanceType.of(InstanceClass.M6ID, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `m6id.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.M6ID_XLARGE32
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_XLARGE32 = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `m6id.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_XLARGE4
   */
  public static readonly M6ID_XLARGE4 = InstanceType.of(InstanceClass.M6ID, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m6id.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M6ID_XLARGE4
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m6id.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_XLARGE8
   */
  public static readonly M6ID_XLARGE8 = InstanceType.of(InstanceClass.M6ID, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m6id.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M6ID_XLARGE8
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m6id.large`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_LARGE
   */
  public static readonly M6ID_LARGE = InstanceType.of(InstanceClass.M6ID, InstanceSize.LARGE);

  /**
   * **Instance type**: `m6id.large`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M6ID_LARGE
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `m6id.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_METAL
   */
  public static readonly M6ID_METAL = InstanceType.of(InstanceClass.M6ID, InstanceSize.METAL);

  /**
   * **Instance type**: `m6id.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.M6ID_METAL
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_METAL = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE, InstanceSize.METAL);

  /**
   * **Instance type**: `m6id.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_XLARGE
   */
  public static readonly M6ID_XLARGE = InstanceType.of(InstanceClass.M6ID, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m6id.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6ID} Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M6ID_XLARGE
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m6idn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE12
   */
  public static readonly M6IDN_XLARGE12 = InstanceType.of(InstanceClass.M6IDN, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m6idn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M6IDN_XLARGE12
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE12 = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m6idn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE16
   */
  public static readonly M6IDN_XLARGE16 = InstanceType.of(InstanceClass.M6IDN, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m6idn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M6IDN_XLARGE16
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE16 = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m6idn.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE24
   */
  public static readonly M6IDN_XLARGE24 = InstanceType.of(InstanceClass.M6IDN, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m6idn.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.M6IDN_XLARGE24
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE24 = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m6idn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE2
   */
  public static readonly M6IDN_XLARGE2 = InstanceType.of(InstanceClass.M6IDN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m6idn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M6IDN_XLARGE2
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE2 = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m6idn.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE32
   */
  public static readonly M6IDN_XLARGE32 = InstanceType.of(InstanceClass.M6IDN, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `m6idn.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.M6IDN_XLARGE32
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE32 = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `m6idn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE4
   */
  public static readonly M6IDN_XLARGE4 = InstanceType.of(InstanceClass.M6IDN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m6idn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M6IDN_XLARGE4
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE4 = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m6idn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE8
   */
  public static readonly M6IDN_XLARGE8 = InstanceType.of(InstanceClass.M6IDN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m6idn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M6IDN_XLARGE8
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE8 = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m6idn.large`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_LARGE
   */
  public static readonly M6IDN_LARGE = InstanceType.of(InstanceClass.M6IDN, InstanceSize.LARGE);

  /**
   * **Instance type**: `m6idn.large`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M6IDN_LARGE
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_LARGE = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.LARGE);

  /**
   * **Instance type**: `m6idn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_METAL
   */
  public static readonly M6IDN_METAL = InstanceType.of(InstanceClass.M6IDN, InstanceSize.METAL);

  /**
   * **Instance type**: `m6idn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.M6IDN_METAL
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_METAL = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.METAL);

  /**
   * **Instance type**: `m6idn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE
   */
  public static readonly M6IDN_XLARGE = InstanceType.of(InstanceClass.M6IDN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m6idn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IDN} Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M6IDN_XLARGE
   */
  public static readonly STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE = InstanceType.of(InstanceClass.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m6in.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE12
   */
  public static readonly M6IN_XLARGE12 = InstanceType.of(InstanceClass.M6IN, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m6in.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M6IN_XLARGE12
   */
  public static readonly STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE12 = InstanceType.of(InstanceClass.STANDARD6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m6in.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE16
   */
  public static readonly M6IN_XLARGE16 = InstanceType.of(InstanceClass.M6IN, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m6in.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M6IN_XLARGE16
   */
  public static readonly STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE16 = InstanceType.of(InstanceClass.STANDARD6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m6in.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE24
   */
  public static readonly M6IN_XLARGE24 = InstanceType.of(InstanceClass.M6IN, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m6in.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.M6IN_XLARGE24
   */
  public static readonly STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE24 = InstanceType.of(InstanceClass.STANDARD6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m6in.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE2
   */
  public static readonly M6IN_XLARGE2 = InstanceType.of(InstanceClass.M6IN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m6in.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M6IN_XLARGE2
   */
  public static readonly STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE2 = InstanceType.of(InstanceClass.STANDARD6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m6in.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE32
   */
  public static readonly M6IN_XLARGE32 = InstanceType.of(InstanceClass.M6IN, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `m6in.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.M6IN_XLARGE32
   */
  public static readonly STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE32 = InstanceType.of(InstanceClass.STANDARD6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `m6in.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE4
   */
  public static readonly M6IN_XLARGE4 = InstanceType.of(InstanceClass.M6IN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m6in.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M6IN_XLARGE4
   */
  public static readonly STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE4 = InstanceType.of(InstanceClass.STANDARD6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m6in.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE8
   */
  public static readonly M6IN_XLARGE8 = InstanceType.of(InstanceClass.M6IN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m6in.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M6IN_XLARGE8
   */
  public static readonly STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE8 = InstanceType.of(InstanceClass.STANDARD6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m6in.large`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_HIGH_PERFORMANCE_LARGE
   */
  public static readonly M6IN_LARGE = InstanceType.of(InstanceClass.M6IN, InstanceSize.LARGE);

  /**
   * **Instance type**: `m6in.large`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M6IN_LARGE
   */
  public static readonly STANDARD6_INTEL_HIGH_PERFORMANCE_LARGE = InstanceType.of(InstanceClass.STANDARD6_INTEL_HIGH_PERFORMANCE, InstanceSize.LARGE);

  /**
   * **Instance type**: `m6in.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_HIGH_PERFORMANCE_METAL
   */
  public static readonly M6IN_METAL = InstanceType.of(InstanceClass.M6IN, InstanceSize.METAL);

  /**
   * **Instance type**: `m6in.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.M6IN_METAL
   */
  public static readonly STANDARD6_INTEL_HIGH_PERFORMANCE_METAL = InstanceType.of(InstanceClass.STANDARD6_INTEL_HIGH_PERFORMANCE, InstanceSize.METAL);

  /**
   * **Instance type**: `m6in.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE
   */
  public static readonly M6IN_XLARGE = InstanceType.of(InstanceClass.M6IN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m6in.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M6IN} Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M6IN_XLARGE
   */
  public static readonly STANDARD6_INTEL_HIGH_PERFORMANCE_XLARGE = InstanceType.of(InstanceClass.STANDARD6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m7a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD7_AMD_XLARGE12
   */
  public static readonly M7A_XLARGE12 = InstanceType.of(InstanceClass.M7A, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m7a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M7A_XLARGE12
   */
  public static readonly STANDARD7_AMD_XLARGE12 = InstanceType.of(InstanceClass.STANDARD7_AMD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m7a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD7_AMD_XLARGE16
   */
  public static readonly M7A_XLARGE16 = InstanceType.of(InstanceClass.M7A, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m7a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M7A_XLARGE16
   */
  public static readonly STANDARD7_AMD_XLARGE16 = InstanceType.of(InstanceClass.STANDARD7_AMD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m7a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STANDARD7_AMD_XLARGE24
   */
  public static readonly M7A_XLARGE24 = InstanceType.of(InstanceClass.M7A, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m7a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.M7A_XLARGE24
   */
  public static readonly STANDARD7_AMD_XLARGE24 = InstanceType.of(InstanceClass.STANDARD7_AMD, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m7a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD7_AMD_XLARGE2
   */
  public static readonly M7A_XLARGE2 = InstanceType.of(InstanceClass.M7A, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m7a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M7A_XLARGE2
   */
  public static readonly STANDARD7_AMD_XLARGE2 = InstanceType.of(InstanceClass.STANDARD7_AMD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m7a.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.STANDARD7_AMD_XLARGE32
   */
  public static readonly M7A_XLARGE32 = InstanceType.of(InstanceClass.M7A, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `m7a.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.M7A_XLARGE32
   */
  public static readonly STANDARD7_AMD_XLARGE32 = InstanceType.of(InstanceClass.STANDARD7_AMD, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `m7a.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.STANDARD7_AMD_XLARGE48
   */
  public static readonly M7A_XLARGE48 = InstanceType.of(InstanceClass.M7A, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `m7a.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.M7A_XLARGE48
   */
  public static readonly STANDARD7_AMD_XLARGE48 = InstanceType.of(InstanceClass.STANDARD7_AMD, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `m7a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD7_AMD_XLARGE4
   */
  public static readonly M7A_XLARGE4 = InstanceType.of(InstanceClass.M7A, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m7a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M7A_XLARGE4
   */
  public static readonly STANDARD7_AMD_XLARGE4 = InstanceType.of(InstanceClass.STANDARD7_AMD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m7a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD7_AMD_XLARGE8
   */
  public static readonly M7A_XLARGE8 = InstanceType.of(InstanceClass.M7A, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m7a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M7A_XLARGE8
   */
  public static readonly STANDARD7_AMD_XLARGE8 = InstanceType.of(InstanceClass.STANDARD7_AMD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m7a.large`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD7_AMD_LARGE
   */
  public static readonly M7A_LARGE = InstanceType.of(InstanceClass.M7A, InstanceSize.LARGE);

  /**
   * **Instance type**: `m7a.large`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M7A_LARGE
   */
  public static readonly STANDARD7_AMD_LARGE = InstanceType.of(InstanceClass.STANDARD7_AMD, InstanceSize.LARGE);

  /**
   * **Instance type**: `m7a.medium`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.STANDARD7_AMD_MEDIUM
   */
  public static readonly M7A_MEDIUM = InstanceType.of(InstanceClass.M7A, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `m7a.medium`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.M7A_MEDIUM
   */
  public static readonly STANDARD7_AMD_MEDIUM = InstanceType.of(InstanceClass.STANDARD7_AMD, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `m7a.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.STANDARD7_AMD_XLARGE48METAL
   */
  public static readonly M7A_XLARGE48METAL = InstanceType.of(InstanceClass.M7A, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `m7a.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.M7A_XLARGE48METAL
   */
  public static readonly STANDARD7_AMD_XLARGE48METAL = InstanceType.of(InstanceClass.STANDARD7_AMD, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `m7a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD7_AMD_XLARGE
   */
  public static readonly M7A_XLARGE = InstanceType.of(InstanceClass.M7A, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m7a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7A} Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M7A_XLARGE
   */
  public static readonly STANDARD7_AMD_XLARGE = InstanceType.of(InstanceClass.STANDARD7_AMD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m7g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON_XLARGE12
   */
  public static readonly M7G_XLARGE12 = InstanceType.of(InstanceClass.M7G, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m7g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M7G_XLARGE12
   */
  public static readonly STANDARD7_GRAVITON_XLARGE12 = InstanceType.of(InstanceClass.STANDARD7_GRAVITON, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m7g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON_XLARGE16
   */
  public static readonly M7G_XLARGE16 = InstanceType.of(InstanceClass.M7G, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m7g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M7G_XLARGE16
   */
  public static readonly STANDARD7_GRAVITON_XLARGE16 = InstanceType.of(InstanceClass.STANDARD7_GRAVITON, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m7g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON_XLARGE2
   */
  public static readonly M7G_XLARGE2 = InstanceType.of(InstanceClass.M7G, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m7g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M7G_XLARGE2
   */
  public static readonly STANDARD7_GRAVITON_XLARGE2 = InstanceType.of(InstanceClass.STANDARD7_GRAVITON, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m7g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON_XLARGE4
   */
  public static readonly M7G_XLARGE4 = InstanceType.of(InstanceClass.M7G, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m7g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M7G_XLARGE4
   */
  public static readonly STANDARD7_GRAVITON_XLARGE4 = InstanceType.of(InstanceClass.STANDARD7_GRAVITON, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m7g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON_XLARGE8
   */
  public static readonly M7G_XLARGE8 = InstanceType.of(InstanceClass.M7G, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m7g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M7G_XLARGE8
   */
  public static readonly STANDARD7_GRAVITON_XLARGE8 = InstanceType.of(InstanceClass.STANDARD7_GRAVITON, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m7g.large`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON_LARGE
   */
  public static readonly M7G_LARGE = InstanceType.of(InstanceClass.M7G, InstanceSize.LARGE);

  /**
   * **Instance type**: `m7g.large`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M7G_LARGE
   */
  public static readonly STANDARD7_GRAVITON_LARGE = InstanceType.of(InstanceClass.STANDARD7_GRAVITON, InstanceSize.LARGE);

  /**
   * **Instance type**: `m7g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON_MEDIUM
   */
  public static readonly M7G_MEDIUM = InstanceType.of(InstanceClass.M7G, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `m7g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.M7G_MEDIUM
   */
  public static readonly STANDARD7_GRAVITON_MEDIUM = InstanceType.of(InstanceClass.STANDARD7_GRAVITON, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `m7g.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON_METAL
   */
  public static readonly M7G_METAL = InstanceType.of(InstanceClass.M7G, InstanceSize.METAL);

  /**
   * **Instance type**: `m7g.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.M7G_METAL
   */
  public static readonly STANDARD7_GRAVITON_METAL = InstanceType.of(InstanceClass.STANDARD7_GRAVITON, InstanceSize.METAL);

  /**
   * **Instance type**: `m7g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON_XLARGE
   */
  public static readonly M7G_XLARGE = InstanceType.of(InstanceClass.M7G, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m7g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7G} Standard instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M7G_XLARGE
   */
  public static readonly STANDARD7_GRAVITON_XLARGE = InstanceType.of(InstanceClass.STANDARD7_GRAVITON, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m7gd.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON3_NVME_DRIVE_XLARGE12
   */
  public static readonly M7GD_XLARGE12 = InstanceType.of(InstanceClass.M7GD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m7gd.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M7GD_XLARGE12
   */
  public static readonly STANDARD7_GRAVITON3_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.STANDARD7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m7gd.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON3_NVME_DRIVE_XLARGE16
   */
  public static readonly M7GD_XLARGE16 = InstanceType.of(InstanceClass.M7GD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m7gd.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M7GD_XLARGE16
   */
  public static readonly STANDARD7_GRAVITON3_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.STANDARD7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m7gd.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON3_NVME_DRIVE_XLARGE2
   */
  public static readonly M7GD_XLARGE2 = InstanceType.of(InstanceClass.M7GD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m7gd.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M7GD_XLARGE2
   */
  public static readonly STANDARD7_GRAVITON3_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.STANDARD7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m7gd.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON3_NVME_DRIVE_XLARGE4
   */
  public static readonly M7GD_XLARGE4 = InstanceType.of(InstanceClass.M7GD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m7gd.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M7GD_XLARGE4
   */
  public static readonly STANDARD7_GRAVITON3_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.STANDARD7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m7gd.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON3_NVME_DRIVE_XLARGE8
   */
  public static readonly M7GD_XLARGE8 = InstanceType.of(InstanceClass.M7GD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m7gd.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M7GD_XLARGE8
   */
  public static readonly STANDARD7_GRAVITON3_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.STANDARD7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m7gd.large`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON3_NVME_DRIVE_LARGE
   */
  public static readonly M7GD_LARGE = InstanceType.of(InstanceClass.M7GD, InstanceSize.LARGE);

  /**
   * **Instance type**: `m7gd.large`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M7GD_LARGE
   */
  public static readonly STANDARD7_GRAVITON3_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.STANDARD7_GRAVITON3_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `m7gd.medium`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON3_NVME_DRIVE_MEDIUM
   */
  public static readonly M7GD_MEDIUM = InstanceType.of(InstanceClass.M7GD, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `m7gd.medium`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.M7GD_MEDIUM
   */
  public static readonly STANDARD7_GRAVITON3_NVME_DRIVE_MEDIUM = InstanceType.of(InstanceClass.STANDARD7_GRAVITON3_NVME_DRIVE, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `m7gd.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON3_NVME_DRIVE_METAL
   */
  public static readonly M7GD_METAL = InstanceType.of(InstanceClass.M7GD, InstanceSize.METAL);

  /**
   * **Instance type**: `m7gd.metal`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.M7GD_METAL
   */
  public static readonly STANDARD7_GRAVITON3_NVME_DRIVE_METAL = InstanceType.of(InstanceClass.STANDARD7_GRAVITON3_NVME_DRIVE, InstanceSize.METAL);

  /**
   * **Instance type**: `m7gd.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD7_GRAVITON3_NVME_DRIVE_XLARGE
   */
  public static readonly M7GD_XLARGE = InstanceType.of(InstanceClass.M7GD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m7gd.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7GD} Standard instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M7GD_XLARGE
   */
  public static readonly STANDARD7_GRAVITON3_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.STANDARD7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m7i-flex.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I_FLEX} Flexible instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationThe M7i-Flex instances deliver a baseline of 40% CPU performance, and can scale up to full CPU performance 95% of the time
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_FLEX_XLARGE2
   */
  public static readonly M7I_FLEX_XLARGE2 = InstanceType.of(InstanceClass.M7I_FLEX, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m7i-flex.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I_FLEX} Flexible instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationThe M7i-Flex instances deliver a baseline of 40% CPU performance, and can scale up to full CPU performance 95% of the time
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M7I_FLEX_XLARGE2
   */
  public static readonly STANDARD7_INTEL_FLEX_XLARGE2 = InstanceType.of(InstanceClass.STANDARD7_INTEL_FLEX, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m7i-flex.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I_FLEX} Flexible instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationThe M7i-Flex instances deliver a baseline of 40% CPU performance, and can scale up to full CPU performance 95% of the time
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_FLEX_XLARGE4
   */
  public static readonly M7I_FLEX_XLARGE4 = InstanceType.of(InstanceClass.M7I_FLEX, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m7i-flex.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I_FLEX} Flexible instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationThe M7i-Flex instances deliver a baseline of 40% CPU performance, and can scale up to full CPU performance 95% of the time
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M7I_FLEX_XLARGE4
   */
  public static readonly STANDARD7_INTEL_FLEX_XLARGE4 = InstanceType.of(InstanceClass.STANDARD7_INTEL_FLEX, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m7i-flex.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I_FLEX} Flexible instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationThe M7i-Flex instances deliver a baseline of 40% CPU performance, and can scale up to full CPU performance 95% of the time
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_FLEX_XLARGE8
   */
  public static readonly M7I_FLEX_XLARGE8 = InstanceType.of(InstanceClass.M7I_FLEX, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m7i-flex.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I_FLEX} Flexible instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationThe M7i-Flex instances deliver a baseline of 40% CPU performance, and can scale up to full CPU performance 95% of the time
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M7I_FLEX_XLARGE8
   */
  public static readonly STANDARD7_INTEL_FLEX_XLARGE8 = InstanceType.of(InstanceClass.STANDARD7_INTEL_FLEX, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m7i-flex.large`:
   *
   * * **Instance class**: {@link InstanceClass.M7I_FLEX} Flexible instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationThe M7i-Flex instances deliver a baseline of 40% CPU performance, and can scale up to full CPU performance 95% of the time
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_FLEX_LARGE
   */
  public static readonly M7I_FLEX_LARGE = InstanceType.of(InstanceClass.M7I_FLEX, InstanceSize.LARGE);

  /**
   * **Instance type**: `m7i-flex.large`:
   *
   * * **Instance class**: {@link InstanceClass.M7I_FLEX} Flexible instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationThe M7i-Flex instances deliver a baseline of 40% CPU performance, and can scale up to full CPU performance 95% of the time
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M7I_FLEX_LARGE
   */
  public static readonly STANDARD7_INTEL_FLEX_LARGE = InstanceType.of(InstanceClass.STANDARD7_INTEL_FLEX, InstanceSize.LARGE);

  /**
   * **Instance type**: `m7i-flex.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I_FLEX} Flexible instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationThe M7i-Flex instances deliver a baseline of 40% CPU performance, and can scale up to full CPU performance 95% of the time
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_FLEX_XLARGE
   */
  public static readonly M7I_FLEX_XLARGE = InstanceType.of(InstanceClass.M7I_FLEX, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m7i-flex.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I_FLEX} Flexible instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generationThe M7i-Flex instances deliver a baseline of 40% CPU performance, and can scale up to full CPU performance 95% of the time
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M7I_FLEX_XLARGE
   */
  public static readonly STANDARD7_INTEL_FLEX_XLARGE = InstanceType.of(InstanceClass.STANDARD7_INTEL_FLEX, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m7i.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_XLARGE12
   */
  public static readonly M7I_XLARGE12 = InstanceType.of(InstanceClass.M7I, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m7i.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M7I_XLARGE12
   */
  public static readonly STANDARD7_INTEL_XLARGE12 = InstanceType.of(InstanceClass.STANDARD7_INTEL, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m7i.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_XLARGE16
   */
  public static readonly M7I_XLARGE16 = InstanceType.of(InstanceClass.M7I, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m7i.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M7I_XLARGE16
   */
  public static readonly STANDARD7_INTEL_XLARGE16 = InstanceType.of(InstanceClass.STANDARD7_INTEL, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m7i.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_XLARGE24
   */
  public static readonly M7I_XLARGE24 = InstanceType.of(InstanceClass.M7I, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m7i.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.M7I_XLARGE24
   */
  public static readonly STANDARD7_INTEL_XLARGE24 = InstanceType.of(InstanceClass.STANDARD7_INTEL, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m7i.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_XLARGE2
   */
  public static readonly M7I_XLARGE2 = InstanceType.of(InstanceClass.M7I, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m7i.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M7I_XLARGE2
   */
  public static readonly STANDARD7_INTEL_XLARGE2 = InstanceType.of(InstanceClass.STANDARD7_INTEL, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m7i.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_XLARGE48
   */
  public static readonly M7I_XLARGE48 = InstanceType.of(InstanceClass.M7I, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `m7i.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.M7I_XLARGE48
   */
  public static readonly STANDARD7_INTEL_XLARGE48 = InstanceType.of(InstanceClass.STANDARD7_INTEL, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `m7i.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_XLARGE4
   */
  public static readonly M7I_XLARGE4 = InstanceType.of(InstanceClass.M7I, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m7i.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M7I_XLARGE4
   */
  public static readonly STANDARD7_INTEL_XLARGE4 = InstanceType.of(InstanceClass.STANDARD7_INTEL, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m7i.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_XLARGE8
   */
  public static readonly M7I_XLARGE8 = InstanceType.of(InstanceClass.M7I, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m7i.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M7I_XLARGE8
   */
  public static readonly STANDARD7_INTEL_XLARGE8 = InstanceType.of(InstanceClass.STANDARD7_INTEL, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m7i.large`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_LARGE
   */
  public static readonly M7I_LARGE = InstanceType.of(InstanceClass.M7I, InstanceSize.LARGE);

  /**
   * **Instance type**: `m7i.large`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M7I_LARGE
   */
  public static readonly STANDARD7_INTEL_LARGE = InstanceType.of(InstanceClass.STANDARD7_INTEL, InstanceSize.LARGE);

  /**
   * **Instance type**: `m7i.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_XLARGE24METAL
   */
  public static readonly M7I_XLARGE24METAL = InstanceType.of(InstanceClass.M7I, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `m7i.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.M7I_XLARGE24METAL
   */
  public static readonly STANDARD7_INTEL_XLARGE24METAL = InstanceType.of(InstanceClass.STANDARD7_INTEL, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `m7i.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_XLARGE48METAL
   */
  public static readonly M7I_XLARGE48METAL = InstanceType.of(InstanceClass.M7I, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `m7i.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.M7I_XLARGE48METAL
   */
  public static readonly STANDARD7_INTEL_XLARGE48METAL = InstanceType.of(InstanceClass.STANDARD7_INTEL, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `m7i.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD7_INTEL_XLARGE
   */
  public static readonly M7I_XLARGE = InstanceType.of(InstanceClass.M7I, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m7i.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M7I} Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M7I_XLARGE
   */
  public static readonly STANDARD7_INTEL_XLARGE = InstanceType.of(InstanceClass.STANDARD7_INTEL, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m8g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.STANDARD8_GRAVITON_XLARGE12
   */
  public static readonly M8G_XLARGE12 = InstanceType.of(InstanceClass.M8G, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m8g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.M8G_XLARGE12
   */
  public static readonly STANDARD8_GRAVITON_XLARGE12 = InstanceType.of(InstanceClass.STANDARD8_GRAVITON, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `m8g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.STANDARD8_GRAVITON_XLARGE16
   */
  public static readonly M8G_XLARGE16 = InstanceType.of(InstanceClass.M8G, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m8g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.M8G_XLARGE16
   */
  public static readonly STANDARD8_GRAVITON_XLARGE16 = InstanceType.of(InstanceClass.STANDARD8_GRAVITON, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `m8g.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.STANDARD8_GRAVITON_XLARGE24
   */
  public static readonly M8G_XLARGE24 = InstanceType.of(InstanceClass.M8G, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m8g.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.M8G_XLARGE24
   */
  public static readonly STANDARD8_GRAVITON_XLARGE24 = InstanceType.of(InstanceClass.STANDARD8_GRAVITON, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `m8g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.STANDARD8_GRAVITON_XLARGE2
   */
  public static readonly M8G_XLARGE2 = InstanceType.of(InstanceClass.M8G, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m8g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.M8G_XLARGE2
   */
  public static readonly STANDARD8_GRAVITON_XLARGE2 = InstanceType.of(InstanceClass.STANDARD8_GRAVITON, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `m8g.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.STANDARD8_GRAVITON_XLARGE48
   */
  public static readonly M8G_XLARGE48 = InstanceType.of(InstanceClass.M8G, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `m8g.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.M8G_XLARGE48
   */
  public static readonly STANDARD8_GRAVITON_XLARGE48 = InstanceType.of(InstanceClass.STANDARD8_GRAVITON, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `m8g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.STANDARD8_GRAVITON_XLARGE4
   */
  public static readonly M8G_XLARGE4 = InstanceType.of(InstanceClass.M8G, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m8g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.M8G_XLARGE4
   */
  public static readonly STANDARD8_GRAVITON_XLARGE4 = InstanceType.of(InstanceClass.STANDARD8_GRAVITON, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `m8g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.STANDARD8_GRAVITON_XLARGE8
   */
  public static readonly M8G_XLARGE8 = InstanceType.of(InstanceClass.M8G, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m8g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.M8G_XLARGE8
   */
  public static readonly STANDARD8_GRAVITON_XLARGE8 = InstanceType.of(InstanceClass.STANDARD8_GRAVITON, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `m8g.large`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.STANDARD8_GRAVITON_LARGE
   */
  public static readonly M8G_LARGE = InstanceType.of(InstanceClass.M8G, InstanceSize.LARGE);

  /**
   * **Instance type**: `m8g.large`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.M8G_LARGE
   */
  public static readonly STANDARD8_GRAVITON_LARGE = InstanceType.of(InstanceClass.STANDARD8_GRAVITON, InstanceSize.LARGE);

  /**
   * **Instance type**: `m8g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.STANDARD8_GRAVITON_MEDIUM
   */
  public static readonly M8G_MEDIUM = InstanceType.of(InstanceClass.M8G, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `m8g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.M8G_MEDIUM
   */
  public static readonly STANDARD8_GRAVITON_MEDIUM = InstanceType.of(InstanceClass.STANDARD8_GRAVITON, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `m8g.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.STANDARD8_GRAVITON_XLARGE24METAL
   */
  public static readonly M8G_XLARGE24METAL = InstanceType.of(InstanceClass.M8G, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `m8g.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.M8G_XLARGE24METAL
   */
  public static readonly STANDARD8_GRAVITON_XLARGE24METAL = InstanceType.of(InstanceClass.STANDARD8_GRAVITON, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `m8g.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.STANDARD8_GRAVITON_XLARGE48METAL
   */
  public static readonly M8G_XLARGE48METAL = InstanceType.of(InstanceClass.M8G, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `m8g.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.M8G_XLARGE48METAL
   */
  public static readonly STANDARD8_GRAVITON_XLARGE48METAL = InstanceType.of(InstanceClass.STANDARD8_GRAVITON, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `m8g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.STANDARD8_GRAVITON_XLARGE
   */
  public static readonly M8G_XLARGE = InstanceType.of(InstanceClass.M8G, InstanceSize.XLARGE);

  /**
   * **Instance type**: `m8g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.M8G} Standard instances, 8th generation with Graviton4 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.M8G_XLARGE
   */
  public static readonly STANDARD8_GRAVITON_XLARGE = InstanceType.of(InstanceClass.STANDARD8_GRAVITON, InstanceSize.XLARGE);

  /**
   * **Instance type**: `mac1.metal`:
   *
   * * **Instance class**: {@link InstanceClass.MAC1} Macintosh instances built on Apple Mac mini computers, 1st generation with Intel procesors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MACINTOSH1_INTEL_METAL
   */
  public static readonly MAC1_METAL = InstanceType.of(InstanceClass.MAC1, InstanceSize.METAL);

  /**
   * **Instance type**: `mac1.metal`:
   *
   * * **Instance class**: {@link InstanceClass.MAC1} Macintosh instances built on Apple Mac mini computers, 1st generation with Intel procesors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MAC1_METAL
   */
  public static readonly MACINTOSH1_INTEL_METAL = InstanceType.of(InstanceClass.MACINTOSH1_INTEL, InstanceSize.METAL);

  /**
   * **Instance type**: `mac2-m1ultra.metal`:
   *
   * * **Instance class**: {@link InstanceClass.MAC2_M1ULTRA} Macintosh instances built on 2022 Mac Studio hardware powered by Apple silicon M1 Ultra processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MACINTOSH2_M1_ULTRA_METAL
   */
  public static readonly MAC2_M1ULTRA_METAL = InstanceType.of(InstanceClass.MAC2_M1ULTRA, InstanceSize.METAL);

  /**
   * **Instance type**: `mac2-m1ultra.metal`:
   *
   * * **Instance class**: {@link InstanceClass.MAC2_M1ULTRA} Macintosh instances built on 2022 Mac Studio hardware powered by Apple silicon M1 Ultra processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MAC2_M1ULTRA_METAL
   */
  public static readonly MACINTOSH2_M1_ULTRA_METAL = InstanceType.of(InstanceClass.MACINTOSH2_M1_ULTRA, InstanceSize.METAL);

  /**
   * **Instance type**: `mac2-m2.metal`:
   *
   * * **Instance class**: {@link InstanceClass.MAC2_M2} Macintosh instances built on Apple Mac mini 2023 computers, 2nd generation with Apple silicon M2 processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MACINTOSH2_M2_METAL
   */
  public static readonly MAC2_M2_METAL = InstanceType.of(InstanceClass.MAC2_M2, InstanceSize.METAL);

  /**
   * **Instance type**: `mac2-m2.metal`:
   *
   * * **Instance class**: {@link InstanceClass.MAC2_M2} Macintosh instances built on Apple Mac mini 2023 computers, 2nd generation with Apple silicon M2 processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MAC2_M2_METAL
   */
  public static readonly MACINTOSH2_M2_METAL = InstanceType.of(InstanceClass.MACINTOSH2_M2, InstanceSize.METAL);

  /**
   * **Instance type**: `mac2-m2pro.metal`:
   *
   * * **Instance class**: {@link InstanceClass.MAC2_M2PRO} Macintosh instances built on Apple Mac mini 2023 computers, 2nd generation with Apple silicon M2 Pro processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MACINTOSH2_M2_PRO_METAL
   */
  public static readonly MAC2_M2PRO_METAL = InstanceType.of(InstanceClass.MAC2_M2PRO, InstanceSize.METAL);

  /**
   * **Instance type**: `mac2-m2pro.metal`:
   *
   * * **Instance class**: {@link InstanceClass.MAC2_M2PRO} Macintosh instances built on Apple Mac mini 2023 computers, 2nd generation with Apple silicon M2 Pro processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MAC2_M2PRO_METAL
   */
  public static readonly MACINTOSH2_M2_PRO_METAL = InstanceType.of(InstanceClass.MACINTOSH2_M2_PRO, InstanceSize.METAL);

  /**
   * **Instance type**: `mac2.metal`:
   *
   * * **Instance class**: {@link InstanceClass.MAC2} Macintosh instances built on Apple Mac mini 2020 computers, 2nd generation with Apple silicon M1 processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MACINTOSH2_M1_METAL
   */
  public static readonly MAC2_METAL = InstanceType.of(InstanceClass.MAC2, InstanceSize.METAL);

  /**
   * **Instance type**: `mac2.metal`:
   *
   * * **Instance class**: {@link InstanceClass.MAC2} Macintosh instances built on Apple Mac mini 2020 computers, 2nd generation with Apple silicon M1 processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MAC2_METAL
   */
  public static readonly MACINTOSH2_M1_METAL = InstanceType.of(InstanceClass.MACINTOSH2_M1, InstanceSize.METAL);

  /**
   * **Instance type**: `p2.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P2} Parallel-processing optimized instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.PARALLEL2_XLARGE16
   */
  public static readonly P2_XLARGE16 = InstanceType.of(InstanceClass.P2, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `p2.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P2} Parallel-processing optimized instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.P2_XLARGE16
   */
  public static readonly PARALLEL2_XLARGE16 = InstanceType.of(InstanceClass.PARALLEL2, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `p2.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P2} Parallel-processing optimized instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.PARALLEL2_XLARGE8
   */
  public static readonly P2_XLARGE8 = InstanceType.of(InstanceClass.P2, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `p2.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P2} Parallel-processing optimized instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.P2_XLARGE8
   */
  public static readonly PARALLEL2_XLARGE8 = InstanceType.of(InstanceClass.PARALLEL2, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `p2.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P2} Parallel-processing optimized instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.PARALLEL2_XLARGE
   */
  public static readonly P2_XLARGE = InstanceType.of(InstanceClass.P2, InstanceSize.XLARGE);

  /**
   * **Instance type**: `p2.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P2} Parallel-processing optimized instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.P2_XLARGE
   */
  public static readonly PARALLEL2_XLARGE = InstanceType.of(InstanceClass.PARALLEL2, InstanceSize.XLARGE);

  /**
   * **Instance type**: `p3.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P3} Parallel-processing optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.PARALLEL3_XLARGE16
   */
  public static readonly P3_XLARGE16 = InstanceType.of(InstanceClass.P3, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `p3.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P3} Parallel-processing optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.P3_XLARGE16
   */
  public static readonly PARALLEL3_XLARGE16 = InstanceType.of(InstanceClass.PARALLEL3, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `p3.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P3} Parallel-processing optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.PARALLEL3_XLARGE2
   */
  public static readonly P3_XLARGE2 = InstanceType.of(InstanceClass.P3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `p3.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P3} Parallel-processing optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.P3_XLARGE2
   */
  public static readonly PARALLEL3_XLARGE2 = InstanceType.of(InstanceClass.PARALLEL3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `p3.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P3} Parallel-processing optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.PARALLEL3_XLARGE8
   */
  public static readonly P3_XLARGE8 = InstanceType.of(InstanceClass.P3, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `p3.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P3} Parallel-processing optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.P3_XLARGE8
   */
  public static readonly PARALLEL3_XLARGE8 = InstanceType.of(InstanceClass.PARALLEL3, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `p3dn.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P3DN} Parallel-processing optimized instances with local NVME drive for high performance computing, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.PARALLEL3_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE24
   */
  public static readonly P3DN_XLARGE24 = InstanceType.of(InstanceClass.P3DN, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `p3dn.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P3DN} Parallel-processing optimized instances with local NVME drive for high performance computing, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.P3DN_XLARGE24
   */
  public static readonly PARALLEL3_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE24 = InstanceType.of(InstanceClass.PARALLEL3_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `p4d.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P4D} Parallel-processing optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.PARALLEL4_XLARGE24
   */
  public static readonly P4D_XLARGE24 = InstanceType.of(InstanceClass.P4D, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `p4d.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P4D} Parallel-processing optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.P4D_XLARGE24
   */
  public static readonly PARALLEL4_XLARGE24 = InstanceType.of(InstanceClass.PARALLEL4, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `p5.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P5} Parallel-processing optimized instances powered by NVIDIA H100 Tensor Core GPUs, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.PARALLEL5_XLARGE48
   */
  public static readonly P5_XLARGE48 = InstanceType.of(InstanceClass.P5, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `p5.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.P5} Parallel-processing optimized instances powered by NVIDIA H100 Tensor Core GPUs, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.P5_XLARGE48
   */
  public static readonly PARALLEL5_XLARGE48 = InstanceType.of(InstanceClass.PARALLEL5, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `r3.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R3} Memory optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY3_XLARGE2
   */
  public static readonly R3_XLARGE2 = InstanceType.of(InstanceClass.R3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r3.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R3} Memory optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R3_XLARGE2
   */
  public static readonly MEMORY3_XLARGE2 = InstanceType.of(InstanceClass.MEMORY3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r3.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R3} Memory optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY3_XLARGE4
   */
  public static readonly R3_XLARGE4 = InstanceType.of(InstanceClass.R3, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r3.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R3} Memory optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R3_XLARGE4
   */
  public static readonly MEMORY3_XLARGE4 = InstanceType.of(InstanceClass.MEMORY3, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r3.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R3} Memory optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY3_XLARGE8
   */
  public static readonly R3_XLARGE8 = InstanceType.of(InstanceClass.R3, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r3.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R3} Memory optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R3_XLARGE8
   */
  public static readonly MEMORY3_XLARGE8 = InstanceType.of(InstanceClass.MEMORY3, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r3.large`:
   *
   * * **Instance class**: {@link InstanceClass.R3} Memory optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY3_LARGE
   */
  public static readonly R3_LARGE = InstanceType.of(InstanceClass.R3, InstanceSize.LARGE);

  /**
   * **Instance type**: `r3.large`:
   *
   * * **Instance class**: {@link InstanceClass.R3} Memory optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R3_LARGE
   */
  public static readonly MEMORY3_LARGE = InstanceType.of(InstanceClass.MEMORY3, InstanceSize.LARGE);

  /**
   * **Instance type**: `r3.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R3} Memory optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY3_XLARGE
   */
  public static readonly R3_XLARGE = InstanceType.of(InstanceClass.R3, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r3.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R3} Memory optimized instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R3_XLARGE
   */
  public static readonly MEMORY3_XLARGE = InstanceType.of(InstanceClass.MEMORY3, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r4.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R4} Memory optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY4_XLARGE16
   */
  public static readonly R4_XLARGE16 = InstanceType.of(InstanceClass.R4, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r4.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R4} Memory optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R4_XLARGE16
   */
  public static readonly MEMORY4_XLARGE16 = InstanceType.of(InstanceClass.MEMORY4, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r4.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R4} Memory optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY4_XLARGE2
   */
  public static readonly R4_XLARGE2 = InstanceType.of(InstanceClass.R4, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r4.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R4} Memory optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R4_XLARGE2
   */
  public static readonly MEMORY4_XLARGE2 = InstanceType.of(InstanceClass.MEMORY4, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r4.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R4} Memory optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY4_XLARGE4
   */
  public static readonly R4_XLARGE4 = InstanceType.of(InstanceClass.R4, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r4.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R4} Memory optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R4_XLARGE4
   */
  public static readonly MEMORY4_XLARGE4 = InstanceType.of(InstanceClass.MEMORY4, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r4.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R4} Memory optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY4_XLARGE8
   */
  public static readonly R4_XLARGE8 = InstanceType.of(InstanceClass.R4, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r4.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R4} Memory optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R4_XLARGE8
   */
  public static readonly MEMORY4_XLARGE8 = InstanceType.of(InstanceClass.MEMORY4, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r4.large`:
   *
   * * **Instance class**: {@link InstanceClass.R4} Memory optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY4_LARGE
   */
  public static readonly R4_LARGE = InstanceType.of(InstanceClass.R4, InstanceSize.LARGE);

  /**
   * **Instance type**: `r4.large`:
   *
   * * **Instance class**: {@link InstanceClass.R4} Memory optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R4_LARGE
   */
  public static readonly MEMORY4_LARGE = InstanceType.of(InstanceClass.MEMORY4, InstanceSize.LARGE);

  /**
   * **Instance type**: `r4.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R4} Memory optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY4_XLARGE
   */
  public static readonly R4_XLARGE = InstanceType.of(InstanceClass.R4, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r4.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R4} Memory optimized instances, 4th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R4_XLARGE
   */
  public static readonly MEMORY4_XLARGE = InstanceType.of(InstanceClass.MEMORY4, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r5.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY5_XLARGE12
   */
  public static readonly R5_XLARGE12 = InstanceType.of(InstanceClass.R5, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r5.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R5_XLARGE12
   */
  public static readonly MEMORY5_XLARGE12 = InstanceType.of(InstanceClass.MEMORY5, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r5.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY5_XLARGE16
   */
  public static readonly R5_XLARGE16 = InstanceType.of(InstanceClass.R5, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r5.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R5_XLARGE16
   */
  public static readonly MEMORY5_XLARGE16 = InstanceType.of(InstanceClass.MEMORY5, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r5.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY5_XLARGE24
   */
  public static readonly R5_XLARGE24 = InstanceType.of(InstanceClass.R5, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r5.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R5_XLARGE24
   */
  public static readonly MEMORY5_XLARGE24 = InstanceType.of(InstanceClass.MEMORY5, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r5.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY5_XLARGE2
   */
  public static readonly R5_XLARGE2 = InstanceType.of(InstanceClass.R5, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r5.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R5_XLARGE2
   */
  public static readonly MEMORY5_XLARGE2 = InstanceType.of(InstanceClass.MEMORY5, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r5.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY5_XLARGE4
   */
  public static readonly R5_XLARGE4 = InstanceType.of(InstanceClass.R5, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r5.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R5_XLARGE4
   */
  public static readonly MEMORY5_XLARGE4 = InstanceType.of(InstanceClass.MEMORY5, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r5.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY5_XLARGE8
   */
  public static readonly R5_XLARGE8 = InstanceType.of(InstanceClass.R5, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r5.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R5_XLARGE8
   */
  public static readonly MEMORY5_XLARGE8 = InstanceType.of(InstanceClass.MEMORY5, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r5.large`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY5_LARGE
   */
  public static readonly R5_LARGE = InstanceType.of(InstanceClass.R5, InstanceSize.LARGE);

  /**
   * **Instance type**: `r5.large`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R5_LARGE
   */
  public static readonly MEMORY5_LARGE = InstanceType.of(InstanceClass.MEMORY5, InstanceSize.LARGE);

  /**
   * **Instance type**: `r5.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY5_METAL
   */
  public static readonly R5_METAL = InstanceType.of(InstanceClass.R5, InstanceSize.METAL);

  /**
   * **Instance type**: `r5.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.R5_METAL
   */
  public static readonly MEMORY5_METAL = InstanceType.of(InstanceClass.MEMORY5, InstanceSize.METAL);

  /**
   * **Instance type**: `r5.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY5_XLARGE
   */
  public static readonly R5_XLARGE = InstanceType.of(InstanceClass.R5, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r5.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5} Memory optimized instances, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R5_XLARGE
   */
  public static readonly MEMORY5_XLARGE = InstanceType.of(InstanceClass.MEMORY5, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r5a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_XLARGE12
   */
  public static readonly R5A_XLARGE12 = InstanceType.of(InstanceClass.R5A, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r5a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R5A_XLARGE12
   */
  public static readonly MEMORY5_AMD_XLARGE12 = InstanceType.of(InstanceClass.MEMORY5_AMD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r5a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_XLARGE16
   */
  public static readonly R5A_XLARGE16 = InstanceType.of(InstanceClass.R5A, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r5a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R5A_XLARGE16
   */
  public static readonly MEMORY5_AMD_XLARGE16 = InstanceType.of(InstanceClass.MEMORY5_AMD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r5a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_XLARGE24
   */
  public static readonly R5A_XLARGE24 = InstanceType.of(InstanceClass.R5A, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r5a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R5A_XLARGE24
   */
  public static readonly MEMORY5_AMD_XLARGE24 = InstanceType.of(InstanceClass.MEMORY5_AMD, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r5a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_XLARGE2
   */
  public static readonly R5A_XLARGE2 = InstanceType.of(InstanceClass.R5A, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r5a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R5A_XLARGE2
   */
  public static readonly MEMORY5_AMD_XLARGE2 = InstanceType.of(InstanceClass.MEMORY5_AMD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r5a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_XLARGE4
   */
  public static readonly R5A_XLARGE4 = InstanceType.of(InstanceClass.R5A, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r5a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R5A_XLARGE4
   */
  public static readonly MEMORY5_AMD_XLARGE4 = InstanceType.of(InstanceClass.MEMORY5_AMD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r5a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_XLARGE8
   */
  public static readonly R5A_XLARGE8 = InstanceType.of(InstanceClass.R5A, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r5a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R5A_XLARGE8
   */
  public static readonly MEMORY5_AMD_XLARGE8 = InstanceType.of(InstanceClass.MEMORY5_AMD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r5a.large`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_LARGE
   */
  public static readonly R5A_LARGE = InstanceType.of(InstanceClass.R5A, InstanceSize.LARGE);

  /**
   * **Instance type**: `r5a.large`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R5A_LARGE
   */
  public static readonly MEMORY5_AMD_LARGE = InstanceType.of(InstanceClass.MEMORY5_AMD, InstanceSize.LARGE);

  /**
   * **Instance type**: `r5a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_XLARGE
   */
  public static readonly R5A_XLARGE = InstanceType.of(InstanceClass.R5A, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r5a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5A} Memory optimized instances based on AMD EPYC, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R5A_XLARGE
   */
  public static readonly MEMORY5_AMD_XLARGE = InstanceType.of(InstanceClass.MEMORY5_AMD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r5ad.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_NVME_DRIVE_XLARGE12
   */
  public static readonly R5AD_XLARGE12 = InstanceType.of(InstanceClass.R5AD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r5ad.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R5AD_XLARGE12
   */
  public static readonly MEMORY5_AMD_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.MEMORY5_AMD_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r5ad.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_NVME_DRIVE_XLARGE16
   */
  public static readonly R5AD_XLARGE16 = InstanceType.of(InstanceClass.R5AD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r5ad.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R5AD_XLARGE16
   */
  public static readonly MEMORY5_AMD_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.MEMORY5_AMD_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r5ad.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_NVME_DRIVE_XLARGE24
   */
  public static readonly R5AD_XLARGE24 = InstanceType.of(InstanceClass.R5AD, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r5ad.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R5AD_XLARGE24
   */
  public static readonly MEMORY5_AMD_NVME_DRIVE_XLARGE24 = InstanceType.of(InstanceClass.MEMORY5_AMD_NVME_DRIVE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r5ad.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_NVME_DRIVE_XLARGE2
   */
  public static readonly R5AD_XLARGE2 = InstanceType.of(InstanceClass.R5AD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r5ad.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R5AD_XLARGE2
   */
  public static readonly MEMORY5_AMD_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.MEMORY5_AMD_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r5ad.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_NVME_DRIVE_XLARGE4
   */
  public static readonly R5AD_XLARGE4 = InstanceType.of(InstanceClass.R5AD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r5ad.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R5AD_XLARGE4
   */
  public static readonly MEMORY5_AMD_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.MEMORY5_AMD_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r5ad.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_NVME_DRIVE_XLARGE8
   */
  public static readonly R5AD_XLARGE8 = InstanceType.of(InstanceClass.R5AD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r5ad.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R5AD_XLARGE8
   */
  public static readonly MEMORY5_AMD_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.MEMORY5_AMD_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r5ad.large`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_NVME_DRIVE_LARGE
   */
  public static readonly R5AD_LARGE = InstanceType.of(InstanceClass.R5AD, InstanceSize.LARGE);

  /**
   * **Instance type**: `r5ad.large`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R5AD_LARGE
   */
  public static readonly MEMORY5_AMD_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.MEMORY5_AMD_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `r5ad.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY5_AMD_NVME_DRIVE_XLARGE
   */
  public static readonly R5AD_XLARGE = InstanceType.of(InstanceClass.R5AD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r5ad.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5AD} Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R5AD_XLARGE
   */
  public static readonly MEMORY5_AMD_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.MEMORY5_AMD_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r5b.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY5_EBS_OPTIMIZED_XLARGE12
   */
  public static readonly R5B_XLARGE12 = InstanceType.of(InstanceClass.R5B, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r5b.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R5B_XLARGE12
   */
  public static readonly MEMORY5_EBS_OPTIMIZED_XLARGE12 = InstanceType.of(InstanceClass.MEMORY5_EBS_OPTIMIZED, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r5b.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY5_EBS_OPTIMIZED_XLARGE16
   */
  public static readonly R5B_XLARGE16 = InstanceType.of(InstanceClass.R5B, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r5b.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R5B_XLARGE16
   */
  public static readonly MEMORY5_EBS_OPTIMIZED_XLARGE16 = InstanceType.of(InstanceClass.MEMORY5_EBS_OPTIMIZED, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r5b.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY5_EBS_OPTIMIZED_XLARGE24
   */
  public static readonly R5B_XLARGE24 = InstanceType.of(InstanceClass.R5B, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r5b.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R5B_XLARGE24
   */
  public static readonly MEMORY5_EBS_OPTIMIZED_XLARGE24 = InstanceType.of(InstanceClass.MEMORY5_EBS_OPTIMIZED, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r5b.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY5_EBS_OPTIMIZED_XLARGE2
   */
  public static readonly R5B_XLARGE2 = InstanceType.of(InstanceClass.R5B, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r5b.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R5B_XLARGE2
   */
  public static readonly MEMORY5_EBS_OPTIMIZED_XLARGE2 = InstanceType.of(InstanceClass.MEMORY5_EBS_OPTIMIZED, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r5b.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY5_EBS_OPTIMIZED_XLARGE4
   */
  public static readonly R5B_XLARGE4 = InstanceType.of(InstanceClass.R5B, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r5b.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R5B_XLARGE4
   */
  public static readonly MEMORY5_EBS_OPTIMIZED_XLARGE4 = InstanceType.of(InstanceClass.MEMORY5_EBS_OPTIMIZED, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r5b.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY5_EBS_OPTIMIZED_XLARGE8
   */
  public static readonly R5B_XLARGE8 = InstanceType.of(InstanceClass.R5B, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r5b.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R5B_XLARGE8
   */
  public static readonly MEMORY5_EBS_OPTIMIZED_XLARGE8 = InstanceType.of(InstanceClass.MEMORY5_EBS_OPTIMIZED, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r5b.large`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY5_EBS_OPTIMIZED_LARGE
   */
  public static readonly R5B_LARGE = InstanceType.of(InstanceClass.R5B, InstanceSize.LARGE);

  /**
   * **Instance type**: `r5b.large`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R5B_LARGE
   */
  public static readonly MEMORY5_EBS_OPTIMIZED_LARGE = InstanceType.of(InstanceClass.MEMORY5_EBS_OPTIMIZED, InstanceSize.LARGE);

  /**
   * **Instance type**: `r5b.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY5_EBS_OPTIMIZED_METAL
   */
  public static readonly R5B_METAL = InstanceType.of(InstanceClass.R5B, InstanceSize.METAL);

  /**
   * **Instance type**: `r5b.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.R5B_METAL
   */
  public static readonly MEMORY5_EBS_OPTIMIZED_METAL = InstanceType.of(InstanceClass.MEMORY5_EBS_OPTIMIZED, InstanceSize.METAL);

  /**
   * **Instance type**: `r5b.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY5_EBS_OPTIMIZED_XLARGE
   */
  public static readonly R5B_XLARGE = InstanceType.of(InstanceClass.R5B, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r5b.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5B} Memory optimized instances that are also EBS-optimized, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R5B_XLARGE
   */
  public static readonly MEMORY5_EBS_OPTIMIZED_XLARGE = InstanceType.of(InstanceClass.MEMORY5_EBS_OPTIMIZED, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r5d.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_XLARGE12
   */
  public static readonly R5D_XLARGE12 = InstanceType.of(InstanceClass.R5D, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r5d.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R5D_XLARGE12
   */
  public static readonly MEMORY5_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r5d.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_XLARGE16
   */
  public static readonly R5D_XLARGE16 = InstanceType.of(InstanceClass.R5D, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r5d.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R5D_XLARGE16
   */
  public static readonly MEMORY5_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r5d.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_XLARGE24
   */
  public static readonly R5D_XLARGE24 = InstanceType.of(InstanceClass.R5D, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r5d.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R5D_XLARGE24
   */
  public static readonly MEMORY5_NVME_DRIVE_XLARGE24 = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r5d.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_XLARGE2
   */
  public static readonly R5D_XLARGE2 = InstanceType.of(InstanceClass.R5D, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r5d.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R5D_XLARGE2
   */
  public static readonly MEMORY5_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r5d.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_XLARGE4
   */
  public static readonly R5D_XLARGE4 = InstanceType.of(InstanceClass.R5D, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r5d.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R5D_XLARGE4
   */
  public static readonly MEMORY5_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r5d.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_XLARGE8
   */
  public static readonly R5D_XLARGE8 = InstanceType.of(InstanceClass.R5D, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r5d.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R5D_XLARGE8
   */
  public static readonly MEMORY5_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r5d.large`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_LARGE
   */
  public static readonly R5D_LARGE = InstanceType.of(InstanceClass.R5D, InstanceSize.LARGE);

  /**
   * **Instance type**: `r5d.large`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R5D_LARGE
   */
  public static readonly MEMORY5_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `r5d.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_METAL
   */
  public static readonly R5D_METAL = InstanceType.of(InstanceClass.R5D, InstanceSize.METAL);

  /**
   * **Instance type**: `r5d.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.R5D_METAL
   */
  public static readonly MEMORY5_NVME_DRIVE_METAL = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE, InstanceSize.METAL);

  /**
   * **Instance type**: `r5d.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_XLARGE
   */
  public static readonly R5D_XLARGE = InstanceType.of(InstanceClass.R5D, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r5d.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5D} Memory optimized instances with local NVME drive, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R5D_XLARGE
   */
  public static readonly MEMORY5_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r5dn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE12
   */
  public static readonly R5DN_XLARGE12 = InstanceType.of(InstanceClass.R5DN, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r5dn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R5DN_XLARGE12
   */
  public static readonly MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE12 = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r5dn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE16
   */
  public static readonly R5DN_XLARGE16 = InstanceType.of(InstanceClass.R5DN, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r5dn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R5DN_XLARGE16
   */
  public static readonly MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE16 = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r5dn.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE24
   */
  public static readonly R5DN_XLARGE24 = InstanceType.of(InstanceClass.R5DN, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r5dn.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R5DN_XLARGE24
   */
  public static readonly MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE24 = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r5dn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE2
   */
  public static readonly R5DN_XLARGE2 = InstanceType.of(InstanceClass.R5DN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r5dn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R5DN_XLARGE2
   */
  public static readonly MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE2 = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r5dn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE4
   */
  public static readonly R5DN_XLARGE4 = InstanceType.of(InstanceClass.R5DN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r5dn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R5DN_XLARGE4
   */
  public static readonly MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE4 = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r5dn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE8
   */
  public static readonly R5DN_XLARGE8 = InstanceType.of(InstanceClass.R5DN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r5dn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R5DN_XLARGE8
   */
  public static readonly MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE8 = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r5dn.large`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_LARGE
   */
  public static readonly R5DN_LARGE = InstanceType.of(InstanceClass.R5DN, InstanceSize.LARGE);

  /**
   * **Instance type**: `r5dn.large`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R5DN_LARGE
   */
  public static readonly MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_LARGE = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.LARGE);

  /**
   * **Instance type**: `r5dn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_METAL
   */
  public static readonly R5DN_METAL = InstanceType.of(InstanceClass.R5DN, InstanceSize.METAL);

  /**
   * **Instance type**: `r5dn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.R5DN_METAL
   */
  public static readonly MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_METAL = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.METAL);

  /**
   * **Instance type**: `r5dn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE
   */
  public static readonly R5DN_XLARGE = InstanceType.of(InstanceClass.R5DN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r5dn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5DN} Memory optimized instances with local NVME drive for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R5DN_XLARGE
   */
  public static readonly MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE = InstanceType.of(InstanceClass.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r5n.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY5_HIGH_PERFORMANCE_XLARGE12
   */
  public static readonly R5N_XLARGE12 = InstanceType.of(InstanceClass.R5N, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r5n.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R5N_XLARGE12
   */
  public static readonly MEMORY5_HIGH_PERFORMANCE_XLARGE12 = InstanceType.of(InstanceClass.MEMORY5_HIGH_PERFORMANCE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r5n.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY5_HIGH_PERFORMANCE_XLARGE16
   */
  public static readonly R5N_XLARGE16 = InstanceType.of(InstanceClass.R5N, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r5n.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R5N_XLARGE16
   */
  public static readonly MEMORY5_HIGH_PERFORMANCE_XLARGE16 = InstanceType.of(InstanceClass.MEMORY5_HIGH_PERFORMANCE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r5n.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY5_HIGH_PERFORMANCE_XLARGE24
   */
  public static readonly R5N_XLARGE24 = InstanceType.of(InstanceClass.R5N, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r5n.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R5N_XLARGE24
   */
  public static readonly MEMORY5_HIGH_PERFORMANCE_XLARGE24 = InstanceType.of(InstanceClass.MEMORY5_HIGH_PERFORMANCE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r5n.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY5_HIGH_PERFORMANCE_XLARGE2
   */
  public static readonly R5N_XLARGE2 = InstanceType.of(InstanceClass.R5N, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r5n.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R5N_XLARGE2
   */
  public static readonly MEMORY5_HIGH_PERFORMANCE_XLARGE2 = InstanceType.of(InstanceClass.MEMORY5_HIGH_PERFORMANCE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r5n.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY5_HIGH_PERFORMANCE_XLARGE4
   */
  public static readonly R5N_XLARGE4 = InstanceType.of(InstanceClass.R5N, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r5n.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R5N_XLARGE4
   */
  public static readonly MEMORY5_HIGH_PERFORMANCE_XLARGE4 = InstanceType.of(InstanceClass.MEMORY5_HIGH_PERFORMANCE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r5n.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY5_HIGH_PERFORMANCE_XLARGE8
   */
  public static readonly R5N_XLARGE8 = InstanceType.of(InstanceClass.R5N, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r5n.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R5N_XLARGE8
   */
  public static readonly MEMORY5_HIGH_PERFORMANCE_XLARGE8 = InstanceType.of(InstanceClass.MEMORY5_HIGH_PERFORMANCE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r5n.large`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY5_HIGH_PERFORMANCE_LARGE
   */
  public static readonly R5N_LARGE = InstanceType.of(InstanceClass.R5N, InstanceSize.LARGE);

  /**
   * **Instance type**: `r5n.large`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R5N_LARGE
   */
  public static readonly MEMORY5_HIGH_PERFORMANCE_LARGE = InstanceType.of(InstanceClass.MEMORY5_HIGH_PERFORMANCE, InstanceSize.LARGE);

  /**
   * **Instance type**: `r5n.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY5_HIGH_PERFORMANCE_METAL
   */
  public static readonly R5N_METAL = InstanceType.of(InstanceClass.R5N, InstanceSize.METAL);

  /**
   * **Instance type**: `r5n.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.R5N_METAL
   */
  public static readonly MEMORY5_HIGH_PERFORMANCE_METAL = InstanceType.of(InstanceClass.MEMORY5_HIGH_PERFORMANCE, InstanceSize.METAL);

  /**
   * **Instance type**: `r5n.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY5_HIGH_PERFORMANCE_XLARGE
   */
  public static readonly R5N_XLARGE = InstanceType.of(InstanceClass.R5N, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r5n.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R5N} Memory optimized instances for high performance computing, 5th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R5N_XLARGE
   */
  public static readonly MEMORY5_HIGH_PERFORMANCE_XLARGE = InstanceType.of(InstanceClass.MEMORY5_HIGH_PERFORMANCE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r6a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY6_AMD_XLARGE12
   */
  public static readonly R6A_XLARGE12 = InstanceType.of(InstanceClass.R6A, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r6a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R6A_XLARGE12
   */
  public static readonly MEMORY6_AMD_XLARGE12 = InstanceType.of(InstanceClass.MEMORY6_AMD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r6a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY6_AMD_XLARGE16
   */
  public static readonly R6A_XLARGE16 = InstanceType.of(InstanceClass.R6A, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R6A_XLARGE16
   */
  public static readonly MEMORY6_AMD_XLARGE16 = InstanceType.of(InstanceClass.MEMORY6_AMD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY6_AMD_XLARGE24
   */
  public static readonly R6A_XLARGE24 = InstanceType.of(InstanceClass.R6A, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r6a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R6A_XLARGE24
   */
  public static readonly MEMORY6_AMD_XLARGE24 = InstanceType.of(InstanceClass.MEMORY6_AMD, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r6a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY6_AMD_XLARGE2
   */
  public static readonly R6A_XLARGE2 = InstanceType.of(InstanceClass.R6A, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r6a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R6A_XLARGE2
   */
  public static readonly MEMORY6_AMD_XLARGE2 = InstanceType.of(InstanceClass.MEMORY6_AMD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r6a.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.MEMORY6_AMD_XLARGE32
   */
  public static readonly R6A_XLARGE32 = InstanceType.of(InstanceClass.R6A, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `r6a.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.R6A_XLARGE32
   */
  public static readonly MEMORY6_AMD_XLARGE32 = InstanceType.of(InstanceClass.MEMORY6_AMD, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `r6a.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.MEMORY6_AMD_XLARGE48
   */
  public static readonly R6A_XLARGE48 = InstanceType.of(InstanceClass.R6A, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `r6a.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.R6A_XLARGE48
   */
  public static readonly MEMORY6_AMD_XLARGE48 = InstanceType.of(InstanceClass.MEMORY6_AMD, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `r6a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY6_AMD_XLARGE4
   */
  public static readonly R6A_XLARGE4 = InstanceType.of(InstanceClass.R6A, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r6a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R6A_XLARGE4
   */
  public static readonly MEMORY6_AMD_XLARGE4 = InstanceType.of(InstanceClass.MEMORY6_AMD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r6a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY6_AMD_XLARGE8
   */
  public static readonly R6A_XLARGE8 = InstanceType.of(InstanceClass.R6A, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r6a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R6A_XLARGE8
   */
  public static readonly MEMORY6_AMD_XLARGE8 = InstanceType.of(InstanceClass.MEMORY6_AMD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r6a.large`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY6_AMD_LARGE
   */
  public static readonly R6A_LARGE = InstanceType.of(InstanceClass.R6A, InstanceSize.LARGE);

  /**
   * **Instance type**: `r6a.large`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R6A_LARGE
   */
  public static readonly MEMORY6_AMD_LARGE = InstanceType.of(InstanceClass.MEMORY6_AMD, InstanceSize.LARGE);

  /**
   * **Instance type**: `r6a.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY6_AMD_METAL
   */
  public static readonly R6A_METAL = InstanceType.of(InstanceClass.R6A, InstanceSize.METAL);

  /**
   * **Instance type**: `r6a.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.R6A_METAL
   */
  public static readonly MEMORY6_AMD_METAL = InstanceType.of(InstanceClass.MEMORY6_AMD, InstanceSize.METAL);

  /**
   * **Instance type**: `r6a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY6_AMD_XLARGE
   */
  public static readonly R6A_XLARGE = InstanceType.of(InstanceClass.R6A, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r6a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6A} Memory optimized instances based on AMD EPYC, 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R6A_XLARGE
   */
  public static readonly MEMORY6_AMD_XLARGE = InstanceType.of(InstanceClass.MEMORY6_AMD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r6g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON_XLARGE12
   */
  public static readonly R6G_XLARGE12 = InstanceType.of(InstanceClass.R6G, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r6g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R6G_XLARGE12
   */
  public static readonly MEMORY6_GRAVITON_XLARGE12 = InstanceType.of(InstanceClass.MEMORY6_GRAVITON, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r6g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON_XLARGE16
   */
  public static readonly R6G_XLARGE16 = InstanceType.of(InstanceClass.R6G, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R6G_XLARGE16
   */
  public static readonly MEMORY6_GRAVITON_XLARGE16 = InstanceType.of(InstanceClass.MEMORY6_GRAVITON, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON_XLARGE2
   */
  public static readonly R6G_XLARGE2 = InstanceType.of(InstanceClass.R6G, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r6g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R6G_XLARGE2
   */
  public static readonly MEMORY6_GRAVITON_XLARGE2 = InstanceType.of(InstanceClass.MEMORY6_GRAVITON, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r6g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON_XLARGE4
   */
  public static readonly R6G_XLARGE4 = InstanceType.of(InstanceClass.R6G, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r6g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R6G_XLARGE4
   */
  public static readonly MEMORY6_GRAVITON_XLARGE4 = InstanceType.of(InstanceClass.MEMORY6_GRAVITON, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r6g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON_XLARGE8
   */
  public static readonly R6G_XLARGE8 = InstanceType.of(InstanceClass.R6G, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r6g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R6G_XLARGE8
   */
  public static readonly MEMORY6_GRAVITON_XLARGE8 = InstanceType.of(InstanceClass.MEMORY6_GRAVITON, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r6g.large`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON_LARGE
   */
  public static readonly R6G_LARGE = InstanceType.of(InstanceClass.R6G, InstanceSize.LARGE);

  /**
   * **Instance type**: `r6g.large`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R6G_LARGE
   */
  public static readonly MEMORY6_GRAVITON_LARGE = InstanceType.of(InstanceClass.MEMORY6_GRAVITON, InstanceSize.LARGE);

  /**
   * **Instance type**: `r6g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON_MEDIUM
   */
  public static readonly R6G_MEDIUM = InstanceType.of(InstanceClass.R6G, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `r6g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.R6G_MEDIUM
   */
  public static readonly MEMORY6_GRAVITON_MEDIUM = InstanceType.of(InstanceClass.MEMORY6_GRAVITON, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `r6g.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON_METAL
   */
  public static readonly R6G_METAL = InstanceType.of(InstanceClass.R6G, InstanceSize.METAL);

  /**
   * **Instance type**: `r6g.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.R6G_METAL
   */
  public static readonly MEMORY6_GRAVITON_METAL = InstanceType.of(InstanceClass.MEMORY6_GRAVITON, InstanceSize.METAL);

  /**
   * **Instance type**: `r6g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON_XLARGE
   */
  public static readonly R6G_XLARGE = InstanceType.of(InstanceClass.R6G, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r6g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6G} Memory optimized instances, 6th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R6G_XLARGE
   */
  public static readonly MEMORY6_GRAVITON_XLARGE = InstanceType.of(InstanceClass.MEMORY6_GRAVITON, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r6gd.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON2_NVME_DRIVE_XLARGE12
   */
  public static readonly R6GD_XLARGE12 = InstanceType.of(InstanceClass.R6GD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r6gd.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R6GD_XLARGE12
   */
  public static readonly MEMORY6_GRAVITON2_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.MEMORY6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r6gd.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON2_NVME_DRIVE_XLARGE16
   */
  public static readonly R6GD_XLARGE16 = InstanceType.of(InstanceClass.R6GD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6gd.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R6GD_XLARGE16
   */
  public static readonly MEMORY6_GRAVITON2_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.MEMORY6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6gd.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON2_NVME_DRIVE_XLARGE2
   */
  public static readonly R6GD_XLARGE2 = InstanceType.of(InstanceClass.R6GD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r6gd.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R6GD_XLARGE2
   */
  public static readonly MEMORY6_GRAVITON2_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.MEMORY6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r6gd.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON2_NVME_DRIVE_XLARGE4
   */
  public static readonly R6GD_XLARGE4 = InstanceType.of(InstanceClass.R6GD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r6gd.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R6GD_XLARGE4
   */
  public static readonly MEMORY6_GRAVITON2_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.MEMORY6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r6gd.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON2_NVME_DRIVE_XLARGE8
   */
  public static readonly R6GD_XLARGE8 = InstanceType.of(InstanceClass.R6GD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r6gd.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R6GD_XLARGE8
   */
  public static readonly MEMORY6_GRAVITON2_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.MEMORY6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r6gd.large`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON2_NVME_DRIVE_LARGE
   */
  public static readonly R6GD_LARGE = InstanceType.of(InstanceClass.R6GD, InstanceSize.LARGE);

  /**
   * **Instance type**: `r6gd.large`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R6GD_LARGE
   */
  public static readonly MEMORY6_GRAVITON2_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.MEMORY6_GRAVITON2_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `r6gd.medium`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON2_NVME_DRIVE_MEDIUM
   */
  public static readonly R6GD_MEDIUM = InstanceType.of(InstanceClass.R6GD, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `r6gd.medium`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.R6GD_MEDIUM
   */
  public static readonly MEMORY6_GRAVITON2_NVME_DRIVE_MEDIUM = InstanceType.of(InstanceClass.MEMORY6_GRAVITON2_NVME_DRIVE, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `r6gd.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON2_NVME_DRIVE_METAL
   */
  public static readonly R6GD_METAL = InstanceType.of(InstanceClass.R6GD, InstanceSize.METAL);

  /**
   * **Instance type**: `r6gd.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.R6GD_METAL
   */
  public static readonly MEMORY6_GRAVITON2_NVME_DRIVE_METAL = InstanceType.of(InstanceClass.MEMORY6_GRAVITON2_NVME_DRIVE, InstanceSize.METAL);

  /**
   * **Instance type**: `r6gd.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY6_GRAVITON2_NVME_DRIVE_XLARGE
   */
  public static readonly R6GD_XLARGE = InstanceType.of(InstanceClass.R6GD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r6gd.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6GD} Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R6GD_XLARGE
   */
  public static readonly MEMORY6_GRAVITON2_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.MEMORY6_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r6i.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_XLARGE12
   */
  public static readonly R6I_XLARGE12 = InstanceType.of(InstanceClass.R6I, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r6i.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R6I_XLARGE12
   */
  public static readonly MEMORY6_INTEL_XLARGE12 = InstanceType.of(InstanceClass.MEMORY6_INTEL, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r6i.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_XLARGE16
   */
  public static readonly R6I_XLARGE16 = InstanceType.of(InstanceClass.R6I, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6i.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R6I_XLARGE16
   */
  public static readonly MEMORY6_INTEL_XLARGE16 = InstanceType.of(InstanceClass.MEMORY6_INTEL, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6i.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_XLARGE24
   */
  public static readonly R6I_XLARGE24 = InstanceType.of(InstanceClass.R6I, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r6i.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R6I_XLARGE24
   */
  public static readonly MEMORY6_INTEL_XLARGE24 = InstanceType.of(InstanceClass.MEMORY6_INTEL, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r6i.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_XLARGE2
   */
  public static readonly R6I_XLARGE2 = InstanceType.of(InstanceClass.R6I, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r6i.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R6I_XLARGE2
   */
  public static readonly MEMORY6_INTEL_XLARGE2 = InstanceType.of(InstanceClass.MEMORY6_INTEL, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r6i.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_XLARGE32
   */
  public static readonly R6I_XLARGE32 = InstanceType.of(InstanceClass.R6I, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `r6i.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.R6I_XLARGE32
   */
  public static readonly MEMORY6_INTEL_XLARGE32 = InstanceType.of(InstanceClass.MEMORY6_INTEL, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `r6i.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_XLARGE4
   */
  public static readonly R6I_XLARGE4 = InstanceType.of(InstanceClass.R6I, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r6i.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R6I_XLARGE4
   */
  public static readonly MEMORY6_INTEL_XLARGE4 = InstanceType.of(InstanceClass.MEMORY6_INTEL, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r6i.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_XLARGE8
   */
  public static readonly R6I_XLARGE8 = InstanceType.of(InstanceClass.R6I, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r6i.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R6I_XLARGE8
   */
  public static readonly MEMORY6_INTEL_XLARGE8 = InstanceType.of(InstanceClass.MEMORY6_INTEL, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r6i.large`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_LARGE
   */
  public static readonly R6I_LARGE = InstanceType.of(InstanceClass.R6I, InstanceSize.LARGE);

  /**
   * **Instance type**: `r6i.large`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R6I_LARGE
   */
  public static readonly MEMORY6_INTEL_LARGE = InstanceType.of(InstanceClass.MEMORY6_INTEL, InstanceSize.LARGE);

  /**
   * **Instance type**: `r6i.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_METAL
   */
  public static readonly R6I_METAL = InstanceType.of(InstanceClass.R6I, InstanceSize.METAL);

  /**
   * **Instance type**: `r6i.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.R6I_METAL
   */
  public static readonly MEMORY6_INTEL_METAL = InstanceType.of(InstanceClass.MEMORY6_INTEL, InstanceSize.METAL);

  /**
   * **Instance type**: `r6i.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_XLARGE
   */
  public static readonly R6I_XLARGE = InstanceType.of(InstanceClass.R6I, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r6i.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6I} Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R6I_XLARGE
   */
  public static readonly MEMORY6_INTEL_XLARGE = InstanceType.of(InstanceClass.MEMORY6_INTEL, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r6id.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_XLARGE12
   */
  public static readonly R6ID_XLARGE12 = InstanceType.of(InstanceClass.R6ID, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r6id.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R6ID_XLARGE12
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r6id.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_XLARGE16
   */
  public static readonly R6ID_XLARGE16 = InstanceType.of(InstanceClass.R6ID, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6id.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R6ID_XLARGE16
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6id.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_XLARGE24
   */
  public static readonly R6ID_XLARGE24 = InstanceType.of(InstanceClass.R6ID, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r6id.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R6ID_XLARGE24
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_XLARGE24 = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r6id.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_XLARGE2
   */
  public static readonly R6ID_XLARGE2 = InstanceType.of(InstanceClass.R6ID, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r6id.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R6ID_XLARGE2
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r6id.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_XLARGE32
   */
  public static readonly R6ID_XLARGE32 = InstanceType.of(InstanceClass.R6ID, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `r6id.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.R6ID_XLARGE32
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_XLARGE32 = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `r6id.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_XLARGE4
   */
  public static readonly R6ID_XLARGE4 = InstanceType.of(InstanceClass.R6ID, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r6id.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R6ID_XLARGE4
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r6id.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_XLARGE8
   */
  public static readonly R6ID_XLARGE8 = InstanceType.of(InstanceClass.R6ID, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r6id.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R6ID_XLARGE8
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r6id.large`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_LARGE
   */
  public static readonly R6ID_LARGE = InstanceType.of(InstanceClass.R6ID, InstanceSize.LARGE);

  /**
   * **Instance type**: `r6id.large`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R6ID_LARGE
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `r6id.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_METAL
   */
  public static readonly R6ID_METAL = InstanceType.of(InstanceClass.R6ID, InstanceSize.METAL);

  /**
   * **Instance type**: `r6id.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.R6ID_METAL
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_METAL = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE, InstanceSize.METAL);

  /**
   * **Instance type**: `r6id.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_XLARGE
   */
  public static readonly R6ID_XLARGE = InstanceType.of(InstanceClass.R6ID, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r6id.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R6ID_XLARGE
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r6idn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE12
   */
  public static readonly R6IDN_XLARGE12 = InstanceType.of(InstanceClass.R6IDN, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r6idn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R6IDN_XLARGE12
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE12 = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r6idn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE16
   */
  public static readonly R6IDN_XLARGE16 = InstanceType.of(InstanceClass.R6IDN, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6idn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R6IDN_XLARGE16
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE16 = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6idn.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE24
   */
  public static readonly R6IDN_XLARGE24 = InstanceType.of(InstanceClass.R6IDN, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r6idn.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R6IDN_XLARGE24
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE24 = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r6idn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE2
   */
  public static readonly R6IDN_XLARGE2 = InstanceType.of(InstanceClass.R6IDN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r6idn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R6IDN_XLARGE2
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE2 = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r6idn.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE32
   */
  public static readonly R6IDN_XLARGE32 = InstanceType.of(InstanceClass.R6IDN, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `r6idn.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.R6IDN_XLARGE32
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE32 = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `r6idn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE4
   */
  public static readonly R6IDN_XLARGE4 = InstanceType.of(InstanceClass.R6IDN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r6idn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R6IDN_XLARGE4
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE4 = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r6idn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE8
   */
  public static readonly R6IDN_XLARGE8 = InstanceType.of(InstanceClass.R6IDN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r6idn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R6IDN_XLARGE8
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE8 = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r6idn.large`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_LARGE
   */
  public static readonly R6IDN_LARGE = InstanceType.of(InstanceClass.R6IDN, InstanceSize.LARGE);

  /**
   * **Instance type**: `r6idn.large`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R6IDN_LARGE
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_LARGE = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.LARGE);

  /**
   * **Instance type**: `r6idn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_METAL
   */
  public static readonly R6IDN_METAL = InstanceType.of(InstanceClass.R6IDN, InstanceSize.METAL);

  /**
   * **Instance type**: `r6idn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.R6IDN_METAL
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_METAL = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.METAL);

  /**
   * **Instance type**: `r6idn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE
   */
  public static readonly R6IDN_XLARGE = InstanceType.of(InstanceClass.R6IDN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r6idn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IDN} Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R6IDN_XLARGE
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE_XLARGE = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r6in.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE12
   */
  public static readonly R6IN_XLARGE12 = InstanceType.of(InstanceClass.R6IN, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r6in.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R6IN_XLARGE12
   */
  public static readonly MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE12 = InstanceType.of(InstanceClass.MEMORY6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r6in.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE16
   */
  public static readonly R6IN_XLARGE16 = InstanceType.of(InstanceClass.R6IN, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6in.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R6IN_XLARGE16
   */
  public static readonly MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE16 = InstanceType.of(InstanceClass.MEMORY6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6in.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE24
   */
  public static readonly R6IN_XLARGE24 = InstanceType.of(InstanceClass.R6IN, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r6in.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R6IN_XLARGE24
   */
  public static readonly MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE24 = InstanceType.of(InstanceClass.MEMORY6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r6in.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE2
   */
  public static readonly R6IN_XLARGE2 = InstanceType.of(InstanceClass.R6IN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r6in.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R6IN_XLARGE2
   */
  public static readonly MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE2 = InstanceType.of(InstanceClass.MEMORY6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r6in.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE32
   */
  public static readonly R6IN_XLARGE32 = InstanceType.of(InstanceClass.R6IN, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `r6in.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.R6IN_XLARGE32
   */
  public static readonly MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE32 = InstanceType.of(InstanceClass.MEMORY6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `r6in.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE4
   */
  public static readonly R6IN_XLARGE4 = InstanceType.of(InstanceClass.R6IN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r6in.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R6IN_XLARGE4
   */
  public static readonly MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE4 = InstanceType.of(InstanceClass.MEMORY6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r6in.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE8
   */
  public static readonly R6IN_XLARGE8 = InstanceType.of(InstanceClass.R6IN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r6in.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R6IN_XLARGE8
   */
  public static readonly MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE8 = InstanceType.of(InstanceClass.MEMORY6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r6in.large`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_HIGH_PERFORMANCE_LARGE
   */
  public static readonly R6IN_LARGE = InstanceType.of(InstanceClass.R6IN, InstanceSize.LARGE);

  /**
   * **Instance type**: `r6in.large`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R6IN_LARGE
   */
  public static readonly MEMORY6_INTEL_HIGH_PERFORMANCE_LARGE = InstanceType.of(InstanceClass.MEMORY6_INTEL_HIGH_PERFORMANCE, InstanceSize.LARGE);

  /**
   * **Instance type**: `r6in.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_HIGH_PERFORMANCE_METAL
   */
  public static readonly R6IN_METAL = InstanceType.of(InstanceClass.R6IN, InstanceSize.METAL);

  /**
   * **Instance type**: `r6in.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.R6IN_METAL
   */
  public static readonly MEMORY6_INTEL_HIGH_PERFORMANCE_METAL = InstanceType.of(InstanceClass.MEMORY6_INTEL_HIGH_PERFORMANCE, InstanceSize.METAL);

  /**
   * **Instance type**: `r6in.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE
   */
  public static readonly R6IN_XLARGE = InstanceType.of(InstanceClass.R6IN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r6in.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6IN} Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R6IN_XLARGE
   */
  public static readonly MEMORY6_INTEL_HIGH_PERFORMANCE_XLARGE = InstanceType.of(InstanceClass.MEMORY6_INTEL_HIGH_PERFORMANCE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r7a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY7_AMD_XLARGE12
   */
  public static readonly R7A_XLARGE12 = InstanceType.of(InstanceClass.R7A, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r7a.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R7A_XLARGE12
   */
  public static readonly MEMORY7_AMD_XLARGE12 = InstanceType.of(InstanceClass.MEMORY7_AMD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r7a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY7_AMD_XLARGE16
   */
  public static readonly R7A_XLARGE16 = InstanceType.of(InstanceClass.R7A, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r7a.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R7A_XLARGE16
   */
  public static readonly MEMORY7_AMD_XLARGE16 = InstanceType.of(InstanceClass.MEMORY7_AMD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r7a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY7_AMD_XLARGE24
   */
  public static readonly R7A_XLARGE24 = InstanceType.of(InstanceClass.R7A, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r7a.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R7A_XLARGE24
   */
  public static readonly MEMORY7_AMD_XLARGE24 = InstanceType.of(InstanceClass.MEMORY7_AMD, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r7a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY7_AMD_XLARGE2
   */
  public static readonly R7A_XLARGE2 = InstanceType.of(InstanceClass.R7A, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r7a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R7A_XLARGE2
   */
  public static readonly MEMORY7_AMD_XLARGE2 = InstanceType.of(InstanceClass.MEMORY7_AMD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r7a.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.MEMORY7_AMD_XLARGE32
   */
  public static readonly R7A_XLARGE32 = InstanceType.of(InstanceClass.R7A, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `r7a.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.R7A_XLARGE32
   */
  public static readonly MEMORY7_AMD_XLARGE32 = InstanceType.of(InstanceClass.MEMORY7_AMD, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `r7a.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.MEMORY7_AMD_XLARGE48
   */
  public static readonly R7A_XLARGE48 = InstanceType.of(InstanceClass.R7A, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `r7a.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.R7A_XLARGE48
   */
  public static readonly MEMORY7_AMD_XLARGE48 = InstanceType.of(InstanceClass.MEMORY7_AMD, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `r7a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY7_AMD_XLARGE4
   */
  public static readonly R7A_XLARGE4 = InstanceType.of(InstanceClass.R7A, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r7a.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R7A_XLARGE4
   */
  public static readonly MEMORY7_AMD_XLARGE4 = InstanceType.of(InstanceClass.MEMORY7_AMD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r7a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY7_AMD_XLARGE8
   */
  public static readonly R7A_XLARGE8 = InstanceType.of(InstanceClass.R7A, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r7a.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R7A_XLARGE8
   */
  public static readonly MEMORY7_AMD_XLARGE8 = InstanceType.of(InstanceClass.MEMORY7_AMD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r7a.large`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY7_AMD_LARGE
   */
  public static readonly R7A_LARGE = InstanceType.of(InstanceClass.R7A, InstanceSize.LARGE);

  /**
   * **Instance type**: `r7a.large`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R7A_LARGE
   */
  public static readonly MEMORY7_AMD_LARGE = InstanceType.of(InstanceClass.MEMORY7_AMD, InstanceSize.LARGE);

  /**
   * **Instance type**: `r7a.medium`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.MEMORY7_AMD_MEDIUM
   */
  public static readonly R7A_MEDIUM = InstanceType.of(InstanceClass.R7A, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `r7a.medium`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.R7A_MEDIUM
   */
  public static readonly MEMORY7_AMD_MEDIUM = InstanceType.of(InstanceClass.MEMORY7_AMD, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `r7a.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.MEMORY7_AMD_XLARGE48METAL
   */
  public static readonly R7A_XLARGE48METAL = InstanceType.of(InstanceClass.R7A, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `r7a.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.R7A_XLARGE48METAL
   */
  public static readonly MEMORY7_AMD_XLARGE48METAL = InstanceType.of(InstanceClass.MEMORY7_AMD, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `r7a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY7_AMD_XLARGE
   */
  public static readonly R7A_XLARGE = InstanceType.of(InstanceClass.R7A, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r7a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7A} Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R7A_XLARGE
   */
  public static readonly MEMORY7_AMD_XLARGE = InstanceType.of(InstanceClass.MEMORY7_AMD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r7g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON_XLARGE12
   */
  public static readonly R7G_XLARGE12 = InstanceType.of(InstanceClass.R7G, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r7g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R7G_XLARGE12
   */
  public static readonly MEMORY7_GRAVITON_XLARGE12 = InstanceType.of(InstanceClass.MEMORY7_GRAVITON, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r7g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON_XLARGE16
   */
  public static readonly R7G_XLARGE16 = InstanceType.of(InstanceClass.R7G, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r7g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R7G_XLARGE16
   */
  public static readonly MEMORY7_GRAVITON_XLARGE16 = InstanceType.of(InstanceClass.MEMORY7_GRAVITON, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r7g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON_XLARGE2
   */
  public static readonly R7G_XLARGE2 = InstanceType.of(InstanceClass.R7G, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r7g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R7G_XLARGE2
   */
  public static readonly MEMORY7_GRAVITON_XLARGE2 = InstanceType.of(InstanceClass.MEMORY7_GRAVITON, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r7g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON_XLARGE4
   */
  public static readonly R7G_XLARGE4 = InstanceType.of(InstanceClass.R7G, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r7g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R7G_XLARGE4
   */
  public static readonly MEMORY7_GRAVITON_XLARGE4 = InstanceType.of(InstanceClass.MEMORY7_GRAVITON, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r7g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON_XLARGE8
   */
  public static readonly R7G_XLARGE8 = InstanceType.of(InstanceClass.R7G, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r7g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R7G_XLARGE8
   */
  public static readonly MEMORY7_GRAVITON_XLARGE8 = InstanceType.of(InstanceClass.MEMORY7_GRAVITON, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r7g.large`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON_LARGE
   */
  public static readonly R7G_LARGE = InstanceType.of(InstanceClass.R7G, InstanceSize.LARGE);

  /**
   * **Instance type**: `r7g.large`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R7G_LARGE
   */
  public static readonly MEMORY7_GRAVITON_LARGE = InstanceType.of(InstanceClass.MEMORY7_GRAVITON, InstanceSize.LARGE);

  /**
   * **Instance type**: `r7g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON_MEDIUM
   */
  public static readonly R7G_MEDIUM = InstanceType.of(InstanceClass.R7G, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `r7g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.R7G_MEDIUM
   */
  public static readonly MEMORY7_GRAVITON_MEDIUM = InstanceType.of(InstanceClass.MEMORY7_GRAVITON, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `r7g.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON_METAL
   */
  public static readonly R7G_METAL = InstanceType.of(InstanceClass.R7G, InstanceSize.METAL);

  /**
   * **Instance type**: `r7g.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.R7G_METAL
   */
  public static readonly MEMORY7_GRAVITON_METAL = InstanceType.of(InstanceClass.MEMORY7_GRAVITON, InstanceSize.METAL);

  /**
   * **Instance type**: `r7g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON_XLARGE
   */
  public static readonly R7G_XLARGE = InstanceType.of(InstanceClass.R7G, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r7g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7G} Memory optimized instances, 7th generation with Graviton3 processorsThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R7G_XLARGE
   */
  public static readonly MEMORY7_GRAVITON_XLARGE = InstanceType.of(InstanceClass.MEMORY7_GRAVITON, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r7gd.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON3_NVME_DRIVE_XLARGE12
   */
  public static readonly R7GD_XLARGE12 = InstanceType.of(InstanceClass.R7GD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r7gd.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R7GD_XLARGE12
   */
  public static readonly MEMORY7_GRAVITON3_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.MEMORY7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r7gd.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON3_NVME_DRIVE_XLARGE16
   */
  public static readonly R7GD_XLARGE16 = InstanceType.of(InstanceClass.R7GD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r7gd.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R7GD_XLARGE16
   */
  public static readonly MEMORY7_GRAVITON3_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.MEMORY7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r7gd.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON3_NVME_DRIVE_XLARGE2
   */
  public static readonly R7GD_XLARGE2 = InstanceType.of(InstanceClass.R7GD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r7gd.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R7GD_XLARGE2
   */
  public static readonly MEMORY7_GRAVITON3_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.MEMORY7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r7gd.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON3_NVME_DRIVE_XLARGE4
   */
  public static readonly R7GD_XLARGE4 = InstanceType.of(InstanceClass.R7GD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r7gd.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R7GD_XLARGE4
   */
  public static readonly MEMORY7_GRAVITON3_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.MEMORY7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r7gd.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON3_NVME_DRIVE_XLARGE8
   */
  public static readonly R7GD_XLARGE8 = InstanceType.of(InstanceClass.R7GD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r7gd.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R7GD_XLARGE8
   */
  public static readonly MEMORY7_GRAVITON3_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.MEMORY7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r7gd.large`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON3_NVME_DRIVE_LARGE
   */
  public static readonly R7GD_LARGE = InstanceType.of(InstanceClass.R7GD, InstanceSize.LARGE);

  /**
   * **Instance type**: `r7gd.large`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R7GD_LARGE
   */
  public static readonly MEMORY7_GRAVITON3_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.MEMORY7_GRAVITON3_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `r7gd.medium`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON3_NVME_DRIVE_MEDIUM
   */
  public static readonly R7GD_MEDIUM = InstanceType.of(InstanceClass.R7GD, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `r7gd.medium`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.R7GD_MEDIUM
   */
  public static readonly MEMORY7_GRAVITON3_NVME_DRIVE_MEDIUM = InstanceType.of(InstanceClass.MEMORY7_GRAVITON3_NVME_DRIVE, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `r7gd.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON3_NVME_DRIVE_METAL
   */
  public static readonly R7GD_METAL = InstanceType.of(InstanceClass.R7GD, InstanceSize.METAL);

  /**
   * **Instance type**: `r7gd.metal`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.R7GD_METAL
   */
  public static readonly MEMORY7_GRAVITON3_NVME_DRIVE_METAL = InstanceType.of(InstanceClass.MEMORY7_GRAVITON3_NVME_DRIVE, InstanceSize.METAL);

  /**
   * **Instance type**: `r7gd.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY7_GRAVITON3_NVME_DRIVE_XLARGE
   */
  public static readonly R7GD_XLARGE = InstanceType.of(InstanceClass.R7GD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r7gd.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7GD} Memory optimized instances, 7th generation with Graviton3 processors and local NVME driveThis instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R7GD_XLARGE
   */
  public static readonly MEMORY7_GRAVITON3_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.MEMORY7_GRAVITON3_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r7i.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_BASE_XLARGE12
   */
  public static readonly R7I_XLARGE12 = InstanceType.of(InstanceClass.R7I, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r7i.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R7I_XLARGE12
   */
  public static readonly MEMORY7_INTEL_BASE_XLARGE12 = InstanceType.of(InstanceClass.MEMORY7_INTEL_BASE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r7i.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_BASE_XLARGE16
   */
  public static readonly R7I_XLARGE16 = InstanceType.of(InstanceClass.R7I, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r7i.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R7I_XLARGE16
   */
  public static readonly MEMORY7_INTEL_BASE_XLARGE16 = InstanceType.of(InstanceClass.MEMORY7_INTEL_BASE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r7i.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_BASE_XLARGE24
   */
  public static readonly R7I_XLARGE24 = InstanceType.of(InstanceClass.R7I, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r7i.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R7I_XLARGE24
   */
  public static readonly MEMORY7_INTEL_BASE_XLARGE24 = InstanceType.of(InstanceClass.MEMORY7_INTEL_BASE, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r7i.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_BASE_XLARGE2
   */
  public static readonly R7I_XLARGE2 = InstanceType.of(InstanceClass.R7I, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r7i.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R7I_XLARGE2
   */
  public static readonly MEMORY7_INTEL_BASE_XLARGE2 = InstanceType.of(InstanceClass.MEMORY7_INTEL_BASE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r7i.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_BASE_XLARGE48
   */
  public static readonly R7I_XLARGE48 = InstanceType.of(InstanceClass.R7I, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `r7i.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.R7I_XLARGE48
   */
  public static readonly MEMORY7_INTEL_BASE_XLARGE48 = InstanceType.of(InstanceClass.MEMORY7_INTEL_BASE, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `r7i.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_BASE_XLARGE4
   */
  public static readonly R7I_XLARGE4 = InstanceType.of(InstanceClass.R7I, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r7i.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R7I_XLARGE4
   */
  public static readonly MEMORY7_INTEL_BASE_XLARGE4 = InstanceType.of(InstanceClass.MEMORY7_INTEL_BASE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r7i.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_BASE_XLARGE8
   */
  public static readonly R7I_XLARGE8 = InstanceType.of(InstanceClass.R7I, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r7i.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R7I_XLARGE8
   */
  public static readonly MEMORY7_INTEL_BASE_XLARGE8 = InstanceType.of(InstanceClass.MEMORY7_INTEL_BASE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r7i.large`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_BASE_LARGE
   */
  public static readonly R7I_LARGE = InstanceType.of(InstanceClass.R7I, InstanceSize.LARGE);

  /**
   * **Instance type**: `r7i.large`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R7I_LARGE
   */
  public static readonly MEMORY7_INTEL_BASE_LARGE = InstanceType.of(InstanceClass.MEMORY7_INTEL_BASE, InstanceSize.LARGE);

  /**
   * **Instance type**: `r7i.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_BASE_XLARGE24METAL
   */
  public static readonly R7I_XLARGE24METAL = InstanceType.of(InstanceClass.R7I, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `r7i.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.R7I_XLARGE24METAL
   */
  public static readonly MEMORY7_INTEL_BASE_XLARGE24METAL = InstanceType.of(InstanceClass.MEMORY7_INTEL_BASE, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `r7i.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_BASE_XLARGE48METAL
   */
  public static readonly R7I_XLARGE48METAL = InstanceType.of(InstanceClass.R7I, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `r7i.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.R7I_XLARGE48METAL
   */
  public static readonly MEMORY7_INTEL_BASE_XLARGE48METAL = InstanceType.of(InstanceClass.MEMORY7_INTEL_BASE, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `r7i.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_BASE_XLARGE
   */
  public static readonly R7I_XLARGE = InstanceType.of(InstanceClass.R7I, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r7i.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7I} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R7I_XLARGE
   */
  public static readonly MEMORY7_INTEL_BASE_XLARGE = InstanceType.of(InstanceClass.MEMORY7_INTEL_BASE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r7iz.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_XLARGE12
   */
  public static readonly R7IZ_XLARGE12 = InstanceType.of(InstanceClass.R7IZ, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r7iz.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R7IZ_XLARGE12
   */
  public static readonly MEMORY7_INTEL_XLARGE12 = InstanceType.of(InstanceClass.MEMORY7_INTEL, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r7iz.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_XLARGE16
   */
  public static readonly R7IZ_XLARGE16 = InstanceType.of(InstanceClass.R7IZ, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r7iz.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R7IZ_XLARGE16
   */
  public static readonly MEMORY7_INTEL_XLARGE16 = InstanceType.of(InstanceClass.MEMORY7_INTEL, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r7iz.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_XLARGE2
   */
  public static readonly R7IZ_XLARGE2 = InstanceType.of(InstanceClass.R7IZ, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r7iz.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R7IZ_XLARGE2
   */
  public static readonly MEMORY7_INTEL_XLARGE2 = InstanceType.of(InstanceClass.MEMORY7_INTEL, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r7iz.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_XLARGE32
   */
  public static readonly R7IZ_XLARGE32 = InstanceType.of(InstanceClass.R7IZ, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `r7iz.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.R7IZ_XLARGE32
   */
  public static readonly MEMORY7_INTEL_XLARGE32 = InstanceType.of(InstanceClass.MEMORY7_INTEL, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `r7iz.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_XLARGE4
   */
  public static readonly R7IZ_XLARGE4 = InstanceType.of(InstanceClass.R7IZ, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r7iz.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R7IZ_XLARGE4
   */
  public static readonly MEMORY7_INTEL_XLARGE4 = InstanceType.of(InstanceClass.MEMORY7_INTEL, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r7iz.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_XLARGE8
   */
  public static readonly R7IZ_XLARGE8 = InstanceType.of(InstanceClass.R7IZ, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r7iz.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R7IZ_XLARGE8
   */
  public static readonly MEMORY7_INTEL_XLARGE8 = InstanceType.of(InstanceClass.MEMORY7_INTEL, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r7iz.large`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_LARGE
   */
  public static readonly R7IZ_LARGE = InstanceType.of(InstanceClass.R7IZ, InstanceSize.LARGE);

  /**
   * **Instance type**: `r7iz.large`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R7IZ_LARGE
   */
  public static readonly MEMORY7_INTEL_LARGE = InstanceType.of(InstanceClass.MEMORY7_INTEL, InstanceSize.LARGE);

  /**
   * **Instance type**: `r7iz.metal-16xl`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE16METAL}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_XLARGE16METAL
   */
  public static readonly R7IZ_XLARGE16METAL = InstanceType.of(InstanceClass.R7IZ, InstanceSize.XLARGE16METAL);

  /**
   * **Instance type**: `r7iz.metal-16xl`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE16METAL}
   *
   * @alias NamedInstanceType.R7IZ_XLARGE16METAL
   */
  public static readonly MEMORY7_INTEL_XLARGE16METAL = InstanceType.of(InstanceClass.MEMORY7_INTEL, InstanceSize.XLARGE16METAL);

  /**
   * **Instance type**: `r7iz.metal-32xl`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE32METAL}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_XLARGE32METAL
   */
  public static readonly R7IZ_XLARGE32METAL = InstanceType.of(InstanceClass.R7IZ, InstanceSize.XLARGE32METAL);

  /**
   * **Instance type**: `r7iz.metal-32xl`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE32METAL}
   *
   * @alias NamedInstanceType.R7IZ_XLARGE32METAL
   */
  public static readonly MEMORY7_INTEL_XLARGE32METAL = InstanceType.of(InstanceClass.MEMORY7_INTEL, InstanceSize.XLARGE32METAL);

  /**
   * **Instance type**: `r7iz.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY7_INTEL_XLARGE
   */
  public static readonly R7IZ_XLARGE = InstanceType.of(InstanceClass.R7IZ, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r7iz.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R7IZ} Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R7IZ_XLARGE
   */
  public static readonly MEMORY7_INTEL_XLARGE = InstanceType.of(InstanceClass.MEMORY7_INTEL, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r8g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY8_GRAVITON_XLARGE12
   */
  public static readonly R8G_XLARGE12 = InstanceType.of(InstanceClass.R8G, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r8g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.R8G_XLARGE12
   */
  public static readonly MEMORY8_GRAVITON_XLARGE12 = InstanceType.of(InstanceClass.MEMORY8_GRAVITON, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `r8g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY8_GRAVITON_XLARGE16
   */
  public static readonly R8G_XLARGE16 = InstanceType.of(InstanceClass.R8G, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r8g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R8G_XLARGE16
   */
  public static readonly MEMORY8_GRAVITON_XLARGE16 = InstanceType.of(InstanceClass.MEMORY8_GRAVITON, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r8g.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY8_GRAVITON_XLARGE24
   */
  public static readonly R8G_XLARGE24 = InstanceType.of(InstanceClass.R8G, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r8g.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.R8G_XLARGE24
   */
  public static readonly MEMORY8_GRAVITON_XLARGE24 = InstanceType.of(InstanceClass.MEMORY8_GRAVITON, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `r8g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY8_GRAVITON_XLARGE2
   */
  public static readonly R8G_XLARGE2 = InstanceType.of(InstanceClass.R8G, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r8g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.R8G_XLARGE2
   */
  public static readonly MEMORY8_GRAVITON_XLARGE2 = InstanceType.of(InstanceClass.MEMORY8_GRAVITON, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `r8g.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.MEMORY8_GRAVITON_XLARGE48
   */
  public static readonly R8G_XLARGE48 = InstanceType.of(InstanceClass.R8G, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `r8g.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.R8G_XLARGE48
   */
  public static readonly MEMORY8_GRAVITON_XLARGE48 = InstanceType.of(InstanceClass.MEMORY8_GRAVITON, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `r8g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY8_GRAVITON_XLARGE4
   */
  public static readonly R8G_XLARGE4 = InstanceType.of(InstanceClass.R8G, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r8g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.R8G_XLARGE4
   */
  public static readonly MEMORY8_GRAVITON_XLARGE4 = InstanceType.of(InstanceClass.MEMORY8_GRAVITON, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `r8g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY8_GRAVITON_XLARGE8
   */
  public static readonly R8G_XLARGE8 = InstanceType.of(InstanceClass.R8G, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r8g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.R8G_XLARGE8
   */
  public static readonly MEMORY8_GRAVITON_XLARGE8 = InstanceType.of(InstanceClass.MEMORY8_GRAVITON, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `r8g.large`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY8_GRAVITON_LARGE
   */
  public static readonly R8G_LARGE = InstanceType.of(InstanceClass.R8G, InstanceSize.LARGE);

  /**
   * **Instance type**: `r8g.large`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.R8G_LARGE
   */
  public static readonly MEMORY8_GRAVITON_LARGE = InstanceType.of(InstanceClass.MEMORY8_GRAVITON, InstanceSize.LARGE);

  /**
   * **Instance type**: `r8g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.MEMORY8_GRAVITON_MEDIUM
   */
  public static readonly R8G_MEDIUM = InstanceType.of(InstanceClass.R8G, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `r8g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.R8G_MEDIUM
   */
  public static readonly MEMORY8_GRAVITON_MEDIUM = InstanceType.of(InstanceClass.MEMORY8_GRAVITON, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `r8g.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.MEMORY8_GRAVITON_XLARGE24METAL
   */
  public static readonly R8G_XLARGE24METAL = InstanceType.of(InstanceClass.R8G, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `r8g.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.R8G_XLARGE24METAL
   */
  public static readonly MEMORY8_GRAVITON_XLARGE24METAL = InstanceType.of(InstanceClass.MEMORY8_GRAVITON, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `r8g.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.MEMORY8_GRAVITON_XLARGE48METAL
   */
  public static readonly R8G_XLARGE48METAL = InstanceType.of(InstanceClass.R8G, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `r8g.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.R8G_XLARGE48METAL
   */
  public static readonly MEMORY8_GRAVITON_XLARGE48METAL = InstanceType.of(InstanceClass.MEMORY8_GRAVITON, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `r8g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY8_GRAVITON_XLARGE
   */
  public static readonly R8G_XLARGE = InstanceType.of(InstanceClass.R8G, InstanceSize.XLARGE);

  /**
   * **Instance type**: `r8g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R8G} Memory optimized instances with Graviton4 processors
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.R8G_XLARGE
   */
  public static readonly MEMORY8_GRAVITON_XLARGE = InstanceType.of(InstanceClass.MEMORY8_GRAVITON, InstanceSize.XLARGE);

  /**
   * **Instance type**: `t2.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T2} Burstable instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.BURSTABLE2_XLARGE2
   */
  public static readonly T2_XLARGE2 = InstanceType.of(InstanceClass.T2, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `t2.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T2} Burstable instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.T2_XLARGE2
   */
  public static readonly BURSTABLE2_XLARGE2 = InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `t2.large`:
   *
   * * **Instance class**: {@link InstanceClass.T2} Burstable instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.BURSTABLE2_LARGE
   */
  public static readonly T2_LARGE = InstanceType.of(InstanceClass.T2, InstanceSize.LARGE);

  /**
   * **Instance type**: `t2.large`:
   *
   * * **Instance class**: {@link InstanceClass.T2} Burstable instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.T2_LARGE
   */
  public static readonly BURSTABLE2_LARGE = InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.LARGE);

  /**
   * **Instance type**: `t2.medium`:
   *
   * * **Instance class**: {@link InstanceClass.T2} Burstable instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.BURSTABLE2_MEDIUM
   */
  public static readonly T2_MEDIUM = InstanceType.of(InstanceClass.T2, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `t2.medium`:
   *
   * * **Instance class**: {@link InstanceClass.T2} Burstable instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.T2_MEDIUM
   */
  public static readonly BURSTABLE2_MEDIUM = InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `t2.micro`:
   *
   * * **Instance class**: {@link InstanceClass.T2} Burstable instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.MICRO}
   *
   * @alias NamedInstanceType.BURSTABLE2_MICRO
   */
  public static readonly T2_MICRO = InstanceType.of(InstanceClass.T2, InstanceSize.MICRO);

  /**
   * **Instance type**: `t2.micro`:
   *
   * * **Instance class**: {@link InstanceClass.T2} Burstable instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.MICRO}
   *
   * @alias NamedInstanceType.T2_MICRO
   */
  public static readonly BURSTABLE2_MICRO = InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MICRO);

  /**
   * **Instance type**: `t2.nano`:
   *
   * * **Instance class**: {@link InstanceClass.T2} Burstable instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.NANO}
   *
   * @alias NamedInstanceType.BURSTABLE2_NANO
   */
  public static readonly T2_NANO = InstanceType.of(InstanceClass.T2, InstanceSize.NANO);

  /**
   * **Instance type**: `t2.nano`:
   *
   * * **Instance class**: {@link InstanceClass.T2} Burstable instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.NANO}
   *
   * @alias NamedInstanceType.T2_NANO
   */
  public static readonly BURSTABLE2_NANO = InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.NANO);

  /**
   * **Instance type**: `t2.small`:
   *
   * * **Instance class**: {@link InstanceClass.T2} Burstable instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.SMALL}
   *
   * @alias NamedInstanceType.BURSTABLE2_SMALL
   */
  public static readonly T2_SMALL = InstanceType.of(InstanceClass.T2, InstanceSize.SMALL);

  /**
   * **Instance type**: `t2.small`:
   *
   * * **Instance class**: {@link InstanceClass.T2} Burstable instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.SMALL}
   *
   * @alias NamedInstanceType.T2_SMALL
   */
  public static readonly BURSTABLE2_SMALL = InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.SMALL);

  /**
   * **Instance type**: `t2.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T2} Burstable instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.BURSTABLE2_XLARGE
   */
  public static readonly T2_XLARGE = InstanceType.of(InstanceClass.T2, InstanceSize.XLARGE);

  /**
   * **Instance type**: `t2.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T2} Burstable instances, 2nd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.T2_XLARGE
   */
  public static readonly BURSTABLE2_XLARGE = InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.XLARGE);

  /**
   * **Instance type**: `t3.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T3} Burstable instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.BURSTABLE3_XLARGE2
   */
  public static readonly T3_XLARGE2 = InstanceType.of(InstanceClass.T3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `t3.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T3} Burstable instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.T3_XLARGE2
   */
  public static readonly BURSTABLE3_XLARGE2 = InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `t3.large`:
   *
   * * **Instance class**: {@link InstanceClass.T3} Burstable instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.BURSTABLE3_LARGE
   */
  public static readonly T3_LARGE = InstanceType.of(InstanceClass.T3, InstanceSize.LARGE);

  /**
   * **Instance type**: `t3.large`:
   *
   * * **Instance class**: {@link InstanceClass.T3} Burstable instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.T3_LARGE
   */
  public static readonly BURSTABLE3_LARGE = InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.LARGE);

  /**
   * **Instance type**: `t3.medium`:
   *
   * * **Instance class**: {@link InstanceClass.T3} Burstable instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.BURSTABLE3_MEDIUM
   */
  public static readonly T3_MEDIUM = InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `t3.medium`:
   *
   * * **Instance class**: {@link InstanceClass.T3} Burstable instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.T3_MEDIUM
   */
  public static readonly BURSTABLE3_MEDIUM = InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `t3.micro`:
   *
   * * **Instance class**: {@link InstanceClass.T3} Burstable instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.MICRO}
   *
   * @alias NamedInstanceType.BURSTABLE3_MICRO
   */
  public static readonly T3_MICRO = InstanceType.of(InstanceClass.T3, InstanceSize.MICRO);

  /**
   * **Instance type**: `t3.micro`:
   *
   * * **Instance class**: {@link InstanceClass.T3} Burstable instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.MICRO}
   *
   * @alias NamedInstanceType.T3_MICRO
   */
  public static readonly BURSTABLE3_MICRO = InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.MICRO);

  /**
   * **Instance type**: `t3.nano`:
   *
   * * **Instance class**: {@link InstanceClass.T3} Burstable instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.NANO}
   *
   * @alias NamedInstanceType.BURSTABLE3_NANO
   */
  public static readonly T3_NANO = InstanceType.of(InstanceClass.T3, InstanceSize.NANO);

  /**
   * **Instance type**: `t3.nano`:
   *
   * * **Instance class**: {@link InstanceClass.T3} Burstable instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.NANO}
   *
   * @alias NamedInstanceType.T3_NANO
   */
  public static readonly BURSTABLE3_NANO = InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.NANO);

  /**
   * **Instance type**: `t3.small`:
   *
   * * **Instance class**: {@link InstanceClass.T3} Burstable instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.SMALL}
   *
   * @alias NamedInstanceType.BURSTABLE3_SMALL
   */
  public static readonly T3_SMALL = InstanceType.of(InstanceClass.T3, InstanceSize.SMALL);

  /**
   * **Instance type**: `t3.small`:
   *
   * * **Instance class**: {@link InstanceClass.T3} Burstable instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.SMALL}
   *
   * @alias NamedInstanceType.T3_SMALL
   */
  public static readonly BURSTABLE3_SMALL = InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.SMALL);

  /**
   * **Instance type**: `t3.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T3} Burstable instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.BURSTABLE3_XLARGE
   */
  public static readonly T3_XLARGE = InstanceType.of(InstanceClass.T3, InstanceSize.XLARGE);

  /**
   * **Instance type**: `t3.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T3} Burstable instances, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.T3_XLARGE
   */
  public static readonly BURSTABLE3_XLARGE = InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.XLARGE);

  /**
   * **Instance type**: `t3a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T3A} Burstable instances based on AMD EPYC, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.BURSTABLE3_AMD_XLARGE2
   */
  public static readonly T3A_XLARGE2 = InstanceType.of(InstanceClass.T3A, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `t3a.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T3A} Burstable instances based on AMD EPYC, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.T3A_XLARGE2
   */
  public static readonly BURSTABLE3_AMD_XLARGE2 = InstanceType.of(InstanceClass.BURSTABLE3_AMD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `t3a.large`:
   *
   * * **Instance class**: {@link InstanceClass.T3A} Burstable instances based on AMD EPYC, 3rd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.BURSTABLE3_AMD_LARGE
   */
  public static readonly T3A_LARGE = InstanceType.of(InstanceClass.T3A, InstanceSize.LARGE);

  /**
   * **Instance type**: `t3a.large`:
   *
   * * **Instance class**: {@link InstanceClass.T3A} Burstable instances based on AMD EPYC, 3rd generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.T3A_LARGE
   */
  public static readonly BURSTABLE3_AMD_LARGE = InstanceType.of(InstanceClass.BURSTABLE3_AMD, InstanceSize.LARGE);

  /**
   * **Instance type**: `t3a.medium`:
   *
   * * **Instance class**: {@link InstanceClass.T3A} Burstable instances based on AMD EPYC, 3rd generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.BURSTABLE3_AMD_MEDIUM
   */
  public static readonly T3A_MEDIUM = InstanceType.of(InstanceClass.T3A, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `t3a.medium`:
   *
   * * **Instance class**: {@link InstanceClass.T3A} Burstable instances based on AMD EPYC, 3rd generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.T3A_MEDIUM
   */
  public static readonly BURSTABLE3_AMD_MEDIUM = InstanceType.of(InstanceClass.BURSTABLE3_AMD, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `t3a.micro`:
   *
   * * **Instance class**: {@link InstanceClass.T3A} Burstable instances based on AMD EPYC, 3rd generation
   * * **Instance size**: {@link InstanceSize.MICRO}
   *
   * @alias NamedInstanceType.BURSTABLE3_AMD_MICRO
   */
  public static readonly T3A_MICRO = InstanceType.of(InstanceClass.T3A, InstanceSize.MICRO);

  /**
   * **Instance type**: `t3a.micro`:
   *
   * * **Instance class**: {@link InstanceClass.T3A} Burstable instances based on AMD EPYC, 3rd generation
   * * **Instance size**: {@link InstanceSize.MICRO}
   *
   * @alias NamedInstanceType.T3A_MICRO
   */
  public static readonly BURSTABLE3_AMD_MICRO = InstanceType.of(InstanceClass.BURSTABLE3_AMD, InstanceSize.MICRO);

  /**
   * **Instance type**: `t3a.nano`:
   *
   * * **Instance class**: {@link InstanceClass.T3A} Burstable instances based on AMD EPYC, 3rd generation
   * * **Instance size**: {@link InstanceSize.NANO}
   *
   * @alias NamedInstanceType.BURSTABLE3_AMD_NANO
   */
  public static readonly T3A_NANO = InstanceType.of(InstanceClass.T3A, InstanceSize.NANO);

  /**
   * **Instance type**: `t3a.nano`:
   *
   * * **Instance class**: {@link InstanceClass.T3A} Burstable instances based on AMD EPYC, 3rd generation
   * * **Instance size**: {@link InstanceSize.NANO}
   *
   * @alias NamedInstanceType.T3A_NANO
   */
  public static readonly BURSTABLE3_AMD_NANO = InstanceType.of(InstanceClass.BURSTABLE3_AMD, InstanceSize.NANO);

  /**
   * **Instance type**: `t3a.small`:
   *
   * * **Instance class**: {@link InstanceClass.T3A} Burstable instances based on AMD EPYC, 3rd generation
   * * **Instance size**: {@link InstanceSize.SMALL}
   *
   * @alias NamedInstanceType.BURSTABLE3_AMD_SMALL
   */
  public static readonly T3A_SMALL = InstanceType.of(InstanceClass.T3A, InstanceSize.SMALL);

  /**
   * **Instance type**: `t3a.small`:
   *
   * * **Instance class**: {@link InstanceClass.T3A} Burstable instances based on AMD EPYC, 3rd generation
   * * **Instance size**: {@link InstanceSize.SMALL}
   *
   * @alias NamedInstanceType.T3A_SMALL
   */
  public static readonly BURSTABLE3_AMD_SMALL = InstanceType.of(InstanceClass.BURSTABLE3_AMD, InstanceSize.SMALL);

  /**
   * **Instance type**: `t3a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T3A} Burstable instances based on AMD EPYC, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.BURSTABLE3_AMD_XLARGE
   */
  public static readonly T3A_XLARGE = InstanceType.of(InstanceClass.T3A, InstanceSize.XLARGE);

  /**
   * **Instance type**: `t3a.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T3A} Burstable instances based on AMD EPYC, 3rd generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.T3A_XLARGE
   */
  public static readonly BURSTABLE3_AMD_XLARGE = InstanceType.of(InstanceClass.BURSTABLE3_AMD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `t4g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T4G} Burstable instances, 4th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.BURSTABLE4_GRAVITON_XLARGE2
   */
  public static readonly T4G_XLARGE2 = InstanceType.of(InstanceClass.T4G, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `t4g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T4G} Burstable instances, 4th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.T4G_XLARGE2
   */
  public static readonly BURSTABLE4_GRAVITON_XLARGE2 = InstanceType.of(InstanceClass.BURSTABLE4_GRAVITON, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `t4g.large`:
   *
   * * **Instance class**: {@link InstanceClass.T4G} Burstable instances, 4th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.BURSTABLE4_GRAVITON_LARGE
   */
  public static readonly T4G_LARGE = InstanceType.of(InstanceClass.T4G, InstanceSize.LARGE);

  /**
   * **Instance type**: `t4g.large`:
   *
   * * **Instance class**: {@link InstanceClass.T4G} Burstable instances, 4th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.T4G_LARGE
   */
  public static readonly BURSTABLE4_GRAVITON_LARGE = InstanceType.of(InstanceClass.BURSTABLE4_GRAVITON, InstanceSize.LARGE);

  /**
   * **Instance type**: `t4g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.T4G} Burstable instances, 4th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.BURSTABLE4_GRAVITON_MEDIUM
   */
  public static readonly T4G_MEDIUM = InstanceType.of(InstanceClass.T4G, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `t4g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.T4G} Burstable instances, 4th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.T4G_MEDIUM
   */
  public static readonly BURSTABLE4_GRAVITON_MEDIUM = InstanceType.of(InstanceClass.BURSTABLE4_GRAVITON, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `t4g.micro`:
   *
   * * **Instance class**: {@link InstanceClass.T4G} Burstable instances, 4th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.MICRO}
   *
   * @alias NamedInstanceType.BURSTABLE4_GRAVITON_MICRO
   */
  public static readonly T4G_MICRO = InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO);

  /**
   * **Instance type**: `t4g.micro`:
   *
   * * **Instance class**: {@link InstanceClass.T4G} Burstable instances, 4th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.MICRO}
   *
   * @alias NamedInstanceType.T4G_MICRO
   */
  public static readonly BURSTABLE4_GRAVITON_MICRO = InstanceType.of(InstanceClass.BURSTABLE4_GRAVITON, InstanceSize.MICRO);

  /**
   * **Instance type**: `t4g.nano`:
   *
   * * **Instance class**: {@link InstanceClass.T4G} Burstable instances, 4th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.NANO}
   *
   * @alias NamedInstanceType.BURSTABLE4_GRAVITON_NANO
   */
  public static readonly T4G_NANO = InstanceType.of(InstanceClass.T4G, InstanceSize.NANO);

  /**
   * **Instance type**: `t4g.nano`:
   *
   * * **Instance class**: {@link InstanceClass.T4G} Burstable instances, 4th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.NANO}
   *
   * @alias NamedInstanceType.T4G_NANO
   */
  public static readonly BURSTABLE4_GRAVITON_NANO = InstanceType.of(InstanceClass.BURSTABLE4_GRAVITON, InstanceSize.NANO);

  /**
   * **Instance type**: `t4g.small`:
   *
   * * **Instance class**: {@link InstanceClass.T4G} Burstable instances, 4th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.SMALL}
   *
   * @alias NamedInstanceType.BURSTABLE4_GRAVITON_SMALL
   */
  public static readonly T4G_SMALL = InstanceType.of(InstanceClass.T4G, InstanceSize.SMALL);

  /**
   * **Instance type**: `t4g.small`:
   *
   * * **Instance class**: {@link InstanceClass.T4G} Burstable instances, 4th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.SMALL}
   *
   * @alias NamedInstanceType.T4G_SMALL
   */
  public static readonly BURSTABLE4_GRAVITON_SMALL = InstanceType.of(InstanceClass.BURSTABLE4_GRAVITON, InstanceSize.SMALL);

  /**
   * **Instance type**: `t4g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T4G} Burstable instances, 4th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.BURSTABLE4_GRAVITON_XLARGE
   */
  public static readonly T4G_XLARGE = InstanceType.of(InstanceClass.T4G, InstanceSize.XLARGE);

  /**
   * **Instance type**: `t4g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.T4G} Burstable instances, 4th generation with Graviton2 processors
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.T4G_XLARGE
   */
  public static readonly BURSTABLE4_GRAVITON_XLARGE = InstanceType.of(InstanceClass.BURSTABLE4_GRAVITON, InstanceSize.XLARGE);

  /**
   * **Instance type**: `trn1.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.TRN1} High performance computing powered by AWS Trainium
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.TRAINING_ACCELERATOR1_XLARGE2
   */
  public static readonly TRN1_XLARGE2 = InstanceType.of(InstanceClass.TRN1, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `trn1.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.TRN1} High performance computing powered by AWS Trainium
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.TRN1_XLARGE2
   */
  public static readonly TRAINING_ACCELERATOR1_XLARGE2 = InstanceType.of(InstanceClass.TRAINING_ACCELERATOR1, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `trn1.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.TRN1} High performance computing powered by AWS Trainium
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.TRAINING_ACCELERATOR1_XLARGE32
   */
  public static readonly TRN1_XLARGE32 = InstanceType.of(InstanceClass.TRN1, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `trn1.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.TRN1} High performance computing powered by AWS Trainium
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.TRN1_XLARGE32
   */
  public static readonly TRAINING_ACCELERATOR1_XLARGE32 = InstanceType.of(InstanceClass.TRAINING_ACCELERATOR1, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `trn1n.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.TRN1N} Network-optimized high performance computing powered by AWS Trainium
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.TRAINING_ACCELERATOR1_ENHANCED_NETWORK_XLARGE32
   */
  public static readonly TRN1N_XLARGE32 = InstanceType.of(InstanceClass.TRN1N, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `trn1n.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.TRN1N} Network-optimized high performance computing powered by AWS Trainium
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.TRN1N_XLARGE32
   */
  public static readonly TRAINING_ACCELERATOR1_ENHANCED_NETWORK_XLARGE32 = InstanceType.of(InstanceClass.TRAINING_ACCELERATOR1_ENHANCED_NETWORK, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `u-12tb1.112xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U_12TB1} High memory instances (12TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE112}
   *
   * @alias NamedInstanceType.HIGH_MEMORY_12TB_1_XLARGE112
   */
  public static readonly U_12TB1_XLARGE112 = InstanceType.of(InstanceClass.U_12TB1, InstanceSize.XLARGE112);

  /**
   * **Instance type**: `u-12tb1.112xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U_12TB1} High memory instances (12TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE112}
   *
   * @alias NamedInstanceType.U_12TB1_XLARGE112
   */
  public static readonly HIGH_MEMORY_12TB_1_XLARGE112 = InstanceType.of(InstanceClass.HIGH_MEMORY_12TB_1, InstanceSize.XLARGE112);

  /**
   * **Instance type**: `u-18tb1.112xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U_18TB1} High memory instances (18TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE112}
   *
   * @alias NamedInstanceType.HIGH_MEMORY_18TB_1_XLARGE112
   */
  public static readonly U_18TB1_XLARGE112 = InstanceType.of(InstanceClass.U_18TB1, InstanceSize.XLARGE112);

  /**
   * **Instance type**: `u-18tb1.112xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U_18TB1} High memory instances (18TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE112}
   *
   * @alias NamedInstanceType.U_18TB1_XLARGE112
   */
  public static readonly HIGH_MEMORY_18TB_1_XLARGE112 = InstanceType.of(InstanceClass.HIGH_MEMORY_18TB_1, InstanceSize.XLARGE112);

  /**
   * **Instance type**: `u-24tb1.112xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U_24TB1} High memory instances (24TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE112}
   *
   * @alias NamedInstanceType.HIGH_MEMORY_24TB_1_XLARGE112
   */
  public static readonly U_24TB1_XLARGE112 = InstanceType.of(InstanceClass.U_24TB1, InstanceSize.XLARGE112);

  /**
   * **Instance type**: `u-24tb1.112xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U_24TB1} High memory instances (24TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE112}
   *
   * @alias NamedInstanceType.U_24TB1_XLARGE112
   */
  public static readonly HIGH_MEMORY_24TB_1_XLARGE112 = InstanceType.of(InstanceClass.HIGH_MEMORY_24TB_1, InstanceSize.XLARGE112);

  /**
   * **Instance type**: `u-3tb1.56xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U_3TB1} High memory instances (3TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE56}
   *
   * @alias NamedInstanceType.HIGH_MEMORY_3TB_1_XLARGE56
   */
  public static readonly U_3TB1_XLARGE56 = InstanceType.of(InstanceClass.U_3TB1, InstanceSize.XLARGE56);

  /**
   * **Instance type**: `u-3tb1.56xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U_3TB1} High memory instances (3TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE56}
   *
   * @alias NamedInstanceType.U_3TB1_XLARGE56
   */
  public static readonly HIGH_MEMORY_3TB_1_XLARGE56 = InstanceType.of(InstanceClass.HIGH_MEMORY_3TB_1, InstanceSize.XLARGE56);

  /**
   * **Instance type**: `u-6tb1.112xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U_6TB1} High memory instances (6TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE112}
   *
   * @alias NamedInstanceType.HIGH_MEMORY_6TB_1_XLARGE112
   */
  public static readonly U_6TB1_XLARGE112 = InstanceType.of(InstanceClass.U_6TB1, InstanceSize.XLARGE112);

  /**
   * **Instance type**: `u-6tb1.112xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U_6TB1} High memory instances (6TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE112}
   *
   * @alias NamedInstanceType.U_6TB1_XLARGE112
   */
  public static readonly HIGH_MEMORY_6TB_1_XLARGE112 = InstanceType.of(InstanceClass.HIGH_MEMORY_6TB_1, InstanceSize.XLARGE112);

  /**
   * **Instance type**: `u-6tb1.56xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U_6TB1} High memory instances (6TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE56}
   *
   * @alias NamedInstanceType.HIGH_MEMORY_6TB_1_XLARGE56
   */
  public static readonly U_6TB1_XLARGE56 = InstanceType.of(InstanceClass.U_6TB1, InstanceSize.XLARGE56);

  /**
   * **Instance type**: `u-6tb1.56xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U_6TB1} High memory instances (6TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE56}
   *
   * @alias NamedInstanceType.U_6TB1_XLARGE56
   */
  public static readonly HIGH_MEMORY_6TB_1_XLARGE56 = InstanceType.of(InstanceClass.HIGH_MEMORY_6TB_1, InstanceSize.XLARGE56);

  /**
   * **Instance type**: `u-9tb1.112xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U_9TB1} High memory instances (9TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE112}
   *
   * @alias NamedInstanceType.HIGH_MEMORY_9TB_1_XLARGE112
   */
  public static readonly U_9TB1_XLARGE112 = InstanceType.of(InstanceClass.U_9TB1, InstanceSize.XLARGE112);

  /**
   * **Instance type**: `u-9tb1.112xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U_9TB1} High memory instances (9TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE112}
   *
   * @alias NamedInstanceType.U_9TB1_XLARGE112
   */
  public static readonly HIGH_MEMORY_9TB_1_XLARGE112 = InstanceType.of(InstanceClass.HIGH_MEMORY_9TB_1, InstanceSize.XLARGE112);

  /**
   * **Instance type**: `u7i-12tb.224xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U7I_12TB} High memory instances (12TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE224}
   *
   * @alias NamedInstanceType.HIGH_MEMORY_12TB_7_XLARGE224
   */
  public static readonly U7I_12TB_XLARGE224 = InstanceType.of(InstanceClass.U7I_12TB, InstanceSize.XLARGE224);

  /**
   * **Instance type**: `u7i-12tb.224xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U7I_12TB} High memory instances (12TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE224}
   *
   * @alias NamedInstanceType.U7I_12TB_XLARGE224
   */
  public static readonly HIGH_MEMORY_12TB_7_XLARGE224 = InstanceType.of(InstanceClass.HIGH_MEMORY_12TB_7, InstanceSize.XLARGE224);

  /**
   * **Instance type**: `u7i-6tb.112xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U7I_6TB} High memory instances (6TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE112}
   *
   * @alias NamedInstanceType.HIGH_MEMORY_6TB_7_XLARGE112
   */
  public static readonly U7I_6TB_XLARGE112 = InstanceType.of(InstanceClass.U7I_6TB, InstanceSize.XLARGE112);

  /**
   * **Instance type**: `u7i-6tb.112xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U7I_6TB} High memory instances (6TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE112}
   *
   * @alias NamedInstanceType.U7I_6TB_XLARGE112
   */
  public static readonly HIGH_MEMORY_6TB_7_XLARGE112 = InstanceType.of(InstanceClass.HIGH_MEMORY_6TB_7, InstanceSize.XLARGE112);

  /**
   * **Instance type**: `u7i-8tb.112xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U7I_8TB} High memory instances (8TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE112}
   *
   * @alias NamedInstanceType.HIGH_MEMORY_8TB_7_XLARGE112
   */
  public static readonly U7I_8TB_XLARGE112 = InstanceType.of(InstanceClass.U7I_8TB, InstanceSize.XLARGE112);

  /**
   * **Instance type**: `u7i-8tb.112xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U7I_8TB} High memory instances (8TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE112}
   *
   * @alias NamedInstanceType.U7I_8TB_XLARGE112
   */
  public static readonly HIGH_MEMORY_8TB_7_XLARGE112 = InstanceType.of(InstanceClass.HIGH_MEMORY_8TB_7, InstanceSize.XLARGE112);

  /**
   * **Instance type**: `u7in-16tb.224xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U7IN_16TB} High memory, network-intensive instances (16TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE224}
   *
   * @alias NamedInstanceType.HIGH_MEMORY_HIGH_NETWORK_16TB_7_XLARGE224
   */
  public static readonly U7IN_16TB_XLARGE224 = InstanceType.of(InstanceClass.U7IN_16TB, InstanceSize.XLARGE224);

  /**
   * **Instance type**: `u7in-16tb.224xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U7IN_16TB} High memory, network-intensive instances (16TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE224}
   *
   * @alias NamedInstanceType.U7IN_16TB_XLARGE224
   */
  public static readonly HIGH_MEMORY_HIGH_NETWORK_16TB_7_XLARGE224 = InstanceType.of(InstanceClass.HIGH_MEMORY_HIGH_NETWORK_16TB_7, InstanceSize.XLARGE224);

  /**
   * **Instance type**: `u7in-24tb.224xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U7IN_24TB} High memory, network-intensive instances (24TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE224}
   *
   * @alias NamedInstanceType.HIGH_MEMORY_HIGH_NETWORK_24TB_7_XLARGE224
   */
  public static readonly U7IN_24TB_XLARGE224 = InstanceType.of(InstanceClass.U7IN_24TB, InstanceSize.XLARGE224);

  /**
   * **Instance type**: `u7in-24tb.224xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U7IN_24TB} High memory, network-intensive instances (24TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE224}
   *
   * @alias NamedInstanceType.U7IN_24TB_XLARGE224
   */
  public static readonly HIGH_MEMORY_HIGH_NETWORK_24TB_7_XLARGE224 = InstanceType.of(InstanceClass.HIGH_MEMORY_HIGH_NETWORK_24TB_7, InstanceSize.XLARGE224);

  /**
   * **Instance type**: `u7in-32tb.224xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U7IN_32TB} High memory, network-intensive instances (32TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE224}
   *
   * @alias NamedInstanceType.HIGH_MEMORY_HIGH_NETWORK_32TB_7_XLARGE224
   */
  public static readonly U7IN_32TB_XLARGE224 = InstanceType.of(InstanceClass.U7IN_32TB, InstanceSize.XLARGE224);

  /**
   * **Instance type**: `u7in-32tb.224xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.U7IN_32TB} High memory, network-intensive instances (32TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   * * **Instance size**: {@link InstanceSize.XLARGE224}
   *
   * @alias NamedInstanceType.U7IN_32TB_XLARGE224
   */
  public static readonly HIGH_MEMORY_HIGH_NETWORK_32TB_7_XLARGE224 = InstanceType.of(InstanceClass.HIGH_MEMORY_HIGH_NETWORK_32TB_7, InstanceSize.XLARGE224);

  /**
   * **Instance type**: `vt1.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.VT1} Multi-stream video transcoding instances for resolutions up to 4K UHD, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.VIDEO_TRANSCODING1_XLARGE24
   */
  public static readonly VT1_XLARGE24 = InstanceType.of(InstanceClass.VT1, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `vt1.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.VT1} Multi-stream video transcoding instances for resolutions up to 4K UHD, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.VT1_XLARGE24
   */
  public static readonly VIDEO_TRANSCODING1_XLARGE24 = InstanceType.of(InstanceClass.VIDEO_TRANSCODING1, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `vt1.3xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.VT1} Multi-stream video transcoding instances for resolutions up to 4K UHD, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE3}
   *
   * @alias NamedInstanceType.VIDEO_TRANSCODING1_XLARGE3
   */
  public static readonly VT1_XLARGE3 = InstanceType.of(InstanceClass.VT1, InstanceSize.XLARGE3);

  /**
   * **Instance type**: `vt1.3xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.VT1} Multi-stream video transcoding instances for resolutions up to 4K UHD, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE3}
   *
   * @alias NamedInstanceType.VT1_XLARGE3
   */
  public static readonly VIDEO_TRANSCODING1_XLARGE3 = InstanceType.of(InstanceClass.VIDEO_TRANSCODING1, InstanceSize.XLARGE3);

  /**
   * **Instance type**: `vt1.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.VT1} Multi-stream video transcoding instances for resolutions up to 4K UHD, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.VIDEO_TRANSCODING1_XLARGE6
   */
  public static readonly VT1_XLARGE6 = InstanceType.of(InstanceClass.VT1, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `vt1.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.VT1} Multi-stream video transcoding instances for resolutions up to 4K UHD, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.VT1_XLARGE6
   */
  public static readonly VIDEO_TRANSCODING1_XLARGE6 = InstanceType.of(InstanceClass.VIDEO_TRANSCODING1, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `x1.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1} Memory-intensive instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_1_XLARGE16
   */
  public static readonly X1_XLARGE16 = InstanceType.of(InstanceClass.X1, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `x1.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1} Memory-intensive instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.X1_XLARGE16
   */
  public static readonly MEMORY_INTENSIVE_1_XLARGE16 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_1, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `x1.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1} Memory-intensive instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_1_XLARGE32
   */
  public static readonly X1_XLARGE32 = InstanceType.of(InstanceClass.X1, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `x1.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1} Memory-intensive instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.X1_XLARGE32
   */
  public static readonly MEMORY_INTENSIVE_1_XLARGE32 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_1, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `x1e.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1E} Memory-intensive instances, extended, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_1_EXTENDED_XLARGE16
   */
  public static readonly X1E_XLARGE16 = InstanceType.of(InstanceClass.X1E, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `x1e.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1E} Memory-intensive instances, extended, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.X1E_XLARGE16
   */
  public static readonly MEMORY_INTENSIVE_1_EXTENDED_XLARGE16 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_1_EXTENDED, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `x1e.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1E} Memory-intensive instances, extended, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_1_EXTENDED_XLARGE2
   */
  public static readonly X1E_XLARGE2 = InstanceType.of(InstanceClass.X1E, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `x1e.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1E} Memory-intensive instances, extended, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.X1E_XLARGE2
   */
  public static readonly MEMORY_INTENSIVE_1_EXTENDED_XLARGE2 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_1_EXTENDED, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `x1e.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1E} Memory-intensive instances, extended, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_1_EXTENDED_XLARGE32
   */
  public static readonly X1E_XLARGE32 = InstanceType.of(InstanceClass.X1E, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `x1e.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1E} Memory-intensive instances, extended, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.X1E_XLARGE32
   */
  public static readonly MEMORY_INTENSIVE_1_EXTENDED_XLARGE32 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_1_EXTENDED, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `x1e.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1E} Memory-intensive instances, extended, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_1_EXTENDED_XLARGE4
   */
  public static readonly X1E_XLARGE4 = InstanceType.of(InstanceClass.X1E, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `x1e.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1E} Memory-intensive instances, extended, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.X1E_XLARGE4
   */
  public static readonly MEMORY_INTENSIVE_1_EXTENDED_XLARGE4 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_1_EXTENDED, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `x1e.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1E} Memory-intensive instances, extended, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_1_EXTENDED_XLARGE8
   */
  public static readonly X1E_XLARGE8 = InstanceType.of(InstanceClass.X1E, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `x1e.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1E} Memory-intensive instances, extended, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.X1E_XLARGE8
   */
  public static readonly MEMORY_INTENSIVE_1_EXTENDED_XLARGE8 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_1_EXTENDED, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `x1e.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1E} Memory-intensive instances, extended, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_1_EXTENDED_XLARGE
   */
  public static readonly X1E_XLARGE = InstanceType.of(InstanceClass.X1E, InstanceSize.XLARGE);

  /**
   * **Instance type**: `x1e.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X1E} Memory-intensive instances, extended, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.X1E_XLARGE
   */
  public static readonly MEMORY_INTENSIVE_1_EXTENDED_XLARGE = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_1_EXTENDED, InstanceSize.XLARGE);

  /**
   * **Instance type**: `x2gd.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_XLARGE12
   */
  public static readonly X2GD_XLARGE12 = InstanceType.of(InstanceClass.X2GD, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `x2gd.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.X2GD_XLARGE12
   */
  public static readonly MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_XLARGE12 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `x2gd.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_XLARGE16
   */
  public static readonly X2GD_XLARGE16 = InstanceType.of(InstanceClass.X2GD, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `x2gd.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.X2GD_XLARGE16
   */
  public static readonly MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_XLARGE16 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `x2gd.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_XLARGE2
   */
  public static readonly X2GD_XLARGE2 = InstanceType.of(InstanceClass.X2GD, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `x2gd.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.X2GD_XLARGE2
   */
  public static readonly MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_XLARGE2 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `x2gd.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_XLARGE4
   */
  public static readonly X2GD_XLARGE4 = InstanceType.of(InstanceClass.X2GD, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `x2gd.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.X2GD_XLARGE4
   */
  public static readonly MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_XLARGE4 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `x2gd.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_XLARGE8
   */
  public static readonly X2GD_XLARGE8 = InstanceType.of(InstanceClass.X2GD, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `x2gd.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.X2GD_XLARGE8
   */
  public static readonly MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_XLARGE8 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `x2gd.large`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_LARGE
   */
  public static readonly X2GD_LARGE = InstanceType.of(InstanceClass.X2GD, InstanceSize.LARGE);

  /**
   * **Instance type**: `x2gd.large`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.X2GD_LARGE
   */
  public static readonly MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_LARGE = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE, InstanceSize.LARGE);

  /**
   * **Instance type**: `x2gd.medium`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_MEDIUM
   */
  public static readonly X2GD_MEDIUM = InstanceType.of(InstanceClass.X2GD, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `x2gd.medium`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.X2GD_MEDIUM
   */
  public static readonly MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_MEDIUM = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `x2gd.metal`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_METAL
   */
  public static readonly X2GD_METAL = InstanceType.of(InstanceClass.X2GD, InstanceSize.METAL);

  /**
   * **Instance type**: `x2gd.metal`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.X2GD_METAL
   */
  public static readonly MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_METAL = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE, InstanceSize.METAL);

  /**
   * **Instance type**: `x2gd.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_XLARGE
   */
  public static readonly X2GD_XLARGE = InstanceType.of(InstanceClass.X2GD, InstanceSize.XLARGE);

  /**
   * **Instance type**: `x2gd.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2GD} Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.X2GD_XLARGE
   */
  public static readonly MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE_XLARGE = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE, InstanceSize.XLARGE);

  /**
   * **Instance type**: `x2idn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IDN} Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_INTEL_XLARGE16
   */
  public static readonly X2IDN_XLARGE16 = InstanceType.of(InstanceClass.X2IDN, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `x2idn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IDN} Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.X2IDN_XLARGE16
   */
  public static readonly MEMORY_INTENSIVE_2_INTEL_XLARGE16 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_INTEL, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `x2idn.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IDN} Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_INTEL_XLARGE24
   */
  public static readonly X2IDN_XLARGE24 = InstanceType.of(InstanceClass.X2IDN, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `x2idn.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IDN} Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.X2IDN_XLARGE24
   */
  public static readonly MEMORY_INTENSIVE_2_INTEL_XLARGE24 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_INTEL, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `x2idn.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IDN} Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_INTEL_XLARGE32
   */
  public static readonly X2IDN_XLARGE32 = InstanceType.of(InstanceClass.X2IDN, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `x2idn.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IDN} Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.X2IDN_XLARGE32
   */
  public static readonly MEMORY_INTENSIVE_2_INTEL_XLARGE32 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_INTEL, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `x2idn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.X2IDN} Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_INTEL_METAL
   */
  public static readonly X2IDN_METAL = InstanceType.of(InstanceClass.X2IDN, InstanceSize.METAL);

  /**
   * **Instance type**: `x2idn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.X2IDN} Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.X2IDN_METAL
   */
  public static readonly MEMORY_INTENSIVE_2_INTEL_METAL = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_INTEL, InstanceSize.METAL);

  /**
   * **Instance type**: `x2iedn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_XT_INTEL_XLARGE16
   */
  public static readonly X2IEDN_XLARGE16 = InstanceType.of(InstanceClass.X2IEDN, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `x2iedn.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.X2IEDN_XLARGE16
   */
  public static readonly MEMORY_INTENSIVE_2_XT_INTEL_XLARGE16 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_XT_INTEL, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `x2iedn.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_XT_INTEL_XLARGE24
   */
  public static readonly X2IEDN_XLARGE24 = InstanceType.of(InstanceClass.X2IEDN, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `x2iedn.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.X2IEDN_XLARGE24
   */
  public static readonly MEMORY_INTENSIVE_2_XT_INTEL_XLARGE24 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_XT_INTEL, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `x2iedn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_XT_INTEL_XLARGE2
   */
  public static readonly X2IEDN_XLARGE2 = InstanceType.of(InstanceClass.X2IEDN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `x2iedn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.X2IEDN_XLARGE2
   */
  public static readonly MEMORY_INTENSIVE_2_XT_INTEL_XLARGE2 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_XT_INTEL, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `x2iedn.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_XT_INTEL_XLARGE32
   */
  public static readonly X2IEDN_XLARGE32 = InstanceType.of(InstanceClass.X2IEDN, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `x2iedn.32xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE32}
   *
   * @alias NamedInstanceType.X2IEDN_XLARGE32
   */
  public static readonly MEMORY_INTENSIVE_2_XT_INTEL_XLARGE32 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_XT_INTEL, InstanceSize.XLARGE32);

  /**
   * **Instance type**: `x2iedn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_XT_INTEL_XLARGE4
   */
  public static readonly X2IEDN_XLARGE4 = InstanceType.of(InstanceClass.X2IEDN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `x2iedn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.X2IEDN_XLARGE4
   */
  public static readonly MEMORY_INTENSIVE_2_XT_INTEL_XLARGE4 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_XT_INTEL, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `x2iedn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_XT_INTEL_XLARGE8
   */
  public static readonly X2IEDN_XLARGE8 = InstanceType.of(InstanceClass.X2IEDN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `x2iedn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.X2IEDN_XLARGE8
   */
  public static readonly MEMORY_INTENSIVE_2_XT_INTEL_XLARGE8 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_XT_INTEL, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `x2iedn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_XT_INTEL_METAL
   */
  public static readonly X2IEDN_METAL = InstanceType.of(InstanceClass.X2IEDN, InstanceSize.METAL);

  /**
   * **Instance type**: `x2iedn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.X2IEDN_METAL
   */
  public static readonly MEMORY_INTENSIVE_2_XT_INTEL_METAL = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_XT_INTEL, InstanceSize.METAL);

  /**
   * **Instance type**: `x2iedn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_XT_INTEL_XLARGE
   */
  public static readonly X2IEDN_XLARGE = InstanceType.of(InstanceClass.X2IEDN, InstanceSize.XLARGE);

  /**
   * **Instance type**: `x2iedn.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEDN} Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.X2IEDN_XLARGE
   */
  public static readonly MEMORY_INTENSIVE_2_XT_INTEL_XLARGE = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_XT_INTEL, InstanceSize.XLARGE);

  /**
   * **Instance type**: `x2iezn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEZN} Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_XTZ_INTEL_XLARGE12
   */
  public static readonly X2IEZN_XLARGE12 = InstanceType.of(InstanceClass.X2IEZN, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `x2iezn.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEZN} Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.X2IEZN_XLARGE12
   */
  public static readonly MEMORY_INTENSIVE_2_XTZ_INTEL_XLARGE12 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_XTZ_INTEL, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `x2iezn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEZN} Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_XTZ_INTEL_XLARGE2
   */
  public static readonly X2IEZN_XLARGE2 = InstanceType.of(InstanceClass.X2IEZN, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `x2iezn.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEZN} Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.X2IEZN_XLARGE2
   */
  public static readonly MEMORY_INTENSIVE_2_XTZ_INTEL_XLARGE2 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_XTZ_INTEL, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `x2iezn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEZN} Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_XTZ_INTEL_XLARGE4
   */
  public static readonly X2IEZN_XLARGE4 = InstanceType.of(InstanceClass.X2IEZN, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `x2iezn.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEZN} Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.X2IEZN_XLARGE4
   */
  public static readonly MEMORY_INTENSIVE_2_XTZ_INTEL_XLARGE4 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_XTZ_INTEL, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `x2iezn.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEZN} Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_XTZ_INTEL_XLARGE6
   */
  public static readonly X2IEZN_XLARGE6 = InstanceType.of(InstanceClass.X2IEZN, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `x2iezn.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEZN} Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.X2IEZN_XLARGE6
   */
  public static readonly MEMORY_INTENSIVE_2_XTZ_INTEL_XLARGE6 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_XTZ_INTEL, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `x2iezn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEZN} Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_XTZ_INTEL_XLARGE8
   */
  public static readonly X2IEZN_XLARGE8 = InstanceType.of(InstanceClass.X2IEZN, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `x2iezn.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEZN} Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.X2IEZN_XLARGE8
   */
  public static readonly MEMORY_INTENSIVE_2_XTZ_INTEL_XLARGE8 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_XTZ_INTEL, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `x2iezn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEZN} Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_2_XTZ_INTEL_METAL
   */
  public static readonly X2IEZN_METAL = InstanceType.of(InstanceClass.X2IEZN, InstanceSize.METAL);

  /**
   * **Instance type**: `x2iezn.metal`:
   *
   * * **Instance class**: {@link InstanceClass.X2IEZN} Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.X2IEZN_METAL
   */
  public static readonly MEMORY_INTENSIVE_2_XTZ_INTEL_METAL = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_2_XTZ_INTEL, InstanceSize.METAL);

  /**
   * **Instance type**: `x8g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_8_GRAVITON_XLARGE12
   */
  public static readonly X8G_XLARGE12 = InstanceType.of(InstanceClass.X8G, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `x8g.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.X8G_XLARGE12
   */
  public static readonly MEMORY_INTENSIVE_8_GRAVITON_XLARGE12 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_8_GRAVITON, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `x8g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_8_GRAVITON_XLARGE16
   */
  public static readonly X8G_XLARGE16 = InstanceType.of(InstanceClass.X8G, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `x8g.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.X8G_XLARGE16
   */
  public static readonly MEMORY_INTENSIVE_8_GRAVITON_XLARGE16 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_8_GRAVITON, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `x8g.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_8_GRAVITON_XLARGE24
   */
  public static readonly X8G_XLARGE24 = InstanceType.of(InstanceClass.X8G, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `x8g.24xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24}
   *
   * @alias NamedInstanceType.X8G_XLARGE24
   */
  public static readonly MEMORY_INTENSIVE_8_GRAVITON_XLARGE24 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_8_GRAVITON, InstanceSize.XLARGE24);

  /**
   * **Instance type**: `x8g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_8_GRAVITON_XLARGE2
   */
  public static readonly X8G_XLARGE2 = InstanceType.of(InstanceClass.X8G, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `x8g.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.X8G_XLARGE2
   */
  public static readonly MEMORY_INTENSIVE_8_GRAVITON_XLARGE2 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_8_GRAVITON, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `x8g.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_8_GRAVITON_XLARGE48
   */
  public static readonly X8G_XLARGE48 = InstanceType.of(InstanceClass.X8G, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `x8g.48xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48}
   *
   * @alias NamedInstanceType.X8G_XLARGE48
   */
  public static readonly MEMORY_INTENSIVE_8_GRAVITON_XLARGE48 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_8_GRAVITON, InstanceSize.XLARGE48);

  /**
   * **Instance type**: `x8g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_8_GRAVITON_XLARGE4
   */
  public static readonly X8G_XLARGE4 = InstanceType.of(InstanceClass.X8G, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `x8g.4xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE4}
   *
   * @alias NamedInstanceType.X8G_XLARGE4
   */
  public static readonly MEMORY_INTENSIVE_8_GRAVITON_XLARGE4 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_8_GRAVITON, InstanceSize.XLARGE4);

  /**
   * **Instance type**: `x8g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_8_GRAVITON_XLARGE8
   */
  public static readonly X8G_XLARGE8 = InstanceType.of(InstanceClass.X8G, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `x8g.8xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE8}
   *
   * @alias NamedInstanceType.X8G_XLARGE8
   */
  public static readonly MEMORY_INTENSIVE_8_GRAVITON_XLARGE8 = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_8_GRAVITON, InstanceSize.XLARGE8);

  /**
   * **Instance type**: `x8g.large`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_8_GRAVITON_LARGE
   */
  public static readonly X8G_LARGE = InstanceType.of(InstanceClass.X8G, InstanceSize.LARGE);

  /**
   * **Instance type**: `x8g.large`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.X8G_LARGE
   */
  public static readonly MEMORY_INTENSIVE_8_GRAVITON_LARGE = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_8_GRAVITON, InstanceSize.LARGE);

  /**
   * **Instance type**: `x8g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_8_GRAVITON_MEDIUM
   */
  public static readonly X8G_MEDIUM = InstanceType.of(InstanceClass.X8G, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `x8g.medium`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.MEDIUM}
   *
   * @alias NamedInstanceType.X8G_MEDIUM
   */
  public static readonly MEMORY_INTENSIVE_8_GRAVITON_MEDIUM = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_8_GRAVITON, InstanceSize.MEDIUM);

  /**
   * **Instance type**: `x8g.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_8_GRAVITON_XLARGE24METAL
   */
  public static readonly X8G_XLARGE24METAL = InstanceType.of(InstanceClass.X8G, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `x8g.metal-24xl`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE24METAL}
   *
   * @alias NamedInstanceType.X8G_XLARGE24METAL
   */
  public static readonly MEMORY_INTENSIVE_8_GRAVITON_XLARGE24METAL = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_8_GRAVITON, InstanceSize.XLARGE24METAL);

  /**
   * **Instance type**: `x8g.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_8_GRAVITON_XLARGE48METAL
   */
  public static readonly X8G_XLARGE48METAL = InstanceType.of(InstanceClass.X8G, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `x8g.metal-48xl`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE48METAL}
   *
   * @alias NamedInstanceType.X8G_XLARGE48METAL
   */
  public static readonly MEMORY_INTENSIVE_8_GRAVITON_XLARGE48METAL = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_8_GRAVITON, InstanceSize.XLARGE48METAL);

  /**
   * **Instance type**: `x8g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.MEMORY_INTENSIVE_8_GRAVITON_XLARGE
   */
  public static readonly X8G_XLARGE = InstanceType.of(InstanceClass.X8G, InstanceSize.XLARGE);

  /**
   * **Instance type**: `x8g.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.X8G} Memory-intensive instances powered by Graviton4 processors, 8th generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.X8G_XLARGE
   */
  public static readonly MEMORY_INTENSIVE_8_GRAVITON_XLARGE = InstanceType.of(InstanceClass.MEMORY_INTENSIVE_8_GRAVITON, InstanceSize.XLARGE);

  /**
   * **Instance type**: `z1d.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.Z1D} High memory and compute capacity instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.HIGH_COMPUTE_MEMORY1_XLARGE12
   */
  public static readonly Z1D_XLARGE12 = InstanceType.of(InstanceClass.Z1D, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `z1d.12xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.Z1D} High memory and compute capacity instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE12}
   *
   * @alias NamedInstanceType.Z1D_XLARGE12
   */
  public static readonly HIGH_COMPUTE_MEMORY1_XLARGE12 = InstanceType.of(InstanceClass.HIGH_COMPUTE_MEMORY1, InstanceSize.XLARGE12);

  /**
   * **Instance type**: `z1d.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.Z1D} High memory and compute capacity instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.HIGH_COMPUTE_MEMORY1_XLARGE2
   */
  public static readonly Z1D_XLARGE2 = InstanceType.of(InstanceClass.Z1D, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `z1d.2xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.Z1D} High memory and compute capacity instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE2}
   *
   * @alias NamedInstanceType.Z1D_XLARGE2
   */
  public static readonly HIGH_COMPUTE_MEMORY1_XLARGE2 = InstanceType.of(InstanceClass.HIGH_COMPUTE_MEMORY1, InstanceSize.XLARGE2);

  /**
   * **Instance type**: `z1d.3xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.Z1D} High memory and compute capacity instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE3}
   *
   * @alias NamedInstanceType.HIGH_COMPUTE_MEMORY1_XLARGE3
   */
  public static readonly Z1D_XLARGE3 = InstanceType.of(InstanceClass.Z1D, InstanceSize.XLARGE3);

  /**
   * **Instance type**: `z1d.3xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.Z1D} High memory and compute capacity instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE3}
   *
   * @alias NamedInstanceType.Z1D_XLARGE3
   */
  public static readonly HIGH_COMPUTE_MEMORY1_XLARGE3 = InstanceType.of(InstanceClass.HIGH_COMPUTE_MEMORY1, InstanceSize.XLARGE3);

  /**
   * **Instance type**: `z1d.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.Z1D} High memory and compute capacity instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.HIGH_COMPUTE_MEMORY1_XLARGE6
   */
  public static readonly Z1D_XLARGE6 = InstanceType.of(InstanceClass.Z1D, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `z1d.6xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.Z1D} High memory and compute capacity instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE6}
   *
   * @alias NamedInstanceType.Z1D_XLARGE6
   */
  public static readonly HIGH_COMPUTE_MEMORY1_XLARGE6 = InstanceType.of(InstanceClass.HIGH_COMPUTE_MEMORY1, InstanceSize.XLARGE6);

  /**
   * **Instance type**: `z1d.large`:
   *
   * * **Instance class**: {@link InstanceClass.Z1D} High memory and compute capacity instances, 1st generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.HIGH_COMPUTE_MEMORY1_LARGE
   */
  public static readonly Z1D_LARGE = InstanceType.of(InstanceClass.Z1D, InstanceSize.LARGE);

  /**
   * **Instance type**: `z1d.large`:
   *
   * * **Instance class**: {@link InstanceClass.Z1D} High memory and compute capacity instances, 1st generation
   * * **Instance size**: {@link InstanceSize.LARGE}
   *
   * @alias NamedInstanceType.Z1D_LARGE
   */
  public static readonly HIGH_COMPUTE_MEMORY1_LARGE = InstanceType.of(InstanceClass.HIGH_COMPUTE_MEMORY1, InstanceSize.LARGE);

  /**
   * **Instance type**: `z1d.metal`:
   *
   * * **Instance class**: {@link InstanceClass.Z1D} High memory and compute capacity instances, 1st generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.HIGH_COMPUTE_MEMORY1_METAL
   */
  public static readonly Z1D_METAL = InstanceType.of(InstanceClass.Z1D, InstanceSize.METAL);

  /**
   * **Instance type**: `z1d.metal`:
   *
   * * **Instance class**: {@link InstanceClass.Z1D} High memory and compute capacity instances, 1st generation
   * * **Instance size**: {@link InstanceSize.METAL}
   *
   * @alias NamedInstanceType.Z1D_METAL
   */
  public static readonly HIGH_COMPUTE_MEMORY1_METAL = InstanceType.of(InstanceClass.HIGH_COMPUTE_MEMORY1, InstanceSize.METAL);

  /**
   * **Instance type**: `z1d.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.Z1D} High memory and compute capacity instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.HIGH_COMPUTE_MEMORY1_XLARGE
   */
  public static readonly Z1D_XLARGE = InstanceType.of(InstanceClass.Z1D, InstanceSize.XLARGE);

  /**
   * **Instance type**: `z1d.xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.Z1D} High memory and compute capacity instances, 1st generation
   * * **Instance size**: {@link InstanceSize.XLARGE}
   *
   * @alias NamedInstanceType.Z1D_XLARGE
   */
  public static readonly HIGH_COMPUTE_MEMORY1_XLARGE = InstanceType.of(InstanceClass.HIGH_COMPUTE_MEMORY1, InstanceSize.XLARGE);
}
