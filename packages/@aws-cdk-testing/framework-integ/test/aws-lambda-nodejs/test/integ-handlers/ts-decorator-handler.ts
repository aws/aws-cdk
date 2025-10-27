function enumerable(value: boolean) {
  return function (_target: any, context: ClassMethodDecoratorContext) {
    // It is a bit wasteful to do this in the constructor of every instance, and in fact
    // incorrect because it doesn't apply if the class is never instantiated. But the
    // 'enumerable' decorator from "experimental decorators" is no longer possible to
    // emulate in modern decorators style.
    context.addInitializer(function (this: any) {
      Object.defineProperty(this.prototype, context.name, {
        ...Object.getOwnPropertyDescriptor(this.prototype, context.name),
        enumerable: value,
      });
    });
  };
}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return 'Hello, ' + this.greeting;
  }
}

export async function handler(): Promise<void> {
  const message = new Greeter('World').greet();
  console.log(message); // eslint-disable-line no-console
}
