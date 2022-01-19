import { IInput } from './input';

/**
 * Expression for events in Detector Model state
 * @see https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html
 */
export abstract class Expression {
  /**
   * Create a expression from the given string
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
   * Create a expression for get an input attribute as `$input.TemperatureInput.temperatures[2]`.
   */
  public static inputAttribute(input: IInput, path: string): Expression {
    return this.fromString(`$input.${input.inputName}.${path}`);
  }

  /**
   * Create a expression for the Equal operator
   */
  public static eq(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '==', right);
  }

  /**
   * Create a expression for the AND operator
   */
  public static and(left: Expression, right: Expression): Expression {
    return new BinaryOperationExpression(left, '&&', right);
  }

  constructor() {
  }

  /**
   * this is called to evaluate the expression
   */
  public abstract evaluate(): string;
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
    private readonly operater: string,
    private readonly right: Expression,
  ) {
    super();
  }

  public evaluate() {
    return `${this.left.evaluate()} ${this.operater} ${this.right.evaluate()}`;
  }
}
