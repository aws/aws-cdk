interface SkippedSuite {
  legacy(reason?: string): void;

  modern(reason?: string): void;
}

interface Suite {
  readonly doesNotApply: SkippedSuite;

  legacy(fn: () => void): void;

  modern(fn: () => void): void;
}

// eslint-disable-next-line jest/no-export
export function behavior(name: string, cb: (suite: Suite) => void) {
  // 'describe()' adds a nice grouping in Jest
  describe(name, () => {

    const unwritten = new Set(['modern', 'legacy']);
    cb({
      legacy: (testFn) => {
        unwritten.delete('legacy');
        test('legacy', testFn);
      },
      modern: (testFn) => {
        unwritten.delete('modern');
        test('modern', testFn);
      },
      doesNotApply: {
        modern: (reason?: string) => {
          unwritten.delete('modern');

          if (reason != null) {
            // eslint-disable-next-line jest/no-disabled-tests
            test.skip(`modern - ${reason}`, () => {});
          }
        },

        legacy: (reason?: string) => {
          unwritten.delete('legacy');

          if (reason != null) {
            // eslint-disable-next-line jest/no-disabled-tests
            test.skip(`legacy - ${reason}`, () => {});
          }
        },
      },
    });

    for (const missing of unwritten) {
      test.todo(missing);
    }
  });
}
