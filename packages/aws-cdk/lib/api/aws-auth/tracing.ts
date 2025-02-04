import type { Logger } from '@smithy/types';

let ENABLED = false;
let INDENT = 0;

export function setSdkTracing(enabled: boolean) {
  ENABLED = enabled;
}

/**
 * Method decorator to trace a single static or member method, any time it's called
 */
export function callTrace(fn: string, className?: string, logger?: Logger) {
  if (!ENABLED || !logger) {
    return;
  }

  logger.info(`[trace] ${' '.repeat(INDENT)}${className || '(anonymous)'}#${fn}()`);
}

/**
 * Method decorator to trace a single member method any time it's called
 */
function traceCall(receiver: object, _propertyKey: string, descriptor: PropertyDescriptor, parentClassName?: string) {
  const fn = descriptor.value;
  const className = typeof receiver === 'function' ? receiver.name : parentClassName;

  descriptor.value = function (...args: any[]) {
    const logger = (this as any).logger;
    if (!ENABLED || typeof logger?.info !== 'function') { return fn.apply(this, args); }

    logger.info.apply(logger, [`[trace] ${' '.repeat(INDENT)}${className || this.constructor.name || '(anonymous)'}#${fn.name}()`]);
    INDENT += 2;

    const ret = fn.apply(this, args);
    if (ret instanceof Promise) {
      return ret.finally(() => {
        INDENT -= 2;
      });
    } else {
      INDENT -= 2;
      return ret;
    }
  };
  return descriptor;
}

/**
 * Class decorator, enable tracing for all member methods on this class
 * @deprecated this doesn't work well with localized logging instances, don't use
 */
export function traceMemberMethods(constructor: Function) {
  // Instance members
  for (const [name, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(constructor.prototype))) {
    if (typeof descriptor.value !== 'function') { continue; }
    const newDescriptor = traceCall(constructor.prototype, name, descriptor, constructor.name) ?? descriptor;
    Object.defineProperty(constructor.prototype, name, newDescriptor);
  }
}
