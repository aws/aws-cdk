import { ResourceEnvironment as CoreResourceEnvironment } from '../core/lib/resource-environment';
/**
 * Used to indicate that a particular construct has an resource environment
 */
export interface IEnvironmentAware {
  /**
   * The environment this resource belongs to.
   *
   * For resources that are created and managed in a Stack (those created by
   * creating new class instances like `new Role()`, `new Bucket()`, etc.), this
   * is always the same as the environment of the stack they belong to.
   *
   * For referenced resources (those obtained from referencing methods like
   * `Role.fromRoleArn()`, `Bucket.fromBucketName()`, etc.), they might be
   * different than the stack they were imported into.
   */
  readonly env: ResourceEnvironment;
}

/**
 * Represents the environment a given resource lives in.
 *
 * This extends the old definition of `ResourceEnvironment` for backwards
 * compatibility with Java bindings generated from old CDK library versions.
 *
 * Used as the return value for the `IEnvironmentAware.env` property.
 */
export interface ResourceEnvironment extends CoreResourceEnvironment {
}
