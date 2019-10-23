//
// framework entrypoint lambda handlers
//
export const ON_EVENT_ENTRYPOINT = 'onEventEntrypoint';
export const IS_COMPLETE_ENTRYPOINT = 'isCompleteEntrypoint';
export const TIMEOUT_ENTRYPOINT = 'timeoutEntrypoint';

//
// environment variables which include the <file>.<export> specification
// for the user-defined handlers.
//
export const ENV_ON_EVENT_USER_HANDLER = 'USER_ON_EVENT';
export const ENV_IS_COMPLETE_USER_HANDLER = 'USER_IS_COMPLETE';

/**
 * The ARN of the waiter state machine
 */
export const ENV_WAITER_STATE_MACHINE_ARN = 'WAITER_STATE_MACHINE_ARN';