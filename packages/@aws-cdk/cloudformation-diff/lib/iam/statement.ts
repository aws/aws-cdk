import * as deepEqual from 'fast-deep-equal';
import { deepRemoveUndefined } from '../util';

export class Statement {
  /**
   * Statement ID
   */
  public readonly sid: string | undefined;

  /**
   * Statement effect
   */
  public readonly effect: Effect;

  /**
   * Resources
   */
  public readonly resources: Targets;

  /**
   * Principals
   */
  public readonly principals: Targets;

  /**
   * Actions
   */
  public readonly actions: Targets;

  /**
   * Object with conditions
   */
  public readonly condition?: any;

  private readonly serializedIntrinsic: string | undefined;

  constructor(statement: UnknownMap | string) {
    if (typeof statement === 'string') {
      this.sid = undefined;
      this.effect = Effect.Unknown;
      this.resources = new Targets({}, '', '');
      this.actions = new Targets({}, '', '');
      this.principals = new Targets({}, '', '');
      this.condition = undefined;
      this.serializedIntrinsic = statement;
    } else {
      this.sid = expectString(statement.Sid);
      this.effect = expectEffect(statement.Effect);
      this.resources = new Targets(statement, 'Resource', 'NotResource');
      this.actions = new Targets(statement, 'Action', 'NotAction');
      this.principals = new Targets(statement, 'Principal', 'NotPrincipal');
      this.condition = statement.Condition;
      this.serializedIntrinsic = undefined;
    }
  }

  /**
   * Whether this statement is equal to the other statement
   */
  public equal(other: Statement): boolean {
    return (this.sid === other.sid
      && this.effect === other.effect
      && this.serializedIntrinsic === other.serializedIntrinsic
      && this.resources.equal(other.resources)
      && this.actions.equal(other.actions)
      && this.principals.equal(other.principals)
      && deepEqual(this.condition, other.condition));
  }

  public render(): RenderedStatement {
    return this.serializedIntrinsic
      ? {
        resource: this.serializedIntrinsic,
        effect: '',
        action: '',
        principal: this.principals.render(), // these will be replaced by the call to replaceEmpty() from IamChanges
        condition: '',
      }
      : {
        resource: this.resources.render(),
        effect: this.effect,
        action: this.actions.render(),
        principal: this.principals.render(),
        condition: renderCondition(this.condition),
      };
  }

  /**
   * Return a machine-readable version of the changes.
   * This is only used in tests.
   *
   * @internal
   */
  public _toJson(): StatementJson {
    return this.serializedIntrinsic
      ? this.serializedIntrinsic
      : deepRemoveUndefined({
        sid: this.sid,
        effect: this.effect,
        resources: this.resources._toJson(),
        principals: this.principals._toJson(),
        actions: this.actions._toJson(),
        condition: this.condition,
      });
  }

  /**
   * Whether this is a negative statement
   *
   * A statement is negative if any of its targets are negative, inverted
   * if the Effect is Deny.
   */
  public get isNegativeStatement(): boolean {
    const notTarget = this.actions.not || this.principals.not || this.resources.not;
    return this.effect === Effect.Allow ? notTarget : !notTarget;
  }
}

export interface RenderedStatement {
  readonly resource: string;
  readonly effect: string;
  readonly action: string;
  readonly principal: string;
  readonly condition: string;
}

export interface StatementJson {
  sid?: string;
  effect: string;
  resources: TargetsJson;
  actions: TargetsJson;
  principals: TargetsJson;
  condition?: any;
}

export interface TargetsJson {
  not: boolean;
  values: string[];
}

/**
 * Parse a list of statements from undefined, a Statement, or a list of statements
 */
export function parseStatements(x: any): Statement[] {
  if (x === undefined) { x = []; }
  if (!Array.isArray(x)) { x = [x]; }
  return x.map((s: any) => new Statement(s));
}

/**
 * Parse a Statement from a Lambda::Permission object
 *
 * This is actually what Lambda adds to the policy document if you call AddPermission.
 */
