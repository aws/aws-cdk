import { IInput } from './input';

/**
 * Expression for events in Detector Model state.
 * @see https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html
 */
export abstract class Expression {
  /**
   * Create a expression from the given string.
   */
  public static fromString(value: string): Expression {
    return new StringExpression(value);
  }

  /**
   * Create a expression for function `currentInput()`.
   * It is evaluated to true if the specified input message was received.
   */
  public static currentInput(input: IInput): Expression {
    return this.fromString(`currentInput("${input.inputName}")`);
  }

  /**
   * Create a expression for function `timeout("timer-name")`.
   * It is evaluated to true if the specified timer has elapsed.
   * You can define a timer only using the `setTimer` action.
   */
  public static timeout(timerName: string): Expression {
    return this.fromString(`timeout("${timerName}")`);
  }

  /**
   * Create a expression for get an input attribute as `$input.TemperatureInput.temperatures[2]`.
   */
  public static inputAttribute(input: IInput, path: string): Expression {
    return this.fromString(`$input.${input.inputName}.${path}`);
  }

  /**
   * Create a expression for the Addition operator.
   */
  public static add(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '+', right, 12);
  }

  /**
   * Create a expression for the Subtraction operator.
   */
  public static subtract(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '-', right, 12);
  }

  /**
   * Create a expression for the Division operator.
   */
  public static divide(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '/', right, 13);
  }

  /**
   * Create a expression for the Multiplication operator.
   */
  public static multiply(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '*', right, 13);
  }

  /**
   * Create a expression for the String Concatenation operator.
   */
  public static concat(left: Expression, right: Expression): Expression {
    return this.add(left, right);
  }

  /**
   * Create a expression for the Bitwise OR operator.
   */
  public static bitwiseOr(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '|', right, 6);
  }

  /**
   * Create a expression for the Bitwise AND operator.
   */
  public static bitwiseAnd(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '&', right, 8);
  }

  /**
   * Create a expression for the Bitwise XOR operator.
   */
  public static bitwiseXor(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '^', right, 7);
  }

  /**
   * Create a expression for the Equal operator.
   */
  public static eq(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '==', right, 9);
  }

  /**
   * Create a expression for the Not Equal operator.
   */
  public static neq(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '!=', right, 9);
  }

  /**
   * Create a expression for the Less Than operator.
   */
  public static lt(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '<', right, 10);
  }

  /**
   * Create a expression for the Less Than Or Equal operator.
   */
  public static lte(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '<=', right, 10);
  }

  /**
   * Create a expression for the Greater Than operator.
   */
  public static gt(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '>', right, 10);
  }

  /**
   * Create a expression for the Greater Than Or Equal operator.
   */
  public static gte(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '>=', right, 10);
  }

  /**
   * Create a expression for the AND operator.
   */
  public static and(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '&&', right, 5);
  }

  /**
   * Create a expression for the OR operator.
   */
  public static or(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '||', right, 4);
  }

  constructor() {
  }

  /**
   * This is called to evaluate the expression.
   *
   * @param parentPriority priority of the parent of this expression,
   *   used for determining whether or not to add parenthesis around the expression.
   *   This is intended to be set according to MDN rules, see
   *   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#table
   *   for details
   */
  public abstract evaluate(parentPriority?: number): string;
}

class StringExpression extends Expression {
  constructor(private readonly value: string) {
    super();
  }

  public evaluate() {
    return this.value;
  }
}

class BinaryOperationExpression extends Expression {
  constructor(
    private readonly left: Expression,
    private readonly operator: string,
    private readonly right: Expression,
    /**
     * Indicates the priority of the operator.
     * This is intended to be set according to MDN rules.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#table
     */
    private readonly priority: number,
  ) {
    super();
  }

  public evaluate(parentPriority?: number) {
    const expression = `${this.left.evaluate(this.priority)} ${this.operator} ${this.right.evaluate(this.priority)}`;
    return parentPriority === undefined || parentPriority <= this.priority
      ? expression
      : `(${expression})`;
  }
}
