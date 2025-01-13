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

export function kebabToCamelCase(str: string): string {
  return str
    .split('-')
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('');
}

export function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
