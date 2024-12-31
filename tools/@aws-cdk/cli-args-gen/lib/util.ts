import { code, Expression } from '@cdklabs/typewriter';

export function generateDefault(type: string) {
  return type === 'array' ? [] : undefined;
}

export function lit(value: any): Expression {
  switch (value) {
    case undefined:
      return code.expr.UNDEFINED;
    case null:
      return code.expr.NULL;
    default:
      return code.expr.lit(value);
  }
}

