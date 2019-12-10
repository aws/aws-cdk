import { resolveMap } from "./util";

export type IdFunc<A> = (x: A) => string;
export type DepFunc<A> = (x: A) => string[];
export type ExecFn<A, B> = (you: A, prev: Record<string, B>) => Promise<B>;

interface TopoOptions<A, B> {
  id: IdFunc<A>;
  deps: DepFunc<A>;
  exec: ExecFn<A, B>;
}

/**
 * Async toposort execution
 */
export async function executeTopo<A, B>(xs: A[], options: TopoOptions<A, B>): Promise<Record<string, B>> {
  const results: Record<string, Promise<B>> = {};
  const objMap: Record<string, A> = {};
  const allDeps: Record<string, string[]> = {};
  const remDeps: Record<string, string[]> = {};
  xs.forEach(x => {
    const id = options.id(x);
    objMap[id] = x;
    remDeps[id] = allDeps[id] = options.deps(x);
  });
  let remaining = Object.keys(objMap);

  while (remaining.length > 0) {
    const free = remaining.filter(r => remDeps[r].length === 0);
    if (free.length === 0) {
      throw new Error('Could not make progress');
    }

    for (const node of free) {
      if (results[node] !== undefined) {
        throw new Error('Oops');
      }

      results[node] = (async (pkgName: string): Promise<B> => {
        const prevPromises = pick(results, allDeps[pkgName]);
        const prev = await resolveMap(prevPromises);
        return await options.exec(objMap[pkgName], prev);
      })(node);
    }

    for (const [key, deps] of Object.entries(remDeps)) {
      remDeps[key] = deps.filter(d => !free.includes(d));
    }
    remaining = remaining.filter(d => !free.includes(d));
  }

  return await resolveMap(results);
}

function pick<A>(xs: Record<string, A>, keys: string[]): Record<string, A> {
  const ret: Record<string, A> = {};
  for (const key of keys) {
    ret[key] = xs[key];
  }
  return ret;
}