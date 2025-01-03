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
   * **Instance type**: `r6id.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_16XLARGE
   */
  public static readonly R6ID_16XLARGE = InstanceType.of(InstanceClass.R6ID, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6id.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * @alias NamedInstanceType.R6ID_16XLARGE
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_16XLARGE = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE, InstanceSize.XLARGE16);
}
