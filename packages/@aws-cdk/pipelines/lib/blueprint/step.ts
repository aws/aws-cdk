import { FileSet, IFileSet } from './file-set';

export abstract class Step implements IFileSet {

  public abstract readonly primaryOutput?: FileSet;

  public readonly requiredFileSets: FileSet[] = [];
  public readonly isSource: boolean = false;

  constructor(public readonly id: string) {
  }

  /**
   * Return the steps this step depends on by its FileSets
   */
  public get dependencySteps(): Step[] {
    return this.requiredFileSets.map(f => f.producer);
  }

  public toString() {
    return `${this.constructor.name}(${this.id})`;
  }

  /**
   * Return an additional (named) output from this step
   */
  public additionalOutput(name: string): FileSet {
    // Default implementation, should be overriden by children
    Array.isArray(name);
    throw new Error(`${this}: step does not produce any outputs`);
  }

  /**
   * Add an additional FileSet to the set of file sets required by this step
   *
   * This will lead to a dependency on the producer of that file set.
   */
  protected requireFileSet(fs: FileSet) {
    this.requiredFileSets.push(fs);
  }
}