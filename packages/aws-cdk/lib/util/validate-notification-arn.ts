/**
 * Validate SNS topic arn
 */
export function validateSnsTopicArn(arn: string): boolean {
  return /^arn:aws:sns:[a-z0-9\-]+:[0-9]+:[a-z0-9\-\_]+$/i.test(arn);
}
