export enum LogDeletionPolicy {
  /**
   * This is the default log deletion policy. It means that when the resource is
   * removed from the app, the log will retain.
   */
   RETAINLOG = 'retainLog',
  /**
   * This uses the 'destroyLog' DeletionPolicy, which will destroy the log when the stack is deleted.
   */
  DESTROYLOG = 'destroyLog',
}