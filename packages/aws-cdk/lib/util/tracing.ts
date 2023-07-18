import { debug } from '../logging';

let ENABLED = false;
let INDENT = 0;

export function enableTracing(enabled: boolean) {
  ENABLED = enabled;
}

/**
 * Method decorator to trace a single static or member method, any time it's called
 */
export function traceCall(receiver: object, _propertyKey: string, descriptor: PropertyDescriptor, parentClassName?: string) {
  const fn = descriptor.value;
  const className = typeof receiver === 'function' ? receiver.name : parentClassName;

  descriptor.value = function (...args: any[]) {
    if (!ENABLED) { return fn.apply(this, args); }

    debug(`[trace] ${' '.repeat(INDENT)}${className || this.constructor.name || '(anonymous)'}#${fn.name}()`);
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
 * Class decorator, enable tracing for all methods on this class
 */
export function traceMethods(constructor: Function) {
  // Statics
  for (const [name, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(constructor))) {
    if (typeof descriptor.value !== 'function') { continue; }
    const newDescriptor = traceCall(constructor, name, descriptor, constructor.name) ?? descriptor;
    Object.defineProperty(constructor, name, newDescriptor);
  }

  // Instancne members
  for (const [name, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(constructor.prototype))) {
    if (typeof descriptor.value !== 'function') { continue; }
    const newDescriptor = traceCall(constructor.prototype, name, descriptor, constructor.name) ?? descriptor;
    Object.defineProperty(constructor.prototype, name, newDescriptor);
  }
}