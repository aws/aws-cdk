export interface ifElseOptions {
  readonly condition: string,
  readonly thenStatements: string[],
  readonly elseStatements?: string[]
}

export const ifElse = ({ condition, thenStatements, elseStatements }: ifElseOptions): string => {
  let statement = thenStatements.reduce((acc, ifTrue) => {
    return `${acc} ${ifTrue};`;
  }, `if ${condition}; then`);

  if (elseStatements) {
    statement = elseStatements.reduce((acc, ifFalse) => {
      return `${acc} ${ifFalse};`;
    }, `${statement} else`);
  }

  return `${statement} fi`;
};