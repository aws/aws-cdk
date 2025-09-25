/**
 * Hardware accelerator categories available for EC2 instances.
 *
 * Defines the general type of hardware accelerator that can be attached
 * to an instance, typically used in instance requirement specifications
 * (e.g., GPUs for compute-intensive tasks, FPGAs for custom logic, or
 * inference chips for ML workloads).
 */
export enum AcceleratorType {
  /**
   * Graphics Processing Unit accelerators, such as NVIDIA GPUs.
   * Commonly used for machine learning training, graphics rendering,
   * or high-performance parallel computing.
   */
  GPU = 'gpu',

  /**
   * Field Programmable Gate Array accelerators, such as Xilinx FPGAs.
   * Used for hardware-level customization and specialized workloads.
   */
  FPGA = 'fpga',

  /**
   * Inference accelerators, such as AWS Inferentia.
   * Purpose-built for efficient machine learning inference.
   */
  INFERENCE = 'inference',
}

/**
 * Supported hardware accelerator manufacturers.
 *
 * Restricts instance selection to accelerators from a particular vendor.
 * Useful for choosing specific ecosystems (e.g., NVIDIA CUDA, AWS chips).
 */
export enum AcceleratorManufacturer {
  /** Amazon Web Services (e.g., Inferentia, Trainium accelerators). */
  AWS = 'amazon-web-services',

  /** AMD (e.g., Radeon Pro V520 GPU). */
  AMD = 'amd',

  /** NVIDIA (e.g., A100, V100, T4, K80, M60 GPUs). */
  NVIDIA = 'nvidia',

  /** Xilinx (e.g., VU9P FPGA). */
  XILINX = 'xilinx',
}

/**
 * Specific hardware accelerator models supported by EC2.
 *
 * Defines exact accelerator models that can be required or excluded
 * when selecting instance types.
 */
export enum AcceleratorName {
  /** NVIDIA A100 GPU. */
  A100 = 'a100',

  /** NVIDIA K80 GPU. */
  K80 = 'k80',

  /** NVIDIA M60 GPU. */
  M60 = 'm60',

  /** AMD Radeon Pro V520 GPU. */
  RADEON_PRO_V520 = 'radeon-pro-v520',

  /** NVIDIA T4 GPU. */
  T4 = 't4',

  /** NVIDIA V100 GPU. */
  V100 = 'v100',

  /** Xilinx VU9P FPGA. */
  VU9P = 'vu9p',
}
