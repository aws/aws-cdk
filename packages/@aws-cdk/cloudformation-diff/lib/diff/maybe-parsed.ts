/**
 * A value that may or may not be parseable
 */
export type MaybeParsed<A> = Parsed<A> | UnparseableCfn;

export interface Parsed<A> {
  readonly type: 'parsed';
  readonly value: A;
}

export interface UnparseableCfn {
  readonly type: 'unparseable';
  readonly repr: string;
}

export function mkParsed<A>(value: A): Parsed<A> {
  return { type: 'parsed', value };
}

export function mkUnparseable(value: any): UnparseableCfn {
  return {
    type: 'unparseable',
    repr: typeof value === 'string' ? value : JSON.stringify(value),
  };
}
