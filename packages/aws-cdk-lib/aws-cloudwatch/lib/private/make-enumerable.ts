/**
 * Make a property from the specified prototype enumerable on the specific instance.
 */
export function makeEnumerable(prototype: object, instance: object, propertyKey: string) {
  Object.defineProperty(instance, propertyKey, {
    ...Object.getOwnPropertyDescriptor(prototype, propertyKey),
    enumerable: true,
  });
}
