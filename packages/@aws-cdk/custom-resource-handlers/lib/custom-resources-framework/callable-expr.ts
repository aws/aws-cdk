/* eslint-disable import/no-extraneous-dependencies */
import { $E, Expression, IScope, ThingSymbol, expr } from '@cdklabs/typewriter';

/**
 * A class representing an expression proxy which builds a JavaScript object that
 * will mirror the JavaScript operations done to it in an expression tree.
 */
export class CallableExpr {
  /**
   * Creates a new CallableExpr that can be called with the specified name.
   */
  public static fromName(scope: IScope, name: string) {
    return new CallableExpr(scope, name);
  }

  private readonly expr: Expression;

  private constructor(readonly scope: IScope, private readonly name: string) {
    this.expr = $E(expr.sym(new ThingSymbol(name, scope)));
  }

  /**
   * Calls the expression proxy with the provided arguments.
   */
  public call(...args: Expression[]) {
    return this.expr.call(...args);
  }

  /**
   * The name of the expression proxy.
   */
  public toString() {
    return this.name;
  }
}
