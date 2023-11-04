/* eslint-disable no-console */
import { Event } from '../../../../../../node_modules/aws-cdk-lib/aws-stepfunctions-tasks/lib/evaluate-expression';

function escapeRegex(x: string) {
  return x.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export async function handler(event: Event): Promise<any> {
  console.log('Event: %j', { ...event, ResponseURL: '...' });

  const expression = Object.entries(event.expressionAttributeValues)
    .reduce(
      (exp: string, [k, v]) => exp.replace(new RegExp(escapeRegex(k), 'g'), JSON.stringify(v)),
      event.expression,
    );
  console.log(`Expression: ${expression}`);

  // direct eval with bundler is not recommended - using indirect eval
  return [eval][0](expression);
}
