/**
 * Remove undefined values from a dictionary
 */
export function removeEmpty<T>(x: { [key: string]: (T | undefined | string) }): { [key: string]: string } {
    for (const key of Object.keys(x)) {
      if (!x[key]) {
        delete x[key];
      }
    }
    return x as any;
}
  