// Fixture for the exactOptionalPropertyTypes guard's self-test: under the flag, a
// member typed `T | undefined` is not assignable to an interface's optional `?: T`.

export interface IWidget {
  readonly label?: string;
}

/** Violates directly: the getter returns `string | undefined`. */
export class Widget implements IWidget {
  public get label(): string | undefined {
    return undefined;
  }
}

abstract class WidgetBase implements IWidget {
  public get label(): string | undefined {
    return undefined;
  }
}

/** Violates through an abstract base class it inherits from. */
export class DerivedWidget extends WidgetBase {}

/** Assignable: an optional field is what the flag expects. */
export class GoodWidget implements IWidget {
  public readonly label?: string;
}
