declare module 'conventional-commits-parser' {
  function sync(commitMsg: string): Parsed;

  interface Parsed {
    readonly type: string | null;
    readonly scope: string | null;
    readonly subject: string | null;
    readonly header: string | null;
    readonly body: string | null;
    readonly footer: string | null;
    readonly notes: { title: string; text: string; }[];
  }
}