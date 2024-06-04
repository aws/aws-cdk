/**
 * Build machine compute type.
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types
 */
export enum ComputeType {
  SMALL = 'BUILD_GENERAL1_SMALL',
  MEDIUM = 'BUILD_GENERAL1_MEDIUM',
  LARGE = 'BUILD_GENERAL1_LARGE',
  X_LARGE = 'BUILD_GENERAL1_XLARGE',
  X2_LARGE = 'BUILD_GENERAL1_2XLARGE',
  LAMBDA_1GB = 'BUILD_LAMBDA_1GB',
  LAMBDA_2GB = 'BUILD_LAMBDA_2GB',
  LAMBDA_4GB = 'BUILD_LAMBDA_4GB',
  LAMBDA_8GB = 'BUILD_LAMBDA_8GB',
  LAMBDA_10GB = 'BUILD_LAMBDA_10GB',
}
