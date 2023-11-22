/* eslint-disable no-console */

/**
 * The event received by the Lambda function
 *
 * @internal
 */
export interface Event {
  /**
   * The expression to evaluate
   */
  readonly expression: string;

  /**
   * The expression attribute values
   */
  readonly expressionAttributeValues: { [key: string]: any };
}

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
