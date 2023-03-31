function enumerable(value: boolean) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
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
