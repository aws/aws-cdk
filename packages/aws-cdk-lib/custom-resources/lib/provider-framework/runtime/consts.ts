export const USER_ON_EVENT_FUNCTION_ARN_ENV = 'USER_ON_EVENT_FUNCTION_ARN';
export const USER_IS_COMPLETE_FUNCTION_ARN_ENV = 'USER_IS_COMPLETE_FUNCTION_ARN';
export const WAITER_STATE_MACHINE_ARN_ENV = 'WAITER_STATE_MACHINE_ARN';
export const RESPONSE_URL_PARAMETER_PREFIX_ENV = 'RESPONSE_URL_PARAMETER_PREFIX';

/**
 * Placeholder written into the waiter state machine input in place of the real
 * `ResponseURL`. The real value is held in SSM Parameter Store and referenced by
 * `ResponseURLParameterName`.
 */
export const RESPONSE_URL_REDACTED = 'AWSCDK::CustomResourceProviderFramework::REDACTED';

export const FRAMEWORK_ON_EVENT_HANDLER_NAME = 'onEvent';
export const FRAMEWORK_IS_COMPLETE_HANDLER_NAME = 'isComplete';
export const FRAMEWORK_ON_TIMEOUT_HANDLER_NAME = 'onTimeout';
