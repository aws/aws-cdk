/**
 * Build environment type.
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types
 */
export enum EnvironmentType {
  /** ARM container */
  ARM_CONTAINER = 'ARM_CONTAINER',
  /** Linux container */
  LINUX_CONTAINER = 'LINUX_CONTAINER',
  /** Linux GPU container */
  LINUX_GPU_CONTAINER = 'LINUX_GPU_CONTAINER',
  /** Windows Server 2019 container */
  WINDOWS_SERVER_2019_CONTAINER = 'WINDOWS_SERVER_2019_CONTAINER',
  /** Windows Server 2022 container */
  WINDOWS_SERVER_2022_CONTAINER = 'WINDOWS_SERVER_2022_CONTAINER',
  /** MacOS ARM container */
  MAC_ARM = 'MAC_ARM',
}
