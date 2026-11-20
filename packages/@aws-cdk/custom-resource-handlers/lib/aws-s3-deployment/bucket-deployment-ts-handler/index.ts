/**
 * `Custom::CDKBucketDeployment` provider.
 *
 * A TypeScript reimplementation of the original Python provider, that used to mostly
 * wrap the functionality of `aws s3 sync`.
 */
import { randomUUID } from 'crypto';
import { CloudFront } from '@aws-sdk/client-cloudfront';
import { S3 } from '@aws-sdk/client-s3';
import { CloudFrontInvalidator } from './cloudfront';
import { parseRequest } from './request';
import { S3Deployment } from './s3';
import { makeHandler } from '../../nodejs-entrypoint';

/**
 * Perform a request.
 *
 * All of the decision-making lives in `parseRequest`, which turns the request into the
 * list of actions it implies. This function is only an interpreter for that list, so
 * adding a behavior means adding an action rather than another branch here.
 */
export async function onEvent(event: AWSLambda.CloudFormationCustomResourceEvent, context?: AWSLambda.Context) {
  const actions = parseRequest(event);

  const s3 = new S3Deployment(new S3({}));
  const data: Record<string, unknown> = {};
  let physicalResourceId: string | undefined;

  for (const action of actions) {
    switch (action.type) {
      case 'allocate-physical-id':
        physicalResourceId = `aws.cdk.s3deployment.${randomUUID()}`;
        break;

      case 'set-response-value':
        data[action.key] = action.value;
        break;

      case 'copy-sources': {
        const versionIds = await s3.copySources(action);
        if (action.reportVersionIdsAs) { data[action.reportVersionIdsAs] = versionIds; }
        break;
      }

      case 'delete-prefix':
        await s3.deletePrefixUnlessOwned(action.destination);
        break;

      case 'invalidate-cloudfront':
        await new CloudFrontInvalidator(new CloudFront({ maxAttempts: 10 })).invalidate({
          ...action,
          timeoutMs: (context?.getRemainingTimeInMillis() ?? 13 * 60_000) - 10_000,
        });
        break;

      default:
        throw new Error(`unrecognized action: ${JSON.stringify(exhaustive(action))}`);
    }
  }

  return {
    // Reporting no id relays the incoming one, which is what Update and Delete want.
    PhysicalResourceId: physicalResourceId,
    NoEcho: false,
    Data: data,
  };
}

/** Makes the compiler reject a new action variant that nothing handles. */
function exhaustive(action: never): never {
  return action;
}

export const handler = makeHandler(onEvent);
