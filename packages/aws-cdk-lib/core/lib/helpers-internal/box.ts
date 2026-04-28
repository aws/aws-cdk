import { debugModeEnabled } from '../debug';
import type { IResolvable, IResolveContext } from '../resolvable';
import { captureStackTrace } from '../stack-trace';

const BOX_SYM = Symbol.for('@aws-cdk/core.Box');

export type MakeReadonly<A> = A extends Set<infer E> ? ReadonlySet<E> :
  A extends Map<infer K, infer E> ? ReadonlyMap<K, E> :
    A extends Array<infer E> ? ReadonlyArray<E> :
      A extends object ? Readonly<A> : A;

/**
 * A read-only observable container that holds a value of type `A` and implements `IResolvable`.
 *
 * Readable boxes participate in CDK token resolution: they can be passed into
 * L1 construct properties via `Token.asString()`, `Token.asList()`, etc., and
 * their value will be resolved at synthesis time.
 *
 * Readable boxes also track stack traces of mutations (when `CDK_DEBUG` is enabled),
 * which are used to emit `aws:cdk:propertyAssignment` metadata linking CloudFormation
 * property values back to the user code that produced them.
 */
export interface IReadableBox<A> extends IResolvable {
  /**
   * Returns the current value held by this box.
   *
   * The returned value is wrapped in `MakeReadonly` so that consumers cannot
   * mutate it in place. All mutations must go through the box's own API
   * (e.g. `set`, `push`, `put`, `add`).
   */
  get(): MakeReadonly<A>;

  /**
   * Returns the current value held by this box as a mutable type.
   *
   * Unlike `get()`, the returned value is not wrapped in `MakeReadonly`,
   * allowing direct mutation of the underlying value.
   */
  getMutable(): A;

  /**
   * Creates a new read-only box whose value is derived by applying `fn` to this box's value.
   *
   * The derived box inherits the stack traces of its source, so mutations to
   * this box are correctly attributed to all CloudFormation properties that
   * consume the derived value.
   *
   * @param fn a pure transformation function.
   * @returns a new read-only box that recomputes on every `get()` / `resolve()`.
   */
  derive<B>(fn: (a: MakeReadonly<A>) => B): IReadableBox<B>;

  /**
   * Returns the stack traces captured by this box.
   *
   * Each entry corresponds to a mutation (`set`, `push`, or initial construction)
   * that occurred while stack trace collection was enabled (`CDK_DEBUG=1`).
   * Returns an empty array when debug mode is off or no mutations were recorded.
   */
  getStackTraces(): Array<StackTrace>;
}

/**
 * A mutable box that extends `IReadableBox` with the ability to replace its value.
 *
 * When `set` is called (and the new value differs from the current one), the box
 * replaces its stored stack traces with a single new trace captured at the call
 * site, so that the metadata points to the code that last changed the value.
 */
export interface IBox<A> extends IReadableBox<A> {
  /**
   * Replaces the value held by this box.
   *
   * If the new value is equal to the current value (by reference equality, or
   * by the custom `equals` function provided at construction), this is a no-op
   * and no stack trace is captured.
   *
   * @param a the new value.
   */
  set(a: A): void;
}

/**
 * A mutable box specialized for arrays, extending `Box<Array<A>>` with `push`.
 *
 * Unlike `set` (which replaces all stack traces), `push` *appends* a new stack
 * trace to the existing list. This means that each element addition is tracked
 * individually, and the resulting metadata will contain one entry per `push` call
 * (plus one for the initial construction or last `set`, if any).
 */
export interface IArrayBox<A> extends IBox<Array<A>>, Iterable<A> {
  /**
   * Returns the number of elements in the array.
   */
  readonly length: number;

  /**
   * Appends one or more elements to the array and captures a stack trace for this addition.
   *
   * @param items the elements to append.
   */
  push(...items: A[]): void;

  /**
   * Removes the last element from the array and captures a stack trace for this removal.
   *
   * @returns the removed element, or `undefined` if the array is empty.
   */
  pop(): A | undefined;

  /**
   * Returns the index of the first element that satisfies the predicate, or -1.
   *
   * Delegates to `Array.prototype.findIndex` on the underlying array.
   *
   * @param predicate a function called for each element.
   * @returns the index of the first matching element, or -1.
   */
  findIndex(predicate: (value: A, index: number, obj: Array<A>) => unknown): number;

