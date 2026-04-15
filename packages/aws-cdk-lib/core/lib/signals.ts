import { CfnResource } from './cfn-resource';
import { debugModeEnabled } from './debug';
import { UnscopedValidationError } from './errors';
import { lit } from './private/literal-string';
import type { IResolvable, IResolveContext } from './resolvable';
import { captureStackTrace } from './stack-trace';
import { Token } from './token';

// TODO Given that this is different in significant ways from the
//  proposed signals specification, we need another name
export interface Signal<A> extends IResolvable {
  set(a: A): void;
  get(): A;
  asNumber(): number;
  asString(): string;
  asList(): string[];
  map<B>(fn: (a: A) => B): Signal<B>;
  getStackTraces(): Array<StackTrace>;
}

type StackTrace = Array<string>;

export class Signals {
  public static state<A>(value: A): Signal<A> {
    return new State(value);
  }

  /**
   * Useful when you have a computation from more than one source
   */
  public static zip<A, B>(a: Signal<A>, b: Signal<B>): Signal<[A, B]> {
    return new Zipped(a, b);
  }
}

abstract class BaseSignal<A> implements Signal<A> {
  public readonly creationStack: string[] = [];

  public map<B>(fn: (a: A) => B): Signal<B> {
    return new Computed(this, fn);
  }

  public asNumber(): number {
    return Token.asNumber(this);
  }

  public asString(): string {
    return Token.asString(this);
  }

  public asList(): string[] {
    return Token.asList(this);
  }

  abstract get(): A;
  abstract set(a: A): void;
  abstract getStackTraces(): Array<StackTrace>;

  public resolve(context: IResolveContext) {
    const value = this.get();
    const path = propertyPath(context.documentPath);
    const stackTraces = this.getStackTraces();

    const shouldAddMetadata = debugModeEnabled() &&
        path != null &&
        stackTraces.length > 0 &&
        CfnResource.isCfnResource(context.scope);

    if (shouldAddMetadata) {
      context.scope.node.addMetadata('aws:cdk:propertyAssignment', {
        propertyName: path,
        stackTraces,
      });
    }
    return value;
  }
}

class Zipped<A, B> extends BaseSignal<[A, B]> {
  constructor(private readonly a: Signal<A>, private readonly b: Signal<B>) {
    super();
  }

  public get(): [A, B] {
    return [this.a.get(), this.b.get()];
  }

  public set(_: [A, B]): void {
    // TODO avoid this with smarter types
    throw new UnscopedValidationError(lit`Foo`, 'Immutable value');
  }

  public getStackTraces(): Array<StackTrace> {
    return this.a.getStackTraces().concat(this.b.getStackTraces());
  }
}

class Computed<A, B> extends BaseSignal<B> {
  private stackTraces: Array<StackTrace> = [];

  constructor(private readonly source: Signal<A>, private readonly fn: (a: A) => B) {
    super();
  }

  public get(): B {
    this.stackTraces = this.source.getStackTraces();
    return this.fn(this.source.get());
  }

  public set(_a: B): void {
    // TODO avoid this with smarter types
    throw new UnscopedValidationError(lit`Foo`, 'Immutable value');
  }

  public getStackTraces(): Array<StackTrace> {
    return this.stackTraces ?? [];
  }
}

class State<A> extends BaseSignal<A> {
  private stackTraces: Array<StackTrace> = [];

  constructor(private value: A) {
    super();
    if (debugModeEnabled()) {
      this.stackTraces.push(captureStackTrace(this.constructor));
    }
  }

  public get(): A {
    return this.value;
  }

  public set(value: A): void {
    if (debugModeEnabled()) {
      this.stackTraces.push(captureStackTrace(this.set.bind(this)));
    }
    this.value = value;
  }

  public getStackTraces(): Array<StackTrace> {
    return this.stackTraces;
  }
}

// TODO Make this more robust. "Properties" might not be present, for example
// TODO property names should be capitalized (CFN style, not CDK style)
function propertyPath(documentPath: string[]): string {
  const idx = documentPath.indexOf('Properties');
  return idx === -1 ? '' : documentPath.slice(idx + 1).join('.');
}
