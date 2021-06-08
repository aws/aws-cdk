import { FileSet, IFileSet } from './file-set';

export abstract class Step implements IFileSet {

  public abstract readonly primaryOutput?: FileSet;

  public readonly requiredFileSets: FileSet[] = [];

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

  protected requireFileSet(fs: FileSet) {
    this.requiredFileSets.push(fs);
  }
}