  /**
   * Returns the first element that satisfies the predicate, or `undefined`.
   *
   * Delegates to `Array.prototype.find` on the underlying array.
   *
   * @param predicate a function called for each element.
   * @returns the first matching element, or `undefined`.
   */
  find(predicate: (value: A, index: number, obj: Array<A>) => unknown): A | undefined;

  /**
   * Removes elements from the array and optionally inserts new elements in their place.
   *
   * Delegates to `Array.prototype.splice` on the underlying array.
   *
   * @param start the zero-based index at which to start changing the array.
   * @param deleteCount the number of elements to remove.
   * @param items elements to insert at `start`.
   * @returns an array of the removed elements.
   */
  splice(start: number, deleteCount: number, ...items: A[]): A[];

  /**
   * Tests whether at least one element in the array passes the predicate.
   *
   * Delegates to `Array.prototype.some` on the underlying array.
   *
   * @param predicate a function called for each element.
   * @returns `true` if the predicate returns a truthy value for at least one element, otherwise `false`.
   */
  some(predicate: (value: A, index: number, obj: Array<A>) => unknown): boolean;

  /**
   * Creates a derived read-only box by applying `fn` to each element of the array.
   *
   * Shorthand for `this.derive(a => a.map(fn))`.
   *
   * @param fn a pure transformation applied to each element.
   * @returns a new read-only box holding the mapped array.
   */
  map<B>(fn: (a: A) => B): IReadableBox<Array<B>>;
}

/**
 * A mutable box specialized for maps, extending `Box<Map<K, V>>` with
 * map-mutation methods.
 *
 * Like `ArrayBox`, mutating methods (`put`, `delete`) *append* stack traces
 * rather than replacing them, so each mutation is tracked individually.
 */
export interface IMapBox<K, V> extends IBox<Map<K, V>>, Iterable<[K, V]> {
  /**
   * Returns the number of entries in the map.
   */
  readonly size: number;

  /**
   * Sets a key-value pair in the map and captures a stack trace for this mutation.
   *
   * @param key the key.
   * @param value the value.
   */
  put(key: K, value: V): void;

  /**
   * Removes a key from the map and captures a stack trace for this mutation.
   *
   * @param key the key to remove.
   * @returns `true` if the key existed and was removed, `false` otherwise.
   */
  delete(key: K): boolean;

  /**
   * Returns whether the map contains the given key.
   *
   * @param key the key to check.
   */
  has(key: K): boolean;

  /**
   * Returns the value associated with the given key, or `undefined`.
   *
   * @param key the key to look up.
   */
  getEntry(key: K): V | undefined;

  /**
   * Returns an iterable of the map's keys.
   */
  keys(): IterableIterator<K>;

  /**
   * Returns an iterable of the map's values.
   */
  values(): IterableIterator<V>;

  /**
   * Returns an iterable of the map's [key, value] pairs.
   */
  entries(): IterableIterator<[K, V]>;

  /**
   * Executes a callback for each entry in the map.
   *
   * @param callbackfn a function called for each entry.
   */
  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void): void;
}

/**
 * A mutable box specialized for sets, extending `Box<Set<A>>` with
 * set-mutation methods.
 *
 * Like `ArrayBox`, mutating methods (`add`, `delete`) *append* stack traces
 * rather than replacing them, so each mutation is tracked individually.
 */
export interface ISetBox<A> extends IBox<Set<A>>, Iterable<A> {
  /**
   * Returns the number of elements in the set.
   */
  readonly size: number;

  /**
   * Adds a value to the set and captures a stack trace for this mutation.
   *
   * @param value the value to add.
   */
  add(value: A): void;

  /**
   * Removes a value from the set and captures a stack trace for this mutation.
   *
   * @param value the value to remove.
   * @returns `true` if the value existed and was removed, `false` otherwise.
   */
  delete(value: A): boolean;

  /**
   * Returns whether the set contains the given value.
   *
   * @param value the value to check.
   */
  has(value: A): boolean;

  /**
   * Returns an iterable of the set's values.
   */
  values(): IterableIterator<A>;

  /**
   * Returns an iterable of the set's [value, value] pairs (for compatibility with `Map`).
   */
  entries(): IterableIterator<[A, A]>;

  /**
   * Executes a callback for each value in the set.
   *
   * @param callbackfn a function called for each value.
   */
  forEach(callbackfn: (value: A, value2: A, set: Set<A>) => void): void;
}

