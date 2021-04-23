/**
 * Calculate differences of immutable elements
 */
export class DiffableCollection<T extends Eq<T>> {
  public readonly additions: T[] = [];
  public readonly removals: T[] = [];

  private readonly oldElements: T[] = [];
  private readonly newElements: T[] = [];

  public addOld(...elements: T[]) {
    this.oldElements.push(...elements);
  }

  public addNew(...elements: T[]) {
    this.newElements.push(...elements);
  }

  public calculateDiff() {
    this.additions.push(...difference(this.newElements, this.oldElements));
    this.removals.push(...difference(this.oldElements, this.newElements));
  }

  public get hasChanges() {
    return this.additions.length + this.removals.length > 0;
  }

  public get hasAdditions() {
    return this.additions.length > 0;
  }

  public get hasRemovals() {
    return this.removals.length > 0;
  }
}

/**
 * Things that can be compared to themselves (by value)
 */
interface Eq<T> {
  equal(other: T): boolean;
}

/**
 * Whether a collection contains some element (by value)
 */
function contains<T extends Eq<T>>(element: T, xs: T[]): boolean {
  return xs.some(x => x.equal(element));
}

/**
 * Return collection except for elements
 */
function difference<T extends Eq<T>>(collection: T[], elements: T[]): T[] {
  return collection.filter(x => !contains(x, elements));
}
