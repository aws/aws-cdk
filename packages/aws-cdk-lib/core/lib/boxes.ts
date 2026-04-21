import { debugModeEnabled } from './debug';
import type { IResolvable, IResolveContext } from './resolvable';
import { captureStackTrace } from './stack-trace';

const BOX_SYM = Symbol.for('@aws-cdk/core.Box');

export interface ReadableBox<A> extends IResolvable {
  get(): A;
  derive<B>(fn: (a: A) => B): ReadableBox<B>;
  getStackTraces(): Array<StackTrace>;
}

export interface Box<A> extends ReadableBox<A> {
  set(a: A): void;
}

export interface ArrayBox<A> extends Box<Array<A>> {
  push(a: A): void;
}

type StackTrace = Array<string>;

export class Boxes {
  public static state<A>(value: A): Box<A> {
    return new State(value);
  }

  public static zipWith<T extends Record<string, ReadableBox<any>>, R>(
    boxes: T,
    fn: (values: { [K in keyof T]: T[K] extends ReadableBox<infer U> ? U : never }) => R,
  ): ReadableBox<R> {
    return new ZippedWith(boxes, fn);
  }

  public static isBox(x: any): x is ReadableBox<any> {
    return typeof x === 'object' && x && BOX_SYM in x;
  }

  public static array<A>(as: Array<A>): ArrayBox<A> {
    return new ArrayState(as);
  }
}

abstract class BaseReadableBox<A> implements ReadableBox<A> {
  public readonly creationStack: string[] = [];

  protected constructor() {
    Object.defineProperty(this, BOX_SYM, { value: true });
  }

  public derive<B>(fn: (a: A) => B): ReadableBox<B> {
    return new Computed(this, fn);
  }

  abstract get(): A;
  abstract getStackTraces(): Array<StackTrace>;

  public resolve(_: IResolveContext) {
    return this.get();
  }
}

class ZippedWith<T extends Record<string, ReadableBox<any>>, R> extends BaseReadableBox<R> {
  constructor(
    private readonly boxes: T,
    private readonly fn: (values: { [K in keyof T]: T[K] extends ReadableBox<infer U> ? U : never }) => R,
  ) {
    super();
  }

  public get(): R {
    const values = Object.fromEntries(
      Object.entries(this.boxes).map(([k, b]) => [k, b.get()]),
    ) as { [K in keyof T]: T[K] extends ReadableBox<infer U> ? U : never };
    return this.fn(values);
  }

  public getStackTraces(): Array<StackTrace> {
    return Object.values(this.boxes).flatMap((b) => b.getStackTraces());
  }
}

class Computed<A, B> extends BaseReadableBox<B> {
  constructor(private readonly source: ReadableBox<A>, private readonly fn: (a: A) => B) {
    super();
  }

  public get(): B {
    return this.fn(this.source.get());
  }

  public getStackTraces(): Array<StackTrace> {
    return this.source.getStackTraces();
  }
}

class State<A> extends BaseReadableBox<A> implements Box<A> {
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
