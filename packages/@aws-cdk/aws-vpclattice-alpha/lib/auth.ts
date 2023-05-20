/**
 * an authentication type for lattice services and servicenetworks
 */
export declare enum AuthType {
  /**
  * The resource does not use an IAM policy
  */
  NONE = 'NONE',
  /**
  * The resource uses an IAM policy. When this type is used, auth is enabled and an auth policy is required.
  */
  IAM = 'AWS_IAM'
}