interface Tests {
  readonly ignore: Tests;

  legacy(fn?: () => void): void;
  modern(fn?: () => void): void;
}

interface Test {
  run(): void;
}

class RunningTest implements Test {
  constructor(private readonly name: string, private readonly fn: () => void) {
  }

  run(): void {
    test(this.name, this.fn);
  }
}

class SkippedTest implements Test {
  constructor(private readonly name: string, private readonly fn: () => void) {
  }

  run(): void {
    /* eslint-disable jest/no-disabled-tests */
    test.skip(this.name, this.fn);
  }
}

class IgnoringSuite implements Tests {
  private readonly _tests: Map<string, Test> = new Map();

  constructor(private readonly name: string, private readonly delegate: RunningSuite) {
    for (const [category, test] of delegate.tests) {
      this._tests.set(category, test);
    }
  }

  get ignore(): Tests { return this; };

  legacy(_fn?: () => void): void {
    this.delegate.add('legacy', new SkippedTest(`${this.name} (legacy)`, () => {}));
  }

  modern(_fn?: () => void): void {
    this.delegate.add('modern', new SkippedTest(`${this.name} (modern)`, () => {}));
  }
}

class RunningSuite implements Tests {
  private readonly _tests: Map<string, Test> = new Map();

  constructor(private readonly name: string) {
  }

  legacy(fn?: () => void): void {
    if (fn != null) {
      this.add('legacy', new RunningTest(`${this.name} (legacy)`, fn));
    } else {
      throw new Error('You must provide a legacy test');
    }
  }

  modern(fn?: () => void): void {
    if (fn != null) {
      this.add('modern', new RunningTest(`${this.name} (modern)`, fn));
    } else {
      throw new Error('You must provide a modern test');
    }
  }

  add(name: string, test: Test) {
    this._tests.set(name, test);
  }

  get ignore(): Tests {
    return new IgnoringSuite(this.name, this);
  }

  get tests() { return this._tests; };
}

/* eslint-disable jest/no-export */
export function complianceSuite(name: string, fn: (cs: Tests) => void) {
  const allCategories = ['legacy', 'modern'];
  const suite = new RunningSuite(name);
  fn(suite);

  const tests = suite.tests;
  for (const category of allCategories) {
    if (tests.has(category) && tests.get(category) != null) {
      tests.get(category)!.run();
    } else {
      throw new Error(`No test provided for '${name} (${category})'. If you don't need this test, ignore it with:
      
      tests.ignore.${category}();
      `);
    }
  }
}
