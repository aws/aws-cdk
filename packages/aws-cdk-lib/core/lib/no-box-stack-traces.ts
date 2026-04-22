import { Boxes } from './helpers-internal/boxes';

type ArbitraryConstructor = { new (...args: any[]): {} };

/**
 * Class decorator that disables box stack trace collection for the duration of
 * the decorated class's constructor.
 *
 * Apply this to L2 constructs that create or mutate boxes during construction.
 * Without it, every `Boxes.state(...)`, `box.set(...)`, and `box.push(...)` call
 * inside the constructor would capture a stack trace pointing at CDK internals
 * rather than user code, polluting the `aws:cdk:propertyAssignment` metadata.
 *
 * Stack trace collection is re-enabled in a `finally` block, so it is safe even
 * if the constructor throws.
 *
 * ### Example
 *
 * ```ts
 * @noBoxStackTraces
 * class MyL2 extends Resource {
 *   private readonly items: ArrayBox<string>;
 *
 *   constructor(scope: Construct, id: string) {
 *     super(scope, id);
 *     // No stack traces captured for these mutations:
 *     this.items = Boxes.array(['default']);
 *     this.items.push('another-default');
 *   }
 *
 *   addItem(item: string) {
 *     // Stack trace IS captured here (outside constructor):
 *     this.items.push(item);
 *   }
 * }
 * ```
 */
export function noBoxStackTraces<T extends ArbitraryConstructor>(constructor: T): T {
  const WrappedClass = class extends constructor {
    constructor(...args: any[]) {
      Boxes.disableStackTraceCollection();
      try {
        super(...args);
      } finally {
        Boxes.enableStackTraceCollection();
      }
    }
  };
  Object.defineProperty(WrappedClass, 'name', {
    value: constructor.name,
    writable: false,
  });
  return WrappedClass as any;
}