type StackTrace = Array<string>;
type OrderedStackTrace = { trace: StackTrace; seq: number };

let stackTraceCollectionEnabled = true;
let globalSeq = 0;

/**
 * Factory for creating boxes.
 *
 * Boxes are mutable, observable containers that implement `IResolvable` and
 * capture stack traces when mutated (under `CDK_DEBUG`). They are intended as a
 * replacement for the `Lazy` API in L2 constructs: where `Lazy` captures a
 * stack trace only at creation time (typically inside the L2 constructor),
 * boxes capture traces at the point of mutation — which is usually in user code.
 *
 * ### Typical L2 usage
 *
 * ```ts
 * @noBoxStackTraces
 * class MyL2 extends Resource {
 *   private readonly items: ArrayBox<string>;
 *
 *   constructor(scope: Construct, id: string) {
 *     super(scope, id);
 *     this.items = Boxes.fromArray([]);
 *     new CfnResource(this, 'Resource', {
 *       items: Token.asList(this.items),
 *     });
 *   }
 *
 *   addItem(item: string) {
 *     this.items.push(item); // stack trace captured here
 *   }
 * }
 * ```
 */
export class Box {
  /**
   * Creates a mutable box holding a single value.
   *
   * @param value the initial value.
   * @param options.equals optional equality function used to skip no-op `set` calls.
   *   Defaults to reference equality (`===`).
   * @returns a new `Box<A>`.
   */
  public static fromValue<A>(value: A, options?: { equals?: (a: A, b: A) => boolean }): IBox<A> {
    return new State(value, options);
  }

  /**
   * Creates a read-only box that combines multiple source boxes through a function.
   *
   * The resulting box collects stack traces from all source boxes, sorted by
   * the global mutation order. This is useful when a single CloudFormation
   * property depends on multiple pieces of L2 state.
   *
   * @param boxes a record of named source boxes.
   * @param fn a pure function that receives the unwrapped values and produces the result.
   * @returns a new read-only `IReadableBox<R>`.
   * @example
   *   const a = Boxes.fromValue(10);
   *   const b = Boxes.fromValue(20);
   *   const result = Boxes.combine({ a, b }, (x) => x.a + x.b).derive((x) => x * 2);
   *   result.get(); // 60
   */
  public static combine<T extends Record<string, IReadableBox<any>>, R>(
    boxes: T,
    fn: (values: { [K in keyof T]: T[K] extends IReadableBox<infer U> ? MakeReadonly<U> : never }) => R,
  ): IReadableBox<R> {
    return new Combined(boxes, fn);
  }

  /**
   * Type guard that checks whether a value is a box.
   *
   * Used internally by `PropertyAssignmentMetadataWriter` to decide whether a
   * resolved token should contribute `aws:cdk:propertyAssignment` metadata.
   */
  public static isBox(x: any): x is IReadableBox<any> {
    return typeof x === 'object' && x && BOX_SYM in x;
  }

  /**
   * Creates a mutable array box.
   *
   * @param as the initial array contents.
   * @param options.omitEmpty if true (the default), the box resolves to `undefined` when the
   *   array is empty. This behavior propagates through `map`, `derive`, and
   *   `reduce`, so derived boxes also resolve to `undefined` when the source
   *   array is empty. Set to `false` to resolve to an empty array instead.
   * @returns a new `ArrayBox<A>`.
   */
  public static fromArray<A>(as: Array<A>, options?: { omitEmpty?: boolean }): IArrayBox<A> {
    return new ArrayState(as, options?.omitEmpty ?? true);
  }

  /**
   * Creates a mutable map box.
   *
   * @param map the initial map contents.
   * @returns a new `MapBox<K, V>`.
   */
  public static fromMap<K, V>(map: Map<K, V>): IMapBox<K, V> {
    return new MapState(map);
  }

  /**
   * Creates a mutable set box.
   *
   * @param set the initial set contents.
   * @returns a new `SetBox<A>`.
   */
  public static fromSet<A>(set: Set<A>): ISetBox<A> {
    return new SetState(set);
  }

  /**
   * Globally disables stack trace collection for all box mutations.
   *
   * Called by the `@noBoxStackTraces` decorator before entering an L2
   * constructor, so that default/initial values set during construction
   * do not produce misleading stack traces.
   */
  public static disableStackTraceCollection(): void {
    stackTraceCollectionEnabled = false;
  }

