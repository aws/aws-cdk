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
    const md = this.getPathMetadata();
    if (md === undefined) { return undefined; }
    const resourceMd = md.find(entry => entry.type === 'aws:cdk:logicalId');
    if (resourceMd === undefined) { return undefined; }
    const logicalId = resourceMd.data;
    return this.stack.template.Resources[logicalId];
  }

  /**
   * Return the metadata entry for the given stack and path
   *
   * Complicated slightly by the fact that the stack may or may not
   * have an "App" parent, whose id will appear in the metadata key
   * but there's no way to get the app's id otherwise.
   */
  private getPathMetadata() {
    for (const [mdKey, mdValue] of Object.entries(this.stack.metadata)) {
      // Looks like either:
      //   "/App/Stack/Resource/Path"
      //   "/Stack/Resource/Path"
      const parts = mdKey.split('/');

      if ((parts[1] === this.stack.name && ('/' + parts.slice(2).join('/')) === this.path)
        || (parts[2] === this.stack.name && ('/' + parts.slice(3).join('/')) === this.path)) {
          return mdValue;
      }
    }
    return undefined;
  }
}
