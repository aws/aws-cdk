import { stmt, expr, Statement } from '@cdklabs/typewriter';

/**
 * Insert a literal statement in the target code language
 */
export function directCodeStmt(code: string): Statement {
  return stmt.expr(expr.directCode(code));
}
