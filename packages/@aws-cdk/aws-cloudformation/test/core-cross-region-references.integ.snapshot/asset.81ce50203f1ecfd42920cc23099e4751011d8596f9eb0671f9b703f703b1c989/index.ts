/*eslint-disable no-console*/
/* eslint-disable import/no-extraneous-dependencies */
import { SSM } from 'aws-sdk';
const SSM_EXPORT_PATH = '/cdk/exports/';
type CrossRegionExports = { [exportName: string]: string };

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const props = event.ResourceProperties;
  const exports: CrossRegionExports = props.Exports;

  const ssm = new SSM({ region: props.Region });
  try {
    switch (event.RequestType) {
      case 'Create':
        console.info(`Creating new SSM Parameter exports in region ${props.Region}`);
        await putParameters(ssm, exports);
        return;
      case 'Update':
        console.info(`Reading existing SSM Parameter exports in region ${props.Region}`);
        const existing = await getExistingParameters(ssm);
        const paramsToDelete = returnMissing(existing, exports);
        console.info(`Deleting unused SSM Parameter exports in region ${props.Region}`);
        if (paramsToDelete.length > 0) {
          await ssm.deleteParameters({
            Names: paramsToDelete,
          }).promise();
        }
        console.info(`Creating new SSM Parameter exports in region ${props.Region}`);
        await putParameters(ssm, exports);
        return;
      case 'Delete':
        console.info(`Reading existing SSM Parameter exports in region ${props.Region}`);
        const existingParams = await getExistingParameters(ssm);
        console.info(`Deleting all SSM Parameter exports in region ${props.Region}`);
        await ssm.deleteParameters({
          Names: Array.from(Object.keys(existingParams)),
        }).promise();
        return;
      default:
        return;
    }
  } catch (e) {
    console.error('Error processing event: ', e);
    throw e;
  }
};

/**
 * Create parameters for existing exports
 */
async function putParameters(ssm: SSM, parameters: CrossRegionExports): Promise<void> {
  await Promise.all(Array.from(Object.entries(parameters), ([name, value]) => {
    return ssm.putParameter({
      Name: `${SSM_EXPORT_PATH}${name}`,
      Value: value,
      Type: 'String',
    }).promise();
  }));
}

function returnMissing(a: CrossRegionExports, b: CrossRegionExports): string[] {
  const missing: string[] = [];
  for (const name of Object.keys(a)) {
    if (!b.hasOwnProperty(name)) {
      missing.push(name);
    }
  }
  return missing;
}

/**
 * Get existing exports from SSM parameters
 */
async function getExistingParameters(ssm: SSM): Promise<CrossRegionExports> {
  const existingExports: CrossRegionExports = {};
  function recordParameters(parameters: SSM.ParameterList) {
    parameters.forEach(param => {
      if (param.Name && param.Value) {
        existingExports[param.Name] = param.Value;
      }
    });
  }
  const res = await ssm.getParametersByPath({
    Path: `${SSM_EXPORT_PATH}`,
  }).promise();
  recordParameters(res.Parameters ?? []);

  while (res.NextToken) {
    const nextRes = await ssm.getParametersByPath({
      Path: `${SSM_EXPORT_PATH}`,
      NextToken: res.NextToken,
    }).promise();
    recordParameters(nextRes.Parameters ?? []);
    res.NextToken = nextRes.NextToken;
  }
  return existingExports;
}

