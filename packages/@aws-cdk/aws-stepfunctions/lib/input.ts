import { Context, Data } from "./fields";

/**
 * Type union for task classes that accept multiple types of payload
 */
export class TaskInput {
  /**
   * Use a literal string as task input
   *
   * This might be a JSON-encoded object, or just a text.
   */
  public static fromText(text: string) {
    return new TaskInput(InputType.TEXT, text);
  }

  /**
   * Use an object as task input
   *
   * This object may contain Data and Context fields
   * as object values, if desired.
   */
  public static fromObject(obj: {[key: string]: any}) {
    return new TaskInput(InputType.OBJECT, obj);
  }

  /**
   * Use a part of the execution data as task input
   *
   * Use this when you want to use a subobject or string from
   * the current state machine execution as complete payload
   * to a task.
   */
  public static fromDataAt(path: string) {
    return new TaskInput(InputType.TEXT, Data.stringAt(path));
  }

  /**
   * Use a part of the task context as task input
   *
   * Use this when you want to use a subobject or string from
   * the current task context as complete payload
   * to a task.
   */
  public static fromContextAt(path: string) {
    return new TaskInput(InputType.TEXT, Context.stringAt(path));
  }

  private constructor(public readonly type: InputType, public readonly value: any) {
  }
}

/**
 * The type of task input
 */
export enum InputType {
  TEXT,
  OBJECT
}