  /**
   * Re-enables stack trace collection for all box mutations.
   *
   * Called by the `@noBoxStackTraces` decorator after the L2 constructor
   * returns, so that subsequent mutations (from user code) are tracked.
   */
  public static enableStackTraceCollection(): void {
    stackTraceCollectionEnabled = true;
  }
}

abstract class BaseReadableBox<A> implements IReadableBox<A> {
  public readonly creationStack: string[] = [];

  protected constructor() {
    Object.defineProperty(this, BOX_SYM, { value: true });
  }

  public derive<B>(fn: (a: MakeReadonly<A>) => B): IReadableBox<B> {
    return new Computed(this, fn);
  }

  abstract get(): MakeReadonly<A>;
  abstract getMutable(): A;
  abstract getStackTraces(): Array<StackTrace>;

  public resolve(_: IResolveContext): MakeReadonly<A> | undefined {
    return this.get();
  }
}

class Combined<T extends Record<string, IReadableBox<any>>, R> extends BaseReadableBox<R> {
  constructor(
    private readonly boxes: T,
    private readonly fn: (values: { [K in keyof T]: T[K] extends IReadableBox<infer U> ? MakeReadonly<U> : never }) => R,
  ) {
    super();
  }

  public get(): MakeReadonly<R> {
    const values = Object.fromEntries(
      Object.entries(this.boxes).map(([k, b]) => [k, b.get()]),
    ) as { [K in keyof T]: T[K] extends IReadableBox<infer U> ? MakeReadonly<U> : never };
    return this.fn(values) as MakeReadonly<R>;
  }

  public getMutable(): R {
    return this.get() as R;
  }

  public getStackTraces(): Array<StackTrace> {
    const all: OrderedStackTrace[] = Object.values(this.boxes).flatMap((b) => (b as any).getOrderedStackTraces?.() ?? []);
    all.sort((a, b) => a.seq - b.seq);
    return all.map((t) => t.trace);
  }
}

class Computed<A, B> extends BaseReadableBox<B> {
  constructor(private readonly source: IReadableBox<A>, private readonly fn: (a: MakeReadonly<A>) => B) {
    super();
  }

  public get(): MakeReadonly<B> {
    return this.fn(this.source.get()) as MakeReadonly<B>;
  }

  public getMutable(): B {
    return this.get() as B;
  }

  public resolve(context: IResolveContext): MakeReadonly<B> | undefined {
    const sourceResolved = this.source.resolve(context);
    if (sourceResolved === undefined) {
      return undefined;
    }
    return this.fn(sourceResolved as MakeReadonly<A>) as MakeReadonly<B>;
  }

  public getStackTraces(): Array<StackTrace> {
    return this.source.getStackTraces();
  }

  public getOrderedStackTraces(): Array<OrderedStackTrace> {
    return (this.source as any).getOrderedStackTraces?.() ?? [];
  }
}

class State<A> extends BaseReadableBox<A> implements IBox<A> {
  protected orderedTraces: Array<OrderedStackTrace> = [];
  private readonly equals: (a: A, b: A) => boolean;

  constructor(private value: A, options?: { equals?: (a: A, b: A) => boolean }) {
    super();
    this.equals = options?.equals ?? ((a, b) => a === b);
    if (debugModeEnabled() && stackTraceCollectionEnabled) {
      this.orderedTraces = [{ trace: captureStackTrace(this.constructor), seq: globalSeq++ }];
    }
  }

  public get(): MakeReadonly<A> {
    return this.value as MakeReadonly<A>;
  }

  public getMutable(): A {
    return this.value;
  }

  public set(value: A): void {
    if (this.equals(this.value, value)) {
      return;
    }
    if (debugModeEnabled() && stackTraceCollectionEnabled) {
      this.orderedTraces = [{ trace: captureStackTrace(this.set.bind(this)), seq: globalSeq++ }];
    }
    this.value = value;
  }

  public getStackTraces(): Array<StackTrace> {
    return this.orderedTraces.map((t) => t.trace);
  }

  public getOrderedStackTraces(): Array<OrderedStackTrace> {
    return this.orderedTraces;
  }
}

class ArrayState<A> extends State<Array<A>> implements IArrayBox<A> {
  constructor(private array: Array<A>, private readonly omitEmptyFlag?: boolean) {
    super(array);
  }

