/* eslint-disable no-console */
import { Event } from '../evaluate-expression';

function escapeRegex(x: string) {
  return x.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export async function handler(event: Event): Promise<any> {
  console.log('Event: %j', { ...event, ResponseURL: '...' });

  const expression = Object.entries(event.expressionAttributeValues)
    .reduce(
      (exp: string, [k, v]) => {
        const whole = k === '$' || k === '$$' ? ' ' : '';
        return exp.replace(
          new RegExp(`${whole && '(?<=\\()'}${escapeRegex(k)}${whole && '(?=\\))'}`, 'g'),
          JSON.stringify(v),
        );
      },
      event.expression,
    );
  console.log(`Expression: ${expression}`);

  return eval(expression);
}
