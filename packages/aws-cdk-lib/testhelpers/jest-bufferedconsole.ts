/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-extraneous-dependencies */
/**
 * A Jest environment that buffers outputs to `console.log()` and only shows it for failing tests.
 */
import type { EnvironmentContext, JestEnvironment, JestEnvironmentConfig } from '@jest/environment';
import { Circus } from '@jest/types';
import { TestEnvironment as NodeEnvironment } from 'jest-environment-node';

interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info' | 'debug';
  args: any[];
}

export default class TestEnvironment extends NodeEnvironment implements JestEnvironment<unknown> {
  private log = new Array<ConsoleMessage>();

  private originalConsole!: typeof console;
  private originalStdoutWrite!: typeof process.stdout.write;
  private originalStderrWrite!: typeof process.stderr.write;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);

    // We need to set the event handler by assignment in the constructor,
    // because if we declare it as an async member TypeScript's type derivation
    // doesn't work properly.
    (this as JestEnvironment<unknown>).handleTestEvent = (async (event, _state) => {
      if (event.name === 'test_done' && event.test.errors.length > 0 && this.log.length > 0) {
        this.stopCapture();

        this.originalConsole.log(`[Console output] ${fullTestName(event.test)}\n`);
        for (const item of this.log) {
          this.originalConsole[item.type].apply(this.originalConsole, ['    ', ...item.args]);
        }
        this.originalConsole.log('\n');

        this.startCapture();
      }

      if (event.name === 'test_done') {
        this.log = [];
      }
    }) satisfies Circus.EventHandler;
  }

  async setup() {
    await super.setup();

    this.log = [];
    this.startCapture();
  }

  async teardown() {
    this.stopCapture();
    await super.teardown();
  }

  private startCapture() {
    this.originalConsole = console;
    this.originalStdoutWrite = process.stdout.write;
    this.originalStderrWrite = process.stderr.write;

    this.global.console = {
      ...console,
      log: (...args) => this.log.push({ type: 'log', args }),
      error: (...args) => this.log.push({ type: 'error', args }),
      warn: (...args) => this.log.push({ type: 'warn', args }),
      info: (...args) => this.log.push({ type: 'info', args }),
      debug: (...args) => this.log.push({ type: 'debug', args }),
    };

    const self = this;
    process.stdout.write = function (chunk: Buffer | string, enccb?: BufferEncoding | ((error?: Error | null) => void)): void {
      const encoding = typeof enccb === 'string' ? enccb : 'utf-8';
      const message = Buffer.isBuffer(chunk) ? chunk.toString(encoding) : chunk;
      self.log.push({ type: 'log', args: [message.replace(/\n$/, '')] });
      if (typeof enccb === 'function') {
        enccb();
      }
    } as any;
    process.stderr.write = function (chunk: Buffer | string, enccb?: BufferEncoding | ((error?: Error | null) => void)): void {
      const encoding = typeof enccb === 'string' ? enccb : 'utf-8';
      const message = Buffer.isBuffer(chunk) ? chunk.toString(encoding) : chunk;
      self.log.push({ type: 'error', args: [message.replace(/\n$/, '')] });
      if (typeof enccb === 'function') {
        enccb();
      }
    } as any;
  }

  private stopCapture() {
    this.global.console = this.originalConsole;
    process.stdout.write = this.originalStdoutWrite;
    process.stderr.write = this.originalStderrWrite;
  }
}

// DescribeBlock is not exported from `@jest/types`, so we need to build the parts we are interested in
type TestDescription = PartialBy<Pick<Circus.TestEntry, 'name' | 'parent'>, 'parent'>;

// Utility type to make specific fields optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

function fullTestName(test: TestDescription) {
  let ret = test.name;
  while (test.parent != null && test.parent.name !== 'ROOT_DESCRIBE_BLOCK') {
    ret = test.parent.name + ' › ' + ret;
    test = test.parent;
  }
  return ret;
}