  public resolve(_: IResolveContext) {
    if (this.omitEmptyFlag && this.array.length === 0) {
      return undefined;
    }
    return this.get();
  }

  public set(value: Array<A>): void {
    super.set(value);
    this.array = value;
  }

  public push(...items: A[]): void {
    this.array.push(...items);
    this.appendTrace(captureStackTrace(this.push.bind(this)));
  }

  public pop(): A | undefined {
    const result = this.array.pop();
    this.appendTrace(captureStackTrace(this.pop.bind(this)));
    return result;
  }

  public findIndex(predicate: (value: A, index: number, obj: Array<A>) => unknown): number {
    return this.array.findIndex(predicate);
  }

  public find(predicate: (value: A, index: number, obj: Array<A>) => unknown): A | undefined {
    return this.array.find(predicate);
  }

  public get length(): number {
    return this.array.length;
  }

  public splice(start: number, deleteCount: number, ...items: A[]): A[] {
    const result = this.array.splice(start, deleteCount, ...items);
    this.appendTrace(captureStackTrace(this.splice.bind(this)));
    return result;
  }

  private appendTrace(trace: StackTrace): void {
    if (debugModeEnabled() && stackTraceCollectionEnabled) {
      this.orderedTraces.push({ trace, seq: globalSeq++ });
    }
  }

  public some(predicate: (value: A, index: number, obj: Array<A>) => unknown): boolean {
    return this.array.some(predicate);
  }

  public map<B>(fn: (a: A) => B): IReadableBox<Array<B>> {
    return this.derive(arr => arr.map(fn));
  }

  public [Symbol.iterator](): Iterator<A> {
    return this.array[Symbol.iterator]();
  }
}

class MapState<K, V> extends State<Map<K, V>> implements IMapBox<K, V> {
  constructor(private map: Map<K, V>) {
    super(map);
  }

  public set(value: Map<K, V>): void {
    super.set(value);
    this.map = value;
  }

  public get size(): number {
    return this.map.size;
  }

  public put(key: K, value: V): void {
    this.map.set(key, value);
    this.appendTrace(captureStackTrace(this.put.bind(this)));
  }

  public delete(key: K): boolean {
    const result = this.map.delete(key);
    this.appendTrace(captureStackTrace(this.delete.bind(this)));
    return result;
  }

  public has(key: K): boolean {
    return this.map.has(key);
  }

  public getEntry(key: K): V | undefined {
    return this.map.get(key);
  }

  public keys(): IterableIterator<K> {
    return this.map.keys();
  }

  public values(): IterableIterator<V> {
    return this.map.values();
  }

  public entries(): IterableIterator<[K, V]> {
    return this.map.entries();
  }

  public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void): void {
    this.map.forEach(callbackfn);
  }

  private appendTrace(trace: StackTrace): void {
    if (debugModeEnabled() && stackTraceCollectionEnabled) {
      this.orderedTraces.push({ trace, seq: globalSeq++ });
    }
  }

  public [Symbol.iterator](): Iterator<[K, V]> {
    return this.map[Symbol.iterator]();
  }
}

class SetState<A> extends State<Set<A>> implements ISetBox<A> {
  constructor(private _set: Set<A>) {
    super(_set);
  }

  public set(value: Set<A>): void {
    super.set(value);
    this._set = value;
  }

  public get size(): number {
    return this._set.size;
  }

  public add(value: A): void {
    this._set.add(value);
    this.appendTrace(captureStackTrace(this.add.bind(this)));
  }

  public delete(value: A): boolean {
    const result = this._set.delete(value);
    this.appendTrace(captureStackTrace(this.delete.bind(this)));
    return result;
  }

  public has(value: A): boolean {
    return this._set.has(value);
  }

  public values(): IterableIterator<A> {
    return this._set.values();
  }

  public entries(): IterableIterator<[A, A]> {
    return this._set.entries();
  }

  public forEach(callbackfn: (value: A, value2: A, set: Set<A>) => void): void {
    this._set.forEach(callbackfn);
  }

  private appendTrace(trace: StackTrace): void {
    if (debugModeEnabled() && stackTraceCollectionEnabled) {
      this.orderedTraces.push({ trace, seq: globalSeq++ });
    }
  }

  public [Symbol.iterator](): Iterator<A> {
    return this._set[Symbol.iterator]();
  }
}
