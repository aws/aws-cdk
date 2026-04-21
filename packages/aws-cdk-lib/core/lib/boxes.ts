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

  public static zipWith<T extends Record<string, Box<any>>, R>(
    boxes: T,
    fn: (values: { [K in keyof T]: T[K] extends Box<infer U> ? U : never }) => R,
  ): Box<R> {
    return new ZippedWith(boxes, fn);
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

class ZippedWith<T extends Record<string, Box<any>>, R> extends BaseBox<R> {
  constructor(
    private readonly boxes: T,
    private readonly fn: (values: { [K in keyof T]: T[K] extends Box<infer U> ? U : never }) => R,
  ) {
    super();
  }

  public get(): R {
    const values = Object.fromEntries(
      Object.entries(this.boxes).map(([k, b]) => [k, b.get()]),
    ) as { [K in keyof T]: T[K] extends Box<infer U> ? U : never };
    return this.fn(values);
  }

  public set(_: R): void {
    throw new UnscopedValidationError(lit`Foo`, 'Immutable value');
  }

  public getStackTraces(): Array<StackTrace> {
    return Object.values(this.boxes).flatMap((b) => b.getStackTraces());
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
