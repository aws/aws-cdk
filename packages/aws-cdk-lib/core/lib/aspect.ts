import { IConstruct } from 'constructs';

const ASPECTS_SYMBOL = Symbol.for('cdk-aspects');

/**
 * Represents an Aspect
 */
export interface IAspect {
  /**
   * All aspects can visit an IConstruct
   */
  visit(node: IConstruct): void;
}

/**
 * Aspects can be applied to CDK tree scopes and can operate on the tree before
 * synthesis.
 */
export class Aspects {
  /**
   * Returns the `Aspects` object associated with a construct scope.
   * @param scope The scope for which these aspects will apply.
   */
  public static of(scope: IConstruct): Aspects {
    let aspects = (scope as any)[ASPECTS_SYMBOL];
    if (!aspects) {
      aspects = new Aspects(scope);

      Object.defineProperty(scope, ASPECTS_SYMBOL, {
        value: aspects,
        configurable: false,
        enumerable: false,
      });
    }
    return aspects;
  }

  private readonly _scope: IConstruct;
  private readonly _aspects: IAspect[];
  private readonly _appliedAspects: AspectApplication[];

  private constructor(scope: IConstruct) {
    this._aspects = [];
    this._appliedAspects = [];
    this._scope = scope;
  }

  /**
   * Adds an aspect to apply this scope before synthesis.
   * @param aspect The aspect to add.
   */
  public add(aspect: IAspect, priority?: number) {
    this._aspects.push(aspect);
    this._appliedAspects.push(new AspectApplication(this._scope, aspect, priority ?? 600));
  }

  /**
   * The list of aspects which were directly applied on this scope.
   */
  public get all(): IAspect[] {
    return [...this._aspects];
  }

  /**
   * The list of aspects with priority which were directly applied on this scope.
   *
   * Also returns inherited Aspects of this node.
   */
  public get list(): AspectApplication[] {
    return this._appliedAspects;
  }
}

/**
 * Object respresenting an Aspect application. Stores the Aspect, the pointer to the construct it was applied
 * to, and the priority value of that Aspect.
 */
export class AspectApplication {
  public readonly construct: IConstruct;
  public readonly aspect: IAspect;
  private _priority: number;

  public constructor(construct: IConstruct, aspect: IAspect, priority: number) {
    this.construct = construct;
    this.aspect = aspect;
    this._priority = priority;
  }

  // Getter for priority
  public get priority(): number {
    return this._priority;
  }

  // Setter for priority
  private set priority(priority: number) {
    if (priority < 0) {
      throw new Error('Priority must be a non-negative number');
    }
    this._priority = priority;
  }

  // Method to change priority (uses the setter internally)
  public changePriority(priority: number): void {
    this.priority = priority;
  }
}