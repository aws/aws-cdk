import { Construct, IConstruct } from 'constructs';
import { applyInjectors } from './private/prop-injectors-helpers';

interface PropertyInjectableConstructConstructor {
  readonly PROPERTY_INJECTION_ID: string;

  new (scope: Construct, id: string, props: any, ...args: any[]): IConstruct;
}

type ArbitraryConstructor = { new (...args: any[]): {} };

/**
 * This decorator applies property injection before calling the Construct's constructor.
 *
 * ** Please make sure the Construct has PROPERTY_INJECTION_ID property.**
 *
 * @param constructor constructor of the Construct
 * @returns an instance of the class with Property Injection applied.
 */
export function propertyInjectable<T extends PropertyInjectableConstructConstructor>(constructor: T): T {
  // The cast is necessary otherwise we get the error:
  //
  // `A mixin class must have a constructor with a single rest parameter of type 'any[]'`
  //
  // I couldn't find a clear reference on what that error is trying to say, but it's possible
  // to cast it away, and the signature of the containing function seems to hold water.
  const WrappedClass = class extends (constructor as ArbitraryConstructor) {
    constructor(scope: Construct, id: string, props: object, ...args: any[]) {
      // eslint-disable-next-line dot-notation
      const uniqueId = constructor.PROPERTY_INJECTION_ID;
      props = applyInjectors(uniqueId, props, {
        scope,
        id,
      });

      super(scope, id, props, ...args);
    }
  };
  // Preserve the static `name` property
  Object.defineProperty(WrappedClass, 'name', {
    value: constructor.name,
    writable: false,
  });
  return WrappedClass as T;
}
