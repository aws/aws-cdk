import cxapi = require('@aws-cdk/cx-api');
import { BuildSession } from './session';
import { Task, TaskConstructor } from './task';

export class Manifest {
  constructor(private readonly manifest: cxapi.BuildManifest) {
  }

  public createSession() {
    const manifest = this.manifest;
    const session = new BuildSession();
    const tasks: { [id: string]: Task } = {};

    for (const [ id, step ] of Object.entries(manifest.steps)) {
      const TaskClass = getTaskClass(step.type);
      const task = new TaskClass(id, step.parameters);
      tasks[id] = task;
      session.addTask(task);
    }

    // now that we've added all tasks, let's map the dependencies
    for (const [ id, step ] of Object.entries(manifest.steps)) {
      for (const depid of step.depends || []) {
        const consumer = tasks[id];
        const dep = tasks[depid];

        if (!consumer) {
          throw new Error(`Unexpected`);
        }

        if (!dep) {
          throw new Error(`Step ${id} defines a dependency on ${depid} which doesn't exist`);
        }

        consumer.addDependency(dep);
      }
    }

    return session;
  }
}

function getTaskClass(type: string): TaskConstructor {
  const cls = require(`./tasks/${type}`).default;
  return cls;
}
