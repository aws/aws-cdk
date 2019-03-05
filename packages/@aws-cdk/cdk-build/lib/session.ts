// tslint:disable:no-console
import { Task } from './task';

export class BuildSession {
  private readonly tasks: { [id: string]: Task } = {};

  public addTask(task: Task) {
    if (task.id in this.tasks) {
      throw new Error(`There is already a task ${task.id}`);
    }

    this.tasks[task.id] = task;
  }

  public async build() {
    while (!this.completed) {
      for (const task of this.ready) {
        console.error(`${task.id}: start build`);
        await task.build();
        console.error(`${task.id}: end build`);
      }
    }
  }

  /**
   * Returns all tasks that did not complete yet
   */
  public get pending() {
    return Object.values(this.tasks).filter(t => !t.completed).sort((t1, t2) => t1.id.localeCompare(t2.id));
  }

  /**
   * Returns true if the session is complete (no pending tasks)
   */
  public get completed() {
    return this.pending.length === 0;
  }

  /**
   * Returns all the tasks that are ready to be built ("!complete" && "ready")
   */
  public get ready() {
    return Object.values(this.tasks).filter(t => t.ready && !t.completed).sort((t1, t2) => t1.id.localeCompare(t2.id));
  }
}
