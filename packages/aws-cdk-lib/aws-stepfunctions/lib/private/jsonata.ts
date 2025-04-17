export const isValidJsonataExpression = (expression: string) => /^{%(.*)%}$/.test(expression);

export const findJsonataExpressions = (value: any): Set<string> => {
  const recursive = (v: any): string[] => {
    if (typeof v === 'string' && isValidJsonataExpression(v)) {
      return [v];
    } else if (Array.isArray(v)) {
      return v.flatMap(recursive);
    } else if (typeof v === 'object') {
      return Object.values(v).flatMap(recursive);
    } else {
      return [];
    }
  };
  return new Set(recursive(value));
};
