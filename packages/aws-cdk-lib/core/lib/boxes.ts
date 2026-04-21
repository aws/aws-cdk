import { debugModeEnabled } from './debug';
import { UnscopedValidationError } from './errors';
import { lit } from './private/literal-string';
import type { IResolvable, IResolveContext } from './resolvable';
import { captureStackTrace } from './stack-trace';

const BOX_SYM = Symbol.for('@aws-cdk/core.Box');

export interface Box<A> extends IResolvable {
  set(a: A): void;
  get(): A;
  derive<B>(fn: (a: A) => B): Box<B>;
  getStackTraces(): Array<StackTrace>;
}

export interface ArrayBox<A> extends Box<Array<A>> {
  push(a: A): void;
}

type StackTrace = Array<string>;

export class Boxes {
  public static state<A>(value: A): Box<A> {
    return new State(value);
  }

  /**
   * Useful when you have a computation from more than one source
   */
  public static zip<A, B>(a: Box<A>, b: Box<B>): Box<[A, B]> {
    return new Zipped(a, b);
  }

  public static isBox(x: any): x is Box<any> {
    return typeof x === 'object' && x && BOX_SYM in x;
  }

  public static array<A>(as: Array<A>): ArrayBox<A> {
    return new ArrayState(as);
  }
}

abstract class BaseBox<A> implements Box<A> {
  public readonly creationStack: string[] = [];

  protected constructor() {
    Object.defineProperty(this, BOX_SYM, { value: true });
  }

  public derive<B>(fn: (a: A) => B): Box<B> {
    return new Computed(this, fn);
  }

  abstract get(): A;
  abstract set(a: A): void;
  abstract getStackTraces(): Array<StackTrace>;

  public resolve(_: IResolveContext) {
    return this.get();
  }
}

class Zipped<A, B> extends BaseBox<[A, B]> {
  constructor(private readonly a: Box<A>, private readonly b: Box<B>) {
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

class Computed<A, B> extends BaseBox<B> {
  constructor(private readonly source: Box<A>, private readonly fn: (a: A) => B) {
    super();
  }

  public get(): B {
    return this.fn(this.source.get());
  }

  public set(_a: B): void {
    // TODO avoid this with smarter types
    throw new UnscopedValidationError(lit`Foo`, 'Immutable value');
  }

  public getStackTraces(): Array<StackTrace> {
    return this.source.getStackTraces();
  }
}

class State<A> extends BaseBox<A> {
  protected stackTraces: Array<StackTrace> = [];

  constructor(private value: A) {
    super();
    if (debugModeEnabled()) {
      this.stackTraces = [captureStackTrace(this.constructor)];
    }
  }

  public get(): A {
    return this.value;
  }

  public set(value: A): void {
    if (debugModeEnabled()) {
      this.stackTraces = [captureStackTrace(this.set.bind(this))];
    }
    this.value = value;
  }

  public getStackTraces(): Array<StackTrace> {
    return this.stackTraces;
  }
}

class ArrayState<A> extends State<Array<A>> implements ArrayBox<A> {
  constructor(private as: Array<A>) {
    super(as);
  }

  public push(a: A): void {
    this.as.push(a);
    if (debugModeEnabled()) {
      this.stackTraces.push(captureStackTrace(this.set.bind(this)));
    }
  }
}
