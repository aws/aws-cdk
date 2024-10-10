/**
 * Return the region that hosts the Route53 endpoint
 *
 * Route53 is a partitional service: the control plane lives in one particular region,
 * which is different for every partition.
 *
 * The SDK knows how to convert a "target region" to a "route53 endpoint", which
 * equates to a (potentially different) region. However, when we use STS
 * AssumeRole credentials, we must grab credentials that will work in that
 * region.
 *
 * By default, STS AssumeRole will call the STS endpoint for the same region
 * as the Lambda runs in. Normally, this is all good. However, when the AssumeRole
 * is used to assume a role in a different account A, the AssumeRole will fail if the
 * Lambda is executing in an an opt-in region R to which account A has not been opted in.
 *
 * To solve this, we will always AssumeRole in the same region as the Route53 call will
 * resolve to.
 */
export function route53Region(region: string) {
  const partitions = {
    'cn': 'cn-northwest-1',
    'us-gov': 'us-gov-west-1',
    'us-iso': 'us-iso-east-1',
    'us-isob': 'us-isob-east-1',
    'eu-isoe': 'eu-isoe-west-1',
    'us-isof': 'us-isof-south-1',
  };

  for (const [prefix, mainRegion] of Object.entries(partitions)) {
    if (region.startsWith(`${prefix}-`)) {
      return mainRegion;
    }
  }

  // Default for commercial partition
  return 'us-east-1';
}
