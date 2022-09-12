/*eslint-disable no-console*/
/* eslint-disable import/no-extraneous-dependencies */
import { CloudFormation } from 'aws-sdk';

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const props = event.ResourceProperties;
  console.info(`Reading CFN Stack exports in region ${props.Region}`);

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    const cfn = new CloudFormation({ region: props.Region });
    const exports = await cfn.listExports().promise();
    const values = exports.Exports?.reduce((prev: { [key: string]: string }, curr) => {
      if (curr.Name && curr.Value) {
        prev[curr.Name] = curr.Value;
      }
      return prev;
    }, {});
    console.info('Response: %j', values);
    return {
      Data: {
        ...values,
      },
    };
  }
  return;
};
