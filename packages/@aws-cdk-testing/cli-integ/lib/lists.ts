export function chunk<A>(n: number, xs: A[]): A[][] {
  const ret = new Array<A[]>();

  for (let i = 0; i < xs.length; i += n) {
    ret.push(xs.slice(i, i + n));
  }

  return ret;
}