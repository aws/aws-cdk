import { Rule } from 'eslint';
import { matchIdentifier, matchMemberExpression } from '../private/type-checkers';
import { match } from '../private/match-ast';

/**
 * Get the programmer to acknowledge that `Promise.all()` is potentially dangerous.
 *
 * Since JavaScript is single-threaded, `Promise.all()` will only ever be used for
 * I/O-bound tasks. However, I/O-parallelism isn't free either. Every async I/O-performing
 * task launched will consume some FDs, and their amount is limited. If the amount
 * of promises launched is a function of the input the program runs on, the system
 * FDs might be exhausted. Some concurrency limit must be introduced.
 *
 * This linter rule exists to remind the programmer of that fact. It triggers
 * on every `Promise.all()` invocation and cannot be resolved; the only solution
 * is to think about it, and then silence this rule as proof that you thought about it.
 *
 * In summary, it's fine if:
 *
 * - The arguments to `Promise.all()` is a fixed set of promises; OR
 * - The arguments to `Promise.all()` is throttled by a mechanism like 'p-limit' or
 *   similar.
 *
 * (This check is currently only in the CDK repo; it can benefit all TypeScript repos,
 * we should introduce and publish a global lint rules package).
 */
export function create(context: Rule.RuleContext): Rule.NodeListener {
  return {
    CallExpression: node => {
      if (match(node.callee, matchMemberExpression({
        object: matchIdentifier('Promise'),
        property: matchIdentifier('all'),
      }))) {
        context.report({
          message: 'Ensure the number of awaited promises does not depend on program input, or their parallelism is limited using something like \'p-limit\' or similar. Acknowledge this message using \'// eslint-disable-next-line @aws-cdk/promiseall-no-unbounded-parallelism\'',
          node,
        });
      }
    },
  };
}
