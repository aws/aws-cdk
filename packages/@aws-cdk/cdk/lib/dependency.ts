import { IConstruct } from "./construct";

/**
 * A set of constructs that can be depended upon
 *
 * This interface can be used to take an (ordering) dependency on a set of
 * constructs. An ordering dependency implies that the resources represented by
 * those constructs are deployed before the resources depending ON them are
 * deployed.
 */
export interface IDependable {
  /**
   * The set of constructs that form the root of this dependable
   *
   * All resources under all returned constructs are included in the ordering
   * dependency.
   */
  readonly dependencyRoots: IConstruct[];
}

/**
 * A set of constructs to be used as a dependable
 *
 * This class can be used when a set of constructs which are disjoint in the
 * construct tree needs to be combined to be used as a single dependable.
 */
export class ConcreteDependable implements IDependable {
  private readonly _dependencyRoots = new Array<IConstruct>();

  /**
   * Add a construct to the dependency roots
   */
  public add(construct: IConstruct) {
    this._dependencyRoots.push(construct);
  }

  /**
   * Retrieve the current set of dependency roots
   */
  public get dependencyRoots(): IConstruct[] {
    return this._dependencyRoots;
  }
}