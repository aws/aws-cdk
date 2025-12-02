/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import { SSM } from '@aws-sdk/client-ssm';

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const props = event.ResourceProperties;

  console.info(`Reading function ARN from SSM parameter ${props.ParameterName} in region ${props.Region}`);

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    const ssm = new SSM({ region: props.Region });
    const ssmParameter = await ssm.getParameter({ Name: props.ParameterName });
    console.info('Response: %j', ssmParameter);
    const functionArn = ssmParameter.Parameter?.Value ?? '';
    return {
      Data: {
        FunctionArn: functionArn,
      },
    };
  }
  return {};
}
