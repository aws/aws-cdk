/* eslint-disable import/no-extraneous-dependencies */
/**
 * A Jest environment that buffers outputs to `console.log()` and only shows it for failing tests.
 */
import type { EnvironmentContext, JestEnvironment, JestEnvironmentConfig } from '@jest/environment';
import { Circus } from '@jest/types';
import { TestEnvironment as NodeEnvironment } from 'jest-environment-node';

interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info' | 'debug';
  message: string;
}

export default class TestEnvironment extends NodeEnvironment implements JestEnvironment<unknown> {
  private log = new Array<ConsoleMessage>();
  private originalConsole!: typeof console;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);

    // We need to set the event handler by assignment in the constructor,
    // because if we declare it as an async member TypeScript's type derivation
    // doesn't work properly.
    (this as JestEnvironment<unknown>).handleTestEvent = (async (event, _state) => {
      if (event.name === 'test_done' && event.test.errors.length > 0 && this.log.length > 0) {
        this.originalConsole.log(`[Console output] ${fullTestName(event.test)}\n`);
        for (const item of this.log) {
          this.originalConsole[item.type]('    ' + item.message);
        }
        this.originalConsole.log('\n');
      }

      if (event.name === 'test_done') {
        this.log = [];
      }
    }) satisfies Circus.EventHandler;
  }

  async setup() {
    await super.setup();

    this.log = [];
    this.originalConsole = console;

    this.global.console = {
      ...console,
      log: (message) => this.log.push({ type: 'log', message }),
      error: (message) => this.log.push({ type: 'error', message }),
      warn: (message) => this.log.push({ type: 'warn', message }),
      info: (message) => this.log.push({ type: 'info', message }),
      debug: (message) => this.log.push({ type: 'debug', message }),
    };
  }

  async teardown() {
    this.global.console = this.originalConsole;
    await super.teardown();
  }
}

// DescribeBlock is not exported from `@jest/types`, so we need to build the parts we are interested in
type TestDescription = PartialBy<Pick<Circus.TestEntry, 'name' | 'parent'>, 'parent'>;

// Utility type to make specific fields optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

function fullTestName(test: TestDescription) {
  let ret = test.name;
  while (test.parent != null && test.parent.name !== 'ROOT_DESCRIBE_BLOCK') {
    ret = test.parent.name + ' › ' + fullTestName;
    test = test.parent;
  }
  return ret;
}

