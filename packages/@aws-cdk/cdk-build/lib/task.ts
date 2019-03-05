/**
 * Represents a build task
 */
export abstract class Task {
  private depends = new Array<Task>(); // IDs of tasks remining that this task still depends on
  private _completed = false;

  constructor(public readonly id: string) {

  }

  /**
   * Indicates that `depedency` must be built before this task.
   */
  public addDependency(depedency: Task) {
    this.depends.push(depedency);
  }

  public get completed() {
    return this._completed;
  }

  public get waiting() {
    return this.depends.filter(d => !d.completed);
  }

  public get ready() {
    return this.waiting.length === 0;
  }

  public async build() {
    if (!this.ready) {
      throw new Error(`Can't start build, waiting for the following tasks to complete: ${this.waiting.map(t => t.id)}`);
    }

    const ret = await this.execute();

    this._completed = true;
    return ret;
  }

  /**
   * Executes builds for the current task.
   * @returns `true` if the build actually happened, and `false` for no-op (in case of a cached result)
   */
  protected abstract async execute(): Promise<boolean>;

  protected debug(...args: any[]) {
    // tslint:disable-next-line:no-console
    console.error(this.id + ':', ...args);
  }
}

export type TaskConstructor = new(id: string, options: { [key: string]: any }) => Task;