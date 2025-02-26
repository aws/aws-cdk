import { log } from 'console';
import { inspect } from 'util';

type Constructor = { new (...args: any[]): {} };

/**
 * This decorator applies property injection before calling the Construct's constructor.
 * @param constructor constructor of the Construct
 * @returns
 */
export function propertyInjectionDecorator<T extends Constructor>(constructor: T) {
  log('In propertyInjectionDecorator');
  return class extends constructor {
    constructor(...args: any[]) {
      const scope = args[0];
      const id = args[1];
      let props = args[2];

      log(`Ctor scope: ${scope}, id: ${id}, old props: ${inspect(props)}`);

      super(scope, id, props);
    }

    toString() {
      return inspect(this);
    }
  };
}