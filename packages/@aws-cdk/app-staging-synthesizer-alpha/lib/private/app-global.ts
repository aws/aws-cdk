import { App } from 'aws-cdk-lib/core';
import { IConstruct } from 'constructs';

/**
 * Hold an App-wide global variable
 *
 * This is a replacement for a `static` variable, but does the right thing in case people
 * instantiate multiple Apps in the same process space (for example, in unit tests or
 * people using `cli-lib` in advanced configurations).
 *
 * This class assumes that the global you're going to be storing is a mutable object.
 */
export class AppScopedGlobal<A> {
  private readonly map = new WeakMap<App, A>();

  constructor(private readonly factory: () => A) {
  }

  public for(ctr: IConstruct): A {
    const app = App.of(ctr);
    if (!App.isApp(app)) {
      throw new Error(`Construct ${ctr.node.path} must be part of an App`);
    }

    const existing = this.map.get(app);
    if (existing) {
      return existing;
    }
    const instance = this.factory();
    this.map.set(app, instance);
    return instance;
  }
}
