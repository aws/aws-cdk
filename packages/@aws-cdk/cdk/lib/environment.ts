/**
 * The deployment environment for a stack.
 */
export interface Environment {
  /**
   * The AWS account ID for this environment.
   * If not specified, the context parameter `default-account` is used.
   */
  readonly account?: string;

  /**
   * The AWS region for this environment.
   * If not specified, the context parameter `default-region` is used.
   */
  readonly region?: string;
}

/**
 * Checks whether two environments are equal.
 * @param left  one of the environments to compare.
 * @param right the other environment.
 * @returns ``true`` if both environments are guaranteed to be in the same account and region.
 */
export function environmentEquals(left: Environment, right: Environment): boolean {
  return left.account === right.account && left.region === right.region;
}
