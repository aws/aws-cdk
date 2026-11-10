/**
 * The host operating system kernel used for builds in a CodeBuild project.
 *
 * The host kernel does not affect the build environment operating system,
 * which is determined by the build image.
 *
 * Only applies to the `LINUX_CONTAINER`, `ARM_CONTAINER`, `LINUX_EC2` and `ARM_EC2`
 * environment types. It is not applicable to Windows, Lambda or Mac environment types.
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/APIReference/API_ProjectEnvironment.html#CodeBuild-Type-ProjectEnvironment-hostKernel
 */
export enum HostKernel {
  /**
   * Runs on an Amazon Linux 2 host (kernel 4.x).
   */
  LINUX_KERNEL_4 = 'LINUX_KERNEL_4',

  /**
   * Runs on an Amazon Linux 2023 host (kernel 6.x).
   */
  LINUX_KERNEL_6 = 'LINUX_KERNEL_6',

  /**
   * Runs on the latest supported host kernel.
   */
  LINUX_KERNEL_LATEST = 'LINUX_KERNEL_LATEST',
}
