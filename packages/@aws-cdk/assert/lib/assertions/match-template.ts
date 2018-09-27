import cfnDiff = require('@aws-cdk/cloudformation-diff');
import { Assertion } from '../assertion';
import { StackInspector } from '../inspector';

export enum MatchStyle {
  /** Requires an exact match */
  EXACT = "exactly",
  /** Allows any change that does not cause a resource replacement */
  NO_REPLACES = "no replaces",
  /** Allows additions, but no updates */
  SUPERSET = "superset"
}

export function exactlyMatchTemplate(template: { [key: string]: any }) {
  return matchTemplate(template, MatchStyle.EXACT);
}

export function beASupersetOfTemplate(template: { [key: string]: any }) {
  return matchTemplate(template, MatchStyle.SUPERSET);
}

export function matchTemplate(template: { [key: string]: any },
                              matchStyle: MatchStyle = MatchStyle.EXACT): Assertion<StackInspector> {
  return new StackMatchesTemplateAssertion(template, matchStyle);
}

class StackMatchesTemplateAssertion extends Assertion<StackInspector> {
  constructor(private readonly template: { [key: string]: any },
              private readonly matchStyle: MatchStyle) {
    super();
  }

  public assertOrThrow(inspector: StackInspector) {
    if (!this.assertUsing(inspector)) {
      // The details have already been printed, so don't generate a huge error message
      throw new Error(`Template comparison produced unacceptable match`);
    }
  }

  public assertUsing(inspector: StackInspector): boolean {
    const diff = cfnDiff.diffTemplate(this.template, inspector.value);
    const acceptable = this.isDiffAcceptable(diff);
    if (!acceptable) {
      // Print the diff
      cfnDiff.formatDifferences(process.stderr, diff);

      // Print the actual template
      process.stdout.write('--------------------------------------------------------------------------------------\n');
      process.stdout.write(JSON.stringify(inspector.value, undefined, 2) + '\n');
    }

    return acceptable;
  }

  private isDiffAcceptable(diff: cfnDiff.TemplateDiff): boolean {
    switch (this.matchStyle) {
    case MatchStyle.EXACT:
      return diff.count === 0;
    case MatchStyle.NO_REPLACES:
      for (const key of Object.keys(diff.resources.changes)) {
        const change = diff.resources.changes[key]!;
        if (change.changeImpact === cfnDiff.ResourceImpact.MAY_REPLACE) { return false; }
        if (change.changeImpact === cfnDiff.ResourceImpact.WILL_REPLACE) { return false; }
      }
      return true;
    case MatchStyle.SUPERSET:
      for (const key of Object.keys(diff.resources.changes)) {
        const change = diff.resources.changes[key]!;
        return change.changeImpact === cfnDiff.ResourceImpact.WILL_CREATE;
      }
    }
    throw new Error(`Unsupported match style: ${this.matchStyle}`);
  }

  public get description(): string {
    return `template (${this.matchStyle}): ${JSON.stringify(this.template, null, 2)}`;
  }
}
