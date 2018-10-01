import api = require('@aws-cdk/cx-api');
import { Assertion } from './assertion';
import { not } from './assertion';
import { MatchStyle, matchTemplate } from './assertions/match-template';

export abstract class Inspector {
  public aroundAssert?: (cb: () => void) => any;

  constructor() {
    this.aroundAssert = undefined;
  }

  public to(assertion: Assertion<this>): any {
    return this.aroundAssert ? this.aroundAssert(() => this._to(assertion))
                 : this._to(assertion);
  }

  public notTo(assertion: Assertion<this>): any {
    return this.to(not(assertion));
  }

  abstract get value(): any;

  private _to(assertion: Assertion<this>): any {
    assertion.assertOrThrow(this);
  }
}

export class StackInspector extends Inspector {
  constructor(public readonly stack: api.SynthesizedStack) {
    super();
  }

  public at(path: string | string[]): StackPathInspector {
    const strPath = typeof path === 'string' ? path : path.join('/');
    return new StackPathInspector(this.stack, strPath);
  }

  public toMatch(template: { [key: string]: any }, matchStyle = MatchStyle.EXACT) {
    return this.to(matchTemplate(template, matchStyle));
  }

  public get value(): { [key: string]: any } {
    return this.stack.template;
  }
}

export class StackPathInspector extends Inspector {
  constructor(public readonly stack: api.SynthesizedStack, public readonly path: string) {
    super();
  }

  public get value(): { [key: string]: any } | undefined {
    const md = this.stack.metadata[`/${this.stack.name}${this.path}`];
    if (md === undefined) { return undefined; }
    const resourceMd = md.find(entry => entry.type === 'aws:cdk:logicalId');
    if (resourceMd === undefined) { return undefined; }
    const logicalId = resourceMd.data;
    return this.stack.template.Resources[logicalId];
  }
}
