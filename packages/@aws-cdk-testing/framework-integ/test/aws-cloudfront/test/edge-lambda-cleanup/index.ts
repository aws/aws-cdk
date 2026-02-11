// eslint-disable-next-line import/no-extraneous-dependencies
import { Lambda } from '@aws-sdk/client-lambda';

export async function handler(event: any): Promise<void> {
  console.log('Event:', JSON.stringify(event));

  if (event.RequestType !== 'Delete') {
    return;
  }

  const functionArns: string[] = event.ResourceProperties.FunctionArns;
  const maxRetries = 50; // ~14 min with 17s avg sleep
  const baseDelay = 10_000;

  for (const arn of functionArns) {
    // Extract region from ARN to support cross-region cleanup
    const arnRegion = arn.split(':')[3];
    const client = new Lambda({ region: arnRegion });

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await client.deleteFunction({ FunctionName: arn });
        console.log(`Deleted ${arn}`);
        break;
      } catch (err: any) {
        if (err.name === 'InvalidParameterValueException' && err.message?.includes('replicated function')) {
          const delay = baseDelay + Math.random() * 7_000;
          console.log(`Attempt ${attempt + 1}: replica still active for ${arn}, waiting ${Math.round(delay / 1000)}s...`);
          await new Promise(r => setTimeout(r, delay));
        } else if (err.name === 'ResourceNotFoundException') {
          console.log(`${arn} already deleted`);
          break;
        } else {
          throw err;
        }
      }
    }
  }
}
