import type { ChangeObject } from 'diff';
import { diffLines } from 'diff';

expect.extend({
  toContainCode(actual: string, expected: string) {
    const ds = diffLines(actual, expected, {
      ignoreWhitespace: true,
    });

    // We expect to see only 'removed' lines at the edges (lines in the "actual"
    // we can't find in the "expected"). Then, what remains should match exactly.
    while (ds.length > 0 && !ds[0].added && ds[0].removed) {
      ds.splice(0, 1);
    }
    while (ds.length > 0 && !ds[ds.length - 1].added && ds[ds.length - 1].removed) {
      ds.splice(ds.length - 1, 1);
    }

    const ok = ds.every(d => !d.added && !d.removed);

    return {
      pass: ok,
      message: () => renderDiff(ds),
    };
  },
});

declare global {
  namespace jest {
    // Optionally, also as an Asymmetric Matcher
    interface Matchers<R> {
      toContainCode(expected: string): CustomMatcherResult;
    }
  }
}

function renderDiff(ds: ChangeObject<string>[]) {
  const ret = new Array<string>();
  for (const d of ds) {
    // Always ends with a `\n` we're not interested in
    let lines = d.value.slice(0, -1).split('\n');
    if (d.added) {
      lines = lines.map(x => `+${x}`);
    }
    if (d.removed) {
      lines = lines.map(x => `-${x}`);
    }
    ret.push(...lines);
  }
  return ret.join('\n');
}
