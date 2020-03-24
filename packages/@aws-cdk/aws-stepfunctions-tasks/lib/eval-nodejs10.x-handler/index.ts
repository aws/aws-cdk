// tslint:disable:no-console no-eval
import { Event } from '../evaluate-expression';

export async function handler(event: Event): Promise<any> {
  console.log('Event: %j', event);

  const expression = Object.entries(event.expressionAttributeValues)
    .reduce(
      (exp, [k, v]) => exp.replace(k, JSON.stringify(v)),
      event.expression
    );
  console.log(`Expression: ${expression}`);

  return eval(expression);
}