export function parseLambdaPermission(x: any): Statement {
  // Construct a statement from
  const statement: any = {
    Effect: 'Allow',
    Action: x.Action,
    Resource: x.FunctionName,
  };

  if (x.Principal !== undefined) {
    if (x.Principal === '*') {
      // *
      statement.Principal = '*';
    } else if (/^\d{12}$/.test(x.Principal)) {
      // Account number
      statement.Principal = { AWS: `arn:aws:iam::${x.Principal}:root` };
    } else {
      // Assume it's a service principal
      // We might get this wrong vs. the previous one for tokens. Nothing to be done
      // about that. It's only for human readable consumption after all.
      statement.Principal = { Service: x.Principal };
    }
  }
  if (x.SourceArn !== undefined) {
    if (statement.Condition === undefined) { statement.Condition = {}; }
    statement.Condition.ArnLike = { 'AWS:SourceArn': x.SourceArn };
  }
  if (x.SourceAccount !== undefined) {
    if (statement.Condition === undefined) { statement.Condition = {}; }
    statement.Condition.StringEquals = { 'AWS:SourceAccount': x.SourceAccount };
  }
  if (x.EventSourceToken !== undefined) {
    if (statement.Condition === undefined) { statement.Condition = {}; }
    statement.Condition.StringEquals = { 'lambda:EventSourceToken': x.EventSourceToken };
  }

  return new Statement(statement);
}

/**
 * Targets for a field
 */
export class Targets {
  /**
   * The values of the targets
   */
  public readonly values: string[];

  /**
   * Whether positive or negative matchers
   */
  public readonly not: boolean;

  constructor(statement: UnknownMap, positiveKey: string, negativeKey: string) {
    if (negativeKey in statement) {
      this.values = forceListOfStrings(statement[negativeKey]);
      this.not = true;
    } else {
      this.values = forceListOfStrings(statement[positiveKey]);
      this.not = false;
    }
    this.values.sort();
  }

  public get empty() {
    return this.values.length === 0;
  }

  /**
   * Whether this set of targets is equal to the other set of targets
   */
  public equal(other: Targets) {
    return this.not === other.not && deepEqual(this.values.sort(), other.values.sort());
  }

  /**
   * If the current value set is empty, put this in it
   */
  public replaceEmpty(replacement: string) {
    if (this.empty) {
      this.values.push(replacement);
    }
  }

  /**
   * If the actions contains a '*', replace with this string.
   */
  public replaceStar(replacement: string) {
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] === '*') {
        this.values[i] = replacement;
      }
    }
    this.values.sort();
  }

  /**
   * Render into a summary table cell
   */
  public render(): string {
    return this.not
      ? this.values.map(s => `NOT ${s}`).join('\n')
      : this.values.join('\n');
  }

  /**
   * Return a machine-readable version of the changes.
   * This is only used in tests.
   *
   * @internal
   */
  public _toJson(): TargetsJson {
    return { not: this.not, values: this.values };
  }
}

type UnknownMap = {[key: string]: unknown};

export enum Effect {
  Unknown = 'Unknown',
  Allow = 'Allow',
  Deny = 'Deny',
}

function expectString(x: unknown): string | undefined {
  return typeof x === 'string' ? x : undefined;
}

function expectEffect(x: unknown): Effect {
  if (x === Effect.Allow || x === Effect.Deny) { return x as Effect; }
  return Effect.Unknown;
}

function forceListOfStrings(x: unknown): string[] {
  if (typeof x === 'string') { return [x]; }
  if (typeof x === 'undefined' || x === null) { return []; }

  if (Array.isArray(x)) {
    return x.map(e => forceListOfStrings(e).join(','));
  }

  if (typeof x === 'object' && x !== null) {
    const ret: string[] = [];
    for (const [key, value] of Object.entries(x)) {
      ret.push(...forceListOfStrings(value).map(s => `${key}:${s}`));
    }
    return ret;
  }

  return [`${x}`];
}

/**
 * Render the Condition column
 */
export function renderCondition(condition: any): string {
  if (!condition || Object.keys(condition).length === 0) { return ''; }
  const jsonRepresentation = JSON.stringify(condition, undefined, 2);

  // The JSON representation looks like this:
  //
  //  {
  //    "ArnLike": {
  //      "AWS:SourceArn": "${MyTopic86869434}"
  //    }
  //  }
  //
  // We can make it more compact without losing information by getting rid of the outermost braces
  // and the indentation.
  const lines = jsonRepresentation.split('\n');
  return lines.slice(1, lines.length - 1).map(s => s.substr(2)).join('\n');
}
